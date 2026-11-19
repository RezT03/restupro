# Daftar aset gambar yang perlu disiapkan

Saya **tidak menambah atau menghasilkan file gambar baru** ke dalam repository. Gambar yang sudah ada
di `public/images/` tetap dipakai. Untuk konten proyek, silakan unggah foto Anda sendiri melalui
**Panel Admin → Media** (gambar otomatis dikompres ke WebP maks. 1920px, plus thumbnail 800px).

## Gambar yang sebaiknya Anda siapkan sendiri

| Kebutuhan | Ukuran ideal | Format | Catatan |
| --- | --- | --- | --- |
| Foto sampul tiap proyek | 1600×900 (16:9) | JPG/PNG/WebP | Akan dipakai di kartu `/project` dan header artikel |
| Galeri proyek (3–8 foto per proyek) | minimal 1200×800 | JPG/PNG/WebP | Dipakai lightbox di halaman detail |
| Foto hero alternatif | 1600×1067 | JPG/WebP | Saat ini memakai `public/images/hero.png` |
| Logo/resolusi tinggi | SVG | SVG | Saat ini: `public/images/RESPRO LOGO-exc.svg` |
| Favicon modern | 512×512 PNG + ICO | PNG/ICO | Saat ini hanya `favicon.ico` |
| Foto tim (opsional, halaman Tentang) | 800×1000 | JPG/WebP | Belum dipakai; bisa ditambahkan later |

## Optimasi aset lama (disarankan)

- `public/images/barikade.png` ≈ 1,9 MB — paling berat. Sebaiknya dikonversi ke WebP (target < 250 KB).
- `public/images/img.zip` ≈ 3,6 MB — duplikat dari 7 PNG, tidak dipakai aplikasi. Bisa dihapus dari `public/`
  agar tidak ikut terdeploy.
- `public/images/icons/*.svg` dan `src/assets/logo.svg` tidak dipakai setelah redesign (font Material Icons
  sudah dihapus, diganti SVG inline). Boleh dibersihkan.

## Cara memasukkan gambar

1. Buka `/admin`, masuk.
2. Tab **Media** → tarik file ke area unggah atau pilih file.
3. Tab **Proyek** → buat/ubah proyek → pilih **Gambar sampul** dan centang galeri.
4. Simpan. Proyek dengan status **Dipublikasikan** langsung tampil di `/project` dan beranda.

Tidak perlu mengubah kode untuk menambah gambar baru.
