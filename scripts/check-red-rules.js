#!/usr/bin/env node
/**
 * Red ZAP data rule checks (Walk match KO<->EN, unique rights, max 7 pairs, etc.)
 */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const HANGUL = /[\uAC00-\uD7A3]/;
const errors = [];

function isHangul(s) {
  return HANGUL.test(s || "");
}
function isEnglishOnly(s) {
  return s && !HANGUL.test(s);
}
function checkMatchFile(p, skipKoEn) {
  const d = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const it of d.items || []) {
    if (it.type !== "match" || it.displayOnly) continue;
    const pairs = it.pairs || [];
    if (pairs.length > 7) {
      errors.push(`${p} ${it.id}: ${pairs.length} pairs (max 7)`);
    }
    const rights = [];
    for (const pr of pairs) {
      if (/^\d+\.\s/.test(pr.right)) {
        errors.push(`${p} ${it.id}: numbered right "${pr.right}"`);
      }
      if (!skipKoEn) {
        const koL = isHangul(pr.left);
        const koR = isHangul(pr.right);
        const enL = isEnglishOnly(pr.left);
        const enR = isEnglishOnly(pr.right);
        if (enL && enR) {
          errors.push(`${p} ${it.id}: English<->English pair ${pr.left} | ${pr.right}`);
        }
        if (koL && koR) {
          errors.push(`${p} ${it.id}: Korean<->Korean pair`);
        }
        if (!koL && !enL) {
          errors.push(`${p} ${it.id}: left side neither clear KO nor EN: ${pr.left}`);
        }
      }
      if (rights.includes(pr.right)) {
        errors.push(`${p} ${it.id}: duplicate right "${pr.right}"`);
      }
      rights.push(pr.right);
    }
    const acc = it.accept || [];
    if (acc.length !== pairs.length) {
      errors.push(`${p} ${it.id}: accept length mismatch`);
    }
  }
}

function checkSectionWordBanks() {
  for (const book of ["red1", "red2"]) {
    const base = path.join(REPO, "data", book);
    if (!fs.existsSync(base)) continue;
    for (const u of fs.readdirSync(base)) {
      const dir = path.join(base, u);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
        const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        if (!(d.sections || []).some((s) => s.wordBank && s.wordBank.length)) continue;
        if (f === "fly.json" && u === "unit02" && book === "red1") {
          const secB = d.sections.find((s) => s.id === "B");
          if (!secB || !secB.wordBank || !secB.wordBank.length) {
            errors.push(`red1 unit02 fly.json: section B missing wordBank`);
          }
        }
      }
    }
  }
}

function walkDataDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkDataDir(p);
    else if (f.endsWith(".json")) {
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      if (!(d.items || []).some((it) => it.type === "match")) continue;
      const rel = p.replace(/\\/g, "/");
      const walkOnlyKoEn = /walk\.json$/.test(rel);
      const skipKoEn = !walkOnlyKoEn || /data\/red1\/unit01\/walk\.json$/.test(rel);
      checkMatchFile(p, skipKoEn);
    }
  }
}

for (const book of ["red1", "red2"]) {
  walkDataDir(path.join(REPO, "data", book));
}
checkSectionWordBanks();

if (errors.length) {
  console.error("check-red-rules: FAIL\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("check-red-rules: OK");
