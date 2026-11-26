"""
Merapikan foto produk klien: potong ke rasio yang sama, kecilkan, dan simpan sebagai WebP.

    python alat/kompres-foto.py <folder-foto-asli> <folder-hasil> [rasio] [lebar]

Contoh:
    python alat/kompres-foto.py "E:\\klien\\tokoa\\foto-asli" "E:\\klien\\tokoa\\img"          (4:5, lebar 600)
    python alat/kompres-foto.py "E:\\klien\\tokob\\foto-asli" "E:\\klien\\tokob\\img" 1:1 640  (persegi)

Foto dipotong dari tengah. Nama file hasil dibuat huruf kecil dengan tanda hubung,
misalnya "Kaos Hitam (1).jpg" menjadi "kaos-hitam-1.webp". Butuh Pillow.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

JENIS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp"}


def nama_rapi(teks):
    teks = re.sub(r"[^a-z0-9]+", "-", teks.lower()).strip("-")
    return teks or "foto"


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asal, hasil = Path(sys.argv[1]), Path(sys.argv[2])
    rasio = sys.argv[3] if len(sys.argv) > 3 else "4:5"
    lebar = int(sys.argv[4]) if len(sys.argv) > 4 else 600
    a, b = (int(x) for x in rasio.split(":"))
    tinggi = round(lebar * b / a)
    hasil.mkdir(parents=True, exist_ok=True)
    total = 0
    for f in sorted(asal.iterdir()):
        if f.suffix.lower() not in JENIS:
            continue
        try:
            im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        except Exception as e:  # noqa: BLE001 - lewati file yang tidak bisa dibaca
            print("dilewati", f.name, e)
            continue
        im = ImageOps.fit(im, (lebar, tinggi), Image.LANCZOS, centering=(0.5, 0.5))
        out = hasil / (nama_rapi(f.stem) + ".webp")
        im.save(out, "WEBP", quality=72, method=6)
        total += out.stat().st_size
        print(f"{f.name} -> {out.name} ({out.stat().st_size // 1024} KB)")
    print(f"Selesai. Total {total / 1024:.0f} KB.")


if __name__ == "__main__":
    main()
