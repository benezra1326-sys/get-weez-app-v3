#!/bin/bash

# GetWeez Code Review System - Docker Deployment Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    log_warning "Fichier .env non trouvé, copie de .env.example..."
    cp .env.example .env
    log_info "Veuillez configurer le fichier $ENV_FILE avant de continuer"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

# Function to check Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon n'est pas en cours d'exécution"
        exit 1
    fi
    
    log_success "Docker est prêt"
}

# Function to build images
build_images() {
    log_info "Construction des images Docker..."
    
    docker build -f Dockerfile.webhook -t getweez/webhook-service:latest .
    docker build -f Dockerfile.worker -t getweez/code-review-worker:latest .
    
    log_success "Images construites avec succès"
}

# Function to start services
start_services() {
    local profile=${1:-""}
    
    log_info "Démarrage des services..."
    
    if [ -n "$profile" ]; then
        docker-compose --profile $profile up -d
    else
        docker-compose up -d
    fi
    
    log_info "Attente du démarrage des services..."
    sleep 15
    
    # Check service health
    check_service_health
}

# Function to check service health
check_service_health() {
    log_info "Vérification de l'état des services..."
    
    # Check RabbitMQ
    if curl -s http://localhost:15672 > /dev/null; then
        log_success "✅ RabbitMQ Management UI accessible"
    else
        log_warning "⚠️  RabbitMQ Management UI non accessible"
    fi
    
    # Check Redis
    if docker exec getweez_redis redis-cli ping 2>/dev/null | grep -q PONG; then
        log_success "✅ Redis fonctionne"
    else
        log_warning "⚠️  Redis non accessible"
    fi
    
    # Check Webhook Service
    if curl -s http://localhost:${WEBHOOK_PORT:-3001}/health > /dev/null; then
        log_success "✅ Webhook Service accessible"
    else
        log_warning "⚠️  Webhook Service non accessible"
    fi
    
    # Check Worker
    if docker ps | grep -q getweez_code_review_worker; then
        log_success "✅ Code Review Worker en cours d'exécution"
    else
        log_warning "⚠️  Code Review Worker non démarré"
    fi
}

# Function to show status
show_status() {
    echo
    log_info "État des services GetWeez Code Review System:"
    echo
    
    docker-compose ps
    
    echo
    log_info "Interfaces Web disponibles:"
    echo "🌐 RabbitMQ Management: http://localhost:15672 (admin/GetWeez2024!)"
    echo "🌐 Webhook Service: http://localhost:${WEBHOOK_PORT:-3001}"
    if docker ps --format "table {{.Names}}" | grep -q grafana; then
        echo "📊 Grafana: http://localhost:3000 (admin/admin)"
    fi
    if docker ps --format "table {{.Names}}" | grep -q prometheus; then
        echo "📊 Prometheus: http://localhost:9090"
    fi
    echo
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    
    if [ -z "$service" ]; then
        log_info "Services disponibles pour les logs:"
        echo "  - webhook-service"
        echo "  - code-review-worker"
        echo "  - rabbitmq"
        echo "  - redis"
        return
    fi
    
    case $service in
        webhook|webhook-service)
            docker-compose logs -f webhook-service
            ;;
        worker|code-review-worker)
            docker-compose logs -f code-review-worker
            ;;
        rabbitmq)
            docker-compose logs -f rabbitmq
            ;;
        redis)
            docker-compose logs -f redis
            ;;
        all)
            docker-compose logs -f
            ;;
        *)
            log_error "Service inconnu: $service"
            show_logs
            ;;
    esac
}

# Function to stop services
stop_services() {
    log_info "Arrêt des services..."
    docker-compose down
    log_success "Services arrêtés"
}

# Function to cleanup
cleanup() {
    log_info "Nettoyage complet..."
    docker-compose down -v --rmi local
    docker system prune -f
    log_success "Nettoyage terminé"
}

# Function to backup data
backup() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    log_info "Sauvegarde vers $backup_dir..."
    
    # Export RabbitMQ definitions
    curl -u getweez_admin:${RABBITMQ_PASSWORD:-GetWeez2024!} \
         http://localhost:15672/api/definitions \
         -o "$backup_dir/rabbitmq-definitions.json"
    
    # Backup Redis data
    docker exec getweez_redis redis-cli --rdb - > "$backup_dir/redis-dump.rdb"
    
    # Copy logs
    cp -r logs "$backup_dir/"
    
    log_success "Sauvegarde terminée: $backup_dir"
}

# Function to run tests
run_tests() {
    log_info "Exécution des tests..."
    
    # Test webhook endpoint
    if curl -X POST http://localhost:${WEBHOOK_PORT:-3001}/trigger/manual \
            -H "Content-Type: application/json" \
            -d '{
              "repository": {
                "name": "test/repo",
                "clone_url": "https://github.com/test/repo.git"
              },
              "type": "push"
            }' > /dev/null 2>&1; then
        log_success "✅ Test webhook réussi"
    else
        log_error "❌ Test webhook échoué"
    fi
    
    # Check queues
    local queue_count=$(curl -s -u getweez_admin:${RABBITMQ_PASSWORD:-GetWeez2024!} \
                       http://localhost:15672/api/queues/getweez | \
                       jq length)
    
    if [ "$queue_count" -gt 0 ]; then
        log_success "✅ Queues RabbitMQ configurées ($queue_count queues)"
    else
        log_error "❌ Aucune queue RabbitMQ trouvée"
    fi
}

# Function to update system
update() {
    log_info "Mise à jour du système..."
    
    # Pull latest images
    docker-compose pull
    
    # Rebuild custom images
    build_images
    
    # Restart services
    docker-compose up -d --force-recreate
    
    log_success "Mise à jour terminée"
}

# Main script logic
case ${1:-help} in
    build)
        check_docker
        build_images
        ;;
    start)
        check_docker
        build_images
        start_services
        show_status
        ;;
    start-monitoring)
        check_docker
        build_images
        start_services "monitoring"
        show_status
        ;;
    start-prod)
        check_docker
        build_images
        start_services "production"
        show_status
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs $2
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        build_images
        start_services
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    backup)
        backup
        ;;
    test)
        run_tests
        ;;
    update)
        update
        ;;
    help|*)
        echo "Usage: $0 {build|start|start-monitoring|start-prod|status|logs|stop|restart|cleanup|backup|test|update|help}"
        echo
        echo "Commands:"
        echo "  build            - Construire les images Docker"
        echo "  start            - Démarrer tous les services"
        echo "  start-monitoring - Démarrer avec Prometheus/Grafana"
        echo "  start-prod       - Démarrer avec Nginx (production)"
        echo "  status           - Afficher l'état des services"
        echo "  logs [service]   - Afficher les logs"
        echo "  stop             - Arrêter tous les services"
        echo "  restart          - Redémarrer tous les services"
        echo "  cleanup          - Nettoyage complet (ATTENTION: supprime les données)"
        echo "  backup           - Sauvegarder les données"
        echo "  test             - Tester le système"
        echo "  update           - Mettre à jour le système"
        echo "  help             - Afficher cette aide"
        echo
        echo "Examples:"
        echo "  $0 start                    # Démarrage standard"
        echo "  $0 logs webhook            # Voir les logs du webhook"
        echo "  $0 start-monitoring        # Avec monitoring Grafana"
        exit 1
        ;;
esac