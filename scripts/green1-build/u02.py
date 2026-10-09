"""GreenZap 1 Unit 02 과거 시제 — printed pp. 31–47 (PDF p0032–p0048; Drive zap-green1/units/unit-02/charts + review-test-01/charts p0048)."""
from lib import *

U = "u02"; UT = "Unit 02 과거 시제"
F = {}

# --- Walk L01 (p.31): A1–A30 past forms (A1 example) ---
secA = S("A", "Section A", "다음 동사의 과거형을 빈칸에 쓰세요.", R_WORD1 + " (동사의 과거형 한 단어만 쓰세요.)", "words")
verbs = [("am, is", "was"), ("are", "were"), ("look", "looked"), ("like", "liked"), ("have", "had"), ("play", "played"),
         ("make", "made"), ("study", "studied"), ("cook", "cooked"), ("shop", "shopped"), ("go", "went"), ("clean", "cleaned"),
         ("help", "helped"), ("move", "moved"), ("live", "lived"), ("arrive", "arrived"), ("fly", "flew"), ("open", "opened"),
         ("wear", "wore"), ("cut", "cut"), ("see", "saw"), ("work", "worked"), ("feed", "fed"), ("dry", "dried"),
         ("drink", "drank"), ("call", "called"), ("clap", "clapped"), ("catch", "caught"), ("send", "sent"), ("read", "read")]
A = [FILL(f"A{n}", f"{v} → ________", [p], ex=(n == 1)) for n, (v, p) in enumerate(verbs, 1)]
F["walk1.json"] = finish(meta(U, "walk1", "Grammar Walk — Lesson 01", "Past forms of verbs (p. 31)", "31", UT), [(secA, A)], letter_id)

# --- Walk L02 (p.33): A1–A9 circle (A1 ex), B1–B4 matching (B1 ex) ---
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
secB = S("B", "Section B", "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.", "알맞은 대답(a~d)을 하나 골라 누르세요. (직접 쓰지 않아요.)", "choice")
wa = [("She ( wasn't / weren't ) my best friend last year.", ["wasn't", "weren't"], "wasn't"),
      ("We ( wasn't / weren't ) happy then.", ["wasn't", "weren't"], "weren't"),
      ("I ( wasn't / weren't ) late for the concert.", ["wasn't", "weren't"], "wasn't"),
      ("They ( doesn't / didn't ) watch TV last night.", ["doesn't", "didn't"], "didn't"),
      ("Sam didn't ( make / made ) a model airplane.", ["make", "made"], "make"),
      ("( Was / Were ) you at the swimming pool yesterday?", ["Was", "Were"], "Were"),
      ("( Was / Were ) she busy this morning?", ["Was", "Were"], "Was"),
      ("( Do / Did ) they move to Busan last month?", ["Do", "Did"], "Did"),
      ("Did Kate ( have / has ) lunch with you today?", ["have", "has"], "have")]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wa, 1)]
BCH = ["a. Yes, they were.", "b. No, he wasn't.", "c. No, he didn't.", "d. Yes, I did."]
def bacc(i): return [BCH[i], BCH[i][0], BCH[i][3:]]
B = [MC("B1", "Was he sick then?", BCH, bacc(1), ex=True),
     MC("B2", "Did you brush your teeth?", BCH, bacc(3)),
     MC("B3", "Were they farmers?", BCH, bacc(0)),
     MC("B4", "Did Jordan call you last night?", BCH, bacc(2))]
F["walk2.json"] = finish(meta(U, "walk2", "Grammar Walk — Lesson 02", "Past negatives & questions (p. 33)", "33", UT), [(secA, A), (secB, B)], letter_id)

# --- Run (pp.34–35): A1–A15 given verb (A1 ex), B1–B12 word box (B1 ex) ---
secA = S("A", "Section A", "주어진 말을 사용하여 과거 시제의 문장을 완성하세요.", R_WORD1 + " 괄호 안의 말을 과거형으로 바꿔 쓰세요.", "words")
BOX = "was / were / did / visited / sent / studied / had / played / found / fed / wore / cooked"
secB = S("B", "Section B", f"다음 중 알맞은 말을 찾아 문장을 완성하세요. ({BOX})", R_BANK, "choice")
ra = [("I ________ busy all day last Sunday. ( be )", "was"),
      ("Sally and Harry ________ at the bookstore then. ( be )", "were"),
      ("It ________ sunny yesterday. ( be )", "was"),
      ("My mother ________ a sandwich for me. ( make )", "made"),
      ("He ________ his grandmother this afternoon. ( call )", "called"),
      ("We ________ to the zoo last Saturday. ( go )", "went"),
      ("I ________ the heavy boxes yesterday. ( carry )", "carried"),
      ("The baby ________ some milk. ( drink )", "drank"),
      ("John and I ________ books yesterday. ( read )", "read"),
      ("My family ________ near the river then. ( live )", "lived"),
      ("They ________ at the stars in the sky. ( look )", "looked"),
      ("The train ________ at 11 o'clock. ( arrive )", "arrived"),
      ("He ________ some birthday presents from his friends. ( get )", "got"),
      ("His sister ________ a cold last week. ( have )", "had"),
      ("My father ________ a big fish at the lake. ( catch )", "caught")]
A = [FILL(f"A{n}", en, [a], ex=(n == 1)) for n, (en, a) in enumerate(ra, 1)]
rb = [("It ________ cloudy yesterday, but it is sunny today.", "어제는 날씨가 흐렸지만, 오늘은 화창하다.", "was"),
      ("Mr. Brown ________ spaghetti for dinner.", "브라운 씨는 저녁 식사로 스파게티를 요리했다.", "cooked"),
      ("My family ________ my grandparents last weekend.", "우리 가족은 지난 주말에 조부모님을 찾아뵈었다.", "visited"),
      ("There ________ seven pigs on the farm.", "농장에는 돼지 일곱 마리가 있었다.", "were"),
      ("I ________ the cute rabbits.", "나는 그 귀여운 토끼들에게 먹이를 주었다.", "fed"),
      ("We ________ the key under the bed.", "우리는 침대 밑에서 열쇠를 찾았다.", "found"),
      ("They ________ lunch outside.", "그들은 밖에서 점심 식사를 했다.", "had"),
      ("I ________ her e-mail an hour ago.", "나는 한 시간 전에 그녀에게 이메일을 보냈다.", "sent"),
      ("My sister and I ________ chess.", "우리 누나와 나는 체스를 두었다.", "played"),
      ("She ________ a beautiful dress to the party.", "그녀는 파티에서 아름다운 드레스를 입고 있었다.", "wore"),
      ("Paul ________ his homework at night.", "폴은 밤에 숙제를 했다.", "did"),
      ("Minho ________ math in the evening.", "민호는 저녁에 수학을 공부했다.", "studied")]
B = [FILL(f"B{n}", en, [a], ko=ko, ex=(n == 1)) for n, (en, ko, a) in enumerate(rb, 1)]
F["run.json"] = finish(meta(U, "run", "Grammar Run", "Past tense practice (pp. 34–35)", "34–35", UT, wordBank=BOX.split(" / ")), [(secA, A), (secB, B)], letter_id)

# --- Jump (pp.36–37): A1–A12 negative/affirmative (A1 ex), B1–B12 dialogue (B1 ex) ---
secA = S("A", "Section A", "다음 문장을 괄호 안의 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
secB = S("B", "Section B", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
def ja(n, src, kind, tail_head, tail, acc, ex=False):
    k = len(acc.split("|"))
    blanks = " ".join(["______"] * k)
    return FILL(f"A{n}", f"{src} ( {kind} )\n→ {tail_head} {blanks} {tail}", [acc], ex=ex)
A = [ja(1, "He was a good student.", "부정문", "He", "a good student.", "wasn't", ex=True),
     ja(2, "The cookies were very delicious.", "부정문", "The cookies", "very delicious.", "weren't"),
     ja(3, "She was thirsty then.", "부정문", "She", "thirsty then.", "wasn't"),
     ja(4, "My sister and I made paper airplanes.", "부정문", "My sister and I", "paper airplanes.", "didn't|make"),
     ja(5, "They played with a beach ball.", "부정문", "They", "with a beach ball.", "didn't|play"),
     ja(6, "Dana sent a text message to her friend.", "부정문", "Dana", "a text message to her friend.", "didn't|send"),
     ja(7, "The family wasn't at the beach last weekend.", "긍정문", "The family", "at the beach last weekend.", "was"),
     ja(8, "They weren't late for school.", "긍정문", "They", "late for school.", "were"),
     ja(9, "We didn't go to the aquarium by bus.", "긍정문", "We", "to the aquarium by bus.", "went"),
     ja(10, "My mother didn't shop at the market.", "긍정문", "My mother", "at the market.", "shopped"),
     ja(11, "I didn't swim in the sea.", "긍정문", "I", "in the sea.", "swam"),
     ja(12, "Max didn't watch a baseball game.", "긍정문", "Max", "a baseball game.", "watched")]
B = [FILL("B1", "A: ______ you late for school yesterday?\nB: Yes, I ______.", ["Were|was"], ex=True),
     FILL("B2", "A: ______ she angry then?\nB: No, she ______.", ["Was|wasn't"]),
     FILL("B3", "A: Were there many trees in the park?\nB: Yes, there ______.", ["were"]),
     FILL("B4", "A: Was he at the swimming pool then?\nB: No, ______ ______. He was at the theater then.", ["he|wasn't"]),
     FILL("B5", "A: ______ the airplane arrive in the afternoon?\nB: Yes, it did.", ["Did"]),
     FILL("B6", "A: ______ Namho play the piano after school?\nB: No, he ______. He played the guitar after school.", ["Did|didn't"]),
     FILL("B7", "A: ______ you fly model airplanes two days ago?\nB: Yes, we ______.", ["Did|did"]),
     FILL("B8", "A: ______ he go to the movies with Kate last Sunday?\nB: No, ______ ______.", ["Did|he|didn't"]),
     FILL("B9", "A: ______ Lisa get up early this morning?\nB: ______, she ______. She got up late this morning.", ["Did|No|didn't"]),
     FILL("B10", "A: ______ they see a beautiful lake yesterday?\nB: Yes, ______ ______.", ["Did|they|did"]),
     FILL("B11", "A: ______ you clean the living room last night?\nB: No, ______ ______.", ["Did|I|didn't", "Did|we|didn't"]),
     FILL("B12", "A: ______ the girl want a blue jacket then?\nB: Yes, ______ ______.", ["Did|she|did"])]
F["jump.json"] = finish(meta(U, "jump", "Grammar Jump", "Negatives, affirmatives & dialogues (pp. 36–37)", "36–37", UT), [(secA, A), (secB, B)], letter_id)

# --- Fly (pp.38–39): A1–A12 rewrite in past (A1 ex), B1–B12 unscramble (B1 ex) ---
secA = S("A", "Section A", "주어진 말을 사용하여 다음 문장을 과거 시제의 문장으로 바꿔 쓰세요.", R_SENT + " (괄호 안의 시간 표현도 문장에 넣으세요.)", "sentence")
secB = S("B", "Section B", "주어진 말을 바르게 배열하여 과거 시제의 문장을 쓰세요.", R_SENT, "sentence")
def front(sent, tp):
    """also accept the time phrase moved to the front of a statement."""
    body = sent[:-1]
    if body.endswith(" " + tp) and not sent.endswith("?"):
        b = body[: -len(tp) - 1]
        return [sent, f"{tp[0].upper() + tp[1:]}, {b[0].lower() + b[1:] if not b.startswith('I ') else b}."]
    return [sent]
fa = [("There are a lot of people in the stadium.", "then", "There were a lot of people in the stadium then."),
      ("She is busy.", "yesterday", "She was busy yesterday."),
      ("They go to the gallery.", "yesterday", "They went to the gallery yesterday."),
      ("He cleans his room.", "this morning", "He cleaned his room this morning."),
      ("They drink orange juice.", "yesterday", "They drank orange juice yesterday."),
      ("It isn't cloudy.", "five days ago", "It wasn't cloudy five days ago."),
      ("We don't make a snowman.", "today", "We didn't make a snowman today."),
      ("Is Tony's uncle a cook?", "then", "Was Tony's uncle a cook then?"),
      ("Are you and Mary at the zoo?", "last Sunday", "Were you and Mary at the zoo last Sunday?"),
      ("Does your mother come home early?", "that evening", "Did your mother come home early that evening?"),
      ("Do you play the guitar?", "this afternoon", "Did you play the guitar this afternoon?"),
      ("Does the stationery store open?", "last weekend", "Did the stationery store open last weekend?")]
A = [SENT(f"A{n}", f"{s} ( {t} )", front(a, t), ex=(n == 1)) for n, (s, t, a) in enumerate(fa, 1)]
fb = [("the soccer game / very interesting / was / .", "그 축구 경기는 매우 재미있었다.", "The soccer game was very interesting."),
      ("they / kind police officers / were / .", "그들은 친절한 경찰관이었다.", "They were kind police officers."),
      ("she / some presents / from her friends / got / .", "그녀는 자기 친구들에게서 선물 몇 개를 받았다.", "She got some presents from her friends."),
      ("the boys / to the concert / went / .", "그 남자아이들은 콘서트에 갔다.", "The boys went to the concert."),
      ("my family / in the river / caught fish / .", "우리 가족은 강에서 물고기를 잡았다.", "My family caught fish in the river."),
      ("model airplanes / flew / we / .", "우리는 모형 비행기를 날렸다.", "We flew model airplanes."),
      ("at his uncle's farm / he / wasn't / .", "그는 자기 삼촌의 농장에 있지 않았다.", "He wasn't at his uncle's farm."),
      ("shop / we / at the market / didn't / .", "우리는 시장에서 물건을 사지 않았다.", "We didn't shop at the market."),
      ("Mina / a party / didn't / have / .", "미나는 파티를 열지 않았다.", "Mina didn't have a party."),
      ("they / strong firefighters / were / ?", "그들은 힘센 소방관들이었니?", "Were they strong firefighters?"),
      ("they / did / in the park / walk / ?", "그들은 공원에서 걸었니?", "Did they walk in the park?"),
      ("did / to Nami / send a text message / he / ?", "그는 나미에게 문자 메시지를 보냈니?", "Did he send a text message to Nami?")]
B = [SENT(f"B{n}", f"( {w} )", a, ko=k, ex=(n == 1)) for n, (w, k, a) in enumerate(fb, 1)]
F["fly.json"] = finish(meta(U, "fly", "Grammar Fly", "Rewrite in the past & unscramble (pp. 38–39)", "38–39", UT), [(secA, A), (secB, B)], letter_id)

# --- Grammar & Writing (pp.40–41) ---
secA = S("A", "Section A", "[정보 활용하기] 제니와 친구들이 주말에 한 일에 대해 묻고 대답하는 대화입니다. 사진을 보고, 주어진 말을 사용하여 대화를 완성하세요.",
         R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
secB = S("B", "Section B", "[표 해석하기] 다음은 나미와 나미 가족이 작년에 비해 올해 어떤 점이 달라졌는지 정리한 표입니다. 표를 보고, 다음 문장을 완성하세요.",
         "빈칸 두 개에 들어갈 말(동사 + 뒤의 말)을 각각 쓰세요. 첫째 칸은 작년(과거), 둘째 칸은 올해(현재)예요. 주어가 3인칭 단수면 현재 동사에 -s/-es를 붙이세요. (last year / this year는 쓰지 마세요.)", "words")
A = [FILL("A1", "[사진: go camping]\nQ: ______ Jenny ______ ______ last weekend?\nA: Yes, she ______.", ["Did|go|camping|did"], ex=True),
     FILL("A2", "[사진: go fishing]\nQ: ______ Mike ______ ______ last weekend?\nA: Yes, he ______.", ["Did|go|fishing|did"]),
     FILL("A3", "[사진: go swimming]\nQ: Did Kate go hiking last weekend?\nA: No, she ______. She ______ ______.", ["didn't|went|swimming"]),
     FILL("A4", "[사진: ride a bike]\nQ: ______ Kevin ______ ______ ______ last weekend?\nA: Yes, ______ ______.", ["Did|ride|a|bike|he|did"]),
     FILL("A5", "[사진: at the zoo]\nQ: Was Nate ______ ______ ______ last weekend?\nA: Yes, he ______.", ["at|the|zoo|was"]),
     FILL("A6", "[사진: at the museum]\nQ: ______ Brian at the pool last weekend?\nA: No, he ______. He was ______ ______ ______.", ["Was|wasn't|at|the|museum"])]
TABLE = "[표] I: last year walk to school → this year go to school by bus / my brother: not wear a school uniform → wear a school uniform / my father: come home late → come home early / my mother: not exercise → do yoga"
B = [FILL("B1", "I ________________ last year.\nI ________________ this year.", ["walked to school|go to school by bus"], ko=TABLE, ex=True),
     FILL("B2", "My brother ________________ last year.\nHe ________________ this year.", ["didn't wear a school uniform|wears a school uniform"], ko=TABLE),
     FILL("B3", "My father ________________ last year.\nHe ________________ this year.", ["came home late|comes home early"], ko=TABLE),
     FILL("B4", "My mother ________________ last year.\nShe ________________ this year.", ["didn't exercise|does yoga"], ko=TABLE)]
F["writing.json"] = finish(meta(U, "writing", "Grammar & Writing", "Photo dialogues & table (pp. 40–41)", "40–41", UT), [(secA, A), (secB, B)], letter_id)

# --- Unit Test 02 (pp.42–46) ---
def m(n, en, ch, a, ko=None): return MC(str(n), en, ch, a, ko=ko, numbered=True)
G = []
G.append((S("1-2", "[1–2]", "다음 중 동사원형과 과거형이 잘못 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(1, "", ["look – looked", "shop – shoped", "dry – dried", "clean – cleaned", "move – moved"], 2),
           m(2, "", ["drink – drank", "see – saw", "go – went", "read – red", "make – made"], 4)]))
G.append((S("3-5", "[3–5]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(3, "Mary ________ at the museum last Sunday.", ["am", "is", "was", "were", "are"], 3),
           m(4, "They ________ English yesterday.", ["study", "studies", "studyed", "studied", "studying"], 4),
           m(5, "I ________ her e-mail last night.", ["send", "sends", "sended", "sending", "sent"], 5)]))
G.append((S("6-7", "[6–7]", "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(6, "The fish was big.\n→ The fish ________ big.", ["isn't", "don't be", "weren't", "wasn't", "didn't be"], 4),
           m(7, "My sister helped me with my homework.\n→ My sister ________ me with my homework.", ["didn't helped", "weren't help", "wasn't help", "didn't help", "don't help"], 4)]))
G.append((S("8-9", "[8–9]", "다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(8, "Were you and your sister at the theater?", ["Yes, we did.", "No, we didn't.", "Yes, we were.", "No, I wasn't.", "Yes, we are."], 3),
           m(9, "Did Tony call you this morning?", ["Yes, he did.", "Yes, he was.", "Yes, he does.", "No, he doesn't.", "No, he wasn't."], 1)]))
G.append((S("10-11", "[10–11]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK + " ([ ] 안의 말이 밑줄 친 부분이에요.)", "choice"),
          [m(10, "", ["[Was] the book interesting?", "She [wasn't] a singer then.", "They [weren't] go to the concert yesterday.", "There [were] a lot of flowers in the park.", "[Were] they in the fifth grade then?"], 3),
           m(11, "", ["[Did] Jake study math with you yesterday?", "[Did] they live in Seoul two years ago?", "We [didn't got] up early this morning.", "He [didn't read] a book last night.", "My sister [fed] the cat last evening."], 3)]))
G.append((S("12", "[12]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"),
          [m(12, "", ["A: Were there many fish in the pond? / B: Yes, there were.", "A: Was Jack late for the concert? / B: No, he isn't.",
                      "A: Did she go to the movies? / B: Yes, she did.", "A: Did they visit their grandparents last Sunday? / B: Yes, they did.",
                      "A: Was Julie your best friend then? / B: No, she wasn't."], 2)]))
G.append((S("13-14", "[13–14]", "다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(13, "• Namsu ________ sick yesterday.\n• ________ he sick now?", ["is – Was", "was – Was", "was – Is", "were – Is", "was – Did"], 3),
           m(14, "• My dad ________ a big fish last Saturday.\n• I didn't ________ any fish then.", ["catch – catch", "catched – catch", "catched – catched", "caught – catch", "caught – caught"], 4)]))
G.append((S("15", "[15]", "다음 문장의 밑줄 친 부분을 바르게 고쳐 쓴 것을 고르세요.", R_PICK + " ([ ] 안의 말이 밑줄 친 부분이에요.)", "choice"),
          [m(15, "They [didn't made] a model airplane this morning.", ["doesn't made", "weren't make", "wasn't made", "don't made", "didn't make"], 5)]))
G.append((S("16-17", "[16–17]", "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(16, "She was in the sixth grade last year.\n→ ________ in the sixth grade last year?", ["Did she", "Were she", "Was she", "Is she", "Did she was"], 3),
           m(17, "Jake had a birthday party yesterday.\n→ ________ a birthday party yesterday?", ["Did Jake had", "Does Jake have", "Was Jake had", "Did Jake have", "Was Jake have"], 4)]))
G.append((S("18-19", "[18–19]", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("18", "A: Was she at the library yesterday afternoon?\nB: No, ______ ______.", ["she|wasn't"]),
           FILL("19", "A: ______ they take a walk then?\nB: ______, they did.", ["Did|Yes"])]))
G.append((S("20-23", "[20–23]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("20", "I ______ my teeth after dinner.", ["brushed"], ko="나는 저녁 식사 후에 이를 닦았다. ( brush )"),
           FILL("21", "He ______ some cookies for dessert.", ["wanted"], ko="그는 후식으로 쿠키를 원했다. ( want )"),
           FILL("22", "They ______ ______ soccer after school.", ["didn't|play"], ko="그들은 방과 후에 축구를 하지 않았다. ( play )"),
           FILL("23", "______ she ______ to the bookstore?", ["Did|walk"], ko="그녀는 걸어서 서점에 갔니? ( walk )")]))
G.append((S("24-25", "[24–25]", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence"),
          [SENT("24", "( at the park / weren't / there / many people / . )", "There weren't many people at the park.", ko="공원에 사람들이 많이 있지 않았다."),
           SENT("25", "( you / in the sky / see the stars / did / ? )", "Did you see the stars in the sky?", ko="너는 하늘에 뜬 별들을 보았니?")]))
F["unit-test-02.json"] = q_ids(finish(test_meta(2, UT, "42–46"), G, lambda s, n: None))

# --- Wrap Up (p.47) ---
WR = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. 칸이 여러 개면 한 칸에 하나씩 쓰세요. (순서가 바뀌어도 맞는 칸은 순서 상관없어요.)"
s1 = S("1", "1. be동사의 과거형", "Unit 02에서 배운 내용을 정리하세요.", WR, "words")
s2 = S("2", "2. 일반동사의 과거형", "Unit 02에서 배운 내용을 정리하세요.", WR, "words")
W1 = [FILL("1-1", "", ["was"], ko="① am, is의 과거형은 [1]이며, are의 과거형은 [2]이다. → [1]"),
      FILL("1-2", "", ["were"], ko="① am, is의 과거형은 [1]이며, are의 과거형은 [2]이다. → [2]"),
      FILL("1-3", "", ["weren't", "were not"], ko="② be동사 과거형의 부정문은 wasn't, [3]를 쓰고,"),
      FILL("1-4~5", "", perm_accept(["Was"], ["Were"]), blanks=2, raw=True, ko="② … be동사 과거형의 의문문은 「[4] / [5] + 주어 ~?」로 쓴다.")]
W2 = [FILL("2-1", "", ["-ed", "ed"], raw=True, ko="① 일반동사의 과거형은 대부분 동사원형에 [1]나 -d를 붙인다. 다만, 불규칙하게 변하는 불규칙 동사들도 있다."),
      FILL("2-2", "", ["didn't", "did not"], raw=True, ko="② 일반동사 과거형의 부정문은 「[2] + 동사원형」을 쓰고,"),
      FILL("2-3", "", ["Did"], ko="② … 일반동사 과거형의 의문문은 「[3] + 주어 + 동사원형 ~?」으로 쓴다.")]
F["wrap.json"] = finish(meta(U, "wrap", "Wrap Up", "Unit summary fill-ins (p. 47)", "47", UT, timer=10), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

# --- Check Up (p.47): did / yes / played / were ---
sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (did / yes / played / were)", R_BANK, "choice")
C = [FILL("1", "[그림 1]\nBoy 1: ______ you at the beach yesterday?\nBoy 2: Yes, I was.", ["Were"]),
     FILL("2", "[그림 2] 바닷가에서 공놀이하는 모습을 떠올리며\nBoy 2: I ______ with a ball.", ["played"]),
     FILL("3", "[그림 3]\nBoy 1: ______ you swim?\nBoy 2: Um...", ["Did"]),
     FILL("4", "[그림 4] 수영하는 모습을 떠올리며\nBoy 2: ______, I did.", ["Yes"])]
F["checkup.json"] = finish(meta(U, "checkup", "Check Up", "Comic dialogue blanks (p. 47)", "47", UT, timer=8, wordBank=["did", "yes", "played", "were"]), [(sc, C)], lambda sid, n: f"c{n:02d}")

if __name__ == "__main__":
    print(write_unit("unit02", F))
