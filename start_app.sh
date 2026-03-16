#!/bin/bash

# Lokasi project
BACKEND_DIR="/root/.openclaw/workspace/sipale/backend"
FRONTEND_DIR="/root/.openclaw/workspace/sipale/frontend"

# Fungsi untuk menjalankan backend
start_backend() {
    cd "$BACKEND_DIR"
    echo "🚀 Memulai Backend..."
    npm run dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
}

# Fungsi untuk menjalankan frontend
start_frontend() {
    cd "$FRONTEND_DIR"
    echo "💻 Memulai Frontend..."
    npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
}

# Fungsi untuk menampilkan informasi
show_info() {
    echo ""
    echo "🌐 Akses Aplikasi:"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "👥 Akun Default:"
    echo "- Admin: 083456789012"
    echo "- Kolektor: 082345678901"
    echo "- Peserta: 081234567890"
}

# Jalankan backend dan frontend
start_backend
start_frontend

# Tampilkan informasi
show_info

# Tunggu proses
wait