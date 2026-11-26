/* Contoh toko online RintisWeb (usaha fiktif). Format sama dengan templates/toko-online/data.js. */
window.TOKO = {
  demo: true,
  slug: 'langkah-footwear',
  nama: 'Langkah Footwear',
  slogan: 'Sepatu kulit buatan perajin lokal',
  whatsapp: '',
  tema: { utama: '#2f2a26', aksen: '#b8742a', latar: '#f5f1ea', kartu: '#fffdf9', teks: '#221d19', redup: '#6f655c', garis: '#e4dccf', radius: '10px' },
  rasioFoto: '4 / 5',
  spanduk: {
    judul: 'Kulit asli, dijahit tangan',
    teks: 'Dibuat perajin lokal. Garansi jahitan 6 bulan dan tukar ukuran gratis.',
    tombol: 'Lihat koleksi'
  },
  pengumuman: 'Tukar ukuran gratis maksimal 7 hari setelah barang diterima.',
  kategori: ['Pria', 'Wanita', 'Kasual'],
  produk: [
    { id: 'oxford-cokelat', nama: 'Oxford Kulit Cokelat Tua', kategori: 'Pria', harga: 459000, label: 'Terlaris',
      foto: ['img/oxford-cokelat.webp', 'img/oxford-cokelat-detail.webp'], ukuran: ['39', '40', '41', '42', '43', '44'], ukuranHabis: ['44'],
      deskripsi: 'Kulit sapi asli dengan sol karet antiselip. Cocok untuk kerja dan acara resmi.' },
    { id: 'derby-navy', nama: 'Derby Kulit Biru Dongker', kategori: 'Pria', harga: 429000, hargaCoret: 489000, label: 'Diskon',
      foto: ['img/derby-navy.webp'], ukuran: ['39', '40', '41', '42', '43', '44'],
      deskripsi: 'Kulit sapi semi-glossy, tali lilin, dan insole empuk untuk dipakai seharian.' },
    { id: 'loafer-gesper', nama: 'Loafer Kulit Gesper', kategori: 'Pria', harga: 399000,
      foto: ['img/loafer-kulit.webp'], ukuran: ['39', '40', '41', '42', '43'],
      deskripsi: 'Tanpa tali, tinggal pakai. Gesper logam warna emas dan sol kulit berlapis karet.' },
    { id: 'boots-brogue', nama: 'Boots Brogue Tan', kategori: 'Pria', harga: 589000, label: 'Baru',
      foto: ['img/boots-brogue.webp', 'img/boots-brogue-detail.webp'], ukuran: ['39', '40', '41', '42', '43', '44'],
      deskripsi: 'Boots semata kaki dengan detail brogue. Sol tebal dan tahan cipratan air, cocok untuk musim hujan.' },
    { id: 'ankle-boots', nama: 'Ankle Boots Suede Wanita', kategori: 'Wanita', harga: 449000,
      foto: ['img/ankle-boots-suede.webp'], ukuran: ['36', '37', '38', '39', '40'], ukuranHabis: ['40'],
      deskripsi: 'Suede lembut dengan ritsleting samping dan hak 3 cm. Nyaman untuk jalan jauh.' },
    { id: 'sneakers-kanvas', nama: 'Sneakers Kanvas Abu', kategori: 'Kasual', harga: 249000, hargaCoret: 299000,
      foto: ['img/sneakers-kanvas.webp'], ukuran: ['37', '38', '39', '40', '41', '42', '43', '44'],
      deskripsi: 'Kanvas tebal dengan sol vulkanisir. Ringan untuk kuliah dan jalan santai.' },
    { id: 'sandal-kulit', nama: 'Sandal Kulit Tali Silang', kategori: 'Kasual', harga: 189000,
      foto: ['img/sandal-kulit.webp', 'img/sandal-kulit-detail.webp'], ukuran: ['38', '39', '40', '41', '42', '43'],
      deskripsi: 'Kulit sapi dengan tali silang dan sol karet empuk. Bisa untuk pria maupun wanita.' },
    { id: 'wedges-marun', nama: 'Wedges Marun', kategori: 'Wanita', harga: 279000, habis: true,
      foto: ['img/wedges-marun.webp'], ukuran: ['36', '37', '38', '39', '40'],
      deskripsi: 'Wedges 6 cm dengan tali pergelangan. Tinggi tapi tetap stabil.' }
  ],
  panduanUkuran: {
    judul: 'Panduan ukuran sepatu',
    kolom: ['Ukuran (EU)', 'Panjang kaki (cm)'],
    baris: [['36', '23,0'], ['37', '23,5'], ['38', '24,0'], ['39', '24,5'], ['40', '25,0'], ['41', '26,0'], ['42', '26,5'], ['43', '27,5'], ['44', '28,0']],
    catatan: 'Ukur dari tumit sampai ujung jari terpanjang. Kalau di antara dua ukuran, pilih yang lebih besar.'
  },
  pembayaran: ['QRIS', 'Transfer BCA', 'Transfer Mandiri'],
  pengiriman: ['JNE', 'J&T Express', 'SiCepat', 'Ambil di toko'],
  testimoni: [
    { nama: 'Arif', kota: 'Cirebon', teks: 'Kulitnya tebal dan jahitannya kuat. Sudah setahun dipakai kerja, masih bagus.' },
    { nama: 'Bima', kota: 'Majalengka', teks: 'Sempat salah ukuran, langsung dibantu tukar tanpa ribet.' },
    { nama: 'Sinta', kota: 'Cirebon', teks: 'Ankle boots-nya empuk. Dipakai seharian tidak lecet.' }
  ],
  info: { alamat: 'Kabupaten Cirebon (alamat contoh)', jam: 'Senin–Sabtu, 09.00–17.00' }
};
