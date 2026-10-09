/* Smoke test for GreenZap 1 Units 02-05 sectioned data (adapted from smoke-zapfix.js).
 * Uses the repo's own assets/js/normalize.js + engine.js (gradeItem / scorePractice).
 * usage: node smoke-units.js [JS_DIR] [DATA_ROOT] [comma list of book/unit dirs, default green1/unit02..05]
 * In the repo: node scripts/smoke-units-02-05.js assets/js data
 */
const fs = require("fs"), path = require("path"), vm = require("vm");
const JS = process.argv[2] || path.join(__dirname, "..", "assets", "js");
const ROOT = process.argv[3] || path.join(__dirname, "..", "data");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js"]) vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
const E = win.MRJ_ENGINE;
const MODES = new Set(["choice", "words", "sentence"]);
let bad = 0, graded = 0, examples = 0;
const fail = (...a) => { bad++; console.log("FAIL", ...a); };

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1) { const p = acc.split("|"); return { parts: p, value: p.join(" ") }; }
  return { value: acc };
}
function wrongFor(it) {
  if (it.type === "mc") {
    const r = respFor(it, it.accept[0]); const i = it.choices.indexOf(r.value);
    return { value: it.choices[(i + 1) % it.choices.length] };
  }
  if ((it.blanks || 1) > 1) { const p = it.accept[0].split("|"); p[p.length - 1] = "xyz"; return { parts: p, value: p.join(" ") }; }
  return { value: "nope" };
}

for (const book of (process.argv[4] || "green1/unit02,green1/unit03,green1/unit04,green1/unit05").split(",")) {
  const dir = path.join(ROOT, book);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const where = book + "/" + f;
    if (!d.practiceId) fail(where, "no practiceId");
    if (!d.title) fail(where, "no title");
    if (!Array.isArray(d.sections) || !d.sections.length) fail(where, "no sections[]");
    const ids = new Set(), labels = new Set(), seenSec = [];
    let n = 0, ok = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"])
        if (it[k] == null || it[k] === "") fail(where, it.id, "missing", k);
      if (!MODES.has(it.answerMode)) fail(where, it.id, "bad answerMode", it.answerMode);
      if (ids.has(it.id)) fail(where, "dup id", it.id); ids.add(it.id);
      if (labels.has(it.label)) fail(where, "dup label", it.label); labels.add(it.label);
      if (seenSec[seenSec.length - 1] !== it.section) {
        if (seenSec.includes(it.section)) fail(where, "section split/re-opened", it.section);
        seenSec.push(it.section); n = 0;
      }
      n++;
      if (/^[A-Z]$/.test(it.section) && it.label !== it.section + n) fail(where, it.id, "label", it.label, "expected", it.section + n);
      if (it.example && !it.displayOnly) fail(where, it.id, "example must be displayOnly");
      if (it.answerMode === "words") for (const a of it.accept) if (/[?.!]$/.test(a.trim()) || a.split("|").some((p) => p.trim().split(/\s+/).length > 6)) fail(where, it.id, "words-mode accept looks like a sentence:", a);
      if (it.answerMode === "sentence" && it.type !== "sentence") fail(where, it.id, "sentence mode but type", it.type);
      if (it.type === "mc" && it.answerMode !== "choice") fail(where, it.id, "mc must be choice mode");
      // grading
      const right = respFor(it, it.accept[0]);
      if (!right) { fail(where, it.id, "accept[0] not a choice"); continue; }
      const r = E.gradeItem(it, right), w = E.gradeItem(it, wrongFor(it));
      if (r && !w) ok++; else fail(where, it.id, "right/wrong", r, w);
      for (const acc of it.accept) { const rr = respFor(it, acc); if (rr && !E.gradeItem(it, rr)) fail(where, it.id, "accept entry not passing:", acc); }
      if (it.displayOnly) examples++; else graded++;
    }
    // section summary consistency
    for (const s of d.sections || []) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(where, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
    }
    // scorePractice: all right = 100%, all blank = 0%, examples not counted
    const all = {}; d.items.forEach((it) => (all[it.id] = respFor(it, it.accept[0])));
    const s1 = E.scorePractice(d, all, Date.now()), s0 = E.scorePractice(d, {}, Date.now());
    const nGraded = d.items.filter((i) => !i.displayOnly).length;
    if (s1.pct !== 100 || s1.max !== nGraded || s0.pct !== 0) fail(where, "scorePractice", s1.pct, s1.max, s0.pct);
    console.log(where.padEnd(28), d.practiceId.padEnd(16), "graded", String(nGraded).padStart(2), "examples", d.items.length - nGraded,
      "sections", d.sections.map((s) => s.id + ":" + s.itemCount + ":" + (s.mixedModes || [s.answerMode]).join("+")).join(" "), "timer", d.timerMinutes || "(default)");
  }
}
console.log(bad ? "FAILURES: " + bad : `ALL OK — ${graded} graded items (+${examples} display-only book examples) grade right=pass / wrong=fail; sections/labels valid`);
process.exit(bad ? 1 : 0);
