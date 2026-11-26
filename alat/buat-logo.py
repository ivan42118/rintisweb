"""
Membuat semua file logo RintisWeb di assets/logo/.

Jalankan dari folder proyek:
    python alat/buat-logo.py

Butuh: Python 3, fonttools, Pillow, dan Google Chrome (untuk PNG).
Bentuk ikon digambar di grid 640 x 640. Tulisan memakai huruf Figtree
(assets/fonts/Figtree-wght.ttf, lisensi OFL) yang diubah menjadi path vektor.
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "assets" / "fonts" / "Figtree-wght.ttf"
OUT = ROOT / "assets" / "logo"
CHROME_CANDIDATES = [
    os.environ.get("CHROME", ""),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

# ---------------------------------------------------------------- bentuk ikon
PANAH = "M80 537 C 96 450 196 336 364 267 L 350 246 L 446 222 L 413 315 L 396 296 C 288 358 244 452 238 537 Z"
HURUF_R = ("M122 420 V129 Q122 97 154 97 H428 C 508 97 564 160 564 250 C 564 336 506 402 428 404 H186 V420 Z "
           "M186 161 H432 C 472 161 499 200 499 250 C 499 304 470 340 428 340 H186 Z")
KAKI_R = "M266 370 H440 L462 390 L556 512 Q568 537 540 537 H412 Q400 537 392 527 Z"
TITIK = [(216, 205), (260, 205), (304, 205)]
CELAH = 38  # lebar celah antara panah dan huruf R (dua kali jarak satu sisi)

# Batas isi ikon (termasuk tepi panah) di grid 640
IKON_KIRI, IKON_KANAN, IKON_ATAS, IKON_BAWAH = 79, 565, 97, 537

VARIAN = {
    # nama: (isi huruf R, warna titik, isi panah, warna "Rintis", warna "Web", warna tagline)
    "warna": ("url(#rw-g-r)", "#061a72", "url(#rw-g-panah)", "#0b1647", "#1257ff", "#5b6478"),
    "putih": ("#ffffff", "#ffffff", "url(#rw-g-panah)", "#ffffff", "#4d9dff", "#a9b6d6"),
    "datar": ("#0b1f8a", "#0b1f8a", "#1a8cff", "#0b1647", "#1257ff", "#5b6478"),
    "hitam": ("#000000", "#000000", "#000000", "#000000", "#000000", "#000000"),
}

GRADASI = """
    <linearGradient id="rw-g-r" x1="0" y1="97" x2="0" y2="537" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#061c7c"/>
      <stop offset=".5" stop-color="#0a2a9e"/>
      <stop offset="1" stop-color="#0a5cf0"/>
    </linearGradient>
    <linearGradient id="rw-g-panah" x1="80" y1="537" x2="446" y2="222" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00b8fc"/>
      <stop offset="1" stop-color="#0a6cff"/>
    </linearGradient>"""


def defs_ikon():
    return f"""  <defs>{GRADASI}
    <mask id="rw-celah" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640">
      <rect width="640" height="640" fill="#fff"/>
      <path d="{PANAH}" fill="#000" stroke="#000" stroke-width="{CELAH}" stroke-linejoin="round"/>
    </mask>
  </defs>
"""


def gambar_ikon(varian):
    isi_r, titik, isi_panah = VARIAN[varian][:3]
    lingkaran = "".join(f'<circle cx="{x}" cy="{y}" r="12.5"/>' for x, y in TITIK)
    return f"""  <g mask="url(#rw-celah)" fill="{isi_r}">
    <path fill-rule="evenodd" d="{HURUF_R}"/>
    <path d="{KAKI_R}"/>
  </g>
  <g fill="{titik}">{lingkaran}</g>
  <path d="{PANAH}" fill="{isi_panah}" stroke="{isi_panah}" stroke-width="2" stroke-linejoin="round"/>
"""


# ---------------------------------------------------------------- huruf
class Huruf:
    def __init__(self, path, berat):
        font = TTFont(path)
        self.font = instancer.instantiateVariableFont(font, {"wght": berat})
        self.glyphs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.hmtx = self.font["hmtx"]
        self.kern = self._baca_kerning()

    def _baca_kerning(self):
        """Ambil penyesuaian jarak pasangan huruf (fitur 'kern' di tabel GPOS)."""
        hasil = {}
        if "GPOS" not in self.font:
            return hasil
        gpos = self.font["GPOS"].table
        indeks = set()
        for fr in gpos.FeatureList.FeatureRecord:
            if fr.FeatureTag == "kern":
                indeks.update(fr.Feature.LookupListIndex)
        for i in sorted(indeks):
            lookup = gpos.LookupList.Lookup[i]
            for sub in lookup.SubTable:
                jenis = lookup.LookupType
                if jenis == 9:
                    jenis = sub.ExtensionLookupType
                    sub = sub.ExtSubTable
                if jenis != 2:
                    continue
                pertama = sub.Coverage.glyphs
                if sub.Format == 1:
                    for g1, ps in zip(pertama, sub.PairSet):
                        for rec in ps.PairValueRecord:
                            v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                            if v:
                                hasil.setdefault((g1, rec.SecondGlyph), v)
                elif sub.Format == 2:
                    kelas1 = sub.ClassDef1.classDefs if sub.ClassDef1 else {}
                    kelas2 = sub.ClassDef2.classDefs if sub.ClassDef2 else {}
                    sub._rw = (set(pertama), kelas1, kelas2, sub.Class1Record)
                    hasil.setdefault("_kelas", []).append(sub._rw)
        return hasil

    def jarak_pasangan(self, g1, g2):
        if (g1, g2) in self.kern:
            return self.kern[(g1, g2)]
        for cakupan, k1, k2, rec in self.kern.get("_kelas", []):
            if g1 in cakupan:
                c1 = k1.get(g1, 0)
                c2 = k2.get(g2, 0)
                v = rec[c1].Class2Record[c2].Value1
                x = getattr(v, "XAdvance", 0) if v else 0
                if x:
                    return x
        return 0

    def path(self, teks, tracking=0):
        """Kembalikan (d, lebar) dalam satuan huruf (1000 per em, sumbu y ke atas)."""
        pen = SVGPathPen(self.glyphs)
        x = 0
        nama = [self.cmap[ord(c)] for c in teks]
        for i, g in enumerate(nama):
            self.glyphs[g].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
            x += self.hmtx[g][0] + tracking
            if i + 1 < len(nama):
                x += self.jarak_pasangan(g, nama[i + 1])
        return pen.getCommands(), x - tracking


# ---------------------------------------------------------------- tata letak
def tulisan(huruf_tebal, huruf_tagline, varian, pakai_tagline):
    """Susun tulisan RintisWeb (dan tagline) di kanan ikon. Kembalikan (svg, x_kanan)."""
    warna_rintis, warna_web, warna_tag = VARIAN[varian][3:]
    tinggi_ikon = IKON_BAWAH - IKON_ATAS               # 440
    pusat = (IKON_ATAS + IKON_BAWAH) / 2               # 317
    s = 0.3178                                          # ukuran huruf: tinggi kapital ~ separuh tinggi ikon
    tinggi_kapital = 700 * s
    x0 = IKON_KANAN + 116
    tracking = -25                                      # -0.025em

    d_rintis, w_rintis = huruf_tebal.path("Rintis", tracking)
    d_web, w_web = huruf_tebal.path("Web", tracking)
    kern_tengah = huruf_tebal.jarak_pasangan(huruf_tebal.cmap[ord("s")], huruf_tebal.cmap[ord("W")]) + tracking
    x_web = x0 + (w_rintis + kern_tengah) * s
    lebar_nama = (w_rintis + kern_tengah + w_web) * s

    if pakai_tagline:
        s_tag = s * 12 / 44
        jarak = 85
        tinggi_blok = tinggi_kapital + jarak + 700 * s_tag
        dasar = pusat - tinggi_blok / 2 + tinggi_kapital
    else:
        dasar = pusat + tinggi_kapital / 2

    svg = (f'  <path transform="translate({x0:.2f} {dasar:.2f}) scale({s} -{s})" fill="{warna_rintis}" d="{d_rintis}"/>\n'
           f'  <path transform="translate({x_web:.2f} {dasar:.2f}) scale({s} -{s})" fill="{warna_web}" d="{d_web}"/>\n')
    x_kanan = x0 + lebar_nama

    if pakai_tagline:
        d_tag, w_tag = huruf_tagline.path("JASA PEMBUATAN WEBSITE", 120)
        dasar_tag = dasar + jarak + 700 * s_tag
        svg += f'  <path transform="translate({x0 + 21:.2f} {dasar_tag:.2f}) scale({s_tag:.5f} -{s_tag:.5f})" fill="{warna_tag}" d="{d_tag}"/>\n'
        x_kanan = max(x_kanan, x0 + 21 + w_tag * s_tag)
    return svg, x_kanan


def svg_ikon(varian, judul):
    sisi = 520
    cx, cy = (IKON_KIRI + IKON_KANAN) / 2, (IKON_ATAS + IKON_BAWAH) / 2
    vb = f"{cx - sisi / 2:.0f} {cy - sisi / 2:.0f} {sisi} {sisi}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{judul}">\n'
            f"  <title>{judul}</title>\n{defs_ikon()}{gambar_ikon(varian)}</svg>\n")


def svg_logo(varian, huruf_tebal, huruf_tagline, pakai_tagline=False):
    teks, x_kanan = tulisan(huruf_tebal, huruf_tagline, varian, pakai_tagline)
    pad = 24
    x = IKON_KIRI - pad
    y = IKON_ATAS - pad
    w = x_kanan + pad - x
    h = (IKON_BAWAH - IKON_ATAS) + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.0f} {y:.0f} {w:.0f} {h:.0f}" role="img" aria-label="RintisWeb">\n'
            f"  <title>RintisWeb</title>\n{defs_ikon()}{gambar_ikon(varian)}{teks}</svg>\n"), w / h


# ---------------------------------------------------------------- PNG lewat Chrome
def cari_chrome():
    for c in CHROME_CANDIDATES:
        if c and Path(c).exists():
            return c
    sys.exit("Chrome tidak ditemukan. Atur variabel lingkungan CHROME ke lokasi chrome.exe.")


def render_png(chrome, svg_path, out_png, lebar, tinggi, latar="transparent", skala_isi=1.0):
    """Tampilkan SVG di tengah kanvas lebar x tinggi lalu simpan sebagai PNG."""
    with tempfile.TemporaryDirectory() as tmp:
        html = Path(tmp) / "halaman.html"
        html.write_text(
            "<!doctype html><html><head><meta charset='utf-8'><style>"
            f"html,body{{margin:0;width:{lebar}px;height:{tinggi}px;overflow:hidden;background:{latar}}}"
            "body{display:flex;align-items:center;justify-content:center}"
            f"img{{width:{skala_isi * 100:.2f}%;height:{skala_isi * 100:.2f}%;object-fit:contain}}"
            f"</style></head><body><img src='{svg_path.as_uri()}'></body></html>",
            encoding="utf-8",
        )
        subprocess.run(
            [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
             f"--user-data-dir={Path(tmp) / 'profil'}", "--default-background-color=00000000",
             "--force-device-scale-factor=1", f"--window-size={lebar},{tinggi}",
             f"--screenshot={out_png}", html.as_uri()],
            check=True, capture_output=True, timeout=60,
        )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tebal = Huruf(FONT, 800)
    tagline = Huruf(FONT, 700)

    judul = {
        "warna": "RintisWeb, ikon warna penuh",
        "putih": "RintisWeb, ikon untuk latar gelap",
        "datar": "RintisWeb, ikon warna datar",
        "hitam": "RintisWeb, ikon satu warna",
    }
    file_svg = {}
    for v in VARIAN:
        p = OUT / f"rintisweb-ikon-{v}.svg"
        p.write_text(svg_ikon(v, judul[v]), encoding="utf-8")
        file_svg[f"ikon-{v}"] = p

    rasio = {}
    for v in VARIAN:
        teks, r = svg_logo(v, tebal, tagline)
        p = OUT / f"rintisweb-logo-{v}.svg"
        p.write_text(teks, encoding="utf-8")
        file_svg[f"logo-{v}"] = p
        rasio[f"logo-{v}"] = r
    for v in ("warna", "putih"):
        teks, r = svg_logo(v, tebal, tagline, pakai_tagline=True)
        p = OUT / f"rintisweb-logo-tagline-{v}.svg"
        p.write_text(teks, encoding="utf-8")
        file_svg[f"logo-tagline-{v}"] = p
        rasio[f"logo-tagline-{v}"] = r

    shutil.copyfile(file_svg["ikon-warna"], OUT / "favicon.svg")

    chrome = cari_chrome()
    png = OUT / "png"
    png.mkdir(exist_ok=True)
    jobs = [
        # (sumber, nama file, lebar, tinggi, latar, skala isi)
        ("ikon-warna", "rintisweb-ikon-1024.png", 1024, 1024, "transparent", 1.0),
        ("ikon-putih", "rintisweb-ikon-putih-1024.png", 1024, 1024, "transparent", 1.0),
        ("ikon-warna", "foto-profil-wa.png", 640, 640, "#ffffff", 0.66),
        ("ikon-warna", "apple-touch-icon.png", 180, 180, "#ffffff", 0.78),
        ("ikon-warna", "icon-192.png", 192, 192, "#ffffff", 0.66),
        ("ikon-warna", "icon-512.png", 512, 512, "#ffffff", 0.66),
        ("ikon-warna", "favicon-48.png", 48, 48, "transparent", 1.0),
        ("ikon-warna", "favicon-32.png", 32, 32, "transparent", 1.0),
        ("ikon-warna", "favicon-16.png", 16, 16, "transparent", 1.0),
    ]
    for kunci in ("logo-warna", "logo-putih", "logo-hitam", "logo-tagline-warna", "logo-tagline-putih"):
        lebar = 2000
        jobs.append((kunci, f"rintisweb-{kunci}-2000.png", lebar, round(lebar / rasio[kunci]), "transparent", 1.0))

    for sumber, nama, w, h, latar, skala in jobs:
        render_png(chrome, file_svg[sumber], png / nama, w, h, latar, skala)
        print("dibuat", nama)

    ico = [Image.open(png / f"favicon-{n}.png").convert("RGBA") for n in (16, 32, 48)]
    ico[2].save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:2])
    print("selesai:", OUT)


if __name__ == "__main__":
    main()
