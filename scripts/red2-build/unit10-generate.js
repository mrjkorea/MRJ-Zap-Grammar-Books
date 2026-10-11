/* Generate data/red2/unit10/*.json — RedZap 2 Unit 10 명령문 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit10");

const META = {
  bookId: "zap-red-2",
  bookTitle: "ZAP Red 2",
  appName: "RedZap 2",
  unitId: "unit-10",
  unitTitle: "Unit 10 — 명령문",
  sectionsVersion: 1,
};

function write(name, doc) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(doc, null, 2) + "\n");
}

function matchItem(id, section, label, pairs, sectionInstructionKo, extra = {}) {
  const accept = pairs.map((p) => `${p.left}|${p.right}`);
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo,
    answerMode: "match",
    answerModeTag: "Match · 짝 맞추기",
    label,
    type: "match",
    pairs,
    accept,
    ...extra,
  };
}

function mcItem(id, section, label, promptEn, choices, acceptIdx, sectionInstructionKo, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: [String(acceptIdx)],
    ...extra,
  };
}

function fillItem(id, section, label, promptEn, accept, sectionInstructionKo, extra = {}) {
  const blanks = extra.blanks || (String(accept[0]).includes("|") ? accept[0].split("|").length : 1);
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo,
    answerMode: extra.answerMode || "words",
    answerModeTag: extra.answerModeTag || "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept,
    ...extra,
  };
}

function base(practiceId, title, subtitle, pages, introKo, sections, items) {
  return { practiceId, title, subtitle, pages, timerMinutes: 20, introKo, sections, items, ...META };
}

// —— Walk ——
const walkAInstr =
  "다음 문장의 뜻을 생각하며 동사원형을 따라 써 보세요. 한국어 뜻과 영어 명령문을 짝지어 연결하세요.";
const walkAPairs1 = [
  { left: "들어오다", right: "Come in." },
  { left: "눈을 뜨세요", right: "Open your eyes." },
  { left: "일찍 일어나라", right: "Get up early." },
  { left: "일찍 자라", right: "Go to bed early." },
  { left: "조심해라", right: "Be careful." },
];
const walkAPairs2 = [
  { left: "친절하게 대해라", right: "Be kind." },
  { left: "천천히 말하세요", right: "Please speak slowly." },
  { left: "공을 건네주세요", right: "Please pass me the ball." },
  { left: "일어서세요", right: "Stand up, please." },
  { left: "앉으세요", right: "Sit down, please." },
];

const walkBInstr =
  "다음 문장의 뜻을 생각하며 「Don't+동사원형」을 따라 써 보세요. 한국어 뜻과 영어 문장을 짝지어 연결하세요.";
const walkBPairs = [
  { left: "울지 마라", right: "Don't cry." },
  { left: "걱정하지 마라", right: "Don't worry." },
  { left: "큰 소리로 말하지 마라", right: "Don't speak loudly." },
  { left: "슬퍼하지 마라", right: "Don't be sad." },
  { left: "어리석게 굴지 마라", right: "Don't be silly." },
];

const walkCInstr =
  "다음 대화의 뜻을 생각하며 따라 써 보세요. A의 Let's 문장과 B의 대답을 짝지어 연결하세요.";
const walkCPairs = [
  { left: "Let's go swimming.", right: "OK!" },
  { left: "Let's make sandwiches.", right: "Yes!" },
  { left: "Let's play chess.", right: "Sure." },
  { left: "Let's jump rope.", right: "All right." },
  { left: "Let's sing together.", right: "Sure." },
];

const walk = base(
  "r2:u10:walk",
  "Grammar Walk",
  "명령문 따라쓰기 (p. 154–155)",
  "154–155",
  "Section A 2문항(명령문 짝 맞추기), B 1문항(Don't), C 1문항(Let's 대화)입니다.",
  [
    {
      id: "A",
      title: "Section A",
      instructionKo: walkAInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: walkBInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 1,
      exampleCount: 0,
      labels: ["B1"],
    },
    {
      id: "C",
      title: "Section C",
      instructionKo: walkCInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 1,
      exampleCount: 0,
      labels: ["C1"],
    },
  ],
  [
    matchItem("a01", "A", "A1", walkAPairs1, walkAInstr),
    matchItem("a02", "A", "A2", walkAPairs2, walkAInstr),
    matchItem("b01", "B", "B1", walkBPairs, walkBInstr),
    matchItem("c01", "C", "C1", walkCPairs, walkCInstr),
  ]
);

// —— Run ——
const runAInstr =
  "다음 문장에서 동사원형을 찾아 동그라미 하세요. 동그라미 칠 동사원형만 빈칸에 쓰세요.";
const runBInstr =
  "다음 문장에서 「Don't+동사원형」을 찾아 동그라미 하세요. 동그라미 친 부분만 빈칸에 쓰세요.";
const runCInstr =
  "다음 대화에서 「Let's+동사원형」을 찾아 동그라미 하세요. 동그라미 친 Let's … 부분만 빈칸에 쓰세요.";

const runA = [
  ["Be happy.", "Be", true],
  ["Drink some milk.", "Drink"],
  ["Be nice to your brother.", "Be"],
  ["Open the window.", "Open"],
  ["Study hard.", "Study"],
  ["Wake up, please.", "Wake up"],
  ["Wash your face.", "Wash"],
  ["Do your homework.", "Do"],
  ["Please listen to me.", "listen"],
  ["Close the door, please.", "Close"],
];

const runB = [
  ["Don't move.", "Don't move", true],
  ["Don't eat the sweets.", "Don't eat"],
  ["Don't be lazy.", "Don't be"],
  ["Don't chew gum in class.", "Don't chew"],
  ["Don't cry.", "Don't cry"],
];

const runC = [
  ["A: Let's go hiking. B: OK!", "Let's go", true],
  ["A: Let's take a taxi. B: All right.", "Let's take"],
  ["A: Let's fly the kites. B: Yes.", "Let's fly"],
  ["A: Let's study English. B: All right.", "Let's study"],
  ["A: Let's go swimming. B: Sure.", "Let's go"],
];

function runItems(section, rows, instr, idPrefix) {
  return rows.map((row, i) => {
    const [promptEn, ans, isEx] = row;
    const id = `${idPrefix}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = isEx
      ? { example: true, displayOnly: true, exampleAnswer: ans }
      : {};
    return fillItem(id, section, label, promptEn, [ans], instr, extra);
  });
}

const run = base(
  "r2:u10:run",
  "Grammar Run",
  "동사원형 · Don't · Let's (p. 156–157)",
  "156–157",
  "Section A 9문항, B 4문항, C 4문항(각 섹션 예시 1개는 채점 제외)입니다.",
  [
    {
      id: "A",
      title: "Section A",
      instructionKo: runAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runBInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5"],
    },
    {
      id: "C",
      title: "Section C",
      instructionKo: runCInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 1,
      labels: ["C2", "C3", "C4", "C5"],
    },
  ],
  [...runItems("A", runA, runAInstr, "a"), ...runItems("B", runB, runBInstr, "b"), ...runItems("C", runC, runCInstr, "c")]
);

// —— Jump ——
const jumpAInstr = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
const jumpBInstr = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

const jumpA = [
  [["Wash", "Washes"], "your hands.", 1, true],
  [["Catches", "Catch"], "the ball.", 2],
  [["Clean", "Cleans"], "your room.", 1],
  [["Be", "Am"], "a good boy.", 1],
  [["Listens", "Listen"], "to your teacher.", 2],
  [["Be", "Being"], "quiet in class.", 1],
  [["reading", "read"], "Please (reading / read) slowly.", 2],
  [["have", "having"], "Please (have / having) some cookies.", 1],
  [["Answer", "Answering"], "my question, please.", 1],
  [["Closing", "Close"], "the window, please.", 2],
];

const jumpB = [
  [["are", "be"], "Don't ___ sorry.", 2, true],
  [["swim", "swims"], "Don't ___ here.", 1],
  [["be", "is"], "Don't ___ afraid.", 1],
  [["touching", "touch"], "Don't ___ the vase.", 2],
  [["taking", "take"], "Don't ___ the bus.", 2],
  [["ride", "rides"], "A: Let's ___ a bike. B: OK!", 1],
  [["play", "plays"], "A: Let's ___ badminton. B: Yes!", 1],
  [["does", "do"], "A: Let's ___ the homework. B: Sure.", 2],
  [["clean", "cleaning"], "A: Let's ___ the house. B: All right.", 1],
  [["draw", "drawing"], "A: Let's ___ a monkey. B: Sure.", 1],
];

function jumpItems(section, rows, instr, idPrefix) {
  return rows.map((row, i) => {
    const [choices, promptEn, idx, isEx] = row;
    const id = `${idPrefix}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = isEx
      ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] }
      : {};
    return mcItem(id, section, label, promptEn, choices, idx, instr, extra);
  });
}

const jump = base(
  "r2:u10:jump",
  "Grammar Jump",
  "명령문 고르기 (p. 158–159)",
  "158–159",
  "Section A 9문항, B 9문항(각 예시 1개는 채점 제외)입니다.",
  [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpAInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpBInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  [...jumpItems("A", jumpA, jumpAInstr, "a"), ...jumpItems("B", jumpB, jumpBInstr, "b")]
);

// —— Fly ——
const flyAInstr = "주어진 동사를 사용하여 다음 문장을 완성하세요. 빈칸에 알맞은 말(동사원형)만 쓰세요.";
const flyBInstr =
  "Don't와 주어진 단어를 사용하여 ‘~하지 마라’라는 문장을 완성하세요. 빈칸에 Don't와 동사원형을 순서대로 쓰세요.";
const flyCInstr =
  "Let's와 주어진 단어를 사용하여 제안하는 문장을 완성하세요. 빈칸에 Let's와 동사원형을 순서대로 쓰세요.";

const flyA = [
  ["___ high. (jump)", "Jump", true],
  ["___ every day. (exercise)", "Exercise"],
  ["___ the dishes. (wash)", "Wash"],
  ["___ diligent. (is)", "Be"],
  ["___ ___ your coat. (put on)", "Put|on"],
  ["___ a strong boy. (am)", "Be"],
  ["Please ___ your name. (write)", "write"],
  ["Please ___ some cake. (have)", "have"],
  ["___ my bike, please. (fix)", "Fix"],
  ["___ to me, please. (listen)", "Listen"],
];

const flyB = [
  ["___ ___ here. (shout)", "Don't|shout", true],
  ["___ ___ at the pool. (run)", "Don't|run"],
  ["___ ___ angry. (be)", "Don't|be"],
  ["___ ___ on the bench. (sit)", "Don't|sit"],
  ["___ ___ the box. (open)", "Don't|open"],
];

const flyC = [
  ["A: ___ ___ a walk. (take) B: Sure.", "Let's|take", true],
  ["A: ___ ___ camping. (go) B: All right.", "Let's|go"],
  ["A: ___ ___ dinner. (have) B: OK!", "Let's|have"],
  ["A: ___ ___ her. (help) B: Yes!", "Let's|help"],
  ["A: ___ ___ together. (dance) B: All right.", "Let's|dance"],
];

function flyItems(section, rows, instr, idPrefix, defaults = {}) {
  return rows.map((row, i) => {
    const [promptEn, ans, isEx] = row;
    const blanks = typeof ans === "string" && ans.includes("|") ? ans.split("|").length : 1;
    const id = `${idPrefix}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = {
      blanks,
      ...defaults,
      ...(isEx ? { example: true, displayOnly: true, exampleAnswer: ans.replace(/\|/g, " ") } : {}),
    };
    const accept = Array.isArray(ans) ? ans : [ans];
    return fillItem(id, section, label, promptEn, accept, instr, extra);
  });
}

const fly = base(
  "r2:u10:fly",
  "Grammar Fly",
  "명령문 완성 (p. 160–161)",
  "160–161",
  "Section A 9문항, B 4문항, C 4문항(각 예시 1개는 채점 제외)입니다.",
  [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyBInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5"],
    },
    {
      id: "C",
      title: "Section C",
      instructionKo: flyCInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 1,
      labels: ["C2", "C3", "C4", "C5"],
    },
  ],
  [
    ...flyItems("A", flyA, flyAInstr, "a"),
    ...flyItems("B", flyB, flyBInstr, "b"),
    ...flyItems("C", flyC, flyCInstr, "c"),
  ]
);

const quiz1Instr = "다음 표의 빈칸에 알맞은 말을 쓰세요.";
const quiz1 = base(
  "r2:u10:quiz1",
  "QUIZ 1 — 명령문",
  "표 빈칸 (p. 162)",
  "162",
  "3문항입니다. 만화는 채점하지 않습니다.",
  [
    {
      id: "A",
      title: "QUIZ 1",
      instructionKo: quiz1Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 3,
      exampleCount: 0,
      labels: ["1", "2", "3"],
    },
  ],
  [
    fillItem("q01", "A", "1", "be동사 명령문 예: ___ nice. 친절하게 대해라.", ["Be"], quiz1Instr, {
      promptKo: "형식: Be ~.",
    }),
    fillItem(
      "q02",
      "A",
      "2",
      "일반동사 명령문 형식: ___ ~. (표의 형식 칸)",
      ["동사원형"],
      quiz1Instr,
      { promptKo: "예: Close the door." }
    ),
    fillItem(
      "q03",
      "A",
      "3",
      "공손하게 말할 때: 동사원형 ~, ___ . (표의 형식 칸)",
      ["please"],
      quiz1Instr,
      { accept: ["please", "Please"] }
    ),
  ]
);

const quiz2Instr = "다음 표의 빈칸에 알맞은 말을 쓰세요.";
const quiz2 = base(
  "r2:u10:quiz2",
  "QUIZ 2 — 부정 명령문 · Let's",
  "표 빈칸 (p. 163)",
  "163",
  "4문항입니다. 만화는 채점하지 않습니다.",
  [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 0,
      labels: ["1", "2", "3", "4"],
    },
  ],
  [
    fillItem("q01", "A", "1", "부정 명령문 형식: ___ + 동사원형 ~.", ["Don't"], quiz2Instr, {
      accept: ["Don't", "don't"],
    }),
    fillItem("q02", "A", "2", "제안하는 문장 형식: ___ + 동사원형 ~.", ["Let's"], quiz2Instr, {
      accept: ["Let's", "let's"],
    }),
    fillItem(
      "q03",
      "A",
      "3",
      "A: Let's do the homework. B: ___ . 그래.",
      ["Sure"],
      quiz2Instr,
      { accept: ["Sure", "sure", "Yes", "yes", "OK", "Ok", "ok"] }
    ),
    fillItem("q04", "A", "4", "B: All ___ . 좋아.", ["right"], quiz2Instr),
  ]
);

for (const [name, doc] of [
  ["walk.json", walk],
  ["run.json", run],
  ["jump.json", jump],
  ["fly.json", fly],
  ["quiz1.json", quiz1],
  ["quiz2.json", quiz2],
]) {
  write(name, doc);
}

console.log("Wrote", OUT);
