import * as _ from 'lodash';
import { AofSample } from '../../audio/AofSample';
import { CyElementWrapper } from './CyElementWrapper';
import { Edge } from './Edge';
import { determineBeatsUntilStop } from '../Timing';

const DEFAULT_MAX_LEVEL = 10;

function randomColor() {
    return `#${_.times(3, randomByteStr).join('')}`;
}

function randomByteStr(): string {
    const byte = Math.round(Math.random() * 0xFF);
    const str = byte.toString(16);
    return (byte < 0xF0) ? `0${str}` : str;
}

export class SampleNode extends CyElementWrapper {
    edges = {};
    currentLevel: number;

    constructor(public sample: AofSample,
                public maxLevel = DEFAULT_MAX_LEVEL,
                public startLevel = maxLevel / 2) {
        super(sample.file || Math.random().toString().substr(2, 4));

        this.currentLevel = this.startLevel;
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

    trigger() {
        this.sample.play();
        console.log(`${this.id} was triggered`);
    }

    stop() {
        this.sample.stop();
        console.log(`${this.id} was stopped`);
    }

    connectTo(otherNode: SampleNode, distance: number) {
        if (!this.edges[otherNode.id]) {
            this.edges[otherNode.id] = new Edge(this.id, otherNode.id, distance);
        }
    }
}


