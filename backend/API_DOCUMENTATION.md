# SiPaLe API Documentation

## Autentikasi

### Login (Kirim OTP)
- **Endpoint:** `POST /api/users/login`
- **Body:**
  ```json
  {
    "nomorHP": "081234567890"
  }
  ```

### Verifikasi OTP
- **Endpoint:** `POST /api/users/verify-otp`
- **Body:**
  ```json
  {
    "nomorHP": "081234567890",
    "otp": "123456"
  }
  ```

## Users

### Registrasi Peserta
- **Endpoint:** `POST /api/users/register`
- **Header:** Authorization (Admin Only)
- **Body:**
  ```json
  {
    "nama": "John Doe",
    "nomorHP": "081234567890",
    "role": "peserta",
    "targetAkhirTabungan": 1500000,
    "paketPilihan": "sembako",
    "periodeMulai": "2026-03-01"
  }
  ```

### Profil Pengguna
- **Endpoint:** `GET /api/users/profile`
- **Header:** Authorization

### Update Profil
- **Endpoint:** `PUT /api/users/profile`
- **Header:** Authorization
- **Body:** (semua field opsional)
  ```json
  {
    "nama": "John Updated",
    "targetTabungan": 2000000
  }
  ```

### Progress Nabung
- **Endpoint:** `GET /api/users/:id/progress`
- **Header:** Authorization

## Setoran

### Input Setoran (Kolektor)
- **Endpoint:** `POST /api/setoran`
- **Header:** Authorization
- **Body:**
  ```json
  {
    "pesertaId": "user_id",
    "jumlah": 100000,
    "metodeBayar": "tunai"
  }
  ```

### List Setoran
- **Endpoint:** `GET /api/setoran`
- **Query Params:** 
  - `page`: Halaman
  - `limit`: Jumlah data
  - `statusVerifikasi`: Status verifikasi

## Paket

### List Paket
- **Endpoint:** `GET /api/paket`
- **Query Params:**
  - `kategori`: Filter kategori
  - `page`: Halaman
  - `limit`: Jumlah data

### Detail Paket
- **Endpoint:** `GET /api/paket/:id`

### Tambah Paket (Admin)
- **Endpoint:** `POST /api/paket`
- **Body (multipart):**
  - `nama`: Nama paket
  - `kategori`: Kategori paket
  - `harga`: Harga paket
  - `stok`: Jumlah stok
  - `gambar`: File gambar

## Distribusi

### Buat Distribusi (Admin)
- **Endpoint:** `POST /api/distribusi`
- **Body:**
  ```json
  {
    "pesertaId": "user_id",
    "paketId": "paket_id",
    "tanggalDistribusi": "2027-04-10"
  }
  ```

### List Distribusi
- **Endpoint:** `GET /api/distribusi`
- **Query Params:**
  - `page`: Halaman
  - `limit`: Jumlah data
  - `statusPengambilan`: Status pengambilan
  - `jenisDistribusi`: Jenis distribusi

### Upload Bukti Pengambilan
- **Endpoint:** `POST /api/distribusi/:id/bukti`
- **Body (multipart):**
  - `buktiPengambilan`: Foto bukti

## Error Handling
- Setiap response error memiliki struktur:
  ```json
  {
    "status": "error",
    "message": "Pesan error"
  }
  ```

## Authentication
- Gunakan header: 
  `Authorization: Bearer <token>`

## Status Kode
- 200: Sukses
- 201: Berhasil dibuat
- 400: Kesalahan input
- 401: Tidak terautentikasi
- 403: Terlarang
- 404: Tidak ditemukan
- 500: Kesalahan server

## Catatan
- Semua endpoint memerlukan autentikasi
- Token didapatkan dari proses login OTP
- Sesuaikan dengan role pengguna