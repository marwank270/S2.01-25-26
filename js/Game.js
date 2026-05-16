import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';


export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   * @type {number} timerId identifiant du timer de la partie en cours (pour pouvoir l'arrêter)
   * @type {number} elapsedTime temps écoulé en centièmes de seconde
   */
  #id;
  #timerId;
  #elapsedTime = 0;

  async endGame() {
    // Todo À compléter


    const idARemplacer = 1234;
    const nombreDePairesRestanteARemplacer = 5678;

    try {
      const result = await ApiService.updateGameResult(idARemplacer, nombreDePairesRestanteARemplacer);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }

  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   * @param {string} collectionName - The name of the image collection to use.
   */
  startGame(id, collectionName) {
    this.#id = id;
    this.#elapsedTime = 0;
    this.startTimer();

    // @todo afficher les cartes (face cachées) sur le plateau de jeu
    // @todo ajouter un bouton d'abandon

  }

  // Todo À compléter

  startTimer() {
    const timer = document.querySelector('.game-timer');

    // @note utiliser hors prod car unsafe d'après les chad de chez mozzila
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    this.#timerId = setInterval(() => {
      this.#elapsedTime++;
      const min = Math.floor(this.#elapsedTime / 600);
      const sec = Math.floor((this.#elapsedTime % 600) / 10);
      const dix = this.#elapsedTime % 10;
      const minStr = min < 10 ? `0${min}` : `${min}`;
      const secStr = sec < 10 ? `0${sec}` : `${sec}`;
      // Update le timer sur la page
      timer.textContent = `${minStr}:${secStr}.${dix}`;
      // Mettre à jour le timer toutes les 100ms
    }, 100);
  }

}
