/* Verify Korean accept variants grade correctly (extra strings in gz1-korean-variants.json). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;

const variants = JSON.parse(fs.readFileSync(path.join(__dirname, "gz1-korean-variants.json"), "utf8"));
let bad = 0;
let tested = 0;

for (const entry of variants.entries) {
  const fp = path.join(REPO, entry.file);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  const it = data.items.find((i) => i.id === entry.id);
  if (!it) {
    bad++;
    console.log("FAIL no item", entry.file, entry.id);
    continue;
  }
  for (const ans of entry.mustPass) {
    tested++;
    const resp =
      (it.blanks || 1) > 1 || String(ans).includes("|")
        ? { parts: String(ans).split("|"), value: String(ans).replace(/\|/g, " ") }
        : { value: ans };
    if (!E.gradeItem(it, resp)) {
      bad++;
      console.log("FAIL should pass", entry.file, entry.id, ans);
    }
  }
  for (const ans of entry.mustFail || []) {
    tested++;
    const resp = { value: ans };
    if (E.gradeItem(it, resp)) {
      bad++;
      console.log("FAIL should fail", entry.file, entry.id, ans);
    }
  }
}

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`GreenZap 1 Korean variant smoke: OK (${tested} checks, ${variants.entries.length} items)`);
