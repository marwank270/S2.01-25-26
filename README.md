# SAÉ 2.01 - Développement d'une application

## Membres de l'équipe - Groupe S2

- Marwan K. - 108
- Noa H.-B. Z. - 108 - **N'a, à ce jour pas participé au projet**
- Rayane E. - 108 - **N'a, à ce jour pas participé au projet**
- Selim K. - 108 - **N'a, à ce jour pas participé au projet**

## Description du projet

> Le nom "Memory" est utilisé par Ravensburger pour la première fois en 1959 lors de leur première édition du "Jeu de paire"

### Principe

"Le jeu se compose de paires de cartes portant des illustrations identiques. L'ensemble des cartes est mélangé, puis étalé face contre table. À son tour, chaque joueur retourne deux cartes de son choix. S'il découvre deux cartes identiques, il les ramasse et les conserve, ce qui lui permet de rejouer. Si les cartes ne sont pas identiques, il les retourne faces cachées à leur emplacement de départ.

Le jeu se termine quand toutes les paires de cartes ont été découvertes et ramassées. Le gagnant est le joueur qui possède le plus de paires. " Source : [Wikipedia](https://fr.wikipedia.org/wiki/Jeu_de_paires)

Notre variante proposera un jeu en solitaire : le joueur ne disposera que d'un temps limité pour identifier un ensemble de cartes identiques.

## Instructions d'usage et de lancement

Pour tester rapidement l'application sans installation, le projet est déployé sur Github Pages : [https://marwank270.github.io/S2.01-25-26/](https://marwank270.github.io/S2.01-25-26/)

Pour lancer le projet localement:

1. Cloner le dépôt GitHub:
  
  ```sh
  git clone https://marwank270.github.io/S2.01-25-26.git
  ```

1. Ouvrir le fichier `index.html` dans un navigateur web (double-cliquer sur le fichier ou faire un clic droit et sélectionner "Ouvrir avec" > "Votre navigateur préféré").

## Fonctionnalités implémentées

- [x] "Victory box" à la fin de la partie
  - Affiche les stats de la partie (temps, nombre de paires trouvées / nombre total de paires)
  - Affiche un message de victoire si toutes les paires sont trouvés ou un message de défaite sinon
  - Propose un bouton pour recommencer une nouvelle partie
- [ ] "Speedrun mode", pour les joueurs qui veulent se challenger
  - [x] Réduit le temps de toutes les animations et délais ~~à 20% de leur durée normale~~
  - [x] Propose une checkbox pour activer ou désactiver le mode speedrun au setup de la partie
  - [ ] Utiliser des barres d'affichage en pourcentage au lieu de / dans le tableau
  - [x] Propose menu déroulant différents minuteurs à battre (ex: ~~3mn~~, 2mn, 1mn, 30s, 15s, 10s)
    - [x] Enregistre les temps et difficultés du joueur pour les parties en speedrun et les affiche sous le `setup-form`
    - [ ] Permet de débloquer et d'afficher fièrement un badge de "speedrunner" si le temps de 30s est battu en difficulté 8
  - [x] Propose un bouton pour afficher l'historique de speedruns (en fonction du nom d'utilisateur saisi) ~~de tous les utilisateurs~~  
    *Affichage automatique disponible à partir du moment ou le joueur à effectué une une tentative en mode speedrun*
- ~~[ ] "Shuffle mode", un cran de difficulté supplémentaire~~
  - ~~Mélange les cartes à chaque fois qu'une paire trouvée~~
  - ~~Propose une checkbox pour activer ou désactiver le mode shuffle au setup de la partie~~  
  *Idée abandonnée car elle rendrai le jeu trop aléatoire et potentiellement frustrant. Surtout, contraire au principe du memory de base.*
- [ ] "Memory démineur"
  - Propose une paire de carte "bombe" qui fait perdre la partie si la paire est retournée
  - Propose une checkbox pour activer ou désactiver le mode démineur au setup de la partie
  - Affiche une animation de bombe qui explose si la paire de carte "bombe" est retournée
  - Joue un léger "hint sound" pour ne pas laisser l'aléa faire perdre la partie au joueur
- [x] "Effets sonores" pour agrémenter l'expérience de jeu
  - Ajoute des effets sonores pour les actions suivantes :
  - [x] Propose une checkbox pour activer ou désactiver les effets sonores au setup de la partie (activé par défaut)
    - [x] Retourner une carte (`./assets/sounds/flip.mp3`)
    - [x] Trouver une paire (`./assets/sounds/match.mp3`)
    - [x] Gagner la partie (`./assets/sounds/win.mp3`)
    - [x] Perdre la partie (`./assets/sounds/game-over.mp3`)
    - [ ] Survol d'une carte piégée (après implémentation du mode démineur)
- [x] Easter egg

## Problèmes rencontrés

1. Problème de CORS lors de l'appel à l'API pour créer une partie: `Blocage d’une requête multiorigine (Cross-Origin Request) : la politique « Same Origin » ne permet pas de consulter la ressource distante située sur file:///[...]/js/app.js. Raison : la requête CORS n’utilise pas HTTP.`
   - [X] **Solution**: *J'ai été stupide de penser que l'erreur venait d'un refus injustifé du serveur alors que le problème était simplement dû à une mauvaise définition des valeurs de la difficulté ("facile" était envoyé comme chaîne au lieu préalablement d'être converti en nombre "4").
   Il n'y avait aucun problème avec le serveur qui refusait logiquement la requête puisque le body ne contenait pas toutes les valeurs attendues.*
   - [ ] Tentative de déploiement de l'application avec un serveur de développement local (Live Server), mais le problème de CORS persiste.
   - [ ] Tentative de contourner en utilisant un proxy, mais cela n'a pas fonctionné. [CORS Anywhere](https://cors-anywhere.herokuapp.com/), instantanément bloqué par le serveur.
   - [ ] Tentative de résoudre en ajoutant des headers CORS côté client, mais le problème persiste.
   - [ ] Tentative de serveur Node.js (20.12.2) en guise de relai, sans résultats concluants.
   - [ ] Tentative de déploiement de l'application avec github pages, mais le problème de CORS persiste.
   - [ ] Tentative de déploiement de l'application avec une raspberry pi (Serveur Apache), refus du serveur distant (403 Forbidden).

2. Problèmes de `DOMException` lors de la manipulation d'éléments HTML (div & string) dans les méthodes de `Game.js` : `Uncaught DOMException: Document.querySelector: '[object HTMLDivElement]' is not a valid selector`

   - [X] **Solution**: *Le problème venait du fait que j'essayais de passer des éléments HTML (div) à des méthodes qui attendaient des (string). J'ai ajouté une méthode `resolveElement()` dans la classe `DOMManager` pour utiliser les éléments HTML directement en tant que tel ou en tant que string si ils sont des sélecteurs CSS.*
   - [~] Tentative de résoudre le problème en déplacant la logique de résolution d'éléments du DOM dans une classe dédiée (`DOMManager.js` comme ça aurait dû être le cas dès le départ).
   - [X] Refactorisation de toutes les méthodes de `Game.js` qui manipulaient des éléments du DOM pour utiliser les nouvelles méthodes de `DOMManager.js` avec la nouvelle fonction de résolution d'éléments du DOM. Partiellement résolu.

## Contributions

- Marwan K. - 100% du projet (création de la structure de base, implémentation de toutes les fonctionnalités, rédaction du `README.md`)
- Lyne Q. - [Mail](mailto:hey@lyneq.be) - Aide (extérieure à l'équipe) occasionnelle, conseils et relectures du code
