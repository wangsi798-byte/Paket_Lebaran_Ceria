const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({
  origin: 'https://paket-lebaran-ceria.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(bodyParser.json());

app.post('/api/auth/login-owner', (req, res) => {
  const { username, password } = req.body;
  
  // Contoh sederhana validasi
  if (username === 'admin' && password === 'paketlebaran2024') {
    res.json({ success: true, token: 'dummy_token_123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = app;