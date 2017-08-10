import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AofSample } from '../../audio/AofSample';
import { SamplesService } from '../../samples.service';
import { BRANCHING_PROBABILITY, countsPerType, Probabilities, PROBABILITY_TICK } from './node.probabilities';
import { SampleNode } from './SampleNode';

@Injectable()
export class NodeService {
    private samplesObs: Observable<AofSample[]>;

    private samplesByType: _.Dictionary<AofSample[]>;
    private probabilities: Probabilities;
    private totalProbability = 0;

    private maxPerType = countsPerType;
    private typeRatioCount = _(countsPerType).values().sum();

    private samplesSnapShot: AofSample[];

    /**
     * Available samples from server.
     * @type {number}
     */
    public sampleCount = 0;
    public totalNodeCount = 0;
    public branchingProbability = BRANCHING_PROBABILITY;
    public numTypes = Object.keys(countsPerType).length;

    private nodes$ = new ReplaySubject<SampleNode[]>(1);

    get nodes(): Observable<SampleNode[]> {
        return this.nodes$;
    }

    constructor(private samplesService: SamplesService) {
        this.samplesObs = this.samplesService.trackSamples();

        this.samplesObs.subscribe(samples => this.initializeSamples(samples));
    }

    public initializeSamples(samples: AofSample[]) {
        this.samplesSnapShot = samples;
        this.sampleCount = this.samplesSnapShot.length;
        this.totalNodeCount = this.sampleCount * 0.5;

        this.rebuildElements();
    }

    public rebuildElements() {
        this.samplesByType = this.trimSamplesByType(_.groupBy(this.samplesSnapShot, 'type'));

        this.probabilities = this.buildTypeProbabilities();
        this.totalProbability = _(this.probabilities).values().sum();

        this.buildElements();
    }

    public updateProbability(newProbability) {
        return this.branchingProbability = newProbability;
    }

    public updateTotalNodeCount(newNodeCount) {
        return this.totalNodeCount = newNodeCount;
    }

    public buildElements() {
        const allSamplesByType = _.cloneDeep(this.samplesByType);

        let currentRoot = this.buildRandomNode(allSamplesByType);
        const elements = [currentRoot];

        for (let idx = 1; idx < this.sampleCount; idx++) {
            const newNode = this.buildRandomNode(allSamplesByType);

            if (!newNode) {
                // console.warn('COULD NOT GET NODE');
                continue;
            }

            currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

            elements.push(newNode);

            if (Math.random() < this.branchingProbability) {
                currentRoot = newNode;
            }
        }

        return this.nodes$.next(elements);
    }

    private getTypeRatio(type: string): number {
        return this.maxPerType[type] / this.typeRatioCount;
    }

    private buildTypeProbabilities() {
        return _.mapValues(countsPerType, (maxOfType: number) => maxOfType / this.sampleCount);
    }

    private trimSamplesByType(groupedSamples: _.Dictionary<AofSample[]>) {
        return _.mapValues(groupedSamples, (samples, type) => _.sampleSize(samples, this.getCountForType(type)));
    }

    private getCountForType(type: string): number {
        console.debug(type + ':' + this.getTypeRatio(type) * this.totalNodeCount);
        return this.getTypeRatio(type) * this.totalNodeCount;
    }

    private randomSelection(samplesByType) {

        const selectedType = this.selectRandomType();

        const samplesOfType = samplesByType[selectedType];

        if (!samplesOfType) {
            console.warn(`Found no samples for ${selectedType}!`);
            return undefined;
        }

        let selectedNode: AofSample = samplesOfType.pop();

        if (!selectedNode) {
            const remainingSamples = _(samplesByType)
                .omitBy(samples => samples.length < 1)
                .values()
                .sample();

            if (remainingSamples) {
                selectedNode = (remainingSamples as AofSample[]).pop();
                console.warn(`Was going to get undefined for ${selectedType}, but recovered with ${selectedNode.type}`);
            } else {
                console.warn(`Was going to get undefined for ${selectedType}, and found no remaining types!`);
            }
        }

        this.updateProbabilities(selectedType);
        return selectedNode;
    }

    private updateProbabilities(selectedType) {
        for (const type of Object.keys(countsPerType)) {
            if (this.samplesByType[type].length < 1) {
                this.probabilities[type] = 0;
            } else {
                if (type === selectedType) {
                    this.probabilities[type] = 0.1; // TODO alex: Don't hardcode this
                } else {
                    this.probabilities[type] += PROBABILITY_TICK;
                }
            }
        }
    }

    private selectRandomType() {
        // Make random selection based on existing probabilities
        let type,
            randNumber = _.random(1, this.typeRatioCount);

        const remainingTypes = _.pickBy(countsPerType, (_count, type) => this.samplesByType[type].length > 0);

        for (type in remainingTypes) {
            randNumber -= countsPerType[type];
            if (randNumber <= 0) {
                console.debug(type);
                return type;
            }
        }
        return type;
    }

    private buildRandomNode(samples, sample = this.randomSelection(samples)) {
        if (sample) {
            return new SampleNode(sample);
        }
    }
}

function randomMultipleOfFourWeight() {
    return 4 + ((4 - 1) * Math.floor(Math.random() * 4));
}
