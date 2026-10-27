#!/usr/bin/env node
/**
 * Fail if chunilmun1 speakable practice items lack baked mp3 + manifest entries
 * (same skip rules as scripts/audio-bake/bake_audio.py extract_item_audio).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const DATA = path.join(REPO, "data/chunilmun1");
const AUDIO = path.join(REPO, "audio");
const MANIFEST = path.join(AUDIO, "manifest.json");

const BLANK_RE = /_{2,}|…+/;
const PAREN_CHOICE_RE = /\(\s*([^)]+?\/[^=)]*?)\s*\)/;
const TAG_RE = /\[(?:그림|사진|밑줄|광고)[^\]]*\]/g;
const ARROW_RE = /^\s*(?:→|->)/;

function stripTags(s) {
  return String(s || "")
    .replace(TAG_RE, "")
    .replace(/\[밑줄:[^\]]*\]/g, "");
}

function looksLikeWordBank(line) {
  const m = String(line).trim().match(/^\(([^)]+)\)$/);
  if (!m) return false;
  const inner = m[1];
  if (inner.includes("/") || inner.includes(",")) {
    const parts = inner.split(/\s*\/\s*|\s*,\s*/);
    if (parts.length >= 2 && parts.every((p) => p.trim().length < 40)) return true;
  }
  return false;
}

function hasBlank(s) {
  return BLANK_RE.test(s) || PAREN_CHOICE_RE.test(s);
}

function isCompleteEnglish(line) {
  if (!line || hasBlank(line) || looksLikeWordBank(line)) return false;
  return /[A-Za-z]/.test(line);
}

function replaceBlanks(s) {
  return s
    .replace(PAREN_CHOICE_RE, "⟦BLANK⟧")
    .replace(BLANK_RE, "⟦BLANK⟧")
    .replace(/\(\s*\)/g, "⟦BLANK⟧");
}

function stripTrailingHints(ln) {
  let line = ln;
  while (true) {
    const m = line.match(/\s*\(([^)]*)\)\s*$/);
    if (!m) break;
    if (m[1].includes("/")) break;
    line = line.slice(0, m.index).trimEnd();
  }
  return line;
}

function extractItemAudio(it) {
  const t = it.type;
  const m = it.answerMode;
  if (t === "match" || m === "match") return { skip: "match" };
  if (it.example || it.displayOnly) return { skip: "example" };

  let pe = stripTags(it.promptEn || "").trim();
  if (!pe) return { skip: "no_english_prompt" };

  let lines = pe
    .split("\n")
    .map((ln) => ln.trim())
    .filter(Boolean);
  lines = lines.filter((ln) => !looksLikeWordBank(ln));
  lines = lines.filter((ln) => !ARROW_RE.test(ln));
  const filtered = [];
  for (const ln of lines) {
    if (ln.includes("→") || ln.includes("->")) {
      if (ln.trim().startsWith("→") || ln.trim().startsWith("->")) continue;
      const left = ln.split(/→|->/)[0].trim();
      if (left && isCompleteEnglish(left)) filtered.push(left);
      continue;
    }
    filtered.push(ln);
  }
  lines = filtered.map(stripTrailingHints).filter(Boolean);
  if (!lines.length) return { skip: "only_wordbank_or_answer_line" };

  let speakLines;
  if (lines.length === 1) speakLines = lines;
  else {
    const [first, ...rest] = lines;
    if (isCompleteEnglish(first) && rest.some(hasBlank)) speakLines = [first];
    else if (hasBlank(first)) speakLines = [first];
    else {
      const blankLines = lines.filter(hasBlank);
      speakLines = blankLines.length ? [blankLines[0]] : [first];
    }
  }

  let text = speakLines.join(" ").replace(/\s+/g, " ").trim();
  if (!text || !/[A-Za-z]/.test(text)) return { skip: "no_speakable_english" };

  const marked = replaceBlanks(text);
  const accept = it.accept || [];
  let emptied = marked.replace(/⟦BLANK⟧/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/[.!?]+$/g, "");
  for (const a of accept) {
    for (const part of String(a).split("|")) {
      const ans = part.trim().toLowerCase().replace(/[.!?]+$/g, "");
      if (ans.length >= 4 && emptied === ans) return { skip: "spoken_equals_answer" };
    }
  }

  if (marked.includes("⟦BLANK⟧")) return { speak: true };
  return { speak: true };
}

function practicePaths(filePath) {
  const parts = filePath.split(path.sep);
  const idx = parts.indexOf("data");
  return { book: parts[idx + 1], unit: parts[idx + 2], stem: path.basename(filePath, ".json") };
}

function loadManifestByFile() {
  if (!fs.existsSync(MANIFEST)) return {};
  const m = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const byFile = {};
  const books = m.books || {};
  for (const bk of Object.keys(books)) {
    for (const pk of Object.keys(books[bk] || {})) {
      const p = books[bk][pk];
      if (p && p.file) byFile[p.file] = p;
    }
  }
  return byFile;
}

function relJsonPath(absPath) {
  return path.relative(REPO, absPath).split(path.sep).join("/");
}

let bad = 0;
const byFile = loadManifestByFile();
const missing = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".json")) {
      const rel = relJsonPath(p);
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      const { book, unit } = practicePaths(p);
      const practiceId = (d.practiceId || path.basename(p, ".json")).replace(/:/g, "-");
      for (const it of d.items || []) {
        const ex = extractItemAudio(it);
        if (ex.skip) continue;
        const manifestEntry = byFile[rel];
        const itemRec = manifestEntry && manifestEntry.items && manifestEntry.items[it.id];
        if (!itemRec || !itemRec.audio) {
          bad++;
          missing.push(`${rel} ${it.id} no manifest`);
          continue;
        }
        const mp3 = path.join(AUDIO, itemRec.audio);
        if (!fs.existsSync(mp3) || fs.statSync(mp3).size < 200) {
          bad++;
          missing.push(`${rel} ${it.id} missing ${itemRec.audio}`);
        }
      }
    }
  }
}

walk(DATA);

if (bad) {
  console.error("check-chunilmun-audio FAIL:", bad);
  missing.slice(0, 40).forEach((line) => console.error(" ", line));
  if (missing.length > 40) console.error(`  ... and ${missing.length - 40} more`);
  process.exit(1);
}

const stem = spawnSync("node", ["scripts/check-no-guessed-stems.js"], { cwd: REPO, stdio: "inherit" });
if (stem.status !== 0) process.exit(stem.status || 1);

console.log("check-chunilmun-audio OK (speakable items have mp3 + manifest)");
