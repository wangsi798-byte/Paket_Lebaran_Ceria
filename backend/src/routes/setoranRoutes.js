const express = require('express');
const router = express.Router();

// Controller
const setoranController = require('../controllers/setoranController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Rute Setoran
router.post(
    '/buat', 
    authMiddleware, 
    restrictTo('peserta', 'kolektor'), 
    setoranController.buatSetoran
);

router.get(
    '/daftar', 
    authMiddleware, 
    setoranController.daftarSetoran
);

router.get(
    '/:id', 
    authMiddleware, 
    setoranController.detailSetoran
);

router.put(
    '/:id/verifikasi', 
    authMiddleware, 
    restrictTo('kolektor'),
    setoranController.verifikasiSetoran
);

// Handler default
router.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rute setoran tidak ditemukan'
    });
});

module.exports = router;