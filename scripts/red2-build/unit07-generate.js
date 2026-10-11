#!/usr/bin/env node
/** Generate data/red2/unit07/*.json for RedZap 2 Unit 07 (현재 진행형). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red2/unit07");

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", fp);
}

function matchCard(id, section, label, sectionInstructionKo, pairs, promptKo) {
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

function mc(id, section, label, instr, promptEn, choices, acceptIdx, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instr,
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

function fill(id, section, label, instr, promptEn, accept, extra = {}) {
  const blanks = String(accept[0]).includes("|") ? String(accept[0]).split("|").length : 1;
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instr,
    answerMode: "words",
    answerModeTag: blanks > 1 ? "Words only · 빈칸 말만" : "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks,
    accept,
    ...extra,
  };
}

const walkAInstr =
  "다음 문장의 뜻을 생각하며 따라 써 보세요. 우리말 뜻과 영어 문장을 짝지어 연결하세요.";
const walkBInstr =
  "다음 동사의 뜻을 생각하며 따라 써 보세요. 동사 원형과 「동사원형-ing」형을 짝지어 연결하세요.";

const walkPairsA = [
  { left: "나는 걷고 있다.", right: "I'm walking." },
  { left: "너는 점프하고 있다.", right: "You're jumping." },
  { left: "그녀는 달리고 있다.", right: "She's running." },
  { left: "그들은 날고 있다.", right: "They're flying." },
  { left: "샘은 학교에 가고 있다.", right: "Sam is going to school." },
  { left: "샐리는 집에 오고 있다.", right: "Sally is coming home." },
  { left: "내 남동생은 이야기를 읽고 있다.", right: "My brother is reading a story." },
  { left: "내 아버지는 이야기를 쓰고 있다.", right: "My dad is writing a story." },
  { left: "그 소녀들은 수학을 공부하고 있다.", right: "The girls are studying math." },
  { left: "제시카는 수학을 가르치고 있다.", right: "Jessica is teaching math." },
];

const walkPairsB = [
  { left: "sleep", right: "sleeping" },
  { left: "eat", right: "eating" },
  { left: "make", right: "making" },
  { left: "ride", right: "riding" },
  { left: "swim", right: "swimming" },
  { left: "cut", right: "cutting" },
  { left: "listen", right: "listening" },
  { left: "open", right: "opening" },
  { left: "tie", right: "tying" },
  { left: "die", right: "dying" },
];

write("walk.json", {
  practiceId: "r2:u07:walk",
  title: "Grammar Walk",
  subtitle: "문장 · -ing 따라쓰기 (p. 108–109)",
  pages: "108–109",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(우리말↔영어 짝 맞추기), Section B 2문항(동사↔-ing 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
  sections: [
    {
      id: "A",
      title: "Section A — 문장",
      instructionKo: walkAInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B — 동사-ing",
      instructionKo: walkBInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchCard("a01", "A", "A1", walkAInstr, walkPairsA.slice(0, 7), "문장 1–7"),
    matchCard("a02", "A", "A2", walkAInstr, walkPairsA.slice(7), "문장 8–10"),
    matchCard("b01", "B", "B1", walkBInstr, walkPairsB.slice(0, 7), "동사 1–7"),
    matchCard("b02", "B", "B2", walkBInstr, walkPairsB.slice(7), "동사 8–10"),
  ],
});

const runAInstr =
  "다음 문장에서 현재 진행형을 찾아 동그라미 하세요. be동사와 동사원형-ing 부분만 빈칸에 쓰세요.";
const runBInstr =
  "다음을 알맞게 연결한 후, 「동사원형-ing」형을 따라 써 보세요. 동사 원형과 -ing 형을 짝지어 연결하세요.";

const runPhrases = [
  ["1", "I am washing my hands.", ["am washing", "I'm washing"], true],
  ["2", "We are jumping rope.", ["are jumping"]],
  ["3", "You are eating pizza.", ["are eating"]],
  ["4", "He is cooking now.", ["is cooking"]],
  ["5", "She is going to the park.", ["is going"]],
  ["6", "Edison is tying his shoes.", ["is tying"]],
  ["7", "He is reading a comic book.", ["is reading"]],
  ["8", "My mom and I are making cookies.", ["are making"]],
  ["9", "They are listening to music.", ["are listening"]],
  ["10", "My brothers are sitting on the bench.", ["are sitting"]],
];

const runPairsB = [
  { left: "do", right: "doing" },
  { left: "drive", right: "driving" },
  { left: "drink", right: "drinking" },
  { left: "make", right: "making" },
  { left: "open", right: "opening" },
  { left: "hop", right: "hopping" },
  { left: "lie", right: "lying" },
  { left: "tie", right: "tying" },
  { left: "cut", right: "cutting" },
  { left: "sit", right: "sitting" },
];

write("run.json", {
  practiceId: "r2:u07:run",
  title: "Grammar Run",
  subtitle: "현재 진행형 찾기 · -ing (p. 110–111)",
  pages: "110–111",
  timerMinutes: 20,
  introKo: "Section A 9문항(현재 진행형 쓰기), Section B 2문항(동사↔-ing 짝 맞추기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runBInstr,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    ...runPhrases.map(([lab, sent, acc, ex], i) => {
      const id = `a${String(i + 1).padStart(2, "0")}`;
      const base = fill(id, "A", `A${lab}`, runAInstr, sent, acc);
      if (ex) {
        return {
          ...base,
          example: true,
          displayOnly: true,
          exampleAnswer: acc[0],
        };
      }
      return base;
    }),
    matchCard("b01", "B", "B1", runBInstr, runPairsB.slice(0, 7), "동사 1–7"),
    matchCard("b02", "B", "B2", runBInstr, runPairsB.slice(7), "동사 8–10"),
  ],
});

const jumpAInstr =
  "다음 동사의 알맞은 「동사원형-ing」형을 골라 동그라미 하세요.";
const jumpBInstr =
  "괄호 안에서 알맞은 말을 골라 동그라미 하세요.";

const jumpA = [
  ["come", ["coming", "comeing"], 1],
  ["cry", ["criing", "crying"], 2],
  ["sit", ["siting", "sitting"], 2],
  ["sing", ["singing", "singging"], 1],
  ["eat", ["eating", "eatting"], 1],
  ["run", ["runing", "running"], 2],
  ["close", ["closeing", "closing"], 2],
  ["open", ["opening", "openning"], 1],
  ["drive", ["driving", "driveing"], 1],
  ["tie", ["tieing", "tying"], 2],
];

const jumpB = [
  ["I am ( play / playing ) baseball.", ["play", "playing"], 2, true],
  ["She is ( draw / drawing ).", ["draw", "drawing"], 2],
  ["He is ( do / doing ) his homework.", ["do", "doing"], 2],
  ["We are ( ride / riding ) a bike.", ["ride", "riding"], 2],
  ["They are ( lie / lying ).", ["lie", "lying"], 2],
  ["My sister is ( open / opening ) the window.", ["open", "opening"], 2],
  ["His mom is ( cut / cutting ) the cake.", ["cut", "cutting"], 2],
  ["Your father is ( drive / driving ) a car.", ["drive", "driving"], 2],
  ["The boys are ( drink / drinking ) juice.", ["drink", "drinking"], 2],
  ["Some kangaroos are ( hop / hopping ).", ["hop", "hopping"], 2],
];

write("jump.json", {
  practiceId: "r2:u07:jump",
  title: "Grammar Jump",
  subtitle: "그림 · -ing 고르기 (p. 112–113)",
  pages: "112–113",
  timerMinutes: 15,
  introKo: "Section A 10문항(고르기), Section B 9문항(고르기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpAInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 10,
      exampleCount: 0,
      labels: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpBInstr,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [
    ...jumpA.map(([verb, choices, idx], i) =>
      mc(
        `a${String(i + 1).padStart(2, "0")}`,
        "A",
        `A${i + 1}`,
        jumpAInstr,
        verb,
        choices,
        idx,
        { image: `assets/img/red2/unit07/jump-a${String(i + 1).padStart(2, "0")}.png` }
      )
    ),
    ...jumpB.map(([prompt, choices, idx, ex], i) => {
      const item = mc(
        `b${String(i + 1).padStart(2, "0")}`,
        "B",
        `B${i + 1}`,
        jumpBInstr,
        prompt,
        choices,
        idx
      );
      if (ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = choices[idx - 1];
      }
      return item;
    }),
  ],
});

const flyAInstr =
  "다음 동사의 알맞은 「동사원형-ing」형을 빈칸에 쓰세요.";
const flyBInstr =
  "다음 주어진 동사를 사용하여 문장을 완성하세요. be동사와 동사원형-ing를 각각 빈칸에 쓰세요.";

const flyVerbs = [
  ["run", "running", true],
  ["listen", "listening"],
  ["sleep", "sleeping"],
  ["try", "trying"],
  ["do", "doing"],
  ["die", "dying"],
  ["drive", "driving"],
  ["cut", "cutting"],
  ["make", "making"],
  ["ride", "riding"],
  ["cry", "crying"],
  ["close", "closing"],
  ["sit", "sitting"],
  ["tie", "tying"],
  ["eat", "eating"],
  ["swim", "swimming"],
  ["open", "opening"],
  ["lie", "lying"],
  ["stop", "stopping"],
  ["sing", "singing"],
];

const flyB = [
  ["I ______ ______ to music. ( listen )", "am|listening", true, "나는 음악을 듣고 있다."],
  ["You ______ ______ the box. ( open )", "are|opening", false, "너는 그 상자를 열고 있다."],
  ["She ______ ______ her homework. ( do )", "is|doing", false, "그녀는 숙제를 하고 있다."],
  ["They ______ ______ a snowman. ( make )", "are|making", false, "그들은 눈사람을 만들고 있다."],
  ["We ______ ______ on the sofa. ( sit )", "are|sitting", false, "우리는 소파 위에 앉아 있다."],
  ["He ______ ______ a horse. ( ride )", "is|riding", false, "그는 말을 타고 있다."],
  ["Judy ______ ______ . ( lie )", "is|lying", false, "주디는 거짓말을 하고 있다."],
  ["My uncle ______ ______ a necktie. ( tie )", "is|tying", false, "우리 삼촌은 넥타이를 매고 있다."],
  [
    "His sisters ______ ______ in the pool. ( swim )",
    "are|swimming",
    false,
    "그의 여동생들은 수영장에서 수영을 하고 있다.",
  ],
  ["The cooks ______ ______ the cake. ( eat )", "are|eating", false, "그 요리사들은 케이크를 먹고 있다."],
];

write("fly.json", {
  practiceId: "r2:u07:fly",
  title: "Grammar Fly",
  subtitle: "-ing 쓰기 · 문장 완성 (p. 114–115)",
  pages: "114–115",
  timerMinutes: 20,
  introKo: "Section A 19문항(-ing 쓰기), Section B 9문항(be동사·-ing 쓰기)입니다.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyAInstr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 19,
      exampleCount: 1,
      labels: flyVerbs.slice(1).map((_, i) => `A${i + 2}`),
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyBInstr,
      answerMode: "words",
      answerModeTag: "Words only · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [
    ...flyVerbs.map(([v, ing, ex], i) => {
      const item = fill(
        `a${String(i + 1).padStart(2, "0")}`,
        "A",
        `A${i + 1}`,
        flyAInstr,
        v,
        [ing]
      );
      if (ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = ing;
      }
      return item;
    }),
    ...flyB.map(([prompt, acc, ex, promptKo], i) => {
      const item = fill(
        `b${String(i + 1).padStart(2, "0")}`,
        "B",
        `B${i + 1}`,
        flyBInstr,
        prompt,
        [acc],
        promptKo ? { promptKo } : {}
      );
      if (ex) {
        item.example = true;
        item.displayOnly = true;
        item.exampleAnswer = acc;
      }
      return item;
    }),
  ],
});

const quiz1Instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. be동사만 쓰세요.";
const quiz1Rows = [
  ["I", "am", true],
  ["You", "are"],
  ["He / She / It / 단수명사", "is"],
  ["We", "are"],
  ["You", "are"],
  ["They / 복수명사", "are"],
];

write("quiz1.json", {
  practiceId: "r2:u07:quiz1",
  title: "QUIZ 1 — be동사",
  subtitle: "현재 진행형 표 (p. 116)",
  pages: "116",
  timerMinutes: 10,
  introKo: "5문항. 표의 빈칸에 알맞은 be동사를 쓰세요. (만화는 채점하지 않습니다.)",
  sections: [
    {
      id: "A",
      title: "QUIZ 1",
      instructionKo: quiz1Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 5,
      exampleCount: 1,
      labels: ["2", "3", "4", "5", "6"],
    },
  ],
  items: quiz1Rows.map(([subj, ans, ex], i) => {
    const label = String(i + 1);
    const item = fill(`q${String(i + 1).padStart(2, "0")}`, "A", label, quiz1Instr, `주어: ${subj}`, [ans], {
      promptKo: `표 빈칸 ${label}`,
    });
    if (ex) {
      item.example = true;
      item.displayOnly = true;
      item.exampleAnswer = ans;
    }
    return item;
  }),
});

const quiz2Instr = "다음 표의 빈칸에 알맞은 「동사원형-ing」형을 쓰세요.";
const quiz2Rows = [
  ["sleep →", "sleeping", true],
  ["stop →", "stopping"],
  ["cut →", "cutting"],
  ["make →", "making"],
  ["ride →", "riding"],
  ["lie →", "lying"],
  ["die →", "dying"],
];

write("quiz2.json", {
  practiceId: "r2:u07:quiz2",
  title: "QUIZ 2 — -ing 만들기",
  subtitle: "동사원형-ing 표 (p. 117)",
  pages: "117",
  timerMinutes: 10,
  introKo: "6문항. 표의 빈칸에 -ing 형을 쓰세요. (만화는 채점하지 않습니다.)",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 6,
      exampleCount: 1,
      labels: ["2", "3", "4", "5", "6", "7"],
    },
  ],
  items: quiz2Rows.map(([prompt, ans, ex], i) => {
    const item = fill(`q${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), quiz2Instr, prompt, [ans]);
    if (ex) {
      item.example = true;
      item.displayOnly = true;
      item.exampleAnswer = ans;
    }
    return item;
  }),
});

console.log("Done.");
