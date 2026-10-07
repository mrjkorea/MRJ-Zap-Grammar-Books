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
  pack.recordPracticeAttempt(
    local,
    "u01:walk1",
    { correct: 8, max: 10, pct: 80, durationSec: 60, at: 1000 },
    [{ id: "q1", correct: true }]
  );
  const remote = pack.emptyPack();
  pack.recordPracticeAttempt(
    remote,
    "u01:walk1",
    { correct: 4, max: 10, pct: 40, durationSec: 50, at: 2000 },
    [{ id: "q1", correct: false }]
  );
  pack.recordPracticeAttempt(remote, "u01:walk2", { correct: 10, max: 10, pct: 100, durationSec: 30, at: 3 }, []);
  const merged = pack.mergePacks(local, pack.serializePack(remote));
  assert.strictEqual(merged.practices["u01:walk1"].best.pct, 80);
  assert.strictEqual(merged.practices["u01:walk1"].mustRetry, true);
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
  pack.resetInMemoryState();
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  pack._state.idKey = pack.idKeyFromStudent("zz_test_mrjmetrics");
  pack._state.pack = pack.emptyPack();
  pack._state.dirty = true;
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
  pack.resetInMemoryState();
})();

(function testMustRetryUsesLatestAttempt() {
  const p = pack.emptyPack();
  pack.recordPracticeAttempt(
    p,
    "u01:walk1",
    { correct: 3, max: 10, pct: 30, durationSec: 5, at: 1000 },
    []
  );
  assert.strictEqual(pack.mustRetry(p, "u01:walk1"), true);
  pack.recordPracticeAttempt(
    p,
    "u01:walk1",
    { correct: 8, max: 10, pct: 80, durationSec: 5, at: 2000 },
    []
  );
  assert.strictEqual(pack.mustRetry(p, "u01:walk1"), false);
  pack.recordPracticeAttempt(
    p,
    "u01:walk1",
    { correct: 2, max: 10, pct: 20, durationSec: 5, at: 3000 },
    []
  );
  assert.strictEqual(pack.mustRetry(p, "u01:walk1"), true);
})();

(function testFlushSkipsWhenNotDirty() {
  let saveCalls = 0;
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return "student_a";
    },
    packReady() {
      return true;
    },
    savePack() {
      saveCalls++;
      return Promise.resolve({ ok: true });
    },
  };
  pack.resetInMemoryState();
  pack._state.idKey = pack.idKeyFromStudent("student_a");
  pack._state.pack = pack.emptyPack();
  pack._state.serverPack = pack.emptyPack();
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  pack._state.dirty = false;
  pack.flushSave();
  assert.strictEqual(saveCalls, 0);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
})();

(function testStudentChangeResetsPackAndDirty() {
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return "Student A";
    },
  };
  pack._state.idKey = pack.idKeyFromStudent("Student A");
  pack._state.pack = pack.emptyPack();
  pack._state.dirty = true;
  pack._state.loadOk = true;
  globalThis.MRJ_AUTH = {
    student() {
      return "Student B";
    },
  };
  pack._test.syncStudentContext();
  assert.strictEqual(pack._state.idKey, "");
  assert.strictEqual(pack._state.pack, null);
  assert.strictEqual(pack._state.dirty, false);
  assert.strictEqual(pack._state.loadOk, false);
  globalThis.MRJ_AUTH = {
    student() {
      return "";
    },
  };
  pack._state.idKey = pack.idKeyFromStudent("Student A");
  pack._state.dirty = true;
  pack._test.syncStudentContext();
  assert.strictEqual(pack._state.idKey, "");
  assert.strictEqual(pack._state.dirty, false);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
})();

async function testSaveMergesServerSnapshotBeforeUpload() {
  let savedJson = "";
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return "student_a";
    },
    packReady() {
      return true;
    },
    savePack(_program, json) {
      savedJson = json;
      return Promise.resolve({ ok: true });
    },
  };
  pack.resetInMemoryState();
  const server = pack.emptyPack();
  pack.recordPracticeAttempt(
    server,
    "u01:walk2",
    { correct: 10, max: 10, pct: 100, durationSec: 1, at: 1 },
    []
  );
  pack._state.idKey = pack.idKeyFromStudent("student_a");
  pack._state.serverPack = server;
  const local = pack.emptyPack();
  pack.recordPracticeAttempt(
    local,
    "u01:walk1",
    { correct: 5, max: 10, pct: 50, durationSec: 1, at: 2 },
    []
  );
  pack._state.pack = local;
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  pack._state.dirty = true;
  await pack._test.pushSave(true);
  const saved = pack.parsePackJson(savedJson).data;
  assert.ok(saved.practices["u01:walk1"]);
  assert.ok(saved.practices["u01:walk2"]);
  assert.strictEqual(pack._state.dirty, false);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
}

async function testLateLoadFailureDoesNotClobberNewStudent() {
  let resolveLoad;
  let currentStudent = "Student A";
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return currentStudent;
    },
    loadPack() {
      return new Promise(function (resolve) {
        resolveLoad = resolve;
      });
    },
    packReady() {
      return true;
    },
  };
  pack.resetInMemoryState();
  const loadPromise = pack.runLoad();
  currentStudent = "Student B";
  pack._test.syncStudentContext();
  pack._state.idKey = pack.idKeyFromStudent("Student B");
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  resolveLoad({ ok: false, error: "stale_session" });
  await loadPromise;
  assert.strictEqual(pack._state.idKey, pack.idKeyFromStudent("Student B"));
  assert.strictEqual(pack._state.loadOk, true);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
}

async function testLateSaveFailureDoesNotBlockNewStudent() {
  let resolveSave;
  let currentStudent = "Student A";
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return currentStudent;
    },
    packReady() {
      return true;
    },
    savePack() {
      return new Promise(function (resolve) {
        resolveSave = resolve;
      });
    },
  };
  pack.resetInMemoryState();
  pack._state.idKey = pack.idKeyFromStudent("Student A");
  pack._state.pack = pack.emptyPack();
  pack._state.serverPack = pack.emptyPack();
  pack._state.loadOk = true;
  pack._state.loadFinished = true;
  pack._state.dirty = true;
  const saveGenAtStart = pack._state.sessionGen;
  const savePromise = pack._test.pushSave(true);
  currentStudent = "Student B";
  pack._test.syncStudentContext();
  pack._state.idKey = pack.idKeyFromStudent("Student B");
  pack._state.loadOk = true;
  pack._state.dirty = true;
  resolveSave({ ok: false, error: "stale_session" });
  await savePromise;
  assert.strictEqual(pack._state.idKey, pack.idKeyFromStudent("Student B"));
  assert.strictEqual(pack._state.loadOk, true);
  assert.strictEqual(pack._state.dirty, true);
  assert.notStrictEqual(pack._state.sessionGen, saveGenAtStart);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
}

async function testStaleSessionLoadSchedulesRetryWithoutSave() {
  const prevAuth = globalThis.MRJ_AUTH;
  globalThis.MRJ_AUTH = {
    student() {
      return "Student A";
    },
    loadPack() {
      return Promise.resolve({ ok: false, error: "stale_session" });
    },
    packReady() {
      return false;
    },
    savePack() {
      throw new Error("must not save");
    },
  };
  pack.resetInMemoryState();
  await pack.runLoad();
  assert.strictEqual(pack._state.loadOk, false);
  assert.strictEqual(pack.canSave(), false);
  assert.strictEqual(pack._state.loadRetryAttempt, 1);
  assert.ok(pack._state.retryLoadTimer);
  globalThis.MRJ_AUTH = prevAuth;
  pack.resetInMemoryState();
}

testSaveMergesServerSnapshotBeforeUpload()
  .then(function () {
    return testLateLoadFailureDoesNotClobberNewStudent();
  })
  .then(function () {
    return testLateSaveFailureDoesNotBlockNewStudent();
  })
  .then(function () {
    return testStaleSessionLoadSchedulesRetryWithoutSave();
  })
  .then(function () {
    console.log("pack-unit-test: ok");
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
