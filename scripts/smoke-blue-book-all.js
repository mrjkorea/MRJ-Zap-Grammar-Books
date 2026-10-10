/* Catalog-driven smoke for one BlueZap book (units 01–08). Usage: node scripts/smoke-blue-book-all.js <1-4> */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const n = Number(process.argv[2]);
if (![1, 2, 3, 4].includes(n)) {
  console.error("Usage: node scripts/smoke-blue-book-all.js <1-4>");
  process.exit(1);
}
const bookId = `zap-blue-${n}`;

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
  if (it.type === "mc") {
    for (const ch of it.choices || []) {
      if (!E.gradeItem(it, { value: ch })) return { value: ch };
    }
    return { value: "__WRONG_MC__" };
  }
  if ((it.blanks || 1) > 1 || String(it.accept[0]).includes("|")) {
    const n = it.blanks || String(it.accept[0]).split("|").length;
    const wp = Array.from({ length: n }, () => "WRONG_ANSWER_XYZ");
    return { parts: wp, value: wp.join(" ") };
  }
  return { value: "WRONG_ANSWER_XYZ" };
}

function normPart(s) {
  return String(s || "").trim().toLowerCase();
}

function reversedFor(it) {
  if (it.unordered) return null;
  const acc = it.accept[0];
  if ((it.blanks || 1) <= 1 && !String(acc).includes("|")) return null;
  const p = String(acc).split("|");
  if (p.length < 2) return null;
  const rev = p.slice().reverse();
  if (rev.map(normPart).join("|") === p.map(normPart).join("|")) return null;
  return { parts: rev, value: rev.join(" ") };
}

const practiceIds = new Set();
const units = catalog.units[bookId] || [];
let fileCount = 0;

for (const unit of units) {
  if (!unit.enabled || unit.id === "tests") continue;
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
    let nGraded = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(where, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode)) fail(where, it.id, "bad answerMode", it.answerMode);
      if (ids.has(it.id)) fail(where, "dup id", it.id);
      ids.add(it.id);
      if (it.displayOnly) continue;
      nGraded++;
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(where, it.id, "accept[0] not usable");
        continue;
      }
      if (!E.gradeItem(it, right)) fail(where, it.id, "first accept should pass");
      if (E.gradeItem(it, wrongFor(it))) fail(where, it.id, "wrong answer should fail");
      const rev = reversedFor(it);
      if (rev && E.gradeItem(it, rev)) fail(where, it.id, "reversed ordered multi-blank should fail");
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(where, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
      if (!s.answerMode) fail(where, "section", s.id, "missing answerMode");
    }
    console.log(where.padEnd(42), d.practiceId.padEnd(22), "graded", String(nGraded).padStart(3), "OK");
  }
}

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`BlueZap ${n} catalog smoke: ALL OK — ${fileCount} practices`);
