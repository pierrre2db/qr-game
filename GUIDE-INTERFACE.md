# Guide d'utilisation de QR Game - DJ Zone

Ce document explique comment utiliser les différentes interfaces de QR Game pour administrer et jouer au jeu.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Page d'accueil](#page-daccueil)
3. [Éditeur JSON](#éditeur-json)
4. [Page de test des questions](#page-de-test-des-questions)
5. [Interface de jeu](#interface-de-jeu)
6. [Structure des données](#structure-des-données)
7. [Astuces et conseils](#astuces-et-conseils)

## Vue d'ensemble

QR Game - DJ Zone est une application web qui permet de créer et gérer un jeu de questions-réponses avec différents types de questions :
- Questions à choix multiples (QCM)
- Questions textuelles
- Questions numériques (pour les questions subsidiaires)
- Champs de commentaires (pour la fin du jeu)

L'application est composée de plusieurs interfaces accessibles depuis la page d'accueil.

## Page d'accueil

**URL** : http://localhost:3000

La page d'accueil vous donne accès à toutes les fonctionnalités de l'application :

- **Lancer le jeu** : Accéder à l'interface principale du jeu pour les participants
- **Scanner un QR Code** : Accéder à l'interface de scan de QR codes (fonctionnalité future)
- **Administration** : Accéder à l'interface d'administration (version simplifiée)
- **Éditeur JSON** : Accéder à l'interface d'édition des questions au format JSON
- **Tester les questions** : Accéder à l'interface de test des questions

## Éditeur JSON

**URL** : http://localhost:3000/json-editor.html

L'éditeur JSON est l'outil principal pour gérer les questions du jeu.

### Fonctionnalités

- **Importer des questions** : Charger un fichier JSON contenant des questions
- **Exporter les questions** : Télécharger toutes les questions au format JSON
- **Éditer directement** : Modifier le JSON des questions dans l'éditeur
- **Formater** : Mettre en forme le JSON pour une meilleure lisibilité
- **Enregistrer** : Sauvegarder les modifications dans le fichier de questions

### Comment utiliser l'éditeur JSON

1. **Visualiser les questions** : Les questions sont automatiquement chargées à l'ouverture de la page
2. **Modifier une question** : Modifiez directement le texte JSON dans l'éditeur
3. **Ajouter une question** : Ajoutez un nouvel objet question dans le tableau `questions`
4. **Formater le JSON** : Cliquez sur le bouton "Formater" pour mettre en forme le JSON
5. **Enregistrer** : Cliquez sur "Enregistrer" pour sauvegarder vos modifications

## Page de test des questions

**URL** : http://localhost:3000/test-questions.html

Cette page vous permet de tester toutes les questions du jeu pour vérifier qu'elles s'affichent correctement.

### Fonctionnalités

- **Visualiser toutes les questions** : Voir comment les questions s'afficheront pour les joueurs
- **Tester les réponses** : Soumettre des réponses de test pour vérifier le fonctionnement
- **Simuler un joueur** : Entrer un nom et un ID de joueur pour simuler une session de jeu

### Comment utiliser la page de test

1. **Entrez les informations du joueur** : Remplissez les champs "ID du joueur" et "Nom du joueur"
2. **Parcourez les questions** : Toutes les questions sont affichées sur la page
3. **Répondez aux questions** : Sélectionnez ou entrez des réponses
4. **Soumettez les réponses** : Cliquez sur "Soumettre la réponse" pour chaque question
5. **Vérifiez les résultats** : Un message vous indique si la réponse est correcte ou non

## Interface de jeu

**URL** : http://localhost:3000/game.html

C'est l'interface principale que les joueurs utiliseront pour participer au jeu.

### Fonctionnalités

- **Écran d'accueil** : Permet aux joueurs d'entrer leur nom et email
- **Questions séquentielles** : Présente les questions une par une
- **Calcul du score** : Affiche et calcule le score en temps réel
- **Question subsidiaire** : Permet de répondre à la question subsidiaire à la fin du jeu
- **Commentaire final** : Permet de laisser un commentaire sur l'expérience de jeu

### Comment utiliser l'interface de jeu

1. **Commencer le jeu** : Entrez votre nom et email (optionnel), puis cliquez sur "Commencer le jeu"
2. **Répondre aux questions** : Sélectionnez ou entrez votre réponse, puis cliquez sur "Suivant"
3. **Voir votre score** : À la fin du jeu, votre score s'affiche
4. **Répondre à la question subsidiaire** : Entrez votre réponse à la question subsidiaire
5. **Laisser un commentaire** : Partagez votre expérience dans le champ de commentaire
6. **Envoyer vos résultats** : Cliquez sur "Envoyer mes résultats" pour terminer

## Structure des données

### Format des questions (questions.json)

```json
{
  "questions": [
    {
      "id": "Q1",
      "title": "Titre de la question",
      "description": "Texte de la question",
      "type": "standard",
      "points": 1,
      "order": 1,
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1"
    },
    {
      "id": "Q2",
      "title": "Question subsidiaire",
      "description": "Combien de personnes vont participer au jeu ?",
      "type": "number",
      "points": 0,
      "order": 2,
      "minValue": 0,
      "maxValue": 1000,
      "correctAnswer": "342"
    },
    {
      "id": "Q3",
      "title": "Commentaire final",
      "description": "Partagez votre expérience",
      "type": "comment",
      "order": 3,
      "isEndGame": true,
      "points": 0
    }
  ]
}
```

### Types de questions disponibles

- **standard** : Question à choix multiples (QCM)
- **text** : Question à réponse textuelle libre
- **number** : Question numérique (idéale pour les questions subsidiaires)
- **comment** : Champ de commentaire (souvent utilisé en fin de jeu)

### Format des réponses (responses.json)

```json
{
  "responses": [
    {
      "playerId": "JOUEUR123",
      "playerName": "Nom du joueur",
      "questionId": "Q1",
      "response": "Option 1",
      "timestamp": "2025-04-25T09:40:18.884Z",
      "timeSpent": 65,
      "isCorrect": true
    }
  ]
}
```

## Astuces et conseils

### Pour l'administration

- **Sauvegardez régulièrement** : Exportez vos questions régulièrement pour éviter toute perte de données
- **Testez vos questions** : Utilisez la page de test pour vérifier que vos questions fonctionnent correctement
- **Ordre des questions** : Utilisez le champ `order` pour définir l'ordre d'affichage des questions
- **Points** : Attribuez des points différents selon la difficulté des questions

### Pour le jeu

- **Question subsidiaire** : Utilisez une question de type `number` avec le titre "Question subsidiaire"
- **Commentaire final** : Ajoutez une question de type `comment` avec `isEndGame: true` pour recueillir les impressions des joueurs
- **Navigation** : Les joueurs peuvent naviguer entre les questions avec les boutons "Précédent" et "Suivant"
- **Résultats** : Toutes les réponses sont enregistrées dans le fichier `responses.json`

---

Pour toute question ou assistance supplémentaire, n'hésitez pas à consulter le manuel utilisateur complet ou à contacter l'administrateur du système.
