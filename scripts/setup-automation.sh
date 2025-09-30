#!/bin/bash

# 🚀 SETUP COMPLET AUTOMATISATION - GET WEEZ
# Script principal pour configurer tout le système d'automatisation

set -e

echo "🚀 Setup Automatisation Complète - Get Weez"
echo "============================================"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_step() { echo -e "${BLUE}📋 $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${PURPLE}ℹ️  $1${NC}"; }

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Vérifications préliminaires
check_prerequisites() {
    print_step "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier qu'on est dans un projet Git
    if [ ! -d ".git" ]; then
        print_error "Ce n'est pas un repository Git"
        print_info "Exécutez: git init && git remote add origin <URL>"
        exit 1
    fi
    
    print_success "Tous les prérequis sont satisfaits"
}

# Configuration des hooks Git
setup_git_hooks() {
    print_step "Configuration des hooks Git..."
    
    if [ -f "$SCRIPT_DIR/install-git-hooks.sh" ]; then
        chmod +x "$SCRIPT_DIR/install-git-hooks.sh"
        "$SCRIPT_DIR/install-git-hooks.sh"
    else
        print_error "Script d'installation des hooks Git non trouvé"
        return 1
    fi
}

# Configuration GitHub Actions
setup_github_actions() {
    print_step "Configuration des GitHub Actions..."
    
    # Vérifier que les workflows existent
    if [ -d ".github/workflows" ]; then
        local workflow_count=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
        print_success "$workflow_count workflow(s) GitHub Actions détecté(s)"
        
        # Lister les workflows
        for workflow in .github/workflows/*.yml; do
            if [ -f "$workflow" ]; then
                local name=$(basename "$workflow" .yml)
                print_info "  • $name"
            fi
        done
    else
        print_warning "Aucun workflow GitHub Actions trouvé"
    fi
}

# Configuration CodeRabbit  
setup_coderabbit() {
    print_step "Configuration de CodeRabbit..."
    
    if [ -f ".coderabbit.yaml" ]; then
        print_success "Configuration CodeRabbit trouvée"
        
        # Marquer comme configuré
        touch ".coderabbit-configured"
        
        print_info "CodeRabbit configuré pour:"
        print_info "  • Reviews automatiques sur les PR"
        print_info "  • Analyse du code spécifique à Get Weez"
        print_info "  • Instructions en français"
        print_info "  • Focus sur mobile et performance"
    else
        print_error "Configuration CodeRabbit (.coderabbit.yaml) non trouvée"
        return 1
    fi
}

# Configuration des scripts de backup
setup_backup_system() {
    print_step "Configuration du système de backup..."
    
    # Rendre le script de backup exécutable
    if [ -f "$SCRIPT_DIR/auto-backup.sh" ]; then
        chmod +x "$SCRIPT_DIR/auto-backup.sh"
        print_success "Script de backup configuré"
        
        # Test rapide du système de backup
        print_step "Test du système de backup..."
        if "$SCRIPT_DIR/auto-backup.sh" manual >/dev/null 2>&1; then
            print_success "Test de backup réussi"
        else
            print_warning "Test de backup échoué - vérifiez la configuration"
        fi
    else
        print_error "Script de backup auto-backup.sh non trouvé"
        return 1
    fi
    
    # Configuration des tâches cron suggérées
    print_step "Configuration des tâches automatiques suggérées..."
    
    cat << EOF > cron-suggestions.txt
# Suggestions de configuration crontab pour Get Weez
# Exécutez: crontab -e puis ajoutez ces lignes

# Backup quotidien à 2h du matin
0 2 * * * cd $PROJECT_ROOT && ./scripts/auto-backup.sh daily >> /tmp/backup.log 2>&1

# Backup hebdomadaire le dimanche à 3h du matin  
0 3 * * 0 cd $PROJECT_ROOT && ./scripts/auto-backup.sh weekly >> /tmp/backup.log 2>&1

# Backup mensuel le 1er de chaque mois à 4h du matin
0 4 1 * * cd $PROJECT_ROOT && ./scripts/auto-backup.sh monthly >> /tmp/backup.log 2>&1

# Backup incrémental toutes les 6 heures
0 */6 * * * cd $PROJECT_ROOT && ./scripts/auto-backup.sh incremental >> /tmp/backup.log 2>&1
EOF
    
    print_success "Suggestions de cron générées: cron-suggestions.txt"
}

# Configuration des secrets GitHub (guide)
setup_github_secrets() {
    print_step "Configuration des secrets GitHub..."
    
    cat << EOF > github-secrets-setup.md
# Configuration des Secrets GitHub pour Get Weez

## Secrets requis dans GitHub Repository Settings > Secrets and variables > Actions

### Pour le déploiement Vercel:
- \`VERCEL_TOKEN\`: Token d'API Vercel 
- \`VERCEL_ORG_ID\`: ID de votre organisation Vercel
- \`VERCEL_PROJECT_ID\`: ID du projet Vercel

### Pour CodeRabbit (optionnel):
- \`OPENAI_API_KEY\`: Votre clé API OpenAI pour les reviews avancées

### Pour les notifications (optionnel):
- \`SLACK_WEBHOOK_URL\`: URL du webhook Slack pour les notifications

## Comment obtenir ces valeurs:

### Vercel:
1. Aller sur vercel.com/account/tokens
2. Créer un nouveau token
3. Pour les IDs: \`vercel project ls\` avec Vercel CLI

### OpenAI:
1. Aller sur platform.openai.com/api-keys  
2. Créer une nouvelle clé API

## Configuration:
1. Aller dans votre repo GitHub
2. Settings > Secrets and variables > Actions
3. Cliquer "New repository secret"
4. Ajouter chaque secret avec sa valeur
EOF

    print_success "Guide de configuration des secrets créé: github-secrets-setup.md"
}

# Installation et configuration des dépendances
setup_dependencies() {
    print_step "Vérification des dépendances..."
    
    # Vérifier package.json
    if [ -f "package.json" ]; then
        print_success "package.json trouvé"
        
        # Installer les dépendances si node_modules n'existe pas
        if [ ! -d "node_modules" ]; then
            print_step "Installation des dépendances..."
            npm install
            print_success "Dépendances installées"
        fi
        
        # Vérifier les scripts disponibles
        print_info "Scripts npm disponibles:"
        npm run | grep -E "^\s+\w+" | awk '{print "  • " $1}' || true
        
    else
        print_error "package.json non trouvé"
        return 1
    fi
}

# Test complet du système
test_automation_system() {
    print_step "Test complet du système d'automatisation..."
    
    local tests_passed=0
    local tests_total=5
    
    # Test 1: Hooks Git
    if [ -x ".git/hooks/pre-commit" ] && [ -x ".git/hooks/post-commit" ]; then
        print_success "✓ Hooks Git installés"
        ((tests_passed++))
    else
        print_error "✗ Hooks Git manquants"
    fi
    
    # Test 2: GitHub Actions
    if [ -d ".github/workflows" ] && [ $(ls .github/workflows/*.yml 2>/dev/null | wc -l) -gt 0 ]; then
        print_success "✓ GitHub Actions configurés"
        ((tests_passed++))
    else
        print_error "✗ GitHub Actions manquants"  
    fi
    
    # Test 3: CodeRabbit
    if [ -f ".coderabbit.yaml" ]; then
        print_success "✓ CodeRabbit configuré"
        ((tests_passed++))
    else
        print_error "✗ CodeRabbit non configuré"
    fi
    
    # Test 4: Scripts de backup
    if [ -x "scripts/auto-backup.sh" ]; then
        print_success "✓ Système de backup configuré"
        ((tests_passed++))
    else
        print_error "✗ Système de backup manquant"
    fi
    
    # Test 5: Build du projet
    if npm run build >/dev/null 2>&1; then
        print_success "✓ Build du projet fonctionnel"
        ((tests_passed++))
    else
        print_error "✗ Build du projet échoué"
    fi
    
    echo ""
    print_info "Tests réussis: $tests_passed/$tests_total"
    
    if [ $tests_passed -eq $tests_total ]; then
        print_success "🎉 Tous les tests sont passés !"
        return 0
    else
        print_warning "Certains tests ont échoué - vérifiez la configuration"
        return 1
    fi
}

# Générer un résumé de configuration
generate_setup_summary() {
    print_step "Génération du résumé de configuration..."
    
    local summary_file="automation-setup-summary.md"
    
    cat << EOF > "$summary_file"
# 🚀 Résumé de Configuration - Automatisation Get Weez

## Configuration complétée le $(date)

### ✅ Composants installés:

#### 🔧 Hooks Git
- **pre-commit**: Vérifications qualité code, linting, détection secrets
- **post-commit**: Backups automatiques, sync remote, statistiques

#### 🤖 GitHub Actions  
- **CI/CD Pipeline**: Tests, build, déploiement automatique
- **CodeRabbit Review**: Reviews de code IA sur les PRs
- **Backups planifiés**: Sauvegarde quotidienne automatique

#### 💾 Système de Backup
- **Types**: Daily, weekly, monthly, incremental, manual
- **Rotation**: Nettoyage automatique des anciens backups
- **Localisation**: \`../get-weez-backups/\`

#### 🤖 CodeRabbit
- **Configuration**: Personnalisée pour Get Weez
- **Langue**: Français
- **Focus**: Mobile, performance, sécurité
- **Instructions**: Spécifiques par type de fichier

### 📋 Prochaines étapes:

1. **Configurer les secrets GitHub** (voir github-secrets-setup.md)
2. **Planifier les backups automatiques** (voir cron-suggestions.txt)
3. **Tester avec un premier commit**
4. **Créer votre première Pull Request** pour tester CodeRabbit

### 🛠️ Commandes utiles:

\`\`\`bash
# Backup manuel
./scripts/auto-backup.sh manual

# Test des hooks
git add . && git commit -m "test hooks"

# Vérifier les workflows
ls -la .github/workflows/

# Voir les backups
ls -la ../get-weez-backups/
\`\`\`

### 📊 Statistiques du projet:
- **Fichiers JS/TS**: $(find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)
- **Lignes de code**: $(find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "?")
- **Taille du projet**: $(du -sh . --exclude=node_modules 2>/dev/null | cut -f1 || echo "?")

### 🔧 Support:
- Vérifiez les logs dans \`/tmp/backup.log\`
- Consultez la documentation GitHub Actions dans le repo
- CodeRabbit apparaîtra automatiquement sur les PRs

---
*Configuration générée automatiquement par setup-automation.sh*
EOF

    print_success "Résumé créé: $summary_file"
}

# PROGRAMME PRINCIPAL
main() {
    cd "$PROJECT_ROOT"
    
    print_step "Démarrage du setup d'automatisation complet..."
    
    # Étapes de configuration
    check_prerequisites
    setup_dependencies
    setup_git_hooks
    setup_github_actions  
    setup_coderabbit
    setup_backup_system
    setup_github_secrets
    
    # Tests et finalisation
    echo ""
    test_automation_system
    generate_setup_summary
    
    # Message final
    echo ""
    echo "🎉🚀🎯 CONFIGURATION TERMINÉE AVEC SUCCÈS ! 🎯🚀🎉"
    echo "=================================================="
    print_success "Automatisation complète configurée pour Get Weez"
    echo ""
    print_step "📋 Résumé:"
    echo "  ✅ Hooks Git installés et fonctionnels"
    echo "  ✅ GitHub Actions configurés (CI/CD + CodeRabbit)"
    echo "  ✅ Système de backup automatique opérationnel"
    echo "  ✅ CodeRabbit prêt pour les reviews de code"
    echo ""
    print_step "📁 Fichiers créés:"
    echo "  • automation-setup-summary.md - Résumé complet"
    echo "  • github-secrets-setup.md - Guide configuration secrets"  
    echo "  • cron-suggestions.txt - Suggestions de planification"
    echo ""
    print_warning "🔧 Actions manuelles requises:"
    echo "  1. Configurez les secrets GitHub (voir github-secrets-setup.md)"
    echo "  2. Planifiez les backups avec cron (voir cron-suggestions.txt)"
    echo "  3. Effectuez votre premier commit pour tester les hooks"
    echo ""
    print_success "🚀 Votre système de sauvegarde et review automatique est prêt !"
}

# Gestion des signaux
trap 'print_error "Setup interrompu par l'\''utilisateur"; exit 130' INT TERM

# Point d'entrée  
main "$@"