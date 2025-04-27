require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Chemins des fichiers JSON
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const RESPONSES_FILE = path.join(__dirname, 'data', 'responses.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Fonction utilitaire pour lire un fichier JSON
const readJsonFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      // Forcer la lecture du fichier sans cache
      const data = fs.readFileSync(filePath, 'utf8');
      console.log(`Fichier ${filePath} lu avec succès`);
      return JSON.parse(data);
    }
    console.warn(`Fichier ${filePath} non trouvé`);
    return null;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
};

// Fonction utilitaire pour écrire dans un fichier JSON
const writeJsonFile = (filePath, data) => {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'écriture dans le fichier ${filePath}:`, error);
    return false;
  }
};

// Routes API
// Récupérer toutes les questions
app.get('/api/questions', (req, res) => {
  // Désactiver la mise en cache côté client
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  const data = readJsonFile(QUESTIONS_FILE);
  if (data) {
    res.json(data);
  } else {
    res.json({ questions: [] });
  }
});

// Récupérer une question par ID
app.get('/api/questions/:id', (req, res) => {
  const data = readJsonFile(QUESTIONS_FILE);
  if (!data) {
    return res.status(404).json({ error: 'Questions non trouvées' });
  }
  
  const question = data.questions.find(q => q.id === req.params.id);
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question non trouvée' });
  }
});

// Importer des questions
app.post('/api/questions/import', (req, res) => {
  if (!req.body.questions || !Array.isArray(req.body.questions)) {
    return res.status(400).json({ error: 'Format de données invalide' });
  }
  
  const newQuestions = req.body.questions;
  
  // Lire les questions existantes
  const data = readJsonFile(QUESTIONS_FILE) || { questions: [] };
  
  // Fusionner les questions (remplacer les existantes avec le même ID)
  const existingIds = data.questions.map(q => q.id);
  const questionsToAdd = newQuestions.filter(q => !existingIds.includes(q.id));
  const updatedQuestions = data.questions.map(q => {
    const newQuestion = newQuestions.find(nq => nq.id === q.id);
    return newQuestion || q;
  });
  
  // Combiner les questions mises à jour et les nouvelles
  const combinedQuestions = [...updatedQuestions, ...questionsToAdd];
  
  // Trier par ordre si disponible
  combinedQuestions.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Enregistrer les questions
  const success = writeJsonFile(QUESTIONS_FILE, { questions: combinedQuestions });
  
  if (success) {
    res.json({ 
      success: true, 
      message: `${newQuestions.length} questions importées avec succès.`,
      questions: combinedQuestions
    });
  } else {
    res.status(500).json({ 
      error: 'Erreur lors de l\'enregistrement des questions' 
    });
  }
});

// Enregistrer une réponse
app.post('/api/responses', (req, res) => {
  if (!req.body || !req.body.playerId || !req.body.questionId) {
    return res.status(400).json({ error: 'Données de réponse incomplètes' });
  }
  
  // Lire les réponses existantes
  const data = readJsonFile(RESPONSES_FILE) || { responses: [] };
  
  // Récupérer la question correspondante
  const questionsData = readJsonFile(QUESTIONS_FILE);
  const question = questionsData ? questionsData.questions.find(q => q.id === req.body.questionId) : null;
  
  // Préparer la réponse à enregistrer
  let newResponse = {
    ...req.body,
    timestamp: req.body.timestamp || new Date().toISOString()
  };
  
  // Traitement spécifique selon le type de question
  if (question) {
    newResponse.questionType = question.type;
    
    // Vérifier si la réponse est correcte pour les types standard et number
    if (question.type === 'standard' && question.correctAnswer) {
      newResponse.isCorrect = req.body.response === question.correctAnswer;
    } 
    else if (question.type === 'number' && question.correctAnswer) {
      // Pour les questions numériques, vérifier si la réponse est dans la plage acceptable
      const responseNum = parseInt(req.body.response, 10);
      const correctNum = parseInt(question.correctAnswer, 10);
      
      if (!isNaN(responseNum) && !isNaN(correctNum)) {
        // On peut définir une marge d'erreur acceptable (ex: ±5)
        const margin = question.margin || 0;
        newResponse.isCorrect = Math.abs(responseNum - correctNum) <= margin;
        
        // Calculer la proximité de la réponse (utile pour les classements)
        newResponse.proximity = Math.abs(responseNum - correctNum);
      }
    }
    
    // Pour les commentaires, ajouter un flag spécial
    if (question.type === 'comment') {
      newResponse.isComment = true;
      newResponse.isEndGame = question.isEndGame || false;
    }
  }
  
  data.responses.push(newResponse);
  
  // Enregistrer les réponses
  const success = writeJsonFile(RESPONSES_FILE, data);
  
  if (success) {
    res.json({ 
      success: true, 
      message: 'Réponse enregistrée avec succès',
      response: newResponse
    });
  } else {
    res.status(500).json({ 
      error: 'Erreur lors de l\'enregistrement de la réponse' 
    });
  }
});

// Réinitialiser les réponses (statistiques)
app.post('/api/responses/reset', (req, res) => {
  // Vérifier le mot de passe
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'qrgame2025';
  
  if (!password || password !== adminPassword) {
    return res.status(401).json({ 
      success: false, 
      error: 'Mot de passe incorrect' 
    });
  }
  
  // Réinitialiser le fichier des réponses
  const emptyResponses = { responses: [] };
  const success = writeJsonFile(RESPONSES_FILE, emptyResponses);
  
  if (success) {
    // Créer une sauvegarde avant la réinitialisation
    try {
      const backupDir = path.join(__dirname, 'backups', `reset-${new Date().toISOString().replace(/:/g, '-')}`);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Copier le fichier de réponses dans la sauvegarde
      const backupPath = path.join(backupDir, 'responses.json');
      fs.copyFileSync(RESPONSES_FILE, backupPath);
      
      res.json({ 
        success: true, 
        message: 'Statistiques réinitialisées avec succès',
        backup: backupDir
      });
    } catch (error) {
      res.json({ 
        success: true, 
        message: 'Statistiques réinitialisées avec succès, mais la sauvegarde a échoué',
        error: error.message
      });
    }
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la réinitialisation des statistiques' 
    });
  }
});

// Récupérer les statistiques
app.get('/api/stats', (req, res) => {
  const questionsData = readJsonFile(QUESTIONS_FILE);
  const responsesData = readJsonFile(RESPONSES_FILE);
  
  if (!questionsData || !responsesData) {
    return res.status(404).json({ error: 'Données non trouvées' });
  }
  
  // Calculer les statistiques de base
  const totalQuestions = questionsData.questions.length;
  const totalResponses = responsesData.responses.length;
  const uniquePlayers = new Set(responsesData.responses.map(r => r.playerId)).size;
  
  // Statistiques par question
  const questionStats = questionsData.questions.map(question => {
    const questionResponses = responsesData.responses.filter(r => r.questionId === question.id);
    const correctResponses = questionResponses.filter(r => r.isCorrect).length;
    const averageTime = questionResponses.length > 0 
      ? questionResponses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / questionResponses.length 
      : 0;
    
    return {
      id: question.id,
      title: question.title,
      responses: questionResponses.length,
      correctRate: questionResponses.length > 0 ? correctResponses / questionResponses.length : 0,
      averageTime
    };
  });
  
  res.json({
    totalQuestions,
    totalResponses,
    uniquePlayers,
    questionStats
  });
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle deep linking routes
app.get('/game/:gameId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
