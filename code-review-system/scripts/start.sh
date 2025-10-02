#!/bin/bash

# Script de démarrage GetWeez Code Review System
# Usage: ./scripts/start.sh [service_name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f ".env" ]; then
    log_warning "Fichier .env non trouvé, copie de .env.example..."
    cp .env.example .env
    log_info "Veuillez configurer le fichier .env avant de continuer"
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Create necessary directories
mkdir -p logs
mkdir -p temp-repos

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    
    if nc -z localhost $port 2>/dev/null; then
        log_success "$service_name est déjà en cours d'exécution sur le port $port"
        return 0
    else
        return 1
    fi
}

# Function to start RabbitMQ and Redis
start_infrastructure() {
    log_info "Démarrage de l'infrastructure (RabbitMQ & Redis)..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker n'est pas en cours d'exécution"
        exit 1
    fi
    
    # Start RabbitMQ and Redis
    docker-compose -f ../docker-compose.rabbitmq.yml up -d
    
    log_info "Attente du démarrage des services..."
    sleep 10
    
    # Check RabbitMQ
    if check_service "RabbitMQ" 5672; then
        log_success "RabbitMQ démarré avec succès"
        log_info "Interface d'administration: http://localhost:15672 (admin/GetWeez2024!)"
    else
        log_error "Échec du démarrage de RabbitMQ"
        exit 1
    fi
    
    # Check Redis
    if check_service "Redis" 6379; then
        log_success "Redis démarré avec succès"
    else
        log_error "Échec du démarrage de Redis"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    log_info "Installation des dépendances..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        log_success "Dépendances installées"
    else
        log_info "Dépendances déjà installées"
    fi
}

# Function to start webhook service
start_webhook() {
    log_info "Démarrage du service webhook..."
    
    if check_service "Webhook Service" $WEBHOOK_PORT; then
        log_warning "Service webhook déjà en cours d'exécution"
        return 0
    fi
    
    nohup node src/webhook-service.js > logs/webhook.log 2>&1 &
    WEBHOOK_PID=$!
    echo $WEBHOOK_PID > logs/webhook.pid
    
    # Wait a bit and check if service started
    sleep 3
    if kill -0 $WEBHOOK_PID 2>/dev/null; then
        log_success "Service webhook démarré (PID: $WEBHOOK_PID)"
        log_info "Webhook endpoints:"
        log_info "  - GitHub: http://localhost:$WEBHOOK_PORT/webhook/github"
        log_info "  - GitLab: http://localhost:$WEBHOOK_PORT/webhook/gitlab"
        log_info "  - Generic: http://localhost:$WEBHOOK_PORT/webhook/git"
        log_info "  - Health: http://localhost:$WEBHOOK_PORT/health"
    else
        log_error "Échec du démarrage du service webhook"
        exit 1
    fi
}

# Function to start worker
start_worker() {
    log_info "Démarrage du worker de review..."
    
    # Check if worker is already running
    if [ -f "logs/worker.pid" ] && kill -0 $(cat logs/worker.pid) 2>/dev/null; then
        log_warning "Worker déjà en cours d'exécution"
        return 0
    fi
    
    nohup node src/code-review-worker.js > logs/worker.log 2>&1 &
    WORKER_PID=$!
    echo $WORKER_PID > logs/worker.pid
    
    # Wait a bit and check if worker started
    sleep 3
    if kill -0 $WORKER_PID 2>/dev/null; then
        log_success "Worker de review démarré (PID: $WORKER_PID)"
    else
        log_error "Échec du démarrage du worker"
        exit 1
    fi
}

# Function to show status
show_status() {
    log_info "État des services GetWeez Code Review:"
    echo
    
    # Infrastructure
    if check_service "RabbitMQ" 5672; then
        echo -e "🟢 RabbitMQ: ${GREEN}Running${NC} (http://localhost:15672)"
    else
        echo -e "🔴 RabbitMQ: ${RED}Stopped${NC}"
    fi
    
    if check_service "Redis" 6379; then
        echo -e "🟢 Redis: ${GREEN}Running${NC}"
    else
        echo -e "🔴 Redis: ${RED}Stopped${NC}"
    fi
    
    # Webhook Service
    if check_service "Webhook Service" ${WEBHOOK_PORT:-3001}; then
        echo -e "🟢 Webhook Service: ${GREEN}Running${NC} (http://localhost:${WEBHOOK_PORT:-3001})"
    else
        echo -e "🔴 Webhook Service: ${RED}Stopped${NC}"
    fi
    
    # Worker
    if [ -f "logs/worker.pid" ] && kill -0 $(cat logs/worker.pid) 2>/dev/null; then
        echo -e "🟢 Code Review Worker: ${GREEN}Running${NC} (PID: $(cat logs/worker.pid))"
    else
        echo -e "🔴 Code Review Worker: ${RED}Stopped${NC}"
    fi
    
    echo
}

# Function to stop services
stop_services() {
    log_info "Arrêt des services..."
    
    # Stop worker
    if [ -f "logs/worker.pid" ]; then
        WORKER_PID=$(cat logs/worker.pid)
        if kill -0 $WORKER_PID 2>/dev/null; then
            kill $WORKER_PID
            log_info "Worker arrêté"
        fi
        rm -f logs/worker.pid
    fi
    
    # Stop webhook service
    if [ -f "logs/webhook.pid" ]; then
        WEBHOOK_PID=$(cat logs/webhook.pid)
        if kill -0 $WEBHOOK_PID 2>/dev/null; then
            kill $WEBHOOK_PID
            log_info "Service webhook arrêté"
        fi
        rm -f logs/webhook.pid
    fi
    
    # Stop infrastructure
    docker-compose -f ../docker-compose.rabbitmq.yml down
    
    log_success "Tous les services ont été arrêtés"
}

# Function to show logs
show_logs() {
    local service=$1
    
    case $service in
        webhook)
            if [ -f "logs/webhook.log" ]; then
                tail -f logs/webhook.log
            else
                log_error "Logs du webhook non trouvés"
            fi
            ;;
        worker)
            if [ -f "logs/worker.log" ]; then
                tail -f logs/worker.log
            else
                log_error "Logs du worker non trouvés"
            fi
            ;;
        *)
            log_info "Logs disponibles:"
            echo "  - ./scripts/start.sh logs webhook"
            echo "  - ./scripts/start.sh logs worker"
            ;;
    esac
}

# Main script logic
case ${1:-all} in
    infrastructure|infra)
        start_infrastructure
        ;;
    webhook)
        install_dependencies
        start_webhook
        ;;
    worker)
        install_dependencies
        start_worker
        ;;
    all)
        install_dependencies
        start_infrastructure
        start_webhook
        start_worker
        show_status
        log_success "Système GetWeez Code Review démarré avec succès!"
        ;;
    status)
        show_status
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        install_dependencies
        start_infrastructure
        start_webhook
        start_worker
        show_status
        ;;
    logs)
        show_logs $2
        ;;
    test)
        log_info "Test du système..."
        curl -X POST http://localhost:${WEBHOOK_PORT:-3001}/trigger/manual \
             -H "Content-Type: application/json" \
             -d '{"repository":{"name":"test/repo","clone_url":"https://github.com/test/repo.git"},"type":"push"}'
        ;;
    *)
        echo "Usage: $0 {all|infrastructure|webhook|worker|status|stop|restart|logs|test}"
        echo
        echo "Commands:"
        echo "  all           - Démarre tous les services"
        echo "  infrastructure- Démarre RabbitMQ et Redis"
        echo "  webhook       - Démarre le service webhook uniquement"
        echo "  worker        - Démarre le worker uniquement"
        echo "  status        - Affiche l'état des services"
        echo "  stop          - Arrête tous les services"
        echo "  restart       - Redémarre tous les services"
        echo "  logs [service]- Affiche les logs (webhook|worker)"
        echo "  test          - Test rapide du système"
        exit 1
        ;;
esac