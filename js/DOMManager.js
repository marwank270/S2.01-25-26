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

  }
  
  /**
   * Supprime tous les enfants d'un élément du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à clear
  */
  clearDOMElement(elt) {
   const element = this.resolveElement(elt);
   element.innerHTML = '';
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
   * Ajoute une classe à un élement du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre
   * @param {string} className - le nom de la classe à ajouter
   */
  addDOMClass(elt, className) {
    this.resolveElement(elt).classList.add(className);
  }

  /**
   * Retire une classe d'un élement du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre
   * @param {string} className - le nom de la classe à retirer
   */
  removeDOMClass(elt, className) {
    this.resolveElement(elt).classList.remove(className);
  }

  /**
   * Vérifie si un élement du DOM possède une classe spécifique
   * @param {HTMLElement} elt - l'élément du DOM à résoudre
   * @param {string} className - le nom de la classe à vérifier
   * @returns {boolean} true si l'élément possède la classe, sinon false
   */ 
  hasDOMClass(elt, className) {
    return this.resolveElement(elt).classList.contains(className);
  }

}
