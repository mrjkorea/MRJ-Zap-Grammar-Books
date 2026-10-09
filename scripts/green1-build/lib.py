"""Shared helpers for GreenZap 1 Units 02-05 (same format as zapfix/build_zapfix.py, Unit 01 sections v2)."""
import json, os, re, itertools, math

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))  # repo root (scripts/green1-build -> scripts -> repo)
DATA = os.path.join(ROOT, "data", "green1")

R_PICK = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
R_BANK = "상자 안의 말 중에서 알맞은 말을 골라 그 단어만 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORD1 = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORD2 = "빈칸 두 개에 들어갈 말을 각각 쓰세요. 한 칸에 한 단어씩 쓰세요. (문장 전체를 쓰지 마세요.)"
R_WORDN = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
R_SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표나 물음표까지 완전한 문장으로 쓰세요.)"
MODE_TAG = {"choice": "Choose · 고르기", "words": "Words only · 빈칸 말만", "sentence": "Full sentence · 문장 전체"}
BANK_TAG = "Choose & type the word · 골라서 그 단어만 쓰기"
MODE_KO = {"choice": "고르기", "words": "빈칸 말만 쓰기", "sentence": "문장 전체 쓰기"}

PAIRS = [("is not", "isn't"), ("are not", "aren't"), ("do not", "don't"), ("does not", "doesn't"),
         ("was not", "wasn't"), ("were not", "weren't"), ("did not", "didn't"),
         ("will not", "won't"), ("cannot", "can't"), ("can not", "can't"),
         ("i am", "i'm"), ("we are", "we're"), ("they are", "they're"), ("you are", "you're"),
         ("he is", "he's"), ("she is", "she's"), ("it is", "it's"), ("what is", "what's"),
         ("who is", "who's"), ("where is", "where's"), ("that is", "that's"), ("there is", "there's"),
         ("i will", "i'll"), ("you will", "you'll"), ("he will", "he'll"), ("she will", "she'll"),
         ("it will", "it'll"), ("we will", "we'll"), ("they will", "they'll"),
         ("we're not", "we aren't"), ("they're not", "they aren't"), ("you're not", "you aren't"),
         ("he's not", "he isn't"), ("she's not", "she isn't"), ("it's not", "it isn't")]

def variants(s, limit=60):
    allv = {s}
    frontier = [s]
    while frontier and len(allv) < limit:
        cur = frontier.pop()
        for a, b in PAIRS:
            for x, y in ((a, b), (b, a)):
                pat = re.compile(r"(?<![\w'])" + re.escape(x) + r"(?![\w'])", re.I)
                m = pat.search(cur)
                if m:
                    rep = y
                    if m.group(0)[0].isupper():
                        rep = y[0].upper() + y[1:]
                    nv = cur[:m.start()] + rep + cur[m.end():]
                    if nv.lower() not in {v.lower() for v in allv}:
                        allv.add(nv); frontier.append(nv)
    return allv

def sentence_accept(*sents):
    out, seen = [], set()
    def add(s):
        s = re.sub(r"\s+", " ", s).strip()
        k = s.lower().rstrip(".?!")
        if s and k not in seen:
            seen.add(k); out.append(s)
    for s in sents:
        add(s)
        allv = variants(s)
        for v in sorted(allv):
            add(v)
        for v in list(allv):
            if "," in v:
                add(v.replace(",", ""))
    return out

def word_accept(*answers):
    """1-blank or multi-blank ('a|b') answers + contraction variants per part."""
    out = []
    for a in answers:
        parts = a.split("|")
        opts = [sorted(variants(p), key=lambda v: (v != p, v)) for p in parts]
        for combo in itertools.product(*opts):
            j = "|".join(combo)
            if j not in out:
                out.append(j)
    # keep the original(s) first
    first = [a for a in answers]
    return first + [o for o in out if o not in first]

def perm_accept(*slots):
    res = []
    for order in itertools.permutations(slots):
        for combo in itertools.product(*order):
            p = "|".join(combo)
            if p not in res:
                res.append(p)
    return res

def S(sid, title, direction, rule, mode):
    return {"id": sid, "title": title, "directionKo": direction, "ruleKo": rule,
            "instructionKo": (direction + " " + rule).strip(), "answerMode": mode}

CIRC = "①②③④⑤"
def MC(label, en, choices, ans, ko=None, ex=False, numbered=False, **kw):
    """ans: choice text, or int (1-based) for numbered (unit-test style) choices."""
    if numbered:
        n = int(ans)
        acc = [str(n), CIRC[n - 1]]
        it = {"label": label, "type": "mc", "promptEn": en, "choices": choices, "accept": acc, "answer": str(n)}
    else:
        acc = ans if isinstance(ans, list) else [ans]
        it = {"label": label, "type": "mc", "promptEn": en, "choices": choices, "accept": acc}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

def FILL(label, en, accept, blanks=None, ko=None, ex=False, raw=False, **kw):
    accept = accept if isinstance(accept, list) else [accept]
    if blanks is None:
        blanks = len(accept[0].split("|"))
    acc = accept if raw else word_accept(*accept)
    it = {"label": label, "type": "fill", "promptEn": en, "blanks": blanks, "accept": acc}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

def SENT(label, en, answers, ko=None, ex=False, **kw):
    answers = answers if isinstance(answers, list) else [answers]
    it = {"label": label, "type": "sentence", "promptEn": en, "accept": sentence_accept(*answers)}
    if ko: it["promptKo"] = ko
    if ex: it["example"] = True
    it.update(kw); return it

R_KO_PHRASE = "빈칸에 밑줄 친 부분의 우리말 뜻만 쓰세요. (문장 전체를 쓰지 마세요.)"

def KO_MEAN(label, en, ko_blank, accept, ex=False, **kw):
    """Grammar Run-style Korean gloss: student types only the underlined phrase."""
    acc = accept if isinstance(accept, list) else [accept]
    it = {"label": label, "type": "fill", "promptEn": en, "promptKo": ko_blank, "blanks": 1, "accept": acc}
    if ex: it["example"] = True
    it.update(kw)
    return it

def example_answer(it):
    a = it["accept"][0]
    if it["type"] == "mc" and re.fullmatch(r"\d", a):
        return it["choices"][int(a) - 1]
    return a.replace("|", " / ")

ORDER = ["id", "section", "sectionTitle", "sectionInstructionKo", "answerMode", "answerModeTag",
         "label", "example", "displayOnly", "exampleAnswer", "type", "promptKo", "promptEn",
         "choices", "blanks", "accept", "answer", "noteKo"]

def auto_timer(items):
    t = 0.0
    for it in items:
        if it.get("displayOnly"): continue
        if it["type"] == "mc": t += 0.7
        elif it["type"] == "sentence": t += 1.0
        elif it.get("blanks", 1) > 1: t += 0.9
        else: t += 0.6
    return max(8, int(math.ceil(t + 3)))

def finish(meta, groups, idfmt, timer=None):
    items, sections = [], []
    for sec, its in groups:
        graded = examples = 0
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
            it = {k: it[k] for k in ORDER if k in it} | {k: v for k, v in it.items() if k not in ORDER}
            items.append(it)
        s = {"id": sec["id"], "title": sec["title"], "instructionKo": sec["instructionKo"],
             "directionKo": sec["directionKo"], "ruleKo": sec["ruleKo"], "answerMode": sec["answerMode"],
             "answerModeTag": (BANK_TAG if any(i["type"] != "mc" for i in its) and sec["answerMode"] == "choice" else MODE_TAG[sec["answerMode"]]),
             "itemCount": graded, "exampleCount": examples,
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
    if "timerMinutes" not in d or d["timerMinutes"] is None:
        d["timerMinutes"] = timer or auto_timer(items)
    d["sectionsVersion"] = 2
    d["introKo"] = intro
    d["sections"] = sections
    d["items"] = items
    return d

def letter_id(sid, n):
    return f"{sid.lower()}{n:02d}"

def q_ids(d):
    for i, it in enumerate(d["items"], 1):
        it["id"] = f"q{i:02d}"
    return d

def write_unit(unit_dir, files):
    out = os.path.join(DATA, unit_dir)
    os.makedirs(out, exist_ok=True)
    for name, d in files.items():
        with open(os.path.join(out, name), "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=2); f.write("\n")
    return out

def meta(uid, slug, title, subtitle, pages, unit_title, timer=None, **extra):
    m = {"practiceId": f"{uid}:{slug}", "title": title, "subtitle": subtitle, "pages": pages,
         "timerMinutes": timer, "unitTitle": unit_title}
    m.update(extra)
    return m

def test_meta(n, unit_title, pages):
    nn = f"{n:02d}"
    return {"practiceId": f"u{nn}:quiz", "title": f"Unit Test {nn}", "subtitle": f"{unit_title} (pp. {pages})",
            "pages": pages, "timerMinutes": 25, "unitTitle": unit_title, "bookId": "zap-green1", "bookTitle": "ZAP Green 1",
            "unitId": f"unit-{nn}", "testId": f"unit-test-{nn}", "testTitle": f"Unit Test {nn}",
            "passPct": 80, "retryBelowPct": 50, "showAnswersToStudent": False}
