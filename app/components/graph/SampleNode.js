import Howler from 'howler'


/**
 * @abstract
 */
export class CyElementWrapper {
    static DEFAULT_MAX_LEVEL = 5;

    constructor(id) {
        this.id = id;
        this.cyElement = undefined; // Needs to be injected once cy has been initialized
    }

    associateToCyElement(cyElement) {
        this.cyElement = cyElement;
    }

    toCyElementJSON() {
        return {data: this};
    }
}

const DEFAULT_MAX_LEVEL = 10;
const DEFAULT_EDGE_WEIGHT = 1;


class Sample {

    static AUDIO_SAMPLE_ROOT_PATH = '../../audio/';

    constructor(filename) {
        this.file = Sample.AUDIO_SAMPLE_ROOT_PATH + filename;

        this.howlSound = new Howler.Howl({
            src: this.file,
            loop: true,
            volume: 0.5,
            preload: true
        });

    }

    play() {
        this.howlSound.play();
        console.log(this.file + " is now playing");
    }

    stop() {
        this.howlSound.stop();
        console.log(this.file + " has stopped playing.");
    }

    setVolume(newVolume) {
        console.log(this.file + " had its volume set to ");
        this.howlSound.volume(newVolume);
    }

}

export default class SampleNode extends CyElementWrapper {

    constructor(sampleFilename, maxLevel, startLevel) {
        super(sampleFilename || Math.random().toString().substr(2, 4));
        this.edges = new Map();

        this.maxLevel = maxLevel || DEFAULT_MAX_LEVEL;
        this.startLevel = startLevel || maxLevel / 2;

        this.currentLevel = this.startLevel;

        this.sample = new Sample(sampleFilename);
    }

    toCyElementJSON() {
        let elements = [...this.edges.values()].map(edge => edge.toCyElementJSON());
        elements.push(this.selfToCyElement());
        return elements;
    }

    selfToCyElement() {
        let nodeStopBeats = SampleNode.determineBeatsUntilStop();
        return {
            data: {id: this.id, level: this.currentLevel},
            scratch: {
                type: this.id.match(/_([^_\d.]+)[.]/)[1],
                nodeStop: nodeStopBeats,
                color: SampleNode.randomColor(),
                fm: 'hi',
                nextNodeStart: nodeStopBeats / 4,
                sample: this.sample
            }
        }
    }

    static randomColor() {
        var colorString = '#';
        for (var i = 0; i < 3; i++) {
            var byteString = SampleNode.randomByte().toString(16);
            if (byteString.length < 2) {
                byteString = '0' + byteString;
            }
            colorString = colorString.concat(byteString);
        }

        return colorString;
    }

    static randomByte() {
        return (Math.floor(Math.random() * (0xFF)));
    }



    static determineBeatsUntilStop() {
        return 32 + (Math.floor(Math.random() * 32) * 4)
    }

    trigger() {
        this.sample.play();
        console.log(this.id + ' was triggered');
    }

    stop() {
        this.sample.stop();
        console.log(this.id + ' was stopped');
    }

    connectTo(otherNode, distance) {
        if (!this.edges.has(otherNode.id)) {
            this.edges.set(otherNode.id, new Edge(this.id, otherNode.id, distance));
        }
    }

}


export class Edge extends CyElementWrapper {

    constructor(source, target, weight) {
        super(Math.random().toString().substr(4, 4));
        this.group = 'edges';
        this.length = weight;
        this.source = source;
        this.target = target;
    }

}