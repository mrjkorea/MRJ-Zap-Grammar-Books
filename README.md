# MRJ Zap Grammar Books

Student typing practices for ZAP grammar books (**GreenZap 1**, **GreenZap 2**, **GreenZap 3**, and future titles).

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
- **Multi-blank items:** `blanks: N` (N ≥ 2) with `accept` entries using `|` between blank answers (e.g. `"Do|Does"`). Each printed blank box = one part in `response.parts`.
- **`unordered: true`** (optional): when the book expects **two or more separate answers** and **any order** is correct (e.g. circle every noun in “Tom is a student.” → `Tom` and `student`). Set `blanks` to the answer count, list one pipe tuple in `accept` (e.g. `"Tom|student"`); the engine accepts any permutation. Students must fill **all** blanks; a single correct word is **not** enough. Do not use for ordered slots (sentence building, wrap-up tables with fixed slots) or for “pick one of” synonym lists on a single blank.
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

**GreenZap 1 full book:** 8 units × 9 practices + 6 tests = **78 practices**, **1252 graded items** (see `PROOF-GZ1.md` for per-practice rows, smoke results, and live URLs).

### GreenZap 2 — full book

**GreenZap 2** data lives under `data/green2/` (units `unit01`–`unit08` + `tests/`). Catalog id **`zap-green-2`**, app name **GreenZap 2**.

**78 practices**, **1361 graded items** — see `PROOF-GZ2.md` for per-practice pages, smoke/audit notes, and live deep links. Build string: `20261009-gz2-full`.

Deep link example: `#/p/zap-green-2/unit-01/walk1`

### GreenZap 3 — full book

**GreenZap 3** data under `data/green3/` (units `unit01`–`unit08` + `tests/`). Catalog id **`zap-green-3`**, app name **GreenZap 3**.

**78 practices** — see `PROOF-GZ3.md` for graded counts, smoke/e2e/audit rows, and live deep links.

Deep link example: `#/p/zap-green-3/unit-02/walk1`

### GreenZap 4 — full book

**GreenZap 4** data under `data/green4/` (units `unit01`–`unit08` + `tests/`). Catalog id **`zap-green-4`**, app name **GreenZap 4**.

**78 practices** — see `PROOF-GZ4.md`.

Deep link example: `#/p/zap-green-4/unit-01/walk1`

**ZAP Green 1–4** full books are active in the index (build `20261009-gz34-full`).

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
- `app_name` is **GreenZap 1** … **GreenZap 4** per selected practice
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
node scripts/smoke-sections.js    # GreenZap 1 units 01–08 + GreenZap 3 unit 01
node scripts/check-all-data.js      # all green1–green4 JSON integrity
node scripts/smoke-gz1-all.js       # catalog-driven: all 78 GreenZap 1 data files
node scripts/smoke-gz2-all.js       # all 78 GreenZap 2 practices + per-unit smokes
node scripts/smoke-gz3-all.js
node scripts/smoke-gz4-all.js
node scripts/smoke-gz1-tests.js
node scripts/smoke-units-02-05.js
node scripts/smoke-unit06.js
node scripts/smoke-unit07.js
node scripts/smoke-unit08.js
node scripts/smoke-unit-test.js
node scripts/smoke-green3-unit01.js
node scripts/smoke-app-sections.js
node scripts/smoke-review.js
node scripts/smoke-unordered.js   # unordered multi-blank grading
node scripts/smoke-blue1-unit01.js
node scripts/e2e-bz1-browser.js
node scripts/e2e-gz1-browser.js     # headless browser (needs: npm install playwright)
node scripts/e2e-gz2-browser.js
node scripts/e2e-gz3-browser.js
node scripts/e2e-gz4-browser.js
```

## Results

Index 2 (results overview) is stubbed from the home page link.
