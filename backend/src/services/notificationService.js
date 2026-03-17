const axios = require('axios');
const User = require('../models/User');

class NotificationService {
    constructor() {
        this.whatsappProvider = process.env.WHATSAPP_PROVIDER_URL;
        this.smsProvider = process.env.SMS_PROVIDER_URL;
        this.emailProvider = process.env.EMAIL_PROVIDER_URL;
    }

    // Kirim notifikasi multi-channel
    async sendMultiChannelNotification(userId, options) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Pengguna tidak ditemukan');
            }

            // Pilih metode notifikasi berdasarkan preferensi
            const notificationMethods = [
                this.sendWhatsAppNotification(user.nomorHP, options),
                this.sendSMSNotification(user.nomorHP, options),
                this.sendEmailNotification(user.email, options)
            ];

            // Kirim semua notifikasi secara paralel
            await Promise.allSettled(notificationMethods);
        } catch (error) {
            console.error('Gagal mengirim notifikasi:', error);
        }
    }

    // Notifikasi WhatsApp
    async sendWhatsAppNotification(nomorHP, options) {
        try {
            await axios.post(this.whatsappProvider, {
                to: nomorHP,
                message: options.message,
                template: options.template
            });
        } catch (error) {
            console.error('Gagal kirim WhatsApp:', error);
        }
    }

    // Notifikasi SMS
    async sendSMSNotification(nomorHP, options) {
        try {
            await axios.post(this.smsProvider, {
                to: nomorHP,
                message: options.message
            });
        } catch (error) {
            console.error('Gagal kirim SMS:', error);
        }
    }

    // Notifikasi Email
    async sendEmailNotification(email, options) {
        try {
            await axios.post(this.emailProvider, {
                to: email,
                subject: options.subject,
                body: options.message,
                template: options.emailTemplate
            });
        } catch (error) {
            console.error('Gagal kirim Email:', error);
        }
    }

    // Template Notifikasi
    getNotificationTemplate(type) {
        const templates = {
            setoran_baru: 'Setoran baru sebesar Rp {amount} telah dicatat pada {date}',
            distribusi_siap: 'Paket distribusi Anda siap diambil. Silakan datang ke lokasi penjemputan.',
            pembayaran_terakhir: 'Anda sudah dekat dengan target tabungan Lebaran Anda!',
            reminder_setoran: 'Segera lakukan setoran untuk mencapai target Lebaran Anda.'
        };

        return templates[type] || '';
    }
}

module.exports = new NotificationService();