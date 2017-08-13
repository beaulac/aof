import { Injectable } from '@angular/core';
import * as Howler from 'howler';


const DEFAULT_START_VOLUME = 0.5;
const DEFAULT_HOWL_OPTIONS = {
    loop: true,
    volume: DEFAULT_START_VOLUME,
    preload: false,
    format: 'mp3'
};

const audioRootPath = 'assets/audio'
    , shortLoopSrc = `${audioRootPath}/recall_short2.ogg`
    , longLoopSrc = `${audioRootPath}/recall_long2.ogg`;


@Injectable()
export class HowlerService {
    options = DEFAULT_HOWL_OPTIONS;

    backgroundVolume = 1;

    get globalVolume() {
        return Howler.Howler.volume();
    }

    set globalVolume(volume: number) {
        Howler.Howler.volume(volume);
    }

    shortBackgroundNoise: Howl;
    longBackgroundNoise: Howl;

    constructor() {
        this.shortBackgroundNoise = this.buildBackgroundNoise(shortLoopSrc);
        this.longBackgroundNoise = this.buildBackgroundNoise(longLoopSrc);
    }

    private buildBackgroundNoise(srcPath) {
        const backgroundNoise = new Howler.Howl({
                                                    src: [srcPath],
                                                    html5: true,
                                                    preload: true,
                                                    loop: true,
                                                    volume: 0
                                                });
        backgroundNoise.once(
            'load',
            () => {
                backgroundNoise.play();
                backgroundNoise.fade(0, this.backgroundVolume, 1000);
            }
        );

        return backgroundNoise;
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
