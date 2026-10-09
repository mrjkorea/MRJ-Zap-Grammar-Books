/* One-off: splice zap-green-2 UNITS + EXERCISES from unit PR branches into catalog.js */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const catalogPath = path.join(REPO, "assets/js/catalog.js");
const branches = [
  ["01", "cursor/green2-unit01-59c8"],
  ["02", "cursor/green2-unit02-0736"],
  ["03", "cursor/green2-unit03-08bb"],
  ["04", "cursor/green2-unit04-0920"],
  ["05", "cursor/green2-unit05-9731"],
  ["06", "cursor/green2-unit06-88b2"],
  ["07", "cursor/green2-unit07-64cf"],
  ["08", "cursor/green2-unit08-b2df"],
  ["tests", "cursor/green2-cumulative-tests-2197"],
];

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

function unitLineFromBranch(ref, unitId) {
  const src = execSync(`git show origin/${ref}:assets/js/catalog.js`, { encoding: "utf8" });
  const re = new RegExp(`\\{ id: "unit-${unitId}"[^}]+\\}`);
  const m = src.match(re);
  if (!m) throw new Error("no unit-" + unitId + " in " + ref);
  return m[0];
}

let unitLines = [];
for (const [u, ref] of branches.slice(0, 8)) {
  const line = unitLineFromBranch(ref, u);
  unitLines.push("      " + line + ",");
}
unitLines.push('      { id: "tests", title: "Review & Final Tests", enabled: true },');

const exerciseBlocks = branches.map(([u, ref]) => {
  const src = execSync(`git show origin/${ref}:assets/js/catalog.js`, { encoding: "utf8" });
  const key = u === "tests" ? "zap-green-2:tests" : `zap-green-2:unit-${u}`;
  const block = extractBlock(src, key);
  return `    "${key}": ${block},`;
});

let cat = fs.readFileSync(catalogPath, "utf8");

cat = cat.replace(
  /\{ id: "zap-green-2", title: "ZAP Green 2", enabled: false \}/,
  '{ id: "zap-green-2", title: "ZAP Green 2", enabled: true, appName: "GreenZap 2", bookTitle: "ZAP Green 2" }'
);

if (!cat.includes('"zap-green-2":')) {
  cat = cat.replace(
    /("zap-green-3": \[[\s\S]*?\],)\n  \};/,
    `$1\n    "zap-green-2": [\n${unitLines.join("\n")}\n    ],\n  };`
  );
} else {
  cat = cat.replace(/"zap-green-2":\s*\[[\s\S]*?\],/, `"zap-green-2": [\n${unitLines.join("\n")}\n    ],`);
}

for (const [u] of branches) {
  const key = u === "tests" ? "zap-green-2:tests" : `zap-green-2:unit-${u}`;
  const re = new RegExp(`    "${key.replace(/:/g, "\\:")}":\\s*\\[[\\s\\S]*?\\],\\n`);
  const block = exerciseBlocks.find((b) => b.startsWith(`    "${key}"`));
  if (re.test(cat)) cat = cat.replace(re, block + "\n");
  else {
    cat = cat.replace(/("zap-green-3:unit-01": \[[\s\S]*?\],)\n/, `$1\n${block}\n`);
  }
}

fs.writeFileSync(catalogPath, cat);
console.log("catalog.js updated for zap-green-2");
