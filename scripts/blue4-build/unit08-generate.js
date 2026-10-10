/* One-off generator for BlueZap 4 Unit 08 — run: node scripts/blue4-build/unit08-generate.js */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue4/unit08");
const META = {
  bookId: "zap-blue-4",
  bookTitle: "ZAP Blue 4",
  appName: "BlueZap 4",
  unitId: "unit-08",
  unitTitle: "Unit 08 — 여러 가지 동사",
  sectionsVersion: 2,
};

function base(pid, title, subtitle, pages, timerMinutes, extra = {}) {
  return {
    practiceId: pid,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    ...extra,
  };
}

function sec(id, title, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  const instructionKo = directionKo + " " + ruleKo;
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

function item(fields) {
  return fields;
}

function fill(
  id,
  label,
  section,
  sectionInstructionKo,
  answerMode,
  tag,
  promptEn,
  accept,
  opts = {}
) {
  return item({
    id,
    label,
    section: section.id,
    sectionTitle: section.title,
    sectionInstructionKo,
    answerMode,
    answerModeTag: tag,
    type: "fill",
    promptEn,
    accept,
    blanks: opts.blanks || 1,
    unordered: opts.unordered || false,
    promptKo: opts.promptKo,
    example: opts.example,
    displayOnly: opts.displayOnly,
    exampleAnswer: opts.exampleAnswer,
  });
}

function mc(id, label, section, sectionInstructionKo, answerMode, tag, promptEn, choices, accept, opts = {}) {
  return item({
    id,
    label,
    section: section.id,
    sectionTitle: section.title,
    sectionInstructionKo,
    answerMode,
    answerModeTag: tag,
    type: "mc",
    promptEn,
    choices,
    accept,
    promptKo: opts.promptKo,
    example: opts.example,
    displayOnly: opts.displayOnly,
    exampleAnswer: opts.exampleAnswer,
  });
}

function sentence(id, label, section, sectionInstructionKo, answerMode, tag, promptEn, accept, opts = {}) {
  return item({
    id,
    label,
    section: section.id,
    sectionTitle: section.title,
    sectionInstructionKo,
    answerMode,
    answerModeTag: tag,
    type: "sentence",
    promptEn,
    accept,
    promptKo: opts.promptKo,
    example: opts.example,
    displayOnly: opts.displayOnly,
    exampleAnswer: opts.exampleAnswer,
  });
}

function write(name, data) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
}

// ——— lesson01-walk1 ———
(function walk1() {
  const dirA =
    "다음 문장에서 동사를 찾아 동그라미 한 후, 간접목적어를 찾아 밑줄을 치고, 직접목적어를 찾아 물결 표시를 하세요.";
  const ruleA =
    "첫 칸에는 동사, 둘째 칸에는 간접목적어, 셋째 칸에는 직접목적어를 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 11, 1, [
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
  ]);
  const insA = sectionA.instructionKo;
  const rows = [
    ["Tom gave me chocolate.", "gave|me|chocolate", true],
    ["Rebecca sent them postcards.", "sent|them|postcards"],
    ["Jay brought his sister an umbrella.", "brought|his sister|an umbrella"],
    ["My father sometimes made us pizza.", "made|us|pizza"],
    ["Grandpa often tells us wonderful stories.", "tells|us|wonderful stories"],
    ["She sometimes writes Jane a letter.", "writes|Jane|a letter"],
    ["Mr. Park teaches us music.", "teaches|us|music"],
    ["My mother bought me new sneakers.", "bought|me|new sneakers"],
    ["He showed Dan his gloves.", "showed|Dan|his gloves"],
    ["Annie asked him his e-mail address.", "asked|him|his e-mail address", , "asked|him|his email address"],
    ["I passed Sandy a ball.", "passed|Sandy|a ball"],
    ["My uncle read her fairy tales.", "read|her|fairy tales"],
  ];
  const items = [];
  let n = 1;
  for (const row of rows) {
    const [sent, acc, ex, acc2] = row;
    const label = "A" + n;
    const id = "a" + String(n).padStart(2, "0");
    const accept = acc2 ? [acc, acc2] : [acc];
    const prompt = sent + "\n[동사] _____   [간접목적어] _____   [직접목적어] _____";
    if (ex) {
      items.push(
        fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt, accept, {
          blanks: 3,
          example: true,
          displayOnly: true,
          exampleAnswer: accept[0].replace(/\|/g, " / "),
        })
      );
    } else {
      items.push(fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt, accept, { blanks: 3 }));
    }
    n++;
  }
  write(
    "lesson01-walk1.json",
    base(
      "b4:u08:lesson01-walk1",
      "Lesson 01 Walk 1 — 수여동사와 감각동사",
      "간접·직접목적어 · p. 193",
      "193",
      10,
      {
        introKo:
          "Section A 12문항(동사·간접목적어·직접목적어). 책에서는 동그라미·밑줄·물결 표시를 하지만, 여기서는 세 칸에 순서대로 씁니다. 회색 예시는 채점하지 않아요.",
        sections: [sectionA],
        items,
      }
    )
  );
})();

// ——— lesson01-walk2 ———
(function walk2() {
  const dirA =
    "다음 문장에서 동사를 찾아 동그라미 하고 「전치사+목적어」를 찾아 밑줄을 치세요.";
  const ruleA = "첫 칸에는 동사, 둘째 칸에는 전치사+목적어(한 덩어리)를 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const insA = sectionA.instructionKo;
  const aRows = [
    ["John wrote a letter to her.", "wrote|to her", true],
    ["Dad gave some flowers to Mom.", "gave|to Mom"],
    ["Mom bought a watch for me.", "bought|for me"],
    ["She made a pie for John.", "made|for John"],
    ["They asked some questions of me.", "asked|of me"],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const [sent, acc, ex] = row;
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const prompt = sent + "\n[동사] _____   [전치사+목적어] _____";
    const opts = { blanks: 2 };
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acc.replace("|", " / ");
    }
    items.push(fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt, [acc], opts));
  });

  const dirB = "다음 두 문장의 뜻이 같도록 알맞은 말을 골라 빈칸에 쓰세요.";
  const ruleB = "알맞은 말을 골라 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionB = sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]);
  const insB = sectionB.instructionKo;
  const bRows = [
    ["I sent Mike some books.\nI sent some books _____ Mike.", "to", true],
    ["She bought her son a shirt.\nShe bought a shirt _____ her son.", "for"],
    ["He asked the students their names.\nHe asked their names _____ the students.", "of"],
    ["Ms. Brown showed me the album.\nMs. Brown showed the album _____ me.", "to"],
    ["My mom made us cake.\nMy mom made cake _____ us.", "for"],
  ];
  bRows.forEach((row, i) => {
    const [prompt, acc, ex] = row;
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const opts = {};
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acc;
    }
    items.push(fill(id, label, sectionB, insB, "words", "Words · 빈칸 말만", prompt, [acc], opts));
  });

  write(
    "lesson01-walk2.json",
    base(
      "b4:u08:lesson01-walk2",
      "Lesson 01 Walk 2 — 수여동사와 감각동사",
      "전치사 to/for/of · p. 195",
      "195",
      10,
      {
        introKo: "Section A 5문항, Section B 5문항. Section B는 to / for / of 중에서 골라 씁니다.",
        sections: [sectionA, sectionB],
        items,
      }
    )
  );
})();

// ——— lesson01-walk3 ———
(function walk3() {
  const dirA =
    "다음 문장에서 감각을 표현하는 동사를 찾아 동그라미 하고 형용사를 찾아 밑줄을 치세요.";
  const ruleA = "첫 칸에는 감각동사, 둘째 칸에는 형용사를 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 11, 1, [
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
  ]);
  const insA = sectionA.instructionKo;
  const rows = [
    ["This bell sounds sweet.", "sounds|sweet", true],
    ["I feel tired.", "feel|tired"],
    ["The milk smells bad.", "smells|bad"],
    ["This steak tastes good.", "tastes|good"],
    ["They look sleepy.", "look|sleepy"],
    ["My feet feel wet.", "feel|wet"],
    ["The apples taste sour.", "taste|sour"],
    ["Sally looks pretty today.", "looks|pretty"],
    ["The puzzle looks easy.", "looks|easy"],
    ["The roses smell great.", "smell|great"],
    ["The medicine tastes bitter.", "tastes|bitter"],
    ["That sofa looks comfortable.", "looks|comfortable"],
  ];
  const items = rows.map((row, i) => {
    const [sent, acc, ex] = row;
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const prompt = sent + "\n[감각동사] _____   [형용사] _____";
    const opts = { blanks: 2 };
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acc.replace("|", " / ");
    }
    return fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt, [acc], opts);
  });
  write(
    "lesson01-walk3.json",
    base(
      "b4:u08:lesson01-walk3",
      "Lesson 01 Walk 3 — 수여동사와 감각동사",
      "감각동사+형용사 · p. 197",
      "197",
      10,
      {
        introKo: "Section A 12문항. 책에서는 동그라미·밑줄 표시를 하지만, 여기서는 감각동사와 형용사를 각각 씁니다.",
        sections: [sectionA],
        items,
      }
    )
  );
})();

// ——— lesson01-run ———
(function run() {
  const dirA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const ruleA = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "choice", "Choose · 고르기", 14, 1, [
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
  const insA = sectionA.instructionKo;
  const aMc = [
    ["I gave ( Amy a gift / a gift Amy ).", ["Amy a gift", "a gift Amy"], "Amy a gift", true],
    ["Pass ( the salt me / me the salt ), please.", ["the salt me", "me the salt"], "me the salt"],
    ["Jenny made ( her sister a doll / a doll her sister ).", ["her sister a doll", "a doll her sister"], "her sister a doll"],
    ["My aunt often buys ( some toys me / me some toys ).", ["some toys me", "me some toys"], "me some toys"],
    [
      "She asked ( Greg his phone number / his phone number Greg ).",
      ["Greg his phone number", "his phone number Greg"],
      "Greg his phone number",
    ],
    ["Meg sang her favorite song ( of us / to us ).", ["of us", "to us"], "to us"],
    ["Ms. Jackson teaches English ( to them / for them ).", ["to them", "for them"], "to them"],
    ["He wrote a postcard ( of Scott / to Scott ) yesterday.", ["of Scott", "to Scott"], "to Scott"],
    ["You gave the flowers ( of me / to me ) last week.", ["of me", "to me"], "to me"],
    ["My mother makes cheesecake ( to us / for us ) on weekends.", ["to us", "for us"], "for us"],
    ["Your father looks ( happy / happily ) today.", ["happy", "happily"], "happy"],
    ["His song sounded ( beautifully / beautiful ) then.", ["beautifully", "beautiful"], "beautiful"],
    ["The soup tasted ( salty / salt ).", ["salty", "salt"], "salty"],
    ["The bread smells ( well / good ).", ["well", "good"], "good"],
    ["The cushion felt ( soft / softly ).", ["soft", "softly"], "soft"],
  ];
  const items = [];
  aMc.forEach((row, i) => {
    const [prompt, choices, acc, ex] = row;
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const opts = ex ? { example: true, displayOnly: true, exampleAnswer: acc } : {};
    items.push(mc(id, label, sectionA, insA, "choice", "Choose · 고르기", prompt, choices, [acc], opts));
  });

  const dirB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.";
  const ruleB = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sectionB = sec("B", "Section B", dirB, ruleB, "choice", "Choose · 고르기", 14, 1, [
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
  const insB = sectionB.instructionKo;
  const bMc = [
    ["Mike made a kite _____ me.", ["to", "for"], "for", true],
    ["She told a lie _____ us.", ["to", "for"], "to"],
    ["Give this pencil case _____ Sally.", ["of", "to"], "to"],
    ["He made a sweater _____ John.", ["to", "for"], "for"],
    ["Tom asked a lot of questions _____ me.", ["of", "for"], "of"],
    ["Alice showed her pictures _____ us.", ["to", "of"], "to"],
    ["She bought a new computer _____ him.", ["to", "for"], "for"],
    ["Bill brought my bicycle _____ me.", ["to", "of"], "to"],
    ["Ms. Ryu teaches math _____ them.", ["of", "to"], "to"],
    ["I sent a text message _____ Emily.", ["to", "for"], "to"],
    ["Your hamster looks _____.", ["cute", "cutely"], "cute"],
    ["These cookies taste _____.", ["delicious", "deliciously"], "delicious"],
    ["This water feels _____.", ["warmly", "warm"], "warm"],
    ["This piano sounds _____.", ["strange", "strangely"], "strange"],
    ["My mom's doughnuts smell _____.", ["nice", "nicely"], "nice"],
  ];
  bMc.forEach((row, i) => {
    const [prompt, choices, acc, ex] = row;
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const opts = ex ? { example: true, displayOnly: true, exampleAnswer: acc } : {};
    items.push(mc(id, label, sectionB, insB, "choice", "Choose · 고르기", prompt, choices, [acc], opts));
  });

  write(
    "lesson01-run.json",
    base(
      "b4:u08:lesson01-run",
      "Lesson 01 Run — 수여동사와 감각동사",
      "pp. 198–199",
      "198–199",
      20,
      {
        introKo: "Section A·B 각 15문항(고르기). pp. 198–199.",
        sections: [sectionA, sectionB],
        items,
      }
    )
  );
})();

// ——— lesson01-jump ———
(function jump() {
  const dirA = "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.";
  const ruleA = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 1, [
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
  const insA = sectionA.instructionKo;
  const aRows = [
    [
      "I <u>gave Kelly the pencil</u>.",
      "켈리에게 그 연필을 주었다",
      ["켈리에게 그 연필을 주었다", "켈리에게 연필을 주었다"],
      true,
    ],
    [
      "Dad <u>made us a treehouse</u>.",
      "우리에게 나무 위의 오두막을 만들어 주었다",
      ["우리에게 나무 위의 오두막을 만들어 주었다", "우리에게 나무위의 오두막을 만들어 주었다", "우리에게 나무 위 오두막을 만들어 주었다"],
    ],
    ["The baby <u>looks sleepy</u>.", "졸려 보인다", ["졸려 보인다", "졸린 것 같다"]],
    [
      "He <u>showed us his new backpack</u>.",
      "우리에게 자기 새 배낭을 보여 주었다",
      ["우리에게 자기 새 배낭을 보여 주었다", "우리에게 그의 새 배낭을 보여 주었다"],
    ],
    [
      "Tim's aunt <u>bought him a robot</u>.",
      "그에게 로봇을 하나 사 주었다",
      ["그에게 로봇을 하나 사 주었다", "팀에게 로봇을 하나 사 주었다"],
    ],
    ["This pillow <u>feels soft</u>.", "푹신하다", ["푹신하다", "푹신한 느낌이 든다", "부드럽다"]],
    [
      "We <u>asked the boy his name</u>.",
      "그 소년에게 그의 이름을 물어보았다",
      ["그 소년에게 그의 이름을 물어보았다", "그 아이에게 그의 이름을 물어보았다"],
    ],
    [
      "My brother <u>brought me my cap</u>.",
      "나에게 내 모자를 가져다주었다",
      ["나에게 내 모자를 가져다주었다", "나에게 내 모자를 가져다 주었다"],
    ],
    ["The shirt <u>smells bad</u>.", "냄새가 나쁘다", ["냄새가 나쁘다", "냄새가 안 좋다"]],
    ["I <u>passed Mike the ball</u>.", "마이크에게 공을 건네주었다", ["마이크에게 공을 건네주었다", "마이크에게 공을 건네 줬다"]],
    [
      "Jisung often <u>lends me his books</u>.",
      "나에게 자기 책을 빌려 준다",
      ["나에게 자기 책을 빌려 준다", "나에게 그의 책을 빌려 준다"],
    ],
    ["Your voice <u>sounds good</u>.", "좋게 들린다", ["좋게 들린다", "듣기 좋다"]],
    ["They <u>sent me e-mail</u>.", "나에게 이메일을 보냈다", ["나에게 이메일을 보냈다", "나에게 e-mail을 보냈다"]],
    [
      "She <u>reads her baby a fairy tale</u>.",
      "아기에게 동화를 읽어 주었다",
      ["아기에게 동화를 읽어 주었다", "그녀의 아기에게 동화를 읽어 주었다"],
    ],
    ["This cake <u>tastes sweet</u>.", "달다", ["달다", "단 맛이 난다", "맛이 달다"]],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const [prompt, , acceptList, ex] = row;
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const opts = {};
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acceptList[0];
    }
    items.push(fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt + "\n→ _____", acceptList, opts));
  });

  const dirB = "다음 문장의 빈칸에 알맞은 전치사를 쓰세요.";
  const ruleB = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionB = sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 6, 1, ["B2", "B3", "B4", "B5", "B6", "B7"]);
  const insB = sectionB.instructionKo;
  const bRows = [
    ["Mandy gave some bananas _____ the monkey.", "to", true],
    ["Ted showed the magazine _____ us.", "to"],
    ["We asked the way _____ a girl.", "of"],
    ["I often buy some roses _____ my mother.", "for"],
    ["Jimmy told the news _____ them.", "to"],
    ["My sister made a sandwich _____ me.", "for"],
    ["They sent a postcard _____ her yesterday.", "to"],
  ];
  bRows.forEach((row, i) => {
    const [prompt, acc, ex] = row;
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const opts = ex ? { example: true, displayOnly: true, exampleAnswer: acc } : {};
    items.push(fill(id, label, sectionB, insB, "words", "Words · 빈칸 말만", prompt, [acc], opts));
  });

  const dirC = "주어진 말과 알맞은 감각동사를 사용하여 다음 문장을 완성하세요.";
  const ruleC = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sectionC = sec("C", "Section C", dirC, ruleC, "words", "Words · 빈칸 말만", 4, 1, ["C2", "C3", "C4", "C5"]);
  const insC = sectionC.instructionKo;
  const cRows = [
    ["The shirt _____ _____. (tight)", "looks|tight", true],
    ["This shampoo _____ _____. (good)", "smells|good"],
    ["This apple _____ _____. (sour)", "tastes|sour"],
    ["They _____ _____. (tired)", "feel|tired"],
    ["His voice _____ _____. (strange)", "sounded|strange", , "sounds|strange"],
  ];
  cRows.forEach((row, i) => {
    const [prompt, acc, ex, acc2] = row;
    const label = "C" + (i + 1);
    const id = "c" + String(i + 1).padStart(2, "0");
    const accept = acc2 ? [acc, acc2] : [acc];
    const opts = { blanks: 2 };
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acc.replace("|", " ");
    }
    items.push(fill(id, label, sectionC, insC, "words", "Words · 빈칸 말만", prompt, accept, opts));
  });

  write(
    "lesson01-jump.json",
    base(
      "b4:u08:lesson01-jump",
      "Lesson 01 Jump — 수여동사와 감각동사",
      "pp. 200–201",
      "200–201",
      25,
      {
        introKo: "Section A 15문항(한국어), Section B 7문항(전치사), Section C 5문항(감각동사).",
        sections: [sectionA, sectionB, sectionC],
        items,
      }
    )
  );
})();

// ——— lesson01-fly ———
(function fly() {
  const dirA = "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.";
  const ruleA = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.) (밑줄 친 부분만 고쳐 쓰세요.)";
  const sectionA = sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 1, [
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
  const insA = sectionA.instructionKo;
  const aRows = [
    ["I told <u>the story him</u>.", "him|the story", 2, true],
    ["Tommy showed <u>his toys them</u>.", "them|his toys", 2],
    ["I wrote <u>a letter Johnny</u>.", "Johnny|a letter", 2, , "Johnny|a letter"],
    ["My brother sent <u>this box her</u>.", "her|this box", 2],
    ["They brought <u>a cat me</u>.", "me|a cat", 2],
    ["You gave the pictures <u>for Emily</u>.", "to|Emily", 2],
    ["My mother bought new shoes <u>to me</u>.", "for|me", 2],
    ["She got that skirt <u>to you</u>.", "for|you", 2],
    ["Mr. Brown taught math <u>for Jenny</u>.", "to|Jenny", 2],
    ["The girl asked his address <u>to him</u>.", "of|him", 2],
    ["His uncle looks <u>busily</u>.", "busy", 1],
    ["We felt <u>angrily</u>.", "angry", 1],
    ["These cookies smell <u>well</u>.", "good", 1],
    ["This watermelon tastes <u>sweetly</u>.", "sweet", 1],
    ["This piano sounds <u>beautifully</u>.", "beautiful", 1],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const [prompt, acc, blanks, ex] = row;
    const label = "A" + (i + 1);
    const id = "a" + String(i + 1).padStart(2, "0");
    const opts = { blanks };
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = acc.replace("|", " ");
    }
    items.push(fill(id, label, sectionA, insA, "words", "Words · 빈칸 말만", prompt, [acc], opts));
  });

  const dirB = "주어진 단어들을 사용하여 다음 문장을 완성하세요.";
  const ruleB = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  const sectionB = sec("B", "Section B", dirB, ruleB, "sentence", "Full sentence · 문장 전체", 11, 1, [
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
  ]);
  const insB = sectionB.instructionKo;
  const bRows = [
    [
      "나는 줄리아에게 이메일을 보냈다. (e-mail, Julia)\nI sent _____ _____ .",
      ["I sent Julia e-mail.", "I sent Julia an e-mail.", "I sent Julia e-mail", "I sent Julia an e-mail"],
      true,
    ],
    [
      "스미스 선생님은 우리에게 수학을 가르치신다. (math, us)\nMr. Smith teaches _____ _____ .",
      ["Mr. Smith teaches us math.", "Mr. Smith teaches us math"],
    ],
    [
      "케이트는 나에게 자기 일기를 보여 주었다. (her diary, me)\nKate showed _____ _____ _____ .",
      ["Kate showed me her diary.", "Kate showed me her diary"],
    ],
    [
      "준호가 고양이에게 우유를 조금 주었다. (some milk, the cat)\nJunho gave _____ _____ _____ .",
      ["Junho gave the cat some milk.", "Junho gave the cat some milk"],
    ],
    [
      "우리 언니가 내게 그 설탕을 건네주었다. (the sugar, me)\nMy sister passed _____ _____ _____ .",
      ["My sister passed me the sugar.", "My sister passed me the sugar"],
    ],
    [
      "우리 아빠가 내게 눈사람을 만들어 주셨다. (me, a snowman, for)\nMy dad made _____ _____ _____ _____ .",
      ["My dad made a snowman for me.", "My dad made a snowman for me"],
    ],
    [
      "나는 앤에게 그 신문을 가져다주었다. (Anne, the newspaper, to)\nI brought _____ _____ _____ _____ .",
      ["I brought the newspaper to Anne.", "I brought the newspaper to Anne"],
    ],
    [
      "그는 그녀에게 내 이름을 물어보았다. (her, my name, of)\nHe asked _____ _____ _____ _____ .",
      ["He asked my name of her.", "He asked my name of her"],
    ],
    ["너는 슬퍼 보인다. (look, sad)\nYou _____ _____ .", ["You look sad.", "You look sad"]],
    [
      "이 음악은 멋지게 들린다. (sounds, wonderful)\nThis music _____ _____ .",
      ["This music sounds wonderful.", "This music sounds wonderful"],
    ],
    [
      "그 약은 맛이 쓰다. (tastes, bitter)\nThe medicine _____ _____ .",
      ["The medicine tastes bitter.", "The medicine tastes bitter"],
    ],
    ["나는 오늘 기분이 좋다. (feel, good)\nI _____ _____ today.", ["I feel good today.", "I feel good today."]],
  ];
  bRows.forEach((row, i) => {
    const [prompt, accept, ex] = row;
    const label = "B" + (i + 1);
    const id = "b" + String(i + 1).padStart(2, "0");
    const opts = {};
    if (ex) {
      opts.example = true;
      opts.displayOnly = true;
      opts.exampleAnswer = accept[0];
    }
    items.push(sentence(id, label, sectionB, insB, "sentence", "Full sentence · 문장 전체", prompt, accept, opts));
  });

  write(
    "lesson01-fly.json",
    base(
      "b4:u08:lesson01-fly",
      "Lesson 01 Fly — 수여동사와 감각동사",
      "pp. 202–203",
      "202–203",
      28,
      {
        introKo: "Section A 15문항(고쳐 쓰기), Section B 12문항(문장 완성).",
        sections: [sectionA, sectionB],
        items,
      }
    )
  );
})();

// ——— review08 ———
(function review08() {
  const sections = [
    sec(
      "1-2",
      "[1–2]",
      "[1–2] 다음 문장의 빈칸에 알맞은 말을 고르세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["1", "2"]
    ),
    sec(
      "3-4",
      "[3–4]",
      "[3–4] 다음 문장과 뜻이 같은 문장을 고르세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["3", "4"]
    ),
    sec(
      "5-6",
      "[5–6]",
      "[5–6] 다음 중 잘못된 문장을 고르세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["5", "6"]
    ),
    sec(
      "7-8",
      "[7–8]",
      "[7–8] 다음 문장의 빈칸에 들어갈 알맞은 말을 고르세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["7", "8"]
    ),
    sec(
      "9-10",
      "[9–10]",
      "[9–10] 다음 중 올바른 문장을 고르세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["9", "10"]
    ),
    sec(
      "11-12",
      "[11–12]",
      "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요.",
      "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["11", "12"]
    ),
    sec(
      "13-14",
      "[13–14]",
      "[13–14] 다음 문장을 아래와 같이 바꿔 쓸 때 빈칸에 알맞은 단어를 쓰세요.",
      "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)",
      "words",
      "Words · 빈칸 말만",
      2,
      0,
      ["13", "14"]
    ),
    sec(
      "15-16",
      "[15–16]",
      "[15–16] 다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요.",
      "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)",
      "words",
      "Words · 빈칸 말만",
      2,
      0,
      ["15", "16"]
    ),
    sec(
      "17-18",
      "[17–18]",
      "[17–18] 주어진 말을 순서대로 배열하여 문장을 쓰세요.",
      "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)",
      "sentence",
      "Sentence · 문장 전체",
      2,
      0,
      ["17", "18"]
    ),
    sec(
      "19-20",
      "[19–20]",
      "[19–20] 다음 문장에서 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요.",
      "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)",
      "sentence",
      "Sentence · 문장 전체",
      2,
      0,
      ["19", "20"]
    ),
  ];
  const items = [];
  const pushMc = (sec, label, id, prompt, choices, acc, promptKo) => {
    items.push(
      mc(id, label, sec, sec.instructionKo, "choice", "Choose · 고르기", prompt, choices, [acc], { promptKo })
    );
  };
  pushMc(
    sections[0],
    "1",
    "q01",
    "Mr. Baker showed _____ his album.",
    ["we", "us", "our", "ours"],
    "us"
  );
  pushMc(sections[0], "2", "q02", "She looks _____ today.", ["happiness", "happily", "more happy", "happy"], "happy");
  pushMc(
    sections[1],
    "3",
    "q03",
    "Charlie gave me this book.",
    [
      "Charlie gave this book me.",
      "Charlie gave to me this book.",
      "Charlie gave me to this book.",
      "Charlie gave this book to me.",
    ],
    "Charlie gave this book to me."
  );
  pushMc(
    sections[1],
    "4",
    "q04",
    "My dad made us pizza.",
    [
      "My dad made pizza us.",
      "My dad made us for pizza.",
      "My dad made pizza for us.",
      "My dad made for us pizza.",
    ],
    "My dad made pizza for us."
  );
  pushMc(
    sections[2],
    "5",
    "q05",
    "Which sentence is wrong?",
    [
      "The flower smells good.",
      "This food tastes wonderful.",
      "Her pillow feels softly.",
      "His voice sounds tired.",
    ],
    "Her pillow feels softly."
  );
  pushMc(
    sections[2],
    "6",
    "q06",
    "Which sentence is wrong?",
    [
      "Tom sent her a Christmas card.",
      "John gave some water me.",
      "They told it to us.",
      "He bought a shirt for me.",
    ],
    "John gave some water me."
  );
  pushMc(
    sections[3],
    "7",
    "q07",
    "The students asked some questions _____ him.",
    ["to", "for", "of", "with"],
    "of"
  );
  pushMc(sections[3], "8", "q08", "He sent e-mail _____ Mina.", ["to", "for", "of", "with"], "to");
  pushMc(
    sections[4],
    "9",
    "q09",
    "Which sentence is correct?",
    [
      "I gave the chocolate Tom.",
      "They showed me to your photos.",
      "She bought a book of him.",
      "My aunt made me a doll.",
    ],
    "My aunt made me a doll."
  );
  pushMc(
    sections[4],
    "10",
    "q10",
    "Which sentence is correct?",
    ["We felt sad.", "The skirt looks shortly.", "The piano sounds strangely.", "This fruit smells badly."],
    "We felt sad."
  );
  pushMc(
    sections[5],
    "11",
    "q11",
    "폴은 그녀에게 그 책을 건네주었다.\nPaul passed ( the book her / her the book ).",
    ["the book her", "her the book"],
    "her the book",
    "폴은 그녀에게 그 책을 건네주었다."
  );
  pushMc(
    sections[5],
    "12",
    "q12",
    "우리 아빠는 내게 장난감을 하나 사 주셨다.\nMy dad bought ( a toy for me / a toy me ).",
    ["a toy for me", "a toy me"],
    "a toy for me",
    "우리 아빠는 내게 장난감을 하나 사 주셨다."
  );
  items.push(
    fill(
      "q13",
      "13",
      sections[6],
      sections[6].instructionKo,
      "words",
      "Words · 빈칸 말만",
      "John told me her birthday.\n→ John told her birthday _____ _____ .",
      ["to|me"],
      { blanks: 2, promptKo: "존은 나에게 그녀의 생일을 말해 주었다." }
    )
  );
  items.push(
    fill(
      "q14",
      "14",
      sections[6],
      sections[6].instructionKo,
      "words",
      "Words · 빈칸 말만",
      "She asked me my name.\n→ She asked my name _____ _____ .",
      ["of|me"],
      { blanks: 2, promptKo: "그녀는 나에게 내 이름을 물어보았다." }
    )
  );
  items.push(
    fill(
      "q15",
      "15",
      sections[7],
      sections[7].instructionKo,
      "words",
      "Words · 빈칸 말만",
      "앨리스는 오늘 예뻐 보인다.\nAlice _____ _____ today.",
      ["looks|pretty", "look|pretty"],
      { blanks: 2, promptKo: "앨리스는 오늘 예뻐 보인다." }
    )
  );
  items.push(
    fill(
      "q16",
      "16",
      sections[7],
      sections[7].instructionKo,
      "words",
      "Words · 빈칸 말만",
      "나는 지금 행복한 느낌이다.\nI _____ _____ now.",
      ["feel|happy", "feels|happy"],
      { blanks: 2, promptKo: "나는 지금 행복한 느낌이다." }
    )
  );
  items.push(
    sentence(
      "q17",
      "17",
      sections[8],
      sections[8].instructionKo,
      "sentence",
      "Sentence · 문장 전체",
      "( brought / an umbrella / me / my mom / . )\n우리 엄마가 내게 우산을 가져다주셨다.\n_____",
      ["My mom brought me an umbrella.", "My mom brought me an umbrella"],
      { promptKo: "우리 엄마가 내게 우산을 가져다주셨다." }
    )
  );
  items.push(
    sentence(
      "q18",
      "18",
      sections[8],
      sections[8].instructionKo,
      "sentence",
      "Sentence · 문장 전체",
      "( smells / this pie / good / . )\n이 파이는 좋은 냄새가 난다.\n_____",
      ["This pie smells good.", "This pie smells good"],
      { promptKo: "이 파이는 좋은 냄새가 난다." }
    )
  );
  items.push(
    sentence(
      "q19",
      "19",
      sections[9],
      sections[9].instructionKo,
      "sentence",
      "Sentence · 문장 전체",
      "Kevin sent some postcards <u>for</u> me.",
      ["Kevin sent some postcards to me.", "Kevin sent some postcards to me"],
      { promptKo: "케빈은 나에게 엽서 몇 장을 보냈다." }
    )
  );
  items.push(
    sentence(
      "q20",
      "20",
      sections[9],
      sections[9].instructionKo,
      "sentence",
      "Sentence · 문장 전체",
      "This apple tastes <u>sourly</u>.",
      ["This apple tastes sour.", "This apple tastes sour"],
      { promptKo: "이 사과는 신맛이 난다." }
    )
  );

  write(
    "review08.json",
    base("b4:u08:review08", "Review 08", "pp. 204–206", "204–206", 30, {
      introKo: "Review 08은 1–20번 문항입니다. Check Check 점수표(pp. 206)는 채점하지 않아요.",
      sections,
      items,
    })
  );
})();

console.log("Wrote BlueZap 4 Unit 08 JSON to", OUT);
