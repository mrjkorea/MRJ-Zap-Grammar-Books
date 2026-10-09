/* Smoke-grade GreenZap 1 cumulative tests (no browser). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;

const FILES = [
  "data/green1/tests/review-test-01.json",
  "data/green1/tests/review-test-02.json",
  "data/green1/tests/review-test-03.json",
  "data/green1/tests/review-test-04.json",
  "data/green1/tests/final-test-01.json",
  "data/green1/tests/final-test-02.json",
];

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
    const p = String(acc).split("|");
    return { parts: p, value: p.join(" ") };
  }
  return { value: acc };
}

let totalOk = 0;
let totalGraded = 0;

const DELIBERATE_WRONG = /\b(brushs|dryed|How a pretty flower)\b/i;

for (const rel of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(REPO, rel), "utf8"));
  const gradedItems = data.items.filter((it) => !it.displayOnly);
  if (gradedItems.length !== 20) {
    console.error("FAIL", rel, "expected 20 graded items, got", gradedItems.length);
    process.exitCode = 1;
  }
  const sectionLabels = new Set();
  for (const sec of data.sections || []) {
    for (const lb of sec.labels || []) sectionLabels.add(lb);
    const n = (sec.labels || []).length;
    if (n !== sec.itemCount) {
      console.error("FAIL", rel, "section", sec.id, "itemCount", sec.itemCount, "labels", n);
      process.exitCode = 1;
    }
  }
  for (const it of gradedItems) {
    if (!sectionLabels.has(it.label)) {
      console.error("FAIL", rel, it.id, "label", it.label, "not in sections");
      process.exitCode = 1;
    }
    const blanks = it.blanks || (it.type === "fill" ? 1 : 0);
    if (blanks > 1) {
      for (const acc of it.accept || []) {
        const parts = String(acc).split("|");
        if (parts.length !== blanks) {
          console.error("FAIL", rel, it.id, "blanks", blanks, "accept parts", parts.length, acc);
          process.exitCode = 1;
        }
        if (DELIBERATE_WRONG.test(acc)) {
          console.error("FAIL", rel, it.id, "deliberate typo in accept:", acc);
          process.exitCode = 1;
        }
      }
    }
  }
  let ok = 0;
  let graded = 0;
  data.items.forEach((item) => {
    if (item.displayOnly) return;
    graded++;
    const resp = respFor(item, item.accept[0]);
    if (resp && E.gradeItem(item, resp)) ok++;
    else console.error("FAIL", rel, item.id, item.label, item.accept[0]);
  });
  console.log(path.basename(rel), ok, "/", graded);
  totalOk += ok;
  totalGraded += graded;
}

console.log("GZ1 tests smoke:", totalOk, "/", totalGraded);
if (totalOk !== totalGraded) process.exit(1);
