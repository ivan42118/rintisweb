# Template untuk pesanan klien

Dua template ini dipakai untuk mengerjakan pesanan dengan cepat. Website contoh di folder `contoh/` dibuat dari template yang sama.

| Paket | Template | Contoh jadi |
|---|---|---|
| **Toko Online** | `toko-online/` | `contoh/kanaya-wear`, `contoh/langkah-footwear`, `contoh/batik-sekar-jagad` |
| **Company Profile** | `halaman/` | `contoh/sekar-wedding` |
| **Landing Page** | `halaman/` | `contoh/kopi-tepas` |

## Toko Online

1. Salin folder `templates/toko-online/` ke folder baru untuk klien, misalnya `E:\klien\namatoko\`.
2. Buat folder `img/` di dalamnya, lalu masukkan foto produk. Ukuran yang disarankan:
   - Produk: 600 x 750 px (4:5) atau 640 x 640 px (1:1), format WebP, 20–80 KB.
   - Spanduk: 1400 x 700 px.
3. Isi `data.js`: nama toko, nomor WA, warna, kategori, produk, pembayaran, dan pengiriman. Setiap bagian sudah diberi keterangan.
   Pilih **gaya** sesuai keinginan klien:

   | Gaya | Kesan | Contoh |
   |---|---|---|
   | `butik` | Elegan dan tenang, foto besar, kategori berupa tab teks, rak "Lagi diskon" | `contoh/kanaya-wear` |
   | `pasar` | Ramai promo seperti marketplace: karusel, ikon kategori, flash sale dengan hitung mundur, menu bawah | `contoh/langkah-footwear` |
   | `galeri` | Mewah dan gelap untuk produk premium: koleksi per baris, cerita usaha, harga spesial | `contoh/batik-sekar-jagad` |

   Produk diskon cukup diberi `hargaCoret` (harga lama). Label persen, rak diskon, filter "Diskon", dan tulisan "Kamu hemat" muncul otomatis.
4. Ganti judul, deskripsi, dan alamat situs di `index.html`.
5. Jalankan `python -m http.server 5510` di folder klien, buka http://localhost:5510 di HP atau mode HP browser (F12), lalu coba pesan sampai WhatsApp terbuka.

### Produk dari Google Sheet (supaya klien bisa mengubah sendiri)

1. Buat Google Sheet dengan kolom persis seperti `contoh-sheet.csv`:
   `id, nama, kategori, harga, harga_coret, label, foto, warna, ukuran, ukuran_habis, habis, terjual, sisa, deskripsi`
2. Daftar warna dan ukuran dipisah koma (`S, M, L`). Beberapa foto dipisah garis tegak (`img/a.webp | img/b.webp`). Isi `ya` di kolom `habis` kalau stok habis.
3. Foto tetap disimpan di folder `img/` website. Klien cukup menulis nama filenya, atau kirim foto baru ke kita lewat WhatsApp.
4. **File > Bagikan > Publikasikan ke web**, pilih sheet produk, format **CSV**, lalu salin link-nya ke `sheetCsv` di `data.js`.
5. Perubahan di Google Sheet muncul di website dalam beberapa menit (Google menyimpan salinan sementara).

Kalau Google Sheet gagal dimuat, website otomatis memakai daftar `produk` di `data.js` sebagai cadangan.

### Cara kerja pesanan

Pembeli memilih produk, warna, ukuran, dan jumlah, lalu mengisi nama, alamat, pengiriman, dan pembayaran. Tombol **Pesan via WhatsApp** membuka WhatsApp penjual dengan pesan berisi daftar barang, total belanja, dan alamat. Penjual membalas dengan ongkir dan nomor rekening atau QRIS.

Keranjang dan data pembeli disimpan di HP pembeli (localStorage), jadi tidak ada data yang dikirim ke server mana pun selain lewat WhatsApp.

## Landing Page dan Company Profile

1. Salin `contoh/kopi-tepas/` (landing page) atau `contoh/sekar-wedding/` (company profile) ke folder klien, beserta folder `templates/halaman/`.
2. Ubah path CSS/JS di `index.html` dari `../../templates/halaman/` menjadi lokasi barunya, dan hapus baris `../../config.js`.
3. Di `<script>window.SITUS = {...}`: ubah `demo: false`, isi `nama`, `whatsapp`, dan `jamBuka` (kalau ada).
4. Ganti warna di `<style>:root {...}`, lalu ganti teks, menu, paket, dan foto langsung di HTML.

Fitur yang tersedia lewat atribut HTML:
- `data-wa="isi pesan"` pada tautan atau tombol: membuka WhatsApp dengan pesan itu.
- `<form data-form-wa="kalimat pembuka">`: semua isian (pakai `name` dan `data-label`) disusun jadi pesan WhatsApp. Isian `required` wajib diisi.
- `data-status-buka`: menampilkan "Buka sekarang · tutup 22.00" sesuai `jamBuka`.
- Tab menu: `role="tablist"` berisi `role="tab"` dengan `aria-controls` ke id panelnya.

## Sebelum diserahkan ke klien

- [ ] Nomor WhatsApp klien sudah benar dan sudah dicoba kirim pesan.
- [ ] `demo: false` dan tidak ada tulisan "contoh" atau "fiktif".
- [ ] Judul, deskripsi, dan gambar pratinjau (`og:image`) sudah sesuai usaha klien.
- [ ] Dicek di HP (lebar 375 px) dan di laptop.
- [ ] Semua foto sudah WebP dan di bawah 100 KB.
