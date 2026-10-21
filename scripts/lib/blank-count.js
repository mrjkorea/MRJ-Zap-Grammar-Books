/* Shared blank-vs-box rule (see README "Blank = box rule").
   Box count mirrors assets/js/app.js renderQuestionCard: fill/sentence items get item.blanks || 1 inputs;
   displayOnly examples get none. Visible blanks = runs of 2+ underscores in what appendPromptLines shows
   (promptKo, promptEn, noteKo). */
const fs = require("fs");
const path = require("path");

const BOOKS = ["green1", "green2", "green3", "green4", "blue1", "blue2", "blue3", "blue4", "red1", "red2"];
const BOOK_NAMES = { green1: "GreenZap 1", green2: "GreenZap 2", green3: "GreenZap 3", green4: "GreenZap 4", blue1: "BlueZap 1", blue2: "BlueZap 2", blue3: "BlueZap 3", blue4: "BlueZap 4", red1: "RedZap 1", red2: "RedZap 2" };
const BLANK_RE = /_{2,}/g;

function practiceFiles(repo) {
  const out = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".json")) out.push(p);
    }
  };
  BOOKS.forEach((b) => walk(path.join(repo, "data", b)));
  return out.sort();
}

function shownText(it) {
  return [it.promptKo, it.promptEn, it.noteKo].filter(Boolean).join("\n");
}
function countVisible(text) {
  return (String(text).match(BLANK_RE) || []).length;
}
function sectionOf(it, practice) {
  return ((practice && practice.sections) || []).find((s) => s.id === it.section) || {};
}
function saysOneWordPerBlank(it, practice) {
  const s = sectionOf(it, practice);
  const t = [it.sectionInstructionKo, s.instructionKo, s.ruleKo].filter(Boolean).join(" ");
  return /한 단어/.test(t);
}

/* returns null when the item has no typed boxes; otherwise
   { visible, boxes, ok, problems:[...] } */
function checkItem(it, practice) {
  if (!it || it.displayOnly || it.example) return null;
  if (it.type !== "fill" && it.type !== "sentence") return null;
  const boxes = it.blanks || 1;
  let visible = countVisible(shownText(it));
  if (it.sharedAnswer && visible > 1) visible = 1; // one word fills every blank (book: 공통으로 들어갈 말)
  const sentenceBox = (it.answerMode === "sentence" || it.type === "sentence") && boxes === 1;
  const problems = [];
  if (!sentenceBox) {
    if (visible === 0 && boxes > 1) problems.push("boxes-without-blank");
    else if (visible > 0 && visible !== boxes) problems.push("blank-box-mismatch");
  }
  if (saysOneWordPerBlank(it, practice) && !it.phraseBlanks && !sentenceBox && (it.answerMode === "words" || it.answerMode === "choice")) {
    const vs = (it.accept || []).map((a) => String(a).split("|"));
    const piped = vs.filter((p) => p.length === boxes);
    const pool = piped.length ? piped : vs;
    // flag only if NO accepted variant fits one word per box
    if (pool.length && pool.every((parts) => parts.some((p) => /\S\s+\S/.test(p.trim()) && !/^\S+ not$/i.test(p.trim()) && !/[가-힣]/.test(p)))) problems.push("multiword-in-one-word-box");
  }
  if (boxes > 1 && !(it.accept || []).some((a) => String(a).split("|").length === boxes)) problems.push("no-answer-fits-boxes");
  const ok = !problems.includes("no-answer-fits-boxes") && !problems.includes("blank-box-mismatch") && !problems.includes("multiword-in-one-word-box");
  return { visible, boxes, ok, problems, words: it.answerMode === "words" && visible === 0 && boxes === 1 };
}

module.exports = { BOOKS, BOOK_NAMES, practiceFiles, checkItem, countVisible, shownText };
