const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Paket } = require('../src/models/Distribusi');

// Muat environment variables
dotenv.config();

async function seedPaket() {
    try {
        // Koneksi ke database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Data paket sembako
        const paketSembako = [
            {
                nama: 'Paket Sembako Hemat',
                kategori: 'sembako',
                deskripsi: 'Paket sembako lengkap untuk keluarga',
                harga: 500000,
                stok: 50,
                gambar: '/uploads/sembako-hemat.jpg'
            },
            {
                nama: 'Paket Sembako Premium',
                kategori: 'sembako',
                deskripsi: 'Paket sembako berkualitas tinggi',
                harga: 750000,
                stok: 30,
                gambar: '/uploads/sembako-premium.jpg'
            }
        ];

        // Data paket barang
        const paketBarang = [
            {
                nama: 'Blender Elektronik',
                kategori: 'elektronik',
                deskripsi: 'Blender modern dengan teknologi canggih',
                harga: 600000,
                stok: 20,
                gambar: '/uploads/blender-elektronik.jpg'
            },
            {
                nama: 'Setrika Uap Modern',
                kategori: 'elektronik',
                deskripsi: 'Setrika uap berkualitas tinggi',
                harga: 450000,
                stok: 25,
                gambar: '/uploads/setrika-uap.jpg'
            }
        ];

        // Data paket fashion
        const paketFashion = [
            {
                nama: 'Paket Baju Lebaran Keluarga',
                kategori: 'fashion',
                deskripsi: 'Set baju lebaran untuk keluarga',
                harga: 800000,
                stok: 15,
                gambar: '/uploads/baju-lebaran.jpg'
            }
        ];

        // Hapus data existing
        await Paket.deleteMany({});

        // Buat paket baru
        const semuaPaket = [
            ...paketSembako, 
            ...paketBarang, 
            ...paketFashion
        ];

        const paketDibuat = await Paket.create(semuaPaket);
        console.log('Paket dibuat:', paketDibuat.map(p => p.nama));

        // Tutup koneksi
        await mongoose.connection.close();
        console.log('Seed paket selesai');
    } catch (error) {
        console.error('Error saat seed paket:', error);
        process.exit(1);
    }
}

// Jalankan seed
seedPaket();