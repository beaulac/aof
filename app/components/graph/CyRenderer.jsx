/**
 * Created by alacasse on 9/19/16.
 */
import _ from "lodash";
import cytoscape from "cytoscape";
import cyspringy from "cytoscape-springy";
import React from 'react';
import springy from "springy";

// TODO: consolidate Cytoscape-dependent tags
const CYTOSCAPE_TAG = 'cy';

const BPM = 160;
const TICK_LENGTH_MS = (60 / BPM) * 1000;

const HIGHLIGHT_CLASS = 'highlighted';
const UNHIGHLIGHT_CLASS = 'unhighlighted';

export default class CyRenderer extends React.Component {

    static defaultProps = {
        tickLength: TICK_LENGTH_MS,
        renderOptions: {},
        elements: [],
        nodesById: {},
        layoutName: 'springy',
        highlightClass: 'highlighted',
        unhighlightClass: 'unhighlighted'
    };

    static NO_OP_BFS() {
    }

    updateCyjs() {
        console.log('* Cytoscape.js is rendering new network...');
        let visualStyle = this.props.visualStyle;
        let layoutName = this.props.layoutName;
        let elements = this.props.elements;

        let cyElements = elements.map(e => e.toCyElementJSON()).reduce((a, b) => a.concat(b));

        this.nodesById = _.groupBy(this.props.elements, 'id');

        // Is there not an easier way to collapse these group-by arrays? TODO look up unique groupBy
        for (let prop in this.nodesById) {
            if (this.nodesById.hasOwnProperty(prop)) {
                this.nodesById[prop] = this.nodesById[prop][0];
            }
        }


        //Register graph FDL plugin.
        cyspringy(cytoscape, springy);
        this.cy = cytoscape(
            Object.assign(
                this.props.renderOptions,
                {
                    boxSelectionEnabled: false,
                    container: document.getElementById(CYTOSCAPE_TAG), //Could be cached... but not a heavy operation.
                    elements: cyElements,
                    style: visualStyle
                })
        );


        let layout = this.cy.makeLayout({
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
            nodeRepulsion: function (node) { //TODO INVESTIGATE EDGE REPULSION
                let value = 100 * node.connectedEdges().toArray().reduce(((acc, e) => acc + e.data().length), 0);
                console.log(value);
                return value;
            },
            edgeLength: function (edge) {
                return edge.data().length * 2
            },
            nestingFactor: 0,
            edgeElasticity: function (edge) {
                return Math.pow(2, edge.data('length'));
            }
        });
        layout.run();

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        let cyNodes = this.cy.elements();

        if (cyNodes !== undefined) {
            let bfsFunctionFor = this.startBfsFrom.bind(this, cyNodes);

            cyNodes.filter((i, e) => e.isNode())
                .forEach(node => node.on(
                    'click',
                    function (event) {
                        let target = event.cyTarget;
                        bfsFunctionFor(target);
                    })
            );
        }
    }

    startBfsFrom(elements, root) {

        let bfs = elements.bfs(root, CyRenderer.NO_OP_BFS, false);
        console.log(bfs.path);

        //debugger;

        highlightNextElement(root);

        let targetExtractor = new ElementTargets()

        function highlightNextElement(cyElem) {
            let currentID = cyElem.id();
            let sample = cyElem.scratch('sample');

            //Highlight & trigger:
            cyElem.classes(HIGHLIGHT_CLASS);
            sample.play();

            //Set callback to stop:
            let currentNodeStop = cyElem.scratch('nodeStop') * TICK_LENGTH_MS;
            setTimeout(function () {
                CyRenderer.unhighlightElement(cyElem);
                sample.stop();
            }, currentNodeStop);

            //Continue on the BFS path:
            let extractedTargets = ElementTargets.extractTargetsFor(bfs.path, currentID);

            console.log(
                'targets w/ ' + extractedTargets.nodeTargets.length + ' nodes and ' +
                extractedTargets.edgeTargets.length + ' edges'
            );

            if (extractedTargets.hasTargets()) {
                let edgeTargets = extractedTargets.edgeTargets;
                let nodeTargets = extractedTargets.nodeTargets;

                for (let i = 0; i < edgeTargets.length; i++) {

                    let edgeTarget = edgeTargets[i];
                    let edgeDelay = TICK_LENGTH_MS * edgeTarget.data('length');

                    let nextNodeStart = cyElem.scratch('nextNodeStart') * TICK_LENGTH_MS;

                    setTimeout(function () {
                        highlightNextElement(nodeTargets[i]);
                    }, edgeDelay + nextNodeStart);


                }
            }
        }
    }

    static highlightElement(element) {
        element.classes(UNHIGHLIGHT_CLASS);
    }
    static unhighlightElement(element) {
        element.classes(UNHIGHLIGHT_CLASS);
    }

    componentDidMount() {
        this.updateCyjs();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.networkData.equals(this.props.networkData)) {
            console.log("Network unchanged, not updating cytoscapejs");
            return false;
        }
        console.log("Network changed, updating cytoscapejs");
        return true;
    }

    render() {
        //TODO Figure out dynamic sizing for Cytoscape div.
        return (
            <div className="bdtem-graph" style={{height: '100%'}}>
                <div id={CYTOSCAPE_TAG} style={{height: 800}}/>
            </div>
        );

    }

}

class ElementTargets {

    constructor(edges, nodes) {
        this.edgeTargets = edges;
        this.nodeTargets = nodes;
    }

    static extractTargetsFor(path, sourceId) {

        let targets = new ElementTargets([], []);
        let previousWasOutgoingEdge = false;


        //Start i from location of node in path?
        let i = path.toArray().findIndex(e => e.id() === sourceId);
        for (i; i < path.length; i++) {
            let elem = path[i];
            if (elem.isEdge() && ElementTargets.shouldBeEdgeTarget(elem, sourceId)) { //Is an outgoing edge from source.
                targets.addEdge(elem);
                previousWasOutgoingEdge = true;
            } else if (previousWasOutgoingEdge) { //Path is structured like E1, N1, E2, N2
                targets.addNode(elem);
                previousWasOutgoingEdge = false;
            }
        }

        return targets;
    }

    static shouldBeEdgeTarget(elem, sourceId) {
        return elem.source().id() === sourceId || elem.target().id() === sourceId;
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
