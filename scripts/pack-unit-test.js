/* Node tests: merge, save gating, legacy localStorage untouched */
"use strict";

const assert = require("assert");
const pack = require("../assets/js/greenzap-pack.js");

function mockStorage() {
  const map = {};
  return {
    getItem(k) {
      return map[k] == null ? null : map[k];
    },
    setItem(k, v) {
      map[k] = String(v);
    },
    removeItem(k) {},
    _map: map,
  };
}

(function testMergeKeepsBestAndUnionAttempts() {
  const local = pack.emptyPack();
  pack.recordPracticeAttempt(local, "u01:walk1", { correct: 8, max: 10, pct: 80, durationSec: 60 }, [
    { id: "q1", correct: true },
  ]);
  const remote = pack.emptyPack();
  pack.recordPracticeAttempt(remote, "u01:walk1", { correct: 4, max: 10, pct: 40, durationSec: 50 }, [
    { id: "q1", correct: false },
  ]);
  pack.recordPracticeAttempt(remote, "u01:walk2", { correct: 10, max: 10, pct: 100, durationSec: 30 }, []);
  const merged = pack.mergePacks(local, pack.serializePack(remote));
  assert.strictEqual(merged.practices["u01:walk1"].best.pct, 80);
  assert.strictEqual(merged.practices["u01:walk1"].mustRetry, false);
  assert.strictEqual(merged.practices["u01:walk2"].best.pct, 100);
  assert.ok(merged.practices["u01:walk1"].attempts.length >= 2);
})();

(function testUnparseableServerTreatedAsEmpty() {
  const local = pack.emptyPack();
  pack.recordPracticeAttempt(local, "u01:quiz", { correct: 5, max: 10, pct: 50, durationSec: 10 }, []);
  const merged = pack.mergePacks(local, "{not-json");
  assert.strictEqual(merged.practices["u01:quiz"].best.pct, 50);
})();

(function testRicherDetection() {
  const a = pack.emptyPack();
  const b = pack.emptyPack();
  pack.recordPracticeAttempt(a, "p1", { correct: 9, max: 10, pct: 90, durationSec: 1 }, []);
  assert.ok(pack.isRicherThan(a, b));
  assert.ok(!pack.isRicherThan(b, a));
})();

(function testLegacyRetryKeyNotMigrated() {
  const storage = mockStorage();
  storage.setItem("gz-retry-u01:walk1", "1");
  const idKey = pack.idKeyFromStudent("Test Student");
  const keyed = pack.storageKey(idKey);
  assert.strictEqual(storage.getItem("gz-retry-u01:walk1"), "1");
  assert.strictEqual(storage.getItem(keyed), null);
  assert.strictEqual(pack.mustRetry(pack.emptyPack(), "u01:walk1"), false);
})();

(function testSaveGatingRequiresPackReady() {
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  pack._state.idKey = pack.idKeyFromStudent("zz_test_mrjmetrics");
  pack._state.pack = pack.emptyPack();
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return "zz_test_mrjmetrics";
    },
    packReady() {
      return false;
    },
  };
  assert.strictEqual(pack.canSave(), false);
  globalThis.MRJ_AUTH = prevAuth;
  pack._state.loadOk = false;
  pack._state.loadFinished = false;
})();

(function testMustRetryFromPack() {
  const p = pack.emptyPack();
  pack.recordPracticeAttempt(p, "u01:walk1", { correct: 3, max: 10, pct: 30, durationSec: 5 }, []);
  assert.strictEqual(pack.mustRetry(p, "u01:walk1"), true);
  pack.recordPracticeAttempt(p, "u01:walk1", { correct: 8, max: 10, pct: 80, durationSec: 5 }, []);
  assert.strictEqual(pack.mustRetry(p, "u01:walk1"), false);
})();

console.log("pack-unit-test: ok");
