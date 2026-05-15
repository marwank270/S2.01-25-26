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
    //const response = await fetch(`${MEMORY_URL}/`, { // Slash en trop
    const response = await fetch(`${MEMORY_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Body rempli
        name: pseudo,
        difficulty: difficulty,
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la partie');
    }

    const data = await response.json();
    return data.id;  // Retourne directement l'idée de la partie créée
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreCoupsRestant: pairsRemaining,
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du score');
    }

    return response.json();
  }
}
