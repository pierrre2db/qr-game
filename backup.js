const fs = require('fs');
const path = require('path');

// Fonction de sauvegarde
function backupData() {
  // Créer un dossier de backup avec horodatage
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(__dirname, 'backups', timestamp);

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Copier les fichiers de données
  const dataDir = path.join(__dirname, 'data');
  const files = ['questions.json', 'responses.json'];

  files.forEach(file => {
    const sourcePath = path.join(dataDir, file);
    const destPath = path.join(backupDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Sauvegarde de ${file} effectuée.`);
    } else {
      console.warn(`Fichier ${file} non trouvé.`);
    }
  });

  console.log(`Sauvegarde terminée dans ${backupDir}`);
  return backupDir;
}

// Fonction de restauration
function restoreData(backupDir) {
  if (!backupDir) {
    // Si aucun dossier n'est spécifié, utiliser le plus récent
    const backupsDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupsDir)) {
      console.error('Aucun dossier de sauvegarde trouvé.');
      return false;
    }
    
    const backups = fs.readdirSync(backupsDir)
      .filter(dir => fs.statSync(path.join(backupsDir, dir)).isDirectory())
      .sort((a, b) => b.localeCompare(a)); // Tri par ordre décroissant
    
    if (backups.length === 0) {
      console.error('Aucune sauvegarde trouvée.');
      return false;
    }
    
    backupDir = path.join(backupsDir, backups[0]);
  }
  
  // Vérifier que le dossier de sauvegarde existe
  if (!fs.existsSync(backupDir)) {
    console.error(`Le dossier de sauvegarde ${backupDir} n'existe pas.`);
    return false;
  }
  
  // Restaurer les fichiers
  const dataDir = path.join(__dirname, 'data');
  const files = ['questions.json', 'responses.json'];
  
  // Créer le dossier de données s'il n'existe pas
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  files.forEach(file => {
    const sourcePath = path.join(backupDir, file);
    const destPath = path.join(dataDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Restauration de ${file} effectuée.`);
    } else {
      console.warn(`Fichier ${file} non trouvé dans la sauvegarde.`);
    }
  });
  
  console.log(`Restauration depuis ${backupDir} terminée.`);
  return true;
}

// Exécution en ligne de commande
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'backup') {
    backupData();
  } else if (command === 'restore') {
    const backupDir = args[1];
    restoreData(backupDir);
  } else {
    console.log('Usage: node backup.js [backup|restore] [chemin_sauvegarde]');
  }
}

module.exports = { backupData, restoreData };
