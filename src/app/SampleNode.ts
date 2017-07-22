import * as Howler from 'howler';

const DEFAULT_MAX_LEVEL = 10;
const DEFAULT_EDGE_WEIGHT = 1;

/**
 * @abstract
 */
export class CyElementWrapper {
    constructor(public id, public cyElement?) {
    }

    associateToCyElement(cyElement) {
        this.cyElement = cyElement;
    }

    toCyElementJSON(): any[] {
        return [
            {
                data: this
            }
        ];
    }
}

export class Edge extends CyElementWrapper {
    group = 'edges';

    constructor(public source, public target, public length = DEFAULT_EDGE_WEIGHT) {
        super(Math.random().toString().substr(4, 4));
    }
}

function randomColor() {
    let colorString = '#';
    for (let idx = 0; idx < 3; idx++) {
        let byteString = randomByte().toString(16);
        if (byteString.length < 2) {
            byteString = `0${byteString}`;
        }
        colorString = colorString.concat(byteString);
    }

    return colorString;
}

function randomByte() {
    return (Math.floor(Math.random() * (0xFF)));
}


function determineBeatsUntilStop() {
    return 32 + (Math.floor(Math.random() * 32) * 4);
}


class Sample {
    static AUDIO_SAMPLE_ROOT_PATH = '../../audio/';
    static DEFAULT_START_VOLUME = 0.5;

    private howlSound: Howl;
    public type: string;
    public file: string;

    constructor(filename) {
        if (filename && filename.length) {
            this.type = /_([^._\s]+)[\s.]+/.exec(filename)[1].toLowerCase();

            this.file = Sample.AUDIO_SAMPLE_ROOT_PATH + filename;

            this.howlSound = new Howler.Howl({
                                                 src: this.file,
                                                 loop: true,
                                                 volume: Sample.DEFAULT_START_VOLUME,
                                                 preload: true
                                             });
        } else {
            console.warn(`missing filename? ${filename}`);
        }
    }

    play() {
        this.howlSound.play();
        console.log(this.file + ' is now playing');
    }

    stop() {
        this.howlSound.stop();
        console.log(this.file + ' has stopped playing.');
    }

    setVolume(newVolume) {
        console.log(this.file + ' had its volume set to ' + newVolume);
        this.howlSound.volume(newVolume);
    }

    fadeTo(newVolume, lengthMs) {
        console.log(this.file + ' is fading to ' + newVolume);
        const sound = this.howlSound;
        sound.fade(sound.volume(), newVolume, lengthMs);
    }
}

export class SampleNode extends CyElementWrapper {
    public edges = new Map();

    public currentLevel: number;

    public sample: Sample;

    constructor(public filename, public maxLevel = DEFAULT_MAX_LEVEL, public startLevel = maxLevel / 2) {
        super(filename || Math.random().toString().substr(2, 4));

        this.currentLevel = this.startLevel;

        this.sample = new Sample(filename);
    }

    toCyElementJSON() {
        return [
            this.selfToCyElement(),
            ...Object.keys(this.edges).map(id => this.edges[id].toCyElementJSON())
        ];
    }

    selfToCyElement() {
        const nodeStopBeats = determineBeatsUntilStop();
        const type = this.sample.type;
        return {
            classes: type,
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


