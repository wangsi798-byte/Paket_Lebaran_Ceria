const express = require('express');
const router = express.Router();

// Controller
const distribusiController = require('../controllers/distribusiController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');
const { validateDistribusi } = require('../middleware/distribusiValidation');

// Rute Distribusi
router.post(
    '/buat', 
    authMiddleware, 
    validateDistribusi, 
    distribusiController.buatDistribusi
);

router.get(
    '/daftar', 
    authMiddleware, 
    distribusiController.daftarDistribusi
);

router.get(
    '/:id', 
    authMiddleware, 
    distribusiController.detailDistribusi
);

router.put(
    '/:id/update', 
    authMiddleware, 
    validateDistribusi, 
    distribusiController.updateDistribusi
);

router.delete(
    '/:id', 
    authMiddleware, 
    distribusiController.hapusDistribusi
);

// Handler untuk rute yang tidak ditemukan
router.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Rute distribusi tidak ditemukan'
    });
});

module.exports = router;