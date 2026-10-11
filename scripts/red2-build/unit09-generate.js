/* Generate data/red2/unit09/*.json — RedZap 2 Unit 09 조동사 can */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit09");

const META = {
  bookId: "zap-red-2",
  bookTitle: "ZAP Red 2",
  appName: "RedZap 2",
  unitId: "unit-09",
  unitTitle: "Unit 09 — 조동사 can",
  sectionsVersion: 2,
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

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 따라 써 보세요. 문장에서 따라 쓸 can/cannot/can't와 동사원형 구를 짝지어 연결하세요.";
  const instrB =
    "다음 대화의 뜻을 생각하며 따라 써 보세요. 물음과 대답을 짝지어 연결하세요.";
  const walkA = [
    ["1. I … the piano.", "can play"],
    ["2. You … very fast.", "can walk"],
    ["3. He … the car.", "can fix"],
    ["4. It … fast.", "can run"],
    ["5. We … well.", "can skate"],
    ["6. A duck …", "cannot fly"],
    ["7. We … English.", "cannot read"],
    ["8. Britney …", "cannot ski"],
    ["9. Jack … rope.", "can't jump"],
    ["10. My friends … the mountain.", "can't climb"],
  ];
  const walkB = [
    ["Can you play golf?", "Yes, I can."],
    ["Can she drive a car?", "No, she can't."],
    ["Can he kick the ball?", "Yes, he can."],
    ["Can they jump?", "No, they can't."],
    ["Can it climb the tree?", "Yes, it can."],
    ["Can he count?", "No, he can't."],
    ["Can they write?", "Yes, they can."],
    ["Can Tom make gimbap?", "Yes, he can."],
    ["Can your sister dive?", "No, she can't."],
    ["Can the kids play chess?", "No, they can't."],
  ];
  const items = [];
  chunk(walkA, 7).forEach((g, i) => {
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, g.map(([l, r]) => ({ left: l, right: r })), {
        sectionInstructionKo: instrA,
        promptKo: `문장 ${g[0][0].split(".")[0]}–${g[g.length - 1][0].split(".")[0]}`,
      })
    );
  });
  chunk(walkB, 7).forEach((g, i) => {
    items.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, g.map(([l, r]) => ({ left: l, right: r })), {
        sectionInstructionKo: instrB,
        promptKo: `대화 ${i * 7 + 1}–${i * 7 + g.length}`,
      })
    );
  });
  const practice = {
    practiceId: "r2:u09:walk",
    title: "Grammar Walk",
    subtitle: "can 문장 · 대화 따라쓰기 (pp. 140–141)",
    pages: "140–141",
    timerMinutes: 20,
    introKo: "Section A 2문항(문장 짝 맞추기), Section B 2문항(대화 짝 맞추기)입니다.",
    ...META,
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
  };
  fs.writeFileSync(path.join(OUT, "walk.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeRun() {
  const instrA =
    "다음 문장에서 can과 cannot 또는 can't를 찾아 동그라미 하세요. 동그라미 칠 말을 골라 누르세요.";
  const instrB =
    "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const choicesForModal = (a) => {
    if (a === "cannot") return ["cannot", "can", "could"];
    if (a === "can't") return ["can't", "can", "could"];
    return ["can", "cannot", "could"];
  };
  const runA = [
    { n: 1, s: "I can skate well.", a: "can", ex: true },
    { n: 2, s: "You can throw a ball.", a: "can" },
    { n: 3, s: "He can make pizza.", a: "can" },
    { n: 4, s: "She can fly the kite.", a: "can" },
    { n: 5, s: "We can answer the questions.", a: "can" },
    { n: 6, s: "My mom cannot drive a truck.", a: "cannot" },
    { n: 7, s: "Snakes cannot hear.", a: "cannot" },
    { n: 8, s: "They cannot play baseball.", a: "cannot" },
    { n: 9, s: "My brother can't do taekwondo.", a: "can't" },
    { n: 10, s: "Chris and Brian can't sing well.", a: "can't" },
  ];
  const runB = [
    { n: 1, q: "A: Can you make a snowman? B: ( Yes / No ), I can't.", a: "No", ex: true },
    { n: 2, q: "A: Can she play the cello? B: ( Yes / No ), she can.", a: "Yes" },
    { n: 3, q: "A: Can he speak Japanese? B: ( Yes / No ), he can't.", a: "No" },
    { n: 4, q: "A: Can it fly? B: ( Yes / No ), it can.", a: "Yes" },
    { n: 5, q: "A: Can they ride a horse? B: ( Yes / No ), they can't.", a: "No" },
    { n: 6, q: "A: Can they swim? B: Yes, they ( can / can't ).", a: "can", c: ["can", "can't"] },
    { n: 7, q: "A: Can you ski? B: No, we ( can / can't ).", a: "can't", c: ["can", "can't"] },
    { n: 8, q: "A: Can Bob ride a bike? B: No, he ( can / can't ).", a: "can't", c: ["can", "can't"] },
    { n: 9, q: "A: Can your mom sing well? B: Yes, she ( can / can't ).", a: "can", c: ["can", "can't"] },
    { n: 10, q: "A: Can the farmers dance well? B: Yes, they ( can / can't ).", a: "can", c: ["can", "can't"] },
  ];
  const items = [];
  runA.forEach((row, i) => {
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(row.n), row.s, choicesForModal(row.a), row.a, {
        sectionInstructionKo: instrA,
        ...(row.ex ? { example: true, displayOnly: true, exampleAnswer: row.a } : {}),
      })
    );
  });
  runB.forEach((row, i) => {
    const choices = row.c || ["Yes", "No"];
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", String(row.n), row.q, choices, row.a, {
        sectionInstructionKo: instrB,
        ...(row.ex ? { example: true, displayOnly: true, exampleAnswer: row.a } : {}),
      })
    );
  });
  const practice = {
    practiceId: "r2:u09:run",
    title: "Grammar Run",
    subtitle: "can 찾기 · 대답 고르기 (pp. 142–143)",
    pages: "142–143",
    timerMinutes: 18,
    introKo: "Section A 10문항(조동사 고르기), Section B 10문항(괄호 고르기)입니다.",
    ...META,
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    items,
  };
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA =
    "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const instrB = instrA;
  const jumpA = [
    ["I can ( make / makes ) sandwiches.", ["make", "makes"], "make", true],
    ["You can ( play / plays ) the violin.", ["play", "plays"], "play"],
    ["She can ( fix / fixes ) computers.", ["fix", "fixes"], "fix"],
    ["It can ( swims / swim ) well.", ["swims", "swim"], "swim"],
    ["We can ( wash / washes ) the dishes.", ["wash", "washes"], "wash"],
    ["You cannot ( jump / jumping ) rope.", ["jump", "jumping"], "jump"],
    ["They cannot ( playing / play ) the flute.", ["playing", "play"], "play"],
    ["My dad cannot ( singing / sing ) well.", ["singing", "sing"], "sing"],
    ["The cook can't ( drive / driving ) a car.", ["drive", "driving"], "drive"],
    ["Penguins can't ( flying / fly ).", ["flying", "fly"], "fly"],
  ];
  const jumpB = [
    ["A: ( Can you / Are you ) play soccer? B: Yes, I can.", ["Can you", "Are you"], "Can you", true],
    ["A: ( Is she / Can she ) make cookies? B: No, she can't.", ["Is she", "Can she"], "Can she"],
    ["A: ( Can he / Is he ) read Japanese? B: Yes, he can.", ["Can he", "Is he"], "Can he"],
    ["A: ( Can it / Is it ) fly high? B: No, it can't.", ["Can it", "Is it"], "Can it"],
    [
      "A: ( Can the monkeys / Are the monkeys ) draw a picture? B: Yes, they can.",
      ["Can the monkeys", "Are the monkeys"],
      "Can the monkeys",
    ],
    ["A: Can they ( speaks / speak ) English? B: Yes, they can.", ["speaks", "speak"], "speak"],
    ["A: Can you ( plays / play ) badminton? B: No, I can't.", ["plays", "play"], "play"],
    ["A: Can Sally ( sing / sings ) the song? B: No, she can't.", ["sing", "sings"], "sing"],
    ["A: Can the fish ( swims / swim ) fast? B: Yes, it can.", ["swims", "swim"], "swim"],
    ["A: Can the girls ( dance / dances ) well? B: No, they can't.", ["dance", "dances"], "dance"],
  ];
  const items = [];
  jumpA.forEach((row, i) => {
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row[0], row[1], row[2], {
        sectionInstructionKo: instrA,
        ...(row[3] ? { example: true, displayOnly: true, exampleAnswer: row[2] } : {}),
      })
    );
  });
  jumpB.forEach((row, i) => {
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", String(i + 1), row[0], row[1], row[2], {
        sectionInstructionKo: instrB,
        ...(row[3] ? { example: true, displayOnly: true, exampleAnswer: row[2] } : {}),
      })
    );
  });
  const practice = {
    practiceId: "r2:u09:jump",
    title: "Grammar Jump",
    subtitle: "동사원형 · Can 의문문 (pp. 144–145)",
    pages: "144–145",
    timerMinutes: 18,
    introKo: "Section A 10문항, Section B 10문항(괄호 고르기)입니다.",
    ...META,
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    items,
  };
  fs.writeFileSync(path.join(OUT, "jump.json"), JSON.stringify(practice, null, 2) + "\n");
}

function negAccept(modal, verb) {
  const m = modal.toLowerCase();
  const forms =
    m === "can't" || m === "cant"
      ? ["can't", "cant", "cannot"]
      : m === "cannot"
        ? ["cannot", "can't", "cant"]
        : [modal];
  const out = [];
  for (const f of forms) {
    out.push(`${f}|${verb}`);
    out.push(`${f} ${verb}`);
  }
  return out;
}

function writeFly() {
  const instrA =
    "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요. 빈칸마다 들어갈 말을 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 부정문과 의문문으로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요. 빈칸마다 들어갈 말을 각각 쓰세요.";
  const flyA = [
    ["I ______ ______ a letter. ( write )", "can|write", "나는 편지를 쓸 수 있다.", true],
    ["You ______ ______ computer games well. ( play )", "can|play", "너는 컴퓨터 게임을 잘할 수 있다."],
    ["She ______ ______ the box. ( carry )", "can|carry", "그녀는 그 상자를 나를 수 있다."],
    ["He ______ ______ the books. ( read )", "can|read", "그는 그 책들을 읽을 수 있다."],
    ["We ______ ______ the balls. ( catch )", "can|catch", "우리는 그 공들을 잡을 수 있다."],
    ["It ______ ______ high. ( jump )", "can't|jump", "그것은 높이 점프하지 못한다."],
    ["They ______ ______ fast. ( run )", "can't|run", "그들은 빨리 달리지 못한다."],
    ["Yeonjae ______ ______ spaghetti. ( make )", "can't|make", "연재는 스파게티를 만들지 못한다."],
    ["An iguana ______ ______ . ( fly )", "can't|fly", "이구아나는 날지 못한다."],
    ["Kangaroos ______ ______ . ( swim )", "can't|swim", "캥거루는 헤엄치지 못한다."],
  ];
  const flyBneg = [
    ["You can draw a goat.", "You ______ ______ a goat.", "cannot|draw", true],
    ["She can answer the question.", "She ______ ______ the question.", "cannot|answer"],
    ["He can play the cello.", "He ______ ______ the cello.", "cannot|play"],
    ["They can swim well.", "They ______ ______ well.", "cannot|swim"],
    ["It can run fast.", "It ______ ______ fast.", "cannot|run"],
  ];
  const flyBq = [
    ["You can play volleyball.", "______ ______ ______ volleyball?", "Can|you|play", true],
    ["Rebecca can drive a fire engine.", "______ ______ ______ a fire engine?", "Can|Rebecca|drive"],
    ["Your brother can lift the box.", "______ ______ ______ the box?", "Can|your brother|lift"],
    ["The zebras can fly.", "______ ______ ______?", "Can|the zebras|fly"],
    ["They can make gimchi.", "______ ______ ______ gimchi?", "Can|they|make"],
  ];
  const items = [];
  flyA.forEach((row, i) => {
    const [prompt, ans, ko, ex] = row;
    const parts = ans.split("|");
    const accept =
      parts[0].includes("can't") || parts[0] === "cannot"
        ? negAccept(parts[0], parts[1])
        : [ans, `${parts[0]} ${parts[1]}`];
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), prompt, accept, {
        sectionInstructionKo: instrA,
        promptKo: ko,
        blanks: 2,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans.replace("|", " ") } : {}),
      })
    );
  });
  flyBneg.forEach((row, i) => {
    const [orig, prompt, ans, ex] = row;
    const verb = ans.split("|")[1];
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", String(i + 1), `${orig}\n${prompt}`, negAccept("cannot", verb), {
        sectionInstructionKo: instrB,
        promptKo: "부정문으로 바꾸세요.",
        blanks: 2,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: "cannot draw" } : {}),
      })
    );
  });
  flyBq.forEach((row, i) => {
    const [orig, prompt, ans, ex] = row;
    items.push(
      fillItem(`b${String(i + 6).padStart(2, "0")}`, "B", String(i + 6), `${orig}\n${prompt}`, [ans, ans.replace(/\|/g, " ")], {
        sectionInstructionKo: instrB,
        promptKo: "의문문으로 바꾸세요.",
        blanks: 3,
        ...(ex ? { example: true, displayOnly: true, exampleAnswer: "Can you play" } : {}),
      })
    );
  });
  const practice = {
    practiceId: "r2:u09:fly",
    title: "Grammar Fly",
    subtitle: "can 문장 완성 · 부정·의문문 (pp. 146–147)",
    pages: "146–147",
    timerMinutes: 22,
    introKo: "Section A 10문항(두 칸), Section B 10문항(부정 5·의문 5)입니다.",
    ...META,
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 8,
        exampleCount: 2,
        labels: ["2", "3", "4", "5", "7", "8", "9", "10"],
      },
    ],
    items,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸 번호에 맞는 말만 한 칸에 쓰세요.";
  const rows = [
    ["1", "can 긍정문 — 주어 I", "can"],
    ["2", "can 긍정문 — 동사 칸(복수 주어)", "동사원형"],
    ["3", "can 긍정문 — 주어 He/She/It", "can"],
    ["4", "can 부정문 — cannot (= ?)", "can't"],
    ["5", "can 부정문 — 동사 칸(주어 I)", "동사원형"],
    ["6", "can 부정문 — You/We/They", "cannot"],
    ["7", "can 부정문 — cannot (= ?)", "can't"],
  ];
  const items = rows.map(([label, promptKo, ans], i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", label, `표 빈칸 ${label}`, [ans], {
      sectionInstructionKo: instr,
      promptKo,
      blanks: 1,
    })
  );
  const practice = {
    practiceId: "r2:u09:quiz2",
    title: "QUIZ 2 — can 긍·부정 표",
    subtitle: "p. 148",
    pages: "148",
    timerMinutes: 12,
    introKo: "7문항(표 빈칸 1–7)입니다.",
    ...META,
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
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸 번호에 맞는 말만 한 칸에 쓰세요.";
  const rows = [
    ["1", "의문문 대답 — No, ___ can't (주어 I)", "you"],
    ["2", "의문문 대답 — 긍정 대답", "Yes"],
    ["3", "의문문 대답 — 부정 대답", "can't"],
    ["4", "의문문 대답 — Yes, he can", "can"],
    ["5", "의문문 대답 — 부정 대답", "No"],
  ];
  const items = rows.map(([label, promptKo, ans], i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", label, `표 빈칸 ${label}`, [ans], {
      sectionInstructionKo: instr,
      promptKo,
      blanks: 1,
    })
  );
  const practice = {
    practiceId: "r2:u09:quiz4",
    title: "QUIZ 4 — can 의문문 대답 표",
    subtitle: "p. 149",
    pages: "149",
    timerMinutes: 10,
    introKo: "5문항(표 빈칸 1–5)입니다.",
    ...META,
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 5,
        exampleCount: 0,
        labels: ["1", "2", "3", "4", "5"],
      },
    ],
    items,
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
console.log("Wrote", OUT);
