/* Zap practice audio layer. Loads audio/manifest.json and attaches icon-only
   .q-speak buttons via MutationObserver. Does not edit grading, ids, or app.js. */
(function () {
  "use strict";

  var VER = "20261028-chunilmun1";
  var MANIFEST_URL = "audio/manifest.json?v=" + VER;
  var app = document.getElementById("mrj-app-root");
  if (!app) return;

  var manifest = null;
  var byFile = {};
  var loadPromise = null;
  var current = null; // { audio, btn }
  var autoplayKey = null;
  var autoplayFailed = false;
  var queued = false;

  function bust(path) {
    if (!path) return path;
    return "audio/" + path.replace(/^audio\//, "") + (path.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
  }

  function ensureManifest() {
    if (manifest) return Promise.resolve(manifest);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(MANIFEST_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("manifest " + r.status);
        return r.json();
      })
      .then(function (m) {
        manifest = m;
        byFile = {};
        var books = (m && m.books) || {};
        Object.keys(books).forEach(function (bk) {
          var practices = books[bk] || {};
          Object.keys(practices).forEach(function (pk) {
            var p = practices[pk];
            if (p && p.file) byFile[p.file] = p;
          });
        });
        return manifest;
      })
      .catch(function (err) {
        loadPromise = null;
        console.warn("[zap-audio] manifest load failed", err);
        return null;
      });
    return loadPromise;
  }

  function routeInfo() {
    var m = location.hash.match(/^#\/p\/([^/]+)\/([^/]+)\/([^/?#]+)/);
    if (!m) return null;
    return {
      bookId: decodeURIComponent(m[1]),
      unitId: decodeURIComponent(m[2]),
      slug: decodeURIComponent(m[3]),
    };
  }

  function practiceEntry() {
    var r = routeInfo();
    if (!r || !window.MRJ_CATALOG || !manifest) return null;
    var meta = window.MRJ_CATALOG.findExercise(r.bookId, r.unitId, r.slug);
    if (!meta || !meta.data) return null;
    return byFile[meta.data] || null;
  }

  function practiceKey(entry, route) {
    if (!entry || !route) return null;
    return (entry.file || "") + "#" + route.bookId + "/" + route.unitId + "/" + route.slug;
  }

  function itemIdFromCard(card) {
    var match = card.querySelector("[data-match-id]");
    if (match) return match.getAttribute("data-match-id");
    var inp = card.querySelector("input[name]");
    if (!inp) return null;
    return String(inp.name).replace(/_\d+$/, "");
  }

  function normalizeSectionId(raw) {
    return String(raw || "")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, "")
      .trim();
  }

  function sectionIdForBanner(banner, practice) {
    var el = banner.nextElementSibling;
    while (el) {
      if (el.classList.contains("section-banner")) break;
      if (el.classList.contains("q-card")) {
        var id = itemIdFromCard(el);
        if (id && practice.items && practice.items[id] && practice.items[id].section) {
          return practice.items[id].section;
        }
      }
      el = el.nextElementSibling;
    }
    var titleEl = banner.querySelector(".section-banner-title");
    var title = titleEl ? titleEl.textContent || "" : "";
    var m = title.match(/^Section\s+([A-Za-z0-9]+)/i);
    if (m) return m[1];
    m = title.match(/^\[([^\]]+)\]/);
    if (m) {
      var sid = normalizeSectionId(m[1]);
      if (practice.sections && practice.sections[sid]) return sid;
      var keys = Object.keys(practice.sections || {});
      for (var i = 0; i < keys.length; i++) {
        if (normalizeSectionId(keys[i]) === sid) return keys[i];
      }
      return sid;
    }
    return null;
  }

  function stopCurrent() {
    if (!current) return;
    try {
      current.audio.pause();
      current.audio.removeAttribute("src");
      current.audio.load();
    } catch (e) {}
    if (current.btn) current.btn.classList.remove("is-playing");
    current = null;
  }

  function playUrl(btn, url) {
    if (!url) return Promise.reject(new Error("no url"));
    stopCurrent();
    var audio = new Audio();
    audio.preload = "none";
    audio.src = url;
    current = { audio: audio, btn: btn };
    if (btn) btn.classList.add("is-playing");
    var clear = function () {
      if (btn) btn.classList.remove("is-playing");
      if (current && current.audio === audio) current = null;
    };
    audio.addEventListener("ended", clear);
    audio.addEventListener("error", clear);
    var p = audio.play();
    if (p && p.then) {
      return p
        .then(function () {
          // Any successful play dismisses the unlock prompt.
          autoplayFailed = false;
          hideUnlock();
        })
        .catch(function (err) {
          clear();
          throw err;
        });
    }
    autoplayFailed = false;
    hideUnlock();
    return Promise.resolve();
  }

  function makeSpeakBtn(label, extraClass) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "q-speak" + (extraClass ? " " + extraClass : "");
    btn.setAttribute("aria-label", label);
    return btn;
  }

  function hideUnlock() {
    var el = document.querySelector(".q-sound-unlock");
    if (el) el.classList.add("is-hidden");
  }

  function unlockVisible() {
    var el = document.querySelector(".q-sound-unlock");
    return !!(el && !el.classList.contains("is-hidden"));
  }

  function showUnlock(playFn) {
    var el = document.querySelector(".q-sound-unlock");
    if (!el) {
      el = document.createElement("button");
      el.type = "button";
      el.className = "q-sound-unlock is-hidden";
      el.textContent = "🔊 탭해서 소리 켜기";
      document.body.appendChild(el);
    }
    el.onclick = function () {
      playFn()
        .then(function () {
          autoplayFailed = false;
          el.classList.add("is-hidden");
        })
        .catch(function () {
          /* keep visible */
        });
    };
    el.classList.remove("is-hidden");
  }

  function bindUnlock(instrBtn, url) {
    showUnlock(function () {
      return playUrl(instrBtn, url);
    });
  }

  function resetAutoplayState() {
    autoplayKey = null;
    autoplayFailed = false;
  }

  function tryAutoplayFirst(instrBtn, url, key) {
    if (!instrBtn || !url || !key) return;
    if (autoplayKey === key) {
      // Same practice re-decorate: keep failed unlock bound to the current button.
      if (autoplayFailed) bindUnlock(instrBtn, url);
      return;
    }
    autoplayKey = key;
    autoplayFailed = false;
    playUrl(instrBtn, url)
      .then(function () {
        autoplayFailed = false;
        hideUnlock();
      })
      .catch(function () {
        autoplayFailed = true;
        bindUnlock(instrBtn, url);
      });
  }

  function decorate(practice, route) {
    var form = app.querySelector("form");
    if (!form || !practice) return;

    var key = practiceKey(practice, route);
    var firstInstr = null;
    var banners = form.querySelectorAll(".section-banner");
    for (var bi = 0; bi < banners.length; bi++) {
      var banner = banners[bi];
      if (banner.getAttribute("data-zap-audio") === "1") continue;
      banner.setAttribute("data-zap-audio", "1");
      var sid = sectionIdForBanner(banner, practice);
      var sec = sid && practice.sections ? practice.sections[sid] : null;
      var instrPath = sec && sec.instrAudio;
      if (!instrPath) continue;
      var head = banner.querySelector(".section-banner-head") || banner;
      var ibtn = makeSpeakBtn("지시문 듣기", "q-speak--instr");
      var iurl = bust(instrPath);
      ibtn.setAttribute("data-zap-src", iurl);
      (function (btn, url) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          playUrl(btn, url).catch(function () {});
        });
      })(ibtn, iurl);
      head.appendChild(ibtn);
      if (!firstInstr) firstInstr = { btn: ibtn, url: iurl };
    }

    var cards = form.querySelectorAll(".q-card");
    for (var ci = 0; ci < cards.length; ci++) {
      var card = cards[ci];
      if (card.getAttribute("data-zap-audio") === "1") continue;
      card.setAttribute("data-zap-audio", "1");
      if (card.classList.contains("example-card")) continue;
      var qid = itemIdFromCard(card);
      if (!qid || !practice.items || !practice.items[qid] || !practice.items[qid].audio) continue;
      var qurl = bust(practice.items[qid].audio);
      var qbtn = makeSpeakBtn("듣기");
      qbtn.setAttribute("data-zap-src", qurl);
      (function (btn, url) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          playUrl(btn, url).catch(function () {});
        });
      })(qbtn, qurl);
      var host =
        card.querySelector(".q-en") ||
        card.querySelector(".q-ko") ||
        card.querySelector(".q-head") ||
        card;
      host.appendChild(qbtn);
    }

    if (firstInstr) {
      tryAutoplayFirst(firstInstr.btn, firstInstr.url, key);
      return;
    }

    // Re-decorate (banners already marked): never hide unlock here.
    // If autoplay previously failed for this practice, keep/rebind the prompt.
    if (autoplayFailed && autoplayKey === key) {
      var existing = form.querySelector(".q-speak--instr");
      if (existing) {
        bindUnlock(existing, existing.getAttribute("data-zap-src"));
      }
    }
  }

  function refresh() {
    queued = false;
    var route = routeInfo();
    if (!route) {
      stopCurrent();
      hideUnlock();
      resetAutoplayState();
      return;
    }
    ensureManifest().then(function () {
      var entry = practiceEntry();
      if (!entry) return;
      decorate(entry, route);
    });
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(refresh);
  }

  window.addEventListener("hashchange", function () {
    stopCurrent();
    hideUnlock();
    resetAutoplayState();
    queue();
  });

  new MutationObserver(queue).observe(app, { childList: true, subtree: true });
  ensureManifest().then(queue);
})();
