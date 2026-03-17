const mongoose = require('mongoose');
const User = require('/root/.openclaw/workspace/sipale/backend/src/models/User');
const Setoran = require('/root/.openclaw/workspace/sipale/backend/src/models/Setoran');
const { Paket } = require('/root/.openclaw/workspace/sipale/backend/src/models/Distribusi');

const MONGODB_URI = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale';

async function conectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        });
        console.log('✅ Koneksi MongoDB Berhasil');
    } catch (error) {
        console.error('❌ Koneksi MongoDB Gagal:', error);
        process.exit(1);
    }
}

async function resetData() {
    try {
        await conectDB();

        console.log('🧹 Menghapus data existing...');
        
        // Hapus dengan promise dan timeout
        await Promise.race([
            User.deleteMany({}),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);

        await Promise.race([
            Setoran.deleteMany({}),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);

        await Promise.race([
            Paket.deleteMany({}),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]);

        console.log('🌱 Membuat data baru...');

        // Buat Kolektor
        const kolektor = new User({
            nama: 'Kolektor Utama SiPaLe',
            nomorHP: '082200001111',
            role: 'kolektor',
            nomorAnggota: 'KOL' + Date.now().toString().slice(-6),
            aktif: true
        });
        await kolektor.save();

        // Buat Peserta
        const pesertaData = [
            {
                nama: 'Ahmad Peserta',
                nomorHP: '081100001111',
                role: 'peserta',
                targetAkhirTabungan: 1000000,
                paketPilihan: 'uang_tunai',
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'mingguan',
                aktif: true
            },
            {
                nama: 'Budi Peserta',
                nomorHP: '081122223333',
                role: 'peserta',
                targetAkhirTabungan: 1500000,
                paketPilihan: 'sembako',
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'bulanan',
                aktif: true
            }
        ];

        const peserta = await User.create(pesertaData);

        console.log('✅ Data Berhasil Dibuat');
        console.log('Pengguna:', peserta.map(p => p.nama).join(', '));

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetData();