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

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Backend Paket Lebaran Ceria aktif',
        timestamp: new Date().toISOString()
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Koneksi Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Koneksi MongoDB berhasil');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error);
    }
};

// Jalankan koneksi database
connectDB();

// Export untuk Vercel
module.exports = app;

// Jalankan server hanya jika tidak di Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
}