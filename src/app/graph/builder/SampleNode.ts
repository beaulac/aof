import { AofSample } from '../../audio/AofSample';
import { determineBeatsUntilStop } from '../Timing';
import { CyElementWrapper } from './CyElementWrapper';
import { Edge } from './Edge';

export class SampleNode extends CyElementWrapper {
    edges = {};
    currentLevel: number;

    constructor(public sample: AofSample) {
        super(sample.sampleName || Math.random().toString().substr(2, 4));
    }

    toCyElementJSON() {
        return [
            this.selfToCyElement(),
            ...Object.keys(this.edges).map(id => this.edges[id].toCyElementJSON())
        ];
    }

    selfToCyElement() {
        const nodeStopBeats = determineBeatsUntilStop();
        return {
            classes: this.sample.type,
            data: {group: 'nodes', id: this.id, level: this.currentLevel},
            scratch: {
                type: this.id,
                nodeStop: nodeStopBeats,
                fm: 'hi',
                nextNodeStart: nodeStopBeats / 4,
                sample: this.sample
            }
        };
    }

    connectTo(otherNode: SampleNode, distance: number) {
        if (!this.edges[otherNode.id]) {
            this.edges[otherNode.id] = new Edge(this.id, otherNode.id, distance);
        }
    }
}
