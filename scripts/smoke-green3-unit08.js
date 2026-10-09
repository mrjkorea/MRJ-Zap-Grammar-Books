/* Smoke-grade every GZ3 Unit 08 item with the repo's own normalize.js + engine.js gradeItem. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/green3/unit08");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
let total = 0;
let bad = 0;
let auditBad = 0;
for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  const seen = new Set();
  for (const it of d.items) {
    if (seen.has(it.id)) {
      auditBad++;
      console.log("DUP-ID", f, it.id);
    }
    seen.add(it.id);
    if (it.noteKo) {
      auditBad++;
      console.log("NOTEKO", f, it.id, it.noteKo);
    }
    if (it.type === "mc" && it.choices && it.choices.length >= 2) {
      for (const acc of it.accept || []) {
        if (/^\d$/.test(acc)) continue;
        if (it.choices.indexOf(acc) < 0 && !/^[①②③④⑤]/.test(acc)) {
          auditBad++;
          console.log("MC-ACCEPT-NOT-IN-CHOICES", f, it.id, acc);
        }
      }
    }
  }
  let ok = 0;
  for (const it of d.items) {
    if (it.displayOnly) continue;
    total++;
    let right;
    let wrong;
    if (it.type === "mc") {
      const a = it.accept[0];
      const idx = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
      right = { value: it.choices[idx >= 0 ? idx : 0] };
      wrong = { value: it.choices[(idx + 1) % it.choices.length] };
    } else if ((it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      right = { parts, value: parts.join(" ") };
      const wp = parts.slice();
      wp[0] = "xyz";
      wrong = { parts: wp, value: wp.join(" ") };
    } else {
      right = { value: "  " + it.accept[0].toUpperCase() + "  " };
      wrong = { value: "nope" };
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrong);
    if (r && !w) ok++;
    else {
      bad++;
      console.log("FAIL", f, it.id, JSON.stringify(right), r, w);
    }
    for (const acc of it.accept) {
      let resp;
      if (it.type === "mc") {
        const i2 = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
        if (i2 < 0) continue;
        resp = { value: it.choices[i2] };
      } else if ((it.blanks || 1) > 1) {
        const p = acc.split("|");
        resp = { parts: p, value: p.join(" ") };
      } else resp = { value: acc };
      if (!E.gradeItem(it, resp)) {
        bad++;
        console.log("ACCEPT-FAIL", f, it.id, acc);
      }
    }
  }
  console.log(f.padEnd(22), (d.practiceId || "").padEnd(16), "items", d.items.length, "ok", ok, "timer", d.timerMinutes);
}
if (auditBad) console.log("AUDIT FLAGS: " + auditBad);
console.log(
  bad || auditBad
    ? "FAILURES: " + bad + (auditBad ? " audit=" + auditBad : "")
    : "ALL " + total + " ITEMS GRADE CORRECTLY (right=pass, wrong=fail)"
);
process.exit(bad || auditBad ? 1 : 0);
