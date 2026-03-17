#!/bin/bash

# Lokasi Frontend
FRONTEND_DIR="/root/.openclaw/workspace/sipale/frontend"

# Pindah ke direktori frontend
cd "$FRONTEND_DIR"

# Bersihkan cache npm
npm cache clean --force

# Install dependensi
npm install

# Cek versi
echo "📦 Versi Node.js: $(node --version)"
echo "📦 Versi npm: $(npm --version)"
echo "📦 Versi React: $(npm list react | grep react@)"

# Coba start
REACT_APP_API_URL=http://localhost:5000 npm start