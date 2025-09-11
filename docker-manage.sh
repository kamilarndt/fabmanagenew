#!/bin/bash
# FabManage Docker Management Script
# Bash script for Linux/macOS

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/FabManageNew/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

function log_info() {
    echo -e "${CYAN}🐳 $1${NC}"
}

function log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

function check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker nie jest zainstalowany"
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker nie jest uruchomiony"
    fi
}

function show_help() {
    echo "Użycie: $0 <action> [service]"
    echo ""
    echo "Dostępne akcje:"
    echo "  dev      - Uruchom środowisko deweloperskie"
    echo "  prod     - Uruchom środowisko produkcyjne"  
    echo "  build    - Przebuduj obrazy Docker"
    echo "  stop     - Zatrzymaj kontenery"
    echo "  clean    - Wyczyść kontenery i obrazy"
    echo "  logs     - Pokaż logi"
    echo "  restart  - Restartuj kontenery"
    echo ""
    echo "Przykłady:"
    echo "  $0 dev"
    echo "  $0 logs frontend"
    echo "  $0 build backend"
}

# Check arguments
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

ACTION=$1
SERVICE=${2:-""}

# Check if Docker is available
check_docker

# Check if docker-compose file exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    log_error "Nie znaleziono pliku docker-compose.yml w: $DOCKER_COMPOSE_FILE"
fi

# Change to the directory containing docker-compose.yml
cd "$(dirname "$DOCKER_COMPOSE_FILE")"

case $ACTION in
    "dev")
        log_info "Uruchamianie środowiska deweloperskiego..."
        docker-compose up -d
        log_success "Środowisko deweloperskie uruchomione!"
        echo ""
        echo "🌐 Frontend:  http://localhost:5173"
        echo "🔧 Backend:   http://localhost:3001"
        echo "📊 Health:    http://localhost:3001/health"
        echo ""
        echo "Aby zatrzymać: $0 stop"
        echo "Aby zobaczyć logi: $0 logs"
        ;;
        
    "prod")
        log_info "Uruchamianie środowiska produkcyjnego..."
        PROD_COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.yml"
        if [ -f "$PROD_COMPOSE_FILE" ]; then
            docker-compose -f "$PROD_COMPOSE_FILE" up -d
            log_success "Środowisko produkcyjne uruchomione!"
        else
            log_error "Nie znaleziono pliku docker-compose.yml dla środowiska produkcyjnego"
        fi
        ;;
        
    "build")
        log_info "Przebudowywanie obrazów Docker..."
        if [ -n "$SERVICE" ]; then
            docker-compose build --no-cache "$SERVICE"
        else
            docker-compose build --no-cache
        fi
        log_success "Obrazy zostały przebudowane!"
        ;;
        
    "stop")
        log_info "Zatrzymywanie kontenerów..."
        docker-compose down
        log_success "Kontenery zatrzymane!"
        ;;
        
    "clean")
        log_info "Czyszczenie kontenerów i obrazów..."
        docker-compose down -v --rmi all
        docker system prune -f
        log_success "Środowisko zostało wyczyszczone!"
        ;;
        
    "logs")
        if [ -n "$SERVICE" ]; then
            log_info "Pokazywanie logów dla serwisu: $SERVICE"
            docker-compose logs -f "$SERVICE"
        else
            log_info "Pokazywanie logów wszystkich serwisów..."
            docker-compose logs -f
        fi
        ;;
        
    "restart")
        log_info "Restartowanie kontenerów..."
        if [ -n "$SERVICE" ]; then
            docker-compose restart "$SERVICE"
            log_success "Serwis $SERVICE został zrestartowany!"
        else
            docker-compose restart
            log_success "Wszystkie serwisy zostały zrestartowane!"
        fi
        ;;
        
    *)
        echo "Nieznana akcja: $ACTION"
        show_help
        exit 1
        ;;
esac

# Return to original directory
cd "$PROJECT_ROOT"