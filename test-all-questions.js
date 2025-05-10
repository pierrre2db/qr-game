// Script de test pour simuler le scan de toutes les questions dans un ordre aléatoire
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Créer le répertoire pour les captures d'écran s'il n'existe pas
const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function testAllQuestions() {
  console.log('Démarrage du test de toutes les questions dans un ordre aléatoire...');
  
  // Lancer le navigateur
  const browser = await puppeteer.launch({
    headless: false, // Afficher le navigateur
    slowMo: 250, // Ralentir les actions pour mieux voir ce qui se passe
    defaultViewport: null,
    args: ['--start-maximized'] // Démarrer en plein écran
  });
  
  try {
    // Étape 1: Récupérer toutes les questions disponibles
    console.log('Étape 1: Récupération des questions disponibles');
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/api/questions', { waitUntil: 'networkidle2' });
    
    // Extraire les données JSON de la page
    const questionsData = await page.evaluate(() => {
      try {
        return JSON.parse(document.body.textContent);
      } catch (e) {
        return null;
      }
    });
    
    if (!questionsData || !questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Impossible de récupérer les questions');
    }
    
    const questions = questionsData.questions;
    console.log(`${questions.length} questions récupérées`);
    
    // Fermer la page des questions API
    await page.close();
    
    // Étape 2: Inscription du joueur
    console.log('Étape 2: Inscription du joueur');
    const gamePage = await browser.newPage();
    
    // Activer la console du navigateur pour le débogage
    gamePage.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    await gamePage.goto('http://localhost:3000/game-v2.html', { waitUntil: 'networkidle2' });
    
    // Injecter les questions dans la page pour les rendre disponibles
    await gamePage.evaluate((questionsJSON) => {
      window.questionsData = JSON.parse(questionsJSON);
      console.log('Questions injectées:', window.questionsData.questions.length);
    }, JSON.stringify(questionsData));
    
    // Attendre que la page soit complètement chargée
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Vérifier si le formulaire d'inscription est visible
    const isWelcomeScreenVisible = await gamePage.evaluate(() => {
      const welcomeScreen = document.getElementById('welcome-screen');
      return welcomeScreen && (getComputedStyle(welcomeScreen).display !== 'none');
    });
    
    if (isWelcomeScreenVisible) {
      console.log('Formulaire d\'inscription visible, remplissage en cours...');
      
      // Remplir le formulaire d'inscription
      await gamePage.type('#player-name', 'Test Simulation QR');
      
      // Prendre une capture d'écran
      await gamePage.screenshot({ path: path.join(screenshotsDir, '1-inscription.png') });
      
      // Soumettre le formulaire
      await gamePage.evaluate(() => {
        const startButton = document.getElementById('start-game-btn');
        if (startButton) {
          startButton.click();
          return true;
        }
        return false;
      });
      
      console.log('Formulaire d\'inscription soumis');
      
      // Attendre l'écran de confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('Formulaire d\'inscription non visible, vérification de l\'état actuel...');
    }
    
    // Prendre une capture d'écran de l'état actuel
    await gamePage.screenshot({ path: path.join(screenshotsDir, '2-etat-actuel.png') });
    
    // Vérifier si l'écran de confirmation est visible
    const isConfirmationScreenVisible = await gamePage.evaluate(() => {
      const confirmationScreen = document.getElementById('confirmation-screen');
      return confirmationScreen && (getComputedStyle(confirmationScreen).display !== 'none');
    });
    
    if (isConfirmationScreenVisible) {
      console.log('Écran de confirmation visible, passage à l\'écran de jeu...');
      
      // Cliquer sur le bouton pour commencer à scanner
      const startScanningResult = await gamePage.evaluate(() => {
        const button = document.getElementById('start-scanning-btn');
        if (button) {
          button.click();
          return 'Bouton trouvé et cliqué';
        } else {
          // Plan B: Manipuler directement le DOM
          const confirmationScreen = document.getElementById('confirmation-screen');
          const gameScreen = document.getElementById('game-screen');
          
          if (confirmationScreen && gameScreen) {
            confirmationScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            return 'DOM manipulé directement';
          }
          return 'Bouton non trouvé et DOM non manipulable';
        }
      });
      
      console.log('Résultat du passage à l\'écran de jeu:', startScanningResult);
      
      // Attendre que l'écran de jeu soit chargé
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('Écran de confirmation non visible, vérification si déjà sur l\'écran de jeu...');
    }
    
    // Prendre une capture d'écran de l'écran de jeu
    await gamePage.screenshot({ path: path.join(screenshotsDir, '3-ecran-jeu.png') });
    
    // Étape 3: Mélanger les questions pour les scanner dans un ordre aléatoire
    console.log('Étape 3: Mélange des questions');
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    // Étape 4: Simuler le scan de chaque question
    console.log('Étape 4: Simulation du scan de chaque question');
    
    // Injecter une fonction pour simuler le scan d'un QR code
    await gamePage.evaluate(() => {
      window.simulateScan = function(questionId) {
        console.log('Simulation du scan du QR code pour la question:', questionId);
        
        // Récupérer la question
        const question = window.questionsData.questions.find(q => q.id === questionId);
        
        if (!question) {
          console.error('Question non trouvée:', questionId);
          return false;
        }
        
        // Afficher la question
        if (typeof window.displayQuestion === 'function') {
          window.displayQuestion(question);
          return true;
        } else {
          console.error('Fonction displayQuestion non disponible');
          return false;
        }
      };
      
      // Fonction pour simuler une réponse à une question
      window.simulateAnswer = function(questionId, answerIndex) {
        console.log('Simulation de réponse pour la question:', questionId, 'index:', answerIndex);
        
        // Récupérer la question
        const question = window.questionsData.questions.find(q => q.id === questionId);
        
        if (!question || !question.options || answerIndex >= question.options.length) {
          console.error('Question ou option non trouvée');
          return false;
        }
        
        // Sélectionner l'option
        const answer = question.options[answerIndex];
        
        // Enregistrer la réponse
        if (typeof window.saveAnswer === 'function') {
          window.saveAnswer(questionId, answer);
          return true;
        } else {
          console.error('Fonction saveAnswer non disponible');
          return false;
        }
      };
      
      // Fonction pour continuer après une réponse
      window.simulateContinue = function() {
        console.log('Simulation du clic sur Continuer');
        
        // Trouver le bouton continuer
        const continueBtn = document.querySelector('.continue-btn');
        
        if (continueBtn) {
          continueBtn.click();
          return true;
        } else {
          console.error('Bouton Continuer non trouvé');
          return false;
        }
      };
    });
    
    // Traiter chaque question
    for (let i = 0; i < shuffledQuestions.length; i++) {
      const question = shuffledQuestions[i];
      console.log(`\nQuestion ${i+1}/${shuffledQuestions.length}: ${question.title} (ID: ${question.id})`);
      
      // Simuler le scan du QR code
      const scanResult = await gamePage.evaluate((questionId) => {
        return window.simulateScan(questionId);
      }, question.id);
      
      if (!scanResult) {
        console.log(`Échec de la simulation du scan pour la question ${question.id}`);
        continue;
      }
      
      // Attendre que la question s'affiche
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prendre une capture d'écran de la question
      await gamePage.screenshot({ path: path.join(screenshotsDir, `question-${i+1}-${question.id}.png`) });
      
      // Vérifier si des boutons d'options sont disponibles
      const optionButtonsCount = await gamePage.evaluate(() => {
        const buttons = document.querySelectorAll('.option-btn');
        return buttons.length;
      });
      
      if (optionButtonsCount > 0) {
        console.log(`${optionButtonsCount} options trouvées`);
        
        // Sélectionner une option au hasard
        const randomIndex = Math.floor(Math.random() * optionButtonsCount);
        
        // Simuler le clic sur l'option
        const clickResult = await gamePage.evaluate((index) => {
          const buttons = document.querySelectorAll('.option-btn');
          if (buttons.length > index) {
            const selectedOption = buttons[index].textContent.trim();
            buttons[index].click();
            return selectedOption;
          }
          return null;
        }, randomIndex);
        
        if (clickResult) {
          console.log(`Option sélectionnée: "${clickResult}"`);
          
          // Attendre le feedback
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Prendre une capture d'écran du feedback
          await gamePage.screenshot({ path: path.join(screenshotsDir, `reponse-${i+1}-${question.id}.png`) });
          
          // Cliquer sur Continuer
          const continueResult = await gamePage.evaluate(() => {
            return window.simulateContinue();
          });
          
          if (continueResult) {
            console.log('Continué vers la question suivante');
          } else {
            console.log('Échec du clic sur Continuer, simulation manuelle');
            
            // Simuler manuellement le passage à la question suivante
            await gamePage.evaluate(() => {
              if (typeof window.showNextQuestionPrompt === 'function') {
                window.showNextQuestionPrompt();
              }
            });
          }
        } else {
          console.log('Échec du clic sur l\'option, simulation manuelle de la réponse');
          
          // Simuler manuellement une réponse
          await gamePage.evaluate((questionId, index) => {
            return window.simulateAnswer(questionId, index);
          }, question.id, randomIndex);
        }
      } else {
        console.log('Aucun bouton d\'option trouvé pour cette question, simulation manuelle de la réponse');
        
        // Simuler manuellement une réponse
        await gamePage.evaluate((questionId) => {
          return window.simulateAnswer(questionId, 0);
        }, question.id);
        
        // Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simuler le clic sur Continuer
        await gamePage.evaluate(() => {
          return window.simulateContinue();
        });
      }
      
      // Attendre avant de passer à la question suivante
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Vérifier la progression finale
    const progression = await gamePage.evaluate(() => {
      const progressInfoStart = document.getElementById('progress-info-start');
      const progressInfoEnd = document.getElementById('progress-info-end');
      if (progressInfoStart && progressInfoEnd) {
        return `${progressInfoStart.textContent}/${progressInfoEnd.textContent} questions complétées`;
      }
      return '0/0 questions complétées';
    });
    
    console.log(`\nProgression finale: ${progression}`);
    
    // Prendre une capture d'écran finale
    await gamePage.screenshot({ path: path.join(screenshotsDir, 'progression-finale.png') });
    
    console.log('Test terminé. Attente de 5 secondes avant de fermer le navigateur...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.log(`Erreur pendant le test: ${error.stack || error}`);
  } finally {
    await browser.close();
    console.log('Navigateur fermé');
  }
}

// Exécuter le test
testAllQuestions().catch(console.error);
