#!/usr/bin/env python3
"""Build GreenZap 3 Unit 06 (전치사) practice JSON → data/green3/unit06/."""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "green1-build"))
from lib import (  # noqa: E402
    S,
    MC,
    FILL,
    SENT,
    finish,
    letter_id,
    q_ids,
    sentence_accept,
    word_accept,
    R_PICK,
    R_BANK,
)

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "data", "green3", "unit06")
UT = "Unit 06 — 전치사"
UID = "g3:u06"
BOOK = {"bookId": "zap-green-3", "bookTitle": "ZAP Green 3", "appName": "GreenZap 3", "unitId": "unit-06"}
R_WORD1 = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORDN = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
R_SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)"
R_KO = "빈칸에 밑줄 친 부분의 우리말 뜻만 쓰세요. (문장 전체를 쓰지 마세요.)"


def g3meta(slug, title, subtitle, pages, timer=None, **extra):
    m = {
        "practiceId": f"{UID}:{slug}",
        "title": title,
        "subtitle": subtitle,
        "pages": pages,
        "timerMinutes": timer,
        "unitTitle": UT,
        **BOOK,
    }
    m.update(extra)
    return m


def ko_fill(label, en, ko, accept, ex=False, note=None):
    it = {
        "label": label,
        "type": "fill",
        "promptEn": en,
        "promptKo": ko,
        "blanks": 1,
        "accept": accept if isinstance(accept, list) else [accept],
    }
    if ex:
        it["example"] = True
    if note:
        it["noteKo"] = note
    return it


def make_idfmt(prefix):
    return lambda sid, n: f"{prefix}_{sid.lower()}{n:02d}"


files = {}

# ---------- walk1 p.119 (PDF p120; no page image) ----------
DIR_A1 = "다음 문장에서 시간을 나타내는 「전치사+명사(구)」를 찾아 동그라미 하세요."
DIR_B = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요."
secA1 = S("A", "Section A", DIR_A1, R_WORD1, "words")
secB1 = S("B", "Section B", DIR_B, R_PICK, "choice")
walk1_a = [
    ("The baby cries at night.", "at night", True),
    ("She has a piano lesson on Monday.", "on Monday"),
    ("Summer starts in July.", "in July"),
    ("I read a book before bed.", "before bed"),
    ("They didn't speak during the meal.", "during the meal"),
    ("The park opens from 6 a.m. to 10 p.m.", "from 6 a.m. to 10 p.m."),
]
walk1_b = [
    ("My class begins ( at / on ) nine o'clock.", ["at", "on"], "at"),
    ("We visited the museum ( on / in ) January 6.", ["on", "in"], "on"),
    ("I get up early ( on / in ) the morning.", ["on", "in"], "in"),
    ("The birds come here ( at / in ) the spring.", ["at", "in"], "in"),
    ("I will call you again ( on / after ) school.", ["on", "after"], "after"),
    ("He practiced the violin ( for / during ) two hours.", ["for", "during"], "for"),
    ("Bears sleep ( at / during ) the winter.", ["at", "during"], "during"),
    ("We can swim in the river from June ( in / to ) August.", ["in", "to"], "to"),
]
A1 = [FILL(f"A{i + 1}", en, [ans], ex=ex) for i, (en, ans, *rest) in enumerate(walk1_a) for ex in [len(rest) and rest[0]]]
B1 = [MC(f"B{i + 1}", en, ch, ans) for i, (en, ch, ans) in enumerate(walk1_b)]
files["walk1.json"] = finish(
    g3meta("walk1", "Grammar Walk — Lesson 01", "시간을 나타내는 전치사 (p. 119)", "119", 10),
    [(secA1, A1), (secB1, B1)],
    make_idfmt("u06w1"),
)

# ---------- walk2 p.121 ----------
DIR_A2 = "다음 문장에서 장소를 나타내는 「전치사+명사(구)」를 찾아 동그라미 하세요."
secA2 = S("A", "Section A", DIR_A2, R_WORD1, "words")
secB2 = S("B", "Section B", DIR_B, R_PICK, "choice")
walk2_a = [
    ("People are waiting at the bus stop.", "at the bus stop", True),
    ("Don't sit on the grass.", "on the grass"),
    ("A cat is in the toy box.", "in the toy box"),
    ("The car is in front of the truck.", "in front of the truck"),
    ("Look behind the sofa.", "behind the sofa"),
    ("The library is next to the park.", "next to the park"),
]
walk2_b = [
    ("I will stay ( at / in ) home.", ["at", "in"], "at"),
    ("There is a butterfly ( at / on ) her nose.", ["at", "on"], "on"),
    ("They lived ( on / in ) Japan last year.", ["on", "in"], "in"),
    ("He is standing ( over / in front of ) the Eiffel Tower.", ["over", "in front of"], "in front of"),
    ("Please sit ( next to / between ) him.", ["next to", "between"], "next to"),
    ("An apple is ( among / between ) two glasses.", ["among", "between"], "between"),
    ("She chose a teddy bear ( among / between ) lots of toys.", ["among", "between"], "among"),
    ("There is a bridge ( over / under ) the river.", ["over", "under"], "over"),
]
A2 = [FILL(f"A{i + 1}", en, [ans], ex=ex) for i, (en, ans, *rest) in enumerate(walk2_a) for ex in [len(rest) and rest[0]]]
B2 = [MC(f"B{i + 1}", en, ch, ans) for i, (en, ch, ans) in enumerate(walk2_b)]
files["walk2.json"] = finish(
    g3meta("walk2", "Grammar Walk — Lesson 02", "장소/위치를 나타내는 전치사 (p. 121)", "121", 10),
    [(secA2, A2), (secB2, B2)],
    make_idfmt("u06w2"),
)

# ---------- run pp.122-123 ----------
DIR_RA = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요."
DIR_RB = "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요."
secRA = S("A", "Section A", DIR_RA, R_PICK, "choice")
secRB = S("B", "Section B", DIR_RB, R_KO, "words")
run_a = [
    ("Let's meet _____ noon.", "정오에 만나자.", ["at", "on"], "at"),
    ("We go to a nice restaurant _____ my birthday.", "우리는 내 생일에 멋진 레스토랑에 간다.", ["in", "on"], "on"),
    ("They played soccer _____ two hours.", "그들은 두 시간 동안 축구를 했다.", ["in", "for"], "for"),
    ("The flower blooms from spring _____ fall.", "그 꽃은 봄부터 가을까지 핀다.", ["to", "in"], "to"),
    ("It will be cloudy _____ the afternoon.", "오후에는 날씨가 흐릴 것이다.", ["in", "at"], "in"),
    ("We went camping _____ the vacation.", "우리는 방학 동안 캠핑하러 갔다.", ["during", "to"], "during"),
    ("Come home _____ dinner.", "저녁 식사 전에 집에 와라.", ["during", "before"], "before"),
    ("He helps his parents _____ school.", "그는 방과 후에 자기 부모님을 도와 드린다.", ["at", "after"], "after"),
    ("There is a bench _____ the two trees.", "그 두 나무 사이에 벤치가 하나 있다.", ["between", "among"], "between"),
    ("The eagles are flying _____ the farm.", "독수리들이 농장 위를 날고 있다.", ["on", "over"], "over"),
    ("A cat is _____ the door.", "고양이 한 마리가 현관에 있다.", ["at", "on"], "at"),
    (
        "The shy boy couldn't talk _____ girls.",
        "그 수줍은 남자아이는 여자아이들 앞에서 말을 할 수 없었다.",
        ["under", "in front of"],
        "in front of",
    ),
    ("Jane is walking _____ us.", "제인이 우리 뒤에서 걷고 있다.", ["behind", "beside"], "behind"),
    ("There is a bank _____ the supermarket.", "그 슈퍼마켓 옆에 은행이 하나 있다.", ["next", "next to"], "next to"),
    ("Elizabeth is popular _____ the girls.", "엘리자베스가 여자아이들 사이에서 인기가 있다.", ["in", "among"], "among"),
]
run_b = [
    ("The library opens <u>on Sunday</u>.", "일요일에", ["일요일에"], True),
    ("Ted has lunch <u>at 12:30</u>.", "12시 30분에", ["12시 30분에", "12시반에"]),
    ("Dad comes home early <u>in the evening</u>.", "저녁에", ["저녁에", "저녁때에"]),
    ("We wash our hands <u>before lunch</u>.", "점심 식사 전에", ["점심 식사 전에", "점심전에", "점심 전에"]),
    ("I walked home <u>after the party</u>.", "파티 후에", ["파티 후에", "파티가 끝난 후에"]),
    ("You may not use your phone <u>during the class</u>.", "수업 동안", ["수업 동안", "수업시간 동안"]),
    ("They watched television <u>for three hours</u>.", "3시간 동안", ["3시간 동안", "세 시간 동안"]),
    (
        "He traveled <u>from March 1 to April 30</u>.",
        "3월 1일부터 4월 30일까지",
        ["3월 1일부터 4월 30일까지", "3월1일부터 4월30일까지"],
    ),
    ("Don't sit <u>on the table</u>.", "탁자 위에", ["탁자 위에", "테이블 위에"]),
    ("The car stopped <u>in front of our house</u>.", "우리 집 앞에", ["우리 집 앞에", "우리집 앞에"]),
    ("The boy sat <u>between his parents</u>.", "자기 부모님 사이에", ["자기 부모님 사이에", "부모님 사이에"]),
    ("The balloons are flying <u>over the trees</u>.", "나무 위를", ["나무 위를", "나무들 위를"]),
    ("She baked the cookies <u>at home</u>.", "집에서", ["집에서"]),
    ("The kid hid <u>behind the curtain</u>.", "커튼 뒤에", ["커튼 뒤에"]),
    ("Let's hang the picture <u>on the wall</u>.", "벽에", ["벽에"]),
]
RA = [MC(f"A{i + 1}", en, ch, ans, ko=ko) for i, (en, ko, ch, ans) in enumerate(run_a)]
RB = [
    ko_fill(f"B{i + 1}", en, ko, acc, ex=ex)
    for i, (en, ko, acc, *rest) in enumerate(run_b)
    for ex in [len(rest) and rest[0]]
]
files["run.json"] = finish(
    g3meta("run", "Grammar Run", "전치사 (pp. 122–123)", "122–123", 20),
    [(secRA, RA), (secRB, RB)],
    make_idfmt("u06run"),
)

# ---------- jump pp.124-125 ----------
DIR_JA = "다음 중 알맞은 말을 찾아 문장을 완성하세요. 중복해서 사용할 수 있어요."
DIR_JB = "주어진 말과 알맞은 전치사를 사용하여 다음 문장을 완성하세요."
secJA = S(
    "A",
    "Section A",
    DIR_JA,
    R_WORD1 + " (in / on / at 중에서 골라 쓰세요.)",
    "words",
)
secJB = S("B", "Section B", DIR_JB, R_WORDN, "words")
jump_a = [
    ("Joe wrote the letter on November 21.", "on", True),
    ("The phone rang _____ midnight.", "at"),
    ("The concert will start _____ 8 p.m.", "at"),
    ("My sister will be seven years old _____ 2019.", "in"),
    ("Halloween is _____ October.", "in"),
    ("They eat turkey _____ Thanksgiving Day.", "on"),
    ("There is water _____ the floor.", "on"),
    ("Let's meet _____ the bus stop.", "at"),
    ("Mom is cooking _____ the kitchen.", "in"),
    ("A few trucks are _____ the road.", "on"),
    ("Your friend is _____ the door.", "at"),
    ("They speak English and French _____ Canada.", "in"),
]
jump_b = [
    ("We went home _____ the movie. ( the movie )", "after"),
    ("Jake brushes his teeth _____ dinner. ( dinner )", "after"),
    ("It rained heavily _____ the night. ( the night )", "during"),
    ("Snowie often sleeps _____ the day. ( the day )", "during"),
    ("My dad works _____ _____ _____ to 5 p.m. ( 9 a.m. )", "from|9|a.m."),
    ("We looked for our puppy _____ three hours. ( three hours )", "for"),
    ("They don't exercise _____ bed. ( bed )", "before"),
    ("Seagulls are flying _____ the sea. ( the sea )", "over"),
    ("There is a library _____ the museum. ( the museum )", "next to"),
    ("Britney read a book _____ Jack. ( Jack )", "beside"),
    ("Yuna was standing _____ us. ( us )", "behind"),
    ("A bird built a nest _____ the roof. ( the roof )", "under"),
    ("A fountain is _____ the school. ( the school )", "in front of"),
    ("He picked Harry Potter _____ lots of books. ( lots of books )", "among"),
    ("There is a table _____ two chairs. ( two chairs )", "between"),
]
JA = [
    FILL(f"A{i + 1}", en if "_____" in en else en.replace(" on ", " _____ ", 1), [ans], ex=ex)
    for i, (en, ans, *rest) in enumerate(jump_a)
    for ex in [len(rest) and rest[0]]
]
# fix JA prompts with blanks
JA = [
    FILL("A1", "Joe wrote the letter on November 21.", ["on"], ex=True),
    FILL("A2", "The phone rang _____ midnight.", ["at"]),
    FILL("A3", "The concert will start _____ 8 p.m.", ["at"]),
    FILL("A4", "My sister will be seven years old _____ 2019.", ["in"]),
    FILL("A5", "Halloween is _____ October.", ["in"]),
    FILL("A6", "They eat turkey _____ Thanksgiving Day.", ["on"]),
    FILL("A7", "There is water _____ the floor.", ["on"]),
    FILL("A8", "Let's meet _____ the bus stop.", ["at"]),
    FILL("A9", "Mom is cooking _____ the kitchen.", ["in"]),
    FILL("A10", "A few trucks are _____ the road.", ["on"]),
    FILL("A11", "Your friend is _____ the door.", ["at"]),
    FILL("A12", "They speak English and French _____ Canada.", ["in"]),
]
JB = []
JB_SYNONYMS = {8: ("next to", "beside"), 9: ("beside", "next to")}
for i, (en, ans) in enumerate(jump_b):
    if i in JB_SYNONYMS:
        JB.append(FILL(f"B{i + 1}", en, word_accept(*JB_SYNONYMS[i]), blanks=1))
    else:
        blanks = len(ans.split("|"))
        JB.append(FILL(f"B{i + 1}", en, word_accept(ans), blanks=blanks))
files["jump.json"] = finish(
    g3meta("jump", "Grammar Jump", "전치사 (pp. 124–125)", "124–125", 25),
    [(secJA, JA), (secJB, JB)],
    make_idfmt("u06jmp"),
)

# ---------- fly pp.126-127 ----------
DIR_FA = "다음 문장의 밑줄 친 부분을 바르게 고쳐 문장을 다시 쓰세요."
DIR_FB = "주어진 말을 바르게 배열하여 문장을 쓰세요."
secFA = S("A", "Section A", DIR_FA, R_SENT, "sentence")
secFB = S("B", "Section B", DIR_FB, R_SENT, "sentence")
fly_a = [
    (
        "My grandmother takes a shower <u>at</u> the morning.",
        "우리 할머니는 아침에 샤워하신다.",
        "My grandmother takes a shower in the morning.",
        True,
    ),
    ("I visited the museum <u>at</u> the vacation.", "나는 방학 동안 그 박물관을 방문했다.", "I visited the museum during the vacation."),
    ("We will go camping <u>during</u> ten days.", "우리는 10일 동안 캠핑을 갈 것이다.", "We will go camping for ten days."),
    (
        "School will close <u>to</u> Thursday <u>from</u> Sunday.",
        "학교는 목요일부터 일요일까지 문을 닫을 것이다.",
        "School will close from Thursday to Sunday.",
    ),
    ("I write in my diary <u>behind</u> bed.", "나는 잠자리에 들기 전에 일기를 쓴다.", "I write in my diary before bed."),
    ("She is <u>in</u> home.", "그녀는 집에 있다.", "She is at home."),
    ("Miles is standing <u>by</u> the bakery.", "마일스가 제과점 앞에 서 있다.", "Miles is standing in front of the bakery."),
    ("Blackie was sleeping <u>on</u> the tree.", "블랙키가 나무 아래에서 자고 있었다.", "Blackie was sleeping under the tree."),
    ("Pad sat <u>among</u> Billy and me.", "패드는 빌리와 나 사이에 앉았다.", "Pad sat between Billy and me."),
    ("They are skating <u>over</u> the ice.", "그들은 얼음 위에서 스케이트를 타고 있다.", "They are skating on the ice."),
    ("The puppy is hiding <u>beside</u> the curtain.", "그 강아지는 커튼 뒤에 숨어 있다.", "The puppy is hiding behind the curtain."),
    ("There is a lake <u>behind</u> my house.", "우리 집 옆에 호수가 하나 있다.", "There is a lake beside my house."),
]
fly_b = [
    ("( my dad / exercises / the evening / in / . )", "우리 아빠는 저녁에 운동하신다.", "My dad exercises in the evening.", True),
    ("( I / dinner / do my homework / after / . )", "나는 저녁 식사 후에 숙제를 한다.", "I do my homework after dinner."),
    ("( will close / the shop / three days / for / . )", "그 가게는 3일 동안 문을 닫을 것이다.", "The shop will close for three days."),
    ("( on / it / snowed / my birthday / . )", "내 생일에 눈이 왔다.", "It snowed on my birthday."),
    (
        "( from / the flower / blooms / fall / to / spring / . )",
        "그 꽃은 봄부터 가을까지 핀다.",
        "The flower blooms from spring to fall.",
    ),
    ("( doesn't bark / night / at / my puppy / . )", "우리 강아지는 밤에 짖지 않는다.", "My puppy doesn't bark at night."),
    (
        "( chose a rose / among / she / lots of flowers / . )",
        "그녀는 많은 꽃 중에서 장미를 선택했다.",
        "She chose a rose among lots of flowers.",
    ),
    ("( the library / I / in front of / met Sue / . )", "나는 도서관 앞에서 수를 만났다.", "I met Sue in front of the library."),
    ("( me / next to / Anne / sits / . )", "앤은 내 옆에 앉는다.", "Anne sits next to me."),
    ("( the bird / was flying / the tree / over / . )", "그 새는 나무 위를 날고 있었다.", "The bird was flying over the tree."),
    ("( under / the tree / a man / is standing / . )", "한 남자가 나무 아래에 서 있다.", "A man is standing under the tree."),
    ("( a lot of cars / the road / there are / on / . )", "도로에 차들이 많다.", "There are a lot of cars on the road."),
]
FA = [SENT(f"A{i + 1}", en, [ans], ko=ko, ex=ex) for i, (en, ko, ans, *rest) in enumerate(fly_a) for ex in [len(rest) and rest[0]]]
FB = [SENT(f"B{i + 1}", en, [ans], ko=ko, ex=ex) for i, (en, ko, ans, *rest) in enumerate(fly_b) for ex in [len(rest) and rest[0]]]
files["fly.json"] = finish(
    g3meta("fly", "Grammar Fly", "전치사 (pp. 126–127)", "126–127", 28),
    [(secFA, FA), (secFB, FB)],
    make_idfmt("u06fly"),
)

# ---------- writing pp.128-129 ----------
DIR_WA = "[정보 활용하기] 올리비아와 친구들이 여러 파티의 초대장을 만들었습니다. 초대장을 보고, 다음 문장을 완성하세요."
DIR_WB = "[그림 묘사하기] 존이 마을 지도를 그렸습니다. 지도를 보고, 무엇이 어디에 있는지 설명하는 문장을 완성하세요."
secWA = S("A", "Section A", DIR_WA, R_WORDN, "words")
secWB = S("B", "Section B", DIR_WB, R_WORDN, "words")
writing_a = [
    ("The pajama party is on May 28.", "on|May|28", True),
    ("They will have the party _____ _____ _____.", "at|Olivia's|house", "[초대장: Pajama Party — Where: at Olivia's house]"),
    ("The Halloween party will start _____ _____ _____ today.", "at|8|p.m.", "[초대장: Halloween — When: at 8 p.m.]"),
    (
        "They will have the party at the haunted house _____ _____ _____ _____.",
        "next|to|the|library",
        "[초대장: haunted house next to the library]",
    ),
    ("They will have Jack's birthday party _____ _____.", "on|Sunday", "[초대장: Jack's Birthday — on Sunday]"),
    ("They will have the party _____ _____ _____ _____.", "at|the|Rose|Garden", "[초대장: at the Rose Garden]"),
]
writing_b = [
    ("The library is on Main Street.", "on|Main|Street", True),
    ("There is a fountain _____ _____ City Hall.", "in|front|of"),
    ("City Hall is _____ the fountain.", "behind"),
    ("The school is _____ First Avenue.", "on"),
    ("The hospital is _____ City Hall _____ the school.", "between|and", None),
    ("There is a park _____ the school.", "behind"),
]
WA = []
for i, row in enumerate(writing_a):
    en, ans = row[0], row[1]
    ex = row[2] is True if len(row) > 2 else False
    note = row[2] if len(row) > 2 and row[2] is not True else None
    WA.append(
        FILL(f"A{i + 1}", en, word_accept(ans), blanks=len(ans.split("|")), ko=note, ex=ex)
    )
WB = [
    FILL(f"B{i + 1}", en, word_accept(ans), blanks=len(ans.split("|")), ex=ex)
    for i, (en, ans, *rest) in enumerate(writing_b)
    for ex in [len(rest) and rest[0]]
]
files["writing.json"] = finish(
    g3meta("writing", "Grammar & Writing", "초대장·지도 (pp. 128–129)", "128–129", 20),
    [(secWA, WA), (secWB, WB)],
    make_idfmt("u06wrt"),
)

# ---------- unit test pp.130-134 ----------
CHO5 = ["on", "in", "at", "to", "between"]
CHO68 = ["on", "in", "during", "at", "for"]
PAIR_CHO = ["under - under", "over - over", "behind - between", "over - under", "under - over"]
PAIR2_CHO = ["for - at", "during - on", "for - from", "during - to", "for - before"]

def mc5(label, en, ko, choices, ans_num, **kw):
    return MC(label, en, choices, str(ans_num), ko=ko, numbered=True, **kw)


def mc_pair(label, prompt, choices, ans_num):
    return MC(label, prompt, choices, str(ans_num), numbered=True)


test_groups = []
sec = S("1-3", "[1–3]", "다음 문장의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice")
sec4 = S("4", "[4]", "다음 중 밑줄 친 부분이 잘못된 문장을 고르세요.", R_PICK, "choice")
sec5 = S("5", "[5]", "다음 중 빈칸에 들어갈 말이 다른 문장을 고르세요.", R_PICK, "choice")
sec68 = S("6-8", "[6–8]", "다음 문장의 빈칸에 공통으로 알맞은 말을 고르세요.", R_PICK, "choice")
sec910 = S("9-10", "[9–10]", "다음 문장의 빈칸에 들어갈 말이 순서대로 바르게 짝지어진 것을 고르세요.", R_PICK, "choice")
sec1112 = S("11-12", "[11–12]", "다음 문장의 우리말 뜻으로 알맞은 것을 고르세요.", R_PICK, "choice")
sec1314 = S("13-14", "[13–14]", "다음 우리말을 영어로 바르게 옮긴 것을 고르세요.", R_PICK, "choice")
sec1517 = S("15-17", "[15–17]", "다음 대화의 빈칸에 알맞은 말을 고르세요.", R_PICK, "choice")
sec1820 = S(
    "18-20",
    "[18–20]",
    "다음 문장의 밑줄 친 부분을 바르게 고쳐 문장을 완성하세요.",
    R_WORD1,
    "words",
)
sec2125 = S(
    "21-25",
    "[21–25]",
    "다음 우리말 뜻과 같도록 주어진 말을 사용하여 문장을 완성하세요.",
    R_WORDN,
    "words",
)

T = [
    mc5("1", "It will be cloudy _____ the afternoon.", "오후에는 흐릴 것이다.", CHO5, 2),
    mc5("2", "The phone rang _____ 6 a.m.", "오전 6시에 전화가 울렸다.", CHO5, 3),
    mc5("3", "Don't sit _____ the desk.", "책상 위에 앉지 마라.", CHO5, 1),
    MC(
        "4",
        "Choose the sentence with the wrong underlined part.",
        [
            "Jack watched TV for ten hours.",
            "It snowed in my birthday.",
            "Some animals sleep during the winter.",
            "I go to the bathroom before class.",
            "She has a piano lesson after school.",
        ],
        "2",
        numbered=True,
    ),
    MC(
        "5",
        "",
        [
            "Halloween is _______ October.",
            "My aunt lives _______ New Zealand.",
            "It is hot _______ summer.",
            "The wolf cried _______ night.",
            "My brother takes a shower _______ the morning.",
        ],
        "4",
        numbered=True,
    ),
    mc5(
        "6",
        "• My grandma gets up _____ 4 a.m.\n• Karen stayed _____ home all day.",
        "우리 할머니는 오전 4시에 일어나신다. / 캐런은 온종일 집에 머물렀다.",
        CHO68,
        4,
    ),
    mc5(
        "7",
        "• School begins _____ March.\n• Mom cooked dinner _____ the kitchen.",
        "학교는 3월에 시작한다. / 엄마는 부엌에서 저녁 식사를 요리하셨다.",
        CHO68,
        2,
    ),
    mc5(
        "8",
        "• The library closes _____ Monday.\n• Let's hang the picture _____ the wall.",
        "그 도서관은 월요일에 문을 닫는다. / 벽에 그 그림을 걸자.",
        CHO68,
        1,
    ),
    mc_pair(
        "9",
        "• There is a bridge _____ the river.\n• They were standing _____ the roof.",
        PAIR_CHO,
        4,
    ),
    mc_pair(
        "10",
        "• They traveled _____ a week.\n• My dad comes home _____ dinner.",
        PAIR2_CHO,
        5,
    ),
    MC(
        "11",
        "The library is behind City Hall.",
        [
            "도서관은 시청 옆에 있다.",
            "도서관은 시청 뒤에 있다.",
            "도서관은 시청 앞에 있다.",
            "도서관은 시청 안에 있다.",
            "도서관은 시청 사이에 있다.",
        ],
        "2",
        numbered=True,
    ),
    MC(
        "12",
        "I waited for Paul from 3 p.m. to 5 p.m.",
        [
            "나는 폴을 오후 3시와 5시 사이에 기다렸다.",
            "나는 폴을 오후 3시부터 5시까지 기다렸다.",
            "나는 폴을 오후 5시 전에 기다렸다.",
            "나는 폴을 오후 5시 후에 기다렸다.",
            "나는 폴을 오후 3시까지 기다렸다.",
        ],
        "2",
        numbered=True,
    ),
    MC(
        "13",
        "나는 잠자리에 들기 전에 일기를 쓴다.",
        [
            "I write in my diary on the bed.",
            "I write in my diary before bed.",
            "I write in my diary after school.",
            "I write in my diary for hours.",
            "I write in my diary at night.",
        ],
        "2",
        numbered=True,
    ),
    MC(
        "14",
        "그녀는 장난감들 사이에서 그 인형을 발견했다.",
        [
            "She found the doll behind the toys.",
            "She found the doll on the toys.",
            "She found the doll by the toys.",
            "She found the doll among the toys.",
            "She found the doll under the toys.",
        ],
        "4",
        numbered=True,
    ),
    MC("15", "A: When do you play soccer?\nB: I play soccer ( _____ / _____ ) school.", ["after", "on"], "after"),
    MC("16", "A: Where does your cat sleep?\nB: She sleeps ( _____ / _____ ) my bed.", ["under", "between"], "under"),
    MC(
        "17",
        "A: When did you visit your grandmother?\nB: We visited her ( _____ / _____ ) the vacation.",
        ["during", "for"],
        "during",
    ),
    FILL(
        "18",
        "His dog is walking <u>behind</u> him. → His dog is walking _____ him.\n그의 개는 그의 옆에서 걷고 있다.",
        word_accept("beside", "next to"),
    ),
    FILL(
        "19",
        "I practiced the violin <u>in</u> two hours. → I practiced the violin _____ two hours.\n나는 바이올린을 두 시간 동안 연습했다.",
        ["for"],
    ),
    FILL(
        "20",
        "The eagle is flying <u>on</u> the tree. → The eagle is flying _____ the tree.\n그 독수리는 나무 위를 날고 있다.",
        ["over"],
    ),
    FILL(
        "21",
        "그 가게는 8월 15일에 문을 열었다. ( August 15 )\nThe store opened _____ _____ _____.",
        word_accept("on|August|15"),
        blanks=3,
    ),
    FILL(
        "22",
        "고흐는 그 그림을 1888년에 끝마쳤다. ( 1888 )\nGogh finished the painting _____ _____.",
        word_accept("in|1888"),
        blanks=2,
    ),
    FILL(
        "23",
        "도로에 트럭이 많다. ( the road )\nThere are lots of trucks _____ _____ _____.",
        word_accept("on|the|road"),
        blanks=3,
    ),
    FILL(
        "24",
        "두 나무 사이에 벤치가 하나 있다. ( the two trees )\nThere is a bench _____ _____ _____ _____.",
        word_accept("between|the|two|trees"),
        blanks=4,
    ),
    FILL(
        "25",
        "그 학교 앞에 버스 정류장이 하나 있다. ( the school )\nThere is a bus stop _____ _____ _____ _____.",
        word_accept("in|front|of|the school"),
        blanks=4,
    ),
]

test_secs = [
    (sec, T[0:3]),
    (sec4, [T[3]]),
    (sec5, [T[4]]),
    (sec68, T[5:8]),
    (sec910, T[8:10]),
    (sec1112, T[10:12]),
    (sec1314, T[12:14]),
    (sec1517, T[14:17]),
    (sec1820, T[17:20]),
    (sec2125, T[20:25]),
]

meta_test = g3meta(
    "quiz",
    "Unit Test 06",
    "전치사 (pp. 130–134)",
    "130–134",
    30,
    testId="unit-test-06",
    passPct=80,
    retryBelowPct=50,
    showAnswersToStudent=False,
)
files["unit-test-06.json"] = q_ids(finish(meta_test, test_secs, lambda sid, n: f"q{n:02d}"))

# ---------- wrap p.134 ----------
WRAP_RULE = "번호가 붙은 빈칸에 들어갈 말만 쓰세요. (영어 전치사는 영어로, 문법 용어는 우리말로 쓰세요.)"
secW1 = S("1", "1. 시간을 나타내는 전치사", "Unit 06에서 배운 내용을 정리하세요.", WRAP_RULE, "words")
secW2 = S("2", "2. 장소/위치를 나타내는 전치사", "Unit 06에서 배운 내용을 정리하세요.", WRAP_RULE, "words")
wrap_items = [
    ("1-1", "1", "at (구체적인 시각…)에, [1] (요일·날짜…)에 → [1]", ["on"]),
    ("1-2", "1", "in (연도·계절…)에; from A to B (A부터 B까지); [2] 〜 전에 / after 〜 후에 → [2]", ["before"]),
    ("1-3", "1", "for (시간) 동안; during (기간) 동안 → [3]", ["during"]),
    ("2-1", "2", "at (좁은 장소)에; on (표면) 위에; [1] (넓은 장소)에 → [1]", ["in"]),
    ("2-2", "2", "in front of 〜 앞에; [2] 〜 뒤에 → [2]", ["behind"]),
    ("2-3", "2", "under 〜 아래에; over 〜 위에; between / [3] (셋 이상) 사이에 → [3]", ["among"]),
]
W = []
for lab, sec, prompt, acc in wrap_items:
    W.append(
        {
            "label": lab,
            "type": "fill",
            "promptKo": prompt,
            "promptEn": "",
            "blanks": 1,
            "accept": acc,
        }
    )
files["wrap.json"] = finish(
    g3meta("wrap", "Wrap Up", "Unit 06 summary fill-ins (p. 135)", "135", 8),
    [(secW1, W[:3]), (secW2, W[3:])],
    lambda sid, n: f"w{sid}_{n}",
)

# ---------- check up p.135 ----------
CU_DIR = "그림을 보고, 알맞은 말을 찾아 다음 대화의 빈칸에 쓰세요. (behind / at / before / after)"
secCU = S("CU", "Check Up", CU_DIR, R_BANK, "choice")
check_items = [
    ("1", "Can you come home _____ dinner?", "before"),
    ("2", "I am _____ the sofa.", "behind"),
    ("3", "He's _____ the door. Are you ready?", "at"),
    ("4", "I'll come again _____ the party.", "after"),
]
CU = [
    {
        "label": lab,
        "type": "fill",
        "promptEn": en,
        "blanks": 1,
        "accept": word_accept(ans),
    }
    for lab, en, ans in check_items
]
files["checkup.json"] = finish(
    g3meta(
        "checkup",
        "Check Up",
        "Comic dialogue blanks (p. 135)",
        "135",
        6,
        wordBank=["behind", "at", "before", "after"],
    ),
    [(secCU, CU)],
    lambda sid, n: f"c{n:02d}",
)

os.makedirs(OUT, exist_ok=True)
for name, data in files.items():
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    graded = sum(1 for it in data["items"] if not it.get("displayOnly"))
    print(f"Wrote {name}: {graded} graded / {len(data['items'])} items")

print("Done:", OUT)
