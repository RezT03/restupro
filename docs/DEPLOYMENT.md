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
ADMIN_EMAIL=admin@restuproduction.com
ADMIN_PASSWORD_HASH=scrypt$...
```

Database dan tabel (`settings`, `projects`, `media`, `admins`) dibuat otomatis saat server pertama
kali berjalan. User MySQL harus punya hak `CREATE DATABASE`, `CREATE TABLE`, `SELECT`, `INSERT`,
`UPDATE`, dan `DELETE`.

Akun admin tersimpan di tabel `admins`. Saat tabel masih kosong, server memindahkan kredensial dari
`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` ke database, lalu variabel tersebut tidak dipakai lagi.
Kelola akun dengan:

```bash
npm run admin -- list
npm run admin -- add admin@domain.com
npm run admin -- password admin@domain.com
```

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
