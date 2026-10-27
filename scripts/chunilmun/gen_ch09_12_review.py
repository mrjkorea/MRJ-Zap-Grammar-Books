#!/usr/bin/env python3
"""Ch09–12 SB/WB + review-02/03 for 천일문 Grammar 1."""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from practice_lib import (  # noqa: E402
    build_practice,
    choose_all_item,
    fill_item,
    labels_az,
    labels_num,
    match_item,
    mc_item,
    section,
    sent_item,
    write_practice,
)
from gen_all import CORR, MC, OX, SENT, WR, WR2, save, sb, wb  # noqa: E402
from gen_rest import wb_unit  # noqa: E402

# Footer pages (book); reviews use scan PDF page ranges from task brief.
PAGES = {
    9: {"sb_u": [96, 98, 100], "sb_test": 102, "wb_u": [62, 64, 66], "wb_test": 68},
    10: {"sb_u": [104, 106, 108], "sb_test": 110, "wb_u": [70, 72, 74], "wb_test": 76},
    11: {"sb_u": [112, 114, 116], "sb_test": 118, "wb_u": [78, 80, 82], "wb_test": 84},
    12: {"sb_u": [120, 122], "sb_test": 124, "wb_u": [86, 88], "wb_test": 90},
}


def _save_sb_section(ch: int, u: int, letter: str, page: int, topic: str, point: str, direction: str, rule: str, mode: str, labels: list[str], rows: list) -> None:
    m = sb(ch, topic)
    sec = section(letter, f"Section {letter}", direction, rule, mode, labels, point)
    items = []
    for i, row in enumerate(rows, 1):
        iid = f"{letter.lower()}{i:02d}"
        lab = labels[i - 1]
        if row[0] == "mc":
            _, prompt, choices, ans = row
            items.append(mc_item(iid=iid, sec=sec, label=lab, prompt_en=prompt, choices=choices, answer_index=ans))
        elif row[0] == "sent":
            _, prompt, acc = row
            items.append(sent_item(iid=iid, sec=sec, label=lab, prompt_en=prompt, accept=acc))
        elif row[0] == "match":
            _, pairs, pko = row
            items.append(match_item(iid=iid, sec=sec, label=lab, pairs=pairs, prompt_ko=pko))
        else:
            _, prompt, acc, *rest = row
            blanks = rest[0] if rest else 1
            bl = rest[1] if len(rest) > 1 else None
            items.append(
                fill_item(
                    iid=iid,
                    sec=sec,
                    label=lab,
                    prompt_en=prompt,
                    accept=acc if isinstance(acc, list) else [acc],
                    blanks=blanks,
                    blank_labels=bl,
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


def _wb_fill_rows(prefix: str, n: int, stem: str, word: str) -> list:
    return [("fill", f"{prefix}{i:02d}", f"{stem} ________.", word) for i in range(1, n + 1)]


def gen_ch09() -> None:
    ch, topic = 9, "문장의 여러 형식"
    pg = PAGES[ch]
    u1 = [
        ("fill", "Birds fly.", ["S+V", "1"], 1),
        ("fill", "Tom is a student.", ["S+V+C", "2"], 1),
        ("fill", "She bought a book.", ["S+V+O", "3"], 1),
        ("fill", "They elected him president.", ["S+V+O+C", "4"], 1),
        ("fill", "I gave her flowers.", ["S+V+IO+DO", "5"], 1),
        ("fill", "The weather is nice.", ["S+V+C", "2"], 1),
    ]
    for letter, rows in [("A", u1)]:
        _save_sb_section(ch, 1, letter, pg["sb_u"][0], topic, "POINT 1", "다음 문장의 형식(1~5형식)을 쓰세요.", WR, "words", labels_az("A", len(rows)), rows)

    u1b = [
        ("fill", "My brother ________ soccer well.", "plays"),
        ("fill", "The soup ________ delicious.", "smells"),
        ("fill", "We ________ them winners.", "made"),
        ("fill", "He ________ me a letter.", "sent"),
        ("fill", "They ________ happy.", "are"),
    ]
    _save_sb_section(ch, 1, "B", pg["sb_u"][0], topic, "POINT 1·2", "빈칸에 알맞은 말을 쓰세요.", WR, "words", labels_az("B", 5), u1b)

    match_pairs = [
        {"left": "She runs fast.", "right": "3형식"},
        {"left": "He is tall.", "right": "2형식"},
        {"left": "I feel tired.", "right": "2형식"},
        {"left": "They call me Tom.", "right": "4형식"},
        {"left": "Mom gave me a gift.", "right": "5형식"},
    ]
    sec_match = section(
        "C",
        "Section C",
        "문장과 형식을 짝지어 연결하세요.",
        "왼쪽 문장과 오른쪽 형식을 연결하세요.",
        "match",
        labels_az("C", 1),
        "POINT 2",
    )
    m = sb(ch, topic)
    save(
        ch,
        "c09-u1-C.json",
        build_practice(
            practice_id="cm1:c09:u1-C",
            title="Unit 1 Unit Exercise — Section C",
            subtitle=f"{topic} · POINT 2 (p. {pg['sb_u'][0]})",
            pages=str(pg["sb_u"][0]),
            timer_minutes=22,
            sections=[sec_match],
            items=[match_item(iid="c01", sec=sec_match, label="C1", pairs=match_pairs, prompt_ko="문장 A–E")],
            **m,
        ),
    )

    u2a = [
        ("fill", "The boy ________ the ball.", "kicked"),
        ("fill", "She ________ us the truth.", "told"),
        ("fill", "It ________ cold today.", "is"),
        ("fill", "We ________ him captain.", "made"),
        ("fill", "He ________ me a ride.", "gave"),
    ]
    _save_sb_section(ch, 2, "A", pg["sb_u"][1], topic, "POINT 3", "빈칸에 알맞은 동사를 쓰세요.", WR, "words", labels_az("A", 5), u2a)

    bank = ["is", "gave", "made", "runs", "sent", "are", "feel"]
    reorder_sec = section(
        "B",
        "Section B",
        "주어진 말을 순서대로 넣어 문장을 완성하세요.",
        "상자 안의 말을 순서대로 각 빈칸에 쓰세요. (문장 전체를 쓰지 마세요.)",
        "words",
        labels_az("B", 3),
        "POINT 3·4",
        word_bank=bank,
    )
    reorder_items = [
        fill_item(iid="b01", sec=reorder_sec, label="B1", prompt_en="She ________ ________ a present.", accept=["gave|me", "gave|us"], blanks=2),
        fill_item(iid="b02", sec=reorder_sec, label="B2", prompt_en="They ________ ________ happy.", accept=["are|very", "are|so"], blanks=2),
        fill_item(iid="b03", sec=reorder_sec, label="B3", prompt_en="He ________ ________ fast.", accept=["runs|very"], blanks=2),
    ]
    save(
        ch,
        "c09-u2-B.json",
        build_practice(
            practice_id="cm1:c09:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle=f"{topic} · POINT 3·4 (p. {pg['sb_u'][1]})",
            pages=str(pg["sb_u"][1]),
            timer_minutes=22,
            sections=[reorder_sec],
            items=reorder_items,
            **m,
        ),
    )

    u2c = [
        ("sent", "I / happy / am → sentence", ["I am happy."]),
        ("sent", "She / me / a book / gave → sentence", ["She gave me a book."]),
        ("sent", "They / students / are → sentence", ["They are students."]),
        ("sent", "We / him / made / monitor → sentence", ["We made him monitor.", "We made him class monitor."]),
    ]
    _save_sb_section(ch, 2, "C", pg["sb_u"][1], topic, "POINT 4", "주어진 말을 배열하여 문장을 쓰세요.", SENT, "sentence", labels_az("C", 4), u2c)

    u3a = [
        ("mc", "Which is 3rd form?", ["S+V", "S+V+O", "S+V+C", "S+V+O+O", "S+V+O+C"], 2),
        ("mc", "Which is 2nd form?", ["He runs.", "She is kind.", "I like dogs.", "They gave me money.", "We made him leader."], 2),
        ("mc", "Find 5th form.", ["I am fine.", "She sings well.", "He told me a story.", "They are here.", "It looks nice."], 3),
        ("mc", "Find 4th form.", ["We elected her class president.", "Birds fly.", "She is a nurse.", "I have a pen.", "He goes home."], 1),
        ("mc", "Which sentence is S+V+O?", ["She is tall.", "He runs fast.", "They are students.", "I feel good.", "Time flies."], 2),
    ]
    _save_sb_section(ch, 3, "A", pg["sb_u"][2], topic, "POINT 5", "알맞은 것을 고르세요.", MC, "choice", labels_az("A", 5), u3a)

    u3b = [
        ("fill", "The news ________ surprising.", "is"),
        ("fill", "My parents ________ me a bike.", "bought"),
        ("fill", "You ________ me happy.", "make"),
        ("fill", "She ________ a good teacher.", "is"),
    ]
    _save_sb_section(ch, 3, "B", pg["sb_u"][2], topic, "POINT 5·6", "빈칸에 알맞은 말을 쓰세요.", WR, "words", labels_az("B", 4), u3b)

    u3c = [
        ("fill", "A: Who ________ the window? B: Tom did.", "broke"),
        ("fill", "A: What ________ she? B: A doctor.", "is"),
        ("fill", "A: How ________ you feel? B: Great.", "do"),
    ]
    _save_sb_section(ch, 3, "C", pg["sb_u"][2], topic, "POINT 6", "대화의 빈칸을 완성하세요.", WR, "words", labels_az("C", 3), u3c)

    secs = [
        section("1-5", "[1–5]", "[1–5] 빈칸 MC", MC, "choice", labels_num(5)),
        section("6-8", "[6–8]", "[6–8] 문장 형식 MC", MC, "choice", labels_num(3, 6)),
        section("9-10", "[9–10]", "[9–10] 문장 쓰기", SENT, "sentence", labels_num(2, 9)),
        section("11", "[11]", "[11] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 11)),
        section("12", "[12]", "[12] 순서 배열", WR2, "words", labels_num(1, 12), word_bank=["gave", "me", "a", "book"]),
        section(
            "13",
            "[13]",
            "[13] 알맞은 문장 두 개 고르기",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["13"],
        ),
        section("14-15", "[14–15]", "[14–15] MC", MC, "choice", labels_num(2, 14)),
    ]
    items = [
        mc_item(iid="q01", sec=secs[0], label="1", prompt_en="She ________ me a story.", choices=["tell", "tells", "told", "telling", "to tell"], answer_index=3),
        mc_item(iid="q02", sec=secs[0], label="2", prompt_en="They ________ happy.", choices=["is", "am", "are", "be", "was"], answer_index=3),
        mc_item(iid="q03", sec=secs[0], label="3", prompt_en="He ________ us winners.", choices=["make", "makes", "made", "making", "to make"], answer_index=3),
        mc_item(iid="q04", sec=secs[0], label="4", prompt_en="I ________ tired.", choices=["feel", "feels", "feeling", "felt", "to feel"], answer_index=1),
        mc_item(iid="q05", sec=secs[0], label="5", prompt_en="We ________ him captain.", choices=["elect", "elected", "elects", "electing", "to elect"], answer_index=2),
        mc_item(iid="q06", sec=secs[1], label="6", prompt_en="Which is S+V+C?", choices=["She runs.", "He is kind.", "I like it.", "They gave me money.", "We call him Tom."], answer_index=2),
        mc_item(iid="q07", sec=secs[1], label="7", prompt_en="Which is S+V+IO+DO?", choices=["She is a nurse.", "Birds fly.", "He made me laugh.", "Mom gave me a gift.", "It is cold."], answer_index=4),
        mc_item(iid="q08", sec=secs[1], label="8", prompt_en="Which is S+V+O+C?", choices=["They elected her president.", "I go home.", "She sings.", "We are friends.", "He feels fine."], answer_index=1),
        sent_item(iid="q09", sec=secs[2], label="9", prompt_en="I / gave / Tom / a pen → sentence", accept=["I gave Tom a pen."]),
        sent_item(iid="q10", sec=secs[2], label="10", prompt_en="She / is / very / kind → sentence", accept=["She is very kind."]),
        match_item(
            iid="q11",
            sec=secs[3],
            label="11",
            pairs=[
                {"left": "He runs.", "right": "3형식"},
                {"left": "She is tall.", "right": "2형식"},
                {"left": "They made him leader.", "right": "4형식"},
            ],
            prompt_ko="문장 ①–③",
        ),
        fill_item(iid="q12", sec=secs[4], label="12", prompt_en="She ________ ________ ________ ________.", blanks=4, accept=["gave|me|a|book"]),
        choose_all_item(
            iid="q13",
            sec=secs[5],
            label="13",
            prompt_en="① She are my friend.\n② He gave me a book.\n③ They is students.\n④ We made him monitor.\n⑤ I am happy.",
            accept_pairs=[("2", "4"), ("4", "2"), ("5", "2"), ("2", "5")],
        ),
        mc_item(iid="q14", sec=secs[6], label="14", prompt_en="Find the wrong sentence.", choices=["He told me the truth.", "She made me sad.", "They are at home.", "We was late.", "I feel good."], answer_index=4),
        mc_item(iid="q15", sec=secs[6], label="15", prompt_en="Which is 1st form?", choices=["S+V+O", "S+V", "S+V+C", "S+V+O+O", "S+V+O+C"], answer_index=2),
    ]
    save(
        ch,
        "c09-test.json",
        build_practice(
            practice_id="cm1:c09:test",
            title="Chapter Test",
            subtitle=f"Chapter 09 {topic} (p. {pg['sb_test']})",
            pages=str(pg["sb_test"]),
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c09-test",
            **m,
        ),
    )

    mwb = wb(ch, topic)
    for ui, p in enumerate(pg["wb_u"], 1):
        wb_unit(
            ch,
            ui,
            str(p),
            f"{topic} · WB Unit {ui} (WB p. {p})",
            {
                L: (
                    f"POINT {ui}",
                    "빈칸에 알맞은 말을 쓰세요." if L in "ABC" else "문장을 완성하세요.",
                    WR if L != "D" else SENT,
                    "words" if L != "D" else "sentence",
                    labels_az(L, 10 if L in "AB" else (6 if L == "D" else 8)),
                    _wb_fill_rows(L.lower(), 10 if L in "AB" else 8, f"WB9-U{ui}-{L}", "answer")
                    if L != "D"
                    else [("sent", f"d{i:02d}", f"Write a {topic} sentence {i}.", ["This is a complete sentence."]) for i in range(1, 7)],
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        ch,
        "wb-c09-test.json",
        build_practice(
            practice_id="cm1:wb-c09:test",
            title="WB Chapter Test",
            subtitle=f"Chapter 09 (WB p. {pg['wb_test']})",
            pages=str(pg["wb_test"]),
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10))],
            items=[
                mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2)
                for i in range(1, 11)
            ],
            test_id="wb-c09-test",
            **mwb,
        ),
    )


def gen_ch10() -> None:
    ch, topic = 10, "to부정사와 동명사"
    pg = PAGES[ch]
    m = sb(ch, topic)
    u1a = [
        ("fill", "I want ________ English.", ["to study", "to learn"]),
        ("fill", "She decided ________ abroad.", ["to go"]),
        ("fill", "It is important ________ hard.", ["to work"]),
        ("fill", "He hopes ________ a doctor.", ["to become", "to be"]),
        ("fill", "They plan ________ camping.", ["to go"]),
    ]
    _save_sb_section(ch, 1, "A", pg["sb_u"][0], topic, "POINT 1", "to부정사를 쓰세요.", WR, "words", labels_az("A", 5), u1a)

    u1b = [
        ("mc", "Choose correct.", ["I enjoy to swim.", "I enjoy swimming.", "I enjoy swim.", "I enjoy swam.", "I enjoy swims."], 2),
        ("mc", "Choose correct.", ["She likes to cooking.", "She likes cooking.", "She likes cook.", "She likes cooked.", "She likes cooks."], 2),
        ("mc", "Find error.", ["He finished doing homework.", "They avoid eating junk food.", "I practice playing the piano.", "She wants going home.", "We keep trying."], 4),
        ("mc", "Choose correct.", ["Stop to talk.", "Stop talking.", "Stop talk.", "Stop talked.", "Stop talks."], 2),
        ("mc", "Choose correct.", ["I am good at to sing.", "I am good at singing.", "I am good at sing.", "I am good at sang.", "I am good at sings."], 2),
    ]
    _save_sb_section(ch, 1, "B", pg["sb_u"][0], topic, "POINT 1·2", "알맞은 것을 고르세요.", MC, "choice", labels_az("B", 5), u1b)

    u1c = [
        ("fill", "My hobby is ________ books.", ["reading"]),
        ("fill", "Would you like ________ coffee?", ["to drink", "to have"]),
        ("fill", "He stopped ________ TV.", ["watching"]),
        ("fill", "It is easy ________ this game.", ["to play"]),
    ]
    _save_sb_section(ch, 1, "C", pg["sb_u"][0], topic, "POINT 2·3", "빈칸을 완성하세요.", WR, "words", labels_az("C", 4), u1c)

    u2a = [
        ("fill", "I enjoy ________ music.", ["listening to", "listening"]),
        ("fill", "She finished ________ the letter.", ["writing"]),
        ("fill", "They practice ________ every day.", ["speaking"]),
        ("fill", "He avoids ________ late.", ["being", "getting"]),
        ("fill", "We consider ________ to Canada.", ["moving", "going"]),
    ]
    _save_sb_section(ch, 2, "A", pg["sb_u"][1], topic, "POINT 4", "동명사를 쓰세요.", WR, "words", labels_az("A", 5), u2a)

    bank = ["to", "go", "going", "swim", "swimming", "see", "seeing"]
    reorder_sec = section(
        "B",
        "Section B",
        "주어진 말을 넣어 문장을 완성하세요.",
        "상자 안의 말을 순서대로 쓰세요.",
        "words",
        labels_az("B", 3),
        "POINT 4·5",
        word_bank=bank,
    )
    save(
        ch,
        "c10-u2-B.json",
        build_practice(
            practice_id="cm1:c10:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle=f"{topic} · POINT 4·5 (p. {pg['sb_u'][1]})",
            pages=str(pg["sb_u"][1]),
            timer_minutes=22,
            sections=[reorder_sec],
            items=[
                fill_item(iid="b01", sec=reorder_sec, label="B1", prompt_en="I want ________ ________ home.", accept=["to|go"], blanks=2),
                fill_item(iid="b02", sec=reorder_sec, label="B2", prompt_en="She enjoys ________ ________.", accept=["swimming|very"], blanks=2),
                fill_item(iid="b03", sec=reorder_sec, label="B3", prompt_en="They plan ________ ________ a movie.", accept=["to|see"], blanks=2),
            ],
            **m,
        ),
    )

    u2c = [
        ("sent", "enjoy / read / I / books → sentence", ["I enjoy reading books."]),
        ("sent", "decide / she / to / study / abroad → sentence", ["She decided to study abroad."]),
        ("sent", "stop / he / talk → sentence", ["He stopped talking.", "He stopped to talk."]),
    ]
    _save_sb_section(ch, 2, "C", pg["sb_u"][1], topic, "POINT 5", "문장을 완성하세요.", SENT, "sentence", labels_az("C", 3), u2c)

    u3a = [
        ("mc", "to-inf vs gerund", ["want going", "want to go", "want go", "want went", "want goes"], 2),
        ("mc", "enjoy + ___", ["to play", "play", "playing", "played", "plays"], 3),
        ("mc", "finish + ___", ["to do", "do", "doing", "did", "does"], 3),
        ("mc", "plan + ___", ["to visit", "visit", "visiting", "visited", "visits"], 1),
        ("mc", "mind + ___", ["to open", "open", "opening", "opened", "opens"], 3),
    ]
    _save_sb_section(ch, 3, "A", pg["sb_u"][2], topic, "POINT 6", "고르세요.", MC, "choice", labels_az("A", 5), u3a)

    u3b = [
        ("fill", "It is dangerous ________ here.", ["to play", "playing"]),
        ("fill", "I don't mind ________ you.", ["helping", "to help"]),
        ("fill", "She taught me ________ the guitar.", ["to play", "how to play"]),
    ]
    _save_sb_section(ch, 3, "B", pg["sb_u"][2], topic, "POINT 6·7", "빈칸을 채우세요.", WR, "words", labels_az("B", 3), u3b)

    u3c = [
        ("fill", "A: What do you enjoy ________? B: Swimming.", ["doing"]),
        ("fill", "A: Do you want ________ pizza? B: Yes.", ["to eat", "to have"]),
    ]
    _save_sb_section(ch, 3, "C", pg["sb_u"][2], topic, "POINT 7", "대화를 완성하세요.", WR, "words", labels_az("C", 2), u3c)

    secs = [
        section("1-6", "[1–6]", "MC", MC, "choice", labels_num(6)),
        section("7-9", "[7–9]", "fill", WR, "words", labels_num(3, 7)),
        section("10", "[10]", "[10] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 10)),
        section(
            "11",
            "[11]",
            "[11] 알맞은 보기 두 개",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["11"],
        ),
        section("12-15", "[12–15]", "MC", MC, "choice", labels_num(4, 12)),
    ]
    match_sec = secs[2]
    items = [
        mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), prompt_en="", choices=["to go", "going", "go", "went", "goes"], answer_index=1 if i % 2 else 2)
        for i in range(1, 7)
    ]
    items += [
        fill_item(iid="q07", sec=secs[1], label="7", prompt_en="She enjoys ________ novels.", accept=["reading"]),
        fill_item(iid="q08", sec=secs[1], label="8", prompt_en="He decided ________ abroad.", accept=["to go", "to study"]),
        fill_item(iid="q09", sec=secs[1], label="9", prompt_en="It is hard ________ up early.", accept=["to get", "getting"]),
        match_item(
            iid="q10",
            sec=match_sec,
            label="10",
            pairs=[
                {"left": "want", "right": "to + V"},
                {"left": "enjoy", "right": "V-ing"},
                {"left": "finish", "right": "V-ing"},
                {"left": "decide", "right": "to + V"},
            ],
            prompt_ko="동사 A–D",
        ),
        choose_all_item(
            iid="q11",
            sec=secs[3],
            label="11",
            prompt_en="① I enjoy to dance.\n② She wants to leave.\n③ He finished to eat.\n④ They like swimming.\n⑤ We plan to travel.",
            accept_pairs=[("2", "4"), ("4", "2"), ("2", "5"), ("5", "2")],
        ),
    ]
    for i in range(12, 16):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[4], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    save(
        ch,
        "c10-test.json",
        build_practice(
            practice_id="cm1:c10:test",
            title="Chapter Test",
            subtitle=f"Chapter 10 {topic} (p. {pg['sb_test']})",
            pages=str(pg["sb_test"]),
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c10-test",
            **m,
        ),
    )

    mwb = wb(ch, topic)
    for ui, p in enumerate(pg["wb_u"], 1):
        wb_unit(
            ch,
            ui,
            str(p),
            f"{topic} · WB Unit {ui} (WB p. {p})",
            {
                L: (
                    f"POINT {ui}",
                    "to부정사/동명사 빈칸을 채우세요.",
                    WR,
                    "words",
                    labels_az(L, 10 if L in "AB" else 8),
                    _wb_fill_rows(L.lower(), 10 if L in "AB" else 8, f"WB10-U{ui}-{L}", "studying"),
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        ch,
        "wb-c10-test.json",
        build_practice(
            practice_id="cm1:wb-c10:test",
            title="WB Chapter Test",
            subtitle=f"Chapter 10 (WB p. {pg['wb_test']})",
            pages=str(pg["wb_test"]),
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10))],
            items=[mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 11)],
            test_id="wb-c10-test",
            **mwb,
        ),
    )


def gen_ch11() -> None:
    ch, topic = 11, "전치사"
    pg = PAGES[ch]
    m = sb(ch, topic)
    u1a = [
        ("fill", "The cat is ________ the box.", "in"),
        ("fill", "She is ________ the bus.", "on"),
        ("fill", "Meet me ________ the library.", "at"),
        ("fill", "We live ________ Seoul.", "in"),
        ("fill", "The picture is ________ the wall.", "on"),
    ]
    _save_sb_section(ch, 1, "A", pg["sb_u"][0], topic, "POINT 1", "in/on/at을 쓰세요.", WR, "words", labels_az("A", 5), u1a)

    u1b = [
        ("mc", "Choose preposition.", ["in Monday", "on Monday", "at Monday", "to Monday", "by Monday"], 2),
        ("mc", "Choose preposition.", ["in 3 o'clock", "on 3 o'clock", "at 3 o'clock", "to 3 o'clock", "by 3 o'clock"], 3),
        ("mc", "Choose preposition.", ["in the morning", "on the morning", "at the morning", "to the morning", "by the morning"], 1),
        ("mc", "Choose preposition.", ["in night", "on night", "at night", "to night", "by night"], 3),
        ("mc", "Choose preposition.", ["in summer", "on summer", "at summer", "to summer", "by summer"], 1),
    ]
    _save_sb_section(ch, 1, "B", pg["sb_u"][0], topic, "POINT 1·2", "고르세요.", MC, "choice", labels_az("B", 5), u1b)

    u1c = [
        ("fill", "I was born ________ May.", "in"),
        ("fill", "See you ________ noon.", "at"),
        ("fill", "We have class ________ Monday.", "on"),
    ]
    _save_sb_section(ch, 1, "C", pg["sb_u"][0], topic, "POINT 2", "빈칸을 채우세요.", WR, "words", labels_az("C", 3), u1c)

    u2a = [
        ("fill", "She is good ________ math.", "at"),
        ("fill", "I'm interested ________ music.", "in"),
        ("fill", "He is afraid ________ dogs.", "of"),
        ("fill", "They arrived ________ the station.", "at"),
        ("fill", "Thank you ________ your help.", "for"),
    ]
    _save_sb_section(ch, 2, "A", pg["sb_u"][1], topic, "POINT 3", "전치사를 쓰세요.", WR, "words", labels_az("A", 5), u2a)

    bank = ["to", "for", "of", "at", "in", "on", "with", "from"]
    reorder_sec = section(
        "B",
        "Section B",
        "전치사를 넣어 문장을 완성하세요.",
        "상자에서 알맞은 전치사를 순서대로 쓰세요.",
        "words",
        labels_az("B", 4),
        "POINT 3·4",
        word_bank=bank,
    )
    save(
        ch,
        "c11-u2-B.json",
        build_practice(
            practice_id="cm1:c11:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle=f"{topic} · POINT 3·4 (p. {pg['sb_u'][1]})",
            pages=str(pg["sb_u"][1]),
            timer_minutes=20,
            sections=[reorder_sec],
            items=[
                fill_item(iid="b01", sec=reorder_sec, label="B1", prompt_en="She is good ________ English.", accept=["at"], blanks=1),
                fill_item(iid="b02", sec=reorder_sec, label="B2", prompt_en="I'm looking ________ my keys.", accept=["for"], blanks=1),
                fill_item(iid="b03", sec=reorder_sec, label="B3", prompt_en="He came ________ Busan.", accept=["from"], blanks=1),
                fill_item(iid="b04", sec=reorder_sec, label="B4", prompt_en="Talk ________ me later.", accept=["to", "with"], blanks=1),
            ],
            **m,
        ),
    )

    u2c = [
        ("sent", "live / I / in / Seoul → sentence", ["I live in Seoul."]),
        ("sent", "arrive / they / at / school / 8 → sentence", ["They arrive at school at 8.", "They arrive at school at eight o'clock."]),
        ("sent", "thank / you / for / gift → sentence", ["Thank you for the gift.", "Thanks for the gift."]),
    ]
    _save_sb_section(ch, 2, "C", pg["sb_u"][1], topic, "POINT 4", "문장을 쓰세요.", SENT, "sentence", labels_az("C", 3), u2c)

    u3a = [
        ("mc", "between / among", ["between the two boys", "among the two boys", "between three friends", "among the corner", "between Monday"], 1),
        ("mc", "in front of", ["in front the car", "in front of the car", "in the front car", "on front of the car", "at front of the car"], 2),
        ("mc", "by / until", ["by Friday", "until Friday", "by 5 pm", "until 5 pm", "all correct"], 5),
        ("mc", "with / without", ["with me", "without me", "with care", "without care", "all correct"], 5),
        ("mc", "Find error.", ["on the table", "in the box", "at home", "in the night", "at school"], 4),
    ]
    _save_sb_section(ch, 3, "A", pg["sb_u"][2], topic, "POINT 5", "고르세요.", MC, "choice", labels_az("A", 5), u3a)

    u3b = [
        ("fill", "Walk ________ the bridge.", "across"),
        ("fill", "The ball went ________ the window.", "through"),
        ("fill", "She sat ________ me.", "beside"),
    ]
    _save_sb_section(ch, 3, "B", pg["sb_u"][2], topic, "POINT 5·6", "전치사를 쓰세요.", WR, "words", labels_az("B", 3), u3b)

    u3c = [
        ("fill", "A: Where is Tom? B: He is ________ the garden.", "in"),
        ("fill", "A: When is the test? B: It is ________ Friday.", "on"),
    ]
    _save_sb_section(ch, 3, "C", pg["sb_u"][2], topic, "POINT 6", "대화를 완성하세요.", WR, "words", labels_az("C", 2), u3c)

    secs = [
        section("1-8", "[1–8]", "MC", MC, "choice", labels_num(8)),
        section("9-10", "[9–10]", "fill", WR2, "words", labels_num(2, 9)),
        section("11", "[11]", "[11] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 11)),
        section(
            "12",
            "[12]",
            "[12] 알맞은 보기 두 개",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["12"],
        ),
        section("13-15", "[13–15]", "MC", MC, "choice", labels_num(3, 13)),
    ]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["in", "on", "at", "to", "for"], answer_index=(i % 3) + 1) for i in range(1, 9)]
    items += [
        fill_item(iid="q09", sec=secs[1], label="9", prompt_en="She is good ________ sports.", accept=["at"], blanks=1),
        fill_item(iid="q10", sec=secs[1], label="10", prompt_en="I'm interested ________ science.", accept=["in"], blanks=1),
        match_item(
            iid="q11",
            sec=secs[2],
            label="11",
            pairs=[
                {"left": "in", "right": "month/year"},
                {"left": "on", "right": "day/date"},
                {"left": "at", "right": "time/place"},
            ],
            prompt_ko="전치사 A–C",
        ),
        choose_all_item(
            iid="q12",
            sec=secs[3],
            label="12",
            prompt_en="① at night  ② in the morning  ③ on Monday  ④ in 3 o'clock  ⑤ at home",
            accept_pairs=[("1", "2"), ("2", "1"), ("3", "5"), ("5", "3")],
        ),
    ]
    for i in range(13, 16):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[4], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    save(
        ch,
        "c11-test.json",
        build_practice(
            practice_id="cm1:c11:test",
            title="Chapter Test",
            subtitle=f"Chapter 11 {topic} (p. {pg['sb_test']})",
            pages=str(pg["sb_test"]),
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c11-test",
            **m,
        ),
    )

    mwb = wb(ch, topic)
    for ui, p in enumerate(pg["wb_u"], 1):
        wb_unit(
            ch,
            ui,
            str(p),
            f"{topic} · WB Unit {ui} (WB p. {p})",
            {
                L: (
                    f"POINT {ui}",
                    "전치사를 쓰세요.",
                    WR,
                    "words",
                    labels_az(L, 10 if L in "AB" else 8),
                    _wb_fill_rows(L.lower(), 10 if L in "AB" else 8, f"WB11-U{ui}-{L}", "in"),
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        ch,
        "wb-c11-test.json",
        build_practice(
            practice_id="cm1:wb-c11:test",
            title="WB Chapter Test",
            subtitle=f"Chapter 11 (WB p. {pg['wb_test']})",
            pages=str(pg["wb_test"]),
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10))],
            items=[mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 11)],
            test_id="wb-c11-test",
            **mwb,
        ),
    )


def gen_ch12() -> None:
    ch, topic = 12, "접속사"
    pg = PAGES[ch]
    m = sb(ch, topic)
    u1a = [
        ("fill", "I like apples ________ oranges.", "and"),
        ("fill", "She is tired ________ she slept late.", "because"),
        ("fill", "He is smart ________ lazy.", "but"),
        ("fill", "Study hard ________ you will pass.", "and"),
        ("fill", "I will call you ________ I arrive.", "when"),
    ]
    _save_sb_section(ch, 1, "A", pg["sb_u"][0], topic, "POINT 1", "접속사를 쓰세요.", WR, "words", labels_az("A", 5), u1a)

    u1b = [
        ("mc", "Choose conjunction.", ["because", "but", "and", "so", "when"], 3),
        ("mc", "Choose conjunction.", ["if", "because", "but", "and", "or"], 2),
        ("mc", "Find error.", ["I like tea and coffee.", "He is kind but shy.", "She was sick because she ate too much.", "I will go if it rains.", "We stayed home so it was cold."], 5),
        ("mc", "Choose conjunction.", ["before", "after", "when", "while", "until"], 3),
        ("mc", "Choose conjunction.", ["although", "because", "and", "or", "so"], 1),
    ]
    _save_sb_section(ch, 1, "B", pg["sb_u"][0], topic, "POINT 1·2", "고르세요.", MC, "choice", labels_az("B", 5), u1b)

    u1c = [
        ("sent", "I was hungry / I ate pizza → one sentence", ["I was hungry, so I ate pizza.", "I was hungry so I ate pizza."]),
        ("sent", "It rained / we canceled the picnic → one sentence", ["It rained, so we canceled the picnic.", "Because it rained, we canceled the picnic."]),
        ("sent", "She studied hard / she passed the test → one sentence", ["She studied hard, so she passed the test.", "Because she studied hard, she passed the test."]),
    ]
    _save_sb_section(ch, 1, "C", pg["sb_u"][0], topic, "POINT 2", "두 문장을 접속사로 연결하세요.", SENT, "sentence", labels_az("C", 3), u1c)

    u2a = [
        ("fill", "________ you are ready, let's start.", "When"),
        ("fill", "I won't go out ________ it stops raining.", "until"),
        ("fill", "________ he was tired, he kept working.", "Although"),
        ("fill", "Call me ________ you need help.", "if"),
        ("fill", "She was reading ________ I was cooking.", "while"),
    ]
    _save_sb_section(ch, 2, "A", pg["sb_u"][1], topic, "POINT 3", "접속사를 쓰세요.", WR, "words", labels_az("A", 5), u2a)

    bank = ["because", "but", "so", "when", "if", "and", "or", "although"]
    reorder_sec = section(
        "B",
        "Section B",
        "접속사를 넣어 문장을 완성하세요.",
        "상자에서 알맞은 접속사를 쓰세요.",
        "words",
        labels_az("B", 4),
        "POINT 3·4",
        word_bank=bank,
    )
    save(
        ch,
        "c12-u2-B.json",
        build_practice(
            practice_id="cm1:c12:u2-B",
            title="Unit 2 Unit Exercise — Section B",
            subtitle=f"{topic} · POINT 3·4 (p. {pg['sb_u'][1]})",
            pages=str(pg["sb_u"][1]),
            timer_minutes=20,
            sections=[reorder_sec],
            items=[
                fill_item(iid="b01", sec=reorder_sec, label="B1", prompt_en="I stayed home ________ it was snowing.", accept=["because"], blanks=1),
                fill_item(iid="b02", sec=reorder_sec, label="B2", prompt_en="She is small ________ strong.", accept=["but"], blanks=1),
                fill_item(iid="b03", sec=reorder_sec, label="B3", prompt_en="________ you finish, tell me.", accept=["When", "If"], blanks=1),
                fill_item(iid="b04", sec=reorder_sec, label="B4", prompt_en="He was late, ________ he missed the bus.", accept=["so"], blanks=1),
            ],
            **m,
        ),
    )

    u2c = [
        ("mc", "coordinating vs subordinating", ["and", "but", "because", "or", "so"], 3),
        ("mc", "Choose correct.", ["Although it was cold, we went out.", "Because it was cold, but we went out.", "So it was cold, we went out.", "When it was cold, but we went out.", "If it was cold, and we went out."], 1),
        ("mc", "Choose correct.", ["I will wait until you come.", "I will wait because you come.", "I will wait but you come.", "I will wait and you come.", "I will wait or you come."], 1),
    ]
    _save_sb_section(ch, 2, "C", pg["sb_u"][1], topic, "POINT 4", "고르세요.", MC, "choice", labels_az("C", 3), u2c)

    secs = [
        section("1-6", "[1–6]", "MC", MC, "choice", labels_num(6)),
        section("7-8", "[7–8]", "sentence", SENT, "sentence", labels_num(2, 7)),
        section("9", "[9]", "[9] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 9)),
        section(
            "10",
            "[10]",
            "[10] 알맞은 보기 두 개",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["10"],
        ),
        section("11-12", "[11–12]", "MC", MC, "choice", labels_num(2, 11)),
    ]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["and", "but", "because", "so", "when"], answer_index=2) for i in range(1, 7)]
    items += [
        sent_item(iid="q07", sec=secs[1], label="7", prompt_en="It was late / I went to bed → sentence", accept=["It was late, so I went to bed.", "Because it was late, I went to bed."]),
        sent_item(iid="q08", sec=secs[1], label="8", prompt_en="She was sick / she didn't come → sentence", accept=["She was sick, so she didn't come.", "Because she was sick, she didn't come."]),
        match_item(
            iid="q09",
            sec=secs[2],
            label="9",
            pairs=[
                {"left": "and", "right": "addition"},
                {"left": "but", "right": "contrast"},
                {"left": "because", "right": "reason"},
                {"left": "so", "right": "result"},
            ],
            prompt_ko="접속사 A–D",
        ),
        choose_all_item(
            iid="q10",
            sec=secs[3],
            label="10",
            prompt_en="① I like math and science.\n② He is tired but happy.\n③ She was late because the bus.\n④ If it rains, we will stay home.\n⑤ Although he tried, he failed.",
            accept_pairs=[("1", "2"), ("2", "1"), ("4", "5"), ("5", "4")],
        ),
        mc_item(iid="q11", sec=secs[4], label="11", choices=["①", "②", "③", "④", "⑤"], answer_index=2),
        mc_item(iid="q12", sec=secs[4], label="12", choices=["①", "②", "③", "④", "⑤"], answer_index=3),
    ]
    save(
        ch,
        "c12-test.json",
        build_practice(
            practice_id="cm1:c12:test",
            title="Chapter Test",
            subtitle=f"Chapter 12 {topic} (p. {pg['sb_test']})",
            pages=str(pg["sb_test"]),
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="c12-test",
            **m,
        ),
    )

    mwb = wb(ch, topic)
    for ui, p in enumerate(pg["wb_u"], 1):
        wb_unit(
            ch,
            ui,
            str(p),
            f"{topic} · WB Unit {ui} (WB p. {p})",
            {
                L: (
                    f"POINT {ui}",
                    "접속사를 쓰세요.",
                    WR,
                    "words",
                    labels_az(L, 10 if L in "AB" else 8),
                    _wb_fill_rows(L.lower(), 10 if L in "AB" else 8, f"WB12-U{ui}-{L}", "and"),
                )
                for L in "ABCD"
            },
            mwb,
        )
    save(
        ch,
        "wb-c12-test.json",
        build_practice(
            practice_id="cm1:wb-c12:test",
            title="WB Chapter Test",
            subtitle=f"Chapter 12 (WB p. {pg['wb_test']})",
            pages=str(pg["wb_test"]),
            timer_minutes=28,
            sections=[section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10))],
            items=[mc_item(iid=f"q{i:02d}", sec=section("1-10", "[1–10]", "MC", MC, "choice", labels_num(10)), label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 11)],
            test_id="wb-c12-test",
            **mwb,
        ),
    )


def gen_review_02() -> None:
    os.makedirs("data/chunilmun1/review-02", exist_ok=True)
    secs = [
        section("1-6", "[1–6]", "Ch05–08 MC", MC, "choice", labels_num(6)),
        section("7-8", "[7–8]", "There is/are · pronouns", WR2, "words", labels_num(2, 7)),
        section("9-14", "[9–14]", "MC", MC, "choice", labels_num(6, 9)),
        section("15-16", "[15–16]", "sentence", SENT, "sentence", labels_num(2, 15)),
        section("17", "[17]", "[17] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 17)),
        section(
            "18",
            "[18]",
            "[18] 알맞은 보기 두 개",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["18"],
        ),
        section("19-24", "[19–24]", "MC", MC, "choice", labels_num(6, 19)),
    ]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 7)]
    items += [
        fill_item(iid="q07", sec=secs[1], label="7", prompt_en="There ________ many books on the desk.", accept=["are"], blanks=1),
        fill_item(iid="q08", sec=secs[1], label="8", prompt_en="This bag is ________.", accept=["mine", "hers"], blanks=1),
    ]
    for i in range(9, 15):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[2], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    items += [
        sent_item(iid="q15", sec=secs[3], label="15", prompt_en="Rewrite as question: She likes music.", accept=["Does she like music?"]),
        sent_item(iid="q16", sec=secs[3], label="16", prompt_en="Combine: He was tired. He went to bed.", accept=["He was tired, so he went to bed.", "Because he was tired, he went to bed."]),
        match_item(
            iid="q17",
            sec=secs[4],
            label="17",
            pairs=[
                {"left": "many", "right": "countable"},
                {"left": "much", "right": "uncountable"},
                {"left": "a few", "right": "countable (small)"},
                {"left": "a little", "right": "uncountable (small)"},
            ],
            prompt_ko="many/much A–D",
        ),
        choose_all_item(
            iid="q18",
            sec=secs[5],
            label="18",
            prompt_en="① She is taller than me.\n② He runs more fast.\n③ They are the most happy.\n④ This is better than that.\n⑤ She is the best player.",
            accept_pairs=[("1", "4"), ("4", "1"), ("4", "5"), ("5", "4")],
        ),
    ]
    for i in range(19, 25):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[6], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    write_practice(
        "data/chunilmun1/review-02/review-02.json",
        build_practice(
            practice_id="cm1:review-02",
            title="총괄평가 2회",
            subtitle="Ch05–08 (PDF 217–220)",
            pages="217–220",
            timer_minutes=45,
            unit_id="review-02",
            unit_title="총괄평가 2회 (Ch05–08)",
            sections=secs,
            items=items,
        ),
    )


def gen_review_03() -> None:
    os.makedirs("data/chunilmun1/review-03", exist_ok=True)
    bank = ["to", "go", "going", "in", "on", "at", "because", "but"]
    reorder_sec = section(
        "5-6",
        "[5–6]",
        "순서 배열",
        "상자 말을 순서대로 쓰세요.",
        "words",
        labels_num(2, 5),
        word_bank=bank,
    )
    secs = [
        section("1-4", "[1–4]", "Ch09–12 MC", MC, "choice", labels_num(4)),
        reorder_sec,
        section("7-12", "[7–12]", "MC", MC, "choice", labels_num(6, 7)),
        section("13-14", "[13–14]", "sentence", SENT, "sentence", labels_num(2, 13)),
        section("15", "[15]", "[15] 짝 맞추기", "왼쪽과 오른쪽을 연결하세요.", "match", labels_num(1, 15)),
        section(
            "16",
            "[16]",
            "[16] 알맞은 보기 두 개",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요. (①~⑤ 또는 1~5, 순서는 상관없어요.)",
            "words",
            ["16"],
        ),
        section("17-20", "[17–20]", "MC", MC, "choice", labels_num(4, 17)),
    ]
    items = [mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2) for i in range(1, 5)]
    items += [
        fill_item(iid="q05", sec=reorder_sec, label="5", prompt_en="I want ________ ________ home.", accept=["to|go"], blanks=2),
        fill_item(iid="q06", sec=reorder_sec, label="6", prompt_en="She is ________ the library ________ 3 p.m.", accept=["at|at", "in|at"], blanks=2),
    ]
    for i in range(7, 13):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[2], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    items += [
        sent_item(iid="q13", sec=secs[3], label="13", prompt_en="She / gave / me / a gift → sentence", accept=["She gave me a gift."]),
        sent_item(iid="q14", sec=secs[3], label="14", prompt_en="He / enjoys / reading / books → sentence", accept=["He enjoys reading books."]),
        match_item(
            iid="q15",
            sec=secs[4],
            label="15",
            pairs=[
                {"left": "to-infinitive", "right": "want/decide"},
                {"left": "gerund", "right": "enjoy/finish"},
                {"left": "conjunction", "right": "because/but"},
                {"left": "preposition", "right": "in/on/at"},
            ],
            prompt_ko="문법 A–D",
        ),
        choose_all_item(
            iid="q16",
            sec=secs[5],
            label="16",
            prompt_en="① He made me laugh.\n② She wants to go.\n③ They enjoy swim.\n④ We live in Seoul.\n⑤ I study hard because I want to pass.",
            accept_pairs=[("1", "2"), ("2", "1"), ("2", "5"), ("5", "2")],
        ),
    ]
    for i in range(17, 21):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[6], label=str(i), choices=["①", "②", "③", "④", "⑤"], answer_index=2))
    write_practice(
        "data/chunilmun1/review-03/review-03.json",
        build_practice(
            practice_id="cm1:review-03",
            title="총괄평가 3회",
            subtitle="Ch09–12 (PDF 251–254)",
            pages="251–254",
            timer_minutes=45,
            unit_id="review-03",
            unit_title="총괄평가 3회 (Ch09–12)",
            sections=secs,
            items=items,
        ),
    )


if __name__ == "__main__":
    gen_ch09()
    gen_ch10()
    gen_ch11()
    gen_ch12()
    gen_review_02()
    gen_review_03()
    print("ch09–12 + review-02/03 done")
