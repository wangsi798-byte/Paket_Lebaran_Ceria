#!/bin/bash

# Instal Node.js dan npm
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version

# Persiapan proyek
cd /root/.openclaw/workspace/sipale

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

echo "✅ Dependensi terinstal!"