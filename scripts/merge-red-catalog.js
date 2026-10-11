/* Merge zap-red-1 and zap-red-2 units + reviews into catalog.js from unit PR branches */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const catalogPath = path.join(REPO, "assets/js/catalog.js");

const RED1_UNITS = [
  ["01", null],
  ["02", "cursor/red1-unit02-991b"],
  ["03", "cursor/red1-unit03-nouns-f90b"],
  ["04", "cursor/red1-unit04-6af1"],
  ["05", "cursor/red1-unit05-pronouns-4eb3"],
  ["06", "cursor/red1-unit06-4739"],
  ["07", "cursor/red1-unit07-9603"],
  ["08", "cursor/red1-unit08-be-verbs-0dd6"],
  ["09", "cursor/red1-unit09-be-neg-q-7535"],
  ["10", "cursor/red1-unit10-be-neg-q-bb8b"],
];

const RED1_REVIEWS = ["01", "02", "03", "04", "05"];

const RED2_UNITS = [
  ["01", "cursor/red2-unit01-45f1"],
  ["02", "cursor/red2-unit02-333c"],
  ["03", "cursor/red2-unit03-adjectives-e593"],
  ["04", "cursor/red2-unit04-adverbs-24c7"],
  ["05", "cursor/red2-unit05-4089"],
  ["06", "cursor/red2-unit06-e2c2"],
  ["07", "cursor/red2-unit07-present-continuous-3596"],
  ["08", "cursor/red2-unit08-a96d"],
  ["09", "cursor/red2-unit09-can-5e21"],
  ["10", "cursor/red2-unit10-imperatives-d95d"],
];

const RED2_REVIEWS = ["01", "02", "03", "04", "05"];

const RED1_UNIT_TITLES = {
  "01": "Unit 01 — 알파벳과 수 세기",
  "02": "Unit 02 — 명사 (1)",
  "03": "Unit 03 — 명사 (2)",
  "04": "Unit 04 — 관사",
  "05": "Unit 05 — 인칭대명사와 지시대명사",
  "06": "Unit 06 — 인칭대명사의 주격과 목적격",
  "07": "Unit 07 — 인칭대명사의 소유격",
  "08": "Unit 08 — be동사 am, are, is",
  "09": "Unit 09 — be동사의 부정문과 의문문 (1)",
  "10": "Unit 10 — be동사의 부정문과 의문문 (2)",
};

const RED2_UNIT_TITLES = {
  "01": "Unit 01 — 일반동사",
  "02": "Unit 02 — 일반동사의 부정문과 의문문",
  "03": "Unit 03 — 형용사",
  "04": "Unit 04 — 부사와 전치사",
  "05": "Unit 05 — 의문사 (1)",
  "06": "Unit 06 — 의문사 (2)",
  "07": "Unit 07 — 현재 진행형",
  "08": "Unit 08 — 현재 진행형의 부정문과 의문문",
  "09": "Unit 09 — 조동사 can",
  "10": "Unit 10 — 명령문",
};

function gitShow(ref, file) {
  return execSync(`git show ${ref}:${file}`, { encoding: "utf8", cwd: REPO });
}

function extractBlock(src, key) {
  const needle = `"${key}":`;
  const i = src.indexOf(needle);
  if (i < 0) throw new Error("missing " + key);
  const start = src.indexOf("[", i);
  let depth = 0;
  for (let j = start; j < src.length; j++) {
    const c = src[j];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(start, j + 1);
    }
  }
  throw new Error("unclosed block " + key);
}

function removeExerciseKeys(cat, prefix) {
  const re = new RegExp(`    "${prefix.replace(/:/g, "\\:")}[^"]*":\\s*\\[[\\s\\S]*?\\],\\n`, "g");
  return cat.replace(re, "");
}

function insertBeforeCatalogEnd(cat, blocks) {
  const anchor = /\n    "zap-red-1:unit-01":/;
  if (anchor.test(cat)) {
    return cat.replace(anchor, "\n" + blocks.join("\n") + anchor.source.replace(/^\\n/, "\n"));
  }
  const endEx = /(\n  \};\n\n  root\.MRJ_CATALOG)/;
  if (endEx.test(cat)) {
    return cat.replace(endEx, `\n${blocks.join("\n")}\n$1`);
  }
  throw new Error("cannot insert exercises");
}

function setUnitsArray(cat, bookId, unitLines) {
  const unitsRe = new RegExp(`"${bookId}":\\s*\\[[\\s\\S]*?\\],`);
  if (!unitsRe.test(cat)) throw new Error("missing UNITS for " + bookId);
  return cat.replace(unitsRe, `"${bookId}": [\n${unitLines.join("\n")}\n    ],`);
}

function buildRed1UnitLines() {
  const lines = [];
  for (let u = 1; u <= 10; u++) {
    const id = String(u).padStart(2, "0");
    lines.push(`      { id: "unit-${id}", title: "${RED1_UNIT_TITLES[id]}", enabled: true },`);
    if (u % 2 === 0) {
      const rv = String(u / 2).padStart(2, "0");
      lines.push(`      { id: "review-${rv}", title: "Review ${rv}", enabled: true },`);
    }
  }
  return lines;
}

function buildRed2UnitLines() {
  const lines = [];
  for (let u = 1; u <= 10; u++) {
    const id = String(u).padStart(2, "0");
    lines.push(`      { id: "unit-${id}", title: "${RED2_UNIT_TITLES[id]}", enabled: true },`);
    if (u % 2 === 0) {
      const rv = String(u / 2).padStart(2, "0");
      lines.push(`      { id: "review-${rv}", title: "Review ${rv}", enabled: true },`);
    }
  }
  return lines;
}

let cat = fs.readFileSync(catalogPath, "utf8");
const mainSrc = gitShow("origin/main", "assets/js/catalog.js");
const r1ReviewsSrc = gitShow("origin/cursor/red1-reviews-01-05-7911", "assets/js/catalog.js");
const r2ReviewsSrc = gitShow("origin/cursor/red2-reviews-01-05-6370", "assets/js/catalog.js");

cat = cat.replace(
  /\{ id: "zap-red-2", title: "ZAP Red 2", enabled: false/,
  '{ id: "zap-red-2", title: "ZAP Red 2", enabled: true'
);

cat = removeExerciseKeys(cat, "zap-red-1:");
cat = removeExerciseKeys(cat, "zap-red-2:");

const exerciseBlocks = [];

for (const [u, ref] of RED1_UNITS) {
  const key = `zap-red-1:unit-${u}`;
  const src = ref ? gitShow(`origin/${ref}`, "assets/js/catalog.js") : mainSrc;
  exerciseBlocks.push(`    "${key}": ${extractBlock(src, key)},`);
}

for (const rv of RED1_REVIEWS) {
  const key = `zap-red-1:review-${rv}`;
  exerciseBlocks.push(`    "${key}": ${extractBlock(r1ReviewsSrc, key)},`);
}

for (const [u, ref] of RED2_UNITS) {
  const key = `zap-red-2:unit-${u}`;
  const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
  exerciseBlocks.push(`    "${key}": ${extractBlock(src, key)},`);
}

for (const rv of RED2_REVIEWS) {
  const key = `zap-red-2:review-${rv}`;
  exerciseBlocks.push(`    "${key}": ${extractBlock(r2ReviewsSrc, key)},`);
}

cat = setUnitsArray(cat, "zap-red-1", buildRed1UnitLines());
cat = setUnitsArray(cat, "zap-red-2", buildRed2UnitLines());

const anchor = /\n    "zap-red-1:unit-01": \[[\s\S]*?\],\n/;
if (anchor.test(cat)) {
  cat = cat.replace(anchor, "\n" + exerciseBlocks.join("\n") + "\n");
} else {
  cat = cat.replace(/(\n  \};\n\n  root\.MRJ_CATALOG)/, `\n${exerciseBlocks.join("\n")}\n$1`);
}

fs.writeFileSync(catalogPath, cat);
console.log("catalog.js updated for zap-red-1 and zap-red-2");
