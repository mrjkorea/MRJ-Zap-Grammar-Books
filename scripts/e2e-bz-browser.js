/* Run BlueZap E2E per book (separate processes). Usage: node scripts/e2e-bz-browser.js [1-4|all] */
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const REPO = path.join(__dirname, "..");
const arg = process.argv[2] || "all";
const books = arg === "all" ? [1, 2, 3, 4] : [Number(arg)];

if (books.some((n) => !Number.isInteger(n) || n < 1 || n > 4)) {
  console.error("Usage: node scripts/e2e-bz-browser.js [1|2|3|4|all]");
  process.exit(1);
}

if (arg === "all") {
  const resultsPath = path.join(REPO, "scripts/e2e-bz-results.json");
  fs.writeFileSync(resultsPath, JSON.stringify({ practices: {}, books: {} }, null, 2) + "\n");
}

let failed = false;
for (const n of books) {
  console.log(`\n=== BlueZap ${n} (fresh process) ===\n`);
  const r = spawnSync(process.execPath, [path.join(__dirname, "e2e-bz-book.js"), String(n)], {
    cwd: REPO,
    stdio: "inherit",
    env: { ...process.env },
  });
  if (r.status !== 0) failed = true;
}
if (failed) process.exit(1);
const data = JSON.parse(fs.readFileSync(path.join(REPO, "scripts/e2e-bz-results.json"), "utf8"));
const total = Object.values(data.books).reduce((s, b) => s + (b.passed || 0), 0);
console.log(`\nE2E ALL OK — ${total} practices across books`, Object.keys(data.books).sort().join(", "));
