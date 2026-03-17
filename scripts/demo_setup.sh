#!/bin/bash

# Demo Setup Script for SiPaLe

# Warna
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variabel Demo
DEMO_DB_NAME="sipale_demo"
DEMO_USERS=50
DEMO_SETORAN_PER_USER=10

# Fungsi Log
log() {
    echo -e "${GREEN}[DEMO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Setup Database Demo
setup_demo_database() {
    log "🗄️ Menyiapkan Database Demo"
    
    # Buat database demo
    mongorestore \
        --db="${DEMO_DB_NAME}" \
        --drop \
        ./demo_data_snapshot
    
    # Set flag demo
    mongo "${DEMO_DB_NAME}" --eval \
        'db.system_flags.insertOne({is_demo: true})'
}

# Generasi Data Dummy
generate_demo_data() {
    log "📊 Membuat Data Dummy"
    
    # Generate peserta
    node ./scripts/generate_demo_users.js \
        --count="${DEMO_USERS}"
    
    # Generate setoran
    node ./scripts/generate_demo_setoran.js \
        --users="${DEMO_USERS}" \
        --setoran-per-user="${DEMO_SETORAN_PER_USER}"
}

# Konfigurasi Environment Demo
configure_demo_env() {
    log "🌐 Konfigurasi Environment Demo"
    
    # Copy environment demo
    cp .env.demo .env
    
    # Set mode demo
    export DEMO_MODE=true
}

# Persiapan Frontend
prepare_frontend() {
    log "🖥️ Menyiapkan Frontend Demo"
    
    # Build dengan konfigurasi demo
    npm run build:demo
    
    # Tambahkan fitur demo
    sed -i 's/REACT_APP_DEMO_MODE=false/REACT_APP_DEMO_MODE=true/' .env
}

# Setup Skenario Demo
create_demo_scenarios() {
    log "🎭 Menyiapkan Skenario Demo"
    
    # Buat data dengan berbagai skenario
    node ./scripts/create_demo_scenarios.js \
        --scenarios=complete_savings \
        --scenarios=mid_savings \
        --scenarios=low_savings
}

# Jalankan Aplikasi Demo
run_demo() {
    log "🚀 Memulai Aplikasi Demo"
    
    # Jalankan server demo
    npm run start:demo
}

# Pembersihan Demo
cleanup_demo() {
    log "🧹 Membersihkan Lingkungan Demo"
    
    # Hapus data sensitif
    mongo "${DEMO_DB_NAME}" --eval \
        'db.dropDatabase()'
    
    # Reset environment
    unset DEMO_MODE
}

# Main Demo Workflow
main() {
    trap cleanup_demo EXIT
    
    setup_demo_database
    generate_demo_data
    configure_demo_env
    prepare_frontend
    create_demo_scenarios
    run_demo
}

# Jalankan
main