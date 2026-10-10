/* Smoke-grade every BlueZap 2 Unit 04 item (normalize.js + engine.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue2/unit04");
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
    const skipKo =
      (f === "lesson02-jump.json" && it.section === "A") ||
      /^lesson0[12]-(jump|fly|walk2?)\.json$/.test(f);
    if (it.type === "sentence" && !it.promptKo) {
      /* sentence rewrite items use English prompt only */
    } else if (it.type !== "mc" && it.promptEn && /[A-Za-z]/.test(it.promptEn) && !it.promptKo && !skipKo) {
      bad++;
      console.log("NO-PROMPT-KO", f, it.id);
    }
    if (it.unordered && (it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      const rev = parts.slice().reverse();
      const okRev = E.gradeItem(it, { parts: rev, value: rev.join(" ") });
      if (!okRev) {
        bad++;
        console.log("UNORDERED-FAIL", f, it.id);
      }
    }
    total++;
    let right;
    let wrong;
    if (it.type === "mc") {
      const numAcc = it.accept.find((a) => /^\d$/.test(String(a)));
      let pick;
      if (numAcc) {
        pick = it.choices[Number(numAcc) - 1];
      } else {
        const a = it.accept[0];
        const plain = String(a).replace(/^[①②③④⑤]\s*/, "");
        pick =
          it.choices.find((c) => c === plain || c.replace(/^[①②③④⑤]\s*/, "") === plain) ||
          it.choices.find((c) => c.endsWith(" " + plain) || c.endsWith(plain)) ||
          it.choices[0];
      }
      right = { value: pick };
      wrong = { value: it.choices[(it.choices.indexOf(pick) + 1) % it.choices.length] };
    } else if ((it.blanks || 1) > 1) {
      const parts = it.accept[0].split("|");
      right = { parts, value: parts.join(" ") };
      const wp = parts.slice();
      wp[0] = "xyz";
      wrong = { parts: wp, value: wp.join(" ") };
    } else {
      right = { value: "  " + String(it.accept[0]).split("|")[0].toUpperCase() + "  " };
      wrong = { value: "nope" };
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrong);
    if (!r || w) {
      bad++;
      console.log("GRADE", f, it.id, "right=", r, "wrong=", w, "accept=", it.accept);
    }
  }
}
console.log("SMOKE blue2 unit04:", total, "graded items,", bad, "issues");
process.exit(bad ? 1 : 0);
