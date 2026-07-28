##  Prasyarat Sistem
Sebelum memulai instalasi, pastikan sistem Anda telah memasang perangkat lunak berikut:
* **PHP** (v8.3 atau lebih baru)
* **Composer**
* **Node.js** (v16 atau lebih baru) & **NPM**
* **MySQL** atau MariaDB (via XAMPP, Laragon, dll)

---

##  Cara Instalasi

Proyek ini terbagi menjadi dua bagian: `backend` dan `frontend`. Anda harus menjalankan keduanya agar aplikasi berfungsi dengan baik.

### Tahap 1: Instalasi Backend (Laravel)

1. Buka command prompt, lalu masuk ke direktori backend:
`cd backend`

2. Instal semua dependensi PHP menggunakan Composer:
`composer install`

3. Salin file konfigurasi environment:
`cp .env.example .env`

3. Buka file .env dan sesuaikan konfigurasi database Anda:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_rthub
DB_USERNAME=root
DB_PASSWORD=

4. Buat Application Key Laravel:
`php artisan key:generate`

5. Jalankan migrasi database (pastikan database kosong sudah dibuat di MySQL):
`php artisan migrate`

6. Jalankan server backend:
`php artisan serve`
Backend API sekarang berjalan di http://localhost:8000

### Tahap 2: Instalasi Frontend (React)

1. Buka tab terminal jalankan command prompt baru (biarkan terminal backend tetap berjalan).
Masuk ke direktori frontend:
`cd frontend`

2. Instal semua dependensi Node.js:
`npm install`

3. Salin file konfigurasi environment:
`cp .env.example .env`

4. Buka file .env dan sesuaikan konfigurasi seperti ini:
VITE_API_URL=http://localhost:8000/api

5. Jalankan server development frontend:
`npm run dev`

Frontend sekarang berjalan, biasanya di http://localhost:5173

### Penggunaan Awal
Buka browser dan akses URL frontend Anda (contoh: http://localhost:5173).

Klik Daftar Sekarang untuk membuat akun Administrator baru.

Setelah berhasil mendaftar, lakukan Login menggunakan Email dan Password tersebut.

Anda akan langsung diarahkan ke Dashboard untuk mulai mengelola data RT