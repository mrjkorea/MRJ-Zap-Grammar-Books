/* Catalog-driven smoke for all GreenZap 3 practices (units 01–08 + tests). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js", "catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
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

const practiceIds = new Set();
const units = catalog.units["zap-green-3"] || [];
let fileCount = 0;

for (const unit of units) {
  if (!unit.enabled) continue;
  const key = catalog.unitKey("zap-green-3", unit.id);
  const exercises = catalog.exercises[key] || [];
  for (const ex of exercises) {
    if (!ex.data || !ex.practiceId) {
      fail(key, ex.slug, "missing data or practiceId");
      continue;
    }
    if (practiceIds.has(ex.practiceId)) fail(ex.practiceId, "duplicate practiceId in catalog");
    practiceIds.add(ex.practiceId);
    const rel = ex.data;
    const fp = path.join(REPO, rel);
    if (!fs.existsSync(fp)) {
      fail(rel, "file missing");
      continue;
    }
    fileCount++;
    const where = rel;
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    if (d.practiceId !== ex.practiceId) fail(where, "practiceId mismatch", d.practiceId, ex.practiceId);
    if (!Array.isArray(d.sections) || !d.sections.length) fail(where, "no sections[]");
    const ids = new Set();
    const labels = new Set();
    const seenSec = [];
    let n = 0;
    let nGraded = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(where, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode)) fail(where, it.id, "bad answerMode", it.answerMode);
      if (ids.has(it.id)) fail(where, "dup id", it.id);
      ids.add(it.id);
      if (labels.has(it.label) && !/^g3:u01:walk1$/.test(d.practiceId)) fail(where, "dup label", it.label);
      labels.add(it.label);
      if (seenSec[seenSec.length - 1] !== it.section) {
        if (seenSec.includes(it.section)) fail(where, "section split/re-opened", it.section);
        seenSec.push(it.section);
        n = 0;
      }
      n++;
      if (/^[A-Z]$/.test(it.section) && it.label !== it.section + n && d.practiceId !== "g3:u01:walk1") {
        fail(where, it.id, "label", it.label, "expected", it.section + n);
      }
      if (it.displayOnly) continue;
      nGraded++;
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(where, it.id, "accept[0] not usable");
        continue;
      }
      if (!E.gradeItem(it, right)) fail(where, it.id, "first accept should pass");
      if (E.gradeItem(it, wrongFor(it))) fail(where, it.id, "wrong answer should fail");
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(where, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
      if (!s.answerMode) fail(where, "section", s.id, "missing answerMode");
    }
    console.log(where.padEnd(40), d.practiceId.padEnd(20), "graded", String(nGraded).padStart(3), "OK");
  }
}

const expected = 78;
if (fileCount !== expected) fail("catalog file count", fileCount, "expected", expected);

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`GreenZap 3 catalog smoke: ALL OK — ${fileCount} practices`);

const { execSync } = require("child_process");
for (let u = 1; u <= 8; u++) {
  const n = String(u).padStart(2, "0");
  execSync(`node scripts/smoke-green3-unit${n}.js`, { stdio: "inherit", cwd: REPO });
}
execSync("node scripts/smoke-green3-tests.js", { stdio: "inherit", cwd: REPO });
