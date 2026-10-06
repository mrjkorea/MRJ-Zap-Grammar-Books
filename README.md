# MRJ Zap Grammar Books

Student typing practices for ZAP grammar books (**GreenZap 1** and future titles).

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

Other books/units (ZAP Red/Blue/Green slots) appear in the index as **coming soon**; only **ZAP Green 1 / Unit 01** is active.

## Student rules

- Sign-in via shared [mrj-signin](https://github.com/mrjkorea/mrj-signin) (`data-mrj-app="mrj-zap-grammar-books"`).
- Full questions on screen; students also use the paper book.
- After submit: ✓/✗ per item and **Wrong: Q…** only — correct answers are **never** shown.
- **Pass** tracking at **80%+**; score **under 50%** forces a **retry** (same exercise, still no answers).
- **Timer** on every practice (generous defaults for writing). Remaining time is shown; at **0:00** the form **auto-submits** and locks (same as pressing Submit).
- Answers accept contractions and full forms, case-insensitive, trimmed/collapsed spaces (e.g. `don't` / `do not`, `I'm` / `I am`).

## Metrics

`mrj-scores.js` (from day5-practice) posts to **MRJ Classroom Metrics**:

- `program=greenzap`, `app_name=GreenZap 1`, `source=greenzap`
- `correctness`: `correct` | `incorrect`
- One event per question (`u01:walk1:q03`, …) and one summary per finished practice (`u01:walk1`, `u01:quiz`, …)
- `MRJ_AUTH.noteScore` on summary

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

## Smoke test (Unit Test grading)

```bash
node scripts/smoke-unit-test.js
```

## Results

Index 2 (results overview) is stubbed from the home page link.
