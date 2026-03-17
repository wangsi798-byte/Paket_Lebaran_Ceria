const { MongoClient } = require('mongodb');

async function fixDefaultAccounts() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('sipale');
        const usersCollection = database.collection('users');

        // Data akun default yang diinginkan
        const defaultAccounts = [
            {
                nama: 'Admin SiPaLe',
                nomorHP: '083456789012',
                role: 'admin',
                nomorAnggota: 'ADM' + Date.now().toString().slice(-6),
                aktif: true
            },
            {
                nama: 'Kolektor Utama',
                nomorHP: '082345678901',
                role: 'kolektor',
                nomorAnggota: 'KOL' + Date.now().toString().slice(-6),
                aktif: true
            },
            {
                nama: 'Ahmad Peserta',
                nomorHP: '081234567890',
                role: 'peserta',
                targetAkhirTabungan: 1000000,
                paketPilihan: 'uang_tunai',
                nomorAnggota: 'PES' + (Date.now() + 1).toString().slice(-6),
                periodeMulai: new Date('2026-03-01'),
                periodeBerakhir: new Date('2027-03-01'),
                frekuensiNabung: 'mingguan',
                aktif: true
            }
        ];

        // Hapus akun existing
        await usersCollection.deleteMany({});

        // Insert akun baru
        const result = await usersCollection.insertMany(defaultAccounts);

        console.log('✅ Akun Default Berhasil Dibuat:');
        console.log('Total Akun:', result.insertedCount);
        
        // Cetak detail akun
        defaultAccounts.forEach(account => {
            console.log(`- ${account.nama} (${account.nomorHP}) - ${account.role}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

fixDefaultAccounts();