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
  let pseudoInput     = domManager.resolveElement('#pseudo');
  let difficultyInput = domManager.resolveElement('#difficulty');
  let collectionInput = domManager.resolveElement('#collection');

  game.startEasterEggGodMode(pseudoInput.value);
  
  try {
    // Appel de createGame() avec les paramètres récupérés
    let gameId = await ApiService.createGame(pseudoInput.value, difficultyInput.value);
    console.log('Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + difficultyInput.value + ' collection: ' + collectionInput.value);
    
    // Cacher le formulaire de configuration et les stats de speedrun pour afficher le plateau de la partie
    domManager.hideDOMElement('.setup-form');
    if (!domManager.hasDOMClass(domManager.resolveElement('.speedrun-stats'), 'hidden')) domManager.hideDOMElement('.speedrun-stats');

    // Démarrer la partie
    game.startGame(gameId, collectionInput.value, parseInt(difficultyInput.value));
  } catch (error) {
    console.error('[Error]: ', error);
    alert(error.message || '[Error]: Erreur lors de la création de la partie');
  }
});

// Ajouter un écouteur de clics pour afficher / cacher les stats de speedrun disponible
const showStatsButton = domManager.resolveElement('#show-stats-btn');
const speedrunStatsContainer = domManager.resolveElement('.speedrun-stats');

showStatsButton.addEventListener('click', async function(event) {
  event.preventDefault();
  let pseudoInput = domManager.resolveElement('#pseudo');
  if (!pseudoInput) return;

  //console.log('click stats');
  //pseudoInput.required = true; // Rendre le champ pseudo requis pour afficher les stats de speedrun
  if (pseudoInput.value.trim().length === 0 || pseudoInput.value.trim().length < 3 || pseudoInput.value.trim().length > 20) {
    alert('Veuillez entrer un pseudo valide (3-20 caractères) pour afficher les stats de speedrun.');
    return;
  }

  // Afficher ou cacher les stats de speedrun du pseudo entré dans le champ de formulaire
  await domManager.toggleSpeedrunStatsTable(pseudoInput.value); 
  
  //console.log('state stats:', domManager.hasDOMClass(speedrunStatsContainer, 'hidden') ? 'caché' : 'visible');
});

// Ajouter un écouteur d'événement pour le bouton d'abandon
domManager.addClickListener('#abandon', () => {
  game.abandonGame();
});