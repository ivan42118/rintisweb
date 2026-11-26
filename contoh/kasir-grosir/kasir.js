/*
 * Demo aplikasi Kasir Grosir RintisWeb (usaha fiktif).
 * Semua data tersimpan di browser (localStorage) dan bisa diulang lewat tombol "Ulangi data contoh".
 * Fitur: kasir dengan harga grosir bertingkat dan satuan pcs/pak/dus, stok dan barang masuk,
 * kasbon pelanggan, laporan penjualan dan laba, struk ke WhatsApp atau printer.
 */
(function () {
  'use strict';

  var TOKO = { nama: 'Toko Grosir Makmur', alamat: 'Kota Cirebon (alamat contoh)', hp: '' };
  var KUNCI = 'rw-kasir-grosir:v1';
  var RW = window.RINTISWEB || null;
  var TANPA_BILAH = /[?&]tanpa-bilah\b/.test(location.search);

  // ---------------------------------------------------------------- bantuan
  function $(s, a) { return (a || document).querySelector(s); }
  function semuaEl(s, a) { return Array.prototype.slice.call((a || document).querySelectorAll(s)); }
  function rp(n) { return 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function angka(v) { return Number(String(v == null ? '' : v).replace(/[^\d]/g, '')) || 0; }
  function idBaru() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function hariIni(t) { var d = t ? new Date(t) : new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function jam(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + '.' + ('0' + d.getMinutes()).slice(-2); }
  function tanggal(t) { return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }); }
  function linkWa(nomor, pesan) { return 'https://wa.me/' + (nomor || '') + '?text=' + encodeURIComponent(pesan); }

  // ---------------------------------------------------------------- data contoh
  function dataAwal() {
    var produk = [
      { id: 'beras', nama: 'Beras Medium 5 kg', kategori: 'Sembako', modal: 63000, stok: 46, stokMin: 15, satuan: [
        { nama: 'karung 5 kg', isi: 1, harga: 68500, grosir: { min: 5, harga: 67000 } }, { nama: 'ikat 5 karung', isi: 5, harga: 332000 }] },
      { id: 'minyak', nama: 'Minyak Goreng 2 L', kategori: 'Sembako', modal: 32500, stok: 14, stokMin: 18, satuan: [
        { nama: 'pcs', isi: 1, harga: 35500, grosir: { min: 6, harga: 34800 } }, { nama: 'dus isi 6', isi: 6, harga: 207000 }] },
      { id: 'gula', nama: 'Gula Pasir 1 kg', kategori: 'Sembako', modal: 16200, stok: 120, stokMin: 40, satuan: [
        { nama: 'pcs', isi: 1, harga: 17500, grosir: { min: 10, harga: 17100 } }, { nama: 'bal isi 20', isi: 20, harga: 338000 }] },
      { id: 'terigu', nama: 'Tepung Terigu 1 kg', kategori: 'Sembako', modal: 11000, stok: 60, stokMin: 20, satuan: [
        { nama: 'pcs', isi: 1, harga: 12500, grosir: { min: 10, harga: 12000 } }, { nama: 'bal isi 10', isi: 10, harga: 117000 }] },
      { id: 'mi', nama: 'Mi Instan Goreng', kategori: 'Makanan', modal: 2900, stok: 520, stokMin: 120, satuan: [
        { nama: 'pcs', isi: 1, harga: 3300, grosir: { min: 10, harga: 3150 } }, { nama: 'dus isi 40', isi: 40, harga: 122000 }] },
      { id: 'kopi', nama: 'Kopi Susu Sachet', kategori: 'Minuman', modal: 1250, stok: 260, stokMin: 120, satuan: [
        { nama: 'renceng isi 10', isi: 10, harga: 14500 }, { nama: 'dus isi 12 renceng', isi: 120, harga: 168000 }] },
      { id: 'teh', nama: 'Teh Celup isi 25', kategori: 'Minuman', modal: 5200, stok: 9, stokMin: 24, satuan: [
        { nama: 'pcs', isi: 1, harga: 6200, grosir: { min: 12, harga: 5900 } }, { nama: 'dus isi 48', isi: 48, harga: 276000 }] },
      { id: 'air', nama: 'Air Mineral 600 ml', kategori: 'Minuman', modal: 2050, stok: 288, stokMin: 96, satuan: [
        { nama: 'pcs', isi: 1, harga: 3000 }, { nama: 'dus isi 24', isi: 24, harga: 54000 }] },
      { id: 'sabun', nama: 'Sabun Cuci Piring 780 ml', kategori: 'Kebutuhan rumah', modal: 12400, stok: 36, stokMin: 12, satuan: [
        { nama: 'pcs', isi: 1, harga: 14500, grosir: { min: 6, harga: 13900 } }, { nama: 'dus isi 12', isi: 12, harga: 162000 }] },
      { id: 'telur', nama: 'Telur Ayam per kg', kategori: 'Sembako', modal: 27000, stok: 42, stokMin: 15, satuan: [
        { nama: 'kg', isi: 1, harga: 29500, grosir: { min: 10, harga: 28800 } }, { nama: 'peti 15 kg', isi: 15, harga: 427500 }] }
    ];
    var pelanggan = [
      { id: 'siti', nama: 'Warung Bu Siti', hp: '6281200000001', kasbon: 450000, riwayat: [{ waktu: Date.now() - 3 * 864e5, jenis: 'kasbon', jumlah: 450000, ket: 'Belanja sembako' }] },
      { id: 'yanti', nama: 'Warung Mbak Yanti', hp: '6281200000002', kasbon: 125000, riwayat: [{ waktu: Date.now() - 864e5, jenis: 'kasbon', jumlah: 125000, ket: 'Minyak dan gula' }] },
      { id: 'darto', nama: 'Toko Pak Darto', hp: '6281200000003', kasbon: 0, riwayat: [] },
      { id: 'ali', nama: 'Pak Haji Ali (katering)', hp: '6281200000004', kasbon: 0, riwayat: [] }
    ];
    // transaksi contoh 7 hari terakhir (pola tetap supaya grafik selalu sama)
    var benih = 7;
    function acak() { benih = (benih * 9301 + 49297) % 233280; return benih / 233280; }
    var transaksi = [];
    for (var h = 6; h >= 0; h--) {
      var n = h === 0 ? 4 : 7 + Math.floor(acak() * 7);
      for (var i = 0; i < n; i++) {
        var waktu = new Date(); waktu.setDate(waktu.getDate() - h); waktu.setHours(8 + Math.floor(acak() * (h === 0 ? 3 : 11)), Math.floor(acak() * 60), 0, 0);
        var item = [], k = 1 + Math.floor(acak() * 3);
        for (var j = 0; j < k; j++) {
          var p = produk[Math.floor(acak() * produk.length)];
          var s = acak() < 0.25 && p.satuan[1] ? p.satuan[1] : p.satuan[0];
          var qty = s.isi > 1 ? 1 : 1 + Math.floor(acak() * 12);
          var harga = s.grosir && qty >= s.grosir.min ? s.grosir.harga : s.harga;
          item.push({ produkId: p.id, nama: p.nama, satuan: s.nama, isi: s.isi, qty: qty, harga: harga, subtotal: harga * qty, modal: p.modal * s.isi * qty });
        }
        var total = item.reduce(function (a, b) { return a + b.subtotal; }, 0);
        var laba = total - item.reduce(function (a, b) { return a + b.modal; }, 0);
        transaksi.push({ id: 'c' + h + '-' + i, waktu: waktu.getTime(), pelangganId: '', metode: acak() < 0.7 ? 'Tunai' : 'QRIS', item: item, total: total, bayar: total, kembali: 0, laba: laba });
      }
    }
    transaksi.sort(function (a, b) { return a.waktu - b.waktu; });
    return { produk: produk, pelanggan: pelanggan, transaksi: transaksi, stokMasuk: [
      { waktu: Date.now() - 2 * 864e5, produkId: 'gula', nama: 'Gula Pasir 1 kg', qty: 60, ket: 'Dari distributor CV Manis (contoh)' }] };
  }
  function muat() { try { var d = JSON.parse(localStorage.getItem(KUNCI)); if (d && d.produk) return d; } catch (e) { /* abaikan */ } return dataAwal(); }
  var D = muat();
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { /* mode privat */ } }
  function produkById(id) { for (var i = 0; i < D.produk.length; i++) if (D.produk[i].id === id) return D.produk[i]; return null; }
  function pelangganById(id) { for (var i = 0; i < D.pelanggan.length; i++) if (D.pelanggan[i].id === id) return D.pelanggan[i]; return null; }
  function menipis(p) { return p.stok <= p.stokMin; }
  function formatStok(p) {
    var besar = p.satuan[p.satuan.length - 1], kecil = p.satuan[0];
    var satuanDasar = kecil.isi === 1 ? kecil.nama.split(' ')[0] : 'pcs';
    if (besar.isi > 1 && p.stok >= besar.isi) {
      var a = Math.floor(p.stok / besar.isi), b = p.stok % besar.isi;
      return p.stok + ' ' + satuanDasar + ' <small>(' + a + ' ' + esc(besar.nama.split(' ')[0]) + (b ? ' + ' + b : '') + ')</small>';
    }
    return p.stok + ' ' + satuanDasar;
  }

  // ---------------------------------------------------------------- kerangka
  var waRw = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
  document.getElementById('app').innerHTML =
    (TANPA_BILAH ? '' : '<div class="bilah-demo"><div class="isi"><span><a class="kembali" href="../../#aplikasi">&larr; RintisWeb</a> &middot; <b>Contoh aplikasi kasir</b>, usaha fiktif</span>' +
      (waRw ? '<a class="cta" target="_blank" rel="noopener" href="' + esc(linkWa(waRw, 'Halo RintisWeb, saya lihat contoh aplikasi Kasir Grosir. Saya mau dibuatkan aplikasi seperti ini untuk usaha saya.')) + '">Mau yang seperti ini?</a>' : '') + '</div></div>') +
    '<header class="app-kepala"><div class="isi"><div><h1>Kasir Grosir</h1><p>' + esc(TOKO.nama) + ' &middot; data contoh</p></div>' +
    '<div class="aksi-kepala"><button type="button" id="ulangi">Ulangi data contoh</button></div></div></header>' +
    '<nav class="tab-app" aria-label="Menu aplikasi"><div class="isi" role="tablist">' +
    '<button type="button" role="tab" aria-selected="true" data-tab="kasir">Kasir</button>' +
    '<button type="button" role="tab" aria-selected="false" data-tab="stok">Stok <span class="lencana" id="lencana-stok" hidden></span></button>' +
    '<button type="button" role="tab" aria-selected="false" data-tab="kasbon">Kasbon</button>' +
    '<button type="button" role="tab" aria-selected="false" data-tab="laporan">Laporan</button></div></nav>' +
    '<main>' +
    '<section class="panel" id="p-kasir"></section>' +
    '<section class="panel" id="p-stok" hidden></section>' +
    '<section class="panel" id="p-kasbon" hidden></section>' +
    '<section class="panel" id="p-laporan" hidden></section></main>' +
    '<dialog id="dialog" aria-labelledby="judul-dialog"><div class="isi-dialog" id="isi-dialog"></div></dialog>' +
    '<div class="notif" id="notif" role="status" aria-live="polite"></div>';

  var timerNotif;
  function notif(t) { var n = $('#notif'); n.textContent = t; n.classList.add('tampil'); clearTimeout(timerNotif); timerNotif = setTimeout(function () { n.classList.remove('tampil'); }, 2400); }
  var dialog = $('#dialog');
  function bukaDialog(html) { $('#isi-dialog').innerHTML = '<button type="button" class="tutup jangan-cetak" data-tutup aria-label="Tutup">&times;</button>' + html; dialog.showModal(); }
  dialog.addEventListener('click', function (e) { if (e.target === dialog || e.target.closest('[data-tutup]')) dialog.close(); });

  function pratinjauWa(judul, pesan, nomor) {
    bukaDialog('<h2 id="judul-dialog">' + esc(judul) + '</h2>' +
      '<p class="catatan" style="margin:0 0 10px">Ini aplikasi contoh, jadi pesan tidak dikirim. Di aplikasi sungguhan, tombol ini membuka WhatsApp ' + (nomor ? 'pelanggan' : 'tujuan') + ' dengan pesan di bawah.</p>' +
      '<div class="pratinjau-pesan">' + esc(pesan) + '</div><div class="tumpuk">' +
      (waRw ? '<a class="tombol tombol-utama" target="_blank" rel="noopener" href="' + esc(linkWa(waRw, 'Halo RintisWeb, saya sudah mencoba contoh aplikasi Kasir Grosir. Saya mau dibuatkan aplikasi seperti ini.')) + '">Saya mau aplikasi seperti ini</a>' : '') +
      '<a class="tombol" target="_blank" rel="noopener" href="' + esc('https://wa.me/?text=' + encodeURIComponent(pesan)) + '">Coba kirim ke WhatsApp sendiri</a></div>');
  }

  // ---------------------------------------------------------------- tab
  var tabAktif = 'kasir';
  function pindahTab(t) {
    tabAktif = t;
    semuaEl('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === t)); });
    ['kasir', 'stok', 'kasbon', 'laporan'].forEach(function (x) { $('#p-' + x).hidden = x !== t; });
    render();
    window.scrollTo(0, 0);
  }
  $('.tab-app').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) pindahTab(b.getAttribute('data-tab')); });
  $('#ulangi').addEventListener('click', function () {
    if (!confirm('Kembalikan semua data ke data contoh awal?')) return;
    D = dataAwal(); keranjang = []; simpan(); render(); notif('Data contoh dikembalikan');
  });

  // ---------------------------------------------------------------- KASIR
  var keranjang = []; // { produkId, satuanIndex, qty }
  var filter = { cari: '', kategori: 'Semua' };
  var pelangganDipilih = '';
  var metode = 'Tunai';

  function hargaBaris(b) {
    var p = produkById(b.produkId), s = p.satuan[b.satuanIndex];
    var grosir = s.grosir && b.qty >= s.grosir.min;
    return { harga: grosir ? s.grosir.harga : s.harga, grosir: grosir, s: s, p: p };
  }
  function totalKeranjang() { return keranjang.reduce(function (a, b) { var h = hargaBaris(b); return a + h.harga * b.qty; }, 0); }
  function pakaiStok(produkId, kecuali) {
    return keranjang.reduce(function (a, b, i) { if (b.produkId !== produkId || i === kecuali) return a; return a + produkById(b.produkId).satuan[b.satuanIndex].isi * b.qty; }, 0);
  }
  function tambahKeKeranjang(produkId, si) {
    var p = produkById(produkId), s = p.satuan[si];
    if (pakaiStok(produkId) + s.isi > p.stok) { notif('Stok ' + p.nama + ' tidak cukup'); return; }
    var ada = null;
    keranjang.forEach(function (b) { if (b.produkId === produkId && b.satuanIndex === si) ada = b; });
    if (ada) ada.qty++; else keranjang.push({ produkId: produkId, satuanIndex: si, qty: 1 });
    renderKasir();
  }

  function renderKasir() {
    var el = $('#p-kasir');
    var kategori = ['Semua'];
    D.produk.forEach(function (p) { if (kategori.indexOf(p.kategori) < 0) kategori.push(p.kategori); });
    var daftar = D.produk.filter(function (p) {
      return (filter.kategori === 'Semua' || p.kategori === filter.kategori) && (!filter.cari || p.nama.toLowerCase().indexOf(filter.cari.toLowerCase()) >= 0);
    });
    var total = totalKeranjang();
    var jumlahItem = keranjang.reduce(function (a, b) { return a + b.qty; }, 0);
    var adaFokus = document.activeElement && document.activeElement.id === 'cari-produk';
    el.innerHTML = '<div class="kasir-tata">' +
      '<div class="kasir-produk">' +
      '<input class="input" id="cari-produk" type="search" placeholder="Cari barang, misalnya: minyak" value="' + esc(filter.cari) + '" aria-label="Cari barang">' +
      '<div class="chip-baris">' + kategori.map(function (k) { return '<button type="button" class="chip-app" data-kat="' + esc(k) + '" aria-pressed="' + (k === filter.kategori) + '">' + esc(k) + '</button>'; }).join('') + '</div>' +
      '<div class="grid-produk">' + (daftar.length ? daftar.map(function (p) {
        return '<div class="kartu-produk' + (menipis(p) ? ' tipis' : '') + '"><div class="kp-atas"><b>' + esc(p.nama) + '</b>' +
          '<span class="kp-stok">Stok ' + formatStok(p) + (menipis(p) ? ' <span class="lencana-status lencana-bahaya">menipis</span>' : '') + '</span></div>' +
          '<div class="kp-satuan">' + p.satuan.map(function (s, i) {
            return '<button type="button" class="tombol-satuan" data-tambah="' + p.id + '" data-si="' + i + '"><span>+ ' + esc(s.nama) + '</span><b class="angka">' + rp(s.harga) + '</b>' +
              (s.grosir ? '<small>' + rp(s.grosir.harga) + ' mulai ' + s.grosir.min + '</small>' : '') + '</button>';
          }).join('') + '</div></div>';
      }).join('') : '<p class="kosong">Barang tidak ditemukan.</p>') + '</div></div>' +
      '<aside class="kasir-keranjang" id="keranjang-kasir"><div class="kartu">' +
      '<h2>Keranjang</h2>' +
      '<label class="isian">Pelanggan<select class="pilih" id="pelanggan"><option value="">Umum (bukan pelanggan tetap)</option>' +
      D.pelanggan.map(function (c) { return '<option value="' + c.id + '"' + (c.id === pelangganDipilih ? ' selected' : '') + '>' + esc(c.nama) + (c.kasbon ? ' · kasbon ' + rp(c.kasbon) : '') + '</option>'; }).join('') + '</select></label>' +
      '<div class="daftar-belanja">' + (keranjang.length ? keranjang.map(function (b, i) {
        var h = hargaBaris(b);
        return '<div class="baris-belanja"><div><b>' + esc(h.p.nama) + '</b><small>' + esc(h.s.nama) + ' &middot; ' + rp(h.harga) + (h.grosir ? ' <span class="lencana-status lencana-sukses">harga grosir</span>' : '') + '</small></div>' +
          '<div class="stepper"><button type="button" data-ubah="' + i + '" data-arah="-1" aria-label="Kurangi">&minus;</button><span class="angka">' + b.qty + '</span><button type="button" data-ubah="' + i + '" data-arah="1" aria-label="Tambah">+</button></div>' +
          '<b class="angka subtotal">' + rp(h.harga * b.qty) + '</b></div>';
      }).join('') : '<p class="kosong">Belum ada barang. Ketuk satuan barang di sebelah untuk menambah.</p>') + '</div>' +
      '<div class="total-baris"><span>Total</span><b class="angka">' + rp(total) + '</b></div>' +
      '<div class="metode" role="group" aria-label="Metode bayar">' + ['Tunai', 'QRIS', 'Transfer', 'Kasbon'].map(function (m) {
        return '<button type="button" data-metode="' + m + '" aria-pressed="' + (m === metode) + '">' + m + '</button>';
      }).join('') + '</div>' +
      (metode === 'Tunai' ? '<label class="isian">Uang diterima<input class="input angka" id="uang" inputmode="numeric" placeholder="0"></label><p class="kembalian" id="kembalian"></p>' +
        '<div class="uang-cepat">' + [total, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000].filter(function (v, i, a) { return v > 0 && a.indexOf(v) === i; }).map(function (v) { return '<button type="button" data-uang="' + v + '">' + rp(v) + '</button>'; }).join('') + '</div>' : '') +
      (metode === 'Kasbon' ? '<p class="catatan">Total dicatat sebagai utang pelanggan. Pilih pelanggan tetap dulu.</p>' : '') +
      '<p class="peringatan-app" id="peringatan-bayar" role="alert"></p>' +
      '<button type="button" class="tombol tombol-utama tombol-penuh" id="bayar"' + (keranjang.length ? '' : ' disabled') + '>Bayar ' + rp(total) + '</button>' +
      (keranjang.length ? '<button type="button" class="tombol tombol-kecil tombol-penuh tombol-bahaya" id="kosongkan" style="margin-top:8px">Kosongkan keranjang</button>' : '') +
      '</div></aside></div>' +
      (keranjang.length ? '<a class="bilah-keranjang" href="#keranjang-kasir"><span>' + jumlahItem + ' barang</span><b class="angka">' + rp(total) + '</b><span>Lihat keranjang &darr;</span></a>' : '');
    if (adaFokus) { var c = $('#cari-produk'); c.focus(); c.setSelectionRange(c.value.length, c.value.length); }
    var uang = $('#uang');
    if (uang) uang.addEventListener('input', function () { uang.value = angka(uang.value) ? angka(uang.value).toLocaleString('id-ID') : ''; hitungKembalian(); });
  }
  function hitungKembalian() {
    var u = angka(($('#uang') || {}).value), t = totalKeranjang(), k = $('#kembalian');
    if (!k) return;
    k.textContent = u ? (u >= t ? 'Kembalian ' + rp(u - t) : 'Kurang ' + rp(t - u)) : '';
    k.className = 'kembalian' + (u && u < t ? ' kurang' : '');
  }
  $('#p-kasir').addEventListener('input', function (e) {
    if (e.target.id === 'cari-produk') { filter.cari = e.target.value; renderKasir(); }
  });
  $('#p-kasir').addEventListener('change', function (e) { if (e.target.id === 'pelanggan') { pelangganDipilih = e.target.value; } });
  $('#p-kasir').addEventListener('click', function (e) {
    var t = e.target;
    var k = t.closest('[data-kat]'); if (k) { filter.kategori = k.getAttribute('data-kat'); renderKasir(); return; }
    var tb = t.closest('[data-tambah]'); if (tb) { tambahKeKeranjang(tb.getAttribute('data-tambah'), Number(tb.getAttribute('data-si'))); return; }
    var u = t.closest('[data-ubah]');
    if (u) {
      var i = Number(u.getAttribute('data-ubah')), b = keranjang[i], arah = Number(u.getAttribute('data-arah'));
      if (arah > 0) {
        var p = produkById(b.produkId);
        if (pakaiStok(b.produkId, i) + p.satuan[b.satuanIndex].isi * (b.qty + 1) > p.stok) { notif('Stok ' + p.nama + ' tidak cukup'); return; }
      }
      b.qty += arah;
      if (b.qty <= 0) keranjang.splice(i, 1);
      renderKasir(); return;
    }
    var m = t.closest('[data-metode]'); if (m) { metode = m.getAttribute('data-metode'); renderKasir(); return; }
    var uc = t.closest('[data-uang]'); if (uc) { $('#uang').value = Number(uc.getAttribute('data-uang')).toLocaleString('id-ID'); hitungKembalian(); return; }
    if (t.closest('#kosongkan')) { keranjang = []; renderKasir(); return; }
    if (t.closest('#bayar')) bayar();
  });

  function bayar() {
    var total = totalKeranjang(), salah = '';
    var uang = angka(($('#uang') || {}).value);
    var plg = pelangganById(pelangganDipilih);
    if (metode === 'Tunai' && uang < total) salah = 'Uang diterima kurang dari total.';
    if (metode === 'Kasbon' && !plg) salah = 'Pilih pelanggan tetap untuk mencatat kasbon.';
    $('#peringatan-bayar').textContent = salah;
    if (salah) return;
    var item = keranjang.map(function (b) {
      var h = hargaBaris(b);
      return { produkId: h.p.id, nama: h.p.nama, satuan: h.s.nama, isi: h.s.isi, qty: b.qty, harga: h.harga, subtotal: h.harga * b.qty, modal: h.p.modal * h.s.isi * b.qty, grosir: h.grosir };
    });
    var trx = { id: idBaru(), waktu: Date.now(), pelangganId: plg ? plg.id : '', metode: metode, item: item, total: total,
      bayar: metode === 'Tunai' ? uang : total, kembali: metode === 'Tunai' ? uang - total : 0,
      laba: total - item.reduce(function (a, b) { return a + b.modal; }, 0) };
    var tipis = [];
    item.forEach(function (it) { var p = produkById(it.produkId); p.stok -= it.isi * it.qty; if (menipis(p) && tipis.indexOf(p.nama) < 0) tipis.push(p.nama); });
    if (metode === 'Kasbon') { plg.kasbon += total; plg.riwayat.push({ waktu: trx.waktu, jenis: 'kasbon', jumlah: total, ket: item.length + ' jenis barang' }); }
    D.transaksi.push(trx);
    simpan();
    keranjang = [];
    renderLencanaStok();
    renderKasir();
    tampilStruk(trx);
    if (tipis.length) setTimeout(function () { notif('Stok menipis: ' + tipis.join(', ')); }, 600);
  }
  function teksStruk(t) {
    var plg = pelangganById(t.pelangganId);
    var baris = [TOKO.nama, new Date(t.waktu).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }), plg ? 'Pelanggan: ' + plg.nama : '', '--------------------------'];
    t.item.forEach(function (it) { baris.push(it.nama + ' (' + it.satuan + ')', '  ' + it.qty + ' x ' + rp(it.harga) + ' = ' + rp(it.subtotal)); });
    baris.push('--------------------------', 'Total: ' + rp(t.total), 'Bayar: ' + t.metode + (t.metode === 'Tunai' ? ' ' + rp(t.bayar) : ''));
    if (t.kembali) baris.push('Kembalian: ' + rp(t.kembali));
    if (t.metode === 'Kasbon' && plg) baris.push('Sisa kasbon: ' + rp(plg.kasbon));
    baris.push('', 'Terima kasih sudah berbelanja.');
    return baris.filter(function (x) { return x !== ''; }).join('\n');
  }
  function tampilStruk(t) {
    var plg = pelangganById(t.pelangganId);
    bukaDialog('<h2 id="judul-dialog" class="jangan-cetak">Transaksi berhasil</h2>' +
      '<div class="struk"><b>' + esc(TOKO.nama) + '</b><small>' + esc(TOKO.alamat) + '</small><small>' + new Date(t.waktu).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + '</small>' +
      (plg ? '<small>Pelanggan: ' + esc(plg.nama) + '</small>' : '') + '<hr>' +
      t.item.map(function (it) { return '<div class="struk-baris"><span>' + esc(it.nama) + '<br><small>' + it.qty + ' ' + esc(it.satuan) + ' x ' + rp(it.harga) + (it.grosir ? ' (grosir)' : '') + '</small></span><span class="angka">' + rp(it.subtotal) + '</span></div>'; }).join('') +
      '<hr><div class="struk-baris"><b>Total</b><b class="angka">' + rp(t.total) + '</b></div>' +
      '<div class="struk-baris"><span>' + esc(t.metode) + '</span><span class="angka">' + rp(t.bayar) + '</span></div>' +
      (t.kembali ? '<div class="struk-baris"><span>Kembalian</span><span class="angka">' + rp(t.kembali) + '</span></div>' : '') +
      (t.metode === 'Kasbon' && plg ? '<div class="struk-baris"><span>Sisa kasbon</span><span class="angka">' + rp(plg.kasbon) + '</span></div>' : '') +
      '<p>Terima kasih sudah berbelanja.</p></div>' +
      '<div class="tumpuk jangan-cetak"><button type="button" class="tombol tombol-utama" id="struk-wa">Kirim struk lewat WhatsApp</button>' +
      '<button type="button" class="tombol" onclick="window.print()">Cetak struk</button>' +
      '<button type="button" class="tombol" data-tutup>Transaksi baru</button></div>');
    $('#struk-wa').addEventListener('click', function () { pratinjauWa('Struk dikirim ke WhatsApp pelanggan', teksStruk(t), plg && plg.hp); });
  }

  // ---------------------------------------------------------------- STOK
  function renderLencanaStok() {
    var n = D.produk.filter(menipis).length, l = $('#lencana-stok');
    l.textContent = n; l.hidden = n === 0;
  }
  function renderStok() {
    var tipis = D.produk.filter(menipis);
    var nilai = D.produk.reduce(function (a, p) { return a + p.modal * p.stok; }, 0);
    var masukHariIni = D.stokMasuk.filter(function (m) { return hariIni(m.waktu) === hariIni(); }).length;
    $('#p-stok').innerHTML =
      '<div class="ringkasan"><div class="kartu"><span>Jenis barang</span><b>' + D.produk.length + '</b></div>' +
      '<div class="kartu"><span>Stok menipis</span><b style="color:var(--bahaya)">' + tipis.length + '</b></div>' +
      '<div class="kartu"><span>Nilai stok (harga modal)</span><b class="angka">' + rp(nilai) + '</b></div>' +
      '<div class="kartu"><span>Barang masuk hari ini</span><b>' + masukHariIni + '</b></div></div>' +
      (tipis.length ? '<div class="kartu peringatan-kartu"><b>Perlu belanja ulang:</b> ' + tipis.map(function (p) { return esc(p.nama) + ' (sisa ' + p.stok + ')'; }).join(', ') +
        ' <button type="button" class="tombol tombol-kecil" id="pesan-supplier">Pesan ke supplier lewat WA</button></div>' : '') +
      '<div class="baris-judul"><h2>Daftar stok</h2><button type="button" class="tombol tombol-utama tombol-kecil" data-masuk="">+ Barang masuk</button></div>' +
      '<div class="tabel-geser"><table><thead><tr><th>Barang</th><th>Stok</th><th>Minimal</th><th>Status</th><th class="kanan">Modal / satuan dasar</th><th></th></tr></thead><tbody>' +
      D.produk.map(function (p) {
        return '<tr><td><b>' + esc(p.nama) + '</b><br><small style="color:var(--redup)">' + esc(p.kategori) + '</small></td><td>' + formatStok(p) + '</td><td>' + p.stokMin + '</td>' +
          '<td>' + (menipis(p) ? '<span class="lencana-status lencana-bahaya">Menipis</span>' : '<span class="lencana-status lencana-sukses">Aman</span>') + '</td>' +
          '<td class="kanan angka">' + rp(p.modal) + '</td><td><button type="button" class="tombol tombol-kecil" data-masuk="' + p.id + '">+ Masuk</button></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<h2 class="subjudul">Riwayat barang masuk</h2><div class="tabel-geser"><table><thead><tr><th>Waktu</th><th>Barang</th><th class="kanan">Jumlah</th><th>Catatan</th></tr></thead><tbody>' +
      (D.stokMasuk.length ? D.stokMasuk.slice().reverse().slice(0, 8).map(function (m) {
        return '<tr><td>' + tanggal(m.waktu) + ' ' + jam(m.waktu) + '</td><td>' + esc(m.nama) + '</td><td class="kanan angka">+' + m.qty + '</td><td>' + esc(m.ket || '-') + '</td></tr>';
      }).join('') : '<tr><td colspan="4" class="kosong">Belum ada barang masuk.</td></tr>') + '</tbody></table></div>';
  }
  $('#p-stok').addEventListener('click', function (e) {
    var m = e.target.closest('[data-masuk]');
    if (m) { formMasuk(m.getAttribute('data-masuk')); return; }
    if (e.target.closest('#pesan-supplier')) {
      var tipis = D.produk.filter(menipis);
      pratinjauWa('Pesanan ke supplier', 'Halo, saya dari ' + TOKO.nama + '. Mau pesan barang:\n' + tipis.map(function (p, i) {
        var besar = p.satuan[p.satuan.length - 1];
        return (i + 1) + '. ' + p.nama + ': ' + Math.max(1, Math.ceil((p.stokMin * 2 - p.stok) / besar.isi)) + ' ' + besar.nama;
      }).join('\n') + '\n\nMohon info harga dan jadwal kirim. Terima kasih.');
    }
  });
  function formMasuk(idPilih) {
    bukaDialog('<h2 id="judul-dialog">Catat barang masuk</h2><form id="form-masuk" class="form-app">' +
      '<label class="isian">Barang<select class="pilih" name="produk">' + D.produk.map(function (p) { return '<option value="' + p.id + '"' + (p.id === idPilih ? ' selected' : '') + '>' + esc(p.nama) + '</option>'; }).join('') + '</select></label>' +
      '<div class="dua-kolom"><label class="isian">Jumlah<input class="input" name="qty" inputmode="numeric" value="1"></label>' +
      '<label class="isian">Satuan<select class="pilih" name="satuan"></select></label></div>' +
      '<label class="isian">Catatan (supplier, nomor nota)<input class="input" name="ket" placeholder="Contoh: dari CV Sumber Pangan"></label>' +
      '<button class="tombol tombol-utama" type="submit">Simpan</button></form>');
    var f = $('#form-masuk');
    function isiSatuan() { var p = produkById(f.produk.value); f.satuan.innerHTML = p.satuan.map(function (s, i) { return '<option value="' + i + '">' + esc(s.nama) + '</option>'; }).join(''); f.satuan.value = String(p.satuan.length - 1); }
    isiSatuan();
    f.produk.addEventListener('change', isiSatuan);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = produkById(f.produk.value), s = p.satuan[Number(f.satuan.value)], q = angka(f.qty.value);
      if (!q) return;
      p.stok += q * s.isi;
      D.stokMasuk.push({ waktu: Date.now(), produkId: p.id, nama: p.nama, qty: q * s.isi, ket: (q + ' ' + s.nama) + (f.ket.value ? ' · ' + f.ket.value : '') });
      simpan(); dialog.close(); renderLencanaStok(); renderStok(); notif('Stok ' + p.nama + ' bertambah ' + (q * s.isi));
    });
  }

  // ---------------------------------------------------------------- KASBON
  function renderKasbon() {
    var total = D.pelanggan.reduce(function (a, c) { return a + c.kasbon; }, 0);
    var aktivitas = [];
    D.pelanggan.forEach(function (c) { c.riwayat.forEach(function (r) { aktivitas.push({ c: c, r: r }); }); });
    aktivitas.sort(function (a, b) { return b.r.waktu - a.r.waktu; });
    $('#p-kasbon').innerHTML =
      '<div class="ringkasan"><div class="kartu"><span>Total kasbon belum lunas</span><b class="angka" style="color:var(--bahaya)">' + rp(total) + '</b></div>' +
      '<div class="kartu"><span>Pelanggan berutang</span><b>' + D.pelanggan.filter(function (c) { return c.kasbon > 0; }).length + ' dari ' + D.pelanggan.length + '</b></div></div>' +
      '<div class="baris-judul"><h2>Pelanggan tetap</h2><button type="button" class="tombol tombol-utama tombol-kecil" id="tambah-pelanggan">+ Pelanggan</button></div>' +
      '<div class="daftar-pelanggan">' + D.pelanggan.map(function (c) {
        return '<div class="kartu kartu-pelanggan"><div><b>' + esc(c.nama) + '</b><small>' + (c.hp ? '+' + esc(c.hp) : 'Tanpa nomor') + '</small></div>' +
          '<div class="kasbon-nilai">' + (c.kasbon ? '<span class="lencana-status lencana-bahaya">Kasbon</span><b class="angka">' + rp(c.kasbon) + '</b>' : '<span class="lencana-status lencana-sukses">Lunas</span>') + '</div>' +
          '<div class="aksi-pelanggan">' + (c.kasbon ? '<button type="button" class="tombol tombol-kecil tombol-utama" data-lunasi="' + c.id + '">Catat pembayaran</button>' +
            '<button type="button" class="tombol tombol-kecil" data-ingatkan="' + c.id + '">Ingatkan lewat WA</button>' : '') + '</div></div>';
      }).join('') + '</div>' +
      '<h2 class="subjudul">Riwayat kasbon</h2><div class="tabel-geser"><table><thead><tr><th>Waktu</th><th>Pelanggan</th><th>Jenis</th><th class="kanan">Jumlah</th><th>Keterangan</th></tr></thead><tbody>' +
      (aktivitas.length ? aktivitas.slice(0, 10).map(function (a) {
        return '<tr><td>' + tanggal(a.r.waktu) + ' ' + jam(a.r.waktu) + '</td><td>' + esc(a.c.nama) + '</td><td>' + (a.r.jenis === 'bayar' ? '<span class="lencana-status lencana-sukses">Bayar</span>' : '<span class="lencana-status lencana-peringatan">Kasbon</span>') + '</td>' +
          '<td class="kanan angka">' + rp(a.r.jumlah) + '</td><td>' + esc(a.r.ket || '-') + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="kosong">Belum ada riwayat.</td></tr>') + '</tbody></table></div>';
  }
  $('#p-kasbon').addEventListener('click', function (e) {
    var l = e.target.closest('[data-lunasi]');
    if (l) {
      var c = pelangganById(l.getAttribute('data-lunasi'));
      bukaDialog('<h2 id="judul-dialog">Pembayaran kasbon ' + esc(c.nama) + '</h2><p class="catatan" style="margin:0 0 10px">Sisa kasbon: <b>' + rp(c.kasbon) + '</b></p>' +
        '<form id="form-lunas" class="form-app"><label class="isian">Jumlah dibayar<input class="input angka" name="jumlah" inputmode="numeric" value="' + c.kasbon.toLocaleString('id-ID') + '"></label>' +
        '<button class="tombol tombol-utama" type="submit">Simpan pembayaran</button></form>');
      $('#form-lunas').addEventListener('submit', function (ev) {
        ev.preventDefault();
        var j = Math.min(c.kasbon, angka(this.jumlah.value));
        if (!j) return;
        c.kasbon -= j; c.riwayat.push({ waktu: Date.now(), jenis: 'bayar', jumlah: j, ket: c.kasbon ? 'Bayar sebagian' : 'Lunas' });
        simpan(); dialog.close(); renderKasbon(); notif(c.kasbon ? 'Sisa kasbon ' + rp(c.kasbon) : c.nama + ' lunas');
      });
      return;
    }
    var g = e.target.closest('[data-ingatkan]');
    if (g) {
      var p = pelangganById(g.getAttribute('data-ingatkan'));
      pratinjauWa('Pengingat kasbon', 'Halo ' + p.nama + ', ini pengingat dari ' + TOKO.nama + '. Kasbon yang belum dibayar sebesar ' + rp(p.kasbon) + '. Pembayaran bisa tunai di toko atau transfer. Terima kasih.', p.hp);
      return;
    }
    if (e.target.closest('#tambah-pelanggan')) {
      bukaDialog('<h2 id="judul-dialog">Pelanggan tetap baru</h2><form id="form-plg" class="form-app">' +
        '<label class="isian">Nama<input class="input" name="nama" required placeholder="Contoh: Warung Bu Ani"></label>' +
        '<label class="isian">Nomor WhatsApp<input class="input" name="hp" inputmode="tel" placeholder="62..."></label>' +
        '<button class="tombol tombol-utama" type="submit">Simpan</button></form>');
      $('#form-plg').addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!this.nama.value.trim()) return;
        D.pelanggan.push({ id: idBaru(), nama: this.nama.value.trim(), hp: this.hp.value.replace(/\D/g, ''), kasbon: 0, riwayat: [] });
        simpan(); dialog.close(); renderKasbon(); notif('Pelanggan ditambahkan');
      });
    }
  });

  // ---------------------------------------------------------------- LAPORAN
  function renderLaporan() {
    var hari = [];
    for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); hari.push({ kunci: hariIni(d), label: i === 0 ? 'Hari ini' : d.toLocaleDateString('id-ID', { weekday: 'short' }), total: 0, n: 0, laba: 0 }); }
    var terlaris = {};
    var kasbonBaru = 0;
    D.transaksi.forEach(function (t) {
      var k = hariIni(t.waktu);
      hari.forEach(function (h) { if (h.kunci === k) { h.total += t.total; h.n++; h.laba += t.laba; } });
      if (k === hariIni() && t.metode === 'Kasbon') kasbonBaru += t.total;
      if (hari.some(function (h) { return h.kunci === k; })) t.item.forEach(function (it) { terlaris[it.nama] = (terlaris[it.nama] || 0) + it.subtotal; });
    });
    var ini = hari[6], maks = Math.max.apply(null, hari.map(function (h) { return h.total; }).concat([1]));
    var top = Object.keys(terlaris).map(function (n) { return { n: n, v: terlaris[n] }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 5);
    var maksTop = top.length ? top[0].v : 1;
    var minggu = hari.reduce(function (a, h) { return a + h.total; }, 0), labaMinggu = hari.reduce(function (a, h) { return a + h.laba; }, 0);
    $('#p-laporan').innerHTML =
      '<div class="ringkasan"><div class="kartu"><span>Penjualan hari ini</span><b class="angka">' + rp(ini.total) + '</b></div>' +
      '<div class="kartu"><span>Transaksi hari ini</span><b>' + ini.n + '</b></div>' +
      '<div class="kartu"><span>Laba kotor hari ini</span><b class="angka" style="color:var(--sukses)">' + rp(ini.laba) + '</b></div>' +
      '<div class="kartu"><span>Kasbon baru hari ini</span><b class="angka">' + rp(kasbonBaru) + '</b></div></div>' +
      '<div class="laporan-tata"><div class="kartu"><h2>Penjualan 7 hari</h2><div class="batang">' + hari.map(function (h) {
        return '<div><span>' + esc(h.label) + '</span><span class="isi-batang"><span style="width:' + Math.round(h.total / maks * 100) + '%"></span></span><b class="angka kanan">' + rp(h.total) + '</b></div>';
      }).join('') + '</div><p class="catatan">Total 7 hari ' + rp(minggu) + ' &middot; laba kotor ' + rp(labaMinggu) + '</p></div>' +
      '<div class="kartu"><h2>Barang terlaris (7 hari)</h2><div class="batang">' + top.map(function (t) {
        return '<div style="grid-template-columns: 1fr 90px"><span>' + esc(t.n) + '<span class="isi-batang" style="display:block;margin-top:4px"><span style="width:' + Math.round(t.v / maksTop * 100) + '%"></span></span></span><b class="angka kanan">' + rp(t.v) + '</b></div>';
      }).join('') + '</div></div></div>' +
      '<div class="baris-judul"><h2>Transaksi terakhir</h2><button type="button" class="tombol tombol-kecil" id="unduh">Unduh laporan (Excel)</button></div>' +
      '<div class="tabel-geser"><table><thead><tr><th>Waktu</th><th>Pelanggan</th><th>Barang</th><th>Bayar</th><th class="kanan">Total</th><th class="kanan">Laba</th></tr></thead><tbody>' +
      D.transaksi.slice().reverse().slice(0, 12).map(function (t) {
        var c = pelangganById(t.pelangganId);
        return '<tr><td>' + tanggal(t.waktu) + ' ' + jam(t.waktu) + '</td><td>' + esc(c ? c.nama : 'Umum') + '</td><td>' + t.item.length + ' jenis</td><td>' + esc(t.metode) + '</td><td class="kanan angka">' + rp(t.total) + '</td><td class="kanan angka">' + rp(t.laba) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  $('#p-laporan').addEventListener('click', function (e) {
    if (!e.target.closest('#unduh')) return;
    var baris = [['Waktu', 'Pelanggan', 'Metode', 'Barang', 'Total', 'Laba']];
    D.transaksi.forEach(function (t) {
      var c = pelangganById(t.pelangganId);
      baris.push([new Date(t.waktu).toLocaleString('id-ID'), c ? c.nama : 'Umum', t.metode, t.item.map(function (i) { return i.qty + ' ' + i.satuan + ' ' + i.nama; }).join('; '), t.total, t.laba]);
    });
    var csv = '﻿' + baris.map(function (r) { return r.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'laporan-penjualan-contoh.csv';
    document.body.appendChild(a); a.click(); a.remove();
    notif('Laporan diunduh');
  });

  // ---------------------------------------------------------------- mulai
  function render() {
    renderLencanaStok();
    if (tabAktif === 'kasir') renderKasir();
    else if (tabAktif === 'stok') renderStok();
    else if (tabAktif === 'kasbon') renderKasbon();
    else renderLaporan();
  }
  var awal = (location.hash || '').replace('#', '');
  if (['stok', 'kasbon', 'laporan'].indexOf(awal) >= 0) pindahTab(awal); else render();
})();
