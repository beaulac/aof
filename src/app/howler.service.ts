import * as Howler from 'howler';
import { Injectable } from '@angular/core';


const DEFAULT_START_VOLUME = 0.5;
const DEFAULT_HOWL_OPTIONS = {
    loop: true,
    volume: DEFAULT_START_VOLUME,
    preload: true
};

@Injectable()
export class HowlerService {

    options = DEFAULT_HOWL_OPTIONS;

    constructor() {
    }

    updateOptions(newOptions) {
        this.options = Object.assign(DEFAULT_HOWL_OPTIONS, newOptions);
    }

    buildHowlSound(src, options = DEFAULT_HOWL_OPTIONS) {
        return new Howler.Howl(Object.assign(this.options, {src}));
    }
}
