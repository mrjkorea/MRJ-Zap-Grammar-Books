/* Key-answer audit: can the printed answer key itself be graded correct by the
   live app engine? If not, the item cannot be done on the computer.

   node scripts/audit-key-answers.js [out.json]
*/
global.window = global;
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
require(path.join(ROOT, 'assets/js/normalize.js'));
require(path.join(ROOT, 'assets/js/engine.js'));
const E = global.MRJ_ENGINE;
const MARK = "①②③④⑤⑥⑦⑧⑨⑩";

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.json')) out.push(p);
  }
  return out;
}

function idxFromToken(item, tok) {
  const raw = String(tok == null ? '' : tok).trim();
  if (!raw) return -1;
  const ch = item.choices || [];
  const ci = MARK.indexOf(raw);
  if (ci >= 0 && ci < ch.length) return ci;
  if (/^\d+$/.test(raw)) {
    const n = Number(raw) - 1;
    if (n >= 0 && n < ch.length) return n;
  }
  return ch.indexOf(raw);
}

function keyResponse(item) {
  const t = item.type;
  const acc = (item.accept || []).map(String);
  if (t === 'match') {
    const links = {};
    for (const p of item.pairs || []) links[p.left] = p.right;
    return { links };
  }
  if (t === 'ox') {
    const key = acc.find(a => /^[Oo○ㅇXx×✕]$/.test(a.trim()));
    const resp = { value: key || 'O' };
    if ((key || '').toUpperCase() === 'X' && item.rewriteAccept) resp.rewrite = item.rewriteAccept[0];
    return resp;
  }
  if (t === 'parts') {
    const parts = (item.parts || []).map(p => {
      if (p.kind === 'mc') return (p.choices || [])[idxFromToken(p, (p.accept || [])[0])] ?? (p.accept || [])[0];
      return (p.accept || [])[0];
    });
    return { parts };
  }
  if (t === 'mc') {
    if (item.select === 'multi') {
      const idxs = E.expectedChoiceIndexes(item);
      return { values: idxs.map(i => (item.choices || [])[i]) };
    }
    for (const a of acc) {
      const ix = idxFromToken(item, a);
      if (ix >= 0) return { value: (item.choices || [])[ix] };
    }
    // No accept entry names a choice: the UI can only submit a choice, so
    // submit the first one. It must not grade true unless the key is wrong.
    return { value: (item.choices || [''])[0] };
  }
  // fill / sentence
  const blanks = item.blanks || 1;
  if (blanks > 1) {
    // The UI always renders exactly `blanks` boxes. A student types the keyed
    // answer into them; if the key has fewer parts than boxes, the last box
    // takes the remaining words.
    const tup = acc.find(a => a.split('|').length === blanks);
    if (tup) return { parts: String(tup).split('|') };
    const words = String(acc[0] || '').split('|').join(' ').split(/\s+/).filter(Boolean);
    if (!words.length) return { parts: [] };
    // Every box is required, so a key with fewer words than boxes cannot be
    // typed in at all.
    if (words.length < blanks && !acc.some(a => a.split('|').join(' ').split(/\s+/).filter(Boolean).length >= blanks)) {
      return { parts: Array.from({ length: blanks }, () => '__SHORTKEY__') };
    }
    const boxes = [];
    for (let i = 0; i < blanks; i++) boxes.push('');
    const take = Math.max(1, Math.min(words.length, blanks));
    for (let i = 0; i < take - 1; i++) boxes[i] = words[i];
    boxes[take - 1] = words.slice(take - 1).join(' ');
    return { parts: boxes };
  }
  return { value: acc[0] };
}

function auditFile(file) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!doc || !doc.practiceId || !Array.isArray(doc.items)) return [];
  const rows = [];
  for (const item of doc.items) {
    if (item.displayOnly || item.example) continue;
    const resp = keyResponse(item);
    const ok = E.gradeItem(item, resp);
    if (!ok) rows.push({ file: path.relative(ROOT, file), practiceId: doc.practiceId, id: item.id, label: item.label, type: item.type, mode: item.answerMode, accept: item.accept, choices: item.choices, blanks: item.blanks, prompt: String(item.promptEn || item.promptKo || '').slice(0, 300), response: resp });
  }
  return rows;
}

const files = walk(path.join(ROOT, 'data'), []).sort();
let items = 0;
const fails = [];
for (const f of files) {
  const doc = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (doc && doc.practiceId && Array.isArray(doc.items)) items += doc.items.length;
  fails.push(...auditFile(f));
}
const byFile = {};
for (const f of fails) (byFile[f.file] = byFile[f.file] || []).push(f);
console.log(JSON.stringify({ practices: files.length, items, failCount: fails.length, files: Object.keys(byFile).length }, null, 0));
const out = process.argv[2] || path.join(ROOT, 'audit-key-answers.json');
fs.writeFileSync(out, JSON.stringify({ items, fails }, null, 1));
