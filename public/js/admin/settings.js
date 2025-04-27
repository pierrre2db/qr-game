/**
 * Module de paramètres pour l'administration
 */

/**
 * Initialise le module de paramètres
 */
function initSettings() {
  // Charger les paramètres actuels
  loadSettings();
  
  // Gestionnaire pour le formulaire de paramètres généraux
  const generalSettingsForm = document.getElementById('general-settings-form');
  if (generalSettingsForm) {
    generalSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGeneralSettings();
    });
  }
  
  // Gestionnaire pour le formulaire de paramètres Google Forms
  const googleFormsSettingsForm = document.getElementById('google-forms-settings-form');
  if (googleFormsSettingsForm) {
    googleFormsSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGoogleFormsSettings();
    });
  }
  
  // Gestionnaire pour le formulaire de paramètres de jeu
  const gameSettingsForm = document.getElementById('game-settings-form');
  if (gameSettingsForm) {
    gameSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGameSettings();
    });
  }
  
  // Gestionnaire pour le bouton de réinitialisation
  const resetButton = document.getElementById('reset-settings');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
        resetSettings();
      }
    });
  }
  
  // Gestionnaire pour le bouton de test de connexion Google Forms
  const testConnectionButton = document.getElementById('test-forms-connection');
  if (testConnectionButton) {
    testConnectionButton.addEventListener('click', testGoogleFormsConnection);
  }
}

/**
 * Charge les paramètres actuels
 */
function loadSettings() {
  // Récupérer les paramètres
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  
  // Si aucun paramètre n'existe, créer des paramètres par défaut
  if (Object.keys(settings).length === 0) {
    createDefaultSettings();
    return;
  }
  
  // Paramètres généraux
  if (settings.general) {
    document.getElementById('game-title').value = settings.general.gameTitle || '';
    document.getElementById('base-url').value = settings.general.baseUrl || '';
    document.getElementById('admin-email').value = settings.general.adminEmail || '';
    document.getElementById('logo-url').value = settings.general.logoUrl || '';
    document.getElementById('primary-color').value = settings.general.primaryColor || '#4285f4';
    document.getElementById('secondary-color').value = settings.general.secondaryColor || '#34a853';
  }
  
  // Paramètres Google Forms
  if (settings.googleForms) {
    document.getElementById('forms-script-url').value = settings.googleForms.scriptUrl || '';
    document.getElementById('google-sheet-url').value = settings.googleForms.sheetUrl || '';
    document.getElementById('form-id').value = settings.googleForms.formId || '';
    document.getElementById('sheet-id').value = settings.googleForms.sheetId || '';
    document.getElementById('offline-support').checked = settings.googleForms.offlineSupport !== false;
    document.getElementById('enable-forms-integration').checked = settings.googleForms.enabled === true;
  }
  
  // Paramètres de jeu
  if (settings.game) {
    document.getElementById('points-per-question').value = settings.game.pointsPerQuestion || 10;
    document.getElementById('time-limit').value = settings.game.timeLimit || 0;
    document.getElementById('show-leaderboard').checked = settings.game.showLeaderboard !== false;
    document.getElementById('require-login').checked = settings.game.requireLogin === true;
    document.getElementById('show-hints').checked = settings.game.showHints !== false;
    document.getElementById('allow-skip').checked = settings.game.allowSkip === true;
  }
}

/**
 * Crée des paramètres par défaut
 */
function createDefaultSettings() {
  const defaultSettings = {
    general: {
      gameTitle: 'QR Game',
      baseUrl: window.location.origin,
      adminEmail: '',
      logoUrl: '',
      primaryColor: '#4285f4',
      secondaryColor: '#34a853'
    },
    googleForms: {
      scriptUrl: '',
      sheetUrl: '',
      formId: '',
      sheetId: '',
      offlineSupport: true,
      enabled: true
    },
    game: {
      pointsPerQuestion: 10,
      timeLimit: 0,
      showLeaderboard: true,
      requireLogin: false,
      showHints: true,
      allowSkip: false
    }
  };
  
  // Sauvegarder les paramètres par défaut
  localStorage.setItem('qr_game_settings', JSON.stringify(defaultSettings));
  
  // Charger les paramètres
  loadSettings();
}

/**
 * Sauvegarde les paramètres généraux
 */
function saveGeneralSettings() {
  // Récupérer les paramètres actuels
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  
  // Mettre à jour les paramètres généraux
  settings.general = {
    gameTitle: document.getElementById('game-title').value,
    baseUrl: document.getElementById('base-url').value,
    adminEmail: document.getElementById('admin-email').value,
    logoUrl: document.getElementById('logo-url').value,
    primaryColor: document.getElementById('primary-color').value,
    secondaryColor: document.getElementById('secondary-color').value
  };
  
  // Sauvegarder les paramètres
  localStorage.setItem('qr_game_settings', JSON.stringify(settings));
  
  // Appliquer les changements visuels
  applyVisualSettings(settings.general);
  
  // Afficher un message de succès
  showToast('Paramètres généraux sauvegardés');
}

/**
 * Sauvegarde les paramètres Google Forms
 */
function saveGoogleFormsSettings() {
  // Récupérer les paramètres actuels
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  
  // Mettre à jour les paramètres Google Forms
  settings.googleForms = {
    scriptUrl: document.getElementById('forms-script-url').value,
    sheetUrl: document.getElementById('google-sheet-url').value,
    formId: document.getElementById('form-id').value,
    sheetId: document.getElementById('sheet-id').value,
    offlineSupport: document.getElementById('offline-support').checked,
    enabled: document.getElementById('enable-forms-integration').checked
  };
  
  // Sauvegarder les paramètres
  localStorage.setItem('qr_game_settings', JSON.stringify(settings));
  
  // Afficher un message de succès
  showToast('Paramètres Google Forms sauvegardés');
}

/**
 * Sauvegarde les paramètres de jeu
 */
function saveGameSettings() {
  // Récupérer les paramètres actuels
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  
  // Mettre à jour les paramètres de jeu
  settings.game = {
    pointsPerQuestion: parseInt(document.getElementById('points-per-question').value, 10) || 10,
    timeLimit: parseInt(document.getElementById('time-limit').value, 10) || 0,
    showLeaderboard: document.getElementById('show-leaderboard').checked,
    requireLogin: document.getElementById('require-login').checked,
    showHints: document.getElementById('show-hints').checked,
    allowSkip: document.getElementById('allow-skip').checked
  };
  
  // Sauvegarder les paramètres
  localStorage.setItem('qr_game_settings', JSON.stringify(settings));
  
  // Afficher un message de succès
  showToast('Paramètres de jeu sauvegardés');
}

/**
 * Réinitialise tous les paramètres
 */
function resetSettings() {
  // Supprimer les paramètres
  localStorage.removeItem('qr_game_settings');
  
  // Créer des paramètres par défaut
  createDefaultSettings();
  
  // Appliquer les paramètres visuels par défaut
  applyVisualSettings({
    primaryColor: '#4285f4',
    secondaryColor: '#34a853'
  });
  
  // Afficher un message de succès
  showToast('Paramètres réinitialisés');
}

/**
 * Applique les paramètres visuels
 * @param {Object} generalSettings - Paramètres généraux
 */
function applyVisualSettings(generalSettings) {
  if (!generalSettings) return;
  
  // Mettre à jour le titre de la page
  if (generalSettings.gameTitle) {
    document.title = `Admin - ${generalSettings.gameTitle}`;
    const titleElement = document.querySelector('.navbar-brand');
    if (titleElement) {
      titleElement.textContent = generalSettings.gameTitle;
    }
  }
  
  // Mettre à jour le logo
  if (generalSettings.logoUrl) {
    const logoElement = document.getElementById('navbar-logo');
    if (logoElement) {
      logoElement.src = generalSettings.logoUrl;
      logoElement.style.display = 'inline-block';
    }
  }
  
  // Mettre à jour les couleurs
  if (generalSettings.primaryColor || generalSettings.secondaryColor) {
    updateColors(generalSettings.primaryColor, generalSettings.secondaryColor);
  }
}

/**
 * Met à jour les couleurs de l'interface
 * @param {string} primaryColor - Couleur primaire
 * @param {string} secondaryColor - Couleur secondaire
 */
function updateColors(primaryColor, secondaryColor) {
  // Créer une feuille de style dynamique
  let styleElement = document.getElementById('dynamic-colors');
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dynamic-colors';
    document.head.appendChild(styleElement);
  }
  
  // Définir les règles CSS
  styleElement.textContent = `
    :root {
      --primary-color: ${primaryColor || '#4285f4'};
      --secondary-color: ${secondaryColor || '#34a853'};
      --primary-hover: ${adjustBrightness(primaryColor || '#4285f4', -10)};
      --secondary-hover: ${adjustBrightness(secondaryColor || '#34a853', -10)};
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    .btn-primary:hover, .btn-primary:focus, .btn-primary:active {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }
    
    .btn-success {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
    }
    
    .btn-success:hover, .btn-success:focus, .btn-success:active {
      background-color: var(--secondary-hover);
      border-color: var(--secondary-hover);
    }
    
    .navbar {
      background-color: var(--primary-color) !important;
    }
    
    .sidebar {
      background-color: #f8f9fa;
    }
    
    .sidebar .nav-link.active {
      background-color: var(--primary-color);
      color: white;
    }
    
    .sidebar .nav-link:hover {
      background-color: var(--primary-hover);
      color: white;
    }
    
    .card-header {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .progress-bar {
      background-color: var(--primary-color);
    }
  `;
}

/**
 * Ajuste la luminosité d'une couleur
 * @param {string} color - Couleur au format hexadécimal
 * @param {number} percent - Pourcentage d'ajustement (-100 à 100)
 * @returns {string} Couleur ajustée
 */
function adjustBrightness(color, percent) {
  if (!color) return '#4285f4';
  
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

  return '#' + RR + GG + BB;
}

/**
 * Teste la connexion à Google Forms
 */
function testGoogleFormsConnection() {
  // Récupérer les paramètres Google Forms
  const scriptUrl = document.getElementById('forms-script-url').value;
  const sheetUrl = document.getElementById('google-sheet-url').value;
  
  // Vérifier que les URLs sont renseignées
  if (!scriptUrl) {
    showToast('Veuillez renseigner l\'URL du script Apps Script', 'error');
    return;
  }
  
  if (!sheetUrl) {
    showToast('Veuillez renseigner l\'URL du Google Sheet', 'error');
    return;
  }
  
  // Afficher un message de chargement
  showToast('Test de connexion en cours...', 'info');
  
  // Préparer les données de test
  const testData = {
    action: 'test',
    timestamp: new Date().toISOString(),
    source: 'admin-panel'
  };
  
  // Envoyer une requête de test
  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      showToast('Connexion réussie! Le script Apps Script est accessible.', 'success');
      
      // Vérifier l'accès au Google Sheet
      if (data.sheetAccess) {
        showToast('Le Google Sheet est accessible et correctement configuré.', 'success');
      } else {
        showToast('Le script est accessible mais ne peut pas accéder au Google Sheet. Vérifiez les permissions.', 'warning');
      }
    } else {
      showToast(`Erreur: ${data.error || 'Réponse invalide du serveur'}`, 'error');
    }
  })
  .catch(error => {
    console.error('Erreur lors du test de connexion:', error);
    showToast(`Échec de la connexion: ${error.message}`, 'error');
  });
}

/**
 * Exporte les paramètres
 */
function exportSettings() {
  // Récupérer les paramètres
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  
  // Créer un objet Blob avec les données
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  
  // Télécharger le fichier
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qr-game-settings.json';
  
  // Ajouter le lien au document
  document.body.appendChild(link);
  
  // Cliquer sur le lien
  link.click();
  
  // Supprimer le lien
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Afficher un message de succès
  showToast('Paramètres exportés');
}

/**
 * Importe les paramètres
 * @param {Event} event - Événement de changement de fichier
 */
function importSettings(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const settings = JSON.parse(e.target.result);
      
      // Valider les paramètres
      if (!settings.general || !settings.googleForms || !settings.game) {
        throw new Error('Format de fichier de paramètres invalide');
      }
      
      // Sauvegarder les paramètres
      localStorage.setItem('qr_game_settings', JSON.stringify(settings));
      
      // Recharger les paramètres
      loadSettings();
      
      // Appliquer les paramètres visuels
      applyVisualSettings(settings.general);
      
      // Afficher un message de succès
      showToast('Paramètres importés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'importation des paramètres :', error);
      showToast('Erreur lors de l\'importation des paramètres', 'error');
    }
  };
  
  reader.readAsText(file);
  
  // Réinitialiser l'input file
  event.target.value = '';
}
