/**
 * Classe pour gérer les interactions avec le DOM du jeu Memory.
 */
export class DOMManager {

  /**
   * Résout un sélecteur ou un élément DOM vers un élément concret.
   * @param {HTMLElement | string} elt
   * @returns {HTMLElement}
   */
  resolveElement(elt) {
    // console.log('Resolving element:', elt);
    if (typeof elt === 'string') {
      return document.querySelector(elt);
    }

    return elt;
  }
  
  /**
   * Cacher un élément du DOM en lui ajoutant spécifiquement la classe "hidden"
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à cacher
   */
  hideDOMElement(elt) {
    this.resolveElement(elt).classList.add('hidden');
  }

  /**
   * Afficher un élément du DOM en lui retirant spécifiquement la classe "hidden"
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à afficher
   */
  showDOMElement(elt) {
    this.resolveElement(elt).classList.remove('hidden');
  }

  /**
   * Écouteur de click pour un élément du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre qui devrait recevoir le click
   * @param {function} callback - la fonction à exécuter au click
   */
  addClickListener(elt, callback) {
    this.resolveElement(elt).addEventListener('click', callback);
  }
  
  /**
   * Écouteur de submit pour un élément du DOM (présent principalement pour la consistance)
   * @param {HTMLElement} elt - l'élément du DOM à résoudre qui devrait recevoir le submit
   * @param {function} callback - la fonction à exécuter au submit
   */
  addSubmitListener(elt, callback) {
    this.resolveElement(elt).addEventListener('submit', callback);
  }

  /**
   * Update le contenu textuel d'un élément du DOM possédant la propriété textContent
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à mettre à jour
   * @param {string} text - le texte (variables supportées (en théorie pour le moment)) à insérer dans l'élément duDOM à résoudre
   * @returns {HTMLElement} l'élément du DOM mis à jour
   */
  updateDOMText(elt, text) {
    return this.resolveElement(elt).textContent = `${text}`;
  }

  /**
   * Créé un élément du DOM 
   * @param {string} tag - nom de la balise HTML de l'élément à créer
   * @returns {HTMLElement} - l'élément HTLM du DOM créé
   */
  createDOMElement(tag) {
    return document.createElement(tag);
  }

  /**
   * Créé et affiche le formulaire de configuration de la partie
   */
  createSetupForm() {
    const imageCollectionsList = ['animaux', 'voitures', 'fruits'];
    const difficultyList = ['4', '5', '6', '8'];
    const speedrunTimerList = ['120', '60', '30', '15', '10']; // en secondes
    
    const setupForm = this.resolveElement('.setup-form');

    // Créer le titre du formulaire
    const title = this.createDOMElement('h2');
    this.updateDOMText(title, 'Démarrer une nouvelle partie');

    // Remplir le formulaire de configuration
    const form = this.resolveElement('.game-form');
    form.appendChild(title);

    // Créer le label et l'input pour le pseudo
    const pseudoLabel = this.createDOMElement('label');
    pseudoLabel.setAttribute('for', 'pseudo');
    pseudoLabel.setAttribute('hint', '(3-20 caractères)');
    this.updateDOMText(pseudoLabel, 'Nom d\'utilisateur:');
    form.appendChild(pseudoLabel);

    const pseudoInput = this.createDOMElement('input');
    pseudoInput.type = 'text';
    pseudoInput.id = 'pseudo';
    pseudoInput.name = 'pseudo';
    pseudoInput.required = true;
    pseudoInput.minlength = 3;
    pseudoInput.maxlength = 20;
    form.appendChild(pseudoInput);

    // Créer le label et le select pour la difficulté
    const difficultyLabel = this.createDOMElement('label');
    difficultyLabel.setAttribute('for', 'difficulty');
    this.updateDOMText(difficultyLabel, 'Difficulté:');
    form.appendChild(difficultyLabel);

    const difficultySelect = this.createDOMElement('select');
    difficultySelect.id = 'difficulty';
    difficultySelect.name = 'difficulty';
    difficultySelect.required = true;

    // Définir les options de difficulté (nombre de paires) et les ajouter au select
    difficultyList.forEach(value => {
      const option = this.createDOMElement('option');
      option.value = value;
      this.updateDOMText(option, `${value} paires`);
      difficultySelect.appendChild(option);
    });
    form.appendChild(difficultySelect);

    // Créer le label et le select pour la collection d'images
    const collectionLabel = this.createDOMElement('label');
    collectionLabel.setAttribute('for', 'collection');
    this.updateDOMText(collectionLabel, 'Collection d\'images:');
    form.appendChild(collectionLabel);

    const collectionSelect = this.createDOMElement('select');
    collectionSelect.id = 'collection';
    collectionSelect.name = 'collection';
    collectionSelect.required = true;

    // Définir les options de collection d'images et les ajouter au select
    imageCollectionsList.forEach(value => {
      const option = this.createDOMElement('option');
      option.value = value;
      // Capitaliser la première lettre pour l'affichage
      // Source: https://coreui.io/answers/how-to-capitalize-the-first-letter-of-a-string-in-javascript/
      this.updateDOMText(option, value.charAt(0).toUpperCase() + value.slice(1)); 
      collectionSelect.appendChild(option);
    });
    form.appendChild(collectionSelect);

    // Créer la div contenant les checkbox et leurs labels
    const checkBoxContainer = this.createDOMElement('div');
    checkBoxContainer.className = 'checkbox-container';
    form.appendChild(checkBoxContainer);
    
    // Créer le label et la checkbox pour les effets sonnores
    const soundEffectsLabel = this.createDOMElement('label');
    soundEffectsLabel.setAttribute('for', 'sounds');
    this.updateDOMText(soundEffectsLabel, 'Activer les effets sonores:');
    checkBoxContainer.appendChild(soundEffectsLabel);

    const soundEffectsCheckbox = this.createDOMElement('input');
    soundEffectsCheckbox.type = 'checkbox';
    soundEffectsCheckbox.id = 'sounds';
    soundEffectsCheckbox.name = 'sounds';
    checkBoxContainer.appendChild(soundEffectsCheckbox);

    // Créer le label pour le timer de speedrun
    const speedrunTimerLabel = this.createDOMElement('label');
    speedrunTimerLabel.setAttribute('for', 'speedrun-timer');
    this.updateDOMText(speedrunTimerLabel, 'Timer de speedrun:');
    checkBoxContainer.appendChild(speedrunTimerLabel);

    // Créer la checkbox pour activer ou désactiver le timer de speedrun
     const speedrunTimerCheckbox = this.createDOMElement('input');
     speedrunTimerCheckbox.type = 'checkbox';
     speedrunTimerCheckbox.id = 'toggle-speedrun-timer';
     speedrunTimerCheckbox.name = 'toggle-speedrun-timer';
     checkBoxContainer.appendChild(speedrunTimerCheckbox);
     
    // Créer le select pour le timer de speedrun
    const speedrunTimerSelect = this.createDOMElement('select');
    speedrunTimerSelect.id = 'speedrun-timer';
    speedrunTimerSelect.name = 'speedrun-timer';
    speedrunTimerSelect.required = false;
    speedrunTimerSelect.disabled = true; // Désactiver le select par défaut, il sera activé si la checkbox est cochée

    // Ajouter un écouteur pour activer ou désactiver le select du timer de speedrun en fonction de la checkbox
    speedrunTimerCheckbox.addEventListener('change', function() {
      speedrunTimerSelect.disabled = !this.checked;
    }); // @note fonction anonyme: pas bo -> fonction dédiée ?

    // Définir les options pour le timer de speedrun et les ajouter au select
    speedrunTimerList.forEach(value => {
      const option = this.createDOMElement('option');
      option.value = value;
      this.updateDOMText(option, `${value} secondes`);
      speedrunTimerSelect.appendChild(option);
    });
    checkBoxContainer.appendChild(speedrunTimerSelect);

    // Créer le bouton de soumission du formulaire
    const submitButton = this.createDOMElement('button')
    submitButton.type = 'submit';
    this.updateDOMText(submitButton, 'Démarrer la partie');
    form.appendChild(submitButton);
  }

  /**
   * Créé les tags audio HTML pour lire les sons 
   */
  createAudioElements() {
    const soundContainer = this.resolveElement('.sound-container');
    
    const flipSound = this.createDOMElement('audio');
    flipSound.src = './assets/sounds/flip.mp3';
    flipSound.preload = 'auto';
    soundContainer.appendChild(flipSound);

    const matchSound = this.createDOMElement('audio');
    matchSound.src = './assets/sounds/match.mp3';
    matchSound.preload = 'auto';
    soundContainer.appendChild(matchSound);
    
    const winSound = this.createDOMElement('audio');
    winSound.src = './assets/sounds/win.mp3';
    winSound.preload = 'auto';
    soundContainer.appendChild(winSound);

    const gameOverSound = this.createDOMElement('audio');
    gameOverSound.src = './assets/sounds/game-over.mp3';
    gameOverSound.preload = 'auto';
    soundContainer.appendChild(gameOverSound);
  }

  /**
   * Créé les images d'une collection sur le gameBoard
   * @param {Image[]} collection - la collection d'images à utiliser pour créer les cartes
   */
  createCards(collection) {
    const gameBoard = this.resolveElement('.game-board');

    // Créer lees cartes avec des <div class="card" data-image-id="..."> pour contenir les images et les informations de chaque carte
    collection.forEach(image => {
      const card            = this.createDOMElement('div');
      card.className        = 'card';
      card.dataset.imageId  = image.id;

      const cardInner     = this.createDOMElement('div');
      cardInner.className = 'card-inner';

      const cardFront     = this.createDOMElement('div');
      cardFront.className = 'card-front';

      const frontImg  = this.createDOMElement('img');
      frontImg.src    = './assets/images/mask1.jpg';
      frontImg.alt    = 'Hidden card';
      cardFront.appendChild(frontImg);

      const cardBack      = this.createDOMElement('div');
      cardBack.className  = 'card-back';

      // Ajouter l'image de la carte au verso de la carte
      const backImg = this.createDOMElement('img');
      backImg.src   = image.url;
      backImg.alt   = image.name;
      cardBack.appendChild(backImg);

      // Ajouter le recto et le verso ensemble
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);

      // Activer ou désactiver l'accélération des animations en fonction de la valeur de la checkbox speedrun
      cardInner.classList.toggle('speedrun', this.resolveElement('#toggle-speedrun-timer').checked);

      // Ajouter l'ensemble cardInner a card et card au gameBoard
      card.appendChild(cardInner);
      gameBoard.appendChild(card);
    });
  }

  /**
   * Créé un tableau sous le setup-form pour afficher les temps et difficultés des parties en speedrun du joueur
   * @type {string} pseudo - le pseudo du speedrunner
   * @type {Array} speedrunStats - les tentatives du joueur (date, matchedPairs, totalPairs, time, timer, victory)
   */
  createSpeedrunStatsTable(pseudo, speedrunStats) {
    // Cache le tableau précédent s'il existe // Déplacé dans app.js
    //const existingTable = this.resolveElement('.speedrun-stats');
    //if (existingTable) this.hideDOMElement(existingTable); // Plut^ot que existingTable.remove();

    if (speedrunStats.length === 0) return; // Ne pas créer de tableau s'il n'y a aucune tentative à afficher

    //const speedrunContainer = this.createDOMElement('div'); Créé dans le HTML pour faciliter affichhage/masquage dans app.js
    const speedrunContainer = this.resolveElement('.speedrun-stats');
    this.clearDOMElement(speedrunContainer);

    const title = this.createDOMElement('h3');
    this.updateDOMText(title, `Historique de speedrun pour ${pseudo}`);
    speedrunContainer.appendChild(title);

    // Créer le tableau et son en-tête
    const table = this.createDOMElement('table');
    const tableHead = this.createDOMElement('thead');
    const headerRow = this.createDOMElement('tr');
    
    const headers = ['Date - heure', 'Paires trouvées / Total de paires', 'Temps / Challenge'];
    headers.forEach(headerText => {
      const th = this.createDOMElement('th');
      this.updateDOMText(th, headerText);
      headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    console.log('Speedrun stats à afficher:', speedrunStats);
    console.log(speedrunStats[0].time);
    console.log(speedrunStats[0].timer);

    // Créer le corps du tableau et remplir les lignes
    const tableBody = this.createDOMElement('tbody');
    speedrunStats.forEach(stat => {
      const row = this.createDOMElement('tr');
      // Ajouter la classe correspondante à victoire ou défaite pour colorer la ligne en vert ou rouge
      row.className = stat.victory ? 'victory' : 'defeat';
      [
        stat.date,
        // Factorisation des champs paires trouvées / total de paires et temps / timer de speedrun (compact)
        `${stat.matchedPairs} / ${stat.totalPairs}`,
        `${stat.time} / ${stat.timer}s`, // Affichage plus simple du temps et du timer de speedrun (en secondes)
      ].forEach(text => {
        const td = this.createDOMElement('td');
        this.updateDOMText(td, text);
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    speedrunContainer.appendChild(table);

    // Ajouter le tableau au DOM, sous le setup-form
    const setupForm = this.resolveElement('.setup-form');
    this.hideDOMElement('.speedrun-stats'); // cacher le conteneur du tableau de stats de speedrun pour le moment
    setupForm.insertAdjacentElement('afterend', speedrunContainer);
  }
  
  //// Méthodes génériques ////
    
  /**
   * Supprime tous les enfants d'un élément du DOM
   * @param {HTMLElement} elt - l'élément du DOM dont les enfants doivent être supprimés
   */
  clearDOMElement(elt) {
   const element = this.resolveElement(elt);
   element.innerHTML = '';
  }
  
  /**
   * Ajoute une classe à un élement du DOM
   * @param {HTMLElement} elt - l'élément du DOM auquel ajouter la classe
   * @param {string} className - le nom de la classe à ajouter
   */
  addDOMClass(elt, className) {
    this.resolveElement(elt).classList.add(className);
  }

  /**
   * Retire une classe d'un élement du DOM
   * @param {HTMLElement} elt - l'élément du DOM auquel retirer la classe
   * @param {string} className - le nom de la classe à retirer
   */
  removeDOMClass(elt, className) {
    this.resolveElement(elt).classList.remove(className);
  }

  /**
   * Vérifie si un élement du DOM possède une classe spécifique
   * @param {HTMLElement} elt - l'élément du DOM
   * @param {string} className - le nom de la classe à vérifier
   * @returns {boolean} true si l'élément possède la classe, sinon false
   */ 
  hasDOMClass(elt, className) {
    return this.resolveElement(elt).classList.contains(className);
  }

}
