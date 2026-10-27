#!/usr/bin/env python3
"""Scan-extracted workbook data for Ch06–08 WB + review-02 — 천일문 Grammar 1.

Source PNGs: tmp/pdf-img/wb68/ (PDF pp. 193–220; printed WB pp. 40–67).
Verified in check-no-guessed-stems: chapter06, chapter07, chapter08, review-02 (WB rebuild).
"""
from __future__ import annotations

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


def _bracket_mc(sec, label: str, iid: str, prompt: str, choices: list[str], ans: int) -> dict:
    return mc_item(iid=iid, sec=sec, label=label, prompt_en=prompt, choices=choices, answer_index=ans)


def _ox(sec, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _adj_pair(sec, label: str, iid: str, sentence: str, adj: str, head: str) -> dict:
    return fill_item(
        iid=iid,
        sec=sec,
        label=label,
        prompt_en=sentence,
        accept=[f"{adj}|{head}"],
        blanks=2,
        blank_labels=["형용사", "꾸밈말"],
    )


def _adv_head(sec, label: str, iid: str, sentence: str, head: str) -> dict:
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=sentence, accept=[head])


def _write_docs(data: dict[str, dict], *, chapter: int | None, review_dir: str | None = None) -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "..", "data", "chunilmun1")
    for name, doc in data.items():
        if review_dir and name.startswith("review-"):
            path = os.path.join(root, review_dir, name)
        elif chapter is not None:
            path = os.path.join(root, f"chapter{chapter:02d}", name)
        else:
            raise ValueError(f"cannot place {name}")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")


def build_ch06_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(6, "대명사")

    sec = section(
        "A",
        "Section A",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("A", 10),
        "POINT 1·2",
    )
    u1a = [
        ("He always tells a lie. Don't believe [his / him].", ["his", "him"], 2),
        ("A flower has [its / it's] own smell.", ["its", "it's"], 1),
        ("Is he [you / your] history teacher?", ["you", "your"], 2),
        ("Please give [my / me] a sheet of paper.", ["my", "me"], 2),
        ("Gary and Tony began [their / them] trip last week.", ["their", "them"], 1),
        ("We talked about [our / us] summer camp.", ["our", "us"], 2),
        ("Nancy didn't bring her textbook. She borrowed [my / mine].", ["my", "mine"], 2),
        ("I miss my grandparents. [Their / They] live in Canada.", ["Their", "They"], 2),
        ("Kate and I live together. [They / We] are roommates.", ["They", "We"], 2),
        ("My birthday is in April. [He / His] is in May.", ["He", "His"], 2),
    ]
    items = [_bracket_mc(sec, f"A{i}", f"a{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u1a, 1)]
    out["wb-c06-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c06:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="인칭·소유대명사 · POINT 1·2 (WB p. 40)",
        pages="40",
        timer_minutes=22,
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
        labels_az("B", 9),
        "POINT 1·2",
    )
    u1b = [
        ("The brown shoes are ________. (I)", ["mine"]),
        ("________ mother is a nurse. (he)", ["His"]),
        ("My eyes are black. But ________ are brown. (he)", ["his"]),
        ("Is ________ sister a middle school student? (you)", ["your"]),
        ("The students are in ________ classroom. (they)", ["their"]),
        ("The skirt isn't mine. It's ________. (she)", ["hers"]),
        ("Jinsu and I have bikes. ________ bikes aren't new. (we)", ["Our"]),
        ("The black bag is mine. ________ is white. (you)", ["Yours"]),
        ("Is the cap yours or ________? (he)", ["his"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["wb-c06-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c06:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="인칭·소유대명사 · POINT 1·2 (WB p. 40)",
        pages="40",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("C", 10),
        "POINT 1·2·3",
    )
    u1c = [
        ("The book on the table is <u>her</u>.", "hers"),
        ("My hair is long, but <u>Mina</u> is short.", "Mina's"),
        ("There is a red hat. It is <u>hers</u> hat.", "her"),
        ("You should look back <u>you</u>.", "yourself"),
        ("I found <u>they</u> under the desk.", "them"),
        ("Jenny introduced <u>himself</u> in front of us.", "herself"),
        ("I go to a <u>boys's</u> middle school.", "boys'"),
        ("You can't judge a book by <u>it's</u> cover.", "its"),
        ("I am sorry. I broke <u>yours</u> computer.", "your"),
        ("I go to my <u>grandparents's</u> house today.", "grandparents'"),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=[a]) for i, (p, a) in enumerate(u1c, 1)]
    out["wb-c06-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c06:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="인칭·소유대명사 · POINT 1·2·3 (WB p. 41)",
        pages="41",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요.",
        WR,
        "words",
        labels_az("D", 5),
        "POINT 3",
    )
    u1d = [
        ("You should give ________ enough time.", ["yourself"]),
        ("I washed ________ before going to bed.", ["myself"]),
        ("He protected ________ from the danger.", ["himself"]),
        ("We congratulated ________ on our success.", ["ourselves"]),
        ("The song repeated ________.", ["itself"]),
    ]
    items = [fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c06-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c06:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="재귀대명사 · POINT 3 (WB p. 41)",
        pages="41",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    bank_demo = ["this", "that", "these", "those"]
    sec = section(
        "A",
        "Section A",
        "우리말과 일치하도록 빈칸에 알맞은 말을 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("A", 7),
        "POINT 4·5",
        word_bank=bank_demo,
    )
    u2a = [
        ("________ is my family picture.", ["This"]),
        ("Is ________ girl your cousin?", ["that"]),
        ("I myself baked ________ cookies.", ["these"]),
        ("The cars are coming ________ way.", ["this"]),
        ("Are ________ Steve's books?", ["those"]),
        ("________ is my puppy, Max.", ["That"]),
        ("Look at ________ two pretty birds.", ["these"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2a, 1)]
    out["wb-c06-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c06:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="지시대명사 · POINT 4·5 (WB p. 42)",
        pages="42",
        timer_minutes=20,
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
        labels_az("B", 8),
        "POINT 4·5",
    )
    u2b = [
        ("<u>This</u> is really windy today.", False, "It is"),
        ("Is <u>that</u> your towel over there?", True, ""),
        ("He won't wear <u>these</u> old shirt.", False, "this"),
        ("Is he working in <u>those</u> building?", False, "that"),
        ("<u>These</u> tomatoes are really delicious.", True, ""),
        ("Look at <u>that</u> stars in the sky.", False, "those"),
        ("<u>This</u> are seats for elderly people.", False, "These"),
        ("<u>It's</u> Friday today.", True, ""),
    ]
    items = [_ox(sec, f"B{i}", f"b{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u2b, 1)]
    out["wb-c06-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c06:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="지시대명사 · POINT 4·5 (WB p. 42)",
        pages="42",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 단어를 이용하여 질문에 대한 답을 쓰세요.",
        SENT,
        "sentence",
        labels_az("C", 6),
        "POINT 6",
    )
    u2c = [
        ("What time is it now? (5:40 p.m.)", ["It is 5:40 p.m.", "It's 5:40 p.m."]),
        ("What is the weather like today? (rainy and cold)", ["It is rainy and cold.", "It's rainy and cold."]),
        ("What day is it today? (Monday)", ["It is Monday.", "It's Monday."]),
        ("How far is it from here to the library? (200 meters)", ["It is 200 meters.", "It's 200 meters."]),
        ("What's the date today? (July 3rd)", ["It is July 3rd.", "It's July 3rd."]),
        ("What season is it now in your country? (spring)", ["It is spring.", "It's spring."]),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["wb-c06-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c06:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="it · POINT 6 (WB p. 43)",
        pages="43",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "밑줄 친 It/it에 유의하여 다음 해석을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 7),
        "POINT 6",
    )
    u2d = [
        ("<u>It</u> takes about 3 hours to Daegu.", ["It takes about three hours to Daegu.", "It takes about 3 hours to Daegu."]),
        ("<u>It</u> rained for 4 days.", ["It rained for four days.", "It rained for 4 days."]),
        (
            "I lost my cell phone. I can't find <u>it</u>.",
            ["I lost my cell phone. I can't find it.", "I lost my cell phone. I cannot find it."],
        ),
        ("<u>It</u> is winter in Australia now.", ["It is winter in Australia now.", "It's winter in Australia now."]),
        (
            "My father has a car. He washes <u>it</u> every Sunday.",
            ["My father has a car. He washes it every Sunday."],
        ),
        ("<u>It</u> snowed a lot in Seoul last week.", ["It snowed a lot in Seoul last week."]),
        ("<u>It's</u> too dark. Turn on the light.", ["It's too dark. Turn on the light.", "It is too dark. Turn on the light."]),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c06-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c06:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="it · POINT 6 (WB p. 43)",
        pages="43",
        timer_minutes=22,
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
        labels_az("A", 8),
        "POINT 7",
        word_bank=["one", "ones", "it"],
    )
    u3a = [
        ("I dropped my fork on the floor. Could you bring me a new ________?", ["one"]),
        ("I need new sneakers. I'll buy white ________ today.", ["ones"]),
        ("I went to the concert last night. ________ was very exciting.", ["It"]),
        ("This book is not mine. ________ is Sara's.", ["It"]),
        ("I don't have a pen. Could you lend me ________?", ["one"]),
        ("My sister likes pink dresses. But I like black ________.", ["ones"]),
        ("I don't like this. Would you show me a different ________?", ["one"]),
        ("These pants are too expensive. Do you have cheap ________?", ["ones"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3a, 1)]
    out["wb-c06-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c06:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="one/ones/it · POINT 7 (WB p. 44)",
        pages="44",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 some 또는 any를 넣어 문장을 완성하세요.",
        WR,
        "words",
        labels_az("B", 5),
        "POINT 8",
    )
    u3b = [
        ("A: Do you have sisters or brothers?\nB: No, I don't have ________.", ["any"]),
        ("A: Would you like ________ orange juice?\nB: Yes, please. I'm thirsty.", ["some"]),
        ("A: Can I have ________ bread?\nB: Yes. Go ahead.", ["some"]),
        ("A: What is in the basket?\nB: There are ________ biscuits and potatoes.", ["some"]),
        (
            "A: This restaurant doesn't have ________ dishes without meat.\nB: It's too bad. Let's go somewhere else.",
            ["any"],
        ),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3b, 1)]
    out["wb-c06-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c06:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="some/any · POINT 8 (WB p. 44)",
        pages="44",
        timer_minutes=18,
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
        labels_az("C", 9),
        "POINT 9",
    )
    u3c = [
        ("Somebody ________ to do this job. (have)", ["has"]),
        ("Everybody ________ polite people. (like)", ["likes"]),
        ("Something ________ strange in this picture. (be)", ["is"]),
        ("Nobody ________ her name. (know)", ["knows"]),
        ("There ________ nothing in the refrigerator. (be)", ["is"]),
        ("Everyone ________ to stay here until 6 o'clock. (have)", ["has"]),
        ("Excuse me, ________ anyone using this? (be)", ["Is"]),
        ("________ there anything on TV now? (be)", ["Is"]),
        ("Everything ________ like a dream to me. (seem)", ["seems"]),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["wb-c06-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c06:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="부정대명사 · POINT 9 (WB p. 45)",
        pages="45",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요. (필요시 단어의 형태를 바꿀 것)",
        SENT,
        "sentence",
        labels_az("D", 7),
        "POINT 7·8·9",
    )
    u3d = [
        (
            "Your car is too old. You ________ (need / one / new / a)",
            ["You need a new one.", "You need a new car."],
        ),
        ("(have / ID cards / have to / everyone)", ["Everyone has to have ID cards."]),
        ("These flowers are pretty. ________ (buy / some / will / I)", ["I will buy some.", "I'll buy some."]),
        ("These cups are dirty. ________? (clean / do / one / have / you)", ["Do you have clean ones?"]),
        ("(story / believe / nobody / her)", ["Nobody believes her story."]),
        ("I ________ (have / plans / any / don't / today)", ["I don't have any plans today.", "I do not have any plans today."]),
        (
            "________ (something / there / in my shoe / be). It's uncomfortable.",
            ["There is something in my shoe.", "There's something in my shoe."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3d, 1)]
    out["wb-c06-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c06:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="one/some/any · POINT 7·8·9 (WB p. 45)",
        pages="45",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch06_wb_test(m))
    return out


def _build_ch06_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section(
            "3",
            "[3]",
            "[3] 다음 중 밑줄 친 부분이 어법상 알맞은 것을 고르세요.",
            MC,
            "choice",
            ["3"],
        ),
        section(
            "4",
            "[4]",
            "[4] <보기>와 같이 밑줄 친 단어가 가리키는 것이 무엇인지 쓰세요.",
            WR,
            "words",
            ["4-1", "4-2", "4-3"],
        ),
        section(
            "5-7",
            "[5–7]",
            "[5–7] 다음 중 (A), (B), (C)에 어법상 알맞은 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(3, 5),
        ),
        section(
            "8-10",
            "[8–10]",
            "[8–10] 다음 중 빈칸·밑줄 친 부분을 고르거나 고치세요.",
            MC,
            "choice",
            labels_num(3, 8),
        ),
        section(
            "11-14",
            "[11–14]",
            "[11–14] 다음 중 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(4, 11),
        ),
        section(
            "15",
            "[15]",
            "[15] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
            SENT,
            "sentence",
            ["15-1", "15-2"],
        ),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Bob is ________ friend.",
            choices=["my", "your", "him", "her", "Tom's"],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="Carl saw ________ downtown yesterday.",
            choices=["me", "you", "them", "her", "our"],
            answer_index=5,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            choices=[
                "This is my dog. <u>It</u> is so cute.",
                "Susan is in the kitchen. <u>Her</u> is hungry.",
                "James is my neighbor. <u>His</u> from England.",
                "Dan and I are twins. <u>They</u> are very similar.",
                "John and Tony are Amy's brothers. I know <u>they</u>.",
            ],
            answer_index=1,
        ),
        fill_item(
            iid="q04a",
            sec=secs[2],
            label="4-1",
            prompt_en="It's his problem, not <u>hers</u>. →",
            accept=["her problem"],
        ),
        fill_item(
            iid="q04b",
            sec=secs[2],
            label="4-2",
            prompt_en="Their apartment is next to <u>ours</u>. →",
            accept=["our apartment"],
        ),
        fill_item(
            iid="q04c",
            sec=secs[2],
            label="4-3",
            prompt_en="These books are not ours. They are <u>theirs</u>. →",
            accept=["their books"],
        ),
        mc_item(
            iid="q05",
            sec=secs[3],
            label="5",
            prompt_en="David is (A) friend. (B) are in the same class. Everybody likes (C).",
            choices=["me — We — him", "me — Us — his", "my — Us — his", "my — We — him", "my — We — his"],
            answer_index=4,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="Nobody (A) rude people. / famous for (B) night view. / picture of (C).",
            choices=[
                "like — it's — us",
                "likes — its — ourselves",
                "likes — its — us",
                "like — it's — ourselves",
                "like — its — us",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q07",
            sec=secs[3],
            label="7",
            prompt_en="________ are not my socks. / ________ scissors are Evan's.",
            choices=["It", "This", "That", "These", "They"],
            answer_index=4,
        ),
        mc_item(
            iid="q08",
            sec=secs[4],
            label="8",
            prompt_en="Different usage of It:",
            choices=[
                "It is snowing in Busan.",
                "It is my favorite song.",
                "It's already dark outside.",
                "Hurry up! It is 8 o'clock.",
                "It is 2 kilometers to the station.",
            ],
            answer_index=2,
        ),
        fill_item(
            iid="q09",
            sec=secs[4],
            label="9",
            prompt_en="The store has only short pants. I need long <u>one</u>.",
            accept=["ones"],
        ),
        fill_item(
            iid="q10",
            sec=secs[4],
            label="10",
            prompt_en="Everyone <u>feel</u> lonely sometimes.",
            accept=["feels"],
        ),
        mc_item(
            iid="q11",
            sec=secs[5],
            label="11",
            prompt_en="Group It by usage (a–f):",
            choices=["ⓐ, ⓔ, ⓕ", "ⓐ, ⓑ, ⓓ", "ⓐ, ⓒ, ⓓ", "ⓑ, ⓓ, ⓕ", "ⓒ, ⓓ, ⓔ"],
            answer_index=5,
        ),
        mc_item(
            iid="q12",
            sec=secs[5],
            label="12",
            prompt_en="We don't have (A) money. / I want (B) ice cream for dessert.",
            choices=["any — any", "some — any", "any — some", "some — some", "many — some"],
            answer_index=3,
        ),
        mc_item(
            iid="q13",
            sec=secs[5],
            label="13",
            prompt_en="Look at (A) photos on the desk. / Nothing (B) wrong with my keyboard.",
            choices=["this — is", "this — are", "these — is", "these — are", "these — were"],
            answer_index=3,
        ),
        mc_item(
            iid="q14",
            sec=secs[5],
            label="14",
            choices=[
                "We don't do nothing today.",
                "Is there anybody in this room?",
                "Would you like some more coffee?",
                "Jack visited the place and took some pictures.",
                "Mom bought some bread, but she didn't buy any apples.",
            ],
            answer_index=1,
        ),
        sent_item(
            iid="q15a",
            sec=secs[6],
            label="15-1",
            prompt_en="모든 사람은 서로 다른 성격을 가지고 있다. (different / everyone / a / personality / have)",
            accept=["Everyone has a different personality."],
        ),
        sent_item(
            iid="q15b",
            sec=secs[6],
            label="15-2",
            prompt_en="나는 나 자신에 대한 에세이를 쓴다. (an essay / about / I / write / me)",
            accept=["I write an essay about myself."],
        ),
    ]
    return {
        "wb-c06-test.json": build_practice(
            practice_id="cm1:wb-c06:test",
            title="WB Chapter Test",
            subtitle="Chapter 06 (WB p. 46–47)",
            pages="46–47",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c06-test",
            **m,
        )
    }


def build_ch07_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(7, "형용사, 부사, 비교")

    sec = section(
        "A",
        "Section A",
        "〈보기〉와 같이 형용사를 찾아 밑줄을 긋고, 그것이 꾸미거나 보충 설명하는 말에 동그라미 하세요.",
        WR2,
        "words",
        labels_az("A", 10),
        "POINT 1",
    )
    adj_data = [
        ("A yellow butterfly flew to me.", "yellow", "butterfly"),
        ("He gave me a small gift today.", "small", "gift"),
        ("There is a cute puppy in the picture.", "cute", "puppy"),
        ("We had delicious food at the restaurant.", "delicious", "food"),
        ("I didn't do anything wrong to them.", "wrong", "anything"),
        ("This is a book about brave people.", "brave", "people"),
        ("My neighbor's dog is friendly.", "friendly", "dog"),
        ("We have an important event today.", "important", "event"),
        ("The weather is hot today.", "hot", "weather"),
        ("I saw someone strange at the door.", "strange", "someone"),
    ]
    items = [
        _adj_pair(sec, f"A{i}", f"a{i:02d}", s, a, h) for i, (s, a, h) in enumerate(adj_data, 1)
    ]
    out["wb-c07-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c07:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="형용사 · POINT 1 (WB p. 48)",
        pages="48",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 중 어법상 알맞은 것을 고르세요.",
        MC,
        "choice",
        labels_az("B", 10),
        "POINT 2·3·4",
    )
    u1b = [
        ("There is [many / lots of] sugar in sodas.", ["many", "lots of"], 2),
        ("[Much / Many] birds are sitting on the tree branch.", ["Much", "Many"], 2),
        ("There isn't [many / much] food in the refrigerator.", ["many", "much"], 2),
        ("[A few / A little] people attended their wedding.", ["A few", "A little"], 1),
        ("There is [few / little] lemonade in the bottle.", ["few", "little"], 2),
        ("There is [many / a lot of] traffic in Seoul.", ["many", "a lot of"], 2),
        ("He has [few / little] time for his hobby now.", ["few", "little"], 2),
        ("[Many / Much] children have unhealthy eating habits.", ["Many", "Much"], 1),
        ("She had a car accident [a little / a few] hours ago.", ["a little", "a few"], 2),
        ("John received [much / lots of] presents on his birthday.", ["much", "lots of"], 2),
    ]
    items = [_bracket_mc(sec, f"B{i}", f"b{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u1b, 1)]
    out["wb-c07-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c07:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="many/much · POINT 2·3·4 (WB p. 48)",
        pages="48",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    q_bank = ["many", "much", "a few", "a little", "few", "little"]
    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 말을 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("C", 7),
        "POINT 3·4",
        word_bank=q_bank,
    )
    u1c = [
        ("My teacher doesn't give ________ homework.", ["much"]),
        ("Tourists visit Korea for ________ reasons.", ["many"]),
        ("I'll call you ________ minutes later.", ["a few"]),
        ("There are ________ people in the library on holidays.", ["few"]),
        ("There is ________ rain in the desert.", ["little"]),
        ("My mom bought me ________ books.", ["many"]),
        ("I need ________ help with this homework.", ["a little"]),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1c, 1)]
    out["wb-c07-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c07:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="many/much · POINT 3·4 (WB p. 49)",
        pages="49",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("D", 6),
        "POINT 1·2·3·4",
    )
    u1d = [
        ("There are ________ ________ on the road. (sign)", ["many signs"], 2),
        ("I will go and get ________ ________. (hot, something)", ["something hot", "hot something"], 2),
        ("Dongho has ________ ________ about wild flowers. (knowledge)", ["a little knowledge"], 2),
        ("I'm planning ________ ________ this Saturday. (special, nothing)", ["nothing special"], 2),
        ("The reading club has ________ ________ ________. (member)", ["a few members"], 3),
        (
            "그 어린 소녀는 예의가 발랐다. (young, be, girl, the, polite)\n________ ________ ________ ________ ________.",
            ["The young girl is polite."],
            5,
        ),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1d, 1)
    ]
    out["wb-c07-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c07:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="형용사/수량 · POINT 1·2·3·4 (WB p. 49)",
        pages="49",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "다음 굵게 표시된 부사가 꾸며주는 말에 밑줄을 그으세요.",
        WR,
        "words",
        labels_az("A", 10),
        "POINT 5",
    )
    u2a = [
        ("This weekly magazine sells **well**.", "sells"),
        ("My sister is **very** angry at me.", "angry"),
        ("You will find the answer **easily**.", "find"),
        ("She ran to her house **fast**.", "ran"),
        ("Thank you **so** much for your help.", "much"),
        ("The man's voice was **really** attractive.", "attractive"),
        ("**Finally**, Tony found his lost cell phone.", "found"),
        ("I am **too** tired these days.", "tired"),
        ("Your little brother is **really** lovely.", "lovely"),
        ("**Suddenly**, I heard a scream from outside.", "heard"),
    ]
    items = [_adv_head(sec, f"A{i}", f"a{i:02d}", s, h) for i, (s, h) in enumerate(u2a, 1)]
    out["wb-c07-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c07:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="부사 · POINT 5 (WB p. 50)",
        pages="50",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 6),
        "POINT 5·6",
    )
    u2b = [
        ("________, my best friend will leave for Canada soon. (sad)", ["Sadly"], 1),
        ("Those computers look ________ ________. (expensive, very)", ["very expensive"], 2),
        ("My parents ________ ________ every day. (hard, work)", ["work hard"], 2),
        ("We ________ for our turn ________. (wait, patient)", ["waited patiently", "wait patiently"], 2),
        ("My new friends are ________ ________. (real, friendly)", ["really friendly"], 2),
        ("The woman ________ the window ________. (open, quiet)", ["opened quietly", "opens quietly"], 2),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2b, 1)
    ]
    out["wb-c07-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c07:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="부사 · POINT 5·6 (WB p. 50)",
        pages="50",
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
        "POINT 7·8",
    )
    u2c = [
        ("We <u>should watch always</u> out for accidents.", False, "should always watch"),
        ("I <u>forget sometimes</u> my homework.", False, "sometimes forget"),
        ("My parents <u>always are</u> proud of me.", False, "are always"),
        ("Sally <u>never eats</u> anything after 7 p.m.", True, ""),
        ("You <u>must never break</u> your promise.", True, ""),
        ("I <u>catch often</u> a cold in winter.", False, "often catch"),
        ("I <u>never will eat</u> junk food.", False, "will never eat"),
        ("The market <u>is always</u> crowded on weekends.", True, ""),
        ("I <u>take usually</u> a shower in the morning.", False, "usually take"),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u2c, 1)]
    out["wb-c07-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c07:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="빈도부사 · POINT 7·8 (WB p. 51)",
        pages="51",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        WR2,
        "words",
        labels_az("D", 7),
        "POINT 7·8",
    )
    u2d = [
        ("He ________ in front of other people. (sings / never)", ["never sings"], 2),
        ("My father ________ on business trips. (goes / often)", ["often goes"], 2),
        ("You ________ the gym for free. (use / can / sometimes)", ["can sometimes use"], 3),
        ("I ________ careful with my words. (always / am)", ["am always"], 2),
        ("Yuri ________ the promise. (keep / will / never)", ["will never keep"], 3),
        ("I ________ my grandparents. (often / visit)", ["often visit"], 2),
        ("My neighbor ________ very noisy. (sometimes / is)", ["is sometimes"], 2),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2d, 1)
    ]
    out["wb-c07-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c07:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="빈도부사 · POINT 7·8 (WB p. 51)",
        pages="51",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "밑줄 친 부분을 바르게 고치세요.",
        CORR,
        "words",
        labels_az("A", 10),
        "POINT 9·10",
    )
    u3a = [
        ("March is <u>warmmer</u> than February.", "warmer"),
        ("It is the <u>prettyest</u> park in the world.", "prettiest"),
        ("My cold is <u>worser</u> than yesterday.", "worse"),
        ("You look <u>thiner</u> than last month.", "thinner"),
        ("Today is the <u>hotest</u> day of this year.", "hottest"),
        ("My score is <u>more high</u> than hers.", "higher"),
        ("My legs are <u>more short</u> than my sister's.", "shorter"),
        ("The store sells the <u>most cheap</u> fruits in town.", "cheapest"),
        ("The player played <u>weller</u> than his team members.", "better"),
        ("The book is <u>interestinger</u> than its movie.", "more interesting"),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=[a]) for i, (p, a) in enumerate(u3a, 1)]
    out["wb-c07-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c07:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="비교급/최상급 · POINT 9·10 (WB p. 52)",
        pages="52",
        timer_minutes=22,
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
        labels_az("B", 10),
        "POINT 11·12",
    )
    u3b = [
        ("Ian is ________ than Ted. (handsome)", ["handsomer", "more handsome"]),
        ("Brian is ________ than my brother. (old)", ["older"]),
        ("It is the ________ town in this country. (peaceful)", ["most peaceful"]),
        ("Ryan's drawing is the ________ of all the drawings. (good)", ["best"]),
        ("The Earth is ________ than the Moon. (big)", ["bigger"]),
        ("My father is the ________ in my family. (busy)", ["busiest"]),
        ("Today, the school finished ________ than yesterday. (early)", ["earlier"]),
        ("The movie is ________ than the novel. (popular)", ["more popular"]),
        ("Dogs can hear ________ than humans. (well)", ["better"]),
        ("He is the ________ person of them all. (generous)", ["most generous"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3b, 1)]
    out["wb-c07-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c07:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="비교급/최상급 · POINT 11·12 (WB p. 52)",
        pages="52",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("C", 6),
        "POINT 11·12",
    )
    u3c = [
        ("I am ________ ________ my little brother. (patient)", ["more patient than"], 3),
        ("This is ________ ________ from my house. (close, supermarket)", ["the closest supermarket"], 3),
        ("This book is ________ ________ that book. (thick)", ["thicker than"], 2),
        ("Lake Baikal is ________ ________ in the world. (lake, deep)", ["the deepest lake"], 3),
        ("Terry got ________ ________ in the contest. (result, good)", ["the best result"], 3),
        ("Her health is ________ ________ last week. (bad)", ["worse than"], 2),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3c, 1)
    ]
    out["wb-c07-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c07:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="비교급/최상급 · POINT 11·12 (WB p. 53)",
        pages="53",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    bank1 = ["fast", "lucky", "exciting", "much"]
    bank2 = ["heavy", "quickly", "good", "bad"]
    sec = section(
        "D",
        "Section D",
        "빈칸에 알맞은 말을 <보기>에서 골라 적절한 형태로 바꿔 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("D", 8),
        "POINT 11·12",
        word_bank=bank1 + bank2,
    )
    u3d = [
        ("Motorcycles are ________ than bikes.", ["faster"]),
        ("She has ________ money among them.", ["the most"]),
        ("To me, baseball is ________ than soccer.", ["more exciting"]),
        ("Today was ________ day of my life.", ["the luckiest"]),
        ("What is ________ animal on land?", ["the heaviest"]),
        ("Chocolate ice cream is ________ than vanilla.", ["better"]),
        ("The drought was ________ in 100 years.", ["the worst"]),
        ("He solved the puzzle ________ than me.", ["more quickly"]),
    ]
    items = [fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3d, 1)]
    out["wb-c07-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c07:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="비교급/최상급 · POINT 11·12 (WB p. 53)",
        pages="53",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch07_wb_test(m))
    return out


def _build_ch07_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1", "[1]", "[1] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", ["1"]),
        section("2", "[2]", "[2] 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.", WR2, "words", ["2"]),
        section("3", "[3]", "[3] 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["3"]),
        section("4-5", "[4–5]", "[4–5] 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.", MC, "choice", labels_num(2, 4)),
        section("6", "[6]", "[6] 관계가 다른 하나를 고르세요.", MC, "choice", ["6"]),
        section("7", "[7]", "[7] never의 위치로 알맞은 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 비교급·최상급 연결이 바른 것을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 어법상 알맞지 않은 문장을 모두 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 우리말과 일치하도록 문장을 완성하세요.", SENT, "sentence", ["10"]),
        section("11", "[11]", "[11] 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.", MC, "choice", ["11"]),
        section("12-13", "[12–13]", "[12–13] 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(2, 12)),
        section("14", "[14]", "[14] 표를 보고 문장을 완성하세요.", WR2, "words", ["14-1", "14-2"]),
        section("15", "[15]", "[15] 표를 보고 비교급·최상급으로 완성하세요.", WR2, "words", ["15-1", "15-2", "15-3"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            choices=[
                "Rachel has a cute rabbit.",
                "Her new dress is beautiful.",
                "We had a good time together.",
                "My neighborhood is very friendly.",
                "I held the baby careful in my arms.",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q02",
            sec=secs[1],
            label="2",
            prompt_en="I will invent useful something in the future.",
            accept=["something useful"],
        ),
        mc_item(
            iid="q03",
            sec=secs[2],
            label="3",
            prompt_en="I don't have ________ interest in sports. / There isn't ________ juice in the jar.",
            choices=["many", "much", "few", "a few", "very"],
            answer_index=2,
        ),
        mc_item(
            iid="q04",
            sec=secs[3],
            label="4",
            choices=[
                "We don't have much time.",
                "I saw a little paintings there.",
                "Few people came to the party.",
                "He drinks a lot of tea every day.",
                "He knows many things about Korea.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q05",
            sec=secs[3],
            label="5",
            choices=[
                "Suddenly, I felt cold.",
                "Alex easy solved the quiz.",
                "The ballerina dances very well.",
                "Her presentation was really nice.",
                "Julie finished her homework quickly.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q06",
            sec=secs[4],
            label="6",
            choices=["month — monthly", "clear — clearly", "silent — silently", "new — newly", "different — differently"],
            answer_index=4,
        ),
        mc_item(
            iid="q07",
            sec=secs[5],
            label="7",
            prompt_en="Jenny (ⓐ) will (ⓑ) make (ⓒ) the same (ⓓ) mistake (ⓔ) again.",
            choices=["ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ"],
            answer_index=1,
        ),
        mc_item(
            iid="q08",
            sec=secs[6],
            label="8",
            choices=[
                "hot — hoter — hottest",
                "well — weller — wellest",
                "tired — tireder — tiredest",
                "much — mucher — muchest",
                "healthy — healthier — healthiest",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q09",
            sec=secs[7],
            label="9",
            choices=["①, ②", "②, ③", "②, ⑤", "③, ⑤", "②, ③, ⑤"],
            answer_index=5,
        ),
        sent_item(
            iid="q10",
            sec=secs[8],
            label="10",
            prompt_en="나는 우리 반에서 가장 큰 발을 가지고 있다. (big, feet, in my class, have)",
            accept=["I have the biggest feet in my class."],
        ),
        mc_item(
            iid="q11",
            sec=secs[9],
            label="11",
            prompt_en="________ children don't like milk.",
            choices=["A lot of", "Many", "A few", "Much", "Lots of"],
            answer_index=4,
        ),
        mc_item(
            iid="q12",
            sec=secs[10],
            label="12",
            prompt_en="The test was ________ than the last one.",
            choices=["easy", "more easier", "difficult", "more difficult", "the most difficult"],
            answer_index=4,
        ),
        mc_item(
            iid="q13",
            sec=secs[10],
            label="13",
            prompt_en="Where is the ________ subway station around here?",
            choices=["near", "nearer", "nearest", "more near", "most near"],
            answer_index=3,
        ),
        fill_item(
            iid="q14a",
            sec=secs[11],
            label="14-1",
            prompt_en="Sujin ________ (never)",
            accept=["never goes out at night", "Sujin never goes out at night"],
        ),
        fill_item(
            iid="q14b",
            sec=secs[11],
            label="14-2",
            prompt_en="Sujin ________ (usually)",
            accept=["is usually with her friends", "Sujin is usually with her friends"],
        ),
        fill_item(
            iid="q15a",
            sec=secs[12],
            label="15-1",
            prompt_en="Chair A is ________ Chair B. (expensive)",
            accept=["more expensive than"],
            blanks=1,
        ),
        fill_item(
            iid="q15b",
            sec=secs[12],
            label="15-2",
            prompt_en="Chair B is ________ Chair C. (large)",
            accept=["larger than"],
            blanks=1,
        ),
        fill_item(
            iid="q15c",
            sec=secs[12],
            label="15-3",
            prompt_en="Chair C is ________ of the three. (popular)",
            accept=["the most popular"],
            blanks=1,
        ),
    ]
    return {
        "wb-c07-test.json": build_practice(
            practice_id="cm1:wb-c07:test",
            title="WB Chapter Test",
            subtitle="Chapter 07 (WB p. 54–55)",
            pages="54–55",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c07-test",
            **m,
        )
    }


def build_ch08_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(8, "여러 가지 문장 종류")

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 10),
        "POINT 1·2·3",
    )
    u1a = [
        ("<u>Brave</u> with a new challenge.", False, "Be brave"),
        ("Please <u>sit down</u>.", True, ""),
        ("<u>Don't pushing</u> the start button.", False, "Don't push"),
        ("<u>Let's has</u> his birthday party.", False, "Let's have"),
        ("<u>Don't afraid</u> of change.", False, "Don't be afraid"),
        ("<u>Let's take</u> music lessons together.", True, ""),
        ("<u>Not close</u> the window, please.", False, "Don't close"),
        ("Let's <u>go not</u> shopping today.", False, "not go"),
        ("<u>Don't be</u> nervous. You can do this.", True, ""),
        ("Please <u>turns on</u> the light.", False, "turn on"),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1a, 1)]
    out["wb-c08-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c08:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="명령·제안 · POINT 1·2·3 (WB p. 56)",
        pages="56",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 문장을 주어진 단어를 사용하여 감탄문으로 바꿔 쓰세요.",
        WR2,
        "words",
        labels_az("B", 8),
        "POINT 4",
    )
    u1b = [
        ("This is a very funny movie. (What) → ________ this is!", ["What a funny", "What funny"], 3),
        ("Your younger sister is very cute. (How) → ________ your younger sister is!", ["How cute"], 2),
        ("This is a very expensive T-shirt! (What) → ________ this is!", ["What an expensive", "What expensive"], 3),
        ("She is wearing a very nice sweater. (What) → ________ she is wearing!", ["What a nice sweater"], 4),
        ("The elephant is very big. (How) → ________ the elephant is!", ["How big"], 2),
        ("They are very tall buildings. (What) → ________ they are!", ["What tall buildings"], 3),
        ("This chocolate cake is very delicious. (How) → ________ this chocolate cake is!", ["How delicious"], 2),
        ("Time passes very quickly. (How) → ________ time passes!", ["How quickly"], 2),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1b, 1)
    ]
    out["wb-c08-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c08:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="감탄문 · POINT 4 (WB p. 56)",
        pages="56",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("C", 7),
        "POINT 1·2·3",
    )
    u1c = [
        ("________ in the school cafeteria. (your turn, wait for)", ["Wait for your turn"], 4),
        ("________ at your friends. (yell)", ["Don't yell"], 2),
        ("________ to your guests. (polite)", ["Be polite"], 2),
        ("________ together after school. (English, study)", ["Let's study English"], 3),
        ("________ on an icy road. (careful)", ["Be careful"], 2),
        ("________ for Cathy. (a birthday present, buy)", ["Let's buy a birthday present"], 5),
        ("________ again for the class. (late)", ["Don't be late"], 3),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1c, 1)
    ]
    out["wb-c08-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c08:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="명령·제안 · POINT 1·2·3 (WB p. 57)",
        pages="57",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        SENT,
        "sentence",
        labels_az("D", 7),
        "POINT 1·2·3·4",
    )
    u1d = [
        ("(concert / go / a / to / let's) tonight.", ["Let's go to a concert tonight."]),
        ("(teeth / your / brush) after dinner.", ["Brush your teeth after dinner."]),
        ("(interesting / what / an / is / book / it) !", ["What an interesting book it is!", "What an interesting book!"]),
        ("(shake / your / don't / legs) .", ["Don't shake your legs."]),
        ("(small / world / how / the / is) !", ["How small the world is!"]),
        ("(too / play / often / computer games / don't) .", ["Don't play computer games too often."]),
        ("(take a rest / let's / at / home) today.", ["Let's take a rest at home today."]),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c08-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c08:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="명령·감탄 · POINT 1·2·3·4 (WB p. 57)",
        pages="57",
        timer_minutes=22,
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
        labels_az("A", 5),
        "POINT 6·7",
    )
    u2a = [
        ("[Who / Whose] necklace is that? / It's Nancy's.", ["Who", "Whose"], 2),
        ("[Who / When] likes the chocolate cookies?", ["Who", "When"], 1),
        ("[Where / What] countries did you visit last year?", ["Where", "What"], 2),
        ("[Whose / Which] do you prefer, oranges or bananas?", ["Whose", "Which"], 2),
        ("[What / Who] will you buy for your parents?", ["What", "Who"], 1),
    ]
    items = [_bracket_mc(sec, f"A{i}", f"a{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u2a, 1)]
    out["wb-c08-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c08:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="의문사 · POINT 6·7 (WB p. 58)",
        pages="58",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "대화가 자연스럽도록 알맞은 것을 골라 연결하세요.",
        "왼쪽과 오른쪽을 연결하세요.",
        "match",
        ["B1"],
        "POINT 6·7·8·9",
    )
    pairs = [
        {"left": "Where is Jinho jogging now?", "right": "He is jogging in the park."},
        {"left": "When can we have lunch today?", "right": "After the math class."},
        {"left": "What dessert do the kids like?", "right": "They like ice cream."},
        {"left": "How was your trip last week?", "right": "Everything was perfect."},
        {"left": "Whose gloves are those over there?", "right": "They are mine."},
        {"left": "What did you eat this morning?", "right": "I skipped breakfast."},
        {"left": "How long will the festival last?", "right": "It'll last for two weeks."},
        {"left": "Why does Robert stay at home?", "right": "Because he is so tired."},
    ]
    items = [
        match_item(
            iid="b01",
            sec=sec,
            label="B1",
            pairs=pairs,
            prompt_ko="질문 1–8과 대답 ⓐ–ⓗ 연결",
        )
    ]
    out["wb-c08-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c08:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="의문사 · POINT 6·7·8·9 (WB p. 58)",
        pages="58",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    bank_a = ["why", "how", "whose coat", "which sport"]
    bank_b = ["what size", "how far", "when", "who"]
    sec = section(
        "C",
        "Section C",
        "다음 대답을 보고 <보기>에서 알맞은 표현을 골라 빈칸에 쓰세요.",
        WR,
        "words",
        labels_az("C", 8),
        "POINT 6·7·8·9",
        word_bank=bank_a + bank_b,
    )
    u2c = [
        ("A: ________ do you like best? B: I like basketball best.", ["Which sport"]),
        ("A: ________ do you go to school? B: I go to school by bus.", ["How"]),
        ("A: ________ did you stay up late? B: Because I studied for the test.", ["Why"]),
        ("A: ________ is this? B: It is my sister's.", ["Whose coat"]),
        ("A: ________ is her boyfriend? B: Tom is her boyfriend.", ["Who"]),
        ("A: ________ do you wear? B: I wear size 38.", ["What size"]),
        ("A: ________ will you go on a school trip? B: We'll go tomorrow.", ["When"]),
        ("A: ________ is the post office? B: It's three blocks away.", ["How far"]),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["wb-c08-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c08:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="의문사 · POINT 6·7·8·9 (WB p. 59)",
        pages="59",
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
        labels_az("D", 7),
        "POINT 5·6·7·8·9",
    )
    u2d = [
        ("Where is the fire station? (the fire station)", ["Where is the fire station?"]),
        ("How much does it weigh? (weigh)", ["How much does it weigh?"]),
        ("What will you do this afternoon? (do)", ["What will you do this afternoon?"]),
        (
            "Which subject do you like, social studies or science? (subject, like)",
            ["Which subject do you like, social studies or science?"],
        ),
        ("Why did you go to bed early yesterday? (go to bed)", ["Why did you go to bed early yesterday?"]),
        ("Whose wallet is that? (wallet)", ["Whose wallet is that?"]),
        ("When did the movie end? (the movie, end)", ["When did the movie end?"]),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c08-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c08:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="의문사 · POINT 5·6·7·8·9 (WB p. 59)",
        pages="59",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 10),
        "POINT 10·11·12",
    )
    u3a = [
        ("<u>Isn't</u> he wearing a blue uniform?", True, ""),
        ("Sandra likes pizza, <u>does she</u>?", False, "doesn't she"),
        ("He is sleeping now, <u>doesn't he</u>?", False, "isn't he"),
        ("<u>Doesn't</u> this taste delicious?", True, ""),
        ("You and I will meet tomorrow, <u>won't you</u>?", False, "won't we"),
        ("<u>Doesn't</u> she live in Incheon last year?", False, "Didn't she live"),
        ("Let's go to the amusement park, <u>shall we</u>?", True, ""),
        ("You don't drive a car, <u>don't you</u>?", False, "do you"),
        ("Your father was busy yesterday, <u>isn't he</u>?", False, "wasn't he"),
        ("Give him these photos, <u>won't you</u>?", True, ""),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3a, 1)]
    out["wb-c08-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c08:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="부가·부정의문 · POINT 10·11·12 (WB p. 60)",
        pages="60",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 말을 써서 부가의문문을 완성하세요.",
        WR,
        "words",
        labels_az("B", 10),
        "POINT 10",
    )
    u3b = [
        "She knows my phone number, ________?",
        "Your brother can ride a bike, ________?",
        "The boys aren't wearing glasses, ________?",
        "Let's buy a new chair, ________?",
        "You didn't take a history class last week, ________?",
        "He was a baseball player a long time ago, ________?",
        "Bring your homework, ________?",
        "We will take a taxi today, ________?",
        "Somi and Jinho always have lunch together, ________?",
        "They weren't in the market this morning, ________?",
    ]
    u3b_ans = [
        ["doesn't she"],
        ["can't he"],
        ["are they"],
        ["shall we"],
        ["did you"],
        ["wasn't he"],
        ["will you"],
        ["won't we"],
        ["don't they"],
        ["were they"],
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a)
        for i, (p, a) in enumerate(zip(u3b, u3b_ans), 1)
    ]
    out["wb-c08-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c08:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="부가의문 · POINT 10 (WB p. 60)",
        pages="60",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "빈칸에 알맞은 말을 써서 대화를 완성하세요.",
        WR2,
        "words",
        labels_az("C", 6),
        "POINT 10·11",
    )
    u3c = [
        (
            "A: You were in the gym, ________ ________?\nB: Yes, ________ ________.",
            ["weren't you|I was", "weren't you|was I"],
            4,
        ),
        (
            "A: Your parents don't live in Korea, ________ ________?\nB: Yes, ________ ________.",
            ["do they|they do", "do they|do they"],
            4,
        ),
        (
            "A: They can't solve the question, ________ ________?\nB: No, ________ ________.",
            ["can they|they can't", "can they|can't they"],
            4,
        ),
        (
            "A: Minsu is not at home now, ________ ________?\nB: No, ________ ________.",
            ["is he|he isn't", "is he|isn't he"],
            4,
        ),
        (
            "A: Suna found her wallet, ________ ________?\nB: Yes, ________ ________.",
            ["didn't she|she did", "didn't she|did she"],
            4,
        ),
        (
            "A: She'll give a speech tomorrow, ________ ________?\nB: No, ________ ________.",
            ["won't she|she won't", "won't she|won't she"],
            4,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3c, 1)
    ]
    out["wb-c08-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c08:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="부가의문 · POINT 10·11 (WB p. 61)",
        pages="61",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어들을 사용하여 문장을 완성하세요.",
        SENT,
        "sentence",
        labels_az("D", 6),
        "POINT 10·12",
    )
    u3d = [
        ("The dogs weren't fat, were they? (fat, be)", ["The dogs weren't fat, were they?"]),
        ("She didn't watch the musical, did she? (watch, the musical)", ["She didn't watch the musical, did she?"]),
        ("Shall we have dinner? (dinner, have)", ["Shall we have dinner?"]),
        ("Isn't this watch expensive? (expensive, this watch)", ["Isn't this watch expensive?"]),
        ("Will you show me your ticket? (to me, show, your ticket)", ["Will you show me your ticket?"]),
        ("The museum opens every day, doesn't it? (open, every day)", ["The museum opens every day, doesn't it?"]),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3d, 1)]
    out["wb-c08-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c08:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="부가·부정의문 · POINT 10·12 (WB p. 61)",
        pages="61",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch08_wb_test(m))
    return out


def _build_ch08_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1", "[1]", "[1] 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["1"]),
        section("2", "[2]", "[2] 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.", WR2, "words", ["2"]),
        section("3", "[3]", "[3] 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", ["3"]),
        section("4", "[4]", "[4] 감탄문으로 바꿔 쓰세요.", SENT, "sentence", ["4"]),
        section("5-6", "[5–6]", "[5–6] (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 5)),
        section("7", "[7]", "[7] 두 문장의 의미가 일치하도록 빈칸에 알맞은 말을 쓰세요.", WR, "words", ["7"]),
        section("8", "[8]", "[8] 대화의 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 빈칸에 들어갈 단어가 나머지와 다른 하나를 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["10"]),
        section("11", "[11]", "[11] 밑줄 친 부분이 어법상 알맞은 것을 고르세요.", MC, "choice", ["11"]),
        section("12", "[12]", "[12] 대화의 응답에 대한 알맞은 질문을 완성하세요.", WR2, "words", ["12-1", "12-2"]),
        section("13", "[13]", "[13] 대화가 어색한 것을 고르세요.", MC, "choice", ["13"]),
        section("14", "[14]", "[14] 어법상 알맞은 문장을 모두 고르세요.", MC, "choice", ["14"]),
        section("15", "[15]", "[15] 어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.", MC, "choice", ["15"]),
        section("16", "[16]", "[16] 부가의문문을 완성하세요.", WR, "words", ["16-1", "16-2", "16-3"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Please ________ patient and wait.",
            choices=["be", "do", "does", "don't", "let's"],
            answer_index=1,
        ),
        fill_item(
            iid="q02",
            sec=secs[1],
            label="2",
            prompt_en="Let's forget not our promise.",
            accept=["Let's not forget", "not forget|Let's not forget"],
            blanks=2,
        ),
        mc_item(
            iid="q03",
            sec=secs[2],
            label="3",
            choices=[
                "Close the door, please.",
                "Be careful on the crowded street.",
                "Drink warm water and get some sleep.",
                "Take a walk with your dog every day.",
                "Be not late again.",
            ],
            answer_index=5,
        ),
        sent_item(
            iid="q04",
            sec=secs[3],
            label="4",
            prompt_en="The question is really easy. → How ________!",
            accept=["How easy the question is!", "How easy it is!"],
        ),
        mc_item(
            iid="q05",
            sec=secs[4],
            label="5",
            prompt_en="(A) polite to your grandparents. / (B) swim in the river.",
            choices=["Be — Don't", "Be — Doesn't", "Don't — be", "Don't — Don't", "Doesn't — Don't"],
            answer_index=1,
        ),
        mc_item(
            iid="q06",
            sec=secs[4],
            label="6",
            prompt_en="(A) did you visit your grandmother? / (B) did you get there?",
            choices=["When — What", "What — Where", "When — How", "How — How", "What — Where"],
            answer_index=3,
        ),
        fill_item(
            iid="q07",
            sec=secs[5],
            label="7",
            prompt_en="Keep your eyes open.\n= ________ close your eyes.",
            accept=["Don't", "Do not"],
        ),
        mc_item(
            iid="q08",
            sec=secs[6],
            label="8",
            prompt_en="A: ________ dessert do you want after dinner, cake or ice cream?\nB: I want ice cream.",
            choices=["Which", "Where", "How", "Why", "When"],
            answer_index=1,
        ),
        mc_item(
            iid="q09",
            sec=secs[7],
            label="9",
            choices=[
                "________ tall are you?",
                "________ much is this backpack?",
                "________ color did you choose?",
                "________ old is your grandfather?",
                "________ many children do you have?",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q10",
            sec=secs[8],
            label="10",
            prompt_en="정말 재미있는 사진이구나!",
            choices=[
                "What funny it is!",
                "How a funny photo is!",
                "What a funny photo it is!",
                "How really funny photo is!",
                "What a really funny photo is!",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q11",
            sec=secs[9],
            label="11",
            choices=[
                "He is not busy, isn't he?",
                "She came late, doesn't she?",
                "You like English, aren't you?",
                "Your sister likes pasta, doesn't it?",
                "The children can't jump high, can they?",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q12a",
            sec=secs[10],
            label="12-1",
            prompt_en="(1) ________ is the park? / It's about 2 kilometers from here.",
            accept=["How far"],
        ),
        fill_item(
            iid="q12b",
            sec=secs[10],
            label="12-2",
            prompt_en="(2) How ________ get there?",
            accept=["do you", "can you"],
        ),
        mc_item(
            iid="q13",
            sec=secs[11],
            label="13",
            choices=[
                "A: How old are you? B: I'm 14 years old.",
                "A: How tall is your father? B: He is 175 centimeters.",
                "A: What's your favorite subject? B: Math is my favorite subject.",
                "A: How often do you go swimming? B: About an hour.",
                "A: What do you usually do on Saturdays? B: I visit my grandparents.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q14",
            sec=secs[12],
            label="14",
            choices=["①, ③", "③, ④", "③, ④, ⑤", "②, ④", "①, ⑤"],
            answer_index=2,
        ),
        mc_item(
            iid="q15",
            sec=secs[13],
            label="15",
            choices=["ⓐ, ⓑ, ⓒ", "ⓒ, ⓓ, ⓕ", "ⓐ, ⓓ, ⓕ", "ⓑ, ⓒ, ⓓ", "ⓑ, ⓒ, ⓔ"],
            answer_index=4,
        ),
        fill_item(iid="q16a", sec=secs[14], label="16-1", prompt_en="You can't join us, ________?", accept=["can you"]),
        fill_item(iid="q16b", sec=secs[14], label="16-2", prompt_en="She went to the museum, ________?", accept=["didn't she"]),
        fill_item(
            iid="q16c",
            sec=secs[14],
            label="16-3",
            prompt_en="They were in New York last month, ________?",
            accept=["weren't they"],
        ),
    ]
    return {
        "wb-c08-test.json": build_practice(
            practice_id="cm1:wb-c08:test",
            title="WB Chapter Test",
            subtitle="Chapter 08 (WB p. 62–63)",
            pages="62–63",
            timer_minutes=28,
            sections=secs,
            items=items,
            test_id="wb-c08-test",
            **m,
        )
    }


def build_review_02() -> dict[str, dict]:
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section("3", "[3]", "[3] 명사의 단수형과 복수형이 잘못 연결된 것을 고르세요.", MC, "choice", ["3"]),
        section("4-5", "[4–5]", "[4–5] 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.", MC, "choice", labels_num(2, 4)),
        section("6", "[6]", "[6] 빈칸에 들어갈 단어가 나머지와 다른 하나를 고르세요.", MC, "choice", ["6"]),
        section("7-8", "[7–8]", "[7–8] 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", labels_num(2, 7)),
        section("9-10", "[9–10]", "[9–10] (A), (B)를 알맞은 형태로 고쳐 쓰세요.", WR2, "words", labels_num(2, 9)),
        section("11", "[11]", "[11] It의 쓰임이 <보기>와 다른 하나를 고르세요.", MC, "choice", ["11"]),
        section("12-13", "[12–13]", "[12–13] (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 12)),
        section("14", "[14]", "[14] 비교급과 최상급 형태가 잘못 연결된 것을 고르세요.", MC, "choice", ["14"]),
        section("15-16", "[15–16]", "[15–16] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(2, 15)),
        section("17-18", "[17–18]", "[17–18] 어법상 알맞은 문장을 고르세요.", MC, "choice", labels_num(2, 17)),
        section("19-20", "[19–20]", "[19–20] 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", labels_num(2, 19)),
        section("21", "[21]", "[21] 대화의 빈칸에 들어갈 알맞은 말을 고르세요.", MC, "choice", ["21"]),
        section("22-24", "[22–24]", "[22–24] 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", labels_num(3, 22)),
        section("25", "[25]", "[25] 어법상 알맞지 않은 문장을 모두 고르세요.", MC, "choice", ["25"]),
        section("26", "[26]", "[26] 대화에서 밑줄 친 부분이 어법상 알맞은 것을 고르세요.", MC, "choice", ["26"]),
        section("27-29", "[27–29]", "[27–29] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.", SENT, "sentence", labels_num(3, 27)),
        section("30", "[30]", "[30] (A), (B), (C)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", ["30"]),
        section("31", "[31]", "[31] 어법상 알맞지 않은 두 개를 찾아 바르게 고쳐 쓰세요.", WR2, "words", ["31"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="There are ________ in the kitchen.",
            choices=["bananas", "two pieces of cake", "four dishes", "meat", "knives"],
            answer_index=4,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="She has a few ________.",
            choices=["toys", "friends", "potatoes", "coins", "money"],
            answer_index=5,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            choices=["tree — trees", "wife — wives", "class — classes", "candy — candies", "woman — womans"],
            answer_index=5,
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            choices=[
                "My brother cut a loaf of bread in half.",
                "We will buy a few strawberries for dessert.",
                "There was little paper in the copy machine.",
                "Jake doesn't have many furniture in his room.",
                "I prepared two cups of coffee for my parents.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            choices=[
                "Cindy has more pets than Jinho.",
                "She is the most smart in my class.",
                "You don't know my teacher, do you?",
                "Juice is more popular than tea in the cafe.",
                "He should take care of his sister today, shouldn't he?",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            choices=[
                "________ there dark clouds in the sky last night?",
                "There ________ a lot of tourists here last summer.",
                "There ________ strong trust between us long ago.",
                "________ there many people in the stadium yesterday?",
                "There ________ two glasses of water on the table a few minutes ago.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            choices=[
                "There were many visitors in the museum.",
                "Could you give me a glass of milk?",
                "They ate three slices of pizza.",
                "There are many monkeys in the zoo.",
                "May I turn off a radio? It's too loud.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q08",
            sec=secs[4],
            label="8",
            choices=[
                "Do you have a little salt?",
                "My sister made a few juice.",
                "Jisu read few books this year.",
                "He doesn't have much money.",
                "Ann and Max are my classmates. They are kind.",
            ],
            answer_index=2,
        ),
        fill_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en="There (A) was a lot of birds / Two (B) sheet of paper",
            accept=["were|sheets", "was|sheets"],
            blanks=2,
        ),
        fill_item(
            iid="q10",
            sec=secs[5],
            label="10",
            prompt_en="(A) It's legs / (B) hers umbrella",
            accept=["Its|her", "It's|her"],
            blanks=2,
        ),
        mc_item(
            iid="q11",
            sec=secs[6],
            label="11",
            prompt_en="<보기> It was so cold yesterday.",
            choices=[
                "It was my homework.",
                "It was so bright outside.",
                "It takes 30 minutes by bus.",
                "It's 3 kilometers to the library.",
                "It's 8 o'clock. The bus will arrive soon.",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q12",
            sec=secs[7],
            label="12",
            prompt_en="Jane won't buy the pants. (A) / blame (B) for your mistake.",
            choices=["It — you", "They — yourself", "It — yourself", "They — you", "Them — yourself"],
            answer_index=2,
        ),
        mc_item(
            iid="q13",
            sec=secs[7],
            label="13",
            prompt_en="Your computer is (A) than mine. / (B) cafe in my town.",
            choices=[
                "expensiver — better",
                "expensiver — the best",
                "more expensive — best",
                "expensiver — the goodest",
                "more expensive — the best",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q14",
            sec=secs[8],
            label="14",
            choices=[
                "taller — tallest",
                "prettier — prettiest",
                "bigger — biggest",
                "worse — worst",
                "more healthy — most healthy",
            ],
            answer_index=5,
        ),
        sent_item(
            iid="q15",
            sec=secs[9],
            label="15",
            prompt_en="그들은 아침에 항상 과일을 먹는다. (they / fruit / eat / always)",
            accept=["They always eat fruit in the morning.", "They always eat fruit."],
        ),
        sent_item(
            iid="q16",
            sec=secs[9],
            label="16",
            prompt_en="Where is the most famous bakery near your house? (the / is / famous / bakery / where / most)",
            accept=["Where is the most famous bakery near your house?"],
        ),
        mc_item(
            iid="q17",
            sec=secs[10],
            label="17",
            choices=[
                "Polite to your teacher.",
                "His bag is new, but her is old.",
                "We met Emily parents in the bank.",
                "Do you know those man over there?",
                "Whose gloves are those on the desk?",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q18",
            sec=secs[10],
            label="18",
            choices=[
                "He was really proud of herself.",
                "The kid can't carry anything heavy.",
                "I need a new towel. Do you have it?",
                "Nancy arrives usually at school early.",
                "Everyone like the pasta of the restaurant.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q19",
            sec=secs[11],
            label="19",
            prompt_en="그녀는 정말 착한 학생이구나!",
            choices=[
                "How kind student she is!",
                "What kind student she is!",
                "How a kind student she is!",
                "What a kind student she is!",
                "What a kind student is she!",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q20",
            sec=secs[11],
            label="20",
            prompt_en="너는 왜 공항에 있었니?",
            choices=[
                "Why you were in the airport?",
                "How you were in the airport?",
                "Why were you in the airport?",
                "How were you in the airport?",
                "What were you in the airport?",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q21",
            sec=secs[12],
            label="21",
            prompt_en="A: ________ B: I like fish more than meat.",
            choices=[
                "Where do you buy fish?",
                "What did you eat yesterday?",
                "How much meat or fish do you eat?",
                "Why do you like fish more than meat?",
                "Which do you like better, meat or fish?",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q22",
            sec=secs[13],
            label="22",
            prompt_en="________ often do you cut your hair? / ________ was the music festival last Sunday?",
            choices=["What", "When", "Which", "How", "Whose"],
            answer_index=4,
        ),
        mc_item(
            iid="q23",
            sec=secs[13],
            label="23",
            prompt_en="________ not tell the secret to others. / ________ your best in today's game.",
            choices=["Did", "Please", "Do", "Does", "Be"],
            answer_index=3,
        ),
        mc_item(
            iid="q24",
            sec=secs[13],
            label="24",
            prompt_en="I lost ________ pen today. / ________ most expensive in the store.",
            choices=["the", "a", "it", "an", "very"],
            answer_index=1,
        ),
        mc_item(
            iid="q25",
            sec=secs[14],
            label="25",
            choices=["②, ③", "②, ④", "③, ④", "③, ⑤", "②, ③, ⑤"],
            answer_index=5,
        ),
        mc_item(
            iid="q26",
            sec=secs[15],
            label="26",
            prompt_en="Tag question dialogue (underlined options ①–⑤)",
            choices=["① don't you", "② No, I won't", "③ that is a holiday", "④ some plans", "⑤ Let's watches"],
            answer_index=2,
        ),
        sent_item(
            iid="q27",
            sec=secs[16],
            label="27",
            prompt_en="Don't be nervous on the stage. (nervous, be)",
            accept=["Don't be nervous on the stage.", "Do not be nervous on the stage."],
        ),
        sent_item(
            iid="q28",
            sec=secs[16],
            label="28",
            prompt_en="He is stronger than his brother. (strong, be)",
            accept=["He is stronger than his brother."],
        ),
        sent_item(
            iid="q29",
            sec=secs[16],
            label="29",
            prompt_en="You didn't watch the movie, did you? (the movie, watch)",
            accept=["You didn't watch the movie, did you?", "You did not watch the movie, did you?"],
        ),
        mc_item(
            iid="q30",
            sec=secs[17],
            label="30",
            prompt_en="(A) Mina's birthday / (B) juice / (C) shirt gift",
            choices=[
                "It's — a few — love",
                "It's — a little — lovely",
                "That's — a little — lovely",
                "It's — a few — beautiful",
                "That's — a little — beautifully",
            ],
            answer_index=2,
        ),
        fill_item(
            iid="q31",
            sec=secs[18],
            label="31",
            prompt_en="Dialogue errors ⓐ–ⓔ: find two and correct.",
            accept=["e|Call", "ⓔ|Call", "e|Call|Calls"],
            blanks=3,
        ),
    ]
    return {
        "review-02.json": build_practice(
            practice_id="cm1:review-02",
            title="총괄평가 2회",
            subtitle="Ch05–08 (WB pp. 64–67 · PDF 217–220)",
            pages="217–220",
            timer_minutes=45,
            unit_id="review-02",
            unit_title="총괄평가 2회 (Ch05–08)",
            sections=secs,
            items=items,
        )
    }


if __name__ == "__main__":
    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("ch06wb", "ch06"):
        data = build_ch06_wb()
        _write_docs(data, chapter=6)
        print(f"chapter 06 wb: wrote {len(data)} files")
    elif fn in ("ch07wb", "ch07"):
        data = build_ch07_wb()
        _write_docs(data, chapter=7)
        print(f"chapter 07 wb: wrote {len(data)} files")
    elif fn in ("ch08wb", "ch08"):
        data = build_ch08_wb()
        _write_docs(data, chapter=8)
        print(f"chapter 08 wb: wrote {len(data)} files")
    elif fn == "review-02":
        data = build_review_02()
        _write_docs(data, chapter=None, review_dir="review-02")
        print("review-02: wrote 1 file")
    else:
        d6 = build_ch06_wb()
        _write_docs(d6, chapter=6)
        d7 = build_ch07_wb()
        _write_docs(d7, chapter=7)
        d8 = build_ch08_wb()
        _write_docs(d8, chapter=8)
        dr = build_review_02()
        _write_docs(dr, chapter=None, review_dir="review-02")
        print(f"wrote ch06 wb ({len(d6)}) + ch07 wb ({len(d7)}) + ch08 wb ({len(d8)}) + review-02 ({len(dr)})")
