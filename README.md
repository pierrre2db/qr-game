# QR Game - PWA QR Scanner App with Deep Linking

Une application web progressive (PWA) permettant aux utilisateurs de scanner des QR codes dans le cadre d'une expérience de jeu interactive. L'application prend en charge les liens profonds vers des questions spécifiques.

## Fonctionnalités

### Interface joueur
- Application web progressive (installable sur les appareils)
- Fonctionnalité de scan de QR codes
- Liens profonds vers des questions spécifiques
- Support hors ligne via la mise en cache du service worker
- Suivi et persistance de la progression du jeu
- Interface responsive adaptée à tous les appareils

### Interface administrateur
- Tableau de bord avec statistiques en temps réel
- Gestion complète des questions (CRUD)
- Génération de QR codes personnalisables
- Import/export de questions au format JSON
- Réinitialisation des statistiques (protégée par mot de passe)
- Sauvegarde et restauration des données
- Paramètres configurables

## Stack technique

- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Scan QR: Bibliothèque HTML5-QRCode
- Backend: Node.js avec Express
- Stockage: Fichiers JSON
- Fonctionnalités PWA: Service Worker, Web App Manifest
- Visualisation: Chart.js
- Tests: Jest, Puppeteer, Supertest

## Démarrage rapide

### Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Installation

1. Clonez le dépôt
2. Installez les dépendances:
   ```
   npm install
   ```
3. Démarrez le serveur de développement:
   ```
   node server.js
   ```
4. Ouvrez votre navigateur et accédez à `http://localhost:3000`

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
