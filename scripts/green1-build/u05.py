"""GreenZap 1 Unit 05 조동사 (1) — printed pp. 96–115 (PDF p0097–p0116)."""
from lib import *

U = "u05"
UT = "Unit 05 — 조동사 (1)"
F = {}

# --- Walk L01 (p.99): A1–A9 (A1 ex), B1–B4 (B1 ex) ---
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wa = [
    ("I ( make can / can make ) a sandwich.", ["make can", "can make"], "can make"),
    ("My uncle ( can speak / can speaks ) Chinese.", ["can speak", "can speaks"], "can speak"),
    ("The game ( wills start / will start ) at 2 o'clock.", ["wills start", "will start"], "will start"),
    ("She ( cannot play / cannot plays ) the flute.", ["cannot play", "cannot plays"], "cannot play"),
    ("We ( can help not / can't help ) you right now.", ["can help not", "can't help"], "can't help"),
    ("It ( not will / will not ) rain today.", ["not will", "will not"], "will not"),
    ("They ( won't / don't will ) come back soon.", ["won't", "don't will"], "won't"),
    ("( Can they / Do they can ) climb the tree?", ["Can they", "Do they can"], "Can they"),
    ("Will ( he wins / he win ) the race?", ["he wins", "he win"], "he win"),
]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wa, 1)]
secB = S("B", "Section B", "다음 대화의 빈칸에 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wb = [
    ("Can Nicole ______ taekwondo? / Yes, she can.", ["does", "do"], "do"),
    ("______ go hiking with us? / No, they won't.", ["Do they will", "Will they"], "Will they"),
    ("Can you swim in the sea? / No, ______.", ["I can", "I can't"], "I can't"),
    ("Will you exercise at the gym? / Yes, ______.", ["I will", "I won't"], "I will"),
]
B = [MC(f"B{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wb, 1)]
F["walk1.json"] = finish(meta(U, "walk1", "Grammar Walk — Lesson 01", "Modals can & will (p. 99)", "99", UT), [(secA, A), (secB, B)], letter_id, timer=10)

# --- Walk L02 (p.101): A1–A7 (A1 ex), B1–B6 matching ---
secA = S("A", "Section A", "다음 문장 또는 대화의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
wa2 = [
    ("Cheetahs ( is / are ) able to run very fast.", ["is", "are"], "are"),
    ("Can Jack ( fly / flies ) a kite?", ["fly", "flies"], "fly"),
    ("The child ( don't / isn't ) able to read a map.", ["don't", "isn't"], "isn't"),
    ("They ( could not / not could ) see the cartoon yesterday.", ["could not", "not could"], "could not"),
    ("You ( can ride / ride can ) my bike.", ["can ride", "ride can"], "can ride"),
    ("( Can I / Can you ) use your stapler? / Sure. Here you are.", ["Can I", "Can you"], "Can I"),
    ("( Can I / Can you ) bring me some water? / Sorry, but I can't.", ["Can I", "Can you"], "Can you"),
]
A = [MC(f"A{n}", en, ch, ans, ex=(n == 1)) for n, (en, ch, ans) in enumerate(wa2, 1)]
secB = S("B", "Section B", "다음 문장에서 밑줄 친 부분의 알맞은 의미를 찾아 선으로 연결하세요.",
         "알맞은 의미(a~d)를 하나 골라 누르세요. (직접 쓰지 않아요.)", "choice")
MEAN = ["a. ~할 수 있다 (능력)", "b. ~해도 된다 (허가)", "c. ~해 줄 수 있니? (요청)", "d. ~해도 되니? (허가)"]
def mpick(i): return [MEAN[i], MEAN[i][0], MEAN[i][3:]]
B = [
    MC("B1", "I can solve this math problem.", MEAN, mpick(0), ex=True),
    MC("B2", "Can I ask you a question?", MEAN, mpick(3)),
    MC("B3", "Can you wait for me, please?", MEAN, mpick(2)),
    MC("B4", "You can go home now.", MEAN, mpick(1)),
    MC("B5", "The girl is able to ski.", MEAN, mpick(0)),
    MC("B6", "Can you open the window, please?", MEAN, mpick(2)),
]
F["walk2.json"] = finish(meta(U, "walk2", "Grammar Walk — Lesson 02", "can: ability, permission & requests (p. 101)", "101", UT),
                        [(secA, A), (secB, B)], letter_id, timer=10)

# --- Run (pp.102–103) ---
secA = S("A", "Section A", "다음 문장을 괄호 안의 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
ra = [
    ("My mother can drive a car. ( − )", "My mother ______ ______ a car.", "can't|drive"),
    ("I can draw pictures well. ( − )", "I ______ ______ pictures well.", "can't|draw"),
    ("The boy can ride a skateboard. ( − )", "The boy ______ ______ a skateboard.", "can't|ride"),
    ("We could see the stars last night. ( − )", "We ______ ______ the stars last night.", "couldn't|see"),
    ("I will call you tomorrow morning. ( − )", "I ______ ______ you tomorrow morning.", "won't|call"),
    ("She will send me a letter. ( − )", "She ______ ______ me a letter.", "won't|send"),
    ("You can play table tennis. ( ? )", "______ you ______ table tennis?", "Can|play"),
    ("Minho's sister can make gimchi. ( ? )", "______ Minho's sister ______ gimchi?", "Can|make"),
    ("They can speak Japanese. ( ? )", "______ they ______ Japanese?", "Can|speak"),
    ("The store will close at 10 o'clock. ( ? )", "______ the store ______ at 10 o'clock?", "Will|close"),
    ("Tony will water the plants. ( ? )", "______ Tony ______ the plants?", "Will|water"),
    ("It will be sunny tomorrow. ( ? )", "______ it ______ sunny tomorrow?", "Will|be"),
]
A = [FILL(f"A{n}", f"{s}\n→ {t}", [a], blanks=len(a.split("|")), ex=(n == 1)) for n, (s, t, a) in enumerate(ra, 1)]

secB = S("B", "Section B", "다음 문장에서 밑줄 친 부분의 뜻을 우리말로 쓰세요.",
         "빈칸에 우리말 뜻을 문장 형태로 쓰세요. (문장 전체를 쓰세요.)", "sentence")
rb = [
    ("We can go sledding in winter.", "우리는 겨울에 썰매를 타러 갈 수 있다."),
    ("She can't find her pencil case.", "그녀는 자기 필통을 찾을 수 없다."),
    ("Can they climb the mountain?", "그들은 산에 오를 수 있니?"),
    ("Some birds are able to speak.", "어떤 새들은 말을 할 수 있다."),
    ("The man isn't able to ride a horse.", "그 남자는 말을 탈 수 없다."),
    ("Are you able to bake cookies?", "너는 쿠키를 구울 수 있니?"),
    ("I could remember her name.", "나는 그녀의 이름을 기억할 수 있었다."),
    ("I could not win the race yesterday.", "나는 어제 그 경주에서 이기지 못했다."),
    ("You can take a rest now.", "너는 이제 쉬어도 된다."),
    ("You can play a computer game now.", "너는 이제 컴퓨터 게임을 해도 된다."),
    ("Can I borrow your book?", "내가 네 책을 빌려도 되니?"),
    ("Can I drink this soda?", "내가 이 탄산음료를 마셔도 되니?"),
    ("Can you give me some water?", "내게 물을 좀 줄 수 있니?"),
    ("Can you feed the bird, please?", "그 새에게 먹이를 주어 줄 수 있니?"),
    ("Can you carry my bag, please?", "제 가방을 나르는 것을 도와줄 수 있니?"),
]
B = [SENT(f"B{n}", en, ko, ko=ko, ex=(n == 1)) for n, (en, ko) in enumerate(rb, 1)]
F["run.json"] = finish(meta(U, "run", "Grammar Run", "Modal forms & Korean meanings (pp. 102–103)", "102–103", UT),
                      [(secA, A), (secB, B)], letter_id, timer=20)

# --- Jump (pp.104–105) ---
secA = S("A", "Section A", "주어진 말을 사용하여 다음 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
ja = [
    ("My father can fix a car. ( fix, can )", "My father ______ ______ a car.", "can|fix"),
    ("Danny ______ the drums. ( not, play, can )", "Danny ______ ______ the drums.", "can't|play"),
    ("______ they ______ the river? ( cross, can )", "______ they ______ the river?", "Can|cross"),
    ("I ______ Sally at the mall. ( not, meet, could )", "I ______ Sally at the mall.", "couldn't|meet"),
    ("The child ______ a bike. ( ride, be able to )", "The child ______ ______ a bike.", "is|able|to|ride"),
    ("An ostrich ______. ( not, fly, be able to )", "An ostrich ______ ______ ______.", "isn't|able|to|fly"),
    ("______ she ______ golf? ( play, be able to )", "______ she ______ golf?", "Is|able|to|play"),
    ("You ______ that backpack. ( buy, can )", "You ______ ______ that backpack.", "can|buy"),
    ("You ______ my computer. ( use, can )", "You ______ ______ my computer.", "can|use"),
    ("______ I ______ this shirt? ( try on, can )", "______ I ______ this shirt?", "Can|try|on"),
    ("______ you ______ shopping with me? ( go, can )", "______ you ______ shopping with me?", "Can|go"),
    ("______ you ______ my cat for me? ( find, can )", "______ you ______ my cat for me?", "Can|find"),
]
A = [FILL(f"A{n}", en, [a], blanks=len(a.split("|")), ex=(n == 1)) for n, (en, _t, a) in enumerate(ja, 1)]
BANK = "can / are / drive / climb / tell / dive / make / is / watch / pass / pick / turn / eat / move / catch"
secB = S("B", "Section B", f"다음 중 알맞은 말을 찾아 대화를 완성하세요. ({BANK}) 중복해서 사용할 수 있어요.", R_BANK, "choice")
jb = [
    ("A: Can you climb the ladder?\nB: Yes, I can.", "Can"),
    ("A: ______ the children dive?\nB: No, they can't.", "Can"),
    ("A: ______ bears able to catch fish?\nB: Yes, they are.", "Are"),
    ("A: ______ he move that bookcase?\nB: No, he can't.", "Can"),
    ("A: ______ your sister able to make pizza?\nB: Of course.", "Is"),
    ("A: ______ I watch a cartoon?\nB: Sorry, but I can't.", "Can"),
    ("A: ______ I pick those apples?\nB: Of course, you can.", "Can"),
    ("A: ______ I eat some more bread?\nB: Sorry, but you can't.", "Can"),
    ("A: ______ you pass me the fork?\nB: Sure. Here you are.", "Can"),
    ("A: ______ you drive me to school, please?\nB: OK.", "Can"),
    ("A: ______ you turn off the light?\nB: OK.", "Can"),
    ("A: ______ you tell me your phone number?\nB: OK.", "Can"),
]
B = [FILL(f"B{n}", en, [a], ex=(n == 1)) for n, (en, a) in enumerate(jb, 1)]
F["jump.json"] = finish(meta(U, "jump", "Grammar Jump", "can / be able to & dialogues (pp. 104–105)", "104–105", UT, wordBank=BANK.split(" / ")),
                        [(secA, A), (secB, B)], letter_id, timer=24)

# --- Fly (pp.106–107) ---
secA = S("A", "Section A", "can, will을 사용하여 다음 문장을 바꿔 쓰세요.", R_SENT, "sentence")
secB = S("B", "Section B", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence")
fa = [
    ("Susan cooks spaghetti.", "Susan can cook spaghetti."),
    ("My dog catches my ball.", "My dog can catch my ball."),
    ("I open the bottle.", "I can open the bottle."),
    ("We go jogging every morning.", "We will go jogging every morning."),
    ("They take a walk.", "They will take a walk."),
    ("James is fifteen years old.", "James will be fifteen years old."),
    ("He doesn't finish his homework today.", "He can't finish his homework today."),
    ("Dogs don't climb trees.", "Dogs can't climb trees."),
    ("I don't take swimming lessons.", "I won't take swimming lessons."),
    ("Do you play volleyball?", "Can you play volleyball?"),
    ("Does the boy read Japanese?", "Can the boy read Japanese?"),
    ("Do they visit their grandparents?", "Will they visit their grandparents?"),
]
A = [SENT(f"A{n}", s, a, ex=(n == 1)) for n, (s, a) in enumerate(fa, 1)]
fb = [
    ("( she / in English / write a diary / can / . )", "She can write a diary in English."),
    ("( find my gloves / I / can't / . )", "I can't find my gloves."),
    ("( we / take the subway / can / to the zoo / ? )", "Can we take the subway to the zoo?"),
    ("( the robots / talk / are able to / . )", "The robots are able to talk."),
    ("( isn't / the baby / walk / able to / . )", "The baby isn't able to walk."),
    ("( your grandfather / is / use the Internet / able to / ? )", "Is your grandfather able to use the Internet?"),
    ("( watch a horror movie / you / can / tonight / . )", "You can watch a horror movie tonight."),
    ("( on the sofa / you / put your bag / can / . )", "You can put your bag on the sofa."),
    ("( come later / I / can / ? )", "Can I come later?"),
    ("( borrow your book / I / can / ? )", "Can I borrow your book?"),
    ("( to City Hall / you / tell me the way / can / ? )", "Can you tell me the way to City Hall?"),
    ("( you / can / the TV / turn on / ? )", "Can you turn on the TV?"),
]
B = [SENT(f"B{n}", w, a, ex=(n == 1)) for n, (w, a) in enumerate(fb, 1)]
F["fly.json"] = finish(meta(U, "fly", "Grammar Fly", "Rewrite with modals & unscramble (pp. 106–107)", "106–107", UT),
                      [(secA, A), (secB, B)], letter_id, timer=26)

# --- Writing (pp.108–109) ---
secA = S("A", "Section A", "[상황 묘사하기] 다음 그림을 보고, Can you ~?를 사용하여 부탁하는 문장을 써 보세요.", R_SENT, "sentence")
secB = S("B", "Section B", "[표 해석하기] 다음은 할 수 있는 것과 할 수 없는 것을 정리한 표입니다. 표를 보고, 대화를 완성해 보세요.",
         R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words")
A = [
    SENT("A1", "( move this desk )", "Can you move this desk?", ex=True),
    SENT("A2", "( open the window )", "Can you open the window?"),
    SENT("A3", "( give me some food, please )", "Can you give me some food, please?"),
    SENT("A4", "( pass me the towel )", "Can you pass me the towel?"),
    SENT("A5", "( find my dog, please )", "Can you find my dog, please?"),
    SENT("A6", "( play badminton with me )", "Can you play badminton with me?"),
]
TABLE = "[표] Mina: can play flute / can't play guitar / father: can't fix computer / can fix bicycle / mother: can speak Chinese / can't speak French / ostriches: can't fly / can run fast / elephants: can pick fruit / can't climb trees"
B = [
    FILL("B1", "Q: Can Mina play the flute?\nA: Yes, she can. But she can't play the guitar.", ["can't|play|the|guitar"], ko=TABLE, ex=True),
    FILL("B2", "Q: Can Mina's father fix a computer?\nA: No, he ______. But he can fix a bicycle.", ["can't"]),
    FILL("B3", "Q: Can Mina's mother speak French?\nA: Yes, she can. But she ______.", ["can't|speak|French"]),
    FILL("B4", "Q: Can ostriches fly?\nA: No, they can't. But they ______.", ["can|run|fast"]),
    FILL("B5", "Q: Can elephants pick fruit?\nA: Yes, they can. But they can't ______.", ["climb|trees"]),
]
F["writing.json"] = finish(meta(U, "writing", "Grammar & Writing", "Requests & ability chart (pp. 108–109)", "108–109", UT),
                           [(secA, A), (secB, B)], letter_id, timer=20)

# --- Unit Test 05 (pp.110–114) ---
def m(n, en, ch, a, ko=None):
    return MC(str(n), en, ch, a, ko=ko, numbered=True)

G = []
G.append((S("1", "[1]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK, "choice"),
          [m(1, "", ["She can play the violin.", "My dog can catch my ball.", "We will go to the gallery.",
                      "Tom is able to ride a skateboard.", "Molly can makes a sandwich."], 5)]))
G.append((S("2-3", "[2–3]", "다음 두 문장이 같은 뜻이 되도록 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(2, "Monkeys can climb trees. = Monkeys ______ climb trees.", ["is able to", "do able to", "able are to", "are able to", "are going to"], 4),
           m(3, "She cannot draw a picture well. = She ______ draw a picture well.", ["is able not to", "aren't able to", "isn't able to", "is able to not", "doesn't able to"], 3)]))
G.append((S("4-6", "[4–6]", "다음 문장을 괄호 안의 지시대로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(4, "They are able to carry the heavy bookcase. ( ? )\n→ ______ carry the heavy bookcase?",
              ["Are able they to", "Do they able to", "Are able to they", "Are they able to", "Do they are able to"], 4),
           m(5, "He can play table tennis. ( ? )\n→ ______ table tennis?", ["Can he plays", "Can play he", "Is he can play", "Does he can play", "Can he play"], 5),
           m(6, "The girl can read an English storybook. ( − )\n→ The girl ______ an English storybook.",
              ["can't read", "can read not", "not can read", "cannot reads", "don't can read"], 1)]))
G.append((S("7-8", "[7–8]", "다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(7, "Can you open the bottle?", ["No, I can.", "Yes, I can't.", "No, I can't.", "No, not can.", "Yes, I cans."], 3),
           m(8, "Is Ann able to speak Korean?", ["Yes, she is.", "No, she is.", "Yes, she does.", "No, she doesn't.", "Yes, she can't."], 1)]))
G.append((S("9-10", "[9–10]", "다음 대화의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(9, "A: ______ use your eraser? / B: Sure. Here you are.", ["Can I", "Can you", "You can", "Will you", "Are you able to"], 1),
           m(10, "A: Can they give me some fruit? / B: Sorry, but ______.", ["Can I", "Can you", "Will I", "I can't", "Do you"], 4)]))
G.append((S("11", "[11]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"),
          [m(11, "I ______ meet Sarah yesterday. But I can meet her today.", ["cannot", "could not", "not could", "didn't could", "don't"], 2)]))
G.append((S("12", "[12]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"),
          [m(12, "", ["A: Can you ski? / B: No, I can't.", "A: Will she call me later? / B: Yes, she will.",
                        "A: Is he able to dive well? / B: No, he isn't.", "A: Can I borrow your comic book? / B: No, he isn't.",
                        "A: Can you open the door? / B: Yes, I can."], 4)]))
G.append((S("13-14", "[13–14]", "다음 밑줄 친 부분이 주어진 의미로 쓰인 것을 고르세요.", R_PICK, "choice"),
          [m(13, "~해도 되다 (허가)", ["You are able to sing well.", "He can run very fast.", "You can sit here.",
                                        "You can't swim there.", "She can solve the math problem easily."], 3),
           m(14, "~해 줄 수 있니? (요청)", ["Are you able to do yoga?", "Will he go hiking with us?",
                                            "Can you ride a horse well?", "Can you turn on the light?", "Can she speak Chinese?"], 4)]))
G.append((S("15-17", "[15–17]", "다음 우리말 뜻과 같도록 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [m(15, "우리 어머니는 수영을 못하신다. 어머니는 수영 강습을 받으실 것이다.",
              ["can – will", "will – can", "can't – will", "is able to – will", "can't – won't"], 3),
           m(16, "여기 이 안은 춥다. 창문 좀 닫아 줄 수 있니?", ["hot – Can", "cold – Do", "not cold – Will", "warm – Can", "cold – Can"], 5),
           m(17, "나는 목이 마르다. 내가 물 좀 마셔도 되니?", ["thirsty – I", "thirsty – you", "not thirsty – I", "hungry – I", "hungry – you"], 1)]))
G.append((S("18-19", "[18–19]", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("18", "A: Can the girl read a map?\nB: Yes, ______.", ["she|can"]),
           FILL("19", "A: Brian, are you able to do taekwondo?\nB: No, ______.", ["I'm|not", "I|am|not"])]))
G.append((S("20-23", "[20–23]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("20", "I ______ ______ her name.", ["can't|remember", "cannot|remember"], ko="나는 그녀의 이름을 기억하지 못한다. ( remember )"),
           FILL("21", "They ______ ______ skating every weekend.", ["could|go"], ko="그들은 주말마다 스케이트를 타러 갈 수 있었다. ( go )"),
           FILL("22", "We ______ ______ the basketball game.", ["can|win"], ko="우리는 그 농구 시합에서 이길 수 있다. ( win )"),
           FILL("23", "You ______ ______ a cartoon now.", ["can|watch"], ko="너는 이제 만화 영화를 봐도 된다. ( watch )")]))
G.append((S("24-25", "[24–25]", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence"),
          [SENT("24", "( you / your phone number / can / tell me / ? )", "Can you tell me your phone number?", ko="내게 네 전화번호를 말해 줄 수 있니?"),
           SENT("25", "( I / with you / study science / can / ? )", "Can I study science with you?", ko="내가 너와 함께 과학을 공부해도 되니?")]))
F["unit-test-05.json"] = q_ids(finish(test_meta(5, UT, "110–114"), G, lambda s, n: None))

WR = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. 칸이 여러 개면 한 칸에 하나씩 쓰세요. (순서가 바뀌어도 맞는 칸은 순서 상관없어요.)"
s1 = S("1", "1. 조동사의 쓰임", "Unit 05에서 배운 내용을 정리하세요.", WR, "words")
s2 = S("2", "2. 조동사 can", "Unit 05에서 배운 내용을 정리하세요.", WR, "words")
W1 = [
    FILL("1-1", "", ["동사원형"], ko="① 「조동사+[1]」으로 동사에 능력, 미래, 의무 등의 뜻을 더해 준다."),
    FILL("1-2", "", ["not"], ko="② 부정문: 「조동사+[2]+동사원형」"),
    FILL("1-3", "", ["조동사"], ko="③ 의문문: 「[3]+주어+동사원형~?」"),
]
W2 = [
    FILL("2-1", "", ["can"], ko="① 능력: can (= be able to)"),
    FILL("2-2", "", ["can"], ko="② 허가: You can ~"),
    FILL("2-3", "", ["Can"], ko="③ 요청: Can you ~?"),
]
F["wrap.json"] = finish(meta(U, "wrap", "Wrap Up", "Unit summary fill-ins (p. 115)", "115", UT, timer=10), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (Can / you / can / couldn't / I / will)", R_BANK, "choice")
C = [
    FILL("1", "______ I read the comic book?\nNo, you can't. I'm reading now.", ["Can"]),
    FILL("2", "I ______ play with Snowie.", ["will"]),
    FILL("3", "He ______ catch my ball.\nCan you play with me?\nSorry, but I can't.", ["couldn't"]),
    FILL("4", "Oh, I'm sorry. Snowie ______ catch my ball.", ["can"]),
]
F["checkup.json"] = finish(meta(U, "checkup", "Check Up", "Comic dialogue (p. 115)", "115", UT, timer=8,
                                wordBank=["Can", "you", "can", "couldn't", "I", "will"]), [(sc, C)], lambda sid, n: f"c{n:02d}")

if __name__ == "__main__":
    print(write_unit("unit05", F))
