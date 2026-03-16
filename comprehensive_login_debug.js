const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api/auth';
const LOG_FILE = path.join(__dirname, 'login_debug.log');

// Fungsi logging khusus
function logDebug(message, data = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        message,
        ...data
    };

    // Tulis ke file log
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
    
    // Log ke konsol
    console.log(JSON.stringify(logEntry, null, 2));
}

// Akun untuk simulasi
const TEST_ACCOUNTS = [
    {
        nomorHP: '081234567890',   // Peserta
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

async function kirimOTPDetailed(account) {
    try {
        logDebug('Mengirim OTP', { 
            nomorHP: account.nomorHP, 
            nama: account.nama 
        });

        const response = await axios.post(`${BASE_URL}/kirim-otp`, { 
            nomorHP: account.nomorHP 
        });
        
        logDebug('Respon Kirim OTP', {
            nomorHP: account.nomorHP,
            status: response.data.status,
            message: response.data.message,
            debug: response.data.debug || null
        });

        return response.data;
    } catch (error) {
        logDebug('Gagal Kirim OTP', {
            nomorHP: account.nomorHP,
            error: error.response ? error.response.data : error.message
        });
        throw error;
    }
}

async function verifikasiOTPDetailed(account, otp) {
    try {
        logDebug('Verifikasi OTP', { 
            nomorHP: account.nomorHP,
            otp: otp
        });

        const response = await axios.post(`${BASE_URL}/verifikasi-otp`, { 
            nomorHP: account.nomorHP,
            otp
        });
        
        logDebug('Respon Verifikasi OTP', {
            nomorHP: account.nomorHP,
            status: response.data.status,
            message: response.data.message
        });

        return response.data;
    } catch (error) {
        logDebug('Gagal Verifikasi OTP', {
            nomorHP: account.nomorHP,
            error: error.response ? error.response.data : error.message
        });
        throw error;
    }
}

async function testProfilDetailed(token, account) {
    try {
        logDebug('Mengambil Profil', { 
            nama: account.nama,
            role: account.role 
        });

        const response = await axios.get(`${BASE_URL}/profil`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        logDebug('Respon Profil', {
            nama: account.nama,
            status: response.data.status,
            role: response.data.data.role
        });

        return response.data;
    } catch (error) {
        logDebug('Gagal Ambil Profil', {
            nama: account.nama,
            error: error.response ? error.response.data : error.message
        });
        throw error;
    }
}

async function simulasiLoginKomprehensif() {
    // Bersihkan log sebelumnya
    if (fs.existsSync(LOG_FILE)) {
        fs.unlinkSync(LOG_FILE);
    }

    logDebug('Memulai Simulasi Login Komprehensif');

    const hasilLogin = [];

    for (const account of TEST_ACCOUNTS) {
        try {
            logDebug('Proses Login', { 
                nama: account.nama, 
                nomorHP: account.nomorHP 
            });

            // Kirim OTP
            await kirimOTPDetailed(account);
            
            // OTP default untuk testing (dalam production, ini akan dinamis)
            const otp = '123456';
            
            // Verifikasi OTP
            const loginResponse = await verifikasiOTPDetailed(account, otp);
            
            // Test profil
            const profilResponse = await testProfilDetailed(
                loginResponse.data.token, 
                account
            );
            
            hasilLogin.push({
                nama: account.nama,
                status: 'Berhasil',
                role: loginResponse.data.user.role
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
    logDebug('Ringkasan Login', { hasilLogin });

    return hasilLogin;
}

// Jalankan simulasi
simulasiLoginKomprehensif()
    .then(() => logDebug('Simulasi Login Selesai'))
    .catch(error => logDebug('Error Simulasi Login', { error: error.message }));