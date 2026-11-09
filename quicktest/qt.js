/* MRJ Quick Test — 25 fixed questions per test, shuffled order and choices every attempt.
   Jay, 2026-11-09: T3/F3 15 minutes, TF 5 minutes, pass = 23 of 25, unlimited retakes,
   every attempt recorded in the MRJ classroom sheet, results show each wrong question,
   the choice the student picked and the correct answer. */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var who = document.getElementById("who");
  var index = null;
  var attempt = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(a) {
    var out = a.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  function student() {
    try {
      if (window.MRJ_AUTH && typeof window.MRJ_AUTH.student === "function") {
        return String(window.MRJ_AUTH.student() || "").trim();
      }
    } catch (e) {}
    return "";
  }

  function showWho() {
    var s = student();
    who.textContent = s ? "· " + s : "· not signed in";
  }

  function history(topicId, shape) {
    try {
      var all = JSON.parse(localStorage.getItem("mrjqt.history") || "{}");
      return all[topicId + ":" + shape] || [];
    } catch (e) { return []; }
  }

  function pushHistory(topicId, shape, row) {
    try {
      var all = JSON.parse(localStorage.getItem("mrjqt.history") || "{}");
      var k = topicId + ":" + shape;
      all[k] = (all[k] || []).concat([row]);
      localStorage.setItem("mrjqt.history", JSON.stringify(all));
    } catch (e) {}
  }

  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // ---------------------------------------------------------------- topic list
  function ready(t) {
    return ["T3", "F3", "TF"].filter(function (k) { return t.shapes[k] && t.shapes[k].items >= 25; });
  }

  function renderIndex() {
    var usable = index.filter(function (t) { return ready(t).length; });
    var rows = usable.map(function (t) {
      var chips = ready(t).map(function (k) {
        var s = t.shapes[k];
        return '<a class="chip" href="#/test/' + encodeURIComponent(t.id) + "/" + k + '">' +
          k + ' <small>' + s.minutes + '분 · ' + s.items + '문항</small></a>';
      }).join("");
      var tries = ready(t).map(function (k) {
        var h = history(t.id, k);
        return h.length ? k + " " + h.length + "회" : "";
      }).filter(Boolean).join(" · ");
      return '<div class="topic"><div><b>' + esc(t.topic) + "</b>" +
        (tries ? '<div class="note">' + esc(tries) + "</div>" : "") +
        '</div><div class="chips">' + chips + "</div></div>";
    }).join("");
    app.innerHTML =
      '<div class="card"><h2>테스트를 고르세요 · Choose a test</h2>' +
      '<p class="lead">T3 = 틀린 문장 고르기 (15분) · F3 = 맞는 문장 고르기 (15분) · ' +
      'TF = 맞으면 TRUE, 틀리면 FALSE (5분). 25문항 중 23개 이상이면 통과입니다. ' +
      '다시 볼 수 있고, 문항 순서와 보기 순서는 매번 바뀝니다.</p>' +
      '<div class="topics">' + rows + "</div>" +
      '<p class="note" style="margin-top:14px">' + usable.length + '개 문법 · ' +
      usable.reduce(function (n, t) { return n + ready(t).length; }, 0) + '개 테스트. ' +
      '새로 만드는 중인 테스트는 목록에 없습니다.</p></div>';
    showWho();
  }

  // ------------------------------------------------- one topic (deep link target)
  function renderTopic(topicId) {
    var t = index.filter(function (x) { return x.id === topicId; })[0];
    if (!t) {
      app.innerHTML = '<div class="card"><h2>없는 문법입니다.</h2>' +
        '<p class="note">링크를 확인해 주세요.</p>' +
        '<p><a class="chip" href="#/">← 목록으로</a></p></div>';
      showWho();
      return;
    }
    var ks = ready(t);
    var cards = ks.map(function (k) {
      var s = t.shapes[k], h = history(t.id, k);
      var best = h.length ? Math.max.apply(null, h.map(function (r) { return r.correct; })) : null;
      return '<a class="chip primary" style="flex:1;min-width:150px;justify-content:center" href="#/test/' +
        encodeURIComponent(t.id) + '/' + k + '">' + k +
        ' <small>' + s.minutes + '분 · ' + s.items + '문항</small></a>' +
        '<div class="note" style="flex-basis:100%">' +
        (h.length ? '응시 ' + h.length + '회 · 최고 ' + best + '/' + (h[0].total || 25) : '아직 응시하지 않았습니다.') +
        '</div>';
    }).join("");
    app.innerHTML =
      '<div class="card"><p><a class="chip" href="#/">← 목록으로</a></p>' +
      '<h2>' + esc(t.topic) + '</h2>' +
      '<p class="lead">T3 = 틀린 문장 고르기 (15분) · F3 = 맞는 문장 고르기 (15분) · ' +
      'TF = 맞으면 TRUE, 틀리면 FALSE (5분). 25문항 중 23개 이상이면 통과입니다. ' +
      '다시 볼 수 있고, 문항 순서와 보기 순서는 매번 바뀝니다.</p>' +
      '<div class="chips" style="flex-wrap:wrap">' + (cards || '<p class="note">준비 중입니다.</p>') + '</div></div>';
    showWho();
  }

  // ---------------------------------------------------------------- the test
  function startTest(topicId, shape) {
    var t = index.filter(function (x) { return x.id === topicId; })[0];
    fetch("data/" + topicId + ".json", { cache: "no-store" }).then(function (r) { return r.json(); })
      .then(function (data) {
        var s = data.shapes[shape];
        if (!s) { location.hash = "#/"; return; }
        var items = shuffle(s.items).map(function (it) {
          var idx = it.options.map(function (o, i) { return i; });
          var order = shuffle(idx);
          return {
            id: it.id,
            prompt: it.prompt,
            options: order.map(function (i) { return it.options[i]; }),
            answer: order.indexOf(it.answer),
          };
        });
        attempt = {
          topicId: topicId, topic: data.topic, shape: shape,
          title: s.title, minutes: s.minutes, passCorrect: s.passCorrect,
          items: items, picked: new Array(items.length).fill(-1),
          started: Date.now(), left: s.minutes * 60, submitted: false,
        };
        renderTest();
        tick();
      });
  }

  var timerId = null;
  function tick() {
    clearInterval(timerId);
    timerId = setInterval(function () {
      if (!attempt || attempt.submitted) return;
      attempt.left -= 1;
      var el = document.getElementById("timer");
      if (el) {
        el.textContent = fmt(Math.max(0, attempt.left));
        el.className = "timer" + (attempt.left <= 60 ? " warn" : "");
      }
      if (attempt.left <= 0) submit(true);
    }, 1000);
  }

  function renderTest() {
    var a = attempt;
    var qs = a.items.map(function (it, qi) {
      var opts = it.options.map(function (o, oi) {
        return '<button class="opt' + (a.picked[qi] === oi ? " sel" : "") +
          '" data-q="' + qi + '" data-o="' + oi + '">' + esc(o) + "</button>";
      }).join("");
      return '<div class="q" id="q' + qi + '"><div class="prompt">' + (qi + 1) + " / " + a.items.length +
        "</div>" + (it.prompt ? '<div class="stem">' + esc(it.prompt) + "</div>" : "") + opts + "</div>";
    }).join("");
    app.innerHTML =
      '<div class="bar"><span id="timer" class="timer">' + fmt(a.left) + "</span>" +
      '<span class="progress"><i id="prog"></i></span>' +
      '<button class="btn ghost" id="back">나가기</button></div>' +
      '<h2>' + esc(a.title) + "</h2>" +
      '<p class="lead">' + a.items.length + "문항 · " + a.minutes + "분 · " +
      a.passCorrect + "개 이상 통과. 답을 고르면 바로 저장됩니다.</p>" + qs +
      '<div class="actions"><button class="btn" id="submit">제출하기</button>' +
      '<span class="note" id="count"></span></div>';
    document.getElementById("submit").addEventListener("click", function () { submit(false); });
    document.getElementById("back").addEventListener("click", function () {
      if (confirm("시험을 나갈까요? 지금 답은 저장되지 않습니다.")) { location.hash = "#/"; }
    });
    app.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        if (a.submitted) return;
        var qi = +b.dataset.q, oi = +b.dataset.o;
        a.picked[qi] = oi;
        app.querySelectorAll('#q' + qi + " .opt").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        updateCount();
      });
    });
    updateCount();
  }

  function updateCount() {
    var a = attempt;
    var done = a.picked.filter(function (p) { return p >= 0; }).length;
    var c = document.getElementById("count");
    if (c) c.textContent = done + " / " + a.items.length + " answered";
    var p = document.getElementById("prog");
    if (p) p.style.width = Math.round((done / a.items.length) * 100) + "%";
  }

  function submit(auto) {
    var a = attempt;
    if (!a || a.submitted) return;
    var unanswered = a.picked.filter(function (p) { return p < 0; }).length;
    if (!auto && unanswered && !confirm(unanswered + "문항이 비어 있습니다. 그래도 제출할까요?")) return;
    a.submitted = true;
    clearInterval(timerId);
    var right = 0;
    var wrong = [];
    a.items.forEach(function (it, i) {
      var picked = a.picked[i];
      if (picked === it.answer) { right++; }
      else {
        wrong.push({
          n: i + 1, prompt: it.prompt,
          picked: picked >= 0 ? it.options[picked] : "(no answer)",
          correct: it.options[it.answer],
        });
      }
    });
    var passed = right >= a.passCorrect;
    var secs = Math.round((Date.now() - a.started) / 1000);
    var row = {
      at: new Date().toISOString(), correct: right, total: a.items.length,
      passed: passed, seconds: secs, auto: !!auto,
    };
    pushHistory(a.topicId, a.shape, row);
    postScore(right, a.items.length, secs, wrong, passed);
    renderResult(right, wrong, passed, secs, auto);
  }

  function postScore(right, total, secs, wrong, passed) {
    var a = attempt;
    if (!window.MRJ_SCORES || typeof window.MRJ_SCORES.post !== "function") return;
    try {
      window.MRJ_SCORES.post({
        program: "mse-quicktest",
        appName: "MRJ Quick Test",
        bookTitle: "중학 영문법 Quick Test",
        unitTitle: a.topic + " " + a.shape,
        itemId: a.topicId + "-" + a.shape,
        itemType: "quicktest",
        eventKind: "learning_result",
        scoreValue: right,
        scoreMax: total,
        durationSeconds: secs,
        correctness: passed ? "pass" : "fail",
        metadata: {
          topic: a.topic, shape: a.shape,
          attempt: history(a.topicId, a.shape).length,
          wrong: wrong.map(function (w) { return w.n; }),
        },
      });
    } catch (e) {}
  }

  function renderResult(right, wrong, passed, secs, auto) {
    var a = attempt;
    var past = history(a.topicId, a.shape);
    var rows = past.map(function (h, i) {
      return "<tr><td>" + (i + 1) + "</td><td>" + new Date(h.at).toLocaleString() + "</td><td>" +
        h.correct + " / " + h.total + "</td><td>" + (h.passed ? "통과" : "다시") + "</td><td>" +
        fmt(h.seconds) + "</td></tr>";
    }).join("");
    var wrongHtml = wrong.length
      ? wrong.map(function (w) {
          return '<div class="wrongItem"><div class="prompt">' + w.n + "번" +
            (w.prompt ? " · " + esc(w.prompt) : "") + "</div>" +
            '<div class="chosen">내가 고른 답: ' + esc(w.picked) + "</div>" +
            '<div class="right">정답: ' + esc(w.correct) + "</div></div>";
        }).join("")
      : '<p class="note">틀린 문항이 없습니다.</p>';
    app.innerHTML =
      '<div class="card"><h2>' + esc(a.title) + "</h2>" +
      '<p class="score ' + (passed ? "pass" : "fail") + '">' + right + " / " + a.items.length + "</p>" +
      "<p>" + (passed ? "통과입니다. 잘했습니다." :
        "아쉽습니다. " + a.passCorrect + "개 이상이면 통과입니다. 아래 문항을 다시 보고 한 번 더 하세요.") +
      (auto ? ' <span class="note">(시간이 끝나 자동 제출되었습니다)</span>' : "") + "</p>" +
      '<p class="note">이번 시험 ' + fmt(secs) + " · 총 " + past.length + "번 응시</p>" +
      '<div class="actions"><button class="btn" id="again">다시 보기</button>' +
      '<button class="btn ghost" id="list">목록으로</button></div></div>' +
      '<div class="card"><h2>틀린 문항</h2>' + wrongHtml + "</div>" +
      '<div class="card"><h2>내 기록</h2><table class="attempts"><thead><tr><th>#</th><th>날짜</th>' +
      "<th>점수</th><th></th><th>시간</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p class="note">모든 응시는 선생님 기록부(MRJ Classroom Metrics)에도 저장됩니다.</p></div>';
    document.getElementById("again").addEventListener("click", function () {
      startTest(a.topicId, a.shape);
    });
    document.getElementById("list").addEventListener("click", function () { location.hash = "#/"; });
  }

  // ---------------------------------------------------------------- routing
  function route() {
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    if (parts[0] === "test" && parts[1] && parts[2]) {
      startTest(decodeURIComponent(parts[1]), parts[2]);
    } else if (parts[0] === "topic" && parts[1]) {
      clearInterval(timerId);
      renderTopic(decodeURIComponent(parts[1]));
    } else {
      clearInterval(timerId);
      renderIndex();
    }
  }

  fetch("data/index.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      index = d;
      window.addEventListener("hashchange", route);
      route();
    })
    .catch(function () {
      app.innerHTML = '<div class="card"><h2>테스트를 불러오지 못했습니다.</h2>' +
        '<p class="note">잠시 뒤 다시 열어 주세요.</p></div>';
    });
})();
