#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Fungsi untuk memeriksa port
check_port() {
    local port=$1
    local name=$2
    
    echo "🔍 Memeriksa port $port ($name)..."
    
    # Cek apakah port terbuka
    if nc -z localhost $port; then
        echo "✅ Port $port ($name) terbuka"
    else
        echo "❌ Port $port ($name) tertutup"
    fi
}

# Fungsi untuk memeriksa proses
check_process() {
    local dir=$1
    local start_command=$2
    
    echo "🖥️ Memeriksa proses di $dir..."
    
    # Masuk ke direktori
    cd "$dir"
    
    # Jalankan perintah start
    $start_command &
    local pid=$!
    
    # Tunggu sebentar
    sleep 5
    
    # Periksa status proses
    if kill -0 $pid 2>/dev/null; then
        echo "✅ Proses berjalan (PID: $pid)"
    else
        echo "❌ Proses gagal berjalan"
    fi
    
    # Hentikan proses jika masih berjalan
    kill $pid 2>/dev/null
}

# Periksa konfigurasi jaringan
echo "🌐 Diagnostik Jaringan SiPaLe"

# Cek port
check_port 5000 "Backend"
check_port 3000 "Frontend"

# Cek proses
check_process "$PROJECT_DIR/backend" "npm start"
check_process "$PROJECT_DIR/frontend" "npm start"

# Tampilkan informasi tambahan
echo "🔧 Informasi Sistem:"
echo "Hostname: $(hostname)"
echo "IP Address: $(hostname -I)"

# Cek konfigurasi node dan npm
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"