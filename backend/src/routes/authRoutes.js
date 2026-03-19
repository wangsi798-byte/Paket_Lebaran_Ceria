const express = require('express');
const router = express.Router();

// Controller
const authController = require('../controllers/authController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Rute OTP
router.post('/kirim-otp', authController.kirimOTP);
router.post('/verifikasi-otp', authController.verifikasiOTP);

// Rute Owner (username/password)
router.post('/login-owner', authController.loginOwner);

// Rute Profil
router.get('/profil', authMiddleware, authController.profilPengguna);

// Handler untuk rute yang tidak ditemukan
router.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rute autentikasi tidak ditemukan'
    });
});

module.exports = router;