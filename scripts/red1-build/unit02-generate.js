/* Generate data/red1/unit02/*.json — RedZap 1 Unit 02 명사 (1) */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit02");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-02",
  unitTitle: "Unit 02 — 명사 (1)",
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

function mcItem(id, section, label, choices, accept, extra = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn: extra.promptEn || "",
    choices,
    accept: [accept],
    ...extra,
  };
}

function fillItem(id, section, label, prompt, accept, extra = {}) {
  const blanks = extra.blanks || 1;
  const answerMode = extra.answerMode || "words";
  const tag =
    blanks > 1
      ? "Words · 빈칸 말만"
      : answerMode === "sentence"
        ? "Sentence · 문장 전체"
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

const CAT = {
  person: "사람",
  place: "장소",
  thing: "사물",
  life: "동물·식물",
  abstract: "안 보이는 것",
};

function writeWalk() {
  const instrA =
    "다음 명사의 뜻을 생각하며 단어를 따라 써 보세요. 영어 단어와 우리말 뜻을 짝지어 연결하세요.";
  const instrB =
    "다음 셀 수 있는 명사의 뜻을 생각하며 단어를 따라 써 보세요. 영어 단어와 우리말 뜻을 짝지어 연결하세요.";
  const instrC =
    "다음 셀 수 없는 명사의 뜻을 생각하며 단어를 따라 써 보세요. 영어 단어와 우리말 뜻을 짝지어 연결하세요.";

  const walkA = [
    ["boy", "남자아이"],
    ["woman", "여자"],
    ["room", "방"],
    ["house", "집"],
    ["apple", "사과"],
    ["dog", "개"],
    ["pencil", "연필"],
    ["book", "책"],
    ["love", "사랑"],
    ["idea", "생각"],
  ];
  const walkB = [
    ["girl", "여자아이"],
    ["boy", "남자아이"],
    ["cup", "컵"],
    ["pencil", "연필"],
    ["bag", "가방"],
  ];
  const walkC = [
    ["sand", "모래"],
    ["paper", "종이"],
    ["water", "물"],
    ["love", "사랑"],
    ["snow", "눈"],
  ];

  const items = [];
  chunk(walkA, 5).forEach((g, i) => {
    const pairs = g.map(([l, r]) => ({ left: l, right: r }));
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: `명사 ${g[0][0]}–${g[g.length - 1][0]}`,
      })
    );
  });
  items.push(
    matchItem(
      "b01",
      "B",
      "B1",
      walkB.map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrB, promptKo: "셀 수 있는 명사" }
    )
  );
  items.push(
    matchItem(
      "c01",
      "C",
      "C1",
      walkC.map(([l, r]) => ({ left: l, right: r })),
      { sectionInstructionKo: instrC, promptKo: "셀 수 없는 명사" }
    )
  );

  const practice = {
    practiceId: "r1:u02:walk",
    title: "Grammar Walk",
    subtitle: "명사 따라쓰기 · 뜻 짝 맞추기 (p. 26–27)",
    pages: "26–27",
    timerMinutes: 20,
    introKo:
      "Section A 2문항(명사 뜻 짝 맞추기 10쌍), B·C 각 1문항(셀 수 있는/없는 명사 5쌍)입니다.",
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
        itemCount: 1,
        exampleCount: 0,
        labels: ["B1"],
      },
      {
        id: "C",
        title: "Section C",
        instructionKo: instrC,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 1,
        exampleCount: 0,
        labels: ["C1"],
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "walk.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeRun() {
  const instrA = "다음 명사들을 알맞게 연결하세요. 명사와 종류(사람·장소·사물·동물·식물·안 보이는 것)를 짝지어 연결하세요.";
  const instrB =
    "다음 명사가 셀 수 있는 명사이면 C, 셀 수 없는 명사이면 U에 체크표 하세요. C 또는 U를 고르세요.";

  const runA = [
    ["pencil", CAT.thing],
    ["bag", CAT.thing],
    ["dog", CAT.life],
    ["flower", CAT.life],
    ["peace", CAT.abstract],
    ["love", CAT.abstract],
    ["house", CAT.place],
    ["room", CAT.place],
  ];

  const runB = [
    ["bag", "1", true],
    ["flower", "1"],
    ["milk", "2"],
    ["cup", "1"],
    ["apple", "1"],
    ["time", "2"],
    ["pencil", "1"],
    ["peace", "2"],
    ["sand", "2"],
    ["tea", "2"],
    ["paper", "2"],
  ];

  const items = [];
  chunk(runA, 4).forEach((g, i) => {
    const pairs = g.map(([l, r]) => ({ left: l, right: r }));
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: g.map((x) => x[0]).join(", "),
      })
    );
  });

  runB.forEach((row, i) => {
    const n = i + 1;
    const id = `b${String(n).padStart(2, "0")}`;
    const base = mcItem(id, "B", `B${n}`, ["C", "U"], row[1], {
      sectionInstructionKo: instrB,
      promptEn: row[0],
      image: `assets/img/red1/unit02/run-b${String(n).padStart(2, "0")}.png`,
      promptKo: row[0],
    });
    if (row[2]) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1] === "1" ? "C" : "U";
    }
    items.push(base);
  });

  const practice = {
    practiceId: "r1:u02:run",
    title: "Grammar Run",
    subtitle: "명사 종류 · C/U (p. 28–29)",
    pages: "28–29",
    timerMinutes: 20,
    introKo: "Section A 2문항(종류 짝 맞추기 8쌍), B 10문항(C/U 고르기, 예시 1개)입니다.",
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
        answerMode: "choice",
        answerModeTag: "Choose · 고르기",
        itemCount: 10,
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
  const instrA = "다음 그림에 알맞은 명사를 골라 동그라미 하세요.";
  const instrB = "다음 그림을 보면서 알맞은 명사를 골라 동그라미 하세요.";

  const jumpA = [
    ["boy", ["boy", "cup"], "1", true],
    ["bag", ["bag", "love"], "1"],
    ["tiger", ["woman", "tiger"], "2"],
    ["tree", ["man", "tree"], "2"],
    ["girl", ["girl", "juice"], "1"],
    ["park", ["pencil", "park"], "2"],
    ["cow", ["cow", "room"], "1"],
    ["rabbit", ["time", "rabbit"], "2"],
    ["peace", ["house", "peace"], "2"],
    ["city", ["city", "cat"], "1"],
  ];

  const jumpB = [
    ["cup", ["cup", "water"], "1", true],
    ["cow", ["cow", "peace"], "1"],
    ["boy", ["paper", "boy"], "2"],
    ["dog", ["dog", "juice"], "1"],
    ["room", ["room", "love"], "1"],
    ["sand", ["cat", "sand"], "2"],
    ["milk", ["milk", "girl"], "1"],
    ["snow", ["cat", "snow"], "2"],
    ["water", ["water", "bag"], "1"],
    ["paper", ["paper", "man"], "1"],
  ];

  const items = [];
  jumpA.forEach((row, i) => {
    const n = i + 1;
    const id = `a${String(n).padStart(2, "0")}`;
    const base = mcItem(id, "A", `A${n}`, row[1], row[2], {
      sectionInstructionKo: instrA,
      image: `assets/img/red1/unit02/jump-a${String(n).padStart(2, "0")}.png`,
      promptKo: `그림 ${n}`,
    });
    if (row[3]) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1][Number(row[2]) - 1];
    }
    items.push(base);
  });

  jumpB.forEach((row, i) => {
    const n = i + 1;
    const id = `b${String(n).padStart(2, "0")}`;
    const base = mcItem(id, "B", `B${n}`, row[1], row[2], {
      sectionInstructionKo: instrB,
      image: `assets/img/red1/unit02/jump-b${String(n).padStart(2, "0")}.png`,
      promptKo: `그림 ${n}`,
    });
    if (row[3]) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = row[1][Number(row[2]) - 1];
    }
    items.push(base);
  });

  const practice = {
    practiceId: "r1:u02:jump",
    title: "Grammar Jump",
    subtitle: "그림 · 명사 고르기 (p. 30–31)",
    pages: "30–31",
    timerMinutes: 15,
    introKo: "Section A 9문항, B 9문항(고르기, 각 예시 1개)입니다.",
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

function catAccept(short) {
  const map = {
    사람: ["사람", "(사람)"],
    장소: ["장소", "(장소)"],
    사물: ["사물", "(사물)"],
    "동물·식물": ["동물·식물", "(동물·식물)", "식물", "(식물)"],
    "안 보이는 것": ["안 보이는 것", "(안 보이는 것)"],
  };
  return map[short] || [short];
}

function writeFly() {
  const instrA =
    "다음 주어진 명사들의 뜻을 생각하며 알맞은 말을 골라 빈칸에 순서대로 쓰세요. 한 칸에 한 단어(영어)만 쓰세요.";

  const flyA = [
    { cat: "사람", words: [{ w: "girl", example: true }, { w: "boy" }, { w: "man" }, { w: "Tom" }] },
    { cat: "장소", words: ["park", "city", "house", "room"] },
    { cat: "사물", words: ["bag", "book", "pencil", "cup"] },
    { cat: "동물·식물", words: ["flower", "rabbit", "tiger", "tree"] },
    { cat: "안 보이는 것", words: ["love", "peace", "time", "idea"] },
  ];

  const flyBCount = ["dog", "book", "tiger", "pencil", "girl", "cup", "cat", "woman", "tree"];
  const flyBUncount = ["water", "time", "sand", "love", "milk", "paper", "peace", "snow"];

  const items = [];
  let ai = 1;
  for (const block of flyA) {
    for (const entry of block.words) {
      const w = typeof entry === "string" ? entry : entry.w;
      const id = `a${String(ai).padStart(2, "0")}`;
      const base = fillItem(id, "A", `A${ai}`, w, w, {
        sectionInstructionKo: instrA,
        promptKo: `${block.cat}`,
      });
      if (entry.example) {
        base.example = true;
        base.displayOnly = true;
        base.exampleAnswer = w;
      }
      items.push(base);
      ai++;
    }
  }

  let bi = 1;
  flyBCount.forEach((w, wi) => {
    const id = `b${String(bi).padStart(2, "0")}`;
    const base = fillItem(id, "B", `C${wi + 1}`, w, w, {
      sectionInstructionKo:
        "다음 주어진 명사들의 뜻을 생각하며 알맞은 말을 골라 빈칸에 순서대로 쓰세요. 셀 수 있는 명사 칸에 영어 단어를 쓰세요.",
      promptKo: `셀 수 있는 명사 — ${wi + 1}`,
    });
    if (wi === 0) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = "bag";
      base.promptEn = "bag";
    }
    items.push(base);
    bi++;
  });
  flyBUncount.forEach((w, wi) => {
    const id = `b${String(bi).padStart(2, "0")}`;
    items.push(
      fillItem(id, "B", `U${wi + 1}`, w, w, {
        sectionInstructionKo:
          "다음 주어진 명사들의 뜻을 생각하며 알맞은 말을 골라 빈칸에 순서대로 쓰세요. 셀 수 없는 명사 칸에 영어 단어를 쓰세요.",
        promptKo: `셀 수 없는 명사 — ${wi + 1}`,
      })
    );
    bi++;
  });

  const practice = {
    practiceId: "r1:u02:fly",
    title: "Grammar Fly",
    subtitle: "명사 종류 · C/U 분류 (p. 32–33)",
    pages: "32–33",
    timerMinutes: 18,
    introKo:
      "Section A 19문항(종류별 단어, girl 예시), B 16문항(셀 수 있는 9·없는 8, bag 예시)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 19,
        exampleCount: 1,
        labels: Array.from({ length: 19 }, (_, i) => `A${i + 2}`).slice(0, 19),
      },
      {
        id: "B",
        title: "Section B",
        instructionKo:
          "다음 주어진 명사들의 뜻을 생각하며 알맞은 말을 골라 빈칸에 순서대로 쓰세요. 셀 수 있는/없는 명사 칸에 영어 단어를 쓰세요.",
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 16,
        exampleCount: 1,
        labels: Array.from({ length: 16 }, (_, i) => `B${i + 2}`),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "fly.json"), JSON.stringify(practice, null, 2) + "\n");
}

function writeQuiz2() {
  const instr =
    "다음 명사의 뜻을 빈칸에 쓰고 어떤 명사의 이름인지 괄호 안에 쓰세요. 뜻과 구분 두 칸에 | 로 나누어 각각 쓰세요.";
  const rows = [
    ["girl", "여자아이", "사람", true],
    ["man", ["남자", "남성"], "사람"],
    ["tree", ["나무", "나무(식물)"], "동물·식물"],
    ["love", "사랑", "안 보이는 것"],
    ["cup", "컵", "사물"],
    ["bag", "가방", "사물"],
    ["time", "시간", "안 보이는 것"],
    ["park", "공원", "장소"],
  ];

  const items = rows.map((row, i) => {
    const n = i + 1;
    const id = `q${String(n).padStart(2, "0")}`;
    const meanings = Array.isArray(row[1]) ? row[1] : [row[1]];
    const accept = [];
    for (const m of meanings) {
      for (const c of catAccept(row[2])) {
        accept.push(`${m}|${c}`);
      }
    }
    const base = fillItem(id, "A", String(n), row[0], accept, {
      sectionInstructionKo: instr,
      blanks: 2,
      promptKo: `단어: ${row[0]}`,
    });
    if (row[3]) {
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = `${meanings[0]}|${row[2]}`;
    }
    return base;
  });

  const practice = {
    practiceId: "r1:u02:quiz2",
    title: "QUIZ 2 — 명사 뜻·종류",
    subtitle: "p. 34",
    pages: "34",
    timerMinutes: 15,
    introKo: "7문항(예시 1개). 뜻과 구분(사람·장소·사물·동물·식물·안 보이는 것)을 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
        exampleCount: 1,
        labels: rows.slice(1).map((_, i) => String(i + 2)),
      },
    ],
    items,
    ...META,
  };
  fs.writeFileSync(path.join(OUT, "quiz2.json"), JSON.stringify(practice, null, 2) + "\n");
}

function cuAccept(meaning, letter) {
  const L = letter.toUpperCase();
  const out = [];
  for (const m of (Array.isArray(meaning) ? meaning : [meaning])) {
    out.push(`${m}|${L}`);
    out.push(`${m}|(${L})`);
    out.push(`${m}|${L === "C" ? "c" : "u"}`);
  }
  return [...new Set(out)];
}

function writeQuiz4() {
  const instr =
    "다음 단어의 뜻을 빈칸에 쓰고 그 단어가 셀 수 있는 명사이면 C를, 셀 수 없는 명사이면 U를 괄호 안에 쓰세요. 뜻과 C/U 두 칸에 | 로 나누어 쓰세요.";
  const rows = [
    ["flower", "꽃", "C", true],
    ["snow", "눈", "U"],
    ["boy", ["남자아이", "소년"], "C"],
    ["milk", "우유", "U"],
    ["juice", "주스", "U"],
    ["book", "책", "C"],
    ["house", "집", "C"],
    ["paper", "종이", "U"],
  ];

  const items = rows.map((row, i) => {
    const n = i + 1;
    const id = `q${String(n).padStart(2, "0")}`;
    const accept = cuAccept(row[1], row[2]);
    const base = fillItem(id, "A", String(n), row[0], accept, {
      sectionInstructionKo: instr,
      blanks: 2,
      promptKo: `단어: ${row[0]}`,
    });
    if (row[3]) {
      const m = Array.isArray(row[1]) ? row[1][0] : row[1];
      base.example = true;
      base.displayOnly = true;
      base.exampleAnswer = `${m}|${row[2]}`;
    }
    return base;
  });

  const practice = {
    practiceId: "r1:u02:quiz4",
    title: "QUIZ 4 — C/U와 뜻",
    subtitle: "p. 35",
    pages: "35",
    timerMinutes: 12,
    introKo: "7문항(예시 1개). 우리말 뜻과 C 또는 U를 쓰세요.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 7,
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
console.log("Wrote Red 1 Unit 02 practices to", OUT);
