# Source pages required (천일문 Grammar 1)

Practice JSON under `data/chunilmun1/` must be built from **student book (SB)** or **workbook (WB)** page scans — not from answer keys alone.

## Rules

1. **Stems and options** — Every `promptEn`, dialogue line, and multiple-choice `choices` entry must match the printed book (spelling, punctuation, blank count).
2. **Answer keys** — Use official keys only to set `accept` / `answer` values after the stem is verified on the exercise page.
3. **Missing or illegible pages** — Stop. Do not ship guessed English. Document the gap in the chapter `CHAPTER-SOURCE.md` until the scan is available.
4. **Ch11–12** — Stems from `ch11-12-sb` / `ch11-12-wb` scans; WB accepts aligned with `keys-part4`; SB chapter tests still UNCERTAIN where keys-part4 has no SB slice.
5. **총괄평가 reviews** — Stems from `review-01-pages` … `review-03-pages` (workbook 총괄평가); see each `data/chunilmun1/review-0N/CHAPTER-SOURCE.md`.

## Scan PDFs (content)

| Upload slice | Original PDF pages | Rebuilt content |
|--------------|-------------------|-----------------|
| `ch01-sb` | SB 12–17 | Ch01 SB (Unit 1–2 + chapter test) |
| `ch01-wb` | WB 2–7 | Ch01 WB (units + chapter test) |
| `ch02-04-sb` | SB 12–45 | Ch02–04 SB (+ Ch04 drives `review-01`) |
| `ch02-05-wb` | WB 161–192 | Ch02–05 WB |
| `ch05-06-sb` | SB 46–71 | Ch05–06 SB |
| `ch06-08-wb` | WB 193–220 | Ch06–08 WB (+ `review-02`) |
| `ch07-08-sb` | SB 72–99 | Ch07–08 SB |
| `ch09-10-sb` | SB 100–135 (slice) | Ch09–10 SB |
| `ch09-10-wb` | WB 68–90 (slice) | Ch09–10 WB |
| `ch11-12-sb` | SB 137–157 (slice) | Ch11–12 SB |
| `ch11-12-wb` | WB 84–97 (slice) | Ch11–12 WB |
| `review-01-pages` | PDF 181–184 | 총괄평가 1회 (WB 28–31) |
| `review-02-pages` | PDF 217–220 | 총괄평가 2회 (WB 64–67) |
| `review-03-pages` | PDF 251–254 | 총괄평가 3회 (WB 98–101) |

## Answer-key PDFs (accepts only)

Full book answer-key PDF **pp. 256–319** (four uploads):

| Upload | PDF pages | Booklet / notes |
|--------|-----------|-----------------|
| `keys-part1` | 256–271 | Ch01–Ch07 through SB U1–U2 (e.g. booklet ~p. 17–18, SB p. 82) |
| `keys-part2` | 272–287 | Ch07 U3 + Ch07–08 SB tests + Ch08 SB units (booklet ~p. 18–21) |
| `keys-part3` | 288–303 | Ch01–Ch05 keys (earlier units) |
| `keys-part4` | 304–319 | Ch07–08 **WB** tests/units, Ch09+ keys |

## Regeneration (Ch01–08 verified)

From repo root:

```bash
bash scripts/chunilmun/regen_verified_ch01_08.sh
```

## Regeneration (Ch09–12)

```bash
bash scripts/chunilmun/regen_verified_ch09_12.sh
```

Includes `_extracted_ch11_ch12_sb.py` and `_extracted_ch11_ch12_wb.py`.

Or stepwise modules in `scripts/chunilmun/`:

| Module | Command |
|--------|---------|
| Ch01 | `python3 _extracted_ch01.py` |
| Ch02–03 | `python3 _extracted_ch02_ch03.py` |
| Ch04 + review-01, Ch05 WB | `python3 _extracted_ch04_ch05wb.py all` |
| Ch05–06 SB | `python3 _extracted_ch05_ch06_sb.py all` |
| Ch06–08 WB + review-02 | `python3 _extracted_ch06_08_wb.py` |
| Ch07–08 SB | `python3 _extracted_ch07_ch08_sb.py all` |
| Catalog | `node scripts/chunilmun/apply-catalog.mjs` |

Per-chapter scan notes: `data/chunilmun1/chapterNN/CHAPTER-SOURCE.md` (Ch01–12).

Per-review scan notes: `data/chunilmun1/review-0N/CHAPTER-SOURCE.md` (review-01–03).

## CI guard

`node scripts/check-no-guessed-stems.js` scans **only** verified paths:

- `data/chunilmun1/chapter01` … `chapter12`
- `data/chunilmun1/review-01`, `review-02`, `review-03`

It fails on placeholder patterns, including:

- `WB8-U1-A ________.` style tags
- `choices: ["a","b","c","d"]` only
- `accept: ["answer"]`
- English stems that are only blanks
- multiple-choice items with empty `promptEn`
- the word `placeholder` in a stem

Also flags single-word **type-in leaks** (accept token visible in `promptEn` without blanks), excluding OX `<u>` items.

Wired into `smoke-chunilmun1-ch02-04.js`, `smoke-chunilmun1-ch05-08.js`, `smoke-chunilmun1-ch09-12.js`, and `smoke-chunilmun1-all.js`.
