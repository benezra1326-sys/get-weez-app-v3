#!/bin/bash

# 💾 SYSTÈME DE BACKUP AUTOMATIQUE - GET WEEZ
# Script avancé pour créer des backups intelligents avec rotation

set -e

echo "💾 Système de backup automatique Get Weez"
echo "========================================"

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="${PROJECT_ROOT}/backups/get-weez-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATE_HOUR=$(date +"%Y%m%d_%H")

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

# Fonction pour obtenir la taille d'un répertoire
get_size() {
    du -sh "$1" 2>/dev/null | cut -f1 || echo "?"
}

# Fonction pour vérifier l'espace disque
check_disk_space() {
    local required_mb=100
    local available_kb=$(df . | tail -1 | awk '{print $4}')
    local available_mb=$((available_kb / 1024))
    
    if [ "$available_mb" -lt "$required_mb" ]; then
        print_error "Espace disque insuffisant: ${available_mb}MB disponible, ${required_mb}MB requis"
        return 1
    fi
    print_success "Espace disque OK: ${available_mb}MB disponible"
}

# Fonction de cleanup des anciens backups
cleanup_old_backups() {
    local backup_type="$1"
    local keep_count="$2"
    local pattern="$3"
    
    print_step "Nettoyage des anciens backups $backup_type..."
    
    if [ -d "$BACKUP_ROOT/$backup_type" ]; then
        cd "$BACKUP_ROOT/$backup_type"
        local count=$(ls -1 $pattern 2>/dev/null | wc -l)
        
        if [ "$count" -gt "$keep_count" ]; then
            local to_delete=$((count - keep_count))
            print_info "Suppression de $to_delete ancien(s) backup(s) $backup_type"
            ls -1t $pattern | tail -n "$to_delete" | xargs -r rm -f
        fi
        
        local remaining=$(ls -1 $pattern 2>/dev/null | wc -l)
        print_success "Backups $backup_type conservés: $remaining/$keep_count"
        cd "$PROJECT_ROOT"
    fi
}

# Fonction principale de backup
create_backup() {
    local backup_type="$1"
    local backup_dir="$BACKUP_ROOT/$backup_type"
    local backup_name="get-weez_${backup_type}_${TIMESTAMP}"
    
    mkdir -p "$backup_dir"
    
    print_step "Création du backup $backup_type..."
    
    # Créer l'archive avec exclusions intelligentes
    tar --exclude='node_modules' \
        --exclude='.git' \
        --exclude='.next' \
        --exclude='backups' \
        --exclude='get-weez-backups' \
        --exclude='*.log' \
        --exclude='.vercel' \
        --exclude='coverage' \
        --exclude='.nyc_output' \
        --exclude='dist' \
        --exclude='out' \
        --exclude='.DS_Store' \
        --exclude='Thumbs.db' \
        --exclude='*.swp' \
        --exclude='*.swo' \
        -czf "$backup_dir/$backup_name.tar.gz" \
        -C "$PROJECT_ROOT" \
        . 2>/dev/null || {
        print_error "Impossible de créer l'archive $backup_type"
        return 1
    }
    
    if [ -f "$backup_dir/$backup_name.tar.gz" ]; then
        local size=$(get_size "$backup_dir/$backup_name.tar.gz")
        print_success "Backup $backup_type créé: $backup_name.tar.gz ($size)"
        
        # Créer un fichier d'info
        cat > "$backup_dir/$backup_name.info" << EOF
Backup Get Weez - $backup_type
=============================
Date: $(date)
Taille: $size
Commit: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
Branche: $(git branch --show-current 2>/dev/null || echo "N/A")
Author: $(git config user.name 2>/dev/null || echo "Unknown")
Type: $backup_type
EOF
        
        return 0
    else
        print_error "Échec de création du backup $backup_type"
        return 1
    fi
}

# Fonction pour créer un backup incrémental
create_incremental_backup() {
    local last_backup_file="$BACKUP_ROOT/.last_full_backup"
    local backup_dir="$BACKUP_ROOT/incremental"
    local backup_name="get-weez_incremental_${TIMESTAMP}"
    
    mkdir -p "$backup_dir"
    
    print_step "Création du backup incrémental..."
    
    # Trouver les fichiers modifiés depuis le dernier backup complet
    local find_newer=""
    if [ -f "$last_backup_file" ]; then
        local last_backup=$(cat "$last_backup_file")
        find_newer="-newer $last_backup"
        print_info "Backup depuis: $last_backup"
    else
        print_warning "Aucun backup complet précédent, création d'un backup complet"
        create_backup "full"
        echo "$(date)" > "$last_backup_file"
        return
    fi
    
    # Créer la liste des fichiers modifiés
    find . $find_newer \
        -type f \
        -not -path './node_modules/*' \
        -not -path './.git/*' \
        -not -path './.next/*' \
        -not -path './backups/*' \
        -not -path './get-weez-backups/*' \
        -not -name '*.log' \
        > "$backup_dir/$backup_name.list"
    
    local file_count=$(cat "$backup_dir/$backup_name.list" | wc -l)
    
    if [ "$file_count" -eq 0 ]; then
        print_info "Aucun fichier modifié depuis le dernier backup"
        rm "$backup_dir/$backup_name.list"
        return 0
    fi
    
    print_info "Fichiers modifiés: $file_count"
    
    # Créer l'archive incrémentale
    tar -czf "$backup_dir/$backup_name.tar.gz" -T "$backup_dir/$backup_name.list" 2>/dev/null || {
        print_error "Impossible de créer le backup incrémental"
        return 1
    }
    
    local size=$(get_size "$backup_dir/$backup_name.tar.gz")
    print_success "Backup incrémental créé: $backup_name.tar.gz ($size)"
}

# Fonction pour synchroniser avec Git remote
sync_with_remote() {
    print_step "Synchronisation avec le remote Git..."
    
    if git remote | grep -q origin; then
        local branch=$(git branch --show-current)
        local remote_url=$(git remote get-url origin)
        
        print_info "Remote: $remote_url"
        print_info "Branche: $branch"
        
        # Fetch les dernières modifications
        git fetch origin --quiet 2>/dev/null || {
            print_warning "Impossible de fetch depuis le remote"
            return 1
        }
        
        # Vérifier s'il y a des commits à pousser
        local unpushed=$(git log origin/$branch..HEAD --oneline 2>/dev/null | wc -l)
        if [ "$unpushed" -gt 0 ]; then
            print_warning "$unpushed commit(s) non poussé(s) vers le remote"
            print_info "Exécutez: git push origin $branch"
        else
            print_success "Repository synchronisé avec le remote"
        fi
    else
        print_warning "Aucun remote Git configuré"
    fi
}

# Fonction pour générer un rapport de backup
generate_backup_report() {
    local report_file="$BACKUP_ROOT/backup-report-$(date +%Y%m).txt"
    
    print_step "Génération du rapport de backup..."
    
    cat > "$report_file" << EOF
RAPPORT DE BACKUP GET WEEZ
=========================
Date du rapport: $(date)
Répertoire des backups: $BACKUP_ROOT

RÉSUMÉ DES BACKUPS:
$(if [ -d "$BACKUP_ROOT/daily" ]; then echo "📅 Backups quotidiens: $(ls $BACKUP_ROOT/daily/*.tar.gz 2>/dev/null | wc -l)"; fi)
$(if [ -d "$BACKUP_ROOT/weekly" ]; then echo "📅 Backups hebdomadaires: $(ls $BACKUP_ROOT/weekly/*.tar.gz 2>/dev/null | wc -l)"; fi)
$(if [ -d "$BACKUP_ROOT/monthly" ]; then echo "📅 Backups mensuels: $(ls $BACKUP_ROOT/monthly/*.tar.gz 2>/dev/null | wc -l)"; fi)
$(if [ -d "$BACKUP_ROOT/manual" ]; then echo "👤 Backups manuels: $(ls $BACKUP_ROOT/manual/*.tar.gz 2>/dev/null | wc -l)"; fi)
$(if [ -d "$BACKUP_ROOT/incremental" ]; then echo "🔄 Backups incrémentiels: $(ls $BACKUP_ROOT/incremental/*.tar.gz 2>/dev/null | wc -l)"; fi)

ESPACE DISQUE:
Taille totale des backups: $(get_size "$BACKUP_ROOT")
$(df -h "$BACKUP_ROOT" | tail -1 | awk '{print "Espace disponible: " $4 " (" $5 " utilisé)"}')

ÉTAT DU PROJET:
Répertoire: $PROJECT_ROOT
Taille du projet: $(get_size "$PROJECT_ROOT")
$(git log -1 --pretty="Dernier commit: %h - %s (%an, %ar)" 2>/dev/null || echo "Git non disponible")
$(git status --porcelain 2>/dev/null | wc -l | awk '{if($1>0) print "Fichiers modifiés: " $1; else print "Aucune modification en cours"}')

EOF

    print_success "Rapport généré: $report_file"
}

# PROGRAMME PRINCIPAL
main() {
    print_step "Démarrage du système de backup automatique..."
    
    # Vérifications préliminaires
    check_disk_space || exit 1
    
    cd "$PROJECT_ROOT"
    
    # Déterminer le type de backup selon les arguments
    local backup_type="${1:-daily}"
    
    case "$backup_type" in
        "daily")
            create_backup "daily"
            cleanup_old_backups "daily" 7 "get-weez_daily_*.tar.gz"
            ;;
        "weekly") 
            create_backup "weekly"
            cleanup_old_backups "weekly" 4 "get-weez_weekly_*.tar.gz"
            ;;
        "monthly")
            create_backup "monthly" 
            cleanup_old_backups "monthly" 12 "get-weez_monthly_*.tar.gz"
            echo "$(date)" > "$BACKUP_ROOT/.last_full_backup"
            ;;
        "manual")
            create_backup "manual"
            cleanup_old_backups "manual" 5 "get-weez_manual_*.tar.gz"
            ;;
        "incremental")
            create_incremental_backup
            cleanup_old_backups "incremental" 14 "get-weez_incremental_*.tar.gz"
            ;;
        "full")
            create_backup "full"
            echo "$(date)" > "$BACKUP_ROOT/.last_full_backup"
            ;;
        *)
            print_error "Type de backup non reconnu: $backup_type"
            print_info "Types supportés: daily, weekly, monthly, manual, incremental, full"
            exit 1
            ;;
    esac
    
    # Actions communes
    sync_with_remote
    generate_backup_report
    
    # Résumé final
    echo ""
    print_success "🎉 Backup automatique terminé avec succès !"
    print_info "📁 Backups stockés dans: $BACKUP_ROOT"
    print_info "📊 Espace utilisé: $(get_size "$BACKUP_ROOT")"
    
    # Affichage des prochaines étapes recommandées
    echo ""
    print_step "💡 Prochaines étapes recommandées:"
    echo "  • Vérifier les backups: ls -la $BACKUP_ROOT/"
    echo "  • Tester la restauration: tar -tzf <backup.tar.gz>"
    echo "  • Configurer la planification: crontab -e"
    echo "  • Synchroniser avec le cloud si nécessaire"
}

# Gestion des signaux pour cleanup
trap 'print_error "Backup interrompu par l'\''utilisateur"; exit 130' INT TERM

# Point d'entrée
main "$@"