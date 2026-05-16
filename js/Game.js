import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';


export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id;

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

    // @todo lancer le chronomètre
    // @todo afficher les cartes (face cachées) sur le plateau de jeu
    // @todo ajouter un bouton d'abandon

  }

  // Todo À compléter

}
