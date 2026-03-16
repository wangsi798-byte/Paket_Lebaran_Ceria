const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        console.log('Mencoba koneksi...');
        await client.connect();
        console.log('✅ Koneksi berhasil!');
        
        // Dapatkan daftar database
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log('Database yang tersedia:');
        dbs.databases.forEach(db => {
            console.log(db.name);
        });
    } catch (error) {
        console.error('❌ Gagal koneksi:');
        console.error('Nama Error:', error.name);
        console.error('Pesan Error:', error.message);
    } finally {
        await client.close();
    }
}

testConnection();