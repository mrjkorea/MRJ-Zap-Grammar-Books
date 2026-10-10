#!/usr/bin/env node
/* Generate data/blue3/unit05/*.json — run: node scripts/generate-blue3-unit05.js */
"use strict";

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../data/blue3/unit05");
const META = {
  bookId: "zap-blue-3",
  bookTitle: "ZAP Blue 3",
  appName: "BlueZap 3",
  unitId: "unit-05",
  unitTitle: "Unit 05 — 의문사 (2)",
};
const PREFIX = "b3:u05:";

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return { id, title, instructionKo, directionKo, ruleKo, answerMode, answerModeTag: tag, itemCount, exampleCount, labels };
}

function labelsFrom(n, start, prefix) {
  const out = [];
  for (let i = start; i < start + n; i++) out.push(prefix + i);
  return out;
}

function baseItem(id, section, label, sectionInstructionKo, answerMode, answerModeTag, extra) {
  return {
    id,
    section,
    sectionTitle: section.includes("-") ? "Section " + section : "Section " + section,
    sectionInstructionKo,
    answerMode,
    answerModeTag,
    label,
    ...extra,
  };
}

function ex(item, exampleAnswer) {
  return { ...item, example: true, displayOnly: true, exampleAnswer };
}

function mc(id, section, label, instr, tag, promptKo, promptEn, choices, accept, opts) {
  return baseItem(id, section, label, instr, "choice", tag, {
    type: "mc",
    promptKo,
    promptEn,
    choices,
    accept: Array.isArray(accept) ? accept : [accept],
    ...opts,
  });
}

function fill(id, section, label, instr, tag, promptKo, promptEn, accept, blanks, opts) {
  const a = Array.isArray(accept) ? accept : [accept];
  const item = baseItem(id, section, label, instr, "words", tag, {
    type: "fill",
    promptKo,
    promptEn,
    accept: a,
    ...opts,
  });
  if (blanks != null) item.blanks = blanks;
  return item;
}

function sentence(id, section, label, instr, tag, promptKo, promptEn, accept, opts) {
  return baseItem(id, section, label, instr, "sentence", tag, {
    type: "sentence",
    promptKo,
    promptEn,
    accept: Array.isArray(accept) ? accept : [accept],
    ...opts,
  });
}

function u(s, phrase) {
  if (!phrase) return s;
  const low = s.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return s;
  return s.slice(0, idx) + "<u>" + s.slice(idx, idx + phrase.length) + "</u>" + s.slice(idx + phrase.length);
}

function introText(sections) {
  const parts = sections
    .map((s) => `Section ${s.id} ${s.itemCount}문항(${s.answerModeTag.split("·")[0].trim()})`)
    .join(", ");
  return `이 연습은 ${parts}으로 되어 있어요. 회색 '예시' 문제는 책에 답이 나와 있는 예시라서 채점하지 않아요. 각 섹션 맨 위의 안내를 읽고 따라 하세요.`;
}

function writePractice(filename, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, filename);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", filename, data.items.length, "items");
}

function practice(pid, title, subtitle, pages, timerMinutes, sections, items, extra) {
  return {
    practiceId: PREFIX + pid,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    sectionsVersion: 2,
    introKo: introText(sections),
    sections,
    items,
    ...extra,
  };
}

const CHOOSE = "Choose · 고르기";
const WORDS = "Words · 빈칸 말만";
const WORDS_ONLY = "Words only · 빈칸 말만";
const SENT = "Sentence · 문장 전체";
const FULL = "Full sentence · 문장 전체";

// —— Lesson 01 Walk 1 (p. 116) ——
(function lesson01Walk1() {
  const instrA =
    "다음 대화에서 의문사를 찾아 동그라미 하세요. 동그라미 친 의문사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장에서 밑줄 친 의문사의 우리말 뜻을 찾아 선으로 연결하세요. 알맞은 뜻(a~b)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화에서 의문사를 찾아 동그라미 하세요.", "동그라미 친 의문사만 쓰세요.", "words", WORDS, 5, 1, labelsFrom(5, 2, "A")),
    sec("B", "Section B", instrB, "다음 문장에서 밑줄 친 의문사의 우리말 뜻을 찾아 선으로 연결하세요.", "알맞은 뜻을 하나 골라 누르세요.", "choice", CHOOSE, 5, 1, labelsFrom(5, 2, "B")),
  ];
  const meanChoices = ["a. 언제", "b. 어디에(서)"];
  const items = [
    ex(
      fill("a01", "A", "A1", instrA, WORDS, "어버이날은 언제니?", "A: When is Parents' Day?\nB: It's May the eighth.", ["When"], 1),
      "When"
    ),
    fill("a02", "A", "A2", instrA, WORDS, "상하이는 어디에 있니?", "A: Where is Shanghai?\nB: It's in China.", ["Where"], 1),
    fill("a03", "A", "A3", instrA, WORDS, "너는 언제 잠자리에 드니?", "A: When do you go to bed?\nB: I go to bed at ten o'clock.", ["When"], 1),
    fill("a04", "A", "A4", instrA, WORDS, "그녀는 어디에서 채소를 사니?", "A: Where does she buy vegetables?\nB: She buys them at the market.", ["Where"], 1),
    fill("a05", "A", "A5", instrA, WORDS, "너희는 언제 수학 수업을 하니?", "A: When do you have math class?\nB: We have math class on Thursday.", ["When"], 1),
    ex(
      mc("b01", "B", "B1", instrB, CHOOSE, "네 개는 어디에 있니?", u("Where is your dog?", "Where"), meanChoices, "b. 어디에(서)"),
      "b. 어디에(서)"
    ),
    mc("b02", "B", "B2", instrB, CHOOSE, "너는 언제 조깅을 하러 가니?", u("When do you go jogging?", "When"), meanChoices, "a. 언제"),
    mc("b03", "B", "B3", instrB, CHOOSE, "Brad는 어디에서 책을 읽니?", u("Where does Brad read books?", "Where"), meanChoices, "b. 어디에(서)"),
    mc("b04", "B", "B4", instrB, CHOOSE, "수업은 언제 시작하니?", u("When does the class begin?", "When"), meanChoices, "a. 언제"),
    mc("b05", "B", "B5", instrB, CHOOSE, "그들은 매년 어디에 가니?", u("Where do they go every year?", "Where"), meanChoices, "b. 어디에(서)"),
  ];
  writePractice(
    "lesson01-walk1.json",
    practice("lesson01-walk1", "Grammar Walk — Lesson 01", "의문사 when, where (p. 116)", "116", 10, sections, items)
  );
})();

// —— Lesson 01 Walk 2 (p. 118) ——
(function lesson01Walk2() {
  const instrA =
    "다음 대화에서 의문사를 찾아 동그라미 하세요. 동그라미 친 의문사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장에서 밑줄 친 의문사의 우리말 뜻을 찾아 선으로 연결하세요. 알맞은 뜻(a~b)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화에서 의문사를 찾아 동그라미 하세요.", "동그라미 친 의문사만 쓰세요.", "words", WORDS, 5, 1, labelsFrom(5, 2, "A")),
    sec("B", "Section B", instrB, "다음 문장에서 밑줄 친 의문사의 우리말 뜻을 찾아 선으로 연결하세요.", "알맞은 뜻을 하나 골라 누르세요.", "choice", CHOOSE, 5, 1, labelsFrom(5, 2, "B")),
  ];
  const meanChoices = ["a. 어떤/어떻게", "b. 왜"];
  const items = [
    ex(fill("a01", "A", "A1", instrA, WORDS, "기분이 어때?", "A: How are you?\nB: I'm fine.", ["How"], 1), "How"),
    fill("a02", "A", "A2", instrA, WORDS, "왜 Helen을 좋아하니?", "A: Why do you like Helen?\nB: Because she is kind.", ["Why"], 1),
    fill("a03", "A", "A3", instrA, WORDS, "공원에 어떻게 가니?", "A: How do you go to the park?\nB: I go to the park by subway.", ["How"], 1),
    fill("a04", "A", "A4", instrA, WORDS, "Anne는 왜 늦었니?", "A: Why is Anne late?\nB: Because she has a cold.", ["Why"], 1),
    fill("a05", "A", "A5", instrA, WORDS, "컴퓨터는 어때?", "A: How is the computer?\nB: It's very good.", ["How"], 1),
    ex(
      mc("b01", "B", "B1", instrB, CHOOSE, "새 학교는 어때?", u("How is your new school?", "How"), meanChoices, "a. 어떤/어떻게"),
      "a. 어떤/어떻게"
    ),
    mc("b02", "B", "B2", instrB, CHOOSE, "왜 피곤하니?", u("Why are you tired?", "Why"), meanChoices, "b. 왜"),
    mc("b03", "B", "B3", instrB, CHOOSE, "오늘 날씨는 어때?", u("How is the weather today?", "How"), meanChoices, "a. 어떤/어떻게"),
    mc("b04", "B", "B4", instrB, CHOOSE, "Steve는 왜 축구를 좋아하니?", u("Why does Steve like soccer?", "Why"), meanChoices, "b. 왜"),
    mc("b05", "B", "B5", instrB, CHOOSE, "동물원에 어떻게 가니?", u("How do you go to the zoo?", "How"), meanChoices, "a. 어떤/어떻게"),
  ];
  writePractice(
    "lesson01-walk2.json",
    practice("lesson01-walk2", "Grammar Walk — Lesson 01", "의문사 how, why (p. 118)", "118", 10, sections, items)
  );
})();

// —— Lesson 01 Run (pp. 119–120) ——
(function lesson01Run() {
  const instrA =
    "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 의문문에 대한 대답으로 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 12, 1, labelsFrom(12, 2, "A")),
    sec("B", "Section B", instrB, "다음 의문문에 대한 대답으로 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 12, 1, labelsFrom(12, 2, "B")),
  ];
  const aData = [
    ["When", "Where", "When", "A: ( When / Where ) do you go to school?\nB: I go to school at eight thirty.", "언제 학교에 가니?"],
    ["How", "Why", "How", "A: ( How / Why ) do you go home?\nB: I go home by bicycle.", "집에 어떻게 가니?"],
    ["How", "Where", "Where", "A: ( How / Where ) is David?\nB: He is in the classroom.", "David는 어디에 있니?"],
    ["When", "Why", "Why", "A: ( When / Why ) do you like winter?\nB: Because I can skate.", "왜 겨울을 좋아하니?"],
    ["When", "How", "When", "A: ( When / How ) is Christmas?\nB: It's on December the 25th.", "크리스마스는 언제니?"],
    ["Why", "Where", "Where", "A: ( Why / Where ) are they dancing?\nB: They are dancing behind the building.", "그들은 어디에서 춤을 추고 있니?"],
    ["Where", "How", "How", "A: ( Where / How ) do you go to the zoo?\nB: I go there by subway.", "동물원에 어떻게 가니?"],
    ["Why", "How", "Why", "A: ( Why / How ) are you crying?\nB: Because I miss my puppy.", "왜 울고 있니?"],
    ["Where", "When", "When", "A: ( Where / When ) does the movie begin?\nB: It begins at three p.m.", "영화는 언제 시작하니?"],
    ["Where", "How", "Where", "A: ( Where / How ) is my backpack?\nB: It's on the chair.", "내 배낭은 어디에 있니?"],
    ["Why", "How", "How", "A: ( Why / How ) is this sweater?\nB: It's pretty.", "이 스웨터는 어때?"],
    ["Where", "Why", "Why", "A: ( Where / Why ) do you hate beans?\nB: Because they aren't delicious.", "왜 콩을 싫어하니?"],
  ];
  const bData = [
    ["When do you visit your grandparents?", ["I visit them every Sunday.", "I visit them by bus."], "I visit them every Sunday.", "조부모를 언제 방문하니?"],
    ["Where is London?", ["It is in spring.", "It is in the U.K."], "It is in the U.K.", "런던은 어디에 있니?"],
    ["How does Merlin go to Busan?", ["He works there.", "He goes there by train."], "He goes there by train.", "Merlin은 부산에 어떻게 가니?"],
    ["Why does Max study in the library?", ["Because it's quiet.", "Yes, he does."], "Because it's quiet.", "Max는 왜 도서관에서 공부하니?"],
    ["When does the store close?", ["No, it doesn't.", "It closes at ten p.m."], "It closes at ten p.m.", "가게는 언제 닫니?"],
    ["Where do they play soccer?", ["It is exciting.", "They play soccer in the park."], "They play soccer in the park.", "그들은 어디에서 축구를 하니?"],
    ["How is their new song?", ["It's under the table.", "It's very good."], "It's very good.", "그들의 새 노래는 어때?"],
    ["Why is your dog barking?", ["Because he's hungry.", "He sleeps at night."], "Because he's hungry.", "네 개는 왜 짖고 있니?"],
    ["When does spring begin?", ["Because it's warm.", "It begins in March."], "It begins in March.", "봄은 언제 시작하니?"],
    ["Where do camels live?", ["They live in the desert.", "They are ten years old."], "They live in the desert.", "낙타는 어디에 살니?"],
    ["How does Wendy go to the hospital?", ["She goes there on Sunday.", "She goes there on foot."], "She goes there on foot.", "Wendy는 병원에 어떻게 가니?"],
    ["Why do you like Minsu?", ["Because he is nice.", "He is her brother."], "Because he is nice.", "왜 민수를 좋아하니?"],
  ];
  const items = [
    ex(
      mc("a01", "A", "A1", instrA, CHOOSE, aData[0][3], aData[0][2], [aData[0][0], aData[0][1]], aData[0][2]),
      aData[0][2]
    ),
  ];
  aData.slice(1).forEach((row, i) => {
    items.push(mc("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, CHOOSE, row[3], row[2], [row[0], row[1]], row[2]));
  });
  items.push(
    ex(
      mc("b01", "B", "B1", instrB, CHOOSE, bData[0][3], bData[0][0], bData[0][1], bData[0][2]),
      bData[0][2]
    )
  );
  bData.slice(1).forEach((row, i) => {
    items.push(mc("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, CHOOSE, row[3], row[0], row[1], row[2]));
  });
  writePractice(
    "lesson01-run.json",
    practice("lesson01-run", "Grammar Run", "의문사 when, where, how, why (pp. 119–120)", "119–120", 18, sections, items)
  );
})();

// —— Lesson 01 Jump (pp. 121–122) ——
(function lesson01Jump() {
  const instrA = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 의문사 한 단어만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 의문사 한 단어만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화의 빈칸에 알맞은 말을 쓰세요.", "의문사 한 단어만 쓰세요.", "words", WORDS_ONLY, 12, 1, labelsFrom(12, 2, "A")),
    sec("B", "Section B", instrB, "다음 대화의 빈칸에 알맞은 말을 쓰세요.", "의문사 한 단어만 쓰세요.", "words", WORDS_ONLY, 12, 1, labelsFrom(12, 2, "B")),
  ];
  const aAns = ["When", "Where", "How", "Why", "When", "Where", "How", "Why", "When", "How", "Where", "How"];
  const aPrompts = [
    ["A: _____ does your school begin?\nB: It begins in March.", "학교는 언제 시작하니?"],
    ["A: _____ does Billy live?\nB: He lives in New York.", "Billy는 어디에 살니?"],
    ["A: _____ is Peter's sister?\nB: She's lovely.", "Peter의 누나는 어때?"],
    ["A: _____ are you laughing?\nB: Because this movie is so funny.", "왜 웃고 있니?"],
    ["A: _____ is New Year's Day?\nB: It is on January the first.", "새해 첫날은 언제니?"],
    ["A: _____ is the Eiffel Tower?\nB: It's in Paris.", "에펠탑은 어디에 있니?"],
    ["A: _____ do you spell your name?\nB: S-A-L-L-Y.", "이름은 어떻게 철자를 쓰니?"],
    ["A: _____ is Jane busy?\nB: Because she has a lot of homework.", "Jane은 왜 바쁘니?"],
    ["A: _____ do they practice taekwondo?\nB: They practice it after school.", "그들은 언제 태권도를 연습하니?"],
    ["A: _____ do you go there?\nB: I go there by car.", "거기에 어떻게 가니?"],
    ["A: _____ does your cat sleep?\nB: She sleeps on the sofa.", "네 고양이는 어디에서 잠을 자니?"],
    ["A: _____ is your grandma's cake?\nB: It's really delicious!", "할머니 케이크는 어때?"],
  ];
  const bAns = ["Where", "How", "Where", "Why", "When", "How", "Why", "How", "Why", "How", "Where", "When"];
  const bPrompts = [
    ["A: _____ do you do your homework?\nB: I do my homework at home.", "어디에서 숙제를 하니?"],
    ["A: How _____ John come here?\nB: He comes here on foot.", "John은 어떻게 여기에 오니?"],
    ["A: Where _____ dolphins live?\nB: They live in the sea.", "돌고래는 어디에 살니?"],
    ["A: Why _____ you like summer?\nB: Because we have vacation in summer.", "왜 여름을 좋아하니?"],
    ["A: When _____ she play soccer?\nB: She plays soccer after school.", "그녀는 언제 축구를 하니?"],
    ["A: How _____ you say \"hello\" in Korean?\nB: We say \"안녕.\"", "한국어로 hello를 어떻게 말하니?"],
    ["A: Why _____ Sam eat carrots?\nB: Because he likes carrots.", "Sam은 왜 당근을 먹니?"],
    ["A: How _____ the grapes?\nB: They're a little sour.", "포도는 어때?"],
    ["A: Why _____ she always late?\nB: Because she goes to bed late.", "그녀는 왜 항상 늦니?"],
    ["A: How _____ your parents?\nB: They're fine.", "부모님은 어떠니?"],
    ["A: Where _____ the bank?\nB: It's next to the bakery.", "은행은 어디에 있니?"],
    ["A: When _____ Mom's birthday?\nB: It's next Saturday.", "엄마 생일은 언제니?"],
  ];
  const items = [ex(fill("a01", "A", "A1", instrA, WORDS_ONLY, aPrompts[0][1], aPrompts[0][0], [aAns[0]], 1), aAns[0])];
  aPrompts.slice(1).forEach((p, i) => items.push(fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, WORDS_ONLY, p[1], p[0], [aAns[i + 1]], 1)));
  items.push(ex(fill("b01", "B", "B1", instrB, WORDS_ONLY, "어디에서 숙제를 하니?", "A: Where do you do your homework?\nB: I do my homework at home.", ["Where"], 1), "Where"));
  bPrompts.slice(1).forEach((p, i) => items.push(fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, WORDS_ONLY, p[1], p[0], [bAns[i + 1]], 1)));
  writePractice(
    "lesson01-jump.json",
    practice("lesson01-jump", "Grammar Jump", "의문사 when, where, how, why (pp. 121–122)", "121–122", 25, sections, items)
  );
})();

// —— Lesson 01 Fly (pp. 123–124) ——
(function lesson01Fly() {
  const instrA =
    "다음 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "대답을 보고 다음 의문문을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", WORDS_ONLY, 15, 1, labelsFrom(15, 2, "A")),
    sec("B", "Section B", instrB, "대답을 보고 다음 의문문을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", WORDS_ONLY, 12, 1, labelsFrom(12, 2, "B")),
  ];
  const aData = [
    ["A: <u>When</u> are my socks? B: On the bed.", ["Where"], 1, "내 양말은 어디에 있니?"],
    ["A: <u>How</u> does the concert begin? B: It begins at nine.", ["When"], 1, "콘서트는 언제 시작하니?"],
    ["A: <u>Where</u> are Johnny? B: On the playground.", ["is"], 1, "Johnny는 어디에 있니?"],
    ["A: <u>Why</u> do they go to Japan? B: By ship.", ["How"], 1, "그들은 일본에 어떻게 가니?"],
    ["A: <u>Where</u> do you like apples? B: Because they're sweet.", ["Why"], 1, "왜 사과를 좋아하니?"],
    ["A: <u>When</u> do Tom take a shower? B: In the morning.", ["does"], 1, "Tom은 언제 샤워를 하니?"],
    ["A: <u>Where</u> are you staying in bed? B: Because I'm sick.", ["Why"], 1, "왜 침대에 누워 있니?"],
    ["A: <u>Why</u> do you watch TV? B: After dinner.", ["When"], 1, "언제 TV를 보니?"],
    ["A: <u>Where</u> is my sneakers? B: Next to the box.", ["are"], 1, "내 운동화는 어디에 있니?"],
    ["A: <u>When</u> do she bake cookies? B: On Sundays.", ["does"], 1, "그녀는 언제 쿠키를 굽니?"],
    ["A: <u>When</u> be Hangeul Day? B: It's October the 9th.", ["is"], 1, "한글날은 언제니?"],
    ["A: <u>Why</u> do you go swimming? B: Every morning.", ["When"], 1, "언제 수영을 가니?"],
    ["A: <u>How</u> does you spell his name? B: P-A-T-R-I-C-K.", ["do"], 1, "그의 이름은 어떻게 철자를 쓰니?"],
    ["A: <u>Where</u> he is now? B: In the garage.", ["is|he"], 2, "그는 지금 어디에 있니?"],
    ["A: <u>How</u> the weather is now? B: It's raining.", ["is|the weather"], 2, "지금 날씨는 어때?"],
  ];
  const bData = [
    ["A: _____ _____ you have lunch?\nB: We have lunch at noon.", ["When|do"], 2, "점심은 언제 먹니?"],
    ["A: How _____ you today?\nB: I'm fine.", ["are"], 1, "오늘 기분이 어때?"],
    ["A: Where _____ she live?\nB: She lives in Seoul.", ["does"], 1, "그녀는 어디에 살니?"],
    ["A: Why _____ you at home today?\nB: Because I have no school today.", ["are"], 1, "오늘 왜 집에 있니?"],
    ["A: When _____ the bakery open?\nB: It opens at seven in the morning.", ["does"], 1, "빵집은 언제 열니?"],
    ["A: How _____ he go to the museum?\nB: He goes by bus.", ["does"], 1, "그는 박물관에 어떻게 가니?"],
    ["A: Why _____ Paul often go to the zoo?\nB: Because he likes animals.", ["does"], 1, "Paul은 왜 자주 동물원에 가니?"],
    ["A: When _____ Sue's birthday?\nB: It's this Thursday.", ["is"], 1, "Sue의 생일은 언제니?"],
    ["A: How _____ this picture?\nB: It's beautiful.", ["is"], 1, "이 사진은 어때?"],
    ["A: When _____ they play soccer?\nB: They play soccer on Saturday.", ["do"], 1, "그들은 언제 축구를 하니?"],
    ["A: Where _____ Peter read books?\nB: He reads books in the evening.", ["does"], 1, "Peter는 어디에서 책을 읽니?"],
    ["A: Where _____ the bank?\nB: It's next to the supermarket.", ["is"], 1, "은행은 어디에 있니?"],
  ];
  const items = [
    ex(fill("a01", "A", "A1", instrA, WORDS_ONLY, aData[0][3], aData[0][0], aData[0][1], aData[0][2]), aData[0][1][0]),
  ];
  aData.slice(1).forEach((row, i) =>
    items.push(fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, WORDS_ONLY, row[3], row[0], row[1], row[2]))
  );
  items.push(ex(fill("b01", "B", "B1", instrB, WORDS_ONLY, bData[0][3], bData[0][0], bData[0][1], bData[0][2]), "When|do"));
  bData.slice(1).forEach((row, i) =>
    items.push(fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, WORDS_ONLY, row[3], row[0], row[1], row[2]))
  );
  writePractice(
    "lesson01-fly.json",
    practice("lesson01-fly", "Grammar Fly", "의문사 when, where, how, why (pp. 123–124)", "123–124", 28, sections, items)
  );
})();

// —— Lesson 02 Walk 1 (p. 126) ——
(function lesson02Walk1() {
  const instrA =
    "다음 대화에서 how many 또는 how much를 찾아 동그라미 하고, 그 뒤의 명사를 빈칸에 쓰세요. how many/much와 명사를 각각 한 칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 찾아 선으로 연결하세요. How many 또는 How much를 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화에서 how many 또는 how much를 찾아 동그라미 하세요.", "how many/much와 명사를 쓰세요.", "words", WORDS_ONLY, 5, 1, labelsFrom(5, 2, "A")),
    sec("B", "Section B", instrB, "다음 문장의 빈칸에 알맞은 말을 찾아 선으로 연결하세요.", "How many 또는 How much를 골라 누르세요.", "choice", CHOOSE, 5, 1, labelsFrom(5, 2, "B")),
  ];
  const hm = ["How many", "How much"];
  const items = [
    ex(
      fill(
        "a01",
        "A",
        "A1",
        instrA,
        WORDS_ONLY,
        "방에 고양이가 몇 마리 있니?",
        "A: How many cats are there in the room?\nB: There are three cats.",
        ["How many|cats"],
        2
      ),
      "How many|cats"
    ),
    fill("a02", "A", "A2", instrA, WORDS_ONLY, "차에 꿀을 얼마나 넣니?", "A: How much honey do you put in the tea?\nB: I put two spoonfuls of honey.", ["How much|honey"], 2),
    fill("a03", "A", "A3", instrA, WORDS_ONLY, "하루에 바나나를 몇 개 먹니?", "A: How many bananas do you eat a day?\nB: I eat two bananas a day.", ["How many|bananas"], 2),
    fill("a04", "A", "A4", instrA, WORDS_ONLY, "우유를 얼마나 원하니?", "A: How much milk do you want?\nB: I want a glass of milk.", ["How much|milk"], 2),
    fill("a05", "A", "A5", instrA, WORDS_ONLY, "우산을 몇 개 가지고 있니?", "A: How many umbrellas do you have?\nB: I have two.", ["How many|umbrellas"], 2),
    ex(
      mc("b01", "B", "B1", instrB, CHOOSE, "병에 우유가 얼마나 있니?", "_____ milk is in the bottle?", hm, "How much"),
      "How much"
    ),
    mc("b02", "B", "B2", instrB, CHOOSE, "방에 남자아이가 몇 명 있니?", "_____ boys are there in the room?", hm, "How many"),
    mc("b03", "B", "B3", instrB, CHOOSE, "한 달에 책을 몇 권 읽니?", "_____ books do you read a month?", hm, "How many"),
    mc("b04", "B", "B4", instrB, CHOOSE, "그들은 버터를 얼마나 먹니?", "_____ butter do they eat?", hm, "How much"),
    mc("b05", "B", "B5", instrB, CHOOSE, "모자를 몇 개 가지고 있니?", "_____ caps do you have?", hm, "How many"),
  ];
  writePractice(
    "lesson02-walk1.json",
    practice("lesson02-walk1", "Grammar Walk — Lesson 02", "how many / how much (p. 126)", "126", 10, sections, items)
  );
})();

// —— Lesson 02 Walk 2 (p. 128) ——
(function lesson02Walk2() {
  const instrA =
    "다음 대화에서 「how + 형용사/부사」를 찾아 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 찾아 선으로 연결하세요. 알맞은 뜻(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화에서 「how + 형용사/부사」를 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", WORDS, 5, 1, labelsFrom(5, 2, "A")),
    sec("B", "Section B", instrB, "다음 문장에서 밑줄 친 부분의 우리말 뜻을 찾아 선으로 연결하세요.", "알맞은 뜻을 하나 골라 누르세요.", "choice", CHOOSE, 5, 1, labelsFrom(5, 2, "B")),
  ];
  const meanChoices = ["a. 몇 살", "b. 얼마나 키가 큰", "c. 얼마나 자주", "d. 얼마나 먼", "e. 얼마나 길이가 긴"];
  const items = [
    ex(fill("a01", "A", "A1", instrA, WORDS, "아버지는 몇 살이니?", "A: How old is your father?\nB: He is forty-five.", ["How old"], 1), "How old"),
    fill("a02", "A", "A2", instrA, WORDS, "이모를 얼마나 자주 방문하니?", "A: How often do you visit your aunt?\nB: Once a month.", ["How often"], 1),
    fill("a03", "A", "A3", instrA, WORDS, "체육관은 얼마나 멀니?", "A: How far is the gym?\nB: It's 100 meters from here.", ["How far"], 1),
    fill("a04", "A", "A4", instrA, WORDS, "Tom은 키가 얼마나 크니?", "A: How tall is Tom?\nB: He is 165 centimeters tall.", ["How tall"], 1),
    fill("a05", "A", "A5", instrA, WORDS, "TV를 얼마나 오래 보니?", "A: How long do you watch TV?\nB: For one hour.", ["How long"], 1),
    ex(
      mc("b01", "B", "B1", instrB, CHOOSE, "민호는 키가 얼마나 크니?", u("How tall is Minho?", "How tall"), meanChoices, "b. 얼마나 키가 큰"),
      "b. 얼마나 키가 큰"
    ),
    mc("b02", "B", "B2", instrB, CHOOSE, "그녀는 시장에 얼마나 자주 가니?", u("How often does she go to the market?", "How often"), meanChoices, "c. 얼마나 자주"),
    mc("b03", "B", "B3", instrB, CHOOSE, "그 과학자는 몇 살이니?", u("How old is the scientist?", "How old"), meanChoices, "a. 몇 살"),
    mc("b04", "B", "B4", instrB, CHOOSE, "머리 길이는 얼마나 길니?", u("How long is your hair?", "How long"), meanChoices, "e. 얼마나 길이가 긴"),
    mc("b05", "B", "B5", instrB, CHOOSE, "학교는 여기서 얼마나 멀니?", u("How far is your school from here?", "How far"), meanChoices, "d. 얼마나 먼"),
  ];
  writePractice(
    "lesson02-walk2.json",
    practice("lesson02-walk2", "Grammar Walk — Lesson 02", "how + 형용사/부사 (p. 128)", "128", 10, sections, items)
  );
})();

// —— Lesson 02 Run (pp. 129–130) ——
(function lesson02Run() {
  const instrA =
    "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 의문문에 대한 대답으로 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 12, 1, labelsFrom(12, 2, "A")),
    sec("B", "Section B", instrB, "다음 의문문에 대한 대답으로 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 12, 1, labelsFrom(12, 2, "B")),
  ];
  const aData = [
    ["many", "much", "many", "A: How ( many / much ) tables are there in the restaurant?\nB: There are ten tables.", "식당에 테이블이 몇 개 있니?"],
    ["many", "much", "much", "A: How ( many / much ) water do you drink a day?\nB: One liter a day.", "하루에 물을 얼마나 마시니?"],
    ["old", "tall", "old", "A: How ( old / tall ) is Emily?\nB: She is eleven years old.", "Emily는 몇 살이니?"],
    ["long", "often", "long", "A: How ( long / often ) do you play badminton?\nB: I play badminton for one hour.", "배드민턴을 얼마나 오래 치니?"],
    ["often", "far", "far", "A: How ( often / far ) is Busan from here?\nB: It's 100 kilometers to Busan.", "부산은 여기서 얼마나 멀니?"],
    ["much", "many", "many", "A: How ( much / many ) meals do you have a day?\nB: I have three meals a day.", "하루에 식사를 몇 번 하니?"],
    ["many", "often", "often", "A: How ( many / often ) do you wash your hair?\nB: I wash my hair every day.", "머리를 얼마나 자주 감니?"],
    ["pens", "money", "pens", "A: How many ( pens / money ) do you have?\nB: I have five.", "펜을 몇 자루 가지고 있니?"],
    ["old", "tall", "tall", "A: How ( old / tall ) is the tower?\nB: It's 30 meters tall.", "탑은 높이가 얼마나 되니?"],
    ["tall", "far", "tall", "A: How ( tall / far ) is your brother?\nB: He is 120 centimeters tall.", "동생은 키가 얼마나 크니?"],
    ["old", "long", "long", "A: How ( old / long ) is the ruler?\nB: It's 30 centimeters long.", "자 길이는 얼마나 되니?"],
    ["clocks", "time", "time", "A: How much ( clocks / time ) do they need?\nB: They need two hours.", "그들은 시간이 얼마나 필요하니?"],
  ];
  const bData = [
    ["How many cows are there on the farm?", ["There are twelve cows.", "We have many cows."], "There are twelve cows.", "농장에 소가 몇 마리 있니?"],
    ["How much is the shirt?", ["I have two shirts.", "It is twenty dollars."], "It is twenty dollars.", "셔츠 가격이 얼마니?"],
    ["How old is your dog?", ["He's one meter long.", "He's eight years old."], "He's eight years old.", "네 개는 몇 살이니?"],
    ["How often does he wash his car?", ["He washes his car once a month.", "There are two cars."], "He washes his car once a month.", "그는 얼마나 자주 차를 씻니?"],
    ["How much butter do you need?", ["I like butter.", "I need fifty grams."], "I need fifty grams.", "버터가 얼마나 필요하니?"],
    ["How tall is your sister?", ["She's eighty centimeters tall.", "She's one year old."], "She's eighty centimeters tall.", "누나(여동생)는 키가 얼마나 크니?"],
    ["How many bags do you have?", ["It's thirty dollars.", "I have three."], "I have three.", "가방을 몇 개 가지고 있니?"],
    ["How far is the police station from here?", ["It's five hundred meters from here.", "They have two."], "It's five hundred meters from here.", "경찰서는 여기서 얼마나 멀니?"],
    ["How long is the bridge?", ["It's in Seoul.", "It's two hundred meters long."], "It's two hundred meters long.", "다리 길이는 얼마나 되니?"],
    ["How often do they practice taekwondo?", ["They practice it twice a week.", "They practice it very hard."], "They practice it twice a week.", "그들은 얼마나 자주 태권도를 연습하니?"],
    ["How long do you study math a day?", ["I study math in the evening.", "I study math for two hours a day."], "I study math for two hours a day.", "하루에 수학을 얼마나 오래 공부하니?"],
    ["How far is the park from here?", ["It's four kilometers from here.", "It is next to the school."], "It's four kilometers from here.", "공원은 여기서 얼마나 멀니?"],
  ];
  const items = [
    ex(mc("a01", "A", "A1", instrA, CHOOSE, aData[0][4], aData[0][3], [aData[0][0], aData[0][1]], aData[0][2]), aData[0][2]),
  ];
  aData.slice(1).forEach((row, i) => items.push(mc("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, CHOOSE, row[4], row[3], [row[0], row[1]], row[2])));
  items.push(ex(mc("b01", "B", "B1", instrB, CHOOSE, bData[0][3], bData[0][0], bData[0][1], bData[0][2]), bData[0][2]));
  bData.slice(1).forEach((row, i) => items.push(mc("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, CHOOSE, row[3], row[0], row[1], row[2])));
  writePractice(
    "lesson02-run.json",
    practice("lesson02-run", "Grammar Run", "how many/much, how + 형용사/부사 (pp. 129–130)", "129–130", 20, sections, items)
  );
})();

// —— Lesson 02 Jump (pp. 131–132) ——
(function lesson02Jump() {
  const instrA = "다음 대화가 무엇에 관한 것인지 찾아 빈칸에 쓰세요. (개수, 양, 길이, 키, 나이, 거리, 기간, 횟수, 가격)";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. how many/much 또는 how + 형용사/부사 한 단어(구)만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화가 무엇에 관한 것인지 찾아 빈칸에 쓰세요.", "한국어 보기에서 골라 쓰세요.", "words", WORDS, 13, 1, labelsFrom(13, 2, "A")),
    sec("B", "Section B", instrB, "다음 대화의 빈칸에 알맞은 말을 쓰세요.", "how 구문만 쓰세요.", "words", WORDS_ONLY, 15, 1, labelsFrom(15, 2, "B")),
  ];
  const catAns = ["가격", "개수", "나이", "키", "횟수", "기간", "거리", "기간", "길이", "양", "횟수", "개수", "나이"];
  const catPrompts = [
    ["A: How much is this notebook? B: It's one thousand won.", "이 공책 가격은 얼마니?"],
    ["A: How many sisters do you have? B: I have two.", "여동생이 몇 명이니?"],
    ["A: How old is your mom? B: She's forty years old.", "엄마는 몇 살이니?"],
    ["A: How tall is the soccer player? B: He's 180 centimeters tall.", "축구 선수는 키가 얼마나 크니?"],
    ["A: How often do you go hiking? B: We go hiking twice a month.", "얼마나 자주 등산을 가니?"],
    ["A: How long do you exercise a day? B: I exercise for one hour a day.", "하루에 운동을 얼마나 하니?"],
    ["A: How far is the train station? B: It's four hundred meters from here.", "기차역은 얼마나 멀니?"],
    ["A: How long do you take a shower? B: I take a shower for thirty minutes.", "샤워를 얼마나 오래 하니?"],
    ["A: How long is the river? B: It's one hundred kilometers long.", "강 길이는 얼마나 되니?"],
    ["A: How much coffee does he sell? B: He sells two hundred cups of coffee a day.", "그는 커피를 얼마나 팔니?"],
    ["A: How often do they go on a picnic? B: They go on a picnic once a month.", "얼마나 자주 소풍을 가니?"],
    ["A: How many carrots are there on the table? B: There are five carrots.", "테이블에 당근이 몇 개 있니?"],
    ["A: How old is her cat? B: It's two years old.", "그녀의 고양이는 몇 살이니?"],
  ];
  const bAns = ["many", "much", "old", "tall", "often", "much", "far", "long", "much", "many", "long", "often", "much", "old", "tall"];
  const bPrompts = [
    ["A: How _____ books are there on the desk?\nB: There are three.", "책상 위에 책이 몇 권 있니?"],
    ["A: How _____ is this hot dog?\nB: It's two dollars.", "이 핫도그 가격은 얼마니?"],
    ["A: How _____ is that pianist?\nB: She's thirty years old.", "그 피아니스트는 몇 살이니?"],
    ["A: How _____ is James?\nB: He's 150 centimeters tall.", "James는 키가 얼마나 크니?"],
    ["A: How _____ do they brush their teeth?\nB: Three times a day.", "그들은 얼마나 자주 이를 닦니?"],
    ["A: How _____ coffee does she drink?\nB: She drinks two cups of coffee a day.", "그녀는 커피를 얼마나 마시니?"],
    ["A: How _____ is the bus stop from here?\nB: It's one hundred meters from here.", "버스 정류장은 얼마나 멀니?"],
    ["A: How _____ is the belt?\nB: It's one meter long.", "벨트 길이는 얼마나 되니?"],
    ["A: How _____ bread do you have?\nB: I have six loaves of bread.", "빵을 얼마나 가지고 있니?"],
    ["A: How _____ dolls does she have?\nB: She has five dolls.", "인형을 몇 개 가지고 있니?"],
    ["A: How _____ do you play computer games?\nB: For one hour a day.", "컴퓨터 게임을 얼마나 오래 하니?"],
    ["A: How _____ does Ann go to the library?\nB: She goes there three times a week.", "Ann은 얼마나 자주 도서관에 가니?"],
    ["A: How _____ are these shoes?\nB: They are twenty dollars.", "이 신발 가격은 얼마니?"],
    ["A: How _____ is Yuna?\nB: She is twenty years old.", "유나는 몇 살이니?"],
    ["A: How _____ is the tree?\nB: It's four meters tall.", "나무는 높이가 얼마나 되니?"],
  ];
  const items = [ex(fill("a01", "A", "A1", instrA, WORDS, catPrompts[0][1], catPrompts[0][0], [catAns[0]], 1), catAns[0])];
  catPrompts.slice(1).forEach((p, i) => items.push(fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, WORDS, p[1], p[0], [catAns[i + 1]], 1)));
  items.push(ex(fill("b01", "B", "B1", instrB, WORDS_ONLY, bPrompts[0][1], bPrompts[0][0], ["many"], 1), "many"));
  bPrompts.slice(1).forEach((p, i) => items.push(fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, WORDS_ONLY, p[1], p[0], [bAns[i + 1]], 1)));
  writePractice(
    "lesson02-jump.json",
    practice("lesson02-jump", "Grammar Jump", "how many/much & how + 형용사/부사 (pp. 131–132)", "131–132", 25, sections, items)
  );
})();

// —— Lesson 02 Fly (pp. 133–134) ——
(function lesson02Fly() {
  const instrA =
    "다음 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸 두 개에 how many 또는 how much, 또는 how + 형용사/부사를 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. how 구문만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sections = [
    sec("A", "Section A", instrA, "다음 대화의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸 두 칸에 말을 쓰세요.", "words", WORDS_ONLY, 11, 1, labelsFrom(11, 2, "A")),
    sec("B", "Section B", instrB, "다음 대화의 빈칸에 알맞은 말을 쓰세요.", "how 구문만 쓰세요.", "words", WORDS_ONLY, 11, 1, labelsFrom(11, 2, "B")),
  ];
  const aData = [
    ["A: <u>How many</u> is that red hat? B: It's ten thousand won.", ["How", "much"], "저 빨간 모자 가격은 얼마니?"],
    ["A: <u>How much</u> giraffes are there in the zoo? B: There are two.", ["How", "many"], "동물원에 기린이 몇 마리 있니?"],
    ["A: <u>How old</u> is the building? B: It's 20 meters tall.", ["How", "tall"], "그 건물은 높이가 얼마나 되니?"],
    ["A: <u>How long</u> do you go to the pool? B: I go to the pool once a week.", ["How", "often"], "수영장에 얼마나 자주 가니?"],
    ["A: <u>How old</u> are you? B: I'm one hundred sixty centimeters tall.", ["How", "tall"], "키가 얼마나 크니?"],
    ["A: <u>How far</u> is the baby? B: She's six months old.", ["How", "old"], "아기는 몇 살이니?"],
    ["A: <u>How long</u> is the park from here? B: It's 400 meters to the park.", ["How", "far"], "공원은 여기서 얼마나 멀니?"],
    ["A: <u>How much</u> brothers do you have? B: I have one.", ["How", "many"], "형제가 몇 명이니?"],
    ["A: <u>How many</u> flour do you need? B: I need a kilo of flour.", ["How", "much"], "밀가루가 얼마나 필요하니?"],
    ["A: <u>How often</u> do they take a walk? B: They take a walk for one hour.", ["How", "long"], "그들은 산책을 얼마나 오래 하니?"],
    ["A: <u>How long</u> is City Hall? B: It's two kilometers from here.", ["How", "far"], "시청은 여기서 얼마나 멀니?"],
    ["A: <u>How many</u> tea do you drink? B: I drink three cups of tea a day.", ["How", "much"], "차를 얼마나 마시니?"],
  ];
  const bData = [
    ["How long", "리본 길이는 얼마나 되니?", "A: How _____ is the ribbon?\nB: It's one meter long."],
    ["How tall", "N서울타워는 높이가 얼마나 되니?", "A: How _____ is N Seoul Tower?\nB: It's 360 meters tall."],
    ["How often", "자전거를 얼마나 자주 타니?", "A: How _____ do you ride a bicycle?\nB: I ride it every day."],
    ["How much", "치즈를 얼마나 사니?", "A: How _____ cheese do you buy?\nB: I buy two loaves every day."],
    ["How often", "Tom은 얼마나 자주 고양이에게 먹이를 주니?", "A: How _____ does Tom feed his cat?\nB: He feeds her twice a day."],
    ["How old", "영어 선생님은 몇 살이니?", "A: How _____ is your English teacher?\nB: She's forty years old."],
    ["How much", "차에 설탕을 얼마나 넣니?", "A: How _____ sugar do you put in the tea?\nB: I put a spoonful of sugar."],
    ["How long", "Amy는 축구를 얼마나 오래 하니?", "A: How _____ does Amy play soccer?\nB: For two hours."],
    ["How many", "샌드위치를 하루에 몇 개 만들니?", "A: How _____ sandwiches do you make?\nB: I make one hundred a day."],
    ["How far", "가게는 여기서 얼마나 멀니?", "A: How _____ is the store from here?\nB: It's a kilometer from here."],
    ["How many", "연못에 오리가 몇 마리 있니?", "A: How _____ ducks are there in the pond?\nB: There are eleven."],
  ];
  const items = [ex(fill("a01", "A", "A1", instrA, WORDS_ONLY, aData[0][2], aData[0][0], ["How|much"], 2), "How|much")];
  aData.slice(1).forEach((row, i) => items.push(fill("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), instrA, WORDS_ONLY, row[2], row[0], [row[1].join("|")], 2)));
  items.push(ex(fill("b01", "B", "B1", instrB, WORDS_ONLY, "그 가수는 몇 살이니?", "A: How old is the singer?\nB: He's thirty-two years old.", ["How old"], 1), "How old"));
  bData.forEach((row, i) =>
    items.push(fill("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), instrB, WORDS_ONLY, row[1], row[2], [row[0]], 1))
  );
  writePractice(
    "lesson02-fly.json",
    practice("lesson02-fly", "Grammar Fly", "how many/much & how + 형용사/부사 (pp. 133–134)", "133–134", 28, sections, items)
  );
})();

// —— Review 05 (pp. 135–137) ——
(function review05() {
  const introKo =
    "Review 05는 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요. 각 섹션 안내에 따라 고르기·빈칸·문장 전체를 구분하세요.";
  const sections = [
    sec("1-2", "[1–2]", "[1–2] 다음 중 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.", "빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 2, 0, ["1", "2"]),
    sec("3", "[3]", "[3] 다음 중 빈칸에 공통으로 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.", "공통으로 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 1, 0, ["3"]),
    sec("4-5", "[4–5]", "[4–5] 다음 중 알맞은 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.", "알맞은 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 2, 0, ["4", "5"]),
    sec("6", "[6]", "[6] 다음 대화의 빈칸에 알맞은 말이 순서대로 바르게 짝지어진 것을 고르세요.", "짝지어진 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 1, 0, ["6"]),
    sec("7-10", "[7–10]", "[7–10] 다음 중 밑줄 친 부분 중 잘못된 것을 고르거나, 짝지어진 대화가 어색한 것을 고르세요.", "잘못된 것 또는 어색한 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 4, 0, ["7", "8", "9", "10"]),
    sec("11-12", "[11–12]", "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", CHOOSE, 2, 0, ["11", "12"]),
    sec("13-14", "[13–14]", "[13–14] 다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.", "빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", WORDS, 2, 0, ["13", "14"]),
    sec("15-16", "[15–16]", "[15–16] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸 두 칸에 how 구문을 쓰세요.", "우리말 뜻과 같도록 빈칸을 채우세요.", "빈칸 두 칸에 쓰세요.", "words", WORDS_ONLY, 2, 0, ["15", "16"]),
    sec("17-18", "[17–18]", "[17–18] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요.", "밑줄 친 부분을 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", SENT, 2, 0, ["17", "18"]),
    sec("19-20", "[19–20]", "[19–20] 주어진 말을 바르게 배열하여 문장을 쓰세요. 문장 전체를 쓰세요.", "주어진 말을 배열하여 문장을 쓰세요.", "문장 전체를 쓰세요.", "sentence", FULL, 2, 0, ["19", "20"]),
  ];
  const c = (id, secId, label, instr, en, choices, accept, ko) =>
    mc(id, secId, label, instr, CHOOSE, ko || "", en, choices, accept);
  const items = [
    c("q01", "1-2", "1", sections[0].instructionKo, "A: _____ does Paul get up?\nB: He gets up at seven o'clock.", ["How", "When", "Why", "Where"], ["When", "2"], "Paul은 몇 시에 일어나니?"),
    c("q02", "1-2", "2", sections[0].instructionKo, "A: _____ is she late?\nB: Because she gets up late.", ["What", "How", "When", "Why"], ["Why", "4"], "그녀는 왜 늦었니?"),
    c("q03", "3", "3", sections[1].instructionKo, "• _____ far is the library from here?\n• _____ old is Paula?", ["What", "When", "How", "Why"], ["How", "3"], "빈칸에 공통으로 들어갈 말을 고르세요."),
    c("q04", "4-5", "4", sections[2].instructionKo, "", ["Where is your bag?", "How is this book?", "When is your birthday?", "Why Tom is at home?"], ["Why Tom is at home?", "4"], "알맞은 문장을 고르세요."),
    c(
      "q05",
      "4-5",
      "5",
      sections[2].instructionKo,
      "",
      [
        "How often do you play soccer?",
        "How long do Emily read a book a day?",
        "How many dogs do they have?",
        "How much time do you need?",
      ],
      ["How long do Emily read a book a day?", "2"],
      "알맞은 문장을 고르세요."
    ),
    c(
      "q06",
      "6",
      "6",
      sections[3].instructionKo,
      "• A: How many _____ do you have? B: I have one.\n• A: How much _____ does she drink? B: She drinks a bottle of milk.",
      ["sister - milk", "milk - sister", "sisters - milk", "milk - sisters"],
      ["sisters - milk", "3"],
      "빈칸에 알맞은 말 짝을 고르세요."
    ),
    c(
      "q07",
      "7-10",
      "7",
      sections[4].instructionKo,
      "A: When does Sue <u>has</u> dinner?\nB: She has dinner at six p.m.",
      ["When", "does", "Sue", "has", "dinner"],
      ["has", "4"],
      "밑줄 친 부분 중 잘못된 것을 고르세요."
    ),
    c(
      "q08",
      "7-10",
      "8",
      sections[4].instructionKo,
      "",
      [
        "A: How long is the bridge? B: It's 50 meters long.",
        "A: How tall is Roy? B: He's twenty years old.",
        "A: How old are you? B: I'm ten years old.",
        "A: How far is the station? B: It's 500 meters from here.",
      ],
      ["A: How tall is Roy? B: He's twenty years old.", "2"],
      "어색한 대화를 고르세요."
    ),
    c(
      "q09",
      "7-10",
      "9",
      sections[4].instructionKo,
      "Because it snows in winter.",
      ["What do you like?", "How do you play in winter?", "When does it snow?", "Why do you like winter?"],
      ["Why do you like winter?", "4"],
      "대답에 알맞은 의문문을 고르세요."
    ),
    c(
      "q10",
      "7-10",
      "10",
      sections[4].instructionKo,
      "It's 100 meters tall.",
      ["How old is the building?", "How far is the building?", "How tall is the building?", "How much is the building?"],
      ["How tall is the building?", "3"],
      "대답에 알맞은 의문문을 고르세요."
    ),
    c(
      "q11",
      "11-12",
      "11",
      sections[5].instructionKo,
      "그들은 얼마나 오래 TV를 보니?\nHow ( often / long ) do they watch TV?",
      ["often", "long"],
      ["long", "2"],
      "그들은 얼마나 오래 TV를 보니?"
    ),
    c(
      "q12",
      "11-12",
      "12",
      sections[5].instructionKo,
      "너는 하루에 물을 얼마나 많이 마시니?\nHow ( much / many ) water do you drink a day?",
      ["much", "many"],
      ["much", "1"],
      "너는 하루에 물을 얼마나 많이 마시니?"
    ),
    fill("q13", "13-14", "13", sections[6].instructionKo, WORDS, "너는 언제 등산을 가니?", "A: _____ do you go hiking?\nB: I go hiking on Saturday.", ["When"], 1),
    fill("q14", "13-14", "14", sections[6].instructionKo, WORDS, "서울 날씨는 어때?", "A: _____ is the weather in Seoul?\nB: It's cloudy.", ["How"], 1),
    fill("q15", "15-16", "15", sections[7].instructionKo, WORDS_ONLY, "민호는 얼마나 자주 수영을 하러 가니?", "How _____ does Minho go swimming?", ["How|often"], 2),
    fill("q16", "15-16", "16", sections[7].instructionKo, WORDS_ONLY, "그 농구 선수는 키가 얼마나 크니?", "How _____ is the basketball player?", ["How|tall"], 2),
    sentence(
      "q17",
      "17-18",
      "17",
      sections[8].instructionKo,
      SENT,
      "David는 야구를 얼마나 오래 하니?",
      "<u>How long do David play baseball?</u>",
      ["How long does David play baseball?"]
    ),
    sentence(
      "q18",
      "17-18",
      "18",
      sections[8].instructionKo,
      SENT,
      "David는 펜을 몇 자루 가지고 있니?",
      "<u>How many pen does David have?</u>",
      ["How many pens does David have?"]
    ),
    sentence(
      "q19",
      "19-20",
      "19",
      sections[9].instructionKo,
      FULL,
      "네 컴퓨터는 어디에 있니?",
      "is / where / computer / your / ?",
      ["Where is your computer?"]
    ),
    sentence(
      "q20",
      "19-20",
      "20",
      sections[9].instructionKo,
      FULL,
      "네 여동생(누나)은 몇 살이니?",
      "sister / is / how old / your / ?",
      ["How old is your sister?"]
    ),
  ];
  writePractice(
    "review-05.json",
    {
      practiceId: PREFIX + "review-05",
      title: "Review 05",
      subtitle: "Unit 05 의문사 (2) (pp. 135–137)",
      pages: "135–137",
      timerMinutes: 30,
      ...META,
      sectionsVersion: 2,
      introKo,
      sections,
      items,
    }
  );
})();

console.log("Done — data/blue3/unit05/");
