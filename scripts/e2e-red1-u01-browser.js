/* RedZap 1 Unit 01 — mobile viewport E2E with screenshots. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { setupE2eContext } = require("./e2e-scores-mock");

const REPO = path.join(__dirname, "..");
const PORT = 8771;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOT_DIR = path.join(REPO, "docs/screenshots/red1-u01");

function mime(p) {
  if (p.endsWith(".html")) return "text/html";
  if (p.endsWith(".js")) return "application/javascript";
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".json")) return "application/json";
  if (p.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

function startServer() {
  return new Promise((resolve) => {
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
    srv.listen(PORT, "127.0.0.1", () => resolve(srv));
  });
}

function loadCatalog() {
  const win = {};
  const vm = require("vm");
  const ctx = vm.createContext({ window: win });
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), ctx);
  return win.MRJ_CATALOG;
}

function loadPractice(rel) {
  return JSON.parse(fs.readFileSync(path.join(REPO, rel), "utf8"));
}

function respParts(it) {
  if (it.type === "match") {
    const links = {};
    for (const p of it.pairs || []) links[p.left] = p.right;
    return { kind: "match", links };
  }
  if (it.type === "mc") {
    const a = it.accept[0];
    const i = /^\d$/.test(a) ? Number(a) - 1 : it.choices.indexOf(a);
    return { kind: "mc", value: it.choices[i] };
  }
  if ((it.blanks || 1) > 1) {
    const parts = it.accept[0].split("|");
    return { kind: "multi", parts };
  }
  return { kind: "single", value: it.accept[0] };
}

async function answerPractice(page, data) {
  const graded = data.items.filter((it) => !it.displayOnly);
  for (const it of graded) {
    const r = respParts(it);
    if (r.kind === "match") {
      for (const p of it.pairs || []) {
        await page.locator(`.match-wrap[data-match-id="${it.id}"] .match-btn-left[data-value="${p.left}"]`).click();
        await page.locator(`.match-wrap[data-match-id="${it.id}"] .match-btn-right[data-value="${p.right}"]`).click();
      }
    } else if (r.kind === "mc") {
      await page.locator(`input[name="${it.id}"][value="${r.value}"]`).click();
    } else if (r.kind === "multi") {
      for (let b = 0; b < r.parts.length; b++) {
        await page.locator(`[name="${it.id}_${b}"]`).fill(r.parts[b]);
      }
    } else {
      await page.locator(`[name="${it.id}"]`).fill(r.value);
    }
  }
}

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const catalog = loadCatalog();
  const exs = catalog.exercises["zap-red-1:unit-01"] || [];
  const srv = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await context.route(/mrj-signin/, (route) => route.abort());
  await setupE2eContext(context);
  let failed = 0;
  for (const ex of exs) {
    const page = await context.newPage();
    const data = loadPractice(ex.data);
    const href = `#/p/zap-red-1/unit-01/${ex.slug}`;
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.waitForFunction(() => window.MRJ_ENGINE && window.MRJ_CATALOG);
    await page.evaluate((h) => {
      location.hash = h;
    }, href);
    await page.waitForFunction(() => !document.body.innerText.includes("Loading…"));
    if (ex.slug === "walk") {
      await page.screenshot({ path: path.join(SHOT_DIR, "walk-match-ui.png"), fullPage: true });
    }
    await answerPractice(page, data);
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector(".result-panel");
    const text = await page.locator(".result-panel").innerText();
    if (!text.includes("Pass (80%+)")) {
      failed++;
      console.log("FAIL", ex.slug, text.split("\n")[0]);
    } else {
      console.log("OK", ex.slug, text.split("\n")[0]);
    }
    await page.screenshot({ path: path.join(SHOT_DIR, `${ex.slug}-result.png`), fullPage: true });
    await page.close();
  }
  await browser.close();
  srv.close();
  if (failed) process.exit(1);
  console.log("e2e-red1-u01: all practices passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
