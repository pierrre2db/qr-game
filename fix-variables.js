// Variables globales
let questions = [];
let currentQuestionIndex = 0;
let playerAnswers = {};
let gameId = 'cefor-quiz-2025'; // ID du jeu par défaut
let sessionId = ''; // ID de session unique pour ce joueur
let playerName = '';
let playerEmail = '';
let playerPhone = '';
let answeredQuestions = new Set();
let totalQuestions = 0;

// Éléments DOM - Initialisation après DOMContentLoaded
let welcomeScreen;
let gameScreen;
let currentQuestion;
let questionCounter;
let progressBar;
let progressInfoStart;
let progressInfoEnd;
let prevQuestionBtn;
let nextQuestionBtn;
let burgerMenu;
let burgerButton;
let burgerContent;
let questionList;
let alreadyParticipatedAlert;
let pointsDisplay;

// Popups de feedback
let feedbackOverlay;
let inscriptionPopup;
let answerPopup;
let nextQuestionPopup;
let completionPopup;
