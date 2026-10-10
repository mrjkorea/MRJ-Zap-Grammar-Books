/* Smoke-grade BlueZap 4 Unit 08 (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue4/unit08");
const MODES = new Set(["choice", "words", "sentence"]);
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;

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
function wrongFor(it) {
  if (it.type === "mc") {
    const r = respFor(it, it.accept[0]);
    const i = it.choices.indexOf(r.value);
    return { value: it.choices[(i + 1) % it.choices.length] };
  }
  if ((it.blanks || 1) > 1) {
    const p = it.accept[0].split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

let bad = 0;
let graded = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const where = "unit08/" + f;
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  const ids = d.items.map((it) => it.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail("DUP-ID", where, dup.join(","));

  if (d.sections) {
    for (const s of d.sections) {
      if (!MODES.has(s.answerMode)) fail("BAD-MODE", where, s.id, s.answerMode);
      const g = d.items.filter((it) => !it.displayOnly && it.section === s.id);
      if (g.length !== s.itemCount) fail("SECTION-COUNT", where, s.id, "expected", s.itemCount, "got", g.length);
    }
  }

  for (const it of d.items) {
    if (it.displayOnly) continue;
    graded++;
    const right = respFor(it, it.accept[0]);
    const wrong = wrongFor(it);
    if (!E.gradeItem(it, right) || E.gradeItem(it, wrong)) fail("GRADE", where, it.id);
    for (const acc of it.accept) {
      const r = respFor(it, acc);
      if (r && !E.gradeItem(it, r)) fail("ACCEPT", where, it.id, acc);
    }
  }
}

console.log("smoke-blue4-unit08:", graded, "graded items,", bad, "issues");
process.exit(bad ? 1 : 0);
