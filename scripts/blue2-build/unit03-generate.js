/* Generate data/blue2/unit03/*.json — run: node scripts/blue2-build/unit03-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue2/unit03");
const META = {
  bookId: "zap-blue-2",
  bookTitle: "ZAP Blue 2",
  appName: "BlueZap 2",
  unitId: "unit-03",
  unitTitle: "Unit 03 — 형용사",
};

const R_PICK = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
const R_WORD1 = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const R_WORD2 = "빈칸 두 개에 들어갈 말을 각각 쓰세요. 한 칸에 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";
const R_KO = "빈칸에 밑줄 친 부분의 우리말 뜻만 쓰세요. (문장 전체를 쓰지 마세요.)";
const R_SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";

const OPP_CH = ["a. slow", "b. full", "c. difficult", "d. low", "e. expensive", "f. wrong", "g. short", "h. poor"];
const ORD_CH = ["a. third", "b. twelfth", "c. first", "d. second", "e. ninth", "f. twentieth", "g. fifteenth", "h. eighteenth"];
const KO_W1B = ["a. 커다란 곰 인형", "b. 그의 친절한 선생님", "c. 내 새 책상", "d. 이 파란 셔츠", "e. 아름다운 여자", "f. 이 더러운 양말들"];
const EQ_W2B = [
  "a. This is a difficult book.",
  "b. This is a delicious pie.",
  "c. Those are beautiful paintings.",
  "d. She is a nice girl.",
  "e. That is a high mountain.",
];

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels, extra) {
  return Object.assign(
    {
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
    },
    extra || {}
  );
}

function ex(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function fill(id, section, label, promptEn, accept, opts) {
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
  if (opts.blanks != null) item.blanks = opts.blanks;
  if (opts.unordered) item.unordered = true;
  return Object.assign(item, opts.extra || {});
}

function mc(id, section, label, promptEn, choices, accept, opts) {
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

function matchMc(id, section, label, promptEn, choices, letter, opts) {
  const text = choices.find((c) => c.startsWith(letter + ".") || c.startsWith(letter + ","));
  return mc(id, section, label, promptEn, choices, [text, letter], opts);
}

function binMc(id, section, label, promptEn, w1, w2, pick, opts) {
  const choices = ["1. " + w1, "2. " + w2];
  const idx = pick === 1 ? 0 : 1;
  const circ = ["①", "②"][idx];
  return mc(id, section, label, promptEn, choices, [choices[idx], String(idx + 1), circ], opts);
}

function parMc(id, section, label, promptEn, w1, w2, pick, opts) {
  const choices = [w1, w2];
  const idx = pick === 1 ? 0 : 1;
  return mc(id, section, label, promptEn, choices, [choices[idx], String(idx + 1)], opts);
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  const graded = data.items.filter((it) => !it.displayOnly).length;
  console.log("wrote", name, data.items.length, "items", "(" + graded + " graded)");
}

function intro(parts) {
  return (
    "이 연습은 " +
    parts.join(", ") +
    "으로 되어 있어요. 회색 '예시' 문제는 책에 답이 나와 있는 예시라서 채점하지 않아요. 각 섹션 안내에 따라 고르기·빈칸·문장 전체를 구분하세요."
  );
}

function ulWord(sentence, word) {
  const esc = String(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return sentence.replace(new RegExp("\\b" + esc + "\\b"), "<u>" + word + "</u>");
}

const R_RUN_A =
  "첫 번째 빈칸에 형용사, 두 번째 빈칸에 명사를 각각 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";

// —— Lesson 01 Walk 1 (p. 63) ——
(function lesson01Walk1() {
  const instrA =
    "다음 문장에서 형용사를 찾아 동그라미 하세요. 동그라미 친 형용사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 중 의미가 반대인 형용사를 찾아 선으로 연결하세요. 알맞은 말(a~h)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const items = [
    ex(
      fill("a01", "A", "A1", "Minho is a handsome boy.", ["handsome"], {
        sectionInstructionKo: instrA,
        promptKo: "민호는 잘생긴 남자아이다.",
      }),
      "handsome"
    ),
    fill("a02", "A", "A2", "I need a new pen.", ["new"], { sectionInstructionKo: instrA, promptKo: "나는 새 펜이 필요하다." }),
    fill("a03", "A", "A3", "Sally has a pink umbrella.", ["pink"], {
      sectionInstructionKo: instrA,
      promptKo: "샐리는 분홍색 우산을 가지고 있다.",
    }),
    fill("a04", "A", "A4", "She likes cloudy days.", ["cloudy"], {
      sectionInstructionKo: instrA,
      promptKo: "그녀는 흐린 날을 좋아한다.",
    }),
    fill("a05", "A", "A5", "Paul has two bags.", ["two"], { sectionInstructionKo: instrA, promptKo: "폴은 가방 두 개를 가지고 있다." }),
    matchMc("b01", "B", "B1", "high", OPP_CH, "d", { sectionInstructionKo: instrB }),
    matchMc("b02", "B", "B2", "easy", OPP_CH, "c", { sectionInstructionKo: instrB }),
    matchMc("b03", "B", "B3", "fast", OPP_CH, "a", { sectionInstructionKo: instrB }),
    matchMc("b04", "B", "B4", "cheap", OPP_CH, "e", { sectionInstructionKo: instrB }),
    matchMc("b05", "B", "B5", "empty", OPP_CH, "b", { sectionInstructionKo: instrB }),
    matchMc("b06", "B", "B6", "long", OPP_CH, "g", { sectionInstructionKo: instrB }),
    matchMc("b07", "B", "B7", "rich", OPP_CH, "h", { sectionInstructionKo: instrB }),
    matchMc("b08", "B", "B8", "right", OPP_CH, "f", { sectionInstructionKo: instrB }),
  ];
  write("lesson01-walk1.json", {
    practiceId: "b2:u03:lesson01-walk1",
    title: "Lesson 01 Walk 1 — 형용사",
    subtitle: "형용사 찾기·반의어 (p. 63)",
    pages: "63",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 4문항(형용사)", "Section B 8문항(연결·고르기)"]),
    sections: [
      sec("A", "Section A", instrA, "다음 문장에서 형용사를 찾아 동그라미 하세요.", "동그라미 친 형용사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 중 의미가 반대인 형용사를 찾아 선으로 연결하세요.", R_PICK, "choice", "Choose · 고르기", 8, 0, ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"]),
    ],
    items,
  });
})();

// —— Lesson 01 Walk 2 (p. 65) ——
(function lesson01Walk2() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 읽은 것을 골라 동그라미 하세요. " + R_PICK;
  const instrB = "다음 기수에 알맞은 서수를 찾아 선으로 연결하세요. 알맞은 말(a~h)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const items = [
    ex(
      binMc("a01", "A", "A1", "She is 12 years old.", "twelve", "twenty", 1, {
        sectionInstructionKo: instrA,
        promptKo: "그녀는 12살이다.",
      }),
      "1. twelve"
    ),
    binMc("a02", "A", "A2", "I am in the 4th grade.", "forth", "fourth", 2, {
      sectionInstructionKo: instrA,
      promptKo: "나는 4학년이다.",
    }),
    binMc("a03", "A", "A3", "He has 55 notebooks.", "fivety-five", "fifty-five", 2, {
      sectionInstructionKo: instrA,
      promptKo: "그는 공책 55권을 가지고 있다.",
    }),
    binMc("a04", "A", "A4", "My house is on the 5th floor.", "fifth", "fiveth", 1, {
      sectionInstructionKo: instrA,
      promptKo: "우리 집은 5층에 있다.",
    }),
    binMc("a05", "A", "A5", "Tomorrow is her 13th birthday.", "thirteen", "thirteenth", 2, {
      sectionInstructionKo: instrA,
      promptKo: "내일은 그녀의 13번째 생일이다.",
    }),
    ex(matchMc("b01", "B", "B1", "one", ORD_CH, "c", { sectionInstructionKo: instrB }), "c. first"),
    matchMc("b02", "B", "B2", "two", ORD_CH, "d", { sectionInstructionKo: instrB }),
    matchMc("b03", "B", "B3", "three", ORD_CH, "a", { sectionInstructionKo: instrB }),
    matchMc("b04", "B", "B4", "nine", ORD_CH, "e", { sectionInstructionKo: instrB }),
    matchMc("b05", "B", "B5", "twelve", ORD_CH, "b", { sectionInstructionKo: instrB }),
    matchMc("b06", "B", "B6", "fifteen", ORD_CH, "g", { sectionInstructionKo: instrB }),
    matchMc("b07", "B", "B7", "eighteen", ORD_CH, "h", { sectionInstructionKo: instrB }),
    matchMc("b08", "B", "B8", "twenty", ORD_CH, "f", { sectionInstructionKo: instrB }),
  ];
  write("lesson01-walk2.json", {
    practiceId: "b2:u03:lesson01-walk2",
    title: "Lesson 01 Walk 2 — 형용사",
    subtitle: "기수·서수 읽기 (p. 65)",
    pages: "65",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 4문항(고르기)", "Section B 7문항(연결·고르기)"]),
    sections: [
      sec("A", "Section A", instrA, "다음 문장의 밑줄 친 부분을 바르게 읽은 것을 골라 동그라미 하세요.", R_PICK, "choice", "Choose · 고르기", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 기수에 알맞은 서수를 찾아 선으로 연결하세요.", R_PICK, "choice", "Choose · 고르기", 7, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8"]),
    ],
    items,
  });
})();

// —— Lesson 01 Run (pp. 66–67) ——
(function lesson01Run() {
  const instrA =
    "다음 문장에서 형용사를 찾아 동그라미 하고, 형용사가 꾸며 주는 명사를 찾아 밑줄을 치세요.";
  const instrB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. " + R_PICK;
  const pairs = [
    ["I have a green ball.", "green|ball", "나는 초록 공을 가지고 있다."],
    ["The baby doesn't like the dark room.", "dark|room", "그 아기는 어두운 방을 좋아하지 않는다."],
    ["We have a new computer.", "new|computer", "우리는 새 컴퓨터를 가지고 있다."],
    ["Tommy is a smart boy.", "smart|boy", "토미는 똑똑한 남자아이다."],
    ["Kate has beautiful eyes.", "beautiful|eyes", "케이트는 아름다운 눈을 가지고 있다."],
    ["This is a difficult question.", "difficult|question", "이것은 어려운 문제이다."],
    ["Cheetahs are fast runners.", "fast|runners", "치타는 빠른 달리기 선수이다."],
    ["She likes windy days.", "windy|days", "그녀는 바람이 많이 부는 날을 좋아한다."],
    ["It is an expensive bicycle.", "expensive|bicycle", "이것은 비싼 자전거이다."],
    ["My father has big feet.", "big|feet", "우리 아버지는 큰 발을 가지고 계신다."],
    ["I want a warm sweater.", "warm|sweater", "나는 따뜻한 스웨터를 원한다."],
    ["My dog has brown hair.", "brown|hair", "우리 개는 갈색 털을 가지고 있다."],
    ["It is an old building.", "old|building", "이것은 낡은 건물이다."],
    ["That is an empty bag.", "empty|bag", "저것은 빈 가방이다."],
  ];
  const items = [
    ex(
      fill("a01", "A", "A1", "Sumin is a cute girl.", ["cute|girl"], {
        sectionInstructionKo: instrA + " " + R_RUN_A,
        promptKo: "수민은 귀여운 여자아이다.",
        blanks: 2,
      }),
      "cute / girl"
    ),
  ];
  pairs.forEach((row, i) => {
    items.push(
      fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], [row[1]], {
        sectionInstructionKo: instrA + " " + R_RUN_A,
        promptKo: row[2],
        blanks: 2,
      })
    );
  });
  const runB = [
    ["Roy has ______ sisters.", "two", "second", 1, "로이는 여자 형제가 두 명 있다."],
    ["Sujin is a ______ grader.", "four", "fourth", 2, "수진은 4학년생이다."],
    ["Jack eats ______ potatoes every day.", "third", "three", 2, "잭은 매일 감자 세 개를 먹는다."],
    ["This house has ______ rooms.", "seven", "seventh", 1, "이 집에는 방이 일곱 개 있다."],
    ["They are in the ______ grade.", "three", "third", 2, "그들은 3학년이다."],
    ["A pet shop is on the ______ floor.", "six", "sixth", 2, "애완동물 가게는 6층에 있다."],
    ["The cook needs ______ tomatoes.", "eleven", "eleventh", 1, "요리사는 토마토 열한 개가 필요하다."],
    ["Jia has ______ brother.", "one", "first", 1, "지아는 남동생이 한 명 있다."],
    ["They have ______ geese.", "fourteen", "fourteenth", 1, "그들은 거위 열마리를 가지고 있다."],
    ["The art room is on the ______ floor.", "threeth", "third", 2, "미술실은 3층에 있다."],
    ["My sister is in the ______ grade.", "nineth", "ninth", 2, "내 여동생은 9학년이다."],
    ["Today is my ______ birthday.", "twelveth", "twelfth", 2, "오늘은 내 열두 번째 생일이다."],
    ["Tony is a ______ grader.", "fiveth", "fifth", 2, "토니는 5학년생이다."],
    ["We have ______ cups.", "twenty", "twentieth", 1, "우리는 컵이 스무 개 있다."],
    ["A shoe store is on the ______ floor.", "eight", "eighth", 2, "신발 가게는 8층에 있다."],
  ];
  runB.forEach((row, i) => {
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const base = binMc(id, "B", label, row[0], row[1], row[2], row[3], {
      sectionInstructionKo: instrB,
      promptKo: row[4],
    });
    if (i === 0) items.push(ex(base, "1. two"));
    else items.push(base);
  });
  write("lesson01-run.json", {
    practiceId: "b2:u03:lesson01-run",
    title: "Grammar Run — Lesson 01",
    subtitle: "형용사+명사·기수/서수 (pp. 66–67)",
    pages: "66–67",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 14문항(형용사+명사)", "Section B 14문항(고르기)"]),
    sections: [
      sec("A", "Section A", instrA + " " + R_RUN_A, "형용사와 꾸며 주는 명사를 찾으세요.", R_RUN_A, "words", "Words · 빈칸 말만", 14, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
      ]),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice", "Choose · 고르기", 14, 1, [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Lesson 01 Jump (pp. 68–69) ——
(function lesson01Jump() {
  const instrA = "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. " + R_KO;
  const instrB = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. " + R_PICK;
  const koRows = [
    ["Yuna is a tall girl.", "tall", "유나는 ______ 여자아이다.", ["키가 큰", "큰"], "유나는 키가 큰 여자아이다."],
    ["I like the small cat.", "small", "나는 그 ______ 고양이를 좋아한다.", ["작은"], "나는 그 작은 고양이를 좋아한다."],
    [
      "You have a red sweater.",
      "red",
      "너는 ______ 스웨터를 가지고 있다.",
      ["빨간", "빨간색의", "빨갛은"],
      "너는 빨간 스웨터를 가지고 있다.",
    ],
    ["That is an old purse.", "old", "저것은 ______ 지갑이다.", ["낡은", "오래된"], "저것은 낡은 지갑이다."],
    [
      "Olivia has black hair.",
      "black",
      "올리비아는 ______ 머리카락을 가지고 있다.",
      ["검은", "검은색의", "까만"],
      "올리비아는 검은 머리카락을 가지고 있다.",
    ],
    [
      "This is an expensive camera.",
      "expensive",
      "이것은 ______ 사진기이다.",
      ["비싼", "값비싼"],
      "이것은 비싼 사진기이다.",
    ],
    [
      "The music room is on the third floor.",
      "third",
      "그 음악실은 ______ 에 있다.",
      ["3층", "세 번째 층", "3번째 층"],
      "그 음악실은 3층에 있다.",
    ],
    ["Maru is a handsome boy.", "handsome", "마루는 ______ 남자아이다.", ["잘생긴", "멋진"], "마루는 잘생긴 남자아이다."],
    [
      "It is an interesting movie.",
      "interesting",
      "그것은 ______ 영화이다.",
      ["재미있는", "흥미로운"],
      "그것은 재미있는 영화이다.",
    ],
    [
      "Today is my eleventh birthday.",
      "eleventh",
      "오늘은 내 ______ 생일이다.",
      ["열한 번째", "11번째", "열한번째"],
      "오늘은 내 열한 번째 생일이다.",
    ],
    [
      "My dog likes sunny days.",
      "sunny",
      "우리 개는 ______ 날을 좋아한다.",
      ["화창한", "맑은"],
      "우리 개는 화창한 날을 좋아한다.",
    ],
    [
      "I want the pink shoes.",
      "pink",
      "나는 그 ______ 신발을 원한다.",
      ["분홍색의", "분홍", "분홍빛의"],
      "나는 그 분홍색 신발을 원한다.",
    ],
    [
      "She likes the heavy jacket.",
      "heavy",
      "그녀는 그 ______ 재킷을 좋아한다.",
      ["무거운"],
      "그녀는 그 무거운 재킷을 좋아한다.",
    ],
    ["They sell cheap vegetables.", "cheap", "그들은 ______ 채소를 판다.", ["싼", "값싼"], "그들은 싼 채소를 판다."],
    [
      "This is an empty box.",
      "empty",
      "이것은 ______ 상자이다.",
      ["빈", "비어 있는", "텅 빈"],
      "이것은 빈 상자이다.",
    ],
  ];
  const items = [
    ex(
      fill("a01", "A", "A1", ulWord(koRows[0][0], koRows[0][1]), koRows[0][3], {
        sectionInstructionKo: instrA,
        promptKo: koRows[0][2],
        blanks: 1,
      }),
      koRows[0][3][0]
    ),
  ];
  koRows.slice(1).forEach((row, i) => {
    items.push(
      fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), ulWord(row[0], row[1]), row[3], {
        sectionInstructionKo: instrA,
        promptKo: row[2],
        blanks: 1,
      })
    );
  });
  const jumpB = [
    ["Tom is a ( good / bad ) boy.", "good", "bad", 2, "톰은 나쁜 남자아이다."],
    ["That is a ( fast / slow ) train.", "fast", "slow", 1, "저것은 빠른 기차이다."],
    ["They need ( old / new ) desks.", "old", "new", 2, "그들은 새 책상이 필요하다."],
    ["Alice has ( short / long ) legs.", "short", "long", 2, "앨리스는 다리가 길다."],
    ["They sell ( fresh / delicious ) sandwiches.", "fresh", "delicious", 2, "그들은 맛있는 샌드위치를 판다."],
    ["I like ( cold / hot ) spaghetti.", "cold", "hot", 2, "나는 뜨거운 스파게티가 좋다."],
    ["John has ( brown / black ) eyes.", "brown", "black", 1, "존은 갈색 눈을 가지고 있다."],
    ["Look at the ( round / small ) table.", "round", "small", 1, "그 동그란 탁자를 보라."],
    ["She has a ( tall / long ) son.", "tall", "long", 1, "그녀는 키가 큰 아들이 있다."],
    ["He wants ( cheap / expensive ) gloves.", "cheap", "expensive", 1, "그는 값이 싼 장갑을 원한다."],
    ["This is a ( right / wrong ) answer.", "right", "wrong", 2, "이것은 틀린 답이다."],
    ["That is a ( light / heavy ) bottle.", "light", "heavy", 1, "저것은 가벼운 병이다."],
    ["She likes the ( ugly / pretty ) frog.", "ugly", "pretty", 1, "그녀는 그 못생긴 개구리를 좋아한다."],
    ["Jiho needs a ( yellow / blue ) shirt.", "yellow", "blue", 2, "지호는 파란 셔츠가 필요하다."],
    ["Superman is a ( weak / strong ) man.", "weak", "strong", 2, "슈퍼맨은 힘이 센 사람이다."],
  ];
  jumpB.forEach((row, i) => {
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const base = parMc(id, "B", label, row[0], row[1], row[2], row[3], {
      sectionInstructionKo: instrB,
      promptKo: row[4],
    });
    if (i === 0) items.push(ex(base, "bad"));
    else items.push(base);
  });
  write("lesson01-jump.json", {
    practiceId: "b2:u03:lesson01-jump",
    title: "Grammar Jump — Lesson 01",
    subtitle: "우리말 뜻·형용사 고르기 (pp. 68–69)",
    pages: "68–69",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 14문항(우리말 뜻)", "Section B 14문항(고르기)"]),
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.", R_KO, "words", "Words · 빈칸 말만", 14, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
      ]),
      sec("B", "Section B", instrB, "괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice", "Choose · 고르기", 14, 1, [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Lesson 01 Fly (pp. 70–71) ——
(function lesson01Fly() {
  const instrA =
    "다음 문장의 밑줄 친 형용사와 뜻이 반대인 형용사를 빈칸에 쓰세요. " + R_WORD1;
  const instrB = "다음 문장의 빈칸에 알맞은 말을 쓰세요. " + R_WORD1;
  const opp = [
    ["Andy has a long scarf.", "short", "앤디는 긴 스카프를 가지고 있다."],
    ["Her brother is a lazy boy.", "diligent", "그녀의 오빠는 게으른 남자아이다."],
    ["It likes a bright room.", "dark", "그것은 밝은 방을 좋아한다."],
    ["This is a heavy chair.", "light", "이것은 무거운 의자이다."],
    ["Judy is a good student.", "bad", "주디는 착한 학생이다."],
    ["Look at the old lady.", "young", "그 늙은 부인을 보아라."],
    ["The house has a high wall.", "low", "그 집에는 높은 담이 있다."],
    ["Give me the big apple.", "small", "나에게 그 큰 사과를 주어라."],
    ["He is a rich doctor.", "poor", "그는 부유한 의사이다."],
    ["Julia is a tall girl.", "short", "줄리아는 키가 큰 여자아이다."],
    ["Mom wants the pretty dog.", "ugly", "엄마는 그 예쁜 개를 원한다."],
    ["Tom wears a dirty jacket.", "clean", "톰은 더러운 재킷을 입는다."],
    ["They are expensive watches.", "cheap", "그것들은 비싼 시계이다."],
    ["This is an easy book.", "difficult", "이것은 쉬운 책이다."],
  ];
  const items = [
    ex(
      fill("a01", "A", "A1", "I have a new cap. → I have an ______ cap.", ["old"], {
        sectionInstructionKo: instrA,
        promptKo: "나는 새 모자를 가지고 있다. → 나는 낡은 모자를 가지고 있다.",
        blanks: 1,
      }),
      "old"
    ),
  ];
  opp.forEach((row, i) => {
    items.push(
      fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0] + " → ______", [row[1]], {
        sectionInstructionKo: instrA,
        promptKo: row[2],
        blanks: 1,
      })
    );
  });
  const flyB = [
    ["Susie has ______ bags.", "three", "수지는 가방 세 개를 가지고 있다."],
    ["I am in the ______ grade.", "third", "나는 3학년이다."],
    ["I like ______ milk.", "warm", "나는 따뜻한 우유를 좋아한다."],
    ["This is an ______ guitar.", "expensive", "이것은 비싼 기타이다."],
    ["My dog likes ______ days.", "snowy", "우리 개는 눈이 많이 내리는 날을 좋아한다."],
    ["We live on the ______ floor.", "fifth", "우리는 5층에 산다."],
    ["Shane is a ______ police officer.", "kind", "세인은 친절한 경찰관이다."],
    ["My sister is a ______ grader.", "second", "내 여동생은 2학년생이다."],
    ["Mercury is a ______ cat.", "cute", "머큐리는 귀여운 고양이이다."],
    ["Greenland is a ______ country.", "cold", "그린란드는 추운 나라이다."],
    ["He has a ______ shirt.", "grey", "그는 회색 셔츠 한 개를 가지고 있다."],
    ["She wants their ______ noodles.", "delicious", "그녀는 그들의 맛있는 국수를 원한다."],
    ["Math is a ______ subject.", "difficult", "수학은 어려운 과목이다."],
    ["I have ______ cousins.", "eleven", "나는 사촌이 열한 명 있다."],
  ];
  items.push(
    ex(
      fill("b01", "B", "B1", "It is a long bridge.", ["long"], {
        sectionInstructionKo: instrB,
        promptKo: "그것은 긴 다리이다.",
        blanks: 1,
      }),
      "long"
    )
  );
  flyB.forEach((row, i) => {
    items.push(
      fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), row[0], [row[1]], {
        sectionInstructionKo: instrB,
        promptKo: row[2],
        blanks: 1,
      })
    );
  });
  write("lesson01-fly.json", {
    practiceId: "b2:u03:lesson01-fly",
    title: "Grammar Fly — Lesson 01",
    subtitle: "반의어·빈칸 완성 (pp. 70–71)",
    pages: "70–71",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 14문항(반의어)", "Section B 14문항(빈칸 말만)"]),
    sections: [
      sec("A", "Section A", instrA, "뜻이 반대인 형용사를 빈칸에 쓰세요.", R_WORD1, "words", "Words · 빈칸 말만", 14, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
      ]),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 쓰세요.", R_WORD1, "words", "Words · 빈칸 말만", 14, 1, [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Lesson 02 Walk 1 (p. 73) ——
(function lesson02Walk1() {
  const instrA =
    "다음 문장에서 주어진 말이 들어갈 알맞은 위치에 동그라미 하세요. 동그라미 친 말(주어진 형용사)만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 말의 우리말 뜻을 찾아 선으로 연결하세요. 알맞은 뜻(a~f)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const items = [
    ex(
      fill("a01", "A", "A1", "He is a boy. ( quiet )", ["quiet"], {
        sectionInstructionKo: instrA,
        promptKo: "그는 조용한 남자아이다.",
      }),
      "quiet"
    ),
    fill("a02", "A", "A2", "It is a building. ( tall )", ["tall"], { sectionInstructionKo: instrA, promptKo: "그것은 키가 큰 건물이다." }),
    fill("a03", "A", "A3", "Mabel is a cat. ( small )", ["small"], { sectionInstructionKo: instrA, promptKo: "메이블은 작은 고양이이다." }),
    fill("a04", "A", "A4", "Hallasan is a mountain. ( beautiful )", ["beautiful"], {
      sectionInstructionKo: instrA,
      promptKo: "한라산은 아름다운 산이다.",
    }),
    fill("a05", "A", "A5", "This is a movie. ( sad )", ["sad"], { sectionInstructionKo: instrA, promptKo: "이것은 슬픈 영화이다." }),
    matchMc("b01", "B", "B1", "my new desk", KO_W1B, "c", { sectionInstructionKo: instrB }),
    matchMc("b02", "B", "B2", "this blue shirt", KO_W1B, "d", { sectionInstructionKo: instrB }),
    matchMc("b03", "B", "B3", "a beautiful woman", KO_W1B, "e", { sectionInstructionKo: instrB }),
    matchMc("b04", "B", "B4", "his kind teacher", KO_W1B, "b", { sectionInstructionKo: instrB }),
    matchMc("b05", "B", "B5", "a big teddy bear", KO_W1B, "a", { sectionInstructionKo: instrB }),
    matchMc("b06", "B", "B6", "these dirty socks", KO_W1B, "f", { sectionInstructionKo: instrB }),
  ];
  write("lesson02-walk1.json", {
    practiceId: "b2:u03:lesson02-walk1",
    title: "Lesson 02 Walk 1 — 형용사",
    subtitle: "형용사 위치·뜻 연결 (p. 73)",
    pages: "73",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 4문항(형용사)", "Section B 6문항(연결·고르기)"]),
    sections: [
      sec("A", "Section A", instrA, "주어진 말이 들어갈 위치를 동그라미 하세요.", "동그라미 친 형용사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "우리말 뜻을 찾아 선으로 연결하세요.", R_PICK, "choice", "Choose · 고르기", 6, 0, ["B1", "B2", "B3", "B4", "B5", "B6"]),
    ],
    items,
  });
})();

// —— Lesson 02 Walk 2 (p. 75) ——
(function lesson02Walk2() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 성질이나 상태를 설명해 주는 말을 찾아 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장과 같은 뜻의 문장을 찾아 선으로 연결하세요. 알맞은 문장(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const items = [
    ex(
      fill("a01", "A", "A1", "These flowers are pretty.", ["pretty"], {
        sectionInstructionKo: instrA,
        promptKo: "이 꽃들은 예쁘다.",
      }),
      "pretty"
    ),
    fill("a02", "A", "A2", "Sweet potatoes are delicious.", ["delicious"], {
      sectionInstructionKo: instrA,
      promptKo: "고구마는 맛있다.",
    }),
    fill("a03", "A", "A3", "This island is beautiful.", ["beautiful"], { sectionInstructionKo: instrA, promptKo: "이 섬은 아름답다." }),
    fill("a04", "A", "A4", "My teacher is handsome.", ["handsome"], { sectionInstructionKo: instrA, promptKo: "우리 선생님은 잘생기셨다." }),
    fill("a05", "A", "A5", "The singer is famous.", ["famous"], { sectionInstructionKo: instrA, promptKo: "그 가수는 유명하다." }),
    matchMc("b01", "B", "B1", "The girl is nice.", EQ_W2B, "d", { sectionInstructionKo: instrB }),
    matchMc("b02", "B", "B2", "That mountain is high.", EQ_W2B, "e", { sectionInstructionKo: instrB }),
    matchMc("b03", "B", "B3", "This book is difficult.", EQ_W2B, "a", { sectionInstructionKo: instrB }),
    matchMc("b04", "B", "B4", "Those paintings are beautiful.", EQ_W2B, "c", { sectionInstructionKo: instrB }),
    matchMc("b05", "B", "B5", "This pie is delicious.", EQ_W2B, "b", { sectionInstructionKo: instrB }),
  ];
  write("lesson02-walk2.json", {
    practiceId: "b2:u03:lesson02-walk2",
    title: "Lesson 02 Walk 2 — 형용사",
    subtitle: "be동사 뒤 형용사·문장 연결 (p. 75)",
    pages: "75",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 4문항(형용사)", "Section B 5문항(연결·고르기)"]),
    sections: [
      sec("A", "Section A", instrA, "성질이나 상태를 설명하는 말을 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "같은 뜻의 문장을 찾아 연결하세요.", R_PICK, "choice", "Choose · 고르기", 5, 0, ["B1", "B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 02 Run (pp. 76–77) ——
(function lesson02Run() {
  const instrA = "다음 문장의 밑줄 친 부분이 꾸며 주거나 설명해 주는 말을 찾아 동그라미 하세요.";
  const ruleA = "동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. " + R_PICK;
  const circ = [
    ["Her room is clean.", "clean", ["Her room", "room"], "그녀의 방은 깨끗하다."],
    ["They are quiet children.", "quiet", ["children"], "그들은 조용한 아이들이다."],
    ["The pilot is tall.", "tall", ["The pilot", "pilot"], "그 조종사는 키가 크다."],
    ["Ms. Gold is rich.", "rich", ["Ms. Gold"], "골드 양은 부유하다."],
    ["The boy is lazy.", "lazy", ["The boy", "boy"], "그 남자아이는 게으르다."],
    ["I like a light jacket.", "light", ["jacket"], "나는 가벼운 재킷을 좋아한다."],
    ["Their garden is large.", "large", ["Their garden", "garden"], "그들의 정원은 넓다."],
    ["Jennifer has beautiful eyes.", "beautiful", ["eyes"], "제니퍼는 아름다운 눈을 가지고 있다."],
    ["The knife is sharp.", "sharp", ["The knife", "knife"], "그 칼은 날카롭다."],
    ["I want that cheap computer.", "cheap", ["computer"], "나는 저 값싼 컴퓨터를 원한다."],
    ["Their classroom is bright.", "bright", ["Their classroom", "classroom"], "그들의 교실은 밝다."],
    ["Do you like rainy days?", "rainy", ["days"], "너는 비 오는 날을 좋아하니?"],
    ["Joan is hungry.", "hungry", ["Joan"], "조안은 배가 고프다."],
    ["Look at the fat bear.", "fat", ["bear"], "그 뚱뚱한 곰을 보아라."],
    ["These grapes are sweet.", "sweet", ["grapes", "These grapes"], "이 포도들은 달다."],
  ];
  const items = circ.map((row, i) => {
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    return fill(id, "A", label, ulWord(row[0], row[1]), row[2], {
      sectionInstructionKo: instrA + " " + ruleA,
      promptKo: row[3],
    });
  });
  const runB = [
    ["Sue is ( a girl polite / a polite girl ).", "a girl polite", "a polite girl", 2, "수는 예의 바른 여자아이다."],
    ["Those airplanes ( fast are / are fast ).", "fast are", "are fast", 2, "저 비행기들은 빠르다."],
    ["The man is ( kind a dentist / a kind dentist ).", "kind a dentist", "a kind dentist", 2, "그 남자는 친절한 치과의사이다."],
    ["Their teeth ( are sharp / sharp are ).", "are sharp", "sharp are", 1, "그들의 이는 날카롭다."],
    ["Give me ( that blue / blue that ) notebook.", "that blue", "blue that", 1, "저 파란 공책을 내게 주어라."],
    ["The sun ( is bright / bright is ).", "is bright", "bright is", 1, "태양은 밝다."],
    ["This is ( new your / your new ) room.", "new your", "your new", 2, "이것은 네 새 방이다."],
    ["Do you know ( the tall / tall the ) man?", "the tall", "tall the", 1, "저 키가 큰 남자를 알고 있니?"],
    ["The table ( dirty is / is dirty ).", "dirty is", "is dirty", 2, "그 탁자는 더럽다."],
    ["They are ( my old / old my ) classmates.", "my old", "old my", 1, "그들은 내 오랜 급우들이다."],
    ["Tony likes ( pretty that / that pretty ) girl.", "pretty that", "that pretty", 2, "토니는 저 예쁜 여자아이를 좋아한다."],
    ["The closet ( is empty / empty is ).", "is empty", "empty is", 1, "그 벽장은 비어 있다."],
    ["This is ( an easy question / easy a question ).", "an easy question", "easy a question", 1, "이것은 쉬운 문제이다."],
    ["The painting ( is beautiful / beautiful is ).", "is beautiful", "beautiful is", 1, "그 그림은 아름답다."],
    ["( That grey dog / Grey that dog ) barks every night.", "That grey dog", "Grey that dog", 1, "저 회색 개는 매일 밤 짖는다."],
  ];
  runB.forEach((row, i) => {
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    items.push(
      parMc(id, "B", label, row[0], row[1], row[2], row[3], {
        sectionInstructionKo: instrB,
        promptKo: row[4],
      })
    );
  });
  write("lesson02-run.json", {
    practiceId: "b2:u03:lesson02-run",
    title: "Grammar Run — Lesson 02",
    subtitle: "형용사 찾기·어순 (pp. 76–77)",
    pages: "76–77",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 15문항(동그라미 친 말)", "Section B 15문항(고르기)"]),
    sections: [
      sec("A", "Section A", instrA + " " + ruleA, "꾸며 주거나 설명하는 말을 동그라미 하세요.", ruleA, "words", "Words · 빈칸 말만", 15, 0, [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
      ]),
      sec("B", "Section B", instrB, "괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice", "Choose · 고르기", 15, 0, [
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 78–79) ——
(function lesson02Jump() {
  const instrA = "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. " + R_KO;
  const instrB =
    "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요. " + R_WORD1;
  const koA = [
    ["That is a big tree.", "저것은 ______ 나무이다.", ["큰"], "저것은 큰 나무이다."],
    ["That tree is big.", "저 나무는 ______.", ["크다", "큽니다"], "저 나무는 크다."],
    ["Colin is brave.", "콜린은 ______.", ["용감하다", "용감합니다"], "콜린은 용감하다."],
    ["Colin is a brave boy.", "콜린은 ______ 남자아이다.", ["용감한"], "콜린은 용감한 남자아이다."],
    ["This is an old kettle.", "이것은 ______ 주전자이다.", ["낡은", "오래된"], "이것은 낡은 주전자이다."],
    ["This kettle is old.", "이 주전자는 ______.", ["낡았다", "오래되었다"], "이 주전자는 낡았다."],
    ["She is a silly girl.", "그녀는 ______ 여자아이다.", ["어리석은"], "그녀는 어리석은 여자아이다."],
    ["The girl is silly.", "그 여자아이는 ______.", ["어리석다"], "그 여자아이는 어리석다."],
    ["My mom has black eyes.", "우리 엄마는 ______ 눈을 가지고 계신다.", ["검은", "검은색의"], "우리 엄마는 검은 눈을 가지고 계신다."],
    ["My mom's eyes are black.", "우리 엄마 눈은 ______.", ["검다", "검습니다"], "우리 엄마 눈은 검다."],
    ["Paul is diligent.", "폴은 ______.", ["부지런하다"], "폴은 부지런하다."],
    ["Paul is a diligent student.", "폴은 ______ 학생이다.", ["부지런한"], "폴은 부지런한 학생이다."],
    ["They make delicious pies.", "그들은 ______ 파이를 만든다.", ["맛있는", "아주 맛있는"], "그들은 맛있는 파이를 만든다."],
    ["Their pies are delicious.", "그들의 파이는 ______.", ["맛있다", "맛있습니다"], "그들의 파이는 맛있다."],
    ["That is an empty bag.", "저것은 ______ 가방이다.", ["빈"], "저것은 빈 가방이다."],
    ["That bag is empty.", "저 가방은 ______.", ["비어 있다", "비었다"], "저 가방은 비어 있다."],
  ];
  const items = [
    ex(
      fill("a01", "A", "A1", koA[0][0], koA[0][2], {
        sectionInstructionKo: instrA,
        promptKo: koA[0][1],
        blanks: 1,
      }),
      koA[0][2][0]
    ),
  ];
  koA.slice(1).forEach((row, i) => {
    items.push(
      fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], row[2], {
        sectionInstructionKo: instrA,
        promptKo: row[1],
        blanks: 1,
      })
    );
  });
  const eqB = [
    ["The boy is smart. = He is a ______ boy.", "smart", "그 남자아이는 똑똑하다."],
    ["This car is fast. = This is a ______ car.", "fast", "이 자동차는 빠르다."],
    ["These cups are clean. = These are ______ cups.", "clean", "이 컵들은 깨끗하다."],
    ["The actor is famous. = He is a ______ actor.", "famous", "그 배우는 유명하다."],
    ["The turtle is slow. = It is a ______ turtle.", "slow", "그 거북이는 느리다."],
    ["The story is sad. = It is a ______ story.", "sad", "그 이야기는 슬프다."],
    ["The question is difficult. = It is a ______ question.", "difficult", "그 문제는 어렵다."],
    ["She has long hair. = Her hair is ______.", "long", "그녀는 긴 머리카락을 가지고 있다."],
    ["The daughters are good. = They are ______ daughters.", "good", "그 딸들은 착하다."],
    ["These are ______ flowers. = These flowers are ugly.", "ugly", "이 꽃들은 못생겼다."],
    ["Those shoes are ______. = Those are new shoes.", "new", "저 신발들은 새것이다."],
    ["The answer is ______. = It is a right answer.", "right", "그 대답은 옳다."],
    ["This bag is ______. = This is a cheap bag.", "cheap", "이 가방은 싸다."],
    ["These strawberries are ______. = These are sweet strawberries.", "sweet", "이 딸기들은 달다."],
    ["The mountain is ______. = It is a high mountain.", "high", "그 산은 높다."],
  ];
  items.push(
    ex(
      fill("b01", "B", "B1", eqB[0][0], [eqB[0][1]], {
        sectionInstructionKo: instrB,
        promptKo: eqB[0][2],
        blanks: 1,
      }),
      eqB[0][1]
    )
  );
  eqB.slice(1).forEach((row, i) => {
    items.push(
      fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), row[0], [row[1]], {
        sectionInstructionKo: instrB,
        promptKo: row[2],
        blanks: 1,
      })
    );
  });
  write("lesson02-jump.json", {
    practiceId: "b2:u03:lesson02-jump",
    title: "Grammar Jump — Lesson 02",
    subtitle: "우리말 뜻·문장 변환 (pp. 78–79)",
    pages: "78–79",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 15문항(우리말 뜻)", "Section B 14문항(빈칸 말만)"]),
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분의 우리말 뜻을 쓰세요.", R_KO, "words", "Words · 빈칸 말만", 15, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
        "A16",
      ]),
      sec("B", "Section B", instrB, "두 문장의 뜻이 같도록 빈칸을 채우세요.", R_WORD1, "words", "Words · 빈칸 말만", 14, 1, [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Lesson 02 Fly (pp. 80–81) ——
(function lesson02Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. " + R_SENT;
  const instrB = "다음 문장의 빈칸에 알맞은 말을 쓰세요. " + R_WORD1;
  const fixA = [
    ["She is smart a student.", "She is a smart student.", "그녀는 똑똑한 학생이다."],
    ["Paul is good my friend.", "Paul is my good friend.", "폴은 내 좋은 친구이다."],
    ["They are new his classmates.", "They are his new classmates.", "그들은 그의 새 급우들이다."],
    ["He has yellow a basket.", "He has a yellow basket.", "그는 노란 바구니를 가지고 있다."],
    ["That puppy brave is.", "That puppy is brave.", "저 강아지는 용감하다."],
    ["That is handsome her brother.", "That is her handsome brother.", "저 사람은 그녀의 잘생긴 오빠이다."],
    ["Give me blue the pen.", "Give me the blue pen.", "파란 펜을 내게 주어라."],
    ["I like pretty your balloons.", "I like your pretty balloons.", "나는 네 예쁜 풍선들을 좋아한다."],
    ["She wants long that skirt.", "She wants that long skirt.", "그녀는 저 긴 치마를 원한다."],
    ["This watermelon is a delicious.", "This watermelon is delicious.", "이 수박은 맛있다."],
    ["Seoul is big a city.", "Seoul is a big city.", "서울은 큰 도시이다."],
    ["Look at dirty this room.", "Look at this dirty room.", "이 더러운 방을 보아라."],
    ["Give me empty those boxes.", "Give me those empty boxes.", "비어 있는 저 상자들을 내게 주어라."],
    ["The actress has large a house.", "The actress has a large house.", "그 여배우는 큰 집을 가지고 있다."],
    ["Dora likes beautiful her garden.", "Dora likes her beautiful garden.", "도라는 그녀의 아름다운 정원을 좋아한다."],
  ];
  const items = fixA.map((row, i) => {
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fill(id, "A", label, row[0], [row[1], row[1].replace(/\.$/, "")], {
      sectionInstructionKo: instrA,
      promptKo: row[2],
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    });
    if (i === 0) return ex(base, row[1]);
    return base;
  });
  const flyB = [
    ["Mina is a ______ girl.", "good", "미나는 착한 여자아이다."],
    ["His room is ______.", "dark", "그의 방은 어둡다."],
    ["Her cat is ______.", "cute", "그녀의 고양이는 귀엽다."],
    ["Give me ______ cap.", "the black", "저 검은색 모자를 내게 줘."],
    ["Sandy is ______ friend.", "my old", "샌디는 내 오랜 친구이다."],
    ["John is ______.", "lazy", "존은 게으르다."],
    ["I like ______ shirt.", "this white", "나는 이 흰 셔츠를 좋아한다."],
    ["This jacket is ______.", "expensive", "이 재킷은 비싸다."],
    ["I know ______ scientist.", "that tall", "나는 저 키 큰 과학자를 안다."],
    ["The monkeys are ______.", "angry", "그 원숭이들은 화가 났다."],
    ["I don't like ______ days.", "windy", "나는 바람이 많이 부는 날을 좋아하지 않는다."],
    ["This is an ______ question.", "easy", "이것은 쉬운 문제이다."],
    ["This lake is ______.", "beautiful", "이 호수는 아름답다."],
    ["I want this ______ bag.", "light", "나는 이 가벼운 가방을 원한다."],
    ["My father is ______.", "diligent", "우리 아버지는 부지런하시다."],
  ];
  items.push(
    ex(
      fill("b01", "B", "B1", "Mina is a good girl.", ["good"], {
        sectionInstructionKo: instrB,
        promptKo: flyB[0][2],
        blanks: 1,
      }),
      "good"
    )
  );
  flyB.slice(1).forEach((row, i) => {
    items.push(
      fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), row[0], [row[1]], {
        sectionInstructionKo: instrB,
        promptKo: row[2],
        blanks: 1,
      })
    );
  });
  write("lesson02-fly.json", {
    practiceId: "b2:u03:lesson02-fly",
    title: "Grammar Fly — Lesson 02",
    subtitle: "어순 고치기·빈칸 (pp. 80–81)",
    pages: "80–81",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: intro(["Section A 14문항(문장 전체)", "Section B 14문항(빈칸 말만)"]),
    sections: [
      sec("A", "Section A", instrA, "잘못된 부분을 고쳐 문장을 다시 쓰세요.", R_SENT, "sentence", "Sentence · 문장 전체", 14, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
        "A13",
        "A14",
        "A15",
      ]),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 쓰세요.", R_WORD1, "words", "Words · 빈칸 말만", 14, 1, [
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "B8",
        "B9",
        "B10",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
      ]),
    ],
    items,
  });
})();

// —— Review 03 (pp. 82–84) ——
(function review03() {
  const items = [];
  const mc5 = (id, sec, label, promptEn, choices, ans, instr, ko) =>
    mc(id, sec, label, promptEn, choices, [choices[ans - 1], String(ans), "①②③④⑤"[ans - 1]], {
      sectionInstructionKo: instr,
      promptKo: ko || "",
    });

  const s1 = "다음 중 형용사가 아닌 것을 고르세요. " + R_PICK;
  items.push(mc5("q01", "1", "1", "", ["kind", "love", "lazy", "hungry"], 2, s1));

  const s23 = "[2–3] 다음 중 의미가 반대인 형용사끼리 짝지어지지 않은 것을 고르세요. " + R_PICK;
  items.push(
    mc5("q02", "2-3", "2", "", ["old – new", "long – small", "empty – full", "fast – slow"], 2, s23),
    mc5("q03", "2-3", "3", "", ["bright – dark", "high – low", "good – bad", "easy – diligent"], 4, s23)
  );

  const s45 = "[4–5] 다음 중 기수와 서수가 잘못 짝지어진 것을 고르세요. " + R_PICK;
  items.push(
    mc5("q04", "4-5", "4", "", ["one – first", "six – sixth", "three – threeth", "ten – tenth"], 3, s45),
    mc5("q05", "4-5", "5", "", ["nine – nineth", "two – second", "eleven – eleventh", "eight – eighth"], 1, s45)
  );

  const s68 = "[6–8] 다음 중 밑줄 친 부분을 바르게 고친 것을 고르세요. " + R_PICK;
  items.push(
    mc5(
      "q06",
      "6-8",
      "6",
      "My classroom is on the <u>five</u> floor.",
      ["fiveth", "fifth", "fifty", "fifteen"],
      2,
      s68
    ),
    mc5(
      "q07",
      "6-8",
      "7",
      "She has <u>twentieth</u> books.",
      ["twentie", "a twelve", "twenty", "the twentieth"],
      3,
      s68
    ),
    mc5(
      "q08",
      "6-8",
      "8",
      "Today is my <u>twelveth</u> birthday.",
      ["twelve", "twenty", "twoth", "twelfth"],
      4,
      s68
    )
  );

  const s912 =
    "[9–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. " + R_PICK;
  items.push(
    parMc("q09", "9-12", "9", "This is ( new my / my new ) bag.", "new my", "my new", 2, {
      sectionInstructionKo: s912,
      promptKo: "이것은 내 새 가방이다.",
    }),
    parMc("q10", "9-12", "10", "Look at ( that red / red that ) balloon.", "that red", "red that", 1, {
      sectionInstructionKo: s912,
      promptKo: "저 빨간 풍선을 봐.",
    }),
    parMc("q11", "9-12", "11", "He is ( good a / a good ) student.", "good a", "a good", 2, {
      sectionInstructionKo: s912,
      promptKo: "그는 훌륭한 학생이다.",
    }),
    parMc("q12", "9-12", "12", "The bird ( is yellow / yellow is ).", "is yellow", "yellow is", 1, {
      sectionInstructionKo: s912,
      promptKo: "그 새는 노랗다.",
    })
  );

  const s1316 =
    "[13–16] 다음 문장을 아래와 같이 바꿔 쓸 때 빈칸에 알맞은 단어를 쓰세요. " + R_WORD1;
  const s1316two = "[13–16] 다음 문장을 아래와 같이 바꿔 쓸 때 빈칸에 알맞은 단어를 쓰세요. " + R_WORD2;
  items.push(
    fill("q13", "13-16", "13", "She is a polite girl.\n= The girl is ______.", ["polite"], {
      sectionInstructionKo: s1316,
      promptKo: "그녀는 예의 바른 여자아이다.",
      blanks: 1,
    }),
    fill("q14", "13-16", "14", "Those questions are difficult.\n= Those are ______ questions.", ["difficult"], {
      sectionInstructionKo: s1316,
      promptKo: "저 질문들은 어렵다.",
      blanks: 1,
    }),
    fill("q15", "13-16", "15", "This lake is beautiful.\n= This is a ______ ______.", ["beautiful|lake"], {
      sectionInstructionKo: s1316two,
      promptKo: "이 호수는 아름답다.",
      blanks: 2,
    }),
    fill("q16", "13-16", "16", "That actress is famous.\n= That is a ______ ______.", ["famous|actress"], {
      sectionInstructionKo: s1316two,
      promptKo: "저 여배우는 유명하다.",
      blanks: 2,
    })
  );

  const s1718 = "[17–18] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. " + R_WORD1;
  const s18two = "[17–18] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. " + R_WORD2;
  items.push(
    fill("q17", "17-18", "17", "I like ______ days.", ["sunny"], {
      sectionInstructionKo: s1718,
      promptKo: "나는 화창한 날을 좋아한다.",
      blanks: 1,
    }),
    fill("q18", "17-18", "18", "The baby ______ ______.", ["is|hungry"], {
      sectionInstructionKo: s18two,
      promptKo: "그 아기는 배가 고프다.",
      blanks: 2,
    })
  );

  const s1920 =
    "[19–20] 다음 문장에서 잘못된 부분을 찾아 바르게 고쳐 문장을 다시 쓰세요. " + R_SENT;
  items.push(
    fill("q19", "19-20", "19", "She is in the four grade.", ["She is in the fourth grade.", "She is in the fourth grade"], {
      sectionInstructionKo: s1920,
      promptKo: "그녀는 4학년이다.",
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    }),
    fill("q20", "19-20", "20", "Grace likes white her dress.", ["Grace likes her white dress.", "Grace likes her white dress"], {
      sectionInstructionKo: s1920,
      promptKo: "그레이스는 자신의 흰 옷을 좋아한다.",
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    })
  );

  write("review-03.json", {
    practiceId: "b2:u03:review03",
    title: "Review 03",
    subtitle: "Unit 03 형용사 (pp. 82–84)",
    pages: "82–84",
    timerMinutes: 30,
    ...META,
    sectionsVersion: 3,
    introKo:
      "Review 03은 1번부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요. 각 섹션 안내에 따라 고르기·빈칸·문장 전체를 구분하세요.",
    sections: [
      sec("1", "1", s1, "형용사가 아닌 것 고르기", R_PICK, "choice", "Choose · 고르기", 1, 0, ["1"]),
      sec("2-3", "[2–3]", s23, "반의어 짝 고르기", R_PICK, "choice", "Choose · 고르기", 2, 0, ["2", "3"]),
      sec("4-5", "[4–5]", s45, "기수/서수 짝 고르기", R_PICK, "choice", "Choose · 고르기", 2, 0, ["4", "5"]),
      sec("6-8", "[6–8]", s68, "밑줄 친 부분 고치기", R_PICK, "choice", "Choose · 고르기", 3, 0, ["6", "7", "8"]),
      sec("9-12", "[9–12]", s912, "괄호 안에서 고르기", R_PICK, "choice", "Choose · 고르기", 4, 0, ["9", "10", "11", "12"]),
      sec("13-16", "[13–16]", s1316, "문장 바꿔 쓰기", R_WORD1, "words", "Words · 빈칸 말만", 4, 0, ["13", "14", "15", "16"]),
      sec("17-18", "[17–18]", s1718, "우리말 뜻 완성", R_WORD1, "words", "Words · 빈칸 말만", 2, 0, ["17", "18"]),
      sec("19-20", "[19–20]", s1920, "문장에서 잘못된 부분을 고쳐 다시 쓰세요.", R_SENT, "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
    ],
    items,
  });
})();

console.log("Done —", OUT);
