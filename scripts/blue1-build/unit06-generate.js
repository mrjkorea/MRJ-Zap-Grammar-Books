/* Generate data/blue1/unit06/*.json — run: node scripts/blue1-build/unit06-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue1/unit06");
const META = {
  bookId: "zap-blue-1",
  bookTitle: "ZAP Blue 1",
  appName: "BlueZap 1",
  unitId: "unit-06",
  unitTitle: "Unit 06 — 대명사 (2)",
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

function exItem(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function ul(s, phrase) {
  if (!phrase) return s;
  const low = s.toLowerCase();
  const p = phrase.toLowerCase();
  const idx = low.indexOf(p);
  if (idx < 0) return s;
  return s.slice(0, idx) + "<u>" + s.slice(idx, idx + phrase.length) + "</u>" + s.slice(idx + phrase.length);
}

function mcPair(id, section, label, promptEn, promptKo, a, b, correct, secInstr) {
  const choices = [a, b];
  const pick = correct === 0 ? a : b;
  return mcItem(id, section, label, promptEn, choices, [pick, String(correct + 1)], {
    sectionInstructionKo: secInstr,
    promptKo,
  });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  const graded = data.items.filter((it) => !it.displayOnly).length;
  console.log("wrote", name, graded, "graded");
}

function practiceBase(practiceId, title, subtitle, pages, timerMinutes, introKo) {
  return Object.assign({}, META, {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes,
    sectionsVersion: 2,
    introKo,
  });
}

// —— Lesson 01 Walk 1 (p. 135) ——
(function () {
  const dirA =
    "A 다음 명사를 대명사로 대신할 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 밑줄 친 부분을 대신할 수 있는 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const table = [
    ["Mike · 소유격 (①)", "his", "마이크 — 소유격"],
    ["Mike · 목적격 (②)", "him", "마이크 — 목적격"],
    ["my mother · 주격 (③)", "she", "my mother — 주격"],
    ["my mother · 목적격 (④)", "her", "my mother — 목적격"],
    ["your friends · 주격 (⑤)", "they", "your friends — 주격"],
    ["your friends · 목적격 (⑥)", "them", "your friends — 목적격"],
    ["the pen · 소유격 (⑦)", "its", "the pen — 소유격"],
    ["the pen · 목적격 (⑧)", "it", "the pen — 목적격"],
    ["the pens · 소유격 (⑨)", "their", "the pens — 소유격"],
    ["the pens · 목적격 (⑩)", "them", "the pens — 목적격"],
    ["his dog · 주격 (⑪)", "it", "his dog — 주격"],
    ["his dogs · 소유격 (⑫)", "their", "his dogs — 소유격"],
    ["his dogs · 목적격 (⑬)", "them", "his dogs — 목적격"],
  ];
  const items = table.map((row, i) =>
    fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), row[0], [row[1], row[1].toLowerCase()], {
      sectionInstructionKo: dirA,
      promptKo: row[2] || undefined,
    })
  );
  const bRows = [
    ["The man is handsome.", "그 남자는 잘생겼다.", "The man", "He", "She", 0],
    ["I know the girl.", "나는 그 여자아이를 안다.", "the girl", "she", "her", 1],
    ["I have a computer.", "나는 컴퓨터를 한 대 가지고 있다.", "a computer", "it", "its", 0],
    ["I help my neighbors.", "나는 내 이웃들을 도와준다.", "my neighbors", "their", "them", 1],
    ["I like the candies.", "나는 그 사탕을 좋아한다.", "the candies", "their", "them", 1],
  ];
  bRows.forEach((r, i) => {
    items.push(
      mcPair(
        "b" + String(i + 1).padStart(2, "0"),
        "B",
        String(i + 1),
        ul(r[0], r[2]),
        r[1],
        r[3],
        r[4],
        r[5],
        dirB
      )
    );
  });
  write(
    "lesson01-walk1.json",
    Object.assign(practiceBase("b1:u06:lesson01-walk1", "Lesson 01 Walk 1 — 명사와 대명사의 일치", "p. 135", "135", 10, "Section A 표 13칸, Section B 고르기 5문항입니다."), {
      sections: [
        sec("A", "Section A", dirA, "다음 명사를 대명사로 대신할 때 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 13, 0, table.map((_, i) => String(i + 1))),
        sec("B", "Section B", dirB, "다음 밑줄 친 부분을 대신할 수 있는 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 5, 0, ["1", "2", "3", "4", "5"]),
      ],
      items,
    })
  );
})();

// —— Lesson 01 Walk 2 (p. 137) ——
(function () {
  const dir =
    "A 다음 주어진 말을 대신할 수 있는 인칭대명사의 주격을 괄호 안에서 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const rows = [
    ["Mina and I", "미나와 나", "they", "we", 1],
    ["you and your brother", "너와 네 남동생", "we", "you", 1],
    ["Mom and Dad", "엄마와 아빠", "they", "you", 0],
    ["John and Julia", "존과 줄리아", "he", "they", 1],
    ["Jenny and I", "제니와 나", "we", "they", 0],
    ["she and her mother", "그녀와 그녀의 어머니", "they", "you", 0],
    ["you and Mike", "너와 마이크", "they", "you", 1],
    ["Jimin and her friends", "지민과 그녀의 친구들", "she", "they", 1],
    ["my father and I", "우리 아버지와 나", "we", "they", 0],
    ["he and his family", "그와 그의 가족", "he", "they", 1],
    ["you and the woman", "너와 그 여자", "you", "they", 0],
    ["the girls and I", "그 여자아이들과 나", "they", "we", 1],
    ["you and my sister", "너와 내 여동생", "you", "they", 0],
    ["your brother and I", "네 남동생과 나", "you", "we", 1],
  ];
  const items = rows.map((r, i) =>
    mcPair(
      "a" + String(i + 1).padStart(2, "0"),
      "A",
      String(i + 1),
      ul(r[0] + ".", r[0]),
      r[1],
      r[2],
      r[3],
      r[4],
      dir
    )
  );
  write(
    "lesson01-walk2.json",
    Object.assign(practiceBase("b1:u06:lesson01-walk2", "Lesson 01 Walk 2 — 명사와 대명사의 일치", "p. 137", "137", 10, "주어진 말을 주격 대명사로 바꾸는 고르기 14문항입니다."), {
      sections: [sec("A", "Section A", dir, "다음 주어진 말을 대신할 수 있는 인칭대명사의 주격을 괄호 안에서 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 0, rows.map((_, i) => String(i + 1)))],
      items,
    })
  );
})();

// —— Lesson 01 Run (pp. 138–139) ——
(function () {
  const dirA =
    "A 다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB =
    "B 다음 문장의 밑줄 친 부분을 대신할 수 있는 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aRows = [
    ["I have a sister. ( He / She ) is eight years old.", "나는 여동생이 한 명 있다. 그녀는 여덟 살이다.", "He", "She", 1, true],
    ["I eat a sandwich once a week. ( It / They ) is delicious.", "나는 일주일에 한 번 샌드위치를 먹는다. 그것은 맛있다.", "It", "They", 0],
    ["I have a doll. ( It / They ) is pretty.", "나는 인형 한 개를 가지고 있다. 그것은 예쁘다.", "It", "They", 0],
    ["They have a son. ( It / He ) is five years old.", "그들은 아들이 한 명 있다. 그는 다섯 살이다.", "It", "He", 1],
    ["I play baseball with my friends. ( He / They ) are boys.", "나는 내 친구들과 야구를 한다. 그들은 남자아이들이다.", "He", "They", 1],
    ["My sister's name is Julie. ( She / He ) is cute.", "내 여동생의 이름은 줄리이다. 그녀는 귀엽다.", "She", "He", 0],
    ["I have three balls. ( It / They ) are green.", "나는 공 세 개를 가지고 있다. 그것들은 초록색이다.", "It", "They", 1],
    ["I have two brothers. ( They / He ) are kind.", "나는 남자 형제가 두 명 있다. 그들은 친절하다.", "They", "He", 0],
    ["I know a man. ( He / His ) hair is brown.", "나는 한 남자를 안다. 그의 머리카락은 갈색이다.", "He", "His", 1],
    ["Look at the girl. ( She / Her ) cap is pretty.", "저 여자아이를 봐. 그녀의 모자가 예쁘다.", "She", "Her", 1],
    ["I eat bread every day. I like ( it / its ).", "나는 매일 빵을 먹는다. 나는 그것을 좋아한다.", "it", "its", 0],
    ["We have two dogs. We love ( they / them ).", "우리는 개 두 마리를 가지고 있다. 우리는 그것들을 대단히 좋아한다.", "they", "them", 1],
    ["My teacher is Mr. Brown. ( He / She ) is American.", "우리 선생님은 브라운 씨이다. 그는 미국인이다.", "He", "She", 0],
    ["I have a magazine. ( It / Its ) title is The Kids.", "나는 잡지 한 권을 가지고 있다. 그것의 제목은 『The Kids』이다.", "It", "Its", 1],
    ["Look at the man. I know ( his / him ).", "그 남자를 봐. 나는 그를 안다.", "his", "him", 1],
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = mcPair("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], r[1], r[2], r[3], r[4], dirA);
    items.push(r[5] ? exItem(base, r[3]) : base);
  });
  const bRows = [
    ["Tom and I are cousins.", "톰과 나는 사촌이다.", "Tom and I", "He", "We", 1],
    ["You and Susie are sisters.", "너와 수지는 자매이다.", "You and Susie", "We", "You", 1],
    ["She and Sam are students.", "그녀와 샘은 학생이다.", "She and Sam", "They", "We", 0],
    ["Dick and Jane are pilots.", "딕과 제인은 비행기 조종사이다.", "Dick and Jane", "He", "They", 1],
    ["My mom and I play the piano.", "우리 엄마와 나는 피아노를 친다.", "My mom and I", "We", "She", 0],
    ["He and James are tall.", "그와 제임스는 키가 크다.", "He and James", "You", "They", 1],
    ["Tom and I live in Seoul.", "톰과 나는 서울에 산다.", "Tom and I", "We", "They", 0],
    ["You and Sam are smart.", "너와 샘은 똑똑하다.", "You and Sam", "You", "They", 0],
    ["She and Mia have a cat.", "그녀와 미아는 고양이를 한 마리 가지고 있다.", "She and Mia", "You", "They", 1],
    ["Jack and Kate are friends.", "잭과 케이트는 친구이다.", "Jack and Kate", "You", "They", 1],
    ["He and his son like dogs.", "그와 그의 아들은 개를 좋아한다.", "He and his son", "They", "We", 0],
    ["She and I are teachers.", "그녀와 나는 선생님이다.", "She and I", "They", "We", 1],
    ["Tom and Nick love soccer.", "톰과 닉은 축구를 좋아한다.", "Tom and Nick", "He", "They", 1],
    ["You and your sister are nice.", "너와 네 여동생은 멋지다.", "You and your sister", "You", "They", 0],
    ["He and his brother are students.", "그와 그의 남동생은 학생이다.", "He and his brother", "They", "You", 0],
  ];
  bRows.forEach((r, i) => {
    items.push(mcPair("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), ul(r[0], r[2]), r[1], r[3], r[4], r[5], dirB));
  });
  write(
    "lesson01-run.json",
    Object.assign(practiceBase("b1:u06:lesson01-run", "Lesson 01 Run — 명사와 대명사의 일치", "pp. 138–139", "138–139", 20, "Section A·B 각 15문항 고르기입니다. A1은 예시(채점 없음)."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, aRows.slice(1).map((_, i) => String(i + 2))),
        sec("B", "Section B", dirB, "다음 문장의 밑줄 친 부분을 대신할 수 있는 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, bRows.map((_, i) => String(i + 1))),
      ],
      items,
    })
  );
})();

// —— Lesson 01 Jump (pp. 140–141) ——
(function () {
  const dirA =
    "A 다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 문장의 밑줄 친 부분을 대신할 수 있는 대명사를 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    ["I know a girl. _____ name is Sandara.", "나는 한 여자아이를 알고 있다. 그녀의 이름은 산다라이다.", "Her", true],
    ["I have a book. _____ is new.", "나는 책을 한 권 가지고 있다. 그것은 새것이다.", "It"],
    ["My sister is eight years old. _____ is a student.", "내 여동생은 여덟 살이다. 그녀는 학생이다.", "She"],
    ["I have a brother. I like _____.", "나는 남동생이 한 명 있다. 나는 그를 좋아한다.", "him"],
    ["My father is a firefighter. _____ is forty years old.", "우리 아버지는 소방관이시다. 그는 마흔 살이시다.", "He"],
    ["I like hamburgers. _____ are delicious.", "나는 햄버거를 좋아한다. 그것들은 맛있다.", "They"],
    ["I drink milk every day. I like _____.", "나는 매일 우유를 마신다. 나는 그것을 좋아한다.", "it"],
    ["Jack and Annie live together. _____ house is beautiful.", "잭과 애니는 함께 산다. 그들의 집은 아름답다.", "Their"],
    ["My music teacher is Ms. Kim. I like _____.", "우리 음악 선생님은 김 선생님이시다. 나는 그녀를 좋아한다.", "her"],
    ["I love my friends. _____ are girls.", "나는 내 친구들을 무척 좋아한다. 그들은 여자아이들이다.", "They"],
    ["I have an uncle. _____ name is Morgan.", "나는 삼촌이 한 분 계시다. 그의 이름은 모건이다.", "His"],
    ["We have a computer. We use _____ every day.", "우리는 컴퓨터를 한 대 가지고 있다. 우리는 그것을 매일 사용한다.", "it"],
    ["They visit Mr. Brown every month. _____ is a writer.", "그들은 매달 브라운 씨를 찾아간다. 그는 작가이다.", "He"],
    ["I read comic books. I like _____.", "나는 만화책을 읽는다. 나는 그것들을 좋아한다.", "them"],
    ["I have a puppy. _____ tail is short.", "나는 강아지를 한 마리 가지고 있다. 그것의 꼬리는 짧다.", "Its"],
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], [r[2], r[2].toLowerCase()], {
      sectionInstructionKo: dirA,
      promptKo: r[1],
    });
    items.push(r[2] && r[3] ? exItem(base, r[2]) : base);
  });
  const bPhrases = [
    "Minsu and I",
    "You and Jenny",
    "She and her husband",
    "John and Emily",
    "He and his family",
    "Michael and I",
    "Tom and his friends",
    "You and your sister",
    "Emily and her brother",
    "Chris and his brother",
    "Jennifer and I",
    "My mother and I",
    "She and her cousin",
    "Mr. Baker and his wife",
    "You and your brother",
  ];
  const bAns = ["We", "You", "They", "They", "They", "We", "They", "You", "They", "They", "We", "We", "They", "They", "You"];
  const bKo = [
    "민수와 나는 친구이다.",
    "너와 제니는 예쁘다.",
    "그녀와 그녀의 남편은 고양이를 좋아한다.",
    "존과 에밀리는 학생이다.",
    "그와 그의 가족은 함께 산다.",
    "마이클과 나는 급우이다.",
    "톰과 그의 친구들은 축구를 한다.",
    "너와 네 여동생은 키가 작다.",
    "에밀리와 그녀의 남동생은 키가 크다.",
    "크리스와 그의 남동생은 노래를 잘한다.",
    "제니퍼와 나는 함께 학교에 간다.",
    "우리 어머니와 나는 개를 좋아한다.",
    "그녀와 그녀의 사촌은 열 살이다.",
    "베이커 씨와 그의 아내는 친절하다.",
    "너와 네 남동생은 똑똑하다.",
  ];
  bPhrases.forEach((ph, i) => {
    items.push(
      fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), ul(ph + " are friends.", ph), [bAns[i], bAns[i].toLowerCase()], {
        sectionInstructionKo: dirB,
        promptKo: bKo[i],
        extra: { promptEn: ul(ph + " …", ph) },
      })
    );
  });
  // fix B prompts to match book sentences
  const bSent = [
    "Minsu and I are friends.",
    "You and Jenny are pretty.",
    "She and her husband like cats.",
    "John and Emily are students.",
    "He and his family live together.",
    "Michael and I are classmates.",
    "Tom and his friends play soccer.",
    "You and your sister are short.",
    "Emily and her brother are tall.",
    "Chris and his brother sing well.",
    "Jennifer and I go to school together.",
    "My mother and I like dogs.",
    "She and her cousin are ten years old.",
    "Mr. Baker and his wife are kind.",
    "You and your brother are smart.",
  ];
  for (let i = 0; i < 15; i++) {
    const it = items[15 + i];
    it.promptEn = ul(bSent[i], bPhrases[i]);
  }
  write(
    "lesson01-jump.json",
    Object.assign(practiceBase("b1:u06:lesson01-jump", "Lesson 01 Jump — 명사와 대명사의 일치", "pp. 140–141", "140–141", 24, "Section A 빈칸 15(1예시), Section B 밑줄→대명사 15문항."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, aRows.slice(1).map((_, i) => String(i + 2))),
        sec("B", "Section B", dirB, "다음 문장의 밑줄 친 부분을 대신할 수 있는 대명사를 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 15, 0, bPhrases.map((_, i) => String(i + 1))),
      ],
      items,
    })
  );
})();

// —— Lesson 01 Fly (pp. 142–143) ——
(function () {
  const dirA =
    "A 다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 문장의 빈칸에 알맞은 대명사를 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    ["I have a bag. <u>They</u> is big.", "It", true],
    ["I have two bags. <u>They</u> color is black.", "Their"],
    ["I have a sister. <u>Her</u> is pretty.", "She"],
    ["I play with my friends. <u>He</u> are nice.", "They"],
    ["We have a table. <u>Its</u> is big.", "It"],
    ["I have an uncle. <u>Him</u> name is Paul.", "His"],
    ["I have shoes. <u>It</u> are new.", "They"],
    ["Mr. Kim is a doctor. I visit <u>he</u> every week.", "him"],
    ["I have a sister. <u>She</u> hair is brown.", "Her"],
    ["The book is funny. I know <u>its</u>.", "it"],
    ["We eat sandwiches. <u>Them</u> are delicious.", "They"],
    ["Sandy and I are girls. <u>You</u> are students.", "We"],
    ["You and your brother are tall. <u>We</u> are nice.", "You"],
    ["She and Amy are classmates. I like <u>her</u>.", "them"],
    ["John and Jenny live together. <u>We</u> are friends.", "They"],
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], [r[1], r[1].toLowerCase()], { sectionInstructionKo: dirA });
    items.push(r[2] ? exItem(base, r[1]) : base);
  });
  const bRows = [
    ["I have a doll. _____ is pretty.", "It", "나는 인형 한 개를 가지고 있다. 그것은 예쁘다."],
    ["We have two dogs. We love _____.", "them", "우리는 개 두 마리를 가지고 있다. 우리는 그것들을 좋아한다."],
    ["They have a niece. _____ name is Heidi.", "Her", "그들은 조카딸이 있다. 그녀의 이름은 하이다이다."],
    ["Emily is kind. We like _____.", "her", "에밀리는 친절하다. 우리는 그녀를 좋아한다."],
    ["My math teacher is Mr. Kim. _____ is handsome.", "He", "우리 수학 선생님은 김 선생님이다. 그는 잘생겼다."],
    ["Mr. Draft's nephew is two years old. _____ feet are small.", "His", "드래프트 씨의 조카는 두 살이다. 그의 발은 작다."],
    ["I have the book. _____ is interesting.", "It", "나는 그 책을 가지고 있다. 그것은 재미있다."],
    ["I know a girl. _____ eyes are blue.", "Her", "나는 한 여자아이를 안다. 그녀의 눈은 파랗다."],
    ["We have two birds. We like _____.", "them", "우리는 새 두 마리를 가지고 있다. 우리는 그것들을 좋아한다."],
    ["Minho and I are brothers. _____ go to school together.", "We", "민호와 나는 형제이다. 우리는 함께 학교에 간다."],
    ["I like you and Jimmy. _____ are my friends.", "You", "나는 너와 지미를 좋아한다. 너희는 내 친구이다."],
    ["She and Emily are classmates. _____ study together.", "They", "그녀와 에밀리는 급우이다. 그들은 함께 공부한다."],
    ["Dick and Jane play together. _____ are cousins.", "They", "딕과 제인은 함께 놀다. 그들은 사촌이다."],
    ["I have a sister and a brother. _____ are nice.", "They", "나는 여동생과 남동생이 있다. 그들은 착하다."],
    ["Jun and I play soccer every Saturday. _____ like soccer.", "We", "준과 나는 매주 토요일 축구를 한다. 우리는 축구를 좋아한다."],
  ];
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], [r[1], r[1].toLowerCase()], {
        sectionInstructionKo: dirB,
        promptKo: r[2],
      })
    );
  });
  write(
    "lesson01-fly.json",
    Object.assign(practiceBase("b1:u06:lesson01-fly", "Lesson 01 Fly — 명사와 대명사의 일치", "pp. 142–143", "142–143", 26, "Section A 고치기 15(1예시), Section B 빈칸 15문항."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, aRows.slice(1).map((_, i) => String(i + 2))),
        sec("B", "Section B", dirB, "다음 문장의 빈칸에 알맞은 대명사를 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 15, 0, bRows.map((_, i) => String(i + 1))),
      ],
      items,
    })
  );
})();

// —— Lesson 02 Walk 1 (p. 145) ——
(function () {
  const dirA =
    "A 다음 문장에서 지시대명사 또는 지시형용사를 찾아 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 문장의 밑줄 친 말이 지시대명사이면 P, 지시형용사이면 A를 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aS = [
    ["This is a penguin.", "이것은 펭귄이다.", "This", true],
    ["That is a horse.", "저것은 말이다.", "That"],
    ["This cat is quiet.", "이 고양이는 조용하다.", "This"],
    ["I like this girl.", "나는 이 여자아이를 좋아한다.", "this"],
    ["I know that lady.", "나는 저 숙녀를 안다.", "that"],
  ];
  const items = aS.map((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], [r[2], r[2].toLowerCase()], {
      sectionInstructionKo: dirA,
      promptKo: r[1],
    });
    return r[3] ? exItem(base, r[2]) : base;
  });
  const bS = [
    ["<u>This</u> is a notebook.", "P", true],
    ["<u>This</u> book is interesting.", "A"],
    ["<u>That</u> is my computer.", "P"],
    ["<u>That</u> man is gentle.", "A"],
    ["<u>This</u> is my grandfather.", "P"],
  ];
  bS.forEach((r, i) => {
    const base = fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], [r[1], r[1].toLowerCase()], { sectionInstructionKo: dirB });
    items.push(r[2] ? exItem(base, r[1]) : base);
  });
  write(
    "lesson02-walk1.json",
    Object.assign(practiceBase("b1:u06:lesson02-walk1", "Lesson 02 Walk 1 — 지시대명사", "p. 145", "145", 10, "지시대명사/지시형용사 찾기·P/A 구분."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장에서 지시대명사 또는 지시형용사를 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["2", "3", "4", "5"]),
        sec("B", "Section B", dirB, "다음 문장의 밑줄 친 말이 지시대명사이면 P, 지시형용사이면 A를 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["2", "3", "4", "5"]),
      ],
      items,
    })
  );
})();

// —— Lesson 02 Walk 2 (p. 147) ——
(function () {
  const dirA =
    "A 다음 문장에서 지시대명사 또는 지시형용사를 찾아 동그라미 하세요. 동그라미 친 말만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 말을 복수형으로 바꾸어 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aS = [
    ["These are my brothers.", "이것들은 내 형제들이다.", "These", true],
    ["Those are my hats.", "저것들은 내 모자들이다.", "Those"],
    ["These shoes are mine.", "이 신발들은 내 것이다.", "These"],
    ["Those boys are lazy.", "저 남자아이들은 게으르다.", "Those"],
    ["I want these toys.", "나는 이 장난감들을 원한다.", "these"],
  ];
  const items = aS.map((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], [r[2], r[2].toLowerCase()], {
      sectionInstructionKo: dirA,
      promptKo: r[1],
    });
    return r[3] ? exItem(base, r[2]) : base;
  });
  const bS = [
    ["this", "these", "this → 복수형", true],
    ["that", "those", "that → 복수형"],
    ["this girl", "these girls", "this girl → 복수형"],
    ["that house", "those houses", "that house → 복수형"],
    ["that student", "those students", "that student → 복수형"],
  ];
  bS.forEach((r, i) => {
    const base = fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], [r[1]], {
      sectionInstructionKo: dirB,
      promptKo: r[2],
    });
    items.push(r[3] ? exItem(base, r[1]) : base);
  });
  write(
    "lesson02-walk2.json",
    Object.assign(practiceBase("b1:u06:lesson02-walk2", "Lesson 02 Walk 2 — 지시대명사", "p. 147", "147", 10, "these/those 찾기·복수형 바꾸기."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장에서 지시대명사 또는 지시형용사를 찾아 동그라미 하세요.", "동그라미 친 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["2", "3", "4", "5"]),
        sec("B", "Section B", dirB, "다음 말을 복수형으로 바꾸어 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["2", "3", "4", "5"]),
      ],
      items,
    })
  );
})();

// —— Lesson 02 Run (pp. 148–149) ——
(function () {
  const dirA =
    "A 다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB =
    "B 다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const aRows = [
    ["( This / That ) is my house.", "이것은 우리 집이다.", "This", "That", 0],
    ["( That / Those ) is my bag.", "저것은 내 가방이다.", "That", "Those", 0],
    ["( This / These ) is our tree.", "이것은 우리 나무이다.", "This", "These", 0],
    ["( This / That ) cat is small.", "저 고양이는 작다.", "This", "That", 1],
    ["( That / Those ) are my books.", "저것들은 내 책이다.", "That", "Those", 1],
    ["( This / These ) are her dogs.", "이것들은 그녀의 개이다.", "This", "These", 1],
    ["I love ( this / these ) books.", "나는 이 책들을 무척 좋아한다.", "this", "these", 1],
    ["I like ( this / these ) color.", "나는 이 색을 좋아한다.", "this", "these", 0],
    ["( These / That ) are his pictures.", "이것들은 그의 그림이다.", "These", "That", 0],
    ["( That / Those ) is my pencil case.", "저것은 내 필통이다.", "That", "Those", 0],
    ["They live in ( this / that ) city.", "그들은 이 도시에 산다.", "this", "that", 0],
    ["( These / Those ) buildings are old.", "저 건물들은 오래되었다.", "These", "Those", 1],
    ["I like ( this / that ) song.", "나는 저 노래를 좋아한다.", "this", "that", 1],
    ["( This / That ) is beautiful.", "이것은 아름답다.", "This", "That", 0],
    ["( These / Those ) are Merlin's shoes.", "저것들은 멀린의 신발이다.", "These", "Those", 1],
  ];
  const items = aRows.map((r, i) => mcPair("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], r[1], r[2], r[3], r[4], dirA));
  const bRows = [
    ["_____ is a dog.", "이것은 개이다.", "This", "These", 0],
    ["_____ is a rabbit.", "저것은 토끼이다.", "That", "Those", 0],
    ["_____ are my books.", "이것들은 내 책이다.", "This", "These", 1],
    ["_____ are my friends.", "저것들은 내 친구들이다.", "That", "Those", 1],
    ["_____ is her cup.", "이것은 그녀의 컵이다.", "This", "These", 0],
    ["I know _____ boy.", "나는 저 남자아이를 안다.", "it", "that", 1],
    ["_____ are my aunts.", "저것들은 내 고모·이모들이다.", "Those", "That", 0],
    ["_____ is Mark.", "저 아이는 마크이다.", "That", "Those", 0],
    ["They play with _____ girl.", "그들은 저 여자아이와 놀다.", "that", "she", 0],
    ["I like _____ dishes.", "나는 이 접시들을 좋아한다.", "this", "these", 1],
    ["I want _____ dolls.", "나는 저 인형들을 원한다.", "that", "those", 1],
    ["_____ movie is funny.", "이 영화는 웃기다.", "This", "It", 0],
    ["_____ cats are gentle.", "이 고양이들은 온순하다.", "These", "They", 0],
    ["I play soccer with _____ boys.", "나는 저 남자아이들과 축구를 한다.", "that", "those", 1],
    ["Look at _____ photos.", "이 사진들을 봐.", "this", "these", 1],
  ];
  bRows.forEach((r, i) => {
    items.push(mcPair("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], r[1], r[2], r[3], r[4], dirB));
  });
  write(
    "lesson02-run.json",
    Object.assign(practiceBase("b1:u06:lesson02-run", "Lesson 02 Run — 지시대명사", "pp. 148–149", "148–149", 20, "this/that/these/those 고르기 30문항."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, aRows.map((_, i) => String(i + 1))),
        sec("B", "Section B", dirB, "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, bRows.map((_, i) => String(i + 1))),
      ],
      items,
    })
  );
})();

// —— Lesson 02 Jump (pp. 150–151) ——
(function () {
  const dirA =
    "A 다음 문장의 빈칸에 this, that, these, those 중 알맞은 말을 골라 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    ["_____ is an animal.", "이것은 동물이다.", "This", true],
    ["_____ are my pencils.", "이것들은 내 연필이다.", "These"],
    ["_____ notebook is mine.", "저 공책은 내 것이다.", "That"],
    ["_____ is my brother.", "이 아이는 내 남동생이다.", "This"],
    ["I like _____ singer.", "나는 저 가수를 좋아한다.", "that"],
    ["They know _____ women.", "그들은 이 여자들을 안다.", "these"],
    ["Look at _____ girls.", "저 여자아이들을 봐.", "those"],
    ["_____ is your pen.", "저것은 네 펜이다.", "That"],
    ["_____ are my caps.", "저것들은 내 모자이다.", "Those"],
    ["_____ are Mr. Taylor's students.", "저 아이들은 테일러 씨의 학생이다.", "Those"],
    ["I like _____ movie.", "나는 이 영화를 좋아한다.", "this"],
    ["We know _____ boys.", "우리는 저 남자아이들을 안다.", "those"],
    ["Listen to _____ song.", "이 노래를 들어 봐.", "this"],
    ["_____ is their house.", "저것은 그들의 집이다.", "That"],
    ["_____ are her clothes.", "이것들은 그녀의 옷이다.", "These"],
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], [r[2], r[2].toLowerCase()], {
      sectionInstructionKo: dirA,
      promptKo: r[1],
    });
    items.push(r[3] ? exItem(base, r[2]) : base);
  });
  const bRows = [
    ["<u>This</u> is my sister.", ["이것", "이 사람", "이 아이"], true],
    ["<u>That</u> is my guitar.", ["저것", "그것"]],
    ["<u>This book</u> is interesting.", ["이 책"]],
    ["<u>These</u> are my notebooks.", ["이것들"]],
    ["I live in <u>that house</u>.", ["저 집", "그 집"]],
    ["<u>Those</u> are our dogs.", ["저것들", "그것들"]],
    ["I like <u>this fruit</u>.", ["이 과일", "이 과일을"]],
    ["<u>This</u> is a bridge.", ["이것"]],
    ["Look at <u>that mountain</u>.", ["저 산", "그 산"]],
    ["<u>Those</u> are my watches.", ["저것들"]],
    ["<u>Those penguins</u> are short.", ["저 펭귄들"]],
    ["<u>That</u> is a park.", ["저것"]],
    ["I know <u>those girls</u>.", ["저 여자아이들", "그 여자아이들"]],
    ["<u>These</u> are Emily's bags.", ["이것들"]],
    ["I like <u>these pictures</u>.", ["이 그림들"]],
  ];
  bRows.forEach((r, i) => {
    const base = fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], r[1], {
      sectionInstructionKo: dirB,
      answerMode: "words",
    });
    items.push(r[2] ? exItem(base, r[1][0]) : base);
  });
  write(
    "lesson02-jump.json",
    Object.assign(practiceBase("b1:u06:lesson02-jump", "Lesson 02 Jump — 지시대명사", "pp. 150–151", "150–151", 24, "영어 빈칸 15(1예시), 밑줄 우리말 15(1예시)."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 빈칸에 this, that, these, those 중 알맞은 말을 골라 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, aRows.slice(1).map((_, i) => String(i + 2))),
        sec("B", "Section B", dirB, "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, bRows.slice(1).map((_, i) => String(i + 2))),
      ],
      items,
    })
  );
})();

// —— Lesson 02 Fly (pp. 152–153) ——
(function lesson02Fly() {
  const dirA =
    "A 다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB =
    "B 다음 문장의 빈칸에 알맞은 지시대명사나 지시형용사를 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aData = [
    ["I like <u>those</u> song.", ["that"], true],
    ["<u>That</u> are your photos.", ["Those"]],
    ["<u>This</u> are my books.", ["These"]],
    ["<u>These</u> flower is pretty.", ["This"]],
    ["Listen to <u>that</u> music.", ["this"]],
    ["<u>Those</u> is my sister.", ["This"]],
    ["<u>That</u> baby rabbit is cute.", ["This"]],
    ["<u>These</u> are my friends.", ["Those"]],
    ["<u>These</u> child is nice.", ["This"]],
    ["I like <u>those</u> animal.", ["those animals", "Those animals"]],
    ["They know <u>this</u> girls.", ["this girl", "This girl"]],
    ["<u>That</u> is Judy's doll.", ["This"]],
    ["<u>Those</u> is my cousin.", ["That"]],
    ["<u>Those</u> tree are green.", ["Those trees", "those trees"]],
    ["<u>These</u> shoe are mine.", ["This shoe", "This", "this shoe", "this"]],
  ];
  const items = aData.map((r, i) => {
    const base = fillItem("a" + String(i + 1).padStart(2, "0"), "A", String(i + 1), r[0], r[1], { sectionInstructionKo: dirA });
    return r[2] ? exItem(base, r[1][0]) : base;
  });
  const bData = [
    ["<u>This</u> is a horse.", "This", true],
    ["_____ are my bags.", "Those"],
    ["_____ cookies are yummy.", "These"],
    ["_____ shoes are my brother's.", "Those"],
    ["I like _____ actor.", "that"],
    ["We like _____ food.", "this"],
    ["_____ is my father.", "That"],
    ["_____ is very funny.", "This"],
    ["I know _____ students.", "those"],
    ["They live in _____ building.", "that"],
    ["_____ are his toys.", "These"],
    ["_____ is a carrot.", "That"],
    ["_____ houses are great.", "Those"],
    ["_____ girls are kind.", "These"],
    ["_____ are my classmates.", "Those"],
  ];
  const bKo = [
    "이것은 말이다.",
    "저것들은 내 가방이다.",
    "이 쿠키들은 맛있다.",
    "저 신발은 우리 형의 것이다.",
    "나는 저 배우를 좋아한다.",
    "우리는 이 음식을 좋아한다.",
    "저분은 우리 아버지시다.",
    "이것은 무척 웃기다.",
    "나는 저 학생들을 안다.",
    "그들은 저 건물에 산다.",
    "이것들은 그의 장난감이다.",
    "저것은 당근이다.",
    "저 집들은 정말 좋다.",
    "이 여자아이들은 친절하다.",
    "저 아이들은 우리 반 친구들이다.",
  ];
  bData.forEach((r, i) => {
    const base = fillItem("b" + String(i + 1).padStart(2, "0"), "B", String(i + 1), r[0], [r[1], r[1].toLowerCase()], {
      sectionInstructionKo: dirB,
      promptKo: bKo[i],
    });
    items.push(r[2] ? exItem(base, r[1]) : base);
  });
  write(
    "lesson02-fly.json",
    Object.assign(practiceBase("b1:u06:lesson02-fly", "Lesson 02 Fly — 지시대명사", "pp. 152–153", "152–153", 26, "고치기·빈칸 각 15(1예시)."), {
      sections: [
        sec("A", "Section A", dirA, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, aData.slice(1).map((_, i) => String(i + 2))),
        sec("B", "Section B", dirB, "다음 문장의 빈칸에 알맞은 지시대명사나 지시형용사를 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, bData.slice(1).map((_, i) => String(i + 2))),
      ],
      items,
    })
  );
})();

// —— Review 06 (pp. 154–156) ——
(function () {
  const intro =
    "Review 06은 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.";
  const items = [];
  const mcWrong = (id, sec, label, instr, choices, accept, promptEn) =>
    mcItem(id, sec, label, promptEn || "Choose the incorrect sentence.", choices, accept, {
      sectionInstructionKo: instr,
      answerMode: "choice",
    });

  const i12 = "[1–2] 다음 중 밑줄 친 부분이 잘못된 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcWrong(
      "q01",
      "1-2",
      "1",
      i12,
      [
        "This is my cap. I like <u>it</u>.",
        "I have a sister. <u>Her</u> name is Hosu.",
        "Paul is my friend. I like <u>him</u>.",
        "My teacher is Mr. Brown. <u>Him</u> is from Canada.",
      ],
      ["My teacher is Mr. Brown. <u>Him</u> is from Canada.", "4"]
    ),
    mcWrong("q02", "1-2", "2", i12, [
      "<u>This</u> is my room.",
      "<u>That</u> are my shoes.",
      "<u>These</u> are my mother's flowers.",
      "<u>Those</u> are my sister's books.",
    ], ["<u>That</u> are my shoes.", "2"])
  );

  const i35 =
    "[3–5] 다음 밑줄 친 부분을 대명사로 바꿀 때 알맞은 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  [
    ["<u>Jennifer and I</u> go to school together.", ["She", "We", "They", "You"], "We", "2"],
    ["<u>You and your sister</u> are very smart.", ["They", "He", "We", "You"], "You", "4"],
    ["<u>Minho and his brother</u> are tall.", ["He", "They", "You", "We"], "They", "2"],
  ].forEach((r, i) => {
    items.push(
      mcItem("q" + String(i + 3).padStart(2, "0"), "3-5", String(i + 3), r[0], r[1], [r[2], r[3]], {
        sectionInstructionKo: i35,
        promptKo: ["제니퍼와 나는 함께 학교에 간다.", "너와 네 여동생은 매우 똑똑하다.", "민호와 그의 남동생은 키가 크다."][i],
      })
    );
  });

  const i67 =
    "[6–7] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcItem("q06", "6-7", "6", "I know a girl. _____ eyes are blue.", ["She", "His", "Her", "Him"], ["Her", "3"], {
      sectionInstructionKo: i67,
      promptKo: "나는 한 여자아이를 안다. 그녀의 눈은 파랗다.",
    }),
    mcItem("q07", "6-7", "7", "I like eggs. I eat _____ every day.", ["they", "its", "their", "them"], ["them", "4"], {
      sectionInstructionKo: i67,
      promptKo: "나는 달걀을 좋아한다. 나는 매일 그것들을 먹는다.",
    })
  );

  const i810 =
    "[8–10] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  [
    ["They play baseball at ( this / these ) park.", "그들은 이 공원에서 야구를 한다.", "this", "1"],
    ["This is my friend. I like ( he / him ).", "이 아이는 내 친구다. 나는 그를 좋아한다.", "him", "2"],
    ["( These / Those ) books are my father's.", "저 책들은 우리 아버지의 것이다.", "Those", "2"],
  ].forEach((r, i) => {
    const choices = r[0].match(/\(\s*([^/)]+)\s*\/\s*([^)]+)\s*\)/);
    const c = choices ? [choices[1].trim(), choices[2].trim()] : [];
    items.push(
      mcItem("q" + String(i + 8).padStart(2, "0"), "8-10", String(i + 8), r[0], c, [r[2], r[3]], {
        sectionInstructionKo: i810,
        promptKo: r[1],
      })
    );
  });

  const i1112 = "[11–12] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  items.push(
    mcWrong("q11", "11-12", "11", i1112, ["This bed is mine.", "Those juice is delicious.", "That man is my teacher.", "I know that boy."], [
      "Those juice is delicious.",
      "2",
    ]),
    mcWrong("q12", "11-12", "12", i1112, ["I like this music.", "Look at that dog.", "These bags are mine.", "That shoes are pretty."], [
      "That shoes are pretty.",
      "4",
    ])
  );

  const i1315 =
    "[13–15] 다음 우리말 뜻과 같도록 this, that, these, those 중 알맞은 말을 골라 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q13", "13-15", "13", "I know _____ girl.", ["that", "That"], {
      sectionInstructionKo: i1315,
      promptKo: "나는 저 여자아이를 안다.",
    }),
    fillItem("q14", "13-15", "14", "Look at _____ photos.", ["these", "These"], {
      sectionInstructionKo: i1315,
      promptKo: "이 사진들을 봐.",
    }),
    fillItem("q15", "13-15", "15", "_____ are Peter's classmates.", ["Those", "those"], {
      sectionInstructionKo: i1315,
      promptKo: "저 아이들은 피터네 반 아이들이다.",
    })
  );

  const i16 =
    "16 다음 문장의 밑줄 친 부분을 대명사로 바꿔 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem("q16", "16", "16", ul("Tim and I are friends.", "Tim and I"), ["We are friends.", "We are friends"], {
      sectionInstructionKo: i16,
      answerMode: "sentence",
      type: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptKo: "팀과 나는 친구이다.",
    })
  );

  const i1718 = "[17–18] 다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  items.push(
    fillItem("q17", "17-18", "17", "I know the boy. _____ father is a doctor.", ["His", "his"], {
      sectionInstructionKo: i1718,
      promptKo: "나는 그 남자아이를 안다. 그의 아버지는 의사이다.",
    }),
    fillItem("q18", "17-18", "18", "I play with Sarah every day. I like _____.", ["her", "Her"], {
      sectionInstructionKo: i1718,
      promptKo: "나는 매일 사라와 논다. 나는 그녀를 좋아한다.",
    })
  );

  const i1920 =
    "[19–20] 다음 우리말 뜻과 같도록 괄호 안에 주어진 단어들을 사용하여 문장을 완성하세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem(
      "q19",
      "19-20",
      "19",
      "_____ have a book. _____ is interesting. ( it / I )",
      ["I|It", "I have a book. It is interesting."],
      {
        sectionInstructionKo: i1920,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        blanks: 2,
        promptKo: "나는 책이 한 권 있다. 그것은 재미있다.",
      }
    ),
    fillItem(
      "q20",
      "19-20",
      "20",
      "_____ chair is new. I love _____. ( this / it )",
      ["This|it", "This chair is new. I love it."],
      {
        sectionInstructionKo: i1920,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        blanks: 2,
        promptKo: "이 의자는 새것이다. 나는 그것이 무척 마음에 든다.",
      }
    )
  );

  write(
    "review-06.json",
    Object.assign(practiceBase("b1:u06:review06", "Review 06", "pp. 154–156", "154–156", 30, intro), {
      sections: [
        sec("1-2", "[1–2]", i12, "다음 중 밑줄 친 부분이 잘못된 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
        sec("3-5", "[3–5]", i35, "다음 밑줄 친 부분을 대명사로 바꿀 때 알맞은 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["3", "4", "5"]),
        sec("6-7", "[6–7]", i67, "다음 문장의 빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["6", "7"]),
        sec("8-10", "[8–10]", i810, "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 3, 0, ["8", "9", "10"]),
        sec("11-12", "[11–12]", i1112, "다음 중 잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
        sec("13-15", "[13–15]", i1315, "다음 우리말 뜻과 같도록 this, that, these, those 중 알맞은 말을 골라 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["13", "14", "15"]),
        sec("16", "16", i16, "다음 문장의 밑줄 친 부분을 대명사로 바꿔 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 1, 0, ["16"]),
        sec("17-18", "[17–18]", i1718, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["17", "18"]),
        sec("19-20", "[19–20]", i1920, "다음 우리말 뜻과 같도록 괄호 안에 주어진 단어들을 사용하여 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
      ],
      items,
    })
  );
})();
