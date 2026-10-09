/* Smoke-grade GreenZap 4 cumulative tests (catalog + engine). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js", "assets/js/catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const catalog = win.MRJ_CATALOG;
const MODES = new Set(["choice", "words", "sentence"]);
let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
    const p = String(acc).split("|");
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
  if ((it.blanks || 1) > 1 || String(it.accept[0]).includes("|")) {
    const p = String(it.accept[0]).split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

const key = "zap-green-4:tests";
const exercises = catalog.exercises[key] || [];
if (exercises.length !== 6) fail("catalog exercises", exercises.length, "expected 6");

let totalGraded = 0;
let totalOk = 0;

for (const ex of exercises) {
  const rel = ex.data;
  const fp = path.join(REPO, rel);
  if (!fs.existsSync(fp)) {
    fail(rel, "missing");
    continue;
  }
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (d.practiceId !== ex.practiceId) fail(rel, "practiceId", d.practiceId, ex.practiceId);
  let ok = 0;
  let graded = 0;
  const seenIds = new Set();
  for (const it of d.items) {
    for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
      if (it[k] == null || it[k] === "") fail(rel, it.id, "missing", k);
    }
    if (seenIds.has(it.id)) fail(rel, it.id, "duplicate id");
    seenIds.add(it.id);
    if (!MODES.has(it.answerMode)) fail(rel, it.id, "bad answerMode");
    if (it.type === "mc" && (!Array.isArray(it.choices) || it.choices.length < 2)) {
      fail(rel, it.id, "mc needs choices");
    }
    if (it.type === "fill" || it.answerMode === "words") {
      const b = it.blanks || 1;
      for (const acc of it.accept) {
        const n = String(acc).split("|").length;
        if (n !== b) fail(rel, it.id, "blanks mismatch", b, n, acc);
      }
    }
    if (it.displayOnly) continue;
    graded++;
    const right = respFor(it, it.accept[0]);
    if (right && E.gradeItem(it, right)) ok++;
    else fail(rel, it.id, "grade fail", it.accept[0]);
    if (E.gradeItem(it, wrongFor(it))) fail(rel, it.id, "wrong should not pass");
  }
  for (const s of d.sections || []) {
    const n = d.items.filter((i) => i.section === s.id && !i.displayOnly).length;
    if (n !== s.itemCount) fail(rel, "section", s.id, s.itemCount, n);
  }
  console.log(path.basename(rel).padEnd(24), ex.practiceId.padEnd(16), "graded", graded, ok === graded ? "OK" : "PARTIAL", ok + "/" + graded);
  totalGraded += graded;
  totalOk += ok;
}

console.log("GZ4 tests smoke:", totalOk, "/", totalGraded);
if (bad || totalOk !== totalGraded) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
