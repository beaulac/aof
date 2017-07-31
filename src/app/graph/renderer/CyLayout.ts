import * as cytoscape from 'cytoscape';
import * as cycola from 'cytoscape-cola';

const layoutName = 'cola';

cycola(cytoscape);

const lengthOf = edge => edge.data('length');

export const CY_LAYOUT_OPTIONS = {
    name: layoutName,
    animate: true,
    refresh: 1,
    fit: true,
    padding: 30,
    maxSimulationTime: 4000,
    avoidOverlap: true,
    randomize: true,
    animationThreshold: 0,
    infinite: false,
    stiffness: 400,
    damping: 0.5,
    nodeSpacing: node => { // TODO INVESTIGATE EDGE REPULSION
        return node.connectedEdges()
                   .toArray()
                   .reduce(((acc, e) => acc + lengthOf(e)), 0);
    },
    edgeLength: edge => lengthOf(edge),
    edgeJaccardLength: edge => lengthOf(edge),
    edgeSymDiffLength: edge => lengthOf(edge),
    edgeElasticity: edge => Math.pow(2, lengthOf(edge))
};
