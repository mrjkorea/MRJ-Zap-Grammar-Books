/* Continuation of unit04-generate.js */
"use strict";

module.exports = function (ctx) {
  const { write, pack, sec, fill, mc, ex, META, X_OK } = ctx;

  // —— Lesson 01 Fly ——
  (function () {
    const iA =
      "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 밑줄 친 부분이 필요 없으면 빈칸에 X표를 하세요. 빈칸에 들어갈 말만 쓰세요.";
    const iB =
      "부정관사 a 또는 an과 주어진 말을 사용하여 문장을 완성하세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
    const flyA = [
      ["She is <u>an</u> teacher.", ["a"]],
      ["I have <u>a</u> umbrella.", ["an"]],
      ["They have <u>a</u> desks.", X_OK],
      ["I drink <u>a</u> milk.", X_OK],
      ["I need <u>an</u> cap.", ["a"]],
      ["We eat <u>a</u> cheese.", X_OK],
      ["I have <u>a</u> egg.", ["an"]],
      ["I buy <u>a</u> salt there.", X_OK],
      ["I need <u>an</u> toothbrush.", ["a"]],
      ["They need <u>a</u> three chairs.", X_OK],
      ["They eat <u>a</u> bread.", X_OK],
      ["They are <u>a</u> children.", X_OK],
      ["I have <u>a</u> orange.", ["an"]],
      ["I need <u>a</u> shoes.", X_OK],
      ["I walk one kilometer <u>a</u> hour.", ["an"]],
    ];
    const items = flyA.map((row, idx) => {
      const n = idx + 1;
      const acc = row[1] === X_OK ? X_OK : row[1];
      const it = fill("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], acc, { sectionInstructionKo: iA });
      return n === 1 ? ex(it, "a") : it;
    });
    const flyB = [
      ["I have an umbrella.", "umbrella"],
      ["We want a knife.", "knife"],
      ["That is an ant.", "ant"],
      ["Tokyo is a city.", "city"],
      ["That is a flower.", "flower"],
      ["I eat an apple.", "apple"],
      ["Mr. Jones is a writer.", "writer"],
      ["An elephant is big.", "elephant"],
      ["I walk three kilometers an hour.", "hour"],
      ["Give me a pencil.", "pencil"],
      ["I need an eraser.", "eraser"],
      ["They have an ox.", "ox"],
      ["She is a doctor.", "doctor"],
      ["This is an igloo.", "igloo"],
      ["I read two storybooks a week.", "week"],
    ];
    flyB.forEach((row, idx) => {
      const n = idx + 1;
      const it = fill("b" + String(n).padStart(2, "0"), "B", "B" + n, "Complete: (" + row[1] + ")", [row[0]], {
        sectionInstructionKo: iB,
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      });
      items.push(n === 1 ? ex(it, row[0]) : it);
    });
    write(
      "lesson01-fly.json",
      pack("b1:u04:lesson01-fly", "Lesson 01 Fly — 부정관사 a/an", "고치기 · 문장 완성 (pp. 90–91)", "90–91", 26, "Section A는 고치기/X, Section B는 문장 완성.", [
        sec("A", "Section A", iA, "밑줄 친 부분을 고치거나 X.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
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
        ]),
        sec("B", "Section B", iB, "주어진 말로 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 14, 1, [
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
        ]),
      ], items)
    );
  })();

  // —— Lesson 02 Walk 1 ——
  (function () {
    const iA =
      "다음 문장에서 부정관사 a, an을 찾아 밑줄을 치고, 정관사 the를 찾아 동그라미 하세요. 찾은 관사(a, an, the)를 빈칸에 쓰세요. 여러 개면 빈칸마다 하나씩 쓰세요. (순서는 상관없습니다.)";
    const rows = [
      ["They live with a girl. I know the girl.", ["a", "the"], 2, true, "그들은 한 소녀와 산다. 나는 그 소녀를 안다."],
      ["Close the window.", ["the"], 1, false, "창문을 닫아라."],
      ["I have a bicycle. The bicycle is new.", ["a", "the"], 2, true, "나는 자전거가 있다. 그 자전거는 새것이다."],
      ["We play the guitar.", ["the"], 1, false, "우리는 기타를 연주한다."],
      ["Ms. Gray is a doctor.", ["a"], 1, false, "그레이 양은 의사이다."],
      ["They have a cat. The cat is white.", ["a", "the"], 2, true, "그들은 고양이가 있다. 그 고양이는 희다."],
      ["We live on the Earth.", ["the"], 1, false, "우리는 지구에 산다."],
      ["I need a notebook.", ["a"], 1, false, "나는 공책이 필요하다."],
      ["The sun is in the sky.", ["the", "the"], 2, true, "태양은 하늘에 있다."],
      ["We have three dogs. The dogs like snow.", ["the"], 1, false, "우리는 개 세 마리가 있다. 그 개들은 눈을 좋아한다."],
    ];
    const items = rows.map((row, idx) => {
      const n = idx + 1;
      const opts = { sectionInstructionKo: iA, blanks: row[2], promptKo: row[4] };
      if (row[3]) opts.unordered = true;
      const acc = row[1].length > 1 ? [row[1].join("|")] : row[1];
      const it = fill("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], acc, opts);
      return n === 1 ? ex(it, row[1].join(" ")) : it;
    });
    write(
      "lesson02-walk1.json",
      pack("b1:u04:lesson02-walk1", "Lesson 02 Walk 1 — 정관사 the", "a/an · the 찾기 (p. 93)", "93", 10, "관사를 모두 쓰세요. 여러 개면 순서는 상관없습니다.", [
        sec("A", "Section A", iA, "관사를 찾아 쓰세요.", "관사만 쓰세요.", "words", "Words · 빈칸 말만", 9, 1, ["A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"]),
      ], items)
    );
  })();

  // —— Lesson 02 Walk 2 ——
  (function () {
    const iA =
      "다음 중 관사를 쓰지 않는 명사를 찾아 빈칸에 순서대로 쓰세요. 보기 순서(왼쪽에서 오른쪽, 위에서 아래)대로 쓰세요. 빈칸에 들어갈 말만 쓰세요.";
    const bank = [
      "math",
      "basketball",
      "piano",
      "lunch",
      "dish",
      "Chinese",
      "soccer",
      "violin",
      "science",
      "doctor",
      "tennis",
      "breakfast",
      "Japanese",
      "guitar",
      "moon",
      "dinner",
      "baseball",
      "sunshine",
      "flower",
      "Korean",
      "cheese",
      "school",
      "English",
      "badminton",
    ];
    const answers = [
      "math",
      "basketball",
      "lunch",
      "Chinese",
      "soccer",
      "science",
      "tennis",
      "breakfast",
      "Japanese",
      "dinner",
      "baseball",
      "Korean",
      "English",
      "badminton",
    ];
    const items = answers.map((w, idx) =>
      fill("a" + String(idx + 1).padStart(2, "0"), "A", String(idx + 1), "보기 순서 " + (idx + 1), [w], { sectionInstructionKo: iA })
    );
    write(
      "lesson02-walk2.json",
      pack(
        "b1:u04:lesson02-walk2",
        "Lesson 02 Walk 2 — 정관사 the",
        "관사 없는 명사 (p. 95)",
        "95",
        10,
        "단어 목록에서 관사를 쓰지 않는 명사만 보기 순서대로 쓰세요.",
        [sec("A", "Section A", iA, "관사 없는 명사를 순서대로 쓰세요.", "단어 하나만 쓰세요.", "words", "Words · 빈칸 말만", 14, 0, [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
        ])],
        items,
        { wordBank: bank }
      )
    );
  })();

  // —— Lesson 02 Run ——
  (function () {
    const iA =
      "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요. (직접 쓰지 않아요.)";
    const iB =
      "다음 문장의 빈칸에 알맞은 것을 골라 동그라미 하세요. 보기 중 하나를 골라 누르세요. (직접 쓰지 않아요.)";
    const runA = [
      ["Close ( a / the ) window.", ["a", "the"], ["the", "2"]],
      ["I like ( a / the ) moon.", ["a", "the"], ["the", "2"]],
      ["They play ( a / the ) violin.", ["a", "the"], ["the", "2"]],
      ["I have a dog. ( A / The ) dog is cute.", ["A", "The"], ["The", "2"]],
      ["Birds fly in ( a / the ) sky.", ["a", "the"], ["the", "2"]],
      ["We play ( the / X ) soccer.", ["the", "X"], ["X", "2"]],
      ["They have ( the / X ) breakfast.", ["the", "X"], ["X", "2"]],
      ["I like ( the / X ) science.", ["the", "X"], ["X", "2"]],
      ["I know a dancer. ( A / The ) dancer is tall.", ["A", "The"], ["The", "2"]],
      ["They speak ( the / X ) English.", ["the", "X"], ["X", "2"]],
      ["I have ( the / X ) lunch with my friend.", ["the", "X"], ["X", "2"]],
      ["You play ( the / X ) guitar.", ["the", "X"], ["the", "1"]],
      ["Open ( a / the ) door.", ["a", "the"], ["the", "2"]],
      ["They live on ( an / the ) Earth.", ["an", "the"], ["the", "2"]],
      ["They play ( the / X ) tennis.", ["the", "X"], ["X", "2"]],
    ];
    const items = runA.map((row, idx) => {
      const n = idx + 1;
      const ch = row[1];
      const ans = row[2];
      const isX = ans[0] === "X";
      const accept = isX
        ? ["2", "X", "x"]
        : ans[1] === "2"
          ? ["2", ans[0], ans[0].toLowerCase()]
          : ["1", ans[0], ans[0].toLowerCase()];
      const it = mc("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], ch, accept, { sectionInstructionKo: iA });
      return n === 1 ? ex(it, "the") : it;
    });
    const runBPrompts = [
      "I play _______ violin.",
      "I like _______ math.",
      "Close _______ door.",
      "_______ moon is beautiful.",
      "A kite is in _______ sky.",
      "I have _______ dinner.",
      "We watch _______ television.",
      "I have a box. _______ box is green.",
      "We like _______ badminton.",
      "They play _______ piano.",
      "The boys like _______ science.",
      "They have _______ lunch at home.",
      "Look at _______ bird.",
      "We speak _______ Korean.",
      "They play _______ baseball.",
    ];
    const runBA = ["the", "필요 없음", "the", "The", "the", "필요 없음", "필요 없음", "The", "필요 없음", "the", "필요 없음", "필요 없음", "the", "필요 없음", "필요 없음"];
    runBPrompts.forEach((p, idx) => {
      const n = idx + 1;
      const ans = runBA[idx];
      const ch = ans === "필요 없음" ? ["the", "필요 없음"] : ans === "The" ? ["The", "필요 없음"] : ["the", "필요 없음"];
      const accept = ans === "필요 없음" ? ["2", "필요 없음", "X", "x"] : ans === "The" ? ["1", "The", "the"] : ["1", "the"];
      const it = mc("b" + String(n).padStart(2, "0"), "B", "B" + n, p, ch, accept, { sectionInstructionKo: iB });
      items.push(n === 1 ? ex(it, "the") : it);
    });
    write(
      "lesson02-run.json",
      pack("b1:u04:lesson02-run", "Lesson 02 Run — 정관사 the", "괄호 · 빈칸 고르기 (pp. 96–97)", "96–97", 20, "Section A는 the/X 또는 A/The, Section B는 the 또는 필요 없음.", [
        sec("A", "Section A", iA, "괄호 안에서 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, [
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
        ]),
        sec("B", "Section B", iB, "빈칸에 알맞은 것을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 14, 1, [
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
        ]),
      ], items)
    );
  })();

  // —— Lesson 02 Jump ——
  (function () {
    const iA =
      "다음 문장의 빈칸에 알맞은 말을 쓰세요. 필요 없으면 X표 하세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
    const iB =
      "다음 문장의 빈칸에 알맞은 말을 쓰세요. 필요 없으면 X표 하세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
    const jumpA = [
      ["I play _______ piano every day.", ["the"], true],
      ["We have a dog. _______ dog is smart.", ["The", "the"]],
      ["_______ moon is bright.", ["The", "the"]],
      ["They speak _______ Japanese.", X_OK],
      ["The men play _______ soccer on the weekend.", X_OK],
      ["We have _______ lunch at school.", X_OK],
      ["You play _______ guitar.", ["the"]],
      ["The girls like _______ math.", X_OK],
      ["I have _______ breakfast.", X_OK],
      ["Open _______ window.", ["the"]],
      ["Two girls are at the bus stop. I know _______ girls.", ["the"]],
      ["An airplane is in _______ sky.", ["the"]],
      ["I like _______ science.", X_OK],
      ["Look at _______ elephant.", ["the"]],
      ["They have a cat. _______ cat is small.", ["The", "the"]],
    ];
    const items = jumpA.map((row, idx) => {
      const n = idx + 1;
      const acc = row[1] === X_OK ? X_OK : row[1];
      const it = fill("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], acc, { sectionInstructionKo: iA });
      return row[2] ? ex(it, "the") : it;
    });
    const jumpB = [
      ["I am _______ student.", ["a"], true, "나는 학생이다."],
      ["_______ dog is white.", ["The", "the"], false, "그 개는 희다."],
      ["I have _______ eraser.", ["an"], false, "나는 지우개 한 개를 가지고 있다."],
      ["Dragonflies are in _______ sky.", ["the"], false, "잠자리들이 하늘에 있다."],
      ["_______ sun is yellow.", ["The", "the"], false, "태양은 노랗다."],
      ["You like _______ science.", X_OK, false, "너는 과학을 좋아한다."],
      ["I eat salad for _______ breakfast.", X_OK, false, "나는 아침 식사로 샐러드를 먹는다."],
      ["We play _______ basketball.", X_OK, false, "우리는 농구를 한다."],
      ["They speak _______ English.", X_OK, false, "그들은 영어를 말한다."],
      ["Open _______ window.", ["the"], false, "창문을 열어라."],
      ["They play _______ piano.", ["the"], false, "그들은 피아노를 친다."],
      ["Close _______ door.", ["the"], false, "문을 닫아라."],
      ["We have _______ lunch together.", X_OK, false, "우리는 함께 점심 식사를 한다."],
      ["I have _______ book. _______ book is interesting.", ["a|The", "a|the"], false, "나는 책을 한 권 가지고 있다. 그 책은 재미있다.", 2],
      ["I play _______ guitar twice _______ week.", ["the|a", "the|a"], false, "나는 일주일에 두 번 기타를 친다.", 2],
    ];
    jumpB.forEach((row, idx) => {
      const n = idx + 1;
      const acc = row[1] === X_OK ? X_OK : row[4] === 2 ? [row[1].join("|")] : row[1];
      const opts = { sectionInstructionKo: iB, promptKo: row[3] };
      if (row[4] === 2) opts.blanks = 2;
      const it = fill("b" + String(n).padStart(2, "0"), "B", "B" + n, row[0], acc, opts);
      items.push(row[2] ? ex(it, row[1] === X_OK ? "X" : Array.isArray(row[1]) ? row[1].join(" ") : row[1][0]) : it);
    });
    write(
      "lesson02-jump.json",
      pack("b1:u04:lesson02-jump", "Lesson 02 Jump — 정관사 the", "빈칸 채우기 (pp. 98–99)", "98–99", 24, "Section A·B 모두 a/an/the/X를 쓰거나 X표 합니다.", [
        sec("A", "Section A", iA, "빈칸에 알맞은 말을 쓰세요.", "필요 없으면 X.", "words", "Words · 빈칸 말만", 14, 1, [
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
        ]),
        sec("B", "Section B", iB, "우리말 뜻에 맞게 빈칸을 채우세요.", "필요 없으면 X.", "words", "Words · 빈칸 말만", 14, 1, [
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
        ]),
      ], items)
    );
  })();

  // —— Lesson 02 Fly ——
  (function () {
    const iA =
      "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
    const iB =
      "주어진 말을 사용하여 다음 문장을 완성하세요. 필요하면 a, an 또는 the와 함께 쓰세요. 문장 전체를 쓰세요.";
    const flyA = [
      ["I <u>have the lunch</u> at noon.", ["have lunch", "have lunch at noon"]],
      ["Close <u>an window</u>.", ["the window", "Close the window."]],
      ["I <u>play a soccer</u> after school.", ["play soccer", "play soccer after school"]],
      ["I <u>play piano</u> every day.", ["play the piano", "play the piano every day"]],
      ["<u>An Earth</u> is round.", ["The Earth", "The Earth is round"]],
      ["We speak <u>the Korean</u>.", ["Korean", "speak Korean"]],
      ["I <u>watch a TV</u> every night.", ["watch TV", "watch TV every night"]],
      ["We <u>have the dinner</u> at home.", ["have dinner", "have dinner at home"]],
      ["I like <u>a science</u>.", ["science", "like science"]],
      ["Look at <u>a sky</u>.", ["the sky", "Look at the sky."]],
      ["We like <u>the math</u>.", ["math", "like math"]],
      ["It is <u>sun</u>.", ["the sun", "It is the sun."]],
      ["A lady is at the bus stop. I know <u>a lady</u>.", ["the lady", "I know the lady."]],
      ["They speak <u>the Chinese</u>.", ["Chinese", "speak Chinese"]],
      ["They <u>play the baseball</u> once a month.", ["play baseball", "play baseball once a month"]],
    ];
    const items = flyA.map((row, idx) => {
      const n = idx + 1;
      const it = fill("a" + String(n).padStart(2, "0"), "A", "A" + n, row[0], row[1], { sectionInstructionKo: iA });
      return n === 1 ? ex(it, "have lunch") : it;
    });
    const flyB = [
      ["I have bread for breakfast.", "breakfast"],
      ["They play soccer twice a week.", "soccer"],
      ["I play the flute on the weekend.", "flute"],
      ["We speak English.", "English"],
      ["I like science.", "science"],
      ["I watch television after dinner.", "television"],
      ["Look at the moon.", "moon"],
      ["Open the door.", "door"],
      ["I have a photo. The photo is beautiful.", "photo"],
      ["They play badminton here.", "badminton"],
      ["We have dinner there.", "dinner"],
      ["They learn Korean.", "Korean"],
      ["Birds fly in the sky.", "sky"],
      ["I like music.", "music"],
      ["You play the guitar well.", "guitar"],
    ];
    flyB.forEach((row, idx) => {
      const n = idx + 1;
      const it = fill("b" + String(n).padStart(2, "0"), "B", "B" + n, "Complete: (" + row[1] + ")", [row[0]], {
        sectionInstructionKo: iB,
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      });
      items.push(n === 1 ? ex(it, row[0]) : it);
    });
    write(
      "lesson02-fly.json",
      pack("b1:u04:lesson02-fly", "Lesson 02 Fly — 정관사 the", "고치기 · 문장 완성 (pp. 100–101)", "100–101", 26, "Section A는 밑줄 친 부분 고치기, Section B는 문장 완성.", [
        sec("A", "Section A", iA, "밑줄 친 부분을 고치세요.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, [
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
        ]),
        sec("B", "Section B", iB, "주어진 말로 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 14, 1, [
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
        ]),
      ], items)
    );
  })();

  // —— Review 04 ——
  (function () {
    const items = [];
    const mc4 = (id, secId, label, prompt, choices, accept, instr) =>
      mc(id, secId, label, prompt, choices, accept, { sectionInstructionKo: instr, sectionTitle: "Section " + secId });

    const i12 =
      "[1–2] 다음 중 밑줄 친 말이 잘못된 것을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mc4("q01", "1-2", "1", "Choose the underlined error.", [
        "She is <u>a</u> student.",
        "This is <u>a</u> notebook.",
        "I have <u>an</u> computer.",
        "That is <u>an</u> eraser.",
      ], ["3", "I have <u>an</u> computer."], i12),
      mc4("q02", "1-2", "2", "Choose the underlined error.", [
        "That is <u>a</u> church.",
        "I need <u>a</u> chair.",
        "They have <u>a</u> daughter.",
        "We have <u>a</u> hour.",
      ], ["4", "We have <u>a</u> hour."], i12)
    );

    const i35 = "[3–5] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mc4("q03", "3-5", "3", "Choose the incorrect sentence.", ["I have a money.", "That is a school.", "It is an elephant.", "Give me a pencil."], ["1", "I have a money."], i35),
      mc4("q04", "3-5", "4", "Choose the incorrect sentence.", ["We have two tables.", "I want a bag.", "They need a chairs.", "I eat salad."], ["3", "They need a chairs."], i35),
      mc4("q05", "3-5", "5", "Choose the incorrect sentence.", ["This is a uniform.", "We need an hour.", "This is a bicycle.", "We need a sunshine."], ["4", "We need a sunshine."], i35)
    );

    const i67 = "[6–7] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mc4("q06", "6-7", "6", "We play soccer once ______ week.", ["a", "an", "the", "필요 없음"], ["1", "a"], i67),
      mc4("q07", "6-7", "7", "I have a dog. ______ dog is pretty.", ["A", "An", "The", "필요 없음"], ["3", "The"], i67)
    );

    const i810 = "[8–10] 다음 중 잘못된 부분을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mc4("q08", "8-10", "8", "They play the baseball.", ["They", "play", "the", "baseball"], ["3", "the"], i810),
      mc4("q09", "8-10", "9", "I like the math.", ["I", "like", "the", "math"], ["3", "the"], i810),
      mc4("q10", "8-10", "10", "I have the dinner.", ["I", "have", "the", "dinner"], ["3", "the"], i810)
    );

    const i1112 =
      "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mc("q11", "11-12", "11", "Open ( a / the ) window.", ["a", "the"], ["2", "the"], {
        sectionInstructionKo: i1112,
        sectionTitle: "Section 11-12",
        promptKo: "창문을 열어라.",
      }),
      mc("q12", "11-12", "12", "I run ten kilometers ( a / the ) day.", ["a", "the"], ["1", "a"], {
        sectionInstructionKo: i1112,
        sectionTitle: "Section 11-12",
        promptKo: "나는 매일 10킬로미터를 달린다.",
      })
    );

    const i1315 =
      "[13–15] 다음 우리말 뜻과 같도록 빈칸에 a, an, the 중 알맞은 말을 쓰세요. 필요 없으면 X표 하세요. 빈칸에 들어갈 말만 쓰세요.";
    items.push(
      fill("q13", "13-15", "13", "I play ______ piano every day.", ["the"], { sectionInstructionKo: i1315, promptKo: "나는 매일 피아노를 친다." }),
      fill("q14", "13-15", "14", "We have ______ dinner together.", X_OK, { sectionInstructionKo: i1315, promptKo: "우리는 함께 저녁 식사를 한다." }),
      fill("q15", "13-15", "15", "They play ______ soccer on Saturday.", X_OK, { sectionInstructionKo: i1315, promptKo: "그들은 토요일에 축구를 한다." })
    );

    const i1618 =
      "[16–18] 다음 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
    items.push(
      fill("q16", "16-18", "16", "We watch <u>the TV</u> after dinner.", ["We watch TV after dinner."], {
        sectionInstructionKo: i1618,
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }),
      fill("q17", "16-18", "17", "They learn <u>the French</u> after school.", ["They learn French after school."], {
        sectionInstructionKo: i1618,
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }),
      fill("q18", "16-18", "18", "I play <u>a violin</u> every day.", ["I play the violin every day."], {
        sectionInstructionKo: i1618,
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      })
    );

    const i1920 =
      "[19–20] 다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요. 문장 전체를 쓰세요.";
    items.push(
      fill("q19", "19-20", "19", "I go there once a week. ( a / once / week )", ["I go there once a week."], {
        sectionInstructionKo: i1920,
        promptKo: "나는 일주일에 한 번 거기에 간다.",
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      }),
      fill("q20", "19-20", "20", "We have breakfast every day. ( breakfast / have )", ["We have breakfast every day."], {
        sectionInstructionKo: i1920,
        promptKo: "우리는 매일 아침 식사를 한다.",
        type: "sentence",
        answerMode: "sentence",
        answerModeTag: "Sentence · 문장 전체",
      })
    );

    write(
      "review04.json",
      pack("b1:u04:review04", "Review 04", "Unit 04 관사 (pp. 102–104)", "102–104", 30, "Review 04는 1–20번입니다. Check Check 점수표는 채점하지 않아요.", [
        sec("1-2", "[1–2]", i12, "밑줄 친 말이 잘못된 것을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
        sec("3-5", "[3–5]", i35, "잘못된 문장을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 3, 0, ["3", "4", "5"]),
        sec("6-7", "[6–7]", i67, "빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["6", "7"]),
        sec("8-10", "[8–10]", i810, "잘못된 부분을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 3, 0, ["8", "9", "10"]),
        sec("11-12", "[11–12]", i1112, "괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 고르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
        sec("13-15", "[13–15]", i1315, "a, an, the 또는 X.", "빈칸 말만 쓰세요.", "words", "Words · 빈칸 말만", 3, 0, ["13", "14", "15"]),
        sec("16-18", "[16–18]", i1618, "문장을 바르게 고쳐 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 3, 0, ["16", "17", "18"]),
        sec("19-20", "[19–20]", i1920, "주어진 말로 문장을 완성하세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
      ], items)
    );
  })();
};
