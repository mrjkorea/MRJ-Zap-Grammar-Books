#!/usr/bin/env bash
# Regenerate scan-verified 천일문 Grammar 1 JSON for Ch02–08 + review-01/02.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "== Ch02–03 SB + WB =="
python3 _extracted_ch02_ch03.py

echo "== Ch04 SB + review-01, Ch05 WB =="
python3 _extracted_ch04_ch05wb.py all

echo "== Ch05–06 SB =="
python3 _extracted_ch05_ch06_sb.py all

echo "== Ch06–08 WB + review-02 =="
python3 _extracted_ch06_08_wb.py

echo "== Ch07–08 SB =="
python3 _extracted_ch07_ch08_sb.py all

echo "== catalog =="
node apply-catalog.mjs

echo "== checks =="
cd ../..
node scripts/check-no-guessed-stems.js
node scripts/smoke-chunilmun1-ch02-04.js
node scripts/smoke-chunilmun1-ch05-08.js
node scripts/smoke-chunilmun1-all.js

echo "regen_verified_ch02_08: OK"
