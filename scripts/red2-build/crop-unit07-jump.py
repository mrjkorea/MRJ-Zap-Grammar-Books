#!/usr/bin/env python3
"""Crop Jump A pictures from RedZap 2 Unit 07 page 112 (p0113.png)."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = Path("/tmp/red2-u07/pages/p0113.png")
OUT = REPO / "assets" / "img" / "red2" / "unit07"
OUT.mkdir(parents=True, exist_ok=True)

# (left, upper, right, lower) on 898×1221 source — items 1–10 in book order
BOXES = [
    (52, 106, 252, 212),
    (452, 106, 652, 212),
    (52, 218, 252, 324),
    (452, 218, 652, 324),
    (52, 330, 252, 436),
    (452, 330, 652, 436),
    (52, 442, 252, 548),
    (452, 442, 652, 548),
    (52, 554, 252, 660),
    (452, 554, 652, 660),
]


def save_compressed(im: Image.Image, path: Path, max_kb: int = 58) -> None:
    im = im.convert("RGB")
    w, h = im.size
    for scale in [1.0, 0.85, 0.72, 0.6]:
        nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
        resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
        for _q in range(85, 40, -5):
            resized.save(path, format="PNG", optimize=True, compress_level=9)
            if path.stat().st_size <= max_kb * 1024:
                return


def main() -> None:
    base = Image.open(SRC)
    for i, box in enumerate(BOXES, start=1):
        crop = base.crop(box)
        out = OUT / f"jump-a{i:02d}.png"
        save_compressed(crop, out)
        print(f"{out.name}: {out.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
