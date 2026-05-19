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

  // Easter Egg: God mode si le pseudo est "貝合わせ" (Kai-Awase, un jeu de mémoire japonais traditionnel du XIIe siècle)
  if (pseudoInput.value.trim() === '貝合わせ') {
    console.log('[Easter Egg] God Mode secret activé pour ' + pseudoInput.value);
    // Définir la difficulté sur un nombre abérrant
    //let e = Array.from(crypto.getRandomValues(new Uint8Array(19)), x => x % 10).join('');
    const e = '9223372036854774784'; // 2^63 - 1024, valeur maximale (envoyable en js) pour que le serveur récupère le int64 maximal qu'il peut gérer
    domManager.updateDOMText(domManager.resolveElement('#difficulty').options[domManager.resolveElement('#difficulty').selectedIndex], e);
    try {
      let gameId = await ApiService.createGame(pseudoInput.value, e);
      console.log('Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + e);
      setTimeout(() => {
        // Démarrer la partie en mode God et attendre 3s
        game.startGame(gameId, collectionInput.value, parseInt(e));
      }, 3000);
      // // Envoyer un résultat de partie gagnée
      let r = ApiService.updateGameResult(gameId, 0);
      console.log(r);
    } catch (error) {
      console.error('[Error]: ', error);
      alert(error.message || '[Error]: Erreur lors de la création de la partie en mode God');
    }
    alert('Partie pliée');
    return;
  }

  try {
    // Appel de createGame() avec les paramètres récupérés
    let gameId = await ApiService.createGame(pseudoInput.value, difficultyInput.value);
    console.log('Partie créée: ' + gameId + ' pour ' + pseudoInput.value + ' difficulté: ' + difficultyInput.value + ' collection: ' + collectionInput.value);
    
    // Cacher le formulaire de configuration pour afficher le plateau de la partie
    domManager.hideDOMElement('.setup-form');

    // Démarrer la partie
    game.startGame(gameId, collectionInput.value, parseInt(difficultyInput.value));
  } catch (error) {
    console.error('[Error]: ', error);
    alert(error.message || '[Error]: Erreur lors de la création de la partie');
  }
});

// Ajouter un écouteur d'événement pour le bouton d'abandon
domManager.addClickListener('#abandon', () => {
  game.abandonGame();
});