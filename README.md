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

## GreenZap 1 — Unit 01 (9 practices)

Signed-in students use the **index**: Book → Unit → exercise.

| # | Practice | Book pages |
|---|----------|------------|
| 1 | Grammar Walk — Lesson 01 (affirmative present) | ~10–11 |
| 2 | Grammar Walk — Lesson 02 (negatives & questions) | ~12–13 |
| 3 | Grammar Run | ~14–15 |
| 4 | Grammar Jump | ~16–17 |
| 5 | Grammar Fly | ~18–19 |
| 6 | Grammar & Writing | ~20–21 |
| 7 | Unit Test 01 (25 items) | ~22–26 |
| 8 | Wrap Up | ~26–27 |
| 9 | Check Up (comic dialogue) | ~27 |

Deep link example: `#/p/zap-green-1/unit-01/walk1`

## GreenZap 3 — Unit 01 (9 practices)

**Unit 01 — 의문사 있는 의문문 (1)** (interrogatives: what, which, who, when, where, why, how).

| # | Practice | Book pages | Items | Timer (min) |
|---|----------|------------|-------|-------------|
| 1 | Grammar Walk — Lesson 01 | 11 | 14 | 10 |
| 2 | Grammar Walk — Lesson 02 | 13 | 15 | 10 |
| 3 | Grammar Run | 14–15 | 27 | 18 |
| 4 | Grammar Jump | 16–17 | 27 | 25 |
| 5 | Grammar Fly | 18–19 | 24 | 28 |
| 6 | Grammar & Writing | 20–21 | 12 | 20 |
| 7 | Unit Test 01 | 22–26 | 25 | 30 |
| 8 | Wrap Up | 27 | 6 | 8 |
| 9 | Check Up | 27 | 4 | 6 |

**154 items** total. Practice IDs use the `g3:u01:*` prefix (e.g. `g3:u01:walk1`).

Deep link example: `#/p/zap-green-3/unit-01/walk1`

Other books/units (ZAP Red/Blue/Green slots) appear in the index as **coming soon**; **ZAP Green 1** and **ZAP Green 3 / Unit 01** are active.

## Student rules

- Sign-in via shared [mrj-signin](https://github.com/mrjkorea/mrj-signin) (`data-mrj-app="mrj-zap-grammar-books"`).
- Full questions on screen; students also use the paper book.
- After submit: ✓/✗ per item and **Wrong:** list (book labels like **A3** when present) — correct answers are **never** shown.
- **Pass** tracking at **80%+**; score **under 50%** forces a **retry** (same exercise, still no answers).
- **Timer** on every practice (generous defaults for writing). Remaining time is shown; at **0:00** the form **auto-submits** and locks (same as pressing Submit).
- Answers accept contractions and full forms, case-insensitive, trimmed/collapsed spaces (e.g. `don't` / `do not`, `I'm` / `I am`). Curly apostrophes from mobile keyboards are normalized.

## Metrics

`mrj-scores.js` (from day5-practice) posts to **MRJ Classroom Metrics**:

- `program=greenzap`, `source=greenzap`
- `app_name` is **GreenZap 1** or **GreenZap 3** (and future books) per selected practice
- `correctness`: `correct` | `incorrect`
- One summary event per finished practice (`u01:walk1`, `g3:u01:quiz`, …); per-question detail lives in the `greenzap` progress pack
- `MRJ_AUTH.noteScore` on summary only
- Per-student pack sync via `MRJ_AUTH.loadPack` / `savePack` (`program=greenzap`); build string in `version.json`

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

## Smoke tests

```bash
node scripts/pack-unit-test.js
node scripts/smoke-unit-test.js
node scripts/smoke-green3-unit01.js
```

## Results

Index 2 (results overview) is stubbed from the home page link.
