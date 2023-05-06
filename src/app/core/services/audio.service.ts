import { Injectable } from '@angular/core';
import * as howler from 'howler';

@Injectable({
    providedIn: 'root'
})
export class ServiceAudio {

    constructor() { }

    playErrorSound() {
        var sound = new howler.Howl({
            src: ['../../../assets/sounds/error.wav'],
        });
        sound.play();
    }

    playBarcodeSound() {
        var sound = new howler.Howl({
            src: ['../../../assets/sounds/barcode.wav'],
            rate: 1.2
        });
        sound.play();
    }


    playSound(url: string, onEnd: () => any) {

        var player = new Audio(url);
        player.play();

    }

}