/* Merge zap-green-3 (units 02–08 + tests) and zap-green-4 into catalog.js */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const catalogPath = path.join(REPO, "assets/js/catalog.js");

const GZ3_TAIL = [
  ["02", "cursor/green3-unit02-a65d"],
  ["03", "cursor/green3-unit03-dec0"],
  ["04", "cursor/green3-unit04-4ec9"],
  ["05", "cursor/green3-unit05-3622"],
  ["06", "cursor/green3-unit06-prepositions-120b"],
  ["07", "cursor/green3-unit07-706a"],
  ["08", "cursor/green3-unit08-c054"],
  ["tests", "cursor/green3-cumulative-tests-d48e"],
];

const GZ4 = [
  ["01", "cursor/green4-unit01-9fba"],
  ["02", "cursor/green4-unit02-3239"],
  ["03", "cursor/green4-unit03-4dcd"],
  ["04", "cursor/green4-unit04-b7f3"],
  ["05", "cursor/green4-unit05-1216"],
  ["06", "cursor/green4-unit06-6b6e"],
  ["07", "cursor/green4-unit07-64f9"],
  ["08", "cursor/green4-unit08-6985"],
  ["tests", "cursor/green4-cumulative-tests-3124"],
];

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

function extractUnitsArray(src, bookId) {
  return extractBlock(src, bookId);
}

function unitLineFromBookUnits(unitsArraySrc, unitId) {
  if (unitId === "tests") {
    const m = unitsArraySrc.match(/\{ id: "tests"[^}]+\}/);
    if (!m) throw new Error("no tests unit in units array");
    return m[0];
  }
  const re = new RegExp(`\\{ id: "unit-${unitId}"[^}]+\\}`);
  const m = unitsArraySrc.match(re);
  if (!m) throw new Error("no unit-" + unitId + " in units array");
  return m[0];
}

function upsertExerciseBlock(cat, key, blockWithComma) {
  const esc = key.replace(/:/g, "\\:");
  const re = new RegExp(`    "${esc}":\\s*\\[[\\s\\S]*?\\],\\n`);
  if (re.test(cat)) return cat.replace(re, blockWithComma + "\n");
  const insRe = /(    "zap-green-3:unit-01": \[[\s\S]*?\],\n)/;
  if (insRe.test(cat)) return cat.replace(insRe, `$1${blockWithComma}\n`);
  const endEx = /(\n  \};\n\n  function unitKey)/;
  if (endEx.test(cat)) return cat.replace(endEx, `\n${blockWithComma}\n$1`);
  throw new Error("cannot insert exercise " + key);
}

function setUnitsArray(cat, bookId, unitLines) {
  const unitsRe = new RegExp(`"${bookId}":\\s*\\[[\\s\\S]*?\\],`);
  if (!unitsRe.test(cat)) {
    return cat.replace(
      /("zap-green-3": \[[\s\S]*?\],)\n(\s+"zap-green-2":)/,
      `$1\n    "${bookId}": [\n${unitLines.join("\n")}\n    ],\n$2`
    );
  }
  return cat.replace(unitsRe, `"${bookId}": [\n${unitLines.join("\n")}\n    ],`);
}

let cat = fs.readFileSync(catalogPath, "utf8");
const mainSrc = gitShow("origin/main", "assets/js/catalog.js");
const mainGz3Units = extractUnitsArray(mainSrc, "zap-green-3");

cat = cat.replace(
  /\{ id: "zap-green-4", title: "ZAP Green 4", enabled: false \}/,
  '{ id: "zap-green-4", title: "ZAP Green 4", enabled: true, appName: "GreenZap 4", bookTitle: "ZAP Green 4" }'
);

const gz3Units = ["      " + unitLineFromBookUnits(mainGz3Units, "01") + ","];
for (const [u, ref] of GZ3_TAIL) {
  const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
  const unitsArr = extractUnitsArray(src, "zap-green-3");
  gz3Units.push("      " + unitLineFromBookUnits(unitsArr, u) + ",");
}
cat = setUnitsArray(cat, "zap-green-3", gz3Units);

for (const [u, ref] of GZ3_TAIL) {
  const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
  const key = u === "tests" ? "zap-green-3:tests" : `zap-green-3:unit-${u}`;
  const block = `    "${key}": ${extractBlock(src, key)},`;
  cat = upsertExerciseBlock(cat, key, block);
}

const gz4Units = [];
for (const [u, ref] of GZ4) {
  const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
  const unitsArr = extractUnitsArray(src, "zap-green-4");
  gz4Units.push("      " + unitLineFromBookUnits(unitsArr, u) + ",");
}
cat = setUnitsArray(cat, "zap-green-4", gz4Units);

for (const [u, ref] of GZ4) {
  const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
  const key = u === "tests" ? "zap-green-4:tests" : `zap-green-4:unit-${u}`;
  const block = `    "${key}": ${extractBlock(src, key)},`;
  cat = upsertExerciseBlock(cat, key, block);
}

fs.writeFileSync(catalogPath, cat);
console.log("catalog.js updated for zap-green-3 and zap-green-4");
