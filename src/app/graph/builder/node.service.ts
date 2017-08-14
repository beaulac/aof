import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AofSample } from '../../audio/AofSample';
import { SamplesService } from '../../samples.service';
import {
    initialBranchingProbability,
    initialNodeCount,
    numberOfTypes,
    Probabilities,
    randomType,
    weightsPerType
} from './node.probabilities';
import { SampleNode } from './SampleNode';

@Injectable()
export class NodeService {
    private nodes$ = new ReplaySubject<SampleNode[]>(1);

    get nodes(): Observable<SampleNode[]> {
        return this.nodes$;
    }

    /**
     * Available samples from server.
     * @type {number}
     */
    public sampleCount = 0;
    private samplesSnapshot: AofSample[] = [];
    private weightedCountsByType: Probabilities;

    private get samplesByType(): _.Dictionary<AofSample[]> {
        return _.groupBy(this.samplesSnapshot, 'type');
    }

    /**
     * Currently in-use nodes:
     * @type {number}
     */
    public nodeCount = 0;
    /**
     *
     */
    private currentSamples: AofSample[];
    public branchingProbability = initialBranchingProbability;

    public numTypes = numberOfTypes;

    constructor(private samplesService: SamplesService) {
        this.samplesService.trackSamples().subscribe(samples => this.initializeSamples(samples));
    }

    public updateProbability(newProbability) {
        return this.branchingProbability = newProbability;
    }

    public updateTotalNodeCount(newNodeCount) {
        return this.nodeCount = newNodeCount;
    }

    public stopAllSamples() {
        for (let i = this.sampleCount - 1; i >= 0; i--) {
            this.samplesSnapshot[i].stop();
        }
    }

    public selectSamples() {
        this.buildWeightedCounts();

        this.currentSamples = _(this.samplesByType)
            .transform(
                (acc: AofSample[], samples: AofSample[], type: string) => {
                    const sampleNodes = _.sampleSize(samples, this.weightedCountsByType[type] || 0);
                    acc.push(...sampleNodes);

                    return acc;
                }, [])
            .flatten()
            .shuffle()
            .value() as AofSample[];

        this.assembleNodesFromSamples();
    }

    private buildWeightedCounts() {
        this.weightedCountsByType = _.mapValues(
            weightsPerType, // Minimum 1 per type:
            weight => Math.max(1, Math.round(weight * this.nodeCount))
        );

        // Ugly way of reconciliating weighted counts with requested node count:
        // Would be nice to make this fair, i.e. type with most/least gets reduced/increased, respectively.
        let weightedCount = _(this.weightedCountsByType).values().sum();
        while (weightedCount < this.nodeCount) {
            ++this.weightedCountsByType[randomType()];
            ++weightedCount;
        }
        while (weightedCount > this.nodeCount) {
            --this.weightedCountsByType[randomType()];
            --weightedCount;
        }
    }

    private assembleNodesFromSamples() {
        const currentNodes = this.currentSamples.map(sample => new SampleNode(sample));

        let [currentRoot] = currentNodes;

        for (let idx = 1; idx < currentNodes.length; idx++) {
            const newNode = currentNodes[idx];

            currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

            if (Math.random() < this.branchingProbability) {
                currentRoot = newNode;
            }
        }

        return this.nodes$.next(currentNodes);
    }

    private initializeSamples(samples: AofSample[]) {
        this.samplesSnapshot = samples;
        this.sampleCount = this.samplesSnapshot.length;

        this.nodeCount = Math.min(initialNodeCount, this.sampleCount);

        this.selectSamples();
    }
}

function randomMultipleOfFourWeight() {
    return 4 + ((4 - 1) * Math.floor(Math.random() * 4));
}
