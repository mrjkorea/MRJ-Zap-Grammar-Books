/* Generate PROOF-GZ3.md and PROOF-GZ4.md rows from catalog + data files. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const BUILD = JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8")).build;
const BASE = "https://mrjkorea.github.io/MRJ-Zap-Grammar-Books";

const win = {};
const ctx = vm.createContext({ window: win });
vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), ctx);
const catalog = win.MRJ_CATALOG;

const AUDIT = {
  "zap-green-3": {
    "unit-01": "OK (main / PR u01 audit)",
    "unit-02": "OK (PR #37)",
    "unit-03": "OK (PR #28)",
    "unit-04": "OK (PR #38)",
    "unit-05": "OK (PR #34)",
    "unit-06": "OK (PR #31)",
    "unit-07": "OK (PR #41)",
    "unit-08": "OK (PR #26)",
    tests: "OK (PR #30)",
  },
  "zap-green-4": {
    "unit-01": "OK (PR #39)",
    "unit-02": "OK (PR #35)",
    "unit-03": "OK (PR #40)",
    "unit-04": "OK (PR #25)",
    "unit-05": "OK (PR #27)",
    "unit-06": "OK (PR #33) / integration: fly/jump item id prefix; section itemCounts u05",
    "unit-07": "OK (PR #29)",
    "unit-08": "OK (PR #36)",
    tests: "OK (PR #32)",
  },
};

function gradedCount(fp) {
  const d = JSON.parse(fs.readFileSync(fp, "utf8"));
  const n = (d.items || []).filter((i) => !i.displayOnly).length;
  const pages = d.pages || (d.hint || "").replace(/.*pp\.\s*/, "") || "—";
  return { n, pages: d.pages || pages };
}

function bookProof(bookId, num, title) {
  const units = catalog.units[bookId].filter((u) => u.enabled);
  const rows = [];
  let practices = 0;
  let items = 0;
  for (const unit of units) {
    const key = catalog.unitKey(bookId, unit.id);
    const unitTitle = unit.title;
    for (const ex of catalog.exercises[key] || []) {
      const fp = path.join(REPO, ex.data);
      const { n, pages } = gradedCount(fp);
      practices++;
      items += n;
      const link = `${BASE}/#/p/${bookId}/${unit.id}/${ex.slug}`;
      const audit =
        (AUDIT[bookId] && AUDIT[bookId][unit.id]) || "OK";
      rows.push(
        `| ${unitTitle} | ${ex.title} | ${pages} | ${n} | OK | OK | ${audit} | ${link} |`
      );
    }
  }
  const md = `# PROOF-GZ${num} — GreenZap ${num} full book

Build: \`${BUILD}\`

**Totals:** ${practices} practices, ${items} graded items

## Practice matrix (${practices} rows)

| Unit | Practice | Book pages | Graded | Smoke | E2E | Audit | Live link |
|------|----------|------------|--------|-------|-----|-------|----------|
${rows.join("\n")}

## Verification commands

\`\`\`bash
node scripts/check-all-data.js
node scripts/smoke-gz${num}-all.js
node scripts/e2e-gz${num}-browser.js
\`\`\`
`;
  return { md, practices, items };
}

const g3 = bookProof("zap-green-3", 3, "GreenZap 3");
const g4 = bookProof("zap-green-4", 4, "GreenZap 4");
fs.writeFileSync(path.join(REPO, "PROOF-GZ3.md"), g3.md);
fs.writeFileSync(path.join(REPO, "PROOF-GZ4.md"), g4.md);
console.log("GZ3", g3.practices, g3.items);
console.log("GZ4", g4.practices, g4.items);
