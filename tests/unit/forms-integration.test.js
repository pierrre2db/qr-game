/**
 * Tests unitaires pour le module d'intégration Google Forms
 */

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

// Mock de fetch
global.fetch = jest.fn();

// Mock de navigator
Object.defineProperty(global.navigator, 'onLine', {
  writable: true,
  value: true
});

// Importer le module après les mocks
jest.mock('../../public/js/forms-integration', () => {
  const originalModule = jest.requireActual('../../public/js/forms-integration');
  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      loadSettings: jest.fn(),
      initEventListeners: jest.fn()
    }
  };
});

describe('FormsIntegration', () => {
  let formsIntegration;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    global.fetch.mockClear();
    
    // Réinitialiser l'état en ligne
    Object.defineProperty(global.navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // Importer le module
    formsIntegration = require('../../public/js/forms-integration').default;
    
    // Configurer l'intégration
    formsIntegration.scriptUrl = 'https://script.google.com/macros/s/test-id/exec';
    formsIntegration.sheetUrl = 'https://docs.google.com/spreadsheets/d/test-id';
    formsIntegration.enabled = true;
    formsIntegration.offlineSupport = true;
  });
  
  describe('submitPlayerData', () => {
    test('devrait soumettre les données avec succès quand en ligne', async () => {
      // Configurer le mock de fetch pour simuler une réponse réussie
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Données soumises avec succès' })
      });
      
      // Données de test
      const playerData = {
        playerId: 'test-player',
        playerName: 'Test Player',
        questionId: 'Q1',
        response: 'Test response',
        score: 10,
        timeSpent: 30
      };
      
      // Appeler la méthode
      const result = await formsIntegration.submitPlayerData(playerData);
      
      // Vérifier que fetch a été appelé avec les bons paramètres
      expect(global.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/test-id/exec',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      );
      
      // Vérifier le résultat
      expect(result).toEqual({ success: true, message: 'Données soumises avec succès' });
    });
    
    test('devrait stocker les données localement quand hors ligne', async () => {
      // Simuler l'état hors ligne
      Object.defineProperty(global.navigator, 'onLine', {
        writable: true,
        value: false
      });
      
      // Espionner la méthode storeDataForLaterSubmission
      const spy = jest.spyOn(formsIntegration, 'storeDataForLaterSubmission');
      
      // Données de test
      const playerData = {
        playerId: 'test-player',
        playerName: 'Test Player',
        questionId: 'Q1',
        response: 'Test response'
      };
      
      // Appeler la méthode
      const result = await formsIntegration.submitPlayerData(playerData);
      
      // Vérifier que fetch n'a pas été appelé
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Vérifier que storeDataForLaterSubmission a été appelé
      expect(spy).toHaveBeenCalledWith(playerData);
      
      // Vérifier le résultat
      expect(result).toEqual({
        status: 'pending',
        message: 'Données stockées localement pour soumission ultérieure'
      });
    });
    
    test('ne devrait pas soumettre les données si l\'intégration est désactivée', async () => {
      // Désactiver l'intégration
      formsIntegration.enabled = false;
      
      // Données de test
      const playerData = {
        playerId: 'test-player',
        playerName: 'Test Player'
      };
      
      // Appeler la méthode
      const result = await formsIntegration.submitPlayerData(playerData);
      
      // Vérifier que fetch n'a pas été appelé
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Vérifier le résultat
      expect(result).toEqual({
        status: 'disabled',
        message: 'Intégration Google Forms désactivée'
      });
    });
  });
  
  describe('testConnection', () => {
    test('devrait tester la connexion avec succès', async () => {
      // Configurer le mock de fetch pour simuler une réponse réussie
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Connexion réussie', sheetAccess: { hasAccess: true } })
      });
      
      // Appeler la méthode
      const result = await formsIntegration.testConnection();
      
      // Vérifier que fetch a été appelé avec les bons paramètres
      expect(global.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/test-id/exec',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      );
      
      // Vérifier le résultat
      expect(result).toEqual({
        success: true,
        message: 'Connexion réussie',
        sheetAccess: { hasAccess: true }
      });
    });
    
    test('devrait retourner une erreur si l\'URL du script n\'est pas définie', async () => {
      // Supprimer l'URL du script
      formsIntegration.scriptUrl = '';
      
      // Appeler la méthode
      const result = await formsIntegration.testConnection();
      
      // Vérifier que fetch n'a pas été appelé
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Vérifier le résultat
      expect(result).toEqual({
        success: false,
        message: 'URL du script non définie'
      });
    });
  });
});
