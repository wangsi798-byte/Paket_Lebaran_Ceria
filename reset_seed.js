const mongoose = require('mongoose');
const User = require('/root/.openclaw/workspace/sipale/backend/src/models/User');
const Setoran = require('/root/.openclaw/workspace/sipale/backend/src/models/Setoran');
const { Paket } = require('/root/.openclaw/workspace/sipale/backend/src/models/Distribusi');

async function resetSeed() {
    try {
        // Koneksi database
        await mongoose.connect(
            'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale', 
            {}
        );

        console.log('🧹 Membersihkan data existing...');
        
        // Hapus data existing
        await User.deleteMany({});
        await Setoran.deleteMany({});
        await Paket.deleteMany({});

        console.log('🌱 Melakukan Seed Data Baru...');

        // Buat Kolektor
        const kolektor = new User({
            nama: 'Kolektor Utama',
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

        // Buat Paket
        const paketData = [
            {
                nama: 'Paket Sembako Hemat',
                deskripsi: 'Paket sembako untuk keluarga kecil',
                nilaiPaket: 500000,
                jenisDistribusi: 'sembako'
            },
            {
                nama: 'Paket Sembako Premium',
                deskripsi: 'Paket sembako lengkap berkualitas',
                nilaiPaket: 1000000,
                jenisDistribusi: 'sembako'
            }
        ];

        const pakets = await Paket.create(paketData);

        // Buat Setoran
        const setoranData = peserta.flatMap(p => {
            const metodeBayar = ['tunai', 'transfer'];
            return [1, 2, 3].map(() => ({
                peserta: p._id,
                kolektor: kolektor._id,
                jumlah: Math.floor(Math.random() * 200000) + 50000,
                metodeBayar: metodeBayar[Math.floor(Math.random() * metodeBayar.length)],
                statusVerifikasi: 'diverifikasi'
            }));
        });

        await Setoran.create(setoranData);

        console.log('✅ Seed Data Berhasil:');
        console.log(`- Kolektor: ${kolektor.nama}`);
        console.log(`- Peserta: ${peserta.map(p => p.nama).join(', ')}`);
        console.log(`- Paket: ${pakets.map(p => p.nama).join(', ')}`);

        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetSeed();