/* Generate data/red2/unit02/*.json — RedZap 2 Unit 02 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit02");

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function matchItem(id, section, label, pairs, sectionInstructionKo, promptKo) {
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
      : blanks > 1
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

function writePractice(filename, practice) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, filename), JSON.stringify(practice, null, 2) + "\n");
}

function writeWalk() {
  const instrA =
    "다음 문장의 뜻을 생각하며 일반동사의 부정문을 따라 써 보세요. 한국어 뜻과 영어 부정문을 짝지어 연결하세요.";
  const instrB =
    "다음 대화의 뜻을 생각하며 일반동사의 의문문과 대답을 따라 써 보세요. 한국어 대화와 영어 대화를 짝지어 연결하세요.";

  const negPairs = [
    { left: "나는 춤을 추지 않는다.", right: "I do not dance." },
    { left: "너는 춤을 추지 않는다.", right: "You do not dance." },
    { left: "그는 노래하지 않는다.", right: "He does not sing." },
    { left: "그녀는 노래하지 않는다.", right: "She does not sing." },
    { left: "그것은 날지 않는다.", right: "It does not fly." },
    { left: "그들은 날지 않는다.", right: "They do not fly." },
    { left: "우리는 플루트를 연주하지 않는다.", right: "We do not play the flute." },
    { left: "데이비드는 플루트를 연주하지 않는다.", right: "David doesn't play the flute." },
    { left: "루시와 나는 그들을 모른다.", right: "Lucy and I don't know them." },
    { left: "그 여자들은 그들을 모른다.", right: "The women don't know them." },
  ];

  const qaPairs = [
    { left: "너는 당근을 좋아하니? / 응, 그래.", right: "Do you like carrots? Yes, I do." },
    { left: "그는 당근을 좋아하니? / 응, 그래.", right: "Does he like carrots? Yes, he does." },
    { left: "그녀는 골프를 치니? / 아니, 그렇지 않아.", right: "Does she play golf? No, she doesn't." },
    { left: "그들은 골프를 치니? / 응, 그래.", right: "Do they play golf? Yes, they do." },
    { left: "그것은 빨리 달리니? / 응, 그래.", right: "Does it run fast? Yes, it does." },
    { left: "그들은 빨리 달리니? / 아니, 그렇지 않아.", right: "Do they run fast? No, they don't." },
    { left: "너는 연필이 있니? / 아니, 그렇지 않아.", right: "Do you have a pencil? No, I don't." },
    { left: "너희는 연필들이 있니? / 응, 그래.", right: "Do you have pencils? Yes, we do." },
    { left: "우리는 예쁘게 보이니? / 아니, 그렇지 않아.", right: "Do we look pretty? No, you don't." },
    { left: "나는 예쁘게 보이니? / 응, 그래.", right: "Do I look pretty? Yes, you do." },
  ];

  const items = [];
  const negChunks = chunk(negPairs, 7);
  negChunks.forEach((g, i) => {
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, g, instrA, `부정문 ${i * 7 + 1}–${i * 7 + g.length}`)
    );
  });
  const qaChunks = chunk(qaPairs, 7);
  qaChunks.forEach((g, i) => {
    items.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, g, instrB, `대화 ${i * 7 + 1}–${i * 7 + g.length}`)
    );
  });

  writePractice("walk.json", {
    practiceId: "r2:u02:walk",
    title: "Grammar Walk",
    subtitle: "부정문 · 의문문 따라쓰기 (p. 26–27)",
    pages: "26–27",
    timerMinutes: 20,
    introKo: "Section A 2문항(한국어↔영어 부정문 짝 맞추기), B 2문항(한국어↔영어 대화 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — 부정문",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: negChunks.length,
        exampleCount: 0,
        labels: negChunks.map((_, i) => `A${i + 1}`),
      },
      {
        id: "B",
        title: "Section B — 의문문과 대답",
        instructionKo: instrB,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: qaChunks.length,
        exampleCount: 0,
        labels: qaChunks.map((_, i) => `B${i + 1}`),
      },
    ],
    items,
  });
}

function writeRun() {
  const instrA = "다음 문장에서 don't 또는 doesn't를 찾아 동그라미 하세요. 문장에서 don't 또는 doesn't를 고르세요.";
  const instrB = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. Yes 또는 No를 고르세요.";

  const runA = [
    ["I don't go to the zoo.", "don't"],
    ["He doesn't go to the park.", "doesn't"],
    ["You don't play the violin.", "don't"],
    ["She doesn't play the piano.", "doesn't"],
    ["We don't like spiders.", "don't"],
    ["Susie doesn't hate spiders.", "doesn't"],
    ["They don't have wings.", "don't"],
    ["A snake doesn't have legs.", "doesn't"],
    ["The girls don't need sugar.", "don't"],
    ["Their mom doesn't need salt.", "doesn't"],
  ];

  const runB = [
    ["A: Do you read comic books? B: ( Yes / No ), I don't.", "No"],
    ["A: Does he write stories? B: ( Yes / No ), he does.", "Yes"],
    ["A: Do they clean their rooms? B: ( Yes / No ), they don't.", "No"],
    ["A: Does she make cookies? B: ( Yes / No ), she does.", "Yes"],
    ["A: Do you and David study math? B: ( Yes / No ), we don't.", "No"],
    ["A: Does Mr. Frank teach English? B: ( Yes / No ), he does.", "Yes"],
    ["A: Do your cousins visit you? B: ( Yes / No ), they don't.", "No"],
    ["A: Does your uncle fly an airplane? B: ( Yes / No ), he doesn't.", "No"],
    ["A: Do kangaroos jump high? B: ( Yes / No ), they do.", "Yes"],
    ["A: Does a spider eat worms? B: ( Yes / No ), it does.", "Yes"],
  ];

  const items = [];
  runA.forEach((row, i) => {
    const label = `A${i + 1}`;
    const ex = i === 0;
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", label, row[0], ["don't", "doesn't"], row[1], {
        sectionInstructionKo: instrA,
        example: ex,
        displayOnly: ex,
        exampleAnswer: row[1],
      })
    );
  });
  runB.forEach((row, i) => {
    const label = `B${i + 1}`;
    const ex = i === 0;
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", label, row[0], ["Yes", "No"], row[1], {
        sectionInstructionKo: instrB,
        example: ex,
        displayOnly: ex,
        exampleAnswer: row[1],
      })
    );
  });

  writePractice("run.json", {
    practiceId: "r2:u02:run",
    title: "Grammar Run",
    subtitle: "don't/doesn't · Yes/No (p. 28–29)",
    pages: "28–29",
    timerMinutes: 20,
    introKo: "Section A 9문항(don't/doesn't 고르기), B 9문항(Yes/No 고르기)입니다.",
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
  });
}

function writeJump() {
  const instrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 괄호 안에서 알맞은 말을 고르세요.";
  const instrB = instrA;

  const jumpA = [
    ["I ( don't / doesn't ) have sisters.", "don't"],
    ["He ( don't / doesn't ) help his mom.", "doesn't"],
    ["She ( don't / doesn't ) go to school today.", "doesn't"],
    ["We ( don't / doesn't ) have chickens.", "don't"],
    ["It ( don't / doesn't ) sing.", "doesn't"],
    ["You ( don't / doesn't ) play baseball.", "don't"],
    ["They don't ( write / writes ) letters.", "write"],
    ["Hodong doesn't ( read / reads ) a newspaper.", "read"],
    ["My sisters don't ( learns / learn ) English.", "learn"],
    ["My brother doesn't ( clean / cleans ) his room.", "clean"],
  ];

  const jumpB = [
    ["A: ( Do / Does ) you like pizza? B: Yes, I do.", "Do"],
    ["A: ( Do / Does ) she know him? B: No, she doesn't.", "Does"],
    ["A: ( Do / Does ) Mozart play the piano? B: Yes, he does.", "Does"],
    ["A: ( Do / Does ) it drink water? B: No, it doesn't.", "Does"],
    ["A: ( Do / Does ) they watch television? B: Yes, they do.", "Do"],
    ["A: Does he wash the dishes? B: No, ( he doesn't / he does ).", "he doesn't"],
    ["A: Do your cousins live here? B: Yes, ( they do / we do ).", "they do"],
    ["A: Does Taewhan swim here? B: Yes, ( it does / he does ).", "he does"],
    ["A: Does a chicken eat worms? B: Yes, ( they do / it does ).", "it does"],
    ["A: Do bees have five legs? B: No, ( you don't / they don't ).", "they don't"],
  ];

  const jumpAChoices = [
    ["don't", "doesn't"],
    ["don't", "doesn't"],
    ["don't", "doesn't"],
    ["don't", "doesn't"],
    ["don't", "doesn't"],
    ["don't", "doesn't"],
    ["write", "writes"],
    ["read", "reads"],
    ["learn", "learns"],
    ["clean", "cleans"],
  ];

  const items = [];
  jumpA.forEach((row, i) => {
    const label = `A${i + 1}`;
    const ex = i === 0;
    items.push(
      mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", label, row[0], jumpAChoices[i], row[1], {
        sectionInstructionKo: instrA,
        example: ex,
        displayOnly: ex,
        exampleAnswer: row[1],
      })
    );
  });

  const jumpBChoices = [
    ["Do", "Does"],
    ["Do", "Does"],
    ["Do", "Does"],
    ["Do", "Does"],
    ["Do", "Does"],
    ["he doesn't", "he does"],
    ["they do", "we do"],
    ["it does", "he does"],
    ["they do", "it does"],
    ["you don't", "they don't"],
  ];
  jumpB.forEach((row, i) => {
    const label = `B${i + 1}`;
    const ex = i === 0;
    items.push(
      mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", label, row[0], jumpBChoices[i], row[1], {
        sectionInstructionKo: instrB,
        example: ex,
        displayOnly: ex,
        exampleAnswer: row[1],
      })
    );
  });

  writePractice("jump.json", {
    practiceId: "r2:u02:jump",
    title: "Grammar Jump",
    subtitle: "don't/doesn't · Do/Does (p. 30–31)",
    pages: "30–31",
    timerMinutes: 20,
    introKo: "Section A 9문항(괄호 고르기), B 10문항(괄호 고르기)입니다.",
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
  });
}

function writeFly() {
  const instrA =
    "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 알맞은 말만 순서대로 쓰세요.";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 알맞은 말만 순서대로 쓰세요.";

  const flyA = [
    { prompt: "I run fast. → I ___ ___ ___ fast.", blanks: 3, accept: "do|not|run", ex: true },
    { prompt: "You have a ruler. → You ___ ___ ___ a ruler.", blanks: 3, accept: "do|not|have" },
    { prompt: "She has a brother. → She ___ ___ ___ a brother.", blanks: 3, accept: "does|not|have" },
    { prompt: "He goes to the pool. → He ___ ___ ___ to the pool.", blanks: 3, accept: "does|not|go" },
    { prompt: "We hate worms. → We ___ ___ ___ worms.", blanks: 3, accept: "do|not|hate" },
    { prompt: "It flies fast. → It ___ ___ fast.", blanks: 2, accept: "doesn't|fly", ex: true },
    { prompt: "They like bananas. → They ___ ___ ___ bananas.", blanks: 3, accept: "do|not|like" },
    { prompt: "Jessica meets him. → Jessica ___ ___ ___ him.", blanks: 3, accept: "does|not|meet" },
    { prompt: "My mom loves watermelons. → My mom ___ ___ ___ watermelons.", blanks: 3, accept: "does|not|love" },
    {
      prompt: "The actors drink orange juice. → The actors ___ ___ ___ orange juice.",
      blanks: 3,
      accept: "do|not|drink",
    },
  ];

  const flyB = [
    { prompt: "A: ___ you like chocolate? B: Yes, I do.", blanks: 1, accept: "Do", ex: true },
    { prompt: "A: ___ he play the drum? B: No, he doesn't.", blanks: 1, accept: "Does" },
    { prompt: "A: ___ she have breakfast? B: Yes, she does.", blanks: 1, accept: "Does" },
    { prompt: "A: ___ they look sad? B: No, they don't.", blanks: 1, accept: "Do" },
    { prompt: "A: ___ it have two eyes? B: Yes, it does.", blanks: 1, accept: "Does" },
    { prompt: "A: Do you help your dad? B: Yes, ___ ___.", blanks: 2, accept: "I|do" },
    { prompt: "A: Does she live here? B: No, ___ ___.", blanks: 2, accept: "she|doesn't" },
    { prompt: "A: Does Jack go to the park? B: Yes, ___ ___.", blanks: 2, accept: "he|does" },
    { prompt: "A: Does the dog bite? B: No, ___ ___.", blanks: 2, accept: "it|doesn't" },
    { prompt: "A: Do birds fly? B: Yes, ___ ___.", blanks: 2, accept: "they|do" },
  ];

  const items = [];
  flyA.forEach((row, i) => {
    const parts = row.accept.split("|");
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, row.prompt, [row.accept], {
        sectionInstructionKo: instrA,
        blanks: row.blanks,
        example: !!row.ex,
        displayOnly: !!row.ex,
        exampleAnswer: parts.join(", "),
      })
    );
  });
  flyB.forEach((row, i) => {
    const parts = row.accept.split("|");
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, row.prompt, [row.accept], {
        sectionInstructionKo: instrB,
        blanks: row.blanks,
        example: !!row.ex,
        displayOnly: !!row.ex,
        exampleAnswer: parts.join(", "),
      })
    );
  });

  writePractice("fly.json", {
    practiceId: "r2:u02:fly",
    title: "Grammar Fly",
    subtitle: "부정문 · 의문문 빈칸 (p. 32–33)",
    pages: "32–33",
    timerMinutes: 20,
    introKo: "Section A 8문항(부정문 빈칸), B 9문항(의문문·대답 빈칸)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 8,
        exampleCount: 2,
        labels: ["A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10"],
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
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 표의 빈칸에 알맞은 말만 쓰세요.";
  const rows = [
    { label: "1", prompt: "I — ( = don't)", accept: ["do not", "do|not"] },
    { label: "2", prompt: "We — do not ( = ___ )", accept: ["don't"] },
    { label: "3", prompt: "You — do not ( = ___ ) 동사원형 ~.", accept: ["don't"] },
    { label: "4", prompt: "You — ___ ( = don't) 동사원형 ~.", accept: ["do not", "do|not"] },
    { label: "5", prompt: "He/She/It/단수명사 — does not ( = ___ )", accept: ["doesn't", "does not", "does|not"] },
    { label: "6", prompt: "They/복수명사 — do not ( = ___ )", accept: ["don't"] },
  ];

  const items = rows.map((r, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", r.label, r.prompt, r.accept, {
      sectionInstructionKo: instr,
      blanks: 1,
    })
  );

  writePractice("quiz2.json", {
    practiceId: "r2:u02:quiz2",
    title: "QUIZ 2 — 부정문 표",
    subtitle: "p. 34",
    pages: "34",
    timerMinutes: 15,
    introKo: "6문항. 부정문 표의 빈칸을 채우세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 6,
        exampleCount: 0,
        labels: ["1", "2", "3", "4", "5", "6"],
      },
    ],
    items,
  });
}

function writeQuiz4() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 표의 빈칸에 알맞은 말만 쓰세요.";
  const rows = [
    { label: "1", prompt: "Do I ~? — Yes, ___ , you do.", accept: ["Yes"] },
    { label: "2", prompt: "Do you ~? — No, I [we] ___ .", accept: ["don't", "do not", "do|not"] },
    { label: "3", prompt: "___ he [she/it] + 동사원형 ~?", accept: ["Does"] },
    { label: "4", prompt: "Yes, he [she/it] ___ .", accept: ["does"] },
    { label: "5", prompt: "___, he [she/it] doesn't.", accept: ["No"] },
    { label: "6", prompt: "___ we [you/they] + 동사원형 ~?", accept: ["Do"] },
    { label: "7", prompt: "No, you [we/they] ___ .", accept: ["don't", "do not", "do|not"] },
  ];

  const items = rows.map((r, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", r.label, r.prompt, r.accept, {
      sectionInstructionKo: instr,
      blanks: 1,
    })
  );

  writePractice("quiz4.json", {
    practiceId: "r2:u02:quiz4",
    title: "QUIZ 4 — 의문문 표",
    subtitle: "p. 35",
    pages: "35",
    timerMinutes: 15,
    introKo: "7문항. 의문문·대답 표의 빈칸을 채우세요.",
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
  });
}

writeWalk();
writeRun();
writeJump();
writeFly();
writeQuiz2();
writeQuiz4();
console.log("Wrote", OUT);
