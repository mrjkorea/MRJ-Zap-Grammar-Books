#!/usr/bin/env python3
"""Crop Fly A + Jump B pictures from Red 1 Unit 05 page PNGs."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "_red1-u05" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit05"
OUT.mkdir(parents=True, exist_ok=True)

# Fly A on PDF p83 — 8 items (2 cols × 4 rows; cols 2 & 4 hold illustrations)
FLY_PAGE = SRC / "p0083.png"
FLY_BOXES = [
    (235, 315, 385, 410),
    (595, 315, 745, 410),
    (235, 530, 385, 625),
    (595, 530, 745, 625),
    (235, 700, 385, 795),
    (595, 700, 745, 795),
    (220, 905, 395, 1000),
    (580, 905, 755, 1000),
]

# Jump B on PDF p82 — 5 picture rows (left column)
JUMP_PAGE = SRC / "p0082.png"
JUMP_BOXES = [
    (45, 175, 255, 265),
    (45, 285, 255, 375),
    (45, 395, 255, 485),
    (45, 505, 255, 595),
    (45, 615, 255, 705),
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


def crop_list(page: Path, boxes, prefix: str) -> None:
    base = Image.open(page)
    for i, box in enumerate(boxes, start=1):
        crop = base.crop(box)
        out = OUT / f"{prefix}{i:02d}.png"
        save_compressed(crop, out)
        kb = out.stat().st_size / 1024
        print(f"{out.name}: {kb:.1f} KB")


if __name__ == "__main__":
    crop_list(FLY_PAGE, FLY_BOXES, "fly-a")
    crop_list(JUMP_PAGE, JUMP_BOXES, "jump-b")
    print("Done ->", OUT)
