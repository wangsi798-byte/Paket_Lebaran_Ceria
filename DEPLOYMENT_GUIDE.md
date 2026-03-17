# SiPaLe Deployment Guide

## Prasyarat
- Docker
- Docker Compose
- Node.js 16+
- MongoDB Atlas Account

## Lingkungan Deployment

### Staging
- Domain: staging.sipale.com
- Cabang Git: `develop`
- Konfigurasi: Minimal, untuk pengujian

### Production
- Domain: sipale.com
- Cabang Git: `main`
- Konfigurasi: Lengkap, versi stabil

## Konfigurasi Lingkungan

### Backend (.env)
```
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=rahasia_panjang_dan_kompleks

# Pengaturan Aplikasi
PORT=5000
NODE_ENV=production

# Batas Distribusi
DISTRIBUTION_YEAR=2027
DISTRIBUTION_DATE=2027-04-10
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.sipale.com
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

## Proses Deployment

### Setup Awal
1. Clone repository
2. Konfigurasi `.env`
3. Instal dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Deployment Docker
```bash
# Build images
docker-compose build

# Jalankan container
docker-compose up -d

# Migrasi database (opsional)
docker-compose exec backend npm run migrate
```

## Manajemen Database

### Backup
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump

# Restore
docker-compose exec mongodb mongorestore
```

## Monitoring

### Logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend
```

### Restart Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## Troubleshooting

### Umum
- Periksa `.env`
- Verifikasi koneksi database
- Cek versi Docker & dependencies

### Pembatasan Akses
- Konfirmasi konfigurasi CORS
- Periksa header keamanan
- Validasi token JWT

## Update Aplikasi
1. Pull perubahan terbaru
2. Build ulang images
3. Restart container
```bash
git pull
docker-compose build
docker-compose up -d
```

## Keamanan
- Perbarui dependencies secara berkala
- Gunakan environment variable
- Terapkan principle of least privilege

## Kontak Dukungan
- Email: support@sipale.com
- Telegram: @sipale_support
- Status Sistem: status.sipale.com