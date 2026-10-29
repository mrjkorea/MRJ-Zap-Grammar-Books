/**
 * Zap teacher tools (start point, lock bypass) — unlocked only via shared mrj-auth chip
 * (.mrj-auth-teacher-btn + study_teacher_check). No duplicate Teacher button or PIN UI.
 */
(function (root) {
  "use strict";

  var BUILD = "20261030-chip-teacher-only";
  var panelBookId = "";
  var chipClickBound = false;
  var lastActive = null;

  function auth() {
    return root.MRJ_AUTH || root.MRJSignin || null;
  }

  function progressApi() {
    return root.MRJ_ZAP_PROGRESS;
  }

  function packApi() {
    return root.MRJ_GREENZAP_PACK;
  }

  function catalogApi() {
    return root.MRJ_CATALOG;
  }

  function studentId() {
    var a = auth();
    return a && a.student ? String(a.student() || "").trim() : "";
  }

  function serverTeacher() {
    try {
      var a = auth();
      return !!(a && typeof a.isTeacher === "function" && a.isTeacher());
    } catch (e) {
      return false;
    }
  }

  function isActive() {
    return serverTeacher();
  }

  function dispatchTeacherEvent() {
    try {
      var ev;
      try {
        ev = new root.CustomEvent("mrj-teacher", { detail: { id: studentId(), unlocked: isActive() } });
      } catch (ignore) {
        ev = root.document.createEvent("Event");
        ev.initEvent("mrj-teacher", true, true);
      }
      root.document.dispatchEvent(ev);
    } catch (e2) {}
  }

  function syncChrome() {
    var active = isActive();
    try {
      if (root.document && root.document.body) {
        root.document.body.classList.toggle("mrj-zap-teacher-active", active);
      }
    } catch (e) {}
    if (lastActive !== active) {
      lastActive = active;
      dispatchTeacherEvent();
    }
    layoutPanel();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function teacherCheck(pin) {
    var a = auth();
    if (!a || !a.ENDPOINT) {
      return Promise.resolve({ ok: false, message: "Sign-in is not loaded." });
    }
    if (!studentId()) {
      return Promise.resolve({ ok: false, message: "Sign the student in first." });
    }
    function authField(field) {
      return typeof field === "function" ? field() : field;
    }
    return fetch(a.ENDPOINT, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "study_teacher_check",
        pin: String(pin == null ? "" : pin).trim(),
        id: authField(a.student),
        token: authField(a.token),
      }),
    })
      .then(function (r) {
        return r.text();
      })
      .then(function (text) {
        var trimmed = String(text == null ? "" : text).trim();
        if (!trimmed || (trimmed.charAt(0) !== "{" && trimmed.charAt(0) !== "[")) {
          return { ok: false, message: "Unexpected server response." };
        }
        try {
          return JSON.parse(trimmed);
        } catch (e) {
          return { ok: false, message: "Unexpected server response." };
        }
      })
      .catch(function () {
        return { ok: false, message: "Network error." };
      })
      .then(function (r) {
        if (r && r.error === "bad_action") {
          return {
            ok: false,
            message:
              "Teacher check is not on the deployed auth backend yet. Redeploy mrj-signin Code.gs (study_teacher_check + STUDY_TEACHER_PIN script property).",
          };
        }
        if (r && r.ok === true) return { ok: true, message: "" };
        var msg = (r && r.message) || "Wrong PIN.";
        if (r && r.error === "locked") msg = r.message || msg;
        return { ok: false, message: msg };
      });
  }

  var anchorEl, panelEl;
  var packListenerBound = false;

  function ensureDom() {
    if (anchorEl || !root.document || !root.document.body) return;
    anchorEl = root.document.createElement("div");
    anchorEl.id = "mrj-zap-teacher-bar";
    anchorEl.setAttribute("aria-live", "polite");

    panelEl = root.document.createElement("div");
    panelEl.id = "mrj-zap-teacher-panel";
    panelEl.className = "mrj-zap-teacher-panel";
    panelEl.hidden = true;

    anchorEl.appendChild(panelEl);
    root.document.body.appendChild(anchorEl);

    root.addEventListener("resize", layoutPanel);
    root.addEventListener("orientationchange", layoutPanel);
  }

  function layoutPanel() {
    if (!anchorEl) return;
    var chip = root.document.getElementById("mrj-auth-student-chip");
    if (!chip || chip.hidden || !studentId()) {
      anchorEl.hidden = true;
      return;
    }
    var rect = chip.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      anchorEl.hidden = true;
      return;
    }
    anchorEl.hidden = false;
    var gap = 8;
    var top = rect.top;
    var right = root.innerWidth - rect.left + gap;
    anchorEl.style.top = top + "px";
    anchorEl.style.right = right + "px";
  }

  function closePanel() {
    if (!panelEl) return;
    panelEl.hidden = true;
  }

  function defaultPanelBookId() {
    var prog = progressApi();
    if (prog && typeof prog.enabledBooks === "function") {
      var books = prog.enabledBooks();
      if (books.length) return books[0].id;
    }
    var cat = catalogApi();
    if (cat && cat.books && cat.books.length) {
      for (var i = 0; i < cat.books.length; i++) {
        if (cat.books[i].enabled) return cat.books[i].id;
      }
    }
    return "zap-green-1";
  }

  function bookTitle(bookId) {
    var cat = catalogApi();
    if (cat && typeof cat.findBook === "function") {
      var b = cat.findBook(bookId);
      if (b) return b.appName || b.title || bookId;
    }
    return bookId;
  }

  function startPointSummary(bookId) {
    var prog = progressApi();
    if (!prog || typeof prog.getStartPoint !== "function") return null;
    var sp = prog.getStartPoint(bookId);
    if (!sp) return null;
    if (typeof prog.pathRowLabel === "function") {
      var cat = catalogApi();
      var unitTitle = sp.unitId;
      if (cat && cat.units && cat.units[bookId]) {
        cat.units[bookId].forEach(function (u) {
          if (u.id === sp.unitId) unitTitle = u.title || u.id;
        });
      }
      var exTitle = sp.exerciseSlug;
      if (cat && typeof cat.findExercise === "function") {
        var ex = cat.findExercise(bookId, sp.unitId, sp.exerciseSlug);
        if (ex) exTitle = ex.title || ex.slug;
      }
      return prog.pathRowLabel({
        unitTitle: unitTitle,
        exTitle: exTitle,
        unitId: sp.unitId,
        slug: sp.exerciseSlug,
      });
    }
    return sp.unitId + " · " + sp.exerciseSlug;
  }

  function confirmSetStartPoint(bookId, row, who) {
    var prog = progressApi();
    var label =
      prog && typeof prog.pathRowLabel === "function"
        ? prog.pathRowLabel(row)
        : row.unitTitle + " · " + row.exTitle;
    var existing = startPointSummary(bookId);
    var msg =
      label +
      " will be the next open exercise for " +
      who +
      " in " +
      bookTitle(bookId) +
      ".\n\nEverything before it counts as done for locks. Normal 50% gates apply from here onward.";
    if (existing) {
      msg += "\n\nCurrent start: " + existing + ".";
    }
    msg += "\n\nSet this start point?";
    return root.confirm(msg);
  }

  function renderStartPointPath(bookId, who) {
    var pathHost = panelEl.querySelector(".mrj-zap-teacher-path");
    if (!pathHost) return;
    var prog = progressApi();
    if (!prog || typeof prog.unitGroupsForBook !== "function") {
      pathHost.innerHTML = '<p class="mrj-zap-teacher-err">Progress module not loaded.</p>';
      return;
    }
    var nextIdx = typeof prog.studentNextPathIndex === "function" ? prog.studentNextPathIndex(bookId) : -1;
    var startIdx = typeof prog.startPathIndex === "function" ? prog.startPathIndex(bookId) : -1;
    var groups = prog.unitGroupsForBook(bookId);
    var html = "";
    groups.forEach(function (group, gi) {
      var openAttr = gi < 3 ? " open" : "";
      html += '<details class="mrj-zap-teacher-unit"' + openAttr + ">";
      html += '<summary class="mrj-zap-teacher-unit-sum">' + esc(group.unitTitle) + "</summary>";
      html += '<ul class="mrj-zap-teacher-rows">';
      group.rows.forEach(function (row) {
        var classes = ["mrj-zap-teacher-row"];
        if (row.pathIndex === nextIdx) classes.push("is-current");
        if (startIdx >= 0 && row.pathIndex === startIdx) classes.push("is-start-at");
        if (startIdx >= 0 && row.pathIndex < startIdx) classes.push("is-skipped");
        html += '<li class="' + classes.join(" ") + '">';
        html += '<span class="mrj-zap-teacher-row-label">' + esc(row.exTitle) + "</span>";
        html +=
          '<button type="button" class="mrj-zap-teacher-set" data-unit="' +
          esc(row.unitId) +
          '" data-slug="' +
          esc(row.slug) +
          '" data-practice="' +
          esc(row.practiceId) +
          '">Open up to here</button>';
        html += "</li>";
      });
      html += "</ul></details>";
    });
    pathHost.innerHTML = html;
    pathHost.querySelectorAll(".mrj-zap-teacher-set").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var unitId = btn.getAttribute("data-unit");
        var slug = btn.getAttribute("data-slug");
        var practiceId = btn.getAttribute("data-practice");
        var row = null;
        groups.forEach(function (g) {
          g.rows.forEach(function (r) {
            if (r.unitId === unitId && r.slug === slug) row = r;
          });
        });
        if (!row) return;
        if (!confirmSetStartPoint(bookId, row, who)) return;
        var pack = packApi();
        if (!pack || typeof pack.setStartPoint !== "function") {
          alert("Pack save is not available.");
          return;
        }
        btn.disabled = true;
        pack.setStartPoint(bookId, unitId, slug, practiceId).then(function (res) {
          btn.disabled = false;
          if (!res || !res.ok) {
            alert("Could not save start point.");
            return;
          }
          dispatchTeacherEvent();
          renderStartPointMeta(bookId);
          renderStartPointPath(bookId, who);
        });
      });
    });
  }

  function renderStartPointMeta(bookId) {
    var meta = panelEl.querySelector(".mrj-zap-teacher-start-meta");
    if (!meta) return;
    var summary = startPointSummary(bookId);
    if (summary) {
      meta.innerHTML =
        'Saved start for this book: <strong>' +
        esc(summary) +
        '</strong> <button type="button" class="mrj-zap-teacher-clear-start">Clear start point</button>';
      var clearBtn = meta.querySelector(".mrj-zap-teacher-clear-start");
      if (clearBtn) {
        clearBtn.onclick = function () {
          if (!root.confirm("Clear the saved start point for " + bookTitle(bookId) + "? Locks return to normal progress from exercise 1.")) {
            return;
          }
          var pack = packApi();
          if (!pack || typeof pack.clearStartPoint !== "function") return;
          pack.clearStartPoint(bookId).then(function () {
            dispatchTeacherEvent();
            renderStartPointMeta(bookId);
            renderStartPointPath(bookId, studentId());
          });
        };
      }
    } else {
      meta.innerHTML = "No saved start point for this book yet. Pick where the student should begin.";
    }
  }

  function bindPanelBookPicker(who) {
    var sel = panelEl.querySelector(".mrj-zap-teacher-book");
    if (!sel) return;
    sel.onchange = function () {
      panelBookId = sel.value;
      renderStartPointMeta(panelBookId);
      renderStartPointPath(panelBookId, who);
    };
  }

  function bindPackRefresh(who) {
    if (packListenerBound) return;
    packListenerBound = true;
    root.document.addEventListener("mrj-pack-updated", function () {
      if (!panelEl || panelEl.hidden || !isActive()) return;
      renderStartPointMeta(panelBookId || defaultPanelBookId());
      renderStartPointPath(panelBookId || defaultPanelBookId(), who);
    });
  }

  function buildBookOptions(selectedId) {
    var prog = progressApi();
    var books =
      prog && typeof prog.enabledBooks === "function"
        ? prog.enabledBooks()
        : (catalogApi() && catalogApi().books) || [];
    var html = "";
    books.forEach(function (b) {
      if (!b.enabled) return;
      html +=
        '<option value="' +
        esc(b.id) +
        '"' +
        (b.id === selectedId ? " selected" : "") +
        ">" +
        esc(b.appName || b.title || b.id) +
        "</option>";
    });
    return html;
  }

  function openTeacherMenu(who) {
    if (!isActive()) return;
    panelBookId = panelBookId || defaultPanelBookId();
    panelEl.hidden = false;
    panelEl.classList.add("mrj-zap-teacher-panel--menu");
    panelEl.innerHTML =
      '<div class="mrj-zap-teacher-panel-head">' +
      '<strong>Teacher mode</strong>' +
      '<button type="button" class="mrj-zap-teacher-close" aria-label="Close">✕</button>' +
      "</div>" +
      '<p class="mrj-zap-teacher-student">Student: <span>' +
      esc(who) +
      "</span></p>" +
      '<section class="mrj-zap-teacher-section">' +
      '<h3 class="mrj-zap-teacher-section-title">While teacher mode is on</h3>' +
      '<p class="mrj-zap-teacher-hint">All exercises stay unlocked in this tab. Review shows correct answers. Exit teacher mode to see the student\'s real locks again.</p>' +
      '<button type="button" class="mrj-zap-teacher-lock">Lock / exit teacher mode</button>' +
      "</section>" +
      '<section class="mrj-zap-teacher-section mrj-zap-teacher-section-start">' +
      '<h3 class="mrj-zap-teacher-section-title">Set start point</h3>' +
      '<p class="mrj-zap-teacher-hint">Choose where this student begins in a book. Earlier steps count as done after you exit teacher mode. Progress saves to their pack (server when sign-in sync is ready).</p>' +
      '<label class="mrj-zap-teacher-field mrj-zap-teacher-book-field">Book<select class="mrj-zap-teacher-book">' +
      buildBookOptions(panelBookId) +
      "</select></label>" +
      '<p class="mrj-zap-teacher-start-meta"></p>' +
      '<div class="mrj-zap-teacher-path" aria-label="Book path"></div>' +
      "</section>";
    panelEl.querySelector(".mrj-zap-teacher-close").onclick = closePanel;
    panelEl.querySelector(".mrj-zap-teacher-lock").onclick = exitTeacherMode;
    bindPanelBookPicker(who);
    bindPackRefresh(who);
    renderStartPointMeta(panelBookId);
    renderStartPointPath(panelBookId, who);
    layoutPanel();
  }

  function exitTeacherMode() {
    closePanel();
    if (!serverTeacher()) {
      syncChrome();
      return;
    }
    unbindChipTeacherClick();
    var btn = root.document.querySelector(".mrj-auth-teacher-btn");
    if (btn) btn.click();
    bindChipTeacherClick();
    syncChrome();
  }

  function onTeacherMenuToggle() {
    ensureDom();
    if (!serverTeacher()) return;
    if (!panelEl.hidden) {
      closePanel();
      return;
    }
    openTeacherMenu(studentId());
  }

  function onChipTeacherClick(ev) {
    if (!ev || !ev.target || !ev.target.closest) return;
    if (!ev.target.closest(".mrj-auth-teacher-btn")) return;
    if (!serverTeacher()) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    onTeacherMenuToggle();
  }

  function bindChipTeacherClick() {
    if (chipClickBound || !root.document) return;
    chipClickBound = true;
    root.document.addEventListener("click", onChipTeacherClick, true);
  }

  function unbindChipTeacherClick() {
    if (!chipClickBound || !root.document) return;
    root.document.removeEventListener("click", onChipTeacherClick, true);
    chipClickBound = false;
  }

  function onAuthReady() {
    syncChrome();
    layoutPanel();
  }

  function onMrjTeacherFromAuth() {
    syncChrome();
    if (serverTeacher() && studentId()) {
      openTeacherMenu(studentId());
    }
  }

  function boot() {
    ensureDom();
    bindChipTeacherClick();
    onAuthReady();
    try {
      var chip = root.document.getElementById("mrj-auth-student-chip");
      if (chip && root.MutationObserver) {
        var mo = new root.MutationObserver(function () {
          layoutPanel();
        });
        mo.observe(chip, { attributes: true, childList: true, characterData: true, subtree: true });
      }
    } catch (e) {}
  }

  if (root.document) {
    root.document.addEventListener("mrj-auth-ready", onAuthReady);
    root.document.addEventListener("mrj-teacher", onMrjTeacherFromAuth);
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }

  root.MRJ_ZAP_TEACHER = {
    BUILD: BUILD,
    isActive: isActive,
    teacherCheck: teacherCheck,
    layout: layoutPanel,
  };
})(typeof window !== "undefined" ? window : globalThis);
