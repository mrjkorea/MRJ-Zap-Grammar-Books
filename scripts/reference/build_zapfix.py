# reference only; JSON is source of truth
"""Rebuild GreenZap 1 + GreenZap 3 Unit 01 practice data with book sections.
Every item carries: section, sectionTitle, sectionInstructionKo, answerMode, label.
Book examples (answer printed in the book) are kept as display-only cards
(example:true, displayOnly:true) so numbering matches the book but they are not graded.
Sources: GZ1 = Drive zap-green1/units/unit-01/charts p0012-p0028 (page images);
GZ3 = Drive ZAPgreen03 text + zap-green3 page images/pages/*.md.
"""
import json, os, re, itertools, copy

HERE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(HERE, "live")
OUT1 = os.path.join(HERE, "data", "green1", "unit01")
OUT3 = os.path.join(HERE, "data", "green3", "unit01")
for d in (OUT1, OUT3):
    os.makedirs(d, exist_ok=True)

# ---------- typing rules ----------
R_PICK = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
R_BANK = "상자 안의 말 중에서 알맞은 말을 골라 그 단어만 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORD1 = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORD2 = "빈칸 두 개에 들어갈 말을 각각 쓰세요. 한 칸에 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORDN = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
R_SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)"
MODE_TAG = {"choice": "Choose · 고르기", "words": "Words only · 빈칸 말만", "sentence": "Full sentence · 문장 전체"}
BANK_TAG = "Choose & type the word · 골라서 그 단어만 쓰기"   # choice mode on a typed (word-box) item
MODE_KO = {"choice": "고르기", "words": "빈칸 말만 쓰기", "sentence": "문장 전체 쓰기"}

# ---------- accept helpers ----------
PAIRS = [("is not", "isn't"), ("are not", "aren't"), ("do not", "don't"), ("does not", "doesn't"),
         ("i am", "i'm"), ("we are", "we're"), ("they are", "they're"), ("you are", "you're"),
         ("he is", "he's"), ("she is", "she's"), ("it is", "it's"), ("what is", "what's"),
         ("who is", "who's"), ("when is", "when's"), ("where is", "where's"), ("how is", "how's"),
         ("that is", "that's"), ("we're not", "we aren't"), ("they're not", "they aren't"),
         ("you're not", "you aren't"), ("he's not", "he isn't"), ("she's not", "she isn't"),
         ("it's not", "it isn't")]

def sentence_accept(*sents):
    """Full-sentence answers: original + no-comma + contraction<->full variants.
    (normalize.js already ignores case, end punctuation, extra spaces, curly quotes.)"""
    out, seen = [], set()
    def add(s):
        s = re.sub(r"\s+", " ", s).strip()
        k = s.lower().rstrip(".?!")
        if s and k not in seen:
            seen.add(k); out.append(s)
    for s in sents:
        add(s)
        frontier = [s.lower()]
        allv = {s.lower()}
        while frontier and len(allv) < 40:
            cur = frontier.pop()
            for a, b in PAIRS:
                for x, y in ((a, b), (b, a)):
                    pat = re.compile(r"(?<![\w'])" + re.escape(x) + r"(?![\w'])")
                    if pat.search(cur):
                        nv = pat.sub(y, cur, count=1)
                        if nv not in allv:
                            allv.add(nv); frontier.append(nv)
        for v in sorted(allv):
            add(v)
        for v in list(allv):
            if "," in v:
                add(v.replace(",", ""))
    return out

def perm_accept(*slots):
    """slots: list of alternatives per interchangeable blank, e.g. ["am"],["are"],["is"] -> all orders."""
    res = []
    for order in itertools.permutations(slots):
        for combo in itertools.product(*order):
            p = "|".join(combo)
            if p not in res:
                res.append(p)
    return res

# ---------- builders ----------
def S(sid, title, direction, rule, mode):
    return {"id": sid, "title": title, "directionKo": direction, "ruleKo": rule,
            "instructionKo": (direction + " " + rule).strip(), "answerMode": mode}

def MC(label, en, choices, ans, ko=None, ex=False, **kw):
    acc = ans if isinstance(ans, list) else [ans]
    acc = [a for a in acc if a in choices] + [a for a in acc if a not in choices]  # exact choice text first
    it = {"label": label, "type": "mc", "promptEn": en, "choices": choices, "accept": acc}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

def FILL(label, en, accept, blanks=1, ko=None, ex=False, **kw):
    it = {"label": label, "type": "fill", "promptEn": en, "blanks": blanks,
          "accept": accept if isinstance(accept, list) else [accept]}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

def SENT(label, en, answers, ko=None, ex=False, **kw):
    answers = answers if isinstance(answers, list) else [answers]
    it = {"label": label, "type": "sentence", "promptEn": en, "accept": sentence_accept(*answers)}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

def example_answer(it):
    a = it["accept"][0]
    if it["type"] == "mc" and re.fullmatch(r"\d", a):
        return it["choices"][int(a) - 1]
    return a.replace("|", " / ")

def finish(meta, groups, idfmt):
    """groups: [(sectionDict, [items])]. idfmt(sectionId, n) -> item id."""
    items, sections = [], []
    for sec, its in groups:
        graded = 0; examples = 0
        for n, it in enumerate(its, 1):
            it = dict(it)
            it["id"] = idfmt(sec["id"], n)
            it["section"] = sec["id"]
            it["sectionTitle"] = sec["title"]
            it["sectionInstructionKo"] = sec["instructionKo"]
            it.setdefault("answerMode", sec["answerMode"])
            it["answerModeTag"] = BANK_TAG if (it["answerMode"] == "choice" and it["type"] != "mc") else MODE_TAG[it["answerMode"]]
            if it.get("example"):
                it["displayOnly"] = True
                it["exampleAnswer"] = example_answer(it)
                examples += 1
            else:
                graded += 1
            # stable key order
            order = ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "answerModeTag",
                     "label", "example", "displayOnly", "exampleAnswer", "type", "promptKo", "promptEn",
                     "choices", "blanks", "accept", "answer", "noteKo"]
            it = {k: it[k] for k in order if k in it} | {k: v for k, v in it.items() if k not in order}
            items.append(it)
        s = {"id": sec["id"], "title": sec["title"], "instructionKo": sec["instructionKo"],
             "directionKo": sec["directionKo"], "ruleKo": sec["ruleKo"], "answerMode": sec["answerMode"],
             "answerModeTag": (BANK_TAG if any(i["type"] != "mc" for i in its) and sec["answerMode"] == "choice" else MODE_TAG[sec["answerMode"]]), "itemCount": graded, "exampleCount": examples,
             "labels": [i["label"] for i in items if i["section"] == sec["id"] and not i.get("example")]}
        modes = sorted({i["answerMode"] for i in items if i["section"] == sec["id"] and not i.get("example")})
        if len(modes) > 1:
            s["mixedModes"] = modes
        sections.append(s)
    parts = []
    for s in sections:
        m = " + ".join(MODE_KO[x] for x in s.get("mixedModes", [s["answerMode"]]))
        parts.append(f"{s['title']} {s['itemCount']}문항({m})")
    intro = "이 연습은 " + ", ".join(parts) + "으로 되어 있어요."
    if any(s["exampleCount"] for s in sections):
        intro += " 회색 '예시' 문제는 책에 답이 나와 있는 예시라서 채점하지 않아요."
    intro += " 각 섹션 맨 위의 안내를 읽고, '빈칸 말만'이면 빈칸에 들어갈 말만, '문장 전체'면 문장 전체를 쓰세요."
    d = dict(meta)
    d["sectionsVersion"] = 2
    d["introKo"] = intro
    d["sections"] = sections
    d["items"] = items
    return d

def letter_id(sid, n):
    return f"{sid.lower()}{n:02d}"

def write(out, name, d):
    with open(os.path.join(out, name), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2); f.write("\n")

def live(book, name):
    return json.load(open(os.path.join(LIVE, book, name), encoding="utf-8"))

def meta_of(d):
    return {k: v for k, v in d.items() if k not in ("items", "sections", "introKo", "sectionsVersion")}

# =====================================================================
# GREENZAP 1 — Unit 01 현재 시제 (printed pp. 11–27 = PDF p0012–p0028)
# =====================================================================
g1 = {}

# --- Walk L01 (p.11): Section A 1–15, A1 example ---
d = live("green1", "walk1.json")
secA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
its = []
for n, q in enumerate(d["items"], 1):
    its.append(MC(f"A{n}", q["promptEn"], q["choices"], q["accept"], ex=(n == 1)))
d["subtitle"] = "Affirmative present (p. 11)"; d["pages"] = "11"
g1["walk1.json"] = finish(meta_of(d), [(secA, its)], letter_id)

# --- Walk L02 (p.13): A 1–9 (A1 ex), B 1–4 matching (B1 ex) ---
d = live("green1", "walk2.json")
secA = S("A", "Section A", "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
secB = S("B", "Section B", "다음 의문문에 알맞은 대답을 찾아 선으로 연결하세요.", "알맞은 대답(a~d)을 하나 골라 누르세요. (직접 쓰지 않아요.)", "choice")
A = [MC(f"A{n}", q["promptEn"], q["choices"], q["accept"], ex=(n == 1)) for n, q in enumerate(d["items"][:9], 1)]
B = [MC(f"B{n}", q["promptEn"], q["choices"], q["accept"], ex=(n == 1)) for n, q in enumerate(d["items"][9:], 1)]
d["subtitle"] = "Negatives & questions (p. 13)"; d["pages"] = "13"
g1["walk2.json"] = finish(meta_of(d), [(secA, A), (secB, B)], letter_id)

# --- Run (pp.14–15): A 1–15 (A1 ex), B 1–15 (B1 ex) ---
d = live("green1", "run.json")
secA = S("A", "Section A", "주어진 말을 사용하여 다음 문장을 완성하세요.", R_WORD1 + " 괄호 안의 말을 알맞은 형태로 바꿔 쓰세요.", "words")
secB = S("B", "Section B", "다음 문장 또는 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORD1, "words")
A = [FILL("A1", "Kate and I ________ at the fire station. ( be )", "are", ex=True)]
for n, q in enumerate(d["items"][1:15], 2):
    A.append(FILL(f"A{n}", q["promptEn"].replace("(", "( ").replace(")", " )").replace("(  ", "( ").replace("  )", " )"), q["accept"]))
ko_B = ["나는 아프지 않지만, 피곤하다.", "오늘은 비가 오지만, 춥지는 않다.", "그들은 축구는 좋아하지만, 야구는 좋아하지 않는다.",
        "그는 지금 슬프지 않다. 그는 매우 행복하다.", "우리 아버지는 커피는 드시지만 우유는 드시지 않는다.",
        "우리는 개를 두 마리 가지고 있지만, 고양이는 가지고 있지 않다.", "그녀의 할머니는 요구르트는 드시지만, 아이스크림은 드시지 않는다.",
        "너는 목이 마르니? / 아니, 그렇지 않아.", "네 여동생은 2학년이니? / 응, 그래.", "이것은 네 장갑이니? / 아니, 그렇지 않아.",
        "그는 캐나다 출신이니? / 아니, 그렇지 않아.", "그녀는 매일 학교에 걸어서 가니? / 응, 그래.",
        "네 부모님은 매일 아침 산책을 하시니? / 아니, 그러지 않으셔.", "너는 자명종이 필요하니? / 응, 그래.",
        "네 삼촌은 서울에 사시니? / 아니, 그러지 않으셔."]
B = [FILL("B1", "I'm ________ sick, but I'm tired.", "not", ko=ko_B[0], ex=True),
     FILL("B2", "It's raining today, but it ________ cold.", ["isn't", "is not"], ko=ko_B[1])]
for n, q in enumerate(d["items"][16:], 3):  # live q17..q29 = B3..B15
    B.append(FILL(f"B{n}", q["promptEn"], q["accept"], ko=ko_B[n - 1]))
d["subtitle"] = "Present tense practice (pp. 14–15)"
g1["run.json"] = finish(meta_of(d), [(secA, A), (secB, B)], letter_id)

# --- Jump (pp.16–17): A 1–12 (A1 ex) multi-blank subject+verb, B 1–12 (B1 ex) 2 blanks ---
d = live("green1", "jump.json")
secA = S("A", "Section A", "다음 밑줄 친 말을 주어진 말로 바꿔 문장을 다시 쓸 때 빈칸에 알맞은 말을 쓰세요.",
         R_WORDN + " (주어와 동사를 모두 쓰세요.)", "words")
secB = S("B", "Section B", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORD2, "words")
def jA(n, src, under, given, tail, acc, ex=False):
    k = len(acc[0].split("|"))
    blanks = " ".join(["______"] * k)
    return FILL(f"A{n}", f"{src} ( {given} )   [밑줄: {under}]\n→ {blanks} {tail}", acc, blanks=k, ex=ex)
A = [jA(1, "I am a police officer.", "I", "she", "a police officer.", ["She|is"], ex=True),
     jA(2, "He is hungry now.", "He", "I", "hungry now.", ["I|am"]),
     jA(3, "This is my pen.", "This", "these", "my pens.", ["These|are"]),
     jA(4, "That book isn't interesting.", "That book", "those books", "interesting.", ["Those|books|aren't"]),
     jA(5, "They aren't delicious apples.", "They", "it", "a delicious apple.", ["It|isn't", "It's|not"]),
     jA(6, "He isn't sad today.", "He", "Kevin and I", "sad today.", ["Kevin|and|I|aren't"]),
     jA(7, "I like horror movies.", "I", "he", "horror movies.", ["He|likes"]),
     jA(8, "Rabbits have long ears.", "Rabbits", "a rabbit", "long ears.", ["A|rabbit|has"]),
     jA(9, "The boy wants ice cream for dessert.", "The boy", "we", "ice cream for dessert.", ["We|want"]),
     jA(10, "They don't watch TV at night.", "They", "he", "watch TV at night.", ["He|doesn't"]),
     jA(11, "Ann doesn't take piano lessons.", "Ann", "we", "take piano lessons.", ["We|don't"]),
     jA(12, "Mike doesn't go to the library on Sunday.", "Mike", "they", "go to the library on Sunday.", ["They|don't"])]
B = [FILL("B1", "A: Is your dog fast?\nB: Yes, ______ ______.", ["it|is"], blanks=2, ex=True),
     FILL("B2", "A: Are they from the U.S.?\nB: No, ______ ______. They are from Canada.", ["they|aren't", "they're|not"], blanks=2),
     FILL("B3", "A: ______ there a book in the bag?\nB: No, there ______.", ["Is|isn't"], blanks=2),
     FILL("B4", "A: ______ you in the sixth grade?\nB: Yes, I ______.", ["Are|am"], blanks=2),
     FILL("B5", "A: Do you have a bike?\nB: No, ______ ______.", ["I|don't", "we|don't"], blanks=2),
     FILL("B6", "A: Does Jason usually go to bed at 10?\nB: Yes, ______ ______.", ["he|does"], blanks=2),
     FILL("B7", "A: Do you need a new printer?\nB: No, ______ ______.", ["I|don't", "we|don't"], blanks=2),
     FILL("B8", "A: Do they jump rope every morning?\nB: Yes, ______ ______.", ["they|do"], blanks=2),
     FILL("B9", "A: ______ Mary often visit her grandparents?\nB: Yes, she ______.", ["Does|does"], blanks=2),
     FILL("B10", "A: ______ your parents like flowers?\nB: Yes, they ______.", ["Do|do"], blanks=2),
     FILL("B11", "A: ______ they play computer games every day?\nB: No, they ______.", ["Do|don't"], blanks=2),
     FILL("B12", "A: ______ the girl have long hair?\nB: No, she ______. She has short hair.", ["Does|doesn't"], blanks=2)]
g1["jump.json"] = finish(meta_of(d), [(secA, A), (secB, B)], letter_id)

# --- Fly (pp.18–19): A 1–12 rewrite (A1 ex), B 1–12 unscramble (B1 ex) — full sentences ---
d = live("green1", "fly.json")
secA = S("A", "Section A", "다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.", R_SENT, "sentence")
secB = S("B", "Section B", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence")
fa = [("This is a new computer.", "부정문", ["This isn't a new computer."]),
      ("We are in the yard.", "부정문", ["We aren't in the yard."]),
      ("I am in the fifth grade.", "부정문", ["I'm not in the fifth grade."]),
      ("My father works in a bank.", "부정문", ["My father doesn't work in a bank."]),
      ("Nina and her brother drink milk.", "부정문", ["Nina and her brother don't drink milk."]),
      ("Paul's family goes to the park on Sundays.", "부정문", ["Paul's family doesn't go to the park on Sundays."]),
      ("Your uncle is strong.", "의문문", ["Is your uncle strong?"]),
      ("There are a lot of ducks in the pond.", "의문문", ["Are there a lot of ducks in the pond?"]),
      ("They live near the river.", "의문문", ["Do they live near the river?"]),
      ("She walks her dog in the afternoon.", "의문문", ["Does she walk her dog in the afternoon?"]),
      ("You play the piano after school.", "의문문", ["Do you play the piano after school?"]),
      ("Jake has new in-line skates.", "의문문", ["Does Jake have new in-line skates?"])]
A = [SENT(f"A{n}", f"{s} ( {t} )", a, ex=(n == 1)) for n, (s, t, a) in enumerate(fa, 1)]
fb = [("I / a good swimmer / am / .", "나는 수영을 잘한다.", "I am a good swimmer."),
      ("this cake / very delicious / is / .", "이 케이크는 무척 맛있다.", "This cake is very delicious."),
      ("we / every morning / jump rope / .", "우리는 아침마다 줄넘기를 한다.", "We jump rope every morning."),
      ("he / his parents / helps / on weekends / .", "그는 주말마다 자기 부모님을 돕는다.", "He helps his parents on weekends."),
      ("my mother / at home now / isn't / .", "우리 어머니는 지금 집에 계시지 않는다.", "My mother isn't at home now."),
      ("like / don't / my grandparents / cats / .", "우리 조부모님은 고양이를 좋아하시지 않는다.", "My grandparents don't like cats."),
      ("in the library / they / aren't / .", "그들은 도서관에 있지 않다.", "They aren't in the library."),
      ("have a skateboard / Bill / doesn't / .", "빌은 스케이트보드를 가지고 있지 않다.", "Bill doesn't have a skateboard."),
      ("is / in the afternoon / he / busy / ?", "그는 오후에 바쁘니?", "Is he busy in the afternoon?"),
      ("there / are / in the box / many apples / ?", "상자 안에 사과가 많이 있니?", "Are there many apples in the box?"),
      ("does / every day / read a book / she / ?", "그녀는 매일 책을 읽니?", "Does she read a book every day?"),
      ("you / do / coffee / drink / ?", "너는 커피를 마시니?", "Do you drink coffee?")]
B = [SENT(f"B{n}", f"( {w} )", a, ko=k, ex=(n == 1)) for n, (w, k, a) in enumerate(fb, 1)]
g1["fly.json"] = finish(meta_of(d), [(secA, A), (secB, B)], letter_id)

# --- Writing (pp.20–21): A 1–6 (A1 ex) verb phrase; B 1–5 (B1 ex) 4 blanks ---
d = live("green1", "writing.json")
secA = S("A", "Section A", "[그림 묘사하기] 다음은 지민이의 일과를 나타낸 그림입니다. 그림을 보고, 아래 문장의 빈칸에 알맞은 말을 쓰세요.",
         "빈칸에 들어갈 말(동사 + 뒤의 말)만 쓰세요. 주어가 3인칭 단수이니 동사 형태에 주의하세요. (문장 전체를 쓰지 마세요.)", "words")
secB = S("B", "Section B", "[표 해석하기] 준호는 여름 방학 동안 국제 캠프에 참가했습니다. 은지가 캠프에서 돌아온 준호의 수첩을 보며 세계 여러 나라의 친구들에 대해 묻고 있습니다. 표를 보고, 두 사람의 대화를 완성하세요.",
         R_WORDN + " (준호의 대답은 Yes/No, 주어, 동사를 한 칸씩 쓰세요.)", "words")
wa = [("6:30 get up", "Jimin ________ at 6:30 in the morning.", "gets up"),
      ("7:30 have breakfast", "She ________ at 7:30.", "has breakfast"),
      ("8:00 go to school", "She ________ at 8 o'clock.", "goes to school"),
      ("4:30 take ballet lessons", "She ________ at 4:30 in the afternoon.", "takes ballet lessons"),
      ("8:00 do her homework", "She ________ at 8 o'clock in the evening.", "does her homework"),
      ("10:00 go to bed", "She ________ at 10 o'clock.", "goes to bed")]
A = [FILL(f"A{n}", f"[그림: {pic}]\n{en}", [ans], ex=(n == 1)) for n, (pic, en, ans) in enumerate(wa, 1)]
TABLE = "[표] Bingbing: China · Beijing · 12살 · 애완동물 없음 / Paul: the U.S. · New York · 13살 · dog / Susan: the U.K. · London · 12살 · 애완동물 없음 / David: Canada · Vancouver · 14살 · hamster"
B = [FILL("B1", "Eunji: ______ Bingbing from China?\nJunho: Yes, she ______.", ["Is|is"], blanks=2, ko=TABLE, ex=True),
     FILL("B2", "Eunji: ______ Paul live in New York?\nJunho: ______, ______ ______.", ["Does|Yes|he|does"], blanks=4, ko=TABLE),
     FILL("B3", "Eunji: ______ Susan from the U.S.?\nJunho: ______, ______ ______. She's from the U.K.", ["Is|No|she|isn't", "Is|No|she's|not"], blanks=4, ko=TABLE),
     FILL("B4", "Eunji: ______ Susan have a pet?\nJunho: ______, ______ ______.", ["Does|No|she|doesn't"], blanks=4, ko=TABLE),
     FILL("B5", "Eunji: ______ David 13 years old?\nJunho: ______, ______ ______. He's 14 years old.", ["Is|No|he|isn't", "Is|No|he's|not"], blanks=4, ko=TABLE)]
g1["writing.json"] = finish(meta_of(d), [(secA, A), (secB, B)], letter_id)

# --- Unit Test 01 (pp.22–26): 1–25, grouped by the book's [x–y] directions ---
d = live("green1", "unit-test-01.json")
q = {i + 1: it for i, it in enumerate(d["items"])}
def utmc(n, en=None, choices=None, ko=None):
    it = q[n]
    return MC(str(n), it["promptEn"] if en is None else en, choices or it["choices"], it["accept"], ko=ko, answer=it["answer"])
G = []
G.append((S("1-2", "[1–2]", "다음 중 동사의 3인칭 단수 현재형이 잘못 짝지어진 것을 고르세요.", R_PICK, "choice"), [utmc(1), utmc(2)]))
G.append((S("3-5", "[3–5]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"), [utmc(3), utmc(4), utmc(5)]))
G.append((S("6-7", "[6–7]", "다음 문장을 부정문으로 바꿔 쓸 때 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"), [utmc(6), utmc(7)]))
G.append((S("8-9", "[8–9]", "다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", R_PICK, "choice"), [utmc(8), utmc(9)]))
G.append((S("10-11", "[10–11]", "다음 중 밑줄 친 말이 잘못된 문장을 고르세요.", R_PICK + " ([ ] 안의 말이 밑줄 친 말이에요.)", "choice"),
          [utmc(10, "", ["I'm [not] tired.", "There [is] a bird in the tree.", "Nancy and I [are] in the park.", "[Is] your parents at home now?", "[Are] those your gloves?"]),
           utmc(11, "", ["He [likes] baseball.", "[Do] you take piano lessons?", "We [doesn't] have a tent.", "They [don't] want any sandwiches.", "[Does] your sister have long hair?"])]))
G.append((S("12", "[12]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"), [utmc(12)]))
G.append((S("13-14", "[13–14]", "다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"),
          [utmc(13, "• She ________ a new student here.\n• ________ you watch TV at night?"), utmc(14, "• Suho ________ milk every day.\n• He doesn't ________ juice.")]))
G.append((S("15-16", "[15–16]", "다음 문장의 밑줄 친 부분을 바르게 고쳐 쓴 것을 고르세요.", R_PICK + " ([ ] 안의 말이 밑줄 친 부분이에요.)", "choice"),
          [utmc(15, "My mother [don't eats] ice cream."), utmc(16, "We [doesn't play] the piano at night.")]))
G.append((S("17", "[17]", "다음 중 올바른 문장을 고르세요.", R_PICK, "choice"), [utmc(17)]))
G.append((S("18-20", "[18–20]", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORD2, "words"),
          [FILL("18", "A: Do you have a cat?\nB: No, ______ ______.", ["I|don't", "we|don't"], blanks=2),
           FILL("19", "A: Does your sister like action movies?\nB: Yes, ______ ______.", ["she|does"], blanks=2),
           FILL("20", "A: ______ they police officers?\nB: ______, they aren't.", ["Are|No"], blanks=2)]))
G.append((S("21-25", "[21–25]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"),
          [FILL("21", "The boy ______ his teeth after dinner.", ["brushes"], ko="그 남자아이는 저녁 식사 후에 이를 닦는다. ( brush )"),
           FILL("22", "My parents ______ ______ in the morning.", ["don't|exercise"], blanks=2, ko="우리 부모님은 아침에 운동을 하시지 않는다. ( exercise )"),
           FILL("23", "Brian ______ ______ Canada.", ["isn't|from"], blanks=2, ko="브라이언은 캐나다 출신이 아니다. ( be from )"),
           FILL("24", "______ this pizza ______?", ["Is|delicious"], blanks=2, ko="이 피자는 맛있니? ( delicious )"),
           FILL("25", "______ ______ ______ a new bag?", ["Do|you|want"], blanks=3, ko="너는 새 가방을 원하니? ( want )")]))
for sec, its in G:
    for it in its:
        if it["type"] == "mc" and sec["id"] not in ("10-11",):
            pass
m = meta_of(d)
m = {"practiceId": "u01:quiz", "title": "Unit Test 01", "subtitle": "Unit 01 현재 시제 (pp. 22–26)", "pages": "22–26",
     "timerMinutes": d.get("timerMinutes", 15), **{k: v for k, v in m.items() if k not in ("pages",)}}
g1["unit-test-01.json"] = finish(m, G, lambda sid, n: None)
for i, it in enumerate(g1["unit-test-01.json"]["items"], 1):
    it["id"] = f"q{i:02d}"

# --- Wrap Up (p.27): 1 be동사의 현재형 (blanks 1–7), 2 일반동사의 현재형 (blanks 1–6) ---
d = live("green1", "wrap.json")
WR = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. 칸이 여러 개면 한 칸에 하나씩 쓰세요. (순서가 바뀌어도 맞아요.)"
s1 = S("1", "1. be동사의 현재형", "Unit 01에서 배운 내용을 정리하세요.", WR, "words")
s2 = S("2", "2. 일반동사의 현재형", "Unit 01에서 배운 내용을 정리하세요.", WR, "words")
W1 = [FILL("1-1~3", "", perm_accept(["am"], ["are"], ["is"]), blanks=3, ko="① be동사의 현재형에는 [1], [2], [3]가 있다."),
      FILL("1-4", "", ["isn't", "is not"], ko="② be동사 현재형의 부정형은 am not, aren't, [4]로 쓰고,"),
      FILL("1-5~7", "", perm_accept(["Am"], ["Are"], ["Is"]), blanks=3, ko="② … 의문문은 「[5] / [6] / [7] + 주어 ~?」로 쓴다.")]
W2 = [FILL("2-1~2", "", perm_accept(["-s", "s"], ["-es", "es"]), blanks=2, ko="① 일반동사의 현재형은 주어가 3인칭 단수일 때 대개 동사원형에 [1] 또는 [2]를 붙인다."),
      FILL("2-3~4", "", perm_accept(["don't"], ["doesn't"]), blanks=2, ko="② 일반동사 현재형의 부정문은 「주어 + [3] / [4] + 동사원형 ~.」으로 쓰고,"),
      FILL("2-5~6", "", perm_accept(["Do"], ["Does"]), blanks=2, ko="② … 의문문은 주어에 따라 「[5] / [6] + 주어 + 동사원형 ~?」으로 쓴다.")]
d["subtitle"] = "Unit summary fill-ins (p. 27)"; d["pages"] = "27"
g1["wrap.json"] = finish(meta_of(d), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

# --- Check Up (p.27): comic, word box do / doesn't / is / play ---
d = live("green1", "checkup.json")
sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (do / doesn't / is / play)", R_BANK, "choice")
C = [FILL("1", "[그림 1] 축구 경기를 보며\nWow, he ______ a good soccer player!", ["is"]),
     FILL("2", "[그림 2]\nGirl: ______ you ______ soccer well?\nBoy: Yes, I do.", ["Do|play"], blanks=2),
     FILL("3", "[그림 4] 넘어진 남자아이를 보며\nZack ______ play soccer well.", ["doesn't", "does not"])]
d["wordBank"] = ["do", "doesn't", "is", "play"]
g1["checkup.json"] = finish(meta_of(d), [(sc, C)], lambda sid, n: f"c{n:02d}")

# =====================================================================
# GREENZAP 3 — Unit 01 의문사 있는 의문문 (1) (printed pp. 11–27)
# =====================================================================
G3SRC = os.path.join(HERE, "src", "green3-pr4")  # GZ3 data exactly as merged in PR 4 (= live)
def g3(name):
    return json.load(open(os.path.join(G3SRC, name), encoding="utf-8"))
def strip_dir(ko):
    """remove the old leading 'A. direction' / '[x-y] direction' line, keep item-specific Korean."""
    if not ko: return None
    lines = ko.split("\n")
    if re.match(r"^(A|B|C)\. |^\[\d+-\d+\]|^다음 |^Wrap Up|^Check Up", lines[0]):
        lines = lines[1:]
    s = "\n".join(lines).strip()
    return s or None
def conv(it, label, ex=False, **kw):
    n = {"label": label, "type": it["type"], "promptEn": it.get("promptEn", "")}
    ko = strip_dir(it.get("promptKo"))
    if ko: n["promptKo"] = ko
    for k in ("choices", "blanks", "accept", "answer"):
        if k in it: n[k] = it[k]
    if ex: n["example"] = True
    n.update(kw)
    return n
def by_sec(d, s):
    return [i for i in d["items"] if i.get("section") == s]
g3o = {}

# walk1 (p.11): A1–9 (A1 ex), B1–5 (B1 ex)
d = g3("walk1.json")
sA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
sB = S("B", "Section B", "다음 문장에서 밑줄 친 부분의 알맞은 우리말 뜻을 골라 동그라미 하세요.", R_PICK, "choice")
A = [conv(i, i["label"], ex=(i["label"] == "A1")) for i in by_sec(d, "A")]
B = [conv(i, i["label"], ex=(i["label"] == "B1")) for i in by_sec(d, "B")]
g3o["walk1.json"] = finish(meta_of(d), [(sA, A), (sB, B)], letter_id)

# walk2 (p.13): page text shows ONE section (A) numbered 1–15; A1 ex
d = g3("walk2.json")
sA = S("A", "Section A", "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
A = [conv(i, i["label"], ex=(i["label"] == "A1")) for i in by_sec(d, "A")]
g3o["walk2.json"] = finish(meta_of(d), [(sA, A)], letter_id)

# run (pp.14–15): A1–15 choice (A1 ex), B1–12 one word (B1 ex)
d = g3("run.json")
sA = S("A", "Section A", "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요.", R_PICK, "choice")
sB = S("B", "Section B", "다음 대화의 빈칸에 알맞은 말을 쓰세요.", R_WORD1 + " (의문사 한 단어만 쓰세요.)", "words")
A = [conv(i, i["label"], ex=(i["label"] == "A1")) for i in by_sec(d, "A")]
B = [conv(i, i["label"], ex=(i["label"] == "B1")) for i in by_sec(d, "B")]
g3o["run.json"] = finish(meta_of(d), [(sA, A), (sB, B)], letter_id)

# jump (pp.16–17): A1–12 (A1 ex) 3–4 blanks, B1–15 (B1 ex) 2 blanks
d = g3("jump.json")
sA = S("A", "Section A", "다음 문장의 밑줄 친 부분을 주어진 말로 바꿔 쓸 때, 빈칸에 알맞은 말을 쓰세요.", R_WORDN, "words")
sB = S("B", "Section B", "다음 문장의 빈칸에 알맞은 말을 쓰세요. 주어진 말이 있으면 주어진 말을 사용해서 쓰세요.", R_WORD2, "words")
A = [conv(i, i["label"], ex=(i["label"] == "A1")) for i in by_sec(d, "A")]
B = [conv(i, i["label"], ex=(i["label"] == "B1")) for i in by_sec(d, "B")]
g3o["jump.json"] = finish(meta_of(d), [(sA, A), (sB, B)], letter_id)

# fly (pp.18–19): A1–12 (A1 ex) 2–3 blanks, B1–12 (B1 ex) full sentence
d = g3("fly.json")
sA = S("A", "Section A", "주어진 말을 사용하여 다음 대화를 완성하세요.", R_WORDN + " (필요하면 주어진 말의 형태를 바꾸세요.)", "words")
sB = S("B", "Section B", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence")
A = [conv(i, i["label"], ex=(i["label"] == "A1")) for i in by_sec(d, "A")]
B = []
for i in by_sec(d, "B"):
    n = conv(i, i["label"], ex=(i["label"] == "B1"))
    n["accept"] = sentence_accept(*[a for a in i["accept"] if "\u2019" not in a])
    B.append(n)
g3o["fly.json"] = finish(meta_of(d), [(sA, A), (sB, B)], letter_id)

# writing (pp.20–21): A1–6 (A1 ex) blank part only; B1–6 (B1 ex) full sentence, B3 = part before comma
d = g3("writing.json")
sA = S("A", "Section A", "[정보 활용하기] 제니가 지난 일요일에 찍은 사진입니다. 사진을 보고, 친구와 제니의 대화를 완성하세요.",
       "괄호 안의 말을 사용해 A의 빈칸(밑줄)에 들어갈 말만 쓰세요. 빈칸 뒤에 이미 있는 말(last Sunday, there, it 등)은 쓰지 마세요.", "words")
sB = S("B", "Section B", "[정보 활용하기] 다음은 에릭의 학교 게시판에 붙은 학급 행사 광고입니다. 광고를 보고, 주어진 말을 바르게 배열하여 에릭과 수리의 대화를 완성하세요.",
       R_SENT + " 단, 3번은 쉼표(,) 앞의 빈칸 부분만 쓰세요.", "sentence")
blank_only = {"A1": "Who did you meet", "A2": "Where did you go", "A3": "Why did you go",
              "A4": "What did you do", "A5": "Which did you order", "A6": "How was"}
A = []
for i in by_sec(d, "A"):
    n = conv(i, i["label"], ex=(i["label"] == "A1"))
    n["type"] = "fill"; n["blanks"] = 1
    n["accept"] = [blank_only[i["label"]]]
    A.append(n)
B = []
for i in by_sec(d, "B"):
    n = conv(i, i["label"], ex=(i["label"] == "B1"))
    if i["label"] == "B3":
        n["type"] = "fill"; n["blanks"] = 1; n["answerMode"] = "words"
        n["accept"] = ["Which will they sell"]
        n["noteKo"] = "쉼표(,) 앞의 빈칸 부분만 쓰세요. (butter cookies or sugar cookies는 쓰지 마세요.)"
    else:
        n["accept"] = sentence_accept(*[a for a in i["accept"] if "\u2019" not in a])
    B.append(n)
g3o["writing.json"] = finish(meta_of(d), [(sA, A), (sB, B)], letter_id)

# unit test (pp.22–26): numbered 1–25, no lettered sections; banner per [x–y] direction group
d = g3("unit-test-01.json")
q3 = {int(i["label"]): i for i in d["items"]}
def u(n): return conv(q3[n], str(n))
G = [(S("1-2", "[1–2]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"), [u(1), u(2)]),
     (S("3-4", "[3–4]", "다음 문장에서 밑줄 친 우리말을 영어로 바르게 옮긴 것을 고르세요.", R_PICK + " ([ ] 안이 밑줄 친 부분이에요.)", "choice"), [u(3), u(4)]),
     (S("5", "[5]", "다음 중 올바른 문장을 고르세요.", R_PICK, "choice"), [u(5)]),
     (S("6-7", "[6–7]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK, "choice"), [u(6), u(7)]),
     (S("8-9", "[8–9]", "다음 의문문에 대한 대답으로 알맞은 말을 고르세요.", R_PICK, "choice"), [u(8), u(9)]),
     (S("10", "[10]", "다음 중 짝지어진 대화가 어색한 것을 고르세요.", R_PICK, "choice"), [u(10)]),
     (S("11-12", "[11–12]", "다음 우리말을 영어로 바르게 옮긴 것을 고르세요.", R_PICK, "choice"), [u(11), u(12)]),
     (S("13-14", "[13–14]", "다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice"), [u(13), u(14)]),
     (S("15-17", "[15–17]", "다음 대화의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice"), [u(15), u(16), u(17)]),
     (S("18-20", "[18–20]", "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.", R_WORDN + " (빈칸 수만큼만 쓰세요.)", "words"), [u(18), u(19), u(20)]),
     (S("21-25", "[21–25]", "주어진 말을 바르게 배열하여 문장을 쓰세요.", R_SENT, "sentence"), [u(21), u(22), u(23), u(24), u(25)])]
for sec, its in G:
    if sec["answerMode"] == "sentence":
        for it in its:
            it["accept"] = sentence_accept(*[a for a in it["accept"] if "\u2019" not in a])
g3o["unit-test-01.json"] = finish(meta_of(d), G, lambda sid, n: None)
for i, it in enumerate(g3o["unit-test-01.json"]["items"], 1):
    it["id"] = f"q{i:02d}"

# wrap (p.27): 1 의문사 what/which/who (blanks 1–3), 2 의문사 when/where/why/how (blanks 1–3)
d = g3("wrap.json")
WR3 = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. (영어 의문사는 영어로, 문법 용어는 우리말로 쓰세요.)"
s1 = S("1", "1. 의문사 what, which, who", "Unit 01에서 배운 내용을 정리하세요.", WR3, "words")
s2 = S("2", "2. 의문사 when, where, why, how", "Unit 01에서 배운 내용을 정리하세요.", WR3, "words")
w = {i["label"]: i for i in d["items"]}
W1 = [FILL("1-1", "", w["1-①"]["accept"], ko="① what은 '무엇', [1]는 '어느 것', [2]는 '누구'를 묻는 의문사이다. → [1]"),
      FILL("1-2", "", w["1-②"]["accept"], ko="① what은 '무엇', [1]는 '어느 것', [2]는 '누구'를 묻는 의문사이다. → [2]"),
      FILL("1-3", "", w["1-③"]["accept"], ko="③ 일반동사나 조동사가 쓰인 문장은 「의문사 + do동사/조동사 + 주어 + [3] ~?」으로 쓴다. → [3]")]
W2 = [FILL("2-1", "", w["2-①"]["accept"], ko="① [1]은 언제, where는 어디, why는 이유, [2]는 상태나 방법을 묻는 의문사이다. → [1]"),
      FILL("2-2", "", w["2-②"]["accept"], ko="① [1]은 언제, where는 어디, why는 이유, [2]는 상태나 방법을 묻는 의문사이다. → [2]"),
      FILL("2-3", "", w["2-③"]["accept"], ko="③ 일반동사나 조동사가 쓰인 문장은 「의문사 + do동사/조동사 + [3] + 동사원형 ~?」으로 쓴다. → [3]")]
g3o["wrap.json"] = finish(meta_of(d), [(s1, W1), (s2, W2)], lambda sid, n: f"w{sid}_{n}")

# checkup (p.27)
d = g3("checkup.json")
sc = S("CU", "Check Up", "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (where / what / how / which)", R_BANK, "choice")
C = [conv(i, i["label"]) for i in d["items"]]
g3o["checkup.json"] = finish(meta_of(d), [(sc, C)], lambda sid, n: f"c{n:02d}")

for name, dd in g1.items():
    write(OUT1, name, dd)
for name, dd in g3o.items():
    write(OUT3, name, dd)

# summary
for book, coll in (("GreenZap 1", g1), ("GreenZap 3", g3o)):
    print("==", book)
    for name, dd in coll.items():
        secs = "; ".join(f"{s['title']}: {s['itemCount']} graded" + (f" +{s['exampleCount']} ex" if s['exampleCount'] else "") + f" [{'/'.join(s.get('mixedModes', [s['answerMode']]))}]" for s in dd["sections"])
        print(f"  {name:20} {dd['practiceId']:15} graded={sum(s['itemCount'] for s in dd['sections']):3}  {secs}")
