#!/usr/bin/env node

/**
 * Script de gestion de version pour QR Game
 * 
 * Utilisation:
 *   node scripts/version-bump.js [major|minor|patch]
 * 
 * Exemples:
 *   node scripts/version-bump.js patch  # Incrémente la version de correctif (1.0.0 -> 1.0.1)
 *   node scripts/version-bump.js minor  # Incrémente la version mineure (1.0.0 -> 1.1.0)
 *   node scripts/version-bump.js major  # Incrémente la version majeure (1.0.0 -> 2.0.0)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chemins des fichiers
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const versionFilePath = path.join(__dirname, '..', 'VERSION');
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// Type de mise à jour (major, minor, patch)
const updateType = process.argv[2];

if (!['major', 'minor', 'patch'].includes(updateType)) {
  console.error('Erreur: Veuillez spécifier un type de mise à jour valide (major, minor, patch)');
  console.error('Exemple: node scripts/version-bump.js minor');
  process.exit(1);
}

// Lire la version actuelle
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;
console.log(`Version actuelle: ${currentVersion}`);

// Décomposer la version
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculer la nouvelle version
let newVersion;
if (updateType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (updateType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

console.log(`Nouvelle version: ${newVersion}`);

// Mettre à jour package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ package.json mis à jour');

// Mettre à jour le fichier VERSION
fs.writeFileSync(versionFilePath, newVersion);
console.log('✅ VERSION mis à jour');

// Mettre à jour le CHANGELOG
const today = new Date().toISOString().split('T')[0];
const changelogContent = fs.readFileSync(changelogPath, 'utf8');

// Préparer la nouvelle entrée de changelog
const newChangelogEntry = `## [${newVersion}] - ${today}

### Ajouté
- 

### Modifié
- 

### Corrigé
- 

`;

// Insérer la nouvelle entrée après la ligne "et ce projet adhère au..."
const updatedChangelog = changelogContent.replace(
  /(et ce projet adhère au \[Semantic Versioning\]\(https:\/\/semver\.org\/spec\/v2\.0\.0\.html\)\.)\n\n/,
  `$1\n\n${newChangelogEntry}`
);

fs.writeFileSync(changelogPath, updatedChangelog);
console.log('✅ CHANGELOG.md mis à jour (n\'oubliez pas de compléter les détails)');

// Créer un commit Git avec la nouvelle version
try {
  execSync(`git add package.json VERSION CHANGELOG.md`);
  execSync(`git commit -m "Version ${newVersion}"`);
  execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
  console.log(`✅ Commit et tag Git créés pour la version ${newVersion}`);
  console.log('\nPour pousser les changements vers GitHub:');
  console.log(`  git push origin main`);
  console.log(`  git push origin v${newVersion}`);
} catch (error) {
  console.error('⚠️ Erreur lors de la création du commit Git:', error.message);
}
