const mongoose = require('mongoose');
const User = require('/root/.openclaw/workspace/sipale/backend/src/models/User');
const Setoran = require('/root/.openclaw/workspace/sipale/backend/src/models/Setoran');
const { Paket } = require('/root/.openclaw/workspace/sipale/backend/src/models/Distribusi');

async function debugSeed() {
    try {
        // Koneksi database
        await mongoose.connect(
            'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale', 
            {}
        );

        console.log('🔍 Detail Seed Data:\n');

        // Cek Pengguna
        console.log('👥 Pengguna:');
        const users = await User.find();
        users.forEach(user => {
            console.log(`- Nama: ${user.nama}`);
            console.log(`  Nomor HP: ${user.nomorHP}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Nomor Anggota: ${user.nomorAnggota}\n`);
        });

        // Cek Setoran
        console.log('💰 Setoran:');
        const setorans = await Setoran.find().populate('peserta', 'nama');
        setorans.forEach(setoran => {
            console.log(`- Peserta: ${setoran.peserta.nama}`);
            console.log(`  Jumlah: Rp ${setoran.jumlah}`);
            console.log(`  Status: ${setoran.statusVerifikasi}\n`);
        });

        // Cek Paket
        console.log('📦 Paket:');
        const pakets = await Paket.find();
        pakets.forEach(paket => {
            console.log(`- Nama: ${paket.nama}`);
            console.log(`  Jenis: ${paket.jenisDistribusi}`);
            console.log(`  Nilai: Rp ${paket.nilaiPaket}\n`);
        });

        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

debugSeed();