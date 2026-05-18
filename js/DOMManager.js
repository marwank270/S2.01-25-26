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
   * Update le contenu textuel d'un élément du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à mettre à jour
   * @param {string} text - le texte (variables supportées (en théorie pour le moment)) à insérer dans l'élément duDOM à résoudre
   */
  updateDOMText(elt, text) {
    this.resolveElement(elt).textContent = `${text}`;
  }

  /**
   * Créé un élément du DOM 
   * @param {string} tag - nom de la balise HTML de l'élément à créer
   * @returns {HTMLElement} l'élément HTLM du DOM créé
   */
  createDOMElement(tag) {
    return document.createElement(tag);
  }

  /**
   * Créé et affiche le formulaire de configuration de la partie
   */
  createSetupForm() {
    const setupForm = this.resolveElement('.setup-form');

    // Créer le titre du formulaire
    const title = this.createDOMElement('h2');
    this.updateDOMText(title, 'Démarrer une nouvelle partie');

    // Remplir le formulaire de configuration
    const form = this.resolveElement('.game-form');

    /*
    <label for="pseudo" hint="(3-20 caractères)">Nom d'utilisateur:</label>
    <input
      type="text"
      id="pseudo"
      name="pseudo"
      required
      minlength="3"
      maxlength="20"
    />

    <label for="difficulty">Difficulté:</label>
    <select id="difficulty" name="difficulty" required>
      <option value="4">4 paires</option>
      <option value="5">5 paires</option>
      <option value="6">6 paires</option>
      <option value="8">8 paires</option>
    </select>

    <label for="collection">Collection d'images:</label>
    <select id="collection" name="collection" required>
      <option value="animals">Animaux</option>
      <option value="cars">Voitures</option>
      <option value="fruits">Fruits</option>
      <!-- Ajouter d'autres collections -->
    </select>

    <button type="submit">Démarrer la partie</button> 
    */

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
    ['4', '5', '6', '8'].forEach(value => {
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
    ['animals', 'cars', 'fruits'].forEach(value => {
      const option = this.createDOMElement('option');
      option.value = value;
      // Capitaliser la première lettre pour l'affichage
      // Source: https://coreui.io/answers/how-to-capitalize-the-first-letter-of-a-string-in-javascript/
      this.updateDOMText(option, value.charAt(0).toUpperCase() + value.slice(1)); 
      collectionSelect.appendChild(option);
    });
    form.appendChild(collectionSelect);

    // Div contenant les checkbox et leurs labels
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

    // Créer le bouton de soumission du formulaire
    const submitButton = this.createDOMElement('button')
    submitButton.type = 'submit';
    this.updateDOMText(submitButton, 'Démarrer la partie');
    form.appendChild(submitButton);
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

      // Ajouter l'ensemble cardInner a card et card au gameBoard
      card.appendChild(cardInner);
      gameBoard.appendChild(card);
    });
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
