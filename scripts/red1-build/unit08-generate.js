/* Generate data/red1/unit08/*.json — RedZap 1 Unit 08 be동사 am, are, is */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit08");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-08",
  unitTitle: "Unit 08 — be동사 am, are, is",
  sectionsVersion: 1,
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function matchItem(id, section, label, pairs, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: "match",
    answerModeTag: "Match · 짝 맞추기",
    label,
    type: "match",
    pairs,
    accept: pairs.map((p) => `${p.left}|${p.right}`),
    ...extra,
  };
}

function mcItem(id, section, label, prompt, choices, acceptIdx, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn: prompt,
    choices,
    accept: [String(acceptIdx)],
    ...extra,
  };
}

function fillItem(id, section, label, prompt, accept, extra = {}) {
  const blanks = extra.blanks || 1;
  const answerMode = extra.answerMode || "words";
  const tag =
    answerMode === "sentence"
      ? "Sentence · 문장 전체"
      : answerMode === "words"
        ? "Words · 빈칸 말만"
        : "Words · 빈칸 말만";
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode,
    answerModeTag: extra.answerModeTag || tag,
    label,
    type: "fill",
    promptEn: prompt,
    blanks,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

function writeJson(name, practice) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify({ ...practice, ...META }, null, 2) + "\n");
}

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 주어와 be동사를 따라 써 보세요. 한국어 문장과 영어 주어+be동사를 연결하세요.";
  const instrB =
    "다음 문장의 뜻을 생각하며 주어와 be동사의 줄임말을 따라 써 보세요. 한국어 문장과 영어 줄임말을 연결하세요.";

  // Korean meanings are standard glosses (book has no printed Korean for full sentences).
  const subjPairs = [
    { left: "나는 행복해.", right: "I am" },
    { left: "그것은 내 인형이야.", right: "It is" },
    { left: "그녀는 아파.", right: "She is" },
    { left: "너는 귀여워.", right: "You are" },
    { left: "그들은 배고파.", right: "They are" },
    { left: "저것은 그녀의 접착제야.", right: "That is" },
    { left: "저것들은 네 연필이야.", right: "Those are" },
    { left: "이것들은 그의 연필이야.", right: "These are" },
    { left: "연들은 그녀의 것이야.", right: "The kites are" },
    { left: "로봇들은 그의 것이야.", right: "The robots are" },
  ];

  const contraPairs = [
    { left: "나는 학생이야.", right: "I'm" },
    { left: "너는 농부야.", right: "You're" },
    { left: "그는 우리 삼촌이야.", right: "He's" },
    { left: "그녀는 우리 고모야.", right: "She's" },
    { left: "우리는 친구야.", right: "We're" },
    { left: "너희는 선생님이야.", right: "You're" },
    { left: "그들은 의사야.", right: "They're" },
    { left: "그것은 양파야.", right: "It's" },
    { left: "그것들은 양파들이야.", right: "They're" },
    { left: "저것은 비행기야.", right: "That's" },
  ];

  const items = [];
  chunk(subjPairs, 7).forEach((g, i) => {
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, g, {
        sectionInstructionKo: instrA,
        promptKo: `문장 ${i * 7 + 1}–${i * 7 + g.length}`,
      })
    );
  });
  chunk(contraPairs, 7).forEach((g, i) => {
    items.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, g, {
        sectionInstructionKo: instrB,
        promptKo: `문장 ${i * 7 + 1}–${i * 7 + g.length}`,
      })
    );
  });

  writeJson("walk.json", {
    practiceId: "r1:u08:walk",
    title: "Grammar Walk",
    subtitle: "주어·be동사 따라쓰기 (p. 122–123)",
    pages: "122–123",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(한국어↔주어+be동사), Section B 2문항(한국어↔줄임말)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["A1", "A2"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["B1", "B2"],
      },
    ],
    items,
  });
}

function writeRun() {
  const instrA = "다음 문장에서 be동사를 찾아 동그라미 하세요. be동사만 빈칸에 쓰세요.";
  const instrB = "다음 문장에서 줄임말을 찾아 동그라미 하세요. 줄임말만 빈칸에 쓰세요.";

  const runA = [
    ["I <u>am</u> an actor.", "am", true],
    ["You are a police officer.", "are"],
    ["She is a teacher.", "is"],
    ["He is a doctor.", "is"],
    ["We are students.", "are"],
    ["It is her ruler.", "is"],
    ["That is her cat.", "is"],
    ["These are his dogs.", "are"],
    ["This girl is kind.", "is"],
    ["The boys are kind.", "are"],
  ];

  const runB = [
    ["I'm fat.", "I'm", true],
    ["You're kind.", "You're"],
    ["He's thin.", "He's"],
    ["She's happy.", "She's"],
    ["We're police officers.", "We're"],
    ["You're farmers.", "You're"],
    ["They're cooks.", "They're"],
    ["It's sugar.", "It's"],
    ["That's an elephant.", "That's"],
    ["They're grapes.", "They're"],
  ];

  const contraAccept = (w) => [w];

  const items = [];
  runA.forEach(([prompt, ans, ex], i) => {
    const label = `A${i + 1}`;
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", label, prompt, [ans], {
        sectionInstructionKo: instrA,
        ...(ex
          ? { example: true, displayOnly: true, exampleAnswer: ans }
          : {}),
      })
    );
  });
  runB.forEach(([prompt, ans, ex], i) => {
    const label = `B${i + 1}`;
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", label, prompt, contraAccept(ans), {
        sectionInstructionKo: instrB,
        ...(ex
          ? { example: true, displayOnly: true, exampleAnswer: ans }
          : {}),
      })
    );
  });

  writeJson("run.json", {
    practiceId: "r1:u08:run",
    title: "Grammar Run",
    subtitle: "be동사·줄임말 찾기 (p. 124–125)",
    pages: "124–125",
    timerMinutes: 20,
    introKo: "Section A 10문항(be동사 쓰기), B 10문항(줄임말 쓰기)입니다. 예시 1개씩.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
  });
}

function writeJump() {
  const instrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const instrB = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

  const jumpA = [
    ["I ( am / are ) a singer.", ["am", "are"], 1, true],
    ["We ( are / is ) teachers.", ["are", "is"], 1],
    ["You ( am / are ) my friend.", ["am", "are"], 2],
    ["She ( are / is ) my aunt.", ["are", "is"], 2],
    ["It ( is / are ) an iguana.", ["is", "are"], 1],
    ["This ( is / are ) my desk.", ["is", "are"], 1],
    ["Those ( am / are ) her notebooks.", ["am", "are"], 2],
    ["That ( is / are ) your notebook.", ["is", "are"], 1],
    ["The apple ( is / are ) green.", ["is", "are"], 1],
    ["Those apples ( is / are ) red.", ["is", "are"], 2],
  ];

  const jumpB = [
    ["( I / You ) am a nurse.", ["I", "You"], 1, true],
    ["( You / She ) are pretty.", ["You", "She"], 1],
    ["( That / Those ) is a spider.", ["That", "Those"], 1],
    ["( I / We ) are weak.", ["I", "We"], 2],
    ["( He / You ) are my friends.", ["He", "You"], 2],
    ["( This / These ) is her violin.", ["This", "These"], 1],
    ["( They / She ) is my mom.", ["They", "She"], 2],
    ["( They / She ) are firefighters.", ["They", "She"], 1],
    ["( It / Those ) is his book.", ["It", "Those"], 1],
    ["( This / These ) are your notebooks.", ["This", "These"], 2],
  ];

  const items = [];
  jumpA.forEach(([prompt, choices, idx, ex], i) => {
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, prompt, choices, idx, {
        sectionInstructionKo: instrA,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] } : {}),
      })
    );
  });
  jumpB.forEach(([prompt, choices, idx, ex], i) => {
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, prompt, choices, idx, {
        sectionInstructionKo: instrB,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] } : {}),
      })
    );
  });

  writeJson("jump.json", {
    practiceId: "r1:u08:jump",
    title: "Grammar Jump",
    subtitle: "be동사·주어 고르기 (p. 126–127)",
    pages: "126–127",
    timerMinutes: 20,
    introKo: "Section A 9문항(be동사 고르기), B 9문항(주어 고르기)입니다. 예시 각 1개.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
  });
}

function writeFly() {
  const instrA = "다음 문장의 빈칸에 알맞은 말을 쓰세요. be동사만 쓰세요.";
  const instrB = "다음 밑줄 친 말의 줄임말을 빈칸에 쓰세요. 줄임말만 쓰세요.";

  const flyA = [
    ["I ___ weak.", "am", true],
    ["We ___ strong.", "are"],
    ["She ___ pretty.", "is"],
    ["They ___ fat.", "are"],
    ["It ___ a goose.", "is"],
    ["This ___ my computer.", "is"],
    ["Those ___ my pens.", "are"],
    ["The puppies ___ cute.", "are"],
    ["My mom ___ pretty.", "is"],
    ["My brothers ___ handsome.", "are"],
  ];

  const flyB = [
    ["<u>You are</u> my friend. = ___ my friend.", "You're", true],
    ["<u>That is</u> an orange. = ___ an orange.", "That's"],
    ["<u>It is</u> your umbrella. = ___ your umbrella.", "It's"],
    ["<u>They are</u> pilots. = ___ pilots.", "They're"],
    ["<u>She is</u> pretty. = ___ pretty.", "She's"],
    ["<u>I am</u> smart. = ___ smart.", "I'm"],
    ["<u>He is</u> my grandpa. = ___ my grandpa.", "He's"],
    ["<u>We are</u> strong. = ___ strong.", "We're"],
    ["<u>You are</u> firefighters. = ___ firefighters.", "You're"],
    ["<u>They are</u> his bikes. = ___ his bikes.", "They're"],
  ];

  const contraAccept = (w) => [w];

  const items = [];
  flyA.forEach(([prompt, ans, ex], i) => {
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, prompt, [ans], {
        sectionInstructionKo: instrA,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
      })
    );
  });
  flyB.forEach(([prompt, ans, ex], i) => {
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, prompt, contraAccept(ans), {
        sectionInstructionKo: instrB,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
      })
    );
  });

  writeJson("fly.json", {
    practiceId: "r1:u08:fly",
    title: "Grammar Fly",
    subtitle: "be동사·줄임말 쓰기 (p. 128–129)",
    pages: "128–129",
    timerMinutes: 20,
    introKo: "Section A 9문항(be동사), B 9문항(줄임말)입니다. 예시 각 1개.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
  });
}

function writeQuiz2() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. be동사(am, are, is)만 한 칸에 쓰세요.";
  const rows = [
    ["I (단수)", "am", true],
    ["you (단수)", "are"],
    ["he / she / it", "is"],
    ["we / you / they (복수)", "are"],
    ["this / that", "is"],
    ["these / those", "are"],
  ];

  const items = rows.map(([promptKo, ans, ex], i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), promptKo, [ans], {
      sectionInstructionKo: instr,
      promptKo,
      ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
    })
  );

  writeJson("quiz2.json", {
    practiceId: "r1:u08:quiz2",
    title: "QUIZ 2 — 대명사와 be동사",
    subtitle: "p. 130",
    pages: "130",
    timerMinutes: 15,
    introKo: "표 빈칸 6칸(예시 1개). be동사만 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 5,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6"],
      },
    ],
    items: items.slice(1),
  });
}

function writeQuiz4() {
  const instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 줄임말만 쓰세요.";
  const rows = [
    ["I am →", "I'm", true],
    ["we are →", "we're"],
    ["they are →", "they're"],
    ["he is →", "he's"],
    ["it is →", "it's"],
    ["that is →", "that's"],
  ];

  const contraAccept = (w) => [w];

  const allItems = rows.map(([promptKo, ans, ex], i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), promptKo, contraAccept(ans), {
      sectionInstructionKo: instr,
      promptKo,
      ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
    })
  );

  writeJson("quiz4.json", {
    practiceId: "r1:u08:quiz4",
    title: "QUIZ 4 — 줄임말 표",
    subtitle: "p. 131",
    pages: "131",
    timerMinutes: 15,
    introKo: "줄임말 표 빈칸 6칸(예시 1개).",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 5,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6"],
      },
    ],
    items: allItems.filter((it) => !it.displayOnly),
  });
}

function writeQuiz5() {
  const instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. be동사만 쓰세요.";
  const items = [
    fillItem("q01", "A", "1", "the boy (단수명사)", ["is"], {
      sectionInstructionKo: instr,
      promptKo: "the boy",
      example: true,
      displayOnly: true,
      exampleAnswer: "is",
    }),
    fillItem("q02", "A", "2", "the boys (복수명사)", ["are"], {
      sectionInstructionKo: instr,
      promptKo: "the boys",
    }),
  ];

  writeJson("quiz5.json", {
    practiceId: "r1:u08:quiz5",
    title: "QUIZ 5 — 명사와 be동사",
    subtitle: "p. 131",
    pages: "131",
    timerMinutes: 10,
    introKo: "명사 표 빈칸 2칸(예시 1개).",
    sections: [
      {
        id: "A",
        title: "QUIZ 5",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 1,
        exampleCount: 1,
        labels: ["2"],
      },
    ],
    items: items.filter((it) => !it.displayOnly),
  });
}

writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz2();
writeQuiz4();
writeQuiz5();
console.log("Wrote", OUT);
