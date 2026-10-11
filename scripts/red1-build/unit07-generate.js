/* Generate RedZap 1 Unit 07 practice JSON (p. 108–117). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit07");

function write(name, obj) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2) + "\n");
}

function matchItem(id, section, label, instructionKo, pairs, promptKo, startNum = 1) {
  const numbered = pairs.map(([left, right], i) => {
    const n = startNum + i;
    const key = `${n}. ${left}`;
    return [key, right];
  });
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
    answerMode: "match",
    answerModeTag: "Match · 짝 맞추기",
    label,
    type: "match",
    pairs: numbered.map(([left, right]) => ({ left, right })),
    accept: numbered.map(([l, r]) => `${l}|${r}`),
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

function fillItem(id, section, label, instructionKo, promptEn, accept, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label,
    type: "fill",
    promptEn,
    blanks: 1,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

// Korean meanings from book answer key (해설); English = traced word on p. 108–109.
const walkA = [
  ["내 다리는 길다.", "My"],
  ["네 다리는 길다.", "Your"],
  ["그것의 다리는 짧다.", "Its"],
  ["그들의 다리는 짧다.", "Their"],
  ["그의 고양이는 귀엽다.", "His"],
  ["그녀의 고양이는 귀엽다.", "Her"],
  ["그는 우리의 오빠이다.", "our"],
  ["그녀는 그들의 언니이다.", "their"],
  ["그들은 네 형제이다.", "your"],
  ["그들은 그녀의 자매이다.", "her"],
];

const walkB = [
  ["이것은 네 것이다.", "yours"],
  ["저것은 내 것이다.", "mine"],
  ["그 연은 그녀의 것이다.", "hers"],
  ["그 연은 그의 것이다.", "his"],
  ["이 공은 우리의 것이다.", "ours"],
  ["저 공은 그들의 것이다.", "theirs"],
  ["이 북들은 우리의 것이다.", "ours"],
  ["저 북들은 너희의 것이다.", "yours"],
  ["이 로봇들은 내 것이다.", "mine"],
  ["저 로봇들은 그녀의 것이다.", "hers"],
];

const walkInstrA =
  "다음 문장의 뜻을 생각하며 인칭대명사의 소유격을 따라 써 보세요. 한국어 뜻과 알맞은 영어 소유격 단어를 짝지어 연결하세요.";
const walkInstrB =
  "다음 문장의 뜻을 생각하며 소유대명사를 따라 써 보세요. 한국어 뜻과 알맞은 영어 소유대명사를 짝지어 연결하세요.";

const walk = {
  practiceId: "r1:u07:walk",
  title: "Grammar Walk",
  subtitle: "소유격 · 소유대명사 따라쓰기 (p. 108–109)",
  pages: "108–109",
  timerMinutes: 20,
  introKo:
    "Section A 2문항(짝 맞추기 10쌍), Section B 2문항(짝 맞추기 10쌍)입니다. 왼쪽 한국어 뜻과 오른쪽 영어 단어를 연결하세요.",
  sections: [
    {
      id: "A",
      title: "Section A — 인칭대명사 소유격",
      instructionKo: walkInstrA,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["A1", "A2"],
    },
    {
      id: "B",
      title: "Section B — 소유대명사",
      instructionKo: walkInstrB,
      answerMode: "match",
      answerModeTag: "Match · 짝 맞추기",
      itemCount: 2,
      exampleCount: 0,
      labels: ["B1", "B2"],
    },
  ],
  items: [
    matchItem("a01", "A", "A1", walkInstrA, walkA.slice(0, 7), "문장 1–7"),
    matchItem("a02", "A", "A2", walkInstrA, walkA.slice(7), "문장 8–10", 8),
    matchItem("b01", "B", "B1", walkInstrB, walkB.slice(0, 7), "문장 1–7"),
    matchItem("b02", "B", "B2", walkInstrB, walkB.slice(7), "문장 8–10", 8),
  ],
};

const runInstrA =
  "다음 문장에서 인칭대명사의 소유격을 찾아 동그라미 하세요. 동그라미 할 소유격 단어만 빈칸에 쓰세요.";
const runInstrB = "다음 문장에서 소유대명사를 찾아 동그라미 하세요. 동그라미 할 소유대명사만 빈칸에 쓰세요.";

const runA = [
  ["His nose is long.", "His", true],
  ["Its nose is long.", "Its"],
  ["Your sister is smart.", "Your"],
  ["Her brother is smart.", "Her"],
  ["My sisters are thin.", "My"],
  ["He is her dad.", "her"],
  ["She is my mom.", "my"],
  ["She is their grandma.", "their"],
  ["She is his grandma.", "his"],
  ["He is our grandpa.", "our"],
];

const runB = [
  ["This is mine.", "mine", true],
  ["That is hers.", "hers"],
  ["The bat is mine.", "mine"],
  ["The bat is his.", "his"],
  ["The kite is yours.", "yours"],
  ["The kites are theirs.", "theirs"],
  ["This doll is hers.", "hers"],
  ["That doll is his.", "his"],
  ["These toys are ours.", "ours"],
  ["Those toys are yours.", "yours"],
];

function runItems(section, rows, instr) {
  return rows.map((row, i) => {
    const [sent, ans, ex] = row;
    const id = `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = ex
      ? { example: true, displayOnly: true, exampleAnswer: ans }
      : {};
    return fillItem(id, section, label, instr, sent, [ans, ans.charAt(0).toUpperCase() + ans.slice(1)], extra);
  });
}

const run = {
  practiceId: "r1:u07:run",
  title: "Grammar Run",
  subtitle: "소유격 · 소유대명사 찾기 (p. 110–111)",
  pages: "110–111",
  timerMinutes: 20,
  introKo: "Section A 9문항, Section B 9문항(예시 각 1개). 문장에서 찾은 단어만 쓰세요.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: runInstrA,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: runInstrB,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [...runItems("A", runA, runInstrA), ...runItems("B", runB, runInstrB)],
};

const jumpInstrA =
  "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 알맞은 것을 하나 고르세요.";
const jumpInstrB = jumpInstrA;

const jumpA = [
  ["_____ teacher is short.", ["Ours", "Our"], 2, true],
  ["_____ brother is tall.", ["He", "His"], 2],
  ["_____ sister is cute.", ["Hers", "Her"], 2],
  ["_____ brothers are smart.", ["Your", "Yours"], 1],
  ["_____ eyes are big.", ["My", "Mine"], 1],
  ["_____ ear is long.", ["Its", "It"], 1],
  ["He is _____ dad.", ["mine", "my"], 2],
  ["It is _____ dog.", ["their", "theirs"], 1],
  ["This is _____ piano.", ["her", "hers"], 1],
  ["Those are _____ bikes.", ["theirs", "their"], 2],
];

const jumpB = [
  ["That is _____.", ["her", "hers"], 2, true],
  ["They are _____.", ["yours", "your"], 1],
  ["The pig is _____.", ["hers", "my"], 1],
  ["The monkey is _____.", ["he", "his"], 2],
  ["The umbrella is _____.", ["my", "mine"], 2],
  ["This cap is _____.", ["her", "mine"], 2],
  ["This pencil is _____.", ["your", "yours"], 2],
  ["That house is _____.", ["theirs", "their"], 1],
  ["These shoes are _____.", ["his", "he"], 1],
  ["Those candies are _____.", ["ours", "our"], 1],
];

function jumpItems(section, rows, instr) {
  return rows.map((row, i) => {
    const [prompt, choices, idx, ex] = row;
    const id = `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = ex
      ? { example: true, displayOnly: true, exampleAnswer: choices[idx - 1] }
      : {};
    return mcItem(id, section, label, instr, prompt, choices, idx, extra);
  });
}

const jump = {
  practiceId: "r1:u07:jump",
  title: "Grammar Jump",
  subtitle: "소유격 vs 소유대명사 고르기 (p. 112–113)",
  pages: "112–113",
  timerMinutes: 15,
  introKo: "Section A 9문항, Section B 9문항(예시 각 1개). 괄호 안에서 알맞은 말을 고르세요.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: jumpInstrA,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: jumpInstrB,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [...jumpItems("A", jumpA, jumpInstrA), ...jumpItems("B", jumpB, jumpInstrB)],
};

const flyInstrA =
  "다음 괄호 안의 단어를 알맞은 형태로 바꿔 빈칸에 쓰세요. 빈칸에 들어갈 소유격만 쓰세요.";
const flyInstrB =
  "다음 괄호 안의 단어를 알맞은 형태로 바꿔 빈칸에 쓰세요. 빈칸에 들어갈 소유대명사만 쓰세요.";

const flyA = [
  ["_____ dad is an actor. ( I )", "my", true],
  ["_____ neck is long. ( it )", "its"],
  ["_____ name is Lisa. ( she )", "her"],
  ["_____ skirts are green. ( we )", "our"],
  ["_____ dog is big. ( they )", "their"],
  ["She is _____ teacher. ( he )", "his"],
  ["It is _____ ball. ( you )", "your"],
  ["They are _____ friends. ( I )", "my"],
  ["These are _____ children. ( she )", "her"],
  ["I like _____ sister. ( you )", "your"],
];

const flyB = [
  ["That is _____. ( he )", "his", true],
  ["This is _____. ( you )", "yours"],
  ["That is _____. ( I )", "mine"],
  ["The violin is _____. ( she )", "hers"],
  ["The room is _____. ( we )", "ours"],
  ["The buses are _____. ( they )", "theirs"],
  ["This dog is _____. ( they )", "theirs"],
  ["That bag is _____. ( he )", "his"],
  ["These caps are _____. ( we )", "ours"],
  ["Those pants are _____. ( she )", "hers"],
];

function flyItems(section, rows, instr) {
  return rows.map((row, i) => {
    const [prompt, ans, ex] = row;
    const id = `${section.toLowerCase()}${String(i + 1).padStart(2, "0")}`;
    const label = `${section}${i + 1}`;
    const extra = ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {};
    const caps = ans.charAt(0).toUpperCase() + ans.slice(1);
    const accept = ans === caps ? [ans] : [ans, caps];
    return fillItem(id, section, label, instr, prompt, accept, extra);
  });
}

const fly = {
  practiceId: "r1:u07:fly",
  title: "Grammar Fly",
  subtitle: "소유격 · 소유대명사 바꾸기 (p. 114–115)",
  pages: "114–115",
  timerMinutes: 15,
  introKo: "Section A 9문항, Section B 9문항(예시 각 1개). 괄호 안 주어를 알맞은 형태로 바꿔 쓰세요.",
  sections: [
    {
      id: "A",
      title: "Section A",
      instructionKo: flyInstrA,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
    },
    {
      id: "B",
      title: "Section B",
      instructionKo: flyInstrB,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 9,
      exampleCount: 1,
      labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
    },
  ],
  items: [...flyItems("A", flyA, flyInstrA), ...flyItems("B", flyB, flyInstrB)],
};

const quiz2Instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸 번호에 맞는 소유격 한 단어를 쓰세요.";
const quiz2 = {
  practiceId: "r1:u07:quiz2",
  title: "QUIZ 2 — 소유격 표",
  subtitle: "p. 116",
  pages: "116",
  timerMinutes: 10,
  introKo: "3문항(예시 1개). 표 빈칸 (2)~(4)에 들어갈 소유격을 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 2",
      instructionKo: quiz2Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 3,
      exampleCount: 1,
      labels: ["(2)", "(3)", "(4)"],
    },
  ],
  items: [
    fillItem("q01", "A", "(1)", quiz2Instr, "1인칭 복수 — 우리의", "our", {
      example: true,
      displayOnly: true,
      exampleAnswer: "our",
      promptKo: "표 (1) 1인칭 복수",
    }),
    fillItem("q02", "A", "(2)", quiz2Instr, "2인칭 단수 — 너의", "your", {
      promptKo: "표 (2) 2인칭 단수",
    }),
    fillItem("q03", "A", "(3)", quiz2Instr, "3인칭 단수(그녀) — 그녀의", "her", {
      promptKo: "표 (3) 3인칭 단수(그녀)",
    }),
    fillItem("q04", "A", "(4)", quiz2Instr, "3인칭 복수 — 그들의", "their", {
      promptKo: "표 (4) 3인칭 복수",
    }),
  ],
};

const quiz4Instr = "다음 표의 빈칸에 알맞은 말을 쓰세요. 빈칸 번호에 맞는 소유대명사 한 단어를 쓰세요.";
const quiz4 = {
  practiceId: "r1:u07:quiz4",
  title: "QUIZ 4 — 소유대명사 표",
  subtitle: "p. 117",
  pages: "117",
  timerMinutes: 10,
  introKo: "3문항(예시 1개). 표 빈칸 (2)~(4)에 들어갈 소유대명사를 쓰세요.",
  sections: [
    {
      id: "A",
      title: "QUIZ 4",
      instructionKo: quiz4Instr,
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      itemCount: 3,
      exampleCount: 1,
      labels: ["(2)", "(3)", "(4)"],
    },
  ],
  items: [
    fillItem("q01", "A", "(1)", quiz4Instr, "1인칭 단수 — 나의 것", "mine", {
      example: true,
      displayOnly: true,
      exampleAnswer: "mine",
      promptKo: "표 (1) 1인칭 단수",
    }),
    fillItem("q02", "A", "(2)", quiz4Instr, "1인칭 복수 — 우리의 것", "ours", {
      promptKo: "표 (2) 1인칭 복수",
    }),
    fillItem("q03", "A", "(3)", quiz4Instr, "2인칭 복수 — 너희의 것", "yours", {
      promptKo: "표 (3) 2인칭 복수",
    }),
    fillItem("q04", "A", "(4)", quiz4Instr, "3인칭 복수 — 그들의 것", "theirs", {
      promptKo: "표 (4) 3인칭 복수",
    }),
  ],
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, data] of [
  ["walk.json", walk],
  ["run.json", run],
  ["jump.json", jump],
  ["fly.json", fly],
  ["quiz2.json", quiz2],
  ["quiz4.json", quiz4],
]) {
  write(name, data);
  console.log("wrote", name, data.items.filter((i) => !i.displayOnly).length, "graded");
}
