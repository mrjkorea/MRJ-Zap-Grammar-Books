(function () {
  "use strict";

  var app = document.getElementById("mrj-app-root");
  var catalog = window.MRJ_CATALOG;
  var engine = window.MRJ_ENGINE;
  var progress = window.MRJ_ZAP_PROGRESS;
  var review = window.MRJ_REVIEW;
  var SEL_BOOK = "gz.book";
  var SEL_UNIT = "gz.unit";
  var CHUNILMUN_BOOK = "chunilmun-grammar-1";
  var HUB_TITLE = "MRJ Grammar Practice Hub — ZAP & 천일문";
  var ZAP_HUB_TITLE = "MRJ Zap Grammar Books";

  function $(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function getSel(key, fallback) {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setSel(key, val) {
    try {
      sessionStorage.setItem(key, val);
    } catch (e) {}
  }

  function studentLabel() {
    if (window.MRJ_STUDENT) return window.MRJ_STUDENT;
    if (window.MRJ_AUTH && window.MRJ_AUTH.student) return window.MRJ_AUTH.student() || "";
    return "";
  }

  function mrjTeacher() {
    try {
      if (window.MRJ_ZAP_TEACHER && typeof window.MRJ_ZAP_TEACHER.isActive === "function") {
        if (window.MRJ_ZAP_TEACHER.isActive()) return true;
      }
      var api = window.MRJSignin || window.MRJ_AUTH;
      return !!(api && typeof api.isTeacher === "function" && api.isTeacher());
    } catch (e) {
      return false;
    }
  }

  function isChunilmunBook(bookId) {
    return bookId === CHUNILMUN_BOOK || /chunilmun/.test(bookId || "");
  }

  function isZapBook(bookId) {
    return !isChunilmunBook(bookId);
  }

  function setDocumentTitle(title) {
    document.title = title;
  }

  function chunilmunUnitRoute(unitId) {
    if (!unitId) return "#/chunilmun";
    if (/^wb-chapter-(\d+)$/.test(unitId)) {
      return "#/chunilmun/chapter-" + unitId.match(/^wb-chapter-(\d+)$/)[1] + "/wb";
    }
    if (/^chapter-(\d+)$/.test(unitId)) {
      return "#/chunilmun/chapter-" + unitId.match(/^chapter-(\d+)$/)[1] + "/sb";
    }
    if (/^review-/.test(unitId)) return "#/chunilmun/" + unitId;
    return "#/chunilmun";
  }

  function chunilmunUnitFromRoute(parts) {
    if (!parts || !parts[1]) return null;
    if (/^review-\d+$/.test(parts[1])) return parts[1];
    var m = parts[1].match(/^chapter-(\d+)$/i);
    if (!m) return null;
    var kind = (parts[2] || "sb").toLowerCase();
    return kind === "wb" ? "wb-chapter-" + m[1] : "chapter-" + m[1];
  }

  function chunilmunCatalog() {
    var units = catalog.units[CHUNILMUN_BOOK] || [];
    var chapters = [];
    var reviews = [];
    units.forEach(function (u) {
      if (/^review-/.test(u.id)) {
        reviews.push(u);
        return;
      }
      var m = u.id.match(/^chapter-(\d+)$/);
      if (!m) return;
      chapters.push({
        n: +m[1],
        title: u.title.replace(/^Ch\s*\d+\s*SB\s*—\s*/i, ""),
        sbId: u.id,
        wbId: "wb-chapter-" + m[1],
        sbLabel: u.title,
        wbLabel: (units.filter(function (x) {
          return x.id === "wb-chapter-" + m[1];
        })[0] || { title: "Ch " + m[1] + " WB" }).title,
      });
    });
    chapters.sort(function (a, b) {
      return a.n - b.n;
    });
    return { chapters: chapters, reviews: reviews };
  }

  function brandForBook(bookId) {
    if (isChunilmunBook(bookId)) {
      var cm = catalog.findBook(CHUNILMUN_BOOK);
      return (cm && cm.appName) || "천일문 Grammar 1";
    }
    var book = catalog.findBook(bookId) || catalog.findBook("zap-green-1");
    var name = (book && book.appName) || engine.APP_NAME;
    return name + " · " + ZAP_HUB_TITLE;
  }

  function indexBackHref(bookId) {
    if (isChunilmunBook(bookId)) return chunilmunUnitRoute(getSel(SEL_UNIT, "chapter-01"));
    var id = bookId || getSel(SEL_BOOK, "zap-green-1");
    return "#/zap/" + id;
  }

  function zapBookRoute(bookId) {
    return "#/zap/" + (bookId || getSel(SEL_BOOK, "zap-green-1"));
  }

  function parseZapBookRoute(parts) {
    if (parts[0] !== "zap" || !parts[1]) return null;
    return parts[1];
  }

  function applyExerciseLock(btn, bookId, unitId, ex, index) {
    if (!progress) return;
    var unitLocked = !progress.isUnitIdUnlocked(bookId, unitId);
    var exLocked = !progress.isExerciseUnlocked(bookId, unitId, index);
    if (unitLocked || exLocked) {
      btn.classList.add("locked");
      btn.setAttribute("aria-disabled", "true");
      btn.addEventListener("click", function (e) {
        if (mrjTeacher()) return;
        e.preventDefault();
        if (unitLocked) {
          alert("Finish the previous unit at 50% or higher on every exercise to unlock this unit.");
        } else {
          alert("Finish the previous exercise at 50% or higher before opening the next one.");
        }
      });
      btn.appendChild($("span", "lock-tag", unitLocked ? " 🔒 Unit locked" : " 🔒 Locked"));
      return;
    }
    if (progress.isPracticeDone(ex.practiceId, bookId)) {
      btn.classList.add("is-done");
      btn.appendChild($("span", "done-tag", " ✓ Done (≥50%)"));
    }
    if (engine.mustRetry(ex.practiceId)) {
      btn.appendChild($("span", "retry-tag", " · Please try again (score was under 50%)"));
    }
  }

  function practiceHref(bookId, unitId, slug) {
    return "#/p/" + bookId + "/" + unitId + "/" + slug;
  }

  function applyBookTheme(bookId) {
    var id = bookId || getSel(SEL_BOOK, "zap-green-1");
    var attr = isChunilmunBook(id)
      ? "chunilmun-grammar-1"
      : /red/.test(id)
        ? "red"
        : /blue/.test(id)
          ? "blue"
          : "green";
    document.documentElement.setAttribute("data-book", attr);
    document.documentElement.setAttribute(
      "data-view",
      /^#\/p\//.test(location.hash) ? "practice" : "index"
    );
  }

  function applyHubTheme() {
    document.documentElement.setAttribute("data-book", "hub");
    document.documentElement.setAttribute("data-view", "hub");
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

  function introKoForPractice(practice) {
    if (practice.introKo) return practice.introKo;
    var secs = practice.sections || [];
    if (!secs.length) return "";
    return secs
      .map(function (s) {
        var tag = s.answerModeTag || "";
        var modeShort = tag.indexOf("·") >= 0 ? tag.split("·")[1].trim() : tag;
        var title = s.title || (s.id ? "Section " + s.id : "Section");
        return title + " " + s.itemCount + "문항(" + modeShort + ")";
      })
      .join(", ");
  }

  function sectionBannerTitle(item, practice) {
    if (item.sectionTitle) return item.sectionTitle;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.title) return def.title;
    if (item.section) return "Section " + item.section;
    return "";
  }

  function sectionBannerInstruction(item, practice) {
    if (item.sectionInstructionKo) return item.sectionInstructionKo;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.instructionKo) return def.instructionKo;
    return "";
  }

  function sectionBannerModeTag(item, practice) {
    if (item.answerModeTag) return item.answerModeTag;
    var def = item.section ? sectionDef(practice, item.section) : null;
    if (def && def.answerModeTag) return def.answerModeTag;
    return "";
  }

  function appendModeChip(parent, tag) {
    if (!tag) return;
    parent.appendChild($("span", "mode-chip", tag));
  }

  function sectionWordBank(practice, sectionId) {
    var sections = practice.sections || [];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === sectionId && sections[i].wordBank && sections[i].wordBank.length) {
        return sections[i].wordBank;
      }
    }
    return null;
  }

  function practiceUsesSectionWordBanks(practice) {
    return (practice.sections || []).some(function (s) {
      return s.wordBank && s.wordBank.length;
    });
  }

  function appendWordBankEl(parent, words) {
    if (!words || !words.length) return;
    var bank = $("div", "word-bank");
    words.forEach(function (w) {
      bank.appendChild($("span", null, w));
    });
    parent.appendChild(bank);
  }

  function appendSectionBanner(form, item, practice, lastSection) {
    if (!item.section || item.section === lastSection) return lastSection;
    var banner = $("div", "section-banner");
    var head = $("div", "section-banner-head");
    head.appendChild($("span", "section-banner-title", sectionBannerTitle(item, practice)));
    appendModeChip(head, sectionBannerModeTag(item, practice));
    banner.appendChild(head);
    var instr = sectionBannerInstruction(item, practice);
    if (instr) banner.appendChild($("div", "section-banner-instr", instr));
    appendWordBankEl(banner, sectionWordBank(practice, item.section));
    form.appendChild(banner);
    return item.section;
  }

  function inputPlaceholder(item) {
    if (item.answerMode === "match") return "";
    if (item.answerMode === "words") return "빈칸 말만";
    if (item.answerMode === "sentence") return "문장 전체를 쓰세요";
    return "";
  }

  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededShuffle(list, seed) {
    var arr = list.slice();
    var state = seed >>> 0;
    function rnd() {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    }
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function matchRightOrder(item, practiceId) {
    var rights = (item.pairs || []).map(function (p) {
      return p.right;
    });
    return seededShuffle(rights, hashSeed(practiceId + ":" + item.id + ":right"));
  }

  function draftStorageKey(practice) {
    var pid = engine.practiceIdOf(practice);
    var ver = practice.sectionsVersion != null ? practice.sectionsVersion : 0;
    return "gz.draft:" + pid + ":v" + ver;
  }

  function clearStaleDrafts(practice) {
    var key = draftStorageKey(practice);
    try {
      var keys = [];
      for (var i = 0; i < sessionStorage.length; i++) keys.push(sessionStorage.key(i));
      keys.forEach(function (k) {
        if (k && k.indexOf("gz.draft:") === 0 && k !== key) sessionStorage.removeItem(k);
      });
    } catch (e) {}
  }

  function renderPracticeIntro(practice) {
    var intro = introKoForPractice(practice);
    if (intro) app.appendChild($("p", "intro-ko", intro));
    var secs = practice.sections || [];
    if (!secs.length) return;
    var row = $("div", "section-intro-row");
    secs.forEach(function (s) {
      var cell = $("div", "section-intro-cell");
      cell.appendChild($("span", "section-intro-title", s.title || ("Section " + s.id)));
      if (s.answerModeTag) appendModeChip(cell, s.answerModeTag);
      row.appendChild(cell);
    });
    app.appendChild(row);
  }

  function escapeHtmlText(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Book stems: [wrong] → underline; preserve <u> from scan-backed JSON. */
  function promptEnToHtml(raw) {
    var s = String(raw || "");
    var under = [];
    s = s.replace(/<u>([\s\S]*?)<\/u>/gi, function (_, inner) {
      var tok = "\x00U" + under.length + "\x00";
      under.push(escapeHtmlText(inner));
      return tok;
    });
    s = escapeHtmlText(s);
    s = s.replace(/\[([^\[\]]+)\]/g, '<span class="q-mark">$1</span>');
    for (var i = 0; i < under.length; i++) {
      s = s.split("\x00U" + i + "\x00").join('<span class="q-mark">' + under[i] + "</span>");
    }
    return s.replace(/\n/g, "<br>");
  }

  function appendPromptLines(card, item) {
    if (item.image) {
      var img = document.createElement("img");
      img.className = "q-image";
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      card.appendChild(img);
    }
    if (item.promptKo) {
      var ko = $("div", "q-ko");
      ko.style.whiteSpace = "pre-line";
      ko.textContent = item.promptKo;
      card.appendChild(ko);
    }
    if (item.promptEn) {
      var en = $("div", "q-en");
      en.innerHTML = promptEnToHtml(item.promptEn);
      card.appendChild(en);
    }
    if (item.noteKo) card.appendChild($("div", "q-note", item.noteKo));
    // Blank = box rule notes (see README): never reveal the answer, only how to type it
    if (item.sharedAnswer) card.appendChild($("div", "q-note", "※ 두 빈칸에 공통으로 들어갈 한 단어를 한 번만 쓰세요."));
    if (item.phraseBlanks) card.appendChild($("div", "q-note", "※ 이 문항은 한 칸에 두 단어 이상을 쓸 수 있어요."));
  }

  function renderExampleCard(item) {
    var card = $("div", "q-card example-card");
    var head = $("div", "q-head");
    head.appendChild($("span", "q-num", itemDisplayLabel(item, 0) + " · 예시 (채점 안 함)"));
    card.appendChild(head);
    appendPromptLines(card, item);
    if (item.exampleAnswer) {
      card.appendChild($("div", "example-answer", "예시 답: " + item.exampleAnswer));
    }
    return card;
  }

  function renderMatchWidget(card, item, practiceId, matchStore) {
    var stateKey = item.id;
    if (!matchStore[stateKey]) {
      matchStore[stateKey] = { selectedLeft: null, links: {} };
    }
    var st = matchStore[stateKey];
    var rights = matchRightOrder(item, practiceId);
    var lefts = (item.pairs || []).map(function (p) {
      return p.left;
    });
    var wrap = $("div", "match-wrap");
    wrap.setAttribute("data-match-id", item.id);
    var cols = $("div", "match-cols");
    var colL = $("div", "match-col match-col-left");
    var colR = $("div", "match-col match-col-right");
    colL.appendChild($("div", "match-col-title", "왼쪽"));
    colR.appendChild($("div", "match-col-title", "오른쪽"));

    function pairIndexForLeft(leftVal) {
      if (!st.links[leftVal]) return 0;
      for (var i = 0; i < lefts.length; i++) {
        if (lefts[i] === leftVal) return i + 1;
      }
      return 0;
    }

    function refreshButtons() {
      colL.querySelectorAll(".match-btn-left").forEach(function (btn) {
        var lv = btn.getAttribute("data-value");
        var badge = btn.querySelector(".match-badge");
        var idx = pairIndexForLeft(lv);
        btn.classList.toggle("match-selected", st.selectedLeft === lv);
        btn.classList.toggle("match-linked", !!st.links[lv]);
        if (badge) {
          badge.textContent = idx ? String(idx) : "";
          badge.style.display = idx ? "" : "none";
        }
      });
      colR.querySelectorAll(".match-btn-right").forEach(function (btn) {
        var rv = btn.getAttribute("data-value");
        var used = false;
        var badgeNum = 0;
        Object.keys(st.links).forEach(function (lk) {
          if (st.links[lk] === rv) {
            used = true;
            badgeNum = pairIndexForLeft(lk);
          }
        });
        btn.classList.toggle("match-linked", used);
        var badge = btn.querySelector(".match-badge");
        if (badge) {
          badge.textContent = badgeNum ? String(badgeNum) : "";
          badge.style.display = badgeNum ? "" : "none";
        }
      });
    }

    lefts.forEach(function (lv) {
      var btn = $("button", "match-btn match-btn-left");
      btn.type = "button";
      btn.setAttribute("data-value", lv);
      btn.appendChild($("span", "match-badge", ""));
      btn.appendChild($("span", "match-label", lv));
      btn.onclick = function () {
        if (st.links[lv]) {
          delete st.links[lv];
          st.selectedLeft = lv;
        } else {
          st.selectedLeft = lv;
        }
        refreshButtons();
      };
      colL.appendChild(btn);
    });

    rights.forEach(function (rv) {
      var btn = $("button", "match-btn match-btn-right");
      btn.type = "button";
      btn.setAttribute("data-value", rv);
      btn.appendChild($("span", "match-badge", ""));
      btn.appendChild($("span", "match-label", rv));
      btn.onclick = function () {
        if (!st.selectedLeft) return;
        var sl = st.selectedLeft;
        Object.keys(st.links).forEach(function (lk) {
          if (st.links[lk] === rv) delete st.links[lk];
        });
        st.links[sl] = rv;
        st.selectedLeft = null;
        refreshButtons();
      };
      colR.appendChild(btn);
    });

    cols.appendChild(colL);
    cols.appendChild(colR);
    wrap.appendChild(cols);
    wrap.appendChild($("p", "match-hint", "왼쪽을 누른 다음 오른쪽을 눌러 연결하세요. 연결을 바꾸려면 왼쪽을 다시 누르세요."));
    card.appendChild(wrap);
    refreshButtons();
  }

  function renderQuestionCard(item, idx, practiceId, matchStore) {
    var card = $("div", "q-card");
    var head = $("div", "q-head");
    head.appendChild($("span", "q-num", itemDisplayLabel(item, idx)));
    appendModeChip(head, item.answerModeTag);
    card.appendChild(head);
    appendPromptLines(card, item);

    if (item.type === "match") {
      renderMatchWidget(card, item, practiceId || "", matchStore || {});
      return card;
    }

    if (item.type === "mc") {
      var opts = $("div", "mc-options");
      (item.choices || []).forEach(function (ch, ci) {
        var lab = document.createElement("label");
        var inp = document.createElement("input");
        inp.type = "radio";
        inp.name = item.id;
        inp.value = ch;
        inp.required = true;
        lab.appendChild(inp);
        lab.appendChild(document.createTextNode(" " + (item.choices.length > 2 ? ci + 1 + ". " : "") + ch));
        opts.appendChild(lab);
      });
      card.appendChild(opts);
    } else {
      var blanks = item.blanks || 1;
      var row = $("div", "blank-row");
      var ph = inputPlaceholder(item);
      if (blanks <= 1) {
        var inp = document.createElement("input");
        inp.type = "text";
        inp.name = item.id;
        inp.autocomplete = "off";
        inp.required = true;
        if (ph) inp.placeholder = ph;
        inp.setAttribute("aria-label", "Answer for " + itemDisplayLabel(item, idx));
        row.appendChild(inp);
      } else {
        var partLabels = item.blankPartLabels;
        for (var b = 0; b < blanks; b++) {
          var slot = $("label", "blank-slot");
          var lbl =
            partLabels && partLabels[b] != null && String(partLabels[b]).length
              ? String(partLabels[b])
              : String(b + 1);
          slot.appendChild($("span", "blank-num", lbl));
          var inp2 = document.createElement("input");
          inp2.type = "text";
          inp2.name = item.id + "_" + b;
          inp2.autocomplete = "off";
          inp2.required = true;
          if (ph) inp2.placeholder = ph;
          inp2.setAttribute("aria-label", "Answer part " + (b + 1));
          slot.appendChild(inp2);
          row.appendChild(slot);
        }
      }
      card.appendChild(row);
    }
    return card;
  }

  function walkPracticeItems(practice, onItem) {
    var lastSection = null;
    (practice.items || []).forEach(function (item, idx) {
      if (item.section) lastSection = item.section;
      onItem(item, idx, lastSection);
    });
  }

  function selfTestPracticeRender(practice) {
    var graded = 0;
    var examples = 0;
    var banners = 0;
    var last = null;
    (practice.items || []).forEach(function (item) {
      if (item.section && item.section !== last) {
        banners++;
        last = item.section;
      }
      if (item.displayOnly) examples++;
      else graded++;
    });
    return { graded: graded, examples: examples, banners: banners };
  }

  function parsePracticeRoute(parts) {
    if (parts[0] !== "p" || !parts[1]) return null;
    if (parts.length >= 4) {
      return { bookId: parts[1], unitId: parts[2], slug: parts[3] };
    }
    return { bookId: null, unitId: null, slug: parts[1] };
  }

  function route() {
    var hash = location.hash.replace(/^#/, "") || "/";
    var parts = hash.split("/").filter(Boolean);
    var pr = parsePracticeRoute(parts);
    if (pr) {
      renderPractice(pr);
      return;
    }
    if (parts[0] === "zap") {
      var zapBook = parseZapBookRoute(parts);
      if (zapBook) renderZapBook(zapBook);
      else renderZapIndex();
      return;
    }
    if (parts[0] === "chunilmun") {
      var unitId = chunilmunUnitFromRoute(parts);
      if (unitId) {
        renderChunilmunUnit(unitId);
      } else {
        renderChunilmunIndex();
      }
      return;
    }
    renderHomeHub();
  }

  function topbar(backHref, brandText, backLabel) {
    var bar = $("div", "topbar");
    if (backHref) {
      var label = backLabel;
      if (!label) {
        if (backHref === "#/") label = "← Home";
        else if (backHref === "#/chunilmun") label = "← Chapters";
        else if (backHref === "#/zap") label = "← ZAP books";
        else label = "← Back";
      }
      var a = $("a", "back-link", label);
      a.href = backHref;
      bar.appendChild(a);
    }
    bar.appendChild($("div", "brand", brandText || brandForBook(getSel(SEL_BOOK, "zap-green-1"))));
    var pill = $("span", "student-pill", studentLabel() || "Signed in");
    bar.appendChild(pill);
    return bar;
  }

  function renderHomeHub() {
    app.innerHTML = "";
    applyHubTheme();
    setDocumentTitle(HUB_TITLE);
    app.appendChild(topbar(null, "MRJ Grammar Practice Hub"));
    app.appendChild($("h1", null, "Choose your book series"));
    app.appendChild(
      $("p", "lead", "Two products live here: MRJ ZAP Grammar (Red · Blue · Green) and 천일문 Grammar from 쎄듀 CEDU. Pick one to continue.")
    );

    var stack = $("div", "hub-stack");

    var zapBlock = $("section", "hub-block hub-block-zap");
    zapBlock.appendChild($("h2", "hub-block-title", "ZAP Grammar Books"));
    zapBlock.appendChild(
      $("p", "hub-block-lead", "MRJ’s Red, Blue, and Green ZAP series — timed practice with your student book.")
    );
    var zapGo = document.createElement("a");
    zapGo.className = "hub-entry hub-entry-zap";
    zapGo.href = "#/zap";
    zapGo.appendChild($("span", "hub-entry-kicker", "MRJ · Kids & teens"));
    zapGo.appendChild($("span", "hub-entry-title", "ZAP Red · Blue · Green"));
    zapGo.appendChild($("span", "hub-entry-sub", "10 books · Walk / Run / Jump / Fly"));
    zapBlock.appendChild(zapGo);
    stack.appendChild(zapBlock);

    stack.appendChild($("div", "hub-divider", "Different publisher — not part of ZAP"));

    var cmBlock = $("section", "hub-block hub-block-chunilmun");
    cmBlock.appendChild($("h2", "hub-block-title", "천일문 Grammar 1"));
    cmBlock.appendChild($("p", "hub-block-lead", "쎄듀 CEDU · Student Book & Workbook · Chapters 01–12 + 총괄평가"));
    var cmGo = document.createElement("a");
    cmGo.className = "hub-entry hub-entry-chunilmun";
    cmGo.href = "#/chunilmun";
    cmGo.appendChild($("span", "hub-entry-kicker", "CEDU · Adult slate theme"));
    cmGo.appendChild($("span", "hub-entry-title", "천일문 Grammar 1"));
    cmGo.appendChild($("span", "hub-entry-sub", "Tap to open chapter list (SB / WB)"));
    cmBlock.appendChild(cmGo);
    stack.appendChild(cmBlock);

    app.appendChild(stack);
    app.appendChild(
      $("p", "note", "Timer: when time runs out, your answers are submitted automatically (you cannot change them after that).")
    );
  }

  function decorateChunilmunPick(link, unitId) {
    if (!progress || !unitId) return;
    var st = progress.unitStatusLabel(CHUNILMUN_BOOK, unitId);
    if (st === "locked") {
      link.classList.add("locked");
      link.addEventListener("click", function (e) {
        if (mrjTeacher()) return;
        e.preventDefault();
        alert("Finish the previous 천일문 set at 50%+ on every exercise to unlock this one.");
      });
      return;
    }
    if (st === "done") link.classList.add("is-done");
    else if (st === "retry") link.classList.add("needs-retry");
    var sum = progress.unitProgressSummary(CHUNILMUN_BOOK, unitId);
    if (sum.total) {
      link.title = (link.title ? link.title + " · " : "") + sum.done + "/" + sum.total + " done (≥50%)";
    }
  }

  function renderChunilmunIndex() {
    app.innerHTML = "";
    setSel(SEL_BOOK, CHUNILMUN_BOOK);
    applyBookTheme(CHUNILMUN_BOOK);
    setDocumentTitle("천일문 Grammar 1 · CEDU · MRJ Practice Hub");
    var bar = topbar("#/", "천일문 Grammar 1 · CEDU");
    app.appendChild(bar);
    app.appendChild($("h1", null, "천일문 Grammar 1"));
    app.appendChild(
      $("p", "lead", "Pick a chapter, then Student Book (SB) or Workbook (WB). Each opens that chapter’s practice list.")
    );

    var meta = chunilmunCatalog();
    var list = $("div", "cm-chapter-list");
    meta.chapters.forEach(function (ch) {
      var row = $("div", "cm-chapter-row");
      row.appendChild($("span", "cm-chapter-num", String(ch.n).padStart(2, "0")));
      var info = $("div", "cm-chapter-info");
      info.appendChild($("span", "cm-chapter-label", "Chapter " + ch.n));
      info.appendChild($("span", "cm-chapter-topic", ch.title));
      row.appendChild(info);
      var actions = $("div", "cm-chapter-actions");
      var sb = document.createElement("a");
      sb.className = "cm-pick cm-pick-sb";
      sb.href = "#/chunilmun/chapter-" + String(ch.n).padStart(2, "0") + "/sb";
      sb.textContent = "Student Book";
      var wb = document.createElement("a");
      wb.className = "cm-pick cm-pick-wb";
      wb.href = "#/chunilmun/chapter-" + String(ch.n).padStart(2, "0") + "/wb";
      wb.textContent = "Workbook";
      if (progress) {
        decorateChunilmunPick(sb, ch.sbId);
        decorateChunilmunPick(wb, ch.wbId);
      }
      actions.appendChild(sb);
      actions.appendChild(wb);
      row.appendChild(actions);
      list.appendChild(row);
    });
    app.appendChild(list);

    if (meta.reviews.length) {
      app.appendChild($("h2", "cm-reviews-title", "총괄평가"));
      var revWrap = $("div", "cm-review-list");
      meta.reviews.forEach(function (r) {
        var a = document.createElement("a");
        a.className = "cm-review-btn";
        a.href = "#/chunilmun/" + r.id;
        a.textContent = r.title.replace(/^Ch\s*\d+\s*/, "");
        if (progress) decorateChunilmunPick(a, r.id);
        revWrap.appendChild(a);
      });
      app.appendChild(revWrap);
    }

    app.appendChild(
      $("p", "note", "Not a ZAP book — 천일문 is published by 쎄듀 (CEDU). Use the SB/WB buttons so you always know which book you are in.")
    );
  }

  function renderChunilmunUnit(unitId) {
    setSel(SEL_BOOK, CHUNILMUN_BOOK);
    setSel(SEL_UNIT, unitId);
    var units = catalog.units[CHUNILMUN_BOOK] || [];
    var unitMeta = units.filter(function (u) {
      return u.id === unitId;
    })[0];
    var heading = unitMeta ? unitMeta.title : "천일문 · Practice";
    renderBookIndex({
      bookId: CHUNILMUN_BOOK,
      unitId: unitId,
      fixedUnitId: unitId,
      backHref: "#/chunilmun",
      pageTitle: "천일문 Grammar 1 · " + heading,
      heading: heading,
      lead: "3 · 연습 고르기 — tap a set below to start (timed).",
      bookFilter: function (b) {
        return b.id === CHUNILMUN_BOOK;
      },
      hideBookPicker: true,
      hideUnitPicker: true,
      chunilmunUnitBanner: true,
    });
  }

  function renderZapIndex() {
    var bookId = getSel(SEL_BOOK, "zap-green-1");
    if (isChunilmunBook(bookId)) {
      bookId = "zap-green-1";
      setSel(SEL_BOOK, bookId);
    }
    renderBookIndex({
      bookId: bookId,
      backHref: "#/",
      pageTitle: ZAP_HUB_TITLE,
      heading: "ZAP practice index",
      lead: "Choose your ZAP book, then a unit on the map. Exercises unlock in order at 50%+ (teacher can bypass).",
      bookFilter: function (b) {
        return isZapBook(b.id);
      },
    });
  }

  function renderZapBook(bookId) {
    if (!bookId || isChunilmunBook(bookId)) bookId = "zap-green-1";
    setSel(SEL_BOOK, bookId);
    var book = catalog.findBook(bookId);
    renderBookIndex({
      bookId: bookId,
      backHref: "#/zap",
      pageTitle: (book && book.title) || "ZAP",
      heading: (book && book.title) || "ZAP book",
      lead: "Unit map — finish each unit at 50%+ on every exercise to unlock the next.",
      bookFilter: function (b) {
        return isZapBook(b.id);
      },
      hideBookPicker: true,
    });
  }

  function renderBookIndex(opts) {
    opts = opts || {};
    app.innerHTML = "";
    var bookId = opts.bookId || getSel(SEL_BOOK, "zap-green-1");
    if (isChunilmunBook(bookId)) setSel(SEL_BOOK, bookId);
    applyBookTheme(bookId);
    setDocumentTitle(opts.pageTitle || brandForBook(bookId));
    app.appendChild(topbar(opts.backHref || null, brandForBook(bookId)));
    app.appendChild($("h1", null, opts.heading || "Practice index"));
    if (opts.lead) app.appendChild($("p", "lead", opts.lead));

    var unitId = opts.unitId || getSel(SEL_UNIT, isChunilmunBook(bookId) ? "chapter-01" : "unit-01");

    if (opts.chunilmunUnitBanner && unitId) {
      var kind = /^wb-/.test(unitId) ? "Workbook (WB)" : /^review-/.test(unitId) ? "총괄평가" : "Student Book (SB)";
      var banner = $("div", "cm-unit-banner");
      banner.appendChild($("span", "cm-unit-kind", kind));
      banner.appendChild(
        $("span", "cm-unit-hint", /^review-/.test(unitId) ? "Comprehensive review" : "Chapter practices only — switch SB/WB from the chapter list.")
      );
      app.appendChild(banner);
    }

    var panel = $("div", "panel");
    var grid = $("div", "grid-2");

    var bookField = $("div");
    if (!opts.hideBookPicker) {
      bookField.appendChild($("label", "field-label", "Book"));
    }
    var bookSel = $("select");
    catalog.books.forEach(function (b) {
      if (opts.bookFilter && !opts.bookFilter(b)) return;
      var opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = b.title + (b.enabled ? "" : " (coming soon)");
      opt.disabled = !b.enabled;
      if (b.id === bookId && b.enabled) opt.selected = true;
      bookSel.appendChild(opt);
    });
    if (!bookSel.value) {
      bookSel.value = "zap-green-1";
      bookId = "zap-green-1";
    }
    bookField.appendChild(bookSel);
    if (!opts.hideBookPicker) grid.appendChild(bookField);
    else {
      bookField.className = "pv-sr-only";
      grid.appendChild(bookField);
    }

    var unitField = $("div");
    if (!opts.hideUnitPicker) unitField.appendChild($("label", "field-label", "Unit"));
    var unitSel = $("select");
    var units = catalog.units[bookId] || [];
    if (opts.fixedUnitId) {
      units = units.filter(function (u) {
        return u.id === opts.fixedUnitId;
      });
    }
    units.forEach(function (u) {
      var opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.title + (u.enabled ? "" : " (coming soon)");
      opt.disabled = !u.enabled;
      if (progress && u.enabled && !progress.isUnitIdUnlocked(bookId, u.id)) {
        opt.disabled = true;
        opt.textContent = u.title + " (locked)";
      }
      if (u.id === unitId && u.enabled) opt.selected = true;
      unitSel.appendChild(opt);
    });
    unitField.appendChild(unitSel);
    if (!opts.hideUnitPicker) grid.appendChild(unitField);
    else {
      unitField.className = "pv-sr-only";
      grid.appendChild(unitField);
    }

    panel.appendChild(grid);

    var listTitle = $("h2", null, "Exercises");
    listTitle.style.fontSize = "1.15rem";
    listTitle.style.marginTop = "1rem";
    panel.appendChild(listTitle);

    var list = $("div", "exercise-list");
    function fillExercises() {
      list.innerHTML = "";
      var key = catalog.unitKey(bookId, unitId);
      var exs = catalog.exercises[key] || [];
      if (progress && !progress.isUnitIdUnlocked(bookId, unitId)) {
        list.appendChild(
          $("p", "note", "This unit is locked. Finish every exercise in the previous unit at 50% or higher to continue.")
        );
        return;
      }
      if (!exs.length) {
        list.appendChild($("p", "note", "No exercises for this unit yet."));
        return;
      }
      exs.forEach(function (ex, index) {
        var btn = document.createElement("a");
        btn.className = "exercise-btn";
        btn.href = practiceHref(bookId, unitId, ex.slug);
        var title = $("span", null, ex.title);
        btn.appendChild(title);
        btn.appendChild($("span", "hint", ex.hint));
        applyExerciseLock(btn, bookId, unitId, ex, index);
        list.appendChild(btn);
      });
    }

    bookSel.onchange = function () {
      bookId = bookSel.value;
      setSel(SEL_BOOK, bookId);
      applyBookTheme(bookId);
      if (!opts.hideBookPicker && isZapBook(bookId)) {
        try {
          location.hash = "#/zap/" + bookId;
        } catch (e) {}
      }
      units = catalog.units[bookId] || [];
      unitSel.innerHTML = "";
      units.forEach(function (u) {
        var opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.title + (u.enabled ? "" : " (coming soon)");
        opt.disabled = !u.enabled;
        if (progress && u.enabled && !progress.isUnitIdUnlocked(bookId, u.id)) {
          opt.disabled = true;
          opt.textContent = u.title + " (locked)";
        }
        unitSel.appendChild(opt);
      });
      unitId = unitSel.value;
      if (!unitId || (progress && !progress.isUnitIdUnlocked(bookId, unitId))) {
        var firstOpen = units.filter(function (u) {
          return u.enabled && (!progress || progress.isUnitIdUnlocked(bookId, u.id));
        })[0];
        unitId = firstOpen ? firstOpen.id : units[0] && units[0].id;
        if (unitId) unitSel.value = unitId;
      }
      setSel(SEL_UNIT, unitId);
      fillExercises();
      var brandEl = app.querySelector(".brand");
      if (brandEl) brandEl.textContent = brandForBook(bookId);
    };

    unitSel.onchange = function () {
      unitId = unitSel.value;
      setSel(SEL_UNIT, unitId);
      fillExercises();
    };

    fillExercises();
    panel.appendChild(list);
    app.appendChild(panel);

    var links = $("div", "links-row");
    var res = $("a", null, "Results (coming soon)");
    res.href = "#/results";
    res.onclick = function (e) {
      e.preventDefault();
      alert("Results overview (Index 2) will be added later.");
    };
    links.appendChild(res);
    app.appendChild(links);

    app.appendChild(
      $("p", "note", "Timer: when time runs out, your answers are submitted automatically (you cannot change them after that).")
    );
  }

  function loadPractice(routeInfo) {
    var bookId = routeInfo.bookId || getSel(SEL_BOOK, "zap-green-1");
    var unitId = routeInfo.unitId || getSel(SEL_UNIT, "unit-01");
    if (routeInfo.bookId) {
      setSel(SEL_BOOK, bookId);
      setSel(SEL_UNIT, unitId);
    }
    var meta = catalog.findExercise(bookId, unitId, routeInfo.slug);
    if (!meta) return Promise.reject(new Error("Unknown exercise"));
    return fetch(meta.data, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (data) {
        data._meta = Object.assign({}, meta, { bookId: bookId, unitId: unitId });
        if (!data.practiceId && meta.practiceId) data.practiceId = meta.practiceId;
        return data;
      });
  }

  function renderPractice(routeInfo) {
    var bookId = routeInfo.bookId || getSel(SEL_BOOK, "zap-green-1");
    var unitId = routeInfo.unitId || getSel(SEL_UNIT, "unit-01");
    var slug = routeInfo.slug;
    if (progress && slug && !mrjTeacher()) {
      var gate = progress.canOpenExercise(bookId, unitId, slug);
      if (!gate.ok) {
        applyBookTheme(bookId);
        app.innerHTML = "";
        app.appendChild(topbar(indexBackHref(bookId), brandForBook(bookId)));
        app.appendChild($("h1", null, "Practice locked"));
        app.appendChild(
          $("p", "lead", gate.reason === "unit_locked"
            ? "This unit is still locked. Finish the previous unit at 50%+ on every exercise first."
            : "This exercise is locked. Finish the previous exercise at 50%+ before continuing.")
        );
        var back = $("a", "btn btn-primary", "Back to unit list");
        back.href = indexBackHref(bookId);
        app.appendChild(back);
        return;
      }
    }
    applyBookTheme(bookId);
    app.innerHTML = "";
    app.appendChild(topbar(indexBackHref(bookId), brandForBook(bookId)));
    app.appendChild($("p", "lead", "Loading…"));
    loadPractice(routeInfo)
      .then(function (practice) {
        startPracticeUI(practice, routeInfo);
      })
      .catch(function () {
        app.innerHTML = "";
        app.appendChild(topbar(indexBackHref(bookId), brandForBook(bookId)));
        app.appendChild($("p", "lead", "Could not load this practice."));
      });
  }

  function startPracticeUI(practice, routeInfo) {
    var bookId = (practice._meta && practice._meta.bookId) || getSel(SEL_BOOK, "zap-green-1");
    applyBookTheme(bookId);
    var unitId = (practice._meta && practice._meta.unitId) || getSel(SEL_UNIT, "unit-01");
    var slug = routeInfo.slug || (practice._meta && practice._meta.slug);
    var practiceId = engine.practiceIdOf(practice);

    app.innerHTML = "";
    app.appendChild(topbar(indexBackHref(bookId), brandForBook(bookId)));
    app.appendChild($("h1", null, practice.title));
    if (practice.subtitle) app.appendChild($("p", "lead", practice.subtitle + (practice.pages ? " · p. " + practice.pages : "")));

    if (engine.mustRetry(practiceId)) {
      app.appendChild(
        $("p", "note", "Your last score was below 50%. Please complete this practice again.")
      );
    }

    if (review && engine.mustRetry(practiceId)) {
      var prev = review.loadLastReview(practice);
      if (prev && prev.results && prev.responses) {
        var prevPanel = review.renderWrongReviewPanel(document, practice, prev.responses, prev.results, {
          heading: "지난 시도에서 틀린 문제",
          lead: mrjTeacher()
            ? "아래는 지난번에 쓴 답입니다. Teacher mode: correct answers are shown."
            : "아래는 지난번에 쓴 답입니다. 정답은 화면에 나오지 않습니다. 다시 풀어 보세요.",
          showCorrectAnswers: mrjTeacher(),
        });
        if (prevPanel) app.appendChild(prevPanel);
      }
    }

    renderPracticeIntro(practice);
    clearStaleDrafts(practice);

    var timerSec = (practice.timerMinutes || 15) * 60;
    var startedAt = Date.now();
    var locked = false;
    var timerEl = $("div", "timer-bar");
    var timerText = $("span", null, "");
    timerEl.appendChild(timerText);
    timerEl.appendChild($("span", null, "Pass: 80%+"));

    function fmt(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    var remain = timerSec;
    timerText.textContent = "Time left: " + fmt(remain);
    app.appendChild(timerEl);

    var form = $("form");
    var matchStore = {};
    if (practice.wordBank && practice.wordBank.length && !practiceUsesSectionWordBanks(practice)) {
      appendWordBankEl(form, practice.wordBank);
    }

    var items = practice.items.filter(function (it) {
      return !it.displayOnly;
    });

    var lastSection = null;
    (practice.items || []).forEach(function (item, idx) {
      lastSection = appendSectionBanner(form, item, practice, lastSection);
      if (item.displayOnly || item.example) {
        form.appendChild(renderExampleCard(item));
        return;
      }
      form.appendChild(renderQuestionCard(item, idx, practiceId, matchStore));
    });

    var actions = $("div", "actions");
    var submitBtn = $("button", "btn btn-primary", "Submit");
    submitBtn.type = "submit";
    actions.appendChild(submitBtn);
    form.appendChild(actions);
    app.appendChild(form);

    function lockForm() {
      if (mrjTeacher()) return;
      locked = true;
      submitBtn.disabled = true;
      form.querySelectorAll("input, select, button, .match-btn").forEach(function (el) {
        el.disabled = true;
      });
      timerEl.classList.add("low");
      timerText.textContent = "Time's up — submitted";
    }

    function collectResponses() {
      var responses = {};
      items.forEach(function (item) {
        if (item.type === "match") {
          var st = matchStore[item.id] || { links: {} };
          responses[item.id] = { links: Object.assign({}, st.links) };
        } else if (item.type === "mc") {
          var picked = form.querySelector('input[name="' + item.id + '"]:checked');
          responses[item.id] = { value: picked ? picked.value : "" };
        } else {
          var blanks = item.blanks || 1;
          if (blanks > 1) {
            var parts = [];
            for (var b = 0; b < blanks; b++) {
              var el = form.querySelector('[name="' + item.id + "_" + b + '"]');
              parts.push(el ? el.value : "");
            }
            responses[item.id] = { parts: parts, value: parts.join(" ") };
          } else {
            var el2 = form.querySelector('[name="' + item.id + '"]');
            responses[item.id] = { value: el2 ? el2.value : "" };
          }
        }
      });
      return responses;
    }

    function showResults(outcome, responses) {
      form.remove();
      timerEl.remove();
      var panel = $("div", "panel result-panel" + (outcome.mustRetry ? " fail-retry" : ""));
      panel.appendChild(
        $("h2", null, "Score: " + outcome.correct + " / " + outcome.max + " (" + outcome.pct + "%)")
      );
      var status = outcome.passed ? "Pass (80%+)" : "Keep practicing";
      if (outcome.mustRetry) status = "Please try this exercise again (under 50%).";
      panel.appendChild($("p", null, status));

      var resultById = {};
      outcome.results.forEach(function (r) {
        resultById[r.id] = r;
      });
      var groupKey = null;
      var groupLine = null;
      items.forEach(function (item, idx) {
        var secTitle = sectionBannerTitle(item, practice) || "Items";
        var key = (item.section || "") + "\0" + secTitle;
        if (key !== groupKey) {
          groupKey = key;
          groupLine = $("p", "result-section-line", secTitle + ": ");
          panel.appendChild(groupLine);
        }
        groupLine.appendChild(document.createTextNode(itemDisplayLabel(item, idx) + " "));
        var r = resultById[item.id];
        var mark = $("span", r && r.correct ? "mark-ok" : "mark-bad", r && r.correct ? "✓" : "✗");
        groupLine.appendChild(mark);
        groupLine.appendChild(document.createTextNode(" "));
      });

      if (review) {
        review.saveLastReview(practice, responses, outcome.results);
        var reviewEl = review.renderWrongReviewPanel(document, practice, responses, outcome.results, {
          heading: "틀린 문제 다시 보기",
          lead: mrjTeacher()
            ? "Teacher mode: your answer and the correct answer are shown below."
            : "내가 쓴 답만 보입니다. 정답은 화면에 나오지 않습니다.",
          showCorrectAnswers: mrjTeacher(),
        });
        if (reviewEl) panel.appendChild(reviewEl);
      }

      if (!mrjTeacher()) {
        panel.appendChild(
          $("p", "note", "Correct answers are not shown on screen. Check your book or ask your teacher.")
        );
      }
      app.appendChild(panel);

      var again = $("a", "btn btn-secondary", isChunilmunBook(bookId) ? "Back to chapter list" : "Back to ZAP index");
      again.href = indexBackHref(bookId);
      again.style.display = "inline-flex";
      again.style.alignItems = "center";
      app.appendChild(again);
      if (outcome.mustRetry) {
        var retry = $("a", "btn btn-primary", "Try again");
        retry.href = practiceHref(bookId, unitId, slug);
        retry.style.marginLeft = "0.5rem";
        retry.style.display = "inline-flex";
        app.appendChild(retry);
      }
    }

    function matchComplete() {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.type !== "match") continue;
        var st = matchStore[it.id] || { links: {} };
        var need = (it.pairs || []).length;
        var have = Object.keys(st.links).length;
        if (have < need) return false;
      }
      return true;
    }

    function doSubmit() {
      if (locked && form.dataset.submitted) return;
      if (!matchComplete()) {
        alert("짝 맞추기 문제에서 모든 왼쪽 항목을 연결해 주세요.");
        return;
      }
      form.dataset.submitted = "1";
      var responses = collectResponses();
      var outcome = engine.scorePractice(practice, responses, startedAt);
      showResults(outcome, responses);
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      if (!matchComplete()) {
        alert("짝 맞추기 문제에서 모든 왼쪽 항목을 연결해 주세요.");
        return;
      }
      if (!locked) lockForm();
      doSubmit();
    };

    var tick = setInterval(function () {
      if (mrjTeacher()) return;
      if (locked) return;
      remain--;
      timerText.textContent = "Time left: " + fmt(remain);
      if (remain <= 60) timerEl.classList.add("low");
      if (remain <= 0) {
        clearInterval(tick);
        lockForm();
        doSubmit();
      }
    }, 1000);
  }

  var appExports = {
    introKoForPractice: introKoForPractice,
    sectionBannerTitle: sectionBannerTitle,
    sectionBannerInstruction: sectionBannerInstruction,
    selfTestPracticeRender: selfTestPracticeRender,
    renderExampleCard: renderExampleCard,
    renderQuestionCard: renderQuestionCard,
    appendSectionBanner: appendSectionBanner,
  };
  if (typeof module === "object" && module.exports) {
    module.exports = appExports;
  }

  if (!app) return;

  document.addEventListener("mrj-teacher", route);
  document.addEventListener("mrj-pack-updated", route);
  window.addEventListener("hashchange", route);
  document.addEventListener("mrj-auth-ready", route);
  if (document.readyState !== "loading") route();
  else document.addEventListener("DOMContentLoaded", route);
})();
