#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.join(__dirname, "..");
const win = {};
vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), vm.createContext({ window: win }));
const cat = win.MRJ_CATALOG;

function countBook(bookId) {
  const rows = [];
  let practices = 0;
  let graded = 0;
  let matchPairs = 0;
  for (const u of cat.units[bookId] || []) {
    if (!u.enabled) continue;
    const key = `${bookId}:${u.id}`;
    const exs = cat.exercises[key] || [];
    let uGraded = 0;
    let uPairs = 0;
    for (const ex of exs) {
      practices++;
      const d = JSON.parse(fs.readFileSync(path.join(REPO, ex.data), "utf8"));
      for (const it of d.items || []) {
        if (it.displayOnly) continue;
        uGraded++;
        if (it.type === "match") uPairs += (it.pairs || []).length;
      }
    }
    graded += uGraded;
    matchPairs += uPairs;
    rows.push({ unit: u.id, practices: exs.length, graded: uGraded, matchPairs: uPairs });
  }
  return { rows, practices, graded, matchPairs };
}

const r1 = countBook("zap-red-1");
const r2 = countBook("zap-red-2");
console.log(JSON.stringify({ red1: r1, red2: r2 }, null, 2));
