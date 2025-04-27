/**
 * Module de tableau de bord pour l'administration
 */

/**
 * Initialise le tableau de bord
 */
function initDashboard() {
  // Charger les données du tableau de bord
  loadDashboardData();
  
  // Initialiser les graphiques
  initDashboardCharts();
  
  // Charger l'activité récente
  loadRecentActivity();
  
  // Actualiser les données toutes les 60 secondes
  setInterval(loadDashboardData, 60000);
}

/**
 * Charge les données du tableau de bord
 */
function loadDashboardData() {
  // Dans une application réelle, ces données viendraient d'une API
  // Pour cette démo, nous utilisons des données fictives
  
  // Récupérer les données des joueurs
  const playerData = JSON.parse(localStorage.getItem('qr_game_players') || '[]');
  
  // Récupérer les données des parties
  const gameData = JSON.parse(localStorage.getItem('qr_game_games') || '[]');
  
  // Calculer les statistiques
  const totalPlayers = playerData.length;
  const totalGames = gameData.length;
  const completedGames = gameData.filter(game => game.completed).length;
  const completionRate = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;
  
  // Calculer le temps moyen de complétion
  let avgCompletionTime = '00:00';
  if (completedGames > 0) {
    const completionTimes = gameData
      .filter(game => game.completed && game.startTime && game.endTime)
      .map(game => new Date(game.endTime) - new Date(game.startTime));
    
    if (completionTimes.length > 0) {
      const avgTimeMs = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
      const avgMinutes = Math.floor(avgTimeMs / 60000);
      const avgSeconds = Math.floor((avgTimeMs % 60000) / 1000);
      avgCompletionTime = `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`;
    }
  }
  
  // Mettre à jour les éléments du DOM
  document.getElementById('total-players').textContent = totalPlayers;
  document.getElementById('total-games').textContent = totalGames;
  document.getElementById('completion-rate').textContent = `${completionRate}%`;
  document.getElementById('avg-completion-time').textContent = avgCompletionTime;
  
  // Si aucune donnée n'existe encore, créer des données de démonstration
  if (totalPlayers === 0 && totalGames === 0) {
    createDemoData();
  }
}

/**
 * Initialise les graphiques du tableau de bord
 */
function initDashboardCharts() {
  // Vérifier si Chart.js est disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js n\'est pas chargé');
    return;
  }
  
  // Graphique d'activité
  const activityCtx = document.getElementById('activity-chart').getContext('2d');
  
  // Générer des données pour les 7 derniers jours
  const dates = [];
  const activityData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));
    
    // Générer une valeur aléatoire pour la démo
    activityData.push(Math.floor(Math.random() * 10) + 1);
  }
  
  new Chart(activityCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Parties jouées',
        data: activityData,
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
  
  // Graphique de progression par défi
  const challengeCtx = document.getElementById('challenge-chart').getContext('2d');
  
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem('qr_game_questions') || '[]');
  
  // Préparer les données
  const challengeLabels = questions.map(q => q.title);
  const challengeCompletions = questions.map(() => Math.floor(Math.random() * 20) + 5); // Données fictives
  
  new Chart(challengeCtx, {
    type: 'bar',
    data: {
      labels: challengeLabels,
      datasets: [{
        label: 'Complétions',
        data: challengeCompletions,
        backgroundColor: '#34a853',
        borderColor: '#34a853',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
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

/**
 * Charge l'activité récente
 */
function loadRecentActivity() {
  const activityList = document.getElementById('recent-activity-list');
  
  if (!activityList) return;
  
  // Dans une application réelle, ces données viendraient d'une API
  // Pour cette démo, nous générons des données fictives
  
  // Vider la liste
  activityList.innerHTML = '';
  
  // Générer des activités fictives
  const activities = [];
  const playerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];
  const actions = ['a commencé une partie', 'a complété un défi', 'a terminé une partie', 's\'est inscrit'];
  const challenges = ['start', 'challenge1', 'challenge2', 'challenge3', 'challenge4', 'finish'];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 30);
    
    const playerName = playerNames[Math.floor(Math.random() * playerNames.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    activities.push({
      date,
      playerName,
      action,
      challenge
    });
  }
  
  // Remplir la liste
  activities.forEach(activity => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${activity.date.toLocaleString('fr-FR')}</td>
      <td>${activity.playerName}</td>
      <td>${activity.action}</td>
      <td>${activity.challenge}</td>
    `;
    
    activityList.appendChild(row);
  });
}

/**
 * Crée des données de démonstration
 */
function createDemoData() {
  // Créer des joueurs fictifs
  const players = [
    { id: 'p1', name: 'Alice', email: 'alice@example.com', registeredAt: '2025-04-20T10:00:00Z' },
    { id: 'p2', name: 'Bob', email: 'bob@example.com', registeredAt: '2025-04-21T11:30:00Z' },
    { id: 'p3', name: 'Charlie', email: 'charlie@example.com', registeredAt: '2025-04-22T09:15:00Z' },
    { id: 'p4', name: 'David', email: 'david@example.com', registeredAt: '2025-04-23T14:45:00Z' },
    { id: 'p5', name: 'Emma', email: 'emma@example.com', registeredAt: '2025-04-24T08:30:00Z' }
  ];
  
  // Créer des parties fictives
  const games = [];
  
  for (let i = 0; i < 20; i++) {
    const player = players[Math.floor(Math.random() * players.length)];
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 48));
    
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
    
    games.push(game);
  }
  
  // Sauvegarder les données
  localStorage.setItem('qr_game_players', JSON.stringify(players));
  localStorage.setItem('qr_game_games', JSON.stringify(games));
  
  // Recharger les données
  loadDashboardData();
}
