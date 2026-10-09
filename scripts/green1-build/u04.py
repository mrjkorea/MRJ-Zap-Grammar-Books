"""GreenZap 1 Unit 04 진행 시제 — printed pp. 72–91 (PDF p0073–p0092)."""
from lib import *

U = "u04"
UT = "Unit 04 — 진행 시제"
F = {}

# --- Walk L01 (p.75): A1–A14 -ing forms (A1 ex), B1–B10 circle (B1 ex) ---
secA = S("A", "Section A", "다음 동사의 「동사원형-ing」형을 빈칸에 쓰세요.", R_WORD1 + " (동사원형-ing 한 단어만 쓰세요.)", "words")
verbs = [("watch", "watching"), ("make", "making"), ("cut", "cutting"), ("read", "reading"), ("lie", "lying"),
         ("study", "studying"), ("sit", "sitting"), ("dance", "dancing"), ("go", "going"), ("tie", "tying"),
         ("walk", "walking"), ("write", "writing"), ("shop", "shopping"), ("listen", "listening")]
A = [FILL(f"A{n}", f"{v} → ________", [p], ex=(n == 1)) for n, (v, p) in enumerate(verbs, 1)]
secB = S("B", "Section B", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wb1 = [
    ("The girl ( is looking / looking ) at flowers.", ["is looking", "looking"], "is looking"),
    ("I ( am wash / am washing ) my hands now.", ["am wash", "am washing"], "am washing"),
    ("He ( running / is running ) in the park.", ["running", "is running"], "is running"),
    ("They ( are taking / is taking ) a swimming lesson.", ["are taking", "is taking"], "are taking"),
    ("It ( is snows / is snowing ) outside.", ["is snows", "is snowing"], "is snowing"),
    ("He ( was flying / flying ) a model airplane then.", ["was flying", "flying"], "was flying"),
    ("We ( were walk / were walking ) along the river.", ["were walk", "were walking"], "were walking"),
    ("She ( was making / were making ) dinner in the kitchen.", ["was making", "were making"], "was making"),
    ("They ( going / were going ) to the train station.", ["going", "were going"], "were going"),
    ("I ( was watching / were watching ) a cartoon on TV.", ["was watching", "were watching"], "was watching"),
]
B = [MC(f"B{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wb1, 1)]
F["walk1.json"] = finish(meta(U, "walk1", "Grammar Walk — Lesson 01", "-ing forms & progressive (p. 75)", "75", UT),
                        [(secA, A), (secB, B)], letter_id, timer=10)

# --- Walk L02 (p.77): A1–A10 (A1 ex), B1–B4 answers (B1 ex) ---
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wa = [
    ("I ( not am / am not ) cleaning my room.", ["not am", "am not"], "am not"),
    ("We ( isn't / aren't ) doing our homework.", ["isn't", "aren't"], "aren't"),
    ("My uncle ( isn't / aren't ) wearing a coat.", ["isn't", "aren't"], "isn't"),
    ("We ( not were / were not ) surfing the Internet.", ["not were", "were not"], "were not"),
    ("He ( wasn't / weren't ) sitting on a bench.", ["wasn't", "weren't"], "wasn't"),
    ("Dana and I ( wasn't / weren't ) playing chess.", ["wasn't", "weren't"], "weren't"),
    ("( Are / Is ) you writing a letter?", ["Are", "Is"], "Are"),
    ("( Is Mom looking / Is looking Mom ) for a key?", ["Is Mom looking", "Is looking Mom"], "Is Mom looking"),
    ("( Was / Were ) he studying science?", ["Was", "Were"], "Was"),
    ("( Were playing they / Were they playing ) computer games?", ["Were playing they", "Were they playing"], "Were they playing"),
]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wa, 1)]
secB = S("B", "Section B", "다음 의문문에 알맞은 대답을 골라 동그라미 하세요.",
         "알맞은 대답(a~b)을 하나 골라 누르세요. (직접 쓰지 않아요.)", "choice")
BCH = ["a. Yes, I did.", "b. Yes, I was.", "c. No, he isn't.", "d. No, he is.",
       "e. Yes, she was.", "f. Yes, she did.", "g. No, they weren't.", "h. No, they aren't."]
def bpick(i): return [BCH[i], BCH[i][0], BCH[i][3:]]
B = [MC("B1", "Were you waiting for me?", BCH, bpick(1), ex=True),
     MC("B2", "Is he climbing the ladder?", BCH, bpick(2)),
     MC("B3", "Was Minju drawing a picture?", BCH, bpick(4)),
     MC("B4", "Are they riding horses?", BCH, bpick(6))]
F["walk2.json"] = finish(meta(U, "walk2", "Grammar Walk — Lesson 02", "Progressive negatives & short answers (p. 77)", "77", UT),
                        [(secA, A), (secB, B)], letter_id, timer=10)

# --- Run (pp.78–79) ---
secA = S("A", "Section A", "주어진 말을 사용하여 다음 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
ra = [
    ("They are catching fish. ( catch )", "are|catching", True),
    ("My father ______ ______ a shower now. ( take )", "is|taking"),
    ("A butterfly ______ ______ on a bench. ( sit )", "is|sitting"),
    ("We ______ ______ fun at the camp. ( have )", "are|having"),
    ("The students ______ ______ in the gym. ( exercise )", "are|exercising"),
    ("He ______ ______ a sandcastle. ( build )", "is|building"),
    ("Kate ______ ______ a kite. ( fly )", "is|flying"),
    ("I ______ ______ my cat. ( feed )", "am|feeding"),
    ("The birds were singing in the tree. ( sing )", "were|singing", True),
    ("She ______ ______ yoga at home. ( do )", "was|doing"),
    ("We ______ ______ basketball on the playground. ( play )", "were|playing"),
    ("They ______ ______ in the yard. ( jump rope )", "were|jumping|rope"),
    ("The boy ______ ______ on the grass. ( lie )", "was|lying"),
    ("I ______ ______ on the phone then. ( talk )", "was|talking"),
    ("My sister and I ______ ______ our mother. ( help )", "were|helping"),
]
A = []
for n, row in enumerate(ra, 1):
    if len(row) == 3:
        en, a, ex = row
        A.append(FILL(f"A{n}", en, [a], blanks=len(a.split("|")), ex=ex))
    else:
        en, a = row
        A.append(FILL(f"A{n}", en, [a], blanks=len(a.split("|"))))
BOX = "is / isn't / are / aren't / was / wasn't / were / weren't / not / Am / Are / Is / Was / Were"
secB = S("B", "Section B", "주어진 말을 사용하여 부정문과 의문문을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
rb = [
    ("My grandfather ______ ______ a rest. ( take )", "isn't|taking", "우리 할아버지는 쉬고 계시지 않다."),
    ("It ______ ______ now. ( rain )", "isn't|raining", "지금은 비가 내리고 있지 않다."),
    ("We ______ ______ to the stationery store. ( go )", "aren't|going", "우리는 문구점에 가고 있지 않다."),
    ("I'm ______ ______ a comic book. ( read )", "not|reading", "나는 만화책을 읽고 있지 않다."),
    ("Jackie ______ ______ in her room. ( sleep )", "wasn't|sleeping", "재키는 자기 방에서 자고 있지 않았다."),
    ("They ______ ______ the grass this morning. ( cut )", "weren't|cutting", "그들은 오늘 아침에 잔디를 깎고 있지 않았다."),
    ("He ______ ______ in his diary then. ( write )", "wasn't|writing", "그는 그때 일기를 쓰고 있지 않았다."),
    ("______ you looking for your hat? ( look )", "Are", "너는 네 모자를 찾고 있니?"),
    ("______ your parents ______ at the market? ( shop )", "Are|shopping", "네 부모님은 시장에서 물건을 사고 계시니?"),
    ("______ Steven ______ orange juice? ( drink )", "Is|drinking", "스티븐은 오렌지 주스를 마시고 있니?"),
    ("______ the rabbit ______ a carrot? ( eat )", "Is|eating", "그 토끼는 당근을 먹고 있니?"),
    ("______ you and Paul ______ the flowers? ( water )", "Were|watering", "너와 폴은 꽃에 물을 주고 있었니?"),
    ("______ Cathy ______ with you? ( chat )", "Was|chatting", "캐시는 너와 수다를 떨고 있었니?"),
    ("______ your father ______ the car? ( wash )", "Was|washing", "너희 아버지는 세차를 하고 계셨니?"),
    ("______ you ______ your aunt in a restaurant? ( meet )", "Were|meeting", "너는 식당에서 너희 이모를 만나고 있었니?"),
]
B = [FILL(f"B{n}", en, [a], ko=ko, blanks=len(a.split("|")), ex=(n == 1)) for n, (en, a, ko) in enumerate(rb, 1)]
F["run.json"] = finish(meta(U, "run", "Grammar Run", "Progressive sentences (pp. 78–79)", "78–79", UT, wordBank=BOX.split(" / ")),
                      [(secA, A), (secB, B)], letter_id, timer=20)

# --- Jump (pp.80–81) ---
secA = S("A", "Section A", "다음 문장을 괄호 안의 지시대로 바꿀 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
ja = [
    ("The dog is running in the park. ( − )", "The dog ______ ______ in the park.", "isn't|running", True),
    ("I'm not surfing the Internet now. ( + )", "I'm ______ ______ the Internet now.", "surfing|the|Internet", False),
    ("We are picking apples in the yard. ( − )", "We ______ ______ apples in the yard.", "aren't|picking", False),
    ("She isn't waiting for a bus. ( + )", "She ______ ______ for a bus.", "is|waiting", False),
    ("They are looking at the moon. ( − )", "They ______ ______ at the moon.", "aren't|looking", False),
    ("The man isn't tying his shoelaces. ( + )", "The man ______ ______ his shoelaces.", "is|tying", False),
    ("We were having a birthday party yesterday. ( − )", "We ______ ______ a birthday party yesterday.", "weren't|having", False),
    ("My father wasn't playing the guitar. ( + )", "My father ______ ______ the guitar.", "was|playing", False),
    ("I was singing with my mother. ( − )", "I ______ ______ with my mother.", "wasn't|singing", False),
    ("Dana was making a poster. ( − )", "Dana ______ ______ a poster.", "wasn't|making", False),
    ("My brother and sister weren't dancing together. ( + )", "My brother and sister ______ ______ together.", "were|dancing", False),
    ("They weren't carrying the heavy boxes. ( + )", "They ______ ______ the heavy boxes.", "were|carrying", False),
]
# fix item 2 prompt - should be affirmative surf
ja[1] = ("I'm not surfing the Internet now. ( + )", "I ______ ______ the Internet now.", "am|surfing", False)
A = [FILL(f"A{n}", f"{s}\n→ {t}", [a], blanks=len(a.split("|")), ex=ex) for n, (s, t, a, ex) in enumerate(ja, 1)]
BANK = "were / isn't / are / wasn't / wash / close / ride / drive / listen / watch / feed / fly / take / cross / paint / wear / was"
secB = S("B", "Section B", f"다음 중 알맞은 말을 찾아 대화를 완성하세요. ({BANK}) 중복해서 사용할 수 있고, 필요하면 형태를 바꾸세요.", R_BANK, "choice")
jb = [
    ("A: Is Amy closing the window?\nB: No, she ______.", "isn't"),
    ("A: ______ your parents listening to music?\nB: Yes, they are.", "Are"),
    ("A: ______ you washing your face?\nB: No, I'm not.", "Are"),
    ("A: ______ she taking a walk?\nB: Yes, she is.", "Is"),
    ("A: ______ your uncle driving a car?\nB: Yes, he is.", "Is"),
    ("A: ______ they painting the table?\nB: No, they aren't.", "Are"),
    ("A: Was he feeding his dog?\nB: No, he ______.", "wasn't"),
    ("A: ______ you crossing the street?\nB: Yes, I was.", "Were"),
    ("A: ______ the eagle flying in the sky?\nB: Yes, it was.", "Was"),
    ("A: ______ you and Mary watching a musical?\nB: Yes, we were.", "Were"),
    ("A: ______ she wearing a hat?\nB: No, she wasn't.", "Was"),
    ("A: ______ they riding a roller coaster?\nB: No, they weren't.", "Were"),
]
B = [FILL(f"B{n}", en, [a], ex=(n == 1)) for n, (en, a) in enumerate(jb, 1)]
F["jump.json"] = finish(meta(U, "jump", "Grammar Jump", "Transform & dialogues (pp. 80–81)", "80–81", UT, wordBank=BANK.split(" / ")),
                        [(secA, A), (secB, B)], letter_id, timer=24)

# --- Fly (pp.82–83) ---
secA = S("A", "Section A", "다음 문장을 현재 시제는 현재 진행 시제로, 과거 시제는 과거 진행 시제로 바꿔 쓰세요.", R_SENT, "sentence")
secB = S("B", "Section B", "주어진 말을 바르게 배열하여 진행 시제의 문장을 쓰세요.", R_SENT, "sentence")
fa = [
    ("He lies on the carpet.", "He is lying on the carpet."),
    ("Sophie plays with her dog.", "Sophie is playing with her dog."),
    ("I go to the supermarket.", "I am going to the supermarket."),
    ("We stayed at our aunt's house.", "We were staying at our aunt's house."),
    ("Nari chatted with Suho.", "Nari was chatting with Suho."),
    ("They played baseball today.", "They were playing baseball today."),
    ("She doesn't run in the park.", "She isn't running in the park."),
    ("Your father doesn't drink coffee.", "Your father isn't drinking coffee."),
    ("You don't study Japanese.", "You aren't studying Japanese."),
    ("It didn't snow much.", "It wasn't snowing much."),
    ("We didn't wait for a train.", "We weren't waiting for a train."),
    ("My brother didn't dry his hair.", "My brother wasn't drying his hair."),
]
A = [SENT(f"A{n}", s, a, ex=(n == 1)) for n, (s, a) in enumerate(fa, 1)]
fb = [
    ("( we / looking at the stars / are / . )", "We are looking at the stars."),
    ("( Susan / her grandmother / calling / is / . )", "Susan is calling her grandmother."),
    ("( I / a ball / buying / am / . )", "I am buying a ball."),
    ("( my mother / reading / the newspaper / was / . )", "My mother was reading the newspaper."),
    ("( we / taking pictures / were / . )", "We were taking pictures."),
    ("( a cat / crying / was / last night / . )", "A cat was crying last night."),
    ("( the girl / a comic book / isn't / reading / . )", "The girl isn't reading a comic book."),
    ("( the students / aren't / questions / asking / . )", "The students aren't asking questions."),
    ("( I / then / wearing gloves / wasn't / . )", "I wasn't wearing gloves then."),
    ("( are / drawing / flowers / you / ? )", "Are you drawing flowers?"),
    ("( were / feeding / rabbits / they / ? )", "Were they feeding rabbits?"),
    ("( was / teaching / your uncle / English / ? )", "Was your uncle teaching English?"),
]
B = [SENT(f"B{n}", w, a, ko=None, ex=(n == 1)) for n, (w, a) in enumerate(fb, 1)]
F["fly.json"] = finish(meta(U, "fly", "Grammar Fly", "Rewrite & unscramble (pp. 82–83)", "82–83", UT), [(secA, A), (secB, B)], letter_id, timer=26)

# --- Writing (pp.84–85) ---
secA = S("A", "Section A", "[그림 묘사하기] 다음 장면에서 주인공들은 무엇을 하고 있었을까요? 주어진 말을 사용하여 각 장면에 대한 과거 진행 시제의 문장을 완성하세요.",
         R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
secB = S("B", "Section B", "[그림 묘사하기] 해변에서 사람들이 무엇을 하고 있을까요? 그림을 보고, 다음 중 알맞은 말을 찾아 현재 진행형 문장을 완성하세요.",
         R_BANK, "choice")
BANK2 = "fish / lie / eat / play / fly / build / swim"
A = [
    FILL("A1", "Superman ______ ______ ______ ______.", ["was|flying|in|the|sky"], ex=True),
    FILL("A2", "Cinderella ______ ______ ______ ______ ______.", ["was|dancing|with|a|prince"]),
    FILL("A3", "Snow White ______ ______ ______.", ["was|eating|the|apple"]),
    FILL("A4", "The Little Mermaid ______ ______ ______.", ["was|swimming|for|a|prince"]),
    FILL("A5", "Geppetto ______ ______ ______.", ["was|making|Pinocchio"]),
    FILL("A6", "Peter Pan ______ ______ ______ ______ ______.", ["was|fighting|against|Captain|Hook"]),
]
B = [
    FILL("B1", "Three people ______ ______ in the sea.", ["are|swimming"], ex=True),
    FILL("B2", "A girl and her father ______ ______ ______.", ["are|fishing|in|the|sea"]),
    FILL("B3", "A woman ______ ______ on the sand.", ["is|lying"]),
    FILL("B4", "A man ______ ______ ______.", ["is|building|sandcastles"]),
    FILL("B5", "A boy ______ ______ ______.", ["is|flying|a|kite"]),
    FILL("B6", "A girl ______ ______ ______.", ["is|eating|ice|cream"]),
    FILL("B7", "Two boys ______ ______ ______ ______ ______.", ["are|playing|with|a|beach|ball"]),
]
F["writing.json"] = finish(meta(U, "writing", "Grammar & Writing", "Scenes at the beach & stories (pp. 84–85)", "84–85", UT, wordBank=BANK2.split(" / ")),
                           [(secA, A), (secB, B)], letter_id, timer=20)

# --- Unit Test 04 (pp.86–90) ---
def m(n, en, ch, a, ko=None):
    return MC(str(n), en, ch, a, ko=ko, numbered=True)

G = []
G.append((S("1-2", "[1–2]", "다음 중 「동사원형-ing」형이 잘못 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(1, "", ["tie – tying", "shop – shoping", "watch – watching", "sit – sitting", "fly – flying"], 2),
           m(2, "", ["read – reading", "write – writing", "dance – danceing", "lie – lying", "rain – raining"], 3)]))
G.append((S("3-5", "[3–5]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(3, "My father ______ in the gym.", ["is exercise", "are exercising", "exercising is", "is exercising", "do exercising"], 4),
           m(4, "They ______ to the museum.", ["is going", "going is", "are going", "going are", "are go"], 3),
           m(5, "Tina ______ with her friend then.", ["were talking", "was talking", "did talking", "talking was", "was talks"], 2)]))
G.append((S("6-7", "[6–7]", "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(6, "I am studying math now.\n→ I ______ math now.", ["not am studying", "don't studying", "am not studying", "am not study", "doesn't study"], 3),
           m(7, "We were watching a baseball game.\n→ We ______ a baseball game.", ["weren't watching", "watching weren't", "were watching not", "wasn't watching", "didn't watching"], 1)]))
G.append((S("8-9", "[8–9]", "다음 문장을 의문문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(8, "You are making a sandwich.\n→ ______ a sandwich?", ["Do you making", "Are you make", "Are making you", "Does you make", "Are you making"], 5),
           m(9, "She was wearing a hat.\n→ ______ a hat?", ["Were she wearing", "Were wearing she", "Did she wearing", "Was she wearing", "Was she wear"], 4)]))
G.append((S("10-11", "[10–11]", "다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(10, "Are you drinking orange juice, Nicole?", ["Yes, she is.", "No, I'm not.", "Yes, we are.", "Yes, I do.", "No, we don't."], 2),
           m(11, "Were the birds flying in the sky?", ["Yes, they did.", "No, they wasn't.", "No, it wasn't.", "Yes, they was.", "Yes, they were."], 5)]))
G.append((S("12-13", "[12–13]", "다음 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(12, "It ______ yesterday. It's sunny now.", ["is – snowing", "was – snow", "were – snowing", "was – snowing", "is – snow"], 4),
           m(13, "The students ______ soccer then. They ______ soccer now. They are playing basketball.",
              ["was – weren't", "were – aren't", "were – isn't", "are – were", "were – don't"], 2)]))
G.append((S("14", "[14]", "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(14, "빌은 자기 고양이에게 먹이를 주고 있었다.\n→ Bill ( was / were ) feeding his cat.", ["was", "were"], 1, ko="빌은 자기 고양이에게 먹이를 주고 있었다.")]))
G.append((S("15-16", "[15–16]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK + " ([ ] 안의 말이 밑줄 친 부분이에요.)", "choice"),
          [m(15, "", ["We aren't making a snowman.", "Kate is having lunch with Dean.", "Are you going to the library?",
                        "He isn't play the guitar now.", "Is she looking for a key?"], 4),
           m(16, "", ["My sister was washing her face.", "They weren't buying robots at the store.",
                        "I wasn't taking a shower then.", "Were Sujin writing an e-mail to her father?", "Were you running in the park?"], 4)]))
G.append((S("17", "[17]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"),
          [m(17, "", ["A: Are you listening to music? / B: Yes, I am.", "A: Is Dave cleaning his room? / B: No, he isn't.",
                        "A: Were they riding horses there? / B: Yes, they was.", "A: Was Mina sitting on the bench? / B: Yes, she was.",
                        "A: Were you waiting for me? / B: No, I wasn't."], 3)]))
G.append((S("18-19", "[18–19]", "다음 문장을 지시대로 바꿀 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("18", "A duck swims in the pond. (현재 진행 시제)\n→ A duck ______ ______ in the pond.", ["is|swimming"]),
           FILL("19", "We looked at the beautiful flowers. (과거 진행 시제)\n→ We ______ ______ at the beautiful flowers.", ["were|looking"])]))
G.append((S("20", "[20]", "다음 밑줄 친 부분을 바르게 고쳐서 문장을 완성하세요.", R_WORD1, "words"),
          [FILL("20", "Jordan isn't playing the piano yesterday.\n→ Jordan ______ playing the piano yesterday.", ["wasn't", "was not"])]))
G.append((S("21-23", "[21–23]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("21", "The baby ______ ______ ______ now.", ["isn't|crying", "is|not|crying"], ko="그 아기는 지금 울고 있지 않다. ( cry )"),
           FILL("22", "______ ______ ______ pictures?", ["Are|you|taking"], ko="너는 사진을 찍고 있니? ( take )"),
           FILL("23", "______ ______ ______ ______ a text message to me?", ["Was|Julie|sending"], ko="줄리는 내게 문자 메시지를 보내고 있었니? ( Julie, send )")]))
G.append((S("24-25", "[24–25]", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence"),
          [SENT("24", "( climbing / the mountain now / they / are / . )", "They are climbing the mountain now.", ko="그들은 지금 산에 오르고 있다."),
           SENT("25", "( catching fish / was / in the river / the boy / . )", "The boy was catching fish in the river.", ko="그 남자아이는 강에서 물고기를 잡고 있었다.")]))
F["unit-test-04.json"] = q_ids(finish(test_meta(4, UT, "86–90"), G, lambda s, n: None))

WR = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. 칸이 여러 개면 한 칸에 하나씩 쓰세요. (순서가 바뀌어도 맞는 칸은 순서 상관없어요.)"
s1 = S("1", "1. 현재 진행 시제", "Unit 04에서 배운 내용을 정리하세요.", WR, "words")
s2 = S("2", "2. 과거 진행 시제", "Unit 04에서 배운 내용을 정리하세요.", WR, "words")
W1 = [
    FILL("1-1", "", ["-ing", "ing"], raw=True, ko="① 현재 진행형은 「am/are/is+[1]」 …"),
    FILL("1-2", "", ["not"], ko="② 부정문: 「주어+am/are/is+[2]+동사원형-ing~」"),
    FILL("1-3~4", "", perm_accept(["Am"], ["Are"], ["Is"]), blanks=3, raw=True, ko="③ 의문문: 「[3]/[4]/[5]+주어+동사원형-ing~?」"),
]
W2 = [
    FILL("2-1", "", ["was", "were"], ko="① 과거 진행형은 「[1]/were+동사원형-ing」"),
    FILL("2-2", "", ["not"], ko="② 부정문: 「주어+was/were+[2]+동사원형-ing~」"),
    FILL("2-3~4", "", perm_accept(["Was"], ["Were"]), blanks=2, raw=True, ko="③ 의문문: 「[3]/[4]+주어+동사원형-ing~?」"),
]
F["wrap.json"] = finish(meta(U, "wrap", "Wrap Up", "Unit summary fill-ins (p. 91)", "91", UT, timer=10), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (were / playing / was / Are)", R_BANK, "choice")
C = [
    FILL("1", "Are you ______ with Snowie?\nNo, I'm not. I ______ watching two birds in the tree.", ["playing|was"]),
    FILL("2", "______ the birds singing?\nYes, they were.", ["Were"]),
]
F["checkup.json"] = finish(meta(U, "checkup", "Check Up", "Comic dialogue (p. 91)", "91", UT, timer=8, wordBank=["were", "playing", "was", "Are"]),
                           [(sc, C)], lambda sid, n: f"c{n:02d}")

if __name__ == "__main__":
    print(write_unit("unit04", F))
