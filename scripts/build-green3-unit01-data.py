#!/usr/bin/env python3
"""Build GreenZap 3 (ZAP Green 3 / Grammar Zap 심화 3) Unit 01 practice JSON.
Source: Drive ZAPgreen03 (1oL7F5lLQIOK2aWtTEqwHetypmHtGLnM8) text + zap-green3/units page images.
Schema mirrors data/green1/unit01/*.json in mrjkorea/MRJ-Zap-Grammar-Books,
plus optional fields: section, label (book numbering, e.g. "A3"), instructionKo.
"""
import json, os, re, sys

print(
    "NOTE: data/green3/unit01/*.json is the source of truth (sectionsVersion 2). "
    "This generator refuses to overwrite sectioned data.",
    file=sys.stderr,
)
sys.exit(0)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "green3", "unit01")
os.makedirs(OUT, exist_ok=True)

CONTR = [("what is", "what's"), ("who is", "who's"), ("where is", "where's"), ("when is", "when's"),
         ("how is", "how's"), ("it is", "it's"), ("that is", "that's")]

def sent_variants(*sents):
    """All accepted forms for a whole-sentence answer: original, no commas,
    contraction <-> full form, curly apostrophe. Normalizer already ignores case,
    end punctuation and extra spaces."""
    out = []
    def add(s):
        s = re.sub(r"\s+", " ", s).strip()
        if s and s not in out:
            out.append(s)
    for s in sents:
        base = [s, s.replace(",", "")]
        more = []
        for b in base:
            more.append(b)
            low = b
            for full, short in CONTR:
                pat_full = re.compile(r"\b" + full + r"\b", re.I)
                pat_short = re.compile(r"\b" + re.escape(short) + r"\b", re.I)
                if pat_full.search(low):
                    more.append(pat_full.sub(short[0].upper() + short[1:] if low[:len(full)].lower() == full and low[0].isupper() else short, low, count=1))
                if pat_short.search(low):
                    more.append(pat_short.sub(full, low, count=1))
        for m in more:
            add(m)
            if "'" in m:
                add(m.replace("'", "\u2019"))
    return out

def word_variants(*words):
    out = []
    for w in words:
        for v in (w, w.replace("'", "\u2019")):
            if v not in out:
                out.append(v)
    return out

def mc2(id_, section, label, instr, en, choices, answer, ko=None):
    it = {"id": id_, "section": section, "label": label, "type": "mc",
          "promptKo": instr + (("\n" + ko) if ko else ""), "promptEn": en,
          "choices": choices, "accept": [answer]}
    return it

def fill(id_, section, label, instr, en, accept, blanks=1, ko=None):
    return {"id": id_, "section": section, "label": label, "type": "fill",
            "promptKo": instr + (("\n" + ko) if ko else ""), "promptEn": en,
            "blanks": blanks, "accept": accept}

def sentence(id_, section, label, instr, en, accept, ko=None):
    return {"id": id_, "section": section, "label": label, "type": "sentence",
            "promptKo": instr + (("\n" + ko) if ko else ""), "promptEn": en,
            "accept": accept}

def practice(pid, title, subtitle, pages, timer, items, **extra):
    d = {"practiceId": pid, "title": title, "subtitle": subtitle, "pages": pages,
         "timerMinutes": timer, "bookId": "zap-green-3", "bookTitle": "ZAP Green 3",
         "appName": "GreenZap 3", "unitId": "unit-01", "unitTitle": "Unit 01 — 의문사 있는 의문문 (1)"}
    d.update(extra)
    d["items"] = items
    return d

def multi(answers):
    """answers: list of alternative lists of blank values -> accept entries 'a|b|c'."""
    out = []
    for alt in answers:
        e = "|".join(alt)
        if e not in out:
            out.append(e)
        e2 = e.replace("'", "\u2019")
        if e2 not in out:
            out.append(e2)
    return out

B = "_____"
files = {}

# ---------------- Grammar Walk — Lesson 01 (p.11) ----------------
I_A = "A. 다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요."
walk1_a = [
    ("( Who / What ) are you eating?", ["Who", "What"], "What", "너는 무엇을 먹고 있니?"),
    ("( What / Which ) does your father do?", ["What", "Which"], "What", "네 아버지는 무슨 일을 하시니?"),
    ("( Who / What ) will you do for Mom's birthday?", ["Who", "What"], "What", "너는 엄마 생신을 위해 무엇을 할 거니?"),
    ("( Which / What ) is more delicious, pasta or pizza?", ["Which", "What"], "Which", "파스타와 피자 중에서 어느 것이 더 맛있니?"),
    ("( What / Which ) looks better, a red coat or a black coat?", ["What", "Which"], "Which", "빨간색 외투와 검은색 외투 중에서 어느 것이 더 좋아 보이니?"),
    ("( What / Which ) did he eat, steak or spaghetti?", ["What", "Which"], "Which", "그는 스테이크와 스파게티 중에서 어느 것을 먹었니?"),
    ("( Who / What ) is the prettiest girl in your class?", ["Who", "What"], "Who", "너희 반에서 가장 예쁜 여자아이는 누구니?"),
    ("( Who / Which ) did she meet yesterday?", ["Who", "Which"], "Who", "그녀는 어제 누구를 만났니?"),
    ("( What / Who ) will you invite to your party?", ["What", "Who"], "Who", "너는 네 파티에 누구를 초대할 거니?"),
]
I_B = "B. 다음 문장에서 밑줄 친 부분의 알맞은 우리말 뜻을 골라 동그라미 하세요."
walk1_b = [
    ("What is in the box?  (밑줄: What)", ["무엇이", "무엇을"], "무엇이"),
    ("What does he want for lunch?  (밑줄: What)", ["무엇이", "무엇을"], "무엇을"),
    ("Which do you want, milk or juice?  (밑줄: Which)", ["어느 것이", "어느 것을"], "어느 것을"),
    ("Who will you invite?  (밑줄: Who)", ["누가", "누구를"], "누구를"),
    ("Who helps you with your homework?  (밑줄: Who)", ["누가", "누구를"], "누가"),
]
items = [mc2("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_A, en, ch, ans, ko) for i, (en, ch, ans, ko) in enumerate(walk1_a)]
items += [mc2("b%02d" % (i + 1), "B", "B%d" % (i + 1), I_B, en, ch, ans) for i, (en, ch, ans) in enumerate(walk1_b)]
files["walk1"] = practice("g3:u01:walk1", "Grammar Walk — Lesson 01", "의문사 what, which, who (p. 11)", "11", 10, items)

# ---------------- Grammar Walk — Lesson 02 (p.13) ----------------
walk2 = [
    ("( When / Where ) did he leave?", ["When", "Where"], "When", "그는 언제 떠났니?"),
    ("( When / Where ) does your school begin?", ["When", "Where"], "When", "너희 학교는 언제 시작하니?"),
    ("( Why / When ) will the train arrive?", ["Why", "When"], "When", "그 기차는 언제 도착할까?"),
    ("( When / Where ) are you going?", ["When", "Where"], "Where", "너는 어디에 가고 있니?"),
    ("( Why / Where ) does Taylor's puppy sleep?", ["Why", "Where"], "Where", "테일러의 강아지는 어디에서 자니?"),
    ("( Where / How ) did you buy your shoes?", ["Where", "How"], "Where", "너는 네 신발을 어디에서 샀니?"),
    ("( Where / When ) are your gloves?", ["Where", "When"], "Where", "네 장갑은 어디에 있니?"),
    ("( Why / How ) is your mother doing?", ["Why", "How"], "How", "너희 어머니는 어떻게 지내시니?"),
    ("( When / How ) can I get to the post office?", ["When", "How"], "How", "우체국에 어떻게 갈 수 있니?"),
    ("( How / When ) do you spell your name?", ["How", "When"], "How", "네 이름의 철자를 어떻게 쓰니?"),
    ("( How / Why ) was your day today?", ["How", "Why"], "How", "오늘 네 하루는 어땠니?"),
    ("( Why / How ) was Jeremy late for the violin lesson?", ["Why", "How"], "Why", "제러미는 바이올린 교습에 왜 늦었니?"),
    ("( Why / When ) were you angry this morning?", ["Why", "When"], "Why", "너는 오늘 아침에 왜 화가 났니?"),
    ("( Where / Why ) did you call me last night?", ["Where", "Why"], "Why", "너는 어젯밤에 왜 내게 전화했니?"),
    ("( How / Why ) must we wear school uniforms?", ["How", "Why"], "Why", "우리는 왜 교복을 입어야 하니?"),
]
items = [mc2("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_A, en, ch, ans, ko) for i, (en, ch, ans, ko) in enumerate(walk2)]
files["walk2"] = practice("g3:u01:walk2", "Grammar Walk — Lesson 02", "의문사 when, where, why, how (p. 13)", "13", 10, items)

# ---------------- Grammar Run (pp.14–15) ----------------
I_RA = "A. 다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요."
run_a = [
    ("Where _____ the post office?", ["is", "are"], "is"),
    ("What _____ that in your hand?", ["is", "are"], "is"),
    ("Why _____ they so excited?", ["is", "are"], "are"),
    ("How _____ the weather now?", ["is", "are"], "is"),
    ("How _____ Paul go to the library?", ["do", "does"], "does"),
    ("Where _____ Tina have lunch?", ["does", "do"], "does"),
    ("Why _____ babies cry?", ["do", "does"], "do"),
    ("Who _____ you know?", ["do", "does"], "do"),
    ("What _____ do after school?", ["you will", "will you"], "will you"),
    ("Who _____ miss the most?", ["will she", "she will"], "will she"),
    ("When _____ see you again?", ["can I", "I can"], "can I"),
    ("Why _____ leave now?", ["you must", "must you"], "must you"),
    ("What _____ in the cave?", ["live", "lives"], "lives"),
    ("Who _____ the flowers?", ["water", "waters"], "waters"),
    ("Which _____ first, the chicken or the egg?", ["comes", "come"], "comes"),
]
I_RB = "B. 다음 대화의 빈칸에 알맞은 말을 쓰세요."
run_b = [
    ("A: _____ is your favorite color?\nB: It is pink.", "What"),
    ("A: _____ did Edison invent?\nB: He invented the light bulb.", "What"),
    ("A: _____ do you like better, pizza or hamburgers?\nB: I like hamburgers better.", "Which"),
    ("A: _____ will you call tomorrow?\nB: I will call Bella.", "Who"),
    ("A: _____ took this photo?\nB: My dad took it.", "Who"),
    ("A: _____ is your birthday?\nB: It is February 17th.", "When"),
    ("A: _____ is the library?\nB: It's on Sun Street.", "Where"),
    ("A: _____ should we play badminton?\nB: You should play badminton in the yard.", "Where"),
    ("A: _____ was the cake?\nB: It was delicious.", "How"),
    ("A: _____ does Tommy go to school?\nB: He goes to school on foot.", "How"),
    ("A: _____ do you like Ted?\nB: Because he is kind.", "Why"),
    ("A: _____ was Lily late for school?\nB: Because she missed the bus.", "Why"),
]
items = [mc2("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_RA, en, ch, ans) for i, (en, ch, ans) in enumerate(run_a)]
items += [fill("b%02d" % (i + 1), "B", "B%d" % (i + 1), I_RB, en, [ans]) for i, (en, ans) in enumerate(run_b)]
files["run"] = practice("g3:u01:run", "Grammar Run", "의문사 있는 의문문 (pp. 14–15)", "14–15", 18, items)

# ---------------- Grammar Jump (pp.16–17) ----------------
I_JA = "A. 다음 문장의 밑줄 친 부분을 주어진 말로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요."
jump_a = [
    ("When are you free? ( Jimmy )   [밑줄: you]\n_____ _____ _____ free?", [["When", "is", "Jimmy"]]),
    ("Where is the festival taking place? ( the games )   [밑줄: the festival]\n_____ _____ _____ _____ taking place?", [["Where", "are", "the", "games"]]),
    ("How is your grandmother doing? ( you )   [밑줄: your grandmother]\n_____ _____ _____ doing?", [["How", "are", "you"]]),
    ("Why is the boy laughing? ( the students )   [밑줄: the boy]\n_____ _____ _____ _____ laughing?", [["Why", "are", "the", "students"]]),
    ("Who do you want to meet? ( he )   [밑줄: you]\n_____ _____ _____ want to meet?", [["Who", "does", "he"]]),
    ("How do they go to school? ( Kevin )   [밑줄: they]\n_____ _____ _____ go to school?", [["How", "does", "Kevin"]]),
    ("What does your father do? ( your parents )   [밑줄: your father]\n_____ _____ _____ _____ do?", [["What", "do", "your", "parents"]]),
    ("What does an elephant eat? ( elephants )   [밑줄: an elephant]\n_____ _____ _____ eat?", [["What", "do", "elephants"]]),
    ("Where does she live? ( you )   [밑줄: she]\n_____ _____ _____ live?", [["Where", "do", "you"]]),
    ("Why does Mary wear black all the time? ( they )   [밑줄: Mary]\n_____ _____ _____ wear black all the time?", [["Why", "do", "they"]]),
    ("Which should we order, pizza or hot dogs? ( Helen )   [밑줄: we]\n_____ _____ _____ order, pizza or hot dogs?", [["Which", "should", "Helen"]]),
    ("Who will you invite? ( she )   [밑줄: you]\n_____ _____ _____ invite?", [["Who", "will", "she"]]),
]
I_JB = "B. 다음 문장의 빈칸에 알맞은 말을 쓰세요. 주어진 말이 있으면 주어진 말을 사용해서 쓰세요."
jump_b = [
    ("_____ _____ you looking for?", "너는 무엇을 찾고 있니?", [["What", "are"]]),
    ("_____ _____ Thanksgiving Day?", "추수 감사절은 언제니?", [["When", "is"]]),
    ("_____ _____ you last night?", "너는 어젯밤에 어디에 있었니?", [["Where", "were"]]),
    ("_____ _____ you want for dinner?", "너는 저녁 식사로 무엇을 원하니?", [["What", "do"]]),
    ("_____ _____ she need the costume?", "그녀는 왜 그 의상이 필요하니?", [["Why", "does"]]),
    ("_____ _____ your school end?", "너희 학교는 언제 끝나니?", [["When", "does"]]),
    ("_____ _____ Sam bake cookies?", "샘은 과자를 어떻게 굽니?", [["How", "does"]]),
    ("_____ _____ it rain?", "비가 언제 왔니?", [["When", "did"]]),
    ("_____ _____ she learn taekwondo?", "그녀는 어디에서 태권도를 배울 수 있니?", [["Where", "can"]]),
    ("_____ _____ give me chocolates tomorrow?", "누가 내일 내게 초콜릿을 줄까?", [["Who", "will"]]),
    ("_____ _____ I find the needle on the beach?", "나는 해변에서 바늘을 어떻게 찾을 수 있니?", [["How", "can"]]),
    ("_____ _____ dive deeper, a whale or a dolphin?", "고래와 돌고래 중에서 어느 것이 더 깊이 잠수할 수 있니?", [["Which", "can"]]),
    ("_____ _____ in the car? ( be )", "그 차 안에 누가 있니?", [["Who", "is"]]),
    ("_____ _____ better, this cap or that cap? ( look )", "이 모자와 저 모자 중에서 어느 것이 더 좋아 보이니?", [["Which", "looks"]]),
    ("_____ _____ this photo? ( take )", "누가 이 사진을 찍었니?", [["Who", "took"]]),
]
items = [fill("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_JA, en, multi(ans), blanks=len(ans[0])) for i, (en, ans) in enumerate(jump_a)]
items += [fill("b%02d" % (i + 1), "B", "B%d" % (i + 1), I_JB, en, multi(ans), blanks=2, ko=ko) for i, (en, ko, ans) in enumerate(jump_b)]
files["jump"] = practice("g3:u01:jump", "Grammar Jump", "의문사 있는 의문문 (pp. 16–17)", "16–17", 25, items)

# ---------------- Grammar Fly (pp.18–19) ----------------
I_FA = "A. 주어진 말을 사용하여 다음 대화를 완성하세요."
fly_a = [
    ("A: _____ _____ your best friend? ( who, be )\nB: Mike is my best friend.", [["Who", "is"]]),
    ("A: _____ _____ the movie? ( how, be )\nB: It was boring.", [["How", "was"]]),
    ("A: _____ _____ you _____ Jack? ( why, hate )\nB: Because he is rude.", [["Why", "do", "hate"]]),
    ("A: _____ _____ you _____ to be? ( what, want )\nB: I want to be a famous singer.", [["What", "do", "want"]]),
    ("A: _____ _____ your mom _____ to work? ( how, go )\nB: She goes to work by car.", [["How", "does", "go"]]),
    ("A: _____ _____ they _____ a party? ( where, have )\nB: They had a party at Jessica's house.", [["Where", "did", "have"]]),
    ("A: _____ _____ your uncle _____ the photo? ( when, take )\nB: He took it ten years ago.", [["When", "did", "take"]]),
    ("A: _____ _____ you _____ this weekend? ( what, do, will )\nB: I will go to the movies.", [["What", "will", "do"]]),
    ("A: _____ _____ we _____ quiet in class? ( why, be, should )\nB: Because we should listen carefully to our teacher.", [["Why", "should", "be"]]),
    ("A: _____ _____ Elsa _____? ( where, stay, will )\nB: She will stay at the City Hotel.", [["Where", "will", "stay"]]),
    ("A: _____ _____ bigger, an elephant or a bear? ( which, be )\nB: An elephant is bigger.", [["Which", "is"]]),
    ("A: _____ _____ the bathroom? ( who, clean )\nB: Dad cleans it.", [["Who", "cleans"]]),
]
I_FB = "B. 주어진 말을 바르게 배열하여 문장을 쓰세요."
fly_b = [
    ("( is / when / Mother's Day / ? )", "어머니의 날은 언제니?", ["When is Mother's Day?"]),
    ("( upset / you / are / why / ? )", "너는 왜 속상하니?", ["Why are you upset?"]),
    ("( you / need / what / do / ? )", "너는 무엇이 필요하니?", ["What do you need?"]),
    ("( call / he / who / did / yesterday / ? )", "그는 어제 누구에게 전화했니?", ["Who did he call yesterday?"]),
    ("( did / you / when / meet / Anna / ? )", "너는 언제 애나를 만났니?", ["When did you meet Anna?"]),
    ("( Louis / where / come from / did / ? )", "루이스는 어디에서 왔니?", ["Where did Louis come from?"]),
    ("( the ring / you / how / find / did / ? )", "너는 어떻게 그 반지를 찾았니?", ["How did you find the ring?"]),
    ("( will / draw / in the sketchbook / what / you / ? )", "너는 그 스케치북에 무엇을 그릴 거니?", ["What will you draw in the sketchbook?"]),
    ("( must / leave now / why / she / ? )", "그녀는 왜 지금 떠나야 하니?", ["Why must she leave now?"]),
    ("( behind the door / who / is / ? )", "누가 문 뒤에 있니?", ["Who is behind the door?"]),
    ("( flies higher / an eagle or a hawk / which / , / ? )", "독수리와 매 중에서 어느 것이 더 높이 나니?", ["Which flies higher, an eagle or a hawk?"]),
    ("( solve / who / this problem / can / ? )", "누가 이 문제를 풀 수 있니?", ["Who can solve this problem?"]),
]
items = [fill("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_FA, en, multi(ans), blanks=len(ans[0])) for i, (en, ans) in enumerate(fly_a)]
items += [sentence("b%02d" % (i + 1), "B", "B%d" % (i + 1), I_FB, en, sent_variants(*ans), ko=ko) for i, (en, ko, ans) in enumerate(fly_b)]
files["fly"] = practice("g3:u01:fly", "Grammar Fly", "대화 완성 & 문장 배열 (pp. 18–19)", "18–19", 28, items)

# ---------------- Grammar & Writing (pp.20–21) ----------------
I_WA = "A. [정보 활용하기] 제니가 지난 일요일에 찍은 사진입니다. 사진을 보고, 친구와 제니의 대화를 완성하세요."
wr_a = [
    ("( who, meet )\nA: _______________ last Sunday?\nB: I met my uncle.  [사진: 전화하는 남자]", ["Who did you meet", "Who did you meet last Sunday?"]),
    ("( where, go )\nA: _______________?\nB: I went to the stadium.  [사진: 야구 경기장]", ["Where did you go?"]),
    ("( why, go )\nA: _______________ there?\nB: Because there was a baseball game.  [사진: 야구 경기]", ["Why did you go", "Why did you go there?"]),
    ("( what, do )\nA: _______________ after the game?\nB: I went to a pizzeria.  [사진: 피자 가게]", ["What did you do", "What did you do after the game?"]),
    ("( which, order )\nA: _______________, a cheese pizza or a pepperoni pizza?\nB: I ordered a cheese pizza.  [사진: 치즈 피자]", ["Which did you order", "Which did you order, a cheese pizza or a pepperoni pizza?"]),
    ("( how, be )\nA: _______________ it?\nB: It was delicious.  [사진: 피자를 먹는 제니]", ["How was", "How was it?"]),
]
I_WB = ("B. [정보 활용하기] 다음은 에릭의 학교 게시판에 붙은 학급 행사 광고입니다. 광고를 보고, 주어진 말을 바르게 배열하여 에릭과 수리의 대화를 완성하세요."
        "\n[광고] Cookie Sale — Ms. Lee's class will sell sweet sugar cookies! When: Friday 1:00–3:00 p.m. / Where: School cafeteria")
wr_b = [
    ("( is / what / this week's event / ? )\nSuri: _______________\nEric: Cookie Sale.", ["What is this week's event?"]),
    ("( will / sell cookies / who / ? )\nSuri: _______________\nEric: Ms. Lee and her students.", ["Who will sell cookies?"]),
    ("( will / which / they / sell )\nSuri: _______________, butter cookies or sugar cookies?\nEric: They will sell sugar cookies.", ["Which will they sell", "Which will they sell, butter cookies or sugar cookies?"]),
    ("( is / when / the cookie sale / ? )\nSuri: _______________\nEric: It's from 1 to 3 p.m. on Friday.", ["When is the cookie sale?"]),
    ("( will / where / they / sell cookies / ? )\nSuri: _______________\nEric: At the school cafeteria.", ["Where will they sell cookies?"]),
    ("( will / why / they / sell cookies / ? )\nSuri: _______________\nEric: Because they need money for a class library.", ["Why will they sell cookies?"]),
]
items = [sentence("a%02d" % (i + 1), "A", "A%d" % (i + 1), I_WA, en, sent_variants(*ans)) for i, (en, ans) in enumerate(wr_a)]
items += [sentence("b%02d" % (i + 1), "B", "B%d" % (i + 1), I_WB, en, sent_variants(*ans)) for i, (en, ans) in enumerate(wr_b)]
files["writing"] = practice("g3:u01:writing", "Grammar & Writing", "사진/광고 보고 대화 완성 (pp. 20–21)", "20–21", 20, items)

# ---------------- Unit Test 01 (pp.22–26) ----------------
CIRC = "①②③④⑤"
def tmc(n, instr, en, choices, ans_num, ko=None):
    return {"id": "q%02d" % n, "label": str(n), "type": "mc",
            "promptKo": instr + (("\n" + ko) if ko else ""), "promptEn": en,
            "choices": choices, "answer": str(ans_num), "accept": [str(ans_num), CIRC[ans_num - 1]]}
WH5 = ["What", "Who", "Which", "Where", "How"]
t = []
t.append(tmc(1, "[1-2] 다음 문장의 빈칸에 알맞은 말을 고르세요.", "_____ is cheaper, this one or that one?", WH5, 3, "이것과 저것 중에서 어느 것이 더 싸니?"))
t.append(tmc(2, "[1-2] 다음 문장의 빈칸에 알맞은 말을 고르세요.", "_____ are you from?", WH5, 4, "너는 어디 출신이니?"))
t.append(tmc(3, "[3-4] 다음 문장에서 밑줄 친 우리말을 영어로 바르게 옮긴 것을 고르세요.", "[제이미는 무엇을 요리했니] for dinner?",
             ["What did Jamie cooks", "What does Jamie cook", "What Jamie did cook", "What is Jamie cook", "What did Jamie cook"], 5))
t.append(tmc(4, "[3-4] 다음 문장에서 밑줄 친 우리말을 영어로 바르게 옮긴 것을 고르세요.", "[누가 풀 수 있니] this problem?",
             ["Who solve can", "Who can solve", "Who did solve", "Who solves", "Who is solve"], 2))
t.append(tmc(5, "다음 중 올바른 문장을 고르세요.", "",
             ["Where your dog sleeps?", "When your birthday is?", "What did you had for lunch?", "How did you opened the door?", "Which dives deeper, a whale or a dolphin?"], 5))
t.append(tmc(6, "[6-7] 다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", "(밑줄: does)",
             ["Where does she live?", "Why does he wear a cap?", "How does you spell your name?", "What does your father do?", "When does your school begin?"], 3))
t.append(tmc(7, "[6-7] 다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", "(밑줄: can I / will they / do you / we must / can I)",
             ["What can I do for you?", "When will they leave?", "Which do you want, milk or juice?", "Why we must wear school uniforms?", "How can I find my needle?"], 4))
t.append(tmc(8, "[8-9] 다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", "How did Mr. White drive?",
             ["Yes, he was.", "No, he wasn't.", "Last month.", "Because he was fast.", "Carefully."], 5))
t.append(tmc(9, "[8-9] 다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", "Why is she laughing?",
             ["Yes, she is.", "No, she isn't.", "She talked to her brother.", "Because she is reading a funny story.", "She is laughing."], 4))
t.append(tmc(10, "다음 중 짝지어진 대화가 어색한 것을 고르세요.", "",
             ["A: Who gave you the pencils? / B: Tony gave them to me.", "A: Where does he have lunch? / B: At the cafeteria.",
              "A: How do you go to school? / B: I'm going to school.", "A: What did he invent? / B: He invented the light bulb.",
              "A: Why was she crying? / B: Because she watched a sad movie."], 3))
t.append(tmc(11, "[11-12] 다음 우리말을 영어로 바르게 옮긴 것을 고르세요.", "너는 그 가방을 어디에서 샀니?",
             ["Where you bought the bag?", "Where did you bought the bag?", "Where do you buy the bag?", "Where did you buy the bag?", "Where bought you the bag?"], 4))
t.append(tmc(12, "[11-12] 다음 우리말을 영어로 바르게 옮긴 것을 고르세요.", "그녀가 언제 도착할까?",
             ["When she will arrive?", "When will she arrive?", "When will she arrives?", "When is she arrive?", "When she arrives?"], 2))
t.append(tmc(13, "[13-14] 다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.",
             "• _____ was the party? (그 파티는 어땠니?)\n• _____ did he invite? (그는 누구를 초대했니?)",
             ["Who – How", "Who – Why", "How – Who", "What – Who", "How – What"], 3))
t.append(tmc(14, "[13-14] 다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.",
             "• _____ is your favorite color? (네가 특히 좋아하는 색은 무엇이니?)\n• _____ do you like better, green or red? (초록색과 빨간색 중에서 너는 어느 것을 더 좋아하니?)",
             ["How – What", "Where – Which", "What – Who", "What – Which", "When – Who"], 4))
I15 = "[15-17] 다음 대화의 빈칸에 알맞은 말을 고르세요."
t.append({"id": "q15", "label": "15", "type": "mc", "promptKo": I15, "promptEn": "A: Which is bigger, an eagle ( or / and ) a hawk?\nB: An eagle is bigger.", "choices": ["or", "and"], "answer": "1", "accept": ["or"]})
t.append({"id": "q16", "label": "16", "type": "mc", "promptKo": I15, "promptEn": "A: Why was he late for school?\nB: ( And / Because ) he missed the bus.", "choices": ["And", "Because"], "answer": "2", "accept": ["Because"]})
t.append({"id": "q17", "label": "17", "type": "mc", "promptKo": I15, "promptEn": "A: ( What / Who ) does Mr. Davis teach?\nB: He teaches English.", "choices": ["What", "Who"], "answer": "1", "accept": ["What"]})
I18 = "[18-20] 다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요."
t.append({"id": "q18", "label": "18", "type": "fill", "promptKo": I18 + "\n우리 언제 만날까? ( meet )", "promptEn": "_____ shall _____ _____?", "blanks": 3, "accept": multi([["When", "we", "meet"]])})
t.append({"id": "q19", "label": "19", "type": "fill", "promptKo": I18 + "\n이 모자와 저 모자 중에서 어느 것이 더 좋아 보이니? ( look )", "promptEn": "_____ _____ better, this cap or that cap?", "blanks": 2, "accept": multi([["Which", "looks"]])})
t.append({"id": "q20", "label": "20", "type": "fill", "promptKo": I18 + "\n그녀는 누구를 가장 좋아하니? ( like )", "promptEn": "Who _____ _____ _____ the most?", "blanks": 3, "accept": multi([["does", "she", "like"]])})
I21 = "[21-25] 주어진 말을 바르게 배열하여 문장을 쓰세요."
t21 = [
    ("( can / I / how / find / the needle / ? )", "나는 어떻게 바늘을 찾을 수 있니?", "How can I find the needle?"),
    ("( he / did / take / when / this photo / ? )", "그는 이 사진을 언제 찍었니?", "When did he take this photo?"),
    ("( Chris / why / angry / was / this morning / ? )", "크리스는 오늘 아침에 왜 화가 났니?", "Why was Chris angry this morning?"),
    ("( where / the game / did / take place / ? )", "그 경기는 어디에서 열렸니?", "Where did the game take place?"),
    ("( what / you / will / do / after school / ? )", "너는 방과 후에 무엇을 할 거니?", "What will you do after school?"),
]
for k, (en, ko, ans) in enumerate(t21):
    n = 21 + k
    t.append({"id": "q%02d" % n, "label": str(n), "type": "sentence", "promptKo": I21 + "\n" + ko, "promptEn": en, "accept": sent_variants(ans)})
files["unit-test-01"] = practice("g3:u01:quiz", "Unit Test 01", "의문사 있는 의문문 (1) (pp. 22–26)", "22–26", 30, t,
                                 testId="unit-test-01", passPct=80, retryBelowPct=50, showAnswersToStudent=False)

# ---------------- Wrap Up (p.27) ----------------
wrap = [
    ("1", "1-①", "1. 의문사 what, which, who", "① what은 '무엇', [ 1 ]는 '어느 것', [ 2 ]는 '누구'를 묻는 의문사이다.  → [ 1 ]", ["which"]),
    ("1", "1-②", "1. 의문사 what, which, who", "① what은 '무엇', [ 1 ]는 '어느 것', [ 2 ]는 '누구'를 묻는 의문사이다.  → [ 2 ]", ["who"]),
    ("1", "1-③", "1. 의문사 what, which, who", "③ 일반동사나 조동사가 쓰인 문장은 「의문사+do동사/조동사+주어+[ 3 ] ~?」으로 쓴다.  → [ 3 ]", ["동사원형", "동사 원형", "동사의 원형", "base verb", "base form"]),
    ("2", "2-①", "2. 의문사 when, where, why, how", "① [ 1 ]은 언제, where는 어디, why는 이유, [ 2 ]는 상태나 방법을 묻는 의문사이다.  → [ 1 ]", ["when"]),
    ("2", "2-②", "2. 의문사 when, where, why, how", "① [ 1 ]은 언제, where는 어디, why는 이유, [ 2 ]는 상태나 방법을 묻는 의문사이다.  → [ 2 ]", ["how"]),
    ("2", "2-③", "2. 의문사 when, where, why, how", "③ 일반동사나 조동사가 쓰인 문장은 「의문사+do동사/조동사+[ 3 ]+동사원형 ~?」으로 쓴다.  → [ 3 ]", ["주어", "subject"]),
]
items = [{"id": "w%02d" % (i + 1), "section": s, "label": lab, "type": "fill", "promptKo": "Wrap Up — " + ko, "promptEn": en, "blanks": 1, "accept": acc}
         for i, (s, lab, ko, en, acc) in enumerate(wrap)]
files["wrap"] = practice("g3:u01:wrap", "Wrap Up", "Unit 01 summary fill-ins (p. 27)", "27", 8, items)

# ---------------- Check Up (p.27) ----------------
I_C = "Check Up — 그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (where / what / how / which)"
chk = [
    ("[그림 1] 엄마가 휴대 전화를 찾으며 가방을 뒤진다.\n_____ is my cell phone?", "Where"),
    ("[그림 2]\nGirl: _____ are you looking for?\nMom: My cell phone.", "What"),
    ("[그림 3]\nMom: _____ can I find it?\nGirl: I have an idea.", "How"),
    ("[그림 4] 친구가 검은색·흰색 휴대 전화 두 개를 들고 있다.\nFriend: _____ is yours, black one or white one?\nMom: The white one is mine.", "Which"),
]
items = [{"id": "c%02d" % (i + 1), "label": str(i + 1), "type": "fill", "promptKo": I_C, "promptEn": en, "blanks": 1, "accept": [a]} for i, (en, a) in enumerate(chk)]
files["checkup"] = practice("g3:u01:checkup", "Check Up", "Comic dialogue blanks (p. 27)", "27", 6, items, wordBank=["where", "what", "how", "which"])

for name, d in files.items():
    with open(os.path.join(OUT, name + ".json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(name, d["practiceId"], len(d["items"]), "items", d["timerMinutes"], "min")
