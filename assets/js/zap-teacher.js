/**
 * Teacher PIN unlock beside MRJ student chip (study_teacher_check — never hardcoded PIN).
 */
(function (root) {
  "use strict";

  var SESSION_KEY = "gz.teacherUnlock";
  var BUILD = "20261027-teacher-chip";

  function auth() {
    return root.MRJ_AUTH || root.MRJSignin || null;
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
    panelEl.hidden = false;
    panelEl.innerHTML =
      '<div class="mrj-zap-teacher-panel-head">' +
      '<strong>Teacher mode</strong>' +
      '<button type="button" class="mrj-zap-teacher-close" aria-label="Close">✕</button>' +
      "</div>" +
      '<p class="mrj-zap-teacher-student">Student: <span>' +
      esc(who) +
      "</span></p>" +
      '<p class="mrj-zap-teacher-hint">Free navigation, no practice locks, and correct answers on review.</p>' +
      '<button type="button" class="mrj-zap-teacher-lock">Lock / exit teacher mode</button>';
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
