#!/usr/bin/env node
/**
 * Fail if chunilmun1 graded items lack baked mp3 + manifest coverage
 * (uses scripts/audio-bake/bake_audio.py verify — chunilmun strict TTS rules).
 */
"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const REPO = path.join(__dirname, "..");
const r = spawnSync(
  "python3",
  ["scripts/audio-bake/bake_audio.py", "verify", "--book", "chunilmun1"],
  { cwd: REPO, stdio: "inherit" }
);
process.exit(r.status === 0 ? 0 : r.status || 1);
