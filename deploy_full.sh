#!/bin/bash

# Deployment Script untuk SiPaLe

# Variabel
PROJECT_DIR="/root/.openclaw/workspace/sipale"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Fungsi untuk log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

# Cek prasyarat
check_prerequisites() {
    log "🔍 Memeriksa prasyarat..."
    
    # Cek Node.js
    if ! command -v node &> /dev/null; then
        log "❌ Node.js tidak terinstall"
        exit 1
    fi

    # Cek npm
    if ! command -v npm &> /dev/null; then
        log "❌ npm tidak terinstall"
        exit 1
    fi

    # Cek Docker
    if ! command -v docker &> /dev/null; then
        log "❌ Docker tidak terinstall"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    log "📦 Menginstal dependencies..."
    
    # Backend
    cd "$BACKEND_DIR"
    npm install
    
    # Frontend
    cd "$FRONTEND_DIR"
    npm install
}

# Jalankan seed data
seed_data() {
    log "🌱 Menjalankan seed data..."
    
    cd "$BACKEND_DIR"
    npm run seed
    npm run seed:paket
}

# Build Docker images
build_docker() {
    log "🐳 Membangun Docker images..."
    
    # Build backend
    cd "$BACKEND_DIR"
    docker build -t sipale-backend .
    
    # Build frontend
    cd "$FRONTEND_DIR"
    docker build -t sipale-frontend .
}

# Deployment
deploy() {
    log "🚀 Memulai deployment..."
    
    # Gunakan docker-compose
    cd "$PROJECT_DIR"
    docker-compose up -d
}

# Validasi deployment
validate_deployment() {
    log "✅ Memeriksa status deployment..."
    
    # Cek container berjalan
    docker ps | grep sipale
    
    # Cek endpoint
    curl http://localhost:5000/health
    curl http://localhost:3000
}

# Main deployment workflow
main() {
    check_prerequisites
    install_dependencies
    seed_data
    build_docker
    deploy
    validate_deployment
    
    log "🎉 Deployment SiPaLe Selesai!"
}

# Jalankan
main