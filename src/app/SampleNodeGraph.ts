import * as _ from 'lodash';
import { SampleNode } from './SampleNode';

const PROBABILITY_TICK = 0.1;
const BRANCHING_PROBABILITY = 0.9;
const BUILD_FIXED = false;
const DEF_SAMPLES: string[] = [];

const types = {
    'Beat': 5,
    'Bass': 3,
    'Element': 10,
    'Speech': 5,
    'Texture': 10
};

const fixedSamplesTree = {
    'A10_Speech.mp3': ['A14_Texture.mp3'],
    'A14_Texture.mp3': ['A2_Bass.mp3', 'F4_Beat.mp3'],
    'A2_Bass.mp3': ['A10_Speech.mp3'],
    'F4_Beat.mp3': []
};

export function buildFixedElements() {
    // Get list of provided samples
    const sampleNodes = [];
    for (const sample in fixedSamplesTree) {

        if (fixedSamplesTree.hasOwnProperty(sample)) {

            sampleNodes.push(buildRandomNode(sample));
        }
    }

    // Link all elements to their provided neighbors
    const samplesLength = sampleNodes.length;
    for (let idx = 0; idx < samplesLength; idx++) {

        const neighbors = fixedSamplesTree[sampleNodes[idx].filename];
        const neighborLength = neighbors.length;
        for (let j = 0; j < neighborLength; j++) {

            const newNeighbor = sampleNodes.find(element => element.filename === neighbors[j]);
            if (newNeighbor) {
                sampleNodes[idx].connectTo(newNeighbor, randomMultipleOfFourWeight());
            }
        }
    }

    return sampleNodes;
}

export function buildElements() {
    const samplesBytype = trimSamplesByType(samplesByType(DEF_SAMPLES));
    const sampleCount = countSamples(samplesBytype);

    // Init type probabilities
    const typeProbabilities = [];
    for (const type in types) {

        if (types.hasOwnProperty(type)) {

            const maxOfType = types[type];
            typeProbabilities[type] = maxOfType / sampleCount;
        }
    }

    let currentRoot = buildRandomNode(randomSelection(samplesBytype,
                                                      typeProbabilities
    ));
    const elements = [currentRoot];

    for (let idx = 1; idx < sampleCount; idx++) {

        const newNode = buildRandomNode(randomSelection(samplesBytype,
                                                        typeProbabilities
        ));

        currentRoot.connectTo(newNode, randomMultipleOfFourWeight());

        elements.push(newNode);

        if (Math.random() < BRANCHING_PROBABILITY) {
            currentRoot = newNode;
        }
    }

    return elements;
}

function samplesByType(samples: string[]): _.Dictionary<string[]> {
    const regex = /_([^._\s]+)[\s.]+/;

    return _.groupBy(samples, function sampleType(sampleName) {
        return regex.exec(sampleName)[1];
    });
}

function trimSamplesByType(groupedMap: _.Dictionary<string[]>) {

    for (const type in types) {

        if (types.hasOwnProperty(type)) {

            groupedMap[type] = _.shuffle(groupedMap[type]);

            let count = groupedMap[type].length;
            const maxOfType = types[type];

            while (count > maxOfType) {
                groupedMap[type].pop();
                --count;
            }

        }
    }

    console.log(groupedMap);
    return groupedMap;
}

function countSamples(groupedMap) {

    let count = 0;

    for (const type in types) {

        if (types.hasOwnProperty(type)) {
            count += groupedMap[type].length;
        }
    }

    return count;
}

function randomSelection(groupedMap, probabilities) {

    console.log(groupedMap);
    console.log(probabilities);


    const selectedType = selectRandomType(probabilities);
    const selectedNode = groupedMap[selectedType].pop();
    for (const type in types) {

        if (types.hasOwnProperty(type)) {

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

function selectRandomType(probabilities) {
    // Calculate total probability
    let totalProbability = 0;

    for (const type in types) {
        if (types.hasOwnProperty(type)) {
            totalProbability = totalProbability + probabilities[type];
        }
    }

    // Make random selection based on existing probabilities
    let randNumber = Math.random() * totalProbability;
    for (const type in types) {
        if (types.hasOwnProperty(type)) {
            if (randNumber <= probabilities[type]) {
                return type;
            }
            randNumber -= probabilities[type];
        }
    }
}

function buildRandomNode(sampleName) {
    return new SampleNode(sampleName, 10, 10);
}

function randomMultipleOfFourWeight() {
    return 4 + (4 * Math.floor(Math.random() * 3));
}

