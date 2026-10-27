"""Extracted practice data for 천일문 Grammar 1 chapters 02–03 (from SB/WB page scans)."""
from __future__ import annotations

from practice_lib import (
    build_practice,
    choose_all_item,
    fill_item,
    labels_az,
    labels_num,
    mc_item,
    section,
    sent_item,
)

WR = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
WR2 = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
MC = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
CORR = "고친 말만 한 칸에 쓰세요. (문장 전체를 쓰지 마세요.)"
OX = "맞으면 O, 틀리면 어법에 맞게 고친 말만 쓰세요. (O 또는 고친 말.)"


def sb(ch: int, title: str) -> dict:
    return {"unit_id": f"chapter-{ch:02d}", "unit_title": f"Chapter {ch:02d} — {title}"}


def wb(ch: int, title: str) -> dict:
    return {"unit_id": f"wb-chapter-{ch:02d}", "unit_title": f"Ch {ch:02d} WB — {title}"}


def _ox_accept(answer: str) -> list[str]:
    return ["O", "o"] if answer == "O" else [answer]


def _doc(
    slug: str,
    m: dict,
    *,
    practice_id: str,
    title: str,
    subtitle: str,
    pages: str,
    timer_minutes: int,
    sections: list,
    items: list,
    test_id: str | None = None,
) -> dict:
    return build_practice(
        practice_id=practice_id,
        title=title,
        subtitle=subtitle,
        pages=pages,
        timer_minutes=timer_minutes,
        sections=sections,
        items=items,
        test_id=test_id,
        **m,
    )


def _mc_bracket(prompt: str, w1: str, w2: str, correct: int, sec, label: str, iid: str):
    return mc_item(
        iid=iid,
        sec=sec,
        label=label,
        prompt_en=prompt,
        choices=[w1, w2],
        answer_index=correct,
    )


def build_ch02() -> dict[str, dict]:
    """SB + WB chapter 02 (23 JSON files)."""
    out: dict[str, dict] = {}
    m = sb(2, "일반동사")
    wm = wb(2, "일반동사")

    # --- SB Unit 1 (p. 22) ---
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 6),
        "POINT 1·2",
    )
    mc_a = [
        ("We [want / wants] some balloons for the party.", "want", "wants", 1),
        ("She [have / has] very short hair.", "have", "has", 2),
        ("Emily [love / loves] her new shoes.", "love", "loves", 2),
        ("My brother and I [learn / learns] Chinese together.", "learn", "learns", 1),
        ("Ben [like / likes] singing and dancing.", "like", "likes", 2),
        ("Kevin and Nancy [watch / watches] movies on Saturdays.", "watch", "watches", 1),
    ]
    items = [
        _mc_bracket(p, a, b, ai, sec, f"A{i}", f"a{i:02d}")
        for i, (p, a, b, ai) in enumerate(mc_a, 1)
    ]
    out["c02-u1-A.json"] = _doc(
        "c02-u1-A.json",
        m,
        practice_id="cm1:c02:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="일반동사의 현재형 · POINT 1·2 (p. 22)",
        pages="22",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 단어를 <보기>에서 골라 문장을 완성하세요. (단, 현재형으로 한 번씩만 사용할 것)",
        WR,
        "words",
        labels_az("B", 5),
        "POINT 1·2",
        word_bank=["know", "exercise", "listen", "take", "study"],
    )
    bb = [
        ("Jessica ________ math after school.", ["studies"]),
        ("Kate and Jason ________ together in the gym.", ["exercise"]),
        ("Danny ________ all famous basketball players.", ["knows"]),
        ("My dad ________ swimming lessons twice a week.", ["takes"]),
        ("Jina always ________ to her friends carefully.", ["listens"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(bb, 1)
    ]
    out["c02-u1-B.json"] = _doc(
        "c02-u1-B.json",
        m,
        practice_id="cm1:c02:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="일반동사의 현재형 · POINT 1·2 (p. 22)",
        pages="22",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 동사의 현재형이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("C", 7),
        "POINT 1·2",
    )
    ox_c = [
        ("My grandpa [walks] in the park every day.", "O"),
        ("Tom [go] to the library.", "goes"),
        ("My sister [get up] early in the morning.", "gets up"),
        ("The doctors [helps] sick people.", "help"),
        ("Julie [brushes] her teeth after every meal.", "O"),
        ("Mr. Lee [teachs] math at school.", "teaches"),
        ("Mom [buies] vegetables in the market.", "buys"),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=_ox_accept(a))
        for i, (p, a) in enumerate(ox_c,  1)
    ]
    out["c02-u1-C.json"] = _doc(
        "c02-u1-C.json",
        m,
        practice_id="cm1:c02:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="일반동사의 현재형 · POINT 1·2 (p. 22)",
        pages="22",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    # --- SB Unit 2 (p. 25) ---
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 6),
        "POINT 3·4",
    )
    mc_u2a = [
        ("He [comed / came] home on his bike.", "comed", "came", 2),
        ("Yesterday I [lose / lost] my cell phone at school.", "lose", "lost", 2),
        ("Jenny and I [seed / saw] a rainbow yesterday.", "seed", "saw", 2),
        ("I [bought / buyed] some snacks at the store.", "bought", "buyed", 1),
        ("My family [goed / went] to the museum last weekend.", "goed", "went", 2),
        ("The birds [entered / enterred] the cage.", "entered", "enterred", 1),
    ]
    items = [
        _mc_bracket(p, a, b, ai, sec, f"A{i}", f"a{i:02d}")
        for i, (p, a, b, ai) in enumerate(mc_u2a, 1)
    ]
    out["c02-u2-A.json"] = _doc(
        "c02-u2-A.json",
        m,
        practice_id="cm1:c02:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="일반동사의 과거형 · POINT 3·4 (p. 25)",
        pages="25",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 동사의 과거형을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("B", 6),
        "POINT 3·4",
    )
    corr_b = ["stayed", "stopped", "visited", "studied", "arrived", "read"]
    prompts_b = [
        "Jane [stayd] home yesterday.",
        "The car [stoped] at the traffic lights.",
        "They [visitted] the National Museum last month.",
        "Last night, I [studyed] English until 11 p.m.",
        "The train [arriveed] on time.",
        "I [readed] an interesting novel last night.",
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(zip(prompts_b, corr_b), 1)
    ]
    out["c02-u2-B.json"] = _doc(
        "c02-u2-B.json",
        m,
        practice_id="cm1:c02:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="일반동사의 과거형 · POINT 3·4 (p. 25)",
        pages="25",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 빈칸에 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("C", 5),
        "POINT 3·4",
    )
    pc = [
        ("I ________ up at 7 o'clock this morning. (get)", ["got"]),
        ("Tim ________ a marathon last weekend. (run)", ["ran"]),
        ("Dad ________ the roller coaster with me. (ride)", ["rode"]),
        ("We ________ a trip to the beach. (plan)", ["planned"]),
        ("Kelly ________ 10 dollars for the book. (pay)", ["paid"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(pc, 1)
    ]
    out["c02-u2-C.json"] = _doc(
        "c02-u2-C.json",
        m,
        practice_id="cm1:c02:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="일반동사의 과거형 · POINT 3·4 (p. 25)",
        pages="25",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    # --- SB Unit 3 (p. 29) ---
    sec = section(
        "A",
        "Section A",
        "다음 문장을 부정문으로 바꿔 쓰세요.",
        WR2,
        "words",
        labels_az("A", 5),
        "POINT 5",
    )
    na = [
        ("My cats sleep a lot.\n→ My cats ________ ________ a lot.", ["don't|sleep", "do not|sleep"]),
        ("I eat seafood.\n→ I ________ ________ seafood.", ["don't|eat", "do not|eat"]),
        (
            "My father watches news programs.\n→ My father ________ ________ news programs.",
            ["doesn't|watch", "does not|watch"],
        ),
        (
            "She does a lot of exercise.\n→ She ________ ________ a lot of exercise.",
            ["doesn't|do", "does not|do"],
        ),
        (
            "Sam and Peter work in the same office.\n→ Sam and Peter ________ ________ in the same office.",
            ["don't|work", "do not|work"],
        ),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, blanks=2, accept=acc)
        for i, (p, acc) in enumerate(na, 1)
    ]
    out["c02-u3-A.json"] = _doc(
        "c02-u3-A.json",
        m,
        practice_id="cm1:c02:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="일반동사의 부정문과 의문문 · POINT 5 (p. 29)",
        pages="29",
        timer_minutes=18,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 단어를 사용하여 다음 의문문을 완성하세요. (단, 현재형으로 쓸 것)",
        WR2,
        "words",
        labels_az("B", 5),
        "POINT 6",
    )
    nb = [
        (
            "A: ________ you ________ my sister? (know)\nB: No, ________ ________ .",
            ["Do|know|I|don't", "Do|know|I|do not"],
        ),
        (
            "A: ________ Kevin ________ a girlfriend? (have)\nB: Yes, ________ ________ .",
            ["Does|have|he|does"],
        ),
        (
            "A: ________ Jane ________ in London? (live)\nB: No, ________ ________ .",
            ["Does|live|she|doesn't", "Does|live|she|does not"],
        ),
        (
            "A: ________ your classmates ________ with your idea? (agree)\nB: Yes, ________ ________ .",
            ["Do|agree|they|do"],
        ),
        (
            "A: ________ the park ________ a lake? (have)\nB: Yes, ________ ________ .",
            ["Does|have|it|does"],
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, blanks=4, accept=acc)
        for i, (p, acc) in enumerate(nb, 1)
    ]
    out["c02-u3-B.json"] = _doc(
        "c02-u3-B.json",
        m,
        practice_id="cm1:c02:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="일반동사의 부정문과 의문문 · POINT 6 (p. 29)",
        pages="29",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분을 어법상 알맞은 형태로 고치세요.",
        CORR,
        "words",
        labels_az("C", 6),
        "POINT 5·6·7·8",
    )
    nc = [
        ("Did he [bought] something in the supermarket?", ["buy"]),
        ("[Does] your brothers clean their rooms?", ["Do"]),
        ("Did they [spent] a lot of money yesterday?", ["spend"]),
        ("We didn't [met] Susan. We met Ann.", ["meet"]),
        ("He doesn't [wears] glasses.", ["wear"]),
        ("Does your sister [has] long hair?", ["have"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(nc, 1)
    ]
    out["c02-u3-C.json"] = _doc(
        "c02-u3-C.json",
        m,
        practice_id="cm1:c02:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="일반동사의 부정문과 의문문 · POINT 5·6·7·8 (p. 29)",
        pages="29",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    # --- SB Chapter Test (pp. 30–31) ---
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section(
            "3",
            "[3]",
            "[3] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["3"],
        ),
        section(
            "4",
            "[4]",
            "[4] 다음 중 대화의 빈칸에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["4"],
        ),
        section(
            "5-6",
            "[5–6]",
            "[5–6] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
            SENT,
            "sentence",
            labels_num(2, 5),
        ),
        section(
            "7",
            "[7]",
            "[7] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 고르세요.",
            MC,
            "choice",
            ["7"],
        ),
        section(
            "8-9",
            "[8–9]",
            "[8–9] 다음 중 어법상 알맞은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(2, 8),
        ),
        section(
            "10-11",
            "[10–11]",
            "[10–11] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            labels_num(2, 10),
        ),
        section(
            "12",
            "[12]",
            "[12] 다음 문장을 괄호 안의 지시대로 알맞게 바꿔 쓴 것을 고르세요.",
            MC,
            "choice",
            ["12"],
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 그림을 보고, 어젯밤에 소년이 한 일과 하지 않은 일에 대하여 주어진 단어를 사용하여 문장을 완성하세요.",
            WR2,
            "words",
            ["13"],
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 글에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["14"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 표는 두 사람의 취미 생활을 나타낸 것입니다. 표를 보고 대화의 빈칸에 알맞은 말을 쓰세요.",
            WR2,
            "words",
            ["15"],
        ),
    ]
    items: list = []
    items.append(
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="________ gets up very late in the morning.",
            choices=["John", "Susan", "He", "My sister", "They"],
            answer_index=5,
        )
    )
    items.append(
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="Do ________ love animals?",
            choices=["they", "Nancy", "you", "Brad and Jane", "your sisters"],
            answer_index=2,
        )
    )
    items.append(
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="· (A) the store open on Sundays?\n· (B) you jog in the morning?",
            choices=["Does — Does", "Do — Do", "Does — Do", "Do — Does", "Did — Does"],
            answer_index=3,
        )
    )
    items.append(
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            prompt_en="A: (A) you eat the pizza?\nB: No, I didn't. My sister (B) it.",
            choices=["Did — ate", "Did — eat", "Do — ate", "Do — eat", "Does — ate"],
            answer_index=1,
        )
    )
    items.append(
        sent_item(
            iid="q05",
            sec=secs[3],
            label="5",
            prompt_en="그는 매일 방에서 숙제를 한다.\n(his homework, do, in the room)\n________ ________ ________ every day.",
            accept=["He does his homework in the room.", "He does his homework in the room"],
        )
    )
    items.append(
        sent_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="Kate는 어제 재킷을 하나 샀다.\n(buy, a jacket)\n________ ________ ________ yesterday.",
            accept=["Kate bought a jacket.", "Kate bought a jacket."],
        )
    )
    items.append(
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en="",
            choices=[
                "Do you has a sister?",
                "Bora plaies mobile games.",
                "Kevin fixs his broken computer.",
                "She goes swimming in the evening.",
                "He and his father makes a model airplane.",
            ],
            answer_index=4,
        )
    )
    items.append(
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            prompt_en="",
            choices=[
                "Does he has many books?",
                "I takes a walk on Sundays.",
                "He wear an expensive watch.",
                "My brother doesn't likes apples.",
                "My mom doesn't go to work on Saturdays.",
            ],
            answer_index=5,
        )
    )
    items.append(
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en="",
            choices=[
                "Tom studyed Chinese with his friends.",
                "They hadn't breakfast in the morning.",
                "Did they played soccer yesterday?",
                "Frank didn't watch TV last night.",
                "I eated three pieces of cake.",
            ],
            answer_index=4,
        )
    )
    items.append(
        fill_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en="Simon getted up at 7 o'clock this morning.",
            blanks=2,
            accept=["getted|got", "Simon getted|Simon got"],
        )
    )
    items.append(
        fill_item(
            iid="q11",
            sec=secs[6],
            label="11",
            prompt_en="Adam doesn't studies English on Monday. His English class is on Friday.",
            blanks=2,
            accept=["studies|study", "doesn't studies|doesn't study", "does not studies|does not study"],
        )
    )
    items.append(
        mc_item(
            iid="q12",
            sec=secs[7],
            label="12",
            prompt_en="",
            choices=[
                "You want some oranges. (의문문으로) → Do you want some oranges?",
                "Ted drew a tree on the paper. (의문문으로) → Did Ted drew a tree on the paper?",
                "I sent a gift to my grandmother. (부정문으로) → I didn't sent a gift to my grandmother.",
                "They watch movies twice a week. (부정문으로) → They doesn't watch movies twice a week.",
                "His little sister goes to middle school. (의문문으로) → Does his little sister goes to middle school?",
            ],
            answer_index=1,
        )
    )
    items.append(
        fill_item(
            iid="q13",
            sec=secs[8],
            label="13",
            prompt_en="(1) He ________ a hamburger last night. (eat)\n(2) He ________ computer games last night. (play)",
            blanks=2,
            accept=["ate|didn't play", "ate|did not play"],
        )
    )
    items.append(
        fill_item(
            iid="q14",
            sec=secs[9],
            label="14",
            prompt_en="Peter gets up at six and has breakfast. He leave for school at seven. He goes to school by bus. He listens to music on the bus.",
            blanks=2,
            accept=["leave|leaves", "He leave|He leaves"],
        )
    )
    items.append(
        fill_item(
            iid="q15",
            sec=secs[10],
            label="15",
            prompt_en="A: Does Tom read books?\nB: Yes, ________ ________ . He ________ many books.\nA: Does Sujin play the guitar?\nB: No, ________ ________ . She ________ the piano.",
            blanks=6,
            accept=[
                "he|does|reads|she|doesn't|plays",
                "he|does|reads|she|does not|plays",
            ],
        )
    )
    out["c02-test.json"] = _doc(
        "c02-test.json",
        m,
        practice_id="cm1:c02:test",
        title="Chapter Test",
        subtitle="Chapter 02 일반동사 (p. 30–31)",
        pages="30–31",
        timer_minutes=28,
        sections=secs,
        items=items,
        test_id="c02-test",
    )

    # --- WB Unit 1 (pp. 8–9) ---
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 10),
        "POINT 1·2",
    )
    wb_u1a = [
        ("We [go / goes] for a walk after lunch.", "go", "goes", 1),
        ("The museum [open / opens] at 9 a.m.", "open", "opens", 2),
        ("She [love / loves] children very much.", "love", "loves", 2),
        ("I [do / does] my homework after school.", "do", "does", 1),
        ("My sister [play / plays] computer games every day.", "play", "plays", 2),
        ("Jack and Cindy [write / writes] in their diaries every evening.", "write", "writes", 1),
        ("Dad [take / takes] a shower every morning.", "take", "takes", 2),
        ("The desk [have / has] four legs.", "have", "has", 2),
        ("Janet and I [like / likes] chocolate milk.", "like", "likes", 1),
        ("Sam [practice / practices] the piano for a contest.", "practice", "practices", 2),
    ]
    items = [
        _mc_bracket(p, a, b, ai, sec, f"A{i}", f"a{i:02d}")
        for i, (p, a, b, ai) in enumerate(wb_u1a, 1)
    ]
    out["wb-c02-u1-A.json"] = _doc(
        "wb-c02-u1-A.json",
        wm,
        practice_id="cm1:wb-c02:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="일반동사의 현재형 · POINT 1·2 (WB p. 8)",
        pages="8",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 동사를 현재형으로 바꿔 쓰세요.",
        WR,
        "words",
        labels_az("B", 10),
        "POINT 1·2",
    )
    wb_b = [
        ("The baby ________ all day long. (cry)", ["cries"]),
        ("My sisters and I ________ breakfast every morning. (eat)", ["eat"]),
        ("Emily ________ her hair every day. (wash)", ["washes"]),
        ("My grandfather ________ two dogs. (have)", ["has"]),
        ("We ________ swimming in summer. (enjoy)", ["enjoy"]),
        ("Daniel ________ the dishes every night. (do)", ["does"]),
        ("Alice ________ the news on the Internet. (watch)", ["watches"]),
        ("My parents ________ up very early. (get)", ["get"]),
        ("Mike ________ English with his friends. (study)", ["studies"]),
        ("The boys ________ football after lunch. (play)", ["play"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_b, 1)
    ]
    out["wb-c02-u1-B.json"] = _doc(
        "wb-c02-u1-B.json",
        wm,
        practice_id="cm1:wb-c02:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="일반동사의 현재형 · POINT 1·2 (WB p. 8)",
        pages="8",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "빈칸에 알맞은 단어를 <보기>에서 골라 문장을 완성하세요. (단, 현재형으로 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("C", 10),
        "POINT 1·2",
        word_bank=[
            "have",
            "know",
            "ride",
            "wash",
            "go",
            "play",
            "wear",
            "live",
            "clean",
            "try",
        ],
    )
    wb_c = [
        ("Jeremy ________ basketball on Tuesdays.", ["plays"]),
        ("They ________ a problem.", ["have"]),
        ("Sumi always ________ her best.", ["tries"]),
        ("Mina and I ________ swimming together.", ["go"]),
        ("Jamie and his family ________ in London.", ["live"]),
        ("My brother ________ his hands before meals.", ["washes"]),
        ("Sora ________ her room every day.", ["cleans"]),
        ("Fred ________ many interesting stories.", ["knows"]),
        ("Laura ________ a seat belt in the car.", ["wears"]),
        ("I ________ a bike on weekends.", ["ride"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_c, 1)
    ]
    out["wb-c02-u1-C.json"] = _doc(
        "wb-c02-u1-C.json",
        wm,
        practice_id="cm1:wb-c02:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="일반동사의 현재형 · POINT 1·2 (WB p. 9)",
        pages="9",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "D",
        "Section D",
        "다음 밑줄 친 동사의 현재형이 맞으면 ○, 틀리면 ×하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("D", 10),
        "POINT 1·2",
    )
    wb_d = [
        ("An old man [lives] in my town.", "O"),
        ("Jessica [brushies] her teeth twice a day.", "brushes"),
        ("My friend [sits] with me on the bus.", "O"),
        ("She [buies] some bread for lunch every day.", "buys"),
        ("My dad [teachs] math at school.", "teaches"),
        ("Mark [haves] a brother and a sister.", "has"),
        ("A bird [flys] in the sky.", "flies"),
        ("My brother [does] his homework in the living room.", "O"),
        ("My alarm clock [rings] at 7 o'clock.", "O"),
        ("Mom [cookes] food for us.", "cooks"),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=_ox_accept(a))
        for i, (p, a) in enumerate(wb_d, 1)
    ]
    out["wb-c02-u1-D.json"] = _doc(
        "wb-c02-u1-D.json",
        wm,
        practice_id="cm1:wb-c02:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="일반동사의 현재형 · POINT 1·2 (WB p. 9)",
        pages="9",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    # --- WB Unit 2 (pp. 10–11) ---
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 10),
        "POINT 3·4",
    )
    wb_u2a = [
        ("My family [moved / moveed] to Busan two years ago.", "moved", "moveed", 1),
        ("Jina [haved / had] a terrible stomachache last night.", "haved", "had", 2),
        ("The player [missed / misseed] the ball at the game.", "missed", "misseed", 1),
        ("I [goed / went] to school by car this morning.", "goed", "went", 2),
        ("She [enjoied / enjoyed] Korean food.", "enjoied", "enjoyed", 2),
        ("I [visited / visiteed] my grandmother last month.", "visited", "visiteed", 1),
        ("My friend and I [eated / ate] dessert after dinner.", "eated", "ate", 2),
        ("I [carryed / carried] the box to my room.", "carryed", "carried", 2),
        ("The students [read / readed] books in the library.", "read", "readed", 1),
        ("We [buyed / bought] some fresh fruits.", "buyed", "bought", 2),
    ]
    items = [
        _mc_bracket(p, a, b, ai, sec, f"A{i}", f"a{i:02d}")
        for i, (p, a, b, ai) in enumerate(wb_u2a, 1)
    ]
    out["wb-c02-u2-A.json"] = _doc(
        "wb-c02-u2-A.json",
        wm,
        practice_id="cm1:wb-c02:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="일반동사의 과거형 · POINT 3·4 (WB p. 10)",
        pages="10",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 동사의 과거형을 바르게 고쳐 쓰세요.",
        CORR,
        "words",
        labels_az("B", 10),
        "POINT 3·4",
    )
    wb_b2 = [
        ("Flora [helpped] her mom last weekend.", "helped"),
        ("Tanya [calld] me this morning.", "called"),
        ("Mary [studyed] math yesterday.", "studied"),
        ("I [arriveed] home safely.", "arrived"),
        ("Tom [hurryed] back to his seat.", "hurried"),
        ("Homer soon [regreted] his words.", "regretted"),
        ("The train [stoped] at the station.", "stopped"),
        ("I [askd] him a question.", "asked"),
        ("Harry [changeed] his job two weeks ago.", "changed"),
        ("A year ago, I [staied] in London for a week.", "stayed"),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(wb_b2, 1)
    ]
    out["wb-c02-u2-B.json"] = _doc(
        "wb-c02-u2-B.json",
        wm,
        practice_id="cm1:wb-c02:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="일반동사의 과거형 · POINT 3·4 (WB p. 10)",
        pages="10",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 문장을 <보기>와 같이 과거형으로 고쳐 쓰세요.",
        WR,
        "words",
        labels_az("C", 7),
        "POINT 3·4",
    )
    wb_c2 = [
        ("Sally jogs every morning.\n→ Sally ________ yesterday morning.", ["jogged"]),
        ("Timmy and I play baseball on weekends.\n→ Timmy and I ________ baseball last Sunday.", ["played"]),
        (
            "The restaurant has many customers on every holiday.\n→ The restaurant ________ many customers today.",
            ["had"],
        ),
        (
            "My sister does her homework every night.\n→ My sister ________ her homework last night.",
            ["did"],
        ),
        ("Sora studies English every day.\n→ Sora ________ English this morning.", ["studied"]),
        (
            "Kate watches TV every night.\n→ Kate ________ TV all day long yesterday.",
            ["watched"],
        ),
        (
            "Jina reads a lot of books every month.\n→ Jina ________ a lot of books during the last vacation.",
            ["read"],
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_c2, 1)
    ]
    out["wb-c02-u2-C.json"] = _doc(
        "wb-c02-u2-C.json",
        wm,
        practice_id="cm1:wb-c02:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="일반동사의 과거형 · POINT 3·4 (WB p. 11)",
        pages="11",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 빈칸에 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("D", 6),
        "POINT 3·4",
    )
    wb_d2 = [
        ("Emma ________ the cake in half. (cut)", ["cut"]),
        ("Mina ________ Peter at the supermarket. (meet)", ["met"]),
        ("I ________ to the pool last Saturday. (go)", ["went"]),
        ("Many foreigners ________ Korean very hard. (study)", ["studied"]),
        ("Mike ________ some flowers to his mom. (give)", ["gave"]),
        ("Jack ________ with my new plan. (agree)", ["agreed"]),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_d2, 1)
    ]
    out["wb-c02-u2-D.json"] = _doc(
        "wb-c02-u2-D.json",
        wm,
        practice_id="cm1:wb-c02:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="일반동사의 과거형 · POINT 3·4 (WB p. 11)",
        pages="11",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    # --- WB Unit 3 (pp. 12–13) ---
    sec = section(
        "A",
        "Section A",
        "다음 문장을 부정문으로 바꿔 쓰세요.",
        WR2,
        "words",
        labels_az("A", 8),
        "POINT 5",
    )
    wb_a3 = [
        ("Lisa eats nuts.\n→ Lisa ________ ________ nuts.", ["doesn't|eat", "does not|eat"]),
        ("Mike watches TV.\n→ Mike ________ ________ TV.", ["doesn't|watch", "does not|watch"]),
        (
            "We have enough food for the guests.\n→ We ________ ________ enough food for the guests.",
            ["don't|have", "do not|have"],
        ),
        (
            "I brush my hair with a comb.\n→ I ________ ________ my hair with a comb.",
            ["don't|brush", "do not|brush"],
        ),
        (
            "John gets up early.\n→ John ________ ________ ________ early.",
            ["doesn't|get|up", "does not|get|up"],
        ),
        (
            "Mary and Tom like hamburgers.\n→ Mary and Tom ________ ________ hamburgers.",
            ["don't|like", "do not|like"],
        ),
        (
            "Susan lives with her parents.\n→ Susan ________ ________ ________ with her parents.",
            ["doesn't|live|", "does not|live", "does|not|live"],
        ),
        (
            "Patrick has much money.\n→ Patrick ________ ________ ________ much money.",
            ["doesn't|have|", "does not|have", "does|not|have"],
        ),
    ]
    items = []
    for i, (p, acc) in enumerate(wb_a3, 1):
        blanks = 3 if p.count("________") >= 3 else 2
        items.append(fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, blanks=blanks, accept=acc))
    out["wb-c02-u3-A.json"] = _doc(
        "wb-c02-u3-A.json",
        wm,
        practice_id="cm1:wb-c02:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="일반동사의 부정문과 의문문 · POINT 5 (WB p. 12)",
        pages="12",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 응답을 보고 Do 또는 Does를 사용하여 다음 의문문을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 6),
        "POINT 6",
    )
    wb_b3 = [
        (
            "A: ________ she ________ a walk every day?\nB: Yes, she does. She takes a walk every day.",
            ["Does|take"],
            2,
        ),
        (
            "A: ________ you ________ sports?\nB: No, I don't. I don't like sports.",
            ["Do|like"],
            2,
        ),
        (
            "A: ________ your brother ________ ________ very well?\nB: Yes, he does. He swims very well.",
            ["Does|swim"],
            3,
        ),
        (
            "A: ________ they ________ TV after dinner?\nB: No, they don't. They don't watch TV after dinner.",
            ["Do|watch"],
            2,
        ),
        (
            "A: ________ Tony ________ to school on foot?\nB: Yes, he does. He goes to school on foot.",
            ["Does|go"],
            2,
        ),
        (
            "A: ________ your parents ________ ________ you pocket money?\nB: No, they don't. They don't give me pocket money.",
            ["Do|give"],
            3,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, blanks=bl, accept=acc)
        for i, (p, acc, bl) in enumerate(wb_b3, 1)
    ]
    out["wb-c02-u3-B.json"] = _doc(
        "wb-c02-u3-B.json",
        wm,
        practice_id="cm1:wb-c02:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="일반동사의 부정문과 의문문 · POINT 6 (WB p. 12)",
        pages="12",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분을 어법상 알맞은 형태로 고쳐 쓰세요.",
        CORR,
        "words",
        labels_az("C", 10),
        "POINT 7·8",
    )
    wb_c3 = [
        ("Did you [enjoyed] the movie yesterday?", ["enjoy"]),
        ("Janet didn't [found] her keys in her pocket.", ["find"]),
        ("[Do] you see him last week?", ["Did"]),
        ("My mom [doesn't] wait for me yesterday.", ["didn't", "did not"]),
        ("[Does] Clara study math for the exam last night?", ["Did"]),
        ("He [doesn't] visit his grandmother last Sunday.", ["didn't", "did not"]),
        ("Did you [got up] early in the morning?", ["get up"]),
        ("She didn't [has] any friends here in the past.", ["have"]),
        ("We [don't] make noise last night.", ["didn't", "did not"]),
        ("[Do] you and your friend go to the park yesterday?", ["Did"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_c3, 1)
    ]
    out["wb-c02-u3-C.json"] = _doc(
        "wb-c02-u3-C.json",
        wm,
        practice_id="cm1:wb-c02:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="일반동사의 부정문과 의문문 · POINT 7·8 (WB p. 13)",
        pages="13",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 7),
        "POINT 7·8",
    )
    wb_d3 = [
        (
            "그가 어제 창문을 깼니?\n(the window, break)\n→ ________ yesterday?",
            ["Did he break the window?", "Did he break the window"],
        ),
        (
            "Sally는 어젯밤에 만화책을 읽지 않았다.\n(read, the comic book)\n→ Sally ________ last night.",
            ["Sally didn't read the comic book last night.", "Sally did not read the comic book last night."],
        ),
        (
            "그들은 어젯밤에 TV로 농구 경기를 봤니?\n(they, watch)\n→ ________ the basketball game on TV last night?",
            ["Did they watch the basketball game on TV last night?", "Did they watch"],
        ),
        (
            "Mary는 어제 숙제를 하지 않았다.\n(her homework, do)\n→ Mary ________ yesterday.",
            ["Mary didn't do her homework yesterday.", "Mary did not do her homework yesterday."],
        ),
        (
            "나는 지난 주말에 내 방을 청소하지 않았다.\n(clean, my room)\n→ I ________ last weekend.",
            ["I didn't clean my room last weekend.", "I did not clean my room last weekend."],
        ),
        (
            "너는 오늘 아침에 버스 정류장에서 Nancy를 만났니?\n(you, meet)\n→ ________ Nancy at the bus stop this morning?",
            ["Did you meet Nancy at the bus stop this morning?", "Did you meet"],
        ),
        (
            "나는 어제 그의 이름을 기억하지 못했다.\n(remember, his name)\n→ I ________ yesterday.",
            ["I didn't remember his name yesterday.", "I did not remember his name yesterday."],
        ),
    ]
    items = [
        sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb_d3, 1)
    ]
    out["wb-c02-u3-D.json"] = _doc(
        "wb-c02-u3-D.json",
        wm,
        practice_id="cm1:wb-c02:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="일반동사의 부정문과 의문문 · POINT 7·8 (WB p. 13)",
        pages="13",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    # --- WB Chapter Test (pp. 14–15) ---
    wsecs = [
        section(
            "1-3",
            "[1–3]",
            "[1–3] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(3),
        ),
        section(
            "4-5",
            "[4–5]",
            "[4–5] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 4),
        ),
        section(
            "6",
            "[6]",
            "[6] 다음 표를 보고 문장을 완성하세요.",
            WR2,
            "words",
            ["6"],
        ),
        section(
            "7",
            "[7]",
            "[7] 다음 중 대화가 어색한 것을 고르세요.",
            MC,
            "choice",
            ["7"],
        ),
        section(
            "8-9",
            "[8–9]",
            "[8–9] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 8),
        ),
        section(
            "10",
            "[10]",
            "[10] 다음 중 빈칸에 Does를 쓸 수 없는 것을 고르세요.",
            MC,
            "choice",
            ["10"],
        ),
        section(
            "11-12",
            "[11–12]",
            "[11–12] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(2, 11),
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 중 표의 내용과 일치하지 않는 것을 모두 고르세요.",
            MC,
            "choice",
            ["13"],
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 찾아 그 기호를 쓰고 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["14"],
        ),
    ]
    witems: list = [
        mc_item(
            iid="q01",
            sec=wsecs[0],
            label="1",
            prompt_en="· She (A) a new backpack.\n· He (B) some water.",
            choices=["have — drink", "has — drink", "have — drinks", "has — drinks", "has — drinkes"],
            answer_index=4,
        ),
        mc_item(
            iid="q02",
            sec=wsecs[0],
            label="2",
            prompt_en="· My father (A) his car at home last Sunday.\n· Judy (B) TV every night.",
            choices=["wash — watch", "washed — watch", "washes — watches", "washed — watches", "washes — watches"],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=wsecs[0],
            label="3",
            prompt_en="· They (A) a great time last night.\n· We (B) do anything yesterday.",
            choices=["have — don't", "has — didn't", "had — don't", "have — didn't", "had — didn't"],
            answer_index=5,
        ),
        mc_item(
            iid="q04",
            sec=wsecs[1],
            label="4",
            prompt_en="They ________ yesterday.",
            choices=["read books", "didn't make a cake", "played tennis", "don't go out", "stayed at home"],
            answer_index=4,
        ),
        mc_item(
            iid="q05",
            sec=wsecs[1],
            label="5",
            prompt_en="My friends and I ________ together last week.",
            choices=[
                "studyed science",
                "had a great dinner",
                "went to the movies",
                "spent a wonderful time",
                "talked about our winter camp",
            ],
            answer_index=1,
        ),
        fill_item(
            iid="q06",
            sec=wsecs[2],
            label="6",
            prompt_en="(Emily: free time → bake cookies; Jake: after school → do club activities; Jake & Dan: free time → play video games)\n(1) Emily ________ in her free time.\n(2) Jake ________ after school.\n(3) Jake and Dan ________ in their free time.",
            blanks=3,
            accept=["bakes cookies|does club activities|play video games"],
        ),
        mc_item(
            iid="q07",
            sec=wsecs[3],
            label="7",
            prompt_en="",
            choices=[
                "A: Do you live in Busan? B: No, I don't. I live in Seoul.",
                "A: Does she like movies? B: No, she doesn't. She likes sports.",
                "A: Does your uncle teach English? B: No, he don't. He teaches math.",
                "A: Does Sue play the piano? B: Yes, she does. She plays the piano very well.",
                "A: Do you and your brother exercise every day? B: Yes, we do. We ride bikes every evening.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q08",
            sec=wsecs[4],
            label="8",
            prompt_en="Amy는 공부를 열심히 하지 않는다.",
            choices=[
                "Amy don't study hard.",
                "Amy didn't study hard.",
                "Amy don't studies hard.",
                "Amy doesn't study hard.",
                "Amy doesn't studies hard.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q09",
            sec=wsecs[4],
            label="9",
            prompt_en="우리는 어제 Sam을 만나지 않았다.",
            choices=[
                "We met not Sam yesterday.",
                "We didn't met Sam yesterday.",
                "We don't meet Sam yesterday.",
                "We didn't meet Sam yesterday.",
                "We doesn't met Sam yesterday.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q10",
            sec=wsecs[5],
            label="10",
            prompt_en="",
            choices=[
                "________ he teach Korean?",
                "________ she live in Seoul?",
                "________ you have a cell phone?",
                "________ Ms. Baker have any children?",
                "________ your father work in a hospital?",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q11",
            sec=wsecs[6],
            label="11",
            prompt_en="",
            choices=[
                "Does Jina studies Japanese?",
                "She doesn't swim in the pool.",
                "We don't like computer games.",
                "Mr. Kim teaches Korean history.",
                "Do you really get up at five in the morning?",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q12",
            sec=wsecs[6],
            label="12",
            prompt_en="",
            choices=[
                "Does he have a fever now?",
                "Do they carry the box together?",
                "Did she go to bed early last night?",
                "Minho washed his bike this morning.",
                "Cindy didn't sent me a Christmas card last year.",
            ],
            answer_index=5,
        ),
        choose_all_item(
            iid="q13",
            sec=wsecs[7],
            label="13",
            prompt_en="Ken: cook✔ walk✔ bus✘ wash✔ exercise✘ | Jim: cook✘ walk✘ bus✔ wash✘ exercise✔ | Joe: cook✔ walk✘ bus✔ wash✔ exercise✘\n① Jim exercises every day.\n② Ken cooks in the kitchen.\n③ Ken and Joe walk to school.\n④ Jim doesn't wash the dishes.\n⑤ Joe doesn't go to school by bus.",
            accept_pairs=[("3", "5"), ("5", "3")],
        ),
        fill_item(
            iid="q14",
            sec=wsecs[8],
            label="14",
            prompt_en="Yejin ⓐ went to the shopping mall with her sister last Saturday. She ⓑ saw pretty shoes. But she didn't ⓒ bring her wallet from home. So her sister ⓓ lended the money to her. She ⓔ wore new shoes.",
            blanks=2,
            accept=["ⓓ|lent", "d|lent", "④|lent"],
        ),
    ]
    out["wb-c02-test.json"] = _doc(
        "wb-c02-test.json",
        wm,
        practice_id="cm1:wb-c02:test",
        title="WB Chapter Test",
        subtitle="Chapter 02 일반동사 (WB p. 14–15)",
        pages="14–15",
        timer_minutes=28,
        sections=wsecs,
        items=witems,
        test_id="wb-c02-test",
    )

    return out


def build_ch03() -> dict[str, dict]:
    """SB + WB chapter 03 (16 JSON files)."""
    out: dict[str, dict] = {}
    m = sb(3, "현재진행형과 미래 표현")
    wm = wb(3, "현재진행형과 미래 표현")

    # --- SB Unit 1 (p. 36) ---
    sec = section(
        "A",
        "Section A",
        "주어진 동사를 사용하여 다음 문장을 괄호 안의 지시대로 쓰세요.",
        WR2,
        "words",
        labels_az("A", 3),
        "POINT 1·2·3",
    )
    u1a = [
        (
            "(wash)\nMinsu ________ his dog now. (현재진행)\nMinsu ________ his dog now. (현재진행 부정문)\n________ Minsu ________ his dog now? (현재진행 의문문)",
            ["is|washing|isn't|washing|Is|washing", "is|washing|is not|washing|Is|washing"],
            6,
        ),
        (
            "(make)\nAnna ________ a shopping list. (현재진행)\nAnna ________ a shopping list. (현재진행 부정문)\n________ Anna ________ a shopping list? (현재진행 의문문)",
            ["is|making|isn't|making|Is|making", "is|making|is not|making|Is|making"],
            6,
        ),
        (
            "(put)\nThey ________ puzzle pieces together. (현재진행)\nThey ________ puzzle pieces together. (현재진행 부정문)\n________ they ________ puzzle pieces together? (현재진행 의문문)",
            ["are|putting|aren't|putting|Are|putting", "are|putting|are not|putting|Are|putting"],
            6,
        ),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, blanks=bl, accept=acc)
        for i, (p, acc, bl) in enumerate(u1a, 1)
    ]
    out["c03-u1-A.json"] = _doc(
        "c03-u1-A.json",
        m,
        practice_id="cm1:c03:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="현재진행형 · POINT 1·2·3 (p. 36)",
        pages="36",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "우리말과 일치하도록 주어진 단어를 사용하여 빈칸을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 2·3",
    )
    u1b = [
        (
            "우리는 지금 경기에 이기고 있지 않다.\n(win)\n→ We ________ ________ ________ the game right now.",
            ["aren't|winning", "are not|winning"],
            3,
        ),
        (
            "그가 지금 우리에게 거짓말하고 있니?\n(lie)\n→ ________ he ________ to us now?",
            ["Is|lying"],
            2,
        ),
        (
            "그 아기들은 이제 울고 있지 않다.\n(cry)\n→ The babies ________ ________ ________ now.",
            ["aren't|crying", "are not|crying"],
            3,
        ),
        (
            "그들이 그 나무에 올라가고 있니?\n(climb)\n→ ________ they ________ the tree?",
            ["Are|climbing"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, blanks=bl, accept=acc)
        for i, (p, acc, bl) in enumerate(u1b, 1)
    ]
    out["c03-u1-B.json"] = _doc(
        "c03-u1-B.json",
        m,
        practice_id="cm1:c03:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="현재진행형 · POINT 2·3 (p. 36)",
        pages="36",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분이 맞으면 ○, 틀리면 × 하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("C", 7),
        "POINT 1·2·3",
    )
    u1c = [
        ("Is Andy [enjoying] the party with his friends?", "O"),
        ("I [am drawing] frogs with a green pen.", "O"),
        ("Sally [not is talking] on the phone.", "isn't talking"),
        ("The boys [is running] really fast.", "are running"),
        ("She [is danceing] in the living room.", "is dancing"),
        ("Is he [does] well in his school?", "doing"),
        ("[Are you using] the computer now?", "O"),
    ]
    items = [
        fill_item(
            iid=f"c{i:02d}",
            sec=sec,
            label=f"C{i}",
            prompt_en=p,
            accept=_ox_accept(a) if a == "O" else [a, a.replace("isn't", "is not")],
        )
        for i, (p, a) in enumerate(u1c, 1)
    ]
    out["c03-u1-C.json"] = _doc(
        "c03-u1-C.json",
        m,
        practice_id="cm1:c03:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="현재진행형 · POINT 1·2·3 (p. 36)",
        pages="36",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    # --- SB Unit 2 (p. 39) ---
    sec = section(
        "A",
        "Section A",
        "다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 4·5",
    )
    u2a = [
        ("They prepare a special dinner.\n→ They ________ a special dinner. (be going to 긍정문)", ["are going to prepare"]),
        ("Aunt Polly takes me to Paris.\n→ Aunt Polly ________ me to Paris. (will 부정문)", ["won't take", "will not take"]),
        ("She decorates a Christmas tree.\n→ ________ a Christmas tree? (will 의문문)", ["Will she decorate"]),
        ("We travel to Brazil.\n→ We ________ to Brazil. (be going to 부정문)", ["aren't going to travel", "are not going to travel"]),
        ("Fred waits for me after school.\n→ Fred ________ for me after school. (will 긍정문)", ["will wait"]),
        ("He reads a history book.\n→ ________ a history book? (be going to 의문문)", ["Is he going to read"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=[a[0]] if len(a) == 1 else a)
        for i, (p, a) in enumerate(u2a, 1)
    ]
    out["c03-u2-A.json"] = _doc(
        "c03-u2-A.json",
        m,
        practice_id="cm1:c03:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="미래 표현 · POINT 4·5 (p. 39)",
        pages="39",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 부분을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("B", 5),
        "POINT 4·5",
    )
    u2b = [
        ("[Are going to you cross] the street?", ["Are you going to cross"]),
        ("Dave and I [will playing] badminton this afternoon.", ["will play"]),
        ("My family [will going to raise] a pet.", ["are going to raise", "is going to raise"]),
        ("My grandma [willn't sell] her house.", ["won't sell", "will not sell"]),
        ("Jenny [is going not to cook] spaghetti for dinner.", ["is not going to cook", "isn't going to cook"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(u2b, 1)
    ]
    out["c03-u2-B.json"] = _doc(
        "c03-u2-B.json",
        m,
        practice_id="cm1:c03:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="미래 표현 · POINT 4·5 (p. 39)",
        pages="39",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR,
        "words",
        labels_az("C", 5),
        "POINT 4·5",
    )
    u2c = [
        (
            "너는 치과에 갈 거니?\n(be going to, go)\n→ ________ to the dentist?",
            ["Are you going to go", "Are you going to go to the dentist"],
        ),
        (
            "우리는 일주일 안에 숙제를 마칠 것이다.\n(be going to, finish)\n→ We ________ our homework in a week.",
            ["are going to finish"],
        ),
        (
            "나는 오늘 그에게 전화하지 않을 것이다.\n(will, call)\n→ I ________ him today.",
            ["won't call", "will not call"],
        ),
        (
            "너는 5시에 Susan을 만날 거니?\n(will, meet)\n→ ________ Susan at 5?",
            ["Will you meet"],
        ),
        (
            "그들은 제주도에서 묵지 않을 것이다.\n(be going to, stay)\n→ They ________ in Jeju-do.",
            ["aren't going to stay", "are not going to stay"],
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a if isinstance(a, list) else [a])
        for i, (p, a) in enumerate(u2c, 1)
    ]
    out["c03-u2-C.json"] = _doc(
        "c03-u2-C.json",
        m,
        practice_id="cm1:c03:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="미래 표현 · POINT 4·5 (p. 39)",
        pages="39",
        timer_minutes=20,
        sections=[sec],
        items=items,
    )

    # --- SB Chapter Test (pp. 40–41) ---
    tsecs = [
        section("1", "[1]", "[1] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 고르세요.", MC, "choice", ["1"]),
        section(
            "2-3",
            "[2–3]",
            "[2–3] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 2),
        ),
        section(
            "4-5",
            "[4–5]",
            "[4–5] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(2, 4),
        ),
        section(
            "6",
            "[6]",
            "[6] 다음 질문에 대한 대답으로 가장 적절한 것을 고르세요.",
            MC,
            "choice",
            ["6"],
        ),
        section(
            "7-8",
            "[7–8]",
            "[7–8] 다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.",
            SENT,
            "sentence",
            labels_num(2, 7),
        ),
        section(
            "9",
            "[9]",
            "[9] 다음 중 어법상 알맞은 문장 두 개를 고르세요.",
            MC,
            "choice",
            ["9"],
        ),
        section(
            "10",
            "[10]",
            "[10] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.",
            MC,
            "choice",
            ["10"],
        ),
        section(
            "11",
            "[11]",
            "[11] 다음 일정표를 보고 <보기>와 같이 be going to를 사용하여 문장을 완성하세요.",
            SENT,
            "sentence",
            ["11"],
        ),
        section(
            "12-13",
            "[12–13]",
            "[12–13] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
            SENT,
            "sentence",
            labels_num(2, 12),
        ),
        section(
            "14-15",
            "[14–15]",
            "[14–15] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            labels_num(2, 14),
        ),
        section(
            "16",
            "[16]",
            "[16] 다음 그림을 보고 진행형과 주어진 단어를 사용하여 질문에 알맞은 대답을 완성하세요.",
            WR,
            "words",
            ["16"],
        ),
        section(
            "17",
            "[17]",
            "[17] 다음 중 어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["17"],
        ),
    ]
    titems: list = [
        mc_item(
            iid="q01",
            sec=tsecs[0],
            label="1",
            prompt_en="",
            choices=[
                "He is swiming in the lake.",
                "I'm takeing pictures of flowers.",
                "The little girl is crying in the bus.",
                "It is rainning outside now.",
                "The tree is dyeing.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=tsecs[1],
            label="2",
            prompt_en="· Jake is (A) orange juice.\n· They will (B) at two o'clock.",
            choices=["drink — meet", "drink — meeting", "drinks — meet", "drinking — meet", "drinking — meeting"],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=tsecs[1],
            label="3",
            prompt_en="· It won't (A) this afternoon.\n· What are you (B) to do tomorrow?",
            choices=["snow — go", "snow — going", "snows — go", "snows — going", "snowing — going"],
            answer_index=2,
        ),
        mc_item(
            iid="q04",
            sec=tsecs[2],
            label="4",
            prompt_en="",
            choices=[
                "I'm watching a blue bird.",
                "Are you going to school now?",
                "They're not talking to each other.",
                "He is writing an email to Jenny.",
                "Mike isn't exercise right now.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q05",
            sec=tsecs[2],
            label="5",
            prompt_en="",
            choices=[
                "I won't go out for lunch today.",
                "Is he going to go to the beach?",
                "Will you be at home this evening?",
                "He'll goes to the concert next month.",
                "She's not going to wear the dress at the party.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q06",
            sec=tsecs[3],
            label="6",
            prompt_en="A: Are they going to leave tomorrow?\nB: ________. They will stay two more nights.",
            choices=["Yes, they do", "No, they don't", "Yes, they are", "No, they aren't", "Yes, they will"],
            answer_index=4,
        ),
        sent_item(
            iid="q07",
            sec=tsecs[4],
            label="7",
            prompt_en="Ann lies on the grass in the park. (진행형으로)",
            accept=["Ann is lying on the grass in the park.", "Ann is lying on the grass in the park."],
        ),
        sent_item(
            iid="q08",
            sec=tsecs[4],
            label="8",
            prompt_en="Fred is going to learn Korean this summer. (be going to 의문문으로)",
            accept=["Is Fred going to learn Korean this summer?", "Is Fred going to learn Korean this summer?"],
        ),
        choose_all_item(
            iid="q09",
            sec=tsecs[5],
            label="9",
            prompt_en="① She is standing on the rock.\n② She's enjoying not the concert.\n③ Is the boys playing soccer now?\n④ Are you going to meet Mr. Brown?\n⑤ I'll having a party with my friends.",
            accept_pairs=[("1", "4"), ("4", "1")],
        ),
        mc_item(
            iid="q10",
            sec=tsecs[6],
            label="10",
            prompt_en="",
            choices=[
                "The man is read a magazine.",
                "He'll looking out of the window.",
                "Is Owen washing the dishes?",
                "She is listening not to me right now.",
                "My sister and I am cleaning our room.",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q11",
            sec=tsecs[7],
            label="11",
            prompt_en="A: What are you going to do on Friday?\nB: (go to the movies)",
            accept=[
                "I am going to go to the movies.",
                "I'm going to go to the movies.",
                "I am going to the movies.",
                "I'm going to the movies.",
            ],
        ),
        sent_item(
            iid="q12",
            sec=tsecs[8],
            label="12",
            prompt_en="너는 한국에 돌아올 거니?\n(Korea / you / will / to / back / come)",
            accept=["Will you come back to Korea?", "Will you come back to Korea"],
        ),
        sent_item(
            iid="q13",
            sec=tsecs[8],
            label="13",
            prompt_en="우리는 오늘밤에 외식하지 않을 것이다.\n(not / tonight / eat out / to / are / going / we)",
            accept=[
                "We are not going to eat out tonight.",
                "We're not going to eat out tonight.",
            ],
        ),
        fill_item(
            iid="q14",
            sec=tsecs[9],
            label="14",
            prompt_en="The boy is useing the glue.",
            blanks=2,
            accept=["useing|using", "The boy is useing|The boy is using"],
        ),
        fill_item(
            iid="q15",
            sec=tsecs[9],
            label="15",
            prompt_en="A: What will robots do in the future?\nB: Robots will helped students with their studies.",
            blanks=2,
            accept=["helped|help", "will helped|will help"],
        ),
        fill_item(
            iid="q16",
            sec=tsecs[10],
            label="16",
            prompt_en="A: Is your brother outside?\nB: Yes, he is. ________ outside. (ride a bike)",
            accept=["He is riding a bike", "He's riding a bike"],
        ),
        mc_item(
            iid="q17",
            sec=tsecs[11],
            label="17",
            prompt_en="ⓐ David is studying at his desk.\nⓑ Minju is runing around the playground.\nⓒ I'm going to buy a new bag last week.\nⓓ She is going to bake a cake for my birthday.\nⓔ Paul and I am going to visit Japan next month.",
            choices=["ⓐ, ⓒ", "ⓐ, ⓓ", "ⓑ, ⓓ", "ⓑ, ⓒ, ⓔ", "ⓒ, ⓓ, ⓔ"],
            answer_index=2,
        ),
    ]
    out["c03-test.json"] = _doc(
        "c03-test.json",
        m,
        practice_id="cm1:c03:test",
        title="Chapter Test",
        subtitle="Chapter 03 현재진행형과 미래 표현 (p. 40–41)",
        pages="40–41",
        timer_minutes=28,
        sections=tsecs,
        items=titems,
        test_id="c03-test",
    )

    # --- WB Unit 1 (pp. 16–17) ---
    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 동사를 현재진행형으로 바꿔 쓰세요.",
        WR,
        "words",
        labels_az("A", 8),
        "POINT 1",
    )
    wba = [
        ("She [drinks] a cup of milk.", ["is drinking"]),
        ("The boy [smells] the flower.", ["is smelling"]),
        ("The children [jump] with joy.", ["are jumping"]),
        ("My parents [ride] horses.", ["are riding"]),
        ("The leaves [fall] from the tree.", ["are falling"]),
        ("I [jog] in the park with my sister.", ["am jogging"]),
        ("Fiona [lies] on the bed.", ["is lying"]),
        ("Jake [plans] for this winter.", ["is planning"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wba, 1)
    ]
    out["wb-c03-u1-A.json"] = _doc(
        "wb-c03-u1-A.json",
        wm,
        practice_id="cm1:wb-c03:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="현재진행형 · POINT 1 (WB p. 16)",
        pages="16",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "다음 현재진행형 문장을 괄호 안의 지시대로 바꿔 쓰세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 2·3",
    )
    wbb = [
        (
            "Jihun is kicking a ball now.\n→ Jihun ________ ________ a ball now. (부정문)\n→ ________ Jihun ________ a ball now? (의문문)",
            ["isn't|kicking|Is|kicking", "is not|kicking|Is|kicking"],
            4,
        ),
        (
            "They are asking many questions to their teacher.\n→ They ________ ________ many questions to their teacher. (부정문)\n→ ________ they ________ many questions to their teacher? (의문문)",
            ["aren't|asking|Are|asking", "are not|asking|Are|asking"],
            4,
        ),
        (
            "The police officer is stopping cars.\n→ The police officer ________ ________ cars. (부정문)\n→ ________ the police officer ________ cars? (의문문)",
            ["isn't|stopping|Is|stopping", "is not|stopping|Is|stopping"],
            4,
        ),
        (
            "Birds are flying high in the sky.\n→ Birds ________ ________ high in the sky. (부정문)\n→ ________ birds ________ high in the sky? (의문문)",
            ["aren't|flying|Are|flying", "are not|flying|Are|flying"],
            4,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, blanks=bl, accept=acc)
        for i, (p, acc, bl) in enumerate(wbb, 1)
    ]
    out["wb-c03-u1-B.json"] = _doc(
        "wb-c03-u1-B.json",
        wm,
        practice_id="cm1:wb-c03:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="현재진행형 · POINT 2·3 (WB p. 16)",
        pages="16",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 동사의 현재진행형이 맞으면 ○, 틀리면 × 하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("C", 10),
        "POINT 1·2·3",
    )
    wbc = [
        ("He [are repairing] a laptop right now.", "is repairing"),
        ("We're [looking] for a small house with two rooms.", "O"),
        ("Some kids are [sing] in the classroom.", "singing"),
        ("Ms. Stevens [is driveing] a nice car.", "is driving"),
        ("Little Johnny [not is sleeping] on his bed.", "is not sleeping"),
        ("The scientist [is mixing] water with alcohol.", "O"),
        ("Jake and I [am waiting] for Judy right now.", "are waiting"),
        ("Some students [are listening not] to my speech.", "are not listening"),
        ("Two men [are painting] the wall now.", "O"),
        ("[Are you cutting] the paper with scissors?", "O"),
    ]
    items = [
        fill_item(
            iid=f"c{i:02d}",
            sec=sec,
            label=f"C{i}",
            prompt_en=p,
            accept=_ox_accept(a) if a == "O" else [a, a.replace("is not", "isn't")],
        )
        for i, (p, a) in enumerate(wbc, 1)
    ]
    out["wb-c03-u1-C.json"] = _doc(
        "wb-c03-u1-C.json",
        wm,
        practice_id="cm1:wb-c03:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="현재진행형 · POINT 1·2·3 (WB p. 17)",
        pages="17",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("D", 8),
        "POINT 1·2·3",
    )
    wbd = [
        ("그 여자는 양말을 팔고 있다.\n(sell)\n→ The woman ________ socks.", ["is selling"], 1),
        ("그 선수는 공을 패스하고 있다.\n(pass)\n→ The player ________ the ball.", ["is passing"], 1),
        ("나는 지금 내 신발 끈을 묶고 있다.\n(tie)\n→ I ________ my shoes now.", ["am tying"], 1),
        ("그는 샤워를 하고 있니?\n(take)\n→ ________ a shower?", ["Is he taking"], 1),
        (
            "우리 강아지는 전혀 아무것도 먹지 않고 있다.\n(eat)\n→ My puppy ________ anything at all.",
            ["isn't eating", "is not eating"],
            1,
        ),
        ("그들은 Peter와 이야기하고 있니?\n(talk)\n→ ________ they ________ with Peter?", ["Are|talking"], 2),
        (
            "나는 팀 과제에 관해 생각하고 있지 않다.\n(think)\n→ I ________ about the team project.",
            ["am not thinking", "amn't thinking"],
            1,
        ),
        (
            "그 소년들은 창문에 돌을 던지고 있다.\n(throw)\n→ The boys ________ stones at the window.",
            ["are throwing"],
            1,
        ),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, blanks=bl, accept=acc)
        for i, (p, acc, bl) in enumerate(wbd, 1)
    ]
    out["wb-c03-u1-D.json"] = _doc(
        "wb-c03-u1-D.json",
        wm,
        practice_id="cm1:wb-c03:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="현재진행형 · POINT 1·2·3 (WB p. 17)",
        pages="17",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    # --- WB Unit 2 (pp. 18–19) ---
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 8),
        "POINT 4·5",
    )
    wb2a = [
        ("I [am not / won't] forget you.", "am not", "won't", 2),
        ("He will [is / be] 15 years old next year.", "is", "be", 2),
        ("Mike [is going to do / are going to do] magic at the party.", "is going to do", "are going to do", 1),
        ("I [will going to / am going to] make some sandwiches.", "will going to", "am going to", 2),
        ("Vicky [isn't going to / doesn't going to] buy a new computer.", "isn't going to", "doesn't going to", 1),
        ("[Will arrive the train / Will the train arrive] at the station soon?", "Will arrive the train", "Will the train arrive", 2),
        ("Are you [going to learn / going to learning] English from Mr. Smith?", "going to learn", "going to learning", 1),
        ("Is Jim [going to go / go to going] with you?", "going to go", "go to going", 1),
    ]
    items = [
        _mc_bracket(p, a, b, ai, sec, f"A{i}", f"a{i:02d}")
        for i, (p, a, b, ai) in enumerate(wb2a, 1)
    ]
    out["wb-c03-u2-A.json"] = _doc(
        "wb-c03-u2-A.json",
        wm,
        practice_id="cm1:wb-c03:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="미래 표현 · POINT 4·5 (WB p. 18)",
        pages="18",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "B",
        "Section B",
        "다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.",
        WR,
        "words",
        labels_az("B", 8),
        "POINT 4·5",
    )
    wb2b = [
        ("She stays at her aunt's home.\n→ She ________ at her aunt's home. (will 부정문)", ["won't stay", "will not stay"]),
        ("Our baseball team wins the game.\n→ Our baseball team ________ the game. (be going to 긍정문)", ["is going to win"]),
        ("Miso dances at the school festival.\n→ Miso ________ at the school festival. (be going to 부정문)", ["isn't going to dance", "is not going to dance"]),
        ("I am late for the meeting.\n→ I ________ late for the meeting. (will 부정문)", ["won't be", "will not be"]),
        ("They come to my Christmas party.\n→ ________ to my Christmas party? (will 의문문)", ["Will they come"]),
        ("Andy studies art in New York City.\n→ ________ art in New York City? (be going to 의문문)", ["Is Andy going to study"]),
        ("I take a nap after lunch.\n→ I ________ after lunch. (will 긍정문)", ["will take a nap"]),
        (
            "He spends all the money on clothes.\n→ He ________ all the money on clothes. (be going to 부정문)",
            ["isn't going to spend", "is not going to spend"],
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb2b, 1)
    ]
    out["wb-c03-u2-B.json"] = _doc(
        "wb-c03-u2-B.json",
        wm,
        practice_id="cm1:wb-c03:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="미래 표현 · POINT 4·5 (WB p. 18)",
        pages="18",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("C", 10),
        "POINT 4·5",
    )
    wb2c = [
        ("The weather [not will be] fine today.", ["won't be", "will not be"]),
        ("Fred and Jenny [is going to exercise] together.", ["are going to exercise"]),
        ("I [will eating] a hamburger with French fries.", ["will eat"]),
        ("[Are you going give] the book to me?", ["Are you going to give"]),
        ("Dad [is going to buys] a bike for me.", ["is going to buy"]),
        ("I [amn't going to lend] any money to him.", ["am not going to lend", "amn't going to lend"]),
        ("[You ask will] for Amy's phone number?", ["Will you ask"]),
        ("[Are Linda going to study] in France?", ["Is Linda going to study"]),
        ("[Will the war ends] in the country?", ["Will the war end"]),
        ("Are you [going to growing] tomatoes in the garden?", ["going to grow"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb2c, 1)
    ]
    out["wb-c03-u2-C.json"] = _doc(
        "wb-c03-u2-C.json",
        wm,
        practice_id="cm1:wb-c03:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="미래 표현 · POINT 4·5 (WB p. 19)",
        pages="19",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR,
        "words",
        labels_az("D", 8),
        "POINT 4·5",
    )
    wb2d = [
        ("그들은 그 남자를 믿을 것이다.\n(will, trust)\n→ They ________ the man.", ["will trust"]),
        (
            "어떤 새들은 겨울에 남쪽으로 날아갈 것이다.\n(be going to, fly)\n→ Some birds ________ south in winter.",
            ["are going to fly"],
        ),
        ("Mike는 종일 도서관에 있을까?\n(be going to, be)\n→ ________ at the library all day?", ["Is Mike going to be"]),
        (
            "Sally는 이번 주말에 미술관에 가지 않을 것이다.\n(be going to, visit)\n→ Sally ________ the art museum this weekend.",
            ["isn't going to visit", "is not going to visit"],
        ),
        ("내 숙제를 좀 도와줄래?\n(will, help)\n→ ________ me with my homework?", ["Will you help"]),
        (
            "송 선생님은 우리에게 새로운 노래를 가르쳐 주실 것이다.\n(be going to, teach)\n→ Mr. Song ________ new songs to us.",
            ["is going to teach"],
        ),
        ("나는 다시는 거짓말하지 않을 것이다.\n(will, tell)\n→ ________ a lie again.", ["I won't tell", "I will not tell"]),
        (
            "너는 네 강아지를 동물 병원에 데려갈 거니?\n(be going to, take)\n→ ________ your puppy to the animal hospital?",
            ["Are you going to take"],
        ),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wb2d, 1)
    ]
    out["wb-c03-u2-D.json"] = _doc(
        "wb-c03-u2-D.json",
        wm,
        practice_id="cm1:wb-c03:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="미래 표현 · POINT 4·5 (WB p. 19)",
        pages="19",
        timer_minutes=22,
        sections=[sec],
        items=items,
    )

    # --- WB Chapter Test (pp. 20–21) ---
    wtsecs = [
        section(
            "1-3",
            "[1–3]",
            "[1–3] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(3),
        ),
        section(
            "4-5",
            "[4–5]",
            "[4–5] 다음 중 밑줄 친 (A), (B)를 바르게 고쳐 쓴 것끼리 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 4),
        ),
        section(
            "6-7",
            "[6–7]",
            "[6–7] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            labels_num(2, 6),
        ),
        section(
            "8-9",
            "[8–9]",
            "[8–9] 다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.",
            SENT,
            "sentence",
            labels_num(2, 8),
        ),
        section(
            "10",
            "[10]",
            "[10] 다음 중 대화가 어법상 자연스러운 것을 고르세요.",
            MC,
            "choice",
            ["10"],
        ),
        section(
            "11-12",
            "[11–12]",
            "[11–12] 다음 중 어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 11),
        ),
        section(
            "13",
            "[13]",
            "[13] 주어진 단어를 사용하여 질문에 알맞은 대답을 완성하세요.",
            WR,
            "words",
            ["13"],
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 중 <보기>의 문장과 의미가 가장 비슷한 것을 고르세요.",
            MC,
            "choice",
            ["14"],
        ),
        section(
            "15",
            "[15]",
            "[15] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
            WR,
            "words",
            ["15"],
        ),
        section(
            "16",
            "[16]",
            "[16] 우리말과 일치하도록 주어진 단어를 사용하여 <조건>에 맞게 영작하세요.",
            SENT,
            "sentence",
            ["16"],
        ),
    ]
    wtitems: list = [
        mc_item(
            iid="q01",
            sec=wtsecs[0],
            label="1",
            prompt_en="",
            choices=[
                "I'm washing my hands.",
                "He's touching his nose.",
                "Sue isn't reading a book.",
                "Are your puppy sleeping now?",
                "Many people are following the parade.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q02",
            sec=wtsecs[0],
            label="2",
            prompt_en="",
            choices=[
                "I will buy those blue jeans.",
                "She will go not to school today.",
                "Are you going to close your shop?",
                "I'm going to watch a movie with Jack.",
                "Will you come to my house this evening?",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q03",
            sec=wtsecs[0],
            label="3",
            prompt_en="",
            choices=[
                "She is holding her baby.",
                "I'm drawing yellow flowers.",
                "The band is not play music now.",
                "Is it snowing outside right now?",
                "Are they standing there?",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q04",
            sec=wtsecs[1],
            label="4",
            prompt_en="· He is (A) prepare breakfast.\n· I'm going to (B) making special food.",
            choices=["prepares — make", "preparing — make", "prepares — makes", "preparing — makes", "prepareing — make"],
            answer_index=2,
        ),
        mc_item(
            iid="q05",
            sec=wtsecs[1],
            label="5",
            prompt_en="· It will (A) not raining today.\n· She is not (B) go to play the piano.",
            choices=["not rain — goes", "not rains — going", "not rain — going", "rain not — goes", "rain not — going"],
            answer_index=3,
        ),
        fill_item(
            iid="q06",
            sec=wtsecs[2],
            label="6",
            prompt_en="Paul is cuting the bread.",
            blanks=2,
            accept=["cuting|cutting", "Paul is cuting|Paul is cutting"],
        ),
        fill_item(
            iid="q07",
            sec=wtsecs[2],
            label="7",
            prompt_en="Is you enjoying the party?",
            blanks=2,
            accept=["Is you|Are you", "you|Are you"],
        ),
        sent_item(
            iid="q08",
            sec=wtsecs[3],
            label="8",
            prompt_en="They clean the streets after school. (be going to 부정문으로)",
            accept=[
                "They are not going to clean the streets after school.",
                "They're not going to clean the streets after school.",
            ],
        ),
        sent_item(
            iid="q09",
            sec=wtsecs[3],
            label="9",
            prompt_en="We plan a lot of events for children. (현재진행형으로)",
            accept=[
                "We are planning a lot of events for children.",
                "We're planning a lot of events for children.",
            ],
        ),
        mc_item(
            iid="q10",
            sec=wtsecs[4],
            label="10",
            prompt_en="",
            choices=[
                "A: Is he playing with toys? B: Yes, he will.",
                "A: Are you listening to the radio now? B: No, I don't.",
                "A: Is she going to bring her camera? B: Yes, she isn't.",
                "A: Are you going to the bus stop? B: Yes, I am.",
                "A: Will you take a taxi? B: Yes, you will.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q11",
            sec=wtsecs[5],
            label="11",
            prompt_en="ⓐ Maria isn't watch TV.\nⓑ Today will be fine all day.\nⓒ Minsu is playing the piano.\nⓓ Are you going to meet Janet?\nⓔ I am going to joining the cooking club.",
            choices=["ⓐ, ⓑ", "ⓐ, ⓒ, ⓔ", "ⓑ, ⓒ, ⓓ", "ⓑ, ⓔ", "ⓒ, ⓓ, ⓔ"],
            answer_index=3,
        ),
        mc_item(
            iid="q12",
            sec=wtsecs[5],
            label="12",
            prompt_en="ⓐ He is setting the table.\nⓑ I'm not looking at the picture.\nⓒ I will remembering your name.\nⓓ Are you thinking about the vacation?\nⓔ I'm going get up early tomorrow morning.",
            choices=["ⓐ, ⓑ, ⓒ", "ⓐ, ⓑ, ⓓ", "ⓐ, ⓒ, ⓓ", "ⓑ, ⓒ, ⓔ", "ⓒ, ⓓ, ⓔ"],
            answer_index=2,
        ),
        fill_item(
            iid="q13",
            sec=wtsecs[6],
            label="13",
            prompt_en="A: What is Mason doing now?\nB: He ________ his cat in the bathroom. (wash)",
            accept=["is washing"],
        ),
        mc_item(
            iid="q14",
            sec=wtsecs[7],
            label="14",
            prompt_en="<보기> I'm going to travel to Mexico.",
            choices=[
                "I travel to Mexico.",
                "I won't travel to Mexico.",
                "I will travel to Mexico.",
                "I like to travel to Mexico.",
                "I don't travel to Mexico.",
            ],
            answer_index=3,
        ),
        fill_item(
            iid="q15",
            sec=wtsecs[8],
            label="15",
            prompt_en="우리는 지도를 살펴보고 있다.\n(look at)\n→ We ________ the map.",
            accept=["are looking at"],
        ),
        sent_item(
            iid="q16",
            sec=wtsecs[9],
            label="16",
            prompt_en="우리는 박물관에서 우리의 역사에 관해 배울 것이다.\n(go, learn)\n<조건> 미래 표현 / 다섯 단어 / 필요한 경우 단어 변형\n→ ________ about our history at the museum.",
            accept=[
                "We will learn about our history at the museum.",
                "We're going to learn about our history at the museum.",
                "We are going to learn about our history at the museum.",
            ],
        ),
    ]
    out["wb-c03-test.json"] = _doc(
        "wb-c03-test.json",
        wm,
        practice_id="cm1:wb-c03:test",
        title="WB Chapter Test",
        subtitle="Chapter 03 현재진행형과 미래 표현 (WB p. 20–21)",
        pages="20–21",
        timer_minutes=28,
        sections=wtsecs,
        items=wtitems,
        test_id="wb-c03-test",
    )

    return out


if __name__ == "__main__":
    import json
    import os

    root = os.path.join(os.path.dirname(__file__), "..", "..", "data", "chunilmun1")
    for ch, builder in [(2, build_ch02), (3, build_ch03)]:
        docs = builder()
        for name, doc in docs.items():
            path = os.path.join(root, f"chapter{ch:02d}", name)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                json.dump(doc, f, ensure_ascii=False, indent=2)
                f.write("\n")
        print(f"chapter {ch:02d}: wrote {len(docs)} files")
