# RedZap 2 — Unit 07 현재 진행형

Printed pages **104–117** (PDF **105–118**). **Excluded:** PDF 119 / `p0119` (next unit: 부정문·의문문). Skipped: comics, concept + Check Up, comic-only QUIZ panels.

## Page types

| Pages | Type | App |
|-------|------|-----|
| 105–106 | Comic | — |
| 107–108 | Concept + Check Up | — |
| 108–109 | Walk A,B | `walk` (match) |
| 110–111 | Run A,B | `run` (words + match) |
| 112–113 | Jump A,B | `jump` (choice) |
| 114–115 | Fly A,B | `fly` (words) |
| 116 | QUIZ comic + table | `quiz1` (words) |
| 117 | QUIZ comic + table | `quiz2` (words) |

## Practices (6)

| Slug | practiceId | Graded items | Sections | Modes |
|------|------------|--------------|----------|-------|
| walk | `r2:u07:walk` | 4 match cards (30 pairs) | A×2, B×2 | match |
| run | `r2:u07:run` | 11 | A×9 words, B×2 match | words, match |
| jump | `r2:u07:jump` | 19 | A×10 MC, B×9 MC | choice |
| fly | `r2:u07:fly` | 28 | A×19 words, B×9 words (2 blanks) | words |
| quiz1 | `r2:u07:quiz1` | 5 (+1 example) | A×5 | words |
| quiz2 | `r2:u07:quiz2` | 6 | A×6 | words |

**73 graded items**; Walk/Run match sections contribute **30 pair-level** score points.

## Deep links

- `#/p/zap-red-2/unit-07/walk`
- `#/p/zap-red-2/unit-07/run`
- `#/p/zap-red-2/unit-07/jump`
- `#/p/zap-red-2/unit-07/fly`
- `#/p/zap-red-2/unit-07/quiz1`
- `#/p/zap-red-2/unit-07/quiz2`

## Notes

- Walk A: Korean sentence meaning ↔ English sentence (trace dropped).
- Walk B / Run B: verb ↔ -ing (trace and rule lines dropped; Run B connection step → match).
- Run A: “circle present continuous” → type `be + V-ing` phrase only.
- Jump A: cropped pictures `assets/img/red2/unit07/jump-a01.png` … `jump-a10.png`.
- Fly B: two ordered blanks (`be|V-ing`), not full sentence.
- QUIZ tables only; 만화 review strips are not graded.

## Generator

- `node scripts/red2-build/unit07-generate.js`
- `python3 scripts/red2-build/crop-unit07-jump.py` (needs page PNG at `/tmp/red2-u07/pages/p0113.png` or adjust `SRC` in script)
