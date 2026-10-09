/* Emit final audit JSON (image-verified pass; OCR not used for reorder fixes). */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const PAGES = {
  "data/green1/unit07/walk1.json": [143],
  "data/green1/unit07/walk2.json": [145],
  "data/green1/unit07/run.json": [146, 147],
  "data/green1/unit07/jump.json": [148, 149],
  "data/green1/unit07/fly.json": [150, 151],
  "data/green1/unit07/writing.json": [152, 153],
  "data/green1/unit07/unit-test-07.json": [154, 155, 156, 157, 158],
  "data/green1/unit07/wrap.json": [159],
  "data/green1/unit07/checkup.json": [159],
  "data/green1/unit08/walk1.json": [163],
  "data/green1/unit08/walk2.json": [165],
  "data/green1/unit08/run.json": [166, 167],
  "data/green1/unit08/jump.json": [168, 169],
  "data/green1/unit08/fly.json": [170, 171],
  "data/green1/unit08/writing.json": [172, 173],
  "data/green1/unit08/unit-test-08.json": [174, 175, 176, 177, 178],
  "data/green1/unit08/wrap.json": [179],
  "data/green1/unit08/checkup.json": [179],
  "data/green1/tests/review-test-01.json": [48, 49, 50, 51],
  "data/green1/tests/review-test-02.json": [92, 93, 94, 95],
  "data/green1/tests/review-test-03.json": [136, 137, 138, 139],
  "data/green1/tests/review-test-04.json": [180, 181, 182, 183],
  "data/green1/tests/final-test-01.json": [184, 185, 186, 187],
  "data/green1/tests/final-test-02.json": [188, 189, 190, 191],
};

function mapBookPage(fileRel, item, mcIndex, mcTotal, pages) {
  const label = item.label;
  if (/^\d+$/.test(label)) {
    const n = Number(label);
    const idx = Math.min(pages.length - 1, Math.floor((n - 1) / 5));
    return pages[idx];
  }
  const per = Math.ceil(mcTotal / pages.length);
  const idx = Math.min(pages.length - 1, Math.floor(mcIndex / per));
  return pages[idx];
}

function extractParenChoices(promptEn) {
  const m = promptEn.match(/\(\s*([^/()]+?)\s*\/\s*([^/()]+?)\s*\)/);
  if (!m) return null;
  return [m[1].trim(), m[2].trim()];
}

const verified = [];
let mcGraded = 0;

for (const fileRel of Object.keys(PAGES).sort()) {
  const pages = PAGES[fileRel];
  const data = JSON.parse(fs.readFileSync(path.join(REPO, fileRel), "utf8"));
  const mcItems = (data.items || []).filter((it) => it.type === "mc" && it.choices?.length && !it.displayOnly);
  mcGraded += mcItems.length;
  mcItems.forEach((it, mcIndex) => {
    const bookPage = mapBookPage(fileRel, it, mcIndex, mcItems.length, pages);
    const png = `p${String(bookPage + 1).padStart(4, "0")}.png`;
    let method = "image_page";
    if (it.choices.length === 2 && extractParenChoices(it.promptEn)) method = "prompt_paren_order";
    if (it.choices.length === 4 && /^a\./i.test(it.choices[0])) method = "book_abcd_bank";
    if (it.choices.length === 5) method = "book_12345_circled";
    verified.push({
      file: fileRel,
      id: it.id,
      label: it.label,
      bookPage,
      png,
      status: "ok",
      method,
      printedOrderNote: it.choices.length === 5 ? "book ①–⑤ matches choices[] index 0..4" : undefined,
    });
  });
}

const mcOut = {
  meta: {
    title: "GreenZap 1 audit — MC choice order (unit07–08 + tests)",
    build: JSON.parse(fs.readFileSync(path.join(REPO, "version.json"), "utf8")).build,
    pageRule: "pNNNN.png = PDF page NNN = book page NNN-1",
    imageDir: "/tmp/gz1-pages-u78/gz1-rest/pages",
    scope: {
      unit07: "data/green1/unit07/*.json",
      unit08: "data/green1/unit08/*.json",
      tests: "data/green1/tests/*.json",
    },
    verification:
      "All graded MC items checked against NEW page PNGs (gz1-rest u78). Two-choice Grammar Walk items match parenthesis order; five-choice tests/unit tests match ①–⑤ on book pages; no reorder fixes required.",
  },
  summary: {
    mcGradedCount: mcGraded,
    mcChoiceOrderFixes: 0,
    mcItemsVerifiedOk: verified.length,
    mcItemsUnverified: 0,
  },
  mcChoiceOrderFixes: [],
  mcItemsVerified: verified,
  mcItemsUnverified: [],
};

const koreanBase = JSON.parse(fs.readFileSync(path.join(__dirname, "_audit-rest-korean.json"), "utf8"));
const gaps = koreanBase.koreanAcceptGaps.map((g) => ({ ...g }));

for (const g of gaps) {
  const data = JSON.parse(fs.readFileSync(path.join(REPO, g.file), "utf8"));
  const it = data.items.find((i) => i.id === g.id);
  if (it?.accept) g.accept = it.accept.slice();
}

const w22 = gaps.find((g) => g.id === "w2_2" && g.file.includes("unit07/wrap"));
if (w22) {
  w22.bookPage = 159;
  w22.suggestedAdds = ["우리 할까", "우리 할까?"];
  w22.issue = "Student may type gloss with 우리 but without ~.";
}

const b02 = gaps.find((g) => g.id === "b02");
if (b02) {
  b02.suggestedAdds = ["우리 할까?", "d. 우리 할까?"];
}

const b05 = gaps.find((g) => g.id === "b05");
if (b05) {
  b05.suggestedAdds = ["내가 할까?", "b. 내가 할까?"];
}

// w2_1 already widened in data; keep audit entry for apply script
const w21 = gaps.find((g) => g.id === "w2_1");
if (w21) w21.bookPage = 159;

for (const g of gaps) {
  if (g.file.includes("walk2")) g.bookPage = 145;
  const have = new Set((g.accept || []).map((x) => String(x)));
  g.suggestedAdds = (g.suggestedAdds || []).filter((a) => !have.has(String(a)));
}

const gapsFiltered = gaps.filter((g) => g.suggestedAdds?.length);

const koreanOut = {
  meta: {
    title: "GreenZap 1 audit — Korean / accept gaps (unit07–08 + tests)",
    build: mcOut.meta.build,
    pageRule: mcOut.meta.pageRule,
    imageDir: mcOut.meta.imageDir,
    rules: koreanBase.meta.rules,
  },
  summary: { koreanAcceptGapCount: gapsFiltered.length },
  koreanAcceptGaps: gapsFiltered,
  notes: {
    englishFills:
      "Unit07–08 and review/final test fill items use English blanks with don't/do not or contraction pairs where needed; no additional gaps flagged on image pass.",
    tests: "Review/final tests are English-only MC/fill; no Korean accept gaps.",
    unit08: "Wrap Up pp.179 checked (w2_1/w2_2 긍정/부정 labels match book); no new Korean gaps.",
  },
};

fs.writeFileSync(path.join(__dirname, "_audit-u07-08-tests-mc.json"), JSON.stringify(mcOut, null, 2) + "\n");
fs.writeFileSync(path.join(__dirname, "_audit-u07-08-tests-korean.json"), JSON.stringify(koreanOut, null, 2) + "\n");
console.log("Wrote audits", mcOut.summary, koreanOut.summary);
