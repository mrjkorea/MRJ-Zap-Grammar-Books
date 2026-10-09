/* Lock MC choice order against scripts/gz1-book-choices.json */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "gz1-book-choices.json"), "utf8"));
const ver = JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8"));
let bad = 0;

if (manifest.build !== ver.build) {
  console.log("FAIL build mismatch manifest", manifest.build, "version.json", ver.build);
  bad++;
}

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (f.endsWith(".json")) acc.push(p);
  }
  return acc;
}

let checked = 0;
for (const fp of walk(path.join(REPO, "data/green1")).sort()) {
  const rel = path.relative(REPO, fp).replace(/\\/g, "/");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!data.items) continue;
  for (const it of data.items) {
    if (it.type !== "mc" || !it.choices?.length) continue;
    checked++;
    const key = `${rel}#${it.id}`;
    const exp = manifest.items[key];
    if (!exp) {
      bad++;
      console.log("FAIL missing manifest key", key);
      continue;
    }
    if (exp.length !== it.choices.length || exp.some((c, i) => c !== it.choices[i])) {
      bad++;
      console.log("FAIL choice order", key);
    }
  }
}

if (bad) {
  console.log("FAILURES:", bad, "checked", checked);
  process.exit(1);
}
console.log(`GreenZap 1 choice-order smoke: OK (${checked} MC items)`);
