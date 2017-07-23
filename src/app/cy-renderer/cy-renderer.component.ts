import { Component, OnDestroy, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeService } from '../node.service';
import { SampleNode } from '../SampleNode';
import { TICK_LENGTH_MS } from '../Timing';
import { VisualStyle, highlightElement, unhighlightElement } from '../VisualStyle';
import { ElementTargets } from '../ElementTargets';

@Component({
               selector: 'app-cy-renderer',
               templateUrl: './cy-renderer.component.html',
               styleUrls: ['./cy-renderer.component.css']
           })
export class CyRendererComponent implements OnInit, OnDestroy {
    CYTOSCAPE_TAG = 'cy';

    elements: Observable<SampleNode[]>;
    private elementSub: Subscription;

    layoutName = 'cose';

    cy: any;
    private cyContainer;

    currentLayout: any;

    nodesById = {};

    startEventQueue = [];

    constructor(private nodeService: NodeService) {
        this.elements = this.nodeService.trackNodes();
    }

    setupEventHandlers() {
        window.addEventListener('resize', () => this.cy.resize() && this.cy.fit());
        this.cy.nodes().on('click', event => this.startBfsFrom(event.target));
    }

    public STOP() {
        this.startEventQueue.forEach(queuedEvent => clearTimeout(queuedEvent));
        this.cy.elements().forEach(cyElem => {
            const sample = cyElem.scratch('sample');
            if (sample) {
                unhighlightElement(cyElem);
                sample.stop();
            }
        });
    }

    startBfsFrom(root) {
        let initVolume = 0.5;

        const initializeSample = sample => {
            sample.setVolume(initVolume);
            initVolume = Math.random() * initVolume;
            sample.play();
        };

        const bfs = this.cy.elements().bfs({
                                               root,
                                               visit: () => undefined,
                                               directed: false
                                           });

        const highlightNextElement = (cyElem) => {
            const currentID = cyElem.id();
            const sample = cyElem.scratch('sample');

            // Highlight & trigger:
            highlightElement(cyElem);

            initializeSample(sample);

            // Set callback to stop:
            const nodeStopBeats = cyElem.scratch('nodeStop');
            const beatsToPeak = Math.floor(Math.random() * nodeStopBeats);
            const beatsToStop = nodeStopBeats - beatsToPeak;

            const msToPeak = beatsToPeak * TICK_LENGTH_MS;

            sample.fadeTo(1, msToPeak);

            setTimeout(() => sample.fadeTo(0, beatsToStop * TICK_LENGTH_MS), msToPeak);

            const currentNodeStopDelay = nodeStopBeats * TICK_LENGTH_MS;

            setTimeout(() => {
                unhighlightElement(cyElem);
                sample.fadeTo(0, 20); // To prevent 'click' on stop.
                sample.stop();
            }, currentNodeStopDelay);

            // Continue on the BFS path:
            const extractedTargets = ElementTargets.extractTargetsFor(bfs.path, currentID);

            const numberOfTargets = extractedTargets.nodeTargets.length;
            console.log(
                'targets w/ ' + numberOfTargets + ' nodes and ' +
                extractedTargets.edgeTargets.length + ' edges'
            );

            if (extractedTargets.hasTargets()) {
                const edgeTargets = extractedTargets.edgeTargets;
                const nodeTargets = extractedTargets.nodeTargets;

                for (let idx = 0; idx < numberOfTargets; idx++) {
                    const edgeTarget = edgeTargets[idx];

                    const edgeDelay = TICK_LENGTH_MS * edgeTarget.data('length');
                    const nextNodeStart = cyElem.scratch('nextNodeStart') * TICK_LENGTH_MS;

                    const nodeTarget = nodeTargets[idx];
                    const targetSample = nodeTarget.scratch('sample');
                    targetSample.load();
                    this.startEventQueue.push(
                        setTimeout(() => highlightNextElement(nodeTargets[idx]), edgeDelay + nextNodeStart)
                    );
                }
            }
        };

        highlightNextElement(root);
    }

    ngOnInit() {
        this.cyContainer = document.getElementById(this.CYTOSCAPE_TAG);
        this.elementSub = this.elements.subscribe(newElements => this.updateCyjs(newElements));
    }

    ngOnDestroy() {
        this.elementSub && this.elementSub.unsubscribe();
    }

    private updateCyjs(elements) {
        console.log('* Cytoscape.js is rendering new network...');
        this.nodesById = _(elements).groupBy('id').mapValues(([node]) => node).value();
        const cyElements = _(elements).map(e => e.toCyElementJSON()).flatten().value();

        console.log(cyElements);


        this.cy = cytoscape({
                                boxSelectionEnabled: false,
                                container: this.cyContainer,
                                elements: cyElements,
                                style: VisualStyle
                            });

        this.initLayout();
        this.runLayout();
        this.setupEventHandlers();
    }

    private initLayout() {
        const layoutName = this.layoutName;

        const layoutOptions = {
            name: layoutName,
            animate: true,
            fit: true,
            padding: 50,
            maxSimulationTime: 1000,
            avoidOverlap: true,
            randomize: false,
            animationThreshold: 0,
            infinite: true,
            stiffness: 400,
            damping: 0.5,
            nodeRepulsion: node => { // TODO INVESTIGATE EDGE REPULSION
                return 100 * node.connectedEdges()
                                 .toArray()
                                 .reduce(((acc, e) => acc + e.data().length),
                                         0
                                 );
            },
            edgeLength: edge => edge.data().length * 2,
            nestingFactor: 0,
            edgeElasticity: edge => Math.pow(2, edge.data('length'))
        };

        this.currentLayout = this.cy.makeLayout(layoutOptions);
    }

    private runLayout() {
        this.currentLayout.run();
    }
}
