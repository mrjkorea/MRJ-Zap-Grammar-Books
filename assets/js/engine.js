/* Practice engine — timer, grading, metrics (no answer reveal) */
(function (root) {
  "use strict";

  var N = root.MRJ_NORMALIZE;
  var PROGRAM = "greenzap";
  var SOURCE = "greenzap";
  var PASS_PCT = 80;
  var RETRY_PCT = 50;
  var DEFAULT_APP_NAME = "GreenZap 1";
  var DEFAULT_BOOK_TITLE = "ZAP Green 1";
  var DEFAULT_UNIT_TITLE = "Unit 01";

  function practiceIdOf(practice) {
    if (!practice) return "";
    if (practice.practiceId) return practice.practiceId;
    if (practice._meta && practice._meta.practiceId) return practice._meta.practiceId;
    return "";
  }

  function metricsContext(practice) {
    var appName = DEFAULT_APP_NAME;
    var bookTitle = DEFAULT_BOOK_TITLE;
    var unitTitle = DEFAULT_UNIT_TITLE;
    if (practice) {
      if (practice.appName) appName = practice.appName;
      if (practice.bookTitle) bookTitle = practice.bookTitle;
      if (practice.unitTitle) unitTitle = practice.unitTitle;
    }
    if (practice && practice._meta && practice._meta.bookId && root.MRJ_CATALOG) {
      var book = root.MRJ_CATALOG.findBook(practice._meta.bookId);
      if (book) {
        if (book.appName) appName = book.appName;
        if (book.bookTitle) bookTitle = book.bookTitle;
      }
    }
    return { appName: appName, bookTitle: bookTitle, unitTitle: unitTitle };
  }

  function itemMetricId(practiceId, itemId) {
    return practiceId + ":" + itemId;
  }

  function packApi() {
    return root.MRJ_GREENZAP_PACK;
  }

  function mustRetry(practiceId) {
    var pack = packApi();
    if (pack && typeof pack.mustRetryPractice === "function") {
      return pack.mustRetryPractice(practiceId);
    }
    return false;
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
        if (item.unordered && item.accept && item.accept.length) {
          var parts = response.parts;
          function permOk(exp) {
            if (exp.length !== parts.length) return false;
            var used = {};
            for (var pi = 0; pi < parts.length; pi++) {
              var matched = false;
              for (var ei = 0; ei < exp.length; ei++) {
                if (used[ei]) continue;
                if (N.matchAccept(parts[pi], exp[ei])) {
                  used[ei] = true;
                  matched = true;
                  break;
                }
              }
              if (!matched) return false;
            }
            return true;
          }
          for (var ai = 0; ai < item.accept.length; ai++) {
            var pat = String(item.accept[ai]);
            if (pat.indexOf("|") >= 0 && permOk(pat.split("|"))) return true;
          }
        }
        if (N.matchAccept(response.parts.join(" "), item.accept)) return true;
        return false;
      }
      return N.matchAccept(response.value, item.accept);
    }
    return false;
  }

  function postSummary(practice, scoreValue, scoreMax, scorePct, durationSeconds) {
    if (!root.MRJ_SCORES) return;
    var pid = practiceIdOf(practice);
    var ctx = metricsContext(practice);
    root.MRJ_SCORES.post({
      program: PROGRAM,
      source: SOURCE,
      appName: ctx.appName,
      bookTitle: ctx.bookTitle,
      unitTitle: ctx.unitTitle,
      itemId: pid,
      itemType: "practice_summary",
      scoreValue: scoreValue,
      scoreMax: scoreMax,
      scorePct: scorePct,
      completed: true,
      durationSeconds: durationSeconds,
      metadata: { exercise: pid, pass: scorePct >= PASS_PCT },
    });
  }

  function gradedItems(practice) {
    return (practice.items || []).filter(function (it) {
      return !it.displayOnly;
    });
  }

  function validItemIds(practice) {
    var ids = {};
    gradedItems(practice).forEach(function (it) {
      ids[it.id] = true;
    });
    return ids;
  }

  function filterQuestionRows(practice, questionRows) {
    var ids = validItemIds(practice);
    if (!questionRows || !questionRows.length) return [];
    return questionRows.filter(function (row) {
      return row && ids[row.id];
    });
  }

  function scorePractice(practice, responses, startedAt) {
    var pid = practiceIdOf(practice);
    var items = gradedItems(practice);
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
    var questionRows = filterQuestionRows(
      practice,
      results.map(function (r) {
        return {
          id: r.id,
          metricId: itemMetricId(pid, r.id),
          correct: r.correct,
        };
      })
    );
    var pack = packApi();
    if (pack && typeof pack.onPracticeScored === "function") {
      pack.onPracticeScored(
        pid,
        { correct: correct, max: max, pct: pct, durationSec: duration },
        questionRows
      );
    }
    postSummary(practice, correct, max, pct, duration);
    return { correct: correct, max: max, pct: pct, results: results, passed: pct >= PASS_PCT, mustRetry: pct < RETRY_PCT };
  }

  root.MRJ_ENGINE = {
    PROGRAM: PROGRAM,
    APP_NAME: DEFAULT_APP_NAME,
    SOURCE: SOURCE,
    PASS_PCT: PASS_PCT,
    RETRY_PCT: RETRY_PCT,
    gradeItem: gradeItem,
    gradedItems: gradedItems,
    filterQuestionRows: filterQuestionRows,
    scorePractice: scorePractice,
    mustRetry: mustRetry,
    itemMetricId: itemMetricId,
    practiceIdOf: practiceIdOf,
    metricsContext: metricsContext,
  };
})(window);
