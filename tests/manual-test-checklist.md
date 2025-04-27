# Checklist de Tests Manuels pour QR Game

Cette checklist permet de vérifier manuellement toutes les fonctionnalités du QR Game.

## 1. Tests de l'API

- [ ] **GET /api/questions** : Vérifier que l'API renvoie toutes les questions
  - Ouvrir http://localhost:3000/api/questions dans le navigateur
  - Vérifier que le JSON contient toutes les questions attendues

- [ ] **GET /api/questions/:id** : Vérifier qu'une question spécifique est renvoyée
  - Ouvrir http://localhost:3000/api/questions/Q1 dans le navigateur
  - Vérifier que le JSON contient uniquement la question Q1

- [ ] **GET /api/stats** : Vérifier que les statistiques sont renvoyées
  - Ouvrir http://localhost:3000/api/stats dans le navigateur
  - Vérifier que le JSON contient les statistiques (questions, réponses, joueurs)

## 2. Tests de l'Interface d'Administration

### 2.1 Page d'accueil admin

- [ ] **Chargement** : Vérifier que la page se charge correctement
  - Ouvrir http://localhost:3000/admin-index.html
  - Vérifier que les trois modules sont affichés (Tableau de bord, Questions, QR Codes)

- [ ] **Statut du système** : Vérifier que le statut du système est correct
  - Vérifier que la connexion à l'API est "Connecté"
  - Vérifier que le nombre de questions est correct
  - Vérifier que le nombre de réponses est affiché

### 2.2 Gestion des questions

- [ ] **Chargement des questions** : Vérifier que toutes les questions sont affichées
  - Ouvrir http://localhost:3000/admin-questions.html
  - Vérifier que le tableau contient toutes les questions

- [ ] **Ajout d'une question** : Vérifier qu'une nouvelle question peut être ajoutée
  - Cliquer sur "Ajouter une question"
  - Remplir le formulaire avec une nouvelle question
  - Cliquer sur "Enregistrer"
  - Vérifier que la question apparaît dans le tableau

- [ ] **Modification d'une question** : Vérifier qu'une question peut être modifiée
  - Cliquer sur l'icône de modification d'une question existante
  - Modifier les champs
  - Cliquer sur "Enregistrer"
  - Vérifier que les modifications sont appliquées

- [ ] **Suppression d'une question** : Vérifier qu'une question peut être supprimée
  - Cliquer sur l'icône de suppression d'une question
  - Confirmer la suppression
  - Vérifier que la question est supprimée du tableau

- [ ] **Import/Export** : Vérifier que l'import/export fonctionne
  - Cliquer sur "Exporter" pour télécharger le fichier JSON
  - Modifier le fichier JSON localement
  - Cliquer sur "Importer" et sélectionner le fichier modifié
  - Vérifier que les questions sont mises à jour

### 2.3 Générateur de QR codes

- [ ] **Chargement des questions** : Vérifier que toutes les questions sont disponibles
  - Ouvrir http://localhost:3000/admin-qrcodes.html
  - Cliquer sur "Rafraîchir les données"
  - Vérifier que le message indique le bon nombre de questions chargées

- [ ] **Génération des QR codes** : Vérifier que les QR codes sont générés
  - Cliquer sur "Générer tous"
  - Vérifier que les QR codes sont affichés pour toutes les questions

- [ ] **Personnalisation** : Vérifier que les options de personnalisation fonctionnent
  - Modifier la taille, la couleur et l'arrière-plan
  - Cliquer sur "Générer tous"
  - Vérifier que les QR codes reflètent les nouvelles options

- [ ] **Téléchargement** : Vérifier que les QR codes peuvent être téléchargés
  - Cliquer sur "Télécharger" pour un QR code
  - Vérifier que le fichier est téléchargé correctement

- [ ] **Impression** : Vérifier que l'impression fonctionne
  - Cliquer sur "Imprimer tous"
  - Vérifier que la page d'impression s'ouvre avec tous les QR codes

## 3. Tests de l'Interface de Jeu

- [ ] **Chargement initial** : Vérifier que la page de jeu se charge correctement
  - Ouvrir http://localhost:3000/game.html
  - Vérifier que l'interface de jeu s'affiche correctement

- [ ] **Chargement d'une question spécifique** : Vérifier qu'une question peut être chargée via URL
  - Ouvrir http://localhost:3000/game.html?q=Q1
  - Vérifier que la question Q1 est affichée

- [ ] **Réponse à une question** : Vérifier que les réponses sont enregistrées
  - Répondre à une question
  - Vérifier que la réponse est enregistrée
  - Vérifier que le message de confirmation s'affiche

- [ ] **Barre de progression** : Vérifier que la barre de progression se met à jour
  - Noter la progression initiale
  - Répondre à une question
  - Vérifier que la barre de progression est mise à jour

- [ ] **Navigation entre questions** : Vérifier que la navigation fonctionne
  - Répondre à une question
  - Scanner un autre QR code ou changer l'URL manuellement
  - Vérifier que la nouvelle question est chargée
  - Vérifier que la barre de progression reflète toutes les questions répondues

## 4. Tests de Robustesse

- [ ] **Persistance des données** : Vérifier que les données sont persistantes
  - Redémarrer le serveur
  - Vérifier que toutes les questions et réponses sont toujours disponibles

- [ ] **Gestion des erreurs** : Vérifier que les erreurs sont gérées correctement
  - Essayer d'accéder à une question inexistante (http://localhost:3000/game.html?q=INVALID)
  - Vérifier qu'un message d'erreur approprié s'affiche

- [ ] **Compatibilité navigateur** : Vérifier que l'application fonctionne sur différents navigateurs
  - Tester sur Chrome, Firefox, Safari, etc.
  - Vérifier que toutes les fonctionnalités fonctionnent de manière cohérente

## 5. Flux Complet

- [ ] **Flux complet** : Vérifier le flux complet de l'application
  1. Créer une nouvelle question dans l'interface d'administration
  2. Générer un QR code pour cette question
  3. Scanner le QR code avec un appareil mobile
  4. Répondre à la question
  5. Vérifier que la réponse est enregistrée dans les statistiques
