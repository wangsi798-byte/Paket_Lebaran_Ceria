#!/bin/bash

# Demo Deployment Script for SiPaLe

# Konfigurasi Demo
DEMO_DOMAIN="demo.sipale.com"
DEMO_PORT=3000
DEMO_DB_NAME="sipale_demo"

# Persiapan Data Demo
prepare_demo_data() {
    echo "🌱 Menyiapkan data demo..."
    
    # Generate peserta demo
    npx ts-node ./scripts/generate_demo_users.ts \
        --count=50 \
        --role=peserta

    # Generate kolektor demo
    npx ts-node ./scripts/generate_demo_users.ts \
        --count=5 \
        --role=kolektor

    # Generate setoran demo
    npx ts-node ./scripts/generate_demo_setoran.ts \
        --users=50
}

# Konfigurasi Khusus Demo
configure_demo_environment() {
    echo "🔧 Mengonfigurasi lingkungan demo..."
    
    # Copy environment demo
    cp .env.example .env
    
    # Modifikasi environment untuk demo
    sed -i 's/DEMO_MODE=false/DEMO_MODE=true/' .env
    sed -i "s/MONGODB_URI=.*/MONGODB_URI=mongodb+srv:\/\/demo:sipale_demo@cluster0.demo.mongodb.net\/${DEMO_DB_NAME}?retryWrites=true/" .env
}

# Deploy ke Platform Cloud
deploy_to_cloud() {
    echo "🚀 Mendeploy ke platform cloud..."
    
    # Gunakan Vercel untuk frontend
    npx vercel deploy \
        --prod \
        --build-env REACT_APP_API_URL=https://api.demo.sipale.com
    
    # Gunakan Heroku untuk backend
    heroku create sipale-demo-backend
    git push heroku main
}

# Konfigurasi Akses Demo
setup_demo_access() {
    echo "🔐 Menyiapkan akses demo..."
    
    # Buat akun demo
    npx ts-node ./scripts/create_demo_accounts.ts
    
    # Generate kredensial demo terbatas
    DEMO_ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    DEMO_USER_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Simpan kredensial
    echo "DEMO_ADMIN_TOKEN=${DEMO_ADMIN_TOKEN}" >> .env
    echo "DEMO_USER_TOKEN=${DEMO_USER_TOKEN}" >> .env
}

# Notifikasi Demo
notify_demo_launch() {
    echo "📢 Mengirim notifikasi peluncuran demo..."
    
    # Kirim email
    npx ts-node ./scripts/send_demo_notification.ts
    
    # Posting media sosial
    npx ts-node ./scripts/social_demo_announce.ts
}

# Main Deployment Workflow
main() {
    prepare_demo_data
    configure_demo_environment
    deploy_to_cloud
    setup_demo_access
    notify_demo_launch
    
    echo "🎉 Demo SiPaLe Berhasil Diluncurkan!"
    echo "Akses di: https://${DEMO_DOMAIN}"
}

# Jalankan
main