/* Drop accept[] entries whose pipe segment count ≠ item.blanks (Blue data only). */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
let fixed = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".json")) {
      const raw = fs.readFileSync(p, "utf8");
      const d = JSON.parse(raw);
      let ch = false;
      for (const it of d.items || []) {
        const blanks = it.blanks || 1;
        if (!it.accept || blanks <= 1) continue;
        const next = it.accept.filter((a) => {
          const s = String(a);
          if (!s.includes("|")) return true;
          const parts = s.split("|");
          return parts.length === blanks && parts.every((x) => String(x).trim());
        });
        if (next.length !== it.accept.length) {
          it.accept = next;
          ch = true;
          fixed++;
        }
      }
      if (ch) fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
    }
  }
}

for (const b of ["blue1", "blue2", "blue3", "blue4"]) {
  const root = path.join(REPO, "data", b);
  if (fs.existsSync(root)) walk(root);
}
console.log("fixed items:", fixed);
