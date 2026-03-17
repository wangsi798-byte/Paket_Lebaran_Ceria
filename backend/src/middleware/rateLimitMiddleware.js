const rateLimit = require('express-rate-limit');

// Rate limiter untuk semua rute
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maks 100 request per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Terlalu banyak request, silakan coba lagi nanti'
    }
});

// Rate limiter khusus login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // Maks 5 percobaan login
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Terlalu banyak percobaan login, akun dikunci sementara'
    }
});

module.exports = {
    globalRateLimiter,
    loginLimiter
};