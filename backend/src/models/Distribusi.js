const mongoose = require('mongoose');

const PaketSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    kategori: {
        type: String,
        enum: ['sembako', 'barang', 'elektronik', 'fashion'],
        required: true
    },
    deskripsi: {
        type: String
    },
    harga: {
        type: Number,
        required: true
    },
    stok: {
        type: Number,
        default: 0
    },
    gambar: {
        type: String, // Path atau URL gambar
        default: null
    }
}, { timestamps: true });

const DistribusiSchema = new mongoose.Schema({
    peserta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paket: {
        type: PaketSchema,
        required: true
    },
    jenisDistribusi: {
        type: String,
        enum: ['sembako', 'barang', 'elektronik', 'fashion'],
        required: true
    },
    nilaiDistribusi: {
        type: Number,
        required: true
    },
    tanggalDistribusi: {
        type: Date,
        required: true
    },
    statusPengambilan: {
        type: String,
        enum: ['belum_diambil', 'sudah_diambil'],
        default: 'belum_diambil'
    },
    buktiPengambilan: {
        type: String, // Path foto bukti
        default: null
    },
    catatan: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true
});

// Pre-save hook untuk validasi stok
DistribusiSchema.pre('save', function(next) {
    if (this.paket && this.paket.stok < 1) {
        next(new Error('Stok paket habis'));
    } else {
        next();
    }
});

// Model untuk Paket (bisa digunakan terpisah)
const Paket = mongoose.model('Paket', PaketSchema);
const Distribusi = mongoose.model('Distribusi', DistribusiSchema);

module.exports = { Distribusi, Paket };