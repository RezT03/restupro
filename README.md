# Restu Production

Website sewa perlengkapan event berbasis **Vue 3 + Vite** di frontend dan **Node.js + Express** di backend.

## Fitur

- Beranda dengan sistem desain editorial, carousel perlengkapan scroll-snap, dan animasi masuk yang ringan.
- Halaman **`/project`** + detail proyek bergaya artikel dengan galeri dan lightbox.
- Panel admin **`/admin`** untuk kelola proyek, upload media (gambar dikompres otomatis ke WebP), serta mengubah nomor telepon dan media sosial.
- Penyimpanan memakai **MySQL** (database `restupro`): pengaturan, proyek, media sebagai blob, **dan akun admin**.
- SEO: meta default di `index.html`, canonical + OpenGraph/Twitter per rute, JSON-LD, `robots.txt`, dan `sitemap.xml`.
- Mode gelap, navigasi responsif, lazy loading gambar, dan fallback bila API belum tersedia.

## Menjalankan

```bash
npm install
npm run setup:server          # install dependency Express

cp server/.env.example server/.env
# isi DB_USER / DB_PASSWORD
# database `restupro` beserta tabelnya dibuat otomatis saat server pertama kali jalan
# akun admin dibuat dari ADMIN_EMAIL + ADMIN_PASSWORD_HASH saat tabel admins masih kosong

npm run migrate --prefix server  # opsional: pindahkan data lama dari server/data/content.json
npm run dev:full                 # Vite :5173 + Express :3510
```

Buka http://localhost:5173. Panel admin di http://localhost:5173/admin.

Mode terpisah:

```bash
npm run dev        # hanya frontend (butuh API berjalan untuk data proyek)
npm run dev:api    # hanya backend
```

### Akun admin

Akun admin disimpan di tabel MySQL `admins`, bukan lagi di `.env`. Variabel `ADMIN_EMAIL` dan
`ADMIN_PASSWORD_HASH`/`ADMIN_PASSWORD` hanya dipakai **sekali** saat tabel masih kosong (bootstrap).

```bash
cd server
npm run admin -- list                          # lihat daftar admin
npm run admin -- add admin@domain.com          # tambah admin (password ditanyakan)
npm run admin -- password                      # ganti password (auto pilih satu-satunya admin)
npm run admin -- password admin@domain.com     # ganti password admin tertentu
npm run admin -- email lama@domain.com baru@domain.com
npm run admin -- remove admin@domain.com       # tidak bisa menghapus admin terakhir
```

Hash scrypt juga bisa dibuat terpisah dengan `npm run hash-password`, lalu disalin ke kolom
`password_hash`. Password minimal 12 karakter. Sesi aktif tetap berlaku hingga kedaluwarsa atau
server di-restart setelah ganti password.

## Build & produksi

```bash
npm run build
npm start                      # Express menyajikan folder dist/ + API di satu origin
```

Pastikan `NODE_ENV=production`, `SITE_URL=https://restuproduction.com`, `TRUST_PROXY=true` bila
di belakang reverse proxy, kredensial `DB_*` benar, dan sudah ada minimal satu baris di tabel
`admins`. Untuk bootstrap pertama, isi `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` di `.env`, jalankan
server sekali, lalu hapus keduanya.

## Struktur singkat

```
src/            frontend Vue (components, views, router, utils)
server/         Express API, auth, MySQL, upload & kompresi
  src/db.js     pool koneksi + skema tabel MySQL
  data/         backup legacy content.json + uploads/ (tidak dipakai runtime, gitignore)
scripts/dev.js  menjalankan Vite + Express bersamaan
public/         favicon, robots.txt, sitemap.xml, gambar statis
```

## Keamanan (ringkas)

- Sesi httpOnly + `SameSite=Strict` + `Secure` di production, token disimpan ter-hash di memory.
- CSRF: header khusus, pemeriksaan Origin/Referer, dan token CSRF per sesi.
- Rate limiting login & API, `scrypt` untuk kata sandi, timing-safe comparison.
- Upload: validasi magic bytes, batas ukuran, nama acak, kompresi WebP, metadata dihapus.
- Header: CSP, nosniff, frame-ancestors none, Referrer-Policy, Permissions-Policy, HSTS.
- Data admin dan blob media tidak pernah disajikan langsung sebagai file sistem; akses media hanya lewat endpoint `/media/:filename` yang tervalidasi.
- Query MySQL memakai prepared statement; nama database divalidasi sebelum dipakai dalam DDL.

## Dokumentasi tambahan

- [`docs/ASSETS_NEEDED.md`](./docs/ASSETS_NEEDED.md) — daftar gambar yang perlu Anda sediakan sendiri.
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — catatan deploy & environment.

## Warna brand

Biru `#4081f2`, merah `#f23d4c`, font Inter (teks) dan Poppins (judul).
