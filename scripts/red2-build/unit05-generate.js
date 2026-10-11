/* Generate RedZap 2 Unit 05 practice JSON (의문사 1). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit05");

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", fp);
}

const bookMeta = {
  bookId: "zap-red-2",
  bookTitle: "ZAP Red 2",
  appName: "RedZap 2",
  unitId: "unit-05",
  unitTitle: "Unit 05 — 의문사 (1)",
};

function base(practiceId, title, subtitle, pages, introKo, sections) {
  return {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes: 15,
    ...bookMeta,
    introKo,
    sections,
    items: [],
  };
}

function sec(id, title, instructionKo, answerMode, tag, itemCount, exampleCount, labels) {
  return {
    id,
    title,
    instructionKo,
    answerMode,
    answerModeTag: tag,
    itemCount,
    exampleCount,
    labels,
  };
}

// —— walk ——
const walk = base(
  "r2:u05:walk",
  "Grammar Walk",
  "의문사 · 의문문 따라쓰기 (p. 76–77)",
  "76–77",
  "Section A 10문항(의문사 한 단어), Section B 10문항(문장 전체)입니다.",
  [
    sec(
      "A",
      "Section A",
      "다음 문장의 뜻을 생각하며 의문사를 따라 써 보세요. 빈칸에 들어갈 의문사 한 단어만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      10,
      0,
      ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]
    ),
    sec(
      "B",
      "Section B",
      "다음 문장의 뜻을 생각하며 따라 써 보세요. 문장 전체를 쓰세요.",
      "sentence",
      "Full sentence · 문장 전체",
      10,
      0,
      ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]
    ),
  ]
);

const walkA = [
  ["Who is the boy?", "who"],
  ["Why is Sam so sad?", "why"],
  ["When is your birthday?", "when"],
  ["Where is your house?", "where"],
  ["How are your grandparents?", "how"],
  ["Where does she live?", "where"],
  ["What do you have?", "what"],
  ["When do they get up?", "when"],
  ["How does Alice go to school?", "how"],
  ["Why does Sandara call him?", "why"],
];

walkA.forEach(([sent, ans], i) => {
  walk.items.push({
    id: `a${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "Section A",
    sectionInstructionKo: walk.sections[0].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: `A${i + 1}`,
    type: "fill",
    promptEn: sent.replace(/^\w+/, "______"),
    blanks: 1,
    accept: [ans],
  });
});

const walkB = [
  "Who is she?",
  "What is that?",
  "When is the test?",
  "How are you?",
  "Why are they angry?",
  "Where are their crayons?",
  "Where do pandas live?",
  "What does the monkey eat?",
  "Who does she like?",
  "When does the concert begin?",
];

walkB.forEach((sent, i) => {
  const lower = sent.charAt(0).toLowerCase() + sent.slice(1);
  walk.items.push({
    id: `b${String(i + 1).padStart(2, "0")}`,
    section: "B",
    sectionTitle: "Section B",
    sectionInstructionKo: walk.sections[1].instructionKo,
    answerMode: "sentence",
    answerModeTag: "Full sentence · 문장 전체",
    label: `B${i + 1}`,
    type: "sentence",
    promptEn: sent.replace(/^\w+/, "______"),
    accept: [sent, lower],
  });
});

write("walk.json", walk);

// —— run ——
const run = base(
  "r2:u05:run",
  "Grammar Run",
  "의문사 찾기 · 우리말 뜻 (p. 78–79)",
  "78–79",
  "Section A 9문항(예시 1개), Section B 10문항(우리말 뜻)입니다.",
  [
    sec(
      "A",
      "Section A",
      "다음 문장에서 의문사를 찾아 동그라미 하세요. 문장 맨 앞 의문사 한 단어만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      9,
      1,
      ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]
    ),
    sec(
      "B",
      "Section B",
      "다음 문장에서 밑줄 친 의문사의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      10,
      0,
      ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]
    ),
  ]
);

const runA = [
  ["Who is that woman?", "who"],
  ["Where is his car?", "where"],
  ["How is your mother?", "how"],
  ["Why are you so tired?", "why"],
  ["How do you go to school?", "how"],
  ["When do you go to bed?", "when"],
  ["What do you do after school?", "what"],
  ["Where does your puppy sleep?", "where"],
  ["What does Yumi do on Sunday?", "what"],
  ["Why do you like Park Jisung?", "why"],
];

runA.forEach(([sent, ans], i) => {
  const item = {
    id: `a${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "Section A",
    sectionInstructionKo: run.sections[0].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: `A${i + 1}`,
    type: "fill",
    promptEn: sent,
    blanks: 1,
    accept: [ans],
  };
  if (i === 0) {
    item.example = true;
    item.displayOnly = true;
    item.exampleAnswer = "Who";
  }
  run.items.push(item);
});

const runBKo = [
  ["Who is Sam?", "누구"],
  ["When is the picnic?", "언제"],
  ["Where are my pants?", "어디"],
  ["How are your parents?", "어떻게"],
  ["What are these?", "무엇"],
  ["Why are you late?", "왜"],
  ["When do you go to the pool?", "언제"],
  ["Why do you like me?", "왜"],
  ["What does she eat for lunch?", "무엇"],
  ["Where does Judy play tennis?", "어디"],
];

runBKo.forEach(([sent, ko], i) => {
  run.items.push({
    id: `b${String(i + 1).padStart(2, "0")}`,
    section: "B",
    sectionTitle: "Section B",
    sectionInstructionKo: run.sections[1].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: `B${i + 1}`,
    type: "fill",
    promptEn: sent,
    blanks: 1,
    accept: [ko],
  });
});

write("run.json", run);

// —— jump ——
const jump = base(
  "r2:u05:jump",
  "Grammar Jump",
  "are/is · do/does · who/what (p. 80–81)",
  "80–81",
  "Section A 9문항(예시 1개), Section B 9문항(예시 1개)입니다.",
  [
    sec(
      "A",
      "Section A",
      "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.",
      "choice",
      "Choose · 고르기",
      9,
      1,
      ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]
    ),
    sec(
      "B",
      "Section B",
      "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.",
      "choice",
      "Choose · 고르기",
      9,
      1,
      ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]
    ),
  ]
);

const jumpA = [
  ["Who ( are / is ) you?", ["are", "is"], "are"],
  ["What ( are / is ) it?", ["are", "is"], "is"],
  ["Who ( are / is ) the women?", ["are", "is"], "are"],
  ["What ( are / is ) those boxes?", ["are", "is"], "are"],
  ["Who ( are / is ) your brother?", ["are", "is"], "is"],
  ["What ( do / does ) he do after school?", ["do", "does"], "does"],
  ["Who ( do / does ) they like?", ["do", "does"], "do"],
  ["What ( do / does ) the girl have?", ["do", "does"], "does"],
  ["Who ( do / does ) he hate?", ["do", "does"], "does"],
  ["What ( do / does ) your friends want?", ["do", "does"], "do"],
];

jumpA.forEach(([prompt, choices, ans], i) => {
  const item = {
    id: `a${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "Section A",
    sectionInstructionKo: jump.sections[0].instructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label: `A${i + 1}`,
    type: "mc",
    promptEn: prompt,
    choices,
    accept: [ans],
  };
  if (i === 0) {
    item.example = true;
    item.displayOnly = true;
    item.exampleAnswer = "are";
  }
  jump.items.push(item);
});

const jumpB = [
  ["( Who / What ) is she?", "Who"],
  ["( Who / What ) is this?", "What"],
  ["( Who / What ) are those?", "What"],
  ["( Who / What ) is that man?", "Who"],
  ["( Who / What ) is he?", "Who"],
  ["( Who / What ) do you like?", "Who"],
  ["( Who / What ) do they do after school?", "What"],
  ["( Who / What ) do spiders eat?", "What"],
  ["( Who / What ) does she have?", "What"],
  ["( Who / What ) does your brother love?", "Who"],
];

jumpB.forEach(([prompt, ans], i) => {
  const item = {
    id: `b${String(i + 1).padStart(2, "0")}`,
    section: "B",
    sectionTitle: "Section B",
    sectionInstructionKo: jump.sections[1].instructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label: `B${i + 1}`,
    type: "mc",
    promptEn: `A: ${prompt}`,
    choices: ["Who", "What"],
    accept: [ans],
  };
  if (i === 0) {
    item.example = true;
    item.displayOnly = true;
    item.exampleAnswer = "Who";
  }
  jump.items.push(item);
});

write("jump.json", jump);

// —— fly ——
const fly = base(
  "r2:u05:fly",
  "Grammar Fly",
  "be/do/does · who/what (p. 82–83)",
  "82–83",
  "Section A 9문항(예시 1개), Section B 9문항(예시 1개)입니다.",
  [
    sec(
      "A",
      "Section A",
      "다음 문장의 빈칸에 알맞은 be동사나 do 또는 does를 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      9,
      1,
      ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]
    ),
    sec(
      "B",
      "Section B",
      "다음 대화의 빈칸에 who나 what을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      9,
      1,
      ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]
    ),
  ]
);

const flyA = [
  ["What ______ they?", "are"],
  ["Who ______ the tall man?", "is"],
  ["What ______ her name?", "is"],
  ["Who ______ this old lady?", "is"],
  ["What ______ their phone numbers?", "are"],
  ["Who ______ he like?", "does"],
  ["What ______ you do on Saturday?", "do"],
  ["What ______ they cook for dinner?", "do"],
  ["Who ______ he visit every week?", "does"],
  ["What ______ she sell?", "does"],
];

flyA.forEach(([prompt, ans], i) => {
  const item = {
    id: `a${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "Section A",
    sectionInstructionKo: fly.sections[0].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: `A${i + 1}`,
    type: "fill",
    promptEn: prompt,
    blanks: 1,
    accept: [ans],
  };
  if (i === 0) {
    item.example = true;
    item.displayOnly = true;
    item.exampleAnswer = "are";
  }
  fly.items.push(item);
});

const flyB = [
  ["What ______ they?", "What"],
  ["______ is he?", "Who"],
  ["______ are those?", "What"],
  ["______ is it?", "What"],
  ["______ does May know?", "Who"],
  ["______ do the cooks need?", "What"],
  ["______ does Jane like?", "Who"],
  ["______ do you do on Tuesday?", "What"],
  ["______ does she want?", "What"],
  ["______ is your favorite singer?", "Who"],
];

flyB.forEach(([prompt, ans], i) => {
  const item = {
    id: `b${String(i + 1).padStart(2, "0")}`,
    section: "B",
    sectionTitle: "Section B",
    sectionInstructionKo: fly.sections[1].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: `B${i + 1}`,
    type: "fill",
    promptEn: `A: ${prompt}`,
    blanks: 1,
    accept: [ans.toLowerCase(), ans],
  };
  if (i === 0) {
    item.example = true;
    item.displayOnly = true;
    item.exampleAnswer = "What";
    item.accept = ["what", "What"];
  }
  fly.items.push(item);
});

write("fly.json", fly);

// —— quiz2 (p.84 §2) ——
const quiz2 = base(
  "r2:u05:quiz2",
  "QUIZ 2 — 의문사 종류",
  "p. 84",
  "84",
  "6문항. 표의 빈칸에 알맞은 의문사를 쓰세요.",
  [
    sec(
      "A",
      "QUIZ 2",
      "다음 표의 빈칸에 알맞은 의문사를 쓰세요. 빈칸에 들어갈 의문사 한 단어만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      6,
      0,
      ["1", "2", "3", "4", "5", "6"]
    ),
  ]
);

const quiz2Rows = [
  ["표 1번 — '누구'인지 물어볼 때", "who"],
  ["표 2번 — '무엇'인지 물어볼 때", "what"],
  ["표 3번 — '언제'인지 물어볼 때", "when"],
  ["표 4번 — '어디'인지 물어볼 때", "where"],
  ["표 5번 — '어떻게'인지 물어볼 때", "how"],
  ["표 6번 — '왜'인지 물어볼 때", "why"],
];

quiz2Rows.forEach(([promptKo, ans], i) => {
  quiz2.items.push({
    id: `q${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "QUIZ 2",
    sectionInstructionKo: quiz2.sections[0].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: String(i + 1),
    type: "fill",
    promptKo,
    blanks: 1,
    accept: [ans],
  });
});

write("quiz2.json", quiz2);

// —— quiz4 (p.85 §4) ——
const quiz4 = base(
  "r2:u05:quiz4",
  "QUIZ 4 — 의문문 형식",
  "p. 85",
  "85",
  "6문항. 표의 빈칸에 알맞은 말을 쓰세요.",
  [
    sec(
      "A",
      "QUIZ 4",
      "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      6,
      0,
      ["1", "2", "3", "4", "5", "6"]
    ),
  ]
);

const quiz4Items = [
  {
    promptKo: "의문사와 be동사가 있는 의문문 형식: 의문사 + [1] + [2] ?",
    blanks: 1,
    accept: ["be동사"],
    label: "1",
  },
  {
    promptKo: "의문사와 be동사가 있는 의문문 형식: 의문사 + [1] + [2] ? (두 번째 칸)",
    blanks: 1,
    accept: ["주어"],
    label: "2",
  },
  {
    promptKo: "의문사와 일반동사가 있는 의문문: 의문사 + do/does + [3] + [4] ? (세 번째 칸)",
    blanks: 1,
    accept: ["주어"],
    label: "3",
  },
  {
    promptKo: "의문사와 일반동사가 있는 의문문: 의문사 + do/does + [3] + [4] ? (네 번째 칸)",
    blanks: 1,
    accept: ["동사원형"],
    label: "4",
  },
  {
    promptKo: "사람의 이름이나 신분을 물어볼 때 — 의문문: [5] is she?",
    blanks: 1,
    accept: ["who"],
    label: "5",
  },
  {
    promptKo: "사물의 이름, 종류를 물어볼 때 — 의문문: [6] is this?",
    blanks: 1,
    accept: ["what"],
    label: "6",
  },
];

quiz4Items.forEach((row, i) => {
  quiz4.items.push({
    id: `q${String(i + 1).padStart(2, "0")}`,
    section: "A",
    sectionTitle: "QUIZ 4",
    sectionInstructionKo: quiz4.sections[0].instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: row.label,
    type: "fill",
    promptKo: row.promptKo,
    blanks: row.blanks,
    accept: row.accept,
  });
});

write("quiz4.json", quiz4);

console.log("Red 2 Unit 05 generate done.");
