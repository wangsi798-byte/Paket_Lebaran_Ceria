const Setoran = require('../models/Setoran');
const User = require('../models/User');

// Buat Setoran Baru
exports.buatSetoran = async (req, res) => {
    try {
        const { peserta, jumlah, metodeBayar } = req.body;
        const kolektor = req.user._id; // Diambil dari user yang sedang login

        // Validasi peserta
        const userPeserta = await User.findById(peserta);
        if (!userPeserta) {
            return res.status(404).json({
                status: 'error',
                message: 'Peserta tidak ditemukan'
            });
        }

        // Buat setoran
        const setoran = new Setoran({
            peserta,
            kolektor,
            jumlah,
            metodeBayar,
            statusVerifikasi: 'menunggu'
        });

        await setoran.save();

        res.status(201).json({
            status: 'success',
            message: 'Setoran berhasil dibuat',
            data: setoran
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal membuat setoran',
            error: error.message
        });
    }
};

// Daftar Setoran
exports.daftarSetoran = async (req, res) => {
    try {
        // Filter berdasarkan role
        const query = req.user.role === 'peserta' 
            ? { peserta: req.user._id }
            : req.user.role === 'kolektor'
            ? { kolektor: req.user._id }
            : {};

        const setoran = await Setoran.find(query)
            .populate('peserta', 'nama nomorAnggota')
            .populate('kolektor', 'nama nomorAnggota')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: setoran
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil daftar setoran',
            error: error.message
        });
    }
};

// Detail Setoran
exports.detailSetoran = async (req, res) => {
    try {
        const setoran = await Setoran.findById(req.params.id)
            .populate('peserta', 'nama nomorAnggota')
            .populate('kolektor', 'nama nomorAnggota');

        if (!setoran) {
            return res.status(404).json({
                status: 'error',
                message: 'Setoran tidak ditemukan'
            });
        }

        // Validasi akses berdasarkan role
        if (
            req.user.role === 'peserta' && 
            setoran.peserta._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses ditolak'
            });
        }

        res.status(200).json({
            status: 'success',
            data: setoran
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil detail setoran',
            error: error.message
        });
    }
};

// Verifikasi Setoran
exports.verifikasiSetoran = async (req, res) => {
    try {
        const { statusVerifikasi } = req.body;

        const setoran = await Setoran.findByIdAndUpdate(
            req.params.id,
            { 
                statusVerifikasi,
                tanggalVerifikasi: new Date()
            },
            { new: true }
        );

        if (!setoran) {
            return res.status(404).json({
                status: 'error',
                message: 'Setoran tidak ditemukan'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Setoran berhasil diverifikasi',
            data: setoran
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal verifikasi setoran',
            error: error.message
        });
    }
};