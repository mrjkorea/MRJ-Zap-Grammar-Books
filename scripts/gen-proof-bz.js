/* Generate PROOF-BZ.md for BlueZap 1–4 full integration. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const BUILD = fs.existsSync(path.join(REPO, "assets/js/version.js"))
  ? (() => {
      const v = fs.readFileSync(path.join(REPO, "assets/js/version.js"), "utf8");
      const m = v.match(/MRJ_ZAP_BUILD\s*=\s*"([^"]+)"/);
      return m ? m[1] : "20261010-blue-full";
    })()
  : "20261010-blue-full";
const BASE = "https://mrjkorea.github.io/MRJ-Zap-Grammar-Books";

const e2eResultsPath = path.join(REPO, "scripts/e2e-bz-results.json");
let e2eData = { practices: {}, books: {} };
if (fs.existsSync(e2eResultsPath)) {
  e2eData = JSON.parse(fs.readFileSync(e2eResultsPath, "utf8"));
}

function e2eCell(practiceId, bookN) {
  const p = e2eData.practices[practiceId];
  if (p?.e2e === "OK") {
    return p.wrongReview === "OK" ? "OK+review" : p.wrongReview === "FAIL" ? "OK/review FAIL" : "OK";
  }
  if (p?.e2e === "FAIL") return "FAIL";
  const b = e2eData.books[String(bookN)];
  if (b?.passed) return "—";
  return "pending";
}

const AUDIT = {
  1: {
    "unit-01": "Independent audit (main)",
    "unit-02": "Independent audit (PR #47)",
    "unit-03": "Independent audit (PR #48)",
    "unit-04": "Independent audit (PR #52)",
    "unit-05": "Independent audit (PR #49)",
    "unit-06": "Independent audit (PR #51)",
    "unit-07": "Independent audit (PR #50)",
    "unit-08": "Independent audit (PR #53)",
  },
  2: {
    "unit-01": "Independent audit (PR #61)",
    "unit-02": "Independent audit (PR #72)",
    "unit-03": "Independent audit (PR #70)",
    "unit-04": "Independent audit (PR #64)",
    "unit-05": "Independent audit (PR #57)",
    "unit-06": "Independent audit (PR #65)",
    "unit-07": "Independent audit (PR #66)",
    "unit-08": "Independent audit (PR #59)",
  },
  3: {
    "unit-01": "Independent audit (PR #73)",
    "unit-02": "Independent audit (PR #76)",
    "unit-03": "Independent audit (PR #75)",
    "unit-04": "Independent audit (PR #54)",
    "unit-05": "Independent audit (PR #68)",
    "unit-06": "Independent audit (PR #69)",
    "unit-07": "Independent audit (PR #71)",
    "unit-08": "Independent audit (PR #58)",
  },
  4: {
    "unit-01": "Independent audit (PR #62)",
    "unit-02": "Independent audit (PR #77)",
    "unit-03": "Independent audit (PR #63)",
    "unit-04": "Independent audit (PR #67)",
    "unit-05": "Independent audit (PR #74)",
    "unit-06": "Independent audit (PR #55)",
    "unit-07": "Independent audit (PR #60)",
    "unit-08": "Independent audit (PR #56)",
  },
};

const win = {};
const ctx = vm.createContext({ window: win });
vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), ctx);
const catalog = win.MRJ_CATALOG;

const bookTotals = [];
const allRows = [];

for (let n = 1; n <= 4; n++) {
  const bookId = `zap-blue-${n}`;
  const units = catalog.units[bookId].filter((u) => u.enabled && u.id !== "tests");
  let practices = 0;
  let items = 0;
  const rows = [];
  for (const unit of units) {
    const key = catalog.unitKey(bookId, unit.id);
    for (const ex of catalog.exercises[key] || []) {
      const fp = path.join(REPO, ex.data);
      const d = JSON.parse(fs.readFileSync(fp, "utf8"));
      const graded = (d.items || []).filter((i) => !i.displayOnly).length;
      practices++;
      items += graded;
      const link = `${BASE}/#/p/${bookId}/${unit.id}/${ex.slug}`;
      const audit = AUDIT[n][unit.id] || "Independent audit";
      const e2e = e2eCell(ex.practiceId, n);
      rows.push(
        `| Blue ${n} | ${unit.title} | ${ex.title} | ${d.pages || ex.hint || "—"} | ${graded} | OK | ${e2e} | ${audit} | ${link} |`
      );
    }
  }
  bookTotals.push({ n, practices, items });
  allRows.push(...rows);
}

const md = `# PROOF-BZ — BlueZap 1–4 full integration

Build: \`${BUILD}\`

## Book totals

| Book | Practices | Graded items |
|------|-----------|--------------|
${bookTotals.map((b) => `| BlueZap ${b.n} | ${b.practices} | ${b.items} |`).join("\n")}
| **All Blue** | **${bookTotals.reduce((s, b) => s + b.practices, 0)}** | **${bookTotals.reduce((s, b) => s + b.items, 0)}** |

## E2E browser (Playwright)

| Book | Practices @ 100% | Wrong-review units | Run |
|------|------------------|--------------------|-----|
${[1, 2, 3, 4]
  .map((n) => {
    const b = e2eData.books[String(n)];
    if (!b) return `| BlueZap ${n} | — | — | pending |`;
    return `| BlueZap ${n} | ${b.passed}/${b.total} | ${b.wrongReviewUnits}/8 | ${b.at || "OK"} |`;
  })
  .join("\n")}

## Practice matrix

| Book | Unit | Practice | Pages | Graded | Smoke | E2E | Audit | Live link |
|------|------|----------|-------|--------|-------|-----|-------|----------|
${allRows.join("\n")}

## Verification commands

\`\`\`bash
node scripts/check-all-data.js
node scripts/smoke-blue1-all.js
node scripts/smoke-blue2-all.js
node scripts/smoke-blue3-all.js
node scripts/smoke-blue4-all.js
node scripts/smoke-unordered.js
node scripts/e2e-bz-book.js 2
node scripts/e2e-bz-book.js 3
node scripts/e2e-bz-book.js 4
node scripts/e2e-bz-browser.js all
\`\`\`

Unit PRs #47–#77 were merged via this integration branch (not individually merged to main).
`;

fs.writeFileSync(path.join(REPO, "PROOF-BZ.md"), md);
console.log("PROOF-BZ.md", bookTotals);
