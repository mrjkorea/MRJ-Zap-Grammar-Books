# Full sheet-standalone audit — 2026-11-06

Jay's order (relayed by Fujimoto · Chief of Staff, 2026-11-06 ~02:30 KST): every question in every
grammar book must be doable on the computer without the printed page. This is a second, deeper pass
over the same 12 books after a hole showed up in the middle-school copies.

Two machine checks were run over every practice:

1. **Visibility** — `scripts/audit-sheet-standalone.py` (the house audit) plus a stricter pass
   (`scripts/audit-sheet-standalone-v2.py`) that also flags a passage or box a card points at but does not show, an
   elided stem that hides the needed words, placeholder choices, an answer key that names no choice,
   a duplicate choice, and a write-in stem that is only a label.
2. **Gradability** — `scripts/audit-key-answers.js` loads the live engine (`normalize.js`, `engine.js`) in Node,
   builds the answer straight from each item's own key (choices, `accept`, `pairs`, `parts`, O/X), and
   grades it with `MRJ_ENGINE.gradeItem`. An item whose own keyed answer cannot score correct can never
   be passed by a student, so it is a hole even when every word is on screen.

## Coverage

| bookId | practices | items | failing items found | fixed |
| --- | ---: | ---: | ---: | ---: |
| zap-blue-1 | 85 | 1822 | 0 | — |
| zap-blue-2 | 88 | 1987 | 0 | — |
| zap-blue-3 | 90 | 1887 | 0 | — |
| zap-blue-4 | 84 | 1790 | 0 | — |
| zap-green-1 (`data/green1/unit01` + catalog `zap-green-1`) | 14 | 320 | 0 | — |
| green1 (`bookId zap-green1`, `data/green1`) | 63 | 1025 | 0 | — |
| zap-green-2 | 78 | 1446 | 0 | — |
| zap-green-3 | 78 | 1377 | 0 | — |
| zap-green-4 | 78 | 1369 | 0 | — |
| red1 | 66 | 913 | 0 | — |
| red2 | 66 | 878 | 0 | — |
| chunilmun-grammar-1 | 248 | 2008 | 108 | 106 |
| chunilmun-grammar-2 | 244 | 1934 | 1 | 0 |
| **total** | **1283** | **18756** | **109** | **106** |

House audit after the fixes: **0** sheet-text hits, **0** picture hits.
Stricter pass after the fixes: 72 cards flagged, all in the four "checked and left" classes below
(68 ellipsis-as-blank cards, 3 duplicate distractors, the 1 movie-club card); no new class appeared.
Key check after the fixes: **0 / 18756** items whose keyed answer fails to score.

## What was wrong, and what was changed

### 1. 104 write-in items whose boxes and key could never meet — fixed

The printed stem can split a phrase over more boxes than the key has words (or the other way round).
`matchBlanks` compared box by box and only when the counts were equal, so these 104 items in
천일문 Grammar 1 graded **false for every possible answer**. They showed a full stem, so the house
audit passed them and they were invisible until the key check.

Fix, both parts:

- `assets/js/normalize.js` — new `joinedBlankMatch` fallback: when the per-box comparison fails, the
  boxes are read as one phrase, word for word in order, and compared with the keyed phrase. Grouping
  no longer decides the score; word order still does.
- Data, so the printed form is honest again: 47 items whose printed stem has one run of underscores
  now have one box (`blanks: 1`); 23 two-sentence items (prepositions) carry one pipe tuple instead of
  two single-word keys; 7 stems lost the boxes the answer does not fill; 2 What/How keys gained the
  noun their own source sentence prints (movie, T-shirt); 1 no-running-sign card went from 4 boxes to
  the 3 words of its key; 1 보기-number item went from 1 box to its 2 printed labels.

### 2. 4 practices that were never in the catalog — fixed

`data/chunilmun1/chapter05/wb-c05-u3-A…D.json` (34 items) existed but no catalog entry pointed at
them, so students could not reach them. Added as `WB Unit 3 A–D` under 천일문 Grammar 1 · WB Chapter 05.
Catalog now covers all 1283 practices (checked both ways: no orphan file, no dead entry).

### 3. Open: 2 cards need a page that is not in the book PDF

`data/chunilmun1/chapter12/c12-test.json` — `q16a` (16-1) and `q16b` (16-2). Both ask the student to
correct two marked words in a movie-club notice, but the card shows the notice as
`Join the English movie club! … ⓐ discuss … ⓔ sends …` and `q16b` only says `(위 지문)`. The answer key
(답지, PDF p.286) confirms ⓐ discussing and ⓔ send, but the notice itself is nowhere in
`천일문grammar중1.pdf` (pages 216–300 were OCR'd; the passage does not appear) and not in the extract.
Without the surrounding words a student can only guess the -ing form. **Not fixed: needs the page text.**

**Deferred 2026-11-06 KST (CoS call):** both cards are out of the student path. `data/chunilmun1/chapter12/c12-test.json`
carries them under a top-level `deferred` array (labels **16-1**, **16-2**; reason `needs SB pp.155-157`), the
`16` section reports `itemCount 0` and `deferred: true`, `sectionsVersion` is 4 so half-finished drafts clear,
and the intro no longer lists [16]. The practice keeps its other 18 items and stays live, so no practice went
dark. The workbook PDF in Drive is the WORKBOOK (`천일문grammar중1.pdf`: PDF p.155 = WB p.2), so the student-book
pages are not available anywhere on this Mac. When the pages arrive, the two cards go back with the notice text.

### 4. Not flags, checked and left

- 68 cards use `…` as the blank marker with the cue words beside it (e.g. `( the children, be ) … happy
  then?`, section instruction says to make a question). Answerable; the ellipsis is the blank.
- 3 cards print the same distractor twice (`천일문 Grammar 1` wb-c02-test 2, wb-c08-test 6,
  `천일문 Grammar 2` c07-test 8). The keyed choice still grades correct, so the card can be done; the
  duplicate option is a print copy error, not a printout dependency. Left unchanged rather than invent
  the missing option.
- RedZap number cards (`prompt 1..20`, answer `one…twenty`) are spelling tasks, not empty cards.

## The `because` question Jay saw

Every `because` item in the 12 books was pulled (263 items) and checked one by one. None is missing its
stem, its choices, its picture cue, or its passage: the Zap lanes do not have the hole Jay expected.
The hole is in the middle-school copy: `bekbal-unit-practice`, 중1 능률 김기택 Lesson 08
`reading-lexgram.json` items **6** and **18** show only `[ because / other ]` with the placeholder
choices `because / wrong / items / quickly / them` — no passage, no real distractors. Detail and the
full middle-school list go to Fujimoto for Middle School Tests; that repo was not touched.
