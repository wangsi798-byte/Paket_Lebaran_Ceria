#!/bin/bash

# Lokasi Frontend
FRONTEND_DIR="/root/.openclaw/workspace/sipale/frontend"

# Pindah ke direktori frontend
cd "$FRONTEND_DIR"

# Build Production
npm run build

# Tampilkan ukuran build
echo "🏗️ Ukuran Build:"
du -sh build

# Tampilkan struktur
echo -e "\n📂 Struktur Build:"
tree build -L 2