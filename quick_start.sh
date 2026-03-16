#!/bin/bash

# Quick Start Script for SiPaLe

# Direktori proyek
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Fungsi untuk menjalankan backend
start_backend() {
    echo "🚀 Memulai Backend..."
    cd "$PROJECT_DIR/backend"
    npm install
    npm run dev &
}

# Fungsi untuk menjalankan frontend
start_frontend() {
    echo "🖥️ Memulai Frontend..."
    cd "$PROJECT_DIR/frontend"
    npm install
    npm start &
}

# Fungsi seed data
seed_data() {
    echo "🌱 Melakukan Seed Data..."
    cd "$PROJECT_DIR/backend"
    npm run seed
    npm run seed:paket
}

# Buka browser
open_browser() {
    echo "🌐 Membuka http://localhost:3000"
    xdg-open http://localhost:3000 || \
    open http://localhost:3000 || \
    start http://localhost:3000
}

# Alur utama
main() {
    seed_data
    start_backend
    start_frontend
    
    # Tunggu sebentar agar aplikasi siap
    sleep 30
    
    open_browser
}

# Jalankan
main