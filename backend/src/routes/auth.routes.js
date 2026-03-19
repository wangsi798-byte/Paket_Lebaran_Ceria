const express = require('express');
const router = express.Router();

router.post('/login-owner', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'owner' && password === 'paketlebaran2024') {
    res.json({ 
      success: true, 
      token: 'owner_token_123',
      role: 'owner'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Login gagal' 
    });
  }
});

module.exports = router;