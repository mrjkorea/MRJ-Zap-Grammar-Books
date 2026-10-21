/* Blank = box check for all 10 books.
   Rule: in every typed item the student sees exactly as many blanks (____) as input boxes,
   and when a section says "한 칸에 한 단어" every box takes one word (unless the item is marked phraseBlanks
   and carries the phrase note). Sentence-mode items with one box (write the whole sentence) are exempt.

   node scripts/check-blank-count.js            # data check, same box rule as app.js (fails on any mismatch)
   node scripts/check-blank-count.js --live URL # headless render of every practice at URL (needs playwright)
   node scripts/check-blank-count.js --local    # headless render via a local static server
   Warnings (not failures): "boxes-without-blank" = rewrite/find-the-word items whose boxes have no printed blank. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const BC = require("./lib/blank-count");
const REPO = path.join(__dirname, "..");
const args = process.argv.slice(2);

function where(file, practice, it) {
  const rel = path.relative(REPO, file);
  const book = rel.split(path.sep)[1];
  return `${BC.BOOK_NAMES[book] || book} · ${practice.unitId || rel.split(path.sep)[2]} · ${practice.title || path.basename(file)} (${rel}) · item ${it.label || it.id} [${it.id}]`;
}

function dataCheck() {
  const fails = [], warns = [];
  const perBook = {};
  let items = 0;
  for (const f of BC.practiceFiles(REPO)) {
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    const book = path.relative(REPO, f).split(path.sep)[1];
    perBook[book] = perBook[book] || { items: 0, fails: 0, warns: 0 };
    for (const it of d.items || []) {
      // examples must never get boxes; they also should not claim more answer words than blanks
      if (it.displayOnly || it.example) {
        const v = BC.countVisible(BC.shownText(it));
        if (it.exampleAnswer && v > 0 && it.answerMode !== "sentence") {
          const n = String(it.exampleAnswer).split("/").length;
          if (n > 1 && n !== v) { fails.push(`${where(f, d, it)}: example shows ${v} blank(s) but example answer has ${n} parts`); perBook[book].fails++; }
        }
        continue;
      }
      const r = BC.checkItem(it, d);
      if (!r) continue;
      items++; perBook[book].items++;
      for (const p of r.problems) {
        const msg = `${where(f, d, it)}: ${p} (blanks shown ${r.visible}, boxes ${r.boxes})`;
        if (p === "boxes-without-blank") { warns.push(msg); perBook[book].warns++; }
        else { fails.push(msg); perBook[book].fails++; }
      }
    }
  }
  console.log(`check-blank-count (data): ${items} typed items`);
  for (const [b, s] of Object.entries(perBook)) console.log(`  ${BC.BOOK_NAMES[b]}: ${s.items} items, ${s.fails} mismatches, ${s.warns} warnings`);
  if (args.includes("--warn")) warns.forEach((w) => console.log("WARN", w));
  else if (warns.length) console.log(`  (${warns.length} warnings: boxes without a printed blank; list with --warn)`);
  fails.forEach((m) => console.log("FAIL", m));
  return fails.length;
}

async function liveCheck(base, server) {
  let chromium;
  try { ({ chromium } = require("playwright")); } catch (e) { console.log("playwright not installed (set NODE_PATH)"); return 1; }
  const win = {};
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), vm.createContext({ window: win }));
  const cat = win.MRJ_CATALOG;
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.route(/mrj-scores|script\.google|supabase/, (r) => r.fulfill({ status: 200, body: "{}" }));
  const page = await ctx.newPage();
  await page.goto(base.replace(/\/?$/, "/") + "?bc=" + Date.now(), { waitUntil: "load" });
  await page.waitForFunction(() => window.MRJ_CATALOG && window.MRJ_ENGINE, null, { timeout: 60000 });
  const fails = [];
  let practices = 0, cards = 0;
  const bookIds = Object.keys(cat.units);
  for (const bookId of bookIds) {
    for (const unit of cat.units[bookId].filter((u) => u.enabled)) {
      for (const ex of cat.exercises[cat.unitKey(bookId, unit.id)] || []) {
        const href = `#/p/${bookId}/${unit.id}/${ex.slug}`;
        await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} location.hash = "#/"; });
        await page.evaluate((h) => { location.hash = h; }, href);
        try {
          await page.waitForFunction(() => document.querySelector("form .q-card") && !document.body.innerText.includes("Loading…"), null, { timeout: 30000 });
        } catch (e) { fails.push(`${href}: did not render`); continue; }
        practices++;
        const res = await page.evaluate(() => {
          const out = [];
          document.querySelectorAll("form .q-card").forEach((c) => {
            const text = Array.from(c.querySelectorAll(".q-ko,.q-en,.q-note")).map((e) => e.textContent).join("\n");
            const blanks = (text.match(/_{2,}/g) || []).length;
            const boxes = c.querySelectorAll('input[type="text"]').length;
            const radios = c.querySelectorAll('input[type="radio"]').length;
            out.push({ label: (c.querySelector(".q-num") || {}).textContent || "?", blanks, boxes, radios, example: c.classList.contains("example-card"), match: !!c.querySelector(".match-hint"), shared: /공통으로 들어갈 한 단어를 한 번만 쓰세요/.test(text) });
          });
          return out;
        });
        const raw = await page.evaluate(async (p) => (await fetch(p)).json(), "./" + ex.data);
        const graded = (raw.items || []).filter((i) => !i.displayOnly && !i.example);
        let gi = 0;
        for (const c of res) {
          cards++;
          if (c.example) { if (c.boxes || c.radios) fails.push(`${href} ${c.label}: example card shows inputs`); continue; }
          const it = graded[gi++] || {};
          if (c.match || c.radios || !c.boxes) continue;
          const sentenceBox = (it.answerMode === "sentence" || it.type === "sentence") && c.boxes === 1;
          const vis = c.shared && c.blanks > 1 ? 1 : c.blanks;
          if (!sentenceBox && vis > 0 && vis !== c.boxes) fails.push(`${href} ${c.label}: ${c.blanks} blank(s) shown, ${c.boxes} box(es)`);
        }
      }
    }
  }
  await browser.close();
  if (server) server.close();
  console.log(`check-blank-count (render ${base}): ${practices} practices, ${cards} cards, ${fails.length} mismatches`);
  fails.forEach((m) => console.log("FAIL", m));
  return fails.length;
}

function startLocal() {
  const http = require("http");
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      const fp = path.join(REPO, url === "/" ? "index.html" : url.replace(/^\//, ""));
      if (!fp.startsWith(REPO) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end(); }
      const t = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(fp)] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": t });
      fs.createReadStream(fp).pipe(res);
    });
    srv.listen(8797, "127.0.0.1", () => resolve(srv));
  });
}

(async () => {
  let bad;
  const li = args.indexOf("--live");
  if (li >= 0) bad = await liveCheck(args[li + 1] || "https://mrjkorea.github.io/MRJ-Zap-Grammar-Books/");
  else if (args.includes("--local")) { const s = await startLocal(); bad = await liveCheck("http://127.0.0.1:8797/", s); }
  else bad = dataCheck();
  process.exit(bad ? 1 : 0);
})();
