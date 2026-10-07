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

  var state = {
    idKey: "",
    pack: null,
    loadOk: false,
    loadFinished: false,
    saveTimer: null,
    saveInFlight: false,
    pendingSave: false,
    lastSaveAt: 0,
    retryLoadTimer: null,
  };

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
    if (out.best && typeof out.best.pct === "number") {
      out.mustRetry = out.best.pct < RETRY_PCT;
    } else {
      out.mustRetry = !!(locals.mustRetry || remotes.mustRetry);
    }
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
    var at = Date.now();
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
    entry.mustRetry = !!(entry.best && typeof entry.best.pct === "number" && entry.best.pct < RETRY_PCT);
    return pack;
  }

  function mustRetry(pack, practiceId) {
    var p = pack && pack.practices && pack.practices[practiceId];
    if (!p) return false;
    if (p.mustRetry) return true;
    if (p.best && typeof p.best.pct === "number") return p.best.pct < RETRY_PCT;
    return false;
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
    return state.loadOk && state.loadFinished && authPackReady(PROGRAM);
  }

  function pushSave(force) {
    if (!canSave() || !state.idKey || !state.pack) return Promise.resolve();
    var now = Date.now();
    if (!force && now - state.lastSaveAt < SAVE_INTERVAL_MS) {
      state.pendingSave = true;
      scheduleSave();
      return Promise.resolve();
    }
    if (state.saveInFlight) {
      state.pendingSave = true;
      return Promise.resolve();
    }
    state.saveInFlight = true;
    state.pendingSave = false;
    var json = serializePack(state.pack);
    return authSavePack(PROGRAM, json)
      .then(function (res) {
        state.saveInFlight = false;
        if (res && res.ok) state.lastSaveAt = Date.now();
        else state.loadOk = false;
        if (state.pendingSave) scheduleSave();
      })
      .catch(function () {
        state.saveInFlight = false;
        state.loadOk = false;
      });
  }

  function scheduleSave() {
    if (state.saveTimer) return;
    var wait = SAVE_INTERVAL_MS;
    if (state.lastSaveAt) {
      wait = Math.max(0, SAVE_INTERVAL_MS - (Date.now() - state.lastSaveAt));
    }
    state.saveTimer = setTimeout(function () {
      state.saveTimer = null;
      pushSave(false);
    }, wait);
  }

  function flushSave() {
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

  function runLoad() {
    var idKey = studentIdKey();
    if (!idKey) {
      state.loadOk = false;
      state.loadFinished = true;
      state.pack = emptyPack();
      return Promise.resolve();
    }

    var localAtStart = readLocalPack(idKey);
    state.loadFinished = false;
    state.loadOk = false;

    return authLoadPack(PROGRAM)
      .then(function (res) {
        state.loadFinished = true;
        if (!res || !res.ok) {
          state.pack = readLocalPack(idKey);
          state.idKey = idKey;
          scheduleLoadRetry();
          return;
        }
        state.loadOk = true;
        var serverJson = res.progress_json != null ? res.progress_json : "";
        var localPack = mergePacks(readLocalPack(idKey), localAtStart);
        var merged = mergePacks(localPack, serverJson);
        var serverParsed = parsePackJson(serverJson).data;
        applyMergedPack(idKey, merged, serverJson);
        if (isRicherThan(merged, serverParsed)) {
          return pushSave(true);
        }
      })
      .catch(function () {
        state.loadFinished = true;
        state.loadOk = false;
        state.pack = readLocalPack(idKey);
        state.idKey = idKey;
        scheduleLoadRetry();
      });
  }

  function scheduleLoadRetry() {
    if (state.retryLoadTimer) return;
    state.retryLoadTimer = setTimeout(function () {
      state.retryLoadTimer = null;
      if (!state.loadOk) runLoad();
    }, 60000);
  }

  function onPracticeScored(practiceId, outcome, questionRows) {
    var idKey = studentIdKey();
    if (!idKey) return;
    if (!state.pack) state.pack = readLocalPack(idKey);
    recordPracticeAttempt(state.pack, practiceId, outcome, questionRows);
    writeLocalPack(idKey, state.pack);
    if (canSave()) scheduleSave();
  }

  function getPack() {
    if (state.pack) return state.pack;
    var idKey = studentIdKey();
    if (idKey) return readLocalPack(idKey);
    return emptyPack();
  }

  function mustRetryPractice(practiceId) {
    return mustRetry(getPack(), practiceId);
  }

  function bindLifecycle() {
    if (root.__MRJ_GZ_PACK_BOUND) return;
    if (typeof root.addEventListener !== "function") return;
    root.__MRJ_GZ_PACK_BOUND = true;
    root.addEventListener("mrj-auth-ready", function () {
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
    idKeyFromStudent: idKeyFromStudent,
    storageKey: storageKey,
    emptyPack: emptyPack,
    parsePackJson: parsePackJson,
    mergePacks: mergePacks,
    mergePractice: mergePractice,
    isRicherThan: isRicherThan,
    recordPracticeAttempt: recordPracticeAttempt,
    mustRetry: mustRetry,
    serializePack: serializePack,
    runLoad: runLoad,
    onPracticeScored: onPracticeScored,
    mustRetryPractice: mustRetryPractice,
    getPack: getPack,
    flushSave: flushSave,
    canSave: canSave,
    _state: state,
    _test: {
      applyMergedPack: applyMergedPack,
      pushSave: pushSave,
      readLocalPack: readLocalPack,
      writeLocalPack: writeLocalPack,
    },
  };
});
