/* Smoke test for 천일문 Grammar 2 — Chapters 02–04 (62 practices). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const { execSync } = require("child_process");
execSync("node scripts/check-no-guessed-stems.js", { cwd: REPO, stdio: "inherit" });
const JS = path.join(REPO, "assets/js");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
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
    if (i < 0) i = (it.choices || []).indexOf(acc);
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
    const p = String(it.accept[0]).split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

const chapters = ["chapter02", "chapter03", "chapter04"];
let fileCount = 0;
const practiceIds = [];

for (const chDir of chapters) {
  const dir = path.join(REPO, "data/chunilmun2", chDir);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  for (const f of files) {
    const fp = path.join(dir, f);
    const rel = `data/chunilmun2/${chDir}/${f}`;
    fileCount++;
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    if (!d.practiceId || !d.practiceId.startsWith("cm2:")) fail(rel, "bad practiceId", d.practiceId);
    if (d.bookId !== "chunilmun-grammar-2") fail(rel, "bookId", d.bookId);
    if (d.appName !== "천일문 Grammar 2") fail(rel, "appName", d.appName);
    if (d.bookTitle !== "천일문 GRAMMAR LEVEL 2") fail(rel, "bookTitle", d.bookTitle);
    practiceIds.push(d.practiceId);
    const ids = new Set();
    const labels = new Set();
    const seenSec = [];
    let n = 0;
    let nGraded = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(rel, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode)) fail(rel, it.id, "bad answerMode", it.answerMode);
      if (ids.has(it.id)) fail(rel, "dup id", it.id);
      ids.add(it.id);
      if (labels.has(it.label)) fail(rel, "dup label", it.label);
      labels.add(it.label);
      if (seenSec[seenSec.length - 1] !== it.section) {
        if (seenSec.includes(it.section)) fail(rel, "section split/re-opened", it.section);
        seenSec.push(it.section);
        n = 0;
      }
      n++;
      if (/^[A-Z]$/.test(it.section) && it.label !== it.section + n) {
        fail(rel, it.id, "label", it.label, "expected", it.section + n);
      }
      if (it.displayOnly) continue;
      nGraded++;
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(rel, it.id, "accept[0] not usable");
        continue;
      }
      if (!E.gradeItem(it, right)) fail(rel, it.id, "first accept should pass", JSON.stringify(it.accept[0]));
      for (const alt of it.accept.slice(1)) {
        const r2 = respFor(it, alt);
        if (!r2 || !E.gradeItem(it, r2)) fail(rel, it.id, "alt accept should pass", JSON.stringify(alt));
      }
      if (E.gradeItem(it, wrongFor(it))) fail(rel, it.id, "wrong answer should fail");
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(rel, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
      if (!s.instructionKo && !s.directionKo) fail(rel, "section", s.id, "missing instructionKo");
      if (!s.answerMode) fail(rel, "section", s.id, "missing answerMode");
    }
    console.log(rel.padEnd(52), d.practiceId.padEnd(22), "graded", String(nGraded).padStart(3), "OK");
  }
}

if (fileCount !== 62) fail("file count", fileCount, "expected 62");

const catalogSrc = fs.readFileSync(path.join(JS, "catalog.js"), "utf8");
const catalogWin = {};
vm.runInContext(catalogSrc, vm.createContext({ window: catalogWin }));
const cat = catalogWin.MRJ_CATALOG;
const book = cat.books.find((b) => b.id === "chunilmun-grammar-2");
if (!book) fail("catalog missing book chunilmun-grammar-2");
else {
  if (book.appName !== "천일문 Grammar 2") fail("catalog appName", book.appName);
  if (book.title !== "천일문 GRAMMAR LEVEL 2") fail("catalog title", book.title);
}
const units = (cat.units && cat.units["chunilmun-grammar-2"]) || [];
const unitIds = new Set(units.map((u) => u.id));
for (const id of ["chapter-02", "wb-chapter-02", "chapter-03", "wb-chapter-03", "chapter-04", "wb-chapter-04"]) {
  if (!unitIds.has(id)) fail("catalog missing unit", id);
}
for (const pid of practiceIds) {
  const hit = Object.keys(cat.exercises).some((k) =>
    (cat.exercises[k] || []).some((ex) => ex.practiceId === pid)
  );
  if (!hit) fail("catalog missing practice", pid);
}

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 2 Ch02–04 smoke: ALL OK — ${fileCount} practices`);
