/* Generate data/blue4/unit02/*.json — run: node scripts/blue4-build/unit02-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue4/unit02");
const META = {
  bookId: "zap-blue-4",
  bookTitle: "ZAP Blue 4",
  appName: "BlueZap 4",
  unitId: "unit-02",
  unitTitle: "Unit 02 — 미래 시제 will",
};

const PAIRS = [
  ["will not", "won't"],
  ["i will", "i'll"],
  ["you will", "you'll"],
  ["he will", "he'll"],
  ["she will", "she'll"],
  ["it will", "it'll"],
  ["we will", "we'll"],
  ["they will", "they'll"],
];

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return {
    id,
    title,
    instructionKo,
    directionKo,
    ruleKo,
    answerMode,
    answerModeTag: tag,
    itemCount,
    exampleCount,
    labels,
  };
}

function ul(sentence, phrase) {
  if (!phrase) return sentence;
  const low = sentence.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return sentence;
  return sentence.slice(0, idx) + "<u>" + sentence.slice(idx, idx + phrase.length) + "</u>" + sentence.slice(idx + phrase.length);
}

function wordVariants(a) {
  const parts = a.split("|");
  const out = new Set([a]);
  function expand(s) {
    for (const [x, y] of PAIRS) {
      for (const [from, to] of [[x, y], [y, x]]) {
        const re = new RegExp("(?<![\\w'])" + from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w'])", "gi");
        if (re.test(s)) {
          const n = s.replace(re, (m) => (m[0] === m[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to));
          if (!out.has(n)) {
            out.add(n);
            expand(n);
          }
        }
      }
    }
  }
  expand(a);
  if (parts.length > 1) {
    const rev = parts.slice().reverse().join("|");
    out.add(rev);
    expand(rev);
  }
  return [...out];
}

function permBlanks(slots) {
  if (slots.length <= 1) return wordVariants(slots.join("|"));
  const res = [];
  function perm(a, l) {
    if (l === a.length) {
      res.push(a.join("|"));
      return;
    }
    for (let i = l; i < a.length; i++) {
      const t = a.slice();
      const v = t[l];
      t[l] = t[i];
      t[i] = v;
      perm(t, l + 1);
    }
  }
  perm(slots.slice(), 0);
  const all = new Set();
  for (const p of res) wordVariants(p).forEach((v) => all.add(v));
  return [...all];
}

function fillItem(id, section, label, promptEn, accept, opts) {
  opts = opts || {};
  const acc = Array.isArray(accept) ? accept : [accept];
  const item = {
    id,
    section,
    sectionTitle: opts.sectionTitle || "Section " + section,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: opts.answerMode || "words",
    answerModeTag: opts.answerModeTag || "Words · 빈칸 말만",
    label,
    type: opts.type || "fill",
    promptEn,
    accept: acc,
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  if (opts.blanks) item.blanks = opts.blanks;
  if (opts.unordered) item.unordered = true;
  if (opts.noteKo) item.noteKo = opts.noteKo;
  return Object.assign(item, opts.extra || {});
}

function mcItem(id, section, label, promptEn, choices, accept, opts) {
  opts = opts || {};
  const acc = Array.isArray(accept) ? accept : [accept];
  const item = {
    id,
    section,
    sectionTitle: opts.sectionTitle || "Section " + section,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: acc,
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  return item;
}

function sentItem(id, section, label, promptEn, answers, opts) {
  opts = opts || {};
  const acc = [];
  const seen = new Set();
  for (const a of answers) {
    for (const v of wordVariants(a)) {
      const k = v.toLowerCase().replace(/\s+/g, " ").replace(/[.?!]+$/, "");
      if (!seen.has(k)) {
        seen.add(k);
        acc.push(v.endsWith(".") || v.endsWith("?") ? v : v + (v.includes("?") ? "" : "."));
      }
    }
  }
  return fillItem(id, section, label, promptEn, acc.length ? acc : answers, {
    ...opts,
    answerMode: "sentence",
    type: "sentence",
    answerModeTag: "Sentence · 문장 전체",
  });
}

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

function labelsFrom(n, start, prefix) {
  const out = [];
  for (let i = start; i < n + start; i++) out.push(prefix + i);
  return out;
}

function koVariants(...forms) {
  return forms;
}

// —— Lesson 01 Walk 1 (pp. 37–38) ——
(function lesson01Walk1() {
  const instrA =
    "다음 문장에서 will을 찾아 동그라미 하고 동사원형을 찾아 밑줄을 치세요. will과 동사원형을 빈칸 두 칸에 쓰세요. 순서는 상관없습니다. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const rowsA = [
    ["I will take a walk in the park.", "take", "나는 공원에서 산책할 것이다."],
    ["Tony will read the magazine.", "read", "토니는 그 잡지를 읽을 것이다."],
    ["We will have lunch together.", "have", "우리는 함께 점심 식사를 할 것이다."],
    ["They will clean their classroom this afternoon.", "clean", "그들은 오늘 오후에 자기 교실을 청소할 것이다."],
    ["My sister will go shopping tomorrow.", "go", "우리 누나는 내일 쇼핑하러 갈 것이다."],
  ];
  const rowsB = [
    ["She will meet Mark at six p.m.", "She'll", "그녀는 오후 6시에 마크를 만날 것이다."],
    ["It will be cloudy this weekend.", "It'll", "이번 주말에는 날씨가 흐릴 것이다."],
    ["We will be busy today.", "We'll", "우리는 오늘 바쁠 것이다."],
    ["They will be late for school.", "They'll", "그들은 학교에 늦을 것이다."],
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", rowsA[0][0], permBlanks(["will", rowsA[0][1]]), {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: rowsA[0][2],
      }),
      "will / take"
    ),
  ];
  rowsA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r[0], permBlanks(["will", r[1]]), {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: r[2],
      })
    );
  });
  items.push(
    exItem(
      fillItem("b01", "B", "B1", "I will make a snowman.\n→ I'll make a snowman.", ["I'll", "I will"], {
        sectionInstructionKo: instrB,
        promptKo: "나는 눈사람을 만들 것이다.",
      }),
      "I'll"
    )
  );
  rowsB.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r[0] + "\n→ _____ " + r[0].replace(/^[^ ]+ /, ""), wordVariants(r[1]), {
        sectionInstructionKo: instrB,
        promptKo: r[2],
      })
    );
  });
  write("lesson01-walk1.json", {
    practiceId: "b4:u02:lesson01-walk1",
    title: "Lesson 01 Walk 1 — 미래 시제 will",
    subtitle: "will + 동사원형 · 축약형 (pp. 37–38)",
    pages: "37–38",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo:
      "Section A 5문항(will과 동사원형, 순서 무관), Section B 4문항(I'll/She'll 등 축약). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장에서 will을 찾아 동그라미 하고 동사원형을 찾아 밑줄을 치세요.", "will과 동사원형을 빈칸 두 칸에 쓰세요. 순서는 상관없습니다.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 01 Walk 2 (pp. 39–40) ——
(function lesson01Walk2() {
  const instrA =
    "다음 문장에서 will not을 찾아 동그라미 하고 동사원형을 찾아 밑줄을 치세요. will not과 동사원형을 빈칸 두 칸에 쓰세요. 순서는 상관없습니다. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요. won't 축약형을 쓸 수 있습니다. 빈칸에 들어갈 말만 쓰세요.";
  const rowsA = [
    ["I will not take a taxi.", "take", "나는 택시를 타지 않을 것이다."],
    ["Jane will not watch TV this evening.", "watch", "제인은 오늘 저녁에 TV를 보지 않을 것이다."],
    ["The weather will not be nice today.", "be", "오늘 날씨가 좋지 않을 것이다."],
    ["They will not go swimming tomorrow.", "go", "그들은 내일 수영하러 가지 않을 것이다."],
    ["The children will not play outside today.", "play", "그 아이들은 오늘 밖에서 놀지 않을 것이다."],
  ];
  const rowsB = [
    ["He will not climb the mountain next Sunday.", "won't", "그는 다음 일요일에 그 산을 오르지 않을 것이다."],
    ["Maria will not visit her grandfather this weekend.", "won't", "마리아는 이번 주말에 할아버지를 찾아뵙지 않을 것이다."],
    ["We will not learn French this year.", "won't", "우리는 올해 프랑스어를 배우지 않을 것이다."],
    ["They will not travel to Japan.", "won't", "그들은 일본으로 여행하지 않을 것이다."],
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", rowsA[0][0], permBlanks(["will not", rowsA[0][1]]), {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: rowsA[0][2],
      }),
      "will not / take"
    ),
  ];
  rowsA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r[0], permBlanks(["will not", r[1]]), {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: r[2],
      })
    );
  });
  items.push(
    exItem(
      fillItem("b01", "B", "B1", "I will not take a shower tonight.\n→ I won't take a shower tonight.", ["won't", "will not"], {
        sectionInstructionKo: instrB,
        promptKo: "나는 오늘 밤에 샤워하지 않을 것이다.",
      }),
      "won't"
    )
  );
  rowsB.forEach((r, i) => {
    const tail = r[0].replace(/^[^ ]+ [^ ]+ [^ ]+ /, "");
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r[0] + "\n→ _____ " + tail, wordVariants(r[1]), {
        sectionInstructionKo: instrB,
        promptKo: r[2],
      })
    );
  });
  write("lesson01-walk2.json", {
    practiceId: "b4:u02:lesson01-walk2",
    title: "Lesson 01 Walk 2 — 미래 시제 will",
    subtitle: "will not · won't (pp. 39–40)",
    pages: "39–40",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 5문항(will not + 동사), Section B 4문항(won't 축약). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장에서 will not을 찾아 동그라미 하고 동사원형을 찾아 밑줄을 치세요.", "will not과 동사원형을 빈칸 두 칸에 쓰세요. 순서는 상관없습니다.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

require("./unit02-body")({
  META,
  sec,
  ul,
  fillItem,
  mcItem,
  sentItem,
  exItem,
  write,
  wordVariants,
  permBlanks,
  labelsFrom,
});

console.log("Done —", OUT);
