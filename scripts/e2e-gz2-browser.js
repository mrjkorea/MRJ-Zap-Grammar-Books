/* Headless browser E2E: all GreenZap 2 practices (78). Run: node scripts/e2e-gz2-browser.js */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const REPO = path.join(__dirname, "..");
const PORT = 8766;
const BASE = `http://127.0.0.1:${PORT}`;

function mime(p) {
  if (p.endsWith(".html")) return "text/html";
  if (p.endsWith(".js")) return "application/javascript";
  if (p.endsWith(".css")) return "text/css";
  if (p.endsWith(".json")) return "application/json";
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

function respParts(it, acc) {
  if (it.type === "mc") {
    const i = /^\d$/.test(acc) ? Number(acc) - 1 : it.choices.indexOf(acc);
    return { type: "mc", value: it.choices[i] };
  }
  const parts = String(acc).split("|");
  if ((it.blanks || 1) > 1 || parts.length > 1) {
    return { type: "multi", parts };
  }
  return { type: "single", value: acc };
}

let e2eNav = 0;
async function runPractice(context, bookId, unitId, ex, mode) {
  const page = await context.newPage();
  const href = `#/p/${bookId}/${unitId}/${ex.slug}`;
  e2eNav += 1;
  await page.goto(`${BASE}/?e2e=${e2eNav}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.MRJ_ENGINE && window.MRJ_CATALOG, { timeout: 20000 });
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (e) {}
  });
  await page.evaluate((h) => {
    location.hash = h;
  }, href);
  await page.waitForFunction(() => !document.body.innerText.includes("Loading…"), { timeout: 60000 });
  await page.waitForSelector("form", { state: "attached", timeout: 60000 });
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".section-banner-instr").length > 0 ||
      /빈칸|고르기|문장|다음|이 연습은/.test(document.body.innerText),
    { timeout: 15000 }
  );
  await page.waitForSelector(".timer-bar", { state: "attached", timeout: 5000 });

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
    let acc = pickAccept(it);
    if (mode === "wrong" && it.id === graded[0].id) {
      if (it.type === "mc") {
        const pick = respParts(it, acc);
        const ri = it.choices.indexOf(pick.value);
        const wi = ri >= 0 ? (ri + 1) % it.choices.length : 0;
        return { id: it.id, type: "mc", choiceIndex: wi };
      }
      return { id: it.id, type: "fill", value: "WRONG_ANSWER_XYZ" };
    }
    if (it.type === "mc") {
      const pick = respParts(it, acc);
      const ri = it.choices.indexOf(pick.value);
      return { id: it.id, type: "mc", choiceIndex: ri >= 0 ? ri : 0 };
    }
    if ((it.blanks || 1) > 1 || String(acc).includes("|")) {
      const parts = String(acc).split("|");
      return { id: it.id, type: "multi", parts, blanks: it.blanks || parts.length };
    }
    return { id: it.id, type: "single", value: acc };
  });
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
  await page.waitForFunction(() => document.querySelector(".result-panel h2"), { timeout: 15000 });
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

(async () => {
  const catalog = loadCatalog();
  const bookId = "zap-green-2";
  const units = catalog.units[bookId].filter((u) => u.enabled);
  const srv = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
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
  });

  let n = 0;
  let lastPosts = [];
  for (const unit of units) {
    const key = catalog.unitKey(bookId, unit.id);
    const exs = catalog.exercises[key] || [];
    for (const ex of exs) {
      try {
        const r1 = await runPractice(context, bookId, unit.id, ex, "all-correct");
        lastPosts = r1.posts;
        n++;
        if (ex === exs[0]) {
          await runPractice(context, bookId, unit.id, ex, "wrong");
        }
      } catch (e) {
        throw new Error(`${ex.practiceId} (${unit.id}/${ex.slug}): ${e.message}`);
      }
    }
  }

  const last = lastPosts[lastPosts.length - 1];
  if (!last || last.program !== "greenzap" || last.appName !== "GreenZap 2" || !last.itemId) {
    throw new Error("metrics payload bad: " + JSON.stringify(last));
  }

  console.log(`E2E OK — ${n} practices at 100%, wrong-review sampled per unit, metrics stub verified`);
  await browser.close();
  srv.close();
})().catch((e) => {
  console.error("E2E FAIL", e);
  process.exit(1);
});
