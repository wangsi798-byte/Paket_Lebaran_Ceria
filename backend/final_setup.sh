#!/bin/bash

# Bersihkan dependensi
npm cache clean --force

# Install dependensi
npm install

# Reset seed
npm run reset:seed

# Seed data
npm run seed
npm run seed:paket

# Jalankan server
npm start