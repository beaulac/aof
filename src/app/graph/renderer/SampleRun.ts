import { AofSample } from '../../audio/AofSample';
import { highlightElement, unhighlightElement } from '../../VisualStyle';
import { extractTargetsFor } from './ElementTargets';

const missingNode = {id: () => 'MISSING_NODE'};

export class SampleRun {
    private startEventQueue = [];
    private initVolume = 0.5;

    constructor(private bfs,
                private tickLength) {
    }

    public STOP() {
        this.startEventQueue.forEach(queuedEvent => clearTimeout(queuedEvent));
    }

    highlightNextElement(cyElem) {
        const currentID = cyElem.id();
        const sample = cyElem.scratch('sample');

        // Highlight & trigger:
        highlightElement(cyElem);

        this.initializeElementSample(cyElem);

        // Continue on the BFS path:
        const extractedTargets = extractTargetsFor(this.bfs.path, currentID)
            , numberOfTargets = extractedTargets.numberOfTargets();

        if (extractedTargets.numberOfTargets() > 0) {
            const {edgeTargets, nodeTargets} = extractedTargets;

            for (let idx = 0; idx < numberOfTargets; idx++) {
                const edgeTarget = edgeTargets[idx]
                    , nodeTarget = nodeTargets[idx];

                const targetSample = nodeTarget.scratch('sample');
                if (targetSample) {
                    const edgeDelay = this.tickLength * edgeTarget.data('length')
                        , nextNodeStart = cyElem.scratch('nextNodeStart') * this.tickLength;
                    this.startEventQueue.push(
                        setTimeout(() => this.highlightNextElement(nodeTargets[idx]), edgeDelay + nextNodeStart)
                    );
                } else {
                    console.warn(`Missing sample for ${(nodeTarget || missingNode).id()}`);
                }
            }
        } else if (extractedTargets.isLast) {
            console.debug('NO TARGETS');
        } else {
            console.info('DONE');
        }
    };

    private msToPeakAndStop(cyElem) {
        const nodeStopBeats = cyElem.scratch('nodeStop');
        const beatsToPeak = Math.floor(Math.random() * nodeStopBeats);
        const beatsToStop = nodeStopBeats - beatsToPeak;

        const msDuration = nodeStopBeats * this.tickLength;
        const msToPeak = beatsToPeak * this.tickLength;
        const msToStopAfterPeak = beatsToStop * this.tickLength;

        return {msToPeak, msToStopAfterPeak, msDuration};
    }

    private initializeElementSample(cyElem) {
        const sample: AofSample = cyElem.scratch('sample');
        const {msToPeak, msToStopAfterPeak, msDuration} = this.msToPeakAndStop(cyElem);

        sample.setVolume(this.initVolume);
        this.initVolume = Math.random() * this.initVolume;
        sample.play();


        sample.fadeTo(1, msToPeak);

        this.startEventQueue.push(
            setTimeout(() => sample.fadeTo(0, msToStopAfterPeak), msToPeak),
            setTimeout(() => {
                unhighlightElement(cyElem);
                sample.fadeTo(0, 20); // To prevent 'click' on stop.
                sample.stop();
            }, msDuration)
        );
    }
}
