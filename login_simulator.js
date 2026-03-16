const axios = require('axios');

async function simulasiLogin() {
    const nomorHP = '081100001111'; // Nomor HP peserta Ahmad

    try {
        // Kirim OTP
        const kirimOTPResponse = await axios.post('http://localhost:5000/api/auth/kirim-otp', {
            nomorHP
        });
        console.log('✅ OTP Terkirim:', kirimOTPResponse.data.message);

        // Dapatkan OTP (simulasi)
        const otp = await new Promise(resolve => {
            console.log('🔍 Simulasi OTP: Gunakan OTP yang dicetak di log backend');
            resolve('123456'); // OTP default untuk testing
        });

        // Verifikasi OTP
        const verifikasiOTPResponse = await axios.post('http://localhost:5000/api/auth/verifikasi-otp', {
            nomorHP,
            otp
        });

        console.log('🎉 Login Berhasil!');
        console.log('Token:', verifikasiOTPResponse.data.data.token);
        console.log('Detail Pengguna:', verifikasiOTPResponse.data.data.user);

        // Ambil profil
        const profilResponse = await axios.get('http://localhost:5000/api/auth/profil', {
            headers: {
                'Authorization': `Bearer ${verifikasiOTPResponse.data.data.token}`
            }
        });

        console.log('👤 Profil Pengguna:', profilResponse.data.data);

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

simulasiLogin();