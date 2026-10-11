/* Generate data/red2/unit01/*.json — RedZap 2 Unit 01 일반동사 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit01");

const META = {
  bookId: "zap-red-2",
  bookTitle: "ZAP Red 2",
  appName: "RedZap 2",
  unitId: "unit-01",
  unitTitle: "Unit 01 — 일반동사",
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

/** Circle-the-verb Run: choices are the sentence's own words, in sentence order. */
function sentenceWordChoices(prompt, answer) {
  const text = String(prompt).replace(/\(([^)]+)\)/g, "$1").trim();
  const words = text.split(/\s+/).map((w) => w.replace(/^[("'"]+|[.,;:!?)'"]+$/g, ""));
  const norm = (w) => w.replace(/[.,;:!?]+$/g, "").toLowerCase();
  const ai = words.findIndex((w) => norm(w) === norm(answer));
  if (ai < 0) throw new Error(`answer "${answer}" not in sentence: ${prompt}`);
  return { choices: words, accept: String(ai + 1) };
}

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 일반동사의 현재형을 따라 써 보세요. 빈칸 문장과 알맞은 동사 원형을 짝지어 연결하세요.";
  const instrB =
    "다음 문장의 뜻을 생각하며 일반동사의 3인칭 단수 현재형을 따라 써 보세요. 빈칸 문장과 알맞은 동사 형태를 짝지어 연결하세요.";

  const walkA = [
    ["I _____ well.", "sing"],
    ["The birds _____ well.", "sing"],
    ["You _____ well.", "dance"],
    ["The monkeys _____ well.", "dance"],
    ["We _____ well.", "swim"],
    ["The wolves _____ well.", "swim"],
    ["I _____ math.", "like"],
    ["They _____ math.", "like"],
    ["The boys _____ tomatoes.", "have"],
    ["The boys _____ tomatoes. (10)", "have"],
  ];

  const walkB = [
    ["He _____ well.", "dances"],
    ["She _____ fast.", "swims"],
    ["Oscar _____ to school.", "goes"],
    ["His dad _____ math.", "teaches"],
    ["His mom _____ cars.", "fixes"],
    ["This bird _____ fast.", "flies"],
    ["That bird _____ well.", "sings"],
    ["A girl _____ a cat.", "has"],
    ["The cat _____ its face.", "washes"],
    ["It _____ fish.", "likes"],
  ];

  const items = [];
  items.push(
    matchItem(
      "a01",
      "A",
      "A1",
      walkA.slice(0, 5).map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrA, promptKo: "1–5" }
    )
  );
  items.push(
    matchItem(
      "a02",
      "A",
      "A2",
      walkA.slice(5).map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrA, promptKo: "6–10" }
    )
  );
  items.push(
    matchItem(
      "b01",
      "B",
      "B1",
      walkB.slice(0, 5).map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrB, promptKo: "1–5" }
    )
  );
  items.push(
    matchItem(
      "b02",
      "B",
      "B2",
      walkB.slice(5).map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrB, promptKo: "6–10" }
    )
  );

  const practice = {
    practiceId: "r2:u01:walk",
    title: "Grammar Walk",
    subtitle: "일반동사 현재형 따라쓰기 (p. 12–13)",
    pages: "12–13",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(현재형 10쌍), Section B 2문항(3인칭 단수 10쌍)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
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
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "walk.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeRun() {
  const instrA = "다음 문장에서 일반동사의 현재형을 찾아 동그라미 하세요. 일반동사만 골라 누르세요.";
  const instrB =
    "다음 문장에서 일반동사의 3인칭 단수 현재형을 찾아 동그라미 하세요. 3인칭 단수 현재형만 골라 누르세요.";

  const runA = [
    ["I (sing) every day.", "sing"],
    ["I run every day.", "run"],
    ["You hate grapes.", "hate"],
    ["You like grapes.", "like"],
    ["We go to school.", "go"],
    ["We come late.", "come"],
    ["They read books.", "read"],
    ["They write books.", "write"],
    ["Judy and I have dogs.", "have"],
    ["My brothers love dogs.", "love"],
  ];
  const runB = [
    ["He runs fast.", "runs"],
    ["She jumps high.", "jumps"],
    ["Mr. Obama teaches music.", "teaches"],
    ["Edna studies math.", "studies"],
    ["The bird flies slowly.", "flies"],
    ["It sings slowly.", "sings"],
    ["My dad washes the dishes.", "washes"],
    ["My mom fixes computers.", "fixes"],
    ["A farmer has five ducks.", "has"],
    ["The farmer hates foxes.", "hates"],
  ];
  const items = [];
  const [exA, ...restA] = runA;
  const mcA = sentenceWordChoices(exA[0], exA[1]);
  items.push(
    mcItem("a01", "A", "A1", exA[0], mcA.choices, mcA.accept, {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: exA[1],
    })
  );
  restA.forEach((row, i) => {
    const mc = sentenceWordChoices(row[0], row[1]);
    items.push(
      mcItem(`a${String(i + 2).padStart(2, "0")}`, "A", `A${i + 2}`, row[0], mc.choices, mc.accept, {
        sectionInstructionKo: instrA,
      })
    );
  });

  const [exB, ...restB] = runB;
  const mcB = sentenceWordChoices(exB[0], exB[1]);
  items.push(
    mcItem("b01", "B", "B1", exB[0], mcB.choices, mcB.accept, {
      sectionInstructionKo: instrB,
      example: true,
      displayOnly: true,
      exampleAnswer: exB[1],
    })
  );
  restB.forEach((row, i) => {
    const mc = sentenceWordChoices(row[0], row[1]);
    items.push(
      mcItem(`b${String(i + 2).padStart(2, "0")}`, "B", `B${i + 2}`, row[0], mc.choices, mc.accept, {
        sectionInstructionKo: instrB,
      })
    );
  });

  const practice = {
    practiceId: "r2:u01:run",
    title: "Grammar Run",
    subtitle: "일반동사 찾기 (p. 14–15)",
    pages: "14–15",
    timerMinutes: 20,
    introKo: "Section A 9문항, Section B 9문항(예시 각 1개)입니다. 문장에서 알맞은 동사 형태를 고르세요.",
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
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const instrB = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

  const jumpA = [
    ["I ( wash / washes ) my face.", ["wash", "washes"], "wash"],
    ["You ( study / studies ) English.", ["study", "studies"], "study"],
    ["We ( writes / write ) letters.", ["writes", "write"], "write"],
    ["They ( teach / teaches ) art.", ["teach", "teaches"], "teach"],
    ["The children ( go / goes ) to school.", ["go", "goes"], "go"],
    ["These girls ( likes / like ) chocolate.", ["likes", "like"], "like"],
    ["Those boys ( know / knows ) Diana.", ["know", "knows"], "know"],
    ["My sisters ( loves / love ) snakes.", ["loves", "love"], "love"],
    ["You and Tom ( hate / hates ) spiders.", ["hate", "hates"], "hate"],
    ["Mary and I ( has / have ) three pigs.", ["has", "have"], "have"],
  ];

  const jumpB = [
    ["He ( read / reads ) books.", ["read", "reads"], "reads"],
    ["She ( write / writes ) stories.", ["write", "writes"], "writes"],
    ["Judy ( studyes / studies ) math.", ["studyes", "studies"], "studies"],
    ["Tom ( jumps / jumpes ) well.", ["jumps", "jumpes"], "jumps"],
    ["It ( runs / runes ) fast.", ["runs", "runes"], "runs"],
    ["The bird ( flyes / flies ) high.", ["flyes", "flies"], "flies"],
    ["Her aunt ( teaches / teachies ) English.", ["teaches", "teachies"], "teaches"],
    ["Her uncle ( washs / washes ) his car.", ["washs", "washes"], "washes"],
    ["My grandma ( gos / goes ) to school.", ["gos", "goes"], "goes"],
    ["My grandpa ( fix / fixes ) my bike.", ["fix", "fixes"], "fixes"],
  ];

  const items = [];
  const [exA, ...restA] = jumpA;
  items.push(
    mcItem("a01", "A", "A1", exA[0], exA[1], String(exA[1].indexOf(exA[2]) + 1), {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: exA[2],
    })
  );
  restA.forEach((row, i) => {
    items.push(
      mcItem(`a${String(i + 2).padStart(2, "0")}`, "A", `A${i + 2}`, row[0], row[1], String(row[1].indexOf(row[2]) + 1), {
        sectionInstructionKo: instrA,
      })
    );
  });

  const [exB, ...restB] = jumpB;
  items.push(
    mcItem("b01", "B", "B1", exB[0], exB[1], String(exB[1].indexOf(exB[2]) + 1), {
      sectionInstructionKo: instrB,
      example: true,
      displayOnly: true,
      exampleAnswer: exB[2],
    })
  );
  restB.forEach((row, i) => {
    items.push(
      mcItem(`b${String(i + 2).padStart(2, "0")}`, "B", `B${i + 2}`, row[0], row[1], String(row[1].indexOf(row[2]) + 1), {
        sectionInstructionKo: instrB,
      })
    );
  });

  const practice = {
    practiceId: "r2:u01:jump",
    title: "Grammar Jump",
    subtitle: "괄호 고르기 (p. 16–17)",
    pages: "16–17",
    timerMinutes: 15,
    introKo: "Section A 9문항, Section B 9문항(예시 각 1개)입니다.",
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
  const instrA = "다음 동사의 알맞은 3인칭 단수 현재형을 빈칸에 쓰세요.";
  const instrB = "주어진 말을 사용하여 문장을 완성하세요. 빈칸에는 알맞은 동사 형태만 쓰세요.";

  const flyA = [
    ["jump", "jumps"],
    ["come", "comes"],
    ["teach", "teaches"],
    ["swim", "swims"],
    ["wash", "washes"],
    ["run", "runs"],
    ["like", "likes"],
    ["fix", "fixes"],
    ["pass", "passes"],
    ["know", "knows"],
    ["love", "loves"],
    ["have", "has"],
    ["hate", "hates"],
    ["go", "goes"],
    ["study", "studies"],
    ["meet", "meets"],
    ["visit", "visits"],
    ["play", "plays"],
    ["fly", "flies"],
    ["watch", "watches"],
  ];

  const flyB = [
    ["A sheep jumps high. ( jump )", "jumps"],
    ["It _____ well. ( swim )", "swims"],
    ["Dad _____ the violin well. ( play )", "plays"],
    ["He _____ his socks every day. ( wash )", "washes"],
    ["Her mom _____ airplanes. ( fix )", "fixes"],
    ["She _____ television every day. ( watch )", "watches"],
    ["Mrs. Wise _____ to the park. ( go )", "goes"],
    ["Her dog _____ long legs. ( have )", "has"],
    ["This monkey _____ math. ( study )", "studies"],
    ["That airplane _____ fast. ( fly )", "flies"],
  ];

  const items = [];
  items.push(
    fillItem("a01", "A", "A1", flyA[0][0], flyA[0][1], {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: flyA[0][1],
    })
  );
  flyA.slice(1).forEach((row, i) => {
    items.push(
      fillItem(`a${String(i + 2).padStart(2, "0")}`, "A", `A${i + 2}`, row[0], row[1], {
        sectionInstructionKo: instrA,
      })
    );
  });

  items.push(
    fillItem("b01", "B", "B1", flyB[0][0], flyB[0][1], {
      sectionInstructionKo: instrB,
      example: true,
      displayOnly: true,
      exampleAnswer: flyB[0][1],
    })
  );
  flyB.slice(1).forEach((row, i) => {
    items.push(
      fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", `B${i + 2}`, row[0], row[1], {
        sectionInstructionKo: instrB,
      })
    );
  });

  const practice = {
    practiceId: "r2:u01:fly",
    title: "Grammar Fly",
    subtitle: "3인칭 단수 현재형 (p. 18–19)",
    pages: "18–19",
    timerMinutes: 15,
    introKo: "Section A 19문항, Section B 9문항(예시 각 1개)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 19,
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
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz1() {
  const instr =
    "다음 표의 빈칸에 알맞은 단어나 우리말 뜻을 쓰세요. 영어 칸에는 영어 단어, 뜻 칸에는 우리말만 쓰세요.";
  const rows = [
    ["fly — 뜻 (1)", ["날다"]],
    ["읽다 — 영어 (2)", ["read"]],
    ["수영하다 — 영어 (3)", ["swim"]],
    ["춤을 추다 — 영어 (4)", ["dance"]],
    ["like — 뜻 (5)", ["좋아하다"]],
    ["come — 뜻 (6)", ["오다"]],
    ["가지다 — 영어 (7)", ["have"]],
  ];

  const items = rows.map((row, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row[0], row[1], {
      sectionInstructionKo: instr,
    })
  );

  const practice = {
    practiceId: "r2:u01:quiz1",
    title: "QUIZ — 일반동사 표",
    subtitle: "단어·뜻 (p. 20)",
    pages: "20",
    timerMinutes: 10,
    introKo: "만화(1번)는 채점하지 않습니다. 표 빈칸 7문항입니다.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 0,
        labels: ["1", "2", "3", "4", "5", "6", "7"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz1.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 3인칭 단수 현재형만 쓰세요.";
  const rows = [
    ["swim → (1)", ["swims"]],
    ["teach → (2)", ["teaches"]],
    ["pass → (3)", ["passes"]],
    ["go → (4)", ["goes"]],
    ["study → (5)", ["studies"]],
    ["fly → (6)", ["flies"]],
    ["have → (7)", ["has"]],
  ];

  const items = rows.map((row, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row[0], row[1], {
      sectionInstructionKo: instr,
    })
  );

  const practice = {
    practiceId: "r2:u01:quiz2",
    title: "QUIZ — 3인칭 단수 규칙",
    subtitle: "p. 21",
    pages: "21",
    timerMinutes: 10,
    introKo: "만화(3번)는 채점하지 않습니다. 표 빈칸 7문항입니다.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 0,
        labels: ["1", "2", "3", "4", "5", "6", "7"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

fs.mkdirSync(OUT, { recursive: true });
writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz1();
writeQuiz2();
console.log("Wrote", OUT);
