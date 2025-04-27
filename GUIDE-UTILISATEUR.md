# Guide d'utilisation QR Game

Ce manuel utilisateur complet explique comment utiliser toutes les fonctionnalités de QR Game, tant pour les administrateurs que pour les joueurs.

## Table des matières

1. [Introduction](#introduction)
2. [Pour les joueurs](#pour-les-joueurs)
   - [Accéder au jeu](#accéder-au-jeu)
   - [Jouer au jeu](#jouer-au-jeu)
   - [Scanner des QR codes](#scanner-des-qr-codes)
   - [Suivre sa progression](#suivre-sa-progression)
3. [Pour les administrateurs](#pour-les-administrateurs)
   - [Vue d'ensemble des interfaces d'administration](#vue-densemble-des-interfaces-dadministration)
   - [Tableau de bord](#tableau-de-bord)
   - [Gestion des questions](#gestion-des-questions)
   - [Génération de QR codes](#génération-de-qr-codes)
   - [Paramètres](#paramètres)
   - [Sauvegarde et restauration](#sauvegarde-et-restauration)
4. [Types de questions](#types-de-questions)
5. [Structure des données](#structure-des-données)
6. [Astuces et bonnes pratiques](#astuces-et-bonnes-pratiques)
7. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Introduction

QR Game est une application web qui permet de créer et gérer un jeu de questions-réponses interactif utilisant des QR codes. Les joueurs peuvent scanner des QR codes pour accéder aux questions et y répondre, tandis que les administrateurs peuvent gérer les questions, générer des QR codes et suivre les statistiques des joueurs.

## Pour les joueurs

### Accéder au jeu

Il existe plusieurs façons d'accéder au jeu :

1. **Directement via l'URL** : Accédez à `http://localhost:3000/game.html`
2. **Depuis la page d'accueil** : Accédez à `http://localhost:3000` et cliquez sur "Lancer le jeu"
3. **En scannant un QR code** : Scannez n'importe quel QR code du jeu pour accéder directement à une question spécifique

### Jouer au jeu

1. **Écran d'accueil** :
   - Entrez votre nom dans le champ "Nom du joueur"
   - Cliquez sur "Commencer le jeu"

2. **Répondre aux questions** :
   - Pour les questions à choix multiples (QCM) : Cliquez sur l'option de votre choix
   - Pour les questions textuelles : Tapez votre réponse dans le champ de texte et cliquez sur "Soumettre"
   - Pour les questions numériques : Entrez un nombre et cliquez sur "Soumettre"
   - Pour les commentaires : Rédigez votre commentaire et cliquez sur "Soumettre"

3. **Progression** :
   - Une barre de progression en haut de l'écran indique votre avancement
   - Vous pouvez voir le nombre de questions répondues et le nombre total de questions

### Scanner des QR codes

Chaque QR code contient un lien vers une question spécifique. Pour scanner un QR code :

1. Utilisez l'appareil photo de votre smartphone ou une application de scan de QR code
2. Pointez l'appareil vers le QR code
3. Cliquez sur le lien qui apparaît
4. Vous serez redirigé vers la question correspondante dans le jeu

### Suivre sa progression

Le jeu sauvegarde automatiquement votre progression dans le stockage local de votre navigateur. Cela signifie que :

- Vous pouvez quitter le jeu et y revenir plus tard sans perdre votre progression
- Vous pouvez répondre aux questions dans n'importe quel ordre
- Vous verrez quelles questions vous avez déjà répondues

## Pour les administrateurs

### Vue d'ensemble des interfaces d'administration

QR Game propose plusieurs interfaces d'administration accessibles via les URLs suivantes :

- **Page d'accueil admin** : `http://localhost:3000/admin-index.html`
- **Tableau de bord** : `http://localhost:3000/admin-dashboard.html`
- **Gestion des questions** : `http://localhost:3000/admin-questions.html`
- **Génération de QR codes** : `http://localhost:3000/admin-qrcodes.html`
- **Paramètres** : `http://localhost:3000/admin-settings.html`

### Tableau de bord

Le tableau de bord (`admin-dashboard.html`) vous permet de :

- Voir le nombre total de questions, réponses et joueurs uniques
- Consulter les statistiques de réussite pour chaque question
- Visualiser l'activité récente des joueurs
- Réinitialiser les statistiques (avec protection par mot de passe)

**Pour réinitialiser les statistiques** :

1. Cliquez sur le bouton "Réinitialiser les statistiques"
2. Dans le modal qui s'affiche, entrez le mot de passe administrateur (par défaut : "qrgame2025")
3. Cliquez sur "Réinitialiser"
4. Une sauvegarde des données sera automatiquement créée avant la réinitialisation

### Gestion des questions

L'interface de gestion des questions (`admin-questions.html`) vous permet de :

- Voir toutes les questions existantes dans un tableau
- Ajouter de nouvelles questions
- Modifier des questions existantes
- Supprimer des questions
- Importer/exporter des questions au format JSON

**Pour ajouter une question** :

1. Cliquez sur le bouton "Ajouter une question"
2. Remplissez le formulaire :
   - ID : Identifiant unique de la question (ex: Q8)
   - Titre : Titre court de la question
   - Description : Texte complet de la question
   - Type : Choisissez parmi standard (QCM), text, number ou comment
   - Points : Nombre de points attribués pour une réponse correcte
   - Ordre : Position de la question dans la séquence
   - Options : Pour les questions de type standard, ajoutez les options de réponse
   - Réponse correcte : Pour les questions de type standard ou number, indiquez la réponse correcte
3. Cliquez sur "Enregistrer"

**Pour importer des questions** :

1. Cliquez sur "Importer (JSON)"
2. Sélectionnez un fichier JSON contenant des questions au format approprié
3. Cliquez sur "Importer"

**Pour exporter des questions** :

1. Cliquez sur "Exporter (JSON)"
2. Le fichier JSON sera téléchargé automatiquement

### Génération de QR codes

L'interface de génération de QR codes (`admin-qrcodes.html`) vous permet de :

- Générer des QR codes pour toutes les questions
- Personnaliser l'apparence des QR codes (taille, couleurs)
- Télécharger les QR codes individuellement
- Imprimer tous les QR codes en une seule fois
- Tester les QR codes

**Pour générer des QR codes** :

1. Configurez les options :
   - Taille : Dimensions du QR code en pixels
   - Couleur : Couleur des modules du QR code
   - Arrière-plan : Couleur de fond du QR code
   - URL de base : URL de base à laquelle l'ID de question sera ajouté
2. Cliquez sur "Générer tous"
3. Les QR codes seront générés pour toutes les questions

**Pour télécharger un QR code** :

1. Cliquez sur le bouton "Télécharger" sous le QR code souhaité
2. Le QR code sera téléchargé au format PNG

**Pour imprimer tous les QR codes** :

1. Cliquez sur "Imprimer tous"
2. Une nouvelle fenêtre s'ouvrira avec tous les QR codes formatés pour l'impression
3. Utilisez la fonction d'impression de votre navigateur pour imprimer la page

### Paramètres

L'interface de paramètres (`admin-settings.html`) vous permet de :

- Configurer les paramètres généraux de l'application
- Gérer la sécurité
- Créer et restaurer des sauvegardes
- Effectuer des opérations de maintenance

**Paramètres généraux** :

- Titre du jeu : Nom affiché dans l'interface
- URL de base : URL principale de l'application
- Email de l'administrateur : Contact principal
- Couleurs : Personnalisation de l'apparence

**Sécurité** :

- Mot de passe administrateur : Pour protéger les fonctions sensibles
- Authentification : Activer/désactiver l'authentification pour l'accès à l'administration

**Maintenance** :

- Réinitialiser les statistiques : Effacer toutes les réponses des joueurs
- Vider le cache : Nettoyer le cache du navigateur pour l'application

### Sauvegarde et restauration

QR Game inclut des fonctionnalités de sauvegarde et restauration accessibles via :

1. **L'interface graphique** (dans la page des paramètres) :
   - Cliquez sur "Créer une sauvegarde" pour sauvegarder les données
   - Utilisez "Restaurer depuis une sauvegarde" pour restaurer les données

2. **La ligne de commande** :
   ```bash
   # Créer une sauvegarde
   node backup.js backup

   # Restaurer depuis la sauvegarde la plus récente
   node backup.js restore

   # Restaurer depuis une sauvegarde spécifique
   node backup.js restore /chemin/vers/sauvegarde
   ```

Les sauvegardes incluent à la fois les questions et les réponses des joueurs.

## Types de questions

QR Game supporte quatre types de questions :

1. **standard** : Questions à choix multiples (QCM)
   - Propriétés requises : options, correctAnswer
   - Exemple : "Quel est l'ingrédient principal d'un roux ?"

2. **text** : Questions à réponse textuelle libre
   - Propriétés requises : correctAnswer (optionnelle)
   - Exemple : "Nommez un chef célèbre."

3. **number** : Questions numériques
   - Propriétés requises : correctAnswer (pour vérification)
   - Propriétés optionnelles : minValue, maxValue, margin (marge d'erreur acceptable)
   - Exemple : "Combien de personnes vont participer au jeu ?"

4. **comment** : Champs de commentaires
   - Propriétés optionnelles : isEndGame (true pour indiquer la fin du jeu)
   - Exemple : "Partagez votre expérience de jeu."

## Structure des données

### Format des questions (questions.json)

```json
{
  "questions": [
    {
      "id": "Q1",
      "title": "Ingrédients d'un roux",
      "description": "De quels ingrédients avez-vous besoin pour créer un roux :",
      "type": "standard",
      "points": 1,
      "order": 1,
      "options": [
        "Crème fraiche et oeufs",
        "Beurre et farine",
        "Sucre de canne et carotte",
        "Poisson du jour et huile d'olive"
      ],
      "correctAnswer": "Beurre et farine"
    },
    {
      "id": "Q7",
      "title": "Question subsidiaire",
      "description": "Combien de personnes vont participer au jeu ?",
      "type": "number",
      "points": 0,
      "order": 7,
      "correctAnswer": "342",
      "margin": 10
    }
  ]
}
```

### Format des réponses (responses.json)

```json
{
  "responses": [
    {
      "playerId": "JOUEUR123",
      "playerName": "Joueur Test",
      "questionId": "Q1",
      "response": "Beurre et farine",
      "timestamp": "2025-04-25T09:40:18.884Z",
      "timeSpent": 65,
      "questionType": "standard",
      "isCorrect": true
    }
  ]
}
```

## Astuces et bonnes pratiques

### Pour l'administration

- **Sauvegardez régulièrement** : Créez des sauvegardes avant d'apporter des modifications importantes
- **Testez vos questions** : Vérifiez que toutes les questions fonctionnent correctement avant de les publier
- **Utilisez des IDs explicites** : Choisissez des IDs qui décrivent le contenu de la question (ex: Q_ROUX pour une question sur le roux)
- **Personnalisez les QR codes** : Utilisez des couleurs qui correspondent à votre thème ou à différentes catégories de questions
- **Organisez les questions** : Utilisez le champ `order` pour définir une séquence logique

### Pour le jeu

- **Progression libre** : Les joueurs peuvent répondre aux questions dans n'importe quel ordre
- **Sauvegarde automatique** : La progression est automatiquement sauvegardée dans le navigateur
- **Question subsidiaire** : Utilisez une question de type `number` avec une marge d'erreur appropriée
- **Commentaire final** : Ajoutez une question de type `comment` avec `isEndGame: true` pour recueillir les impressions

## Résolution des problèmes courants

### Problèmes d'affichage

- **Les QR codes ne s'affichent pas** : Vérifiez votre connexion internet et que le service de génération de QR codes est accessible
- **Interface mal affichée** : Essayez de vider le cache du navigateur ou utilisez le bouton "Vider le cache" dans les paramètres

### Problèmes de données

- **Perte de données** : Utilisez la fonction de restauration pour récupérer une sauvegarde antérieure
- **Questions non sauvegardées** : Vérifiez que vous avez bien cliqué sur "Enregistrer" après avoir modifié les questions
- **Statistiques incorrectes** : Réinitialisez les statistiques si nécessaire (avec le mot de passe administrateur)

### Problèmes de serveur

- **Serveur inaccessible** : Vérifiez que le serveur Node.js est en cours d'exécution
- **Erreur API** : Redémarrez le serveur pour appliquer les dernières modifications
- **Commande** : `node server.js` pour démarrer le serveur

---

Pour toute assistance supplémentaire ou pour signaler un problème, veuillez contacter l'administrateur du système.

*Dernière mise à jour : 27 avril 2025*
