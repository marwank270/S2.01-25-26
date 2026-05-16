import {MEMORY_URL} from './config.js';

/**
 * Service pour centraliser les appels API du jeu Memory.
 */
export class ApiService {
  /**
   * Crée une nouvelle partie sur le serveur.
   * @param {string} pseudo nom du joueur
   * @param {number} difficulty niveau de difficulé
   * @returns {Promise<GameReturn>}
   */
  static async createGame(pseudo, difficulty) {

    const reponse = await fetch(`${MEMORY_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pseudo.toString(), difficulty: parseInt(difficulty) })
    });

    // Vérifier la réponse du serveur
    if (!reponse.ok) {
      // Lancer une erreur si ce n'est pas bon
      throw new Error('Erreur lors de la création de la partie');
    }

    // Extraire les données de la réponse, retourner l'identifiant de la partie attribué par le serveur
    let d = await reponse.json();
    return d.id;
  }

  /**
   * Met à jour le score à la fin d'une partie.
   * @param {number} gameId
   * @param {number} pairsRemaining
   * @returns {Promise<any>}
   */
  static async updateGameResult(gameId, pairsRemaining) {
    const response = await fetch(`${MEMORY_URL}/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreCoupsRestant: pairsRemaining })
    });

    // Vérifier la réponse 
    if (!response.ok) {
      // Gérer l'erreur
      throw new Error('Erreur lors de la mise à jour du score');
    }

    return response.json();
  }
}
