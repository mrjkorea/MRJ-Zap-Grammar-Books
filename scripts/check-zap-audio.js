#!/usr/bin/env node
/**
 * Fail if Zap book graded items lack baked mp3 or blank stems are not beep-planned.
 */
"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const books = [
  "green1", "green2", "green3", "green4",
  "blue1", "blue2", "blue3", "blue4",
  "red1", "red2",
];

let failed = false;
for (const book of books) {
  const r = spawnSync(
    "python3",
    ["scripts/audio-bake/bake_audio.py", "verify", "--book", book],
    { cwd: REPO, encoding: "utf8" }
  );
  if (r.status !== 0) {
    failed = true;
    process.stderr.write(r.stdout || "");
    process.stderr.write(r.stderr || "");
  }
}
process.exit(failed ? 1 : 0);
