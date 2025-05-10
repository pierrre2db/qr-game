# QR Game CEFOR - Chasse au Trésor Interactive via QR Codes

![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![Licence](https://img.shields.io/badge/licence-MIT-green.svg)

Une application web progressive (PWA) permettant de créer et gérer une chasse au trésor interactive basée sur des codes QR, développée pour le CEFOR (Centre de Formation).

## À propos du projet

QR Game CEFOR est une application entièrement modulaire qui s'adapte automatiquement au contenu d'un fichier JSON de configuration. Le jeu permet aux participants de scanner des QR codes placés dans l'environnement et de répondre à des questions dans n'importe quel ordre, offrant ainsi une expérience de jeu non-linéaire et personnalisée.

## Fonctionnalités principales

### Interface joueur
- **Navigation non-linéaire** : Les joueurs peuvent scanner les QR codes dans n'importe quel ordre
- **Modularité complète** : Le nombre et le contenu des questions dépendent du fichier JSON
- **Persistance des données** : Sauvegarde locale des réponses et progression
- **Interface responsive** : Adaptée à tous les appareils mobiles
- **Écran de fin récapitulatif** : Résumé des réponses et du score

### Interface administrateur
- **Gestion des questions** via fichier JSON
- **Génération de QR codes** pour impression avec titres
- **Export PDF** des QR codes
- **Identification du gagnant** à la fin de l'événement

## Documentation

Le projet est accompagné d'une documentation complète pour tous les utilisateurs :

- [README-COMPLET.md](README-COMPLET.md) - Vue d'ensemble détaillée du projet
- [GUIDE-TECHNIQUE.md](GUIDE-TECHNIQUE.md) - Documentation technique pour les développeurs
- [GUIDE-ADMINISTRATEUR.md](GUIDE-ADMINISTRATEUR.md) - Guide pour les administrateurs
- [GUIDE-JOUEUR.md](GUIDE-JOUEUR.md) - Instructions pour les participants
- [MANUEL-UTILISATEUR.md](MANUEL-UTILISATEUR.md) - Manuel utilisateur général

## Structure du projet

```
qr-game/
├── public/                  # Fichiers accessibles publiquement
│   ├── game-v3.html         # Version actuelle du jeu
│   ├── admin.html           # Interface d'administration
│   ├── js/                  # Scripts JavaScript
│   └── css/                 # Feuilles de style CSS
├── data/                    # Données de l'application
│   ├── questions.json       # Configuration des questions
│   └── responses.json       # Réponses des joueurs
├── server.js                # Serveur principal
├── test-*.js                # Scripts de test
└── *.md                     # Documentation
```

## Branches

Le projet est organisé en plusieurs branches :

- **main** - Branche principale du projet
- **documentation** - Documentation complète du projet
- **version-v3** - Dernière version du code avec modularité et navigation non-linéaire

## Stack technique

- **Frontend** : HTML, CSS, JavaScript, Bootstrap 5
- **Scan QR** : Bibliothèque HTML5-QRCode
- **Backend** : Node.js avec Express
- **Stockage** : Fichiers JSON
- **Fonctionnalités PWA** : Service Worker, Web App Manifest
- **Tests** : Jest, Puppeteer, Supertest

## Démarrage rapide

### Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Installation

1. Clonez le dépôt
   ```bash
   git clone https://github.com/pierrre2db/qr-game.git
   cd qr-game
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Démarrez le serveur
   ```bash
   node server.js
   ```

4. Accédez à l'application
   - Interface joueur : http://localhost:3000/game-v3.html
   - Interface admin : http://localhost:3000/admin.html

## Tests

Le projet comprend un ensemble complet de tests automatiques :

```bash
# Exécuter tous les tests
npm test

# Tester le parcours utilisateur complet
node test-user-journey.js

# Tester toutes les questions
node test-all-questions.js
```

## Contribution

Les contributions sont les bienvenues ! Voici comment contribuer au projet :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pierre - [@pierrre2db](https://github.com/pierrre2db)

Lien du projet : [https://github.com/pierrre2db/qr-game](https://github.com/pierrre2db/qr-game)

## Comment jouer

1. Commencez une nouvelle partie ou reprenez une partie existante
2. Scannez les QR codes pour répondre aux questions
3. Chaque QR code doit contenir une URL au format: `https://yourdomain.com/game?q=QUESTION_ID`
4. Répondez à toutes les questions pour terminer le jeu

## Administration

L'application inclut une interface d'administration complète pour gérer les questions, générer des QR codes et consulter les statistiques:

- Tableau de bord: `/admin-dashboard.html`
- Gestion des questions: `/admin-questions.html`
- Génération de QR codes: `/admin-qrcodes.html`
- Paramètres: `/admin-settings.html`

## Documentation

### Manuels utilisateur
- [Guide d'utilisation complet](GUIDE-UTILISATEUR.md) - Manuel détaillé pour les joueurs et les administrateurs
- [Guide d'interface](GUIDE-INTERFACE.md) - Documentation technique des interfaces

### Tests
Le projet inclut plusieurs suites de tests pour garantir le bon fonctionnement:

- **Tests API**: Vérification des endpoints backend
- **Tests fonctionnels**: Tests end-to-end des principaux flux utilisateurs
- **Tests d'intégrité des données**: Garantie de la cohérence et de la validation des données

### Plan de test d'administration
Un plan de test complet pour l'interface d'administration est disponible à:
[tests/admin-test-plan.md](tests/admin-test-plan.md)

Ce plan couvre tous les aspects de l'interface d'administration, notamment:
- Navigation et accessibilité
- Fonctionnalités du tableau de bord
- Gestion des questions
- Génération de QR codes
- Paramètres et sécurité
- Intégrité des données

## Sauvegarde et restauration

L'application inclut des fonctionnalités intégrées de sauvegarde et de restauration:

```bash
# Créer une sauvegarde
node backup.js backup

# Restaurer depuis la sauvegarde la plus récente
node backup.js restore

# Restaurer depuis une sauvegarde spécifique
node backup.js restore /chemin/vers/sauvegarde
```

Les sauvegardes incluent à la fois les questions et les données de réponse, garantissant que vous pouvez toujours récupérer l'état de votre jeu.

## Déploiement

Cette application peut être déployée sur n'importe quel service d'hébergement statique ou plateforme d'hébergement Node.js comme Netlify, Vercel ou Heroku.

## Variables d'environnement

- `PORT`: Port du serveur (par défaut: 3000)
- `ADMIN_PASSWORD`: Mot de passe administrateur pour les opérations sensibles (par défaut: `qrgame2025`)

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
