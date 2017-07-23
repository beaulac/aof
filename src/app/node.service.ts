import * as _ from 'lodash';
import { SampleNode } from './SampleNode';
import { Injectable } from '@angular/core';
import { SamplesService } from './samples.service';
import { AofSample } from './AofSample';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


const PROBABILITY_TICK = 0.1;
const BRANCHING_PROBABILITY = 0.9;
const BUILD_FIXED = false;
const DEF_SAMPLES: string[] = [];

const countsPerType = {
    'beat': 5,
    'bass': 3,
    'element': 10,
    'speech': 5,
    'texture': 10
};

// const fixedSamplesTree = {
//     'A10_Speech.mp3': ['A14_Texture.mp3'],
//     'A14_Texture.mp3': ['A2_Bass.mp3', 'F4_Beat.mp3'],
//     'A2_Bass.mp3': ['A10_Speech.mp3'],
//     'F4_Beat.mp3': []
// };


@Injectable()
export class NodeService {

    private samples: Observable<AofSample[]>;

    private nodes = new ReplaySubject<SampleNode[]>(1);

    constructor(private samplesService: SamplesService) {
        this.samples = this.samplesService.trackSamples();

        this.samples.subscribe(samples => {
            this.nodes.next(this.buildElements(samples));
        });
    }

    trackNodes(): Observable<SampleNode[]> {
        return this.nodes;
    }

    // buildFixedElements() {
    //     // Get list of provided samples
    //     const sampleNodes: SampleNode[] = [];
    //     for (const sample of Object.keys(fixedSamplesTree)) {
    //         sampleNodes.push(this.buildRandomNode(sample));
    //     }
    //
    //     // Link all elements to their provided neighbors
    //     const samplesLength = sampleNodes.length;
    //     for (let idx = 0; idx < samplesLength; idx++) {
    //
    //         const neighbors = fixedSamplesTree[sampleNodes[idx].sample.file];
    //         const neighborLength = neighbors.length;
    //         for (let j = 0; j < neighborLength; j++) {
    //
    //             const newNeighbor = sampleNodes.find(node => node.sample.file === neighbors[j]);
    //             if (newNeighbor) {
    //                 sampleNodes[idx].connectTo(newNeighbor, randomMultipleOfFourWeight());
    //             }
    //         }
    //     }
    //
    //     return sampleNodes;
    // }

    private buildTypeProbabilities(sampleCount) {
        const typeProbabilities = [];
        for (const type in countsPerType) {
            if (countsPerType.hasOwnProperty(type)) {
                const maxOfType = countsPerType[type];
                typeProbabilities[type] = maxOfType / sampleCount;
            }
        }
        return typeProbabilities;
    }

    buildElements(samples: AofSample[]) {
        const samplesByType = this.trimSamplesByType(_.groupBy(samples, 'type'));
        const sampleCount = _(samplesByType).values().map('length').sum();

        const probabilities = this.buildTypeProbabilities(sampleCount);

        let currentRoot = this.buildRandomNode(this.randomSelection(samplesByType, probabilities));
        const elements = [currentRoot];

        for (let idx = 1; idx < sampleCount; idx++) {

            const newNode = this.buildRandomNode(this.randomSelection(samplesByType, probabilities));

            currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

            elements.push(newNode);

            if (Math.random() < BRANCHING_PROBABILITY) {
                currentRoot = newNode;
            }
        }

        return elements;
    }

    trimSamplesByType(groupedSamples: _.Dictionary<AofSample[]>) {
        return _.mapValues(groupedSamples, (samples, type) => _.sampleSize(samples, countsPerType[type]));
    }

    randomSelection(groupedMap, probabilities) {
        const selectedType = this.selectRandomType(probabilities);
        const selectedNode = groupedMap[selectedType].pop();
        for (const type in countsPerType) {

            if (countsPerType.hasOwnProperty(type)) {

                if (groupedMap[type].length > 0) {
                    if (type === selectedType) {
                        probabilities[type] = 0.1; // TODO alex: Don't hardcode this
                    }

                    probabilities[type] += PROBABILITY_TICK;
                } else {
                    probabilities[type] = 0;
                }
            }
        }

        return selectedNode;
    }

    selectRandomType(probabilities) {
        // Calculate total probability
        let totalProbability = 0;

        for (const type in countsPerType) {
            if (countsPerType.hasOwnProperty(type)) {
                totalProbability = totalProbability + probabilities[type];
            }
        }

        // Make random selection based on existing probabilities
        let randNumber = Math.random() * totalProbability;
        for (const type in countsPerType) {
            if (countsPerType.hasOwnProperty(type)) {
                if (randNumber <= probabilities[type]) {
                    return type;
                }
                randNumber -= probabilities[type];
            }
        }
    }

    buildRandomNode(sampleName) {
        return new SampleNode(sampleName, 10, 10);
    }
}

function randomMultipleOfFourWeight() {
    return 4 + (4 * Math.floor(Math.random() * 3));
}
