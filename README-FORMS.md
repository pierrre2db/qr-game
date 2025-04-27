# Intégration avec Google Forms pour QR Game

Ce document explique comment configurer l'intégration avec Google Forms pour collecter les données des joueurs du QR Game.

## Prérequis

- Un compte Google
- Accès à Google Drive et Google Apps Script
- Un formulaire Google Forms (ou les droits pour en créer un)

## Configuration de Google Apps Script

1. Accédez à [Google Apps Script](https://script.google.com/)
2. Créez un nouveau projet
3. Copiez le contenu du fichier `/google-apps-script/form-integration.js` dans l'éditeur
4. Enregistrez le projet avec un nom approprié (par exemple "QR Game - Integration")

## Création du formulaire Google Forms

1. Dans l'éditeur Apps Script, exécutez la fonction `testFormCreation` en cliquant sur le bouton "Exécuter"
2. Autorisez les permissions nécessaires lorsque vous y êtes invité
3. Vérifiez les journaux d'exécution pour obtenir l'ID du formulaire créé
4. Copiez cet ID et remplacez la constante `FORM_ID` dans le script

## Déploiement en tant que service web

1. Cliquez sur "Déployer" > "Nouveau déploiement"
2. Sélectionnez "Application web" comme type de déploiement
3. Configurez les options suivantes :
   - Description : "QR Game Forms Integration"
   - Exécuter en tant que : "Moi"
   - Qui a accès : "Tout le monde" (ou "Tout le monde dans votre organisation" si vous préférez)
4. Cliquez sur "Déployer"
5. Copiez l'URL de déploiement web qui vous est fournie

## Configuration de l'application QR Game

1. Ouvrez le fichier `/public/js/forms-integration.js`
2. Remplacez la valeur de `this.scriptUrl` par l'URL de déploiement web que vous avez copiée

## Test de l'intégration

1. Lancez l'application QR Game
2. Complétez un jeu
3. Vérifiez que les données sont correctement soumises au formulaire Google Forms

## Structure des données soumises

Les données suivantes sont envoyées au formulaire Google Forms :

- **ID Joueur** : Un identifiant unique basé sur l'horodatage
- **Nom du Joueur** : Le nom saisi par le joueur
- **Niveau Atteint** : Le dernier niveau/défi complété par le joueur
- **Date et Heure de Complétion** : Quand le joueur a terminé le jeu
- **Commentaires** : Contient l'email du joueur s'il a été fourni

## Fonctionnalités de résilience

L'intégration inclut plusieurs fonctionnalités pour garantir que les données ne sont pas perdues :

- **Mode hors ligne** : Les données sont stockées localement si l'appareil est hors ligne
- **Nouvelle tentative automatique** : Les données stockées sont automatiquement soumises lorsque la connexion est rétablie
- **Gestion des erreurs** : Les erreurs sont capturées et affichées à l'utilisateur

## Personnalisation du formulaire

Vous pouvez personnaliser le formulaire Google Forms créé automatiquement :

1. Accédez au formulaire via l'URL d'édition fournie dans les journaux d'exécution
2. Modifiez le formulaire selon vos besoins
3. Assurez-vous de ne pas supprimer les questions existantes, car elles sont utilisées par le script

## Récupération des données

Les réponses au formulaire peuvent être consultées de plusieurs façons :

1. Directement dans Google Forms en cliquant sur l'onglet "Réponses"
2. En liant le formulaire à une feuille de calcul Google Sheets
3. En utilisant l'API Google Forms pour récupérer les données programmatiquement

## Dépannage

Si vous rencontrez des problèmes avec l'intégration :

1. Vérifiez les journaux de la console du navigateur pour les erreurs
2. Assurez-vous que l'URL de déploiement web est correcte
3. Vérifiez que le formulaire Google Forms existe et que son ID est correct
4. Assurez-vous que les autorisations sont correctement configurées
