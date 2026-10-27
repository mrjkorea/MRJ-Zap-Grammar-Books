/* Preview-only UI layer. Builds visual pickers / progress / how-to chips AROUND the
   existing DOM. Never changes grading, data, timer, auth, ids, name= or JS classes.
   Real <select>s stay in the DOM (hidden) and are driven via value + "change". */
(function () {
  "use strict";
  var app = document.getElementById("mrj-app-root");
  if (!app) return;
  var ICON = { green: "🌿", blue: "💎", red: "🍎", chunilmun: "📖" };
  var MODE = {
    fill: ["words", "✏️", "단어"], sentence: ["sentence", "📝", "문장"],
    mc: ["choice", "🔘", "고르기"], match: ["match", "🔗", "짝 맞추기"]
  };
  var modeCache = {};

  function cat() { return window.MRJ_CATALOG; }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function isChunilmun(id) {
    return id === "chunilmun-grammar-1" || /chunilmun/.test(id || "");
  }
  function family(id) {
    if (isChunilmun(id)) return "chunilmun";
    return /red/.test(id) ? "red" : /blue/.test(id) ? "blue" : "green";
  }
  function themeBookAttr(id) {
    if (isChunilmun(id)) return "chunilmun-grammar-1";
    return family(id);
  }
  function sess(k, f) { try { return sessionStorage.getItem(k) || f; } catch (e) { return f; } }
  function currentBook() {
    var m = location.hash.match(/^#\/p\/([^/]+)\/[^/]+\//);
    return m ? m[1] : sess("gz.book", "zap-green-1");
  }
  function setTheme(id) {
    document.documentElement.setAttribute("data-book", themeBookAttr(id || currentBook()));
    document.documentElement.setAttribute("data-view", /^#\/p\//.test(location.hash) ? "practice" : "index");
  }
  function fire(sel, value) {
    sel.value = value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function bestPct(pid) {
    try {
      var pack = window.MRJ_GREENZAP_PACK && window.MRJ_GREENZAP_PACK.getPack();
      var p = pack && pack.practices && pack.practices[pid];
      return p && p.best && typeof p.best.pct === "number" ? p.best.pct : null;
    } catch (e) { return null; }
  }
  function howto(target, label) {
    if (!target || target.getAttribute("data-pv-howto")) return;
    if ((target.textContent || "").length < 70) return;
    target.setAttribute("data-pv-howto", "1");
    target.classList.add("pv-clamp");
    var b = el("button", "pv-howto", "💡 " + (label || "자세히 보기"));
    b.type = "button";
    b.setAttribute("aria-expanded", "false");
    b.onclick = function () {
      var open = target.classList.toggle("pv-open");
      b.setAttribute("aria-expanded", String(open));
      b.textContent = open ? "▲ 접기" : "💡 " + (label || "자세히 보기");
    };
    target.parentNode.insertBefore(b, target.nextSibling);
  }

  /* ---------- Index: book cards + unit tiles + exercise tiles ---------- */
  function shortBook(t) { return String(t).replace(/^ZAP\s*/i, ""); }
  function unitParts(t) {
    var s = String(t);
    var m = s.match(/^Unit\s*0*(\d+)\s*[—-]\s*(.*)$/);
    if (m) return { n: m[1], t: m[2] };
    m = s.match(/^Chapter\s*0*(\d+)\s*(?:SB\s*)?[—-]\s*(.*)$/i);
    if (m) return { n: m[1], t: m[2] };
    m = s.match(/^Ch\s*0*(\d+)\s*WB\s*[—-]\s*(.*)$/i);
    if (m) return { n: m[1] + "W", t: m[2] };
    m = s.match(/^총괄평가\s*(\d+)/);
    if (m) return { n: "R" + m[1], t: "총괄평가 " + m[1] };
    return { n: "★", t: s.replace(/\s*\(coming soon\)/, "") };
  }
  function buildIndex() {
    var grid = app.querySelector(".grid-2");
    if (!grid) return;
    var sels = grid.querySelectorAll("select");
    if (sels.length < 2) return;
    var bookSel = sels[0], unitSel = sels[1];
    grid.classList.add("pv-hidden");
    setTheme(bookSel.value);

    var host = app.querySelector(".pv-pickers");
    if (!host) {
      host = el("div", "pv-pickers");
      grid.parentNode.insertBefore(host, grid);
    }
    host.innerHTML = "";

    host.appendChild(el("h2", "pv-step", "1 · 책 고르기"));
    var books = el("div", "pv-books");
    Array.prototype.forEach.call(bookSel.options, function (o) {
      if (o.disabled) return;
      var fam = family(o.value);
      var card = el("button", "pv-book pv-" + fam + (o.value === bookSel.value ? " is-on" : ""));
      card.type = "button";
      card.setAttribute("data-value", o.value);
      card.setAttribute("aria-pressed", String(o.value === bookSel.value));
      var name = shortBook(o.textContent);
      card.appendChild(el("span", "pv-book-icon", ICON[fam]));
      card.appendChild(el("span", "pv-book-title", name.replace(/\s*\d+$/, "")));
      card.appendChild(el("span", "pv-book-level", (name.match(/\d+$/) || [""])[0]));
      card.onclick = function () { fire(bookSel, o.value); buildIndex(); };
      books.appendChild(card);
    });
    host.appendChild(books);

    host.appendChild(el("h2", "pv-step", "2 · 유닛 고르기"));
    var units = el("div", "pv-units");
    Array.prototype.forEach.call(unitSel.options, function (o) {
      var p = unitParts(o.textContent);
      var t = el("button", "pv-unit" + (o.value === unitSel.value ? " is-on" : ""));
      t.type = "button";
      t.disabled = o.disabled;
      t.title = o.textContent;
      t.setAttribute("aria-pressed", String(o.value === unitSel.value));
      t.appendChild(el("span", "pv-badge", p.n));
      t.appendChild(el("span", "pv-unit-title", p.t));
      t.onclick = function () { fire(unitSel, o.value); buildIndex(); };
      units.appendChild(t);
    });
    host.appendChild(units);

    var listTitle = Array.prototype.find.call(app.querySelectorAll(".panel h2"), function (h) {
      return !h.classList.contains("pv-step");
    });
    if (listTitle) { listTitle.textContent = "3 · 연습 고르기"; listTitle.className = "pv-step"; listTitle.removeAttribute("style"); }
    decorateExercises(bookSel.value, unitSel.value);
  }

  function shortEx(t) {
    var s = String(t), m = s.match(/(Walk|Run|Jump|Fly|Review|Final|Test)\s*0*(\d*)/i);
    var main = m ? (m[1] + (m[2] ? " " + m[2] : "")) : s.split("—")[0].trim();
    var sub = (s.split("—")[1] || "").trim();
    var lesson = s.match(/Lesson\s*0*(\d+)/i);
    return { main: main, sub: (lesson ? "L" + lesson[1] + (sub ? " · " : "") : "") + sub };
  }
  function modesFor(meta, cb) {
    if (!meta || !meta.data) return;
    if (modeCache[meta.data]) return cb(modeCache[meta.data]);
    fetch(meta.data).then(function (r) { return r.json(); }).then(function (d) {
      var seen = {};
      (d.items || []).forEach(function (it) { if (MODE[it.type]) seen[it.type] = 1; });
      modeCache[meta.data] = Object.keys(seen);
      cb(modeCache[meta.data]);
    }).catch(function () {});
  }
  function decorateExercises(bookId, unitId) {
    var list = app.querySelector(".exercise-list");
    if (!list || !cat()) return;
    var exs = cat().exercises[cat().unitKey(bookId, unitId)] || [];
    Array.prototype.forEach.call(list.querySelectorAll(".exercise-btn"), function (a, i) {
      if (a.getAttribute("data-pv")) return;
      a.setAttribute("data-pv", "1");
      var slug = decodeURIComponent((a.getAttribute("href") || "").split("/").pop());
      var ex = exs.filter(function (e) { return e.slug === slug; })[0] || exs[i];
      var titleSpan = a.querySelector("span:not(.hint):not(.retry-tag)");
      var full = titleSpan ? titleSpan.textContent : "";
      a.title = full + (ex && ex.hint ? " · " + ex.hint : "");
      if (titleSpan) titleSpan.classList.add("pv-orig");
      var sh = shortEx(full);
      var head = el("span", "pv-ex-head");
      head.appendChild(el("span", "pv-badge", String(i + 1)));
      var tt = el("span", "pv-ex-text");
      tt.appendChild(el("span", "pv-ex-main", sh.main));
      if (sh.sub) tt.appendChild(el("span", "pv-ex-sub", sh.sub));
      head.appendChild(tt);
      a.insertBefore(head, a.firstChild);
      var chips = el("span", "pv-chips");
      a.appendChild(chips);
      var pct = ex ? bestPct(ex.practiceId) : null;
      if (pct != null) {
        a.appendChild(el("span", "pv-score" + (pct >= 80 ? " is-pass" : ""), (pct >= 80 ? "⭐ " : "") + pct + "%"));
      }
      modesFor(ex, function (ms) {
        ms.forEach(function (m) {
          var c = el("span", "pv-mode pv-mode-" + MODE[m][0], MODE[m][1] + " " + MODE[m][2]);
          chips.appendChild(c);
        });
      });
    });
  }

  /* ---------- Practice: progress bar, card modes, how-to chips, celebration ---------- */
  function cardAnswered(card) {
    if (card.querySelector("input[type=radio]:checked")) return true;
    var texts = card.querySelectorAll("input[type=text]");
    if (texts.length) return Array.prototype.every.call(texts, function (t) { return t.value.trim() !== ""; });
    var left = card.querySelectorAll(".match-btn-left");
    if (left.length) return Array.prototype.every.call(left, function (b) { return b.classList.contains("match-linked"); });
    return false;
  }
  function buildPractice() {
    var form = app.querySelector("form");
    var cards = form ? form.querySelectorAll(".q-card") : [];
    Array.prototype.forEach.call(cards, function (c) {
      if (c.getAttribute("data-pv")) return;
      c.setAttribute("data-pv", "1");
      c.classList.add(c.querySelector(".match-wrap") ? "pv-card-match" : c.querySelector(".mc-options") ? "pv-card-choice" : "pv-card-type");
    });
    Array.prototype.forEach.call(app.querySelectorAll(".section-banner-instr"), function (e) { howto(e, "방법 보기"); });
    Array.prototype.forEach.call(app.querySelectorAll(".intro-ko, .lead, .note"), function (e) { howto(e, "안내 보기"); });
    if (!form) { var st = app.querySelector(".pv-sticky"); if (st) st.remove(); }
    var graded = cards.length && Array.prototype.filter.call(cards, function (c) { return !c.querySelector(".example-answer"); });
    if (form && graded.length && !app.querySelector(".pv-progress")) {
      var bar = el("div", "pv-progress");
      bar.innerHTML = '<div class="pv-progress-track"><div class="pv-progress-fill"></div></div><span class="pv-progress-label"></span>';
      var timer = app.querySelector(".timer-bar");
      (timer || form).parentNode.insertBefore(bar, timer ? timer.nextSibling : form);
      if (timer) { var wrapS = el("div", "pv-sticky"); timer.parentNode.insertBefore(wrapS, timer); wrapS.appendChild(timer); wrapS.appendChild(bar); }
    }
    updateProgress();
    celebrate();
  }
  function updateProgress() {
    var bar = app.querySelector(".pv-progress");
    if (!bar) return;
    var cards = Array.prototype.filter.call(app.querySelectorAll("form .q-card"), function (c) { return !c.querySelector(".example-answer"); });
    var done = cards.filter(cardAnswered).length;
    var pct = cards.length ? Math.round((done / cards.length) * 100) : 0;
    bar.querySelector(".pv-progress-fill").style.width = pct + "%";
    bar.querySelector(".pv-progress-label").textContent = done + " / " + cards.length;
    bar.classList.toggle("is-full", cards.length > 0 && done === cards.length);
    cards.forEach(function (c) { c.classList.toggle("pv-done", cardAnswered(c)); });
  }
  function celebrate() {
    var panel = app.querySelector(".result-panel");
    if (!panel || panel.getAttribute("data-pv")) return;
    panel.setAttribute("data-pv", "1");
    var h = panel.querySelector("h2");
    var m = h && h.textContent.match(/\((\d+)%\)/);
    var pct = m ? +m[1] : 0;
    var hero = el("div", "pv-hero " + (pct >= 80 ? "is-pass" : pct >= 50 ? "is-mid" : "is-low"));
    hero.appendChild(el("div", "pv-hero-emoji", pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "🌱"));
    var ring = el("div", "pv-ring");
    ring.style.setProperty("--p", pct);
    ring.appendChild(el("span", null, pct + "%"));
    hero.appendChild(ring);
    hero.appendChild(el("div", "pv-hero-msg", pct >= 80 ? "잘했어요!" : pct >= 50 ? "조금만 더!" : "다시 해 봐요!"));
    panel.insertBefore(hero, panel.firstChild);
    if (pct >= 80 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var burst = el("div", "pv-confetti");
      for (var i = 0; i < 40; i++) {
        var s = el("i");
        s.style.left = Math.random() * 100 + "%";
        s.style.animationDelay = Math.random() * 0.6 + "s";
        s.style.background = ["#ffcb2e", "#ff5a7a", "#3dd68c", "#4aa3ff", "#b07cff"][i % 5];
        burst.appendChild(s);
      }
      document.body.appendChild(burst);
      setTimeout(function () { burst.remove(); }, 3500);
    }
  }

  var queued = false;
  function refresh() {
    queued = false;
    setTheme();
    if (document.documentElement.getAttribute("data-view") === "index") {
      if (!app.querySelector(".pv-pickers") || !app.querySelector(".pv-books")) buildIndex();
      else {
        var sels = app.querySelectorAll(".grid-2 select");
        if (sels.length === 2) decorateExercises(sels[0].value, sels[1].value);
      }
      Array.prototype.forEach.call(app.querySelectorAll(".lead, .note"), function (e) { howto(e, "안내 보기"); });
    } else buildPractice();
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(refresh); } }
  new MutationObserver(queue).observe(app, { childList: true, subtree: true });
  window.addEventListener("hashchange", queue);
  document.addEventListener("input", updateProgress, true);
  document.addEventListener("change", updateProgress, true);
  document.addEventListener("click", function () { setTimeout(updateProgress, 0); }, true);
  setTheme();
  queue();
})();
