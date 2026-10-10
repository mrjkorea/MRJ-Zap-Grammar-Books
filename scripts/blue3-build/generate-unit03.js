#!/usr/bin/env node
/* Generate BlueZap 3 Unit 03 practice JSON (there, it). */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue3/unit03");

const META = {
  bookId: "zap-blue-3",
  bookTitle: "ZAP Blue 3",
  appName: "BlueZap 3",
  unitId: "unit-03",
  unitTitle: "Unit 03 — there, it",
  sectionsVersion: 2,
};

function sec(id, title, directionKo, ruleKo, answerMode, answerModeTag, itemCount, exampleCount, labels) {
  return {
    id,
    title,
    instructionKo: `${title} ${directionKo} ${ruleKo}`,
    directionKo,
    ruleKo,
    answerMode,
    answerModeTag,
    itemCount,
    exampleCount,
    labels,
  };
}

function itemBase(section, sectionTitle, sectionInstructionKo, answerMode, answerModeTag, label, type, extra) {
  return {
    section,
    sectionTitle,
    sectionInstructionKo,
    answerMode,
    answerModeTag,
    label,
    type,
    ...extra,
  };
}

function write(name, doc) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(doc, null, 2) + "\n");
}

function lesson01Walk1() {
  const instrA =
    "다음 문장에서 「there+be동사」를 찾아 동그라미 하세요. 동그라미 친 there+be만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장에서 「there+be동사」를 찾아 동그라미 하세요.";
  const ruleA = "동그라미 친 there+be만 쓰세요.";
  const instrB =
    "다음 문장에서 장소나 위치를 나타내는 말을 찾아 동그라미 하세요. 동그라미 친 장소·위치 표현만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB = "다음 문장에서 장소나 위치를 나타내는 말을 찾아 동그라미 하세요.";
  const ruleB = "동그라미 친 장소·위치 표현만 쓰세요.";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5", "A6"]),
    sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5", "B6"]),
  ];
  const aData = [
    ["There is a <u>cat</u> under the sofa.", "소파 밑에 고양이 한 마리가 있다.", "There is", ["There is", "There's"]],
    ["There are <u>two chairs</u> in the room.", "방에 의자 두 개가 있다.", "There are", ["There are"]],
    ["There is a <u>bee</u> on the flower.", "꽃 위에 벌 한 마리가 있다.", "There is", ["There is", "There's"]],
    ["There are <u>green tomatoes</u> in the basket.", "바구니에 토마토가 몇 개 있다.", "There are", ["There are"]],
    ["There is a <u>big cabbage</u> on the table.", "식탁 위에 큰 양배추가 하나 있다.", "There is", ["There is", "There's"]],
  ];
  const bData = [
    ["There is a cup in the cupboard.", "찬장 안에 컵이 하나 있다.", "in the cupboard"],
    ["There are four tables in the room.", "방에 탁자 네 개가 있다.", "in the room"],
    ["There is a kettle behind the basket.", "바구니 뒤에 주전자가 있다.", "behind the basket"],
    ["There are some books in his bag.", "그의 가방 안에 책이 몇 권 있다.", "in his bag"],
    ["There is a doghouse in the garden.", "정원에 개집이 있다.", "in the garden"],
  ];
  const items = [];
  items.push({
    id: "a01",
    ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A1", "fill", {
      promptEn: aData[0][0],
      promptKo: aData[0][1],
      accept: aData[0][3],
      example: true,
      displayOnly: true,
      exampleAnswer: aData[0][2],
    }),
  });
  aData.slice(1).forEach((row, i) => {
    items.push({
      id: "a0" + (i + 2),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 2), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: row[3],
      }),
    });
  });
  items.push({
    id: "b01",
    ...itemBase("B", "Section B", instrB, "words", "Words · 빈칸 말만", "B1", "fill", {
      promptEn: bData[0][0],
      promptKo: bData[0][1],
      accept: [bData[0][2]],
      example: true,
      displayOnly: true,
      exampleAnswer: bData[0][2],
    }),
  });
  bData.slice(1).forEach((row, i) => {
    items.push({
      id: "b0" + (i + 2),
      ...itemBase("B", "Section B", instrB, "words", "Words · 빈칸 말만", "B" + (i + 2), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: [row[2]],
      }),
    });
  });
  write("lesson01-walk1.json", {
    ...META,
    practiceId: "b3:u03:lesson01-walk1",
    title: "Grammar Walk — Lesson 01",
    subtitle: "there+be (p. 63)",
    pages: "63",
    timerMinutes: 10,
    introKo:
      "Section A 5문항(there+be), Section B 5문항(장소·위치). 회색 '예시'는 채점하지 않아요. 동그라미 친 말만 쓰세요.",
    sections,
    items,
  });
}

function lesson01Walk2() {
  const instrA =
    "다음 문장에서 「be동사+there」를 찾아 동그라미 하세요. 동그라미 친 be동사+there만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장에서 「be동사+there」를 찾아 동그라미 하세요.";
  const ruleA = "동그라미 친 be동사+there만 쓰세요.";
  const instrB =
    "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 대답(a~b)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB = "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.";
  const ruleB = "알맞은 대답(a~b)을 하나 골라 누르세요.";
  const choicesB = ["a. Yes, there is.", "b. Yes, there are."];
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5", "A6"]),
    sec("B", "Section B", dirB, ruleB, "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5", "B6"]),
  ];
  const aData = [
    ["<u>Is there</u> a ladybug on the window?", "창문에 무당벌레가 있니?", "Is there"],
    ["<u>Are there</u> two turtles in the pond?", "연못에 거북이 두 마리가 있니?", "Are there"],
    ["<u>Is there</u> a bat next to the bench?", "벤치 옆에 박쥐가 있니?", "Is there"],
    ["<u>Are there</u> chopsticks on the napkin?", "냅킨 위에 젓가락이 있니?", "Are there"],
    ["<u>Is there</u> a dog under the slide?", "미끄럼틀 밑에 개가 있니?", "Is there"],
  ];
  const bQuestions = [
    ["Is there a knife on the tray?", "쟁반 위에 칼이 있니?", "a"],
    ["Are there three tomatoes in the basket?", "바구니에 토마토 세 개가 있니?", "b"],
    ["Is there a pumpkin next to the cabbage?", "양배추 옆에 호박이 있니?", "a"],
    ["Are there two bananas in the basket?", "바구니에 바나나 두 개가 있니?", "b"],
    ["Is there a waste basket under the table?", "식탁 밑에 쓰레기통이 있니?", "a"],
  ];
  const items = [];
  items.push({
    id: "a01",
    ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A1", "fill", {
      promptEn: aData[0][0],
      promptKo: aData[0][1],
      accept: [aData[0][2]],
      example: true,
      displayOnly: true,
      exampleAnswer: aData[0][2],
    }),
  });
  aData.slice(1).forEach((row, i) => {
    items.push({
      id: "a0" + (i + 2),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 2), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: [row[2]],
      }),
    });
  });
  items.push({
    id: "b01",
    ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B1", "mc", {
      promptEn: bQuestions[0][0],
      promptKo: bQuestions[0][1],
      choices: choicesB,
      accept: ["a. Yes, there is.", "a"],
      example: true,
      displayOnly: true,
      exampleAnswer: "a. Yes, there is.",
    }),
  });
  bQuestions.slice(1).forEach((row, i) => {
    const letter = row[2];
    items.push({
      id: "b0" + (i + 2),
      ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B" + (i + 2), "mc", {
        promptEn: row[0],
        promptKo: row[1],
        choices: choicesB,
        accept: [choicesB[letter === "a" ? 0 : 1], letter],
      }),
    });
  });
  write("lesson01-walk2.json", {
    ...META,
    practiceId: "b3:u03:lesson01-walk2",
    title: "Grammar Walk — Lesson 01 (2)",
    subtitle: "Is/Are there (p. 65)",
    pages: "65",
    timerMinutes: 10,
    introKo: "Section A 5문항(be+there), Section B 5문항(대답 연결·고르기). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function mcItem(id, section, instr, label, promptEn, promptKo, choices, accept, ex) {
  const o = {
    id,
    ...itemBase(section, "Section " + section, instr, "choice", "Choose · 고르기", label, "mc", {
      promptEn,
      promptKo,
      choices,
      accept: Array.isArray(accept) ? accept : [accept, String(choices.indexOf(accept) + 1)],
    }),
  };
  if (ex) {
    o.example = true;
    o.displayOnly = true;
    o.exampleAnswer = ex;
  }
  return o;
}

function lesson01Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const ruleA = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB = "다음 대화의 빈칸에 알맞은 말을 쓰세요.";
  const ruleB = "빈칸에 들어갈 말만 쓰세요.";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "choice", "Choose · 고르기", 14, 1, [
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
      "A16",
    ]),
    sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 14, 1, [
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
      "B16",
    ]),
  ];
  const aRows = [
    ["There ( is / are ) a bird on the roof.", "지붕 위에 새 한 마리가 있다.", ["is", "are"], "is"],
    ["There ( is / are ) two windows in the classroom.", "교실에 창문 두 개가 있다.", ["is", "are"], "are"],
    ["There ( is / are ) a ball under the seesaw.", "시소 밑에 공이 하나 있다.", ["is", "are"], "is"],
    ["There ( is / are ) three oranges on the tray.", "쟁반 위에 오렌지 세 개가 있다.", ["is", "are"], "are"],
    ["There ( is / are ) some milk in the glass.", "컵에 우유가 조금 있다.", ["is", "are"], "is"],
    ["There ( is / are ) a butterfly on the rose.", "장미 위에 나비가 한 마리 있다.", ["is", "are"], "is"],
    ["There ( is / are ) a lot of pencils in the pencil case.", "필통에 연필이 많이 있다.", ["is", "are"], "are"],
    ["There is ( a teddy bear / two teddy bears ) in the box.", "상자 안에 곰 인형이 있다.", ["a teddy bear", "two teddy bears"], "a teddy bear"],
    ["There is ( a bed / two beds ) in the bedroom.", "침실에 침대가 하나 있다.", ["a bed", "two beds"], "a bed"],
    ["There are ( a kitten / three kittens ) on the cushion.", "방석 위에 새끼 고양이가 있다.", ["a kitten", "three kittens"], "three kittens"],
    ["There is ( a mirror / two mirrors ) next to the table.", "탁자 옆에 거울이 하나 있다.", ["a mirror", "two mirrors"], "a mirror"],
    ["There are ( an onion / some onions ) in the basket.", "바구니에 양파가 있다.", ["an onion", "some onions"], "some onions"],
    ["There is ( a picture / four pictures ) on the wall.", "벽에 그림이 하나 있다.", ["a picture", "four pictures"], "a picture"],
    ["There are ( a belt / five belts ) in the drawer.", "서랍에 벨트가 있다.", ["a belt", "five belts"], "five belts"],
    ["There is ( a squirrel / some squirrels ) in the tree.", "나무에 다람쥐가 있다.", ["a squirrel", "some squirrels"], "a squirrel"],
  ];
  const bRows = [
    ["A: Is there a house on the farm? B: Yes, there is.", "is", 1, ["is"]],
    ["A: Are there five goats on the farm? B: Yes, there ____.", "are", 1, ["are"]],
    ["A: Is there a tiger on the farm? B: No, there ____.", "isn't", 1, ["isn't", "is not"]],
    ["A: Are there many monkeys on the farm? B: No, there ____.", "aren't", 1, ["aren't", "are not"]],
    ["A: ____ there a slide on the playground? B: Yes, there is.", "Is", 1, ["Is"]],
    ["A: ____ there two swings on the playground? B: Yes, there are.", "Are", 1, ["Are"]],
    ["A: ____ there a roller coaster on the playground? B: No, there isn't.", "Is", 1, ["Is"]],
    ["A: ____ there any cars on the playground? B: No, there aren't.", "Are", 1, ["Are"]],
    ["A: ____ there toothbrushes in the bathroom? B: Yes, there are.", "Are", 1, ["Are"]],
    ["A: ____ there a toilet in the bathroom? B: Yes, there is.", "Is", 1, ["Is"]],
    ["A: Are ____ two flower pots in the bathroom? B: No, there aren't.", "there", 1, ["there"]],
    ["A: Is ____ a book in the bathroom? B: No, there isn't.", "there", 1, ["there"]],
    ["A: Is ____ a doghouse in the yard? B: No, there isn't.", "there", 1, ["there"]],
    ["A: Are there two bicycles in the yard? B: Yes, ____ are.", "there", 1, ["there"]],
    ["A: Is there a hose in the yard? B: Yes, ____ is.", "there", 1, ["there"]],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const label = "A" + (i + 1);
    items.push(
      mcItem(
        "a" + String(i + 1).padStart(2, "0"),
        "A",
        instrA,
        label,
        row[0],
        row[1],
        row[2],
        [row[3], String(row[2].indexOf(row[3]) + 1)],
        i === 0 ? row[3] : undefined
      )
    );
    if (i === 0) {
      items[items.length - 1].example = true;
      items[items.length - 1].displayOnly = true;
      items[items.length - 1].exampleAnswer = row[3];
    }
  });
  bRows.forEach((row, i) => {
    const label = "B" + (i + 1);
    const it = {
      id: "b" + String(i + 1).padStart(2, "0"),
      ...itemBase("B", "Section B", instrB, "words", "Words · 빈칸 말만", label, "fill", {
        promptEn: row[0],
        promptKo: "대화 빈칸을 채우세요.",
        accept: row[3],
        blanks: row[2],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  write("lesson01-run.json", {
    ...META,
    practiceId: "b3:u03:lesson01-run",
    title: "Grammar Run — Lesson 01",
    subtitle: "There is/are (pp. 66–67)",
    pages: "66–67",
    timerMinutes: 18,
    introKo: "Section A 15문항(고르기), Section B 15문항(대화 빈칸). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson01Jump() {
  const instrA =
    "there와 be동사를 사용하여 다음 문장 또는 대화를 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "there와 be동사를 사용하여 다음 문장 또는 대화를 완성하세요.";
  const ruleA = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 평서문은 의문문으로, 의문문은 평서문으로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)";
  const dirB = "다음 문장을 평서문은 의문문으로, 의문문은 평서문으로 바꿔 쓰세요.";
  const ruleB = "문장 전체를 쓰세요.";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 1, [
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
      "A16",
    ]),
    sec("B", "Section B", dirB, ruleB, "sentence", "Sentence · 문장 전체", 9, 1, [
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
    ]),
  ];
  const aRows = [
    ["There is an apple in the refrigerator.", "냉장고에 사과가 하나 있다.", 2, "There|is"],
    ["____ ____ a bed next to the desk.", "책상 옆에 침대가 하나 있다.", 2, "There|is"],
    ["____ ____ two pictures on the wall.", "벽에 그림 두 장이 있다.", 2, "There|are"],
    ["____ ____ lots of cars on the road.", "길에 차가 많이 있다.", 2, "There|are"],
    ["____ ____ a nest in the tree.", "나무에 둥지가 하나 있다.", 2, "There|is"],
    ["____ ____ a frog on the rock.", "바위 위에 개구리가 한 마리 있다.", 2, "There|is"],
    ["____ ____ three ants under the flower.", "꽃 밑에 개미 세 마리가 있다.", 2, "There|are"],
    ["____ ____ a boy in the classroom? / Yes, there ____.", "교실에 남학생이 한 명 있니? / 응, 있어.", 3, "Are|there|is"],
    ["____ ____ many flowers in the store? / No, there ____.", "가게에 꽃이 많이 있니? / 아니, 없어.", 3, "Are|there|aren't"],
    ["____ ____ two cats under the table? / Yes, there ____.", "식탁 밑에 고양이 두 마리가 있니? / 응, 있어.", 3, "Are|there|are"],
    ["____ ____ any beans on the dish? / Yes, ____ ____.", "접시에 콩이 있니? / 응, 있어.", 4, "Are|there|there|are"],
    ["____ ____ a dog under the bed? / No, ____ ____.", "침대 밑에 개가 있니? / 아니, 없어.", 4, "Is|there|there|isn't"],
    ["____ ____ a bird on the roof? / Yes, ____ ____.", "지붕 위에 새가 있니? / 응, 있어.", 4, "Is|there|there|is"],
    ["____ ____ a dictionary on the chair? / No, ____ ____.", "의자 위에 사전이 있니? / 아니, 없어.", 4, "Is|there|there|isn't"],
    ["____ ____ any flour in the bowl? / No, ____ ____.", "그릇에 밀가루가 있니? / 아니, 없어.", 4, "Is|there|there|isn't"],
  ];
  const bRows = [
    ["There is a river near the farm.", "Is there a river near the farm?", "농장 근처에 강이 있다."],
    ["There are two trees next to the river.", "Are there two trees next to the river?", "강 옆에 나무 두 그루가 있다."],
    ["There are five chicks in the nest.", "Are there five chicks in the nest?", "둥지에 병아리 다섯 마리가 있다."],
    ["There are two rocks next to the tree.", "Are there two rocks next to the tree?", "나무 옆에 바위 두 개가 있다."],
    ["There is a snake between the rocks.", "Is there a snake between the rocks?", "바위 사이에 뱀이 한 마리 있다."],
    ["There is an ant on the rock.", "Is there an ant on the rock?", "바위 위에 개미 한 마리가 있다."],
    ["Is there a pencil case on the desk?", "There is a pencil case on the desk.", "책상 위에 필통이 있니?"],
    ["Is there a waste basket under the desk?", "There is a waste basket under the desk.", "책상 밑에 쓰레기통이 있니?"],
    ["Are there two lamps next to the bed?", "There are two lamps next to the bed.", "침대 옆에 램프 두 개가 있니?"],
    ["Are there two buttons in the bottle?", "There are two buttons in the bottle.", "병 안에 단추 두 개가 있니?"],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const parts = row[3].split("|");
    const it = {
      id: "a" + String(i + 1).padStart(2, "0"),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 1), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        blanks: row[2],
        accept: [row[3]],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = parts.join(" ");
    }
    items.push(it);
  });
  bRows.forEach((row, i) => {
    const it = {
      id: "b" + String(i + 1).padStart(2, "0"),
      ...itemBase("B", "Section B", instrB, "sentence", "Sentence · 문장 전체", "B" + (i + 1), "sentence", {
        promptEn: row[0] + "\n→",
        promptKo: row[2],
        accept: [row[1], row[1].replace(/\?$/, ".")],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  write("lesson01-jump.json", {
    ...META,
    practiceId: "b3:u03:lesson01-jump",
    title: "Grammar Jump — Lesson 01",
    subtitle: "There is/are practice (pp. 68–69)",
    pages: "68–69",
    timerMinutes: 22,
    introKo: "Section A 15문항(빈칸 말만), Section B 10문항(문장 전체). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson01Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 밑줄 친 부분만 고쳐 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.";
  const ruleA = "밑줄 친 부분만 고쳐 쓰세요.";
  const instrB =
    "there is/are와 주어진 말을 사용하여 괄호 안의 지시대로 문장을 완성하세요. 문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)";
  const dirB = "there is/are와 주어진 말을 사용하여 괄호 안의 지시대로 문장을 완성하세요.";
  const ruleB = "문장 전체를 쓰세요.";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 1, [
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
      "A16",
    ]),
    sec("B", "Section B", dirB, ruleB, "sentence", "Sentence · 문장 전체", 14, 1, [
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
      "B16",
    ]),
  ];
  const aRows = [
    ["There <u>is</u> two bicycles on the playground.", "are"],
    ["There <u>are</u> a tall tower on the mountain.", "is"],
    ["<u>Are</u> there a gym in your school?", "Is"],
    ["<u>Is</u> there any cans on the table?", "Are"],
    ["There <u>are</u> a basket under the table.", "is"],
    ["There <u>is</u> a lot of nuts in the bottle.", "are"],
    ["<u>Are</u> there an ambulance in front of the hospital?", "Is"],
    ["There <u>are</u> a lot of rice in the bowl.", "is"],
    ["Is there <u>toothbrushes</u> in the mug?", "toothbrush"],
    ["There are three <u>umbrella</u> in the basket.", "umbrellas"],
    ["Are there four <u>picture</u> on the wall?", "pictures"],
    ["There is <u>trees</u> behind the house.", "tree"],
    ["Is there <u>garden</u> in the house?", "a garden"],
    ["There are <u>flower</u> in the garden.", "flowers"],
    ["Are there <u>butterfly</u> near the flowers?", "butterflies"],
  ];
  const bRows = [
    ["a vase / on the table (의문문)", "Is there a vase on the table?"],
    ["a letter / in the mailbox (평서문)", "There is a letter in the mailbox."],
    ["forty chairs / in the hall (평서문)", "There are forty chairs in the hall."],
    ["mirrors / in the classroom (의문문)", "Are there mirrors in the classroom?"],
    ["a stove / in the kitchen (평서문)", "There is a stove in the kitchen."],
    ["cars / in the garage (의문문)", "Are there cars in the garage?"],
    ["a bathtub / in the bathroom (평서문)", "There is a bathtub in the bathroom."],
    ["a turtle / on the elephant (평서문)", "There is a turtle on the elephant."],
    ["a hamster / in the cage (의문문)", "Is there a hamster in the cage?"],
    ["monkeys / in the tree (의문문)", "Are there monkeys in the tree?"],
    ["some juice / in the glass (평서문)", "There is some juice in the glass."],
    ["carrots / in the basket (의문문)", "Are there carrots in the basket?"],
    ["three cabbages / in the box (평서문)", "There are three cabbages in the box."],
    ["three boys / in the room (평서문)", "There are three boys in the room."],
    ["a roller coaster / in the park (의문문)", "Is there a roller coaster in the park?"],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const it = {
      id: "a" + String(i + 1).padStart(2, "0"),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 1), "fill", {
        promptEn: row[0],
        promptKo: "밑줄 친 부분을 바르게 고쳐 쓰세요.",
        accept: [row[1]],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  bRows.forEach((row, i) => {
    const it = {
      id: "b" + String(i + 1).padStart(2, "0"),
      ...itemBase("B", "Section B", instrB, "sentence", "Sentence · 문장 전체", "B" + (i + 1), "sentence", {
        promptEn: row[0],
        promptKo: "주어진 말로 there is/are 문장을 완성하세요.",
        accept: [row[1]],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[1];
    }
    items.push(it);
  });
  write("lesson01-fly.json", {
    ...META,
    practiceId: "b3:u03:lesson01-fly",
    title: "Grammar Fly — Lesson 01",
    subtitle: "Correct & write there is/are (pp. 70–71)",
    pages: "70–71",
    timerMinutes: 26,
    introKo: "Section A 15문항(밑줄 고치기), Section B 15문항(문장 전체). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson02Walk1() {
  const instrA =
    "다음 문장에서 비인칭 주어 it을 찾아 동그라미 하세요. 동그라미 친 it만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장에서 비인칭 주어 it을 찾아 동그라미 하세요.";
  const ruleA = "동그라미 친 it만 쓰세요.";
  const instrB =
    "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 대답(a~d)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB = "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.";
  const ruleB = "알맞은 대답(a~d)을 하나 골라 누르세요.";
  const choicesB = [
    "a. It is Thursday.",
    "b. It is six ten.",
    "c. It is snowing.",
    "d. It is the second of March.",
  ];
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 6, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8"]),
    sec("B", "Section B", dirB, ruleB, "choice", "Choose · 고르기", 3, 1, ["B2", "B3", "B4", "B5"]),
  ];
  const aData = [
    ["It is nine o'clock.", "9시이다."],
    ["It is four twenty.", "4시 20분이다."],
    ["It is raining.", "비가 온다."],
    ["It is Tuesday.", "화요일이다."],
    ["It is July 10th.", "7월 10일이다."],
    ["What time is it?", "몇 시니?"],
    ["What day is it?", "무슨 요일이니?"],
  ];
  const bData = [
    ["How is the weather today?", "오늘 날씨가 어떠니?", "c"],
    ["What day is it?", "무슨 요일이니?", "a"],
    ["What's the date today?", "오늘이 며칠이니?", "d"],
    ["What time is it?", "몇 시니?", "b"],
  ];
  const items = [];
  items.push({
    id: "a01",
    ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A1", "fill", {
      promptEn: aData[0][0],
      promptKo: aData[0][1],
      accept: ["It", "it"],
      example: true,
      displayOnly: true,
      exampleAnswer: "It",
    }),
  });
  aData.slice(1).forEach((row, i) => {
    items.push({
      id: "a0" + (i + 2),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 2), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: ["It", "it"],
      }),
    });
  });
  items.push({
    id: "b01",
    ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B1", "mc", {
      promptEn: bData[0][0],
      promptKo: bData[0][1],
      choices: choicesB,
      accept: ["c. It is snowing.", "c"],
      example: true,
      displayOnly: true,
      exampleAnswer: "c. It is snowing.",
    }),
  });
  bData.slice(1).forEach((row, i) => {
    const letter = row[2];
    const idx = { a: 0, b: 1, c: 2, d: 3 }[letter];
    items.push({
      id: "b0" + (i + 2),
      ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B" + (i + 2), "mc", {
        promptEn: row[0],
        promptKo: row[1],
        choices: choicesB,
        accept: [choicesB[idx], letter],
      }),
    });
  });
  write("lesson02-walk1.json", {
    ...META,
    practiceId: "b3:u03:lesson02-walk1",
    title: "Grammar Walk — Lesson 02",
    subtitle: "Impersonal it (p. 73)",
    pages: "73",
    timerMinutes: 10,
    introKo: "Section A 7문항(it), Section B 4문항(대답 연결). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson02Walk2() {
  const instrA =
    "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장의 빈칸에 알맞은 말을 쓰세요.";
  const ruleA = "빈칸에 들어갈 말만 쓰세요.";
  const instrB =
    "다음 문장의 빈칸에 들어갈 수 있는 말을 찾아 선으로 연결하세요. 알맞은 보기(a~e)를 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB = "다음 문장의 빈칸에 들어갈 수 있는 말을 찾아 선으로 연결하세요.";
  const ruleB = "알맞은 보기(a~e)를 하나 골라 누르세요.";
  const choicesB = ["a. a piano lesson", "b. get up", "c. play soccer", "d. breakfast", "e. bed"];
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5", "A6"]),
    sec("B", "Section B", dirB, ruleB, "choice", "Choose · 고르기", 2, 0, ["B1", "B2"]),
  ];
  const aPrompts = [
    ["It is time for a snack.", "간식 먹을 시간이다."],
    ["It is _____ to practice taekwondo.", "태권도 연습할 시간이다."],
    ["It is _____ for school.", "학교 갈 시간이다."],
    ["It is _____ to take a walk.", "산책할 시간이다."],
    ["It is _____ to meet Jane.", "제인을 만날 시간이다."],
  ];
  const items = [];
  aPrompts.forEach((row, i) => {
    const it = {
      id: "a0" + (i + 1),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 1), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: ["time", "Time"],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = "time";
    }
    items.push(it);
  });
  items.push({
    id: "b01",
    ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B1", "mc", {
      promptEn: "It is time for _____.",
      promptKo: "피아노 레슨을 받을 시간이다.",
      choices: choicesB,
      accept: ["a. a piano lesson", "a"],
    }),
  });
  items.push({
    id: "b02",
    ...itemBase("B", "Section B", instrB, "choice", "Choose · 고르기", "B2", "mc", {
      promptEn: "It is time to _____.",
      promptKo: "일어날 시간이다.",
      choices: choicesB,
      accept: ["b. get up", "b"],
    }),
  });
  write("lesson02-walk2.json", {
    ...META,
    practiceId: "b3:u03:lesson02-walk2",
    title: "Grammar Walk — Lesson 02 (2)",
    subtitle: "It is time for/to (p. 75)",
    pages: "75",
    timerMinutes: 10,
    introKo: "Section A 5문항(time), Section B 2문항(for/to 연결·고르기). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson02Run() {
  const instrA =
    "다음 대화 또는 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirA = "다음 대화 또는 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.";
  const ruleA = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장 또는 대화의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const dirB = "다음 문장 또는 대화의 빈칸에 알맞은 말을 골라 동그라미 하세요.";
  const ruleB = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "choice", "Choose · 고르기", 14, 1, [
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
      "A16",
    ]),
    sec("B", "Section B", dirB, ruleB, "choice", "Choose · 고르기", 13, 0, [
      "B1",
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
    ]),
  ];
  const aRows = [
    ["A: What day is it? B: ( It / This ) is Monday.", ["It", "This"], "It"],
    ["A: How's the weather? B: ( It / That ) is cool today.", ["It", "That"], "It"],
    ["A: What time is it? B: It is ( Friday / four o'clock ).", ["Friday", "four o'clock"], "four o'clock"],
    ["A: What's the date today? B: ( It is / It does ) September 23rd.", ["It is", "It does"], "It is"],
    ["A: What day is it? B: It is ( five thirty / Wednesday ).", ["five thirty", "Wednesday"], "Wednesday"],
    ["A: What's the date today? B: It is January the ( five / fifth ).", ["five", "fifth"], "fifth"],
    ["A: How's the weather? B: It is ( Saturday / foggy ).", ["Saturday", "foggy"], "foggy"],
    ["A: What's the date today? B: It is ( September 7th / Tuesday ).", ["September 7th", "Tuesday"], "September 7th"],
    ["A: How's the weather? B: It is ( windy / summer ).", ["windy", "summer"], "windy"],
    ["It is time ( for / to ) English class.", ["for", "to"], "for"],
    ["It is time ( for / to ) cook dinner.", ["for", "to"], "to"],
    ["It is time ( for / to ) say goodbye.", ["for", "to"], "to"],
    ["It is time for ( a break / take a break ).", ["a break", "take a break"], "a break"],
    ["A: Is it time to ( a bath / take a bath )? B: Yes, it is.", ["a bath", "take a bath"], "take a bath"],
    ["A: Is it time for ( breakfast / have breakfast )? B: No, it isn't.", ["breakfast", "have breakfast"], "breakfast"],
  ];
  const bRows = [
    ["_______ seven o'clock.", ["It is", "This is"], "It is"],
    ["_______ is Monday.", ["That", "It"], "It"],
    ["_______ snowing.", ["It's", "They're"], "It's"],
    ["It's _______ now.", ["ten fourth", "ten fourteen"], "ten fourteen"],
    ["It's _______ today.", ["September fiveth", "September fifth"], "September fifth"],
    ["It is _______ today.", ["Wednesday", "on Wednesday"], "Wednesday"],
    ["_______ to get up.", ["It's the time", "It's time"], "It's time"],
    ["It is time for _______.", ["a snack", "have a snack"], "a snack"],
    ["It is time to _______.", ["school", "go to school"], "go to school"],
    ["A: _______ B: It's Friday.", ["What time is it?", "What day is it?"], "What day is it?"],
    ["A: What time is it? B: _______", ["It's August 13.", "It's eleven o'clock."], "It's eleven o'clock."],
    ["A: _______ an exam? B: Yes, it is.", ["Is it time for", "Is it time to"], "Is it time for"],
    ["A: _______ take a shower? B: No, it isn't.", ["Is it time for", "Is it time to"], "Is it time to"],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    items.push(
      mcItem(
        "a" + String(i + 1).padStart(2, "0"),
        "A",
        instrA,
        "A" + (i + 1),
        row[0],
        null,
        row[1],
        [row[2], String(row[1].indexOf(row[2]) + 1)],
        i === 0 ? row[2] : undefined
      )
    );
    if (i === 0) {
      items[items.length - 1].example = true;
      items[items.length - 1].displayOnly = true;
      items[items.length - 1].exampleAnswer = row[2];
    }
  });
  bRows.forEach((row, i) => {
    items.push(
      mcItem(
        "b" + String(i + 1).padStart(2, "0"),
        "B",
        instrB,
        "B" + (i + 1),
        row[0],
        null,
        row[1],
        [row[2], String(row[1].indexOf(row[2]) + 1)]
      )
    );
  });
  write("lesson02-run.json", {
    ...META,
    practiceId: "b3:u03:lesson02-run",
    title: "Grammar Run — Lesson 02",
    subtitle: "Impersonal it (pp. 76–77)",
    pages: "76–77",
    timerMinutes: 18,
    introKo: "Section A 15문항(고르기), Section B 13문항(고르기). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson02Jump() {
  const instrA =
    "다음 문장의 우리말 뜻을 완성하세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirA = "다음 문장의 우리말 뜻을 완성하세요.";
  const ruleA = "빈칸에 들어갈 말만 쓰세요.";
  const instrB =
    "비인칭 주어 it과 주어진 말을 사용하여 다음 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const dirB = "비인칭 주어 it과 주어진 말을 사용하여 다음 문장을 완성하세요.";
  const ruleB = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const sections = [
    sec("A", "Section A", dirA, ruleA, "words", "Words · 빈칸 말만", 14, 1, [
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
      "A16",
    ]),
    sec("B", "Section B", dirB, ruleB, "words", "Words · 빈칸 말만", 14, 1, [
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
      "B16",
    ]),
  ];
  const aRows = [
    ["It is cloudy today.", "오늘은 _____다.", ["흐리", "흐려", "구름이 많"]],
    ["It is Tuesday today.", "오늘은 _____.", ["화요일이다", "화요일이야"]],
    ["It is June twentieth today.", "오늘은 _____.", ["6월 20일이다", "6월 20일이야"]],
    ["It is seven thirty now.", "지금은 _____.", ["7시 30분이다", "7시 30분이야"]],
    ["What time is it now?", "지금 _____?", ["몇 시니", "몇 시예요", "몇 시야"]],
    ["What day is it today?", "오늘은 _____?", ["무슨 요일이니", "무슨 요일이에요", "무슨 요일이야"]],
    ["What's the date today?", "오늘이 _____?", ["며칠이니", "며칠이에요", "며칠이야", "몇 일이니"]],
    ["How's the weather now?", "지금 _____?", ["날씨가 어떠니", "날씨가 어때", "날씨가 어떠세요"]],
    ["It is time to get back home.", "집에 돌아갈 _____ .", ["시간", "때"]],
    ["It is very cold today.", "오늘은 무척 _____ .", ["춥다", "추워", "춥"]],
    ["It is the thirty-first of August today.", "오늘은 _____ .", ["8월 31일이다", "8월 31일이야"]],
    ["Is it time for breakfast?", "_____ 시간이니?", ["아침 식사", "아침", "아침을 먹을"]],
    ["It is time to play badminton.", "_____ 시간이다.", ["배드민턴을 칠", "배드민턴 할", "배드민턴", "배드민턴 칠"]],
    ["It is time for bed.", "_____ 시간이다.", ["잘", "자", "잠잘", "취침"]],
    ["Is it time to wake up?", "_____ 시간이니?", ["일어날", "일어나", "깨어날"]],
  ];
  const bRows = [
    ["It is Saturday.", "토요일이다.", "( Saturday )", 2, "It|is"],
    ["____ is ____ . ( twelve, o'clock )", "정각 12시다.", null, 2, "It|is|twelve|o'clock"],
    ["____ is ____ in spring. ( warm )", "봄에는 날씨가 따뜻하다.", null, 2, "It|is|warm"],
    ["____ is the ____ of September. ( twelfth )", "9월 12일이다.", null, 2, "It|is|twelfth"],
    ["____ is ____ a break. ( for, time )", "쉬는 시간이다.", null, 3, "It|is|time|for"],
    ["____ is time ____ e-mail. ( send, to )", "이메일을 보내야 할 시간이다.", null, 3, "It|is|to|send"],
    ["____ time to ____ ? ( be, go swimming )", "수영하러 갈 시간이니?", null, 4, "Is|it|time|to|go swimming"],
    ["____ is ____ today. ( sunny )", "오늘은 화창하다.", null, 2, "It|is|sunny"],
    ["____ is the ____ of ____ . ( November, seventh )", "11월 7일이다.", null, 5, "It|is|the|seventh|of|November"],
    ["____ is ____ . ( seventeen, ten )", "10시 17분이다.", null, 3, "It|is|ten|seventeen"],
    ["____ is time ____ new sneakers. ( buy, to )", "새 운동화를 살 때이다.", null, 3, "It|is|time|to|buy"],
    ["____ is ____ today? ( day, what )", "오늘은 무슨 요일이니?", null, 3, "What|day|is|it"],
    ["____ is ____ outside. ( raining )", "밖에 비가 온다.", null, 2, "It|is|raining"],
    ["____ is time for his birthday party.", "그의 생일 파티를 할 시간이다.", null, 3, "It|is|time"],
    ["____ is ____ today. ( Thursday )", "오늘은 목요일이다.", null, 2, "It|is|Thursday"],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const it = {
      id: "a" + String(i + 1).padStart(2, "0"),
      ...itemBase("A", "Section A", instrA, "words", "Words · 빈칸 말만", "A" + (i + 1), "fill", {
        promptEn: row[0],
        promptKo: row[1],
        accept: row[2],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[2][0];
    }
    items.push(it);
  });
  bRows.forEach((row, i) => {
    const parts = row[4].split("|");
    const it = {
      id: "b" + String(i + 1).padStart(2, "0"),
      ...itemBase("B", "Section B", instrB, "words", "Words · 빈칸 말만", "B" + (i + 1), "fill", {
        promptEn: row[0] + (row[2] ? " " + row[2] : ""),
        promptKo: row[1],
        blanks: parts.length,
        accept: [row[4]],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = "It is";
    }
    items.push(it);
  });
  write("lesson02-jump.json", {
    ...META,
    practiceId: "b3:u03:lesson02-jump",
    title: "Grammar Jump — Lesson 02",
    subtitle: "Impersonal it (pp. 78–79)",
    pages: "78–79",
    timerMinutes: 22,
    introKo: "Section A 15문항(우리말), Section B 15문항(빈칸 말만). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function lesson02Fly() {
  const instrA =
    "다음 우리말 뜻과 같도록 괄호 안에 주어진 말을 사용하여 문장을 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)";
  const dirA = "다음 우리말 뜻과 같도록 괄호 안에 주어진 말을 사용하여 문장을 쓰세요.";
  const ruleA = "문장 전체를 쓰세요.";
  const instrB =
    "다음 우리말 뜻과 같도록 괄호 안에 주어진 말을 사용하여 문장을 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)";
  const dirB = dirA;
  const sections = [
    sec("A", "Section A", dirA, ruleA, "sentence", "Sentence · 문장 전체", 9, 1, [
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
    ]),
    sec("B", "Section B", dirB, ruleA, "sentence", "Sentence · 문장 전체", 9, 1, [
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
    ]),
  ];
  const aRows = [
    ["10시 30분이다.", "( it / ten / thirty / is )", "It is ten thirty."],
    ["오늘은 수요일이다.", "( Wednesday / is / it / today )", "It is Wednesday today."],
    ["몇 시니?", "( time / it / is / what / now )", "What time is it now?"],
    ["여름에는 덥고 습하다.", "( is / hot and humid / it / in summer )", "It is hot and humid in summer."],
    ["2월 6일이다.", "( February / it / sixth / is )", "It is February sixth."],
    ["무슨 요일이니?", "( it / is / day / what )", "What day is it?"],
    ["학교에 갈 시간이다.", "( it / time / for / is / school )", "It is time for school."],
    ["날씨가 어떠니?", "( the weather / how / is )", "How is the weather?"],
    ["정각 7시다.", "( seven / is / o'clock / it )", "It is seven o'clock."],
    ["자야 할 시간이다.", "( is / it / to / time / go to bed )", "It is time to go to bed."],
  ];
  const bRows = [
    ["오늘은 날씨가 따뜻하다.", "( warm )", "It is warm today."],
    ["5시 20분이다.", "( five, twenty )", "It is five twenty."],
    ["토요일이다.", "( Saturday )", "It is Saturday."],
    ["3월 8일이다.", "( March, eighth )", "It is March eighth."],
    ["6시 정각이다.", "( six, o'clock )", "It is six o'clock."],
    ["점심 식사를 할 시간이다.", "( for, lunch )", "It is time for lunch."],
    ["밖에 눈이 오고 있다.", "( snowing, outside )", "It is snowing outside."],
    ["집에 돌아갈 시간이다.", "( get back home )", "It is time to get back home."],
    ["9시 45분이다.", "( nine, forty-five )", "It is nine forty-five."],
    ["10월 3일이다.", "( October, third )", "It is October third."],
  ];
  const items = [];
  aRows.forEach((row, i) => {
    const it = {
      id: "a" + String(i + 1).padStart(2, "0"),
      ...itemBase("A", "Section A", instrA, "sentence", "Sentence · 문장 전체", "A" + (i + 1), "sentence", {
        promptKo: row[0] + " " + row[1],
        accept: [row[2], row[2].replace(/\.$/, "?")],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[2];
    }
    items.push(it);
  });
  bRows.forEach((row, i) => {
    const it = {
      id: "b" + String(i + 1).padStart(2, "0"),
      ...itemBase("B", "Section B", instrB, "sentence", "Sentence · 문장 전체", "B" + (i + 1), "sentence", {
        promptKo: row[0] + " " + row[1],
        accept: [row[2]],
      }),
    };
    if (i === 0) {
      it.example = true;
      it.displayOnly = true;
      it.exampleAnswer = row[2];
    }
    items.push(it);
  });
  write("lesson02-fly.json", {
    ...META,
    practiceId: "b3:u03:lesson02-fly",
    title: "Grammar Fly — Lesson 02",
    subtitle: "Write with impersonal it (pp. 80–81)",
    pages: "80–81",
    timerMinutes: 26,
    introKo: "Section A 10문항, Section B 10문항(문장 전체). 예시는 채점하지 않아요.",
    sections,
    items,
  });
}

function review03() {
  const introKo =
    "Review 03은 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요. 각 섹션 안내에 따라 고르기·빈칸·문장 전체를 구분하세요.";
  const sections = [
    sec(
      "1-2",
      "[1–2]",
      "다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["1", "2"]
    ),
    sec(
      "3-4",
      "[3–4]",
      "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["3", "4"]
    ),
    sec(
      "5-6",
      "[5–6]",
      "다음 중 짝지어진 대화가 어색한 것을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["5", "6"]
    ),
    sec(
      "7",
      "[7]",
      "다음 문장의 빈칸에 공통으로 알맞은 말을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      1,
      0,
      ["7"]
    ),
    sec(
      "8",
      "[8]",
      "다음 문장의 빈칸에 알맞은 말이 순서대로 바르게 짝지어진 것을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      1,
      0,
      ["8"]
    ),
    sec(
      "9",
      "[9]",
      "다음 빈칸에 들어갈 수 없는 말을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      1,
      0,
      ["9"]
    ),
    sec(
      "10-11",
      "[10–11]",
      "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      2,
      0,
      ["10", "11"]
    ),
    sec(
      "12",
      "[12]",
      "다음 대화의 밑줄 친 부분이 잘못된 것을 고르세요.",
      "보기 중 하나를 골라 누르세요.",
      "choice",
      "Choose · 고르기",
      1,
      0,
      ["12"]
    ),
    sec(
      "13",
      "[13]",
      "다음 대화의 빈칸에 알맞은 말을 순서대로 쓰세요.",
      "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      1,
      0,
      ["13"]
    ),
    sec(
      "14-15",
      "[14–15]",
      "다음 의문문에 대한 대답을 완성하세요.",
      "빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      2,
      0,
      ["14", "15"]
    ),
    sec(
      "16",
      "[16]",
      "다음 문장을 의문문으로 바꿔 쓰세요.",
      "문장 전체를 쓰세요.",
      "sentence",
      "Sentence · 문장 전체",
      1,
      0,
      ["16"]
    ),
    sec(
      "17-18",
      "[17–18]",
      "다음 우리말 뜻과 같도록 빈칸에 알맞은 말을 쓰세요.",
      "빈칸에 들어갈 말만 쓰세요.",
      "words",
      "Words · 빈칸 말만",
      2,
      0,
      ["17", "18"]
    ),
    sec(
      "19-20",
      "[19–20]",
      "다음 문장에서 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요.",
      "문장 전체를 쓰세요.",
      "sentence",
      "Sentence · 문장 전체",
      2,
      0,
      ["19", "20"]
    ),
  ];
  sections.forEach((s) => {
    s.instructionKo = `${s.title} ${s.directionKo} ${s.ruleKo}`;
  });
  const items = [];
  const pushMc = (id, section, label, promptEn, promptKo, choices, accept) => {
    const s = sections.find((x) => x.id === section);
    items.push({
      id,
      section,
      sectionTitle: section.replace("-", "–"),
      sectionInstructionKo: s.instructionKo,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      label,
      type: "mc",
      promptEn,
      promptKo,
      choices,
      accept: Array.isArray(accept) ? accept : [accept, String(accept)],
    });
  };
  pushMc(
    "q01",
    "1-2",
    "1",
    "Choose the sentence where the underlined word is used differently.",
    "밑줄 친 there의 쓰임이 다른 것",
    [
      "① There is a clock on the desk.",
      "② Is there a TV in the bedroom?",
      "③ A bear is sleeping there.",
      "④ There are three lions in the zoo.",
    ],
    ["3", "③ A bear is sleeping there.", "A bear is sleeping there."]
  );
  pushMc(
    "q02",
    "1-2",
    "2",
    "Choose the sentence where the underlined word is used differently.",
    "밑줄 친 it의 쓰임이 다른 것",
    [
      "① It is very hot today.",
      "② It is my brother's bag.",
      "③ It is time for lunch.",
      "④ It is August ninth.",
    ],
    ["2", "② It is my brother's bag.", "It is my brother's bag."]
  );
  pushMc(
    "q03",
    "3-4",
    "3",
    "Choose the incorrect sentence.",
    "밑줄 친 부분이 틀린 문장",
    [
      "① There is a mirror in the room.",
      "② There are some milk in the bottle.",
      "③ There is a bee on the flower.",
      "④ Is there a cap under the bed?",
    ],
    ["2", "② There are some milk in the bottle."]
  );
  pushMc(
    "q04",
    "3-4",
    "4",
    "Choose the incorrect sentence.",
    null,
    [
      "① It is time for dinner.",
      "② It is time to go shopping.",
      "③ It is time for play baseball.",
      "④ It is time to get up.",
    ],
    ["3", "③ It is time for play baseball."]
  );
  pushMc(
    "q05",
    "5-6",
    "5",
    "Choose the unnatural dialogue.",
    null,
    [
      "① A: What time is it? / B: It's eleven o'clock.",
      "② A: What day is it? / B: It's May fifth.",
      "③ A: How's the weather? / B: It's cloudy.",
      "④ A: What's the date today? / B: It's October ninth.",
    ],
    ["2", "② A: What day is it? / B: It's May fifth."]
  );
  pushMc(
    "q06",
    "5-6",
    "6",
    "Choose the unnatural dialogue.",
    null,
    [
      "① A: Is there a dog under the slide? / B: Yes, there is.",
      "② A: Is there a knife in the sink? / B: No, there isn't.",
      "③ A: Are there cows on the farm? / B: Yes, they are.",
      "④ A: Are there two gloves on his bed? / B: No, there aren't.",
    ],
    ["3", "③ A: Are there cows on the farm? / B: Yes, they are."]
  );
  pushMc(
    "q07",
    "7",
    "7",
    "_______ is time for bed. / _______ is raining today.",
    "두 빈칸에 공통으로 들어갈 말",
    ["① It", "② This", "③ There", "④ That"],
    ["1", "① It", "It"]
  );
  pushMc(
    "q08",
    "8",
    "8",
    "_______ is a bird on the roof. / _______ is April the first.",
    "순서대로 짝",
    ["① It – This", "② There – It", "③ It – There", "④ There – That"],
    ["2", "② There – It", "There – It"]
  );
  pushMc(
    "q09",
    "9",
    "9",
    "It is ________.",
    "들어갈 수 없는 말",
    ["① very windy", "② March 25th", "③ Sunday", "④ tomatoes"],
    ["4", "④ tomatoes", "tomatoes"]
  );
  pushMc(
    "q10",
    "10-11",
    "10",
    "침대 밑에 강아지 한 마리가 있니?\n( Is / Are ) there a puppy under the bed?",
    null,
    ["Is", "Are"],
    ["Is", "1"]
  );
  pushMc(
    "q11",
    "10-11",
    "11",
    "수영하러 갈 시간이다.\nIt is time ( for / to ) go swimming.",
    null,
    ["for", "to"],
    ["to", "2"]
  );
  pushMc(
    "q12",
    "12",
    "12",
    "A: Is there children in the room? B: Yes, there are.",
    "잘못된 밑줄 친 부분",
    ["① Is there", "② in", "③ there", "④ are", "children (subject)"],
    ["1", "Is there", "Is", "children"]
  );
  const s13 = sections.find((x) => x.id === "13");
  items.push({
    id: "q13",
    section: "13",
    sectionTitle: "[13]",
    sectionInstructionKo: s13.instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: "13",
    type: "fill",
    promptEn: "A: What day is ______ today?\nB: ______ is Sunday today.",
    promptKo: "오늘은 일요일이다.",
    blanks: 2,
    accept: ["it|It", "It|it"],
  });
  const s1415 = sections.find((x) => x.id === "14-15");
  items.push({
    id: "q14",
    section: "14-15",
    sectionTitle: "[14–15]",
    sectionInstructionKo: s1415.instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: "14",
    type: "fill",
    promptEn: "Are there three pencils in the pencil case?\nNo, ______ ______.",
    promptKo: "필통에 연필 세 자루 없음 — 대답 완성",
    blanks: 2,
    accept: ["there|aren't", "there|are not"],
  });
  items.push({
    id: "q15",
    section: "14-15",
    sectionTitle: "[14–15]",
    sectionInstructionKo: s1415.instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: "15",
    type: "fill",
    promptEn: "What's the date today?\n______ ______ June the 7th.",
    promptKo: "오늘 날짜 — 6월 7일",
    blanks: 2,
    accept: ["It|is", "It's"],
  });
  const s16 = sections.find((x) => x.id === "16");
  items.push({
    id: "q16",
    section: "16",
    sectionTitle: "[16]",
    sectionInstructionKo: s16.instructionKo,
    answerMode: "sentence",
    answerModeTag: "Sentence · 문장 전체",
    label: "16",
    type: "sentence",
    promptEn: "There is a stove in the kitchen.\n→",
    promptKo: "부엌에 가스레인지가 있다. → 의문문",
    accept: ["Is there a stove in the kitchen?"],
  });
  const s1718 = sections.find((x) => x.id === "17-18");
  items.push({
    id: "q17",
    section: "17-18",
    sectionTitle: "[17–18]",
    sectionInstructionKo: s1718.instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: "17",
    type: "fill",
    promptKo: "그 동물원에 치타가 있니?",
    promptEn: "______ ______ cheetahs in the zoo?",
    blanks: 2,
    accept: ["Are|there"],
  });
  items.push({
    id: "q18",
    section: "17-18",
    sectionTitle: "[17–18]",
    sectionInstructionKo: s1718.instructionKo,
    answerMode: "words",
    answerModeTag: "Words · 빈칸 말만",
    label: "18",
    type: "fill",
    promptKo: "집에 가야 할 시간이다.",
    promptEn: "It is ______ ______ go home.",
    blanks: 2,
    accept: ["time|to"],
  });
  const s1920 = sections.find((x) => x.id === "19-20");
  items.push({
    id: "q19",
    section: "19-20",
    sectionTitle: "[19–20]",
    sectionInstructionKo: s1920.instructionKo,
    answerMode: "sentence",
    answerModeTag: "Sentence · 문장 전체",
    label: "19",
    type: "sentence",
    promptEn: "There <u>is</u> a lot of cars on the road.\n→ corrected:",
    promptKo: "길에 차가 많이 있다. — 고쳐 쓰기",
    accept: ["There are a lot of cars on the road."],
  });
  items.push({
    id: "q20",
    section: "19-20",
    sectionTitle: "[19–20]",
    sectionInstructionKo: s1920.instructionKo,
    answerMode: "sentence",
    answerModeTag: "Sentence · 문장 전체",
    label: "20",
    type: "sentence",
    promptEn: "It is time <u>for</u> take a bath.\n→ corrected:",
    promptKo: "목욕할 시간이다. — 고쳐 쓰기",
    accept: ["It is time to take a bath."],
  });
  write("review03.json", {
    ...META,
    practiceId: "b3:u03:review03",
    title: "Review 03",
    subtitle: "Unit 03 there, it (pp. 82–84)",
    pages: "82–84",
    timerMinutes: 30,
    introKo,
    sections,
    items,
  });
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  lesson01Walk1();
  lesson01Walk2();
  lesson01Run();
  lesson01Jump();
  lesson01Fly();
  lesson02Walk1();
  lesson02Walk2();
  lesson02Run();
  lesson02Jump();
  lesson02Fly();
  review03();
  console.log("Wrote Unit 03 JSON to", OUT);
}

main();
