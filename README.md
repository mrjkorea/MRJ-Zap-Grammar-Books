# MRJ Zap Grammar Books

Student typing practices for ZAP grammar books (**GreenZap 1**, **GreenZap 3**, and future titles).

Separate from [`mrj-grammar-app`](https://github.com/mrjkorea/mrj-grammar-app) (gold extract only — do not mix).

## Live site (GitHub Pages)

**https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/**

Static files are served from the **repository root** (`index.html`, `assets/`, `data/`).

### Enable Pages (one-time, repo admin)

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Push to `main` runs `.github/workflows/pages.yml` and publishes the site.

## Practice data

**GreenZap 1 Unit 01** and **GreenZap 3 Unit 01** JSON under `data/green1/unit01/` and `data/green3/unit01/` is hand-maintained (**source of truth**). Generators under `scripts/build-*-unit01-data.py` refuse to overwrite sectioned files.

**GreenZap 1 Units 02–05** live under `data/green1/unit02/` … `unit05/`. Regenerate from `scripts/green1-build/u02.py` … `u05.py` (`python3 u0N.py` in that folder writes `data/green1/unit0N/`).

- `sectionsVersion: 2` — bump when section layout or item ids change (clears mismatched in-progress drafts).
- `sections[]` — per-section summary: `id`, `title`, `instructionKo`, `answerMode` (`choice` | `words` | `sentence`), `answerModeTag`, `itemCount`, `exampleCount`, `labels`, optional `mixedModes`.
- `introKo` — one-line Korean summary on the practice start screen.
- Every item: `section`, `sectionTitle`, `sectionInstructionKo`, `answerMode`, `answerModeTag`, `label` (book numbering: A1, B3, 18, 1-4, …), optional `noteKo`.
- Book examples (answer printed in the book): `example: true`, `displayOnly: true`, `exampleAnswer` — shown as grey cards, **not graded**.
- Item ids are section-based (`a01`, `b01`, unit-test `q01`–`q25`, wrap `w1_1`, checkup `c01`, …). `practiceId` values are unchanged (`u01:*`, `g3:u01:*`).

### GreenZap 1 — Unit 01 sections (graded counts)

| Practice | practiceId | Graded | Sections (modes) |
|----------|------------|--------|------------------|
| Grammar Walk — Lesson 01 | u01:walk1 | 14 | A: 14 [choice] |
| Grammar Walk — Lesson 02 | u01:walk2 | 11 | A: 8 [choice]; B: 3 [choice] |
| Grammar Run | u01:run | 28 | A: 14 [words]; B: 14 [words] |
| Grammar Jump | u01:jump | 22 | A: 11 [words]; B: 11 [words] |
| Grammar Fly | u01:fly | 22 | A: 11 [sentence]; B: 11 [sentence] |
| Grammar & Writing | u01:writing | 9 | A: 5 [words]; B: 4 [words] |
| Unit Test 01 | u01:quiz | 25 | Direction groups [1–2]…[21–25] (choice / words) |
| Wrap Up | u01:wrap | 6 | §1: 3 [words]; §2: 3 [words] |
| Check Up | u01:checkup | 3 | Check Up [choice] |

Deep link example: `#/p/zap-green-1/unit-01/walk1`

### GreenZap 1 — Units 02–05 (graded counts)

| Unit | Practices | Graded items (approx.) | Test URL |
|------|-----------|------------------------|----------|
| 02 과거 시제 | 9 timed (walk1 … checkup) | 153 | `#/p/zap-green-1/unit-02/walk1` |
| 03 미래 시제 | 9 | 142 | `#/p/zap-green-1/unit-03/walk1` |
| 04 진행 시제 | 9 | 154 | `#/p/zap-green-1/unit-04/walk1` |
| 05 조동사 (1) | 9 | 129 | `#/p/zap-green-1/unit-05/walk1` |

Section layout matches the printed book (`sectionsVersion: 2`). See PR tables for per-practice page ranges, section modes, and book typos noted during entry.

### GreenZap 3 — Unit 01 sections (graded counts)

| Practice | practiceId | Graded | Sections (modes) |
|----------|------------|--------|------------------|
| Grammar Walk — Lesson 01 | g3:u01:walk1 | 12 | A: 8 [choice]; B: 4 [choice] |
| Grammar Walk — Lesson 02 | g3:u01:walk2 | 14 | A: 14 [choice] |
| Grammar Run | g3:u01:run | 25 | A: 14 [choice]; B: 11 [words] |
| Grammar Jump | g3:u01:jump | 25 | A: 11 [words]; B: 14 [words] |
| Grammar Fly | g3:u01:fly | 22 | A: 11 [words]; B: 11 [sentence] |
| Grammar & Writing | g3:u01:writing | 10 | A: 5 [words]; B: 5 [sentence/words] |
| Unit Test 01 | g3:u01:quiz | 25 | Direction groups [1–2]…[21–25] |
| Wrap Up | g3:u01:wrap | 6 | §1: 3 [words]; §2: 3 [words] |
| Check Up | g3:u01:checkup | 4 | Check Up [choice] |

**283 graded items** (+22 display-only book examples) across both books’ Unit 01.

Deep link example: `#/p/zap-green-3/unit-01/walk1`

### GreenZap 1 — Units 06–08 + Review & Final Tests

| Unit / group | Practices | Graded items (approx.) | Deep link |
|--------------|-----------|------------------------|-----------|
| 06 조동사 (2) | 9 | 129 | `#/p/zap-green-1/unit-06/walk1` |
| 07 조동사 (3) | 9 | 129 | `#/p/zap-green-1/unit-07/walk1` |
| 08 여러 가지 문장 | 9 | 144 | `#/p/zap-green-1/unit-08/walk1` |
| Review & Final Tests | 6 (RT01–04, FT01–02) | 120 | `#/p/zap-green-1/tests/rt01` |

**GreenZap 1 full book:** 8 units × 9 practices + 6 tests = **78 practices**, **1252 graded items** (see `PROOF-GZ1.md` for per-practice rows, smoke results, and live URLs). Build string: `20261009-gz1-full`.

Other books/units appear in the index as **coming soon**. **ZAP Green 1 (Units 01–08 + tests)** and **ZAP Green 3 / Unit 01** are active in the index.

## Student rules

- Sign-in via shared [mrj-signin](https://github.com/mrjkorea/mrj-signin) (`data-mrj-app="mrj-zap-grammar-books"`).
- Full questions on screen; students also use the paper book.
- Each practice shows **Korean directions** per section (choose vs words-only vs full sentence). Mode chips appear on the start screen, section banners, and each question.
- After submit: ✓/✗ by book **label**, grouped by section, plus a **wrong-answer review** (your answer, question, section instructions — still **no correct answers**). Under **50%**, the same review appears when you open **Try again**.
- **Pass** tracking at **80%+**; score **under 50%** forces a **retry** (same exercise, still no answers).
- **Timer** on every practice. Remaining time is shown; at **0:00** the form **auto-submits** and locks.
- Answers accept contractions and full forms, case-insensitive, trimmed/collapsed spaces. Curly apostrophes from mobile keyboards are normalized.

## Metrics

`mrj-scores.js` posts to **MRJ Classroom Metrics**:

- `program=greenzap`, `source=greenzap`
- `app_name` is **GreenZap 1** or **GreenZap 3** per selected practice
- One summary event per finished practice; per-question detail in the `greenzap` progress pack (item metric ids use current item ids; old `q01` rows in saved packs are ignored for new items)
- `MRJ_AUTH.noteScore` on summary only
- Per-student pack sync via `MRJ_AUTH.loadPack` / `savePack`; build string in `version.json`

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

## Smoke tests

```bash
node scripts/pack-unit-test.js
node scripts/smoke-sections.js    # GreenZap 1 units 01–05 + GreenZap 3 unit 01
node scripts/smoke-units-02-05.js # optional: units 02–05 only (same checks)
node scripts/smoke-unit-test.js
node scripts/smoke-green3-unit01.js
node scripts/smoke-app-sections.js
node scripts/smoke-review.js
```

## Results

Index 2 (results overview) is stubbed from the home page link.
