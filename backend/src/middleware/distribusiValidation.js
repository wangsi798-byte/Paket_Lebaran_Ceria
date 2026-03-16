const { body, validationResult } = require('express-validator');

// Validasi untuk pembuatan/update distribusi
exports.validateDistribusi = [
    body('peserta')
        .notEmpty().withMessage('ID Peserta harus diisi')
        .isMongoId().withMessage('ID Peserta tidak valid'),
    
    body('jenisDistribusi')
        .notEmpty().withMessage('Jenis distribusi harus diisi')
        .isIn(['uang_tunai', 'sembako', 'paket_elektronik'])
        .withMessage('Jenis distribusi tidak valid'),
    
    body('nilaiDistribusi')
        .notEmpty().withMessage('Nilai distribusi harus diisi')
        .isNumeric().withMessage('Nilai distribusi harus angka')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Nilai distribusi harus lebih dari 0');
            }
            return true;
        }),
    
    body('statusDistribusi')
        .optional()
        .isIn(['menunggu', 'diproses', 'selesai', 'dibatalkan'])
        .withMessage('Status distribusi tidak valid'),

    // Middleware untuk memeriksa hasil validasi
    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }
        
        next();
    }
];