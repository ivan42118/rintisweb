# Panduan RintisWeb

Panduan kerja untuk menjalankan RintisWeb: mengatur situs, menerima pesanan, mengerjakan tiap paket dengan cepat, dan mendapatkan 10 klien pertama.

Daftar isi:
1. [Isi folder](#1-isi-folder)
2. [Mengubah harga, nomor WhatsApp, dan promo](#2-mengubah-harga-nomor-whatsapp-dan-promo)
3. [Mencoba di komputer](#3-mencoba-di-komputer)
4. [Online-kan dan pindah ke rintisweb.id](#4-online-kan-dan-pindah-ke-rintiswebid)
5. [Alur menerima pesanan](#5-alur-menerima-pesanan)
6. [Template pesan WhatsApp](#6-template-pesan-whatsapp)
7. [Mengerjakan tiap paket dengan cepat](#7-mengerjakan-tiap-paket-dengan-cepat)
8. [Rencana 10 klien pertama dalam 30 hari](#8-rencana-10-klien-pertama-dalam-30-hari)
9. [Sinergi dengan berkenan.id lewat vendor pernikahan](#9-sinergi-dengan-berkenanid-lewat-vendor-pernikahan)
10. [Hitungan biaya dan untung](#10-hitungan-biaya-dan-untung)
11. [Hal yang perlu dijaga](#11-hal-yang-perlu-dijaga)

---

## 1. Isi folder

```
index.html                 Situs jualan RintisWeb
config.js                  PENGATURAN: nomor WA, harga paket, promo, daftar contoh
assets/landing.css, .js    Tampilan dan isi dinamis situs jualan (harga, kalkulator, kartu contoh)
assets/logo/               Logo siap pakai (lihat assets/logo/README.md)
assets/contoh/             Tangkapan layar contoh dan gambar pratinjau WhatsApp
contoh/                    Lima website contoh (toko baju, sepatu, batik, wedding organizer, kafe)
templates/toko-online/     Template Toko Online untuk klien
templates/halaman/         Template Landing Page dan Company Profile untuk klien
alat/                      Skrip bantu: logo, tangkapan layar, kompres foto, ganti domain
USULAN.md                  Riset harga dan keputusan awal
```

## 2. Mengubah harga, nomor WhatsApp, dan promo

Semua diatur di **`config.js`**. Buka dengan Notepad atau VS Code, ubah, lalu simpan.

| Yang diubah | Bagian di config.js |
|---|---|
| Nomor WhatsApp | `whatsapp: '62895386124189'` (format 62..., tanpa + dan spasi) |
| Harga dan isi paket | `paket: [...]` → `harga`, `fitur`, `lama` |
| Biaya tahun kedua | `perpanjangan: [...]` |
| Layanan tambahan | `tambahan: [...]` |
| Promo | `promo: 'Promo perkenalan: ...'`. Kosongkan (`''`) kalau tidak ada promo |
| Instagram | `instagram: 'rintisweb'` (tanpa @). Kosong = tidak ditampilkan |
| Angka awal kalkulator | `kalkulator: { omzetBawaan, potonganBawaan }` |
| Daftar contoh | `contoh: [...]` |

Setelah mengubah, naikkan angka versi `?v=...` di `index.html` (misalnya `?v=20261126a` menjadi `?v=20261127a`) supaya pengunjung lama tidak melihat versi tersimpan.

Harga di tombol WhatsApp, kartu paket, kalkulator, dan data untuk Google semuanya ikut berubah otomatis.

## 3. Mencoba di komputer

Buka PowerShell di folder `E:\website\rintisweb`, lalu jalankan:

```powershell
python -m http.server 5510
```

Buka http://localhost:5510 di browser. Untuk melihat tampilan HP, tekan F12 lalu klik ikon HP (Toggle device toolbar).

## 4. Online-kan dan pindah ke rintisweb.id

**Tahap 1: GitHub Pages (gratis).** Situs online di `https://ivan42118.github.io/rintisweb/`. Langkah ini dikerjakan setelah Anda menjawab "Ya, deploy".

**Tahap 2: domain sendiri.**
1. Beli `rintisweb.id` (Domainesia, Niagahoster, atau Rumahweb; butuh KTP, sekitar Rp 210–250 rb per tahun).
2. Di pengelola DNS domain, buat 4 record **A** untuk `@` ke `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, dan record **CNAME** `www` ke `ivan42118.github.io`.
3. Di repo GitHub: **Settings → Pages → Custom domain** isi `rintisweb.id`, lalu centang **Enforce HTTPS** setelah tersedia.
4. Ganti semua alamat lama di file:

   ```powershell
   python alat/ganti-domain.py https://ivan42118.github.io/rintisweb https://rintisweb.id
   ```

5. Daftarkan situs di [Google Search Console](https://search.google.com/search-console) dan kirim `sitemap.xml`.

**Membuat ulang gambar pratinjau** (setelah mengubah contoh): jalankan server lokal, lalu `python alat/buat-tangkapan.py`.

## 5. Alur menerima pesanan

| # | Langkah | Target waktu |
|---|---|---|
| 1 | **Chat masuk.** Balas dengan sapaan, tanyakan jenis usaha dan apa yang ingin dicapai (jualan online, dipercaya calon pelanggan, atau mudah ditemukan). | Kurang dari 1 jam |
| 2 | **Rekomendasikan paket** dan kirim link contoh yang paling mirip usahanya. | Di chat yang sama |
| 3 | **Kirim penawaran**: paket, harga, lama pengerjaan, cara bayar (DP 50%). | Hari yang sama |
| 4 | **Setelah DP masuk**, kirim daftar bahan. Pekerjaan dihitung mulai saat bahan lengkap. | |
| 5 | **Kerjakan** dengan template (lihat bagian 7). | Sesuai paket |
| 6 | **Kirim draf** berupa link pratinjau. Catat revisi dalam satu pesan berisi daftar bernomor. | |
| 7 | **Revisi** sesuai jatah paket (2× atau 3×). Revisi berikutnya Rp 50 rb. | 1–2 hari per revisi |
| 8 | **Pelunasan**, lalu online-kan di domain klien. | |
| 9 | **Serah terima**: link website, data akses domain, cara mengubah produk (Google Sheet), dan tawaran paket Rawat. | |
| 10 | **Minta testimoni** dan izin memajang websitenya sebagai portofolio. | 3–7 hari setelah online |
| 11 | **Catat** di tabel klien: nama, paket, tanggal online, tanggal perpanjangan domain. Ingatkan perpanjangan 30 hari sebelumnya. | |

**Daftar bahan dari klien:**
- Nama usaha, logo (kalau ada), dan warna yang disukai.
- Nomor WhatsApp untuk menerima pesanan.
- Foto: produk, tempat usaha, atau hasil kerja. Foto HP cukup asal terang.
- Toko Online: daftar produk (nama, harga, warna, ukuran, deskripsi singkat), pilihan pengiriman dan pembayaran.
- Company Profile: profil singkat, layanan dan harga, testimoni pelanggan, alamat, jam kerja.
- Landing Page: menu atau layanan dengan harga, jam buka, alamat atau titik Google Maps.
- Domain yang diinginkan (cek dulu ketersediaannya).

## 6. Template pesan WhatsApp

Simpan sebagai **Balasan cepat** di WhatsApp Business (Alat bisnis → Balasan cepat).

**/sapa**
> Halo Kak, terima kasih sudah menghubungi RintisWeb. Boleh cerita sedikit usahanya apa, dan website-nya ingin dipakai untuk apa? Misalnya jualan online, supaya lebih dipercaya calon pelanggan, atau supaya mudah ditemukan di Google.

**/tawar-toko**
> Untuk jualan produk, paling pas paket **Toko Online Rp 2.890.000** (sekali bayar, sudah termasuk domain dan hosting tahun pertama). Pembeli pilih ukuran dan warna, lalu pesanannya masuk langsung ke WhatsApp Kakak, tanpa potongan per transaksi.
> Contohnya bisa dicoba di sini: [link contoh toko]
> Pengerjaan 7–10 hari kerja setelah bahan lengkap. Pembayaran DP 50%, sisanya sebelum online.

**/tawar-profil**
> Untuk usaha jasa, paling pas paket **Company Profile Rp 1.890.000**: hingga 5 halaman, didaftarkan di Google Maps, tombol booking lewat WhatsApp, dan email bisnis. Contohnya: [link Sekar Wedding]

**/tawar-landing**
> Untuk kafe atau usaha yang butuh satu halaman lengkap, paket **Landing Page Rp 899.000**, jadi dalam 3 hari kerja. Contohnya: [link Kopi Tepas]

**/bahan**
> Terima kasih, DP sudah kami terima. Supaya bisa langsung dikerjakan, mohon kirim bahan berikut: [tempel daftar bahan sesuai paket]. Foto boleh dari HP, asal terang dan latarnya polos.

**/draf**
> Draf website sudah jadi, silakan dicek: [link]. Kalau ada yang ingin diubah, tulis dalam satu pesan berisi daftar bernomor supaya tidak ada yang terlewat.

**/serah-terima**
> Website Kakak sudah online di [domain]. Terlampir data akses domain dan panduan singkat mengubah produk lewat Google Sheet. Kalau ingin kami yang mengurus perubahan isi setiap bulan, ada paket Rawat Rp 99.000 per bulan.

**/testimoni**
> Kak, boleh minta testimoni singkat tentang pengerjaan website kemarin? Satu atau dua kalimat saja. Kalau berkenan, website Kakak juga kami pajang sebagai contoh di rintisweb. Terima kasih banyak.

**/perpanjang** (30 hari sebelum jatuh tempo)
> Halo Kak, domain dan hosting [domain] akan habis pada [tanggal]. Biaya perpanjangan Rp 399.000 per tahun. Kalau setuju, kami perpanjang supaya website tidak mati.

## 7. Mengerjakan tiap paket dengan cepat

Kuncinya: **jangan mulai dari nol.** Semua paket memakai template yang sudah jadi.

### Toko Online (dijanjikan 7–10 hari, kerja nyata sekitar 1–2 hari)
1. Salin `templates/toko-online/` ke folder klien.
2. Rapikan foto produk sekaligus:

   ```powershell
   python alat/kompres-foto.py "E:\klien\namatoko\foto-asli" "E:\klien\namatoko\img"
   ```

   (tambahkan `1:1 640` di akhir untuk foto persegi).
3. Isi `data.js` (petunjuk di `templates/README.md`). Untuk banyak produk, pakai Google Sheet: klien bisa mengisi sendiri.
4. Ganti judul dan meta di `index.html`, coba pesan sampai WhatsApp terbuka.
5. Online-kan: satu repo GitHub per klien (GitHub Pages) atau Cloudflare Pages. Hosting gratis, biaya hanya domain.

### Company Profile (5–7 hari, kerja nyata sekitar 1 hari)
1. Salin `contoh/sekar-wedding/` dan `templates/halaman/`, ganti teks, paket, dan foto.
2. **Google Business Profile**: daftarkan di business.google.com sebagai usaha tanpa alamat publik (area layanan) kalau klien tidak punya tempat usaha. Verifikasi biasanya lewat video atau kode pos; bantu klien sampai selesai.
3. **Email bisnis**: aktifkan penerusan email gratis (misalnya Email Routing di Cloudflare kalau DNS domain dipindah ke Cloudflare), sehingga `info@namausaha.com` masuk ke Gmail klien.

### Landing Page (3 hari, kerja nyata sekitar setengah hari)
1. Salin `contoh/kopi-tepas/` dan `templates/halaman/`, ganti menu, harga, jam buka (`jamBuka`), dan foto.
2. Tombol "Buka di Google Maps" diarahkan ke titik lokasi klien.

### Sebelum serah terima
Ikuti daftar periksa di `templates/README.md`: nomor WA benar, tidak ada tulisan "contoh", dicek di HP dan laptop, foto di bawah 100 KB.

## 8. Rencana 10 klien pertama dalam 30 hari

**Target:** 10 klien, misalnya 4 Toko Online, 3 Company Profile, 3 Landing Page. Kalau tercapai dengan harga normal, pendapatannya sekitar Rp 20 juta (lihat bagian 10). Ini target kerja, bukan jaminan.

**Senjata utama: contoh gratis.** Karena template sudah jadi, Anda bisa membuat contoh halaman dengan produk calon klien dalam 1–2 jam. Calon klien yang melihat tokonya sendiri sudah jadi jauh lebih mudah memutuskan.

### Minggu 1: persiapan dan lingkaran terdekat
- [ ] Online-kan situs RintisWeb.
- [ ] WhatsApp Business: foto profil `assets/logo/png/foto-profil-wa.png`, deskripsi, katalog 3 paket, pesan sambutan, dan balasan cepat dari bagian 6.
- [ ] Google Business Profile "RintisWeb" sebagai usaha area layanan Cirebon (alamat rumah tidak ditampilkan).
- [ ] Instagram dan TikTok @rintisweb (cek ketersediaan nama). 6 unggahan awal: 3 video layar contoh website, kalkulator potongan marketplace, cara pesan, dan perkenalan.
- [ ] Status WhatsApp dan pesan pribadi ke kontak dekat: "Saya sekarang membuka jasa pembuatan website. Kalau ada teman yang jualan online atau punya usaha, boleh dikenalkan." Sertakan link situs.
- [ ] Buat daftar 50 calon klien di Google Sheet: penjual online Cirebon di Instagram/TikTok (baju, hijab, sepatu, camilan), showroom batik Trusmi, kafe baru, klinik, dan vendor pernikahan.

### Minggu 2: jemput bola online
- [ ] Kirim 10 pesan pribadi per hari ke daftar calon klien. Sebut produk mereka, jangan pesan massal:
  > Halo Kak, saya Ivan dari RintisWeb, Cirebon. Saya lihat produk [nama produk] di Instagram Kakak, bagus sekali. Kalau berkenan, saya buatkan **contoh toko online gratis** berisi produk Kakak, jadi pembeli dari Instagram bisa langsung pesan lewat website dengan nama toko sendiri. Tidak ada kewajiban apa pun.
- [ ] Untuk yang membalas, buat contoh dalam 1–2 hari, kirim link-nya.
- [ ] Unggah konten 3× seminggu: "potongan marketplace omzet Rp 10 juta = Rp 1 juta per bulan", proses pembuatan, dan contoh baru.

### Minggu 3: datang langsung
- [ ] Kunjungi kawasan batik Trusmi dan pusat kuliner dengan HP berisi contoh website. Tawarkan **Daftar Google Maps Rp 150 rb** sebagai pintu masuk, lalu website.
- [ ] Bawa kartu atau selebaran kecil dengan QR ke situs RintisWeb.
- [ ] Gabung grup komunitas usaha Cirebon (Facebook dan WhatsApp), bagikan tips gratis, jangan langsung berjualan.

### Minggu 4: tutup penjualan dan testimoni
- [ ] Hubungi ulang semua yang sudah menerima contoh gratis.
- [ ] Minta testimoni dan rujukan dari klien pertama. Hadiah rujukan: 1 bulan Rawat gratis untuk setiap klien baru yang jadi.
- [ ] Pajang website klien sungguhan di situs (tambahkan ke `contoh` di `config.js`, dengan izin klien).

### Angka yang dipantau setiap minggu

| Angka | Target 30 hari |
|---|---|
| Pesan pribadi terkirim | 150–200 |
| Balasan | 30 |
| Contoh gratis dibuat | 15 |
| Klien membayar DP | 10 |

Kalau balasan sedikit, perbaiki pesan pembuka. Kalau contoh banyak tapi jarang jadi, perbaiki cara menawarkan atau pertimbangkan **promo perkenalan** di `config.js`.

## 9. Sinergi dengan berkenan.id lewat vendor pernikahan

Vendor pernikahan (wedding organizer, MUA, fotografer, dekorasi, katering) bisa menjadi **klien website sekaligus mitra** yang merekomendasikan berkenan.id ke pasangan pengantin.

1. **Tawarkan Company Profile** dengan contoh Sekar Wedding. Di contoh itu sudah ada layanan "Undangan digital, bekerja sama dengan berkenan.id".
2. **Program mitra berkenan.id**: setiap vendor mendapat kode rujukan. Pasangan yang memesan undangan dengan kode itu mendapat diskon, dan vendor mendapat komisi per undangan (misalnya Rp 20–30 rb). Besarnya bisa Anda tentukan sendiri.
3. **Paket bundling** untuk vendor: website Company Profile + undangan digital gratis untuk 3 klien pertama mereka, supaya vendor bisa langsung menawarkan undangan ke pelanggannya.
4. **Saling menguatkan di Google**: website vendor menautkan ke berkenan.id, dan berkenan.id bisa punya halaman "Vendor rekomendasi" yang menautkan balik.

Kalimat pembuka ke vendor:
> Pelanggan Kakak pasti butuh undangan, dan Kakak butuh website supaya calon pengantin percaya. Kami bisa bantu dua-duanya: website untuk usaha Kakak, dan undangan digital berkenan.id untuk pelanggan Kakak, dengan komisi untuk setiap undangan.

## 10. Hitungan biaya dan untung

Biaya rutin per klien hampir hanya domain, karena website statis bisa di-hosting gratis (GitHub Pages atau Cloudflare Pages).

| | Biaya Anda | Dibayar klien | Sisa |
|---|---|---|---|
| Domain .com tahun pertama | Rp 110–210 rb | termasuk paket | |
| Perpanjangan per tahun (.com) | Rp 140–210 rb | Rp 399 rb | Rp 190–260 rb |
| Perpanjangan per tahun (.id) | Rp 210–250 rb | Rp 449 rb | sekitar Rp 200 rb |
| Rawat | waktu Anda | Rp 99 rb per bulan | |

Contoh 10 klien pertama dengan harga normal:

| Paket | Jumlah | Harga | Total |
|---|---|---|---|
| Toko Online | 4 | Rp 2.890.000 | Rp 11.560.000 |
| Company Profile | 3 | Rp 1.890.000 | Rp 5.670.000 |
| Landing Page | 3 | Rp 899.000 | Rp 2.697.000 |
| **Jumlah** | **10** | | **Rp 19.927.000** |

Dikurangi domain tahun pertama (sekitar Rp 2 juta untuk 10 klien), dan setiap tahun berikutnya ada pemasukan perpanjangan sekitar Rp 4 juta dari 10 klien yang sama, ditambah Rawat bagi yang berlangganan.

## 11. Hal yang perlu dijaga

- **Jujur soal hasil.** Jangan menjanjikan website otomatis mendatangkan pembeli. Yang dijanjikan: tidak ada potongan per transaksi, toko dengan nama sendiri, pesanan langsung ke WhatsApp, dan lebih mudah ditemukan.
- **Angka potongan marketplace berbeda-beda** untuk tiap penjual. Kalkulator di situs sengaja memakai angka yang bisa diubah pengunjung.
- **Foto Unsplash hanya untuk website contoh.** Website klien memakai foto milik klien.
- **Alamat rumah tidak ditampilkan** di situs atau Google. Cukup "Cirebon, Jawa Barat".
- **Domain atas nama klien**, dan data aksesnya diserahkan saat serah terima.
- **Simpan bukti** setiap DP, pelunasan, dan persetujuan revisi di chat WhatsApp.
