const mongoose = require('mongoose');
const User = require('../src/models/User');
const Setoran = require('../src/models/Setoran');
const { Paket } = require('../src/models/Distribusi');

async function resetAndSeed() {
    try {
        // Koneksi database
        await mongoose.connect(process.env.MONGODB_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Hapus data existing
        await User.deleteMany({});
        await Setoran.deleteMany({});
        await Paket.deleteMany({});

        console.log('✅ Data lama dihapus. Siap untuk seed ulang.');
        
        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('Gagal reset data:', error);
        process.exit(1);
    }
}

resetAndSeed();