const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware CORS yang luas
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route utama
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server aktif' });
});

// Route autentikasi
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

// Middleware error handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Endpoint tidak ditemukan',
    path: req.path
  });
});

module.exports = app;