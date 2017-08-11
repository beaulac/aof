import { AofSample } from '../../audio/AofSample';
import { extractTargetsFor } from './ElementTargets';
import { highlightElement, unhighlightElement } from './VisualStyle';

const missingNode = {
    id: () => 'MISSING_NODE',
    scratch: (_): any => {
    }
};

export class SampleRun {
    private sampleEventQueue = [];
    private initVolume = 0.5;

    constructor(private bfs,
                private tickLength) {
    }

    public STOP() {
        this.sampleEventQueue.forEach(queuedEvent => clearTimeout(queuedEvent));
    }

    highlightNextElement(cyElem) {
        const currentID = cyElem.id();

        // Continue on the BFS path:
        const extractedTargets = extractTargetsFor(this.bfs.path, currentID)
            , numberOfTargets = extractedTargets.numberOfTargets();

        const nextNodeStartMs = cyElem.scratch('nextNodeStart') * this.tickLength;

        const {edgeTargets, nodeTargets} = extractedTargets;
        for (let idx = 0; idx < numberOfTargets; idx++) {
            const edgeDelay = this.tickLength * edgeTargets[idx].data('length');
            this.sampleEventQueue.push(
                setTimeout(() => this.highlightNextElement(nodeTargets[idx]), edgeDelay + nextNodeStartMs)
            );
        }

        this.initializeElementSample(cyElem);

        if (extractedTargets.isLast) {
            console.info('DONE');
        } else if (extractedTargets.numberOfTargets() === 0) {
            console.debug('NO TARGETS');
        }
    };

    private msToPeakAndStop(cyElem) {
        const nodeStopBeats = ~~cyElem.scratch('nodeStop');
        const beatsToPeak = Math.floor(Math.random() * nodeStopBeats);
        const beatsToStop = nodeStopBeats - beatsToPeak;

        const msTotalDuration = nodeStopBeats * this.tickLength;
        const msToPeak = beatsToPeak * this.tickLength;
        const msToStopAfterPeak = beatsToStop * this.tickLength;

        return {msToPeak, msToStopAfterPeak, msTotalDuration};
    }

    private initializeElementSample(cyElem = missingNode) {
        const sample: AofSample = cyElem.scratch('sample');
        if (!sample) {
            console.warn(`Missing sample for ${(cyElem || missingNode).id()}`);
            return;
        }

        const {msToPeak, msToStopAfterPeak, msTotalDuration} = this.msToPeakAndStop(cyElem);

        sample.play(this.initVolume);
        highlightElement(cyElem);

        const startCrescendoToPeak = () => sample.fadeTo(1, msToPeak);
        const fadeOutAfterPeak = () => sample.fadeTo(0, msToStopAfterPeak);
        const stopAfterTotalDuration = () => {
            sample.stop();
            unhighlightElement(cyElem);
        };

        this.sampleEventQueue.push(
            setTimeout(startCrescendoToPeak, 0),
            setTimeout(fadeOutAfterPeak, msToPeak),
            setTimeout(stopAfterTotalDuration, msTotalDuration)
        );

        this.initVolume = Math.random() * this.initVolume;
    }
}
