function isEdgeLinkedTo(edge, sourceId) {
    return edge.source().id() === sourceId || edge.target().id() === sourceId;
}

export class ElementTargets {
    constructor(public edgeTargets, public nodeTargets) {
    }

    static extractTargetsFor(path, sourceId) {
        const targets = new ElementTargets([], []);

        console.log(path, sourceId);

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
