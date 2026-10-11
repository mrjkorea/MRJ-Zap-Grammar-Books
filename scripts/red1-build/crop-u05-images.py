#!/usr/bin/env python3
"""Crop Fly A + Jump B pictures from Red 1 Unit 05 page PNGs."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "_red1-u05" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit05"
OUT.mkdir(parents=True, exist_ok=True)

# Fly A on PDF p83 — 8 illustration cells (2 rows × 4 cols)
FLY_PAGE = SRC / "p0083.png"
FLY_BOXES = [
    (28, 108, 218, 248),
    (228, 108, 418, 248),
    (428, 108, 618, 248),
    (628, 108, 818, 248),
    (28, 268, 218, 408),
    (228, 268, 418, 408),
    (428, 268, 618, 408),
    (628, 268, 818, 408),
]

# Jump B on PDF p82 — 5 row pictures (left column)
JUMP_PAGE = SRC / "p0082.png"
JUMP_BOXES = [
    (38, 108, 248, 198),
    (38, 218, 248, 308),
    (38, 328, 248, 418),
    (38, 438, 248, 528),
    (38, 548, 248, 638),
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
