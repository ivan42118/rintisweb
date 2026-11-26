/*
 * Template Toko Online RintisWeb.
 * Semua isi toko (nama, produk, warna tema, nomor WA) diatur di data.js (window.TOKO).
 * Produk bisa juga diambil dari Google Sheet: isi TOKO.sheetCsv dengan link CSV yang dipublikasikan.
 */
(function () {
  'use strict';

  var T = window.TOKO || {};
  var RW = window.RINTISWEB || null;
  var DEMO = !!T.demo;
  var TANPA_BILAH = /[?&]tanpa-bilah\b/.test(location.search); // untuk tangkapan layar
  var KUNCI = 'rw-toko:' + (T.slug || T.nama || 'toko');
  var waToko = String(T.whatsapp || '').replace(/\D/g, '');

  var IKON = {
    cari: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    tas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>'
  };

  // ---------------------------------------------------------------- bantuan
  function rupiah(n) { return 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, akar) { return (akar || document).querySelector(sel); }
  function angka(v) { return Number(String(v == null ? '' : v).replace(/[^\d]/g, '')) || 0; }
  function daftar(v, pola) {
    if (Array.isArray(v)) return v.map(String).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!v) return [];
    return String(v).split(pola || /[|,]/).map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function ya(v) { return v === true || /^(ya|y|yes|true|1|habis)$/i.test(String(v == null ? '' : v).trim()); }
  function linkWa(nomor, pesan) { return 'https://wa.me/' + (nomor || '') + '?text=' + encodeURIComponent(pesan); }
  function bukaTautan(url) {
    var w = window.open(url, '_blank', 'noopener');
    if (!w) location.href = url;
  }
  function baca(kunci, bawaan) {
    try { var v = JSON.parse(localStorage.getItem(KUNCI + ':' + kunci)); return v == null ? bawaan : v; } catch (e) { return bawaan; }
  }
  function tulis(kunci, nilai) { try { localStorage.setItem(KUNCI + ':' + kunci, JSON.stringify(nilai)); } catch (e) { /* mode privat */ } }

  // ---------------------------------------------------------------- tema
  var tema = T.tema || {};
  var gaya = document.documentElement.style;
  var PETA_TEMA = { utama: '--utama', utamaTeks: '--utama-teks', aksen: '--aksen', latar: '--latar', kartu: '--kartu', teks: '--teks', redup: '--redup', garis: '--garis', radius: '--radius' };
  Object.keys(PETA_TEMA).forEach(function (k) { if (tema[k]) gaya.setProperty(PETA_TEMA[k], tema[k]); });
  if (tema.fontJudul === 'serif') gaya.setProperty('--font-judul', '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif');
  var rasio = String(T.rasioFoto || '4 / 5');
  gaya.setProperty('--rasio', rasio);
  var bagianRasio = rasio.split('/').map(function (s) { return Number(s) || 1; });
  var FOTO_L = 600, FOTO_T = Math.round(600 * bagianRasio[1] / bagianRasio[0]);

  // ---------------------------------------------------------------- data produk
  function normal(p, i) {
    return {
      id: String(p.id || ('p' + (i + 1))).replace(/\s+/g, '-'),
      nama: String(p.nama || 'Produk'),
      kategori: String(p.kategori || ''),
      harga: angka(p.harga),
      hargaCoret: angka(p.hargaCoret || p.harga_coret),
      foto: daftar(p.foto, /\s*[|\n]\s*/),
      warna: daftar(p.warna),
      ukuran: daftar(p.ukuran),
      ukuranHabis: daftar(p.ukuranHabis || p.ukuran_habis),
      habis: ya(p.habis),
      label: String(p.label || ''),
      deskripsi: String(p.deskripsi || ''),
      urutan: i
    };
  }
  function bacaCsv(teks) {
    var baris = [], kolom = [], sel = '', kutip = false;
    for (var i = 0; i < teks.length; i++) {
      var c = teks[i];
      if (kutip) {
        if (c === '"') { if (teks[i + 1] === '"') { sel += '"'; i++; } else kutip = false; } else sel += c;
      } else if (c === '"') kutip = true;
      else if (c === ',') { kolom.push(sel); sel = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && teks[i + 1] === '\n') i++;
        kolom.push(sel); baris.push(kolom); kolom = []; sel = '';
      } else sel += c;
    }
    if (sel || kolom.length) { kolom.push(sel); baris.push(kolom); }
    var kepala = (baris.shift() || []).map(function (h) { return h.trim().toLowerCase().replace(/\s+/g, '_'); });
    return baris.filter(function (b) { return b.some(function (x) { return String(x).trim(); }); }).map(function (b) {
      var o = {};
      kepala.forEach(function (h, j) { o[h] = String(b[j] == null ? '' : b[j]).trim(); });
      return o;
    });
  }
  function semuaHabis(p) {
    if (p.habis) return true;
    return p.ukuran.length > 0 && p.ukuran.every(function (u) { return p.ukuranHabis.indexOf(u) >= 0; });
  }

  var semua = [];
  var pilihan = { kategori: 'Semua', cari: '', urut: 'pilihan' };
  var keranjang = baca('keranjang', []);
  if (!Array.isArray(keranjang)) keranjang = [];
  function cariProduk(id) { for (var i = 0; i < semua.length; i++) if (semua[i].id === id) return semua[i]; return null; }

  // ---------------------------------------------------------------- kerangka halaman
  var app = document.getElementById('toko');
  if (!app) { app = document.createElement('div'); app.id = 'toko'; document.body.appendChild(app); }
  var namaToko = esc(T.nama || 'Toko');
  var info = T.info || {};

  function htmlBilahDemo() {
    if (!DEMO || TANPA_BILAH) return '';
    var wa = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
    var pesan = 'Halo RintisWeb, saya lihat contoh toko online "' + (T.nama || '') + '". Saya mau dibuatkan toko online seperti ini.';
    return '<div class="bilah-demo"><div class="wadah"><span><a href="' + esc(T.urlKembali || '../../#contoh') + '" style="background:none;padding:0;font-weight:600;color:#c9d4ff">&larr; RintisWeb</a> &middot; <b>Contoh toko online</b>, usaha fiktif</span>' +
      (wa ? '<a href="' + esc(linkWa(wa, pesan)) + '" target="_blank" rel="noopener">Mau yang seperti ini?</a>' : '') + '</div></div>';
  }
  function htmlSpanduk() {
    var s = T.spanduk;
    if (!s) return '<h1 class="tersembunyi">' + namaToko + '</h1>';
    return '<section class="wadah spanduk"><div class="spanduk-isi' + (s.gambar ? ' ada-gambar' : '') + '">' +
      (s.gambar ? '<img src="' + esc(s.gambar) + '" alt="" width="1400" height="700" fetchpriority="high">' : '') +
      '<div class="spanduk-teks"><h1>' + esc(s.judul || T.nama) + '</h1>' + (s.teks ? '<p>' + esc(s.teks) + '</p>' : '') +
      '<a class="tombol tombol-terang" href="#produk">' + esc(s.tombol || 'Lihat produk') + '</a></div></div></section>';
  }
  function htmlInfo() {
    var langkah = T.caraBelanja || [
      { judul: 'Pilih produk', teks: 'Pilih warna, ukuran, dan jumlah, lalu masukkan ke keranjang.' },
      { judul: 'Kirim pesanan', teks: 'Isi nama dan alamat, lalu tekan "Pesan via WhatsApp". Pesananmu langsung masuk ke admin.' },
      { judul: 'Bayar dan terima barang', teks: 'Admin mengirim total belanja beserta ongkir. Setelah dibayar, barang langsung dikirim.' }
    ];
    var h = '<section class="bagian" aria-labelledby="h-cara"><h2 id="h-cara">Cara belanja</h2><ol class="langkah">' +
      langkah.map(function (l) { return '<li><b>' + esc(l.judul) + '</b><span>' + esc(l.teks) + '</span></li>'; }).join('') + '</ol></section>';
    var bayar = daftar(T.pembayaran), kirim = daftar(T.pengiriman);
    if (bayar.length || kirim.length) {
      h += '<section class="bagian" aria-labelledby="h-bayar"><h2 id="h-bayar">Pembayaran dan pengiriman</h2>' +
        (bayar.length ? '<ul class="daftar-chip" aria-label="Pembayaran">' + bayar.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
        (kirim.length ? '<ul class="daftar-chip" aria-label="Pengiriman">' + kirim.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') + '</section>';
    }
    if (T.testimoni && T.testimoni.length) {
      h += '<section class="bagian" aria-labelledby="h-testi"><h2 id="h-testi">Kata pembeli</h2><div class="testimoni">' +
        T.testimoni.map(function (t) {
          return '<figure><div class="bintang" aria-label="5 dari 5 bintang">&#9733;&#9733;&#9733;&#9733;&#9733;</div><blockquote>' + esc(t.teks) + '</blockquote><figcaption>' + esc(t.nama) + (t.kota ? ', ' + esc(t.kota) : '') + '</figcaption></figure>';
        }).join('') + '</div></section>';
    }
    return h;
  }
  function htmlKaki() {
    var kredit = T.kredit === false ? '' : '<a href="' + esc(T.urlKredit || (DEMO ? '../../' : 'https://rintisweb.id')) + '"' + (DEMO ? '' : ' target="_blank" rel="noopener"') + '>Website oleh RintisWeb</a>';
    return '<footer class="kaki"><div class="wadah">' +
      '<div><h3>' + namaToko + '</h3><p>' + esc(T.slogan || '') + '</p></div>' +
      '<div><h3>Alamat</h3><p>' + esc(info.alamat || '-') + (info.jam ? '<br>' + esc(info.jam) : '') + '</p></div>' +
      '<div><h3>Kontak</h3><p>' + (waToko && !DEMO ? '<a href="' + esc(linkWa(waToko, 'Halo ' + (T.nama || '') + ', saya mau tanya produk.')) + '" target="_blank" rel="noopener">WhatsApp</a>' : 'WhatsApp') +
      (info.instagram ? '<br>Instagram @' + esc(info.instagram) : '') + '</p></div>' +
      '<p class="kecil">&copy; ' + new Date().getFullYear() + ' ' + namaToko + (kredit ? ' &middot; ' + kredit : '') + '</p>' +
      '</div></footer>';
  }

  app.innerHTML =
    htmlBilahDemo() +
    '<header class="kepala"><div class="wadah"><a class="merek" href="#produk">' + namaToko + (T.slogan ? '<small>' + esc(T.slogan) + '</small>' : '') + '</a>' +
    '<a class="tombol-ikon" href="#keranjang" aria-label="Buka keranjang">' + IKON.tas + '<span class="lencana" id="lencana" hidden>0</span></a></div></header>' +
    htmlSpanduk() +
    (T.pengumuman ? '<div class="wadah pengumuman"><p>' + esc(T.pengumuman) + '</p></div>' : '') +
    '<main class="wadah" id="produk" tabindex="-1">' +
    '<div class="alat"><label class="cari"><span class="tersembunyi">Cari produk</span>' + IKON.cari + '<input type="search" id="cari" placeholder="Cari produk" autocomplete="off"></label>' +
    '<div class="baris-alat"><div class="kategori" id="kategori" role="group" aria-label="Kategori"></div>' +
    '<label><span class="tersembunyi">Urutkan</span><select class="urut" id="urut"><option value="pilihan">Pilihan</option><option value="murah">Termurah</option><option value="mahal">Termahal</option></select></label></div></div>' +
    '<p class="ringkas" id="ringkas" aria-live="polite"></p><div class="grid" id="grid"></div>' +
    htmlInfo() + '</main>' +
    htmlKaki() +
    (waToko && !DEMO ? '<a class="tombol-chat" href="' + esc(linkWa(waToko, 'Halo ' + (T.nama || '') + ', saya mau tanya produk.')) + '" target="_blank" rel="noopener">' + IKON.wa + 'Chat penjual</a>' : '') +
    '<dialog class="lembar" id="d-produk" aria-labelledby="judul-produk"><div class="lembar-isi" id="isi-produk"></div></dialog>' +
    '<dialog class="laci" id="d-keranjang" aria-labelledby="judul-keranjang"><div class="lembar-isi">' +
    '<div class="laci-kepala"><h2 id="judul-keranjang">Keranjang</h2><button type="button" class="tutup" data-tutup aria-label="Tutup keranjang">&times;</button></div>' +
    '<div class="laci-badan"><div id="daftar-item"></div><div id="ringkas-total"></div>' + htmlForm() + '</div>' +
    '<div class="laci-kaki" id="kaki-keranjang"></div></div></dialog>' +
    '<dialog class="kecil-dialog" id="d-ukuran" aria-labelledby="judul-ukuran"><div class="lembar-isi" id="isi-ukuran"></div></dialog>' +
    '<dialog class="kecil-dialog" id="d-pesan" aria-labelledby="judul-pesan"><div class="lembar-isi" id="isi-pesan"></div></dialog>' +
    '<div class="notif" id="notif" role="status" aria-live="polite"></div>';

  function htmlForm() {
    var kirim = daftar(T.pengiriman), bayar = daftar(T.pembayaran);
    function pilihanSelect(nama, isi) {
      return '<select name="' + nama + '">' + isi.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select>';
    }
    return '<form class="form" id="form-pesan" novalidate>' +
      '<label>Nama<input name="nama" autocomplete="name" required></label>' +
      '<label>Alamat lengkap<textarea name="alamat" autocomplete="street-address" placeholder="Jalan, nomor rumah, RT/RW, kelurahan"></textarea></label>' +
      '<label>Kecamatan dan kota<input name="kota" autocomplete="address-level2"></label>' +
      (kirim.length ? '<label>Pengiriman' + pilihanSelect('pengiriman', kirim) + '</label>' : '') +
      (bayar.length ? '<label>Pembayaran' + pilihanSelect('pembayaran', bayar) + '</label>' : '') +
      '<label>Catatan (opsional)<textarea name="catatan" placeholder="Contoh: tolong dibungkus kado"></textarea></label>' +
      '</form>';
  }

  var dProduk = $('#d-produk'), dKeranjang = $('#d-keranjang'), dUkuran = $('#d-ukuran'), dPesan = $('#d-pesan');
  var formPesan = $('#form-pesan');

  // data pembeli diingat supaya tidak mengetik ulang
  var pembeli = baca('pembeli', {});
  Array.prototype.forEach.call(formPesan.elements, function (f) { if (f.name && pembeli[f.name] && f.name !== 'catatan') f.value = pembeli[f.name]; });
  formPesan.addEventListener('input', function () {
    var d = {};
    Array.prototype.forEach.call(formPesan.elements, function (f) { if (f.name && f.name !== 'catatan') d[f.name] = f.value; });
    tulis('pembeli', d);
  });

  // ---------------------------------------------------------------- notifikasi
  var timerNotif;
  function notif(teks) {
    var n = $('#notif');
    n.textContent = teks;
    n.classList.add('tampil');
    clearTimeout(timerNotif);
    timerNotif = setTimeout(function () { n.classList.remove('tampil'); }, 2200);
  }

  // ---------------------------------------------------------------- daftar produk
  function tersaring() {
    var q = pilihan.cari.toLowerCase();
    var hasil = semua.filter(function (p) {
      if (pilihan.kategori !== 'Semua' && p.kategori !== pilihan.kategori) return false;
      if (!q) return true;
      return (p.nama + ' ' + p.kategori + ' ' + p.warna.join(' ') + ' ' + p.deskripsi).toLowerCase().indexOf(q) >= 0;
    });
    hasil.sort(function (a, b) {
      var h = (semuaHabis(a) ? 1 : 0) - (semuaHabis(b) ? 1 : 0);
      if (h) return h;
      if (pilihan.urut === 'murah') return a.harga - b.harga;
      if (pilihan.urut === 'mahal') return b.harga - a.harga;
      return a.urutan - b.urutan;
    });
    return hasil;
  }
  function htmlKartu(p) {
    var habis = semuaHabis(p);
    var label = habis ? 'Habis' : p.label;
    return '<a class="kartu' + (habis ? ' habis' : '') + '" href="#p-' + esc(p.id) + '">' +
      '<span class="foto">' + (p.foto[0] ? '<img src="' + esc(p.foto[0]) + '" alt="' + esc(p.nama) + '" loading="lazy" decoding="async" width="' + FOTO_L + '" height="' + FOTO_T + '">' : '') + '</span>' +
      (label ? '<span class="label">' + esc(label) + '</span>' : '') +
      '<span class="isi"><span class="nama">' + esc(p.nama) + '</span>' +
      '<span class="harga">' + rupiah(p.harga) + (p.hargaCoret > p.harga ? '<s>' + rupiah(p.hargaCoret) + '</s>' : '') + '</span>' +
      (p.warna.length > 1 ? '<span class="titik-warna">' + p.warna.length + ' pilihan warna</span>' : '') +
      '</span></a>';
  }
  function renderKategori() {
    var kat = Array.isArray(T.kategori) && T.kategori.length ? T.kategori.slice() : [];
    semua.forEach(function (p) { if (p.kategori && kat.indexOf(p.kategori) < 0) kat.push(p.kategori); });
    var wadah = $('#kategori');
    wadah.innerHTML = ['Semua'].concat(kat).map(function (k) {
      return '<button type="button" class="chip" data-kategori="' + esc(k) + '" aria-pressed="' + (k === pilihan.kategori) + '">' + esc(k) + '</button>';
    }).join('');
    wadah.hidden = kat.length < 2;
  }
  function renderGrid() {
    var hasil = tersaring();
    $('#grid').innerHTML = hasil.length ? hasil.map(htmlKartu).join('') :
      '<p class="kosong">Produk tidak ditemukan. Coba kata lain atau pilih kategori "Semua".</p>';
    $('#ringkas').textContent = hasil.length + ' produk' + (pilihan.kategori !== 'Semua' ? ' di ' + pilihan.kategori : '') + (pilihan.cari ? ' untuk "' + pilihan.cari + '"' : '');
  }

  $('#kategori').addEventListener('click', function (e) {
    var b = e.target.closest('[data-kategori]');
    if (!b) return;
    pilihan.kategori = b.getAttribute('data-kategori');
    renderKategori();
    renderGrid();
  });
  var timerCari;
  $('#cari').addEventListener('input', function (e) {
    clearTimeout(timerCari);
    timerCari = setTimeout(function () { pilihan.cari = e.target.value.trim(); renderGrid(); }, 150);
  });
  $('#urut').addEventListener('change', function (e) { pilihan.urut = e.target.value; renderGrid(); });

  // ---------------------------------------------------------------- detail produk
  var aktif = null; // { p, warna, ukuran, jumlah }

  function panduanUntuk(p) {
    var daftarPanduan = T.panduanUkuran ? [].concat(T.panduanUkuran) : [];
    for (var i = 0; i < daftarPanduan.length; i++) {
      var g = daftarPanduan[i];
      if (!g.untuk || g.untuk.indexOf(p.kategori) >= 0) return g;
    }
    return null;
  }
  function htmlOpsi(jenis, judul, isi, mati, ekstra) {
    return '<div class="pilihan"><h3><span>' + judul + ' <span id="dipilih-' + jenis + '" style="font-weight:500;color:var(--redup)"></span></span>' + (ekstra || '') + '</h3><div class="opsi">' +
      isi.map(function (x) {
        var off = mati.indexOf(x) >= 0;
        return '<button type="button" data-pilih="' + jenis + '" data-nilai="' + esc(x) + '" aria-pressed="false"' + (off ? ' disabled aria-label="' + esc(x) + ', stok habis"' : '') + '>' + esc(x) + '</button>';
      }).join('') + '</div></div>';
  }
  function bukaProduk(id) {
    var p = cariProduk(id);
    if (!p) return false;
    var habis = semuaHabis(p);
    var tersedia = p.ukuran.filter(function (u) { return p.ukuranHabis.indexOf(u) < 0; });
    aktif = { p: p, warna: p.warna.length === 1 ? p.warna[0] : '', ukuran: p.ukuran.length === 1 && tersedia.length === 1 ? tersedia[0] : '', jumlah: 1 };
    var hemat = p.hargaCoret > p.harga ? Math.round((1 - p.harga / p.hargaCoret) * 100) : 0;
    var panduan = panduanUntuk(p);
    var foto = p.foto.length ? p.foto : [''];
    $('#isi-produk').innerHTML =
      '<button type="button" class="tutup" data-tutup aria-label="Tutup">&times;</button><div class="detail">' +
      '<div class="galeri"><div class="galeri-geser" id="geser">' + foto.map(function (f, i) {
        return f ? '<img src="' + esc(f) + '" alt="' + esc(p.nama) + (foto.length > 1 ? ', foto ' + (i + 1) : '') + '" width="' + FOTO_L + '" height="' + FOTO_T + '"' + (i ? ' loading="lazy"' : '') + '>' : '';
      }).join('') + '</div>' +
      (foto.length > 1 ? '<div class="galeri-titik" aria-hidden="true">' + foto.map(function (f, i) { return '<span' + (i ? '' : ' class="aktif"') + '></span>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="info-produk"><h2 id="judul-produk">' + esc(p.nama) + '</h2>' +
      '<div class="harga">' + rupiah(p.harga) + (hemat ? '<s>' + rupiah(p.hargaCoret) + '</s><span class="hemat">Hemat ' + hemat + '%</span>' : '') + '</div>' +
      (p.deskripsi ? '<p class="deskripsi">' + esc(p.deskripsi) + '</p>' : '') +
      (p.warna.length ? htmlOpsi('warna', 'Warna', p.warna, []) : '') +
      (p.ukuran.length ? htmlOpsi('ukuran', 'Ukuran', p.ukuran, p.ukuranHabis, panduan ? '<button type="button" data-panduan>Panduan ukuran</button>' : '') : '') +
      (habis ? '' : '<div class="pilihan"><h3>Jumlah</h3><div class="jumlah"><button type="button" data-jumlah="-1" aria-label="Kurangi jumlah">&minus;</button><output id="jumlah">1</output><button type="button" data-jumlah="1" aria-label="Tambah jumlah">+</button></div></div>') +
      '<p class="peringatan" id="peringatan" role="alert"></p>' +
      (habis
        ? '<p class="pesan-kecil"><b>Stok habis.</b> ' + (DEMO ? 'Di toko sungguhan, pembeli bisa langsung menanyakan kapan stok datang lewat WhatsApp.' : 'Tanyakan kapan stok datang lewat WhatsApp.') + '</p>' +
          (waToko && !DEMO ? '<a class="tombol tombol-wa" href="' + esc(linkWa(waToko, 'Halo ' + (T.nama || '') + ', apakah ' + p.nama + ' akan restok?')) + '" target="_blank" rel="noopener">' + IKON.wa + ' Tanya stok</a>' : '')
        : '<div class="aksi-produk"><button type="button" class="tombol tombol-garis" data-aksi="tambah">+ Keranjang</button><button type="button" class="tombol tombol-utama" data-aksi="beli">Beli sekarang</button></div>') +
      (T.catatanProduk ? '<p class="pesan-kecil">' + esc(T.catatanProduk) + '</p>' : '') +
      '</div></div>';
    tandaiPilihan();
    var geser = $('#geser');
    if (geser && foto.length > 1) {
      geser.addEventListener('scroll', function () {
        var i = Math.round(geser.scrollLeft / geser.clientWidth);
        Array.prototype.forEach.call(dProduk.querySelectorAll('.galeri-titik span'), function (s, j) { s.classList.toggle('aktif', i === j); });
      }, { passive: true });
    }
    return true;
  }
  function tandaiPilihan() {
    if (!aktif) return;
    Array.prototype.forEach.call(dProduk.querySelectorAll('[data-pilih]'), function (b) {
      b.setAttribute('aria-pressed', String(aktif[b.getAttribute('data-pilih')] === b.getAttribute('data-nilai')));
    });
    var w = $('#dipilih-warna'), u = $('#dipilih-ukuran');
    if (w) w.textContent = aktif.warna ? ': ' + aktif.warna : '';
    if (u) u.textContent = aktif.ukuran ? ': ' + aktif.ukuran : '';
    var j = $('#jumlah');
    if (j) j.textContent = aktif.jumlah;
  }
  function tambahKeKeranjang() {
    var p = aktif.p, pesan = '';
    if (p.warna.length && !aktif.warna) pesan = 'Pilih warna dulu.';
    else if (p.ukuran.length && !aktif.ukuran) pesan = 'Pilih ukuran dulu.';
    $('#peringatan').textContent = pesan;
    if (pesan) return false;
    var ada = null;
    keranjang.forEach(function (k) { if (k.id === p.id && k.warna === aktif.warna && k.ukuran === aktif.ukuran) ada = k; });
    if (ada) ada.jumlah = Math.min(99, ada.jumlah + aktif.jumlah);
    else keranjang.push({ id: p.id, warna: aktif.warna, ukuran: aktif.ukuran, jumlah: aktif.jumlah });
    simpanKeranjang();
    return true;
  }

  dProduk.addEventListener('click', function (e) {
    var t = e.target;
    if (t === dProduk || t.closest('[data-tutup]')) { tutupDariPengguna(dProduk); return; }
    var pilih = t.closest('[data-pilih]');
    if (pilih && !pilih.disabled) {
      aktif[pilih.getAttribute('data-pilih')] = pilih.getAttribute('data-nilai');
      $('#peringatan').textContent = '';
      tandaiPilihan();
      return;
    }
    var jml = t.closest('[data-jumlah]');
    if (jml) { aktif.jumlah = Math.max(1, Math.min(99, aktif.jumlah + Number(jml.getAttribute('data-jumlah')))); tandaiPilihan(); return; }
    if (t.closest('[data-panduan]')) { bukaPanduan(); return; }
    var aksi = t.closest('[data-aksi]');
    if (aksi && tambahKeKeranjang()) {
      if (aksi.getAttribute('data-aksi') === 'beli') ke('keranjang', true);
      else { notif('Masuk keranjang'); }
    }
  });

  function bukaPanduan() {
    var g = aktif && panduanUntuk(aktif.p);
    if (!g) return;
    $('#isi-ukuran').innerHTML = '<button type="button" class="tutup" data-tutup aria-label="Tutup">&times;</button>' +
      '<h2 id="judul-ukuran">' + esc(g.judul || 'Panduan ukuran') + '</h2>' +
      '<table><thead><tr>' + g.kolom.map(function (k) { return '<th scope="col">' + esc(k) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      g.baris.map(function (b) { return '<tr>' + b.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' +
      (g.catatan ? '<p class="pesan-kecil" style="margin-top:10px">' + esc(g.catatan) + '</p>' : '');
    dUkuran.showModal();
  }
  dUkuran.addEventListener('click', function (e) { if (e.target === dUkuran || e.target.closest('[data-tutup]')) dUkuran.close(); });

  // ---------------------------------------------------------------- keranjang
  function totalBelanja() {
    return keranjang.reduce(function (n, k) { var p = cariProduk(k.id); return n + (p ? p.harga * k.jumlah : 0); }, 0);
  }
  function jumlahBarang() { return keranjang.reduce(function (n, k) { return n + k.jumlah; }, 0); }
  function simpanKeranjang() {
    tulis('keranjang', keranjang);
    var l = $('#lencana'), n = jumlahBarang();
    l.textContent = n > 99 ? '99+' : n;
    l.hidden = n === 0;
    if (dKeranjang.open) renderKeranjang();
  }
  function renderKeranjang() {
    keranjang = keranjang.filter(function (k) { return cariProduk(k.id); });
    var daftarItem = $('#daftar-item'), total = $('#ringkas-total'), kaki = $('#kaki-keranjang');
    if (!keranjang.length) {
      daftarItem.innerHTML = '<p class="kosong">Keranjang masih kosong.<br><a href="#produk">Lihat produk</a></p>';
      total.innerHTML = '';
      formPesan.hidden = true;
      kaki.innerHTML = '';
      return;
    }
    formPesan.hidden = false;
    daftarItem.innerHTML = keranjang.map(function (k, i) {
      var p = cariProduk(k.id);
      var varian = [k.warna, k.ukuran].filter(Boolean).join(' · ');
      return '<div class="item">' + (p.foto[0] ? '<img src="' + esc(p.foto[0]) + '" alt="" width="64" height="80" loading="lazy">' : '<span></span>') +
        '<div><b>' + esc(p.nama) + '</b>' + (varian ? '<small>' + esc(varian) + '</small><br>' : '') + '<span>' + rupiah(p.harga * k.jumlah) + '</span><br>' +
        '<button type="button" class="hapus" data-hapus="' + i + '">Hapus</button></div>' +
        '<div class="jumlah"><button type="button" data-ubah="' + i + '" data-arah="-1" aria-label="Kurangi">&minus;</button><output>' + k.jumlah + '</output><button type="button" data-ubah="' + i + '" data-arah="1" aria-label="Tambah">+</button></div></div>';
    }).join('');
    total.innerHTML = '<div class="total"><span>Total belanja</span><span>' + rupiah(totalBelanja()) + '</span></div><p class="pesan-kecil">Ongkir diinformasikan admin setelah pesanan masuk.</p>';
    kaki.innerHTML = '<p class="peringatan" id="peringatan-pesan" role="alert"></p><button type="button" class="tombol tombol-wa tombol-penuh" id="kirim-pesan">' + IKON.wa + ' Pesan via WhatsApp</button>';
  }
  dKeranjang.addEventListener('click', function (e) {
    var t = e.target;
    if (t === dKeranjang || t.closest('[data-tutup]')) { tutupDariPengguna(dKeranjang); return; }
    if (t.closest('a[href="#produk"]')) { e.preventDefault(); tutupDariPengguna(dKeranjang); return; }
    var hapus = t.closest('[data-hapus]');
    if (hapus) { keranjang.splice(Number(hapus.getAttribute('data-hapus')), 1); simpanKeranjang(); return; }
    var ubah = t.closest('[data-ubah]');
    if (ubah) {
      var k = keranjang[Number(ubah.getAttribute('data-ubah'))];
      k.jumlah = Math.max(1, Math.min(99, k.jumlah + Number(ubah.getAttribute('data-arah'))));
      simpanKeranjang();
      return;
    }
    if (t.closest('#kirim-pesan')) kirimPesanan();
  });

  function susunPesan(d) {
    var baris = ['Halo ' + (T.nama || 'admin') + ', saya mau pesan:', ''];
    keranjang.forEach(function (k, i) {
      var p = cariProduk(k.id);
      var varian = [k.warna, k.ukuran].filter(Boolean).join(', ');
      baris.push((i + 1) + '. ' + p.nama + (varian ? ' (' + varian + ')' : '') + ' x' + k.jumlah + ' = ' + rupiah(p.harga * k.jumlah));
    });
    baris.push('', 'Total belanja: ' + rupiah(totalBelanja()), 'Ongkir: mohon diinfokan', '');
    baris.push('Nama: ' + d.nama);
    if (!d.ambil) baris.push('Alamat: ' + d.alamat + (d.kota ? ', ' + d.kota : ''));
    if (d.pengiriman) baris.push('Pengiriman: ' + d.pengiriman);
    if (d.pembayaran) baris.push('Pembayaran: ' + d.pembayaran);
    if (d.catatan) baris.push('Catatan: ' + d.catatan);
    baris.push('', 'Terima kasih.');
    return baris.join('\n');
  }
  function kirimPesanan() {
    var f = formPesan.elements;
    var d = {
      nama: (f.nama.value || '').trim(),
      alamat: (f.alamat.value || '').trim(),
      kota: (f.kota.value || '').trim(),
      pengiriman: f.pengiriman ? f.pengiriman.value : '',
      pembayaran: f.pembayaran ? f.pembayaran.value : '',
      catatan: (f.catatan.value || '').trim()
    };
    d.ambil = /ambil/i.test(d.pengiriman);
    var salah = !d.nama ? 'Isi nama dulu.' : (!d.ambil && !d.alamat ? 'Isi alamat pengiriman dulu.' : '');
    $('#peringatan-pesan').textContent = salah;
    if (salah) { (d.nama ? f.alamat : f.nama).focus(); return; }
    var pesan = susunPesan(d);
    if (!DEMO && waToko) { bukaTautan(linkWa(waToko, pesan)); return; }
    var wa = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
    $('#isi-pesan').innerHTML = '<button type="button" class="tutup" data-tutup aria-label="Tutup">&times;</button>' +
      '<h2 id="judul-pesan">Pesanan ini masuk ke WhatsApp penjual</h2>' +
      '<p class="pesan-kecil" style="margin-bottom:10px">Ini contoh toko, jadi pesanan tidak dikirim ke mana pun. Di toko sungguhan, pesan di bawah langsung masuk ke WhatsApp pemilik toko: lengkap dengan barang, varian, total, dan alamat.</p>' +
      '<div class="pratinjau-pesan">' + esc(pesan) + '</div><div class="tumpuk">' +
      (wa ? '<a class="tombol tombol-utama" href="' + esc(linkWa(wa, 'Halo RintisWeb, saya sudah mencoba contoh toko online "' + (T.nama || '') + '". Saya mau dibuatkan toko online seperti ini.')) + '" target="_blank" rel="noopener">Saya mau toko online seperti ini</a>' : '') +
      '<a class="tombol tombol-garis" href="' + esc('https://wa.me/?text=' + encodeURIComponent(pesan)) + '" target="_blank" rel="noopener">Coba kirim ke WhatsApp sendiri</a></div>';
    dPesan.showModal();
  }
  dPesan.addEventListener('click', function (e) { if (e.target === dPesan || e.target.closest('[data-tutup]')) dPesan.close(); });

  // ---------------------------------------------------------------- navigasi lewat #hash (tombol kembali di HP ikut menutup)
  function ke(hash, ganti) {
    if (ganti) location.replace('#' + hash);
    else location.hash = hash;
  }
  function tutupDariPengguna(d) {
    if (d.open) d.close();
  }
  // Saat dialog ditutup lewat tombol x, Esc, atau klik di luar: hapus #hash miliknya tanpa menambah riwayat.
  function hapusHash() { history.replaceState(null, '', location.pathname + location.search); }
  dProduk.addEventListener('close', function () { if (location.hash.indexOf('#p-') === 0) hapusHash(); });
  dKeranjang.addEventListener('close', function () { if (location.hash === '#keranjang') hapusHash(); });
  function rute() {
    var h = decodeURIComponent(location.hash || '');
    if (h.indexOf('#p-') === 0) {
      if (dKeranjang.open) dKeranjang.close();
      if (bukaProduk(h.slice(3))) { if (!dProduk.open) dProduk.showModal(); }
      else if (dProduk.open) dProduk.close();
    } else if (h === '#keranjang') {
      if (dProduk.open) dProduk.close();
      renderKeranjang();
      if (!dKeranjang.open) dKeranjang.showModal();
    } else {
      if (dProduk.open) dProduk.close();
      if (dKeranjang.open) dKeranjang.close();
    }
  }
  window.addEventListener('hashchange', rute);

  // ---------------------------------------------------------------- mulai
  function mulai(daftarProduk) {
    semua = (daftarProduk || []).map(normal).filter(function (p) { return p.nama && p.harga >= 0; });
    renderKategori();
    renderGrid();
    simpanKeranjang();
    if (location.hash) rute();
  }
  if (T.sheetCsv) {
    $('#grid').innerHTML = new Array(9).join('<div class="kerangka"></div>');
    fetch(T.sheetCsv, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (teks) { mulai(bacaCsv(teks)); })
      .catch(function () { mulai(T.produk || []); notif('Daftar produk terbaru gagal dimuat'); });
  } else {
    mulai(T.produk || []);
  }
})();
