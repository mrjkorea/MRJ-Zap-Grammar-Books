#!/usr/bin/env python3
"""Scan-extracted SB practice data for Ch05–Ch06 — 천일문 Grammar 1 (PDF pp. 46–71)."""
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
    mc_item,
    sb,
    section,
    sent_item,
    write_practice,
)


def _bracket(
    sec: dict,
    label: str,
    iid: str,
    prompt: str,
    choices: list[str],
    ans: int,
) -> dict:
    return mc_item(iid=iid, sec=sec, label=label, prompt_en=prompt, choices=choices, answer_index=ans)


def _ox(sec: dict, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _write_docs(data: dict[str, dict], chapter: int) -> None:
    for name, doc in data.items():
        write_practice(f"data/chunilmun1/chapter{chapter:02d}/{name}", doc)


def build_ch05_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(5, "명사와 관사")

    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 7),
        "POINT 1·2",
    )
    mc_a = [
        ("Two [babys / babies] are lying on the bed.", ["babys", "babies"], 2),
        ("Many [childs / children] are in the playground.", ["childs", "children"], 2),
        ("We can see many red [leafs / leaves] in fall.", ["leafs", "leaves"], 2),
        ("The [busies / buses] arrive every 10 minutes.", ["busies", "buses"], 2),
        ("I took many [photos / photoes] in the park.", ["photos", "photoes"], 1),
        ("My father caught three [fish / fishes] in the river.", ["fish", "fishes"], 1),
        ("Two [dishs / dishes] and two cups are on the table.", ["dishs", "dishes"], 2),
    ]
    items = [
        _bracket(sec, f"A{i}", f"a{i:02d}", p, c, a)
        for i, (p, c, a) in enumerate(mc_a, 1)
    ]
    out["c05-u1-A.json"] = build_practice(
        practice_id="cm1:c05:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="명사와 관사 · POINT 1·2 (p. 57)",
        pages="57",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "그림과 일치하도록 주어진 단어를 사용하여 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 3",
    )
    b_pairs = [
        ("We had ________ ________ pizza for lunch. (slice)", ["two|slices of"]),
        ("Laura drinks ________ ________ milk every day. (glass)", ["two|glasses of"]),
        ("Minsu ate ________ ________ rice for breakfast. (bowl)", ["a|bowl of"]),
        ("My sister drank ________ ________ coffee today. (cup)", ["two|cups of"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=2)
        for i, (p, a) in enumerate(b_pairs, 1)
    ]
    out["c05-u1-B.json"] = build_practice(
        practice_id="cm1:c05:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="명사와 관사 · POINT 3 (p. 57)",
        pages="57",
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
        labels_az("C", 4),
        "POINT 1·2·3",
    )
    c_sents = [
        (
            "그들은 디저트로 케이크 두 조각을 먹었다.\n(piece)\n→ They ate ________ ________ cake for dessert.",
            ["They ate two pieces of cake for dessert."],
        ),
        (
            "우리는 지금 신선한 공기가 좀 필요하다.\n(air)\n→ We need some fresh ________ now.",
            ["We need some fresh air now."],
        ),
        (
            "다섯 명의 여성들이 줄을 서서 기다리고 있다.\n(woman)\n→ ________ ________ are waiting in line.",
            ["Five women are waiting in line.", "5 women are waiting in line."],
        ),
        (
            "나는 수프를 위한 세 개의 감자와 두 개의 양파를 사야 한다.\n(potato)\n→ I should buy ________ ________ and two onions for soup.",
            ["I should buy three potatoes and two onions for soup."],
        ),
    ]
    items = [
        sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(c_sents, 1)
    ]
    out["c05-u1-C.json"] = build_practice(
        practice_id="cm1:c05:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="명사와 관사 · POINT 1·2·3 (p. 57)",
        pages="57",
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
        labels_az("A", 7),
        "POINT 4",
    )
    u2a = [
        ("Carl drank [water / a water] in the morning.", ["water", "a water"], 1),
        ("She bought [a / an] shirt and shoes.", ["a", "an"], 1),
        ("I have [a / an] older sister.", ["a", "an"], 2),
        ("The restaurant is on [a / the] third floor.", ["a", "the"], 2),
        ("You should wait for [a / an] hour.", ["a", "an"], 2),
        ("We found [a / an] wallet on the street.", ["a", "an"], 1),
        ("My teacher gave me [advice / an advice].", ["advice", "an advice"], 1),
    ]
    items = [_bracket(sec, f"A{i}", f"a{i:02d}", p, c, a) for i, (p, c, a) in enumerate(u2a, 1)]
    out["c05-u2-A.json"] = build_practice(
        practice_id="cm1:c05:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="관사 · POINT 4 (p. 59)",
        pages="59",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    b_art = ["The", "an", "The", "a", "the", "a", "the", "the"]
    b_prompts = [
        "I found a box. ________ box was empty.",
        "I have ________ old dog and two kittens.",
        "________ Moon shines in the night sky.",
        "I take a yoga class twice ________ week.",
        "When is ________ last bus coming?",
        "Do you have ________ pet?",
        "Could you pass me ________ ketchup?",
        "Minji plays ________ piano in the church.",
    ]
    u2c = [
        ("Robert is [a / an / the] famous painter.", ["a", "an", "the"], 1),
        ("I had a soup and a salad. [A / An / The] soup was too hot.", ["A", "An", "The"], 3),
        ("It's [a / an / the] only bookstore in our town.", ["a", "an", "the"], 3),
        ("We saw [a / an / ×] elephant in the zoo.", ["a", "an", "×"], 2),
        ("Let's have sandwiches for [a / the / ×] lunch.", ["a", "the", "×"], 3),
        ("We went to the library by [a / the / ×] subway.", ["a", "the", "×"], 3),
        ("My brother played [a / the / ×] guitar beautifully.", ["a", "the", "×"], 2),
        ("She went to [a / the / ×] bed early last night.", ["a", "the", "×"], 3),
    ]
    tia = [
        ("There [is / are] an umbrella in the locker.", ["is", "are"], 1),
        ("There [is / are] some textbooks in my backpack.", ["is", "are"], 2),
        ("[Was / Were] there tall trees in the park last year?", ["Was", "Were"], 2),
        ("There is [a student / students] in the school bus.", ["a student", "students"], 1),
        ("There are special [rule / rules] in my school.", ["rule", "rules"], 2),
        ("There [wasn't / weren't] furniture in the new house.", ["wasn't", "weren't"], 1),
        ("There [was / were] Tom and Sam in the yard.", ["was", "were"], 2),
    ]

    sec_art_c = section(
        "C",
        "Section C",
        "다음 중 어법상 알맞은 관사를 고르세요. (필요하지 않으면 ×를 고르세요.)",
        MC,
        "choice",
        labels_az("C", 8),
        "POINT 4·5",
    )
    art_c_items = [_bracket(sec_art_c, f"C{i}", f"c{i:02d}", p, c, a) for i, (p, c, a) in enumerate(u2c, 1)]

    sec_b_only = section(
        "B",
        "Section B",
        "빈칸에 알맞은 관사를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("B", 8),
        "POINT 4·5",
        word_bank=["a", "an", "the"],
    )
    b_items = [
        fill_item(iid=f"b{i:02d}", sec=sec_b_only, label=f"B{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(zip(b_prompts, b_art), 1)
    ]
    out["c05-u2-B.json"] = build_practice(
        practice_id="cm1:c05:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="관사 · POINT 4·5 (p. 59)",
        pages="59",
        timer_minutes=22,
        sections=[sec_b_only, sec_art_c],
        items=b_items + art_c_items,
        **m,
    )

    sec_ta = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 7),
        "POINT 6",
    )
    sec_tb = section(
        "B",
        "Section B",
        "빈칸에 알맞은 말을 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("B", 4),
        "POINT 6",
        word_bank=["There is", "There are", "There was", "There were"],
    )
    sec_tc = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("C", 5),
        "POINT 6",
    )
    ti_a = [_bracket(sec_ta, f"A{i}", f"a{i:02d}", p, c, a) for i, (p, c, a) in enumerate(tia, 1)]
    tb_prompts = [
        "________ three rooms in my house.",
        "________ a football stadium in the city before.",
        "________ many children in the park yesterday.",
        "________ a swimming pool in this hotel.",
    ]
    tb_ans = ["There are", "There was", "There were", "There is"]
    ti_b = [
        fill_item(iid=f"b{i:02d}", sec=sec_tb, label=f"B{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(zip(tb_prompts, tb_ans), 1)
    ]
    tc_sents = [
        (
            "내 바지 주머니에 약간의 돈이 있다.\n(there, some money)\n→ ________ ________ ________ in my pants pocket.",
            ["There is some money in my pants pocket.", "There's some money in my pants pocket."],
        ),
        (
            "어제 생일 파티가 있었다.\n(a birthday party, there)\n→ ________ ________ ________ ________ yesterday.",
            ["There was a birthday party yesterday."],
        ),
        (
            "그 건물에는 세 개의 회사가 있다.\n(there, companies)\n→ ________ ________ ________ ________ in the building.",
            ["There are three companies in the building."],
        ),
        (
            "여기서 부산까지 가는 기차가 있나요?\n(any trains, there)\n→ ________ ________ ________ ________ to Busan from here?",
            ["Are there any trains to Busan from here?"],
        ),
        (
            "그 케이크 위에는 초가 없었다.\n(there, candles)\n→ ________ ________ ________ ________ on the cake.",
            ["There weren't candles on the cake.", "There were not candles on the cake."],
        ),
    ]
    ti_c = [
        sent_item(iid=f"c{i:02d}", sec=sec_tc, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(tc_sents, 1)
    ]
    out["c05-u2-C.json"] = build_practice(
        practice_id="cm1:c05:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="There is/are · POINT 6 (p. 61)",
        pages="61",
        timer_minutes=24,
        sections=[sec_ta, sec_tb, sec_tc],
        items=ti_a + ti_b + ti_c,
        **m,
    )

    secs = [
        section(
            "1",
            "[1]",
            "[1] 다음 중 명사의 단수형과 복수형이 바르게 연결된 것을 고르세요.",
            MC,
            "choice",
            ["1"],
        ),
        section(
            "2-3",
            "[2–3]",
            "[2–3] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 2),
        ),
        section(
            "4-5",
            "[4–5]",
            "[4–5] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 4),
        ),
        section(
            "6-7",
            "[6–7]",
            "[6–7] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 6),
        ),
        section(
            "8",
            "[8]",
            "[8] 주어진 단어를 올바르게 배열하여 다음 대화를 완성하세요. (필요시 단어의 형태를 바꿀 것)",
            WR2,
            "words",
            ["8-1", "8-2"],
        ),
        section(
            "9-12",
            "[9–12]",
            "[9–12] 다음 중 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(4, 9),
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 그림을 보고 주어진 단어를 사용하여 문장을 완성하세요.",
            SENT,
            "sentence",
            ["13-1", "13-2", "13-3"],
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 중 어법상 알맞지 않은 문장 두 개를 고르세요.",
            MC,
            "choice",
            ["14"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 두 개를 찾아 그 기호를 쓰고 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["15-1", "15-2"],
        ),
    ]
    titems = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            choices=[
                "knife — knifs",
                "foot — foots",
                "class — classes",
                "potato — potatos",
                "dictionary — dictionaryes",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=secs[1],
            label="2",
            prompt_en="There are ________ on the hill.",
            choices=["sheep", "trees", "children", "fox", "deer"],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="Linda needs a piece of ________.",
            choices=["cake", "paper", "water", "pizza", "cheese"],
            answer_index=3,
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            choices=[
                "My brother has many friends.",
                "Mrs. Brown has five childs.",
                "I know many interesting stories.",
                "Look at the benches over there.",
                "Tony brushes his teeth every morning.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            choices=[
                "I ate three pieces of chocolate cake.",
                "John will have a bowl of salad.",
                "Can I have two slices of mango juice?",
                "Helen bought two bottles of milk at the grocery.",
                "Mom always drinks a cup of coffee after a meal.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="I had a dog. (A) dog was very smart.\nWill you buy (B) new watch? It's too old.",
            choices=["A — an", "A — the", "The — the", "The — an", "The — a"],
            answer_index=5,
        ),
        mc_item(
            iid="q07",
            sec=secs[3],
            label="7",
            prompt_en="There (A) many deer in the forest.\n(B) there any juice in the fridge?",
            choices=["was — Is", "was — Are", "were — Are", "were — Is", "were — Were"],
            answer_index=4,
        ),
        fill_item(
            iid="q08a",
            sec=secs[4],
            label="8-1",
            prompt_en="A: Can I help you?\nB: Yes. Could you bring me (1) ________ ? (pizza / three / slice / of)",
            accept=["three slices of pizza"],
        ),
        fill_item(
            iid="q08b",
            sec=secs[4],
            label="8-2",
            prompt_en="A: Sure. Anything else?\nB: (2) ________, please. (orange juice / two / glass / of)",
            accept=["Two glasses of orange juice", "two glasses of orange juice"],
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            choices=[
                "There was some flowers in the vase.",
                "There are not any clouds in the sky.",
                "There is a movie theater over there.",
                "There was an accident on the road.",
                "There are many cars in the city.",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q10",
            sec=secs[5],
            label="10",
            prompt_en="다음 중 빈칸에 들어갈 단어가 나머지와 다른 하나를 고르세요.",
            choices=[
                "There ________ 24 hours in a day.",
                "There ________ an old tree in my town.",
                "There ________ lots of milk in the bottle.",
                "________ there a bus stop on the corner?",
                "There ________ some jewelry in my mom's drawer.",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q11",
            sec=secs[5],
            label="11",
            prompt_en="그 축제에는 많은 사람들이 있니?",
            choices=[
                "Is there many person at the festival?",
                "Is there many people at the festival?",
                "Is there many persons at the festival?",
                "Are there many person at the festival?",
                "Are there many people at the festival?",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q12",
            sec=secs[5],
            label="12",
            choices=[
                "She eats a bread for lunch.",
                "I walked on the fallen leafs.",
                "There is oranges in the basket.",
                "There are many buses on the street.",
                "The man caught many fishes in the sea.",
            ],
            answer_index=4,
        ),
        sent_item(
            iid="q13a",
            sec=secs[6],
            label="13-1",
            prompt_en="(1) There ________________ in the restaurant. (table)",
            accept=["There are three tables in the restaurant."],
        ),
        sent_item(
            iid="q13b",
            sec=secs[6],
            label="13-2",
            prompt_en="(2) There ________________ on the table. (plate)",
            accept=["There are two plates on the table."],
        ),
        sent_item(
            iid="q13c",
            sec=secs[6],
            label="13-3",
            prompt_en="(3) There ________________ between the plates. (vase)",
            accept=["There is a vase between the plates."],
        ),
        choose_all_item(
            iid="q14",
            sec=secs[7],
            label="14",
            prompt_en="① The boxes are very heavy.\n② The black cat caught two mouses.\n③ There is four people in my family.\n④ I need three tomatoes for spaghetti.\n⑤ There are some kids in the playground.",
            accept_pairs=[("2", "3"), ("3", "2")],
        ),
        fill_item(
            iid="q15a",
            sec=secs[8],
            label="15-1",
            prompt_en="There ⓐ is many interesting ⓑ animals in the zoo. … sixteen ⓔ hour a day.\n(1) ________ → ________",
            accept=["a|are", "ⓐ|are"],
            blanks=2,
        ),
        fill_item(
            iid="q15b",
            sec=secs[8],
            label="15-2",
            prompt_en="(2) ________ → ________",
            accept=["e|hours", "ⓔ|hours"],
            blanks=2,
        ),
    ]
    out["c05-test.json"] = build_practice(
        practice_id="cm1:c05:test",
        title="Chapter Test",
        subtitle="Chapter 05 명사와 관사 (p. 62–63)",
        pages="62–63",
        timer_minutes=28,
        sections=secs,
        items=titems,
        test_id="c05-test",
        **m,
    )

    return out


def build_ch06_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(6, "대명사")

    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 7),
        "POINT 1·2·3",
    )
    u1a = [
        ("We invited [his / him] to dinner.", ["his", "him"], 2),
        ("You should be nice to [you / your / yours] friends.", ["you", "your", "yours"], 2),
        ("Dad bought a bicycle for [my / me / mine].", ["my", "me", "mine"], 2),
        ("Your laptop doesn't work. You can use [our / us / ours].", ["our", "us", "ours"], 3),
        ("You'll draw [you / yourselves] on the paper.", ["you", "yourselves"], 2),
        ("The restaurant is famous for [it's / its] desserts.", ["it's", "its"], 2),
        ("I don't like carrots, but Alice loves [it / them].", ["it", "them"], 2),
    ]
    items = [_bracket(sec, f"A{i}", f"a{i:02d}", p, c, a) for i, (p, c, a) in enumerate(u1a, 1)]
    out["c06-u1-A.json"] = build_practice(
        practice_id="cm1:c06:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="인칭대명사와 재귀대명사 · POINT 1·2·3 (p. 69)",
        pages="69",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "주어진 단어를 빈칸에 어법상 알맞은 형태로 쓰세요.",
        WR,
        "words",
        labels_az("B", 7),
        "POINT 1·2",
    )
    b_pairs = [
        ("The scarf is ________. (she)", ["hers"]),
        ("This is my seat. Where is ________? (you)", ["yours"]),
        ("You can use ________ headphones. (I)", ["my"]),
        ("He knows my name, but I don't know ________. (he)", ["him"]),
        ("________ father is a science teacher. (she)", ["Her"]),
        ("My shirt is blue. But ________ shirt is white. (he)", ["his"]),
        ("The cup on the right is ________. (I)", ["mine"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(b_pairs, 1)
    ]
    out["c06-u1-B.json"] = build_practice(
        practice_id="cm1:c06:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="인칭대명사와 재귀대명사 · POINT 1·2 (p. 69)",
        pages="69",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR2,
        "words",
        labels_az("C", 5),
        "POINT 1·2·3",
    )
    c_pairs = [
        ("그들은 그에게 빵 한 덩이를 주었다.\n→ ________ gave a loaf of bread to ________.", ["They|him"], 2),
        ("그것은 Tom의 기타다.\n→ ________ is ________ guitar.", ["It|his", "That|his"], 2),
        (
            "그녀는 새 가방을 샀다. 나는 그것의 색깔이 마음에 든다.\n→ ________ bought a new bag. ________ like ________ color.",
            ["She|I|its"],
            3,
        ),
        (
            "그는 노트북을 가지고 있다. 나는 그의 것을 빌릴 것이다.\n→ ________ has a laptop. ________'ll borrow ________.",
            ["He|I|his"],
            3,
        ),
        (
            "그 여성은 TV 뉴스에 나온 자기 자신을 발견했다.\n→ The woman found ________ on the TV news.",
            ["herself"],
            1,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(c_pairs, 1)
    ]
    out["c06-u1-C.json"] = build_practice(
        practice_id="cm1:c06:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="인칭대명사와 재귀대명사 · POINT 1·2·3 (p. 69)",
        pages="69",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("A", 5),
        "POINT 4·5",
    )
    u2a = [
        ("저것은 그녀의 사진이니?\n→ Is ________ her photo?", ["that"]),
        ("이 사람은 내 친구 Ted야.\n→ ________ is my friend, Ted.", ["This"]),
        ("이 그림들은 매우 비싸다.\n→ ________ paintings are very expensive.", ["These"]),
        ("저 건물은 우리 학교이다.\n→ ________ building is my school.", ["That"]),
        ("저것들이 인기 있는 요리들인가요?\n→ Are ________ popular dishes?", ["those"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(u2a, 1)
    ]
    out["c06-u2-A.json"] = build_practice(
        practice_id="cm1:c06:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="지시대명사와 it · POINT 4·5 (p. 72)",
        pages="72",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("B", 7),
        "POINT 4·5·6",
    )
    ox_b = [
        ("<u>These</u> is my father's suitcase.", False, "These are"),
        ("Can I borrow <u>these</u> books?", True, ""),
        ("<u>This</u> is raining outside.", False, "It is raining"),
        ("Do you know <u>those</u> person next to Jinsu?", False, "that person"),
        ("<u>That</u> are not our bikes over there.", False, "Those are"),
        ("<u>It</u> is September 20th.", True, ""),
        ("Are <u>this</u> your boxes here?", False, "these"),
    ]
    items = [_ox(sec, f"B{i}", f"b{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(ox_b, 1)]
    out["c06-u2-B.json"] = build_practice(
        practice_id="cm1:c06:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="지시대명사와 it · POINT 4·5·6 (p. 72)",
        pages="72",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어를 사용하여 질문에 대한 답을 쓰세요.",
        SENT,
        "sentence",
        labels_az("C", 4),
        "POINT 6",
    )
    u2c = [
        ("A: What day is it today?\nB: ________. (Monday)", ["It's Monday.", "It is Monday."]),
        ("A: What time is it now?\nB: ________. (11 o'clock)", ["It's 11 o'clock.", "It is 11 o'clock."]),
        (
            "A: What is the weather like tonight?\nB: ________. (snowy)",
            ["It's snowy.", "It is snowy.", "It's snowy tonight.", "It is snowy tonight."],
        ),
        (
            "A: How far is it to the airport from here?\nB: ________. (8 kilometers)",
            ["It's 8 kilometers.", "It is 8 kilometers.", "It's eight kilometers.", "It is eight kilometers."],
        ),
    ]
    items = [
        sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(u2c, 1)
    ]
    out["c06-u2-C.json"] = build_practice(
        practice_id="cm1:c06:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="지시대명사와 it · POINT 6 (p. 72)",
        pages="72",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 단어를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 7",
        word_bank=["one", "ones", "it"],
    )
    u3a = ["one", "ones", "It", "ones", "one", "it"]
    u3a_p = [
        "The T-shirt is too small. Do you have a big ________?",
        "Where are the cookies? I want the chocolate ________.",
        "I found my necklace. ________ was in the living room.",
        "They have old chairs. Now they need new ________.",
        "A: Do you have a brother? B: Yes, I have ________.",
        "My mother bought a new fan this summer. I use ________ every day.",
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(zip(u3a_p, u3a), 1)
    ]
    out["c06-u3-A.json"] = build_practice(
        practice_id="cm1:c06:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="one, some, any · POINT 7 (p. 75)",
        pages="75",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 대화의 빈칸에 some과 any 중 알맞은 것을 골라 쓰세요.",
        WR,
        "words",
        labels_az("B", 4),
        "POINT 8",
    )
    u3b = ["some", "any", "any", "some"]
    u3b_p = [
        "A: You can choose sandwiches or pasta for lunch.\nB: I'll have ________ sandwiches for lunch.",
        "A: Are there ________ problems with you?\nB: Yes. I caught a bad cold.",
        "A: Did your brother help you?\nB: No. He didn't give me ________ help at all.",
        "A: Would you like ________ coffee?\nB: No, thanks. I don't drink coffee.",
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=[a])
        for i, (p, a) in enumerate(zip(u3b_p, u3b), 1)
    ]
    out["c06-u3-B.json"] = build_practice(
        practice_id="cm1:c06:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="one, some, any · POINT 8 (p. 75)",
        pages="75",
        timer_minutes=16,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어를 사용하여 어법에 맞게 쓰세요. (단, 현재형으로 쓸 것)",
        WR,
        "words",
        labels_az("C", 6),
        "POINT 9",
    )
    u3c = [
        ("Somebody ________ singing on the stage. (be)", ["is"]),
        ("In my class, everybody ________ the movie. (like)", ["likes"]),
        ("________ everyone having a good time? (be)", ["Is"]),
        ("________ anybody know the way to the toilet? (do)", ["Does"]),
        ("Nothing ________ me. I'm brave. (scare)", ["scares"]),
        ("Something ________ a strange noise in the basement. (make)", ["makes"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(u3c, 1)
    ]
    out["c06-u3-C.json"] = build_practice(
        practice_id="cm1:c06:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="one, some, any · POINT 9 (p. 75)",
        pages="75",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    secs = [
        section(
            "1",
            "[1]",
            "[1] 다음 중 밑줄 친 부분의 성격이 다른 하나를 고르세요.",
            MC,
            "choice",
            ["1"],
        ),
        section(
            "2",
            "[2]",
            "[2] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            ["2"],
        ),
        section(
            "3",
            "[3]",
            "[3] 다음 중 (A), (B), (C)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["3"],
        ),
        section(
            "4",
            "[4]",
            "[4] 다음 중 대화의 빈칸에 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            ["4"],
        ),
        section(
            "5",
            "[5]",
            "[5] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            ["5"],
        ),
        section(
            "6",
            "[6]",
            "[6] 다음 중 밑줄 친 It[it]의 쓰임이 다른 하나를 고르세요.",
            MC,
            "choice",
            ["6"],
        ),
        section(
            "7",
            "[7]",
            "[7] 다음 그림을 보고 질문에 알맞은 대답을 완성하세요.",
            SENT,
            "sentence",
            ["7-1", "7-2"],
        ),
        section(
            "8-12",
            "[8–12]",
            "[8–12] 다음 중 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(5, 8),
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 중 어법상 알맞은 문장을 고르세요.",
            MC,
            "choice",
            ["14"],
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            CORR,
            "words",
            ["13"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 글에서 어법상 알맞지 않은 부분 두 군데를 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["15-1", "15-2"],
        ),
    ]
    titems = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            choices=[
                "It's my book.",
                "Its color is brown.",
                "His name is Minsu.",
                "My shoes are white.",
                "Are you Jane's teacher?",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q02",
            sec=secs[1],
            label="2",
            choices=[
                "The robot can fix itself.",
                "We are very proud of ourselves.",
                "You should take care of yourself.",
                "Mina is writing a letter to herself.",
                "They hid himself under the table.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q03",
            sec=secs[2],
            label="3",
            prompt_en=(
                "Peter and I are best friends. I visit (A) on Sundays. "
                "(B) play computer games. And I have dinner with (C) family."
            ),
            choices=["he — We — he", "his — We — his", "he — Us — him", "him — We — his", "him — Our — him"],
            answer_index=4,
        ),
        mc_item(
            iid="q04",
            sec=secs[3],
            label="4",
            prompt_en="A: What do you post on your blog?\nB: I post photos of ________ from my trip.",
            choices=["me", "my", "myself", "yourselves", "themselves"],
            answer_index=3,
        ),
        mc_item(
            iid="q05",
            sec=secs[4],
            label="5",
            choices=[
                "The cat is mine.",
                "This is my uncle.",
                "She loves herself.",
                "It's hers umbrella.",
                "These are not his pets.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q06",
            sec=secs[5],
            label="6",
            choices=[
                "It's 5 o'clock.",
                "It's his eraser.",
                "Is it Tuesday today?",
                "It will be cloudy tomorrow.",
                "It takes 30 minutes by subway.",
            ],
            answer_index=2,
        ),
        sent_item(
            iid="q07a",
            sec=secs[6],
            label="7-1",
            prompt_en="A: What time is it now?\nB: ________. (clock shows 7:00)",
            accept=["It's seven o'clock.", "It is seven o'clock.", "It's 7 o'clock.", "It is 7 o'clock."],
        ),
        sent_item(
            iid="q07b",
            sec=secs[6],
            label="7-2",
            prompt_en="A: What day is it today?\nB: ________. (Wednesday is circled on the calendar)",
            accept=["It's Wednesday.", "It is Wednesday."],
        ),
        mc_item(
            iid="q08",
            sec=secs[7],
            label="8",
            prompt_en="<보기> It is snowing outside.",
            choices=[
                "It is very fun.",
                "It is July 11th.",
                "It is my pencil case.",
                "It is her sketchbook.",
                "It is not a nice building.",
            ],
            answer_index=2,
        ),
        choose_all_item(
            iid="q09",
            sec=secs[7],
            label="9",
            prompt_en=(
                "Welcome to my school. … This is the school cafeteria. "
                "ⓐ It is lunch time now. …\n"
                "① Do you like it?\n② It is dark outside.\n③ It is my dog, Kevin.\n"
                "④ It is different from mine.\n⑤ It is 8 o'clock in the morning."
            ),
            accept_pairs=[("2", "5"), ("5", "2")],
        ),
        mc_item(
            iid="q10",
            sec=secs[7],
            label="10",
            prompt_en="I saw ________, but he didn't see ________.",
            choices=["he — I", "him — my", "him — me", "his — my", "he — me"],
            answer_index=3,
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en=(
                "I need (A) flour and eggs for baking.\n"
                "She doesn't have (B) pens in her bag. She left them at home."
            ),
            choices=["any — any", "some — any", "any — some", "some — some", "many — any"],
            answer_index=2,
        ),
        mc_item(
            iid="q12",
            sec=secs[7],
            label="12",
            prompt_en=(
                "There is a computer. It's ① mine. But I can't use ② it. "
                "My brother plays computer games every day and my sister does ③ her homework with it. "
                "Everyone ④ use it. So I need a new ⑤ one!"
            ),
            choices=["①", "②", "③", "④", "⑤"],
            answer_index=4,
        ),
        mc_item(
            iid="q14",
            sec=secs[8],
            label="14",
            choices=[
                "Can I have some juice?",
                "I found any coins in my pocket.",
                "There are someone outside the door.",
                "I need an eraser. Do you have ones?",
                "There aren't some supermarkets near here.",
            ],
            answer_index=1,
        ),
        fill_item(
            iid="q13",
            sec=secs[9],
            label="13",
            prompt_en="Almost everyone have their favorite food.",
            accept=["have|has", "everyone have|everyone has"],
            blanks=2,
        ),
        fill_item(
            iid="q15a",
            sec=secs[10],
            label="15-1",
            prompt_en=(
                "Grace has many beautiful plants in her garden. She waters the flowers every day "
                "and takes care of it. Sometimes she picks these flower and puts them in a vase.\n"
                "(1) ________ → ________"
            ),
            accept=["it|them", "takes care of it|takes care of them"],
            blanks=2,
        ),
        fill_item(
            iid="q15b",
            sec=secs[10],
            label="15-2",
            prompt_en="(2) ________ → ________",
            accept=["flower|flowers", "these flower|these flowers"],
            blanks=2,
        ),
    ]
    out["c06-test.json"] = build_practice(
        practice_id="cm1:c06:test",
        title="Chapter Test",
        subtitle="Chapter 06 대명사 (p. 76–77)",
        pages="76–77",
        timer_minutes=28,
        sections=secs,
        items=titems,
        test_id="c06-test",
        **m,
    )

    return out


if __name__ == "__main__":
    import sys

    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch05"):
        d5 = build_ch05_sb()
        _write_docs(d5, 5)
        print(f"chapter 05 sb: wrote {len(d5)} files")
    if fn in ("all", "ch06"):
        d6 = build_ch06_sb()
        _write_docs(d6, 6)
        print(f"chapter 06 sb: wrote {len(d6)} files")
