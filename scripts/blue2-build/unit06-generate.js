/* Generate data/blue2/unit06/*.json — run: node scripts/blue2-build/unit06-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue2/unit06");
const META = {
  bookId: "zap-blue-2",
  bookTitle: "ZAP Blue 2",
  appName: "BlueZap 2",
  unitId: "unit-06",
  unitTitle: "Unit 06 — 부사",
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
  if (opts.unordered) item.unordered = opts.unordered;
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
  return Object.assign(item, opts.extra || {});
}

function underlineInSentence(sentence, phrase) {
  if (!phrase) return sentence;
  const low = sentence.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return sentence;
  return sentence.slice(0, idx) + "<u>" + sentence.slice(idx, idx + phrase.length) + "</u>" + sentence.slice(idx + phrase.length);
}

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

function writePractice(filename, slug, title, subtitle, pages, timerMinutes, introKo, sections, items, extra) {
  write(filename, {
    practiceId: "b2:u06:" + slug,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    sectionsVersion: 2,
    introKo,
    sections,
    items,
    ...(extra || {}),
  });
}

function en(w) {
  return [w, w.charAt(0).toUpperCase() + w.slice(1)];
}

function mcAcc(choices, idx) {
  return [choices[idx], String(idx + 1)];
}

function koGloss(ko) {
  return [...new Set([ko, ko.replace(/ /g, ""), ko.replace(/~/g, " ~ ")])];
}

function sentAcc(s) {
  const out = [];
  const add = (x) => {
    x = x.trim();
    if (x && !out.includes(x)) out.push(x);
  };
  add(s);
  if (!/\.$/.test(s)) add(s + ".");
  return out;
}

function swapAcc(pair, full) {
  const [a, b] = pair.split("|");
  return [pair, b + "|" + a, ...sentAcc(full)];
}

function addSectionItems(items, section, instr, rows, idPrefix, labelPrefix, build) {
  rows.forEach((r, i) => {
    const label = labelPrefix + (i + 1);
    const id = idPrefix + String(i + 1).padStart(2, "0");
    const base = build(r, label, id, instr);
    items.push(r.example ? exItem(base, r.exampleAnswer) : base);
  });
}

// —— Lesson 01 Walk 1 (p. 142) ——
(function lesson01Walk1() {
  const instr =
    "다음 문장에서 부사를 찾아 동그라미 하세요. 동그라미 친 부사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const rows = [
    { en: "That woman is very kind.", ans: "very", ko: "그 여자는 매우 친절하다.", ex: true },
    { en: "I am so hungry.", ans: "so", ko: "나는 무척 배가 고프다." },
    { en: "Cheetahs run fast.", ans: "fast", ko: "치타는 빨리 달린다." },
    { en: "This bag is pretty big.", ans: "pretty", ko: "이 가방은 꽤 크다." },
    { en: "Tony goes to school early.", ans: "early", ko: "토니는 일찍 학교에 간다." },
    { en: "They come late.", ans: "late", ko: "그들은 늦게 온다." },
    { en: "The man speaks Korean well.", ans: "well", ko: "그 남자는 한국어를 잘 말한다." },
    { en: "This movie is really interesting.", ans: "really", ko: "이 영화는 정말 재미있다." },
    { en: "The room is too dirty.", ans: "too", ko: "그 방은 너무 더럽다." },
    { en: "The students study hard.", ans: "hard", ko: "학생들은 열심히 공부한다." },
    { en: "The trees are tall enough.", ans: "enough", ko: "나무들은 충분히 키가 크다." },
    { en: "She swims fast.", ans: "fast", ko: "그녀는 빨리 수영한다." },
  ];
  const items = rows.map((r, i) => {
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "A", label, r.en, en(r.ans), { sectionInstructionKo: instr, promptKo: r.ko });
    return r.ex ? exItem(base, r.ans) : base;
  });
  writePractice(
    "lesson01-walk1.json",
    "lesson01-walk1",
    "Lesson 01 Walk 1 — 부사",
    "부사 찾기 (p. 142)",
    "142",
    10,
    "Section A 11문항(동그라미 친 부사). A1 예시는 채점하지 않아요.",
    [sec("A", "Section A", instr, "다음 문장에서 부사를 찾아 동그라미 하세요.", "동그라미 친 부사만 쓰세요.", "words", "Words · 빈칸 말만", 11, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12"])],
    items
  );
})();

// —— Lesson 01 Walk 2 (p. 144) ——
(function lesson01Walk2() {
  const instrA =
    "다음 형용사에 알맞은 부사를 찾아 선으로 연결하세요. 알맞은 부사(a~e)를 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 형용사에 알맞은 부사를 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const choices = ["a. easily", "b. early", "c. fast", "d. quietly", "e. happily"];
  const match = [
    { adj: "1. fast", ans: 2, ko: "빠른 → 빨리" },
    { adj: "2. quiet", ans: 3, ko: "조용한 → 조용히" },
    { adj: "3. easy", ans: 0, ko: "쉬운 → 쉽게" },
    { adj: "4. happy", ans: 4, ko: "행복한 → 행복하게" },
    { adj: "5. early", ans: 1, ko: "이른 → 일찍" },
  ];
  const items = match.map((m, i) =>
    mcItem("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), m.adj, choices, mcAcc(choices, m.ans), {
      sectionInstructionKo: instrA,
      promptKo: m.ko,
    })
  );
  const fillRows = [
    { adj: "1. kind", ans: "kindly", ex: true },
    { adj: "2. careful", ans: "carefully", ko: "조심하는 → 조심스럽게" },
    { adj: "3. busy", ans: "busily", ko: "바쁜 → 바쁘게" },
    { adj: "4. high", ans: "high", ko: "높은 → 높이" },
    { adj: "5. late", ans: "late", ko: "늦은 → 늦게" },
    { adj: "6. quick", ans: "quickly", ko: "빠른 → 빨리" },
    { adj: "7. lucky", ans: "luckily", ko: "운 좋은 → 운 좋게" },
    { adj: "8. bad", ans: "badly", ko: "나쁜 → 나쁘게" },
    { adj: "9. good", ans: "well", ko: "좋은 → 잘" },
    { adj: "10. slow", ans: "slowly", ko: "느린 → 천천히" },
  ];
  fillRows.forEach((r, i) => {
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "B", label, r.adj, en(r.ans), { sectionInstructionKo: instrB, promptKo: r.ko || "친절한 → 친절하게" });
    items.push(r.ex ? exItem(base, r.ans) : base);
  });
  writePractice(
    "lesson01-walk2.json",
    "lesson01-walk2",
    "Lesson 01 Walk 2 — 부사",
    "형용사와 부사 (p. 144)",
    "144",
    10,
    "Section A 5문항(연결·고르기), Section B 9문항(부사 쓰기). B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 형용사에 알맞은 부사를 찾아 선으로 연결하세요.", "알맞은 부사(a~e)를 하나 골라 누르세요.", "choice", "Choose · 고르기", 5, 0, ["A1", "A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 형용사에 알맞은 부사를 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]),
    ],
    items
  );
})();


// —— Lesson 01 Run (pp. 145–146) ——
(function lesson01Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aRows = [
    { p: "The cat runs ( fast / early ).", c: ["fast", "early"], i: 0, ko: "그 고양이는 빨리 달린다.", ex: true },
    { p: "The room is ( high / very ) large.", c: ["high", "very"], i: 1, ko: "그 방은 매우 크다." },
    { p: "The clerk answers ( well / kindly ).", c: ["well", "kindly"], i: 1, ko: "그 점원은 친절하게 대답한다." },
    { p: "Mandy studies Korean ( really / too ) hard.", c: ["really", "too"], i: 0, ko: "맨디는 한국어를 정말 열심히 공부한다." },
    { p: "They sing ( beautifully / happily ).", c: ["beautifully", "happily"], i: 0, ko: "그들은 아름답게 노래한다." },
    { p: "A balloon falls ( slowly / quickly ).", c: ["slowly", "quickly"], i: 0, ko: "풍선은 천천히 떨어진다." },
    { p: "My father comes home ( early / high ).", c: ["early", "high"], i: 0, ko: "우리 아버지는 집에 일찍 오신다." },
    { p: "She solves math problems ( luckily / easily ).", c: ["luckily", "easily"], i: 1, ko: "그녀는 수학 문제들을 쉽게 푼다." },
    { p: "Minho dances ( pretty / hard ) well.", c: ["pretty", "hard"], i: 0, ko: "민호는 춤을 꽤 잘 춘다." },
    { p: "I take a shower ( quickly / busily ).", c: ["quickly", "busily"], i: 0, ko: "나는 샤워를 빨리 한다." },
    { p: "Dad drives a car ( careful / carefully ).", c: ["careful", "carefully"], i: 1, ko: "아빠는 차를 조심스럽게 운전하신다." },
    { p: "This coat is ( too / enough ) expensive.", c: ["too", "enough"], i: 0, ko: "이 외투는 너무 비싸다." },
    { p: "The cooks work ( busily / fast ).", c: ["busily", "fast"], i: 0, ko: "그 요리사들은 바쁘게 일한다." },
    { p: "This question is ( really / carefully ) difficult.", c: ["really", "carefully"], i: 0, ko: "이 문제는 정말 어렵다." },
    { p: "The basketball player jumps ( early / high ).", c: ["early", "high"], i: 1, ko: "그 농구 선수는 높이 점프한다." },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    const base = mcItem(id, "A", label, r.p, r.c, mcAcc(r.c, r.i), { sectionInstructionKo: instrA, promptKo: r.ko });
    return r.ex ? exItem(base, r.c[r.i]) : base;
  });
  const bRows = [
    { p: "Danny swims ____.", c: ["① fast", "② fastly"], i: 0, ko: "대니는 빨리 수영한다.", ex: true },
    { p: "The men speak ____.", c: ["① loud", "② loudly"], i: 1, ko: "그 남자들은 큰 소리로 말한다." },
    { p: "Mina studies English ____.", c: ["① hard", "② hardly"], i: 0, ko: "미나는 영어를 열심히 공부한다." },
    { p: "The old woman walks ____.", c: ["① slow", "② slowly"], i: 1, ko: "그 할머니는 천천히 걸으신다." },
    { p: "My mother fixes the window ____.", c: ["① easy", "② easily"], i: 1, ko: "우리 어머니는 창문을 쉽게 고치신다." },
    { p: "They live ____ in their hometown.", c: ["① happy", "② happily"], i: 1, ko: "그들은 고향에서 행복하게 산다." },
    { p: "An eagle flies ____.", c: ["① high", "② highly"], i: 0, ko: "독수리는 높이 난다." },
    { p: "She talks ____ in the library.", c: ["① quiet", "② quietly"], i: 1, ko: "그녀는 도서관에서 조용히 말한다." },
    { p: "His sister cooks ____.", c: ["① good", "② well"], i: 1, ko: "그의 여동생은 요리를 잘한다." },
    { p: "Harry Potter is ____ interesting.", c: ["① very", "② verily"], i: 0, ko: "해리 포터는 매우 재미있다." },
    { p: "He plays the piano ____.", c: ["① bad", "② badly"], i: 1, ko: "그는 피아노를 서투르게 친다." },
    { p: "They listen to their teacher ____.", c: ["① careful", "② carefully"], i: 1, ko: "그들은 선생님 말씀을 주의 깊게 듣는다." },
    { p: "The boy runs ____ fast.", c: ["① real", "② really"], i: 1, ko: "그 남자아이는 정말 빨리 달린다." },
    { p: "The singer sings ____.", c: ["① softly", "② soft"], i: 0, ko: "그 가수는 부드럽게 노래한다." },
    { p: "The baby cries ____.", c: ["① sad", "② sadly"], i: 1, ko: "아기는 슬프게 운다." },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    const base = mcItem(id, "B", label, r.p, r.c, mcAcc(r.c, r.i), { sectionInstructionKo: instrB, promptKo: r.ko });
    items.push(r.ex ? exItem(base, r.c[r.i].replace(/^①\s*/, "")) : base);
  });
  writePractice(
    "lesson01-run.json",
    "lesson01-run",
    "Lesson 01 Run — 부사",
    "Grammar Run (pp. 145–146)",
    "145–146",
    20,
    "Section A·B 각 14문항(고르기). A1·B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();


// —— Lesson 01 Jump (pp. 147–148) ——
(function lesson01Jump() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 밑줄 친 부분의 우리말 뜻만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    { en: "He comes home late.", ul: "late", ko: ["늦게"], ex: true, exKo: "그는 집에 늦게 온다." },
    { en: "Today is too cold.", ul: "too", ko: ["너무"] },
    { en: "Annie gets up early.", ul: "early", ko: ["일찍"] },
    { en: "She is so lazy.", ul: "so", ko: ["정말", "무척", "대단히"] },
    { en: "The little girl eats slowly.", ul: "slowly", ko: ["천천히"] },
    { en: "This test is really hard.", ul: "really", ko: ["정말", "진짜"] },
    { en: "They read books quietly.", ul: "quietly", ko: ["조용히"] },
    { en: "Ms. Kim speaks kindly.", ul: "kindly", ko: ["친절하게"] },
    { en: "She makes paper boats easily.", ul: "easily", ko: ["쉽게"] },
    { en: "The milk is warm enough.", ul: "enough", ko: ["충분히"] },
    { en: "My puppy barks loudly.", ul: "loudly", ko: ["큰 소리로", "크게"] },
    { en: "Tom and Jerry smile happily.", ul: "happily", ko: ["행복하게"] },
    { en: "My mother works busily.", ul: "busily", ko: ["바쁘게", "부지런히"] },
    { en: "He answers questions quickly.", ul: "quickly", ko: ["빨리"] },
    { en: "Emily hugs the baby carefully.", ul: "carefully", ko: ["조심스럽게", "주의 깊게"] },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    const accept = r.ko.flatMap((k) => koGloss(k));
    const base = fillItem(id, "A", label, underlineInSentence(r.en, r.ul), accept, {
      sectionInstructionKo: instrA,
      promptKo: r.exKo || r.en.replace(/\./, "") + " (우리말)",
    });
    if (n === 0) base.promptKo = "그는 집에 늦게 온다.";
    const prompts = ["", "오늘은 너무 춥다.", "애니는 일찍 일어난다.", "그녀는 정말 게으르다.", "어린 소녀는 천천히 먹는다.", "이 시험은 정말 어렵다.", "그들은 조용히 책을 읽는다.", "김 선생님은 친절하게 말씀하신다.", "그녀는 종이배를 쉽게 만든다.", "우유는 충분히 따뜻하다.", "우리 강아지는 크게 짖는다.", "톰과 제리는 행복하게 웃는다.", "우리 어머니는 바쁘게 일하신다.", "그는 질문에 빨리 대답한다.", "에밀리는 아기를 조심스럽게 안는다."];
    base.promptKo = prompts[n] || base.promptKo;
    return r.ex ? exItem(base, r.ko[0]) : base;
  });
  const bRows = [
    { en: "The bird flies ____.", ko: "그 새는 빠르게 난다.", ans: "fast", ex: true },
    { en: "The store opens ____.", ko: "그 가게는 일찍 문을 연다.", ans: "early" },
    { en: "The skater jumps ____.", ko: "그 스케이트 선수는 높이 점프한다.", ans: "high" },
    { en: "They walk ____.", ko: "그들은 조용히 걷는다.", ans: "quietly" },
    { en: "Bob sings ____.", ko: "밥은 슬프게 노래한다.", ans: "sadly" },
    { en: "I go to bed ____.", ko: "나는 늦게 잠자리에 든다.", ans: "late" },
    { en: "He answers ____.", ko: "그는 천천히 대답한다.", ans: "slowly" },
    { en: "Annie replies to my letters ____.", ko: "애니는 내 편지에 친절하게 답장을 보낸다.", ans: "kindly" },
    { en: "Bill plays computer games ____.", ko: "빌은 컴퓨터 게임을 잘한다.", ans: "well" },
    { en: "The diligent man works ____.", ko: "그 부지런한 남자는 열심히 일한다.", ans: "hard" },
    { en: "They are ____ busy.", ko: "그들은 매우 바쁘다.", ans: "very" },
    { en: "Bill reads comic books ____.", ko: "빌은 행복하게 만화책을 읽는다.", ans: "happily" },
    { en: "This apple pie is ____ delicious.", ko: "이 애플파이는 꽤 맛있다.", ans: "pretty" },
    { en: "Your brother is tall ____.", ko: "네 남동생은 충분히 키가 크다.", ans: "enough" },
    { en: "Her sister solves puzzles ____.", ko: "그녀의 여동생은 퍼즐을 쉽게 푼다.", ans: "easily" },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "B", label, r.en, en(r.ans), { sectionInstructionKo: instrB, promptKo: r.ko });
    items.push(r.ex ? exItem(base, r.ans) : base);
  });
  writePractice(
    "lesson01-jump.json",
    "lesson01-jump",
    "Lesson 01 Jump — 부사",
    "Grammar Jump (pp. 147–148)",
    "147–148",
    24,
    "Section A·B 각 14문항. A1·B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.", "밑줄 친 부분의 우리말 뜻만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();


// —— Lesson 01 Fly (pp. 149–150) ——
(function lesson01Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    { en: "The rocket flies <u>highly</u>.", ans: "high", ko: "로켓은 높이 난다.", ex: true },
    { en: "He gets up <u>lately</u> on Monday.", ans: "late", ko: "그는 월요일에 늦게 일어난다." },
    { en: "She cooks very <u>slow</u>.", ans: "slowly", ko: "그녀는 요리를 매우 천천히 한다." },
    { en: "Bill plays baseball <u>good</u>.", ans: "well", ko: "빌은 야구를 잘한다." },
    { en: "This problem is <u>prettily</u> difficult.", ans: "pretty", ko: "이 문제는 꽤 어렵다." },
    { en: "They talk <u>quiet</u> on the bus.", ans: "quietly", ko: "그들은 버스에서 조용히 이야기한다." },
    { en: "Kelly draws pictures <u>happy</u>.", ans: "happily", ko: "켈리는 행복하게 그림을 그린다." },
    { en: "David is <u>verily</u> diligent.", ans: "really", ko: "데이비드는 정말 부지런하다." },
    { en: "Those students study science <u>hardly</u>.", ans: "hard", ko: "그 학생들은 과학을 열심히 공부한다." },
    { en: "They go to school <u>earlily</u>.", ans: "early", ko: "그들은 일찍 학교에 간다." },
    { en: "The girl dances <u>beautiful</u>.", ans: "beautifully", ko: "그 여자아이는 아름답게 춤춘다." },
    { en: "They wash their pet <u>careful</u>.", ans: "carefully", ko: "그들은 애완동물을 조심스럽게 씻긴다." },
    { en: "His aunt writes the story <u>easy</u>.", ans: "easily", ko: "그의 이모는 이야기를 쉽게 쓴다." },
    { en: "The man plays the guitar <u>bad</u>.", ans: "badly", ko: "그 남자는 기타를 서투르게 연주한다." },
    { en: "The young man drives a car <u>fastly</u>.", ans: "fast", ko: "그 젊은 남자는 차를 빨리 운전한다." },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "A", label, r.en, en(r.ans), { sectionInstructionKo: instrA, promptKo: r.ko });
    return r.ex ? exItem(base, r.ans) : base;
  });
  const bRows = [
    { en: "They draw ____ . ( good )", ans: "well", ko: "그들은 그림을 잘 그린다.", ex: true },
    { en: "The students walk ____ . ( busy )", ans: "busily", ko: "학생들은 바쁘게 걷는다." },
    { en: "They laugh ____ . ( loud )", ans: "loudly", ko: "그들은 크게 웃는다." },
    { en: "I bake cookies ____ . ( easy )", ans: "easily", ko: "나는 쿠키를 쉽게 굽는다." },
    { en: "Turtles move ____ . ( slow )", ans: "slowly", ko: "거북이는 천천히 움직인다." },
    { en: "The girl smiles ____ . ( pretty )", ans: "prettily", ko: "그 여자아이는 예쁘게 미소 짓는다." },
    { en: "She talks ____ to old people. ( kind )", ans: "kindly", ko: "그녀는 어른들에게 친절하게 말한다." },
    { en: "I brush my teeth ____ . ( careful )", ans: "carefully", ko: "나는 조심스럽게 이를 닦는다." },
    { en: "He washes his face ____ . ( quick )", ans: "quickly", ko: "그는 빨리 세수한다." },
    { en: "Amanda ____ likes chocolate. ( real )", ans: "really", ko: "아만다는 정말 초콜릿을 좋아한다." },
    { en: "My grandpa looks at the photo ____ . ( sad )", ans: "sadly", ko: "할아버지는 슬프게 사진을 보신다." },
    { en: "They sit ____ in the classroom. ( quiet )", ans: "quietly", ko: "그들은 교실에서 조용히 앉는다." },
    { en: "The library closes ____ . ( late )", ans: "late", ko: "도서관은 늦게 문을 닫는다." },
    { en: "My uncle skates ____ . ( happy )", ans: "happily", ko: "삼촌은 행복하게 스케이트를 탄다." },
    { en: "The girl kisses her pet ____ . ( soft )", ans: "softly", ko: "그 여자아이는 애완동물에게 부드럽게 키스한다." },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "B", label, r.en, en(r.ans), { sectionInstructionKo: instrB, promptKo: r.ko });
    items.push(r.ex ? exItem(base, r.ans) : base);
  });
  writePractice(
    "lesson01-fly.json",
    "lesson01-fly",
    "Lesson 01 Fly — 부사",
    "Grammar Fly (pp. 149–150)",
    "149–150",
    28,
    "Section A·B 각 14문항(빈칸 말만). A1·B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "주어진 말을 사용하여 다음 문장을 완성하세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();


// —— Lesson 02 Walk 1 (p. 152) ——
(function lesson02Walk1() {
  const instrA =
    "다음 문장에서 빈도부사를 찾아 동그라미 하세요. 동그라미 친 빈도부사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 빈도부사의 뜻을 찾아 선으로 연결하세요. 알맞은 뜻(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aRows = [
    { en: "Minho never gets up early.", ans: "never", ko: "민호는 결코 일찍 일어나지 않는다.", ex: true },
    { en: "Minsu sometimes gets up early.", ans: "sometimes", ko: "민수는 가끔 일찍 일어난다." },
    { en: "Jenny often gets up early.", ans: "often", ko: "제니는 자주 일찍 일어난다." },
    { en: "Jimin usually gets up early.", ans: "usually", ko: "지민이는 보통 일찍 일어난다." },
    { en: "Anna always gets up early.", ans: "always", ko: "애나는 항상 일찍 일어난다." },
  ];
  const items = aRows.map((r, i) => {
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "A", label, r.en, en(r.ans), { sectionInstructionKo: instrA, promptKo: r.ko });
    return r.ex ? exItem(base, r.ans) : base;
  });
  const choices = ["a. 결코 ~ 않다", "b. 자주, 흔히", "c. 가끔, 때때로", "d. 보통, 대개", "e. 항상"];
  const match = [
    { w: "1. never", i: 0, ko: "never → 결코 ~ 않다" },
    { w: "2. sometimes", i: 2, ko: "sometimes → 가끔" },
    { w: "3. often", i: 1, ko: "often → 자주" },
    { w: "4. usually", i: 3, ko: "usually → 보통" },
    { w: "5. always", i: 4, ko: "always → 항상" },
  ];
  match.forEach((m, i) => {
    items.push(
      mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), m.w, choices, mcAcc(choices, m.i), {
        sectionInstructionKo: instrB,
        promptKo: m.ko,
      })
    );
  });
  writePractice(
    "lesson02-walk1.json",
    "lesson02-walk1",
    "Lesson 02 Walk 1 — 빈도부사",
    "빈도부사 (p. 152)",
    "152",
    10,
    "Section A 4문항, Section B 5문항. A1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장에서 빈도부사를 찾아 동그라미 하세요.", "동그라미 친 빈도부사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
      sec("B", "Section B", instrB, "다음 빈도부사의 뜻을 찾아 선으로 연결하세요.", "알맞은 뜻(a~e)을 하나 골라 누르세요.", "choice", "Choose · 고르기", 5, 0, ["B1", "B2", "B3", "B4", "B5"]),
    ],
    items
  );
})();

// —— Lesson 02 Walk 2 (p. 154) ——
(function lesson02Walk2() {
  const instr =
    "다음 문장에서 빈도부사를 찾아 동그라미 하세요. 동그라미 친 빈도부사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const rows = [
    { en: "Jiho always goes to school early.", ans: "always", ko: "지호는 항상 일찍 학교에 간다.", ex: true },
    { en: "I usually wash my face twice a day.", ans: "usually", ko: "나는 보통 하루에 두 번 세수한다." },
    { en: "Ally often combs her hair.", ans: "often", ko: "앨리는 자주 머리를 빗는다." },
    { en: "We sometimes walk to school.", ans: "sometimes", ko: "우리는 가끔 학교까지 걸어간다." },
    { en: "Tom is never late for class.", ans: "never", ko: "톰은 수업에 절대 지각하지 않는다." },
    { en: "He often plays soccer after school.", ans: "often", ko: "그는 방과 후에 자주 축구를 한다." },
    { en: "They can never watch TV at night.", ans: "never", ko: "그들은 밤에 TV를 절대 볼 수 없다." },
    { en: "Sally never plays computer games.", ans: "never", ko: "샐리는 결코 컴퓨터 게임을 하지 않는다." },
    { en: "I always take a shower at night.", ans: "always", ko: "나는 항상 밤에 샤워한다." },
    { en: "We are usually at home on Sunday.", ans: "usually", ko: "우리는 일요일에 보통 집에 있다." },
  ];
  const items = rows.map((r, i) => {
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const base = fillItem(id, "A", label, r.en, en(r.ans), { sectionInstructionKo: instr, promptKo: r.ko });
    return r.ex ? exItem(base, r.ans) : base;
  });
  writePractice(
    "lesson02-walk2.json",
    "lesson02-walk2",
    "Lesson 02 Walk 2 — 빈도부사",
    "빈도부사 위치 (p. 154)",
    "154",
    10,
    "Section A 9문항. A1 예시는 채점하지 않아요.",
    [sec("A", "Section A", instr, "다음 문장에서 빈도부사를 찾아 동그라미 하세요.", "동그라미 친 빈도부사만 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"])],
    items
  );
})();


// —— Lesson 02 Run (pp. 155–156) ——
(function lesson02Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장에서 주어진 말이 들어갈 알맞은 위치에 동그라미 하세요. 위치 번호(1~4)를 골라 누르세요. (직접 쓰지 않아요.)";
  const aRows = [
    { p: "John is ( usually / always ) happy.", c: ["usually", "always"], i: 1, ko: "존은 항상 행복하다." },
    { p: "They ( never / often ) play soccer.", c: ["never", "often"], i: 0, ko: "그들은 절대 축구를 하지 않는다." },
    { p: "Jimmy ( often / sometimes ) asks questions.", c: ["often", "sometimes"], i: 1, ko: "지미는 가끔 질문을 한다." },
    { p: "He ( usually / always ) sleeps with his puppy.", c: ["usually", "always"], i: 0, ko: "그는 보통 자신의 강아지와 함께 잔다." },
    { p: "She ( often / usually ) visits her uncle.", c: ["often", "usually"], i: 0, ko: "그녀는 자주 자신의 삼촌을 찾아간다." },
    { p: "I ( often / always ) eat some apples in the morning.", c: ["often", "always"], i: 1, ko: "나는 항상 아침에 사과를 몇 개 먹는다." },
    { p: "We can ( often / sometimes ) watch TV.", c: ["often", "sometimes"], i: 1, ko: "우리는 가끔 TV를 볼 수 있다." },
    { p: "He ( usually / always ) does his homework after dinner.", c: ["usually", "always"], i: 0, ko: "그는 보통 저녁 식사 후에 숙제를 한다." },
    { p: "Minho ( usually / often ) goes swimming.", c: ["usually", "often"], i: 1, ko: "민호는 자주 수영을 하러 간다." },
    { p: "You can ( never / always ) see her again.", c: ["never", "always"], i: 0, ko: "너는 절대 그녀를 다시 볼 수 없다." },
    { p: "They ( often / usually ) ride bicycles on the weekend.", c: ["often", "usually"], i: 1, ko: "그들은 보통 주말에 자전거를 탄다." },
    { p: "Bill ( never / always ) washes his hair at night.", c: ["never", "always"], i: 1, ko: "빌은 항상 밤에 머리를 감는다." },
    { p: "I ( always / sometimes ) get up late.", c: ["always", "sometimes"], i: 1, ko: "나는 가끔 늦게 일어난다." },
    { p: "Mimi ( often / usually ) goes to the library.", c: ["often", "usually"], i: 0, ko: "미미는 도서관에 자주 간다." },
    { p: "Anna ( always / never ) eats squid.", c: ["always", "never"], i: 1, ko: "애나는 절대 오징어를 먹지 않는다." },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    return mcItem(id, "A", label, r.p, r.c, mcAcc(r.c, r.i), { sectionInstructionKo: instrA, promptKo: r.ko });
  });
  const posChoices = ["1", "2", "3", "4"];
  const bRows = [
    { p: "Alice (1) comes (2) home (3) late (4). (never)", ans: "1", ko: "앨리스는 결코 늦게 집에 오지 않는다." },
    { p: "Bill (1) plays (2) the (3) piano (4). (sometimes)", ans: "1", ko: "빌은 가끔 피아노를 친다." },
    { p: "I (1) can (2) draw (3) pictures (4). (always)", ans: "2", ko: "나는 항상 그림을 그릴 수 있다." },
    { p: "My family (1) goes (2) to (3) the zoo (4). (often)", ans: "1", ko: "우리 가족은 자주 동물원에 간다." },
    { p: "Anna (1) is (2) at (3) home (4) after eight. (usually)", ans: "2", ko: "애나는 보통 8시 이후에 집에 있다." },
    { p: "I (1) have (2) dinner (3) after (4) seven. (never)", ans: "1", ko: "나는 결코 7시 이후에 저녁을 먹지 않는다." },
    { p: "They (1) can (2) enjoy (3) movies at home (4). (often)", ans: "2", ko: "그들은 자주 집에서 영화를 즐길 수 있다." },
    { p: "He (1) is (2) very (3) shy (4). (sometimes)", ans: "2", ko: "그는 가끔 매우 수줍다." },
    { p: "My mother (1) gets (2) up (3) at (4) six. (always)", ans: "1", ko: "우리 어머니는 항상 6시에 일어나신다." },
    { p: "We (1) do (2) our (3) homework (4) together. (usually)", ans: "1", ko: "우리는 보통 함께 숙제를 한다." },
    { p: "My English teacher (1) speaks (2) in (3) Korean (4). (sometimes)", ans: "1", ko: "우리 영어 선생님은 가끔 한국어로 말씀하신다." },
    { p: "Jisu (1) is (2) sleepy (3) at school (4). (never)", ans: "2", ko: "지수는 학교에서 절대 졸리지 않는다." },
    { p: "The children (1) wash (2) their hands (3) before lunch (4). (always)", ans: "1", ko: "아이들은 항상 점심 전에 손을 씻는다." },
    { p: "My grandma (1) bakes (2) delicious (3) cookies (4). (often)", ans: "1", ko: "할머니는 자주 맛있는 쿠키를 구우신다." },
    { p: "He (1) can (2) use (3) the computer (4). (never)", ans: "2", ko: "그는 결코 컴퓨터를 사용할 수 없다." },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    items.push(
      mcItem(id, "B", label, r.p, posChoices, [r.ans, String(Number(r.ans))], {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  writePractice(
    "lesson02-run.json",
    "lesson02-run",
    "Lesson 02 Run — 빈도부사",
    "Grammar Run (pp. 155–156)",
    "155–156",
    20,
    "Section A 15문항, Section B 15문항(위치 고르기).",
    [
      sec("A", "Section A", instrA, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "다음 문장에서 주어진 말이 들어갈 알맞은 위치에 동그라미 하세요.", "위치 번호(1~4)를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();


// —— Lesson 02 Jump (pp. 157–158) ——
(function lesson02Jump() {
  const instrA =
    "다음 문장의 우리말 뜻을 완성하세요. 빈칸에 들어갈 빈도부사(우리말)만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    { en: "I always get up at seven.", blank: "나는 ____ 7시에 일어난다.", ans: ["항상"], ko: "나는 항상 7시에 일어난다." },
    { en: "My sister never drinks milk.", blank: "내 여동생은 우유를 ____ 마시지 않는다.", ans: ["절대", "결코", "전혀"] },
    { en: "John sometimes wears blue jeans.", blank: "존은 ____ 청바지를 입는다.", ans: ["가끔", "때때로"] },
    { en: "His room is usually clean.", blank: "그의 방은 ____ 깨끗하다.", ans: ["보통", "대개"] },
    { en: "Sally sometimes calls her grandma.", blank: "샐리는 할머니께 ____ 전화를 드린다.", ans: ["가끔", "때때로"] },
    { en: "He often has dinner at a restaurant.", blank: "그는 ____ 식당에서 저녁 식사를 한다.", ans: ["자주", "흔히"] },
    { en: "They often go to the amusement park.", blank: "그들은 ____ 놀이공원에 간다.", ans: ["자주", "흔히"] },
    { en: "Her cake is always delicious.", blank: "그녀의 케이크는 ____ 맛있다.", ans: ["항상", "늘"] },
    { en: "She sometimes sends e-mail to Jim.", blank: "그녀는 ____ 짐에게 이메일을 보낸다.", ans: ["가끔", "때때로"] },
    { en: "I usually go shopping with my mom.", blank: "나는 ____ 우리 엄마와 쇼핑하러 간다.", ans: ["보통", "대개"] },
    { en: "I can always play the piano.", blank: "나는 ____ 피아노를 칠 수 있다.", ans: ["항상", "늘"] },
    { en: "We sometimes play badminton.", blank: "우리는 ____ 배드민턴을 친다.", ans: ["가끔", "때때로"] },
    { en: "Nick usually keeps a diary.", blank: "닉은 ____ 일기를 쓴다.", ans: ["보통", "대개"] },
    { en: "You can never win.", blank: "너는 ____ 이길 수 없다.", ans: ["절대", "결코", "전혀"] },
    { en: "His stories are usually boring.", blank: "그의 이야기는 ____ 지루하다.", ans: ["보통", "대개"] },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    const accept = r.ans.flatMap((k) => koGloss(k));
    return fillItem(id, "A", label, r.en + "\n" + r.blank, accept, { sectionInstructionKo: instrA, promptKo: r.ko || r.blank });
  });
  const bRows = [
    { en: "My father and I ____ go hiking.", ans: "often", ko: "우리 아버지와 나는 자주 하이킹을 간다.", ex: true },
    { en: "John ____ brushes his teeth at night.", ans: "always", ko: "존은 항상 밤에 양치질을 한다." },
    { en: "I can ____ visit him.", ans: "sometimes", ko: "나는 가끔 그를 찾아갈 수 있다." },
    { en: "The kids are ____ happy.", ans: "always", ko: "그 아이들은 항상 행복하다." },
    { en: "We ____ have lunch together.", ans: "usually", ko: "우리는 보통 함께 점심 식사를 한다." },
    { en: "He ____ buys toys.", ans: "never", ko: "그는 절대 장난감을 사지 않는다." },
    { en: "Her backpack is ____ heavy.", ans: "always", ko: "그녀의 배낭은 항상 무겁다." },
    { en: "We are ____ busy.", ans: "sometimes", ko: "우리는 가끔 바쁘다." },
    { en: "We ____ go to the zoo.", ans: "often", ko: "우리는 자주 동물원에 간다." },
    { en: "I can ____ forget her.", ans: "never", ko: "나는 절대 그녀를 잊을 수 없다." },
    { en: "The man is ____ sick.", ans: "often", ko: "그 남자는 자주 아프다." },
    { en: "Anne ____ helps her mom.", ans: "often", ko: "앤은 자주 자신의 엄마를 돕는다." },
    { en: "I ____ read books after dinner.", ans: "usually", ko: "나는 보통 저녁 식사 후에 책을 읽는다." },
    { en: "You can ____ ask questions.", ans: "always", ko: "너희는 항상 질문을 할 수 있다." },
    { en: "Minsu ____ tells a lie.", ans: "never", ko: "민수는 절대 거짓말을 하지 않는다." },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "B", label, r.en, en(r.ans), { sectionInstructionKo: instrB, promptKo: r.ko });
    items.push(r.ex ? exItem(base, r.ans) : base);
  });
  writePractice(
    "lesson02-jump.json",
    "lesson02-jump",
    "Lesson 02 Jump — 빈도부사",
    "Grammar Jump (pp. 157–158)",
    "157–158",
    24,
    "Section A 15문항(우리말), Section B 14문항. B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장의 우리말 뜻을 완성하세요.", "빈칸에 빈도부사(우리말)만 쓰세요.", "words", "Words · 빈칸 말만", 15, 0, ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();

// —— Lesson 02 Fly (pp. 159–160) ——
(function lesson02Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸 두 개에 바르게 고친 말을 각각 쓰거나, 문장 전체를 쓸 수 있어요.";
  const instrB =
    "주어진 말을 사용하여 다음 문장을 완성하세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  const aRows = [
    { en: "John <u>always is</u> diligent.", pair: "is|always", full: "John is always diligent.", ko: "존은 항상 부지런하다.", ex: true },
    { en: "Mandy <u>reads often</u> comic books.", pair: "often|reads", full: "Mandy often reads comic books.", ko: "맨디는 가끔 만화책을 읽는다." },
    { en: "Ostriches <u>never can</u> fly.", pair: "can|never", full: "Ostriches can never fly.", ko: "타조는 결코 날 수 없다." },
    { en: "My pet <u>sleeps sometimes</u> with me.", pair: "sometimes|sleeps", full: "My pet sometimes sleeps with me.", ko: "우리 애완동물은 가끔 나와 함께 잔다." },
    { en: "The students <u>take usually</u> a bus.", pair: "usually|take", full: "The students usually take a bus.", ko: "학생들은 보통 버스를 탄다." },
    { en: "He <u>wears always</u> a wig.", pair: "always|wears", full: "He always wears a wig.", ko: "그는 항상 가발을 쓴다." },
    { en: "They <u>go swimming never</u> in winter.", pair: "never|go", full: "They never go swimming in winter.", ko: "그들은 겨울에 결코 수영하러 가지 않는다." },
    { en: "We <u>sometimes can</u> play golf.", pair: "can|sometimes", full: "We can sometimes play golf.", ko: "우리는 가끔 골프를 칠 수 있다." },
    { en: "He <u>often is</u> sleepy in the morning.", pair: "is|often", full: "He is often sleepy in the morning.", ko: "그는 아침에 자주 졸리다." },
    { en: "Tom <u>eats usually</u> sandwiches for lunch.", pair: "usually|eats", full: "Tom usually eats sandwiches for lunch.", ko: "톰은 보통 점심으로 샌드위치를 먹는다." },
    { en: "You <u>can use always</u> the phone.", pair: "can|always", full: "You can always use the phone.", ko: "너는 항상 전화를 사용할 수 있다." },
    { en: "My brother <u>cleans never</u> his room.", pair: "never|cleans", full: "My brother never cleans his room.", ko: "우리 오빠는 결코 방을 청소하지 않는다." },
    { en: "I <u>sometimes am</u> sad.", pair: "am|sometimes", full: "I am sometimes sad.", ko: "나는 가끔 슬프다." },
    { en: "Yunho <u>watches often</u> baseball games.", pair: "often|watches", full: "Yunho often watches baseball games.", ko: "윤호는 자주 야구 경기를 본다." },
    { en: "We <u>go usually</u> to bed at 10 p.m.", pair: "usually|go", full: "We usually go to bed at 10 p.m.", ko: "우리는 보통 밤 10시에 잔다." },
  ];
  const items = aRows.map((r, n) => {
    const label = "A" + (n + 1);
    const id = "a" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "A", label, r.en, swapAcc(r.pair, r.full), {
      sectionInstructionKo: instrA,
      promptKo: r.ko,
      blanks: 2,
      answerModeTag: "Words · 빈칸 말만 / 문장 전체",
      extra: { type: "fill" },
    });
    return r.ex ? exItem(base, r.pair) : base;
  });
  const bRows = [
    { words: "( have, usually )", en: "I ____ ____ lunch at school.", full: "I usually have lunch at school.", ko: "나는 보통 학교에서 점심을 먹는다.", ex: true },
    { words: "( drink, never )", en: "My mother ____ ____ coffee.", full: "My mother never drinks coffee.", ko: "우리 어머니는 결코 커피를 마시지 않으신다." },
    { words: "( be, sometimes )", en: "My friend ____ ____ late.", full: "My friend is sometimes late.", ko: "내 친구는 가끔 늦는다." },
    { words: "( can, play, often )", en: "We ____ ____ ____ outside.", full: "We can often play outside.", ko: "우리는 자주 밖에서 놀 수 있다." },
    { words: "( get, never )", en: "Eddy ____ ____ up early.", full: "Eddy never gets up early.", ko: "에디는 결코 일찍 일어나지 않는다." },
    { words: "( take, usually )", en: "She ____ ____ a walk in the evening.", full: "She usually takes a walk in the evening.", ko: "그녀는 보통 저녁에 산책한다." },
    { words: "( can, cook, sometimes )", en: "She ____ ____ ____ .", full: "She can sometimes cook.", ko: "그녀는 가끔 요리할 수 있다." },
    { words: "( be, always )", en: "Minho ____ ____ kind to others.", full: "Minho is always kind to others.", ko: "민호는 항상 다른 사람들에게 친절하다." },
    { words: "( make, often )", en: "My mother ____ ____ spaghetti.", full: "My mother often makes spaghetti.", ko: "우리 어머니는 자주 스파게티를 만드신다." },
    { words: "( do, always )", en: "They ____ ____ their homework.", full: "They always do their homework.", ko: "그들은 항상 숙제를 한다." },
    { words: "( be, usually )", en: "He ____ ____ quiet in class.", full: "He is usually quiet in class.", ko: "그는 보통 수업 시간에 조용하다." },
    { words: "( write, never )", en: "Amy ____ ____ letters to her friends.", full: "Amy never writes letters to her friends.", ko: "에이미는 결코 친구들에게 편지를 쓰지 않는다." },
    { words: "( go, often )", en: "We ____ ____ to a concert.", full: "We often go to a concert.", ko: "우리는 자주 콘서트에 간다." },
    { words: "( draw, sometimes )", en: "They ____ ____ pictures.", full: "They sometimes draw pictures.", ko: "그들은 가끔 그림을 그린다." },
    { words: "( can, use, always )", en: "You ____ ____ ____ this pencil.", full: "You can always use this pencil.", ko: "너는 항상 이 연필을 사용할 수 있다." },
  ];
  bRows.forEach((r, n) => {
    const label = "B" + (n + 1);
    const id = "b" + String(n + 1).padStart(2, "0");
    const base = fillItem(id, "B", label, r.en + " " + r.words, sentAcc(r.full), {
      sectionInstructionKo: instrB,
      promptKo: r.ko,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
    });
    items.push(r.ex ? exItem(base, r.full) : base);
  });
  writePractice(
    "lesson02-fly.json",
    "lesson02-fly",
    "Lesson 02 Fly — 빈도부사",
    "Grammar Fly (pp. 159–160)",
    "159–160",
    28,
    "Section A 14문항(위치 고치기), Section B 14문항(문장 완성). A1·B1 예시는 채점하지 않아요.",
    [
      sec("A", "Section A", instrA, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "두 칸에 말만 쓰거나 문장 전체를 쓸 수 있어요.", "words", "Words · 빈칸 말만", 14, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"]),
      sec("B", "Section B", instrB, "주어진 말을 사용하여 다음 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 14, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"]),
    ],
    items
  );
})();


// —— Review 06 (pp. 161–163) ——
(function review06() {
  const items = [];
  const s12 = "[1–2] 다음 중 부사를 고르세요. / 다음 중 밑줄 친 단어가 부사가 아닌 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q01", "1-2", "1", "다음 중 부사를 고르세요.", ["sad", "kind", "happy", "loudly"], mcAcc(["sad", "kind", "happy", "loudly"], 3), {
      sectionInstructionKo: s12,
      promptKo: "부사를 고르세요.",
    }),
    (() => {
      const c2 = [
        underlineInSentence("My father walks fast.", "fast"),
        underlineInSentence("He is always late.", "late"),
        underlineInSentence("Jisu studies math hard.", "hard"),
        underlineInSentence("The girl sings beautifully.", "beautifully"),
      ];
      return mcItem("q02", "1-2", "2", "다음 중 밑줄 친 단어가 부사가 아닌 것을 고르세요.", c2, mcAcc(c2, 1), {
      sectionInstructionKo: s12,
      promptKo: "밑줄 친 단어가 부사가 아닌 것",
      });
    })()
  );
  const s35 = "[3–5] 다음 중 형용사와 부사가 1:1 짝지어진 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q03", "3-5", "3", "", ["kind - kindly", "early - early", "busy - busily", "high - highly"], mcAcc(["kind - kindly", "early - early", "busy - busily", "high - highly"], 3), { sectionInstructionKo: s35, promptKo: "형용사·부사 짝" }),
    mcItem("q04", "3-5", "4", "", ["slow - slowly", "careful - carefully", "happy - happyly", "good - well"], mcAcc(["slow - slowly", "careful - carefully", "happy - happyly", "good - well"], 2), { sectionInstructionKo: s35, promptKo: "형용사·부사 짝" }),
    mcItem("q05", "3-5", "5", "", ["quick - quickly", "bad - badily", "quiet - quietly", "late - late"], mcAcc(["quick - quickly", "bad - badily", "quiet - quietly", "late - late"], 1), { sectionInstructionKo: s35, promptKo: "형용사·부사 짝" })
  );
  const s6 = "[6] 다음 문장의 빈칸에 공통으로 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q06", "6", "6", "He runs ____.\nThe cheetah is ____.", ["easily", "pretty", "quietly", "fast"], mcAcc(["easily", "pretty", "quietly", "fast"], 3), { sectionInstructionKo: s6, promptKo: "공통으로 들어갈 부사" })
  );
  const s7 = "[7] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q07", "7", "7", "The eagle flies ____.\n(그 독수리는 높이 난다.)", ["late", "very", "high", "highly"], mcAcc(["late", "very", "high", "highly"], 2), { sectionInstructionKo: s7, promptKo: "그 독수리는 높이 난다." })
  );
  const s89 = "[8–9] 다음 중 밑줄 친 부분이 틀린 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q08", "8-9", "8", "", [
      "James always goes to bed early.",
      "I never am late for school.",
      "They usually come home together.",
      "Anna often visits her aunt.",
    ], mcAcc(["James always goes to bed early.", "I never am late for school.", "They usually come home together.", "Anna often visits her aunt."], 1), { sectionInstructionKo: s89, promptKo: "틀린 문장" }),
    mcItem("q09", "8-9", "9", "", [
      "This chair is small too.",
      "My mother cooks well.",
      "They smile happily.",
      "The lady is very kind.",
    ], mcAcc(["This chair is small too.", "My mother cooks well.", "They smile happily.", "The lady is very kind."], 0), { sectionInstructionKo: s89, promptKo: "틀린 문장" })
  );
  const s1012 = "[10–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q10", "10-12", "10", "We ( play often / often play ) basketball.", ["play often", "often play"], mcAcc(["play often", "often play"], 1), { sectionInstructionKo: s1012, promptKo: "우리는 자주 농구를 한다." }),
    mcItem("q11", "10-12", "11", "David studies ( Korean hard / hard Korean ).", ["Korean hard", "hard Korean"], mcAcc(["Korean hard", "hard Korean"], 0), { sectionInstructionKo: s1012, promptKo: "데이비드는 한국어를 열심히 공부한다." }),
    mcItem("q12", "10-12", "12", "I ( always can listen / can always listen ) to the song.", ["always can listen", "can always listen"], mcAcc(["always can listen", "can always listen"], 1), { sectionInstructionKo: s1012, promptKo: "나는 항상 그 노래를 들을 수 있다." })
  );
  const s1315 = "[13–15] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q13", "13-15", "13", "Rachel ____ goes to the library.", en("often"), { sectionInstructionKo: s1315, promptKo: "레이첼은 도서관에 자주 간다." }),
    fillItem("q14", "13-15", "14", "They ____ wash the dishes together.", en("usually"), { sectionInstructionKo: s1315, promptKo: "그들은 보통 설거지를 같이 한다." }),
    fillItem("q15", "13-15", "15", "I ____ go out after ten.", en("never"), { sectionInstructionKo: s1315, promptKo: "나는 10시 이후에 절대 안 나간다." })
  );
  const s1618 = "[16–18] 주어진 단어들을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q16", "16-18", "16", "She ____ ____ coffee. (drink, often)", ["often|drinks", "drinks|often"], { sectionInstructionKo: s1618, promptKo: "그녀는 자주 커피를 마신다.", blanks: 2, unordered: true }),
    fillItem("q17", "16-18", "17", "Bill ____ ____ angry. (be, never)", ["is|never", "never|is"], { sectionInstructionKo: s1618, promptKo: "빌은 결코 화내지 않는다.", blanks: 2, unordered: true }),
    fillItem("q18", "16-18", "18", "We ____ ____ ____ TV at night. (can, watch, always)", ["can|always|watch", "can|watch|always"], { sectionInstructionKo: s1618, promptKo: "우리는 항상 밤에 TV를 볼 수 있다.", blanks: 3, unordered: true })
  );
  const s1920 = "[19–20] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q19", "19-20", "19", "The baby cries <u>sad</u>.", sentAcc("The baby cries sadly."), { sectionInstructionKo: s1920, promptKo: "아기가 슬프게 운다.", answerMode: "sentence", type: "sentence", answerModeTag: "Sentence · 문장 전체" }),
    fillItem("q20", "19-20", "20", "I play sometimes computer games.", sentAcc("I sometimes play computer games."), { sectionInstructionKo: s1920, promptKo: "나는 가끔 컴퓨터 게임을 한다.", answerMode: "sentence", type: "sentence", answerModeTag: "Sentence · 문장 전체" })
  );
  writePractice(
    "review-06.json",
    "review-06",
    "Review 06",
    "Unit 06 부사 (pp. 161–163)",
    "161–163",
    30,
    "Review 06은 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.",
    [
      sec("1-2", "[1–2]", s12, "부사 고르기 / 부사가 아닌 것 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
      sec("3-5", "[3–5]", s35, "형용사와 부사 짝 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["3", "4", "5"]),
      sec("6", "[6]", s6, "빈칸에 공통으로 알맞은 말 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["6"]),
      sec("7", "[7]", s7, "우리말 뜻에 맞는 말 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["7"]),
      sec("8-9", "[8–9]", s89, "틀린 문장 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["8", "9"]),
      sec("10-12", "[10–12]", s1012, "괄호 안에서 알맞은 말 고르기", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["10", "11", "12"]),
      sec("13-15", "[13–15]", s1315, "빈칸에 알맞은 빈도부사 쓰기", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["13", "14", "15"]),
      sec("16-18", "[16–18]", s1618, "주어진 단어로 문장 완성", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["16", "17", "18"]),
      sec("19-20", "[19–20]", s1920, "밑줄 친 부분 고쳐 문장 다시 쓰기", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
    ],
    items
  );
})();

console.log("Done —", OUT);
