import * as _ from 'lodash';
import { SampleNode } from './SampleNode';
import { Injectable } from '@angular/core';
import { SamplesService } from './samples.service';
import { AofSample } from './AofSample';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BRANCHING_PROBABILITY, countsPerType, Probabilities, PROBABILITY_TICK } from './node.probabilities';

@Injectable()
export class NodeService {
    private samplesObs: Observable<AofSample[]>;

    private samplesByType: _.Dictionary<AofSample[]>;
    private sampleCount = 0;
    private probabilities: Probabilities;
    private totalProbability = 0;
    public branchingProbability = BRANCHING_PROBABILITY;

    private nodes = new ReplaySubject<SampleNode[]>(1);

    constructor(private samplesService: SamplesService) {
        this.samplesObs = this.samplesService.trackSamples();

        this.samplesObs.subscribe(samples => {
            this.samplesByType = this.trimSamplesByType(_.groupBy(samples, 'type'));
            this.sampleCount = _(this.samplesByType).values().map('length').sum().valueOf();

            this.probabilities = this.buildTypeProbabilities();
            this.totalProbability = _(this.probabilities).values().sum();

            this.buildElements();
        });
    }

    public trackNodes(): Observable<SampleNode[]> {
        return this.nodes;
    }

    public updateProbability(newProbability) {
        this.branchingProbability = newProbability;
        console.log('rebuilding with branch prob: ', this.branchingProbability);
        this.buildElements();
    }

    private buildElements() {
        const allSamplesByType = _.cloneDeep(this.samplesByType);

        let currentRoot = this.buildRandomNode(allSamplesByType);
        const elements = [currentRoot];

        for (let idx = 1; idx < this.sampleCount; idx++) {
            const newNode = this.buildRandomNode(allSamplesByType);

            currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

            elements.push(newNode);

            console.log(this.branchingProbability);
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

    private randomSelection(samplesByType = this.samplesByType) {

        const selectedType = this.selectRandomType();

        const selectedNode = samplesByType[selectedType].pop();

        for (const type in countsPerType) {
            if (countsPerType.hasOwnProperty(type)) {
                if (samplesByType[type].length > 0) {
                    if (type === selectedType) {
                        this.probabilities[type] = 0.1; // TODO alex: Don't hardcode this
                    }

                    this.probabilities[type] += PROBABILITY_TICK;
                } else {
                    this.probabilities[type] = 0;
                }
            }
        }

        return selectedNode;
    }

    private selectRandomType() {
        // Make random selection based on existing probabilities
        let type,
            randNumber = Math.random() * this.totalProbability;

        for (type in countsPerType) {
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
        console.log(sample);
        return new SampleNode(sample, 10, 10);
    }
}

function randomMultipleOfFourWeight() {
    return 4 + (4 * Math.floor(Math.random() * 3));
}
