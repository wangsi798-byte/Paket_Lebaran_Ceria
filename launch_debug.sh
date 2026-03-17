#!/bin/bash

# Lokasi project
PROJECT_DIR="/root/.openclaw/workspace/sipale"

# Install dependensi backend
cd "$PROJECT_DIR/backend"
npm install express-validator

# Install dependensi frontend
cd "$PROJECT_DIR/frontend"
npm install

# Tampilkan informasi
echo "🚀 SiPaLe Debugging Mode"
echo "Mencoba jalankan backend dan frontend..."

# Jalankan backend
cd "$PROJECT_DIR/backend"
npm start &
BACKEND_PID=$!

# Jalankan frontend
cd "$PROJECT_DIR/frontend"
npm start &
FRONTEND_PID=$!

# Tunggu sebentar
sleep 15

# Cek status proses
echo "Status Proses:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Akses URL
echo "Akses:"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"

# Akun Default
echo "👥 Akun Default:"
echo "- Peserta: 081100001111 (Ahmad)"
echo "- Peserta: 081122223333 (Budi)"
echo "- Kolektor: 082200001111 (Kolektor Utama)"