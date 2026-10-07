/* DOM-free sanity: app.js helpers handle legacy items (no section) and display-only examples. */
"use strict";

const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
global.window = global;
global.document = {
  readyState: "complete",
  addEventListener: () => {},
  getElementById: () => null,
  createTextNode: (t) => ({ nodeType: 3, textContent: t }),
  createElement: (tag) => {
    const el = {
      tagName: tag,
      className: "",
      textContent: "",
      style: {},
      appendChild(c) {
        return c;
      },
      setAttribute() {},
    };
    return el;
  },
};
global.MRJ_CATALOG = {
  books: [],
  units: {},
  findBook: () => null,
  findExercise: () => null,
  unitKey: () => "",
};
global.MRJ_ENGINE = {
  practiceIdOf: (p) => p.practiceId || "",
  mustRetry: () => false,
  APP_NAME: "GreenZap 1",
};
global.location = { hash: "" };

const app = require(path.join(REPO, "assets/js/app.js"));
const jump = JSON.parse(fs.readFileSync(path.join(REPO, "data/green1/unit01/jump.json"), "utf8"));
const legacy = {
  practiceId: "test:legacy",
  title: "Legacy",
  items: [
    { id: "q01", type: "mc", label: "1", choices: ["a", "b"], accept: ["a"], promptEn: "x" },
    {
      id: "q02",
      type: "fill",
      label: "2",
      accept: ["hi"],
      promptEn: "y",
      displayOnly: true,
      example: true,
      exampleAnswer: "hi",
    },
  ],
};

const r1 = app.selfTestPracticeRender(jump);
if (r1.graded !== 22 || r1.examples !== 2) {
  console.error("FAIL jump counts", r1);
  process.exit(1);
}
const r2 = app.selfTestPracticeRender(legacy);
if (r2.graded !== 1 || r2.examples !== 1 || r2.banners !== 0) {
  console.error("FAIL legacy counts", r2);
  process.exit(1);
}
const ex = app.renderExampleCard(legacy.items[1]);
const q = app.renderQuestionCard(legacy.items[0], 0);
if (!ex.className.includes("example-card") || !q.className.includes("q-card")) {
  console.error("FAIL card classes");
  process.exit(1);
}
console.log("app.js section helpers OK (legacy + displayOnly + sectioned jump)");
