# Sheet-standalone audit

Every practice JSON under `data/` was scanned. A hit is an item a student cannot answer from the on-screen text. Cropped pictures already stored on an item are allowed. Full page scans are not.

- Practice files scanned: **1283** (every `data/**/*.json` with a `practiceId`)
- Items scanned: **18756**
- Hits still open: **0**
- Items fixed in this change: **21**

## Coverage by book

| bookId | files | items | open hits |
| --- | ---: | ---: | ---: |
| chunilmun-grammar-1 | 248 | 2008 | 0 |
| chunilmun-grammar-2 | 244 | 1934 | 0 |
| green1 | 64 | 1025 | 0 |
| red1 | 11 | 172 | 0 |
| red2 | 31 | 389 | 0 |
| zap-blue-1 | 85 | 1822 | 0 |
| zap-blue-2 | 88 | 1987 | 0 |
| zap-blue-3 | 90 | 1887 | 0 |
| zap-blue-4 | 84 | 1790 | 0 |
| zap-green-1 | 1 | 25 | 0 |
| zap-green-2 | 78 | 1446 | 0 |
| zap-green-3 | 78 | 1377 | 0 |
| zap-green-4 | 78 | 1369 | 0 |
| zap-green1 | 13 | 295 | 0 |
| zap-red-1 | 55 | 741 | 0 |
| zap-red-2 | 35 | 489 | 0 |

## Fixed

| bookId | practiceId | label | reason | fix |
| --- | --- | --- | --- | --- |
| chunilmun-grammar-1 | cm1:wb-c04:test | 1 | Choice wording did not match the printed options. | Choices now match the workbook: speak French / plays the piano / ski / run fast / bake cookies. Accept stays ② (can + plays). |
| chunilmun-grammar-1 | cm1:wb-c04:test | 3 | <보기> sentence did not match the printed item. | Stem is “The players have to follow the rules.” with have to underlined, plus the Korean gloss. Accept stays ④ must. |
| chunilmun-grammar-1 | cm1:wb-c04:test | 5 | 우리말 item showed the finished sentence, so the Korean prompt was missing and the answer was already filled in. | Blank stem “We ______ steal others' money.” plus Korean “우리는 다른 사람의 돈을 훔치면 안 된다.” Accept stays ③ must not. |
| chunilmun-grammar-1 | cm1:wb-c04:test | 10 | Write-in showed the finished sentence and no Korean. | Blank stem “We ________ worry about it.” plus Korean “우리는 그것에 대해 걱정할 필요가 없다.” Accept stays don't have to. |
| chunilmun-grammar-1 | cm1:wb-c04:test | 11 | UI showed only combination bubbles (①, ④ …) with no sentences. Accept ④ did not match the answer key. | Five source sentences are on the card (English reconstructed from the 해설 error types; Korean is the 해설 해석). Combinations stay. Accept is now ① (① and ④ are ungrammatical). |
| chunilmun-grammar-1 | cm1:wb-c04:test | 16 | The grammatical sentence was in bubble ⑤. The key’s correct bubble is ④, and the singular-subject error is Sora, not Sujin. | “I can't understand his story.” is bubble ④. Bubble ⑤ is “Sora don't have to use the Internet.” Accept is ④. |
| chunilmun-grammar-1 | cm1:c04:test | 9 | Combination bubbles omitted the correct pair. The 해설 says ③ and ④ are ungrammatical, and that pair was not in the choice list. | The five sentences are the choices (multi-select). Accept is 3|4. English follows the 해설 errors (can made, John don't have to); Korean is the 해설 해석. |
| chunilmun-grammar-1 | cm1:c04:test | 15 | Letter combinations did not match the printed item. The key is the restroom dialogue, answer ②. | Dialogue is on the card (May I use the restroom? / Thank you.). Bubble ② is “Yes, you may.” The other four replies are not printed in the 해설; they are distractors so the keyed bubble stays ②. |
| chunilmun-grammar-1 | cm1:c04:test | 16-1 | Instruction says 표를 보고, but the card showed only the finished sentence. | Text table: Susan piano O, Susan Chinese O, Andy Chinese X. Andy’s piano cell is left blank because the key does not state it. Accept stays can play the piano. |
| chunilmun-grammar-1 | cm1:c04:test | 16-2 | Same missing table as 16-1. | Same text table. Accept stays can speak Chinese. |
| chunilmun-grammar-1 | cm1:c04:test | 16-3 | Same missing table as 16-1. | Same text table. Accept stays can't / cannot speak Chinese. |
| chunilmun-grammar-1 | cm1:c05:test | 15-2 | The second correction card was only “(2) ________ → ________”. | The zoo lines that contain ⓐ and ⓔ are on this card too. The middle of the passage is still an ellipsis in the extract. Accept stays ⓔ / hours. |
| chunilmun-grammar-1 | cm1:c06:test | 15-2 | The second correction card did not include the paragraph. | Grace’s garden paragraph is on the card. Accept stays flower → flowers. |
| chunilmun-grammar-1 | cm1:c07:test | 15-2 | The second correction card did not include the dialogue. | The bag dialogue is on the card. Accept stays more light → lighter. |
| zap-green-4 | g4:u08:wrap | 1-2 | The card showed only “→ [2]”. | The if clause is on the card. Accept stays 조건. |
| zap-green-4 | g4:u08:wrap | 1-6 | The card showed only “→ [6]”. | The clause the blank finishes is on the card. Accept stays ~한다면. |
| zap-green-4 | g4:u08:wrap | 2-2 | The card showed only “→ [2]”. | The that-clause roles are on the card. Accept stays 목적어. |
| chunilmun-grammar-1 | cm1:wb-c06:test | 11 | The card said “Group It by usage (a–f)” with only letter groups. | Printed WB p.47 sentences ⓐ–ⓕ are on the card, with it underlined. Combinations stay ⓐⓔⓕ / ⓐⓑⓓ / ⓐⓒⓓ / ⓑⓓⓕ / ⓒⓓⓔ. Accept stays 5 / ⑤ (ⓒ, ⓓ, ⓔ). |
| chunilmun-grammar-1 | cm1:wb-c07:test | 9 | The card showed only combination bubbles, so the five sentences were missing. | Printed WB p.55 sentences ①–⑤ are on the card. Combinations stay ①② / ②③ / ②⑤ / ③⑤ / ②③⑤. Accept stays 5 / ⑤ (②, ③, ⑤). |
| chunilmun-grammar-1 | cm1:wb-c08:test | 14 | The card showed only combination bubbles, so the five sentences were missing. | Printed WB p.63 sentences ①–⑤ are on the card. Combinations stay ①③ / ③④ / ③④⑤ / ②④ / ①⑤. Accept stays 2 / ② (③, ④). |
| chunilmun-grammar-1 | cm1:wb-c08:test | 15 | The card showed only letter groups, so sentences ⓐ–ⓕ were missing. | Printed WB p.63 sentences ⓐ–ⓕ are on the card. Combinations stay as printed. Accept stays 4 / ④ (ⓑ, ⓒ, ⓓ). |

## Open hits

None.

## Not flagged

Generic “보기 중에서 고르세요” instructions are the app’s choice rule, not a missing `<보기>` box. Items whose choices are full sentences, whose prompt already contains the ⓐ–ⓔ lines, or whose picture is a cropped task image are standalone. A Korean gloss is required only when the English on the card does not determine the answer.

WB Chapter 04 item 13 still uses the paper / food-waste prompts (two blanks). The answer key’s health trio is a different item. Those two blanks are answerable on screen, so they are not hits.
