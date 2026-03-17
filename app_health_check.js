const mongoose = require('mongoose');
const User = require('/root/.openclaw/workspace/sipale/backend/src/models/User');

async function healthCheck() {
    try {
        // Koneksi MongoDB
        console.log('🔍 Memeriksa Koneksi MongoDB...');
        await mongoose.connect(
            'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale', 
            {}
        );

        console.log('✅ Koneksi MongoDB Berhasil');

        // Cek Pengguna
        console.log('\n👥 Pengguna Terdaftar:');
        const users = await User.find();
        console.log(`Total Pengguna: ${users.length}`);
        
        users.forEach(user => {
            console.log(`- ${user.nama} (${user.role}): ${user.nomorHP}`);
        });

        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

healthCheck();