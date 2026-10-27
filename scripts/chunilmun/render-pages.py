#!/usr/bin/env python3
"""Render PDF pages to PNG for OCR / vision (gitignored output)."""
from __future__ import annotations

import argparse
import os
import sys

try:
    import pymupdf
except ImportError:
    print("pip install pymupdf", file=sys.stderr)
    raise


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", default=os.path.join(os.path.dirname(__file__), "../../.local/chunilmun.pdf"))
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "../../.local/chunilmun-pages"))
    ap.add_argument("--from", dest="from_page", type=int, default=1, help="1-based PDF page")
    ap.add_argument("--to", dest="to_page", type=int, default=0, help="1-based inclusive; 0 = all")
    ap.add_argument("--scale", type=float, default=2.0)
    args = ap.parse_args()

    if not os.path.isfile(args.pdf):
        print("Missing PDF:", args.pdf, file=sys.stderr)
        return 1

    os.makedirs(args.out, exist_ok=True)
    doc = pymupdf.open(args.pdf)
    last = args.to_page or doc.page_count
    last = min(last, doc.page_count)
    mat = pymupdf.Matrix(args.scale, args.scale)
    for pno in range(args.from_page - 1, last):
        page = doc[pno]
        pix = page.get_pixmap(matrix=mat)
        name = f"p-{pno + 1:03d}.png"
        path = os.path.join(args.out, name)
        pix.save(path)
        print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
