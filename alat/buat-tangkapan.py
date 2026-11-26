"""
Membuat gambar tangkapan layar website contoh untuk situs jualan RintisWeb:
  - assets/contoh/<id>.webp       tampilan HP (dipakai di hero dan kartu contoh)
  - assets/contoh/<id>-og.jpg     gambar pratinjau saat link contoh dibagikan di WhatsApp
  - assets/og.jpg                 gambar pratinjau situs utama (dari alat/og.html)

Jalankan server lokal dulu dari folder proyek:  python -m http.server 5510
Lalu jalankan:                                   python alat/buat-tangkapan.py
Butuh Google Chrome dan Pillow.
"""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE", "http://127.0.0.1:5510")
OUT = ROOT / "assets" / "contoh"
CONTOH = ["kanaya-wear", "langkah-footwear", "batik-sekar-jagad", "sekar-wedding", "kopi-tepas", "kasir-grosir", "nilai-guru"]
CHROME = next((c for c in [os.environ.get("CHROME", ""),
                           r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                           r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                           r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"] if c and Path(c).exists()), None)


def tangkap(url, lebar, tinggi, skala, keluar):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                        f"--user-data-dir={tmp}", f"--window-size={lebar},{tinggi}",
                        f"--force-device-scale-factor={skala}", "--virtual-time-budget=4000",
                        f"--screenshot={keluar}", url], check=True, capture_output=True, timeout=90)


def main():
    if not CHROME:
        sys.exit("Chrome tidak ditemukan. Atur variabel lingkungan CHROME.")
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for c in CONTOH:
            url = f"{BASE}/contoh/{c}/?tanpa-bilah"
            hp = Path(tmp) / f"{c}-hp.png"
            # Jendela Chrome punya lebar minimum, jadi halaman dimuat di iframe selebar 390 px lalu dipotong.
            bingkai = Path(tmp) / f"{c}-bingkai.html"
            bingkai.write_text("<!doctype html><html><body style='margin:0;background:#fff'>"
                               f"<iframe src='{url}' style='display:block;width:390px;height:844px;border:0'></iframe>"
                               "</body></html>", encoding="utf-8")
            tangkap(bingkai.as_uri(), 600, 844, 2, hp)
            im = Image.open(hp).convert("RGB").crop((0, 0, 780, 1688)).resize((360, 780), Image.LANCZOS)
            im.save(OUT / f"{c}.webp", "WEBP", quality=74, method=6)
            og = Path(tmp) / f"{c}-og.png"
            tangkap(url, 1200, 630, 1, og)
            Image.open(og).convert("RGB").save(OUT / f"{c}-og.jpg", "JPEG", quality=84, optimize=True, progressive=True)
            print("dibuat", c, (OUT / f"{c}.webp").stat().st_size // 1024, "KB,",
                  (OUT / f"{c}-og.jpg").stat().st_size // 1024, "KB")
        og = Path(tmp) / "og.png"
        tangkap(f"{BASE}/alat/og.html", 1200, 630, 1, og)
        Image.open(og).convert("RGB").save(ROOT / "assets" / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
        print("dibuat assets/og.jpg", (ROOT / "assets" / "og.jpg").stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
