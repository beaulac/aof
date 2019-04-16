import { _trace } from '../../trace';

function isEdgeLinkedTo(edge, sourceId) {
    return edge.isEdge() && edge.source().id() === sourceId || edge.target().id() === sourceId;
}

export function extractTargetsFor(path, sourceId) {
    return ElementTargets.extractTargetsFor(path, sourceId);
}

export class ElementTargets {
    public isLast = false;

    constructor(public edgeTargets = [],
                public nodeTargets = []) {
    }

    static extractTargetsFor(path, sourceId): ElementTargets {
        return new ElementTargets().extractTargetsFor(path.toArray(), sourceId);
    }

    extractTargetsFor(path, sourceId): this {
        let idx = path.findIndex(e => e.id() === sourceId), // Start i from location of node in path
            previousWasOutgoingEdge = false; // Path is structured like E1, N1, E2, N2

        this.isLast = idx === (path.length - 1);

        for (idx; idx < path.length; idx++) {
            const elem = path[idx];
            if (isEdgeLinkedTo(elem, sourceId)) {
                this.addEdge(elem);
                previousWasOutgoingEdge = true;
            } else if (previousWasOutgoingEdge) {
                this.addNode(elem);
                previousWasOutgoingEdge = false;
            }
        }
        return this;
    }

    numberOfTargets() {
        const {length: numNodes} = this.nodeTargets
            , {length: numEdges} = this.edgeTargets;

        _trace(`Nodes: ${this.nodeTargets.length}`, `Edges: ${this.edgeTargets.length}`);

        if (numEdges !== numNodes) {
            console.warn('Unequal number of edges and nodes?');
        }
        return numNodes;
    }

    addEdge(edge) {
        this.edgeTargets.push(edge);
    }

    addNode(node) {
        this.nodeTargets.push(node);
    }

    hasTargets() {
        return this.numberOfTargets() > 0;
    }
}
