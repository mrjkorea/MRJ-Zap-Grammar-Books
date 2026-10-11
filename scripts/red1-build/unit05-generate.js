/* Generate data/red1/unit05/*.json — RedZap 1 Unit 05 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit05");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-05",
  unitTitle: "Unit 05 — 인칭대명사와 지시대명사",
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

function writeWalk() {
  const instrA =
    "다음 단어의 뜻을 생각하며 인칭대명사를 따라 써 보세요. 우리말 뜻과 영어 인칭대명사를 짝지어 연결하세요.";
  const instrB =
    "다음 말의 뜻을 생각하며 지시대명사 또는 지시형용사를 따라 써 보세요. 우리말 뜻과 영어 단어를 짝지어 연결하세요.";
  const pairsA1 = [
    { left: "나", right: "I" },
    { left: "너", right: "you" },
    { left: "그", right: "he" },
    { left: "그녀", right: "she" },
    { left: "그것", right: "it" },
    { left: "우리", right: "we" },
    { left: "너희", right: "you" },
  ];
  const items = [
    matchItem("a01", "A", "A1", pairsA1, {
      sectionInstructionKo: instrA,
      promptKo: "인칭대명사 1–7",
    }),
    matchItem("a02", "A", "A2", [{ left: "그들", right: "they" }], {
      sectionInstructionKo: instrA,
      promptKo: "사람 여럿",
    }),
    matchItem("a03", "A", "A3", [{ left: "그것들", right: "they" }], {
      sectionInstructionKo: instrA,
      promptKo: "사물 여럿",
    }),
    matchItem(
      "b01",
      "B",
      "B1",
      [
        { left: "이것", right: "this" },
        { left: "이것들", right: "these" },
        { left: "저것", right: "that" },
        { left: "저것들", right: "those" },
      ],
      { sectionInstructionKo: instrB, promptKo: "지시대명사" }
    ),
    matchItem(
      "b02",
      "B",
      "B2",
      [
        { left: "이 상자", right: "this" },
        { left: "저 상자", right: "that" },
        { left: "이 상자들", right: "these" },
        { left: "저 상자들", right: "those" },
      ],
      { sectionInstructionKo: instrB, promptKo: "지시형용사 + box" }
    ),
  ];
  const practice = {
    practiceId: "r1:u05:walk",
    title: "Grammar Walk",
    subtitle: "인칭·지시대명사 따라쓰기 (p. 76–77)",
    pages: "76–77",
    timerMinutes: 20,
    introKo:
      "Section A 3문항(인칭대명사 짝 맞추기), B 2문항(지시대명사·형용사 짝 맞추기)입니다. 왼쪽을 누른 다음 오른쪽을 눌러 연결하세요.",
    sections: [
      {
        id: "A",
        title: "Section A — 인칭대명사",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 3,
        exampleCount: 0,
        labels: ["A1", "A2", "A3"],
      },
      {
        id: "B",
        title: "Section B — 지시대명사",
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
  const instrA = "다음 중 인칭대명사를 찾아 동그라미 하세요. 알맞은 인칭대명사를 고르세요.";
  const instrB =
    "다음 문장에서 지시대명사 또는 지시형용사를 찾아 동그라미 하세요. 알맞은 말을 고르세요.";
  const demo = ["this", "that", "these", "those"];
  const runA = [
    ["one I cat the", ["one", "I", "cat", "the"], "2"],
    ["bird singer he park", ["bird", "singer", "he", "park"], "3"],
    ["you dog two woman", ["you", "dog", "two", "woman"], "1"],
    ["foot water an she", ["foot", "water", "an", "she"], "4"],
    ["they bag singer mouse", ["they", "bag", "singer", "mouse"], "1"],
    ["man tooth we Tom", ["man", "tooth", "we", "Tom"], "3"],
    ["juice it violin four", ["juice", "it", "violin", "four"], "2"],
    ["lion desk teacher I", ["lion", "desk", "teacher", "I"], "4"],
    ["piano they ant Seoul", ["piano", "they", "ant", "Seoul"], "2"],
    ["candy child he milk", ["candy", "child", "he", "milk"], "3"],
  ];
  const runB = [
    ["This is a drum.", demo, "1"],
    ["That is a chair.", demo, "2"],
    ["These are taxis.", demo, "3"],
    ["Those are apples.", demo, "4"],
    ["These are watches.", demo, "3"],
    ["Those are erasers.", demo, "4"],
    ["This airplane is blue.", demo, "1"],
    ["That boat is blue.", demo, "2"],
    ["These babies are happy.", demo, "3"],
    ["Those children are happy.", demo, "4"],
  ];
  const items = [];
  items.push(
    mcItem("a01", "A", "A1", runA[0][0], runA[0][1], runA[0][2], {
      sectionInstructionKo: instrA,
      example: true,
      displayOnly: true,
      exampleAnswer: "I",
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
    mcItem("b01", "B", "B1", runB[0][0], runB[0][1], runB[0][2], {
      sectionInstructionKo: instrB,
      example: true,
      displayOnly: true,
      exampleAnswer: "This",
    })
  );
  runB.slice(1).forEach((row, i) => {
    items.push(
      mcItem(`b${String(i + 2).padStart(2, "0")}`, "B", `B${i + 2}`, row[0], row[1], row[2], {
        sectionInstructionKo: instrB,
      })
    );
  });
  const practice = {
    practiceId: "r1:u05:run",
    title: "Grammar Run",
    subtitle: "인칭·지시대명사 찾기 (p. 78–79)",
    pages: "78–79",
    timerMinutes: 20,
    introKo: "Section A 9문항(인칭대명사 고르기), B 9문항(지시대명사·형용사 고르기)입니다.",
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
  const instrA = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const instrB = "다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const jumpA = [
    { promptKo: "나", choices: ["I", "you"], accept: "1" },
    { promptKo: "그녀", choices: ["she", "he"], accept: "1" },
    { promptKo: "그들", choices: ["it", "they"], accept: "2" },
    { promptKo: "그것", choices: ["we", "it"], accept: "2" },
    { promptKo: "너희", choices: ["you", "they"], accept: "1" },
    { promptEn: "we", choices: ["너희", "우리"], accept: "2" },
    { promptEn: "he", choices: ["그", "그녀"], accept: "1" },
    { promptEn: "it", choices: ["그녀", "그것"], accept: "2" },
    { promptEn: "you", choices: ["나", "너"], accept: "2" },
    { promptEn: "they", choices: ["그들", "우리"], accept: "1" },
  ];
  const jumpB = [
    {
      img: "jump-b01.png",
      promptEn: "____ is a lion.",
      choices: ["This", "That"],
      accept: "1",
    },
    {
      img: "jump-b01.png",
      promptEn: "____ is a zebra.",
      choices: ["This", "That"],
      accept: "2",
    },
    {
      img: "jump-b02.png",
      promptEn: "____ is a taxi.",
      choices: ["This", "That"],
      accept: "1",
    },
    {
      img: "jump-b02.png",
      promptEn: "____ is a bus.",
      choices: ["This", "That"],
      accept: "2",
    },
    {
      img: "jump-b03.png",
      promptEn: "____ are potatoes.",
      choices: ["These", "Those"],
      accept: "1",
    },
    {
      img: "jump-b03.png",
      promptEn: "____ are tomatoes.",
      choices: ["These", "Those"],
      accept: "2",
    },
    {
      img: "jump-b04.png",
      promptEn: "____ boy is tall.",
      choices: ["This", "That"],
      accept: "1",
    },
    {
      img: "jump-b04.png",
      promptEn: "____ girl is cute.",
      choices: ["This", "That"],
      accept: "2",
    },
    {
      img: "jump-b05.png",
      promptEn: "____ pants are blue.",
      choices: ["These", "Those"],
      accept: "1",
    },
    {
      img: "jump-b05.png",
      promptEn: "____ skirts are green.",
      choices: ["These", "Those"],
      accept: "2",
    },
  ];
  const items = [];
  jumpA.forEach((row, i) => {
    const id = `a${String(i + 1).padStart(2, "0")}`;
    const label = `A${i + 1}`;
    const extra = { sectionInstructionKo: instrA };
    if (row.promptKo) extra.promptKo = row.promptKo;
    if (row.promptEn) extra.promptEn = row.promptEn;
    const isExample = i === 0 || i === 5;
    if (isExample) {
      const ans =
        i === 0
          ? row.choices[0]
          : row.choices[Number(row.accept) - 1];
      items.push(
        mcItem(id, "A", label, row.promptEn || row.promptKo, row.choices, row.accept, {
          ...extra,
          example: true,
          displayOnly: true,
          exampleAnswer: ans,
        })
      );
    } else {
      items.push(
        mcItem(id, "A", label, row.promptEn || row.promptKo, row.choices, row.accept, extra)
      );
    }
  });
  jumpB.forEach((row, i) => {
    const id = `b${String(i + 1).padStart(2, "0")}`;
    const label = `B${i + 1}`;
    const extra = {
      sectionInstructionKo: instrB,
      image: `assets/img/red1/unit05/${row.img}`,
      promptEn: row.promptEn,
    };
    if (i === 0) {
      items.push(
        mcItem(id, "B", label, row.promptEn, row.choices, row.accept, {
          ...extra,
          example: true,
          displayOnly: true,
          exampleAnswer: "This",
        })
      );
    } else {
      items.push(mcItem(id, "B", label, row.promptEn, row.choices, row.accept, extra));
    }
  });
  const practice = {
    practiceId: "r1:u05:jump",
    title: "Grammar Jump",
    subtitle: "인칭·지시대명사 고르기 (p. 80–81)",
    pages: "80–81",
    timerMinutes: 15,
    introKo: "Section A 8문항(한·영 고르기), B 9문항(그림·문장 고르기)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 8,
        exampleCount: 2,
        labels: ["A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10"],
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 9,
        exampleCount: 1,
        labels: jumpB.slice(1).map((_, j) => `B${j + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "jump.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeFly() {
  const instrA = "다음 그림에 알맞은 말을 찾아 빈칸에 쓰세요. 단어 상자에서 알맞은 인칭대명사를 쓰세요.";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 밑줄 친 우리말에 맞는 지시대명사 또는 지시형용사를 쓰세요.";
  const flyA = [
    { img: "fly-a01.png", accept: "she", example: true },
    { img: "fly-a02.png", accept: "I", promptKo: "나" },
    { img: "fly-a03.png", accept: "you", promptKo: "너" },
    { img: "fly-a04.png", accept: "they", promptKo: "달리는 아이들" },
    { img: "fly-a05.png", accept: "it", promptKo: "레몬" },
    { img: "fly-a06.png", accept: "you", promptKo: "너희" },
    { img: "fly-a07.png", accept: "he", promptKo: "남자" },
    { img: "fly-a08.png", accept: "we", promptKo: "우리" },
  ];
  const flyB = [
    { promptEn: "This is an ox.", promptKo: "이것은", accept: "This", example: true },
    { promptEn: "____ is a violin.", promptKo: "저것은", accept: "That" },
    { promptEn: "____ is a park.", promptKo: "저것은", accept: "That" },
    { promptEn: "____ are geese.", promptKo: "이것들은", accept: "These" },
    { promptEn: "____ are pencils.", promptKo: "이것들은", accept: "These" },
    { promptEn: "____ are bikes.", promptKo: "저것들은", accept: "Those" },
    { promptEn: "____ apple is green.", promptKo: "저", accept: "That" },
    { promptEn: "____ ball is small.", promptKo: "이", accept: "This" },
    { promptEn: "____ cups are blue.", promptKo: "저", accept: "Those" },
    { promptEn: "____ actors are tall.", promptKo: "이", accept: "These" },
  ];
  const items = [];
  flyA.forEach((row, i) => {
    const id = `a${String(i + 1).padStart(2, "0")}`;
    const label = `A${i + 1}`;
    const extra = {
      sectionInstructionKo: instrA,
      image: `assets/img/red1/unit05/${row.img}`,
      promptKo: row.promptKo,
    };
    if (row.example) {
      items.push(
        fillItem(id, "A", label, "she", row.accept, {
          ...extra,
          example: true,
          displayOnly: true,
          exampleAnswer: row.accept,
        })
      );
    } else {
      items.push(fillItem(id, "A", label, "____", row.accept, extra));
    }
  });
  flyB.forEach((row, i) => {
    const id = `b${String(i + 1).padStart(2, "0")}`;
    const label = `B${i + 1}`;
    const extra = {
      sectionInstructionKo: instrB,
      promptKo: row.promptKo,
    };
    if (row.example) {
      items.push(
        fillItem(id, "B", label, row.promptEn, row.accept, {
          ...extra,
          example: true,
          displayOnly: true,
          exampleAnswer: row.accept,
        })
      );
    } else {
      items.push(fillItem(id, "B", label, row.promptEn, row.accept, extra));
    }
  });
  const practice = {
    practiceId: "r1:u05:fly",
    title: "Grammar Fly",
    subtitle: "인칭·지시대명사 쓰기 (p. 82–83)",
    pages: "82–83",
    timerMinutes: 15,
    introKo: "Section A 7문항(그림·인칭대명사), B 9문항(지시대명사·형용사)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 1,
        labels: flyA.slice(1).map((_, j) => `A${j + 2}`),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo: instrB,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 9,
        exampleCount: 1,
        labels: flyB.slice(1).map((_, j) => `B${j + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 복수 칸에 알맞은 인칭대명사를 영어로 쓰세요.";
  const rows = [
    { label: "2", promptKo: "너희", accept: "you" },
    { label: "3", promptKo: "그들", accept: "they" },
    { label: "4", promptKo: "그것들", accept: "they" },
  ];
  const items = rows.map((r, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", r.label, "____", r.accept, {
      sectionInstructionKo: instr,
      promptKo: r.promptKo,
    })
  );
  const practice = {
    practiceId: "r1:u05:quiz2",
    title: "QUIZ 2 — 인칭대명사 표",
    subtitle: "p. 84",
    pages: "84",
    timerMinutes: 12,
    introKo: "3문항. 표의 빈칸에 알맞은 인칭대명사를 쓰세요. (1번 we는 책 예시)",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 3,
        exampleCount: 0,
        labels: ["2", "3", "4"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz4() {
  const instr =
    "다음 표의 빈칸에 알맞은 말을 쓰세요. 지시대명사·지시형용사 표를 완성하세요.";
  const rows = [
    { label: "2", promptKo: "저것들, 저 사람들", accept: "those" },
    { label: "3", promptKo: "이 여자아이", accept: "this girl" },
    { label: "4", promptKo: "저 남자아이들", accept: "those boys" },
  ];
  const items = rows.map((r, i) =>
    fillItem(`q${String(i + 1).padStart(2, "0")}`, "A", r.label, "____", r.accept, {
      sectionInstructionKo: instr,
      promptKo: r.promptKo,
      blanks: r.accept.includes(" ") ? 2 : 1,
      accept: r.accept.includes(" ") ? [r.accept.replace(" ", "|")] : [r.accept],
    })
  );
  const practice = {
    practiceId: "r1:u05:quiz4",
    title: "QUIZ 4 — 지시대명사 표",
    subtitle: "p. 85",
    pages: "85",
    timerMinutes: 12,
    introKo: "3문항. 표의 빈칸을 채우세요. (1번 these는 책 예시)",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 3,
        exampleCount: 0,
        labels: ["2", "3", "4"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz4.json"), JSON.stringify(practice, null, 2) + "\n");
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  writeWalk();
  writeRun();
  writeJump();
  writeFly();
  writeQuiz2();
  writeQuiz4();
  console.log("Wrote", OUT);
}

main();
