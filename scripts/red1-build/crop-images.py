#!/usr/bin/env python3
"""Crop Jump B pencils + Fly B ants from unit page PNGs; compress <60KB."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "red1-u01-extract" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit01"
OUT.mkdir(parents=True, exist_ok=True)

# Jump B on PDF page 18 (p0018.png) — 12 items, crop picture boxes for rows 1–6
JUMP_PAGE = SRC / "p0018.png"
# (left, upper, right, lower) — tuned for 900×1214 source
JUMP_BOXES = [
    (52, 118, 248, 218),
    (52, 228, 248, 328),
    (52, 338, 248, 438),
    (52, 448, 248, 548),
    (52, 558, 248, 658),
    (52, 668, 248, 768),
]

FLY_PAGE = SRC / "p0020.png"
# Fly B ant squares — 10 items, 2 columns × 5 rows
FLY_BOXES = [
    (48, 108, 198, 228),
    (458, 108, 608, 228),
    (48, 248, 198, 368),
    (458, 248, 608, 368),
    (48, 388, 198, 508),
    (458, 388, 608, 508),
    (48, 528, 198, 648),
    (458, 528, 608, 648),
    (48, 668, 198, 788),
    (458, 668, 608, 788),
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
    path.write_bytes(path.read_bytes())


def crop_list(page: Path, boxes, prefix: str) -> None:
    base = Image.open(page)
    for i, box in enumerate(boxes, start=1):
        crop = base.crop(box)
        out = OUT / f"{prefix}{i:02d}.png"
        save_compressed(crop, out)
        kb = out.stat().st_size / 1024
        print(f"{out.name}: {kb:.1f} KB")


if __name__ == "__main__":
    crop_list(JUMP_PAGE, JUMP_BOXES, "jump-b")
    crop_list(FLY_PAGE, FLY_BOXES, "fly-b")
    print("Done ->", OUT)
