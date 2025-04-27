/**
 * Module d'intégration avec Google Forms via Apps Script
 */

class FormsIntegration {
  constructor() {
    // URL du déploiement Web Apps Script (sera définie depuis les paramètres)
    this.scriptUrl = '';
    this.sheetUrl = '';
    this.enabled = false;
    this.offlineSupport = true;
    
    // Charger les paramètres
    this.loadSettings();
    
    // Initialiser les écouteurs d'événements
    this.initEventListeners();
  }
  
  /**
   * Charge les paramètres depuis le localStorage
   */
  loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
      if (settings.googleForms) {
        this.scriptUrl = settings.googleForms.scriptUrl || '';
        this.sheetUrl = settings.googleForms.sheetUrl || '';
        this.enabled = settings.googleForms.enabled === true;
        this.offlineSupport = settings.googleForms.offlineSupport !== false;
      }
      console.log('Paramètres d\'intégration Google Forms chargés');
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => this.submitPendingData());
    
    // Écouter les changements de paramètres
    window.addEventListener('settings-updated', () => this.loadSettings());
  }

  /**
   * Soumet les données du joueur au formulaire Google
   * @param {Object} playerData - Données du joueur à soumettre
   * @returns {Promise} - Promesse résolue avec la réponse du serveur
   */
  async submitPlayerData(playerData) {
    // Vérifier si l'intégration est activée
    if (!this.enabled) {
      console.log('Intégration Google Forms désactivée');
      return {
        status: 'disabled',
        message: 'Intégration Google Forms désactivée'
      };
    }
    
    try {
      // Vérifier si nous sommes en ligne
      if (!navigator.onLine) {
        // Stocker les données localement pour soumission ultérieure
        if (this.offlineSupport) {
          this.storeDataForLaterSubmission(playerData);
          return {
            status: 'pending',
            message: 'Données stockées localement pour soumission ultérieure'
          };
        } else {
          return {
            status: 'error',
            message: 'Hors ligne et support hors ligne désactivé'
          };
        }
      }

      // Préparer les données à envoyer
      const dataToSend = {
        action: 'submitAnswer',
        ...playerData,
        timestamp: new Date().toISOString(),
        device: this.getDeviceInfo(),
        version: '1.0.0'
      };

      // Envoyer les données
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Analyser la réponse JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la soumission des données:', error);
      
      // Stocker les données localement en cas d'échec
      if (this.offlineSupport) {
        this.storeDataForLaterSubmission(playerData);
      }
      
      return {
        status: 'error',
        message: `Erreur: ${error.message}. ${this.offlineSupport ? 'Données stockées localement.' : ''}`
      };
    }
  }

  /**
   * Stocke les données localement pour une soumission ultérieure
   * @param {Object} playerData - Données du joueur à stocker
   */
  storeDataForLaterSubmission(playerData) {
    try {
      // Récupérer les données existantes
      const pendingData = JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
      
      // Ajouter les nouvelles données
      pendingData.push({
        data: playerData,
        timestamp: new Date().toISOString()
      });
      
      // Enregistrer dans le localStorage
      localStorage.setItem('pendingFormSubmissions', JSON.stringify(pendingData));
      
      console.log('Données stockées localement pour soumission ultérieure');
    } catch (error) {
      console.error('Erreur lors du stockage local des données:', error);
    }
  }

  /**
   * Tente de soumettre les données en attente lorsque la connexion est rétablie
   */
  async submitPendingData() {
    try {
      // Vérifier si l'intégration est activée
      if (!this.enabled) {
        console.log('Intégration Google Forms désactivée');
        return;
      }
      
      // Vérifier si nous sommes en ligne
      if (!navigator.onLine) {
        console.log('Toujours hors ligne, impossible de soumettre les données en attente');
        return;
      }
      
      // Récupérer les données en attente
      const pendingData = JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
      
      if (pendingData.length === 0) {
        console.log('Aucune donnée en attente à soumettre');
        return;
      }
      
      console.log(`Tentative de soumission de ${pendingData.length} entrées en attente`);
      
      // Tableau pour stocker les entrées réussies
      const successfulEntries = [];
      
      // Soumettre chaque entrée
      for (let i = 0; i < pendingData.length; i++) {
        const entry = pendingData[i];
        
        try {
          // Préparer les données
          const dataToSend = {
            action: 'submitAnswer',
            ...entry.data,
            timestamp: entry.timestamp,
            device: this.getDeviceInfo(),
            version: '1.0.0',
            wasOffline: true
          };
          
          // Envoyer les données
          const response = await fetch(this.scriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
          });
          
          // Vérifier si la requête a réussi
          if (response.ok) {
            successfulEntries.push(i);
            console.log(`Entrée ${i + 1}/${pendingData.length} soumise avec succès`);
          } else {
            console.error(`Échec de la soumission de l'entrée ${i + 1}/${pendingData.length}: ${response.status}`);
          }
        } catch (error) {
          console.error(`Erreur lors de la soumission de l'entrée ${i + 1}/${pendingData.length}:`, error);
        }
      }
      
      // Supprimer les entrées réussies
      if (successfulEntries.length > 0) {
        const newPendingData = pendingData.filter((_, index) => !successfulEntries.includes(index));
        localStorage.setItem('pendingFormSubmissions', JSON.stringify(newPendingData));
        console.log(`${successfulEntries.length} entrées soumises avec succès et supprimées de la file d'attente`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission des données en attente:', error);
    }
  }
  
  /**
   * Teste la connexion avec le script Google Apps Script
   * @returns {Promise} - Promesse résolue avec le résultat du test
   */
  async testConnection() {
    try {
      // Vérifier si l'URL du script est définie
      if (!this.scriptUrl) {
        return {
          success: false,
          message: 'URL du script non définie'
        };
      }
      
      // Préparer les données de test
      const testData = {
        action: 'test',
        timestamp: new Date().toISOString(),
        source: 'admin-panel'
      };
      
      // Envoyer la requête de test
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      // Vérifier si la requête a réussi
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Analyser la réponse
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
      return {
        success: false,
        message: `Erreur: ${error.message}`
      };
    }
  }
  
  /**
   * Récupère les informations sur l'appareil
   * @returns {string} - Informations sur l'appareil
   */
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'unknown';
    
    if (/Android/i.test(userAgent)) {
      deviceType = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = 'iOS';
    } else if (/Windows/i.test(userAgent)) {
      deviceType = 'Windows';
    } else if (/Mac/i.test(userAgent)) {
      deviceType = 'Mac';
    } else if (/Linux/i.test(userAgent)) {
      deviceType = 'Linux';
    }
    
    return deviceType;
  }
}

// Créer une instance globale
const formsIntegration = new FormsIntegration();

// Écouter les événements de connectivité
window.addEventListener('online', () => {
  console.log('Connexion rétablie, tentative de soumission des données en attente');
  formsIntegration.submitPendingData();
});

// Exporter l'instance
window.formsIntegration = formsIntegration;
