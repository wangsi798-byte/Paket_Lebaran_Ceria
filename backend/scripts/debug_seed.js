const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Setoran = require('../src/models/Setoran');

// Muat environment variables
dotenv.config();

async function debugSeed() {
    try {
        console.log('🔍 Memulai Debug Seed Data');
        
        // Koneksi ke database dengan logging tambahan
        console.log('📡 Mencoba koneksi MongoDB...');
        console.log('URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Timeout 10 detik
            socketTimeoutMS: 45000, // Socket timeout 45 detik
        });

        console.log('✅ Koneksi MongoDB berhasil');

        // Cek koneksi database
        const connection = mongoose.connection;
        console.log('📊 Detail Koneksi:');
        console.log('Host:', connection.host);
        console.log('Port:', connection.port);
        console.log('Database:', connection.db.databaseName);

        // Data peserta untuk debugging
        const pesertaData = [
            {
                nama: 'Debug Ahmad',
                nomorHP: '081100001111',
                role: 'peserta',
                targetAkhirTabungan: 1000000,
                paketPilihan: 'uang_tunai',
                nomorAnggota: 'PES001',
                aktif: true,
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'mingguan'
            }
        ];

        // Logging sebelum operasi
        console.log('🗑️ Menghapus data existing...');
        const deleteResultUser = await User.deleteMany({role: 'peserta'});
        const deleteResultSetoran = await Setoran.deleteMany({});
        
        console.log('Dihapus User:', deleteResultUser.deletedCount);
        console.log('Dihapus Setoran:', deleteResultSetoran.deletedCount);

        // Buat peserta dengan logging detail
        console.log('👥 Membuat peserta...');
        const pesertas = await User.create(pesertaData);
        console.log('Peserta dibuat:', pesertas.map(p => ({
            nama: p.nama,
            nomorHP: p.nomorHP,
            _id: p._id
        })));

        // Generate setoran
        const setoranData = pesertas.map(peserta => ({
            peserta: peserta._id,
            jumlah: 100000,
            metodeBayar: 'tunai',
            statusVerifikasi: 'diverifikasi',
            createdAt: new Date()
        }));

        // Buat setoran
        console.log('💰 Membuat setoran...');
        const setoran = await Setoran.create(setoranData);
        console.log(`Dibuat ${setoran.length} setoran`);

        // Validasi data
        console.log('\n🕵️ Validasi Data:');
        const userCount = await User.countDocuments({role: 'peserta'});
        const setoranCount = await Setoran.countDocuments();
        
        console.log('Total Peserta:', userCount);
        console.log('Total Setoran:', setoranCount);

        // Tutup koneksi
        await mongoose.connection.close();
        console.log('✅ Seed data debug selesai');
    } catch (error) {
        console.error('❌ Error Detail:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Tambahan informasi debugging
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            console.error('Kode Error MongoDB:', error.code);
            console.error('Detail Error:', error.errmsg);
        }

        process.exit(1);
    }
}

// Jalankan debug
debugSeed();