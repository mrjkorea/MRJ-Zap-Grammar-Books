#!/usr/bin/env python3
"""Crop picture items from RedZap 1 review page PNGs."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]

# (src_page, box, out_rel)
CROPS = [
    # Review 01 p38 — Q8–10 (printed p37)
    (
        "/tmp/red1-rv01/pages/p0038.png",
        (40, 585, 270, 725),
        "assets/img/red1/review01/q08.png",
    ),
    (
        "/tmp/red1-rv01/pages/p0038.png",
        (40, 775, 270, 915),
        "assets/img/red1/review01/q09.png",
    ),
    (
        "/tmp/red1-rv01/pages/p0038.png",
        (40, 940, 270, 1080),
        "assets/img/red1/review01/q10.png",
    ),
    # Review 02 p70 — Q6–10 (printed p69)
    (
        "/tmp/red1-rv02/pages/p0070.png",
        (55, 195, 265, 320),
        "assets/img/red1/review02/q06.png",
    ),
    (
        "/tmp/red1-rv02/pages/p0070.png",
        (55, 360, 265, 490),
        "assets/img/red1/review02/q07.png",
    ),
    (
        "/tmp/red1-rv02/pages/p0070.png",
        (120, 655, 270, 785),
        "assets/img/red1/review02/q08.png",
    ),
    (
        "/tmp/red1-rv02/pages/p0070.png",
        (55, 800, 265, 940),
        "assets/img/red1/review02/q09.png",
    ),
    (
        "/tmp/red1-rv02/pages/p0070.png",
        (55, 980, 265, 1120),
        "assets/img/red1/review02/q10.png",
    ),
    # Review 03 p101 — Q1–5 (printed p100)
    (
        "/tmp/red1-rv03/pages/p0101.png",
        (60, 190, 310, 365),
        "assets/img/red1/review03/q01.png",
    ),
    (
        "/tmp/red1-rv03/pages/p0101.png",
        (470, 190, 720, 365),
        "assets/img/red1/review03/q02.png",
    ),
    (
        "/tmp/red1-rv03/pages/p0101.png",
        (50, 545, 275, 665),
        "assets/img/red1/review03/q03.png",
    ),
    (
        "/tmp/red1-rv03/pages/p0101.png",
        (285, 548, 540, 648),
        "assets/img/red1/review03/q04.png",
    ),
    (
        "/tmp/red1-rv03/pages/p0101.png",
        (50, 880, 275, 1020),
        "assets/img/red1/review03/q05.png",
    ),
]


def save_compressed(im: Image.Image, path: Path, max_kb: int = 58) -> None:
    im = im.convert("RGB")
    w, h = im.size
    for scale in [1.0, 0.85, 0.72, 0.6]:
        nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
        resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
        for q in range(85, 40, -5):
            resized.save(path, format="PNG", optimize=True, compress_level=9)
            if path.stat().st_size <= max_kb * 1024:
                return


def main() -> None:
    for src, box, rel in CROPS:
        path = REPO / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        base = Image.open(src)
        crop = base.crop(box)
        save_compressed(crop, path)
        kb = path.stat().st_size / 1024
        print(f"{rel}: {kb:.1f} KB")


if __name__ == "__main__":
    main()
