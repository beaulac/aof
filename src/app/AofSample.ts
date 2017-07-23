export class AofSample {
    public file: string;

    constructor(public howlSound, file: string, public type) {
        ([this.file] = file.split('.'));
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
