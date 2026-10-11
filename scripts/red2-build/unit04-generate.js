/* Generate RedZap 2 Unit 04 practice JSON (부사와 전치사, PDF 55–68). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit04");

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", fp);
}

function mcItem(id, section, label, promptEn, choices, acceptIdx, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: [String(acceptIdx)],
    ...(extra.example
      ? { example: true, displayOnly: true, exampleAnswer: choices[acceptIdx - 1] }
      : {}),
    ...(extra.promptKo ? { promptKo: extra.promptKo } : {}),
  };
}

function fillItem(id, section, label, promptEn, accept, extra = {}) {
  const blanks = extra.blanks || 1;
  const acc = Array.isArray(accept) ? accept : [accept];
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: "words",
    answerModeTag: extra.answerModeTag || "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept: acc,
    ...(extra.promptKo ? { promptKo: extra.promptKo } : {}),
    ...(extra.example
      ? { example: true, displayOnly: true, exampleAnswer: acc[0].includes("|") ? acc[0].split("|").join(" ") : acc[0] }
      : {}),
  };
}

function matchItem(id, section, label, pairs, sectionInstructionKo) {
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
  };
}

// —— walk ——
const walkAInstr =
  "다음 문장의 뜻을 생각하며 부사를 따라 써 보세요. 문장과 알맞은 부사를 짝지어 연결하세요.";
const walkBInstr =
  "다음 말의 뜻을 생각하며 전치사를 따라 써 보세요. 표현과 알맞은 전치사를 짝지어 연결하세요.";

const walkAPairs = [
  { left: "I dance ___", right: "well" },
  { left: "You sing ___ well", right: "very" },
  { left: "He is ___ diligent", right: "so" },
  { left: "She lives ___", right: "happily" },
  { left: "We think ___", right: "carefully" },
  { left: "Susie speaks ___", right: "slowly" },
  { left: "Susie gets up ___", right: "early" },
  { left: "Haha runs ___", right: "fast" },
  { left: "The nurses study ___", right: "hard" },
  { left: "The nurses help him ___", right: "kindly" },
];

const walkBPairs = [
  { left: "six o'clock", right: "at" },
  { left: "Sunday", right: "on" },
  { left: "Christmas Day", right: "on" },
  { left: "October", right: "in" },
  { left: "2013", right: "in" },
  { left: "the car", right: "in" },
  { left: "the piano", right: "on" },
  { left: "under the bridge", right: "under" },
  { left: "the hospital", right: "behind" },
  { left: "the park", right: "next to" },
];

const walk = {
  practiceId: "r2:u04:walk",
  title: "Grammar Walk",
  subtitle: "부사 · 전치사 따라쓰기 (p. 58–59)",
  pages: "58–59",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(부사 짝 맞추기), Section B 2문항(전치사 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
  sections: [
    {
      id: "A",
      title: "Section A — 부사",
      instructionKo: walkAInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B — 전치사",
      instructionKo: walkBInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchItem("a01", "A", "A1", walkAPairs.slice(0, 7), walkAInstr),
    matchItem("a02", "A", "A2", walkAPairs.slice(7), walkAInstr),
    matchItem("b01", "B", "B1", walkBPairs.slice(0, 7), walkBInstr),
    matchItem("b02", "B", "B2", walkBPairs.slice(7), walkBInstr),
  ],
};

// —— run ——
const runAInstr = "다음 문장에서 부사를 찾아 동그라미 하세요. 동그라미 친 부사만 빈칸에 쓰세요.";
const runBInstr = "다음 문장에서 시간을 나타내는 전치사를 찾아 동그라미 하세요. 전치사만 쓰세요.";
const runCInstr = "다음 문장에서 장소를 나타내는 전치사를 찾아 동그라미 하세요. 전치사만 쓰세요.";

const runSentencesA = [
  ["She jumps well.", "well", { example: true }],
  ["She studies English very hard.", "hard"],
  ["We walk slowly.", "slowly"],
  ["We are very happy.", "very"],
  ["They are so fat.", "so"],
  ["They drive a car quickly.", "quickly"],
  ["Mark looks at me sadly.", "sadly"],
  ["Mark shouts loudly.", "loudly"],
  ["My grandpa makes a box easily.", "easily"],
  ["My grandpa smiles happily.", "happily"],
];

const runSentencesB = [
  ["My birthday is in March.", "in", { example: true }],
  ["He gets up at five o'clock.", "at"],
  ["He doesn't go to school on Sunday.", "on"],
  ["We go to Seoul in October.", "in"],
  ["We play soccer on Monday.", "on"],
];

const runSentencesC = [
  ["She is in the room.", "in"],
  ["She is under the tree.", "under"],
  ["A doll is on the box.", "on"],
  ["A doll is next to the box.", "next to"],
  ["A doll is behind the box.", "behind"],
];

const runItems = [];
let ri = 1;
for (const [sent, ans, opt] of runSentencesA) {
  const label = "A" + ri;
  runItems.push(
    fillItem(`a${String(ri).padStart(2, "0")}`, "A", label, sent, opt?.accept || [ans], {
      sectionInstructionKo: runAInstr,
      example: opt?.example,
    })
  );
  ri++;
}
ri = 1;
for (const [sent, ans, opt] of runSentencesB) {
  const label = "B" + ri;
  runItems.push(
    fillItem(`b${String(ri).padStart(2, "0")}`, "B", label, sent, opt?.accept || [ans], {
      sectionInstructionKo: runBInstr,
      example: opt?.example,
    })
  );
  ri++;
}
ri = 1;
for (const [sent, ans, opt] of runSentencesC) {
  const label = "C" + ri;
  const acc = opt?.accept || [ans];
  runItems.push(
    fillItem(`c${String(ri).padStart(2, "0")}`, "C", label, sent, acc, {
      sectionInstructionKo: runCInstr,
      example: opt?.example,
    })
  );
  ri++;
}

const run = {
  practiceId: "r2:u04:run",
  title: "Grammar Run",
  subtitle: "부사 · 전치사 찾기 (p. 60–61)",
  pages: "60–61",
  timerMinutes: 20,
  introKo: "Section A 10문항(부사 쓰기), B 5문항(시간 전치사), C 5문항(장소 전치사)입니다. 예시 2개는 채점하지 않습니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: runSentencesA.slice(1).map((_, i) => "A" + (i + 2)),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runBInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 1,
      labels: runSentencesB.slice(1).map((_, i) => "B" + (i + 2)),
    },
    {
      id: "C",
      title: "Section C",
      instructionKo: runCInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 5,
      exampleCount: 0,
      labels: runSentencesC.map((_, i) => "C" + (i + 1)),
    },
  ],
  items: runItems,
};

// —— jump ——
const jumpAInstr = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
const jumpBInstr = jumpAInstr;
const jumpCInstr = jumpAInstr;

const jumpA = [
  ["I play tennis ( good / well ).", ["good", "well"], 2, { example: true, promptKo: "나는 테니스를 잘 친다." }],
  ["You swim ( fast / fastly ).", ["fast", "fastly"], 1, { promptKo: "너는 빨리 헤엄친다." }],
  ["He plays the violin ( very / verily ) well.", ["very", "verily"], 1, { promptKo: "그는 바이올린을 매우 잘 켠다." }],
  ["The airplane flies ( high / highly ).", ["high", "highly"], 1, { promptKo: "그 비행기는 높이 난다." }],
  ["They speak English ( slow / slowly ).", ["slow", "slowly"], 2, { promptKo: "그들은 영어를 천천히 말한다." }],
  ["My grandma gets up ( late / lately ).", ["late", "lately"], 1, { promptKo: "우리 할머니는 늦게 일어나신다." }],
  ["His sister helps us ( kind / kindly ).", ["kind", "kindly"], 2, { promptKo: "그의 여동생은 우리를 친절하게 돕는다." }],
  ["The baby cries ( loud / loudly ).", ["loud", "loudly"], 2, { promptKo: "그 아기는 큰 소리로 운다." }],
  ["The cook drives a car ( careful / carefully ).", ["careful", "carefully"], 2, { promptKo: "그 요리사는 차를 조심스럽게 운전한다." }],
  ["The men sing ( happy / happily ).", ["happy", "happily"], 2, { promptKo: "그 남자들은 행복하게 노래한다." }],
];

const jumpB = [
  ["I go to school ( at / in ) nine o'clock.", ["at", "in"], 1, { example: true }],
  ["She doesn't work ( on / at ) Monday.", ["on", "at"], 1],
  ["Children's Day is ( in / at ) May.", ["in", "at"], 1],
  ["They have breakfast ( in / at ) six o'clock.", ["in", "at"], 2],
  ["My mom goes to the park ( in / on ) Sunday.", ["in", "on"], 2],
];

const jumpC = [
  ["A cup is ( on / next to ) the book.", ["on", "next to"], 2, { example: true, promptKo: "컵 한 개가 책 옆에 있다." }],
  ["An apple is ( in / on ) the box.", ["in", "on"], 1, { promptKo: "사과 한 개가 상자 안에 있다." }],
  ["The mittens are ( under / behind ) the chair.", ["under", "behind"], 1, { promptKo: "그 벙어리장갑이 의자 아래에 있다." }],
  ["My kitten is ( under / on ) the bike.", ["under", "on"], 2, { promptKo: "내 새끼 고양이가 자전거 위에 있다." }],
  ["Two puppies are ( on / behind ) the tree.", ["on", "behind"], 2, { promptKo: "강아지 두 마리가 나무 뒤에 있다." }],
];

function jumpRows(rows, section, prefix) {
  const instr = section === "A" ? jumpAInstr : section === "B" ? jumpBInstr : jumpCInstr;
  return rows.map((row, i) => {
    const [promptEn, choices, idx, opt] = row;
    return mcItem(`${prefix}${String(i + 1).padStart(2, "0")}`, section, section + (i + 1), promptEn, choices, idx, {
      sectionInstructionKo: instr,
      example: opt?.example,
      promptKo: opt?.promptKo,
    });
  });
}

const jump = {
  practiceId: "r2:u04:jump",
  title: "Grammar Jump",
  subtitle: "부사 · 전치사 고르기 (p. 62–63)",
  pages: "62–63",
  timerMinutes: 20,
  introKo: "Section A 10문항, B 5문항, C 5문항(고르기)입니다. 예시 3개는 채점하지 않습니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpAInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: jumpA.slice(1).map((_, i) => "A" + (i + 2)),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpBInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 4,
      exampleCount: 1,
      labels: jumpB.slice(1).map((_, i) => "B" + (i + 2)),
    },
    {
      id: "C",
      title: "Section C",
      instructionKo: jumpCInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 4,
      exampleCount: 1,
      labels: jumpC.slice(1).map((_, i) => "C" + (i + 2)),
    },
  ],
  items: [...jumpRows(jumpA, "A", "a"), ...jumpRows(jumpB, "B", "b"), ...jumpRows(jumpC, "C", "c")],
};

// —— fly ——
const flyWordBankA = [
  "early",
  "happily",
  "well",
  "carefully",
  "high",
  "fast",
  "very",
  "late",
  "sadly",
  "easily",
];
const flyWordBankB = ["at", "on", "in", "under", "behind", "next to"];

const flyAInstr = "다음 보기에서 알맞은 말을 찾아 빈칸에 쓰세요.";
const flyBInstr = flyAInstr;

const flyA = [
  ["I walk ___", "fast", { example: true, promptKo: "나는 빨리 걷는다." }],
  ["You swim ___", "well", { promptKo: "너는 수영을 잘한다." }],
  ["He works ___ hard", "very", { promptKo: "그는 매우 열심히 일한다." }],
  ["She comes home ___", "late", { promptKo: "그녀는 집에 늦게 온다." }],
  ["We go to bed ___", "early", { promptKo: "우리는 일찍 잔다." }],
  ["They smile ___", "happily", { promptKo: "그들은 행복하게 미소 짓는다." }],
  ["My dad drives ___", "carefully", { promptKo: "우리 아빠는 조심스럽게 운전하신다." }],
  ["The singer sings ___", "sadly", { promptKo: "그 가수는 슬프게 노래를 부른다." }],
  ["The kangaroo jumps ___", "high", { promptKo: "그 캥거루는 높이 점프한다." }],
  ["The girls learn English ___", "easily", { promptKo: "그 여자아이들은 영어를 쉽게 배운다." }],
];

const flyB = [
  ["I get up ___ five o'clock.", "at", { example: true, promptKo: "나는 5시에 일어난다." }],
  ["His birthday is ___ March.", "in", { promptKo: "그의 생일은 3월이다." }],
  ["We have dinner ___ eight o'clock.", "at", { promptKo: "우리는 8시에 저녁 식사를 한다." }],
  ["They go to Daejeon ___ October.", "in", { promptKo: "그들은 10월에 대전에 간다." }],
  ["My friends play soccer ___ Sunday.", "on", { promptKo: "내 친구들은 일요일에 축구를 한다." }],
  ["A camera is ___ the bed.", "under", { promptKo: "사진기 한 대가 침대 밑에 있다." }],
  ["A clock is ___ the wall.", "on", { promptKo: "시계 하나가 벽에 있다." }],
  ["Some oranges are ___ the basket.", "in", { promptKo: "오렌지 몇 개가 바구니 안에 있다." }],
  ["My bike is ___ ___ the bench.", "next|to", { blanks: 2, promptKo: "내 자전거는 벤치 옆에 있다." }],
  ["The taxi is ___ the bus.", "behind", { promptKo: "그 택시는 버스 뒤에 있다." }],
];

const flyItems = [];
flyA.forEach((row, i) => {
  const [promptEn, ans, opt] = row;
  flyItems.push(
    fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", "A" + (i + 1), promptEn, [ans], {
      sectionInstructionKo: flyAInstr,
      example: opt?.example,
      promptKo: opt?.promptKo,
    })
  );
});
flyB.forEach((row, i) => {
  const [promptEn, ans, opt] = row;
  const acc = [ans];
  flyItems.push(
    fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", "B" + (i + 1), promptEn, acc, {
      sectionInstructionKo: flyBInstr,
      blanks: opt?.blanks || (ans.includes("|") ? ans.split("|").length : 1),
      example: opt?.example,
      promptKo: opt?.promptKo,
    })
  );
});

const fly = {
  practiceId: "r2:u04:fly",
  title: "Grammar Fly",
  subtitle: "보기에서 부사 · 전치사 (p. 64–65)",
  pages: "64–65",
  timerMinutes: 15,
  wordBank: [...flyWordBankA, ...flyWordBankB],
  introKo: "Section A 10문항(부사), B 10문항(전치사)입니다. 보기 단어를 사용해 빈칸에 쓰세요. 예시 2개는 채점하지 않습니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: flyA.slice(1).map((_, i) => "A" + (i + 2)),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyBInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: flyB.slice(1).map((_, i) => "B" + (i + 2)),
    },
  ],
  items: flyItems,
};

// —— quiz2 (table blanks, comic skipped) ——
const quiz2Instr = "다음 표의 빈칸에 알맞은 부사를 쓰세요.";
const quiz2Rows = [
  ["loud → ___", "loudly", "형용사 loud"],
  ["quick → ___", "quickly", "형용사 quick"],
  ["careful → ___", "carefully", "형용사 careful"],
  ["happy → ___", "happily", "형용사 happy"],
  ["fast → ___", "fast", "형용사 fast"],
  ["hard → ___", "hard", "형용사 hard"],
  ["good → ___", "well", "형용사 good"],
];

const quiz2 = {
  practiceId: "r2:u04:quiz2",
  title: "QUIZ 2 — 부사 표",
  subtitle: "p. 66",
  pages: "66",
  timerMinutes: 12,
  introKo: "7문항. 표의 빈칸에 알맞은 부사를 쓰세요. (만화는 학습용이며 채점하지 않습니다.)",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 7,
      exampleCount: 0,
      labels: ["1", "2", "3", "4", "5", "6", "7"],
    },
  ],
  items: quiz2Rows.map((row, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row[0], [row[1]], {
      sectionInstructionKo: quiz2Instr,
      promptKo: row[2],
    })
  ),
};

// —— quiz4 ——
const quiz4Instr = "다음 표의 빈칸에 알맞은 전치사를 쓰세요.";
const quiz4Rows = [
  ["특정한 시각 앞에 → ___", "at"],
  ["월, 연도 앞에 → ___", "in"],
  ["~ 안에 → ___", "in"],
  ["~ 위에 → ___", "on"],
  ["~ 아래에 → ___", "under"],
  ["~ 뒤에 → ___", "behind"],
  ["~ 옆에 → ___", "next to"],
];

const quiz4 = {
  practiceId: "r2:u04:quiz4",
  title: "QUIZ 4 — 전치사 표",
  subtitle: "p. 67",
  pages: "67",
  timerMinutes: 12,
  introKo: "7문항. 표의 빈칸에 알맞은 전치사를 쓰세요. (만화는 학습용이며 채점하지 않습니다.)",
  sections: [
    {
      id: "A",
      title: "QUIZ 4",
      instructionKo: quiz4Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 7,
      exampleCount: 0,
      labels: ["1", "2", "3", "4", "5", "6", "7"],
    },
  ],
  items: quiz4Rows.map((row, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row[0], [row[1]], {
      sectionInstructionKo: quiz4Instr,
    })
  ),
};

write("walk.json", walk);
write("run.json", run);
write("jump.json", jump);
write("fly.json", fly);
write("quiz2.json", quiz2);
write("quiz4.json", quiz4);

console.log("done");
