/* Smoke-grade Unit Test 01 answers (no browser). */
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

const data = JSON.parse(fs.readFileSync(path.join(REPO, "data/green1/unit01/unit-test-01.json"), "utf8"));

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1) {
    const p = acc.split("|");
    return { parts: p, value: p.join(" ") };
  }
  return { value: acc };
}

let ok = 0;
let graded = 0;
data.items.forEach((item) => {
  if (item.displayOnly) return;
  graded++;
  const resp = respFor(item, item.accept[0]);
  if (resp && E.gradeItem(item, resp)) ok++;
  else console.error("FAIL", item.id, item.label);
});
console.log("Unit Test smoke:", ok, "/", graded);
if (ok !== graded) process.exit(1);
