# BlueZap 1 Unit 06 — page map (대명사 (2))

PDF page = file `pNNNN.png`; **printed page ≈ PDF − 1**.

Unit 06 uses the **Green-style lesson arc** (Walk → Run → Jump → Fly per lesson), unlike Unit 01 (Walk-only + Review). There is **no** Writing, Unit Test, Wrap Up blanks, or Check Up in this unit.

## Page types (PDF 133–159)

| PDF | Printed | Type | In app? |
|-----|---------|------|---------|
| 133 | 132 | Unit comic / learning goals | No |
| 134 | 133 | Unit title spread | No |
| 135 | 134 | Concept — 명사와 대명사의 일치 (1) | No |
| 136 | 135 | **Grammar Walk** (table + MC) | Yes → `lesson01-walk1` |
| 137 | 136 | Concept — 명사와 대명사의 일치 (2) | No |
| 138 | 137 | **Grammar Walk** (주격 고르기) | Yes → `lesson01-walk2` |
| 139 | 138 | **Grammar Run** A (괄호 고르기) | Yes → `lesson01-run` (A) |
| 140 | 139 | **Grammar Run** B (밑줄→대명사 MC) | Yes → `lesson01-run` (B) |
| 141 | 140 | **Grammar Jump** A (빈칸 대명사) | Yes → `lesson01-jump` (A) |
| 142 | 141 | **Grammar Jump** B (and → 주격) | Yes → `lesson01-jump` (B) |
| 143 | 142 | **Grammar Fly** A (밑줄 고치기) | Yes → `lesson01-fly` (A) |
| 144 | 143 | **Grammar Fly** B (빈칸 대명사) | Yes → `lesson01-fly` (B) |
| 145 | 144 | Concept — 지시대명사 this/that | No |
| 146 | 145 | **Grammar Walk** (circle + P/A) | Yes → `lesson02-walk1` |
| 147 | 146 | Concept — these/those | No |
| 148 | 147 | **Grammar Walk** (circle + 복수형) | Yes → `lesson02-walk2` |
| 149 | 148 | **Grammar Run** A | Yes → `lesson02-run` (A) |
| 150 | 149 | **Grammar Run** B | Yes → `lesson02-run` (B) |
| 151 | 150 | **Grammar Jump** A | Yes → `lesson02-jump` (A) |
| 152 | 151 | **Grammar Jump** B (우리말 뜻) | Yes → `lesson02-jump` (B) |
| 153 | 152 | **Grammar Fly** A | Yes → `lesson02-fly` (A) |
| 154 | 153 | **Grammar Fly** B | Yes → `lesson02-fly` (B) |
| 155–157 | 154–156 | **Review 06** (items 1–20) | Yes → `review06` |
| 158 | 157 | **Wrap Up** filled summary tables | No |
| 159 | 158 | Unit 07 preview (be 동사) | No |

## Practice slugs

| Slug | Book pages (printed) | Timer (min) |
|------|----------------------|-------------|
| `lesson01-walk1` | 135 | 10 |
| `lesson01-walk2` | 137 | 10 |
| `lesson01-run` | 138–139 | 20 |
| `lesson01-jump` | 140–141 | 24 |
| `lesson01-fly` | 142–143 | 26 |
| `lesson02-walk1` | 145 | 10 |
| `lesson02-walk2` | 147 | 10 |
| `lesson02-run` | 148–149 | 20 |
| `lesson02-jump` | 150–151 | 24 |
| `lesson02-fly` | 152–153 | 26 |
| `review06` | 154–156 | 30 |

**Total graded items:** 241 (see `node scripts/smoke-blue1-unit06.js`).

## Section numbering

- **Walk / Run / Jump / Fly:** `Section A`, `Section B`, … — labels restart per section (`A1` example where printed, then `A2`…; `B1`…).
- **Review 06:** section ids match banners (`1-2`, `3-5`, …); item labels `1`–`20`.

## Adaptation notes

- Circle / underline in book → student types the target word(s); underlines use `<u>…</u>` in `promptEn`.
- Grammar Run/Jump/Fly MC → two-choice items use `type: "mc"` with choices in book order.
- Fly error-correction → corrected **word(s) only** (`answerMode: words`), not full sentence rewrite.
- Jump B (Lesson 02) → Korean gloss accepts multiple synonymous phrases.
- Review **Check Check** score table (p. 156) → not graded.
