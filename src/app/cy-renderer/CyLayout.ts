const layoutName = 'cose';

const lengthOf = edge => edge.data('length');

export const CY_LAYOUT_OPTIONS = {
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
                         .reduce(((acc, e) => acc + lengthOf(e)), 0);
    },
    edgeLength: edge => lengthOf(edge) * 2,
    nestingFactor: 0,
    edgeElasticity: edge => Math.pow(2, lengthOf(edge))
};
