/* Progress gates: 50% bar, sequential exercises, unit unlock chain */
"use strict";

const assert = require("assert");
const progress = require("../assets/js/zap-progress.js");
const pack = require("../assets/js/greenzap-pack.js");

globalThis.MRJ_GREENZAP_PACK = pack;
globalThis.MRJ_ENGINE = { teacherSkipLocks: () => false };

globalThis.MRJ_CATALOG = {
  units: {
    "zap-green-1": [
      { id: "unit-01", enabled: true },
      { id: "unit-02", enabled: true },
    ],
  },
  unitKey: (bookId, unitId) => bookId + ":" + unitId,
  exercises: {
    "zap-green-1:unit-01": [
      { slug: "walk1", practiceId: "g1:u01:walk1" },
      { slug: "walk2", practiceId: "g1:u01:walk2" },
    ],
    "zap-green-1:unit-02": [{ slug: "walk1", practiceId: "g1:u02:walk1" }],
  },
};

globalThis.MRJ_AUTH = {
  student() {
    return "Progress Test";
  },
};

function applyPack(p, opts) {
  opts = opts || {};
  pack.resetInMemoryState();
  const idKey = pack.idKeyFromStudent("Progress Test");
  pack._state.idKey = idKey;
  pack._state.activeStudentIdKey = idKey;
  pack._state.pack = p;
  pack._state.loadFinished = opts.loadFinished !== false;
  pack._state.loadOk = opts.loadOk !== false;
}

function score(id, pct) {
  var base = pack._state.pack ? JSON.parse(JSON.stringify(pack._state.pack)) : pack.emptyPack();
  pack.recordPracticeAttempt(
    base,
    id,
    { correct: pct, max: 100, pct: pct, durationSec: 1, at: Date.now() },
    []
  );
  applyPack(base);
  return base;
}

(function testSequentialExercises() {
  score("g1:u01:walk1", 40);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 0), true);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), false);
  assert.strictEqual(progress.canOpenExercise("zap-green-1", "unit-01", "walk2").ok, false);
  score("g1:u01:walk1", 50);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), true);
})();

(function testUnitGate() {
  score("g1:u01:walk1", 50);
  assert.strictEqual(progress.isUnitIdUnlocked("zap-green-1", "unit-02"), false);
  score("g1:u01:walk2", 50);
  assert.strictEqual(progress.isUnitComplete("zap-green-1", "unit-01"), true);
  assert.strictEqual(progress.isUnitIdUnlocked("zap-green-1", "unit-02"), true);
})();

(function testDoneUsesBestOrAnyNotLatestOnly() {
  const p = pack.emptyPack();
  pack.recordPracticeAttempt(p, "g1:u01:walk1", { correct: 90, max: 100, pct: 90, at: 1000 }, []);
  pack.recordPracticeAttempt(p, "g1:u01:walk1", { correct: 30, max: 100, pct: 30, at: 2000 }, []);
  applyPack(p);
  assert.strictEqual(progress.isPracticeDone("g1:u01:walk1", "zap-green-1"), true);
  assert.strictEqual(progress.mustRetryPractice("g1:u01:walk1", "zap-green-1"), false);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), true);
})();

(function testDoneFromAnyAttemptAt50() {
  const p = pack.emptyPack();
  pack.recordPracticeAttempt(p, "g1:u01:walk1", { correct: 40, max: 100, pct: 40, at: 1000 }, []);
  pack.recordPracticeAttempt(p, "g1:u01:walk1", { correct: 50, max: 100, pct: 50, at: 2000 }, []);
  pack.recordPracticeAttempt(p, "g1:u01:walk1", { correct: 20, max: 100, pct: 20, at: 3000 }, []);
  applyPack(p);
  assert.strictEqual(progress.isPracticeDone("g1:u01:walk1", "zap-green-1"), true);
})();

(function testUnlockUntilPackLoaded() {
  applyPack(pack.emptyPack(), { loadFinished: false, loadOk: false });
  assert.strictEqual(progress.shouldHoldLockUi(), true);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), true);
  assert.strictEqual(progress.canOpenExercise("zap-green-1", "unit-01", "walk2").ok, true);
  applyPack(pack.emptyPack(), { loadFinished: true, loadOk: true });
  score("g1:u01:walk1", 40);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), false);
})();

(function testTeacherBypass() {
  globalThis.MRJ_ENGINE.teacherSkipLocks = () => true;
  assert.strictEqual(progress.canOpenExercise("zap-green-1", "unit-01", "walk2").ok, true);
  globalThis.MRJ_ENGINE.teacherSkipLocks = () => false;
})();

(function testStartPointBeforeDoneAtOpenAfterLocked() {
  applyPack(pack.emptyPack());
  pack._state.pack.startPoints = {
    "zap-green-1": {
      bookId: "zap-green-1",
      unitId: "unit-01",
      exerciseSlug: "walk2",
      practiceId: "g1:u01:walk2",
      setAt: 1000,
    },
  };
  assert.strictEqual(progress.isPracticeDone("g1:u01:walk1", "zap-green-1"), true);
  assert.strictEqual(progress.isPracticeDone("g1:u01:walk2", "zap-green-1"), false);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 0), true);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-01", 1), true);
  assert.strictEqual(progress.canOpenExercise("zap-green-1", "unit-01", "walk2").ok, true);
  assert.strictEqual(progress.isUnitIdUnlocked("zap-green-1", "unit-02"), false);
})();

(function testStartPointMidBookUnlocksEarlierUnits() {
  applyPack(pack.emptyPack());
  pack._state.pack.startPoints = {
    "zap-green-1": {
      bookId: "zap-green-1",
      unitId: "unit-02",
      exerciseSlug: "walk1",
      practiceId: "g1:u02:walk1",
      setAt: 2000,
    },
  };
  assert.strictEqual(progress.isUnitComplete("zap-green-1", "unit-01"), true);
  assert.strictEqual(progress.isUnitIdUnlocked("zap-green-1", "unit-02"), true);
  assert.strictEqual(progress.isExerciseUnlocked("zap-green-1", "unit-02", 0), true);
})();

console.log("progress-unit-test: ok");
