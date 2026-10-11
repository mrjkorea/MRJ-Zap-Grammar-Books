#!/usr/bin/env node
/* Generate RedZap 2 Unit 08 practice JSON (pages 118–131 / PDF 119–132). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit08");

const META = {
  bookId: "zap-red-2",
  bookTitle: "ZAP Red 2",
  appName: "RedZap 2",
  unitId: "unit-08",
  unitTitle: "Unit 08 — 현재 진행형의 부정문과 의문문",
  sectionsVersion: 2,
};

function write(name, doc) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify({ ...doc, ...META }, null, 2) + "\n");
}

function mcItem(base, label, promptEn, choices, acceptIdx, extra = {}) {
  return {
    id: base.id,
    section: base.section,
    sectionTitle: base.sectionTitle,
    sectionInstructionKo: base.sectionInstructionKo,
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

function wordsItem(base, label, promptEn, blanks, acceptList, extra = {}) {
  return {
    id: base.id,
    section: base.section,
    sectionTitle: base.sectionTitle,
    sectionInstructionKo: base.sectionInstructionKo,
    answerMode: "words",
    answerModeTag: blanks > 1 ? "Words · 빈칸마다" : "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept: acceptList,
    ...extra,
  };
}

function matchItem(base, label, pairs, promptKo) {
  const accept = pairs.map((p) => `${p.left}|${p.right}`);
  return {
    id: base.id,
    section: base.section,
    sectionTitle: base.sectionTitle,
    sectionInstructionKo: base.sectionInstructionKo,
    answerMode: "match",
    answerModeTag: "Match · 짝 맞추기",
    label,
    type: "match",
    pairs,
    accept,
    promptKo,
  };
}

// —— Walk ——
const walkAInst =
  "다음 문장의 뜻을 생각하며 따라 써 보세요. 검은 글씨 문장과 회색으로 따라 쓰는 부정 현재진행 부분을 짝지어 연결하세요.";
const walkBInst =
  "다음 대화의 뜻을 생각하며 따라 써 보세요. A의 질문과 B의 대답을 짝지어 연결하세요.";

const walkAPairs = [
  { left: "I … swimming.", right: "am not" },
  { left: "You … rope.", right: "are not jumping" },
  { left: "You … hard.", right: "are not studying" },
  { left: "We … to music.", right: "are not listening" },
  { left: "They … the piano.", right: "are not playing" },
  { left: "She … a book.", right: "isn't reading" },
  { left: "He …", right: "isn't dancing" },
  { left: "It …", right: "isn't sleeping" },
  { left: "Dad … the box.", right: "isn't opening" },
  { left: "Lucy and Paul … a cake.", right: "aren't baking" },
];

const walkBPairs = [
  { left: "Are you sleeping?", right: "No, I'm not." },
  { left: "Is she jumping?", right: "Yes, she is." },
  { left: "Is he going?", right: "No, he isn't." },
  { left: "Are you eating?", right: "No, we aren't." },
  { left: "Are they flying?", right: "Yes, they are." },
  { left: "Are you coming?", right: "Yes, I am." },
  { left: "Is she lying?", right: "No, she isn't." },
  { left: "Are you crying?", right: "Yes, we are." },
  { left: "Are the boys reading?", right: "No, they aren't." },
  { left: "Is Tim smiling?", right: "Yes, he is." },
];

const walkBaseA = { section: "A", sectionTitle: "Section A", sectionInstructionKo: walkAInst };
const walkBaseB = { section: "B", sectionTitle: "Section B", sectionInstructionKo: walkBInst };

write("walk.json", {
  practiceId: "r2:u08:walk",
  title: "Grammar Walk",
  subtitle: "부정문 · 의문문 따라쓰기 (p. 122–123)",
  pages: "122–123",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(부정문 짝 맞추기), Section B 2문항(대화 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
  sections: [
    {
      id: "A",
      title: "Section A — 부정문",
      instructionKo: walkAInst,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B — 의문문 대화",
      instructionKo: walkBInst,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchItem({ ...walkBaseA, id: "a01" }, "A1", walkAPairs.slice(0, 5), "1–5"),
    matchItem({ ...walkBaseA, id: "a02" }, "A2", walkAPairs.slice(5), "6–10"),
    matchItem({ ...walkBaseB, id: "b01" }, "B1", walkBPairs.slice(0, 5), "1–5"),
    matchItem({ ...walkBaseB, id: "b02" }, "B2", walkBPairs.slice(5), "6–10"),
  ],
});

// —— Run ——
const runAInst =
  "다음 문장에서 현재 진행형의 부정형을 찾아 동그라미 하세요. 동그라미 칠 부분(부정 현재진행)만 빈칸에 쓰세요.";
const runBInst = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

const runANeg = [
  ["I am not reading a comic book.", "am not reading", ["am not reading"]],
  ["You are not counting.", "are not counting", ["are not counting"]],
  ["He is not playing basketball.", "is not playing basketball", ["is not playing basketball"]],
  ["She is not sleeping on the bed.", "is not sleeping on the bed", ["is not sleeping on the bed"]],
  ["We are not dancing.", "are not dancing", ["are not dancing"]],
  ["He isn't skating.", "isn't skating", ["isn't skating", "is not skating"]],
  ["They aren't making pizza.", "aren't making pizza", ["aren't making pizza", "are not making pizza"]],
  ["It isn't hopping.", "isn't hopping", ["isn't hopping", "is not hopping"]],
  ["They aren't riding a bike.", "aren't riding a bike", ["aren't riding a bike", "are not riding a bike"]],
  ["She isn't cutting the watermelon.", "isn't cutting the watermelon", ["isn't cutting the watermelon", "is not cutting the watermelon"]],
];

const runBaseA = { section: "A", sectionTitle: "Section A", sectionInstructionKo: runAInst };
const runBaseB = { section: "B", sectionTitle: "Section B", sectionInstructionKo: runBInst };

const runItemsA = runANeg.map(([sent, , acc], i) => {
  const label = String(i + 1);
  const ex = i === 0;
  return wordsItem(
    { ...runBaseA, id: `a${String(i + 1).padStart(2, "0")}` },
    label,
    sent,
    1,
    acc,
    ex ? { example: true, displayOnly: true, exampleAnswer: acc[0] } : {}
  );
});

const runBData = [
  ["A: Are you eating pie?\nB: ( Yes / No ), I'm not.", ["Yes", "No"], 2],
  ["A: Is she playing the game?\nB: ( Yes / No ), she is.", ["Yes", "No"], 1],
  ["A: Is he cutting the onion?\nB: ( Yes / No ), he isn't.", ["Yes", "No"], 2],
  ["A: Is it jumping?\nB: ( Yes / No ), it is.", ["Yes", "No"], 1],
  ["A: Are they making sandwiches?\nB: ( Yes / No ), they aren't.", ["Yes", "No"], 2],
  ["A: Are they flying?\nB: Yes, ( you / they ) are.", ["you", "they"], 2],
  ["A: Are you going to the pool?\nB: Yes, ( we / you ) are.", ["we", "you"], 1],
  ["A: Is he lying?\nB: No, ( she / he ) isn't.", ["she", "he"], 2],
  ["A: Is she catching the ball?\nB: Yes, ( she / they ) is.", ["she", "they"], 1],
  ["A: Is Jane drawing a frog?\nB: No, ( she / it ) isn't.", ["she", "it"], 1],
];

const runItemsB = runBData.map(([prompt, choices, idx], i) => {
  const label = String(i + 1);
  const ex = i === 0;
  return mcItem(
    { ...runBaseB, id: `b${String(i + 1).padStart(2, "0")}` },
    label,
    prompt,
    choices,
    idx,
    ex ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] } : {}
  );
});

write("run.json", {
  practiceId: "r2:u08:run",
  title: "Grammar Run",
  subtitle: "부정형 찾기 · 대답 고르기 (p. 124–125)",
  pages: "124–125",
  timerMinutes: 20,
  introKo: "Section A 10문항(부정형 쓰기), Section B 10문항(고르기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runAInst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: runANeg.slice(1).map((_, i) => String(i + 2)),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runBInst,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: runBData.slice(1).map((_, i) => String(i + 2)),
    },
  ],
  items: [...runItemsA, ...runItemsB],
});

// —— Jump ——
const jumpAInst = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
const jumpBInst = jumpAInst;

const jumpAData = [
  ["I ( am not making / not am making ) a snowman.", ["am not making", "not am making"], 1],
  ["You ( not are walking / are not walking ).", ["not are walking", "are not walking"], 2],
  ["She ( is not skiing / not is skiing ).", ["is not skiing", "not is skiing"], 1],
  ["It ( is not swimming / not is swimming ).", ["is not swimming", "not is swimming"], 1],
  ["We ( not are drinking / are not drinking ) milk.", ["not are drinking", "are not drinking"], 2],
  ["You ( isn't running / aren't running ) fast.", ["isn't running", "aren't running"], 2],
  ["They ( aren't pushing / isn't pushing ) the door.", ["aren't pushing", "isn't pushing"], 1],
  ["He ( isn't cleaning / aren't cleaning ) the room.", ["isn't cleaning", "aren't cleaning"], 1],
  ["Mom and Dad ( isn't playing / aren't playing ) badminton.", ["isn't playing", "aren't playing"], 2],
  ["( I'm not riding / I amn't riding ) a horse.", ["I'm not riding", "I amn't riding"], 1],
];

const jumpBData = [
  ["A: ( Are you playing / Is he playing ) soccer?\nB: Yes, I am.", ["Are you playing", "Is he playing"], 1],
  ["A: ( Is he driving / Is she driving ) a car carefully?\nB: No, she isn't.", ["Is he driving", "Is she driving"], 2],
  ["A: ( Is he reading / Are they reading ) a book?\nB: Yes, he is.", ["Is he reading", "Are they reading"], 1],
  ["A: ( Is it running / Is she running ) fast?\nB: No, it isn't.", ["Is it running", "Is she running"], 1],
  ["A: ( Are they / Are you ) watching TV?\nB: Yes, we are.", ["Are they", "Are you"], 2],
  ["A: Are they listening to music?\nB: Yes, ( they are / they do ).", ["they are", "they do"], 1],
  ["A: Are you coming home?\nB: No, ( I'm not / I don't ).", ["I'm not", "I don't"], 1],
  ["A: Is he going to church?\nB: No, ( he doesn't / he isn't ).", ["he doesn't", "he isn't"], 2],
  ["A: Is the cow eating?\nB: Yes, ( it is / it does ).", ["it is", "it does"], 1],
  ["A: Are Jack and Susan smiling happily?\nB: No, ( you don't / they aren't ).", ["you don't", "they aren't"], 2],
];

const jumpBaseA = { section: "A", sectionTitle: "Section A", sectionInstructionKo: jumpAInst };
const jumpBaseB = { section: "B", sectionTitle: "Section B", sectionInstructionKo: jumpBInst };

write("jump.json", {
  practiceId: "r2:u08:jump",
  title: "Grammar Jump",
  subtitle: "부정문 · 의문문 고르기 (p. 126–127)",
  pages: "126–127",
  timerMinutes: 20,
  introKo: "Section A 10문항, Section B 10문항(괄호 안에서 고르기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A — 부정문",
      instructionKo: jumpAInst,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: jumpAData.slice(1).map((_, i) => String(i + 2)),
    },
    {
      id: "B",
      title: "Section B — 의문문",
      instructionKo: jumpBInst,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: jumpBData.slice(1).map((_, i) => String(i + 2)),
    },
  ],
  items: [
    ...jumpAData.map(([prompt, choices, idx], i) =>
      mcItem(
        { ...jumpBaseA, id: `a${String(i + 1).padStart(2, "0")}` },
        String(i + 1),
        prompt,
        choices,
        idx,
        i === 0 ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] } : {}
      )
    ),
    ...jumpBData.map(([prompt, choices, idx], i) =>
      mcItem(
        { ...jumpBaseB, id: `b${String(i + 1).padStart(2, "0")}` },
        String(i + 1),
        prompt,
        choices,
        idx,
        i === 0 ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] } : {}
      )
    ),
  ],
});

// —— Fly ——
const flyAInst = "다음 문장을 부정문으로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요. 빈칸 수만큼만 쓰세요.";
const flyBInst = "다음 문장을 의문문으로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요. 빈칸 수만큼만 쓰세요.";

const flyANeg = [
  { label: "1", prompt: "I am walking. → I ___ ___ ___", blanks: 3, accept: ["am|not|walking"], ex: true },
  { label: "2", prompt: "You are swimming. → You ___ ___ ___", blanks: 3, accept: ["are|not|swimming"] },
  { label: "3", prompt: "She is flying a kite. → She ___ ___ ___ a kite", blanks: 3, accept: ["is|not|flying"] },
  { label: "4", prompt: "He is wearing the shirt. → He ___ ___ ___ the shirt", blanks: 3, accept: ["is|not|wearing"] },
  { label: "5", prompt: "They are going to school. → They ___ ___ ___ to school", blanks: 3, accept: ["are|not|going"] },
  {
    label: "6",
    prompt: "It is eating the leaves. → It ___ ___ the leaves",
    blanks: 2,
    accept: ["isn't|eating", "is not|eating"],
    ex: true,
  },
  {
    label: "7",
    prompt: "They are jumping rope. → They ___ ___ rope",
    blanks: 2,
    accept: ["aren't|jumping", "are not|jumping"],
  },
  {
    label: "8",
    prompt: "He is reading the newspaper. → He ___ ___ the newspaper",
    blanks: 2,
    accept: ["isn't|reading", "is not|reading"],
  },
  {
    label: "9",
    prompt: "My cats are sleeping. → My cats ___ ___ ___",
    blanks: 3,
    accept: ["are|not|sleeping"],
  },
  {
    label: "10",
    prompt: "Sue and I are sitting on the bench. → Sue and I ___ ___ on the bench",
    blanks: 2,
    accept: ["aren't|sitting", "are not|sitting"],
  },
];

const flyBQuest = [
  {
    label: "1",
    prompt: "You are working in the garden. → ___ ___ ___ in the garden?",
    blanks: 3,
    accept: ["Are|you|working"],
    ex: true,
  },
  { label: "2", prompt: "She is drinking water. → ___ ___ ___ water?", blanks: 3, accept: ["Is|she|drinking"] },
  { label: "3", prompt: "He is making sandwiches. → ___ ___ ___ sandwiches?", blanks: 3, accept: ["Is|he|making"] },
  {
    label: "4",
    prompt: "They are meeting their friends. → ___ ___ ___ their friends?",
    blanks: 3,
    accept: ["Are|they|meeting"],
  },
  { label: "5", prompt: "It is sleeping in the basket. → ___ ___ ___ in the basket?", blanks: 3, accept: ["Is|it|sleeping"] },
  { label: "6", prompt: "You are washing the dishes. → ___ ___ ___ the dishes?", blanks: 3, accept: ["Are|you|washing"] },
  { label: "7", prompt: "Nancy is doing her homework. → ___ ___ ___ her homework?", blanks: 3, accept: ["Is|Nancy|doing"] },
  { label: "8", prompt: "Siwon is helping his mother. → ___ ___ ___ his mother?", blanks: 3, accept: ["Is|Siwon|helping"] },
  {
    label: "9",
    prompt: "The fish is swimming in the river. → ___ ___ ___ ___ in the river?",
    blanks: 4,
    accept: ["Is|the|fish|swimming"],
  },
  {
    label: "10",
    prompt: "The girls are counting carrots. → ___ ___ ___ ___ carrots?",
    blanks: 4,
    accept: ["Are|the|girls|counting"],
  },
];

const flyBaseA = { section: "A", sectionTitle: "Section A", sectionInstructionKo: flyAInst };
const flyBaseB = { section: "B", sectionTitle: "Section B", sectionInstructionKo: flyBInst };

write("fly.json", {
  practiceId: "r2:u08:fly",
  title: "Grammar Fly",
  subtitle: "부정문 · 의문문 바꾸기 (p. 128–129)",
  pages: "128–129",
  timerMinutes: 20,
  introKo: "Section A 10문항(부정문), Section B 10문항(의문문)입니다. 빈칸마다 한 단어씩 쓰세요.",
  sections: [
    {
      id: "A",
      title: "Section A — 부정문",
      instructionKo: flyAInst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸마다",
      itemCount: 8,
      exampleCount: 2,
      labels: flyANeg.filter((x) => !x.ex).map((x) => x.label),
    },
    {
      id: "B",
      title: "Section B — 의문문",
      instructionKo: flyBInst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸마다",
      itemCount: 9,
      exampleCount: 1,
      labels: flyBQuest.slice(1).map((x) => x.label),
    },
  ],
  items: [
    ...flyANeg.map((row, i) =>
      wordsItem(
        { ...flyBaseA, id: `a${String(i + 1).padStart(2, "0")}` },
        row.label,
        row.prompt,
        row.blanks,
        row.accept,
        row.ex ? { example: true, displayOnly: true, exampleAnswer: row.accept[0].replace(/\|/g, " ") } : {}
      )
    ),
    ...flyBQuest.map((row, i) =>
      wordsItem(
        { ...flyBaseB, id: `b${String(i + 1).padStart(2, "0")}` },
        row.label,
        row.prompt,
        row.blanks,
        row.accept,
        row.ex ? { example: true, displayOnly: true, exampleAnswer: row.accept[0].replace(/\|/g, " ") } : {}
      )
    ),
  ],
});

// —— QUIZ tables (sections 2 & 4; comics skipped) ——
const quiz2Inst = "다음 표의 빈칸에 알맞은 말을 쓰세요. be동사+not 칸만 쓰세요.";
const quiz4Inst = "다음 표의 빈칸에 알맞은 말을 쓰세요. 번호가 있는 빈칸만 쓰세요.";

const quiz2Rows = [
  { label: "1", prompt: "I — am not (예시)", displayOnly: true, accept: ["am not"] },
  { label: "2", prompt: "You (단수) — 2번", accept: ["are not", "aren't"] },
  { label: "3", prompt: "He/She/It/단수명사 — 3번", accept: ["is not", "isn't"] },
  { label: "4", prompt: "We — 4번", accept: ["are not", "aren't"] },
  { label: "5", prompt: "You (복수) — 5번", accept: ["are not", "aren't"] },
  { label: "6", prompt: "They/복수명사 — 6번", accept: ["are not", "aren't"] },
];

const quiz4Rows = [
  { label: "1", prompt: "Am I …? — 동사원형-ing 칸 (1번)", accept: ["doing", "going", "playing", "working"] },
  { label: "2", prompt: "… you …? — be동사 (2번)", accept: ["Are"] },
  { label: "3", prompt: "Yes, … am. (3번)", accept: ["I"] },
  { label: "4", prompt: "… he/she/it …? — be동사 (4번)", accept: ["Is"] },
  { label: "5", prompt: "…, he is. — 긍정 대답 맨 앞 (5번)", accept: ["Yes"] },
  { label: "6", prompt: "No, he … . — 부정 be (6번)", accept: ["isn't", "is not"] },
  { label: "7", prompt: "Yes, we … . — be동사 (7번)", accept: ["are"] },
  { label: "8", prompt: "…, we aren't. — 부정 대답 맨 앞 (8번)", accept: ["No"] },
];

write("quiz2.json", {
  practiceId: "r2:u08:quiz2",
  title: "QUIZ 2 — 부정문 표",
  subtitle: "p. 130",
  pages: "130",
  timerMinutes: 15,
  introKo: "6문항(예시 1개). 표의 be동사+not 칸을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Inst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 5,
      exampleCount: 1,
      labels: quiz2Rows.filter((r) => !r.displayOnly).map((r) => r.label),
    },
  ],
  items: quiz2Rows.map((row, i) =>
    wordsItem(
      {
        section: "A",
        sectionTitle: "QUIZ 2",
        sectionInstructionKo: quiz2Inst,
        id: `q${String(i + 1).padStart(2, "0")}`,
      },
      row.label,
      row.prompt,
      1,
      row.accept,
      row.displayOnly ? { example: true, displayOnly: true, exampleAnswer: row.accept[0] } : {}
    )
  ),
});

write("quiz4.json", {
  practiceId: "r2:u08:quiz4",
  title: "QUIZ 4 — 의문문 표",
  subtitle: "p. 131",
  pages: "131",
  timerMinutes: 15,
  introKo: "8문항. 의문문·대답 표의 빈칸을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 4",
      instructionKo: quiz4Inst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 8,
      exampleCount: 0,
      labels: quiz4Rows.map((r) => r.label),
    },
  ],
  items: quiz4Rows.map((row, i) =>
    wordsItem(
      {
        section: "A",
        sectionTitle: "QUIZ 4",
        sectionInstructionKo: quiz4Inst,
        id: `q${String(i + 1).padStart(2, "0")}`,
      },
      row.label,
      row.prompt,
      1,
      row.accept
    )
  ),
});

console.log("Wrote RedZap 2 Unit 08 →", OUT);
