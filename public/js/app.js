// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const scanButton = document.getElementById('scanButton');
  const installButton = document.getElementById('installButton');
  const startGameButton = document.getElementById('startGameButton');
  const resumeGameButton = document.getElementById('resumeGameButton');
  const closeScanner = document.getElementById('closeScanner');
  const homeScreen = document.getElementById('home-screen');
  const playerInfoScreen = document.getElementById('player-info-screen');
  const scannerScreen = document.getElementById('scanner-screen');
  const gameScreen = document.getElementById('game-screen');
  const resultsScreen = document.getElementById('results-screen');
  const challengeTitle = document.getElementById('challenge-title');
  const challengeDescription = document.getElementById('challenge-description');
  const completedChallenges = document.getElementById('completed-challenges');
  const totalChallenges = document.getElementById('total-challenges');
  const progressFill = document.querySelector('.progress-fill');
  const playerInfoForm = document.getElementById('player-info-form');
  const playerNameInput = document.getElementById('player-name');
  const playerEmailInput = document.getElementById('player-email');
  const dataConsentCheckbox = document.getElementById('data-consent');
  const backToHomeButton = document.getElementById('back-to-home');
  const currentPlayerName = document.getElementById('current-player-name');
  const submitProgressButton = document.getElementById('submit-progress');
  const finalChallengesCount = document.getElementById('final-challenges-count');
  const totalTimeElement = document.getElementById('total-time');
  const shareResultsButton = document.getElementById('share-results');
  const newGameButton = document.getElementById('new-game');
  
  // Game state
  let gameState = {
    inProgress: false,
    currentChallenge: 0,
    totalChallenges: 5,
    playerName: '',
    playerEmail: '',
    startTime: null,
    endTime: null,
    challenges: [
      { id: 'start', title: 'Point de Départ', description: 'Trouvez le premier code QR pour commencer votre voyage!' },
      { id: 'challenge1', title: 'Premier Défi', description: 'Vous l\'avez trouvé! Maintenant cherchez le deuxième code QR.' },
      { id: 'challenge2', title: 'Deuxième Défi', description: 'Bien joué! Trouvez le troisième code QR.' },
      { id: 'challenge3', title: 'Troisième Défi', description: 'Presque terminé! Trouvez le quatrième code QR.' },
      { id: 'challenge4', title: 'Défi Final', description: 'Le dernier! Trouvez le code QR final pour terminer le jeu.' },
      { id: 'finish', title: 'Jeu Terminé!', description: 'Félicitations! Vous avez complété tous les défis!' }
    ]
  };
  
  // Load game state from localStorage if available
  const loadGameState = () => {
    const savedState = localStorage.getItem('qrGameState');
    if (savedState) {
      gameState = { ...gameState, ...JSON.parse(savedState) };
      updateGameUI();
      
      // Mettre à jour le nom du joueur affiché
      currentPlayerName.textContent = gameState.playerName || '-';
      
      resumeGameButton.disabled = false;
    } else {
      resumeGameButton.disabled = true;
    }
  };
  
  // Save game state to localStorage
  const saveGameState = () => {
    localStorage.setItem('qrGameState', JSON.stringify({
      inProgress: gameState.inProgress,
      currentChallenge: gameState.currentChallenge,
      playerName: gameState.playerName,
      playerEmail: gameState.playerEmail,
      startTime: gameState.startTime,
      endTime: gameState.endTime
    }));
  };
  
  // Update game UI based on current state
  const updateGameUI = () => {
    const challenge = gameState.challenges[gameState.currentChallenge];
    challengeTitle.textContent = challenge.title;
    challengeDescription.textContent = challenge.description;
    completedChallenges.textContent = gameState.currentChallenge;
    totalChallenges.textContent = gameState.totalChallenges;
    
    // Update progress bar
    const progress = (gameState.currentChallenge / gameState.totalChallenges) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Si le jeu est terminé, afficher l'écran de résultats
    if (gameState.currentChallenge === gameState.challenges.length - 1) {
      // Calculer le temps total
      if (!gameState.endTime) {
        gameState.endTime = new Date().toISOString();
        saveGameState();
      }
      
      const startTime = new Date(gameState.startTime);
      const endTime = new Date(gameState.endTime);
      const totalTimeMs = endTime - startTime;
      
      // Formater le temps total
      const hours = Math.floor(totalTimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((totalTimeMs % (1000 * 60)) / 1000);
      
      totalTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      finalChallengesCount.textContent = `${gameState.totalChallenges}/${gameState.totalChallenges}`;
      
      // Soumettre automatiquement les résultats finaux
      submitGameResults();
    }
  };
  
  // Show toast message
  const showToast = (message, duration = 3000) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };
  
  // Switch between screens
  const showScreen = (screen) => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  };
  
  // Start a new game
  const startNewGame = () => {
    // Afficher l'écran d'information du joueur
    showScreen(playerInfoScreen);
  };
  
  // Initialiser le jeu avec les informations du joueur
  const initializeGame = (playerName, playerEmail) => {
    gameState.inProgress = true;
    gameState.currentChallenge = 0;
    gameState.playerName = playerName;
    gameState.playerEmail = playerEmail;
    gameState.startTime = new Date().toISOString();
    gameState.endTime = null;
    
    saveGameState();
    
    // Mettre à jour l'interface utilisateur
    currentPlayerName.textContent = playerName;
    updateGameUI();
    showScreen(gameScreen);
  };
  
  // Resume existing game
  const resumeGame = () => {
    if (gameState.inProgress) {
      updateGameUI();
      
      // Si le jeu est terminé, afficher l'écran de résultats
      if (gameState.currentChallenge === gameState.challenges.length - 1) {
        showScreen(resultsScreen);
      } else {
        showScreen(gameScreen);
      }
    }
  };
  
  // Process QR code result
  const processQRResult = (result) => {
    try {
      // Close scanner
      closeQRScanner();
      
      // Check if result is a valid URL
      const url = new URL(result);
      
      // Extract game ID from path
      const pathParts = url.pathname.split('/');
      const gameId = pathParts[pathParts.length - 1];
      
      // Find matching challenge
      const nextChallengeIndex = gameState.currentChallenge + 1;
      
      if (nextChallengeIndex <= gameState.challenges.length - 1 && 
          gameState.challenges[nextChallengeIndex].id === gameId) {
        // Correct QR code for next challenge
        gameState.currentChallenge = nextChallengeIndex;
        saveGameState();
        updateGameUI();
        
        // Si c'est le dernier défi, afficher l'écran de résultats
        if (nextChallengeIndex === gameState.challenges.length - 1) {
          showScreen(resultsScreen);
        } else {
          showScreen(gameScreen);
        }
        
        showToast('Défi complété!');
      } else if (gameState.challenges.some(c => c.id === gameId)) {
        // QR code is valid but not the next one
        showToast('Vous avez déjà complété ce défi ou ce n\'est pas le prochain.');
      } else {
        // Invalid QR code
        showToast('Code QR invalide. Essayez à nouveau.');
      }
    } catch (error) {
      showToast('Format de code QR invalide. Essayez à nouveau.');
      console.error('Erreur lors du traitement du code QR:', error);
    }
  };
  
  // Handle deep linking
  const handleDeepLink = () => {
    const url = window.location.href;
    const urlObj = new URL(url);
    
    if (urlObj.pathname.startsWith('/game/')) {
      const gameId = urlObj.pathname.split('/').pop();
      
      // If game not started, start it
      if (!gameState.inProgress) {
        startNewGame();
      }
      
      // Find the challenge that matches the gameId
      const challengeIndex = gameState.challenges.findIndex(c => c.id === gameId);
      
      if (challengeIndex > -1) {
        if (challengeIndex === gameState.currentChallenge + 1) {
          // It's the next challenge
          gameState.currentChallenge = challengeIndex;
          saveGameState();
          updateGameUI();
          showScreen(gameScreen);
          showToast('Défi activé!');
        } else if (challengeIndex <= gameState.currentChallenge) {
          // Already completed this challenge
          showToast('Vous avez déjà complété ce défi.');
          showScreen(gameScreen);
        } else {
          // Future challenge, not ready yet
          showToast('Vous n\'êtes pas encore prêt pour ce défi.');
          showScreen(gameScreen);
        }
      }
    }
  };
  
  // Soumettre les résultats du jeu à Google Forms
  const submitGameResults = async () => {
    if (!gameState.playerName) {
      showToast('Aucune information de joueur disponible.');
      return;
    }
    
    // Préparer les données à soumettre
    const playerData = {
      playerId: Date.now().toString(), // Utiliser un timestamp comme ID unique
      playerName: gameState.playerName,
      level: gameState.challenges[gameState.currentChallenge].id,
      comments: gameState.playerEmail ? `Email: ${gameState.playerEmail}` : ''
    };
    
    try {
      // Utiliser le module d'intégration Forms pour soumettre les données
      submitProgressButton.disabled = true;
      submitProgressButton.textContent = 'Envoi en cours...';
      
      const result = await formsIntegration.submitPlayerData(playerData);
      
      if (result.status === 'success') {
        showToast('Progression soumise avec succès!');
        submitProgressButton.textContent = 'Soumis ✓';
      } else if (result.status === 'pending') {
        showToast('Données enregistrées localement pour soumission ultérieure.');
        submitProgressButton.textContent = 'Soumission en attente';
      } else {
        showToast('Erreur lors de la soumission. Réessayez plus tard.');
        submitProgressButton.disabled = false;
        submitProgressButton.textContent = 'Réessayer';
      }
    } catch (error) {
      console.error('Erreur lors de la soumission des résultats:', error);
      showToast('Erreur lors de la soumission. Réessayez plus tard.');
      submitProgressButton.disabled = false;
      submitProgressButton.textContent = 'Réessayer';
    }
  };
  
  // Partager les résultats
  const shareResults = async () => {
    if (!navigator.share) {
      showToast('Le partage n\'est pas supporté sur votre navigateur.');
      return;
    }
    
    try {
      await navigator.share({
        title: 'Mes résultats QR Game',
        text: `J'ai terminé le QR Game en ${totalTimeElement.textContent}!`,
        url: window.location.origin
      });
      showToast('Partagé avec succès!');
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      showToast('Erreur lors du partage.');
    }
  };
  
  // Event Listeners
  scanButton.addEventListener('click', () => {
    initQRScanner();
    showScreen(scannerScreen);
  });
  
  startGameButton.addEventListener('click', startNewGame);
  
  resumeGameButton.addEventListener('click', resumeGame);
  
  closeScanner.addEventListener('click', () => {
    closeQRScanner();
    gameState.inProgress ? showScreen(gameScreen) : showScreen(homeScreen);
  });
  
  // Gestionnaire de soumission du formulaire d'information du joueur
  playerInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const playerName = playerNameInput.value.trim();
    const playerEmail = playerEmailInput.value.trim();
    const dataConsent = dataConsentCheckbox.checked;
    
    if (!playerName || !dataConsent) {
      showToast('Veuillez remplir tous les champs requis.');
      return;
    }
    
    initializeGame(playerName, playerEmail);
  });
  
  // Bouton retour à l'accueil
  backToHomeButton.addEventListener('click', () => {
    showScreen(homeScreen);
  });
  
  // Bouton de soumission de progression
  submitProgressButton.addEventListener('click', submitGameResults);
  
  // Bouton de partage des résultats
  shareResultsButton.addEventListener('click', shareResults);
  
  // Bouton nouvelle partie depuis l'écran de résultats
  newGameButton.addEventListener('click', () => {
    showScreen(homeScreen);
  });
  
  // Check for PWA installation
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    installButton.hidden = false;
  });
  
  installButton.addEventListener('click', () => {
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Utilisateur a accepté l\'installation');
          installButton.hidden = true;
        } else {
          console.log('Utilisateur a refusé l\'installation');
        }
        deferredPrompt = null;
      });
    }
  });
  
  // Initialize
  loadGameState();
  handleDeepLink();
  
  // Listen for changes to the URL (for deep linking)
  window.addEventListener('popstate', handleDeepLink);
});
