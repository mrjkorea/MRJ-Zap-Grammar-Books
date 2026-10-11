/* Generate RedZap 2 Unit 03 (형용사) practice JSON — pages 44–53 (PDF 45–54). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit03");

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", fp);
}

function mcItem(base, label, promptEn, choices, acceptIdx, extra = {}) {
  return {
    ...base,
    label,
    type: "mc",
    promptEn,
    choices,
    accept: [String(acceptIdx)],
    ...extra,
  };
}

function fillItem(base, label, promptEn, accept, extra = {}) {
  return {
    ...base,
    label,
    type: "fill",
    promptEn,
    blanks: extra.blanks || 1,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

function matchItem(base, label, pairs, promptKo) {
  return {
    ...base,
    label,
    type: "match",
    pairs,
    accept: pairs.map((p) => `${p.left}|${p.right}`),
    promptKo,
  };
}

// —— Walk ——
const walkSecA = {
  id: "A",
  title: "Section A",
  instructionKo:
    "다음 형용사의 뜻을 생각하며 단어를 따라 써 보세요. 영어 형용사와 우리말 뜻을 짝지어 연결하세요.",
  answerMode: "match",
  answerModeTag: "Match · 짝 맞추기",
  itemCount: 2,
  exampleCount: 0,
  labels: ["A1", "A2"],
};

const walkSecB = {
  id: "B",
  title: "Section B",
  instructionKo:
    "다음 문장의 뜻을 생각하며 형용사를 따라 써 보세요. 문장 뜻(우리말)과 알맞은 영어 형용사를 짝지어 연결하세요.",
  answerMode: "match",
  answerModeTag: "Match · 짝 맞추기",
  itemCount: 2,
  exampleCount: 0,
  labels: ["B1", "B2"],
};

const walkA1Pairs = [
  { left: "big", right: "큰" },
  { left: "small", right: "작은" },
  { left: "fast", right: "빠른" },
  { left: "slow", right: "느린" },
  { left: "black", right: "검은, 검은색의" },
  { left: "white", right: "흰, 흰색의" },
  { left: "cool", right: "시원한" },
];
const walkA2Pairs = [
  { left: "warm", right: "따뜻한" },
  { left: "happy", right: "행복한" },
  { left: "sad", right: "슬픈" },
];

const walkB1Pairs = [
  { left: "긴 연필을 가지고 있다.", right: "long" },
  { left: "빨간 크레용을 가지고 있다.", right: "red" },
  { left: "그녀는 낡은 자전거를 좋아한다.", right: "old" },
  { left: "그는 새 자전거를 좋아한다.", right: "new" },
  { left: "우리 엄마는 키가 크다.", right: "tall" },
  { left: "우리 아빠는 키가 작다.", right: "short" },
  { left: "비가 많이 온다.", right: "rainy" },
];
const walkB2Pairs = [
  { left: "바람이 많이 분다.", right: "windy" },
  { left: "네 고양이는 뚱뚱하다.", right: "fat" },
  { left: "네 고양이는 못생겼다.", right: "ugly" },
];

const walkBaseA = {
  section: "A",
  sectionTitle: "Section A",
  sectionInstructionKo: walkSecA.instructionKo,
  answerMode: "match",
  answerModeTag: "Match · 짝 맞추기",
};
const walkBaseB = {
  section: "B",
  sectionTitle: "Section B",
  sectionInstructionKo: walkSecB.instructionKo,
  answerMode: "match",
  answerModeTag: "Match · 짝 맞추기",
};

write("walk.json", {
  practiceId: "r2:u03:walk",
  title: "Grammar Walk",
  subtitle: "형용사 따라쓰기 (p. 44–45)",
  pages: "44–45",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(형용사·뜻 짝 맞추기), Section B 2문항(문장·형용사 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
  sections: [walkSecA, walkSecB],
  items: [
    { id: "a01", ...matchItem(walkBaseA, "A1", walkA1Pairs, "형용사 A–G") },
    { id: "a02", ...matchItem(walkBaseA, "A2", walkA2Pairs, "형용사 H–J") },
    { id: "b01", ...matchItem(walkBaseB, "B1", walkB1Pairs, "문장 1–7") },
    { id: "b02", ...matchItem(walkBaseB, "B2", walkB2Pairs, "문장 8–10") },
  ],
});

// —— Run ——
const runSecA = {
  id: "A",
  title: "Section A",
  instructionKo: "다음 그림에 알맞은 형용사에 동그라미 하세요.",
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
  itemCount: 10,
  exampleCount: 0,
  labels: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
};
const runSecB = {
  id: "B",
  title: "Section B",
  instructionKo: "다음 문장에서 형용사를 찾아 동그라미 하세요.",
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
  itemCount: 9,
  exampleCount: 1,
  labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
};

const runAData = [
  ["long", "short"],
  ["fast", "slow"],
  ["new", "old"],
  ["white", "blue"],
  ["cute", "ugly"],
  ["big", "small"],
  ["yellow", "red"],
  ["happy", "sad"],
  ["cold", "hot"],
  ["snowy", "windy"],
];
const runAAnswers = [1, 1, 2, 2, 1, 2, 2, 1, 2, 1];

/** Run B: MC choices = every word in the sentence, in sentence order (p. 47). */
function runBCircle(sentence, adjective) {
  const words = sentence.replace(/\.\s*$/, "").split(/\s+/);
  const idx = words.indexOf(adjective);
  if (idx < 0) throw new Error(`runB: ${adjective} not in ${sentence}`);
  return { en: sentence, choices: words, ans: idx + 1 };
}

const runBGraded = [
  runBCircle("I like the old tree.", "old"),
  runBCircle("They love their cute puppy.", "cute"),
  runBCircle("They love their small puppy.", "small"),
  runBCircle("His computer is new.", "new"),
  runBCircle("His computer is big.", "big"),
  runBCircle("It is snowy.", "snowy"),
  runBCircle("It is cool.", "cool"),
  runBCircle("I want the yellow shirt.", "yellow"),
  runBCircle("I want the green pants.", "green"),
];
const runBExample = runBCircle("I like the tall tree.", "tall");

const runBaseA = {
  section: "A",
  sectionTitle: "Section A",
  sectionInstructionKo: runSecA.instructionKo,
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
};
const runBaseB = {
  section: "B",
  sectionTitle: "Section B",
  sectionInstructionKo: runSecB.instructionKo,
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
};

const runItems = [];
runAData.forEach((ch, i) => {
  const n = i + 1;
  runItems.push({
    id: `a${String(n).padStart(2, "0")}`,
    ...mcItem(runBaseA, `A${n}`, `그림 ${n}`, ch, runAAnswers[i], {
      image: `assets/img/red2/unit03/run-a${String(n).padStart(2, "0")}.png`,
    }),
  });
});

runItems.push({
  id: "b01",
  ...mcItem(runBaseB, "B1", runBExample.en, runBExample.choices, runBExample.ans, {
    example: true,
    displayOnly: true,
    exampleAnswer: "tall",
  }),
});
runBGraded.forEach((row, i) => {
  const n = i + 2;
  runItems.push({
    id: `b${String(n).padStart(2, "0")}`,
    ...mcItem(runBaseB, `B${n}`, row.en, row.choices, row.ans),
  });
});

write("run.json", {
  practiceId: "r2:u03:run",
  title: "Grammar Run",
  subtitle: "그림·문장 형용사 (p. 46–47)",
  pages: "46–47",
  timerMinutes: 20,
  introKo: "Section A 10문항(그림 고르기), Section B 9문항(문장에서 형용사 고르기, 예시 1개)입니다.",
  sections: [runSecA, runSecB],
  items: runItems,
});

// —— Jump ——
const jumpSecA = {
  id: "A",
  title: "Section A",
  instructionKo: "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.",
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
  itemCount: 9,
  exampleCount: 1,
  labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
};
const jumpSecB = {
  id: "B",
  title: "Section B",
  instructionKo: "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.",
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
  itemCount: 9,
  exampleCount: 1,
  labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
};

const jumpA = [
  ["It is ( hot / cold ).", ["hot", "cold"], 2],
  ["The rope is ( long / short ).", ["long", "short"], 2],
  ["The ship is ( big / small ).", ["big", "small"], 1],
  ["Jack is ( weak / strong ).", ["weak", "strong"], 1],
  ["Turtles are ( fast / slow ).", ["fast", "slow"], 2],
  ["My socks are ( blue / yellow ).", ["blue", "yellow"], 1],
  ["His parents are ( tall / short ).", ["tall", "short"], 1],
  ["I have a ( white / black ) cat.", ["white", "black"], 1],
  ["Tiffany loves her ( old / new ) jeans.", ["old", "new"], 1],
  ["The doctor likes ( hot / windy ) weather.", ["hot", "windy"], 2],
];

const jumpB = [
  ["She is ( a happy girl / happy a girl ).", ["a happy girl", "happy a girl"], 1],
  ["It has ( a long neck / long a neck ).", ["a long neck", "long a neck"], 1],
  ["Look at ( old the house / the old house ).", ["old the house", "the old house"], 2],
  ["We want ( that blue ball / blue that ball ).", ["that blue ball", "blue that ball"], 1],
  ["I like ( handsome your brother / your handsome brother ).", ["handsome your brother", "your handsome brother"], 2],
  ["She loves ( her pretty sister / pretty her sister ).", ["her pretty sister", "pretty her sister"], 1],
  ["It ( is cold / cold is ).", ["is cold", "cold is"], 1],
  ["My bag ( is black / black is ).", ["is black", "black is"], 1],
  ["His bed ( new is / is new ).", ["new is", "is new"], 2],
  ["My brother ( is strong / strong is ).", ["is strong", "strong is"], 1],
];

const jumpBaseA = {
  section: "A",
  sectionTitle: "Section A",
  sectionInstructionKo: jumpSecA.instructionKo,
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
};
const jumpBaseB = {
  section: "B",
  sectionTitle: "Section B",
  sectionInstructionKo: jumpSecB.instructionKo,
  answerMode: "choice",
  answerModeTag: "Choose · 고르기",
};

const jumpItems = [
  {
    id: "a01",
    ...mcItem(jumpBaseA, "A1", "It is ( hot / cold ).", ["hot", "cold"], 2, {
      example: true,
      displayOnly: true,
      exampleAnswer: "cold",
      promptKo: "날씨가 춥다.",
    }),
  },
];
jumpA.slice(1).forEach((row, i) => {
  jumpItems.push({
    id: `a${String(i + 2).padStart(2, "0")}`,
    ...mcItem(jumpBaseA, `A${i + 2}`, row[0], row[1], row[2]),
  });
});
jumpItems.push({
  id: "b01",
  ...mcItem(jumpBaseB, "B1", "She is ( a happy girl / happy a girl ).", ["a happy girl", "happy a girl"], 1, {
    example: true,
    displayOnly: true,
    exampleAnswer: "a happy girl",
  }),
});
jumpB.slice(1).forEach((row, i) => {
  jumpItems.push({
    id: `b${String(i + 2).padStart(2, "0")}`,
    ...mcItem(jumpBaseB, `B${i + 2}`, row[0], row[1], row[2]),
  });
});

write("jump.json", {
  practiceId: "r2:u03:jump",
  title: "Grammar Jump",
  subtitle: "형용사 고르기 · 순서 (p. 48–49)",
  pages: "48–49",
  timerMinutes: 15,
  introKo: "Section A·B 각 9문항(고르기, 예시 1개)입니다.",
  sections: [jumpSecA, jumpSecB],
  items: jumpItems,
});

// —— Fly ——
const flySecA = {
  id: "A",
  title: "Section A",
  instructionKo: "다음 보기에서 알맞은 말을 찾아 빈칸에 쓰세요.",
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
  itemCount: 9,
  exampleCount: 1,
  labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
};
const flySecB = {
  id: "B",
  title: "Section B",
  instructionKo:
    "주어진 단어들을 순서대로 바르게 배열하여 문장을 완성하세요. 빈칸마다 한 단어씩 쓰세요.",
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
  itemCount: 9,
  exampleCount: 1,
  labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
};

const flyA = [
  ["Look at the ___ balloon.", "big", "그 큰 풍선을 봐."],
  ["It is ___.", "windy", "바람이 많이 분다."],
  ["Yuna is ___.", "beautiful", "유나는 아름답다."],
  ["He has ___ pigs.", "three", "그는 돼지 세 마리를 가지고 있다."],
  ["Giraffes are ___.", "tall", "기린은 키가 크다."],
  ["The train is ___.", "slow", "그 기차는 느리다."],
  ["These bags are ___.", "new", "이 가방들은 새것이다."],
  ["Jaeseok likes ___ roses.", "red", "재석이는 빨간 장미를 좋아한다."],
  ["It is ___.", "warm", "날씨가 따뜻하다."],
];

const flyB = [
  ["This is ___ ___ hat. ( new, my )", ["my", "new"]],
  ["He wants ___ ___ pencils. ( blue, your )", ["your", "blue"]],
  ["You have ___ ___ ruler. ( a, short )", ["a", "short"]],
  ["She likes ___ ___ teacher. ( tall, her )", ["her", "tall"]],
  ["He ___ ___. ( weak, is )", ["is", "weak"]],
  ["My pet ___ ___. ( cute, is )", ["is", "cute"]],
  ["His nose ___ ___. ( is, long )", ["is", "long"]],
  ["The man ___ ___. ( is, sad )", ["is", "sad"]],
  ["The dogs ___ ___. ( ugly, are )", ["are", "ugly"]],
];

const flyBaseA = {
  section: "A",
  sectionTitle: "Section A",
  sectionInstructionKo: flySecA.instructionKo,
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
};
const flyBaseB = {
  section: "B",
  sectionTitle: "Section B",
  sectionInstructionKo: flySecB.instructionKo,
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
};

const flyItems = [
  {
    id: "a01",
    ...fillItem(flyBaseA, "A1", "I have a yellow scarf.", ["yellow"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "yellow",
      promptKo: "나는 노란 스카프를 한 개 가지고 있다.",
    }),
  },
];
flyA.forEach((row, i) => {
  flyItems.push({
    id: `a${String(i + 2).padStart(2, "0")}`,
    ...fillItem(flyBaseA, `A${i + 2}`, row[0], [row[1]], { promptKo: row[2] }),
  });
});
flyItems.push({
  id: "b01",
  section: "B",
  sectionTitle: "Section B",
  sectionInstructionKo: flySecB.instructionKo,
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
  label: "B1",
  type: "fill",
  promptEn: "It is ___ ___ pear. ( big, a )",
  blanks: 2,
  accept: ["a|big"],
  example: true,
  displayOnly: true,
  exampleAnswer: "a / big",
});
flyB.forEach((row, i) => {
  flyItems.push({
    id: `b${String(i + 2).padStart(2, "0")}`,
    ...fillItem(flyBaseB, `B${i + 2}`, row[0], [row[1].join("|")], { blanks: 2 }),
  });
});

write("fly.json", {
  practiceId: "r2:u03:fly",
  title: "Grammar Fly",
  subtitle: "보기·배열 (p. 50–51)",
  pages: "50–51",
  timerMinutes: 15,
  introKo: "Section A 9문항(단어 쓰기), Section B 9문항(두 칸 배열, 예시 각 1개)입니다.",
  sections: [flySecA, flySecB],
  items: flyItems,
});

// —— Quiz 2 ——
const quiz2Sec = {
  id: "A",
  title: "QUIZ 2",
  instructionKo: "다음 표의 빈칸에 알맞은 말을 쓰세요.",
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
  itemCount: 11,
  exampleCount: 0,
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
};

const quiz2Rows = [
  ["1", "크기/길이 — 작은", "small"],
  ["2", "크기/길이 — 키가 큰", "tall"],
  ["3", "크기/길이 — 짧은, 키가 작은", "short"],
  ["4", "성질/상태 — fast 뜻", "빠른"],
  ["5", "성질/상태 — slow 뜻", "느린"],
  ["6", "성질/상태 — 오래된", "old"],
  ["7", "색깔 — 검은", "black"],
  ["8", "색깔 — 노란", "yellow"],
  ["9", "날씨 — rainy 뜻", "비가 오는", "비가 많이 오는"],
  ["10", "날씨 — 눈이 많이 내리는", "snowy"],
  ["11", "수 — 세 개의", "three"],
];

const quiz2Base = {
  section: "A",
  sectionTitle: "QUIZ 2",
  sectionInstructionKo: quiz2Sec.instructionKo,
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
};

write("quiz2.json", {
  practiceId: "r2:u03:quiz2",
  title: "QUIZ 2 — 형용사 표",
  subtitle: "의미와 종류 (p. 52)",
  pages: "52",
  timerMinutes: 15,
  introKo: "만화는 채점하지 않습니다. 표 빈칸 11문항입니다.",
  sections: [quiz2Sec],
  items: quiz2Rows.map((row, i) => ({
    id: `q${String(i + 1).padStart(2, "0")}`,
    ...fillItem(quiz2Base, row[0], row[1], row.slice(2)),
  })),
});

// —— Quiz 4 ——
const quiz4Sec = {
  id: "A",
  title: "QUIZ 4",
  instructionKo: "다음 표의 빈칸에 알맞은 말을 쓰세요.",
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
  itemCount: 3,
  exampleCount: 0,
  labels: ["1", "2", "3"],
};

const quiz4Rows = [
  ["1", "a/an/the + ___ + 명사 (무엇이 들어가나요?)", ["형용사", "adjective"]],
  ["2", "소유격/지시형용사 + 형용사 + ___", ["명사", "noun"]],
  ["3", "주어 + be동사 + ___", ["형용사", "adjective"]],
];

const quiz4Base = {
  section: "A",
  sectionTitle: "QUIZ 4",
  sectionInstructionKo: quiz4Sec.instructionKo,
  answerMode: "words",
  answerModeTag: "Words · 빈칸 말만",
};

write("quiz4.json", {
  practiceId: "r2:u03:quiz4",
  title: "QUIZ 4 — 형용사 위치",
  subtitle: "문장 안 위치 (p. 53)",
  pages: "53",
  timerMinutes: 10,
  introKo: "만화는 채점하지 않습니다. 표 빈칸 3문항입니다.",
  sections: [quiz4Sec],
  items: quiz4Rows.map((row, i) => ({
    id: `q${String(i + 1).padStart(2, "0")}`,
    ...fillItem(quiz4Base, row[0], row[1], row[2]),
  })),
});

console.log("RedZap 2 Unit 03 generated.");
