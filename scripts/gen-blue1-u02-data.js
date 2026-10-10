#!/usr/bin/env node
/** One-off generator for BlueZap 1 Unit 02 — run: node scripts/gen-blue1-u02-data.js */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../data/blue1/unit02");
const META = {
  bookId: "zap-blue-1",
  bookTitle: "ZAP Blue 1",
  appName: "BlueZap 1",
  unitId: "unit-02",
  unitTitle: "Unit 02 — 셀 수 있는 명사",
  sectionsVersion: 2,
};

function base(practiceId, title, subtitle, pages, timerMinutes, introKo) {
  return {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    introKo,
    sections: [],
    items: [],
  };
}

function sec(id, title, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels, extra = {}) {
  const instructionKo = title + " " + directionKo + " " + ruleKo;
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
    ...extra,
  };
}

function fillItem(id, section, secObj, label, promptEn, accept, opts = {}) {
  const blanks = opts.blanks || 1;
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: secObj.instructionKo,
    answerMode: secObj.answerMode,
    answerModeTag: secObj.answerModeTag,
    label,
    type: "fill",
    promptEn,
    blanks,
    accept: Array.isArray(accept) ? accept : [accept],
    ...opts,
  };
}

function mcItem(id, section, secObj, label, promptEn, choices, accept, opts = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: secObj.instructionKo,
    answerMode: secObj.answerMode,
    answerModeTag: secObj.answerModeTag,
    label,
    type: "mc",
    promptEn,
    choices,
    accept: Array.isArray(accept) ? accept : [accept],
    ...opts,
  };
}

function sentItem(id, section, secObj, label, promptEn, accept, opts = {}) {
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: secObj.instructionKo,
    answerMode: secObj.answerMode,
    answerModeTag: secObj.answerModeTag,
    label,
    type: "sentence",
    promptEn,
    accept: Array.isArray(accept) ? accept : [accept],
    ...opts,
  };
}

function ruleAccept(es) {
  if (es) return ["es", "+ es", "+es", "es"];
  return ["s", "+ s", "+s", "s"];
}

function lesson01Walk() {
  const p = base(
    "b1:u02:lesson01-walk",
    "Lesson 01 Walk — 셀 수 있는 명사",
    "단수와 복수 (p. 31)",
    "31",
    10,
    "Grammar Walk p.31: Section A 셀 수 있는 명사 5개(예시 1), Section B 단수·복수 열 3행(예시 1). 보기 순서대로 빈칸을 채우세요."
  );
  const dirA = "다음 중 셀 수 있는 명사를 찾아 빈칸에 순서대로 쓰세요.";
  const ruleW = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sA = sec("A", "Section A", dirA, ruleW, "words", "Words · 빈칸 말만", 5, 1, ["A2", "A3", "A4", "A5", "A6"]);
  const dirB = "다음 중 명사의 단수형과 복수형을 찾아 빈칸에 순서대로 쓰세요.";
  const sB = sec("B", "Section B", dirB, ruleW, "words", "Words · 빈칸 말만", 3, 1, ["B2", "B3", "B4"]);
  p.sections = [sA, sB];
  p.wordBank = ["desk", "water", "boy", "love", "computer", "dog", "air", "phone", "cap", "math"];
  const countable = ["boy", "computer", "dog", "phone", "cap"];
  p.items = [
    fillItem("a01", "A", sA, "A1", "셀 수 있는 명사 ① desk", ["desk"], { example: true, displayOnly: true, exampleAnswer: "desk" }),
    ...countable.map((w, i) => fillItem(`a0${i + 2}`, "A", sA, `A${i + 2}`, `셀 수 있는 명사 ${i + 2}`, [w])),
    fillItem("b01", "B", sB, "B1", "단수형 ① girl / 복수형 ① dogs", ["girl|dogs"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "girl / dogs",
      blanks: 2,
    }),
    fillItem("b02", "B", sB, "B2", "단수형 2 / 복수형 2", ["chair|houses"], { blanks: 2, promptKo: "의자 / 집(들)" }),
    fillItem("b03", "B", sB, "B3", "단수형 3 / 복수형 3", ["bird|rooms"], { blanks: 2, promptKo: "새 / 방(들)" }),
    fillItem("b04", "B", sB, "B4", "단수형 4 / 복수형 4", ["flower|trees"], { blanks: 2, promptKo: "꽃 / 나무(들)" }),
  ];
  return p;
}

function lesson01Walk2() {
  const p = base(
    "b1:u02:lesson01-walk2",
    "Lesson 01 Walk 2 — 셀 수 있는 명사",
    "복수형 규칙 (1) (p. 33)",
    "33",
    10,
    "각 명사마다 규칙(+s / +es)과 복수형 두 칸을 채웁니다. 예시(book)는 채점하지 않아요."
  );
  const dir = "빈칸에 알맞은 규칙을 써넣고 주어진 명사의 복수형을 완성하세요.";
  const rule = "규칙 칸과 복수형 칸에 각각 한 단어씩 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
  const sA = sec("A", "Section A", dir, rule, "words", "Words · 빈칸 말만", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]);
  p.sections = [sA];
  const rows = [
    ["flower", false, "flowers"],
    ["bus", true, "buses"],
    ["potato", true, "potatoes"],
    ["dish", true, "dishes"],
    ["tree", false, "trees"],
    ["box", true, "boxes"],
    ["piano", false, "pianos"],
    ["cap", false, "caps"],
    ["bench", true, "benches"],
  ];
  p.items = [
    fillItem("a01", "A", sA, "A1", "book + s → books", ["s|books"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "s / books",
      blanks: 2,
    }),
    ...rows.map(([noun, es, pl], i) => {
      const r = ruleAccept(es);
      const acc = r.map((x) => `${x}|${pl}`);
      return fillItem(`a0${i + 2}`, "A", sA, `A${i + 2}`, `${noun} + ___ → ___`, acc, { blanks: 2 });
    }),
  ];
  return p;
}

function mcRunA(sec, items, ex) {
  return [
    mcItem("a01", "A", sec, "A1", ex.prompt, ex.choices, ex.accept, {
      example: true,
      displayOnly: true,
      exampleAnswer: ex.accept[0],
    }),
    ...items.map((it, i) =>
      mcItem(`a${String(i + 2).padStart(2, "0")}`, "A", sec, `A${i + 2}`, it.prompt, it.choices, it.accept)
    ),
  ];
}

function lesson01Run() {
  const p = base(
    "b1:u02:lesson01-run",
    "Lesson 01 Run — 셀 수 있는 명사",
    "복수형 선택 (pp. 34–35)",
    "34–35",
    18,
    "Section A: 명사 복수형 고르기 15문항(예시 1). Section B: 문장 빈칸 고르기 15문항(예시 1)."
  );
  const dirA = "다음 명사의 복수형을 괄호 안에서 골라 동그라미 하세요.";
  const ruleC = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sA = sec("A", "Section A", dirA, ruleC, "choice", "Choose · 고르기", 14, 1, [
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
    "A13",
    "A14",
    "A15",
  ]);
  const dirB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.";
  const sB = sec("B", "Section B", dirB, ruleC, "choice", "Choose · 고르기", 14, 1, [
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
  ]);
  p.sections = [sA, sB];
  const runA = [
    { prompt: "house", choices: ["houses", "housese"], accept: ["houses"] },
    { prompt: "glass", choices: ["glass", "glasses"], accept: ["glasses"] },
    { prompt: "building", choices: ["buildings", "buildinges"], accept: ["buildings"] },
    { prompt: "dish", choices: ["dishs", "dishes"], accept: ["dishes"] },
    { prompt: "cap", choices: ["caps", "capes"], accept: ["caps"] },
    { prompt: "bus", choices: ["buss", "buses"], accept: ["buses"] },
    { prompt: "potato", choices: ["potatos", "potatoes"], accept: ["potatoes"] },
    { prompt: "fox", choices: ["foxs", "foxes"], accept: ["foxes"] },
    { prompt: "student", choices: ["students", "studentes"], accept: ["students"] },
    { prompt: "tomato", choices: ["tomatos", "tomatoes"], accept: ["tomatoes"] },
    { prompt: "cat", choices: ["cats", "cates"], accept: ["cats"] },
    { prompt: "piano", choices: ["pianos", "pianoes"], accept: ["pianos"] },
    { prompt: "bench", choices: ["benchs", "benches"], accept: ["benches"] },
    { prompt: "hero", choices: ["heros", "heroes"], accept: ["heroes"] },
  ];
  const runB = [
    { prompt: "I have a ______.", choices: ["book", "books"], accept: ["book"], promptKo: "나는 책을 한 권 가지고 있다." },
    { prompt: "I need two ______.", choices: ["dish", "dishes"], accept: ["dishes"], promptKo: "나는 접시 두 개가 필요하다." },
    { prompt: "We have three ______.", choices: ["dog", "dogs"], accept: ["dogs"], promptKo: "우리는 개 세 마리를 가지고 있다." },
    { prompt: "I need an ______.", choices: ["ax", "axes"], accept: ["ax"], promptKo: "나는 도끼 하나가 필요하다." },
    { prompt: "They have two ______.", choices: ["house", "houses"], accept: ["houses"], promptKo: "그들은 집 두 채를 가지고 있다." },
    { prompt: "You want a ______.", choices: ["computer", "computers"], accept: ["computer"], promptKo: "너는 컴퓨터 한 대를 원한다." },
    { prompt: "We need two ______.", choices: ["bag", "bags"], accept: ["bags"], promptKo: "우리는 가방 두 개가 필요하다." },
    { prompt: "I have a ______.", choices: ["flower", "flowers"], accept: ["flower"], promptKo: "나는 꽃 한 송이를 가지고 있다." },
    { prompt: "I have five ______.", choices: ["tomato", "tomatoes"], accept: ["tomatoes"], promptKo: "나는 토마토 다섯 개를 가지고 있다." },
    { prompt: "We need two ______.", choices: ["photo", "photos"], accept: ["photos"], promptKo: "우리는 사진 두 장이 필요하다." },
    { prompt: "They have a ______.", choices: ["car", "cars"], accept: ["car"], promptKo: "그들은 자동차 한 대를 가지고 있다." },
    { prompt: "I want a ______.", choices: ["piano", "pianos"], accept: ["piano"], promptKo: "나는 피아노 한 대를 원한다." },
    { prompt: "I have two ______.", choices: ["cap", "caps"], accept: ["caps"], promptKo: "나는 모자 두 개를 가지고 있다." },
    { prompt: "They want two ______.", choices: ["bench", "benches"], accept: ["benches"], promptKo: "그들은 벤치 두 개를 원한다." },
  ];
  p.items = [
    ...mcRunA(sA, runA, { prompt: "dog", choices: ["dogs", "doges"], accept: ["dogs"] }),
    mcItem("b01", "B", sB, "B1", "I want a ______.", ["pen", "pens"], ["pen"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "pen",
      promptKo: "나는 펜 한 자루를 원한다.",
    }),
    ...runB.map((it, i) =>
      mcItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, it.prompt, it.choices, it.accept, {
        promptKo: it.promptKo,
      })
    ),
  ];
  return p;
}

function lesson01Jump() {
  const p = base(
    "b1:u02:lesson01-jump",
    "Lesson 01 Jump — 셀 수 있는 명사",
    "복수형·뜻 (pp. 36–37)",
    "36–37",
    22,
    "Section A: 복수형과 우리말 뜻. Section B: 단수형과 우리말 뜻."
  );
  const dirA = "다음 명사의 복수형과 그 뜻을 빈칸에 쓰세요.";
  const dirB = "다음 명사의 단수형과 그 뜻을 빈칸에 쓰세요.";
  const rule = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sA = sec("A", "Section A", dirA, rule, "words", "Words · 빈칸 말만", 14, 1, [
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
    "A13",
    "A14",
    "A15",
  ]);
  const sB = sec("B", "Section B", dirB, rule, "words", "Words · 빈칸 말만", 14, 1, [
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
  ]);
  p.sections = [sA, sB];
  const jumpA = [
    ["a bus, three", "buses", "버스"],
    ["a table, two", "tables", ["식탁", "탁자", "테이블"]],
    ["a doctor, four", "doctors", "의사"],
    ["a desk, three", "desks", "책상"],
    ["a box, four", "boxes", "상자"],
    ["a potato, six", "potatoes", "감자"],
    ["a house, two", "houses", "집"],
    ["a bench, five", "benches", "벤치"],
    ["a building, two", "buildings", "건물"],
    ["a tomato, three", "tomatoes", "토마토"],
    ["a dish, two", "dishes", "접시"],
    ["a teacher, two", "teachers", "선생님"],
    ["a rose, four", "roses", "장미"],
    ["a photo, two", "photos", "사진"],
  ];
  const jumpB = [
    ["three benches", "bench", "벤치"],
    ["five houses", "house", "집"],
    ["six girls", "girl", "여자아이"],
    ["eight boxes", "box", "상자"],
    ["two heroes", "hero", "영웅"],
    ["nine buses", "bus", "버스"],
    ["seven bears", "bear", "곰"],
    ["three caps", "cap", "모자"],
    ["two potatoes", "potato", "감자"],
    ["five dishes", "dish", "접시"],
    ["six photos", "photo", "사진"],
    ["seven pencils", "pencil", "연필"],
    ["three birds", "bird", "새"],
    ["four glasses", "glass", ["(유리)잔", "유리잔", "잔"]],
  ];
  function koAccept(ko) {
    const list = Array.isArray(ko) ? ko : [ko];
    return list;
  }
  function pairAccept(en, ko) {
    const kos = koAccept(ko);
    const out = [];
    for (const k of kos) out.push(`${en}|${k}`);
    return out;
  }
  p.items = [
    fillItem("a01", "A", sA, "A1", "a chair, two → chairs / 의자", ["chairs|의자"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "chairs / 의자",
      blanks: 2,
    }),
    ...jumpA.map((row, i) =>
      fillItem(`a${String(i + 2).padStart(2, "0")}`, "A", sA, `A${i + 2}`, row[0], pairAccept(row[1], row[2]), {
        blanks: 2,
      })
    ),
    fillItem("b01", "B", sB, "B1", "two desks → desk / 책상", ["desk|책상"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "desk / 책상",
      blanks: 2,
    }),
    ...jumpB.map((row, i) =>
      fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, row[0], pairAccept(row[1], row[2]), {
        blanks: 2,
      })
    ),
  ];
  return p;
}

function lesson01Fly() {
  const p = base(
    "b1:u02:lesson01-fly",
    "Lesson 01 Fly — 셀 수 있는 명사",
    "고치기·완성 (pp. 38–39)",
    "38–39",
    26,
    "Section A: 밑줄 친 부분만 고쳐 쓰기. Section B: 괄호 단어로 문장 완성(빈칸 말만)."
  );
  const dirA = "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.";
  const ruleA = "밑줄 친 부분을 고친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 0, [
    "A1",
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
    "A13",
    "A14",
    "A15",
  ]);
  sA.itemCount = 15;
  sA.exampleCount = 0;
  const dirB = "주어진 말을 사용하여 다음 문장을 완성하세요.";
  const ruleB = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.) 괄호 안의 말을 알맞은 형태로 바꿔 쓰세요.";
  const sB = sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 14, 1, [
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
  ]);
  p.sections = [sA, sB];
  const flyA = [
    ["I need a <u>bags</u>.", "bag"],
    ["I want two <u>pen</u>.", "pens"],
    ["We have five <u>dish</u>.", "dishes"],
    ["They have two <u>dog</u>.", "dogs"],
    ["I know five <u>girl</u>.", "girls"],
    ["They need two <u>benchs</u>.", "benches"],
    ["They have one <u>sons</u>.", "son"],
    ["I have ten <u>book</u>.", "books"],
    ["I want two <u>tomato</u>.", "tomatoes"],
    ["We have one <u>horses</u>.", "horse"],
    ["I have three <u>room</u>.", "rooms"],
    ["Give me one <u>pencils</u>.", "pencil"],
    ["I need ten <u>box</u>.", "boxes"],
    ["I have two <u>notebook</u>.", "notebooks"],
    ["They have two <u>piano</u>.", "pianos"],
  ];
  const flyB = [
    ["I have three ______. (bag)", "bags"],
    ["I have twenty ______. (book)", "books"],
    ["I have seven ______. (friend)", "friends"],
    ["They have two ______. (bear)", "bears"],
    ["We need five ______. (table)", "tables"],
    ["They need two ______. (bench)", "benches"],
    ["They know three ______. (hero)", "heroes"],
    ["I know ten ______. (teacher)", "teachers"],
    ["We need eight ______. (potato)", "potatoes"],
    ["I have six ______. (box)", "boxes"],
    ["We have two ______. (piano)", "pianos"],
    ["They have four ______. (bus)", "buses"],
    ["I need five ______. (dish)", "dishes"],
    ["They need ten ______. (glass)", "glasses"],
  ];
  p.items = [
    ...flyA.map((row, i) => fillItem(`a${String(i + 1).padStart(2, "0")}`, "A", sA, `A${i + 1}`, row[0], [row[1]])),
    fillItem("b01", "B", sB, "B1", "We have two ______. (cat)", ["cats"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "cats",
      promptKo: "우리는 고양이 두 마리를 가지고 있다.",
    }),
    ...flyB.map((row, i) => fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, row[0], [row[1]])),
  ];
  return p;
}

function lesson02Walk() {
  const p = base(
    "b1:u02:lesson02-walk",
    "Lesson 02 Walk — 셀 수 있는 명사",
    "복수형 규칙 (2) (p. 41)",
    "41",
    10,
    "규칙 보기(y→ies, s, f→ves, fe→ves)에서 골라 복수형을 씁니다."
  );
  const dir = "다음 중 알맞은 규칙을 찾아 빈칸에 써넣고, 주어진 명사의 복수형을 쓰세요.";
  const rule = "규칙 칸과 복수형 칸에 각각 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
  const sA = sec("A", "Section A", dir, rule, "words", "Words · 빈칸 말만", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]);
  p.sections = [sA];
  const rules = {
    yies: ["y → ies", "y→ies", "y-ies"],
    s: ["s", "+ s", "+s"],
    fves: ["f → ves", "f→ves", "f-ves"],
    feves: ["fe → ves", "fe→ves", "fe-ves"],
  };
  const rows = [
    ["strawberry", "yies", "strawberries"],
    ["monkey", "s", "monkeys"],
    ["leaf", "fves", "leaves"],
    ["knife", "feves", "knives"],
    ["roof", "s", "roofs"],
    ["city", "yies", "cities"],
    ["wolf", "fves", "wolves"],
    ["lady", "yies", "ladies"],
    ["puppy", "yies", "puppies"],
  ];
  p.items = [
    fillItem("a01", "A", sA, "A1", "baby + y → ies → babies", ["y → ies|babies", "y→ies|babies"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "y → ies / babies",
      blanks: 2,
    }),
    ...rows.map(([noun, rk, pl], i) => {
      const rlist = rules[rk];
      const acc = rlist.map((r) => `${r}|${pl}`);
      return fillItem(`a${String(i + 2).padStart(2, "0")}`, "A", sA, `A${i + 2}`, `${noun} + ___ → ___`, acc, { blanks: 2 });
    }),
  ];
  return p;
}

function lesson02Walk2() {
  const p = base(
    "b1:u02:lesson02-walk2",
    "Lesson 02 Walk 2 — 셀 수 있는 명사",
    "불규칙 복수 (p. 43)",
    "43",
    10,
    "Section A: 불규칙 단수·복수 열. Section B: 단수·복수 연결 고르기."
  );
  const ruleW = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 중 명사의 단수형과 복수형을 찾아 빈칸에 순서대로 쓰세요.";
  const sA = sec("A", "Section A", dirA, ruleW, "words", "Words · 빈칸 말만", 3, 1, ["A2", "A3", "A4"]);
  const dirB = "다음 명사의 단수형과 복수형을 선으로 연결하세요.";
  const ruleC = "알맞은 복수형(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sB = sec("B", "Section B", dirB, ruleC, "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5"]);
  p.sections = [sA, sB];
  const match = [
    { prompt: "man", accept: ["e. men", "e"] },
    { prompt: "child", accept: ["d. children", "d"] },
    { prompt: "foot", accept: ["a. feet", "a"] },
    { prompt: "sheep", accept: ["c. sheep", "c"] },
  ];
  p.items = [
    fillItem("a01", "A", sA, "A1", "단수형 ① ox / 복수형 ① teeth", ["ox|teeth"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "ox / teeth",
      blanks: 2,
    }),
    fillItem("a02", "A", sA, "A2", "단수형 2 / 복수형 2", ["woman|oxen"], { blanks: 2 }),
    fillItem("a03", "A", sA, "A3", "단수형 3 / 복수형 3", ["goose|geese"], { blanks: 2 }),
    fillItem("a04", "A", sA, "A4", "단수형 4 / 복수형 4", ["tooth|women"], { blanks: 2 }),
    mcItem("b01", "B", sB, "B1", "deer", ["a. feet", "b. deer", "c. sheep", "d. children", "e. men"], ["b. deer", "b"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "b. deer",
      promptKo: "사슴",
    }),
    ...match.map((m, i) =>
      mcItem(`b0${i + 2}`, "B", sB, `B${i + 2}`, m.prompt, ["a. feet", "b. deer", "c. sheep", "d. children", "e. men"], m.accept, {
        promptKo: { man: "남자", child: "어린이", foot: "발", sheep: "양" }[m.prompt],
      })
    ),
  ];
  return p;
}

function lesson02Run() {
  const p = base(
    "b1:u02:lesson02-run",
    "Lesson 02 Run — 셀 수 있는 명사",
    "불규칙 복수 (pp. 44–45)",
    "44–45",
    20,
    "Section A·B 각 15문항(예시 1)."
  );
  const ruleC = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sA = sec("A", "Section A", "다음 명사의 복수형을 골라 동그라미 하세요.", ruleC, "choice", "Choose · 고르기", 14, 1, [
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
    "A13",
    "A14",
    "A15",
  ]);
  const sB = sec("B", "Section B", "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", ruleC, "choice", "Choose · 고르기", 14, 1, [
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
  ]);
  p.sections = [sA, sB];
  const runA = [
    { prompt: "toy", choices: ["toys", "toies"], accept: ["toys"] },
    { prompt: "leaf", choices: ["leafs", "leaves"], accept: ["leaves"] },
    { prompt: "deer", choices: ["deer", "deers"], accept: ["deer"] },
    { prompt: "foot", choices: ["foots", "feet"], accept: ["feet"] },
    { prompt: "man", choices: ["men", "mans"], accept: ["men"] },
    { prompt: "child", choices: ["childs", "children"], accept: ["children"] },
    { prompt: "lady", choices: ["ladys", "ladies"], accept: ["ladies"] },
    { prompt: "monkey", choices: ["monkeys", "monkeyes"], accept: ["monkeys"] },
    { prompt: "wolf", choices: ["wolfs", "wolves"], accept: ["wolves"] },
    { prompt: "country", choices: ["countrys", "countries"], accept: ["countries"] },
    { prompt: "tooth", choices: ["teeth", "teeths"], accept: ["teeth"] },
    { prompt: "sheep", choices: ["sheeps", "sheep"], accept: ["sheep"] },
    { prompt: "roof", choices: ["roofs", "rooves"], accept: ["roofs"] },
    { prompt: "goose", choices: ["gooses", "geese"], accept: ["geese"] },
  ];
  const runB = [
    { prompt: "They have two ______.", choices: ["baby", "babies"], accept: ["babies"] },
    { prompt: "I need a ______.", choices: ["knife", "knives"], accept: ["knife"] },
    { prompt: "I have four ______.", choices: ["leafs", "leaves"], accept: ["leaves"] },
    { prompt: "I have two ______.", choices: ["feet", "foots"], accept: ["feet"] },
    { prompt: "We have three ______.", choices: ["goose", "geese"], accept: ["geese"] },
    { prompt: "I wear ______.", choices: ["glass", "glasses"], accept: ["glasses"] },
    { prompt: "They have four ______.", choices: ["children", "childs"], accept: ["children"] },
    { prompt: "We have twelve ______.", choices: ["sheep", "sheeps"], accept: ["sheep"] },
    { prompt: "I need ______.", choices: ["pant", "pants"], accept: ["pants"] },
    { prompt: "I know five ______.", choices: ["city", "cities"], accept: ["cities"] },
    { prompt: "They need three ______.", choices: ["strawberries", "strawberrys"], accept: ["strawberries"] },
    { prompt: "I have three ______.", choices: ["puppy", "puppies"], accept: ["puppies"] },
    { prompt: "I see two ______.", choices: ["ladys", "ladies"], accept: ["ladies"] },
    { prompt: "We need seven ______.", choices: ["days", "daies"], accept: ["days"] },
  ];
  p.items = [
    ...mcRunA(sA, runA, { prompt: "baby", choices: ["babys", "babies"], accept: ["babies"] }),
    mcItem("b01", "B", sB, "B1", "I have seven ______.", ["toy", "toys"], ["toys"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "toys",
    }),
    ...runB.map((it, i) => mcItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, it.prompt, it.choices, it.accept)),
  ];
  return p;
}

function lesson02Jump() {
  const p = base(
    "b1:u02:lesson02-jump",
    "Lesson 02 Jump — 셀 수 있는 명사",
    "불규칙 복수·뜻 (pp. 46–47)",
    "46–47",
    24,
    "Section A·B 각 15문항(예시 1)."
  );
  const rule = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sA = sec("A", "Section A", "다음 명사의 복수형과 그 뜻을 빈칸에 쓰세요.", rule, "words", "Words · 빈칸 말만", 14, 1, [
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
    "A13",
    "A14",
    "A15",
  ]);
  const sB = sec("B", "Section B", "다음 명사의 단수형과 그 뜻을 빈칸에 쓰세요.", rule, "words", "Words · 빈칸 말만", 14, 1, [
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
  ]);
  p.sections = [sA, sB];
  const jumpA = [
    ["a toy, three", "toys", "장난감"],
    ["a leaf, four", "leaves", "(나뭇)잎"],
    ["a fish, five", "fish", "물고기"],
    ["a woman, six", "women", ["여자", "여자분"]],
    ["a foot, two", "feet", "발"],
    ["a calf, three", "calves", "송아지"],
    ["a roof, six", "roofs", "지붕"],
    ["a sheep, five", "sheep", "양"],
    ["a tooth, seven", "teeth", ["이", "치아"]],
    ["a child, three", "children", "어린이"],
    ["an ox, nine", "oxen", "황소"],
    ["a goose, ten", "geese", "거위"],
    ["a deer, four", "deer", "사슴"],
    ["a country, two", "countries", "나라"],
  ];
  const jumpB = [
    ["six wolves", "wolf", "늑대"],
    ["nine sheep", "sheep", "양"],
    ["five fish", "fish", "물고기"],
    ["seven ladies", "lady", ["여자분", "숙녀"]],
    ["eight children", "child", "어린이"],
    ["two women", "woman", ["여자", "여자분"]],
    ["five feet", "foot", "발"],
    ["seven oxen", "ox", "황소"],
    ["eight countries", "country", "나라"],
    ["two knives", "knife", "칼"],
    ["seven monkeys", "monkey", "원숭이"],
    ["three geese", "goose", "거위"],
    ["four deer", "deer", "사슴"],
    ["five leaves", "leaf", "(나뭇)잎"],
  ];
  function pairAccept(en, ko) {
    const kos = Array.isArray(ko) ? ko : [ko];
    return kos.map((k) => `${en}|${k}`);
  }
  p.items = [
    fillItem("a01", "A", sA, "A1", "a city, two → cities / 도시", ["cities|도시"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "cities / 도시",
      blanks: 2,
    }),
    ...jumpA.map((row, i) =>
      fillItem(`a${String(i + 2).padStart(2, "0")}`, "A", sA, `A${i + 2}`, row[0], pairAccept(row[1], row[2]), { blanks: 2 })
    ),
    fillItem("b01", "B", sB, "B1", "two teeth → tooth / 이, 치아", ["tooth|이", "tooth|치아"], {
      example: true,
      displayOnly: true,
      exampleAnswer: "tooth / 이",
      blanks: 2,
    }),
    ...jumpB.map((row, i) =>
      fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, row[0], pairAccept(row[1], row[2]), { blanks: 2 })
    ),
  ];
  return p;
}

function lesson02Fly() {
  const p = base(
    "b1:u02:lesson02-fly",
    "Lesson 02 Fly — 셀 수 있는 명사",
    "고치기·완성 (pp. 48–49)",
    "48–49",
    28,
    "Section A: 밑줄 친 부분 고치기. Section B: 괄호 단어로 완성."
  );
  const sA = sec(
    "A",
    "Section A",
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.",
    "밑줄 친 부분을 고친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
    "words",
    "Words · 빈칸 말만",
    14,
    1,
    ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]
  );
  const sB = sec(
    "B",
    "Section B",
    "주어진 말을 사용하여 다음 문장을 완성하세요.",
    "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.) 괄호 안의 말을 알맞은 형태로 바꿔 쓰세요.",
    "words",
    "Words · 빈칸 말만",
    14,
    1,
    ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]
  );
  p.sections = [sA, sB];
  const flyA = [
    ["We have twenty <u>sheeps</u>.", "sheep"],
    ["I need new <u>jean</u>.", "jeans"],
    ["I wear <u>pant</u>.", "pants"],
    ["Give me the <u>scissor</u>.", "scissors"],
    ["I see five <u>mans</u>.", "men"],
    ["They have ten <u>gooses</u>.", "geese"],
    ["They have two <u>puppys</u>.", "puppies"],
    ["I have two <u>leafs</u>.", "leaves"],
    ["They are good <u>wifes</u>.", "wives"],
    ["I want five <u>toies</u>.", "toys"],
    ["We see four <u>womans</u>.", "women"],
    ["We have eleven <u>deers</u>.", "deer"],
    ["They have three <u>childs</u>.", "children"],
    ["We have six <u>oxes</u>.", "oxen"],
  ];
  const flyB = [
    ["They have three ______. (fish)", "fish"],
    ["I wear ______. (jean)", "jeans"],
    ["They have four ______. (foot)", "feet"],
    ["We have six ______. (goose)", "geese"],
    ["I have ten ______. (sheep)", "sheep"],
    ["We see seven ______. (woman)", "women"],
    ["They have five ______. (strawberry)", "strawberries"],
    ["We have two ______. (knife)", "knives"],
    ["They have eight ______. (ox)", "oxen"],
    ["I know four ______. (city)", "cities"],
    ["I have many ______. (leaf)", "leaves"],
    ["They have two ______. (child)", "children"],
    ["I see four ______. (man)", "men"],
    ["I see two ______. (wolf)", "wolves"],
  ];
  p.items = [
    fillItem("a01", "A", sA, "A1", "I have two <u>babys</u>.", ["babies"], { example: true, displayOnly: true, exampleAnswer: "babies" }),
    ...flyA.map((row, i) => fillItem(`a${String(i + 2).padStart(2, "0")}`, "A", sA, `A${i + 2}`, row[0], [row[1]])),
    fillItem("b01", "B", sB, "B1", "I need two ______. (day)", ["days"], { example: true, displayOnly: true, exampleAnswer: "days" }),
    ...flyB.map((row, i) => fillItem(`b${String(i + 2).padStart(2, "0")}`, "B", sB, `B${i + 2}`, row[0], [row[1]])),
  ];
  return p;
}

function review02() {
  const p = base(
    "b1:u02:review02",
    "Review 02",
    "Unit 02 셀 수 있는 명사 (pp. 50–52)",
    "50–52",
    30,
    "Review 02는 1~20번. Check Check 점수표는 채점하지 않아요."
  );
  const mkSec = (id, title, directionKo, ruleKo, mode, tag, labels) =>
    sec(id, title, directionKo, ruleKo, mode, tag, labels.length, 0, labels);
  p.sections = [
    mkSec("1", "[1]", "다음 중 셀 수 있는 명사가 아닌 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["1"]),
    mkSec("2", "[2]", "다음 중 명사의 복수형을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["2"]),
    mkSec("3-5", "[3–5]", "다음 중 명사의 단수형과 복수형이 잘못 짝지어진 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["3", "4", "5"]),
    mkSec("6-8", "[6–8]", "다음 밑줄 친 부분을 바르게 고친 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["6", "7", "8"]),
    mkSec("9-10", "[9–10]", "다음 문장을 아래와 같이 바꿔 쓸 때, 괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["9", "10"]),
    mkSec("11-12", "[11–12]", "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", ["11", "12"]),
    mkSec("13-15", "[13–15]", "다음 문장을 아래와 같이 바꿔 쓸 때, 빈칸에 알맞은 단어를 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", ["13", "14", "15"]),
    mkSec("16-18", "[16–18]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", "빈칸에 들어갈 말만 쓰세요. 괄호 안의 말을 알맞은 형태로 바꿔 쓰세요.", "words", "Words · 빈칸 말만", ["16", "17", "18"]),
    mkSec("19-20", "[19–20]", "다음 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", ["19", "20"]),
  ];
  const ch = (section, label, id, promptEn, choices, accept, extra = {}) =>
    mcItem(id, section, p.sections.find((s) => s.id === section), label, promptEn, choices, accept, extra);
  p.items = [
    ch("1", "1", "q01", "셀 수 있는 명사가 아닌 것", ["box", "water", "bag", "day"], ["water", "2"]),
    ch("2", "2", "q02", "명사의 복수형", ["dish", "mother", "women", "school"], ["women", "3"]),
    ch("3-5", "3", "q03", "잘못 짝지어진 단수·복수", ["boy – boys", "bus – buses", "leaf – leaves", "city – citys"], ["city – citys", "4"]),
    ch("3-5", "4", "q04", "잘못 짝지어진 단수·복수", [
      "potato – potatoes",
      "sheep – sheeps",
      "man – men",
      "country – countries",
    ], ["sheep – sheeps", "2"]),
    ch("3-5", "5", "q05", "잘못 짝지어진 단수·복수", [
      "child – children",
      "monkey – monkeys",
      "foot – feets",
      "fish – fish",
    ], ["foot – feets", "3"]),
    ch("6-8", "6", "q06", "I need two <u>tomatos</u>.", ["tomato", "tomatoes", "tomatoen", "tomatoses"], ["tomatoes", "2"]),
    ch("6-8", "7", "q07", "We have five <u>puppy</u>.", ["puppys", "puppyes", "puppies", "puppyees"], ["puppies", "3"]),
    ch("6-8", "8", "q08", "They have ten <u>gooses</u>.", ["goose", "goosen", "geeses", "geese"], ["geese", "4"]),
    mcItem("q09", "9-10", p.sections[4], "9", "They have two ( childs / children ).", ["childs", "children"], ["children"]),
    mcItem("q10", "9-10", p.sections[4], "10", "We need ten ( dishs / dishes ).", ["dishs", "dishes"], ["dishes"]),
    mcItem("q11", "11-12", p.sections[5], "11", "I need ( scissor / scissors ).", ["scissor", "scissors"], ["scissors"], { promptKo: "나는 가위가 필요하다." }),
    mcItem("q12", "11-12", p.sections[5], "12", "We have ten ( deer / deers ).", ["deer", "deers"], ["deer"], { promptKo: "우리는 사슴 열 마리를 가지고 있다." }),
    fillItem("q13", "13-15", p.sections[6], "13", "They have two ______. (knife → knives)", ["knives"]),
    fillItem("q14", "13-15", p.sections[6], "14", "I have three ______. (goose → geese)", ["geese"]),
    fillItem("q15", "13-15", p.sections[6], "15", "We see two ______. (baby → babies)", ["babies"]),
    fillItem("q16", "16-18", p.sections[7], "16", "I wear ______. (glass)", ["glasses"], { promptKo: "나는 안경을 쓴다." }),
    fillItem("q17", "16-18", p.sections[7], "17", "They have ten ______. (sheep)", ["sheep"], { promptKo: "그들은 양을 열 마리 가지고 있다." }),
    fillItem("q18", "16-18", p.sections[7], "18", "We have seven ______. (tomato)", ["tomatoes"], { promptKo: "우리는 토마토 일곱 개를 가지고 있다." }),
    sentItem("q19", "19-20", p.sections[8], "19", "They have ten <u>bench</u>.", ["They have ten benches."], { promptKo: "그들은 벤치 열 개를 가지고 있다." }),
    sentItem("q20", "19-20", p.sections[8], "20", "I see four <u>mans</u>.", ["I see four men."], { promptKo: "나는 남자 네 명을 본다." }),
  ];
  return p;
}

const files = {
  "lesson01-walk.json": lesson01Walk(),
  "lesson01-walk2.json": lesson01Walk2(),
  "lesson01-run.json": lesson01Run(),
  "lesson01-jump.json": lesson01Jump(),
  "lesson01-fly.json": lesson01Fly(),
  "lesson02-walk.json": lesson02Walk(),
  "lesson02-walk2.json": lesson02Walk2(),
  "lesson02-run.json": lesson02Run(),
  "lesson02-jump.json": lesson02Jump(),
  "lesson02-fly.json": lesson02Fly(),
  "review-02.json": review02(),
};

function enrichPromptKo(data) {
  for (const it of data.items) {
    if (it.promptKo || it.displayOnly) continue;
    if (!it.promptEn || !/[A-Za-z]/.test(it.promptEn)) continue;
    if (/^(단어|문장|셀 수|단수형|복수형|잘못|명사의)/.test(it.promptEn)) continue;
    if ((it.blanks || 1) > 1 && it.accept && it.accept[0] && String(it.accept[0]).includes("|")) {
      const ko = String(it.accept[0]).split("|")[1];
      if (ko && /[가-힣]/.test(ko)) it.promptKo = ko;
      continue;
    }
    if (it.type === "fill" && it.accept && it.accept[0] && /[가-힣]/.test(String(it.accept[0]))) {
      it.promptKo = String(it.accept[0]);
      continue;
    }
    if (/<u>/.test(it.promptEn)) {
      it.promptKo = "밑줄 친 부분을 바르게 고치세요.";
      continue;
    }
    if (/\(/.test(it.promptEn)) {
      it.promptKo = "괄호 안 단어를 알맞은 형태로 바꿔 쓰세요.";
    }
  }
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, data] of Object.entries(files)) {
  enrichPromptKo(data);
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, "items", data.items.length);
}
