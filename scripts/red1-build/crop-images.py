#!/usr/bin/env python3
"""Crop Jump B + Fly B pictures from unit page PNGs; compress <60KB."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "audit-pages" / "pages"
if not SRC.exists():
    SRC = REPO / "red1-u01-extract" / "pages"
OUT = REPO / "assets" / "img" / "red1" / "unit01"
OUT.mkdir(parents=True, exist_ok=True)

# Jump B (PDF p18 / p0018.png): odd items left col, even right; 6 rows × 2 cols
JUMP_PAGE = SRC / "p0018.png"
JUMP_LEFT_Y = [232, 388, 544, 699, 856, 1012]
JUMP_BOXES = []
for i, y in enumerate(JUMP_LEFT_Y):
    n = i * 2 + 1
    JUMP_BOXES.append((n, (78, y - 15, 262, y + 85)))
    n2 = i * 2 + 2
    JUMP_BOXES.append((n2, (478, y - 15, 662, y + 85)))

# Fly B (PDF p20 / p0020.png): item numbers 1–10, two columns
FLY_PAGE = SRC / "p0020.png"
FLY_ROW_Y = [218, 414, 609, 791, 982]
FLY_BOXES = []
for i, y in enumerate(FLY_ROW_Y):
    n = i * 2 + 1
    FLY_BOXES.append((n, (58, y - 20, 210, y + 100)))
    n2 = i * 2 + 2
    FLY_BOXES.append((n2, (468, y - 20, 620, y + 100)))


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


def crop_list(page: Path, numbered_boxes, prefix: str) -> None:
    base = Image.open(page)
    for num, box in numbered_boxes:
        crop = base.crop(box)
        out = OUT / f"{prefix}{num:02d}.png"
        save_compressed(crop, out)
        kb = out.stat().st_size / 1024
        print(f"{out.name}: {kb:.1f} KB")


if __name__ == "__main__":
    crop_list(JUMP_PAGE, JUMP_BOXES, "jump-b")
    crop_list(FLY_PAGE, FLY_BOXES, "fly-b")
    print("Done ->", OUT)
