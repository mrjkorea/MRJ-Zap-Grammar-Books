/* Generate data/red1/unit09/*.json — RedZap 1 Unit 09 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit09");
fs.mkdirSync(OUT, { recursive: true });

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-09",
  unitTitle: "Unit 09 — be동사의 부정문과 의문문 (1)",
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

function mcItem(id, section, label, prompt, choices, accept, extra = {}) {
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
    accept: [accept],
    ...extra,
  };
}

function fillItem(id, section, label, prompt, accept, extra = {}) {
  const blanks = extra.blanks || 1;
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: extra.answerMode || "words",
    answerModeTag: extra.answerModeTag || "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn: prompt,
    blanks,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 따라 써 보세요. 한국어 뜻과 영어 문장을 짝지어 연결하세요.";
  const instrB =
    "다음 대화의 뜻을 생각하며 따라 써 보세요. A의 질문과 B의 대답을 짝지어 연결하세요.";

  const walkA = [
    ["나는 화가 나 있지 않다.", "I am not angry."],
    ["너는 아프지 않다.", "You are not sick."],
    ["그는 마르지 않았다.", "He is not thin."],
    ["그녀는 뚱뚱하지 않다.", "She is not fat."],
    ["그것은 내 강아지가 아니다.", "It is not my puppy."],
    ["우리는 약하지 않다.", "We are not weak."],
    ["당신들은 소방관이 아니다.", "You are not firefighters."],
    ["그들은 경찰관이 아니다.", "They are not police officers."],
    ["그것들은 내 셔츠가 아니다.", "They aren't my shirts."],
    ["그는 우리 오빠가 아니다.", "He isn't my brother."],
  ];

  const walkB = [
    ["Are you a pilot?", "No, I am not."],
    ["Is he hungry?", "Yes, he is."],
    ["Is she thirsty?", "No, she isn't."],
    ["Are you students?", "No, we aren't."],
    ["Are they doctors?", "Yes, they are."],
    ["Is it old?", "Yes, it is."],
    ["Are they new?", "No, they aren't."],
    ["Are you Jane?", "Yes, I am."],
    ["Are you nurses?", "Yes, we are."],
    ["Is he handsome?", "No, he isn't."],
  ];

  const items = [];
  chunk(walkA, 7).forEach((g, i) => {
    const pairs = g.map(([ko, en]) => ({ left: ko, right: en }));
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, pairs, {
        sectionInstructionKo: instrA,
      })
    );
  });
  chunk(walkB, 7).forEach((g, i) => {
    const pairs = g.map(([q, a]) => ({ left: q, right: a }));
    items.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, pairs, {
        sectionInstructionKo: instrB,
      })
    );
  });

  const practice = {
    practiceId: "r1:u09:walk",
    title: "Grammar Walk",
    subtitle: "부정문 · 의문문 따라쓰기 (p. 140–141)",
    pages: "140–141",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(한국어↔영어 부정문 10문장), Section B 2문항(의문문 대화 10문항)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — 부정문",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["A1", "A2"],
      },
      {
        id: "B",
        title: "Section B — 의문문 대화",
        instructionKo: instrB,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["B1", "B2"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "walk.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeRun() {
  const instrA =
    "다음 문장에서 「be동사 + not」을 찾아 동그라미 하세요. 빈칸에 be동사와 not을 함께 쓰세요. (줄임말은 isn't, aren't도 가능)";
  const instrB =
    "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. Yes 또는 No를 골라 누르세요.";

  const runA = [
    ["I am not a dancer.", "am not", true],
    ["You are not a teacher.", "are not"],
    ["He is not a nurse.", "is not"],
    ["She is not a singer.", "is not"],
    ["We are not farmers.", "are not"],
    ["You are not students.", "are not"],
    ["They are not cooks.", "are not"],
    ["It is not my kitten.", "is not"],
    ["They are not pears.", "are not"],
    ["I am not his friend.", "am not"],
  ];

  const runB = [
    ["A: Are you Sam?  B: ( Yes / No ), I'm not.", "No", true],
    ["A: Is he strong?  B: ( Yes / No ), he is.", "Yes"],
    ["A: Is she pretty?  B: ( Yes / No ), she isn't.", "No"],
    ["A: Is it delicious?  B: ( Yes / No ), it is.", "Yes"],
    ["A: Are they kind?  B: ( Yes / No ), they aren't.", "No"],
    ["A: Are they sour?  B: ( Yes / No ), they are.", "Yes"],
    ["A: Are you his sisters?  B: ( Yes / No ), we are.", "Yes"],
    ["A: Is he your father?  B: ( Yes / No ), he isn't.", "No"],
    ["A: Is she your mother?  B: ( Yes / No ), she is.", "Yes"],
    ["A: Are they your uncles?  B: ( Yes / No ), they aren't.", "No"],
  ];

  const items = [];
  runA.forEach(([prompt, ans], i) => {
    const ex = i === 0;
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, prompt, [ans], {
        sectionInstructionKo: instrA,
        ...(ex
          ? { example: true, displayOnly: true, exampleAnswer: ans }
          : {}),
      })
    );
  });
  runB.forEach(([prompt, ans], i) => {
    const ex = i === 0;
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, prompt, ["Yes", "No"], ans, {
        sectionInstructionKo: instrB,
        ...(ex
          ? { example: true, displayOnly: true, exampleAnswer: ans }
          : {}),
      })
    );
  });

  const practice = {
    practiceId: "r1:u09:run",
    title: "Grammar Run",
    subtitle: "be + not 찾기 · Yes/No (p. 142–143)",
    pages: "142–143",
    timerMinutes: 18,
    introKo: "Section A 9문항(be+not 쓰기), Section B 9문항(Yes/No 고르기)입니다. 각각 예시 1개.",
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
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const instrB = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

  const jumpA = [
    ["I ( am not / not am ) lazy.", ["am not", "not am"], "am not", true],
    ["You ( are not / not are ) fast.", ["are not", "not are"], "are not"],
    ["She ( is not / not is ) slow.", ["is not", "not is"], "is not"],
    ["It ( is not / not is ) sweet.", ["is not", "not is"], "is not"],
    ["We ( are not / not are ) hungry.", ["are not", "not are"], "are not"],
    ["You ( isn't / aren't ) brothers.", ["isn't", "aren't"], "aren't"],
    ["They ( isn't / aren't ) happy.", ["isn't", "aren't"], "aren't"],
    ["He ( isn't / aren't ) weak.", ["isn't", "aren't"], "isn't"],
    ["They ( isn't / aren't ) peaches.", ["isn't", "aren't"], "aren't"],
    ["( I amn't / I'm not ) John.", ["I amn't", "I'm not"], "I'm not"],
  ];

  const jumpB = [
    ["A: ( Are / Is ) you a dancer?  B: Yes, I am.", ["Are", "Is"], "Are", true],
    ["A: ( Am / Is ) she your mother?  B: No, she isn't.", ["Am", "Is"], "Is"],
    ["A: ( Is / Are ) he your friend?  B: Yes, he is.", ["Is", "Are"], "Is"],
    ["A: ( Is / Are ) it your pencil case?  B: No, it isn't.", ["Is", "Are"], "Is"],
    ["A: ( Am / Are ) you police officers?  B: Yes, we are.", ["Am", "Are"], "Are"],
    ["A: Are they your aunts?  B: Yes, ( they are / we are ).", ["they are", "we are"], "they are"],
    ["A: Are you hungry?  B: No, ( you aren't / I'm not ).", ["you aren't", "I'm not"], "I'm not"],
    ["A: Is he thin?  B: No, ( it isn't / he isn't ).", ["it isn't", "he isn't"], "he isn't"],
    ["A: Is it your pet?  B: Yes, ( it is / they are ).", ["it is", "they are"], "it is"],
    ["A: Are they your balls?  B: No, ( you aren't / they aren't ).", ["you aren't", "they aren't"], "they aren't"],
  ];

  const items = [];
  jumpA.forEach(([prompt, choices, ans], i) => {
    const ex = i === 0;
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, prompt, choices, ans, {
        sectionInstructionKo: instrA,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
      })
    );
  });
  jumpB.forEach(([prompt, choices, ans], i) => {
    const ex = i === 0;
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, prompt, choices, ans, {
        sectionInstructionKo: instrB,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
      })
    );
  });

  const practice = {
    practiceId: "r1:u09:jump",
    title: "Grammar Jump",
    subtitle: "부정문 · 의문문 고르기 (p. 144–145)",
    pages: "144–145",
    timerMinutes: 18,
    introKo: "Section A 9문항, Section B 9문항(각 예시 1개). 괄호 안에서 알맞은 말을 골라 누르세요.",
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
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "jump.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeFly() {
  const instrA =
    "다음 문장을 부정문으로 바꿀 때, 빈칸에 알맞은 말을 쓰세요. be동사와 not을 각각 쓰거나 isn't, aren't 같은 줄임말을 쓸 수 있습니다.";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";

  const flyA = [
    ["I am cold. → I ___ ___ cold.", ["am|not", "am not"], true, "am not"],
    ["You are smart. → You ___ ___ smart.", ["are|not", "are not"]],
    ["She is pretty. → She ___ ___ pretty.", ["is|not", "is not"]],
    ["He is handsome. → He ___ ___ handsome.", ["is|not", "is not"]],
    ["They are kind. → They ___ ___ kind.", ["are|not", "are not"]],
    ["It is delicious. → It ___ delicious.", ["isn't", "is not"], true, "isn't"],
    ["They are sour. → They ___ ___ sour.", ["are|not", "aren't", "are not"]],
    ["He is my father. → He ___ ___ my father.", ["is|not", "isn't", "is not"]],
    ["They are my crayons. → They ___ ___ my crayons.", ["are|not", "aren't", "are not"]],
    ["We are hungry. → We ___ ___ hungry.", ["are|not", "aren't", "are not"]],
  ];

  const flyB = [
    ["A: ___ you his sister?  B: Yes, I am.", ["Are"], true, "Are"],
    ["A: ___ he your grandpa?  B: No, he isn't.", ["Is"]],
    ["A: ___ she a farmer?  B: Yes, she is.", ["Is"]],
    ["A: ___ they your teachers?  B: No, they aren't.", ["Are"]],
    ["A: ___ it her backpack?  B: Yes, it is.", ["Is"]],
    ["A: Are you students?  B: Yes, ___ ___.", ["we|are", "we are"], true, "we are"],
    ["A: Is she your aunt?  B: No, ___ ___.", ["she|isn't", "she isn't", "she is not"]],
    ["A: Is he your uncle?  B: Yes, ___ ___.", ["he|is", "he is"]],
    ["A: Is it your ticket?  B: No, ___ ___.", ["it|isn't", "it isn't", "it is not"]],
    ["A: Are they your shoes?  B: Yes, ___ ___.", ["they|are", "they are"]],
  ];

  const items = [];
  flyA.forEach((row, i) => {
    const [prompt, accept, ex, exAns] = row;
    const blanks = accept[0].includes("|") ? 2 : 1;
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, prompt, accept, {
        sectionInstructionKo: instrA,
        blanks,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: exAns } : {}),
      })
    );
  });
  flyB.forEach((row, i) => {
    const [prompt, accept, ex, exAns] = row;
    const blanks = accept[0].includes("|") ? 2 : 1;
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, prompt, accept, {
        sectionInstructionKo: instrB,
        blanks,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: exAns } : {}),
      })
    );
  });

  const practice = {
    practiceId: "r1:u09:fly",
    title: "Grammar Fly",
    subtitle: "부정문 · 의문문 쓰기 (p. 146–147)",
    pages: "146–147",
    timerMinutes: 20,
    introKo:
      "Section A 8문항(부정문 바꾸기), Section B 8문항(대화 빈칸)입니다. 각 섹션 예시 1개.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 8,
        exampleCount: 1,
        labels: ["A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 8,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. (QUIZ 2 — be동사 부정문 표, p. 148)";
  const items = [
    fillItem(
      "q01",
      "A",
      "1",
      "You — 줄임 부정: You ___ ~.",
      ["aren't", "are not"],
      {
        sectionInstructionKo: instr,
        promptKo: "표 ① You · 줄임 부정 열 (예시)",
        example: true,
        displayOnly: true,
        exampleAnswer: "aren't",
      }
    ),
    fillItem("q02", "A", "2", "She — 부정문: She is ___ ~.", ["not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ② She · 부정문 열",
    }),
    fillItem("q03", "A", "3", "It — 줄임 부정: It ___ ~.", ["isn't", "is not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ③ It · 줄임 부정 열",
    }),
    fillItem("q04", "A", "4", "You(복수) — 부정문: You ___ ___ ~.", ["are|not", "are not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ④ You(복수) · 부정문 열",
      blanks: 2,
    }),
    fillItem("q05", "A", "5", "They — 줄임 부정: They ___ ~.", ["aren't", "are not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ⑤ They · 줄임 부정 열",
    }),
  ];

  const practice = {
    practiceId: "r1:u09:quiz2",
    title: "QUIZ 2 — be동사 부정문 표",
    subtitle: "p. 148",
    pages: "148",
    timerMinutes: 12,
    introKo: "4문항(예시 1개). 표의 빈칸에 들어갈 말만 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 4,
        exampleCount: 1,
        labels: ["2", "3", "4", "5"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. (QUIZ 4 — be동사 의문문 표, p. 149)";
  const items = [
    fillItem(
      "q01",
      "A",
      "1",
      "Are you ~? — 긍정 대답: Yes, ___ ___.",
      ["I|am", "I am"],
      {
        sectionInstructionKo: instr,
        promptKo: "표 ① Are you? · 긍정 대답 (예시)",
        blanks: 2,
        example: true,
        displayOnly: true,
        exampleAnswer: "I am",
      }
    ),
    fillItem("q02", "A", "2", "Is he ~? — 부정 대답: No, he ___.", ["isn't", "is not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ② Is he? · 부정 대답",
    }),
    fillItem("q03", "A", "3", "의문문: ___ she ~?", ["Is"], {
      sectionInstructionKo: instr,
      promptKo: "표 ③ she · 의문문",
    }),
    fillItem("q04", "A", "4", "의문문: ___ it ~?", ["Is"], {
      sectionInstructionKo: instr,
      promptKo: "표 ④ it · 의문문",
    }),
    fillItem("q05", "A", "5", "Is it ~? — 긍정 대답: Yes, it ___.", ["is"], {
      sectionInstructionKo: instr,
      promptKo: "표 ⑤ Is it? · 긍정 대답",
    }),
    fillItem("q06", "A", "6", "Are we ~? — 부정 대답: No, you ___.", ["aren't", "are not"], {
      sectionInstructionKo: instr,
      promptKo: "표 ⑥ Are we? · 부정 대답",
    }),
    fillItem("q07", "A", "7", "Are you ~? — 긍정 대답: Yes, ___ ___.", ["we|are", "we are"], {
      sectionInstructionKo: instr,
      promptKo: "표 ⑦ Are you(복수)? · 긍정 대답",
      blanks: 2,
    }),
    fillItem("q08", "A", "8", "의문문: ___ they ~?", ["Are"], {
      sectionInstructionKo: instr,
      promptKo: "표 ⑧ they · 의문문",
    }),
  ];

  const practice = {
    practiceId: "r1:u09:quiz4",
    title: "QUIZ 4 — be동사 의문문 표",
    subtitle: "p. 149",
    pages: "149",
    timerMinutes: 12,
    introKo: "7문항(예시 1개). 표의 빈칸에 들어갈 말만 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz4.json"), JSON.stringify(practice, null, 2) + "\n");
}

writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz2();
writeQuiz4();
console.log("Wrote", OUT);
