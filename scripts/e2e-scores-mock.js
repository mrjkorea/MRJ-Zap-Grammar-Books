"use strict";

/** Test-only student id for metrics (never use a real student in automated tests). */
const E2E_STUDENT = "zz_test_mrjmetrics";

/** Playwright: satisfy score posts locally — never hit Apps Script. */
async function blockGoogleScores(context) {
  await context.route(/script\.google\.com/i, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "mock" }),
    })
  );
}

/** In-page init: mock auth + MRJ_SCORES (mrj-scores.js would otherwise post live). */
function e2eAuthScoresInit() {
  try {
    localStorage.clear();
  } catch (e) {}
  window.MRJ_AUTH = {
    student: () => "zz_test_mrjmetrics",
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(fire, 50));
  } else {
    setTimeout(fire, 50);
  }
}

async function setupE2eContext(context) {
  await blockGoogleScores(context);
  await context.addInitScript(e2eAuthScoresInit);
}

module.exports = {
  E2E_STUDENT,
  blockGoogleScores,
  e2eAuthScoresInit,
  setupE2eContext,
};
