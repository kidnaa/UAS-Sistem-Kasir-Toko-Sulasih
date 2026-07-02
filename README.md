# Sistem Kasir Toko Sulasih

Sistem Kasir Toko Sulasih adalah aplikasi POS sederhana untuk proses penjualan, pengelolaan produk, stok barang, riwayat transaksi, dan laporan penjualan. Proyek ini adalah implementasi UAS dari rangkaian tugas mata kuliah.

## Fitur Utama

* Login pengguna melalui API dengan role owner, admin, dan kasir.
* Manajemen produk: tambah produk, lihat daftar produk, cari produk, dan indikator stok menipis.
* Transaksi penjualan: pilih produk, hitung total otomatis, input pembayaran, hitung kembalian, dan simpan transaksi.
* Stok otomatis berkurang setelah transaksi berhasil.
* Riwayat transaksi terakhir.
* Laporan penjualan berdasarkan periode melalui endpoint report.

## Akun Demo

|Role|Username|Password|
|-|-|-|
|Owner|owner|owner123|
|Admin|admin|admin123|
|Kasir|kasir|kasir123|

## Cara Menjalankan Lokal

1. Jalankan MySQL dari XAMPP dan pastikan aktif di port 3306.
2. Buat database kasir_toko_sulasih lewat phpMyAdmin.
3. Import file database.sql ke database tersebut.
4. Pastikan file .env memakai APP_PORT=3000, DB_HOST=localhost, DB_PORT=3306, DB_USER=root, DB_PASSWORD kosong, dan DB_NAME=kasir_toko_sulasih.
5. Jalankan npm install.
6. Jalankan npm start.
7. Buka http://localhost:3000 di browser.

## Arsitektur

Proyek menggunakan Layered Architecture dengan pembagian berikut:

|Layer|Lokasi|Tanggung Jawab|
|-|-|-|
|Presentation|src/presentation dan public|Route API Express dan tampilan web kasir|
|Application/Service|src/application/services|Aturan bisnis login, produk, transaksi, dan laporan|
|Domain|src/domain/entities|Entitas inti seperti Product dan Transaction|
|Infrastructure|src/infrastructure|Koneksi database, repository, container, dan pattern teknis|

## Design Pattern

|Pattern|File|Tujuan|
|-|-|-|
|Singleton|src/infrastructure/database/MySqlDatabase.js|Memastikan pool database dibuat satu kali dan dipakai ulang|
|Strategy|src/infrastructure/patterns/PaymentStrategyFactory.js|Memisahkan aturan pembayaran tunai dan pembayaran pas|
|Factory|src/infrastructure/patterns/PaymentStrategyFactory.js|Membuat strategi pembayaran berdasarkan metode transaksi|
|Dependency Injection/Container|src/infrastructure/container.js|Menyusun dependency service dan repository agar layer terpisah|

## Linter

Jalankan npm run lint untuk membuktikan kode bebas error linter.

## Kontribusi Anggota & Pembagian Tugas

| Nama | NIM | Peran | Fitur yang Dikerjakan | Link Video Penjelasan |
| --- | --- | --- | --- | --- |
| Krisna Aji Manggala | 42430013 | Backend (Lead) | Implementasi transaksi, repository, integrasi antar modul, koordinasi tim, dan fitur dari 0 sampai akhir | |
| Dewa Ayu Cintya Kasih | 42430054 | Frontend | Dashboard, halaman laporan, reportRoutes, ReportService, TransactionRepository.summary, implementasi app.js, Chart.js integrasi, Export PDF | |
| Aleksius Darate | 42430009 | Backend (Database & Auth) | Desain & setup database, authRoutes, AuthService, ProductService, ProductRepository, koneksi Database | |

> Catatan: Pastikan setiap anggota mengisi kolom "Link Video Penjelasan" dengan link video 5–7 menit sebelum pengumpulan.

## Catatan GitFlow untuk UAS

Pengembangan ideal dilakukan melalui branch feature/nama-fitur, Pull Request ke develop, review oleh anggota lain, lalu merge menuju branch utama sesuai aturan kelompok.

