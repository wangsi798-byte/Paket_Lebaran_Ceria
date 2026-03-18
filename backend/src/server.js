const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Muat environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for Vercel logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Backend Paket Lebaran Ceria aktif',
        timestamp: new Date().toISOString()
    });
});

// Diagnostics & Health
app.get('/api/ping', (req, res) => {
    res.json({ 
        message: 'Pong from SIPALE Server', 
        timestamp: new Date(),
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

app.get('/api/debug-db', async (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
        dbName: mongoose.connection.name,
        hasUri: !!process.env.MONGODB_URI
    });
});

// Koneksi Database
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            console.error('CRITICAL: MONGODB_URI tidak ditemukan!');
            return;
        }

        // Robust connection string building
        let connStr = dbUri;
        if (!dbUri.includes('/sipale')) {
            connStr = dbUri.includes('?') 
                ? dbUri.replace('?', 'sipale?')
                : dbUri.endsWith('/') ? dbUri + 'sipale' : dbUri + '/sipale';
        }

        await mongoose.connect(connStr);
        console.log('Koneksi MongoDB berhasil ke database:', mongoose.connection.name);
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error);
    }
};

// Import Rute
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paketRoutes = require('./routes/paketRoutes');
const setoranRoutes = require('./routes/setoranRoutes');
const distribusiRoutes = require('./routes/distribusiRoutes');

// Gunakan Rute
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/setoran', setoranRoutes);
app.use('/api/distribusi', distribusiRoutes);

// Database Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Catch-all 404 for API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `API Route ${req.originalUrl} not found on SIPALE Server`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan internal pada server SIPALE',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Jalankan koneksi database
connectDB();

// Export untuk Vercel
module.exports = app;

// Jalankan server jika lokal
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
}