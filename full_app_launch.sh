#!/bin/bash

# Lokasi Project
PROJECT_DIR="/root/.openclaw/workspace/sipale"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fungsi log
log() {
    echo -e "${GREEN}[SIPALE]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[PERINGATAN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pembersihan awal
cleanup() {
    log "🧹 Membersihkan proses sebelumnya"
    pkill -f "npm start"
    pkill -f "node src/server.js"
    pkill -f "react-scripts start"
    sleep 2
}

# Persiapan dependensi
prepare_dependencies() {
    log "📦 Menyiapkan dependensi"
    
    # Backend
    cd "$BACKEND_DIR"
    npm install
    
    # Frontend
    cd "$FRONTEND_DIR"
    npm install
}

# Seed data
seed_data() {
    log "🌱 Melakukan seed data"
    cd "$BACKEND_DIR"
    npm run reset:seed
    npm run seed
    npm run seed:paket
}

# Jalankan backend
start_backend() {
    log "🚀 Memulai Backend"
    cd "$BACKEND_DIR"
    npm start &
    BACKEND_PID=$!
    log "Backend berjalan (PID: $BACKEND_PID)"
    sleep 5  # Tunggu backend siap
}

# Jalankan frontend
start_frontend() {
    log "💻 Memulai Frontend"
    cd "$FRONTEND_DIR"
    REACT_APP_API_URL=http://localhost:5000 npm start &
    FRONTEND_PID=$!
    log "Frontend berjalan (PID: $FRONTEND_PID)"
    sleep 10  # Tunggu frontend siap
}

# Tampilkan informasi
show_info() {
    log "🌐 Akses Aplikasi:"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    echo ""
    log "👥 Akun Default:"
    echo "- Admin: 083456789012"
    echo "- Kolektor: 082345678901"
    echo "- Peserta: 081234567890"
}

# Alur utama
main() {
    cleanup
    prepare_dependencies
    seed_data
    start_backend
    start_frontend
    show_info
}

# Jalankan
main