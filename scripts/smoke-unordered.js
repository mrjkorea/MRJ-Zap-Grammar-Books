/* Unit tests for unordered multi-blank grading (normalize.js + engine.js + review.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const JS = path.join(REPO, "assets/js");
const win = {
  sessionStorage: {
    _m: {},
    getItem(k) {
      return this._m[k] || null;
    },
    setItem(k, v) {
      this._m[k] = v;
    },
  },
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
  module: { exports: {} },
  exports: {},
});
for (const f of ["normalize.js", "engine.js", "review.js"]) {
  vm.runInContext(fs.readFileSync(path.join(JS, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;
const N = win.MRJ_NORMALIZE;
const R = ctx.module.exports;

let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

const tomItem = {
  id: "t01",
  type: "fill",
  blanks: 2,
  unordered: true,
  accept: ["Tom|student", "student|Tom"],
};

function assertGrade(item, resp, expect, label) {
  const got = E.gradeItem(item, resp);
  if (got !== expect) fail(label, "expected", expect, "got", got, resp);
}

assertGrade(tomItem, { parts: ["Tom", "student"], value: "Tom student" }, true, "Tom then student");
assertGrade(tomItem, { parts: ["student", "Tom"], value: "student Tom" }, true, "student then Tom");
assertGrade(tomItem, { parts: ["tom", "STUDENT"], value: "tom STUDENT" }, true, "case variants");
assertGrade(tomItem, { parts: ["Tom"], value: "Tom" }, false, "only one answer");
assertGrade(tomItem, { parts: ["Tom", "Tom"], value: "Tom Tom" }, false, "duplicate wrong");
assertGrade(tomItem, { parts: ["Tom", "nope"], value: "Tom nope" }, false, "one wrong");

const orderedItem = {
  id: "o01",
  type: "fill",
  blanks: 2,
  accept: ["Do|Does"],
};
assertGrade(orderedItem, { parts: ["Does", "Do"], value: "Does Do" }, false, "ordered rejects swap");
assertGrade(orderedItem, { parts: ["Do", "Does"], value: "Do Does" }, true, "ordered accepts tuple");
assertGrade(
  orderedItem,
  { parts: ["Do Does"], value: "Do Does" },
  false,
  "ordered rejects merged single box"
);
assertGrade(
  orderedItem,
  { parts: ["Do", "Does"], value: "Do Does" },
  true,
  "ordered no join-fallback still tuple"
);
const joinOnly = {
  id: "j01",
  type: "fill",
  blanks: 2,
  accept: ["a|b"],
};
assertGrade(joinOnly, { parts: ["a", "b"], value: "a b" }, true, "tuple match");
assertGrade(joinOnly, { parts: ["a b"], value: "a b" }, false, "join string one part fails");

const marks = R.perBlankMarks(tomItem, { parts: ["student", "nope"], value: "student nope" });
if (!marks || marks[0] !== true || marks[1] !== false) fail("unordered per-blank marks", marks);

const blueTom = JSON.parse(
  fs.readFileSync(path.join(REPO, "data/blue1/unit01/lesson02-walk1.json"), "utf8")
).items.find((it) => it.id === "a05");
assertGrade(blueTom, { parts: ["Tom", "student"], value: "" }, true, "live blue a05");
assertGrade(blueTom, { parts: ["student"], value: "" }, false, "live blue a05 partial");

const koItem = {
  id: "k01",
  type: "fill",
  blanks: 1,
  accept: ["나무 위", "나무위"],
};
assertGrade(koItem, { value: "나무위" }, true, "korean ignores spaces");
assertGrade(koItem, { value: "나무 위" }, true, "korean spaces ok");

console.log(bad ? "FAILURES: " + bad : "ALL UNORDERED TESTS OK");
process.exit(bad ? 1 : 0);
