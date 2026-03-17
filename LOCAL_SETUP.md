# 🚀 Panduan Instalasi Lokal SiPaLe

## Prasyarat
- Docker
- Docker Compose
- Git
- Koneksi Internet

## Langkah Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/muji-dashboard/sipale.git
cd sipale
```

### 2. Jalankan Docker Compose
```bash
# Pastikan Docker sudah berjalan
docker-compose -f docker-compose.local.yml up --build
```

### 3. Akses Aplikasi
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Akun Default
- **Peserta**: 081234567890
- **Kolektor**: 082345678901
- **Admin**: 083456789012

## Troubleshooting
- Pastikan port 3000, 5000, 27017 tidak digunakan
- Restart Docker jika ada masalah
- Gunakan `docker-compose down` untuk membersihkan

## Catatan Penting
- Data tersimpan di volume Docker
- Perubahan kode akan langsung ter-reload
- Untuk production, gunakan `docker-compose.yml`

## Kontrol Docker
```bash
# Stop container
docker-compose down

# Lihat logs
docker-compose logs backend
docker-compose logs frontend
```

🛠️ Selamat Mencoba SiPaLe Versi Lokal!