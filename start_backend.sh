#!/bin/bash

# Pindah ke direktori backend
cd /root/.openclaw/workspace/sipale/backend

# Reset dan seed data
npm run reset:seed
npm run seed
npm run seed:paket

# Jalankan backend
node src/server.js