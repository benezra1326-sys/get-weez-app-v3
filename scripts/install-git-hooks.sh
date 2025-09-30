#!/bin/bash

# 🔧 INSTALLATION DES HOOKS GIT - GET WEEZ
# Script pour installer automatiquement les hooks Git

set -e

echo "🔧 Installation des hooks Git pour Get Weez"
echo "==========================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier qu'on est dans un repo Git
if [ ! -d ".git" ]; then
    print_error "Ce n'est pas un repository Git"
    print_error "Initialisez d'abord avec: git init"
    exit 1
fi

print_success "Repository Git détecté"

# Créer le répertoire des hooks s'il n'existe pas
HOOKS_DIR=".git/hooks"
if [ ! -d "$HOOKS_DIR" ]; then
    mkdir -p "$HOOKS_DIR"
    print_step "Répertoire des hooks créé"
fi

# Copier les hooks depuis notre dossier vers .git/hooks
HOOKS_TO_INSTALL=("pre-commit" "post-commit")

print_step "Installation des hooks..."

for HOOK in "${HOOKS_TO_INSTALL[@]}"; do
    if [ -f "hooks/$HOOK" ]; then
        # Faire une sauvegarde de l'ancien hook s'il existe
        if [ -f "$HOOKS_DIR/$HOOK" ]; then
            cp "$HOOKS_DIR/$HOOK" "$HOOKS_DIR/$HOOK.backup.$(date +%Y%m%d_%H%M%S)"
            print_warning "Ancien hook $HOOK sauvegardé"
        fi
        
        # Copier le nouveau hook
        cp "hooks/$HOOK" "$HOOKS_DIR/$HOOK"
        chmod +x "$HOOKS_DIR/$HOOK"
        print_success "Hook $HOOK installé et rendu exécutable"
    else
        print_error "Hook hooks/$HOOK non trouvé"
        exit 1
    fi
done

# Tester les hooks
print_step "Test des hooks installés..."

for HOOK in "${HOOKS_TO_INSTALL[@]}"; do
    if [ -x "$HOOKS_DIR/$HOOK" ]; then
        print_success "Hook $HOOK est exécutable"
    else
        print_error "Hook $HOOK n'est pas exécutable"
        exit 1
    fi
done

# Créer le fichier de configuration des hooks
cat > ".git/hooks/hooks-config.json" << EOF
{
  "version": "1.0.0",
  "installed_date": "$(date -Idate)",
  "project": "get-weez",
  "hooks": {
    "pre-commit": {
      "enabled": true,
      "description": "Code quality checks and linting"
    },
    "post-commit": {
      "enabled": true,
      "description": "Automatic backups and remote sync"
    }
  },
  "settings": {
    "auto_backup": true,
    "auto_push_main": true,
    "max_backups": 10
  }
}
EOF

print_success "Configuration des hooks créée"

# Créer le répertoire de backups
mkdir -p "backups"
print_step "Répertoire de backups créé: backups/"

# Message final
echo ""
print_success "🎉 Installation des hooks Git terminée !"
echo ""
print_step "Hooks installés:"
echo "  • pre-commit: Vérification qualité code avant commit"
echo "  • post-commit: Backups automatiques après commit"
echo ""
print_step "Configuration:"
echo "  • Backups automatiques: ✅"
echo "  • Push automatique (main): ✅" 
echo "  • Vérifications ESLint: ✅"
echo "  • Détection de secrets: ✅"
echo ""
print_warning "Pour désactiver un hook temporairement:"
echo "  mv .git/hooks/hook-name .git/hooks/hook-name.disabled"
echo ""
print_success "Prêt à commiter avec les vérifications automatiques !"

# Test avec un commit fictif (si demandé)
read -p "🧪 Voulez-vous tester les hooks maintenant ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Test des hooks en cours..."
    
    # Créer un petit fichier de test
    echo "// Test file pour validation des hooks" > "test-hooks-temp.js"
    git add "test-hooks-temp.js"
    
    print_step "Simulation du pre-commit hook..."
    .git/hooks/pre-commit && print_success "Pre-commit hook fonctionne" || print_error "Erreur pre-commit hook"
    
    # Nettoyer le test
    git reset HEAD "test-hooks-temp.js" 2>/dev/null || true
    rm -f "test-hooks-temp.js"
    
    print_success "Test terminé"
fi

exit 0