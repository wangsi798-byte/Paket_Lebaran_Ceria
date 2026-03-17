const axios = require('axios');

async function debugLogin(nomorHP) {
    const BASE_URL = 'http://localhost:5000/api/auth';

    try {
        console.log(`🔍 Mencoba login dengan nomor HP: ${nomorHP}`);

        // Kirim OTP
        const kirimOTPResponse = await axios.post(`${BASE_URL}/kirim-otp`, { nomorHP });
        console.log('✉️ OTP Response:', kirimOTPResponse.data);

        // Simulasi verifikasi OTP (untuk debugging)
        const verifikasiOTPResponse = await axios.post(`${BASE_URL}/verifikasi-otp`, {
            nomorHP,
            otp: '123456' // OTP default untuk testing
        });

        console.log('🎉 Login Berhasil!');
        console.log('Token:', verifikasiOTPResponse.data.data.token);
        console.log('Pengguna:', verifikasiOTPResponse.data.data.user);

    } catch (error) {
        console.error('❌ Login Gagal:', 
            error.response ? error.response.data : error.message
        );
    }
}

// Daftar nomor HP untuk dicoba
const nomorHPList = [
    '081100001111',  // Ahmad
    '081122223333',  // Budi
    '082200001111'   // Kolektor
];

// Jalankan debugging untuk setiap nomor
nomorHPList.forEach(nomorHP => {
    console.log('\n' + '='.repeat(40));
    debugLogin(nomorHP);
});