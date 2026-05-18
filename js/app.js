import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();

// Créer le formulaire de configuration de la partie
domManager.createSetupForm();

// Ajouter un écouteur d'événement pour le formulaire de configuration de la partie
domManager.addSubmitListener('.game-form', async function (event) { 
  event.preventDefault();
  // Récupérer les valeurs des champs de saisie dans le formulaire
  let pseudoInput     = document.getElementById('pseudo');
  let difficultyInput = document.getElementById('difficulty');
  let collectionInput = document.getElementById('collection');

  try {
    // Appel de createGame() avec les paramètres récupérés
    let gameId = await ApiService.createGame(pseudoInput.value, difficultyInput.value);
    console.log('[Info] Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + difficultyInput.value + ' collection: ' + collectionInput.value);
    
    // Démarrer la partie
    game.startGame(gameId, collectionInput.value);
    console.log('[Info] Démarrage de la partie: ' + gameId);

    // Cacher le formulaire de configuration pour afficher le platea de la partie
    domManager.hideDOMElement('.setup-form');
    domManager.showDOMElement('.game-area');

  } catch (error) {
    console.error('[Error]: ', error);
    alert(error.message || '[Error]: Erreur lors de la création de la partie');
  }
});

// Ajouter un écouteur d'événement pour le bouton d'abandon
domManager.addClickListener('#abandon', () => {
  game.abandonGame();
});
