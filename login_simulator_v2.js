const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

async function simulasiLogin(nomorHP) {
    try {
        console.log(`🔍 Login untuk ${nomorHP}`);
        
        // Kirim OTP
        const kirimOTPResponse = await axios.post(`${BASE_URL}/kirim-otp`, { nomorHP });
        console.log('✉️ Kirim OTP:', kirimOTPResponse.data);

        // Tunggu input OTP
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const otp = await new Promise(resolve => {
            readline.question('📬 Masukkan OTP: ', otp => {
                readline.close();
                resolve(otp);
            });
        });

        // Verifikasi OTP
        const verifikasiOTPResponse = await axios.post(`${BASE_URL}/verifikasi-otp`, {
            nomorHP,
            otp
        });

        console.log('🎉 Login Berhasil!');
        console.log('Token:', verifikasiOTPResponse.data.data.token);
        console.log('Pengguna:', verifikasiOTPResponse.data.data.user);

        // Ambil profil
        const profilResponse = await axios.get(`${BASE_URL}/profil`, {
            headers: {
                'Authorization': `Bearer ${verifikasiOTPResponse.data.data.token}`
            }
        });

        console.log('👤 Detail Profil:', profilResponse.data.data);

        return verifikasiOTPResponse.data.data.token;
    } catch (error) {
        console.error('❌ Login Gagal:', 
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

// Daftar nomor HP untuk login
const nomorHPList = [
    '081234567890',   // Peserta Ahmad
    '082345678901',   // Kolektor
    '083456789012'    // Admin
];

async function mainSimulator() {
    for (const nomorHP of nomorHPList) {
        console.log('\n' + '='.repeat(40));
        try {
            await simulasiLogin(nomorHP);
        } catch (error) {
            console.error(`Gagal login untuk ${nomorHP}`);
        }
    }
}

mainSimulator();