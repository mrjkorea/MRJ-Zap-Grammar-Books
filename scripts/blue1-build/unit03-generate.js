/* Generate data/blue1/unit03/*.json — run: node scripts/blue1-build/unit03-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue1/unit03");
const META = {
  bookId: "zap-blue-1",
  bookTitle: "ZAP Blue 1",
  appName: "BlueZap 1",
  unitId: "unit-03",
  unitTitle: "Unit 03 — 셀 수 없는 명사",
};

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return { id, title, instructionKo, directionKo, ruleKo, answerMode, answerModeTag: tag, itemCount, exampleCount, labels };
}

function itemBase(id, section, label, opts) {
  return {
    id,
    section,
    sectionTitle: opts.sectionTitle || `Section ${section}`,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: opts.answerMode || "words",
    answerModeTag: opts.answerModeTag || "Words · 빈칸 말만",
    label,
  };
}

function fill(id, section, label, promptEn, accept, opts = {}) {
  const it = { ...itemBase(id, section, label, opts), type: opts.type || "fill", promptEn, accept: [].concat(accept) };
  if (opts.promptKo) it.promptKo = opts.promptKo;
  if (opts.blanks) it.blanks = opts.blanks;
  if (opts.example) it.example = true;
  if (opts.displayOnly) it.displayOnly = true;
  if (opts.exampleAnswer) it.exampleAnswer = opts.exampleAnswer;
  return it;
}

function mc(id, section, label, promptEn, choices, accept, opts = {}) {
  const it = {
    ...itemBase(id, section, label, { ...opts, answerMode: "choice", answerModeTag: "Choose · 고르기" }),
    type: "mc",
    promptEn,
    choices,
    accept: [].concat(accept),
  };
  if (opts.promptKo) it.promptKo = opts.promptKo;
  if (opts.example) it.example = true;
  if (opts.displayOnly) it.displayOnly = true;
  if (opts.exampleAnswer) it.exampleAnswer = opts.exampleAnswer;
  return it;
}

function sent(id, section, label, promptEn, accept, opts = {}) {
  return fill(id, section, label, promptEn, accept, { ...opts, type: "sentence", answerMode: "sentence", answerModeTag: "Sentence · 문장 전체" });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
}

function practice(slug, title, subtitle, pages, timerMinutes, introKo, sections, items) {
  return {
    practiceId: `b1:u03:${slug}`,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    sectionsVersion: 2,
    introKo,
    sections,
    items,
  };
}

// —— Lesson 01 Walk 1 (p.57) ——
const w1aDir =
  "다음 중 셀 수 없는 명사를 골라 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const w1bDir =
  "주어진 명사가 물질명사이면 A, 추상명사이면 B를 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";

write(
  "lesson01-walk1.json",
  practice(
    "lesson01-walk1",
    "Lesson 01 Walk 1 — 셀 수 없는 명사의 종류",
    "셀 수 없는 명사 골라 쓰기 · A/B 구분 (p. 57)",
    "57",
    10,
    "Section A는 두 단어 중 셀 수 없는 명사만, Section B는 물질명사 A·추상명사 B입니다. 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", w1aDir, "다음 중 셀 수 없는 명사를 골라 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 7, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8"]),
      sec("B", "Section B", w1bDir, "주어진 명사가 물질명사이면 A, 추상명사이면 B를 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 7, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8"]),
    ],
    [
      fill("a01", "A", "A1", "chair / air", ["air"], { sectionInstructionKo: w1aDir, example: true, displayOnly: true, exampleAnswer: "air", promptKo: "의자 / 공기" }),
      fill("a02", "A", "A2", "toy / milk", ["milk"], { sectionInstructionKo: w1aDir, promptKo: "장난감 / 우유" }),
      fill("a03", "A", "A3", "rain / dog", ["rain"], { sectionInstructionKo: w1aDir, promptKo: "비 / 개" }),
      fill("a04", "A", "A4", "baby / love", ["love"], { sectionInstructionKo: w1aDir, promptKo: "아기 / 사랑" }),
      fill("a05", "A", "A5", "time / car", ["time"], { sectionInstructionKo: w1aDir, promptKo: "시간 / 자동차" }),
      fill("a06", "A", "A6", "cheese / child", ["cheese"], { sectionInstructionKo: w1aDir, promptKo: "치즈 / 아이" }),
      fill("a07", "A", "A7", "country / gold", ["gold"], { sectionInstructionKo: w1aDir, promptKo: "국가 / 금" }),
      fill("a08", "A", "A8", "sheep / sunshine", ["sunshine"], { sectionInstructionKo: w1aDir, promptKo: "양 / 햇빛" }),
      fill("b01", "B", "B1", "gas", ["A", "a"], { sectionInstructionKo: w1bDir, example: true, displayOnly: true, exampleAnswer: "A", promptKo: "가스" }),
      fill("b02", "B", "B2", "hope", ["B", "b"], { sectionInstructionKo: w1bDir, promptKo: "희망" }),
      fill("b03", "B", "B3", "time", ["B", "b"], { sectionInstructionKo: w1bDir, promptKo: "시간" }),
      fill("b04", "B", "B4", "water", ["A", "a"], { sectionInstructionKo: w1bDir, promptKo: "물" }),
      fill("b05", "B", "B5", "love", ["B", "b"], { sectionInstructionKo: w1bDir, promptKo: "사랑" }),
      fill("b06", "B", "B6", "cheese", ["A", "a"], { sectionInstructionKo: w1bDir, promptKo: "치즈" }),
      fill("b07", "B", "B7", "art", ["B", "b"], { sectionInstructionKo: w1bDir, promptKo: "미술" }),
      fill("b08", "B", "B8", "snow", ["A", "a"], { sectionInstructionKo: w1bDir, promptKo: "눈" }),
    ]
  )
);

// —— Lesson 01 Walk 2 (p.59) ——
const w2aDir =
  "다음 중 고유명사를 골라 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const w2bDir =
  "다음 중 바르게 쓰인 단어를 골라 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";

write(
  "lesson01-walk2.json",
  practice(
    "lesson01-walk2",
    "Lesson 01 Walk 2 — 셀 수 없는 명사의 종류",
    "고유명사 · 대문자 (p. 59)",
    "59",
    10,
    "Section A는 고유명사 고르기, Section B는 올바른 대문자 표기입니다.",
    [
      sec("A", "Section A", w2aDir, "다음 중 고유명사를 골라 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 7, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8"]),
      sec("B", "Section B", w2bDir, "다음 중 바르게 쓰인 단어를 골라 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 7, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8"]),
    ],
    [
      fill("a01", "A", "A1", "singer / Paul", ["Paul"], { sectionInstructionKo: w2aDir, example: true, displayOnly: true, exampleAnswer: "Paul" }),
      fill("a02", "A", "A2", "city / Seoul", ["Seoul"], { sectionInstructionKo: w2aDir }),
      fill("a03", "A", "A3", "Christmas / tree", ["Christmas"], { sectionInstructionKo: w2aDir }),
      fill("a04", "A", "A4", "country / Asia", ["Asia"], { sectionInstructionKo: w2aDir }),
      fill("a05", "A", "A5", "cap / Canada", ["Canada"], { sectionInstructionKo: w2aDir }),
      fill("a06", "A", "A6", "Kennedy / doctor", ["Kennedy"], { sectionInstructionKo: w2aDir }),
      fill("a07", "A", "A7", "May / homework", ["May"], { sectionInstructionKo: w2aDir }),
      fill("a08", "A", "A8", "bread / Monday", ["Monday"], { sectionInstructionKo: w2aDir }),
      fill("b01", "B", "B1", "seoul / Seoul", ["Seoul"], { sectionInstructionKo: w2bDir, example: true, displayOnly: true, exampleAnswer: "Seoul" }),
      fill("b02", "B", "B2", "Christmas / christmas", ["Christmas"], { sectionInstructionKo: w2bDir }),
      fill("b03", "B", "B3", "Asia / asia", ["Asia"], { sectionInstructionKo: w2bDir }),
      fill("b04", "B", "B4", "tuesday / Tuesday", ["Tuesday"], { sectionInstructionKo: w2bDir }),
      fill("b05", "B", "B5", "Mr. kim / Mr. Kim", ["Mr. Kim"], { sectionInstructionKo: w2bDir }),
      fill("b06", "B", "B6", "Jennifer / jennifer", ["Jennifer"], { sectionInstructionKo: w2bDir }),
      fill("b07", "B", "B7", "January / january", ["January"], { sectionInstructionKo: w2bDir }),
      fill("b08", "B", "B8", "New year's day / New Year's Day", ["New Year's Day"], { sectionInstructionKo: w2bDir }),
    ]
  )
);

// —— Lesson 01 Run (pp.60–61) ——
const r1aDir =
  "다음 중 셀 수 없는 명사를 골라 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const r1bDir =
  "다음 셀 수 없는 명사의 종류로 알맞은 것을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
const catChoices = ["물질명사", "추상명사", "고유명사"];

const run1Pairs = [
  ["baby", "juice", "juice"],
  ["tree", "water", "water"],
  ["air", "school", "air"],
  ["love", "friend", "love"],
  ["Paul", "boy", "Paul"],
  ["bag", "Monday", "Monday"],
  ["Mr. Obama", "teacher", "Mr. Obama"],
  ["gold", "flower", "gold"],
  ["woman", "Emily", "Emily"],
  ["snow", "child", "snow"],
  ["car", "hope", "hope"],
  ["love", "book", "love"],
  ["dog", "May", "May"],
  ["music", "lady", "music"],
  ["Seoul", "pants", "Seoul"],
];
const run1b = [
  ["rain", "물질명사"],
  ["love", "추상명사"],
  ["July", "고유명사"],
  ["baseball", "추상명사"],
  ["bread", "물질명사"],
  ["time", "추상명사"],
  ["Mr. Park", "고유명사"],
  ["milk", "물질명사"],
  ["sunshine", "물질명사"],
  ["math", "추상명사"],
  ["soccer", "추상명사"],
  ["Christmas", "고유명사"],
  ["juice", "물질명사"],
  ["Asia", "고유명사"],
  ["air", "물질명사"],
];

write(
  "lesson01-run.json",
  practice(
    "lesson01-run",
    "Lesson 01 Run — 셀 수 없는 명사의 종류",
    "pp. 60–61",
    "60–61",
    20,
    "Section A 15문항(셀 수 없는 명사·고유명사 포함), Section B 15문항(종류 고르기).",
    [
      sec("A", "Section A", r1aDir, "다음 중 셀 수 없는 명사를 골라 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", r1bDir, "다음 셀 수 없는 명사의 종류로 알맞은 것을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    [
      ...run1Pairs.map(([a, b, ans], i) => {
        const label = i === 0 ? "A1" : "A" + (i + 1);
        const id = "a" + String(i + 1).padStart(2, "0");
        const opts = { sectionInstructionKo: r1aDir, promptEn: `${a} / ${b}` };
        if (i === 0) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return fill(id, "A", label, `${a} / ${b}`, [ans], opts);
      }),
      ...run1b.map(([word, ans], i) => {
        const label = "B" + (i + 1);
        const id = "b" + String(i + 1).padStart(2, "0");
        const idx = catChoices.indexOf(ans) + 1;
        return mc(id, "B", label, word, catChoices, [ans, String(idx)], { sectionInstructionKo: r1bDir });
      }),
    ]
  )
);

// —— Lesson 01 Jump (pp.62–63) ——
const j1aDir =
  "다음 문장에서 셀 수 없는 명사를 찾아 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const j1bDir =
  "다음 단어들을 물질명사, 추상명사, 고유명사로 나누어 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";

const jump1a = [
  ["You like butter.", "butter", true],
  ["We have hope.", "hope"],
  ["I want water.", "water"],
  ["I like snow.", "snow"],
  ["They live in Seoul.", "Seoul"],
  ["We drink juice.", "juice"],
  ["I eat bread.", "bread"],
  ["We need sunshine.", "sunshine"],
  ["Children like Christmas.", "Christmas"],
  ["I know Andy.", "Andy"],
  ["I need money.", "money"],
  ["They want love.", "love"],
  ["I like Saturday.", "Saturday"],
  ["They like rain.", "rain"],
  ["Mr. Smith is a teacher.", "Mr. Smith"],
];

const matWords = ["juice", "snow", "bread", "gold"];
const absWords = ["English", "love", "math", "music"];
const propWords = ["Paul", "Christmas", "Monday", "December"];

const jump1Items = jump1a.map((row, i) => {
  const [sent, ans, ex] = row;
  const label = "A" + (i + 1);
  const opts = { sectionInstructionKo: j1aDir };
  if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
  return fill("a" + String(i + 1).padStart(2, "0"), "A", label, sent, [ans], opts);
});
const jump1bLabels = ["B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10", "B12", "B13", "B14", "B15"];
const jump1bItems = [
  fill("b01", "B", "B1", "물질명사 — air (예시)", ["air"], { sectionInstructionKo: j1bDir, example: true, displayOnly: true, exampleAnswer: "air" }),
  ...matWords.map((w, i) => fill("b" + String(i + 2).padStart(2, "0"), "B", jump1bLabels[i], `물질명사 칸 ${i + 2}`, [w], { sectionInstructionKo: j1bDir })),
  fill("b06", "B", "B6", "추상명사 — baseball (예시)", ["baseball"], { sectionInstructionKo: j1bDir, example: true, displayOnly: true, exampleAnswer: "baseball" }),
  ...absWords.map((w, i) => fill("b" + String(i + 7).padStart(2, "0"), "B", jump1bLabels[i + 4], `추상명사 칸 ${i + 2}`, [w], { sectionInstructionKo: j1bDir })),
  fill("b11", "B", "B11", "고유명사 — Asia (예시)", ["Asia"], { sectionInstructionKo: j1bDir, example: true, displayOnly: true, exampleAnswer: "Asia" }),
  ...propWords.map((w, i) => fill("b" + String(i + 12).padStart(2, "0"), "B", jump1bLabels[i + 8], `고유명사 칸 ${i + 2}`, [w], { sectionInstructionKo: j1bDir })),
];

write(
  "lesson01-jump.json",
  practice(
    "lesson01-jump",
    "Lesson 01 Jump — 셀 수 없는 명사의 종류",
    "pp. 62–63",
    "62–63",
    24,
    "Section A는 문장 속 셀 수 없는 명사, Section B는 보기(15단어)를 물질·추상·고유명사 칸에 순서대로 씁니다.",
    [
      sec("A", "Section A", j1aDir, "다음 문장에서 셀 수 없는 명사를 찾아 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", j1bDir, "다음 단어들을 물질명사, 추상명사, 고유명사로 나누어 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 12, 3, jump1bLabels),
    ],
    [...jump1Items, ...jump1bItems]
  )
);

// —— Lesson 01 Fly (pp.64–65) ——
const f1aDir =
  "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const f1bDir =
  "다음 보기에서 알맞은 단어를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";

const fly1a = [
  ["I eat <u>breads</u>.", "bread", true],
  ["I like <u>snows</u>.", "snow"],
  ["We like <u>christmas</u>.", "Christmas"],
  ["They drink <u>milks</u>.", "milk"],
  ["I want <u>loves</u>.", "love"],
  ["We need <u>times</u>.", "time"],
  ["Give me <u>waters</u>.", "water"],
  ["I know <u>tommy</u>.", "Tommy"],
  ["They like <u>juices</u>.", "juice"],
  ["Today is <u>saturday</u>.", "Saturday"],
  ["They need <u>sunshines</u>.", "sunshine"],
  ["I visit <u>Mr. park</u>.", "Mr. Park"],
  ["We live in <u>seoul</u>.", "Seoul"],
  ["I like <u>math</u>.", ["Math", "math"]],
  ["I want <u>moneys</u>.", "money"],
];

const fly1b = [
  ["I like ____ juice.", "juice", "나는 주스를 좋아한다.", true],
  ["I know ____.", "Jennifer", "나는 제니퍼를 안다."],
  ["We need ____.", "money", "우리는 돈이 필요하다."],
  ["They live in ____.", "New York", "그들은 뉴욕에 산다."],
  ["We go to church on ____.", "Sunday", "우리는 일요일에 교회에 간다."],
  ["I drink ____ every day.", "milk", "나는 매일 우유를 마신다."],
  ["I like ____.", "rain", "나는 비를 좋아한다."],
  ["We need ____.", "sunshine", "우리는 햇빛이 필요하다."],
  ["____ is very important.", "Hope", "희망은 무척 중요하다.", false, ["Hope", "hope"]],
  ["I like ____.", "cheese", "나는 치즈를 좋아한다."],
];

write(
  "lesson01-fly.json",
  practice(
    "lesson01-fly",
    "Lesson 01 Fly — 셀 수 없는 명사의 종류",
    "pp. 64–65",
    "64–65",
    26,
    "Section A는 밑줄 친 말 고치기, Section B는 보기에서 골라 넣기입니다.",
    [
      sec("A", "Section A", f1aDir, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", f1bDir, "다음 보기에서 알맞은 단어를 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]),
    ],
    [
      ...fly1a.map((row, i) => {
        const [prompt, ansRaw, ex] = row;
        const accept = Array.isArray(ansRaw) ? ansRaw : [ansRaw];
        const opts = { sectionInstructionKo: f1aDir };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: accept[0] });
        return fill("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, accept, opts);
      }),
      ...fly1b.map((row, i) => {
        const [prompt, ans, ko, ex, alts] = row;
        const accept = alts || [ans];
        const opts = { sectionInstructionKo: f1bDir, promptKo: ko };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return fill("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), prompt, accept, opts);
      }),
    ]
  )
);

// —— Lesson 02 Walk 1 (p.67) ——
const w2l1Dir =
  "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";

const walk2a = [
  ["물 한 잔", "a ( glass / piece ) of water", ["glass", "piece"], "glass", true],
  ["설탕 한 숟가락", "a ( piece / spoonful ) of sugar", ["piece", "spoonful"], "spoonful"],
  ["쌀 1킬로", "a ( sheet / kilo ) of rice", ["sheet", "kilo"], "kilo"],
  ["수프 한 그릇", "a ( loaf / bowl ) of soup", ["loaf", "bowl"], "bowl"],
  ["주스 한 병", "a ( bottle / cup ) of juice", ["bottle", "cup"], "bottle"],
  ["종이 한 장", "a ( sheet / liter ) of paper", ["sheet", "liter"], "sheet"],
  ["피자 한 조각", "a ( spoonful / piece ) of pizza", ["spoonful", "piece"], "piece"],
  ["고기 한 덩어리", "a ( sheet / loaf ) of meat", ["sheet", "loaf"], "loaf"],
  ["커피 한 잔", "a ( cup / piece ) of coffee", ["cup", "piece"], "cup"],
  ["우유 1리터", "a ( kilo / liter ) of milk", ["kilo", "liter"], "liter"],
];

write(
  "lesson02-walk1.json",
  practice(
    "lesson02-walk1",
    "Lesson 02 Walk 1 — 셀 수 없는 명사의 특징",
    "양 표현 — 단위 골라 쓰기 (p. 67)",
    "67",
    10,
    "우리말 뜻에 맞는 단위 명사를 괄호 안에서 고릅니다.",
    [sec("A", "Section A", w2l1Dir, "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])],
    walk2a.map((row, i) => {
      const [ko, prompt, choices, ans, ex] = row;
      const opts = { sectionInstructionKo: w2l1Dir, promptKo: ko };
      if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
      return mc("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, choices, [ans], opts);
    })
  )
);

// —— Lesson 02 Walk 2 (p.69) ——
const walk2b = [
  ["물 두 잔", "two ( glass / glasses ) of water", ["glass", "glasses"], "glasses", true],
  ["종이 두 장", "two ( sheet / sheets ) of paper", ["sheet", "sheets"], "sheets"],
  ["주스 세 병", "three ( bottles / bottle ) of juice", ["bottles", "bottle"], "bottles"],
  ["밥 네 그릇", "four ( bowl / bowls ) of rice", ["bowl", "bowls"], "bowls"],
  ["케이크 두 조각", "two pieces of ( cakes / cake )", ["cakes", "cake"], "cake"],
  ["소금 두 숟가락", "two ( spoonfuls / spoonful ) of salt", ["spoonfuls", "spoonful"], "spoonfuls"],
  ["샐러드 두 그릇", "two bowls of ( salad / salads )", ["salad", "salads"], "salad"],
  ["밀가루 3킬로", "three kilos of ( flour / flours )", ["flour", "flours"], "flour"],
  ["우유 2리터", "two liters of ( milks / milk )", ["milks", "milk"], "milk"],
  ["빵 두 덩어리", "two loaves of ( breads / bread )", ["breads", "bread"], "bread"],
];

write(
  "lesson02-walk2.json",
  practice(
    "lesson02-walk2",
    "Lesson 02 Walk 2 — 셀 수 없는 명사의 특징",
    "복수 단위·물질명사 단수 (p. 69)",
    "69",
    10,
    "숫자에 맞게 용기·단위의 복수형을 고르고, 물질명사는 단수로 씁니다.",
    [sec("A", "Section A", w2l1Dir, "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])],
    walk2b.map((row, i) => {
      const [ko, prompt, choices, ans, ex] = row;
      const opts = { sectionInstructionKo: w2l1Dir, promptKo: ko };
      if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
      return mc("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, choices, [ans], opts);
    })
  )
);

// —— Lesson 02 Run (pp.70–71) ——
const r2aDir =
  "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
const r2bDir =
  "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";

const run2a = [
  ["I need a ( piece / spoonful ) of sugar.", ["piece", "spoonful"], "spoonful", true],
  ["Give me a ( sheet / loaf ) of paper.", ["sheet", "loaf"], "sheet"],
  ["You drink a ( cup / sheet ) of tea.", ["cup", "sheet"], "cup"],
  ["They eat two ( loaves / bottles ) of bread.", ["loaves", "bottles"], "loaves"],
  ["I buy a ( piece / liter ) of milk.", ["piece", "liter"], "liter"],
  ["We need two ( kilos / sheets ) of flour.", ["kilos", "sheets"], "kilos"],
  ["I drink a ( piece / glass ) of water.", ["piece", "glass"], "glass"],
  ["I eat a ( bowl / bottle ) of rice.", ["bowl", "bottle"], "bowl"],
  ["We need a ( glass / loaf ) of meat.", ["glass", "loaf"], "loaf"],
  ["I drink a ( piece / cup ) of coffee.", ["piece", "cup"], "cup"],
  ["They buy two ( bottles / pieces ) of juice.", ["bottles", "pieces"], "bottles"],
  ["Give me a ( sheet / bowl ) of soup.", ["sheet", "bowl"], "bowl"],
  ["They want a ( loaf / bottle ) of ink.", ["loaf", "bottle"], "bottle"],
  ["I need two ( spoonfuls / pieces ) of oil.", ["spoonfuls", "pieces"], "spoonfuls"],
  ["We buy a ( glass / loaf ) of cheese.", ["glass", "loaf"], "loaf"],
];

const run2b = [
  ["Give me a glass of ____.", ["paper", "water"], "water", true],
  ["We need ____.", ["time", "times"], "time"],
  ["I eat two bowls of ____.", ["salads", "salad"], "salad"],
  ["I have ten kilos of ____.", ["rice", "rices"], "rice"],
  ["I buy two loaves of ____.", ["juice", "cheese"], "cheese"],
  ["We drink two cups of ____.", ["tea", "teas"], "tea"],
  ["I eat three pieces of ____.", ["pizza", "milk"], "pizza"],
  ["Give me a sheet of ____.", ["bread", "paper"], "paper"],
  ["I need a loaf of ____.", ["soup", "bread"], "bread"],
  ["We have two bottles of ____.", ["juice", "juices"], "juice"],
  ["We need a liter of ____.", ["sugar", "water"], "water"],
  ["They buy two kilos of ____.", ["flour", "flours"], "flour"],
  ["You drink a glass of ____.", ["rice", "water"], "water"],
  ["We eat two pieces of ____.", ["cake", "cakes"], "cake"],
  ["I need two spoonfuls of ____.", ["oils", "oil"], "oil"],
];

write(
  "lesson02-run.json",
  practice(
    "lesson02-run",
    "Lesson 02 Run — 셀 수 없는 명사의 특징",
    "pp. 70–71",
    "70–71",
    20,
    "Section A는 단위·용기 고르기, Section B는 빈칸에 맞는 물질명사 고르기입니다.",
    [
      sec("A", "Section A", r2aDir, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", r2bDir, "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    [
      ...run2a.map((row, i) => {
        const [prompt, choices, ans, ex] = row;
        const opts = { sectionInstructionKo: r2aDir };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return mc("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, choices, [ans], opts);
      }),
      ...run2b.map((row, i) => {
        const [prompt, choices, ans, ex] = row;
        const label = ex ? "B1" : "B" + (i + 1);
        const opts = { sectionInstructionKo: r2bDir };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return mc("b" + String(i + 1).padStart(2, "0"), "B", label, prompt, choices, [ans, String(choices.indexOf(ans) + 1)], opts);
      }),
    ]
  )
);

// —— Lesson 02 Jump (pp.72–73) ——
const j2aDir =
  "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const j2bDir =
  "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";

const jump2a = [
  ["I drink <u>a glass of water</u>.", ["물 한 잔", "물한잔"], true],
  ["We have <u>a bottle of juice</u>.", ["주스 한 병", "주스한병"]],
  ["You drink <u>a cup of coffee</u>.", ["커피 한 잔", "커피한잔"]],
  ["Give me <u>ten sheets of paper</u>.", ["종이 열 장", "종이열장", "종이 10장"]],
  ["I have <u>a loaf of bread</u>.", ["빵 한 덩어리", "빵한덩어리"]],
  ["I eat <u>two pieces of cake</u>.", ["케이크 두 조각", "케이크두조각"]],
  ["We eat <u>a bowl of rice</u>.", ["밥 한 그릇", "쌀 한 그릇", "밥한그릇", "쌀한그릇"]],
  ["I need <u>six spoonfuls of sugar</u>.", ["설탕 여섯 숟가락", "설탕 6 숟가락", "설탕여섯숟가락"]],
  ["They buy <u>two kilos of flour</u>.", ["밀가루 2킬로", "밀가루 두 킬로", "밀가루2킬로"]],
  ["We have <u>a liter of milk</u>.", ["우유 1리터", "우유 한 리터", "우유1리터"]],
  ["They eat <u>four pieces of pizza</u>.", ["피자 네 조각", "피자 4조각", "피자네조각"]],
  ["I make <u>five bowls of salad</u>.", ["샐러드 다섯 그릇", "샐러드 5그릇"]],
  ["We buy <u>a loaf of meat</u>.", ["고기 한 덩어리", "고기한덩어리"]],
  ["I drink <u>three glasses of juice</u>.", ["주스 세 잔", "주스 3잔", "주스세잔"]],
  ["We need <u>a spoonful of salt</u>.", ["소금 한 숟가락", "소금한숟가락"]],
];

const jump2b = [
  ["I drink a glass of water.", "glass", "나는 물 한 잔을 마신다.", true],
  ["Give me a ____ of cake.", "piece", "내게 케이크 한 조각을 줘."],
  ["We buy a ____ of meat.", "loaf", "우리는 고기 한 덩어리를 산다."],
  ["We have a ____ of juice.", "bottle", "우리는 주스 한 병을 가지고 있다."],
  ["Give me a ____ of salt.", "spoonful", "내게 소금 한 숟가락을 줘."],
  ["I need two kilos of ____.", "rice", "나는 쌀 2킬로가 필요하다."],
  ["I eat a bowl of ____.", "soup", "나는 수프 한 그릇을 먹는다."],
  ["Give me a sheet of ____.", "paper", "내게 종이 한 장을 줘."],
  ["I drink two cups of ____.", "tea", "나는 차 두 잔을 마신다."],
  ["I need two bowls of ____.", "salad", "나는 샐러드 두 그릇이 필요하다."],
  ["They buy two ____ of milk.", "bottles", "그들은 우유 두 병을 산다."],
  ["I eat two ____ of bread.", "loaves", "나는 빵 두 덩어리를 먹는다."],
  ["Give me two ____ of ink.", "bottles", "내게 잉크 두 병을 줘."],
  ["I eat two ____ of pizza.", "pieces", "나는 피자 두 조각을 먹는다."],
  ["I need two ____ of oil.", "spoonfuls", "나는 기름 두 숟가락이 필요하다."],
];

write(
  "lesson02-jump.json",
  practice(
    "lesson02-jump",
    "Lesson 02 Jump — 셀 수 없는 명사의 특징",
    "pp. 72–73",
    "72–73",
    24,
    "Section A는 밑줄 친 양 표현의 우리말 뜻, Section B는 빈칸에 단위·물질명사를 씁니다.",
    [
      sec("A", "Section A", j2aDir, "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", j2bDir, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    [
      ...jump2a.map((row, i) => {
        const [prompt, accept, ex] = row;
        const opts = { sectionInstructionKo: j2aDir };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: accept[0] });
        return fill("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, accept, opts);
      }),
      ...jump2b.map((row, i) => {
        const [prompt, ans, ko, ex] = row;
        const opts = { sectionInstructionKo: j2bDir, promptKo: ko };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return fill("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), prompt, [ans], opts);
      }),
    ]
  )
);

// —— Lesson 02 Fly (pp.74–75) ——
const f2aDir =
  "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const f2bDir =
  "주어진 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";

const fly2a = [
  ["I drink <u>a piece</u> of water.", "glass", "나는 물 한 잔을 마신다.", true],
  ["You eat <u>a loaf</u> of soup.", "bowl", "너는 수프 한 그릇을 먹는다."],
  ["We need <u>a spoonful</u> of pizza.", "piece", "우리는 피자 한 조각이 필요하다."],
  ["I eat <u>a bottle</u> of rice.", "bowl", "나는 밥 한 그릇을 먹는다."],
  ["I need <u>a cup</u> of paper.", "sheet", "나는 종이 한 장이 필요하다."],
  ["We need three kilos of <u>flours</u>.", "flour", "우리는 밀가루 3킬로가 필요하다."],
  ["They need a cup of <u>waters</u>.", "water", "그들은 물 한 컵이 필요하다."],
  ["I buy two bottles of <u>milks</u>.", "milk", "나는 우유 두 병을 산다."],
  ["Give me two sheets of <u>papers</u>.", "paper", "내게 종이 두 장을 줘."],
  ["We want six bowls of <u>salads</u>.", "salad", "우리는 샐러드 여섯 그릇을 원한다."],
  ["I need ten <u>spoonful</u> of oil.", "spoonfuls", "나는 기름 열 숟가락이 필요하다."],
  ["I buy two <u>kilo</u> of sugar.", "kilos", "나는 설탕 2킬로를 산다."],
  ["They eat two <u>piece</u> of cake.", "pieces", "그들은 케이크 두 조각을 먹는다."],
  ["We need four <u>loaf</u> of cheese.", "loaves", "우리는 치즈 네 덩어리가 필요하다."],
  ["I have two <u>sheet</u> of paper.", "sheets", "나는 종이 두 장을 가지고 있다."],
];

const fly2b = [
  ["I drink a glass of water.", "물 한 잔", true],
  ["I eat a loaf of bread.", "빵 한 덩어리"],
  ["Give me two sheets of paper.", "종이 두 장"],
  ["I buy three kilos of rice.", "쌀 3킬로"],
  ["We eat five pieces of pizza.", "피자 다섯 조각"],
  ["I eat a bowl of salad.", "샐러드 한 그릇"],
  ["They need a spoonful of salt.", "소금 한 숟가락"],
  ["I eat two pieces of cake.", "케이크 두 조각"],
  ["You drink a cup of tea.", "차 한 잔"],
  ["We buy two bottles of water.", "물 두 병"],
  ["Give me a bowl of rice.", "밥 한 그릇"],
  ["I drink three cups of coffee.", "커피 세 잔"],
  ["We have a kilo of sugar.", "설탕 1킬로"],
  ["I drink a bottle of juice.", "주스 한 병"],
  ["I eat two bowls of soup.", "수프 두 그릇"],
];

write(
  "lesson02-fly.json",
  practice(
    "lesson02-fly",
    "Lesson 02 Fly — 셀 수 없는 명사의 특징",
    "pp. 74–75",
    "74–75",
    28,
    "Section A는 밑줄 친 단위·명사 고치기, Section B는 우리말 뜻에 맞는 영어 문장 전체를 씁니다.",
    [
      sec("A", "Section A", f2aDir, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", f2bDir, "주어진 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    [
      ...fly2a.map((row, i) => {
        const [prompt, ans, ko, ex] = row;
        const opts = { sectionInstructionKo: f2aDir, promptKo: ko };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ans });
        return fill("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), prompt, [ans], opts);
      }),
      ...fly2b.map((row, i) => {
        const [ansSent, ko, ex] = row;
        const opts = { sectionInstructionKo: f2bDir, promptKo: ko };
        if (ex) Object.assign(opts, { example: true, displayOnly: true, exampleAnswer: ansSent });
        return sent("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), "영어 문장 전체를 쓰세요.", [ansSent], opts);
      }),
    ]
  )
);

// —— Review 03 (pp.76–78) ——
const reviewSections = [
  sec("1", "[1]", "다음 중 셀 수 없는 명사가 아닌 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 중 셀 수 없는 명사가 아닌 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["1"]),
  sec("2", "[2]", "다음 중 물질명사를 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 중 물질명사를 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["2"]),
  sec("3", "[3]", "다음 중 추상명사를 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 중 추상명사를 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["3"]),
  sec("4", "[4]", "다음 중 고유명사를 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 중 고유명사를 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["4"]),
  sec("5", "[5]", "다음 중 같은 종류의 명사끼리 짝지어진 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 중 같은 종류의 명사끼리 짝지어진 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["5"]),
  sec("6-8", "[6–8]", "[6–8] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 문장의 빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["6", "7", "8"]),
  sec("9-12", "[9–12]", "[9–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)", "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 4, 0, ["9", "10", "11", "12"]),
  sec("13-15", "[13–15]", "[13–15] 다음 문장을 아래와 같이 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)", "다음 문장을 아래와 같이 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["13", "14", "15"]),
  sec("16-18", "[16–18]", "[16–18] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요.", "다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 3, 0, ["16", "17", "18"]),
  sec("19-20", "[19–20]", "[19–20] 다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요. 문장 전체를 쓰세요.", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
];

const reviewItems = [
  mc("q01", "1", "1", "", ["air", "toy", "cheese", "hope"], ["toy", "2"], { sectionInstructionKo: reviewSections[0].instructionKo }),
  mc("q02", "2", "2", "", ["love", "milk", "Mr. Park", "math"], ["milk", "2"], { sectionInstructionKo: reviewSections[1].instructionKo }),
  mc("q03", "3", "3", "", ["water", "snow", "peace", "Tommy"], ["peace", "3"], { sectionInstructionKo: reviewSections[2].instructionKo }),
  mc("q04", "4", "4", "", ["country", "singer", "sunshine", "Friday"], ["Friday", "4"], { sectionInstructionKo: reviewSections[3].instructionKo }),
  mc("q05", "5", "5", "", ["love – cat", "table – hope", "Paul – singer", "water – gas"], ["water – gas", "4"], { sectionInstructionKo: reviewSections[4].instructionKo }),
  mc("q06", "6-8", "6", "I drink a _____ of water.", ["piece", "sheet", "loaf", "glass"], ["glass", "4"], { sectionInstructionKo: reviewSections[5].instructionKo, promptKo: "물 한 잔" }),
  mc("q07", "6-8", "7", "We buy a _____ of bread.", ["bottle", "liter", "loaf", "spoonful"], ["loaf", "3"], { sectionInstructionKo: reviewSections[5].instructionKo, promptKo: "빵 한 덩어리" }),
  mc("q08", "6-8", "8", "You eat a _____ of pizza.", ["sheet", "piece", "glass", "cup"], ["piece", "2"], { sectionInstructionKo: reviewSections[5].instructionKo, promptKo: "피자 한 조각" }),
  mc("q09", "9-12", "9", "I eat two ( bowl / bowls ) of salad.", ["bowl", "bowls"], ["bowls"], { sectionInstructionKo: reviewSections[6].instructionKo, promptKo: "나는 샐러드를 두 그릇 먹는다." }),
  mc("q10", "9-12", "10", "We need three ( kilo / kilos ) of sugar.", ["kilo", "kilos"], ["kilos"], { sectionInstructionKo: reviewSections[6].instructionKo, promptKo: "우리는 설탕 3킬로가 필요하다." }),
  mc("q11", "9-12", "11", "I need ( two sheet of papers / two sheets of paper ).", ["two sheet of papers", "two sheets of paper"], ["two sheets of paper"], { sectionInstructionKo: reviewSections[6].instructionKo, promptKo: "나는 종이 두 장이 필요하다." }),
  mc("q12", "9-12", "12", "They buy ( four bottles of juice / four bottles of juices ).", ["four bottles of juice", "four bottles of juices"], ["four bottles of juice"], { sectionInstructionKo: reviewSections[6].instructionKo, promptKo: "그들은 주스 네 병을 산다." }),
  fill("q13", "13-15", "13", "We need a loaf of meat. → We need two _____ of meat.", ["loaves"], { sectionInstructionKo: reviewSections[7].instructionKo }),
  fill("q14", "13-15", "14", "I drink a glass of juice. → I drink two _____ of juice.", ["glasses"], { sectionInstructionKo: reviewSections[7].instructionKo }),
  fill("q15", "13-15", "15", "I eat a piece of cake. → I eat three _____ of cake.", ["pieces"], { sectionInstructionKo: reviewSections[7].instructionKo }),
  sent("q16", "16-18", "16", "We drink <u>milks</u> every day.", ["We drink milk every day."], { sectionInstructionKo: reviewSections[8].instructionKo }),
  sent("q17", "16-18", "17", "I like <u>a baseball</u>.", ["I like baseball."], { sectionInstructionKo: reviewSections[8].instructionKo }),
  sent("q18", "16-18", "18", "I need three <u>spoonful of oil</u>.", ["I need three spoonfuls of oil."], { sectionInstructionKo: reviewSections[8].instructionKo }),
  sent("q19", "19-20", "19", "나는 수프 한 그릇을 먹는다. ( a / of / bowl / soup )", ["I eat a bowl of soup."], { sectionInstructionKo: reviewSections[9].instructionKo }),
  sent("q20", "19-20", "20", "그들은 밀가루 2킬로를 산다. ( kilos / two / of / flour )", ["They buy two kilos of flour."], { sectionInstructionKo: reviewSections[9].instructionKo }),
];

write(
  "review-03.json",
  practice(
    "review03",
    "Review 03",
    "Unit 03 셀 수 없는 명사 (pp. 76–78)",
    "76–78",
    30,
    "Review 03은 1–20번입니다. Check Check 점수표(78쪽)는 채점하지 않아요.",
    reviewSections,
    reviewItems
  )
);

console.log("Wrote BlueZap 1 Unit 03 JSON to", OUT);
