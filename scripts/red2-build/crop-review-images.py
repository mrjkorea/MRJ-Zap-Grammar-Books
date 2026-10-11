#!/usr/bin/env python3
"""Crop Review picture items for RedZap 2; compress <60KB."""
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "assets" / "img" / "red2"
OUT.mkdir(parents=True, exist_ok=True)


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


def crop(page: Path, box, rel: str) -> None:
    im = Image.open(page).crop(box)
    out = OUT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    save_compressed(im, out)
    print(out.relative_to(REPO), f"{out.stat().st_size / 1024:.1f} KB")


# Review 02 p0071 — dog on car, ball under table
rv02 = Path("/tmp/red2-rv02_994d/pages/p0071.png")
crop(rv02, (55, 318, 248, 458), "review02/rv14.png")
crop(rv02, (55, 488, 248, 628), "review02/rv15.png")

# Review 05 p0165 — swim / jump
rv05a = Path("/tmp/red2-rv05_ca3a/pages/p0165.png")
crop(rv05a, (55, 118, 248, 268), "review05/rv01.png")
crop(rv05a, (55, 288, 248, 438), "review05/rv02.png")

# Review 05 p0167 — don't sit / don't swim
rv05b = Path("/tmp/red2-rv05_ca3a/pages/p0167.png")
crop(rv05b, (55, 118, 248, 268), "review05/rv11.png")
crop(rv05b, (55, 318, 248, 468), "review05/rv12.png")
