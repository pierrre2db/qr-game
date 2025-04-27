/**
 * Script principal pour la page d'administration
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser l'authentification
  initAuth();
  
  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated()) {
    showLoginForm();
    return;
  }
  
  // Initialiser la navigation
  initNavigation();
  
  // Initialiser les modules
  initModules();
  
  // Charger la section par défaut (tableau de bord)
  loadSection('dashboard');
});

/**
 * Initialise la navigation
 */
function initNavigation() {
  // Gestionnaire pour les liens de navigation
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Récupérer la section cible
      const targetSection = this.getAttribute('data-section');
      
      // Charger la section
      loadSection(targetSection);
      
      // Fermer le menu sur mobile
      const toggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      
      if (window.innerWidth < 768 && navbarCollapse.classList.contains('show')) {
        toggler.click();
      }
    });
  });
  
  // Gestionnaire pour le bouton de déconnexion
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
      showLoginForm();
    });
  }
}

/**
 * Initialise tous les modules
 */
function initModules() {
  // Initialiser le module de questions
  if (typeof initQuestions === 'function') {
    initQuestions();
  }
  
  // Initialiser le module de tableau de bord
  if (typeof initDashboard === 'function') {
    initDashboard();
  }
  
  // Initialiser le module de statistiques
  if (typeof initStatistics === 'function') {
    initStatistics();
  }
  
  // Initialiser le module d'exportation
  if (typeof initExport === 'function') {
    initExport();
  }
  
  // Initialiser le module de paramètres
  if (typeof initSettings === 'function') {
    initSettings();
  }
}

/**
 * Charge une section
 * @param {string} sectionId - ID de la section à charger
 */
function loadSection(sectionId) {
  // Masquer toutes les sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Afficher la section demandée
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
  
  // Mettre à jour la navigation
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });
  
  // Mettre à jour le titre de la page
  updatePageTitle(sectionId);
  
  // Exécuter des actions spécifiques à la section
  switch (sectionId) {
    case 'dashboard':
      // Actualiser le tableau de bord
      if (typeof loadDashboardData === 'function') {
        loadDashboardData();
      }
      break;
    case 'questions':
      // Actualiser la liste des questions
      if (typeof loadQuestions === 'function') {
        loadQuestions();
      }
      break;
    case 'statistics':
      // Actualiser les statistiques
      if (typeof loadStatistics === 'function') {
        loadStatistics('7days');
      }
      break;
    case 'export':
      // Actualiser la liste des exports programmés
      if (typeof loadScheduledExports === 'function') {
        loadScheduledExports();
      }
      break;
    case 'settings':
      // Actualiser les paramètres
      if (typeof loadSettings === 'function') {
        loadSettings();
      }
      break;
  }
}

/**
 * Met à jour le titre de la page
 * @param {string} sectionId - ID de la section active
 */
function updatePageTitle(sectionId) {
  let sectionTitle = '';
  
  switch (sectionId) {
    case 'dashboard':
      sectionTitle = 'Tableau de bord';
      break;
    case 'questions':
      sectionTitle = 'Gestion des questions';
      break;
    case 'statistics':
      sectionTitle = 'Statistiques';
      break;
    case 'export':
      sectionTitle = 'Exportation des données';
      break;
    case 'settings':
      sectionTitle = 'Paramètres';
      break;
    default:
      sectionTitle = 'Administration';
  }
  
  // Mettre à jour le titre de la page
  document.title = `${sectionTitle} - QR Game Admin`;
  
  // Mettre à jour le titre dans la page
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    pageTitle.textContent = sectionTitle;
  }
}

/**
 * Affiche un message toast
 * @param {string} message - Message à afficher
 * @param {string} type - Type de message (success, error, warning, info)
 */
function showToast(message, type = 'success') {
  // Créer l'élément toast s'il n'existe pas
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Créer le toast
  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
    </div>
  `;
  
  // Ajouter le toast au conteneur
  toastContainer.appendChild(toast);
  
  // Initialiser le toast
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 3000
  });
  
  // Afficher le toast
  bsToast.show();
  
  // Supprimer le toast après qu'il soit caché
  toast.addEventListener('hidden.bs.toast', function() {
    toast.remove();
  });
}
