/* E2E one BlueZap book: fresh browser process, context refresh every ~20 practices.
 * Usage: node scripts/e2e-bz-book.js <1-4>
 * Appends to scripts/e2e-bz-results.json */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const REPO = path.join(__dirname, "..");
const BOOK_N = Number(process.argv[2]);
const CONTEXT_EVERY = Number(process.env.E2E_CTX_EVERY) || 20;
const RESULTS_PATH = path.join(REPO, "scripts/e2e-bz-results.json");

if (![1, 2, 3, 4].includes(BOOK_N)) {
  console.error("Usage: node scripts/e2e-bz-book.js <1-4>");
  process.exit(1);
}

let BASE = "";
const bookId = `zap-blue-${BOOK_N}`;
const appName = `BlueZap ${BOOK_N}`;

function mime(p) {
  if (p.endsWith(".html")) return "text/html";
  if (p.endsWith(".js")) return "application/javascript";
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".json")) return "application/json";
  return "application/octet-stream";
}

function startServer() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let fp = path.join(REPO, url === "/" ? "index.html" : url.replace(/^\//, ""));
      if (!fp.startsWith(REPO)) {
        res.writeHead(403);
        return res.end();
      }
      if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.writeHead(404);
        return res.end("not found");
      }
      res.writeHead(200, { "Content-Type": mime(fp) });
      fs.createReadStream(fp).pipe(res);
    });
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      BASE = `http://127.0.0.1:${port}`;
      resolve(srv);
    });
  });
}

function loadCatalog() {
  const win = {};
  const vm = require("vm");
  const ctx = vm.createContext({ window: win });
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), ctx);
  return win.MRJ_CATALOG;
}

function initScript() {
  return () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.MRJ_AUTH = {
      student: () => "e2e@test.local",
      noteScore: () => Promise.resolve(),
      loadPack: () => Promise.resolve({ ok: true, json: null }),
      savePack: () => Promise.resolve({ ok: true }),
      packReady: () => true,
    };
    window.__e2ePosts = [];
    window.MRJ_SCORES = {
      post: (p) => {
        window.__e2ePosts.push(p);
        return Promise.resolve({ status: "stub" });
      },
    };
    const fire = () => {
      document.dispatchEvent(new Event("mrj-auth-ready"));
      const gate = document.getElementById("mrj-auth-gate");
      if (gate) gate.remove();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(fire, 50));
    else setTimeout(fire, 50);
  };
}

let e2eNav = 0;

async function runPractice(context, unitId, ex, mode) {
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  const href = `#/p/${bookId}/${unitId}/${ex.slug}`;
  e2eNav += 1;
  await page.goto(`${BASE}/?e2e=${e2eNav}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.MRJ_ENGINE && window.MRJ_CATALOG, { timeout: 120000 });
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (e) {}
  });
  await page.evaluate((h) => {
    location.hash = h;
  }, href);
  async function waitLoaded() {
    await page.waitForFunction(() => !document.body.innerText.includes("Loading…"), { timeout: 120000 });
  }
  try {
    await waitLoaded();
  } catch (e) {
    await page.evaluate((h) => {
      location.hash = h;
    }, href);
    await waitLoaded();
  }
  await page.waitForSelector("form", { state: "attached", timeout: 120000 });
  try {
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".section-banner-instr").length > 0 ||
        /빈칸|고르기|문장|다음|이 연습은/.test(document.body.innerText),
      { timeout: 45000 }
    );
  } catch (e) {
    if (!/form/.test(await page.content())) throw e;
  }
  await page.waitForSelector(".timer-bar", { state: "attached", timeout: 30000 });

  const raw = await page.evaluate(async (dataPath) => {
    const r = await fetch(dataPath);
    return r.json();
  }, "/" + ex.data);

  const graded = raw.items.filter((i) => !i.displayOnly);

  function pickAccept(it) {
    const need = it.blanks || 1;
    for (const acc of it.accept) {
      const n = String(acc).includes("|") ? String(acc).split("|").length : 1;
      if (n === need) return acc;
    }
    return it.accept[0];
  }

  const answers = graded.map((it) => {
    const acc = pickAccept(it);
    if (mode === "wrong") {
      if (it.type === "mc") {
        return { id: it.id, type: "mc", choiceIndex: 0 };
      }
      const bn = it.blanks || 1;
      if (bn > 1) {
        const parts = Array.from({ length: bn }, () => "WRONG_ANSWER_XYZ");
        return { id: it.id, type: "multi", parts, blanks: bn };
      }
      return { id: it.id, type: "single", value: "WRONG_ANSWER_XYZ" };
    }
    if (it.type === "mc") {
      const circled = "①②③④⑤";
      let idx = -1;
      const a = acc;
      if (/^\d+$/.test(String(a))) idx = Number(a) - 1;
      else {
        const ci = circled.indexOf(String(a).trim());
        if (ci >= 0) idx = ci;
        else idx = it.choices.indexOf(a);
      }
      return { id: it.id, type: "mc", choiceIndex: idx >= 0 ? idx : 0 };
    }
    if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
      const parts = String(acc).split("|");
      return { id: it.id, type: "multi", parts, blanks: it.blanks || parts.length };
    }
    return { id: it.id, type: "single", value: acc };
  });

  // Fix wrong MC indices without page (engine in Node for wrong picks only)
  for (let i = 0; i < answers.length; i++) {
    if (mode !== "wrong") continue;
    const it = graded[i];
    const a = answers[i];
    if (a.type !== "mc") continue;
    const vm = require("vm");
    const win = {};
    const ctx = vm.createContext({ window: win, Date, Math, JSON, String, Array, Object, RegExp });
    for (const f of ["normalize.js", "engine.js"]) {
      vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js", f), "utf8"), ctx);
    }
    const E = win.MRJ_ENGINE;
    let wi = -1;
    for (let c = 0; c < it.choices.length; c++) {
      if (!E.gradeItem(it, { value: it.choices[c] })) {
        wi = c;
        break;
      }
    }
    a.choiceIndex = wi >= 0 ? wi : 0;
  }

  await page.evaluate(() => {
    window.__e2ePosts = window.__e2ePosts || [];
    window.MRJ_SCORES = {
      post: (p) => {
        window.__e2ePosts.push(p);
        return Promise.resolve({ status: "stub" });
      },
    };
  });

  await page.evaluate((ans) => {
    for (const a of ans) {
      if (a.type === "mc") {
        const inputs = document.querySelectorAll(`input[name="${a.id}"]`);
        const el = inputs[a.choiceIndex];
        if (el) {
          el.checked = true;
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else if (a.type === "multi") {
        for (let b = 0; b < a.blanks; b++) {
          const el = document.querySelector(`[name="${a.id}_${b}"]`);
          if (el) {
            el.value = a.parts[b] || "";
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
      } else {
        const el = document.querySelector(`[name="${a.id}"]`);
        if (el) {
          el.value = a.value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }
  }, answers);

  await page.evaluate(() => {
    const form = document.querySelector("form");
    if (form) form.requestSubmit();
  });
  await page.waitForFunction(() => document.querySelector(".result-panel h2"), { timeout: 120000 });
  const scoreText = await page.locator(".result-panel h2").textContent();
  if (mode === "all-correct" && !/100%/.test(scoreText)) {
    throw new Error(`${ex.practiceId}: expected 100%, got ${scoreText}`);
  }
  if (mode === "wrong") {
    const review = await page.locator(".wrong-review-wrap").count();
    if (review < 1) throw new Error(`${ex.practiceId}: expected wrong-answer review`);
    const html = await page.locator(".wrong-review-wrap").innerText();
    if (/correct answer|정답/i.test(html) && !/나오지 않습니다/.test(html)) {
      throw new Error(`${ex.practiceId}: review may leak correct answer`);
    }
  }
  const posts = await page.evaluate(() => window.__e2ePosts || []);
  await page.close();
  return { scoreText, posts };
}

function loadResults() {
  if (!fs.existsSync(RESULTS_PATH)) return { practices: {}, books: {} };
  return JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));
}

function saveResults(data) {
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(data, null, 2) + "\n");
}

async function withRetry(label, fn) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
  throw new Error(`${label}: ${lastErr.message}`);
}

(async () => {
  const catalog = loadCatalog();
  const units = catalog.units[bookId].filter((u) => u.enabled && u.id !== "tests");
  const srv = await startServer();
  const browser = await chromium.launch({ headless: true });
  let context = await browser.newContext();
  await context.route(/mrj-signin/, (route) => route.abort());
  await context.addInitScript(initScript());

  let practicesSinceCtx = 0;
  let passed = 0;
  let wrongUnits = 0;
  let lastPosts = [];
  const results = loadResults();

  async function refreshContext() {
    await context.close();
    context = await browser.newContext();
    await context.route(/mrj-signin/, (route) => route.abort());
    await context.addInitScript(initScript());
    practicesSinceCtx = 0;
  }

  async function tickContext() {
    if (practicesSinceCtx >= CONTEXT_EVERY) await refreshContext();
  }

  for (const unit of units) {
    const key = catalog.unitKey(bookId, unit.id);
    const exs = catalog.exercises[key] || [];
    const wrongSlug =
      exs.find((e) => /^review0?\d/.test(e.slug))?.slug ||
      exs.find((e) => e.slug.startsWith("review"))?.slug ||
      exs[0]?.slug;

    for (const ex of exs) {
      await tickContext();
      try {
        const r1 = await withRetry(ex.practiceId, () => runPractice(context, unit.id, ex, "all-correct"));
        lastPosts = r1.posts;
        results.practices[ex.practiceId] = { e2e: "OK", at: new Date().toISOString() };
        passed++;
        practicesSinceCtx++;
      } catch (e) {
        results.practices[ex.practiceId] = { e2e: "FAIL", error: String(e.message), at: new Date().toISOString() };
        saveResults(results);
        throw e;
      }

      if (ex.slug === wrongSlug) {
        await tickContext();
        try {
          await withRetry(`${ex.practiceId} wrong-review`, () => runPractice(context, unit.id, ex, "wrong"));
          results.practices[ex.practiceId].wrongReview = "OK";
          wrongUnits++;
          practicesSinceCtx++;
        } catch (e) {
          results.practices[ex.practiceId].wrongReview = "FAIL";
          results.practices[ex.practiceId].wrongReviewError = String(e.message);
          saveResults(results);
          throw e;
        }
      }
    }
  }

  const last = lastPosts[lastPosts.length - 1];
  if (!last || last.program !== "greenzap" || last.appName !== appName || !last.itemId) {
    throw new Error(`metrics payload bad: ${JSON.stringify(last)}`);
  }

  results.books[String(BOOK_N)] = {
    passed,
    total: passed,
    wrongReviewUnits: wrongUnits,
    appName,
    at: new Date().toISOString(),
  };
  saveResults(results);

  await browser.close();
  srv.close();
  console.log(`E2E BlueZap ${BOOK_N} OK — ${passed} practices at 100%, ${wrongUnits} wrong-review units, metrics OK`);
})().catch((e) => {
  console.error(`E2E BlueZap ${BOOK_N} FAIL`, e.message || e);
  process.exit(1);
});
