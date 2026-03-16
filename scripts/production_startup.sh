#!/bin/bash

# Production Startup Script for SiPaLe

# Variabel
COMPOSE_FILE="docker-compose.production.yml"
LOG_DIR="/var/log/sipale"
BACKUP_DIR="/backup/sipale"

# Fungsi Log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_DIR}/startup.log"
}

# Validasi Prasyarat
check_prerequisites() {
    log "🔍 Memeriksa prasyarat..."
    
    # Cek Docker
    if ! command -v docker &> /dev/null; then
        log "❌ Docker tidak terinstall"
        exit 1
    fi

    # Cek Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log "❌ Docker Compose tidak terinstall"
        exit 1
    fi

    # Buat direktori log dan backup
    mkdir -p "${LOG_DIR}"
    mkdir -p "${BACKUP_DIR}"
}

# Backup Database Sebelum Startup
backup_database() {
    log "💾 Membuat backup database..."
    docker-compose -f "${COMPOSE_FILE}" exec mongodb mongodump \
        --out="${BACKUP_DIR}/pre_startup_$(date +'%Y%m%d_%H%M%S')"
}

# Validasi Konfigurasi
validate_config() {
    log "🔒 Validasi konfigurasi..."
    
    # Periksa file environment
    if [[ ! -f .env.production ]]; then
        log "❌ File .env.production tidak ditemukan"
        exit 1
    fi

    # Validasi koneksi MongoDB
    docker-compose -f "${COMPOSE_FILE}" config | grep -q "MONGODB_URI"
    if [[ $? -ne 0 ]]; then
        log "❌ Konfigurasi MongoDB tidak valid"
        exit 1
    fi
}

# Pull Image Terbaru
pull_images() {
    log "🐳 Menarik image terbaru..."
    docker-compose -f "${COMPOSE_FILE}" pull
}

# Memulai Layanan
start_services() {
    log "🚀 Memulai layanan..."
    docker-compose -f "${COMPOSE_FILE}" up -d
    
    # Tunggu layanan siap
    sleep 30
}

# Jalankan Migrasi Database
run_migrations() {
    log "🗄️ Menjalankan migrasi database..."
    docker-compose -f "${COMPOSE_FILE}" exec backend npm run migrate
}

# Validasi Layanan
validate_services() {
    log "✅ Memeriksa status layanan..."
    
    # Cek status container
    docker ps | grep -E "sipale-backend|sipale-frontend|sipale-mongodb"
    
    # Cek endpoint health
    curl http://localhost:5000/health
    curl http://localhost:3000
}

# Tangani Error
error_handler() {
    log "❌ Terjadi kesalahan dalam proses startup"
    
    # Rollback atau tindakan recovery
    docker-compose -f "${COMPOSE_FILE}" down
    
    # Restore dari backup terakhir
    # (Implementasi mekanisme restore)
}

# Main Workflow
main() {
    # Tangani error
    trap error_handler ERR

    check_prerequisites
    backup_database
    validate_config
    pull_images
    start_services
    run_migrations
    validate_services

    log "🎉 Startup Produksi SiPaLe Selesai!"
}

# Jalankan
main