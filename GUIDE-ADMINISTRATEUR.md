# Guide Administrateur - QR Game CEFOR

Ce document est destiné aux administrateurs du QR Game CEFOR qui souhaitent configurer le jeu, gérer les questions et générer les QR codes pour un événement.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration du jeu](#configuration-du-jeu)
3. [Gestion des questions](#gestion-des-questions)
4. [Génération des QR codes](#génération-des-qr-codes)
5. [Récupération des résultats](#récupération-des-résultats)
6. [Identification du gagnant](#identification-du-gagnant)
7. [Bonnes pratiques](#bonnes-pratiques)

## Vue d'ensemble

En tant qu'administrateur, vous êtes responsable de :
- Configurer le jeu via le fichier JSON
- Générer et imprimer les QR codes
- Placer les QR codes dans l'environnement physique
- Récupérer les données à la fin de la période de jeu
- Identifier le gagnant

## Configuration du jeu

### Accès à l'interface d'administration

1. Lancez le serveur : `node server.js`
2. Accédez à l'interface d'administration : http://localhost:3000/admin.html

### Configuration du fichier JSON

Le fichier JSON de configuration (`data/questions.json`) définit l'ensemble du jeu :

```json
{
  "gameId": "cefor-quiz-2025",
  "title": "Quiz CEFOR 2025",
  "description": "Découvrez la gastronomie et le CEFOR à travers ce quiz interactif",
  "questions": [
    {
      "id": "Q1",
      "title": "Ingrédients d'un roux",
      "description": "Quels sont les ingrédients principaux d'un roux?",
      "type": "standard",
      "options": [
        "Farine et eau",
        "Farine et beurre",
        "Farine et lait",
        "Farine et œuf"
      ],
      "correctAnswer": 1,
      "points": 10
    },
    // Autres questions...
  ]
}
```

### Types de questions disponibles

| Type | Description | Format de réponse |
|------|-------------|-------------------|
| `standard` | Question à choix multiples | Index de l'option correcte (commence à 0) |
| `text` | Question à réponse textuelle | Texte exact attendu (insensible à la casse) |
| `number` | Question à réponse numérique | Valeur numérique exacte |
| `comment` | Commentaire ou feedback | Pas de réponse correcte, stockage uniquement |

### Modification du fichier JSON

Vous pouvez modifier le fichier JSON de deux façons :

1. **Via l'interface d'administration** :
   - Accédez à l'onglet "Gestion des questions"
   - Utilisez l'éditeur intégré pour modifier le JSON
   - Cliquez sur "Sauvegarder les modifications"

2. **Directement via un éditeur de texte** :
   - Ouvrez le fichier `data/questions.json`
   - Modifiez le contenu selon vos besoins
   - Sauvegardez le fichier

**Important** : Le jeu s'adapte automatiquement au nombre de questions définies dans le fichier JSON. Vous pouvez ajouter, supprimer ou modifier des questions à volonté.

## Gestion des questions

### Ajouter une nouvelle question

Pour ajouter une nouvelle question, ajoutez un nouvel objet dans le tableau `questions` du fichier JSON :

```json
{
  "id": "Q8",
  "title": "Titre de la nouvelle question",
  "description": "Texte complet de la nouvelle question",
  "type": "standard",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  "correctAnswer": 2,
  "points": 10
}
```

### Modifier une question existante

Localisez la question à modifier dans le tableau `questions` et modifiez les propriétés selon vos besoins.

### Supprimer une question

Supprimez l'objet correspondant à la question du tableau `questions`.

## Génération des QR codes

### Générer les QR codes

1. Accédez à l'onglet "Génération QR" dans l'interface d'administration
2. Cliquez sur "Générer tous les QR codes"
3. Les QR codes seront générés pour chaque question définie dans le fichier JSON

### Exporter les QR codes en PDF

1. Une fois les QR codes générés, cliquez sur "Exporter en PDF"
2. Un fichier PDF sera généré avec tous les QR codes
3. Chaque QR code inclura le titre de la question correspondante en dessous

### Impression des QR codes

1. Ouvrez le fichier PDF généré
2. Imprimez le document en utilisant les paramètres d'impression de votre navigateur
3. Recommandation : utilisez du papier épais ou plastifiez les QR codes pour une meilleure durabilité

## Récupération des résultats

À la fin de la période de jeu, vous pouvez récupérer les résultats des joueurs :

1. Accédez à l'onglet "Résultats" dans l'interface d'administration
2. Vous verrez un tableau récapitulatif de tous les joueurs et leurs réponses
3. Les données sont également disponibles dans le fichier `data/responses.json`

## Identification du gagnant

Pour identifier le gagnant à la fin de l'événement :

1. Accédez à l'onglet "Résultats" dans l'interface d'administration
2. Cliquez sur "Calculer les scores"
3. Le système calculera automatiquement les scores en fonction des réponses correctes et des points attribués à chaque question
4. Le joueur avec le score le plus élevé sera mis en évidence comme gagnant

En cas d'égalité, le système prendra en compte le temps total pour départager les joueurs.

## Bonnes pratiques

### Placement des QR codes

- Placez les QR codes dans des endroits facilement accessibles
- Assurez-vous que l'éclairage est suffisant pour permettre le scan
- Évitez de placer les QR codes trop près les uns des autres pour éviter la confusion
- Considérez l'ordre logique de découverte, même si le jeu permet une navigation non-linéaire

### Sauvegarde des données

- Effectuez régulièrement des sauvegardes du fichier `data/questions.json`
- Après chaque événement, sauvegardez le fichier `data/responses.json` pour conserver l'historique

### Préparation d'un événement

1. Modifiez le fichier JSON selon les besoins de l'événement
2. Générez et imprimez les nouveaux QR codes
3. Testez le parcours complet avant l'événement
4. Préparez un plan de secours en cas de problèmes techniques

### Après l'événement

1. Récupérez les données des joueurs
2. Identifiez le gagnant
3. Archivez les résultats pour référence future
4. Réinitialisez le fichier `data/responses.json` pour le prochain événement

## Résolution des problèmes courants

| Problème | Solution |
|----------|----------|
| Les QR codes ne se génèrent pas | Vérifiez que le fichier JSON est correctement formaté |
| Certains joueurs ne peuvent pas scanner les QR codes | Vérifiez l'éclairage et la qualité d'impression des QR codes |
| Les résultats ne s'affichent pas correctement | Vérifiez que le fichier `data/responses.json` n'est pas corrompu |
| Le calcul du gagnant ne fonctionne pas | Vérifiez que les questions ont des valeurs correctes pour `correctAnswer` et `points` |
