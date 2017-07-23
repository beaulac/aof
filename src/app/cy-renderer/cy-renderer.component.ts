import { Component, OnDestroy, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeService } from '../node.service';
import { SampleNode } from '../SampleNode';
import { TICK_LENGTH_MS } from '../Timing';
import { VisualStyle, highlightElement, unhighlightElement, resetElement } from '../VisualStyle';
import { ElementTargets } from '../ElementTargets';
import { CY_LAYOUT_OPTIONS } from './CyLayout';

@Component({
               selector: 'app-cy-renderer',
               templateUrl: './cy-renderer.component.html',
               styleUrls: ['./cy-renderer.component.css']
           })
export class CyRendererComponent implements OnInit, OnDestroy {
    CYTOSCAPE_TAG = 'cy';
    cy: any;
    private cyContainer;
    currentLayout: any;

    elements: Observable<SampleNode[]>;
    private elementSub: Subscription;
    startEventQueue = [];

    constructor(private nodeService: NodeService) {
        this.elements = this.nodeService.trackNodes();
    }

    public STOP() {
        this.startEventQueue.forEach(queuedEvent => clearTimeout(queuedEvent));
        this.cy.elements().forEach(cyElem => {
            const sample = cyElem.scratch('sample');
            if (sample) {
                resetElement(cyElem);
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
                const {edgeTargets, nodeTargets} = extractedTargets;

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
        this.elementSub = this.elements.subscribe(newElements => {
            this.updateCyjs(newElements);
        });
    }

    ngOnDestroy() {
        this.elementSub && this.elementSub.unsubscribe();
    }

    private updateCyjs(elements) {
        console.log('* Cytoscape.js is rendering new network...');

        const cyElements = _(elements).map(e => e.toCyElementJSON()).flatten().value();
        console.debug('Elements: ', cyElements);

        this.cy = cytoscape({
                                boxSelectionEnabled: false,
                                container: this.cyContainer,
                                elements: cyElements,
                                style: VisualStyle
                            });
        this.initLayout();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.cy.nodes().on('click', event => this.startBfsFrom(event.target));
        window.addEventListener('resize', () => this.cy.resize() && this.cy.fit());
    }

    private initLayout() {
        this.currentLayout = this.cy.makeLayout(CY_LAYOUT_OPTIONS);
        this.currentLayout.run();
    }
}
