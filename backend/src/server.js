const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const otpTraceMiddleware = require('./middleware/otpTraceMiddleware');

// Muat environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const setoranRoutes = require('./routes/setoranRoutes');
const distribusiRoutes = require('./routes/distribusiRoutes');
const paketRoutes = require('./routes/paketRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Trace middleware untuk OTP
app.use(otpTraceMiddleware);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Keamanan
app.use(helmet());

// Rate limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maks 100 request per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Terlalu banyak request, silakan coba lagi nanti'
});
app.use(globalLimiter);

// Rute
app.use('/api/users', userRoutes);
app.use('/api/setoran', setoranRoutes);
app.use('/api/distribusi', distribusiRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Koneksi Database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    logger.info('✅ Koneksi MongoDB berhasil');
})
.catch((err) => {
    logger.error('❌ Koneksi MongoDB gagal', { error: err.message });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Error Global', {
        message: err.message,
        stack: err.stack
    });
    
    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan internal',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;