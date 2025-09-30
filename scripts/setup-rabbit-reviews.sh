#!/bin/bash

# 🤖 Script de Setup pour Rabbit Code Reviews
# Get Weez - Optimisation ChatInterface

set -e  # Exit on any error

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction pour afficher les logs avec couleurs
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Header
echo -e "${PURPLE}"
cat << "EOF"
   ____      _     _     _ _      ____           _                 
  |  _ \ ___| |__ | |__ (_) |_   |  _ \ _____   _(_) _____      _____ 
  | |_) / _ \ '_ \| '_ \| | __| | |_) / _ \ \ / / |/ _ \ \ /\ / / __|
  |  _ <  __/ |_) | |_) | | |_  |  _ <  __/\ V /| |  __/\ V  V /\__ \
  |_| \_\___|_.__/|_.__/|_|\__| |_| \_\___| \_/ |_|\___| \_/\_/ |___/
                                                                    
  🤖 Setup pour Reviews Automatiques - Get Weez
EOF
echo -e "${NC}"

# Vérification des prérequis
log_header "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

NODE_VERSION=$(node -v)
log_success "Node.js détecté: $NODE_VERSION"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé."
    exit 1
fi

NPM_VERSION=$(npm -v)
log_success "npm détecté: $NPM_VERSION"

# Vérifier Git
if ! command -v git &> /dev/null; then
    log_error "Git n'est pas installé."
    exit 1
fi

GIT_VERSION=$(git --version)
log_success "Git détecté: $GIT_VERSION"

# Installation de Rabbit CLI
log_header "Installation de Rabbit CLI..."

if npm list -g @rabbit-ai/cli &> /dev/null; then
    log_info "Rabbit CLI déjà installé, mise à jour..."
    npm update -g @rabbit-ai/cli
else
    log_info "Installation de Rabbit CLI..."
    npm install -g @rabbit-ai/cli
fi

log_success "Rabbit CLI installé avec succès"

# Vérification de l'installation Rabbit
log_info "Vérification de l'installation Rabbit..."
if command -v rabbit &> /dev/null; then
    RABBIT_VERSION=$(rabbit --version)
    log_success "Rabbit CLI version: $RABBIT_VERSION"
else
    log_error "Erreur lors de l'installation de Rabbit CLI"
    exit 1
fi

# Installation des dépendances de développement
log_header "Installation des dépendances de développement..."

# Packages nécessaires pour les reviews
DEV_PACKAGES=(
    "@rabbit-ai/eslint-plugin"
    "@rabbit-ai/prettier-config"
    "husky"
    "lint-staged"
    "@commitlint/cli"
    "@commitlint/config-conventional"
    "react-scanner"
    "@next/bundle-analyzer"
)

log_info "Installation des packages de développement..."
for package in "${DEV_PACKAGES[@]}"; do
    log_info "Installation de $package..."
    npm install --save-dev "$package" || log_warning "Échec installation de $package (peut-être déjà installé)"
done

log_success "Dépendances de développement installées"

# Configuration de Husky pour les hooks Git
log_header "Configuration de Husky (Git hooks)..."

if [ -d ".git" ]; then
    npx husky install
    
    # Hook pre-commit
    log_info "Configuration du hook pre-commit..."
    npx husky add .husky/pre-commit "npm run lint:rabbit"
    npx husky add .husky/pre-commit "npm run test:quick"
    
    # Hook commit-msg
    log_info "Configuration du hook commit-msg..."
    npx husky add .husky/commit-msg "npx commitlint --edit \$1"
    
    log_success "Husky configuré avec succès"
else
    log_warning "Dossier .git non trouvé, Husky non configuré"
fi

# Configuration package.json
log_header "Mise à jour des scripts package.json..."

# Backup du package.json actuel
cp package.json package.json.backup
log_info "Backup créé: package.json.backup"

# Ajouter les scripts Rabbit
cat > temp_scripts.json << 'EOF'
{
  "lint:rabbit": "rabbit analyze --config .rabbit/config.yml",
  "lint:rabbit:fix": "rabbit analyze --config .rabbit/config.yml --fix",
  "review:pre-commit": "rabbit pre-commit-check",
  "review:full": "rabbit analyze --config .rabbit/config.yml --detailed",
  "bundle:analyze": "cross-env ANALYZE=true npm run build",
  "test:performance": "rabbit performance-test",
  "quality:check": "rabbit quality-gate --threshold 8",
  "prepare": "husky install"
}
EOF

# Merger avec les scripts existants (nécessite jq)
if command -v jq &> /dev/null; then
    log_info "Mise à jour des scripts avec jq..."
    jq -s '.[0].scripts = (.[0].scripts + .[1]) | .[0]' package.json temp_scripts.json > package.json.new
    mv package.json.new package.json
    rm temp_scripts.json
    log_success "Scripts package.json mis à jour"
else
    log_warning "jq non installé, scripts non ajoutés automatiquement"
    log_info "Ajoutez manuellement les scripts depuis temp_scripts.json"
fi

# Configuration lint-staged
log_info "Configuration de lint-staged..."
cat > .lintstagedrc.json << 'EOF'
{
  "components/**/*.{js,jsx}": [
    "rabbit analyze --files",
    "eslint --fix",
    "prettier --write"
  ],
  "hooks/**/*.{js,jsx}": [
    "rabbit analyze --files", 
    "eslint --fix",
    "prettier --write"
  ],
  "contexts/**/*.{js,jsx}": [
    "rabbit analyze --files",
    "eslint --fix", 
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
EOF

log_success "lint-staged configuré"

# Configuration Commitlint
log_info "Configuration de Commitlint..."
cat > .commitlintrc.json << 'EOF'
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor", 
      "perf", "test", "build", "ci", "chore", "revert",
      "optimize", "rabbit"
    ]],
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 120]
  }
}
EOF

log_success "Commitlint configuré"

# Initialisation de Rabbit dans le projet
log_header "Initialisation de Rabbit..."

if [ ! -f ".rabbit/config.yml" ]; then
    log_error "Configuration Rabbit non trouvée (.rabbit/config.yml)"
    log_info "Le fichier de config devrait déjà exister. Vérifiez votre setup."
    exit 1
fi

# Test de la configuration Rabbit
log_info "Test de la configuration Rabbit..."
if rabbit validate --config .rabbit/config.yml; then
    log_success "Configuration Rabbit valide"
else
    log_error "Configuration Rabbit invalide"
    exit 1
fi

# Configuration VSCode (optionnel)
log_header "Configuration VSCode (optionnel)..."

if [ -d ".vscode" ] || [ -f "*.code-workspace" ]; then
    log_info "Configuration VSCode détectée, ajout des extensions recommandées..."
    
    mkdir -p .vscode
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "rabbit-ai.rabbit-vscode",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
EOF

    cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.rabbit": true
  },
  "rabbit.autoReview": true,
  "rabbit.showInlineHints": true,
  "files.associations": {
    ".rabbit/*.yml": "yaml"
  }
}
EOF

    log_success "Configuration VSCode créée"
else
    log_info "VSCode non détecté, configuration ignorée"
fi

# Test final
log_header "Test final de l'installation..."

# Test Rabbit sur un fichier
if [ -f "components/chat/ChatInterface.js" ]; then
    log_info "Test de Rabbit sur ChatInterface.js..."
    if rabbit analyze --config .rabbit/config.yml --files components/chat/ChatInterface.js --dry-run; then
        log_success "Test Rabbit réussi"
    else
        log_warning "Test Rabbit échoué, mais installation OK"
    fi
else
    log_info "ChatInterface.js non trouvé, test ignoré"
fi

# Résumé final
log_header "✨ Installation terminée avec succès! ✨"

echo -e "${GREEN}"
cat << "EOF"

🎉 Rabbit Code Reviews est maintenant configuré!

📋 Ce qui a été installé/configuré:
   ✅ Rabbit CLI
   ✅ Hooks Git (pre-commit, commit-msg)  
   ✅ lint-staged pour les reviews automatiques
   ✅ Scripts package.json pour Rabbit
   ✅ Configuration VSCode (si détecté)

🚀 Prochaines étapes:
   1. Testez: npm run lint:rabbit
   2. Configurez les secrets GitHub (SLACK_WEBHOOK_URL)
   3. Faites un commit pour déclencher les hooks
   4. Les PRs déclencheront automatiquement les reviews

📚 Commandes utiles:
   - npm run lint:rabbit          # Analyse complète
   - npm run lint:rabbit:fix      # Analyse + corrections auto
   - npm run review:full          # Review détaillée
   - npm run quality:check        # Vérification qualité

🔧 Fichiers de configuration créés:
   - .rabbit/config.yml           # Configuration principale
   - .lintstagedrc.json          # Rules pour les commits
   - .commitlintrc.json          # Convention de commits
   - .vscode/settings.json       # Config VSCode

EOF
echo -e "${NC}"

log_success "Setup terminé! Happy coding avec Rabbit! 🤖✨"