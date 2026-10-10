/* Generate data/blue1/unit01/*.json — run: node scripts/blue1-build/unit01-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue1/unit01");
const META = {
  bookId: "zap-blue-1",
  bookTitle: "ZAP Blue 1",
  appName: "BlueZap 1",
  unitId: "unit-01",
  unitTitle: "Unit 01 — 문장의 구성",
};

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return {
    id,
    title,
    instructionKo,
    directionKo,
    ruleKo,
    answerMode,
    answerModeTag: tag,
    itemCount,
    exampleCount,
    labels,
  };
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
    answerModeTag: "Choose · 고르기",
    label,
    type: "mc",
    promptEn,
    choices,
    accept: Array.isArray(accept) ? accept : [accept],
  };
  if (opts.promptKo) item.promptKo = opts.promptKo;
  if (opts.noteKo) item.noteKo = opts.noteKo;
  return Object.assign(item, opts.extra || {});
}

/** Wrap the first case-insensitive match in <u>…</u> (visible in UI as tagged text). */
function underlineInSentence(sentence, phrase) {
  if (!phrase) return sentence;
  const low = sentence.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return sentence;
  return sentence.slice(0, idx) + "<u>" + sentence.slice(idx, idx + phrase.length) + "</u>" + sentence.slice(idx + phrase.length);
}

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, {
    example: true,
    displayOnly: true,
    exampleAnswer,
  });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

const KO_TYPE = {
  declarative: ["평서문"],
  interrogative: ["의문문"],
  imperative: ["명령문"],
  exclamatory: ["감탄문"],
};
const POS = {
  noun: ["명사", "명사(noun)", "noun"],
  pronoun: ["대명사", "대명사(pronoun)", "pronoun"],
  verb: ["동사", "동사(verb)", "verb"],
  aux: ["조동사", "조동사(auxiliary)", "auxiliary", "aux"],
  adj: ["형용사", "형용사(adj)", "adj", "adjective"],
  adv: ["부사", "부사(adv)", "adv", "adverb"],
  prep: ["전치사", "전치사(prep)", "prep", "preposition"],
};

// —— Lesson 01 Walk 1 (p. 11) ——
(function lesson01Walk1() {
  const instrA =
    "다음을 단어와 문장으로 구별하여 빈칸에 순서대로 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음을 단어와 문장으로 구별하여 빈칸에 순서대로 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표·느낌표까지 완전한 문장으로 쓰세요.)";
  const words = ["boy", "are", "student", "Korean", "teacher", "they", "good", "tall"];
  const sents = ["Are you a student?", "He is tall.", "What a good girl!"];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "단어 ①", ["dog"], {
        sectionInstructionKo: instrA,
        answerMode: "words",
        extra: { promptKo: "예시: dog" },
      }),
      "dog"
    ),
  ];
  words.forEach((w, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), "단어 " + (i + 2), [w, w.toLowerCase()], {
        sectionInstructionKo: instrA,
      })
    );
  });
  items.push(
    exItem(
      fillItem("b01", "B", "B1", "문장 ①", ["I am Korean."], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }),
      "I am Korean."
    )
  );
  sents.forEach((s, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), "문장 " + (i + 2), [s], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      })
    );
  });
  write("lesson01-walk1.json", {
    practiceId: "b1:u01:lesson01-walk1",
    title: "Lesson 01 Walk 1 — 문장",
    subtitle: "단어와 문장 (p. 11)",
    pages: "11",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    wordBank: [
      "dog",
      "I am Korean.",
      "boy",
      "are",
      "student",
      "Korean",
      "Are you a student?",
      "teacher",
      "He is tall.",
      "they",
      "What a good girl!",
      "good",
      "tall",
    ],
    introKo:
      "이 연습은 Section A 8문항(단어), Section B 3문항(문장 전체)으로 되어 있어요. 위 단어·문장 목록을 보고, 단어 칸에는 보기 순서대로 단어 하나만, 문장 칸에는 문장 전체를 쓰세요. 회색 '예시'는 채점하지 않아요.",
    sections: [
      sec("A", "Section A — 단어", instrA, "다음을 단어와 문장으로 구별하여 빈칸에 순서대로 쓰세요.", "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)", "words", "Words · 빈칸 말만", 8, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
      ]),
      sec("B", "Section B — 문장", instrB, "다음을 단어와 문장으로 구별하여 빈칸에 순서대로 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 3, 1, ["B2", "B3", "B4"]),
    ],
    items,
  });
})();

// —— Lesson 01 Walk 2 (p. 13) ——
(function lesson01Walk2() {
  const instrA =
    "다음 문장의 종류가 무엇인지 보기에서 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.) (평서문·의문문·명령문·감탄문)";
  const instrB =
    "다음을 같은 종류의 문장끼리 선으로 연결하세요. 알맞은 문장(a~d)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const choices = ["a. Are you tall?", "b. What a good girl!", "c. She is a teacher.", "d. Read a book."];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "I read a book.", KO_TYPE.declarative, { sectionInstructionKo: instrA, promptKo: "나는 책을 읽는다." }),
      "평서문"
    ),
    fillItem("a02", "A", "A2", "Are you Korean?", KO_TYPE.interrogative, { sectionInstructionKo: instrA, promptKo: "너는 한국인이니?" }),
    fillItem("a03", "A", "A3", "Open the window.", KO_TYPE.imperative, { sectionInstructionKo: instrA, promptKo: "창문을 열어라." }),
    fillItem("a04", "A", "A4", "This is so big!", KO_TYPE.exclamatory, { sectionInstructionKo: instrA, promptKo: "이것은 무척 크구나!" }),
    fillItem("a05", "A", "A5", "What a big boy!", KO_TYPE.exclamatory, { sectionInstructionKo: instrA, promptKo: "정말 큰 남자아이구나!" }),
    fillItem("a06", "A", "A6", "She is a student.", KO_TYPE.declarative, { sectionInstructionKo: instrA, promptKo: "그녀는 학생이다." }),
    exItem(
      mcItem("b01", "B", "B1", "We are boys.", choices, ["c. She is a teacher.", "c"], { sectionInstructionKo: instrB, promptKo: "우리는 남자아이다." }),
      "c. She is a teacher."
    ),
    mcItem("b02", "B", "B2", "Is this a book?", choices, ["a. Are you tall?", "a"], { sectionInstructionKo: instrB, promptKo: "이것은 책이니?" }),
    mcItem("b03", "B", "B3", "Close the window.", choices, ["d. Read a book.", "d"], { sectionInstructionKo: instrB, promptKo: "창문을 닫아라." }),
    mcItem("b04", "B", "B4", "What a tall tree!", choices, ["b. What a good girl!", "b"], { sectionInstructionKo: instrB, promptKo: "정말 키가 큰 나무구나!" }),
  ];
  write("lesson01-walk2.json", {
    practiceId: "b1:u01:lesson01-walk2",
    title: "Lesson 01 Walk 2 — 문장",
    subtitle: "문장의 종류 (p. 13)",
    pages: "13",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 5문항(문장 종류), Section B 3문항(같은 종류 연결·고르기)입니다. 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instrA, "다음 문장의 종류가 무엇인지 보기에서 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 5, 1, ["A2", "A3", "A4", "A5", "A6"]),
      sec("B", "Section B", instrB, "다음을 같은 종류의 문장끼리 선으로 연결하세요.", "알맞은 문장(a~d)을 하나 골라 누르세요.", "choice", "Choose · 고르기", 3, 1, ["B2", "B3", "B4"]),
    ],
    items,
  });
})();

function circleWalk(practiceId, title, subtitle, pages, sectionA, sectionB, nouns, pronounsOrVerbs, bData, bLabel) {
  const instrA = sectionA.instr;
  const instrB = sectionB.instr;
  const items = [
    exItem(
      fillItem("a01", "A", "A1", sectionA.exPrompt, [sectionA.exAns], {
        sectionInstructionKo: instrA,
        promptKo: sectionA.exKo,
      }),
      sectionA.exAns
    ),
  ];
  sectionA.rows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, r.accept, {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
      })
    );
  });
  items.push(
    exItem(
      fillItem("b01", "B", "B1", sectionB.exPrompt, [sectionB.exAns], {
        sectionInstructionKo: instrB,
        promptKo: sectionB.exKo,
      }),
      sectionB.exAns
    )
  );
  sectionB.rows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.en, r.accept, {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  write(practiceId.replace(/:/g, "-").replace("b1-u01-", "") + ".json", {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: `Section A ${sectionA.rows.length}문항, Section B ${sectionB.rows.length}문항(동그라미 친 말을 타이핑). 예시는 채점하지 않아요.`,
    sections: [
      sec("A", "Section A", instrA, sectionA.direction, sectionA.rule, "words", "Words · 빈칸 말만", sectionA.rows.length, 1, sectionA.labels),
      sec("B", "Section B", instrB, sectionB.direction, sectionB.rule, "words", "Words · 빈칸 말만", sectionB.rows.length, 1, sectionB.labels),
    ],
    items,
  });
}

circleWalk(
  "b1:u01:lesson02-walk1",
  "Lesson 02 Walk 1 — 품사",
  "명사와 대명사 (p. 15)",
  "15",
  {
    instr: "다음 문장에서 명사를 찾아 동그라미 하세요. 동그라미 친 명사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 명사를 찾아 동그라미 하세요.",
    rule: "동그라미 친 명사만 쓰세요.",
    exPrompt: "This is a cat.",
    exAns: "cat",
    exKo: "이것은 고양이다.",
    labels: ["A2", "A3", "A4", "A5"],
    rows: [
      { en: "They live in London.", accept: ["London"], ko: "그들은 런던에 산다." },
      { en: "I have a book.", accept: ["book"], ko: "나는 책을 한 권 가지고 있다." },
      { en: "Is it a flower?", accept: ["flower"], ko: "그것은 꽃이니?" },
      { en: "Tom is a student.", accept: ["student", "Student", "Tom"], ko: "톰은 학생이다." },
    ],
  },
  {
    instr: "다음 문장에서 대명사를 찾아 동그라미 하세요. 동그라미 친 대명사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 대명사를 찾아 동그라미 하세요.",
    rule: "동그라미 친 대명사만 쓰세요.",
    exPrompt: "I am a student.",
    exAns: "I",
    exKo: "나는 학생이다.",
    labels: ["B2", "B3", "B4", "B5"],
    rows: [
      { en: "You are cute.", accept: ["You"], ko: "너는 귀엽다." },
      { en: "Is this a cap?", accept: ["this"], ko: "이것은 모자니?" },
      { en: "He is a singer.", accept: ["He"], ko: "그는 가수이다." },
      { en: "They play soccer after school.", accept: ["They"], ko: "그들은 방과 후에 축구를 한다." },
    ],
  }
);

circleWalk(
  "b1:u01:lesson02-walk2",
  "Lesson 02 Walk 2 — 품사",
  "동사와 조동사 (p. 17)",
  "17",
  {
    instr: "다음 문장에서 동사를 찾아 동그라미 하세요. 동그라미 친 동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 동사를 찾아 동그라미 하세요.",
    rule: "동그라미 친 동사만 쓰세요.",
    exPrompt: "I like dogs.",
    exAns: "like",
    exKo: "나는 개를 좋아한다.",
    labels: ["A2", "A3", "A4", "A5"],
    rows: [
      { en: "You are kind.", accept: ["are"], ko: "너는 친절하다." },
      { en: "Is she a cook?", accept: ["Is"], ko: "그녀는 요리사니?" },
      { en: "Open the window.", accept: ["Open", "open"], ko: "창문을 열어라." },
      { en: "They go to school together.", accept: ["go"], ko: "그들은 함께 학교에 간다." },
    ],
  },
  {
    instr: "다음 문장에서 조동사를 찾아 동그라미 하세요. 동그라미 친 조동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 조동사를 찾아 동그라미 하세요.",
    rule: "동그라미 친 조동사만 쓰세요.",
    exPrompt: "I must do my homework.",
    exAns: "must",
    exKo: "나는 숙제를 해야 한다.",
    labels: ["B2", "B3", "B4", "B5"],
    rows: [
      { en: "She can swim.", accept: ["can"], ko: "그녀는 수영을 할 수 있다." },
      { en: "He can speak English.", accept: ["can"], ko: "그는 영어를 말할 수 있다." },
      { en: "She will come.", accept: ["will"], ko: "그녀는 올 것이다." },
      { en: "We can do it.", accept: ["can"], ko: "우리는 그것을 할 수 있다." },
    ],
  }
);

// Lesson 02 Walk 3 — POS of underlined word (p. 19)
(function lesson02Walk3() {
  const instr =
    "다음 문장에서 밑줄 친 단어의 품사를 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const rows = [
    { en: "You are pretty.", ul: "pretty", pos: POS.adj, ko: "너는 예쁘다." },
    { en: "This is a tall tree.", ul: "tall", pos: POS.adj, ko: "이것은 큰 나무이다." },
    { en: "You speak fast.", ul: "fast", pos: POS.adv, ko: "너는 말을 빨리 한다." },
    { en: "The dog is small.", ul: "small", pos: POS.adj, ko: "그 개는 작다." },
    { en: "She is very kind.", ul: "very", pos: POS.adv, ko: "그녀는 매우 친절하다." },
    { en: "A book is on the table.", ul: "on", pos: POS.prep, ko: "책 한 권이 탁자 위에 있다." },
    { en: "They run very fast.", ul: "very", pos: POS.adv, ko: "그들은 매우 빨리 달린다." },
    { en: "I am in my room.", ul: "in", pos: POS.prep, ko: "나는 방 안에 있다." },
    { en: "They play with their friends.", ul: "with", pos: POS.prep, ko: "그들은 친구들과 함께 논다." },
    { en: "Yuna is a cute girl.", ul: "cute", pos: POS.adj, ko: "유나는 귀여운 여자아이다." },
    { en: "I go to school at nine.", ul: "at", pos: POS.prep, ko: "나는 9시에 학교에 간다." },
    { en: "I speak English well.", ul: "well", pos: POS.adv, ko: "나는 영어를 잘 말한다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", underlineInSentence(rows[0].en, rows[0].ul), POS.adj, {
        sectionInstructionKo: instr,
        promptKo: rows[0].ko,
      }),
      "형용사"
    ),
  ];
  rows.slice(1).forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), underlineInSentence(r.en, r.ul), r.pos, {
        sectionInstructionKo: instr,
        promptKo: r.ko,
      })
    );
  });
  write("lesson02-walk3.json", {
    practiceId: "b1:u01:lesson02-walk3",
    title: "Lesson 02 Walk 3 — 품사",
    subtitle: "형용사·부사·전치사 (p. 19)",
    pages: "19",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 11문항(밑줄 친 말의 품사). 예시는 채점하지 않아요.",
    sections: [
      sec("A", "Section A", instr, "다음 문장에서 밑줄 친 단어의 품사를 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 11, 1, [
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
        "A11",
        "A12",
      ]),
    ],
    items,
  });
})();

circleWalk(
  "b1:u01:lesson03-walk1",
  "Lesson 03 Walk 1 — 문장의 구성 요소",
  "주어와 동사 (p. 21)",
  "21",
  {
    instr: "다음 문장에서 주어를 찾아 동그라미 하세요. 동그라미 친 주어만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 주어를 찾아 동그라미 하세요.",
    rule: "동그라미 친 주어만 쓰세요.",
    exPrompt: "I go to Nara Elementary School.",
    exAns: "I",
    exKo: "나는 나라 초등학교에 다닌다.",
    labels: ["A2", "A3", "A4", "A5"],
    rows: [
      { en: "You are smart.", accept: ["You"], ko: "너는 똑똑하다." },
      { en: "She is short.", accept: ["She"], ko: "그녀는 키가 작다." },
      { en: "My dog is very cute.", accept: ["My dog", "dog"], ko: "우리 개는 매우 귀엽다." },
      { en: "The boys play baseball.", accept: ["The boys", "boys"], ko: "그 남자아이들은 야구를 한다." },
    ],
  },
  {
    instr: "다음 문장에서 동사를 찾아 동그라미 하세요. 동그라미 친 동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    direction: "다음 문장에서 동사를 찾아 동그라미 하세요.",
    rule: "동그라미 친 동사만 쓰세요.",
    exPrompt: "I am in the room.",
    exAns: "am",
    exKo: "나는 방에 있다.",
    labels: ["B2", "B3", "B4", "B5"],
    rows: [
      { en: "It is a flower.", accept: ["is"], ko: "그것은 꽃이다." },
      { en: "You are a student.", accept: ["are"], ko: "너는 학생이다." },
      { en: "We have dinner together.", accept: ["have"], ko: "우리는 함께 저녁 식사를 한다." },
      { en: "They read books in the room.", accept: ["read"], ko: "그들은 방에서 책을 읽는다." },
    ],
  }
);

// Lesson 03 Walk 2 — O/C (p. 23)
(function lesson03Walk2() {
  const instr =
    "다음 밑줄 친 말이 목적어이면 O, 보어이면 C를 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (O 또는 C, 또는 목적어·보어)";
  const OC = (o) => (o ? ["O", "o", "목적어"] : ["C", "c", "보어"]);
  const rows = [
    { en: "You are a boy.", ul: "a boy", o: false, ko: "너는 남자아이다." },
    { en: "She is kind.", ul: "kind", o: false, ko: "그녀는 친절하다." },
    { en: "Jay has a bag.", ul: "a bag", o: true, ko: "제이는 가방을 하나 가지고 있다." },
    { en: "We learn math.", ul: "math", o: true, ko: "우리는 수학을 배운다." },
    { en: "She can play the piano.", ul: "the piano", o: true, ko: "그녀는 피아노를 칠 수 있다." },
    { en: "My brother is a student.", ul: "a student", o: false, ko: "우리 오빠는 학생이다." },
    { en: "It is small.", ul: "small", o: false, ko: "그것은 작다." },
    { en: "They are dancers.", ul: "dancers", o: false, ko: "그들은 무용수이다." },
    { en: "They know him.", ul: "him", o: true, ko: "그들은 그를 안다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", underlineInSentence("I like dogs.", "dogs"), OC(true), {
        sectionInstructionKo: instr,
        promptKo: "나는 개를 좋아한다.",
      }),
      "O"
    ),
  ];
  rows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), underlineInSentence(r.en, r.ul), OC(r.o), {
        sectionInstructionKo: instr,
        promptKo: r.ko,
      })
    );
  });
  write("lesson03-walk2.json", {
    practiceId: "b1:u01:lesson03-walk2",
    title: "Lesson 03 Walk 2 — 문장의 구성 요소",
    subtitle: "목적어와 보어 (p. 23)",
    pages: "23",
    timerMinutes: 10,
    ...META,
    sectionsVersion: 2,
    introKo: "Section A 9문항(O/C). 예시는 채점하지 않아요.",
    sections: [sec("A", "Section A", instr, "다음 밑줄 친 말이 목적어이면 O, 보어이면 C를 빈칸에 쓰세요.", "O 또는 C만 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])],
    items,
  });
})();

// Review 01 (pp. 24–26)
(function review01() {
  const mc = (id, secId, label, promptEn, choices, accept, extra) =>
    mcItem(id, secId, label, promptEn, choices, accept, {
      sectionInstructionKo: extra.sectionInstructionKo || extra.instr,
      extra: extra.promptKo ? { promptKo: extra.promptKo } : {},
    });
  const items = [];
  const pushMc = (n, sec, instr, prompt, choices, ansIdx) => {
    const accept = [choices[ansIdx], String(ansIdx + 1)];
    items.push(mc("q" + String(n).padStart(2, "0"), sec, String(n), prompt, choices, accept, { instr }));
  };

  const s12 = "[1–2] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  pushMc(1, "1-2", s12, "①", ["I am a student.", "You are a boy.", "she is a teacher.", "Are they girls?"], 2);
  items[items.length - 1].promptEn = "";
  items[items.length - 1].choices = ["I am a student.", "You are a boy.", "she is a teacher.", "Are they girls?"];
  items[items.length - 1].label = "1";

  const fix = (id, sec, label, promptEn, choices, ans) => {
    items.push(mc(id, sec, label, promptEn, choices, [choices[ans], String(ans + 1)], { instr: items._lastInstr }));
  };

  items[0].sectionInstructionKo = s12;
  items.push(
    mc("q02", "1-2", "2", "", ["I play the piano.", "Is she a student.", "This is so big!", "What a tall tree!"], ["Is she a student.", "2"], {
      sectionInstructionKo: s12,
    })
  );

  const s34 = "[3–4] 다음 중 문장의 종류가 다른 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mc("q03", "3-4", "3", "", ["This is a cat.", "Minho is tall.", "We are friends.", "What a good boy!"], ["What a good boy!", "4"], { sectionInstructionKo: s34 }),
    mc("q04", "3-4", "4", "", ["I have a big bag.", "Open the window.", "They play soccer.", "He is from London."], ["Open the window.", "2"], { sectionInstructionKo: s34 })
  );

  const s57 = "[5–7] 다음 중 품사가 같은 단어끼리 짝지어진 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mc("q05", "5-7", "5", "", ["boy – cat", "you – do", "fast – be", "she – student"], ["boy – cat", "1"], { sectionInstructionKo: s57 }),
    mc("q06", "5-7", "6", "", ["do – very", "can – short", "I – they", "desk – sing"], ["I – they", "3"], { sectionInstructionKo: s57 }),
    mc("q07", "5-7", "7", "", ["be – she", "flower – at", "doctor – cute", "make – run"], ["make – run", "4"], { sectionInstructionKo: s57 })
  );

  const s810 = "[8–10] 다음 중 밑줄 친 부분의 품사가 다른 하나를 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const r8 = [
    underlineInSentence("She is cute.", "cute"),
    underlineInSentence("It is a cat.", "cat"),
    underlineInSentence("He is a small boy.", "small"),
    underlineInSentence("Mr. Smith is tall.", "tall"),
  ];
  const r9 = [
    underlineInSentence("I am Korean.", "I"),
    underlineInSentence("They are students.", "They"),
    underlineInSentence("John is very tall.", "John"),
    underlineInSentence("That is a table.", "That"),
  ];
  const r10 = [
    underlineInSentence("I run fast.", "fast"),
    underlineInSentence("You sing well.", "well"),
    underlineInSentence("This is very cute.", "very"),
    underlineInSentence("We are in the room.", "in"),
  ];
  items.push(
    mc("q08", "8-10", "8", "", r8, [r8[1], "2"], { sectionInstructionKo: s810 }),
    mc("q09", "8-10", "9", "", r9, [r9[2], "3"], { sectionInstructionKo: s810 }),
    mc("q10", "8-10", "10", "", r10, [r10[3], "4"], { sectionInstructionKo: s810 })
  );

  const s1112 =
    "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mc("q11", "11-12", "11", "그는 영어를 할 수 있다.\nHe ( can / will ) speak English.", ["can", "will"], ["can", "1"], { sectionInstructionKo: s1112 }),
    mc("q12", "11-12", "12", "그들은 운동장에서 야구를 한다.\nThey play soccer ( very / on ) the playground.", ["very", "on"], ["on", "2"], { sectionInstructionKo: s1112 })
  );

  const s1314 = "[13–14] 다음 문장에서 주어를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q13", "13-14", "13", "This is my book.", ["This"], { sectionInstructionKo: s1314, promptKo: "이것은 내 책이다." }),
    fillItem("q14", "13-14", "14", "My mother is a teacher.", ["My mother", "mother"], {
      sectionInstructionKo: s1314,
      promptKo: "우리 어머니는 선생님이다.",
    })
  );

  const s1516 = "[15–16] 다음 문장에서 동사를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q15", "15-16", "15", "I go to school at eight.", ["go"], { sectionInstructionKo: s1516, promptKo: "나는 8시에 학교에 간다." }),
    fillItem("q16", "15-16", "16", "They are students.", ["are"], { sectionInstructionKo: s1516, promptKo: "그들은 학생이다." })
  );

  const s17 = "[17] 다음 문장에서 목적어를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(fillItem("q17", "17", "17", "We have a dog.", ["a dog", "dog"], { sectionInstructionKo: s17, promptKo: "우리는 개 한 마리를 가지고 있다." }));

  const s18 = "[18] 다음 문장에서 보어를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(fillItem("q18", "18", "18", "She is kind.", ["kind"], { sectionInstructionKo: s18, promptKo: "그녀는 친절하다." }));

  const s1920 =
    "[19–20] 다음 문장에서 잘못된 부분을 찾아 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q19", "19-20", "19", "the girl is smart.", ["The girl is smart.", "The girl is smart"], {
      sectionInstructionKo: s1920,
      promptKo: "그 여자아이는 똑똑하다.",
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    }),
    fillItem("q20", "19-20", "20", "this is a book", ["This is a book.", "This is a book"], {
      sectionInstructionKo: s1920,
      promptKo: "이것은 책이다.",
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    })
  );

  // Fix q01 prompt
  items[0].promptEn = "Choose the incorrect sentence.";
  items[0].choices = ["I am a student.", "You are a boy.", "she is a teacher.", "Are they girls?"];

  write("review-01.json", {
    practiceId: "b1:u01:review01",
    title: "Review 01",
    subtitle: "Unit 01 문장의 구성 (pp. 24–26)",
    pages: "24–26",
    timerMinutes: 30,
    ...META,
    sectionsVersion: 2,
    introKo:
      "Review 01은 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요. 각 섹션 안내에 따라 고르기·빈칸·문장 전체를 구분하세요.",
    sections: [
      sec("1-2", "[1–2]", s12, "다음 중 잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
      sec("3-4", "[3–4]", s34, "다음 중 문장의 종류가 다른 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["3", "4"]),
      sec("5-7", "[5–7]", s57, "다음 중 품사가 같은 단어끼리 짝지어진 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["5", "6", "7"]),
      sec("8-10", "[8–10]", s810, "다음 중 밑줄 친 부분의 품사가 다른 하나를 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["8", "9", "10"]),
      sec("11-12", "[11–12]", s1112, "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
      sec("13-14", "[13–14]", s1314, "다음 문장에서 주어를 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["13", "14"]),
      sec("15-16", "[15–16]", s1516, "다음 문장에서 동사를 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["15", "16"]),
      sec("17", "[17]", s17, "다음 문장에서 목적어를 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 1, 0, ["17"]),
      sec("18", "[18]", s18, "다음 문장에서 보어를 찾아 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 1, 0, ["18"]),
      sec("19-20", "[19–20]", s1920, "다음 문장에서 잘못된 부분을 찾아 바르게 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
    ],
    items,
  });
})();

console.log("Done —", OUT);
