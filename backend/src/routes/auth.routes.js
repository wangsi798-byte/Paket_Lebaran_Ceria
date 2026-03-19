const express = require('express');
const router = express.Router();

router.post('/login-owner', (req, res) => {
  const { username, password } = req.body;
  
  // Validasi sederhana
  if (username === 'owner' && password === 'paketlebaran2024') {
    res.json({ 
      success: true, 
      token: 'owner_token_' + Date.now(),
      role: 'owner',
      message: 'Login berhasil'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Username atau password salah'
    });
  }
});

module.exports = router;