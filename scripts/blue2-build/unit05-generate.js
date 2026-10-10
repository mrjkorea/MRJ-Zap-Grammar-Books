#!/usr/bin/env node
/* Generate data/blue2/unit05/*.json — run from repo root: node scripts/blue2-build/unit05-generate.js */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue2/unit05");
const META = {
  bookId: "zap-blue-2",
  bookTitle: "ZAP Blue 2",
  appName: "BlueZap 2",
  unitId: "unit-05",
  unitTitle: "Unit 05 — 수량을 나타내는 말",
  sectionsVersion: 2,
};

let idSeq = 0;
function nid(prefix) {
  idSeq += 1;
  return prefix + String(idSeq).padStart(2, "0");
}

function sec(id, title, directionKo, ruleKo, answerMode, itemCount, exampleCount, labels, tag) {
  const modeTag =
    answerMode === "choice"
      ? "Choose · 고르기"
      : answerMode === "sentence"
        ? "Sentence · 문장 전체"
        : "Words · 빈칸 말만";
  const instructionKo = `${directionKo} ${ruleKo}`;
  return {
    id,
    title: id.match(/^\[/) ? id : `Section ${id}`,
    instructionKo,
    directionKo,
    ruleKo,
    answerMode,
    answerModeTag: tag || modeTag,
    itemCount,
    exampleCount,
    labels,
  };
}

function base(practiceId, title, subtitle, pages, timerMinutes, introKo, sections, items) {
  idSeq = 0;
  return {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    introKo,
    sections,
    items,
  };
}

function itemFields(section, sectionInstructionKo, answerMode, label, extra) {
  const tag =
    answerMode === "choice" ? "Choose · 고르기" : answerMode === "sentence" ? "Sentence · 문장 전체" : "Words · 빈칸 말만";
  return {
    section,
    sectionTitle: section.match(/^\[/) ? section : `Section ${section}`,
    sectionInstructionKo,
    answerMode,
    answerModeTag: tag,
    label,
    ...extra,
  };
}

function walkQuantNoun(section, instr, pairs, example) {
  const labels = pairs.map((_, i) => `${section}${i + (example ? 2 : 1)}`);
  const items = [];
  if (example) {
    const [sent, q, n, ko] = example;
    items.push({
      id: nid(section.toLowerCase()),
      ...itemFields(section, instr, "words", `${section}1`, {
        type: "fill",
        promptEn: sent,
        blanks: 2,
        unordered: true,
        accept: [`${q}|${n}`],
        promptKo: ko,
        example: true,
        displayOnly: true,
        exampleAnswer: `${q} / ${n}`,
      }),
    });
  }
  pairs.forEach(([sent, q, n, ko], i) => {
    const pe = sent.replace(new RegExp(`\\b(${n})\\b`, "i"), "<u>$1</u>");
    items.push({
      id: nid(section.toLowerCase()),
      ...itemFields(section, instr, "words", labels[i], {
        type: "fill",
        promptEn: pe,
        blanks: 2,
        unordered: true,
        accept: [`${q}|${n}`],
        promptKo: ko,
      }),
    });
  });
  return items;
}

function mcRun(section, instr, rows, exampleIdx) {
  const items = [];
  rows.forEach((row, i) => {
    const label = `${section}${i + 1}`;
    const [promptEn, choices, accept, promptKo] = row;
    const isEx = exampleIdx === i;
    const acc =
      typeof accept === "string" ? [accept, String(choices.indexOf(accept) + 1)] : Array.isArray(accept) ? accept : [accept];
    items.push({
      id: nid(section.toLowerCase()),
      ...itemFields(section, instr, "choice", label, {
        type: "mc",
        promptEn,
        choices,
        accept: acc,
        promptKo: promptKo || "",
        ...(isEx ? { example: true, displayOnly: true, exampleAnswer: accept } : {}),
      }),
    });
  });
  const graded = items.filter((x) => !x.displayOnly);
  const ex = items.filter((x) => x.displayOnly).length;
  return { labels: graded.map((x) => x.label), items, itemCount: graded.length, exampleCount: ex };
}

function fillWords(section, instr, rows) {
  const items = rows.map((row) => {
    const label = row[0];
    const promptEn = row[1];
    const promptKo = row[2];
    const blanks = row[3] || 1;
    const accept = row[4];
    const extra = row[5] || {};
    const isEx = extra.ex;
    return {
      id: nid(section.toLowerCase()),
      ...itemFields(section, instr, blanks > 1 && extra.sentence ? "sentence" : "words", label, {
        type: extra.sentence ? "sentence" : "fill",
        promptEn,
        promptKo,
        blanks,
        accept,
        ...extra,
        ...(isEx ? { example: true, displayOnly: true, exampleAnswer: accept[0].split("|")[0] } : {}),
      }),
    };
  });
  const graded = items.filter((x) => !x.displayOnly);
  const ex = items.filter((x) => x.displayOnly).length;
  return {
    items,
    itemCount: graded.length,
    exampleCount: ex,
    labels: graded.map((x) => x.label),
  };
}

function write(name, obj) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj, null, 2) + "\n");
}

// —— Lesson 01 Walk 1 (p. 115) ——
const w1Instr =
  "다음 문장에서 many나 much를 찾아 동그라미 하고 many나 much가 꾸며 주는 말을 찾아 밑줄을 치세요. 동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const w1A = walkQuantNoun(
  "A",
  w1Instr,
  [
    ["I don't have much time.", "much", "time", "나는 시간이 많지 않다."],
    ["Does the horse eat many carrots?", "many", "carrots", "그 말은당근을 많이 먹니?"],
    ["Paul doesn't drink much water.", "much", "water", "폴은 물을 많이 마시지 않는다."],
    ["The library doesn't have many books.", "many", "books", "그 도서관에는 책이 많지 않다."],
  ],
  ["Do you have many pencils?", "many", "pencils", "너는 연필이 많니?"]
);
const w1BInstr =
  "many와 much 뒤에 올 수 있는 명사를 찾아 선으로 연결하세요. 각 명사에 알맞은 말(many / much)을 골라 누르세요. (직접 쓰지 않아요.)";
const w1BNouns = [
  ["tickets", "many", "표"],
  ["boats", "many", "배"],
  ["time", "much", "시간"],
  ["milk", "much", "우유"],
  ["sunshine", "much", "햇빛"],
  ["bears", "many", "곰"],
  ["snow", "much", "눈"],
  ["dishes", "many", "접시"],
];
const w1BItems = w1BNouns.map(([noun, ans, ko], i) => {
  const label = `B${i + 1}`;
  const ex = i === 0;
  return {
    id: nid("b"),
    ...itemFields("B", w1BInstr, "choice", label, {
      type: "mc",
      promptEn: `${noun}`,
      promptKo: `${ko} — many / much`,
      choices: ["many", "much"],
      accept: [ans, ans === "many" ? "1" : "2"],
      ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
    }),
  };
});
write(
  "lesson01-walk1.json",
  base(
    "b2:u05:lesson01-walk1",
    "Lesson 01 Walk 1 — many / much",
    "many·much (p. 115)",
    "115",
    10,
    "Section A는 many/much와 꾸며 주는 말(각각 한 칸). Section B는 명사마다 many/much 고르기입니다. 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", "다음 문장에서 many나 much를 찾아 동그라미 하고 many나 much가 꾸며 주는 말을 찾아 밑줄을 치세요.", "동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", "many와 much 뒤에 올 수 있는 명사를 찾아 선으로 연결하세요.", "각 명사에 알맞은 말(many / much)을 골라 누르세요.", "choice", 7, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8"]),
    ],
    [...w1A, ...w1BItems]
  )
);

// —— Lesson 01 Walk 2 (p. 117) ——
const w2Instr =
  "다음 문장에서 a lot of나 lots of를 찾아 동그라미 하고 a lot of나 lots of가 꾸며 주는 말을 찾아 밑줄을 치세요. 동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const lot = (s, q, n, ko) => [s, q, n, ko];
const w2A = walkQuantNoun(
  "A",
  w2Instr,
  [
    lot("Do you need lots of ice?", "lots of", "ice", "너는 얼음이 많이 필요하니?"),
    lot("James reads a lot of books.", "a lot of", "books", "제임스는 책을 많이 읽는다."),
    lot("We eat lots of bread every day.", "lots of", "bread", "우리는 매일 빵을 많이 먹는다."),
    lot("The man visits a lot of cities.", "a lot of", "cities", "그 남자는 많은 도시를 방문한다."),
    lot("A lot of airplanes are at the airport.", "A lot of", "airplanes", "많은 비행기가 공항에 있다."),
    lot("They watch lots of movies in a year.", "lots of", "movies", "그들은 일 년에 영화를 많이 본다."),
    lot("A lot of children like Harry Potter.", "A lot of", "children", "많은 아이들이 해리 포터를 좋아한다."),
    lot("They sell lots of toys at the store.", "lots of", "toys", "그들은 가게에서 장난감을 많이 판다."),
    lot("My mother doesn't put lots of sugar in her coffee.", "lots of", "sugar", "우리 어머니는 커피에 설탕을 많이 넣지 않는다."),
  ],
  lot("The house has a lot of windows.", "a lot of", "windows", "그 집에는 창문이 많다.")
);
// Accept variants for a lot of / lots of / A lot of
w2A.forEach((it) => {
  if (it.displayOnly || !it.accept) return;
  const [p] = it.accept;
  const parts = p.split("|");
  if (parts[0].toLowerCase().includes("lot")) {
    const noun = parts[1];
    it.accept = [
      `a lot of|${noun}`,
      `lots of|${noun}`,
      `A lot of|${noun}`,
      `Lots of|${noun}`,
    ];
  }
});

// Re-write walk2 after accept patch
write(
  "lesson01-walk2.json",
  base(
    "b2:u05:lesson01-walk2",
    "Lesson 01 Walk 2 — a lot of / lots of",
    "a lot of·lots of (p. 117)",
    "117",
    10,
    "a lot of / lots of 와 꾸며 주는 명사를 각각 한 칸에 쓰세요. lots of 와 a lot of 는 같은 뜻으로 받아요.",
    [sec("A", "Section A", "다음 문장에서 a lot of나 lots of를 찾아 동그라미 하고 a lot of나 lots of가 꾸며 주는 말을 찾아 밑줄을 치세요.", "동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])],
    w2A
  )
);

// —— Lesson 01 Run (pp. 118–119) ——
const runAInstr =
  "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
const runARows = [
  ["He has (many / much) friends.", ["many", "much"], "many", "그는 친구가 많다."],
  ["Susie doesn't drink (many / much) milk.", ["many", "much"], "much", ""],
  ["They make (much / a lot of) spoons.", ["much", "a lot of"], "a lot of", ""],
  ["(A lot of / Much) taxis are on the road.", ["A lot of", "Much"], "A lot of", ""],
  ["Do they eat (many / much) cake?", ["many", "much"], "much", ""],
  ["The writer visits (much / lots of) countries.", ["much", "lots of"], "lots of", ""],
  ["We have (much / lots of) classes on Monday.", ["much", "lots of"], "lots of", ""],
  ["Annie writes (many / much) letters to her friends.", ["many", "much"], "many", ""],
  ["It doesn't need much (water / waters).", ["water", "waters"], "water", ""],
  ["She reads a lot of (comic book / comic books).", ["comic book", "comic books"], "comic books", ""],
  ["Does the market sell many (flower / flowers)?", ["flower", "flowers"], "flowers", ""],
  ["A lot of (cow / cows) are on the farm.", ["cow", "cows"], "cows", ""],
  ["We don't have many (chair / chairs) here.", ["chair", "chairs"], "chairs", ""],
  ["The old man wants lots of (rice / rices) every day.", ["rice", "rices"], "rice", ""],
  ["Do you wash many (dish / dishes) every day?", ["dish", "dishes"], "dishes", ""],
];
const runA = mcRun("A", runAInstr, runARows, 0);
const runBInstr =
  "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
const runBRows = [
  ["Minho knows ______ songs.", ["much", "a lot of"], "a lot of", ""],
  ["I don't want ______ money.", ["many", "much"], "much", ""],
  ["______ friends miss Victoria.", ["Much", "A lot of"], "A lot of", ""],
  ["Do you have many ______?", ["coat", "coats"], "coats", ""],
  ["They draw ______ pictures a day.", ["a lot of", "much"], "a lot of", ""],
  ["My mother makes lots of ______.", ["cookie", "cookies"], "cookies", ""],
  ["Her son doesn't read ______ books.", ["many", "much"], "many", ""],
  ["Harry and I eat a lot of ______.", ["vegetable", "vegetables"], "vegetables", ""],
  ["My sister doesn't drink ______ juice.", ["many", "much"], "much", ""],
  ["Sam doesn't write ______ songs.", ["many", "much"], "many", ""],
  ["Do you watch many ______?", ["game", "games"], "games", ""],
  ["They don't need ______ time.", ["many", "much"], "much", ""],
  ["Jessica eats lots of ______ every day.", ["tomato", "tomatoes"], "tomatoes", ""],
  ["Does she meet ______ friends?", ["many", "much"], "many", ""],
  ["We visit a lot of ______.", ["museum", "museums"], "museums", ""],
];
const runB = mcRun("B", runBInstr, runBRows, 0);
runB.items[0].example = true;
runB.items[0].displayOnly = true;
runB.items[0].exampleAnswer = "a lot of";
runB.itemCount = 14;
runB.exampleCount = 1;
runB.labels = runB.items.filter((x) => !x.displayOnly).map((x) => x.label);
write(
  "lesson01-run.json",
  base(
    "b2:u05:lesson01-run",
    "Lesson 01 Run — many / much / a lot of",
    "Grammar Run (pp. 118–119)",
    "118–119",
    18,
    "Section A·B 모두 고르기입니다. ①·② 순서는 책과 같습니다.",
    [
      sec("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중에서 알맞은 것을 하나 골라 누르세요.", "choice", 14, 1, runA.labels),
      sec("B", "Section B", "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중에서 알맞은 것을 하나 골라 누르세요.", "choice", 14, 1, runB.labels),
    ],
    [...runA.items, ...runB.items]
  )
);

// —— Lesson 01 Jump (pp. 120–121) ——
const jumpAInstr =
  "우리말 뜻과 같도록 보기에서 알맞은 단어를 찾아 빈칸에 쓰세요. 필요하면 형태를 바꿔 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const jumpNouns = [
  ["A2", "많은 기차들", "trains"],
  ["A3", "많은 치즈", "cheese"],
  ["A4", "많은 종이", "paper"],
  ["A5", "많은 버스들", "buses"],
  ["A6", "많은 주머니들", "pockets"],
  ["A7", "많은 소금", "salt"],
  ["A8", "많은 금", "gold"],
  ["A9", "많은 벤치들", "benches"],
  ["A10", "많은 새들", "birds"],
  ["A11", "많은 비", "rain"],
  ["A12", "많은 가스", "gas"],
  ["A13", "많은 문들", "doors"],
  ["A14", "많은 여우들", "foxes"],
  ["A15", "많은 주스", "juice"],
  ["A16", "많은 버터", "butter"],
  ["A17", "많은 상자들", "boxes"],
  ["A18", "많은 눈", "snow"],
  ["A19", "많은 시계들", "watches"],
  ["A20", "많은 질문들", "questions"],
];
const jumpAItems = [
  {
    id: nid("ja"),
    ...itemFields("A", jumpAInstr, "words", "A1", {
      type: "fill",
      promptEn: "많은 책들 → many ______",
      accept: ["books"],
      promptKo: "많은 책들",
      example: true,
      displayOnly: true,
      exampleAnswer: "books",
    }),
  },
  ...jumpNouns.map(([label, ko, w]) => ({
    id: nid("a"),
    ...itemFields("A", jumpAInstr, "words", label, {
      type: "fill",
      promptEn: `${ko} → many/much ______`,
      accept: [w],
      promptKo: ko,
    }),
  })),
];
const jumpBInstr =
  "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const jumpBRows = [
  ["B1", "The plants need ______ ______ of water.", "그 식물들은 많은 물이 필요하다.", 2, ["a lot|of", "lots|of"]],
  ["B2", "Do you have ______ uncles?", "너는 삼촌들이 많이 있니?", 1, ["many", "a lot of", "lots of"]],
  ["B3", "Sumin reads ______ books.", "수민이는 책을 많이 읽는다.", 1, ["many", "a lot of", "lots of"]],
  ["B4", "He doesn't want ______ jam.", "그는 많은 잼을 원하지 않는다.", 1, ["much", "a lot of", "lots of"]],
  ["B5", "My father does ______ work.", "우리 아버지는 일을 많이 하신다.", 1, ["much", "a lot of", "lots of"]],
  ["B6", "Anne doesn't eat ______ chocolate.", "앤은 초콜릿을 많이 먹지 않는다.", 1, ["much", "a lot of", "lots of"]],
  ["B7", "They want ______ postcards.", "그들은 많은 엽서를 원한다.", 1, ["many", "a lot of", "lots of"]],
  ["B8", "Tommy doesn't ask ______ questions.", "토미는 질문을 많이 하지 않는다.", 1, ["many", "a lot of", "lots of"]],
  ["B9", "I need ______ flour.", "나는 밀가루가 많이 필요하다.", 1, ["much", "a lot of", "lots of"]],
  ["B10", "Do the bees make ______ honey?", "그 벌들은 꿀을 많이 만드니?", 1, ["much", "a lot of", "lots of"]],
  ["B11", "______ children like ice cream.", "많은 아이들이 아이스크림을 좋아한다.", 1, ["Many", "A lot of", "Lots of"]],
  ["B12", "Do you visit ______ countries?", "너는 많은 나라를 방문하니?", 1, ["many", "a lot of", "lots of"]],
  ["B13", "He cleans ______ shoes.", "그는 많은 신발을 닦는다.", 1, ["many", "a lot of", "lots of"]],
  ["B14", "______ ants live in the tree.", "많은 개미들이 그 나무에 산다.", 1, ["Many", "A lot of", "Lots of"]],
  ["B15", "They don't play ______ computer games.", "그들은 많은 컴퓨터 게임을 하지 않는다.", 1, ["many", "a lot of", "lots of"]],
];
const jumpB = fillWords("B", jumpBInstr, jumpBRows);
write(
  "lesson01-jump.json",
  base(
    "b2:u05:lesson01-jump",
    "Lesson 01 Jump — many / much / a lot of",
    "Grammar Jump (pp. 120–121)",
    "120–121",
    22,
    "Section A는 보기 단어(형태 변화). Section B는 many/much/a lot of 등 양사만 쓰세요.",
    [
      sec("A", "Section A", "우리말 뜻과 같도록 보기에서 알맞은 단어를 찾아 빈칸에 쓰세요. 필요하면 형태를 바꿔 쓰세요.", "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 19, 1, jumpNouns.map((x) => x[0])),
      sec("B", "Section B", "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 15, 0, jumpB.labels),
    ],
    [...jumpAItems, ...jumpB.items]
  )
);

// —— Lesson 01 Fly (pp. 122–123) ——
const flyAInstr =
  "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const flyAData = [
  ["A1", "My brother has <u>much</u> toys.", 2, ["lots|of"], true, "내 남동생은 장난감이 많다."],
  ["A2", "I don't need <u>many</u> money.", 1, ["much"], false, "나는 많은 돈이 필요하지 않다."],
  ["A3", "Do you know <u>many song</u>?", 2, ["many|songs"], false, "너는 노래를 많이 알고 있니?"],
  ["A4", "<u>A lots of</u> boys play baseball.", 3, ["A lot|of", "a lot|of", "Lots|of", "lots|of"], false, "많은 남자아이들이 야구를 한다."],
  ["A5", "Does she eat <u>many</u> meat?", 1, ["much"], false, "그녀는 고기를 많이 먹니?"],
  ["A6", "We use <u>lot of</u> flour.", 3, ["a|lot|of", "lots|of"], false, "우리는 밀가루를 많이 쓴다."],
  ["A7", "Do they send <u>many card</u> every Christmas?", 2, ["many|cards"], false, "그들은 매년 크리스마스에 카드를 많이 보내니?"],
  ["A8", "Yura doesn't read <u>much</u> books.", 2, ["many|books"], false, "유라는 책을 많이 읽지 않는다."],
  ["A9", "They don't drink <u>much coffees</u>.", 2, ["much|coffee"], false, "그들은 커피를 많이 마시지 않는다."],
  ["A10", "Does he buy <u>many flower</u>?", 2, ["many|flowers"], false, "그는 꽃을 많이 사니?"],
  ["A11", "I don't take <u>much</u> photos.", 2, ["many|photos"], false, "나는 사진을 많이 찍지 않는다."],
  ["A12", "John makes a lot of <u>robot</u>.", 1, ["robots"], false, "존은 로봇을 많이 만든다."],
  ["A13", "My father visits <u>a lot</u> cities every month.", 3, ["a|lot|of", "lots|of"], false, "우리 아버지는 매달 많은 도시를 방문한다."],
  ["A14", "Does Kate watch <u>much</u> cartoons?", 2, ["many|cartoons"], false, "케이트는 만화를 많이 보니?"],
  ["A15", "He draws <u>of lot</u> pictures every year.", 3, ["a|lot|of", "lots|of"], false, "그는 매년 그림을 많이 그린다."],
];
const flyAItems = flyAData.map(([label, pe, blanks, acc, ex, ko]) => ({
  id: nid("fa"),
  ...itemFields("A", flyAInstr, "words", label, {
    type: "fill",
    promptEn: pe,
    blanks,
    accept: acc,
    promptKo: ko || "",
    unordered: blanks >= 3,
    ...(ex ? { example: true, displayOnly: true, exampleAnswer: acc[0].replace(/\|/g, " ") } : {}),
  }),
}));
const flyBInstr =
  "many 또는 much와 함께 주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";
const flyBRows = [
  ["B1", "A frog doesn't drink ______ ______. (water)", "개구리는 물을 많이 마시지 않는다.", 2, ["much|water"], { ex: true }],
  ["B2", "Do you read ______ ______? (storybook)", "", 2, ["many|storybooks"]],
  ["B3", "We don't have ______ ______. (oil)", "", 2, ["much|oil"]],
  ["B4", "The boy doesn't eat ______ ______. (vegetable)", "", 2, ["much|vegetables", "many|vegetables"]],
  ["B5", "Do you need ______ ______? (colored paper)", "", 2, ["much|colored paper", "much|colored|paper"]],
  ["B6", "Johnny doesn't write ______ ______. (letter)", "", 2, ["many|letters"]],
  ["B7", "Do ______ ______ love polar bears? (kid)", "", 2, ["many|kids"]],
  ["B8", "Do ______ ______ play soccer? (girl)", "", 2, ["many|girls"]],
  ["B9", "They don't need ______ ______. (gold)", "", 2, ["much|gold"]],
  ["B10", "Jackie doesn't take ______ ______. (photo)", "", 2, ["many|photos"]],
  ["B11", "Do you make ______ ______? (soup)", "", 2, ["much|soup"]],
  ["B12", "The store doesn't sell ______ ______. (cheese)", "", 2, ["much|cheese"]],
  ["B13", "Mike doesn't visit ______ ______. (city)", "", 2, ["many|cities"]],
  ["B14", "They don't buy ______ ______. (bread)", "", 2, ["much|bread"]],
  ["B15", "Alice doesn't watch ______ ______ ______. (TV program)", "", 3, ["many|TV programs", "many|TV|programs"]],
];
const flyB = fillWords("B", flyBInstr, flyBRows);
write(
  "lesson01-fly.json",
  base(
    "b2:u05:lesson01-fly",
    "Lesson 01 Fly — many / much / a lot of",
    "Grammar Fly (pp. 122–123)",
    "122–123",
    25,
    "Section A는 밑줄 부분만 고쳐 쓰기. Section B는 many/much + 괄호 단어로 빈칸을 채우세요.",
    [
      sec("A", "Section A", "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 14, 1, flyAItems.filter((x) => !x.displayOnly).map((x) => x.label)),
      sec("B", "Section B", "many 또는 much와 함께 주어진 말을 사용하여 다음 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)", "words", 14, 1, flyB.labels),
    ],
    [...flyAItems, ...flyB.items]
  )
);

// —— Lesson 02 Walk 1 (p. 125) ——
const l2w1Instr =
  "다음 문장에서 a few나 a little을 찾아 동그라미 하고 a few나 a little이 꾸며 주는 명사를 찾아 밑줄을 치세요. 동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const l2w1A = walkQuantNoun(
  "A",
  l2w1Instr,
  [
    lot("We eat a little bread every morning.", "a little", "bread", "우리는 매일 아침 빵을 조금 먹는다."),
    lot("Cindy visits a few parks every month.", "a few", "parks", "신디는 매달 공원을 몇 곳 방문한다."),
    lot("They need a little salt.", "a little", "salt", "그들은 소금이 조금 필요하다."),
    lot("Billy likes a few animals.", "a few", "animals", "빌리는 동물 몇 마리를 좋아한다."),
  ],
  lot("I have a few jackets.", "a few", "jackets", "나는 재킷이 몇 벌 있다.")
);
const l2w1BInstr = "a few와 a little 중 알맞은 말을 골라 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
const l2w1BWords = [
  ["B1", "______ time", "시간 조금", "a little", true],
  ["B2", "______ help", "도움 조금", "a little"],
  ["B3", "______ hours", "몇 시간", "a few"],
  ["B4", "______ tickets", "표 몇 장", "a few"],
  ["B5", "______ buttons", "단추 몇 개", "a few"],
  ["B6", "______ soup", "수프 조금", "a little"],
  ["B7", "______ sugar", "설탕 조금", "a little"],
  ["B8", "______ lessons", "수업 몇 시간", "a few"],
  ["B9", "______ dollars", "달러 약간", "a few"],
  ["B10", "______ knives", "칼 몇 자루", "a few"],
];
const l2w1BItems = l2w1BWords.map(([label, pe, ko, ans, ex]) => ({
  id: nid("l2b"),
  ...itemFields("B", l2w1BInstr, "words", label, {
    type: "fill",
    promptEn: pe,
    blanks: 1,
    accept: [ans, ans === "a few" ? "A few" : ans === "a little" ? "A little" : ans],
    promptKo: ko,
    ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
  }),
}));
write(
  "lesson02-walk1.json",
  base(
    "b2:u05:lesson02-walk1",
    "Lesson 02 Walk 1 — a few / a little",
    "a few·a little (p. 125)",
    "125",
    10,
    "Section A는 a few/a little + 명사. Section B는 a few / a little 만 쓰세요.",
    [
      sec("A", "Section A", "다음 문장에서 a few나 a little을 찾아 동그라미 하고 a few나 a little이 꾸며 주는 명사를 찾아 밑줄을 치세요.", "동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요.", "words", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", "a few와 a little 중 알맞은 말을 골라 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", 9, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]),
    ],
    [...l2w1A, ...l2w1BItems]
  )
);

// —— Lesson 02 Walk 2 (p. 127) ——
const l2w2Instr =
  "다음 문장에서 few나 little을 찾아 동그라미 하고 few나 little이 꾸며 주는 명사를 찾아 밑줄을 치세요. 동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
const l2w2A = walkQuantNoun(
  "A",
  l2w2Instr,
  [
    lot("My mother eats little bread.", "little", "bread", "우리 어머니는 빵을 거의 먹지 않는다."),
    lot("Jenny knows few boys in the school.", "few", "boys", "제니는 그 학교에서 남자아이를 거의 알지 못한다."),
    lot("Few people visit him.", "Few", "people", "사람들이 그를 거의 방문하지 않는다."),
    lot("We have little time now.", "little", "time", "우리는 지금 시간이 거의 없다."),
  ],
  lot("I have few ideas.", "few", "ideas", "나는 생각이 거의 없다.")
);
const l2w2BInstr = "few와 little 중 알맞은 말을 골라 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
const l2w2BWords = [
  ["little", "rice"],
  ["few", "letters"],
  ["few", "chopsticks"],
  ["little", "salt"],
  ["little", "tea"],
  ["little", "chicken"],
  ["few", "children"],
  ["few", "grapes"],
  ["little", "money"],
  ["few", "gorillas"],
];
const l2w2BItems = l2w2BWords.map((pair, i) => ({
  id: nid("l2w2b"),
  ...itemFields("B", l2w2BInstr, "words", `B${i + 1}`, {
    type: "fill",
    promptEn: `______ ${pair[1]}`,
    blanks: 1,
    accept: [pair[0], pair[0] === "few" ? "Few" : "Little"],
    promptKo: pair[1],
  }),
}));
write(
  "lesson02-walk2.json",
  base(
    "b2:u05:lesson02-walk2",
    "Lesson 02 Walk 2 — few / little",
    "few·little (p. 127)",
    "127",
    10,
    "few / little 과 꾸며 주는 명사, 또는 few/little 선택입니다.",
    [
      sec("A", "Section A", "다음 문장에서 few나 little을 찾아 동그라미 하고 few나 little이 꾸며 주는 명사를 찾아 밑줄을 치세요.", "동그라미 친 말과 밑줄 친 말을 각각 빈칸에 쓰세요.", "words", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", "few와 little 중 알맞은 말을 골라 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", 10, 0, ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]),
    ],
    [...l2w2A, ...l2w2BItems]
  )
);

// Lesson 02 Run
const l2RunARows = [
  ["I have (a few / a little) good friends.", ["a few", "a little"], "a few", ""],
  ["Kelly eats (a few / a little) cheese every day.", ["a few", "a little"], "a little", ""],
  ["We buy few (magazine / magazines).", ["magazine", "magazines"], "magazines", ""],
  ["The man needs (few / little) money.", ["few", "little"], "little", ""],
  ["Kevin drinks a little (juice / juices).", ["juice", "juices"], "juice", ""],
  ["I like (a few / a little) American singers.", ["a few", "a little"], "a few", ""],
  ["Do you want a little (salt / salts)?", ["salt", "salts"], "salt", ""],
  ["(Few / Little) children play the game.", ["Few", "Little"], "Few", ""],
  ["We have little (time / times).", ["time", "times"], "time", ""],
  ["My dad eats (a few / a little) pears.", ["a few", "a little"], "a little", ""],
  ["My mother bakes a few (cookie / cookies) every Sunday.", ["cookie", "cookies"], "cookies", ""],
  ["He speaks (few / little) English.", ["few", "little"], "little", ""],
  ["They visit a few (island / islands) every year.", ["island", "islands"], "islands", ""],
  ["(A few / A little) students clean the park on the weekend.", ["A few", "A little"], "A few", ""],
  ["I put a little (jam / jams) on the bread.", ["jam", "jams"], "jam", ""],
];
const l2RunA = mcRun("A", runAInstr, l2RunARows, 0);
const l2RunBRows = [
  ["The lady has ______ jam.", ["a few", "a little"], "a little", ""],
  ["He has a few ______.", ["cousin", "cousins"], "cousins", ""],
  ["My grandfather eats ______ meat.", ["few", "little"], "little", ""],
  ["A little ______ is in the glass.", ["milk", "milks"], "milk", ""],
  ["Do you need ______ oil?", ["a few", "a little"], "a little", ""],
  ["I drink a little ______ every morning.", ["tea", "teas"], "tea", ""],
  ["Jiho reads ______ books.", ["few", "little"], "few", ""],
  ["They sell a few ______.", ["mirror", "mirrors"], "mirrors", ""],
  ["She plants ______ trees.", ["few", "little"], "few", ""],
  ["We need a few ______.", ["hour", "hours"], "hours", ""],
  ["Do they have ______ sugar?", ["a few", "a little"], "a little", ""],
  ["Few ______ play tennis after school.", ["student", "students"], "students", ""],
  ["______ children know the movie.", ["Few", "Little"], "Few", ""],
  ["Bill has ______ questions.", ["a few", "a little"], "a few", ""],
  ["My brother uses little ______.", ["shampoo", "shampoos"], "shampoo", ""],
];
const l2RunB = mcRun("B", runBInstr, l2RunBRows, 0);
l2RunB.items[0].example = true;
l2RunB.items[0].displayOnly = true;
l2RunB.items[0].exampleAnswer = "a little";
l2RunB.itemCount = 14;
l2RunB.labels = l2RunB.items.filter((x) => !x.displayOnly).map((x) => x.label);
write(
  "lesson02-run.json",
  base(
    "b2:u05:lesson02-run",
    "Lesson 02 Run — a few / few / a little / little",
    "Grammar Run (pp. 128–129)",
    "128–129",
    18,
    "a few·few·a little·little 고르기 연습입니다.",
    [
      sec("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중에서 알맞은 것을 하나 골라 누르세요.", "choice", 14, 1, l2RunA.labels),
      sec("B", "Section B", "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중에서 알맞은 것을 하나 골라 누르세요.", "choice", 14, 1, l2RunB.labels),
    ],
    [...l2RunA.items, ...l2RunB.items]
  )
);

// Lesson 02 Jump
const l2JumpAInstr =
  "다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)";
const l2JumpA = [
  ["A1", "만화책 몇 권 → ______ ______ comic books", "a few", true, "만화책 몇 권"],
  ["A2", "밀가루 조금 → ______ ______ flour", "a little", false, "밀가루 조금"],
  ["A3", "쿠션 몇 개 → ______ ______ cushions", "a few", false, "쿠션 몇 개"],
  ["A4", "돈 조금 → ______ ______ money", "a little", false, "돈 조금"],
  ["A5", "동전이 거의 없는 → ______ coins", "few", false, "동전이 거의 없는"],
  ["A6", "물이 거의 없는 → ______ water", "little", false, "물이 거의 없는"],
  ["A7", "외국인이 거의 없는 → ______ foreigners", "few", false, "외국인이 거의 없는"],
];
const l2JumpAItems = l2JumpA.map(([label, pe, ans, ex, pko]) => ({
  id: nid("j2a"),
  ...itemFields("A", l2JumpAInstr, "words", label, {
    type: "fill",
    promptEn: pe,
    blanks: ans.includes(" ") ? 2 : 1,
    accept: ans.includes(" ") ? [ans.replace(" ", "|")] : [ans],
    promptKo: pko || "",
    ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
  }),
}));
const l2JumpBInstr = "다음 말의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
const l2JumpB = [
  ["B1", "a few windows", "창문 몇 개", ["창문 몇 개"], true],
  ["B2", "a little rice", "밥 조금", ["밥 조금", "쌀 조금"]],
  ["B3", "a few children", "아이 몇 명", ["아이 몇 명", "아이들 몇 명"]],
  ["B4", "a little hope", "희망 조금", ["희망 조금"]],
  ["B5", "a few magazines", "잡지 몇 권", ["잡지 몇 권"]],
  ["B6", "few classes", "수업이 거의 없다", ["수업이 거의 없다", "수업 거의 없음"]],
  ["B7", "little sugar", "설탕이 거의 없다", ["설탕이 거의 없다", "설탕 거의 없음"]],
];
const l2JumpBItems = l2JumpB.map(([label, pe, ko, acc, ex]) => ({
  id: nid("j2b"),
  ...itemFields("B", l2JumpBInstr, "words", label, {
    type: "fill",
    promptEn: pe,
    blanks: 1,
    accept: acc,
    promptKo: ko,
    ...(ex ? { example: true, displayOnly: true, exampleAnswer: acc[0] } : {}),
  }),
}));
const l2JumpCInstr =
  "다음 보기에서 알맞은 말을 찾아 빈칸에 쓰세요. 빈칸마다 한 단어씩 쓰세요. (a few / few / a little / little)";
const l2JumpC = [
  ["C1", "I have ______ ______ pencils.", "a few", true],
  ["C2", "The man needs ______ ______ sand.", "a little"],
  ["C3", "The street has ______ ______ stores.", "few"],
  ["C4", "The firefighters have ______ ______ time.", "little"],
  ["C5", "Paul drinks ______ ______ milk.", "little"],
  ["C6", "I eat ______ ______ bananas every day.", "a few"],
  ["C7", "We have ______ ______ dollars.", "a few"],
  ["C8", "He asks ______ ______ questions.", "few"],
  ["C9", "______ ______ boys are in the computer room.", "A few"],
  ["C10", "She knows ______ ______ teachers.", "few"],
  ["C11", "The singer visits ______ ______ countries every year.", "a few"],
  ["C12", "Tim eats ______ ______ pork.", "little"],
  ["C13", "Mr. Park teaches ______ ______ subjects.", "a few"],
  ["C14", "______ ______ flower pots are on the table.", "A few"],
  ["C15", "I put ______ ______ cheese on the bread.", "a little"],
];
const l2JumpCItems = l2JumpC.map(([label, pe, ans, ex]) => {
  const parts = ans.split(" ");
  return {
    id: nid("j2c"),
    ...itemFields("C", l2JumpCInstr, "words", label, {
      type: "fill",
      promptEn: pe,
      blanks: parts.length,
      accept: [parts.join("|"), parts.map((p, i) => (i === 0 && p === "A" ? "A few" : p)).join("|")],
      promptKo: "",
      ...(ex ? { example: true, displayOnly: true, exampleAnswer: ans } : {}),
    }),
  };
});
write(
  "lesson02-jump.json",
  base(
    "b2:u05:lesson02-jump",
    "Lesson 02 Jump — a few / few / a little / little",
    "Grammar Jump (pp. 130–131)",
    "130–131",
    23,
    "Section A·B·C — 보기·우리말·양사 선택.",
    [
      sec("A", "Section A", "다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", 6, 1, ["A2", "A3", "A4", "A5", "A6", "A7"]),
      sec("B", "Section B", "다음 말의 우리말 뜻을 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", 6, 1, ["B2", "B3", "B4", "B5", "B6", "B7"]),
      sec("C", "Section C", "다음 보기에서 알맞은 말을 찾아 빈칸에 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", 14, 1, ["C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "C14", "C15"]),
    ],
    [...l2JumpAItems, ...l2JumpBItems, ...l2JumpCItems]
  )
);

// Lesson 02 Fly
const l2FlyAData = [
  ["A1", "I read <u>a little books</u> every month.", 2, ["a few|books"], true, "나는 매달 몇 권의 책을 읽는다."],
  ["A2", "He bakes <u>a few bread</u> every day.", 2, ["a little|bread"], false, "그는 매일 빵을 조금 굽는다."],
  ["A3", "<u>A few student</u> study at the library.", 2, ["A few|students", "a few|students"], false, "학생 몇 명이 도서관에서 공부를 한다."],
  ["A4", "They need <u>a little ices</u>.", 2, ["a little|ice"], false, "그들은 얼음이 조금 필요하다."],
  ["A5", "We have <u>little holidays</u>.", 2, ["few|holidays"], false, "우리는 휴일이 거의 없다."],
  ["A6", "The artist draws <u>few picture</u>.", 2, ["few|pictures"], false, "그 화가는 그림을 거의 그리지 않는다."],
  ["A7", "My mother has <u>little pants</u>.", 2, ["few|pants"], false, "우리 어머니는 바지가 거의 없다."],
  ["A8", "Sally eats <u>a little ice cream</u>.", 2, ["little|ice cream", "little|ice|cream"], false, "샐리는 아이스크림을 거의 먹지 않는다."],
  ["A9", "We need <u>a little hours</u>.", 2, ["a few|hours"], false, "우리는 몇 시간이 필요하다."],
  ["A10", "I put <u>a few honey</u> in my tea.", 2, ["a little|honey"], false, "나는 차에 꿀을 조금 넣는다."],
  ["A11", "I watch <u>little movies</u>.", 2, ["few|movies"], false, "나는 영화를 거의 보지 않는다."],
  ["A12", "They have <u>little hopes</u>.", 2, ["little|hope"], false, "그들은 희망이 거의 없다."],
  ["A13", "Dad buys <u>a little eggs</u> every day.", 2, ["a few|eggs"], false, "아빠는 매일 달걀 몇 개를 사신다."],
  ["A14", "<u>A few juice</u> is in the glass.", 2, ["A little|juice", "a little|juice"], false, "유리잔에 주스가 조금 있다."],
  ["A15", "They have <u>a little snow</u>.", 2, ["little|snow"], false, "눈이 거의 오지 않는다."],
];
const l2FlyAItems = l2FlyAData.map(([label, pe, blanks, acc, ex, ko]) => ({
  id: nid("f2a"),
  ...itemFields("A", flyAInstr, "words", label, {
    type: "fill",
    promptEn: pe,
    blanks,
    accept: acc,
    promptKo: ko || "",
    ...(ex ? { example: true, displayOnly: true, exampleAnswer: acc[0].replace(/\|/g, " ") } : {}),
  }),
}));
const l2FlyBRows = [
  ["B1", "______ ______ are in the yard. (dog)", "", 2, ["A few|dogs", "a few|dogs"], { ex: true }],
  ["B2", "I need ______ ______. (help)", "", 2, ["a little|help"]],
  ["B3", "My sister reads ______ ______. (book)", "", 2, ["few|books"]],
  ["B4", "Frogs drink ______ ______. (water)", "", 2, ["little|water"]],
  ["B5", "______ ______ play badminton after school. (child)", "", 2, ["A few|children", "a few|children"]],
  ["B6", "The house has ______ ______. (window)", "", 2, ["few|windows"]],
  ["B7", "His uncle fixes ______ ______ every day. (bike)", "", 2, ["a few|bikes"]],
  ["B8", "My mother puts ______ ______ in her soup. (cheese)", "", 2, ["little|cheese"]],
  ["B9", "______ ______ are tall. (farmer)", "", 2, ["A few|farmers", "a few|farmers"]],
  ["B10", "Jake buys ______ ______ at the store. (beef)", "", 2, ["a little|beef"]],
  ["B11", "The garden has ______ ______. (tree)", "", 2, ["few|trees"]],
  ["B12", "John and I eat ______ ______ every day. (apple)", "", 2, ["a few|apples"]],
  ["B13", "The jacket has ______ ______. (button)", "", 2, ["few|buttons"]],
  ["B14", "They speak ______ ______. (English)", "", 2, ["little|English"]],
  ["B15", "They make ______ ______ every week. (chair)", "", 2, ["a few|chairs"]],
];
const l2FlyB = fillWords("B", "주어진 말을 사용하여 a few나 few, a little이나 little과 함께 다음 문장을 완성하세요. 빈칸마다 한 단어씩 쓰세요.", l2FlyBRows);
write(
  "lesson02-fly.json",
  base(
    "b2:u05:lesson02-fly",
    "Lesson 02 Fly — a few / few / a little / little",
    "Grammar Fly (pp. 132–133)",
    "132–133",
    25,
    "밑줄 고치기 + 양사와 주어진 단어로 완성하기.",
    [
      sec("A", "Section A", "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", 14, 1, l2FlyAItems.filter((x) => !x.displayOnly).map((x) => x.label)),
      sec("B", "Section B", "주어진 말을 사용하여 a few나 few, a little이나 little과 함께 다음 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", 14, 1, l2FlyB.labels),
    ],
    [...l2FlyAItems, ...l2FlyB.items]
  )
);

// Review 05
const revSections = [
  sec("1-3", "[1–3]", "[1–3] 다음 문장의 빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", 3, 0, ["1", "2", "3"]),
  sec("4-5", "[4–5]", "[4–5] 다음 밑줄 친 부분을 바르게 고친 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", 2, 0, ["4", "5"]),
  sec("6-8", "[6–8]", "[6–8] 다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", 3, 0, ["6", "7", "8"]),
  sec("9-12", "[9–12]", "[9–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", 4, 0, ["9", "10", "11", "12"]),
  sec("13-15", "[13–15]", "[13–15] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", 3, 0, ["13", "14", "15"]),
  sec("16-18", "[16–18]", "[16–18] 다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", 3, 0, ["16", "17", "18"]),
  sec("19-20", "[19–20]", "[19–20] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", 2, 0, ["19", "20"]),
];
const revItems = [
  {
    id: "r01",
    section: "1-3",
    ...itemFields("1-3", revSections[0].instructionKo, "choice", "1", {
      type: "mc",
      promptEn: "They don't have many ______.",
      choices: ["time", "money", "pencils", "water"],
      accept: ["3", "pencils"],
      promptKo: "",
    }),
  },
  {
    id: "r02",
    section: "1-3",
    ...itemFields("1-3", revSections[0].instructionKo, "choice", "2", {
      type: "mc",
      promptEn: "He doesn't need much ______.",
      choices: ["books", "computers", "eraser", "time"],
      accept: ["4", "time"],
      promptKo: "",
    }),
  },
  {
    id: "r03",
    section: "1-3",
    ...itemFields("1-3", revSections[0].instructionKo, "choice", "3", {
      type: "mc",
      promptEn: "I want a few ______.",
      choices: ["bread", "pens", "cheese", "milk"],
      accept: ["2", "pens"],
      promptKo: "",
    }),
  },
  {
    id: "r04",
    section: "4-5",
    ...itemFields("4-5", revSections[1].instructionKo, "choice", "4", {
      type: "mc",
      promptEn: "Do you have <u>much watches</u>?",
      choices: ["much watch", "a lot watches", "little watch", "many watches"],
      accept: ["4", "many watches"],
      promptKo: "",
    }),
  },
  {
    id: "r05",
    section: "4-5",
    ...itemFields("4-5", revSections[1].instructionKo, "choice", "5", {
      type: "mc",
      promptEn: "Jennifer reads <u>a little books</u> every week.",
      choices: ["little book", "a few books", "a lot of book", "much book"],
      accept: ["2", "a few books"],
      promptKo: "",
    }),
  },
  {
    id: "r06",
    section: "6-8",
    ...itemFields("6-8", revSections[2].instructionKo, "choice", "6", {
      type: "mc",
      promptEn: "",
      choices: [
        "Paul has <u>a lot of</u> friends.",
        "Do you know <u>many</u> students?",
        "Sally eats <u>a little</u> apples every day.",
        "We need <u>a little</u> money.",
      ],
      accept: ["3"],
      promptKo: "",
    }),
  },
  {
    id: "r07",
    section: "6-8",
    ...itemFields("6-8", revSections[2].instructionKo, "choice", "7", {
      type: "mc",
      promptEn: "",
      choices: [
        "The farmer has <u>few</u> pigs.",
        "They eat <u>lots of</u> meat.",
        "Do you have <u>a little</u> sugar?",
        "<u>Much</u> children like the movie.",
      ],
      accept: ["4"],
      promptKo: "",
    }),
  },
  {
    id: "r08",
    section: "6-8",
    ...itemFields("6-8", revSections[2].instructionKo, "choice", "8", {
      type: "mc",
      promptEn: "",
      choices: [
        "I drink <u>a few</u> milk every morning.",
        "My mother makes <u>lots of</u> bread every day.",
        "Does John make <u>many</u> sandwiches?",
        "<u>A lot of</u> foreigners like K-pop.",
      ],
      accept: ["1"],
      promptKo: "",
    }),
  },
  {
    id: "r09",
    section: "9-12",
    ...itemFields("9-12", revSections[3].instructionKo, "choice", "9", {
      type: "mc",
      promptEn: "Carol has ( few / a few ) cousins.",
      promptKo: "캐롤은 사촌이 몇 명 있다.",
      choices: ["few", "a few"],
      accept: ["2", "a few"],
    }),
  },
  {
    id: "r10",
    section: "9-12",
    ...itemFields("9-12", revSections[3].instructionKo, "choice", "10", {
      type: "mc",
      promptEn: "Do they draw ( much / many ) pictures?",
      promptKo: "그들은 그림을 많이 그리니?",
      choices: ["much", "many"],
      accept: ["2", "many"],
    }),
  },
  {
    id: "r11",
    section: "9-12",
    ...itemFields("9-12", revSections[3].instructionKo, "choice", "11", {
      type: "mc",
      promptEn: "( Few / A few ) students listen to his song.",
      promptKo: "그의 노래를 듣는 학생들이 거의 없다.",
      choices: ["Few", "A few"],
      accept: ["1", "Few"],
    }),
  },
  {
    id: "r12",
    section: "9-12",
    ...itemFields("9-12", revSections[3].instructionKo, "choice", "12", {
      type: "mc",
      promptEn: "Julia puts ( little / a little ) milk in her tea.",
      promptKo: "줄리아는 자기 차에 우유를 조금 넣는다.",
      choices: ["little", "a little"],
      accept: ["2", "a little"],
    }),
  },
  {
    id: "r13",
    section: "13-15",
    ...itemFields("13-15", revSections[4].instructionKo, "words", "13", {
      type: "fill",
      promptEn: "______ children like computer games.",
      promptKo: "많은 아이들이 컴퓨터 게임을 좋아한다.",
      blanks: 1,
      accept: ["Many", "A lot of", "Lots of"],
    }),
  },
  {
    id: "r14",
    section: "13-15",
    ...itemFields("13-15", revSections[4].instructionKo, "words", "14", {
      type: "fill",
      promptEn: "Tom has ______ oil.",
      promptKo: "톰은 기름이 거의 없다.",
      blanks: 1,
      accept: ["little"],
    }),
  },
  {
    id: "r15",
    section: "13-15",
    ...itemFields("13-15", revSections[4].instructionKo, "words", "15", {
      type: "fill",
      promptEn: "I know ______ girls in this school.",
      promptKo: "나는 이 학교에서 아는 여자아이가 거의 없다.",
      blanks: 1,
      accept: ["few"],
    }),
  },
  {
    id: "r16",
    section: "16-18",
    ...itemFields("16-18", revSections[5].instructionKo, "words", "16", {
      type: "fill",
      promptEn: "I don't want ______ ______. (money)",
      promptKo: "나는 많은 돈을 원하지 않는다.",
      blanks: 2,
      accept: ["much|money"],
    }),
  },
  {
    id: "r17",
    section: "16-18",
    ...itemFields("16-18", revSections[5].instructionKo, "words", "17", {
      type: "fill",
      promptEn: "We need ______ ______. (hour)",
      promptKo: "우리는 몇 시간이 필요하다.",
      blanks: 2,
      accept: ["a few|hours"],
    }),
  },
  {
    id: "r18",
    section: "16-18",
    ...itemFields("16-18", revSections[5].instructionKo, "words", "18", {
      type: "fill",
      promptEn: "Susie eats ______ ______. (meat)",
      promptKo: "수지는 고기를 거의 먹지 않는다.",
      blanks: 2,
      accept: ["little|meat"],
    }),
  },
  {
    id: "r19",
    section: "19-20",
    ...itemFields("19-20", revSections[6].instructionKo, "sentence", "19", {
      type: "sentence",
      promptEn: "They don't buy <u>many</u> rice.",
      promptKo: "그들은 많은 쌀을 사지 않는다.",
      accept: ["They don't buy much rice.", "They don't buy much rice"],
    }),
  },
  {
    id: "r20",
    section: "19-20",
    ...itemFields("19-20", revSections[6].instructionKo, "sentence", "20", {
      type: "sentence",
      promptEn: "Bill visits <u>a little</u> countries every year.",
      promptKo: "빌은 매년 몇몇 국가들을 방문한다.",
      accept: ["Bill visits a few countries every year.", "Bill visits a few countries every year."],
    }),
  },
];
write(
  "review-05.json",
  base(
    "b2:u05:review05",
    "Review 05",
    "Unit 05 수량을 나타내는 말 (pp. 134–136)",
    "134–136",
    30,
    "Review 05 — 20문항. Check Check 점수표는 채점하지 않습니다.",
    revSections,
    revItems
  )
);

console.log("Generated all blue2 unit05 practices in", OUT);
