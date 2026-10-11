/* Unit tests for mrj-scores.js (mocked fetch / MRJ_AUTH — no network). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const REPO = path.join(__dirname, "..");
const BUILD = JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8")).build;

function assertCacheBusters() {
  const html = fs.readFileSync(path.join(REPO, "index.html"), "utf8");
  const versions = [...html.matchAll(/\?v=([^"']+)/g)].map((m) => m[1]);
  assert(versions.length > 0, "index.html should have ?v= cache busters");
  assert(
    versions.every((v) => v === BUILD),
    "every ?v= must match version.json build; got " + [...new Set(versions)].join(", ")
  );
  assert(
    html.includes(`mrj-scores.js?v=${BUILD}`),
    "mrj-scores.js must have ?v= matching build"
  );
  const versionJs = fs.readFileSync(path.join(REPO, "assets/js/version.js"), "utf8");
  assert(
    versionJs.includes(`"${BUILD}"`),
    "assets/js/version.js MRJ_ZAP_BUILD must match version.json"
  );
}

function loadScoresHarness(studentFn) {
  const fetchUrls = [];
  const noteScoreCalls = [];
  const storage = {};
  const root = {
    addEventListener: function () {},
    localStorage: {
      getItem: (k) => storage[k] || null,
      setItem: (k, v) => {
        storage[k] = String(v);
      },
    },
    MRJ_AUTH: {
      student: studentFn,
      noteScore: (opts) => {
        noteScoreCalls.push(opts);
        return Promise.resolve();
      },
    },
    fetch: (url, opts) => {
      fetchUrls.push({ url, opts });
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "ok" }),
      });
    },
  };
  const ctx = vm.createContext(root);
  vm.runInContext(fs.readFileSync(path.join(REPO, "mrj-scores.js"), "utf8"), ctx);
  return { root, fetchUrls, noteScoreCalls };
}

async function runPostTests() {
  const { root, fetchUrls, noteScoreCalls } = loadScoresHarness(() => "zz_test_mrjmetrics");

  await root.MRJ_SCORES.post({
    program: "greenzap",
    itemId: "g1:u01:fly",
    scoreValue: 18,
    scoreMax: 22,
    itemType: "practice_summary",
  });

  assert.strictEqual(fetchUrls.length, 1, "summary: one fetch");
  assert(!String(fetchUrls[0].url).includes("script.google.com") || fetchUrls[0].url, "fetch mocked");
  const body = JSON.parse(fetchUrls[0].opts.body);
  assert.strictEqual(body.student_email, "zz_test_mrjmetrics");
  assert.strictEqual(noteScoreCalls.length, 1, "summary: one noteScore");
  assert.strictEqual(noteScoreCalls[0].localDate, root.MRJ_SCORES.localDate());
  assert.strictEqual(noteScoreCalls[0].itemId, "g1:u01:fly");

  fetchUrls.length = 0;
  noteScoreCalls.length = 0;

  await root.MRJ_SCORES.post({
    program: "greenzap",
    itemId: "g1:u01:walk:a01#2",
    scoreValue: 1,
    scoreMax: 1,
    itemType: "question",
  });

  assert.strictEqual(fetchUrls.length, 1, "question: one fetch");
  assert.strictEqual(noteScoreCalls.length, 0, "question: no noteScore");

  const signedOut = loadScoresHarness(() => "");
  await signedOut.root.MRJ_SCORES.post({
    program: "greenzap",
    itemId: "g1:u01:fly",
    scoreValue: 1,
    scoreMax: 1,
  });
  assert.strictEqual(signedOut.fetchUrls.length, 0, "signed out: no fetch");
}

function assertNoLiveGoogleInSmoke() {
  const smokePaths = [
    "scripts/smoke-unit-test.js",
    "scripts/e2e-scores-mock.js",
    "scripts/score-log-unit-test.js",
  ];
  for (const rel of smokePaths) {
    const src = fs.readFileSync(path.join(REPO, rel), "utf8");
    assert(
      !/fetch\s*\(\s*["']https:\/\/script\.google\.com/.test(src),
      rel + " must not fetch script.google.com"
    );
  }
  const e2eDir = fs.readdirSync(path.join(REPO, "scripts")).filter((f) => f.startsWith("e2e-") && f.endsWith(".js"));
  for (const f of e2eDir) {
    const src = fs.readFileSync(path.join(REPO, "scripts", f), "utf8");
    if (f === "e2e-scores-mock.js" || f === "e2e-bz-browser.js") continue;
    assert(
      src.includes("e2e-scores-mock") || src.includes("blockGoogleScores") || src.includes("script.google.com"),
      f + " should use e2e-scores-mock to block live score posts"
    );
  }
}

(async () => {
  assertCacheBusters();
  assertNoLiveGoogleInSmoke();
  await runPostTests();
  console.log("score-log-unit-test: OK");
})().catch((e) => {
  console.error("score-log-unit-test FAIL", e);
  process.exit(1);
});
