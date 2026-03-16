const User = require('../models/User');
const Setoran = require('../models/Setoran');

class SavingsRecommendationService {
    // Hitung rekomendasi setoran
    async calculateSavingsRecommendation(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Pengguna tidak ditemukan');
            }

            // Total target tabungan
            const targetTabungan = user.targetAkhirTabungan;

            // Hitung total setoran saat ini
            const totalSetoran = await this.getCurrentSavings(userId);

            // Sisa waktu nabung
            const sisaWaktu = this.calculateRemainingTime(user.periodeMulai, user.periodeBerakhir);

            // Rekomendasi setoran
            const rekomendasiSetoran = this.generateRecommendation(
                targetTabungan, 
                totalSetoran, 
                sisaWaktu
            );

            return {
                targetTabungan,
                totalSetoran,
                sisaWaktu,
                rekomendasiSetoran
            };
        } catch (error) {
            console.error('Gagal membuat rekomendasi:', error);
            throw error;
        }
    }

    // Hitung total setoran saat ini
    async getCurrentSavings(userId) {
        const result = await Setoran.aggregate([
            { 
                $match: { 
                    peserta: userId,
                    statusVerifikasi: 'diverifikasi' 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$jumlah' } 
                } 
            }
        ]);

        return result[0]?.total || 0;
    }

    // Hitung sisa waktu nabung
    calculateRemainingTime(periodeMulai, periodeBerakhir) {
        const mulai = new Date(periodeMulai);
        const berakhir = new Date(periodeBerakhir);
        const sekarang = new Date();

        // Hitung hari tersisa
        const millisBerakhir = berakhir.getTime();
        const millisSekarang = sekarang.getTime();
        const millisSisa = millisBerakhir - millisSekarang;

        return Math.ceil(millisSisa / (1000 * 60 * 60 * 24));
    }

    // Generate rekomendasi setoran
    generateRecommendation(targetTabungan, totalSetoran, sisaWaktu) {
        // Jika sudah melebihi target
        if (totalSetoran >= targetTabungan) {
            return {
                status: 'TERCAPAI',
                saranSetoran: 0,
                pesan: 'Selamat! Target tabungan Anda telah tercapai.'
            };
        }

        // Sisa yang perlu ditabung
        const sisaTabungan = targetTabungan - totalSetoran;

        // Rekomendasi setoran per hari/bulan
        const saranSetoranHarian = sisaTabungan / sisaWaktu;
        const saranSetoranBulanan = saranSetoranHarian * 30;

        // Kategorisasi
        let kategori = 'NORMAL';
        let pesan = 'Anda dalam jalur mencapai target.';

        if (saranSetoranHarian < targetTabungan * 0.01) {
            kategori = 'LAMBAT';
            pesan = 'Anda perlu meningkatkan setoran untuk mencapai target.';
        }

        if (saranSetoranHarian > targetTabungan * 0.05) {
            kategori = 'CEPAT';
            pesan = 'Anda sangat baik dalam menabung!';
        }

        return {
            status: kategori,
            saranSetoranHarian: Math.round(saranSetoranHarian),
            saranSetoranBulanan: Math.round(saranSetoranBulanan),
            pesan
        };
    }

    // Simulasi pencapaian target
    simulasiPencapaianTarget(userId, simulasiSetoran) {
        // TODO: Implementasi lebih detail
        return {
            proyeksiPencapaian: new Date(),
            kemungkinanBerhasil: 'TINGGI'
        };
    }
}

module.exports = new SavingsRecommendationService();