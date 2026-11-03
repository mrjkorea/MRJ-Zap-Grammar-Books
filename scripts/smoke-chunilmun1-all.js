/* Catalog-driven smoke for 천일문 Grammar 1 — all practices in catalog. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const { execSync } = require("child_process");
execSync("node scripts/check-no-guessed-stems.js", { cwd: REPO, stdio: "inherit" });
if (fs.existsSync(path.join(REPO, "audio/chunilmun1"))) {
  execSync("node scripts/check-chunilmun-audio.js", { cwd: REPO, stdio: "inherit" });
}
const JS = path.join(REPO, "assets/js");
const bookId = "chunilmun-grammar-1";
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js", "catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const { respFor, wrongFor } = require("./lib/answer-fixture").createFixtures(E);
const catalog = win.MRJ_CATALOG;
const MODES = new Set(["choice", "words", "sentence", "match", "ox"]);
let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

const practiceIds = new Set();
const units = catalog.units[bookId] || [];
let fileCount = 0;

for (const unit of units) {
  const key = catalog.unitKey(bookId, unit.id);
  const exercises = catalog.exercises[key] || [];
  for (const ex of exercises) {
    if (!ex.data || !ex.practiceId) {
      fail(key, ex.slug, "missing data or practiceId");
      continue;
    }
    if (practiceIds.has(ex.practiceId)) fail(ex.practiceId, "duplicate practiceId in catalog");
    practiceIds.add(ex.practiceId);
    const fp = path.join(REPO, ex.data);
    if (!fs.existsSync(fp)) {
      fail(ex.data, "file missing");
      continue;
    }
    fileCount++;
    const where = ex.data;
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    if (d.practiceId !== ex.practiceId) fail(where, "practiceId mismatch", d.practiceId, ex.practiceId);
    if (!Array.isArray(d.sections) || !d.sections.length) fail(where, "no sections[]");
    const ids = new Set();
    const labels = new Set();
    const seenSec = [];
    let n = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(where, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode) && it.answerMode !== "match") fail(where, it.id, "bad answerMode", it.answerMode);
      if (ids.has(it.id)) fail(where, "dup id", it.id);
      ids.add(it.id);
      if (labels.has(it.label)) fail(where, "dup label", it.label);
      labels.add(it.label);
      if (seenSec[seenSec.length - 1] !== it.section) {
        if (seenSec.includes(it.section)) fail(where, "section split/re-opened", it.section);
        seenSec.push(it.section);
        n = 0;
      }
      n++;
      if (/^[A-Z]$/.test(it.section) && it.label !== it.section + n) {
        fail(where, it.id, "label", it.label, "expected", it.section + n);
      }
      if (it.displayOnly) continue;
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(where, it.id, "accept[0] not usable");
        continue;
      }
      if (it.type === "match") {
        if (!E.gradeMatchItem(it, right)) fail(where, it.id, "match pairs should pass");
        if (E.gradeMatchItem(it, wrongFor(it))) fail(where, it.id, "wrong match should fail");
      } else {
        if (!E.gradeItem(it, right)) fail(where, it.id, "first accept should pass");
        if (E.gradeItem(it, wrongFor(it))) fail(where, it.id, "wrong answer should fail");
      }
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(where, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
    }
  }
}

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 1 full smoke: ALL OK — ${fileCount} practices`);
