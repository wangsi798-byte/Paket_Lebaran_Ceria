const { MongoClient } = require('mongodb');

async function connectToMongoDB() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/';
    
    const client = new MongoClient(uri);

    try {
        console.log('🔌 Mencoba koneksi ke MongoDB Atlas...');
        
        // Koneksi
        await client.connect();
        console.log('✅ Koneksi berhasil!');

        // Dapatkan daftar database
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        
        console.log('\n📂 Database yang tersedia:');
        dbs.databases.forEach(db => {
            console.log(`- ${db.name}`);
        });

        // Pilih database sipale
        const sipaleDb = client.db('sipale');
        
        // Cek atau buat koleksi test
        const testCollection = sipaleDb.collection('test_connection');
        await testCollection.insertOne({ 
            message: 'Koneksi berhasil', 
            timestamp: new Date() 
        });

        console.log('\n🧪 Tes Insersi Data: Sukses');

        // Tutup koneksi
        await client.close();
        console.log('\n🎉 Diagnostik Selesai!');
    } catch (error) {
        console.error('❌ Gagal terkoneksi:');
        console.error('Nama Error:', error.name);
        console.error('Pesan Error:', error.message);
    }
}

connectToMongoDB();