/* Generate data/red2/unit06/*.json — RedZap 2 Unit 06 의문사 (2) */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit06");

function write(name, obj) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2) + "\n");
}

function matchItem(id, section, label, instructionKo, pairs, promptKo) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
    answerMode: "match",
    answerModeTag: "Match · 짝 맞추기",
    label,
    type: "match",
    pairs,
    accept: pairs.map((p) => `${p.left}|${p.right}`),
    promptKo,
  };
}

function mcItem(id, section, label, instructionKo, promptEn, choices, acceptIdx, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
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

function fillItem(id, section, label, instructionKo, promptEn, accept, blanks = 1, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
    answerMode: blanks > 1 ? "sentence" : "words",
    answerModeTag: blanks > 1 ? "Sentence · 문장" : "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

function numberedKoEn(rows) {
  return rows.map((p, i) => ({
    left: `${i + 1}. ${p.ko}`,
    right: p.en,
  }));
}

const walkPairsA = numberedKoEn([
  { ko: "A: 지금 몇 시니? B: 1시다.", en: "A: What time is it now? B: It's one o'clock." },
  { ko: "A: 지금 몇 시니? B: 9시다.", en: "A: What time is it now? B: It's nine o'clock." },
  { ko: "A: 몇 시니? B: 3시다.", en: "A: What time is it? B: It's three o'clock." },
  { ko: "A: 오늘 무슨 요일이니? B: 화요일이다.", en: "A: What day is it today? B: It's Tuesday." },
  { ko: "A: 오늘 무슨 요일이니? B: 목요일이다.", en: "A: What day is it today? B: It's Thursday." },
  { ko: "A: 오늘 무슨 요일이니? B: 금요일이다.", en: "A: What day is it today? B: It's Friday." },
  { ko: "A: 이것은 무슨 색이니? B: 검은색이다.", en: "A: What color is this? B: It's black." },
  { ko: "A: 그 모자는 무슨 색이니? B: 노란색이다.", en: "A: What color is the cap? B: It's yellow." },
  { ko: "A: 네 부츠는 무슨 색이니? B: 파란색이다.", en: "A: What color are your boots? B: They're blue." },
  { ko: "A: 그것은 무슨 색이니? B: 분홍색이다.", en: "A: What color is it? B: It's pink." },
]);

const walkPairsB = numberedKoEn([
  { ko: "A: 그는 몇 살이니? B: 8살이다.", en: "A: How old is he? B: Eight years old." },
  { ko: "A: 그들은 몇 살이니? B: 4살이다.", en: "A: How old are they? B: Four years old." },
  { ko: "A: 네 여동생은 몇 살이니? B: 10살이다.", en: "A: How old is your sister? B: Ten years old." },
  { ko: "A: 그 펜은 얼마니? B: 600원이다.", en: "A: How much is the pen? B: Six hundred won." },
  { ko: "A: 그것은 얼마니? B: 100원이다.", en: "A: How much is it? B: One hundred won." },
  { ko: "A: 그것들은 얼마니? B: 2000원이다.", en: "A: How much are they? B: Two thousand won." },
  { ko: "A: 개를 몇 마리 가지고 있니? B: 2마리.", en: "A: How many dogs do you have? B: Two." },
  { ko: "A: Bill은 꽃을 몇 개 가지고 있니? B: 4개.", en: "A: How many flowers does Bill have? B: Four." },
  { ko: "A: 그는 공을 몇 개 가지고 있니? B: 3개.", en: "A: How many balls does he have? B: Three." },
  { ko: "A: 나는 달걀을 몇 개 가지고 있니? B: 20개.", en: "A: How many eggs do I have? B: Twenty." },
]);

const walkInstrA =
  "다음 대화의 뜻을 생각하며 따라 써 보세요. 우리말 뜻과 영어 대화를 짝지어 연결하세요.";
const walkInstrB = walkInstrA;

write("walk.json", {
  practiceId: "r2:u06:walk",
  title: "Grammar Walk",
  subtitle: "what+명사 · how+형용사 대화 (p. 90–91)",
  pages: "90–91",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(대화 짝 맞추기 7+3쌍), Section B 2문항(대화 짝 맞추기 7+3쌍)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: walkInstrA,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: walkInstrB,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchItem("a01", "A", "A1", walkInstrA, walkPairsA.slice(0, 7), "대화 1–7"),
    matchItem("a02", "A", "A2", walkInstrA, walkPairsA.slice(7), "대화 8–10"),
    matchItem("b01", "B", "B1", walkInstrB, walkPairsB.slice(0, 7), "대화 1–7"),
    matchItem("b02", "B", "B2", walkInstrB, walkPairsB.slice(7), "대화 8–10"),
  ],
  sectionsVersion: 1,
});

const runInstrA = "다음 대화에서 「what+명사」를 찾아 동그라미 하세요. 동그라미 할 말을 고르세요.";
const runInstrB = "다음 대화에서 「how+형용사」를 찾아 동그라미 하세요. 동그라미 할 말을 고르세요.";

/** Consecutive two-word phrases from the A line, in sentence order (book-faithful MC). */
function circlePhraseChoices(prompt) {
  const aLine = prompt.split("\n")[0].replace(/^A:\s*/, "");
  const words = aLine.replace(/\?$/u, "?").split(/\s+/);
  const choices = [];
  for (let i = 0; i < words.length - 1; i++) {
    choices.push(`${words[i]} ${words[i + 1]}`);
  }
  return { choices, ans: 1 };
}

const runA = [
  { ex: true, prompt: "A: What day is it today?\nB: It's Wednesday." },
  { prompt: "A: What time is it?\nB: It's ten o'clock." },
  { prompt: "A: What color is the sky?\nB: It's blue." },
  { prompt: "A: What time is it now?\nB: It's four o'clock." },
  { prompt: "A: What day is it today?\nB: It's Saturday." },
  { prompt: "A: What color is the apple?\nB: It's red." },
  { prompt: "A: What day is it today?\nB: It's Thursday." },
  { prompt: "A: What color is the rabbit?\nB: It's white." },
  { prompt: "A: What time is it now?\nB: It's twelve o'clock." },
  { prompt: "A: What color are the dishes?\nB: They're yellow." },
];

const runB = [
  { ex: true, prompt: "A: How old is he?\nB: Thirteen years old." },
  { prompt: "A: How much is the cup?\nB: Two thousand won." },
  { prompt: "A: How many notebooks do you want?\nB: Seven." },
  { prompt: "A: How old is your uncle?\nB: Twenty years old." },
  { prompt: "A: How many legs does the bee have?\nB: Six." },
  { prompt: "A: How much are these carrots?\nB: Four thousand won." },
  { prompt: "A: How many pigs do they have?\nB: Sixteen." },
  { prompt: "A: How old is Joanne?\nB: Six years old." },
  { prompt: "A: How much are the grapes?\nB: Three thousand won." },
  { prompt: "A: How old are they?\nB: Seventeen years old." },
];

function runItems(section, instr, rows) {
  const items = [];
  let n = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const label = section + (i + 1);
    const { choices, ans } = circlePhraseChoices(r.prompt);
    const extra = r.ex
      ? { example: true, displayOnly: true, exampleAnswer: choices[ans - 1] }
      : {};
    if (!r.ex) n++;
    items.push(
      mcItem(
        `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`,
        section,
        label,
        instr,
        r.prompt,
        choices,
        ans,
        extra
      )
    );
  }
  return { items, graded: n };
}

const runAData = runItems("A", runInstrA, runA);
const runBData = runItems("B", runInstrB, runB);

write("run.json", {
  practiceId: "r2:u06:run",
  title: "Grammar Run",
  subtitle: "what+명사 · how+형용사 찾기 (p. 92–93)",
  pages: "92–93",
  timerMinutes: 15,
  introKo: `Section A ${runAData.graded}문항(고르기), B ${runBData.graded}문항(고르기)입니다.`,
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runInstrA,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: runAData.graded,
      exampleCount: 1,
      labels: runA.slice(1).map((_, i) => `A${i + 2}`),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runInstrB,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: runBData.graded,
      exampleCount: 1,
      labels: runB.slice(1).map((_, i) => `B${i + 2}`),
    },
  ],
  items: [...runAData.items, ...runBData.items],
  sectionsVersion: 1,
});

const jumpInstrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
const jumpInstrB = jumpInstrA;

const jumpA = [
  { ex: true, prompt: "A: What ( color / day ) is the cat?", choices: ["color", "day"], ans: 1 },
  { prompt: "A: What ( day / time ) is it today?", choices: ["day", "time"], ans: 1 },
  { prompt: "A: What ( color / time ) is it now?", choices: ["color", "time"], ans: 2 },
  { prompt: "A: ( What color / What day ) is it today?", choices: ["What color", "What day"], ans: 2 },
  { prompt: "A: ( What day / What time ) is it?", choices: ["What day", "What time"], ans: 2 },
  { prompt: "A: ( What color / What time ) is the blouse?", choices: ["What color", "What time"], ans: 1 },
  { prompt: "A: What day is it today?", choices: ["Sunday", "blue"], ans: 1, prefix: "B: It's ( " },
  { prompt: "A: What time is it now?", choices: ["Monday", "six o'clock"], ans: 2, prefix: "B: It's ( " },
  { prompt: "A: What day is it today?", choices: ["pink", "Thursday"], ans: 2, prefix: "B: It's ( " },
  {
    prompt: "A: What color are his eyes?",
    choices: ["blue", "nine o'clock"],
    ans: 1,
    prefix: "B: They're ( ",
  },
];

const jumpB = [
  { ex: true, prompt: "A: ( How old / How much ) is his dog?", choices: ["How old", "How much"], ans: 1 },
  { prompt: "A: ( How much / How many ) is the jacket?", choices: ["How much", "How many"], ans: 1 },
  { prompt: "A: ( How many / How old ) potatoes do you have?", choices: ["How many", "How old"], ans: 1 },
  { prompt: "A: How many ( robot / robots ) does she have?", choices: ["robot", "robots"], ans: 2 },
  { prompt: "A: How many ( banana / bananas ) does he have?", choices: ["banana", "bananas"], ans: 2 },
  { prompt: "A: How many ( bat / bats ) do the kids have?", choices: ["bat", "bats"], ans: 2 },
  {
    prompt: "A: How much is the watermelon?",
    choices: ["Five thousand won", "Seven"],
    ans: 1,
    prefix: "B: ( ",
  },
  {
    prompt: "A: How many chickens do they have?",
    choices: ["Eight years old", "Seventeen"],
    ans: 2,
    prefix: "B: ( ",
  },
  {
    prompt: "A: How many balloons does she have?",
    choices: ["Six", "Six hundred won"],
    ans: 1,
    prefix: "B: ( ",
  },
  {
    prompt: "A: How old are the girls?",
    choices: ["Ten years old", "Ten thousand won"],
    ans: 1,
    prefix: "B: ( ",
  },
];

function jumpItems(section, instr, rows) {
  const items = [];
  let graded = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const label = section + (i + 1);
    const promptEn = r.prefix ? `${r.prompt}\n${r.prefix}${r.choices.join(" / ")} )` : r.prompt;
    const extra = r.ex
      ? { example: true, displayOnly: true, exampleAnswer: r.choices[r.ans - 1] }
      : {};
    if (!r.ex) graded++;
    items.push(
      mcItem(
        `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`,
        section,
        label,
        instr,
        promptEn,
        r.choices,
        r.ans,
        extra
      )
    );
  }
  return { items, graded };
}

const jumpAData = jumpItems("A", jumpInstrA, jumpA);
const jumpBData = jumpItems("B", jumpInstrB, jumpB);

write("jump.json", {
  practiceId: "r2:u06:jump",
  title: "Grammar Jump",
  subtitle: "괄호 안 고르기 (p. 94–95)",
  pages: "94–95",
  timerMinutes: 15,
  introKo: `Section A ${jumpAData.graded}문항(고르기), B ${jumpBData.graded}문항(고르기)입니다.`,
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpInstrA,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: jumpAData.graded,
      exampleCount: 1,
      labels: jumpA.slice(1).map((_, i) => `A${i + 2}`),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpInstrB,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: jumpBData.graded,
      exampleCount: 1,
      labels: jumpB.slice(1).map((_, i) => `B${i + 2}`),
    },
  ],
  items: [...jumpAData.items, ...jumpBData.items],
  sectionsVersion: 1,
});

const flyInstrA = "다음 대화의 빈칸에 알맞은 말을 쓰세요.";
const flyInstrB = "다음 보기에서 알맞은 말을 찾아 빈칸에 쓰세요. (보기: old, much, many, how)";

const flyA = [
  { ex: true, prompt: "A: What time is it?\nB: It's two o'clock.", accept: "time" },
  { prompt: "A: What ___ is it today?\nB: It's Tuesday.", accept: "day" },
  { prompt: "A: What ___ is the lemon?\nB: It's yellow.", accept: "color" },
  { prompt: "A: ___ ___ is it today?\nB: It's Monday.", accept: "What|day", blanks: 2 },
  { prompt: "A: ___ ___ is his hair?\nB: It's black.", accept: "What|color", blanks: 2 },
  { prompt: "A: ___ ___ is it now?\nB: It's four o'clock.", accept: "What|time", blanks: 2 },
  { prompt: "A: What color is her coat?\nB: It's ___.", accept: "red" },
  { prompt: "A: What time is it?\nB: It's ___ o'clock.", accept: "six" },
  { prompt: "A: What day is it today?\nB: It's ___.", accept: "Saturday" },
  { prompt: "A: What color are your mittens?\nB: They're ___.", accept: "blue" },
];

const flyB = [
  { ex: true, prompt: "A: How old are you?\nB: Seven years old.", accept: "old" },
  { prompt: "A: How ___ is the ruler?\nB: One dollar.", accept: "much" },
  { prompt: "A: How ___ are the babies?\nB: Two years old.", accept: "old" },
  { prompt: "A: ___ ___ is your umbrella?\nB: Ten dollars.", accept: "How|much", blanks: 2 },
  { prompt: "A: ___ ___ fish do you have?\nB: Twelve.", accept: "How|many", blanks: 2 },
  { prompt: "A: ___ ___ is your cousin?\nB: Fifteen years old.", accept: "How|old", blanks: 2 },
  { prompt: "A: How ___ are the cookies?\nB: Four dollars.", accept: "much" },
  { prompt: "A: How ___ brothers does she have?\nB: Two.", accept: "many" },
  { prompt: "A: How ___ pigs do you have?\nB: Three.", accept: "many" },
  { prompt: "A: How ___ is the penguin?\nB: One year old.", accept: "old" },
];

function flyItems(section, instr, rows) {
  const items = [];
  let graded = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const label = section + (i + 1);
    const blanks = r.blanks || 1;
    const extra = r.ex
      ? { example: true, displayOnly: true, exampleAnswer: String(r.accept).split("|")[0] }
      : {};
    if (!r.ex) graded++;
    items.push(
      fillItem(
        `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`,
        section,
        label,
        instr,
        r.prompt,
        r.accept,
        blanks,
        extra
      )
    );
  }
  return { items, graded };
}

const flyAData = flyItems("A", flyInstrA, flyA);
const flyBData = flyItems("B", flyInstrB, flyB);

write("fly.json", {
  practiceId: "r2:u06:fly",
  title: "Grammar Fly",
  subtitle: "대화 빈칸 · 보기 (p. 96–97)",
  pages: "96–97",
  timerMinutes: 15,
  introKo: `Section A ${flyAData.graded}문항(쓰기), B ${flyBData.graded}문항(쓰기)입니다.`,
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyInstrA,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: flyAData.graded,
      exampleCount: 1,
      labels: flyA.slice(1).map((_, i) => `A${i + 2}`),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyInstrB,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: flyBData.graded,
      exampleCount: 1,
      labels: flyB.slice(1).map((_, i) => `B${i + 2}`),
    },
  ],
  items: [...flyAData.items, ...flyBData.items],
  sectionsVersion: 1,
});

write("quiz2.json", {
  practiceId: "r2:u06:quiz2",
  title: "QUIZ 2 — what+명사 표",
  subtitle: "p. 98",
  pages: "98",
  timerMinutes: 10,
  introKo: "2문항. 표 빈칸에 알맞은 말을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: "다음 표의 빈칸에 알맞은 말을 쓰세요.",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 2,
      exampleCount: 0,
      labels: ["2", "3"],
    },
  ],
  items: [
    fillItem("q01", "A", "2", "다음 표의 빈칸에 알맞은 말을 쓰세요.", "What ___ is it? (무슨 요일이니?)", "day"),
    fillItem(
      "q02",
      "A",
      "3",
      "다음 표의 빈칸에 알맞은 말을 쓰세요.",
      "What ___ + be동사 + 주어? (~은 무슨 색이니?)",
      "color"
    ),
  ],
  sectionsVersion: 1,
});

const daysKo = [
  ["Tuesday", "화요일"],
  ["Wednesday", "수요일"],
  ["Thursday", "목요일"],
  ["Friday", "금요일"],
  ["Saturday", "토요일"],
  ["Sunday", "일요일"],
  ["weekend", "주말"],
];

write("quiz3.json", {
  practiceId: "r2:u06:quiz3",
  title: "QUIZ 3 — 요일 어휘",
  subtitle: "p. 98",
  pages: "98",
  timerMinutes: 10,
  introKo: "7문항. 영어 요일·weekend의 우리말 뜻을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 3",
      instructionKo: "다음 단어의 뜻을 빈칸에 쓰세요.",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 7,
      exampleCount: 1,
      labels: ["2", "3", "4", "5", "6", "7", "8"],
    },
  ],
  items: [
    fillItem("q01", "A", "1", "다음 단어의 뜻을 빈칸에 쓰세요.", "Monday", "월요일", 1, {
      example: true,
      displayOnly: true,
      exampleAnswer: "월요일",
    }),
    ...daysKo.map(([en, ko], i) =>
      fillItem(
        "q" + String(i + 2).padStart(2, "0"),
        "A",
        String(i + 2),
        "다음 단어의 뜻을 빈칸에 쓰세요.",
        en,
        [ko]
      )
    ),
  ],
  sectionsVersion: 1,
});

write("quiz5.json", {
  practiceId: "r2:u06:quiz5",
  title: "QUIZ 5 — how+형용사 표",
  subtitle: "p. 99",
  pages: "99",
  timerMinutes: 10,
  introKo: "3문항. 표 빈칸에 알맞은 말을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 5",
      instructionKo: "다음 표의 빈칸에 알맞은 말을 쓰세요.",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 3,
      exampleCount: 0,
      labels: ["1", "2", "3"],
    },
  ],
  items: [
    fillItem("q01", "A", "1", "다음 표의 빈칸에 알맞은 말을 쓰세요.", "How ___ + be동사 + 주어? (~는 몇 살이니?)", "old"),
    fillItem("q02", "A", "2", "다음 표의 빈칸에 알맞은 말을 쓰세요.", "How ___ + be동사 + 주어? (~은 얼마니?)", "much"),
    fillItem(
      "q03",
      "A",
      "3",
      "다음 표의 빈칸에 알맞은 말을 쓰세요.",
      "How ___ + 복수명사 + do/does + 주어 + 동사원형",
      "many"
    ),
  ],
  sectionsVersion: 1,
});

console.log("Wrote", OUT);
