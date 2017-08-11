import { Injectable } from '@angular/core';
import * as Howler from 'howler';


const DEFAULT_START_VOLUME = 0.5;
const DEFAULT_HOWL_OPTIONS = {
    loop: true,
    volume: DEFAULT_START_VOLUME,
    preload: false,
    format: 'mp3'
};

@Injectable()
export class HowlerService {
    options = DEFAULT_HOWL_OPTIONS;

    get volume() {
        return Howler.Howler.volume();
    }

    set volume(volume: number) {
        Howler.Howler.volume(volume);
    }

    backgroundNoise: Howl;

    constructor() {
        this.backgroundNoise = new Howler.Howl({
                                                   src: ['assets/audio/recall_long2.ogg'],
                                                   html5: true,
                                                   preload: true,
                                                   loop: true,
                                                   volume: 0
                                               });
        this.backgroundNoise.once(
            'load',
            () => {
                this.backgroundNoise.play();
                this.backgroundNoise.fade(0, 1, 1000);
            }
        );
    }

    mute(muted: boolean) {
        return Howler.Howler.mute(muted);
    }

    updateOptions(newOptions) {
        this.options = Object.assign(DEFAULT_HOWL_OPTIONS, newOptions);
    }

    buildHowlSound(src, baseOptions = this.options) {
        return new Howler.Howl(Object.assign(baseOptions, {src}));
    }
}
