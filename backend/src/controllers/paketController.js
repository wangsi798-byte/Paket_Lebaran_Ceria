const { Paket } = require('../models/Distribusi');

// Buat Paket Baru
exports.buatPaket = async (req, res) => {
    try {
        const { nama, deskripsi, nilaiPaket, jenisDistribusi } = req.body;

        const paket = new Paket({
            nama,
            deskripsi,
            nilaiPaket,
            jenisDistribusi
        });

        await paket.save();

        res.status(201).json({
            status: 'success',
            message: 'Paket berhasil dibuat',
            data: paket
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal membuat paket',
            error: error.message
        });
    }
};

// Daftar Paket
exports.daftarPaket = async (req, res) => {
    try {
        const pakets = await Paket.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: pakets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil daftar paket',
            error: error.message
        });
    }
};

// Detail Paket
exports.detailPaket = async (req, res) => {
    try {
        const paket = await Paket.findById(req.params.id);

        if (!paket) {
            return res.status(404).json({
                status: 'error',
                message: 'Paket tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            data: paket
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil detail paket',
            error: error.message
        });
    }
};

// Update Paket
exports.updatePaket = async (req, res) => {
    try {
        const { nama, deskripsi, nilaiPaket, jenisDistribusi } = req.body;

        const paket = await Paket.findByIdAndUpdate(
            req.params.id, 
            { 
                nama, 
                deskripsi, 
                nilaiPaket, 
                jenisDistribusi 
            }, 
            { new: true, runValidators: true }
        );

        if (!paket) {
            return res.status(404).json({
                status: 'error',
                message: 'Paket tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Paket berhasil diupdate',
            data: paket
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal update paket',
            error: error.message
        });
    }
};

// Hapus Paket
exports.hapusPaket = async (req, res) => {
    try {
        const paket = await Paket.findByIdAndDelete(req.params.id);

        if (!paket) {
            return res.status(404).json({
                status: 'error',
                message: 'Paket tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Paket berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal hapus paket',
            error: error.message
        });
    }
};