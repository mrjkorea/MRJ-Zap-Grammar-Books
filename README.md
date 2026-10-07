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

## Practice data (Unit 01)

Each practice JSON under `data/green1/unit01/` and `data/green3/unit01/` is hand-maintained (**source of truth**). Generators under `scripts/build-*-unit01-data.py` refuse to overwrite sectioned files.

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

Other books/units appear in the index as **coming soon**; **ZAP Green 1** and **ZAP Green 3 / Unit 01** are active.

## Student rules

- Sign-in via shared [mrj-signin](https://github.com/mrjkorea/mrj-signin) (`data-mrj-app="mrj-zap-grammar-books"`).
- Full questions on screen; students also use the paper book.
- Each practice shows **Korean directions** per section (choose vs words-only vs full sentence). Mode chips appear on the start screen, section banners, and each question.
- After submit: ✓/✗ by book **label**, grouped by section — **Wrong:** lists labels only. Correct answers are **never** shown.
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
node scripts/smoke-sections.js
node scripts/smoke-unit-test.js
node scripts/smoke-green3-unit01.js
node scripts/smoke-app-sections.js
```

## Results

Index 2 (results overview) is stubbed from the home page link.
