# QR Game CEFOR - Documentation Complète

## Vue d'ensemble

QR Game CEFOR est une application web progressive (PWA) développée pour le Centre de Formation CEFOR, permettant de créer et gérer une chasse au trésor interactive basée sur des codes QR. L'application est entièrement modulaire et s'adapte automatiquement au contenu du fichier JSON de configuration.

## Composantes principales

Le projet comprend deux composantes principales :

### 1. Application mobile pour les joueurs
- Interface intuitive pour scanner des QR codes placés dans l'environnement
- Navigation non-linéaire (les questions peuvent être répondues dans n'importe quel ordre)
- Mémorisation des questions déjà répondues et refus des doublons
- Nombre de questions variable défini par le fichier JSON de configuration
- Barre de progression adaptée au nombre total de questions
- Écran de fin récapitulatif avec toutes les réponses données

### 2. Interface d'administration
- Gestion complète des questions via fichier JSON
- Génération de QR codes pour impression
- Export des QR codes au format PDF avec titres des questions
- Récupération des données des joueurs à la fin de la durée du jeu
- Identification du gagnant à la fin de l'événement

## Caractéristiques techniques

### Modularité
- Le jeu est entièrement modulaire et s'adapte aux données JSON fournies
- Le nombre et le contenu des questions dépendent entièrement du fichier JSON
- Tout changement dans le fichier de configuration est automatiquement reflété
- Les questions, options et types de questions sont définis par le JSON

### Navigation non-linéaire
- Les QR codes servent de système de navigation dans le jeu
- Les joueurs peuvent scanner les questions dans n'importe quel ordre (Q1, puis Q7, puis Q2, etc.)
- Le système mémorise les questions déjà répondues
- Le système refuse l'accès aux questions déjà traitées, évitant les doublons

### Persistance des données
- Stockage local des réponses des joueurs via localStorage
- Possibilité de reprendre le jeu à tout moment
- Synchronisation des données à la fin du jeu pour déterminer le gagnant

## Cycle de vie du jeu

1. **Configuration** : Édition du fichier JSON avec le nombre souhaité de questions
2. **Préparation** : Génération et impression des QR codes avec titres
3. **Installation** : Placement des QR codes dans l'environnement (dans n'importe quel ordre)
4. **Jeu** : Participation des joueurs qui scannent les QR codes dans l'ordre qu'ils souhaitent
5. **Suivi** : Le système suit les questions déjà répondues et refuse les doublons
6. **Analyse** : Récupération des données à la fin de la période
7. **Résultats** : Identification du gagnant et distribution des prix

## Architecture technique

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 pour l'interface utilisateur
- Bibliothèque HTML5-QRCode pour le scan des QR codes
- Service Workers pour la fonctionnalité PWA
- localStorage pour la persistance des données côté client

### Backend
- Node.js avec Express
- Stockage des données dans des fichiers JSON
- API RESTful pour la communication client-serveur

## Structure des fichiers

- `/public` : Contient les fichiers accessibles publiquement
  - `game-v3.html` : Version actuelle du jeu
  - `admin.html` : Interface d'administration
  - `js/`, `css/` : Ressources JavaScript et CSS
- `/data` : Stockage des données
  - `questions.json` : Configuration des questions
  - `responses.json` : Réponses des joueurs
- `/test-*` : Scripts et documentation de test

## Évolutions futures (non implémentées dans la version actuelle)

- Export des données au format CSV
- Interface temps réel pour suivre les résultats pendant le jeu
- Identification du gagnant en temps réel
- Tableau de bord administrateur amélioré avec statistiques détaillées
- Personnalisation avancée de l'interface utilisateur

## Pour les développeurs

### Installation

1. Cloner le dépôt
   ```
   git clone https://github.com/votre-utilisateur/qr-game.git
   ```

2. Installer les dépendances
   ```
   npm install
   ```

3. Démarrer le serveur
   ```
   node server.js
   ```

4. Accéder à l'application
   - Interface joueur : http://localhost:3000/game-v3.html
   - Interface admin : http://localhost:3000/admin.html

### Tests

Le projet comprend un ensemble complet de tests :
- Tests fonctionnels : `test-all-questions.js`
- Tests du parcours utilisateur : `test-user-journey.js`
- Tests semi-automatisés : `test-semi-auto.js`

Pour exécuter les tests :
```
npm test
```

## Pour le product manager

### Points clés

- Application entièrement modulaire adaptée aux besoins du CEFOR
- Facilité de configuration via le fichier JSON
- Expérience utilisateur intuitive avec navigation non-linéaire
- Génération simple des QR codes pour impression
- Identification du gagnant à la fin de l'événement

### Roadmap

1. **Version actuelle (v3)** : Fonctionnalités de base avec modularité et navigation non-linéaire
2. **Prochaine version** : Export CSV, suivi en temps réel, améliorations UI/UX
3. **Version future** : Intégration avec d'autres systèmes, fonctionnalités avancées de gamification

## Conclusion

QR Game CEFOR offre une solution complète et flexible pour créer des chasses au trésor interactives basées sur des QR codes. Sa conception modulaire permet une adaptation facile à différents contextes et besoins, tandis que sa navigation non-linéaire offre une expérience utilisateur engageante et dynamique.
