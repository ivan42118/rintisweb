# File logo RintisWeb

Buka `pratinjau.html` untuk melihat semua file sekaligus.

## Mau dipakai di mana?

| Keperluan | File |
|---|---|
| Foto profil WhatsApp Business dan Instagram | `png/foto-profil-wa.png` |
| Website, latar terang | `rintisweb-logo-warna.svg` |
| Website, latar gelap | `rintisweb-logo-putih.svg` |
| Kartu nama, brosur, slide, Canva | `png/rintisweb-logo-warna-2000.png` atau versi `tagline` |
| Spanduk, plang, kaos (kirim ke percetakan) | SVG versi `warna`; kalau percetakan tidak bisa membuka SVG, kirim PNG 2000 px |
| Sablon, stiker, bordir (tanpa gradasi) | `rintisweb-logo-datar.svg` atau `rintisweb-ikon-datar.svg` |
| Stempel, fotokopi | `rintisweb-logo-hitam.svg` |
| Ikon tab browser | `favicon.svg`, `favicon.ico` |
| Ikon saat situs disimpan ke layar HP | `png/apple-touch-icon.png`, `png/icon-192.png`, `png/icon-512.png` |

## Warna

| Nama | Kode |
|---|---|
| Navy tulisan "Rintis" | `#0B1647` |
| Biru tulisan "Web" | `#1257FF` |
| Gradasi huruf R | `#061C7C` → `#0A2A9E` → `#0A5CF0` |
| Gradasi panah | `#00B8FC` → `#0A6CFF` |
| Biru muda "Web" di latar gelap | `#4D9DFF` |

Huruf: **Figtree** ExtraBold (800) untuk nama, Bold (700) untuk tagline. Gratis dipakai untuk usaha (lisensi SIL Open Font License), file ada di `assets/fonts/`.

## Aturan pakai

- Jangan mengubah warna, memiringkan, atau menarik logo sampai gepeng.
- Beri ruang kosong di sekeliling logo, minimal setinggi titik-titik di dalam huruf R.
- Di latar foto yang ramai, pakai versi putih di atas kotak gelap.

## Membuat ulang

Bentuk logo dan tulisannya diatur di `alat/buat-logo.py`. Setelah mengubahnya, jalankan dari folder proyek:

```powershell
python alat/buat-logo.py
```

Butuh Python dengan `fonttools` dan `Pillow`, serta Google Chrome (untuk membuat PNG).

Konsep logo berasal dari gambar buatan ChatGPT milik pengguna (`konsep-logo/gpt-ikon.png`), lalu digambar ulang sebagai vektor.
