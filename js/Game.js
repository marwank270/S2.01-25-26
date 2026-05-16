import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';

const domManager = new DOMManager();

export class Game {
  /**
   * @type {number} id - identifiant de la partie en cours
   * @type {number} timerId - identifiant du timer de la partie en cours (pour pouvoir l'arrêter)
   * @type {number} elapsedTime - temps écoulé en centièmes de seconde
   * @type {Array} flipped - cartes actuellement retournées
   * @type {number} matchedPairs - nombre de paires trouvées
   * @type {number} totalPairs - nombre total de paires
   */
  #id;
  #timerId;
  #elapsedTime = 0;
  #flipped = [];
  #matchedPairs = 0;
  #totalPairs = 0;

  
  async endGame() {
    // Todo À compléter


    const idARemplacer                      = this.#id;
    const nombreDePairesRestanteARemplacer  = this.#totalPairs - this.#matchedPairs;

    try {
      const result = await ApiService.updateGameResult(idARemplacer, nombreDePairesRestanteARemplacer);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }

  }

  /**
   * Démarre une nouvelle partie.
   * @param {number} id - L'identifiant de la parti'.
   * @param {string} collectionName - le nom  de la collection à utiliser.
   */
  startGame(id, collectionName) {
    this.#id            = id;
    this.#elapsedTime   = 0;
    this.#flipped       = [];
    this.#matchedPairs  = 0;
    this.startTimer();

    console.log('[Info] Création des cartes pour la collection: ' + collectionName);
    const images = imageCollections[collectionName];
    const pairs = [...images, ...images].sort(() => Math.random() - 0.5);
    this.#totalPairs = images.length;

    domManager.createCards(pairs);
    this.addCardListeners();
  }

  /**
   * Attends l'interaction de l'utilisateur sur les cartes et appelle la fontion de "retournement"
   */
  addCardListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.addEventListener('click', () => this.handleCardClick(card, index));
    });
  }

  /**
   * Gère le clic et le "retournement" d'une carte avant de les comparer
   * @param {HTMLDivElement} card 
   * @param {number} index 
   */
  handleCardClick(card, index) {
    if (card.classList.contains('flip') || card.classList.contains('matched')) return;
    if (this.#flipped.length >= 2) return;

    card.classList.add('flip');
    this.#flipped.push({ card, index });

    if (this.#flipped.length === 2) {
      // Vérifier les paire quand 2 cartes sont visibles
      this.checkMatch();
    }
  }

  /**
   * Compare deux cartes visibles et gère le résultat (matched ou non)
   */
  checkMatch() {
    const [first, second] = this.#flipped;
    const firstId         = first.card.dataset.imageId;
    const secondId        = second.card.dataset.imageId;

    if (firstId === secondId) {
      // Marquer la paire visible comme trouvée
      first.card.classList.add('matched');
      second.card.classList.add('matched');
      // Incrémenter le nombre de paires trouvées et reset les cartes retournées
      this.#matchedPairs++;
      this.#flipped = [];
      // Vérifier la victoire
      this.checkWin();
    } else {
      // Reset les cartes après 1s 
      setTimeout(() => this.resetCards(), 1000);
    }
  }

  /**
   * Réinitialise les cartes retournées pour les remettre de dos
   */
  resetCards() {
    this.#flipped.forEach(({ card }) => {
      card.classList.remove('flip');
    });
    this.#flipped = [];
  }

  /**
   * Vérifie les conditions de victoire et affiche une alerte avant la fin de partie
   */
  checkWin() {
    if (this.#matchedPairs === this.#totalPairs) {
      this.stopTimer();
      // Laisser le temps à la carte de se retourner
      setTimeout(() => alert('Bravo! Vous avez gagné!'), 700);
      
      //this.endGame();
    }
  }

  /**
   * Démarre un minuteur qui s'actualise toutes les 100ms et affiche le temps écoulé sur la page
   */
  startTimer() {
    const timer = document.querySelector('.game-timer');

    // @note utiliser hors prod car unsafe d'après les chad de chez mozzila
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    this.#timerId = setInterval(() => {
      this.#elapsedTime++;
      const min     = Math.floor(this.#elapsedTime / 600);
      const sec     = Math.floor((this.#elapsedTime % 600) / 10);
      const dix     = this.#elapsedTime % 10;
      const minStr  = min < 10 ? `0${min}` : `${min}`;
      const secStr  = sec < 10 ? `0${sec}` : `${sec}`;
      // Update le timer sur la page
      timer.textContent = `${minStr}:${secStr}.${dix}`;
    }, 100);
  }

  /**
   * Arrête le minuteur et reset le temps écoulé
   */
  stopTimer() {
    clearInterval(this.#timerId);
    this.#elapsedTime = 0;
  }

}
