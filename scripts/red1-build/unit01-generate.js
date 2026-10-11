/* Generate data/red1/unit01/*.json — RedZap 1 Unit 01 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit01");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-01",
  unitTitle: "Unit 01 — 알파벳과 수 세기",
  sectionsVersion: 1,
};

const NUM_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

function vowelsDistinct(word) {
  const V = "aeiou";
  const out = [];
  for (const ch of word.toLowerCase()) {
    if (V.includes(ch) && !out.includes(ch)) out.push(ch);
  }
  return out;
}

function writeWalk() {
  const instrA =
    "다음 알파벳을 읽으며 대문자와 소문자를 따라 써 보세요. 화면에서 대문자와 소문자를 짝지어 연결하세요.";
  const instrB =
    "다음 단어의 뜻을 생각하며 단어를 따라 써 보세요. 숫자와 영어 숫자 단어를 짝지어 연결하세요.";
  const upper = ALPHA;
  const lower = ALPHA.map((c) => c.toLowerCase());
  const groups = chunk(upper, 7);
  const items = [];
  let n = 1;
  groups.forEach((g, gi) => {
    const pairs = g.map((L, i) => ({ left: L, right: lower[gi * 7 + i] }));
    items.push(
      matchItem(`a${String(n).padStart(2, "0")}`, "A", `A${n}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: `알파벳 ${g[0]}–${g[g.length - 1]}`,
      })
    );
    n++;
  });
  const numGroups = chunk(
    NUM_WORDS.map((w, i) => ({ n: String(i + 1), w })),
    7
  );
  let m = 1;
  numGroups.forEach((g) => {
    const pairs = g.map((x) => ({ left: x.n, right: x.w }));
    items.push(
      matchItem(`b${String(m).padStart(2, "0")}`, "B", `B${m}`, pairs, {
        sectionInstructionKo: instrB,
        promptKo: `${g[0].n}–${g[g.length - 1].n}`,
      })
    );
    m++;
  });
  const practice = {
    practiceId: "r1:u01:walk",
    title: "Grammar Walk",
    subtitle: "알파벳 · 숫자 따라쓰기 (p. 12–13)",
    pages: "12–13",
    timerMinutes: 20,
    introKo:
      "Section A 4문항(대·소문자 짝 맞추기), Section B 3문항(숫자·영어 단어 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — 알파벳",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 4,
        exampleCount: 0,
        labels: ["A1", "A2", "A3", "A4"],
      },
      {
        id: "B",
        title: "Section B — 숫자 단어",
        instructionKo: instrB,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 3,
        exampleCount: 0,
        labels: ["B1", "B2", "B3"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "walk.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeRun() {
  const instrA =
    "다음 알파벳을 따라 쓴 후, 같은 알파벳을 찾아 동그라미 하세요. 보기와 같이 같은 글자를 고르세요.";
  const instrB = "다음에서 모음에 해당하는 알파벳을 찾아 동그라미 하세요. 모음 글자만 빈칸에 쓰세요.";
  const instrC = "다음 중 숫자를 나타내는 단어를 찾아 동그라미 하세요. 숨은 영어 숫자 단어를 쓰세요.";
  const runA = [
    ["C", ["Z", "W", "C", "H"], "3"],
    ["F", ["B", "F", "K", "G"], "2"],
    ["L", ["Y", "L", "I", "N"], "2"],
    ["J", ["J", "M", "X", "Q"], "1"],
    ["P", ["B", "K", "A", "P"], "4"],
    ["b", ["b", "d", "p", "q"], "1"],
    ["d", ["c", "d", "p", "b"], "2"],
    ["r", ["o", "v", "r", "t"], "3"],
    ["n", ["m", "n", "w", "z"], "2"],
    ["g", ["g", "q", "b", "d"], "1"],
  ];
  const runBWords = [
    "gorilla",
    "orangutan",
    "iguana",
    "koala",
    "dinosaur",
    "umbrella",
    "trousers",
    "supermarket",
  ];
  const runC = [
    "oneatreegg",
    "networedog",
    "obeanthree",
    "fouroomeet",
    "earoofiveye",
    "meetubusix",
    "sevenutray",
    "treeightie",
    "nidleanine",
    "catenoodle",
    "eelevenear",
    "twelvetuck",
    "foothirteen",
    "fourteenod",
    "stuffifteen",
    "sixteenurse",
    "eraseventeen",
    "eighteenod",
    "vanineteen",
    "beltwentyell",
  ];
  const items = [];
  items.push(
    mcItem("a01", "A", "A1", "C", ["Z", "W", "C", "H"], "3", {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: "C",
    })
  );
  runA.slice(1).forEach((row, i) => {
    items.push(
      mcItem(`a${String(i + 2).padStart(2, "0")}`, "A", `A${i + 2}`, row[0], row[1], row[2], {
        sectionInstructionKo: instrA,
      })
    );
  });
  items.push(
    fillItem("b01", "B", "B1", "gorilla", vowelsDistinct("gorilla").join("|"), {
      sectionInstructionKo: instrB,
      blanks: 3,
      unordered: true,
      example: true,
      displayOnly: true,
      exampleAnswer: "o, i, a",
    })
  );
  runBWords.slice(1).forEach((w, i) => {
    const vs = vowelsDistinct(w);
    items.push(
      fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", `B${i + 2}`, w, vs.join("|"), {
        sectionInstructionKo: instrB,
        blanks: vs.length,
        unordered: true,
      })
    );
  });
  items.push(
    fillItem("c01", "C", "C1", "oneatreegg", "one", {
      sectionInstructionKo: instrC,
      example: true,
      displayOnly: true,
      exampleAnswer: "one",
    })
  );
  runC.slice(1).forEach((s, i) => {
    items.push(
      fillItem(`c${String(i + 2).padStart(2, "0")}`, "C", `C${i + 2}`, s, NUM_WORDS[i + 1], {
        sectionInstructionKo: instrC,
      })
    );
  });
  const practice = {
    practiceId: "r1:u01:run",
    title: "Grammar Run",
    subtitle: "알파벳 · 모음 · 숫자 단어 (p. 14–15)",
    pages: "14–15",
    timerMinutes: 20,
    introKo: "Section A 9문항(고르기), B 7문항(모음 쓰기), C 19문항(숫자 단어)입니다.",
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
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 1,
        labels: ["B2", "B3", "B4", "B5", "B6", "B7", "B8"],
      },
      {
        id: "C",
        title: "Section C",
        instructionKo: instrC,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 19,
        exampleCount: 1,
        labels: runC.slice(1).map((_, i) => `C${i + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "run.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeJump() {
  const instrA = "다음 알파벳과 짝이 되는 글자를 골라 동그라미 하세요.";
  const instrB = "다음 그림에 알맞은 단어를 골라 동그라미 하세요.";
  const jumpA = [
    ["B", ["b", "d"], "1"],
    ["C", ["s", "c"], "2"],
    ["D", ["g", "d"], "2"],
    ["P", ["p", "q"], "1"],
    ["R", ["r", "w"], "1"],
    ["E", ["v", "e"], "2"],
    ["J", ["j", "i"], "1"],
    ["M", ["n", "m"], "2"],
    ["V", ["v", "w"], "1"],
    ["G", ["g", "q"], "1"],
    ["a", ["H", "A"], "2"],
    ["f", ["F", "E"], "1"],
    ["h", ["F", "H"], "2"],
    ["i", ["I", "J"], "1"],
    ["l", ["B", "L"], "2"],
    ["k", ["K", "D"], "1"],
    ["n", ["Q", "N"], "2"],
    ["t", ["T", "Y"], "1"],
    ["u", ["V", "U"], "2"],
    ["o", ["O", "Q"], "1"],
  ];
  const jumpB = [
    { img: "jump-b01.png", choices: ["two", "three"], accept: "1" },
    { img: "jump-b02.png", choices: ["five", "four"], accept: "2" },
    { img: "jump-b03.png", choices: ["six", "seven"], accept: "1" },
    { img: "jump-b04.png", choices: ["eight", "ten"], accept: "1" },
    { img: "jump-b05.png", choices: ["nine", "one"], accept: "1" },
    { img: "jump-b06.png", choices: ["fourteen", "eleven"], accept: "2" },
    { prompt: "12", choices: ["two", "twelve"], accept: "2" },
    { prompt: "13", choices: ["thirteen", "three"], accept: "1" },
    { prompt: "15", choices: ["five", "fifteen"], accept: "2" },
    { prompt: "17", choices: ["seven", "seventeen"], accept: "2" },
    { prompt: "18", choices: ["eighteen", "nineteen"], accept: "1" },
    { prompt: "20", choices: ["twenty", "twelve"], accept: "1" },
  ];
  const items = [];
  items.push(
    mcItem("a01", "A", "A1", "B", ["b", "d"], "1", {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: "b",
    })
  );
  jumpA.slice(1).forEach((row, i) => {
    items.push(
      mcItem(`a${String(i + 2).padStart(2, "0")}`, "A", `A${i + 2}`, row[0], row[1], row[2], {
        sectionInstructionKo: instrA,
      })
    );
  });
  jumpB.forEach((row, i) => {
    const id = `b${String(i + 1).padStart(2, "0")}`;
    const label = `B${i + 1}`;
    const extra = {
      sectionInstructionKo: instrB,
      image: row.img ? `assets/img/red1/unit01/${row.img}` : undefined,
      promptEn: row.prompt || undefined,
    };
    if (i === 0) {
      items.push(
        mcItem(id, "B", label, row.prompt || "연필", row.choices, row.accept, {
          ...extra,
          promptKo: "연필 2개",
          example: true,
          displayOnly: true,
          exampleAnswer: row.choices[0],
        })
      );
    } else {
      items.push(mcItem(id, "B", label, row.prompt || "", row.choices, row.accept, extra));
    }
  });
  const practice = {
    practiceId: "r1:u01:jump",
    title: "Grammar Jump",
    subtitle: "짝 맞는 글자 · 그림 (p. 16–17)",
    pages: "16–17",
    timerMinutes: 15,
    introKo: "Section A 19문항(고르기), B 11문항(그림·숫자 고르기)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 19,
        exampleCount: 1,
        labels: jumpA.slice(1).map((_, i) => `A${i + 2}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 11,
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
    "다음 단어의 알파벳을 대문자는 소문자로, 소문자는 대문자로 바꿔 쓰세요. 빈칸에 알맞은 단어를 쓰세요.";
  const instrB = "다음 그림과 숫자를 보고 빈칸에 알맞은 영어 단어를 쓰세요.";
  const flyA = [
    ["DOG", "dog"],
    ["CAT", "cat"],
    ["BIRD", "bird"],
    ["FISH", "fish"],
    ["LEMON", "lemon"],
    ["zebra", "ZEBRA"],
    ["tiger", "TIGER"],
    ["cow", "COW"],
    ["rabbit", "RABBIT"],
    ["lion", "LION"],
  ];
  const flyB = [
    [1, "one"],
    [3, "three"],
    [7, "seven"],
    [8, "eight"],
    [10, "ten"],
    [11, "eleven"],
    [12, "twelve"],
    [13, "thirteen"],
    [14, "fourteen"],
    [20, "twenty"],
  ];
  const items = [];
  flyA.forEach((row, i) => {
    items.push(
      fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, row[0], row[1], {
        sectionInstructionKo: instrA,
        answerMode: "words",
      })
    );
  });
  flyB.forEach((row, i) => {
    items.push(
      fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, String(row[0]), row[1], {
        sectionInstructionKo: instrB,
        image: `assets/img/red1/unit01/fly-b${String(i + 1).padStart(2, "0")}.png`,
        promptKo: `숫자 ${row[0]}`,
      })
    );
  });
  const practice = {
    practiceId: "r1:u01:fly",
    title: "Grammar Fly",
    subtitle: "대·소문자 바꾸기 · 숫자 단어 (p. 18–19)",
    pages: "18–19",
    timerMinutes: 15,
    introKo: "Section A 10문항(단어 쓰기), B 10문항(그림·숫자 보고 단어 쓰기)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 10,
        exampleCount: 0,
        labels: flyA.map((_, i) => `A${i + 1}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 10,
        exampleCount: 0,
        labels: flyB.map((_, i) => `B${i + 1}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr =
    "다음 알파벳과 짝이 되는 알파벳 대·소문자를 빈칸에 쓰세요. 한 글자만 쓰세요.";
  const pairs = [
    ["A", "a"],
    ["B", "b"],
    ["C", "c"],
    ["D", "d"],
    ["e", "E"],
    ["f", "F"],
    ["g", "G"],
    ["h", "H"],
    ["I", "i"],
    ["J", "j"],
    ["K", "k"],
    ["L", "l"],
    ["m", "M"],
    ["n", "N"],
    ["o", "O"],
    ["p", "P"],
    ["Q", "q"],
    ["R", "r"],
    ["S", "s"],
    ["T", "t"],
    ["u", "U"],
    ["v", "V"],
    ["w", "W"],
    ["x", "X"],
    ["Y", "y"],
    ["Z", "z"],
  ];
  const items = pairs.map((p, i) => {
    const n = i + 1;
    const id = `q${String(n).padStart(2, "0")}`;
    const base = fillItem(id, "A", String(n), p[0], p[1], {
      sectionInstructionKo: instr,
      answerMode: "words",
      answerModeTag: "Letter · 한 글자",
    });
    if (n === 1) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = p[1];
    }
    return base;
  });
  const practice = {
    practiceId: "r1:u01:quiz2",
    title: "QUIZ 2 — 알파벳 대·소문자",
    subtitle: "p. 20",
    pages: "20",
    timerMinutes: 15,
    introKo: "26문항(예시 1개). 짝이 되는 대·소문자 한 글자를 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Letter · 한 글자",
        itemCount: 25,
        exampleCount: 1,
        labels: pairs.slice(1).map((_, i) => String(i + 2)),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr = "다음 숫자에 알맞은 영어 단어를 빈칸에 쓰세요.";
  const rows = [
    [2, "two"],
    [4, "four"],
    [5, "five"],
    [8, "eight"],
    [9, "nine"],
    [11, "eleven"],
    [12, "twelve"],
    [13, "thirteen"],
    [15, "fifteen"],
    [18, "eighteen"],
    [20, "twenty"],
  ];
  const given = [1, 3, 6, 7, 10, 14, 16, 17, 19];
  const givenWords = ["one", "three", "six", "seven", "ten", "fourteen", "sixteen", "seventeen", "nineteen"];
  const items = rows.map((row, i) => {
    const n = i + 1;
    const id = `q${String(n).padStart(2, "0")}`;
    const prompt = `${row[0]}`;
    const base = fillItem(id, "A", String(n), prompt, row[1], {
      sectionInstructionKo: instr,
      promptKo: `숫자 ${row[0]}`,
    });
    if (n === 1) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1];
    }
    return base;
  });
  const practice = {
    practiceId: "r1:u01:quiz4",
    title: "QUIZ 4 — 영어 숫자 단어",
    subtitle: "p. 21",
    pages: "21",
    timerMinutes: 12,
    introKo: "11문항(예시 1개). 숫자에 맞는 영어 단어를 쓰세요. (책 표: " + given.join(", ") + " → " + givenWords.join(", ") + ")",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 10,
        exampleCount: 1,
        labels: rows.slice(1).map((_, i) => String(i + 2)),
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
console.log("Wrote Red 1 Unit 01 practices to", OUT);
