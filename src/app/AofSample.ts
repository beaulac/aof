export class AofSample {
    constructor(public howlSound, public file: string, public type) {
    }

    play() {
        this.howlSound.play();
        console.log(this.file + ' is now playing');
    }

    stop() {
        this.howlSound.stop();
        console.log(this.file + ' has stopped playing.');
    }

    setVolume(newVolume) {
        console.log(this.file + ' had its volume set to ' + newVolume);
        this.howlSound.volume(newVolume);
    }

    fadeTo(newVolume, lengthMs) {
        console.log(this.file + ' is fading to ' + newVolume);
        const sound = this.howlSound;
        sound.fade(sound.volume(), newVolume, lengthMs);
    }
}
