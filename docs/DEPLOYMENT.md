# Catatan deploy

## Mode satu origin (direkomendasikan)

Jalankan `npm run build`, lalu `npm start`. Express menyajikan `dist/` sekaligus API `/api` dan
`/media`, sehingga tidak perlu CORS dan cookie serta CSRF bekerja optimal.

Reverse proxy (Nginx/Cloudflare) harus meneruskan header `Host`, `X-Forwarded-Proto`, dan
`X-Forwarded-For`. Set `TRUST_PROXY=true` dan `NODE_ENV=production`.

## Environment production

```env
PORT=3510
NODE_ENV=production
SITE_URL=https://restuproduction.com
TRUST_PROXY=true

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=restupro
DB_PASSWORD=password-mysql-yang-kuat
DB_NAME=restupro

# Hanya untuk bootstrap admin pertama; hapus setelah tabel admins terisi.
ADMIN_USERNAME=yogaa
ADMIN_PASSWORD_HASH=scrypt$...
```

Database dan tabel (`settings`, `projects`, `media`, `admins`) dibuat otomatis saat server pertama
kali berjalan. User MySQL harus punya hak `CREATE DATABASE`, `CREATE TABLE`, `SELECT`, `INSERT`,
`UPDATE`, dan `DELETE`.

Akun admin tersimpan di tabel `admins` dan login memakai **username** (bukan email). Saat tabel masih
kosong, server memindahkan kredensial dari `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` ke database, lalu
variabel tersebut tidak dipakai lagi. Kelola akun dengan:

```bash
npm run admin -- list
npm run admin -- add yogaa
npm run admin -- password yogaa
npm run admin -- rename yogaa yogaa2
```

## Shared hosting (cPanel / hPanel)

Shared hosting **hanya bisa dipakai kalau ada fitur Node.js** (mis. *Setup Node.js App* di cPanel
atau *Node.js* di hPanel). Kalau host hanya menyediakan PHP/static, aplikasi Express ini tidak bisa
berjalan — `dist/` saja tidak cukup karena API, admin, dan media butuh Node + MySQL.

Langkah umum:

1. Buat database MySQL lewat panel dengan nama `restupro`, lalu buat user dan beri hak pada database
   itu (`CREATE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`). Hak `CREATE DATABASE` dan `REFERENCES`
   **tidak diperlukan**; aplikasi sudah menangani keduanya.
2. Upload `dist/`, `server/`, dan `package.json` root. Jangan upload `node_modules/` atau `server/.env`.
3. Di panel Node.js: app root = folder project, startup file = `server/src/server.js`, versi Node 20+.
   Panel biasanya menyuntik variabel `PORT`; nilai ini menang atas `server/.env`.
4. Isi environment variables lewat panel: `NODE_ENV=production`, `SITE_URL=https://domain.com`,
   `TRUST_PROXY=true`, `DB_*`, dan `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH` untuk bootstrap pertama.
5. Jalankan *Run NPM Install* (atau `npm install --prefix server --omit=dev` lewat terminal panel),
   lalu restart app dan cek `/api/health`.

Catatan khusus shared hosting:

- Wajib HTTPS: saat `NODE_ENV=production`, cookie admin memakai atribut `Secure`.
- Panel bisa me-restart proses kapan saja. Sesi admin disimpan di memory, jadi admin mungkin perlu
  login ulang setelah restart. Pakai satu instance saja (session belum bersama antar instance).
- `max_allowed_packet` MySQL di shared hosting sering kecil. Kalau upload video gagal, turunkan
  `MAX_VIDEO_MB` atau minta host menaikkannya.
- Pastikan ukuran/memori plan cukup untuk `sharp` saat mengompres gambar.

## Migrasi dari penyimpanan JSON lama

Jika masih punya `server/data/content.json` dan `server/data/uploads/`:

```bash
npm run migrate --prefix server
```

Skrip ini menyalin pengaturan, proyek, dan blob media ke MySQL. File lama sengaja tidak dihapus
sebagai backup.

## Yang perlu diperhatikan

- Seluruh data runtime ada di MySQL. Backup cukup dengan `mysqldump -u restupro -p restupro > backup.sql`.
- File upload disimpan sebagai `LONGBLOB` di tabel `media`, jadi tidak perlu volume/filesystem persisten untuk upload.
- `server/data/` hanya berisi backup legacy dan sudah masuk `.gitignore`.
- Perbarui `SITE_URL`, canonical di `index.html`, `public/robots.txt`, dan `public/sitemap.xml`
  jika domain berubah.
- Tambahkan URL proyek yang dipublikasikan ke `sitemap.xml` bila ingin indeks lebih cepat.
- `robots.txt` sudah memblokir `/admin`, `/api/`, dan `/data/`.
- Sesuaikan `max_allowed_packet` MySQL bila ingin mengunggah video besar (default bawaan bawaan
  umumnya 64 MB; batas aplikasi saat ini 60 MB per video).
