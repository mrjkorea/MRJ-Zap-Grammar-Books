/* Generate data/red1/unit04/*.json — RedZap 1 Unit 04 관사 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit04");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-04",
  unitTitle: "Unit 04 — 관사",
  sectionsVersion: 1,
};

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
    accept: Array.isArray(accept) ? accept : [accept],
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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** p.58–59 footer Korean where printed; else English keyword (Walk A) or standard 뜻 (Walk B). */
const WALK_A_KO = {
  rabbit: "토끼",
  apple: "사과",
  iguana: "이구아나",
  orange: "오렌지",
  umbrella: "우산",
};

const WALK_B_KO = {
  girl: "여자아이",
  man: "남자",
  sun: "태양",
  moon: "달",
  dog: "개",
  cat: "고양이",
  rabbit: "토끼",
  piano: "피아노",
  violin: "바이올린",
  drum: "북",
};

function walkLeftA(english) {
  return WALK_A_KO[english] || english;
}

function walkLeftB(english) {
  return WALK_B_KO[english] || english;
}

function writeWalk() {
  const instrA =
    "다음 단어의 뜻을 생각하며 부정관사 a와 an을 따라 써 보세요. 단어(뜻)와 알맞은 a/an 표현을 짝지어 연결하세요.";
  const instrB =
    "다음 문장의 뜻을 생각하며 정관사 the를 따라 써 보세요. 우리말 뜻(단어)과 완성된 영어 문장을 짝지어 연결하세요.";

  const aNouns = [
    ["book", "a book"],
    ["pencil", "a pencil"],
    ["cup", "a cup"],
    ["rabbit", "a rabbit"],
    ["dog", "a dog"],
    ["apple", "an apple"],
    ["egg", "an egg"],
    ["iguana", "an iguana"],
    ["orange", "an orange"],
    ["umbrella", "an umbrella"],
  ];

  const bPairs = [
    ["girl", "Look at the girl."],
    ["man", "Look at the man."],
    ["sun", "Look at the sun."],
    ["moon", "Look at the moon."],
    ["dog", "The dog is cute."],
    ["cat", "The cat is cute."],
    ["rabbit", "The rabbit is cute."],
    ["piano", "I play the piano."],
    ["violin", "I play the violin."],
    ["drum", "I play the drum."],
  ];

  const items = [];
  let n = 1;
  for (const group of chunk(aNouns, 5)) {
    const pairs = group.map(([en, right]) => ({ left: walkLeftA(en), right }));
    items.push(
      matchItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: group.map((g) => walkLeftA(g[0])).join(", "),
      })
    );
    n++;
  }
  let m = 1;
  for (const group of chunk(bPairs, 7)) {
    const pairs = group.map(([en, right]) => ({ left: walkLeftB(en), right }));
    items.push(
      matchItem(`b${String(m).padStart(2, "0")}`, "B", `B${m}`, pairs, {
        sectionInstructionKo: instrB,
        promptKo: group.map((g) => walkLeftB(g[0])).join(", "),
      })
    );
    m++;
  }

  const practice = {
    practiceId: "r1:u04:walk",
    title: "Grammar Walk",
    subtitle: "a/an · the 따라쓰기 (p. 58–59)",
    pages: "58–59",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(단어·a/an 문장 짝 맞추기), Section B 2문항(단어·the 문장 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — a/an",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["A1", "A2"],
      },
      {
        id: "B",
        title: "Section B — the",
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
    "다음 문장에서 부정관사 a, an을 찾아 동그라미 하세요. 동그라미 친 관사만 빈칸에 쓰세요.";
  const instrB =
    "다음 문장에서 정관사 the를 찾아 동그라미 하세요. 동그라미 친 the만 빈칸에 쓰세요.";

  const runA = [
    ["I am a boy.", "a", true],
    ["I am a girl.", "a"],
    ["I am a woman.", "a"],
    ["You are a teacher.", "a"],
    ["You are a singer.", "a"],
    ["You are an actor.", "an"],
    ["It is an apple.", "an"],
    ["It is an orange.", "an"],
    ["It is an umbrella.", "an"],
    ["It is an egg.", "an"],
  ];

  const runB = [
    ["Look at the sun.", "the", true],
    ["Look at the moon.", "the"],
    ["The boy is happy.", "the"],
    ["The girl is happy.", "the"],
    ["The man is happy.", "the"],
    ["I like the book.", "the"],
    ["I like the city.", "the"],
    ["I like the monkey.", "the"],
    ["They play the piano.", "the"],
    ["They play the drum.", "the"],
  ];

  const items = [];
  runA.forEach((row, i) => {
    const n = i + 1;
    const it = fillItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, row[0], [row[1]], {
      sectionInstructionKo: instrA,
    });
    if (row[2]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  runB.forEach((row, i) => {
    const n = i + 1;
    const it = fillItem(`b${String(n).padStart(2, "0")}`, "B", `B${n}`, row[0], [row[1]], {
      sectionInstructionKo: instrB,
    });
    if (row[2]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });

  const practice = {
    practiceId: "r1:u04:run",
    title: "Grammar Run",
    subtitle: "a/an · the 찾기 (p. 60–61)",
    pages: "60–61",
    timerMinutes: 20,
    introKo: "Section A 9문항(a/an 쓰기), Section B 9문항(the 쓰기)입니다.",
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
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
  const instrB = instrA;

  const jumpA = [
    ["I am ( a / an ) singer.", ["a", "an"], "1", true],
    ["I am ( a / an ) doctor.", ["a", "an"], "1"],
    ["You are ( a / an ) actor.", ["a", "an"], "2"],
    ["You are ( a / an ) nurse.", ["a", "an"], "1"],
    ["It is ( a / an ) onion.", ["a", "an"], "2"],
    ["It is ( a / an ) ant.", ["a", "an"], "2"],
    ["That is ( a / an ) desk.", ["a", "an"], "1"],
    ["It is ( a / an ) eraser.", ["a", "an"], "2"],
    ["It is ( a / an ) iguana.", ["a", "an"], "2"],
    ["It is ( a / an ) book.", ["a", "an"], "1"],
  ];

  const jumpB = [
    ["Look at ( a book / the book ).", ["a book", "the book"], "2", true],
    ["Look at ( a sky / the sky ).", ["a sky", "the sky"], "2"],
    ["It is ( a moon / the moon ).", ["a moon", "the moon"], "2"],
    ["This is ( a sun / the sun ).", ["a sun", "the sun"], "2"],
    ["I play ( a violin / the violin ).", ["a violin", "the violin"], "2"],
    ["You play ( a piano / the piano ).", ["a piano", "the piano"], "2"],
    ["We play ( soccer / the soccer ).", ["soccer", "the soccer"], "1"],
    ["I have ( lunch / the lunch ).", ["lunch", "the lunch"], "1"],
    ["They play ( tennis / the tennis ).", ["tennis", "the tennis"], "1"],
    ["We have ( dinner / the dinner ).", ["dinner", "the dinner"], "1"],
  ];

  const items = [];
  jumpA.forEach((row, i) => {
    const n = i + 1;
    const it = mcItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, row[0], row[1], [row[2], row[1][Number(row[2]) - 1]], {
      sectionInstructionKo: instrA,
    });
    if (row[3]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1][Number(row[2]) - 1];
    }
    items.push(it);
  });
  jumpB.forEach((row, i) => {
    const n = i + 1;
    const it = mcItem(`b${String(n).padStart(2, "0")}`, "B", `B${n}`, row[0], row[1], [row[2], row[1][Number(row[2]) - 1]], {
      sectionInstructionKo: instrB,
    });
    if (row[3]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1][Number(row[2]) - 1];
    }
    items.push(it);
  });

  const practice = {
    practiceId: "r1:u04:jump",
    title: "Grammar Jump",
    subtitle: "a/an · the 고르기 (p. 62–63)",
    pages: "62–63",
    timerMinutes: 15,
    introKo: "Section A 9문항(a/an), Section B 9문항(the·관사 없음)입니다.",
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
  const instrA = "다음 문장의 빈칸에 a나 an 중 알맞은 것을 쓰세요. 관사만 쓰세요.";
  const instrB =
    "다음 빈칸에 the가 필요하면 the를 쓰고, 필요하지 않으면 X표를 하세요. 빈칸에 들어갈 말만 쓰세요.";

  const flyA = [
    ["I am ___ teacher.", "a", true],
    ["He is ___ boy.", "a"],
    ["She is ___ doctor.", "a"],
    ["It is ___ egg.", "an"],
    ["I have ___ cat.", "a"],
    ["I have ___ iguana.", "an"],
    ["You have ___ apple.", "an"],
    ["You have ___ umbrella.", "an"],
    ["It is ___ orange.", "an"],
    ["It is ___ pen.", "a"],
  ];

  const flyB = [
    ["Look at ___ singer.", "the", true],
    ["Look at ___ fish.", "the"],
    ["Look at ___ dog.", "the"],
    ["Look at ___ sun.", "the"],
    ["Look at ___ moon.", "the"],
    ["I play ___ tennis.", ["X", "x", "×"]],
    ["I have ___ breakfast.", ["X", "x", "×"]],
    ["You play ___ piano.", "the"],
    ["You play ___ soccer.", ["X", "x", "×"]],
    ["You have ___ lunch.", ["X", "x", "×"]],
  ];

  const items = [];
  flyA.forEach((row, i) => {
    const n = i + 1;
    const it = fillItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, row[0], [row[1]], {
      sectionInstructionKo: instrA,
    });
    if (row[2]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  flyB.forEach((row, i) => {
    const n = i + 1;
    const acc = Array.isArray(row[1]) ? row[1] : [row[1]];
    const it = fillItem(`b${String(n).padStart(2, "0")}`, "B", `B${n}`, row[0], acc, {
      sectionInstructionKo: instrB,
    });
    if (row[2]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = acc[0];
    }
    items.push(it);
  });

  const practice = {
    practiceId: "r1:u04:fly",
    title: "Grammar Fly",
    subtitle: "a/an · the/X (p. 64–65)",
    pages: "64–65",
    timerMinutes: 15,
    introKo: "Section A 9문항(a/an), Section B 9문항(the 또는 X)입니다.",
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
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr = "다음 중 알맞은 말에 체크표 하세요. 보기 중 하나를 골라 누르세요.";
  const rows = [
    ["a pig", "an pig", "1", true],
    ["a book", "an book", "1"],
    ["a apple", "an apple", "2"],
    ["a umbrella", "an umbrella", "2"],
    ["a woman", "an woman", "1"],
    ["a lemon", "an lemon", "1"],
    ["a egg", "an egg", "2"],
    ["a zebra", "an zebra", "1"],
    ["a tomato", "an tomato", "1"],
    ["a orange", "an orange", "2"],
  ];
  const items = rows.map((row, i) => {
    const n = i + 1;
    const choices = row.slice(0, 2);
    const it = mcItem(
      `q${String(n).padStart(2, "0")}`,
      "A",
      String(n),
      `${n}. ( ${choices[0]} / ${choices[1]} )`,
      choices,
      [row[2], choices[Number(row[2]) - 1]],
      { sectionInstructionKo: instr }
    );
    if (row[3]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = choices[Number(row[2]) - 1];
    }
    return it;
  });

  const practice = {
    practiceId: "r1:u04:quiz2",
    title: "QUIZ 2 — a/an",
    subtitle: "p. 66",
    pages: "66",
    timerMinutes: 12,
    introKo: "10문항(예시 1개). a와 an 중 알맞은 표현을 고르세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr = "다음 중 알맞은 말에 체크표 하세요. 보기 중 하나를 골라 누르세요.";
  const rows = [
    ["a sun", "the sun", "2", true],
    ["a moon", "the moon", "2"],
    ["a sky", "the sky", "2"],
    ["play violin", "play the violin", "2"],
    ["play tennis", "play the tennis", "1"],
    ["have lunch", "have the lunch", "1"],
    ["have breakfast", "have the breakfast", "1"],
    ["play soccer", "play the soccer", "1"],
    ["Look at boy.", "Look at the boy.", "2"],
    ["Look at dog.", "Look at the dog.", "2"],
  ];
  const items = rows.map((row, i) => {
    const n = i + 1;
    const choices = row.slice(0, 2);
    const it = mcItem(
      `q${String(n).padStart(2, "0")}`,
      "A",
      String(n),
      `${n}. ( ${choices[0]} / ${choices[1]} )`,
      choices,
      [row[2], choices[Number(row[2]) - 1]],
      { sectionInstructionKo: instr }
    );
    if (row[3]) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = choices[Number(row[2]) - 1];
    }
    return it;
  });

  const practice = {
    practiceId: "r1:u04:quiz4",
    title: "QUIZ 4 — the",
    subtitle: "p. 67",
    pages: "67",
    timerMinutes: 12,
    introKo: "10문항(예시 1개). the·관사 없음 중 알맞은 표현을 고르세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz4.json"), JSON.stringify(practice, null, 2) + "\n");
}

fs.mkdirSync(OUT, { recursive: true });
writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz2();
writeQuiz4();
console.log("Wrote Red 1 Unit 04 practices to", OUT);
