#!/bin/bash

# Backend
cd /root/.openclaw/workspace/sipale/backend
echo "📦 Instalasi Backend..."
npm install
npm run dev &
BACKEND_PID=$!

# Frontend
cd /root/.openclaw/workspace/sipale/frontend
echo "🖥️ Instalasi Frontend..."
npm install
REACT_APP_API_URL=http://localhost:5000 npm start &
FRONTEND_PID=$!

# Informasi
echo "🌐 Aplikasi Berjalan:"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"

# Tunggu proses
wait