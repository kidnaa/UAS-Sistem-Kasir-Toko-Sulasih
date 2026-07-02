# Sistem Kasir Toko Sulasih

> Ujian Akhir Semester (UAS) — Rekayasa Perangkat Lunak — Semester 2025/2026

Dosen Pengampu: Gede Humaswara Prathama, S.T., M.T. & I Gusti Ngurah Darma Paramartha, S.T., M.T.

Sifat Ujian: Proyek Kelompok (Kelompok UTS yang Sama)
Metode Pengumpulan: Repositori GitHub & Video Penjelasan Individu

---

## 1. Deskripsi Sistem
Sistem Kasir Toko Sulasih adalah aplikasi POS sederhana yang memenuhi kebutuhan MVP untuk proses penjualan, pengelolaan produk, stok, riwayat transaksi, dan laporan penjualan. Proyek ini diimplementasikan sesuai rancangan UTS dengan fokus pada kualitas rekayasa perangkat lunak: arsitektur terpisah, penerapan design pattern, standar pengkodean, dan alur kolaborasi GitHub yang benar.

## 2. Fitur Utama (MVP)
- Otentikasi pengguna (role: owner, admin, kasir)
- Manajemen produk (tambah, ubah, hapus, daftar, pencarian, indikator stok menipis)
- Transaksi penjualan dengan perhitungan total, input pembayaran, dan kembalian
- Stok otomatis berkurang setelah transaksi
- Riwayat transaksi dan laporan penjualan per periode

## 3. Demo / Akun Pengujian
| Role | Username | Password |
| --- | --- | --- |
| Owner | owner | owner123 |
| Admin | admin | admin123 |
| Kasir | kasir | kasir123 |

---

## 4. Persyaratan
- Node.js (versi LTS direkomendasikan)
- npm
- MySQL (mis. lewat XAMPP) berjalan di port 3306

## 5. Setup & Cara Menjalankan (Lokal)
1. Clone repo:
```bash
git clone https://github.com/kidnaa/UAS-Sistem-Kasir-Toko-Sulasih.git
cd UAS-Sistem-Kasir-Toko-Sulasih
```
2. Buat database dan import schema:
- Jalankan MySQL (contoh: XAMPP)
- Buat database `kasir_toko_sulasih` lewat phpMyAdmin atau CLI
- Import file `database.sql` (terletak di root)

3. Environment:
- Salin file `.env.example` menjadi `.env` (file contoh disertakan di repo)
- Pastikan variabel berikut disesuaikan jika perlu:
  - APP_PORT=3000
  - DB_HOST=localhost
  - DB_PORT=3306
  - DB_USER=root
  - DB_PASSWORD=
  - DB_NAME=kasir_toko_sulasih

4. Install dependencies dan jalankan:
```bash
npm install
npm start
```
5. Buka: http://localhost:3000

Catatan: Jika tidak ada file `.env.example`, buatlah dengan variabel yang disebutkan di atas.

---

## 6. Arsitektur & Struktur Proyek
Kami menerapkan Layered Architecture (Presentation / Application / Domain / Infrastructure). Struktur folder penting:

```
src/
  server.js                  # entrypoint Express
  presentation/              # route API dan handler HTTP
  application/
    services/                # logika bisnis: AuthService, ProductService, TransactionService, ReportService
  domain/
    entities/                # entitas: Product.js, Transaction.js
  infrastructure/
    database/                # koneksi DB (MySqlDatabase.js - Singleton)
    repositories/            # akses data / SQL wrapper
    container.js             # dependency injection / wiring
public/                      # frontend statis untuk tampilan kasir
database.sql                  # schema + seed untuk MySQL
README.md
docs/                         # dokumentasi tambahan / diagram UML
```

How it fits together singkat:
- `server.js` mendaftarkan route di `presentation`.
- Route memanggil service di `application/services`.
- Service berinteraksi dengan repository di `infrastructure/repositories`, yang memakai `MySqlDatabase.js` untuk koneksi.
- `container.js` menyusun dependensi sehingga layer atas tidak langsung membuat koneksi DB.

## 7. Design Patterns (dokumentasi & lokasi file)
Minimum 2 GoF patterns harus diterapkan — yang digunakan di repo ini:
- Singleton
  - File: `src/infrastructure/database/MySqlDatabase.js`
  - Tujuan: memastikan hanya ada satu pool koneksi MySQL yang dipakai seluruh aplikasi.
- Factory / Strategy (kombinasi)
  - File: `src/infrastructure/patterns/PaymentStrategyFactory.js` (jika tersedia)
  - Tujuan: memilih strategi pembayaran yang sesuai (tunai atau kredit) tanpa mengubah kode transaksi.

(Jika pattern lain diterapkan, cantumkan di sini dengan file dan penjelasan singkat.)

---

## 8. Software Construction & GitFlow (Aturan Tim)
Tim wajib mengikuti aturan berikut untuk penilaian:

1. Linter & Formatting
- Gunakan ESLint (repo sudah berisi `eslint.config.js`). Pastikan kode bebas error linter.
- Jalankan: `npm run lint` (sesuaikan script di `package.json`).

2. Branching & GitFlow
- Jangan commit langsung ke `main` atau `develop`.
- Setiap fitur dikerjakan di branch `feature/<nama-fitur>`.
- Merge ke `develop` lewat Pull Request (PR) dan wajib direview minimal 1 rekan.

3. Conventional Commits
- Gunakan format pesan commit: `feat:`, `fix:`, `docs:`, `refactor:`, dsb.

4. Pull Request
- PR harus berisi deskripsi singkat, issue/tujuan, dan langkah pengujian.
- Reviewer wajib meninggalkan komentar atau approval sebelum merge.

---

## 9. Deliverables (untuk pengumpulan UAS)
Pastikan repositori berisi:
1. README.md utama (file ini) yang memuat:
   - Deskripsi sistem & instruksi menjalankan lokal
   - Tabel kontribusi anggota (nama, NIM, peran, fitur, link video)
   - Penjelasan arsitektur dan daftar design pattern + lokasi file
2. Kode terstruktur sesuai arsitektur
3. Folder `docs/` berisi diagram UML (jika ada pembaruan)
4. File `database.sql` untuk setup DB
5. File `.env.example` (contoh variabel lingkungan)

## 10. Tabel Kontribusi Anggota (Contoh — isi oleh anggota)
| Nama | NIM | Peran | Fitur yang Dikerjakan | Link Video Penjelasan |
| --- | --- | --- | --- | --- |
| Nama Anggota 1 | 123456 | Backend | Transaksi, Repository | https://... |
| Nama Anggota 2 | 234567 | Frontend | UI Kasir, Public Assets | https://... |
| Nama Anggota 3 | 345678 | Integrasi & DOCS | README, UML, Deployment | https://... |

(Isi tabel ini dengan data anggota Anda sebelum pengumpulan.)

---

## 11. Video Penjelasan Individu
Setiap anggota harus mengunggah video 5-7 menit yang menampilkan:
1. Riwayat commit / branch yang dikerjakan (tunjukkan PR Anda)
2. Demo kode yang Anda tulis dan jelaskan bagaimana pemisahan layer diterapkan
3. Jelaskan satu design pattern yang Anda implementasikan (letak file & alasan)
4. Tunjukkan bahwa kode Anda bebas linter dan jelaskan prinsip clean code yang diterapkan

Video harus menampilkan wajah (webcam) dan screencast. Upload ke YouTube (Unlisted) atau Google Drive, dan masukkan link ke tabel kontribusi di README.

---

## 12. Checklist Pra-Pengumpulan
- [ ] README lengkap sesuai format UAS
- [ ] `.env.example` tersedia
- [ ] `database.sql` bisa di-import tanpa error
- [ ] Kode lint-clean: `npm run lint` -> no errors
- [ ] Semua fitur MVP berfungsi pada testing lokal
- [ ] PR dan branch sesuai GitFlow, pesan commit sesuai Conventional Commits
- [ ] Video individu diunggah dan link dimasukkan di README

---

## 13. Lisensi
Tambahkan file LICENSE (mis. MIT) jika diperlukan.

---

Jika Anda mau, saya bisa:
- Menambahkan/ memperbarui file `.env.example` di repo,
- Menambahkan checklist `docs/` atau template diagram UML,
- Membuat template Pull Request dan template issue untuk mempermudah alur GitFlow.

Isi tabel kontribusi di README dengan data anggota, lalu beri tahu saya jika ingin saya commit perubahan tambahan (mis. .env.example atau LICENSE).