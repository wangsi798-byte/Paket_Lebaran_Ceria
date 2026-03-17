const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/setoran');
        
        // Buat direktori jika belum ada
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nama file unik: setoran-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `setoran-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak diizinkan. Hanya JPEG, PNG, GIF, dan WebP.'), false);
    }
};

// Konfigurasi upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;