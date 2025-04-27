/**
 * Module d'authentification pour l'administration
 */

// Clé de stockage du token d'authentification
const AUTH_TOKEN_KEY = 'qr_game_admin_token';

// Utilisateur par défaut (à remplacer par une authentification réelle en production)
const DEFAULT_USER = {
  username: 'admin',
  password: 'admin123',
  name: 'Administrateur',
  email: 'admin@example.com'
};

/**
 * Initialise le module d'authentification
 */
function initAuth() {
  // Gestionnaire pour le formulaire de connexion
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      login(username, password);
    });
  }
  
  // Afficher les informations de l'utilisateur connecté
  if (isAuthenticated()) {
    displayUserInfo();
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {boolean} Vrai si l'utilisateur est authentifié
 */
function isAuthenticated() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
}

/**
 * Connecte l'utilisateur
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 */
function login(username, password) {
  // Dans une application réelle, cette fonction ferait une requête à un serveur d'authentification
  // Pour cette démo, nous vérifions simplement les identifiants par défaut
  
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    // Générer un token (simulé)
    const token = generateToken();
    
    // Stocker le token
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    
    // Stocker les informations de l'utilisateur
    localStorage.setItem('qr_game_admin_user', JSON.stringify({
      username: DEFAULT_USER.username,
      name: DEFAULT_USER.name,
      email: DEFAULT_USER.email,
      lastLogin: new Date().toISOString()
    }));
    
    // Recharger la page
    window.location.reload();
  } else {
    // Afficher un message d'erreur
    showToast('Identifiants incorrects', 'error');
    
    // Secouer le formulaire
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      loginCard.classList.add('shake');
      setTimeout(() => {
        loginCard.classList.remove('shake');
      }, 500);
    }
  }
}

/**
 * Déconnecte l'utilisateur
 */
function logout() {
  // Supprimer le token
  localStorage.removeItem(AUTH_TOKEN_KEY);
  
  // Supprimer les informations de l'utilisateur
  localStorage.removeItem('qr_game_admin_user');
  
  // Afficher un message
  showToast('Vous avez été déconnecté');
}

/**
 * Affiche le formulaire de connexion
 */
function showLoginForm() {
  // Masquer le contenu principal
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  // Afficher le formulaire de connexion
  const loginContainer = document.getElementById('login-container');
  if (loginContainer) {
    loginContainer.style.display = 'flex';
  } else {
    // Créer le formulaire de connexion s'il n'existe pas
    createLoginForm();
  }
}

/**
 * Crée le formulaire de connexion
 */
function createLoginForm() {
  // Créer le conteneur
  const loginContainer = document.createElement('div');
  loginContainer.id = 'login-container';
  loginContainer.className = 'login-container';
  
  // Créer le contenu du formulaire
  loginContainer.innerHTML = `
    <div class="login-card">
      <div class="login-header">
        <h2>QR Game Admin</h2>
        <p>Connectez-vous pour accéder au panneau d'administration</p>
      </div>
      <form id="login-form" class="login-form">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" name="password" class="form-control" required>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block">Se connecter</button>
        </div>
      </form>
      <div class="login-footer">
        <p class="text-muted">Identifiants par défaut : admin / admin123</p>
        <p class="text-muted"> ${new Date().getFullYear()} QR Game</p>
      </div>
    </div>
  `;
  
  // Ajouter le formulaire au document
  document.body.appendChild(loginContainer);
  
  // Ajouter le gestionnaire d'événements
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      login(username, password);
    });
  }
  
  // Ajouter les styles
  addLoginStyles();
}

/**
 * Ajoute les styles pour le formulaire de connexion
 */
function addLoginStyles() {
  // Vérifier si les styles existent déjà
  if (document.getElementById('login-styles')) {
    return;
  }
  
  // Créer l'élément style
  const style = document.createElement('style');
  style.id = 'login-styles';
  
  // Définir les styles
  style.textContent = `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .login-header {
      padding: 20px;
      background-color: #4285f4;
      color: white;
      text-align: center;
    }
    
    .login-header h2 {
      margin: 0;
      font-size: 24px;
    }
    
    .login-header p {
      margin: 10px 0 0;
      opacity: 0.8;
    }
    
    .login-form {
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .btn-block {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      margin-top: 10px;
    }
    
    .login-footer {
      padding: 15px 20px;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
      text-align: center;
    }
    
    .login-footer p {
      margin: 5px 0;
      font-size: 14px;
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    
    @keyframes shake {
      10%, 90% {
        transform: translate3d(-1px, 0, 0);
      }
      20%, 80% {
        transform: translate3d(2px, 0, 0);
      }
      30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0);
      }
      40%, 60% {
        transform: translate3d(4px, 0, 0);
      }
    }
  `;
  
  // Ajouter les styles au document
  document.head.appendChild(style);
}

/**
 * Affiche les informations de l'utilisateur connecté
 */
function displayUserInfo() {
  // Récupérer les informations de l'utilisateur
  const userInfo = JSON.parse(localStorage.getItem('qr_game_admin_user') || '{}');
  
  // Mettre à jour l'élément d'affichage du nom d'utilisateur
  const usernameElement = document.getElementById('user-name');
  if (usernameElement && userInfo.name) {
    usernameElement.textContent = userInfo.name;
  }
  
  // Mettre à jour l'élément d'affichage de l'email
  const emailElement = document.getElementById('user-email');
  if (emailElement && userInfo.email) {
    emailElement.textContent = userInfo.email;
  }
}

/**
 * Génère un token d'authentification simulé
 * @returns {string} Token d'authentification
 */
function generateToken() {
  // Dans une application réelle, cette fonction serait remplacée par un vrai système d'authentification
  // Pour cette démo, nous générons simplement une chaîne aléatoire
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

// Initialiser le module d'authentification
document.addEventListener('DOMContentLoaded', initAuth);
