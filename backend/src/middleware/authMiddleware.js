const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Ambil token dari header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Tidak ada token autentikasi'
            });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Cari user
        const user = await User.findOne({ 
            _id: decoded.id, 
            role: decoded.role 
        });

        if (!user) {
            return res.status(401).json({
                status: 'error', 
                message: 'Autentikasi gagal'
            });
        }

        // Tambahkan metode pembatasan akses
        authMiddleware.restrictTo = (...roles) => {
            return (req, res, next) => {
                if (!roles.includes(user.role)) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Akses ditolak'
                    });
                }
                next();
            };
        };

        // Tambahkan user dan token ke request
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Silakan login ulang',
            error: error.message
        });
    }
};

module.exports = authMiddleware;