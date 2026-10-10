/* Smoke-grade every BlueZap 4 Unit 07 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue4/unit07");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
let total = 0;
let bad = 0;
for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  const ids = d.items.map((it) => it.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) {
    bad++;
    console.log("DUP-ID", f, dup.join(","));
  }
  if (d.sections) {
    for (const s of d.sections) {
      const graded = d.items.filter((it) => !it.displayOnly && it.section === s.id);
      if (graded.length !== s.itemCount) {
        bad++;
        console.log("SECTION-COUNT", f, s.id, "expected", s.itemCount, "got", graded.length);
      }
    }
  }
  for (const it of d.items) {
    if (it.displayOnly) continue;
    if (it.type === "fill" && (it.blanks || 1) > 1 && !it.displayOnly) {
      const hasPipe = (it.accept || []).some((a) => String(a).includes("|"));
      if (!hasPipe) {
        bad++;
        console.log("MULTI-BLANK-NO-PIPE", f, it.id);
      }
    }
    total++;
    let right;
    let wrong;
    if (it.type === "mc") {
      const a = it.accept[0];
      const idx = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
      const pick = idx >= 0 ? it.choices[idx] : a;
      right = { value: pick };
      wrong = { value: it.choices[(it.choices.indexOf(pick) + 1) % it.choices.length] };
    } else if ((it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      right = { parts, value: parts.join(" ") };
      const wp = parts.slice();
      wp[0] = "xyz";
      wrong = { parts: wp, value: wp.join(" ") };
    } else {
      right = { value: it.accept[0] };
      wrong = { value: "nope-xyz" };
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrong);
    if (!r || w) {
      bad++;
      console.log("GRADE", f, it.id, "right", r, "wrong", w, "accept", it.accept && it.accept[0]);
    }
  }
}
console.log("smoke-blue4-unit07:", total, "graded items,", bad, "issues");
process.exit(bad ? 1 : 0);
