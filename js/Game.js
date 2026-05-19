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
   * Arrête le chronomètre
   */
  stopChrono() {
    clearInterval(this.#chronoId);
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
   * Arrête le timer
   */
  stopTimer() {
    clearInterval(this.#timerId);
  }

  /**
   * Démarre le timer et affiche le temps restant sur la page 
   * @type {number} duration - durée du timer en secondes
   * @note Appelle directement endGame() à l'expiration du timer
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
   * Vérifie les conditions de victoire et affiche les stats avant la fin de partie
   * @returns {boolean} - true si le nombre de paires trouvées corresponds aux nombre de paires totales, false sinon
   */
  checkWin() {
    return this.#matchedPairs === this.#totalPairs;
  }

  /**
   * Retourne l'état actuel des fonctionnalités du jeu (effets sonores, mode speedrun, etc.) pour les utiliser dans d'autres méthodes
   * @returns {Object} - un objet contenant les états des fonctionnalités du jeu
   */
  getFeatures() {
    return this.#features;
  }

  /**
   * Gère la fin de partie en envoyant les résultats au serveur et en préparant le DOM pour une nouvelle partie
   */
  async endGame() {
    // Appelle l'arrêt du chronomètre ou timer en fonction du mode de jeu
    if (this.getFeatures().speedrun) {
        this.stopTimer();
    } else {  
      this.stopChrono();
    }  

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

    // Attendre 300ms que la carte finisse de se retourner
    setTimeout(() => {
      // Jouer le son de victoire (déplacé ici pour éviter les problèmes de timing avec un son dupliqué)
      if (this.getFeatures().sound && this.checkWin()) soundManager.playSound('win');
      // Jouer le son de défaite
      else soundManager.playSound('game_over');
    }, 300);  
    
    // Afficher les stats de la partie gagnée ou abandonnée dans la popup de fin de partie
    this.updateSpeedrunStats(); // Mettre à jour les stats du mode speedrun dans la popup de fin de partie
    this.showGameStats();
    //domManager.showDOMElement('.speedrun-stats'); // Afficher les stats de speedrun
    
    // Préparer le DOM pour une nouvelle partie
    //domManager.showDOMElement('.setup-form'); // Déplacé dans showGameStats() pour la consistance
    domManager.hideDOMElement('.game-area');
    domManager.hideDOMElement('#abandon');
    
    // Reset le plateau de jeu en supprimant toutes les précédentes cartes du DOM
    domManager.clearDOMElement('.game-board');
    
  }  
  
  /**
   * Gère l'abandon de la partie en cours
   */
  abandonGame() {
    // Appelle l'arrêt du chronomètre ou timer et la fin de partie en cas d'abandon
    if (this.getFeatures().speedrun) {
      this.stopTimer();
    } else {
      this.stopChrono();
    }
    // log absolument pas nécessaire et excessivement long mais j'aime bien l'avoir pour vérifier le temps de jeu et les stats au moment de l'abandon
    console.log('Partie abandonnée: ' + this.#id + ' paires restantes: ' + (this.#totalPairs - this.#matchedPairs) + '/' + this.#totalPairs + (this.getFeatures().speedrun ? ' temps restant: ' + this.#remainingTime / 10 + 's' : ' temps écoulé: ' + this.#elapsedTime));
    this.endGame();
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
    soundManager.toggleSound(this.getFeatures().sound);

    // Activer ou désactiver l'accélération des animations en fonction de la valeur de la checkbox
    //domManager.toggleClassOnSelector('.card-inner', 'speedrun', this.getFeatures().speedrun);

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
    
    // Créer les cartes dans le DOM
    domManager.createCards(pairs);
    
    // Démarrer le chronomètre ou timer une fois les cartes affichées
    if (this.getFeatures().speedrun) {
      this.startTimer(parseInt(domManager.resolveElement('#speedrun-timer').value));
    } else {
      this.startChrono();
    }  

    // Ajouter l'écoute des clics sur les cartes pour gérer le retournement et la comparaison
    this.addCardListeners();
  }

  /**
   * Réinitialise les cartes visibles pour les remettre de dos
   */
  resetCards() {
    this.#flipped.forEach(({ card }) => {
      domManager.removeDOMClass(card, 'flip');
    });
    this.#flipped = [];
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
      if (this.checkWin()) this.endGame();
    }
    
    if (this.getFeatures().speedrun) {
      // Réduire les temps de regard de 40%
      setTimeout(() => this.resetCards(), 400);
    } else {
      // Recacher les cartes après 1s en mode normal
      setTimeout(() => this.resetCards(), 1000);
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
   * @note Appeller cette méthode à la fin de startGame() pour écouter les clics après avoir créé les cartes et lancé le chronomètre ou timer
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
   * Gère les statistique de speedrun: update ou créé tableau de stats du mode speedrun
   */
  updateSpeedrunStats() {
    // Pour les stats du mode speedrun, sauvegarder la tentative dans localStorage
    // Grandement aidé par les chads de StackOverflow: https://stackoverflow.com/questions/55067628/json-example-confusing-me-about-json-parse-json-stringify-localstorage-setit
    if (this.getFeatures().speedrun) {
      const pseudo = domManager.resolveElement('#pseudo').value.trim();
      const difficulty = domManager.resolveElement('#difficulty').value;
      const time = parseFloat(this.#timerDuration - (this.#remainingTime / 10).toFixed(1)); // temps en dixièmes de seconde arrondi
      console.log('Temps utilisé:' + time + 's' + ' sur un timer de ' + this.#timerDuration);
      const timer = this.#timerDuration; // timer de speedrun en secondes
      const victory = this.checkWin(); // true si victoire, false si défaite ou abandon

      // Une sauvegarde par joueur, la créer si elle n'existe pas
      const key = `speedrun_stats_${pseudo}`;
      const stats = JSON.parse(localStorage.getItem(key)) || [];

      // Ajouter la tentative actuelle aux stats du joueur
      stats.unshift({
        date: new Date().toLocaleString('fr-FR'),
        matchedPairs: this.#matchedPairs,
        totalPairs: this.#totalPairs,
        time: time.toFixed(1), // temps en secondes arrondi à une décimale
        timer: timer,
        victory: victory
      });

      // Sauvegarder les stats mises à jour dans le localStorage
      localStorage.setItem(key, JSON.stringify(stats));

      let speedrunHistory = domManager.resolveElement('.speedrun-history');
      if (!speedrunHistory) {
        // Créer l'élément du tableau de stats s'il n'existe pas encore
        speedrunHistory = domManager.createSpeedrunStatsTable(pseudo, stats);
      }
      // Appeler la création du tableau de stats et le rendre visible
      //domManager.createSpeedrunStatsTable(pseudo, stats);
      //domManager.showDOMElement('.speedrun-stats');
    }
  }

  /**
   * Update les stats pour la popup de fin de partie, crée le tableau de stats du mode speedrun
   */
  showGameStats() {
    let min, sec, dix, minStr, secStr;

    if (this.getFeatures().speedrun) {
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
    if (this.getFeatures().speedrun) 
      domManager.updateDOMText('#time-count', `Temps restant: ${minStr}:${secStr}.${dix}`);
    else 
      domManager.updateDOMText('#time-count', `Temps écoulé: ${minStr}:${secStr}.${dix}`);

    // Afficher la popup de fin de partie
    domManager.showDOMElement('#win-box');
    
    if (this.checkWin()) 
      domManager.updateDOMText('#win-title', 'Vous avez gagné !');
    else 
      domManager.updateDOMText('#win-title', 'Vous avez perdu !');

    // Cacher la popup au click puis afficher le setup-form pour une nouvelle partie
    domManager.addClickListener('#btn-new-game', () => {
      domManager.hideDOMElement('#win-box');
      domManager.showDOMElement('.setup-form');
      // Afficher les stats de speedrun après la popup sous le formulaire de setup
      if (this.getFeatures().speedrun) domManager.showDOMElement('.speedrun-stats');
    });

    //this.updateSpeedrunStats();
  }

  /**
   * Gère la création d'une partie en mode "God" (difficulté maximale) avec un timer de 3 secondes pour le plaisir et la déconne, sans impact sur les stats de speedrun
   * @param {string} pseudo - le pseudo du joueur pour la partie en mode God
   * @param {string} collection - la collection d'images à utiliser pour la partie en mode God
   * @param {number} difficulty - la difficulté de la partie en mode God (fixée à 50 pour être maximale)
   */
  async startEasterEggGodMode(pseudo, collection, difficulty) {
    // Easter Egg: God mode si le pseudo est "貝合わせ" (Kai-Awase, un jeu de mémoire japonais traditionnel du XIIe siècle)
    if (pseudoInput.value.trim() != '貝合わせ') return; // Si le pseudo n'est pas le mot magique, ne rien faire et laisser la création de partie normale se faire

    console.log('[Easter Egg] God Mode secret activé pour ' + pseudoInput.value);
    // Définir la difficulté sur un nombre abérrant
    //let e = Array.from(crypto.getRandomValues(new Uint8Array(19)), x => x % 10).join('');
    const e = '9223372036854774784'; // 2^63 - 1024, valeur maximale (envoyable en js) pour que le serveur récupère le int64 maximal qu'il peut gérer

    const api = new ApiService();
    try {
      const gameId = await api.createGame(pseudoInput.value, e);
      console.log('Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + e);
      setTimeout(() => {
        // Démarrer la partie en mode God et attendre 3s
        game.startGame(gameId, collectionInput.value, parseInt(e));
      }, 3000);
      // Envoyer un résultat de partie gagnée
      const r = api.updateGameResult(gameId, 0);
      console.log(r);
    } catch (error) {
      console.error('[Error]: ', error);
    }
    alert('Partie pliée');
    // Terminer la partie proprement et sans crash quand même
    if (this.getFeatures().speedrun) {
      game.stopTimer();
    } else {
      game.stopChrono();
    }
    
    setTimeout(() => {}, 300);

    // Afficher les stats de la partie gagnée ou abandonnée dans la popup de fin de partie
    game.showGameStats();
    domManager.hideDOMElement('.game-area');
    domManager.hideDOMElement('#abandon');

    domManager.clearDOMElement('.game-board');
    domManager.showDOMElement('.setup-form');
    domManager.showDOMElement('.speedrun-stats');
    return; // Recréer le formulaire de configuration pour permettre de rejouer après la partie en mode God
      
  }
}
