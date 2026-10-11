#!/usr/bin/env node
/* Generate RedZap 1 Unit 10 practice JSON (be동사 부정문·의문문 2). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit10");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-10",
  unitTitle: "Unit 10 — be동사의 부정문과 의문문 (2)",
  sectionsVersion: 2,
};

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const p = path.join(OUT, name);
  fs.writeFileSync(p, JSON.stringify({ ...data, ...META }, null, 2) + "\n");
  console.log("wrote", p);
}

function mc(id, section, label, promptEn, choices, acceptIdx, opts = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: [String(acceptIdx)],
    ...opts.extra,
  };
}

function fill(id, section, label, promptEn, accept, blanks, opts = {}) {
  const acc = Array.isArray(accept) ? accept : [accept];
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: "words",
    answerModeTag: opts.answerModeTag || "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept: acc,
    ...opts.extra,
  };
}

function matchItem(id, section, label, pairs, promptKo, sectionInstructionKo) {
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
    accept: pairs.map((p) => `${p.left}|${p.right}`),
    promptKo,
  };
}

// —— walk —— (Korean meaning ↔ full English sentence; Korean not printed on book — standard glosses)
const walkA1 = [
  ["이것은 달걀이 아니다.", "This is not an egg."],
  ["저것은 새가 아니다.", "That is not a bird."],
  ["이것들은 호랑이가 아니다.", "These are not tigers."],
  ["저것들은 토끼가 아니다.", "Those are not rabbits."],
  ["이것은 지우개가 아니다.", "This isn't an eraser."],
  ["저것은 감자가 아니다.", "That isn't a potato."],
  ["이것들은 토마토가 아니다.", "These aren't tomatoes."],
];
const walkA2 = [
  ["저것들은 양파가 아니다.", "Those aren't onions."],
  ["이것은 내 코트가 아니다.", "This is not my coat."],
  ["저것들은 내 스웨터가 아니다.", "Those are not my sweaters."],
];

const walkB1 = [
  ["Is this an orange?", "Yes, it is."],
  ["Is that an iguana?", "No, it isn't."],
  ["Are these kangaroos?", "Yes, they are."],
  ["Are those crayons?", "No, they aren't."],
  ["Is this your ink?", "No, it isn't."],
  ["Is that your scarf?", "Yes, it is."],
  ["Are these your shoes?", "No, they aren't."],
];
const walkB2 = [
  ["Are those your socks?", "Yes, they are."],
  ["Is that your skirt?", "No, it isn't."],
  ["Are those your pants?", "No, they aren't."],
];

const walkInstA =
  "다음 문장의 뜻을 생각하며 따라 써 보세요. 한국어 뜻과 영어 문장을 짝지어 연결하세요.";
const walkInstB =
  "다음 대화의 뜻을 생각하며 따라 써 보세요. 질문(A)과 대답(B)을 짝지어 연결하세요.";

write("walk.json", {
  practiceId: "r1:u10:walk",
  title: "Grammar Walk",
  subtitle: "부정문 · 의문문 따라쓰기 (p. 154–155)",
  pages: "154–155",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(한국어 뜻↔영어 문장 10쌍), B 2문항(대화 짝 맞추기 10쌍)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: walkInstA,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: walkInstB,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchItem(
      "a01",
      "A",
      "A1",
      walkA1.map(([l, r]) => ({ left: l, right: r })),
      "부정문 1–7",
      walkInstA
    ),
    matchItem(
      "a02",
      "A",
      "A2",
      walkA2.map(([l, r]) => ({ left: l, right: r })),
      "부정문 8–10",
      walkInstA
    ),
    matchItem(
      "b01",
      "B",
      "B1",
      walkB1.map(([l, r]) => ({ left: l, right: r })),
      "대화 1–7",
      walkInstB
    ),
    matchItem(
      "b02",
      "B",
      "B2",
      walkB2.map(([l, r]) => ({ left: l, right: r })),
      "대화 8–10",
      walkInstB
    ),
  ],
});

// —— run ——
const runInstA =
  "다음 문장에서 「be동사 + not」 또는 「be동사 + not」의 줄임말을 찾아 동그라미 하세요. 동그라미 친 부분을 고르세요.";
const runInstB =
  "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

// MC choices: phrases from the sentence only (book order), never invented be+not forms.
const runAData = [
  { ex: true, s: "This is not a tomato.", ans: "is not", ch: ["This", "is not", "a tomato", "is"] },
  { s: "That is not a watermelon.", ans: "is not", ch: ["That", "is not", "a watermelon", "is"] },
  { s: "These are not bananas.", ans: "are not", ch: ["These", "are not", "bananas", "are"] },
  { s: "Those are not potatoes.", ans: "are not", ch: ["Those", "are not", "potatoes", "are"] },
  { s: "This isn't my backpack.", ans: "isn't", ch: ["This", "isn't", "my backpack", "is"] },
  { s: "That isn't my piano.", ans: "isn't", ch: ["That", "isn't", "my piano", "is"] },
  { s: "These aren't my books.", ans: "aren't", ch: ["These", "aren't", "my books", "are"] },
  { s: "Those aren't my bats.", ans: "aren't", ch: ["Those", "aren't", "my bats", "are"] },
  { s: "That isn't his bike.", ans: "isn't", ch: ["That", "isn't", "his bike", "is"] },
  { s: "This isn't her car.", ans: "isn't", ch: ["This", "isn't", "her car", "is"] },
];

const runBData = [
  { ex: true, q: "A: Is this a chair?  B: Yes, ( it / they ) is.", ans: "it", ch: ["it", "they"] },
  { q: "A: Is that a hat?  B: No, ( it / they ) isn't.", ans: "it", ch: ["it", "they"] },
  { q: "A: Are these his mittens?  B: Yes, ( it / they ) are.", ans: "they", ch: ["it", "they"] },
  { q: "A: Are those her pants?  B: No, ( it / they ) aren't.", ans: "they", ch: ["it", "they"] },
  { q: "A: Is this your lunch?  B: No, ( it / they ) isn't.", ans: "it", ch: ["it", "they"] },
  { q: "A: Is that your breakfast?  B: Yes, ( it / they ) is.", ans: "it", ch: ["it", "they"] },
  { q: "A: Are these your crayons?  B: No, ( it / they ) aren't.", ans: "they", ch: ["it", "they"] },
  { q: "A: Are those your cookies?  B: Yes, ( it / they ) are.", ans: "they", ch: ["it", "they"] },
  { q: "A: Is this your house?  B: No, ( it / they ) isn't.", ans: "it", ch: ["it", "they"] },
  { q: "A: Are these your pencils?  B: Yes, ( it / they ) are.", ans: "they", ch: ["it", "they"] },
];

write("run.json", {
  practiceId: "r1:u10:run",
  title: "Grammar Run",
  subtitle: "be+not 찾기 · it/they (p. 156–157)",
  pages: "156–157",
  timerMinutes: 20,
  introKo: "Section A 10문항(고르기), B 10문항(고르기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runInstA,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runInstB,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [
    ...runAData.map((d, i) => {
      const id = `a${String(i + 1).padStart(2, "0")}`;
      const idx = d.ch.indexOf(d.ans) + 1;
      const item = mc(id, "A", `A${i + 1}`, d.s, d.ch, idx, { sectionInstructionKo: runInstA });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.ans;
      }
      return item;
    }),
    ...runBData.map((d, i) => {
      const id = `b${String(i + 1).padStart(2, "0")}`;
      const idx = d.ch.indexOf(d.ans) + 1;
      const item = mc(id, "B", `B${i + 1}`, d.q, d.ch, idx, { sectionInstructionKo: runInstB });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.ans;
      }
      return item;
    }),
  ],
});

// —— jump ——
const jumpInstA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
const jumpInstB = jumpInstA;

const jumpA = [
  { ex: true, p: "That ( is not / are not ) a mouse.", ans: "is not", ch: ["is not", "are not"] },
  { p: "This ( is not / are not ) a snake.", ans: "is not", ch: ["is not", "are not"] },
  { p: "Those ( is not / are not ) lions.", ans: "are not", ch: ["is not", "are not"] },
  { p: "These ( is not / are not ) sheep.", ans: "are not", ch: ["is not", "are not"] },
  { p: "That ( isn't / aren't ) a cow.", ans: "isn't", ch: ["isn't", "aren't"] },
  { p: "This ( isn't / aren't ) a train.", ans: "isn't", ch: ["isn't", "aren't"] },
  { p: "Those ( isn't / aren't ) candies.", ans: "aren't", ch: ["isn't", "aren't"] },
  { p: "These ( isn't / aren't ) forks.", ans: "aren't", ch: ["isn't", "aren't"] },
  { p: "That ( isn't / aren't ) my watch.", ans: "isn't", ch: ["isn't", "aren't"] },
  { p: "Those ( isn't / aren't ) my gloves.", ans: "aren't", ch: ["isn't", "aren't"] },
];

const jumpB = [
  { ex: true, p: "A: ( Are / Is ) this his camera?  B: Yes, it is.", ans: "Is", ch: ["Are", "Is"] },
  { p: "A: ( Are / Is ) that her hairpin?  B: No, it isn't.", ans: "Is", ch: ["Are", "Is"] },
  { p: "A: ( Are / Is ) these my notebooks?  B: Yes, they are.", ans: "Are", ch: ["Are", "Is"] },
  { p: "A: ( Are / Is ) those your rulers?  B: No, they aren't.", ans: "Are", ch: ["Are", "Is"] },
  { p: "A: ( Are / Is ) these their bags?  B: Yes, they are.", ans: "Are", ch: ["Are", "Is"] },
  { p: "A: Is this your room?  B: Yes, ( it is / they are ).", ans: "it is", ch: ["it is", "they are"] },
  { p: "A: Is that your pet?  B: No, ( it isn't / they aren't ).", ans: "it isn't", ch: ["it isn't", "they aren't"] },
  { p: "A: Are these your flowers?  B: Yes, ( it is / they are ).", ans: "they are", ch: ["it is", "they are"] },
  { p: "A: Are those our books?  B: No, ( it isn't / they aren't ).", ans: "they aren't", ch: ["it isn't", "they aren't"] },
  { p: "A: Is that your cup?  B: Yes, ( it is / it isn't ).", ans: "it is", ch: ["it is", "it isn't"] },
];

write("jump.json", {
  practiceId: "r1:u10:jump",
  title: "Grammar Jump",
  subtitle: "부정형 · 의문·대답 고르기 (p. 158–159)",
  pages: "158–159",
  timerMinutes: 18,
  introKo: "Section A 10문항(고르기), B 10문항(고르기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpInstA,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpInstB,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [
    ...jumpA.map((d, i) => {
      const item = mc(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, d.p, d.ch, d.ch.indexOf(d.ans) + 1, {
        sectionInstructionKo: jumpInstA,
      });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.ans;
      }
      return item;
    }),
    ...jumpB.map((d, i) => {
      const item = mc(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, d.p, d.ch, d.ch.indexOf(d.ans) + 1, {
        sectionInstructionKo: jumpInstB,
      });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.ans;
      }
      return item;
    }),
  ],
});

// —— fly ——
const flyInstA =
  "다음 문장을 부정문으로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
const flyInstB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";

const flyA = [
  { ex: true, from: "This is a clock.", blanks: 2, accept: ["is|not", "is not"], prompt: "This is a clock. → This ___ ___ a clock." },
  { from: "That is a piano.", blanks: 2, accept: ["is|not", "is not"], prompt: "That is a piano. → That ___ ___ a piano." },
  { from: "These are zebras.", blanks: 2, accept: ["are|not", "are not"], prompt: "These are zebras. → These ___ ___ zebras." },
  { from: "Those are monkeys.", blanks: 2, accept: ["are|not", "are not"], prompt: "Those are monkeys. → Those ___ ___ monkeys." },
  { from: "This is my shirt.", blanks: 2, accept: ["is|not", "is not"], prompt: "This is my shirt. → This ___ ___ my shirt." },
  { ex: true, from: "That is his boat.", blanks: 1, accept: ["isn't", "is not"], prompt: "That is his boat. → That ___ his boat." },
  { from: "These are your umbrellas.", blanks: 1, accept: ["aren't", "are not"], prompt: "These are your umbrellas. → These ___ your umbrellas." },
  { from: "Those are their drums.", blanks: 1, accept: ["aren't", "are not"], prompt: "Those are their drums. → Those ___ their drums." },
  { from: "This is her belt.", blanks: 1, accept: ["isn't", "is not"], prompt: "This is her belt. → This ___ her belt." },
  { from: "These are our bikes.", blanks: 1, accept: ["aren't", "are not"], prompt: "These are our bikes. → These ___ our bikes." },
];

const flyB = [
  { ex: true, prompt: "A: ___ this a fork?  B: Yes, it is.", accept: ["Is"], blanks: 1 },
  { prompt: "A: ___ that a knife?  B: No, it isn't.", accept: ["Is"], blanks: 1 },
  { prompt: "A: ___ these spoons?  B: Yes, they are.", accept: ["Are"], blanks: 1 },
  { prompt: "A: ___ those chopsticks?  B: No, they aren't.", accept: ["Are"], blanks: 1 },
  { prompt: "A: ___ this a table?  B: No, it isn't.", accept: ["Is"], blanks: 1 },
  { ex: true, prompt: "A: Is that his bat?  B: Yes, ___ ___.", accept: ["it|is", "it is"], blanks: 2 },
  { prompt: "A: Is this her ball?  B: No, ___ ___.", accept: ["it|isn't", "it isn't"], blanks: 2 },
  { prompt: "A: Are those our hats?  B: Yes, ___ ___.", accept: ["they|are", "they are"], blanks: 2 },
  { prompt: "A: Are these your ties?  B: No, ___ ___.", accept: ["they|aren't", "they aren't"], blanks: 2 },
  { prompt: "A: Are those your boxes?  B: No, ___ ___.", accept: ["they|aren't", "they aren't"], blanks: 2 },
];

write("fly.json", {
  practiceId: "r1:u10:fly",
  title: "Grammar Fly",
  subtitle: "부정문 · 대화 빈칸 (p. 160–161)",
  pages: "160–161",
  timerMinutes: 22,
  introKo: "Section A 10문항(빈칸), B 10문항(빈칸)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyInstA,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 8,
      exampleCount: 2,
      labels: ["A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyInstB,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 8,
      exampleCount: 2,
      labels: ["B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [
    ...flyA.map((d, i) => {
      const item = fill(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, d.prompt, d.accept, d.blanks, {
        sectionInstructionKo: flyInstA,
        extra: { promptKo: d.from },
      });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.accept[0].includes("|") ? d.accept[0].replace("|", " ") : d.accept[0];
      }
      return item;
    }),
    ...flyB.map((d, i) => {
      const item = fill(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, d.prompt, d.accept, d.blanks, {
        sectionInstructionKo: flyInstB,
      });
      if (d.ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = d.accept[0].includes("|") ? d.accept[0].replace("|", " ") : d.accept[0];
      }
      return item;
    }),
  ],
});

// —— quiz2 ——
const quiz2Inst = "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
write("quiz2.json", {
  practiceId: "r1:u10:quiz2",
  title: "QUIZ 2 — 부정문 표",
  subtitle: "지시대명사 부정문 · p. 163",
  pages: "163",
  timerMinutes: 12,
  introKo: "4문항. 표 빈칸(That 줄임말, These 줄임말, Those 부정문)을 채웁니다.",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Inst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 3,
      exampleCount: 0,
      labels: ["1", "2", "3"],
    },
  ],
  items: [
    fill("q01", "A", "1", "That is not ~. 줄임말: That ___ ~.", ["isn't"], 1, {
      sectionInstructionKo: quiz2Inst,
      promptKo: "표 · 단수 That",
    }),
    fill("q02", "A", "2", "These are not ~. 줄임말: These ___ ~.", ["aren't"], 1, {
      sectionInstructionKo: quiz2Inst,
      promptKo: "표 · 복수 These",
    }),
    fill("q03", "A", "3", "Those ___ ~. (부정문)", ["are not", "aren't"], 1, {
      sectionInstructionKo: quiz2Inst,
      promptKo: "표 · 복수 Those",
    }),
  ],
});

// —— quiz4 ——
const quiz4Inst = quiz2Inst;
write("quiz4.json", {
  practiceId: "r1:u10:quiz4",
  title: "QUIZ 4 — 의문문 표",
  subtitle: "지시대명사 의문문 · p. 164",
  pages: "164",
  timerMinutes: 12,
  introKo: "4문항. 의문문·대답 표 빈칸을 채웁니다.",
  sections: [
    {
      id: "A",
      title: "QUIZ 4",
      instructionKo: quiz4Inst,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 4,
      exampleCount: 0,
      labels: ["1", "2", "3", "4"],
    },
  ],
  items: [
    fill("q01", "A", "1", "Is ___ ~? (저것이 ~이니?)", ["that"], 1, {
      sectionInstructionKo: quiz4Inst,
      promptKo: "의문문 단수",
    }),
    fill("q02", "A", "2", "No, ___ isn't.", ["it"], 1, { sectionInstructionKo: quiz4Inst, promptKo: "단수 부정 대답" }),
    fill("q03", "A", "3", "___ these ~?", ["Are"], 1, { sectionInstructionKo: quiz4Inst, promptKo: "의문문 복수" }),
    fill("q04", "A", "4", "No, ___ ___.", ["they|aren't", "they aren't"], 2, {
      sectionInstructionKo: quiz4Inst,
      promptKo: "복수 부정 대답",
    }),
  ],
});

console.log("Unit 10 generate done.");
