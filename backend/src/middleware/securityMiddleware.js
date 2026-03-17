const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Middleware keamanan sederhana
const setupSecurityMiddleware = (app) => {
    // Basic security headers
    app.use(helmet({
        contentSecurityPolicy: false, // Atur sesuai kebutuhan
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    }));

    // Rate limiter global
    const globalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 menit
        max: 100, // Maks 100 request per window
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Terlalu banyak request, silakan coba lagi nanti'
    });
    app.use(globalLimiter);

    // CORS yang lebih ketat
    app.use((req, res, next) => {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });
};

module.exports = setupSecurityMiddleware;