#!/usr/bin/env python3
"""Crop Run A picture MC images from RedZap 2 Unit 03 page 47 (p0047.png)."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = Path("/tmp/red2-u03/pages/p0047.png")
OUT = REPO / "assets" / "img" / "red2" / "unit03"
OUT.mkdir(parents=True, exist_ok=True)

# (left, upper, right, lower) tuned for 898×1221 source
RUN_A_BOXES = [
    (48, 92, 248, 192),
    (48, 202, 248, 302),
    (48, 312, 248, 412),
    (48, 422, 248, 522),
    (48, 532, 248, 632),
    (48, 642, 248, 742),
    (48, 752, 248, 852),
    (48, 862, 248, 962),
    (48, 972, 248, 1072),
    (48, 1082, 248, 1182),
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
    base = Image.open(SRC)
    for i, box in enumerate(RUN_A_BOXES, start=1):
        crop = base.crop(box)
        out = OUT / f"run-a{i:02d}.png"
        save_compressed(crop, out)
        print(f"{out.name}: {out.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
