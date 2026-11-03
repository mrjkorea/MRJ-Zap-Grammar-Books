#!/usr/bin/env node
/**
 * Fail if chunilmun1 practice JSON contains placeholder / answer-key-only stems.
 * Practices must be built from student-book or workbook page scans.
 *
 * Scope: Ch01–12 + review-01/02/03 (see docs/SOURCE-PAGES-REQUIRED.md).
 */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const ROOT = path.join(REPO, "data/chunilmun1");

/** Practices rebuilt from page scans in this effort (expand when more PDFs land). */
const VERIFIED_PATH =
  /data\/chunilmun1\/(chapter0[1-9]|chapter10|chapter11|chapter12|review-0[123])\//;

const CHAPTER_SOURCE_REQUIRED = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const REVIEW_SOURCE_REQUIRED = ["review-01", "review-02", "review-03"];

const WB_PLACEHOLDER = /WB\d+-U\d*-?[A-D]\d*\s+_+/;
const ONLY_BLANK_STEM = /^[\s_]+(\.|$)/;
const PLACEHOLDER_WORD = /\bplaceholder\b/i;
const GENERIC_MC = /^[a-d]$/i;
const COMBO_MARK = "①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ";
const COMBO_CHOICE = new RegExp(
  `^[${COMBO_MARK}](?:\\s*[,，、]\\s*[${COMBO_MARK}])+$`
);
const COMBO_ALLOW = new Set();

function walkJsonFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJsonFiles(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*/g, "");
}

function checkTypeInLeak(rel, it, problems) {
  if (it.type !== "fill" || it.displayOnly) return;
  if (it.answerMode !== "words") return;
  const pe = stripHtml(it.promptEn || "");
  if (/<u>/i.test(it.promptEn || "")) return;
  if (!pe || pe.includes("________")) return;
  const acc = (it.accept || [])[0];
  if (!acc || String(acc).includes("|")) return;
  const word = String(acc).trim();
  if (!word || word.includes(" ") || word.length < 3 || /^[Oox]$/i.test(word)) return;
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  if (re.test(pe)) {
    problems.push(`${rel} ${it.id}: type-in prompt shows accept token "${word}"`);
  }
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
  if (it.type === "mc") {
    if (!String(pe).trim()) {
      problems.push(`${rel} ${it.id}: MC has empty promptEn`);
    }
  }
  if (it.type === "mc" && Array.isArray(it.choices)) {
    const badChoices =
      it.choices.length >= 2 && it.choices.every((c) => GENERIC_MC.test(String(c).trim()));
    if (badChoices) {
      problems.push(`${rel} ${it.id}: MC choices are placeholder a–d only`);
    }
    const circledOnly =
      it.choices.length >= 2 &&
      it.choices.every((c) => /^[①②③④⑤]$/.test(String(c).trim()));
    if (circledOnly && !pe && it.choices.length === 5) {
      problems.push(`${rel} ${it.id}: MC has only ①–⑤ with no prompt`);
    }
    const comboChoices =
      it.choices.length >= 2 && it.choices.every((c) => COMBO_CHOICE.test(String(c).trim()));
    if (comboChoices && !promptHasComboSource(pe) && !COMBO_ALLOW.has(`${rel} ${it.id}`)) {
      problems.push(`${rel} ${it.id}: combination choices without the source sentences`);
    }
  }
  checkTypeInLeak(rel, it, problems);
}

function promptHasComboSource(prompt) {
  const chunks = String(prompt || "").split(new RegExp(`(?=[${COMBO_MARK}])`));
  for (const chunk of chunks) {
    const raw = chunk.trim();
    const body = raw.replace(new RegExp(`^[${COMBO_MARK}]\\s*`), "");
    if (COMBO_CHOICE.test(body) || COMBO_CHOICE.test(raw)) continue;
    const words = body.match(/[A-Za-z가-힣']+/g) || [];
    if (new RegExp(`[${COMBO_MARK}]`).test(raw) && words.length >= 3) return true;
    if (words.length >= 5 && /[.?!]$/.test(body)) return true;
  }
  return false;
}

function checkChapterSources(problems) {
  for (const ch of CHAPTER_SOURCE_REQUIRED) {
    const md = path.join(ROOT, `chapter${String(ch).padStart(2, "0")}`, "CHAPTER-SOURCE.md");
    if (!fs.existsSync(md)) {
      problems.push(`missing CHAPTER-SOURCE.md for chapter ${String(ch).padStart(2, "0")}`);
    }
  }
  for (const rid of REVIEW_SOURCE_REQUIRED) {
    const md = path.join(ROOT, rid, "CHAPTER-SOURCE.md");
    if (!fs.existsSync(md)) {
      problems.push(`missing CHAPTER-SOURCE.md for ${rid}`);
    }
  }
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error("missing", ROOT);
    process.exit(1);
  }
  const problems = [];
  let scanned = 0;
  for (const fp of walkJsonFiles(ROOT)) {
    const rel = path.relative(REPO, fp).replace(/\\/g, "/");
    if (!VERIFIED_PATH.test(rel)) continue;
    scanned++;
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
  checkChapterSources(problems);
  if (problems.length) {
    console.error("check-no-guessed-stems: FAIL");
    console.error("See docs/SOURCE-PAGES-REQUIRED.md");
    for (const p of problems) console.error(" -", p);
    process.exit(1);
  }
  console.log(`check-no-guessed-stems: OK (${scanned} practice files, Ch01–12 + review-01/02/03)`);
}

main();
