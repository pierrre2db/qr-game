// Fonction pour initialiser correctement les éléments DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation des éléments DOM');
  
  // Éléments principaux
  welcomeScreen = document.getElementById('welcome-screen');
  confirmationScreen = document.getElementById('confirmation-screen');
  gameScreen = document.getElementById('game-screen');
  
  // Vérifier que les éléments existent
  if (!welcomeScreen) console.error('Écran d\'accueil introuvable');
  if (!confirmationScreen) console.error('Écran de confirmation introuvable');
  if (!gameScreen) console.error('Écran de jeu introuvable');
  
  // Configurer les écouteurs d'événements
  setupEventListeners();
});

// Fonction pour valider les informations du joueur
function validatePlayerInfo() {
  console.log('Validation des informations du joueur');
  
  const nameInput = document.getElementById('player-name');
  const emailInput = document.getElementById('player-email');
  const phoneInput = document.getElementById('player-phone');
  
  if (!nameInput || !emailInput || !phoneInput) {
    console.error('Champs du formulaire introuvables');
    return;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  
  console.log('Valeurs des champs', { name, email, phone });
  
  // Réinitialiser les états de validation
  nameInput.classList.remove('is-invalid');
  emailInput.classList.remove('is-invalid');
  phoneInput.classList.remove('is-invalid');
  
  let isValid = true;
  
  // Valider le nom (obligatoire)
  if (!name) {
    nameInput.classList.add('is-invalid');
    isValid = false;
    console.log('Nom invalide (vide)');
  }
  
  // Valider l'email (optionnel)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    emailInput.classList.add('is-invalid');
    isValid = false;
    console.log('Email invalide');
  }
  
  // Valider le téléphone (optionnel)
  const phoneRegex = /^[0-9]{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    phoneInput.classList.add('is-invalid');
    isValid = false;
    console.log('Téléphone invalide');
  }
  
  if (!isValid) {
    console.log('Formulaire invalide');
    return;
  }
  
  console.log('Formulaire valide, enregistrement des informations');
  
  // Enregistrer les informations du joueur
  playerName = name;
  playerEmail = email;
  playerPhone = phone;
  
  // Générer un ID de session si nécessaire
  if (!sessionId) {
    sessionId = generateSessionId();
  }
  
  // Stocker les informations dans le localStorage
  localStorage.setItem('qr_game_session', JSON.stringify({
    sessionId: sessionId,
    gameId: gameId,
    playerName: playerName,
    email: playerEmail,
    phone: playerPhone,
    startTime: new Date().toISOString()
  }));
  
  console.log('Transition vers l\'écran de confirmation');
  
  // Afficher le nom du joueur dans l'écran de confirmation
  const playerNameDisplay = document.getElementById('player-name-display');
  if (playerNameDisplay) {
    playerNameDisplay.textContent = playerName;
  } else {
    console.error('Élément player-name-display introuvable');
  }
  
  // Masquer l'écran d'accueil et afficher l'écran de confirmation
  welcomeScreen.classList.add('hidden');
  confirmationScreen.classList.remove('hidden');
  
  console.log('Écran de confirmation affiché');
}

// Fonction pour configurer les écouteurs d'événements
function setupEventListeners() {
  console.log('Configuration des écouteurs d\'événements');
  
  // Bouton de démarrage
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) {
    console.log('Bouton de démarrage trouvé');
    startGameBtn.addEventListener('click', validatePlayerInfo);
  } else {
    console.error('Bouton de démarrage introuvable');
  }
  
  // Bouton de scan QR
  const startScanningBtn = document.getElementById('start-scanning-btn');
  if (startScanningBtn) {
    console.log('Bouton de scan QR trouvé');
    startScanningBtn.addEventListener('click', function() {
      console.log('Clic sur le bouton de scan QR');
      confirmationScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      initializeGame();
    });
  } else {
    console.error('Bouton de scan QR introuvable');
  }
}
