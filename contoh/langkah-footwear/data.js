/* Contoh toko online RintisWeb, gaya PASAR (usaha fiktif). Format sama dengan templates/toko-online/data.js. */
window.TOKO = {
  demo: true,
  gaya: 'pasar',
  slug: 'langkah-footwear',
  nama: 'Langkah Footwear',
  slogan: 'Sepatu kulit buatan perajin lokal',
  whatsapp: '',
  tema: { utama: '#d9481c', utamaTeks: '#ffffff', aksen: '#d9481c', latar: '#f2f3f5', kartu: '#ffffff', teks: '#1f1f1f', redup: '#6b6b6b', garis: '#e7e7e7', radius: '8px' },
  rasioFoto: '1 / 1',
  slide: [
    { judul: 'Flash sale sepatu kulit', teks: 'Diskon sampai 20%, hanya hari ini', gambar: 'img/oxford-cokelat.webp', latar: 'linear-gradient(120deg, #3b1d0e, #b4531f)' },
    { judul: 'Gratis tukar ukuran', teks: 'Maksimal 7 hari setelah barang diterima', gambar: 'img/sneakers-kanvas.webp', latar: 'linear-gradient(120deg, #0f3d3e, #1f7a6d)' },
    { judul: 'Sandal kulit Rp 159 rb', teks: 'Nyaman untuk harian, pria dan wanita', gambar: 'img/sandal-kulit.webp', latar: 'linear-gradient(120deg, #2b2d42, #5c6784)' }
  ],
  pengumuman: 'Gratis ongkir se-Pulau Jawa untuk belanja minimal Rp 300.000',
  judulDiskon: 'Flash Sale',
  ikonKategori: { Semua: 'kotak', Pria: 'sepatu', Wanita: 'hak', Kasual: 'sneaker', Promo: 'tag' },
  kategori: ['Pria', 'Wanita', 'Kasual'],
  produk: [
    { id: 'oxford-cokelat', nama: 'Oxford Kulit Cokelat Tua', kategori: 'Pria', harga: 459000, hargaCoret: 529000, label: 'Terlaris', terjual: 128, sisa: 4,
      foto: ['img/oxford-cokelat.webp', 'img/oxford-cokelat-detail.webp'], ukuran: ['39', '40', '41', '42', '43', '44'], ukuranHabis: ['44'],
      deskripsi: 'Kulit sapi asli dengan sol karet antiselip. Cocok untuk kerja dan acara resmi.' },
    { id: 'sneakers-kanvas', nama: 'Sneakers Kanvas Abu', kategori: 'Kasual', harga: 239000, hargaCoret: 299000, terjual: 210, sisa: 9,
      foto: ['img/sneakers-kanvas.webp'], ukuran: ['37', '38', '39', '40', '41', '42', '43', '44'],
      deskripsi: 'Kanvas tebal dengan sol vulkanisir. Ringan untuk kuliah dan jalan santai.' },
    { id: 'derby-navy', nama: 'Derby Kulit Biru Dongker', kategori: 'Pria', harga: 429000, hargaCoret: 489000, terjual: 86, sisa: 6,
      foto: ['img/derby-navy.webp'], ukuran: ['39', '40', '41', '42', '43', '44'],
      deskripsi: 'Kulit sapi semi-glossy, tali lilin, dan insole empuk untuk dipakai seharian.' },
    { id: 'sandal-kulit', nama: 'Sandal Kulit Tali Silang', kategori: 'Kasual', harga: 159000, hargaCoret: 189000, terjual: 175, sisa: 5,
      foto: ['img/sandal-kulit.webp', 'img/sandal-kulit-detail.webp'], ukuran: ['38', '39', '40', '41', '42', '43'],
      deskripsi: 'Kulit sapi dengan tali silang dan sol karet empuk. Bisa untuk pria maupun wanita.' },
    { id: 'loafer-gesper', nama: 'Loafer Kulit Gesper', kategori: 'Pria', harga: 399000, hargaCoret: 449000, terjual: 64, sisa: 3,
      foto: ['img/loafer-kulit.webp'], ukuran: ['39', '40', '41', '42', '43'],
      deskripsi: 'Tanpa tali, tinggal pakai. Gesper logam warna emas dan sol kulit berlapis karet.' },
    { id: 'boots-brogue', nama: 'Boots Brogue Tan', kategori: 'Pria', harga: 589000, label: 'Baru', terjual: 41,
      foto: ['img/boots-brogue.webp', 'img/boots-brogue-detail.webp'], ukuran: ['39', '40', '41', '42', '43', '44'],
      deskripsi: 'Boots semata kaki dengan detail brogue. Sol tebal dan tahan cipratan air, cocok untuk musim hujan.' },
    { id: 'ankle-boots', nama: 'Ankle Boots Suede Wanita', kategori: 'Wanita', harga: 449000, terjual: 57,
      foto: ['img/ankle-boots-suede.webp'], ukuran: ['36', '37', '38', '39', '40'], ukuranHabis: ['40'],
      deskripsi: 'Suede lembut dengan ritsleting samping dan hak 3 cm. Nyaman untuk jalan jauh.' },
    { id: 'wedges-marun', nama: 'Wedges Marun', kategori: 'Wanita', harga: 279000, habis: true, terjual: 93,
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
