# Plan de Test Centré Utilisateur - Jeu QR Cefor

## Objectif
Ce document complète le plan de test principal en se concentrant sur l'expérience utilisateur et le parcours du joueur. Il définit deux approches de test : entièrement automatisée et semi-automatisée avec interaction humaine.

## 1. Parcours Utilisateur Complet

### Parcours typique d'un joueur
1. Le joueur arrive sur la page d'accueil du jeu
2. Il remplit le formulaire d'inscription avec son nom
3. Il passe à l'écran de confirmation
4. Il commence le jeu en cliquant sur "Commencer à scanner"
5. Il scanne un premier QR code
6. Il répond à la question associée
7. Il reçoit un feedback sur sa réponse
8. Il continue vers la question suivante
9. Il répète les étapes 5-8 jusqu'à ce qu'il ait répondu à toutes les questions
10. Il voit sa progression et son score final

## 2. Tests Entièrement Automatisés

### Test automatisé du parcours complet
Le script `test-all-questions.js` simule le parcours complet d'un joueur de manière automatisée :

```javascript
// Exécuter le test automatisé complet
node test-all-questions.js
```

Ce test :
- Simule l'inscription d'un joueur
- Passe à l'écran de confirmation
- Commence le jeu
- Simule le scan de chaque QR code dans un ordre aléatoire
- Répond à chaque question
- Vérifie la progression après chaque réponse
- Capture des screenshots à chaque étape pour analyse

### Avantages des tests automatisés
- Exécution rapide et répétable
- Couverture complète de toutes les questions
- Détection automatique des erreurs
- Documentation visuelle via les captures d'écran
- Possibilité d'exécution en continu (intégration continue)

### Limites des tests automatisés
- Ne reproduit pas exactement l'expérience réelle d'un utilisateur
- Ne détecte pas les problèmes d'utilisabilité
- Ne teste pas les interactions gestuelles sur mobile (comme le scan réel d'un QR code)
- Ne peut pas évaluer la satisfaction utilisateur

## 3. Tests Semi-Automatisés avec Interaction Humaine

Pour compléter les tests automatisés, nous proposons un protocole de test semi-automatisé qui implique des utilisateurs réels.

### Protocole de test semi-automatisé

#### Préparation
1. Imprimer les QR codes pour toutes les questions (utiliser la page `qr-generator.html`)
2. Préparer un formulaire de feedback pour les testeurs
3. Installer l'application sur un serveur de test accessible
4. Recruter 3-5 testeurs représentatifs des utilisateurs finaux

#### Déroulement du test
1. **Briefing initial** (5 minutes)
   - Expliquer le contexte du jeu sans révéler les détails techniques
   - Présenter l'objectif : scanner des QR codes et répondre aux questions
   - Ne pas donner d'instructions détaillées pour observer l'intuitivité de l'interface

2. **Phase d'observation** (15-20 minutes par testeur)
   - Le testeur utilise son propre smartphone pour accéder au jeu
   - Il s'inscrit avec ses informations
   - Il scanne les QR codes dans l'ordre de son choix
   - Il répond aux questions
   - L'observateur note les comportements, hésitations, erreurs sans intervenir

3. **Phase de feedback** (10 minutes par testeur)
   - Le testeur remplit le formulaire de feedback
   - Discussion ouverte sur l'expérience
   - Questions spécifiques sur les points d'amélioration potentiels

#### Éléments à observer
1. **Inscription**
   - Le testeur comprend-il quels champs sont obligatoires ?
   - Rencontre-t-il des difficultés avec la validation du formulaire ?

2. **Navigation entre les écrans**
   - La transition entre les écrans est-elle claire ?
   - Le testeur comprend-il qu'il doit scanner un QR code ?

3. **Scan des QR codes**
   - L'application détecte-t-elle rapidement les QR codes ?
   - Le testeur comprend-il comment scanner correctement ?

4. **Réponse aux questions**
   - Les options sont-elles clairement présentées ?
   - Le feedback après réponse est-il compréhensible ?

5. **Progression**
   - Le testeur comprend-il sa progression dans le jeu ?
   - Sait-il combien de questions il reste à répondre ?

### Script de test semi-automatisé

Pour faciliter les tests semi-automatisés, nous pouvons créer un script qui prépare l'environnement et enregistre les interactions de l'utilisateur :

```javascript
// test-semi-auto.js - À développer
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

// Configurer un serveur pour enregistrer les interactions
app.post('/log-interaction', (req, res) => {
  console.log('Interaction utilisateur:', req.body);
  res.send('OK');
});

// Démarrer le serveur sur un port différent
app.listen(3001, () => {
  console.log('Serveur de logging démarré sur le port 3001');
});

// Injecter du code de tracking dans l'application
async function prepareTestEnvironment() {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  
  // Injecter du code de tracking
  await page.goto('http://localhost:3000/game-v2.html');
  await page.evaluate(() => {
    // Code pour enregistrer les interactions utilisateur
    window.logUserInteraction = function(action, details) {
      fetch('http://localhost:3001/log-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details, timestamp: new Date().toISOString() })
      });
    };
    
    // Attacher des listeners aux éléments importants
    document.addEventListener('click', (e) => {
      logUserInteraction('click', { 
        elementId: e.target.id,
        elementClass: e.target.className,
        elementText: e.target.textContent
      });
    });
    
    console.log('Environnement de test préparé');
  });
  
  await browser.close();
  console.log('Prêt pour les tests utilisateur');
}

prepareTestEnvironment();
```

## 4. Matrice de Test Utilisateur

| Aspect | Test Automatisé | Test Semi-Automatisé | Priorité |
|--------|----------------|---------------------|----------|
| Inscription | ✅ | ✅ | Haute |
| Navigation entre écrans | ✅ | ✅ | Haute |
| Scan de QR codes | ✅ (simulé) | ✅ (réel) | Haute |
| Affichage des questions | ✅ | ✅ | Haute |
| Sélection des réponses | ✅ | ✅ | Haute |
| Feedback après réponse | ✅ | ✅ | Haute |
| Progression | ✅ | ✅ | Haute |
| Performance sur mobile | ❌ | ✅ | Moyenne |
| Expérience utilisateur | ❌ | ✅ | Haute |
| Intuitivité de l'interface | ❌ | ✅ | Haute |
| Satisfaction utilisateur | ❌ | ✅ | Moyenne |

## 5. Formulaire de Feedback Utilisateur

Voici un exemple de formulaire à utiliser lors des tests semi-automatisés :

### Formulaire d'évaluation - Jeu QR Cefor

**Informations générales**
- Date du test : ___/___/______
- Appareil utilisé : _________________
- Navigateur : _________________

**Évaluation (1 = Très mauvais, 5 = Excellent)**

1. **Facilité d'inscription**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

2. **Clarté des instructions**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

3. **Facilité de scan des QR codes**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

4. **Présentation des questions**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

5. **Clarté du feedback après réponse**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

6. **Visibilité de la progression**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

7. **Performance de l'application**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

8. **Design et apparence**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

9. **Satisfaction globale**
   - Score : ⭐⭐⭐⭐⭐
   - Commentaires : _________________

**Questions ouvertes**
1. Qu'avez-vous le plus apprécié dans cette application ?
   _________________________________________________

2. Qu'est-ce qui pourrait être amélioré selon vous ?
   _________________________________________________

3. Avez-vous rencontré des difficultés particulières ?
   _________________________________________________

4. Recommanderiez-vous cette application à d'autres personnes ?
   _________________________________________________

## 6. Plan d'Action Post-Test

Après l'exécution des tests automatisés et semi-automatisés :

1. **Analyse des résultats**
   - Compiler les résultats des tests automatisés
   - Analyser les formulaires de feedback
   - Examiner les logs d'interaction utilisateur

2. **Priorisation des problèmes**
   - Classer les problèmes par sévérité et fréquence
   - Identifier les points de friction communs

3. **Itération et correction**
   - Corriger les bugs identifiés
   - Améliorer les aspects problématiques de l'interface
   - Optimiser les performances si nécessaire

4. **Validation**
   - Exécuter à nouveau les tests automatisés
   - Organiser une seconde session de tests utilisateurs si nécessaire

## 7. Conclusion

Cette approche combinée de tests automatisés et semi-automatisés permet d'évaluer à la fois les aspects techniques et l'expérience utilisateur du Jeu QR Cefor. Les tests automatisés garantissent la stabilité technique, tandis que les tests avec interaction humaine valident l'utilisabilité et la satisfaction des utilisateurs finaux.
