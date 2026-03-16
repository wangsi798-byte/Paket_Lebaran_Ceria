const express = require('express');
const router = express.Router();

// Controller
const userController = require('../controllers/userController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

// Rute User
router.get('/daftar', authMiddleware, userController.daftarUser);

router.get('/:id', authMiddleware, userController.detailUser);

router.put('/:id/update', authMiddleware, userController.updateUser);

// Handler default
router.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rute pengguna tidak ditemukan'
    });
});

module.exports = router;