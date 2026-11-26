/* Contoh toko online RintisWeb (usaha fiktif). Format sama dengan templates/toko-online/data.js. */
window.TOKO = {
  demo: true,
  slug: 'kanaya-wear',
  nama: 'Kanaya Wear',
  slogan: 'Busana harian yang nyaman dan sopan',
  whatsapp: '',
  tema: { utama: '#6e3626', aksen: '#c0623f', latar: '#fbf7f3', kartu: '#ffffff', teks: '#2a1f1a', redup: '#7a6a62', garis: '#eadfd6', fontJudul: 'serif' },
  rasioFoto: '4 / 5',
  spanduk: {
    gambar: 'img/spanduk.webp',
    judul: 'Koleksi baru akhir tahun',
    teks: 'Bahan adem, potongan longgar, ukuran S sampai XXL.',
    tombol: 'Belanja sekarang'
  },
  pengumuman: 'Gratis ongkir se-Kota Cirebon untuk belanja minimal Rp 200.000.',
  kategori: ['Atasan', 'Outer', 'Hijab'],
  produk: [
    { id: 'jaket-bomber', nama: 'Jaket Bomber Terakota', kategori: 'Outer', harga: 219000, hargaCoret: 259000, label: 'Terlaris',
      foto: ['img/jaket-bomber.webp', 'img/jaket-bomber-detail.webp'], warna: ['Terakota', 'Hitam', 'Olive'], ukuran: ['S', 'M', 'L', 'XL'], ukuranHabis: ['XL'],
      deskripsi: 'Bahan parasut berfuring, ringan dan tidak gerah. Ada saku dalam untuk ponsel.' },
    { id: 'outer-rajut', nama: 'Outer Rajut Rumbai', kategori: 'Outer', harga: 179000, label: 'Baru',
      foto: ['img/outer-rajut.webp', 'img/outer-rajut-detail.webp'], warna: ['Krem', 'Putih tulang'], ukuran: ['All size'],
      deskripsi: 'Rajutan longgar dengan rumbai di ujung. Cocok dipadukan dengan kaos atau gamis polos. All size muat sampai lingkar dada 110 cm.' },
    { id: 'kaos-basic', nama: 'Kaos Basic Katun Combed 30s', kategori: 'Atasan', harga: 69000, hargaCoret: 89000,
      foto: ['img/kaos-basic.webp'], warna: ['Biru muda', 'Putih', 'Hitam', 'Abu'], ukuran: ['S', 'M', 'L', 'XL', 'XXL'], ukuranHabis: ['S'],
      deskripsi: 'Katun combed 30s yang lembut dan menyerap keringat. Jahitan rantai di bahu supaya tidak mudah melar.' },
    { id: 'kemeja-linen', nama: 'Kemeja Linen Lengan Panjang', kategori: 'Atasan', harga: 159000,
      foto: ['img/kemeja-linen.webp', 'img/kemeja-linen-detail.webp'], warna: ['Sage', 'Putih', 'Krem'], ukuran: ['S', 'M', 'L', 'XL'],
      deskripsi: 'Linen campuran rayon yang jatuh dan adem. Potongan oversized, bisa juga dipakai sebagai outer.' },
    { id: 'blouse-motif', nama: 'Blouse Motif Bunga', kategori: 'Atasan', harga: 139000, label: 'Terlaris',
      foto: ['img/blouse-motif.webp', 'img/blouse-motif-detail.webp'], warna: ['Cokelat', 'Navy'], ukuran: ['S', 'M', 'L'],
      deskripsi: 'Rayon motif bunga kecil, kancing depan, lengan panjang dengan karet di ujung.' },
    { id: 'pashmina-ceruty', nama: 'Pashmina Ceruty Babydoll', kategori: 'Hijab', harga: 49000,
      foto: ['img/pashmina-putih.webp'], warna: ['Putih', 'Hitam', 'Nude', 'Mocca'],
      deskripsi: 'Ceruty babydoll yang tidak licin dan mudah dibentuk. Ukuran 175 × 75 cm.' },
    { id: 'hijab-voal', nama: 'Hijab Segi Empat Voal', kategori: 'Hijab', harga: 39000, hargaCoret: 55000, label: 'Diskon',
      foto: ['img/hijab-mustard.webp'], warna: ['Mustard', 'Sage', 'Dusty pink'],
      deskripsi: 'Voal premium dengan jahitan tepi rapi. Ukuran 115 × 115 cm, tegak di dahi tanpa banyak peniti.' },
    { id: 'pashmina-plisket', nama: 'Pashmina Plisket Nude', kategori: 'Hijab', harga: 59000, habis: true,
      foto: ['img/pashmina-nude.webp'], warna: ['Nude', 'Abu', 'Maroon'],
      deskripsi: 'Plisket halus yang tidak perlu disetrika. Ukuran 175 × 70 cm.' }
  ],
  panduanUkuran: {
    judul: 'Panduan ukuran atasan dan outer (cm)',
    untuk: ['Atasan', 'Outer'],
    kolom: ['Ukuran', 'Lingkar dada', 'Panjang baju'],
    baris: [['S', '96', '66'], ['M', '100', '68'], ['L', '104', '70'], ['XL', '110', '72'], ['XXL', '116', '74']],
    catatan: 'Ukur lingkar dada, lalu tambahkan 4–6 cm supaya longgar.'
  },
  pembayaran: ['QRIS', 'Transfer BCA', 'Transfer BRI', 'Bayar di tempat (COD) Kota Cirebon'],
  pengiriman: ['JNE', 'J&T Express', 'SiCepat', 'Kurir lokal Cirebon', 'Ambil di toko'],
  testimoni: [
    { nama: 'Nadia', kota: 'Kuningan', teks: 'Bahannya adem dan jahitannya rapi. Pesan lewat WhatsApp juga cepat dibalas.' },
    { nama: 'Rahma', kota: 'Cirebon', teks: 'Ukurannya pas sesuai panduan. Sudah tiga kali belanja di sini.' },
    { nama: 'Dewi', kota: 'Indramayu', teks: 'Pashminanya tidak licin dan gampang dibentuk. Warnanya sama seperti di foto.' }
  ],
  info: { alamat: 'Kota Cirebon (alamat contoh)', jam: 'Setiap hari, 09.00–21.00' }
};
