/**
 * Module de gestion du deep linking pour QR Game
 * Permet de lire les paramètres d'URL, stocker la progression dans localStorage,
 * et router vers le composant de question approprié.
 */

class DeepLinkingManager {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.pathSegments = window.location.pathname.split('/').filter(segment => segment);
    
    // Initialiser le gestionnaire d'historique pour la navigation
    this.initHistoryHandler();
  }

  /**
   * Initialise le gestionnaire d'historique pour la navigation
   */
  initHistoryHandler() {
    window.addEventListener('popstate', (event) => {
      this.handleDeepLink();
    });
  }

  /**
   * Vérifie si l'URL contient un paramètre de question
   * @returns {boolean} Vrai si l'URL contient un paramètre de question
   */
  hasQuestionParam() {
    return this.urlParams.has('question_id');
  }

  /**
   * Récupère l'ID de question depuis l'URL
   * @returns {string|null} L'ID de question ou null si non trouvé
   */
  getQuestionId() {
    return this.urlParams.get('question_id');
  }

  /**
   * Vérifie si l'URL contient un ID de jeu dans le chemin
   * @returns {boolean} Vrai si l'URL contient un ID de jeu
   */
  hasGamePath() {
    return this.pathSegments.length > 0 && this.pathSegments[0] === 'game';
  }

  /**
   * Récupère l'ID de jeu depuis le chemin de l'URL
   * @returns {string|null} L'ID de jeu ou null si non trouvé
   */
  getGameId() {
    if (this.hasGamePath() && this.pathSegments.length > 1) {
      return this.pathSegments[1];
    }
    return null;
  }

  /**
   * Sauvegarde la progression dans le localStorage
   * @param {string} questionId - ID de la question
   * @param {object} data - Données à sauvegarder
   */
  saveProgress(questionId, data) {
    // Récupérer la progression existante
    const progress = this.getProgress();
    
    // Mettre à jour avec les nouvelles données
    progress[questionId] = {
      ...progress[questionId],
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem('qrGameProgress', JSON.stringify(progress));
    
    console.log(`Progression sauvegardée pour la question ${questionId}`);
    return progress;
  }

  /**
   * Récupère toute la progression depuis le localStorage
   * @returns {object} La progression sauvegardée
   */
  getProgress() {
    const progressData = localStorage.getItem('qrGameProgress');
    return progressData ? JSON.parse(progressData) : {};
  }

  /**
   * Récupère la progression pour une question spécifique
   * @param {string} questionId - ID de la question
   * @returns {object|null} Les données de progression ou null si non trouvées
   */
  getQuestionProgress(questionId) {
    const progress = this.getProgress();
    return progress[questionId] || null;
  }

  /**
   * Route vers le composant de question approprié
   * @param {string} questionId - ID de la question
   * @param {object} gameState - État actuel du jeu
   * @returns {boolean} Vrai si le routage a réussi
   */
  routeToQuestion(questionId, gameState) {
    // Trouver le défi correspondant à l'ID de question
    const challengeIndex = gameState.challenges.findIndex(challenge => challenge.id === questionId);
    
    if (challengeIndex === -1) {
      console.error(`Question ID ${questionId} non trouvé dans les défis du jeu`);
      return false;
    }
    
    // Vérifier si le joueur peut accéder à cette question
    if (challengeIndex > gameState.currentChallenge + 1) {
      // Le joueur essaie d'accéder à une question future
      console.warn(`Tentative d'accès à une question future: ${questionId}`);
      showToast('Vous n\'êtes pas encore prêt pour ce défi.');
      return false;
    }
    
    // Mettre à jour l'état du jeu si c'est la prochaine question
    if (challengeIndex === gameState.currentChallenge + 1) {
      gameState.currentChallenge = challengeIndex;
      
      // Sauvegarder l'état du jeu
      localStorage.setItem('qrGameState', JSON.stringify({
        inProgress: gameState.inProgress,
        currentChallenge: gameState.currentChallenge,
        playerName: gameState.playerName,
        playerEmail: gameState.playerEmail,
        startTime: gameState.startTime,
        endTime: gameState.endTime
      }));
      
      // Sauvegarder la progression spécifique à cette question
      this.saveProgress(questionId, {
        completed: true,
        completedAt: new Date().toISOString()
      });
      
      showToast('Défi activé!');
    }
    
    // Mettre à jour l'interface utilisateur
    updateGameUI();
    
    // Afficher l'écran approprié
    if (gameState.currentChallenge === gameState.challenges.length - 1) {
      showScreen(document.getElementById('results-screen'));
    } else {
      showScreen(document.getElementById('game-screen'));
    }
    
    return true;
  }

  /**
   * Gère le deep linking lors du chargement de la page ou de la navigation
   * @param {object} gameState - État actuel du jeu
   */
  handleDeepLink(gameState) {
    // Si gameState n'est pas fourni, utiliser la variable globale
    if (!gameState && window.gameState) {
      gameState = window.gameState;
    }
    
    if (!gameState) {
      console.error('État du jeu non disponible pour le deep linking');
      return;
    }
    
    // Vérifier s'il y a un paramètre de question dans l'URL
    if (this.hasQuestionParam()) {
      const questionId = this.getQuestionId();
      console.log(`Deep link détecté avec question_id: ${questionId}`);
      
      // Si le jeu n'est pas en cours, démarrer une nouvelle partie
      if (!gameState.inProgress) {
        // Rediriger vers la page d'information du joueur avec le paramètre de question
        showScreen(document.getElementById('player-info-screen'));
        
        // Stocker l'ID de question pour une utilisation ultérieure
        sessionStorage.setItem('pendingQuestionId', questionId);
        return;
      }
      
      // Router vers la question
      this.routeToQuestion(questionId, gameState);
      return;
    }
    
    // Vérifier s'il y a un ID de jeu dans le chemin
    if (this.hasGamePath()) {
      const gameId = this.getGameId();
      console.log(`Deep link détecté avec game ID: ${gameId}`);
      
      // Si le jeu n'est pas en cours, démarrer une nouvelle partie
      if (!gameState.inProgress) {
        // Rediriger vers la page d'information du joueur avec l'ID de jeu
        showScreen(document.getElementById('player-info-screen'));
        
        // Stocker l'ID de jeu pour une utilisation ultérieure
        sessionStorage.setItem('pendingGameId', gameId);
        return;
      }
      
      // Router vers le défi
      this.routeToQuestion(gameId, gameState);
      return;
    }
  }

  /**
   * Vérifie s'il y a des liens en attente après l'initialisation du jeu
   * @param {object} gameState - État actuel du jeu
   */
  processPendingLinks(gameState) {
    // Vérifier s'il y a un ID de question en attente
    const pendingQuestionId = sessionStorage.getItem('pendingQuestionId');
    if (pendingQuestionId) {
      sessionStorage.removeItem('pendingQuestionId');
      this.routeToQuestion(pendingQuestionId, gameState);
      return;
    }
    
    // Vérifier s'il y a un ID de jeu en attente
    const pendingGameId = sessionStorage.getItem('pendingGameId');
    if (pendingGameId) {
      sessionStorage.removeItem('pendingGameId');
      this.routeToQuestion(pendingGameId, gameState);
      return;
    }
  }

  /**
   * Met à jour l'URL sans recharger la page
   * @param {string} questionId - ID de la question
   */
  updateUrl(questionId) {
    const newUrl = new URL(window.location.origin);
    newUrl.pathname = `/game/${questionId}`;
    
    // Mettre à jour l'URL sans recharger la page
    window.history.pushState({ questionId }, '', newUrl.toString());
  }
}

// Créer une instance globale
const deepLinkingManager = new DeepLinkingManager();

// Exporter l'instance pour une utilisation dans d'autres modules
window.deepLinkingManager = deepLinkingManager;
