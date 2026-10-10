/* Generate data/blue2/unit02/*.json — run: node scripts/blue2-build/unit02-generate.js */
"use strict";
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../../data/blue2/unit02");
const META = {
  bookId: "zap-blue-2",
  bookTitle: "ZAP Blue 2",
  appName: "BlueZap 2",
  unitId: "unit-02",
  unitTitle: "Unit 02 — 일반동사의 부정문과 의문문",
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
  if (opts.noteKo) item.noteKo = opts.noteKo;
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
  return Object.assign({}, base, {
    example: true,
    displayOnly: true,
    exampleAnswer,
  });
}

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", name, data.items.length, "items");
}

function mcAcc(choices, idx) {
  return [choices[idx], String(idx + 1)];
}

function dontAccept() {
  return ["don't", "dont", "Don't", "Dont", "do not", "Do not"];
}

function doesntAccept() {
  return ["doesn't", "doesnt", "Doesn't", "Doesnt", "does not", "Does not"];
}

function pipeNeg(parts) {
  const base = parts.join("|");
  const out = [base];
  if (parts[0] === "don't") out.push(["do", "not"].concat(parts.slice(1)).join("|"));
  if (parts[0] === "doesn't") out.push(["does", "not"].concat(parts.slice(1)).join("|"));
  return out;
}

function pipeShort(parts) {
  const base = parts.join("|");
  const out = [base];
  if (parts[1] === "doesn't") out.push(parts[0] + "|does not");
  if (parts[1] === "don't") out.push(parts[0] + "|do not");
  return out;
}

function practiceBase(practiceId, title, subtitle, pages, timerMinutes, introKo, sections, items, extra) {
  return {
    practiceId,
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
  };
}

function sectionPair(secA, secB, countA, countB) {
  return [
    sec("A", "Section A", secA.instr, secA.dir, secA.rule, secA.mode, secA.tag, countA, 1, secA.labels),
    sec("B", "Section B", secB.instr, secB.dir, secB.rule, secB.mode, secB.tag, countB, 1, secB.labels),
  ];
}

// —— Lesson 01 Walk (p. 37) ——
(function lesson01Walk() {
  const instrA =
    "다음 문장을 부정문으로 바꿀 때 do not이 들어갈 위치로 알맞은 곳에 동그라미 하세요. 동그라미 친 말(동사)만 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 문장에서 밑줄 친 부분의 줄임말을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
  const aRows = [
    { en: "We eat snacks at 3 p.m.", v: "eat", ko: "우리는 오후 3시에 간식을 먹는다." },
    { en: "They listen to the radio in the evening.", v: "listen", ko: "그들은 저녁에 라디오를 듣는다." },
    { en: "Terry and Cindy drink milk in the morning.", v: "drink", ko: "테리와 신디는 아침에 우유를 마신다." },
    { en: "Those children learn history at school.", v: "learn", ko: "저 아이들은 학교에서 역사를 배운다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "I read books at night.", ["read"], {
        sectionInstructionKo: instrA,
        promptKo: "나는 밤에 책을 읽는다.",
      }),
      "read"
    ),
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, [r.v, r.v.toLowerCase()], {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
      })
    );
  });
  const bRows = [
    { en: "We do not eat carrots.", ko: "우리는 당근을 먹지 않는다." },
    { en: "These boys do not like cucumbers.", ko: "이 남자아이들은 오이를 좋아하지 않는다." },
    { en: "They do not know her name.", ko: "그들은 그녀의 이름을 모른다." },
    { en: "Mina and Jiho do not live in a city.", ko: "미나와 지호는 도시에 살지 않는다." },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", underlineInSentence("I do not play soccer.", "do not"), dontAccept(), {
        sectionInstructionKo: instrB,
        promptKo: "나는 축구를 하지 않는다.",
      }),
      "don't"
    )
  );
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), underlineInSentence(r.en, "do not"), dontAccept(), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson01-walk.json",
    practiceBase(
      "b2:u02:lesson01-walk",
      "Lesson 01 Walk — 부정문",
      "do not 위치 · don't (p. 37)",
      "37",
      10,
      "Section A 4문항(동사), Section B 4문항(don't). 예시는 채점하지 않아요.",
      sectionPair(
        {
          instr: instrA,
          dir: "다음 문장을 부정문으로 바꿀 때 do not이 들어갈 위치로 알맞은 곳에 동그라미 하세요.",
          rule: "동그라미 친 동사만 쓰세요.",
          mode: "words",
          tag: "Words · 빈칸 말만",
          labels: ["A2", "A3", "A4", "A5"],
        },
        {
          instr: instrB,
          dir: "다음 문장에서 밑줄 친 부분의 줄임말을 빈칸에 쓰세요.",
          rule: "빈칸에 들어갈 말만 쓰세요.",
          mode: "words",
          tag: "Words · 빈칸 말만",
          labels: ["B2", "B3", "B4", "B5"],
        },
        4,
        4
      ),
      items
    )
  );
})();

// —— Lesson 01 Walk 2 (p. 39) ——
(function lesson01Walk2() {
  const instrA = "다음 문장이 긍정문이면 P, 부정문이면 N에 동그라미 하세요. 빈칸에 P 또는 N만 쓰세요.";
  const instrB = "다음 밑줄 친 부분의 줄임말을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
  const PN = (n) => (n ? ["N", "n", "부정문"] : ["P", "p", "긍정문"]);
  const aRows = [
    { en: "Michael likes K-pop.", n: false, ko: "마이클은 K-pop을 좋아한다." },
    { en: "Sumin does not look happy.", n: true, ko: "수민은 행복해 보이지 않는다." },
    { en: "They have black hair.", n: false, ko: "그들은 검은 머리를 가지고 있다." },
    { en: "The man doesn't cook noodles.", n: true, ko: "그 남자는 국수를 요리하지 않는다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "I do not live here.", PN(true), { sectionInstructionKo: instrA, promptKo: "나는 여기에 살지 않는다." }),
      "N"
    ),
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, PN(r.n), {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
      })
    );
  });
  const bRows = [
    { en: "My brother does not clean his room.", ko: "우리 오빠는 자신의 방을 청소하지 않는다." },
    { en: "Carrie does not play computer games.", ko: "캐리는 컴퓨터 게임을 하지 않는다." },
    { en: "He does not wear blue jeans.", ko: "그는 청바지를 입지 않는다." },
    { en: "The girl does not sleep in the living room.", ko: "그 여자아이는 거실에서 자지 않는다." },
  ];
  items.push(
    exItem(
      fillItem("b01", "B", "B1", underlineInSentence("She does not remember him.", "does not"), doesntAccept(), {
        sectionInstructionKo: instrB,
        promptKo: "그녀는 그를 기억하지 않는다.",
      }),
      "doesn't"
    )
  );
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), underlineInSentence(r.en, "does not"), doesntAccept(), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson01-walk2.json",
    practiceBase(
      "b2:u02:lesson01-walk2",
      "Lesson 01 Walk 2 — 부정문",
      "P/N · doesn't (p. 39)",
      "39",
      10,
      "Section A 4문항(P/N), Section B 4문항(doesn't). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장이 긍정문이면 P, 부정문이면 N에 동그라미 하세요.", rule: "P 또는 N만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: ["A2", "A3", "A4", "A5"] },
        { instr: instrB, dir: "다음 밑줄 친 부분의 줄임말을 빈칸에 쓰세요.", rule: "빈칸에 들어갈 말만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: ["B2", "B3", "B4", "B5"] },
        4,
        4
      ),
      items
    )
  );
})();

// —— Lesson 01 Run (pp. 40–41) ——
(function lesson01Run() {
  const instrA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const instrB = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const aRows = [
    { p: "I ( don't / doesn't ) like chicken.", c: ["don't", "doesn't"], a: 0, ex: true, ko: "나는 닭고기를 좋아하지 않는다." },
    { p: "Paul ( don't / doesn't ) play basketball.", c: ["don't", "doesn't"], a: 1, ko: "폴은 농구를 하지 않는다." },
    { p: "We don't ( live / lives ) in a city.", c: ["live", "lives"], a: 0, ko: "우리는 도시에 살지 않는다." },
    { p: "Yunji doesn't ( have / has ) a camera.", c: ["have", "has"], a: 0, ko: "윤지는 카메라를 가지고 있지 않다." },
    { p: "You ( don't / doesn't ) know her e-mail address.", c: ["don't", "doesn't"], a: 0, ko: "너는 그녀의 이메일 주소를 모른다." },
    { p: "My mother ( don't / doesn't ) cook dinner on Saturday.", c: ["don't", "doesn't"], a: 1, ko: "우리 어머니는 토요일에 저녁을 요리하지 않는다." },
    { p: "They don't ( go / goes ) on a picnic.", c: ["go", "goes"], a: 0, ko: "그들은 소풍을 가지 않는다." },
    { p: "He doesn't ( learn / learns ) Japanese.", c: ["learn", "learns"], a: 0, ko: "그는 일본어를 배우지 않는다." },
    { p: "The boys ( don't / doesn't ) eat hamburgers.", c: ["don't", "doesn't"], a: 0, ko: "그 남자아이들은 햄버거를 먹지 않는다." },
    { p: "Johnny ( don't / doesn't ) remember her.", c: ["don't", "doesn't"], a: 1, ko: "조니는 그녀를 기억하지 않는다." },
    { p: "My parents ( don't / doesn't ) watch television.", c: ["don't", "doesn't"], a: 0, ko: "우리 부모님은 텔레비전을 보지 않는다." },
    { p: "His sister doesn't ( listen / listens ) to hip-hop music.", c: ["listen", "listens"], a: 0, ko: "그의 여동생은 힙합 음악을 듣지 않는다." },
    { p: "They ( don't / doesn't ) clean the windows.", c: ["don't", "doesn't"], a: 0, ko: "그들은 창문을 청소하지 않는다." },
    { p: "My uncle doesn't ( work / works ) every Thursday.", c: ["work", "works"], a: 0, ko: "우리 삼촌은 매주 목요일에 일하지 않는다." },
    { p: "Miho ( don't / doesn't ) walk to school.", c: ["don't", "doesn't"], a: 1, ko: "미호는 걸어서 학교에 가지 않는다." },
  ];
  const bRows = [
    { p: "I ______ know his name.", c: ["do not", "am not"], a: 0, ex: true, ko: "나는 그의 이름을 모른다." },
    { p: "They ______ drink coffee.", c: ["not", "do not"], a: 1, ko: "그들은 커피를 마시지 않는다." },
    { p: "Subin ______ like apples.", c: ["do not", "does not"], a: 1, ko: "수빈은 사과를 좋아하지 않는다." },
    { p: "You ______ have a diary.", c: ["do not", "does not"], a: 0, ko: "너는 일기장을 가지고 있지 않다." },
    { p: "Tom ______ study hard.", c: ["isn't", "doesn't"], a: 1, ko: "톰은 열심히 공부하지 않는다." },
    { p: "We don't ______ at night.", c: ["swim", "swims"], a: 0, ko: "우리는 밤에 수영하지 않는다." },
    { p: "Jessica ______ play the piano.", c: ["don't", "doesn't"], a: 1, ko: "제시카는 피아노를 치지 않는다." },
    { p: "They ______ eat fish.", c: ["don't", "aren't"], a: 0, ko: "그들은 생선을 먹지 않는다." },
    { p: "Mike doesn't ______ comic books.", c: ["read", "reads"], a: 0, ko: "마이크는 만화책을 읽지 않는다." },
    { p: "I ______ want a lemon.", c: ["am not", "do not"], a: 1, ko: "나는 레몬을 원하지 않는다." },
    { p: "Kelly ______ get up early.", c: ["isn't", "doesn't"], a: 1, ko: "켈리는 일찍 일어나지 않는다." },
    { p: "Ms. Parker ______ teach music.", c: ["doesn't", "don't"], a: 0, ko: "파커 선생님은 음악을 가르치지 않는다." },
    { p: "Jimin doesn't ______ me.", c: ["help", "helps"], a: 0, ko: "지민은 나를 돕지 않는다." },
    { p: "They ______ sleep here.", c: ["are not", "do not"], a: 1, ko: "그들은 여기서 자지 않는다." },
    { p: "Snakes ______ have ears.", c: ["do not", "does not"], a: 0, ko: "뱀은 귀가 없다." },
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = mcItem("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), r.p, r.c, mcAcc(r.c, r.a), {
      sectionInstructionKo: instrA,
      promptKo: r.ko,
    });
    items.push(r.ex ? exItem(base, r.c[r.a]) : base);
  });
  bRows.forEach((r, i) => {
    const base = mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), r.p, r.c, mcAcc(r.c, r.a), {
      sectionInstructionKo: instrB,
      promptKo: r.ko,
    });
    items.push(r.ex ? exItem(base, r.c[r.a]) : base);
  });
  write(
    "lesson01-run.json",
    practiceBase(
      "b2:u02:lesson01-run",
      "Lesson 01 Run — 부정문",
      "don't/doesn't · 빈칸 고르기 (pp. 40–41)",
      "40–41",
      20,
      "Section A·B 각 15문항(고르기). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", rule: "보기 중 하나를 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: aRows.slice(1).map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", rule: "보기 중 하나를 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: bRows.slice(1).map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Lesson 01 Jump (pp. 42–43) ——
(function lesson01Jump() {
  const instrA = "다음 문장의 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요. (don't 또는 doesn't)";
  const instrB =
    "주어진 말을 사용하여 부정문을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const aRows = [
    { p: "A polar bear ______ like summer.", a: ["doesn't"], ko: "북극곰은 여름을 좋아하지 않는다." },
    { p: "We ______ have math class today.", a: ["don't"], ko: "우리는 오늘 수학 수업이 없다." },
    { p: "My sister ______ wash her hair at night.", a: ["doesn't"], ko: "우리 언니는 밤에 머리를 감지 않는다." },
    { p: "They ______ know us.", a: ["don't"], ko: "그들은 우리를 모른다." },
    { p: "Annie ______ play the guitar.", a: ["doesn't"], ko: "애니는 기타를 치지 않는다." },
    { p: "Luna and I ______ swim today.", a: ["don't"], ko: "루나와 나는 오늘 수영하지 않는다." },
    { p: "Susie ______ clean her room.", a: ["doesn't"], ko: "수지는 자신의 방을 청소하지 않는다." },
    { p: "The children ______ draw pictures.", a: ["don't"], ko: "그 아이들은 그림을 그리지 않는다." },
    { p: "Tony's father ______ work on weekends.", a: ["doesn't"], ko: "토니의 아버지는 주말에는 일하시지 않는다." },
    { p: "They ______ watch soccer games.", a: ["don't"], ko: "그들은 축구 경기를 보지 않는다." },
    { p: "Kate ______ teach English.", a: ["doesn't"], ko: "케이트는 영어를 가르치지 않는다." },
    { p: "Giraffes ______ eat worms.", a: ["don't"], ko: "기린은 벌레를 먹지 않는다." },
    { p: "My father ______ drive a car.", a: ["doesn't"], ko: "우리 아버지는 자동차를 운전하시지 않는다." },
    { p: "The girls ______ wear skirts.", a: ["don't"], ko: "그 여자아이들은 치마를 입지 않는다." },
  ];
  const bRows = [
    { p: "He ______ ______ English. ( speak )", parts: ["doesn't", "speak"], ko: "그는 영어를 말하지 않는다." },
    { p: "We ______ ______ tea. ( drink )", parts: ["don't", "drink"], ko: "우리는 차를 마시지 않는다." },
    { p: "Sally ______ ______ ______ late. ( get up )", parts: ["doesn't", "get", "up"], ko: "샐리는 늦게 일어나지 않는다.", blanks: 3 },
    { p: "They ______ ______ the Internet. ( use )", parts: ["don't", "use"], ko: "그들은 인터넷을 사용하지 않는다." },
    { p: "The bus ______ ______ here. ( stop )", parts: ["doesn't", "stop"], ko: "그 버스는 여기에 멈추지 않는다." },
    { p: "You ______ ______ books here. ( buy )", parts: ["don't", "buy"], ko: "너희는 여기서 책을 사지 않는다." },
    { p: "She ______ ______ her homework. ( do )", parts: ["doesn't", "do"], ko: "그녀는 숙제를 하지 않는다." },
    { p: "I ______ ______ in the living room. ( study )", parts: ["don't", "study"], ko: "나는 거실에서 공부하지 않는다." },
    { p: "Minju ______ ______ fast. ( walk )", parts: ["doesn't", "walk"], ko: "민주는 빨리 걷지 않는다." },
    { p: "The teachers ______ ______ math. ( teach )", parts: ["don't", "teach"], ko: "선생님들은 수학을 가르치지 않는다." },
    { p: "Emily ______ ______ table tennis. ( play )", parts: ["doesn't", "play"], ko: "에밀리는 탁구를 치지 않는다." },
    { p: "Tom and Sarah ______ ______ to the pool. ( go )", parts: ["don't", "go"], ko: "톰과 사라는 수영장에 가지 않는다." },
    { p: "The boy ______ ______ a new bag. ( need )", parts: ["doesn't", "need"], ko: "그 남자아이는 새 가방이 필요하지 않다." },
    { p: "You ______ ______ hard. ( try )", parts: ["don't", "try"], ko: "너희는 열심히 노력하지 않는다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "I ______ need new shoes.", dontAccept(), {
        sectionInstructionKo: instrA,
        promptKo: "나는 새 신발이 필요하지 않다.",
        blanks: 1,
      }),
      "don't"
    ),
    exItem(
      fillItem("b01", "B", "B1", "I ______ ______ his address. ( know )", pipeNeg(["don't", "know"]), {
        sectionInstructionKo: instrB,
        promptKo: "나는 그의 주소를 모른다.",
        blanks: 2,
      }),
      "don't|know"
    ),
  ];
  aRows.forEach((r, i) => {
    const acc = r.a[0] === "don't" ? dontAccept() : doesntAccept();
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.p, acc, {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
        blanks: 1,
      })
    );
  });
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, pipeNeg(r.parts), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
        blanks: r.blanks || 2,
      })
    );
  });
  write(
    "lesson01-jump.json",
    practiceBase(
      "b2:u02:lesson01-jump",
      "Lesson 01 Jump — 부정문",
      "don't/doesn't · 주어진 말 (pp. 42–43)",
      "42–43",
      24,
      "Section A·B 각 15문항. 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장의 빈칸에 알맞은 말을 쓰세요.", rule: "don't 또는 doesn't만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: aRows.map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "주어진 말을 사용하여 부정문을 완성하세요.", rule: "빈칸마다 한 단어씩 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: bRows.map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Lesson 01 Fly (pp. 44–45) ——
(function lesson01Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 부정문으로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  const aRows = [
    { en: "You not do clean your room.", ul: "not do clean", parts: ["don't", "clean"], ko: "너는 방을 청소하지 않는다." },
    { en: "Susie likes not sports.", ul: "likes not", parts: ["doesn't", "like"], ko: "수지는 스포츠를 좋아하지 않는다." },
    { en: "We not do sing at night.", ul: "not do sing", parts: ["don't", "sing"], ko: "우리는 밤에 노래하지 않는다." },
    { en: "Peter doesn't knows Emily.", ul: "doesn't knows", parts: ["doesn't", "know"], ko: "피터는 에밀리를 알지 못한다." },
    { en: "I doesn't have long hair.", ul: "doesn't have", parts: ["don't", "have"], ko: "나는 긴 머리가 없다." },
    { en: "My father don't wash his car.", ul: "don't wash", parts: ["doesn't", "wash"], ko: "우리 아버지는 자동차를 씻지 않는다." },
    { en: "Sangmin not drink cold water.", ul: "not drink", parts: ["doesn't", "drink"], ko: "상민은 차가운 물을 마시지 않는다." },
    { en: "My aunt not wear glasses.", ul: "not wear", parts: ["doesn't", "wear"], ko: "우리 이모는 안경을 쓰지 않는다." },
    { en: "James and Mike play not badminton.", ul: "play not", parts: ["don't", "play"], ko: "제임스와 마이크는 배드민턴을 하지 않는다." },
    { en: "Phil don't does his homework.", ul: "don't does", parts: ["doesn't", "do"], ko: "필은 숙제를 하지 않는다." },
    { en: "Those women not hate spiders.", ul: "not hate", parts: ["don't", "hate"], ko: "저 여자들은 거미를 싫어하지 않는다." },
    { en: "Mr. Baker not remembers my name.", ul: "not remembers", parts: ["doesn't", "remember"], ko: "베이커 선생님은 내 이름을 기억하지 않는다." },
    { en: "They doesn't ride bicycles.", ul: "doesn't ride", parts: ["don't", "ride"], ko: "그들은 자전거를 타지 않는다." },
    { en: "Sarah not look happy.", ul: "not look", parts: ["doesn't", "look"], ko: "사라는 행복해 보이지 않는다." },
  ];
  const bRows = [
    { en: "We live in an apartment.", ans: "We don't live in an apartment.", ko: "우리는 아파트에 살지 않는다." },
    { en: "Junsu swims in the sea.", ans: "Junsu doesn't swim in the sea.", ko: "준수는 바다에서 수영하지 않는다." },
    { en: "I need a new spoon.", ans: "I don't need a new spoon.", ko: "나는 새 숟가락이 필요하지 않다." },
    { en: "My grandfather goes camping.", ans: "My grandfather doesn't go camping.", ko: "우리 할아버지는 캠핑을 가지 않는다." },
    { en: "The students play soccer.", ans: "The students don't play soccer.", ko: "학생들은 축구를 하지 않는다." },
    { en: "That boy eats fish.", ans: "That boy doesn't eat fish.", ko: "저 남자아이는 생선을 먹지 않는다." },
    { en: "They sell robots.", ans: "They don't sell robots.", ko: "그들은 로봇을 팔지 않는다." },
    { en: "His sisters like cats.", ans: "His sisters don't like cats.", ko: "그의 여동생들은 고양이를 좋아하지 않는다." },
    { en: "Ms. Brown makes teddy bears.", ans: "Ms. Brown doesn't make teddy bears.", ko: "브라운 선생님은 곰 인형을 만들지 않는다." },
    { en: "Her babies cry at night.", ans: "Her babies don't cry at night.", ko: "그녀의 아기들은 밤에 울지 않는다." },
    { en: "Charlie sends e-mail.", ans: "Charlie doesn't send e-mail.", ko: "찰리는 이메일을 보내지 않는다." },
    { en: "We want money.", ans: "We don't want money.", ko: "우리는 돈을 원하지 않는다." },
    { en: "Carrie cleans her shoes.", ans: "Carrie doesn't clean her shoes.", ko: "캐리는 신발을 닦지 않는다." },
    { en: "Tom and Jane have mobile phones.", ans: "Tom and Jane don't have mobile phones.", ko: "톰과 제인은 휴대전화를 가지고 있지 않다." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", underlineInSentence("I eat not tomatoes.", "eat not"), pipeNeg(["don't", "eat"]), {
        sectionInstructionKo: instrA,
        promptKo: "나는 토마토를 먹지 않는다.",
        blanks: 2,
      }),
      "don't|eat"
    ),
    exItem(
      fillItem("b01", "B", "B1", "You study math hard.", ["You don't study math hard.", "You do not study math hard."], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        promptKo: "너는 수학을 열심히 공부하지 않는다.",
      }),
      "You don't study math hard."
    ),
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), underlineInSentence(r.en, r.ul), pipeNeg(r.parts), {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
        blanks: 2,
      })
    );
  });
  bRows.forEach((r, i) => {
    const alt = r.ans.replace("don't", "do not").replace("doesn't", "does not");
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.en, [r.ans, alt], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson01-fly.json",
    practiceBase(
      "b2:u02:lesson01-fly",
      "Lesson 01 Fly — 부정문",
      "오류 고치기 · 부정문 쓰기 (pp. 44–45)",
      "44–45",
      26,
      "Section A 15문항(2칸), Section B 15문항(문장 전체). B1 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", rule: "빈칸마다 한 단어씩 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: aRows.map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "다음 문장을 부정문으로 바꿔 쓰세요.", rule: "문장 전체를 쓰세요.", mode: "sentence", tag: "Sentence · 문장 전체", labels: bRows.map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Lesson 02 Walk (p. 47) ——
(function lesson02Walk() {
  const instrA = "다음 문장이 부정문이면 N, 의문문이면 Q에 동그라미 하세요. 빈칸에 N 또는 Q만 쓰세요.";
  const instrB = "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const NQ = (q) => (q ? ["Q", "q", "의문문"] : ["N", "n", "부정문"]);
  const aRows = [
    { en: "Do you have a camera?", q: true, ko: "너는 카메라를 가지고 있니?" },
    { en: "I don't play computer games.", q: false, ko: "나는 컴퓨터 게임을 하지 않는다." },
    { en: "Do they work on Saturday?", q: true, ko: "그들은 토요일에 일하니?" },
    { en: "Do the children walk to school?", q: true, ko: "그 아이들은 걸어서 학교에 가니?" },
    { en: "Do the birds catch worms?", q: true, ko: "그 새들은 벌레를 잡니?" },
  ];
  const bRows = [
    { p: "A: Do we look pretty?\nB: No, you ( do / don't ).", c: ["do", "don't"], a: 1, ko: "우리가 예뻐 보이니? — 아니, 그렇지 않아." },
    { p: "A: Do they watch movies?\nB: Yes, they ( do / don't ).", c: ["do", "don't"], a: 0, ko: "그들은 영화를 보니? — 응, 그래." },
    { p: "A: Do the girls jump rope?\nB: No, they ( do / don't ).", c: ["do", "don't"], a: 1, ko: "그 여자아이들은 줄넘기를 하니? — 아니, 그렇지 않아." },
    { p: "A: Do Bill and Melinda enjoy sports?\nB: Yes, they ( do / don't ).", c: ["do", "don't"], a: 0, ko: "빌과 멜린다는 스포츠를 즐기니? — 응, 그래." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "You don't like bread.", NQ(false), { sectionInstructionKo: instrA, promptKo: "너는 빵을 좋아하지 않는다." }),
      "N"
    ),
    exItem(
      mcItem("b01", "B", "B1", "A: Do you like melons?\nB: Yes, I ( do / don't ).", ["do", "don't"], mcAcc(["do", "don't"], 0), {
        sectionInstructionKo: instrB,
        promptKo: "너는 멜론을 좋아하니? — 응, 그래.",
      }),
      "do"
    ),
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.en, NQ(r.q), {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
      })
    );
  });
  bRows.forEach((r, i) => {
    items.push(
      mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, r.c, mcAcc(r.c, r.a), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson02-walk.json",
    practiceBase(
      "b2:u02:lesson02-walk",
      "Lesson 02 Walk — 의문문",
      "N/Q · short answer (p. 47)",
      "47",
      10,
      "Section A 5문항(N/Q), Section B 4문항(고르기). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장이 부정문이면 N, 의문문이면 Q에 동그라미 하세요.", rule: "N 또는 Q만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: ["A2", "A3", "A4", "A5", "A6"] },
        { instr: instrB, dir: "다음 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", rule: "보기 중 하나를 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: ["B2", "B3", "B4", "B5"] },
        5,
        4
      ),
      items
    )
  );
})();

// —— Lesson 02 Walk 2 (p. 49) ——
(function lesson02Walk2() {
  const instrA = "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
  const instrB = "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 대답(a~e)을 하나 골라 누르세요.";
  const choices = ["a. Yes, I do.", "b. Yes, she does.", "c. Yes, he does.", "d. Yes, we do.", "e. Yes, they do."];
  const aRows = [
    { en: "She cleans the house.", ko: "그녀는 집을 청소한다." },
    { en: "Kate washes the dishes.", ko: "케이트는 설거지를 한다." },
    { en: "Bill wants hot chocolate.", ko: "빌은 핫초코를 원한다." },
    { en: "The boy swims after school.", ko: "그 남자아이는 방과 후에 수영한다." },
  ];
  const bRows = [
    { q: "Do they play soccer?", a: "e. Yes, they do.", ko: "그들은 축구를 하니?" },
    { q: "Do you like strawberries?", a: "a. Yes, I do.", ko: "너는 딸기를 좋아하니?" },
    { q: "Does your uncle speak French?", a: "c. Yes, he does.", ko: "너의 삼촌은 프랑스어를 말하니?" },
    { q: "Does Alice remember his face?", a: "b. Yes, she does.", ko: "앨리스는 그의 얼굴을 기억하니?" },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "John knows the writer.\n→ ______ John know the writer?", ["Does"], {
        sectionInstructionKo: instrA,
        promptKo: "존은 그 작가를 안다.",
      }),
      "Does"
    ),
    exItem(
      mcItem("b01", "B", "B1", "Do we have dinner here?", choices, ["d. Yes, we do.", "d"], {
        sectionInstructionKo: instrB,
        promptKo: "우리는 여기서 저녁을 먹니?",
      }),
      "d. Yes, we do."
    ),
  ];
  const aPrompts = [
    "She cleans the house.\n→ ______ she clean the house?",
    "Kate washes the dishes.\n→ ______ Kate wash the dishes?",
    "Bill wants hot chocolate.\n→ ______ Bill want hot chocolate?",
    "The boy swims after school.\n→ ______ the boy swim after school?",
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), aPrompts[i], ["Does"], {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
      })
    );
  });
  bRows.forEach((r, i) => {
    items.push(
      mcItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.q, choices, [r.a, r.a.charAt(0)], {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson02-walk2.json",
    practiceBase(
      "b2:u02:lesson02-walk2",
      "Lesson 02 Walk 2 — 의문문",
      "Does · 대답 연결 (p. 49)",
      "49",
      10,
      "Section A 4문항(Does), Section B 4문항(고르기). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", rule: "빈칸에 들어갈 말만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: ["A2", "A3", "A4", "A5"] },
        { instr: instrB, dir: "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.", rule: "알맞은 대답(a~e)을 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: ["B2", "B3", "B4", "B5"] },
        4,
        4
      ),
      items
    )
  );
})();

// —— Lesson 02 Run (pp. 50–51) ——
(function lesson02Run() {
  const instrA = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const instrB = "다음 의문문에 알맞은 대답을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const aRows = [
    { p: "( Do / Does ) you have a sister?", c: ["Do", "Does"], a: 0, ex: true, ko: "너는 여동생이 있니?" },
    { p: "( Do / Does ) Jake go to school?", c: ["Do", "Does"], a: 0, ko: "제이크는 학교에 가니?" },
    { p: "Does she ( hate / hates ) frogs?", c: ["hate", "hates"], a: 0, ko: "그녀는 개구리를 싫어하니?" },
    { p: "Do they ( learn / learns ) science?", c: ["learn", "learns"], a: 0, ko: "그들은 과학을 배우니?" },
    { p: "( Do / Does ) your brother ride a bike?", c: ["Do", "Does"], a: 0, ko: "너의 오빠는 자전거를 타니?" },
    { p: "Does Tom ( live / lives ) in Seoul?", c: ["live", "lives"], a: 0, ko: "톰은 서울에 사니?" },
    { p: "( Do / Does ) those girls play tennis?", c: ["Do", "Does"], a: 0, ko: "저 여자아이들은 테니스를 치니?" },
    { p: "( Do / Does ) Phil know the firefighter?", c: ["Do", "Does"], a: 0, ko: "필은 그 소방관을 아니?" },
    { p: "Do they ( watch / watches ) television?", c: ["watch", "watches"], a: 0, ko: "그들은 텔레비전을 보니?" },
    { p: "Does he ( make / makes ) spaghetti?", c: ["make", "makes"], a: 0, ko: "그는 스파게티를 만들니?" },
    { p: "( Do / Does ) her sister drink milk?", c: ["Do", "Does"], a: 1, ko: "그녀의 여동생은 우유를 마시니?" },
    { p: "( Do / Does ) bears like honey?", c: ["Do", "Does"], a: 0, ko: "곰은 꿀을 좋아하니?" },
    { p: "Does Park Jisung ( speak / speaks ) English well?", c: ["speak", "speaks"], a: 0, ko: "박지성은 영어를 잘 말하니?" },
    { p: "( Do / Does ) they go on a picnic today?", c: ["Do", "Does"], a: 0, ko: "그들은 오늘 소풍을 가니?" },
    { p: "( Do / Does ) your mother read comic books?", c: ["Do", "Does"], a: 1, ko: "너의 어머니는 만화책을 읽니?" },
  ];
  const bRows = [
    { p: "Do you want some water?", c: ["Yes, you do.", "Yes, I do."], a: 1, ex: true, ko: "너는 물을 좀 원하니?" },
    { p: "Do the students have balls?", c: ["No, they don't.", "No, they do."], a: 0, ko: "학생들은 공을 가지고 있니?" },
    { p: "Does Jessica go shopping?", c: ["Yes, she is.", "Yes, she does."], a: 1, ko: "제시카는 쇼핑하러 가니?" },
    { p: "Do they play golf?", c: ["No, they do.", "No, they don't."], a: 1, ko: "그들은 골프를 치니?" },
    { p: "Does a monkey like bananas?", c: ["Yes, it does.", "Yes, they does."], a: 0, ko: "원숭이는 바나나를 좋아하니?" },
    { p: "Do the ladies drink tea?", c: ["Yes, they do.", "No, they do."], a: 0, ko: "그 여성들은 차를 마시니?" },
    { p: "Does Jenny speak Korean?", c: ["No, she isn't.", "Yes, she does."], a: 1, ko: "제니는 한국어를 말하니?" },
    { p: "Do these children play the piano?", c: ["Yes, they are.", "Yes, they do."], a: 1, ko: "이 아이들은 피아노를 치니?" },
    { p: "Does your sister clean her room?", c: ["Yes, she does.", "Yes, she is."], a: 0, ko: "너의 여동생은 방을 청소하니?" },
    { p: "Do they study math?", c: ["No, they aren't.", "No, they don't."], a: 1, ko: "그들은 수학을 공부하니?" },
    { p: "Does John use that computer?", c: ["Yes, he does.", "No, he isn't."], a: 0, ko: "존은 그 컴퓨터를 사용하니?" },
    { p: "Do you help your brother?", c: ["Yes, you do.", "No, I don't."], a: 1, ko: "너는 동생을 돕니?" },
    { p: "Do the nurses know your mom?", c: ["Yes, they do.", "Yes, they are."], a: 0, ko: "그 간호사들은 너의 엄마를 아니?" },
    { p: "Does Mr. Park drive a car?", c: ["Yes, he is.", "No, he doesn't."], a: 1, ko: "박 선생님은 자동차를 운전하니?" },
    { p: "Does the bus stop here?", c: ["Yes, it does.", "No, it isn't."], a: 0, ko: "그 버스는 여기에 멈추니?" },
  ];
  const items = [];
  aRows.forEach((r, i) => {
    const base = mcItem("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), r.p, r.c, mcAcc(r.c, r.a), {
      sectionInstructionKo: instrA,
      promptKo: r.ko,
    });
    items.push(r.ex ? exItem(base, r.c[r.a]) : base);
  });
  bRows.forEach((r, i) => {
    const base = mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), r.p, r.c, mcAcc(r.c, r.a), {
      sectionInstructionKo: instrB,
      promptKo: r.ko,
    });
    items.push(r.ex ? exItem(base, r.c[r.a]) : base);
  });
  write(
    "lesson02-run.json",
    practiceBase(
      "b2:u02:lesson02-run",
      "Lesson 02 Run — 의문문",
      "Do/Does · short answer (pp. 50–51)",
      "50–51",
      20,
      "Section A·B 각 15문항(고르기). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", rule: "보기 중 하나를 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: aRows.slice(1).map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "다음 의문문에 알맞은 대답을 골라 동그라미 하세요.", rule: "보기 중 하나를 골라 누르세요.", mode: "choice", tag: "Choose · 고르기", labels: bRows.slice(1).map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Lesson 02 Jump (pp. 52–53) ——
(function lesson02Jump() {
  const instrA =
    "주어진 말을 사용하여 의문문을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 쓰세요.";
  const aRows = [
    { p: "______ ______ ______ a watch? ( he, have )", parts: ["Does", "he", "have"], ko: "그는 손목시계를 가지고 있니?" },
    { p: "______ ______ ______ English? ( you, learn )", parts: ["Do", "you", "learn"], ko: "너희는 영어를 배우니?" },
    { p: "______ ______ ______ the newspaper? ( your father, read )", parts: ["Does", "your father", "read"], ko: "너희 아버지는 신문을 읽으시니?" },
    { p: "______ ______ ______ volleyball? ( they, play )", parts: ["Do", "they", "play"], ko: "그들은 배구를 하니?" },
    { p: "______ ______ ______ cars? ( she, wash )", parts: ["Does", "she", "wash"], ko: "그녀는 세차를 하니?" },
    { p: "______ ______ ______ good? ( we, look )", parts: ["Do", "we", "look"], ko: "우리가 좋아 보이니?" },
    { p: "______ ______ ______ the dishes? ( she, wash )", parts: ["Does", "she", "wash"], ko: "그녀는 설거지를 하니?" },
    { p: "______ ______ ______ home early? ( you, come )", parts: ["Do", "you", "come"], ko: "너희는 집에 일찍 오니?" },
    { p: "______ ______ ______ on the bed? ( he, sleep )", parts: ["Does", "he", "sleep"], ko: "그는 침대에서 자니?" },
    { p: "______ ______ ______ your grandparents? ( you, visit )", parts: ["Do", "you", "visit"], ko: "너는 조부모님을 찾아뵙니?" },
    { p: "______ ______ ______ in Jeju? ( they, live )", parts: ["Do", "they", "live"], ko: "그들은 제주도에 사니?" },
    { p: "______ ______ ______ a diary? ( she, keep )", parts: ["Does", "she", "keep"], ko: "그녀는 일기를 쓰니?" },
    { p: "______ ______ ______ to the dentist? ( you, go )", parts: ["Do", "you", "go"], ko: "너희는 치과에 가니?" },
    { p: "______ ______ ______ bananas? ( the monkey, eat )", parts: ["Does", "the monkey", "eat"], ko: "그 원숭이는 바나나를 먹니?" },
  ];
  const bRows = [
    { p: "A: Does Katie learn yoga?\nB: Yes, ______ ______.", parts: ["she", "does"], ko: "케이티는 요가를 배우니? — 응, 그래." },
    { p: "A: Do they meet on Saturday?\nB: Yes, ______ ______.", parts: ["they", "do"], ko: "그들은 토요일에 만나니? — 응, 그래." },
    { p: "A: Does he send e-mail to Julia?\nB: No, ______ ______.", parts: ["he", "doesn't"], ko: "그는 줄리아에게 이메일을 보내니? — 아니, 그렇지 않아." },
    { p: "A: Do the boys enjoy sports?\nB: Yes, ______ ______.", parts: ["they", "do"], ko: "그 남자아이들은 스포츠를 즐기니? — 응, 그래." },
    { p: "A: Does her brother like dogs?\nB: No, ______ ______.", parts: ["he", "doesn't"], ko: "그녀의 오빠는 개를 좋아하니? — 아니, 그렇지 않아." },
    { p: "A: Do they wear school uniforms?\nB: Yes, ______ ______.", parts: ["they", "do"], ko: "그들은 교복을 입니? — 응, 그래." },
    { p: "A: Does your aunt drive a car?\nB: Yes, ______ ______.", parts: ["she", "does"], ko: "너의 이모는 자동차를 운전하니? — 응, 그래." },
    { p: "A: Do your parents read your diary?\nB: No, ______ ______.", parts: ["they", "don't"], ko: "너의 부모님은 네 일기를 읽니? — 아니, 그렇지 않아." },
    { p: "A: Does your sister want the sweater?\nB: No, ______ ______.", parts: ["she", "doesn't"], ko: "너의 여동생은 그 스웨터를 원하니? — 아니, 그렇지 않아." },
    { p: "A: Do the children play badminton?\nB: No, ______ ______.", parts: ["they", "don't"], ko: "그 아이들은 배드민턴을 치니? — 아니, 그렇지 않아." },
    { p: "A: Does John live in a city?\nB: Yes, ______ ______.", parts: ["he", "does"], ko: "존은 도시에 사니? — 응, 그래." },
    { p: "A: Does your father cook every day?\nB: No, ______ ______.", parts: ["he", "doesn't"], ko: "너의 아버지는 매일 요리하니? — 아니, 그렇지 않아." },
    { p: "A: Do they go to the museum?\nB: Yes, ______ ______.", parts: ["they", "do"], ko: "그들은 박물관에 가니? — 응, 그래." },
    { p: "A: Do you and Jane buy toys here?\nB: No, ______ ______.", parts: ["we", "don't"], ko: "너와 제인은 여기서 장난감을 사니? — 아니, 그렇지 않아." },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", "______ ______ ______ movies? ( you, like )", ["Do|you|like"], {
        sectionInstructionKo: instrA,
        promptKo: "너는 영화를 좋아하니?",
        blanks: 3,
      }),
      "Do|you|like"
    ),
    exItem(
      fillItem("b01", "B", "B1", "A: Do you have art class today?\nB: No, ______ ______.", pipeShort(["I", "don't"]), {
        sectionInstructionKo: instrB,
        promptKo: "너는 오늘 미술 수업이 있니? — 아니, 없어.",
        blanks: 2,
      }),
      "I|don't"
    ),
  ];
  aRows.forEach((r, i) => {
    const acc = [r.parts.join("|")];
    if (r.parts[0] === "Does" && r.parts[1].includes(" ")) acc.push(["Does", ...r.parts.slice(1)].join("|"));
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r.p, acc, {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
        blanks: 3,
      })
    );
  });
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.p, pipeShort(r.parts), {
        sectionInstructionKo: instrB,
        promptKo: r.ko,
        blanks: 2,
      })
    );
  });
  write(
    "lesson02-jump.json",
    practiceBase(
      "b2:u02:lesson02-jump",
      "Lesson 02 Jump — 의문문",
      "의문문 완성 · 대답 (pp. 52–53)",
      "52–53",
      24,
      "Section A·B 각 15문항. 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "주어진 말을 사용하여 의문문을 완성하세요.", rule: "빈칸마다 한 단어씩 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: aRows.map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "다음 대화의 빈칸에 알맞은 말을 쓰세요.", rule: "빈칸마다 한 단어씩 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: bRows.map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Lesson 02 Fly (pp. 54–55) ——
(function lesson02Fly() {
  const instrA =
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
  const instrB =
    "다음 문장을 의문문으로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 물음표까지 완전한 문장으로 쓰세요.)";
  const aRows = [
    { en: "Do Yunseok live in Busan?", ul: "Do", ans: ["Does"], ko: "윤석은 부산에 사니?" },
    { en: "Are you read novels?", ul: "Are", ans: ["Do"], ko: "너는 소설을 읽니?" },
    { en: "Does Chris likes autumn?", ul: "likes", ans: ["like"], ko: "크리스는 가을을 좋아하니?" },
    { en: "Does they study English hard?", ul: "Does", ans: ["Do"], ko: "그들은 영어를 열심히 공부하니?" },
    { en: "Is Minho know your birthday?", ul: "Is", ans: ["Does"], ko: "민호는 네 생일을 아니?" },
    { en: "Do they remembers her name?", ul: "remembers", ans: ["remember"], ko: "그들은 그녀의 이름을 기억하니?" },
    { en: "Does Sam wears blue jeans?", ul: "wears", ans: ["wear"], ko: "샘은 청바지를 입니?" },
    { en: "Do you listen to classical music? - Yes, you do.", ul: "you", ans: ["I"], ko: "너는 클래식 음악을 듣니? — 응, 그래." },
    { en: "Does he play chess? - No, he does.", ul: "does", ans: ["doesn't", "does not"], ko: "그는 체스를 두니? — 아니, 그렇지 않아." },
    { en: "Do the boys run fast? - Yes, we do.", ul: "we", ans: ["they"], ko: "그 남자아이들은 빨리 달리니? — 응, 그래." },
    { en: "Does Tommy help his sister? - No, he don't.", ul: "don't", ans: ["doesn't", "does not"], ko: "토미는 여동생을 돕니? — 아니, 그렇지 않아." },
    { en: "Does your mother need a car? - Yes, he does.", ul: "he", ans: ["she"], ko: "너의 어머니는 차가 필요하니? — 응, 그래." },
    { en: "Do they watch baseball games? - No, they doesn't.", ul: "doesn't", ans: ["don't", "do not"], ko: "그들은 야구 경기를 보니? — 아니, 그렇지 않아." },
    { en: "Does Amy ride her bicycle? - Yes, she do.", ul: "do", ans: ["does"], ko: "에이미는 자전거를 타니? — 응, 그래." },
  ];
  const bRows = [
    { en: "They use the Internet.", ans: "Do they use the Internet?", ko: "그들은 인터넷을 사용하니?" },
    { en: "She plays the cello.", ans: "Does she play the cello?", ko: "그녀는 첼로를 연주하니?" },
    { en: "Tommy reads a magazine.", ans: "Does Tommy read a magazine?", ko: "토미는 잡지를 읽니?" },
    { en: "Your parents get up early.", ans: "Do your parents get up early?", ko: "너희 부모님은 일찍 일어나니?" },
    { en: "Angie studies in New York.", ans: "Does Angie study in New York?", ko: "앤지는 뉴욕에서 공부하니?" },
    { en: "He drinks coffee.", ans: "Does he drink coffee?", ko: "그는 커피를 마시니?" },
    { en: "You live in Yeosu.", ans: "Do you live in Yeosu?", ko: "너는 여수에 사니?" },
    { en: "They need a new car.", ans: "Do they need a new car?", ko: "그들은 새 차가 필요하니?" },
    { en: "She likes the actor.", ans: "Does she like the actor?", ko: "그녀는 그 배우를 좋아하니?" },
    { en: "Kelly goes to school.", ans: "Does Kelly go to school?", ko: "켈리는 학교에 가니?" },
    { en: "They teach science.", ans: "Do they teach science?", ko: "그들은 과학을 가르치니?" },
    { en: "The students wear school uniforms.", ans: "Do the students wear school uniforms?", ko: "학생들은 교복을 입니?" },
    { en: "The boys know her phone number.", ans: "Do the boys know her phone number?", ko: "그 남자아이들은 그녀의 전화번호를 아니?" },
    { en: "Kevin does his homework after dinner.", ans: "Does Kevin do his homework after dinner?", ko: "케빈은 저녁 식사 후에 숙제를 하니?" },
  ];
  const items = [
    exItem(
      fillItem("a01", "A", "A1", underlineInSentence("Does you have brown eyes?", "Does"), ["Do"], {
        sectionInstructionKo: instrA,
        promptKo: "너는 갈색 눈을 가지고 있니?",
        blanks: 1,
      }),
      "Do"
    ),
    exItem(
      fillItem("b01", "B", "B1", "You have a pet.", ["Do you have a pet?"], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        promptKo: "너는 애완동물을 가지고 있니?",
      }),
      "Do you have a pet?"
    ),
  ];
  aRows.forEach((r, i) => {
    items.push(
      fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), underlineInSentence(r.en, r.ul), r.ans, {
        sectionInstructionKo: instrA,
        promptKo: r.ko,
        blanks: 1,
      })
    );
  });
  bRows.forEach((r, i) => {
    items.push(
      fillItem("b" + String(i + 2).padStart(2, "0"), "B", "B" + (i + 2), r.en, [r.ans], {
        sectionInstructionKo: instrB,
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
        promptKo: r.ko,
      })
    );
  });
  write(
    "lesson02-fly.json",
    practiceBase(
      "b2:u02:lesson02-fly",
      "Lesson 02 Fly — 의문문",
      "오류 고치기 · 의문문 쓰기 (pp. 54–55)",
      "54–55",
      26,
      "Section A 15문항(한 단어), Section B 15문항(문장 전체). 예시는 채점하지 않아요.",
      sectionPair(
        { instr: instrA, dir: "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", rule: "빈칸에 들어갈 말만 쓰세요.", mode: "words", tag: "Words · 빈칸 말만", labels: aRows.map((_, i) => "A" + (i + 2)) },
        { instr: instrB, dir: "다음 문장을 의문문으로 바꿔 쓰세요.", rule: "문장 전체를 쓰세요.", mode: "sentence", tag: "Sentence · 문장 전체", labels: bRows.map((_, i) => "B" + (i + 2)) },
        14,
        14
      ),
      items
    )
  );
})();

// —— Review 02 (pp. 56–58) ——
(function review02() {
  const items = [];
  const s1 = "[1] 다음 중 주어진 문장을 부정문으로 바르게 고친 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c1 = [
    "I read not books after dinner.",
    "I am not read books after dinner.",
    "I not read books after dinner.",
    "I don't read books after dinner.",
  ];
  items.push(
    mcItem("q01", "1", "1", "I read books after dinner.", c1, mcAcc(c1, 3), { sectionInstructionKo: s1, promptKo: "나는 저녁 식사 후에 책을 읽는다." })
  );

  const s23 = "[2–3] 다음 중 주어진 문장을 의문문으로 바르게 고친 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c2 = ["Have they five uncles?", "Are they have five uncles?", "Do they have five uncles?", "Does they have five uncles?"];
  const c3 = ["Studies she English hard?", "Does she study English hard?", "Do she study English hard?", "Does she studies English hard?"];
  items.push(
    mcItem("q02", "2-3", "2", "They have five uncles.", c2, mcAcc(c2, 2), { sectionInstructionKo: s23, promptKo: "그들은 다섯 명의 삼촌이 있다." }),
    mcItem("q03", "2-3", "3", "She studies English hard.", c3, mcAcc(c3, 1), { sectionInstructionKo: s23, promptKo: "그녀는 영어를 열심히 공부한다." })
  );

  const s45 = "[4–5] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c4 = ["I don't like winter.", "We aren't get up late.", "They don't know me.", "The girls don't live here."];
  const c5 = ["Do you know her?", "Do they live in an apartment?", "Does she play the piano?", "Does he speaks English?"];
  items.push(
    mcItem("q04", "4-5", "4", "", c4, mcAcc(c4, 1), { sectionInstructionKo: s45 }),
    mcItem("q05", "4-5", "5", "", c5, mcAcc(c5, 3), { sectionInstructionKo: s45 })
  );

  const s67 = "[6–7] 다음 중 올바른 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c6 = ["We not play baseball.", "She don't have time.", "Tom doesn't like vegetables.", "They have not sisters."];
  const c7 = ["Does he speaks English?", "Are they have breakfast?", "Does Tom play basketball?", "Do your mother teach English?"];
  items.push(
    mcItem("q06", "6-7", "6", "", c6, mcAcc(c6, 2), { sectionInstructionKo: s67 }),
    mcItem("q07", "6-7", "7", "", c7, mcAcc(c7, 2), { sectionInstructionKo: s67 })
  );

  const s89 = "[8–9] 다음 의문문에 대한 대답으로 알맞은 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c8 = ["Yes, you do.", "Yes, I do.", "No, we do.", "Yes, we do."];
  const c9 = ["Yes, she do.", "Yes, Jenny doesn't.", "No, she doesn't.", "No, she isn't."];
  items.push(
    mcItem("q08", "8-9", "8", "Do you walk to school?", c8, mcAcc(c8, 1), { sectionInstructionKo: s89, promptKo: "너는 걸어서 학교에 가니?" }),
    mcItem("q09", "8-9", "9", "Does Jenny listen to classical music?", c9, mcAcc(c9, 2), { sectionInstructionKo: s89, promptKo: "제니는 클래식 음악을 듣니?" })
  );

  const s10 = "[10] 다음 중 짝지어진 대화가 어색한 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  const c10 = [
    "A: Do you know his phone number? B: Yes, I do.",
    "A: Does Annie learn Korean? B: No, she isn't.",
    "A: Do they play badminton? B: No, they don't.",
    "A: Does Fred like fish? B: Yes, he does.",
  ];
  items.push(
    mcItem("q10", "10", "10", "", c10, mcAcc(c10, 1), {
      sectionInstructionKo: s10,
      promptKo: "다음 중 짝지어진 대화가 어색한 것을 고르세요.",
    })
  );

  const s1112 = "[11–12] 다음 의문문에 대한 대답으로 알맞은 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
  items.push(
    mcItem("q11", "11-12", "11", "Do you need a cup?\nYes, ( you / I ) do.", ["you", "I"], mcAcc(["you", "I"], 1), { sectionInstructionKo: s1112, promptKo: "너는 컵이 하나 필요하니?" }),
    mcItem("q12", "11-12", "12", "Does Emily like sports?\nNo, she ( doesn't / isn't ).", ["doesn't", "isn't"], mcAcc(["doesn't", "isn't"], 0), {
      sectionInstructionKo: s1112,
      promptKo: "에밀리는 스포츠를 좋아하니?",
    })
  );

  const s1315 = "[13–15] 다음 문장을 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 쓰세요.";
  items.push(
    fillItem("q13", "13-15", "13", "You have a computer. (의문문)\n______ ______ ______ a computer?", ["Do|you|have"], {
      sectionInstructionKo: s1315,
      promptKo: "너는 컴퓨터를 가지고 있니?",
      blanks: 3,
    }),
    fillItem("q14", "13-15", "14", "She plays chess. (부정문)\n______ ______ ______ chess.", pipeNeg(["doesn't", "play"]), {
      sectionInstructionKo: s1315,
      promptKo: "그녀는 체스를 두지 않는다.",
      blanks: 3,
    }),
    fillItem("q15", "13-15", "15", "He watches television. (의문문)\n______ ______ ______ television?", ["Does|he|watch"], {
      sectionInstructionKo: s1315,
      promptKo: "그는 텔레비전을 보니?",
      blanks: 3,
    })
  );

  const s1618 = "[16–18] 다음 의문문에 대한 대답을 완성하세요. 빈칸마다 한 단어씩 쓰세요.";
  items.push(
    fillItem("q16", "16-18", "16", "Do the children read books at the library?\nYes, ______ ______.", pipeShort(["they", "do"]), {
      sectionInstructionKo: s1618,
      promptKo: "그 아이들은 도서관에서 책을 읽니?",
      blanks: 2,
    }),
    fillItem("q17", "16-18", "17", "Does she have lunch with her friends?\nNo, ______ ______.", pipeShort(["she", "doesn't"]), {
      sectionInstructionKo: s1618,
      promptKo: "그녀는 친구들과 점심을 먹니?",
      blanks: 2,
    }),
    fillItem("q18", "16-18", "18", "Does James use the computer?\nNo, ______ ______.", pipeShort(["he", "doesn't"]), {
      sectionInstructionKo: s1618,
      promptKo: "제임스는 컴퓨터를 사용하니?",
      blanks: 2,
    })
  );

  const s1920 =
    "[19–20] 다음 문장에서 밑줄 친 부분을 찾아 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
  items.push(
    fillItem(
      "q19",
      "19-20",
      "19",
      underlineInSentence("My sister don't study at the library.", "don't"),
      ["My sister doesn't study at the library.", "My sister does not study at the library."],
      {
        sectionInstructionKo: s1920,
        promptKo: "우리 여동생은 도서관에서 공부하지 않는다.",
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }
    ),
    fillItem(
      "q20",
      "19-20",
      "20",
      underlineInSentence("Does he wears glasses?", "wears"),
      ["Does he wear glasses?"],
      {
        sectionInstructionKo: s1920,
        promptKo: "그는 안경을 쓰니?",
        answerMode: "sentence",
        type: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }
    )
  );

  write(
    "review-02.json",
    practiceBase(
      "b2:u02:review02",
      "Review 02",
      "Unit 02 일반동사의 부정문과 의문문 (pp. 56–58)",
      "56–58",
      30,
      "Review 02는 [1]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.",
      [
        sec("1", "[1]", s1, "다음 중 주어진 문장을 부정문으로 바르게 고친 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["1"]),
        sec("2-3", "[2–3]", s23, "다음 중 주어진 문장을 의문문으로 바르게 고친 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["2", "3"]),
        sec("4-5", "[4–5]", s45, "다음 중 잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["4", "5"]),
        sec("6-7", "[6–7]", s67, "다음 중 올바른 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["6", "7"]),
        sec("8-9", "[8–9]", s89, "다음 의문문에 대한 대답으로 알맞은 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["8", "9"]),
        sec("10", "[10]", s10, "다음 중 짝지어진 대화가 어색한 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["10"]),
        sec("11-12", "[11–12]", s1112, "다음 의문문에 대한 대답으로 알맞은 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
        sec("13-15", "[13–15]", s1315, "다음 문장을 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["13", "14", "15"]),
        sec("16-18", "[16–18]", s1618, "다음 의문문에 대한 대답을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["16", "17", "18"]),
        sec("19-20", "[19–20]", s1920, "다음 문장에서 밑줄 친 부분을 찾아 바르게 고쳐 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
      ],
      items
    )
  );
})();

console.log("Done —", OUT);
