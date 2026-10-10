# BlueZap 3 — Unit 03 page map (`there, it`)

PDF page = file `pNNNN.png`; **printed page ≈ PDF − 1**. Unit 03 spans PDF **61–86** (printed **60–85**). PDF **87** begins Unit 04.

| PDF | Printed | Type | App file | Timer |
|-----|---------|------|----------|-------|
| 61–63 | 60–62 | Comic + concept (There is/are) | — | — |
| 64 | 63 | Grammar Walk L1 A/B (circle there+be; circle location) | `lesson01-walk1.json` | 10 |
| 65 | 64 | Concept (Is/Are there) | — | — |
| 66 | 65 | Grammar Walk L1 A/B (Is/Are there; Yes answers) | `lesson01-walk2.json` | 10 |
| 67–68 | 66–67 | Grammar Run (MC + dialogue blanks) | `lesson01-run.json` | 18 |
| 69–70 | 68–69 | Grammar Jump (multi-blank; transform) | `lesson01-jump.json` | 22 |
| 71–72 | 70–71 | Grammar Fly (correct word; write sentences) | `lesson01-fly.json` | 26 |
| 73 | 72 | Concept (impersonal **it**) | — | — |
| 74 | 73 | Grammar Walk L2 (circle **it**; weather/day MC) | `lesson02-walk1.json` | 10 |
| 75 | 74 | Concept (It is time for/to) | — | — |
| 76 | 75 | Grammar Walk L2 (time; for/to match) | `lesson02-walk2.json` | 10 |
| 77–78 | 76–77 | Grammar Run (MC + circle MC) | `lesson02-run.json` | 18 |
| 79–80 | 78–79 | Grammar Jump (Korean fill; multi-blank **it**) | `lesson02-jump.json` | 22 |
| 81–82 | 80–81 | Grammar Fly (write sentences + word bank) | `lesson02-fly.json` | 26 |
| 83–85 | 82–84 | Review 03 (items 1–20) | `review03.json` | 30 |
| 86 | 85 | Wrap Up summary | — | — |

## Exercise adaptations

| Book activity | App `type` | `answerMode` |
|---------------|------------|--------------|
| Circle there+be / location / it | `fill` | `words` — student types circled phrase only |
| Underlined subject in Walk A | `<u>` in `promptEn` (display only; not typed) | — |
| Match Yes there is/are | `mc`, choices `a.` / `b.` in book order | `choice` |
| Parenthesis MC / Run B numbered options | `mc` | `choice` |
| Dialogue blanks | `fill`, `blanks` when multiple | `words` |
| Sentence transforms / writes | `sentence` | `sentence` |
| Error correction (one word) | `fill` | `words` |
| Review `[n–m]` banners | section ids `1-2`, …; labels `1`–`20` | per item |

## Metadata (all Unit 03 practices)

- `bookId`: `zap-blue-3`, `appName`: `BlueZap 3`, `unitId`: `unit-03`, `unitTitle`: `Unit 03 — there, it`
- `practiceId` prefix: `b3:u03:`
- `sectionsVersion`: `2`

## Smoke test

```bash
node scripts/smoke-blue3-unit03.js
```
