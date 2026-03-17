#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Fungsi untuk mempersiapkan dependensi
prepare_dependencies() {
    echo "🔧 Mempersiapkan dependensi..."
    
    # Backend
    cd "$PROJECT_DIR/backend"
    npm install express-validator jsonwebtoken
    
    # Frontend
    cd "$PROJECT_DIR/frontend"
    npm install react-router-dom axios
}

# Jalankan backend
start_backend() {
    cd "$PROJECT_DIR/backend"
    echo "🚀 Memulai Backend..."
    npm start &
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PROJECT_DIR/backend.pid"
}

# Jalankan frontend
start_frontend() {
    cd "$PROJECT_DIR/frontend"
    echo "💻 Memulai Frontend..."
    npm start &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PROJECT_DIR/frontend.pid"
}

# Tampilkan informasi akses
show_access_info() {
    echo "🌐 Akses Aplikasi:"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    
    echo "👥 Akun Default:"
    echo "- Peserta: 081100001111 (Ahmad)"
    echo "- Peserta: 081122223333 (Budi)"
    echo "- Kolektor: 082200001111 (Kolektor Utama)"
}

# Jalankan semua
main() {
    prepare_dependencies
    start_backend
    start_frontend
    show_access_info
}

# Eksekusi
main