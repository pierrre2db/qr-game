/**
 * FICHIER DE CORRECTION POUR LE QR GAME
 * Ce fichier contient les fonctions corrigées pour résoudre les problèmes d'affichage
 * des questions et de la barre de progression.
 */

// Fonction corrigée pour afficher une question
function displayQuestion(question) {
  try {
    console.log('Affichage de la question', question);
    
    // S'assurer que l'écran de jeu est visible
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
      gameScreen.style.display = 'block';
    }
    
    // S'assurer que currentQuestion existe
    const currentQuestion = document.getElementById('current-question');
    if (!currentQuestion) {
      console.error('ERREUR: Élément currentQuestion introuvable');
      showToast('Erreur lors de l\'affichage de la question', 'error');
      return;
    }
    
    // Vérifier que la question est valide
    if (!question || !question.id || !question.title) {
      throw new Error('Question invalide');
    }
    
    // S'assurer que la question a des options
    if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
      question.options = ['Option A', 'Option B', 'Option C', 'Option D'];
      console.log(`Options par défaut créées pour la question ${question.id}`);
    }
    
    // S'assurer que la question a une description
    if (!question.description) {
      question.description = question.title;
    }
    
    // Vérifier si la question a déjà été répondue
    const answeredQuestions = new Set(JSON.parse(localStorage.getItem('answeredQuestions') || '[]'));
    const playerAnswers = JSON.parse(localStorage.getItem('playerAnswers') || '{}');
    const alreadyAnswered = answeredQuestions.has(question.id);
    const previousAnswer = playerAnswers[question.id];
    
    if (alreadyAnswered) {
      console.log(`Question ${question.id} déjà répondue`, { previousAnswer });
    }
    
    // Construire le contenu HTML de la question
    let questionHTML = `
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Question: ${question.title}</h5>
      </div>
      <div class="card-body">
        <p class="lead">${question.description}</p>
        
        <div class="options-container mt-4">
    `;
    
    // Ajouter les options en fonction du type de question
    const questionType = question.type || 'standard';
    
    if (questionType === 'standard') {
      // Question à choix multiples
      questionHTML += question.options.map((option, index) => {
        const isSelected = previousAnswer === option;
        return `
          <div class="form-check mb-3 p-2 ${isSelected ? 'bg-light' : ''}" style="border-radius: 5px;">
            <input class="form-check-input" type="radio" name="question-option" 
              id="option-${index}" value="${option}" ${alreadyAnswered ? 'disabled' : ''} ${isSelected ? 'checked' : ''}>
            <label class="form-check-label w-100" for="option-${index}">
              ${option}
            </label>
          </div>
        `;
      }).join('');
    } else if (questionType === 'text') {
      // Question à réponse libre
      questionHTML += `
        <div class="mb-3">
          <textarea class="form-control" id="text-answer" rows="3" 
            placeholder="Votre réponse..." ${alreadyAnswered ? 'disabled' : ''}>${previousAnswer || ''}</textarea>
        </div>
      `;
    } else if (questionType === 'number') {
      // Question numérique
      questionHTML += `
        <div class="mb-3">
          <input type="number" class="form-control" id="number-answer" 
            placeholder="Votre réponse numérique..." value="${previousAnswer || ''}" ${alreadyAnswered ? 'disabled' : ''}>
        </div>
      `;
    }
    
    // Ajouter les boutons d'action
    questionHTML += `
        </div>
        
        <div class="d-grid gap-2 mt-4">
    `;
    
    if (!alreadyAnswered) {
      // Bouton pour soumettre la réponse
      questionHTML += `
          <button type="button" id="submit-answer" class="btn btn-primary btn-lg">
            <i class="fas fa-check me-2"></i> Valider ma réponse
          </button>
      `;
    } else {
      // Afficher la réponse et le bouton pour continuer
      questionHTML += `
          <div class="alert alert-info mb-3">
            <i class="fas fa-info-circle me-2"></i>
            Vous avez répondu: <strong>${previousAnswer}</strong>
          </div>
          <button type="button" id="continue-btn" class="btn btn-primary btn-lg">
            <i class="fas fa-arrow-right me-2"></i> Continuer
          </button>
      `;
    }
    
    questionHTML += `
        </div>
      </div>
    `;
    
    // Afficher la question
    currentQuestion.innerHTML = questionHTML;
    
    // Mettre à jour la barre de progression
    updateProgressBar();
    
    // Ajouter les écouteurs d'événements
    if (!alreadyAnswered) {
      const submitButton = document.getElementById('submit-answer');
      if (submitButton) {
        submitButton.addEventListener('click', () => {
          try {
            let answer = '';
            
            if (questionType === 'standard') {
              const selectedOption = document.querySelector('input[name="question-option"]:checked');
              if (selectedOption) {
                answer = selectedOption.value;
              } else {
                showToast('Veuillez sélectionner une option', 'warning');
                return;
              }
            } else if (questionType === 'text') {
              const textAnswer = document.getElementById('text-answer');
              if (textAnswer && textAnswer.value.trim()) {
                answer = textAnswer.value.trim();
              } else {
                showToast('Veuillez entrer une réponse', 'warning');
                return;
              }
            } else if (questionType === 'number') {
              const numberAnswer = document.getElementById('number-answer');
              if (numberAnswer && numberAnswer.value.trim()) {
                answer = numberAnswer.value.trim();
              } else {
                showToast('Veuillez entrer une réponse numérique', 'warning');
                return;
              }
            }
            
            console.log('Enregistrement de la réponse', { questionId: question.id, answer });
            saveAnswer(question.id, answer);
          } catch (error) {
            console.error('ERREUR lors de l\'enregistrement de la réponse', error);
            showToast('Erreur lors de l\'enregistrement de la réponse', 'error');
          }
        });
      }
      
      // Améliorer l'expérience mobile en permettant de cliquer sur toute la zone de l'option
      const options = document.querySelectorAll('.form-check');
      options.forEach(option => {
        option.addEventListener('click', function() {
          const radio = this.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;
          }
        });
      });
    } else {
      // Ajouter un écouteur d'événement pour le bouton Continuer
      const continueButton = document.getElementById('continue-btn');
      if (continueButton) {
        continueButton.addEventListener('click', () => {
          console.log('Clic sur le bouton continuer');
          showNextQuestionPrompt();
        });
      }
    }
  } catch (error) {
    console.error('ERREUR CRITIQUE lors de l\'affichage de la question', error);
    
    // Afficher un message d'erreur à l'utilisateur
    if (currentQuestion) {
      currentQuestion.innerHTML = `
        <div class="card-body">
          <h3>Erreur</h3>
          <p>Une erreur est survenue lors de l'affichage de la question.</p>
          <div class="alert alert-danger mt-3">
            <i class="fas fa-exclamation-triangle me-2"></i> Détail: ${error.message}
          </div>
          <button class="btn btn-primary mt-3" id="error-continue-btn">
            <i class="fas fa-arrow-right me-2"></i> Continuer
          </button>
        </div>
      `;
      
      const errorContinueBtn = document.getElementById('error-continue-btn');
      if (errorContinueBtn) {
        errorContinueBtn.addEventListener('click', showNextQuestionPrompt);
      }
    }
  }
}

// Fonction corrigée pour mettre à jour la barre de progression
function updateProgressBar() {
  try {
    // Récupérer les références DOM
    const progressBar = document.querySelector('.progress-bar');
    const progressInfoStart = document.getElementById('progress-info-start');
    const progressInfoEnd = document.getElementById('progress-info-end');
    
    if (!progressBar || !progressInfoStart || !progressInfoEnd) {
      console.error('ERREUR: Éléments de progression introuvables');
      return;
    }
    
    // Récupérer le nombre de questions répondues et le nombre total de questions
    const answeredQuestions = new Set(JSON.parse(localStorage.getItem('answeredQuestions') || '[]'));
    const totalQuestions = parseInt(localStorage.getItem('totalQuestions') || '0', 10);
    
    // Calculer le pourcentage de progression
    const answeredCount = answeredQuestions.size;
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    
    // Mettre à jour la barre de progression
    progressBar.style.width = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);
    progressBar.textContent = `${progressPercent}%`;
    
    // Mettre à jour les informations de progression
    progressInfoStart.textContent = answeredCount;
    progressInfoEnd.textContent = totalQuestions;
    
    console.log('Barre de progression mise à jour', { 
      answeredCount, 
      totalQuestions, 
      progressPercent 
    });
  } catch (error) {
    console.error('ERREUR lors de la mise à jour de la barre de progression', error);
  }
}

// Fonction pour afficher le message pour scanner le prochain QR code
function showNextQuestionPrompt() {
  try {
    console.log('Affichage du message pour scanner le prochain QR code');
    
    // S'assurer que les références DOM sont initialisées
    const currentQuestion = document.getElementById('current-question');
    if (!currentQuestion) {
      console.error('ERREUR: Élément currentQuestion introuvable');
      return;
    }
    
    // Mettre à jour la barre de progression
    updateProgressBar();
    
    // Afficher le message pour scanner le prochain QR code
    currentQuestion.innerHTML = `
      <div class="card-body text-center">
        <h3>Scannez le prochain QR code</h3>
        <p>Pour continuer le jeu, scannez un nouveau QR code avec votre appareil.</p>
        <div class="mt-3">
          <i class="fas fa-qrcode fa-4x text-primary mb-3"></i>
        </div>
      </div>
    `;
    
    console.log('Message pour scanner le prochain QR code affiché', currentQuestion);
  } catch (error) {
    console.error('ERREUR lors de l\'affichage du message pour scanner le prochain QR code', error);
  }
}

// Fonction pour enregistrer la réponse à une question
function saveAnswer(questionId, answer) {
  try {
    console.log('Enregistrement de la réponse', { questionId, answer });
    
    // Récupérer les réponses existantes
    let playerAnswers = JSON.parse(localStorage.getItem('playerAnswers') || '{}');
    let answeredQuestions = new Set(JSON.parse(localStorage.getItem('answeredQuestions') || '[]'));
    
    // Enregistrer la réponse
    playerAnswers[questionId] = answer;
    answeredQuestions.add(questionId);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('playerAnswers', JSON.stringify(playerAnswers));
    localStorage.setItem('answeredQuestions', JSON.stringify([...answeredQuestions]));
    
    console.log('Réponses sauvegardées dans localStorage', { playerAnswers, answeredQuestions });
    
    // Mettre à jour l'affichage de la question pour montrer qu'elle a été répondue
    const currentQuestion = document.getElementById('current-question');
    if (currentQuestion) {
      const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
      if (questionElement) {
        // Mettre à jour l'affichage de la question
        displayQuestion({
          id: questionId,
          title: questionElement.dataset.title || 'Question',
          description: questionElement.dataset.description || '',
          options: JSON.parse(questionElement.dataset.options || '[]'),
          type: questionElement.dataset.type || 'standard'
        });
      } else {
        // Afficher un message de succès
        currentQuestion.innerHTML = `
          <div class="card-body text-center">
            <div class="alert alert-success">
              <i class="fas fa-check-circle fa-2x mb-3"></i>
              <h4>Réponse enregistrée !</h4>
              <p>Votre réponse a été enregistrée avec succès.</p>
            </div>
            <button class="btn btn-primary btn-lg mt-3" id="next-question-btn">
              <i class="fas fa-arrow-right me-2"></i> Continuer
            </button>
          </div>
        `;
        
        // Ajouter un écouteur d'événement pour le bouton Continuer
        const nextQuestionBtn = document.getElementById('next-question-btn');
        if (nextQuestionBtn) {
          nextQuestionBtn.addEventListener('click', showNextQuestionPrompt);
        }
      }
    }
    
    // Mettre à jour la barre de progression
    updateProgressBar();
    
    // Envoyer la réponse au serveur (si nécessaire)
    // Cette partie peut être implémentée selon les besoins
    
    console.log('Réponse envoyée au serveur avec succès', { questionId, answer });
    return true;
  } catch (error) {
    console.error('ERREUR lors de l\'enregistrement de la réponse', error);
    showToast('Erreur lors de l\'enregistrement de la réponse', 'error');
    return false;
  }
}

// Fonction utilitaire pour afficher un toast de notification
function showToast(message, type = 'info') {
  try {
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Définir le style en fonction du type
    let bgClass = 'bg-primary';
    let icon = 'info-circle';
    
    switch (type) {
      case 'success':
        bgClass = 'bg-success';
        icon = 'check-circle';
        break;
      case 'warning':
        bgClass = 'bg-warning';
        icon = 'exclamation-triangle';
        break;
      case 'error':
        bgClass = 'bg-danger';
        icon = 'exclamation-circle';
        break;
    }
    
    // Construire le contenu du toast
    toast.innerHTML = `
      <div class="toast-header ${bgClass} text-white">
        <i class="fas fa-${icon} me-2"></i>
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    // Ajouter le toast au document
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      // Créer un conteneur pour les toasts s'il n'existe pas
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
      container.appendChild(toast);
    } else {
      toastContainer.appendChild(toast);
    }
    
    // Ajouter un écouteur d'événement pour le bouton de fermeture
    const closeButton = toast.querySelector('.btn-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        toast.remove();
      });
    }
    
    // Supprimer le toast après 5 secondes
    setTimeout(() => {
      toast.remove();
    }, 5000);
  } catch (error) {
    console.error('ERREUR lors de l\'affichage du toast', error);
  }
}
