/* Smoke-grade RedZap 1 Reviews 01–05 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const PARTS = ["review01", "review02", "review03", "review04", "review05"];
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

for (const part of PARTS) {
  const fp = path.join(REPO, "data/red1", part, "review.json");
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
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
    if (r && !w) ok++;
    else {
      bad++;
      console.log("FAIL", part, it.id, r, w, it.accept);
    }
  }
  console.log(part.padEnd(10), d.practiceId.padEnd(18), "graded", graded, "ok", ok);
}

console.log(bad ? "FAILURES: " + bad : "ALL " + total + " Red review items grade OK");
process.exit(bad ? 1 : 0);
