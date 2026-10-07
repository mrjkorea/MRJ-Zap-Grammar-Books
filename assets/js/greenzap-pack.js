/**
 * GreenZap per-student progress pack (local + MRJ_AUTH.loadPack/savePack).
 * Pure merge/record helpers are usable from Node tests via module.exports.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.MRJ_GREENZAP_PACK = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var PROGRAM = "greenzap";
  var LS_KEY_BASE = "mrj.greenzap.pack";
  var PACK_VERSION = 1;
  var SAVE_INTERVAL_MS = 17000;
  var RETRY_PCT = 50;
  var LOAD_RETRY_DELAYS_MS = [5000, 15000, 60000];
  var SAVE_FAILURE_BACKOFF_MS = [5000, 15000, 60000, 60000, 60000, 60000];
  var SAVE_FAILURE_STOP_AFTER = 6;
  var STALE_SESSION_RETRY_MS = 2000;

  var state = {
    idKey: "",
    pack: null,
    serverPack: null,
    dirty: false,
    packChangeSeq: 0,
    loadOk: false,
    loadFinished: false,
    sessionGen: 0,
    loadRetryAttempt: 0,
    saveFailureCount: 0,
    saveRetryStopped: false,
    staleFastRetryUsed: false,
    lastSaveFailAt: 0,
    lastSaveAttemptAt: 0,
    lastFlushBypassAt: 0,
    activeStudentIdKey: "",
    loadInFlight: false,
    loadInFlightOwnerIdKey: "",
    loadInFlightOwnerGen: 0,
    scoreResumePending: false,
    saveTimer: null,
    saveInFlight: false,
    pendingSave: false,
    lastSaveAt: 0,
    retryLoadTimer: null,
  };

  function contextMatches(startIdKey, startGen) {
    return studentIdKey() === startIdKey && state.sessionGen === startGen;
  }

  function idKeyFromStudent(student) {
    return String(student == null ? "" : student)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function studentIdKey() {
    try {
      if (root.MRJ_AUTH && typeof root.MRJ_AUTH.student === "function") {
        return idKeyFromStudent(root.MRJ_AUTH.student());
      }
    } catch (e) {}
    return "";
  }

  function storageKey(idKey) {
    return LS_KEY_BASE + ":" + idKey;
  }

  function emptyPack() {
    return { v: PACK_VERSION, practices: {} };
  }

  function parsePackJson(raw) {
    if (raw == null || raw === "") {
      return { ok: true, data: emptyPack(), unparseable: false };
    }
    try {
      var data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!data || typeof data !== "object") {
        return { ok: true, data: emptyPack(), unparseable: true };
      }
      if (!data.practices || typeof data.practices !== "object") {
        data.practices = {};
      }
      if (!data.v) data.v = PACK_VERSION;
      return { ok: true, data: data, unparseable: false };
    } catch (e) {
      return { ok: true, data: emptyPack(), unparseable: true };
    }
  }

  function latestAttemptFromAttempts(attempts) {
    if (!attempts || !attempts.length) return null;
    var latest = attempts[0];
    for (var i = 1; i < attempts.length; i++) {
      if ((attempts[i].at || 0) >= (latest.at || 0)) latest = attempts[i];
    }
    return latest;
  }

  function mustRetryFromPractice(practice) {
    if (!practice) return false;
    var latest = latestAttemptFromAttempts(practice.attempts);
    if (latest && typeof latest.pct === "number") return latest.pct < RETRY_PCT;
    return !!practice.mustRetry;
  }

  function resetInMemoryState() {
    state.sessionGen = (state.sessionGen || 0) + 1;
    state.idKey = "";
    state.pack = null;
    state.serverPack = null;
    state.dirty = false;
    state.loadOk = false;
    state.loadFinished = false;
    state.loadRetryAttempt = 0;
    state.saveFailureCount = 0;
    state.saveRetryStopped = false;
    state.staleFastRetryUsed = false;
    state.lastSaveFailAt = 0;
    state.lastSaveAttemptAt = 0;
    state.lastFlushBypassAt = 0;
    state.activeStudentIdKey = "";
    state.loadInFlight = false;
    state.loadInFlightOwnerIdKey = "";
    state.loadInFlightOwnerGen = 0;
    state.scoreResumePending = false;
    state.packChangeSeq = 0;
    state.pendingSave = false;
    state.saveInFlight = false;
    state.lastSaveAt = 0;
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    if (state.retryLoadTimer) {
      try {
        clearTimeout(state.retryLoadTimer);
      } catch (e) {}
      state.retryLoadTimer = null;
    }
  }

  function practiceEntry(pack, practiceId) {
    if (!pack.practices[practiceId]) {
      pack.practices[practiceId] = {
        best: null,
        mustRetry: false,
        attempts: [],
      };
    }
    return pack.practices[practiceId];
  }

  function mergePractice(localP, remoteP) {
    var out = {
      best: null,
      mustRetry: false,
      attempts: [],
    };
    var locals = localP || { best: null, mustRetry: false, attempts: [] };
    var remotes = remoteP || { best: null, mustRetry: false, attempts: [] };

    var attempts = (locals.attempts || []).concat(remotes.attempts || []);
    attempts.sort(function (a, b) {
      return (a.at || 0) - (b.at || 0);
    });
    var seen = {};
    out.attempts = attempts.filter(function (a) {
      var key = [a.at, a.correct, a.max, a.pct].join("|");
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    function pickBest(a, b) {
      if (!a) return b;
      if (!b) return a;
      var ap = typeof a.pct === "number" ? a.pct : 0;
      var bp = typeof b.pct === "number" ? b.pct : 0;
      if (bp > ap) return b;
      if (ap > bp) return a;
      var ac = typeof a.correct === "number" ? a.correct : 0;
      var bc = typeof b.correct === "number" ? b.correct : 0;
      if (bc > ac) return b;
      if (ac > bc) return a;
      return (a.at || 0) <= (b.at || 0) ? a : b;
    }

    out.best = pickBest(locals.best, remotes.best);
    out.mustRetry = mustRetryFromPractice(out);
    return out;
  }

  function mergePacks(localPack, remotePack) {
    var local = parsePackJson(localPack).data;
    var remote = parsePackJson(remotePack).data;
    var out = emptyPack();
    var ids = {};
    Object.keys(local.practices || {}).forEach(function (id) {
      ids[id] = true;
    });
    Object.keys(remote.practices || {}).forEach(function (id) {
      ids[id] = true;
    });
    Object.keys(ids).forEach(function (id) {
      out.practices[id] = mergePractice(local.practices[id], remote.practices[id]);
    });
    return out;
  }

  function packSignature(pack) {
    var sig = { n: 0, pct: 0, attempts: 0 };
    var practices = (pack && pack.practices) || {};
    Object.keys(practices).forEach(function (id) {
      sig.n++;
      var p = practices[id];
      if (p.best && typeof p.best.pct === "number") sig.pct += p.best.pct;
      sig.attempts += (p.attempts || []).length;
    });
    return sig;
  }

  function isRicherThan(candidate, baseline) {
    var a = packSignature(candidate);
    var b = packSignature(baseline);
    if (a.attempts > b.attempts) return true;
    if (a.attempts < b.attempts) return false;
    if (a.n > b.n) return true;
    if (a.n < b.n) return false;
    return a.pct > b.pct;
  }

  function serializePack(pack) {
    return JSON.stringify(pack);
  }

  function readLocalPack(idKey) {
    if (!idKey) return emptyPack();
    try {
      var raw = root.localStorage.getItem(storageKey(idKey));
      if (!raw) return emptyPack();
      return parsePackJson(raw).data;
    } catch (e) {
      return emptyPack();
    }
  }

  function writeLocalPack(idKey, pack) {
    if (!idKey) return;
    try {
      root.localStorage.setItem(storageKey(idKey), serializePack(pack));
    } catch (e) {}
  }

  function recordPracticeAttempt(pack, practiceId, outcome, questionRows) {
    var entry = practiceEntry(pack, practiceId);
    var at = outcome.at != null ? outcome.at : Date.now();
    var attempt = {
      at: at,
      correct: outcome.correct,
      max: outcome.max,
      pct: outcome.pct,
      durationSec: outcome.durationSec || "",
      questions: questionRows || [],
    };
    entry.attempts = (entry.attempts || []).concat([attempt]);
    var prevBest = entry.best;
    entry.best = mergePractice({ best: prevBest }, { best: attempt }).best;
    entry.mustRetry = outcome.pct < RETRY_PCT;
    return pack;
  }

  function mustRetry(pack, practiceId) {
    var p = pack && pack.practices && pack.practices[practiceId];
    return mustRetryFromPractice(p);
  }

  function authLoadPack(program) {
    if (root.MRJ_AUTH && typeof root.MRJ_AUTH.loadPack === "function") {
      return root.MRJ_AUTH.loadPack(program);
    }
    return Promise.resolve({ ok: false, error: "no_load_pack" });
  }

  function authSavePack(program, json) {
    if (root.MRJ_AUTH && typeof root.MRJ_AUTH.savePack === "function") {
      return root.MRJ_AUTH.savePack(program, json);
    }
    return Promise.resolve({ ok: false, error: "no_save_pack" });
  }

  function authPackReady(program) {
    if (root.MRJ_AUTH && typeof root.MRJ_AUTH.packReady === "function") {
      return root.MRJ_AUTH.packReady(program);
    }
    return false;
  }

  function canSave() {
    return (
      state.loadOk &&
      state.loadFinished &&
      authPackReady(PROGRAM) &&
      !state.saveRetryStopped
    );
  }

  function resumeSaveRetries() {
    state.saveRetryStopped = false;
  }

  function currentBackoffDelayMs() {
    if (!state.saveFailureCount) return 0;
    var idx = Math.min(state.saveFailureCount - 1, SAVE_FAILURE_BACKOFF_MS.length - 1);
    return SAVE_FAILURE_BACKOFF_MS[idx];
  }

  function msUntilBackoffAllowed() {
    if (!state.saveFailureCount || !state.lastSaveFailAt) return 0;
    var delay = currentBackoffDelayMs();
    return Math.max(0, delay - (Date.now() - state.lastSaveFailAt));
  }

  function msUntilSaveAllowed() {
    var throttleWait = 0;
    if (state.lastSaveAttemptAt) {
      throttleWait = Math.max(0, SAVE_INTERVAL_MS - (Date.now() - state.lastSaveAttemptAt));
    }
    return Math.max(throttleWait, msUntilBackoffAllowed());
  }

  function clearLoadRetryTimer() {
    if (state.retryLoadTimer) {
      try {
        clearTimeout(state.retryLoadTimer);
      } catch (e) {}
      state.retryLoadTimer = null;
    }
  }

  function loadOwnerKey(idKey, gen) {
    return String(idKey || "") + "\0" + String(gen == null ? 0 : gen);
  }

  function beginLoadFlight(loadIdKey, loadGen) {
    state.loadInFlight = true;
    state.loadInFlightOwnerIdKey = loadIdKey;
    state.loadInFlightOwnerGen = loadGen;
  }

  function endLoadFlight(loadIdKey, loadGen) {
    if (
      state.loadInFlightOwnerIdKey === loadIdKey &&
      state.loadInFlightOwnerGen === loadGen
    ) {
      state.loadInFlight = false;
      state.loadInFlightOwnerIdKey = "";
      state.loadInFlightOwnerGen = 0;
    }
  }

  function loadPending() {
    return state.loadInFlight || !!state.retryLoadTimer;
  }

  function markSaveRetryStopped() {
    state.saveRetryStopped = true;
    clearLoadRetryTimer();
  }

  function pushSave(bypassThrottle) {
    var bypass = bypassThrottle === true;
    if (!state.idKey || !state.pack || !state.dirty) return Promise.resolve();
    if (state.saveRetryStopped) return Promise.resolve();
    if (!state.loadOk || !state.loadFinished || !authPackReady(PROGRAM)) {
      return Promise.resolve();
    }
    var wait = 0;
    if (bypass) {
      if (state.saveFailureCount > 0) {
        var windowMs = currentBackoffDelayMs();
        if (state.lastFlushBypassAt && Date.now() - state.lastFlushBypassAt < windowMs) {
          return Promise.resolve();
        }
        state.lastFlushBypassAt = Date.now();
      }
    } else {
      wait = msUntilSaveAllowed();
    }
    if (wait > 0) {
      state.pendingSave = true;
      scheduleSave(wait);
      return Promise.resolve();
    }
    if (state.saveInFlight) {
      state.pendingSave = true;
      return Promise.resolve();
    }
    var saveIdKey = state.idKey;
    var saveGen = state.sessionGen;
    var changeSeqAtStart = state.packChangeSeq;
    state.saveInFlight = true;
    state.pendingSave = false;
    state.lastSaveAttemptAt = Date.now();
    var merged = mergePacks(state.pack, state.serverPack || emptyPack());
    if (contextMatches(saveIdKey, saveGen)) {
      state.pack = merged;
      writeLocalPack(saveIdKey, merged);
    }
    var json = serializePack(merged);
    return authSavePack(PROGRAM, json)
      .then(function (res) {
        state.saveInFlight = false;
        if (!contextMatches(saveIdKey, saveGen)) return;
        if (res && res.ok) {
          state.lastSaveAt = Date.now();
          state.serverPack = parsePackJson(json).data;
          state.saveFailureCount = 0;
          state.staleFastRetryUsed = false;
          state.saveRetryStopped = false;
          state.scoreResumePending = false;
          state.dirty = state.packChangeSeq !== changeSeqAtStart;
        } else {
          state.dirty = true;
          handleFailedSave(res && res.error ? String(res.error) : "");
        }
        if (state.pendingSave && state.dirty && !state.saveRetryStopped) scheduleSave();
      })
      .catch(function () {
        state.saveInFlight = false;
        if (!contextMatches(saveIdKey, saveGen)) return;
        state.dirty = true;
        handleFailedSave("network");
        if (state.pendingSave && state.dirty && !state.saveRetryStopped) scheduleSave();
      });
  }

  function handleFailedSave(errorCode) {
    state.loadOk = false;
    if (state.scoreResumePending) {
      state.scoreResumePending = false;
      state.saveFailureCount = SAVE_FAILURE_STOP_AFTER;
      state.lastSaveFailAt = Date.now();
      markSaveRetryStopped();
      return;
    }
    state.saveFailureCount = (state.saveFailureCount || 0) + 1;
    state.lastSaveFailAt = Date.now();
    if (state.saveFailureCount >= SAVE_FAILURE_STOP_AFTER) {
      markSaveRetryStopped();
      return;
    }
    var useStaleFast = errorCode === "stale_session" && !state.staleFastRetryUsed;
    scheduleLoadRetry({ fromSaveFailure: true, useStaleFast: useStaleFast });
  }

  function scheduleSave(waitOverride) {
    if (state.saveRetryStopped) return;
    if (state.saveTimer) return;
    var wait = typeof waitOverride === "number" ? waitOverride : msUntilSaveAllowed();
    if (wait <= 0) wait = 0;
    state.saveTimer = setTimeout(function () {
      state.saveTimer = null;
      pushSave(false);
    }, wait);
  }

  function flushSave() {
    if (!state.dirty || state.saveRetryStopped) return Promise.resolve();
    if (!state.loadOk || !state.loadFinished || !authPackReady(PROGRAM)) {
      return Promise.resolve();
    }
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    return pushSave(true);
  }

  function applyMergedPack(idKey, merged, serverJson) {
    state.idKey = idKey;
    state.pack = merged;
    writeLocalPack(idKey, merged);
  }

  function syncStudentContext() {
    var idKey = studentIdKey();
    if (!idKey) {
      if (state.activeStudentIdKey) resetInMemoryState();
      return "";
    }
    if (state.activeStudentIdKey && state.activeStudentIdKey !== idKey) {
      resetInMemoryState();
    }
    state.activeStudentIdKey = idKey;
    return idKey;
  }

  function runLoad() {
    var idKey = syncStudentContext();
    if (!idKey) {
      state.loadFinished = true;
      return Promise.resolve();
    }

    var loadIdKey = idKey;
    var loadGen = state.sessionGen;
    if (
      state.loadInFlight &&
      state.loadInFlightOwnerIdKey === loadIdKey &&
      state.loadInFlightOwnerGen === loadGen
    ) {
      return Promise.resolve();
    }

    var localAtStart = readLocalPack(loadIdKey);
    if (state.pack && state.idKey === loadIdKey) {
      localAtStart = mergePacks(localAtStart, state.pack);
    }
    state.loadFinished = false;
    state.loadOk = false;
    beginLoadFlight(loadIdKey, loadGen);

    return authLoadPack(PROGRAM)
      .then(function (res) {
        endLoadFlight(loadIdKey, loadGen);
        if (!contextMatches(loadIdKey, loadGen)) return;
        state.loadFinished = true;
        if (!res || !res.ok) {
          handleFailedLoad(loadIdKey, res && res.error ? String(res.error) : "");
          return;
        }
        state.loadOk = true;
        state.loadRetryAttempt = 0;
        var serverJson = res.progress_json != null ? res.progress_json : "";
        var localPack = mergePacks(readLocalPack(loadIdKey), localAtStart);
        var merged = mergePacks(localPack, serverJson);
        var serverParsed = parsePackJson(serverJson).data;
        state.serverPack = serverParsed;
        applyMergedPack(loadIdKey, merged, serverJson);
        state.dirty = false;
        if (isRicherThan(merged, serverParsed)) {
          state.dirty = true;
          scheduleSave();
        }
      })
      .catch(function () {
        endLoadFlight(loadIdKey, loadGen);
        if (!contextMatches(loadIdKey, loadGen)) return;
        state.loadFinished = true;
        handleFailedLoad(loadIdKey, "network");
      });
  }

  function handleFailedLoad(idKey, errorCode) {
    state.loadOk = false;
    if (state.scoreResumePending) {
      state.scoreResumePending = false;
      state.saveFailureCount = SAVE_FAILURE_STOP_AFTER;
      markSaveRetryStopped();
      state.lastSaveFailAt = Date.now();
      if (contextMatches(idKey, state.sessionGen)) {
        state.pack = readLocalPack(idKey);
        state.idKey = idKey;
      }
      return;
    }
    if (contextMatches(idKey, state.sessionGen)) {
      state.pack = readLocalPack(idKey);
      state.idKey = idKey;
    }
    scheduleLoadRetry({
      fromSaveFailure: false,
      useStaleFast: errorCode === "stale_session",
    });
  }

  function scheduleLoadRetry(opts) {
    opts = opts || {};
    if (state.retryLoadTimer) return;
    if (opts.fromSaveFailure && state.saveRetryStopped) return;
    var wait;
    if (opts.fromSaveFailure) {
      if (opts.useStaleFast) {
        state.staleFastRetryUsed = true;
        wait = STALE_SESSION_RETRY_MS;
      } else {
        var fIdx = Math.min(
          Math.max(0, state.saveFailureCount - 1),
          SAVE_FAILURE_BACKOFF_MS.length - 1
        );
        wait = SAVE_FAILURE_BACKOFF_MS[fIdx];
        if (state.lastSaveFailAt) {
          wait = Math.max(0, wait - (Date.now() - state.lastSaveFailAt));
        }
      }
    } else {
      var attempt = state.loadRetryAttempt || 0;
      if (opts.useStaleFast && !state.staleFastRetryUsed) {
        state.staleFastRetryUsed = true;
        wait = STALE_SESSION_RETRY_MS;
      } else {
        wait = LOAD_RETRY_DELAYS_MS[Math.min(attempt, LOAD_RETRY_DELAYS_MS.length - 1)];
      }
      state.loadRetryAttempt = attempt + 1;
    }
    var fromSaveFailure = !!opts.fromSaveFailure;
    state.retryLoadTimer = setTimeout(function () {
      state.retryLoadTimer = null;
      if (!studentIdKey() || state.loadOk) return;
      if (fromSaveFailure && state.saveRetryStopped) return;
      runLoad();
    }, wait);
  }

  function onPracticeScored(practiceId, outcome, questionRows) {
    var idKey = syncStudentContext();
    if (!idKey) return;
    if (!state.pack) state.pack = readLocalPack(idKey);
    state.idKey = idKey;
    var needsLoad = state.saveRetryStopped || !state.loadOk;
    resumeSaveRetries();
    if (needsLoad) state.scoreResumePending = true;
    recordPracticeAttempt(state.pack, practiceId, outcome, questionRows);
    writeLocalPack(idKey, state.pack);
    state.packChangeSeq = (state.packChangeSeq || 0) + 1;
    state.dirty = true;
    if (needsLoad) {
      clearLoadRetryTimer();
      runLoad();
    } else if (state.loadOk && state.loadFinished && authPackReady(PROGRAM)) {
      scheduleSave();
    }
  }

  function getPack() {
    syncStudentContext();
    var idKey = studentIdKey();
    if (!idKey) return emptyPack();
    if (state.pack && state.idKey === idKey) return state.pack;
    return readLocalPack(idKey);
  }

  function mustRetryPractice(practiceId) {
    return mustRetry(getPack(), practiceId);
  }

  function bindLifecycle() {
    if (root.__MRJ_GZ_PACK_BOUND) return;
    if (typeof root.addEventListener !== "function") return;
    root.__MRJ_GZ_PACK_BOUND = true;
    root.addEventListener("mrj-auth-ready", function () {
      resumeSaveRetries();
      runLoad();
    });
    root.addEventListener("pagehide", function () {
      flushSave();
    });
    root.addEventListener("visibilitychange", function () {
      if (root.document && root.document.visibilityState === "hidden") flushSave();
    });
  }

  bindLifecycle();

  return {
    PROGRAM: PROGRAM,
    LS_KEY_BASE: LS_KEY_BASE,
    RETRY_PCT: RETRY_PCT,
    SAVE_INTERVAL_MS: SAVE_INTERVAL_MS,
    SAVE_FAILURE_STOP_AFTER: SAVE_FAILURE_STOP_AFTER,
    msUntilSaveAllowed: msUntilSaveAllowed,
    resumeSaveRetries: resumeSaveRetries,
    idKeyFromStudent: idKeyFromStudent,
    storageKey: storageKey,
    emptyPack: emptyPack,
    parsePackJson: parsePackJson,
    mergePacks: mergePacks,
    mergePractice: mergePractice,
    isRicherThan: isRicherThan,
    recordPracticeAttempt: recordPracticeAttempt,
    mustRetry: mustRetry,
    mustRetryFromPractice: mustRetryFromPractice,
    latestAttemptFromAttempts: latestAttemptFromAttempts,
    resetInMemoryState: resetInMemoryState,
    serializePack: serializePack,
    runLoad: runLoad,
    onPracticeScored: onPracticeScored,
    mustRetryPractice: mustRetryPractice,
    getPack: getPack,
    flushSave: flushSave,
    canSave: canSave,
    _state: state,
    contextMatches: contextMatches,
    handleFailedLoad: handleFailedLoad,
    handleFailedSave: handleFailedSave,
    _test: {
      applyMergedPack: applyMergedPack,
      pushSave: pushSave,
      runLoad: runLoad,
      readLocalPack: readLocalPack,
      writeLocalPack: writeLocalPack,
      syncStudentContext: syncStudentContext,
      scheduleLoadRetry: scheduleLoadRetry,
      msUntilSaveAllowed: msUntilSaveAllowed,
      flushSave: flushSave,
      clearLoadRetryTimer: clearLoadRetryTimer,
      endLoadFlight: endLoadFlight,
    },
  };
});
