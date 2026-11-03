/* Smoke test for 천일문 Grammar 2 — Chapters 09–12 + review-01/02/03. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["normalize.js", "engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const { respFor, wrongFor } = require("./lib/answer-fixture").createFixtures(E);
const MODES = new Set(["choice", "words", "sentence", "match", "ox"]);
let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function smokeDir(relDir) {
  const dir = path.join(REPO, relDir);
  if (!fs.existsSync(dir)) {
    fail(relDir, "missing dir");
    return 0;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  let n = 0;
  for (const f of files) {
    const fp = path.join(dir, f);
    const rel = `${relDir}/${f}`;
    n++;
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    if (!d.practiceId) fail(rel, "missing practiceId");
    if (!String(d.practiceId).startsWith("cm2:")) fail(rel, "practiceId prefix", d.practiceId);
    if (d.bookId !== "chunilmun-grammar-2") fail(rel, "bookId", d.bookId);
    if (d.appName !== "천일문 Grammar 2") fail(rel, "appName", d.appName);
    const ids = new Set();
    const labels = new Set();
    const seenSec = [];
    let num = 0;
    let nGraded = 0;
    for (const it of d.items) {
      for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
        if (it[k] == null || it[k] === "") fail(rel, it.id, "missing", k);
      }
      if (!MODES.has(it.answerMode)) fail(rel, it.id, "bad answerMode", it.answerMode);
      if (!it.sectionInstructionKo || !/[\uAC00-\uD7A3]/.test(it.sectionInstructionKo)) {
        fail(rel, it.id, "Korean instruction missing");
      }
      if (ids.has(it.id)) fail(rel, "dup id", it.id);
      ids.add(it.id);
      if (labels.has(it.label)) fail(rel, "dup label", it.label);
      labels.add(it.label);
      if (seenSec[seenSec.length - 1] !== it.section) {
        if (seenSec.includes(it.section)) fail(rel, "section split/re-opened", it.section);
        seenSec.push(it.section);
        num = 0;
      }
      num++;
      if (/^[A-Z]$/.test(it.section) && it.label !== it.section + num) {
        fail(rel, it.id, "label", it.label, "expected", it.section + num);
      }
      if (it.displayOnly) continue;
      nGraded++;
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(rel, it.id, "accept[0] not usable");
        continue;
      }
      if (it.type === "match") {
        if (!E.gradeMatchItem(it, right)) fail(rel, it.id, "match pairs should pass");
      } else {
        if (!E.gradeItem(it, right)) fail(rel, it.id, "first accept should pass", JSON.stringify(it.accept[0]));
      }
      if (it.type === "match") {
        if (E.gradeMatchItem(it, wrongFor(it))) fail(rel, it.id, "wrong match should fail");
      } else if (E.gradeItem(it, wrongFor(it))) fail(rel, it.id, "wrong answer should fail");
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(rel, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
      if (!s.instructionKo && !s.directionKo) fail(rel, "section", s.id, "missing instructionKo");
      if (!s.answerMode) fail(rel, "section", s.id, "missing answerMode");
    }
    console.log(rel.padEnd(52), d.practiceId.padEnd(22), "graded", String(nGraded).padStart(3), "OK");
  }
  return n;
}

let total = 0;
for (const ch of ["chapter09", "chapter10", "chapter11", "chapter12"]) {
  total += smokeDir(`data/chunilmun2/${ch}`);
}
total += smokeDir("data/chunilmun2/review-01");
total += smokeDir("data/chunilmun2/review-02");
total += smokeDir("data/chunilmun2/review-03");

const expected = 16 + 16 + 23 + 23 + 3;
if (total !== expected) fail("file count", total, "expected", expected);

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 2 Ch09–12 + review-01/02/03 smoke: ALL OK — ${total} practices`);
