#!/usr/bin/env python3
"""Crop Jump A/B + Run B pictures from Red 1 Unit 02 page PNGs."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "_red1-u02" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit02"
OUT.mkdir(parents=True, exist_ok=True)

# Jump A — p0031.png (printed p.30)
JUMP_A_PAGE = SRC / "p0031.png"
JUMP_A_BOXES = [
    (42, 118, 228, 228),
    (42, 248, 228, 358),
    (42, 378, 228, 488),
    (42, 508, 228, 618),
    (42, 638, 228, 748),
    (452, 118, 638, 228),
    (452, 248, 638, 358),
    (452, 378, 638, 488),
    (452, 508, 638, 618),
    (452, 638, 638, 748),
]

# Jump B — p0032.png (printed p.31)
JUMP_B_PAGE = SRC / "p0032.png"
JUMP_B_BOXES = [
    (118, 108, 268, 218),
    (318, 108, 468, 218),
    (518, 108, 668, 218),
    (118, 248, 268, 358),
    (318, 248, 468, 358),
    (518, 248, 668, 358),
    (118, 388, 268, 498),
    (318, 388, 468, 498),
    (518, 388, 668, 498),
    (218, 528, 368, 638),
]

# Run B — p0030.png (printed p.29) — 11 picture squares
RUN_B_PAGE = SRC / "p0030.png"
RUN_B_BOXES = [
    (48, 108, 178, 198),
    (198, 108, 328, 198),
    (348, 108, 478, 198),
    (498, 108, 628, 198),
    (648, 108, 778, 198),
    (48, 248, 178, 338),
    (198, 248, 328, 338),
    (348, 248, 478, 338),
    (498, 248, 628, 338),
    (648, 248, 778, 338),
    (348, 388, 478, 478),
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


def crop_list(page: Path, boxes, prefix: str) -> None:
    base = Image.open(page)
    for i, box in enumerate(boxes, start=1):
        crop = base.crop(box)
        out = OUT / f"{prefix}{i:02d}.png"
        save_compressed(crop, out)
        kb = out.stat().st_size / 1024
        print(f"{out.name}: {kb:.1f} KB")


if __name__ == "__main__":
    crop_list(JUMP_A_PAGE, JUMP_A_BOXES, "jump-a")
    crop_list(JUMP_B_PAGE, JUMP_B_BOXES, "jump-b")
    crop_list(RUN_B_PAGE, RUN_B_BOXES, "run-b")
    print("Done ->", OUT)
