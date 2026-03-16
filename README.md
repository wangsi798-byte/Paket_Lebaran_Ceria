# 💰 SiPaLe: Sistem Informasi Paket Lebaran

## 🌟 Deskripsi Proyek
SiPaLe adalah solusi digital untuk manajemen tabungan dan distribusi paket Lebaran yang inovatif, aman, dan mudah digunakan.

## ✨ Fitur Utama
- 👥 Manajemen peserta multi-role
- 💸 Setoran fleksibel
- 🎁 Distribusi paket custom
- 🔔 Notifikasi cerdas
- 📊 Rekomendasi tabungan

## 🚀 Teknologi
- Backend: Node.js, Express
- Frontend: React
- Database: MongoDB
- Deployment: Docker

## 🔧 Prasyarat
- Node.js 16+
- Docker
- MongoDB Atlas

## 🛠️ Instalasi

### Kloning Repositori
```bash
git clone https://github.com/muji-dashboard/sipale.git
cd sipale
```

### Konfigurasi Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
```

### Konfigurasi Frontend
```bash
cd ../frontend
npm install
```

### Jalankan Aplikasi
```bash
# Untuk development
docker-compose up -d

# Untuk produksi
docker-compose -f docker-compose.production.yml up -d
```

## 📦 Fitur Lengkap
- Autentikasi OTP
- Manajemen stok paket
- Pelacakan progress tabungan
- Notifikasi multi-channel
- Keamanan berlapis

## 🔒 Keamanan
- Enkripsi data
- Rate limiting
- Audit log
- Autentikasi bertingkat

## 📅 Roadmap
- [x] Versi 1.0: Rilis Perdana
- [ ] Integrasi pembayaran digital
- [ ] Dukungan multi-wilayah
- [ ] Laporan komprehensif

## 👥 Kontributor
- [Daftar Kontributor]

## 📄 Lisensi
[Informasi Lisensi]

## 📞 Kontak
- Email: support@sipale.com
- Telegram: @sipale_support

## 🙏 Terima Kasih
Terima kasih telah memilih SiPaLe untuk kebutuhan tabungan Lebaran Anda!