/**
 * Wrong-answer review (no correct answers in rendered output).
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.MRJ_REVIEW = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var EMPTY_ANSWER_KO = "(빈칸 — 답을 쓰지 않았어요)";
  var WRONG_ANSWER_LABEL = "내가 쓴 답 (틀림):";
  var WRONG_ANSWER_HINT = "이 답은 틀렸어요. 같은 답을 다시 쓰지 마세요.";

  function engine() {
    return root.MRJ_ENGINE;
  }

  function normalize() {
    return root.MRJ_NORMALIZE;
  }

  function itemDisplayLabel(item, idx) {
    if (item && item.label) return String(item.label);
    return "Q" + (idx + 1);
  }

  function sectionDef(practice, sectionId) {
    var secs = practice.sections || [];
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].id === sectionId) return secs[i];
    }
    return null;
  }

  function sectionTitle(item, practice) {
    if (item.sectionTitle) return item.sectionTitle;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.title) return def.title;
    if (item.section) return "Section " + item.section;
    return "Items";
  }

  function sectionInstructionKo(item, practice) {
    if (item.sectionInstructionKo) return item.sectionInstructionKo;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.instructionKo) return def.instructionKo;
    return "";
  }

  function answerModeTag(item, practice) {
    if (item.answerModeTag) return item.answerModeTag;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.answerModeTag) return def.answerModeTag;
    return "";
  }

  function displayText(raw) {
    var t = String(raw == null ? "" : raw).trim();
    return t ? t : EMPTY_ANSWER_KO;
  }

  /** Per-blank correctness when item is wrong; uses accept internally — never expose return to DOM as strings. */
  function perBlankMarks(item, response) {
    var blanks = item.blanks || 1;
    if (blanks <= 1) return null;
    var E = engine();
    var N = normalize();
    if (!E || !N) return null;
    if (E.gradeItem(item, response)) {
      var all = [];
      for (var i = 0; i < blanks; i++) all.push(true);
      return all;
    }
    var parts = response.parts || [];
    while (parts.length < blanks) parts.push("");
    var acceptList = item.accept || [];
    var marks = [];
    for (var b = 0; b < blanks; b++) {
      var ok = false;
      for (var a = 0; a < acceptList.length; a++) {
        var pattern = String(acceptList[a]);
        if (pattern.indexOf("|") < 0) continue;
        var exp = pattern.split("|");
        if (exp.length !== blanks) continue;
        if (N.matchAccept(parts[b], exp[b])) ok = true;
      }
      marks.push(ok);
    }
    return marks;
  }

  function studentAnswerLines(item, response) {
    if (item.type === "mc") {
      return [{ num: null, text: displayText(response.value), blankWrong: true }];
    }
    var blanks = item.blanks || 1;
    if (blanks <= 1) {
      return [{ num: null, text: displayText(response.value), blankWrong: true }];
    }
    var parts = response.parts || [];
    var marks = perBlankMarks(item, response) || [];
    var lines = [];
    for (var b = 0; b < blanks; b++) {
      lines.push({
        num: b + 1,
        text: displayText(parts[b]),
        blankWrong: marks.length ? !marks[b] : true,
      });
    }
    return lines;
  }

  function mcChoiceDisplay(item, response) {
    var val = response.value;
    if (!val) return displayText("");
    var choices = item.choices || [];
    var idx = choices.indexOf(val);
    if (choices.length > 2 && idx >= 0) return idx + 1 + ". " + val;
    return val;
  }

  function studentAnswerSummary(item, response) {
    if (item.type === "mc") return mcChoiceDisplay(item, response);
    var lines = studentAnswerLines(item, response);
    if (lines.length === 1 && lines[0].num == null) return lines[0].text;
    return lines
      .map(function (ln) {
        return ln.num + ". " + ln.text + (ln.blankWrong ? " ✗" : "");
      })
      .join(" / ");
  }

  function collectWrongRows(practice, responses, results) {
    var E = engine();
    var items = E && E.gradedItems ? E.gradedItems(practice) : (practice.items || []).filter(function (it) {
      return !it.displayOnly;
    });
    var byId = {};
    (results || []).forEach(function (r) {
      byId[r.id] = r;
    });
    var rows = [];
    items.forEach(function (item, idx) {
      var r = byId[item.id];
      if (!r || r.correct) return;
      var resp = (responses && responses[item.id]) || {};
      rows.push({
        id: item.id,
        label: itemDisplayLabel(item, idx),
        section: item.section || "",
        sectionTitle: sectionTitle(item, practice),
        sectionInstructionKo: sectionInstructionKo(item, practice),
        answerModeTag: answerModeTag(item, practice),
        promptKo: item.promptKo || "",
        promptEn: item.promptEn || "",
        noteKo: item.noteKo || "",
        studentLines: studentAnswerLines(item, resp),
        studentSummary: studentAnswerSummary(item, resp),
      });
    });
    return rows;
  }

  function lastReviewStorageKey(practice) {
    var E = engine();
    var pid = E ? E.practiceIdOf(practice) : practice.practiceId || "";
    var ver = practice.sectionsVersion != null ? practice.sectionsVersion : 0;
    return "gz.lastReview:" + pid + ":v" + ver;
  }

  function saveLastReview(practice, responses, results) {
    if (!root.sessionStorage) return;
    try {
      root.sessionStorage.setItem(
        lastReviewStorageKey(practice),
        JSON.stringify({ responses: responses, results: results, at: Date.now() })
      );
    } catch (e) {}
  }

  function loadLastReview(practice) {
    if (!root.sessionStorage) return null;
    try {
      var raw = root.sessionStorage.getItem(lastReviewStorageKey(practice));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function createEl(doc, tag, cls, text) {
    var el = doc.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function appendPromptBlock(parent, doc, row) {
    if (row.promptKo) {
      var ko = createEl(doc, "div", "q-ko");
      ko.style.whiteSpace = "pre-line";
      ko.textContent = row.promptKo;
      parent.appendChild(ko);
    }
    if (row.promptEn) {
      var en = createEl(doc, "div", "q-en");
      en.style.whiteSpace = "pre-line";
      en.textContent = row.promptEn;
      parent.appendChild(en);
    }
  }

  function renderWrongReviewPanel(doc, practice, responses, results, opts) {
    opts = opts || {};
    var rows = collectWrongRows(practice, responses, results);
    if (!rows.length) return null;

    var wrap = createEl(doc, "div", "wrong-review-wrap");
    if (opts.heading) {
      wrap.appendChild(createEl(doc, "h3", "wrong-review-heading", opts.heading));
    }
    if (opts.lead) {
      wrap.appendChild(createEl(doc, "p", "wrong-review-lead", opts.lead));
    }

    var groupKey = null;
    var sectionEl = null;

    rows.forEach(function (row) {
      var key = row.section + "\0" + row.sectionTitle;
      if (key !== groupKey) {
        groupKey = key;
        sectionEl = createEl(doc, "div", "wrong-review-section");
        var head = createEl(doc, "div", "wrong-review-section-head");
        head.appendChild(createEl(doc, "span", "wrong-review-section-title", row.sectionTitle));
        if (row.answerModeTag) {
          head.appendChild(createEl(doc, "span", "mode-chip", row.answerModeTag));
        }
        sectionEl.appendChild(head);
        if (row.sectionInstructionKo) {
          sectionEl.appendChild(
            createEl(doc, "div", "wrong-review-instr", row.sectionInstructionKo)
          );
        }
        wrap.appendChild(sectionEl);
      }

      var card = createEl(doc, "div", "wrong-review-card");
      card.appendChild(createEl(doc, "div", "wrong-review-label", row.label));
      appendPromptBlock(card, doc, row);
      if (row.noteKo) card.appendChild(createEl(doc, "div", "q-note", row.noteKo));

      var ansBlock = createEl(doc, "div", "wrong-review-answer");
      ansBlock.appendChild(createEl(doc, "div", "wrong-review-answer-label", WRONG_ANSWER_LABEL));
      if (row.studentLines.length === 1 && row.studentLines[0].num == null) {
        ansBlock.appendChild(
          createEl(doc, "div", "wrong-review-answer-text", row.studentLines[0].text)
        );
      } else {
        var list = createEl(doc, "ul", "wrong-review-blanks");
        row.studentLines.forEach(function (ln) {
          var li = createEl(doc, "li", ln.blankWrong ? "blank-wrong" : "blank-ok-part");
          li.textContent = ln.num + ". " + ln.text;
          list.appendChild(li);
        });
        ansBlock.appendChild(list);
      }
      ansBlock.appendChild(createEl(doc, "p", "wrong-review-warn", WRONG_ANSWER_HINT));
      card.appendChild(ansBlock);

      if (row.sectionInstructionKo) {
        var again = createEl(doc, "div", "wrong-review-reminder");
        again.appendChild(createEl(doc, "span", "wrong-review-reminder-label", "다시 보기 · 지시문"));
        if (row.answerModeTag) {
          again.appendChild(createEl(doc, "span", "mode-chip", row.answerModeTag));
        }
        again.appendChild(createEl(doc, "div", "wrong-review-reminder-text", row.sectionInstructionKo));
        card.appendChild(again);
      }

      sectionEl.appendChild(card);
    });

    return wrap;
  }

  /** Full review copy (prompts + student answers) for content checks. */
  function reviewPlainText(practice, responses, results) {
    var rows = collectWrongRows(practice, responses, results);
    var parts = [];
    rows.forEach(function (row) {
      parts.push(row.label, row.sectionTitle, row.sectionInstructionKo, row.answerModeTag);
      parts.push(row.promptKo, row.promptEn, row.noteKo, row.studentSummary);
      parts.push(WRONG_ANSWER_LABEL, WRONG_ANSWER_HINT);
      row.studentLines.forEach(function (ln) {
        parts.push(String(ln.num || ""), ln.text);
      });
    });
    return parts.join("\n");
  }

  /** Student answer fields only — use for accept-leak checks (excludes prompts/instructions). */
  function reviewAnswerPlainText(practice, responses, results) {
    var rows = collectWrongRows(practice, responses, results);
    var parts = [WRONG_ANSWER_LABEL, WRONG_ANSWER_HINT];
    rows.forEach(function (row) {
      parts.push(row.studentSummary);
      row.studentLines.forEach(function (ln) {
        parts.push(ln.text);
      });
    });
    return parts.join("\n");
  }

  function acceptStringsForItem(item) {
    var out = [];
    var list = item.accept || [];
    list.forEach(function (a) {
      var s = String(a);
      out.push(s);
      if (s.indexOf("|") >= 0) {
        s.split("|").forEach(function (p) {
          out.push(p);
        });
      }
    });
    (item.choices || []).forEach(function (c) {
      var idx = (item.choices || []).indexOf(c);
      list.forEach(function (a) {
        if (String(a) === String(idx + 1) || String(a) === String(c)) out.push(c);
      });
    });
    return out.filter(function (x) {
      return x && String(x).trim().length > 0;
    });
  }

  return {
    EMPTY_ANSWER_KO: EMPTY_ANSWER_KO,
    WRONG_ANSWER_LABEL: WRONG_ANSWER_LABEL,
    collectWrongRows: collectWrongRows,
    studentAnswerSummary: studentAnswerSummary,
    perBlankMarks: perBlankMarks,
    renderWrongReviewPanel: renderWrongReviewPanel,
    reviewPlainText: reviewPlainText,
    reviewAnswerPlainText: reviewAnswerPlainText,
    saveLastReview: saveLastReview,
    loadLastReview: loadLastReview,
    lastReviewStorageKey: lastReviewStorageKey,
    acceptStringsForItem: acceptStringsForItem,
  };
});
