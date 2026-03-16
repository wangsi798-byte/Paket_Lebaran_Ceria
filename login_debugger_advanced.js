const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api/auth';
const CREDENTIALS_FILE = path.join(__dirname, 'login_credentials.json');

// Akun untuk simulasi dengan informasi tambahan
const TEST_ACCOUNTS = [
    {
        nomorHP: '081234567890',   // Peserta Ahmad
        nama: 'Ahmad Peserta',
        role: 'peserta',
        expectedOTPLength: 6
    },
    {
        nomorHP: '082345678901',   // Kolektor
        nama: 'Kolektor Utama',
        role: 'kolektor',
        expectedOTPLength: 6
    },
    {
        nomorHP: '083456789012',   // Admin
        nama: 'Admin SiPaLe',
        role: 'admin',
        expectedOTPLength: 6
    }
];

// Fungsi untuk menunggu dengan promise
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function kirimOTP(account) {
    try {
        console.log(`📬 Mengirim OTP ke ${account.nama} (${account.nomorHP})...`);
        
        const response = await axios.post(`${BASE_URL}/kirim-otp`, { 
            nomorHP: account.nomorHP 
        });
        
        console.log('✉️ Respon Kirim OTP:', response.data);
        
        // Validasi respon
        if (response.data.status !== 'success') {
            throw new Error('Gagal mengirim OTP');
        }

        return response.data;
    } catch (error) {
        console.error(`❌ Gagal kirim OTP untuk ${account.nama}:`, 
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

async function verifikasiOTP(account, otp) {
    try {
        console.log(`🔐 Verifikasi OTP untuk ${account.nama}...`);
        
        const response = await axios.post(`${BASE_URL}/verifikasi-otp`, { 
            nomorHP: account.nomorHP,
            otp
        });
        
        console.log('🎉 Respon Verifikasi:', response.data);
        
        // Validasi respon
        if (response.data.status !== 'success') {
            throw new Error('Gagal verifikasi OTP');
        }

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
        console.error(`❌ Gagal verifikasi OTP untuk ${account.nama}:`, 
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

async function testProfil(token) {
    try {
        const response = await axios.get(`${BASE_URL}/profil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('👤 Profil Pengguna:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Gagal mengambil profil:', 
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

async function simulasiLoginLengkap() {
    console.log('🚀 Simulasi Login Komprehensif SiPaLe\n');
    
    const hasilLogin = [];

    for (const account of TEST_ACCOUNTS) {
        try {
            console.log(`\n🔍 Proses Login: ${account.nama}`);
            
            // Kirim OTP
            await kirimOTP(account);
            
            // OTP default untuk testing (dalam production, ini akan dinamis)
            const otp = '123456';
            
            // Verifikasi OTP
            const credentials = await verifikasiOTP(account, otp);
            
            // Test profil
            await testProfil(credentials.token);
            
            hasilLogin.push({
                nama: account.nama,
                status: 'Berhasil',
                role: credentials.user.role
            });

        } catch (error) {
            hasilLogin.push({
                nama: account.nama,
                status: 'Gagal',
                error: error.message
            });
        }
    }

    // Tampilkan ringkasan
    console.log('\n📊 Ringkasan Login:');
    hasilLogin.forEach(hasil => {
        console.log(`- ${hasil.nama}: ${hasil.status}`);
    });
}

// Jalankan simulasi
simulasiLoginLengkap().catch(console.error);