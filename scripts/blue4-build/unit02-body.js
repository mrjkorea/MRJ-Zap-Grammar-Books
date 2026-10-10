/* Remaining BlueZap 4 Unit 02 practice builders (required by unit02-generate.js). */
"use strict";

module.exports = function buildRest(ctx) {
  const { META, sec, ul, fillItem, mcItem, sentItem, exItem, write, wordVariants, permBlanks, labelsFrom } = ctx;

  function mcSection(rows, secId, prefix, instr, exFirst) {
    return rows.map((row, i) => {
      const [en, ch, ans, ko] = row;
      const id = prefix + String(i + 1).padStart(2, "0");
      const label = (prefix === "a" ? "A" : prefix === "b" ? "B" : "Q") + (i + 1);
      const base = mcItem(id, secId, label, en, ch, [ans, String(ch.indexOf(ans) + 1)], {
        sectionInstructionKo: instr,
        promptKo: ko,
      });
      if (exFirst && i === 0) return exItem(base, ans);
      return base;
    });
  }

  // Lesson 01 Run
  (function () {
    const instr =
      "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요. 보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    const a = [
      ["I will ( be / is ) at home tonight.", ["be", "is"], "be", "나는 오늘 밤에 집에 있을 것이다."],
      ["You will ( get / gets ) some presents today.", ["get", "gets"], "get", "너는 오늘 선물을 몇 가지 받을 것이다."],
      ["I will ( studying / study ) math this afternoon.", ["studying", "study"], "study", "나는 오늘 오후에 수학을 공부할 것이다."],
      ["They ( not will / will not ) walk to school.", ["not will", "will not"], "will not", "그들은 학교까지 걸어가지 않을 것이다."],
      ["The store will ( not open / don't open ) next Saturday.", ["not open", "don't open"], "not open", "그 가게는 다음 토요일에 문을 열지 않을 것이다."],
      ["( She'ill / She'll ) meet him in the park.", ["She'ill", "She'll"], "She'll", "그녀는 공원에서 그를 만날 것이다."],
      ["My father ( doesn't / won't ) be free tomorrow.", ["doesn't", "won't"], "won't", "우리 아버지는 내일 한가하지 않을 것이다."],
      ["We will ( go / went ) to Egypt by plane.", ["go", "went"], "go", "우리는 비행기로 이집트에 갈 것이다."],
      ["Kelly ( will be / is ) eleven years old next month.", ["will be", "is"], "will be", "켈리는 다음 달에 열한 살이 될 것이다."],
      ["Jack and Jill ( don't will / will not ) get up early tomorrow morning.", ["don't will", "will not"], "will not", "잭과 질은 내일 아침 일찍 일어나지 않을 것이다."],
      ["( He's / He'll ) read some English books this summer.", ["He's", "He'll"], "He'll", "그는 이번 여름에 영어 책을 몇 권 읽을 것이다."],
      ["Ms. Robin will ( leave / leaving ) Korea next week.", ["leave", "leaving"], "leave", "로빈 선생님은 다음 주에 한국을 떠날 것이다."],
      ["Rob ( will not / not will ) go fishing this Sunday.", ["will not", "not will"], "will not", "롭은 이번 일요일에 낚시하러 가지 않을 것이다."],
      ["Jennifer ( isn't / won't ) come to the party tomorrow evening.", ["isn't", "won't"], "won't", "제니퍼는 내일 저녁 파티에 오지 않을 것이다."],
      ["It will ( not rain / rain not ) tomorrow.", ["not rain", "rain not"], "not rain", "내일은 비가 오지 않을 것이다."],
    ];
    const b = [
      ["I will _____ a bus to the park.", ["take", "taking"], "take", "나는 버스를 타고 공원에 갈 것이다."],
      ["Jack will _____ Bob to the party.", ["invites", "invite"], "invite", "잭은 밥을 파티에 초대할 것이다."],
      ["She _____ this afternoon.", ["will swim", "wills swim"], "will swim", "그녀는 오늘 오후에 수영할 것이다."],
      ["He will _____ Spanish next year.", ["learn not", "not learn"], "not learn", "그는 내년에 스페인어를 배우지 않을 것이다."],
      ["They _____ go to school today.", ["won't", "wan't"], "won't", "그들은 오늘 학교에 가지 않을 것이다."],
      ["_____ be very hot this summer.", ["It'ill", "It'll"], "It'll", "이번 여름은 매우 더울 것이다."],
      ["The girl _____ practice kung fu.", ["not will", "will not"], "will not", "그 여자아이는 쿵푸를 연습하지 않을 것이다."],
      ["Mom will _____ back to Seoul.", ["come", "comes"], "come", "엄마는 서울로 돌아올 것이다."],
      ["I _____ that computer tomorrow.", ["use will", "will use"], "will use", "나는 내일 그 컴퓨터를 사용할 것이다."],
      ["Annie will _____ TV tonight.", ["watch", "watched"], "watch", "애니는 오늘 밤 TV를 볼 것이다."],
      ["The cook will _____ some eggs.", ["boiling", "boil"], "boil", "요리사는 달걀을 몇 개 삶을 것이다."],
      ["Ted _____ fix the car tomorrow.", ["not will", "will not"], "will not", "테드는 내일 그 차를 고치지 않을 것이다."],
      ["My family _____ hiking next week.", ["will go", "will be go"], "will go", "우리 가족은 다음 주에 하이킹할 것이다."],
      ["_____ do his homework with his dad.", ["He'll", "He'ill"], "He'll", "그는 아버지와 함께 숙제를 할 것이다."],
      ["We _____ play chess tonight.", ["wan't", "won't"], "won't", "우리는 오늘 밤 체스를 두지 않을 것이다."],
    ];
    const items = [...mcSection(a, "A", "a", instr, true), ...mcSection(b, "B", "b", instr, true)];
    write("lesson01-run.json", {
      practiceId: "b4:u02:lesson01-run",
      title: "Lesson 01 Run — 미래 시제 will",
      subtitle: "will / won't 고르기 (pp. 40–41)",
      pages: "40–41",
      timerMinutes: 20,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A·B 각 15문항(고르기). 예시는 채점하지 않아요.",
      sections: [
        sec("A", "Section A", instr, "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, labelsFrom(14, 2, "A")),
        sec("B", "Section B", instr, "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", "보기 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 14, 1, labelsFrom(14, 2, "B")),
      ],
      items,
    });
  })();

  // Lesson 01 Jump
  (function () {
    const instrA =
      "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요. 빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)";
    const instrB =
      "주어진 말을 사용하여 미래 시제의 문장을 완성하세요. 빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
    const rowsA = [
      ["I will visit my uncle.", "will visit", ["찾아뵐 것이다", "찾아갈 것이다", "방문할 것이다"], "나는 삼촌을 찾아뵐 것이다."],
      ["You will be twelve years old next year.", "will be", ["열두 살이 될 것이다", "12살이 될 것이다"], "너는 내년에 열두 살이 될 것이다."],
      ["The train will arrive at four o'clock.", "will arrive", ["4시에 도착할 것이다", "네 시에 도착할 것이다"], "그 기차는 4시에 도착할 것이다."],
      ["Kevin will make a sandwich tomorrow.", "will make", ["샌드위치를 만들 것이다"], "케빈은 내일 샌드위치를 만들 것이다."],
      ["We will have a party tomorrow.", "will have a party", ["내일 파티를 할 것이다", "파티를 할 것이다"], "우리는 내일 파티를 할 것이다."],
      ["It will snow today.", "will snow", ["오늘 눈이 올 것이다", "눈이 내릴 것이다"], "오늘 눈이 올 것이다."],
      ["They will watch a movie this evening.", "will watch a movie", ["오늘 저녁 영화를 볼 것이다", "영화를 볼 것이다"], "그들은 오늘 저녁 영화를 볼 것이다."],
      ["I won't come here next Saturday.", "won't come", ["다음 토요일에 오지 않을 것이다", "오지 않을 것이다"], "나는 다음 토요일에 여기에 오지 않을 것이다."],
      ["Cathy won't be busy next week.", "won't be busy", ["다음 주에 바쁘지 않을 것이다"], "캐시는 다음 주에 바쁘지 않을 것이다."],
      ["My dad won't drive a car this morning.", "won't drive a car", ["오늘 아침 차를 운전하지 않을 것이다"], "우리 아빠는 오늘 아침 차를 운전하지 않을 것이다."],
      ["He won't visit his aunts tomorrow.", "won't visit his aunts", ["내일 고모들을 방문하지 않을 것이다"], "그는 내일 고모들을 방문하지 않을 것이다."],
      ["We won't be late for the concert.", "won't be late", ["콘서트에 늦지 않을 것이다"], "우리는 콘서트에 늦지 않을 것이다."],
      ["They won't eat chocolate for dessert.", "won't eat chocolate", ["디저트로 초콜릿을 먹지 않을 것이다"], "그들은 디저트로 초콜릿을 먹지 않을 것이다."],
      ["We won't go to the beach this summer.", "won't go to the beach", ["이번 여름 해변에 가지 않을 것이다"], "우리는 이번 여름 해변에 가지 않을 것이다."],
      ["The men won't cut down the trees.", "won't cut down the trees", ["나무를 베지 않을 것이다", "나무를 쓰러뜨리지 않을 것이다"], "그 남자들은 나무를 베지 않을 것이다."],
    ];
    const rowsB = [
      ["I _____ _____ lunch at noon. ( have )", ["will", "have"], "will|have", "나는 정오에 점심 식사를 할 것이다."],
      ["I _____ _____ a bike this evening. ( not, ride )", ["won't", "ride"], "won't|ride", "나는 오늘 저녁에 자전거를 타지 않을 것이다."],
      ["We _____ _____ tennis after school. ( play )", ["will", "play"], "will|play", "우리는 방과 후에 테니스를 할 것이다."],
      ["Mary _____ _____ a tree next Friday. ( plant )", ["will", "plant"], "will|plant", "메리는 다음 금요일에 나무를 심을 것이다."],
      ["He _____ _____ the coat today. ( not, put on )", ["won't", "put on"], "won't|put on", "그는 오늘 그 코트를 입지 않을 것이다."],
      ["They _____ _____ some comic books. ( buy )", ["will", "buy"], "will|buy", "그들은 만화책을 몇 권 살 것이다."],
      ["It _____ _____ cold this winter. ( be )", ["will", "be"], "will|be", "이번 겨울은 추울 것이다."],
      ["I _____ _____ violin lessons next year. ( not, take )", ["won't", "take"], "won't|take", "나는 내년에 바이올린 수업을 받지 않을 것이다."],
      ["Joe _____ _____ the radio at two. ( listen to )", ["will", "listen to"], "will|listen to", "조는 2시에 라디오를 들을 것이다."],
      ["My aunt and uncle _____ _____ us today. ( visit )", ["will", "visit"], "will|visit", "우리 이모부는 오늘 우리를 방문할 것이다."],
      ["She _____ _____ Mr. Pitt tomorrow. ( not, meet )", ["won't", "meet"], "won't|meet", "그녀는 내일 피트 씨를 만나지 않을 것이다."],
      ["Mom _____ _____ us to school tomorrow morning. ( drive )", ["will", "drive"], "will|drive", "엄마는 내일 아침 우리를 학교까지 태워다 줄 것이다."],
      ["We _____ _____ on a picnic next Sunday. ( not, go )", ["won't", "go"], "won't|go", "우리는 다음 일요일에 소풍 가지 않을 것이다."],
      ["They _____ _____ some food for the party. ( bring )", ["will", "bring"], "will|bring", "그들은 파티를 위해 음식을 가져올 것이다."],
      ["You _____ _____ in the library tomorrow. ( not, study )", ["won't", "study"], "won't|study", "너는 내일 도서관에서 공부하지 않을 것이다."],
    ];
    const items = [
      exItem(
        fillItem("a01", "A", "A1", ul(rowsA[0][0], rowsA[0][1]), rowsA[0][2], {
          sectionInstructionKo: instrA,
          promptKo: rowsA[0][3],
        }),
        rowsA[0][2][0]
      ),
    ];
    rowsA.slice(1).forEach((r, i) => {
      items.push(
        fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), ul(r[0], r[1]), r[2], {
          sectionInstructionKo: instrA,
          promptKo: r[3],
        })
      );
    });
    rowsB.forEach((r, i) => {
      const id = "b" + String(i + 1).padStart(2, "0");
      const label = "B" + (i + 1);
      const acc = wordVariants(r[2]);
      const base = fillItem(id, "B", label, r[0], acc, {
        sectionInstructionKo: instrB,
        blanks: 2,
        promptKo: r[3],
      });
      items.push(i === 0 ? exItem(base, "will / have") : base);
    });
    write("lesson01-jump.json", {
      practiceId: "b4:u02:lesson01-jump",
      title: "Lesson 01 Jump — 미래 시제 will",
      subtitle: "뜻 · will/won't 완성 (pp. 42–43)",
      pages: "42–43",
      timerMinutes: 24,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 15문항(밑줄 뜻), Section B 15문항(will/won't+동사). 예시는 채점하지 않아요.",
      sections: [
        sec("A", "Section A", instrA, "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요.", "빈칸에 들어갈 말만 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, labelsFrom(14, 2, "A")),
        sec("B", "Section B", instrB, "주어진 말을 사용하여 미래 시제의 문장을 완성하세요.", "빈칸마다 한 단어씩 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, labelsFrom(14, 2, "B")),
      ],
      items,
    });
  })();

  // Lesson 01 Fly
  (function () {
    const instrA =
      "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요. 빈칸 두 칸에 고친 말을 각각 쓰세요. (문장 전체를 쓰지 마세요.)";
    const instrB =
      "다음 문장을 미래 시제로 바꿔 쓰세요. 문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)";
    const fixA = [
      ["Susie will visits her aunt.", "visits", "will|visit", "수지는 고모를 방문할 것이다."],
      ["I will am free tomorrow.", "will am", "will|be", "나는 내일 한가할 것이다."],
      ["We will had some toast for breakfast.", "will had", "will|have", "우리는 아침 식사로 토스트를 먹을 것이다."],
      ["Mr. Kim will arrives this afternoon.", "will arrives", "will|arrive", "김 씨는 오늘 오후에 도착할 것이다."],
      ["Ted don't will wear blue jeans tomorrow.", "don't will wear", "won't|wear", "테드는 내일 청바지를 입지 않을 것이다."],
      ["They not will come back home today.", "not will come", "won't|come", "그들은 오늘 집에 돌아오지 않을 것이다."],
      ["It will is windy tomorrow.", "will is", "will|be", "내일 바람이 불 것이다."],
      ["Jessica wills bring her sunglasses.", "wills bring", "will|bring", "제시카는 선글라스를 가져올 것이다."],
      ["Jack will staying in New York next month.", "will staying", "will|stay", "잭은 다음 달에 뉴욕에 머무를 것이다."],
      ["She will finishes her homework soon.", "will finishes", "will|finish", "그녀는 곧 숙제를 끝낼 것이다."],
      ["We will play not volleyball this afternoon.", "will play not", "won't|play", "우리는 오늘 오후 배구를 하지 않을 것이다."],
      ["We wont make Christmas cards today.", "wont make", "won't|make", "우리는 오늘 크리스마스 카드를 만들지 않을 것이다."],
      ["Mike wills not clean his room.", "wills not clean", "won't|clean", "마이크는 자기 방을 청소하지 않을 것이다."],
      ["You be will a fourth grader next year.", "be will", "will|be", "너는 내년에 4학년이 될 것이다."],
      ["He not will dive in the sea tonight.", "not will dive", "won't|dive", "그는 오늘 밤 바다에 잠수하지 않을 것이다."],
    ];
    const sentB = [
      ["Dad goes camping.", "Dad will go camping.", "아빠는 캠핑하러 갈 것이다."],
      ["Mike doesn't call me.", "Mike won't call me.", "마이크는 나에게 전화하지 않을 것이다."],
      ["The movie starts at twelve ten.", "The movie will start at twelve ten.", "그 영화는 12시 10분에 시작할 것이다."],
      ["He doesn't take the subway.", "He won't take the subway.", "그는 지하철을 타지 않을 것이다."],
      ["Kelly sends e-mail to her aunt.", "Kelly will send e-mail to her aunt.", "켈리는 이모에게 이메일을 보낼 것이다."],
      ["I don't go to the concert.", "I won't go to the concert.", "나는 콘서트에 가지 않을 것이다."],
      ["The boys buy some kiwis.", "The boys will buy some kiwis.", "그 남자아이들은 키위를 몇 개 살 것이다."],
      ["It isn't rainy.", "It won't be rainy.", "비가 오지 않을 것이다."],
      ["We don't speak English at home.", "We won't speak English at home.", "우리는 집에서 영어를 말하지 않을 것이다."],
      ["Janet isn't late for school.", "Janet won't be late for school.", "제넷은 학교에 늦지 않을 것이다."],
      ["The shop closes at nine p.m.", "The shop will close at nine p.m.", "그 가게는 오후 9시에 문을 닫을 것이다."],
      ["They meet her in the park.", "They will meet her in the park.", "그들은 공원에서 그녀를 만날 것이다."],
      ["My family is at the beach.", "My family will be at the beach.", "우리 가족은 해변에 있을 것이다."],
      ["My sister doesn't like the red cap.", "My sister won't like the red cap.", "우리 누나는 그 빨간 모자를 좋아하지 않을 것이다."],
    ];
    const items = [
      exItem(
        fillItem("a01", "A", "A1", ul(fixA[0][0], fixA[0][1]), wordVariants(fixA[0][2]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          promptKo: fixA[0][3],
        }),
        "will / visit"
      ),
    ];
    fixA.slice(1).forEach((r, i) => {
      items.push(
        fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), ul(r[0], r[1]), wordVariants(r[2]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          promptKo: r[3],
        })
      );
    });
    sentB.forEach((r, i) => {
      const id = "b" + String(i + 1).padStart(2, "0");
      const base = sentItem(id, "B", "B" + (i + 1), r[0], [r[1]], { sectionInstructionKo: instrB, promptKo: r[2] });
      items.push(i === 0 ? exItem(base, r[1]) : base);
    });
    write("lesson01-fly.json", {
      practiceId: "b4:u02:lesson01-fly",
      title: "Lesson 01 Fly — 미래 시제 will",
      subtitle: "고치기 · 미래 시제로 바꾸기 (pp. 44–45)",
      pages: "44–45",
      timerMinutes: 26,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 15문항(고치기), Section B 14문항(문장 전체). 예시는 채점하지 않아요.",
      sections: [
        sec("A", "Section A", instrA, "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요.", "빈칸 두 칸에 고친 말을 쓰세요.", "words", "Words · 빈칸 말만", 14, 1, labelsFrom(14, 2, "A")),
        sec("B", "Section B", instrB, "다음 문장을 미래 시제로 바꿔 쓰세요.", "문장 전체를 쓰세요.", "sentence", "Sentence · 문장 전체", 13, 1, labelsFrom(14, 2, "B")),
      ],
      items,
    });
  })();

  // Lesson 02 Walk 1 (p. 47)
  (function () {
    const instrA =
      "다음 문장에서 will을 찾아 동그라미 하고 주어를 찾아 밑줄을 치세요. will과 주어를 빈칸 두 칸에 쓰세요. 순서는 상관없습니다.";
    const instrB =
      "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요. 알맞은 대답(a~e)을 하나 골라 누르세요. (직접 쓰지 않아요.)";
    const rowsA = [
      ["Will you do your homework after lunch?", "you", "너는 점심 식사 후에 숙제를 할 거니?"],
      ["Will Jamie buy a new school bag?", "Jamie", "제이미는 새 책가방을 살 거니?"],
      ["Will it be sunny tomorrow?", "it", "내일 날씨가 화창할 거니?"],
      ["Will the class finish at five o'clock?", "the class", "그 수업은 5시에 끝날 거니?"],
      ["Will we learn Chinese next year?", "we", "우리는 내년에 중국어를 배울 거니?"],
    ];
    const matchB = [
      ["Will you clean your yard?", ["a. Yes, they will.", "b. No, it won't.", "c. Yes, I will.", "d. No, he won't.", "e. Yes, she will."], "c. Yes, I will.", "너는 마당을 청소할 거니?"],
      ["Will she go skiing next Monday?", ["a. Yes, they will.", "b. No, it won't.", "c. Yes, I will.", "d. No, he won't.", "e. Yes, she will."], "e. Yes, she will.", "그녀는 다음 월요일에 스키 타러 갈 거니?"],
      ["Will David travel in Paris this spring?", ["a. Yes, they will.", "b. No, it won't.", "c. Yes, I will.", "d. No, he won't.", "e. Yes, she will."], "d. No, he won't.", "데이비드는 이번 봄에 파리에서 여행할 거니?"],
      ["Will it be warm tomorrow?", ["a. Yes, they will.", "b. No, it won't.", "c. Yes, I will.", "d. No, he won't.", "e. Yes, she will."], "b. No, it won't.", "내일 날씨가 따뜻할 거니?"],
      ["Will they arrive next Tuesday?", ["a. Yes, they will.", "b. No, it won't.", "c. Yes, I will.", "d. No, he won't.", "e. Yes, she will."], "a. Yes, they will.", "그들은 다음 화요일에 도착할 거니?"],
    ];
    const items = [
      exItem(
        fillItem("a01", "A", "A1", rowsA[0][0], permBlanks(["Will", rowsA[0][1]]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          unordered: true,
          promptKo: rowsA[0][2],
        }),
        "Will / you"
      ),
    ];
    rowsA.slice(1).forEach((r, i) => {
      items.push(
        fillItem("a" + String(i + 2).padStart(2, "0"), "A", "A" + (i + 2), r[0], permBlanks(["Will", r[1]]), {
          sectionInstructionKo: instrA,
          blanks: 2,
          unordered: true,
          promptKo: r[2],
        })
      );
    });
    matchB.forEach((r, i) => {
      const base = mcItem("b" + String(i + 1).padStart(2, "0"), "B", "B" + (i + 1), r[0], r[1], [r[2], r[2][0]], {
        sectionInstructionKo: instrB,
        promptKo: r[3],
      });
      items.push(i === 0 ? exItem(base, r[2]) : base);
    });
    write("lesson02-walk1.json", {
      practiceId: "b4:u02:lesson02-walk1",
      title: "Lesson 02 Walk 1 — 미래 시제 will",
      subtitle: "Will 의문문 · 대답 연결 (p. 47)",
      pages: "47",
      timerMinutes: 10,
      ...META,
      sectionsVersion: 2,
      introKo: "Section A 5문항(will+주어), Section B 4문항(대답 고르기). 예시는 채점하지 않아요.",
      sections: [
        sec("A", "Section A", instrA, "다음 문장에서 will을 찾아 동그라미 하고 주어를 찾아 밑줄을 치세요.", "will과 주어를 빈칸에 쓰세요.", "words", "Words · 빈칸 말만", 4, 1, ["A2", "A3", "A4", "A5"]),
        sec("B", "Section B", instrB, "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.", "a~e 중 하나를 골라 누르세요.", "choice", "Choose · 고르기", 4, 1, ["B2", "B3", "B4", "B5"]),
      ],
      items,
    });
  })();

  // Lesson 02 Walk 2, Run, Jump, Fly, Review — see unit02-body2.js
  require("./unit02-body2")(ctx);
};
