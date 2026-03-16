const mongoose = require('mongoose');

const SetoranSchema = new mongoose.Schema({
    peserta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    kolektor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jumlah: {
        type: Number,
        required: true,
        min: 0
    },
    metodeBayar: {
        type: String,
        enum: ['tunai', 'transfer'],
        required: true
    },
    buktiSetoran: {
        type: String, // Path foto bukti
        default: null
    },
    statusVerifikasi: {
        type: String,
        enum: ['menunggu', 'diverifikasi', 'ditolak'],
        default: 'menunggu'
    },
    catatan: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Setoran', SetoranSchema);