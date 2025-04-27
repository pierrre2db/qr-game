/**
 * Module de gestion des données JSON pour QR Game
 */

class JsonManager {
  constructor() {
    this.questions = [];
    this.responses = [];
    this.apiBasePath = '/api';
  }

  /**
   * Charge les questions depuis le serveur
   * @returns {Promise<Array>} Liste des questions
   */
  async loadQuestions() {
    try {
      const response = await fetch(`${this.apiBasePath}/questions`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      this.questions = data.questions || [];
      return this.questions;
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      // Charger depuis le localStorage en cas d'échec
      const localQuestions = localStorage.getItem('qr_game_questions');
      if (localQuestions) {
        try {
          this.questions = JSON.parse(localQuestions).questions || [];
        } catch (e) {
          this.questions = [];
        }
      }
      return this.questions;
    }
  }

  /**
   * Enregistre une réponse
   * @param {Object} responseData - Données de la réponse
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async saveResponse(responseData) {
    try {
      // Ajouter l'horodatage
      const response = {
        ...responseData,
        timestamp: new Date().toISOString()
      };

      // Envoyer au serveur
      const serverResponse = await fetch(`${this.apiBasePath}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      });

      if (!serverResponse.ok) {
        throw new Error(`Erreur HTTP: ${serverResponse.status}`);
      }

      return await serverResponse.json();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la réponse:', error);
      
      // Stocker localement en cas d'échec
      this.storeResponseLocally(responseData);
      
      return {
        success: false,
        message: 'Réponse stockée localement pour envoi ultérieur',
        offline: true
      };
    }
  }

  /**
   * Stocke une réponse localement
   * @param {Object} responseData - Données de la réponse
   */
  storeResponseLocally(responseData) {
    try {
      // Récupérer les réponses existantes
      const localResponses = localStorage.getItem('qr_game_responses');
      let responses = [];
      
      if (localResponses) {
        try {
          responses = JSON.parse(localResponses);
        } catch (e) {
          responses = [];
        }
      }
      
      // Ajouter la nouvelle réponse
      responses.push({
        ...responseData,
        timestamp: new Date().toISOString(),
        offline: true
      });
      
      // Enregistrer dans le localStorage
      localStorage.setItem('qr_game_responses', JSON.stringify(responses));
    } catch (error) {
      console.error('Erreur lors du stockage local de la réponse:', error);
    }
  }

  /**
   * Importe des questions depuis un fichier JSON
   * @param {File} file - Fichier JSON à importer
   * @returns {Promise<Object>} Résultat de l'importation
   */
  async importQuestionsFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          
          if (!jsonData.questions || !Array.isArray(jsonData.questions)) {
            reject(new Error('Format de fichier invalide. Le fichier doit contenir un tableau "questions".'));
            return;
          }
          
          // Valider chaque question
          const validQuestions = jsonData.questions.filter(q => 
            q.id && q.title && q.description !== undefined
          );
          
          if (validQuestions.length === 0) {
            reject(new Error('Aucune question valide trouvée dans le fichier.'));
            return;
          }
          
          // Envoyer au serveur
          try {
            const response = await fetch(`${this.apiBasePath}/questions/import`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ questions: validQuestions })
            });
            
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            this.questions = result.questions || validQuestions;
            
            // Sauvegarder localement
            localStorage.setItem('qr_game_questions', JSON.stringify({ questions: this.questions }));
            
            resolve({
              success: true,
              message: `${validQuestions.length} questions importées avec succès.`,
              questions: this.questions
            });
          } catch (error) {
            console.error('Erreur lors de l\'envoi au serveur:', error);
            
            // Sauvegarder localement en cas d'échec
            this.questions = validQuestions;
            localStorage.setItem('qr_game_questions', JSON.stringify({ questions: this.questions }));
            
            resolve({
              success: true,
              message: `${validQuestions.length} questions importées localement.`,
              questions: this.questions,
              offline: true
            });
          }
        } catch (error) {
          reject(new Error(`Erreur lors de l'analyse du fichier JSON: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier.'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Exporte les questions au format JSON
   * @returns {Blob} Blob contenant les questions au format JSON
   */
  exportQuestionsAsJson() {
    const data = {
      questions: this.questions,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  /**
   * Obtient une question par son ID
   * @param {string} questionId - ID de la question
   * @returns {Object|null} Question trouvée ou null
   */
  getQuestionById(questionId) {
    return this.questions.find(q => q.id === questionId) || null;
  }

  /**
   * Génère un ID unique pour une nouvelle question
   * @returns {string} ID unique
   */
  generateQuestionId() {
    const prefix = 'Q';
    const existingIds = this.questions.map(q => q.id);
    let counter = this.questions.length + 1;
    
    let newId = `${prefix}${counter}`;
    while (existingIds.includes(newId)) {
      counter++;
      newId = `${prefix}${counter}`;
    }
    
    return newId;
  }
}

// Créer une instance globale
const jsonManager = new JsonManager();

// Exporter l'instance
export default jsonManager;
