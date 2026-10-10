# BlueZap 2 — Unit 03 (형용사) page map

Printed book pages **61–86** (PDF `p0061`–`p0086`). Page **87** is Unit 04 preview only.

| PDF | Book p. | Type | Practice JSON / notes |
|-----|---------|------|------------------------|
| p0061–p0062 | 60–61 | Unit opener & intro | (no practice) |
| p0063 | 62 | Lesson 01 grammar | 형용사의 종류 |
| p0064 | 63 | Grammar Walk | `lesson01-walk1.json` — A circle adjectives, B opposite matching (a–h) |
| p0065 | 64 | Lesson 01 grammar | 기수와 서수 |
| p0066 | 65 | Grammar Walk | `lesson01-walk2.json` — A read numbers (binary MC), B cardinal→ordinal matching |
| p0067–p0068 | 66–67 | Grammar Run | `lesson01-run.json` — A adj+noun (2 blanks, unordered), B cardinal/ordinal MC |
| p0069–p0070 | 68–69 | Grammar Jump | `lesson01-jump.json` — A Korean gloss, B parenthesis MC |
| p0071–p0072 | 70–71 | Grammar Fly | `lesson01-fly.json` — A opposite adj, B fill |
| p0073 | 72 | Lesson 02 grammar | 형용사의 쓰임 (명사 앞) |
| p0074 | 73 | Grammar Walk | `lesson02-walk1.json` — A adj position, B Korean matching |
| p0075 | 74 | Lesson 02 grammar | 주어 설명 형용사 |
| p0076 | 75 | Grammar Walk | `lesson02-walk2.json` — A predicate adj, B equivalent sentence matching |
| p0077–p0078 | 76–77 | Grammar Run | `lesson02-run.json` — A circle modifiers, B word-order MC |
| p0079–p0080 | 78–79 | Grammar Jump | `lesson02-jump.json` — A Korean gloss (16 items), B sentence transform |
| p0081–p0082 | 80–81 | Grammar Fly | `lesson02-fly.json` — A fix word order (sentence), B fill |
| p0083–p0085 | 82–84 | Review 03 | `review-03.json` — sections `1-2` … `19-20`, labels 1–20 |
| p0086 | 85 | Wrap-up chart | (no practice) |
| p0087 | — | Next unit preview | Unit 04 preview (excluded) |

## Timers (minutes)

| Kind | Minutes |
|------|---------|
| Walk | 10 |
| Run | 20 |
| Jump | 24 |
| Fly | 26 |
| Review | 30 |

## Meta (all JSON)

- `bookId`: `zap-blue-2`, `bookTitle`: ZAP Blue 2, `appName`: BlueZap 2  
- `unitId`: `unit-03`, `unitTitle`: Unit 03 — 형용사  
- `practiceId` prefix: `b2:u03:`  
- `sectionsVersion`: 2  

## Grading conventions

- **Examples**: `example: true`, `displayOnly: true` (not scored).
- **Circle tasks**: student types the circled word(s).
- **Matching**: `type: "mc"` with choices `a.`–`h.` (or subset); accept letter + full choice text.
- **Binary MC**: choices `1. word` / `2. word` (book order); accept text, digit, or ①/②.
- **Run L01 A**: two ordered blanks — first 형용사, second 명사 (`adj|noun`; not `unordered`).
- **Run L02 A**: underline the adjective; student types the word they would circle (noun/subject).
- **Review**: banners `1`, `[2–3]`, `[4–5]`, `[6–8]`, `[9–12]`, `[13–16]`, `[17–18]`, `[19–20]`; items 15–16 and 18 use two blanks each (`beautiful|lake`, `famous|actress`, `is|hungry`).
- **Review 19–20**: `type: "sentence"` full rewrite.

Generate: `node scripts/blue2-build/unit03-generate.js` → `data/blue2/unit03/*.json`.
