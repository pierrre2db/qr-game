/**
 * Module d'exportation de données pour l'administration
 */

/**
 * Initialise le module d'exportation
 */
function initExport() {
  // Gestionnaire pour les boutons d'exportation
  document.getElementById('export-players-json').addEventListener('click', () => exportPlayersJSON());
  document.getElementById('export-players-csv').addEventListener('click', () => exportPlayersCSV());
  document.getElementById('export-questions-json').addEventListener('click', () => exportQuestionsJSON());
  document.getElementById('export-questions-csv').addEventListener('click', () => exportQuestionsCSV());
  document.getElementById('export-stats-json').addEventListener('click', () => exportStatsJSON());
  document.getElementById('export-stats-csv').addEventListener('click', () => exportStatsCSV());
  
  // Gestionnaire pour le formulaire d'export programmé
  const scheduledExportForm = document.getElementById('scheduled-export-form');
  if (scheduledExportForm) {
    scheduledExportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      scheduleExport();
    });
  }
  
  // Charger les exports programmés existants
  loadScheduledExports();
}

/**
 * Exporte les données des joueurs au format JSON
 */
function exportPlayersJSON() {
  // Récupérer les données des joueurs
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  
  // Créer un objet Blob avec les données
  const blob = new Blob([JSON.stringify(players, null, 2)], { type: 'application/json' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-players.json');
  
  // Afficher un message de succès
  showToast('Données des joueurs exportées au format JSON');
}

/**
 * Exporte les données des joueurs au format CSV
 */
function exportPlayersCSV() {
  // Récupérer les données des joueurs
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  
  // Définir les en-têtes CSV
  const headers = ['ID', 'Nom', 'Email', 'Date d\'inscription'];
  
  // Convertir les données en lignes CSV
  const rows = players.map(player => [
    player.id,
    player.name,
    player.email,
    new Date(player.registeredAt).toLocaleString('fr-FR')
  ]);
  
  // Générer le contenu CSV
  const csvContent = generateCSV(headers, rows);
  
  // Créer un objet Blob avec les données
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-players.csv');
  
  // Afficher un message de succès
  showToast('Données des joueurs exportées au format CSV');
}

/**
 * Exporte les questions au format JSON
 */
function exportQuestionsJSON() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Créer un objet Blob avec les données
  const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-questions.json');
  
  // Afficher un message de succès
  showToast('Questions exportées au format JSON');
}

/**
 * Exporte les questions au format CSV
 */
function exportQuestionsCSV() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Définir les en-têtes CSV
  const headers = ['ID', 'Titre', 'Description', 'Type', 'Points'];
  
  // Convertir les données en lignes CSV
  const rows = questions.map(question => [
    question.id,
    question.title,
    question.description,
    question.type || 'standard',
    question.points || 10
  ]);
  
  // Générer le contenu CSV
  const csvContent = generateCSV(headers, rows);
  
  // Créer un objet Blob avec les données
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-questions.csv');
  
  // Afficher un message de succès
  showToast('Questions exportées au format CSV');
}

/**
 * Exporte les statistiques au format JSON
 */
function exportStatsJSON() {
  // Récupérer les données des joueurs et des parties
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  const games = JSON.parse(localStorage.getItem('qr_game_games') || '[]');
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Calculer les statistiques
  const stats = calculateStats(players, games, questions);
  
  // Créer un objet Blob avec les données
  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-stats.json');
  
  // Afficher un message de succès
  showToast('Statistiques exportées au format JSON');
}

/**
 * Exporte les statistiques au format CSV
 */
function exportStatsCSV() {
  // Récupérer les données des joueurs et des parties
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  const games = JSON.parse(localStorage.getItem('qr_game_games') || '[]');
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Calculer les statistiques
  const stats = calculateStats(players, games, questions);
  
  // Définir les en-têtes CSV
  const headers = ['Métrique', 'Valeur'];
  
  // Convertir les données en lignes CSV
  const rows = [
    ['Nombre total de joueurs', stats.totalPlayers],
    ['Nombre total de parties', stats.totalGames],
    ['Parties complétées', stats.completedGames],
    ['Taux de complétion', `${stats.completionRate}%`],
    ['Temps moyen de complétion', stats.avgCompletionTime],
    ['Score moyen', stats.avgScore],
    ['Date d\'exportation', new Date().toLocaleString('fr-FR')]
  ];
  
  // Ajouter les statistiques par question
  stats.questionStats.forEach(qs => {
    rows.push([`Complétion - ${qs.title}`, `${qs.completionRate}%`]);
    rows.push([`Temps moyen - ${qs.title}`, qs.avgTime]);
  });
  
  // Générer le contenu CSV
  const csvContent = generateCSV(headers, rows);
  
  // Créer un objet Blob avec les données
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-stats.csv');
  
  // Afficher un message de succès
  showToast('Statistiques exportées au format CSV');
}

/**
 * Calcule les statistiques
 * @param {Array} players - Liste des joueurs
 * @param {Array} games - Liste des parties
 * @param {Array} questions - Liste des questions
 * @returns {Object} Statistiques calculées
 */
function calculateStats(players, games, questions) {
  // Statistiques globales
  const totalPlayers = players.length;
  const totalGames = games.length;
  const completedGames = games.filter(game => game.completed).length;
  const completionRate = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;
  
  // Calculer le temps moyen de complétion
  let avgCompletionTime = '00:00';
  let avgScore = 0;
  
  if (completedGames > 0) {
    const completionTimes = games
      .filter(game => game.completed && game.startTime && game.endTime)
      .map(game => new Date(game.endTime) - new Date(game.startTime));
    
    if (completionTimes.length > 0) {
      const avgTimeMs = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
      const avgMinutes = Math.floor(avgTimeMs / 60000);
      const avgSeconds = Math.floor((avgTimeMs % 60000) / 1000);
      avgCompletionTime = `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`;
    }
    
    // Calculer le score moyen
    const scores = games
      .filter(game => game.completed && game.score)
      .map(game => game.score);
    
    if (scores.length > 0) {
      avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    }
  }
  
  // Statistiques par question
  const questionStats = questions.map(question => {
    // Dans une application réelle, nous aurions des données sur les questions complétées
    // Pour cette démo, nous générons des données fictives
    const completionRate = Math.floor(Math.random() * 100);
    const avgMinutes = Math.floor(Math.random() * 10) + 1;
    const avgSeconds = Math.floor(Math.random() * 60);
    
    return {
      id: question.id,
      title: question.title,
      completionRate: completionRate,
      avgTime: `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`
    };
  });
  
  return {
    totalPlayers,
    totalGames,
    completedGames,
    completionRate,
    avgCompletionTime,
    avgScore,
    questionStats,
    exportDate: new Date().toISOString()
  };
}

/**
 * Programme un export automatique
 */
function scheduleExport() {
  // Récupérer les valeurs du formulaire
  const email = document.getElementById('export-email').value;
  const frequency = document.getElementById('export-frequency').value;
  const format = document.getElementById('export-format').value;
  const dataType = document.getElementById('export-data-type').value;
  
  // Valider l'email
  if (!email || !email.includes('@')) {
    showToast('Veuillez saisir une adresse email valide', 'error');
    return;
  }
  
  // Générer un ID unique
  const id = `export_${Date.now()}`;
  
  // Créer l'objet d'export programmé
  const scheduledExport = {
    id,
    email,
    frequency,
    format,
    dataType,
    createdAt: new Date().toISOString(),
    nextExport: getNextExportDate(frequency)
  };
  
  // Récupérer les exports programmés existants
  const scheduledExports = JSON.parse(localStorage.getItem('qr_game_scheduled_exports') || '[]');
  
  // Ajouter le nouvel export
  scheduledExports.push(scheduledExport);
  
  // Sauvegarder les exports programmés
  localStorage.setItem('qr_game_scheduled_exports', JSON.stringify(scheduledExports));
  
  // Mettre à jour la liste des exports programmés
  loadScheduledExports();
  
  // Réinitialiser le formulaire
  document.getElementById('scheduled-export-form').reset();
  
  // Afficher un message de succès
  showToast('Export programmé avec succès');
}

/**
 * Charge les exports programmés
 */
function loadScheduledExports() {
  const scheduledExportsList = document.getElementById('scheduled-exports-list');
  
  if (!scheduledExportsList) return;
  
  // Récupérer les exports programmés
  const scheduledExports = JSON.parse(localStorage.getItem('qr_game_scheduled_exports') || '[]');
  
  // Vider la liste
  scheduledExportsList.innerHTML = '';
  
  // Remplir la liste
  if (scheduledExports.length === 0) {
    scheduledExportsList.innerHTML = '<tr><td colspan="5" class="text-center">Aucun export programmé</td></tr>';
    return;
  }
  
  scheduledExports.forEach(export_ => {
    const row = document.createElement('tr');
    
    // Formater la date du prochain export
    const nextExport = new Date(export_.nextExport).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Formater le type de données
    let dataTypeLabel = '';
    switch (export_.dataType) {
      case 'players':
        dataTypeLabel = 'Joueurs';
        break;
      case 'questions':
        dataTypeLabel = 'Questions';
        break;
      case 'stats':
        dataTypeLabel = 'Statistiques';
        break;
      case 'all':
        dataTypeLabel = 'Toutes les données';
        break;
      default:
        dataTypeLabel = export_.dataType;
    }
    
    row.innerHTML = `
      <td>${export_.email}</td>
      <td>${export_.frequency}</td>
      <td>${export_.format.toUpperCase()}</td>
      <td>${dataTypeLabel}</td>
      <td>${nextExport}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteScheduledExport('${export_.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    scheduledExportsList.appendChild(row);
  });
}

/**
 * Supprime un export programmé
 * @param {string} id - ID de l'export à supprimer
 */
function deleteScheduledExport(id) {
  // Récupérer les exports programmés
  const scheduledExports = JSON.parse(localStorage.getItem('qr_game_scheduled_exports') || '[]');
  
  // Filtrer l'export à supprimer
  const filteredExports = scheduledExports.filter(export_ => export_.id !== id);
  
  // Sauvegarder les exports programmés
  localStorage.setItem('qr_game_scheduled_exports', JSON.stringify(filteredExports));
  
  // Mettre à jour la liste des exports programmés
  loadScheduledExports();
  
  // Afficher un message de succès
  showToast('Export programmé supprimé');
}

/**
 * Calcule la date du prochain export
 * @param {string} frequency - Fréquence (daily, weekly, monthly)
 * @returns {string} Date du prochain export au format ISO
 */
function getNextExportDate(frequency) {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
      break;
    case 'weekly':
      now.setDate(now.getDate() + (7 - now.getDay() + 1) % 7 + (now.getDay() === 1 ? 7 : 0));
      now.setHours(8, 0, 0, 0);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(8, 0, 0, 0);
      break;
    default:
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
  }
  
  return now.toISOString();
}

/**
 * Génère un fichier CSV
 * @param {Array} headers - En-têtes CSV
 * @param {Array} rows - Lignes de données
 * @returns {string} Contenu CSV
 */
function generateCSV(headers, rows) {
  // Fonction pour échapper les valeurs CSV
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const str = String(value);
    
    // Si la valeur contient une virgule, un guillemet ou un saut de ligne, l'entourer de guillemets
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      // Échapper les guillemets en les doublant
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  };
  
  // Générer la ligne d'en-tête
  const headerLine = headers.map(escapeCSV).join(',');
  
  // Générer les lignes de données
  const dataLines = rows.map(row => row.map(escapeCSV).join(','));
  
  // Combiner les lignes avec des sauts de ligne
  return [headerLine, ...dataLines].join('\n');
}

/**
 * Télécharge un fichier
 * @param {Blob} blob - Objet Blob contenant les données
 * @param {string} filename - Nom du fichier
 */
function downloadFile(blob, filename) {
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Ajouter le lien au document
  document.body.appendChild(link);
  
  // Cliquer sur le lien
  link.click();
  
  // Supprimer le lien
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
