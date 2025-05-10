# Spécifications Produit - QR Game CEFOR

## Résumé exécutif

QR Game CEFOR est une application web progressive (PWA) développée pour le Centre de Formation CEFOR, permettant de créer et gérer une chasse au trésor interactive basée sur des QR codes. L'application est entièrement modulaire et s'adapte automatiquement au contenu du fichier JSON de configuration.

L'application offre une expérience ludique où **plusieurs joueurs peuvent participer simultanément, chacun avec sa propre session de jeu indépendante**. Les joueurs scannent des QR codes placés dans l'environnement pour accéder aux questions et y répondre, dans n'importe quel ordre. Le système mémorise les questions déjà répondues et refuse les doublons.

Les administrateurs peuvent gérer le contenu du jeu via un fichier JSON, générer les QR codes pour impression (avec le titre de la question inclus), et identifier le gagnant à la fin de l'événement.

Ce document définit les spécifications fonctionnelles et techniques pour guider l'équipe de développement.

## Objectifs du produit

* Fournir une plateforme simple pour créer des jeux basés sur des QR codes.
* Offrir une expérience utilisateur engageante et intuitive pour les joueurs.
* Permettre aux administrateurs de gérer facilement le contenu et de suivre les performances.
* Assurer une application robuste, sécurisée et accessible sur les appareils mobiles modernes.

## Personas

1. **Administrateur du Jeu (Alex) :**
   * Objectifs : Créer rapidement un jeu de piste/quiz pour un événement, suivre la participation, obtenir des retours.
   * Besoins : Interface de gestion simple, génération facile de QR codes, statistiques claires.
2. **Joueur (Sam) :**
   * Objectifs : Participer à un jeu amusant, tester ses connaissances, potentiellement gagner.
   * Besoins : Accès facile au jeu, instructions claires, interface réactive et ludique.

## Spécifications fonctionnelles

### F - Fonctionnalités Générales
* **F1 - Multi-jeux :** L'application doit pouvoir supporter la configuration d'un jeu à la fois. (Évolution future : gestion de plusieurs jeux distincts par la même instance).
* **F2 - PWA :** Installation sur l'écran d'accueil, accès hors-ligne limité au contenu déjà chargé (ex: règles, dernière question vue).
* **F3 - Responsive Design :** Interface adaptable aux smartphones, tablettes et ordinateurs de bureau.
* **F4 - Persistance locale (Joueur) :** L'état de la session du joueur (nom, réponses données, score actuel) doit être sauvegardé localement dans le navigateur (ex: localStorage). Cela permet de reprendre une partie interrompue sur le même appareil/navigateur. Chaque joueur aura sa propre sauvegarde locale liée à sa session.
* **F5 - Internationalisation (i18n) :** V1 en français. Prévoir une structure facilitant la traduction future.
* **F6 - Accessibilité (a11y) :** Respecter les bonnes pratiques pour une meilleure utilisabilité.
* **F7 - Liens profonds (Deep Linking) :** Un QR code scanné doit mener directement à la question correspondante. L'URL du QR code contiendra un identifiant de question. La gestion de la session du joueur sera assurée par l'application (voir F4), indépendamment du lien profond qui identifie la ressource (question). Un identifiant de jeu (`gameId`) doit aussi être inclus dans l'URL si plusieurs jeux sont configurés sur la même instance. Exemple : `https://votredomaine.com/game.html?gameId=eventX&questionId=Q1`.
* **F8 - Partage :** Option de partager le jeu (URL d'accueil) ou un score final (non implémenté en V1).
* **F9 - Personnalisation de l'apparence (Joueur) :** V1 avec un thème unique. (Évolution future : choix de thèmes par l'admin).

### Interface joueur

* **Navigation et Session :**
    * Chaque joueur dispose d'une session de jeu indépendante, initiée lors de la saisie de son nom (ou autre identifiant).
    * Un identifiant de session unique sera généré et géré par le client (stocké localement) pour permettre la persistance et la reprise de la partie. Cet identifiant sera transmis au backend lors des interactions (soumission de réponse).
* **Navigation post-réponse :**
    * **Décision Produit :** Le jeu sera **non-linéaire par défaut**. Après avoir répondu à une question, le joueur est renvoyé à une interface l'invitant à scanner le prochain QR code de son choix.
    * Le champ `order` dans `questions.json` sert à l'organisation pour l'administrateur et n'impose pas un parcours séquentiel au joueur.
* **Feedback :** Immédiat après réponse, configurable par l'admin (voir A6).

### Parcours utilisateur (Joueur)

1. **Accueil :**
   * Affichage du titre du jeu et d'un message de bienvenue.
   * **Saisie du nom du joueur :** C'est l'identifiant principal pour cette session de jeu. D'autres informations (email, téléphone) peuvent être collectées si configuré par l'administrateur (voir A6 et la section Sécurité/RGPD).
   * **Initiation de session :** À la validation du nom, une session joueur est créée/récupérée (via F4).
   * Option pour **commencer une nouvelle partie** (efface les données de session locale pour ce jeu) ou **reprendre une partie existante** (si des données de session F4 sont trouvées).
   * Affichage des règles du jeu (texte configurable par l'administrateur, voir A6).
   * Bouton/incitation pour "Commencer à scanner".
2. **Scan de QR code :**
   * Activation de l'appareil photo via l'interface (ex: en utilisant `html5-qrcode`).
   * Détection automatique du QR code.
   * Redirection vers la page de la question correspondante, identifiée par l'ID de la question contenu dans l'URL du QR code.
3. **Réponse aux questions :**
   * Affichage de la question (titre, description) et des options de réponse (si applicable).
   * Interface pour saisir/sélectionner la réponse.
   * Bouton de soumission de la réponse.
   * Feedback immédiat (configurable : afficher la bonne réponse ? uniquement correct/incorrect ?).
   * Navigation : Retour à l'interface de scan (mode non-linéaire par défaut).
4. **Récapitulatif (Fin de partie - optionnel ou sur demande) :**
   * Comment un joueur "termine-t-il" la partie dans un mode non-linéaire ? (Peut-être un QR code spécial "Fin" ou un bouton dans l'interface joueur si toutes les questions ont été répondues ou si le joueur le décide). *À préciser.*
   * Affichage du score final.
   * Récapitulatif des réponses (bonnes/mauvaises).
   * Option pour recommencer (nouvelle session) ou quitter.

### Interface administrateur

* **A1 - Authentification :** Optionnelle, configurable (voir A6). Si activée, accès via mot de passe (variable d'environnement `ADMIN_PASSWORD`).
* **A2 - Gestion des Questions (CRUD) :** Créer, lire, mettre à jour, supprimer les questions dans `questions.json`. Inclut type, titre, description, options, bonne réponse, points, ordre (pour l'organisation admin).
* **A3 - Génération des QR Codes :**
    * Pour chaque question individuelle.
    * Le QR code contiendra l'URL pointant vers la question (ex: `https://votredomaine.com/game.html?gameId=[ID_JEU_ACTUEL]&questionId=Q1`).
    * Personnalisation de l'apparence des QR codes via `qr-config.json`.
    * Prévisualisation et export (PNG/SVG, individuel ou en lot .zip).
* **A4 - Suivi et Analyse :**
    * Visualisation des statistiques basées sur `responses.json` (nombre de joueurs, progression moyenne, taux de succès par question).
    * Capacité de voir les réponses et scores par joueur (identifié par son nom/ID de session).
    * Filtrage des données (par question, potentiellement par joueur).
    * Export des données de réponses (format CSV ou JSON brut de `responses.json`).
* **A5 - Réinitialisation :**
    * Réinitialiser les statistiques (supprimer le contenu de `responses.json` après confirmation).
    * Option de réinitialiser une session joueur spécifique si besoin.
* **A6 - Paramètres de l'application :**
    * **Règles du jeu :** Texte affiché aux joueurs à l'accueil.
    * **Authentification admin :** Activation/désactivation, changement de mot de passe (si stockage plus sécurisé que variable d'env.).
    * **Feedback au joueur :** Type de feedback après réponse (ex: "Correct/Incorrect", "Correct/Incorrect + Bonne réponse").
    * **Options de collecte d'informations joueur :**
        * Nom du joueur (toujours obligatoire pour initier une session).
        * Collecte d'email (oui/non).
        * Collecte de téléphone (oui/non).
        * (Si oui, gestion du consentement RGPD nécessaire).
    * **Configuration du thème (F9) :** Si implémenté.
* **A7 - Sauvegarde/Restauration des données :**
    * Fonction pour sauvegarder `questions.json` et `responses.json`.
    * Stockage des sauvegardes horodatées dans `data/backups/`.
    * Fonction pour restaurer à partir d'une sauvegarde (avec avertissement).

## Types de questions

| Type      | Description                     | Format de réponse        | Validation                                                                                               |
| :-------- | :------------------------------ | :----------------------- | :------------------------------------------------------------------------------------------------------- |
| `standard`| Question à choix multiples      | Sélection parmi options  | Comparaison exacte avec `correctAnswer`.                                                                 |
| `text`    | Question à réponse textuelle    | Champ de texte libre     | Si `correctAnswer` défini : comparaison exacte insensible à la casse (V1). Sinon : simple stockage.          |
| `number`  | Question à réponse numérique    | Champ numérique          | Si `correctAnswer` défini : comparaison numérique exacte. Sinon : simple stockage.                       |
| `comment` | Commentaire ou feedback         | Zone de texte            | Stockage sans validation.                                                                                |

## Exporter vers Sheets

* L'export CSV depuis l'interface admin (A4) devrait être facilement importable dans Google Sheets ou Excel.

## Structure des données

* **`questions.json`:**
    ```json
    {
      "gameId": "event2025-conference", // Identifiant unique pour ce jeu spécifique
      "gameTitle": "Le Grand Quiz de la Conférence", // Titre affiché aux joueurs
      "questions": [
        {
          "id": "Q1", // Identifiant unique de la question
          "title": "Titre court de la question",
          "description": "Texte complet de la question...",
          "type": "standard", // "standard", "text", "number", "comment"
          "points": 10,
          "order": 1, // Pour l'organisation admin uniquement dans un contexte non-linéaire
          "options": ["Option 1", "Option 2", "Option 3"], // Pour type "standard"
          "correctAnswer": "Option 2" // Pour "standard", "text", "number"
        }
      ]
    }
    ```
    * *Note :* `gameId` et `gameTitle` au niveau racine de `questions.json` pour définir le contexte du jeu géré par ce fichier.

* **`responses.json`:**
    ```json
    {
      "gameId": "event2025-conference", // Correspond au gameId dans questions.json
      "sessions": [ // Renommé de "players" à "sessions" pour plus de clarté
        {
          "sessionId": "uniqueSessionIDForPlayer1", // UUID généré par le client/serveur à l'initiation
          "playerName": "Nom du Joueur 1", // Nom fourni par le joueur
          "email": "email@example.com", // Optionnel, si collecté et consenti
          "phone": "0123456789", // Optionnel, si collecté et consenti
          "startTime": "2025-05-08T09:30:00Z",
          "lastActivityTime": "2025-05-08T10:15:00Z", // Pour suivi ou nettoyage de sessions inactives
          "score": 20, // Score total pour cette session
          "responses": [
            {
              "questionId": "Q1",
              "answer": "Option 2", // Réponse brute du joueur
              "correct": true,
              "pointsEarned": 10,
              "timestamp": "2025-05-08T09:35:00Z"
            }
            // ... autres réponses pour cette session
          ]
        }
        // ... autres sessions de joueurs
      ]
    }
    ```
    * **Clarifications :**
        * `sessionId` est l'identifiant unique de la session de jeu d'un utilisateur, généré lors de la première interaction (par exemple, après la saisie du nom). Il est essentiel pour distinguer les joueurs simultanés.
        * Les champs `email` et `phone` sont optionnels, conditionnés par la configuration admin (A6) et le consentement de l'utilisateur.
        * La gestion (lecture/écriture) de `responses.json` par le backend doit être particulièrement robuste pour gérer les accès concurrents de multiples joueurs. **Des mécanismes pour éviter les "race conditions" (ex: file locking, ou mieux, une file d'attente pour les écritures) sont nécessaires.** Pour des événements avec de nombreux joueurs simultanés, l'utilisation d'un fichier JSON unique pour toutes les réponses deviendra un goulot d'étranglement et une source de risques. *Ceci est un point critique à considérer pour la scalabilité.*

* **`qr-config.json`:** (Configuration globale pour la génération des QR codes - inchangé)
    ```json
    {
      "size": 300,
      "margin": 10,
      "color": { "dark": "#4285F4", "light": "#FFFFFF" },
      "errorCorrectionLevel": "M",
      "format": "png"
    }
    ```

## Spécifications techniques

### Architecture

* **Frontend :** HTML, CSS, JavaScript (Vanilla JS ou micro-framework type Alpine.js), Bootstrap 5. Utilisation de `html5-qrcode` pour le scan et `qrcode.js` (ou équivalent) pour la génération côté client si prévisualisation admin.
* **Backend :** Node.js avec Express. API RESTful pour :
    * Récupérer les données du jeu/question (ex: `GET /api/game/:gameId/question/:questionId`).
    * Soumettre une réponse (ex: `POST /api/game/:gameId/session/:sessionId/response`). L'identifiant de session est crucial ici.
    * Fonctions d'administration (CRUD questions, récupération stats, etc.), sécurisées.
    * Le backend devra gérer l'état des sessions actives si besoin (au-delà de ce qui est stocké dans `responses.json`).
* **Stockage :** Fichiers JSON sur le serveur.
    * `data/questions.json`
    * `data/responses.json` (**Attention critique à la gestion des accès concurrents et à la scalabilité**).
    * `data/qr-config.json`
    * `data/backups/`
* **PWA :** Service Worker, Web App Manifest.
* **Stack technique :** Node.js (LTS), Express.js, HTML5, CSS3, JavaScript (ES6+).

### Stack technique

| Composant | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| Serveur | Node.js | ≥ 14.x | Runtime JavaScript |
| Framework backend | Express | 4.x | Routage et API REST |
| Frontend CSS | Bootstrap | 5.x | Interface responsive |
| Scan QR | HTML5-QRCode | 2.x | Scan de QR codes |
| Génération QR | qrcode.js | 1.5.x | Génération de QR codes |
| Visualisation | Chart.js | 3.x | Graphiques statistiques |
| PWA | Workbox | 6.x | Service Worker |
| Tests | Jest, Puppeteer | 29.x, 19.x | Tests unitaires et E2E |

## Exigences non fonctionnelles

### Performance
* Réponses rapides de l'API (<500ms pour les opérations courantes).
* Chargement rapide de l'interface joueur.
* **La gestion des écritures concurrentes dans `responses.json` est un point clé pour la performance sous charge.**

### Sécurité
* Protection des routes d'administration (middleware Express vérifiant l'authentification).
* Validation et sanitization systématique de toutes les entrées utilisateur (côté client et surtout côté serveur) pour prévenir XSS, injections, etc. (ex: utiliser `express-validator`).
* **RGPD/Données personnelles :** Si des données personnelles (email, téléphone) sont collectées :
    * Consentement explicite et traçable.
    * Information claire sur l'utilisation des données.
    * Possibilité pour l'utilisateur de demander la suppression de ses données.
    * Sécurisation du stockage et de l'accès à ces données.
    * Anonymisation ou pseudonymisation si possible pour les statistiques.
* Pas de stockage de mots de passe en clair (si l'authentification admin évolue).
* HTTPS obligatoire en production.

### Compatibilité
* Navigateurs modernes (Chrome, Firefox, Safari, Edge) sur mobile et bureau.

### Disponibilité
* Sauvegarde automatique ou manuelle (via A7) des données critiques.
* Stratégie de récupération en cas de corruption de fichiers de données.

### Scalabilité
* L'application doit pouvoir gérer plusieurs dizaines de joueurs simultanés pour une V1.
* **Le principal point de contention sera `responses.json`.** Pour une scalabilité au-delà de petits groupes, une base de données (SQLite comme première étape simple, ou NoSQL type MongoDB) sera indispensable. Ce passage doit être anticipé dans la roadmap si une forte affluence est attendue.

## Contraintes de développement

### Structure du projet
```
qr-game/
├── data/
│   ├── questions.json
│   ├── responses.json
│   ├── qr-config.json
│   └── backups/
├── public/
│   ├── css/, js/, images/, game.html, admin-*.html, manifest.json, sw.js
├── routes/ (api.js, admin.js)
├── services/ (questionService.js, responseService.js, sessionService.js) // Ajout sessionService
├── server.js
├── backup.js
├── .env, .gitignore, package.json, tests/
```

### Conventions de code
* ESLint et Prettier avec des règles partagées.
* Indentation: 2 espaces
* Semi-colons: obligatoires
* Commentaires: JSDoc pour les fonctions principales
* Nommage: camelCase pour les variables et fonctions

### Gestion de version
* Git, avec un flux de travail type Gitflow (main, develop, feature branches).

## Plan de déploiement

### Environnements
* Hébergement supportant Node.js (ex: Heroku, DigitalOcean, AWS, Clever Cloud).
* Configuration via variables d'environnement (`ADMIN_PASSWORD`, `NODE_ENV`, `PORT`, etc.).
    * `ADMIN_PASSWORD`: **Doit impérativement être changé pour la production.**
* CI/CD (intégration et déploiement continus) souhaitable (ex: GitHub Actions).

## Plan de test

* Tests unitaires pour la logique métier (services backend).
* Tests d'intégration pour les API.
* Tests manuels pour le parcours utilisateur et l'interface admin sur différents appareils.
* **Tests de charge légers** pour simuler plusieurs joueurs simultanés et évaluer le comportement de `responses.json`.

## Évolutions futures (Roadmap)

* **V1.0 :** Version initiale décrite dans ce document.
* **V1.1 :** Améliorations mineures, i18n, thèmes admin.
* **V2.0 :** Gestion multi-jeux, système d'authentification plus avancé (OAuth), tableau de bord joueur plus riche, **migration vers une base de données pour `responses.json` si succès et besoin de scalabilité avéré.**

## Annexes

### Glossaire
* **PWA**: Progressive Web App
* **QR Code**: Quick Response Code
* **QCM**: Question à Choix Multiples
* **CRUD**: Create, Read, Update, Delete
* **Race condition**: Condition de concurrence, situation où le comportement d'un système dépend de l'ordre ou du timing d'événements incontrôlables

### Références
* [Documentation HTML5-QRCode](https://github.com/mebjas/html5-qrcode)
* [Documentation Express.js](https://expressjs.com/)
* [Spécifications PWA](https://web.dev/progressive-web-apps/)

### Points d'attention supplémentaires pour le développement
* **Gestion des erreurs et feedback utilisateur :** Messages clairs et robustes.
* **Internationalisation (i18n) :** Prévoir les structures.
* **Accessibilité (a11y) :** Maintenir les bonnes pratiques.
* **Sécurité de l'API Admin :** Envisager rate limiting contre le brute-forcing.

### Contact
Pour toute question concernant ces spécifications, contacter:
* Product Manager: [Nom du PM]
* Lead Developer: [Nom du Lead Dev]
