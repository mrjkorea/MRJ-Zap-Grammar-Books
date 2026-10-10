# ZAP Blue 2 — Unit 04 format (`some과 any, every와 all`)

Blue 2 Unit 04 follows the **two-lesson** pattern: each lesson has **Grammar Walk** (one or two pages), **Run**, **Jump**, **Fly**, then **Review 04** and **Wrap Up**. PDF file `pNNNN.png` ≈ printed page **NNNN−1**.

**Unit boundary:** PDF **p87–p112** (printed **pp. 86–111**). **p113** is Unit 05 preview (comic + objectives) — **excluded**.

## Page-type map

| PDF | Printed | Type | In app? |
|-----|---------|------|---------|
| 87 | 86 | Unit intro comic | No |
| 88 | 87 | Concept intro comic (`some` / `any` / `every` / `all`) | No |
| 89 | 88 | Lesson 01 concept — `some` | No |
| 90 | 89 | **Grammar Walk** — `some` (match + circle/underline) | Yes → `lesson01-walk` |
| 91 | 90 | Lesson 01 concept — `any` | No |
| 92 | 91 | **Grammar Walk** — `any` (circle/underline + position) | Yes → `lesson01-walk2` |
| 93–94 | 92–93 | **Grammar Run** — `some`/`any` | Yes → `lesson01-run` |
| 95–96 | 94–95 | **Grammar Jump** — `some`/`any` | Yes → `lesson01-jump` |
| 97–98 | 96–97 | **Grammar Fly** — `some`/`any` | Yes → `lesson01-fly` |
| 99 | 98 | Lesson 02 concept — `every` | No |
| 100 | 99 | **Grammar Walk** — `every` | Yes → `lesson02-walk` |
| 101 | 100 | Lesson 02 concept — `all` | No |
| 102 | 101 | **Grammar Walk** — `all` | Yes → `lesson02-walk2` |
| 103–104 | 102–103 | **Grammar Run** — `every`/`all` | Yes → `lesson02-run` |
| 105–106 | 104–105 | **Grammar Jump** — `every`/`all` | Yes → `lesson02-jump` |
| 107–108 | 106–107 | **Grammar Fly** — `every`/`all` | Yes → `lesson02-fly` |
| 109–111 | 108–110 | **Review 04** (20 items) | Yes → `review04` |
| 111 (lower) | 110 | Check Check score table on Review | No |
| 112 | 111 | **Wrap Up** filled summary tables | No |
| 113 | 112 | Next unit (Unit 05) preview | No |

## Practice table

| Slug | Book pages (printed) | Graded items | Sections | Modes |
|------|----------------------|-------------|----------|-------|
| `lesson01-walk` | 89 | 8 | A match×4, B circle+underline×4 | choice, words (2 blanks, ordered) |
| `lesson01-walk2` | 91 | 9 | A circle+underline×4, B any position×5 | words (ordered), choice |
| `lesson01-run` | 92–93 | 28 | A MC×14, B MC×14 | choice |
| `lesson01-jump` | 94–95 | 28 | A transform×14, B fill×14 (some/any or noun) | words |
| `lesson01-fly` | 96–97 | 28 | A correct phrase×14, B complete×14 | words (2 blanks) |
| `lesson02-walk` | 99 | 8 | A match×4, B circle+underline×4 | choice, words (2 blanks, ordered) |
| `lesson02-walk2` | 101 | 8 | A match×4, B circle+underline×4 | choice, words (2 blanks, ordered) |
| `lesson02-run` | 102–103 | 28 | A MC×14, B MC×14 | choice |
| `lesson02-jump` | 104–105 | 28 | A Korean gloss×14, B every/all×14 | words |
| `lesson02-fly` | 106–107 | 28 | A fix one word×14, B complete×14 | words |
| `review04` | 108–110 | 20 | `[1–3]`…`[19–20]` | choice, words, sentence |

**Timers:** Walk ~10 min; Run ~20; Jump ~24; Fly ~26; Review ~30.

## Uncertain / judgment calls

- **Walk 2 Section B (`any` position):** Book circles the slot before the noun (③ on the last word). App uses MC with ①–③ on `don't` / `have` / `money` (etc.), accepting the **noun** option (position ③).
- **Review 14** (`He reads ___ newspaper`): Korean “신문을 모두 읽는다” — accepts `all the` or `every` (whole-paper vs each-paper reading).
- **Jump 2 Section A:** Korean glosses accept several synonymous phrasings (spacing/plural variants).
- **Printed typo on Review 5:** `all days` → corrected in key as `all day` pattern via wrong-line choice ④ `all days`.

## Engine note

Walk circle+underline items use two ordered blanks (circled quantifier, then underlined noun). `unordered: true` is not used on this unit.
