/* Smoke-grade GreenZap 3 cumulative tests (no browser). */
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
  "data/green3/tests/review-test-01.json",
  "data/green3/tests/review-test-02.json",
  "data/green3/tests/review-test-03.json",
  "data/green3/tests/review-test-04.json",
  "data/green3/tests/final-test-01.json",
  "data/green3/tests/final-test-02.json",
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

for (const rel of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(REPO, rel), "utf8"));
  const gradedItems = data.items.filter((it) => !it.displayOnly);
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
      }
    }
  }
  let ok = 0;
  let graded = 0;
  for (const item of data.items) {
    if (item.displayOnly) continue;
    graded++;
    for (const acc of item.accept || []) {
      const resp = respFor(item, acc);
      if (resp && !E.gradeItem(item, resp)) {
        console.error("ACCEPT-FAIL", rel, item.id, acc);
        process.exitCode = 1;
      }
    }
    const resp = respFor(item, item.accept[0]);
    if (resp && E.gradeItem(item, resp)) ok++;
    else console.error("FAIL", rel, item.id, item.label, item.accept[0]);
  }
  console.log(path.basename(rel), ok, "/", graded, "practiceId", data.practiceId);
  totalOk += ok;
  totalGraded += graded;
}

console.log("GZ3 tests smoke:", totalOk, "/", totalGraded);
if (totalOk !== totalGraded) process.exit(1);
