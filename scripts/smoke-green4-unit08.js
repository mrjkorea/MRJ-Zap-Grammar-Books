/* Smoke-grade GreenZap 4 Unit 08: structure locks + engine grading. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/green4/unit08");
const MODES = new Set(["choice", "words", "sentence"]);
const win = {};
const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
for (const f of ["assets/js/normalize.js", "assets/js/engine.js"]) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), "utf8"), ctx);
}
const E = win.MRJ_ENGINE;

let bad = 0;
const fail = (...a) => {
  bad++;
  console.log("FAIL", ...a);
};

function respFor(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
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
    const r = respFor(it, it.accept[0]);
    const i = it.choices.indexOf(r.value);
    return { value: it.choices[(i + 1) % it.choices.length] };
  }
  if ((it.blanks || 1) > 1 || String(it.accept[0]).includes("|")) {
    const p = String(it.accept[0]).split("|");
    p[p.length - 1] = "xyz";
    return { parts: p, value: p.join(" ") };
  }
  return { value: "nope" };
}

let total = 0;
for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith(".json")).sort()) {
  const fp = path.join(DATA, f);
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
  const slug = (d.practiceId || "").split(":").pop();
  const ids = new Set();
  const labels = new Set();
  let ok = 0;

  for (const it of d.items) {
    for (const k of ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "label", "type", "accept"]) {
      if (it[k] == null || it[k] === "") fail(f, it.id, "missing", k);
    }
    if (!MODES.has(it.answerMode)) fail(f, it.id, "bad answerMode", it.answerMode);
    if (ids.has(it.id)) fail(f, "dup id", it.id);
    ids.add(it.id);
    if (labels.has(it.label)) fail(f, "dup label", it.label);
    labels.add(it.label);
    if (slug && !it.id.startsWith(slug + "-")) fail(f, it.id, "id should start with", slug + "-");

    if (it.displayOnly) continue;
    total++;
    const right = respFor(it, it.accept[0]);
    if (!right) {
      fail(f, it.id, "accept[0] not usable");
      continue;
    }
    const r = E.gradeItem(it, right);
    const w = E.gradeItem(it, wrongFor(it));
    if (r && !w) ok++;
    else fail(f, it.id, "grade", r, w);

    for (const acc of it.accept) {
      const resp = respFor(it, acc);
      if (!resp) continue;
      if (!E.gradeItem(it, resp)) fail("ACCEPT-FAIL", f, it.id, acc);
    }
  }

  for (const s of d.sections) {
    const graded = d.items.filter((i) => i.section === s.id && !i.displayOnly);
    if (graded.length !== s.itemCount) fail(f, "section", s.id, "itemCount", s.itemCount, "!=", graded.length);
  }

  console.log(f.padEnd(20), (d.practiceId || "").padEnd(16), "items", d.items.length, "ok", ok, "timer", d.timerMinutes);
}

console.log(bad ? "FAILURES: " + bad : "ALL " + total + " ITEMS GRADE CORRECTLY (right=pass, wrong=fail)");
process.exit(bad ? 1 : 0);
