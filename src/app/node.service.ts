import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AofSample } from './AofSample';
import { BRANCHING_PROBABILITY, countsPerType, Probabilities, PROBABILITY_TICK } from './node.probabilities';
import { SampleNode } from './SampleNode';
import { SamplesService } from './samples.service';

@Injectable()
export class NodeService {
    private samplesObs: Observable<AofSample[]>;

    private samplesByType: _.Dictionary<AofSample[]>;
    private probabilities: Probabilities;
    private totalProbability = 0;
    public sampleCount = 0;


    private maxPerType = countsPerType;
    private typeRatioCount = _(countsPerType).values().sum();

    public totalNodeCount = 0;
    public branchingProbability = BRANCHING_PROBABILITY;

    private nodes = new ReplaySubject<SampleNode[]>(1);

    constructor(private samplesService: SamplesService) {
        this.samplesObs = this.samplesService.trackSamples();

        this.samplesObs.subscribe(samples => {
            this.samplesByType = this.trimSamplesByType(_.groupBy(samples, 'type'));
            this.sampleCount = this.totalNodeCount = _(this.samplesByType).values().map('length').sum().valueOf();

            this.probabilities = this.buildTypeProbabilities();
            this.totalProbability = _(this.probabilities).values().sum();

            this.buildElements();
        });
    }

    public trackNodes(): Observable<SampleNode[]> {
        return this.nodes;
    }

    private getTypeRatio(type: string) {
        return this.maxPerType[type] / this.typeRatioCount;
    }

    public updateProbability(newProbability) {
        return this.branchingProbability = newProbability;
    }

    public buildElements() {
        const allSamplesByType = _.cloneDeep(this.samplesByType);

        let currentRoot = this.buildRandomNode(allSamplesByType);
        const elements = [currentRoot];

        for (let idx = 1; idx < this.sampleCount; idx++) {
            const newNode = this.buildRandomNode(allSamplesByType);

            if (!newNode) {
                console.warn('COULD NOT GET NODE');
                continue;
            }

            currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

            elements.push(newNode);

            if (Math.random() < this.branchingProbability) {
                currentRoot = newNode;
            }
        }

        return this.nodes.next(elements);
    }

    private buildTypeProbabilities() {
        return _.mapValues(countsPerType, (maxOfType: number) => maxOfType / this.sampleCount);
    }

    private trimSamplesByType(groupedSamples: _.Dictionary<AofSample[]>) {
        return _.mapValues(groupedSamples, (samples, type) => _.sampleSize(samples, countsPerType[type]));
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
            const [remainingSamples] = _(samplesByType)
                .omitBy(samples => samples.length < 1)
                .values()
                .value();

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
            randNumber = Math.random() * this.totalProbability;

        const remainingTypes = _.pickBy(countsPerType, (_count, type) => this.samplesByType[type].length > 0);

        for (type in remainingTypes) {
            if (countsPerType.hasOwnProperty(type)) {
                if (randNumber <= this.probabilities[type]) {
                    return type;
                }
                randNumber -= this.probabilities[type];
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
    return 4 + (4 * Math.floor(Math.random() * 3));
}
