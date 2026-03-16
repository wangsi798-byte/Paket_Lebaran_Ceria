# 🖥️ Dokumentasi Teknis SiPaLe

## 🏗️ Arsitektur Sistem

### Komponen Utama
- Backend: Node.js + Express
- Frontend: React
- Database: MongoDB Atlas
- Deployment: Docker
- Monitoring: Prometheus + Grafana

### Alur Sistem
```
Pengguna → Frontend React → Backend Express → MongoDB
          ↑                 ↓
     Autentikasi OTP   Proses Bisnis
```

## 🔐 Keamanan

### Autentikasi
- OTP berbasis nomor HP
- JWT Token
- Rate Limiting
- Enkripsi data sensitif

### Middleware Keamanan
- `authMiddleware.js`: Validasi token
- `securityMiddleware.js`: Header protection
- `rateLimitMiddleware.js`: Pembatasan request

## 📦 Struktur Proyek

```
sipale/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── tests/
│   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
│
└── deployment/
    ├── docker-compose.yml
    └── nginx/
```

## 🛠️ Konfigurasi Environment

### Variabel Lingkungan
- `MONGODB_URI`: Koneksi database
- `JWT_SECRET`: Rahasia enkripsi
- `PORT`: Port server
- `NODE_ENV`: Mode environment

### Contoh `.env`
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=rahasia_kompleks
PORT=5000
NODE_ENV=production
```

## 📡 API Endpoints

### Autentikasi
- `POST /api/users/login`: Kirim OTP
- `POST /api/users/verify-otp`: Verifikasi

### Peserta
- `GET /api/users/profile`: Profil pengguna
- `POST /api/setoran`: Input setoran
- `GET /api/distribusi`: Daftar distribusi

## 🔍 Monitoring

### Metrik yang Dilacak
- Request duration
- Error rates
- Active requests
- Database performance

### Alat
- Prometheus: Pengumpulan metrik
- Grafana: Visualisasi

## 🚀 Deployment

### Proses
1. Build Docker images
2. Push ke registry
3. Pull di server
4. Jalankan container

### Strategi
- Blue-Green Deployment
- Zero-downtime updates
- Rollback otomatis

## 🧪 Pengujian

### Jenis Tes
- Unit test
- Integration test
- Security test
- Performance test

### Alat
- Jest
- Supertest
- Artillery (load testing)

## 🔄 Continuous Integration

### GitHub Actions
- Lint code
- Run tests
- Build images
- Deploy ke staging/produksi

## 📋 Dokumentasi Tambahan
- [API Specification](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Security Policy](SECURITY.md)

## 🆘 Troubleshooting
- Periksa logs
- Validasi konfigurasi
- Hubungi tim teknis