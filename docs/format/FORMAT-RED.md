# ZAP Red (RedZap) — data format notes

Red books use catalog ids **`zap-red-1`** / **`zap-red-2`**, app names **RedZap 1** / **RedZap 2**, and `practiceId` prefix **`r1:`** / **`r2:`**.

## Units vs Blue/Green

- Red units are shorter (often ~14 PDF pages): one **Walk / Run / Jump / Fly** set per unit, optional **QUIZ** pages, no per-lesson Walk splits.
- **Review** blocks live after every two units under `data/redN/reviewNN/` (not inside a single unit folder).
- Directions are **Korean only** on the page; there are usually no English glosses beside vocabulary.
- Many book activities are trace, circle, or line-match; the web app maps these to **choose**, **words**, **sentence**, or **match** as approved per unit.

## Sections (`sectionsVersion`, `sections[]`)

Same schema as Green/Blue:

- `id`: `A`, `B`, `C` … numbering restarts per practice.
- `instructionKo` / per-item `sectionInstructionKo` (required).
- `answerMode`: `choice` | `words` | `sentence` | **`match`**
- `itemCount` = graded items (not display-only examples).
- Book examples: `example: true`, `displayOnly: true`, `exampleAnswer` — never graded.

## `answerMode: "match"`

One graded item = one match card with a left column and a right column.

```json
{
  "id": "a01",
  "type": "match",
  "answerMode": "match",
  "answerModeTag": "Match · 짝 맞추기",
  "pairs": [
    { "left": "A", "right": "a" },
    { "left": "B", "right": "b" }
  ],
  "accept": ["A|a", "B|b"]
}
```

- **`pairs`**: correct partners (book order on the left).
- **`accept`**: same pairs as `left|right` strings for validators/smoke scripts.
- UI shuffles the **right** column deterministically (seeded by `practiceId` + item `id`).
- **Scoring**: each pair is one point; ClassroomMetrics `item_id` = `<practiceId>:<itemId>#<n>` (1-based pair index).
- **Wrong-answer review**: shows the left label and the student’s chosen right label only (never the correct partner).

## Pictures

Optional **`image`**: `"assets/img/red1/unitNN/<file>.png"` — shown above the prompt (Jump/Fly picture items). Keep crops **&lt; 60 KB** when possible.

## Metrics

Same ClassroomMetrics schema as other ZAP books: `program=greenzap`, `app_name` from book `appName`.
