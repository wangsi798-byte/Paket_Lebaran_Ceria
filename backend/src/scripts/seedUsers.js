const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const OWNER_USERNAME = process.env.OWNER_USERNAME || 'owner';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'owner123';

const USERS = [
  {
    nama: 'Admin Utama',
    nomorHP: '081234567890', // format lokal, sesuai regex User.nomorHP
    role: 'admin',
    nomorAnggota: 'ADM000001',
    username: OWNER_USERNAME
  },
  {
    nama: 'Kolektor 1',
    nomorHP: '081298765432',
    role: 'kolektor',
    nomorAnggota: 'KOL000001'
  },
  {
    nama: 'Peserta Contoh',
    nomorHP: '081234000999',
    role: 'peserta',
    nomorAnggota: 'PES000001',
    targetAkhirTabungan: 5000000,
    paketPilihan: 'keduanya',
    frekuensiNabung: 'mingguan',
    // Model mewajibkan periodeBerakhir untuk role peserta.
    // Isi eksplisit agar tidak tergantung urutan hook validasi.
    periodeMulai: new Date(),
    periodeBerakhir: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
];

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI belum diset di file .env backend');
      process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET belum diset di file .env backend');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Terhubung ke MongoDB');

    // Pastikan admin/owner punya passwordHash
    const ownerHash = await bcrypt.hash(OWNER_PASSWORD, 12);

    for (const data of USERS) {
      const { nomorHP } = data;
      const existing = await User.findOne({ nomorHP });

      if (existing) {
        // kalau existing admin tapi belum punya passwordHash, lengkapi
        if (existing.role === 'admin' && data.username && !existing.passwordHash) {
          existing.username = data.username;
          existing.passwordHash = ownerHash;
          await existing.save();
          console.log(`Admin ${existing.nama} sudah ada, passwordHash ditambahkan.`);
        } else {
          console.log(`User dengan nomorHP ${nomorHP} sudah ada, lewati.`);
        }
        continue;
      }

      const userData = { ...data };
      if (userData.role === 'admin' && userData.username) {
        userData.passwordHash = ownerHash;
      }

      const user = new User(userData);
      await user.save();
      console.log(`User baru dibuat: ${user.nama} (${user.role}) - ${user.nomorHP}`);
    }

    console.log('Seeding selesai.');
    process.exit(0);
  } catch (err) {
    console.error('Gagal seeding user:', err);
    process.exit(1);
  }
}

main();

