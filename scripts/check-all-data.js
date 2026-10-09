/* Global integrity: all green1/green2/green3 practice JSON + catalog practiceIds. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const BOOKS = ["green1", "green2", "green3"];
const MODES = new Set(["choice", "words", "sentence"]);

const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js", "catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const catalog = win.MRJ_CATALOG;

let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function walkJson(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkJson(p));
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function mcIndex(acc) {
  const s = String(acc).trim();
  if (/^\d+$/.test(s)) return Number(s) - 1;
  const circled = "①②③④⑤";
  const ci = circled.indexOf(s);
  if (ci >= 0) return ci;
  return -1;
}

function mcAcceptOk(it, a) {
  const r = respFor(it, a);
  if (r && E.gradeItem(it, r)) return true;
  if (E.gradeItem(it, { value: a })) return true;
  if (/^[a-e]$/i.test(String(a))) {
    const letter = String(a).toLowerCase();
    for (const c of it.choices || []) {
      if (c.toLowerCase().startsWith(letter + ".") && E.gradeItem(it, { value: c })) return true;
    }
  }
  return false;
}

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = mcIndex(acc);
    if (i >= 0 && i < it.choices.length) return { value: it.choices[i] };
    const j = it.choices.indexOf(acc);
    return j < 0 ? null : { value: it.choices[j] };
  }
  if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
    const p = String(acc).split("|");
    return { parts: p, value: p.join(" ") };
  }
  return { value: acc };
}

const globalPracticeIds = new Map();

for (const book of BOOKS) {
  const root = path.join(REPO, "data", book);
  for (const fp of walkJson(root)) {
    const rel = path.relative(REPO, fp).replace(/\\/g, "/");
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    if (!d.practiceId) fail(rel, "missing practiceId");
    else {
      if (globalPracticeIds.has(d.practiceId)) fail("dup practiceId", d.practiceId, globalPracticeIds.get(d.practiceId), rel);
      globalPracticeIds.set(d.practiceId, rel);
    }
    if (!Array.isArray(d.sections) || !d.sections.length) fail(rel, "no sections");
    const ids = new Set();
    for (const it of d.items || []) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(rel, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode)) fail(rel, it.id, "bad answerMode");
      if (ids.has(it.id)) fail(rel, "dup item id", it.id);
      ids.add(it.id);
      if (it.displayOnly) continue;
      if (it.type === "mc") {
        for (const a of it.accept) {
          if (!mcAcceptOk(it, a)) fail(rel, it.id, "MC accept not mapped to a choice", a);
        }
      }
      const right = respFor(it, it.accept[0]);
      if (!right) fail(rel, it.id, "accept[0] unusable");
      else if (!E.gradeItem(it, right)) fail(rel, it.id, "accept[0] should grade true");
    }
    for (const s of d.sections) {
      const graded = (d.items || []).filter((i) => i.section === s.id && !i.displayOnly);
      if (graded.length !== s.itemCount) fail(rel, "section", s.id, "itemCount", s.itemCount, "!=", graded.length);
      if (!s.answerMode) fail(rel, "section", s.id, "missing answerMode");
      const hasInstr = (d.items || []).some((i) => i.section === s.id && i.sectionInstructionKo);
      if (!hasInstr && !s.instructionKo && !s.directionKo) fail(rel, "section", s.id, "missing sectionInstructionKo");
    }
  }
}

const catIds = new Set();
for (const book of catalog.books.filter((b) => b.enabled)) {
  const units = catalog.units[book.id] || [];
  for (const unit of units) {
    if (!unit.enabled) continue;
    const key = catalog.unitKey(book.id, unit.id);
    for (const ex of catalog.exercises[key] || []) {
      if (catIds.has(ex.practiceId)) fail("catalog dup practiceId", ex.practiceId);
      catIds.add(ex.practiceId);
      const fp = path.join(REPO, ex.data);
      if (!fs.existsSync(fp)) fail("catalog missing file", ex.data);
      const d = JSON.parse(fs.readFileSync(fp, "utf8"));
      if (d.practiceId !== ex.practiceId) fail(ex.data, "catalog practiceId mismatch");
    }
  }
}

if (bad) {
  console.log("check-all-data: FAILURES", bad);
  process.exit(1);
}
console.log("check-all-data: OK —", globalPracticeIds.size, "practices,", catIds.size, "catalog entries");
