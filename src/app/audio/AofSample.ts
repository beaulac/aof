import { _trace } from '../trace';

export class AofSample {
    public sampleName: string;

    get isLoaded() {
        return this.howlSound.state() === 'loaded';
    }

    get isLoadingOrLoaded() {
        const state = this.howlSound.state();
        return state === 'loaded' || state === 'loading';
    }

    constructor(public howlSound: Howl, file: string, public type) {
        ([this.sampleName] = file.split('.'));
    }

    load() {
        if (this.isLoadingOrLoaded) {
            return;
        }
        _trace('Preloading!');
        this.howlSound.load();
    }

    play(initVolume, onLoadCb = Function.prototype) {
        if (this.isLoaded) {
            onLoadCb();
            this.doPlay(initVolume);
        } else {
            this.howlSound.load();
            this.howlSound.once(
                'load',
                () => {
                    onLoadCb();
                    this.doPlay(initVolume);
                }
            );
        }
    }

    private doPlay(initVolume) {
        this.howlSound.volume(initVolume);
        this.howlSound.play();
        _trace(`${this.sampleName} is now playing`);
    }

    stop() {
        this.howlSound.fade(this.howlSound.volume(), 0, 20); // prevents 'click' on stop

        if (this.howlSound.playing()) {
            this.howlSound.stop();
            _trace(`${this.sampleName} has stopped playing.`);
        }
    }

    unload() {
        this.howlSound.unload();
    }

    setVolume(newVolume) {
        _trace(`${this.sampleName} had its volume set to ${newVolume}`);
        this.howlSound.volume(newVolume);
    }

    fadeTo(newVolume, lengthMs) {
        _trace(`${this.sampleName} is fading to ${newVolume}`);
        const sound = this.howlSound;
        sound.fade(sound.volume(), newVolume, lengthMs);
    }
}
