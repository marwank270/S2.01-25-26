export class DOMManager {


  /**
   * Créé les images d'une collection sur le gameBoard
   * @param {Image[]} images
   */
  createCards(images) {
    const gameBoard = document.querySelector('.game-board');

    images.forEach(image => {
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
}
