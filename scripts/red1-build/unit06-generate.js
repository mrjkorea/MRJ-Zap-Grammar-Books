/* Generate data/red1/unit06/*.json — RedZap 1 Unit 06 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit06");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-06",
  unitTitle: "Unit 06 — 인칭대명사의 주격과 목적격",
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

/** Circle-in-sentence MC: options are the sentence's own words, in book order. */
function sentenceWordChoices(sentence, correct) {
  const choices = sentence.trim().split(/\s+/);
  const idx = choices.findIndex(
    (w) => w === correct || w.replace(/[.,!?;:]$/, "") === correct
  );
  if (idx < 0) {
    throw new Error(`Answer "${correct}" not in sentence: ${sentence}`);
  }
  return { choices, accept: String(idx + 1) };
}

function walkItemNum(left) {
  const m = String(left).match(/^(\d+)\./);
  return m ? m[1] : String(left);
}

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 인칭대명사의 주격을 따라 써 보세요. 문장과 알맞은 주격을 짝지어 연결하세요.";
  const instrB =
    "다음 문장의 뜻을 생각하며 인칭대명사의 목적격을 따라 써 보세요. 문장과 알맞은 목적격을 짝지어 연결하세요.";

  const walkA = [
    ["1. _____ am happy.", "I"],
    ["2. _____ are happy.", "You"],
    ["3. _____ is sad.", "He"],
    ["4. _____ is sad.", "She"],
    ["5. _____ is thin.", "It"],
    ["6. _____ are thin.", "We"],
    ["7. _____ are lazy.", "They"],
    ["8. _____ are lazy.", "You"],
    ["9. _____ is diligent.", "She"],
    ["10. _____ is diligent.", "He"],
  ];

  const walkB = [
    ["I like _____.", "you"],
    ["I like _____.", "him"],
    ["You like _____.", "her"],
    ["You like _____.", "me"],
    ["They love _____.", "it"],
    ["They love _____.", "us"],
    ["We love _____.", "you"],
    ["We visit _____ every day.", "them"],
    ["The students visit _____ every day.", "him"],
    ["The students visit _____ every day.", "her"],
  ];

  const items = [];
  chunk(walkA, 7).forEach((g, gi) => {
    const pairs = g.map(([left, right]) => ({ left, right }));
    items.push(
      matchItem(`a${String(gi + 1).padStart(2, "0")}`, "A", `A${gi + 1}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: `문장 ${walkItemNum(g[0][0])}–${walkItemNum(g[g.length - 1][0])}`,
      })
    );
  });

  chunk(walkB, 7).forEach((g, gi) => {
    const pairs = g.map(([left, right], idx) => ({
      left: `${gi * 7 + idx + 1}. ${left}`,
      right,
    }));
    items.push(
      matchItem(`b${String(gi + 1).padStart(2, "0")}`, "B", `B${gi + 1}`, pairs, {
        sectionInstructionKo: instrB,
        promptKo: `문장 ${gi * 7 + 1}–${gi * 7 + g.length}`,
      })
    );
  });

  const practice = {
    practiceId: "r1:u06:walk",
    title: "Grammar Walk",
    subtitle: "주격·목적격 따라쓰기 (p. 90–91)",
    pages: "90–91",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(주격 짝 맞추기 10쌍), Section B 2문항(목적격 짝 맞추기 10쌍)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — 주격",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["A1", "A2"],
      },
      {
        id: "B",
        title: "Section B — 목적격",
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
    "다음 문장에서 인칭대명사의 주격을 찾아 동그라미 하세요. 주격인 말을 골라 누르세요.";
  const instrB =
    "다음 문장에서 인칭대명사의 목적격을 찾아 동그라미 하세요. 목적격인 말을 골라 누르세요.";

  const runA = [
    ["I am a doctor.", "I"],
    ["You are a doctor.", "You"],
    ["She is a singer.", "She"],
    ["He is a singer.", "He"],
    ["We are farmers.", "We"],
    ["They are farmers.", "They"],
    ["It is a pig.", "It"],
    ["They are pigs.", "They"],
    ["She is a teacher.", "She"],
    ["You are teachers.", "You"],
  ];

  const runB = [
    ["I meet her every day.", "her"],
    ["I meet them every day.", "them"],
    ["They know you.", "you"],
    ["They know me.", "me"],
    ["You like it.", "it"],
    ["You like us.", "us"],
    ["We love them.", "them"],
    ["We love him.", "him"],
    ["The nurses visit me every day.", "me"],
    ["The nurses visit her every day.", "her"],
  ];

  const items = [];
  runA.forEach((row, i) => {
    const n = i + 1;
    const label = `A${n}`;
    const id = `a${String(n).padStart(2, "0")}`;
    const { choices, accept } = sentenceWordChoices(row[0], row[1]);
    const extra = { sectionInstructionKo: instrA };
    if (n === 1) {
      items.push({
        ...mcItem(id, "A", label, row[0], choices, accept, extra),
        example: true,
        displayOnly: true,
        exampleAnswer: row[1],
      });
    } else {
      items.push(mcItem(id, "A", label, row[0], choices, accept, extra));
    }
  });

  runB.forEach((row, i) => {
    const n = i + 1;
    const label = `B${n}`;
    const id = `b${String(n).padStart(2, "0")}`;
    const { choices, accept } = sentenceWordChoices(row[0], row[1]);
    const extra = { sectionInstructionKo: instrB };
    if (n === 1) {
      items.push({
        ...mcItem(id, "B", label, row[0], choices, accept, extra),
        example: true,
        displayOnly: true,
        exampleAnswer: row[1],
      });
    } else {
      items.push(mcItem(id, "B", label, row[0], choices, accept, extra));
    }
  });

  const practice = {
    practiceId: "r1:u06:run",
    title: "Grammar Run",
    subtitle: "주격·목적격 찾기 (p. 92–93)",
    pages: "92–93",
    timerMinutes: 20,
    introKo: "Section A 10문항(주격 고르기), B 10문항(목적격 고르기)입니다. 예시 2개는 채점하지 않습니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: runA.slice(1).map((_, i) => `A${i + 2}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: runB.slice(1).map((_, i) => `B${i + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const instrB = instrA;

  const jumpA = [
    { prompt: "( Me / I ) am weak.", choices: ["Me", "I"], accept: "2" },
    { prompt: "( You / Him ) are strong.", choices: ["You", "Him"], accept: "1" },
    { prompt: "( She / Her ) is a nurse.", choices: ["She", "Her"], accept: "1" },
    { prompt: "( Him / He ) is a cook.", choices: ["Him", "He"], accept: "2" },
    { prompt: "( It / Us ) is a giraffe.", choices: ["It", "Us"], accept: "1" },
    { prompt: "( Them / They ) are wolves.", choices: ["Them", "They"], accept: "2" },
    { prompt: "( Us / We ) have lunch every day.", choices: ["Us", "We"], accept: "2" },
    { prompt: "( I / Me ) play baseball every day.", choices: ["I", "Me"], accept: "1" },
    { prompt: "( Her / You ) have dinner every day.", choices: ["Her", "You"], accept: "2" },
    { prompt: "( They / Them ) play baseball every day.", choices: ["They", "Them"], accept: "1" },
  ];

  const jumpB = [
    { prompt: "You love ( I / me ).", choices: ["I", "me"], accept: "2" },
    { prompt: "I love ( them / they ).", choices: ["them", "they"], accept: "1" },
    { prompt: "They know ( he / him ).", choices: ["he", "him"], accept: "2" },
    { prompt: "We know ( her / she ).", choices: ["her", "she"], accept: "1" },
    { prompt: "I meet ( we / you ) every week.", choices: ["we", "you"], accept: "2" },
    { prompt: "I meet ( him / he ) every week.", choices: ["him", "he"], accept: "1" },
    { prompt: "The children like ( him / he ).", choices: ["him", "he"], accept: "1" },
    { prompt: "The girls like ( we / us ).", choices: ["we", "us"], accept: "2" },
    { prompt: "The men visit ( they / them ) every week.", choices: ["they", "them"], accept: "2" },
    { prompt: "The women visit ( you / she ) every week.", choices: ["you", "she"], accept: "1" },
  ];

  const items = [];
  jumpA.forEach((row, i) => {
    const n = i + 1;
    const label = `A${n}`;
    const id = `a${String(n).padStart(2, "0")}`;
    const extra = { sectionInstructionKo: instrA };
    if (n === 1) {
      items.push({
        ...mcItem(id, "A", label, row.prompt, row.choices, row.accept, extra),
        example: true,
        displayOnly: true,
        exampleAnswer: row.choices[Number(row.accept) - 1],
      });
    } else {
      items.push(mcItem(id, "A", label, row.prompt, row.choices, row.accept, extra));
    }
  });

  jumpB.forEach((row, i) => {
    const n = i + 1;
    const label = `B${n}`;
    const id = `b${String(n).padStart(2, "0")}`;
    const extra = { sectionInstructionKo: instrB };
    if (n === 1) {
      items.push({
        ...mcItem(id, "B", label, row.prompt, row.choices, row.accept, extra),
        example: true,
        displayOnly: true,
        exampleAnswer: row.choices[Number(row.accept) - 1],
      });
    } else {
      items.push(mcItem(id, "B", label, row.prompt, row.choices, row.accept, extra));
    }
  });

  const practice = {
    practiceId: "r1:u06:jump",
    title: "Grammar Jump",
    subtitle: "주격·목적격 고르기 (p. 94–95)",
    pages: "94–95",
    timerMinutes: 15,
    introKo: "Section A 10문항, B 10문항(괄호 안에서 고르기). 예시 2개는 채점하지 않습니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: jumpA.slice(1).map((_, i) => `A${i + 2}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: jumpB.slice(1).map((_, i) => `B${i + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "jump.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeFly() {
  const instrA =
    "다음 괄호 안의 단어를 사용하여 빈칸에 알맞은 말을 쓰세요. 주격 한 단어만 쓰세요.";
  const instrB =
    "다음 괄호 안의 단어를 사용하여 빈칸에 알맞은 말을 쓰세요. 목적격 한 단어만 쓰세요.";

  const flyA = [
    ["_____ am cute. ( me )", "I"],
    ["_____ are tall. ( them )", "They"],
    ["_____ are smart. ( us )", "We"],
    ["_____ is short. ( him )", "He"],
    ["_____ is young. ( her )", "She"],
    ["_____ is an iguana. ( it )", "It"],
    ["_____ is a singer. ( her )", "She"],
    ["_____ play the violin. ( you )", "You"],
    ["_____ play tennis. ( them )", "They"],
    ["_____ have dinner. ( me )", "I"],
  ];

  const flyB = [
    ["I like _____. ( he )", "him"],
    ["You love _____. ( she )", "her"],
    ["We like _____. ( you )", "you"],
    ["They visit _____ every week. ( we )", "us"],
    ["You know _____. ( I )", "me"],
    ["The teachers know _____. ( he )", "him"],
    ["The singers love _____. ( it )", "it"],
    ["The nurses know _____. ( they )", "them"],
    ["The farmers like _____. ( I )", "me"],
    ["The doctors visit _____ every week. ( you )", "you"],
  ];

  const items = [];
  flyA.forEach((row, i) => {
    const n = i + 1;
    const base = fillItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, row[0], row[1], {
      sectionInstructionKo: instrA,
    });
    if (n === 1) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1];
    }
    items.push(base);
  });

  flyB.forEach((row, i) => {
    const n = i + 1;
    const base = fillItem(`b${String(n).padStart(2, "0")}`, "B", `B${n}`, row[0], row[1], {
      sectionInstructionKo: instrB,
    });
    if (n === 1) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1];
    }
    items.push(base);
  });

  const practice = {
    practiceId: "r1:u06:fly",
    title: "Grammar Fly",
    subtitle: "주격·목적격 쓰기 (p. 96–97)",
    pages: "96–97",
    timerMinutes: 15,
    introKo: "Section A 10문항(주격), B 10문항(목적격)입니다. 예시 2개는 채점하지 않습니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: flyA.slice(1).map((_, i) => `A${i + 2}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: flyB.slice(1).map((_, i) => `B${i + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 주격 한 단어만 쓰세요.";
  const rows = [
    ["2인칭 단수 (너는)", "you"],
    ["3인칭 단수 남 (그는)", "he"],
    ["3인칭 복수 (그들은, 그것들은)", "they"],
  ];
  const items = rows.map((row, i) => {
    const n = i + 1;
    return fillItem(`q${String(n).padStart(2, "0")}`, "A", String(n), `표 ( ${n} )`, row[1], {
      sectionInstructionKo: instr,
      promptKo: row[0],
    });
  });
  const practice = {
    practiceId: "r1:u06:quiz2",
    title: "QUIZ 2 — 주격 표",
    subtitle: "p. 98",
    pages: "98",
    timerMinutes: 10,
    introKo: "QUIZ 2: 주격 표 빈칸 3문항입니다. 만화 1번은 복습용(채점 없음).",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 3,
        exampleCount: 0,
        labels: ["1", "2", "3"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 목적격 한 단어만 쓰세요.";
  const rows = [
    ["1인칭 단수 (나를)", "me"],
    ["1인칭 복수 (우리들을)", "us"],
    ["3인칭 단수 여 (그녀를)", "her"],
  ];
  const items = rows.map((row, i) => {
    const n = i + 1;
    const base = fillItem(`q${String(n).padStart(2, "0")}`, "A", String(n), `표 ( ${n} )`, row[1], {
      sectionInstructionKo: instr,
      promptKo: row[0],
    });
    if (n === 1) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1];
    }
    return base;
  });
  const practice = {
    practiceId: "r1:u06:quiz4",
    title: "QUIZ 4 — 목적격 표",
    subtitle: "p. 99",
    pages: "99",
    timerMinutes: 10,
    introKo: "QUIZ 4: 목적격 표 빈칸 3문항입니다. 만화 3번은 복습용(채점 없음). 예시 1개.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 2,
        exampleCount: 1,
        labels: ["2", "3"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz4.json"), JSON.stringify(practice, null, 2) + "\n");
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz2();
writeQuiz4();
console.log("Wrote RedZap 1 Unit 06 to", OUT);
