#!/usr/bin/env node
/* Generate RedZap 2 Review 01–05 JSON under data/red2/reviewNN/review.json */
"use strict";

const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..", "..");
const OUT = path.join(REPO, "data", "red2");

function mc(label, section, sectionTitle, sectionInstructionKo, promptEn, choices, ans1based, extra = {}) {
  const i = ans1based - 1;
  const item = {
    id: `rv${String(label).padStart(2, "0")}`,
    section,
    sectionTitle,
    sectionInstructionKo,
    answerMode: "choice",
    answerModeTag: "Choose · 고르기",
    label: String(label),
    type: "mc",
    promptEn,
    choices,
    accept: [String(ans1based), choices[i]],
    ...extra,
  };
  return item;
}

function fill(label, section, sectionTitle, sectionInstructionKo, promptEn, accept, blanks = 1, extra = {}) {
  const acc = Array.isArray(accept) ? accept : [accept];
  return {
    id: `rv${String(label).padStart(2, "0")}`,
    section,
    sectionTitle,
    sectionInstructionKo,
    answerMode: blanks > 1 ? "words" : "words",
    answerModeTag: "Words · 빈칸 말만",
    label: String(label),
    type: "fill",
    promptEn,
    blanks,
    accept: acc,
    ...extra,
  };
}

function buildReview(meta, sections, items) {
  return {
    practiceId: meta.practiceId,
    title: meta.title,
    subtitle: meta.subtitle,
    pages: meta.pages,
    timerMinutes: 30,
    bookId: "zap-red-2",
    bookTitle: "ZAP Red 2",
    appName: "RedZap 2",
    unitId: meta.unitId,
    unitTitle: meta.unitTitle,
    sectionsVersion: 2,
    introKo: meta.introKo,
    sections,
    items,
  };
}

function writeReview(folder, data) {
  const dir = path.join(OUT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "review.json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", path.relative(REPO, file), "items", data.items.length);
}

// —— Review 01 (pp. 36–39) ——
const rv01Sections = [
  { id: "1-3", title: "[1–3]", instructionKo: "[1–3] 다음 중 일반동사끼리 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["1", "2", "3"] },
  { id: "4-5", title: "[4–5]", instructionKo: "[4–5] 다음 중 동사원형과 3인칭 단수 현재형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["4", "5"] },
  { id: "6-7", title: "[6–7]", instructionKo: "[6–7] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["6", "7"] },
  { id: "8-10", title: "[8–10]", instructionKo: "[8–10] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["8", "9", "10"] },
  { id: "11-13", title: "[11–13]", instructionKo: "[11–13] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["11", "12", "13"] },
  { id: "14-15", title: "[14–15]", instructionKo: "[14–15] 다음 의문문에 대한 알맞은 대답을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["14", "15"] },
  { id: "16-17", title: "[16–17]", instructionKo: "[16–17] 다음 우리말 뜻과 같도록 주어진 단어를 사용하여 문장을 완성하세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 2, exampleCount: 0, labels: ["16", "17"] },
  { id: "18-20", title: "[18–20]", instructionKo: "[18–20] 다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 3, exampleCount: 0, labels: ["18", "19", "20"] },
];
const rv01 = [
  mc(1, "1-3", "[1–3]", rv01Sections[0].instructionKo, "일반동사끼리 짝지어진 것", ["come – are", "is – write", "think – jump"], 3),
  mc(2, "1-3", "[1–3]", rv01Sections[0].instructionKo, "일반동사끼리 짝지어진 것", ["am – is", "go – like", "have – are"], 2),
  mc(3, "1-3", "[1–3]", rv01Sections[0].instructionKo, "일반동사끼리 짝지어진 것", ["hate – dance", "are – love", "read – am"], 1),
  mc(4, "4-5", "[4–5]", rv01Sections[1].instructionKo, "동사원형 – 3인칭 단수", ["do – dos", "sing – singes", "wash – washes"], 3),
  mc(5, "4-5", "[4–5]", rv01Sections[1].instructionKo, "동사원형 – 3인칭 단수", ["pass – passes", "fly – flys", "jump – jumpes"], 1),
  mc(6, "6-7", "[6–7]", rv01Sections[2].instructionKo, "Crystal ______ English.", ["study", "studyes", "studies"], 3),
  mc(7, "6-7", "[6–7]", rv01Sections[2].instructionKo, "A rabbit ______ four legs.", ["have", "haves", "has"], 3),
  mc(8, "8-10", "[8–10]", rv01Sections[3].instructionKo, "The children do not ( like / likes / are like ) milk.", ["like", "likes", "are like"], 1, { promptKo: "그 아이들은 우유를 좋아하지 않는다." }),
  mc(9, "8-10", "[8–10]", rv01Sections[3].instructionKo, "They ( don't / doesn't / aren't ) play soccer.", ["don't", "doesn't", "aren't"], 1, { promptKo: "그들은 축구를 하지 않는다." }),
  mc(10, "8-10", "[8–10]", rv01Sections[3].instructionKo, "My aunt doesn't ( eat / eats / is eat ) potatoes.", ["eat", "eats", "is eat"], 1, { promptKo: "우리 숙모는 감자를 드시지 않는다." }),
  mc(11, "11-13", "[11–13]", rv01Sections[4].instructionKo, "_______ Jenny love him?", ["Is", "Do", "Does"], 3),
  mc(12, "11-13", "[11–13]", rv01Sections[4].instructionKo, "_______ your brothers go to school?", ["Are", "Do", "Does"], 2),
  mc(13, "11-13", "[11–13]", rv01Sections[4].instructionKo, "_______ you play tennis well?", ["Are", "Do", "Does"], 2),
  mc(14, "14-15", "[14–15]", rv01Sections[5].instructionKo, "Does your uncle have a dog?", ["Yes, he is.", "No, he does.", "Yes, he does."], 3),
  mc(15, "14-15", "[14–15]", rv01Sections[5].instructionKo, "Do you like flowers?", ["No, I'm not.", "Yes, I don't.", "No, I don't."], 3),
  fill(16, "16-17", "[16–17]", rv01Sections[6].instructionKo, "The bird ______ high. ( fly )", ["flies"], 1, { promptKo: "그 새는 높이 난다." }),
  fill(17, "16-17", "[16–17]", rv01Sections[6].instructionKo, "He ______ to the park every day. ( go )", ["goes"], 1, { promptKo: "그는 매일 공원에 간다." }),
  fill(18, "18-20", "[18–20]", rv01Sections[7].instructionKo, "A: Does the deer run fast?\nB: Yes, ______ does.", ["it"]),
  fill(19, "18-20", "[18–20]", rv01Sections[7].instructionKo, "A: ______ you have a notebook?\nB: No, I don't.", ["Do"]),
  fill(20, "18-20", "[18–20]", rv01Sections[7].instructionKo, "A: Does your mom play the violin?\nB: Yes, she ______.", ["does"]),
];
writeReview(
  "review01",
  buildReview(
    {
      practiceId: "r2:rv01:review",
      title: "Review 01",
      subtitle: "Unit 01–02 (pp. 36–39)",
      pages: "36–39",
      unitId: "review-01",
      unitTitle: "Review 01 — Unit 01 일반동사 · Unit 02 일반동사의 부정문과 의문문",
      introKo: "Review 01은 20문항입니다. 각 섹션 안내에 따라 고르기·빈칸 말만 구분하세요.",
    },
    rv01Sections,
    rv01
  )
);

// —— Review 02 ——
const rv02Sections = [
  { id: "1-3", title: "[1–3]", instructionKo: "[1–3] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["1", "2", "3"] },
  { id: "4-5", title: "[4–5]", instructionKo: "[4–5] 다음 주어진 말이 들어가기에 알맞은 위치를 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["4", "5"] },
  { id: "6-7", title: "[6–7]", instructionKo: "[6–7] 다음 중 잘못된 문장을 고르세요. / 우리말과 영어가 잘못 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["6", "7"] },
  { id: "8-10", title: "[8–10]", instructionKo: "[8–10] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["8", "9", "10"] },
  { id: "11-13", title: "[11–13]", instructionKo: "[11–13] 다음 괄호 안에서 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["11", "12", "13"] },
  { id: "14-15", title: "[14–15]", instructionKo: "[14–15] 그림을 보고, 다음 괄호 안에서 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["14", "15"] },
  { id: "16-17", title: "[16–17]", instructionKo: "[16–17] 다음 주어진 단어의 반대말을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 2, exampleCount: 0, labels: ["16", "17"] },
  { id: "18-20", title: "[18–20]", instructionKo: "[18–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 3, exampleCount: 0, labels: ["18", "19", "20"] },
];
const rv02 = [
  mc(1, "1-3", "[1–3]", rv02Sections[0].instructionKo, "The cat is ______.", ["white", "big", "warm"], 2, { promptKo: "그 고양이는 크다." }),
  mc(2, "1-3", "[1–3]", rv02Sections[0].instructionKo, "Airplanes are ______.", ["tall", "happy", "fast"], 3, { promptKo: "비행기는 빠르다." }),
  mc(3, "1-3", "[1–3]", rv02Sections[0].instructionKo, "The weather is ______.", ["cool", "long", "short"], 1, { promptKo: "날씨가 시원하다." }),
  mc(4, "4-5", "[4–5]", rv02Sections[1].instructionKo, "I ① have ② a ③ ball. ( blue )", ["①", "②", "③"], 3, { promptKo: "나는 파란색 공이 하나 있다." }),
  mc(5, "4-5", "[4–5]", rv02Sections[1].instructionKo, "His ① grandpa ② is ③ . ( tall )", ["①", "②", "③"], 3, { promptKo: "그의 할아버지는 키가 크시다." }),
  mc(6, "6-7", "[6–7]", "[6–7] 다음 중 잘못된 문장을 고르세요. 보기 중 하나를 골라 누르세요.", "다음 중 잘못된 문장", ["Her brother is tall.", "He is smart a boy.", "The actor is angry."], 2),
  mc(7, "6-7", "[6–7]", "[6–7] 다음 중 우리말과 영어가 잘못 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", "우리말 – 영어", ["낡은 컴퓨터 한 대 – an old computer", "흰 강아지 한 마리 – a white puppy", "내 귀여운 여동생 – cute my sister"], 3),
  mc(8, "8-10", "[8–10]", rv02Sections[3].instructionKo, "Judy jumps ______.", ["slowly", "high", "hard"], 2, { promptKo: "주디는 높이 뛴다." }),
  mc(9, "8-10", "[8–10]", rv02Sections[3].instructionKo, "The farmers get up ______.", ["easily", "carefully", "early"], 3, { promptKo: "그 농부들은 일찍 일어난다." }),
  mc(10, "8-10", "[8–10]", rv02Sections[3].instructionKo, "The boys sing ______.", ["loudly", "loud", "quickly"], 1, { promptKo: "그 남자아이들은 큰 소리로 노래한다." }),
  mc(11, "11-13", "[11–13]", rv02Sections[4].instructionKo, "They have dinner ( at / in / on ) six o'clock.", ["at", "in", "on"], 1),
  mc(12, "11-13", "[11–13]", rv02Sections[4].instructionKo, "Kevin plays the violin ( at / in / on ) Sunday.", ["at", "in", "on"], 3),
  mc(13, "11-13", "[11–13]", rv02Sections[4].instructionKo, "My birthday is ( at / in / on ) March.", ["at", "in", "on"], 2),
  mc(14, "14-15", "[14–15]", rv02Sections[5].instructionKo, "My dog is ( on / under / next to ) the car.", ["on", "under", "next to"], 1, { image: "assets/img/red2/review02/rv14.png" }),
  mc(15, "14-15", "[14–15]", rv02Sections[5].instructionKo, "A ball is ( in / behind / under ) the table.", ["in", "behind", "under"], 3, { image: "assets/img/red2/review02/rv15.png" }),
  fill(16, "16-17", "[16–17]", rv02Sections[6].instructionKo, "new – ______", ["old"]),
  fill(17, "16-17", "[16–17]", rv02Sections[6].instructionKo, "long – ______", ["short"]),
  fill(18, "18-20", "[18–20]", rv02Sections[7].instructionKo, "He drives his car ______.", ["carefully"], { promptKo: "그는 자신의 차를 조심스럽게 운전한다." }),
  fill(19, "18-20", "[18–20]", rv02Sections[7].instructionKo, "Sora is ______ the tree.", ["behind"], { promptKo: "소라는 나무 뒤에 있다." }),
  fill(20, "18-20", "[18–20]", rv02Sections[7].instructionKo, "My house is ______ ______ the school.", ["next|to"], 2, { promptKo: "우리 집은 학교 옆에 있다." }),
];
writeReview(
  "review02",
  buildReview(
    {
      practiceId: "r2:rv02:review",
      title: "Review 02",
      subtitle: "Unit 03–04 (pp. 68–71)",
      pages: "68–71",
      unitId: "review-02",
      unitTitle: "Review 02 — Unit 03 형용사 · Unit 04 부사와 전치사",
      introKo: "Review 02는 20문항입니다. 그림 문항(14–15)은 그림을 보고 고르세요.",
    },
    rv02Sections,
    rv02
  )
);

// —— Review 03 ——
const rv03Sections = [
  { id: "1", title: "[1]", instructionKo: "[1] 다음 밑줄 친 말과 우리말 뜻이 잘못 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 1, exampleCount: 0, labels: ["1"] },
  { id: "2-5", title: "[2–5]", instructionKo: "[2–5] 다음 대화의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 4, exampleCount: 0, labels: ["2", "3", "4", "5"] },
  { id: "6-8", title: "[6–8]", instructionKo: "[6–8] 다음 괄호 안에서 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["6", "7", "8"] },
  { id: "9-10", title: "[9–10]", instructionKo: "[9–10] 다음 중 짝지어진 대화가 어색한 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["9", "10"] },
  { id: "11-12", title: "[11–12]", instructionKo: "[11–12] 다음 질문에 대한 알맞은 대답을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["11", "12"] },
  { id: "13-15", title: "[13–15]", instructionKo: "[13–15] 다음 괄호 안에서 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["13", "14", "15"] },
  { id: "16-20", title: "[16–20]", instructionKo: "[16–20] 다음 대화의 빈칸에 알맞은 단어를 쓰세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 5, exampleCount: 0, labels: ["16", "17", "18", "19", "20"] },
];
const rv03 = [
  mc(1, "1", "[1]", rv03Sections[0].instructionKo, "밑줄 친 말 – 우리말", ["How are you? – 어떻게", "Why are you so happy? – 누가", "Where is it? – 어디에"], 2),
  mc(2, "2-5", "[2–5]", rv03Sections[1].instructionKo, "A: ______ are they?\nB: They are my friends.", ["Who", "What", "Where"], 1),
  mc(3, "2-5", "[2–5]", rv03Sections[1].instructionKo, "A: ______ does Hongcheol have?\nB: He has a red hat.", ["Who", "What", "Where"], 2),
  mc(4, "2-5", "[2–5]", rv03Sections[1].instructionKo, "A: ______ is that?\nB: It's white.", ["What time", "What day", "What color"], 3),
  mc(5, "2-5", "[2–5]", rv03Sections[1].instructionKo, "A: ______ umbrellas does Jessica have?\nB: Two.", ["How old", "How much", "How many"], 3),
  mc(6, "6-8", "[6–8]", rv03Sections[2].instructionKo, "Who ( am / are / is ) they?", ["am", "are", "is"], 2),
  mc(7, "6-8", "[6–8]", rv03Sections[2].instructionKo, "What ( am / are / is ) this?", ["am", "are", "is"], 3),
  mc(8, "6-8", "[6–8]", rv03Sections[2].instructionKo, "What ( do / does / is ) his sister have?", ["do", "does", "is"], 2),
  mc(9, "9-10", "[9–10]", rv03Sections[3].instructionKo, "어색한 대화", ["A: Who is she? B: She is Jason's mom.", "A: What do you like? B: I like monkeys.", "A: What day is it today? B: It's cold."], 3),
  mc(10, "9-10", "[9–10]", rv03Sections[3].instructionKo, "어색한 대화", ["A: How many pencils does she have? B: Thirteen.", "A: How old is your grandma? B: Two hundred won.", "A: What time is it? B: It's eleven o'clock."], 2),
  mc(11, "11-12", "[11–12]", rv03Sections[4].instructionKo, "What color is that?", ["It's white.", "It's Friday.", "It's seven o'clock."], 1),
  mc(12, "11-12", "[11–12]", rv03Sections[4].instructionKo, "How much is this pencil case?", ["Two thousand won", "Two years old.", "Three."], 1),
  mc(13, "13-15", "[13–15]", rv03Sections[5].instructionKo, "A: How ( old / much / many ) are you?\nB: Ten years old.", ["old", "much", "many"], 1),
  mc(14, "13-15", "[13–15]", rv03Sections[5].instructionKo, "A: How ( old / much / many ) are those onions?\nB: Two thousand won.", ["old", "much", "many"], 2),
  mc(15, "13-15", "[13–15]", rv03Sections[5].instructionKo, "A: How ( old / much / many ) pens do you have?\nB: Nine.", ["old", "much", "many"], 3),
  fill(16, "16-20", "[16–20]", rv03Sections[6].instructionKo, "A: ______ is he?\nB: He's my uncle.", ["Who"]),
  fill(17, "16-20", "[16–20]", rv03Sections[6].instructionKo, "A: ______ is this?\nB: It's an eraser.", ["What"]),
  fill(18, "16-20", "[16–20]", rv03Sections[6].instructionKo, "A: What ______ is it today?\nB: It's Saturday.", ["day"]),
  fill(19, "16-20", "[16–20]", rv03Sections[6].instructionKo, "A: How ______ is this notebook?\nB: Two dollars.", ["much"]),
  fill(20, "16-20", "[16–20]", rv03Sections[6].instructionKo, "A: How ______ is she?\nB: Eleven years old.", ["old"]),
];
writeReview(
  "review03",
  buildReview(
    {
      practiceId: "r2:rv03:review",
      title: "Review 03",
      subtitle: "Unit 05–06 (pp. 100–103)",
      pages: "100–103",
      unitId: "review-03",
      unitTitle: "Review 03 — Unit 05 의문사 (1) · Unit 06 의문사 (2)",
      introKo: "Review 03은 20문항입니다.",
    },
    rv03Sections,
    rv03
  )
);

// —— Review 04 ——
const rv04Sections = [
  { id: "1-2", title: "[1–2]", instructionKo: "[1–2] 동사와 「동사원형-ing」 형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["1", "2"] },
  { id: "3-5", title: "[3–5]", instructionKo: "[3–5] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["3", "4", "5"] },
  { id: "6-7", title: "[6–7]", instructionKo: "[6–7] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["6", "7"] },
  { id: "8-9", title: "[8–9]", instructionKo: "[8–9] 다음 중 올바른 문장을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["8", "9"] },
  { id: "10-11", title: "[10–11]", instructionKo: "[10–11] 다음 중 잘못된 문장을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["10", "11"] },
  { id: "12-14", title: "[12–14]", instructionKo: "[12–14] 다음 대화의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["12", "13", "14"] },
  { id: "15", title: "[15]", instructionKo: "[15] 다음 중 짝지어진 대화가 어색한 것을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 1, exampleCount: 0, labels: ["15"] },
  { id: "16-20", title: "[16–20]", instructionKo: "[16–20] 다음 우리말 뜻과 같도록 주어진 동사를 사용하여 문장을 완성하세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 5, exampleCount: 0, labels: ["16", "17", "18", "19", "20"] },
];
const rv04 = [
  mc(1, "1-2", "[1–2]", rv04Sections[0].instructionKo, "동사 – -ing", ["do – doeing", "make – making", "cut – cuting"], 2),
  mc(2, "1-2", "[1–2]", rv04Sections[0].instructionKo, "동사 – -ing", ["tie – tieing", "open – openning", "sit – sitting"], 3),
  mc(3, "3-5", "[3–5]", rv04Sections[1].instructionKo, "They ______ to school.", ["go", "goes", "are going"], 3, { promptKo: "그들은 학교에 가고 있다." }),
  mc(4, "3-5", "[3–5]", rv04Sections[1].instructionKo, "My sister ______ the piano.", ["plays", "is playing", "is play"], 2, { promptKo: "내 여동생은 피아노를 치고 있다." }),
  mc(5, "3-5", "[3–5]", rv04Sections[1].instructionKo, "Mary ______ a comic book.", ["is reading", "is read", "reads"], 1, { promptKo: "메리는 만화책을 읽고 있다." }),
  mc(6, "6-7", "[6–7]", rv04Sections[2].instructionKo, "He's ______ a bike.", ["rideing", "riding", "rides"], 2),
  mc(7, "6-7", "[6–7]", rv04Sections[2].instructionKo, "The dogs are ______ on the bench.", ["sleeping", "sleepping", "sleep"], 1),
  mc(8, "8-9", "[8–9]", rv04Sections[3].instructionKo, "올바른 문장", ["She is drawing.", "We are writeing stories.", "The boys is drinking juice."], 1),
  mc(9, "8-9", "[8–9]", rv04Sections[3].instructionKo, "올바른 문장", ["She is smileing happily.", "I am listenning to music.", "Judy is lying."], 3),
  mc(10, "10-11", "[10–11]", rv04Sections[4].instructionKo, "잘못된 문장", ["Chanho isn't playing baseball.", "We aren't making a snowman.", "You don't sitting on the sofa."], 3),
  mc(11, "10-11", "[10–11]", rv04Sections[4].instructionKo, "잘못된 문장", ["Is you catching the ball?", "Are you playing a computer game?", "Is he cutting the onion?"], 1),
  mc(12, "12-14", "[12–14]", rv04Sections[5].instructionKo, "A: ______ driving a car?\nB: Yes, I am.", ["Are you", "Do you", "Does you"], 1),
  mc(13, "12-14", "[12–14]", rv04Sections[5].instructionKo, "A: ______ playing the piano?\nB: No, he isn't.", ["Are you", "Is he", "Does he"], 2),
  mc(14, "12-14", "[12–14]", rv04Sections[5].instructionKo, "A: Is your grandma cooking?\nB: No, ______.", ["she does", "she is", "she isn't"], 3),
  mc(15, "15", "[15]", rv04Sections[6].instructionKo, "어색한 대화", ["A: Are your sisters eating pizza? B: Yes, she is.", "A: Is he watching TV? B: No, he isn't.", "A: Are the cows eating? B: Yes, they are."], 1),
  fill(16, "16-20", "[16–20]", rv04Sections[7].instructionKo, "They're ______ ______ to music. ( listen )", ["not|listening"], 2, { promptKo: "그들은 음악을 듣고 있지 않다." }),
  fill(17, "16-20", "[16–20]", rv04Sections[7].instructionKo, "She's ______ home. ( come )", ["coming"], 1, { promptKo: "그녀가 집으로 오고 있다." }),
  fill(18, "16-20", "[16–20]", rv04Sections[7].instructionKo, "Beethoven ______ ______ ______. ( sing )", ["is|not|singing"], 3, { promptKo: "베토벤은 노래를 부르고 있지 않다." }),
  fill(19, "16-20", "[16–20]", rv04Sections[7].instructionKo, "______ Mike ______ ? ( dance )", ["Is|dancing"], 2, { promptKo: "마이크는 춤을 추고 있니?" }),
  fill(20, "16-20", "[16–20]", rv04Sections[7].instructionKo, "______ the birds ______ ? ( fly )", ["Are|flying"], 2, { promptKo: "그 새들은 날고 있니?" }),
];
// —— Review 05 ——
const rv05Sections = [
  { id: "1-2", title: "[1–2]", instructionKo: "[1–2] 그림을 보고, 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["1", "2"] },
  { id: "3-5", title: "[3–5]", instructionKo: "[3–5] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["3", "4", "5"] },
  { id: "6-8", title: "[6–8]", instructionKo: "[6–8] 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["6", "7", "8"] },
  { id: "9-10", title: "[9–10]", instructionKo: "[9–10] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["9", "10"] },
  { id: "11-12", title: "[11–12]", instructionKo: "[11–12] 그림을 보고, 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 2, exampleCount: 0, labels: ["11", "12"] },
  { id: "13-15", title: "[13–15]", instructionKo: "[13–15] 다음 대화의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.", answerMode: "choice", answerModeTag: "Choose · 고르기", itemCount: 3, exampleCount: 0, labels: ["13", "14", "15"] },
  { id: "16-20", title: "[16–20]", instructionKo: "[16–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.", answerMode: "words", answerModeTag: "Words · 빈칸 말만", itemCount: 5, exampleCount: 0, labels: ["16", "17", "18", "19", "20"] },
];
const rv05 = [
  mc(1, "1-2", "[1–2]", rv05Sections[0].instructionKo, "I ( can / can't ) swim.", ["can", "can't"], 2, { image: "assets/img/red2/review05/rv01.png" }),
  mc(2, "1-2", "[1–2]", rv05Sections[0].instructionKo, "It ( can / can't ) jump.", ["can", "can't"], 1, { image: "assets/img/red2/review05/rv02.png" }),
  mc(3, "3-5", "[3–5]", rv05Sections[1].instructionKo, "They can ______ Korean well.", ["speak", "speaks", "speaking"], 1),
  mc(4, "3-5", "[3–5]", rv05Sections[1].instructionKo, "Polly cannot ______ a bike.", ["rides", "ride", "riding"], 2),
  mc(5, "3-5", "[3–5]", rv05Sections[1].instructionKo, "He can't ______ soccer.", ["play", "plays", "playing"], 1),
  mc(6, "6-8", "[6–8]", rv05Sections[2].instructionKo, "A: ( Can you / Can he / Can they ) draw a picture?\nB: Yes, he can.", ["Can you", "Can he", "Can they"], 2),
  mc(7, "6-8", "[6–8]", rv05Sections[2].instructionKo, "A: Can the tiger swim?\nB: No, ( it can / she can / it can't ).", ["it can", "she can", "it can't"], 3),
  mc(8, "6-8", "[6–8]", rv05Sections[2].instructionKo, "A: Can those boys fly the kite?\nB: Yes, ( they can / he can / they can't ).", ["they can", "he can", "they can't"], 1),
  mc(9, "9-10", "[9–10]", rv05Sections[3].instructionKo, "______ quiet, please.", ["Are", "Is", "Be"], 3, { promptKo: "조용히 하세요." }),
  mc(10, "9-10", "[9–10]", rv05Sections[3].instructionKo, "______ the door.", ["Close", "Closes", "Closing"], 1, { promptKo: "문을 닫아라." }),
  mc(11, "11-12", "[11–12]", rv05Sections[4].instructionKo, "Don't ______ here.", ["sit", "sits", "sitting"], 1, { image: "assets/img/red2/review05/rv11.png" }),
  mc(12, "11-12", "[11–12]", rv05Sections[4].instructionKo, "Don't ______ here.", ["swims", "swim", "swimming"], 2, { image: "assets/img/red2/review05/rv12.png" }),
  mc(13, "13-15", "[13–15]", rv05Sections[5].instructionKo, "A: Let's ______ fast.\nB: All right.", ["run", "runs", "running"], 1),
  mc(14, "13-15", "[13–15]", rv05Sections[5].instructionKo, "A: Let's ______ him.\nB: Sure.", ["helps", "help", "helping"], 2),
  mc(15, "13-15", "[13–15]", rv05Sections[5].instructionKo, "A: Let's ______ a snowman.\nB: OK!", ["making", "makes", "make"], 3),
  fill(16, "16-20", "[16–20]", rv05Sections[6].instructionKo, "Please ______ down.", ["sit"], { promptKo: "자리에 앉으세요." }),
  fill(17, "16-20", "[16–20]", rv05Sections[6].instructionKo, "______ ______ .", ["Let's|sing", "Let us|sing"], 2, { promptKo: "노래를 부르자." }),
  fill(18, "16-20", "[16–20]", rv05Sections[6].instructionKo, "______ up early.", ["Get"], { promptKo: "일찍 일어나라." }),
  fill(19, "16-20", "[16–20]", rv05Sections[6].instructionKo, "______ ______ computer games.", ["Don't|play", "Do not|play"], 2, { promptKo: "컴퓨터 게임을 하지 마라." }),
  fill(20, "16-20", "[16–20]", rv05Sections[6].instructionKo, "______ ______ fishing.", ["Let's|go", "Let us|go"], 2, { promptKo: "낚시하러 가자." }),
];

writeReview(
  "review04",
  buildReview(
    {
      practiceId: "r2:rv04:review",
      title: "Review 04",
      subtitle: "Unit 07–08 (pp. 132–135)",
      pages: "132–135",
      unitId: "review-04",
      unitTitle: "Review 04 — Unit 07 현재 진행형 · Unit 08 현재 진행형의 부정문과 의문문",
      introKo: "Review 04는 20문항입니다.",
    },
    rv04Sections,
    rv04
  )
);

writeReview(
  "review05",
  buildReview(
    {
      practiceId: "r2:rv05:review",
      title: "Review 05",
      subtitle: "Unit 09–10 (pp. 164–167)",
      pages: "164–167",
      unitId: "review-05",
      unitTitle: "Review 05 — Unit 09 조동사 can · Unit 10 명령문",
      introKo: "Review 05는 20문항입니다. 그림 문항(1–2, 11–12)은 그림을 보고 고르세요.",
    },
    rv05Sections,
    rv05
  )
);
