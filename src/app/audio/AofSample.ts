export class AofSample {
    public sampleName: string;

    constructor(public howlSound: Howl, file: string, public type) {
        ([this.sampleName] = file.split('.'));
    }

    load() {
        this.howlSound.load();
    }

    play(initVolume) {
        this.load();
        this.howlSound.volume(initVolume);
        this.howlSound.play();
        console.log(`${this.sampleName} is now playing`);
    }

    stop() {
        this.howlSound.fade(this.howlSound.volume(), 0, 20); // prevents 'click' on stop
        this.howlSound.stop();
        console.log(`${this.sampleName} has stopped playing.`);
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
