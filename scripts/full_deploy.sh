#!/bin/bash

# Full Deployment Script for SiPaLe

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variabel
PROJECT_DIR="/root/.openclaw/workspace/sipale"
BACKEND_DIR="${PROJECT_DIR}/backend"
FRONTEND_DIR="${PROJECT_DIR}/frontend"
ENV_FILE="${PROJECT_DIR}/.env.production"
DOCKER_COMPOSE_FILE="${PROJECT_DIR}/docker-compose.production.yml"

# Fungsi Log
log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

# Fungsi Error
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Validasi Prasyarat
validate_prerequisites() {
    log "Memeriksa prasyarat deployment..."
    
    # Cek Docker
    if ! command -v docker &> /dev/null; then
        error "Docker tidak terinstall"
    fi

    # Cek Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose tidak terinstall"
    fi

    # Cek file environment
    if [[ ! -f "${ENV_FILE}" ]]; then
        error "File environment tidak ditemukan"
    fi

    # Cek file Docker Compose
    if [[ ! -f "${DOCKER_COMPOSE_FILE}" ]]; then
        error "File Docker Compose tidak ditemukan"
    fi
}

# Persiapan Lingkungan
prepare_environment() {
    log "Mempersiapkan lingkungan deployment..."
    
    # Buat direktori yang diperlukan
    mkdir -p "${PROJECT_DIR}/logs"
    mkdir -p "${PROJECT_DIR}/backups"
    
    # Set permission
    chmod 600 "${ENV_FILE}"
}

# Backup Database
backup_database() {
    log "Membuat backup database..."
    
    docker-compose -f "${DOCKER_COMPOSE_FILE}" exec mongodb \
        mongodump --out="/backups/pre_deploy_$(date +'%Y%m%d_%H%M%S')"
}

# Build Images
build_images() {
    log "Membangun Docker images..."
    
    docker-compose -f "${DOCKER_COMPOSE_FILE}" build
}

# Pull Images Terbaru
pull_images() {
    log "Menarik images terbaru..."
    
    docker-compose -f "${DOCKER_COMPOSE_FILE}" pull
}

# Jalankan Migrasi
run_migrations() {
    log "Menjalankan migrasi database..."
    
    docker-compose -f "${DOCKER_COMPOSE_FILE}" exec backend \
        npm run migrate
}

# Deploy Containers
deploy_containers() {
    log "Memulai container..."
    
    docker-compose -f "${DOCKER_COMPOSE_FILE}" up -d
}

# Validasi Deployment
validate_deployment() {
    log "Memvalidasi deployment..."
    
    # Tunggu beberapa saat
    sleep 30
    
    # Cek status container
    docker ps | grep -E "sipale-(backend|frontend|mongodb)"
    
    # Cek endpoint
    curl -f http://localhost:5000/health || error "Backend health check gagal"
    curl -f http://localhost:3000 || error "Frontend tidak dapat diakses"
}

# Pembersihan
cleanup() {
    log "Membersihkan images lama..."
    docker image prune -f
}

# Tangani Error
error_handler() {
    error "Deployment gagal. Melakukan rollback..."
    
    # Kembalikan ke versi sebelumnya
    docker-compose -f "${DOCKER_COMPOSE_FILE}" down
}

# Main Deployment Workflow
main() {
    # Tangani error
    trap error_handler ERR

    validate_prerequisites
    prepare_environment
    backup_database
    pull_images
    build_images
    deploy_containers
    run_migrations
    validate_deployment
    cleanup

    log "🎉 Deployment Berhasil Diselesaikan!"
}

# Jalankan deployment
main