/* Build gz1-korean-variants.json for smoke-gz1-korean.js */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const entries = [];

function add(file, id, mustPass, mustFail = []) {
  entries.push({ file, id, mustPass, mustFail });
}

const u06 = JSON.parse(fs.readFileSync(path.join(__dirname, "_audit-u06.json"), "utf8")).koreanAcceptGaps;
for (const g of u06) {
  add(`data/green1/unit06/${g.file}`, g.id, g.suggestedAdds);
}

const u07 = JSON.parse(fs.readFileSync(path.join(__dirname, "_audit-rest-korean.json"), "utf8")).koreanAcceptGaps;
for (const g of u07) {
  add(g.file, g.id, g.suggestedAdds);
}
const u78 = fs.existsSync(path.join(__dirname, "_audit-u07-08-tests-korean.json"))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, "_audit-u07-08-tests-korean.json"), "utf8")).koreanAcceptGaps
  : [];
for (const g of u78) {
  add(g.file, g.id, g.suggestedAdds);
}

add("data/green1/unit05/run.json", "b09", ["쉬어도 좋다", "쉬어도 좋아"]);
add("data/green1/unit05/run.json", "b10", ["해도 좋다", "해도 좋아"]);
add("data/green1/unit06/wrap.json", "w1_1", ["해도 좋다|may|not", "해도 된다|may|not"]);
add("data/green1/unit06/wrap.json", "w2_1", ["해야 한다|해서는 안 된다", "해야 한다|하면 안 된다"]);
add("data/green1/unit06/wrap.json", "w2_3", ["~임에 틀림없다", "임에 틀림없다"]);

const out = { build: JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8")).build, entries };
fs.writeFileSync(path.join(__dirname, "gz1-korean-variants.json"), JSON.stringify(out, null, 2) + "\n");
console.log("Wrote gz1-korean-variants.json", entries.length, "items");
