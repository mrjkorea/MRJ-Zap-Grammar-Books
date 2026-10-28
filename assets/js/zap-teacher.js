/**
 * Teacher PIN unlock beside MRJ student chip (study_teacher_check — never hardcoded PIN).
 * After unlock: set per-student start points (persisted in greenzap pack.startPoints).
 */
(function (root) {
  "use strict";

  var SESSION_KEY = "gz.teacherUnlock";
  var BUILD = "20261028-teacher-start-point";
  var panelBookId = "";

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

  function readUnlock() {
    try {
      var raw = root.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.student) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function pinUnlocked() {
    var who = studentId();
    if (!who) return false;
    var saved = readUnlock();
    return !!(saved && saved.student === who);
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
    return serverTeacher() || pinUnlocked();
  }

  function setUnlocked(on) {
    try {
      if (on) {
        var who = studentId();
        if (!who) return;
        root.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ student: who, at: Date.now() }));
      } else {
        root.sessionStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
    syncChrome();
    dispatchTeacherEvent();
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
    try {
      if (root.document && root.document.body) {
        root.document.body.classList.toggle("mrj-zap-teacher-active", isActive());
      }
    } catch (e) {}
    updateUi();
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
    return fetch(a.ENDPOINT, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "study_teacher_check",
        pin: pin,
        id: a.student && a.student(),
        token: a.token && a.token(),
      }),
    })
      .then(function (r) {
        return r.json();
      })
      .catch(function () {
        return { ok: false, message: "Network error." };
      })
      .then(function (r) {
        if (r && r.error === "bad_action") {
          return {
            ok: false,
            message: "Teacher check is not on the server yet (deploy backend/teacher-unlock.patch).",
          };
        }
        return r || { ok: false, message: "Wrong PIN." };
      });
  }

  var barEl, btnEl, panelEl;
  var packListenerBound = false;

  function ensureDom() {
    if (barEl || !root.document || !root.document.body) return;
    barEl = root.document.createElement("div");
    barEl.id = "mrj-zap-teacher-bar";
    barEl.setAttribute("aria-live", "polite");

    btnEl = root.document.createElement("button");
    btnEl.type = "button";
    btnEl.id = "mrj-zap-teacher-btn";
    btnEl.className = "mrj-zap-teacher-btn";
    btnEl.textContent = "Teacher";
    btnEl.addEventListener("click", onTeacherBtnClick);

    panelEl = root.document.createElement("div");
    panelEl.id = "mrj-zap-teacher-panel";
    panelEl.className = "mrj-zap-teacher-panel";
    panelEl.hidden = true;

    barEl.appendChild(btnEl);
    barEl.appendChild(panelEl);
    root.document.body.appendChild(barEl);

    root.addEventListener("resize", layoutBar);
    root.addEventListener("orientationchange", layoutBar);
  }

  function layoutBar() {
    if (!barEl) return;
    var chip = root.document.getElementById("mrj-auth-student-chip");
    if (!chip || chip.hidden) {
      barEl.hidden = true;
      return;
    }
    var rect = chip.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      barEl.hidden = true;
      return;
    }
    barEl.hidden = false;
    var gap = 8;
    var top = rect.top;
    var right = root.innerWidth - rect.left + gap;
    barEl.style.top = top + "px";
    barEl.style.right = right + "px";
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
    var row = { unitId: sp.unitId, slug: sp.exerciseSlug, practiceId: sp.practiceId };
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

  function openUnlockPanel() {
    var who = studentId();
    if (!who) {
      alert("Sign the student in first.");
      return;
    }
    if (isActive() && !pinUnlocked() && serverTeacher()) {
      openTeacherMenu(who);
      return;
    }
    if (isActive()) {
      openTeacherMenu(who);
      return;
    }
    panelEl.hidden = false;
    panelEl.innerHTML =
      '<div class="mrj-zap-teacher-panel-head">' +
      '<strong>Teacher</strong>' +
      '<button type="button" class="mrj-zap-teacher-close" aria-label="Close">✕</button>' +
      "</div>" +
      '<p class="mrj-zap-teacher-student">Student: <span>' +
      esc(who) +
      "</span></p>" +
      '<label class="mrj-zap-teacher-field">PIN<input type="password" class="mrj-zap-teacher-pin" autocomplete="off" /></label>' +
      '<p class="mrj-zap-teacher-err" role="alert"></p>' +
      '<button type="button" class="mrj-zap-teacher-unlock">Unlock</button>';
    var pin = panelEl.querySelector(".mrj-zap-teacher-pin");
    var err = panelEl.querySelector(".mrj-zap-teacher-err");
    panelEl.querySelector(".mrj-zap-teacher-close").onclick = closePanel;
    pin.focus();
    var go = function () {
      err.textContent = "Checking…";
      teacherCheck(pin.value.trim()).then(function (r) {
        if (r && r.ok) {
          setUnlocked(true);
          closePanel();
          openTeacherMenu(who);
        } else {
          err.textContent = (r && r.message) || "Wrong PIN.";
        }
      });
    };
    panelEl.querySelector(".mrj-zap-teacher-unlock").onclick = go;
    pin.onkeydown = function (e) {
      if (e.key === "Enter") go();
    };
    layoutBar();
  }

  function openTeacherMenu(who) {
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
    panelEl.querySelector(".mrj-zap-teacher-lock").onclick = function () {
      if (serverTeacher()) {
        closePanel();
        alert("This account is signed in as a teacher. Use sign out to end the session.");
        return;
      }
      setUnlocked(false);
      closePanel();
    };
    bindPanelBookPicker(who);
    bindPackRefresh(who);
    renderStartPointMeta(panelBookId);
    renderStartPointPath(panelBookId, who);
    layoutBar();
  }

  function onTeacherBtnClick() {
    ensureDom();
    if (!panelEl.hidden) {
      closePanel();
      return;
    }
    if (isActive()) openTeacherMenu(studentId());
    else openUnlockPanel();
  }

  function updateUi() {
    ensureDom();
    if (!btnEl) return;
    var signedIn = !!studentId();
    barEl.hidden = !signedIn;
    if (!signedIn) {
      closePanel();
      return;
    }
    btnEl.textContent = isActive() ? "Teacher ✓" : "Teacher";
    btnEl.classList.toggle("is-unlocked", isActive());
    btnEl.setAttribute("aria-pressed", isActive() ? "true" : "false");
    layoutBar();
  }

  function onAuthReady() {
    var saved = readUnlock();
    var who = studentId();
    if (saved && who && saved.student !== who) {
      setUnlocked(false);
    }
    syncChrome();
    updateUi();
  }

  function boot() {
    ensureDom();
    onAuthReady();
    try {
      var chip = root.document.getElementById("mrj-auth-student-chip");
      if (chip && root.MutationObserver) {
        var mo = new root.MutationObserver(function () {
          layoutBar();
          updateUi();
        });
        mo.observe(chip, { attributes: true, childList: true, characterData: true, subtree: true });
      }
    } catch (e) {}
  }

  if (root.document) {
    root.document.addEventListener("mrj-auth-ready", onAuthReady);
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }

  root.MRJ_ZAP_TEACHER = {
    BUILD: BUILD,
    isActive: isActive,
    pinUnlocked: pinUnlocked,
    teacherCheck: teacherCheck,
    setUnlocked: setUnlocked,
    layout: layoutBar,
  };
})(typeof window !== "undefined" ? window : globalThis);
