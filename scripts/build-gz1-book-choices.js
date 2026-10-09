/* Build scripts/gz1-book-choices.json from all GreenZap 1 MC items. */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const ROOT = path.join(REPO, "data/green1");
const OUT = path.join(__dirname, "gz1-book-choices.json");

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (f.endsWith(".json")) acc.push(p);
  }
  return acc;
}

const manifest = { build: null, items: {} };
for (const fp of walk(ROOT).sort()) {
  const rel = path.relative(REPO, fp).replace(/\\/g, "/");
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!data.items) continue;
  for (const it of data.items) {
    if (it.type !== "mc" || !it.choices?.length) continue;
    const key = `${rel}#${it.id}`;
    manifest.items[key] = it.choices.slice();
  }
}

const ver = JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8"));
manifest.build = ver.build;
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log("Wrote", OUT, Object.keys(manifest.items).length, "MC items");
