const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Generate OTP yang lebih aman
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Kirim OTP
exports.kirimOTP = async (req, res) => {
    try {
        const { nomorHP } = req.body;

        logger.info(`Permintaan kirim OTP`, { nomorHP });

        // Validasi format nomor HP
        if (!/^(^\+62|62|0)8[1-9][0-9]{6,10}$/.test(nomorHP)) {
            logger.warn(`Gagal kirim OTP: Format nomor HP invalid`, { nomorHP });
            return res.status(400).json({
                status: 'error',
                message: 'Format nomor HP tidak valid'
            });
        }

        // Cari user berdasarkan nomor HP
        const user = await User.findOne({ nomorHP });

        if (!user) {
            logger.warn(`Gagal kirim OTP: Nomor HP tidak terdaftar`, { nomorHP });
            return res.status(404).json({
                status: 'error',
                message: 'Nomor HP tidak terdaftar'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // OTP berlaku 30 menit
        const otpExpires = new Date(Date.now() + 30 * 60 * 1000);

        // Update user dengan OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Log OTP untuk debugging (hapus di production)
        logger.info(`OTP dikirim`, { 
            nomorHP, 
            otp: process.env.NODE_ENV === 'development' ? otp : '******',
            expires: otpExpires 
        });

        res.status(200).json({
            status: 'success',
            message: 'OTP berhasil dikirim',
            debug: process.env.NODE_ENV === 'development' ? { 
                expires: otpExpires.toISOString(),
                otp 
            } : undefined
        });
    } catch (error) {
        logger.error(`Error kirim OTP`, { 
            error: error.message,
            stack: error.stack,
            nomorHP: req.body.nomorHP 
        });
        
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengirim OTP',
            error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
        });
    }
};

// Verifikasi OTP
exports.verifikasiOTP = async (req, res) => {
    try {
        const { nomorHP, otp } = req.body;

        logger.info(`Permintaan verifikasi OTP`, { nomorHP });

        // Validasi input
        if (!nomorHP || !otp) {
            logger.warn(`Verifikasi OTP gagal: Input tidak lengkap`, { nomorHP });
            return res.status(400).json({
                status: 'error',
                message: 'Nomor HP dan OTP harus diisi'
            });
        }

        // Cari user dengan OTP yang cocok dan belum expire
        const user = await User.findOne({ 
            nomorHP, 
            otp,
            otpExpires: { $gt: new Date() }
        });

        if (!user) {
            logger.warn(`Verifikasi OTP gagal: OTP tidak valid`, { 
                nomorHP, 
                otpProvided: otp 
            });
            return res.status(400).json({
                status: 'error',
                message: 'OTP tidak valid atau sudah kadaluarsa'
            });
        }

        // Generate token dengan masa berlaku 7 hari
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
            }, 
            process.env.JWT_SECRET
        );

        // Catat login
        logger.info(`Login berhasil`, {
            userId: user._id,
            role: user.role,
            nomorHP
        });

        // Bersihkan OTP setelah verifikasi
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user._id,
                    nama: user.nama,
                    role: user.role,
                    nomorAnggota: user.nomorAnggota
                }
            }
        });
    } catch (error) {
        logger.error(`Error verifikasi OTP`, { 
            error: error.message,
            stack: error.stack,
            nomorHP: req.body.nomorHP 
        });
        
        res.status(500).json({
            status: 'error',
            message: 'Gagal login',
            error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
        });
    }
};

// Login Owner (username & password) - diprioritaskan untuk awal penggunaan
exports.loginOwner = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan password harus diisi'
            });
        }

        // Owner disimpan sebagai user role 'admin' dengan username+passwordHash
        const user = await User.findOne({ username, role: 'admin' });

        if (!user || !user.passwordHash) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau password salah'
            });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau password salah'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
            },
            process.env.JWT_SECRET
        );

        logger.info(`Login owner berhasil`, { userId: user._id, username });

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user._id,
                    nama: user.nama,
                    role: user.role,
                    nomorAnggota: user.nomorAnggota,
                    nomorHP: user.nomorHP
                }
            }
        });
    } catch (error) {
        logger.error(`Error login owner`, {
            error: error.message,
            stack: error.stack,
            username: req.body?.username
        });

        res.status(500).json({
            status: 'error',
            message: 'Gagal login',
            error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
        });
    }
};

// Profil Pengguna
exports.profilPengguna = async (req, res) => {
    try {
        const user = req.user;
        
        logger.info(`Profil diakses`, {
            userId: user._id,
            role: user.role
        });

        res.status(200).json({
            status: 'success',
            data: {
                id: user._id,
                nama: user.nama,
                nomorHP: user.nomorHP,
                role: user.role,
                nomorAnggota: user.nomorAnggota,
                targetAkhirTabungan: user.targetAkhirTabungan,
                periodeMulai: user.periodeMulai,
                periodeBerakhir: user.periodeBerakhir
            }
        });
    } catch (error) {
        logger.error(`Error ambil profil`, { 
            error: error.message,
            stack: error.stack,
            userId: req.user?._id 
        });
        
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil profil',
            error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
        });
    }
};