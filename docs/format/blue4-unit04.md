# ZAP Blue 4 — Unit 04 (비교 — 비교급)

Book metadata (all practices): `bookId` **zap-blue-4**, `appName` **BlueZap 4**, `unitId` **unit-04**, `sectionsVersion` **2**, `practiceId` prefix **b4:u04:**

Page map uses **PDF page** (image `pNNNN.png`). **Printed page ≈ PDF − 1** unless noted.

| PDF | Printed | Type | App practice | Notes |
|-----|---------|------|--------------|-------|
| 87–88 | 86–87 | Comic + concept intro | No | Unit opener |
| 89 | 88 | Concept (비교급 만들기 1) | No | Rules |
| 90 | 89 | **Grammar Walk** A+B | `lesson01-walk1` | Find comparative; 10 forms |
| 91 | 90 | Concept (비교급 만들기 2) | No | -e, -y, double consonant |
| 92 | 91 | **Grammar Walk** A | `lesson01-walk2` | 20 comparative forms |
| 93 | 92 | **Grammar Run** A | `lesson01-run` (A) | MC parentheses |
| 94 | 93 | **Grammar Run** B | `lesson01-run` (B) | MC blank + Korean gloss |
| 95 | 94 | **Grammar Jump** A | `lesson01-jump` (A) | Korean meaning of comparative |
| 96 | 95 | **Grammar Jump** B | `lesson01-jump` (B) | Fill comparative in sentence |
| 97 | 96 | **Grammar Fly** A | `lesson01-fly` (A) | Fix underlined spelling |
| 98 | 97 | **Grammar Fly** B | `lesson01-fly` (B) | Rewrite with comparative |
| 99 | 98 | Concept (비교급 만들기 3) | No | more + adj/adv; irregular |
| 100 | 99 | **Grammar Walk** A+B | `lesson02-walk1` | Find comparative; more/irregular |
| 101 | 100 | Concept (비교급 + than) | No | than position rules |
| 102 | 101 | **Grammar Walk** A+B | `lesson02-walk2` | comparative+than; than position MC |
| 103 | 102 | **Grammar Run** A | `lesson02-run` (A) | MC |
| 104 | 103 | **Grammar Run** B | `lesson02-run` (B) | MC |
| 105 | 104 | **Grammar Jump** A | `lesson02-jump` (A) | Rewrite sentence |
| 106 | 105 | **Grammar Jump** B | `lesson02-jump` (B) | Complete than sentences |
| 107 | 106 | **Grammar Fly** A | `lesson02-fly` (A) | Fix underlined errors |
| 108 | 107 | **Grammar Fly** B | `lesson02-fly` (B) | Unscramble (10 items) |
| 109–111 | 108–110 | **Review 04** | `review-04` | Items 1–20 |
| 111 | 110 | Check Check score table | No | Not graded |
| 112 | 111 | **Wrap Up** summary | No | Display-only tables |
| 113 | 112 | Next unit preview | No | **Excluded** — unit ends at Wrap (PDF 112) |

## Timers

| Practice | Minutes |
|----------|---------|
| Lesson 01–02 Walk 1–2 | 10 |
| Lesson 01–02 Run | 18 |
| Lesson 01–02 Jump | 22 |
| Lesson 01–02 Fly | 24 |
| Review 04 | 30 |

## Graded item counts (excluding examples)

| File | Graded items |
|------|----------------|
| `lesson01-walk1.json` | 13 |
| `lesson01-walk2.json` | 19 |
| `lesson01-run.json` | 29 |
| `lesson01-jump.json` | 28 |
| `lesson01-fly.json` | 28 |
| `lesson02-walk1.json` | 13 |
| `lesson02-walk2.json` | 8 |
| `lesson02-run.json` | 29 |
| `lesson02-jump.json` | 28 |
| `lesson02-fly.json` | 23 |
| `review-04.json` | 20 |
| **Total** | **238** |

## Build

Source: `/tmp/blue4-pages/blue4/pages/` OCR + page images. Regenerate JSON:

```bash
python3 scripts/blue4-build-unit04.py
node scripts/smoke-blue4-unit04.js
```
