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
   * Créé les images d'une collection sur le gameBoard
   * @param {Image[]} collection - la collection d'images à utiliser pour créer les cartes
   */
  createCards(collection) {
    const gameBoard = document.querySelector('.game-board');

    // Créer lees cartes avec des <div class="card" >  
    collection.forEach(image => {
      const card            = document.createElement('div');
      card.className        = 'card';
      card.dataset.imageId  = image.id;

      const cardInner     = document.createElement('div');
      cardInner.className = 'card-inner';

      const cardFront     = document.createElement('div');
      cardFront.className = 'card-front';

      const frontImg  = document.createElement('img');
      frontImg.src    = './assets/images/mask1.jpg';
      frontImg.alt    = 'Hidden card';
      cardFront.appendChild(frontImg);

      const cardBack      = document.createElement('div');
      cardBack.className  = 'card-back';

      const backImg = document.createElement('img');
      backImg.src   = image.url;
      backImg.alt   = image.name;
      cardBack.appendChild(backImg);
      
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);

      card.appendChild(cardInner);
      gameBoard.appendChild(card);
    });
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
   * Supprime tous les enfants d'un élément du DOM
   * @param {HTMLElement} elt - l'élément du DOM à résoudre à clear
   */
  clearDOMElement(elt) {
    const element = this.resolveElement(elt);
    element.innerHTML = '';
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
