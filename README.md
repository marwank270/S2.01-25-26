# SAÉ 2.01 - Développement d'une application

## Membres de l'équipe

- Marwan K. - [Github](https://github.com/marwank270) - [Mail étudiant](mailto:marwan.kaouachi@etu.u-paris.fr)
- Noa H.-B. Z. - [Mail étudiant](mailto:noa.hoss-ben-zekri@etu.u-paris.fr) - **N'a, à ce jour pas participé au projet**
- Rayane E. - [Mail étudiant](mailto:rayane.embarek@etu.u-paris.fr) - **N'a, à ce jour pas participé au projet**
- Selim K. - [Mail étudiant](mailto:selim.kefi@etu.u-paris.fr) - **N'a, à ce jour pas participé au projet**

## Description du projet

-- À compléter par l'équipe --

## Instructions d'usage et de lancement

## Fonctionnalités implémentées

- [x] "Victory box" à la fin de la partie
  - Affiche les stats de la partie (temps, nombre de paires trouvées / nombre total de paires)
  - Affiche un message de victoire si toutes les paires sont trouvés ou un message de défaite sinon
  - Propose un bouton pour recommencer une nouvelle partie
- [ ] "Shuffle mode"
  - Mélange les cartes à chaque fois qu'une paire trouvée
  - Propose une checkbox pour activer ou désactiver le mode shuffle au setup de la partie
- [ ] "Memory démineur"
  - Propose une paire de carte "bombe" qui fait perdre la partie si la paire est retournée
  - Propose une checkbox pour activer ou désactiver le mode démineur au setup de la partie
  - Affiche une animation de bombe qui explose si la paire de carte "bombe" est retournée

## Problèmes rencontrés

1. Problème de CORS lors de l'appel à l'API pour créer une partie.
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