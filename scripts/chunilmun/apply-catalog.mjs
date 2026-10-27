#!/usr/bin/env node
/**
 * Regenerate catalog.js entries for chunilmun-grammar-1 from book-manifest.json
 * and discovered JSON files under data/chunilmun1/.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, "..", "..");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(__dirname, "book-manifest.json"), "utf8")
);
const CATALOG = path.join(REPO, "assets/js/catalog.js");

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function exists(rel) {
  return fs.existsSync(path.join(REPO, rel));
}

function buildUnits() {
  const units = [];
  for (const ch of MANIFEST.chapters) {
    units.push({
      id: ch.id,
      title: `Ch ${pad2(ch.num)} SB — ${ch.title}`,
      enabled: true,
    });
    units.push({
      id: `wb-${ch.id}`,
      title: `Ch ${pad2(ch.num)} WB — ${ch.title}`,
      enabled: true,
    });
    if (ch.reviewAfter) {
      const rev = MANIFEST.reviews.find((r) => r.id === ch.reviewAfter);
      if (rev) {
        units.push({ id: rev.id, title: rev.title, enabled: true });
      }
    }
  }
  return units;
}

function exerciseEntry({ slug, title, hint, rel, practiceId }) {
  return `      {
        slug: "${slug}",
        title: "${title.replace(/"/g, '\\"')}",
        hint: "${hint.replace(/"/g, '\\"')}",
        data: "${rel}",
        practiceId: "${practiceId}",
      }`;
}

function buildExercisesForChapter(ch) {
  const c = pad2(ch.num);
  const lines = [];
  const dir = `data/chunilmun1/chapter${c}`;

  for (let u = 1; u <= ch.units; u++) {
    const secCount = ch.sbSectionsPerUnit[u - 1] || 3;
    for (let s = 0; s < secCount; s++) {
      const letter = LETTERS[s];
      const slug = `c${c}-u${u}-${letter}`;
      const rel = `${dir}/${slug}.json`;
      if (!exists(rel)) continue;
      lines.push(
        exerciseEntry({
          slug,
          title: `Unit ${u} Exercise ${letter}`,
          hint: `SB · ${ch.title}`,
          rel,
          practiceId: `cm1:c${c}:u${u}-${letter}`,
        })
      );
    }
  }
  const testSlug = `c${c}-test`;
  const testRel = `${dir}/${testSlug}.json`;
  if (exists(testRel)) {
    lines.push(
      exerciseEntry({
        slug: testSlug,
        title: "Chapter Test",
        hint: `SB · ${ch.title}`,
        rel: testRel,
        practiceId: `cm1:c${c}:test`,
      })
    );
  }
  return lines;
}

function buildWbExercises(ch) {
  const c = pad2(ch.num);
  const lines = [];
  const dir = `data/chunilmun1/chapter${c}`;
  for (let u = 1; u <= ch.units; u++) {
    for (let s = 0; s < 4; s++) {
      const letter = LETTERS[s];
      const slug = `wb-c${c}-u${u}-${letter}`;
      const rel = `${dir}/${slug}.json`;
      if (!exists(rel)) continue;
      lines.push(
        exerciseEntry({
          slug,
          title: `WB Unit ${u} ${letter}`,
          hint: `WB · ${ch.title}`,
          rel,
          practiceId: `cm1:wb-c${c}:u${u}-${letter}`,
        })
      );
    }
  }
  const wbTest = `wb-c${c}-test`;
  const wbTestRel = `${dir}/${wbTest}.json`;
  if (exists(wbTestRel)) {
    lines.push(
      exerciseEntry({
        slug: wbTest,
        title: "WB Chapter Test",
        hint: `WB · ${ch.title}`,
        rel: wbTestRel,
        practiceId: `cm1:wb-c${c}:test`,
      })
    );
  }
  return lines;
}

function buildReviewExercises(rev) {
  const rel = `data/chunilmun1/${rev.id}/${rev.id}.json`;
  if (!exists(rel)) return [];
  return [
    exerciseEntry({
      slug: rev.id,
      title: rev.title,
      hint: "총괄평가",
      rel,
      practiceId: `cm1:${rev.id}`,
    }),
  ];
}

function buildAllExercises() {
  const blocks = [];
  for (const ch of MANIFEST.chapters) {
    const sb = buildExercisesForChapter(ch);
    if (sb.length) {
      blocks.push(`    "chunilmun-grammar-1:${ch.id}": [\n${sb.join(",\n")}\n    ],`);
    }
    const wb = buildWbExercises(ch);
    if (wb.length) {
      blocks.push(
        `    "chunilmun-grammar-1:wb-${ch.id}": [\n${wb.join(",\n")}\n    ],`
      );
    }
    if (ch.reviewAfter) {
      const rev = MANIFEST.reviews.find((r) => r.id === ch.reviewAfter);
      if (rev) {
        const rx = buildReviewExercises(rev);
        if (rx.length) {
          blocks.push(
            `    "chunilmun-grammar-1:${rev.id}": [\n${rx.join(",\n")}\n    ],`
          );
        }
      }
    }
  }
  return blocks.join("\n");
}

function patchCatalog() {
  let src = fs.readFileSync(CATALOG, "utf8");

  const unitsJson = buildUnits()
    .map(
      (u) =>
        `      { id: "${u.id}", title: "${u.title.replace(/"/g, '\\"')}", enabled: ${u.enabled} },`
    )
    .join("\n");

  src = src.replace(
    /"chunilmun-grammar-1": \[[\s\S]*?\],\s*\n    "zap-green-2"/,
    `"chunilmun-grammar-1": [\n${unitsJson}\n    ],\n    "zap-green-2"`
  );

  const exBlock = buildAllExercises();
  src = src.replace(
    /\n    "chunilmun-grammar-1:[^"]+": \[[\s\S]*?\],/g,
    ""
  );
  src = src.replace(/\n  \};\s*$/, `\n${exBlock}\n\n  };`);

  fs.writeFileSync(CATALOG, src);
  console.log("Patched", CATALOG);
}

patchCatalog();
