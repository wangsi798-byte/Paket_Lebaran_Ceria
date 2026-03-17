const User = require('../models/User');

// Daftar Pengguna
exports.daftarUser = async (req, res) => {
    try {
        // Filter pengguna berdasarkan role (opsional)
        const { role } = req.query;
        
        const filter = role ? { role } : {};
        
        const users = await User.find(filter)
            .select('-otp -otpExpires')  // Sembunyikan informasi sensitif
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil daftar pengguna',
            error: error.message
        });
    }
};

// Detail Pengguna
exports.detailUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-otp -otpExpires');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Pengguna tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil detail pengguna',
            error: error.message
        });
    }
};

// Update Pengguna
exports.updateUser = async (req, res) => {
    try {
        const { nama, targetAkhirTabungan, paketPilihan } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 
                nama, 
                targetAkhirTabungan, 
                paketPilihan 
            },
            { new: true, runValidators: true }
        ).select('-otp -otpExpires');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Pengguna tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Profil berhasil diperbarui',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal memperbarui profil',
            error: error.message
        });
    }
};