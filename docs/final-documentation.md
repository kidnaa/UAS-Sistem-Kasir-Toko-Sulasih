# Dokumentasi Final UAS

## Hubungan SRS/UTS dengan Implementasi

| Kebutuhan SRS | Status Implementasi | Keterangan |
| --- | --- | --- |
| Login pengguna | Ada | Endpoint /api/auth/login tersedia |
| Role owner/admin/kasir | Ada di data dan service | Role dikembalikan saat login |
| Manajemen produk | Ada | Tambah, daftar, cari, edit, hapus tersedia lewat API; UI saat ini mendukung tambah, daftar, dan cari |
| Transaksi penjualan | Ada | Pilih produk, keranjang, total otomatis, pembayaran, dan kembalian |
| Stok otomatis | Ada | Stok berkurang setelah checkout berhasil |
| Notifikasi stok menipis | Ada | Produk low stock diberi penanda visual di UI |
| Laporan penjualan | Ada | Endpoint /api/reports/summary menyediakan total transaksi, pendapatan, dan best seller |
| Riwayat transaksi | Ada | Endpoint dan UI transaksi terakhir tersedia |

## Alur Demo yang Disarankan

1. Jalankan aplikasi dan buka http://localhost:3000.
2. Pilih beberapa produk dan masukkan ke keranjang.
3. Masukkan uang bayar lebih besar dari total, lalu klik Bayar Sekarang.
4. Tunjukkan kembalian, stok berkurang, dan riwayat transaksi terbaru.
5. Tunjukkan endpoint login memakai akun demo.
6. Tunjukkan laporan penjualan lewat endpoint /api/reports/summary.

## Bukti Arsitektur

- Route Express berada di src/presentation/routes.
- Service berada di src/application/services.
- Repository berada di src/infrastructure/repositories.
- Entitas domain berada di src/domain/entities.

## Bukti Design Pattern

- Singleton: MySqlDatabase.getInstance() menjaga satu instance database pool.
- Strategy: CashPaymentStrategy dan ExactPaymentStrategy punya aturan kembalian berbeda.
- Factory: PaymentStrategyFactory.create(method) memilih strategi pembayaran berdasarkan input transaksi.

## Checklist UAS

- [x] Aplikasi berjalan lokal.
- [x] Database MySQL digunakan.
- [x] Layered Architecture diterapkan.
- [x] Minimal dua design pattern diterapkan.
- [x] ESLint tersedia.
- [x] README utama tersedia.
- [x] Folder docs tersedia.
- [ ] Riwayat GitFlow dan Pull Request perlu dilakukan di GitHub kelompok.
- [ ] Link video individu perlu diisi di README.
