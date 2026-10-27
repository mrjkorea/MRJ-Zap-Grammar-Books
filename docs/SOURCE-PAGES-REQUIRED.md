# Source pages required (천일문 Grammar 1)

Practice JSON under `data/chunilmun1/` must be built from **student book (SB)** or **workbook (WB)** page scans or images — not from answer keys alone.

## Rules

1. **Stems and options** — Every `promptEn`, dialogue line, and multiple-choice `choices` entry must match the printed book (spelling, punctuation, blank count).
2. **Answer keys** — Use official keys only to set `accept` / `answer` values after the stem is verified on the page.
3. **Missing or illegible pages** — Stop. Do not ship guessed English. Leave a note in the chapter `CHAPTER-SOURCE.md` or keep `CHAPTER-UNCERTAIN.md` until the scan is available.
4. **Regeneration** — Scan-verified modules live in `scripts/chunilmun/_extracted_*.py` (e.g. `_extracted_ch02_ch03.py`, `_extracted_ch04_ch05wb.py`, `_extracted_ch05_ch06_sb.py`, `_extracted_ch06_08_wb.py`). Run them after editing, then run smoke tests.

## CI guard

`node scripts/check-no-guessed-stems.js` fails on placeholder patterns (`WB8-U1-A ________.`, `choices: ["a","b","c","d"]`, `accept: ["answer"]`, blank-only stems).
