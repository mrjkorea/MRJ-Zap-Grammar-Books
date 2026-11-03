/* Smoke test for 천일문 Grammar 2 — Chapters 05–08 (SB + WB + chapter tests). */
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
    if (!d.practiceId || !String(d.practiceId).startsWith("cm2:")) fail(rel, "practiceId", d.practiceId);
    if (d.bookId !== "chunilmun-grammar-2") fail(rel, "bookId", d.bookId);
    if (d.appName !== "천일문 Grammar 2") fail(rel, "appName", d.appName);
    if (d.showAnswersToStudent === true) fail(rel, "reveals answers");
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
      if (!/고르|쓰세요|쓰세요\.|기호|O/.test(it.sectionInstructionKo || "")) {
        fail(rel, it.id, "instruction missing typing rule");
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
      if (!Array.isArray(it.accept) || !it.accept.length) fail(rel, it.id, "empty accept");
      const right = respFor(it, it.accept[0]);
      if (!right) {
        fail(rel, it.id, "accept[0] not usable");
        continue;
      }
      if (it.type === "match") {
        if (!E.gradeMatchItem(it, right)) fail(rel, it.id, "match pairs should pass");
        if (E.gradeMatchItem(it, wrongFor(it))) fail(rel, it.id, "wrong match should fail");
      } else {
        if (!E.gradeItem(it, right)) fail(rel, it.id, "first accept should pass", JSON.stringify(it.accept[0]));
        if (E.gradeItem(it, wrongFor(it))) fail(rel, it.id, "wrong answer should fail");
      }
      if (it.type === "mc") {
        if (!it.choices || it.choices.length < 2) fail(rel, it.id, "mc choices");
        const key = String(it.accept[0]);
        const ox = it.choices.length === 2 && it.choices[0] === "O" && it.choices[1] === "X";
        if (it.select === "multi") {
          const parts = key.split("|").filter(Boolean);
          if (parts.length < 2) fail(rel, it.id, "multi accept needs 2+ choices", key);
          for (const part of parts) {
            const n = Number(part);
            const circled = "①②③④⑤⑥⑦⑧⑨⑩".indexOf(part);
            const ok =
              (Number.isInteger(n) && n >= 1 && n <= it.choices.length) ||
              (circled >= 0 && circled < it.choices.length) ||
              it.choices.includes(part);
            if (!ok) fail(rel, it.id, "multi accept token out of range", part);
          }
        } else if (ox) {
          if (key !== "O" && key !== "X") fail(rel, it.id, "O/X accept must be O or X", key);
        } else if (!/^[1-5]$/.test(key)) {
          fail(rel, it.id, "mc accept[0] must be 1-5", key);
        }
      }
    }
    for (const s of d.sections) {
      const its = d.items.filter((i) => i.section === s.id && !i.displayOnly);
      if (its.length !== s.itemCount) fail(rel, "section", s.id, "itemCount", s.itemCount, "!=", its.length);
      if (!s.instructionKo && !s.directionKo) fail(rel, "section", s.id, "missing instructionKo");
      if (!s.answerMode) fail(rel, "section", s.id, "missing answerMode");
      if (!s.directionKo || !s.ruleKo) fail(rel, "section", s.id, "missing direction/rule");
    }
    console.log(rel.padEnd(52), d.practiceId.padEnd(22), "graded", String(nGraded).padStart(3), "OK");
  }
  return n;
}

let total = 0;
for (const ch of ["chapter05", "chapter06", "chapter07", "chapter08"]) {
  total += smokeDir(`data/chunilmun2/${ch}`);
}

const expected = 30 + 16 + 16 + 23;
if (total !== expected) fail("file count", total, "expected", expected);

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 2 Ch05–08 smoke: ALL OK — ${total} practices`);
