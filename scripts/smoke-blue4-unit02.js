/* Smoke-grade BlueZap 4 Unit 02: engine grading + section/label integrity. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/blue4/unit02");
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
const metricIds = new Set();
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const where = "unit02/" + f;
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  if (!d.practiceId) fail(where, "no practiceId");
  if (String(d.introKo || "").includes("from OCR")) fail(where, "introKo still flags OCR");
  const ids = new Set();
  const labels = new Set();
  let ok = 0;
  for (const it of d.items) {
    for (const k of ["id", "section", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
      if (it[k] == null || it[k] === "") fail(where, it.id, "missing", k);
    }
    if (!MODES.has(it.answerMode)) fail(where, it.id, "bad answerMode");
    if (ids.has(it.id)) fail(where, "dup id", it.id);
    ids.add(it.id);
    if (labels.has(it.label)) fail(where, "dup label", it.label);
    labels.add(it.label);
    const mid = (d.practiceId || "") + ":" + it.id;
    if (metricIds.has(mid)) fail(where, "dup metric id", mid);
    metricIds.add(mid);
    if (it.example && !it.displayOnly) fail(where, it.id, "example must be displayOnly");
    if (it.displayOnly) continue;
    graded++;
    const right = respFor(it, it.accept[0]);
    if (!right) {
      fail(where, it.id, "bad accept[0]");
      continue;
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrongFor(it));
    if (r && !w) ok++;
    else fail(where, it.id, "right/wrong", r, w);
    if (!it.unordered && (it.blanks || 1) > 1) {
      const canonical = it.accept.find((a) => a.includes("|"));
      if (canonical) {
        const parts = canonical.split("|");
        if (parts.length >= 2) {
          const rev = parts.slice().reverse();
          if (rev.join("|") !== canonical && E.gradeItem(it, { parts: rev, value: rev.join(" ") })) {
            fail(where, it.id, "reversed-order must fail", canonical);
          }
        }
      }
    }
  }
  if (d.sections) {
    for (const s of d.sections) {
      const g = d.items.filter((it) => !it.displayOnly && it.section === s.id);
      if (g.length !== s.itemCount) fail(where, s.id, "count", s.itemCount, g.length);
    }
  }
  console.log(f.padEnd(24), (d.practiceId || "").padEnd(28), "graded", graded, "ok", ok);
}
console.log(bad ? "FAILURES: " + bad : "ALL " + graded + " GRADED ITEMS OK");
process.exit(bad ? 1 : 0);
