const express = require('express');
const router = express.Router();

router.post('/login-owner', (req, res) => {
  const { username, password } = req.body;
  
  // Log untuk debugging
  console.log('Login attempt:', { username, passwordLength: password ? password.length : 0 });

  // Validasi sederhana dengan respons detail
  if (username === 'owner' && password === 'paketlebaran2024') {
    res.status(200).json({ 
      success: true, 
      token: `owner_token_${Date.now()}`,
      role: 'owner',
      message: 'Login berhasil'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Kredensial tidak valid',
      details: {
        usernameProvided: !!username,
        passwordProvided: !!password
      }
    });
  }
});

// Tambahan route untuk debugging
router.get('/check', (req, res) => {
  res.status(200).json({ 
    status: 'Auth route aktif', 
    timestamp: Date.now() 
  });
});

module.exports = router;