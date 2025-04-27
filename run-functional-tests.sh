#!/bin/bash

# Script pour exécuter les tests fonctionnels du QR Game

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Tests fonctionnels QR Game ===${NC}"
echo -e "${YELLOW}=================================${NC}"

# Vérifier que le serveur est en cours d'exécution
if ! nc -z localhost 3000 >/dev/null 2>&1; then
  echo -e "${RED}[ERREUR] Le serveur n'est pas en cours d'exécution sur le port 3000${NC}"
  echo -e "${YELLOW}Démarrage du serveur...${NC}"
  
  # Démarrer le serveur en arrière-plan
  node server.js &
  SERVER_PID=$!
  
  # Attendre que le serveur démarre
  echo -e "${YELLOW}Attente du démarrage du serveur...${NC}"
  sleep 3
  
  if ! nc -z localhost 3000 >/dev/null 2>&1; then
    echo -e "${RED}[ERREUR] Impossible de démarrer le serveur${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Serveur démarré avec succès (PID: $SERVER_PID)${NC}"
else
  echo -e "${GREEN}[OK] Le serveur est en cours d'exécution sur le port 3000${NC}"
fi

# Vérifier que les dépendances sont installées
echo -e "${YELLOW}Vérification des dépendances...${NC}"
if ! npm list jest >/dev/null 2>&1 || ! npm list puppeteer >/dev/null 2>&1; then
  echo -e "${YELLOW}Installation des dépendances de test...${NC}"
  npm install --save-dev jest puppeteer
fi

# Exécuter les tests fonctionnels
echo -e "${YELLOW}Exécution des tests fonctionnels...${NC}"
npx jest tests/functional.test.js --verbose

# Si nous avons démarré le serveur, l'arrêter
if [ -n "$SERVER_PID" ]; then
  echo -e "${YELLOW}Arrêt du serveur (PID: $SERVER_PID)...${NC}"
  kill $SERVER_PID
  echo -e "${GREEN}Serveur arrêté${NC}"
fi

echo -e "${GREEN}Tests terminés${NC}"
