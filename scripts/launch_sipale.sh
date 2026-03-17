#!/bin/bash

# SiPaLe Launcher Script

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Fungsi log
log() {
    echo -e "${GREEN}[SIPALE]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Cek prasyarat
check_prerequisites() {
    log "🔍 Memeriksa prasyarat..."
    
    # Cek Docker
    if ! command -v docker &> /dev/null; then
        error "Docker tidak terinstall"
    fi

    # Cek Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose tidak terinstall"
    fi
}

# Hentikan container yang sudah berjalan
stop_existing_containers() {
    log "🛑 Menghentikan container yang sudah berjalan..."
    docker-compose down || true
}

# Jalankan seed data
run_seed_data() {
    log "🌱 Memulai seed data..."
    
    # Cari container backend
    BACKEND_CONTAINER=$(docker ps | grep sipale-backend | awk '{print $1}')

    if [ -z "$BACKEND_CONTAINER" ]; then
        error "Container backend tidak ditemukan"
    fi

    # Jalankan seed data
    docker exec -it $BACKEND_CONTAINER npm run seed
    docker exec -it $BACKEND_CONTAINER npm run seed:paket
}

# Jalankan Docker Compose
start_docker_compose() {
    log "🚀 Memulai container Docker..."
    docker-compose -f docker-compose.local.yml up --build -d
}

# Buka browser
open_browser() {
    log "🌐 Membuka aplikasi di browser..."
    
    # Deteksi OS dan buka browser
    case "$(uname -s)" in
        Darwin)
            open http://localhost:3000
            ;;
        Linux)
            xdg-open http://localhost:3000
            ;;
        MINGW64_NT-*)
            start http://localhost:3000
            ;;
        *)
            warn "Tidak dapat membuka browser otomatis. Buka http://localhost:3000 secara manual"
            ;;
    esac
}

# Tunggu aplikasi siap
wait_for_app() {
    log "⏳ Menunggu aplikasi siap..."
    
    # Tunggu maksimal 2 menit
    timeout=120
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:3000 > /dev/null; then
            log "✅ Aplikasi siap diakses"
            return 0
        fi
        
        sleep 2
        ((timeout-=2))
    done
    
    error "Aplikasi tidak dapat diakses"
}

# Main workflow
main() {
    check_prerequisites
    stop_existing_containers
    start_docker_compose
    run_seed_data
    wait_for_app
    open_browser
    
    log "🎉 SiPaLe berhasil diluncurkan!"
}

# Jalankan
main