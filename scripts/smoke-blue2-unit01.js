/* Smoke-grade every BlueZap 2 Unit 01 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue2/unit01");
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
      !/^단어 |^문장 |일반동사 \(\d\)|\[동사원형|→$|\[\-y/.test(it.promptEn) &&
      !it.promptKo &&
      !/^다음 중/.test(it.promptEn)
    ) {
      bad++;
      console.log("NO-PROMPT-KO", f, it.id);
    }
    if (f.includes("fly") && /_a\d+$/.test(it.id) && it.type === "fill" && !it.displayOnly && !/<u>/.test(it.promptEn || "")) {
      bad++;
      console.log("NO-UNDERLINE", f, it.id);
    }
    if (f === "review-01.json" && it.type === "mc" && ["1", "2", "11", "12"].includes(String(it.label))) {
      const missing = (it.choices || []).some((c) => !/<u>/.test(c));
      if (missing) {
        bad++;
        console.log("REVIEW-UL", f, it.id);
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
      if (it.unordered && parts.length >= 2) {
        const rev = parts.slice().reverse();
        if (!E.gradeItem(it, { parts: rev, value: rev.join(" ") })) {
          bad++;
          console.log("UNORDERED-REV-FAIL", f, it.id);
        }
        const partial = { parts: [parts[0]], value: parts[0] };
        if (E.gradeItem(it, partial)) {
          bad++;
          console.log("UNORDERED-PARTIAL-PASS", f, it.id);
        }
      }
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
  console.log(f.padEnd(22), (d.practiceId || "").padEnd(24), "items", d.items.length, "ok", ok, "timer", d.timerMinutes);
}
console.log(bad ? "FAILURES: " + bad : "ALL " + total + " ITEMS GRADE CORRECTLY (right=pass, wrong=fail)");
process.exit(bad ? 1 : 0);
