#!/bin/bash

# Cek port backend
echo "🔍 Memeriksa Port Backend (5000):"
nc -z localhost 5000
BACKEND_STATUS=$?

# Cek port frontend
echo "🌐 Memeriksa Port Frontend (3000):"
nc -z localhost 3000
FRONTEND_STATUS=$?

# Cek proses
echo "📋 Daftar Proses:"
ps aux | grep -E "node|npm|react-scripts"

# Status
if [ $BACKEND_STATUS -eq 0 ]; then
    echo "✅ Backend berjalan di port 5000"
else
    echo "❌ Backend TIDAK berjalan di port 5000"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo "✅ Frontend berjalan di port 3000"
else
    echo "❌ Frontend TIDAK berjalan di port 3000"
fi