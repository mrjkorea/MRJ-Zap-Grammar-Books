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

for (const rel of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(REPO, rel), "utf8"));
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
