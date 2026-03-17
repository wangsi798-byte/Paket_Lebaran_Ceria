#!/bin/bash

# Lokasi Frontend
FRONTEND_DIR="/root/.openclaw/workspace/sipale/frontend"

# Pindah ke direktori frontend
cd "$FRONTEND_DIR"

# Instal react-scripts global
npm install -g react-scripts

# Instal dependensi proyek
npm install

# Build produksi
npm run build

# Tampilkan informasi
echo "🏗️ Build Frontend Selesai"
echo "Lokasi: $FRONTEND_DIR/build"

# Tampilkan struktur
echo -e "\n📂 Struktur Build:"
tree build || find build -type d