/* Smoke-grade RedZap 2 Unit 03 — all practices, right=pass / wrong=fail. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/red2/unit03");
const win = { MRJ_SCORES: { post: () => {} } };
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;

function respFor(it) {
  if (it.type === "match") {
    const links = {};
    for (const p of it.pairs || []) links[p.left] = p.right;
    return { links };
  }
  if (it.type === "mc") {
    const a = it.accept[0];
    const idx = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
    return { value: it.choices[idx] };
  }
  if ((it.blanks || 1) > 1) {
    const parts = it.accept[0].split("|");
    return { parts, value: parts.join(" ") };
  }
  return { value: it.accept[0] };
}

function wrongResp(it, right) {
  if (it.type === "match") {
    const links = Object.assign({}, right.links);
    const keys = Object.keys(links);
    if (keys.length) links[keys[0]] = "WRONG";
    return { links };
  }
  if (it.type === "mc") {
    const idx = it.choices.indexOf(right.value);
    return { value: it.choices[(idx + 1) % it.choices.length] };
  }
  if (right.parts) {
    const wp = right.parts.slice();
    wp[0] = "xyz";
    return { parts: wp, value: wp.join(" ") };
  }
  return { value: "nope" };
}

let total = 0;
let bad = 0;
let pairTotal = 0;

for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  let ok = 0;
  let graded = 0;
  for (const it of d.items) {
    if (it.displayOnly) continue;
    graded++;
    total++;
    const right = respFor(it);
    const wrong = wrongResp(it, right);
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrong);
    if ((it.blanks || 1) > 1 && right.parts) {
      const parts = right.parts;
      if (it.unordered && parts.length >= 2) {
        const rev = parts.slice().reverse();
        if (!E.gradeItem(it, { parts: rev, value: rev.join(" ") })) {
          bad++;
          console.log("UNORDERED-REV-FAIL", f, it.id);
        }
      } else if (!it.unordered) {
        const rev = parts.slice().reverse();
        if (E.gradeItem(it, { parts: rev, value: rev.join(" ") })) {
          bad++;
          console.log("ORDERED-REV-PASS", f, it.id);
        }
      }
    }
    if (it.type === "match") pairTotal += (it.pairs || []).length;
    if (r && !w) ok++;
    else {
      bad++;
      console.log("FAIL", f, it.id, r, w);
    }
  }
  console.log(f.padEnd(14), (d.practiceId || "").padEnd(16), "graded", graded, "ok", ok);
}
console.log(
  bad
    ? "FAILURES: " + bad
    : "ALL " + total + " Red U03 items grade OK (" + pairTotal + " match pairs in walk)"
);
process.exit(bad ? 1 : 0);
