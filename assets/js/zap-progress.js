/**
 * Sequential progress gates for ZAP + 천일문 (RETRY_PCT = 50%).
 * Required exercises per unit = all catalog entries in MRJ_CATALOG.exercises[book:unit].
 * Teacher start points (pack.startPoints[bookId]) mark earlier path steps done for locks.
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

  function getStartPoint(bookId) {
    var pack = packApi();
    if (pack && typeof pack.getStartPoint === "function") {
      return pack.getStartPoint(bookId);
    }
    var data = pack && pack.getPack ? pack.getPack() : null;
    if (!data || !data.startPoints) return null;
    var sp = data.startPoints[bookId];
    return sp && sp.unitId ? sp : null;
  }

  function exercisesForUnit(bookId, unitId) {
    var cat = catalogApi();
    if (!cat || typeof cat.unitKey !== "function") return [];
    return cat.exercises[cat.unitKey(bookId, unitId)] || [];
  }

  function enabledUnits(bookId) {
    var cat = catalogApi();
    var list = (cat && cat.units && cat.units[bookId]) || [];
    return list.filter(function (u) {
      return u.enabled;
    });
  }

  function bookPath(bookId) {
    var path = [];
    var units = enabledUnits(bookId);
    for (var ui = 0; ui < units.length; ui++) {
      var u = units[ui];
      var exs = exercisesForUnit(bookId, u.id);
      for (var ei = 0; ei < exs.length; ei++) {
        var ex = exs[ei];
        path.push({
          bookId: bookId,
          unitId: u.id,
          unitTitle: u.title || u.id,
          slug: ex.slug,
          practiceId: ex.practiceId,
          exTitle: ex.title || ex.slug,
          pathIndex: path.length,
        });
      }
    }
    return path;
  }

  function pathIndexFor(bookId, unitId, slug, practiceId) {
    var path = bookPath(bookId);
    for (var i = 0; i < path.length; i++) {
      var row = path[i];
      if (practiceId && row.practiceId === practiceId) return i;
      if (row.unitId === unitId && row.slug === slug) return i;
    }
    return -1;
  }

  function startPathIndex(bookId) {
    var sp = getStartPoint(bookId);
    if (!sp) return -1;
    if (sp.practiceId) {
      var byId = pathIndexFor(bookId, sp.unitId, sp.exerciseSlug, sp.practiceId);
      if (byId >= 0) return byId;
    }
    return pathIndexFor(bookId, sp.unitId, sp.exerciseSlug, null);
  }

  function isBeforeStartPoint(bookId, practiceId) {
    if (!bookId || !practiceId) return false;
    var startIdx = startPathIndex(bookId);
    if (startIdx < 0) return false;
    var idx = pathIndexFor(bookId, null, null, practiceId);
    if (idx < 0) return false;
    return idx < startIdx;
  }

  function isPracticeDone(practiceId, bookId) {
    if (bookId && isBeforeStartPoint(bookId, practiceId)) return true;
    var pct = latestPct(practiceId);
    return pct !== null && pct >= RETRY_PCT;
  }

  function mustRetryPractice(practiceId, bookId) {
    if (teacherSkipLocks()) return false;
    if (bookId && isBeforeStartPoint(bookId, practiceId)) return false;
    var pack = packApi();
    if (pack && typeof pack.mustRetryPractice === "function" && !bookId) {
      return pack.mustRetryPractice(practiceId);
    }
    var pct = latestPct(practiceId);
    return pct !== null && pct < RETRY_PCT;
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
      if (!isPracticeDone(ids[i], bookId)) return false;
    }
    return true;
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

  function firstIncompleteExerciseIndex(exercises, bookId) {
    for (var i = 0; i < exercises.length; i++) {
      if (!isPracticeDone(exercises[i].practiceId, bookId)) return i;
    }
    return -1;
  }

  function isExerciseUnlocked(bookId, unitId, exerciseIndex) {
    if (teacherSkipLocks()) return true;
    if (!isUnitIdUnlocked(bookId, unitId)) return false;
    var exs = exercisesForUnit(bookId, unitId);
    if (exerciseIndex < 0 || exerciseIndex >= exs.length) return false;
    var firstOpen = firstIncompleteExerciseIndex(exs, bookId);
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

  function studentNextPathIndex(bookId) {
    var startIdx = startPathIndex(bookId);
    if (startIdx >= 0) return startIdx;
    var path = bookPath(bookId);
    for (var i = 0; i < path.length; i++) {
      if (!isPracticeDone(path[i].practiceId, bookId)) return i;
    }
    return -1;
  }

  function pathRowLabel(row) {
    if (!row) return "";
    var unitShort = row.unitTitle || row.unitId;
    var exShort = row.exTitle || row.slug;
    return unitShort + " · " + exShort;
  }

  function unitGroupsForBook(bookId) {
    var units = enabledUnits(bookId);
    var groups = [];
    units.forEach(function (u) {
      var rows = [];
      var exs = exercisesForUnit(bookId, u.id);
      exs.forEach(function (ex, ei) {
        rows.push({
          bookId: bookId,
          unitId: u.id,
          unitTitle: u.title || u.id,
          slug: ex.slug,
          practiceId: ex.practiceId,
          exTitle: ex.title || ex.slug,
          exerciseIndex: ei,
          pathIndex: pathIndexFor(bookId, u.id, ex.slug, ex.practiceId),
        });
      });
      if (rows.length) {
        groups.push({ unitId: u.id, unitTitle: u.title || u.id, rows: rows });
      }
    });
    return groups;
  }

  function unitProgressSummary(bookId, unitId) {
    var ids = requiredPracticeIds(bookId, unitId);
    var done = 0;
    var retry = 0;
    var started = 0;
    ids.forEach(function (id) {
      var pct = latestPct(id);
      if (pct !== null) started++;
      if (isPracticeDone(id, bookId)) done++;
      else if (mustRetryPractice(id, bookId)) retry++;
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

  function enabledBooks() {
    var cat = catalogApi();
    return (cat && cat.books ? cat.books : []).filter(function (b) {
      return b.enabled;
    });
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
    enabledBooks: enabledBooks,
    exerciseIndexFor: exerciseIndexFor,
    getStartPoint: getStartPoint,
    bookPath: bookPath,
    pathIndexFor: pathIndexFor,
    startPathIndex: startPathIndex,
    isBeforeStartPoint: isBeforeStartPoint,
    studentNextPathIndex: studentNextPathIndex,
    pathRowLabel: pathRowLabel,
    unitGroupsForBook: unitGroupsForBook,
  };
});
