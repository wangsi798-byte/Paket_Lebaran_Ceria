const { MongoClient } = require('mongodb');

async function seedDatabase() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('sipale');
        
        // Koleksi users
        const usersCollection = database.collection('users');
        
        // Data kolektor
        const kolektor = {
            nama: 'Kolektor Utama SiPaLe',
            nomorHP: '082200001111',
            role: 'kolektor',
            nomorAnggota: 'KOL' + Date.now().toString().slice(-6),
            aktif: true
        };

        // Data peserta
        const pesertaData = [
            {
                nama: 'Ahmad Peserta',
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
                nama: 'Budi Peserta',
                nomorHP: '081122223333',
                role: 'peserta',
                targetAkhirTabungan: 1500000,
                paketPilihan: 'sembako',
                nomorAnggota: 'PES' + (Date.now() + 2).toString().slice(-6),
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'bulanan',
                aktif: true
            },
            {
                nama: 'User Test',
                nomorHP: '082121856399',
                role: 'peserta',
                targetAkhirTabungan: 500000,
                paketPilihan: 'uang_tunai',
                nomorAnggota: 'PES' + (Date.now() + 3).toString().slice(-6),
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'harian',
                aktif: true
            }
        ];

        // Insert data
        await usersCollection.insertMany([kolektor, ...pesertaData]);

        console.log('✅ Seed data berhasil');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();