#!/usr/bin/env python3
"""Remaining ch02 WB + ch03 + ch04 practices."""
from __future__ import annotations

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from practice_lib import *  # noqa
from gen_all import WR, WR2, SENT, MC, CORR, OX, save, sb, wb  # noqa


def wb_unit(ch, u, pages, subtitle, sections_data, m):
    for letter, (point, instr, rule, mode, labels, items_def) in sections_data.items():
        sec = section(letter, f"Section {letter}", instr, rule, mode, labels, point)
        items = []
        for i, row in enumerate(items_def, 1):
            if row[0] == "mc":
                _, iid, prompt, choices, ans = row
                items.append(mc_item(iid=iid, sec=sec, label=labels[i - 1], prompt_en=prompt, choices=choices, answer_index=ans))
            elif row[0] == "sent":
                _, iid, prompt, acc = row
                items.append(sent_item(iid=iid, sec=sec, label=labels[i - 1], prompt_en=prompt, accept=acc))
            else:
                _, iid, prompt, acc, *rest = row
                blanks = rest[0] if rest else 1
                items.append(fill_item(iid=iid, sec=sec, label=labels[i - 1], prompt_en=prompt, accept=acc if isinstance(acc, list) else [acc], blanks=blanks))
        slug = f"wb-c{ch:02d}-u{u}-{letter}"
        save(
            ch,
            f"{slug}.json",
            build_practice(
                practice_id=f"cm1:wb-c{ch:02d}:u{u}-{letter}",
                title=f"Workbook Unit {u} — Section {letter}",
                subtitle=subtitle,
                pages=pages,
                timer_minutes=22,
                sections=[sec],
                items=items,
                **m,
            ),
        )


def gen_ch02_wb_rest():
    m = wb(2, "일반동사")
    # U1 A-D already in gen_all partial? only SB was there — generate U1 here
    wb_unit(
        2,
        1,
        "8",
        "일반동사의 현재형 · POINT 1·2 (WB p. 8)",
        {
            "A": (
                "POINT 1·2",
                "다음 빈칸에 들어갈 일반동사를 어법상 알맞은 형태로 쓰세요.",
                WR,
                "words",
                labels_az("A", 10),
                [
                    ("fill", "a01", "We ________ for a walk after lunch.", "go"),
                    ("fill", "a02", "The museum ________ at 9 a.m.", "opens"),
                    ("fill", "a03", "She ________ children very much.", "loves"),
                    ("fill", "a04", "I ________ homework after school.", "do"),
                    ("fill", "a05", "My sister ________ computer games every day.", "plays"),
                    ("fill", "a06", "Jack and Cindy ________ to school.", "walk"),
                    ("fill", "a07", "Dad ________ a shower every morning.", "takes"),
                    ("fill", "a08", "The desk ________ four legs.", "has"),
                    ("fill", "a09", "Janet and I ________ chocolate milk.", "like"),
                    ("fill", "a10", "Sam ________ the piano for the contest.", "practices"),
                ],
            ),
            "B": (
                "POINT 2·3",
                "다음 빈칸에 들어갈 일반동사를 어법상 알맞은 형태로 쓰세요.",
                WR,
                "words",
                labels_az("B", 10),
                [
                    ("fill", "b01", "The baby ________ all day.", "cries"),
                    ("fill", "b02", "My sisters and I ________ breakfast every morning.", "eat"),
                    ("fill", "b03", "Emily ________ her hair every day.", "washes"),
                    ("fill", "b04", "Our grandfather ________ two dogs.", "has"),
                    ("fill", "b05", "We ________ swimming in summer.", "enjoy"),
                    ("fill", "b06", "Jack ________ the dishes every night.", "does"),
                    ("fill", "b07", "Alice ________ news on the Internet.", "watches"),
                    ("fill", "b08", "My parents ________ up very early.", "get"),
                    ("fill", "b09", "Mike ________ English with his friends.", "studies"),
                    ("fill", "b10", "The boys ________ soccer after lunch.", "play"),
                ],
            ),
            "C": (
                "POINT 2·4",
                "다음 빈칸에 들어갈 일반동사를 어법상 알맞은 형태로 쓰세요.",
                WR,
                "words",
                labels_az("C", 10),
                [
                    ("fill", "c01", "Jeremy ________ basketball on Tuesdays.", "plays"),
                    ("fill", "c02", "They ________ a problem.", "have"),
                    ("fill", "c03", "Sumi always ________ her best.", "tries"),
                    ("fill", "c04", "Mina and I ________ swimming together.", "go"),
                    ("fill", "c05", "Jamie and his family ________ in London.", "live"),
                    ("fill", "c06", "My brother ________ his hands.", "washes"),
                    ("fill", "c07", "Sora ________ her room every day.", "cleans"),
                    ("fill", "c08", "Fred ________ many funny stories.", "knows"),
                    ("fill", "c09", "Laura ________ a seat belt in the car.", "wears"),
                    ("fill", "c10", "I ________ my bike every weekend.", "ride"),
                ],
            ),
            "D": (
                "POINT 2·3",
                "다음 문장이 맞으면 O, 틀리면 어법에 맞게 고친 말만 쓰세요.",
                OX,
                "words",
                labels_az("D", 10),
                [
                    ("fill", "d01", "An old man lives in our town.", ["O", "o"]),
                    ("fill", "d02", "Jessica [brush] her teeth twice a day.", ["brushes"]),
                    ("fill", "d03", "My friend sits with me on the bus.", ["O", "o"]),
                    ("fill", "d04", "She [buy] some bread for lunch.", ["buys"]),
                    ("fill", "d05", "My dad [teach] math at school.", ["teaches"]),
                    ("fill", "d06", "Mark [have] a brother and a sister.", ["has"]),
                    ("fill", "d07", "A bird flies in the sky.", ["O", "o"]),
                    ("fill", "d08", "My brother does homework in the living room.", ["O", "o"]),
                    ("fill", "d09", "My alarm clock rings at 7.", ["O", "o"]),
                    ("fill", "d10", "Mom [cook] food for us.", ["cooks"]),
                ],
            ),
        },
        m,
    )
    # U2
    wb_unit(
        2,
        2,
        "10",
        "일반동사의 과거형 · POINT 3 (WB p. 10)",
        {
            "A": (
                "POINT 3",
                "다음 빈칸에 들어갈 일반동사의 과거형을 쓰세요.",
                WR,
                "words",
                labels_az("A", 10),
                [
                    ("fill", "a01", "Our family ________ to Busan two years ago.", "moved"),
                    ("fill", "a02", "Jina ________ a bad stomachache last night.", "had"),
                    ("fill", "a03", "The player ________ the ball in the game.", "missed"),
                    ("fill", "a04", "I ________ to school by car this morning.", "went"),
                    ("fill", "a05", "She ________ Korean food.", "enjoyed"),
                    ("fill", "a06", "I ________ my grandmother last month.", "visited"),
                    ("fill", "a07", "My friend and I ________ dessert after dinner.", "ate"),
                    ("fill", "a08", "I ________ the box to my room.", "carried"),
                    ("fill", "a09", "The students ________ books in the library.", "read"),
                    ("fill", "a10", "Mom ________ some vegetables.", "bought"),
                ],
            ),
            "B": (
                "POINT 3",
                "다음 빈칸에 들어갈 일반동사의 과거형을 쓰세요.",
                WR,
                "words",
                labels_az("B", 10),
                [
                    ("fill", "b01", "Flora ________ her mother last weekend.", "helped"),
                    ("fill", "b02", "Tanya ________ me this morning.", "called"),
                    ("fill", "b03", "Mary ________ math yesterday.", "studied"),
                    ("fill", "b04", "I ________ home safely.", "arrived"),
                    ("fill", "b05", "Tom ________ back to his seat.", "hurried"),
                    ("fill", "b06", "Homer ________ what he said.", "regretted"),
                    ("fill", "b07", "The train ________ at the station.", "stopped"),
                    ("fill", "b08", "I ________ him a question.", "asked"),
                    ("fill", "b09", "Harry ________ his job two weeks ago.", "changed"),
                    ("fill", "b10", "I ________ in London for a week a year ago.", "stayed"),
                ],
            ),
            "C": (
                "POINT 3·4",
                "다음 문장을 과거형으로 바꾸세요. 빈칸에 과거형만 쓰세요.",
                WR,
                "words",
                labels_az("C", 7),
                [
                    ("fill", "c01", "Sally jogs every morning. → Sally ________ yesterday morning.", "jogged"),
                    ("fill", "c02", "Timmy and I play baseball every weekend. → Timmy and I ________ last Sunday.", "played"),
                    ("fill", "c03", "The restaurant has many customers on holidays. → The restaurant ________ many customers today.", "had"),
                    ("fill", "c04", "My sister does homework every night. → My sister ________ homework last night.", "did"),
                    ("fill", "c05", "Sora studies English every day. → Sora ________ English this morning.", "studied"),
                    ("fill", "c06", "Kate watches TV every night. → Kate ________ TV all day yesterday.", "watched"),
                    ("fill", "c07", "Jina reads many books every month. → Jina ________ many books last vacation.", "read"),
                ],
            ),
            "D": (
                "POINT 3",
                "다음 빈칸에 들어갈 과거형을 쓰세요.",
                WR,
                "words",
                labels_az("D", 6),
                [
                    ("fill", "d01", "I ________ a new friend at camp.", "had"),
                    ("fill", "d02", "We ________ at the airport.", "met"),
                    ("fill", "d03", "They ________ to the beach.", "went"),
                    ("fill", "d04", "She ________ hard for the test.", "studied"),
                    ("fill", "d05", "He ________ me a present.", "gave"),
                    ("fill", "d06", "They ________ with us.", "agreed"),
                ],
            ),
        },
        m,
    )
    wb_unit(
        2,
        3,
        "12",
        "일반동사의 부정문과 의문문 · POINT 5·6 (WB p. 12)",
        {
            "A": (
                "POINT 5",
                "다음 문장을 부정문으로 바꾸세요. 빈칸에 don't/doesn't와 동사원형을 쓰세요.",
                WR2,
                "words",
                labels_az("A", 8),
                [
                    ("fill", "a01", "Lisa eats meat. → Lisa ________ ________ meat.", ["doesn't|eat", "does not|eat"], 2),
                    ("fill", "a02", "Mike watches TV. → Mike ________ ________ TV.", ["doesn't|watch", "does not|watch"], 2),
                    ("fill", "a03", "We have a lot of snow in winter. → We ________ ________ a lot of snow in winter.", ["don't|have", "do not|have"], 2),
                    ("fill", "a04", "I brush my teeth after breakfast. → I ________ ________ my teeth after breakfast.", ["don't|brush", "do not|brush"], 2),
                    ("fill", "a05", "John gets up early. → John ________ ________ up early every day.", ["doesn't|get", "does not|get"], 2),
                    ("fill", "a06", "Mary and Tom like hamburgers. → Mary and Tom ________ ________ hamburgers.", ["don't|like", "do not|like"], 2),
                    ("fill", "a07", "Susan lives with her parents. → Susan ________ ________ with her parents.", ["doesn't|live", "does not|live"], 2),
                    ("fill", "a08", "Patrick has a lot of money. → Patrick ________ ________ a lot of money.", ["doesn't|have", "does not|have"], 2),
                ],
            ),
            "B": (
                "POINT 6",
                "다음 대화의 빈칸에 알맞은 말을 쓰세요.",
                WR2,
                "words",
                labels_az("B", 6),
                [
                    ("fill", "b01", "A: ________ she ________ a walk every day?\nB: Yes, she does.", ["Does|take"], 2),
                    ("fill", "b02", "A: ________ you ________ sports?\nB: No, I don't.", ["Do|like"], 2),
                    ("fill", "b03", "A: ________ your brother ________ very well?\nB: Yes, he does.", ["Does|swim"], 2),
                    ("fill", "b04", "A: ________ they ________ TV after dinner?\nB: No, they don't.", ["Do|watch"], 2),
                    ("fill", "b05", "A: ________ Tony ________ to school on foot?\nB: Yes, he does.", ["Does|go"], 2),
                    ("fill", "b06", "A: ________ your parents ________ you allowance?\nB: No, they don't.", ["Do|give"], 2),
                ],
            ),
            "C": (
                "POINT 7·8",
                "다음 빈칸에 알맞은 말을 쓰세요.",
                WR2,
                "words",
                labels_az("C", 10),
                [
                    ("fill", "c01", "________ you enjoy the movie yesterday?", ["Did"], 1),
                    ("fill", "c02", "Janet couldn't find her keys. She ________ find them.", ["didn't", "did not"], 1),
                    ("fill", "c03", "________ you see him last week?", ["Did"], 1),
                    ("fill", "c04", "My mom ________ wait for me yesterday.", ["didn't", "did not"], 1),
                    ("fill", "c05", "________ Sally study math last night?", ["Did"], 1),
                    ("fill", "c06", "He ________ visit his grandmother last Sunday.", ["didn't", "did not"], 1),
                    ("fill", "c07", "________ you get up early this morning?", ["Did"], 1),
                    ("fill", "c08", "I ________ have breakfast this morning.", ["didn't", "did not"], 1),
                    ("fill", "c09", "We ________ make noise last night.", ["didn't", "did not"], 1),
                    ("fill", "c10", "________ you go to the park with your friend yesterday?", ["Did"], 1),
                ],
            ),
            "D": (
                "POINT 8",
                "다음 문장을 완성하세요.",
                WR,
                "words",
                labels_az("D", 7),
                [
                    ("fill", "d01", "________ he break the window?", ["Did he break the window", "Did he break the window?"], 1),
                    ("fill", "d02", "She ________ the comic book.", ["didn't read the comic book", "did not read the comic book"], 1),
                    ("fill", "d03", "________ they watch the game?", ["Did they watch", "Did they watch?"], 1),
                    ("fill", "d04", "She ________ her homework.", ["didn't do her homework", "did not do her homework"], 1),
                    ("fill", "d05", "I ________ my room.", ["didn't clean my room", "did not clean my room"], 1),
                    ("fill", "d06", "________ you meet Tom?", ["Did you meet", "Did you meet?"], 1),
                    ("fill", "d07", "He ________ his name.", ["didn't remember his name", "did not remember his name"], 1),
                ],
            ),
        },
        m,
    )
    # WB chapter test
    secs = [
        section("1-5", "[1–5]", "[1–5] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(5)),
        section("6", "[6]", "[6] 다음 문장을 완성하세요.", WR2, "words", ["6"]),
        section("7-12", "[7–12]", "[7–12] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(6, 7)),
        section("13", "[13]", "[13] 알맞은 것을 모두 고르세요.", MC, "choice", ["13"]),
        section("14", "[14]", "[14] 다음 밑줄 친 부분을 고치세요.", CORR, "words", ["14"]),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["She has a new backpack.", "He drinks water."], answer_index=1),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["My father washed his car last Sunday.", "Judy watches TV every night."], answer_index=1),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["They had a good time last night.", "We didn't do anything yesterday."], answer_index=1),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["They read books.", "They were at home.", "They made a cake.", "They didn't go out.", "They played tennis."], answer_index=4),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["had a nice dinner", "went to a movie", "studied science", "talked about winter camp", "played computer games"], answer_index=3),
        fill_item(iid="q06", sec=secs[1], label="6", prompt_en="Hana gets up at 7. Complete: has breakfast / studies English / watches TV", blanks=3, accept=["has|studies|watches", "has breakfast|studies English|watches TV"]),
        mc_item(iid="q07", sec=secs[2], label="7", choices=["Does she like movies? No, she likes sports.", "Do you live in Busan? No, I live in Seoul."], answer_index=1),
        mc_item(iid="q08", sec=secs[2], label="8", choices=["must not park", "can't park", "don't have to park"], answer_index=1),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["Does he play the flute?", "Do they have to practice?"], answer_index=1),
        mc_item(iid="q10", sec=secs[2], label="10", choices=["must not tell", "must not to tell"], answer_index=1),
        mc_item(iid="q11", sec=secs[2], label="11", choices=["came", "come"], answer_index=2),
        mc_item(iid="q12", sec=secs[2], label="12", choices=["cannot walk", "can walk", "must walk"], answer_index=1),
        mc_item(iid="q13", sec=secs[3], label="13", choices=["②", "⑤"], answer_index=1),
        fill_item(iid="q14", sec=secs[4], label="14", prompt_en="He [payed] for lunch yesterday.", accept=["paid"]),
    ]
    save(
        2,
        "wb-c02-test.json",
        build_practice(
            practice_id="cm1:wb-c02:test",
            title="WB Chapter Test",
            subtitle="Chapter 02 일반동사 (WB p. 14)",
            pages="14",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c02-test",
            **m,
        ),
    )
    print("ch02 wb done")


def gen_ch03():
    m = sb(3, "현재진행형과 미래 표현")
    # U1 A — progressive triple forms (aff / neg / question) as 3 blanks each
    sec = section("A", "Section A", "다음 문장을 긍정·부정·의문문으로 바꾸세요.", WR2, "words", labels_az("A", 3), "POINT 1·2")
    triples = [
        ("Minsu is washing his dog now.", "is|washing", "is|not|washing", "Is|washing"),
        ("Anna is making a shopping list.", "is|making", "is|not|making", "Is|making"),
        ("They are eating lunch together.", "are|eating", "are|not|eating", "Are|eating"),
    ]
    items = []
    for i, (stem, a, b, c) in enumerate(triples, 1):
        items.append(
            fill_item(
                iid=f"a{i:02d}",
                sec=sec,
                label=f"A{i}",
                prompt_en=f"{stem}\n(1) 긍정 (2) 부정 (3) 의문 — 각 칸에 한 단어씩",
                blanks=3,
                accept=[f"{a}|{b}|{c}"],
            )
        )
    save(3, "c03-u1-A.json", build_practice(practice_id="cm1:c03:u1-A", title="Unit 1 Unit Exercise — Section A", subtitle="현재진행형 · POINT 1·2 (p. 36)", pages="36", timer_minutes=22, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "다음 빈칸에 알맞은 말을 쓰세요.", WR2, "words", labels_az("B", 4), "POINT 2·3")
    bb = [
        ("They are not ________ in the pool.", "swimming", 1),
        ("________ the baby ________ on the bed?", "Is|lying", 2),
        ("The puppies ________ ________ .", "aren't|crying", 2),
        ("________ the boys ________ the hill?", "Are|climbing", 2),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=[a] if "|" not in a else [a], blanks=bl) for i, (p, a, bl) in enumerate(bb, 1)]
    save(3, "c03-u1-B.json", build_practice(practice_id="cm1:c03:u1-B", title="Unit 1 Unit Exercise — Section B", subtitle="현재진행형 · POINT 2·3 (p. 36)", pages="36", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "다음 문장이 맞으면 O, 틀리면 고친 말만 쓰세요.", OX, "words", labels_az("C", 7), "POINT 1·3")
    ox = [("Andy is enjoying a party with friends.", "O"), ("He [is talk] on the phone.", "isn't talking"), ("The children [is sing] in the classroom.", "are singing"), ("Mr. Stevens [drive] a nice car.", "is driving"), ("Little Johnny [is not sleep] in his bed.", "isn't sleeping"), ("The scientist is mixing water and alcohol.", "O"), ("Jake and I [is wait] for Judy right now.", "are waiting")]
    items = []
    for i, (p, a) in enumerate(ox, 1):
        items.append(fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=["O", "o"] if a == "O" else [a]))
    save(3, "c03-u1-C.json", build_practice(practice_id="cm1:c03:u1-C", title="Unit 1 Unit Exercise — Section C", subtitle="현재진행형 · POINT 1·3 (p. 36)", pages="36", timer_minutes=20, sections=[sec], items=items, **m))

    # U2 future
    sec = section("A", "Section A", "다음 문장을 미래형으로 바꾸세요.", WR, "words", labels_az("A", 6), "POINT 4·5")
    fa = ["are going to prepare", "will not take", "Will she decorate", "aren't going to travel", "will wait", "Is he going to read"]
    pa = ["We prepare dinner. → We ________ dinner.", "I will take the bus. (부정) → I ________ the bus.", "She decorates the room. (의문) → ________ the room?", "They travel abroad. (부정) → They ________ abroad.", "We wait for you. → We ________ for you.", "He reads a novel. (의문) → ________ a novel?"]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=pa[i - 1], accept=[fa[i - 1], fa[i - 1].replace("will not", "won't").replace("aren't", "are not")]) for i in range(1, 7)]
    save(3, "c03-u2-A.json", build_practice(practice_id="cm1:c03:u2-A", title="Unit 2 Unit Exercise — Section A", subtitle="미래 표현 · POINT 4·5 (p. 39)", pages="39", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "우리말과 같게 빈칸을 채우세요.", WR, "words", labels_az("B", 5), "POINT 4·5")
    fb = ["Are you going to cross", "will play", "will visit", "won't sell", "isn't going to marry"]
    pb = ["________ the street on a red light?", "We ________ soccer this afternoon.", "I ________ my uncle next week.", "They ________ their house.", "She ________ him."]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=pb[i - 1], accept=[fb[i - 1], fb[i - 1].replace("won't", "will not").replace("isn't", "is not")]) for i in range(1, 6)]
    save(3, "c03-u2-B.json", build_practice(practice_id="cm1:c03:u2-B", title="Unit 2 Unit Exercise — Section B", subtitle="미래 표현 · POINT 4·5 (p. 39)", pages="39", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "다음 빈칸에 알맞은 말을 쓰세요.", WR, "words", labels_az("C", 5), "POINT 4·5")
    fc = ["Are you going to go", "are going to finish", "won't call", "Will you meet", "aren't going to stay"]
    pc = ["________ to the concert tonight?", "We ________ the project soon.", "I ________ you later.", "________ me at the station?", "They ________ here long."]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=pc[i - 1], accept=[fc[i - 1]]) for i in range(1, 6)]
    save(3, "c03-u2-C.json", build_practice(practice_id="cm1:c03:u2-C", title="Unit 2 Unit Exercise — Section C", subtitle="미래 표현 · POINT 4·5 (p. 39)", pages="39", timer_minutes=20, sections=[sec], items=items, **m))

    secs = [
        section("1-3", "[1–3]", "[1–3] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(3)),
        section("4-6", "[4–6]", "[4–6] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(3, 4)),
        section("7-8", "[7–8]", "[7–8] 문장을 완성하세요.", SENT, "sentence", labels_num(2, 7)),
        section("9-10", "[9–10]", "[9–10] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 9)),
        section("11-13", "[11–13]", "[11–13] 문장을 완성하세요.", SENT, "sentence", labels_num(3, 11)),
        section("14-16", "[14–16]", "[14–16] 밑줄 친 부분을 고치세요.", CORR, "words", labels_num(3, 14)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["swimming", "takeing", "rainning", "dieing"], answer_index=3),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["will not go", "won't going", "not will go"], answer_index=1),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["Are going to", "Is going to", "Am going to"], answer_index=2),
        mc_item(iid="q04", sec=secs[1], label="4", choices=["exercising", "exercise", "exercises"], answer_index=1),
        mc_item(iid="q05", sec=secs[1], label="5", choices=["building", "build", "builds"], answer_index=2),
        mc_item(iid="q06", sec=secs[1], label="6", choices=["lying", "lieing", "laying"], answer_index=1),
        sent_item(iid="q07", sec=secs[2], label="7", prompt_en="Ann lie on the grass in the park. (현재진행)", accept=["Ann is lying on the grass in the park.", "Ann is lying on the grass in the park"]),
        sent_item(iid="q08", sec=secs[2], label="8", prompt_en="Fred learn Korean this summer. (be going to 의문문)", accept=["Is Fred going to learn Korean this summer?", "Is Fred going to learn Korean this summer"]),
        mc_item(iid="q09", sec=secs[3], label="9", choices=["Are the boys playing?", "Is the boys playing?", "Do the boys playing?"], answer_index=1),
        mc_item(iid="q10", sec=secs[3], label="10", choices=["is not eating", "not is eating", "is eating not"], answer_index=1),
        sent_item(iid="q11", sec=secs[4], label="11", prompt_en="I go to the movies. (be going to)", accept=["I am going to go to the movies.", "I'm going to go to the movies."]),
        sent_item(iid="q12", sec=secs[4], label="12", prompt_en="You come back to Korea. (will 의문문)", accept=["Will you come back to Korea?", "Will you come back to Korea"]),
        sent_item(iid="q13", sec=secs[4], label="13", prompt_en="We work tomorrow. (be going to 부정)", accept=["We are not going to work tomorrow.", "We're not going to work tomorrow."]),
        fill_item(iid="q14", sec=secs[5], label="14", prompt_en="She is [useing] a dictionary.", accept=["using"]),
        fill_item(iid="q15", sec=secs[5], label="15", prompt_en="They are going to [playing] soccer.", accept=["play"]),
        fill_item(iid="q16", sec=secs[5], label="16", prompt_en="He [ride] a bike now.", accept=["is riding"]),
    ]
    save(3, "c03-test.json", build_practice(practice_id="cm1:c03:test", title="Chapter Test", subtitle="Chapter 03 (p. 40)", pages="40", timer_minutes=28, sections=secs, items=items, test_id="c03-test", **m))
    print("ch03 sb done")


def gen_ch04():
    m = sb(4, "조동사")
    sec = section("A", "Section A", "다음 문장이 맞으면 O, 틀리면 고친 말만 쓰세요.", OX, "words", labels_az("A", 6), "POINT 1·4")
    ox = [("This bird can't fly now.", "O"), ("[Do] you carry this box?", "Can you"), ("It may rain tomorrow.", "O"), ("[Do] I leave now?", "May I leave"), ("You [must not talk] in class.", "must not talk"), ("You must wear a seat belt.", "O")]
    items = []
    for i, (p, a) in enumerate(ox, 1):
        acc = ["O", "o"] if a == "O" else [a]
        items.append(fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=acc))
    save(4, "c04-u1-A.json", build_practice(practice_id="cm1:c04:u1-A", title="Unit 1 Unit Exercise — Section A", subtitle="조동사 can/may · POINT 1·4 (p. 47)", pages="47", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "다음 중 알맞은 것을 고르세요.", MC, "choice", labels_az("B", 6), "POINT 2·5")
    mc_b = [
        ("It may be cold outside.", ["may", "can", "must", "should"], 1),
        ("You may go home now.", ["may", "must", "can", "should"], 1),
        ("She can speak French and English.", ["can", "may", "must", "should"], 1),
        ("The lake may not be clean.", ["may", "can", "must", "should"], 1),
        ("Could you pass the sugar?", ["Could", "Can", "May", "Must"], 1),
        ("You may visit us anytime.", ["may", "must", "should", "can"], 1),
    ]
    items = [mc_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, choices=ch, answer_index=ai) for i, (p, ch, ai) in enumerate(mc_b, 1)]
    save(4, "c04-u1-B.json", build_practice(practice_id="cm1:c04:u1-B", title="Unit 1 Unit Exercise — Section B", subtitle="조동사 can/may · POINT 2·5 (p. 47)", pages="47", timer_minutes=20, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "다음 빈칸에 알맞은 말을 쓰세요.", WR, "words", labels_az("C", 4), "POINT 3·6")
    cc = ["Can", "may not", "may", "can't"]
    pc = ["________ you speak Japanese?", "You ________ swim in this river.", "It ________ rain tomorrow.", "I ________ solve this problem."]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=pc[i - 1], accept=[cc[i - 1], cc[i - 1].replace("can't", "cannot")]) for i in range(1, 5)]
    save(4, "c04-u1-C.json", build_practice(practice_id="cm1:c04:u1-C", title="Unit 1 Unit Exercise — Section C", subtitle="조동사 can/may · POINT 3·6 (p. 47)", pages="47", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("A", "Section A", "다음 빈칸에 have to/has to를 포함해 쓰세요.", WR, "words", labels_az("A", 5), "POINT 7")
    ha = ["has to see", "have to recycle", "has to finish", "has to get up", "have to be"]
    pa = ["He ________ a doctor right away.", "We ________ paper.", "Susan ________ her work.", "My brother ________ early tomorrow.", "You ________ quiet in the theater."]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=pa[i - 1], accept=[ha[i - 1]]) for i in range(1, 6)]
    save(4, "c04-u2-A.json", build_practice(practice_id="cm1:c04:u2-A", title="Unit 2 Unit Exercise — Section A", subtitle="must/have to/should · POINT 7 (p. 49)", pages="49", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("B", "Section B", "should/shouldn't로 빈칸을 채우세요.", WR, "words", labels_az("B", 5), "POINT 8")
    hb = ["should have", "should not drive", "should call", "should not be", "should not run"]
    pb = ["You ________ more vegetables.", "You ________ so fast.", "We ________ him soon.", "You ________ rude.", "You ________ in the hallway."]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=pb[i - 1], accept=[hb[i - 1], hb[i - 1].replace("should not", "shouldn't")]) for i in range(1, 6)]
    save(4, "c04-u2-B.json", build_practice(practice_id="cm1:c04:u2-B", title="Unit 2 Unit Exercise — Section B", subtitle="must/have to/should · POINT 8 (p. 49)", pages="49", timer_minutes=18, sections=[sec], items=items, **m))

    sec = section("C", "Section C", "다음 빈칸에 알맞은 말을 쓰세요.", WR, "words", labels_az("C", 4), "POINT 7·8")
    hc = ["must feed", "should not use", "has to save", "should turn off"]
    pc2 = ["You ________ your dog every day.", "You ________ your phone in class.", "He ________ money for college.", "We ________ the lights."]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=pc2[i - 1], accept=[hc[i - 1], hc[i - 1].replace("should not", "shouldn't")]) for i in range(1, 5)]
    save(4, "c04-u2-C.json", build_practice(practice_id="cm1:c04:u2-C", title="Unit 2 Unit Exercise — Section C", subtitle="must/have to/should · POINT 7·8 (p. 49)", pages="49", timer_minutes=18, sections=[sec], items=items, **m))

    secs = [
        section("1-4", "[1–4]", "[1–4] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(4)),
        section("5-6", "[5–6]", "[5–6] 문장을 완성하세요.", SENT, "sentence", labels_num(2, 5)),
        section("7-9", "[7–9]", "[7–9] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(3, 7)),
        section("10-11", "[10–11]", "[10–11] 문장을 완성하세요.", SENT, "sentence", labels_num(2, 10)),
        section("12-13", "[12–13]", "[12–13] 대화를 완성하세요.", WR2, "words", labels_num(2, 12)),
        section("14", "[14]", "[14] have to/don't have to로 완성하세요.", WR2, "words", ["14"]),
        section("15-16", "[15–16]", "[15–16] can/can't으로 완성하세요.", WR2, "words", labels_num(2, 15)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["can speak", "speaks", "speaking"], answer_index=1),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["must", "can", "may"], answer_index=1),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["May I go", "Must I go", "Can I go on a picnic"], answer_index=3),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["can play", "can ride", "can speak Chinese"], answer_index=3),
        sent_item(iid="q05", sec=secs[1], label="5", prompt_en="You take the books home. (shouldn't)", accept=["You should not take the books home.", "You shouldn't take the books home."]),
        sent_item(iid="q06", sec=secs[1], label="6", prompt_en="Complete: must not throw trash / must not ride a bike", accept=["You must not throw trash.", "You must not ride a bike."]),
        mc_item(iid="q07", sec=secs[2], label="7", choices=["Can I understand", "I can understand", "Do I understand"], answer_index=2),
        mc_item(iid="q08", sec=secs[2], label="8", choices=["May I use", "Must I use", "Can I use the restroom"], answer_index=3),
        mc_item(iid="q09", sec=secs[2], label="9", choices=["can make", "must make", "may make and can make"], answer_index=3),
        sent_item(iid="q10", sec=secs[3], label="10", prompt_en="Sign: Don't take books home (shouldn't)", accept=["You should not take the books home.", "You shouldn't take the books home."]),
        fill_item(iid="q11", sec=secs[3], label="11", prompt_en="Rule 1: don't throw trash. Rule 2: don't ride bikes.", accept=["must not throw trash|must not ride a bike"], blanks=2),
        fill_item(iid="q12", sec=secs[4], label="12", prompt_en="B: I can understand English. / C: Can Mandy bake?", accept=["I can understand English|Can Mandy bake"], blanks=2),
        mc_item(iid="q13", sec=secs[4], label="13", choices=["Yes, you can't", "No, you can't", "Yes, you can"], answer_index=3),
        fill_item(iid="q14", sec=secs[5], label="14", prompt_en="Hojin must clean / weekend no uniform", accept=["has to clean|don't have to wear", "has to clean|do not have to wear"], blanks=2),
        fill_item(iid="q15", sec=secs[6], label="15", prompt_en="Susan: piano yes, Chinese yes. Andy: Chinese no.", accept=["can play the piano|can speak Chinese|can't speak Chinese", "can play the piano|can speak Chinese|cannot speak Chinese"], blanks=3),
        mc_item(iid="q16", sec=secs[6], label="16", choices=["May I use", "Must I use", "Should I use"], answer_index=1),
    ]
    save(4, "c04-test.json", build_practice(practice_id="cm1:c04:test", title="Chapter Test", subtitle="Chapter 04 조동사 (p. 50)", pages="50", timer_minutes=28, sections=secs, items=items, test_id="c04-test", **m))
    print("ch04 sb done")


def gen_wb_03_04():
    m3 = wb(3, "현재진행형과 미래 표현")
    wb_unit(
        3,
        1,
        "16",
        "현재진행형 · POINT 1·3 (WB p. 16)",
        {
            "A": (
                "POINT 1",
                "다음 빈칸에 현재진행형을 쓰세요.",
                WR,
                "words",
                labels_az("A", 8),
                [
                    ("fill", "a01", "She ________ a cup of milk.", "is drinking"),
                    ("fill", "a02", "The boy ________ the flowers.", "is smelling"),
                    ("fill", "a03", "The children ________ for joy.", "are jumping"),
                    ("fill", "a04", "My parents ________ horses.", "are riding"),
                    ("fill", "a05", "The leaves ________ from the tree.", "are falling"),
                    ("fill", "a06", "I ________ with my sister in the park.", "am jogging"),
                    ("fill", "a07", "Fiona ________ on the bed.", "is lying"),
                    ("fill", "a08", "Jake ________ for this winter.", "is planning"),
                ],
            ),
            "B": (
                "POINT 2·3",
                "부정·의문형을 쓰세요. (각 2칸)",
                WR2,
                "words",
                labels_az("B", 4),
                [
                    ("fill", "b01", "Jihoon ________ ________ the ball now.", ["isn't|kicking", "is not|kicking"], 2),
                    ("fill", "b02", "________ they ________ many questions?", ["Are|asking"], 2),
                    ("fill", "b03", "The policeman ________ ________ the cars.", ["isn't|stopping", "is not|stopping"], 2),
                    ("fill", "b04", "________ the birds ________ high?", ["Are|flying"], 2),
                ],
            ),
            "C": (
                "POINT 1·3",
                "맞으면 O, 틀리면 고친 말만 쓰세요.",
                OX,
                "words",
                labels_az("C", 10),
                [
                    ("fill", "c01", "He is repairing the radio now.", ["O", "o"]),
                    ("fill", "c02", "We are looking for a small house.", ["O", "o"]),
                    ("fill", "c03", "Some children [is sing] in the classroom.", ["are singing"]),
                    ("fill", "c04", "Mr. Stevens [drive] a nice car.", ["is driving"]),
                    ("fill", "c05", "Little Johnny [is not sleep] in his bed.", ["isn't sleeping", "is not sleeping"]),
                    ("fill", "c06", "The scientist is mixing water and alcohol.", ["O", "o"]),
                    ("fill", "c07", "Jake and I [is wait] for Judy.", ["are waiting"]),
                    ("fill", "c08", "Some students [is not listen] to my speech.", ["aren't listening", "are not listening"]),
                    ("fill", "c09", "Two men are painting the wall now.", ["O", "o"]),
                    ("fill", "c10", "Are you cutting paper with scissors?", ["O", "o"]),
                ],
            ),
            "D": (
                "POINT 3",
                "다음 빈칸에 알맞은 말을 쓰세요.",
                WR2,
                "words",
                labels_az("D", 8),
                [
                    ("fill", "d01", "The store ________ new shoes.", "is selling", 1),
                    ("fill", "d02", "A car ________ the corner.", "is passing", 1),
                    ("fill", "d03", "I ________ a red coat today.", "am wearing", 1),
                    ("fill", "d04", "________ he ________ a photo?", ["Is|taking"], 2),
                    ("fill", "d05", "She ________ ________ lunch now.", ["isn't|eating", "is not|eating"], 2),
                    ("fill", "d06", "________ you ________ to me?", ["Are|talking"], 2),
                    ("fill", "d07", "I ________ ________ about it.", ["am not|thinking", "am not|thinking"], 2),
                    ("fill", "d08", "They ________ ________ stones.", ["are|throwing"], 2),
                ],
            ),
        },
        m3,
    )
    wb_unit(
        3,
        2,
        "18",
        "미래 표현 · POINT 4·5 (WB p. 18)",
        {
            "A": (
                "POINT 4",
                "will / be going to로 빈칸을 채우세요.",
                WR,
                "words",
                labels_az("A", 8),
                [
                    ("fill", "a01", "I ________ forget you.", "won't"),
                    ("fill", "a02", "He ________ 15 next year.", "will be"),
                    ("fill", "a03", "Mike ________ magic at the party.", "is going to do"),
                    ("fill", "a04", "I ________ make a sandwich.", "am going to"),
                    ("fill", "a05", "Vicky ________ buy a new computer.", "isn't going to"),
                    ("fill", "a06", "________ the train arrive at the station?", "Will the train arrive"),
                    ("fill", "a07", "Are you ________ learn English from Mr. Smith?", "going to learn"),
                    ("fill", "a08", "Is Jim ________ go with you?", "going to go"),
                ],
            ),
            "B": (
                "POINT 4·5",
                "미래 부정·의문형으로 바꾸세요.",
                WR,
                "words",
                labels_az("B", 8),
                [
                    ("fill", "b01", "She stays at her aunt's house. → She ________ at her aunt's house.", "won't stay"),
                    ("fill", "b02", "Our team wins the game. → Our team ________ the game.", "is going to win"),
                    ("fill", "b03", "Miso dances at the festival. → Miso ________ at the festival.", "isn't going to dance"),
                    ("fill", "b04", "I am late for the meeting. → I ________ late for the meeting.", "won't be"),
                    ("fill", "b05", "They come to my party. → ________ to my party?", "Will they come"),
                    ("fill", "b06", "Andy studies art in NYC. → ________ art in NYC?", "Is Andy going to study"),
                    ("fill", "b07", "I take a nap after lunch. → I ________ after lunch.", "will take a nap"),
                    ("fill", "b08", "He spends all his money on clothes. → He ________ all his money on clothes.", "isn't going to spend"),
                ],
            ),
            "C": (
                "POINT 4·5",
                "다음 빈칸에 알맞은 말을 쓰세요.",
                WR,
                "words",
                labels_az("C", 10),
                [
                    ("fill", "c01", "The weather ________ good today.", "won't be"),
                    ("fill", "c02", "Fred and Jenny ________ together.", "are going to exercise"),
                    ("fill", "c03", "I ________ a hamburger with fries.", "will eat"),
                    ("fill", "c04", "________ you ________ me that book?", ["Are you going to give"], 1),
                    ("fill", "c05", "Dad ________ me a bike.", "is going to buy"),
                    ("fill", "c06", "I ________ him money.", "am not going to lend"),
                    ("fill", "c07", "________ you ________ Amy's number?", ["Will you ask"], 1),
                    ("fill", "c08", "________ Linda ________ in France?", ["Is Linda going to study"], 1),
                    ("fill", "c09", "________ the war end in that country?", ["Will the war end"], 1),
                    ("fill", "c10", "Are you ________ tomatoes in the garden?", "going to grow"),
                ],
            ),
            "D": (
                "POINT 5",
                "다음 문장을 완성하세요.",
                WR,
                "words",
                labels_az("D", 8),
                [
                    ("fill", "d01", "I ________ you.", "will trust"),
                    ("fill", "d02", "We ________ to Paris next month.", "are going to fly"),
                    ("fill", "d03", "________ Mike ________ at home?", ["Is Mike going to be"], 1),
                    ("fill", "d04", "She ________ her uncle this weekend.", "isn't going to visit"),
                    ("fill", "d05", "________ you ________ me?", ["Will you help"], 1),
                    ("fill", "d06", "Mr. Kim ________ our class.", "is going to teach"),
                    ("fill", "d07", "I ________ anyone.", "won't tell"),
                    ("fill", "d08", "________ you ________ the bus?", ["Are you going to take"], 1),
                ],
            ),
        },
        m3,
    )
    secs = [
        section("1-5", "[1–5]", "[1–5] 다음 중 알맞은 것을 고르세요.", MC, "choice", labels_num(5)),
        section("6", "[6]", "[6] spelling: lie + ing", CORR, "words", ["6"]),
        section("7", "[7]", "[7] Are vs Is", WR, "words", ["7"]),
        section("8", "[8]", "[8] 문장 완성", SENT, "sentence", ["8"]),
        section("9", "[9]", "[9] 문장 완성", SENT, "sentence", ["9"]),
        section("10-12", "[10–12]", "[10–12] MC", MC, "choice", labels_num(3, 10)),
        section("13-16", "[13–16]", "[13–16] fill", WR, "words", labels_num(4, 13)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["Is", "Are", "Am"], answer_index=1),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["won't wear", "will not wearing", "not will wear"], answer_index=1),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["playing", "play", "plays"], answer_index=1),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["is going to rain", "is raining", "will raining"], answer_index=1),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["will not stay", "won't staying", "not will stay"], answer_index=1),
        fill_item(iid="q06", sec=secs[1], label="6", prompt_en="She is [lieing] on the sofa.", accept=["lying"]),
        fill_item(iid="q07", sec=secs[2], label="7", prompt_en="________ you enjoying the party?", accept=["Are"]),
        sent_item(iid="q08", sec=secs[3], label="8", prompt_en="They clean the streets after school. (be going to 의문문)", accept=["Are they going to clean the streets after school?"]),
        sent_item(iid="q09", sec=secs[4], label="9", prompt_en="We plan many events for children. (현재진행)", accept=["We are planning a lot of events for children.", "We're planning a lot of events for children."]),
        mc_item(iid="q10", sec=secs[5], label="10", choices=["Yes, I will.", "Yes, you will."], answer_index=1),
        mc_item(iid="q11", sec=secs[5], label="11", choices=["isn't watching", "not is watching"], answer_index=1),
        mc_item(iid="q12", sec=secs[5], label="12", choices=["remember", "remembering"], answer_index=1),
        fill_item(iid="q13", sec=secs[6], label="13", prompt_en="Mason is in the bathroom ________ his cat.", accept=["is washing"]),
        mc_item(iid="q14", sec=secs[6], label="14", choices=["will travel", "be going to travel", "am going to travel"], answer_index=2),
        fill_item(iid="q15", sec=secs[6], label="15", prompt_en="Look! The students ________ at the picture.", accept=["are looking at"]),
        fill_item(iid="q16", sec=secs[6], label="16", prompt_en="We ________ a lot next semester.", accept=["are going to learn", "are going to learn"]),
    ]
    save(
        3,
        "wb-c03-test.json",
        build_practice(
            practice_id="cm1:wb-c03:test",
            title="WB Chapter Test",
            subtitle="Chapter 03 (WB p. 20)",
            pages="20",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c03-test",
            **m3,
        ),
    )

    m4 = wb(4, "조동사")
    wb_unit(
        4,
        1,
        "22",
        "조동사 can/may · POINT 1·6 (WB p. 22)",
        {
            "A": (
                "POINT 1·4",
                "맞으면 O, 틀리면 고친 말만 쓰세요.",
                OX,
                "words",
                labels_az("A", 10),
                [
                    ("fill", "a01", "She can answer the question.", ["O", "o"]),
                    ("fill", "a02", "[Do] you carry this box?", ["Can you carry this box", "Can you"]),
                    ("fill", "a03", "It may rain tomorrow.", ["O", "o"]),
                    ("fill", "a04", "We must clean the classroom every day.", ["O", "o"]),
                    ("fill", "a05", "They [can't dance] well.", ["O", "o"]),
                    ("fill", "a06", "You [must not walk] on the grass.", ["must not walk"]),
                    ("fill", "a07", "Mike can run 100 m in 14 seconds.", ["O", "o"]),
                    ("fill", "a08", "You may play my piano.", ["O", "o"]),
                    ("fill", "a09", "[Do] I come in now?", ["May I come in now", "May I come in"]),
                    ("fill", "a10", "Can you finish this work by noon?", ["O", "o"]),
                ],
            ),
            "B": (
                "POINT 2·5",
                "다음 대화에 알맞은 응답을 고르세요 (a–d).",
                MC,
                "choice",
                labels_az("B", 10),
                [
                    ("mc", "b01", "It may be cold outside.", ["a", "b", "c", "d"], 1),
                    ("mc", "b02", "You may go home now.", ["a", "b", "c", "d"], 2),
                    ("mc", "b03", "She can speak French and English.", ["a", "b", "c", "d"], 3),
                    ("mc", "b04", "The lake may not be clean.", ["a", "b", "c", "d"], 1),
                    ("mc", "b05", "Could you pass the sugar?", ["a", "b", "c", "d"], 4),
                    ("mc", "b06", "You may visit us anytime.", ["a", "b", "c", "d"], 3),
                    ("mc", "b07", "Can I use your phone?", ["a", "b", "c", "d"], 2),
                    ("mc", "b08", "It may snow tonight.", ["a", "b", "c", "d"], 1),
                    ("mc", "b09", "You must be quiet.", ["a", "b", "c", "d"], 4),
                    ("mc", "b10", "May I open the window?", ["a", "b", "c", "d"], 2),
                ],
            ),
            "C": (
                "POINT 3",
                "빈칸에 can/may/could 등을 쓰세요.",
                WR,
                "words",
                labels_az("C", 6),
                [
                    ("fill", "c01", "Linda can make pizza very well.", ["can't", "cannot"], 1),
                    ("fill", "c02", "You may eat this cookie now.", ["may"], 1),
                    ("fill", "c03", "She may not like it.", ["may not"], 1),
                    ("fill", "c04", "________ Mickey play the violin?", ["Can"], 1),
                    ("fill", "c05", "________ you tell me the way to the airport?", ["Could", "Can"], 1),
                    ("fill", "c06", "She may be over 80.", ["may"], 1),
                ],
            ),
            "D": (
                "POINT 4·6",
                "대화를 완성하세요.",
                WR2,
                "words",
                labels_az("D", 7),
                [
                    ("fill", "d01", "A: ________ you ________ my name? B: Yes, I can.", ["Can|remember"], 2),
                    ("fill", "d02", "It ________ sunny tomorrow.", ["may be"], 1),
                    ("fill", "d03", "You ________ ________ the paintings.", ["cannot|touch", "can't|touch"], 2),
                    ("fill", "d04", "________ you ________ me a ticket?", ["Can|buy", "Could|buy"], 2),
                    ("fill", "d05", "They ________ with us.", ["may not agree"], 1),
                    ("fill", "d06", "You ________ my dictionary.", ["can borrow"], 1),
                    ("fill", "d07", "________ I ________ your computer?", ["May|use", "Can|use"], 2),
                ],
            ),
        },
        m4,
    )
    wb_unit(
        4,
        2,
        "24",
        "must/have to/should · POINT 7·8 (WB p. 24)",
        {
            "A": (
                "POINT 7",
                "have to/has to로 완성하세요.",
                WR,
                "words",
                labels_az("A", 6),
                [
                    ("fill", "a01", "Eric ________ his grandmother this weekend.", "has to visit"),
                    ("fill", "a02", "We ________ quiet in the library.", "have to be"),
                    ("fill", "a03", "You ________ your password.", "have to remember"),
                    ("fill", "a04", "He ________ it to the lost-and-found.", "has to bring"),
                    ("fill", "a05", "Nami ________ a test next week.", "has to take"),
                    ("fill", "a06", "We ________ our promises.", "have to keep"),
                ],
            ),
            "B": (
                "POINT 8",
                "should / shouldn't",
                WR,
                "words",
                labels_az("B", 6),
                [
                    ("fill", "b01", "You ________ to your parents.", "should listen"),
                    ("fill", "b02", "You ________ water.", "should not waste"),
                    ("fill", "b03", "We ________ him.", "should help"),
                    ("fill", "b04", "You ________ lies.", "should not tell"),
                    ("fill", "b05", "You ________ too much candy.", "should not eat"),
                    ("fill", "b06", "You ________ your teeth.", "should brush"),
                ],
            ),
            "C": (
                "POINT 7·8",
                "must / have to / should / don't have to",
                WR,
                "words",
                labels_az("C", 9),
                [
                    ("fill", "c01", "Morris ________ go to the bookstore.", "doesn't have to go"),
                    ("fill", "c02", "Sarah ________ anything tonight.", "must not eat"),
                    ("fill", "c03", "You ________ the first bus.", "have to catch"),
                    ("fill", "c04", "He ________ an umbrella.", "doesn't have to bring"),
                    ("fill", "c05", "You ________ back by 10.", "have to be"),
                    ("fill", "c06", "She ________ traffic rules.", "must obey"),
                    ("fill", "c07", "Jane ________ with her sister.", "shouldn't fight"),
                    ("fill", "c08", "We ________ careful on busy streets.", "have to be"),
                    ("fill", "c09", "Peter ________ his room every day.", "has to clean"),
                ],
            ),
            "D": (
                "POINT 7·8",
                "문장을 완성하세요.",
                WR,
                "words",
                labels_az("D", 8),
                [
                    ("fill", "d01", "He ________ his anger.", "has to control"),
                    ("fill", "d02", "You ________ for help.", "should ask"),
                    ("fill", "d03", "She ________ the report today.", "doesn't have to finish"),
                    ("fill", "d04", "You ________ honest.", "must be"),
                    ("fill", "d05", "You ________ in class.", "should not eat"),
                    ("fill", "d06", "You ________ the truth.", "must tell"),
                    ("fill", "d07", "He ________ his little sister.", "has to take care of"),
                    ("fill", "d08", "You ________ pets here.", "must not bring"),
                ],
            ),
        },
        m4,
    )
    secs = [
        section("1-6", "[1–6]", "[1–6] MC", MC, "choice", labels_num(6)),
        section("7-12", "[7–12]", "[7–12] MC", MC, "choice", labels_num(6, 7)),
        section("13", "[13]", "[13] should/shouldn't x3", WR2, "words", ["13"]),
        section("14", "[14]", "[14] matching a b c", WR2, "words", ["14"]),
        section("15", "[15]", "[15] shouldn't x2", SENT, "sentence", ["15"]),
        section("16", "[16]", "[16] MC", MC, "choice", ["16"]),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", choices=["play the piano", "speak French", "ride a horse", "run fast", "bake cookies"], answer_index=2),
        mc_item(iid="q02", sec=secs[0], label="2", choices=["do homework", "go to hospital", "watch TV", "sleep", "play games"], answer_index=1),
        mc_item(iid="q03", sec=secs[0], label="3", choices=["May picnic", "Must picnic", "Can picnic"], answer_index=1),
        mc_item(iid="q04", sec=secs[0], label="4", choices=["May I use", "Must I use", "Can I use your computer"], answer_index=3),
        mc_item(iid="q05", sec=secs[0], label="5", choices=["must not park", "can't park", "don't park"], answer_index=1),
        mc_item(iid="q06", sec=secs[0], label="6", choices=["may snow", "must snow", "can snow"], answer_index=1),
        mc_item(iid="q07", sec=secs[1], label="7", choices=["have to study", "has to study"], answer_index=1),
        mc_item(iid="q08", sec=secs[1], label="8", choices=["must not park", "can't park"], answer_index=2),
        mc_item(iid="q09", sec=secs[1], label="9", choices=["Does play flute", "Do play flute"], answer_index=1),
        mc_item(iid="q10", sec=secs[1], label="10", choices=["don't have to", "doesn't have to"], answer_index=1),
        mc_item(iid="q11", sec=secs[1], label="11", choices=["must not tell", "must not to tell"], answer_index=1),
        mc_item(iid="q12", sec=secs[1], label="12", choices=["cannot walk", "can walk"], answer_index=1),
        fill_item(iid="q13", sec=secs[2], label="13", prompt_en="(1) be polite (2) fight (3) run in hall", accept=["should|shouldn't|shouldn't", "should|should not|shouldn't"], blanks=3),
        fill_item(iid="q14", sec=secs[3], label="14", prompt_en="Match: ⓐ understand English ⓑ Can Mandy bake ⓒ ...", accept=["b|I can understand English|c|Can Mandy bake"], blanks=4),
        sent_item(iid="q15", sec=secs[4], label="15", prompt_en="Bus rules: no noise / no kicking seats", accept=["You shouldn't make noise.", "You shouldn't kick the seat."]),
        mc_item(iid="q16", sec=secs[5], label="16", choices=["May I use", "Must I use", "Should I use the restroom"], answer_index=1),
    ]
    save(
        4,
        "wb-c04-test.json",
        build_practice(
            practice_id="cm1:wb-c04:test",
            title="WB Chapter Test",
            subtitle="Chapter 04 (WB p. 26)",
            pages="26",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c04-test",
            **m4,
        ),
    )
    print("wb ch03-04 done")


if __name__ == "__main__":
    gen_ch02_wb_rest()
    gen_ch03()
    gen_ch04()
    gen_wb_03_04()

