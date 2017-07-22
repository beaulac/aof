import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as cytoscape from 'cytoscape';
import { DEF_VISUAL_STYLE } from '../VisualStyle';

const BPM = 160;
const TICK_LENGTH_MS = (60 / BPM) * 1000;

// Empty for now, can be used for debugging:
const BFS_VISIT_CALLBACK = () => {
};

const HIGHLIGHT_CLASS = 'highlighted'
    , UNHIGHLIGHT_CLASS = 'unhighlighted';

function isEdgeLinkedTo(edge, sourceId) {
    return edge.source().id() === sourceId || edge.target().id() === sourceId;
}

function highlightElement(element) {
    element.classes(HIGHLIGHT_CLASS);
}

function unhighlightElement(element) {
    element.classes(UNHIGHLIGHT_CLASS);
}

@Component({
               selector: 'app-cy-renderer',
               templateUrl: './cy-renderer.component.html',
               styleUrls: ['./cy-renderer.component.css']
           })
export class CyRendererComponent implements OnInit {
    CYTOSCAPE_TAG = 'cy';

    @Input()
    elements: any[];

    renderOptions = {};
    layoutName = 'cose';

    tickLength = TICK_LENGTH_MS;

    cy: any;

    currentLayout: any;

    nodesById = {};

    startEventQueue = [];

    constructor() {
    }

    updateCyjs() {
        console.log('* Cytoscape.js is rendering new network...');
        const cyElements = _.flattenDeep(this.elements.map(e => e.toCyElementJSON()));

        console.log(cyElements);

        this.nodesById = _.groupBy(this.elements, 'id');

        // Is there not an easier way to collapse these group-by arrays? TODO look up unique groupBy
        for (const prop in this.nodesById) {
            if (this.nodesById.hasOwnProperty(prop)) {
                this.nodesById[prop] = this.nodesById[prop][0];
            }
        }

        this.cy = cytoscape({
                                boxSelectionEnabled: false,
                                container: document.getElementById(this.CYTOSCAPE_TAG), // Could be cached... but not a heavy operation.
                                elements: cyElements,
                                style: DEF_VISUAL_STYLE
                            });

        this.initLayout();
        this.runLayout();
        this.setupEventHandlers();
    }

    initLayout() {
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

    runLayout() {
        this.currentLayout.run();
    }

    setupEventHandlers() {
        const cyNodes = (this.cy.elements() || []).filter((i, e) => e.isNode());
        cyNodes.forEach(node => node.on('click', event => this.startBfsFrom(cyNodes, event.cyTarget)));
    }

    STOP() {
        this.startEventQueue.forEach(queuedEvent => clearTimeout(queuedEvent));
        this.cy.elements().forEach(cyElem => {
            const sample = cyElem.scratch('sample');
            if (sample) {
                unhighlightElement(cyElem);
                sample.stop();
            }
        });
    }

    startBfsFrom(elements, root) {
        const bfs = elements.bfs(root, BFS_VISIT_CALLBACK, false);
        let initVolume = 0.5;

        highlightNextElement(root);

        function highlightNextElement(cyElem) {
            const currentID = cyElem.id();
            const sample = cyElem.scratch('sample');

            // Highlight & trigger:
            highlightElement(cyElem);

            sample.setVolume(initVolume);
            initVolume = Math.random() * initVolume;
            sample.play();

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
            // console.log(
            //    'targets w/ ' + numberOfTargets + ' nodes and ' +
            //    extractedTargets.edgeTargets.length + ' edges'
            // );

            if (extractedTargets.hasTargets()) {
                const edgeTargets = extractedTargets.edgeTargets;
                const nodeTargets = extractedTargets.nodeTargets;

                for (let idx = 0; idx < numberOfTargets; idx++) {

                    const edgeTarget = edgeTargets[idx];
                    const edgeDelay = TICK_LENGTH_MS * edgeTarget.data('length');

                    const nextNodeStart = cyElem.scratch('nextNodeStart') * TICK_LENGTH_MS;

                    this.startEventQueue.push(
                        setTimeout(() => highlightNextElement(nodeTargets[idx]), edgeDelay + nextNodeStart)
                    );
                }
            }
        }
    }

    ngOnInit() {
        this.updateCyjs();
    }
}


class ElementTargets {
    constructor(public edgeTargets, public nodeTargets) {
    }

    static extractTargetsFor(path, sourceId) {
        const targets = new ElementTargets([], []);

        let previousWasOutgoingEdge = false;
        let idx = path.toArray().findIndex(e => e.id() === sourceId); // Start i from location of node in path
        for (idx; idx < path.length; idx++) {
            const elem = path[idx];
            if (elem.isEdge() && isEdgeLinkedTo(elem, sourceId)) { // Is an outgoing edge from source.
                targets.addEdge(elem);
                previousWasOutgoingEdge = true;
            } else if (previousWasOutgoingEdge) { // Path is structured like E1, N1, E2, N2
                targets.addNode(elem);
                previousWasOutgoingEdge = false;
            }
        }
        return targets;
    }


    addEdge(edge) {
        this.edgeTargets.push(edge);
    }

    addNode(node) {
        this.nodeTargets.push(node);
    }

    hasTargets() {
        return this.edgeTargets.length > 0 && this.nodeTargets.length > 0;
    }
}
