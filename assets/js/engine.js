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

  function teacherSkipLocks() {
    try {
      if (root.MRJ_ZAP_TEACHER && typeof root.MRJ_ZAP_TEACHER.isActive === "function") {
        if (root.MRJ_ZAP_TEACHER.isActive()) return true;
      }
      var api = root.MRJSignin || root.MRJ_AUTH;
      return !!(api && typeof api.isTeacher === "function" && api.isTeacher());
    } catch (e) {
      return false;
    }
  }

  function mustRetry(practiceId) {
    if (teacherSkipLocks()) return false;
    var prog = root.MRJ_ZAP_PROGRESS;
    if (prog && typeof prog.mustRetryPractice === "function") {
      return prog.mustRetryPractice(practiceId);
    }
    var pack = packApi();
    if (pack && typeof pack.mustRetryPractice === "function") {
      return pack.mustRetryPractice(practiceId);
    }
    return false;
  }

  function matchPairsOf(item) {
    if (item.pairs && item.pairs.length) return item.pairs;
    return [];
  }

  function gradeMatchPair(item, response, pairIndex) {
    var pairs = matchPairsOf(item);
    if (pairIndex < 0 || pairIndex >= pairs.length) return false;
    var expected = pairs[pairIndex];
    var links = (response && response.links) || {};
    var chosen = links[expected.left];
    if (chosen == null || chosen === "") return false;
    return N.matchAccept(chosen, [expected.right]);
  }

  function gradeMatchItem(item, response) {
    var pairs = matchPairsOf(item);
    if (!pairs.length) return false;
    for (var i = 0; i < pairs.length; i++) {
      if (!gradeMatchPair(item, response, i)) return false;
    }
    return true;
  }

  var CIRCLED_CHOICES = "①②③④⑤⑥⑦⑧⑨⑩";

  function normalizeOxPick(value) {
    var t = String(value == null ? "" : value).trim();
    if (/^[Oo○ㅇ]$/.test(t)) return "O";
    if (/^[Xx×✕]$/.test(t)) return "X";
    return "";
  }

  function oxJudgmentKey(item) {
    var list = item.accept || [];
    for (var i = 0; i < list.length; i++) {
      var pick = normalizeOxPick(list[i]);
      if (pick) return pick;
    }
    if (item.rewriteAccept && item.rewriteAccept.length) return "X";
    return "";
  }

  /** O/X tap, plus a rewrite only when the key is X. O auto-passes the rewrite. */
  function gradeOxParts(item, response) {
    var key = oxJudgmentKey(item);
    var picked = normalizeOxPick(response && response.value);
    var judgment = !!key && picked === key;
    var needsRewrite = key === "X" && item.rewriteAccept && item.rewriteAccept.length > 0;
    var rewriteOk = true;
    if (needsRewrite) {
      rewriteOk = picked === "X" && N.matchAccept((response && response.rewrite) || "", item.rewriteAccept);
    }
    return {
      key: key,
      picked: picked,
      judgment: judgment,
      needsRewrite: !!needsRewrite,
      rewrite: needsRewrite ? rewriteOk : true,
      correct: judgment && (needsRewrite ? rewriteOk : true),
    };
  }

  function choiceIndexFromToken(item, token) {
    var raw = String(token == null ? "" : token).trim();
    if (!raw) return -1;
    var choices = item.choices || [];
    var ci = CIRCLED_CHOICES.indexOf(raw);
    if (ci >= 0 && ci < choices.length) return ci;
    if (/^\d+$/.test(raw)) {
      var n = Number(raw) - 1;
      if (n >= 0 && n < choices.length) return n;
    }
    return choices.indexOf(raw);
  }

  function uniqueSortedIndexes(nums) {
    var map = {};
    for (var i = 0; i < nums.length; i++) {
      if (nums[i] >= 0) map[nums[i]] = true;
    }
    return Object.keys(map)
      .map(function (k) { return Number(k); })
      .sort(function (a, b) { return a - b; });
  }

  function expectedChoiceIndexes(item) {
    var acc = item.accept || [];
    var choices = item.choices || [];
    for (var i = 0; i < acc.length; i++) {
      var parts = String(acc[i]).split("|");
      var idxs = [];
      var ok = parts.length > 0;
      for (var p = 0; p < parts.length; p++) {
        var ix = choiceIndexFromToken(item, parts[p]);
        if (ix < 0 || ix >= choices.length) {
          ok = false;
          break;
        }
        idxs.push(ix);
      }
      if (ok && idxs.length) return uniqueSortedIndexes(idxs);
    }
    return [];
  }

  function selectedChoiceIndexes(item, response) {
    var values = [];
    if (response && Array.isArray(response.values)) values = response.values.slice();
    else if (response && response.value != null && String(response.value) !== "") {
      values = String(response.value).indexOf("|") >= 0 ? String(response.value).split("|") : [response.value];
    }
    var idxs = [];
    for (var i = 0; i < values.length; i++) idxs.push(choiceIndexFromToken(item, values[i]));
    return uniqueSortedIndexes(idxs);
  }

  function gradeMultiMc(item, response) {
    var exp = expectedChoiceIndexes(item);
    var got = selectedChoiceIndexes(item, response);
    if (!exp.length || got.length !== exp.length) return false;
    for (var i = 0; i < exp.length; i++) {
      if (got[i] !== exp[i]) return false;
    }
    return true;
  }

  function gradePartsItem(item, response) {
    var spec = item.parts || [];
    if (!spec.length) return false;
    var got = response && response.parts ? response.parts.slice() : [];
    if (!got.length && response && response.value != null && String(response.value).indexOf("|") >= 0) {
      got = String(response.value).split("|");
    }
    if (got.length < spec.length) return false;
    for (var i = 0; i < spec.length; i++) {
      var part = spec[i];
      var val = got[i];
      if (part.kind === "mc") {
        if (!gradeItem({ type: "mc", choices: part.choices || [], accept: part.accept || [] }, { value: val })) {
          return false;
        }
      } else if (!N.matchAccept(val, part.accept || [])) {
        return false;
      }
    }
    return true;
  }

  function gradeItem(item, response) {
    response = response || {};
    var type = item.type;
    if (type === "match") {
      return gradeMatchItem(item, response);
    }
    if (type === "ox") {
      return gradeOxParts(item, response).correct;
    }
    if (type === "parts") {
      return gradePartsItem(item, response);
    }
    if (type === "mc") {
      if (item.select === "multi") return gradeMultiMc(item, response);
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
        if (item.unordered && N.matchBlanksUnordered) {
          if (N.matchBlanksUnordered(response.parts, item.accept)) return true;
          return false;
        }
        if (N.matchBlanks(response.parts, item.accept)) return true;
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
      if (!row || !row.id) return false;
      if (ids[row.id]) return true;
      var hash = String(row.id).indexOf("#");
      if (hash > 0) {
        var base = String(row.id).slice(0, hash);
        return ids[base];
      }
      return false;
    });
  }

  function scoringUnitsForItem(item, resp) {
    if (item.type === "match") {
      var pairs = matchPairsOf(item);
      var units = [];
      for (var pi = 0; pi < pairs.length; pi++) {
        units.push({
          id: item.id,
          pairIndex: pi,
          subId: item.id + "#" + (pi + 1),
          correct: gradeMatchPair(item, resp, pi),
        });
      }
      return units;
    }
    return [{ id: item.id, subId: item.id, correct: gradeItem(item, resp) }];
  }

  function postQuestionMetric(practice, metricItemId, correct, durationSeconds) {
    if (!root.MRJ_SCORES) return;
    var pid = practiceIdOf(practice);
    var ctx = metricsContext(practice);
    root.MRJ_SCORES.post({
      program: PROGRAM,
      source: SOURCE,
      appName: ctx.appName,
      bookTitle: ctx.bookTitle,
      unitTitle: ctx.unitTitle,
      itemId: itemMetricId(pid, metricItemId),
      itemType: "question",
      scoreValue: correct ? 1 : 0,
      scoreMax: 1,
      scorePct: correct ? 100 : 0,
      correctness: correct ? "correct" : "incorrect",
      completed: true,
      durationSeconds: durationSeconds,
      metadata: { exercise: pid, question: metricItemId },
    });
  }

  function scorePractice(practice, responses, startedAt) {
    var pid = practiceIdOf(practice);
    var items = gradedItems(practice);
    var results = [];
    var questionRows = [];
    var correct = 0;
    var max = 0;
    var duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : "";
    items.forEach(function (item) {
      var resp = responses[item.id] || {};
      var units = scoringUnitsForItem(item, resp);
      var itemOk = true;
      units.forEach(function (u) {
        max++;
        if (u.correct) correct++;
        else itemOk = false;
        questionRows.push({
          id: u.subId,
          metricId: itemMetricId(pid, u.subId),
          correct: u.correct,
        });
        if (item.type === "match") {
          postQuestionMetric(practice, u.subId, u.correct, duration);
        }
      });
      results.push({ id: item.id, correct: itemOk });
    });
    var pct = max ? Math.round((correct / max) * 100) : 0;
    questionRows = filterQuestionRows(practice, questionRows);
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
    teacherSkipLocks: teacherSkipLocks,
    gradeItem: gradeItem,
    gradeOxParts: gradeOxParts,
    gradeMultiMc: gradeMultiMc,
    expectedChoiceIndexes: expectedChoiceIndexes,
    gradeMatchPair: gradeMatchPair,
    gradeMatchItem: gradeMatchItem,
    matchPairsOf: matchPairsOf,
    gradedItems: gradedItems,
    filterQuestionRows: filterQuestionRows,
    scorePractice: scorePractice,
    mustRetry: mustRetry,
    itemMetricId: itemMetricId,
    practiceIdOf: practiceIdOf,
    metricsContext: metricsContext,
  };
})(window);
