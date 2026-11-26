/*
 * PENGATURAN RINTISWEB: satu-satunya file yang perlu diubah untuk nomor WhatsApp, harga paket, promo,
 * dan daftar website contoh. Dipakai oleh situs jualan (index.html) dan bilah "Mau yang seperti ini?"
 * di semua website contoh (folder contoh/).
 */
window.RINTISWEB = {
  nama: 'RintisWeb',
  tagline: 'Jasa Pembuatan Website',

  // Nomor WhatsApp penerima pesanan: format 62xxxxxxxxxx, tanpa +, spasi, atau tanda hubung.
  whatsapp: '62895386124189',
  instagram: '', // tanpa @, kosongkan kalau belum ada

  // Alamat situs setelah online, TANPA garis miring di akhir. Ganti saat pindah ke domain sendiri (rintisweb.id).
  situs: 'https://ivan42118.github.io/rintisweb',
  kota: 'Cirebon, Jawa Barat',
  pembayaran: 'Transfer bank atau QRIS (DP 50%, sisanya sebelum website online)',

  // Teks promo opsional di atas daftar harga. Pakai hanya kalau benar dijalankan.
  // Contoh: 'Promo perkenalan: diskon 30% untuk 10 klien pertama, ditukar testimoni.'
  promo: '',

  // Urutan di sini = urutan kartu di situs. "unggulan: true" diberi tanda paling dicari.
  paket: [
    {
      id: 'toko-online',
      nama: 'Toko Online',
      slogan: 'Punya toko online sendiri, cuan maksimal.',
      harga: 2890000,
      unggulan: true,
      label: 'Paling dicari',
      lama: '7–10 hari kerja',
      cocok: 'Toko baju, sepatu, tas, hijab, batik, skincare, camilan',
      fitur: [
        'Katalog dengan kategori, pencarian, dan urutan harga',
        'Varian ukuran dan warna, stok habis per ukuran, harga coret',
        'Beberapa foto per produk dan panduan ukuran',
        'Keranjang belanja: pesanan rapi masuk WhatsApp (barang, varian, total, alamat)',
        'Ubah produk dan harga sendiri lewat Google Sheet',
        '30 produk pertama kami yang masukkan',
        'Semua isi paket Company Profile',
        '3× revisi'
      ]
    },
    {
      id: 'company-profile',
      nama: 'Company Profile',
      slogan: 'Bangun Website, Bangun Kepercayaan.',
      harga: 1890000,
      lama: '5–7 hari kerja',
      cocok: 'Klinik, wedding organizer, bengkel, kontraktor, sekolah',
      fitur: [
        'Hingga 5 halaman: Beranda, Tentang, Layanan dan harga, Galeri, Kontak',
        'Tombol booking atau cek jadwal lewat WhatsApp',
        'Didaftarkan di Google Maps (Google Business Profile)',
        'Email bisnis, misalnya info@namausaha.com',
        'SEO dasar supaya mudah ditemukan di Google',
        '3× revisi'
      ]
    },
    {
      id: 'landing-page',
      nama: 'Landing Page',
      slogan: 'Mudah Ditemukan, Langsung Dihubungi.',
      harga: 899000,
      lama: '3 hari kerja',
      cocok: 'Kafe, warung makan, jasa rumahan',
      fitur: [
        '1 halaman lengkap: profil, hingga 8 produk atau layanan, galeri, testimoni',
        'Google Maps, jam buka, dan tombol WhatsApp berisi pesan otomatis',
        'SEO dasar',
        '2× revisi'
      ]
    }
  ],
  termasuk: 'Sudah termasuk domain .com atau .id, hosting, dan SSL untuk tahun pertama.',

  // Biaya mulai tahun kedua
  perpanjangan: [
    { nama: 'Perpanjangan', harga: 399000, satuan: '/tahun', isi: 'Domain .com, hosting, SSL, cadangan data, dan perbaikan kalau ada yang rusak. Domain .id Rp 449.000/tahun.' },
    { nama: 'Rawat', harga: 99000, satuan: '/bulan', isi: 'Semua isi Perpanjangan, ditambah 4× ubah isi per bulan (harga, foto, promo) dan laporan pengunjung. Atau Rp 990.000/tahun.' }
  ],

  // [nama layanan, harga, satuan]
  tambahan: [
    ['Daftar Google Maps saja', 150000, ''],
    ['Input produk tambahan oleh kami (di atas 30 produk)', 3000, '/produk'],
    ['Logo sederhana', 250000, ''],
    ['Tambah halaman', 150000, '/halaman'],
    ['Versi bahasa Inggris', 300000, ''],
    ['Domain .co.id', 150000, ' tambahan'],
    ['Revisi tambahan', 50000, '/revisi']
  ],

  // Kalkulator potongan marketplace (angka awal; pengunjung bisa mengubahnya)
  kalkulator: { omzetBawaan: 10000000, potonganBawaan: 10 },

  // Website contoh. "paket" harus sama dengan id paket di atas.
  contoh: [
    { id: 'kanaya-wear', nama: 'Kanaya Wear', jenis: 'Toko baju', paket: 'toko-online', url: 'contoh/kanaya-wear/', gambar: 'assets/contoh/kanaya-wear.webp',
      ringkas: 'Busana muslimah dan kasual: varian ukuran dan warna, panduan ukuran, keranjang, pesanan ke WhatsApp.' },
    { id: 'langkah-footwear', nama: 'Langkah Footwear', jenis: 'Toko sepatu', paket: 'toko-online', url: 'contoh/langkah-footwear/', gambar: 'assets/contoh/langkah-footwear.webp',
      ringkas: 'Sepatu kulit lokal: ukuran 36–44, stok habis per ukuran, panduan ukuran kaki.' },
    { id: 'batik-sekar-jagad', nama: 'Batik Sekar Jagad', jenis: 'Batik Cirebon', paket: 'toko-online', url: 'contoh/batik-sekar-jagad/', gambar: 'assets/contoh/batik-sekar-jagad.webp',
      ringkas: 'Kain batik tulis dan cap khas Trusmi, kemeja, blouse, dan pesanan grosir.' },
    { id: 'sekar-wedding', nama: 'Sekar Wedding', jenis: 'Wedding organizer', paket: 'company-profile', url: 'contoh/sekar-wedding/', gambar: 'assets/contoh/sekar-wedding.webp',
      ringkas: 'Portofolio, daftar paket, dan cek tanggal lewat WhatsApp.' },
    { id: 'kopi-tepas', nama: 'Kopi Tepas', jenis: 'Kafe', paket: 'landing-page', url: 'contoh/kopi-tepas/', gambar: 'assets/contoh/kopi-tepas.webp',
      ringkas: 'Menu dan harga, jam buka, lokasi, dan pesan lewat WhatsApp.' }
  ]
};
