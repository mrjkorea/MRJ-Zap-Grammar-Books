#!/usr/bin/env python3
"""Crop Review picture items for RedZap 2; compress <60KB."""
from pathlib import Path
import os
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "assets" / "img" / "red2"
OUT.mkdir(parents=True, exist_ok=True)

PAGES = Path(
    os.environ.get(
        "RED2_REVIEW_PAGES",
        "/tmp/red2-audit/pages",
    )
)


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


def main() -> None:
    if not PAGES.is_dir():
        raise SystemExit(f"Page PNG folder not found: {PAGES}")

    rv02 = PAGES / "p0071.png"
    crop(rv02, (45, 748, 255, 898), "review02/rv14.png")
    crop(rv02, (45, 958, 255, 1108), "review02/rv15.png")

    rv05a = PAGES / "p0165.png"
    crop(rv05a, (125, 190, 305, 350), "review05/rv01.png")
    crop(rv05a, (555, 195, 672, 348), "review05/rv02.png")

    rv05b = PAGES / "p0167.png"
    crop(rv05b, (90, 175, 305, 340), "review05/rv11.png")
    crop(rv05b, (90, 340, 305, 505), "review05/rv12.png")


if __name__ == "__main__":
    main()
