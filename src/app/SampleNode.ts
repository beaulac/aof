import { CyElementWrapper } from './CyElementWrapper';
import { AofSample } from './AofSample';
import { Edge } from './Edge';
import { determineBeatsUntilStop } from './Timing';

const DEFAULT_MAX_LEVEL = 10;

function randomColor() {
    let colorString = '#';
    for (let idx = 0; idx < 3; idx++) {
        let byteString = randomByte().toString(16);
        if (byteString.length < 2) {
            byteString = `0${byteString}`;
        }
        colorString += `${colorString}${byteString}`;
    }

    return colorString;
}

function randomByte() {
    return Math.round(Math.random() * 0xFF);
}

export class SampleNode extends CyElementWrapper {

    edges = {};
    currentLevel: number;

    constructor(public sample: AofSample, public maxLevel = DEFAULT_MAX_LEVEL, public startLevel = maxLevel / 2) {
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
                color: randomColor(),
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

    connectTo(otherNode, distance) {
        if (!this.edges[otherNode.id]) {
            this.edges[otherNode.id] = new Edge(this.id, otherNode.id, distance);
        }
    }
}


