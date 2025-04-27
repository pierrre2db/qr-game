/**
 * Tests automatiques pour l'API du QR Game
 */
const request = require('supertest');
const fs = require('fs');
const path = require('path');

// URL de base pour les tests
const BASE_URL = 'http://localhost:3000';

describe('API QR Game', () => {
  // Test de l'API des questions
  describe('GET /api/questions', () => {
    it('devrait retourner toutes les questions', async () => {
      const response = await request(BASE_URL).get('/api/questions');
      
      // Vérifier le statut de la réponse
      expect(response.status).toBe(200);
      
      // Vérifier que la réponse contient un tableau de questions
      expect(response.body).toHaveProperty('questions');
      expect(Array.isArray(response.body.questions)).toBe(true);
      
      // Vérifier que les questions ont les propriétés requises
      if (response.body.questions.length > 0) {
        const question = response.body.questions[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('title');
        expect(question).toHaveProperty('description');
        expect(question).toHaveProperty('type');
      }
      
      console.log(`Nombre de questions: ${response.body.questions.length}`);
    });
    
    it('devrait avoir les en-têtes anti-cache', async () => {
      const response = await request(BASE_URL).get('/api/questions');
      
      // Vérifier les en-têtes anti-cache
      expect(response.headers).toHaveProperty('cache-control');
      expect(response.headers['cache-control']).toContain('no-cache');
      expect(response.headers).toHaveProperty('pragma');
      expect(response.headers['pragma']).toBe('no-cache');
    });
  });
  
  // Test de l'API des questions par ID
  describe('GET /api/questions/:id', () => {
    it('devrait retourner une question spécifique', async () => {
      // D'abord récupérer toutes les questions pour avoir un ID valide
      const allQuestionsResponse = await request(BASE_URL).get('/api/questions');
      
      if (allQuestionsResponse.body.questions.length > 0) {
        const questionId = allQuestionsResponse.body.questions[0].id;
        
        // Tester la récupération d'une question spécifique
        const response = await request(BASE_URL).get(`/api/questions/${questionId}`);
        
        // Vérifier le statut de la réponse
        expect(response.status).toBe(200);
        
        // Vérifier que la question a les propriétés requises
        expect(response.body).toHaveProperty('id', questionId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
      } else {
        console.log('Pas de questions disponibles pour tester GET /api/questions/:id');
      }
    });
    
    it('devrait retourner 404 pour un ID inexistant', async () => {
      const response = await request(BASE_URL).get('/api/questions/ID_INEXISTANT');
      
      // Vérifier le statut de la réponse
      expect(response.status).toBe(404);
    });
  });
  
  // Test de l'API des statistiques
  describe('GET /api/stats', () => {
    it('devrait retourner les statistiques', async () => {
      const response = await request(BASE_URL).get('/api/stats');
      
      // Vérifier le statut de la réponse
      expect(response.status).toBe(200);
      
      // Vérifier que la réponse contient les propriétés requises
      expect(response.body).toHaveProperty('totalQuestions');
      expect(response.body).toHaveProperty('totalResponses');
      expect(response.body).toHaveProperty('uniquePlayers');
    });
  });
  
  // Test de l'API d'import de questions
  describe('POST /api/questions/import', () => {
    it('devrait importer de nouvelles questions', async () => {
      // Créer un jeu de questions de test
      const testQuestions = {
        questions: [
          {
            id: "TEST1",
            title: "Question de test",
            description: "Ceci est une question de test",
            type: "standard",
            points: 1,
            order: 1,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: "Option 2"
          }
        ]
      };
      
      // Sauvegarder les questions actuelles
      const originalQuestions = await request(BASE_URL).get('/api/questions');
      
      // Importer les questions de test
      const importResponse = await request(BASE_URL)
        .post('/api/questions/import')
        .send(testQuestions);
      
      // Vérifier le statut de la réponse
      expect(importResponse.status).toBe(200);
      
      // Vérifier que les questions ont été importées
      const afterImportResponse = await request(BASE_URL).get('/api/questions');
      const importedQuestion = afterImportResponse.body.questions.find(q => q.id === "TEST1");
      expect(importedQuestion).toBeTruthy();
      
      // Restaurer les questions originales
      await request(BASE_URL)
        .post('/api/questions/import')
        .send(originalQuestions.body);
    });
  });
});
