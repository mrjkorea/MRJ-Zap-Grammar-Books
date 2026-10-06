/* Practice engine — timer, grading, metrics (no answer reveal) */
(function (root) {
  "use strict";

  var N = root.MRJ_NORMALIZE;
  var PROGRAM = "greenzap";
  var APP_NAME = "GreenZap 1";
  var SOURCE = "greenzap";
  var PASS_PCT = 80;
  var RETRY_PCT = 50;

  function itemMetricId(practiceId, itemId) {
    return practiceId + ":" + itemId;
  }

  function retryKey(practiceId) {
    return "gz-retry-" + practiceId;
  }

  function mustRetry(practiceId) {
    try {
      return localStorage.getItem(retryKey(practiceId)) === "1";
    } catch (e) {
      return false;
    }
  }

  function setRetry(practiceId, on) {
    try {
      if (on) localStorage.setItem(retryKey(practiceId), "1");
      else localStorage.removeItem(retryKey(practiceId));
    } catch (e) {}
  }

  function gradeItem(item, response) {
    var type = item.type;
    if (type === "mc") {
      var val = response.value;
      if (item.choices && item.choices.length) {
        var idx = item.choices.indexOf(val);
        if (idx >= 0) {
          var num = String(idx + 1);
          if (N.matchMc(num, item.accept)) return true;
        }
      }
      return N.matchMc(val, item.accept);
    }
    if (type === "fill" || type === "sentence") {
      var blanks = item.blanks || 1;
      if (blanks > 1 && response.parts) {
        if (N.matchBlanks(response.parts, item.accept)) return true;
        if (N.matchAccept(response.parts.join(" "), item.accept)) return true;
        return false;
      }
      return N.matchAccept(response.value, item.accept);
    }
    return false;
  }

  function postQuestion(practice, item, correct, durationSeconds) {
    if (!root.MRJ_SCORES) return;
    root.MRJ_SCORES.post({
      program: PROGRAM,
      source: SOURCE,
      appName: APP_NAME,
      bookTitle: "ZAP Green 1",
      unitTitle: "Unit 01",
      itemId: itemMetricId(practice.practiceId, item.id),
      itemType: "question",
      correctness: correct ? "correct" : "incorrect",
      completed: true,
      durationSeconds: durationSeconds || "",
      metadata: { exercise: practice.practiceId },
    });
  }

  function postSummary(practice, scoreValue, scoreMax, scorePct, durationSeconds) {
    if (!root.MRJ_SCORES) return;
    root.MRJ_SCORES.post({
      program: PROGRAM,
      source: SOURCE,
      appName: APP_NAME,
      bookTitle: "ZAP Green 1",
      unitTitle: "Unit 01",
      itemId: practice.practiceId,
      itemType: "practice_summary",
      scoreValue: scoreValue,
      scoreMax: scoreMax,
      scorePct: scorePct,
      completed: true,
      durationSeconds: durationSeconds,
      metadata: { exercise: practice.practiceId, pass: scorePct >= PASS_PCT },
    });
  }

  function scorePractice(practice, responses, startedAt) {
    var items = practice.items.filter(function (it) {
      return !it.displayOnly;
    });
    var results = [];
    var correct = 0;
    items.forEach(function (item) {
      var resp = responses[item.id] || {};
      var ok = gradeItem(item, resp);
      if (ok) correct++;
      results.push({ id: item.id, correct: ok });
    });
    var max = items.length;
    var pct = max ? Math.round((correct / max) * 100) : 0;
    var duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : "";
    results.forEach(function (r) {
      var item = items.filter(function (x) {
        return x.id === r.id;
      })[0];
      if (item) postQuestion(practice, item, r.correct, "");
    });
    postSummary(practice, correct, max, pct, duration);
    if (pct < RETRY_PCT) setRetry(practice.practiceId, true);
    else setRetry(practice.practiceId, false);
    return { correct: correct, max: max, pct: pct, results: results, passed: pct >= PASS_PCT, mustRetry: pct < RETRY_PCT };
  }

  root.MRJ_ENGINE = {
    PROGRAM: PROGRAM,
    APP_NAME: APP_NAME,
    SOURCE: SOURCE,
    PASS_PCT: PASS_PCT,
    RETRY_PCT: RETRY_PCT,
    gradeItem: gradeItem,
    scorePractice: scorePractice,
    mustRetry: mustRetry,
    setRetry: setRetry,
    itemMetricId: itemMetricId,
  };
})(window);
