#!/bin/bash

# Auto Seed Data Script for SiPaLe

# Warna
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Fungsi log
log() {
    echo -e "${GREEN}[SEED]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Jalankan seed data
run_seed() {
    log "🌱 Memulai proses seed data SiPaLe..."

    # Cari container backend
    BACKEND_CONTAINER=$(docker ps | grep sipale-backend | awk '{print $1}')

    if [ -z "$BACKEND_CONTAINER" ]; then
        error "Container backend tidak ditemukan. Pastikan Docker sudah berjalan."
    fi

    log "📦 Terdeteksi Container: $BACKEND_CONTAINER"

    # Jalankan seed data di container
    docker exec -it $BACKEND_CONTAINER npm run seed
    docker exec -it $BACKEND_CONTAINER npm run seed:paket
}

# Validasi hasil seed
validate_seed() {
    log "🕵️ Memeriksa hasil seed..."

    # Cek jumlah peserta
    PESERTA_COUNT=$(docker exec -it $BACKEND_CONTAINER node -e "
        const mongoose = require('mongoose');
        const User = require('./src/models/User');
        
        async function countPeserta() {
            await mongoose.connect(process.env.MONGODB_URI);
            const count = await User.countDocuments({role: 'peserta'});
            console.log(count);
            await mongoose.connection.close();
        }
        
        countPeserta();
    ")

    if [ "$PESERTA_COUNT" -gt 0 ]; then
        log "✅ Seed berhasil! Peserta terdaftar: $PESERTA_COUNT"
    else
        error "❌ Seed data gagal"
    fi
}

# Main workflow
main() {
    run_seed
    validate_seed
}

# Jalankan
main