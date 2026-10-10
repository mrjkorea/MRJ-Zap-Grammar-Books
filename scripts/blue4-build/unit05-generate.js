/* Generate data/blue4/unit05/*.json — run: node scripts/blue4-build/unit05-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue4/unit05");
const META = {
  bookId: "zap-blue-4",
  bookTitle: "ZAP Blue 4",
  appName: "BlueZap 4",
  unitId: "unit-05",
  unitTitle: "Unit 05 — 비교 — 최상급",
};

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

function fillItem(id, section, label, promptEn, accept, opts) {
  opts = opts || {};
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
    accept: Array.isArray(accept) ? accept : [accept],
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  if (opts.noteKo) item.noteKo = opts.noteKo;
  if (opts.blanks) item.blanks = opts.blanks;
  if (opts.unordered) item.unordered = true;
  if (opts.example) item.example = true;
  if (opts.displayOnly) item.displayOnly = true;
  if (opts.exampleAnswer) item.exampleAnswer = opts.exampleAnswer;
  return item;
}

function mcItem(id, section, label, promptEn, choices, accept, opts) {
  opts = opts || {};
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
    accept: Array.isArray(accept) ? accept : [accept],
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  return item;
}

function underlineInSentence(sentence, phrase) {
  if (!phrase) return sentence;
  const low = sentence.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return sentence;
  return sentence.slice(0, idx) + "<u>" + sentence.slice(idx, idx + phrase.length) + "</u>" + sentence.slice(idx + phrase.length);
}

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function dualBlank(id, section, label, promptEn, left, right, opts) {
  return fillItem(id, section, label, promptEn, [left + "|" + right], Object.assign({ blanks: 2, unordered: true }, opts));
}

function theSup(word, alts) {
  const w = "the " + word;
  const a = alts ? alts.map((x) => "the " + x) : [];
  return [w, word, ...a];
}

function syncSections(sections, items) {
  for (const s of sections) {
    const inSec = items.filter((it) => it.section === s.id);
    const graded = inSec.filter((it) => !it.displayOnly);
    s.itemCount = graded.length;
    s.exampleCount = inSec.filter((it) => it.displayOnly).length;
    s.labels = graded.map((it) => it.label);
  }
}

function write(name, data) {
  syncSections(data.sections, data.items);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

function mcFromParen(id, sec, label, en, choices, ansIdx, instr) {
  const ch = choices;
  return mcItem(id, sec, label, en, ch, [ch[ansIdx], String(ansIdx + 1)], { sectionInstructionKo: instr });
}

function mcTwoCol(id, sec, label, en, ko, left, right, pickRight, instr) {
  const ch = [left, right];
  const idx = pickRight ? 1 : 0;
  return mcItem(id, sec, label, en, ch, [ch[idx], String(idx + 1)], { sectionInstructionKo: instr, promptKo: ko });
}


// —— Lesson 01 Walk 1 (pp. 115–116) ——
(function lesson01Walk1() {
  const instrA =
    "다음 문장에서 형용사나 부사의 최상급을 찾아 동그라미 하세요. 동그라미 친 최상급만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "빈칸에 알맞은 규칙을 써넣고 주어진 형용사나 부사의 최상급을 쓰세요. 앞 칸에는 붙이는 말(예: est), 뒤 칸에는 the가 붙은 최상급 전체를 쓰세요.";
  const items = [
    exItem(fillItem("a01", "A", "A1", "It was the coldest day of year.", ["coldest"], { sectionInstructionKo: instrA }), "coldest"),
    fillItem("a02", "A", "A2", "This shirt is the smallest in the store.", ["smallest"], { sectionInstructionKo: instrA }),
    fillItem("a03", "A", "A3", "Jane is the tallest in my family.", ["tallest"], { sectionInstructionKo: instrA }),
    fillItem("a04", "A", "A4", "The Nile is the longest river in the world.", ["longest"], { sectionInstructionKo: instrA }),
    fillItem("a05", "A", "A5", "The turtle ran the fastest of them all.", ["fastest"], { sectionInstructionKo: instrA }),
    exItem(
      fillItem("b01", "B", "B1", "young + ______ → ______", ["est|the youngest", "+est|the youngest"], {
        sectionInstructionKo: instrB,
        blanks: 2,
      }),
      "est / the youngest"
    ),
  ];
  const bWords = [
    ["old", "est", "the oldest"],
    ["smart", "est", "the smartest"],
    ["fast", "est", "the fastest"],
    ["high", "est", "the highest"],
    ["slow", "est", "the slowest"],
    ["long", "est", "the longest"],
    ["tall", "est", "the tallest"],
    ["hard", "est", "the hardest"],
    ["short", "est", "the shortest"],
  ];
  bWords.forEach((w, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), w[0] + " + ______ → ______", [
        w[1] + "|" + w[2],
        "+" + w[1] + "|" + w[2],
      ], { sectionInstructionKo: instrB, blanks: 2 })
    );
  });
  write("lesson01-walk1.json", {
    practiceId: "b4:u05:lesson01-walk1",
    title: "Lesson 01 Walk 1 — 최상급 (1)",
    subtitle: "최상급 찾기·만들기 (pp. 115–116)",
    pages: "115–116",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo:
      "Section A 5문항(동그라미 친 최상급), Section B 10문항(규칙+최상급 두 칸). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "형용사·부사의 최상급을 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 5, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "규칙과 최상급을 쓰세요.", "앞 칸: est 등, 뒤 칸: the+최상급", "words", "Words · 빈칸 말만", 10, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11"]),
    ],
    items,
  });
})();

// —— Lesson 01 Walk 2 (p. 118) ——
(function lesson01Walk2() {
  const instrA =
    "다음 문장에서 형용사나 부사의 최상급을 찾아 동그라미 하세요. 동그라미 친 최상급만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "빈칸에 알맞은 규칙을 써넣고 주어진 형용사나 부사의 최상급을 쓰세요. 앞 칸에는 붙이는 말, 뒤 칸에는 the가 붙은 최상급 전체를 쓰세요.";
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "Ms. Kim is the kindest teacher in my school.", ["kindest"], { sectionInstructionKo: instrA }),
      "kindest"
    ),
    fillItem("a02", "A", "A2", "It is the prettiest village.", ["prettiest"], { sectionInstructionKo: instrA }),
    fillItem("a03", "A", "A3", "This castle is the biggest.", ["biggest"], { sectionInstructionKo: instrA }),
    fillItem("a04", "A", "A4", "His room is the dirtiest in the house.", ["dirtiest"], { sectionInstructionKo: instrA }),
    fillItem("a05", "A", "A5", "That cat is the fattest in the pet shop.", ["fattest"], { sectionInstructionKo: instrA }),
    exItem(
      fillItem("b01", "B", "B1", "happy + ______ → ______", ["iest|the happiest", "+iest|the happiest"], {
        sectionInstructionKo: instrB,
        blanks: 2,
      }),
      "iest / the happiest"
    ),
    exItem(
      fillItem("b02", "B", "B2", "wise + ______ → ______", ["st|the wisest", "+st|the wisest"], { sectionInstructionKo: instrB, blanks: 2 }),
      "st / the wisest"
    ),
  ];
  const bRest = [
    ["safe", "st", "the safest"],
    ["busy", "iest", "the busiest"],
    ["lucky", "iest", "the luckiest"],
    ["wet", "est", "the wettest"],
    ["fat", "est", "the fattest"],
    ["heavy", "iest", "the heaviest"],
    ["thin", "est", "the thinnest"],
    ["early", "est", "the earliest"],
  ];
  bRest.forEach((w, i) => {
    items.push(
      fillItem("b" + String(i + 3).padStart(2, "0"), "B", "B" + (i + 3), w[0] + " + ______ → ______", [
        w[1] + "|" + w[2],
        "+" + w[1] + "|" + w[2],
      ], { sectionInstructionKo: instrB, blanks: 2 })
    );
  });
  write("lesson01-walk2.json", {
    practiceId: "b4:u05:lesson01-walk2",
    title: "Lesson 01 Walk 2 — 최상급 (1)",
    subtitle: "최상급 찾기·만들기 (p. 118)",
    pages: "118",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 5문항, Section B 10문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "최상급을 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 5, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "규칙과 최상급을 쓰세요.", "두 칸에 나누어 쓰세요.", "words", "Words · 빈칸 말만", 10, 2, ["B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12"]),
    ],
    items,
  });
})();

(function lesson01Run() {
  const instrA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aData = [
    ["Amy is ( tallest / the tallest ) girl of the three.", ["tallest", "the tallest"], 1],
    ["The car is ( the oldest / the olddest ) in the city.", ["the oldest", "the olddest"], 0],
    ["The dog is ( the smallest / smallst ) in the store.", ["the smallest", "smallst"], 0],
    ["It is ( the highest / the hightest ) mountain in the country.", ["the highest", "the hightest"], 0],
    ["His feet are ( the biggest / the bigest ) in my family.", ["the biggest", "the bigest"], 0],
    ["It is ( the sweettest / the sweetest ) bread in the bakery.", ["the sweettest", "the sweetest"], 1],
    ["He is ( the wisest / the wiseest ) man in the village.", ["the wisest", "the wiseest"], 0],
    ["Joe came home ( the earliest / earlyest ) in his family.", ["the earliest", "earlyest"], 0],
    ["It is ( the sadest / the saddest ) movie of them all.", ["the sadest", "the saddest"], 1],
    ["Junsu is ( the laziest / the lazyest ) boy of my friends.", ["the laziest", "the lazyest"], 0],
    ["Mr. Bean is ( the funniest / funnyest ) man in England.", ["the funniest", "funnyest"], 0],
    ["Lucy is ( the youngest / youngst ) in the team.", ["the youngest", "youngst"], 0],
    ["The skirt is ( the shortest / the shorttest ) of all my skirts.", ["the shortest", "the shorttest"], 0],
    ["It is ( the easiest / the easyest ) of all the questions.", ["the easiest", "the easyest"], 0],
    ["Pluto ran ( the fastest / fastist ) of all the dogs.", ["the fastest", "fastist"], 0],
  ];
  const items = aData.map((row, i) =>
    mcFromParen("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), row[0], row[1], row[2], instrA)
  );
  const bData = [
    ["This room is the ______ in the house.", "이 방이 그 집에서 가장 크다.", "largest", "largestest"],
    ["Today is the ______ day of the week.", "오늘이 일주일 중 가장 추운 날이다.", "coldest", "colddest"],
    ["Carol's bag is the ______ of them all.", "캐롤의 가방이 그것들 중에서 가장 무겁다.", "heaviest", "heavyest"],
    ["This coat is the ______ in the store.", "이 외투가 그 가게에서 가장 크다.", "biggest", "big"],
    ["Mark finished the ______ of us all.", "마크가 우리 중에서 그것을 가장 빨리 끝냈다.", "fastest", "fasttest"],
    ["The bear is the ______ of the three.", "그 곰이 셋 중에서 가장 말랐다.", "thinnest", "thinest"],
    ["This hairpin is the ______ of them all.", "이 머리핀이 그것들 중에서 가장 예쁘다.", "prettiest", "prettest"],
    ["Mr. Gold is ______ man in the village.", "골드 씨가 그 마을에서 제일 부자이다.", "the richest", "richest"],
    ["Daegu is the ______ city in Korea.", "대구는 한국에서 가장 더운 도시이다.", "hottest", "hotest"],
    ["Mom is the ______ in my family.", "엄마가 우리 가족 중에서 가장 바쁘시다.", "busiest", "busyest"],
    ["Superman is the ______ in the world.", "슈퍼맨이 세상에서 힘이 제일 세다.", "strongest", "stronggest"],
    ["This cat is the ______ of their pets.", "이 고양이가 그들의 애완동물 중에서 제일 뚱뚱하다.", "fattest", "fatest"],
    ["Alice's hair is the ______.", "앨리스의 머리가 가장 길다.", "longest", "longgest"],
    ["I bought ______ shoes there.", "나는 거기에서 가장 싼 신발을 샀다.", "the cheapest", "cheapest"],
    ["She studied science the ______.", "그녀는 과학을 제일 열심히 공부했다.", "hardest", "harddest"],
  ];
  bData.forEach((row, i) => {
    items.push(mcTwoCol("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), row[0], row[1], row[2], row[3], false, instrB));
  });
  write("lesson01-run.json", {
    practiceId: "b4:u05:lesson01-run",
    title: "Lesson 01 Run — 최상급 (1)",
    subtitle: "Grammar Run (pp. 119–120)",
    pages: "119–120",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항, Section B 15문항. 괄호·보기에서 골라 누르세요.",
    sections: [
      sec("A", "Section A", instrA, "괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, Array.from({ length: 15 }, (_, i) => "A" + (i + 1))),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, Array.from({ length: 15 }, (_, i) => "B" + (i + 1))),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson01Jump() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const jumpA = [
    [underlineInSentence("Sumin is the youngest in the team.", "the youngest"), ["가장 어린", "제일 어린", "가장 어리다"]],
    [underlineInSentence("It is the widest road in the city.", "the widest"), ["가장 넓은", "제일 넓은"]],
    [underlineInSentence("That box is the smallest of them all.", "the smallest"), ["가장 작은", "제일 작은"]],
    [underlineInSentence("Jim was the happiest boy in the village.", "the happiest"), ["가장 행복한", "제일 행복한"]],
    [underlineInSentence("The South Pole has the cleanest air.", "the cleanest"), ["가장 깨끗한", "제일 깨끗한"]],
    [underlineInSentence("This pizza is the largest in the village.", "the largest"), ["가장 큰", "제일 큰"]],
    [underlineInSentence("This is the hardest question of them all.", "the hardest"), ["가장 어려운", "제일 어려운"]],
    [underlineInSentence("He is the greatest soccer player in the world.", "the greatest"), ["가장 위대한", "제일 위대한"]],
    [underlineInSentence("The cheetah runs the fastest in the zoo.", "the fastest"), ["가장 빨리", "제일 빨리", "가장 빠르게"]],
    [underlineInSentence("Mt. Everest is the highest mountain.", "the highest"), ["가장 높은", "제일 높은"]],
    [underlineInSentence("They are the biggest sneakers there.", "the biggest"), ["가장 큰", "제일 큰"]],
    [underlineInSentence("Luna's suitcase is the heaviest of them all.", "the heaviest"), ["가장 무거운", "제일 무거운"]],
    [underlineInSentence("This train leaves the earliest from the station.", "the earliest"), ["가장 일찍", "제일 일찍", "가장 먼저"]],
    [underlineInSentence("It was the wettest day of the week.", "the wettest"), ["가장 비가 많이 온", "제일 비가 많이 온"]],
    [underlineInSentence("That pig is the fattest in the cage.", "the fattest"), ["가장 뚱뚱한", "제일 뚱뚱한"]],
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", jumpA[0][0], jumpA[0][1], { sectionInstructionKo: instrA }),
      "가장 어린"
    ),
  ];
  jumpA.slice(1).forEach((row, i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], row[1], { sectionInstructionKo: instrA }));
  });
  const jumpB = [
    ["Sally is ______ ______ girl in her class. ( pretty )", "샐리는 자기 반에서 가장 예쁜 여자아이다.", "the|prettiest", true],
    ["Minho's kite flew ______ ______ of the four. ( high )", "민호의 연이 넷 중에서 가장 높이 날았다.", "the|highest"],
    ["That lamp is ______ ______ in the room. ( bright )", "저 등이 그 방에서 가장 밝다.", "the|brightest"],
    ["This scarf is ______ ______ of the five. ( long )", "이 목도리가 다섯 개 중에서 가장 길다.", "the|longest"],
    ["Jane studied math ______ ______. ( hard )", "제인은 수학을 제일 열심히 공부했다.", "the|hardest"],
    ["Today is ______ ______ day. ( happy )", "오늘이 가장 행복한 날이다.", "the|happiest"],
    ["That backpack is ______ ______ of the three. ( light )", "저 배낭이 셋 중에서 가장 가볍다.", "the|lightest"],
    ["That room is ______ ______ in this hotel. ( large )", "저 방이 이 호텔에서 가장 크다.", "the|largest"],
    ["This book is ______ ______ of the three. ( easy )", "이 책이 셋 중에서 가장 쉽다.", "the|easiest"],
    ["It was ______ ______ day of the month. ( hot )", "그달 중에서 가장 더운 날이었다.", "the|hottest"],
    ["That necktie is ______ ______ of the three. ( nice )", "저 넥타이가 셋 중에서 가장 좋다.", "the|nicest"],
    ["This cartoon is ______ ______ of them all. ( funny )", "이 만화 영화가 그것들 중에서 가장 재미있다.", "the|funniest"],
    ["It is ______ ______ sheep on the farm. ( thin )", "그것은 그 농장에서 가장 마른 양이다.", "the|thinnest"],
    ["That is ______ ______ chair in the room. ( strong )", "저것은 그 방에서 가장 튼튼한 의자이다.", "the|strongest"],
    ["Your room is ______ ______ in the house. ( dirty )", "네 방이 집에서 가장 더럽다.", "the|dirtiest"],
  ];
  jumpB.forEach((row, i) => {
    const id = "b" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "B", "B" + (i + 1), row[0], [row[2]], {
      sectionInstructionKo: instrB,
      promptKo: row[1],
      blanks: 2,
    });
    items.push(row[3] ? exItem(base, "the / prettiest") : base);
  });
  write("lesson01-jump.json", {
    practiceId: "b4:u05:lesson01-jump",
    title: "Lesson 01 Jump — 최상급 (1)",
    subtitle: "Grammar Jump (pp. 121–122)",
    pages: "121–122",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항(우리말), Section B 15문항(두 칸 완성). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분의 우리말 뜻을 쓰세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "주어진 말로 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson01Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 밑줄 친 말을 최상급으로 바꿔 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const flyA = [
    ["The rabbit has <u>longest</u> ears of the five.", "the|longest", true],
    ["This streetlamp is <u>the olddest</u> in town.", "the|oldest"],
    ["This cake is <u>the sweetst</u> in the bakery.", "the|sweetest"],
    ["Tom has <u>the shorttest</u> hair of us all.", "the|shortest"],
    ["The car is <u>the fasttest</u> of them all.", "the|fastest"],
    ["This coat is <u>the bigest</u> in the store.", "the|biggest"],
    ["Jun is <u>the kinddest</u> boy in my school.", "the|kindest"],
    ["Dad goes to bed <u>the earlyest</u> in my family.", "the|earliest"],
    ["This quiz was <u>the easyest</u> of them all.", "the|easiest"],
    ["It was <u>the funnyest</u> movie of them all.", "the|funniest"],
    ["Alice is <u>the cuteest</u> girl in her class.", "the|cutest"],
    ["August was <u>the hotest</u> month of the year.", "the|hottest"],
    ["This is <u>the heavyest</u> bottle of the four.", "the|heaviest"],
    ["The cat is <u>the fatest</u> of them all.", "the|fattest"],
    ["It is <u>the busyest</u> street in the village.", "the|busiest"],
  ];
  const items = [];
  flyA.forEach((row, i) => {
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "A", "A" + (i + 1), row[0], [row[1]], { sectionInstructionKo: instrA, blanks: 2 });
    items.push(row[2] ? exItem(base, "the / longest") : base);
  });
  const flyB = [
    ["Baekdusan is a <u>high</u> mountain. → ______ ______ in Korea.", "the|highest", true, "백두산은 한국에서 가장 높은 산이다."],
    ["Ms. Wise was a <u>wise</u> lady. → ______ ______ in the village.", "the|wisest", false, "와이즈 부인은 마을에서 가장 지혜로운 여성이었다."],
    ["Jack is a <u>lazy</u> boy. → ______ ______ in the village.", "the|laziest", false, "잭은 마을에서 가장 게으른 남자아이다."],
    ["This is a <u>large</u> swimming pool. → ______ ______ in the country.", "the|largest", false, "이것은 그 나라에서 가장 큰 수영장이다."],
    ["Maria is <u>tall</u>. → ______ ______ of all the students.", "the|tallest", false, "마리아는 모든 학생 중에서 가장 키가 크다."],
    ["Summer is <u>hot</u>. → ______ ______ of the four seasons.", "the|hottest", false, "여름은 네 계절 중에서 가장 덥다."],
    ["The white car is <u>new</u>. → ______ ______ of the three.", "the|newest", false, "하얀 차가 셋 중에서 가장 새롭다."],
    ["The basketball is <u>big</u>. → ______ ______ of the five.", "the|biggest", false, "농구공이 다섯 개 중에서 가장 크다."],
    ["My mother gets up <u>early</u>. → ______ ______ in my family.", "the|earliest", false, "우리 어머니가 가족 중에서 가장 일찍 일어난다."],
    ["Ostriches run <u>fast</u>. → ______ ______ of all the birds.", "the|fastest", false, "타조가 모든 새 중에서 가장 빨리 달린다."],
    ["I study English <u>hard</u>. → ______ ______ in my class.", "the|hardest", false, "나는 우리 반에서 영어를 가장 열심히 공부한다."],
    ["Blanca jumps <u>high</u>. → ______ ______ in the world.", "the|highest", false, "블랑카는 세계에서 가장 높이 뛴다."],
  ];
  flyB.forEach((row, i) => {
    const id = "b" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "B", "B" + (i + 1), row[0], [row[1]], {
      sectionInstructionKo: instrB,
      promptKo: row[3],
      blanks: 2,
    });
    items.push(row[2] ? exItem(base, "the / highest") : base);
  });
  write("lesson01-fly.json", {
    practiceId: "b4:u05:lesson01-fly",
    title: "Lesson 01 Fly — 최상급 (1)",
    subtitle: "Grammar Fly (pp. 123–124)",
    pages: "123–124",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항(고치기), Section B 12문항(최상급으로 바꾸기). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분을 바르게 고쳐 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "밑줄 친 말을 최상급으로 바꿔 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 12, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12"]),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson02Walk1() {
  const instrA =
    "다음 문장에서 최상급을 찾아 동그라미 하세요. 동그라미 친 최상급만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 형용사나 부사의 최상급을 빈칸에 쓰세요. the가 붙은 최상급 전체를 쓰세요.";
  const items = [
    fillItem("a01", "A", "A1", "The snail moves the most slowly of the five.", ["most slowly", "the most slowly"], { sectionInstructionKo: instrA }),
    fillItem("a02", "A", "A2", "It was the worst of all the holidays.", ["worst", "the worst"], { sectionInstructionKo: instrA }),
    fillItem("a03", "A", "A3", "This flower is the most beautiful in the garden.", ["most beautiful", "the most beautiful"], { sectionInstructionKo: instrA }),
    fillItem("a04", "A", "A4", "You are the most diligent student in the class.", ["most diligent", "the most diligent"], { sectionInstructionKo: instrA }),
    fillItem("a05", "A", "A5", "Pooh is the most famous bear in the zoo.", ["most famous", "the most famous"], { sectionInstructionKo: instrA }),
    exItem(
      fillItem("b01", "B", "B1", "difficult → ______", ["the most difficult"], { sectionInstructionKo: instrB }),
      "the most difficult"
    ),
  ];
  const bRest = [
    ["quickly", ["the most quickly"]],
    ["expensive", ["the most expensive"]],
    ["well", ["the best"]],
    ["interesting", ["the most interesting"]],
    ["bad", ["the worst"]],
    ["beautifully", ["the most beautifully"]],
    ["many", ["the most"]],
    ["slowly", ["the most slowly"]],
    ["far", ["the farthest", "the furthest"]],
  ];
  bRest.forEach((w, i) => {
    items.push(fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), w[0] + " → ______", w[1], { sectionInstructionKo: instrB }));
  });
  write("lesson02-walk1.json", {
    practiceId: "b4:u05:lesson02-walk1",
    title: "Lesson 02 Walk 1 — 최상급 (2)",
    subtitle: "최상급 표현 (p. 126)",
    pages: "126",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 5문항, Section B 10문항. 예시 1개는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "최상급을 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 5, 0, ["A1", "A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "최상급을 쓰세요.", "the+최상급 전체를 쓰세요.", "words", "Words · 빈칸 말만", 10, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11"]),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson02Walk2() {
  const instrA =
    "다음 문장에서 최상급을 찾아 밑줄을 치고 비교의 범위를 나타내는 말을 찾아 동그라미 하세요. 앞 칸에는 최상급(구), 뒤 칸에는 in/of 등 비교 범위를 쓰세요. (순서는 바꿔도 됩니다.)";
  const walkA = [
    ["Jane is the kindest girl in her class.", ["the kindest|in her class"], true],
    ["You are the smartest of all the students.", ["the smartest|of all the students"]],
    ["This elephant is the biggest animal in this zoo.", ["the biggest|in this zoo", "the biggest animal|in this zoo"]],
    ["Grandfather is the wisest in my family.", ["the wisest|in my family"]],
    ["Ron wrote the most letters of the three children.", ["the most|of the three children", "most|of the three children"]],
    ["This restaurant is the most expensive in the village.", ["the most expensive|in the village"]],
    ["You sang the best of all the children.", ["the best|of all the children"]],
    ["Jeju is the largest island in Korea.", ["the largest|in Korea", "the largest island|in Korea"]],
    ["It is the tallest tower in the world.", ["the tallest|in the world", "the tallest tower|in the world"]],
    ["Alice is the best cook of the three.", ["the best|of the three", "best cook|of the three"]],
    ["Oranges are the sweetest of them all.", ["the sweetest|of them all"]],
    ["The watermelon is the biggest of those fruits.", ["the biggest|of those fruits"]],
  ];
  const items = [];
  walkA.forEach((row, i) => {
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "A", "A" + (i + 1), row[0], row[1], {
      sectionInstructionKo: instrA,
      blanks: 2,
      unordered: true,
    });
    items.push(row[2] ? exItem(base, "the kindest / in her class") : base);
  });
  write("lesson02-walk2.json", {
    practiceId: "b4:u05:lesson02-walk2",
    title: "Lesson 02 Walk 2 — 최상급 (2)",
    subtitle: "최상급과 비교 범위 (p. 128)",
    pages: "128",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 12문항(최상급+비교 범위 두 칸). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "최상급과 비교 범위를 쓰세요.", "두 칸에 나누어 쓰세요.", "words", "Words · 빈칸 말만", 12, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12"]),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson02Run() {
  const instrA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aData = [
    ["John is ( the handsomest / the most handsome ) boy in his class.", ["the handsomest", "the most handsome"], 1],
    ["I shouted ( the loudlyest / the most loudly ) of the five.", ["the loudlyest", "the most loudly"], 1],
    ["She sings ( the beautifullest / the most beautifully ) in her school.", ["the beautifullest", "the most beautifully"], 1],
    ["The last question was ( the most difficult / the difficultest ) of all.", ["the most difficult", "the difficultest"], 0],
    ["Henry's Steak is ( the baddest / the worst ) restaurant in the city.", ["the baddest", "the worst"], 1],
    ["Jaemin is ( popularest / the most popular ) in his class.", ["popularest", "the most popular"], 1],
    ["She is sitting on ( the most comfortable / the comfortablest ) chair here.", ["the most comfortable", "the comfortablest"], 0],
    ["Carl was ( the best / the most good ) cook of the five.", ["the best", "the most good"], 0],
    ["The bicycle is ( the most expensive / the expensivest ) of the three.", ["the most expensive", "the expensivest"], 0],
    ["Ken is ( the best / best ) player in the team.", ["the best", "best"], 0],
    ["It is ( most useful / the most useful ) book of the three.", ["most useful", "the most useful"], 1],
    ["The game was ( the excitingest / the most exciting ) of them all.", ["the excitingest", "the most exciting"], 1],
    ["That is ( the boring / the most boring ) of all the movies.", ["the boring", "the most boring"], 1],
    ["My house is ( the farest / the farthest ) from here.", ["the farest", "the farthest"], 1],
    ["Koalas are ( the most interesting / most interesting ) animals of all.", ["the most interesting", "most interesting"], 0],
  ];
  const items = aData.map((row, i) =>
    mcFromParen("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), row[0], row[1], row[2], instrA)
  );
  const bRows = [
    ["I like ice cream the ______ of all the desserts.", ["much", "most"], 1],
    ["She is the ______ teacher in the school.", ["best", "goodest"], 0],
    ["Eddy is the ______ student in the class.", ["badest", "worst"], 1],
    ["The baby is the smallest ______ his family.", ["for", "in"], 1],
    ["Seoul is the largest city ______ Korea.", ["in", "about"], 0],
    ["Seattle is the most beautiful city ______ the U.S.", ["in", "about"], 0],
    ["That city is the ______ from Seoul of the three.", ["farthest", "farest"], 0],
    ["Tommy likes history the ______.", ["most", "much"], 0],
    ["February is the shortest month ______ the year.", ["of", "about"], 0],
    ["He had ______ money of the four.", ["least", "the least"], 1],
    ["Harry speaks English the ______ of all the boys.", ["best", "well"], 0],
    ["The ball is the cheapest ______ the five.", ["of", "with"], 0],
    ["Hyuk dances the ______ in the village.", ["best", "good"], 0],
    ["The cat is the quietest ______ the three animals.", ["of", "to"], 0],
    ["Steve read the ______ books of us all.", ["most", "maniest"], 0],
  ];
  bRows.forEach((row, i) => {
    items.push(
      mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), row[0], row[1], [row[1][row[2]], String(row[2] + 1)], {
        sectionInstructionKo: instrB,
      })
    );
  });
  write("lesson02-run.json", {
    practiceId: "b4:u05:lesson02-run",
    title: "Lesson 02 Run — 최상급 (2)",
    subtitle: "Grammar Run (pp. 129–130)",
    pages: "129–130",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항, Section B 15문항. 보기에서 골라 누르세요.",
    sections: [
      sec("A", "Section A", instrA, "괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, Array.from({ length: 15 }, (_, i) => "A" + (i + 1))),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, Array.from({ length: 15 }, (_, i) => "B" + (i + 1))),
    ],
    items,
  });
})();


// —— Lesson 02 Jump (pp. 131–132) ——

(function lesson02Jump() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const jumpA = [
    [underlineInSentence("This cartoon is the most interesting of all.", "the most interesting"), ["가장 재미있는", "제일 재미있는"]],
    [underlineInSentence("Sally likes cheesecake the most of all.", "the most"), ["가장", "제일", "가장 많이"]],
    [underlineInSentence("A turtle walks the most slowly of all the animals.", "the most slowly"), ["가장 느리게", "제일 느리게", "가장 천천히"]],
    [underlineInSentence("She is the most popular singer in the world.", "the most popular"), ["가장 인기 있는", "제일 인기 있는"]],
    [underlineInSentence("Dogs are the best pets of all.", "the best"), ["가장 좋은", "제일 좋은", "최고의"]],
    [underlineInSentence("He finished it the most quickly in the class.", "the most quickly"), ["가장 빨리", "제일 빨리"]],
    [underlineInSentence("It is the most famous song in Korea.", "the most famous"), ["가장 유명한", "제일 유명한"]],
    [underlineInSentence("Sharks are the most dangerous animals in the sea.", "the most dangerous"), ["가장 위험한", "제일 위험한"]],
    [underlineInSentence("She spoke to us the most kindly of all the women.", "the most kindly"), ["가장 친절하게", "제일 친절하게"]],
    [underlineInSentence("I like bananas the least of all fruits.", "the least"), ["가장 덜", "제일 덜", "가장 좋아하지 않는"]],
    [underlineInSentence("Mike hit the ball the farthest of all the players.", "the farthest"), ["가장 멀리", "제일 멀리"]],
    [underlineInSentence("The little girl danced the worst of the six.", "the worst"), ["가장 못", "제일 못", "가장 나쁘게"]],
    [underlineInSentence("This jacket is the most expensive in the store.", "the most expensive"), ["가장 비싼", "제일 비싼"]],
    [underlineInSentence("My sister is the most careful driver in my family.", "the most careful"), ["가장 조심하는", "제일 조심하는", "가장 운전을 조심하는"]],
    [underlineInSentence("The peacock is the most colorful of all the birds.", "the most colorful"), ["가장 화려한", "제일 화려한", "가장 색이 많은"]],
  ];
  const items = [
    exItem(fillItem("a01", "A", "A1", jumpA[0][0], jumpA[0][1], { sectionInstructionKo: instrA }), "가장 재미있는"),
  ];
  jumpA.slice(1).forEach((row, i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], row[1], { sectionInstructionKo: instrA }));
  });
  const jumpB = [
    ["I am ______ ______ in my class. ( short, in )", "the|shortest|in", 3, true],
    ["Tom is ______ ______ boy ______ my class. ( tall, in )", "the|tallest|in", 3],
    ["He is ______ ______ player ______ the team. ( good, in )", "the|best|in", 3],
    ["It is ______ ______ building ______ the village. ( old, in )", "the|oldest|in", 3],
    ["The monkey ate ______ ______ bananas of the five. ( little )", "the|least", 2],
    ["Annie is ______ ______ ______ all the girls. ( cute, of )", "the|cutest|of", 3],
    ["My mom's food is ______ ______ ______.", "the|most|delicious", 3],
    ["Joe read ______ ______ ______ books of the four boys. ( many )", "the|most", 2],
    ["My sister likes lilies ______ ______ of all the flowers. ( much )", "the|most", 2],
    ["Tim came to school ______ ______ ______ us all. ( early, of )", "the|earliest|of", 3],
    ["The show is ______ ______ ______ ______ of the six. ( interesting )", "the|most|interesting", 3],
    ["Laura cooks ______ ______ ______ all the girls. ( well, of )", "the|best|of", 3],
    ["Yesterday was ______ ______ ______ day ______ the year. ( hot, of )", "the|hottest|of", 3],
    ["He is ______ ______ man ______ the village. ( old, in )", "the|oldest|in", 3],
    ["Her paper plane flew ______ ______ of them all. ( far )", "the|farthest", 2, false, "the|furthest"],
  ];
  jumpB.forEach((row, i) => {
    const id = "b" + String(i + 1).padStart(2, "0");
    const acc = row[4] ? [row[1], row[4]] : [row[1]];
    const base = fillItem(id, "B", "B" + (i + 1), row[0], acc, { sectionInstructionKo: instrB, blanks: row[2] });
    items.push(row[3] ? exItem(base, "the / shortest / in") : base);
  });
  write("lesson02-jump.json", {
    practiceId: "b4:u05:lesson02-jump",
    title: "Lesson 02 Jump — 최상급 (2)",
    subtitle: "Grammar Jump (pp. 131–132)",
    pages: "131–132",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항(우리말), Section B 15문항(완성). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분의 우리말 뜻을 쓰세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "주어진 말로 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();


// —— Lesson 02 Fly (pp. 133–134) ——

(function lesson02Fly() {
  const instrA =
    "다음 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 밑줄 친 말을 최상급으로 바꿔 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const flyA = [
    ["The bakery is <u>the famousest</u> in this village.", ["the most famous", "the|most|famous"], 3, true],
    ["The dictionary is <u>the usefulest</u> of the three.", ["the most useful", "the|most|useful"], 3],
    ["My sister eats food <u>the slowliest</u> in my family.", ["the most slowly", "the|most|slowly"], 3],
    ["He talked <u>the most much</u> of all the people.", ["the most", "most"], 1],
    ["She cried <u>the loudlyest</u> of the three babies.", ["the most loudly", "the|most|loudly"], 3],
    ["Jun dances <u>the most badly</u> in the team.", ["the worst", "worst"], 1],
    ["He answered <u>the quicklyest</u> in the class.", ["the most quickly", "the|most|quickly"], 3],
    ["Minho speaks Chinese <u>the most well</u> of all.", ["the best", "best"], 1],
    ["He is <u>the goodest</u> player in the team.", ["the best", "the|best"], 2],
    ["I like John <u>the much</u> in my class.", ["the most", "most"], 1],
    ["He caught <u>the manyest</u> fish in my family.", ["the most", "most"], 1],
    ["Turtles are <u>the interestingest</u> animals of all.", ["the most interesting", "the|most|interesting"], 3],
    ["His house is <u>the far</u> from here of us all.", ["the farthest", "the|farthest", "the|furthest"], 2],
    ["Linda draws pictures <u>the well</u> in the school.", ["the best", "the|best"], 2],
    ["Rebecca is <u>the popularest</u> girl in my school.", ["the most popular", "the|most|popular"], 3],
  ];
  const items = [];
  flyA.forEach((row, i) => {
    const id = "a" + String(i + 1).padStart(2, "0");
    const acc = Array.isArray(row[1]) ? row[1] : [row[1]];
    const base = fillItem(id, "A", "A" + (i + 1), row[0], acc, { sectionInstructionKo: instrA, blanks: row[2] || 1 });
    items.push(row[3] ? exItem(base, "the most famous") : base);
  });
  const flyB = [
    ["She is a <u>famous</u> singer. → ______ ______ ______ in Korea.", "the|most|famous", true],
    ["Nick is a <u>diligent</u> boy. → ______ ______ ______ in his class.", "the|most|diligent"],
    ["The boy dances <u>well</u>. → ______ ______ of the children.", "the|best"],
    ["Linda walks <u>slowly</u>. → ______ ______ ______ of all the girls.", "the|most|slowly", false, "the|slowest"],
    ["His sneakers are <u>expensive</u>. → ______ ______ ______ of the six.", "the|most|expensive"],
    ["The weather was <u>bad</u>. → ______ ______ of the week.", "the|worst"],
    ["The tree is <u>big</u>. → ______ ______ in the garden.", "the|biggest"],
    ["The book is <u>difficult</u>. → ______ ______ ______ in the library.", "the|most|difficult"],
    ["He is a <u>good</u> baseball player. → ______ ______ ______ in the team.", "the|best"],
    ["The story is <u>interesting</u>. → ______ ______ ______ in the world.", "the|most|interesting"],
    ["Ms. Clever has <u>many</u> books. → ______ ______ ______ in the village.", "the|most"],
    ["The baker bakes <u>delicious</u> cookies. → ______ ______ ______ in the city.", "the|most|delicious"],
  ];
  flyB.forEach((row, i) => {
    const id = "b" + String(i + 1).padStart(2, "0");
    const acc = row[3] ? [row[1], row[3]] : [row[1]];
    const parts = row[1].split("|").length;
    const base = fillItem(id, "B", "B" + (i + 1), row[0], acc, { sectionInstructionKo: instrB, blanks: parts });
    items.push(row[2] ? exItem(base, "the / most / famous") : base);
  });
  write("lesson02-fly.json", {
    practiceId: "b4:u05:lesson02-fly",
    title: "Lesson 02 Fly — 최상급 (2)",
    subtitle: "Grammar Fly (pp. 133–134)",
    pages: "133–134",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 15문항(고치기), Section B 12문항(최상급으로 바꾸기). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분을 바르게 고쳐 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 15, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "밑줄 친 말을 최상급으로 바꿔 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 12, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12"]),
    ],
    items,
  });
})();


// —— Review 05 (pp. 135–137) ——

(function review05() {
  const items = [];
  const s12 =
    "[1–2] 다음 형용사나 부사의 최상급이 잘못 짝지어진 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem(
      "q01",
      "1-2",
      "1",
      "Which pair is wrong?",
      ["big – the biggest", "old – the olddest", "funny – the funniest", "nice – the nicest"],
      ["old – the olddest", "2"],
      { sectionInstructionKo: s12 }
    ),
    mcItem(
      "q02",
      "1-2",
      "2",
      "",
      ["famous – the most famous", "difficult – the most difficult", "quickly – the most quickly", "easy – the most easy"],
      ["easy – the most easy", "4"],
      { sectionInstructionKo: s12 }
    )
  );
  const s34 = "[3–4] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q03", "3-4", "3", "", ["Nick is the tallest boy here.", "That bridge is the longest in the city.", "She sings the best in my school.", "I ran the quickliest in my class."], ["I ran the quickliest in my class.", "4"], {
      sectionInstructionKo: s34,
    }),
    mcItem("q04", "3-4", "4", "", ["I am the shortest in my class.", "This is the worst food of all.", "She is the most kind of all.", "That is the tallest building there."], ["She is the most kind of all.", "3"], {
      sectionInstructionKo: s34,
    })
  );
  const s56 =
    "[5–6] 다음 밑줄 친 말을 최상급으로 바르게 바꿔 쓴 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q05", "5-6", "5", "Jane is a <u>cute</u> girl.", ["Jane is most cute girl.", "Jane is cutest girl.", "Jane is the cutest girl.", "Jane is the most cute girl."], ["Jane is the cutest girl.", "3"], {
      sectionInstructionKo: s56,
    }),
    mcItem("q06", "5-6", "6", "This bag is <u>expensive</u>.", ["This bag is the expensivest.", "This bag is the most expensive.", "This bag is the more expensive.", "This bag is better expensive."], ["This bag is the most expensive.", "2"], {
      sectionInstructionKo: s56,
    })
  );
  const s78 =
    "[7–8] 다음 문장의 빈칸에 알맞은 말이 순서대로 바르게 짝지어진 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem(
      "q07",
      "7-8",
      "7",
      "Sumin speaks English the ______.\nSeoul is the largest city ______ Korea.",
      ["well – in", "best – with", "best – in", "well – of"],
      ["best – in", "3"],
      { sectionInstructionKo: s78 }
    ),
    mcItem(
      "q08",
      "7-8",
      "8",
      "Mark hit the ball the ______ in the class.\nHe was the ______ player in the city.",
      ["farthest – most bad", "farthest – worst", "far – badly", "far – worst"],
      ["farthest – worst", "2"],
      { sectionInstructionKo: s78 }
    )
  );
  const s910 = "[9–10] 다음 중 올바른 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q09", "9-10", "9", "", ["Mina ran the most fast in the school.", "Her sandwich is the best delicious of all.", "You studied the hardest in your class.", "I wrote the much letters of us all."], ["You studied the hardest in your class.", "3"], {
      sectionInstructionKo: s910,
    }),
    mcItem("q10", "9-10", "10", "", ["She is the most young in her family.", "This is the most interesting movie of all.", "It is the cheap in the store.", "Tom is the most smart boy in the class."], ["This is the most interesting movie of all.", "2"], {
      sectionInstructionKo: s910,
    })
  );
  const s1112 =
    "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q11", "11-12", "11", "내가 셋 중에서 책을 가장 많이 가지고 있다.\nI have the ( many / most ) books of the three.", ["many", "most"], ["most", "2"], { sectionInstructionKo: s1112 }),
    mcItem("q12", "11-12", "12", "애니가 우리 가족 중에 가장 오래 잤다.\nAnnie slept the ( most long / longest ) in my family.", ["most long", "longest"], ["longest", "2"], { sectionInstructionKo: s1112 })
  );
  const s1314 = "[13–14] 다음 문장의 빈칸에 공통으로 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q13", "13-14", "13", "Jimmy likes soccer the ______ of all sports.\nThe last question is the ______ difficult of all.", ["most"], { sectionInstructionKo: s1314 }),
    fillItem("q14", "13-14", "14", "Jimin is ______ fastest runner in my school.\nMinho jumped ______ highest of the five.", ["the"], { sectionInstructionKo: s1314 })
  );
  const s1516 =
    "[15–16] 다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요.";
  items.push(
    fillItem("q15", "15-16", "15", "이 나무가 그 정원에서 가장 크다.\nThis tree is ______ ______ in the garden. ( big )", ["the|biggest", "the biggest|biggest"], {
      sectionInstructionKo: s1516,
      blanks: 2,
    }),
    fillItem("q16", "15-16", "16", "톰은 자기 반에서 피아노를 가장 잘 친다.\nTom plays the piano ______ ______ in his class. ( well )", ["the|best", "best"], {
      sectionInstructionKo: s1516,
      blanks: 2,
    })
  );
  const s1718 = "[17–18] 주어진 말을 순서대로 배열하여 문장을 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q17", "17-18", "17", "the wisest / Jane is / of all the children / .", ["Jane is the wisest of all the children."], {
      sectionInstructionKo: s1718,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    }),
    fillItem("q18", "17-18", "18", "the most slowly / Mina ate hamburgers / of them all / .", ["Mina ate hamburgers the most slowly of them all."], {
      sectionInstructionKo: s1718,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    })
  );
  const s1920 =
    "[19–20] 다음 문장에서 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q19", "19-20", "19", "Jane came home the earliest <u>of</u> her family.", ["Jane came home the earliest in her family."], {
      sectionInstructionKo: s1920,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    }),
    fillItem("q20", "19-20", "20", "The dictionary is <u>the useful</u> of the three.", ["The dictionary is the most useful of the three."], {
      sectionInstructionKo: s1920,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    })
  );
  write("review05.json", {
    practiceId: "b4:u05:review05",
    title: "Review 05",
    subtitle: "Unit 05 비교 — 최상급 (pp. 135–137)",
    pages: "135–137",
    timerMinutes: 30,
    ...META,
    sectionsVersion: 2,
    introKo: "Review 05는 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.",
    sections: [
      sec("1-2", "[1–2]", s12, "잘못 짝지어진 최상급을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
      sec("3-4", "[3–4]", s34, "잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["3", "4"]),
      sec("5-6", "[5–6]", s56, "최상급으로 바르게 바꾼 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["5", "6"]),
      sec("7-8", "[7–8]", s78, "빈칸에 알맞은 말이 짝지어진 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["7", "8"]),
      sec("9-10", "[9–10]", s910, "올바른 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["9", "10"]),
      sec("11-12", "[11–12]", s1112, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
      sec("13-14", "[13–14]", s1314, "공통으로 알맞은 말을 쓰세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["13", "14"]),
      sec("15-16", "[15–16]", s1516, "주어진 말로 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["15", "16"]),
      sec("17-18", "[17–18]", s1718, "주어진 말을 배열하여 문장을 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["17", "18"]),
      sec("19-20", "[19–20]", s1920, "밑줄 친 부분을 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
    ],
    items,
  });
})();

console.log("Done —", OUT);
