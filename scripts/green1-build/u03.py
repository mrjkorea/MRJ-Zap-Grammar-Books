"""GreenZap 1 Unit 03 미래 시제 — printed pp. 52–71 (PDF p0053–p0072)."""
from lib import *

U = "u03"
UT = "Unit 03 — 미래 시제"
F = {}

# --- Walk L01 (p.55): A1–A15 will / be going to (A1 example) ---
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wa = [
    ("I will ( call / calling ) you this evening.", ["call", "calling"], "call"),
    ("The game will ( start / starts ) at 11 o'clock.", ["start", "starts"], "start"),
    ("They will ( studies / study ) in the library today.", ["studies", "study"], "study"),
    ("My father will ( be / is ) in New York next month.", ["be", "is"], "be"),
    ("The store will ( close / closing ) at 9:30 p.m.", ["close", "closing"], "close"),
    ("It will ( be / is ) sunny tomorrow.", ["be", "is"], "be"),
    ("I ( help will / will help ) you with your homework.", ["help will", "will help"], "will help"),
    ("We ( draw will / will draw ) cartoons.", ["draw will", "will draw"], "will draw"),
    ("I am going to ( play / plays ) soccer after school.", ["play", "plays"], "play"),
    ("They are going to ( visits / visit ) their aunt tomorrow.", ["visits", "visit"], "visit"),
    ("He ( is going / going is ) to join an art club.", ["is going", "going is"], "is going"),
    ("Dana and I ( am going / are going ) to go hiking tomorrow.", ["am going", "are going"], "are going"),
    ("Hurry up! We are going to ( is / be ) late for the movie.", ["is", "be"], "be"),
    ("We ( is going to / are going to ) travel to Rome.", ["is going to", "are going to"], "are going to"),
    ("My mother ( is going to / are going to ) take swimming lessons.", ["is going to", "are going to"], "is going to"),
]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wa, 1)]
F["walk1.json"] = finish(meta(U, "walk1", "Grammar Walk — Lesson 01", "will & be going to (p. 55)", "55", UT), [(secA, A)], letter_id, timer=10)

# --- Walk L02 (p.57): A1–A15 negatives & questions (A1 example) ---
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wb = [
    ("I will ( not send / send not ) her e-mail.", ["not send", "send not"], "not send"),
    ("They ( will not / not will ) play badminton today.", ["will not", "not will"], "will not"),
    ("My sister ( don't / won't ) wear blue jeans tomorrow.", ["don't", "won't"], "won't"),
    ("He will ( not go / not goes ) to the concert this Saturday.", ["not go", "not goes"], "not go"),
    ("She ( is not / not is ) going to have hamburgers for lunch.", ["is not", "not is"], "is not"),
    ("I'm not ( going to / to going ) ride a bike this afternoon.", ["going to", "to going"], "going to"),
    ("They ( are going not / are not going ) to take a bus.", ["are going not", "are not going"], "are not going"),
    ("We are not going to ( watch / watches ) TV tonight.", ["watch", "watches"], "watch"),
    ("( Will / Are ) you get up early tomorrow morning? / Yes, I will.", ["Will", "Are"], "Will"),
    ("Will he pass the test? / Yes, he ( will / won't ).", ["will", "won't"], "will"),
    ("Will Dad give me some money? / No, he ( will / won't ).", ["will", "won't"], "won't"),
    ("Will it ( is / be ) cold today? / Yes, it will.", ["is", "be"], "be"),
    ("( Are / Will ) you going to stay at your uncle's home? / Yes, I am.", ["Are", "Will"], "Are"),
    ("Are they ( go / going ) to go on a picnic this Sunday? / No, they aren't.", ["go", "going"], "going"),
    ("Is John going to do his homework with you? / No, he ( isn't / doesn't ).", ["isn't", "doesn't"], "isn't"),
]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wb, 1)]
F["walk2.json"] = finish(meta(U, "walk2", "Grammar Walk — Lesson 02", "Future negatives & questions (p. 57)", "57", UT), [(secA, A)], letter_id, timer=10)

# --- Run (pp.58–59) ---
secA = S("A", "Section A", "주어진 말을 사용하여 미래 시제의 문장을 완성하세요.",
         R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
BOX = "will / not / is / are / be / going / take / go / won't / to / aren't"
secB = S("B", "Section B", f"다음 중 알맞은 말을 찾아 문장을 완성하세요. ({BOX}) 중복해서 사용할 수 있어요.", R_BANK, "choice")
ra = [
    ("I will call you later. ( call )", "will|call", 0),
    ("He ______ ______ the baseball game on TV. ( watch )", "will|watch", 2),
    ("The bank ______ ______ at 4 p.m. ( close )", "will|close", 2),
    ("The train ______ ______ in 20 minutes. ( arrive )", "will|arrive", 2),
    ("My mother ______ ______ me with my homework. ( help )", "will|help", 2),
    ("I ______ ______ your bag. ( carry )", "will|carry", 2),
    ("They ______ ______ her some flowers. ( give )", "will|give", 2),
    ("We ______ ______ a walk in the park. ( take )", "will|take", 2),
    ("My family is going to clean the house today. ( clean )", "is|going|to|clean", 0),
    ("He ______ ______ ______ ______ a jacket today. ( buy )", "is|going|to|buy", 4),
    ("We ______ ______ ______ ______ lunch outside. ( have )", "are|going|to|have", 4),
    ("His uncle ______ ______ ______ ______ tomorrow. ( leave )", "is|going|to|leave", 4),
    ("They ______ ______ ______ ______ a musical tonight. ( see )", "are|going|to|see", 4),
    ("I ______ ______ ______ ______ my aunt next week. ( visit )", "am|going|to|visit", 4),
    ("She ______ ______ ______ ______ a red dress to the party. ( wear )", "is|going|to|wear", 4),
]
A = []
for n, (en, a, blanks) in enumerate(ra, 1):
    if blanks == 0:
        A.append(FILL(f"A{n}", en, [a], blanks=len(a.split("|")), ex=True))
    else:
        A.append(FILL(f"A{n}", en, [a], blanks=blanks))
rb = [
    ("I ______ send a text message to you.", "나는 네게 문자 메시지를 보내지 않을 것이다.", "won't"),
    ("I will ______ stay up late tonight.", "나는 오늘 밤에 늦게까지 깨어 있지 않을 것이다.", "not"),
    ("The child ______ drink too much milk.", "그 어린이는 우유를 너무 많이 마시지 않을 것이다.", "won't"),
    ("Dave ______ tell a lie to his mom.", "데이브는 자기 엄마에게 거짓말하지 않을 것이다.", "won't"),
    ("He ______ ______ going ______ meet his uncle tomorrow.", "그는 내일 자기 삼촌을 만나지 않을 것이다.", "is|not|to"),
    ("She ______ going to join a reading club.", "그녀는 독서 동아리에 가입하지 않을 것이다.", "isn't"),
    ("They are ______ going to ______ to the concert.", "그들은 그 연주회에 가지 않을 것이다.", "not|go"),
    ("I'm ______ ______ paint the fence today.", "나는 오늘 울타리를 페인트칠하지 않을 것이다.", "not|going"),
    ("______ they come to my birthday party? / Yes, they will.", "그들은 내 생일 파티에 올까? / 응, 그럴 거야.", "Will"),
    ("______ it ______ warm today? / No, it won't.", "오늘은 날씨가 따뜻할까? / 아니, 그렇지 않을 거야.", "Will|be"),
    ("Will you study hard for the test? / Yes, we ______.", "너희들은 시험에 대비하여 열심히 공부할 거니? / 응, 그럴 거야.", "will"),
    ("______ Hana going to ______ piano lessons? / Yes, she is.", "하나는 피아노 교습을 받을 거니? / 응, 그럴 거야.", "Is|take"),
    ("______ you ______ to take the subway to City Hall? / Yes, I am.", "너는 지하철을 타고 시청에 갈 거니? / 응, 그럴 거야.", "Are|going"),
    ("Are Jack and Jill going to go camping this Friday? / No, they ______.", "잭과 질은 이번 주 금요일에 캠핑하러 갈 거니? / 아니, 그러지 않을 거야.", "aren't"),
]
B = [FILL(f"B{n}", en, [a], ko=ko, blanks=len(a.split("|")), ex=(n == 1)) for n, (en, ko, a) in enumerate(rb, 1)]
F["run.json"] = finish(meta(U, "run", "Grammar Run", "Future tense practice (pp. 58–59)", "58–59", UT, wordBank=BOX.split(" / ")),
                      [(secA, A), (secB, B)], letter_id, timer=20)

# --- Jump (pp.60–61) ---
secA = S("A", "Section A", "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
secB = S("B", "Section B", "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")

ja = [
    ("The plane will leave at 10:30 a.m.", "The plane ______ ______ ______ at 10:30 a.m.", "will|not|leave", True),
    ("They will exercise tomorrow morning.", "They ______ ______ ______ tomorrow morning.", "will|not|exercise", False),
    ("My family will move to Incheon next month.", "My family ______ ______ ______ to Incheon next month.", "will|not|move", False),
    ("She will keep her promise.", "She ______ ______ ______ her promise.", "will|not|keep", False),
    ("I will have bread and milk for lunch.", "I ______ ______ ______ bread and milk for lunch.", "will|not|have", False),
    ("We will tell the truth to Janet.", "We ______ ______ ______ the truth to Janet.", "will|not|tell", False),
    ("It's going to be sunny all day.", "It's ______ ______ ______ ______ sunny all day.", "not|going|to|be", True),
    ("I'm going to take a rest.", "I'm ______ ______ ______ ______ a rest.", "not|going|to|take", False),
    ("She's going to write a story.", "She's ______ ______ ______ ______ a story.", "not|going|to|write", False),
    ("Dean is going to come back soon.", "Dean is ______ ______ ______ ______ back soon.", "not|going|to|come", False),
    ("We are going to ride horses on the farm.", "We are ______ ______ ______ ______ horses on the farm.", "not|going|to|ride", False),
    ("They are going to see a movie today.", "They are ______ ______ ______ ______ a movie today.", "not|going|to|see", False),
]
A = [FILL(f"A{n}", f"{s}\n→ {t}", [a], blanks=len(a.split("|")), ex=ex) for n, (s, t, a, ex) in enumerate(ja, 1)]

jb = [
    ("You will give me some juice.", "Will you give me some juice?", "Will|you|give", True),
    ("They will arrive at the airport on time.", "______ ______ ______ at the airport on time?", "Will|they|arrive"),
    ("Our soccer team will win the game.", "______ ______ ______ ______ ______ the game?", "Will|our|soccer|team|win"),
    ("Mark will visit the museum this weekend.", "______ ______ ______ ______ the museum this weekend?", "Will|Mark|visit|the"),
    ("She will be fourteen years old next year.", "______ ______ ______ ______ fourteen years old next year?", "Will|she|be"),
    ("You will keep the rules.", "______ ______ ______ the rules?", "Will|you|keep"),
    ("They are going to buy a tent for camping.", "______ ______ ______ ______ ______ a tent for camping?", "Are|they|going|to|buy"),
    ("Bora is going to bring a camera.", "______ ______ ______ ______ ______ a camera?", "Is|Bora|going|to|bring"),
    ("He is going to fix the roof.", "______ ______ ______ ______ ______ the roof?", "Is|he|going|to|fix"),
    ("You are going to play golf today.", "______ ______ ______ ______ ______ golf today?", "Are|you|going|to|play"),
    ("Dad is going to cook dinner.", "______ ______ ______ ______ ______ dinner?", "Is|Dad|going|to|cook"),
    ("We are going to go on a picnic.", "______ ______ ______ ______ ______ on a picnic?", "Are|we|going|to|go"),
]
B = []
for n, row in enumerate(jb, 1):
    if len(row) == 4:
        s, t, a, ex = row
        B.append(FILL(f"B{n}", f"{s}\n→ {t}", [a], blanks=len(a.split("|")), ex=ex))
    else:
        s, t, a = row
        B.append(FILL(f"B{n}", f"{s}\n→ {t}", [a], blanks=len(a.split("|"))))
F["jump.json"] = finish(meta(U, "jump", "Grammar Jump", "Negatives & questions (pp. 60–61)", "60–61", UT),
                        [(secA, A), (secB, B)], letter_id, timer=24)

# --- Fly (pp.62–63) ---
secA = S("A", "Section A", "주어진 말을 바르게 배열하여 미래 시제의 문장을 쓰세요.", R_SENT, "sentence")
secB = S("B", "Section B", "주어진 말을 사용하여 미래 시제의 문장으로 바꿔 쓰세요.", R_SENT, "sentence")
fa = [
    ("( I / for you / carry the boxes / will / . )", "I will carry the boxes for you."),
    ("( Sue / visit my uncle's farm / will / this Sunday / . )", "Sue will visit my uncle's farm this Sunday."),
    ("( he / tomorrow / not / call you again / will / . )", "He will not call you again tomorrow."),
    ("( I / will / keep a diary / not / . )", "I will not keep a diary."),
    ("( they / the baseball game / will / win / ? )", "Will they win the baseball game?"),
    ("( you / by bus / will / go to the library / ? )", "Will you go to the library by bus?"),
    ("( she's / to her home / invite Bill / going to / . )", "She's going to invite Bill to her home."),
    ("( we're / go shopping / going to / tonight / . )", "We're going to go shopping tonight."),
    ("( I'm / tell a lie / not going to / to you / . )", "I'm not going to tell a lie to you."),
    ("( he / take skating lessons / not going to / is / . )", "He is not going to take skating lessons."),
    ("( Sora / is / with us / study math / going to / ? )", "Is Sora going to study math with us?"),
    ("( they / going to / are / their in-line skates / bring / ? )", "Are they going to bring their in-line skates?"),
]
A = [SENT(f"A{n}", w, a, ex=(n == 1)) for n, (w, a) in enumerate(fa, 1)]
fb = [
    ("I am at the swimming pool today. ( will )", "I will be at the swimming pool today."),
    ("We feed our dog in the morning. ( be going to )", "We are going to feed our dog in the morning."),
    ("He stays at home all day. ( will )", "He will stay at home all day."),
    ("Minju plays the piano today. ( be going to )", "Minju is going to play the piano today."),
    ("They don't make paper airplanes. ( will )", "They won't make paper airplanes."),
    ("I don't go to the dentist. ( be going to )", "I'm not going to go to the dentist."),
    ("It isn't windy and cold today. ( will )", "It won't be windy and cold today."),
    ("I don't eat too much ice cream. ( will )", "I won't eat too much ice cream."),
    ("Do you have chicken and salad for dinner? ( will )", "Will you have chicken and salad for dinner?"),
    ("Does she take a rest after lunch? ( be going to )", "Is she going to take a rest after lunch?"),
    ("Do they read many books during the vacation? ( be going to )", "Are they going to read many books during the vacation?"),
    ("Do we catch fish in the river? ( be going to )", "Are we going to catch fish in the river?"),
]
B = [SENT(f"B{n}", s, a, ex=(n == 1)) for n, (s, a) in enumerate(fb, 1)]
F["fly.json"] = finish(meta(U, "fly", "Grammar Fly", "Unscramble & rewrite in the future (pp. 62–63)", "62–63", UT),
                      [(secA, A), (secB, B)], letter_id, timer=26)

# --- Writing (pp.64–65) ---
secA = S("A", "Section A",
         "[정보 활용하기] 준호는 새해를 맞이하여 올해 할 일과 하지 않을 일을 정했습니다. 그림을 보고, 준호의 새해 결심에 대한 문장을 완성하세요.",
         R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
secB = S("B", "Section B",
         "[표 해석하기] 준호네 반 친구들의 여름 방학 계획을 조사한 표입니다. be going to와 주어진 말을 사용하여 표의 내용에 맞게 문장을 쓰세요.",
         R_SENT, "sentence")
A = [
    FILL("A1", "Junho ______ ______ ______.", ["will|exercise|regularly"], ex=True),
    FILL("A2", "Junho ______ ______ ______ ______ every day.", ["will|clean|his|room"]),
    FILL("A3", "Junho ______ ______ ______ ______.", ["will|study|English|hard"]),
    FILL("A4", "Junho ______ ______ ______ ______ ______.", ["won't|watch|too|much|TV", "will|not|watch|too|much|TV"]),
    FILL("A5", "Junho ______ ______ ______ ______ ______.", ["won't|eat|too|much|junk|food", "will|not|eat|too|much|junk|food"]),
    FILL("A6", "Junho ______ ______ ______ ______.", ["won't|stay|up|late", "will|not|stay|up|late"]),
]
B = [
    SENT("B1", "( visit a farm )", "Eight students are going to visit a farm.", ex=True),
    SENT("B2", "( go camping )", "Ten students are going to go camping."),
    SENT("B3", "( go to the beach )", "Twelve students are going to go to the beach."),
    SENT("B4", "( visit their grandparents )", "Six students are going to visit their grandparents."),
    SENT("B5", "( take swimming lessons )", "Five students are going to take swimming lessons."),
    SENT("B6", "( learn Chinese )", "One student is going to learn Chinese."),
]
F["writing.json"] = finish(meta(U, "writing", "Grammar & Writing", "Resolutions & chart (pp. 64–65)", "64–65", UT),
                           [(secA, A), (secB, B)], letter_id, timer=20)

# --- Unit Test 03 (pp.66–70) ---
def m(n, en, ch, a, ko=None):
    return MC(str(n), en, ch, a, ko=ko, numbered=True)

G = []
G.append((S("1-2", "[1–2]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK, "choice"),
          [m(1, "", ["I will keep my promise.", "The game will start soon.", "It will be cloudy tomorrow.",
                      "They will has lunch outside.", "Nancy will clean her room today."], 4),
           m(2, "", ["I am going to join a reading club.", "It is going to rain today.",
                      "We are going to flies a model airplane.", "Tony is going to visit his grandmother.",
                      "They are going to play chess after dinner."], 3)]))
G.append((S("3-5", "[3–5]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(3, "I ______ thirteen years old next year.", ["will is", "is will", "be will", "will be", "will do"], 4),
           m(4, "Dana ______ her birthday party this Saturday.",
              ["are going to have", "is going to has", "am going to have", "is going have to", "is going to have"], 5),
           m(5, "My parents are going to buy a car ______.",
              ["last Sunday", "tomorrow", "this weekend", "next week", "next month"], 1)]))
G.append((S("6-7", "[6–7]", "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(6, "I will take a bus to the museum.\n→ I ______ a bus to the museum.",
              ["not will take", "will take not", "will not take", "will not takes", "will don't take"], 3),
           m(7, "We are going to move to Chuncheon.\n→ We ______ to Chuncheon.",
              ["are going not to move", "are not going to move", "are going to not move",
               "are going to move not", "don't going to move"], 2)]))
G.append((S("8-9", "[8–9]", "다음 의문문에 대한 대답으로 알맞은 것을 고르세요.", R_PICK, "choice"),
          [m(8, "Will they go shopping this afternoon?",
              ["Yes, they are.", "No, they don't.", "No, they won't.", "Yes, will they.", "No, they not will."], 3),
           m(9, "Is he going to see a doctor?",
              ["Yes, he is.", "Yes, he isn't.", "Yes, he does.", "No, he doesn't.", "Yes, he did."], 1)]))
G.append((S("10-11", "[10–11]", "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(10, "My team will win the soccer game.\n→ ______ the soccer game?",
              ["Do my team will win", "Will my team win", "Will my team won", "Is my team will win", "Does my team will win"], 2),
           m(11, "We are going to leave for the beach tomorrow.\n→ ______ for the beach tomorrow?",
              ["Are going we to leave", "Do we going to leave", "Are we go to leave", "Going to we are leave", "Are we going to leave"], 5)]))
G.append((S("12", "[12]", "다음 중 올바른 문장을 고르세요.", R_PICK, "choice"),
          [m(12, "", ["Susan will calls me later.", "I'm going to takes a rest.", "Will the train arrived at 3?",
                       "Is the girls going to come back soon?", "We aren't going to ride horses today."], 5)]))
G.append((S("13-14", "[13–14]", "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(13, "나는 아이스크림을 너무 많이 먹지 않을 것이다.\n→ I ( won't eats / won't eat ) too much ice cream.",
              ["won't eats", "won't eat"], 2, ko="나는 아이스크림을 너무 많이 먹지 않을 것이다."),
           m(14, "너는 수영 강습을 받을 거니?\n→ ( Are you / Will you ) going to take swimming lessons?",
              ["Are you", "Will you"], 1, ko="너는 수영 강습을 받을 거니?")]))
G.append((S("15", "[15]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"),
          [m(15, "", ["A: Will you help me? / B: Yes, I will.", "A: Will they win the game? / B: No, they aren't.",
                        "A: Are you going to study English? / B: Yes, I am.",
                        "A: Are they going to play basketball? / B: Yes, they are.",
                        "A: Is Nancy going to cook lunch? / B: No, she isn't."], 2)]))
G.append((S("16-17", "[16–17]", "다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(16, "• She ______ the piano every day.\n• She ______ the piano tomorrow.",
              ["practice – will practices", "practices – practiced", "practices – will practice",
               "practiced – practices", "will practice – practices"], 3),
           m(17, "• I ______ a bike every weekend.\n• I ______ a bike this weekend.",
              ["ride – am going to ride", "ride – am going ride to", "rides – am going to ride",
               "rides – is going to ride", "rode – am going to rides"], 1)]))
G.append((S("18-19", "[18–19]", "다음 문장의 밑줄 친 부분을 바르게 고쳐 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("18", "Randy won't watches the soccer game on TV.\n→ Randy won't ______ the soccer game on TV.", ["watch"]),
           FILL("19", "It's going not to snows this Christmas.\n→ It's ______ ______ ______ ______ this Christmas.", ["not|going|to|snow"])]))
G.append((S("20-21", "[20–21]", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("20", "A: Will you go to the concert this evening?\nB: No, ______ ______.", ["I|won't", "I|will|not"]),
           FILL("21", "A: Are you and Mina going to join the reading club?\nB: Yes, ______ ______ ______.", ["we|are", "Yes|we|are"])]))
G.append((S("22-25", "[22–25]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("22", "I ______ ______ a diary.", ["will|keep"], ko="나는 일기를 쓸 것이다. ( keep )"),
           FILL("23", "We ______ ______ ______ ______ late for the concert.", ["won't|be", "will|not|be"], ko="우리는 연주회에 늦지 않을 것이다. ( be )"),
           FILL("24", "______ ______ ______ ______ this to your brother?", ["Will|you|give"], ko="너는 이것을 네 남동생에게 줄 거니? ( give )"),
           FILL("25", "______ ______ ______ ______ me the story?", ["Will|he|tell"], ko="그는 내게 그 이야기를 해 줄까? ( tell )")]))
F["unit-test-03.json"] = q_ids(finish(test_meta(3, UT, "66–70"), G, lambda s, n: None))

# --- Wrap Up (p.71) ---
WR = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. 칸이 여러 개면 한 칸에 하나씩 쓰세요. (순서가 바뀌어도 맞는 칸은 순서 상관없어요.)"
s1 = S("1", "1. 미래 시제 will", "Unit 03에서 배운 내용을 정리하세요.", WR, "words")
s2 = S("2", "2. 미래 시제 be going to", "Unit 03에서 배운 내용을 정리하세요.", WR, "words")
W1 = [
    FILL("1-1", "", ["will"], ko="① 미래의 일에 대한 추측이나 의지를 나타낼 때 「[1] +동사원형」을 쓴다."),
    FILL("1-2", "", ["won't", "will not"], ko="② will의 부정문은 「주어+[2]+동사원형 ~.」으로 쓴다."),
    FILL("1-3", "", ["Will"], ko="③ will의 의문문은 「[3]+주어+동사원형 ~?」으로 쓴다."),
]
W2 = [
    FILL("2-1~2", "", ["going|to"], blanks=2, ko="① … 「be [1] [2]+동사원형」을 쓴다."),
    FILL("2-3", "", ["not"], ko="② be going to의 부정문은 「주어+be동사+[3]+going to+동사원형 ~」"),
    FILL("2-4", "", ["going"], ko="③ be going to의 의문문은 「be동사+주어+[4]+to+동사원형 ~?」"),
]
F["wrap.json"] = finish(meta(U, "wrap", "Wrap Up", "Unit summary fill-ins (p. 71)", "71", UT, timer=10), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

# --- Check Up (p.71) ---
sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (will / going / you / wake / to / Are)", R_BANK, "choice")
C = [
    FILL("1", "[그림 1]\nAre you ______ to get up early?", ["going"]),
    FILL("2", "[그림 1]\nYes. I'm going ______ go jogging.", ["to"]),
    FILL("3", "[그림 2]\nOK. I'll ______ up soon.", ["wake"]),
    FILL("4", "[그림 3]\n______ you go jogging?", ["Will"]),
]
F["checkup.json"] = finish(meta(U, "checkup", "Check Up", "Comic dialogue blanks (p. 71)", "71", UT, timer=8,
                                wordBank=["will", "going", "you", "wake", "to", "Are"]), [(sc, C)], lambda sid, n: f"c{n:02d}")

if __name__ == "__main__":
    print(write_unit("unit03", F))
