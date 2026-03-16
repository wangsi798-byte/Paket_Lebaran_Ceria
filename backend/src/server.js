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

// CORS Configuration untuk production
const allowedOrigins = [
    'https://paket-lebaran-ceria.vercel.app', // Frontend production URL
    'http://localhost:3000', // Lokal development
    'https://paket-lebaran-frontend.vercel.app' // Alternatif frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
    max: 200, // Maks 200 request per window untuk production
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Terlalu banyak request, silakan coba lagi nanti'
});
app.use(globalLimiter);

// Rute dengan prefix /api
app.use('/api/users', userRoutes);
app.use('/api/setoran', setoranRoutes);
app.use('/api/distribusi', distribusiRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Paket Lebaran Ceria Backend',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Koneksi Database dengan retry
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout setelah 5 detik
        });
        logger.info('✅ Koneksi MongoDB berhasil');
    } catch (err) {
        logger.error('❌ Koneksi MongoDB gagal', { error: err.message });
        // Retry koneksi setelah 5 detik
        setTimeout(connectWithRetry, 5000);
    }
};

// Inisiasi koneksi database
connectWithRetry();

// Global error handler
app.use((err, req, res, next) => {
    // Log error di server
    logger.error('Error Global', {
        message: err.message,
        stack: err.stack
    });
    
    // Kirim response error
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Terjadi kesalahan internal' 
            : err.message
    });
});

// Untuk Vercel, ekspor app sebagai default
module.exports = app;

// Hanya jalankan server jika tidak di testing atau Vercel
if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`🚀 Server berjalan di port ${PORT}`);
    });
}