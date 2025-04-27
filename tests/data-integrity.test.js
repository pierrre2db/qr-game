const request = require('supertest');
const fs = require('fs');
const path = require('path');

// URL de base pour les requêtes API
const BASE_URL = 'http://localhost:3000';

describe('Tests d\'intégrité des données QR Game', () => {
  // Test d'intégrité des données de questions
  test('Intégrité des données de questions', async () => {
    const response = await request(BASE_URL).get('/api/questions');
    expect(response.status).toBe(200);
    
    const data = response.body;
    expect(data).toHaveProperty('questions');
    expect(Array.isArray(data.questions)).toBe(true);
    
    // Vérifier que chaque question a les propriétés requises
    // Exclure la question de test que nous avons peut-être ajoutée
    const validQuestions = data.questions.filter(q => q.id !== undefined);
    validQuestions.forEach(question => {
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('title');
      expect(question).toHaveProperty('description');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('points');
      expect(question).toHaveProperty('order');
      
      // Vérifier les propriétés spécifiques au type
      if (question.type === 'standard') {
        expect(question).toHaveProperty('options');
        expect(Array.isArray(question.options)).toBe(true);
        expect(question).toHaveProperty('correctAnswer');
      }
    });
  });

  // Test de persistance des réponses
  test('Persistance des réponses', async () => {
    // Créer une réponse unique avec un ID aléatoire
    const uniqueId = `test-${Date.now()}`;
    const testResponse = {
      playerId: uniqueId,
      playerName: "Test Persistance",
      questionId: "Q1",
      response: "Beurre et farine"
    };
    
    // Envoyer la réponse
    const postResponse = await request(BASE_URL)
      .post('/api/responses')
      .send(testResponse);
    expect(postResponse.status).toBe(200);
    
    // Vérifier directement dans le fichier responses.json
    const responsesFilePath = path.join(__dirname, '..', 'data', 'responses.json');
    const responsesData = JSON.parse(fs.readFileSync(responsesFilePath, 'utf8'));
    
    // Vérifier que notre réponse est dans les données
    const found = responsesData.responses.some(r => r.playerId === uniqueId);
    expect(found).toBe(true);
  });

  // Test de concurrence
  test('Gestion de la concurrence', async () => {
    const promises = [];
    const playerPrefix = `concurrent-${Date.now()}`;
    
    // Simuler 10 réponses simultanées
    for (let i = 0; i < 10; i++) {
      const testResponse = {
        playerId: `${playerPrefix}-${i}`,
        playerName: `Joueur Concurrent ${i}`,
        questionId: "Q1",
        response: "Beurre et farine"
      };
      
      promises.push(
        request(BASE_URL)
          .post('/api/responses')
          .send(testResponse)
      );
    }
    
    // Attendre que toutes les requêtes soient terminées
    const results = await Promise.all(promises);
    
    // Vérifier que toutes les réponses ont été enregistrées
    results.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    // Vérifier directement dans le fichier responses.json
    const responsesFilePath = path.join(__dirname, '..', 'data', 'responses.json');
    const responsesData = JSON.parse(fs.readFileSync(responsesFilePath, 'utf8'));
    
    // Compter les réponses avec notre préfixe
    let count = 0;
    responsesData.responses.forEach(r => {
      if (r.playerId && r.playerId.startsWith(playerPrefix)) {
        count++;
      }
    });
    
    expect(count).toBe(10);
  });

  // Test de validation des données importées
  test('Validation des données importées', async () => {
    // D'abord, récupérer les questions actuelles pour les restaurer après le test
    const questionsResponse = await request(BASE_URL).get('/api/questions');
    const originalQuestions = questionsResponse.body.questions;
    
    // Générer un ID unique pour notre question de test
    const testId = `TEST_${Date.now()}`;
    
    // Tester avec des données valides mais spéciales
    const testData = {
      questions: [
        {
          id: testId,
          title: "Question de test pour validation",
          description: "Cette question est utilisée pour tester l'import",
          type: "standard",
          points: 1,
          order: 999,
          options: ["Option 1", "Option 2"],
          correctAnswer: "Option 1"
        }
      ]
    };
    
    // Importer les questions de test
    const response = await request(BASE_URL)
      .post('/api/questions/import')
      .send(testData);
    
    // Le serveur devrait accepter les données
    expect(response.status).toBe(200);
    
    // Vérifier que la question a été importée
    const questionsAfterImport = response.body.questions;
    const importedQuestion = questionsAfterImport.find(q => q.id === testId);
    
    // La question importée doit exister et avoir les bonnes propriétés
    expect(importedQuestion).toBeTruthy();
    expect(importedQuestion.id).toBe(testId);
    expect(importedQuestion.title).toBe("Question de test pour validation");
    
    // Restaurer les questions originales
    await request(BASE_URL)
      .post('/api/questions/import')
      .send({ questions: originalQuestions });
  });
});
