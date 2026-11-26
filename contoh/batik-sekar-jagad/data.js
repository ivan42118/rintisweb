/* Contoh toko online RintisWeb (usaha fiktif). Format sama dengan templates/toko-online/data.js. */
window.TOKO = {
  demo: true,
  slug: 'batik-sekar-jagad',
  nama: 'Batik Sekar Jagad',
  slogan: 'Batik tulis dan cap khas Trusmi, Cirebon',
  whatsapp: '',
  tema: { utama: '#1d2f4f', aksen: '#a86f1f', latar: '#f8f4ec', kartu: '#fffdf8', teks: '#1f1a14', redup: '#6e6455', garis: '#e6dcc9', fontJudul: 'serif' },
  rasioFoto: '1 / 1',
  spanduk: {
    gambar: 'img/spanduk.webp',
    judul: 'Batik tulis dan cap dari Trusmi',
    teks: 'Langsung dari perajin di Cirebon: kain, kemeja, dan blouse.',
    tombol: 'Lihat katalog'
  },
  pengumuman: 'Butuh 10 lembar atau lebih untuk seragam kantor atau acara? Tanyakan harga grosir lewat WhatsApp.',
  kategori: ['Kain', 'Pakaian'],
  produk: [
    { id: 'kain-sogan-naga', nama: 'Kain Batik Tulis Sogan Motif Naga', kategori: 'Kain', harga: 850000, label: 'Batik tulis',
      foto: ['img/kain-sogan-naga.webp', 'img/kain-sogan-naga-detail.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Dibatik tangan dengan canting dan pewarna sogan. Satu lembar dikerjakan sekitar tiga minggu, jadi setiap lembar punya sedikit perbedaan.' },
    { id: 'kain-parang', nama: 'Kain Batik Cap Motif Parang', kategori: 'Kain', harga: 175000, label: 'Terlaris',
      foto: ['img/kain-parang.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Batik cap motif parang yang tegas. Cocok untuk kemeja pria dan bawahan kebaya.' },
    { id: 'kain-sogan-klasik', nama: 'Kain Batik Cap Sogan Klasik', kategori: 'Kain', harga: 225000,
      foto: ['img/kain-sogan-klasik.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Warna sogan klasik dengan motif bunga dan sulur, di atas katun primissima yang halus.' },
    { id: 'kain-latar-putih', nama: 'Kain Batik Tulis Latar Putih', kategori: 'Kain', harga: 650000, label: 'Batik tulis',
      foto: ['img/kain-latar-putih.webp', 'img/kain-latar-putih-detail.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Latar putih gading dengan motif cokelat. Tampil bersih dan elegan untuk acara resmi.' },
    { id: 'kain-ceplok', nama: 'Kain Batik Cap Motif Ceplok', kategori: 'Kain', harga: 165000, hargaCoret: 195000, label: 'Diskon',
      foto: ['img/kain-ceplok.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Motif ceplok berulang yang rapi. Pilihan hemat untuk seragam.' },
    { id: 'kain-ceplok-kecil', nama: 'Kain Batik Cap Ceplok Kecil', kategori: 'Kain', harga: 155000,
      foto: ['img/kain-ceplok-kecil.webp'], ukuran: ['2 m × 1,15 m'],
      deskripsi: 'Motif kecil yang kalem, cocok untuk blouse dan gamis.' },
    { id: 'blouse-batik-biru', nama: 'Blouse Batik Biru Lengan Pendek', kategori: 'Pakaian', harga: 245000,
      foto: ['img/blouse-batik-biru.webp'], ukuran: ['S', 'M', 'L', 'XL'],
      deskripsi: 'Blouse katun motif bunga biru dengan kancing depan. Cocok untuk ke kantor.' },
    { id: 'kemeja-batik-pria', nama: 'Kemeja Batik Pria Lengan Panjang', kategori: 'Pakaian', harga: 289000,
      foto: ['img/kemeja-batik-pria.webp', 'img/kemeja-batik-pria-detail.webp'], ukuran: ['M', 'L', 'XL', 'XXL'], ukuranHabis: ['M'],
      deskripsi: 'Kemeja batik cap berfuring dengan kerah tegak. Nyaman untuk kondangan dan acara kantor.' }
  ],
  panduanUkuran: {
    judul: 'Panduan ukuran pakaian (cm)',
    untuk: ['Pakaian'],
    kolom: ['Ukuran', 'Lingkar dada', 'Panjang'],
    baris: [['S', '98', '68'], ['M', '104', '70'], ['L', '110', '72'], ['XL', '116', '74'], ['XXL', '122', '76']]
  },
  catatanProduk: 'Warna kain bisa sedikit berbeda di layar HP. Kain batik tulis dibuat manual, jadi setiap lembar unik.',
  pembayaran: ['QRIS', 'Transfer BCA', 'Transfer BRI', 'Transfer BNI'],
  pengiriman: ['JNE', 'J&T Express', 'POS Indonesia', 'Ambil di showroom Trusmi'],
  testimoni: [
    { nama: 'Bu Lestari', kota: 'Bandung', teks: 'Pesan 25 kemeja untuk seragam kantor. Motif dan warnanya seragam, dikirim tepat waktu.' },
    { nama: 'Hendra', kota: 'Jakarta', teks: 'Batik tulisnya halus sekali, dan fotonya sesuai aslinya.' },
    { nama: 'Aisyah', kota: 'Cirebon', teks: 'Bisa pilih kain lewat foto dulu, lalu dijahitkan sekalian. Praktis.' }
  ],
  info: { alamat: 'Kawasan Trusmi, Kabupaten Cirebon (alamat contoh)', jam: 'Setiap hari, 08.00–17.00' }
};
