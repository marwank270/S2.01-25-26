import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';
import {DOMManager} from './DOMManager.js';
import {SoundManager} from './SoundManager.js';

// Initialise une instance de DOMManager pour centraliser les interactions avec le DOM
const domManager = new DOMManager();
// Initialise une instance de SoundManager pour gérer les effets sonores du jeu
const soundManager = new SoundManager();

export class Game {
  /**
   * @type {number} id - identifiant de la partie en cours
   * @type {number} chronoId - identifiant du chronomètre de la partie en cours
   * @type {number} timerId - identifiant du timer de la partie en cours
   * @type {number} elapsedTime - temps écoulé en centièmes de seconde
   * @type {number} timerDuration - durée du timer en secondes (pour le mode speedrun)
   * @type {number} remainingTime - temps restant en centièmes de seconde (pour le mode speedrun)
   * @type {Array} flipped - tableau temporaire des 9cartes actuellement retournées
   * @type {number} matchedPairs - nombre de paires trouvées
   * @type {number} totalPairs - nombre total de paires
   */
  #id;
  #chronoId;
  #timerId;
  #elapsedTime = 0;
  #timerDuration = 0;
  #remainingTime = 0;
  #flipped = [];
  #matchedPairs = 0;
  #totalPairs = 0;
  #features = {
    sound: false, // Activer les effets sonores par défaut
    speedrun: false, // Activer le mode "speedrun" avec un minuteur et un classement des tentatives
    // Autres fonctionnalités à ajouter plus tard...
  }

  /**
   * Gère la fin de partie en envoyant les résultats au serveur et en préparant le DOM pour une nouvelle partie
   */
  async endGame() {
    const idARemplacer                      = this.#id;
    const nombreDePairesRestanteARemplacer  = this.#totalPairs - this.#matchedPairs;

    // Envoi de l'objet JSON contenant l'id de la partie et le nombre de paires restantes
    try {
      const result = await ApiService.updateGameResult(idARemplacer, nombreDePairesRestanteARemplacer);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }

    // Préparer le DOM pour une nouvelle partie
    // Attendre 500ms que la carte finisse de se retourner
    setTimeout(() => {/*fonction vide pour laisser le temps passer*/}, 300);

    // Afficher les stats de la partie gagnée ou abandonnée dans la popup de fin de partie
    this.showGameStats();
    this.handleSpeedrunStats(); // Mettre à jour les stats du mode speedrun dans la popup de fin de partie
    domManager.showDOMElement('.speedrun-stats'); // Afficher les stats de speedrun pour encourager le joueur à jouer en mode speedrun

    // Afficher le setup-form et cacher la game-area et le bouton d'abandon
    //domManager.showDOMElement('.setup-form'); // Déplacé dans showGameStats() pour la consistance
    domManager.hideDOMElement('.game-area');
    domManager.hideDOMElement('#abandon');

    // Reset le plateau de jeu en supprimant toutes les précédentes cartes du DOM
    domManager.clearDOMElement('.game-board');

  }

  /**
   * Démarre une nouvelle partie.
   * @param {number} id - L'identifiant de la partie.
   * @param {keyof ImagesCollection} collectionName - le nom  de la collection à utiliser.
   * @param {number} difficulty - la difficulté de la partie.
   */
  startGame(id, collectionName, difficulty) {
    this.#id            = id;
    this.#elapsedTime   = 0;
    this.#flipped       = [];
    this.#matchedPairs  = 0;
    this.#features      = {
      sound: domManager.resolveElement('#sounds').checked, // Récupérer la valeur de la checkbox pour les effets sonores
      speedrun: domManager.resolveElement('#toggle-speedrun-timer').checked, // Récupérer la valeur de la checkbox pour le mode speedrun
      // Autre fonctionnalités à ajouter plus tard...
    }

    // Activer ou désactiver les effets sonores en fonction de la valeur de la checkbox
    soundManager.toggleSound(this.#features.sound);

    // Activer ou désactiver l'accélération des animations en fonction de la valeur de la checkbox
    //domManager.toggleClassOnSelector('.card-inner', 'speedrun', this.#features.speedrun);

    // Afficher le plateau de jeu et le bouton d'abandon
    domManager.showDOMElement('.game-area');
    domManager.showDOMElement('#abandon');
    
    // Utiliser la clée correspondante à la collection d'images à créer
    const images = imageCollections[collectionName];
    // Mélanger les images pour en prendre N en fonction de la difficulté
    const Nimages = images.sort(() => Math.random() - 0.5).slice(0, difficulty);

    // Dupliquer et mélanger les images pour créer les paires
    const pairs = [...Nimages, ...Nimages].sort(() => Math.random() - 0.5);
    this.#totalPairs = Nimages.length;
    
    // Créer les cartes
    domManager.createCards(pairs);
    
    // Démarrer le chronomètre ou timer une fois les cartes affichées
    if (this.#features.speedrun) {
      this.startTimer(parseInt(domManager.resolveElement('#speedrun-timer').value));
    } else {
      this.startChrono();
    }

    this.addCardListeners();
  }

  /**
   * Gère l'abandon de la partie en cours
   */
  abandonGame() {
    // Appelle l'arrêt du chronomètre et la fin de partie en cas d'abandon
    if (this.#features.speedrun) {
      this.stopTimer();
    } else {
      this.stopChrono();
    }
    // log absolument pas nécessaire et excessivement long mais j'aime bien l'avoir pour vérifier le temps de jeu et les stats au moment de l'abandon
    console.log('Partie abandonnée: ' + this.#id + ' paires restantes: ' + (this.#totalPairs - this.#matchedPairs) + '/' + this.#totalPairs + (this.#features.speedrun ? ' temps restant: ' + this.#remainingTime / 10 + 's' : ' temps écoulé: ' + this.#elapsedTime));
    this.endGame();
  }

  /**
   * Vérifie les conditions de victoire et affiche les stats avant la fin de partie
   */
  checkWin() {
    if (this.#matchedPairs === this.#totalPairs) {
      if (this.#features.speedrun) {
        this.stopTimer();
      } else {
        this.stopChrono();
      }
      
      // Partie gagnée
      this.endGame();
      console.log('Partie gagnée: ' + this.#id);
    }
  }

  /**
   * Gère le clic et le "retournement" d'une carte avant de les comparer
   * @param {HTMLDivElement} card - élément de la carte sélectionnée
   * @param {number} index - index de la carte sélectionnée
   */
  handleCardClick(card, index) {
    // Ignorer les cartes déjà retournées ou trouvés
    if (domManager.hasDOMClass(card, 'flip') || domManager.hasDOMClass(card, 'matched')) return;
    // Attendre qu'au moins 2 cartes soient retournées avant d'en retourner une autre
    if (this.#flipped.length >= 2) return;

    // Retourner la carte sélectionnée et l'ajouter à la liste des cartes visibles
    domManager.addDOMClass(card, 'flip');
    this.#flipped.push({ card, index });
    // Jouer le son de retournement
    soundManager.playSound('flip');

    if (this.#flipped.length === 2) {
      // Vérifier les paire quand 2 cartes sont visibles
      this.checkMatch();
    }
  }

  /**
   * Attends l'interaction de l'utilisateur sur les cartes et appelle la fontion de "retournement"
   */
  addCardListeners() {
    // Pour tout éléments qui a la classe "card"
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      // Utiliser le DOMManager pour ajouter un écouteur de click à chaque cartes (tous les enfants des éléments de la classe .card)
      domManager.addClickListener(`.card:nth-child(${index + 1})`, () => this.handleCardClick(card, index));
    });
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
      domManager.addDOMClass(first.card, 'matched');
      domManager.addDOMClass(second.card, 'matched');

      // Jouer le son de correspondance
      soundManager.playSound('match');

      // Incrémenter le nombre de paires trouvées et reset les cartes retournées
      this.#matchedPairs++;
      this.#flipped = [];
      // Vérifier la victoire
      this.checkWin();
    } else {
      if (this.#features.speedrun) {
        // Réduire les temps de regard de 40%
        setTimeout(() => this.resetCards(), 400);
      } else {
        // Recacher les cartes après 1s en mode normal
        setTimeout(() => this.resetCards(), 1000);
      }
    }
  }

  /**
   * Réinitialise les cartes retournées pour les remettre de dos
   */
  resetCards() {
    this.#flipped.forEach(({ card }) => {
      domManager.removeDOMClass(card, 'flip');
    });
    this.#flipped = [];
  }

  /**
   * handle Speedrun stats: récupère les stats de la partie et les ajoute au tableau de stats du mode speedrun
   */
  handleSpeedrunStats() {
    // Pour les stats du mode speedrun, sauvegarder la tentative dans localStorage
    // Grandement aidé par les chads de StackOverflow: https://stackoverflow.com/questions/55067628/json-example-confusing-me-about-json-parse-json-stringify-localstorage-setit
    if (this.#features.speedrun) {
      const pseudo = domManager.resolveElement('#pseudo').value.trim();
      const difficulty = domManager.resolveElement('#difficulty').value;
      const time = parseFloat(this.#timerDuration - (this.#remainingTime / 10).toFixed(1)); // temps en dixièmes de seconde arrondi
      console.log('Temps utilisé:' + time + 's' + ' sur un timer de ' + this.#timerDuration);
      const timer = this.#timerDuration; // timer de speedrun en secondes
      const victory = this.#matchedPairs === this.#totalPairs;

      // Une sauvegarde par joueur, la créer si elle n'existe pas
      const key = `speedrun_stats_${pseudo}`;
      const stats = JSON.parse(localStorage.getItem(key)) || [];

      // Ajouter la tentative actuelle aux stats du joueur
      stats.unshift({
        date: new Date().toLocaleString('fr-FR'),
        matchedPairs: this.#matchedPairs,
        totalPairs: this.#totalPairs,
        time: time,
        timer: timer,
        victory: victory
      });

      // Sauvegarder les stats mises à jour dans le localStorage
      localStorage.setItem(key, JSON.stringify(stats));

      // Appeler la création du tableau de stats
      domManager.createSpeedrunStatsTable(pseudo, stats);
    }
  }

  /**
   * Update les stats pour la popup de fin de partie, crée le tableau de stats du mode speedrun
   */
  showGameStats() {
    let min, sec, dix, minStr, secStr;

    if (this.#features.speedrun) {
      min = Math.floor(this.#remainingTime / 600);
      sec = Math.floor(this.#remainingTime / 10);
      dix = this.#remainingTime % 10;
      minStr = min < 10 ? `0${min}` : `${min}`;
      secStr = sec < 10 ? `0${sec}` : `${sec}`;
    } else {
      // Format du temps écoulé mm:ss
      min = Math.floor(this.#elapsedTime / 600);
      sec = Math.floor((this.#elapsedTime % 600) / 10);
      dix = this.#elapsedTime % 10;
      minStr = min < 10 ? `0${min}` : `${min}`;
      secStr = sec < 10 ? `0${sec}` : `${sec}`; 
    }

    // Rmplacer les valeurs par défaut de la popup par les stats de la partie qui vient de se terminer
    domManager.updateDOMText('#pairs-count', `${this.#matchedPairs}/${this.#totalPairs}`);
    if (this.#features.speedrun) {
      domManager.updateDOMText('#time-count', `Temps restant: ${minStr}:${secStr}.${dix}`);
    } else {
      domManager.updateDOMText('#time-count', `Temps écoulé: ${minStr}:${secStr}.${dix}`);
    }

    // Afficher la popup de fin de partie
    domManager.showDOMElement('#win-box');
    
    if (this.#matchedPairs !== this.#totalPairs) {
      domManager.updateDOMText('#win-title', 'Vous avez perdu !');
      // Jouer le son de défaite
      soundManager.playSound('game_over');
    } else {
      domManager.updateDOMText('#win-title', 'Vous avez gagné !');
      // Jouer le son de victoire (déplacé après la mise à jour du titre pour éviter les problèmes de timing avec un son dupliqué)
      soundManager.playSound('win');
    }

    // Cacher la popup au click puis afficher le setup-form pour une nouvelle partie
    domManager.addClickListener('#btn-new-game', () => {
      domManager.hideDOMElement('#win-box');
      domManager.showDOMElement('.setup-form');
    });

    //this.handleSpeedrunStats();
  }


  /**
   * Démarre un chronomètre qui s'actualise toutes les 100ms et affiche le temps écoulé sur la page
   */
  startChrono() {
    // @note "setInterval" à utiliser hors prod car unsafe d'après les chad de chez mozzilla
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    this.#chronoId = setInterval(() => {
      this.#elapsedTime++;
      // Format du temps écoulé mm:ss:dd
      const min     = Math.floor(this.#elapsedTime / 600);
      const sec     = Math.floor((this.#elapsedTime % 600) / 10);
      const dix     = this.#elapsedTime % 10;
      const minStr  = min < 10 ? `0${min}` : `${min}`;
      const secStr  = sec < 10 ? `0${sec}` : `${sec}`;
      // Update le chronomètre sur la page
      domManager.updateDOMText('.game-timer', `${minStr}:${secStr}.${dix}`);
    }, 100);
  }

  /**
   * Arrête le chronomètre
   */
  stopChrono() {
    clearInterval(this.#chronoId);
  }

  /**
   * Démarre le timer et affiche le temps restant sur la page
   * @type {number} duration - durée du timer en secondes
   */
  startTimer(duration) {
    // Stocker la durée du timer pour les stats
    this.#timerDuration = duration;
    // Convertir la durée en dixièmes de seconde
    this.#remainingTime = duration * 10; 
    this.#timerId = setInterval(() => {
      this.#remainingTime--;

      // Format du temps restant mm:ss:dd
      const min = Math.floor(this.#remainingTime / 600);
      const sec = Math.floor((this.#remainingTime % 600) / 10);
      const dix = this.#remainingTime % 10;
      const minStr = min < 10 ? `0${min}` : `${min}`;
      const secStr = sec < 10 ? `0${sec}` : `${sec}`;

      // Update le timer sur la page
      domManager.updateDOMText('.game-timer', `${minStr}:${secStr}.${dix}`);

      if (this.#remainingTime <= 0) {
        clearInterval(this.#timerId);
        // Gérer la fin de partie en cas d'expiration du timer
        this.endGame();
      }
    }, 100);
  }

  /**
   * Arrête le timer
   */
  stopTimer() {
    clearInterval(this.#timerId);
  }
}
