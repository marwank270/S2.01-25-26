import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();


document.querySelector('.game-form').addEventListener('submit', async function (event) {
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
    document.querySelector('.setup-form').classList.add('hidden');
    document.querySelector('.game-area').classList.remove('hidden');

  } catch (error) {
    console.error('[Error]: ', error);
    alert(error.message || '[Error]: Erreur lors de la création de la partie');
  }
});

document.querySelector('#abandon').addEventListener('click', () => {
  // Appelle l'arrêt du timer et la fin de partie en cas d'abandon
  game.stopTimer();
  //game.endGame();

  // Afficher le setup-form et cacher le bouton d'abandon
  document.querySelector('.setup-form').classList.remove('hidden');
  document.querySelector('#abandon').classList.add('hidden');
});
