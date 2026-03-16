const { MongoClient } = require('mongodb');

async function comprehensiveSeedCheck() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/sipale';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('sipale');
        
        console.log('🔍 Pemeriksaan Komprehensif Seed Data\n');

        // Cek Koleksi
        const collections = await database.listCollections().toArray();
        console.log('📂 Koleksi Tersedia:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Cek Pengguna
        const usersCollection = database.collection('users');
        const users = await usersCollection.find().toArray();
        
        console.log('\n👥 Detail Pengguna:');
        users.forEach(user => {
            console.log('---');
            console.log(`Nama: ${user.nama}`);
            console.log(`Nomor HP: ${user.nomorHP}`);
            console.log(`Role: ${user.role}`);
            console.log(`Nomor Anggota: ${user.nomorAnggota}`);
            console.log(`Status: ${user.aktif ? 'Aktif' : 'Tidak Aktif'}`);
        });

        // Statistik Pengguna
        console.log('\n📊 Statistik Pengguna:');
        console.log(`Total Pengguna: ${users.length}`);
        const roleCount = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
        console.log('Berdasarkan Role:', roleCount);

        // Validasi Struktur Data
        console.log('\n🕵️ Validasi Struktur Data:');
        const requiredFields = ['nama', 'nomorHP', 'role', 'nomorAnggota'];
        users.forEach(user => {
            requiredFields.forEach(field => {
                if (!user[field]) {
                    console.warn(`❗ Peringatan: Pengguna ${user.nama} tidak memiliki field ${field}`);
                }
            });
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

comprehensiveSeedCheck();