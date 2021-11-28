import { Popup } from '../components/popup';
import { Module } from '../core/module';

export class PianoModule extends Module {
    #keys;

    constructor() {
        super('pianoModule', 'Play music');
        this.#keys = [
            [65, 'key', 'C', 'A'],
            [87, 'key sharp', 'C#', 'W'],
            [83, 'key', 'D', 'S'],
            [69, 'key sharp', 'D#', 'E'],
            [68, 'key', 'E', 'D'],
            [70, 'key', 'F', 'F'],
            [84, 'key sharp', 'F#', 'T'],
            [71, 'key', 'G', 'G'],
            [89, 'key sharp', 'G#', 'Y'],
            [72, 'key', 'A', 'H'],
            [85, 'key sharp', 'A#', 'U'],
            [74, 'key', 'B', 'J'],
            [75, 'key', 'C', 'K'],
            [79, 'key sharp', 'C#', 'O'],
            [76, 'key', 'D', 'L'],
            [80, 'key sharp', 'D#', 'P'],
            [186, 'key', 'E', ';'],
        ];
    }

    trigger() {
        console.log('Я блять пианино');
        const popup = new Popup(this.#createPiano(), "Let's play music!");
        popup.open();

        const keys = document.querySelectorAll('.key');
        const hints = document.querySelectorAll('.hints');

        function playNote(e) {
            const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
            const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

            if (!key) return;

            const keyNote = key.getAttribute('data-note');
            key.classList.add('playing');
            audio.currentTime = 0;
            audio.play();
        }

        function removeTransition(e) {
            if (e.propertyName !== 'transform') return;
            this.classList.remove('playing');
        }

        function hintsOn(e, index) {
            e.setAttribute('style', 'transition-delay:' + index * 50 + 'ms');
        }

        hints.forEach(hintsOn);
        keys.forEach((key) => key.addEventListener('transitionend', removeTransition));
        window.addEventListener('keydown', playNote);
    }

    #createPiano() {
        const container = document.createElement('section');
        container.className = 'piano-container';
        // const nowPlayHTML = document.createElement('div');
        // nowPlayHTML.className = 'nowplaying';
        const keysHTML = document.createElement('div');
        keysHTML.className = 'keys';

        this.#keys.forEach((key) => {
            const keyHTML = document.createElement('div');
            keyHTML.dataset.key = key[0];
            keyHTML.className = key[1];
            keyHTML.dataset.note = key[2];

            const spanHTML = document.createElement('span');
            spanHTML.className = 'hints';
            spanHTML.textContent = key[3];

            keyHTML.append(spanHTML);
            keysHTML.append(keyHTML);
        });

        container.append(keysHTML);

        let counter = 40;
        this.#keys.forEach((key) => {
            const audioHTML = document.createElement('audio');
            audioHTML.dataset.key = key[0];
            audioHTML.src = `https://carolinegabriel.com/demo/js-keyboard/sounds/0${counter}.wav`;
            counter++;
            container.append(audioHTML);
        });

        return container;
    }
}
