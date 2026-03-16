const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Setoran = require('../src/models/Setoran');

// Muat environment variables
dotenv.config();

async function seedData() {
    try {
        // Koneksi ke database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Hapus data existing
        await User.deleteMany({});
        await Setoran.deleteMany({});

        // Buat kolektor
        const kolektorData = {
            nama: 'Kolektor Utama',
            nomorHP: '082200001111',
            role: 'kolektor',
            nomorAnggota: 'KOL' + Date.now().toString().slice(-6),
            wilayah: 'Desa Contoh',
            aktif: true
        };

        const kolektor = await User.create(kolektorData);
        console.log('Kolektor dibuat:', kolektor.nama);

        // Data peserta dengan periode nabung
        const pesertaData = [
            {
                nama: 'Ahmad',
                nomorHP: '081100001111',
                role: 'peserta',
                targetAkhirTabungan: 1000000,
                paketPilihan: 'uang_tunai',
                nomorAnggota: 'PES' + (Date.now() + 1).toString().slice(-6),
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'mingguan',
                aktif: true
            },
            {
                nama: 'Budi',
                nomorHP: '081122223333',
                role: 'peserta',
                targetAkhirTabungan: 1500000,
                paketPilihan: 'sembako',
                nomorAnggota: 'PES' + (Date.now() + 2).toString().slice(-6),
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'bulanan',
                aktif: true
            }
        ];

        // Buat peserta
        const pesertas = await User.create(pesertaData);
        console.log('Peserta dibuat:', pesertas.map(p => ({
            nama: p.nama,
            nomorHP: p.nomorHP,
            nomorAnggota: p.nomorAnggota
        })));

        // Generate setoran untuk peserta
        const setoranData = [];
        const metodeBayar = ['tunai', 'transfer'];

        pesertas.forEach((peserta) => {
            // Buat setoran tersebar di periode nabung
            const jumlahSetoran = Math.floor(Math.random() * 3) + 3;
            
            for (let i = 0; i < jumlahSetoran; i++) {
                // Tanggal setoran acak dalam periode nabung
                const tanggalSetoran = new Date(
                    peserta.periodeMulai.getTime() + 
                    Math.random() * (peserta.periodeBerakhir.getTime() - peserta.periodeMulai.getTime())
                );

                setoranData.push({
                    peserta: peserta._id,
                    kolektor: kolektor._id, // Gunakan kolektor yang sudah dibuat
                    jumlah: Math.floor(Math.random() * 200000) + 50000,
                    metodeBayar: metodeBayar[Math.floor(Math.random() * metodeBayar.length)],
                    statusVerifikasi: 'diverifikasi',
                    createdAt: tanggalSetoran
                });
            }
        });

        // Buat setoran
        const setoran = await Setoran.create(setoranData);
        console.log(`Dibuat ${setoran.length} setoran`);

        // Validasi data
        const userCount = await User.countDocuments();
        const setoranCount = await Setoran.countDocuments();
        
        console.log('Total Pengguna:', userCount);
        console.log('Total Setoran:', setoranCount);

        // Tutup koneksi
        await mongoose.connection.close();
        console.log('Seed data selesai');
    } catch (error) {
        console.error('Error Detail:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        process.exit(1);
    }
}

// Jalankan seed
seedData();