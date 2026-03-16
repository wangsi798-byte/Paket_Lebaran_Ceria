#!/bin/bash

# Lokasi Project
PROJECT_DIR="/root/.openclaw/workspace/sipale"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi log
log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

error() {
    echo -e "${YELLOW}[ERROR]${NC} $1"
}

# Persiapan Lingkungan
prepare_environment() {
    log "🌐 Menyiapkan Lingkungan Deployment"
    
    # Update package manager
    npm cache clean --force
    
    # Instal dependensi global
    npm install -g pm2
}

# Build Backend
build_backend() {
    log "🚀 Build Backend"
    cd "$BACKEND_DIR"
    
    # Instal dependensi
    npm install
    
    # Reset dan seed data
    npm run reset:seed
    npm run seed
    npm run seed:paket
}

# Build Frontend
build_frontend() {
    log "💻 Build Frontend"
    cd "$FRONTEND_DIR"
    
    # Instal dependensi
    npm install
    
    # Build production
    npm run build
}

# Deployment Backend dengan PM2
deploy_backend() {
    log "🔧 Deploy Backend"
    cd "$BACKEND_DIR"
    
    # Stop existing backend
    pm2 delete backend || true
    
    # Start backend dengan PM2
    pm2 start src/server.js --name backend \
        --env production
}

# Deployment Frontend dengan Serve
deploy_frontend() {
    log "🌍 Deploy Frontend"
    cd "$FRONTEND_DIR"
    
    # Install serve global
    npm install -g serve
    
    # Stop existing frontend
    pm2 delete frontend || true
    
    # Start frontend dengan PM2
    pm2 start serve build --name frontend \
        -p 3000
}

# Konfigurasi Nginx
configure_nginx() {
    log "🌐 Konfigurasi Nginx"
    
    # Instal Nginx jika belum ada
    apt-get update
    apt-get install -y nginx
    
    # Buat konfigurasi
    cat > /etc/nginx/sites-available/sipale <<EOL
server {
    listen 80;
    server_name sipale.local www.sipale.local;

    root $FRONTEND_DIR/build;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

    # Aktifkan konfigurasi
    ln -sf /etc/nginx/sites-available/sipale /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx
}

# Backup Database
backup_database() {
    log "💾 Backup Database"
    mkdir -p "$PROJECT_DIR/backups"
    mongodump --uri="$MONGODB_URI" --out="$PROJECT_DIR/backups/$(date +%Y%m%d_%H%M%S)"
}

# Monitoring dan Restart Otomatis
setup_monitoring() {
    log "🔍 Setup Monitoring"
    
    # Restart otomatis jika proses mati
    pm2 startup
    pm2 save
    
    # Monitoring dengan pm2
    pm2 monit
}

# Alur Deployment Utama
main() {
    prepare_environment
    build_backend
    build_frontend
    deploy_backend
    deploy_frontend
    configure_nginx
    backup_database
    setup_monitoring
}

# Jalankan
main