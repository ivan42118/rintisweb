/*
 * Situs jualan RintisWeb.
 * Harga paket, nomor WhatsApp, promo, dan daftar contoh diambil dari config.js (window.RINTISWEB).
 */
(function () {
  'use strict';

  var R = window.RINTISWEB || {};
  var wa = String(R.whatsapp || '').replace(/\D/g, '');
  var paket = Array.isArray(R.paket) ? R.paket : [];
  var contoh = Array.isArray(R.contoh) ? R.contoh : [];
  var sapaan = 'Halo ' + (R.nama || 'RintisWeb') + ', ';

  function $(sel) { return document.querySelector(sel); }
  function semua(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function rupiah(n) { return 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function angka(s) { return Number(String(s).replace(/[^\d]/g, '')) || 0; }
  function linkWa(pesan) { return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(pesan); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cariPaket(id) { for (var i = 0; i < paket.length; i++) if (paket[i].id === id) return paket[i]; return null; }
  function hargaTeks(p) { return (p.mulai ? 'mulai ' : '') + rupiah(p.harga); }
  function pesanPaket(p) {
    if (p.mulai) return sapaan + 'saya mau konsultasi ' + p.nama + ' (' + hargaTeks(p) + '). Kebutuhan saya: ';
    return sapaan + 'saya tertarik paket ' + p.nama + ' (' + rupiah(p.harga) + '). Usaha saya: ';
  }
  function isi(sel, teks) { if (teks) semua(sel).forEach(function (n) { n.textContent = teks; }); }

  if (!wa) $('#peringatan').hidden = false;

  // ---------------------------------------------------------------- teks dari config
  isi('[data-tagline]', R.tagline);
  isi('[data-kota]', R.kota);
  isi('[data-termasuk]', R.termasuk);
  if (R.pembayaran) {
    semua('[data-pembayaran]').forEach(function (n) {
      n.textContent = (n.classList.contains('pembayaran') ? 'Pembayaran: ' : '') + R.pembayaran.replace(/^./, function (c) { return n.classList.contains('pembayaran') ? c.toLowerCase() : c.toUpperCase(); }) + '.';
    });
  }
  var perp = Array.isArray(R.perpanjangan) ? R.perpanjangan : [];
  if (perp[0]) isi('[data-isi-perpanjangan]', 'Mulai tahun kedua, biaya ' + perp[0].nama.toLowerCase() + ' ' + rupiah(perp[0].harga) + String(perp[0].satuan || '').replace('/', ' per ') + ': ' + perp[0].isi.charAt(0).toLowerCase() + perp[0].isi.slice(1));
  $('#tahun').textContent = new Date().getFullYear();
  if (R.promo) { var promo = $('#promo'); promo.textContent = R.promo; promo.hidden = false; }
  if (R.instagram) {
    var ig = $('#kaki-instagram');
    ig.hidden = false;
    ig.querySelector('a').href = 'https://instagram.com/' + String(R.instagram).replace(/^@/, '');
  }

  // ---------------------------------------------------------------- tombol WhatsApp
  function pasangWa(a, pesan) { a.href = linkWa(pesan); a.target = '_blank'; a.rel = 'noopener'; }
  semua('[data-wa]').forEach(function (a) { pasangWa(a, sapaan + 'saya mau tanya tentang pembuatan website.'); });
  semua('[data-wa-paket]').forEach(function (a) { var p = cariPaket(a.getAttribute('data-wa-paket')); if (p) pasangWa(a, pesanPaket(p)); });
  semua('[data-harga-paket]').forEach(function (n) { var p = cariPaket(n.getAttribute('data-harga-paket')); if (p) n.textContent = rupiah(p.harga); });

  // ---------------------------------------------------------------- kartu layanan di hero
  $('#kartu-layanan').innerHTML = paket.map(function (p) {
    return '<a class="' + (p.unggulan ? 'unggul' : '') + '" href="#' + esc(p.id) + '">' +
      (p.label ? '<span class="lencana">' + esc(p.label) + '</span>' : '') +
      '<span class="nama">' + esc(p.nama) + '</span>' +
      '<span class="slogan">' + esc(p.slogan) + '</span>' +
      '<span class="harga">' + (p.mulai ? 'mulai ' : '') + '<b>' + rupiah(p.harga) + '</b> &middot; ' + esc(p.lama) + '</span>' +
      '<span class="panah">Lihat contoh &rarr;</span></a>';
  }).join('');

  // ---------------------------------------------------------------- kartu contoh
  function kartuContoh(c, judul) {
    var p = cariPaket(c.paket);
    var jenisKarya = p && p.id === 'aplikasi' ? 'aplikasi' : 'website';
    var pesan = sapaan + 'saya mau dibuatkan ' + jenisKarya + ' seperti contoh "' + c.nama + '"' + (p ? ' (' + p.nama + ', ' + hargaTeks(p) + ')' : '') + '. Usaha saya: ';
    return '<article class="kartu-contoh">' +
      '<a class="layar" href="' + esc(c.url) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(c.gambar) + '" alt="" width="360" height="780" loading="lazy" decoding="async"></a>' +
      '<div class="isi"><span class="jenis">' + esc(c.jenis) + '</span>' +
      '<' + judul + '>' + esc(c.nama) + '</' + judul + '><p>' + esc(c.ringkas) + '</p>' +
      '<div class="tombol-baris"><a class="tombol tombol-utama tombol-kecil" href="' + esc(c.url) + '">Lihat contoh ' + esc(c.nama) + '</a>' +
      '<a class="tombol tombol-garis tombol-kecil" target="_blank" rel="noopener" href="' + esc(linkWa(pesan)) + '">Mau yang seperti ini</a></div></div></article>';
  }
  [['toko-online', 'h4'], ['company-profile', 'h3'], ['landing-page', 'h3'], ['aplikasi', 'h4']].forEach(function (x) {
    var wadah = document.getElementById('contoh-' + x[0]);
    if (wadah) wadah.innerHTML = contoh.filter(function (c) { return c.paket === x[0]; }).map(function (c) { return kartuContoh(c, x[1]); }).join('');
  });


  // ---------------------------------------------------------------- bagian aplikasi custom
  var ap = R.aplikasi || {};
  semua('[data-harga-aplikasi]').forEach(function (n) { var v = ap[n.getAttribute('data-harga-aplikasi')]; if (v) n.textContent = rupiah(v); });
  semua('[data-wa-aplikasi]').forEach(function (a) {
    var jenis = a.getAttribute('data-wa-aplikasi');
    pasangWa(a, sapaan + (jenis ? 'saya tertarik aplikasi ' + jenis + '. Kebutuhan saya: ' : 'saya mau konsultasi aplikasi custom. Kebutuhan saya: '));
  });

  // ---------------------------------------------------------------- harga
  $('#grid-paket').innerHTML = paket.map(function (p) {
    return '<article class="paket' + (p.unggulan ? ' unggul' : '') + '">' +
      (p.label ? '<span class="lencana">' + esc(p.label) + '</span>' : '') +
      '<h3>' + esc(p.nama) + '</h3><p class="slogan">' + esc(p.slogan) + '</p>' +
      '<div class="harga">' + (p.mulai ? '<span class="mulai">mulai</span>' : '') + rupiah(p.harga) + '<small>sekali bayar &middot; ' + esc(p.lama) + '</small></div>' +
      (p.cocok ? '<p class="info-kecil">Cocok untuk ' + esc(p.cocok.charAt(0).toLowerCase() + p.cocok.slice(1)) + '.</p>' : '') +
      '<ul>' + (p.fitur || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<a class="tombol ' + (p.unggulan ? 'tombol-utama' : 'tombol-garis') + '" target="_blank" rel="noopener" href="' + esc(linkWa(pesanPaket(p))) + '">' + (p.mulai ? 'Konsultasi ' : 'Pesan ') + esc(p.nama) + '</a></article>';
  }).join('');
  $('#grid-perpanjangan').innerHTML = perp.map(function (x) {
    return '<div class="perpanjangan"><b>' + esc(x.nama) + '</b><div class="harga">' + rupiah(x.harga) + '<small>' + esc(x.satuan) + '</small></div><p>' + esc(x.isi) + '</p></div>';
  }).join('');
  $('#daftar-tambahan').innerHTML = (R.tambahan || []).map(function (t) {
    return '<li><span>' + esc(t[0]) + '</span><b>' + rupiah(t[1]) + esc(t[2] || '') + '</b></li>';
  }).join('');

  // ---------------------------------------------------------------- kalkulator potongan marketplace
  var k = R.kalkulator || {};
  var omzet = $('#omzet'), geser = $('#omzet-geser'), persen = $('#persen');
  var tokoOnline = cariPaket('toko-online') || paket[0] || { harga: 0 };
  function format(n) { return Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function hitung() {
    var o = angka(omzet.value), pr = Number(persen.value) || 0;
    var bulan = o * pr / 100;
    $('#persen-teks').textContent = String(pr).replace('.', ',') + '%';
    $('#hasil-bulan').textContent = rupiah(bulan);
    $('#hasil-tahun').textContent = rupiah(bulan * 12);
    var teks = '';
    if (bulan > 0) {
      var n = tokoOnline.harga / bulan;
      teks = n <= 1
        ? 'Harga toko online sendiri lebih kecil dari potongan marketplace sebulan.'
        : 'Harga toko online sendiri setara potongan marketplace selama sekitar ' + (n < 10 ? n.toLocaleString('id-ID', { maximumFractionDigits: 1 }) : Math.round(n)) + ' bulan.';
    }
    $('#kesimpulan').textContent = teks;
  }
  omzet.value = format(k.omzetBawaan || 10000000);
  geser.value = angka(omzet.value);
  persen.value = k.potonganBawaan || 10;
  omzet.addEventListener('input', function () {
    var n = angka(omzet.value);
    omzet.value = n ? format(n) : '';
    geser.value = Math.min(Number(geser.max), Math.max(Number(geser.min), n));
    hitung();
  });
  geser.addEventListener('input', function () { omzet.value = format(geser.value); hitung(); });
  persen.addEventListener('input', hitung);
  hitung();

  // ---------------------------------------------------------------- data terstruktur (harga & nomor dari config)
  var ld = document.querySelector('script[type="application/ld+json"]');
  if (ld && paket.length) {
    try {
      var data = JSON.parse(ld.textContent);
      var hargaSemua = paket.map(function (p) { return p.harga; });
      if (wa) data.telephone = '+' + wa;
      data.priceRange = rupiah(Math.min.apply(null, hargaSemua)) + ' - ' + rupiah(Math.max.apply(null, hargaSemua));
      data.makesOffer = paket.map(function (p) {
        return { '@type': 'Offer', name: 'Jasa pembuatan ' + p.nama, description: p.slogan, price: String(p.harga), priceCurrency: 'IDR' };
      });
      ld.textContent = JSON.stringify(data);
    } catch (e) { /* biarkan data bawaan */ }
  }
})();
