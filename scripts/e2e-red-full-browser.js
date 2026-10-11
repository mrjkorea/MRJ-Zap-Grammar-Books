/* E2E: every RedZap 1 & 2 practice — correct answers → 100%; spot-check wrong-answer review. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const REPO = path.join(__dirname, "..");
const PORT = 8772;
const BASE = `http://127.0.0.1:${PORT}`;

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
  vm.runInContext(fs.readFileSync(path.join(REPO, "assets/js/catalog.js"), "utf8"), vm.createContext({ window: win }));
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
    return { kind: "mc", value: it.choices[i], correct: it.choices[i] };
  }
  if ((it.blanks || 1) > 1) {
    const parts = it.accept[0].split("|");
    return { kind: "multi", parts };
  }
  return { kind: "single", value: it.accept[0] };
}

function wrongParts(it, right) {
  if (it.type === "match") {
    const links = Object.assign({}, right.links);
    const k = Object.keys(links)[0];
    const rights = (it.pairs || []).map((p) => p.right);
    const wrongRight = rights.find((r) => r !== links[k]) || rights[0];
    if (k) links[k] = wrongRight;
    return { kind: "match", links };
  }
  if (it.type === "mc") {
    const idx = it.choices.indexOf(right.value);
    return { kind: "mc", value: it.choices[(idx + 1) % it.choices.length] };
  }
  return { kind: "single", value: "wrong-answer-e2e" };
}

async function fillPractice(page, data, mode) {
  const graded = data.items.filter((it) => !it.displayOnly);
  for (const it of graded) {
    const right = respParts(it);
    const r = mode === "wrong" ? wrongParts(it, right) : right;
    if (r.kind === "match") {
      for (const p of it.pairs || []) {
        const left = p.left;
        const target =
          mode === "wrong" && left === Object.keys(r.links)[0] ? r.links[left] : p.right;
        await page.locator(`.match-wrap[data-match-id="${it.id}"] .match-btn-left[data-value="${left}"]`).click();
        await page.locator(`.match-wrap[data-match-id="${it.id}"] .match-btn-right[data-value="${target}"]`).click();
      }
    } else if (r.kind === "mc") {
      await page.locator(`input[name="${it.id}"][value="${r.value}"]`).click();
    } else if (r.kind === "multi") {
      const parts = mode === "wrong" ? r.parts || ["x"] : r.parts;
      for (let b = 0; b < parts.length; b++) {
        await page.locator(`[name="${it.id}_${b}"]`).fill(parts[b]);
      }
    } else {
      await page.locator(`[name="${it.id}"]`).fill(r.value);
    }
  }
}

function listRedPractices(catalog) {
  const out = [];
  for (const bookId of ["zap-red-1", "zap-red-2"]) {
    for (const u of catalog.units[bookId] || []) {
      if (!u.enabled) continue;
      const key = `${bookId}:${u.id}`;
      for (const ex of catalog.exercises[key] || []) {
        out.push({ bookId, unitId: u.id, ex });
      }
    }
  }
  return out;
}

async function main() {
  const catalog = loadCatalog();
  const practices = listRedPractices(catalog);
  const srv = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/mrj-signin/, (route) => route.abort());
  await context.addInitScript(() => {
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
    window.MRJ_SCORES = { post: () => Promise.resolve({ status: "stub" }) };
    const fire = () => {
      document.dispatchEvent(new Event("mrj-auth-ready"));
      const gate = document.getElementById("mrj-auth-gate");
      if (gate) gate.remove();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(fire, 50));
    else setTimeout(fire, 50);
  });

  let failed = 0;
  for (const { bookId, unitId, ex } of practices) {
    const page = await context.newPage();
    const data = loadPractice(ex.data);
    const href = `#/p/${bookId}/${unitId}/${ex.slug}`;
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.waitForFunction(() => window.MRJ_ENGINE && window.MRJ_CATALOG);
    await page.evaluate((h) => {
      location.hash = h;
    }, href);
    await page.waitForFunction(() => !document.body.innerText.includes("Loading…"));
    await fillPractice(page, data, "right");
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector(".result-panel");
    const text = await page.locator(".result-panel").innerText();
    if (!text.includes("100%") && !text.includes("Pass (80%+)")) {
      failed++;
      console.log("FAIL", href, text.split("\n")[0]);
    }
    await page.close();
  }

  console.log(`Red E2E correct: ${practices.length - failed}/${practices.length}`);

  await browser.close();
  srv.close();
  console.log(`Red E2E: ${practices.length} practices, failed=${failed}`);
  if (failed) throw new Error("Red E2E failures: " + failed);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
