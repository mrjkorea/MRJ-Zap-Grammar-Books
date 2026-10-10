# ZAP Blue 1 — Unit 02 format (`셀 수 있는 명사`)

Unit 02 uses the **Walk → Run → Jump → Fly** ladder per lesson (unlike Unit 01’s multi-Walk-only lessons). See also `FORMAT-BLUE.md` for shared Blue rules.

## Page map (PDF `pNNNN.png`; printed page ≈ PDF−1)

| PDF | Printed | Type | In app? |
|-----|---------|------|---------|
| 29–30 | 28–29 | Comic + unit intro | **No** |
| 31 | 30 | Concept — Lesson 01 셀 수 있는 명사 | **No** |
| 32 | 31 | **Grammar Walk** (A countable sort, B sg/pl columns) | **Yes** → `lesson01-walk` |
| 33 | 32 | Concept — 복수형 규칙 (1) | **No** |
| 34 | 33 | **Grammar Walk** (rule + plural) | **Yes** → `lesson01-walk2` |
| 35 | 34 | **Grammar Run** A (plural MC) | **Yes** → `lesson01-run` (with p.36) |
| 36 | 35 | **Grammar Run** B (sentence MC) | **Yes** → `lesson01-run` |
| 37 | 36 | **Grammar Jump** A (plural + 뜻) | **Yes** → `lesson01-jump` (with p.38) |
| 38 | 37 | **Grammar Jump** B (singular + 뜻) | **Yes** → `lesson01-jump` |
| 39 | 38 | **Grammar Fly** A (fix underline) | **Yes** → `lesson01-fly` (with p.40) |
| 40 | 39 | **Grammar Fly** B (complete with word in parens) | **Yes** → `lesson01-fly` |
| 41 | 40 | Concept — Lesson 02 복수형 규칙 (2) | **No** |
| 42 | 41 | **Grammar Walk** (rule + plural, y/ies, f/fe→ves) | **Yes** → `lesson02-walk` |
| 43 | 42 | Concept — 불규칙 복수 | **No** |
| 44 | 43 | **Grammar Walk** (irregular sg/pl + match) | **Yes** → `lesson02-walk2` |
| 45 | 44 | **Grammar Run** A | **Yes** → `lesson02-run` (with p.46) |
| 46 | 45 | **Grammar Run** B | **Yes** → `lesson02-run` |
| 47 | 46 | **Grammar Jump** A | **Yes** → `lesson02-jump` (with p.48) |
| 48 | 47 | **Grammar Jump** B | **Yes** → `lesson02-jump` |
| 49 | 48 | **Grammar Fly** A | **Yes** → `lesson02-fly` (with p.50) |
| 50 | 49 | **Grammar Fly** B | **Yes** → `lesson02-fly` |
| 51–53 | 50–52 | **Review 02** (20 items) | **Yes** → `review02` |
| 54 | 53 | **Wrap Up** (filled summary tables) | **No** |
| 55 | 54 | Unit 03 preview | **No** |

## Practice slugs

- Lesson 01: `lesson01-walk`, `lesson01-walk2`, `lesson01-run`, `lesson01-jump`, `lesson01-fly`
- Lesson 02: `lesson02-walk`, `lesson02-walk2`, `lesson02-run`, `lesson02-jump`, `lesson02-fly`
- `review02` (not `review-02` slug; file `review-02.json`)

## Timers (generous)

| Kind | Minutes |
|------|---------|
| Grammar Walk | 10 |
| Grammar Run | 18–20 |
| Grammar Jump | 22–24 |
| Grammar Fly | 26–28 |
| Review 02 | 30 |

## Walk Section B / Walk2 Section A (sg/pl tables)

When the direction says to find singular and plural forms and write them **in order** (순서대로), each **row** is **not** a semantic singular–plural pair. Fill the **단수형** column with singulars from the word bank in bank order, and the **복수형** column with plurals in bank order (example row 1 may show unrelated words, e.g. girl / dogs or ox / teeth).

## Graded item total

**221** items across 11 practices (smoke: `node scripts/smoke-blue1-unit02.js`).
