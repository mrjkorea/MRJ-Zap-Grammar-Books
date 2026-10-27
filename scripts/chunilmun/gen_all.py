#!/usr/bin/env python3
"""Generate ch02–04 SB + WB practice JSON for 천일문 Grammar 1."""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from practice_lib import (  # noqa: E402
    build_practice,
    fill_item,
    labels_az,
    labels_num,
    mc_item,
    section,
    sent_item,
    write_practice,
)

WR = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
WR2 = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
MC = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
CORR = "고친 말만 한 칸에 쓰세요. (문장 전체를 쓰지 마세요.)"
OX = "맞으면 O, 틀리면 어법에 맞게 고친 말만 쓰세요. (O 또는 고친 말.)"


def sb(ch: int, title: str) -> dict:
    return {
        "unit_id": f"chapter-{ch:02d}",
        "unit_title": f"Chapter {ch:02d} — {title}",
    }


def wb(ch: int, title: str) -> dict:
    return {
        "unit_id": f"wb-chapter-{ch:02d}",
        "unit_title": f"Ch {ch:02d} WB — {title}",
    }


def save(ch: int, name: str, doc: dict) -> None:
    write_practice(f"data/chunilmun1/chapter{ch:02d}/{name}", doc)


def gen_ch02() -> None:
    m = sb(2, "일반동사")

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분을 어법상 알맞은 형태로 고치세요.",
        f"[ ] 안의 말이 밑줄 친 부분이에요. {CORR}",
        "words",
        labels_az("A", 6),
        "POINT 1·2",
    )
    pairs = [
        ("We [wants] some fresh air.", "want"),
        ("She [have] short hair.", "has"),
        ("Emily [love] her new shoes.", "loves"),
        ("My brother and I [learns] Chinese together.", "learn"),
        ("Ben [like] singing and dancing.", "likes"),
        ("Kevin and Nancy [watchs] movies every Saturday.", "watch"),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(pairs, 1)
    ]
    save(
        2,
        "c02-u1-A.json",
        build_practice(
            practice_id="cm1:c02:u1-A",
            title="Unit 1 Unit Exercise — Section A",
            subtitle="일반동사의 현재형 · POINT 1·2 (p. 22)",
            pages="22",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "B",
        "Section B",
        "다음 빈칸에 들어갈 일반동사를 어법상 알맞은 형태로 쓰세요.",
        WR,
        "words",
        labels_az("B", 5),
        "POINT 1·2·4",
    )
    fills = ["studies", "exercise", "knows", "takes", "listens"]
    prompts = [
        "Joe ________ Korean very hard.",
        "Kevin and Jason ________ together at the gym.",
        "Danny ________ all the famous basketball players.",
        "My dad ________ swimming lessons twice a week.",
        "Jina always ________ carefully to her friends.",
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=prompts[i - 1], accept=[fills[i - 1]])
        for i in range(1, 6)
    ]
    save(
        2,
        "c02-u1-B.json",
        build_practice(
            practice_id="cm1:c02:u1-B",
            title="Unit 1 Unit Exercise — Section B",
            subtitle="일반동사의 현재형 · POINT 1·2·4 (p. 22)",
            pages="22",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "C",
        "Section C",
        "다음 문장이 맞으면 O, 틀리면 어법에 맞게 고친 말만 쓰세요.",
        OX,
        "words",
        labels_az("C", 7),
        "POINT 2·3",
    )
    ox = [
        ("Dan walks to school every morning.", "O"),
        ("Tom [go] to the library.", "goes"),
        ("My dad [get] up early in the morning.", "gets"),
        ("The doctors [helps] sick people.", "help"),
        ("He watches TV at night.", "O"),
        ("This teacher [teach] math.", "teaches"),
        ("My brother [play] baseball after school.", "plays"),
    ]
    items = []
    for i, (p, a) in enumerate(ox, 1):
        acc = ["O", "o"] if a == "O" else [a]
        items.append(fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=acc))
    save(
        2,
        "c02-u1-C.json",
        build_practice(
            practice_id="cm1:c02:u1-C",
            title="Unit 1 Unit Exercise — Section C",
            subtitle="일반동사의 현재형 · POINT 2·3 (p. 22)",
            pages="22",
            timer_minutes=20,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    # U2
    sec = section(
        "A",
        "Section A",
        "다음 빈칸에 들어갈 일반동사의 과거형을 쓰세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 3",
    )
    past_a = ["ate", "lost", "saw", "bought", "went", "poured"]
    past_p = [
        "He ________ a hamburger for lunch.",
        "I ________ my phone at school yesterday.",
        "Jenny and I ________ a movie yesterday.",
        "I ________ some snacks.",
        "My family ________ to the museum last weekend.",
        "It ________ heavily this morning.",
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=past_p[i - 1], accept=[past_a[i - 1]])
        for i in range(1, 7)
    ]
    save(
        2,
        "c02-u2-A.json",
        build_practice(
            practice_id="cm1:c02:u2-A",
            title="Unit 2 Unit Exercise — Section A",
            subtitle="일반동사의 과거형 · POINT 3 (p. 25)",
            pages="25",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "B",
        "Section B",
        "다음 빈칸에 들어갈 일반동사의 과거형을 쓰세요.",
        WR,
        "words",
        labels_az("B", 6),
        "POINT 3",
    )
    pb = ["stayed", "stopped", "visited", "studied", "arrived", "chatted"]
    pp = [
        "Jane ________ at home yesterday.",
        "The car ________ at the traffic light.",
        "They ________ the National Museum last month.",
        "I ________ English until 11 p.m. last night.",
        "The train ________ on time.",
        "We ________ on the phone last night.",
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=pp[i - 1], accept=[pb[i - 1]])
        for i in range(1, 7)
    ]
    save(
        2,
        "c02-u2-B.json",
        build_practice(
            practice_id="cm1:c02:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle="일반동사의 과거형 · POINT 3 (p. 25)",
            pages="25",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어를 사용하여 문장을 완성하세요.",
        WR,
        "words",
        labels_az("C", 5),
        "POINT 3·4",
    )
    pc = ["got", "ran", "invented", "planned", "paid"]
    pr = [
        "He ________ a new computer last week.",
        "The boy ________ very fast in the race.",
        "Bell ________ the telephone.",
        "We ________ a picnic for Sunday.",
        "I ________ for the meal.",
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=pr[i - 1], accept=[pc[i - 1]])
        for i in range(1, 6)
    ]
    save(
        2,
        "c02-u2-C.json",
        build_practice(
            practice_id="cm1:c02:u2-C",
            title="Unit 2 Unit Exercise — Section C",
            subtitle="일반동사의 과거형 · POINT 3·4 (p. 25)",
            pages="25",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    # U3
    sec = section(
        "A",
        "Section A",
        "우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("A", 5),
        "POINT 5",
    )
    na = [
        ("don't|sleep", "My cats ________ ________ a lot."),
        ("don't|eat", "I ________ ________ oranges."),
        ("doesn't|watch", "My father ________ ________ news programs."),
        ("doesn't|do", "She ________ ________ much exercise."),
        ("don't|work", "Sam and Peter ________ ________ in the same office."),
    ]
    items = []
    for i, (acc, pe) in enumerate(na, 1):
        items.append(
            fill_item(
                iid=f"a{i:02d}",
                sec=sec,
                label=f"A{i}",
                prompt_en=pe,
                blanks=2,
                accept=[acc, acc.replace("don't", "do not").replace("doesn't", "does not")],
            )
        )
    save(
        2,
        "c02-u3-A.json",
        build_practice(
            practice_id="cm1:c02:u3-A",
            title="Unit 3 Unit Exercise — Section A",
            subtitle="일반동사의 부정문과 의문문 · POINT 5 (p. 29)",
            pages="29",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "B",
        "Section B",
        "다음 대화의 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("B", 5),
        "POINT 6",
    )
    nb = [
        ("Do|know|I don't", "A: ________ you ________ my sister?\nB: No, ________ ."),
        ("Does|have|he does", "A: ________ Peter ________ a girlfriend?\nB: Yes, ________ ."),
        ("Does|live|she doesn't", "A: ________ Jane ________ in London?\nB: No, ________ ."),
        ("Do|eat|they do", "A: ________ they ________ a lot of rice?\nB: Yes, ________ ."),
        ("Does|have|it does", "A: ________ their school ________ a swimming pool?\nB: Yes, ________ ."),
    ]
    items = []
    for i, (acc, pe) in enumerate(nb, 1):
        items.append(fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=pe, blanks=3, accept=[acc]))
    save(
        2,
        "c02-u3-B.json",
        build_practice(
            practice_id="cm1:c02:u3-B",
            title="Unit 3 Unit Exercise — Section B",
            subtitle="일반동사의 부정문과 의문문 · POINT 6 (p. 29)",
            pages="29",
            timer_minutes=20,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어를 사용하여 질문을 완성하거나 문장을 완성하세요.",
        WR,
        "words",
        labels_az("C", 6),
        "POINT 6·7",
    )
    nc = ["buy", "Do", "spend", "meet", "stay", "have"]
    prc = [
        "Did he ________ something at the supermarket?",
        "________ your brothers clean the room?",
        "Did they ________ a lot of money yesterday?",
        "We didn't ________ Susan. We met Ann.",
        "He doesn't ________ at home.",
        "Does your sister ________ long hair?",
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=prc[i - 1], accept=[nc[i - 1]])
        for i in range(1, 7)
    ]
    save(
        2,
        "c02-u3-C.json",
        build_practice(
            practice_id="cm1:c02:u3-C",
            title="Unit 3 Unit Exercise — Section C",
            subtitle="일반동사의 부정문과 의문문 · POINT 6·7 (p. 29)",
            pages="29",
            timer_minutes=20,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    # Chapter test (answers from key p.30)
    secs = [
        section("1-4", "[1–4]", "[1–4] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(4)),
        section("5-6", "[5–6]", "[5–6] 다음 문장을 괄호 안의 지시대로 바꿔 쓰세요.", SENT, "sentence", labels_num(2, 5)),
        section("7-9", "[7–9]", "[7–9] 다음 중 어법상 알맞은 것을 고르세요.", MC, "choice", labels_num(3, 7)),
        section("10-11", "[10–11]", "[10–11] 다음 밑줄 친 부분을 어법상 알맞은 형태로 고치세요.", f"[ ] 안의 말이 밑줄 친 부분이에요. {CORR}", "words", labels_num(2, 10)),
        section("12", "[12]", "[12] 다음 중 어법상 알맞은 것을 고르세요.", MC, "choice", ["12"]),
        section("13", "[13]", "[13] 다음 밑줄 친 부분을 어법상 알맞은 형태로 고치세요.", f"[ ] 안의 말이 밑줄 친 부분이에요. {CORR}", "words", ["13"]),
        section("14", "[14]", "[14] 다음 빈칸에 알맞은 말을 쓰세요.", WR2, "words", ["14"]),
        section("15", "[15]", "[15] 다음 표를 보고 대화를 완성하세요.", WR2, "words", ["15"]),
    ]
    items = []
    items += [
        mc_item(iid="q01", sec=secs[0], label="1", prompt_en="They ________ up early on weekdays.", choices=["wake", "wakes", "waking", "woke", "woken"], answer_index=5),
        mc_item(iid="q02", sec=secs[0], label="2", prompt_en="________ Nancy like math?", choices=["Do", "Does", "Did", "Is", "Are"], answer_index=2),
        mc_item(iid="q03", sec=secs[0], label="3", prompt_en="A: ________ the store open at 9? B: Yes. / B: Do you jog in the morning?", choices=["Do", "Does", "Did", "Are", "Is"], answer_index=3),
        mc_item(iid="q04", sec=secs[0], label="4", prompt_en="A: ________ you eat breakfast? B: No, I didn't.", choices=["Do", "Does", "Did", "Are", "Were"], answer_index=1),
    ]
    items += [
        sent_item(iid="q05", sec=secs[1], label="5", prompt_en="He does his homework in the room. (3인칭 단수 현재형으로)", accept=["He does his homework in the room.", "He does his homework in the room"]),
        sent_item(iid="q06", sec=secs[1], label="6", prompt_en="Kate buy a jacket. (과거형으로)", accept=["Kate bought a jacket.", "Kate bought a jacket"]),
    ]
    items += [
        mc_item(iid="q07", sec=secs[2], label="7", choices=["He goes to the library.", "I read books.", "Do you have a sister?", "Kevin plays soccer with his father."], answer_index=1),
        mc_item(iid="q08", sec=secs[2], label="8", choices=["She studies Chinese.", "I eat breakfast.", "He doesn't eat breakfast.", "They don't like cooking.", "He doesn't eat breakfast in the morning."], answer_index=5),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["studied", "don't like", "did", "ate", "eated"], answer_index=4),
    ]
    items += [
        fill_item(iid="q10", sec=secs[3], label="10", prompt_en="I [getted] a letter yesterday.", accept=["got"]),
        fill_item(iid="q11", sec=secs[3], label="11", prompt_en="She [doesn't studies] English.", accept=["doesn't study", "does not study"]),
    ]
    items.append(mc_item(iid="q12", sec=secs[4], label="12", choices=["Did Tom play baseball?", "Do Tom play baseball?", "Does Tom played baseball?", "Did Tom played baseball?", "Do Tom played baseball?"], answer_index=5))
    items.append(fill_item(iid="q13", sec=secs[5], label="13", prompt_en="Peter [leave] for school at 7:30.", accept=["leaves"]))
    items.append(fill_item(iid="q14", sec=secs[6], label="14", prompt_en="We ________ hamburgers. We ________ ________ computer games last night.", blanks=3, accept=["ate|didn't play", "ate|did not play"]))
    items.append(fill_item(iid="q15", sec=secs[7], label="15", prompt_en="Tom: read(O) piano(X) guitar(O) / Sujin: read(O) piano(O) guitar(X) — Complete: does, reads, doesn't, plays (4 blanks)", blanks=4, accept=["does|reads|doesn't|plays", "does|reads|does not|plays"]))
    save(
        2,
        "c02-test.json",
        build_practice(
            practice_id="cm1:c02:test",
            title="Chapter Test",
            subtitle="Chapter 02 일반동사 (p. 30)",
            pages="30",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c02-test",
            **m,
        ),
    )

    print("ch02 SB done")


if __name__ == "__main__":
    gen_ch02()
