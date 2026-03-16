const logger = require('../utils/logger');

// Middleware untuk melacak proses OTP secara detail
const otpTraceMiddleware = (req, res, next) => {
    if (req.path === '/kirim-otp' || req.path === '/verifikasi-otp') {
        logger.info('OTP Trace', {
            method: req.method,
            path: req.path,
            body: {
                nomorHP: req.body.nomorHP,
                otpLength: req.body.otp ? req.body.otp.length : 'N/A'
            },
            headers: {
                'user-agent': req.get('user-agent'),
                'x-forwarded-for': req.get('x-forwarded-for') || 'N/A'
            }
        });
    }
    next();
};

module.exports = otpTraceMiddleware;