import * as cytoscape from 'cytoscape';
import * as cycola from 'cytoscape-cola';

cycola(cytoscape);

const LENGTH_SCALE = 2;
const lengthOf = edge => LENGTH_SCALE * edge.data('length');

export const colaLayout = {
    name: 'cola',
    animate: true,
    refresh: 3,

    infinite: true,
    fit: false,

    zoom: 0.5,
    // padding: 0,

    avoidOverlap: true,
    randomize: true,
    // animationThreshold: 0,
    // stiffness: 0,
    damping: 0.5,
    nodeSpacing: node => { // TODO INVESTIGATE EDGE REPULSION
        return LENGTH_SCALE * node.connectedEdges().toArray()
                                  .reduce(((acc, e) => acc + lengthOf(e)), 0);
    },
    edgeLength: lengthOf
};

export const buildColaLayout = (readyCb?, endCb?) => {
    return {
        name: 'cola',
        animate: true,
        refresh: 1,

        infinite: true,
        fit: false,

        // zoom: 0.5,
        maxSimulationTime: 4000,

        ungrabifyWhileSimulating: false,

        avoidOverlap: true,
        randomize: true,
        alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
        // animationThreshold: 0,
        nodeSpacing: node => { // TODO INVESTIGATE EDGE REPULSION
            return LENGTH_SCALE * node.connectedEdges().toArray()
                                      .reduce(((acc, e) => acc + lengthOf(e)), 0);
        },
        jaccardEdgeLength: undefined,
        edgeLength: lengthOf,
        ready: readyCb,
        stop: endCb
    };
};
