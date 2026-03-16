const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

async function fullDiagnostic() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        console.log('🔍 Comprehensive MongoDB Diagnostic Tool');
        console.log('---------------------------------------');
        
        // Sembunyikan password di log
        const safeURI = uri.replace(/:[^:]*@/, ':****@');
        console.log('Connection URI:', safeURI);

        // Koneksi menggunakan MongoDB driver
        console.log('\n🔌 Connecting with MongoDB Driver...');
        await client.connect();
        console.log('✅ MongoDB Driver Connection Successful!');

        // Periksa database
        const database = client.db('sipale');
        console.log('\n📂 Database Information:');
        console.log('Database Name:', database.databaseName);

        // Periksa koleksi
        const collections = await database.listCollections().toArray();
        console.log('\n📋 Existing Collections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Koneksi menggunakan Mongoose
        console.log('\n🌐 Connecting with Mongoose...');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Mongoose Connection Successful!');

        // Cek status Mongoose
        console.log('\n🔧 Mongoose Connection Details:');
        console.log('Ready State:', mongoose.connection.readyState);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);

        // Tutup koneksi
        await client.close();
        await mongoose.connection.close();

        console.log('\n🎉 Diagnostic Complete - All Systems Operational!');
    } catch (error) {
        console.error('❌ Connection Error:', error);
        
        // Detail error
        console.error('\n🔍 Detailed Error Information:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        
        // Panduan troubleshooting
        console.error('\n💡 Troubleshooting Suggestions:');
        console.error('1. Verify MongoDB Atlas connection string');
        console.error('2. Check network/firewall settings');
        console.error('3. Ensure IP is whitelisted in MongoDB Atlas');
        console.error('4. Verify database user permissions');
    }
}

fullDiagnostic();