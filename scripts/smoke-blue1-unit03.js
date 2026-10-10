/* Smoke-grade every BlueZap 1 Unit 03 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue1/unit03");
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
  let ok = 0;
  for (const it of d.items) {
    if (it.displayOnly) continue;
    if (
      it.type !== "mc" &&
      it.promptEn &&
      /[A-Za-z]/.test(it.promptEn) &&
      !/^단어 |^문장 |^물질|^추상|^고유|^영어 /.test(it.promptEn) &&
      !it.promptKo &&
      !/→/.test(it.promptEn) &&
      !/[\uAC00-\uD7A3]/.test(it.sectionInstructionKo || "")
    ) {
      bad++;
      console.log("NO-PROMPT-KO", f, it.id);
    }
    if ((it.promptEn || "").includes("<u>") === false && f.match(/fly|jump/) && it.type === "fill" && /밑줄/.test(it.sectionInstructionKo || "")) {
      if (!it.displayOnly && f.includes("fly") && it.section === "A") {
        bad++;
        console.log("NO-UNDERLINE", f, it.id);
      }
    }
    total++;
    let right;
    let wrong;
    if (it.type === "mc") {
      const a = it.accept[0];
      const idx = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
      const goodIdx = idx >= 0 ? idx : 0;
      right = { value: it.choices[goodIdx] };
      wrong = { value: it.choices[(goodIdx + 1) % it.choices.length] };
    } else if ((it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      right = { parts, value: parts.join(" ") };
      const wp = parts.slice();
      wp[0] = "xyz";
      wrong = { parts: wp, value: wp.join(" ") };
      if (it.unordered && parts.length > 1) {
        const perm = parts.slice().reverse();
        if (!E.gradeItem(it, { parts: perm, value: perm.join(" ") })) {
          bad++;
          console.log("UNORDERED-PERM-FAIL", f, it.id, perm.join("|"));
        }
      }
    } else {
      right = { value: "  " + String(it.accept[0]).toUpperCase() + "  " };
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
  console.log(f.padEnd(24), (d.practiceId || "").padEnd(28), "items", d.items.length, "ok", ok, "timer", d.timerMinutes);
}
console.log(bad ? "FAILURES: " + bad : "ALL " + total + " ITEMS GRADE CORRECTLY (right=pass, wrong=fail)");
process.exit(bad ? 1 : 0);
