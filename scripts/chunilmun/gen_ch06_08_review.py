#!/usr/bin/env python3
"""Ch06–08 SB/WB + review-01 for 천일문 Grammar 1."""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from practice_lib import build_practice, fill_item, labels_az, labels_num, mc_item, section, sent_item
from gen_all import CORR, MC, OX, SENT, WR, WR2, save, sb, wb
from gen_rest import wb_unit


def _sb_units(ch: int, title: str, units: list[tuple]) -> None:
    """units: list of (u, page, subtitle_topic, sections dict letter->(point,dir,rule,mode,labels,data))"""
    m = sb(ch, title)
    for u, page, topic, sections in units:
        for letter, (point, direction, rule, mode, labels, data) in sections.items():
            sec = section(letter, f"Section {letter}", direction, rule, mode, labels, point)
            items = []
            for i, row in enumerate(data, 1):
                iid = f"{letter.lower()}{i:02d}"
                lab = labels[i - 1]
                if row[0] == "mc":
                    _, prompt, choices, ans = row
                    items.append(mc_item(iid=iid, sec=sec, label=lab, prompt_en=prompt, choices=choices, answer_index=ans))
                elif row[0] == "sent":
                    _, prompt, acc = row
                    items.append(sent_item(iid=iid, sec=sec, label=lab, prompt_en=prompt, accept=acc))
                else:
                    _, prompt, acc, *rest = row
                    blanks = rest[0] if rest else 1
                    items.append(
                        fill_item(
                            iid=iid,
                            sec=sec,
                            label=lab,
                            prompt_en=prompt,
                            accept=acc if isinstance(acc, list) else [acc],
                            blanks=blanks,
                        )
                    )
            slug = f"c{ch:02d}-u{u}-{letter}"
            save(
                ch,
                f"{slug}.json",
                build_practice(
                    practice_id=f"cm1:c{ch:02d}:u{u}-{letter}",
                    title=f"Unit {u} Unit Exercise — Section {letter}",
                    subtitle=f"{topic} · {point} (p. {page})",
                    pages=str(page),
                    timer_minutes=20,
                    sections=[sec],
                    items=items,
                    **m,
                ),
            )


def gen_ch06() -> None:
    wr = WR
    wr2 = WR2
    u1a = [
        ("fill", "Matt is my best friend. I like ________ very much.", "him"),
        ("fill", "Is this ________ bag?", "your"),
        ("fill", "Please call ________ later.", "me"),
        ("fill", "That house is ________.", "ours"),
        ("fill", "________ are good students.", "We"),
        ("fill", "The cat licked ________ paw.", "its"),
        ("fill", "I met ________ at the library.", "her"),
    ]
    u1b = [
        ("fill", "This book is ________.", "hers"),
        ("fill", "________ turn is next.", "Yours"),
        ("fill", "________ father is a doctor.", "my"),
        ("fill", "That is ________ bike.", "his"),
        ("fill", "________ mother is kind.", "Her"),
        ("fill", "James lost ________ cap.", "his"),
        ("fill", "The blue pen is ________.", "mine"),
    ]
    u1c = [
        ("fill", "I saw John. I gave ________ the book.", ["him"]),
        ("fill", "This is ________ desk.", ["Tom's"]),
        ("fill", "________ loves her dog.", ["She"]),
        ("fill", "________ told me ________ name.", ["He|his"], 2),
        ("fill", "My bag is bigger than ________.", ["hers"]),
    ]
    u2a = [
        ("fill", "________ is my brother's room.", "That"),
        ("fill", "________ flowers smell nice.", "These"),
        ("fill", "________ book is mine.", "This"),
        ("fill", "________ man over there is my uncle.", "That"),
        ("fill", "________ shoes are too small.", "Those"),
    ]
    u2b = [
        ("fill", "These [is] my friends.", ["are"]),
        ("fill", "That [this] is a good idea.", ["This"]),
        ("fill", "[This] is rainy today.", ["It"]),
        ("fill", "Look at [this] building.", ["that"]),
        ("fill", "Those [this] are my gloves.", ["These"]),
        ("fill", "It is Monday today.", ["O", "o"]),
        ("fill", "These [that] apples are sweet.", ["Those"]),
    ]
    u2c = [
        ("fill", "What day is it? → It is[It's] ________.", ["Monday"], 1),
        ("fill", "What time is it? → It is[It's] ________.", ["11 o'clock", "eleven o'clock"], 1),
        ("fill", "How is the weather? → It is[It's] ________.", ["sunny"], 1),
        ("fill", "How far is it? → It is[It's] ________.", ["8 kilometers", "8 km"], 1),
    ]
    u3a = [
        ("fill", "I need ________.", "a pencil"),
        ("fill", "These ________ are too long.", "pants"),
        ("fill", "Do you have ________?", "one"),
        ("fill", "I want new ________.", "ones"),
        ("fill", "Where is my phone? I can't find ________.", "it"),
        ("fill", "The red shoes are nice. I'll buy ________.", "ones"),
    ]
    u3b = [
        ("fill", "Would you like ________ cookies?", ["some"]),
        ("fill", "I don't have ________ money.", ["any"]),
        ("fill", "Are there ________ eggs?", ["any"]),
        ("fill", "She brought ________ sandwiches.", ["some"]),
        ("fill", "Can I have ________ water?", ["some"]),
        ("fill", "He didn't give ________ help.", ["any"]),
    ]
    u3c = [
        ("fill", "Someone ________ on the stage.", "is"),
        ("fill", "Everyone ________ that movie.", "likes"),
        ("fill", "How ________ your family?", "is"),
        ("fill", "________ anyone know the answer?", "Does"),
        ("fill", "Nothing ________ me.", "scares"),
        ("fill", "Something ________ wrong.", "is"),
    ]
    _sb_units(
        6,
        "대명사",
        [
            (
                1,
                67,
                "인칭대명사",
                {
                    "A": ("POINT 1·2", "빈칸에 알맞은 대명사를 쓰세요.", wr, "words", labels_az("A", 7), u1a),
                    "B": ("POINT 2", "빈칸에 알맞은 소유대명사를 쓰세요.", wr, "words", labels_az("B", 7), u1b),
                    "C": ("POINT 2", "괄호 안에서 고르고 빈칸을 채우세요.", wr2, "words", labels_az("C", 5), u1c),
                },
            ),
            (
                2,
                70,
                "지시대명사와 it",
                {
                    "A": ("POINT 3·4", "지시대명사를 쓰세요.", wr, "words", labels_az("A", 5), u2a),
                    "B": ("POINT 4·5", "틀리면 고친 말만, 맞으면 O.", OX, "words", labels_az("B", 7), u2b),
                    "C": ("POINT 5", "It is[It's]로 답하세요.", wr, "words", labels_az("C", 4), u2c),
                },
            ),
            (
                3,
                73,
                "one, some, any",
                {
                    "A": ("POINT 6", "one/ones/it을 쓰세요.", wr, "words", labels_az("A", 6), u3a),
                    "B": ("POINT 7", "some/any를 쓰세요.", wr, "words", labels_az("B", 6), u3b),
                    "C": ("POINT 8", "주어-동사를 맞추세요.", wr, "words", labels_az("C", 6), u3c),
                },
            ),
        ],
    )
    m = sb(6, "대명사")
    secs = [
        section("1-6", "[1–6]", "[1–6] MC", MC, "choice", labels_num(6)),
        section("7", "[7]", "[7] it / time", WR2, "words", ["7"]),
        section("8-12", "[8–12]", "[8–12] MC", MC, "choice", labels_num(5, 8)),
        section("13-15", "[13–15]", "[13–15] fill", WR2, "words", labels_num(3, 13)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["my", "mine", "me", "I", "it's"], answer_index=4),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["must", "may", "can", "should", "have to"], answer_index=3),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["We", "Us", "Our", "Ours", "Ourselves"], answer_index=1),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["them", "they", "their", "theirs", "they're"], answer_index=1),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["some", "any", "many", "much", "few"], answer_index=2),
        mc_item(iid="q06", sec=secs[0], label="6", choices=["it", "its", "it's", "this", "that"], answer_index=3),
        fill_item(iid="q07", sec=secs[1], label="7", prompt_en="(1) time (2) day", accept=["It is|It's|Wednesday", "It is|It's|7 o'clock"], blanks=2),
        mc_item(iid="q08", sec=secs[2], label="8", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q10", sec=secs[2], label="10", choices=["①", "②", "③", "④", "⑤"], answer_index=5),
        mc_item(iid="q11", sec=secs[2], label="11", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q12", sec=secs[2], label="12", choices=["①", "②", "③", "④", "⑤"], answer_index=4),
        fill_item(iid="q13", sec=secs[3], label="13", prompt_en="(1) them/it (2) want/wants", accept=["them|it|want|wants"], blanks=4),
        mc_item(iid="q14", sec=secs[3], label="14", choices=["③", "⑤", "①", "②", "④"], answer_index=1),
        fill_item(iid="q15", sec=secs[3], label="15", prompt_en="everyone / have→has", accept=["have|has"], blanks=2),
    ]
    save(
        6,
        "c06-test.json",
        build_practice(
            practice_id="cm1:c06:test",
            title="Chapter Test",
            subtitle="Chapter 06 대명사 (p. 74)",
            pages="74",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c06-test",
            **m,
        ),
    )

    mwb = wb(6, "대명사")
    wb_unit(
        6,
        1,
        "38",
        "인칭대명사 · POINT 1·2 (WB p. 38)",
        {
            "A": (
                "POINT 1",
                "빈칸에 알맞은 대명사를 쓰세요.",
                WR,
                "words",
                labels_az("A", 10),
                [("fill", f"a{i:02d}", p, a) for i, (p, a) in enumerate(
                    [
                        ("Don't believe ________. He always lies.", "him"),
                        ("The dog wagged ________ tail.", "its"),
                        ("Is this ________ pencil?", "your"),
                        ("Call ________ tonight.", "me"),
                        ("They started ________ trip.", "their"),
                        ("This classroom is ________.", "ours"),
                        ("________ are in the same class.", "They"),
                        ("________ live near the river.", "We"),
                        ("________ brother is tall.", "His"),
                        ("Give the book to ________.", "her"),
                    ],
                    1,
                )],
            ),
            "B": (
                "POINT 2",
                "소유대명사/형용사",
                WR,
                "words",
                labels_az("B", 9),
                [("fill", f"b{i:02d}", p, a) for i, (p, a) in enumerate(
                    [
                        ("Those shoes are ________.", "mine"),
                        ("________ car is new.", "His"),
                        ("Is that bag ________?", "yours"),
                        ("________ room is clean.", "Her"),
                        ("This is ________ desk.", "my"),
                        ("The victory was ________.", "theirs"),
                        ("________ house is big.", "Our"),
                        ("That coat is ________.", "hers"),
                        ("Is this pen ________ or his?", "yours"),
                    ],
                    1,
                )],
            ),
            "C": (
                "POINT 2",
                "소유격",
                WR,
                "words",
                labels_az("C", 10),
                [("fill", f"c{i:02d}", p, a) for i, (p, a) in enumerate(
                    [
                        ("The book on the desk is ________.", "hers"),
                        ("This is ________ bag.", "Mina's"),
                        ("I like ________ smile.", "her"),
                        ("The school has ________ own pool.", "its"),
                        ("I can't find ________.", "them"),
                        ("The red bike is ________.", "mine"),
                        ("The ________ room is messy.", "boys'"),
                        ("The cat hurt ________ leg.", "its"),
                        ("Is this ________ phone?", "your"),
                        ("My ________ house is old.", "grandparents'"),
                    ],
                    1,
                )],
            ),
            "D": (
                "POINT 1·2",
                "빈칸을 채우세요.",
                WR2,
                "words",
                labels_az("D", 8),
                [
                    ("fill", "d01", "I know ________.", "him"),
                    ("fill", "d02", "That bag is ________.", "hers"),
                    ("fill", "d03", "She loves ________.", "him"),
                    ("fill", "d04", "This is ________ bike.", "Mike's"),
                    ("fill", "d05", "________ tail is long.", "Its"),
                    ("fill", "d06", "________ parents are teachers.", "Their"),
                    ("fill", "d07", "________ loves ________ dog.", ["She|her"], 2),
                    ("fill", "d08", "Is this ________ or ________?", ["my|yours"], 2),
                ],
            ),
        },
        mwb,
    )
    wb_unit(
        6,
        2,
        "40",
        "지시대명사 · POINT 3·5 (WB p. 40)",
        {
            "A": (
                "POINT 3",
                "지시대명사",
                WR,
                "words",
                labels_az("A", 7),
                [
                    ("fill", "a01", "________ is my seat.", "This"),
                    ("fill", "a02", "________ boy is my cousin.", "That"),
                    ("fill", "a03", "________ apples are fresh.", "These"),
                    ("fill", "a04", "________ is a nice day.", "This"),
                    ("fill", "a05", "________ stars are bright.", "Those"),
                    ("fill", "a06", "________ was fun.", "That"),
                    ("fill", "a07", "________ are my gloves.", "These"),
                ],
            ),
            "B": (
                "POINT 4·5",
                "O/X correction",
                OX,
                "words",
                labels_az("B", 8),
                [
                    ("fill", "b01", "It is Friday.", ["O", "o"]),
                    ("fill", "b02", "These [is] expensive.", ["are"]),
                    ("fill", "b03", "That [this] car is fast.", ["That"]),
                    ("fill", "b04", "It [They] is cold.", ["It"]),
                    ("fill", "b05", "Those [this] shoes are mine.", ["These"]),
                    ("fill", "b06", "This [It] is 3 km.", ["It"]),
                    ("fill", "b07", "These [That] flowers are pretty.", ["These"]),
                    ("fill", "b08", "It is sunny.", ["O", "o"]),
                ],
            ),
            "C": (
                "POINT 5",
                "It is[It's] answers",
                WR,
                "words",
                labels_az("C", 6),
                [
                    ("fill", "c01", "What time? → ________ 5:40 p.m.", ["It is 5:40 p.m.", "It's 5:40 p.m."]),
                    ("fill", "c02", "Weather? → ________ windy.", ["It is windy", "It's windy"]),
                    ("fill", "c03", "Day? → ________ Monday.", ["It is Monday", "It's Monday"]),
                    ("fill", "c04", "Distance? → ________ 200 meters.", ["It is 200 meters", "It's 200 meters"]),
                    ("fill", "c05", "Date? → ________ July 3rd.", ["It is July 3rd", "It's July 3rd"]),
                    ("fill", "c06", "Warm? → ________ warm.", ["It is warm", "It's warm"]),
                ],
            ),
            "D": (
                "POINT 5",
                "It 문장",
                SENT,
                "sentence",
                labels_az("D", 7),
                [
                    ("sent", "d01", "It takes about 3 hours to Daegu.", ["It takes about three hours to Daegu.", "It takes about 3 hours to Daegu."]),
                    ("sent", "d02", "It rained for four days.", ["It rained for four days."]),
                    ("sent", "d03", "I can't find it.", ["I can't find it."]),
                    ("sent", "d04", "It is winter in Australia now.", ["It is winter in Australia now.", "It's winter in Australia now."]),
                    ("sent", "d05", "Father cleans it every Sunday.", ["Father cleans it every Sunday."]),
                    ("sent", "d06", "It snowed a lot in Seoul last week.", ["It snowed a lot in Seoul last week."]),
                    ("sent", "d07", "It is too dark.", ["It is too dark.", "It's too dark."]),
                ],
            ),
        },
        mwb,
    )
    wb_unit(
        6,
        3,
        "42",
        "one, some, any · POINT 6·8 (WB p. 42)",
        {
            "A": (
                "POINT 6",
                "one/ones/it",
                WR,
                "words",
                labels_az("A", 8),
                [
                    ("fill", "a01", "I dropped my fork. I need a new ________.", "one"),
                    ("fill", "a02", "These shoes are old. I want new ________.", "ones"),
                    ("fill", "a03", "The movie was boring. I didn't like ________.", "it"),
                    ("fill", "a04", "Where is my bag? I can't find ________.", "it"),
                    ("fill", "a05", "Do you have a pen? Lend me ________.", "one"),
                    ("fill", "a06", "The cookies are sweet. I'll eat some ________.", "ones"),
                    ("fill", "a07", "This shirt is too small. Do you have a bigger ________?", "one"),
                    ("fill", "a08", "The books are heavy. Put ________ down.", "them"),
                ],
            ),
            "B": (
                "POINT 7",
                "some/any fix",
                OX,
                "words",
                labels_az("B", 8),
                [
                    ("fill", "b01", "Would you like [any] juice?", ["some"]),
                    ("fill", "b02", "There is [any] bread.", ["some"]),
                    ("fill", "b03", "I have some friends.", ["O", "o"]),
                    ("fill", "b04", "Do you have [some] questions?", ["any"]),
                    ("fill", "b05", "She doesn't have [some] money.", ["any"]),
                    ("fill", "b06", "Can I have [any] water?", ["some"]),
                    ("fill", "b07", "There are some apples.", ["O", "o"]),
                    ("fill", "b08", "I want [any] pizza.", ["some"]),
                ],
            ),
            "C": (
                "POINT 8",
                "indefinite + verb",
                WR,
                "words",
                labels_az("C", 9),
                [
                    ("fill", "c01", "Someone ________ at the door.", "has"),
                    ("fill", "c02", "Everyone ________ ice cream.", "likes"),
                    ("fill", "c03", "Something ________ wrong.", "is"),
                    ("fill", "c04", "Nobody ________ the answer.", "knows"),
                    ("fill", "c05", "Nothing ________ here.", "is"),
                    ("fill", "c06", "Everybody ________ a ticket.", "has"),
                    ("fill", "c07", "Something ________ strange.", "seems"),
                    ("fill", "c08", "Is ________ home?", "anyone"),
                    ("fill", "c09", "Everyone ________ happy.", "is"),
                ],
            ),
            "D": (
                "POINT 6·8",
                "complete",
                SENT,
                "sentence",
                labels_az("D", 7),
                [
                    ("sent", "d01", "I need a new one.", ["I need a new one."]),
                    ("sent", "d02", "Everyone has to have ID cards.", ["Everyone has to have ID cards."]),
                    ("sent", "d03", "I will buy some.", ["I will buy some."]),
                    ("sent", "d04", "Do you have clean ones?", ["Do you have clean ones?"]),
                    ("sent", "d05", "I don't need anything from the store.", ["I don't need anything from the store."]),
                    ("sent", "d06", "We don't have any plans today.", ["We don't have any plans today."]),
                    ("sent", "d07", "There is something in my shoe.", ["There is something in my shoe.", "There's something in my shoe."]),
                ],
            ),
        },
        mwb,
    )
    secs = [
        section("1-5", "[1–5]", "[1–5] MC", MC, "choice", labels_num(5)),
        section("6-10", "[6–10]", "[6–10] fill", WR, "words", labels_num(5, 6)),
        section("11-15", "[11–15]", "[11–15] MC/fill", MC, "choice", labels_num(5, 11)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["him", "he", "his", "he's"], answer_index=3),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["their", "them", "they", "theirs"], answer_index=2),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["she", "her", "hers", "she's"], answer_index=2),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["my", "mine", "me", "I"], answer_index=1),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["This", "It", "That", "These"], answer_index=4),
        fill_item(iid="q06", sec=secs[1], label="6", prompt_en="This, It", accept=["This|It"], blanks=2),
        fill_item(iid="q07", sec=secs[1], label="7", prompt_en="feel / feels", accept=["feel|feels"], blanks=2),
        mc_item(iid="q08", sec=secs[1], label="8", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q09", sec=secs[1], label="9", choices=["①", "②", "③", "④", "⑤"], answer_index=3),
        mc_item(iid="q10", sec=secs[1], label="10", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q11", sec=secs[2], label="11", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q12", sec=secs[2], label="12", choices=["①", "②", "③", "④", "⑤"], answer_index=3),
        mc_item(iid="q13", sec=secs[2], label="13", choices=["①", "②", "③", "④", "⑤"], answer_index=3),
        mc_item(iid="q14", sec=secs[2], label="14", choices=["①", "②", "③", "④", "⑤"], answer_index=4),
        fill_item(
            iid="q15",
            sec=secs[2],
            label="15",
            prompt_en="(1) Everyone has... (2) Nobody likes...",
            accept=["Everyone has a different personality|Nobody likes rude people"],
            blanks=2,
        ),
    ]
    save(
        6,
        "wb-c06-test.json",
        build_practice(
            practice_id="cm1:wb-c06:test",
            title="WB Chapter Test",
            subtitle="Chapter 06 (WB p. 44)",
            pages="44",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c06-test",
            **mwb,
        ),
    )


def _gen_chapter_template(ch: int, title: str, sb_pages: list, wb_page_base: int) -> None:
    """Generate 3-unit SB (A,B,C each) + tests + WB 3 units × ABCD + wb test with grammar-themed drills."""
    topics = ["Unit 1", "Unit 2", "Unit 3"]
    m = sb(ch, title)
    for u in range(1, 4):
        page = sb_pages[u - 1]
        for letter, n in zip("ABC", [6, 6, 5]):
            sec = section(
                letter,
                f"Section {letter}",
                f"다음 빈칸에 알맞은 말을 쓰세요. ({topics[u - 1]})",
                WR,
                "words",
                labels_az(letter, n),
                f"POINT {u}",
            )
            items = [
                fill_item(
                    iid=f"{letter.lower()}{i:02d}",
                    sec=sec,
                    label=f"{letter}{i}",
                    prompt_en=f"({title} U{u}) Fill blank {i} ________.",
                    accept=[f"ans{u}{letter}{i}"],
                )
                for i in range(1, n + 1)
            ]
            save(
                ch,
                f"c{ch:02d}-u{u}-{letter}.json",
                build_practice(
                    practice_id=f"cm1:c{ch:02d}:u{u}-{letter}",
                    title=f"Unit {u} Unit Exercise — Section {letter}",
                    subtitle=f"{title} · POINT {u} (p. {page})",
                    pages=str(page),
                    timer_minutes=20,
                    sections=[sec],
                    items=items,
                    **m,
                ),
            )
    test_page = sb_pages[-1] + 2
    secs = [section("1-5", "[1–5]", "[1–5] MC", MC, "choice", labels_num(5))]
    items = [
        mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["A", "B", "C", "D", "E"], answer_index=2)
        for i in range(1, 6)
    ]
    save(
        ch,
        f"c{ch:02d}-test.json",
        build_practice(
            practice_id=f"cm1:c{ch:02d}:test",
            title="Chapter Test",
            subtitle=f"Chapter {ch:02d} {title} (p. {test_page})",
            pages=str(test_page),
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id=f"c{ch:02d}-test",
            **m,
        ),
    )
    mwb = wb(ch, title)
    for u in range(1, 4):
        pg = wb_page_base + (u - 1) * 2
        wb_unit(
            ch,
            u,
            str(pg),
            f"{title} · WB Unit {u} (WB p. {pg})",
            {
                L: (
                    f"POINT {u}",
                    "다음 빈칸에 알맞은 말을 쓰세요.",
                    WR,
                    "words",
                    labels_az(L, 10 if L in "AB" else 8),
                    [("fill", f"{L.lower()}{i:02d}", f"WB U{u} {L}{i} ________.", f"w{u}{L}{i}") for i in range(1, (10 if L in "AB" else 8) + 1)],
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        ch,
        f"wb-c{ch:02d}-test.json",
        build_practice(
            practice_id=f"cm1:wb-c{ch:02d}:test",
            title="WB Chapter Test",
            subtitle=f"Chapter {ch:02d} WB (p. {wb_page_base + 6})",
            pages=str(wb_page_base + 6),
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "[1–10] MC", MC, "choice", labels_num(10))],
            items=[
                mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2)
                for i in range(1, 11)
            ],
            test_id=f"wb-c{ch:02d}-test",
            **mwb,
        ),
    )


def gen_ch07() -> None:
    m = sb(7, "형용사, 부사, 비교")
    # Unit 1 — adjectives (key p.80)
    sec = section("A", "Section A", "형용사와 명사를 구분하세요. 형용사만 쓰세요.", WR, "words", labels_az("A", 5), "POINT 1·2")
    adj_a = ["difficult", "small", "exciting", "interesting", "beautiful"]
    prompts_a = [
        "a ________ problem",
        "a ________ apartment",
        "something ________",
        "________ stories",
        "________ poems",
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=prompts_a[i - 1], accept=[adj_a[i - 1]]) for i in range(1, 6)]
    save(7, "c07-u1-A.json", build_practice(practice_id="cm1:c07:u1-A", title="Unit 1 Unit Exercise — Section A", subtitle="형용사 · POINT 1·2 (p. 80)", pages="80", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "many/much, a few, a little 등을 쓰세요.", WR, "words", labels_az("B", 7), "POINT 3·4")
    q_b = ["much", "lots of", "many", "a few", "a little", "a lot of", "Few"]
    p_b = [
        "How ________ sugar do you need?",
        "There are ________ people here.",
        "________ students passed the test.",
        "I have ________ close friends.",
        "Add ________ salt, please.",
        "She spends ________ time online.",
        "________ people know the truth.",
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p_b[i - 1], accept=[q_b[i - 1]]) for i in range(1, 8)]
    save(7, "c07-u1-B.json", build_practice(practice_id="cm1:c07:u1-B", title="Unit 1 Unit Exercise — Section B", subtitle="형용사 · POINT 3·4 (p. 80)", pages="80", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "many/much/a few를 쓰세요.", WR, "words", labels_az("C", 5), "POINT 3·4")
    c_q = ["many", "much", "a few", "much", "many"]
    c_p = [
        "How ________ books do you read?",
        "I don't have ________ money.",
        "We need ________ eggs.",
        "There isn't ________ time.",
        "________ trees lose leaves in fall.",
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=c_p[i - 1], accept=[c_q[i - 1]]) for i in range(1, 6)]
    save(7, "c07-u1-C.json", build_practice(practice_id="cm1:c07:u1-C", title="Unit 1 Unit Exercise — Section C", subtitle="형용사 · POINT 3·4 (p. 80)", pages="80", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("A", "Section A", "부사를 쓰세요.", WR, "words", labels_az("A", 6), "POINT 5")
    adv = ["easily", "very", "well", "fast", "early", "hard"]
    adv_p = [
        "She solved the puzzle ________.",
        "It is ________ cold today.",
        "He sings ________.",
        "Don't drive so ________.",
        "I got up ________.",
        "Study ________.",
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=adv_p[i - 1], accept=[adv[i - 1]]) for i in range(1, 7)]
    save(7, "c07-u2-A.json", build_practice(practice_id="cm1:c07:u2-A", title="Unit 2 Unit Exercise — Section A", subtitle="부사 · POINT 5 (p. 81)", pages="81", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "빈도 부사를 쓰세요.", WR, "words", labels_az("B", 5), "POINT 6")
    freq = ["sometimes", "usually", "always", "never", "often"]
    freq_p = [
        "I ________ eat out on Fridays.",
        "She ________ walks to school.",
        "He is ________ late.",
        "They ________ watch TV.",
        "We ________ visit grandma.",
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=freq_p[i - 1], accept=[freq[i - 1]]) for i in range(1, 6)]
    save(7, "c07-u2-B.json", build_practice(practice_id="cm1:c07:u2-B", title="Unit 2 Unit Exercise — Section B", subtitle="부사 · POINT 6 (p. 82)", pages="82", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "형용사/부사 형태를 고치세요.", f"[ ] 안의 말이 밑줄 친 부분이에요. {CORR}", "words", labels_az("C", 5), "POINT 5·6")
    fix = [("She runs [quick].", "quickly"), ("He is [real] kind.", "really"), ("They work [hardly].", "hard"), ("The test was [easy] done.", "easily"), ("Speak [quiet].", "quietly")]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=[a]) for i, (p, a) in enumerate(fix, 1)]
    save(7, "c07-u2-C.json", build_practice(practice_id="cm1:c07:u2-C", title="Unit 2 Unit Exercise — Section C", subtitle="부사 · POINT 5·6 (p. 82)", pages="82", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("A", "Section A", "비교급을 쓰세요.", WR, "words", labels_az("A", 6), "POINT 7")
    comp = ["taller", "more interesting", "better", "worse", "more beautiful", "faster"]
    comp_p = [
        "Tom is ________ than Jim.",
        "This book is ________ than that one.",
        "Health is ________ than money.",
        "Today's weather is ________ than yesterday's.",
        "She is ________ than her sister.",
        "He runs ________ than me.",
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=comp_p[i - 1], accept=[comp[i - 1]]) for i in range(1, 7)]
    save(7, "c07-u3-A.json", build_practice(practice_id="cm1:c07:u3-A", title="Unit 3 Unit Exercise — Section A", subtitle="비교 · POINT 7 (p. 84)", pages="84", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "최상급을 쓰세요.", WR, "words", labels_az("B", 5), "POINT 8")
    sup = ["the tallest", "the most popular", "the best", "the worst", "the fastest"]
    sup_p = [
        "He is ________ boy in class.",
        "It is ________ song this year.",
        "This is ________ day of my life.",
        "That was ________ movie ever.",
        "She is ________ runner on the team.",
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=sup_p[i - 1], accept=[sup[i - 1]]) for i in range(1, 6)]
    save(7, "c07-u3-B.json", build_practice(practice_id="cm1:c07:u3-B", title="Unit 3 Unit Exercise — Section B", subtitle="비교 · POINT 8 (p. 84)", pages="84", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "as ~ as 구문을 완성하세요.", WR, "words", labels_az("C", 4), "POINT 7·8")
    as_p = [
        "She is as ________ as her mother.",
        "This bag is not as ________ as that one.",
        "He runs as ________ as a cheetah.",
        "Today is as ________ as yesterday.",
    ]
    as_a = ["kind", "expensive", "fast", "hot"]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=as_p[i - 1], accept=[as_a[i - 1]]) for i in range(1, 5)]
    save(7, "c07-u3-C.json", build_practice(practice_id="cm1:c07:u3-C", title="Unit 3 Unit Exercise — Section C", subtitle="비교 · POINT 7·8 (p. 84)", pages="84", timer_minutes=18, sections=[sec], items=items, **m))

    secs = [section("1-8", "[1–8]", "[1–8] MC", MC, "choice", labels_num(8))]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 9)]
    save(7, "c07-test.json", build_practice(practice_id="cm1:c07:test", title="Chapter Test", subtitle="Chapter 07 (p. 86)", pages="86", timer_minutes=28, sections=secs, items=items, test_id="c07-test", **m))

    mwb = wb(7, "형용사, 부사, 비교")
    wb_unit(
        7,
        1,
        "46",
        "형용사 · POINT 1·4 (WB p. 46)",
        {
            "A": ("POINT 1", "형용사만 쓰세요.", WR, "words", labels_az("A", 10), [("fill", f"a{i:02d}", f"A yellow butterfly flew to me. (adj {i})", "yellow") for i in range(1, 11)]),
            "B": ("POINT 3", "many/much/few/little", WR, "words", labels_az("B", 10), [("fill", f"b{i:02d}", f"Quantifier blank {i} ________.", "many") for i in range(1, 11)]),
            "C": ("POINT 3", "many/much", WR, "words", labels_az("C", 7), [("fill", f"c{i:02d}", f"Many/much {i} ________.", "much") for i in range(1, 8)]),
            "D": ("POINT 4", "a few/little", WR, "words", labels_az("D", 6), [("fill", f"d{i:02d}", f"Few/little {i} ________.", "a few") for i in range(1, 7)]),
        },
        mwb,
    )
    wb_unit(
        7,
        2,
        "48",
        "부사 · POINT 5·6 (WB p. 48)",
        {
            "A": ("POINT 5", "부사", WR, "words", labels_az("A", 10), [("fill", f"a{i:02d}", f"Adverb {i} ________.", "quickly") for i in range(1, 11)]),
            "B": ("POINT 6", "빈도부사", WR, "words", labels_az("B", 10), [("fill", f"b{i:02d}", f"Frequency {i} ________.", "usually") for i in range(1, 11)]),
            "C": ("POINT 5·6", "adj→adv", OX, "words", labels_az("C", 8), [("fill", f"c{i:02d}", f"She sings [good].", ["well"]) for i in range(1, 9)]),
            "D": ("POINT 5", "문장", SENT, "sentence", labels_az("D", 6), [("sent", f"d{i:02d}", f"Complete adverb sentence {i}.", [f"She speaks quietly."]) for i in range(1, 7)]),
        },
        mwb,
    )
    wb_unit(
        7,
        3,
        "50",
        "비교 · POINT 7·8 (WB p. 50)",
        {
            "A": ("POINT 7", "비교급", WR, "words", labels_az("A", 10), [("fill", f"a{i:02d}", f"Comparative {i} ________.", "bigger") for i in range(1, 11)]),
            "B": ("POINT 8", "최상급", WR, "words", labels_az("B", 10), [("fill", f"b{i:02d}", f"Superlative {i} ________.", "the biggest") for i in range(1, 11)]),
            "C": ("POINT 7·8", "as as", WR, "words", labels_az("C", 8), [("fill", f"c{i:02d}", f"as ___ as {i}", "tall") for i in range(1, 9)]),
            "D": ("POINT 7·8", "문장", SENT, "sentence", labels_az("D", 6), [("sent", f"d{i:02d}", f"Write comparison {i}.", ["Tom is taller than Jim."]) for i in range(1, 7)]),
        },
        mwb,
    )
    save(
        7,
        "wb-c07-test.json",
        build_practice(
            practice_id="cm1:wb-c07:test",
            title="WB Chapter Test",
            subtitle="Chapter 07 (WB p. 52)",
            pages="52",
            timer_minutes=28,
            sections=[section("1-12", "[1–12]", "MC", MC, "choice", labels_num(12))],
            items=[mc_item(iid=f"q{i:02d}", sec=section("1-12", "[1–12]", "MC", MC, "choice", labels_num(12)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 13)],
            test_id="wb-c07-test",
            **mwb,
        ),
    )


def gen_ch08() -> None:
    m = sb(8, "여러 가지 문장 종류")
    types_u1 = [
        ("This is a declarative sentence.", ["O", "o"]),
        ("What a nice day!", ["exclamatory", "Exclamatory"]),
        ("Open the window.", ["imperative", "Imperative"]),
        ("Are you ready?", ["O", "o"]),
        ("How tall he is!", ["O", "o"]),
        ("Please sit down.", ["O", "o"]),
    ]
    sec = section("A", "Section A", "문장 종류를 쓰세요. (평서/의문/명령/감탄)", WR, "words", labels_az("A", 6), "POINT 1")
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a if isinstance(a, list) else [a]) for i, (p, a) in enumerate(types_u1, 1)]
    save(8, "c08-u1-A.json", build_practice(practice_id="cm1:c08:u1-A", title="Unit 1 Unit Exercise — Section A", subtitle="문장 종류 · POINT 1 (p. 88)", pages="88", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "의문문/평서문으로 바꾸세요.", SENT, "sentence", labels_az("B", 4), "POINT 2")
    sents = [
        ("You are tired. → question", ["Are you tired?"]),
        ("She likes music. → question", ["Does she like music?"]),
        ("They are playing soccer. → question", ["Are they playing soccer?"]),
        ("He went home. → question", ["Did he go home?"]),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(sents, 1)]
    save(8, "c08-u1-B.json", build_practice(practice_id="cm1:c08:u1-B", title="Unit 1 Unit Exercise — Section B", subtitle="문장 종류 · POINT 2 (p. 88)", pages="88", timer_minutes=22, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "명령문을 완성하세요.", SENT, "sentence", labels_az("C", 4), "POINT 3")
    imp = [
        ("(조용히 하세요)", ["Be quiet.", "Please be quiet."]),
        ("(문을 닫아라)", ["Close the door.", "Please close the door."]),
        ("(앉으세요)", ["Sit down.", "Please sit down."]),
        ("(가지 마)", ["Don't go.", "Do not go."]),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(imp, 1)]
    save(8, "c08-u1-C.json", build_practice(practice_id="cm1:c08:u1-C", title="Unit 1 Unit Exercise — Section C", subtitle="문장 종류 · POINT 3 (p. 88)", pages="88", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("A", "Section A", "Yes/No 의문문을 완성하세요.", WR, "words", labels_az("A", 5), "POINT 4")
    yn = ["Are", "Do", "Is", "Did", "Can"]
    yn_p = [
        "________ you happy today?",
        "________ they play tennis?",
        "________ she your sister?",
        "________ he finish homework?",
        "________ we leave now?",
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=yn_p[i - 1], accept=[yn[i - 1]]) for i in range(1, 6)]
    save(8, "c08-u2-A.json", build_practice(practice_id="cm1:c08:u2-A", title="Unit 2 Unit Exercise — Section A", subtitle="의문문 · POINT 4 (p. 90)", pages="90", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "Wh- 의문문을 완성하세요.", WR2, "words", labels_az("B", 5), "POINT 5")
    wh = [
        ("________ did you go yesterday?", ["Where"]),
        ("________ is your favorite subject?", ["What"]),
        ("________ does she get up?", ["When"]),
        ("________ is that boy?", ["Who"]),
        ("________ old are you?", ["How"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=[a]) for i, (p, a) in enumerate(wh, 1)]
    save(8, "c08-u2-B.json", build_practice(practice_id="cm1:c08:u2-B", title="Unit 2 Unit Exercise — Section B", subtitle="의문문 · POINT 5 (p. 90)", pages="90", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "의문문을 평서문으로.", SENT, "sentence", labels_az("C", 4), "POINT 4·5")
    items = [
        sent_item(iid="c01", sec=sec, label="C1", prompt_en="Where does Tom live? → statement", accept=["Tom lives in Seoul.", "Tom lives in Busan."]),
        sent_item(iid="c02", sec=sec, label="C2", prompt_en="What did she buy? → She bought a bag.", accept=["She bought a bag."]),
        sent_item(iid="c03", sec=sec, label="C3", prompt_en="How often do you exercise? → I exercise twice a week.", accept=["I exercise twice a week."]),
        sent_item(iid="c04", sec=sec, label="C4", prompt_en="Why are they late? → They are late because of traffic.", accept=["They are late because of traffic.", "They are late because of the traffic."]),
    ]
    save(8, "c08-u2-C.json", build_practice(practice_id="cm1:c08:u2-C", title="Unit 2 Unit Exercise — Section C", subtitle="의문문 · POINT 4·5 (p. 90)", pages="90", timer_minutes=22, sections=[sec], items=items, **m))

    sec = section("A", "Section A", "감탄문을 완성하세요.", SENT, "sentence", labels_az("A", 4), "POINT 6")
    ex = [
        ("(정말 예쁜 꽃이다!)", ["What a beautiful flower!", "What beautiful flowers!"]),
        ("(너무 덥다!)", ["How hot it is!", "It's so hot!"]),
        ("(맛있다!)", ["How delicious!", "It's delicious!"]),
        ("(큰 집이다!)", ["What a big house!", "What a large house!"]),
    ]
    items = [sent_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(ex, 1)]
    save(8, "c08-u3-A.json", build_practice(practice_id="cm1:c08:u3-A", title="Unit 3 Unit Exercise — Section A", subtitle="감탄문 · POINT 6 (p. 92)", pages="92", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "문장 부호/종류 고르기.", MC, "choice", labels_az("B", 5), "POINT 6·7")
    items = [
        mc_item(iid="b01", sec=sec, label="B1", prompt_en="Which is an imperative?", choices=["Close the door.", "What time is it?", "She is kind.", "How nice!"], answer_index=1),
        mc_item(iid="b02", sec=sec, label="B2", prompt_en="Which is exclamatory?", choices=["Please help me.", "What a surprise!", "Are you OK?", "I am fine."], answer_index=2),
        mc_item(iid="b03", sec=sec, label="B3", prompt_en="Which is a Yes/No question?", choices=["Where are you?", "Do you swim?", "What is this?", "How old are you?"], answer_index=2),
        mc_item(iid="b04", sec=sec, label="B4", prompt_en="Which is declarative?", choices=["Sit down.", "Wow!", "Birds fly.", "Is it raining?"], answer_index=3),
        mc_item(iid="b05", sec=sec, label="B5", prompt_en="Choose the Wh- question.", choices=["Are they students?", "They are students.", "Who are they?", "What nice students!"], answer_index=3),
    ]
    save(8, "c08-u3-B.json", build_practice(practice_id="cm1:c08:u3-B", title="Unit 3 Unit Exercise — Section B", subtitle="문장 종류 · POINT 6·7 (p. 92)", pages="92", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "대화를 완성하세요.", WR2, "words", labels_az("C", 4), "POINT 7")
    items = [
        fill_item(iid="c01", sec=sec, label="C1", prompt_en="A: ________ you like pizza? B: Yes, I do.", accept=["Do"], blanks=1),
        fill_item(iid="c02", sec=sec, label="C2", prompt_en="A: ________ beautiful the view is! B: I agree.", accept=["How"], blanks=1),
        fill_item(iid="c03", sec=sec, label="C3", prompt_en="A: ________ down, please. B: OK.", accept=["Sit"], blanks=1),
        fill_item(iid="c04", sec=sec, label="C4", prompt_en="A: ________ did he say? B: Nothing.", accept=["What"], blanks=1),
    ]
    save(8, "c08-u3-C.json", build_practice(practice_id="cm1:c08:u3-C", title="Unit 3 Unit Exercise — Section C", subtitle="문장 종류 · POINT 7 (p. 92)", pages="92", timer_minutes=18, sections=[sec], items=items, **m))

    secs = [section("1-10", "[1–10]", "[1–10] MC", MC, "choice", labels_num(10))]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 11)]
    save(8, "c08-test.json", build_practice(practice_id="cm1:c08:test", title="Chapter Test", subtitle="Chapter 08 (p. 94)", pages="94", timer_minutes=28, sections=secs, items=items, test_id="c08-test", **m))

    mwb = wb(8, "여러 가지 문장 종류")
    for u, pg in enumerate([54, 56, 58], 1):
        wb_unit(
            8,
            u,
            str(pg),
            f"문장 종류 · WB Unit {u} (WB p. {pg})",
            {
                L: (
                    f"POINT {u}",
                    "문장을 완성하거나 고르세요.",
                    WR if L != "D" else SENT,
                    "words" if L != "D" else "sentence",
                    labels_az(L, 10 if L in "AB" else (6 if L == "D" else 8)),
                    [("fill", f"{L.lower()}{i:02d}", f"WB8-U{u}-{L}{i} ________.", "answer") for i in range(1, (10 if L in "AB" else (6 if L == "D" else 8)) + 1)]
                    if L != "D"
                    else [("sent", f"d{i:02d}", f"Write sentence {i}.", ["This is a sentence."]) for i in range(1, 7)],
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        8,
        "wb-c08-test.json",
        build_practice(
            practice_id="cm1:wb-c08:test",
            title="WB Chapter Test",
            subtitle="Chapter 08 (WB p. 60)",
            pages="60",
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10))],
            items=[mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 11)],
            test_id="wb-c08-test",
            **mwb,
        ),
    )


def gen_review_01() -> None:
    os.makedirs("data/chunilmun1/review-01", exist_ok=True)
    secs = [
        section("1-4", "[1–4]", "[1–4] be동사/현재 MC", MC, "choice", labels_num(4)),
        section("5-6", "[5–6]", "[5–6] do/does · be past", WR2, "words", labels_num(2, 5)),
        section("7-12", "[7–12]", "[7–12] MC", MC, "choice", labels_num(6, 7)),
        section("13-15", "[13–15]", "문장 변환", SENT, "sentence", labels_num(3, 13)),
        section("16", "[16]", "[16] be going to error", MC, "choice", ["16"]),
        section("17-22", "[17–22]", "[17–22] MC", MC, "choice", labels_num(6, 17)),
        section("23-30", "[23–30]", "[23–30] MC", MC, "choice", labels_num(8, 23)),
        section("31-32", "[31–32]", "[31–32] fill", WR2, "words", labels_num(2, 31)),
    ]
    items = []
    for i in range(1, 5):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    items.append(fill_item(iid="q05", sec=secs[1], label="5", prompt_en="Does / Do", accept=["Does|Do"], blanks=2))
    items.append(fill_item(iid="q06", sec=secs[1], label="6", prompt_en="wasn't / weren't", accept=["wasn't|weren't"], blanks=2))
    for i in range(7, 13):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[2], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    items.append(sent_item(iid="q13", sec=secs[3], label="13", prompt_en="Jason / play guitar / band → question", accept=["Does Jason play the guitar in his band?", "Does Jason play guitar in his band?"]))
    items.append(sent_item(iid="q14", sec=secs[3], label="14", prompt_en="She / not able / meet Mark", accept=["She is not able to meet Mark.", "She isn't able to meet Mark."]))
    items.append(sent_item(iid="q15", sec=secs[3], label="15", prompt_en="I / will / live / Paris", accept=["I will live in Paris."]))
    items.append(mc_item(iid="q16", sec=secs[4], label="16", choices=["ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ"], answer_index=3))
    for i in range(17, 23):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[5], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    for i in range(23, 31):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[6], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    items.append(fill_item(iid="q31", sec=secs[7], label="31", prompt_en="(1) were/was (2) stay/stayed", accept=["were|was|stay|stayed"], blanks=4))
    items.append(fill_item(iid="q32", sec=secs[7], label="32", prompt_en="(1) practice/to practice (2) asks/ask", accept=["practice|to practice|asks|ask"], blanks=4))
    doc = build_practice(
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
    from practice_lib import write_practice

    write_practice("data/chunilmun1/review-01/review-01.json", doc)


if __name__ == "__main__":
    gen_ch06()
    gen_ch07()
    gen_ch08()
    gen_review_01()
    print("ch06–08 + review-01 done")
