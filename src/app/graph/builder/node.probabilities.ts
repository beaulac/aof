export interface Probabilities {
    [s: string]: number;
}

export const PROBABILITY_TICK = 0.1;
export const BRANCHING_PROBABILITY = 0.9;

export const countsPerType: Probabilities = {
    'beat': 5,
    'bass': 3,
    'element': 10,
    'speech': 5,
    'texture': 10
};
