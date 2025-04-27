/**
 * QR Game - Google Forms Integration
 * Ce script permet d'intégrer les données du jeu QR avec Google Forms
 */

// ID du formulaire Google Forms (à remplacer par votre ID de formulaire)
const FORM_ID = 'VOTRE_ID_DE_FORMULAIRE';

/**
 * Crée un nouveau formulaire pour le jeu QR si nécessaire
 */
function createQRGameForm() {
  try {
    // Vérifier si le formulaire existe déjà
    let form;
    try {
      form = FormApp.openById(FORM_ID);
      Logger.log('Formulaire existant trouvé. ID: ' + FORM_ID);
    } catch (e) {
      // Créer un nouveau formulaire
      form = FormApp.create('QR Game - Collecte de Données');
      Logger.log('Nouveau formulaire créé. ID: ' + form.getId());
      Logger.log('Remplacez la constante FORM_ID dans le script avec cet ID.');
      
      // Configuration du formulaire
      form.setDescription('Formulaire pour collecter les données du jeu QR Scanner');
      form.setCollectEmail(true);
      form.setAllowResponseEdits(false);
      form.setPublishingSummary(true);
      
      // Ajouter les questions
      form.addTextItem().setTitle('ID Joueur').setRequired(true);
      form.addTextItem().setTitle('Nom du Joueur').setRequired(true);
      
      // Ajouter une question à choix multiple pour le niveau atteint
      const levelItem = form.addMultipleChoiceItem();
      levelItem.setTitle('Niveau Atteint');
      levelItem.setChoices([
        levelItem.createChoice('Départ'),
        levelItem.createChoice('Défi 1'),
        levelItem.createChoice('Défi 2'),
        levelItem.createChoice('Défi 3'),
        levelItem.createChoice('Défi 4'),
        levelItem.createChoice('Terminé')
      ]);
      levelItem.setRequired(true);
      
      // Ajouter d'autres questions utiles
      form.addDateTimeItem().setTitle('Date et Heure de Complétion').setRequired(true);
      form.addParagraphTextItem().setTitle('Commentaires').setRequired(false);
    }
    
    return form;
  } catch (error) {
    Logger.log('Erreur lors de la création/récupération du formulaire: ' + error.toString());
    return null;
  }
}

/**
 * Soumet les données du jeu au formulaire Google
 */
function submitGameData(e) {
  try {
    // Vérifier si nous avons des données POST
    const postData = e.postData;
    if (!postData) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Aucune donnée reçue'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Analyser les données JSON
    const data = JSON.parse(postData.contents);
    if (!data || !data.playerId || !data.playerName || !data.level) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Données incomplètes'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ouvrir le formulaire
    const form = FormApp.openById(FORM_ID);
    
    // Créer une nouvelle réponse
    const formResponse = form.createResponse();
    
    // Récupérer les éléments du formulaire
    const items = form.getItems();
    let playerIdItem, playerNameItem, levelItem, dateTimeItem, commentsItem;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = item.getTitle();
      
      if (title === 'ID Joueur') {
        playerIdItem = item.asTextItem();
      } else if (title === 'Nom du Joueur') {
        playerNameItem = item.asTextItem();
      } else if (title === 'Niveau Atteint') {
        levelItem = item.asMultipleChoiceItem();
      } else if (title === 'Date et Heure de Complétion') {
        dateTimeItem = item.asDateTimeItem();
      } else if (title === 'Commentaires') {
        commentsItem = item.asParagraphTextItem();
      }
    }
    
    // Ajouter les réponses
    if (playerIdItem) {
      formResponse.withItemResponse(playerIdItem.createResponse(data.playerId));
    }
    
    if (playerNameItem) {
      formResponse.withItemResponse(playerNameItem.createResponse(data.playerName));
    }
    
    if (levelItem) {
      // Convertir l'ID de niveau en texte lisible
      let levelText;
      switch (data.level) {
        case 'start': levelText = 'Départ'; break;
        case 'challenge1': levelText = 'Défi 1'; break;
        case 'challenge2': levelText = 'Défi 2'; break;
        case 'challenge3': levelText = 'Défi 3'; break;
        case 'challenge4': levelText = 'Défi 4'; break;
        case 'finish': levelText = 'Terminé'; break;
        default: levelText = 'Inconnu';
      }
      
      formResponse.withItemResponse(levelItem.createResponse(levelText));
    }
    
    if (dateTimeItem) {
      // Utiliser la date et l'heure actuelles
      const now = new Date();
      formResponse.withItemResponse(dateTimeItem.createResponse(now));
    }
    
    if (commentsItem && data.comments) {
      formResponse.withItemResponse(commentsItem.createResponse(data.comments));
    }
    
    // Soumettre la réponse
    formResponse.submit();
    
    // Renvoyer une réponse de succès
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Données soumises avec succès'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Gérer les erreurs
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Erreur: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Point d'entrée pour les requêtes Web
 */
function doPost(e) {
  return submitGameData(e);
}

/**
 * Point d'entrée pour les tests manuels
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Le service est actif. Utilisez POST pour soumettre des données.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fonction de test pour vérifier que tout fonctionne
 */
function testFormCreation() {
  const form = createQRGameForm();
  if (form) {
    Logger.log('Test réussi. URL du formulaire: ' + form.getPublishedUrl());
    Logger.log('URL d\'édition du formulaire: ' + form.getEditUrl());
  } else {
    Logger.log('Échec du test de création du formulaire.');
  }
}
