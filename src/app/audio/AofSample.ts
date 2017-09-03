const NO_OP = () => undefined;

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
        console.log('Preloading!');
        this.howlSound.load();
    }

    play(initVolume, onLoadCb = NO_OP) {
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
        console.log(`${this.sampleName} is now playing`);
    }

    stop() {
        this.howlSound.fade(this.howlSound.volume(), 0, 20); // prevents 'click' on stop

        if (this.howlSound.playing()) {
            this.howlSound.stop();
            console.log(`${this.sampleName} has stopped playing.`);
        }
    }

    unload() {
        this.howlSound.unload();
    }

    setVolume(newVolume) {
        console.log(`${this.sampleName} had its volume set to ${newVolume}`);
        this.howlSound.volume(newVolume);
    }

    fadeTo(newVolume, lengthMs) {
        console.log(`${this.sampleName} is fading to ${newVolume}`);
        const sound = this.howlSound;
        sound.fade(sound.volume(), newVolume, lengthMs);
    }
}
