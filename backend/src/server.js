const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

// ===== ROUTES =====
const authRoutes = require('./routes/authRoutes');
const paketRoutes = require('./routes/paketRoutes');
const userRoutes = require('./routes/userRoutes');
const distribusiRoutes = require('./routes/distribusiRoutes');
const setoranRoutes = require('./routes/setoranRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/paket', paketRoutes);
app.use('/api/user', userRoutes);
app.use('/api/distribusi', distribusiRoutes);
app.use('/api/setoran', setoranRoutes);

// Koneksi Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Koneksi MongoDB berhasil');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error);
    }
};

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
