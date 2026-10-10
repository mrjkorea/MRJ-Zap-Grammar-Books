/* Generate data/blue3/unit01/*.json — run: node scripts/blue3-build/unit01-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue3/unit01");
const META = {
  bookId: "zap-blue-3",
  bookTitle: "ZAP Blue 3",
  appName: "BlueZap 3",
  unitId: "unit-01",
  unitTitle: "Unit 01 — 조동사 (1)",
};

const CIRC = ["①", "②", "③", "④"];

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return { id, title, instructionKo, directionKo, ruleKo, answerMode, answerModeTag: tag, itemCount, exampleCount, labels };
}

function fillItem(id, section, label, promptEn, accept, opts) {
  opts = opts || {};
  const item = {
    id,
    section,
    sectionTitle: opts.sectionTitle || "Section " + section,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: opts.answerMode || "words",
    answerModeTag: opts.answerModeTag || "Words · 빈칸 말만",
    label,
    type: opts.type || "fill",
    promptEn,
    accept: Array.isArray(accept) ? accept : [accept],
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  if (opts.noteKo) item.noteKo = opts.noteKo;
  if (opts.blanks) item.blanks = opts.blanks;
  if (opts.unordered) item.unordered = true;
  return Object.assign(item, opts.extra || {});
}

function mcItem(id, section, label, promptEn, choices, accept, opts) {
  opts = opts || {};
  const item = {
    id,
    section,
    sectionTitle: opts.sectionTitle || "Section " + section,
    sectionInstructionKo: opts.sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: opts.answerModeTag || "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: Array.isArray(accept) ? accept : [accept],
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  return Object.assign(item, opts.extra || {});
}

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function ul(sentence, phrase) {
  if (!phrase) return sentence;
  const low = sentence.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return sentence;
  return sentence.slice(0, idx) + "<u>" + sentence.slice(idx, idx + phrase.length) + "</u>" + sentence.slice(idx + phrase.length);
}

function cantVariants() {
  return ["can't", "cannot", "can not"];
}

function negPipe(verb) {
  const v = [];
  for (const c of cantVariants()) v.push(c + "|" + verb);
  return v;
}

function numberedChoices(arr) {
  return arr.map((c, i) => CIRC[i] + " " + c);
}

function mcFromPair(id, section, label, promptEn, a, b, correct, instr, promptKo) {
  const choices = [a, b];
  const idx = correct === b ? 1 : 0;
  return mcItem(id, section, label, promptEn, choices, [choices[idx], String(idx + 1)], {
    sectionInstructionKo: instr,
    promptKo,
  });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  const graded = (data.items || []).filter((it) => !it.displayOnly).length;
  console.log("wrote", name, "items:", data.items.length, "graded:", graded);
  return graded;
}

// —— Lesson 01 Walk 1 (p. 12) ——
(function lesson01Walk1() {
  const instrA =
    "다음 문장에서 조동사 can을 찾아 동그라미 하고 동사원형을 찾아 밑줄을 치세요. 빈칸마다 조동사 can과 동사원형을 각각 한 칸에 쓰세요. (순서는 상관없어요.) (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 부정 조동사만 쓰세요. (can't / cannot / can not) (문장 전체를 쓰지 마세요.)";
  const rowsA = [
    { en: "My sister can play the cello.", v: "play", ko: "내 여동생은 첼로를 연주할 수 있다." },
    { en: "Horses can swim in the river.", v: "swim", ko: "말은 강에서 수영할 수 있다." },
    { en: "Jimmy can play baseball.", v: "play", ko: "지미는 야구를 할 수 있다." },
    { en: "They can dance well.", v: "dance", ko: "그들은 춤을 잘 출 수 있다." },
  ];
  const rowsB = [
    { en: "The player can throw a ball high.", ko: "그 선수는 공을 높이 던질 수 있다." },
    { en: "Annie can climb the mountain.", ko: "애니는 그 산을 오를 수 있다." },
    { en: "We can run fast.", ko: "우리는 빨리 달릴 수 있다." },
    { en: "The bird can fly in the sky.", ko: "그 새는 하늘에서 날 수 있다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", ul("Tom can fly a kite.", "fly"), ["can|fly"], {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: "톰은 연을 날릴 수 있다.",
      }),
      "can / fly"
    ),
  ];
  rowsA.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), ul(r.en, r.v), ["can|" + r.v], {
        sectionInstructionKo: instrA,
        blanks: 2,
        unordered: true,
        promptKo: r.ko,
      })
    );
  });
  items.push(
    exItem(
      fillItem("b01", "B", "B1", "I can speak Chinese.\n→ I ______ speak Chinese.", cantVariants(), {
        sectionInstructionKo: instrB,
        promptKo: "나는 중국어를 말할 수 있다.",
      }),
      "can't"
    )
  );
  rowsB.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.en + "\n→ The " + (i === 0 ? "player" : i === 1 ? "Annie" : i === 2 ? "We" : "bird") + " ______ " + r.en.split("can ")[1], cantVariants(), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  // fix B prompts to match book lines
  items[6].promptEn = "The player can throw a ball high.\n→ The player ______ throw a ball high.";
  items[7].promptEn = "Annie can climb the mountain.\n→ Annie ______ climb the mountain.";
  items[8].promptEn = "We can run fast.\n→ We ______ run fast.";
  items[9].promptEn = "The bird can fly in the sky.\n→ The bird ______ fly in the sky.";

  write("lesson01-walk1.json", {
    practiceId: "b3:u01:lesson01-walk1",
    title: "Lesson 01 Walk 1 — 조동사 can",
    subtitle: "can + 동사원형 · 부정문 (p. 12)",
    pages: "12",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 4문항(can+동사원형), Section B 4문항(부정). 예시(A1·B1)는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장에서 조동사 can과 동사원형을 찾으세요.", "빈칸 두 칸에 can과 동사원형을 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "can't / cannot / can not 중 하나만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 01 Walk 2 (p. 14) ——
(function lesson01Walk2() {
  const instrA =
    "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸마다 들어갈 말을 순서대로 한 칸에 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 보기 a~e. 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const matchChoices = ["a. Yes, they can.", "b. No, we can't.", "c. Yes, he can.", "d. Yes, it can.", "e. No, she can't."];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "She can drive a car.\n→ ______ ______ drive a car?", ["Can|she"], {
        sectionInstructionKo: instrA,
        blanks: 2,
        promptKo: "그녀는 자동차를 운전할 수 있다.",
      }),
      "Can / she"
    ),
    fillItem("a02", "A", "A2", "They can ride bicycles.\n→ ______ ______ ride bicycles?", ["Can|they"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "그들은 자전거를 탈 수 있다.",
    }),
    fillItem("a03", "A", "A3", "Bill can take pictures.\n→ ______ Bill ______ pictures?", ["Can|take"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "빌은 사진을 찍을 수 있다.",
    }),
    fillItem("a04", "A", "A4", "Mr. Brown can fix roofs.\n→ ______ Mr. Brown ______ roofs?", ["Can|fix"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "브라운 씨는 지붕을 고칠 수 있다.",
    }),
    fillItem("a05", "A", "A5", "The girls can dance well.\n→ ______ the girls ______ well?", ["Can|dance"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "그 여자아이들은 춤을 잘 출 수 있다.",
    }),
    exItem(
      mcItem("b01", "B", "B1", "Can they swim?", matchChoices, ["a. Yes, they can.", "a"], {
        sectionInstructionKo: instrB,
        promptKo: "그들은 수영을 할 수 있니?",
      }),
      "a. Yes, they can."
    ),
    mcItem("b02", "B", "B2", "Can Melanie read Korean?", matchChoices, ["e. No, she can't.", "e"], {
      sectionInstructionKo: instrB,
      promptKo: "멜라니는 한국어를 읽을 수 있니?",
    }),
    mcItem("b03", "B", "B3", "Can the cat catch mice?", matchChoices, ["d. Yes, it can.", "d"], {
      sectionInstructionKo: instrB,
      promptKo: "그 고양이는 쥐를 잡을 수 있니?",
    }),
    mcItem("b04", "B", "B4", "Can you sing English songs?", matchChoices, ["b. No, we can't.", "b"], {
      sectionInstructionKo: instrB,
      promptKo: "너희는 영어 노래를 부를 수 있니?",
    }),
    mcItem("b05", "B", "B5", "Can he play the piano?", matchChoices, ["c. Yes, he can.", "c"], {
      sectionInstructionKo: instrB,
      promptKo: "그는 피아노를 칠 수 있니?",
    }),
  ];
  write("lesson01-walk2.json", {
    practiceId: "b3:u01:lesson01-walk2",
    title: "Lesson 01 Walk 2 — 조동사 can",
    subtitle: "의문문 · 대답 연결 (p. 14)",
    pages: "14",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 4문항(의문문), Section B 4문항(대답 고르기). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 의문문에 알맞은 대답을 찾아 연결하세요.", "a~e. 중 하나를 고르세요.", "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 01 Run (pp. 15–16) ——
(function lesson01Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장 또는 대화의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 ①·② 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const mcA = [
    ["Peter ( can play / play can ) badminton.", "can play", "play can", "can play"],
    ["My cats ( can swims / can swim ).", "can swim", "can swims", "can swim"],
    ["I ( can fix / can fixing ) a bicycle.", "can fix", "can fixing", "can fix"],
    ["They ( read can / can read ) English books.", "can read", "read can", "can read"],
    ["Her aunt ( can ride / cans ride ) a motorbike.", "can ride", "cans ride", "can ride"],
    ["Kelly ( can't lifts / can't lift ) the box.", "can't lift", "can't lifts", "can't lift"],
    ["Brad's dogs ( can't catch / can't catching ) balls.", "can't catch", "can't catching", "can't catch"],
    ["You and Luna cannot ( solves / solve ) the math problems.", "solve", "solves", "solve"],
    ["He ( cannot drive / doesn't can drive ) a bus.", "cannot drive", "doesn't can drive", "cannot drive"],
    ["She can ( carry / carries ) the heavy bag.", "carry", "carries", "carry"],
    ["Ostriches ( don't can / cannot ) fly.", "cannot", "don't can", "cannot"],
    ["My grandma can ( use / using ) the Internet.", "use", "using", "use"],
    ["I ( cannot play / don't can play ) the flute.", "cannot play", "don't can play", "cannot play"],
    ["The little boy can ( brush / brushes ) his teeth.", "brush", "brushes", "brush"],
    ["We ( not can / cannot ) write letters in English.", "cannot", "not can", "cannot"],
  ];
  const items = [
    exItem(
      mcItem("a01", "A", "A1", mcA[0][0], [mcA[0][1], mcA[0][2]], [mcA[0][3]], { sectionInstructionKo: instrA, promptKo: "피터는 배드minton을 할 수 있다." }),
      "can play"
    ),
  ];
  mcA.slice(1).forEach((row, i) => {
    items.push(
      mcItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], [row[1], row[2]], [row[3]], {
        sectionInstructionKo: instrA,
      })
    );
  });
  const mcB = [
    ["______ play the violin?", "You cans", "Can you", "Can you"],
    ["Can ______ Korean?", "Kelly speak", "Kelly speaks", "Kelly speak"],
    ["Can ______ fish in the sea?", "catch he", "he catch", "he catch"],
    ["______ see well in the dark?", "Can dogs", "Do dogs can", "Can dogs"],
    ["______ run fast?", "Can your sister", "Cans your sister", "Can your sister"],
    ["______ jump the fence?", "Do they can", "Can they", "Can they"],
    ["Can ______ a pumpkin pie?", "your mom bakes", "your mom bake", "your mom bake"],
    ["Can ______ a diary in English?", "you keep", "do you keep", "you keep"],
    ["Can squirrels fly? / No, they ______.", "don't", "can't", "can't"],
    ["Can Ms. Kent dance well? / Yes, ______ can.", "he", "she", "she"],
    ["Can rabbits climb up trees? / No, they ______.", "can", "can't", "can't"],
    ["Can your brothers play tennis? / Yes, ______ can.", "he", "they", "they"],
    ["Can the baby walk? / No, he ______.", "don't", "can't", "can't"],
    ["Can Harry ride a roller coaster? / Yes, he ______.", "can", "can't", "can"],
    ["Can your dad skate well? / No, he ______.", "doesn't", "can't", "can't"],
  ];
  items.push(
    exItem(
      mcItem("b01", "B", "B1", mcB[0][0], numberedChoices([mcB[0][1], mcB[0][2]]), [numberedChoices([mcB[0][1], mcB[0][2]])[1], "2"], {
        sectionInstructionKo: instrB,
      }),
      "Can you"
    )
  );
  mcB.slice(1).forEach((row, i) => {
    const ch = numberedChoices([row[1], row[2]]);
    const ansIdx = row[3] === row[2] ? 1 : 0;
    items.push(
      mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), row[0], ch, [ch[ansIdx], String(ansIdx + 1)], {
        sectionInstructionKo: instrB,
      })
    );
  });
  write("lesson01-run.json", {
    practiceId: "b3:u01:lesson01-run",
    title: "Lesson 01 Run — 조동사 can",
    subtitle: "고르기 · 대화 (pp. 15–16)",
    pages: "15–16",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항, Section B 14문항(고르기). A1·B1 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 고르세요.", "①·② 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 01 Jump (pp. 17–18) ——
(function lesson01Jump() {
  const instrA =
    "다음 문장의 우리말 뜻을 완성하세요. 빈칸에 들어갈 우리말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  const koA = [
    { en: "I can fix the door.", partial: "나는 그 문을 ______.", ans: ["고칠 수 있다"] },
    { en: "Spiders cannot fly.", partial: "거미는 ______.", ans: ["날 수 없다", "날지 못한다"] },
    { en: "Can you write English stories?", partial: "너는 영어 이야기를 ______?", ans: ["쓸 수 있니", "쓸 수 있나요"] },
    { en: "My father can dive into the sea.", partial: "우리 아버지는 바다로 ______.", ans: ["뛰어들 수 있다", "다이빙할 수 있다"] },
    { en: "Amy cannot get up early.", partial: "에이미는 일찍 ______.", ans: ["일어나지 못한다", "일어날 수 없다"] },
    { en: "Can Billy jump over the chair?", partial: "빌리는 그 의자를 ______?", ans: ["뛰어넘을 수 있니", "뛰어넘을 수 있나요"] },
    { en: "They can play basketball well.", partial: "그들은 농구를 잘 ______.", ans: ["할 수 있다", "칠 수 있다"] },
    { en: "We cannot open this bottle.", partial: "우리는 이 병을 ______.", ans: ["열 수 없다", "열지 못한다"] },
    { en: "Can you answer the question?", partial: "너는 그 질문에 ______?", ans: ["대답할 수 있니", "대답할 수 있나요"] },
    { en: "She can tie her shoelace.", partial: "그녀는 자기 신발끈을 ______.", ans: ["묶을 수 있다", "매을 수 있다"] },
    { en: "I cannot swim well.", partial: "나는 수영을 잘 ______.", ans: ["하지 못한다", "못한다", "할 수 없다"] },
    { en: "Can a bird speak?", partial: "새는 ______?", ans: ["말할 수 있니", "말할 수 있나요"] },
    { en: "Laura cannot touch a cat.", partial: "로라는 고양이를 ______.", ans: ["만지지 못한다", "만질 수 없다"] },
    { en: "Jimmy can wash the dishes.", partial: "지미는 ______.", ans: ["설거지를 할 수 있다", "할 수 있다"] },
    { en: "Can you walk on a rope?", partial: "너는 로프 위를 ______?", ans: ["걸을 수 있니", "걸을 수 있나요"] },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", koA[0].en, koA[0].ans, {
        sectionInstructionKo: instrA,
        promptKo: koA[0].partial,
      }),
      "고칠 수 있다"
    ),
  ];
  koA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, r.ans, {
        sectionInstructionKo: instrA,
        promptKo: r.partial,
      })
    );
  });
  const enB = [
    { p: "Sam ______ eat gimchi.", a: negPipe("eat"), b: 2, ko: "샘은 김치를 먹지 못한다." },
    { p: "______ ______ jump over that bar?", a: ["Can|you"], b: 2, ko: "너는 저 봉을 뛰어넘을 수 있니?" },
    { p: "______ ______ write his name in Korean.", a: ["He|can"], b: 2, ko: "그는 자기 이름을 한국어로 쓸 수 있다." },
    { p: "My sister ______ climb up the ladder.", a: cantVariants(), b: 1, ko: "내 여동생은 사다리를 올라가지 못한다." },
    { p: "______ Jamie do taekwondo?", a: ["Can"], b: 1, ko: "제이미는 태권도를 할 수 있니?" },
    { p: "Turtles ______ jump.", a: cantVariants(), b: 1, ko: "거북이는 점프하지 못한다." },
    { p: "______ ______ play the guitar.", a: ["She|can't", "She|cannot", "She|can not"], b: 2, ko: "그녀는 기타를 치지 못한다." },
    { p: "______ you and Minsu ride a roller coaster?", a: ["Can"], b: 1, ko: "너와 민수는 롤러코스터를 탈 수 있니?" },
    { p: "The birds ______ catch worms.", a: ["can"], b: 1, ko: "그 새들은 벌레를 잡을 수 있다." },
    { p: "I ______ touch butterflies.", a: cantVariants(), b: 1, ko: "나는 나비를 만지지 못한다." },
    { p: "______ ______ ski?", a: ["Can|he"], b: 2, ko: "그는 스키를 탈 수 있니?" },
    { p: "They ______ hear low sounds.", a: ["can"], b: 1, ko: "그들은 작은 소리를 들을 수 있다." },
    { p: "The boy ______ ______ milk.", a: negPipe("drink"), b: 2, ko: "그 남자아이는 우유를 마시지 못한다." },
    { p: "______ ______ read Japanese?", a: ["Can|you"], b: 2, ko: "너는 일본어를 읽을 수 있니?" },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", "I ______ make a sandwich.", ["can"], {
        sectionInstructionKo: instrB,
        blanks: 1,
        promptKo: "나는 샌드위치를 만들 수 있다.",
      }),
      "can"
    )
  );
  enB.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrB,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  write("lesson01-jump.json", {
    practiceId: "b3:u01:lesson01-jump",
    title: "Lesson 01 Jump — 조동사 can",
    subtitle: "우리말 완성 · 빈칸 (pp. 17–18)",
    pages: "17–18",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항(우리말), Section B 14문항(영어 빈칸). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장의 우리말 뜻을 완성하세요.", "빈칸에 우리말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 01 Fly (pp. 19–20) ——
(function lesson01Fly() {
  const instrA =
    "다음 문장 또는 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "can과 주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  const fixA = [
    { p: ul("They can speaks English well.", "speaks"), a: ["speak"], b: 1, ko: "그들은 영어를 잘 말할 수 있다." },
    { p: ul("The police officer cans run very fast.", "cans run"), a: ["can|run"], b: 2, ko: "그 경찰관은 매우 빨리 달릴 수 있다." },
    { p: ul("Do can you swim across the river?", "Do can you"), a: ["Can you"], b: 1, ko: "너는 그 강을 가로질러 수영할 수 있니?" },
    { p: ul("He not can lift the rock.", "not can"), a: ["cannot", "can't", "can not"], b: 1, ko: "그는 그 바위를 들어 올리지 못한다." },
    { p: ul("Dad doesn't can cook chicken soup.", "doesn't can"), a: ["can't", "cannot", "can not"], b: 1, ko: "아빠는 닭고기 수프를 요리하지 못하신다." },
    { p: ul("We cannot seeing wind.", "seeing"), a: ["see"], b: 1, ko: "우리는 바람을 볼 수 없다." },
    { p: ul("Snakes don't can hear.", "don't can"), a: ["can't", "cannot", "can not"], b: 1, ko: "뱀은 듣지 못한다." },
    { p: ul("She make can a kite.", "make can"), a: ["can|make"], b: 2, ko: "그녀는 연을 만들 수 있다." },
    { p: ul("The little girl can feeds the cow.", "feeds"), a: ["feed"], b: 1, ko: "그 어린 여자아이는 그 소에게 먹이를 줄 수 있다." },
    { p: ul("Are you can read a map?", "Are you can"), a: ["Can you"], b: 1, ko: "너는 지도를 읽을 수 있니?" },
    { p: ul("My brother can go not to school alone.", "go not"), a: ["cannot go", "can't go", "can not go"], b: 1, ko: "내 남동생은 학교에 혼자 다니지 못한다." },
    { p: ul("Koalas can live not in the jungle.", "live not"), a: ["cannot live", "can't live", "can not live"], b: 1, ko: "코알라는 정글에서 살지 못한다." },
    { p: "Can Tom ride a bike? / No, Tom can.", a: ["can't", "cannot", "can not"], b: 1, ko: "톰은 자전거를 탈 수 있니? / 아니, 못해." },
    { p: "Can Ms. Sawyer use chopsticks? / Yes, she do.", a: ["can"], b: 1, ko: "소여 씨는 젓가락을 사용할 수 있니? / 응, 할 수 있어." },
    { p: "Can you fix the bell? / Yes, I am.", a: ["can"], b: 1, ko: "너는 그 종을 고칠 수 있니? / 응, 할 수 있어." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", fixA[0].p, fixA[0].a, {
        sectionInstructionKo: instrA,
        blanks: 1,
        promptKo: fixA[0].ko,
      }),
      "speak"
    ),
  ];
  fixA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrA,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  const bankB = [
    { p: "We ______ ______ in winter. ( ski )", a: ["can|ski"], b: 2, ko: "우리는 겨울에 스키를 탈 수 있다." },
    { p: "Mr. Page ______ ______ the drums. ( not, play )", a: negPipe("play"), b: 2, ko: "페이지 씨는 드럼을 못 친다." },
    { p: "______ ______ ______ well? ( you, draw )", a: ["Can|you|draw"], b: 3, ko: "너는 그림을 잘 그릴 수 있니?" },
    { p: "Adam ______ ______ the snakes. ( touch )", a: ["can|touch"], b: 2, ko: "아담은 그 뱀들을 만질 수 있다." },
    { p: "Gorillas ______ ______ . ( not, swim )", a: negPipe("swim"), b: 2, ko: "고릴라는 수영을 못한다." },
    { p: "______ ______ ______ this table? ( she, move )", a: ["Can|she|move"], b: 3, ko: "그녀가 이 탁자를 옮길 수 있니?" },
    { p: "Many spiders ______ ______ webs. ( make )", a: ["can|make"], b: 2, ko: "많은 거미들이 거미집을 만들 수 있다." },
    { p: "I ______ ______ spaghetti. ( cook )", a: ["can|cook"], b: 2, ko: "나는 스파게티를 요리할 수 있다." },
    { p: "______ ______ ______ Korean? ( he, speak )", a: ["Can|he|speak"], b: 3, ko: "그는 한국어를 말할 수 있니?" },
    { p: "My dog ______ ______ a ball. ( catch )", a: ["can|catch"], b: 2, ko: "우리 개는 공을 잡을 수 있다." },
    { p: "They ______ ______ a model airplane. ( not, fly )", a: negPipe("fly"), b: 2, ko: "그들은 모형 비행기를 날리지 못한다." },
    { p: "______ ______ ______ basketball? ( you, play )", a: ["Can|you|play"], b: 3, ko: "너희는 농구를 할 수 있니?" },
    { p: "He ______ ______ taekwondo. ( teach )", a: ["can|teach"], b: 2, ko: "그는 태권도를 가르칠 수 있다." },
    { p: "My father ______ ______ the computer. ( not, fix )", a: negPipe("fix"), b: 2, ko: "우리 아버지는 그 컴퓨터를 못 고치신다." },
    { p: "______ ______ ______ cucumbers? ( they, eat )", a: ["Can|they|eat"], b: 3, ko: "그들은 오이를 먹을 수 있니?" },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", bankB[0].p, bankB[0].a, {
        sectionInstructionKo: instrB,
        blanks: 2,
        promptKo: bankB[0].ko,
      }),
      "can / ski"
    )
  );
  bankB.slice(1).forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrB,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  write("lesson01-fly.json", {
    practiceId: "b3:u01:lesson01-fly",
    title: "Lesson 01 Fly — 조동사 can",
    subtitle: "고치기 · can 배열 (pp. 19–20)",
    pages: "19–20",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항(고치기), Section B 14문항(can 배열). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "can과 주어진 말로 문장을 완성하세요.", "빈칸마다 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 02 Walk 1 (p. 22) ——
(function lesson02Walk1() {
  const instrA =
    "다음 문장에서 ‘할 수 있다’라는 의미를 나타내는 말을 찾아 동그라미 하세요. be동사 + able + to를 순서대로 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 두 문장이 같은 뜻이 되도록 빈칸에 알맞은 말을 쓰세요. able to는 인쇄되어 있으므로, 그 앞 빈칸에 be동사(와 not)만 쓰세요. 빈칸마다 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  const rowsA = [
    { en: "You are able to ski.", ko: "너는 스키를 탈 수 있다.", a: ["are|able|to"] },
    { en: "A bear is able to catch fish.", ko: "곰은 물고기를 잡을 수 있다.", a: ["is|able|to"] },
    { en: "We are able to draw a map.", ko: "우리는 지도를 그릴 수 있다.", a: ["are|able|to"] },
    { en: "Snakes are able to climb trees.", ko: "뱀은 나무를 오를 수 있다.", a: ["are|able|to"] },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "I am able to run fast.", ["am|able|to"], {
        sectionInstructionKo: instrA,
        blanks: 3,
        promptKo: "나는 빨리 달릴 수 있다.",
      }),
      "am / able / to"
    ),
  ];
  rowsA.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, r.a, {
        sectionInstructionKo: instrA,
        blanks: 3,
        promptKo: r.ko,
      })
    );
  });
  const rowsB = [
    { stem: "I can read Chinese.", line: "I ______ able to read Chinese.", a: ["am"], b: 1, ko: "나는 중국어를 읽을 수 있다." },
    { stem: "John can't use the washing machine.", line: "John ______ ______ able to use the washing machine.", a: ["is|not", "isn't"], b: 2, ko: "존은 세탁기를 사용하지 못한다." },
    { stem: "The puppies can climb the stairs.", line: "The puppies ______ able to climb the stairs.", a: ["are"], b: 1, ko: "강아지들은 계단을 오를 수 있다." },
    { stem: "She can't make pancakes.", line: "She ______ ______ able to make pancakes.", a: ["is|not", "isn't"], b: 2, ko: "그녀는 팬케이크를 만들지 못한다." },
    { stem: "We can play soccer.", line: "We ______ able to play soccer.", a: ["are"], b: 1, ko: "우리는 축구를 할 수 있다." },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", rowsB[0].stem + "\n→ " + rowsB[0].line, rowsB[0].a, {
        sectionInstructionKo: instrB,
        blanks: 1,
        promptKo: rowsB[0].ko,
      }),
      "am"
    )
  );
  rowsB.slice(1).forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.stem + "\n→ " + r.line, r.a, {
        sectionInstructionKo: instrB,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  write("lesson02-walk1.json", {
    practiceId: "b3:u01:lesson02-walk1",
    title: "Lesson 02 Walk 1 — be able to",
    subtitle: "can과 같은 뜻 · 변환 (p. 22)",
    pages: "22",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 4문항, Section B 4문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "‘할 수 있다’를 나타내는 말을 찾으세요.", "be + able + to를 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "can과 같은 뜻이 되도록 쓰세요.", "able to 앞 빈칸만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 02 Walk 2 (p. 24) ——
(function lesson02Walk2() {
  const instrA =
    "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. be동사와 주어를 순서대로 한 칸에 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 보기 a~e. 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const matchChoices = ["a. Yes, he is.", "b. No, it isn't.", "c. No, I'm not.", "d. Yes, she is.", "e. No, they aren't."];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "She is able to swim.\n→ ______ ______ able to swim?", ["Is|she"], {
        sectionInstructionKo: instrA,
        blanks: 2,
        promptKo: "그녀는 수영을 할 수 있다.",
      }),
      "Is / she"
    ),
    fillItem("a02", "A", "A2", "Andy is able to drive a car.\n→ ______ ______ able to drive a car?", ["Is|Andy"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "앤디는 자동차를 운전할 수 있다.",
    }),
    fillItem("a03", "A", "A3", "They are able to jump over the bar.\n→ ______ ______ able to jump over the bar?", ["Are|they"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "그들은 그 봉을 뛰어넘을 수 있다.",
    }),
    fillItem("a04", "A", "A4", "Tigers are able to climb up trees.\n→ ______ ______ able to climb up trees?", ["Are|tigers"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "호랑이는 나무 위로 올라갈 수 있다.",
    }),
    fillItem("a05", "A", "A5", "That girl is able to catch my ball.\n→ ______ ______ able to catch my ball?", ["Is|that girl"], {
      sectionInstructionKo: instrA,
      blanks: 2,
      promptKo: "저 여자아이는 내 공을 받을 수 있다.",
    }),
    exItem(
      mcItem("b01", "B", "B1", "Is a horse able to fly?", matchChoices, ["b. No, it isn't.", "b"], {
        sectionInstructionKo: instrB,
        promptKo: "말은 날 수 있니?",
      }),
      "b. No, it isn't."
    ),
    mcItem("b02", "B", "B2", "Are they able to walk fast?", matchChoices, ["e. No, they aren't.", "e"], {
      sectionInstructionKo: instrB,
      promptKo: "그들은 빨리 걸을 수 있니?",
    }),
    mcItem("b03", "B", "B3", "Is Tom able to play tennis?", matchChoices, ["a. Yes, he is.", "a"], {
      sectionInstructionKo: instrB,
      promptKo: "톰은 테니스를 칠 수 있니?",
    }),
    mcItem("b04", "B", "B4", "Is she able to make fried eggs?", matchChoices, ["d. Yes, she is.", "d"], {
      sectionInstructionKo: instrB,
      promptKo: "그녀는 달걀 프라이를 만들 수 있니?",
    }),
    mcItem("b05", "B", "B5", "Are you able to write stories?", matchChoices, ["c. No, I'm not.", "c"], {
      sectionInstructionKo: instrB,
      promptKo: "너는 이야기를 쓸 수 있니?",
    }),
  ];
  write("lesson02-walk2.json", {
    practiceId: "b3:u01:lesson02-walk2",
    title: "Lesson 02 Walk 2 — be able to",
    subtitle: "의문문 · 대답 연결 (p. 24)",
    pages: "24",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 4문항, Section B 4문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "의문문으로 바꿔 빈칸을 채우세요.", "be동사와 주어를 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "알맞은 대답을 연결하세요.", "a~e. 중 하나를 고르세요.", "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5"]),
    ],
    items,
  });
})();

// —— Lesson 02 Run (pp. 25–26) ——
(function lesson02Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 ①·② 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const mcA = [
    ["I ( is / am ) able to open the box.", "am", "is", "am"],
    ["You ( is / are ) able to carry the bucket.", "are", "is", "are"],
    ["She ( is / can ) able to teach English.", "is", "can", "is"],
    ["We ( be / are ) able to climb over the wall.", "are", "be", "are"],
    ["They ( can / are ) able to drive a truck.", "are", "can", "are"],
    ["A frog is able to ( catch / catches ) flies.", "catch", "catches", "catch"],
    ["Kevin and Nancy are able to ( skate / skating ) well.", "skate", "skating", "skate"],
    ["Tom is able ( touch / to touch ) his toes.", "to touch", "touch", "to touch"],
    ["The bird ( isn't / aren't ) able to fly high.", "isn't", "aren't", "isn't"],
    ["They ( isn't / aren't ) able to bathe their puppy.", "aren't", "isn't", "aren't"],
    ["Susie ( doesn't / isn't ) able to hit my ball.", "isn't", "doesn't", "isn't"],
    ["We ( cannot / aren't ) able to dive.", "aren't", "cannot", "aren't"],
    ["Those boys ( don't / aren't ) able to play chess.", "aren't", "don't", "aren't"],
    ["The old man ( is not / not is ) able to run fast.", "is not", "not is", "is not"],
    ["A seal ( cannot / is not ) able to sing.", "is not", "cannot", "is not"],
  ];
  const items = [
    exItem(mcItem("a01", "A", "A1", mcA[0][0], [mcA[0][1], mcA[0][2]], [mcA[0][3]], { sectionInstructionKo: instrA }), "am"),
  ];
  mcA.slice(1).forEach((row, i) => {
    items.push(
      mcItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), row[0], [row[1], row[2]], [row[3]], {
        sectionInstructionKo: instrA,
      })
    );
  });
  const mcB = [
    ["______ you able to make a snowman?", "Can", "Are", "Are"],
    ["______ she able to play the piano?", "Can", "Is", "Is"],
    ["______ they able to paint the wall?", "Are", "Do", "Are"],
    ["Are ______ to read the alphabet?", "able you", "you able", "you able"],
    ["Is she ______ catch his ball?", "can", "able to", "able to"],
    ["Are dolphins ______ clap?", "able", "able to", "able to"],
    ["Is he able ______ a computer?", "use", "to use", "to use"],
    ["Are they able ______ on water?", "to walk", "walking", "to walk"],
    ["Are they able to swim? / Yes, they ______.", "are", "aren't", "are"],
    ["Are they able to play golf? / No, they ______.", "are", "aren't", "aren't"],
    ["Is Jack able to ride a bike? / Yes, he ______.", "is", "does", "is"],
    ["Are you able to wink? / No, ______.", "I can't", "I'm not", "I'm not"],
    ["Is Paul able to jump high? / Yes, he ______.", "is", "does", "is"],
    ["Is she able to touch the calf? / No, ______.", "she is", "she isn't", "she isn't"],
    ["Is he able to tie a necktie? / Yes, ______.", "he can", "he is", "he is"],
  ];
  items.push(
    exItem(
      mcItem("b01", "B", "B1", mcB[0][0], numberedChoices([mcB[0][1], mcB[0][2]]), [numberedChoices([mcB[0][1], mcB[0][2]])[1], "2"], {
        sectionInstructionKo: instrB,
      }),
      "Are"
    )
  );
  mcB.slice(1).forEach((row, i) => {
    const ch = numberedChoices([row[1], row[2]]);
    const ansIdx = row[3] === row[2] ? 1 : 0;
    items.push(
      mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), row[0], ch, [ch[ansIdx], String(ansIdx + 1)], {
        sectionInstructionKo: instrB,
      })
    );
  });
  write("lesson02-run.json", {
    practiceId: "b3:u01:lesson02-run",
    title: "Lesson 02 Run — be able to",
    subtitle: "고르기 · 대화 (pp. 25–26)",
    pages: "25–26",
    timerMinutes: 20,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항, Section B 14문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 고르세요.", "①·② 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 02 Jump (pp. 27–28) ——
(function lesson02Jump() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 우리말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  const koA = [
    { en: ul("James is able to fix a car.", "is able to fix"), partial: "제임스는 자동차를 ______.", ans: ["고칠 수 있다"] },
    { en: ul("They are able to speak French.", "are able to speak"), partial: "그들은 프랑스어를 ______.", ans: ["말할 수 있다"] },
    { en: ul("Fred isn't able to bake cookies.", "isn't able to bake"), partial: "프레드는 쿠키를 ______.", ans: ["구울 수 없다", "굽지 못한다"] },
    { en: ul("We aren't able to play volleyball.", "aren't able to play"), partial: "우리는 배구를 ______.", ans: ["하지 못한다", "할 수 없다"] },
    { en: ul("I am able to draw a map.", "am able to draw"), partial: "나는 지도를 ______.", ans: ["그릴 수 있다"] },
    { en: ul("She is able to open the door.", "is able to open"), partial: "그녀는 그 문을 ______.", ans: ["열 수 있다"] },
    { en: ul("Are you able to write your name?", "Are"), partial: "너는 네 이름을 ______?", ans: ["쓸 수 있니", "쓸 수 있나요"] },
    { en: ul("Is a chicken able to fly high?", "Is"), partial: "닭이 높이 ______?", ans: ["날 수 있니", "날 수 있나요"] },
    { en: ul("Whales are not able to live on land.", "are not able to live"), partial: "고래는 육지에서 ______.", ans: ["살 수 없다", "살지 못한다"] },
    { en: ul("They are not able to row the boat.", "are not able to row"), partial: "그들은 배를 ______.", ans: ["젓지 못한다", "젓을 수 없다"] },
    { en: ul("Is Paul able to lift the rock?", "Is"), partial: "폴은 그 바위를 ______?", ans: ["들 수 있니", "들어 올릴 수 있니"] },
    { en: ul("The player is able to run very fast.", "is able to run"), partial: "그 운동선수는 무척 빨리 ______.", ans: ["달릴 수 있다", "뛸 수 있다"] },
    { en: ul("Are the girls able to dance well?", "Are"), partial: "그 여자아이들은 ______?", ans: ["춤출 수 있니", "잘 출 수 있니"] },
    { en: ul("Fish are not able to walk.", "are not able to walk"), partial: "물고기는 ______.", ans: ["걷지 못한다", "걸을 수 없다"] },
    { en: ul("Is he able to ride a horse?", "Is"), partial: "그는 말을 ______?", ans: ["탈 수 있니", "탈 수 있나요"] },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", koA[0].en, koA[0].ans, { sectionInstructionKo: instrA, promptKo: koA[0].partial }),
      "고칠 수 있다"
    ),
  ];
  koA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, r.ans, {
        sectionInstructionKo: instrA,
        promptKo: r.partial,
      })
    );
  });
  const enB = [
    { p: "I ______ able to play chess.", a: ["am"], b: 1, ko: "나는 체스를 둘 수 있다." },
    { p: "Grasshoppers ______ able to jump high.", a: ["are"], b: 1, ko: "메뚜기는 높이 점프할 수 있다." },
    { p: "My uncle is ______ to ride a motorbike.", a: ["able"], b: 1, ko: "우리 삼촌은 오토바이를 타실 수 있다." },
    { p: "Scott is ______ able to dance well.", a: ["not"], b: 1, ko: "스코트는 춤을 잘 추지 못한다." },
    { p: "Bears ______ able to catch fish.", a: ["are"], b: 1, ko: "곰은 물고기를 잡을 수 있다." },
    { p: "My mother is able ______ knit mittens.", a: ["to"], b: 1, ko: "우리 어머니는 벙어리장갑을 뜨실 수 있다." },
    { p: "Monkeys are ______ ______ climb up trees.", a: ["able|to"], b: 2, ko: "원숭이는 나무에 올라갈 수 있다." },
    { p: "My grandpa ______ ______ to use a computer.", a: ["is|not", "isn't"], b: 2, ko: "우리 할아버지는 컴퓨터를 사용하지 못하신다." },
    { p: "The baby is ______ ______ to walk.", a: ["not|able"], b: 2, ko: "그 아기는 걷지 못한다." },
    { p: "We're ______ ______ ______ cross the river.", a: ["not|able|to"], b: 3, ko: "우리는 그 강을 건널 수 없다." },
    { p: "______ ______ able to make pizza? / Yes, he is.", a: ["Is|he"], b: 2, ko: "그는 피자를 만들 수 있니?" },
    { p: "______ you able to move the bookcase? / No, I'm not.", a: ["Are"], b: 1, ko: "너는 그 책장을 옮길 수 있니?" },
    { p: "______ they able ______ play baseball? / No, ______ ______.", a: ["Are|to|they|aren't", "Are|to|they|are not"], b: 4, ko: "그들은 야구를 할 수 있니?" },
    { p: "______ your sister ______ to read the book? / Yes, ______ ______.", a: ["Is|able|she|is"], b: 4, ko: "네 여동생은 그 책을 읽을 수 있니?" },
    { p: "Are the robots ______ ______ talk? / Yes, ______ ______.", a: ["able|to|they|are"], b: 4, ko: "그 로봇들은 말을 할 수 있니?" },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", enB[0].p, enB[0].a, { sectionInstructionKo: instrB, blanks: 1, promptKo: enB[0].ko }),
      "am"
    )
  );
  enB.slice(1).forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrB,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  write("lesson02-jump.json", {
    practiceId: "b3:u01:lesson02-jump",
    title: "Lesson 02 Jump — be able to",
    subtitle: "우리말 · be able to 빈칸 (pp. 27–28)",
    pages: "27–28",
    timerMinutes: 24,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항, Section B 14문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분의 우리말 뜻을 쓰세요.", "우리말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "빈칸에 알맞은 말을 쓰세요.", "순서대로 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Lesson 02 Fly (pp. 29–30) ——
(function lesson02Fly() {
  const instrA =
    "다음 문장 또는 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "be able to와 주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  const fixA = [
    { p: ul("I can able to swim in the sea.", "can"), a: ["am"], b: 1, ko: "나는 바다에서 수영할 수 있다." },
    { p: ul("He is able play the violin.", "play"), a: ["to play"], b: 1, ko: "그는 바이올린을 칠 수 있다." },
    { p: ul("I cannot able to boil an egg.", "cannot"), a: ["am not"], b: 1, ko: "나는 달걀을 삶지 못한다." },
    { p: ul("She able is to play the guitar.", "able is"), a: ["is able"], b: 1, ko: "그녀는 기타를 칠 수 있다." },
    { p: ul("Dad does not able to drink coffee.", "does not"), a: ["is not"], b: 1, ko: "아빠는 커피를 마시지 못한다." },
    { p: ul("Helen able to ride a skateboard.", "Helen able"), a: ["is able"], b: 1, ko: "헬렌은 스케이트보드를 탈 수 있다." },
    { p: ul("Amy is able to making a pinwheel.", "making"), a: ["make"], b: 1, ko: "에이미는 바람개비를 만들 수 있다." },
    { p: ul("A fish does not able to close its eyes.", "does not"), a: ["is not"], b: 1, ko: "물고기는 눈을 감지 못한다." },
    { p: ul("My dog is able to opens the door.", "opens"), a: ["open"], b: 1, ko: "우리 개는 문을 열 수 있다." },
    { p: ul("The girls isn't able to go up the ladder.", "isn't"), a: ["aren't"], b: 1, ko: "그 여자아이들은 사다리를 올라가지 못한다." },
    { p: ul("A: Is able Eric to draw a horse? B: Yes, he is.", "Is able Eric"), a: ["Is Eric able"], b: 1, ko: "에릭이 말을 그릴 수 있니? / 응, 할 수 있어." },
    { p: "A: Do you able to count salt? B: No, I'm not.", a: ["Are"], b: 1, ko: "너는 소금을 셀 수 있니? / 아니, 못해." },
    { p: "A: Can Sally able to speak French? B: No, she isn't.", a: ["Is"], b: 1, ko: "샐리가 프랑스어를 말할 수 있니? / 아니, 못해." },
    { p: "A: Be they able to play tennis? B: No, they aren't.", a: ["Are"], b: 1, ko: "그들이 테니스를 할 수 있니? / 아니, 못해." },
    { p: "A: Do you able to jump the fence? B: Yes, I am.", a: ["Are"], b: 1, ko: "너는 울타리를 뛰어넘을 수 있니? / 응, 할 수 있어." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", fixA[0].p, fixA[0].a, {
        sectionInstructionKo: instrA,
        blanks: 1,
        promptKo: fixA[0].ko,
      }),
      "am"
    ),
  ];
  fixA.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrA,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  const bankB = [
    { p: "Hans ______ ______ ______ the problem. ( solve )", a: ["is|able|to|solve"], b: 4, ko: "한스는 그 문제를 풀 수 있다." },
    { p: "She ______ ______ ______ down the tree. ( not, cut )", a: ["is|not|able|to|cut", "isn't|able|to|cut"], b: 5, ko: "그녀는 나무를 베어 내리지 못한다." },
    { p: "______ ______ ______ ? ( knit )", a: ["Are|you|able|to|knit"], b: 4, ko: "너는 뜨개질을 할 수 있니?" },
    { p: "The boy ______ ______ ______ an orange. ( peel )", a: ["is|able|to|peel"], b: 4, ko: "그 남자아이는 오렌지 껍질을 벗길 수 있다." },
    { p: "I ______ ______ ______ computer games. ( not, play )", a: ["am|not|able|to|play"], b: 5, ko: "나는 컴퓨터 게임을 하지 못한다." },
    { p: "______ ______ ______ yoga? ( teach, she )", a: ["Is|she|able|to|teach"], b: 4, ko: "그녀가 요가를 가르칠 수 있니?" },
    { p: "My sister ______ ______ ______ gimchi. ( make )", a: ["is|able|to|make"], b: 4, ko: "내 여동생은 김치를 만들 수 있다." },
    { p: "My grandfather ______ ______ ______ a car. ( not, drive )", a: ["is|not|able|to|drive", "isn't|able|to|drive"], b: 5, ko: "우리 할아버지는 자동차를 운전하지 못하신다." },
    { p: "______ ______ ______ his ball? ( catch, you )", a: ["Are|you|able|to|catch"], b: 4, ko: "너는 그의 공을 잡을 수 있니?" },
    { p: "Chris ______ ______ ______ a sandcastle. ( build )", a: ["is|able|to|build"], b: 4, ko: "크리스는 모래성을 쌓을 수 있다." },
    { p: "Dogs ______ ______ ______ up trees. ( not, climb )", a: ["are|not|able|to|climb", "aren't|able|to|climb"], b: 5, ko: "개들은 나무를 올라가지 못한다." },
    { p: "______ ______ ______ pictures? ( take, they )", a: ["Are|they|able|to|take"], b: 4, ko: "그들이 사진을 찍을 수 있니?" },
    { p: "The elephant ______ ______ ______ the apple. ( pick )", a: ["is|able|to|pick"], b: 4, ko: "그 코끼리는 사과를 딸 수 있다." },
    { p: "Kelly ______ ______ ______ Korean. ( not, read )", a: ["is|not|able|to|read", "isn't|able|to|read"], b: 5, ko: "켈리는 한국어를 읽지 못한다." },
    { p: "______ ______ ______ ? ( talk, the parrot )", a: ["Is|the parrot|able|to|talk"], b: 4, ko: "그 앵무새가 말을 할 수 있니?" },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", bankB[0].p, bankB[0].a, {
        sectionInstructionKo: instrB,
        blanks: 4,
        promptKo: bankB[0].ko,
      }),
      "is / able / to / solve"
    )
  );
  bankB.slice(1).forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, r.a, {
        sectionInstructionKo: instrB,
        blanks: r.b,
        promptKo: r.ko,
      })
    );
  });
  write("lesson02-fly.json", {
    practiceId: "b3:u01:lesson02-fly",
    title: "Lesson 02 Fly — be able to",
    subtitle: "고치기 · be able to 배열 (pp. 29–30)",
    pages: "29–30",
    timerMinutes: 26,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 14문항, Section B 14문항. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "밑줄 친 부분을 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "A" + (i + 2))),
      sec("B", "Section B", instrB, "be able to와 주어진 말로 완성하세요.", "순서대로 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, Array.from({ length: 14 }, (_, i) => "B" + (i + 2))),
    ],
    items,
  });
})();

// —— Review 01 (pp. 31–33) ——
(function review01() {
  const items = [];
  const s1 = "[1] 다음 중 밑줄 친 부분이 잘못된 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch1 = numberedChoices([
    "I can play basketball.",
    "He can <u>jumps</u> high.",
    "Can she speak English?",
    "Kevin cannot carry the box.",
  ]);
  items.push(
    mcItem("q01", "1", "1", "Choose the sentence with an incorrect underlined part.", ch1, [ch1[1], "2"], {
      sectionInstructionKo: s1,
    })
  );

  const s23 = "[2–3] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch2 = numberedChoices(["be", "do", "am", "can"]);
  const ch3 = numberedChoices(["can't", "isn't", "doesn't", "aren't"]);
  items.push(
    mcItem("q02", "2-3", "2", "I ______ able to play the piano.", ch2, [ch2[2], "3"], { sectionInstructionKo: s23 }),
    mcItem("q03", "2-3", "3", "Sandy ______ able to run fast.", ch3, [ch3[1], "2"], { sectionInstructionKo: s23 })
  );

  const s4 = "[4] 다음 문장의 빈칸에 공통으로 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch4 = numberedChoices(["is [Is]", "are [Are]", "can [Can]", "do [Do]"]);
  items.push(
    mcItem(
      "q04",
      "4",
      "4",
      "• They ______ reading books.\n• ______ you able to move the chair?",
      ch4,
      [ch4[1], "2"],
      { sectionInstructionKo: s4 }
    )
  );

  const s56 = "[5–6] 다음 중 올바른 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch5 = numberedChoices(["He can lifts the rock.", "She can speaks Korean.", "Can you jump high?", "We don't can make a sandwich."]);
  const ch6 = numberedChoices(["I'm able use chopsticks.", "Do you able to cook steak?", "Emily is able to washing the dishes.", "They're not able to ski."]);
  items.push(
    mcItem("q05", "5-6", "5", "", ch5, [ch5[2], "3"], { sectionInstructionKo: s56 }),
    mcItem("q06", "5-6", "6", "", ch6, [ch6[3], "4"], { sectionInstructionKo: s56 })
  );

  const s7 = "[7] 다음 중 짝지어진 대화가 어색한 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch7 = numberedChoices([
    "A: Can you do taekwondo? B: Yes, we can.",
    "A: Is Bill able to skate? B: No, he isn't.",
    "A: Can the boy sing English songs? B: No, he can't.",
    "A: Is Sally able to ride a bicycle? B: Yes, she cans.",
  ]);
  items.push(mcItem("q07", "7", "7", "", ch7, [ch7[3], "4"], { sectionInstructionKo: s7 }));

  const s8 = "[8] 다음 두 문장이 같은 뜻이 되도록 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch8 = numberedChoices(["can", "is", "do", "can't"]);
  items.push(
    mcItem("q08", "8", "8", "She is able to speak French.\n= She ______ speak French.", ch8, [ch8[0], "1"], { sectionInstructionKo: s8 })
  );

  const s910 = "[9–10] 다음 의문문에 알맞은 대답을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ch9 = numberedChoices(["Yes, I am.", "No, I don't.", "Yes, I can't.", "No, I can't."]);
  const ch10 = numberedChoices(["Yes, it can.", "No, she doesn't.", "Yes, she is.", "No, it can't."]);
  items.push(
    mcItem("q09", "9-10", "9", "Can you dive?", ch9, [ch9[3], "4"], { sectionInstructionKo: s910 }),
    mcItem("q10", "9-10", "10", "Is she able to open the bottle?", ch10, [ch10[2], "3"], { sectionInstructionKo: s910 })
  );

  const s1112 =
    "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q11", "11-12", "11", "폴은 스케이트보드를 탈 수 있다.\nPaul ( can / is ) ride a skateboard.", ["can", "is"], ["can", "1"], {
      sectionInstructionKo: s1112,
    }),
    mcItem("q12", "11-12", "12", "개가 나무를 올라갈 수 있니?\n( Are / Be ) dogs able to climb up trees?", ["Are", "Be"], ["Are", "1"], {
      sectionInstructionKo: s1112,
    })
  );

  const s1314 = "[13–14] 다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem(
      "q13",
      "13-14",
      "13",
      "A: Can Ms. Miller swim in the sea?\nB: No, ______ ______.",
      ["she|can't", "she|cannot", "she|can not"],
      { sectionInstructionKo: s1314, blanks: 2, promptKo: "B: 아니, 못해." }
    ),
    fillItem("q14", "13-14", "14", "A: Are bears able to catch fish?\nB: Yes, ______ ______.", ["they|can"], {
      sectionInstructionKo: s1314,
      blanks: 2,
      promptKo: "B: 응, 할 수 있어.",
    })
  );

  const s15 = "[15] 다음 두 문장이 같은 뜻이 되도록 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q15", "15", "15", "We can ski in winter.\n= We ______ ______ ______ ski in winter.", ["are|able|to"], {
      sectionInstructionKo: s15,
      blanks: 3,
      promptKo: "겨울에 스키를 탈 수 있다.",
    })
  );

  const s1617 = "[16–17] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 순서대로 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q16", "16-17", "16", "My brother ______ ______ write his name.", ["can't|write", "cannot|write", "can not|write"], {
      sectionInstructionKo: s1617,
      blanks: 2,
      promptKo: "내 남동생은 자기 이름을 못 쓴다.",
    }),
    fillItem("q17", "16-17", "17", "______ ______ your mother able to fix the door?", ["Is|your"], {
      sectionInstructionKo: s1617,
      blanks: 2,
      promptKo: "네 어머니는 그 문을 고치실 수 있니?",
    })
  );

  const s1819 =
    "[18–19] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q18", "18-19", "18", ul("Jenny can ties her shoelace.", "ties"), ["Jenny can tie her shoelace."], {
      sectionInstructionKo: s1819,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptKo: "제니는 신발끈을 묶을 수 있다.",
    }),
    fillItem("q19", "18-19", "19", ul("Are able you to draw a map?", "Are able you"), ["Are you able to draw a map?"], {
      sectionInstructionKo: s1819,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptKo: "너는 지도를 그릴 수 있니?",
    })
  );

  const s20 =
    "[20] 주어진 말을 순서대로 배열하여 문장을 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 물음표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q20", "20", "20", "are / able to / count salt / you / ?", ["Are you able to count salt?"], {
      sectionInstructionKo: s20,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptKo: "너는 소금을 셀 수 있니?",
    })
  );

  write("review-01.json", {
    practiceId: "b3:u01:review01",
    title: "Review 01",
    subtitle: "Unit 01 조동사 (1) (pp. 31–33)",
    pages: "31–33",
    timerMinutes: 30,
    ...META,
    sectionsVersion: 2,
    introKo: "Review 01은 1번부터 20번까지 20문항입니다. Check! Check! 점수표는 채점하지 않아요.",
    sections: [
      sec("1", "[1]", s1, "밑줄 친 부분이 잘못된 것을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["1"]),
      sec("2-3", "[2–3]", s23, "빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["2", "3"]),
      sec("4", "[4]", s4, "공통으로 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["4"]),
      sec("5-6", "[5–6]", s56, "올바른 문장을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["5", "6"]),
      sec("7", "[7]", s7, "어색한 대화를 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["7"]),
      sec("8", "[8]", s8, "같은 뜻이 되도록 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["8"]),
      sec("9-10", "[9–10]", s910, "알맞은 대답을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["9", "10"]),
      sec("11-12", "[11–12]", s1112, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
      sec("13-14", "[13–14]", s1314, "대화 빈칸을 채우세요.", "한 단어씩 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["13", "14"]),
      sec("15", "[15]", s15, "같은 뜻이 되도록 쓰세요.", "한 단어씩 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 1, 0, ["15"]),
      sec("16-17", "[16–17]", s1617, "우리말 뜻과 같도록 쓰세요.", "한 단어씩 순서대로 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["16", "17"]),
      sec("18-19", "[18–19]", s1819, "밑줄 친 부분을 고쳐 문장 전체를 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["18", "19"]),
      sec("20", "[20]", s20, "주어진 말을 배열하여 문장을 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 1, 0, ["20"]),
    ],
    items,
  });
})();

console.log("Done —", OUT);
