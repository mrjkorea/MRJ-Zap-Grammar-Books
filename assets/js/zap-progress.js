/**
 * Sequential progress gates for ZAP + 천일문 (RETRY_PCT = 50%).
 * Required exercises per unit = all catalog entries in MRJ_CATALOG.exercises[book:unit].
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.MRJ_ZAP_PROGRESS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var RETRY_PCT = 50;

  function packApi() {
    return root.MRJ_GREENZAP_PACK;
  }

  function catalogApi() {
    return root.MRJ_CATALOG;
  }

  function teacherSkipLocks() {
    try {
      if (root.MRJ_ENGINE && typeof root.MRJ_ENGINE.teacherSkipLocks === "function") {
        return root.MRJ_ENGINE.teacherSkipLocks();
      }
      if (root.MRJ_ZAP_TEACHER && typeof root.MRJ_ZAP_TEACHER.isActive === "function") {
        if (root.MRJ_ZAP_TEACHER.isActive()) return true;
      }
      var api = root.MRJSignin || root.MRJ_AUTH;
      return !!(api && typeof api.isTeacher === "function" && api.isTeacher());
    } catch (e) {
      return false;
    }
  }

  function practiceRecord(practiceId) {
    var pack = packApi();
    if (!pack || typeof pack.getPack !== "function") return null;
    var data = pack.getPack();
    return data && data.practices && data.practices[practiceId] ? data.practices[practiceId] : null;
  }

  function latestAttempt(practiceId) {
    var rec = practiceRecord(practiceId);
    if (!rec || !rec.attempts || !rec.attempts.length) return null;
    var pack = packApi();
    if (pack && typeof pack.latestAttemptFromAttempts === "function") {
      return pack.latestAttemptFromAttempts(rec.attempts);
    }
    var latest = rec.attempts[0];
    for (var i = 1; i < rec.attempts.length; i++) {
      if ((rec.attempts[i].at || 0) >= (latest.at || 0)) latest = rec.attempts[i];
    }
    return latest;
  }

  function latestPct(practiceId) {
    var att = latestAttempt(practiceId);
    return att && typeof att.pct === "number" ? att.pct : null;
  }

  function isPracticeDone(practiceId) {
    var pct = latestPct(practiceId);
    return pct !== null && pct >= RETRY_PCT;
  }

  function mustRetryPractice(practiceId) {
    if (teacherSkipLocks()) return false;
    var pack = packApi();
    if (pack && typeof pack.mustRetryPractice === "function") {
      return pack.mustRetryPractice(practiceId);
    }
    var pct = latestPct(practiceId);
    return pct !== null && pct < RETRY_PCT;
  }

  function exercisesForUnit(bookId, unitId) {
    var cat = catalogApi();
    if (!cat || typeof cat.unitKey !== "function") return [];
    return cat.exercises[cat.unitKey(bookId, unitId)] || [];
  }

  function requiredPracticeIds(bookId, unitId) {
    return exercisesForUnit(bookId, unitId).map(function (ex) {
      return ex.practiceId;
    });
  }

  function isUnitComplete(bookId, unitId) {
    var ids = requiredPracticeIds(bookId, unitId);
    if (!ids.length) return true;
    for (var i = 0; i < ids.length; i++) {
      if (!isPracticeDone(ids[i])) return false;
    }
    return true;
  }

  function enabledUnits(bookId) {
    var cat = catalogApi();
    var list = (cat && cat.units && cat.units[bookId]) || [];
    return list.filter(function (u) {
      return u.enabled;
    });
  }

  function unitIndexFor(bookId, unitId) {
    var units = enabledUnits(bookId);
    for (var i = 0; i < units.length; i++) {
      if (units[i].id === unitId) return i;
    }
    return -1;
  }

  function isUnitUnlocked(bookId, unitIndex) {
    if (teacherSkipLocks()) return true;
    if (unitIndex <= 0) return true;
    var units = enabledUnits(bookId);
    if (unitIndex >= units.length) return false;
    return isUnitComplete(bookId, units[unitIndex - 1].id);
  }

  function isUnitIdUnlocked(bookId, unitId) {
    var idx = unitIndexFor(bookId, unitId);
    if (idx < 0) return true;
    return isUnitUnlocked(bookId, idx);
  }

  function firstIncompleteExerciseIndex(exercises) {
    for (var i = 0; i < exercises.length; i++) {
      if (!isPracticeDone(exercises[i].practiceId)) return i;
    }
    return -1;
  }

  function isExerciseUnlocked(bookId, unitId, exerciseIndex) {
    if (teacherSkipLocks()) return true;
    if (!isUnitIdUnlocked(bookId, unitId)) return false;
    var exs = exercisesForUnit(bookId, unitId);
    if (exerciseIndex < 0 || exerciseIndex >= exs.length) return false;
    var firstOpen = firstIncompleteExerciseIndex(exs);
    if (firstOpen < 0) return true;
    return exerciseIndex <= firstOpen;
  }

  function exerciseIndexFor(bookId, unitId, slug) {
    var exs = exercisesForUnit(bookId, unitId);
    for (var i = 0; i < exs.length; i++) {
      if (exs[i].slug === slug) return i;
    }
    return -1;
  }

  function canOpenExercise(bookId, unitId, slug) {
    if (teacherSkipLocks()) return { ok: true };
    if (!isUnitIdUnlocked(bookId, unitId)) {
      return { ok: false, reason: "unit_locked" };
    }
    var idx = exerciseIndexFor(bookId, unitId, slug);
    if (idx < 0) return { ok: false, reason: "unknown" };
    if (!isExerciseUnlocked(bookId, unitId, idx)) {
      return { ok: false, reason: "exercise_locked" };
    }
    return { ok: true };
  }

  function unitProgressSummary(bookId, unitId) {
    var ids = requiredPracticeIds(bookId, unitId);
    var done = 0;
    var retry = 0;
    var started = 0;
    ids.forEach(function (id) {
      var pct = latestPct(id);
      if (pct !== null) started++;
      if (isPracticeDone(id)) done++;
      else if (mustRetryPractice(id)) retry++;
    });
    return {
      total: ids.length,
      done: done,
      retry: retry,
      started: started,
      complete: ids.length > 0 && done === ids.length,
    };
  }

  function unitStatusLabel(bookId, unitId) {
    if (teacherSkipLocks()) return "open";
    if (!isUnitIdUnlocked(bookId, unitId)) return "locked";
    var sum = unitProgressSummary(bookId, unitId);
    if (sum.complete) return "done";
    if (sum.retry) return "retry";
    if (sum.started) return "progress";
    return "open";
  }

  return {
    RETRY_PCT: RETRY_PCT,
    teacherSkipLocks: teacherSkipLocks,
    latestPct: latestPct,
    isPracticeDone: isPracticeDone,
    mustRetryPractice: mustRetryPractice,
    exercisesForUnit: exercisesForUnit,
    requiredPracticeIds: requiredPracticeIds,
    isUnitComplete: isUnitComplete,
    isUnitUnlocked: isUnitUnlocked,
    isUnitIdUnlocked: isUnitIdUnlocked,
    isExerciseUnlocked: isExerciseUnlocked,
    canOpenExercise: canOpenExercise,
    unitProgressSummary: unitProgressSummary,
    unitStatusLabel: unitStatusLabel,
    unitIndexFor: unitIndexFor,
    enabledUnits: enabledUnits,
    exerciseIndexFor: exerciseIndexFor,
  };
});
