/* Generate data/red1/unit03/*.json — RedZap 1 Unit 03 명사 (2) */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/red1/unit03");

const META = {
  bookId: "zap-red-1",
  bookTitle: "ZAP Red 1",
  appName: "RedZap 1",
  unitId: "unit-03",
  unitTitle: "Unit 03 — 명사 (2)",
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
    choices,
    accept: [accept],
    ...extra,
  };
}

function fillItem(id, section, label, accept, extra = {}) {
  const blanks = extra.blanks || 1;
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: extra.sectionInstructionKo,
    answerMode: extra.answerMode || "words",
    answerModeTag: extra.answerModeTag || "Words · 빈칸 말만",
    label,
    type: "fill",
    blanks,
    accept: Array.isArray(accept) ? accept : [accept],
    ...extra,
  };
}

function writeJson(name, practice) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify({ ...practice, ...META }, null, 2) + "\n");
}

function writeWalk() {
  const instrA =
    "그림을 보면서 다음 명사의 단수형과 복수형을 따라 써 보세요. 한글 뜻과 영어 복수형을 짝지어 연결하세요.";
  const instrB =
    "그림을 보면서 다음 명사의 단수형과 복수형을 따라 써 보세요. 한글 뜻과 영어 복수형을 짝지어 연결하세요.";
  const walkAKo = {
    pen: "펜",
    box: "상자",
    bus: "버스",
    bench: "벤치",
    dish: "접시",
    tomato: "토마토",
    baby: "아기",
    boy: "남자아이",
  };
  const walkBKo = {
    leaf: "나뭇잎",
    knife: "칼",
    man: "남자",
    woman: "여자",
    child: "어린이",
    mouse: "쥐",
    foot: "발",
    sheep: "양",
  };
  const walkA = [
    ["pen", "pens"],
    ["box", "boxes"],
    ["bus", "buses"],
    ["bench", "benches"],
    ["dish", "dishes"],
    ["tomato", "tomatoes"],
    ["baby", "babies"],
    ["boy", "boys"],
  ];
  const walkB = [
    ["leaf", "leaves"],
    ["knife", "knives"],
    ["man", "men"],
    ["woman", "women"],
    ["child", "children"],
    ["mouse", "mice"],
    ["foot", "feet"],
    ["sheep", "sheep"],
  ];
  const items = [];
  chunk(walkA, 4).forEach((g, i) => {
    const pairs = g.map(([sing, pl]) => ({ left: walkAKo[sing], right: pl }));
    items.push(
      matchItem(`a${String(i + 1).padStart(2, "0")}`, "A", `A${i + 1}`, pairs, {
        sectionInstructionKo: instrA,
        promptKo: g.map((x) => walkAKo[x[0]]).join(", "),
      })
    );
  });
  chunk(walkB, 4).forEach((g, i) => {
    const pairs = g.map(([sing, pl]) => ({ left: walkBKo[sing], right: pl }));
    items.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, pairs, {
        sectionInstructionKo: instrB,
        promptKo: g.map((x) => walkBKo[x[0]]).join(", "),
      })
    );
  });
  writeJson("walk.json", {
    practiceId: "r1:u03:walk",
    title: "Grammar Walk",
    subtitle: "단수·복수 따라쓰기 (p. 44–45)",
    pages: "44–45",
    timerMinutes: 18,
    introKo: "Section A·B 각 2문항(한글 뜻↔영어 복수형 짝 맞추기, 4쌍씩)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A — 규칙 복수",
        instructionKo: instrA,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["A1", "A2"],
      },
      {
        id: "B",
        title: "Section B — 불규칙·동형",
        instructionKo: instrB,
        answerMode: "match",
        answerModeTag: "Match · 짝 맞추기",
        itemCount: 2,
        exampleCount: 0,
        labels: ["B1", "B2"],
      },
    ],
    items,
  });
}

function writeRun() {
  const instrA =
    "다음을 알맞게 연결한 후, 명사의 복수형을 따라 써 보세요. 단수 명사의 복수형을 빈칸에 쓰세요.";
  const instrB = "다음 명사의 복수형을 찾아 선으로 연결하세요. 단수형과 복수형을 짝지어 연결하세요.";
  const runA = [
    ["pen", "pens"],
    ["egg", "eggs"],
    ["monkey", "monkeys"],
    ["glass", "glasses"],
    ["ax", "axes"],
    ["bench", "benches"],
    ["dish", "dishes"],
    ["potato", "potatoes"],
    ["candy", "candies"],
    ["lady", "ladies"],
  ];
  const runB = [
    ["foot", "feet"],
    ["deer", "deer"],
    ["tooth", "teeth"],
    ["knife", "knives"],
    ["wolf", "wolves"],
    ["leaf", "leaves"],
    ["man", "men"],
    ["child", "children"],
    ["mouse", "mice"],
    ["sheep", "sheep"],
  ];
  const itemsA = runA.map(([sing, pl], i) =>
    fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), [pl], {
      sectionInstructionKo: instrA,
      promptEn: sing,
      promptKo: `단수: ${sing}`,
    })
  );
  const itemsB = [];
  chunk(runB, 7).forEach((g, i) => {
    const pairs = g.map(([l, r]) => ({ left: l, right: r }));
    itemsB.push(
      matchItem(`b${String(i + 1).padStart(2, "0")}`, "B", `B${i + 1}`, pairs, {
        sectionInstructionKo: instrB,
        promptKo: g.map((x) => x[0]).join(", "),
      })
    );
  });
  writeJson("run.json", {
    practiceId: "r1:u03:run",
    title: "Grammar Run",
    subtitle: "복수형 규칙·불규칙 (p. 46–47)",
    pages: "46–47",
    timerMinutes: 20,
    introKo: "Section A 10문항(복수형 쓰기), B 2문항(단수↔복수 짝 맞추기)입니다.",
    sections: [
      {
        id: "A",
        title: "Section A",
        instructionKo: instrA,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 말만",
        itemCount: 10,
        exampleCount: 0,
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
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
    items: [...itemsA, ...itemsB],
  });
}

function writeJump() {
  const instrA = "다음 명사의 알맞은 복수형을 골라 동그라미 하세요.";
  const instrB = "다음 명사의 알맞은 복수형을 골라 동그라미 하세요.";
  const jumpA = [
    { word: "ball", choices: ["balls", "balles"], accept: "1", ex: true },
    { word: "bird", choices: ["birds", "birdes"], accept: "1" },
    { word: "bus", choices: ["buses", "busies"], accept: "1" },
    { word: "fox", choices: ["foxes", "foxies"], accept: "1" },
    { word: "watch", choices: ["watchs", "watches"], accept: "2" },
    { word: "dish", choices: ["dishs", "dishes"], accept: "2" },
    { word: "tomato", choices: ["tomatos", "tomatoes"], accept: "2" },
    { word: "baby", choices: ["babys", "babies"], accept: "2" },
    { word: "key", choices: ["keys", "keies"], accept: "1" },
    { word: "eraser", choices: ["erasers", "eraseres"], accept: "1" },
  ];
  const jumpB = [
    { word: "man", choices: ["mans", "men"], accept: "2", ex: true },
    { word: "woman", choices: ["women", "womans"], accept: "1" },
    { word: "child", choices: ["childs", "children"], accept: "2" },
    { word: "mouse", choices: ["mice", "mouses"], accept: "1" },
    { word: "sheep", choices: ["sheeps", "sheep"], accept: "2" },
    { word: "foot", choices: ["feet", "foots"], accept: "1" },
    { word: "ox", choices: ["oxes", "oxen"], accept: "2" },
    { word: "goose", choices: ["geese", "gooses"], accept: "1" },
    { word: "tooth", choices: ["teeth", "toothes"], accept: "1" },
    { word: "deer", choices: ["deer", "deers"], accept: "1" },
  ];
  const itemsA = jumpA.map((row, i) =>
    mcItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), row.choices, row.accept, {
      sectionInstructionKo: instrA,
      promptEn: row.word,
      image: `assets/img/red1/unit03/jump-a${String(i + 1).padStart(2, "0")}.png`,
      ...(row.ex
        ? {
            example: true,
            displayOnly: true,
            exampleAnswer: row.choices[Number(row.accept) - 1],
          }
        : {}),
    })
  );
  const itemsB = jumpB.map((row, i) =>
    mcItem(`b${String(i + 1).padStart(2, "0")}`, "B", String(i + 1), row.choices, row.accept, {
      sectionInstructionKo: instrB,
      promptEn: row.word,
      image: `assets/img/red1/unit03/jump-b${String(i + 1).padStart(2, "0")}.png`,
      ...(row.ex
        ? {
            example: true,
            displayOnly: true,
            exampleAnswer: row.choices[Number(row.accept) - 1],
          }
        : {}),
    })
  );
  writeJson("jump.json", {
    practiceId: "r1:u03:jump",
    title: "Grammar Jump",
    subtitle: "복수형 고르기 (p. 48–49)",
    pages: "48–49",
    timerMinutes: 15,
    introKo: "Section A·B 각 10문항(예시 1개). 그림과 단수 명사를 보고 복수형을 고르세요.",
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
    items: [...itemsA, ...itemsB],
  });
}

function writeFly() {
  const instrA = "다음 빈칸에 알맞은 말을 쓰세요. 복수형 명사만 쓰세요.";
  const instrB =
    "다음 그림을 보고 주어진 단어를 사용하여 빈칸에 알맞은 말을 쓰세요. 수량과 복수형을 함께 쓰세요.";
  const flyA = [
    { prompt: "one book → two", accept: "books", ex: true },
    { prompt: "one girl → three", accept: "girls" },
    { prompt: "one bus → two", accept: "buses" },
    { prompt: "one box → four", accept: "boxes" },
    { prompt: "one bench → five", accept: "benches" },
    { prompt: "one dish → six", accept: "dishes" },
    { prompt: "one tomato → seven", accept: "tomatoes" },
    { prompt: "one lady → eight", accept: "ladies" },
    { prompt: "one boy → nine", accept: "boys" },
    { prompt: "one monkey → ten", accept: "monkeys" },
  ];
  const flyB = [
    { word: "wolf", count: "two", accept: "two wolves", ex: true },
    { word: "leaf", count: "four", accept: "four leaves" },
    { word: "man", count: "two", accept: "two men" },
    { word: "mouse", count: "four", accept: "four mice" },
    { word: "child", count: "three", accept: "three children" },
    { word: "sheep", count: "five", accept: "five sheep" },
    { word: "tooth", count: "four", accept: "four teeth" },
    { word: "ox", count: "two", accept: "two oxen" },
    { word: "woman", count: "two", accept: "two women" },
    { word: "goose", count: "three", accept: "three geese" },
  ];
  const itemsA = flyA.map((row, i) =>
    fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", String(i + 1), [row.accept], {
      sectionInstructionKo: instrA,
      promptEn: row.prompt,
      ...(row.ex ? { example: true, displayOnly: true, exampleAnswer: row.accept } : {}),
    })
  );
  const itemsB = flyB.map((row, i) =>
    fillItem(`b${String(i + 1).padStart(2, "0")}`, "B", String(i + 1), [row.accept], {
      sectionInstructionKo: instrB,
      promptEn: `${row.count} ______ (${row.word})`,
      image: `assets/img/red1/unit03/fly-b${String(i + 1).padStart(2, "0")}.png`,
      answerMode: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      ...(row.ex ? { example: true, displayOnly: true, exampleAnswer: row.accept } : {}),
    })
  );
  writeJson("fly.json", {
    practiceId: "r1:u03:fly",
    title: "Grammar Fly",
    subtitle: "복수형 쓰기 (p. 50–51)",
    pages: "50–51",
    timerMinutes: 18,
    introKo: "Section A·B 각 10문항(예시 1개). A는 복수형만, B는 수량+복수형 문장을 쓰세요.",
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
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        itemCount: 9,
        exampleCount: 1,
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      },
    ],
    items: [...itemsA, ...itemsB],
  });
}

function quizRow(id, section, label, word, acceptRows, instr) {
  const accept = acceptRows.map(([ko, plural, koPl]) => `${ko}|${plural}|${koPl}`);
  return fillItem(id, section, label, accept, {
    sectionInstructionKo: instr,
    promptEn: word,
    promptKo: `${word} — 뜻 · 복수형 · 복수 뜻`,
    blanks: 3,
    answerModeTag: "Words · 빈칸 3개",
  });
}

function writeQuiz2() {
  const instr =
    "다음 단어의 뜻과 복수형을 빈칸에 쓰세요. 한글 뜻, 영어 복수형, 한글 복수 뜻 순으로 쓰세요.";
  const rows = [
    {
      w: "egg",
      accept: [["달걀", "eggs", "달걀들"], ["계란", "eggs", "계란들"]],
    },
    { w: "bus", accept: [["버스", "buses", "버스들"]] },
    { w: "box", accept: [["상자", "boxes", "상자들"]] },
    { w: "bench", accept: [["벤치", "benches", "벤치들"]] },
    {
      w: "dish",
      accept: [["접시", "dishes", "접시들"], ["그릇", "dishes", "그릇들"]],
    },
    { w: "tomato", accept: [["토마토", "tomatoes", "토마토들"]] },
    { w: "baby", accept: [["아기", "babies", "아기들"]] },
  ];
  const items = rows.map((row, i) =>
    quizRow(`q${String(i + 2).padStart(2, "0")}`, "A", String(i + 2), row.w, row.accept, instr)
  );
  writeJson("quiz2.json", {
    practiceId: "r1:u03:quiz2",
    title: "QUIZ 2 — 규칙 복수",
    subtitle: "p. 52",
    pages: "52",
    timerMinutes: 15,
    introKo: "7문항(표 2–8행). 만화 1번은 학습용 — 채점 없음.",
    sections: [
      {
        id: "A",
        title: "QUIZ 2",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 3개",
        itemCount: 7,
        exampleCount: 0,
        labels: ["2", "3", "4", "5", "6", "7", "8"],
      },
    ],
    items,
  });
}

function writeQuiz4() {
  const instr =
    "다음 단어의 뜻과 복수형을 빈칸에 쓰세요. 한글 뜻, 영어 복수형, 한글 복수 뜻 순으로 쓰세요.";
  const rows = [
    { w: "knife", accept: [["칼", "knives", "칼들"]] },
    { w: "wolf", accept: [["늑대", "wolves", "늑대들"]] },
    { w: "ox", accept: [["황소", "oxen", "황소들"]] },
    { w: "child", accept: [["어린이", "children", "어린이들"]] },
    { w: "foot", accept: [["발", "feet", "발들"]] },
    {
      w: "mouse",
      accept: [["쥐", "mice", "쥐들"], ["생쥐", "mice", "생쥐들"]],
    },
    { w: "sheep", accept: [["양", "sheep", "양들"]] },
  ];
  const items = rows.map((row, i) =>
    quizRow(`q${String(i + 2).padStart(2, "0")}`, "A", String(i + 2), row.w, row.accept, instr)
  );
  writeJson("quiz4.json", {
    practiceId: "r1:u03:quiz4",
    title: "QUIZ 4 — 불규칙 복수",
    subtitle: "p. 53",
    pages: "53",
    timerMinutes: 15,
    introKo: "7문항(표 2–8행). 만화 3번은 학습용 — 채점 없음.",
    sections: [
      {
        id: "A",
        title: "QUIZ 4",
        instructionKo: instr,
        answerMode: "words",
        answerModeTag: "Words · 빈칸 3개",
        itemCount: 7,
        exampleCount: 0,
        labels: ["2", "3", "4", "5", "6", "7", "8"],
      },
    ],
    items,
  });
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
