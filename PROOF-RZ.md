# ZAP Red 1 + Red 2 — full integration proof

**Build:** `20261011-red-full`  
**Site:** https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/  
**Integration:** merged audited unit/review PRs + global Red rules (`scripts/check-red-rules.js`, `scripts/apply-red-walk-fixes.js`).

## PR sources (builder drafts on GitHub)

| Part | PR |
|------|-----|
| Red 1 Unit 02 | #97 |
| Red 1 Unit 03 | #98 |
| Red 1 Unit 04 | #87 |
| Red 1 Unit 05 | #84 |
| Red 1 Unit 06 | #83 |
| Red 1 Unit 07 | #96 |
| Red 1 Unit 08 | #95 |
| Red 1 Unit 09 | #81 |
| Red 1 Unit 10 | #90 |
| Red 1 Reviews 01–05 | #93 |
| Red 1 Unit 01 (main) | #78 |
| Red 2 Unit 01 | #79 |
| Red 2 Unit 02 | #89 |
| Red 2 Unit 03 | #92 |
| Red 2 Unit 04 | #85 |
| Red 2 Unit 05 | #82 |
| Red 2 Unit 06 | #94 |
| Red 2 Unit 07 | #80 |
| Red 2 Unit 08 | #88 |
| Red 2 Unit 09 | #91 |
| Red 2 Unit 10 | #86 |
| Red 2 Reviews 01–05 | #99 |

## ZAP Red 1 (`zap-red-1`)

| Unit / Review | Practices | Graded items | Walk match pairs (scoring) |
|---------------|-----------|--------------|----------------------------|
| Unit 01 | 6 | 127 | 46 |
| Unit 02 | 6 | 84 | 28 |
| Review 01 | 1 | 20 | 0 |
| Unit 03 | 6 | 66 | 26 |
| Unit 04 | 6 | 76 | 20 |
| Review 02 | 1 | 20 | 0 |
| Unit 05 | 6 | 62 | 17 |
| Unit 06 | 6 | 63 | 20 |
| Review 03 | 1 | 20 | 0 |
| Unit 07 | 6 | 64 | 20 |
| Unit 08 | 7 | 69 | 20 |
| Review 04 | 1 | 20 | 0 |
| Unit 09 | 6 | 67 | 20 |
| Unit 10 | 6 | 63 | 20 |
| Review 05 | 1 | 20 | 0 |
| **Total** | **66** | **841** | **237** |

## ZAP Red 2 (`zap-red-2`)

| Unit / Review | Practices | Graded items | Walk match pairs |
|---------------|-----------|--------------|------------------|
| Unit 01 | 6 | 82 | 20 |
| Unit 02 | 6 | 70 | 20 |
| Review 01 | 1 | 20 | 0 |
| Unit 03 | 6 | 73 | 20 |
| Unit 04 | 6 | 71 | 20 |
| Review 02 | 1 | 20 | 0 |
| Unit 05 | 6 | 71 | 20 |
| Unit 06 | 6 | 70 | 20 |
| Review 03 | 1 | 20 | 0 |
| Unit 07 | 6 | 73 | 30 |
| Unit 08 | 6 | 70 | 20 |
| Review 04 | 1 | 20 | 0 |
| Unit 09 | 6 | 69 | 20 |
| Unit 10 | 6 | 63 | 20 |
| Review 05 | 1 | 20 | 0 |
| **Total** | **66** | **812** | **210** |

**Both books:** 132 practices, 1653 graded items, 447 walk match pairs (pair-level scoring).

## Tests (integration branch)

| Check | Result |
|-------|--------|
| `scripts/smoke-red1-unit01.js` … `smoke-red1-unit10.js`, `smoke-red1-reviews.js` | OK |
| `scripts/smoke-red2-unit01.js` … `smoke-red2-unit10.js`, `smoke-red2-reviews.js` | OK |
| `scripts/check-all-data.js` | OK (791 catalog-backed practices site-wide) |
| `scripts/check-red-rules.js` | OK |
| `scripts/smoke-review.js` (green1, green3, **red1**, **red2**) | OK |
| `scripts/e2e-red-full-browser.js` | OK — **132/132** Red practices at 100% |
| `scripts/e2e-gz1-browser.js` | OK (GreenZap 1 regression) |
| `scripts/e2e-bz-browser.js 1` | OK (BlueZap 1 regression) |

## Live deploy check

After merge to `main`, verify:

```bash
curl -s 'https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/assets/js/version.js?v=20261011-red-full' | grep MRJ_ZAP_BUILD
curl -s 'https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/assets/js/catalog.js' | grep -E 'zap-red-1|zap-red-2' | head
```

## Notes / open questions

- Red 2 Unit 10 Walk C1 uses `Sure. (sing)` on the right to keep labels unique while matching the book reply for “Let’s sing together.”
- Red 1 Unit 05 Walk A uses `you (plural)` for 너희 to distinguish from singular `you`.
- Run practices with irregular-plural / -ing tracing matches (e.g. Red 1 U03 Run B, Red 2 U07 Run B) remain English↔English by book design; Walk cards are Korean↔English per teacher rule.
