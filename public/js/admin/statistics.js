/**
 * Module de statistiques pour l'administration
 */

/**
 * Initialise le module de statistiques
 */
function initStatistics() {
  // Charger les statistiques initiales
  loadStatistics('7days');
  
  // Gestionnaire pour le changement de période
  const periodSelect = document.getElementById('stats-period');
  if (periodSelect) {
    periodSelect.addEventListener('change', () => {
      loadStatistics(periodSelect.value);
    });
  }
  
  // Gestionnaire pour le bouton d'actualisation
  const refreshButton = document.getElementById('refresh-stats');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      const period = document.getElementById('stats-period').value;
      loadStatistics(period);
      showToast('Statistiques actualisées');
    });
  }
}

/**
 * Charge les statistiques pour une période donnée
 * @param {string} period - Période (7days, 30days, 90days, all)
 */
function loadStatistics(period) {
  // Dans une application réelle, ces données viendraient d'une API
  // Pour cette démo, nous générons des données fictives
  
  // Récupérer les données des joueurs et des parties
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  const games = JSON.parse(localStorage.getItem('qr_game_games') || '[]');
  
  // Si aucune donnée n'existe, créer des données de démonstration
  if (players.length === 0 || games.length === 0) {
    createDemoDataIfNeeded();
  }
  
  // Filtrer les données selon la période
  const filteredGames = filterGamesByPeriod(games, period);
  
  // Initialiser les graphiques
  initPlayerChart(filteredGames, period);
  initTimePerChallengeChart();
  initCompletionChart(filteredGames);
  initDevicesChart();
  
  // Charger le top des joueurs
  loadTopPlayers(filteredGames);
}

/**
 * Filtre les parties selon la période
 * @param {Array} games - Liste des parties
 * @param {string} period - Période (7days, 30days, 90days, all)
 * @returns {Array} Parties filtrées
 */
function filterGamesByPeriod(games, period) {
  if (period === 'all') {
    return games;
  }
  
  const now = new Date();
  let daysAgo;
  
  switch (period) {
    case '7days':
      daysAgo = 7;
      break;
    case '30days':
      daysAgo = 30;
      break;
    case '90days':
      daysAgo = 90;
      break;
    default:
      daysAgo = 7;
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - daysAgo);
  
  return games.filter(game => {
    const startTime = new Date(game.startTime);
    return startTime >= cutoffDate;
  });
}

/**
 * Initialise le graphique des joueurs par jour
 * @param {Array} games - Liste des parties
 * @param {string} period - Période (7days, 30days, 90days, all)
 */
function initPlayerChart(games, period) {
  // Vérifier si Chart.js est disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js n\'est pas chargé');
    return;
  }
  
  // Récupérer le contexte du canvas
  const ctx = document.getElementById('players-chart').getContext('2d');
  
  // Déterminer le nombre de jours à afficher
  let daysToShow;
  switch (period) {
    case '7days':
      daysToShow = 7;
      break;
    case '30days':
      daysToShow = 30;
      break;
    case '90days':
      daysToShow = 90;
      break;
    case 'all':
      // Pour "all", nous montrons les 30 derniers jours
      daysToShow = 30;
      break;
    default:
      daysToShow = 7;
  }
  
  // Générer les dates
  const dates = [];
  const playersPerDay = [];
  
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dateString = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    dates.push(dateString);
    
    // Compter les joueurs pour cette date
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = games.filter(game => {
      const gameDate = new Date(game.startTime);
      return gameDate >= date && gameDate < nextDate;
    }).length;
    
    playersPerDay.push(count);
  }
  
  // Créer ou mettre à jour le graphique
  if (window.playersChart) {
    window.playersChart.data.labels = dates;
    window.playersChart.data.datasets[0].data = playersPerDay;
    window.playersChart.update();
  } else {
    window.playersChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Joueurs par jour',
          data: playersPerDay,
          borderColor: '#4285f4',
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                return `${context.raw} joueur${context.raw !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
}

/**
 * Initialise le graphique du temps moyen par défi
 */
function initTimePerChallengeChart() {
  // Vérifier si Chart.js est disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js n\'est pas chargé');
    return;
  }
  
  // Récupérer le contexte du canvas
  const ctx = document.getElementById('time-per-challenge-chart').getContext('2d');
  
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Préparer les données
  const labels = questions.map(q => q.title);
  
  // Générer des temps moyens fictifs (en minutes)
  const timeData = questions.map(() => Math.floor(Math.random() * 10) + 2);
  
  // Créer ou mettre à jour le graphique
  if (window.timePerChallengeChart) {
    window.timePerChallengeChart.data.labels = labels;
    window.timePerChallengeChart.data.datasets[0].data = timeData;
    window.timePerChallengeChart.update();
  } else {
    window.timePerChallengeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temps moyen (minutes)',
          data: timeData,
          backgroundColor: '#ea4335',
          borderColor: '#ea4335',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.raw} minute${context.raw !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          }
        }
      }
    });
  }
}

/**
 * Initialise le graphique de taux de complétion
 * @param {Array} games - Liste des parties
 */
function initCompletionChart(games) {
  // Vérifier si Chart.js est disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js n\'est pas chargé');
    return;
  }
  
  // Récupérer le contexte du canvas
  const ctx = document.getElementById('completion-chart').getContext('2d');
  
  // Calculer les taux de complétion
  const totalGames = games.length;
  const completedGames = games.filter(game => game.completed).length;
  const incompletedGames = totalGames - completedGames;
  
  // Créer ou mettre à jour le graphique
  if (window.completionChart) {
    window.completionChart.data.datasets[0].data = [completedGames, incompletedGames];
    window.completionChart.update();
  } else {
    window.completionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Complétées', 'Non complétées'],
        datasets: [{
          data: [completedGames, incompletedGames],
          backgroundColor: ['#34a853', '#fbbc05'],
          borderColor: ['#34a853', '#fbbc05'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Initialise le graphique de répartition des appareils
 */
function initDevicesChart() {
  // Vérifier si Chart.js est disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js n\'est pas chargé');
    return;
  }
  
  // Récupérer le contexte du canvas
  const ctx = document.getElementById('devices-chart').getContext('2d');
  
  // Données fictives pour la répartition des appareils
  const deviceData = [65, 25, 10]; // Mobile, Desktop, Tablet
  
  // Créer ou mettre à jour le graphique
  if (window.devicesChart) {
    window.devicesChart.data.datasets[0].data = deviceData;
    window.devicesChart.update();
  } else {
    window.devicesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Mobile', 'Ordinateur', 'Tablette'],
        datasets: [{
          data: deviceData,
          backgroundColor: ['#4285f4', '#34a853', '#fbbc05'],
          borderColor: ['#4285f4', '#34a853', '#fbbc05'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = Math.round((value / total) * 100);
                return `${percentage}%`;
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Charge la liste des meilleurs joueurs
 * @param {Array} games - Liste des parties
 */
function loadTopPlayers(games) {
  const topPlayersList = document.getElementById('top-players-list');
  
  if (!topPlayersList) return;
  
  // Vider la liste
  topPlayersList.innerHTML = '';
  
  // Récupérer les joueurs
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  
  // Calculer les statistiques par joueur
  const playerStats = {};
  
  games.forEach(game => {
    if (!playerStats[game.playerId]) {
      playerStats[game.playerId] = {
        name: game.playerName,
        completedGames: 0,
        totalGames: 0,
        totalTime: 0,
        lastActivity: null
      };
    }
    
    playerStats[game.playerId].totalGames++;
    
    if (game.completed) {
      playerStats[game.playerId].completedGames++;
      
      if (game.startTime && game.endTime) {
        const startTime = new Date(game.startTime);
        const endTime = new Date(game.endTime);
        playerStats[game.playerId].totalTime += endTime - startTime;
      }
    }
    
    const gameTime = new Date(game.startTime);
    if (!playerStats[game.playerId].lastActivity || gameTime > new Date(playerStats[game.playerId].lastActivity)) {
      playerStats[game.playerId].lastActivity = game.startTime;
    }
  });
  
  // Convertir en tableau et trier par nombre de parties complétées
  const sortedPlayers = Object.values(playerStats)
    .sort((a, b) => b.completedGames - a.completedGames)
    .slice(0, 10); // Limiter aux 10 meilleurs
  
  // Remplir la liste
  sortedPlayers.forEach(player => {
    const row = document.createElement('tr');
    
    // Calculer le temps moyen
    let avgTime = '00:00';
    if (player.completedGames > 0) {
      const avgTimeMs = player.totalTime / player.completedGames;
      const avgMinutes = Math.floor(avgTimeMs / 60000);
      const avgSeconds = Math.floor((avgTimeMs % 60000) / 1000);
      avgTime = `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`;
    }
    
    // Formater la date de dernière activité
    const lastActivity = player.lastActivity ? new Date(player.lastActivity).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-';
    
    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.completedGames}/${player.totalGames}</td>
      <td>${avgTime}</td>
      <td>${lastActivity}</td>
    `;
    
    topPlayersList.appendChild(row);
  });
}

/**
 * Crée des données de démonstration si nécessaire
 */
function createDemoDataIfNeeded() {
  // Vérifier si des données existent déjà
  const players = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  const games = JSON.parse(localStorage.getItem('qr_game_games') || '[]');
  
  if (players.length > 0 && games.length > 0) {
    return; // Des données existent déjà
  }
  
  // Créer des joueurs fictifs
  const demoPlayers = [
    { id: 'p1', name: 'Alice', email: 'alice@example.com', registeredAt: '2025-04-20T10:00:00Z' },
    { id: 'p2', name: 'Bob', email: 'bob@example.com', registeredAt: '2025-04-21T11:30:00Z' },
    { id: 'p3', name: 'Charlie', email: 'charlie@example.com', registeredAt: '2025-04-22T09:15:00Z' },
    { id: 'p4', name: 'David', email: 'david@example.com', registeredAt: '2025-04-23T14:45:00Z' },
    { id: 'p5', name: 'Emma', email: 'emma@example.com', registeredAt: '2025-04-24T08:30:00Z' }
  ];
  
  // Créer des parties fictives
  const demoGames = [];
  
  for (let i = 0; i < 50; i++) {
    const player = demoPlayers[Math.floor(Math.random() * demoPlayers.length)];
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - Math.floor(Math.random() * 30)); // Jusqu'à 30 jours dans le passé
    startTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const completed = Math.random() > 0.3; // 70% de chance d'être complété
    
    const game = {
      id: `g${i + 1}`,
      playerId: player.id,
      playerName: player.name,
      startTime: startTime.toISOString(),
      completed
    };
    
    if (completed) {
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + Math.floor(Math.random() * 60) + 10);
      game.endTime = endTime.toISOString();
      game.score = Math.floor(Math.random() * 500) + 100;
    }
    
    demoGames.push(game);
  }
  
  // Sauvegarder les données
  localStorage.setItem('qr_game_players', JSON.stringify(demoPlayers));
  localStorage.setItem('qr_game_games', JSON.stringify(demoGames));
}
