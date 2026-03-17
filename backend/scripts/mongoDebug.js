const mongoose = require('mongoose');
require('dotenv').config();

async function fullDiagnostic() {
    try {
        console.log('🔍 MongoDB Diagnostic Tool');
        console.log('------------------------');
        
        // Log URI (tanpa password)
        const safeURI = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');
        console.log('Connection URI:', safeURI);

        // Koneksi
        console.log('\n🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connection Successful!');

        // Cek status koneksi
        const connection = mongoose.connection;
        console.log('\n📡 Connection Details:');
        console.log('Host:', connection.host);
        console.log('Port:', connection.port);
        console.log('Database Name:', connection.db.databaseName);

        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Connection Error:', error);
        
        // Detail error
        console.error('\n🔍 Error Details:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        
        if (error.name === 'MongoError') {
            console.error('\n💡 Possible Solutions:');
            console.error('- Check MongoDB URI');
            console.error('- Verify network access');
            console.error('- Ensure IP whitelisted in MongoDB Atlas');
        }
    }
}

fullDiagnostic();