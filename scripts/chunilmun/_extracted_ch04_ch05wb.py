#!/usr/bin/env python3
"""Scan-extracted practice data for Ch04 (SB+WB) and Ch05 WB — 천일문 Grammar 1."""
from __future__ import annotations

from practice_lib import (
    CORR,
    MC,
    OX,
    OX_MARK,
    SENT,
    WR,
    WR2,
    build_practice,
    fill_item,
    labels_az,
    labels_num,
    mc_item,
    sb,
    section,
    sent_item,
    wb,
)

# ── shared choice sets ──────────────────────────────────────────────────────

MODAL_MEANING_SB = [
    "ⓐ ~할 수 있다 (능력·가능)",
    "ⓑ ~해도 된다 (허가)",
    "ⓒ ~일(할)지도 모른다 (추측)",
    "ⓓ ~해 줄래요? (요청)",
]

MODAL_MEANING_WB = [
    "ⓐ ~할 수 있다 (능력·가능)",
    "ⓑ ~해도 된다 (허가)",
    "ⓒ ~일[할]지도 모른다 (추측)",
    "ⓓ ~해 주시겠어요? (요청)",
]

ARTICLE_A_MEANING = [
    "ⓐ I have a sister.",
    "ⓑ A birthday comes once a year.",
    "ⓒ An ant is an insect.",
]

MATCH_MUST_LINES = [
    "ⓐ I must hurry.",
    "ⓑ You must not touch it.",
    "ⓒ I must clean the house.",
]


def _p(
    name: str,
    *,
    practice_id: str,
    title: str,
    subtitle: str,
    pages: str,
    timer: int,
    unit_id: str,
    unit_title: str,
    sections: list,
    items: list,
    test_id: str | None = None,
    test_title: str | None = None,
) -> tuple[str, dict]:
    return name, build_practice(
        practice_id=practice_id,
        title=title,
        subtitle=subtitle,
        pages=pages,
        timer_minutes=timer,
        unit_id=unit_id,
        unit_title=unit_title,
        sections=sections,
        items=items,
        test_id=test_id,
        test_title=test_title,
    )


def _ox(sec: dict, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _count_noun(sec: dict, label: str, iid: str, word: str, countable: bool) -> dict:
    mark = "O" if countable else "X"
    alt = "o" if countable else "x"
    return fill_item(
        iid=iid,
        sec=sec,
        label=label,
        prompt_en=word,
        accept=[mark, alt],
    )


def _modal_meaning_mc(
    sec: dict,
    label: str,
    iid: str,
    prompt: str,
    answer: int,
    *,
    wb: bool = False,
) -> dict:
    choices = MODAL_MEANING_WB if wb else MODAL_MEANING_SB
    return mc_item(
        iid=iid,
        sec=sec,
        label=label,
        prompt_en=prompt,
        choices=choices,
        answer_index=answer,
    )


def _bracket_mc(sec: dict, label: str, iid: str, prompt: str, choices: list[str], ans: int) -> dict:
    return mc_item(iid=iid, sec=sec, label=label, prompt_en=prompt, choices=choices, answer_index=ans)


def build_ch04() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(4, "조동사")
    wm = wb(4, "조동사")

    # ── SB Unit 1 ───────────────────────────────────────────────────────────
    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 7),
        "POINT 1·2·3",
    )
    items = [
        _ox(sec, "A1", "a01", "I <u>cannot understand</u> this sentence.", True),
        _ox(sec, "A2", "a02", "<u>You can lift</u> this box?", False, "Can you lift"),
        _ox(sec, "A3", "a03", "The test <u>may be</u> very difficult.", True),
        _ox(sec, "A4", "a04", "<u>May I has</u> a glass of water?", False, "May I have"),
        _ox(sec, "A5", "a05", "You <u>must talk not</u> with a friend in class.", False, "must not talk"),
        _ox(sec, "A6", "a06", "You <u>should wear</u> a seat belt.", True),
        _ox(sec, "A7", "a07", "The children <u>is able to</u> solve the puzzle.", False, "are able to"),
    ]
    out["c04-u1-A.json"] = build_practice(
        practice_id="cm1:c04:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="조동사 can/may · POINT 1·2·3 (p. 47)",
        pages="47",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "밑줄 친 조동사의 의미로 가장 적절한 것을 <보기>에서 골라 그 기호를 쓰세요.",
        MC,
        "choice",
        labels_az("B", 6),
        "POINT 3·4·5·6",
    )
    mb = [
        ("It <u>may</u> be cold outside.", 3),
        ("You <u>can</u> go home now.", 2),
        ("She <u>can</u> speak French and English.", 1),
        ("This lake <u>may</u> not be clean.", 3),
        ("<u>Can</u> you pass me some sugar?", 4),
        ("You <u>may</u> visit us any time.", 2),
    ]
    items = [
        _modal_meaning_mc(sec, f"B{i}", f"b{i:02d}", p, a)
        for i, (p, a) in enumerate(mb, 1)
    ]
    out["c04-u1-B.json"] = build_practice(
        practice_id="cm1:c04:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="조동사 can/may · POINT 3·4·5·6 (p. 47)",
        pages="47",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 말을 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("C", 4),
        "POINT 3·4·5·6",
        word_bank=["can", "can't", "may", "may not"],
    )
    cc = [
        ("________ you call back tomorrow?", ["Can"]),
        ("It ________ be a good idea.", ["may"]),
        ("I ________ believe the news.", ["can't", "cannot"]),
        ("You ________ play games.", ["may not"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(cc, 1)
    ]
    out["c04-u1-C.json"] = build_practice(
        practice_id="cm1:c04:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="조동사 can/may · POINT 3·4·5·6 (p. 47)",
        pages="47",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    # ── SB Unit 2 ───────────────────────────────────────────────────────────
    sec = section(
        "A",
        "Section A",
        "두 문장의 의미가 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("A", 4),
        "POINT 7",
    )
    ha = [
        "He must see a doctor right now.\n= He ________ ________ ________ a doctor right now.",
        "We must recycle paper.\n= We ________ ________ ________ paper.",
        "Sue must get up early tomorrow.\n= Sue ________ ________ ________ early tomorrow.",
        "You must be quiet in the theater.\n= You ________ ________ ________ quiet in the theater.",
    ]
    haa = [
        ["has to see"],
        ["have to recycle"],
        ["has to get up"],
        ["have to be"],
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a, blanks=3)
        for i, (p, a) in enumerate(zip(ha, haa), 1)
    ]
    out["c04-u2-A.json"] = build_practice(
        practice_id="cm1:c04:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="must/have to/should · POINT 7 (p. 49)",
        pages="49",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "<보기>의 단어와 should 또는 should not을 사용하여 다음 문장을 완성하세요.",
        WR,
        "words",
        labels_az("B", 5),
        "POINT 8",
        word_bank=["be", "call", "run", "have", "drive"],
    )
    hb = [
        ("You ________ breakfast every day.", ["should have"]),
        ("You ________ so fast.", ["should not drive", "shouldn't drive"]),
        ("Tommy ________ Yuri tonight.", ["should call"]),
        ("You ________ late for school.", ["should not be", "shouldn't be"]),
        ("We ________ on the stairs.", ["should not run", "shouldn't run"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(hb, 1)
    ]
    out["c04-u2-B.json"] = build_practice(
        practice_id="cm1:c04:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="must/have to/should · POINT 8 (p. 49)",
        pages="49",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요. (필요시 형태를 바꿀 것)",
        WR,
        "words",
        labels_az("C", 4),
        "POINT 7·8",
    )
    hc = [
        ("She ________ her dog. (feed / must)", ["must feed"]),
        ("We ________ paper cups. (use / should / not)", ["should not use", "shouldn't use"]),
        ("Cindy ________ some money. (save / have / to)", ["has to save"]),
        ("You ________ your cell phone in class. (turn / off / should)", ["should turn off"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(hc, 1)
    ]
    out["c04-u2-C.json"] = build_practice(
        practice_id="cm1:c04:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="must/have to/should · POINT 7·8 (p. 49)",
        pages="49",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_c04_sb_test(m))
    out.update(_build_c04_wb(wm))
    out.update(_build_review_01())
    return out


def _build_c04_sb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1-2", "[1–2]", "[1–2] 우리말과 일치하도록 빈칸에 들어갈 알맞은 말을 고르세요.", MC, "choice", labels_num(2)),
        section("3-4", "[3–4]", "[3–4] 다음 중 밑줄 친 부분의 의미가 다른 하나를 고르세요.", MC, "choice", labels_num(2, 3)),
        section("5", "[5]", "[5] 다음 중 대화의 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["5"]),
        section("6", "[6]", "[6] 다음 대화의 밑줄 친 부분과 의미가 같은 것을 고르세요.", MC, "choice", ["6"]),
        section("7", "[7]", "[7] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 다음 중 어법상 알맞은 문장을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 어법상 알맞지 않은 문장을 모두 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] should를 사용하여 다음 문장과 같은 뜻이 되도록 빈칸을 완성하세요.", SENT, "sentence", ["10"]),
        section("11", "[11]", "[11] 표지판을 보고 must와 주어진 단어를 사용하여 나타내는 것을 쓰세요.", WR2, "words", labels_num(2, 1)),
        section("12", "[12]", "[12] 다음 대화에서 어법상 알맞지 않은 부분 두 군데를 찾아 바르게 고쳐 쓰세요.", WR2, "words", labels_num(2, 1)),
        section("13", "[13]", "[13] 다음 중 어색한 대화를 고르세요.", MC, "choice", ["13"]),
        section("14", "[14]", "[14] 주어진 상황에 맞게 have to와 주어진 단어를 사용하여 문장을 완성하세요.", WR2, "words", labels_num(2, 1)),
        section("15", "[15]", "[15] 다음 중 어법상 알맞은 문장만을 포함하고 있는 것을 고르세요.", MC, "choice", ["15"]),
        section("16", "[16]", "[16] 표를 보고 (1), (2) Susan이 할 수 있는 것, (3) Andy가 할 수 없는 것을 can을 사용하여 쓰세요.", WR2, "words", labels_num(3, 1)),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Nick can use chopsticks well.",
            choices=["can", "cans", "may", "mays", "must"],
            answer_index=1,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="Sora must do some exercise.",
            choices=["can", "may", "must", "can't", "may not"],
            answer_index=3,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="Different meaning of May:",
            choices=[
                "May I borrow this book?",
                "You may use my dictionary.",
                "He may know the answer.",
                "You may go out and play.",
                "You may eat these snacks.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en="Different meaning of can:",
            choices=[
                "I can ride a horse.",
                "Can I watch TV now?",
                "Bill can play the guitar.",
                "Can you solve this problem?",
                "She cannot swim fast like you.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="A: Can you stay here with us tonight?\nB: I am sorry. I really ______ go home now.",
            choices=["must to", "can", "cannot", "may", "have to"],
            answer_index=5,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="A: May I use your computer?\nB: Of course. Go ahead.",
            choices=["Must", "Can", "Should", "Do", "Does"],
            answer_index=2,
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en="(A) I have some water? I'm thirsty.\n(B) Be quiet. You make a noise in the library.",
            choices=[
                "Do — cannot",
                "Can — don't have to",
                "May — should not",
                "Should — may not",
                "Must — do not",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            choices=[
                "She can makes a cake.",
                "You must park not here.",
                "You must to stop at the red light.",
                "I cannot finding my umbrella.",
                "Anna can't dance well.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q09",
            sec=secs[6],
            label="9",
            choices=[
                "①, ②",
                "①, ③",
                "②, ③",
                "②, ④",
                "③, ⑤",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q10",
            sec=secs[7],
            label="10",
            prompt_en="Don't take the books home. → You ______",
            accept=[
                "You should not take the books home.",
                "You shouldn't take the books home.",
            ],
        ),
        fill_item(
            iid="q11a",
            sec=secs[8],
            label="1",
            prompt_en="(1) You ______ on the street. (trash, throw)",
            accept=["must not throw trash", "mustn't throw trash"],
            blanks=1,
        ),
        fill_item(
            iid="q11b",
            sec=secs[8],
            label="2",
            prompt_en="(2) You ______ here. (a bike, ride)",
            accept=["must not ride a bike", "mustn't ride a bike"],
            blanks=1,
        ),
        fill_item(
            iid="q12a",
            sec=secs[9],
            label="1",
            prompt_en="ⓒ Can Mandy bakes cookies? →",
            accept=["c|Can Mandy bake cookies", "ⓒ|Can Mandy bake cookies"],
            blanks=2,
        ),
        fill_item(
            iid="q12b",
            sec=secs[9],
            label="2",
            prompt_en="ⓓ No, she can. →",
            accept=["d|No, she can't", "d|No, she cannot", "ⓓ|No, she can't"],
            blanks=2,
        ),
        mc_item(
            iid="q13",
            sec=secs[10],
            label="13",
            choices=[
                "A: Can I help you? B: No, thanks.",
                "A: Can I take a picture? B: No, you can't.",
                "A: Can I read the letter? B: Yes, you can't.",
                "A: May I enter the room? B: Yes, you may.",
                "A: Could you lend me your pen? B: Of course.",
            ],
            answer_index=3,
        ),
        fill_item(
            iid="q14a",
            sec=secs[11],
            label="1",
            prompt_en="He ______ it right now. (clean)",
            accept=["has to clean"],
            blanks=1,
        ),
        fill_item(
            iid="q14b",
            sec=secs[11],
            label="2",
            prompt_en="I ______ my school uniform on weekends. (wear)",
            accept=["don't have to wear", "do not have to wear"],
            blanks=1,
        ),
        mc_item(
            iid="q15",
            sec=secs[12],
            label="15",
            choices=["ⓐ, ⓑ, ⓕ", "ⓐ, ⓒ, ⓓ, ⓔ", "ⓑ, ⓒ, ⓔ", "ⓒ, ⓓ, ⓕ, ⓖ", "ⓒ, ⓔ, ⓖ"],
            answer_index=2,
        ),
        fill_item(
            iid="q16a",
            sec=secs[13],
            label="1",
            prompt_en="Susan can play the piano.",
            accept=["can play the piano"],
            blanks=1,
        ),
        fill_item(
            iid="q16b",
            sec=secs[13],
            label="2",
            prompt_en="Susan can speak Chinese.",
            accept=["can speak Chinese"],
            blanks=1,
        ),
        fill_item(
            iid="q16c",
            sec=secs[13],
            label="3",
            prompt_en="Andy cannot speak Chinese.",
            accept=["can't speak Chinese", "cannot speak Chinese"],
            blanks=1,
        ),
    ]
    return {
        "c04-test.json": build_practice(
            practice_id="cm1:c04:test",
            title="Chapter Test",
            subtitle="Chapter 04 조동사 (p. 50–51)",
            pages="50–51",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c04-test",
            **m,
        )
    }


def _build_c04_wb(wm: dict) -> dict[str, dict]:
    out: dict[str, dict] = {}

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X 하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 10),
        "POINT 1·2",
    )
    wa = [
        ("She <u>cans answer</u> the question.", False, "can answer"),
        ("<u>Can climb bears</u> a tree?", False, "Can bears climb"),
        ("<u>Can he rides</u> a bicycle?", False, "Can he ride"),
        ("We <u>must clean</u> the classroom every day.", True, ""),
        ("They <u>can't danced</u> very well.", False, "can't dance"),
        ("You <u>must walk not</u> on the grass.", False, "must not walk"),
        ("Mike <u>can runs</u> 100 meters in 14 seconds.", False, "can run"),
        ("You <u>may play</u> my piano.", True, ""),
        ("<u>May I came</u> in now?", False, "May I come"),
        ("<u>Can you finish</u> this work by noon?", True, ""),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(wa, 1)]
    out["wb-c04-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c04:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="조동사 can/may · POINT 1·2 (WB p. 22)",
        pages="22",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "B",
        "Section B",
        "밑줄 친 조동사의 의미로 가장 적절한 것을 <보기>에서 골라 그 기호를 쓰세요.",
        MC,
        "choice",
        labels_az("B", 10),
        "POINT 3·4·5·6",
    )
    wb_b = [
        ("Linda <u>can</u> make pizza very well.", 1),
        ("You <u>may</u> have this cookie now.", 2),
        ("She <u>may</u> not like it.", 3),
        ("<u>Can</u> Mickey play the violin?", 1),
        ("<u>Can</u> you tell me the way to the airport?", 4),
        ("She <u>may</u> be over eighty years old.", 3),
        ("<u>Can</u> I try this shirt on?", 2),
        ("<u>Can</u> you lend me a pencil?", 4),
        ("You <u>may</u> drink a glass of water.", 2),
        ("My parents <u>may</u> be busy now.", 3),
    ]
    items = [
        _modal_meaning_mc(sec, f"B{i}", f"b{i:02d}", p, a, wb=True)
        for i, (p, a) in enumerate(wb_b, 1)
    ]
    out["wb-c04-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c04:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="조동사 can/may · POINT 3·4·5·6 (WB p. 22)",
        pages="22",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 말을 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("C", 6),
        "POINT 3·4·5·6",
        word_bank=["can", "can't", "may", "may not"],
    )
    wc = [
        ("She ________ solve the puzzle.", ["can't", "cannot"]),
        ("The girl ________ be Peter's little sister.", ["may"]),
        ("________ you show me the map?", ["Can", "Could"]),
        ("________ Andy make Korean food?", ["Can"]),
        ("Judy ________ know you.", ["may"]),
        ("Lisa ________ come to school today.", ["may not"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(wc, 1)
    ]
    out["wb-c04-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c04:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="조동사 can/may · POINT 3·4·5·6 (WB p. 23)",
        pages="23",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어와 알맞은 조동사를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("D", 7),
        "POINT 3·4·5·6",
    )
    wd = [
        ("________ you ________ her telephone number? (remember)", ["Can|remember", "Could|remember"], 2),
        ("Tony ________ ________ very tired today. (be)", ["may|be"], 2),
        ("I ________ ________ the ceiling. (touch)", ["can't|touch", "cannot|touch"], 2),
        ("________ you ________ me a sandwich? (buy)", ["Can|buy", "Could|buy"], 2),
        ("Jessica ________ ________ ________ with my opinion. (agree)", ["may|not|agree"], 3),
        ("We ________ ________ ________ ________ books from the library. (able, borrow)", ["are|able|to|borrow"], 4),
        ("________ ________ ________ your printer? (use)", ["May|I|use", "Can|I|use"], 3),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(wd, 1)
    ]
    out["wb-c04-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c04:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="조동사 can/may · POINT 3·4·5·6 (WB p. 23)",
        pages="23",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "A",
        "Section A",
        "두 문장의 의미가 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("A", 6),
        "POINT 7",
    )
    w2a = [
        ("Eric must visit his grandmother this weekend.\n= Eric ________ ________ ________ his grandmother this weekend.", ["has to visit"]),
        ("Drivers must be careful on the icy road.\n= Drivers ________ ________ ________ careful on the icy road.", ["have to be"]),
        ("You must remember your password.\n= You ________ ________ ________ your password.", ["have to remember"]),
        ("He must bring it to the Lost and Found.\n= He ________ ________ ________ it to the Lost and Found.", ["has to bring"]),
        ("Nami must take an exam next week.\n= Nami ________ ________ ________ an exam next week.", ["has to take"]),
        ("We must check the schedule again.\n= We ________ ________ ________ the schedule again.", ["have to check"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a, blanks=3)
        for i, (p, a) in enumerate(w2a, 1)
    ]
    out["wb-c04-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c04:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="must/have to/should · POINT 7 (WB p. 24)",
        pages="24",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "B",
        "Section B",
        "<보기>의 단어와 should 또는 should not을 사용하여 다음 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 6),
        "POINT 8",
        word_bank=["waste", "help", "listen", "brush", "tell", "eat"],
    )
    w2b = [
        ("We ________ ________ ________ to other people.", ["should|listen"]),
        ("You ________ ________ ________ your time.", ["should|not|waste", "shouldn't|waste"]),
        ("We ________ ________ ________ old and weak people.", ["should|help"]),
        ("You ________ ________ ________ a lie.", ["should|not|tell", "shouldn't|tell"]),
        ("We ________ ________ ________ snacks now.", ["should|not|eat", "shouldn't|eat"]),
        ("Judy ________ ________ ________ her teeth.", ["should|brush"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=3)
        for i, (p, a) in enumerate(w2b, 1)
    ]
    out["wb-c04-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c04:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="must/have to/should · POINT 8 (WB p. 24)",
        pages="24",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("C", 9),
        "POINT 7·8",
    )
    w2c = [
        ("Morris <u>don't have to go</u> to the bookstore.", "doesn't have to go"),
        ("Sera <u>must not eats</u> anything tonight.", "must not eat"),
        ("You <u>has to catch</u> the first bus.", "have to catch"),
        ("He <u>doesn't has to bring</u> an umbrella with him.", "doesn't have to bring"),
        (
            "You <u>will must be</u> back by ten or your dad will get angry.",
            "will have to be",
        ),
        ("The car <u>must to stop</u> at red light.", "must stop"),
        ("Jane <u>doesn't should fight</u> with her sister.", "shouldn't fight"),
        ("We <u>has to be</u> careful on busy streets.", "have to be"),
        ("Peter <u>have to clean</u> his room every day.", "has to clean"),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(w2c, 1)
    ]
    out["wb-c04-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c04:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="must/have to/should · POINT 7·8 (WB p. 25)",
        pages="25",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **wm,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어들을 올바르게 배열하세요. (필요시 형태를 바꿀 것)",
        WR,
        "words",
        labels_az("D", 8),
        "POINT 7·8",
    )
    w2d = [
        ("He ________ himself. (control / have / to)", ["has to control"]),
        ("You ________ your teacher for help. (ask / should)", ["should ask"]),
        ("Diana ________ her homework now. (finish / have / to / don't)", ["doesn't have to finish"]),
        ("We ________ quiet in class. (be / must)", ["must be"]),
        ("You ________ your nails. (bite / not / should)", ["should not bite", "shouldn't bite"]),
        ("You ________ the truth all the time. (tell / must)", ["must tell"]),
        ("Linda ________ her brother. (take care of / have / to)", ["has to take care of"]),
        ("You ________ your pet here. (bring / not / must)", ["must not bring", "mustn't bring"]),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(w2d, 1)
    ]
    out["wb-c04-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c04:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="must/have to/should · POINT 7·8 (WB p. 25)",
        pages="25",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **wm,
    )

    out.update(_build_c04_wb_test(wm))
    return out


def _build_c04_wb_test(wm: dict) -> dict[str, dict]:
    secs = [
        section("1-2", "[1–2]", "[1–2] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.", MC, "choice", labels_num(2)),
        section("3-4", "[3–4]", "[3–4] 다음 중 <보기>의 밑줄 친 부분과 바꿔 쓸 수 있는 것을 고르세요.", MC, "choice", labels_num(2, 3)),
        section("5", "[5]", "[5] 우리말과 일치하도록 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["5"]),
        section("6", "[6]", "[6] 다음 중 <보기>의 밑줄 친 부분과 의미가 같은 것을 고르세요.", MC, "choice", ["6"]),
        section("7", "[7]", "[7] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["7"]),
        section("8-9", "[8–9]", "[8–9] 다음 중 어법상 알맞은 문장을 고르세요.", MC, "choice", labels_num(2, 8)),
        section("10", "[10]", "[10] 우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요.", WR, "words", ["10"]),
        section("11", "[11]", "[11] 다음 중 어법상 알맞지 않은 문장을 두 개 고르세요.", MC, "choice", ["11"]),
        section("12", "[12]", "[12] 밑줄 친 부분을 문맥에 맞게 고치세요.", CORR, "words", ["12"]),
        section("13", "[13]", "[13] should/shouldn't와 <보기>의 단어를 사용하여 문장을 완성하세요.", WR2, "words", labels_num(2, 1)),
        section("14", "[14]", "[14] <보기>의 문장과 어울리는 것을 <보기>에서 골라 기호를 쓰세요.", MC, "choice", labels_num(3, 1)),
        section("15", "[15]", "[15] should't와 주어진 단어를 사용하여 영화관 에티켓을 쓰세요.", SENT, "sentence", labels_num(2, 1)),
        section("16", "[16]", "[16] 다음 중 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["16"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Julie can't ______.",
            choices=["speak French", "solves the puzzle", "ski", "run fast", "cook pasta"],
            answer_index=2,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="You should ______.",
            choices=["had breakfast", "do your homework", "wear a seatbelt", "help your mother", "find another hobby"],
            answer_index=1,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="<보기> You have to break a bad habit.",
            choices=["can", "may", "can't", "must", "may not"],
            answer_index=4,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en="<보기> You may use my cell phone.",
            choices=["can", "must", "could", "should", "can't"],
            answer_index=1,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="We must not steal others' money.",
            choices=["should", "must", "must not", "have to", "don't have to"],
            answer_index=3,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="<보기> It may snow tonight.",
            choices=[
                "May I help you?",
                "May I sit next to you?",
                "You may talk on the phone here.",
                "You may not use my computer.",
                "They may be busy now.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en="We ______ to study English hard.\nYour plan doesn't ______ to be perfect.",
            choices=["can", "may", "must", "have", "has"],
            answer_index=4,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            choices=[
                "The baby cans walk.",
                "May I saw your passport?",
                "We should not say bad words.",
                "You must run not in the hallway.",
                "Jessica must takes medicine every day.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            choices=[
                "Can he plays the flute?",
                "He must find the book.",
                "You should to eat lunch.",
                "She not can sing a song.",
                "Sam and Jim has to lose weight.",
            ],
            answer_index=2,
        ),
        fill_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en="We don't have to worry about it.",
            accept=["don't have to", "do not have to"],
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            choices=["①, ④", "①, ⑤", "②, ④", "②, ⑤", "③, ⑤"],
            answer_index=4,
        ),
        fill_item(
            iid="q12",
            sec=secs[8],
            label="12",
            prompt_en="Sally has to go to the airport. The airport is 45 kilometers from here. It's too far. She <u>can</u> walk to the airport.",
            accept=["can't", "cannot"],
        ),
        fill_item(
            iid="q13a",
            sec=secs[9],
            label="1",
            prompt_en="We use only one side of the paper. (use / both sides)",
            accept=["should use both sides", "should use"],
            blanks=1,
        ),
        fill_item(
            iid="q13b",
            sec=secs[9],
            label="2",
            prompt_en="We leave too much food waste. (leave food waste)",
            accept=["shouldn't leave food waste", "should not leave food waste"],
            blanks=1,
        ),
        mc_item(
            iid="q14a",
            sec=secs[10],
            label="1",
            prompt_en="The train is leaving.",
            choices=MATCH_MUST_LINES,
            answer_index=1,
        ),
        mc_item(
            iid="q14b",
            sec=secs[10],
            label="2",
            prompt_en="I have a guest today.",
            choices=MATCH_MUST_LINES,
            answer_index=3,
        ),
        mc_item(
            iid="q14c",
            sec=secs[10],
            label="3",
            prompt_en="The oven is too hot.",
            choices=MATCH_MUST_LINES,
            answer_index=2,
        ),
        sent_item(
            iid="q15a",
            sec=secs[11],
            label="1",
            prompt_en="You ______ (noise, make)",
            accept=["You shouldn't make noise.", "You should not make noise."],
        ),
        sent_item(
            iid="q15b",
            sec=secs[11],
            label="2",
            prompt_en="You ______ in front of you. (the seat, kick)",
            accept=["You shouldn't kick the seat in front of you.", "You should not kick the seat in front of you."],
        ),
        mc_item(
            iid="q16",
            sec=secs[12],
            label="16",
            choices=[
                "You must not breaks the rules.",
                "We can change not our plans now.",
                "The store may is on sale this Sunday.",
                "Sujin don't have to use the Internet.",
                "I can't understand his story.",
            ],
            answer_index=5,
        ),
    ]
    return {
        "wb-c04-test.json": build_practice(
            practice_id="cm1:wb-c04:test",
            title="WB Chapter Test",
            subtitle="Chapter 04 (WB p. 26–27)",
            pages="26–27",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c04-test",
            **wm,
        )
    }


def _build_review_01() -> dict[str, dict]:
    secs = [
        section("1-2", "[1–2]", "[1–2] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2)),
        section("3", "[3]", "[3] 다음 중 밑줄 친 be동사의 의미가 <보기>와 같은 것을 고르세요.", MC, "choice", ["3"]),
        section("4", "[4]", "[4] 다음 중 빈칸에 is를 쓸 수 없는 것을 고르세요.", MC, "choice", ["4"]),
        section("5-6", "[5–6]", "[5–6] 어법상 알맞지 않은 부분을 찾아 바르게 고치세요.", WR2, "words", labels_num(2, 5)),
        section("7-8", "[7–8]", "[7–8] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", labels_num(2, 7)),
        section("9", "[9]", "[9] 다음 중 동사의 과거형이 잘못 연결된 것을 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 다음 문장을 의문문으로 알맞게 바꿔 쓴 것을 고르세요.", MC, "choice", ["10"]),
        section("11-12", "[11–12]", "[11–12] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", labels_num(2, 11)),
        section("13-15", "[13–15]", "[13–15] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(3, 13)),
        section("16", "[16]", "[16] 다음 중 어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.", MC, "choice", ["16"]),
        section("17-18", "[17–18]", "[17–18] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 17)),
        section("19", "[19]", "[19] 다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.", MC, "choice", ["19"]),
        section("20-22", "[20–22]", "[20–22] 주어진 문장을 괄호 안의 지시대로 바꿔 쓰세요.", SENT, "sentence", labels_num(3, 20)),
        section("23-24", "[23–24]", "[23–24] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 23)),
        section("25-26", "[25–26]", "[25–26] 다음 중 밑줄 친 부분의 의미가 다른 하나를 고르세요.", MC, "choice", labels_num(2, 25)),
        section("27-28", "[27–28]", "[27–28] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 27)),
        section("29-30", "[29–30]", "[29–30] 다음 질문에 대한 응답으로 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 29)),
        section("31-32", "[31–32]", "[31–32] 다음 대화에서 어법상 알맞지 않은 부분 두 군데를 찾아 바르게 고쳐 쓰세요.", WR2, "words", labels_num(2, 31)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", prompt_en="Jinho ______ in the post office now.", choices=["are", "is", "was", "be", "were"], answer_index=2),
        mc_item(iid="q02", sec=secs[0], label="2", prompt_en="Steve is ______ bread now.", choices=["made", "making", "makeing", "make", "makes"], answer_index=2),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="<보기> They are on the train.",
            choices=[
                "It is rainy today.",
                "We are tired now.",
                "They are very kind.",
                "The subway is very fast.",
                "I am in the kitchen now.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            choices=[
                "______ the girl have a cat?",
                "______ your sister an actress?",
                "My friend ______ from Russia.",
                "______ he working at the office?",
                "A man ______ drinking milk now.",
            ],
            answer_index=1,
        ),
        fill_item(iid="q05", sec=secs[3], label="5", prompt_en="Does students →", accept=["Does|Do", "Does students|Do students"], blanks=2),
        fill_item(iid="q06", sec=secs[3], label="6", prompt_en="wasn't →", accept=["wasn't|weren't", "wasn't|were not"], blanks=2),
        mc_item(iid="q07", sec=secs[4], label="7", choices=["He don't need help.", "Is Emma your cousin?", "Emily ate chocolate last night.", "I was in the hospital yesterday.", "Does your dad work at a bank?"], answer_index=1),
        mc_item(iid="q08", sec=secs[4], label="8", choices=["He isn't a taxi driver.", "We were in the bakery now.", "Paul is not reading a magazine.", "They weren't honest at that time.", "My mom and I are watching a movie."], answer_index=2),
        mc_item(iid="q09", sec=secs[5], label="9", choices=["make — maked", "read — read", "stop — stopped", "love — loved", "study — studied"], answer_index=1),
        mc_item(iid="q10", sec=secs[6], label="10", prompt_en="She wears sunglasses every day.", choices=["Do she wear sunglasses every day?", "Do she wears sunglasses every day?", "Does she wears sunglasses every day?", "Does she wear sunglasses every day?", "Did she wear sunglasses every day?"], answer_index=4),
        mc_item(iid="q11", sec=secs[7], label="11", prompt_en="Minho didn't do laundry last night. (민호는 어젯밤에 빨래를 하지 않았다.)", choices=["Minho didn't do laundry last night.", "Minho doesn't do laundry last night.", "Minho doesn't does laundry last night.", "Minho didn't does laundry last night.", "Minho don't does laundry last night."], answer_index=1),
        mc_item(iid="q12", sec=secs[7], label="12", prompt_en="너는 일본어를 배울 거니?", choices=["Will you learning Japanese?", "Are you go to learn Japanese?", "Are you going to learn Japanese?", "Will you going to learn Japanese?", "Are you going to learning Japanese."], answer_index=3),
        sent_item(iid="q13", sec=secs[8], label="13", prompt_en="Jason은 자기 밴드에서 기타를 연주하니? (the guitar / in his band / do / play / Jason)", accept=["Does Jason play the guitar in his band?", "Does Jason play guitar in his band?"]),
        sent_item(iid="q14", sec=secs[8], label="14", prompt_en="그녀는 오늘 Mark를 만날 수 없다. (she / to / Mark / be / meet / able / not)", accept=["She is not able to meet Mark today.", "She isn't able to meet Mark today."]),
        sent_item(iid="q15", sec=secs[8], label="15", prompt_en="나는 언젠가 파리에서 살 것이다. (live / will / I / in Paris)", accept=["I will live in Paris someday.", "I'll live in Paris someday."]),
        mc_item(iid="q16", sec=secs[9], label="16", choices=["ⓐ, ⓑ, ⓒ", "ⓒ, ⓔ, ⓕ", "ⓐ, ⓒ, ⓕ", "ⓑ, ⓓ, ⓕ", "ⓐ, ⓓ, ⓕ"], answer_index=5),
        mc_item(iid="q17", sec=secs[10], label="17", prompt_en="Is your mother in Busan now? / A boy crying on the street.", choices=["Am", "Is", "Are", "Was", "Were"], answer_index=2),
        mc_item(iid="q18", sec=secs[10], label="18", prompt_en="Drivers follow traffic signs. / You be careful with a knife.", choices=["can", "are able to", "shouldn't", "don't have to", "must"], answer_index=5),
        mc_item(iid="q19", sec=secs[11], label="19", choices=["Bora is going to the theater.", "He is going to dance with her.", "I'm going to visit Seoul next week.", "They are going to play badminton.", "The kids are going to swim tomorrow."], answer_index=1),
        sent_item(iid="q20", sec=secs[12], label="20", prompt_en="We are worried about you. (과거형으로)", accept=["We were worried about you."]),
        sent_item(iid="q21", sec=secs[12], label="21", prompt_en="She is going to the bus stop. (의문문으로)", accept=["Is she going to the bus stop?"]),
        sent_item(iid="q22", sec=secs[12], label="22", prompt_en="Visitors may eat snacks here. (부정문으로)", accept=["Visitors may not eat snacks here.", "Visitors cannot eat snacks here."]),
        mc_item(iid="q23", sec=secs[13], label="23", prompt_en="They (A) their house 4 years ago. / My mom is going to (B) a new table tomorrow.", choices=["build — buys", "builds — buy", "built — buys", "builded — buy", "built — buy"], answer_index=5),
        mc_item(iid="q24", sec=secs[13], label="24", prompt_en="Mr. Wilson (A) to see a doctor. / Jane and I are (B) for the bus.", choices=["has — wait", "has — waiting", "have — waits", "may not — waits", "may not — waiting"], answer_index=2),
        mc_item(iid="q25", sec=secs[14], label="25", choices=["Can I borrow your jacket?", "The rabbit can jump very high.", "She can finish her work before 7.", "We can solve the problem.", "Tommy can speak French."], answer_index=1),
        mc_item(iid="q26", sec=secs[14], label="26", choices=["It may be rainy today.", "Laura may be very wise.", "She may know your father.", "Students may have questions.", "You may use my chair any time."], answer_index=5),
        mc_item(iid="q27", sec=secs[15], label="27", choices=["My teacher call me yesterday.", "Sera isn't takeing a science class.", "Was you and Mary in LA last month?", "Does James get up early on Sundays?", "They are going not to buy a new car."], answer_index=4),
        mc_item(iid="q28", sec=secs[15], label="28", choices=["Is your brother play baseball?", "Joe and Ted needs some water.", "Do you go shopping last Friday?", "A child must not go outside alone at night.", "Do you have to prepared a lunch box today?"], answer_index=4),
        mc_item(iid="q29", sec=secs[16], label="29", prompt_en="Will your parents sell the sofa?", choices=["No, they will.", "Yes, they are.", "Yes, they won't.", "No, they won't.", "No, they aren't."], answer_index=4),
        mc_item(iid="q30", sec=secs[16], label="30", prompt_en="Should I take off my shoes here?", choices=["Yes, I should.", "Yes, you do.", "No, you should.", "No, I shouldn't.", "Yes, you should."], answer_index=5),
        fill_item(iid="q31", sec=secs[17], label="31", prompt_en="I weren't → / I have →", accept=["weren't|wasn't|had", "I weren't|I wasn't|I had"], blanks=3),
        fill_item(iid="q32", sec=secs[17], label="32", prompt_en="going practice → / will asks →", accept=["to practice|going to practice|ask|asks", "practice|to practice|asks|ask"], blanks=4),
    ]
    return {
        "review-01.json": build_practice(
            practice_id="cm1:review-01",
            title="총괄평가 1회",
            subtitle="Ch01–04 (WB pp. 28–31 · PDF 181–184)",
            pages="181–184",
            timer_minutes=45,
            unit_id="review-01",
            unit_title="총괄평가 1회 (Ch01–04)",
            sections=secs,
            items=items,
        )
    }


def build_ch05_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(5, "명사와 관사")

    sec = section(
        "A",
        "Section A",
        "다음 명사가 셀 수 있는 명사이면 O, 셀 수 없는 명사이면 X를 쓰세요.",
        OX_MARK,
        "words",
        labels_num(20),
        "POINT 1",
    )
    nouns = [
        ("hand", True),
        ("salt", False),
        ("coin", True),
        ("advice", False),
        ("friend", True),
        ("sofa", True),
        ("money", False),
        ("water", False),
        ("milk", False),
        ("desk", True),
        ("child", True),
        ("river", True),
        ("air", False),
        ("furniture", False),
        ("cup", True),
        ("information", False),
        ("flower", True),
        ("health", False),
        ("ring", True),
        ("meat", False),
    ]
    items = [_count_noun(sec, str(i), f"a{i:02d}", w, c) for i, (w, c) in enumerate(nouns, 1)]
    out["wb-c05-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c05:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="셀 수 있는/없는 명사 · POINT 1 (WB p. 32)",
        pages="32",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 명사를 빈칸에 알맞은 형태로 쓰세요.",
        WR,
        "words",
        labels_num(10),
        "POINT 2",
    )
    plurals = [
        ("James and I broke some ________. (cup)", ["cups"]),
        ("The tree is thick with many ________. (leaf)", ["leaves"]),
        ("They have two ________. (child)", ["children"]),
        ("I have six ________ at school today. (class)", ["classes"]),
        ("She washed many ________ after dinner. (dish)", ["dishes"]),
        ("Lots of ________ are standing in line. (man)", ["men"]),
        ("We visited many ________ for vacation. (country)", ["countries"]),
        ("My mom bought ten ________. (tomato)", ["tomatoes"]),
        ("Steve has two bad ________. (tooth)", ["teeth"]),
        ("I hung up some family ________ on the wall. (photo)", ["photos"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(plurals, 1)
    ]
    out["wb-c05-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c05:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="복수형 · POINT 2 (WB p. 32)",
        pages="32",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "다음 그림과 일치하도록 주어진 단어를 사용하여 빈칸에 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_num(4),
        "POINT 3",
    )
    unit_c = [
        ("We drink ________ tea every morning. (cup)", ["a cup of"]),
        ("Tom gave ________ cake to me. (piece)", ["a piece of", "two pieces of"]),
        ("She bought ________ juice. (bottle)", ["three bottles of"]),
        ("I ate ________ cereal for breakfast. (bowl)", ["a bowl of"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(unit_c, 1)
    ]
    out["wb-c05-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c05:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="단위명사 · POINT 3 (WB p. 33)",
        pages="33",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR,
        "words",
        labels_num(6),
        "POINT 2·3",
    )
    unit_d = [
        ("I'll have only ________ for breakfast. (bread)", ["a loaf of bread", "a loaf of"]),
        ("Could you give us ________? (orange juice)", ["two glasses of orange juice"]),
        ("My father told interesting ________ to us. (story)", ["stories"]),
        ("We left ________ last night. (pizza)", ["five pieces of pizza"]),
        ("The chef is cutting some ________ for French fries. (potato)", ["potatoes"]),
        ("The ________ and cats in the movie are very cute. (mouse)", ["mice"]),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(unit_d, 1)
    ]
    out["wb-c05-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c05:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="명사/단위명사 · POINT 2·3 (WB p. 33)",
        pages="33",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_num(10),
        "POINT 4",
    )
    art_a = [
        ("Time is [gold / a gold].", ["gold", "a gold"], 1),
        ("You can find [sugar / a sugar] on the table.", ["sugar", "a sugar"], 1),
        ("I have [problem / a problem].", ["problem", "a problem"], 2),
        ("It was [a / an] wonderful day.", ["a", "an"], 1),
        ("The woman is cooking [rice / a rice].", ["rice", "a rice"], 1),
        ("James is [a / an] honest boy.", ["a", "an"], 2),
        ("We'll meet in the club once [a / an] week.", ["a", "an"], 1),
        ("Thank you for your [advice / advices].", ["advice", "advices"], 1),
        ("My grandma gave me [a / an] old watch.", ["a", "an"], 1),
        ("I heard [news / a news] about the accident.", ["news", "a news"], 1),
    ]
    items = [
        _bracket_mc(sec, str(i), f"a{i:02d}", p, ch, ans)
        for i, (p, ch, ans) in enumerate(art_a, 1)
    ]
    out["wb-c05-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c05:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="관사 · POINT 4 (WB p. 34)",
        pages="34",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "밑줄 친 a(an)의 의미와 같은 것을 <보기>에서 골라 기호를 쓰세요.",
        MC,
        "choice",
        labels_num(9),
        "POINT 4",
    )
    art_b = [
        ("A dolphin is <u>a</u> very smart animal.", 3),
        ("I visit my grandparents twice <u>a</u> month.", 2),
        ("I ate <u>a</u> sandwich for lunch.", 1),
        ("She told us <u>an</u> excellent idea.", 1),
        ("<u>A</u> spider has eight legs.", 3),
        ("I found <u>an</u> old coin under the desk.", 1),
        ("We saw <u>a</u> blue bird on the tree.", 1),
        ("I brush my teeth three times <u>a</u> day.", 2),
        ("<u>A</u> rose gives a beautiful smell.", 3),
    ]
    items = [
        mc_item(
            iid=f"b{i:02d}",
            sec=sec,
            label=str(i),
            prompt_en=p,
            choices=ARTICLE_A_MEANING,
            answer_index=a,
        )
        for i, (p, a) in enumerate(art_b, 1)
    ]
    out["wb-c05-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c05:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="관사 · POINT 4 (WB p. 34)",
        pages="34",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "빈칸에 알맞은 관사를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_num(10),
        "POINT 4",
        word_bank=["a", "an", "the"],
    )
    art_c = [
        ("Can I use ________ bathroom?", ["the"]),
        ("Do you have ________ sister?", ["a"]),
        ("The title is on ________ first page.", ["the"]),
        ("I have ________ exam tomorrow.", ["an"]),
        ("I bought a banana. ________ banana was so sweet.", ["The"]),
        ("________ Earth is round.", ["The"]),
        ("I need ________ eraser. Do you have one?", ["an"]),
        ("Jin will play ________ cello for us.", ["the"]),
        ("I go to a movie once ________ month.", ["a"]),
        ("Please open ________ door. It's too hot.", ["the"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(art_c, 1)
    ]
    out["wb-c05-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c05:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="관사 · POINT 4 (WB p. 35)",
        pages="35",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "다음 중 어법상 알맞은 관사를 고르세요. (필요하지 않으면 x를 고르세요.)",
        MC,
        "choice",
        labels_num(10),
        "POINT 4·5",
    )
    art_d = [
        ("Can you play [a / the / x] piano well?", ["a", "the", "x"], 2),
        ("We have only [a / an / the] hour left.", ["a", "an", "the"], 2),
        ("Let's play [a / the / x] soccer after school.", ["a", "the", "x"], 3),
        ("I talk with my parents once [a / an / the] day.", ["a", "an", "the"], 1),
        ("You can order food delivery by [a / the / x] phone.", ["a", "the", "x"], 3),
        ("Mom bought me a book. [A / An / The] book was boring.", ["A", "An", "The"], 3),
        ("[A / The / x] Sun rises in the morning.", ["A", "The", "x"], 2),
        ("They traveled to Europe by [a / the / x] ship.", ["a", "the", "x"], 3),
        ("[A / The / x] last day of this month is the 31st.", ["A", "The", "x"], 2),
        ("I'm so sleepy. I'll go to [a / the / x] bed early.", ["a", "the", "x"], 3),
    ]
    items = [
        _bracket_mc(sec, str(i), f"d{i:02d}", p, ch, ans)
        for i, (p, ch, ans) in enumerate(art_d, 1)
    ]
    out["wb-c05-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c05:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="관사 · POINT 4·5 (WB p. 35)",
        pages="35",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch05_wb_u3(m))
    out.update(_build_ch05_wb_test(m))
    return out


def _build_ch05_wb_u3(m: dict) -> dict[str, dict]:
    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_num(9),
        "POINT 6",
    )
    there_a = [
        ("There [is / are] a bank next to the market.", ["is", "are"], 1),
        ("There [is / are] Carl and Emily in the cafe.", ["is", "are"], 2),
        ("There [was / were] two kids in the park.", ["was", "were"], 2),
        ("There is some [bread / hamburgers] on my plate.", ["bread", "hamburgers"], 1),
        ("There weren't [my friend / students] in the classroom.", ["my friend", "students"], 2),
        ("There [was / were] true love between us.", ["was", "were"], 1),
        ("[Is / Are] there some deer in the zoo?", ["Is", "Are"], 2),
        ("There [wasn't / weren't] information about the event.", ["wasn't", "weren't"], 2),
        ("[Is / Are] there milk in the refrigerator?", ["Is", "Are"], 1),
    ]
    items = [
        _bracket_mc(sec, str(i), f"a{i:02d}", p, ch, ans)
        for i, (p, ch, ans) in enumerate(there_a, 1)
    ]
    u3a = build_practice(
        practice_id="cm1:wb-c05:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="There is/are · POINT 6 (WB p. 36)",
        pages="36",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 빈칸에 There is 또는 There are를 넣어 문장을 완성하세요.",
        WR,
        "words",
        labels_num(10),
        "POINT 6",
    )
    there_b = [
        "________ three cookies on the dish.",
        "________ a notebook on the desk.",
        "________ butter on the pancakes.",
        "________ mice on the roof.",
        "________ a full moon in the night sky.",
        "________ some milk in the cup.",
        "________ many mistakes in my exam.",
        "________ two children in the picture.",
        "________ heavy rain today.",
        "________ three beautiful fish in the fishbowl.",
    ]
    there_b_ans = [
        ["There are"],
        ["There is"],
        ["There is"],
        ["There are"],
        ["There is"],
        ["There is"],
        ["There are"],
        ["There are"],
        ["There is"],
        ["There are"],
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(zip(there_b, there_b_ans), 1)
    ]
    u3b = build_practice(
        practice_id="cm1:wb-c05:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="There is/are · POINT 6 (WB p. 36)",
        pages="36",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    bank1 = ["There is", "There are", "There was", "There were"]
    bank2 = ["There is", "There are", "There wasn't", "There weren't"]
    there_c = [
        ("________ a smile on his face yesterday.", ["There was"]),
        ("________ a photo of my family on my desk.", ["There is"]),
        ("________ many deer in the field long ago.", ["There were"]),
        ("________ many passengers on the train now.", ["There are"]),
        ("________ people at the beach last summer.", ["There weren't", "There were not"]),
        ("________ bread in the store yesterday.", ["There wasn't", "There was not"]),
        ("________ a bowl of soup in the kitchen.", ["There is"]),
        ("________ a lot of children on the bus every day.", ["There are"]),
    ]
    sec = section(
        "C",
        "Section C",
        "빈칸에 알맞은 말을 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_num(8),
        "POINT 6",
        word_bank=bank1 + bank2,
    )
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(there_c, 1)
    ]
    u3c = build_practice(
        practice_id="cm1:wb-c05:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="There is/are · POINT 6 (WB p. 37)",
        pages="37",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_num(7),
        "POINT 6",
    )
    there_d = [
        ("There is good news for my family. (good news)", ["There is good news for my family.", "There's good news for my family."]),
        ("There was ice on the windows. (ice)", ["There was ice on the windows."]),
        ("Are there any towels in the bathroom? (any towels)", ["Are there any towels in the bathroom?"]),
        ("There were many trees on the mountain. (many trees)", ["There were many trees on the mountain."]),
        ("There weren't lots of cars on the street. (lots of cars)", ["There weren't lots of cars on the street.", "There were not lots of cars on the street."]),
        ("Is there a flower in the vase? (a flower)", ["Is there a flower in the vase?"]),
        ("There wasn't a jacket in my room. (a jacket)", ["There wasn't a jacket in my room.", "There was not a jacket in my room."]),
    ]
    items = [
        sent_item(iid=f"d{i:02d}", sec=sec, label=str(i), prompt_en=p, accept=a)
        for i, (p, a) in enumerate(there_d, 1)
    ]
    u3d = build_practice(
        practice_id="cm1:wb-c05:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="There is/are · POINT 6 (WB p. 37)",
        pages="37",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )
    return {
        "wb-c05-u3-A.json": u3a,
        "wb-c05-u3-B.json": u3b,
        "wb-c05-u3-C.json": u3c,
        "wb-c05-u3-D.json": u3d,
    }


def _build_ch05_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1", "[1]", "[1] 다음 중 명사의 단수형과 복수형이 잘못 연결된 것을 고르세요.", MC, "choice", ["1"]),
        section("2-3", "[2–3]", "[2–3] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 2)),
        section("4-5", "[4–5]", "[4–5] 밑줄 친 부분의 어법을 고르세요.", MC, "choice", labels_num(2, 4)),
        section("6-8", "[6–8]", "[6–8] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(3, 6)),
        section("9", "[9]", "[9] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 그림을 보고 문장을 완성하세요.", SENT, "sentence", ["10"]),
        section("11-14", "[11–14]", "[11–14] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(4, 11)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["leaf — leaves", "hero — heros", "tooth — teeth", "sheep — sheep", "watch — watches"], answer_index=2),
        mc_item(iid="q02", sec=secs[1], label="2", prompt_en="There are ______ in my bag.", choices=["watch", "a newspaper", "an umbrella", "four photo", "some oranges"], answer_index=5),
        mc_item(iid="q03", sec=secs[1], label="3", prompt_en="Is there ______ on the road?", choices=["people", "trees", "garbage", "stores", "cars"], answer_index=3),
        mc_item(iid="q04", sec=secs[2], label="4", choices=["Bill eats two bowls of rice.", "I need a bottle of water.", "Please give me a sheet of paper.", "Nina ordered two cups of coffee.", "She drinks three glass of milk every day."], answer_index=5),
        mc_item(iid="q05", sec=secs[2], label="5", choices=["She bought some tomatos.", "Three ladys came to see you.", "My dad works eight hour a day.", "The two woman are from France.", "I drink some milk in the morning."], answer_index=5),
        sent_item(iid="q06", sec=secs[3], label="6", prompt_en="(apple juice / are / two / there / of / glass)", accept=["There are two glasses of apple juice."]),
        sent_item(iid="q07", sec=secs[3], label="7", prompt_en="(was / meat / not / there) in the refrigerator.", accept=["There was not meat in the refrigerator.", "There wasn't meat in the refrigerator."]),
        sent_item(iid="q08", sec=secs[3], label="8", prompt_en="(there / many child / are) on the beach?", accept=["Are there many children on the beach?"]),
        mc_item(
            iid="q09",
            sec=secs[4],
            label="9",
            prompt_en="A: Can I help you? B: Yes, please. Can I get ...",
            choices=[
                "three hamburgeres",
                "two sandwichs",
                "four apple piees",
                "two hot dogs",
                "five pieces of pizzas",
            ],
            answer_index=4,
        ),
        sent_item(iid="q10", sec=secs[5], label="10", prompt_en="________ on the branch. (bird, two)", accept=["There are two birds on the branch."]),
        mc_item(iid="q11", sec=secs[6], label="11", choices=["I need four slice of cheese.", "My aunt has only one children.", "There are many passenger in the bus.", "Is there Bob and Lisa in the concert hall now?", "There are a hundred books on the bookshelf."], answer_index=5),
        mc_item(
            iid="q12",
            sec=secs[6],
            label="12",
            prompt_en="A giraffe and an elephant are in the zoo.",
            choices=["A — an — A — the", "The — the — A — an", "An — a — The — the", "A — an — The — the", "The — an — An — the"],
            answer_index=4,
        ),
        mc_item(iid="q13", sec=secs[6], label="13", choices=["1개", "2개", "3개", "4개", "5개"], answer_index=3),
        mc_item(
            iid="q14",
            sec=secs[6],
            label="14",
            prompt_en="Suji had an egg, two tomatoes, a bowl of soup, and a loaf of bread for dinner.",
            choices=[
                "a — tomatos — loaf — bowl",
                "a — tomatoes — loaf — bowl",
                "an — tomatos — bowl — loaf",
                "an — tomatoes — bowl — loaf",
                "the — tomatoes — loaf — bowl",
            ],
            answer_index=2,
        ),
    ]
    return {
        "wb-c05-test.json": build_practice(
            practice_id="cm1:wb-c05:test",
            title="WB Chapter Test",
            subtitle="Chapter 05 (WB p. 38–39)",
            pages="38–39",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c05-test",
            **m,
        )
    }


if __name__ == "__main__":
    import json
    import sys

    fn = sys.argv[1] if len(sys.argv) > 1 else "ch04"
    if fn == "ch04":
        data = build_ch04()
    elif fn == "ch05wb":
        data = build_ch05_wb()
    else:
        data = {**build_ch04(), **build_ch05_wb()}
    print(json.dumps(list(data.keys()), ensure_ascii=False, indent=2))
