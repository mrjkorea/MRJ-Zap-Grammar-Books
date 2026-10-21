/* One-off hand fixes (2026-10-21) for blank/box mismatches the aligner cannot decide. Idempotent. */
const fs = require("fs");
const path = require("path");
const REPO = path.join(__dirname, "..");
const SHARED_NOTE = "※ 두 빈칸에 공통으로 들어갈 한 단어를 한 번만 쓰세요.";
const PHRASE_NOTE = "※ 이 문항은 한 칸에 두 단어 이상을 쓸 수 있어요.";
const edits = {
  "data/blue2/unit05/lesson02-jump.json": Object.fromEntries(["j2c17", "j2c18", "j2c19", "j2c22", "j2c24", "j2c26"].map((id) => [id, (it) => { it.promptEn = it.promptEn.replace(/_{2,} _{2,}/, "______"); }])),
  "data/blue2/unit06/lesson02-jump.json": Object.fromEntries(Array.from({ length: 14 }, (_, i) => ["a" + String(i + 2).padStart(2, "0"), (it) => {
    it.promptEn = it.promptEn.split("\n").filter((l) => l.trim() !== String(it.promptKo).trim()).join("\n");
  }])),
  "data/blue3/unit08/review-08.json": { r14: (it) => { it.promptEn = it.promptEn.replace(/(_{2,} ){4}garden/, "______ ______ ______ garden"); } },
  "data/blue4/unit05/lesson02-jump.json": {
    b08: (it) => { it.promptEn = it.promptEn.replace(/(_{2,} ){3}books/, "______ ______ books"); },
    b13: (it) => { it.promptEn = it.promptEn.replace(/(_{2,} ){3}day/, "______ ______ day"); },
  },
  "data/green1/unit03/jump.json": { b05: (it) => { it.promptEn = it.promptEn.replace(/(_{2,} ){4}fourteen/, "______ ______ ______ fourteen"); } },
  "data/green1/unit04/unit-test-04.json": { q23: (it) => { it.promptEn = it.promptEn.replace(/(_{2,} ){4}a text/, "______ ______ ______ a text"); } },
  "data/green2/unit08/walk2.json": Object.fromEntries(["b02", "b03", "b04", "b05", "b06"].map((id) => [id, (it) => { it.promptKo = it.promptKo.replace(/\s*→.*$/, ""); }])),
  "data/green4/unit01/writing.json": { a06: (it) => { it.phraseBlanks = true; } },
  "data/green4/unit08/wrap.json": {
    "wrap-w1": (it) => { it.promptKo = it.promptKo.replace("[2] ______", "[2] ……"); },
    "wrap-w5": (it) => { it.promptKo = it.promptKo.replace("[6] ______", "[6] ……"); },
    "wrap-w7": (it) => { it.promptKo = it.promptKo.replace("[2] ______", "[2] ……"); },
  },
  "data/green3/unit03/writing.json": { a01: (it) => { it.exampleAnswer = "has / taken"; it.blanks = 2; it.accept = ["has|taken"]; } },
};
const shared = { "data/blue4/unit04/review-04.json": ["q13", "q14"], "data/blue4/unit05/review05.json": ["q13", "q14"], "data/blue4/unit06/review06.json": ["rv13", "rv14"] };
for (const [f, ids] of Object.entries(shared)) {
  edits[f] = edits[f] || {};
  ids.forEach((id) => { edits[f][id] = (it) => { it.sharedAnswer = true; }; });
}

// display-only examples: blanks shown must match the example answer (and the graded items below them)
const ex = {
  "data/blue3/unit01/lesson02-fly.json": { b01: (it) => { it.promptEn = it.promptEn.replace(/Hans (_{2,} ){3}the/, "Hans ______ ______ ______ ______ the"); } },
  "data/blue4/unit03/lesson01-walk1.json": { b01: (it) => { it.promptEn = it.promptEn.replace(/→ I'm ___ ___ ___ write/, "→ ___ ___ ___ ___ a"); it.promptEn = it.promptEn.replace("___ a a Christmas", "___ a Christmas"); } },
  "data/blue4/unit05/lesson02-jump.json": { b01: (it) => { it.exampleAnswer = "the / shortest"; } },
  "data/green1/unit04/writing.json": { a01: (it) => { it.promptEn = it.promptEn.replace(/^Superman (_{2,} ){3}_{2,}\./, "Superman ______ ______ ______ ______ ______."); } },
  "data/green2/unit03/walk1.json": { a01: (it) => { it.exampleAnswer = "taller / the / tallest"; } },
  "data/green2/unit03/writing.json": { a01: (it) => { it.exampleAnswer = "faster / the / fastest"; } },
  "data/green3/unit03/fly.json": { b01: (it) => { it.promptEn = it.promptEn.replace(/→ _{2,} …/, "→ He _____ _____ _____ at a post office since last year."); } },
  "data/green4/unit04/fly.json": { a01: (it) => { it.exampleAnswer = "use"; } },
};
for (const [f, byId] of Object.entries(ex)) { edits[f] = Object.assign(edits[f] || {}, byId); }
let n = 0;
for (const [f, byId] of Object.entries(edits)) {
  const p = path.join(REPO, f);
  const d = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const it of d.items) if (byId[it.id]) { byId[it.id](it); n++; }
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
}
console.log("manual edits", n);
