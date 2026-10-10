# BlueZap 1 — Unit 08 format (`be동사의 현재 시제 (2)`)

PDF pages **185–211** (printed **184–210**). Unit 02+ layout: **two lessons**, each **Walk → Run → Jump → Fly**, then **Review 08** and **Wrap Up**.

## Page-type map

| PDF | Printed | Type | App practice |
|-----|---------|------|----------------|
| 185 | 184 | Comic (unit opener) | — |
| 186 | 185 | Concept intro | — |
| 187 | 186 | Concept — Lesson 01 (인칭대명사 의문문) | — |
| 188 | 187 | **Grammar Walk** (circle subject + underline be; match answers) | `lesson01-walk` |
| 189 | 188 | Concept — Lesson 01 (지시대명사) | — |
| 190 | 189 | **Grammar Walk** | `lesson01-walk2` |
| 191 | 190 | **Grammar Run** A (choose be/subject) | `lesson01-run` §A |
| 192 | 191 | **Grammar Run** B (choose short answers) | `lesson01-run` §B |
| 193 | 192 | **Grammar Jump** A (Korean gloss blanks) | `lesson01-jump` §A |
| 194 | 193 | **Grammar Jump** B (be + subject, 2 blanks) | `lesson01-jump` §B |
| 195 | 194 | **Grammar Fly** A (statement → question) | `lesson01-fly` §A |
| 196 | 195 | **Grammar Fly** B (dialogue: pronoun + be) | `lesson01-fly` §B |
| 197 | 196 | Concept — Lesson 02 (명사 주어) | — |
| 198 | 197 | **Grammar Walk** | `lesson02-walk` |
| 199 | 198 | Concept — Lesson 02 (`… and I` / `you and …`) | — |
| 200 | 199 | **Grammar Walk** | `lesson02-walk2` |
| 201 | 200 | **Grammar Run** | `lesson02-run` |
| 202 | 201 | **Grammar Run** B | `lesson02-run` §B |
| 203 | 202 | **Grammar Jump** A | `lesson02-jump` §A |
| 204 | 203 | **Grammar Jump** B (reply pronoun) | `lesson02-jump` §B |
| 205 | 204 | **Grammar Fly** A (underline fix) | `lesson02-fly` §A |
| 206 | 205 | **Grammar Fly** B | `lesson02-fly` §B |
| 207–209 | 206–208 | **Review 08** (20 items) | `review08` |
| 210 | 209 | **Wrap Up** (filled summary tables) | — |
| 211 | 210 | Series back cover / ads | — |

**Book-level final test:** None in this PDF range; p.211 is publisher material only. No `data/blue1/tests/` entries for this unit.

## Practice summary

| Practice | Pages (printed) | Graded items | Sections | Modes |
|----------|-----------------|-------------|----------|-------|
| lesson01-walk | 187–188 | 10 | A×5, B×5 | words (2-blank 주어→be동사), choice |
| lesson01-walk2 | 189 | 10 | A×5, B×5 | words (2-blank 주어→be동사), choice |
| lesson01-run | 190–191 | 28 | A×14, B×14 | choice |
| lesson01-jump | 192–193 | 28 | A×14, B×14 | words |
| lesson01-fly | 194–195 | 28 | A×14, B×14 | sentence, words (2-blank) |
| lesson02-walk | 197–198 | 10 | A×5, B×5 | words (2-blank 주어→be동사), choice |
| lesson02-walk2 | 199 | 10 | A×5, B×5 | words (2-blank 주어→be동사), choice |
| lesson02-run | 200–201 | 28 | A×14, B×14 | choice |
| lesson02-jump | 202–203 | 28 | A×14, B×14 | words |
| lesson02-fly | 204–205 | 28 | A×14, B×14 | words, words (2-blank) |
| review08 | 206–208 | 20 | [1–2]…[19–20] | choice, sentence, words |

Timers: Walk 10m, Run 19m, Jump 23m, Fly 26m, Review 30m.

## Engine note

Walk Section A uses `blanks: 2`, ordered `accept` (`주어|be동사`), optional `blankPartLabels: ["주어","be동사"]`. `unordered: true` is for same-role multi-answers only (e.g. circle every noun), not subject vs be-verb.
