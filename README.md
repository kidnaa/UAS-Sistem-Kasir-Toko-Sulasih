# Sistem Kasir Toko Sulasih

Sistem Kasir Toko Sulasih adalah aplikasi POS sederhana untuk proses penjualan, pengelolaan produk, stok barang, riwayat transaksi, dan laporan penjualan. Proyek ini adalah implementasi UAS dari rancangan SRS/UTS.

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
2. Buat database kasir\_toko\_sulasih lewat phpMyAdmin.
3. Import file database.sql ke database tersebut.
4. Pastikan file .env memakai APP\_PORT=3000, DB\_HOST=localhost, DB\_PORT=3306, DB\_USER=root, DB\_PASSWORD kosong, dan DB\_NAME=kasir\_toko\_sulasih.
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

## Kontribusi Anggota

## 

## 

## Catatan GitFlow untuk UAS

Pengembangan ideal dilakukan melalui branch feature/nama-fitur, Pull Request ke develop, review oleh anggota lain, lalu merge menuju branch utama sesuai aturan kelompok.

