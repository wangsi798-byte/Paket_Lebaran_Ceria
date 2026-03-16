const express = require('express');
const router = express.Router();

// Controller
const paketController = require('../controllers/paketController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Rute Paket
router.post(
    '/buat', 
    authMiddleware, 
    restrictTo('admin'), 
    paketController.buatPaket
);

router.get(
    '/daftar', 
    authMiddleware, 
    paketController.daftarPaket
);

router.get(
    '/:id', 
    authMiddleware, 
    paketController.detailPaket
);

router.put(
    '/:id/update', 
    authMiddleware, 
    restrictTo('admin'),
    paketController.updatePaket
);

router.delete(
    '/:id', 
    authMiddleware, 
    restrictTo('admin'),
    paketController.hapusPaket
);

// Handler default
router.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rute paket tidak ditemukan'
    });
});

module.exports = router;