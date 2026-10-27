#!/usr/bin/env python3
"""Generate ch05–08 SB + WB practices and review-01 for 천일문 Grammar 1."""
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
)
from gen_all import CORR, MC, OX, SENT, WR, WR2, save, sb, wb  # noqa: E402
from gen_rest import wb_unit  # noqa: E402


def gen_ch05_sb() -> None:
    m = sb(5, "명사와 관사")
    sec = section(
        "A",
        "Section A",
        "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("A", 7),
        "POINT 1·2",
    )
    pairs = [
        ("There are three ________ in the basket.", ["babies"]),
        ("Can I have some ________?", ["water"]),
        ("The tree has many green ________.", ["leaves"]),
        ("There are two cardboard ________ on the floor.", ["boxes"]),
        ("I ate an apple. ________ apple was very sweet.", ["The"]),
        ("We caught three ________ in the river.", ["fish"]),
        ("Please wash the ________ after dinner.", ["dishes"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(pairs, 1)
    ]
    save(
        5,
        "c05-u1-A.json",
        build_practice(
            practice_id="cm1:c05:u1-A",
            title="Unit 1 Unit Exercise — Section A",
            subtitle="명사와 관사 · POINT 1·2 (p. 57)",
            pages="57",
            timer_minutes=20,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "B",
        "Section B",
        "다음 빈칸에 들어갈 단위명사를 포함하여 쓰세요.",
        WR,
        "words",
        labels_az("B", 4),
        "POINT 3",
    )
    b_pairs = [
        ("I need ________ paper for my project.", ["two pieces of"]),
        ("She drank ________ water.", ["two glasses of"]),
        ("He ate ________ cereal for breakfast.", ["a bowl of"]),
        ("We had ________ tea.", ["two cups of"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(b_pairs, 1)
    ]
    save(
        5,
        "c05-u1-B.json",
        build_practice(
            practice_id="cm1:c05:u1-B",
            title="Unit 1 Unit Exercise — Section B",
            subtitle="명사와 관사 · POINT 3 (p. 57)",
            pages="57",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "C",
        "Section C",
        "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("C", 4),
        "POINT 1·3",
    )
    c_pairs = [
        ("I ate ________ pizza for lunch.", ["two slices of"]),
        ("There is no ________ in this room.", ["air"]),
        ("________ teachers work at our school.", ["Five women", "5 women"]),
        ("She bought ________ at the market.", ["three potatoes"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a if isinstance(a, list) else [a])
        for i, (p, a) in enumerate(c_pairs, 1)
    ]
    save(
        5,
        "c05-u1-C.json",
        build_practice(
            practice_id="cm1:c05:u1-C",
            title="Unit 1 Unit Exercise — Section C",
            subtitle="명사와 관사 · POINT 1·3 (p. 57)",
            pages="57",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section(
        "A",
        "Section A",
        "There is/are와 be동사를 쓰세요.",
        WR,
        "words",
        labels_az("A", 7),
        "POINT 5",
    )
    a2 = ["is", "are", "Were", "butter", "rules", "wasn't", "were"]
    p2 = [
        "There ________ a bus next to the market.",
        "There ________ many people in the park.",
        "________ there two children in the park yesterday?",
        "There is some ________ on my plate.",
        "There are many school ________ in the book.",
        "There ________ any milk in the fridge yesterday.",
        "There ________ many stars in the sky last night.",
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p2[i - 1], accept=[a2[i - 1]])
        for i in range(1, 8)
    ]
    save(
        5,
        "c05-u2-A.json",
        build_practice(
            practice_id="cm1:c05:u2-A",
            title="Unit 2 Unit Exercise — Section A",
            subtitle="There is/are · POINT 5 (p. 59)",
            pages="59",
            timer_minutes=20,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section("B", "Section B", "There is/are로 시작하는 문장을 완성하세요.", WR, "words", labels_az("B", 4), "POINT 5")
    b2 = ["There are", "There was", "There were", "There is"]
    p2b = [
        "________ many books on the shelf.",
        "________ a good movie on TV last night.",
        "________ many flowers in the garden last spring.",
        "________ some juice in the bottle.",
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p2b[i - 1], accept=[b2[i - 1]])
        for i in range(1, 5)
    ]
    save(
        5,
        "c05-u2-B.json",
        build_practice(
            practice_id="cm1:c05:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle="There is/are · POINT 5 (p. 59)",
            pages="59",
            timer_minutes=18,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    sec = section("C", "Section C", "문장을 완성하세요.", SENT, "sentence", labels_az("C", 5), "POINT 5")
    sents = [
        ("There is some money in my wallet.", ["There is some money in my wallet.", "There's some money in my wallet."]),
        ("There was a soccer match yesterday.", ["There was a soccer match yesterday."]),
        ("There aren't sugar and eggs in the kitchen.", ["There aren't sugar and eggs in the kitchen.", "There are not sugar and eggs in the kitchen."]),
        ("Are there any trains at night?", ["Are there any trains at night?"]),
        ("There weren't candles on the table.", ["There weren't candles on the table.", "There were not candles on the table."]),
    ]
    items = [
        sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(sents, 1)
    ]
    save(
        5,
        "c05-u2-C.json",
        build_practice(
            practice_id="cm1:c05:u2-C",
            title="Unit 2 Unit Exercise — Section C",
            subtitle="There is/are · POINT 5 (p. 59)",
            pages="59",
            timer_minutes=22,
            sections=[sec],
            items=items,
            **m,
        ),
    )

    secs = [
        section("1-6", "[1–6]", "[1–6] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(6)),
        section("7", "[7]", "[7] 단위명사", WR2, "words", ["7"]),
        section("8-10", "[8–10]", "[8–10] MC", MC, "choice", labels_num(3, 8)),
        section("11", "[11]", "[11] There is/are", WR2, "words", ["11"]),
        section("12-15", "[12–15]", "[12–15] MC / fill", MC, "choice", labels_num(4, 12)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["There is", "There are", "Is there", "Are there", "There was"], answer_index=4),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["a glass of", "a piece of", "a bottle of", "a bowl of", "a cup of"], answer_index=3),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["child", "children", "childs", "childrens", "childes"], answer_index=2),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["three glass of", "three glasses of", "three glass", "three glasses", "three of glass"], answer_index=2),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["a", "an", "the", "some", "any"], answer_index=3),
        mc_item(iid="q06", sec=secs[0], label="6", choices=["There is", "There are", "Is there", "Are there", "There were"], answer_index=2),
        fill_item(
            iid="q07",
            sec=secs[1],
            label="7",
            prompt_en="(1) three slices of pizza (2) two glasses of orange juice",
            accept=["three slices of pizza|two glasses of orange juice"],
            blanks=2,
        ),
        mc_item(iid="q08", sec=secs[2], label="8", choices=["was", "were", "is", "are", "be"], answer_index=2),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["is", "are", "was", "were", "be"], answer_index=3),
        mc_item(iid="q10", sec=secs[2], label="10", choices=["Are there", "Is there", "There are", "There is", "Were there"], answer_index=5),
        fill_item(
            iid="q11",
            sec=secs[3],
            label="11",
            prompt_en="(1) three tables (2) two plates (3) a vase",
            accept=["are three tables|are two plates|is a vase"],
            blanks=3,
        ),
        mc_item(iid="q12", sec=secs[4], label="12", choices=["leaf", "leaves", "leafs", "leaved", "leaveses"], answer_index=2),
        fill_item(iid="q13", sec=secs[4], label="13", prompt_en="(1) a bear (2) two birds", accept=["is a bear|are two birds", "is a[one] bear|are two birds"], blanks=2),
        mc_item(iid="q14", sec=secs[4], label="14", choices=["①", "②", "③", "④", "⑤"], answer_index=3),
        fill_item(iid="q15", sec=secs[4], label="15", prompt_en="Zoo: many animals / koala / sixteen hours", accept=["are|hours", "are|hour"], blanks=2),
    ]
    save(
        5,
        "c05-test.json",
        build_practice(
            practice_id="cm1:c05:test",
            title="Chapter Test",
            subtitle="Chapter 05 명사와 관사 (p. 60)",
            pages="60",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c05-test",
            **m,
        ),
    )


def gen_ch05_wb() -> None:
    m = wb(5, "명사와 관사")
    wb_unit(
        5,
        1,
        "32",
        "명사/관사 · POINT 1·3 (WB p. 32)",
        {
            "A": (
                "POINT 1·2",
                "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
                WR,
                "words",
                labels_az("A", 10),
                [
                    ("fill", "a01", "You can find some ________ on the table.", "sugar"),
                    ("fill", "a02", "Jinsu saw a girl. She wore a red skirt. → Use a/an/the: ________", "a"),
                    ("fill", "a03", "The tree has many ________.", "leaves"),
                    ("fill", "a04", "The woman is cooking ________.", "rice"),
                    ("fill", "a05", "James and I broke some ________.", "cups"),
                    ("fill", "a06", "The ________ are eating lunch.", "men"),
                    ("fill", "a07", "Mr. Park doesn't waste ________ at the mall.", "money"),
                    ("fill", "a08", "Father told us interesting ________.", "stories"),
                    ("fill", "a09", "The ________ in that movie are cute.", "mice"),
                    ("fill", "a10", "Helen bought a banana. ________ banana was sweet.", "The"),
                ],
            ),
            "B": (
                "POINT 2",
                "틀리면 고친 말만, 맞으면 O.",
                OX,
                "words",
                labels_az("B", 8),
                [
                    ("fill", "b01", "Time is gold.", ["O", "o"]),
                    ("fill", "b02", "They have two [child].", ["children"]),
                    ("fill", "b03", "The teacher gave many [candy].", ["candies"]),
                    ("fill", "b04", "There are many [bus] on the road.", ["buses"]),
                    ("fill", "b05", "Steve has two bad [tooth].", ["teeth"]),
                    ("fill", "b06", "Thanks for your advice.", ["O", "o"]),
                    ("fill", "b07", "Mom bought a kilo of [tomato].", ["tomatoes"]),
                    ("fill", "b08", "Firefighters save many [life].", ["lives"]),
                ],
            ),
            "C": (
                "POINT 3",
                "단위명사를 쓰세요.",
                WR,
                "words",
                labels_az("C", 4),
                [
                    ("fill", "c01", "We drink ________ tea every morning.", "a cup of"),
                    ("fill", "c02", "Tom gave me ________ cake.", "two pieces of"),
                    ("fill", "c03", "She bought ________ juice.", "three bottles of"),
                    ("fill", "c04", "I ate ________ cereal.", "a bowl of"),
                ],
            ),
            "D": (
                "POINT 3·4",
                "빈칸을 채우세요.",
                WR,
                "words",
                labels_az("D", 6),
                [
                    ("fill", "d01", "I want ________ for lunch.", "five slices of pizza"),
                    ("fill", "d02", "There is no ________ in the bottle.", "milk"),
                    ("fill", "d03", "________ students are in the hall.", "Five"),
                    ("fill", "d04", "She planted ________ in the garden.", "potatoes"),
                    ("fill", "d05", "He needs ________.", "a bike"),
                    ("fill", "d06", "We saw many ________ on the farm.", "sheep"),
                ],
            ),
        },
        m,
    )
    wb_unit(
        5,
        2,
        "34",
        "There is/are · POINT 5 (WB p. 34)",
        {
            "A": (
                "POINT 5",
                "There is/are / be동사",
                WR,
                "words",
                labels_az("A", 9),
                [
                    ("fill", "a01", "There ________ a bus beside the market.", "is"),
                    ("fill", "a02", "Carl and Emily ________ at the café.", "are"),
                    ("fill", "a03", "________ two children in the park yesterday?", "Were"),
                    ("fill", "a04", "There is some ________ on my plate.", "bread"),
                    ("fill", "a05", "There were no ________ in the classroom.", "students"),
                    ("fill", "a06", "There ________ an honest person between us.", "was"),
                    ("fill", "a07", "________ any deer at the zoo?", "Are"),
                    ("fill", "a08", "There ________ friendship between them.", "wasn't"),
                    ("fill", "a09", "________ butter and milk in the fridge?", "Are"),
                ],
            ),
            "B": (
                "POINT 5",
                "There is/are로 시작하세요.",
                WR,
                "words",
                labels_az("B", 10),
                [
                    ("fill", "b01", "________ three cookies on the plate.", "There are"),
                    ("fill", "b02", "________ a notebook on the desk.", "There is"),
                    ("fill", "b03", "________ money in the wallet.", "There is"),
                    ("fill", "b04", "________ a computer and a TV in my room.", "There are"),
                    ("fill", "b05", "________ a full moon tonight.", "There is"),
                    ("fill", "b06", "________ some milk in the cup.", "There is"),
                    ("fill", "b07", "________ many mistakes on my test.", "There are"),
                    ("fill", "b08", "________ two children in the picture.", "There are"),
                    ("fill", "b09", "________ a lot of rain today.", "There is"),
                    ("fill", "b10", "________ three fish in the tank.", "There are"),
                ],
            ),
            "C": (
                "POINT 5",
                "과거/현재 There is/are",
                WR,
                "words",
                labels_az("C", 8),
                [
                    ("fill", "c01", "________ a smile on his face yesterday.", "There was"),
                    ("fill", "c02", "________ a family photo on my desk.", "There is"),
                    ("fill", "c03", "________ some fish in the pond last year.", "There were"),
                    ("fill", "c04", "________ many passengers on the train.", "There are"),
                    ("fill", "c05", "________ people on the beach last summer.", "There weren't"),
                    ("fill", "c06", "________ bread in the store yesterday.", "There wasn't"),
                    ("fill", "c07", "________ a bowl of soup in the kitchen.", "There is"),
                    ("fill", "c08", "________ many children on the bus every day.", "There are"),
                ],
            ),
            "D": (
                "POINT 5",
                "문장을 완성하세요.",
                SENT,
                "sentence",
                labels_az("D", 7),
                [
                    ("sent", "d01", "good news → There is good news.", ["There is good news.", "There's good news."]),
                    ("sent", "d02", "ice on the lake yesterday", ["There was ice on the lake yesterday."]),
                    ("sent", "d03", "paper and a pen? (question)", ["Are there paper and a pen?", "Are there a paper and a pen?"]),
                    ("sent", "d04", "many trees in the forest", ["There were many trees in the forest."]),
                    ("sent", "d05", "not many cars last night", ["There weren't lots of cars last night.", "There were not lots of cars last night."]),
                    ("sent", "d06", "Is my textbook here?", ["Is there my textbook?", "Is there my textbook here?"]),
                    ("sent", "d07", "no jacket on the chair", ["There wasn't a jacket on the chair.", "There was not a jacket on the chair."]),
                ],
            ),
        },
        m,
    )
    secs = [
        section("1-5", "[1–5]", "[1–5] MC", MC, "choice", labels_num(5)),
        section("6-8", "[6–8]", "[6–8] fill", WR, "words", labels_num(3, 6)),
        section("9-14", "[9–14]", "[9–14] MC", MC, "choice", labels_num(6, 9)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["tomato", "tomatoes", "tomatos", "tomatoe"], answer_index=2),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["There is", "There are", "Is there", "Are there"], answer_index=4),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["garbage is", "garbage are", "garbages are", "garbages is"], answer_index=1),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["three glass of", "three glasses of", "three glass", "three glasses"], answer_index=2),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["lady", "ladies", "ladys", "ladyes"], answer_index=2),
        fill_item(iid="q06", sec=secs[1], label="6", prompt_en="There are two glasses of apple juice.", accept=["There are two glasses of apple juice"]),
        fill_item(iid="q07", sec=secs[1], label="7", prompt_en="There wasn't meat.", accept=["There was not meat", "There wasn't meat"]),
        fill_item(iid="q08", sec=secs[1], label="8", prompt_en="Are there many children?", accept=["Are there many children?"]),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["①", "②", "③", "④"], answer_index=4),
        mc_item(iid="q10", sec=secs[2], label="10", choices=["There is", "There are", "Is there", "Are there"], answer_index=2),
        mc_item(iid="q11", sec=secs[2], label="11", choices=["①", "②", "③", "④"], answer_index=3),
        mc_item(iid="q12", sec=secs[2], label="12", choices=["①", "②", "③", "④"], answer_index=4),
        mc_item(iid="q13", sec=secs[2], label="13", choices=["①", "②", "③", "④"], answer_index=3),
        mc_item(iid="q14", sec=secs[2], label="14", choices=["①", "②", "③", "④"], answer_index=2),
    ]
    save(
        5,
        "wb-c05-test.json",
        build_practice(
            practice_id="cm1:wb-c05:test",
            title="WB Chapter Test",
            subtitle="Chapter 05 (WB p. 36)",
            pages="36",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c05-test",
            **m,
        ),
    )


if __name__ == "__main__":
    gen_ch05_sb()
    gen_ch05_wb()
    from gen_ch06_08_review import gen_ch06, gen_ch07, gen_ch08, gen_review_01

    gen_ch06()
    gen_ch07()
    gen_ch08()
    gen_review_01()
    print("ch05–08 + review-01 done")
