# RedZap 1 — Unit 02 명사 (1)

Printed pages **22–35** (PDF **23–36**). Boundary: **p0037** (REVIEW 01) is the next part — excluded. Skipped: comics (p.22–23), concept + Check Up (p.24–25), comic-only QUIZ panels (p.34 §1, p.35 §3).

## Page map

| PDF | Printed | Type | Web |
|-----|---------|------|-----|
| 23–24 | 22–23 | Comic | — |
| 25 | 24 | Concept + Check Up | — |
| 26 | 25 | Concept + Check Up | — |
| 27–28 | 26–27 | Grammar Walk A–C | `walk` (match) |
| 29 | 28 | Grammar Run A | `run` A (match) |
| 30 | 29 | Grammar Run B | `run` B (choice C/U) |
| 31 | 30 | Grammar Jump A | `jump` A (choice + image) |
| 32 | 31 | Grammar Jump B | `jump` B (choice + image) |
| 33 | 32 | Grammar Fly A | `fly` A (words) |
| 34 | 33 | Grammar Fly B | `fly` B (words) |
| 35 | 34 | QUIZ 2 table | `quiz2` (2 blanks: 뜻 \| 구분) |
| 36 | 35 | QUIZ 4 table | `quiz4` (2 blanks: 뜻 \| C/U) |

## Practices (6)

| Slug | practiceId | Graded items | Sections | Modes |
|------|------------|--------------|----------|-------|
| walk | `r1:u02:walk` | 4 | A×2, B×1, C×1 | Walk trace → **match** (EN↔KO or EN↔category); 20 pair-level points |
| run | `r1:u02:run` | 12 | A×2 match, B×10 choice | Run A: noun→종류 (girl/man examples omitted); B: C/U |
| jump | `r1:u02:jump` | 18 | A×9, B×9 | MC + cropped images |
| fly | `r1:u02:fly` | 36 | A×19, B×17 | Word bank → one word per blank (girl/bag examples); `wordBank` / `wordBankB` |
| quiz2 | `r1:u02:quiz2` | 7 | A×7 | 2 blanks per row (뜻, 구분) |
| quiz4 | `r1:u02:quiz4` | 7 | A×7 | 2 blanks per row (뜻, C/U) |

**84 graded items**; Walk+Run match contributes **28 pair-level** score points.

## Deep links

- `#/p/zap-red-1/unit-02/walk`
- `#/p/zap-red-1/unit-02/run`
- `#/p/zap-red-1/unit-02/jump`
- `#/p/zap-red-1/unit-02/fly`
- `#/p/zap-red-1/unit-02/quiz2`
- `#/p/zap-red-1/unit-02/quiz4`

## Generator & assets

- `node scripts/red1-build/unit02-generate.js`
- `python3 scripts/red1-build/crop-images-unit02.py` (expects `_red1-u02/pages/p0030–p0032.png`)
- `node scripts/smoke-red1-unit02.js`

## Uncertain / notes

- **tree** (QUIZ 2): answer key uses 구분 **(식물)** while the unit teaches five kinds including **동물·식물** — accept includes both.
- **Fly A/B**: book uses one word bank per side; web uses one graded blank per slot (book order preserved within each list).
- **Jump B** network layout: graded as independent MC items (same as book circles).
