/* Generate data/blue3/unit07/*.json — run: node scripts/blue3-build/unit07-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue3/unit07");
const META = {
  bookId: "zap-blue-3",
  bookTitle: "ZAP Blue 3",
  appName: "BlueZap 3",
  unitId: "unit-07",
  unitTitle: "Unit 07 — 과거 시제 - 일반동사",
};

function sec(id, title, instructionKo, directionKo, ruleKo, answerMode, tag, itemCount, exampleCount, labels) {
  return { id, title, instructionKo, directionKo, ruleKo, answerMode, answerModeTag: tag, itemCount, exampleCount, labels };
}

function ex(base, exampleAnswer) {
  return Object.assign({}, base, { example: true, displayOnly: true, exampleAnswer });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + "\n");
  const graded = data.items.filter((i) => !i.displayOnly).length;
  console.log("wrote", name, "items", data.items.length, "graded", graded);
}

function pack(practiceId, title, subtitle, pages, timerMinutes, sections, items, extra) {
  return {
    practiceId,
    title,
    subtitle,
    pages,
    timerMinutes,
    ...META,
    sectionsVersion: 2,
    introKo: extra?.introKo || "",
    sections,
    items,
    ...(extra?.wordBank ? { wordBank: extra.wordBank } : {}),
  };
}

function mcItem(id, section, label, promptEn, choices, accept, sectionInstructionKo, opts) {
  opts = opts || {};
  return Object.assign(
    {
      id,
      section,
      sectionTitle: opts.sectionTitle || "Section " + section,
      sectionInstructionKo,
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      label,
      type: "mc",
      promptEn,
      choices,
      accept: Array.isArray(accept) ? accept : [accept],
    },
    opts.extra || {}
  );
}

function fillItem(id, section, label, promptEn, accept, sectionInstructionKo, opts) {
  opts = opts || {};
  const item = {
    id,
    section,
    sectionTitle: opts.sectionTitle || "Section " + section,
    sectionInstructionKo,
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
  if (opts.unordered) item.unordered = true;
  return item;
}

function sentItem(id, section, label, promptEn, accept, sectionInstructionKo, opts) {
  return fillItem(id, section, label, promptEn, accept, sectionInstructionKo, {
    ...opts,
    answerMode: "sentence",
    answerModeTag: "Sentence · 문장 전체",
    type: "sentence",
  });
}

function koVariants(primary, alts) {
  const s = new Set([primary, ...(alts || [])]);
  return [...s];
}

// —— Lesson 01 Walk (p. 168) ——
(function lesson01Walk() {
  const instrA =
    "다음 문장에서 동사를 찾아 동그라미 하세요. 동그라미 친 동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 빈칸에 알맞은 규칙을 써 넣고, 주어진 동사의 과거형을 완성하세요. 빈칸마다 들어갈 말을 | 로 구분해 두 칸에 쓰세요. (예: ed|helped)";
  const secA = sec("A", "Section A — 동사", instrA, "다음 문장에서 동사를 찾아 동그라미 하세요.", "동그라미 친 동사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B — 규칙·과거형", instrB, "규칙과 과거형을 완성하세요.", "suffix|과거형 형식으로 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "My father cooked dinner yesterday.", ["cooked"], instrA, {
        promptKo: "아버지는 어제 저녁을 요리하셨다.",
      }),
      "cooked"
    ),
    fillItem("a02", "A", "A2", "I visited my grandparents last Saturday.", ["visited"], instrA, {
      promptKo: "나는 지난 토요일에 조부모님을 방문했다.",
    }),
    fillItem("a03", "A", "A3", "Sally wanted the pink hairpin.", ["wanted"], instrA, {
      promptKo: "샐리는 분홍색 머리핀을 원했다.",
    }),
    fillItem("a04", "A", "A4", "We arrived there in time.", ["arrived"], instrA, { promptKo: "우리는 제시간에 거기에 도착했다." }),
    fillItem("a05", "A", "A5", "They closed the bookstore last year.", ["closed"], instrA, {
      promptKo: "그들은 작년에 서점을 닫았다.",
    }),
    ex(
      fillItem("b01", "B", "B1", "help →", ["ed|helped", "ed|helped"], instrB, { blanks: 2, promptKo: "help + ed → helped" }),
      "ed|helped"
    ),
  ];
  const bRows = [
    ["hate", ["d|hated"]],
    ["show", ["ed|showed"]],
    ["like", ["d|liked"]],
    ["walk", ["ed|walked"]],
    ["look", ["ed|looked"]],
    ["need", ["ed|needed"]],
    ["dance", ["d|danced"]],
    ["play", ["ed|played"]],
    ["love", ["d|loved"]],
  ];
  bRows.forEach(([v, acc], i) => {
    items.push(fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), v + " →", acc, instrB, { blanks: 2 }));
  });
  write(
    "lesson01-walk.json",
    pack("b3:u07:lesson01-walk", "Grammar Walk — Lesson 01", "과거형 -ed (p. 168)", "168", 10, [secA, secB], items, {
      introKo:
        "Section A 4문항(동사), Section B 9문항(규칙+과거형). B는 suffix|과거형 두 칸입니다. 회색 예시는 채점하지 않아요.",
    })
  );
})();

// —— Lesson 02 Walk (p. 170) ——
(function lesson02Walk() {
  const instrA =
    "다음 문장에서 동사를 찾아 동그라미 하세요. 동그라미 친 동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "빈칸에 알맞은 규칙을 써 넣고, 주어진 동사의 과거형을 완성하세요. 빈칸마다 들어갈 말을 | 로 구분해 두 칸에 쓰세요.";
  const secA = sec("A", "Section A", instrA, "다음 문장에서 동사를 찾아 동그라미 하세요.", "동그라미 친 동사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B", instrB, "규칙과 과거형을 완성하세요.", "suffix|과거형 형식으로 쓰세요.", "words", "Words · 빈칸 말만", 8, 2, ["B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "We studied English hard yesterday.", ["studied"], instrA, {
        promptKo: "우리는 어제 영어를 열심히 공부했다.",
      }),
      "studied"
    ),
    fillItem("a02", "A", "A2", "John hugged the child then.", ["hugged"], instrA, { promptKo: "존은 그때 그 아이를 껴안았다." }),
    fillItem("a03", "A", "A3", "The boy cried loudly last night.", ["cried"], instrA, { promptKo: "그 소년은 어젯밤에 크게 울었다." }),
    fillItem("a04", "A", "A4", "They carried the boxes in the morning.", ["carried"], instrA, {
      promptKo: "그들은 아침에 상자들을 옮겼다.",
    }),
    fillItem("a05", "A", "A5", "She shopped at the market this afternoon.", ["shopped"], instrA, {
      promptKo: "그녀는 오늘 오후에 시장에서 쇼핑했다.",
    }),
    ex(
      fillItem("b01", "B", "B1", "copy →", ["ied|copied"], instrB, { blanks: 2, promptKo: "copy + ied → copied" }),
      "ied|copied"
    ),
    ex(
      fillItem("b02", "B", "B2", "drop →", ["ped|dropped"], instrB, { blanks: 2, promptKo: "drop + ped → dropped" }),
      "ped|dropped"
    ),
  ];
  const bRows = [
    ["dry", "ied|dried"],
    ["worry", "ied|worried"],
    ["jog", "ged|jogged"],
    ["try", "ied|tried"],
    ["clap", "ped|clapped"],
    ["reply", "ied|replied"],
    ["fry", "ied|fried"],
    ["stop", "ped|stopped"],
  ];
  bRows.forEach(([v, acc], i) => {
    items.push(fillItem("b" + String(i + 3).padStart(2, "0"), "B", "B" + (i + 3), v + " →", [acc], instrB, { blanks: 2 }));
  });
  write(
    "lesson02-walk.json",
    pack("b3:u07:lesson02-walk", "Grammar Walk — Lesson 02", "과거형 철자 변화 (p. 170)", "170", 10, [secA, secB], items, {
      introKo: "Section A 4문항, Section B 8문항. B의 1–2번(copy·drop)은 예시입니다.",
    })
  );
})();

// —— Lesson 03 Walk (p. 172) ——
(function lesson03Walk() {
  const instrA =
    "다음 문장에서 동사를 찾아 동그라미 하세요. 동그라미 친 동사만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 동사의 과거형을 찾아 선으로 연결하세요. 알맞은 과거형(a~g)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const pastChoices = [
    "a. knew",
    "b. made",
    "c. saw",
    "d. began",
    "e. cut",
    "f. left",
    "g. read",
  ];
  const secA = sec("A", "Section A", instrA, "다음 문장에서 동사를 찾아 동그라미 하세요.", "동그라미 친 동사만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B", instrB, "과거형을 연결하세요.", "a~g 중 하나를 고르세요.", "choice", "Choose · 고르기", 6, 1, ["B2", "B3", "B4", "B5", "B6", "B7"]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "She came to Korea last year.", ["came"], instrA, { promptKo: "그녀는 작년에 한국에 왔다." }),
      "came"
    ),
    fillItem("a02", "A", "A2", "I slept well last night.", ["slept"], instrA, { promptKo: "나는 어젯밤에 잘 잤다." }),
    fillItem("a03", "A", "A3", "Mom put some sugar in her tea.", ["put"], instrA, { promptKo: "엄마는 차에 설탕을 조금 넣으셨다." }),
    fillItem("a04", "A", "A4", "They met Susie this morning.", ["met"], instrA, { promptKo: "그들은 오늘 아침에 수지를 만났다." }),
    fillItem("a05", "A", "A5", "He wrote a letter yesterday.", ["wrote"], instrA, { promptKo: "그는 어제 편지를 썼다." }),
    ex(
      mcItem("b01", "B", "B1", "begin →", pastChoices, ["d. began", "d", "began"], instrB),
      "d. began"
    ),
  ];
  const match = [
    ["cut", "e. cut", "e"],
    ["leave", "f. left", "f"],
    ["know", "a. knew", "a"],
    ["read", "g. read", "g"],
    ["make", "b. made", "b"],
    ["see", "c. saw", "c"],
  ];
  match.forEach(([v, ans, letter], i) => {
    items.push(mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), v + " →", pastChoices, [ans, letter, ans.slice(3)], instrB));
  });
  write(
    "lesson03-walk.json",
    pack("b3:u07:lesson03-walk", "Grammar Walk — Lesson 03", "불규칙 과거형 (p. 172)", "172", 10, [secA, secB], items, {
      introKo: "Section A 4문항(동사), Section B 6문항(과거형 고르기). 보기 a~g는 책과 같은 순서입니다.",
    })
  );
})();

// —— Lesson 03 Run (pp. 173–174) ——
(function lesson03Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const secA = sec("A", "Section A", instrA, "괄호 안에서 고르세요.", "하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
  ]);
  const secB = sec("B", "Section B", instrB, "빈칸에 알맞은 과거형을 고르세요.", "하나를 골라 누르세요.", "choice", "Choose · 고르기", 15, 0, [
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15",
  ]);
  const mcA = (id, label, prompt, c0, c1, pick, exFlag) => {
    const it = mcItem(id, "A", label, prompt, [c0, c1], [pick], instrA);
    return exFlag ? ex(it, pick) : it;
  };
  const items = [
    mcA("a01", "A1", "I ( live / lived ) in Jeonju in 2007.", "live", "lived", "lived", true),
    mcA("a02", "A2", "Alice ( calls / called ) me last night.", "calls", "called", "called"),
    mcA("a03", "A3", "Danny ( visits / visited ) Mr. Dover yesterday.", "visits", "visited", "visited"),
    mcA("a04", "A4", "Her brother ( likes / liked ) soccer then.", "likes", "liked", "liked"),
    mcA("a05", "A5", "It ( snows / snowed ) all day long yesterday.", "snows", "snowed", "snowed"),
    mcA("a06", "A6", "Tim and I ( practice / practiced ) taekwondo last Saturday.", "practice", "practiced", "practiced"),
    mcA("a07", "A7", "My dog ( loved / loveed ) my shoes.", "loved", "loveed", "loved"),
    mcA("a08", "A8", "My aunt ( baking / baked ) delicious cookies last weekend.", "baking", "baked", "baked"),
    mcA("a09", "A9", "The police officer ( closed / closeed ) the window.", "closed", "closeed", "closed"),
    mcA("a10", "A10", "She ( droped / dropped ) the cup.", "droped", "dropped", "dropped"),
    mcA("a11", "A11", "A car ( stoped / stopped ) in front of my house.", "stoped", "stopped", "stopped"),
    mcA("a12", "A12", "He ( shoped / shopped ) with his father this afternoon.", "shoped", "shopped", "shopped"),
    mcA("a13", "A13", "They ( studyed / studied ) science last night.", "studyed", "studied", "studied"),
    mcA("a14", "A14", "We ( carried / carryed ) the heavy bags.", "carried", "carryed", "carried"),
    mcA("a15", "A15", "Andy ( worryed / worried ) about his sister.", "worryed", "worried", "worried"),
  ];
  const bRows = [
    ["I ______ a headache last night.", ["haved", "had"], "had"],
    ["She ______ to school at eight today.", ["went", "goed"], "went"],
    ["Minho ______ a cap yesterday.", ["buyed", "bought"], "bought"],
    ["You ______ a lie.", ["telled", "told"], "told"],
    ["We ______ her name.", ["knew", "knowed"], "knew"],
    ["The concert ______ at eight p.m.", ["begined", "began"], "began"],
    ["He ______ the rope with scissors.", ["cut", "cutted"], "cut"],
    ["They ______ bicycles along the river.", ["rided", "rode"], "rode"],
    ["My brother ______ up the stairs.", ["runed", "ran"], "ran"],
    ["I ______ blue jeans yesterday.", ["wore", "weared"], "wore"],
    ["Ms. Smith ______ letters last year.", ["writes", "wrote"], "wrote"],
    ["I ______ them in the park yesterday.", ["met", "meeted"], "met"],
    ["We ______ a snowman in the yard.", ["maked", "made"], "made"],
    ["She ______ the handsome boy this morning.", ["see", "saw"], "saw"],
    ["Dad ______ in the sea this afternoon.", ["swim", "swam"], "swam"],
  ];
  bRows.forEach(([prompt, choices, ans], i) => {
    items.push(mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), prompt, choices, [ans, String(choices.indexOf(ans) + 1)], instrB));
  });
  write(
    "lesson03-run.json",
    pack("b3:u07:lesson03-run", "Grammar Run", "과거형 고르기 (pp. 173–174)", "173–174", 19, [secA, secB], items, {
      introKo: "Section A 14문항, Section B 15문항(불규칙 과거형).",
    })
  );
})();

// —— Lesson 03 Jump (pp. 175–176) ——
(function lesson03Jump() {
  const instrA =
    "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "주어진 동사의 과거형을 사용하여 다음 문장을 완성하세요. 빈칸에 들어갈 과거형만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const secA = sec("A", "Section A", instrA, "밑줄 친 동사의 우리말 뜻을 쓰세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
  ]);
  const secB = sec("B", "Section B", instrB, "과거형으로 문장을 완성하세요.", "과거형만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
    "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15",
  ]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "We <u>walked</u> along the beach.\n우리는 해변을 따라 ______.", koVariants("걸었다", ["걸었어", "걸었어요"]), instrA),
      "걸었다"
    ),
  ];
  const koRows = [
    ["She <u>opened</u> the window.\n그녀는 창문을 ______.", koVariants("열었다", ["열었어", "열었어요"])],
    ["It <u>rained</u> yesterday.\n어제는 ______.", koVariants("비가 왔다", ["비가왔다", "비가 내렸다", "비가내렸다"])],
    ["Harry <u>played</u> the cello yesterday.\n해리는 어제 첼로를 ______.", koVariants("쳤다", ["연주했다", "연주했어"])],
    ["They <u>watched</u> TV last night.\n그들은 어젯밤에 TV를 ______.", koVariants("봤다", ["보았다", "봤어"])],
    ["Maria <u>dropped</u> her ice cream.\n마리아는 아이스크림을 ______.", koVariants("떨어뜨렸다", ["떨어뜨렸어"])],
    ["The musical <u>finished</u> at ten p.m.\n그 뮤지컬은 오후 10시에 ______.", koVariants("끝났다", ["끝났어", "끝났어요"])],
    ["They <u>stayed</u> home last weekend.\n그들은 지난 주말에 집에 ______.", koVariants("머물렀다", ["머물렀어", "있었다"])],
    ["Emily <u>ran</u> fast then.\n에밀리는 그때 빠르게 ______.", koVariants("달렸다", ["뛰었다", "뛰었어"])],
    ["I <u>did</u> my homework before dinner.\n나는 저녁 식사 전에 숙제를 ______.", koVariants("했다", ["했어", "했어요"])],
    ["He <u>sold</u> vegetables at the market.\n그는 시장에서 채소를 ______.", koVariants("팔았다", ["팔았어"])],
    ["Ms. Porter <u>left</u> for China.\n포터 씨는 중국으로 ______.", koVariants("떠났다", ["출발했다", "떠났어"])],
    ["You <u>drank</u> a glass of apple juice.\n너는 사과 주스 한 잔을 ______.", koVariants("마셨다", ["마셨어"])],
    ["I <u>slept</u> on the sofa last night.\n나는 어젯밤 소파에서 ______.", koVariants("잤다", ["잤어", "잤어요"])],
    ["We <u>wrote</u> Christmas cards.\n우리는 크리스마스 카드를 ______.", koVariants("썼다", ["작성했다", "썼어"])],
  ];
  koRows.forEach(([p, acc], i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), p, acc, instrA));
  });
  items.push(
    ex(
      fillItem("b01", "B", "B1", "The class ______ at nine o'clock. (start)", ["started"], instrB, { promptKo: "수업은 9시에 시작했다." }),
      "started"
    )
  );
  const pastB = [
    ["They ______ in Seoul last night. (arrive)", "arrived"],
    ["I ______ the kitten. (hug)", "hugged"],
    ["We ______ hard last week. (study)", "studied"],
    ["He ______ the sick children. (help)", "helped"],
    ["The alligator ______ its mouth. (close)", "closed"],
    ["My little sister often ______ at night. (cry)", "cried"],
    ["A truck ______ at the bus stop. (stop)", "stopped"],
    ["Dad ______ his birthday cake. (cut)", "cut"],
    ["Tony ______ her name. (know)", "knew"],
    ["I ______ shopping with my mom last Saturday. (go)", "went"],
    ["Emily ______ her bag on the table. (put)", "put"],
    ["A bird ______ on the roof. (sing)", "sang"],
    ["You ______ the book last week. (read)", "read"],
    ["She ______ six eggs this morning. (buy)", "bought"],
  ];
  pastB.forEach(([p, ans], i) => {
    items.push(fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), p, [ans], instrB));
  });
  write(
    "lesson03-jump.json",
    pack("b3:u07:lesson03-jump", "Grammar Jump", "우리말·과거형 (pp. 175–176)", "175–176", 23, [secA, secB], items, {
      introKo: "Section A 14문항(우리말), Section B 14문항(과거형).",
    })
  );
})();

// —— Lesson 03 Fly (pp. 177–178) ——
(function lesson03Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 과거 시제의 문장으로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  const secA = sec("A", "Section A", instrA, "밑줄 친 동사를 고치세요.", "과거형만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
  ]);
  const secB = sec("B", "Section B", instrB, "과거 시제 문장으로 바꾸세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 14, 1, [
    "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15",
  ]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "He <u>learns</u> Chinese last year.", ["learned"], instrA, { promptKo: "그는 작년에 중국어를 배웠다." }),
      "learned"
    ),
  ];
  const fixA = [
    ["Jake <u>uses</u> chopsticks then.", "used"],
    ["The truck often <u>carries</u> food last year.", "carried"],
    ["She <u>jogs</u> yesterday morning.", "jogged"],
    ["We <u>listen</u> to the radio then.", "listened"],
    ["I <u>loveed</u> hip-hop music last year.", "loved"],
    ["They <u>studyed</u> science together yesterday.", "studied"],
    ["I <u>droped</u> my bag in the morning.", "dropped"],
    ["She <u>maked</u> some robots last month.", "made"],
    ["We <u>eated</u> some pizza for dinner yesterday.", "ate"],
    ["The contest <u>beginned</u> last week.", "began"],
    ["Tommy <u>runned</u> to the hospital then.", "ran"],
    ["She <u>comed</u> here last winter.", "came"],
    ["His grandpa <u>cutted</u> down the tree last Sunday.", "cut"],
    ["I <u>leaved</u> home at eight yesterday.", "left"],
  ];
  fixA.forEach(([p, ans], i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), p, [ans], instrA));
  });
  items.push(
    ex(
      sentItem("b01", "B", "B1", "He rides a bicycle after lunch.", ["He rode a bicycle after lunch."], instrB),
      "He rode a bicycle after lunch."
    )
  );
  const sentB = [
    ["We play soccer after school.", "We played soccer after school."],
    ["My aunt lives in Gwangju.", "My aunt lived in Gwangju."],
    ["I dry my hair before breakfast.", "I dried my hair before breakfast."],
    ["He stops in front of the store.", "He stopped in front of the store."],
    ["My brother cooks dinner.", "My brother cooked dinner."],
    ["Jessica washes her cat.", "Jessica washed her cat."],
    ["They go to school by bus.", "They went to school by bus."],
    ["Mike has a new camera.", "Mike had a new camera."],
    ["She writes a letter to her friend.", "She wrote a letter to her friend."],
    ["The bus comes late.", "The bus came late."],
    ["I meet her in the park.", "I met her in the park."],
    ["Mom buys some flowers.", "Mom bought some flowers."],
    ["Mr. Baker teaches math.", "Mr. Baker taught math."],
    ["We swim in the lake.", "We swam in the lake."],
  ];
  sentB.forEach(([p, ans], i) => {
    items.push(sentItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), p, [ans], instrB));
  });
  write(
    "lesson03-fly.json",
    pack("b3:u07:lesson03-fly", "Grammar Fly", "고치기·과거 문장 (pp. 177–178)", "177–178", 26, [secA, secB], items, {
      introKo: "Section A 14문항(동사 고치기), Section B 14문항(과거 문장).",
    })
  );
})();

// —— Lesson 04 Walk (p. 180) ——
(function lesson04Walk() {
  const instrA =
    "다음 문장에서 did not을 찾아 동그라미 하고, 동사를 찾아 밑줄을 치세요. did not과 동사원형을 | 로 구분해 쓰세요. 순서는 상관없어요.";
  const instrB =
    "다음 두 문장의 뜻이 같도록 빈칸에 알맞은 말을 쓰세요. didn't와 동사원형 두 칸에 | 로 구분해 쓰세요.";
  const secA = sec("A", "Section A", instrA, "did not과 동사를 찾으세요.", "did not|동사원형 (순서 무관)", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B", instrB, "didn't 축약형으로 바꾸세요.", "didn't|동사원형", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]);
  const items = [
    ex(
      fillItem(
        "a01",
        "A",
        "A1",
        "I did not go to the museum yesterday.",
        ["did not|go", "go|did not"],
        instrA,
        { blanks: 2, unordered: true, promptKo: "나는 어제 박물관에 가지 않았다." }
      ),
      "did not|go"
    ),
    fillItem("a02", "A", "A2", "She did not carry the boxes.", ["did not|carry", "carry|did not"], instrA, {
      blanks: 2,
      unordered: true,
      promptKo: "그녀는 상자들을 나르지 않았다.",
    }),
    fillItem("a03", "A", "A3", "We did not wear hats.", ["did not|wear", "wear|did not"], instrA, {
      blanks: 2,
      unordered: true,
      promptKo: "우리는 모자를 쓰지 않았다.",
    }),
    fillItem("a04", "A", "A4", "Danny did not close the door.", ["did not|close", "close|did not"], instrA, {
      blanks: 2,
      unordered: true,
      promptKo: "대니는 문을 닫지 않았다.",
    }),
    fillItem("a05", "A", "A5", "They did not have lunch today.", ["did not|have", "have|did not"], instrA, {
      blanks: 2,
      unordered: true,
      promptKo: "그들은 오늘 점심을 먹지 않았다.",
    }),
    ex(
      fillItem(
        "b01",
        "B",
        "B1",
        "You did not brush your hair this morning.\n→ You ______ your hair this morning.",
        ["didn't|brush"],
        instrB,
        { blanks: 2, promptKo: "너는 오늘 아침에 머리를 빗지 않았다." }
      ),
      "didn't|brush"
    ),
  ];
  const bRows = [
    ["He did not go to the library yesterday.\n→ He ______ to the library yesterday.", "didn't|go"],
    ["They did not open the box.\n→ They ______ the box.", "didn't|open"],
    ["I did not study English last night.\n→ I ______ English last night.", "didn't|study"],
    ["She did not run in the park.\n→ She ______ in the park.", "didn't|run"],
  ];
  bRows.forEach(([p, acc], i) => {
    items.push(fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), p, [acc], instrB, { blanks: 2 }));
  });
  write(
    "lesson04-walk.json",
    pack("b3:u07:lesson04-walk", "Grammar Walk — Lesson 04", "did not / didn't (p. 180)", "180", 10, [secA, secB], items, {
      introKo: "Section A 4문항(did not+동사), Section B 4문항(didn't+동사원형).",
    })
  );
})();

// —— Lesson 05 Walk (p. 182) ——
(function lesson05Walk() {
  const instrA =
    "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 응답(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const ansChoices = [
    "a. No, I didn't.",
    "b. Yes, he did.",
    "c. Yes, you did.",
    "d. No, she didn't.",
    "e. Yes, they did.",
  ];
  const secA = sec("A", "Section A", instrA, "의문문으로 바꾸세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B", instrB, "대답을 연결하세요.", "a~e 중 하나.", "choice", "Choose · 고르기", 5, 1, ["B2", "B3", "B4", "B5", "B6"]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "Tommy made a robot yesterday.\n→ ______ Tommy make a robot yesterday?", ["Did"], instrA, {
        promptKo: "토미는 어제 로봇을 만들었다.",
      }),
      "Did"
    ),
    fillItem("a02", "A", "A2", "You dried your cat in the bathroom.\n→ ______ you dry your cat in the bathroom?", ["Did"], instrA),
    fillItem("a03", "A", "A3", "They played tennis after school.\n→ Did they ______ tennis after school?", ["play"], instrA),
    fillItem("a04", "A", "A4", "He drank a glass of milk.\n→ Did he ______ a glass of milk?", ["drink"], instrA),
    fillItem("a05", "A", "A5", "She danced well yesterday.\n→ ______ she ______ well yesterday?", ["Did|dance"], instrA, { blanks: 2 }),
    ex(
      mcItem("b01", "B", "B1", "Did I call you last night?", ansChoices, ["c. Yes, you did.", "c"], instrB),
      "c. Yes, you did."
    ),
  ];
  const bQs = [
    ["Did you get up late?", "a. No, I didn't.", "a"],
    ["Did she buy an umbrella?", "d. No, she didn't.", "d"],
    ["Did they go to school by bus?", "e. Yes, they did.", "e"],
    ["Did your brother play with the toy?", "b. Yes, he did.", "b"],
  ];
  bQs.forEach(([q, ans, letter], i) => {
    items.push(mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), q, ansChoices, [ans, letter], instrB));
  });
  write(
    "lesson05-walk.json",
    pack("b3:u07:lesson05-walk", "Grammar Walk — Lesson 05", "Did 의문문 (p. 182)", "182", 10, [secA, secB], items, {
      introKo: "Section A 4문항(Did/동사원형), Section B 5문항(대답 연결).",
    })
  );
})();

// —— Lesson 06 Walk (p. 184) ——
(function lesson06Walk() {
  const instrA = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장에서 주어를 찾아 동그라미 하고, 동사를 찾아 밑줄을 치세요. Who와 동사를 | 로 구분해 쓰세요. 순서는 상관없어요.";
  const secA = sec("A", "Section A", instrA, "대화 빈칸에 did를 넣으세요.", "빈칸 말만.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]);
  const secB = sec("B", "Section B", instrB, "Who 주어와 동사를 찾으세요.", "Who|동사 (순서 무관)", "words", "Words · 빈칸 말만", 4, 1, ["B2", "B3", "B4", "B5"]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "A: What did you buy at the store?\nB: I bought a pen.", ["did"], instrA, { promptKo: "예시" }),
      "did"
    ),
    fillItem("a02", "A", "A2", "A: When ______ they go on a picnic?", ["did"], instrA),
    fillItem("a03", "A", "A3", "A: Why ______ Anna shout?", ["did"], instrA),
    fillItem("a04", "A", "A4", "A: How ______ he come here?", ["did"], instrA),
    fillItem("a05", "A", "A5", "A: Where ______ James swim?", ["did"], instrA),
    ex(
      fillItem(
        "b01",
        "B",
        "B1",
        "Who planted this tree?",
        ["Who|planted", "planted|Who"],
        instrB,
        { blanks: 2, unordered: true, promptKo: "누가 이 나무를 심었니?" }
      ),
      "Who|planted"
    ),
    fillItem("b02", "B", "B2", "Who made this snowman?", ["Who|made", "made|Who"], instrB, { blanks: 2, unordered: true }),
    fillItem("b03", "B", "B3", "Who sang last night?", ["Who|sang", "sang|Who"], instrB, { blanks: 2, unordered: true }),
    fillItem("b04", "B", "B4", "Who went to the supermarket with you?", ["Who|went", "went|Who"], instrB, { blanks: 2, unordered: true }),
    fillItem("b05", "B", "B5", "Who visited you last Sunday?", ["Who|visited", "visited|Who"], instrB, { blanks: 2, unordered: true }),
  ];
  write(
    "lesson06-walk.json",
    pack("b3:u07:lesson06-walk", "Grammar Walk — Lesson 06", "Wh- + did / Who (p. 184)", "184", 10, [secA, secB], items, {
      introKo: "Section A 4문항(의문사+did), Section B 4문항(Who+동사).",
    })
  );
})();

// —— Lesson 06 Run (pp. 185–186) ——
(function lesson06Run() {
  const instrA =
    "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const instrB =
    "다음 의문문에 대한 알맞은 대답을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
  const secA = sec("A", "Section A", instrA, "괄호 안에서 고르세요.", "하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
  ]);
  const secB = sec("B", "Section B", instrB, "알맞은 대답을 고르세요.", "하나를 골라 누르세요.", "choice", "Choose · 고르기", 12, 0, [
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12",
  ]);
  const mcA = (id, label, prompt, c0, c1, pick, exFlag) => {
    const it = mcItem(id, "A", label, prompt, [c0, c1], [pick], instrA);
    return exFlag ? ex(it, pick) : it;
  };
  const items = [
    mcA("a01", "A1", "I ( don't / didn't ) want the blue jeans then.", "don't", "didn't", "didn't", true),
    mcA("a02", "A2", "She ( didn't / doesn't ) dance well last year.", "didn't", "doesn't", "didn't"),
    mcA("a03", "A3", "They ( don't / didn't ) bake any cookies yesterday.", "don't", "didn't", "didn't"),
    mcA("a04", "A4", "Sam ( didn't / doesn't ) visit his grandparents last weekend.", "didn't", "doesn't", "didn't"),
    mcA("a05", "A5", "You didn't ( walk / walked ) to school yesterday.", "walk", "walked", "walk"),
    mcA("a06", "A6", "Laura didn't ( arrived / arrive ) in time.", "arrived", "arrive", "arrive"),
    mcA("a07", "A7", "We didn't ( study / studied ) math hard.", "study", "studied", "study"),
    mcA("a08", "A8", "He didn't ( had / have ) breakfast.", "had", "have", "have"),
    mcA("a09", "A9", "( Did / Does ) Tom eat any fish last week?", "Did", "Does", "Did"),
    mcA("a10", "A10", "( Do / Did ) you send a letter to him last month?", "Do", "Did", "Did"),
    mcA("a11", "A11", "Did your sister ( ride / rode ) a bike in the park?", "ride", "rode", "ride"),
    mcA("a12", "A12", "What ( do / did ) you wear yesterday?", "do", "did", "did"),
    mcA("a13", "A13", "Why did she ( sleep / slept ) on the sofa?", "sleep", "slept", "sleep"),
    mcA("a14", "A14", "How did the dog ( climb / climbed ) the ladder?", "climb", "climbed", "climb"),
    mcA("a15", "A15", "Who ( sings / sang ) last night?", "sings", "sang", "sang"),
  ];
  const bRows = [
    ["Did you clean your room?", ["Yes, I did.", "No, I don't."], "Yes, I did."],
    ["Did they jump rope in the park?", ["Yes, they do.", "No, they didn't."], "No, they didn't."],
    ["Did that mouse eat the cheese?", ["Yes, it did.", "No, it did."], "Yes, it did."],
    ["Did he live in New York last year?", ["No, he doesn't.", "No, he didn't."], "No, he didn't."],
    ["Did you know Sue's family name?", ["Yes, we do.", "Yes, we did."], "Yes, we did."],
    ["Did they drink his lemonade?", ["No, they don't.", "No, they didn't."], "No, they didn't."],
    ["What did Bill wear yesterday?", ["He wears blue jeans.", "He wore blue jeans."], "He wore blue jeans."],
    ["When did you call me?", ["I called you yesterday.", "I call you every day."], "I called you yesterday."],
    ["Where did they go?", ["They go to the zoo.", "They went to the zoo."], "They went to the zoo."],
    ["How did he come to Seoul?", ["He came by ship.", "He comes by plane."], "He came by ship."],
    ["Why did she get up late?", ["Because she was sick.", "Because she is sick."], "Because she was sick."],
    ["Who made the sandwiches?", ["Jane makes them.", "Jane made them."], "Jane made them."],
  ];
  bRows.forEach(([q, choices, ans], i) => {
    items.push(mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), q, choices, [ans], instrB));
  });
  write(
    "lesson06-run.json",
    pack("b3:u07:lesson06-run", "Grammar Run", "did / didn't (pp. 185–186)", "185–186", 19, [secA, secB], items, {
      introKo: "Section A 14문항, Section B 12문항(대답 고르기).",
    })
  );
})();

// —— Lesson 06 Jump (pp. 187–188) ——
(function lesson06Jump() {
  const instrA =
    "다음 문장을 과거 시제로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸마다 | 로 구분해 두 칸에 쓰세요.";
  const instrB =
    "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 들어갈 말을 | 로 구분해 쓰세요. (문장 전체를 쓰지 마세요.)";
  const secA = sec("A", "Section A", instrA, "과거 시제로 바꾸세요.", "did|동사원형 또는 didn't|동사원형", "words", "Words · 빈칸 말만", 11, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12",
  ]);
  const secB = sec("B", "Section B", instrB, "대화를 완성하세요.", "빈칸 말만.", "words", "Words · 빈칸 말만", 14, 1, [
    "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15",
  ]);
  const items = [
    ex(
      fillItem(
        "a01",
        "A",
        "A1",
        "You don't clean your room.\n→ You ______ your room yesterday.",
        ["didn't|clean"],
        instrA,
        { blanks: 2, promptKo: "너는 어제 방을 청소하지 않았다." }
      ),
      "didn't|clean"
    ),
  ];
  const aRows = [
    ["I don't want those shoes.\n→ I ______ those shoes then.", "didn't|want"],
    ["He doesn't use the computer.\n→ He ______ the computer today.", "didn't|use"],
    ["We don't live in the country.\n→ We ______ in the country last year.", "didn't|live"],
    ["My dad doesn't ride a bike.\n→ My dad ______ a bike last Sunday.", "didn't|ride"],
    ["I don't fly the kite on the hill.\n→ I ______ the kite on the hill yesterday.", "didn't|fly"],
    ["Do you play the piano after school?\n→ ______ you ______ the piano after school?", "Did|play"],
    ["Does the bus stop here?\n→ ______ the bus ______ here then?", "Did|stop"],
    ["Do the farmers have any cows?\n→ ______ the farmers ______ any cows last month?", "Did|have"],
    ["When does the concert begin?\n→ When ______ the concert ______ last Saturday?", "did|begin"],
    ["Why does the girl like Tom?\n→ Why ______ the girl ______ Tom?", "did|like"],
    ["What time do you get up?\n→ What time ______ you ______ up this morning?", "did|get"],
  ];
  aRows.forEach(([p, acc], i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), p, [acc], instrA, { blanks: 2 }));
  });
  items.push(
    ex(
      fillItem(
        "b01",
        "B",
        "B1",
        "Did you come home late today? / No, ______.",
        ["I|didn't", "didn't|I"],
        instrB,
        { blanks: 2, unordered: true }
      ),
      "I|didn't"
    )
  );
  const bShort = [
    ["Did your dad go fishing last weekend? / Yes, ______.", ["he|did", "did|he"]],
    ["Did your sister have the backpack then? / No, ______.", ["she|didn't", "didn't|she"]],
    ["Did she bake the birthday cake? / Yes, ______.", ["she|did", "did|she"]],
    ["Did they send e-mail to him? / No, ______.", ["they|didn't", "didn't|they"]],
    ["Did the wolf bark loudly last night? / Yes, ______.", ["it|did", "did|it"]],
  ];
  bShort.forEach(([p, acc], i) => {
    items.push(fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), p, acc, instrB, { blanks: 2, unordered: true }));
  });
  items.push(
    ex(
      fillItem("b07", "B", "B7", "Who did Diana visit last Saturday? / She ______ her uncle.", ["visited"], instrB),
      "visited"
    )
  );
  const bLong = [
    ["Where did he study yesterday? / He ______ in the library.", "studied"],
    ["When did you arrive in Seoul? / I ______ at noon.", "arrived"],
    ["What did Ms. James drop this morning? / She ______ her favorite mug.", "dropped"],
    ["When did she meet Robert? / She ______ him this morning.", "met"],
    ["How did they go to the museum? / They ______ there by subway.", "went"],
    ["What did you make last week? / I ______ a robot.", "made"],
    ["When did she read the magazine? / She ______ it yesterday.", "read"],
    ["What did Chris buy at the store? / He ______ some cucumbers there.", "bought"],
  ];
  bLong.forEach(([p, ans], i) => {
    items.push(fillItem("b" + String(i + 8).padStart(2, "0"), "B", "B" + (i + 8), p, [ans], instrB));
  });
  write(
    "lesson06-jump.json",
    pack("b3:u07:lesson06-jump", "Grammar Jump", "과거 변환·대화 (pp. 187–188)", "187–188", 23, [secA, secB], items, {
      introKo: "Section A 11문항(두 칸 변환), Section B 14문항(대화).",
    })
  );
})();

// —— Lesson 06 Fly (pp. 189–190) ——
(function lesson06Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 1–7번은 didn't|동사원형 두 칸, 8–15번은 한 칸에 고친 말만 쓰세요.";
  const instrB =
    "다음 문장을 괄호 안의 지시대로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  const secA = sec("A", "Section A", instrA, "밑줄 친 부분을 고치세요.", "지시에 맞게 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
    "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15",
  ]);
  const secB = sec("B", "Section B", instrB, "부정문·의문문으로 바꾸세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 11, 1, [
    "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12",
  ]);
  const items = [
    ex(
      fillItem("a01", "A", "A1", "We <u>don't play</u> soccer last Friday.", ["didn't|play"], instrA, { blanks: 2 }),
      "didn't|play"
    ),
  ];
  const a2 = [
    ["Lynn <u>doesn't like</u> the yellow shirt yesterday.", "didn't|like"],
    ["You <u>don't run</u> fast yesterday.", "didn't|run"],
    ["My brother <u>didn't learned</u> Chinese last year.", "didn't|learn"],
    ["My dog <u>didn't climbed</u> the table then.", "didn't|climb"],
    ["I <u>didn't hugged</u> the puppy yesterday.", "didn't|hug"],
    ["I <u>didn't went</u> shopping last Saturday.", "didn't|go"],
  ];
  a2.forEach(([p, acc], i) => {
    items.push(fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), p, [acc], instrA, { blanks: 2 }));
  });
  const a1 = [
    ["<u>Do</u> you brush your teeth last night?", "Did"],
    ["<u>Does</u> he help his sister yesterday?", "Did"],
    ["Did they <u>watered</u> the garden?", "water"],
    ["Where <u>does</u> Max stay last week?", "did"],
    ["When did they <u>left</u> for Paris?", "leave"],
    ["What did they <u>sold</u> at their store?", "sell"],
    ["How did she <u>carried</u> the heavy bottles?", "carry"],
    ["Who <u>playes</u> the piano last night?", "played"],
  ];
  a1.forEach(([p, ans], i) => {
    items.push(fillItem("a" + String(i + 8).padStart(2, "0"), "A", "A" + (i + 8), p, [ans], instrA));
  });
  const negAccept = (subj, verb, rest) => [
    subj + " did not " + verb + " " + rest,
    subj + " didn't " + verb + " " + rest,
  ];
  items.push(
    ex(
      sentItem(
        "b01",
        "B",
        "B1",
        "I played the guitar after school. (부정문)",
        negAccept("I", "play", "the guitar after school."),
        instrB
      ),
      "I didn't play the guitar after school."
    )
  );
  const sentB = [
    ["Andy closed the windows last night. (부정문)", negAccept("Andy", "close", "the windows last night.")],
    ["My mom fried the carrots. (부정문)", negAccept("My mom", "fry", "the carrots.")],
    ["She clapped her hands then. (부정문)", negAccept("She", "clap", "her hands then.")],
    ["I wrote a letter to my dad yesterday. (부정문)", negAccept("I", "write", "a letter to my dad yesterday.")],
    ["He ate spaghetti for dinner. (부정문)", negAccept("He", "eat", "spaghetti for dinner.")],
    ["The math class began at one p.m. (의문문)", ["Did the math class begin at one p.m.?"]],
    ["You saw your teacher at the subway station. (의문문)", ["Did you see your teacher at the subway station?"]],
    ["They swam in the river yesterday. (의문문)", ["Did they swim in the river yesterday?"]],
    ["She visited the island last summer. (의문문)", ["Did she visit the island last summer?"]],
    ["He drank my apple juice in the morning. (의문문)", ["Did he drink my apple juice in the morning?"]],
    ["His grandpa rode a horse this afternoon. (의문문)", ["Did his grandpa ride a horse this afternoon?"]],
  ];
  sentB.forEach(([p, acc], i) => {
    items.push(sentItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), p, acc, instrB));
  });
  write(
    "lesson06-fly.json",
    pack("b3:u07:lesson06-fly", "Grammar Fly", "부정·의문 변환 (pp. 189–190)", "189–190", 26, [secA, secB], items, {
      introKo: "Section A 14문항(고치기), Section B 11문항(부정·의문 문장).",
    })
  );
})();

// —— Review 07 (pp. 191–193) ——
(function review07() {
  const introKo =
    "Review 07은 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.";
  const sections = [
    sec("1-2", "[1–2]", "[1–2] 다음 중 동사원형과 과거형이 잘못 짝지어진 것을 고르세요.", "잘못 짝지어진 것을 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
    sec("3-4", "[3–4]", "[3–4] 다음 문장의 빈칸에 알맞은 말을 고르세요.", "빈칸에 알맞은 말을 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["3", "4"]),
    sec("5-6", "[5–6]", "[5–6] 다음 중 잘못된 문장을 고르세요.", "잘못된 문장을 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["5", "6"]),
    sec("7", "[7]", "[7] 다음 문장의 빈칸에 공통으로 알맞은 말을 고르세요.", "공통으로 알맞은 말을 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["7"]),
    sec("8-9", "[8–9]", "[8–9] 다음 대화의 빈칸에 알맞은 말을 고르세요.", "빈칸에 알맞은 말을 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["8", "9"]),
    sec("10", "[10]", "[10] 다음 중 짝지어진 대화가 어색한 것을 고르세요.", "어색한 대화를 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 1, 0, ["10"]),
    sec("11-12", "[11–12]", "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", "괄호 안에서 고르세요.", "하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
    sec("13-14", "[13–14]", "[13–14] 다음 문장을 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "빈칸 말만 쓰세요.", "빈칸에 들어갈 말만.", "words", "Words · 빈칸 말만", 2, 0, ["13", "14"]),
    sec("15-16", "[15–16]", "[15–16] 다음 우리말 뜻과 같도록 주어진 동사를 사용하여 문장을 완성하세요.", "동사의 과거형·did를 쓰세요.", "빈칸 말만.", "words", "Words · 빈칸 말만", 2, 0, ["15", "16"]),
    sec("17-18", "[17–18]", "[17–18] 다음 대화의 빈칸에 알맞은 말을 쓰세요.", "빈칸 말만 쓰세요.", "빈칸에 들어갈 말만.", "words", "Words · 빈칸 말만", 2, 0, ["17", "18"]),
    sec("19-20", "[19–20]", "[19–20] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "완전한 문장으로.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
  ];
  const si = (secId, secTitle, id, label, item) =>
    Object.assign(item, {
      section: secId,
      sectionTitle: "Section " + secTitle,
      sectionInstructionKo: sections.find((s) => s.id === secId).instructionKo,
      label,
      id,
    });
  const items = [
    si("1-2", "1-2", "q01", "1", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "Choose the incorrectly paired base and past form.",
      choices: ["need – needed", "dry – dried", "drop – droped", "read – read"],
      accept: ["drop – droped", "3"],
    }),
    si("1-2", "1-2", "q02", "2", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "",
      choices: ["leave – left", "have – had", "do – did", "run – runned"],
      accept: ["run – runned", "4"],
    }),
    si("3-4", "3-4", "q03", "3", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "I ______ my mom yesterday.",
      choices: ["help", "helps", "helped", "helping"],
      accept: ["helped", "3"],
    }),
    si("3-4", "3-4", "q04", "4", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "Paul didn't ______ the cake.",
      choices: ["bake", "bakes", "baked", "baking"],
      accept: ["bake", "1"],
    }),
    si("5-6", "5-6", "q05", "5", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "Choose the incorrect sentence.",
      choices: [
        "I came home at five.",
        "She wore a yellow skirt today.",
        "He read the book last night.",
        "They go hiking yesterday.",
      ],
      accept: ["They go hiking yesterday.", "4"],
    }),
    si("5-6", "5-6", "q06", "6", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "",
      choices: [
        "I didn't play soccer after school.",
        "When he went to school?",
        "Did they sing the song?",
        "Where did she buy the book?",
      ],
      accept: ["When he went to school?", "2"],
    }),
    si("7", "7", "q07", "7", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "Did you meet Jenny yesterday?\nWhen ______ he go to school?",
      choices: ["Do[do]", "Does[does]", "Did[did]", "Are[are]"],
      accept: ["Did[did]", "3"],
    }),
    si("8-9", "8-9", "q08", "8", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "A: Did you keep a diary?\nB: No, I ______.",
      choices: ["do", "don't", "did", "didn't"],
      accept: ["didn't", "4"],
    }),
    si("8-9", "8-9", "q09", "9", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "A: Where did James swim?\nB: He ______ in the pool.",
      choices: ["swim", "swims", "swam", "swimed"],
      accept: ["swam", "3"],
    }),
    si("10", "10", "q10", "10", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "Choose the unnatural dialogue pair.",
      choices: [
        "A: Did you dry your hair? / B: Yes, I did.",
        "A: Did your sister cry last night? / B: No, she doesn't.",
        "A: Who ate my sandwich? / B: Ms. Toner ate it.",
        "A: What did you wear yesterday? / B: I wore a white shirt.",
      ],
      accept: ["A: Did your sister cry last night? / B: No, she doesn't.", "2"],
    }),
    si("11-12", "11-12", "q11", "11", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "우리는 지난 토요일에 에밀리를 만났다.\nWe ( meet / met ) Emily last Saturday.",
      choices: ["meet", "met"],
      accept: ["met", "2"],
    }),
    si("11-12", "11-12", "q12", "12", {
      type: "mc",
      answerMode: "choice",
      answerModeTag: "Choose · 고르기",
      promptEn: "그는 어젯밤에 수학 공부를 열심히 하지 않았다.\nHe ( didn't study / doesn't study ) math last night.",
      choices: ["didn't study", "doesn't study"],
      accept: ["didn't study", "1"],
    }),
    si("13-14", "13-14", "q13", "13", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "Sue didn't see him there. (긍정문)\n→ Sue ______ him there.",
      accept: ["saw"],
    }),
    si("13-14", "13-14", "q14", "14", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "The concert began at six. (의문문)\n→ ______ the concert ______ at six?",
      accept: ["Did|begin"],
      blanks: 2,
    }),
    si("15-16", "15-16", "q15", "15", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "토니는 2010년에 뉴욕에서 살았다.\nTony ______ in New York in 2010. (live)",
      accept: ["lived"],
    }),
    si("15-16", "15-16", "q16", "16", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "너는 언제 집에 도착했니?\nWhen ______ you ______ home? (arrive)",
      accept: ["did|arrive"],
      blanks: 2,
    }),
    si("17-18", "17-18", "q17", "17", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "A: Did your sister ride a bike?\nB: Yes, ______.",
      accept: ["she did", "she|did"],
      blanks: 2,
    }),
    si("17-18", "17-18", "q18", "18", {
      type: "fill",
      answerMode: "words",
      answerModeTag: "Words · 빈칸 말만",
      promptEn: "A: What did you make yesterday?\nB: I ______ a robot.",
      accept: ["made"],
    }),
    si("19-20", "19-20", "q19", "19", {
      type: "sentence",
      answerMode: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptEn: "I <u>carryed</u> the boxes yesterday.",
      accept: ["I carried the boxes yesterday."],
    }),
    si("19-20", "19-20", "q20", "20", {
      type: "sentence",
      answerMode: "sentence",
      answerModeTag: "Sentence · 문장 전체",
      promptEn: "He didn't <u>walked</u> to school this morning.",
      accept: ["He didn't walk to school this morning.", "He did not walk to school this morning."],
    }),
  ];
  write(
    "review-07.json",
    pack("b3:u07:review-07", "Review 07", "Unit 07 과거 시제 (pp. 191–193)", "191–193", 30, sections, items, { introKo })
  );
})();

console.log("done — output:", OUT);
