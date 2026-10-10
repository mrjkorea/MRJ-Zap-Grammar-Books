# PROOF-BZ1 — BlueZap 1 Unit 01

Build: `20261010-bz1-u01-aud`  
Independent accuracy audit (PR #45): page images PDF 9–29 vs `data/blue1/unit01/`.

## Format (PDF 9–29)

- **Excluded:** comic/concept pages (PDF 9–11, 13, 15, 17, 19, 21, 23), Check Check table (PDF 28), Wrap Up summary (PDF 29 — no student blanks), Unit 02 preview (PDF 29+).
- **Included:** 7 Grammar Walk pages + Review 01 (20 items). No Run/Jump/Fly/Writing/Unit Test/Check Up.
- **FORMAT-BLUE.md:** PDF↔printed page map corrected (Grammar Walk 1 = PDF 12 / printed 11, etc.).

## Practice matrix (8 rows)

| Practice | Book pages (printed) | Graded | Smoke | E2E | Audit | Live link |
|----------|----------------------|--------|-------|-----|-------|-----------|
| `lesson01-walk1` | 11 | 11 (A8+B3) | OK | OK | OK — 8 word + 3 sentence after examples; extra blank slots on page not graded | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson01-walk1 |
| `lesson01-walk2` | 13 | 8 (A5+B3) | OK | OK | FIXED A5 prompt `What a big boy!` + Korean gloss; counts verified (B has 4 lines, 1 example) | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson01-walk2 |
| `lesson02-walk1` | 15 | 8 | OK | OK | FIXED missing `promptKo`; Tom→**student** first, **Tom** still accepted | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson02-walk1 |
| `lesson02-walk2` | 17 | 8 | OK | OK | FIXED missing `promptKo` on all items | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson02-walk2 |
| `lesson02-walk3` | 19 | 11 | OK | OK | FIXED `<u>` on underlined words; POS accept variants (한글/영문) | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson02-walk3 |
| `lesson03-walk1` | 21 | 8 | OK | OK | FIXED missing `promptKo` | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson03-walk1 |
| `lesson03-walk2` | 23 | 9 | OK | OK | FIXED `<u>` on O/C targets | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/lesson03-walk2 |
| `review01` | 24–26 | 20 | OK | OK | FIXED Review #8–10 MC choices with `<u>`; review fill `promptKo`; #12 book typo kept | https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/#/p/zap-blue-1/unit-01/review01 |

**Total graded:** 83

## Tests (this audit)

```
node scripts/check-all-data.js
node scripts/smoke-blue1-unit01.js
node scripts/smoke-gz1-all.js … smoke-gz4-all.js
node scripts/e2e-bz1-browser.js
```

All passed on build `20261010-bz1-u01-aud`.

## Teacher questions (answered from images)

1. **Walk 1 word slots:** Book shows 9 empty word slots + 4 sentence slots after examples, but only **8** words and **3** sentences remain in the bank — grade **8+3** (not the extra blank lines).
2. **Tom is a student:** Circle-the-noun pattern matches **cat** in item 1 → grade **student** (also accept **Tom** as a noun).
3. **Review #12:** Korean says 야구; English says *soccer* — keep printed mismatch; answer **on** (preposition).
4. **Review #8–10:** MC options now include `<u>…</u>` on the graded word (visible in UI).

## Generator

`node scripts/blue1-build/unit01-generate.js` — `fillItem`/`mcItem` now preserve `promptKo`; underline helper for walk3, walk2 O/C, review 8–10.
