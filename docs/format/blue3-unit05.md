# ZAP Blue 3 — Unit 05 page map (의문사 2)

PDF page = scanned file `pNNNN.png`; **printed page ≈ PDF − 1**.

| PDF | Printed | Type | App file | Timer |
|-----|---------|------|----------|-------|
| 113 | 112 | Comic + unit opener | — (not graded) | — |
| 114 | 113 | Concept (when / where) | — | — |
| 115 | 114 | Concept (how / why) | — | — |
| 116 | 115 | **Grammar Walk — Lesson 01** (circle when/where; match meanings) | `lesson01-walk1.json` | 10 |
| 117 | 116 | Concept | — | — |
| 118 | 117 | **Grammar Walk — Lesson 01** (circle how/why; match meanings) | `lesson01-walk2.json` | 10 |
| 119–120 | 118–119 | **Grammar Run** (MC parentheses + answer MC) | `lesson01-run.json` | 18 |
| 121–122 | 120–121 | **Grammar Jump** (fill interrogatives in dialogues) | `lesson01-jump.json` | 25 |
| 123–124 | 122–123 | **Grammar Fly** (error correction + complete questions) | `lesson01-fly.json` | 28 |
| 125 | 124 | Concept (how many / how much) | — | — |
| 126 | 125 | **Grammar Walk — Lesson 02** (how many\|noun; many vs much) | `lesson02-walk1.json` | 10 |
| 127 | 126 | Concept (how + adj/adv) | — | — |
| 128 | 127 | **Grammar Walk — Lesson 02** (circle how phrases; match meanings) | `lesson02-walk2.json` | 10 |
| 129–130 | 128–129 | **Grammar Run** | `lesson02-run.json` | 20 |
| 131–132 | 130–131 | **Grammar Jump** (category words + how fills) | `lesson02-jump.json` | 25 |
| 133–134 | 132–133 | **Grammar Fly** | `lesson02-fly.json` | 28 |
| 135–137 | 134–136 | **Review 05** (items 1–20) | `review-05.json` | 30 |
| 138 | 137 | Check Check score table on Review | — (not graded) | — |
| 139+ | 138+ | Next unit preview | — | — |

## Regenerate

```bash
node scripts/generate-blue3-unit05.js
```

Writes `data/blue3/unit05/*.json` (`practiceId` prefix `b3:u05:`).

## Schema

`sectionsVersion: 2` — same shape as `data/blue1/unit01/*.json` and `data/green3/unit01/*.json` (section metadata, per-item `sectionInstructionKo`, `promptKo` on English prompts).
