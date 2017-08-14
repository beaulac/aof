import * as _ from 'lodash';

export interface Probabilities {
    [s: string]: number;
}

export const PROBABILITY_TICK = 0.1;
export const initialBranchingProbability = 0.9;
export const initialNodeCount = 50;

export const countsPerType: Probabilities = {
    'beat': 5,
    'bass': 3,
    'element': 10,
    'speech': 5,
    'texture': 10
};

export const numberOfTypes = Object.keys(countsPerType).length;

export const randomType = () => _.sample(Object.keys(countsPerType));

const total = _(countsPerType).values().sum();
export const weightsPerType: Probabilities = _.mapValues(countsPerType, count => count / total);
