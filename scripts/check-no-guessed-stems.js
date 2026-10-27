#!/usr/bin/env node
/**
 * Fail if chunilmun1 practice JSON contains placeholder / answer-key-only stems.
 * Practices must be built from student-book or workbook page scans.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const ROOT = path.join(REPO, "data/chunilmun1");

/** Chapters rebuilt from page scans in this effort (expand as more PDFs land). */
const VERIFIED_PATH = /data\/chunilmun1\/(chapter0[1-5]|review-01)\//;

const WB_PLACEHOLDER = /WB\d+-U\d*-[A-D]\d*\s+_+/;
const ONLY_BLANK_STEM = /^[\s_]+(\.|$)/;
const PLACEHOLDER_WORD = /\bplaceholder\b/i;

function walkJsonFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJsonFiles(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function checkItem(rel, it, problems) {
  const pe = String(it.promptEn || "");
  if (WB_PLACEHOLDER.test(pe)) {
    problems.push(`${rel} ${it.id}: WB placeholder stem`);
  }
  if (pe && ONLY_BLANK_STEM.test(pe.replace(/________/g, "_"))) {
    problems.push(`${rel} ${it.id}: blank-only English stem`);
  }
  if (PLACEHOLDER_WORD.test(pe)) {
    problems.push(`${rel} ${it.id}: contains "placeholder"`);
  }
  const acc = it.accept;
  if (Array.isArray(acc) && acc.length === 1 && String(acc[0]).toLowerCase() === "answer") {
    problems.push(`${rel} ${it.id}: accept is only "answer"`);
  }
  if (it.type === "mc" && Array.isArray(it.choices)) {
    const badChoices = it.choices.every((c) => /^[a-d]$/.test(String(c).trim()));
    if (badChoices && it.choices.length >= 2) {
      problems.push(`${rel} ${it.id}: MC choices are placeholder a–d only`);
    }
  }
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error("missing", ROOT);
    process.exit(1);
  }
  const problems = [];
  for (const fp of walkJsonFiles(ROOT)) {
    const rel = path.relative(REPO, fp).replace(/\\/g, "/");
    if (!VERIFIED_PATH.test(rel)) continue;
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch (e) {
      problems.push(`${rel}: invalid JSON (${e.message})`);
      continue;
    }
    for (const it of doc.items || []) {
      checkItem(rel, it, problems);
    }
  }
  if (problems.length) {
    console.error("check-no-guessed-stems: FAIL");
    for (const p of problems) console.error(" -", p);
    process.exit(1);
  }
  console.log("check-no-guessed-stems: OK");
}

main();
