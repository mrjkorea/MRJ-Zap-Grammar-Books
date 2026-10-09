/* Apply image-verified Unit 01 audit (GZ1 + GZ3). Run: node scripts/apply-u01-unit01-audit.js */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const AUDIT = JSON.parse(fs.readFileSync(path.join(__dirname, "_audit-u01-unit01.json"), "utf8"));

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

function uniq(arr) {
  const out = [];
  const seen = new Set();
  for (const x of arr) {
    const k = String(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function mergeAccept(item, adds, remove = []) {
  const rem = new Set(remove.map(String));
  item.accept = uniq([...(item.accept || []).filter((a) => !rem.has(String(a))), ...adds]);
}

for (const fix of AUDIT.mcChoiceOrderFixes || []) {
  const fp = path.join(REPO, fix.file);
  const data = loadJson(fp);
  const it = data.items.find((i) => i.id === fix.id);
  if (!it) throw new Error(`${fix.file} missing ${fix.id}`);
  if (fix.after) it.choices = fix.after;
  saveJson(fp, data);
}

for (const g of AUDIT.koreanAcceptGaps || []) {
  const fp = path.join(REPO, g.file);
  const data = loadJson(fp);
  const it = data.items.find((i) => i.id === g.id);
  if (!it) throw new Error(`${g.file} missing ${g.id}`);
  mergeAccept(it, g.suggestedAdds || []);
  saveJson(fp, data);
}

for (const g of AUDIT.englishAcceptGaps || []) {
  const fp = path.join(REPO, g.file);
  const data = loadJson(fp);
  const it = data.items.find((i) => i.id === g.id);
  if (!it) throw new Error(`${g.file} missing ${g.id}`);
  if (g.replaceAccept) {
    it.accept = uniq(g.replaceAccept);
  } else {
    mergeAccept(it, g.suggestedAdds || [], g.remove || []);
  }
  saveJson(fp, data);
}

for (const m of AUDIT.practiceMetaFixes || []) {
  const fp = path.join(REPO, m.file);
  const data = loadJson(fp);
  if (m.timerMinutes != null) data.timerMinutes = m.timerMinutes;
  if (m.id) {
    const it = data.items.find((i) => i.id === m.id);
    if (!it) throw new Error(`${m.file} missing ${m.id}`);
    if (m.blanks != null) it.blanks = m.blanks;
    if (m.promptEn != null) it.promptEn = m.promptEn;
  }
  saveJson(fp, data);
}

console.log("Applied Unit 01 audit fixes.");
