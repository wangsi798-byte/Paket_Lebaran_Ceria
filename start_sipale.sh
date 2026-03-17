#!/bin/bash

# SiPaLe Startup Script

# Reset seed data
cd /root/.openclaw/workspace/sipale/backend
npm run reset:seed
npm run seed
npm run seed:paket

# Jalankan backend
npm start &

# Tunggu backend siap
sleep 10

# Buka browser
xdg-open http://localhost:5000 || \
open http://localhost:5000 || \
start http://localhost:5000