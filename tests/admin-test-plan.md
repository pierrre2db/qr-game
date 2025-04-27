# Plan de test complet - Interface d'administration QR Game

## Objectifs
- Vérifier le bon fonctionnement de toutes les interfaces d'administration
- Identifier et corriger les erreurs potentielles
- Assurer la cohérence entre les différentes pages
- Tester les fonctionnalités critiques (CRUD des questions, génération de QR codes, réinitialisation des statistiques)

## Prérequis
- Serveur QR Game en cours d'exécution sur le port 3000
- Base de données initiale avec quelques questions et réponses
- Navigateur web moderne (Chrome, Firefox, Safari)
- Accès à l'API et aux fichiers de données

## 1. Tests de navigation et d'accessibilité

### 1.1 Navigation entre les pages
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 1.1.1 | Accès à la page d'accueil admin | Ouvrir http://localhost:3000/admin-index.html | La page se charge correctement avec tous les liens |
| 1.1.2 | Navigation vers le tableau de bord | Cliquer sur "Tableau de bord" | Redirection vers admin-dashboard.html |
| 1.1.3 | Navigation vers les questions | Cliquer sur "Questions" | Redirection vers admin-questions.html |
| 1.1.4 | Navigation vers les QR codes | Cliquer sur "QR Codes" | Redirection vers admin-qrcodes.html |
| 1.1.5 | Navigation vers les paramètres | Cliquer sur "Paramètres" | Redirection vers admin-settings.html |
| 1.1.6 | Retour à l'accueil | Cliquer sur "QR Game Admin" dans la barre de navigation | Redirection vers admin-index.html |

### 1.2 Responsive design
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 1.2.1 | Affichage sur desktop | Ouvrir les pages admin sur un écran large | Interface correctement affichée |
| 1.2.2 | Affichage sur tablette | Redimensionner la fenêtre à 768px | Interface adaptée, menu hamburger |
| 1.2.3 | Affichage sur mobile | Redimensionner la fenêtre à 375px | Interface adaptée, menu hamburger, éléments empilés |

## 2. Tests du tableau de bord (admin-dashboard.html)

### 2.1 Affichage des statistiques
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 2.1.1 | Chargement des statistiques | Ouvrir la page | Affichage du nombre de questions, réponses et joueurs |
| 2.1.2 | Graphique de taux de réussite | Vérifier le graphique | Graphique affiché avec les données correctes |
| 2.1.3 | Activité récente | Vérifier le tableau d'activité | Liste des réponses récentes avec timestamps |

### 2.2 Réinitialisation des statistiques
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 2.2.1 | Ouverture du modal | Cliquer sur "Réinitialiser les statistiques" | Modal affiché avec champ de mot de passe |
| 2.2.2 | Annulation | Cliquer sur "Annuler" | Modal fermé, aucune modification |
| 2.2.3 | Mot de passe vide | Cliquer sur "Réinitialiser" sans mot de passe | Message d'erreur affiché |
| 2.2.4 | Mot de passe incorrect | Entrer un mot de passe incorrect | Message "Mot de passe incorrect" |
| 2.2.5 | Réinitialisation réussie | Entrer "qrgame2025" et cliquer sur "Réinitialiser" | Toast de succès, statistiques à zéro |

## 3. Tests de gestion des questions (admin-questions.html)

### 3.1 Affichage des questions
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 3.1.1 | Chargement des questions | Ouvrir la page | Tableau avec toutes les questions |
| 3.1.2 | Tri des questions | Cliquer sur les en-têtes de colonne | Questions triées selon la colonne |
| 3.1.3 | Pagination | Vérifier les contrôles de pagination | Navigation entre les pages si > 10 questions |

### 3.2 Ajout de question
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 3.2.1 | Ouverture du formulaire | Cliquer sur "Ajouter une question" | Modal affiché avec formulaire vide |
| 3.2.2 | Validation des champs requis | Soumettre sans remplir les champs requis | Messages d'erreur sur les champs obligatoires |
| 3.2.3 | Ajout d'options | Cliquer sur "Ajouter une option" | Nouveau champ d'option ajouté |
| 3.2.4 | Suppression d'options | Cliquer sur l'icône de suppression | Option supprimée |
| 3.2.5 | Ajout d'une question standard | Remplir le formulaire et soumettre | Question ajoutée, toast de succès |
| 3.2.6 | Ajout d'une question texte | Changer le type en "text" et soumettre | Question ajoutée, toast de succès |
| 3.2.7 | Ajout d'une question numérique | Changer le type en "number" et soumettre | Question ajoutée, toast de succès |

### 3.3 Édition de question
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 3.3.1 | Ouverture du formulaire d'édition | Cliquer sur l'icône d'édition | Modal affiché avec données de la question |
| 3.3.2 | Modification des champs | Modifier les champs et soumettre | Question mise à jour, toast de succès |
| 3.3.3 | Changement de type | Changer le type et soumettre | Question mise à jour avec nouveau type |

### 3.4 Suppression de question
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 3.4.1 | Confirmation de suppression | Cliquer sur l'icône de suppression | Modal de confirmation affiché |
| 3.4.2 | Annulation | Cliquer sur "Annuler" | Modal fermé, question non supprimée |
| 3.4.3 | Suppression confirmée | Cliquer sur "Supprimer" | Question supprimée, toast de succès |

### 3.5 Import/Export
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 3.5.1 | Export JSON | Cliquer sur "Exporter (JSON)" | Fichier JSON téléchargé avec toutes les questions |
| 3.5.2 | Import JSON valide | Importer un fichier JSON valide | Questions importées, toast de succès |
| 3.5.3 | Import JSON invalide | Importer un fichier JSON invalide | Message d'erreur affiché |

## 4. Tests de génération de QR codes (admin-qrcodes.html)

### 4.1 Options de génération
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 4.1.1 | Modification de la taille | Changer la valeur du champ "Taille" | Valeur mise à jour |
| 4.1.2 | Modification de la couleur | Changer la couleur | Valeur mise à jour |
| 4.1.3 | Modification de l'arrière-plan | Changer la couleur d'arrière-plan | Valeur mise à jour |
| 4.1.4 | Modification de l'URL de base | Modifier l'URL de base | Valeur mise à jour |
| 4.1.5 | Détection automatique de l'URL | Cliquer sur "Détecter" | URL de base détectée et remplie |

### 4.2 Génération des QR codes
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 4.2.1 | Génération de tous les QR codes | Cliquer sur "Générer tous" | QR codes générés pour toutes les questions |
| 4.2.2 | Vérification des couleurs | Générer avec couleurs personnalisées | QR codes avec les couleurs spécifiées |
| 4.2.3 | Téléchargement individuel | Cliquer sur "Télécharger" pour un QR code | Fichier PNG téléchargé |
| 4.2.4 | Test d'un QR code | Cliquer sur "Tester" | Ouverture du jeu avec la question spécifique |
| 4.2.5 | Impression de tous les QR codes | Cliquer sur "Imprimer tous" | Fenêtre d'impression avec tous les QR codes |

## 5. Tests de paramètres (admin-settings.html)

### 5.1 Paramètres généraux
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 5.1.1 | Modification du titre | Changer le titre et enregistrer | Paramètre sauvegardé, toast de succès |
| 5.1.2 | Modification de l'URL de base | Changer l'URL et enregistrer | Paramètre sauvegardé, toast de succès |
| 5.1.3 | Modification des couleurs | Changer les couleurs et enregistrer | Paramètres sauvegardés, toast de succès |

### 5.2 Sécurité
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 5.2.1 | Modification du mot de passe | Entrer et confirmer un nouveau mot de passe | Mot de passe mis à jour, toast de succès |
| 5.2.2 | Mots de passe non concordants | Entrer des mots de passe différents | Message d'erreur affiché |
| 5.2.3 | Activation de l'authentification | Cocher "Exiger l'authentification" | Paramètre sauvegardé, toast de succès |

### 5.3 Sauvegarde et restauration
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 5.3.1 | Création d'une sauvegarde | Cliquer sur "Créer une sauvegarde" | Sauvegarde créée, toast de succès |
| 5.3.2 | Sélection d'un fichier invalide | Sélectionner un fichier non-ZIP | Message d'erreur, bouton désactivé |
| 5.3.3 | Restauration depuis une sauvegarde | Sélectionner un ZIP valide et restaurer | Données restaurées, toast de succès |

### 5.4 Maintenance
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 5.4.1 | Réinitialisation des statistiques | Tester comme dans 2.2 | Statistiques réinitialisées |
| 5.4.2 | Vidage du cache | Cliquer sur "Vider le cache" | Cache vidé, toast de succès |

## 6. Tests d'intégration

### 6.1 Cohérence des données
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 6.1.1 | Ajout d'une question et génération de QR code | Ajouter une question puis générer son QR code | QR code généré correctement |
| 6.1.2 | Modification d'une question et statistiques | Modifier une question et vérifier les statistiques | Statistiques cohérentes avec la modification |
| 6.1.3 | Réinitialisation et tableau de bord | Réinitialiser les statistiques et vérifier le tableau de bord | Tableau de bord à zéro |

### 6.2 Tests de performance
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 6.2.1 | Chargement avec nombreuses questions | Importer 100+ questions | Interface réactive, chargement rapide |
| 6.2.2 | Génération de nombreux QR codes | Générer QR codes pour 100+ questions | Génération sans crash ni lenteur excessive |

## 7. Tests de sécurité

### 7.1 Contrôle d'accès
| # | Test | Étapes | Résultat attendu |
|---|------|--------|-----------------|
| 7.1.1 | Protection des opérations sensibles | Tenter de réinitialiser sans mot de passe | Opération refusée |
| 7.1.2 | Validation des entrées | Soumettre des données malformées via l'API | Erreur 400, données rejetées |

## Instructions d'exécution
1. Exécuter les tests dans l'ordre indiqué
2. Pour chaque test, noter le résultat (Succès/Échec)
3. En cas d'échec, documenter :
   - Message d'erreur exact
   - Capture d'écran
   - Étapes pour reproduire
4. Corriger les erreurs avant de passer à la section suivante

## Rapport de test
Utiliser le template suivant pour rapporter les résultats :

```
# Rapport de test - Interface d'administration QR Game
Date : [DATE]
Testeur : [NOM]

## Résumé
- Tests réussis : X/Y
- Tests échoués : Z/Y
- Taux de succès : XX%

## Détails des échecs
1. [ID du test] - [Description du problème]
2. ...

## Recommandations
- [Recommandation 1]
- [Recommandation 2]
```
