const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api/auth';
const CREDENTIALS_FILE = path.join(__dirname, 'login_credentials.json');

// Akun untuk simulasi
const TEST_ACCOUNTS = [
    {
        nomorHP: '081234567890',   // Peserta Ahmad
        nama: 'Ahmad Peserta',
        role: 'peserta'
    },
    {
        nomorHP: '082345678901',   // Kolektor
        nama: 'Kolektor Utama',
        role: 'kolektor'
    },
    {
        nomorHP: '083456789012',   // Admin
        nama: 'Admin SiPaLe',
        role: 'admin'
    }
];

async function kirimOTP(nomorHP) {
    try {
        const response = await axios.post(`${BASE_URL}/kirim-otp`, { nomorHP });
        console.log(`✉️ OTP dikirim ke ${nomorHP}:`, response.data.message);
        return true;
    } catch (error) {
        console.error(`❌ Gagal kirim OTP untuk ${nomorHP}:`, 
            error.response ? error.response.data : error.message
        );
        return false;
    }
}

async function verifikasiOTP(nomorHP, otp) {
    try {
        const response = await axios.post(`${BASE_URL}/verifikasi-otp`, { 
            nomorHP, 
            otp 
        });
        
        console.log(`🎉 Login Berhasil untuk ${nomorHP}`);
        
        // Simpan kredensial
        const credentials = {
            token: response.data.data.token,
            user: response.data.data.user
        };
        
        fs.writeFileSync(
            CREDENTIALS_FILE, 
            JSON.stringify(credentials, null, 2)
        );

        return credentials;
    } catch (error) {
        console.error(`❌ Verifikasi OTP Gagal untuk ${nomorHP}:`, 
            error.response ? error.response.data : error.message
        );
        return null;
    }
}

async function simulasiLogin() {
    console.log('🚀 Simulasi Login SiPaLe\n');
    
    for (const account of TEST_ACCOUNTS) {
        console.log(`🔐 Login: ${account.nama} (${account.nomorHP})`);
        
        // Kirim OTP
        const otpTerkirim = await kirimOTP(account.nomorHP);
        if (!otpTerkirim) continue;

        // OTP default untuk testing
        const otp = '123456';
        
        // Verifikasi OTP
        const credentials = await verifikasiOTP(account.nomorHP, otp);
        
        if (credentials) {
            console.log('👤 Detail Pengguna:');
            console.log(`- Nama: ${credentials.user.nama}`);
            console.log(`- Role: ${credentials.user.role}`);
            console.log(`- Nomor Anggota: ${credentials.user.nomorAnggota}\n`);
        }
    }
}

// Jalankan simulasi
simulasiLogin().catch(console.error);