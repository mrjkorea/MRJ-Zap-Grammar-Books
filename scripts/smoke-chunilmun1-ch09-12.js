/* Smoke test for 천일문 Grammar 1 — Chapters 09–12 + review-02/03. */
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
const MODES = new Set(["choice", "words", "sentence", "match"]);
let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function respFor(it, acc) {
  if (it.type === "match") {
    const links = {};
    const pairs = it.pairs || [];
    for (const line of (it.accept || []).length ? it.accept : [acc]) {
      const [left, right] = String(line).split("|");
      if (left != null && right != null) links[left.trim()] = right.trim();
    }
    if (!Object.keys(links).length && pairs.length) {
      for (const p of pairs) links[p.left] = p.right;
    }
    return { links };
  }
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
  if (it.type === "match") {
    const links = {};
    for (const p of it.pairs || []) {
      links[p.left] = p.right === "2형식" ? "5형식" : "2형식";
    }
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
    console.log(rel.padEnd(50), d.practiceId.padEnd(20), "graded", String(nGraded).padStart(3), "OK");
  }
  return n;
}

let total = 0;
for (const ch of ["chapter09", "chapter10", "chapter11", "chapter12"]) {
  total += smokeDir(`data/chunilmun1/${ch}`);
}
total += smokeDir("data/chunilmun1/review-02");
total += smokeDir("data/chunilmun1/review-03");

const expected = 23 + 23 + 23 + 16 + 1 + 1;
if (total !== expected) fail("file count", total, "expected", expected);

if (bad) {
  console.log("FAILURES:", bad);
  process.exit(1);
}
console.log(`천일문 Grammar 1 Ch09–12 + review-02/03 smoke: ALL OK — ${total} practices`);
