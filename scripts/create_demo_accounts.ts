import mongoose from 'mongoose';
import { User } from '../backend/src/models/User';

const DEMO_ACCOUNTS = [
    {
        nama: 'Demo Peserta',
        nomorHP: '081234567890',
        role: 'peserta',
        targetTabungan: 1000000,
        paketPilihan: 'sembako'
    },
    {
        nama: 'Demo Kolektor',
        nomorHP: '082345678901',
        role: 'kolektor',
        wilayah: 'Desa Demo'
    },
    {
        nama: 'Demo Admin',
        nomorHP: '083456789012',
        role: 'admin'
    }
];

async function createDemoAccounts() {
    try {
        // Koneksi database
        await mongoose.connect(process.env.MONGODB_URI || '');

        // Hapus akun demo existing
        await User.deleteMany({ 
            nomorHP: { 
                $in: DEMO_ACCOUNTS.map(account => account.nomorHP) 
            } 
        });

        // Buat akun demo baru
        const demoUsers = await User.create(DEMO_ACCOUNTS);

        console.log('Akun Demo Berhasil Dibuat:');
        demoUsers.forEach(user => {
            console.log(`- ${user.nama} (${user.nomorHP}) - ${user.role}`);
        });

        // Tutup koneksi
        await mongoose.connection.close();
    } catch (error) {
        console.error('Gagal membuat akun demo:', error);
        process.exit(1);
    }
}

createDemoAccounts();