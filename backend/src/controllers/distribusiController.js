const Distribusi = require('../models/Distribusi');
const User = require('../models/User');

// Buat Distribusi Baru
exports.buatDistribusi = async (req, res) => {
    try {
        const { peserta, jenisDistribusi, nilaiDistribusi, statusDistribusi } = req.body;

        // Validasi peserta
        const userPeserta = await User.findById(peserta);
        if (!userPeserta) {
            return res.status(404).json({
                status: 'error',
                message: 'Peserta tidak ditemukan'
            });
        }

        // Buat distribusi
        const distribusi = new Distribusi({
            peserta,
            jenisDistribusi,
            nilaiDistribusi,
            statusDistribusi,
            tanggalDistribusi: new Date()
        });

        await distribusi.save();

        res.status(201).json({
            status: 'success',
            message: 'Distribusi berhasil dibuat',
            data: distribusi
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal membuat distribusi',
            error: error.message
        });
    }
};

// Daftar Distribusi
exports.daftarDistribusi = async (req, res) => {
    try {
        const distribusi = await Distribusi.find()
            .populate('peserta', 'nama nomorAnggota')
            .sort({ tanggalDistribusi: -1 });

        res.status(200).json({
            status: 'success',
            data: distribusi
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil daftar distribusi',
            error: error.message
        });
    }
};

// Detail Distribusi
exports.detailDistribusi = async (req, res) => {
    try {
        const distribusi = await Distribusi.findById(req.params.id)
            .populate('peserta', 'nama nomorAnggota');

        if (!distribusi) {
            return res.status(404).json({
                status: 'error',
                message: 'Distribusi tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            data: distribusi
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil detail distribusi',
            error: error.message
        });
    }
};

// Update Distribusi
exports.updateDistribusi = async (req, res) => {
    try {
        const { jenisDistribusi, nilaiDistribusi, statusDistribusi } = req.body;

        const distribusi = await Distribusi.findByIdAndUpdate(
            req.params.id, 
            { 
                jenisDistribusi, 
                nilaiDistribusi, 
                statusDistribusi 
            }, 
            { new: true }
        );

        if (!distribusi) {
            return res.status(404).json({
                status: 'error',
                message: 'Distribusi tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Distribusi berhasil diupdate',
            data: distribusi
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal update distribusi',
            error: error.message
        });
    }
};

// Hapus Distribusi
exports.hapusDistribusi = async (req, res) => {
    try {
        const distribusi = await Distribusi.findByIdAndDelete(req.params.id);

        if (!distribusi) {
            return res.status(404).json({
                status: 'error',
                message: 'Distribusi tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Distribusi berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal hapus distribusi',
            error: error.message
        });
    }
};