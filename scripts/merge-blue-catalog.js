/* Merge zap-blue-1..4 units + exercises into catalog.js from unit PR branches */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const catalogPath = path.join(REPO, "assets/js/catalog.js");

const BLUE = {
  1: {
    units: [
      ["01", null],
      ["02", "cursor/blue1-unit02-845a"],
      ["03", "cursor/blue1-unit03-40b9"],
      ["04", "cursor/blue1-unit04-articles-7872"],
      ["05", "cursor/blue1-unit05-pronouns-16d3"],
      ["06", "cursor/blue1-unit06-pronouns-33f8"],
      ["07", "cursor/blue1-unit07-be-present-5635"],
      ["08", "cursor/blue1-unit08-2be3"],
    ],
  },
  2: {
    units: [
      ["01", "cursor/blue2-unit01-541c"],
      ["02", "cursor/blue2-unit02-44d7"],
      ["03", "cursor/blue2-unit03-d506"],
      ["04", "cursor/blue2-unit04-some-any-1364"],
      ["05", "cursor/blue2-unit05-5d8c"],
      ["06", "cursor/blue2-unit06-1a4f"],
      ["07", "cursor/blue2-unit07-2d07"],
      ["08", "cursor/blue2-unit08-prepositions-6b5f"],
    ],
  },
  3: {
    units: [
      ["01", "cursor/bluezap3-unit01-62c9"],
      ["02", "cursor/blue3-unit02-4e69"],
      ["03", "cursor/blue3-unit03-there-it-fca5"],
      ["04", "cursor/blue3-unit04-7d7b"],
      ["05", "cursor/blue3-unit05-6f46"],
      ["06", "cursor/blue3-unit06-past-be-76ef"],
      ["07", "cursor/blue3-unit07-dcb6"],
      ["08", "cursor/blue3-unit08-4c8e"],
    ],
  },
  4: {
    units: [
      ["01", "cursor/blue4-unit01-992b"],
      ["02", "cursor/blue4-unit02-will-7128"],
      ["03", "cursor/blue4-unit03-bc80"],
      ["04", "cursor/blue4-unit04-32e6"],
      ["05", "cursor/blue4-unit05-2dd6"],
      ["06", "cursor/blue4-unit06-d881"],
      ["07", "cursor/blue4-unit07-tag-questions-a002"],
      ["08", "cursor/blue4-unit08-706f"],
    ],
  },
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

function extractUnitsArray(src, bookId) {
  return extractBlock(src, bookId);
}

function unitLineFromBookUnits(unitsArraySrc, unitId) {
  const re = new RegExp(`\\{ id: "unit-${unitId}"[^}]+\\}`);
  const m = unitsArraySrc.match(re);
  if (!m) throw new Error("no unit-" + unitId + " in units array");
  return m[0];
}

function upsertExerciseBlock(cat, key, blockWithComma) {
  const esc = key.replace(/:/g, "\\:");
  const re = new RegExp(`    "${esc}":\\s*\\[[\\s\\S]*?\\],\\n`);
  if (re.test(cat)) return cat.replace(re, blockWithComma + "\n");
  const anchor = /(    "zap-blue-1:unit-01": \[[\s\S]*?\],\n)/;
  if (anchor.test(cat)) {
    return cat.replace(anchor, `$1${blockWithComma}\n`);
  }
  const endEx = /(\n  \};\n\n  function unitKey)/;
  if (endEx.test(cat)) return cat.replace(endEx, `\n${blockWithComma}\n$1`);
  throw new Error("cannot insert exercise " + key);
}

function setUnitsArray(cat, bookId, unitLines) {
  const unitsRe = new RegExp(`"${bookId}":\\s*\\[[\\s\\S]*?\\],`);
  if (unitsRe.test(cat)) {
    return cat.replace(unitsRe, `"${bookId}": [\n${unitLines.join("\n")}\n    ],`);
  }
  const insRe = /("zap-blue-1": \[[\s\S]*?\],)\n/;
  if (insRe.test(cat)) {
    return cat.replace(
      insRe,
      `$1\n    "${bookId}": [\n${unitLines.join("\n")}\n    ],\n`
    );
  }
  throw new Error("missing UNITS anchor for " + bookId);
}

let cat = fs.readFileSync(catalogPath, "utf8");
const mainSrc = gitShow("HEAD", "assets/js/catalog.js");

for (const n of [1, 2, 3, 4]) {
  const bookId = `zap-blue-${n}`;
  cat = cat.replace(
    new RegExp(`\\{ id: "${bookId}", title: "ZAP Blue ${n}", enabled: false \\}`),
    `{ id: "${bookId}", title: "ZAP Blue ${n}", enabled: true, appName: "BlueZap ${n}", bookTitle: "ZAP Blue ${n}" }`
  );
  const unitLines = [];
  for (const [u, ref] of BLUE[n].units) {
    const src = ref ? gitShow(`origin/${ref}`, "assets/js/catalog.js") : mainSrc;
    const unitsArr = extractUnitsArray(src, bookId);
    unitLines.push("      " + unitLineFromBookUnits(unitsArr, u) + ",");
  }
  cat = setUnitsArray(cat, bookId, unitLines);

  for (const [u, ref] of BLUE[n].units) {
    if (!ref) continue;
    const src = gitShow(`origin/${ref}`, "assets/js/catalog.js");
    const key = `${bookId}:unit-${u}`;
    const block = `    "${key}": ${extractBlock(src, key)},`;
    cat = upsertExerciseBlock(cat, key, block);
  }
}

fs.writeFileSync(catalogPath, cat);
console.log("catalog.js updated for zap-blue-1..4");
