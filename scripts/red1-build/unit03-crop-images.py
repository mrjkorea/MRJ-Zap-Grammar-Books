#!/usr/bin/env python3
"""Crop Jump A/B + Fly B pictures from RedZap 1 Unit 03 page PNGs."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "red1-u03-extract" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit03"
OUT.mkdir(parents=True, exist_ok=True)

# 900×1214 — Jump A/B: 2 cols × 5 rows (items 1–10)
PIC_BOXES = [
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

# Fly B p0052 — same 2×5 grid as Jump (items 1–5 left, 6–10 right)
FLY_B_BOXES = PIC_BOXES


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


def crop_page(page: Path, boxes, prefix: str) -> None:
    base = Image.open(page)
    for i, box in enumerate(boxes, start=1):
        crop = base.crop(box)
        out = OUT / f"{prefix}{i:02d}.png"
        save_compressed(crop, out)
        print(f"{out.name}: {out.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    crop_page(SRC / "p0049.png", PIC_BOXES, "jump-a")
    crop_page(SRC / "p0050.png", PIC_BOXES, "jump-b")
    crop_page(SRC / "p0052.png", FLY_B_BOXES, "fly-b")
    print("Done ->", OUT)
