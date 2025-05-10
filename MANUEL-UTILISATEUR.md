# Manuel Utilisateur - QR Game CEFOR

## Présentation du projet

QR Game est une application web progressive (PWA) développée pour le CEFOR (Centre de Formation) permettant de créer et gérer une chasse au trésor interactive basée sur des codes QR. L'application est entièrement modulaire et s'adapte automatiquement au contenu du fichier JSON de configuration.

Le jeu comprend deux composantes principales :

1. **Application mobile pour les joueurs** : Interface intuitive permettant de scanner des QR codes placés dans l'environnement et de répondre aux questions dans n'importe quel ordre.

2. **Interface d'administration** : Permet de gérer les questions via un fichier JSON, de générer des QR codes pour impression, et d'identifier le gagnant à la fin de l'événement.

## Architecture technique

### Structure du projet

```
qr-game/
├── public/               # Contenu statique servi par Express
│   ├── css/              # Styles CSS
│   ├── js/               # Scripts JavaScript
│   │   ├── admin/        # Scripts pour l'interface d'administration
│   │   ├── app.js        # Script principal de l'application
│   │   ├── qrscanner.js  # Module de scan QR
│   │   └── ...
│   ├── index.html        # Page principale de l'application
│   ├── admin.html        # Interface d'administration
│   ├── manifest.json     # Manifest PWA
│   └── service-worker.js # Service Worker pour fonctionnalités offline
├── google-apps-script/   # Scripts pour l'intégration Google Forms
├── scripts/              # Scripts utilitaires (génération QR, etc.)
├── server.js             # Serveur Express
└── package.json          # Dépendances et scripts
```

### Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Backend** : Node.js avec Express
- **PWA** : Service Worker, Web App Manifest
- **Scan QR** : HTML5-QRCode
- **Génération QR** : QRCode.js
- **Graphiques** : Chart.js
- **Intégration** : Google Apps Script pour Google Forms

## Prérequis d'installation

- Node.js (v14+)
- npm (v6+)
- Un compte Google pour l'intégration Google Forms (optionnel)

## Installation et démarrage

1. Cloner le dépôt :
   ```
   git clone <url-du-repo>
   cd qr-game
   ```

2. Installer les dépendances :
   ```
   npm install
   ```

3. Démarrer le serveur de développement :
   ```
   npm run dev
   ```

4. Accéder à l'application :
   - Application principale : http://localhost:3000
   - Interface d'administration : http://localhost:3000/admin.html

## Configuration

### Configuration de base (.env)

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
PORT=3000
NODE_ENV=development
```

### Configuration de l'intégration Google Forms

1. Créez un nouveau script Google Apps Script
2. Copiez le contenu du fichier `google-apps-script/form-integration.js`
3. Déployez le script en tant que service web
4. Copiez l'URL du déploiement
5. Dans l'interface d'administration, allez dans "Paramètres" > "Intégration Google Forms" et collez l'URL

## Fonctionnalités principales

### Interface joueur

- **Scan de codes QR** : Utilisation de la caméra pour scanner des codes QR
- **Deep linking** : Accès direct aux défis via URL ou QR code
- **Progression** : Suivi de l'avancement du joueur
- **Mode hors ligne** : Fonctionnalité disponible sans connexion internet
- **Partage** : Partage des résultats via l'API Web Share

### Interface administrateur

- **Tableau de bord** : Vue d'ensemble des statistiques
- **Gestion des questions** : Création, modification, suppression des défis
- **Statistiques** : Visualisation des données de jeu
- **Exportation** : Export des données en CSV/JSON
- **Paramètres** : Configuration de l'application

## Utilisation de l'interface d'administration

### Accès à l'administration

1. Accédez à http://localhost:3000/admin.html
2. Connectez-vous avec les identifiants par défaut :
   - Nom d'utilisateur : `admin`
   - Mot de passe : `admin123`

### Gestion des questions

1. Accédez à l'onglet "Questions"
2. Cliquez sur "Ajouter" pour créer une nouvelle question
3. Remplissez les champs requis :
   - ID : Identifiant unique (généré automatiquement)
   - Titre : Titre de la question
   - Description : Contenu de la question
   - Type : Type de question (standard, début, fin, etc.)
   - Points : Nombre de points attribués
4. Ajoutez des options de réponse si nécessaire
5. Cliquez sur "Enregistrer"

### Génération de codes QR

1. Dans l'onglet "Questions", cliquez sur l'icône QR code à côté d'une question
2. Ou utilisez le menu déroulant "Importer/Exporter" et sélectionnez "Générer QR codes"
3. Téléchargez les codes QR individuellement ou en lot (ZIP)

### Exportation des données

1. Accédez à l'onglet "Exportation"
2. Choisissez le type de données à exporter (joueurs, questions, statistiques)
3. Sélectionnez le format (JSON ou CSV)
4. Cliquez sur le bouton d'exportation correspondant

### Configuration de l'application

1. Accédez à l'onglet "Paramètres"
2. Configurez les différentes sections :
   - Paramètres généraux : Titre, URL de base, couleurs
   - Intégration Google Forms : URL du script, options
   - Paramètres du jeu : Points, limites de temps, options

## Intégration Google Forms

L'application peut collecter les données des joueurs via Google Forms :

1. Configurez l'URL du script Google Apps Script dans les paramètres
2. Activez l'option "Support hors ligne" pour permettre la soumission différée
3. Les données des joueurs seront automatiquement envoyées au formulaire

## Personnalisation

### Branding

1. Dans les paramètres, modifiez :
   - Le titre du jeu
   - L'URL du logo
   - Les couleurs primaire et secondaire

### Styles CSS

Pour des personnalisations plus avancées, modifiez les fichiers :
- `public/css/styles.css` pour l'interface joueur
- `public/css/admin.css` pour l'interface administrateur

## Déploiement en production

1. Construisez l'application pour la production :
   ```
   npm run build
   ```

2. Déployez les fichiers sur votre serveur web ou plateforme d'hébergement
3. Configurez les variables d'environnement en production
4. Assurez-vous que le service worker est correctement enregistré

## Dépannage

### Problèmes courants

- **Caméra non accessible** : Vérifiez les permissions du navigateur
- **QR code non reconnu** : Assurez-vous d'avoir un éclairage suffisant
- **Données non synchronisées** : Vérifiez la connexion internet et l'URL du script Google

### Support

Pour toute question ou problème, consultez la documentation ou contactez l'administrateur système.

---

© 2025 QR Game - Tous droits réservés
