#!/usr/bin/env node
/**
 * Make 천일문 Grammar 1+2 answer formats obvious:
 * O/X tap, rewrite only after X, multi-select, and labeled find-and-fix blanks.
 *
 * node scripts/convert-chunilmun-answer-formats.js [audit.json]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const AUDIT =
  process.argv[2] ||
  "/home/ubuntu/.cursor/projects/agent-repos-MRJ-Zap-Grammar-Books/uploads/ox_extra_confusion_969c.json";

const CIRC = "①②③④⑤⑥⑦⑧⑨⑩";
const SYM = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ";
const ASC = "abcdefghij";
const OX_RE = /O 또는 고친 말|O 또는 X|맞으면 O|맞으면 ○|생략할 수 있으면 O|셀 수 있는 명사이면 O|생략할 수 있으면 ○/;

const TAG = {
  ox: "O/X · 맞으면 O, 틀리면 고친 말",
  oxOnly: "Choose · O/X",
  multi: "Choose · 여러 개 고르기",
  parts: "Choose + write · 고르고 쓰기",
  words: "Words only · 빈칸 말만",
  sentence: "Full sentence · 문장 전체",
  choice: "Choose · 고르기",
};

const RULE = {
  ox: "O 또는 X를 누르세요. X이면 틀린 부분만 바르게 고친 말을 쓰세요. X, 쉼표, 문장 전체를 붙이지 마세요. O이면 고친 말을 쓰지 않습니다.",
  oxOnly: "O 또는 X를 누르세요. 글자로 쓰지 마세요.",
  multi: "보기를 눌러 고르세요. 번호는 쓰지 않습니다.",
  be: "be동사는 눌러 고르고, 빈칸에는 우리말 해석만 쓰세요.",
  symbol: "틀린 곳의 기호를 누르고, 고친 말만 쓰세요. 두 곳이면 지문에 먼저 나오는 곳부터입니다. 화살표나 X는 쓰지 마세요.",
  symbolType: "첫 칸에는 틀린 곳의 알파벳만 (a, b, c…), 둘째 칸에는 그 부분을 바르게 고친 말만 쓰세요. 화살표, X, 원문자는 쓰지 마세요.",
  pair: "첫 칸에는 문장에 있는 틀린 말만, 둘째 칸에는 바르게 고친 말만 쓰세요. 화살표, X, 쉼표, 문장 전체를 쓰지 마세요.",
  fixOnly: "틀린 부분을 바르게 고친 말만 쓰세요. 틀린 말, X, 화살표, 쉼표를 앞에 붙이지 마세요.",
  sentence: "고친 문장 전체를 한 칸에 쓰세요. 기호나 ‘틀린 말 → 고친 말’ 형식은 쓰지 마세요.",
  blank: "빈칸에 들어갈 말만 쓰세요. 이미 나와 있는 앞뒤 문장은 다시 쓰지 마세요.",
  numbers: "보기 번호만 숫자로 쓰세요. 순서는 상관없어요. 문장이나 기호는 쓰지 마세요.",
  numberFix: "첫 칸에는 보기 번호만 (숫자), 둘째 칸에는 그 부분을 바르게 고친 말만 쓰세요. 화살표는 쓰지 마세요.",
  twoSentences: "각 칸에 고친 문장 전체를 쓰세요. 기호, 화살표, X는 쓰지 마세요.",
};

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function loadPacks() {
  const map = new Map();
  for (const root of ["data/chunilmun1", "data/chunilmun2"]) {
    for (const file of walk(path.join(REPO, root))) {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      if (data.practiceId) map.set(data.practiceId, { file, data });
    }
  }
  return map;
}

function uniq(list) {
  const out = [];
  const seen = new Set();
  for (const raw of list) {
    const s = String(raw == null ? "" : raw).trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

function isOToken(s) {
  return /^[Oo○ㅇ]$/.test(String(s).trim());
}
function isXToken(s) {
  return /^[Xx×✕]$/.test(String(s).trim());
}
function isNumTok(s) {
  s = String(s).trim();
  return CIRC.includes(s) || /^\d+$/.test(s);
}
function isSymTok(s) {
  s = String(s).trim();
  return SYM.includes(s) || /^[a-j]$/i.test(s);
}
function symCanon(s) {
  s = String(s).trim();
  const i = SYM.indexOf(s);
  if (i >= 0) return SYM[i];
  const j = ASC.indexOf(s.toLowerCase());
  return j >= 0 ? SYM[j] : s;
}
function symAscii(s) {
  const i = SYM.indexOf(symCanon(s));
  return i >= 0 ? ASC[i] : String(s).trim();
}

function rewriteForms(accept) {
  const out = [];
  const seen = new Set();
  for (const raw of accept || []) {
    let s = String(raw).trim();
    if (isOToken(s) || isXToken(s)) continue;
    s = s.replace(/^[Xx×✕]\s*[,，]\s*/, "").replace(/^[Xx×✕]\s+/, "").trim();
    if (!s || isOToken(s) || isXToken(s)) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

function judgmentOf(item) {
  const rew = rewriteForms(item.accept);
  if (rew.length) return "X";
  if ((item.accept || []).some(isOToken)) return "O";
  if ((item.accept || []).some(isXToken)) return "X";
  return null;
}

function stripFillMeta(item) {
  delete item.blanks;
  delete item.blankPartLabels;
  delete item.unordered;
  delete item.phraseBlanks;
  delete item.answer;
}

function setHow(item, mode, tag, hint) {
  item.answerMode = mode;
  item.answerModeTag = tag;
  item.hintKo = hint;
}

function explodePrompt(prompt) {
  const out = [];
  for (const line of String(prompt || "").split("\n")) {
    const marks = line.match(/[①②③④⑤⑥⑦⑧⑨⑩]/g);
    if (marks && marks.length >= 2 && /^\s*[①②③④⑤⑥⑦⑧⑨⑩]/.test(line)) {
      line
        .split(/(?=[①②③④⑤⑥⑦⑧⑨⑩])/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => out.push(s));
    } else out.push(line);
  }
  return out;
}

function parseLineChoices(prompt) {
  const lines = explodePrompt(prompt);
  const choices = [];
  const pre = [];
  const nums = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^\s*([①②③④⑤⑥⑦⑧⑨⑩])\s*(.*)$/);
    if (m) {
      if (cur != null) choices.push(cur.trim());
      nums.push(CIRC.indexOf(m[1]) + 1);
      cur = m[2];
    } else if (cur != null) cur += "\n" + line;
    else pre.push(line);
  }
  if (cur != null) choices.push(cur.trim());
  const ok =
    nums.length >= 2 &&
    nums.every((n, i) => n === i + 1) &&
    choices.length === nums.length &&
    choices.every((c) => c.length);
  if (!ok) return null;
  return { preamble: pre.join("\n").trim(), choices, inline: false };
}

function parseInlineChoices(prompt) {
  const text = String(prompt || "");
  const marks = [...text.matchAll(/[①②③④⑤⑥⑦⑧⑨⑩]/g)];
  if (marks.length < 2) return null;
  const nums = marks.map((m) => CIRC.indexOf(m[0]) + 1);
  if (!nums.every((n, i) => n === i + 1)) return null;
  if (parseLineChoices(prompt)) return null;
  const choices = marks.map((m, i) => {
    const start = m.index + 1;
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length;
    const rest = text.slice(start, end);
    const tok = rest.match(/^\s*([A-Za-z][A-Za-z'’-]*(?:-[A-Za-z][A-Za-z'’-]*)*)/);
    return tok ? tok[1] : rest.trim().split(/\s+/)[0];
  });
  if (choices.some((c) => !c)) return null;
  return { preamble: text.trim(), choices, inline: true };
}

function parseChoices(prompt) {
  return parseLineChoices(prompt) || parseInlineChoices(prompt);
}

function parseParenChoices(prompt) {
  const m = String(prompt || "").match(/\(\s*([^()\n]+\/[^()\n]+)\s*\)/);
  if (!m) return null;
  const choices = m[1].split("/").map((s) => s.trim()).filter(Boolean);
  if (choices.length < 2 || choices.length > 6) return null;
  if (!choices.every((c) => /^[A-Za-z][A-Za-z'’ -]*$/.test(c))) return null;
  return choices;
}

function rowsOf(accept) {
  return (accept || []).map((a) => String(a).split("|").map((s) => s.trim()));
}

function sameWidth(rows) {
  if (!rows.length) return 0;
  const w = rows[0].length;
  return rows.every((r) => r.length === w) ? w : 0;
}

function multiNumberRows(item) {
  const rows = rowsOf(item.accept);
  const w = sameWidth(rows);
  if (w < 2) return null;
  if (!rows.every((r) => r.every(isNumTok))) return null;
  return rows;
}

function symbolGroups(item) {
  const rows = rowsOf(item.accept);
  const w = sameWidth(rows);
  if (w < 2 || w % 2) return null;
  if (!rows.every((r) => r.every((part, i) => (i % 2 === 0 ? isSymTok(part) : part.length > 0)))) return null;
  const groups = [];
  for (const r of rows) {
    for (let i = 0; i < r.length; i += 2) {
      const g = groups[i / 2] || { syms: [], fixes: [] };
      g.syms.push(symCanon(r[i]));
      g.fixes.push(r[i + 1]);
      groups[i / 2] = g;
    }
  }
  return groups;
}

function symbolsIn(prompt) {
  const found = [];
  const re = /[ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ]/g;
  let m;
  const text = String(prompt || "");
  while ((m = re.exec(text))) {
    if (!found.includes(m[0])) found.push(m[0]);
  }
  return found;
}

function numberFix(item) {
  const rows = rowsOf(item.accept);
  if (!sameWidth(rows) || rows[0].length !== 2) return null;
  if (!rows.every((r) => isNumTok(r[0]) && r[1] && !isNumTok(r[1]))) return null;
  return { nums: uniq(rows.map((r) => r[0])), fixes: uniq(rows.map((r) => r[1])) };
}

function beVerb(item) {
  const choices = parseParenChoices(item.promptEn || "");
  if (!choices) return null;
  const rows = rowsOf(item.accept);
  if (!sameWidth(rows) || rows[0].length !== 2) return null;
  if (!rows.every((r) => /[가-힣]/.test(r[1] || ""))) return null;
  if (!rows.every((r) => choices.some((c) => c.toLowerCase() === r[0].toLowerCase()))) return null;
  return { choices, verb: rows[0][0], koreans: uniq(rows.map((r) => r[1])) };
}

function wordPairs(item) {
  const pairs = [];
  for (const raw of item.accept || []) {
    const parts = String(raw).split("|").map((s) => s.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) continue;
    if (isSymTok(parts[0]) || isNumTok(parts[0])) continue;
    if (parts[0].split(/\s+/).length >= 4 && parts[1].split(/\s+/).length >= 4) continue;
    pairs.push(parts.join("|"));
  }
  return pairs.length ? uniq(pairs) : null;
}

function applyMulti(item, parsed) {
  item.type = "mc";
  item.select = "multi";
  item.choices = parsed.choices;
  if (!parsed.inline) item.promptEn = parsed.preamble || "다음 보기에서 고르세요.";
  setHow(item, "choice", TAG.multi, RULE.multi);
  stripFillMeta(item);
}

function applyBe(item, spec) {
  item.type = "parts";
  item.parts = [
    { kind: "mc", label: "be동사", choices: spec.choices, accept: [spec.verb] },
    { kind: "fill", label: "해석", accept: spec.koreans, placeholder: "우리말만" },
  ];
  setHow(item, "words", TAG.parts, RULE.be);
  delete item.blankPartLabels;
  delete item.unordered;
  delete item.answer;
  item.blanks = 2;
}

function applySymbolParts(item, groups, choices) {
  item.type = "parts";
  item.parts = [];
  groups.forEach((g, i) => {
    const sym = g.syms[0];
    const prefix = groups.length > 1 ? "(" + (i + 1) + ") " : "";
    item.parts.push({
      kind: "mc",
      label: prefix + "틀린 기호",
      choices,
      accept: uniq([sym, symAscii(sym), ...g.syms]),
    });
    item.parts.push({
      kind: "fill",
      label: prefix + "고친 말",
      accept: uniq(g.fixes),
      placeholder: "고친 말만",
    });
  });
  setHow(item, "words", TAG.parts, RULE.symbol);
  delete item.blankPartLabels;
  delete item.unordered;
  delete item.answer;
  item.blanks = groups.length * 2;
}

function applyNumberParts(item, spec, parsed) {
  const n = spec.nums[0];
  let idx = CIRC.indexOf(n);
  if (idx < 0 && /^\d+$/.test(n)) idx = Number(n) - 1;
  const choiceText = idx >= 0 && idx < parsed.choices.length ? parsed.choices[idx] : "";
  item.type = "parts";
  item.parts = [
    {
      kind: "mc",
      label: "틀린 보기",
      choices: parsed.choices,
      accept: uniq([n, ...spec.nums, choiceText].filter(Boolean)),
    },
    { kind: "fill", label: "고친 말", accept: spec.fixes, placeholder: "고친 말만" },
  ];
  if (!parsed.inline) item.promptEn = parsed.preamble || item.promptEn;
  setHow(item, "words", TAG.parts, "틀린 보기를 누르고, 그 부분을 바르게 고친 말만 쓰세요. 화살표나 X는 쓰지 마세요.");
  delete item.blankPartLabels;
  delete item.unordered;
  delete item.answer;
  item.blanks = 2;
}

function applyPair(item, pairs) {
  item.type = "fill";
  item.blanks = 2;
  item.blankPartLabels = ["틀린 말", "고친 말"];
  item.accept = pairs;
  delete item.unordered;
  delete item.answer;
  setHow(item, "words", TAG.words, RULE.pair);
}

function tightenFrame(item) {
  const prompt = String(item.promptEn || "");
  const m = prompt.match(/([\s\S]*?)_{3,}([\s\S]*)/);
  if (!m) return false;
  let before = m[1].replace(/<[^>]+>/g, " ").replace(/→/g, " ").trim();
  let after = m[2].replace(/<[^>]+>/g, " ").trim();
  before = before.split("\n").pop().trim();
  after = after.split("\n")[0].trim().replace(/[.?!]+$/, "");
  const plain = (item.accept || []).map(String).filter((a) => !a.includes("|"));
  if (plain.length < 2) return false;
  const isFull = (s) => {
    const t = s.trim();
    const shorter = plain.filter((p) => p.trim().length < t.length);
    if (!shorter.length) return false;
    if (/[.?!]$/.test(t) && shorter.some((p) => t.toLowerCase().includes(p.trim().toLowerCase()))) return true;
    if (before.length > 6 && t.toLowerCase().includes(before.toLowerCase()) && shorter.some((p) => !p.toLowerCase().includes(before.toLowerCase()))) {
      return true;
    }
    if (after.length > 6 && t.toLowerCase().includes(after.toLowerCase()) && shorter.some((p) => !p.toLowerCase().includes(after.toLowerCase()))) {
      return true;
    }
    return false;
  };
  const keep = plain.filter((a) => !isFull(a));
  if (!keep.length || keep.length === plain.length) return false;
  item.accept = uniq(keep);
  item.blanks = 1;
  delete item.blankPartLabels;
  delete item.unordered;
  setHow(item, "words", TAG.words, RULE.blank);
  return true;
}

function looksLikeSentence(item) {
  const blob = [item.sectionInstructionKo, item.answerMode].join(" ");
  if (item.answerMode === "sentence") return true;
  if (/문장 전체|다시 쓰|배열하세요|수동태/.test(blob)) return true;
  const plain = (item.accept || []).map(String).filter((a) => !a.includes("|"));
  return plain.length > 0 && plain.every((a) => a.trim().split(/\s+/).length >= 5);
}

function applySentenceOrFix(item) {
  if (looksLikeSentence(item)) {
    if (item.answerMode !== "sentence" && (item.blanks || 1) > 1 && item.blankPartLabels && item.blankPartLabels.length > 1) {
      setHow(item, item.answerMode || "words", item.answerModeTag || TAG.words, RULE.twoSentences);
      return;
    }
    item.blanks = item.blanks || 1;
    setHow(item, item.answerMode === "sentence" ? "sentence" : "words", item.answerMode === "sentence" ? TAG.sentence : TAG.words, RULE.sentence);
    return;
  }
  item.blanks = 1;
  delete item.blankPartLabels;
  delete item.unordered;
  setHow(item, "words", TAG.words, RULE.fixOnly);
}

function convertOxSection(items) {
  const anyRewrite = items.some((it) => rewriteForms(it.accept).length);
  for (const item of items) {
    const key = judgmentOf(item);
    if (!key) throw new Error("OX item without O/X key " + item.id);
    const rew = rewriteForms(item.accept);
    if (anyRewrite) {
      item.type = "ox";
      item.choices = ["O", "X"];
      item.accept = [key];
      if (key === "X" && rew.length) item.rewriteAccept = rew;
      else delete item.rewriteAccept;
      stripFillMeta(item);
      setHow(item, "ox", TAG.ox, RULE.ox);
    } else {
      item.type = "mc";
      item.choices = ["O", "X"];
      item.accept = [key];
      delete item.select;
      delete item.rewriteAccept;
      stripFillMeta(item);
      setHow(item, "choice", TAG.oxOnly, RULE.oxOnly);
    }
  }
}

function convertAmbiguous(item, log) {
  if (item.type === "mc" && item.select !== "multi" && !multiNumberRows(item)) {
    log.skipped.push(item.label + " already mc");
    return false;
  }
  const multi = multiNumberRows(item);
  if (multi) {
    const parsed = parseChoices(item.promptEn || "");
    if (parsed && parsed.choices.length >= multi[0].length) {
      const max = Math.max(
        ...multi.flat().map((tok) => {
          if (CIRC.includes(tok)) return CIRC.indexOf(tok) + 1;
          return Number(tok);
        })
      );
      if (max <= parsed.choices.length) {
        applyMulti(item, parsed);
        log.multi++;
        return true;
      }
    }
    item.blanks = multi[0].length;
    item.blankPartLabels = Array.from({ length: item.blanks }, () => "보기 번호");
    item.unordered = true;
    item.type = "fill";
    setHow(item, "words", "Words only · 번호만", RULE.numbers);
    log.numbersMissing.push((item.label || item.id) + " choices=" + (parsed ? parsed.choices.length : 0));
    return true;
  }
  const be = beVerb(item);
  if (be) {
    applyBe(item, be);
    log.be++;
    return true;
  }
  const groups = symbolGroups(item);
  if (groups) {
    const syms = symbolsIn(item.promptEn || "");
    if (syms.length >= 2) {
      applySymbolParts(item, groups, syms);
      log.symbolMc++;
      return true;
    }
    item.type = "fill";
    item.blanks = groups.length * 2;
    item.blankPartLabels = [];
    groups.forEach((_, i) => {
      const prefix = groups.length > 1 ? "(" + (i + 1) + ") " : "";
      item.blankPartLabels.push(prefix + "기호", prefix + "고친 말");
    });
    delete item.unordered;
    setHow(item, "words", TAG.words, RULE.symbolType);
    log.symbolType++;
    return true;
  }
  const nf = numberFix(item);
  if (nf) {
    const parsed = parseChoices(item.promptEn || "");
    if (parsed) {
      applyNumberParts(item, nf, parsed);
      log.numberFix++;
      return true;
    }
    item.type = "fill";
    item.blanks = 2;
    item.blankPartLabels = ["번호", "고친 말"];
    delete item.unordered;
    setHow(item, "words", TAG.words, RULE.numberFix);
    log.numberFix++;
    return true;
  }
  if (tightenFrame(item)) {
    log.blank++;
    return true;
  }
  const pairs = wordPairs(item);
  if (pairs) {
    applyPair(item, pairs);
    log.pair++;
    return true;
  }
  applySentenceOrFix(item);
  log.clarify++;
  return true;
}

function shortIntro(tag) {
  if (!tag) return "연습";
  const right = tag.includes("·") ? tag.split("·").slice(1).join("·").trim() : tag;
  if (right === "빈칸 말만") return "빈칸 말만 쓰기";
  if (right === "고르기") return "고르기";
  if (right === "O/X") return "O/X 고르기";
  if (right === "맞으면 O, 틀리면 고친 말") return "O/X 고르고 고치기";
  if (right === "여러 개 고르기") return "여러 개 고르기";
  if (right === "고르고 쓰기") return "고르고 쓰기";
  if (right === "문장 전체") return "문장 전체 쓰기";
  if (right === "번호만") return "번호만 쓰기";
  if (right === "짝 맞추기") return "짝 맞추기";
  return right;
}

function syncPractice(practice) {
  for (const sec of practice.sections || []) {
    const its = (practice.items || []).filter((i) => i.section === sec.id && !i.displayOnly);
    if (!its.length) continue;
    const modes = new Set(its.map((i) => i.answerMode));
    const tags = new Set(its.map((i) => i.answerModeTag));
    if (modes.size === 1) sec.answerMode = its[0].answerMode;
    if (tags.size === 1) sec.answerModeTag = its[0].answerModeTag;
    const hints = its.map((i) => i.hintKo || "");
    if (hints.every((h) => h && h === hints[0])) {
      const direction = sec.directionKo || "";
      const instr = [direction, hints[0]].filter(Boolean).join(" ");
      sec.ruleKo = hints[0];
      sec.instructionKo = instr;
      for (const it of practice.items) {
        if (it.section === sec.id) it.sectionInstructionKo = instr;
      }
    }
  }
  if (practice.sections && practice.sections.length) {
    practice.introKo =
      "이 연습은 " +
      practice.sections
        .map((s) => (s.title || s.id) + " " + s.itemCount + "문항(" + shortIntro(s.answerModeTag) + ")")
        .join(", ") +
      "으로 되어 있어요.";
  }
  practice.sectionsVersion = (practice.sectionsVersion || 1) + 1;
}

function sectionMatchesOx(practice, sectionId) {
  const sec = (practice.sections || []).find((s) => s.id === sectionId);
  const blob = [sec && sec.directionKo, sec && sec.ruleKo, sec && sec.instructionKo].join(" ");
  if (OX_RE.test(blob)) return true;
  return (practice.items || []).some((it) => it.section === sectionId && OX_RE.test(it.sectionInstructionKo || ""));
}

function gradeCheck(pack) {
  const win = {};
  const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp, Promise });
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/normalize.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/engine.js"), "utf8"), ctx);
  const { createFixtures } = require("./lib/answer-fixture");
  const { respFor, wrongFor } = createFixtures(win.MRJ_ENGINE);
  const problems = [];
  for (const it of pack.data.items) {
    if (it.displayOnly) continue;
    if (!["ox", "parts"].includes(it.type) && !(it.type === "mc" && it.select === "multi")) continue;
    for (const acc of it.accept) {
      const right = respFor(it, acc);
      if (!right || !win.MRJ_ENGINE.gradeItem(it, right)) {
        problems.push(pack.data.practiceId + " " + it.label + " accept fail " + JSON.stringify(acc));
      }
    }
    if (win.MRJ_ENGINE.gradeItem(it, wrongFor(it))) {
      problems.push(pack.data.practiceId + " " + it.label + " wrong should fail");
    }
  }
  return problems;
}

function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT, "utf8"));
  const packs = loadPacks();
  const dirty = new Set();
  let oxItems = 0;
  let oxSections = 0;
  const ambiguousLog = { multi: 0, be: 0, symbolMc: 0, symbolType: 0, numberFix: 0, pair: 0, blank: 0, clarify: 0, skipped: [], numbersMissing: [] };

  for (const pack of packs.values()) {
    const bySec = new Map();
    for (const it of pack.data.items || []) {
      if (it.displayOnly) continue;
      if (!bySec.has(it.section)) bySec.set(it.section, []);
      bySec.get(it.section).push(it);
    }
    for (const [secId, items] of bySec) {
      if (!sectionMatchesOx(pack.data, secId)) continue;
      if (items.every((it) => it.type === "ox" || (it.type === "mc" && (it.choices || []).join() === "O,X"))) continue;
      convertOxSection(items);
      oxItems += items.length;
      oxSections++;
      dirty.add(pack.data.practiceId);
    }
  }

  const targets = [...audit.letterAndFix, ...audit.numberedChoiceTyped];
  for (const hit of targets) {
    const pack = packs.get(hit.id);
    if (!pack) throw new Error("missing pack " + hit.id);
    const item = pack.data.items.find((it) => it.label === hit.label);
    if (!item) throw new Error("missing item " + hit.id + " " + hit.label);
    if (item.hintKo) continue;
    if (item.type === "ox" || (item.type === "mc" && item.choices && item.choices.join() === "O,X")) continue;
    const before = item.type;
    convertAmbiguous(item, ambiguousLog);
    if (item.type !== before || item.hintKo) dirty.add(hit.id);
  }

  const gradeProblems = [];
  for (const id of dirty) {
    const pack = packs.get(id);
    syncPractice(pack.data);
    fs.writeFileSync(pack.file, JSON.stringify(pack.data, null, 2) + "\n");
    gradeProblems.push(...gradeCheck(pack));
  }

  console.log(JSON.stringify({ oxSections, oxItems, ambiguousLog, files: dirty.size, gradeProblems: gradeProblems.slice(0, 30), gradeFail: gradeProblems.length }, null, 2));
  if (gradeProblems.length) process.exit(1);
}

main();
