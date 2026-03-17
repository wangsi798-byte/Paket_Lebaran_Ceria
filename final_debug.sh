#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Bersihkan proses sebelumnya
cleanup() {
    echo "🧹 Membersihkan proses..."
    pkill -f "node src/server.js"
    pkill -f "npm start"
    sleep 2
}

# Jalankan backend
start_backend() {
    cd "$PROJECT_DIR/backend"
    echo "🚀 Memulai Backend..."
    node -r dotenv/config src/server.js &
    BACKEND_PID=$!
    
    # Tunggu backend siap
    sleep 5
    
    # Cek status
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "✅ Backend berjalan di port 5000"
        echo "URL: http://localhost:5000"
    else
        echo "❌ Backend gagal berjalan"
        exit 1
    fi
}

# Main workflow
main() {
    cleanup
    start_backend
}

# Jalankan
main

# Tampilkan log aktif
tail -f "$PROJECT_DIR/backend/npm-debug.log"