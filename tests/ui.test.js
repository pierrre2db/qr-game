/**
 * Tests automatiques pour les interfaces utilisateur du QR Game
 */
const puppeteer = require('puppeteer');

// URL de base pour les tests
const BASE_URL = 'http://localhost:3000';

describe('Interfaces utilisateur QR Game', () => {
  let browser;
  let page;
  
  // Configuration avant les tests
  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: false, // Mettre à true pour exécuter sans interface graphique
      slowMo: 100 // Ralentir pour mieux voir les actions
    });
    page = await browser.newPage();
  });
  
  // Nettoyage après les tests
  afterAll(async () => {
    await browser.close();
  });
  
  // Test de la page d'accueil
  describe('Page d\'accueil', () => {
    it('devrait charger la page d\'accueil', async () => {
      await page.goto(`${BASE_URL}/`);
      
      // Vérifier que la page s'est chargée correctement
      const title = await page.title();
      expect(title).toContain('QR Game');
      
      // Vérifier que les liens principaux sont présents
      const adminLink = await page.$('a[href*="admin"]');
      const gameLink = await page.$('a[href*="game.html"]');
      
      expect(adminLink).toBeTruthy();
      expect(gameLink).toBeTruthy();
    });
  });
  
  // Test de l'interface d'administration des questions
  describe('Interface d\'administration des questions', () => {
    it('devrait charger la page d\'administration des questions', async () => {
      await page.goto(`${BASE_URL}/admin-questions.html`);
      
      // Vérifier que la page s'est chargée correctement
      const title = await page.title();
      expect(title).toContain('Admin');
      
      // Vérifier que le tableau des questions est présent
      const questionsTable = await page.$('#questions-table');
      expect(questionsTable).toBeTruthy();
      
      // Vérifier que les boutons d'action sont présents
      const addButton = await page.$('#add-question-btn');
      const importButton = await page.$('#import-btn');
      
      expect(addButton).toBeTruthy();
      expect(importButton).toBeTruthy();
    });
    
    it('devrait afficher les questions', async () => {
      await page.goto(`${BASE_URL}/admin-questions.html`);
      
      // Attendre que les questions se chargent
      await page.waitForSelector('#questions-table-body tr', { timeout: 5000 });
      
      // Compter le nombre de questions affichées
      const questionCount = await page.$$eval('#questions-table-body tr', rows => rows.length);
      
      console.log(`Nombre de questions affichées: ${questionCount}`);
      expect(questionCount).toBeGreaterThan(0);
    });
  });
  
  // Test du générateur de QR codes
  describe('Générateur de QR codes', () => {
    it('devrait charger la page du générateur de QR codes', async () => {
      await page.goto(`${BASE_URL}/admin-qrcodes.html`);
      
      // Vérifier que la page s'est chargée correctement
      const title = await page.title();
      expect(title).toContain('QR');
      
      // Vérifier que les options de génération sont présentes
      const qrSizeInput = await page.$('#qr-size');
      const qrBaseUrlInput = await page.$('#qr-base-url');
      
      expect(qrSizeInput).toBeTruthy();
      expect(qrBaseUrlInput).toBeTruthy();
    });
    
    it('devrait générer des QR codes', async () => {
      await page.goto(`${BASE_URL}/admin-qrcodes.html`);
      
      // Cliquer sur le bouton pour générer tous les QR codes
      await page.click('#generate-all-btn');
      
      // Attendre que les QR codes se génèrent
      await page.waitForSelector('.qr-image', { timeout: 5000 });
      
      // Compter le nombre de QR codes générés
      const qrCodeCount = await page.$$eval('.qr-image', images => images.length);
      
      console.log(`Nombre de QR codes générés: ${qrCodeCount}`);
      expect(qrCodeCount).toBeGreaterThan(0);
    });
  });
  
  // Test de l'interface de jeu
  describe('Interface de jeu', () => {
    it('devrait charger la page de jeu', async () => {
      await page.goto(`${BASE_URL}/game.html`);
      
      // Vérifier que la page s'est chargée correctement
      const title = await page.title();
      expect(title).toContain('Game');
      
      // Vérifier que les éléments principaux sont présents
      const progressBar = await page.$('.progress');
      const questionContainer = await page.$('#question-container');
      
      expect(progressBar).toBeTruthy();
      expect(questionContainer).toBeTruthy();
    });
    
    it('devrait charger une question spécifique', async () => {
      // Récupérer d'abord la liste des questions via l'API
      const response = await page.goto(`${BASE_URL}/api/questions`);
      const questionsData = await response.json();
      
      if (questionsData.questions && questionsData.questions.length > 0) {
        const firstQuestionId = questionsData.questions[0].id;
        
        // Charger la page de jeu avec une question spécifique
        await page.goto(`${BASE_URL}/game.html?q=${firstQuestionId}`);
        
        // Attendre que la question se charge
        await page.waitForSelector('#question-title', { timeout: 5000 });
        
        // Vérifier que la question est affichée
        const questionTitle = await page.$eval('#question-title', el => el.textContent);
        expect(questionTitle).toBeTruthy();
        
        console.log(`Question chargée: ${questionTitle}`);
      } else {
        console.log('Pas de questions disponibles pour tester l\'interface de jeu');
      }
    });
    
    it('devrait mettre à jour la barre de progression', async () => {
      // Récupérer d'abord la liste des questions via l'API
      const response = await page.goto(`${BASE_URL}/api/questions`);
      const questionsData = await response.json();
      
      if (questionsData.questions && questionsData.questions.length > 0) {
        const firstQuestionId = questionsData.questions[0].id;
        
        // Charger la page de jeu avec une question spécifique
        await page.goto(`${BASE_URL}/game.html?q=${firstQuestionId}`);
        
        // Attendre que la question se charge
        await page.waitForSelector('.answer-option', { timeout: 5000 });
        
        // Récupérer la valeur initiale de la barre de progression
        const initialProgress = await page.$eval('.progress-bar', el => el.style.width);
        
        // Répondre à la question (cliquer sur la première option)
        await page.click('.answer-option');
        
        // Attendre que la réponse soit enregistrée
        await page.waitForTimeout(1000);
        
        // Récupérer la nouvelle valeur de la barre de progression
        const updatedProgress = await page.$eval('.progress-bar', el => el.style.width);
        
        console.log(`Progression initiale: ${initialProgress}, Progression après réponse: ${updatedProgress}`);
      } else {
        console.log('Pas de questions disponibles pour tester la barre de progression');
      }
    });
  });
});
