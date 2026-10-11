# RedZap 1 — Unit 03 명사 (2)

Printed pages **40–53** (PDF 41–54). **Excluded:** p0055 (PDF 55) = Unit 04 comic opener. Skipped: comics (p.40–41), concept + Check Up (p.42–43), QUIZ comic-only parts (p.52 §1, p.53 §3).

## Page map

| PDF | Printed | Type | Web |
|-----|---------|------|-----|
| 41–42 | 40–41 | Comic | — |
| 43–44 | 42–43 | Grammar Point + Check Up | — |
| 45–46 | 44–45 | Grammar Walk A–B | `walk` (match) |
| 47–48 | 46–47 | Grammar Run A–B | `run` (words + match) |
| 49–50 | 48–49 | Grammar Jump A–B | `jump` (choice + images) |
| 51–52 | 50–51 | Grammar Fly A–B | `fly` (words + sentence) |
| 53 | 52 | QUIZ §1 comic, §2 table | `quiz2` |
| 54 | 53 | QUIZ §3 comic, §4 table | `quiz4` |

## Practices (6)

| Slug | practiceId | Graded items | Sections | Modes |
|------|------------|--------------|----------|-------|
| walk | `r1:u03:walk` | 4 | A×2 match, B×2 match | Walk trace → **match** (4 pairs per item) |
| run | `r1:u03:run` | 12 | A×10 words, B×2 match | Run A: trace dropped, plural **words**; B: line match → **match** |
| jump | `r1:u03:jump` | 18 | A×9 MC, B×9 MC | Picture MC; 1 display-only example per section |
| fly | `r1:u03:fly` | 18 | A×9 words, B×9 sentence | A: plural only; B: `two wolves` style full phrase |
| quiz2 | `r1:u03:quiz2` | 7 | A×7 (3 blanks) | Table rows 2–8: 뜻 \| 복수형 \| 복수 뜻 |
| quiz4 | `r1:u03:quiz4` | 7 | A×7 (3 blanks) | Table rows 2–8 (irregular nouns) |

**66 graded items**; Walk + Run B contribute **26 match pair** score points.

## Deep links

- `#/p/zap-red-1/unit-03/walk`
- `#/p/zap-red-1/unit-03/run`
- `#/p/zap-red-1/unit-03/jump`
- `#/p/zap-red-1/unit-03/fly`
- `#/p/zap-red-1/unit-03/quiz2`
- `#/p/zap-red-1/unit-03/quiz4`

## Generator

- `node scripts/red1-build/unit03-generate.js`
- `python3 scripts/red1-build/unit03-crop-images.py` (page PNGs under `red1-u03-extract/pages/`)

## Uncertain / notes

- **Run A** book step links each singular to **-s / -es / -ies** then traces the plural; web grades **plural spelling only** (trace + rule lines omitted).
- **Walk** trace pages → **한글 뜻 ↔ 영어 복수형** match (book Korean where printed; standard gloss otherwise). Run B stays **단수↔복수** English match per the book.
- **Quiz** Korean accepts common synonyms (e.g. **계란/달걀**, **접시/그릇**, **쥐/생쥐**) with matching **~들** plural glosses.
- **Fly B** item 10 crop retuned after first pass (row spacing).
