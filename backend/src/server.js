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
        message: 'Pong from SIPALE Server v3.2', 
        timestamp: new Date(),
        version: '3.2'
    });
});

app.get('/api/debug-db', async (req, res) => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) throw new Error('MONGODB_URI is missing');
        
        const connectionDetails = await connectDB();
        
        const maskedUri = dbUri.replace(/\/\/.*:.*@/, '//***:***@').replace(/\w+\.mongodb\.net/, '***.mongodb.net');
        
        res.json({
            readyState: mongoose.connection.readyState,
            stateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
            dbName: mongoose.connection.name,
            hasUri: true,
            maskedUri: maskedUri,
            connectionStatus: connectionDetails.success ? 'OK' : 'FAILED',
            lastError: connectionDetails.error || null,
            version: 'v3.2'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: err.message,
            version: 'v3.2'
        });
    }
});

// Koneksi Database
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) return { success: false, error: 'No URI' };

        // Force connection to SIPALE database
        let connStr = dbUri;
        if (!dbUri.includes('/sipale')) {
            if (dbUri.includes('?')) {
                const parts = dbUri.split('?');
                connStr = parts[0].endsWith('/') ? parts[0] + 'sipale?' + parts[1] : parts[0] + '/sipale?' + parts[1];
            } else {
                connStr = dbUri.endsWith('/') ? dbUri + 'sipale' : dbUri + '/sipale';
            }
        }

        await mongoose.connect(connStr, { serverSelectionTimeoutMS: 5000 });
        console.log('Koneksi MongoDB berhasil:', mongoose.connection.name);
        return { success: true };
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error.message);
        return { success: false, error: error.message };
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