const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fullDiagnostic() {
    const uri = 'mongodb+srv://admin_paket:SFpJ5OZLR8IDTfOR@cluster0.5zrevvj.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

    try {
        console.log('🔍 MongoDB Comprehensive Diagnostic');
        console.log('----------------------------------');
        
        // Sembunyikan password
        const safeURI = uri.replace(/:[^:]*@/, ':****@');
        console.log('Connection URI:', safeURI);

        // Tambahkan opsi database
        const options = { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        };

        console.log('\n🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connection Successful!');

        // Dapatkan daftar database
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        
        console.log('\n📂 Available Databases:');
        dbs.databases.forEach(db => {
            console.log(`- ${db.name}`);
        });

        // Pilih atau buat database sipale
        const database = client.db('sipale');
        
        // Cek atau buat koleksi test
        const testCollection = database.collection('test_collection');
        await testCollection.insertOne({ 
            test: 'Koneksi berhasil', 
            timestamp: new Date() 
        });

        console.log('\n🧪 Test Collection Creation: Successful');

        // Tutup koneksi
        await client.close();

        console.log('\n🎉 Full Diagnostic Complete!');
        console.log('All systems operational and ready.');
    } catch (error) {
        console.error('❌ Diagnostic Failed');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        
        console.error('\n💡 Troubleshooting Tips:');
        console.error('1. Check network connection');
        console.error('2. Verify MongoDB Atlas settings');
        console.error('3. Ensure IP is whitelisted');
        console.error('4. Confirm database user permissions');
    }
}

fullDiagnostic();