/* Smoke-grade every BlueZap 2 Unit 03 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue2/unit03");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const N = win.MRJ_NORMALIZE;
let total = 0;
let bad = 0;

for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  if (d.bookId !== "zap-blue-2" || d.appName !== "BlueZap 2") {
    bad++;
    console.log("META", f);
  }
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
  let ok = 0;
  for (const it of d.items) {
    if (it.displayOnly) continue;
    if (
      it.type !== "mc" &&
      it.promptEn &&
      /[A-Za-z]/.test(it.promptEn) &&
      !/^단어 |^문장 /.test(it.promptEn) &&
      !it.promptKo &&
      f !== "lesson01-jump.json"
    ) {
      bad++;
      console.log("NO-PROMPT-KO", f, it.id);
    }
    if (f === "lesson01-run.json" && it.section === "A" && !it.displayOnly) {
      if (!it.unordered || it.blanks !== 2) {
        bad++;
        console.log("RUN-A-UNORDERED", f, it.id);
      }
    }
    total++;
    let right;
    let wrong;
    if (it.type === "mc") {
      const a = it.accept[0];
      const idx = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
      right = { value: it.choices[idx >= 0 ? idx : 0] };
      wrong = { value: it.choices[(idx + 1 + it.choices.length) % it.choices.length] };
    } else if ((it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      right = { parts, value: parts.join(" ") };
      const wp = parts.slice();
      wp[0] = "xyz";
      wrong = { parts: wp, value: wp.join(" ") };
      if (it.unordered && parts.length === 2) {
        const rev = { parts: [parts[1], parts[0]], value: parts[1] + " " + parts[0] };
        if (!E.gradeItem(it, rev)) {
          bad++;
          console.log("UNORDERED-FAIL", f, it.id);
        }
      }
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
        if (i2 < 0 && acc.length === 1) {
          const letter = acc + ".";
          const found = it.choices.findIndex((c) => c.startsWith(letter));
          if (found < 0) continue;
          resp = { value: it.choices[found] };
        } else if (i2 < 0) continue;
        else resp = { value: it.choices[i2] };
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
  console.log(f.padEnd(24), (d.practiceId || "").padEnd(28), "graded", d.items.filter((x) => !x.displayOnly).length, "ok", ok, "timer", d.timerMinutes);
}
console.log(bad ? "FAILURES: " + bad : "ALL " + total + " GRADED ITEMS PASS SMOKE");
process.exit(bad ? 1 : 0);
