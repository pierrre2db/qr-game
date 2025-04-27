// Configuration globale pour les tests Jest

// Mock pour les objets du navigateur qui pourraient ne pas être disponibles dans l'environnement de test
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.navigator = {
  ...global.navigator,
  onLine: true
};

// Mock pour les événements
global.CustomEvent = class CustomEvent {
  constructor(event, params) {
    this.type = event;
    this.detail = params?.detail;
    this.bubbles = params?.bubbles || false;
    this.cancelable = params?.cancelable || false;
  }
};

// Mock pour les fonctions de l'API Web
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn();
global.Blob = jest.fn();

// Mock pour Chart.js
jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn()
  }))
}));

// Mock pour JSZip
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(new Blob())
  }));
});
