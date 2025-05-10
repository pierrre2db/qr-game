# Plan de Test - Jeu QR Cefor

## Objectif
Ce document définit le plan de test pour l'application Jeu QR Cefor. Il détaille les différents scénarios de test à exécuter pour s'assurer que l'application fonctionne correctement et répond aux exigences fonctionnelles.

## Environnement de test
- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Appareils** : Desktop, Tablette, Mobile
- **Serveur** : Node.js local sur le port 3000

## Composants à tester

### 1. Écran d'accueil et inscription
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 1.1 | Affichage de l'écran d'accueil | Accéder à l'URL du jeu | L'écran d'accueil s'affiche avec le formulaire d'inscription | Haute |
| 1.2 | Validation du formulaire vide | Soumettre le formulaire sans remplir les champs | Message d'erreur indiquant que le nom est obligatoire | Haute |
| 1.3 | Validation du formulaire avec nom uniquement | Remplir le champ nom et soumettre | Passage à l'écran de confirmation | Haute |
| 1.4 | Validation du formulaire complet | Remplir tous les champs et soumettre | Passage à l'écran de confirmation | Haute |
| 1.5 | Validation de l'email | Saisir un email invalide et soumettre | Message d'erreur indiquant que l'email est invalide | Moyenne |
| 1.6 | Validation du téléphone | Saisir un numéro de téléphone invalide et soumettre | Message d'erreur indiquant que le téléphone est invalide | Moyenne |

### 2. Écran de confirmation
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 2.1 | Affichage de l'écran de confirmation | Après inscription réussie | L'écran de confirmation s'affiche avec le nom du joueur | Haute |
| 2.2 | Bouton "Commencer à scanner" | Cliquer sur le bouton | Passage à l'écran de jeu | Haute |
| 2.3 | Persistance des données | Recharger la page après l'inscription | L'écran de confirmation s'affiche toujours (pas de retour à l'inscription) | Haute |

### 3. Écran de jeu
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 3.1 | Affichage de l'écran de jeu | Après avoir cliqué sur "Commencer à scanner" | L'écran de jeu s'affiche avec le message d'attente pour scanner un QR code | Haute |
| 3.2 | Barre de progression | Observer la barre de progression | La barre affiche 0/7 questions complétées | Haute |
| 3.3 | Persistance de l'écran de jeu | Recharger la page après être passé à l'écran de jeu | L'écran de jeu s'affiche toujours (pas de retour à l'inscription) | Haute |

### 4. Scan de QR codes et affichage des questions
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 4.1 | Scan d'un QR code valide | Scanner un QR code lié à une question | La question correspondante s'affiche | Haute |
| 4.2 | Affichage des options | Après le scan d'un QR code | Les options de réponse s'affichent correctement | Haute |
| 4.3 | Scan d'un QR code déjà répondu | Scanner un QR code pour une question déjà répondue | La question s'affiche avec la réponse précédente sélectionnée et le feedback | Moyenne |
| 4.4 | Scan d'un QR code invalide | Scanner un QR code non lié au jeu | Message d'erreur indiquant que le QR code est invalide | Moyenne |

### 5. Réponse aux questions
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 5.1 | Sélection d'une réponse | Cliquer sur une option de réponse | L'option est sélectionnée et le feedback s'affiche | Haute |
| 5.2 | Feedback pour réponse correcte | Sélectionner la bonne réponse | Message de succès et bouton "Continuer" | Haute |
| 5.3 | Feedback pour réponse incorrecte | Sélectionner une mauvaise réponse | Message d'erreur avec la bonne réponse et bouton "Continuer" | Haute |
| 5.4 | Bouton "Continuer" | Cliquer sur le bouton après avoir répondu | Retour à l'écran d'attente pour scanner un nouveau QR code | Haute |
| 5.5 | Mise à jour de la progression | Après avoir répondu à une question | La barre de progression est mise à jour | Haute |

### 6. Persistance des données
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 6.1 | Persistance des réponses | Recharger la page après avoir répondu à des questions | Les réponses sont conservées et la progression est maintenue | Haute |
| 6.2 | Persistance entre sessions | Fermer le navigateur et revenir plus tard | Les données du joueur et les réponses sont conservées | Moyenne |
| 6.3 | Réinitialisation des données | Effacer le localStorage et recharger | Retour à l'écran d'inscription | Basse |

### 7. Génération de QR codes
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 7.1 | Accès à la page de génération | Accéder à l'URL du générateur de QR codes | La page s'affiche avec les QR codes pour chaque question | Moyenne |
| 7.2 | QR codes générés | Observer les QR codes sur la page | Chaque question a un QR code valide | Moyenne |
| 7.3 | Liens sous les QR codes | Cliquer sur un lien sous un QR code | Redirection vers le jeu avec la question correspondante | Moyenne |

### 8. Interface utilisateur et responsive design
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 8.1 | Affichage sur desktop | Ouvrir le jeu sur un ordinateur | L'interface s'adapte correctement | Haute |
| 8.2 | Affichage sur tablette | Ouvrir le jeu sur une tablette | L'interface s'adapte correctement | Moyenne |
| 8.3 | Affichage sur mobile | Ouvrir le jeu sur un smartphone | L'interface s'adapte correctement | Haute |
| 8.4 | Orientation portrait/paysage | Changer l'orientation de l'appareil | L'interface s'adapte correctement | Basse |

### 9. Panneau de débogage
| ID | Scénario de test | Étapes | Résultat attendu | Priorité |
|----|-----------------|--------|------------------|----------|
| 9.1 | Affichage du panneau | Observer le panneau de débogage | Le panneau est visible en bas à droite | Basse |
| 9.2 | Logs de débogage | Effectuer des actions dans le jeu | Les logs s'affichent dans le panneau | Basse |
| 9.3 | Masquer/Afficher le panneau | Cliquer sur le bouton "Masquer" | Le panneau se masque/s'affiche | Basse |

## Automatisation des tests

### Test automatisé complet
Le script `test-all-questions.js` exécute un test automatisé complet qui :
1. Simule l'inscription d'un joueur
2. Passe à l'écran de confirmation
3. Passe à l'écran de jeu
4. Simule le scan de toutes les questions dans un ordre aléatoire
5. Répond à chaque question
6. Vérifie la progression finale

Pour exécuter ce test :
```bash
node test-all-questions.js
```

### Rapports de test
Les captures d'écran de chaque étape du test sont sauvegardées dans le dossier `test-screenshots` pour analyse ultérieure.

## Matrice de compatibilité
| Navigateur/Appareil | Desktop | Tablette | Mobile |
|---------------------|---------|----------|--------|
| Chrome              | ✅      | ✅       | ✅     |
| Firefox             | ✅      | ✅       | ✅     |
| Safari              | ✅      | ✅       | ✅     |
| Edge                | ✅      | ✅       | ✅     |

## Critères d'acceptation
- Toutes les fonctionnalités de priorité Haute doivent fonctionner sans erreur
- Les fonctionnalités de priorité Moyenne peuvent avoir des problèmes mineurs
- Les fonctionnalités de priorité Basse sont considérées comme optionnelles
