#!/bin/bash

# Script pour lancer les tests avec les variables d'environnement

# Charger les variables depuis .env.local
if [ -f .env.local ]; then
  echo "📋 Chargement de .env.local..."
  export $(cat .env.local | grep -v '^#' | xargs)
else
  echo "⚠️  Fichier .env.local non trouvé"
fi

# Lancer les tests
echo ""
node tests/run-gliitz-tests.js

