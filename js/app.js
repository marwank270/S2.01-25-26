import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();


document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  // Récupérer les valeurs des champs de saisie dans le formulaire
  let pseudoInput = document.getElementById('pseudo');
  let difficultyInput = document.getElementById('difficulty');
  let collectionInput = document.getElementById('collection');

  try {
    // Appel de createGame() avec les paramètres récupérés
    let gameId = await ApiService.createGame(pseudoInput.value, difficultyInput.value);
    // Afficher le succès dans la console
    console.log('[Success] Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + difficultyInput.value + ' collection: ' + collectionInput.value);
    
    game.startGame(gameId, collectionInput.value); // @todo: ajouter le paramètre collectionName à startGame
    console.log('[Info] Démarrage de la partie: ' + gameId);

    // Cacher le formulaire de configuration
    let setupForm = document.querySelector('.setup-form');
    setupForm.classList.add('hidden');

    // Afficher le platea de la partie
    let gameBoard = document.querySelector('.game-area');
    gameBoard.classList.remove('hidden');

  } catch (error) {
    console.error('[Error]: ', error);
    alert(error.message || '[Error]: Erreur lors de la création de la partie');
  }
});
