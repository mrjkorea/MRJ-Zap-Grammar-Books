/* Generate data/blue1/unit04/*.json — run: node scripts/blue1-build/unit04-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue1/unit04");
const META = {
  bookId: "zap-blue-1",
  bookTitle: "ZAP Blue 1",
  appName: "BlueZap 1",
  unitId: "unit-04",
  unitTitle: "Unit 04 — 관사",
};

const X_OK = ["X", "x", "×", "필요 없음", "필요없음", "-"];
const OX = ["O", "o", "0", "X", "x"];

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return { id, title, instructionKo, directionKo, ruleKo, answerMode, answerModeTag: tag, itemCount, exampleCount, labels };
}

function baseItem(id, section, label, opts) {
  return Object.assign(
    {
      id,
      section,
      sectionTitle: opts.sectionTitle || "Section " + section,
      sectionInstructionKo: opts.sectionInstructionKo,
      answerMode: opts.answerMode || "words",
      answerModeTag: opts.answerModeTag || "Words · 빈칸 말만",
      label,
    },
    opts
  );
}

function fill(id, section, label, promptEn, accept, opts) {
  opts = opts || {};
  const item = baseItem(id, section, label, opts);
  item.type = opts.type || "fill";
  item.promptEn = promptEn;
  item.accept = Array.isArray(accept) ? accept : [accept];
  if (opts.promptKo) item.promptKo = opts.promptKo;
  if (opts.blanks) item.blanks = opts.blanks;
  if (opts.unordered) item.unordered = true;
  return item;
}

function mc(id, section, label, promptEn, choices, accept, opts) {
  opts = opts || {};
  const item = baseItem(id, section, label, Object.assign({}, opts, { answerMode: "choice", answerModeTag: "Choose · 고르기" }));
  item.type = "mc";
  item.promptEn = promptEn;
  item.choices = choices;
  item.accept = Array.isArray(accept) ? accept : [accept];
  if (opts.promptKo) item.promptKo = opts.promptKo;
  return item;
}

function ex(item, exampleAnswer) {
  return Object.assign({}, item, { example: true, displayOnly: true, exampleAnswer });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

function pack(practiceId, title, subtitle, pages, timerMinutes, introKo, sections, items, extra) {
  return Object.assign(
    {
      practiceId,
      title,
      subtitle,
      pages,
      timerMinutes,
      ...META,
      sectionsVersion: 2,
      introKo,
      sections,
      items,
    },
    extra || {}
  );
}

const MEAN_CH = ["a. 직업, 신분", "b. 하나의(one)", "c. ~마다, 매 ~"];

// —— Lesson 01 Walk 1 (p. 83) ——
(function () {
  const iA =
    "다음 문장에서 부정관사 a, an을 찾아 동그라미 하세요. 동그라미 친 관사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const iB = "다음 말이 맞으면 O에, 틀리면 X에 동그라미 하세요. O 또는 X만 빈칸에 쓰세요.";
  const items = [
    ex(fill("a01", "A", "A1", "This is an elephant.", ["an"], { sectionInstructionKo: iA, promptKo: "이것은 코끼리다." }), "an"),
    fill("a02", "A", "A2", "They have a house.", ["a"], { sectionInstructionKo: iA, promptKo: "그들은 집이 있다." }),
    fill("a03", "A", "A3", "I have a desk.", ["a"], { sectionInstructionKo: iA, promptKo: "나는 책상이 있다." }),
    fill("a04", "A", "A4", "We need a chair.", ["a"], { sectionInstructionKo: iA, promptKo: "우리는 의자가 필요하다." }),
    fill("a05", "A", "A5", "That is an igloo.", ["an"], { sectionInstructionKo: iA, promptKo: "저것은 이글루이다." }),
    ex(fill("b01", "B", "B1", "a glass", OX.filter((x) => x === "O" || x === "o" || x === "0"), { sectionInstructionKo: iB }), "O"),
    fill("b02", "B", "B2", "a rain", ["X", "x"], { sectionInstructionKo: iB, promptKo: "비 (셀 수 없음)" }),
    fill("b03", "B", "B3", "an Asia", ["X", "x"], { sectionInstructionKo: iB, promptKo: "아시아 (고유명사)" }),
    fill("b04", "B", "B4", "an orange", ["O", "o", "0"], { sectionInstructionKo: iB, promptKo: "오렌지 한 개" }),
    fill("b05", "B", "B5", "a desk", ["O", "o", "0"], { sectionInstructionKo: iB, promptKo: "책상 한 개" }),
  ];
  write(
    "lesson01-walk1.json",
    pack(
      "b1:u04:lesson01-walk1",
      "Lesson 01 Walk 1 — 부정관사 a/an",
      "Grammar Walk · a/an 찾기 (p. 83)",
      "83",
      10,
      "Section A는 문장에서 a/an을 찾아 쓰고, Section B는 O/X입니다. 예시는 채점하지 않아요.",
      [
        sec("A", "Section A", iA, "다음 문장에서 부정관사 a, an을 찾아 동그라미 하세요.", "동그라미 친 관사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
        sec("B", "Section B", iB, "다음 말이 맞으면 O에, 틀리면 X에 동그라미 하세요.", "O 또는 X만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
      ],
      items
    )
  );
})();

// —— Lesson 01 Walk 2 (p. 85) ——
(function () {
  const iA =
    "다음 문장의 밑줄 친 부정관사 a/an의 의미를 찾아 선으로 연결하세요. 알맞은 뜻(a~c)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const iB = "다음 말이 맞으면 O, 틀리면 X를 빈칸에 쓰세요.";
  const items = [
    ex(
      mc("a01", "A", "A1", "My father is <u>a</u> writer.", MEAN_CH, ["a. 직업, 신분", "a"], {
        sectionInstructionKo: iA,
        promptKo: "우리 아버지는 작가이다.",
      }),
      "a. 직업, 신분"
    ),
    mc("a02", "A", "A2", "I have two pencils and <u>a</u> pen.", MEAN_CH, ["b. 하나의(one)", "b"], { sectionInstructionKo: iA }),
    mc("a03", "A", "A3", "I eat three meals <u>a</u> day.", MEAN_CH, ["c. ~마다, 매 ~", "c"], { sectionInstructionKo: iA }),
    mc("a04", "A", "A4", "She is <u>a</u> painter.", MEAN_CH, ["a. 직업, 신분", "a"], { sectionInstructionKo: iA }),
    mc("a05", "A", "A5", "We go there once <u>a</u> week.", MEAN_CH, ["c. ~마다, 매 ~", "c"], { sectionInstructionKo: iA }),
    ex(fill("b01", "B", "B1", "a students", ["X", "x"], { sectionInstructionKo: iB }), "X"),
    fill("b02", "B", "B2", "a ball", ["O", "o", "0"], { sectionInstructionKo: iB }),
    fill("b03", "B", "B3", "a jeans", ["X", "x"], { sectionInstructionKo: iB }),
    fill("b04", "B", "B4", "a books", ["X", "x"], { sectionInstructionKo: iB }),
    fill("b05", "B", "B5", "a glass", ["O", "o", "0"], { sectionInstructionKo: iB }),
  ];
  write(
    "lesson01-walk2.json",
    pack(
      "b1:u04:lesson01-walk2",
      "Lesson 01 Walk 2 — 부정관사 a/an",
      "의미 연결 · O/X (p. 85)",
      "85",
      10,
      "Section A는 밑줄 친 a/an의 의미를 고르고, Section B는 O/X입니다.",
      [
        sec("A", "Section A", iA, "밑줄 친 a/an의 의미를 연결하세요.", "보기 a~c 중 하나를 고르세요.", "choice", "Choose · 고르기", 4, 1, ["A2", "A3", "A4", "A5"]),
        sec("B", "Section B", iB, "맞으면 O, 틀리면 X.", "O 또는 X만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
      ],
      items
    )
  );
})();

// —— Lesson 01 Run (pp. 86–87) ——
(function () {
  const iA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요. (직접 쓰지 않아요.)";
  const iB =
    "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요. (직접 쓰지 않아요.)";
  const ab = ["a", "an"];
  const runA = [
    ["This is ( a / an ) notebook.", "a"],
    ["She is ( a / an ) dancer.", "a"],
    ["They have ( a / an ) cat.", "a"],
    ["We have ( a / an ) hour.", "an"],
    ["I want ( a / an ) umbrella.", "an"],
    ["It is ( a / an ) mobile phone.", "a"],
    ["I wear ( a / an ) uniform.", "a"],
    ["You want ( a / an ) flower.", "a"],
    ["They give me ( a / an ) egg.", "an"],
    ["I need ( a / an ) cap.", "a"],
    ["I eat ( a / an ) apple.", "an"],
    ["This is ( a / an ) orange.", "an"],
    ["I go to the library once ( a / an ) week.", "a"],
    ["I drink three glasses of milk ( a / an ) day.", "a"],
    ["We play soccer three times ( a / an ) month.", "a"],
  ];
  const runB = [
    ["_______ elephant is big.", ["An", "an"], ["A", "a"]],
    ["We need _______ bus.", ["a"], ["an"]],
    ["We like _______ monkeys.", ["a"], X_OK],
    ["I have _______ computer.", ["a"], X_OK],
    ["You need _______ umbrella.", ["a"], ["an"]],
    ["She is _______ nurse.", ["a"], X_OK],
    ["Picasso is _______ artist.", ["a"], ["an"]],
    ["We have _______ two dogs.", ["a"], X_OK],
    ["They are _______ students.", ["a"], X_OK],
    ["_______ park is in town.", ["A", "a"], ["An", "an"]],
    ["_______ ant is small.", ["An", "an"], X_OK],
    ["I have three _______ cats.", ["a"], X_OK],
    ["We want _______ love.", ["a"], X_OK],
    ["They need _______ sunshine.", ["a"], X_OK],
    ["They buy _______ meat there.", ["a"], X_OK],
  ];
  const items = [ex(mc("a01", "A", "A1", runA[0][0], ab, [runA[0][1], "1"], { sectionInstructionKo: iA }), "a")];
  runA.slice(1).forEach((row, idx) => {
    const n = idx + 2;
    items.push(mc("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], ab, [row[1], row[1] === "an" ? "2" : "1"], { sectionInstructionKo: iA }));
  });
  const runBAns = ["An", "a", "필요 없음", "a", "an", "a", "an", "필요 없음", "필요 없음", "A", "An", "필요 없음", "필요 없음", "필요 없음", "필요 없음"];
  runB.forEach((row, idx) => {
    const n = idx + 1;
    const label = "B" + n;
    const id = "b" + String(n).padStart(2, "0");
    const ans = runBAns[idx];
    let ch;
    if (ans === "필요 없음") ch = ["a", "필요 없음"];
    else if (ans === "An") ch = ["An", "A"];
    else if (ans === "A") ch = ["A", "An"];
    else if (ans === "an") ch = ["a", "an"];
    else ch = ["a", "an"];
    const accept =
      ans === "필요 없음"
        ? ["2", "필요 없음", "X", "x"]
        : ans === "an"
          ? ch[0] === "a"
            ? ["2", "an"]
            : ["1", "an"]
          : ans === "An"
            ? ch[0] === "An"
              ? ["1", "An", "an"]
              : ["2", "An", "an"]
            : ans === "A"
              ? ["1", "A", "a"]
              : ["1", "a"];
    const it = mc(id, "B", label, row[0], ch, accept, { sectionInstructionKo: iB });
    items.push(n === 1 ? ex(it, "An") : it);
  });
  write(
    "lesson01-run.json",
    pack(
      "b1:u04:lesson01-run",
      "Lesson 01 Run — 부정관사 a/an",
      "괄호 고르기 · 빈칸 고르기 (pp. 86–87)",
      "86–87",
      20,
      "Section A는 a/an 고르기, Section B는 관사 또는 ‘필요 없음’ 고르기입니다.",
      [
        sec("A", "Section A", iA, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, [
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
        sec("B", "Section B", iB, "빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, [
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
      items
    )
  );
})();

// —— Lesson 01 Jump (pp. 88–89) ——
(function () {
  const iA =
    "다음 문장의 빈칸에 a 또는 an을 쓰세요. 필요 없는 곳에는 X표 하세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const iB =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const jumpA = [
    ["We have ______ house.", ["a"], true],
    ["Renoir is ______ artist.", ["an"]],
    ["I drink ______ milk.", X_OK],
    ["You have ______ eraser.", ["an"]],
    ["They eat ______ bread.", X_OK],
    ["We need ______ time.", X_OK],
    ["I run two kilometers ______ day.", ["a"]],
    ["They have ______ three sons.", X_OK],
    ["I read ______ storybook.", ["a"]],
    ["They have ______ two daughters.", X_OK],
    ["I want ______ water.", X_OK],
    ["You like ______ orange juice.", X_OK],
    ["My father is ______ scientist.", ["a"]],
    ["Give me ______ tomato.", ["a"]],
    ["He is ______ police officer.", ["a"]],
  ];
  const items = [];
  jumpA.forEach((row, idx) => {
    const n = idx + 1;
    const acc = row[1] === X_OK ? X_OK : row[1];
    const it = fill("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], acc, { sectionInstructionKo: iA });
    items.push(row[2] ? ex(it, "a") : it);
  });
  const koB = [
    ["She is <u>a student</u>.", ["학생", "한 명의 학생"]],
    ["I play baseball <u>once a week</u>.", ["일주일에 한 번", "주에 한 번"]],
    ["They have <u>a daughter</u>.", ["딸 한 명", "딸"]],
    ["My sister is <u>a nurse</u>.", ["간호사"]],
    ["I want two pens and <u>a notebook</u>.", ["공책 한 권", "공책"]],
    ["I need <u>a ruler</u>.", ["자 한 개", "자"]],
    ["I have <u>a cat</u>.", ["고양이 한 마리", "고양이"]],
    ["She is <u>a child</u>.", ["어린이", "아이"]],
    ["We walk four kilometers <u>a day</u>.", ["하루에", "매일"]],
    ["My father is <u>a painter</u>.", ["화가"]],
    ["<u>A giraffe</u> is tall.", ["기린 한 마리", "기린"]],
    ["I eat three meals <u>a day</u>.", ["하루에", "매일"]],
    ["Give me <u>an eraser</u>.", ["지우개", "지우개 한 개"]],
    ["He is <u>an actor</u>.", ["배우", "(남자)배우"]],
    ["They buy <u>a car</u>.", ["자동차 한 대", "자동차"]],
  ];
  koB.forEach((row, idx) => {
    const n = idx + 1;
    items.push(fill("b" + String(n).padStart(2, "0"), "B", "B" + n, row[0], row[1], { sectionInstructionKo: iB }));
  });
  write(
    "lesson01-jump.json",
    pack(
      "b1:u04:lesson01-jump",
      "Lesson 01 Jump — 부정관사 a/an",
      "빈칸 · 우리말 뜻 (pp. 88–89)",
      "88–89",
      24,
      "Section A는 a/an/X, Section B는 밑줄 친 부분의 우리말 뜻입니다.",
      [
        sec("A", "Section A", iA, "a 또는 an을 쓰거나 X표 하세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
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
        sec("B", "Section B", iB, "밑줄 친 부분의 우리말 뜻을 쓰세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 15, 0, [
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
      items
    )
  );
})();

require("./unit04-generate-rest.js")({
  write,
  pack,
  sec,
  fill,
  mc,
  ex,
  X_OK,
});
