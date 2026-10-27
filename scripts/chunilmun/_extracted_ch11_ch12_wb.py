#!/usr/bin/env python3
"""Scan-extracted workbook data for Ch11–Ch12 — 천일문 Grammar 1 (uploads/ch11-12-wb.pdf)."""
from __future__ import annotations

import itertools
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
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
    section,
    sent_item,
    wb,
)


def _ox(sec, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _write_docs(data: dict[str, dict], *, chapter: int) -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "..", "data", "chunilmun1")
    for name, doc in data.items():
        path = os.path.join(root, f"chapter{chapter:02d}", name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")


def build_ch11_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(11, "전치사")

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 전치사를 at, on, in 중에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 9),
        "POINT 1",
    )
    u1a = [
        ("Everyone should wear a seat belt ________ the car.", ["in"]),
        ("Turn right ________ the next corner.", ["at"]),
        ("Her office is ________ the 2nd floor.", ["on"]),
        ("He waited for her ________ the bus stop.", ["at"]),
        ("My uncle lived ________ Japan a long time ago.", ["in"]),
        ("They are sitting ________ the bench.", ["on"]),
        ("My dog has black spots ________ his back.", ["on"]),
        ("How many students are there ________ your class?", ["in"]),
        ("A plane is landing ________ the airport.", ["at"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1a, 1)]
    out["wb-c11-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c11:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="전치사 · POINT 1 (WB p. 84)",
        pages="84",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "그림과 일치하도록 빈칸에 알맞은 전치사를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("B", 6),
        "POINT 2",
    )
    u1b = [
        ("Some birds are flying ________ the tree.", ["above"], "under, around, over"),
        ("A boy is reading a book ________ the tree.", ["under"], "under, around, over"),
        ("A dog is running ________ the tree.", ["around"], "under, around, over"),
        ("The cafe is ________ the hospital and the bank.", ["between"], "by, between, in front of"),
        ("The hospital is ________ the cafe.", ["by"], "by, between, in front of"),
        ("A girl is standing ________ the bank.", ["in front of"], "by, between, in front of"),
    ]
    items = [
        fill_item(
            iid=f"b{i:02d}",
            sec=sec,
            label=f"B{i}",
            prompt_en=f"<보기> {bank}\n{p}",
            accept=a,
        )
        for i, (p, a, bank) in enumerate(u1b, 1)
    ]
    out["wb-c11-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c11:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="전치사 · POINT 2 (WB p. 84)",
        pages="84",
        timer_minutes=20,
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
        labels_az("C", 5),
        "POINT 1-2",
    )
    u1c = [
        ("(at, by)\nHe sat down ________ me.\nLet's meet ________ the front gate at 9.", ["by", "at"], 2),
        ("(in, behind)\nWhat's that ________ the curtain?\nI have some money ________ my pocket.", ["behind", "in"], 2),
        ("(on, under)\nThe boys are singing ________ the stage.\nA boat is passing ________ the bridge.", ["on", "under"], 2),
        ("(in, out of)\nMom, you're the best ________ the world!\nThey got ________ the burning house.", ["in", "out of"], 2),
        ("(at, across)\nPaul is saying goodbye ________ the door.\nThe girls are swimming ________ the river.", ["at", "across"], 2),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1c, 1)
    ]
    out["wb-c11-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c11:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="전치사 · POINT 1-2 (WB p. 85)",
        pages="85",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어와 알맞은 전치사를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 6),
        "POINT 1-2",
    )
    u1d = [
        ("우유를 냉장고 안에 넣어라. (the refrigerator)\n→ Put the milk ________________________________.", ["Put the milk in the refrigerator.", "in the refrigerator"]),
        (
            "택시 한 대가 우리 집 앞에서 멈췄다. (my house)\n→ A taxi stopped ________________________________.",
            ["A taxi stopped in front of my house.", "in front of my house"],
        ),
        (
            "그 다리는 강 위를 가로지른다. (a river)\n→ The bridge crosses ________________________________.",
            ["The bridge crosses over a river.", "over a river"],
        ),
        (
            "교회가 언덕 위에 있다. (the hill)\n→ There is a church ________________________________.",
            ["There is a church on the hill.", "on the hill"],
        ),
        (
            "갑자기 한 남자가 방 안으로 뛰어 들어왔다. (the room)\n→ Suddenly a man ran ________________________________.",
            ["Suddenly a man ran into the room.", "into the room"],
        ),
        (
            "많은 사람들이 그 호수를 따라서 자전거를 탄다. (the lake)\n→ Many people ride bicycles ________________________________.",
            ["Many people ride bicycles along the lake.", "along the lake"],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c11-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c11:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="전치사 · POINT 1-2 (WB p. 85)",
        pages="85",
        timer_minutes=24,
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
        labels_az("A", 9),
        "POINT 3",
    )
    u2a = [
        ("He was born ________ January 8th.", ["on"]),
        ("Farmers are very busy ________ fall.", ["in"]),
        ("I will meet Susan ________ 12 o'clock.", ["at"]),
        ("They will visit Korea ________ August.", ["in"]),
        ("Jake moved to Incheon ________ 2013.", ["in"]),
        ("She should go to a dentist ________ Tuesday.", ["on"]),
        ("I have to get up ________ 6:30 a.m. tomorrow.", ["at"]),
        ("The restaurant has many people ________ lunchtime.", ["at"]),
        ("Grace and Teddy go to the beach ________ Sundays.", ["on"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2a, 1)]
    out["wb-c11-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c11:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="전치사 · POINT 3 (WB p. 86)",
        pages="86",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 부분을 바르게 고치세요.",
        WR,
        "words",
        labels_az("B", 10),
        "POINT 3",
    )
    u2b = [
        ("We will move to another city <u>at</u> April 20th.", ["on"]),
        ("The Korean War broke out <u>on</u> 1950.", ["in"]),
        ("All my classes ended <u>in</u> 3 p.m.", ["at"]),
        ("Don't make noise <u>on</u> night.", ["at"]),
        ("I usually take a walk <u>at</u> the morning.", ["in"]),
        ("My father doesn't work <u>in</u> Mondays.", ["on"]),
        ("Ice cream is popular for dessert <u>at</u> summer.", ["in"]),
        ("Does the store open <u>in</u> New Year's Day?", ["on"]),
        ("My watch stopped <u>on</u> 3:34.", ["at"]),
        ("The news starts <u>in</u> noon every day.", ["at"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["wb-c11-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c11:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="전치사 · POINT 3 (WB p. 86)",
        pages="86",
        timer_minutes=24,
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
        labels_az("C", 3),
        "POINT 4",
    )
    u2c = [
        ("(before, after)\nWe need to pack our bags ________ the trip.\nThe roads were wet ________ heavy rain.", ["before", "after"], 2),
        ("(during, for)\nHold your breath ________ fifteen seconds.\nJames wants to stay home ________ the vacation.", ["for", "during"], 2),
        ("(until, by)\nPlease call me ________ 3 o'clock.\nI have classes at school ________ 4 o'clock.", ["by", "until"], 2),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2c, 1)
    ]
    out["wb-c11-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c11:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="전치사 · POINT 4 (WB p. 87)",
        pages="87",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어와 알맞은 전치사를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 6),
        "POINT 4",
    )
    u2d = [
        ("그녀는 내일까지 집에 없을 것이다. (tomorrow)\n→ She will not be at home ________________________________.", ["until tomorrow"]),
        ("그는 경기 중에 옐로카드를 받았다. (the game)\n→ He received a yellow card ________________________________.", ["during the game"]),
        ("Tony는 아침 식사 후에 설거지를 했다. (breakfast)\n→ Tony washed the dishes ________________________________.", ["after breakfast"]),
        ("그 영화는 두 시간 동안 상영된다. (two hours)\n→ The movie runs ________________________________.", ["for two hours"]),
        (
            "너는 주말 전에 도서관에 책들을 반납해야 한다. (the weekend)\n→ You should return the books to the library ________________________________.",
            ["before the weekend"],
        ),
        (
            "너는 11시까지는 네 일을 끝낼 수 있니? (11 o'clock)\n→ Can you finish your work ________________________________?",
            ["by 11 o'clock", "by eleven o'clock"],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c11-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c11:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="전치사 · POINT 4 (WB p. 87)",
        pages="87",
        timer_minutes=24,
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
        labels_az("A", 8),
        "POINT 5",
        word_bank=["by", "like", "from", "about", "for", "to", "with", "through"],
    )
    u3a = [
        ("I wrote an essay ________ global warming.", ["about"]),
        ("You can reserve the tickets ________ phone.", ["by"]),
        ("My house is not far ________ here.", ["from"]),
        ("We want small pets ________ hamsters.", ["like"]),
        ("I went to the amusement park ________ my friends.", ["with"]),
        ("Many young people died ________ their country in the past.", ["for"]),
        ("Would you show your ticket ________ me?", ["to"]),
        ("She looked out ________ the window.", ["through"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3a, 1)]
    out["wb-c11-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c11:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="전치사 · POINT 5 (WB p. 88)",
        pages="88",
        timer_minutes=22,
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
        word_bank=["by", "with", "to", "through"],
    )
    u3b = [
        (
            "Turn ________ the right at the first corner.\nMr. Lee taught Taekwondo ________ the foreign students.",
            ["to", "to"],
            2,
        ),
        (
            "They know the actor ________ TV.\nThe horses ran ________ the forest.",
            ["on", "through"],
            2,
        ),
        (
            "He cut the steak ________ a knife.\nShe prepared for dinner ________ her sister.",
            ["with", "with"],
            2,
        ),
        (
            "You can go there ________ bus or on foot.\nYou should pay back the money ________ October 31.",
            ["by", "by"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3b, 1)
    ]
    out["wb-c11-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c11:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="전치사 · POINT 5 (WB p. 88)",
        pages="88",
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
        labels_az("C", 9),
        "POINT 6",
    )
    u3c = [
        ("My brother is good <u>for</u> soccer.", False, "at"),
        ("The glass is full <u>with</u> water.", False, "of"),
        ("Our table manners are different <u>with</u> yours.", False, "from"),
        ("Emma and I studied together <u>from</u> 2 to 5.", True, ""),
        ("This weekend we'll go <u>to</u> a trip.", False, "on"),
        ("My mother was pleased <u>for</u> the news.", False, "with"),
        ("France is famous <u>for</u> its wine.", True, ""),
        ("The movie turned a poor boy <u>for</u> a star.", False, "into"),
        ("Thanks <u>for</u> you, the event ended successfully.", False, "to"),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3c, 1)]
    out["wb-c11-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c11:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="전치사 · POINT 6 (WB p. 89)",
        pages="89",
        timer_minutes=24,
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
        labels_az("D", 8),
        "POINT 6",
    )
    u3d = [
        (
            "미국식 영어는 영국식 영어와 다르다. (British English, different)\n→ American English ________________________________.",
            ["American English is different from British English.", "is different from British English"],
        ),
        (
            "Daisy는 동물에 흥미가 있다. (animals, interested)\n→ Daisy ________________________________.",
            ["Daisy is interested in animals."],
        ),
        (
            "그의 주머니는 동전들로 가득했다. (coins, full)\n→ His pocket ________________________________.",
            ["His pocket was full of coins.", "was full of coins"],
        ),
        (
            "그 예술가는 오래된 집을 박물관으로 바꿨다. (the old house, turn, a museum)\n→ The artist ________________________________.",
            ["The artist turned the old house into a museum."],
        ),
        (
            "내 여동생은 춤을 잘 춘다. (dancing, good)\n→ My sister ________________________________.",
            ["My sister is good at dancing."],
        ),
        (
            "Kevin은 크리스마스 선물에 기뻐했다. (the Christmas present, happy)\n→ Kevin ________________________________.",
            ["Kevin was happy with the Christmas present.", "was happy with the Christmas present"],
        ),
        (
            "이집트는 피라미드로 유명하다. (the pyramids, famous)\n→ Egypt ________________________________.",
            ["Egypt is famous for the pyramids.", "is famous for the pyramids"],
        ),
        (
            "나는 월요일부터 금요일까지 일한다. (Monday, from, Friday)\n→ I work ________________________________.",
            ["I work from Monday to Friday.", "from Monday to Friday"],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3d, 1)]
    out["wb-c11-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c11:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="전치사 · POINT 6 (WB p. 89)",
        pages="89",
        timer_minutes=26,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch11_wb_test(m))
    return out


def _build_ch11_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1-3", "[1–3]", "[1–3] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(3)),
        section("4", "[4]", "[4] 다음 그림을 보고 <보기>와 같이 빈칸에 알맞은 전치사를 쓰세요.", WR2, "words", ["4"]),
        section("5", "[5]", "[5] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.", MC, "choice", ["5"]),
        section("6", "[6]", "[6] 다음 문장의 각 빈칸에 들어갈 알맞은 전치사가 순서대로 짝지어진 것을 고르세요.", MC, "choice", ["6"]),
        section(
            "7",
            "[7]",
            "[7] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 두 개 고르세요.",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요.",
            "words",
            ["7"],
        ),
        section("8", "[8]", "[8] 다음 빈칸에 in을 쓸 수 없는 것을 고르세요.", MC, "choice", ["8"]),
        section("9-11", "[9–11]", "[9–11] 우리말과 일치하도록 주어진 단어와 알맞은 전치사를 사용하여 문장을 완성하세요.", SENT, "sentence", labels_num(3, 9)),
        section("12", "[12]", "[12] 다음 중 (A)~(E)에 들어갈 말로 알맞지 않은 것을 고르세요.", MC, "choice", ["12"]),
        section("13-14", "[13–14]", "[13–14] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 13)),
        section("15-16", "[15–16]", "[15–16] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", labels_num(2, 15)),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="We can see many wild animals ________ Africa.\nI waited for him ________ front of his house.",
            choices=["to", "in", "at", "on", "over"],
            answer_index=2,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="They took a rest ________ the bench.\nWe'll open the store ________ July 22.",
            choices=["in", "at", "on", "for", "till"],
            answer_index=3,
        ),
        mc_item(
            iid="q03",
            sec=secs[0],
            label="3",
            prompt_en="Susan cut the paper ________ scissors.\nWe were pleased ________ the results.",
            choices=["to", "with", "by", "for", "from"],
            answer_index=2,
        ),
        fill_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en=(
                "<보기> A cat is next to the sofa.\n"
                "(1) A ball is ________ the table.\n"
                "(2) A lamp is ________ the table.\n"
                "(3) A sofa is ________ the table and the cat."
            ),
            accept=["under|on|between", "under|on|beside"],
            blanks=3,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="There is a big tree ________ my house.",
            choices=["behind", "between", "beside", "next to", "in front of"],
            answer_index=2,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="My family gathered ________ the living room and watched TV ________ night.",
            choices=["at — in", "at — on", "in — at", "in — on", "on — at"],
            answer_index=3,
        ),
        choose_all_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en=(
                "① Please wait <u>at</u> the entrance.\n"
                "② Birds are singing <u>in</u> a branch.\n"
                "③ I found your key <u>at</u> the drawer.\n"
                "④ There are a lot of cars <u>on</u> the road.\n"
                "⑤ I spent five years <u>on</u> the small town."
            ),
            accept_pairs=[("1", "4")],
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            choices=[
                "It's very warm ________ May.",
                "I couldn't see anyone ________ the house.",
                "We don't open the shop ________ Sundays.",
                "People can see some palaces ________ Seoul.",
                "You can see cherry blossoms ________ spring.",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q09",
            sec=secs[6],
            label="9",
            prompt_en="책상을 침대와 TV 사이로 옮겨라.\n(the bed, the TV, and, the desk)\n→ Move ________________________________.",
            accept=["Move the desk between the bed and the TV.", "the desk between the bed and the TV"],
        ),
        sent_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en="우리 가족은 여기서 3년 동안 살았었다.\n(lived, here, three years)\n→ My family ________________________________.",
            accept=["My family lived here for three years.", "lived here for three years"],
        ),
        sent_item(
            iid="q11",
            sec=secs[6],
            label="11",
            prompt_en="그 부부는 그들의 결혼식 후에 하와이로 여행을 갔다.\n(went, a trip, Hawaii, their wedding)\n→ The couple ________________________________.",
            accept=["The couple went on a trip to Hawaii after their wedding.", "went on a trip to Hawaii after their wedding"],
        ),
        mc_item(
            iid="q12",
            sec=secs[7],
            label="12",
            prompt_en=(
                "A: What time do you get up (A) the morning?\n"
                "B: I usually get up (B) 7:30.\n"
                "A: You are different (C) me. I always sleep late and get up at 10.\n"
                "B: What do you do (D) dinner?\n"
                "A: I practice tennis. I'm interested (E) sports these days."
            ),
            choices=["(A) on", "(B) at", "(C) from", "(D) after", "(E) in"],
            answer_index=1,
        ),
        mc_item(
            iid="q13",
            sec=secs[8],
            label="13",
            prompt_en="I couldn't hear their conversation (A) the wall.\nJeju-do is famous (B) its beautiful nature.",
            choices=["with — for", "through — for", "with — on", "through — on", "through — at"],
            answer_index=2,
        ),
        mc_item(
            iid="q14",
            sec=secs[8],
            label="14",
            prompt_en="Will you go to the mall (A) me?\nThanks (B) the Internet, we can learn more about the world.",
            choices=["with — about", "to — for", "with — for", "to — to", "with — to"],
            answer_index=5,
        ),
        mc_item(
            iid="q15",
            sec=secs[9],
            label="15",
            choices=[
                "Don't talk to me anymore.",
                "I went to the airport with taxi.",
                "This chair is for young children.",
                "My brother is good at baseball.",
                "Ray dances from morning to evening.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q16",
            sec=secs[9],
            label="16",
            choices=[
                "This book is about wild flowers.",
                "My grandfather walks with a stick.",
                "I'm not happy with my test score.",
                "The machine can turn milk into yogurt.",
                "My opinion is different for yours.",
            ],
            answer_index=5,
        ),
    ]
    return {
        "wb-c11-test.json": build_practice(
            practice_id="cm1:wb-c11:test",
            title="WB Chapter Test",
            subtitle="Chapter 11 (WB p. 90–91)",
            pages="90–91",
            timer_minutes=30,
            sections=secs,
            items=items,
            test_id="wb-c11-test",
            **m,
        )
    }


def build_ch12_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(12, "접속사")

    sec = section(
        "A",
        "Section A",
        "빈칸에 알맞은 접속사를 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 8),
        "POINT 1",
        word_bank=["and", "but", "or"],
    )
    u1a = [
        ("I visited Malaysia ________ Thailand last winter vacation.", ["and"]),
        ("He remembered me, ________ I didn't remember him.", ["but"]),
        ("I don't agree with you, ________ I respect your idea.", ["but"]),
        ("Which will you drink, apple juice ________ grape juice?", ["or"]),
        ("The restaurant had great food, ________ the service was slow.", ["but"]),
        ("My name is Amanda, ________ I live in Finland.", ["and"]),
        ("Do you want to go there by bus ________ by subway?", ["or"]),
        ("They went to the market ________ had dinner after that.", ["and"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1a, 1)]
    out["wb-c12-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c12:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="접속사 · POINT 1 (WB p. 92)",
        pages="92",
        timer_minutes=20,
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
        labels_az("B", 8),
        "POINT 1",
    )
    u1b = [
        (
            "The movie was sad, ________________________________.\n<보기> and I'm good at it / and gave them to her neighbors / but he didn't cry / or that one",
            ["The movie was sad, but he didn't cry.", "but he didn't cry"],
        ),
        (
            "Which bag is yours, this one ________________________________?",
            ["Which bag is yours, this one or that one?", "or that one"],
        ),
        (
            "I like drawing pictures, ________________________________.",
            ["I like drawing pictures, and I'm good at it.", "and I'm good at it"],
        ),
        (
            "Mary made some cookies ________________________________.",
            ["Mary made some cookies and gave them to her neighbors.", "and gave them to her neighbors"],
        ),
        (
            "He saved money, ________________________________.\n<보기> and he bought a guitar / but his sister doesn't like it / but the wind was cool / or his bedroom",
            ["He saved money, and he bought a guitar.", "and he bought a guitar"],
        ),
        (
            "The weather was hot, ________________________________.",
            ["The weather was hot, but the wind was cool.", "but the wind was cool"],
        ),
        (
            "Jinho may be in the living room ________________________________.",
            ["Jinho may be in the living room or his bedroom.", "or his bedroom"],
        ),
        (
            "Frank likes science, ________________________________.",
            ["Frank likes science, but his sister doesn't like it.", "but his sister doesn't like it"],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["wb-c12-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c12:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="접속사 · POINT 1 (WB p. 92)",
        pages="92",
        timer_minutes=24,
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
        labels_az("C", 9),
        "POINT 2",
    )
    u1c = [
        ("Today's weather is cold and <u>wind</u>.", False, "windy"),
        ("Let's go to the festival and <u>having</u> fun.", False, "have"),
        ("Do you want to go shopping or <u>taking</u> a walk?", False, "take"),
        ("Should I fix it or <u>to buy</u> a new one?", False, "buy"),
        ("Kate likes watching TV and <u>listening</u> to music.", True, ""),
        ("The new car runs fast but <u>quiet</u>.", False, "quietly"),
        ("We will go to the movies or <u>going</u> on a picnic.", False, "go"),
        ("Peter is intelligent but <u>laziness</u>.", False, "lazy"),
        ("Yuri took some pictures and <u>sent</u> them to her friend.", True, ""),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1c, 1)]
    out["wb-c12-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c12:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="접속사 · POINT 2 (WB p. 93)",
        pages="93",
        timer_minutes=24,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어와 알맞은 접속사를 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 7),
        "POINT 1-2",
    )
    u1d = [
        (
            "이 검은 운동화는 낡았지만 편안하다. (comfortable, old)\n→ These black sneakers are ________________________________.",
            ["These black sneakers are old but comfortable.", "old but comfortable"],
        ),
        (
            "너는 외식할 거니 아니면 집에서 먹을 거니? (at home, eat out, eat)\n→ Will you ________________________________?",
            ["Will you eat out or eat at home?", "eat out or eat at home"],
        ),
        (
            "Simon은 TV를 끄고 자러 갔다. (the TV, go to bed, turn off)\n→ Simon ________________________________.",
            ["Simon turned off the TV and went to bed."],
        ),
        (
            "그 수프는 약간 차가웠지만 매우 맛있었다. (cold, delicious, a little, very)\n→ The soup was ________________________________.",
            ["The soup was a little cold but very delicious.", "a little cold but very delicious"],
        ),
        (
            "John은 자신의 가족들과 친구들을 위해 요리하는 것을 좋아한다. (family, friends)\n→ John likes cooking for his ________________________________.",
            ["John likes cooking for his family and friends.", "family and friends"],
        ),
        (
            "나에게 전화하거나 문자를 보내 줄래? (send, call me, a text message)\n→ Will you ________________________________?",
            ["Will you call me or send me a text message?", "call me or send me a text message"],
        ),
        (
            "우리는 공원에 가서 자전거를 탔다. (ride, go, bicycles, to the park)\n→ We ________________________________.",
            ["We went to the park and rode bicycles.", "went to the park and rode bicycles"],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c12-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c12:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="접속사 · POINT 1-2 (WB p. 93)",
        pages="93",
        timer_minutes=26,
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
        {"left": "Vicky was only 5 years old", "right": "when she first wrote a song."},
        {"left": "I didn't bring my umbrella,", "right": "so I'm all wet now."},
        {"left": "The meeting will start", "right": "after everyone arrives."},
        {"left": "The girl was absent", "right": "because she was ill."},
        {"left": "Take this medicine", "right": "when you have a headache."},
        {"left": "They didn't eat the soup", "right": "because it was too salty."},
        {"left": "Turn on the power", "right": "before you use the machine."},
        {"left": "The alarm will ring", "right": "if there's a fire."},
    ]
    items = [match_item(iid="a01", sec=sec, label="A1", pairs=pairs, prompt_ko="1–8와 ⓐ–ⓗ 연결")]
    out["wb-c12-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c12:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="접속사 · POINT 3 (WB p. 94)",
        pages="94",
        timer_minutes=20,
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
        labels_az("B", 5),
        "POINT 4",
    )
    u2b = [
        (
            "<보기> He can help you. + I think it.\n→ I think that he can help you.\n\nThe story is true. + I know it.\n→ I know ________________________________.",
            ["I know that the story is true."],
        ),
        (
            "She likes my present. + I hope it.\n→ I hope ________________________________.",
            ["I hope that she likes my present."],
        ),
        (
            "Robert can be a great chef. + They believe it.\n→ They believe ________________________________.",
            ["They believe that Robert can be a great chef."],
        ),
        (
            "He is a genius. + Some people say it.\n→ Some people say ________________________________.",
            ["Some people say that he is a genius."],
        ),
        (
            "The grammar test was very difficult. + Suji thinks it.\n→ Suji thinks ________________________________.",
            ["Suji thinks that the grammar test was very difficult."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["wb-c12-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c12:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="접속사 · POINT 4 (WB p. 94)",
        pages="94",
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
            "너는 졸업한 후에 무엇을 할 거니? (graduate)\n→ What are you going to do ________________________________?",
            ["What are you going to do after you graduate?", "after you graduate"],
        ),
        (
            "만약 네가 마라톤을 완주한다면, 너는 메달을 받을 거야. (the marathon, complete)\n→ ________________________________, you will get a medal.",
            ["If you complete the marathon", "If you complete the marathon, you will get a medal."],
        ),
        (
            "그들은 팀워크가 그 경기에서 중요하다는 것을 안다. (important, teamwork, be)\n→ They know ________________________________ in the game.",
            ["They know that teamwork is important", "that teamwork is important"],
        ),
        (
            "내가 오늘 아침에 전화했을 때 너는 어디에 있었니? (this morning, call)\n→ Where were you ________________________________?",
            ["Where were you when I called this morning?", "when I called this morning"],
        ),
        (
            "우리 형은 독감에 걸렸기 때문에 출근할 수 없었다. (have, a bad cold)\n→ My brother couldn't go to work ________________________________.",
            ["My brother couldn't go to work because he had a bad cold.", "because he had a bad cold"],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["wb-c12-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c12:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="접속사 · POINT 3-4 (WB p. 95)",
        pages="95",
        timer_minutes=24,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "주어진 접속사를 사용하여 두 문장을 연결하세요.",
        SENT,
        "sentence",
        labels_az("D", 8),
        "POINT 3-4",
    )
    u2d = [
        (
            "We took a rest. We came down the mountain. (before)\n→ We took a rest ________________________________.",
            ["We took a rest before we came down the mountain."],
        ),
        (
            "You try hard. Your dream will come true. (if)\n→ ________________________________, your dream will come true.",
            ["If you try hard", "If you try hard, your dream will come true."],
        ),
        (
            "My parents got angry. I fought with my brother. (when)\n→ My parents got angry ________________________________.",
            ["My parents got angry when I fought with my brother."],
        ),
        (
            "This restaurant is popular. The food isn't expensive. (because)\n→ This restaurant is popular ________________________________.",
            ["This restaurant is popular because the food isn't expensive."],
        ),
        (
            "The speech is over. You can go out. (after)\n→ ________________________________, you can go out.",
            ["After the speech is over", "After the speech is over, you can go out."],
        ),
        (
            "Philip will win the first prize. I think it. (that)\n→ I think ________________________________.",
            ["I think that Philip will win the first prize."],
        ),
        (
            "I will call you. I get on the train. (when)\n→ I will call you ________________________________.",
            ["I will call you when I get on the train."],
        ),
        (
            "They were so happy. They won the game. (because)\n→ They were so happy ________________________________.",
            ["They were so happy because they won the game."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c12-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c12:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="접속사 · POINT 3-4 (WB p. 95)",
        pages="95",
        timer_minutes=26,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch12_wb_test(m))
    return out


def _build_ch12_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1-2", "[1–2]", "[1–2] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2)),
        section("3", "[3]", "[3] 주어진 두 문장을 한 문장으로 바꿀 때, 빈칸에 알맞은 말을 쓰세요.", WR, "words", ["3"]),
        section("4-5", "[4–5]", "[4–5] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 4)),
        section("6", "[6]", "[6] 두 문장의 의미가 일치하도록 빈칸에 알맞은 말을 쓰세요.", WR, "words", ["6"]),
        section(
            "7",
            "[7]",
            "[7] 다음 중 어법상 알맞은 문장을 모두 고르세요.",
            "알맞은 보기 번호를 모두 골라 빈칸에 쓰세요.",
            "words",
            ["7"],
        ),
        section("8", "[8]", "[8] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 문맥상 어색한 문장을 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", ["10"]),
        section("11", "[11]", "[11] 주어진 두 문장을 because를 사용하여 한 문장으로 다시 쓰세요.", SENT, "sentence", ["11"]),
        section("12-13", "[12–13]", "[12–13] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(2, 12)),
        section("14", "[14]", "[14] 그림을 보고 <조건>에 맞게 문장을 완성하세요.", WR2, "words", ["14"]),
        section("15", "[15]", "[15] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 같은 것을 고르세요.", MC, "choice", ["15"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="They collected many old things like books, clothes, ________ toys.",
            choices=["and", "but", "before", "if", "because"],
            answer_index=1,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="Will you stay with us or ________ home now?",
            choices=["going", "went", "to go", "go", "goes"],
            answer_index=4,
        ),
        fill_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="I asked some questions of Jake. He didn't answer them.\n→ I asked some questions of Jake, ________ he didn't answer them.",
            accept=["but"],
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            prompt_en="Eric is handsome ________ kind.\nAmy ________ I are good friends.",
            choices=["but", "and", "or", "when", "because"],
            answer_index=2,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="________ is your birthday?\n________ I was little, I had curly hair.",
            choices=["If", "After", "When", "That", "Because"],
            answer_index=3,
        ),
        fill_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="The train left and then we got to the station.\n= We got to the station ________ the train left.",
            accept=["after"],
        ),
        fill_item(
            iid="q07",
            sec=secs[4],
            label="7",
            prompt_en=(
                "① Mira likes singing and dance.\n"
                "② The street was clean and quiet.\n"
                "③ He was fast or couldn't catch the ball.\n"
                "④ She painted the house red and yellow.\n"
                "⑤ Do you want to play soccer or read a novel?"
            ),
            accept=["|".join(p) for p in itertools.permutations(["2", "4", "5"], 3)],
            blanks=3,
            unordered=True,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            prompt_en=(
                "On Saturday, Mina cleans the living room. She washes the dishes (A) feeds the cat, too. "
                "(B) she doesn't clean the bathroom."
            ),
            choices=["but — Or", "and — But", "or — But", "and — Or", "or — And"],
            answer_index=2,
        ),
        mc_item(
            iid="q09",
            sec=secs[6],
            label="9",
            choices=[
                "It was cold so he wore a coat.",
                "I wash my face when I feel sleepy.",
                "She was sick when the game started.",
                "I drank warm milk before I woke up.",
                "We stopped watching TV because it was boring.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q10",
            sec=secs[7],
            label="10",
            choices=[
                "Please call me when you're free.",
                "If you don't buy that cap, I'll buy it.",
                "I lived in Daegu when I was a child.",
                "Emma drank water after she exercised.",
                "Nick missed the school bus because of he got up late.",
            ],
            answer_index=5,
        ),
        sent_item(
            iid="q11",
            sec=secs[8],
            label="11",
            prompt_en="My mom is always busy. She has lots of things to do.\n→ My mom ________________________________.",
            accept=["My mom is always busy because she has lots of things to do."],
        ),
        sent_item(
            iid="q12",
            sec=secs[9],
            label="12",
            prompt_en="우리는 그것이 거미라고 생각했다.\n(it / thought / we / that / a spider / was)\n→ ________________________________.",
            accept=["We thought that it was a spider.", "We thought it was a spider."],
        ),
        sent_item(
            iid="q13",
            sec=secs[9],
            label="13",
            prompt_en="그는 창문을 열었는데 더웠기 때문이다.\n(the window / was / because / it / opened / hot)\n→ He ________________________________.",
            accept=["He opened the window because it was hot."],
        ),
        fill_item(
            iid="q14",
            sec=secs[10],
            label="14",
            prompt_en=(
                "<조건> before나 after 포함; (breakfast, have) / (her, brush, teeth)\n"
                "(1) Suji jogs ________________________________.\n"
                "(2) Suji goes to school ________________________________."
            ),
            accept=[
                "before she has breakfast|after she brushes her teeth",
                "before she has breakfast|after brushing her teeth",
            ],
            blanks=2,
        ),
        mc_item(
            iid="q15",
            sec=secs[11],
            label="15",
            prompt_en="<보기> I didn't know <u>that</u> he was a painter.",
            choices=[
                "Do you believe <u>that</u> news?",
                "What is <u>that</u> box on the table?",
                "Daniel already bought <u>that</u> book.",
                "Which one is better, this or <u>that</u>?",
                "I hope <u>that</u> you will get better soon.",
            ],
            answer_index=5,
        ),
    ]
    return {
        "wb-c12-test.json": build_practice(
            practice_id="cm1:wb-c12:test",
            title="WB Chapter Test",
            subtitle="Chapter 12 (WB p. 96–97)",
            pages="96–97",
            timer_minutes=30,
            sections=secs,
            items=items,
            test_id="wb-c12-test",
            **m,
        )
    }


if __name__ == "__main__":
    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch11"):
        d11 = build_ch11_wb()
        _write_docs(d11, chapter=11)
        print(f"chapter 11 wb: wrote {len(d11)} files")
    if fn in ("all", "ch12"):
        d12 = build_ch12_wb()
        _write_docs(d12, chapter=12)
        print(f"chapter 12 wb: wrote {len(d12)} files")
