# Source pages required (천일문 Grammar 1)

Practice JSON under `data/chunilmun1/` must be built from **student book (SB)** or **workbook (WB)** page scans — not from answer keys alone.

## Rules

1. **Stems and options** — Every `promptEn`, dialogue line, and multiple-choice `choices` entry must match the printed book (spelling, punctuation, blank count).
2. **Answer keys** — Use official keys only to set `accept` / `answer` values after the stem is verified on the exercise page.
3. **Missing or illegible pages** — Stop. Do not ship guessed English. Document the gap in the chapter `CHAPTER-SOURCE.md` until the scan is available.
4. **Ch09+** — Still placeholder in places; excluded from the stem guard until a PDF batch lands.

## Scan PDFs (content)

| Upload slice | Original PDF pages | Rebuilt content |
|--------------|-------------------|-----------------|
| `ch02-04-sb` | SB 12–45 | Ch02–04 SB (+ Ch04 drives `review-01`) |
| `ch02-05-wb` | WB 161–192 | Ch02–05 WB |
| `ch05-06-sb` | SB 46–71 | Ch05–06 SB |
| `ch06-08-wb` | WB 193–220 | Ch06–08 WB (+ `review-02`) |
| `ch07-08-sb` | SB 72–99 | Ch07–08 SB |

## Answer-key PDFs (accepts only)

Full book answer-key PDF **pp. 256–319** (four uploads):

| Upload | PDF pages | Booklet / notes |
|--------|-----------|-----------------|
| `keys-part1` | 256–271 | Ch01–Ch07 through SB U1–U2 (e.g. booklet ~p. 17–18, SB p. 82) |
| `keys-part2` | 272–287 | Ch07 U3 + Ch07–08 SB tests + Ch08 SB units (booklet ~p. 18–21) |
| `keys-part3` | 288–303 | Ch01–Ch05 keys (earlier units) |
| `keys-part4` | 304–319 | Ch07–08 **WB** tests/units, Ch09+ keys |

## Regeneration (Ch02–08 verified)

From repo root:

```bash
bash scripts/chunilmun/regen_verified_ch02_08.sh
```

Or stepwise modules in `scripts/chunilmun/`:

| Module | Command |
|--------|---------|
| Ch02–03 | `python3 _extracted_ch02_ch03.py` |
| Ch04 + review-01, Ch05 WB | `python3 _extracted_ch04_ch05wb.py all` |
| Ch05–06 SB | `python3 _extracted_ch05_ch06_sb.py all` |
| Ch06–08 WB + review-02 | `python3 _extracted_ch06_08_wb.py` |
| Ch07–08 SB | `python3 _extracted_ch07_ch08_sb.py all` |
| Catalog | `node scripts/chunilmun/apply-catalog.mjs` |

Per-chapter scan notes: `data/chunilmun1/chapterNN/CHAPTER-SOURCE.md` (Ch02–08).

## CI guard

`node scripts/check-no-guessed-stems.js` scans **only** verified paths:

- `data/chunilmun1/chapter01` … `chapter08`
- `data/chunilmun1/review-01`, `review-02`

It fails on placeholder patterns, including:

- `WB8-U1-A ________.` style tags
- `choices: ["a","b","c","d"]` only
- `accept: ["answer"]`
- English stems that are only blanks
- the word `placeholder` in a stem

Wired into `smoke-chunilmun1-ch02-04.js`, `smoke-chunilmun1-ch05-08.js`, and `smoke-chunilmun1-all.js`.
