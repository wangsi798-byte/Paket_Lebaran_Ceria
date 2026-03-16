#!/bin/bash

# Cek Backend
echo "🔍 Memeriksa Backend..."
curl -s http://localhost:5000/health | jq .

# Cek koneksi MongoDB
echo -e "\n🗄️ Memeriksa Koneksi MongoDB..."
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Koneksi MongoDB Sehat');
    mongoose.connection.close();
})
.catch(err => console.error('❌ Koneksi MongoDB Bermasalah:', err));
"

# Cek jumlah pengguna
echo -e "\n👥 Pengguna Terdaftar:"
node -e "
const mongoose = require('mongoose');
const User = require('/root/.openclaw/workspace/sipale/backend/src/models/User');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    const users = await User.find();
    console.log('Total Pengguna:', users.length);
    console.log('Daftar Pengguna:');
    users.forEach(user => {
        console.log(`- ${user.nama} (${user.role}): ${user.nomorHP}`);
    });
    mongoose.connection.close();
})
.catch(err => console.error('Error:', err));
"