#!/usr/bin/env python3
"""Scan-extracted SB practice data for Ch11–Ch12 — 천일문 Grammar 1 (uploads/ch11-12-sb.pdf)."""
from __future__ import annotations

from practice_lib import (
    CORR,
    MC,
    OX,
    SENT,
    WR,
    WR2,
    build_practice,
    choose_all_item,
    fill_item,
    labels_az,
    labels_num,
    match_item,
    mc_item,
    sb,
    section,
    sent_item,
    write_practice,
)


def _bracket(sec: dict, label: str, iid: str, prompt: str, choices: list[str], ans: int) -> dict:
    return mc_item(iid=iid, sec=sec, label=label, prompt_en=prompt, choices=choices, answer_index=ans)


def _ox(sec: dict, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _sym(sec: dict, label: str, iid: str, prompt: str, key: str) -> dict:
    keys = {"a": ["a", "ⓐ", "A"], "b": ["b", "ⓑ", "B"], "c": ["c", "ⓒ", "C"]}
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=keys[key])


def _write_docs(data: dict[str, dict], chapter: int) -> None:
    for name, doc in data.items():
        write_practice(f"data/chunilmun1/chapter{chapter:02d}/{name}", doc)


def build_ch11_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(11, "전치사")

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 전치사를 at, on, in 중에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 8),
        "POINT 1",
    )
    u1a = [
        ("There is a ball ________ the room.", ["in"]),
        ("We will arrive ________ the guesthouse in a few minutes.", ["at"]),
        ("She put her cell phone ________ the table.", ["on"]),
        ("The train stopped ________ the station.", ["at"]),
        ("Most people speak Spanish ________ South America.", ["in"]),
        ("Who painted the picture ________ the wall?", ["on"]),
        ("The boy showed the ticket ________ the gate.", ["at"]),
        ("What do you have ________ your pocket?", ["in"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1a, 1)]
    out["c11-u1-A.json"] = build_practice(
        practice_id="cm1:c11:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="전치사 · POINT 1 (p. 140)",
        pages="140",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "그림과 일치하도록 빈칸에 알맞은 전치사를 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("B", 4),
        "POINT 2",
        word_bank=["in front of", "under", "behind", "by"],
    )
    u1b = [
        ("There is a book ________ the computer.", ["behind"]),
        ("There is a calendar ________ the computer.", ["in front of"]),
        ("There is a chair ________ the desk.", ["by"]),
        ("A cat is sitting ________ the chair.", ["under"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["c11-u1-B.json"] = build_practice(
        practice_id="cm1:c11:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="전치사 · POINT 2 (p. 140)",
        pages="140",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어 중 알맞은 것을 골라 빈칸에 쓰세요.",
        WR2,
        "words",
        labels_az("C", 4),
        "POINT 1-2",
    )
    u1c = [
        (
            "(in, into)\nMr. Davis worked ________ City Hall.\nMr. Davis walked ________ City Hall.",
            ["in", "into"],
            2,
        ),
        (
            "(on, over)\nBalloons are flying ________ the building.\nI put the ball ________ the floor.",
            ["over", "on"],
            2,
        ),
        (
            "(at, around)\nMrs. Nelson wore a beautiful necklace ________ her neck.\nMrs. Nelson is relaxing ________ the beach.",
            ["around", "at"],
            2,
        ),
        (
            "(in, between)\nStay ________ the car for a moment.\nStand ________ Mina and Somi.",
            ["in", "between"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1c, 1)
    ]
    out["c11-u1-C.json"] = build_practice(
        practice_id="cm1:c11:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="전치사 · POINT 1-2 (p. 140)",
        pages="140",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 전치사를 at, on, in 중에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 8),
        "POINT 3",
    )
    u2a = [
        ("I take ballet lessons ________ Thursdays.", ["on"]),
        ("World War II ended ________ 1945.", ["in"]),
        ("My family usually eats dinner ________ 6 p.m.", ["at"]),
        ("My grandfather takes a nap ________ the afternoon.", ["in"]),
        ("It usually rains a lot ________ summer.", ["in"]),
        ("This year the new semester begins ________ March 5th.", ["on"]),
        ("Victor and I always have lunch ________ noon.", ["at"]),
        ("Drive carefully ________ rainy days.", ["on"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2a, 1)]
    out["c11-u2-A.json"] = build_practice(
        practice_id="cm1:c11:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="전치사 · POINT 3 (p. 143)",
        pages="143",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 단어 중 알맞은 것을 골라 빈칸에 쓰세요.",
        WR2,
        "words",
        labels_az("B", 3),
        "POINT 4",
    )
    u2b = [
        (
            "(before, after)\nI was really tired ________ the trip.\nPlease check the user guide ________ use.",
            ["after", "before"],
            2,
        ),
        (
            "(for, during)\nI waited for a bus ________ 20 minutes.\nPay attention to your teacher's words ________ class.",
            ["for", "during"],
            2,
        ),
        (
            "(by, until)\nJoin our club ________ the end of this month.\nThe library is open ________ 9 o'clock tonight.",
            ["by", "until"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2b, 1)
    ]
    out["c11-u2-B.json"] = build_practice(
        practice_id="cm1:c11:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="전치사 · POINT 4 (p. 143)",
        pages="143",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("C", 5),
        "POINT 3-4",
    )
    u2c = [
        ("밤에 피아노를 치지 마라. (night)\n→ Don't play the piano ________.", ["Don't play the piano at night.", "at night"]),
        (
            "우리는 올해 5월에 축제를 열 것이다. (May)\n→ We will hold the festival ________ this year.",
            ["We will hold the festival in May this year.", "in May"],
        ),
        (
            "내 친구와 나는 자정까지 전화로 수다를 떨었다. (midnight)\n→ My friend and I chatted on the phone ________.",
            ["My friend and I chatted on the phone until midnight.", "until midnight"],
        ),
        (
            "누군가의 휴대전화가 시험 중에 울렸다. (the test)\n→ Somebody's cell phone rang ________.",
            ["Somebody's cell phone rang during the test.", "during the test"],
        ),
        (
            "그는 한 달 동안 유럽을 여행하고 있다. (a month)\n→ He's traveling in Europe ________.",
            ["He's traveling in Europe for a month.", "for a month"],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["c11-u2-C.json"] = build_practice(
        practice_id="cm1:c11:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="전치사 · POINT 3-4 (p. 143)",
        pages="143",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 전치사를 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("A", 5),
        "POINT 5",
        word_bank=["to", "with", "by", "like", "about"],
    )
    u3a = [
        ("The child sang a song ________ a bird.", ["like"]),
        ("I went to visit my grandparents ________ train.", ["by"]),
        ("My close friend moved ________ another city.", ["to"]),
        ("She will give a speech ________ world peace.", ["about"]),
        ("I went to the market ________ my mom.", ["with"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3a, 1)]
    out["c11-u3-A.json"] = build_practice(
        practice_id="cm1:c11:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="전치사 · POINT 5 (p. 145)",
        pages="145",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 공통으로 들어갈 전치사를 <보기>에서 골라 쓰세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 5",
        word_bank=["with", "against", "to", "through"],
    )
    u3b = [
        (
            "Would you tell me the way ________ the station?\nI sent a letter ________ my aunt.",
            ["to", "to"],
            2,
        ),
        (
            "Our team won the game ________ a strong team.\nThe cat fell asleep ________ my legs.",
            ["against", "with"],
            2,
        ),
        (
            "He walked ________ the garden.\nShe learned French ________ online courses.",
            ["through", "through"],
            2,
        ),
        (
            "He cleaned the windows ________ a sponge.\nCan I stay in your hotel ________ my dog?",
            ["with", "with"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3b, 1)
    ]
    out["c11-u3-B.json"] = build_practice(
        practice_id="cm1:c11:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="전치사 · POINT 5 (p. 145)",
        pages="145",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("C", 4),
        "POINT 6",
    )
    u3c = [
        (
            "Serena는 과학을 잘한다. (science, good)\n→ Serena ________________________________.",
            ["Serena is good at science."],
        ),
        (
            "내 남동생은 자동차에 흥미가 있다. (cars, interested)\n→ My brother ________________________________.",
            ["My brother is interested in cars."],
        ),
        (
            "양동이는 물고기로 가득 차 있다. (fish, full)\n→ The bucket ________________________________.",
            ["The bucket is full of fish."],
        ),
        (
            "나는 버스터미널에서 집까지 걸어갔다. (the bus terminal)\n→ I walked ________________________________ my home.",
            ["I walked from the bus terminal to my home.", "from the bus terminal to"],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["c11-u3-C.json"] = build_practice(
        practice_id="cm1:c11:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="전치사 · POINT 6 (p. 145)",
        pages="145",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out["c11-test.json"] = _build_ch11_test(m)
    return out


def _build_ch11_test(m: dict) -> dict:
    secs = [
        section("1-3", "[1–3]", "[1–3] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(3)),
        section("4", "[4]", "[4] 다음 중 빈칸에 들어갈 단어가 나머지 하나와 다른 하나를 고르세요.", MC, "choice", ["4"]),
        section("5", "[5]", "[5] 우리말과 일치하도록 (A), (B)에 들어갈 알맞은 전치사를 쓰세요.", WR2, "words", ["5"]),
        section("6", "[6]", "[6] 다음 대화의 밑줄 친 우리말을 영작하세요.", SENT, "sentence", ["6"]),
        section("7", "[7]", "[7] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 다음 중 어법상 알맞은 문장의 개수를 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 (A)~(E)에 들어갈 말로 알맞지 않은 것을 고르세요.", MC, "choice", ["9"]),
        section(
            "10",
            "[10]",
            "[10] 다음 중 어법상 알맞은 문장 두 개를 고르세요.",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요.",
            "words",
            ["10"],
        ),
        section("11", "[11]", "[11] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.", SENT, "sentence", ["11"]),
        section("12", "[12]", "[12] 다음 중 빈칸에 들어갈 전치사에 해당되지 않는 것을 고르세요.", MC, "choice", ["12"]),
        section("13", "[13]", "[13] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 다른 하나를 고르세요.", MC, "choice", ["13"]),
        section("14", "[14]", "[14] 그림과 일치하도록 빈칸에 알맞은 전치사를 <보기>에서 골라 쓰세요.", WR2, "words", ["14"]),
        section("15", "[15]", "[15] 다음 중 <보기>에서 빈칸 ⓐ~ⓓ에 들어갈 전치사가 같은 것끼리 짝지어진 것을 고르세요.", MC, "choice", ["15"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="What can you see (A) the sea?\nThey are sitting (B) the campfire.",
            choices=["into — out of", "into — around", "behind — out of", "under — under", "under — around"],
            answer_index=5,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="There are fifty states (A) the U.S.\nShe went (B) the kitchen.",
            choices=["at — by", "on — into", "at — between", "in — into", "in — between"],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=secs[0],
            label="3",
            prompt_en="My mom usually works (A) late.\nIt takes only 20 minutes (B) taxi.",
            choices=["by — by", "by — until", "until — by", "until — through", "to — through"],
            answer_index=3,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            choices=[
                "My aunt is living ________ Mexico.",
                "Birds are singing ________ the sky.",
                "There is a fan ________ the ceiling.",
                "Let's meet ________ front of the theater.",
                "I found my cell phone ________ my bag.",
            ],
            answer_index=3,
        ),
        fill_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="나리와 나는 오후에 버스 정류장에서 만날 것이다.\nNari and I will meet (A) ________ the bus stop (B) ________ the afternoon.",
            accept=["at|in"],
            blanks=2,
            blank_labels=["(A)", "(B)"],
        ),
        sent_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="A: What day do you take piano lessons?\nB: <u>나는 화요일에 피아노 레슨을 받아.</u>",
            accept=["I take piano lessons on Tuesdays.", "I take piano lessons on Tuesday."],
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en="저녁 식사 전에 나는 한 시간 동안 TV를 보았다.",
            choices=[
                "I watched TV for an hour after dinner.",
                "I watched TV for an hour before dinner.",
                "I watched TV during an hour after dinner.",
                "I watched TV during an hour until dinner.",
                "I watched TV during an hour before dinner.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            prompt_en="ⓐ He stayed up until 11:00 p.m.\nⓑ I lived on Busan two years ago.\nⓒ I do yoga for thirty minutes a day.\nⓓ Our graduation day is at February 15.\nⓔ Sue doesn't get up early on Sundays.",
            choices=["1개", "2개", "3개", "4개", "5개"],
            answer_index=3,
        ),
        mc_item(
            iid="q09",
            sec=secs[6],
            label="9",
            prompt_en=(
                "Mary and I went (A) a trip. I was very tired on the first day, so I slept (B) eight hours. "
                "(C) breakfast, we went (D) the art museum (E) bus. We had a good time there."
            ),
            choices=["(A) on", "(B) for", "(C) After", "(D) with", "(E) by"],
            answer_index=4,
        ),
        choose_all_item(
            iid="q10",
            sec=secs[7],
            label="10",
            prompt_en=(
                "① My father goes to work by his car.\n"
                "② I went to the nail shop with my mom.\n"
                "③ The magician turned a flower in a bird.\n"
                "④ I finished my math project thanks in Seho.\n"
                "⑤ New York City is famous on the Statue of Liberty."
            ),
            accept_pairs=[("2", "5")],
        ),
        sent_item(
            iid="q11",
            sec=secs[8],
            label="11",
            prompt_en="내가 그를 보았을 때, 그의 눈은 눈물로 가득 차 있었다. (full)\n→ When I saw him, his eyes ________________________________ tears.",
            accept=["When I saw him, his eyes were full of tears.", "were full of tears"],
        ),
        mc_item(
            iid="q12",
            sec=secs[9],
            label="12",
            prompt_en="ⓐ Can I go ________ you?\nⓑ She walked ________ a model.\nⓒ This watch is different ________ mine.\nⓓ This cafe is famous ________ cheesecake.",
            choices=["with", "for", "from", "through", "like"],
            answer_index=4,
        ),
        mc_item(
            iid="q13",
            sec=secs[10],
            label="13",
            prompt_en="<보기> The baby smiled <u>like</u> an angel.",
            choices=[
                "He cooks well <u>like</u> a chef.",
                "She ran fast <u>like</u> the wind.",
                "My brother talks <u>like</u> an adult.",
                "I want to be a lawyer <u>like</u> my mom.",
                "I <u>like</u> my new school.",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q14",
            sec=secs[11],
            label="14",
            prompt_en=(
                "<보기> along, in, above, between\n"
                "1. A table is ________ two chairs.\n"
                "2. There is a blue car ________ the garage.\n"
                "3. There is a fence ________ the backyard."
            ),
            accept=["between|in|along", "between|in|around"],
            blanks=3,
        ),
        mc_item(
            iid="q15",
            sec=secs[12],
            label="15",
            prompt_en=(
                "<보기> with, between, to, around\n"
                "ⓐ There was thick fog ________ the lake.\n"
                "ⓑ Our summer vacation is from July ________ August.\n"
                "ⓒ Look at the house ________ the large garden. It's very nice.\n"
                "ⓓ You don't have to go out ________ an umbrella. It won't rain."
            ),
            choices=["ⓐ, ⓒ", "ⓑ, ⓒ", "ⓒ, ⓓ", "ⓐ, ⓓ", "ⓑ, ⓓ"],
            answer_index=4,
        ),
    ]
    return build_practice(
        practice_id="cm1:c11:test",
        title="Chapter Test",
        subtitle="Chapter 11 전치사 (p. 146–147)",
        pages="146–147",
        timer_minutes=32,
        sections=secs,
        items=items,
        test_id="c11-test",
        **m,
    )


def build_ch12_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(12, "접속사")

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 접속사를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 1",
        word_bank=["and", "but", "or"],
    )
    u1a = [
        ("Is it a rock concert ________ a jazz concert?", ["or"]),
        ("He saw a bird, ________ it sat on a branch.", ["and"]),
        ("He wanted to contact her ________ didn't have her number.", ["but"]),
        ("Which sport do you like better, soccer ________ baseball?", ["or"]),
        ("I want to buy her a nice present, ________ I don't have much money.", ["but"]),
        ("I'm not a kid anymore, ________ my parents still treat me like a child.", ["but"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1a, 1)]
    out["c12-u1-A.json"] = build_practice(
        practice_id="cm1:c12:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="접속사 · POINT 1 (p. 151)",
        pages="151",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 것을 <보기>에서 골라 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("B", 4),
        "POINT 1",
    )
    u1b = [
        (
            "The movie was long, ________.\n<보기> ① and tastes delicious  ② but he put it back  ③ or an apple  ④ but it was interesting",
            ["The movie was long, but it was interesting.", "but it was interesting"],
        ),
        (
            "Street food looks good ________.\n<보기> ① and tastes delicious  ② but he put it back  ③ or an apple  ④ but it was interesting",
            ["Street food looks good and tastes delicious.", "and tastes delicious"],
        ),
        (
            "My father caught a big fish, ________.\n<보기> ① and tastes delicious  ② but he put it back  ③ or an apple  ④ but it was interesting",
            ["My father caught a big fish, but he put it back.", "but he put it back"],
        ),
        (
            "You can have an orange ________. Choose one.\n<보기> ① and tastes delicious  ② but he put it back  ③ or an apple  ④ but it was interesting",
            ["You can have an orange or an apple.", "or an apple"],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["c12-u1-B.json"] = build_practice(
        practice_id="cm1:c12:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="접속사 · POINT 1 (p. 151)",
        pages="151",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("C", 5),
        "POINT 2",
    )
    u1c = [
        ("She washed the clothes and <u>cleans</u> the house.", False, "cleaned"),
        ("I met my friends and <u>borrowed</u> some books yesterday.", True, ""),
        ("You can take a break or <u>listening</u> to music freely.", False, "listen"),
        ("My grandma talks and <u>sings</u> to her plants every day.", True, ""),
        ("They wanted to meet you and <u>saying</u> thank you.", False, "say"),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1c, 1)]
    out["c12-u1-C.json"] = build_practice(
        practice_id="cm1:c12:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="접속사 · POINT 2 (p. 151)",
        pages="151",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "문맥상 자연스러운 문장이 되도록 알맞은 것을 골라 연결하세요.",
        "왼쪽과 오른쪽을 연결하세요.",
        "match",
        ["A1"],
        "POINT 3",
    )
    pairs = [
        {"left": "Turn off the light", "right": "when you leave the room."},
        {"left": "I don't like lemons", "right": "because they're sour."},
        {"left": "After I finished exercising,", "right": "I was very thirsty."},
        {"left": "He packed his school bag", "right": "before he went to school."},
        {"left": "If you study hard,", "right": "you can learn English quickly."},
    ]
    items = [match_item(iid="a01", sec=sec, label="A1", pairs=pairs, prompt_ko="1–5와 ⓐ–ⓔ 연결")]
    out["c12-u2-A.json"] = build_practice(
        practice_id="cm1:c12:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="접속사 · POINT 3 (p. 154)",
        pages="154",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "that을 사용하여 <보기>와 같이 주어진 두 문장을 한 문장으로 쓰세요.",
        SENT,
        "sentence",
        labels_az("B", 4),
        "POINT 4",
    )
    u2b = [
        (
            "<보기> It was not my fault. + I said it.\n→ I said that it was not my fault.\n\nMinsu loves music. + I know it.\n→ I know ________________________________.",
            ["I know that Minsu loves music."],
        ),
        (
            "My brother will be a good doctor. + I think it.\n→ I think ________________________________.",
            ["I think that my brother will be a good doctor."],
        ),
        (
            "I can win the game next time. + I hope it.\n→ I hope ________________________________.",
            ["I hope that I can win the game next time."],
        ),
        (
            "He is honest. + I believe it.\n→ I believe ________________________________.",
            ["I believe that he is honest."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["c12-u2-B.json"] = build_practice(
        practice_id="cm1:c12:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="접속사 · POINT 4 (p. 154)",
        pages="154",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("C", 5),
        "POINT 3-4",
    )
    u2c = [
        (
            "만약 지금 이것을 사시면, 공짜로 하나를 더 얻을 수 있습니다. (this, buy)\n→ ________________________________ now, you can get one more for free.",
            ["If you buy this", "If you buy this now, you can get one more for free."],
        ),
        (
            "내가 열 살이었을 때, 나는 새로운 도시로 이사 갔다. (ten, was)\n→ ________________________________, I moved to a new city.",
            ["When I was ten", "When I was ten years old"],
        ),
        (
            "네가 집에 돌아오기 전에 나는 숙제를 끝낼 거야. (home, come back)\n→ I'll finish my homework ________________________________.",
            ["before you come back home", "before you come home"],
        ),
        (
            "Michael은 매우 친절하기 때문에 인기가 있다. (kind, is, so)\n→ ________________________________, he is popular.",
            ["Because Michael is so kind", "Because he is so kind"],
        ),
        (
            "사람들은 웃음이 최고의 약이라고 말한다. (the best, laughter, medicine, is)\n→ People say ________________________________.",
            ["People say that laughter is the best medicine.", "that laughter is the best medicine"],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["c12-u2-C.json"] = build_practice(
        practice_id="cm1:c12:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="접속사 · POINT 3-4 (p. 154)",
        pages="154",
        timer_minutes=24,
        sections=[sec],
        items=items,
        **m,
    )

    out["c12-test.json"] = _build_ch12_test(m)
    return out


def _build_ch12_test(m: dict) -> dict:
    secs = [
        section("1-2", "[1–2]", "[1–2] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2)),
        section("3-4", "[3–4]", "[3–4] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(2, 3)),
        section("5", "[5]", "[5] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", ["5"]),
        section("6", "[6]", "[6] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["6"]),
        section("7", "[7]", "[7] 그림을 보고 <보기>와 같이 when을 사용하여 문장을 완성하세요.", WR2, "words", ["7"]),
        section("8-9", "[8–9]", "[8–9] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.", SENT, "sentence", labels_num(2, 8)),
        section("10", "[10]", "[10] 그림을 보고 <조건>에 맞게 주어진 단어를 사용하여 문장을 완성하세요.", WR2, "words", ["10"]),
        section("11-12", "[11–12]", "[11–12] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 11)),
        section("13", "[13]", "[13] <A>에서 문장을 고른 후 <B>의 접속사를 사용하여 빈칸을 완성하세요. (한 번씩만)", WR2, "words", ["13"]),
        section("14", "[14]", "[14] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 같은 것을 고르세요.", MC, "choice", ["14"]),
        section("15", "[15]", "[15] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 다른 하나를 고르세요.", MC, "choice", ["15"]),
        section("16", "[16]", "[16] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 두 개를 찾아 그 기호를 쓰고 바르게 고쳐 쓰세요.", CORR, "words", ["16-1", "16-2"]),
        section("17", "[17]", "[17] 다음 중 밑줄 친 부분을 생략할 수 없는 문장을 고르세요.", MC, "choice", ["17"]),
        section(
            "18",
            "[18]",
            "[18] 다음 중 문맥상 어색한 문장을 모두 고르세요.",
            "알맞은 보기 번호를 모두 골라 빈칸에 쓰세요.",
            "words",
            ["18"],
        ),
        section("19", "[19]", "[19] 다음 글의 마지막 문장을 <조건>에 맞게 완성하세요.", SENT, "sentence", ["19"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Susan enjoys playing tennis, ________ she didn't play yesterday.",
            choices=["and", "but", "or", "so", "before"],
            answer_index=2,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="I like the singer ________ she has a beautiful voice.",
            choices=["after", "but", "or", "that", "because"],
            answer_index=5,
        ),
        sent_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="우리는 영화가 시작되기 전에 팝콘을 먹었다.\n(some popcorn / the movie / before / ate / started)\n→ We ________________________________.",
            accept=["We ate some popcorn before the movie started."],
        ),
        sent_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en="민수는 우리가 서로 존중해야 한다고 말했다.\n(that / said / should / we / each other / respect)\n→ Minsu ________________________________.",
            accept=["Minsu said that we should respect each other."],
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            choices=[
                "Is it Saturday or Sunday?",
                "Dan and I are good friends.",
                "My sister is smart and friend.",
                "Our school is old but beautiful.",
                "Patrick has sisters, but he doesn't have brothers.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="Her father was angry ________ Jina didn't tell the truth.\nMy little brother cried ________ he lost his toy.",
            choices=["if", "so", "that", "because", "before"],
            answer_index=4,
        ),
        fill_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en=(
                "<보기> (read books, bored) → Jack reads books when he is bored.\n"
                "(1) (draw pictures, alone)\nAnn ________________________________.\n"
                "(2) (go swimming, free)\nSam ________________________________."
            ),
            accept=[
                "Ann draws pictures when she is alone.|Sam goes swimming when he is free.",
                "draws pictures when she is alone|goes swimming when he is free",
            ],
            blanks=2,
        ),
        sent_item(
            iid="q08",
            sec=secs[5],
            label="8",
            prompt_en="나는 운동을 한 후에 아침 식사를 했다. (exercise)\n→ I had breakfast ________________________________.",
            accept=["I had breakfast after I exercised.", "after I exercised"],
        ),
        sent_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en="진수는 그의 선물이 그녀를 행복하게 만들길 바란다. (his gift, make, happy, will)\n→ Jinsu hopes ________________________________.",
            accept=[
                "Jinsu hopes his gift will make her happy.",
                "Jinsu hopes that his gift will make her happy.",
            ],
        ),
        fill_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en=(
                "<조건> because 포함, 과거 시제\n"
                "(1) Ted was angry ____________________________. (the school bus, miss)\n"
                "(2) ____________________________, he didn't come to school. (sick in bed, be)"
            ),
            accept=[
                "because he missed the school bus|Because he was sick in bed",
                "because he missed the school bus|he was sick in bed",
            ],
            blanks=2,
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en=(
                "Our normal body temperature and a dog's are similar, (A) the temperature of a dog is higher than ours. "
                "(B) it's usually between 38℃ and 39℃, your dog's body is always warmer than your body."
            ),
            choices=["and — But", "if — Because", "if — And", "but — Because", "but — But"],
            answer_index=4,
        ),
        mc_item(
            iid="q12",
            sec=secs[7],
            label="12",
            prompt_en=(
                "People in India have many New Year's Days (A) they use about 30 different calendars. "
                "People light lamps and exchange cards or gifts (B) they celebrate them."
            ),
            choices=["but — when", "because — when", "or — but", "because — but", "but — or"],
            answer_index=2,
        ),
        fill_item(
            iid="q13",
            sec=secs[8],
            label="13",
            prompt_en=(
                "<A> • I was in elementary school. • You go to the grocery store. • I was thirsty.\n"
                "<B> when, if, because\n"
                "(1) I drank a glass of orange juice ________________________________.\n"
                "(2) Buy me some apples ______________________________________.\n"
                "(3) I met many kind friends ___________________________________."
            ),
            accept=[
                "because I was thirsty|if you go to the grocery store|when I was in elementary school",
            ],
            blanks=3,
        ),
        mc_item(
            iid="q14",
            sec=secs[9],
            label="14",
            prompt_en="<보기> We thought <u>that</u> it was a bear.",
            choices=[
                "Look at <u>that</u> beautiful building.",
                "I know <u>that</u> girl in the white dress.",
                "Minji lives in <u>that</u> house over there.",
                "I don't believe <u>that</u> Kate can sing well.",
                "He knew <u>that</u> was a lie because he was smart.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q15",
            sec=secs[10],
            label="15",
            prompt_en="<보기> <u>When</u> you get home, call me.",
            choices=[
                "<u>When</u> does the next bus arrive?",
                "He ran away <u>when</u> he saw me yesterday.",
                "Drink a lot of water <u>when</u> you catch a cold.",
                "<u>When</u> I entered the room, nobody looked at me.",
                "She always smiles <u>when</u> she meets a stranger.",
            ],
            answer_index=1,
        ),
        fill_item(
            iid="q16a",
            sec=secs[11],
            label="16-1",
            prompt_en=(
                "Join the English movie club! … ⓐ <u>discuss</u> … ⓔ <u>sends</u> …\n"
                "(1) 기호 → 고친 말"
            ),
            accept=["a|discussing", "ⓐ|discussing", "A|discussing"],
            blanks=2,
        ),
        fill_item(
            iid="q16b",
            sec=secs[11],
            label="16-2",
            prompt_en="(2) 기호 → 고친 말 (위 지문)",
            accept=["e|send", "ⓔ|send", "E|send"],
            blanks=2,
        ),
        mc_item(
            iid="q17",
            sec=secs[12],
            label="17",
            choices=[
                "We thought <u>that</u> she was right.",
                "I guess <u>that</u> man is my teacher.",
                "Robert thinks <u>that</u> she is very wise.",
                "He believes <u>that</u> she tells the truth.",
                "I know <u>that</u> there is a hat in my bag.",
            ],
            answer_index=2,
        ),
        choose_all_item(
            iid="q18",
            sec=secs[13],
            label="18",
            prompt_en=(
                "① When I'm upset, I eat spicy food.\n"
                "② Eat dinner after you take a shower.\n"
                "③ She got up early, and she was late.\n"
                "④ Tim is sick, but he can't miss the test.\n"
                "⑤ I got wet if I didn't bring my umbrella."
            ),
            accept_pairs=[("3", "5")],
        ),
        sent_item(
            iid="q19",
            sec=secs[14],
            label="19",
            prompt_en=(
                "My best friend, Yumi, wants to be a pianist.\n"
                "After school, she always practices hard. So I ________________________________ in the future.\n"
                "<조건> believe와 알맞은 접속사 사용; (the best pianist, be, will, she)"
            ),
            accept=[
                "So I believe that she will be the best pianist in the future.",
                "believe that she will be the best pianist",
            ],
        ),
    ]
    return build_practice(
        practice_id="cm1:c12:test",
        title="Chapter Test",
        subtitle="Chapter 12 접속사 (p. 155–157)",
        pages="155–157",
        timer_minutes=36,
        sections=secs,
        items=items,
        test_id="c12-test",
        **m,
    )


if __name__ == "__main__":
    import sys

    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch11"):
        d11 = build_ch11_sb()
        _write_docs(d11, 11)
        print(f"chapter 11 sb: wrote {len(d11)} files")
    if fn in ("all", "ch12"):
        d12 = build_ch12_sb()
        _write_docs(d12, 12)
        print(f"chapter 12 sb: wrote {len(d12)} files")
