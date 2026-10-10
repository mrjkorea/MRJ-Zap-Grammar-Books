const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const circled = "①②③④⑤";

function walk(dir, fn) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, fn);
    else if (ent.name.endsWith(".json")) fn(p);
  }
}

function reorderMcAccept(it) {
  if (it.type !== "mc" || !it.choices?.length) return false;
  const good = [];
  for (const c of it.choices) {
    const idx = it.choices.indexOf(c);
    good.push(String(idx + 1));
    const circ = circled[idx];
    if (circ) good.push(circ);
    good.push(c);
  }
  const pick = good.find((a) => {
    const i = /^\d+$/.test(a) ? Number(a) - 1 : circled.indexOf(a);
    if (i >= 0 && i < it.choices.length) return true;
    return it.choices.includes(a);
  });
  if (!pick || it.accept[0] === pick) return false;
  const rest = it.accept.filter((x) => x !== pick);
  it.accept = [pick, ...rest];
  return true;
}

let n = 0;
for (const b of ["blue1", "blue2", "blue3", "blue4"]) {
  walk(path.join(REPO, "data", b), (fp) => {
    const d = JSON.parse(fs.readFileSync(fp, "utf8"));
    let ch = false;
    for (const it of d.items || []) {
      if (reorderMcAccept(it)) ch = true;
      const blanks = it.blanks || 1;
      for (const a of it.accept || []) {
        if (String(a).includes("|")) {
          const len = String(a).split("|").length;
          if (len > blanks) {
            it.blanks = len;
            ch = true;
          }
        }
      }
    }
    if (ch) {
      fs.writeFileSync(fp, JSON.stringify(d, null, 2) + "\n");
      n++;
    }
  });
}
console.log("files updated:", n);
