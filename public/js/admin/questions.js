/**
 * Module de gestion des questions pour l'administration
 */

// Clé de stockage des questions
const QUESTIONS_STORAGE_KEY = 'qr_game_questions';

// Question en cours d'édition
let currentQuestion = null;

/**
 * Initialise le module de gestion des questions
 */
function initQuestions() {
  // Charger les questions
  loadQuestions();
  
  // Gestionnaire pour le formulaire d'ajout/édition de question
  const questionForm = document.getElementById('question-form');
  if (questionForm) {
    questionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveQuestion();
    });
  }
  
  // Gestionnaire pour le bouton d'ajout de question
  const addQuestionButton = document.getElementById('add-question-button');
  if (addQuestionButton) {
    addQuestionButton.addEventListener('click', () => {
      showQuestionForm();
    });
  }
  
  // Gestionnaire pour le bouton d'annulation
  const cancelButton = document.getElementById('cancel-question-button');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      hideQuestionForm();
    });
  }
  
  // Gestionnaire pour l'importation de questions
  const importQuestionsInput = document.getElementById('import-questions');
  if (importQuestionsInput) {
    importQuestionsInput.addEventListener('change', (e) => {
      importQuestions(e);
    });
  }
  
  // Gestionnaire pour le bouton d'exportation JSON
  const exportJsonButton = document.getElementById('export-questions-json');
  if (exportJsonButton) {
    exportJsonButton.addEventListener('click', () => {
      exportQuestionsJSON();
    });
  }
  
  // Gestionnaire pour le bouton d'exportation CSV
  const exportCsvButton = document.getElementById('export-questions-csv');
  if (exportCsvButton) {
    exportCsvButton.addEventListener('click', () => {
      exportQuestionsCSV();
    });
  }
  
  // Gestionnaire pour la génération de QR codes
  const generateQRButton = document.getElementById('generate-qr-codes');
  if (generateQRButton) {
    generateQRButton.addEventListener('click', () => {
      generateQRCodes();
    });
  }
}

/**
 * Charge les questions depuis le stockage local
 */
function loadQuestions() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Si aucune question n'existe, créer des questions de démonstration
  if (questions.length === 0) {
    createDemoQuestions();
    return;
  }
  
  // Afficher les questions
  displayQuestions(questions);
}

/**
 * Affiche les questions dans le tableau
 * @param {Array} questions - Liste des questions
 */
function displayQuestions(questions) {
  const questionsList = document.getElementById('questions-list');
  
  if (!questionsList) return;
  
  // Vider la liste
  questionsList.innerHTML = '';
  
  // Remplir la liste
  if (questions.length === 0) {
    questionsList.innerHTML = '<tr><td colspan="6" class="text-center">Aucune question</td></tr>';
    return;
  }
  
  questions.forEach((question, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${question.id}</td>
      <td>${question.title}</td>
      <td>${question.description.substring(0, 50)}${question.description.length > 50 ? '...' : ''}</td>
      <td>${question.type || 'standard'}</td>
      <td>${question.points || 10}</td>
      <td>
        <button class="btn btn-sm btn-primary me-1" onclick="editQuestion('${question.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger me-1" onclick="deleteQuestion('${question.id}')">
          <i class="fas fa-trash"></i>
        </button>
        <button class="btn btn-sm btn-info" onclick="generateQuestionQR('${question.id}')">
          <i class="fas fa-qrcode"></i>
        </button>
      </td>
    `;
    
    questionsList.appendChild(row);
  });
}

/**
 * Crée des questions de démonstration
 */
function createDemoQuestions() {
  const demoQuestions = [
    {
      id: 'q1',
      title: 'Introduction',
      description: 'Bienvenue dans le jeu QR ! Scannez le code suivant pour commencer.',
      type: 'start',
      points: 0
    },
    {
      id: 'q2',
      title: 'Histoire du lieu',
      description: 'Quelle est l\'année de construction de ce bâtiment ?',
      type: 'question',
      points: 10,
      options: ['1850', '1902', '1945', '1978'],
      correctAnswer: '1902'
    },
    {
      id: 'q3',
      title: 'Énigme architecturale',
      description: 'Combien de colonnes soutiennent la façade principale ?',
      type: 'question',
      points: 15
    },
    {
      id: 'q4',
      title: 'Chasse au trésor',
      description: 'Trouvez l\'objet caché derrière la statue et scannez son QR code.',
      type: 'challenge',
      points: 20
    },
    {
      id: 'q5',
      title: 'Félicitations',
      description: 'Vous avez terminé le parcours ! Récupérez votre récompense à l\'accueil.',
      type: 'end',
      points: 0
    }
  ];
  
  // Sauvegarder les questions
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(demoQuestions));
  
  // Afficher les questions
  displayQuestions(demoQuestions);
}

/**
 * Affiche le formulaire d'ajout/édition de question
 * @param {Object} question - Question à éditer (null pour une nouvelle question)
 */
function showQuestionForm(question = null) {
  // Mettre à jour la question en cours d'édition
  currentQuestion = question;
  
  // Mettre à jour le titre du formulaire
  const formTitle = document.getElementById('question-form-title');
  if (formTitle) {
    formTitle.textContent = question ? 'Modifier la question' : 'Ajouter une question';
  }
  
  // Remplir le formulaire
  if (question) {
    document.getElementById('question-id').value = question.id;
    document.getElementById('question-title').value = question.title;
    document.getElementById('question-description').value = question.description;
    document.getElementById('question-type').value = question.type || 'standard';
    document.getElementById('question-points').value = question.points || 10;
    
    // Remplir les options si elles existent
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      if (question.options && question.options.length > 0) {
        question.options.forEach((option, index) => {
          const optionRow = document.createElement('div');
          optionRow.className = 'option-row mb-2';
          
          optionRow.innerHTML = `
            <div class="input-group">
              <input type="text" class="form-control option-input" value="${option}" placeholder="Option ${index + 1}">
              <button type="button" class="btn btn-outline-danger remove-option">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `;
          
          optionsContainer.appendChild(optionRow);
          
          // Gestionnaire pour le bouton de suppression d'option
          const removeButton = optionRow.querySelector('.remove-option');
          if (removeButton) {
            removeButton.addEventListener('click', () => {
              optionRow.remove();
            });
          }
        });
      }
    }
    
    // Remplir la réponse correcte si elle existe
    if (question.correctAnswer) {
      document.getElementById('correct-answer').value = question.correctAnswer;
    }
  } else {
    // Réinitialiser le formulaire
    document.getElementById('question-form').reset();
    document.getElementById('question-id').value = generateQuestionId();
    
    // Vider les options
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
    }
  }
  
  // Afficher le formulaire
  const questionFormContainer = document.getElementById('question-form-container');
  if (questionFormContainer) {
    questionFormContainer.style.display = 'block';
  }
  
  // Masquer la liste des questions
  const questionsListContainer = document.getElementById('questions-list-container');
  if (questionsListContainer) {
    questionsListContainer.style.display = 'none';
  }
}

/**
 * Masque le formulaire d'ajout/édition de question
 */
function hideQuestionForm() {
  // Masquer le formulaire
  const questionFormContainer = document.getElementById('question-form-container');
  if (questionFormContainer) {
    questionFormContainer.style.display = 'none';
  }
  
  // Afficher la liste des questions
  const questionsListContainer = document.getElementById('questions-list-container');
  if (questionsListContainer) {
    questionsListContainer.style.display = 'block';
  }
  
  // Réinitialiser la question en cours d'édition
  currentQuestion = null;
}

/**
 * Sauvegarde une question
 */
function saveQuestion() {
  // Récupérer les valeurs du formulaire
  const id = document.getElementById('question-id').value;
  const title = document.getElementById('question-title').value;
  const description = document.getElementById('question-description').value;
  const type = document.getElementById('question-type').value;
  const points = parseInt(document.getElementById('question-points').value, 10) || 10;
  
  // Valider les champs obligatoires
  if (!title || !description) {
    showToast('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  // Récupérer les options si elles existent
  const optionInputs = document.querySelectorAll('.option-input');
  const options = Array.from(optionInputs).map(input => input.value).filter(value => value.trim() !== '');
  
  // Récupérer la réponse correcte si elle existe
  const correctAnswer = document.getElementById('correct-answer').value;
  
  // Créer l'objet question
  const question = {
    id,
    title,
    description,
    type,
    points
  };
  
  // Ajouter les options et la réponse correcte si elles existent
  if (options.length > 0) {
    question.options = options;
  }
  
  if (correctAnswer) {
    question.correctAnswer = correctAnswer;
  }
  
  // Récupérer les questions existantes
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Vérifier si la question existe déjà
  const existingIndex = questions.findIndex(q => q.id === id);
  
  if (existingIndex !== -1) {
    // Mettre à jour la question existante
    questions[existingIndex] = question;
    showToast('Question mise à jour');
  } else {
    // Ajouter la nouvelle question
    questions.push(question);
    showToast('Question ajoutée');
  }
  
  // Sauvegarder les questions
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  
  // Afficher les questions
  displayQuestions(questions);
  
  // Masquer le formulaire
  hideQuestionForm();
}

/**
 * Édite une question
 * @param {string} id - ID de la question à éditer
 */
function editQuestion(id) {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Trouver la question
  const question = questions.find(q => q.id === id);
  
  if (question) {
    // Afficher le formulaire d'édition
    showQuestionForm(question);
  }
}

/**
 * Supprime une question
 * @param {string} id - ID de la question à supprimer
 */
function deleteQuestion(id) {
  // Demander confirmation
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    return;
  }
  
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Filtrer la question à supprimer
  const filteredQuestions = questions.filter(q => q.id !== id);
  
  // Sauvegarder les questions
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(filteredQuestions));
  
  // Afficher les questions
  displayQuestions(filteredQuestions);
  
  // Afficher un message
  showToast('Question supprimée');
}

/**
 * Génère un ID unique pour une question
 * @returns {string} ID unique
 */
function generateQuestionId() {
  return 'q' + Date.now().toString(36);
}

/**
 * Ajoute une option au formulaire
 */
function addOption() {
  const optionsContainer = document.getElementById('options-container');
  
  if (!optionsContainer) return;
  
  // Créer une nouvelle ligne d'option
  const optionRow = document.createElement('div');
  optionRow.className = 'option-row mb-2';
  
  // Compter les options existantes
  const optionCount = optionsContainer.querySelectorAll('.option-row').length + 1;
  
  optionRow.innerHTML = `
    <div class="input-group">
      <input type="text" class="form-control option-input" placeholder="Option ${optionCount}">
      <button type="button" class="btn btn-outline-danger remove-option">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Ajouter la ligne au conteneur
  optionsContainer.appendChild(optionRow);
  
  // Gestionnaire pour le bouton de suppression d'option
  const removeButton = optionRow.querySelector('.remove-option');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      optionRow.remove();
    });
  }
}

/**
 * Importe des questions depuis un fichier
 * @param {Event} event - Événement de changement de fichier
 */
function importQuestions(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      // Déterminer le type de fichier
      const isCSV = file.name.toLowerCase().endsWith('.csv');
      
      let questions;
      
      if (isCSV) {
        // Importer depuis CSV
        questions = importQuestionsFromCSV(e.target.result);
      } else {
        // Importer depuis JSON
        questions = JSON.parse(e.target.result);
      }
      
      // Valider les questions
      if (!Array.isArray(questions)) {
        throw new Error('Format de fichier invalide');
      }
      
      // Sauvegarder les questions
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
      
      // Afficher les questions
      displayQuestions(questions);
      
      // Afficher un message
      showToast(`${questions.length} questions importées`);
    } catch (error) {
      console.error('Erreur lors de l\'importation des questions:', error);
      showToast('Erreur lors de l\'importation des questions', 'error');
    }
  };
  
  if (file.name.toLowerCase().endsWith('.csv')) {
    reader.readAsText(file);
  } else {
    reader.readAsText(file);
  }
  
  // Réinitialiser l'input file
  event.target.value = '';
}

/**
 * Importe des questions depuis un fichier CSV
 * @param {string} csvContent - Contenu CSV
 * @returns {Array} Questions importées
 */
function importQuestionsFromCSV(csvContent) {
  // Séparer les lignes
  const lines = csvContent.split('\n');
  
  // Récupérer les en-têtes
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Récupérer les indices des colonnes
  const idIndex = headers.indexOf('ID');
  const titleIndex = headers.indexOf('Titre');
  const descriptionIndex = headers.indexOf('Description');
  const typeIndex = headers.indexOf('Type');
  const pointsIndex = headers.indexOf('Points');
  const optionsIndex = headers.indexOf('Options');
  const correctAnswerIndex = headers.indexOf('Réponse correcte');
  
  // Vérifier les colonnes obligatoires
  if (titleIndex === -1 || descriptionIndex === -1) {
    throw new Error('Colonnes obligatoires manquantes');
  }
  
  // Importer les questions
  const questions = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Ignorer les lignes vides
    if (!lines[i].trim()) {
      continue;
    }
    
    // Séparer les valeurs
    const values = lines[i].split(',').map(value => value.trim());
    
    // Créer l'objet question
    const question = {
      id: idIndex !== -1 && values[idIndex] ? values[idIndex] : generateQuestionId(),
      title: values[titleIndex],
      description: values[descriptionIndex],
      type: typeIndex !== -1 && values[typeIndex] ? values[typeIndex] : 'standard',
      points: pointsIndex !== -1 && values[pointsIndex] ? parseInt(values[pointsIndex], 10) : 10
    };
    
    // Ajouter les options si elles existent
    if (optionsIndex !== -1 && values[optionsIndex]) {
      question.options = values[optionsIndex].split(';').map(option => option.trim());
    }
    
    // Ajouter la réponse correcte si elle existe
    if (correctAnswerIndex !== -1 && values[correctAnswerIndex]) {
      question.correctAnswer = values[correctAnswerIndex];
    }
    
    questions.push(question);
  }
  
  return questions;
}

/**
 * Exporte les questions au format JSON
 */
function exportQuestionsJSON() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Créer un objet Blob avec les données
  const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-questions.json');
  
  // Afficher un message
  showToast('Questions exportées au format JSON');
}

/**
 * Exporte les questions au format CSV
 */
function exportQuestionsCSV() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Définir les en-têtes CSV
  const headers = ['ID', 'Titre', 'Description', 'Type', 'Points', 'Options', 'Réponse correcte'];
  
  // Convertir les questions en lignes CSV
  const rows = questions.map(question => [
    question.id,
    question.title,
    question.description,
    question.type || 'standard',
    question.points || 10,
    question.options ? question.options.join(';') : '',
    question.correctAnswer || ''
  ]);
  
  // Générer le contenu CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Créer un objet Blob avec les données
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Télécharger le fichier
  downloadFile(blob, 'qr-game-questions.csv');
  
  // Afficher un message
  showToast('Questions exportées au format CSV');
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

/**
 * Génère des QR codes pour toutes les questions
 */
function generateQRCodes() {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Vérifier s'il y a des questions
  if (questions.length === 0) {
    showToast('Aucune question à exporter', 'warning');
    return;
  }
  
  // Récupérer les paramètres
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  const baseUrl = settings.general && settings.general.baseUrl ? settings.general.baseUrl : window.location.origin;
  
  // Créer un dossier ZIP
  const zip = new JSZip();
  
  // Ajouter un fichier README
  zip.file('README.txt', `QR Codes générés le ${new Date().toLocaleString('fr-FR')}\n\nPour utiliser ces QR codes, imprimez-les et placez-les aux endroits appropriés.\nLorsqu'un joueur scanne un QR code, il sera dirigé vers la question correspondante.\n\nURL de base: ${baseUrl}\n`);
  
  // Créer un dossier pour les QR codes
  const qrFolder = zip.folder('qr-codes');
  
  // Générer un QR code pour chaque question
  const qrPromises = questions.map(question => {
    return new Promise((resolve, reject) => {
      // Construire l'URL
      const url = `${baseUrl}?question_id=${question.id}`;
      
      // Générer le QR code
      const qrCode = new QRCode(document.createElement('div'), {
        text: url,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
      
      // Récupérer l'image
      const canvas = qrCode._oDrawing._elCanvas;
      
      // Convertir le canvas en image
      const imgData = canvas.toDataURL('image/png').split(',')[1];
      
      // Ajouter l'image au dossier
      qrFolder.file(`${question.id} - ${question.title}.png`, imgData, { base64: true });
      
      resolve();
    });
  });
  
  // Attendre que tous les QR codes soient générés
  Promise.all(qrPromises)
    .then(() => {
      // Générer le fichier ZIP
      zip.generateAsync({ type: 'blob' })
        .then(blob => {
          // Télécharger le fichier
          downloadFile(blob, 'qr-game-qrcodes.zip');
          
          // Afficher un message
          showToast('QR codes générés et téléchargés');
        })
        .catch(error => {
          console.error('Erreur lors de la génération du fichier ZIP:', error);
          showToast('Erreur lors de la génération des QR codes', 'error');
        });
    })
    .catch(error => {
      console.error('Erreur lors de la génération des QR codes:', error);
      showToast('Erreur lors de la génération des QR codes', 'error');
    });
}

/**
 * Génère un QR code pour une question spécifique
 * @param {string} id - ID de la question
 */
function generateQuestionQR(id) {
  // Récupérer les questions
  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || '[]');
  
  // Trouver la question
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    showToast('Question non trouvée', 'error');
    return;
  }
  
  // Récupérer les paramètres
  const settings = JSON.parse(localStorage.getItem('qr_game_settings') || '{}');
  const baseUrl = settings.general && settings.general.baseUrl ? settings.general.baseUrl : window.location.origin;
  
  // Construire l'URL
  const url = `${baseUrl}?question_id=${question.id}`;
  
  // Créer une modal pour afficher le QR code
  const modalId = 'qr-code-modal';
  let modal = document.getElementById(modalId);
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'qrCodeModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="qrCodeModalLabel">QR Code: ${question.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body text-center">
            <div id="qr-code-container"></div>
            <p class="mt-3">${url}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" id="download-qr-code">Télécharger</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  } else {
    // Mettre à jour le titre
    modal.querySelector('.modal-title').textContent = `QR Code: ${question.title}`;
    
    // Mettre à jour l'URL
    modal.querySelector('.modal-body p').textContent = url;
  }
  
  // Créer le QR code
  const qrContainer = modal.querySelector('#qr-code-container');
  qrContainer.innerHTML = '';
  
  const qrCode = new QRCode(qrContainer, {
    text: url,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  
  // Gestionnaire pour le bouton de téléchargement
  const downloadButton = modal.querySelector('#download-qr-code');
  downloadButton.onclick = function() {
    // Récupérer l'image
    const canvas = qrCode._oDrawing._elCanvas;
    
    // Convertir le canvas en image
    const imgData = canvas.toDataURL('image/png');
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `qr-code-${question.id}.png`;
    
    // Ajouter le lien au document
    document.body.appendChild(link);
    
    // Cliquer sur le lien
    link.click();
    
    // Supprimer le lien
    document.body.removeChild(link);
  };
  
  // Afficher la modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}
