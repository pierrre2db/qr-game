# Guide de configuration Google Sheet pour QR Game

Ce document explique comment configurer un Google Sheet et l'intégration Google Apps Script pour l'application QR Game.

## 1. Création du Google Sheet

### 1.1. Créer une nouvelle feuille de calcul

1. Connectez-vous à votre compte Google
2. Accédez à [Google Sheets](https://sheets.google.com)
3. Cliquez sur le bouton "+" pour créer une nouvelle feuille de calcul
4. Renommez la feuille en "QR Game Data" (ou le nom de votre choix)

### 1.2. Configuration des onglets et colonnes

Créez les onglets suivants dans votre feuille de calcul :

#### Onglet "Réponses" (premier onglet)

Renommez le premier onglet en "Réponses" et configurez les colonnes suivantes :

| Horodatage | ID Joueur | Nom Joueur | Question ID | Réponse | Temps (sec) | Score | Appareil | Version | Coordonnées |
|------------|-----------|------------|------------|---------|-------------|-------|----------|---------|-------------|

#### Onglet "Joueurs"

Créez un nouvel onglet nommé "Joueurs" avec les colonnes suivantes :

| ID Joueur | Nom | Email | Date d'inscription | Dernière activité | Parties complétées | Score total | Temps moyen |
|-----------|-----|-------|-------------------|-------------------|-------------------|------------|------------|

#### Onglet "Questions"

Créez un nouvel onglet nommé "Questions" avec les colonnes suivantes :

| ID | Titre | Description | Type | Points | Ordre | Options | Réponse correcte |
|----|-------|------------|------|--------|-------|---------|-----------------|

#### Onglet "Statistiques"

Créez un nouvel onglet nommé "Statistiques" qui sera utilisé pour les calculs automatiques.

## 2. Configuration de Google Apps Script

### 2.1. Créer un nouveau script

1. Dans votre Google Sheet, cliquez sur "Extensions" > "Apps Script"
2. Renommez le projet en "QR Game Integration"
3. Supprimez tout le code par défaut dans le fichier `Code.gs`

### 2.2. Copier le code Apps Script

Copiez le code suivant dans le fichier `Code.gs` :

```javascript
// Configuration
const CONFIG = {
  SHEET_ID: '', // Sera automatiquement rempli
  RESPONSES_SHEET_NAME: 'Réponses',
  PLAYERS_SHEET_NAME: 'Joueurs',
  QUESTIONS_SHEET_NAME: 'Questions',
  STATS_SHEET_NAME: 'Statistiques'
};

/**
 * Point d'entrée pour les requêtes POST
 */
function doPost(e) {
  try {
    // Vérifier si la requête contient des données
    if (!e || !e.postData || !e.postData.contents) {
      return sendResponse(false, 'Aucune donnée reçue');
    }
    
    // Analyser les données JSON
    const data = JSON.parse(e.postData.contents);
    
    // Si c'est une requête de test, renvoyer un statut de succès
    if (data.action === 'test') {
      return sendResponse(true, 'Connexion réussie', { sheetAccess: checkSheetAccess() });
    }
    
    // Traiter les différentes actions
    switch (data.action) {
      case 'submitAnswer':
        return handleSubmitAnswer(data);
      case 'registerPlayer':
        return handleRegisterPlayer(data);
      case 'importQuestions':
        return handleImportQuestions(data);
      case 'getStats':
        return handleGetStats();
      default:
        return sendResponse(false, 'Action non reconnue');
    }
  } catch (error) {
    console.error('Erreur dans doPost:', error);
    return sendResponse(false, 'Erreur: ' + error.message);
  }
}

/**
 * Point d'entrée pour les requêtes GET
 */
function doGet(e) {
  try {
    // Vérifier si c'est une requête de test
    if (e && e.parameter && e.parameter.test) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Connexion réussie',
        sheetAccess: checkSheetAccess()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Gérer les autres types de requêtes GET
    if (e && e.parameter && e.parameter.action) {
      switch (e.parameter.action) {
        case 'getQuestions':
          return handleGetQuestions();
        case 'getPlayers':
          return handleGetPlayers();
        default:
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: 'Action non reconnue'
          })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Requête GET sans paramètres
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Paramètres manquants'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Erreur dans doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erreur: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Vérifie l'accès à la feuille de calcul
 */
function checkSheetAccess() {
  try {
    // Si l'ID de la feuille n'est pas défini, utiliser la feuille active
    if (!CONFIG.SHEET_ID) {
      CONFIG.SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
    }
    
    // Tenter d'accéder à la feuille
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    
    // Vérifier l'existence des onglets requis
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    
    const requiredSheets = [
      CONFIG.RESPONSES_SHEET_NAME,
      CONFIG.PLAYERS_SHEET_NAME,
      CONFIG.QUESTIONS_SHEET_NAME,
      CONFIG.STATS_SHEET_NAME
    ];
    
    const missingSheets = requiredSheets.filter(name => !sheetNames.includes(name));
    
    return {
      hasAccess: true,
      sheetsExist: missingSheets.length === 0,
      missingSheets: missingSheets
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'accès:', error);
    return {
      hasAccess: false,
      error: error.message
    };
  }
}

/**
 * Gère la soumission d'une réponse
 */
function handleSubmitAnswer(data) {
  try {
    // Vérifier les données requises
    if (!data.playerId || !data.questionId || data.response === undefined) {
      return sendResponse(false, 'Données manquantes pour la soumission de réponse');
    }
    
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const responsesSheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET_NAME);
    
    // Préparer les données à insérer
    const rowData = [
      new Date(),                    // Horodatage
      data.playerId,                 // ID Joueur
      data.playerName || '',         // Nom Joueur
      data.questionId,               // Question ID
      data.response,                 // Réponse
      data.timeSpent || 0,           // Temps (sec)
      data.score || 0,               // Score
      data.device || '',             // Appareil
      data.version || '',            // Version
      data.coordinates || ''         // Coordonnées
    ];
    
    // Insérer les données
    responsesSheet.appendRow(rowData);
    
    // Mettre à jour les statistiques du joueur
    updatePlayerStats(data.playerId, data.playerName, data.score || 0, data.timeSpent || 0);
    
    return sendResponse(true, 'Réponse enregistrée avec succès');
  } catch (error) {
    console.error('Erreur lors de la soumission de réponse:', error);
    return sendResponse(false, 'Erreur: ' + error.message);
  }
}

/**
 * Gère l'enregistrement d'un joueur
 */
function handleRegisterPlayer(data) {
  try {
    // Vérifier les données requises
    if (!data.playerId || !data.playerName) {
      return sendResponse(false, 'Données manquantes pour l\'enregistrement du joueur');
    }
    
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const playersSheet = ss.getSheetByName(CONFIG.PLAYERS_SHEET_NAME);
    
    // Vérifier si le joueur existe déjà
    const playerData = playersSheet.getDataRange().getValues();
    const playerIndex = playerData.findIndex(row => row[0] === data.playerId);
    
    if (playerIndex > 0) {
      // Mettre à jour le joueur existant
      const rowIndex = playerIndex + 1;
      playersSheet.getRange(rowIndex, 2).setValue(data.playerName);
      playersSheet.getRange(rowIndex, 3).setValue(data.email || '');
      playersSheet.getRange(rowIndex, 5).setValue(new Date());
      
      return sendResponse(true, 'Joueur mis à jour avec succès');
    } else {
      // Ajouter un nouveau joueur
      const rowData = [
        data.playerId,           // ID Joueur
        data.playerName,         // Nom
        data.email || '',        // Email
        new Date(),              // Date d'inscription
        new Date(),              // Dernière activité
        0,                       // Parties complétées
        0,                       // Score total
        0                        // Temps moyen
      ];
      
      playersSheet.appendRow(rowData);
      
      return sendResponse(true, 'Joueur enregistré avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du joueur:', error);
    return sendResponse(false, 'Erreur: ' + error.message);
  }
}

/**
 * Met à jour les statistiques d'un joueur
 */
function updatePlayerStats(playerId, playerName, score, timeSpent) {
  try {
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const playersSheet = ss.getSheetByName(CONFIG.PLAYERS_SHEET_NAME);
    
    // Récupérer les données des joueurs
    const playerData = playersSheet.getDataRange().getValues();
    const playerIndex = playerData.findIndex(row => row[0] === playerId);
    
    if (playerIndex > 0) {
      // Mettre à jour le joueur existant
      const rowIndex = playerIndex + 1;
      const currentGames = playersSheet.getRange(rowIndex, 6).getValue() || 0;
      const currentScore = playersSheet.getRange(rowIndex, 7).getValue() || 0;
      const currentTime = playersSheet.getRange(rowIndex, 8).getValue() || 0;
      
      // Calculer les nouvelles valeurs
      const newGames = currentGames + 1;
      const newScore = currentScore + score;
      const newTime = ((currentTime * currentGames) + timeSpent) / newGames;
      
      // Mettre à jour les valeurs
      playersSheet.getRange(rowIndex, 5).setValue(new Date());
      playersSheet.getRange(rowIndex, 6).setValue(newGames);
      playersSheet.getRange(rowIndex, 7).setValue(newScore);
      playersSheet.getRange(rowIndex, 8).setValue(newTime);
    } else if (playerId && playerName) {
      // Créer un nouveau joueur si nécessaire
      const rowData = [
        playerId,                // ID Joueur
        playerName,              // Nom
        '',                      // Email
        new Date(),              // Date d'inscription
        new Date(),              // Dernière activité
        1,                       // Parties complétées
        score,                   // Score total
        timeSpent                // Temps moyen
      ];
      
      playersSheet.appendRow(rowData);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques du joueur:', error);
    // Ne pas interrompre le flux principal en cas d'erreur
  }
}

/**
 * Gère l'importation des questions
 */
function handleImportQuestions(data) {
  try {
    // Vérifier les données requises
    if (!data.questions || !Array.isArray(data.questions)) {
      return sendResponse(false, 'Données de questions invalides');
    }
    
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const questionsSheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET_NAME);
    
    // Effacer les questions existantes (sauf l'en-tête)
    const lastRow = questionsSheet.getLastRow();
    if (lastRow > 1) {
      questionsSheet.deleteRows(2, lastRow - 1);
    }
    
    // Préparer les données à insérer
    const rowsData = data.questions.map(q => [
      q.id,                      // ID
      q.title,                   // Titre
      q.description,             // Description
      q.type || 'standard',      // Type
      q.points || 10,            // Points
      q.order || 0,              // Ordre
      JSON.stringify(q.options || []), // Options
      q.correctAnswer || ''      // Réponse correcte
    ]);
    
    // Insérer les données
    if (rowsData.length > 0) {
      questionsSheet.getRange(2, 1, rowsData.length, rowsData[0].length).setValues(rowsData);
    }
    
    return sendResponse(true, `${rowsData.length} questions importées avec succès`);
  } catch (error) {
    console.error('Erreur lors de l\'importation des questions:', error);
    return sendResponse(false, 'Erreur: ' + error.message);
  }
}

/**
 * Récupère les questions
 */
function handleGetQuestions() {
  try {
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const questionsSheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET_NAME);
    
    // Récupérer les données
    const data = questionsSheet.getDataRange().getValues();
    const headers = data[0];
    const questions = data.slice(1).map(row => {
      const question = {};
      headers.forEach((header, index) => {
        if (header === 'Options' && row[index]) {
          try {
            question[header.toLowerCase()] = JSON.parse(row[index]);
          } catch (e) {
            question[header.toLowerCase()] = [];
          }
        } else {
          question[header.toLowerCase()] = row[index];
        }
      });
      return question;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      questions: questions
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erreur: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Récupère les joueurs
 */
function handleGetPlayers() {
  try {
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const playersSheet = ss.getSheetByName(CONFIG.PLAYERS_SHEET_NAME);
    
    // Récupérer les données
    const data = playersSheet.getDataRange().getValues();
    const headers = data[0];
    const players = data.slice(1).map(row => {
      const player = {};
      headers.forEach((header, index) => {
        player[header.toLowerCase().replace(/ /g, '_')] = row[index];
      });
      return player;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      players: players
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erreur: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Récupère les statistiques
 */
function handleGetStats() {
  try {
    // Accéder à la feuille de calcul
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const responsesSheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET_NAME);
    const playersSheet = ss.getSheetByName(CONFIG.PLAYERS_SHEET_NAME);
    
    // Récupérer les données des réponses
    const responsesData = responsesSheet.getDataRange().getValues();
    
    // Récupérer les données des joueurs
    const playersData = playersSheet.getDataRange().getValues();
    
    // Calculer les statistiques
    const totalResponses = responsesData.length - 1;
    const uniquePlayers = new Set(responsesData.slice(1).map(row => row[1])).size;
    
    // Statistiques par jour (7 derniers jours)
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date: date,
        count: 0
      });
    }
    
    // Compter les réponses par jour
    responsesData.slice(1).forEach(row => {
      const responseDate = new Date(row[0]);
      responseDate.setHours(0, 0, 0, 0);
      
      last7Days.forEach(day => {
        if (responseDate.getTime() === day.date.getTime()) {
          day.count++;
        }
      });
    });
    
    // Calculer le temps moyen par question
    const questionTimes = {};
    responsesData.slice(1).forEach(row => {
      const questionId = row[3];
      const time = row[5] || 0;
      
      if (!questionTimes[questionId]) {
        questionTimes[questionId] = {
          total: 0,
          count: 0
        };
      }
      
      questionTimes[questionId].total += time;
      questionTimes[questionId].count++;
    });
    
    const avgTimePerQuestion = Object.keys(questionTimes).map(id => ({
      id: id,
      avgTime: questionTimes[id].total / questionTimes[id].count
    }));
    
    // Top 5 joueurs
    const playerStats = {};
    responsesData.slice(1).forEach(row => {
      const playerId = row[1];
      const playerName = row[2];
      const score = row[6] || 0;
      
      if (!playerStats[playerId]) {
        playerStats[playerId] = {
          id: playerId,
          name: playerName,
          totalScore: 0,
          responses: 0
        };
      }
      
      playerStats[playerId].totalScore += score;
      playerStats[playerId].responses++;
    });
    
    const topPlayers = Object.values(playerStats)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);
    
    // Préparer la réponse
    const stats = {
      totalResponses: totalResponses,
      uniquePlayers: uniquePlayers,
      daily: last7Days.map(day => ({
        date: day.date.toISOString().split('T')[0],
        count: day.count
      })),
      avgTimePerQuestion: avgTimePerQuestion,
      topPlayers: topPlayers
    };
    
    return sendResponse(true, 'Statistiques récupérées avec succès', { stats: stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return sendResponse(false, 'Erreur: ' + error.message);
  }
}

/**
 * Envoie une réponse formatée
 */
function sendResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    ...data
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 2.3. Configurer les déclencheurs (optionnel)

Si vous souhaitez exécuter des tâches automatisées (comme la génération de rapports quotidiens), vous pouvez configurer des déclencheurs :

1. Dans l'éditeur Apps Script, cliquez sur l'icône d'horloge (Déclencheurs)
2. Cliquez sur "+ Ajouter un déclencheur"
3. Configurez un déclencheur selon vos besoins

## 3. Déploiement du script

### 3.1. Déployer en tant que service web

1. Dans l'éditeur Apps Script, cliquez sur "Déployer" > "Nouveau déploiement"
2. Pour "Type de déploiement", sélectionnez "Application web"
3. Configurez les options suivantes :
   - Description : "QR Game Integration"
   - Exécuter en tant que : "Moi" (votre compte Google)
   - Qui a accès : "Tous, même anonyme" (pour permettre à l'application d'y accéder)
4. Cliquez sur "Déployer"
5. Copiez l'URL du service web qui s'affiche (vous en aurez besoin pour configurer l'application)

### 3.2. Autoriser les accès

Lors de la première utilisation du script, vous devrez autoriser les accès :

1. Ouvrez l'URL du service web dans un navigateur
2. Suivez les instructions pour autoriser le script à accéder à vos Google Sheets

## 4. Configuration de l'application QR Game

### 4.1. Configurer les paramètres dans l'interface d'administration

1. Accédez à l'interface d'administration de QR Game
2. Allez dans l'onglet "Paramètres"
3. Dans la section "Intégration Google Forms", saisissez :
   - URL du script Apps Script : l'URL du service web que vous avez copiée
   - URL du Google Sheet : l'URL de votre feuille de calcul
   - ID du formulaire : laissez vide pour que le script crée automatiquement un formulaire
   - ID de la feuille : laissez vide pour utiliser la feuille active
4. Activez l'option "Activer l'intégration Google Forms"
5. Activez l'option "Activer le support hors ligne" si nécessaire
6. Cliquez sur "Tester la connexion" pour vérifier que tout fonctionne correctement
7. Enregistrez les paramètres

## 5. Sécurité et bonnes pratiques

### 5.1. Gestion des accès

- Ne partagez pas l'URL du script Apps Script avec des personnes non autorisées
- Limitez l'accès au Google Sheet aux seules personnes qui doivent y avoir accès
- Utilisez un compte Google dédié pour les applications en production

### 5.2. Sauvegarde des données

- Configurez des sauvegardes régulières de votre Google Sheet
- Exportez périodiquement les données via l'interface d'administration

### 5.3. Mise à jour du script

Si vous modifiez le script Apps Script :

1. Effectuez vos modifications dans l'éditeur
2. Enregistrez le script
3. Créez un nouveau déploiement (ne mettez pas à jour l'ancien)
4. Mettez à jour l'URL du script dans l'interface d'administration

## 6. Dépannage

### 6.1. Problèmes courants

- **Erreur "Accès refusé"** : Vérifiez les autorisations du script et du Google Sheet
- **Données non synchronisées** : Vérifiez la connexion internet et l'URL du script
- **Erreur "Quota dépassé"** : Google impose des limites d'utilisation, attendez ou passez à un compte Google Workspace

### 6.2. Vérification des logs

Pour consulter les logs d'erreur :

1. Dans l'éditeur Apps Script, cliquez sur "Exécution" > "Journaux d'exécution"
2. Consultez les erreurs et les messages de débogage

---

Ce guide vous a expliqué comment configurer un Google Sheet et l'intégration Google Apps Script pour l'application QR Game. Si vous rencontrez des problèmes, n'hésitez pas à consulter la documentation de Google Apps Script ou à contacter le support technique.
