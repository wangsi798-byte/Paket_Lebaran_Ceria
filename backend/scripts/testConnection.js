const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Koneksi MongoDB berhasil!');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Gagal koneksi ke MongoDB:', error);
    }
}

testConnection();