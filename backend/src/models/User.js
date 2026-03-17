const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        trim: true
    },
    nomorHP: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        validate: {
            validator: function(v) {
                return /^(^\+62|62|0)8[1-9][0-9]{6,10}$/.test(v);
            },
            message: props => `${props.value} bukan nomor HP valid!`
        }
    },
    role: {
        type: String,
        enum: ['admin', 'kolektor', 'peserta'],
        required: true
    },
    nomorAnggota: {
        type: String,
        unique: true,
        required: true
    },
    targetAkhirTabungan: {
        type: Number,
        default: 0,
        required: function() { return this.role === 'peserta'; }
    },
    paketPilihan: {
        type: String,
        enum: ['uang_tunai', 'sembako', 'keduanya'],
        required: function() { return this.role === 'peserta'; }
    },
    periodeMulai: {
        type: Date,
        default: Date.now,
        required: function() { return this.role === 'peserta'; }
    },
    periodeBerakhir: {
        type: Date,
        required: function() { return this.role === 'peserta'; }
    },
    frekuensiNabung: {
        type: String,
        enum: ['harian', 'mingguan', 'bulanan', 'fleksibel'],
        default: 'fleksibel'
    },
    aktif: {
        type: Boolean,
        default: true
    },
    // Tambahan untuk OTP
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    indexes: [
        { fields: { nomorHP: 1 }, unique: true, sparse: true },
        { fields: { nomorAnggota: 1 }, unique: true }
    ]
});

// Pre-save hook untuk generate periode
UserSchema.pre('save', function(next) {
    if (this.role === 'peserta' && this.periodeMulai && !this.periodeBerakhir) {
        const periodeMulai = new Date(this.periodeMulai);
        this.periodeBerakhir = new Date(periodeMulai.setFullYear(periodeMulai.getFullYear() + 1));
    }
    
    // Generate nomor anggota otomatis jika kosong
    if (!this.nomorAnggota) {
        const prefix = this.role === 'admin' ? 'ADM' : 
                       this.role === 'kolektor' ? 'KOL' : 'PES';
        this.nomorAnggota = `${prefix}${Date.now().toString().slice(-6)}`;
    }

    next();
});

module.exports = mongoose.model('User', UserSchema);