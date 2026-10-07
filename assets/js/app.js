(function () {
  "use strict";

  var app = document.getElementById("mrj-app-root");
  var catalog = window.MRJ_CATALOG;
  var engine = window.MRJ_ENGINE;
  var SEL_BOOK = "gz.book";
  var SEL_UNIT = "gz.unit";

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

  function brandForBook(bookId) {
    var book = catalog.findBook(bookId) || catalog.findBook("zap-green-1");
    var name = (book && book.appName) || engine.APP_NAME;
    return name + " · MRJ Zap Grammar Books";
  }

  function practiceHref(bookId, unitId, slug) {
    return "#/p/" + bookId + "/" + unitId + "/" + slug;
  }

  function itemDisplayLabel(item, idx) {
    if (item && item.label) return String(item.label);
    return "Q" + (idx + 1);
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
    renderIndex();
  }

  function topbar(backHref, brandText) {
    var bar = $("div", "topbar");
    if (backHref) {
      var a = $("a", "back-link", "← Index");
      a.href = backHref;
      bar.appendChild(a);
    }
    bar.appendChild($("div", "brand", brandText || brandForBook(getSel(SEL_BOOK, "zap-green-1"))));
    var pill = $("span", "student-pill", studentLabel() || "Signed in");
    bar.appendChild(pill);
    return bar;
  }

  function renderIndex() {
    app.innerHTML = "";
    var bookId = getSel(SEL_BOOK, "zap-green-1");
    app.appendChild(topbar(null, brandForBook(bookId)));
    app.appendChild($("h1", null, "Practice index"));
    app.appendChild(
      $("p", "lead", "Choose your book and unit, then start a timed practice. Use your paper book too.")
    );

    var panel = $("div", "panel");
    var grid = $("div", "grid-2");

    var unitId = getSel(SEL_UNIT, "unit-01");

    var bookField = $("div");
    bookField.appendChild($("label", "field-label", "Book"));
    var bookSel = $("select");
    catalog.books.forEach(function (b) {
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
    grid.appendChild(bookField);

    var unitField = $("div");
    unitField.appendChild($("label", "field-label", "Unit"));
    var unitSel = $("select");
    var units = catalog.units[bookId] || [];
    units.forEach(function (u) {
      var opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.title + (u.enabled ? "" : " (coming soon)");
      opt.disabled = !u.enabled;
      if (u.id === unitId && u.enabled) opt.selected = true;
      unitSel.appendChild(opt);
    });
    unitField.appendChild(unitSel);
    grid.appendChild(unitField);

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
      if (!exs.length) {
        list.appendChild($("p", "note", "No exercises for this unit yet."));
        return;
      }
      exs.forEach(function (ex) {
        var btn = document.createElement("a");
        btn.className = "exercise-btn";
        btn.href = practiceHref(bookId, unitId, ex.slug);
        var title = $("span", null, ex.title);
        btn.appendChild(title);
        btn.appendChild($("span", "hint", ex.hint));
        if (engine.mustRetry(ex.practiceId)) {
          btn.appendChild($("span", "retry-tag", " · Please try again (score was under 50%)"));
        }
        list.appendChild(btn);
      });
    }

    bookSel.onchange = function () {
      bookId = bookSel.value;
      setSel(SEL_BOOK, bookId);
      units = catalog.units[bookId] || [];
      unitSel.innerHTML = "";
      units.forEach(function (u) {
        var opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.title + (u.enabled ? "" : " (coming soon)");
        opt.disabled = !u.enabled;
        unitSel.appendChild(opt);
      });
      unitId = unitSel.value || (units[0] && units[0].id);
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
    app.innerHTML = "";
    app.appendChild(topbar("#/", brandForBook(bookId)));
    app.appendChild($("p", "lead", "Loading…"));
    loadPractice(routeInfo)
      .then(function (practice) {
        startPracticeUI(practice, routeInfo);
      })
      .catch(function () {
        app.innerHTML = "";
        app.appendChild(topbar("#/", brandForBook(bookId)));
        app.appendChild($("p", "lead", "Could not load this practice."));
      });
  }

  function startPracticeUI(practice, routeInfo) {
    var bookId = (practice._meta && practice._meta.bookId) || getSel(SEL_BOOK, "zap-green-1");
    var unitId = (practice._meta && practice._meta.unitId) || getSel(SEL_UNIT, "unit-01");
    var slug = routeInfo.slug || (practice._meta && practice._meta.slug);
    var practiceId = engine.practiceIdOf(practice);

    app.innerHTML = "";
    app.appendChild(topbar("#/", brandForBook(bookId)));
    app.appendChild($("h1", null, practice.title));
    if (practice.subtitle) app.appendChild($("p", "lead", practice.subtitle + (practice.pages ? " · p. " + practice.pages : "")));

    if (engine.mustRetry(practiceId)) {
      app.appendChild(
        $("p", "note", "Your last score was below 50%. Please complete this practice again.")
      );
    }

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
    if (practice.wordBank && practice.wordBank.length) {
      var bank = $("div", "word-bank");
      practice.wordBank.forEach(function (w) {
        bank.appendChild($("span", null, w));
      });
      form.appendChild(bank);
    }

    var items = practice.items.filter(function (it) {
      return !it.displayOnly;
    });

    var lastSection = null;
    items.forEach(function (item, idx) {
      if (item.section && item.section !== lastSection) {
        lastSection = item.section;
        var secHdr = $("div", "section-header", "Section " + item.section);
        form.appendChild(secHdr);
      }
      var card = $("div", "q-card");
      card.appendChild($("div", "q-num", itemDisplayLabel(item, idx)));
      if (item.promptKo) card.appendChild($("div", "q-ko", item.promptKo));
      if (item.promptEn) card.appendChild($("div", "q-en", item.promptEn));

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
        if (blanks <= 1) {
          var inp = document.createElement("input");
          inp.type = "text";
          inp.name = item.id;
          inp.autocomplete = "off";
          inp.required = true;
          inp.setAttribute("aria-label", "Answer for " + itemDisplayLabel(item, idx));
          row.appendChild(inp);
        } else {
          for (var b = 0; b < blanks; b++) {
            var inp2 = document.createElement("input");
            inp2.type = "text";
            inp2.name = item.id + "_" + b;
            inp2.autocomplete = "off";
            inp2.required = true;
            inp2.setAttribute("aria-label", "Answer part " + (b + 1));
            row.appendChild(inp2);
          }
        }
        card.appendChild(row);
      }
      form.appendChild(card);
    });

    var actions = $("div", "actions");
    var submitBtn = $("button", "btn btn-primary", "Submit");
    submitBtn.type = "submit";
    actions.appendChild(submitBtn);
    form.appendChild(actions);
    app.appendChild(form);

    function lockForm() {
      locked = true;
      submitBtn.disabled = true;
      form.querySelectorAll("input, select, button").forEach(function (el) {
        el.disabled = true;
      });
      timerEl.classList.add("low");
      timerText.textContent = "Time's up — submitted";
    }

    function collectResponses() {
      var responses = {};
      items.forEach(function (item) {
        if (item.type === "mc") {
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

    function showResults(outcome) {
      form.remove();
      timerEl.remove();
      var panel = $("div", "panel result-panel" + (outcome.mustRetry ? " fail-retry" : ""));
      panel.appendChild(
        $("h2", null, "Score: " + outcome.correct + " / " + outcome.max + " (" + outcome.pct + "%)")
      );
      var status = outcome.passed ? "Pass (80%+)" : "Keep practicing";
      if (outcome.mustRetry) status = "Please try this exercise again (under 50%).";
      panel.appendChild($("p", null, status));

      items.forEach(function (item, idx) {
        var r = outcome.results.filter(function (x) {
          return x.id === item.id;
        })[0];
        var line = $("p", null, "");
        line.appendChild(document.createTextNode(itemDisplayLabel(item, idx) + " "));
        var mark = $("span", r && r.correct ? "mark-ok" : "mark-bad", r && r.correct ? "✓" : "✗");
        line.appendChild(mark);
        panel.appendChild(line);
      });

      var wrong = outcome.results.filter(function (r) {
        return !r.correct;
      });
      if (wrong.length) {
        panel.appendChild($("p", null, "Wrong:"));
        var ul = $("ul", "wrong-list");
        wrong.forEach(function (w) {
          var n = items.findIndex(function (it) {
            return it.id === w.id;
          });
          var it = items[n];
          ul.appendChild($("li", null, itemDisplayLabel(it, n)));
        });
        panel.appendChild(ul);
      }

      panel.appendChild($("p", "note", "Correct answers are not shown on screen. Check your book or ask your teacher."));
      app.appendChild(panel);

      var again = $("a", "btn btn-secondary", "Back to index");
      again.href = "#/";
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

    function doSubmit() {
      if (locked && form.dataset.submitted) return;
      form.dataset.submitted = "1";
      var responses = collectResponses();
      var outcome = engine.scorePractice(practice, responses, startedAt);
      showResults(outcome);
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      if (!locked) lockForm();
      doSubmit();
    };

    var tick = setInterval(function () {
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

  window.addEventListener("hashchange", route);
  document.addEventListener("mrj-auth-ready", route);
  if (document.readyState !== "loading") route();
  else document.addEventListener("DOMContentLoaded", route);
})();
