/* Catalog-driven smoke for 천일문 Grammar 1 — Chapter 01 (16 practices). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const bookId = "chunilmun-grammar-1";
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js", "catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const catalog = win.MRJ_CATALOG;
const CH01_UNITS = new Set(["chapter-01", "wb-chapter-01"]);
const MODES = new Set(["choice", "words", "sentence", "match"]);
let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function respFor(it, acc) {
  if (it.type === "match") {
    const links = {};
    for (const line of it.accept || []) {
      const [left, right] = String(line).split("|");
      if (left != null && right != null) links[left.trim()] = right.trim();
    }
    return { links };
  }
  if (it.type === "mc") {
    const circled = "①②③④⑤";
    let i = circled.indexOf(String(acc).trim());
    if (i < 0 && /^\d+$/.test(String(acc).trim())) i = Number(acc) - 1;
    if (i < 0) i = it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
    const p = String(acc).split("|");
    return { parts: p, value: p.join(" ") };
  }
  return { value: acc };
}

function wrongFor(it) {
  if (it.type === "match") {
    const links = {};
    for (const p of it.pairs || []) links[p.left] = "wrong";
    return { links };
  }
  if (it.type === "mc") {
    for (const ch of it.choices || []) {
      if (!E.gradeItem(it, { value: ch })) return { value: ch };
    }
    return { value: "__WRONG_MC__" };
  }
  if ((it.blanks || 1) > 1 || String(it.accept[0]).includes("|")) {
    const p = String(it.accept[0]).split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

const practiceIds = new Set();
const units = catalog.units[bookId] || [];
let fileCount = 0;

for (const unit of units.filter((u) => CH01_UNITS.has(u.id))) {
  const key = catalog.unitKey(bookId, unit.id);
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
      nGraded++;
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
      if (!s.instructionKo && !s.directionKo) fail(where, "section", s.id, "missing instructionKo");
      if (!s.answerMode) fail(where, "section", s.id, "missing answerMode");
    }
    console.log(where.padEnd(42), d.practiceId.padEnd(16), "graded", String(nGraded).padStart(3), "OK");
  }
}

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 1 Ch01 smoke: ALL OK — ${fileCount} practices`);
