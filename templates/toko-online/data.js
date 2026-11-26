/*
 * DATA TOKO: satu-satunya file yang diubah untuk setiap klien Toko Online.
 * Salin seluruh folder templates/toko-online ke repo klien, lalu isi file ini.
 * Petunjuk lengkap: templates/README.md
 */
window.TOKO = {
  demo: false,                      // true hanya untuk website contoh RintisWeb
  gaya: 'butik',                    // 'butik' (elegan), 'pasar' (ramai promo ala marketplace), 'galeri' (mewah, gelap)
                                    // Contoh tiap gaya: contoh/kanaya-wear, contoh/langkah-footwear, contoh/batik-sekar-jagad
  judulDiskon: '',                  // judul rak produk diskon, misalnya 'Lagi diskon' atau 'Flash Sale'
  promoBerakhir: '',                // gaya pasar: waktu akhir flash sale, misalnya '2026-12-31T23:59'. Kosong = tengah malam setiap hari
  // Gaya pasar: slide: [{ judul, teks, gambar, latar }], ikonKategori: { Semua: '🛍️', NamaKategori: '👟', Promo: '🏷️' }
  // Gaya galeri: cerita: { judul, teks, gambar, alt }, keteranganDiskon: 'Berlaku sampai ...'
  // Setiap produk boleh diberi terjual: 120 dan sisa: 5 (ditampilkan di gaya pasar)
  slug: 'nama-toko',                // huruf kecil tanpa spasi, dipakai untuk menyimpan keranjang
  nama: 'Nama Toko',
  slogan: 'Satu kalimat tentang toko',
  whatsapp: '62xxxxxxxxxx',         // nomor WA penerima pesanan, format 62..., tanpa + dan spasi

  // Warna: utama (header, tombol pilihan), aksen (tombol beli, label), latar halaman, dan lainnya.
  // fontJudul: 'serif' untuk kesan klasik/elegan, kosongkan untuk huruf biasa.
  tema: { utama: '#1f2937', aksen: '#c2410c', latar: '#ffffff', kartu: '#ffffff', teks: '#1c1917', redup: '#6b6460', garis: '#e8e2db', fontJudul: '' },
  rasioFoto: '4 / 5',               // '4 / 5' untuk baju/sepatu, '1 / 1' untuk kain atau produk persegi

  // Spanduk atas. Hapus "gambar" kalau tidak punya foto spanduk (1400 x 700 px).
  spanduk: { gambar: 'img/spanduk.webp', judul: 'Judul promo', teks: 'Kalimat pendukung.', tombol: 'Belanja sekarang' },
  pengumuman: '',                   // contoh: 'Gratis ongkir se-Kota Cirebon untuk belanja minimal Rp 200.000.'
  kategori: ['Kategori 1', 'Kategori 2'],

  // Produk dari Google Sheet (opsional). Kalau diisi, daftar "produk" di bawah hanya jadi cadangan.
  // Cara: Google Sheet > File > Bagikan > Publikasikan ke web > pilih sheet > format CSV > salin link.
  sheetCsv: '',

  produk: [
    {
      id: 'produk-1',
      nama: 'Nama Produk',
      kategori: 'Kategori 1',
      harga: 150000,
      hargaCoret: 0,                // isi harga lama untuk menampilkan diskon
      label: 'Baru',                // contoh: Baru, Terlaris, Diskon (kosongkan kalau tidak ada)
      foto: ['img/produk-1.webp'],  // boleh lebih dari satu foto
      warna: ['Hitam', 'Putih'],
      ukuran: ['S', 'M', 'L', 'XL'],
      ukuranHabis: ['XL'],          // ukuran yang stoknya habis
      habis: false,                 // true kalau semua stok habis
      deskripsi: 'Bahan, ukuran, dan keunggulan produk.'
    }
  ],

  // Panduan ukuran (opsional). "untuk" = kategori yang memakai panduan ini.
  panduanUkuran: {
    judul: 'Panduan ukuran (cm)',
    untuk: ['Kategori 1'],
    kolom: ['Ukuran', 'Lingkar dada', 'Panjang'],
    baris: [['S', '96', '66'], ['M', '100', '68'], ['L', '104', '70'], ['XL', '110', '72']],
    catatan: ''
  },
  catatanProduk: '',                // catatan kecil di bawah tombol beli, opsional
  pembayaran: ['QRIS', 'Transfer BCA'],
  pengiriman: ['JNE', 'J&T Express', 'Ambil di toko'],   // pilihan yang mengandung kata "Ambil" tidak meminta alamat
  testimoni: [
    { nama: 'Nama pembeli', kota: 'Kota', teks: 'Isi testimoni asli dari pembeli.' }
  ],
  info: { alamat: 'Alamat toko', jam: 'Setiap hari, 09.00–21.00', instagram: '' },
  urlKredit: 'https://rintisweb.id' // tautan "Website oleh RintisWeb" di kaki halaman; isi kredit: false untuk menghilangkan
};
