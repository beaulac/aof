export const BPM = 160;
export const TICK_LENGTH_MS = (60 / BPM) * 1000;

export function determineBeatsUntilStop() {
    return 32 + (Math.floor(Math.random() * 32) * 4);
}
