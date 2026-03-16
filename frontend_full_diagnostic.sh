#!/bin/bash

# Lokasi Proyek
PROJECT_DIR="/root/.openclaw/workspace/sipale"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fungsi log
log() {
    echo -e "${GREEN}[DIAGNOSA]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[PERINGATAN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cek prasyarat
check_prerequisites() {
    log "🔍 Memeriksa Prasyarat"
    
    # Cek Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js tidak terinstall"
        exit 1
    fi

    # Cek npm
    if ! command -v npm &> /dev/null; then
        error "npm tidak terinstall"
        exit 1
    fi

    log "✅ Prasyarat terpenuhi"
}

# Bersihkan dan siapkan ulang
prepare_environment() {
    log "🧹 Membersihkan Lingkungan"
    
    cd "$FRONTEND_DIR"
    
    # Hapus node_modules
    rm -rf node_modules
    
    # Hapus package-lock.json
    rm -f package-lock.json
    
    # Bersihkan cache npm
    npm cache clean --force
}

# Instal dependensi
install_dependencies() {
    log "📦 Menginstal Dependensi"
    
    cd "$FRONTEND_DIR"
    
    # Instal dependensi utama
    npm init -y
    npm install react react-dom react-scripts axios

    # Instal dependensi pengembangan
    npm install --save-dev @testing-library/react @testing-library/jest-dom
}

# Konfigurasi ulang
reconfigure_project() {
    log "⚙️ Mengkonfigurasi Ulang Proyek"
    
    cd "$FRONTEND_DIR"
    
    # Buat direktori public jika tidak ada
    mkdir -p public
    
    # Buat index.html
    cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SiPaLe - Sistem Informasi Paket Lebaran</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
EOL

    # Update package.json
    cat > package.json << EOL
{
  "name": "sipale-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.27.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "REACT_APP_API_URL=http://localhost:5000 react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOL
}

# Jalankan frontend
run_frontend() {
    log "🚀 Memulai Frontend"
    
    cd "$FRONTEND_DIR"
    
    # Eksekusi start
    REACT_APP_API_URL=http://localhost:5000 npm start &
    FRONTEND_PID=$!
    
    log "Frontend berjalan dengan PID: $FRONTEND_PID"
}

# Alur utama
main() {
    check_prerequisites
    prepare_environment
    install_dependencies
    reconfigure_project
    run_frontend
    
    log "✅ Diagnostik Frontend Selesai"
}

# Jalankan
main