#!/bin/bash

# Backend
echo "🚀 Memulai Backend..."
cd /root/.openclaw/workspace/sipale/backend
npm install
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# Frontend
echo "💻 Memulai Frontend..."
cd /root/.openclaw/workspace/sipale/frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Tunggu dan monitor
echo "⏳ Tunggu 30 detik untuk startup..."
sleep 30

# Cek status
echo "🔍 Status Aplikasi:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Lihat log
echo -e "\n📋 Log Backend (terakhir 10 baris):"
tail -n 10 /root/.openclaw/workspace/sipale/backend/backend.log

echo -e "\n📋 Log Frontend (terakhir 10 baris):"
tail -n 10 /root/.openclaw/workspace/sipale/frontend/frontend.log

# Cek koneksi
echo -e "\n🌐 Cek Koneksi:"
curl -v http://localhost:5000/health
curl -v http://localhost:3000