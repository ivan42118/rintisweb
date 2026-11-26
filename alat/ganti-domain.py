"""
Mengganti alamat situs lama dengan alamat baru di semua file (meta tag, sitemap, robots, config.js).
Contoh, saat pindah ke domain sendiri:

    python alat/ganti-domain.py https://ivan42118.github.io/rintisweb https://rintisweb.id

Setelah itu jalankan ulang alat/buat-tangkapan.py kalau gambar pratinjau perlu diperbarui.
"""
import io
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JENIS = {".html", ".js", ".xml", ".txt", ".webmanifest", ".md", ".json"}
LEWATI = {"konsep-logo", "_tmp", ".git", "alat"}


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    lama, baru = sys.argv[1].rstrip("/"), sys.argv[2].rstrip("/")
    jumlah = 0
    for p in ROOT.rglob("*"):
        if not p.is_file() or p.suffix not in JENIS or LEWATI & set(p.relative_to(ROOT).parts):
            continue
        teks = io.open(p, encoding="utf-8", newline="").read()
        if lama in teks:
            n = teks.count(lama)
            io.open(p, "w", encoding="utf-8", newline="").write(teks.replace(lama, baru))
            jumlah += n
            print(f"{p.relative_to(ROOT)}: {n} diganti")
    print(f"Selesai: {jumlah} alamat diganti.")


if __name__ == "__main__":
    main()
