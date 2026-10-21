/* One-off fixer (2026-10-21): make visible blanks == input boxes for words/choice fill items.
   Aligns each accept variant to the prompt's blank line, drops answer parts that are already
   printed in the prompt, and expands one printed blank into N blank segments when the answer
   for that spot is N words (one word per box, as the section rule says). Dry run unless --write. */
const fs = require("fs");
const path = require("path");
const BC = require("./lib/blank-count");
const REPO = path.join(__dirname, "..");
const WRITE = process.argv.includes("--write");
const BL = "______";
const PHRASE_KEEP = new Set([]);
// keep printed blanks when the multi-word part is a noun phrase / "the other" etc. (word count would hint the answer)
const KEEP_PROMPT = (it) => /간접목적어|One\|the other|one\|the other|One\|another|ten seventeen|red and yellow/.test(JSON.stringify(it.accept) + (it.promptEn || ""));
const PHRASE_NOTE = "※ 이 문항은 한 칸에 두 단어 이상을 쓸 수 있어요.";

// a box may hold "is not" / "can not" (same answer as isn't / can't), so keep "X not" together as one word
function words(s) {
  const w = String(s).trim().split(/\s+/).filter(Boolean);
  const out = [];
  for (const x of w) {
    if (/^not$/i.test(x) && out.length && !/ /.test(out[out.length - 1])) out[out.length - 1] += " " + x;
    else out.push(x);
  }
  return out;
}
function mergeNot(acc) { return String(acc).replace(/([A-Za-z']+)\|not(?=\||$)/gi, "$1 not"); }
function norm(w) { return String(w).toLowerCase().replace(/[.,!?;:"“”]/g, "").replace(/’/g, "'"); }

// tokens of the line: {b:true} blank, or {w:"word"}
function tokenize(line) {
  const out = [];
  line.replace(/_{2,}|[^\s_]+|_/g, (m) => { out.push(/^_{2,}$/.test(m) ? { b: true } : { w: m }); return m; });
  return out;
}
// merge contiguous blanks into slots
function slots(tokens) {
  const s = [];
  let depth = 0;
  for (const t of tokens) {
    // words inside ( hints ) / [labels] are never part of the answer
    if (!t.b) {
      const open = (t.w.match(/[(\[]/g) || []).length, close = (t.w.match(/[)\]]/g) || []).length;
      const inHint = depth > 0 || open > 0;
      depth += open - close;
      if (inHint) { s.push({ w: t.w, hint: true }); continue; }
    }
    if (t.b && s.length && s[s.length - 1].b) s[s.length - 1].n++;
    else s.push(t.b ? { b: true, n: 1 } : t);
  }
  return s;
}
// align answer words W to slot sequence S. returns {groups:[[words]...], leaks} best.
function align(S, W) {
  const memo = new Map();
  function go(i, j, started) {
    const key = i + "," + j + "," + started;
    if (memo.has(key)) return memo.get(key);
    let best = null;
    const consider = (r) => { if (r && (!best || r.score > best.score)) best = r; };
    if (i === S.length) { best = j === W.length ? { score: 0, groups: [] } : null; memo.set(key, best); return best; }
    const t = S[i];
    if (t.hint) { const r = go(i + 1, j, started); memo.set(key, r); return r; }
    if (t.b) {
      for (let k = 1; j + k <= W.length; k++) {
        const r = go(i + 1, j + k, true);
        if (r) consider({ score: r.score - Math.abs(k - t.n) * 0.01, groups: [W.slice(j, j + k)].concat(r.groups) });
      }
    } else {
      const nextIsBlank = i + 1 < S.length && S[i + 1].b;
      if (j < W.length && norm(W[j]) === norm(t.w) && (started || nextIsBlank || (i + 1 < S.length && !S[i + 1].b && !S[i + 1].hint && j + 1 < W.length && norm(W[j + 1]) === norm(S[i + 1].w)))) {
        const r = go(i + 1, j + 1, true);
        if (r) consider({ score: r.score + 1, groups: r.groups, leak: true });
      }
      // printed words around or between blanks are fine; only skip-matching costs nothing
      const r = go(i + 1, j, started);
      if (r) consider(r);
    }
    memo.set(key, best);
    return best;
  }
  return go(0, 0, false);
}

let changed = 0, manual = [];
const report = [];
for (const file of BC.practiceFiles(REPO)) {
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  let dirty = false;
  for (const it of d.items || []) {
    const r = BC.checkItem(it, d);
    if (!r || r.ok) continue;
    if (PHRASE_KEEP.has(path.relative(REPO, file) + "#" + it.id) || (r.visible === r.boxes && r.problems.includes("multiword-in-one-word-box") && (it.accept || []).every((a) => String(a).split("|").length === r.boxes) && KEEP_PROMPT(it))) {
      // book prints one blank per phrase and splitting would hint the answer: one box per blank, phrase allowed
      it.phraseBlanks = true;
      report.push({ file: path.relative(REPO, file), id: it.id, phraseNoteOnly: true });
      dirty = true; changed++;
      continue;
    }
    if (r.visible > r.boxes) { manual.push([file, it.id, r.visible, r.boxes]); continue; }
    if (r.visible === 0) {
      // rewrite-style item (no printed blank): the answer for a box may be a phrase
      it.phraseBlanks = true;
      report.push({ file: path.relative(REPO, file), id: it.id, phraseNoteOnly: true });
      dirty = true; changed++;
      continue;
    }
    const field = /_{2,}/.test(it.promptEn || "") ? "promptEn" : "promptKo";
    const lines = String(it[field]).split("\n");
    const li = lines.findIndex((l) => /_{2,}/.test(l));
    if (lines.filter((l) => /_{2,}/.test(l)).length !== 1) { manual.push([file, it.id, "multi-line"]); continue; }
    const S = slots(tokenize(lines[li]));
    const variants = (it.accept || []).filter((a) => String(a).includes("|") || r.boxes === 1);
    const res = variants.map((a) => align(S, mergeNot(a).split("|").flatMap(words)));
    if (res.some((x) => !x)) { manual.push([file, it.id, "no-align", lines[li], it.accept]); continue; }
    const sizes = res.map((x) => x.groups.map((g) => g.length).join(","));
    let newAccept, slotCounts;
    if (new Set(sizes).size === 1) {
      slotCounts = res[0].groups.map((g) => g.length);
      newAccept = res.map((x) => x.groups.flat().join("|"));
    } else if (r.visible === r.boxes) {
      // already one box per printed blank; variants differ in length (isn't / is not): keep, allow phrase
      it.phraseBlanks = true;
      report.push({ file: path.relative(REPO, file), id: it.id, phraseNoteOnly: true });
      dirty = true; changed++;
      continue;
    } else {
      // variants disagree on word count (e.g. isn't / is not): one box per printed slot, phrase allowed
      slotCounts = res[0].groups.map(() => 1);
      newAccept = res.map((x) => x.groups.map((g) => g.join(" ")).join("|"));
      it.phraseBlanks = true;
    }
    if (it.phraseBlanks || newAccept.every((a) => a.split("|").some((p) => /\S\s+\S/.test(p) && !/^\S+ not$/i.test(p.trim()) && !/[가-힣]/.test(p)))) {
      it.phraseBlanks = true;
    }
    let si = 0;
    const rebuilt = S.map((t) => (t.b ? Array(slotCounts[si++]).fill(BL).join(" ") : t.w)).join(" ")
      .replace(/ ([?.!,])(?=\s|$)/g, "$1");
    const before = { line: lines[li], blanks: it.blanks, accept: it.accept };
    lines[li] = rebuilt;
    it[field] = lines.join("\n");
    const total = slotCounts.reduce((a, b) => a + b, 0);
    it.blanks = total;
    // keep non-pipe variants (single box) only when 1 box
    it.accept = Array.from(new Set(newAccept));
    if (it.blankPartLabels && it.blankPartLabels.length !== total) delete it.blankPartLabels;
    report.push({ file: path.relative(REPO, file), id: it.id, before, after: { line: rebuilt, blanks: total, accept: it.accept, phrase: !!it.phraseBlanks } });
    dirty = true; changed++;
  }
  if (dirty && WRITE) fs.writeFileSync(file, JSON.stringify(d, null, 2) + "\n");
}
fs.writeFileSync("/tmp/bc/fix-report.json", JSON.stringify({ report, manual }, null, 1));
console.log("auto-fixed", changed, "manual", manual.length);
manual.forEach((m) => console.log("MANUAL", JSON.stringify(m)));
