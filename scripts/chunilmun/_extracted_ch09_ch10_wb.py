#!/usr/bin/env python3
"""Scan-extracted workbook data for Ch09–Ch10 — 천일문 Grammar 1.

Source PNGs: artifacts/ch09-10-pages/wb/ (uploads/ch09-10-wb.pdf).
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


def _sym(sec, label: str, iid: str, prompt: str, key: str) -> dict:
    keys = {
        "a": ["a", "ⓐ", "A"],
        "b": ["b", "ⓑ", "B"],
        "c": ["c", "ⓒ", "C"],
    }
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=keys[key])


def _write_docs(data: dict[str, dict], *, chapter: int) -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "..", "data", "chunilmun1")
    for name, doc in data.items():
        path = os.path.join(root, f"chapter{chapter:02d}", name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")


def build_ch09_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(9, "문장의 여러 형식")

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 10),
        "POINT 1·2",
    )
    u1a = [
        ("The sandwich <u>smells badly</u>.", False, "smells bad"),
        ("My favorite season <u>is summer</u>.", True, ""),
        ("Everyone <u>became silently</u> after his speech.", False, "became silent"),
        ("Judy <u>is my best friendly</u>.", False, "is my best friend"),
        ("Leaves <u>turn red and yellow</u> in autumn.", True, ""),
        ("Those green apples <u>taste sour</u>.", True, ""),
        ("The doll <u>looks a real girl</u>.", False, "looks like a real girl"),
        ("These days I <u>get anger</u> very easily.", False, "get angry"),
        ("The blanket <u>feels like</u> a cloud.", True, ""),
        ("The good medicine <u>tastes bitter</u>.", True, ""),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1a, 1)]
    out["wb-c09-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c09:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="SVC · POINT 1·2 (WB p. 68)",
        pages="68",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "<보기>와 같이 주어진 단어를 알맞게 변형하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 2",
    )
    u1b = [
        (
            "(taste)\nThe cake ________ cheese.\nThe ice cream ________ sweet.",
            ["tastes like|tastes", "tastes like|taste"],
            2,
        ),
        (
            "(smell)\nThis shampoo ________ nice.\nThe soap ________ a lemon.",
            ["smells|smells like", "smells|smell like"],
            2,
        ),
        (
            "(look)\nTony ________ weak, but he's very strong.\nThe dog ________ a wolf in the dark.",
            ["looks|looks like"],
            2,
        ),
        (
            "(sound)\nYour voice ________ your dad's voice.\nHer new song ________ very sad to me.",
            ["sounds like|sounds", "sounds|sounds"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u1b, 1)
    ]
    out["wb-c09-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c09:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="SVC · POINT 2 (WB p. 68)",
        pages="68",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 단어를 <보기>에서 골라 문장을 완성하세요.",
        WR,
        "words",
        labels_az("C", 6),
        "POINT 1·2",
        word_bank=["strange", "fresh", "rich", "cheap", "salty", "sleepy"],
    )
    u1c = [
        ("His story ________ ________.\n(그의 이야기는 이상하게 들린다.)", ["sounds|strange"]),
        ("At last, Helen ________ ________.\n(마침내, Helen은 부유해졌다.)", ["became|rich"]),
        ("The corn soup ________ ________.\n(그 옥수수 수프는 짠맛이 난다.)", ["tastes|salty"]),
        ("These days strawberries ________ ________.\n(요즘 딸기는 저렴하다.)", ["are|cheap"]),
        ("We ________ ________ easily in spring.\n(우리는 봄에 쉽게 졸음을 느낀다.)", ["feel|sleepy"]),
        ("The fruits ________ ________.\n(그 과일은 신선한 냄새가 난다.)", ["smell|fresh"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=2)
        for i, (p, a) in enumerate(u1c, 1)
    ]
    out["wb-c09-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c09:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="SVC · POINT 1·2 (WB p. 69)",
        pages="69",
        timer_minutes=20,
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
        "POINT 1·2",
    )
    u1d = [
        ("(an honest boy / he / is)\n→ ________________________________________________.", ["He is an honest boy."]),
        ("(felt / roommate / my / lonely)\n→ ________________________________________________.", ["My roommate felt lonely."]),
        ("(boring / sounds / his / speech)\n→ ________________________________________________.", ["His speech sounds boring."]),
        ("(became / she / an English teacher)\n→ ________________________________________________.", ["She became an English teacher."]),
        ("(grapes / sour / taste / these)\n→ ________________________________________________.", ["These grapes taste sour."]),
        ("(your / dirty / shoes / look)\n→ ________________________________________________.", ["Your shoes look dirty."]),
        (
            "(butter / like / fresh / bread / smells)\n→ ________________________________________________.",
            ["Fresh bread smells like butter.", "The fresh bread smells like butter."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c09-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c09:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="SVC · POINT 1·2 (WB p. 69)",
        pages="69",
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
        labels_az("A", 7),
        "POINT 3·4",
    )
    u2a = [
        ("Eddie will lend his pen [to her / for her].", ["to her", "for her"], 1),
        ("Would you get [me some paper / some paper me]?", ["me some paper", "some paper me"], 1),
        ("He didn't show [his parents his painting / his painting his parents].", ["his parents his painting", "his painting his parents"], 1),
        ("When are you going to write a letter [to her / of her]?", ["to her", "of her"], 1),
        ("Please tell [me the secret / the secret me].", ["me the secret", "the secret me"], 1),
        ("My father teaches [history to students / students to history] at college.", ["history to students", "students to history"], 2),
        ("She passed [the book to me / me to the book].", ["the book to me", "me to the book"], 1),
    ]
    items = [_bracket_mc(sec, f"A{i}", f"a{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u2a, 1)]
    out["wb-c09-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c09:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="SVOO · POINT 3·4 (WB p. 70)",
        pages="70",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        SENT,
        "sentence",
        labels_az("B", 7),
        "POINT 3·4",
    )
    u2b = [
        ("(my age / asked / me)\n→ Brian ____________________.", ["Brian asked me my age.", "Brian asked me about my age."]),
        ("(this message / her / send / to)\n→ Please ____________________.", ["Please send this message to her.", "Please send her this message."]),
        (
            "(his favorite place / me / showed / to)\n→ Dan ____________________.",
            ["Dan showed me his favorite place.", "Dan showed his favorite place to me."],
        ),
        ("(her name card / gave / me)\n→ She ____________________.", ["She gave me her name card."]),
        ("(you / ask / a favor / of)\n→ Can I ____________________?", ["Can I ask a favor of you?", "Can I ask you a favor?"]),
        ("(chicken soup / his parents / cooked)\n→ He ____________________.", ["He cooked his parents chicken soup.", "He cooked chicken soup for his parents."]),
        (
            "(her daughter / a doll / made / for)\n→ Daisy ____________________.",
            ["Daisy made her daughter a doll.", "Daisy made a doll for her daughter."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["wb-c09-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c09:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="SVOO · POINT 3·4 (WB p. 70)",
        pages="70",
        timer_minutes=22,
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
        labels_az("C", 8),
        "POINT 3·4",
    )
    u2c = [
        ("We made a cage <u>the bird</u>.", False, "the bird a cage"),
        ("My mother bought <u>me a concert ticket</u>.", True, ""),
        ("Please read <u>a storybook us</u>.", False, "us a storybook"),
        ("He told his plan <u>of his friends</u>.", False, "his friends his plan"),
        ("Vince sent <u>her a box of chocolate</u>.", True, ""),
        ("Dad gave the umbrella <u>of my brother</u>.", False, "to my brother"),
        ("Will you lend <u>your eraser to me</u>?", True, ""),
        ("My grandpa got <u>us two bikes</u>.", True, ""),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u2c, 1)]
    out["wb-c09-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c09:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="SVOO · POINT 3·4 (WB p. 71)",
        pages="71",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "주어진 문장을 <보기>와 같이 전치사가 포함된 문장으로 바꿔 쓰세요.",
        SENT,
        "sentence",
        labels_az("D", 6),
        "POINT 4",
    )
    u2d = [
        ("Please lend me some money.\n→ Please lend ________________________________.", ["Please lend some money to me."]),
        ("Doris always tells us her dreams.\n→ Doris always tells ________________________________.", ["Doris always tells her dreams to us."]),
        ("Harry gave his sister some coins.\n→ Harry gave ________________________________.", ["Harry gave some coins to his sister."]),
        ("They made their son a birthday cake.\n→ They made ________________________________.", ["They made a birthday cake for their son."]),
        ("She cooked us a chicken.\n→ She cooked ________________________________.", ["She cooked a chicken for us."]),
        (
            "The man showed me the way to the zoo.\n→ The man showed ________________________________.",
            ["The man showed the way to the zoo to me."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c09-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c09:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="SVOO · POINT 4 (WB p. 71)",
        pages="71",
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
        labels_az("A", 7),
        "POINT 5·6",
    )
    u3a = [
        ("We found Jieun [smart / smartly].", ["smart", "smartly"], 1),
        ("She [became / made] her son a great pianist.", ["became", "made"], 2),
        ("They [called / found] the box empty.", ["called", "found"], 2),
        ("She left the trash can [full / fully].", ["full", "fully"], 1),
        ("My friends [call / say] me Dancing Queen.", ["call", "say"], 1),
        ("The magician made the children [happy / happily].", ["happy", "happily"], 1),
        ("The police have to keep people [safe / safely].", ["safe", "safely"], 1),
    ]
    items = [_bracket_mc(sec, f"A{i}", f"a{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u3a, 1)]
    out["wb-c09-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c09:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="SVOC · POINT 5·6 (WB p. 72)",
        pages="72",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "우리말과 일치하도록 주어진 단어와 <보기>의 동사를 사용하여 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("B", 5),
        "POINT 5·6",
        word_bank=["make", "leave", "find", "call", "name"],
    )
    u3b = [
        ("Don't _______ the window _______. (open)", ["leave|open"], 2),
        ("He _______ his puppy _______. (Captain)", ["named|Captain"], 2),
        ("I _______ my neighborhood _______. (friendly)", ["found|friendly"], 2),
        ("We _______ him _______. (a top model)", ["call|a top model"], 2),
        ("Oil _______ the country _______. (rich)", ["made|rich"], 2),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3b, 1)
    ]
    out["wb-c09-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c09:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="SVOC · POINT 5·6 (WB p. 72)",
        pages="72",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        SENT,
        "sentence",
        labels_az("C", 6),
        "POINT 5·6",
    )
    u3c = [
        ("(alone / leave / me)\n→ Please don't ________________.", ["Please don't leave me alone."]),
        ("(your hands / soft / make)\n→ This cream will ________________.", ["This cream will make your hands soft."]),
        ("(the old man / wise / found)\n→ We ________________.", ["We found the old man wise."]),
        ("(Joe / the little boy / called)\n→ They ________________.", ["They called the little boy Joe."]),
        ("(the next page / blank / leave)\n→ Please ________________.", ["Please leave the next page blank."]),
        ("(clean / makes / the air)\n→ This plant ________________.", ["This plant makes the air clean."]),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["wb-c09-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c09:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="SVOC · POINT 5·6 (WB p. 73)",
        pages="73",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X 하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("D", 8),
        "POINT 5·6",
    )
    u3d = [
        ("Don't make <u>me madly</u>, please.", False, "me mad"),
        ("Neil named <u>Leo his cat</u>.", False, "his cat Leo"),
        ("Please don't leave <u>your room dirty</u>.", True, ""),
        ("They found <u>the girl lovely</u>.", True, ""),
        ("Good food will make <u>you health</u>.", False, "you healthy"),
        ("The song made <u>him a rich man</u>.", True, ""),
        ("Keep <u>your hands clean</u>.", True, ""),
        ("My friends <u>call to me Messi</u>.", False, "call me Messi"),
    ]
    items = [_ox(sec, f"D{i}", f"d{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3d, 1)]
    out["wb-c09-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c09:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="SVOC · POINT 5·6 (WB p. 73)",
        pages="73",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch09_wb_test(m))
    return out


def _build_ch09_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 어법상 알맞지 않은 문장 두 개를 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section("3-4", "[3–4]", "[3–4] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.", MC, "choice", labels_num(2, 3)),
        section("5-6", "[5–6]", "[5–6] 다음 <보기>와 같이 문장을 바꿔 쓰세요.", SENT, "sentence", labels_num(2, 5)),
        section("7", "[7]", "[7] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 다음 중 빈칸에 들어갈 단어가 나머지와 다른 하나를 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 밑줄 친 made의 쓰임이 나머지와 다른 하나를 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 다음 중 어법상 알맞지 않은 문장을 찾아 그 번호를 쓰고 바르게 고쳐 쓰세요.", WR2, "words", ["10"]),
        section("11", "[11]", "[11] 주어진 우리말을 영작할 때, 세 번째로 오는 단어를 고르세요.", MC, "choice", ["11"]),
        section("12-13", "[12–13]", "[12–13] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(2, 12)),
        section("14", "[14]", "[14] 다음 중 어법상 알맞은 문장끼리 바르게 짝지어진 것을 고르세요.", MC, "choice", ["14"]),
        section("15-16", "[15–16]", "[15–16] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 고친 후 문장 전체를 다시 쓰세요.", SENT, "sentence", labels_num(2, 15)),
        section("17", "[17]", "[17] 우리말과 일치하도록 <조건>에 맞게 문장을 쓰세요.", SENT, "sentence", ["17"]),
    ]
    items = [
        choose_all_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="① Jack showed us his room.\n② Will you pass the cup me?\n③ Please give me a call today.\n④ Woody and I are good friends.\n⑤ You're always importantly to me.",
            accept_pairs=[("2", "5")],
        ),
        choose_all_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="① The kittens look so cute.\n② She told to us the story.\n③ The pancake tasted so good.\n④ Mike sent a little present to me.\n⑤ My report card made my mom angrily.",
            accept_pairs=[("2", "5")],
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="The girl looks ________.",
            choices=["pretty", "sadly", "happy", "sleepy", "lovely"],
            answer_index=2,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en="We ________ the box to Cindy.",
            choices=["bought", "passed", "showed", "sent", "gave"],
            answer_index=1,
        ),
        sent_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="Her mother made me delicious pizza.\n→ ________________________________",
            accept=["Her mother made delicious pizza for me."],
        ),
        sent_item(
            iid="q06",
            sec=secs[2],
            label="6",
            prompt_en="Mr. Smith wrote a postcard to me.\n→ ________________________________",
            accept=["Mr. Smith wrote me a postcard."],
        ),
        mc_item(
            iid="q07",
            sec=secs[3],
            label="7",
            prompt_en="Your idea sounds (A).\nDon't leave the door (B).",
            choices=["great — open", "great — openly", "like great — open", "greatly — openly", "like great — openly"],
            answer_index=1,
        ),
        mc_item(
            iid="q08",
            sec=secs[4],
            label="8",
            choices=[
                "She passed the ball ________ me.",
                "He showed his diary ________ me.",
                "Please teach taekwondo ________ us.",
                "I lent a comfortable chair ________ him.",
                "Mom made a beautiful dress ________ me.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            choices=[
                "The music <u>made</u> us sleepy.",
                "He <u>made</u> many people happy.",
                "The cook <u>made</u> delicious pasta for me.",
                "The noises <u>made</u> them really angry.",
                "The surprise party <u>made</u> her glad.",
            ],
            answer_index=3,
        ),
        fill_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en="① It's my birthday today.\n② Mom bought me a bike.\n③ It looked great.\n④ Dad made me a birthday cake.\n⑤ It tasted like very good.\n번호 → 교정문",
            accept=["5|It tasted very good.", "5|It tasted very good"],
            blanks=2,
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en="우리는 그가 모두에게 친절하다는 것을 알게 되었다.",
            choices=["found", "him", "kind", "everyone", "we"],
            answer_index=3,
        ),
        sent_item(
            iid="q12",
            sec=secs[8],
            label="12",
            prompt_en="(the salt / to / can / pass / me / you)\n→ ________________________________________________ ?",
            accept=["Can you pass the salt to me?", "Can you pass me the salt?"],
        ),
        sent_item(
            iid="q13",
            sec=secs[8],
            label="13",
            prompt_en="(keeps / beautiful / my / garden / her / grandmother)\n→ ________________________________________________ .",
            accept=["My grandmother keeps her garden beautiful."],
        ),
        mc_item(
            iid="q14",
            sec=secs[9],
            label="14",
            prompt_en=(
                "ⓐ They all look different.\n"
                "ⓑ The apple smells sweet.\n"
                "ⓒ He sent an invitation to me.\n"
                "ⓓ Our teacher gave us homework.\n"
                "ⓔ My father bought a new cell phone me."
            ),
            choices=["ⓐ, ⓑ, ⓓ", "ⓐ, ⓑ, ⓒ, ⓓ", "ⓑ, ⓒ, ⓔ", "ⓑ, ⓒ, ⓓ, ⓔ", "ⓒ, ⓓ, ⓔ"],
            answer_index=2,
        ),
        sent_item(
            iid="q15",
            sec=secs[10],
            label="15",
            prompt_en="Ben showed his cat us.",
            accept=["Ben showed us his cat."],
        ),
        sent_item(
            iid="q16",
            sec=secs[10],
            label="16",
            prompt_en="The river looks a mirror.",
            accept=["The river looks like a mirror."],
        ),
        sent_item(
            iid="q17",
            sec=secs[11],
            label="17",
            prompt_en=(
                "이 비누는 당신의 더러운 셔츠를 하얗게 만들어 준다.\n"
                "(make, this soap, dirty shirt — 일곱 단어)"
            ),
            accept=["This soap makes your dirty shirt white."],
        ),
    ]
    return {
        "wb-c09-test.json": build_practice(
            practice_id="cm1:wb-c09:test",
            title="WB Chapter Test",
            subtitle="Chapter 09 (WB p. 74–75)",
            pages="74–75",
            timer_minutes=30,
            sections=secs,
            items=items,
            test_id="wb-c09-test",
            **m,
        )
    }


def build_ch10_wb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = wb(10, "to부정사와 동명사")

    sec = section(
        "A",
        "Section A",
        "밑줄 친 to부정사의 쓰임을 <보기>에서 골라 그 기호를 쓰세요.",
        WR,
        "words",
        labels_az("A", 10),
        "POINT 1·2·3",
    )
    u1a = [
        ("<u>To send</u> emails is quick and easy.", "a"),
        ("Jin's hobby is <u>to take</u> pictures.", "b"),
        ("She wants <u>to study</u> Korean history.", "c"),
        ("Julie's aim is <u>to change</u> the world.", "b"),
        ("The company began <u>to produce</u> cars.", "c"),
        ("<u>To worry</u> too much is bad for your health.", "a"),
        ("Ted hoped <u>to find</u> his dog.", "c"),
        ("My plan was <u>to read</u> 10 books a month.", "b"),
        ("You need <u>to remember</u> your ID and password.", "c"),
        ("<u>To protect</u> the environment is necessary.", "a"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u1a, 1)]
    out["wb-c10-u1-A.json"] = build_practice(
        practice_id="cm1:wb-c10:u1-A",
        title="Workbook Unit 1 — Section A",
        subtitle="to부정사 명사적 쓰임 · POINT 1·2·3 (WB p. 76)",
        pages="76",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 말을 <보기>에서 골라 적절한 형태로 바꿔 문장을 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("B", 7),
        "POINT 3",
        word_bank=["watch", "live", "buy", "change", "meet", "make", "work"],
    )
    u1b = [
        ("I want ________ in a big house.", ["to live"]),
        ("We decided ________ our minds.", ["to change"]),
        ("I expect ________ new friends.", ["to meet"]),
        ("Tom wished ________ a new camera.", ["to buy"]),
        ("He planned ________ his grandmother next Sunday.", ["to meet"]),
        ("She started ________ for the company in 2015.", ["to work"]),
        ("My brother loves ________ sports games at home.", ["to watch"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["wb-c10-u1-B.json"] = build_practice(
        practice_id="cm1:wb-c10:u1-B",
        title="Workbook Unit 1 — Section B",
        subtitle="to부정사 · POINT 3 (WB p. 76)",
        pages="76",
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
        labels_az("C", 10),
        "POINT 1·2·3",
    )
    u1c = [
        ("It will start <u>to rain</u> soon.", True, ""),
        ("I hope <u>to visit</u> Italy again.", True, ""),
        ("I want <u>to playing</u> basketball with you.", False, "to play"),
        ("<u>To swim</u> across the river is impossible.", True, ""),
        ("He needs <u>to cleaned</u> the living room.", False, "to clean"),
        ("She wanted <u>to knew</u> about his secret.", False, "to know"),
        ("Her plan is <u>to writes</u> a cookbook.", False, "to write"),
        ("My father decided <u>repair</u> our house.", False, "to repair"),
        ("Megan loves <u>to sing</u> in front of people.", True, ""),
        ("His dream is <u>to go</u> back to his country.", True, ""),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1c, 1)]
    out["wb-c10-u1-C.json"] = build_practice(
        practice_id="cm1:wb-c10:u1-C",
        title="Workbook Unit 1 — Section C",
        subtitle="to부정사 · POINT 1·2·3 (WB p. 77)",
        pages="77",
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
        labels_az("D", 6),
        "POINT 1·2·3",
    )
    u1d = [
        (
            "(play / to / with / is / him)\n→ _________________________________ a lot of fun.",
            ["To play with him is", "Playing with him is"],
        ),
        (
            "(be / need / alone / I / to)\n→ Sometimes _________________________________.",
            ["Sometimes I need to be alone."],
        ),
        (
            "(weight / goal / to / is / my / lose)\n→ _________________________________ this year.",
            ["My goal is to lose weight"],
        ),
        (
            "(to / some flowers / he / buy / decided)\n→ _________________________________ for his mom's birthday.",
            ["He decided to buy some flowers for his mom's birthday.", "He decided to buy some flowers"],
        ),
        (
            "(a new hobby / to / is / exciting / start)\n→ _________________________________. ",
            ["To start a new hobby is exciting.", "Starting a new hobby is exciting."],
        ),
        (
            "(become / he / a lawyer / to / wishes)\n→ _________________________________.",
            ["He wishes to become a lawyer like his brother."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1d, 1)]
    out["wb-c10-u1-D.json"] = build_practice(
        practice_id="cm1:wb-c10:u1-D",
        title="Workbook Unit 1 — Section D",
        subtitle="to부정사 · POINT 1·2·3 (WB p. 77)",
        pages="77",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "밑줄 친 to부정사의 쓰임을 <보기>에서 골라 그 기호를 쓰세요.",
        WR,
        "words",
        labels_az("A", 7),
        "POINT 4·5",
    )
    u2a = [
        ("I waited for him <u>to discuss</u> the problem.", "a"),
        ("He gave me a list of things <u>to buy</u>.", "b"),
        ("Alice has three classes <u>to attend</u> today.", "b"),
        ("They were happy <u>to go</u> to the movies together.", "c"),
        ("She closed her eyes <u>to make</u> a wish.", "a"),
        ("Tom was sad <u>to hear</u> the bad news.", "c"),
        ("I couldn't find a way <u>to give</u> him a gift.", "b"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u2a, 1)]
    out["wb-c10-u2-A.json"] = build_practice(
        practice_id="cm1:wb-c10:u2-A",
        title="Workbook Unit 2 — Section A",
        subtitle="to부정사 부사·형용사적 쓰임 · POINT 4·5 (WB p. 78)",
        pages="78",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "<보기>와 같이 다음 질문에 대한 대답을 to부정사와 주어진 단어를 사용하여 완성하세요.",
        WR2,
        "words",
        labels_az("B", 6),
        "POINT 4",
    )
    u2b = [
        ("Why did you call him last night?\nI called him ____________________. (ask, a question)", ["to ask a question"], 3),
        ("Why will they come here?\nThey'll come here ____________________ with us. (have, dinner)", ["to have dinner"], 3),
        ("Why is your sister glad?\nShe is ____________________ her best friend. (glad, meet)", ["glad to meet"], 2),
        ("Why did he buy potatoes?\nHe bought them ____________________. (cook, potato soup)", ["to cook potato soup"], 3),
        ("Why did you stay late in the library?\nI stayed there late ____________________. (do, my homework)", ["to do my homework"], 4),
        ("Why is Henry so happy?\nHe is ____________________ new friends. (happy, make)", ["happy to make"], 2),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2b, 1)
    ]
    out["wb-c10-u2-B.json"] = build_practice(
        practice_id="cm1:wb-c10:u2-B",
        title="Workbook Unit 2 — Section B",
        subtitle="to부정사 목적·감정 · POINT 4 (WB p. 78)",
        pages="78",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        SENT,
        "sentence",
        labels_az("C", 7),
        "POINT 4·5",
    )
    u2c = [
        ("(give / a presentation / to)\nShe had a chance __________________________________.", ["She had a chance to give a presentation."]),
        ("(to / it / say about)\nI have nothing __________________________________.", ["I have nothing to say about it."]),
        ("(the news / to / sorry / hear)\nHe was __________________________________.", ["He was sorry to hear the news."]),
        (
            "(to the event / invite / to)\nDo you have many guests __________________________________?",
            ["Do you have many guests to invite to the event?"],
        ),
        ("(to / her / please)\nHe sang a song __________________________________.", ["He sang a song to please her."]),
        (
            "(to / happy / fish / fresh / buy)\nBen was __________________________________ at the market.",
            ["Ben was happy to buy fresh fish at the market."],
        ),
        (
            "(buy / a shirt / to)\nShe went to the store __________________________________ for him.",
            ["She went to the store to buy a shirt for him."],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["wb-c10-u2-C.json"] = build_practice(
        practice_id="cm1:wb-c10:u2-C",
        title="Workbook Unit 2 — Section C",
        subtitle="to부정사 · POINT 4·5 (WB p. 79)",
        pages="79",
        timer_minutes=24,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "<보기>와 같이 주어진 두 문장을 to부정사를 사용하여 한 문장으로 쓰세요.",
        SENT,
        "sentence",
        labels_az("D", 6),
        "POINT 4·5",
    )
    u2d = [
        ("Rick worked hard. He wanted to succeed.\n→ Rick worked hard ________________________________.", ["Rick worked hard to succeed."]),
        ("He has a car. He will sell the car.\n→ He has a car ________________________________.", ["He has a car to sell."]),
        ("Sam was glad. He won the game.\n→ Sam was glad ________________________________.", ["Sam was glad to win the game."]),
        (
            "He is a great leader. He will lead this country.\n→ He is a great leader ________________________________.",
            ["He is a great leader to lead this country."],
        ),
        (
            "They went to the playground. They wanted to play soccer.\n→ They went to the playground ________________________________.",
            ["They went to the playground to play soccer."],
        ),
        (
            "We have a plan. The plan is to eat out.\n→ We have a plan ________________________________.",
            ["We have a plan to eat out."],
        ),
    ]
    items = [sent_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2d, 1)]
    out["wb-c10-u2-D.json"] = build_practice(
        practice_id="cm1:wb-c10:u2-D",
        title="Workbook Unit 2 — Section D",
        subtitle="to부정사 · POINT 4·5 (WB p. 79)",
        pages="79",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "밑줄 친 동명사의 쓰임을 <보기>에서 골라 그 기호를 쓰세요.",
        WR,
        "words",
        labels_az("A", 10),
        "POINT 6·7·8",
    )
    u3a = [
        ("<u>Drinking</u> enough water is important.", "a"),
        ("His role is <u>giving</u> advice to students.", "b"),
        ("She enjoys <u>walking</u> along the river.", "c"),
        ("Emma doesn't mind <u>working</u> late.", "c"),
        ("My goal is <u>having</u> confidence in my English.", "b"),
        ("<u>Living</u> a peaceful life was his wish.", "a"),
        ("Susan will avoid <u>eating</u> too much.", "c"),
        ("His favorite activity is <u>listening</u> to music.", "b"),
        ("<u>Running</u> a marathon is my dream.", "a"),
        ("She gave up <u>finding</u> the treasure.", "c"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u3a, 1)]
    out["wb-c10-u3-A.json"] = build_practice(
        practice_id="cm1:wb-c10:u3-A",
        title="Workbook Unit 3 — Section A",
        subtitle="동명사 쓰임 · POINT 6·7·8 (WB p. 80)",
        pages="80",
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
        "POINT 6·7·8",
    )
    u3b = [
        ("His job is [make / making] online games.", ["make", "making"], 2),
        ("I once considered [to learn / learning] Chinese.", ["to learn", "learning"], 2),
        ("[Jogging / To jogging] is a good way to become healthy.", ["Jogging", "To jogging"], 1),
        ("Her habit is [shake / shaking] her legs.", ["shake", "shaking"], 2),
        ("Jacob finished [cooking / to cook] an hour ago.", ["cooking", "to cook"], 1),
        ("[Watch / Watching] baseball games is always exciting.", ["Watch", "Watching"], 2),
        ("The point is [helping / to helping] others.", ["helping", "to helping"], 1),
        ("The team practiced [to pass / passing] a ball.", ["to pass", "passing"], 2),
        ("The kids kept [to talk / talking] during the class.", ["to talk", "talking"], 2),
        ("[Wash / Washing] your hands is important for your health.", ["Wash", "Washing"], 2),
    ]
    items = [_bracket_mc(sec, f"B{i}", f"b{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u3b, 1)]
    out["wb-c10-u3-B.json"] = build_practice(
        practice_id="cm1:wb-c10:u3-B",
        title="Workbook Unit 3 — Section B",
        subtitle="동명사 · POINT 6·7·8 (WB p. 80)",
        pages="80",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X 하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("C", 10),
        "POINT 8·9·10",
    )
    u3c = [
        ("She enjoys <u>to try</u> new dishes.", False, "trying"),
        ("The movie is about <u>loving</u> yourself.", True, ""),
        ("He suggested <u>to take</u> a taxi.", False, "taking"),
        ("My sister and I <u>went shopping</u> for clothes.", True, ""),
        ("The pianist kept <u>practicing</u> the piano.", True, ""),
        ("Are you good at <u>take</u> pictures?", False, "taking"),
        ("I'm interested in <u>read</u> books about history.", False, "reading"),
        ("The men worked all day <u>without eating</u>.", True, ""),
        ("They considered <u>moving</u> to a new house.", True, ""),
        ("I learned English by <u>listen</u> to English songs.", False, "listening"),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3c, 1)]
    out["wb-c10-u3-C.json"] = build_practice(
        practice_id="cm1:wb-c10:u3-C",
        title="Workbook Unit 3 — Section C",
        subtitle="동명사 · POINT 8·9·10 (WB p. 81)",
        pages="81",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "D",
        "Section D",
        "우리말과 일치하도록 주어진 단어를 사용하여 빈칸을 완성하세요.",
        WR2,
        "words",
        labels_az("D", 6),
        "POINT 8·9·10",
    )
    u3d = [
        ("(finish, watch)\nI ____________________ the film.", ["finished watching"], 2),
        ("(thank you for, give)\n____________________ me a ride.", ["Thank you for giving"], 3),
        ("(for, buy)\nIt is the line ____________________ movie tickets.", ["for buying"], 2),
        ("(avoid, tell)\nShe couldn't ____________________ the truth.", ["avoid telling"], 2),
        ("(good at, give, be)\nJessica ____________________ a presentation.", ["is good at giving"], 4),
        ("(mind, send)\nWould you ____________________ the file again?", ["mind sending"], 2),
    ]
    items = [
        fill_item(iid=f"d{i:02d}", sec=sec, label=f"D{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u3d, 1)
    ]
    out["wb-c10-u3-D.json"] = build_practice(
        practice_id="cm1:wb-c10:u3-D",
        title="Workbook Unit 3 — Section D",
        subtitle="동명사 · POINT 8·9·10 (WB p. 81)",
        pages="81",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out.update(_build_ch10_wb_test(m))
    return out


def _build_ch10_wb_test(m: dict) -> dict[str, dict]:
    secs = [
        section("1-2", "[1–2]", "[1–2] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.", MC, "choice", labels_num(2)),
        section("3", "[3]", "[3] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.", WR2, "words", ["3"]),
        section("4-5", "[4–5]", "[4–5] 다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.", MC, "choice", labels_num(2, 4)),
        section("6-7", "[6–7]", "[6–7] <보기>와 같이 주어진 두 문장을 to부정사를 사용하여 한 문장으로 다시 쓰세요.", SENT, "sentence", labels_num(2, 6)),
        section("8", "[8]", "[8] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 같은 것을 고르세요.", MC, "choice", ["9"]),
        section("10", "[10]", "[10] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.", MC, "choice", ["10"]),
        section("11", "[11]", "[11] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.", MC, "choice", ["11"]),
        section("12", "[12]", "[12] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["12"]),
        section("13", "[13]", "[13] 다음 중 어법상 알맞은 문장을 고르세요.", MC, "choice", ["13"]),
        section("14", "[14]", "[14] 우리말과 일치하도록 주어진 단어를 사용하여 <조건>에 맞게 영작하세요.", SENT, "sentence", ["14"]),
        section("15", "[15]", "[15] 다음 중 어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.", MC, "choice", ["15"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            choices=[
                "Joy wished <u>to stayed</u> here.",
                "He decided <u>to invite</u> Nancy.",
                "I need <u>to return</u> some books.",
                "<u>To build</u> friendship takes long time.",
                "My favorite activity is <u>to ride</u> a bike.",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            choices=[
                "James wants <u>to see</u> her.",
                "Susan stopped <u>watching</u> TV.",
                "The boy kept <u>smiling</u> at me.",
                "I promised <u>to be</u> on time.",
                "They hope <u>finding</u> gold.",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en="I decided joining a book club to read more books.\n________ → ________",
            accept=["decided|decided to join", "joining|to join"],
            blanks=2,
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            choices=[
                "Jim turned off the light <u>to sleep</u>.",
                "We came home <u>to take</u> a shower.",
                "Sam bought a racket <u>to play</u> badminton.",
                "She practiced drawing <u>to win</u> the contest.",
                "I was really happy <u>to get</u> a present from my uncle.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q05",
            sec=secs[2],
            label="5",
            choices=[
                "His job is <u>driving</u> a taxi.",
                "She is <u>talking</u> on the phone.",
                "Do you mind <u>ordering</u> pizza?",
                "She gave up <u>becoming</u> a singer.",
                "<u>Reading</u> in bed is bad for your eyes.",
            ],
            answer_index=2,
        ),
        sent_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="They have a plan. The plan is to eat out.\n→ They ________________________________________.",
            accept=["They have a plan to eat out."],
        ),
        sent_item(
            iid="q07",
            sec=secs[3],
            label="7",
            prompt_en="Jack and Peter went out. They wanted to take a walk.\n→ Jack and Peter ________________________________________.",
            accept=["Jack and Peter went out to take a walk."],
        ),
        mc_item(
            iid="q08",
            sec=secs[4],
            label="8",
            prompt_en="She just finished __________ her room.",
            choices=["cleans", "cleaned", "to clean", "cleaning", "to cleaning"],
            answer_index=4,
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en="<보기> She went to the kitchen <u>to drink</u> some milk.",
            choices=[
                "There is no fruit <u>to eat</u>.",
                "I have some money <u>to spend</u>.",
                "Do you have time <u>to take</u> a break?",
                "He is looking for a nice hat <u>to wear</u>.",
                "I sat at the desk <u>to do</u> my homework.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q10",
            sec=secs[6],
            label="10",
            prompt_en="Rachel ________ to exercise in the gym.",
            choices=["liked", "began", "quit", "planned", "decided"],
            answer_index=3,
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en=(
                "A: What do you plan ① <u>to do</u> this weekend?\n"
                "B: I'm thinking of ② <u>going</u> to a rock festival.\n"
                "A: Sounds great. I love ③ <u>listening</u> to rock music, too.\n"
                "B: Then, how about ④ <u>to go</u> with me?\n"
                "A: I want to join you, but I have a lot of things ⑤ <u>to do</u>."
            ),
            choices=["①", "②", "③", "④", "⑤"],
            answer_index=4,
        ),
        mc_item(
            iid="q12",
            sec=secs[8],
            label="12",
            prompt_en="나는 일본어로 말하는 것을 잘하지 못한다.",
            choices=[
                "I'm good at speak in Japanese.",
                "I'm good at to speak in Japanese.",
                "I'm good at speaking in Japanese.",
                "I'm not good at to speak in Japanese.",
                "I'm not good at speaking in Japanese.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q13",
            sec=secs[9],
            label="13",
            choices=[
                "Thank you for welcome us.",
                "She wishes traveling in France.",
                "Why do you keep bothering me?",
                "Are you interested in grow plants?",
                "I'm not afraid to being alone in the dark.",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q14",
            sec=secs[10],
            label="14",
            prompt_en="지수는 치마 입는 것을 싫어한다.\n(hate, wear, skirts — 네 단어)",
            accept=["Jisoo hates wearing skirts.", "hates wearing skirts"],
        ),
        mc_item(
            iid="q15",
            sec=secs[11],
            label="15",
            prompt_en=(
                "ⓐ She was glad finishing her work.\n"
                "ⓑ Flowers start to bloom in spring.\n"
                "ⓒ We saved time by taking the subway.\n"
                "ⓓ He expected getting a good grade.\n"
                "ⓔ She suggested going to the cafe.\n"
                "ⓕ Taking photos are my hobby."
            ),
            choices=["ⓐ, ⓒ, ⓕ", "ⓑ, ⓓ", "ⓑ, ⓒ, ⓔ", "ⓑ, ⓒ, ⓕ", "ⓐ, ⓑ, ⓒ, ⓔ"],
            answer_index=3,
        ),
    ]
    return {
        "wb-c10-test.json": build_practice(
            practice_id="cm1:wb-c10:test",
            title="WB Chapter Test",
            subtitle="Chapter 10 (WB p. 82–83)",
            pages="82–83",
            timer_minutes=30,
            sections=secs,
            items=items,
            test_id="wb-c10-test",
            **m,
        )
    }


if __name__ == "__main__":
    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch09"):
        d9 = build_ch09_wb()
        _write_docs(d9, chapter=9)
        print(f"chapter 09 wb: wrote {len(d9)} files")
    if fn in ("all", "ch10"):
        d10 = build_ch10_wb()
        _write_docs(d10, chapter=10)
        print(f"chapter 10 wb: wrote {len(d10)} files")
