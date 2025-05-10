# Guide Technique - QR Game CEFOR

Ce document est destiné aux développeurs qui souhaitent comprendre l'architecture technique du QR Game CEFOR, le modifier ou l'étendre.

## Architecture globale

Le QR Game CEFOR est construit selon une architecture client-serveur simple :

- **Frontend** : Application web progressive (PWA) développée en HTML, CSS et JavaScript
- **Backend** : Serveur Node.js avec Express qui gère les API et le stockage des données

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
└── README.md                # Documentation
```

## Composants clés

### 1. Système de modularité

Le cœur de l'application repose sur sa modularité. Voici comment elle est implémentée :

```javascript
// Chargement dynamique des questions depuis le fichier JSON
async function loadQuestions() {
  try {
    const response = await fetch('/api/questions');
    const data = await response.json();
    window.questionsData = data;
    
    // Adaptation de l'interface en fonction du nombre de questions
    updateProgressBar();
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des questions:', error);
    showToast('Erreur lors du chargement des questions', 'error');
  }
}
```

Le système s'adapte automatiquement au contenu du fichier JSON, y compris :
- Le nombre total de questions
- Les types de questions (QCM, texte, numérique, commentaire)
- Les options de réponse pour chaque question

### 2. Navigation non-linéaire

La navigation non-linéaire est gérée par le système de scan de QR codes :

```javascript
// Fonction appelée lorsqu'un QR code est scanné
function onScanSuccess(decodedText) {
  try {
    // Extraire l'ID de la question du QR code
    const questionId = extractQuestionId(decodedText);
    
    // Vérifier si la question a déjà été répondue
    if (hasAnsweredQuestion(questionId)) {
      showToast('Vous avez déjà répondu à cette question', 'warning');
      return;
    }
    
    // Afficher la question correspondante
    displayQuestion(findQuestionById(questionId));
  } catch (error) {
    console.error('Erreur lors du traitement du QR code:', error);
    showToast('QR code invalide', 'error');
  }
}
```

### 3. Persistance des données

La persistance des données côté client est gérée via localStorage :

```javascript
// Sauvegarder la progression du joueur
function saveProgress(questionId, answer) {
  try {
    // Récupérer les données existantes
    let progress = JSON.parse(localStorage.getItem('qrGameProgress')) || {};
    
    // Mettre à jour avec la nouvelle réponse
    progress[questionId] = {
      answer: answer,
      timestamp: new Date().toISOString()
    };
    
    // Sauvegarder les données mises à jour
    localStorage.setItem('qrGameProgress', JSON.stringify(progress));
    
    // Mettre à jour l'interface
    updateProgressBar();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
  }
}
```

## API Backend

Le serveur Express expose plusieurs endpoints API :

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/questions` | GET | Récupérer toutes les questions |
| `/api/questions/:id` | GET | Récupérer une question spécifique |
| `/api/responses` | POST | Enregistrer une réponse |
| `/api/responses` | GET | Récupérer toutes les réponses (admin) |
| `/api/generate-qr` | POST | Générer des QR codes |

## Structure du fichier JSON de questions

```json
{
  "gameId": "cefor-quiz-2025",
  "title": "Quiz CEFOR 2025",
  "questions": [
    {
      "id": "Q1",
      "title": "Titre de la question",
      "description": "Texte complet de la question",
      "type": "standard",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": 2,
      "points": 10
    },
    // Autres questions...
  ]
}
```

## Comment étendre l'application

### Ajouter un nouveau type de question

1. Modifier le fichier `data/questions.json` pour inclure le nouveau type
2. Ajouter la logique d'affichage dans la fonction `displayQuestion` :

```javascript
function displayQuestion(question) {
  // Code existant...
  
  switch (question.type) {
    case 'standard':
      // Afficher une question à choix multiples
      break;
    case 'text':
      // Afficher une question à réponse textuelle
      break;
    case 'number':
      // Afficher une question à réponse numérique
      break;
    case 'comment':
      // Afficher un champ de commentaire
      break;
    case 'nouveau-type':
      // Logique pour le nouveau type de question
      break;
    default:
      console.error('Type de question non pris en charge:', question.type);
  }
}
```

3. Ajouter la logique de validation dans la fonction `validateAnswer`

### Implémenter les évolutions futures

#### Export CSV

Pour implémenter l'export CSV des données, ajouter un endpoint à `server.js` :

```javascript
app.get('/api/export-csv', authenticateAdmin, (req, res) => {
  try {
    // Lire les données des réponses
    const responses = JSON.parse(fs.readFileSync('./data/responses.json', 'utf8'));
    
    // Convertir en format CSV
    const csv = convertToCSV(responses);
    
    // Envoyer le fichier
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=responses.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    res.status(500).send('Erreur lors de l\'export CSV');
  }
});

function convertToCSV(data) {
  // Logique de conversion JSON vers CSV
}
```

#### Suivi en temps réel

Pour implémenter le suivi en temps réel, intégrer Socket.io :

1. Installer Socket.io : `npm install socket.io`
2. Configurer le serveur :

```javascript
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Nouvelle connexion:', socket.id);
  
  // Envoyer les données actuelles
  socket.emit('initial-data', getLatestResponses());
  
  // Écouter les nouvelles réponses
  socket.on('new-response', (data) => {
    // Sauvegarder la réponse
    saveResponse(data);
    
    // Diffuser à tous les administrateurs connectés
    io.emit('response-update', getLatestResponses());
  });
});
```

## Bonnes pratiques pour le développement

1. **Tests** : Utiliser les scripts de test existants pour vérifier que les modifications ne cassent pas les fonctionnalités existantes
2. **Modularité** : Maintenir la séparation des préoccupations entre les différents composants
3. **Documentation** : Documenter toute nouvelle fonctionnalité ou modification
4. **Compatibilité** : S'assurer que les modifications fonctionnent sur différents navigateurs et appareils

## Dépannage

### Problèmes courants et solutions

1. **Erreur de chargement des questions** :
   - Vérifier que le fichier `questions.json` est correctement formaté
   - Vérifier que le serveur est en cours d'exécution

2. **Problèmes de scan QR** :
   - Vérifier les permissions de la caméra
   - Vérifier que les QR codes sont correctement générés

3. **Problèmes de persistance** :
   - Vérifier que localStorage est disponible dans le navigateur
   - Vérifier que les données sont correctement formatées

## Ressources

- [Documentation HTML5-QRCode](https://github.com/mebjas/html5-qrcode)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
