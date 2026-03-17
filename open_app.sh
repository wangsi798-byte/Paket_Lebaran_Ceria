#!/bin/bash

# Script Membuka Aplikasi SiPaLe

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Jalankan backend
start_backend() {
    cd "$PROJECT_DIR/backend"
    echo "🚀 Memulai Backend..."
    npm start &
    sleep 5  # Tunggu backend siap
}

# Jalankan frontend
start_frontend() {
    cd "$PROJECT_DIR/frontend"
    echo "💻 Memulai Frontend..."
    npm install
    npm start &
    sleep 10  # Tunggu frontend siap
}

# Tampilkan status
echo "✅ Aplikasi SiPaLe akan berjalan..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"

# Akun Default:
echo "👥 Akun Default:"
echo "- Peserta: 081100001111 (Ahmad)"
echo "- Peserta: 081122223333 (Budi)"
echo "- Kolektor: 082200001111 (Kolektor Utama)"

# Jalankan aplikasi
start_backend
start_frontend

# Tampilkan log
tail -f "$PROJECT_DIR/backend/npm-debug.log" "$PROJECT_DIR/frontend/npm-debug.log"