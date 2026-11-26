/*
 * Demo aplikasi Nilai Guru RintisWeb (sekolah dan siswa fiktif).
 * Data tersimpan di browser (localStorage) dan bisa diulang lewat tombol "Ulangi data contoh".
 * Fitur: nilai dengan bobot otomatis, peringkat, tuntas/remedial, kuis pilihan ganda dikoreksi otomatis,
 * analisis soal, deskripsi capaian rapor otomatis, ekspor Excel, dan kirim rapor ke orang tua lewat WhatsApp.
 */
(function () {
  'use strict';

  var KUNCI = 'rw-nilai-guru:v1';
  var RW = window.RINTISWEB || null;
  var TANPA_BILAH = /[?&]tanpa-bilah\b/.test(location.search);

  function $(s, a) { return (a || document).querySelector(s); }
  function semuaEl(s, a) { return Array.prototype.slice.call((a || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function linkWa(nomor, pesan) { return 'https://wa.me/' + (nomor || '') + '?text=' + encodeURIComponent(pesan); }
  function bulat(n) { return Math.round(n * 10) / 10; }
  function teksAngka(n) { return n == null || isNaN(n) ? '-' : String(bulat(n)).replace('.', ','); }

  // ---------------------------------------------------------------- data contoh
  function dataAwal() {
    var nama = ['Ahmad Fauzi', 'Bunga Lestari', 'Citra Ayu Pratiwi', 'Dimas Pratama', 'Eka Saputra', 'Fitri Handayani',
      'Gilang Ramadhan', 'Hana Salsabila', 'Irfan Maulana', 'Jihan Aulia', 'Kevin Wijaya', 'Laila Nur Azizah'];
    var nilai = [
      [88, 92, 85, 90, 87, 91], [95, 94, 92, 96, 93, 95], [78, 80, 74, 82, 76, 79], [70, 65, 68, 72, 66, 70],
      [82, 85, 80, 78, 84, 83], [90, 88, 91, 94, 89, 92], [75, 72, 70, 76, 71, 74], [85, 87, 88, 84, 86, 90],
      [68, 74, 62, 70, 65, 69], [92, 90, 89, 93, 91, 94], [80, 78, 83, 81, 77, 80], [87, 85, 90, 88, 89, 86]];
    var jawaban = ['BCADBACDBA', 'BCADBACDBA', 'BCADBACABA', 'BCDDBACABC', 'BCADBACDCA', 'BCADBACDBA',
      'BAADBACDBC', 'BCADBACDBB', 'ACADBCCABA', 'BCADBACDBA', 'BCADCACDBA', 'BCADBACDAA'];
    return {
      sekolah: 'SMP Contoh Nusantara',
      kelas: 'Kelas 8A',
      mapel: 'Matematika',
      semester: 'Semester ganjil 2026/2027',
      kkm: 75,
      bobot: { tugas: 20, uh: 30, pts: 20, pas: 30 },
      komponen: [
        { id: 't1', nama: 'Tugas 1', materi: 'operasi bilangan bulat', jenis: 'tugas' },
        { id: 't2', nama: 'Tugas 2', materi: 'pecahan', jenis: 'tugas' },
        { id: 'uh1', nama: 'UH 1', materi: 'bentuk aljabar', jenis: 'uh' },
        { id: 'uh2', nama: 'UH 2', materi: 'persamaan linear satu variabel', jenis: 'uh' },
        { id: 'pts', nama: 'PTS', materi: 'materi tengah semester', jenis: 'pts' },
        { id: 'pas', nama: 'PAS', materi: 'materi akhir semester', jenis: 'pas' }
      ],
      siswa: nama.map(function (n, i) {
        var nl = {};
        ['t1', 't2', 'uh1', 'uh2', 'pts', 'pas'].forEach(function (k, j) { nl[k] = nilai[i][j]; });
        return { id: 's' + (i + 1), nama: n, hpOrtu: '62812000001' + ('0' + (i + 1)).slice(-2), nilai: nl, jawaban: jawaban[i] };
      }),
      kunci: 'BCADBACDBA'
    };
  }
  function muat() { try { var d = JSON.parse(localStorage.getItem(KUNCI)); if (d && d.siswa) return d; } catch (e) { /* abaikan */ } return dataAwal(); }
  var D = muat();
  function simpan() { try { localStorage.setItem(KUNCI, JSON.stringify(D)); } catch (e) { /* mode privat */ } }

  var JENIS = [['tugas', 'Tugas'], ['uh', 'Ulangan harian'], ['pts', 'PTS'], ['pas', 'PAS']];
  function nilaiAkhir(s) {
    var total = 0, bobotDipakai = 0;
    JENIS.forEach(function (j) {
      var isi = D.komponen.filter(function (k) { return k.jenis === j[0]; }).map(function (k) { return s.nilai[k.id]; }).filter(function (v) { return v != null && v !== '' && !isNaN(v); });
      if (!isi.length) return;
      var rata = isi.reduce(function (a, b) { return a + Number(b); }, 0) / isi.length;
      total += rata * D.bobot[j[0]];
      bobotDipakai += D.bobot[j[0]];
    });
    return bobotDipakai ? total / bobotDipakai : null;
  }
  function predikat(n) { if (n == null) return '-'; if (n >= 90) return 'A'; if (n >= 80) return 'B'; if (n >= D.kkm) return 'C'; return 'D'; }
  function peringkat() {
    var urut = D.siswa.map(function (s) { return { id: s.id, na: nilaiAkhir(s) }; }).sort(function (a, b) { return (b.na || 0) - (a.na || 0); });
    var hasil = {};
    urut.forEach(function (x, i) { hasil[x.id] = i > 0 && bulat(x.na) === bulat(urut[i - 1].na) ? hasil[urut[i - 1].id] : i + 1; });
    return hasil;
  }
  function totalBobot() { return JENIS.reduce(function (a, j) { return a + Number(D.bobot[j[0]] || 0); }, 0); }

  // ---------------------------------------------------------------- kerangka
  var waRw = RW && RW.whatsapp ? String(RW.whatsapp).replace(/\D/g, '') : '';
  document.getElementById('app').innerHTML =
    (TANPA_BILAH ? '' : '<div class="bilah-demo"><div class="isi"><span><a class="kembali" href="../../#aplikasi">&larr; RintisWeb</a> &middot; <b>Contoh aplikasi penilaian</b>, sekolah fiktif</span>' +
      (waRw ? '<a class="cta" target="_blank" rel="noopener" href="' + esc(linkWa(waRw, 'Halo RintisWeb, saya lihat contoh aplikasi Nilai Guru. Saya mau dibuatkan aplikasi seperti ini untuk sekolah saya.')) + '">Mau yang seperti ini?</a>' : '') + '</div></div>') +
    '<header class="app-kepala"><div class="isi"><div><h1>Nilai Guru</h1><p>' + esc(D.sekolah + ' · ' + D.kelas + ' · ' + D.mapel) + '</p></div>' +
    '<div class="aksi-kepala"><button type="button" id="ulangi">Ulangi data contoh</button></div></div></header>' +
    '<nav class="tab-app" aria-label="Menu aplikasi"><div class="isi" role="tablist">' +
    '<button type="button" role="tab" aria-selected="true" data-tab="nilai">Rekap nilai</button>' +
    '<button type="button" role="tab" aria-selected="false" data-tab="kuis">Kuis otomatis</button>' +
    '<button type="button" role="tab" aria-selected="false" data-tab="rapor">Deskripsi rapor</button></div></nav>' +
    '<main><section class="panel" id="p-nilai"></section><section class="panel" id="p-kuis" hidden></section><section class="panel" id="p-rapor" hidden></section></main>' +
    '<dialog id="dialog" aria-labelledby="judul-dialog"><div class="isi-dialog" id="isi-dialog"></div></dialog>' +
    '<div class="notif" id="notif" role="status" aria-live="polite"></div>';

  var timerNotif;
  function notif(t) { var n = $('#notif'); n.textContent = t; n.classList.add('tampil'); clearTimeout(timerNotif); timerNotif = setTimeout(function () { n.classList.remove('tampil'); }, 2400); }
  var dialog = $('#dialog');
  dialog.addEventListener('click', function (e) { if (e.target === dialog || e.target.closest('[data-tutup]')) dialog.close(); });
  function pratinjauWa(judul, pesan) {
    $('#isi-dialog').innerHTML = '<button type="button" class="tutup" data-tutup aria-label="Tutup">&times;</button><h2 id="judul-dialog">' + esc(judul) + '</h2>' +
      '<p class="catatan" style="margin:0 0 10px">Ini aplikasi contoh, jadi pesan tidak dikirim. Di aplikasi sungguhan, tombol ini membuka WhatsApp orang tua siswa dengan pesan di bawah.</p>' +
      '<div class="pratinjau-pesan">' + esc(pesan) + '</div><div class="tumpuk">' +
      (waRw ? '<a class="tombol tombol-utama" target="_blank" rel="noopener" href="' + esc(linkWa(waRw, 'Halo RintisWeb, saya sudah mencoba contoh aplikasi Nilai Guru. Saya mau dibuatkan aplikasi seperti ini.')) + '">Saya mau aplikasi seperti ini</a>' : '') +
      '<a class="tombol" target="_blank" rel="noopener" href="' + esc('https://wa.me/?text=' + encodeURIComponent(pesan)) + '">Coba kirim ke WhatsApp sendiri</a></div>';
    dialog.showModal();
  }

  var tabAktif = 'nilai';
  function pindahTab(t) {
    tabAktif = t;
    semuaEl('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === t)); });
    ['nilai', 'kuis', 'rapor'].forEach(function (x) { $('#p-' + x).hidden = x !== t; });
    render();
    window.scrollTo(0, 0);
  }
  $('.tab-app').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) pindahTab(b.getAttribute('data-tab')); });
  $('#ulangi').addEventListener('click', function () {
    if (!confirm('Kembalikan semua nilai ke data contoh awal?')) return;
    D = dataAwal(); simpan(); render(); notif('Data contoh dikembalikan');
  });

  // ---------------------------------------------------------------- REKAP NILAI
  function statistik() {
    var na = D.siswa.map(nilaiAkhir).filter(function (n) { return n != null; });
    var rata = na.reduce(function (a, b) { return a + b; }, 0) / (na.length || 1);
    return { rata: rata, maks: Math.max.apply(null, na), min: Math.min.apply(null, na), tuntas: na.filter(function (n) { return n >= D.kkm; }).length, n: na.length };
  }
  function htmlStat() {
    var s = statistik();
    return '<div class="kartu"><span>Rata-rata kelas</span><b>' + teksAngka(s.rata) + '</b></div>' +
      '<div class="kartu"><span>Tertinggi / terendah</span><b>' + teksAngka(s.maks) + ' / ' + teksAngka(s.min) + '</b></div>' +
      '<div class="kartu"><span>Tuntas (KKM ' + D.kkm + ')</span><b style="color:var(--sukses)">' + s.tuntas + ' dari ' + s.n + '</b></div>' +
      '<div class="kartu"><span>Perlu remedial</span><b style="color:var(--bahaya)">' + (s.n - s.tuntas) + ' siswa</b></div>';
  }
  function renderNilai() {
    var rank = peringkat();
    $('#p-nilai').innerHTML =
      '<div class="ringkasan" id="stat">' + htmlStat() + '</div>' +
      '<div class="kartu bobot"><h2>Bobot nilai akhir</h2><div class="bobot-isi">' +
      JENIS.map(function (j) { return '<label class="isian">' + j[1] + ' (%)<input class="input angka" type="number" min="0" max="100" data-bobot="' + j[0] + '" value="' + D.bobot[j[0]] + '"></label>'; }).join('') +
      '<label class="isian">KKM<input class="input angka" type="number" min="0" max="100" id="kkm" value="' + D.kkm + '"></label></div>' +
      '<p class="catatan" id="cek-bobot"></p></div>' +
      '<div class="baris-judul"><h2>' + esc(D.kelas + ' · ' + D.mapel) + '</h2><div class="aksi-baris"><button type="button" class="tombol tombol-kecil" id="unduh">Unduh Excel</button><button type="button" class="tombol tombol-kecil" onclick="window.print()">Cetak</button></div></div>' +
      '<p class="catatan" style="margin:-4px 0 10px">Ketik nilai langsung di tabel. Nilai akhir, predikat, dan peringkat dihitung otomatis.</p>' +
      '<div class="tabel-geser tabel-nilai"><table><thead><tr><th class="lekat">Nama siswa</th>' +
      D.komponen.map(function (k) { return '<th title="' + esc(k.materi) + '">' + esc(k.nama) + '</th>'; }).join('') +
      '<th>Nilai akhir</th><th>Predikat</th><th>Peringkat</th><th>Status</th></tr></thead><tbody>' +
      D.siswa.map(function (s) {
        return '<tr data-siswa="' + s.id + '"><td class="lekat"><b>' + esc(s.nama) + '</b></td>' +
          D.komponen.map(function (k) { return '<td><input class="sel-nilai angka" type="number" min="0" max="100" inputmode="numeric" data-s="' + s.id + '" data-k="' + k.id + '" value="' + (s.nilai[k.id] == null ? '' : s.nilai[k.id]) + '" aria-label="' + esc(k.nama + ' ' + s.nama) + '"></td>'; }).join('') +
          '<td class="na angka"></td><td class="pr"></td><td class="rk angka"></td><td class="st"></td></tr>';
      }).join('') + '</tbody></table></div>';
    perbaruiHitungan(rank);
  }
  function perbaruiHitungan(rank) {
    rank = rank || peringkat();
    semuaEl('#p-nilai tr[data-siswa]').forEach(function (tr) {
      var s = D.siswa.filter(function (x) { return x.id === tr.getAttribute('data-siswa'); })[0];
      var na = nilaiAkhir(s), tuntas = na != null && na >= D.kkm;
      tr.querySelector('.na').textContent = teksAngka(na);
      tr.querySelector('.pr').innerHTML = '<span class="lencana-status ' + (tuntas ? (na >= 90 ? 'lencana-sukses' : 'lencana-info') : 'lencana-bahaya') + '">' + predikat(na) + '</span>';
      tr.querySelector('.rk').textContent = rank[s.id];
      tr.querySelector('.st').innerHTML = tuntas ? '<span class="lencana-status lencana-sukses">Tuntas</span>' : '<span class="lencana-status lencana-bahaya">Remedial</span>';
      semuaEl('.sel-nilai', tr).forEach(function (inp) { var v = Number(inp.value); inp.classList.toggle('rendah', inp.value !== '' && v < D.kkm); });
    });
    var stat = $('#stat'); if (stat) stat.innerHTML = htmlStat();
    var cek = $('#cek-bobot'), t = totalBobot();
    if (cek) { cek.textContent = t === 100 ? 'Total bobot 100%.' : 'Total bobot ' + t + '%. Sebaiknya 100%; nilai akhir tetap dihitung sesuai perbandingan bobot.'; cek.style.color = t === 100 ? '' : 'var(--peringatan)'; }
  }
  $('#p-nilai').addEventListener('input', function (e) {
    var t = e.target;
    if (t.classList.contains('sel-nilai')) {
      var s = D.siswa.filter(function (x) { return x.id === t.getAttribute('data-s'); })[0];
      var v = t.value === '' ? null : Math.max(0, Math.min(100, Number(t.value)));
      s.nilai[t.getAttribute('data-k')] = v;
      simpan(); perbaruiHitungan();
    } else if (t.hasAttribute('data-bobot')) {
      D.bobot[t.getAttribute('data-bobot')] = Math.max(0, Number(t.value) || 0); simpan(); perbaruiHitungan();
    } else if (t.id === 'kkm') {
      D.kkm = Math.max(0, Math.min(100, Number(t.value) || 0)); simpan(); perbaruiHitungan();
    }
  });
  $('#p-nilai').addEventListener('click', function (e) {
    if (!e.target.closest('#unduh')) return;
    var rank = peringkat();
    var baris = [['Nama'].concat(D.komponen.map(function (k) { return k.nama; })).concat(['Nilai akhir', 'Predikat', 'Peringkat', 'Status'])];
    D.siswa.forEach(function (s) {
      var na = nilaiAkhir(s);
      baris.push([s.nama].concat(D.komponen.map(function (k) { return s.nilai[k.id] == null ? '' : s.nilai[k.id]; })).concat([teksAngka(na), predikat(na), rank[s.id], na >= D.kkm ? 'Tuntas' : 'Remedial']));
    });
    unduhCsv(baris, 'rekap-nilai-' + D.kelas.toLowerCase().replace(/\s+/g, '-') + '.csv');
  });
  function unduhCsv(baris, nama) {
    var csv = '﻿' + baris.map(function (r) { return r.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = nama; document.body.appendChild(a); a.click(); a.remove();
    notif('File Excel diunduh');
  }

  // ---------------------------------------------------------------- KUIS OTOMATIS
  function koreksi(jawab) {
    var kunci = D.kunci.toUpperCase().replace(/[^A-E]/g, ''), j = String(jawab || '').toUpperCase().replace(/[^A-E]/g, '');
    var benar = 0, salah = [];
    for (var i = 0; i < kunci.length; i++) { if (j[i] === kunci[i]) benar++; else salah.push(i + 1); }
    return { benar: benar, jumlah: kunci.length, nilai: kunci.length ? Math.round(benar / kunci.length * 100) : 0, salah: salah };
  }
  function renderKuis() {
    var kunci = D.kunci.toUpperCase().replace(/[^A-E]/g, '');
    var hasil = D.siswa.map(function (s) { return koreksi(s.jawaban); });
    var analisis = [];
    for (var i = 0; i < kunci.length; i++) {
      var benar = D.siswa.filter(function (s) { return String(s.jawaban || '').toUpperCase().replace(/[^A-E]/g, '')[i] === kunci[i]; }).length;
      analisis.push({ no: i + 1, persen: Math.round(benar / D.siswa.length * 100) });
    }
    var tersulit = analisis.slice().sort(function (a, b) { return a.persen - b.persen; }).slice(0, 2);
    var rata = hasil.reduce(function (a, h) { return a + h.nilai; }, 0) / (hasil.length || 1);
    $('#p-kuis').innerHTML =
      '<div class="ringkasan"><div class="kartu"><span>Jumlah soal</span><b>' + kunci.length + '</b></div>' +
      '<div class="kartu"><span>Rata-rata kuis</span><b>' + teksAngka(rata) + '</b></div>' +
      '<div class="kartu"><span>Nilai 100</span><b>' + hasil.filter(function (h) { return h.nilai === 100; }).length + ' siswa</b></div>' +
      '<div class="kartu"><span>Soal tersulit</span><b>No. ' + tersulit.map(function (t) { return t.no; }).join(' dan ') + '</b></div></div>' +
      '<div class="kartu"><h2>Kunci jawaban</h2><label class="isian">Ketik kunci berurutan (A–E), misalnya BCADBACDBA<input class="input angka kunci" id="kunci" value="' + esc(D.kunci) + '" autocomplete="off"></label>' +
      '<p class="catatan">Jawaban siswa bisa diketik dari lembar jawaban, atau ditempel dari Google Form. Nilai langsung dikoreksi.</p></div>' +
      '<div class="baris-judul"><h2>Jawaban dan nilai siswa</h2><button type="button" class="tombol tombol-utama tombol-kecil" id="ke-uh2">Masukkan ke kolom UH 2</button></div>' +
      '<div class="tabel-geser"><table><thead><tr><th class="lekat">Nama siswa</th><th>Jawaban</th><th class="kanan">Benar</th><th class="kanan">Nilai</th><th>Salah di nomor</th></tr></thead><tbody>' +
      D.siswa.map(function (s, i) {
        var h = hasil[i];
        return '<tr data-baris-kuis="' + s.id + '"><td class="lekat"><b>' + esc(s.nama) + '</b></td><td><input class="input angka jawab" data-jawab="' + s.id + '" value="' + esc(s.jawaban) + '" aria-label="Jawaban ' + esc(s.nama) + '" autocomplete="off"></td>' +
          '<td class="kanan angka benar">' + h.benar + '/' + h.jumlah + '</td><td class="kanan angka nilai"><b>' + h.nilai + '</b></td><td class="salah">' + (h.salah.length ? h.salah.join(', ') : '<span class="lencana-status lencana-sukses">Semua benar</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="kartu" style="margin-top:12px"><h2>Analisis soal</h2><p class="catatan" style="margin:-4px 0 10px">Persentase siswa yang menjawab benar. Soal di bawah 60% sebaiknya dibahas ulang.</p><div class="batang">' +
      analisis.map(function (a) {
        return '<div><span>Soal ' + a.no + '</span><span class="isi-batang"><span style="width:' + a.persen + '%;' + (a.persen < 60 ? 'background:var(--bahaya)' : '') + '"></span></span><b class="angka kanan">' + a.persen + '%</b></div>';
      }).join('') + '</div></div>';
  }
  $('#p-kuis').addEventListener('change', function (e) {
    if (e.target.id === 'kunci') { D.kunci = e.target.value.toUpperCase(); simpan(); renderKuis(); }
    else if (e.target.hasAttribute('data-jawab')) {
      var s = D.siswa.filter(function (x) { return x.id === e.target.getAttribute('data-jawab'); })[0];
      s.jawaban = e.target.value.toUpperCase(); simpan(); renderKuis();
    }
  });
  $('#p-kuis').addEventListener('click', function (e) {
    if (!e.target.closest('#ke-uh2')) return;
    D.siswa.forEach(function (s) { s.nilai.uh2 = koreksi(s.jawaban).nilai; });
    simpan(); notif('Nilai kuis masuk ke kolom UH 2. Nilai akhir ikut berubah.');
  });

  // ---------------------------------------------------------------- DESKRIPSI RAPOR
  var siswaRapor = D.siswa[0].id;
  function deskripsi(s) {
    var urut = D.komponen.filter(function (k) { return s.nilai[k.id] != null; }).map(function (k) { return { k: k, v: Number(s.nilai[k.id]) }; })
      .filter(function (x) { return ['pts', 'pas'].indexOf(x.k.jenis) < 0; }).sort(function (a, b) { return b.v - a.v; });
    var na = nilaiAkhir(s), p = predikat(na);
    var tingkat = { A: 'sangat baik', B: 'baik', C: 'cukup baik', D: 'masih perlu ditingkatkan' }[p] || 'cukup';
    var depan = s.nama.split(' ')[0];
    if (!urut.length) return '';
    var kuat = urut.slice(0, 2).map(function (x) { return x.k.materi; });
    var lemah = urut[urut.length - 1];
    var teks = p === 'D'
      ? 'Ananda ' + depan + ' sudah mulai memahami ' + kuat.join(' dan ') + ', tetapi penguasaannya secara umum masih perlu ditingkatkan.'
      : 'Ananda ' + depan + ' menunjukkan penguasaan yang ' + tingkat + ' dalam ' + kuat.join(' dan ') + '.';
    if (lemah.v < D.kkm) teks += ' Perlu bimbingan dan remedial pada materi ' + lemah.k.materi + '.';
    else if (lemah.v < 85) teks += ' Perlu peningkatan pada materi ' + lemah.k.materi + '.';
    else teks += ' Pertahankan prestasi dan terus berlatih soal yang lebih menantang.';
    return teks;
  }
  function renderRapor() {
    var s = D.siswa.filter(function (x) { return x.id === siswaRapor; })[0] || D.siswa[0];
    var na = nilaiAkhir(s), rank = peringkat();
    $('#p-rapor').innerHTML =
      '<div class="rapor-tata"><div>' +
      '<label class="isian jangan-cetak">Pilih siswa<select class="pilih" id="pilih-siswa">' + D.siswa.map(function (x) { return '<option value="' + x.id + '"' + (x.id === s.id ? ' selected' : '') + '>' + esc(x.nama) + '</option>'; }).join('') + '</select></label>' +
      '<div class="kartu rapor" style="margin-top:12px"><p class="rapor-sekolah">' + esc(D.sekolah) + '</p><h2>' + esc(s.nama) + '</h2>' +
      '<p class="catatan" style="margin:-6px 0 12px">' + esc(D.kelas + ' · ' + D.mapel + ' · ' + D.semester) + '</p>' +
      '<div class="rapor-angka"><div><span>Nilai akhir</span><b>' + teksAngka(na) + '</b></div><div><span>Predikat</span><b>' + predikat(na) + '</b></div><div><span>Peringkat</span><b>' + rank[s.id] + ' / ' + D.siswa.length + '</b></div></div>' +
      '<table><tbody>' + D.komponen.map(function (k) { return '<tr><td>' + esc(k.nama) + '<br><small style="color:var(--redup)">' + esc(k.materi) + '</small></td><td class="kanan angka"><b>' + (s.nilai[k.id] == null ? '-' : s.nilai[k.id]) + '</b></td></tr>'; }).join('') + '</tbody></table>' +
      '<h3>Deskripsi capaian</h3><p class="deskripsi-rapor" id="deskripsi">' + esc(deskripsi(s)) + '</p></div>' +
      '<div class="tumpuk jangan-cetak"><button type="button" class="tombol tombol-utama" id="salin">Salin deskripsi</button>' +
      '<button type="button" class="tombol" id="kirim-ortu">Kirim ke orang tua lewat WhatsApp</button>' +
      '<button type="button" class="tombol" onclick="window.print()">Cetak lembar nilai</button></div></div>' +
      '<div class="jangan-cetak"><div class="baris-judul" style="margin-top:0"><h2>Deskripsi semua siswa</h2><button type="button" class="tombol tombol-kecil" id="unduh-deskripsi">Unduh Excel</button></div>' +
      '<p class="catatan" style="margin:-4px 0 10px">Disusun otomatis dari nilai tertinggi dan terendah tiap siswa. Bisa langsung disalin ke e-rapor.</p>' +
      '<div class="daftar-deskripsi">' + D.siswa.map(function (x) {
        var n = nilaiAkhir(x);
        return '<div class="kartu"><b>' + esc(x.nama) + '</b> <span class="lencana-status ' + (n >= D.kkm ? 'lencana-sukses' : 'lencana-bahaya') + '">' + teksAngka(n) + ' · ' + predikat(n) + '</span><p>' + esc(deskripsi(x)) + '</p></div>';
      }).join('') + '</div></div></div>';
  }
  $('#p-rapor').addEventListener('change', function (e) { if (e.target.id === 'pilih-siswa') { siswaRapor = e.target.value; renderRapor(); } });
  $('#p-rapor').addEventListener('click', function (e) {
    var s = D.siswa.filter(function (x) { return x.id === siswaRapor; })[0] || D.siswa[0];
    if (e.target.closest('#salin')) {
      var teks = $('#deskripsi').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(teks).then(function () { notif('Deskripsi disalin'); }, function () { notif('Pilih teks lalu salin manual'); });
      else notif('Pilih teks lalu salin manual');
    } else if (e.target.closest('#kirim-ortu')) {
      var na = nilaiAkhir(s);
      pratinjauWa('Laporan nilai untuk orang tua', 'Assalamualaikum Bapak/Ibu orang tua ' + s.nama + '.\nBerikut nilai ' + D.mapel + ' ' + D.semester + ':\n\n' +
        D.komponen.map(function (k) { return '- ' + k.nama + ': ' + (s.nilai[k.id] == null ? '-' : s.nilai[k.id]); }).join('\n') +
        '\n\nNilai akhir: ' + teksAngka(na) + ' (predikat ' + predikat(na) + ')\n' + deskripsi(s) + '\n\nTerima kasih.\nWali kelas ' + D.kelas + ', ' + D.sekolah);
    } else if (e.target.closest('#unduh-deskripsi')) {
      unduhCsv([['Nama', 'Nilai akhir', 'Predikat', 'Deskripsi']].concat(D.siswa.map(function (x) { var n = nilaiAkhir(x); return [x.nama, teksAngka(n), predikat(n), deskripsi(x)]; })), 'deskripsi-rapor-' + D.kelas.toLowerCase().replace(/\s+/g, '-') + '.csv');
    }
  });

  function render() {
    if (tabAktif === 'nilai') renderNilai();
    else if (tabAktif === 'kuis') renderKuis();
    else renderRapor();
  }
  var awal = (location.hash || '').replace('#', '');
  if (['kuis', 'rapor'].indexOf(awal) >= 0) pindahTab(awal); else render();
})();
