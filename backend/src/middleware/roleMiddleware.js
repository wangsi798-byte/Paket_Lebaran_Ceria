const restrictTo = (...roles) => {
    return (req, res, next) => {
        // Pastikan user sudah terauthentikasi
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Anda harus login terlebih dahulu'
            });
        }

        // Periksa role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses ditolak'
            });
        }

        next();
    };
};

module.exports = { restrictTo };