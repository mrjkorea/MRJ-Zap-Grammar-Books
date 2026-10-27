#!/usr/bin/env bash
# Regenerate scan-verified 천일문 Grammar 1 JSON for Ch09–12 (+ review when ready).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "== Ch09–10 SB =="
python3 _extracted_ch09_ch10_sb.py

echo "== Ch09–10 WB =="
python3 _extracted_ch09_ch10_wb.py

echo "== Ch11–12 SB + WB (placeholder) =="
# python3 _extracted_ch11_ch12_sb.py
# python3 _extracted_ch11_ch12_wb.py

echo "== catalog =="
node apply-catalog.mjs

echo "== checks =="
cd ../..
node scripts/check-no-guessed-stems.js
node scripts/smoke-chunilmun1-ch09-12.js

echo "regen_verified_ch09_12: OK"
