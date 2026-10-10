# ZAP Blue — unit format (vs Green)

Blue books (Grammar, Zap! **기본**) teach **grammar concepts** in three lessons per unit, with **multiple Grammar Walk pages per lesson**, a **Review** spread, and a **Wrap Up** summary. There is **no** Grammar Run / Jump / Fly / Writing / Unit Test / Check Up sequence from Green.

Blue 2+ units use **Walk / Run / Jump / Fly** per lesson (see `docs/format/blue2-unit03.md` for Unit 03).

## Unit 01 page map (PDF page = file `pNNNN.png`; printed page ≈ PDF−1)

| PDF | Printed | Type | In app? |
|-----|---------|------|---------|
| 9–10 | 8–9 | Comic + concept intro (문장) | **No** — not graded |
| 11 | 10 | Concept (단어와 문장, punctuation) | **No** |
| 12 | 11 | **Grammar Walk** — sort word bank → 단어 / 문장 | **Yes** → Lesson 01 Walk 1 |
| 13 | 12 | Concept (문장의 종류) | **No** |
| 14 | 13 | **Grammar Walk** — sentence types + match | **Yes** → Lesson 01 Walk 2 |
| 15 | 14 | Concept (명사·대명사) | **No** |
| 16 | 15 | **Grammar Walk** — circle noun / pronoun | **Yes** → Lesson 02 Walk 1 |
| 17 | 16 | Concept (동사·조동사) | **No** |
| 18 | 17 | **Grammar Walk** — circle verb / auxiliary | **Yes** → Lesson 02 Walk 2 |
| 19 | 18 | Concept (형용사·부사·전치사) | **No** |
| 20 | 19 | **Grammar Walk** — POS of underlined word | **Yes** → Lesson 02 Walk 3 |
| 21 | 20 | Concept (주어·동사) | **No** |
| 22 | 21 | **Grammar Walk** — circle subject / verb | **Yes** → Lesson 03 Walk 1 |
| 23 | 22 | Concept (목적어·보어) | **No** |
| 24 | 23 | **Grammar Walk** — O vs C | **Yes** → Lesson 03 Walk 2 |
| 25–27 | 24–26 | **Review 01** (items 1–20) | **Yes** → Review 01 |
| 28 | 27 | Check Check score table on Review | **No** — not graded |
| 29 | 28 | **Wrap Up** filled summary tables | **No** — no student blanks |
| 29+ | 28+ | Next unit preview | **No** |

## Practices per unit (Blue)

1. **One timed practice per Grammar Walk page** — title pattern `Lesson NN Walk M — <lesson title>`.
2. **Review NN** — one practice; sections use book banners `[1–2]`, `[3–4]`, …; item labels `1`–`20` (continuous across the review, grouped by banner sections).
3. **Wrap Up** — only if the page has blanks students must fill; Unit 01 Wrap Up is display-only summary → **excluded**.

**Not in Blue:** `run`, `jump`, `fly`, `writing`, `quiz` (unit test), `checkup`, Green-style `tests/rt01`… (unless a later Blue book adds book-level tests).

## Exercise types → typing (same engine as Green)

| Book activity | App adaptation | `answerMode` |
|---------------|----------------|--------------|
| Sort into columns (단어 vs 문장) | Word bank shown; blanks in book order; words = single token, sentences = full sentence | `words` / `sentence` |
| Circle noun, verb, pronoun, etc. | Student types the circled word(s); **two+ circles** → `blanks: N` + `unordered: true` (all required, any order) | `words` |
| Match lines (1–4 ↔ a–d) | MC: pick matching line (`a.`…`d.` in book order) | `choice` |
| Write Korean sentence type (평서문…) | Type term; accept synonymous spacing | `words` |
| Write POS (명사, 부사…) | Type Korean term | `words` |
| Mark O / C (목적어·보어) | Type `O`/`C` or `목적어`/`보어` | `words` |
| Review MC (①–④) | Choices in book order; accept choice text or `1`–`4` | `choice` |
| Find wrong sentence / rewrite | Full corrected sentence | `sentence` |
| Book examples with printed answers | `example: true`, `displayOnly: true` | — |

## Sections & numbering

- **Grammar Walk:** `Section A`, `Section B`, … — numbering **restarts** per section (`A1` example, `A2`… then `B1` example, `B2`…).
- **Review:** section ids match banners (`1-2`, `3-4`, …); item labels `1`–`20`.

## Timers (generous)

| Kind | Minutes |
|------|---------|
| Grammar Walk | ~10 |
| Review 01 | ~30 |
| Wrap Up (if ever blanked) | ~8 |

## Metrics

Same pipeline as Green: `program=greenzap`, `source=greenzap`, `app_name` = book `appName` (**BlueZap 1**), `item_id` = `practiceId`, per-question + summary via `MRJ_SCORES` / `MRJ_AUTH.noteScore`.

## Excluded from repo

Page images, OCR text, and answer keys are **not** committed (public repo).
