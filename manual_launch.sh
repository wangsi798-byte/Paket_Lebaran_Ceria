#!/bin/bash

# Backend
cd /root/.openclaw/workspace/sipale/backend
echo "🚀 Memulai Backend..."
npm run dev &
BACKEND_PID=$!

# Frontend
cd /root/.openclaw/workspace/sipale/frontend
echo "💻 Memulai Frontend..."
REACT_APP_API_URL=http://localhost:5000 npm start &
FRONTEND_PID=$!

# Tunggu sebentar
sleep 15

# Informasi
echo "🌐 Aplikasi berjalan:"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"

# Akun Default:
echo "👥 Akun:"
echo "- Admin: 083456789012"
echo "- Kolektor: 082345678901"
echo "- Peserta: 081234567890"