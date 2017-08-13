export const BPM = 160;
export const TICK_LENGTH_MS = (1 / BPM) * 60 * 1000;

// 8 Measures
const MINIMUM_BEATS = 32;
const MAX_ADDITIONAL_MEASURES = 32;

const BEATS_PER_MEASURE = 4;

export function determineBeatsUntilStop() {
    return MINIMUM_BEATS + (Math.floor(Math.random() * MAX_ADDITIONAL_MEASURES) * BEATS_PER_MEASURE);
}
