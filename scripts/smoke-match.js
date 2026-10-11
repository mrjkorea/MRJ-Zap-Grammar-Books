/* Match answer mode: grading, scoring units, review rows (no browser). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const win = {
  MRJ_SCORES: { post: () => {} },
  sessionStorage: { _m: {}, getItem(k) { return this._m[k] || null; }, setItem(k, v) { this._m[k] = v; } },
};
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
});
for (const f of ["normalize.js", "engine.js", "review.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const R = win.MRJ_REVIEW;

let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

const item = {
  id: "m01",
  type: "match",
  answerMode: "match",
  pairs: [
    { left: "A", right: "a" },
    { left: "B", right: "b" },
    { left: "C", right: "c" },
  ],
  accept: ["A|a", "B|b", "C|c"],
};

const good = { links: { A: "a", B: "b", C: "c" } };
const oneWrong = { links: { A: "a", B: "c", C: "c" } };

if (!E.gradeMatchItem(item, good)) fail("all pairs should pass");
if (E.gradeMatchItem(item, oneWrong)) fail("wrong link should fail item");
if (!E.gradeMatchPair(item, good, 0)) fail("pair 0");
if (E.gradeMatchPair(item, oneWrong, 1)) fail("pair 1 wrong");

const practice = {
  practiceId: "test:match",
  items: [item],
  sections: [{ id: "A", itemCount: 1, answerMode: "match" }],
};
const scored = E.scorePractice(practice, { m01: good }, Date.now());
if (scored.correct !== 3 || scored.max !== 3) fail("score counts pairs", scored);

const wrongOutcome = E.scorePractice(practice, { m01: oneWrong }, Date.now());
if (wrongOutcome.correct !== 2) fail("partial pairs", wrongOutcome);

const rows = R.collectWrongRows(
  practice,
  { m01: oneWrong },
  [{ id: "m01", correct: false }]
);
if (rows.length !== 1) fail("one wrong pair row", rows.length);
if (!rows[0].studentSummary.includes("B")) fail("review shows left");

if (bad) {
  console.log("smoke-match: FAILURES", bad);
  process.exit(1);
}
console.log("smoke-match: OK");
