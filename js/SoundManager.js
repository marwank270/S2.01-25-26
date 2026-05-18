export class SoundManager {
    constructor() {
        // État d'activation des effets sonores (désactivé par défaut)
        this.active = false;    
        // Dictionnaire des effets sonores utilisés dans le jeu
        this.soundsLib = {
            // Son de retournement d'une carte (flip)
            flip: new Audio('./assets/sounds/flip.mp3'),           // Source: https://pixabay.com/fr/sound-effects/films-et-effets-sp%c3%a9ciaux-flipcard-91468/ (raccourci)
            // Son de correspondance de deux cartes (match)
            match: new Audio('./assets/sounds/match.mp3'),         // Source: https://pixabay.com/fr/sound-effects/la-technologie-correct-answer-toy-bi-bling-476370/ (raccourci)
            // Son de victoire ou de fin de partie (win/game over)
            win: new Audio('./assets/sounds/win.mp3'),             // Source: https://pixabay.com/fr/sound-effects/films-et-effets-sp%c3%a9ciaux-goodresult-82807/
            game_over: new Audio('./assets/sounds/game-over.mp3'), // Source: https://pixabay.com/sound-effects/musical-game-over-417465/
        };
    }

    /**
     * Active ou désactive les effets sonores
     * @param {boolean} enabled - true pour activer les effets sonores, false pour les désactiver
     */
    toggleSound(enabled) {
        this.active = enabled;
    }

    /**
     * Lire un son
     * @param {string} sound - le son à lire
     */
    playSound(sound) {
        if (this.active) {
            // console.log('Playing sound:', sound);
            switch (sound) {
                case 'flip': 
                    this.soundsLib.flip.currentTime = 0; // Revenir au début du son pour pouvoir le jouer à nouveau même s'il est déjà en cours de lecture
                    this.soundsLib.flip.play();
                    break;
                case 'match':
                    this.soundsLib.match.currentTime = 0;
                    this.soundsLib.match.play();
                    break;
                case 'win':
                    this.soundsLib.win.currentTime = 0;
                    this.soundsLib.win.play();
                    break;
                case 'game_over':
                    this.soundsLib.game_over.currentTime = 0;
                    this.soundsLib.game_over.play();
                    break;
                default:
                    console.warn('[Warning] Son inconnu: ' + sound);
            }
        }
    }
}