#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Build frontend
build_frontend() {
    cd "$PROJECT_DIR/frontend"
    npm run build
    echo "✅ Frontend berhasil di-build"
}

# Konfigurasi Nginx
setup_nginx() {
    # Instal Nginx
    apt-get update
    apt-get install -y nginx

    # Konfigurasi
    cat > /etc/nginx/sites-available/sipale <<EOL
server {
    listen 80;
    server_name sipale.local www.sipale.local;

    root $PROJECT_DIR/frontend/build;
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
    ln -s /etc/nginx/sites-available/sipale /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx

    echo "🌐 Konfigurasi Nginx selesai"
}

# Deployment Docker
docker_deployment() {
    cd "$PROJECT_DIR"
    docker-compose -f docker-compose.production.yml up -d --build
    echo "🐳 Deployment Docker selesai"
}

# Backup database
database_backup() {
    mkdir -p "$PROJECT_DIR/backups"
    mongodump --uri="$MONGODB_URI" --out="$PROJECT_DIR/backups/$(date +%Y%m%d_%H%M%S)"
    echo "💾 Backup database selesai"
}

# Alur utama deployment
main() {
    build_frontend
    setup_nginx
    docker_deployment
    database_backup
}

# Jalankan
main