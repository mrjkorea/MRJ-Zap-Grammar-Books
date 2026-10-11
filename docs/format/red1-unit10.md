# RedZap 1 — Unit 10 be동사의 부정문과 의문문 (2)

Printed pages **150–163** (PDF **151–164**). Skipped: comics (p.150–151), concept + Check Up (p.152–153), comic-only QUIZ 1 & 3 (p.162–163).

## Boundary (why the zip has 17 PNGs)

`RED-UNITS.txt` lists Unit 10 as PDF 151–166 (16 pages), but **REVIEW 05 begins on PDF 165** (printed p.164, `p0165.png`). Unit 10 graded content ends with **QUIZ 4** on PDF **164** (`p0164.png`). **`p0167.png` is still Review 05** (not Unit 10). This part excludes PDF **165–167**.

| PDF | Printed | Content |
|-----|---------|---------|
| 151–152 | 150–151 | Comic (skip) |
| 153–154 | 152–153 | Grammar Point + Check Up (skip) |
| 155–156 | 154–155 | Grammar Walk A, B |
| 157–158 | 156–157 | Grammar Run A, B |
| 159–160 | 158–159 | Grammar Jump A, B |
| 161–162 | 160–161 | Grammar Fly A, B |
| 163 | 162 | QUIZ 1 comic (skip) |
| 163–164 | 162–163 | QUIZ 2 table (graded) |
| 164 | 163 | QUIZ 3 comic (skip) |
| 164 | 163–164 | QUIZ 4 table (graded) |
| 165+ | 164+ | **Review 05** (separate part) |

## Page-type → app mode

| Pages | Section | Book activity | App mode |
|-------|---------|---------------|----------|
| Walk A | trace negative sentences | **match** (trace chunk ↔ rest) |
| Walk B | trace Q&A dialogues | **match** (A question ↔ B answer) |
| Run A | circle be+not | **choice** (pick the circled phrase) |
| Run B | it / they | **choice** |
| Jump A | is not / are not, isn't / aren't | **choice** |
| Jump B | Is/Are + short answers | **choice** |
| Fly A | rewrite as negative | **words** (1–2 blanks) |
| Fly B | dialogue blanks | **words** |
| QUIZ 2 | negative table | **words** (3 blanks; row 1 is display in book) |
| QUIZ 4 | question table | **words** (4 blanks) |

## Practices (6)

| Slug | practiceId | Graded items | Sections | Notes |
|------|------------|--------------|----------|-------|
| walk | `r1:u10:walk` | 4 | A×2 match, B×2 match | 10+10 pairs; max 7 per card |
| run | `r1:u10:run` | 18 | A×9 MC, B×9 MC | A1/B1 display-only |
| jump | `r1:u10:jump` | 18 | A×9 MC, B×9 MC | A1/B1 display-only |
| fly | `r1:u10:fly` | 16 | A×8 words, B×8 words | A1,A6,B1,B6 display-only |
| quiz2 | `r1:u10:quiz2` | 3 | A×3 words | Book row “This…” filled; blanks 1–3 on That/These/Those |
| quiz4 | `r1:u10:quiz4` | 4 | A×4 words | that / it / Are / they aren't |

**63 graded items**; Walk match contributes **20 pair-level** score points.

## Deep links

- `#/p/zap-red-1/unit-10/walk`
- `#/p/zap-red-1/unit-10/run`
- `#/p/zap-red-1/unit-10/jump`
- `#/p/zap-red-1/unit-10/fly`
- `#/p/zap-red-1/unit-10/quiz2`
- `#/p/zap-red-1/unit-10/quiz4`

## Uncertain / judgment calls

- **Walk trace**: No Korean glosses on the page; match uses **gray trace portion ↔ black remainder** (A) and **question ↔ answer** (B), not invented Korean.
- **Run A “circle”**: Implemented as **choose the be+not fragment** (same gradable target as circling).
- **QUIZ 2**: First table row (This…) is complete in the book → not graded; three numbered blanks in the book map to items 1–3.
- **Fly A item 6**: Book uses contraction **isn't**; **is not** also accepted.

## Generator

- `node scripts/red1-build/unit10-generate.js`
- `node scripts/smoke-red1-unit10.js`
