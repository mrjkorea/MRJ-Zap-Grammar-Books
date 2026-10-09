/* DOM-free: wrong-answer review shows student answer + instruction, never accept strings. */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets", "js");
const DATA = path.join(REPO, "data");

const win = { sessionStorage: { _m: {}, getItem(k) { return this._m[k] || null; }, setItem(k, v) { this._m[k] = v; } } };
const ctx = vm.createContext({
  window: win,
  globalThis: win,
  Date,
  Math,
  JSON,
  String,
  Array,
  Object,
  RegExp,
  Promise,
  module: { exports: {} },
  exports: {},
});
for (const f of ["normalize.js", "engine.js", "review.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const R = ctx.module.exports;

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return i < 0 ? null : { value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1) {
    const p = acc.split("|");
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
  if ((it.blanks || 1) > 1) {
    const p = it.accept[0].split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

function normForLeak(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function listUnitDirs(book) {
  const base = path.join(DATA, book);
  if (book === "green3") return [path.join(base, "unit01")];
  return fs
    .readdirSync(base)
    .filter((d) => /^unit\d{2}$/.test(d))
    .sort()
    .map((d) => path.join(base, d));
}

for (const book of ["green1", "green3"]) {
  for (const dir of listUnitDirs(book)) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const where = path.relative(path.join(DATA, book), dir) + "/" + f;
    const practice = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const graded = practice.items.filter((it) => !it.displayOnly);
    const responses = {};
    const results = [];
    graded.forEach((it) => {
      const wrong = wrongFor(it);
      responses[it.id] = wrong;
      results.push({ id: it.id, correct: false });
    });
    const text = R.reviewPlainText(practice, responses, results);
    if (!text.includes(R.WRONG_ANSWER_LABEL)) {
      fail(where, "missing student answer label");
    }
    graded.forEach((it) => {
      if (it.sectionInstructionKo && !text.includes(it.sectionInstructionKo)) {
        fail(where, it.id, "missing sectionInstructionKo");
      }
      if (it.promptEn && !text.includes(it.promptEn)) {
        fail(where, it.id, "missing promptEn");
      }
      const wrong = responses[it.id];
      if (E.gradeItem(it, wrong)) {
        fail(where, it.id, "wrongFor produced a passing answer");
      }
      const wrongSummary = normForLeak(R.studentAnswerSummary(it, wrong));
      (it.accept || []).forEach((acc) => {
        const right = respFor(it, acc);
        if (!right || !E.gradeItem(it, right)) return;
        const rightSummary = normForLeak(R.studentAnswerSummary(it, right));
        if (rightSummary && rightSummary === wrongSummary) {
          fail(where, it.id, "review shows correct accept as student answer:", acc);
        }
      });
      const rows = R.collectWrongRows(practice, { [it.id]: wrong }, [{ id: it.id, correct: false }]);
      const row = rows[0];
      if (row && JSON.stringify(row).indexOf('"accept"') >= 0) {
        fail(where, it.id, "row object contains accept key");
      }
      if (row) {
        row.studentLines.forEach((ln) => {
          const lnNorm = normForLeak(ln.text);
          if (lnNorm === normForLeak(R.EMPTY_ANSWER_KO)) return;
          (it.accept || []).forEach((acc) => {
            if (lnNorm === normForLeak(acc)) {
              fail(where, it.id, "answer line equals accept:", acc);
            }
          });
        });
      }
    });

    const rows = R.collectWrongRows(practice, responses, results);
    if (rows.length !== graded.length) {
      fail(where, "row count", rows.length, "!=", graded.length);
    }
  }
  }
}

if (bad) {
  console.log("FAILURES: " + bad);
  process.exit(1);
}
console.log("smoke-review OK — wrong review text has answers + instructions, no accept leaks (green1 + green3)");
