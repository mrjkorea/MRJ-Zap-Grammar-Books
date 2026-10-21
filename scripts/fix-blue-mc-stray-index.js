/* Remove numeric MC accept entries that contradict the item's text/letter/circled accepts.
   fix-blue-blanks-mc.js once prepended "1" to every Blue MC accept, which graded choice 1 correct. */
const fs = require("fs"), path = require("path");
const REPO = path.join(__dirname, ".."), circled = "①②③④⑤⑥⑦⑧";
function walk(d, fn) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, fn) : e.name.endsWith(".json") && fn(p); } }
let items = 0, files = 0;
for (const b of fs.readdirSync(path.join(REPO, "data"))) walk(path.join(REPO, "data", b), (fp) => {
  const d = JSON.parse(fs.readFileSync(fp, "utf8")); let ch = false;
  for (const it of (d && d.items) || []) {
    if (it.type !== "mc" || !it.choices?.length) continue;
    const acc = (it.accept || []).map(String), good = new Set();
    for (const a of acc) {
      const i = it.choices.indexOf(a); if (i >= 0) good.add(i + 1);
      if (/^[a-h]$/.test(a)) good.add("abcdefgh".indexOf(a) + 1);
      if (a.length === 1 && circled.includes(a)) good.add(circled.indexOf(a) + 1);
    }
    if (!good.size) continue;
    const kept = acc.filter((a) => !/^\d+$/.test(a) || good.has(Number(a)));
    if (kept.length !== acc.length) {
      const n = [...good][0]; if (!kept.some((a) => /^\d+$/.test(a))) kept.unshift(String(n));
      else { const k = kept.find((a) => /^\d+$/.test(a)); kept.splice(kept.indexOf(k), 1); kept.unshift(k); }
      it.accept = kept; ch = true; items++;
    }
  }
  if (ch) { fs.writeFileSync(fp, JSON.stringify(d, null, 2) + "\n"); files++; }
});
console.log("mc items fixed:", items, "files:", files);
