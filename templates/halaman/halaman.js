/*
 * Template Landing Page & Company Profile RintisWeb.
 * Pengaturan ada di window.SITUS (lihat <script> di halaman): nama usaha, nomor WA, jam buka.
 *  - Tautan/tombol dengan data-wa="isi pesan" membuka WhatsApp dengan pesan itu.
 *  - <form data-form-wa="kalimat pembuka"> menyusun isian (name + data-label) jadi pesan WhatsApp.
 *  - Elemen [data-status-buka] menampilkan "Buka sekarang" sesuai SITUS.jamBuka.
 *  - Tab: [role=tablist] berisi [role=tab][aria-controls=id-panel].
 */
(function () {
  'use strict';

  var S = window.SITUS || {};
  var RW = window.RINTISWEB || null;
  var DEMO = !!S.demo;
  var wa = String(S.whatsapp || '').replace(/\D/g, '');
  var IKON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function linkWa(nomor, pesan) { return 'https://wa.me/' + (nomor || '') + '?text=' + encodeURIComponent(pesan); }
  function bukaTautan(url) { var w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; }
  function keMenit(j) { var b = String(j).split(':'); return Number(b[0]) * 60 + Number(b[1] || 0); }

  // ---------------------------------------------------------------- bilah contoh
  if (DEMO && !/[?&]tanpa-bilah\b/.test(location.search)) {
    var waRw = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
    var bilah = document.createElement('div');
    bilah.className = 'bilah-demo';
    bilah.innerHTML = '<div class="wadah"><span><a class="kembali" href="' + esc(S.urlKembali || '../../#contoh') + '">&larr; RintisWeb</a> &middot; <b>Contoh ' + esc(S.jenisContoh || 'website') + '</b>, usaha fiktif</span>' +
      (waRw ? '<a class="cta" target="_blank" rel="noopener" href="' + esc(linkWa(waRw, 'Halo RintisWeb, saya lihat contoh ' + (S.jenisContoh || 'website') + ' "' + (S.nama || '') + '". Saya mau dibuatkan website seperti ini.')) + '">Mau yang seperti ini?</a>' : '') + '</div>';
    document.body.insertBefore(bilah, document.body.firstChild);
  }

  // ---------------------------------------------------------------- tombol chat melayang
  if (S.tombolChat !== false) {
    var chat = document.createElement('a');
    chat.className = 'tombol-chat';
    chat.setAttribute('data-wa', S.pesanChat || ('Halo ' + (S.nama || '') + ', saya mau tanya.'));
    chat.innerHTML = IKON_WA + '<span>' + esc(S.labelChat || 'Chat kami') + '</span>';
    document.body.appendChild(chat);
  }

  // ---------------------------------------------------------------- pratinjau pesan (mode contoh)
  var dialog;
  function pratinjau(pesan) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.setAttribute('aria-labelledby', 'judul-pratinjau');
      document.body.appendChild(dialog);
      dialog.addEventListener('click', function (e) { if (e.target === dialog || e.target.closest('[data-tutup]')) dialog.close(); });
    }
    var waRw2 = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
    dialog.innerHTML = '<div class="isi-dialog"><button type="button" class="tutup" data-tutup aria-label="Tutup">&times;</button>' +
      '<h2 id="judul-pratinjau">Pesan ini masuk ke WhatsApp ' + esc(S.nama || 'pemilik usaha') + '</h2>' +
      '<p class="ket">Ini contoh website, jadi pesan tidak dikirim ke mana pun. Di website sungguhan, tombol ini langsung membuka WhatsApp pemilik usaha dengan pesan di bawah.</p>' +
      '<div class="pratinjau-pesan">' + esc(pesan) + '</div><div class="tumpuk">' +
      (waRw2 ? '<a class="tombol tombol-utama" target="_blank" rel="noopener" href="' + esc(linkWa(waRw2, 'Halo RintisWeb, saya sudah mencoba contoh ' + (S.jenisContoh || 'website') + ' "' + (S.nama || '') + '". Saya mau dibuatkan website seperti ini.')) + '">Saya mau website seperti ini</a>' : '') +
      '<a class="tombol tombol-garis" target="_blank" rel="noopener" href="' + esc('https://wa.me/?text=' + encodeURIComponent(pesan)) + '">Coba kirim ke WhatsApp sendiri</a></div></div>';
    dialog.showModal();
  }

  // ---------------------------------------------------------------- tautan WhatsApp
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    var pesan = a.getAttribute('data-wa') || ('Halo ' + (S.nama || '') + ', saya mau tanya.');
    if (!DEMO && wa) {
      a.href = linkWa(wa, pesan);
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#';
      a.addEventListener('click', function (e) { e.preventDefault(); pratinjau(pesan); });
    }
  });

  // ---------------------------------------------------------------- formulir ke WhatsApp
  function formatTanggal(v) {
    var d = new Date(v + 'T00:00:00');
    return isNaN(d) ? v : d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-form-wa]'), function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var peringatan = f.querySelector('.peringatan');
      var kosong = null;
      Array.prototype.forEach.call(f.querySelectorAll('[required]'), function (el) { if (!kosong && !String(el.value).trim()) kosong = el; });
      if (kosong) {
        if (peringatan) peringatan.textContent = 'Isi ' + (kosong.getAttribute('data-label') || kosong.name).toLowerCase() + ' dulu.';
        kosong.focus();
        return;
      }
      if (peringatan) peringatan.textContent = '';
      var baris = [f.getAttribute('data-form-wa') || ('Halo ' + (S.nama || '') + ','), ''];
      Array.prototype.forEach.call(f.elements, function (el) {
        if (!el.name || !String(el.value).trim()) return;
        var nilai = el.type === 'date' ? formatTanggal(el.value) : el.value.trim();
        baris.push((el.getAttribute('data-label') || el.name) + ': ' + nilai);
      });
      var pesan = baris.join('\n');
      if (!DEMO && wa) bukaTautan(linkWa(wa, pesan));
      else pratinjau(pesan);
    });
  });

  // ---------------------------------------------------------------- status jam buka
  Array.prototype.forEach.call(document.querySelectorAll('[data-status-buka]'), function (el) {
    if (!S.jamBuka) return;
    var kini = new Date();
    var jam = S.jamBuka[kini.getDay()] || S.jamBuka.setiapHari;
    if (!jam) { el.textContent = 'Hari ini tutup'; return; }
    var m = kini.getHours() * 60 + kini.getMinutes();
    var buka = m >= keMenit(jam[0]) && m < keMenit(jam[1]);
    el.textContent = buka ? 'Buka sekarang · tutup ' + jam[1].replace(':', '.') : 'Sedang tutup · buka ' + jam[0].replace(':', '.');
    el.classList.toggle('buka', buka);
  });

  // ---------------------------------------------------------------- tab
  Array.prototype.forEach.call(document.querySelectorAll('[role="tablist"]'), function (daftar) {
    var tab = daftar.querySelectorAll('[role="tab"]');
    Array.prototype.forEach.call(tab, function (t) {
      t.addEventListener('click', function () {
        Array.prototype.forEach.call(tab, function (x) {
          var aktif = x === t;
          x.setAttribute('aria-selected', String(aktif));
          var panel = document.getElementById(x.getAttribute('aria-controls'));
          if (panel) panel.hidden = !aktif;
        });
      });
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-tahun]'), function (n) { n.textContent = new Date().getFullYear(); });
})();
