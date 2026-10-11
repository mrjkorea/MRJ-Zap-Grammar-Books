#!/usr/bin/env node
/** Generate data/red1/review01..review05/review.json */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..", "..");

function sec(id, instructionKo, answerMode, labels) {
  const tags = {
    choice: "Choose · 고르기",
    words: "Words · 빈칸 말만",
    sentence: "Sentence · 문장 전체",
    match: "Match · 짝 맞추기",
  };
  return {
    id,
    title: `[${id.replace(/-/g, "–")}]`,
    instructionKo,
    answerMode,
    answerModeTag: tags[answerMode],
    itemCount: labels.length,
    exampleCount: 0,
    labels: labels.map(String),
  };
}

function baseItem(id, section, label, instructionKo, answerMode) {
  const tags = {
    choice: "Choose · 고르기",
    words: "Words · 빈칸 말만",
    sentence: "Sentence · 문장 전체",
    match: "Match · 짝 맞추기",
  };
  return {
    id,
    section,
    sectionTitle: `Section ${section}`,
    sectionInstructionKo: instructionKo,
    answerMode,
    answerModeTag: tags[answerMode],
    label: String(label),
  };
}

function mc(section, label, instruction, promptEn, choices, ans, extra = {}) {
  const id = `q${String(label).padStart(2, "0")}`;
  return {
    ...baseItem(id, section, label, instruction, "choice"),
    type: "mc",
    promptEn: promptEn || "",
    choices,
    accept: [String(ans)],
    ...extra,
  };
}

function fill(section, label, instruction, promptEn, accept, extra = {}) {
  const id = `q${String(label).padStart(2, "0")}`;
  const acc = Array.isArray(accept) ? accept : [accept];
  return {
    ...baseItem(id, section, label, instruction, extra.answerMode || "words"),
    type: "fill",
    promptEn,
    blanks: extra.blanks || 1,
    accept: acc,
    ...extra,
  };
}

function pack(meta, sections, items) {
  return {
    practiceId: meta.practiceId,
    title: meta.title,
    subtitle: meta.subtitle,
    pages: meta.pages,
    timerMinutes: meta.timerMinutes || 25,
    introKo: meta.introKo,
    sections,
    items,
  };
}

function writeReview(dir, data) {
  const out = path.join(REPO, "data/red1", dir, "review.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
  const n = data.items.filter((i) => !i.displayOnly).length;
  console.log("wrote", path.relative(REPO, out), "graded", n);
}

// Review 01
writeReview(
  "review01",
  pack(
    {
      practiceId: "r1:rv01:review",
      title: "Review 01",
      subtitle: "Units 01–02 · pp. 36–39",
      pages: "36–39",
      introKo: "Review 01은 [1]부터 [20]까지 20문항입니다. 고르기와 빈칸 쓰기로 풀어요.",
    },
    [
      sec(
        "1-3",
        "[1–3] 다음 중 알파벳 대문자와 소문자가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [1, 2, 3]
      ),
      sec(
        "4-5",
        "[4–5] 다음에서 자음이 몇 개인지 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [4, 5]
      ),
      sec(
        "6-7",
        "[6–7] 다음 중 숫자와 단어가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [6, 7]
      ),
      sec(
        "8-10",
        "[8–10] 다음 그림에 알맞은 단어를 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [8, 9, 10]
      ),
      sec(
        "11-12",
        "[11–12] 다음 중 셀 수 있는 명사를 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [11, 12]
      ),
      sec(
        "13-15",
        "[13–15] 다음 중 셀 수 없는 명사를 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [13, 14, 15]
      ),
      sec(
        "16-17",
        "[16–17] 다음 단어를 괄호 안의 지시대로 바꿔 쓰세요. 빈칸에 알맞은 단어를 쓰세요.",
        "words",
        [16, 17]
      ),
      sec(
        "18",
        "[18] 다음 중 셀 수 있는 명사를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [18]
      ),
      sec(
        "19-20",
        "[19–20] 다음 중 셀 수 없는 명사를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [19, 20]
      ),
    ],
    (() => {
      const I1 =
        "[1–3] 다음 중 알파벳 대문자와 소문자가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I2 = "[4–5] 다음에서 자음이 몇 개인지 고르세요. 보기 중 하나를 골라 누르세요.";
      const I3 = "[6–7] 다음 중 숫자와 단어가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I4 =
        "[8–10] 다음 그림에 알맞은 단어를 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I5 = "[11–12] 다음 중 셀 수 있는 명사를 고르세요. 보기 중 하나를 골라 누르세요.";
      const I6 = "[13–15] 다음 중 셀 수 없는 명사를 고르세요. 보기 중 하나를 골라 누르세요.";
      const I7 = "[16–17] 다음 단어를 괄호 안의 지시대로 바꿔 쓰세요. 빈칸에 알맞은 단어를 쓰세요.";
      const I8 = "[18] 다음 중 셀 수 있는 명사를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      const I9 = "[19–20] 다음 중 셀 수 없는 명사를 찾아 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      return [
        mc("1-3", 1, I1, "", ["B – d", "Q – q", "U – v"], 2),
        mc("1-3", 2, I1, "", ["F – e", "A – r", "P – p"], 3),
        mc("1-3", 3, I1, "", ["H – h", "I – j", "G – c"], 1),
        mc("4-5", 4, I2, "p r a z b o d v c k", ["six", "eight", "ten"], 2),
        mc("4-5", 5, I2, "g e t i h u f q s j", ["five", "seven", "nine"], 2),
        mc("6-7", 6, I3, "", ["3 – two", "4 – four", "9 – eight"], 2),
        mc("6-7", 7, I3, "", ["11 – eleven", "12 – twenty", "16 – seventeen"], 1),
        mc("8-10", 8, I4, "( five / fifteen ) cats", ["five", "fifteen"], 1, {
          image: "assets/img/red1/review01/q08.png",
        }),
        mc("8-10", 9, I4, "( ten / twenty ) pencils", ["ten", "twenty"], 1, {
          image: "assets/img/red1/review01/q09.png",
        }),
        mc("8-10", 10, I4, "( three / thirteen ) eggs", ["three", "thirteen"], 2, {
          image: "assets/img/red1/review01/q10.png",
        }),
        mc("11-12", 11, I5, "", ["water", "milk", "rabbit"], 3),
        mc("11-12", 12, I5, "", ["cup", "juice", "time"], 1),
        mc("13-15", 13, I6, "", ["sand", "zebra", "boy"], 1),
        mc("13-15", 14, I6, "", ["tiger", "snow", "flower"], 2),
        mc("13-15", 15, I6, "", ["woman", "fish", "paper"], 3),
        fill("16-17", 16, I7, "tree (대문자로)", ["TREE", "Tree"], { promptKo: "소문자 tree → 대문자" }),
        fill("16-17", 17, I7, "SAND (소문자로)", ["sand"], { promptKo: "대문자 SAND → 소문자" }),
        fill("18", 18, I8, "love · peace · cat · time", ["cat"], { promptKo: "셀 수 있는 명사" }),
        fill("19-20", 19, I9, "girl · juice · bag · flower", ["juice"]),
        fill("19-20", 20, I9, "park · water · lion · dog", ["water"]),
      ];
    })()
  )
);

// Review 02
writeReview(
  "review02",
  pack(
    {
      practiceId: "r1:rv02:review",
      title: "Review 02",
      subtitle: "Units 03–04 · pp. 68–71",
      pages: "68–71",
      introKo: "Review 02는 [1]부터 [20]까지 20문항입니다.",
    },
    [
      sec(
        "1-5",
        "[1–5] 다음 중 명사의 단수형과 복수형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [1, 2, 3, 4, 5]
      ),
      sec(
        "6-7",
        "[6–7] 다음 그림에 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [6, 7]
      ),
      sec(
        "8-10",
        "[8–10] 다음 그림에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [8, 9, 10]
      ),
      sec(
        "11-13",
        "[11–13] 다음 문장의 빈칸에 알맞은 말을 고르세요. 필요 없으면 X를 고르세요.",
        "choice",
        [11, 12, 13]
      ),
      sec(
        "14-15",
        "[14–15] 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [14, 15]
      ),
      sec(
        "16-17",
        "[16–17] 다음 명사의 복수형을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [16, 17]
      ),
      sec(
        "18-20",
        "[18–20] 다음 우리말 뜻과 같도록 빈칸에 a, an 또는 the를 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [18, 19, 20]
      ),
    ],
    (() => {
      const I1 =
        "[1–5] 다음 중 명사의 단수형과 복수형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I2a =
        "[6–7] 다음 그림에 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I2b = "[8–10] 다음 그림에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I3 = "[11–13] 다음 문장의 빈칸에 알맞은 말을 고르세요. 필요 없으면 X를 고르세요.";
      const I4 =
        "[14–15] 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I5 = "[16–17] 다음 명사의 복수형을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      const I6 =
        "[18–20] 다음 우리말 뜻과 같도록 빈칸에 a, an 또는 the를 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      return [
        mc("1-5", 1, I1, "", ["pen – penes", "tree – trees", "cat – cates"], 2),
        mc("1-5", 2, I1, "", ["bus – buses", "boy – boies", "fox – foxies"], 1),
        mc("1-5", 3, I1, "", ["box – boxes", "tomato – tomatos", "lady – ladys"], 1),
        mc("1-5", 4, I1, "", ["candy – candys", "baby – babies", "key – keyes"], 2),
        mc("1-5", 5, I1, "", ["leaf – leafs", "wolf – wolfes", "knife – knives"], 3),
        mc("6-7", 6, I2a, "( ball / balls / balles )", ["ball", "balls", "balles"], 2, {
          image: "assets/img/red1/review02/q06.png",
        }),
        mc("6-7", 7, I2a, "( lady / ladys / ladies )", ["lady", "ladys", "ladies"], 3, {
          image: "assets/img/red1/review02/q07.png",
        }),
        mc("8-10", 8, I2b, "", ["men", "man", "mens"], 1, {
          image: "assets/img/red1/review02/q08.png",
        }),
        mc("8-10", 9, I2b, "", ["foot", "feet", "foots"], 2, {
          image: "assets/img/red1/review02/q09.png",
        }),
        mc("8-10", 10, I2b, "", ["goose", "gooses", "geese"], 3, {
          image: "assets/img/red1/review02/q10.png",
        }),
        mc("11-13", 11, I3, "It is ______ dog.", ["a", "an", "X"], 1),
        mc("11-13", 12, I3, "It is ______ sun.", ["a", "the", "X"], 2),
        mc("11-13", 13, I3, "I have ______ lunch.", ["a", "the", "X"], 3),
        mc("14-15", 14, I4, "It is ( a / an ) ant.", ["a", "an"], 2),
        mc("14-15", 15, I4, "I play ( a / the ) violin.", ["a", "the"], 2),
        fill("16-17", 16, I5, "child", ["children"]),
        fill("16-17", 17, I5, "tooth", ["teeth"]),
        fill("18-20", 18, I6, "Look at ______ actor.", ["an"], { promptKo: "그 배우를 봐라." }),
        fill("18-20", 19, I6, "I have ______ lemon.", ["a"], { promptKo: "나는 레몬 한 개를 가지고 있다." }),
        fill("18-20", 20, I6, "We play ______ piano.", ["the"], { promptKo: "우리는 피아노를 친다." }),
      ];
    })()
  )
);

// Review 03
writeReview(
  "review03",
  pack(
    {
      practiceId: "r1:rv03:review",
      title: "Review 03",
      subtitle: "Units 05–06 · pp. 100–103",
      pages: "100–103",
      introKo: "Review 03은 [1]부터 [20]까지 20문항입니다.",
    },
    [
      sec(
        "1-2",
        "[1–2] 다음 그림에 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [1, 2]
      ),
      sec(
        "3-5",
        "[3–5] 다음 그림에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [3, 4, 5]
      ),
      sec(
        "6-8",
        "[6–8] 다음 중 대명사의 단수형과 복수형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [6, 7, 8]
      ),
      sec(
        "9-10",
        "[9–10] 다음 중 인칭대명사의 주격과 목적격이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [9, 10]
      ),
      sec(
        "11-15",
        "[11–15] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [11, 12, 13, 14, 15]
      ),
      sec(
        "16-20",
        "[16–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [16, 17, 18, 19, 20]
      ),
    ],
    (() => {
      const I1 =
        "[1–2] 다음 그림에 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I2 = "[3–5] 다음 그림에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I3 =
        "[6–8] 다음 중 대명사의 단수형과 복수형이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I4 =
        "[9–10] 다음 중 인칭대명사의 주격과 목적격이 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I5 = "[11–15] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I6 =
        "[16–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      return [
        mc("1-2", 1, I1, "( he / you / they )", ["he", "you", "they"], 2, {
          image: "assets/img/red1/review03/q01.png",
          promptKo: "말풍선: 너",
        }),
        mc("1-2", 2, I1, "( we / they / he )", ["we", "they", "he"], 1, {
          image: "assets/img/red1/review03/q02.png",
          promptKo: "말풍선: 우리",
        }),
        mc("3-5", 3, I2, "", ["this", "that", "them"], 1, {
          image: "assets/img/red1/review03/q03.png",
        }),
        mc("3-5", 4, I2, "", ["this", "these", "that"], 3, {
          image: "assets/img/red1/review03/q04.png",
        }),
        mc("3-5", 5, I2, "", ["those", "he", "that"], 1, {
          image: "assets/img/red1/review03/q05.png",
        }),
        mc("6-8", 6, I3, "", ["I — they", "you — you", "you — we"], 2),
        mc("6-8", 7, I3, "", ["she — they", "he — we", "you — they"], 1),
        mc("6-8", 8, I3, "", ["this — those", "that — those", "these — those"], 2),
        mc("9-10", 9, I4, "", ["she — her", "he — his", "you — me"], 1),
        mc("9-10", 10, I4, "", ["we — our", "they — them", "she — him"], 2),
        mc("11-15", 11, I5, "______ am weak.", ["I", "Me", "She"], 1, { promptKo: "나는 몸이 약하다." }),
        mc("11-15", 12, I5, "______ is a giraffe.", ["They", "We", "It"], 3, { promptKo: "그것은 기린이다." }),
        mc("11-15", 13, I5, "______ have lunch every day.", ["Them", "They", "We"], 2, {
          promptKo: "그들은 매일 점심 식사를 한다.",
        }),
        mc("11-15", 14, I5, "I meet ______ every week.", ["she", "him", "her"], 3, {
          promptKo: "나는 그녀를 매주 만난다.",
        }),
        mc("11-15", 15, I5, "They know ______.", ["us", "we", "you"], 1, { promptKo: "그들은 우리를 안다." }),
        fill("16-20", 16, I6, "______ are smart.", ["You"], { promptKo: "너희는 영리하다." }),
        fill("16-20", 17, I6, "______ is sad.", ["She"], { promptKo: "그녀는 슬프다." }),
        fill("16-20", 18, I6, "We like ______.", ["him"], { promptKo: "우리는 그를 좋아한다." }),
        fill("16-20", 19, I6, "______ is a zebra.", ["That"], { promptKo: "저것은 얼룩말이다." }),
        fill("16-20", 20, I6, "______ are ants.", ["These"], { promptKo: "이것들은 개미이다." }),
      ];
    })()
  )
);

// Review 04
writeReview(
  "review04",
  pack(
    {
      practiceId: "r1:rv04:review",
      title: "Review 04",
      subtitle: "Units 07–08 · pp. 132–135",
      pages: "132–135",
      introKo: "Review 04는 [1]부터 [20]까지 20문항입니다.",
    },
    [
      sec(
        "1-3",
        "[1–3] 다음 중 우리말과 영어가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [1, 2, 3]
      ),
      sec(
        "4-5",
        "[4–5] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [4, 5]
      ),
      sec(
        "6-10",
        "[6–10] 다음 밑줄 친 부분이 바르게 쓰인 문장을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [6, 7, 8, 9, 10]
      ),
      sec(
        "11-13",
        "[11–13] 다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [11, 12, 13]
      ),
      sec(
        "14-15",
        "[14–15] 다음 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [14, 15]
      ),
      sec(
        "16-18",
        "[16–18] 다음 괄호 안의 인칭대명사를 알맞은 형태로 바꿔 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [16, 17, 18]
      ),
      sec(
        "19-20",
        "[19–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [19, 20]
      ),
    ],
    (() => {
      const I1 =
        "[1–3] 다음 중 우리말과 영어가 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I2 =
        "[4–5] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I3 =
        "[6–10] 다음 밑줄 친 부분이 바르게 쓰인 문장을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I4 =
        "[11–13] 다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I5 =
        "[14–15] 다음 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I6 =
        "[16–18] 다음 괄호 안의 인칭대명사를 알맞은 형태로 바꿔 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      const I7 = "[19–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      return [
        mc("1-3", 1, I1, "", ["you piano", "his nose", "she dad"], 2),
        mc("1-3", 2, I1, "", ["me doll", "you bikes", "their toys"], 3),
        mc("1-3", 3, I1, "", ["it's ear", "our teacher", "he robot"], 2),
        mc("4-5", 4, I2, "She ( am / are / is ) lazy.", ["am", "are", "is"], 3, { promptKo: "그녀는 게으르다." }),
        mc("4-5", 5, I2, "They ( am / are / is ) our teachers.", ["am", "are", "is"], 2, {
          promptKo: "그들은 우리 선생님이시다.",
        }),
        mc(
          "6-10",
          6,
          I3,
          "",
          ["They like <u>she</u>.", "The piano is <u>her</u>.", "<u>Her</u> name is Lisa."],
          3
        ),
        mc(
          "6-10",
          7,
          I3,
          "",
          ["<u>Ours</u> dog is smart.", "The room is <u>ours</u>.", "They visit <u>we</u> every day."],
          2
        ),
        mc(
          "6-10",
          8,
          I3,
          "",
          ["<u>His</u> mom is a pilot.", "Those mittens are <u>him</u>.", "<u>Our</u> know him."],
          1
        ),
        mc(
          "6-10",
          9,
          I3,
          "",
          ["They are <u>me</u> friends.", "You meet <u>hers</u> every day.", "That eraser is <u>mine</u>."],
          3
        ),
        mc(
          "6-10",
          10,
          I3,
          "",
          ["I like <u>your</u> brother.", "These caps are <u>you</u>.", "<u>It's</u> nose is long."],
          1
        ),
        mc("11-13", 11, I4, "I am an actor. = ______ an actor.", ["I'm", "Im", "I's"], 1),
        mc("11-13", 12, I4, "They are police officers. = ______ police officers.", ["Their", "They're", "That"], 2),
        mc("11-13", 13, I4, "He is thin. = ______ thin.", ["He's", "He're", "His"], 1),
        mc("14-15", 14, I5, "The cat ______ cute. / The giraffes ______ tall.", ["is – is", "is – am", "is – are"], 3),
        mc("14-15", 15, I5, "That ______ my house. / Those shoes ______ mine.", ["is – are", "are – are", "am – is"], 1),
        fill("16-18", 16, I6, "______ mom is a teacher. ( I )", ["My"], { promptKo: "주어 I → 소유격" }),
        fill("16-18", 17, I6, "The umbrella is ______. ( you )", ["yours"], { promptKo: "you → 소유대명사" }),
        fill("16-18", 18, I6, "These are ______ bats. ( he )", ["his"], { promptKo: "he → 소유격" }),
        fill("19-20", 19, I7, "The tomatoes ______ red.", ["are"], { promptKo: "그 토마토들은 빨갛다." }),
        fill("19-20", 20, I7, "______ ______ my father.", ["He|is"], {
          blanks: 2,
          promptKo: "그는 우리 아버지이시다.",
        }),
      ];
    })()
  )
);

// Review 05 (printed 164–167; PDF pp. 165–168)
writeReview(
  "review05",
  pack(
    {
      practiceId: "r1:rv05:review",
      title: "Review 05",
      subtitle: "Units 09–10 · pp. 164–167",
      pages: "164–167",
      introKo: "Review 05는 [1]부터 [20]까지 20문항입니다. 고르기와 빈칸 쓰기로 풀어요.",
    },
    [
      sec(
        "1-5",
        "[1–5] 다음 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [1, 2, 3, 4, 5]
      ),
      sec(
        "6-10",
        "[6–10] 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [6, 7, 8, 9, 10]
      ),
      sec(
        "11-12",
        "[11–12] 다음 중 밑줄 친 부분이 바르게 쓰인 문장을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [11, 12]
      ),
      sec(
        "13-15",
        "[13–15] 다음 의문문에 알맞은 대답을 고르세요. 보기 중 하나를 골라 누르세요.",
        "choice",
        [13, 14, 15]
      ),
      sec(
        "16-17",
        "[16–17] 다음 밑줄 친 부분의 줄임말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [16, 17]
      ),
      sec(
        "18-20",
        "[18–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.",
        "words",
        [18, 19, 20]
      ),
    ],
    (() => {
      const I0 =
        "[1–5] 다음 빈칸에 알맞은 말을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I0b =
        "[6–10] 다음 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요.";
      const I1 =
        "[11–12] 다음 중 밑줄 친 부분이 바르게 쓰인 문장을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I2 = "[13–15] 다음 의문문에 알맞은 대답을 고르세요. 보기 중 하나를 골라 누르세요.";
      const I3 = "[16–17] 다음 밑줄 친 부분의 줄임말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      const I4 = "[18–20] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
      const neg = ["is not", "am not", "are not"];
      return [
        mc("1-5", 1, I0, "She ______ my mother.", neg, 1),
        mc("1-5", 2, I0, "They ______ my puppies.", neg, 3),
        mc("1-5", 3, I0, "I ______ a dancer.", neg, 2),
        mc("1-5", 4, I0, "That ______ my cap.", neg, 1),
        mc("1-5", 5, I0, "These ______ his pencils.", neg, 3),
        mc(
          "6-10",
          6,
          I0b,
          "A: ( Are you / Am I / Is she ) Tommy?\nB: Yes, I am.",
          ["Are you", "Am I", "Is she"],
          1
        ),
        mc(
          "6-10",
          7,
          I0b,
          "A: ( Is he / Is it / Is she ) your grandpa?\nB: Yes, he is.",
          ["Is he", "Is it", "Is she"],
          1
        ),
        mc(
          "6-10",
          8,
          I0b,
          "A: Are they police officers?\nB: No, ( that aren't / they are / they aren't ).",
          ["that aren't", "they are", "they aren't"],
          3
        ),
        mc(
          "6-10",
          9,
          I0b,
          "A: Is this a tiger?\nB: Yes, ( it is / they are ).",
          ["it is", "they are"],
          1
        ),
        mc(
          "6-10",
          10,
          I0b,
          "A: Are these your backpacks?\nB: No, ( it isn't / they aren't ).",
          ["it isn't", "they aren't"],
          2
        ),
        mc("11-12", 11, I1, "", ["You <u>aren't</u> short.", "He <u>aren't</u> handsome.", "I <u>amn't</u> pretty."], 1),
        mc(
          "11-12",
          12,
          I1,
          "",
          ["It <u>aren't</u> my ball.", "That <u>aren't</u> your book.", "They <u>aren't</u> kind."],
          3
        ),
        mc("13-15", 13, I2, "Are you strong?", ["Yes, you are.", "Yes, I am.", "Yes, he is."], 2),
        mc("13-15", 14, I2, "Are you doctors?", ["No, they aren't.", "No, you aren't.", "No, we aren't."], 3),
        mc("13-15", 15, I2, "Is she pretty?", ["No, he isn't.", "No, she isn't.", "No, it isn't."], 2),
        fill("16-17", 16, I3, "They <u>are not</u> delicious.", ["aren't", "arent"], { promptKo: "are not → 줄임말" }),
        fill("16-17", 17, I3, "She <u>is not</u> my aunt.", ["isn't", "isnt"], { promptKo: "is not → 줄임말" }),
        fill("18-20", 18, I4, "It ______ ______ his violin.", ["is|not"], {
          blanks: 2,
          promptKo: "그것은 그의 바이올린이 아니다.",
        }),
        fill("18-20", 19, I4, "______ ______ farmers?", ["Are|they"], {
          blanks: 2,
          promptKo: "그들은 농부이니?",
        }),
        fill("18-20", 20, I4, "Yes, ______ ______.", ["they|are"], {
          blanks: 2,
          promptKo: "A: Are these your gloves? B: 응, 그래.",
        }),
      ];
    })()
  )
);
