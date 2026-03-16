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

        // Data peserta dengan periode nabung
        const pesertaData = [
            {
                nama: 'Ahmad',
                nomorHP: '081100001111',
                role: 'peserta',
                targetAkhirTabungan: 1000000,
                paketPilihan: 'uang_tunai',
                periodeMulai: new Date('2026-03-01'),
                frekuensiNabung: 'mingguan'
            },
            {
                nama: 'Budi',
                nomorHP: '081122223333',
                role: 'peserta',
                targetAkhirTabungan: 1500000,
                paketPilihan: 'sembako',
                periodeMulai: new Date('2026-03-01'),
                frekuensiNabung: 'bulanan'
            },
            {
                nama: 'Citra',
                nomorHP: '081144445555',
                role: 'peserta',
                targetAkhirTabungan: 2000000,
                paketPilihan: 'keduanya',
                periodeMulai: new Date('2026-03-01'),
                frekuensiNabung: 'fleksibel'
            }
        ];

        // Hapus data existing
        await User.deleteMany({role: 'peserta'});
        await Setoran.deleteMany({});

        // Buat peserta
        const pesertas = await User.create(pesertaData);
        console.log('Peserta dibuat:', pesertas.map(p => p.nama));

        // Generate setoran untuk peserta
        const setoranData = [];
        const metodeBayar = ['tunai', 'transfer'];

        pesertas.forEach((peserta, index) => {
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
                    kolektor: null, // Bisa diisi dengan kolektor yang sesuai
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

        // Tutup koneksi
        await mongoose.connection.close();
        console.log('Seed data selesai');
    } catch (error) {
        console.error('Error saat seed data:', error);
        process.exit(1);
    }
}

// Jalankan seed
seedData();