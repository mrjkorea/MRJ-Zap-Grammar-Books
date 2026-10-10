"use strict";
module.exports = function (ctx) {
  const { META, sec, ul, fillItem, mcItem, sentItem, exItem, write, wordVariants, permBlanks, labelsFrom } = ctx;

  function mcSection(rows, secId, prefix, instr, exFirst) {
    return rows.map((row, i) => {
      const [en, ch, ans, ko] = row;
      const id = prefix + String(i + 1).padStart(2, "0");
      const label = (prefix === "a" ? "A" : "B") + (i + 1);
      const base = mcItem(id, secId, label, en, ch, [ans, String(ch.indexOf(ans) + 1)], {
        sectionInstructionKo: instr,
        promptKo: ko,
      });
      if (exFirst && i === 0) return exItem(base, ans);
      return base;
    });
  }

  // Lesson 02 Walk 2
  (function () {
    const instrA =
      "다음 문장에서 의문사를 찾아 동그라미 하고 will을 찾아 밑줄을 치세요. 의문사와 will을 빈칸 두 칸에 쓰세요. 순서는 상관없습니다.";
    const instrB = "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 대답(a~e)을 하나 골라 누르세요.";
    const rowsA = [
      ["What will you wear today?", "What", "너는 오늘 무엇을 입을 거니?"],
      ["When will they get up?", "When", "그들은 언제 일어날 거니?"],
      ["How will she go to India?", "How", "그녀는 어떻게 인도에 갈 거니?"],
      ["Who will play the violin?", "Who", "누가 바이올린을 연주할 거니?"],
      ["Where will you have lunch?", "Where", "너는 어디에서 점심 식사를 할 거니?"],
    ];
    const CH = ["a. Andy will paint it.", "b. I will meet Julia.", "c. He will eat gimbap.", "d. I will travel to Spain.", "e. I will leave at twelve."];
    const matchB = [
      ["What will he eat for lunch today?", "c. He will eat gimbap.", "그는 오늘 점심으로 무엇을 먹을 거니?"],
      ["When will you leave Seoul?", "e. I will leave at twelve.", "너는 언제 서울을 떠날 거니?"],
      ["Who will you meet tomorrow?", "b. I will meet Julia.", "너는 내일 누구를 만날 거니?"],
      ["Who will paint the wall?", "a. Andy will paint it.", "누가 그 벽을 페인트칠할 거니?"],
      ["Where will you travel this summer?", "d. I will travel to Spain.", "너는 이번 여름 어디로 여행할 거니?"],
    ];
    const items = [
      exItem(
        fillItem("a01", "A", "A1", rowsA[0][0], permBlanks([rowsA[0][1], "will"]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          unordered: true,
          promptKo: rowsA[0][2],
        }),
        "What / will"
      ),
    ];
    rowsA.slice(1).forEach((r, i) => {
      items.push(
        fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r[0], permBlanks([r[1], "will"]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          unordered: true,
          promptKo: r[2],
        })
      );
    });
    matchB.forEach((r, i) => {
      const base = mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), r[0], CH, [r[1], r[1][0]], {
        sectionInstructionKo: instrB,
        promptKo: r[2],
      });
      items.push(i === 0 ? exItem(base, r[1]) : base);
    });
    write("lesson02-walk2.json", {
      practiceId: "b4:u02:lesson02-walk2",
      title: "Lesson 02 Walk 2 — 미래 시제 will",
      subtitle: "의문사 + will · 대답 연결 (p. 49)",
      pages: "49",
      timerMinutes: 10,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 5문항, Section B 4문항. 예시는 채점하지 않아요.",
      sections: [
        sec("A", "Section A", instrA, "다음 문장에서 의문사를 찾아 동그라미 하고 will을 찾아 밑줄을 치세요.", "의문사와 will을 빈칸에 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
        sec("B", "Section B", instrB, "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.", "a~e 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5"]),
      ],
      items,
    });
  })();

  // Lesson 02 Run
  (function () {
    const instr =
      "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    const a = [
      ["Will you ( feed / feeds ) your puppy?", ["feed", "feeds"], "feed", "너는 강아지에게 먹이를 줄 거니?"],
      ["Will ( learn she / she learn ) yoga next month?", ["learn she", "she learn"], "she learn", "그녀는 다음 달에 요가를 배울 거니?"],
      ["Will ( go your dad / your dad go ) fishing this weekend?", ["go your dad", "your dad go"], "your dad go", "너희 아빠는 이번 주말에 낚시하러 갈 거니?"],
      ["Will ( they arrive / arrive they ) at five p.m.?", ["they arrive", "arrive they"], "they arrive", "그들은 오후 5시에 도착할 거니?"],
      ["( Check will he / Will he check ) his e-mail tonight?", ["Check will he", "Will he check"], "Will he check", "그는 오늘 밤 이메일을 확인할 거니?"],
      ["( What will / Will what ) you draw?", ["What will", "Will what"], "What will", "너는 무엇을 그릴 거니?"],
      ["( Will who / Who will ) you meet this Saturday?", ["Will who", "Who will"], "Who will", "너는 이번 토요일에 누구를 만날 거니?"],
      ["When ( the concert will / will the concert ) begin?", ["the concert will", "will the concert"], "will the concert", "그 콘서트는 언제 시작될 거니?"],
      ["Where ( will they / they will ) go next Sunday?", ["will they", "they will"], "will they", "그들은 다음 일요일에 어디에 갈 거니?"],
      ["Who ( will be / be will ) our English teacher this year?", ["will be", "be will"], "will be", "올해 우리 영어 선생님은 누가 될 거니?"],
      ["( Will how long / How long will ) you stay in New York?", ["Will how long", "How long will"], "How long will", "너는 뉴욕에 얼마나 머무를 거니?"],
      ["( How will you / How you will ) come here?", ["How will you", "How you will"], "How will you", "너는 어떻게 여기에 올 거니?"],
      ["( Who does will kick / Who will kick ) the ball?", ["Who does will kick", "Who will kick"], "Who will kick", "누가 그 공을 찰 거니?"],
      ["When ( will Tom write / will write Tom ) a postcard?", ["will Tom write", "will write Tom"], "will Tom write", "톰은 언제 엽서를 쓸 거니?"],
      ["What ( will do you / will you do ) after school?", ["will do you", "will you do"], "will you do", "너는 방과 후에 무엇을 할 거니?"],
    ];
    const b = [
      ["Will you get on the boat?", ["Yes, I will.", "Yes, you will."], "Yes, I will.", "너는 배에 탈 거니?"],
      ["Will Jane draw a map?", ["No, she will.", "No, she won't."], "No, she won't.", "제인은 지도를 그릴 거니?"],
      ["Will it snow this evening?", ["It will snow.", "Yes, it will."], "Yes, it will.", "오늘 저녁 눈이 올 거니?"],
      ["Will he wait for Julie at the bus stop?", ["Yes, he will.", "Yes, he does."], "Yes, he will.", "그는 버스 정류장에서 줄리를 기다릴 거니?"],
      ["Will they eat salad for lunch?", ["No, they don't.", "No, they won't."], "No, they won't.", "그들은 점심으로 샐러드를 먹을 거니?"],
      ["Will the girls go skating?", ["Yes, she will.", "Yes, they will."], "Yes, they will.", "그 여자아이들은 스케이트를 탈 거니?"],
      ["Will the game end before seven?", ["Yes, it will.", "Yes, it does."], "Yes, it will.", "그 경기는 7시 전에 끝날 거니?"],
      ["Who will carry the flower pot?", ["Yes, I will.", "My mom will carry it."], "My mom will carry it.", "누가 화분을 옮길 거니?"],
      ["What will Annie do this weekend?", ["She will go hiking.", "No, she won't."], "She will go hiking.", "애니는 이번 주말에 무엇을 할 거니?"],
      ["What time will he leave?", ["He will leave at three.", "He will go there on foot."], "He will leave at three.", "그는 몇 시에 떠날 거니?"],
      ["Where will you and Ted run?", ["Yes, we will.", "We will run at the park."], "We will run at the park.", "너와 테드는 어디에서 달릴 거니?"],
      ["How will you go to Jeju?", ["We will go there by ship.", "We will go there next month."], "We will go there by ship.", "너는 어떻게 제주에 갈 거니?"],
      ["Who will drive the bus?", ["No, I won't.", "Bill will drive it."], "Bill will drive it.", "누가 그 버스를 운전할 거니?"],
      ["Where will they study math today?", ["They will study at night.", "They will study at his house."], "They will study at his house.", "그들은 오늘 어디에서 수학을 공부할 거니?"],
    ];
    const items = [...mcSection(a, "A", "a", instr, true), ...mcSection(b, "B", "b", instr, false)];
    write("lesson02-run.json", {
      practiceId: "b4:u02:lesson02-run",
      title: "Lesson 02 Run — 미래 시제 will",
      subtitle: "의문문 어순 · 대답 고르기 (pp. 50–51)",
      pages: "50–51",
      timerMinutes: 20,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 15문항, Section B 14문항(고르기).",
      sections: [
        sec("A", "Section A", instr, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, labelsFrom(14, 2, "A")),
        sec("B", "Section B", instr, "다음 의문문에 알맞은 대답을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 0, labelsFrom(14, 1, "B")),
      ],
      items,
    });
  })();

  // Lesson 02 Jump
  (function () {
    const instrA = "주어진 말을 사용하여 미래 시제 의문문을 완성하세요. 빈칸마다 한 단어씩 쓰세요.";
    const instrB = "다음 대화의 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 쓰세요.";
    const rowsA = [
      ["Will|you|go", "Will you go to the amusement park? ( go )", "너는 놀이공원에 갈 거니?", 3],
      ["Will|the show|begin", "_____ the show _____ before nine? ( begin )", "그 쇼는 9시 전에 시작될 거니?", 3],
      ["Will|George|visit", "_____ George _____ London next week? ( visit )", "조지는 다음 주에 런던을 방문할 거니?", 3],
      ["Will|your grandfather|fix", "_____ your grandfather _____ the door this afternoon? ( fix )", "너희 할아버지는 오늘 오후 문을 고칠 거니?", 3],
      ["Will|she|put|on", "_____ she _____ _____ her hat? ( put on )", "그녀는 모자를 쓸 거니?", 4],
      ["Will|they|finish", "_____ they _____ their homework before dinner? ( finish )", "그들은 저녁 식사 전에 숙제를 끝낼 거니?", 3],
      ["Will|he|be", "_____ he _____ ten years old next year? ( be )", "그는 내년에 열 살이 될 거니?", 3],
      ["Will|you|bring", "_____ you _____ your cup? ( bring )", "너는 컵을 가져올 거니?", 3],
      ["Who|will|feed", "Who _____ _____ the rabbit tomorrow? ( feed )", "누가 내일 그 토끼에게 먹이를 줄 거니?", 3],
      ["What|will|they|do", "What _____ they _____ this weekend? ( do )", "그들은 이번 주말에 무엇을 할 거니?", 4],
      ["When|will|Jack|have", "When _____ Jack _____ dinner today? ( have )", "잭은 오늘 언제 저녁 식사를 할 거니?", 4],
      ["Where|will|you|read", "Where _____ you _____ books? ( read )", "너는 어디에서 책을 읽을 거니?", 4],
      ["How|will|Kevin|send", "How _____ Kevin _____ the letters? ( send )", "케빈은 어떻게 그 편지들을 보낼 거니?", 4],
      ["How long|will|you|play", "How long _____ you _____ computer games today? ( play )", "너는 오늘 컴퓨터 게임을 얼마나 할 거니?", 4],
      ["What|will|the children|make", "What _____ the children _____ ? ( make )", "그 아이들은 무엇을 만들 거니?", 4],
    ];
    const rowsB = [
      ["Will", "A: _____ they come home early?\nB: No, they won't.", "그들은 일찍 집에 올 거니?"],
      ["Will", "A: _____ Ms. Hanks jog along the river?\nB: Yes, she will.", "행크스 씨는 강가를 따라 조깅할 거니?"],
      ["Will", "A: _____ the library close next Monday?\nB: Yes, it will.", "그 도서관은 다음 월요일에 문을 닫을 거니?"],
      ["Will", "A: _____ you buy a cell phone?\nB: No, I won't.", "너는 휴대전화를 살 거니?"],
      ["it|will", "A: Will it rain this weekend?\nB: Yes, _____.", "이번 주말에 비가 올 거니?"],
      ["he|won't", "A: Will Frank watch a movie tonight?\nB: No, _____.", "프랭크는 오늘 밤 영화를 볼 거니?"],
      ["they|will", "A: Will they climb the mountain?\nB: Yes, _____.", "그들은 그 산을 오를 거니?"],
      ["will", "A: Who _____ knit the vest?\nB: Mom will knit it.", "누가 그 조끼를 뜰 거니?"],
      ["will", "A: When _____ they go on a picnic?\nB: They will go on a picnic next Thursday.", "그들은 언제 소풍을 갈 거니?"],
      ["will", "A: How _____ you visit the island?\nB: We will visit the island by ship.", "너는 어떻게 그 섬을 방문할 거니?"],
      ["I|will", "A: What will you make for breakfast?\nB: _____ _____ make some sandwiches.", "아침 식사로 무엇을 만들 거니?"],
      ["He|will", "A: When will Mr. Parker wash his puppy?\nB: _____ _____ wash his puppy after dinner.", "파커 씨는 언제 강아지를 씻길 거니?"],
    ];
    const items = [];
    rowsA.forEach((r, i) => {
      const id = "a" + String(i + 1).padStart(2, "0");
      const acc = wordVariants(r[0]);
      const base = fillItem(id, "A", "A" + (i + 1), r[1], acc, {
        sectionInstructionKo: instrA,
        blanks: r[3],
        promptKo: r[2],
      });
      items.push(i === 0 ? exItem(base, r[0].replace(/\|/g, " / ")) : base);
    });
    rowsB.forEach((r, i) => {
      const id = "b" + String(i + 1).padStart(2, "0");
      const parts = r[0].split("|");
      items.push(
        fillItem(id, "B", "B" + (i + 1), r[1], wordVariants(r[0]), {
          sectionInstructionKo: instrB,
          blanks: parts.length,
          promptKo: r[2],
        })
      );
    });
    write("lesson02-jump.json", {
      practiceId: "b4:u02:lesson02-jump",
      title: "Lesson 02 Jump — 미래 시제 will",
      subtitle: "의문문 완성 · 대화 (pp. 52–53)",
      pages: "52–53",
      timerMinutes: 24,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 15문항, Section B 12문항.",
      sections: [
        sec("A", "Section A", instrA, "주어진 말을 사용하여 미래 시제 의문문을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, labelsFrom(14, 2, "A")),
        sec("B", "Section B", instrB, "다음 대화의 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 12, 0, labelsFrom(12, 1, "B")),
      ],
      items,
    });
  })();

  // Lesson 02 Fly
  (function () {
    const instrA = "다음 미래 시제의 문장을 의문문으로 바꿔 쓰세요. 문장 전체를 쓰세요.";
    const instrB = "다음 밑줄 친 부분을 묻는 의문문을 쓸 때 빈칸에 알맞은 말을 쓰세요. 빈칸마다 한 단어씩 쓰세요.";
    const instrC = "주어진 말을 바르게 배열하여 미래 시제 의문문을 쓰세요. 문장 전체를 쓰세요.";
    const sentA = [
      ["You and Sue will go shopping after school.", "Will you and Sue go shopping after school?", "너와 수는 방과 후에 쇼핑하러 갈 거니?"],
      ["He will get on the bus today.", "Will he get on the bus today?", "그는 오늘 버스에 탈 거니?"],
      ["The team will have a soccer match next Tuesday.", "Will the team have a soccer match next Tuesday?", "그 팀은 다음 화요일에 축구 경기를 할 거니?"],
      ["You will go skiing this weekend.", "Will you go skiing this weekend?", "너는 이번 주말에 스키 타러 갈 거니?"],
      ["They will have a birthday party for Dorothy.", "Will they have a birthday party for Dorothy?", "그들은 도로시를 위해 생일 파티를 열 거니?"],
    ];
    const fillB = [
      [ul("Tim will bake her birthday cake.", "Tim"), "Who|will|bake", 3, "누가 그녀의 생일 케이크를 구울 거니?"],
      [ul("Mary will buy the shoes at the store.", "the shoes"), "What|will|Mary|buy", 4, "메리는 가게에서 무엇을 살 거니?"],
      [ul("They will plant a tree on the hill.", "on the hill"), "Where|will|they|plant", 4, "그들은 어디에서 나무를 심을 거니?"],
      [ul("We will win the game.", "We"), "Who|will|win", 3, "누가 그 경기에서 이길 거니?"],
      [ul("She will meet Randall next month.", "next month"), "When|will|she|meet", 4, "그녀는 언제 랜달을 만날 거니?"],
    ];
    const unscramble = [
      ["( will / today / paint the door / he / ? )", "Will he paint the door today?", "그가 오늘 그 문을 페인트칠할 거니?"],
      ["( it / tomorrow / be cold / will / ? )", "Will it be cold tomorrow?", "내일 추울까?"],
      ["( they / will / today / study hard / ? )", "Will they study hard today?", "그들은 오늘 열심히 공부할 거니?"],
      ["( you / will / clean your room / tomorrow / ? )", "Will you clean your room tomorrow?", "너는 내일 네 방을 청소할 거니?"],
      ["( Amy / buy a bike / will / at the store / ? )", "Will Amy buy a bike at the store?", "에이미는 그 가게에서 자전거를 살 거니?"],
      ["( where / travel / this fall / will / he / ? )", "Where will he travel this fall?", "그는 이번 가을에 어디로 여행할 거니?"],
      ["( how / will / go to the zoo / they / ? )", "How will they go to the zoo?", "그들은 어떻게 동물원에 갈 거니?"],
      ["( when / go on a picnic / will / you / ? )", "When will you go on a picnic?", "너희는 언제 소풍을 갈 거니?"],
      ["( what / do / will / you / tonight / ? )", "What will you do tonight?", "너는 오늘 밤 무엇을 할 거니?"],
      ["( what / cook for dinner / will / she / ? )", "What will she cook for dinner?", "그녀는 저녁 식사로 무엇을 요리할 거니?"],
    ];
    const items = [];
    sentA.forEach((r, i) => {
      const base = sentItem("a" + String(i + 1).padStart(2, "0"), "A", "A" + (i + 1), r[0], [r[1]], {
        sectionInstructionKo: instrA,
        promptKo: r[2],
      });
      items.push(i === 0 ? exItem(base, r[1]) : base);
    });
    fillB.forEach((r, i) => {
      items.push(
        fillItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), r[0] + "\n→ _____ _____ _____", wordVariants(r[1]), {
          sectionInstructionKo: instrB,
          blanks: r[2],
          promptKo: r[3],
        })
      );
    });
    unscramble.forEach((r, i) => {
      const base = sentItem("c" + String(i + 1).padStart(2, "0"), "C", "C" + (i + 1), r[0], [r[1]], {
        sectionInstructionKo: instrC,
        promptKo: r[2],
      });
      items.push(i === 0 ? exItem(base, r[1]) : base);
    });
    write("lesson02-fly.json", {
      practiceId: "b4:u02:lesson02-fly",
      title: "Lesson 02 Fly — 미래 시제 will",
      subtitle: "의문문 · 배열 (pp. 54–55)",
      pages: "54–55",
      timerMinutes: 26,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 5문항, Section B 5문항, Section C 10문항(문장 전체).",
      sections: [
        sec("A", "Section A", instrA, "다음 미래 시제의 문장을 의문문으로 바꿔 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 4, 1, ["A2", "A3", "A4", "A5"]),
        sec("B", "Section B", instrB, "다음 밑줄 친 부분을 묻는 의문문을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 5, 0, labelsFrom(5, 1, "B")),
        sec("C", "Section C", instrC, "주어진 말을 바르게 배열하여 미래 시제 의문문을 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 9, 1, labelsFrom(9, 2, "C")),
      ],
      items,
    });
  })();

  // Review 02
  (function () {
    const items = [];
    const s12 = "[1–2] 다음 중 잘못된 문장을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    items.push(
      mcItem("q01", "1-2", "1", "", [
        "I will come home early today.",
        "Susie will studies math this evening.",
        "We will not stay here.",
        "They won't learn yoga.",
      ], ["Susie will studies math this evening.", "2"], { sectionInstructionKo: s12 }),
      mcItem("q02", "1-2", "2", "", [
        "Will Tommy go swimming today?",
        "Will they take a walk tonight?",
        "Who you will meet after school?",
        "Who will clean the bathroom?",
      ], ["Who you will meet after school?", "3"], { sectionInstructionKo: s12 })
    );
    const s34 = "[3–4] 다음 문장의 빈칸에 알맞은 말을 고르세요. 보기 중에서 알맞은 것을 하나 골라 누르세요.";
    items.push(
      mcItem("q03", "3-4", "3", "Where _____ the girls meet this weekend?", ["is", "does", "are", "will"], ["will", "4"], {
        sectionInstructionKo: s34,
        promptKo: "그 여자아이들은 이번 주말에 어디에서 만날 거니?",
      }),
      mcItem("q04", "3-4", "4", "We _____ play computer games tomorrow.", ["aren't", "don't", "won't", "isn't"], ["won't", "3"], {
        sectionInstructionKo: s34,
        promptKo: "우리는 내일 컴퓨터 게임을 하지 않을 것이다.",
      })
    );
    const s5 = "[5] 다음 중 빈칸에 동사원형 go를 쓸 수 없는 문장을 고르세요.";
    items.push(
      mcItem("q05", "5", "5", "", [
        "I will _____ to the library tomorrow.",
        "Who _____ to school by bus yesterday?",
        "Does Sally _____ jogging every day?",
        "We can _____ there by subway.",
      ], ["Who _____ to school by bus yesterday?", "2"], { sectionInstructionKo: s5 })
    );
    const s67 = "[6–7] 다음 문장을 지시대로 바르게 바꾼 것을 고르세요.";
    items.push(
      mcItem("q06", "6-7", "6", "He will arrive at two. (부정문)", [
        "He will don't arrive at two.",
        "He don't will arrive at two.",
        "He will not arrive at two.",
        "He not will arrive at two.",
      ], ["He will not arrive at two.", "3"], { sectionInstructionKo: s67 }),
      mcItem("q07", "6-7", "7", "It will be cloudy today. (의문문)", [
        "Will it be cloudy today?",
        "Does it will be cloudy today?",
        "What it will be cloudy today?",
        "Will it is cloudy today?",
      ], ["Will it be cloudy today?", "1"], { sectionInstructionKo: s67 })
    );
    const s89 = "[8–9] 다음 의문문에 알맞은 대답을 고르세요.";
    items.push(
      mcItem("q08", "8-9", "8", "Will Tom learn Korean?", ["Yes, he does.", "Yes, he will.", "He will learn Korean.", "No, he will."], ["Yes, he will.", "2"], {
        sectionInstructionKo: s89,
      }),
      mcItem("q09", "8-9", "9", "What will you eat for dinner today?", ["Yes, I will.", "At six o'clock.", "No, I won't.", "I'll eat curry and rice."], ["I'll eat curry and rice.", "4"], {
        sectionInstructionKo: s89,
      })
    );
    const s10 = "[10] 다음 중 짝지어진 대화가 어색한 것을 고르세요.";
    items.push(
      mcItem("q10", "10", "10", "", [
        "A: Will they do their homework together? / B: Yes, they will.",
        "A: How long will you stay in New York? / B: I will stay for two days.",
        "A: When will you meet Andy? / B: No, I won't.",
        "A: Will the game end at four? / B: Yes, it will.",
      ], ["A: When will you meet Andy? / B: No, I won't.", "3"], { sectionInstructionKo: s10 })
    );
    const s1112 = "[11–12] 다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.";
    items.push(
      mcItem("q11", "11-12", "11", "She ( will get not / won't get ) up late tomorrow.", ["will get not", "won't get"], ["won't get", "2"], {
        sectionInstructionKo: s1112,
        promptKo: "그녀는 내일 늦게 일어나지 않을 것이다.",
      }),
      mcItem("q12", "11-12", "12", "( Will Ken go / Will go Ken ) hiking this Saturday?", ["Will Ken go", "Will go Ken"], ["Will Ken go", "1"], {
        sectionInstructionKo: s1112,
        promptKo: "켄은 이번 토요일에 하이킹을 갈 거니?",
      })
    );
    const s1314 = "[13–14] 다음 문장을 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.";
    items.push(
      fillItem("q13", "13-14", "13", "Ted doesn't wear blue jeans. (미래 시제)\n→ Ted _____ _____ blue jeans tomorrow.", wordVariants("won't|wear"), {
        sectionInstructionKo: s1314,
        blanks: 2,
        promptKo: "테드는 내일 청바지를 입지 않을 것이다.",
      }),
      fillItem("q14", "13-14", "14", "They will come back home today. (의문문)\n→ _____ _____ back home today?", wordVariants("Will|they"), {
        sectionInstructionKo: s1314,
        blanks: 2,
        promptKo: "그들은 오늘 집에 돌아올 거니?",
      })
    );
    const s1516 = "[15–16] 다음 문장의 빈칸에 알맞은 말을 쓰세요.";
    items.push(
      fillItem("q15", "15-16", "15", "Jane _____ wash her car tomorrow.", ["will", "Will"], {
        sectionInstructionKo: s1516,
        promptKo: "제인은 내일 세차할 것이다.",
      }),
      fillItem("q16", "15-16", "16", "A: Will Ann be a student next year?\nB: No, she _____.", ["won't", "will not"], {
        sectionInstructionKo: s1516,
        promptKo: "앤은 내년에 학생이 될 거니?",
      })
    );
    const s1718 = "[17–18] 주어진 말을 바르게 배열하여 문장을 쓰세요. 문장 전체를 쓰세요.";
    items.push(
      sentItem("q17", "17-18", "17", "( won't / I / listen to the radio / at night / . )", ["I won't listen to the radio at night."], {
        sectionInstructionKo: s1718,
        promptKo: "나는 밤에 라디오를 듣지 않을 것이다.",
      }),
      sentItem("q18", "17-18", "18", "( when / you / will / go to the dentist / ? )", ["When will you go to the dentist?"], {
        sectionInstructionKo: s1718,
        promptKo: "너는 언제 치과에 갈 거니?",
      })
    );
    const s1920 =
      "[19–20] 다음 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요. 문장 전체를 쓰세요.";
    items.push(
      sentItem("q19", "19-20", "19", ul("He will have not a birthday party.", "will have not"), ["He will not have a birthday party.", "He won't have a birthday party."], {
        sectionInstructionKo: s1920,
        promptKo: "그는 생일 파티를 하지 않을 것이다.",
      }),
      sentItem("q20", "19-20", "20", ul("Who you will meet this Sunday?", "you will meet"), ["Who will you meet this Sunday?"], {
        sectionInstructionKo: s1920,
        promptKo: "너는 이번 일요일에 누구를 만날 거니?",
      })
    );
    write("review-02.json", {
      practiceId: "b4:u02:review-02",
      title: "Review 02",
      subtitle: "Unit 02 미래 시제 will (pp. 56–58)",
      pages: "56–58",
      timerMinutes: 30,
      ...META,
      sectionsVersion: 2,
      introKo: "Review 02는 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.",
      sections: [
        sec("1-2", "[1–2]", s12, "다음 중 잘못된 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["1", "2"]),
        sec("3-4", "[3–4]", s34, "다음 문장의 빈칸에 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["3", "4"]),
        sec("5", "[5]", s5, "다음 중 빈칸에 동사원형 go를 쓸 수 없는 문장을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["5"]),
        sec("6-7", "[6–7]", s67, "다음 문장을 지시대로 바르게 바꾼 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["6", "7"]),
        sec("8-9", "[8–9]", s89, "다음 의문문에 알맞은 대답을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["8", "9"]),
        sec("10", "[10]", s10, "다음 중 짝지어진 대화가 어색한 것을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 1, 0, ["10"]),
        sec("11-12", "[11–12]", s1112, "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 2, 0, ["11", "12"]),
        sec("13-14", "[13–14]", s1314, "다음 문장을 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["13", "14"]),
        sec("15-16", "[15–16]", s1516, "다음 문장의 빈칸에 알맞은 말을 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 2, 0, ["15", "16"]),
        sec("17-18", "[17–18]", s1718, "주어진 말을 바르게 배열하여 문장을 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["17", "18"]),
        sec("19-20", "[19–20]", s1920, "다음 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 2, 0, ["19", "20"]),
      ],
      items,
    });
  })();
};
