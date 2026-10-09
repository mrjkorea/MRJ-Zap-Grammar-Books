/* Apply audited MC / Korean accept fixes. Run: node scripts/apply-gz1-followup-fixes.js */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");

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

function mergeAccept(item, adds) {
  item.accept = uniq([...(item.accept || []), ...adds]);
}

function applyMcAudit(fileRel, fixes) {
  const fp = path.join(REPO, fileRel);
  const data = loadJson(fp);
  for (const fix of fixes) {
    const it = data.items.find((i) => i.id === fix.id);
    if (!it) throw new Error(`${fileRel} missing ${fix.id}`);
    if (fix.after) it.choices = fix.after;
    if (fix.promptAfter) it.promptEn = fix.promptAfter;
    const acc = fix.acceptAfter || fix.acceptBefore;
    if (acc) {
      const n = String(acc);
      const circled = "①②③④⑤"[Number(n) - 1] || n;
      it.accept = uniq([n, circled, ...(it.accept || []).filter((a) => !/^[①②③④⑤1-5]$/.test(String(a)))]);
      if (it.answer) it.answer = n;
    }
  }
  saveJson(fp, data);
}

function applyKoreanGaps(gaps) {
  for (const g of gaps) {
    const fp = path.join(REPO, g.file);
    const data = loadJson(fp);
    const it = data.items.find((i) => i.id === g.id);
    if (!it) throw new Error(`${g.file} missing ${g.id}`);
    mergeAccept(it, g.suggestedAdds || []);
  }
}

// Unit 04 unit test MC order (image-verified)
applyMcAudit("data/green1/unit04/unit-test-04.json", loadJson(path.join(__dirname, "_audit-u02-05-mc.json")));

// Review test 03 q10
applyMcAudit("data/green1/tests/review-test-03.json", loadJson(path.join(__dirname, "_audit-rest-mc.json")).mcChoiceOrderFixes);

// Korean gaps unit06 + unit07
const u06 = loadJson(path.join(__dirname, "_audit-u06.json")).koreanAcceptGaps.map((g) => ({
  file: `data/green1/unit06/${g.file}`,
  id: g.id,
  suggestedAdds: g.suggestedAdds,
}));
const u07 = loadJson(path.join(__dirname, "_audit-rest-korean.json")).koreanAcceptGaps;
applyKoreanGaps([...u06, ...u07]);

// Unit 05 Run B: widen common Korean gloss variants (book-aligned synonyms)
const u05run = path.join(REPO, "data/green1/unit05/run.json");
const run5 = loadJson(u05run);
const widen = {
  b09: ["쉬어도 좋다", "쉬어도 좋아"],
  b10: ["해도 좋다", "해도 좋아"],
};
for (const it of run5.items) {
  if (widen[it.id]) mergeAccept(it, widen[it.id]);
}
saveJson(u05run, run5);

console.log("Applied follow-up data fixes.");
