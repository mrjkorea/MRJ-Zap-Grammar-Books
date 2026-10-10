/* Smoke-grade every BlueZap 1 Unit 08 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue1/unit08");
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
    if (
      it.type !== "mc" &&
      it.type !== "sentence" &&
      it.promptEn &&
      /[A-Za-z]/.test(it.promptEn) &&
      !/^단어 |^문장 /.test(it.promptEn) &&
      !it.promptKo &&
      !/_____/.test(it.promptEn) &&
      !/^A:/.test(it.promptEn) &&
      !/<u>/.test(it.promptEn)
    ) {
      bad++;
      console.log("NO-PROMPT-KO", f, it.id);
    }
    if (it.type === "fill" && (it.blanks || 1) > 1 && it.unordered) {
      const parts = it.accept[0].split("|");
      if (parts.length === 2) {
        const ok1 = E.gradeItem(it, { parts: [parts[0], parts[1]] });
        const ok2 = E.gradeItem(it, { parts: [parts[1], parts[0]] });
        if (!ok1 || !ok2) {
          bad++;
          console.log("UNORDERED-FAIL", f, it.id);
        }
      }
    }
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
      right = { value: "  " + String(it.accept[0]).toUpperCase() + "  " };
      wrong = { value: "nope" };
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrong);
    if (!r || w) {
      bad++;
      console.log("GRADE", f, it.id, "r", r, "w", w, "accept", it.accept[0]);
    }
  }
}
console.log("SMOKE", { files: fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).length, total, bad });
process.exit(bad ? 1 : 0);
