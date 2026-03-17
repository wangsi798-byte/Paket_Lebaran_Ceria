#!/bin/bash

# Instalasi dan Setup Backend SiPaLe

# Instal dependensi
npm install

# Reset dan seed data
npm run reset:seed
npm run seed
npm run seed:paket

# Jalankan server
npm start