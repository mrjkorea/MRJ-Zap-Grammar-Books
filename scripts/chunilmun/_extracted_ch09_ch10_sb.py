#!/usr/bin/env python3
"""Scan-extracted SB practice data for Ch09–Ch10 — 천일문 Grammar 1 (uploads/ch09-10-sb.pdf)."""
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


def _bracket(sec: dict, label: str, iid: str, prompt: str, choices: list[str], ans: int) -> dict:
    return mc_item(iid=iid, sec=sec, label=label, prompt_en=prompt, choices=choices, answer_index=ans)


def _mask_word(sentence: str, word: str) -> str:
    import re

    pat = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
    if not pat.search(sentence):
        return sentence
    return pat.sub("________", sentence, count=1)


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


def build_ch09_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(9, "문장의 여러 형식")

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 6),
        "POINT 1·2",
    )
    u1a = [
        ("Math is very <u>difficultly</u> to me.", False, "difficult"),
        ("Your little sister looks <u>sadly</u>.", False, "sad"),
        ("Susan became <u>a teacher</u> after college.", True, ""),
        ("The candle smells <u>nicely</u>.", False, "nice"),
        ("Your new skirt looks <u>well</u>.", False, "good"),
        ("Rick is always <u>friendly</u> to others.", True, ""),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1a, 1)]
    out["c09-u1-A.json"] = build_practice(
        practice_id="cm1:c09:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="SVC · POINT 1·2 (p. 111)",
        pages="111",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 동사를 <보기>에서 골라 현재형으로 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("B", 5),
        "POINT 2",
        word_bank=["feel", "look", "sound", "smell", "taste"],
    )
    u1b = [
        ("Your voice ________ strange.", ["sound", "sounds"]),
        ("I ________ so sick today.", ["feel"]),
        ("This coffee ________ bitter.", ["tastes"]),
        ("The flowers ________ sweet.", ["smell"]),
        ("The clouds ________ like cotton candy.", ["look"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["c09-u1-B.json"] = build_practice(
        practice_id="cm1:c09:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="SVC · POINT 2 (p. 111)",
        pages="111",
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
        "POINT 1·2",
    )
    u1c = [
        ("엄마의 손은 따뜻하게 느껴졌다. (warm)\n→ Mom's hands ________ ________.", ["felt warm", "feel warm"]),
        ("그녀는 누구에게나 정직하다. (honest)\n→ She ________ ________ with everyone.", ["is honest"]),
        ("그의 이야기는 나에게 흥미롭게 들린다. (interesting)\n→ His story ________ ________ to me.", ["sounds interesting"]),
        ("Jenny는 그 노래로 유명해졌다. (famous)\n→ Jenny ________ ________ for the song.", ["became famous"]),
        ("네 수프에서는 맛있는 냄새가 난다. (delicious)\n→ Your soup ________ ________.", ["smells delicious"]),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1c, 1)]
    out["c09-u1-C.json"] = build_practice(
        practice_id="cm1:c09:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="SVC · POINT 1·2 (p. 111)",
        pages="111",
        timer_minutes=20,
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
        labels_az("A", 5),
        "POINT 3·4",
    )
    u2a = [
        ("We gave <u>some food the cat</u>.", False, "the cat some food"),
        ("Amy showed <u>his some magic tricks</u>.", False, "him some magic tricks"),
        ("My father will buy <u>for me a bike</u>.", False, "me a bike"),
        ("Please tell <u>the truth to us</u>.", True, ""),
        ("When will you send a letter <u>of her</u>?", False, "to her"),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u2a, 1)]
    out["c09-u2-A.json"] = build_practice(
        practice_id="cm1:c09:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="SVOO · POINT 3·4 (p. 114)",
        pages="114",
        timer_minutes=18,
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
        labels_az("B", 4),
        "POINT 3·4",
    )
    u2b = [
        (
            "나에게 역으로 가는 길을 알려 주겠니?\n(the way / me / show)\n→ Can you __________________________ to the station?",
            ["Can you show me the way to the station?"],
        ),
        (
            "Jones 씨는 우리에게 저녁 식사를 요리해 주셨다.\n(cooked / us / for / dinner)\n→ Mr. Jones __________________________.",
            ["Mr. Jones cooked us dinner.", "Mr. Jones cooked dinner for us."],
        ),
        (
            "그는 생일에 그녀에게 꽃을 가져다주었다.\n(her / some flowers / brought)\n→ He __________________________ on her birthday.",
            ["He brought her some flowers on her birthday."],
        ),
        (
            "우리 할머니는 항상 아이들에게 재미있는 이야기를 들려주신다.\n(children / tells / interesting stories / to)\n→ My grandma always __________________________.",
            ["My grandma always tells interesting stories to children.", "My grandma always tells children interesting stories."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["c09-u2-B.json"] = build_practice(
        practice_id="cm1:c09:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="SVOO · POINT 3·4 (p. 114)",
        pages="114",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "주어진 문장을 <보기>와 같이 전치사가 포함된 문장으로 바꿔 쓰세요.",
        SENT,
        "sentence",
        labels_az("C", 4),
        "POINT 4",
    )
    u2c = [
        ("I'll make you some dessert.\n→ I'll make __________________________.", ["I'll make some dessert for you."]),
        ("She'll get you some cold water.\n→ She'll get __________________________.", ["She'll get some cold water for you."]),
        ("Rick wrote me an email.\n→ Rick wrote __________________________.", ["Rick wrote an email to me."]),
        ("Owen lent Sora his laptop.\n→ Owen lent __________________________.", ["Owen lent his laptop to Sora."]),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2c, 1)]
    out["c09-u2-C.json"] = build_practice(
        practice_id="cm1:c09:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="SVOO · POINT 4 (p. 114)",
        pages="114",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "A",
        "Section A",
        "우리말과 일치하도록 <보기>에서 알맞은 형용사를 골라 문장을 완성하세요.",
        WR2,
        "words",
        labels_az("A", 4),
        "POINT 6",
        word_bank=["sad", "white", "funny", "empty"],
    )
    u3a = [
        ("The song always ________ me ________.", ["makes|sad"]),
        ("I ________ his story ________.", ["found|funny"]),
        ("Please ________ the seats ________ for the elderly.", ["leave|empty"]),
        ("This toothpaste ________ your teeth ________.", ["keeps|white"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a, blanks=2)
        for i, (p, a) in enumerate(u3a, 1)
    ]
    out["c09-u3-A.json"] = build_practice(
        practice_id="cm1:c09:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="SVOC · POINT 6 (p. 116)",
        pages="116",
        timer_minutes=18,
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
        labels_az("B", 3),
        "POINT 5",
    )
    u3b = [
        ("(a baseball player / made / her son)\n→ She __________________________.", ["She made her son a baseball player."]),
        ("(Jerry / named / my hamster)\n→ I __________________________.", ["I named my hamster Jerry."]),
        (
            "(their pet / call / a friend)\n→ People __________________________.",
            ["People call their pet a friend."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3b, 1)]
    out["c09-u3-B.json"] = build_practice(
        practice_id="cm1:c09:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="SVOC · POINT 5 (p. 116)",
        pages="116",
        timer_minutes=18,
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
        labels_az("C", 7),
        "POINT 5·6",
    )
    u3c = [
        ("I found <u>the book useful</u>.", True, ""),
        ("The exam makes <u>me nervously</u>.", False, "me nervous"),
        ("Mike made <u>his son a musician</u>.", True, ""),
        ("Don't call <u>a fool me</u>.", False, "me a fool"),
        ("His rude answer made <u>his parents anger</u>.", False, "his parents angry"),
        ("You should keep <u>the door open</u>.", True, ""),
        ("She always leaves <u>dirty her room</u>.", False, "her room dirty"),
    ]
    items = [_ox(sec, f"C{i}", f"c{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3c, 1)]
    out["c09-u3-C.json"] = build_practice(
        practice_id="cm1:c09:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="SVOC · POINT 5·6 (p. 116)",
        pages="116",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    out["c09-test.json"] = _build_ch09_test(m)
    return out


def _build_ch09_test(m: dict) -> dict:
    secs = [
        section("1", "[1]", "[1] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.", MC, "choice", ["1"]),
        section("2-3", "[2–3]", "[2–3] 다음 중 어법상 알맞지 않은 문장을 고르세요.", MC, "choice", labels_num(2, 2)),
        section("4", "[4]", "[4] 다음 빈칸에 들어갈 말이 <보기>와 다른 것을 고르세요.", MC, "choice", ["4"]),
        section("5-6", "[5–6]", "[5–6] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.", SENT, "sentence", labels_num(2, 5)),
        section("7", "[7]", "[7] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 다음 중 문장의 전환이 어색한 것을 고르세요.", MC, "choice", ["8"]),
        section("9", "[9]", "[9] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.", MC, "choice", ["9"]),
        section(
            "10",
            "[10]",
            "[10] 다음 빈칸에 들어갈 말로 알맞은 것을 두 개 고르세요.",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요.",
            "words",
            ["10"],
        ),
        section("11-12", "[11–12]", "[11–12] 다음 중 <보기>와 문장의 형식이 같은 것을 고르세요.", MC, "choice", labels_num(2, 11)),
        section("13", "[13]", "[13] 어법상 알맞지 않은 문장을 모두 골라 바르게 고쳐 문장을 다시 쓰세요.", SENT, "sentence", ["13"]),
        section("14-15", "[14–15]", "[14–15] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", labels_num(2, 14)),
        section("16-17", "[16–17]", "[16–17] 다음 <보기>와 같이 문장을 바꿔 쓰세요.", SENT, "sentence", labels_num(2, 16)),
        section("18-20", "[18–20]", "[18–20] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.", SENT, "sentence", labels_num(3, 18)),
        section(
            "21-22",
            "[21–22]",
            "[21–22] 다음 중 어법상 알맞은 문장 두 개를 고르세요.",
            "알맞은 보기 번호 두 개를 빈칸에 각각 쓰세요.",
            "words",
            labels_num(2, 21),
        ),
        section("23-24", "[23–24]", "[23–24] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.", CORR, "words", labels_num(2, 23)),
        section("25", "[25]", "[25] 우리말과 일치하도록 <조건>에 맞게 문장을 쓰세요.", SENT, "sentence", ["25"]),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="The soup ________ delicious.",
            choices=["is", "looks", "tastes", "smells", "makes"],
            answer_index=5,
        ),
        mc_item(
            iid="q02",
            sec=secs[1],
            label="2",
            choices=[
                "My father is a pilot.",
                "Sally became a writer.",
                "You should keep the table clean.",
                "The bees look very busily.",
                "My friends call me Katie.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            choices=[
                "I sent Nick a text message.",
                "Mom made me a nice sweater.",
                "Don't give to the animals food.",
                "I will tell my sister a funny story.",
                "Did you get a present for your mom?",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q04",
            sec=secs[2],
            label="4",
            prompt_en="<보기> He sent an email ________ her.",
            choices=[
                "He lent a book ________ her.",
                "Don't tell a lie ________ others.",
                "Let's give some money ________ them.",
                "Emma made some cookies ________ us.",
                "Ted showed some photos ________ me.",
            ],
            answer_index=4,
        ),
        sent_item(
            iid="q05",
            sec=secs[3],
            label="5",
            prompt_en="그녀의 노래는 아름답게 들린다. (sound)\n→ Her song ________________________________.",
            accept=["Her song sounds beautiful.", "sounds beautiful"],
        ),
        sent_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="그의 방문은 나를 항상 행복하게 만든다. (make)\n→ His visit always ________________________________.",
            accept=["His visit always makes me happy.", "makes me happy"],
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            choices=[
                "Your new scarf feels softly.",
                "The pizza smells really deliciously.",
                "The towels on the table smelled roses.",
                "His voice sounded calmly.",
                "The baby looks sleepy.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            choices=[
                "He wrote her a love letter. → He wrote a love letter to her.",
                "I'm going to buy him a bag. → I'm going to buy a bag for him.",
                "She passed me some papers. → She passed some papers to me.",
                "Anna sent Minsu some flowers. → Anna sent some flowers of Minsu.",
                "Julie cooked her parents some chicken. → Julie cooked some chicken for her parents.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q09",
            sec=secs[6],
            label="9",
            choices=[
                "The bell sounded <u>loud</u>.",
                "Your baby looks very <u>lovely</u>.",
                "Keep your shoes <u>cleanly</u>, please.",
                "I found the actor's life very <u>exciting</u>.",
                "The cat became <u>curious</u> about the toy.",
            ],
            answer_index=3,
        ),
        choose_all_item(
            iid="q10",
            sec=secs[7],
            label="10",
            prompt_en="The teacher made him _____________________.\n① tired ② happily ③ the captain ④ nervously ⑤ proudly",
            accept_pairs=[("1", "3")],
        ),
        mc_item(
            iid="q11",
            sec=secs[8],
            label="11",
            prompt_en="<보기> The black coat looks nice.",
            choices=[
                "Mark asked me some questions.",
                "Everybody calls her an angel.",
                "We named our puppy Coco.",
                "She gave us some milk.",
                "The rose smells good.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q12",
            sec=secs[8],
            label="12",
            prompt_en="<보기> Mina showed him her new bag.",
            choices=[
                "They kept the room empty.",
                "He became a famous singer.",
                "Did Brad tell her the secret?",
                "She got excited about the picnic.",
                "I found this spaghetti really spicy.",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q13",
            sec=secs[9],
            label="13",
            prompt_en=(
                "① I went camping with my friend, Tom.\n"
                "② He cooked potato soup to me.\n"
                "③ It tasted really nice.\n"
                "④ We had a good time and felt happily.\n"
                "⑤ It was the best camping trip!\n"
                "→ (교정문)"
            ),
            accept=[
                "He cooked potato soup for me.",
                "We had a good time and felt happy.",
            ],
        ),
        mc_item(
            iid="q14",
            sec=secs[10],
            label="14",
            prompt_en="Can I ask a favor (A) you? / He sent some books (B) his cousin.",
            choices=["to — for", "for — to", "of — of", "of — to", "for — of"],
            answer_index=4,
        ),
        mc_item(
            iid="q15",
            sec=secs[10],
            label="15",
            prompt_en="Would you pass a pen (A) me? / She bought a scarf (B) her mom.",
            choices=["to — for", "for — to", "of — for", "of — to", "for — of"],
            answer_index=1,
        ),
        sent_item(
            iid="q16",
            sec=secs[11],
            label="16",
            prompt_en="<보기> Tomas showed me his drawings. → Tomas showed his drawings to me.\nMike taught the kid the alphabet.\n→ ________________________________",
            accept=["Mike taught the alphabet to the kid."],
        ),
        sent_item(
            iid="q17",
            sec=secs[11],
            label="17",
            prompt_en="<보기> Maria bought a watch for her husband. → Maria bought her husband a watch.\nBill gave a book to his sister.\n→ ________________________________",
            accept=["Bill gave his sister a book."],
        ),
        sent_item(
            iid="q18",
            sec=secs[12],
            label="18",
            prompt_en="(sweet / tastes / the chocolate cake / too)\n→ ________________________________",
            accept=["The chocolate cake tastes too sweet."],
        ),
        sent_item(
            iid="q19",
            sec=secs[12],
            label="19",
            prompt_en="(send / a gift box / did / me / to / you)\n→ ________________________________",
            accept=["Did you send a gift box to me?", "Did you send me a gift box?"],
        ),
        sent_item(
            iid="q20",
            sec=secs[12],
            label="20",
            prompt_en="(basketball player / call / my / classmates / me / the best)\n→ ________________________________",
            accept=["My classmates call me the best basketball player."],
        ),
        choose_all_item(
            iid="q21",
            sec=secs[13],
            label="21",
            prompt_en="① This drink tastes coffee.\n② The baby looks an angel.\n③ It sounds like a good idea.\n④ She became a great painter.\n⑤ I feel proudly of my country.",
            accept_pairs=[("3", "4")],
        ),
        choose_all_item(
            iid="q22",
            sec=secs[13],
            label="22",
            prompt_en="① Amy is a good doctor.\n② The soup tasted very sour.\n③ The boy got angrily at his friend.\n④ She felt like hungry after she woke up.\n⑤ This T-shirt doesn't look like small for me.",
            accept_pairs=[("1", "2")],
        ),
        fill_item(
            iid="q23",
            sec=secs[14],
            label="23",
            prompt_en="Regular exercise makes you health.",
            accept=["healthy"],
        ),
        fill_item(
            iid="q24",
            sec=secs[14],
            label="24",
            prompt_en="I found the river very calmly.",
            accept=["calm"],
        ),
        sent_item(
            iid="q25",
            sec=secs[15],
            label="25",
            prompt_en=(
                "나는 내 남동생에게 축구공을 하나 사 주었다.\n"
                "(buy, a soccer ball, brother — 두 가지 문장)"
            ),
            accept=[
                "I bought my brother a soccer ball.",
                "I bought a soccer ball for my brother.",
            ],
        ),
    ]
    return build_practice(
        practice_id="cm1:c09:test",
        title="Chapter Test",
        subtitle="Chapter 09 문장의 여러 형식 (p. 117–119)",
        pages="117–119",
        timer_minutes=32,
        sections=secs,
        items=items,
        test_id="c09-test",
        **m,
    )


def build_ch10_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(10, "to부정사와 동명사")

    sec = section(
        "A",
        "Section A",
        "밑줄 친 to부정사의 쓰임을 <보기>에서 골라 그 기호를 쓰세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 1·2·3",
    )
    u1a = [
        ("<u>To play</u> online games is fun.", "a"),
        ("She wants <u>to take</u> a rest.", "c"),
        ("My wish is <u>to see</u> an aurora.", "b"),
        ("I need <u>to go</u> grocery shopping.", "c"),
        ("Her hobby is <u>to play</u> the guitar.", "b"),
        ("<u>To get up</u> early is difficult for me.", "a"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u1a, 1)]
    out["c10-u1-A.json"] = build_practice(
        practice_id="cm1:c10:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="to부정사 명사적 쓰임 · POINT 1·2·3 (p. 125)",
        pages="125",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 말을 <보기>에서 골라 적절한 형태로 바꿔 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("B", 4),
        "POINT 3",
        word_bank=["cook", "move", "cry", "do"],
    )
    u1b = [
        ("We decided ________ to another city.", ["to move"]),
        ("The baby began ________ suddenly.", ["to cry", "crying"]),
        ("My parents love ________ dinner together.", ["to cook", "cooking"]),
        ("What do you plan ________ during the holiday?", ["to do"]),
    ]
    items = [fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["c10-u1-B.json"] = build_practice(
        practice_id="cm1:c10:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="to부정사 · POINT 3 (p. 125)",
        pages="125",
        timer_minutes=18,
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
        labels_az("C", 5),
        "POINT 1·2·3",
    )
    u1c = [
        (
            "(study / is / for the exam / to / plan / my)\n→ ________________________________________ tonight.",
            ["My plan is to study for the exam tonight."],
        ),
        (
            "(become / a movie star / is / to)\n→ ________________________________________ difficult.",
            ["To become a movie star is difficult."],
        ),
        (
            "(hopes / a pet / to / have / the little boy)\n→ ________________________________________ soon.",
            ["The little boy hopes to have a pet soon."],
        ),
        (
            "(bake / not / cookies / to / is / difficult)\n→ ________________________________________ at all.",
            ["To bake cookies is not difficult at all."],
        ),
        (
            "(early / to / we / leave / need)\n→ ________________________________________ tomorrow.",
            ["We need to leave early tomorrow."],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1c, 1)]
    out["c10-u1-C.json"] = build_practice(
        practice_id="cm1:c10:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="to부정사 · POINT 1·2·3 (p. 125)",
        pages="125",
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
        labels_az("A", 6),
        "POINT 4·5",
    )
    u2a = [
        ("I went to the restaurant <u>to have</u> pasta.", "a"),
        ("I need somebody <u>to help</u> me.", "b"),
        ("She called me <u>to ask</u> a few questions.", "a"),
        ("They were glad <u>to go</u> to the zoo.", "c"),
        ("He has some coins <u>to put</u> in his piggy bank.", "b"),
        ("I was shocked <u>to hear</u> the news.", "c"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u2a, 1)]
    out["c10-u2-A.json"] = build_practice(
        practice_id="cm1:c10:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="to부정사 부사·형용사적 쓰임 · POINT 4·5 (p. 128)",
        pages="128",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 밑줄 친 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        SENT,
        "sentence",
        labels_az("B", 5),
        "POINT 4·5",
    )
    u2b = [
        ("(to / a chance / talk)\nI had __________________________ with him.", ["I had a chance to talk with him."]),
        ("(see / to / the sunrise)\nWe got up early __________________________.", ["We got up early to see the sunrise."]),
        (
            "(happy / watch / to)\nHe was __________________________ his favorite movie.",
            ["He was happy to watch his favorite movie."],
        ),
        (
            "(find / to / her necklace)\nShe opened the drawer __________________________.",
            ["She opened the drawer to find her necklace."],
        ),
        (
            "(learn / to / some ways)\nTell me __________________________ English.",
            ["Tell me some ways to learn English."],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2b, 1)]
    out["c10-u2-B.json"] = build_practice(
        practice_id="cm1:c10:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="to부정사 · POINT 4·5 (p. 128)",
        pages="128",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "<보기>와 같이 다음 질문에 대한 대답을 주어진 단어와 to부정사를 사용하여 완성하세요.",
        WR2,
        "words",
        labels_az("C", 3),
        "POINT 4",
    )
    u2c = [
        (
            "Why did he go to the supermarket?\nHe went to the supermarket __________________________. (buy, some fruits)",
            ["to buy some fruits"],
            3,
        ),
        (
            "Why do you live in the countryside?\nI live in the countryside __________________________. (enjoy, nature)",
            ["to enjoy nature"],
            3,
        ),
        (
            "Why is Jenny sad now?\nShe is __________________________ at home. (sad, be, alone)",
            ["sad to be alone", "sad to be"],
            3,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=b)
        for i, (p, a, b) in enumerate(u2c, 1)
    ]
    out["c10-u2-C.json"] = build_practice(
        practice_id="cm1:c10:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="to부정사 목적·감정 · POINT 4 (p. 128)",
        pages="128",
        timer_minutes=18,
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
        labels_az("A", 6),
        "POINT 6·7·8",
    )
    u3a = [
        ("My hobby is <u>reading</u> comic books.", "b"),
        ("Brian enjoys <u>watching</u> birds.", "c"),
        ("<u>Singing</u> in the shower is my habit.", "a"),
        ("His job is <u>selling</u> books to people.", "b"),
        ("She practices <u>playing</u> the piano every day.", "c"),
        ("<u>Becoming</u> a dog trainer is my dream.", "a"),
    ]
    items = [_sym(sec, f"A{i}", f"a{i:02d}", p, k) for i, (p, k) in enumerate(u3a, 1)]
    out["c10-u3-A.json"] = build_practice(
        practice_id="cm1:c10:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="동명사 쓰임 · POINT 6·7·8 (p. 132)",
        pages="132",
        timer_minutes=18,
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
        labels_az("B", 7),
        "POINT 6·7·8·10",
    )
    u3b = [
        ("Nick finished [to do / doing] the dishes.", ["to do", "doing"], 2),
        ("Helping others [make / makes] me happy.", ["make", "makes"], 2),
        ("My grandfather will never give up [to smoke / smoking].", ["to smoke", "smoking"], 2),
        ("Her problem is [waking / to waking] up too late.", ["waking", "to waking"], 1),
        ("My father and I enjoy [to ski / skiing] every winter.", ["to ski", "skiing"], 2),
        ("My mom and I are good at [sing / singing] songs.", ["sing", "singing"], 2),
        ("Do you mind [waiting / to wait] here for a minute?", ["waiting", "to wait"], 1),
    ]
    items = [_bracket(sec, f"B{i}", f"b{i:02d}", p, ch, a) for i, (p, ch, a) in enumerate(u3b, 1)]
    out["c10-u3-B.json"] = build_practice(
        practice_id="cm1:c10:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="동명사 · POINT 6·7·8·10 (p. 132)",
        pages="132",
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
        "POINT 8·9·10",
    )
    u3c = [
        (
            "(keep, think about)\n→ Daniel __________________________ his future.",
            ["Daniel kept thinking about his future.", "kept thinking about"],
        ),
        (
            "(be, good, at, express)\n→ I __________________________ my feelings.",
            ["I am good at expressing my feelings."],
        ),
        (
            "(avoid, drink, coffee)\n→ My grandma __________________________ in the evening.",
            ["My grandma avoids drinking coffee in the evening."],
        ),
        (
            "(by, cook, at home)\n→ He saved money __________________________.",
            ["He saved money by cooking at home."],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["c10-u3-C.json"] = build_practice(
        practice_id="cm1:c10:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="동명사 · POINT 8·9·10 (p. 132)",
        pages="132",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out["c10-test.json"] = _build_ch10_test(m)
    return out


def _build_ch10_test(m: dict) -> dict:
    secs = [
        section("1", "[1]", "[1] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 같은 것을 고르세요.", MC, "choice", ["1"]),
        section("2", "[2]", "[2] 다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.", MC, "choice", ["2"]),
        section("3", "[3]", "[3] <보기>와 같이 주어진 두 문장을 to부정사를 이용하여 한 문장으로 다시 쓰세요.", SENT, "sentence", ["3"]),
        section("4", "[4]", "[4] 다음 중 밑줄 친 부분과 바꿔 쓸 수 있는 말을 고르세요.", MC, "choice", ["4"]),
        section("5", "[5]", "[5] 다음 중 주어진 우리말을 영작할 때 세 번째 빈칸에 오는 것을 고르세요.", MC, "choice", ["5"]),
        section("6", "[6]", "[6] 다음 밑줄 친 동명사의 쓰임을 잘못 설명한 것을 고르세요.", MC, "choice", ["6"]),
        section("7", "[7]", "[7] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.", MC, "choice", ["7"]),
        section("8", "[8]", "[8] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.", CORR, "words", ["8"]),
        section("9", "[9]", "[9] 다음 중 <보기>의 밑줄 친 부분과 어법상 쓰임이 같은 것을 고르세요.", MC, "choice", ["9"]),
        section("10-11", "[10–11]", "[10–11] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.", SENT, "sentence", labels_num(2, 10)),
        section("12", "[12]", "[12] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.", MC, "choice", ["12"]),
        section("13", "[13]", "[13] 다음 그림을 보고 민호의 질문에 알맞은 Anne의 대답을 완성하세요.", WR2, "words", ["13"]),
        section(
            "14",
            "[14]",
            "[14] 다음 중 어법상 알맞지 않은 문장을 모두 고르세요.",
            "알맞은 보기 번호를 모두 골라 빈칸에 쓰세요.",
            "words",
            ["14"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 우리말을 영작할 때 빈칸에 들어갈 말로 알맞은 것을 모두 고르세요.",
            "알맞은 보기 번호를 모두 골라 빈칸에 쓰세요.",
            "words",
            ["15"],
        ),
        section("16", "[16]", "[16] 다음 중 밑줄 친 부분의 우리말 해석이 바르지 않은 것을 고르세요.", MC, "choice", ["16"]),
        section("17", "[17]", "[17] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.", MC, "choice", ["17"]),
        section("18", "[18]", "[18] 다음 중 어법상 알맞지 않은 문장의 개수를 고르세요.", MC, "choice", ["18"]),
        section("19-20", "[19–20]", "[19–20] 표를 보고 주어진 단어를 사용하여 질문에 대한 답을 완성하세요.", WR2, "words", labels_num(2, 19)),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="<보기> You need <u>to wash</u> your hands first.",
            choices=[
                "He likes <u>to play</u> drums.",
                "My goal is <u>to learn</u> Chinese.",
                "<u>To speak</u> in public is difficult.",
                "His dream is <u>to drive</u> a sports car.",
                "<u>To drink</u> milk is good for your health.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=secs[1],
            label="2",
            choices=[
                "She called me <u>to say</u> hello.",
                "I have something <u>to do</u> now.",
                "I don't have time <u>to watch</u> TV.",
                "Tom gave her some food <u>to eat</u>.",
                "There's no one <u>to cook</u> dinner tonight.",
            ],
            answer_index=1,
        ),
        sent_item(
            iid="q03",
            sec=secs[2],
            label="3",
            prompt_en="She sold her house. She wanted to move to the country.\n→ ________________________________",
            accept=["She sold her house to move to the country."],
        ),
        mc_item(
            iid="q04",
            sec=secs[3],
            label="4",
            prompt_en="He began <u>to climb</u> up the mountain.",
            choices=["climb", "climbing", "climbs", "to climbing", "climbed"],
            answer_index=2,
        ),
        mc_item(
            iid="q05",
            sec=secs[4],
            label="5",
            prompt_en="대부분의 식물은 자라기 위해 물이 필요하다.\nMost ________ ________ ________ ________ ________.",
            choices=["plants", "water", "to", "need", "grow"],
            answer_index=3,
        ),
        mc_item(
            iid="q06",
            sec=secs[5],
            label="6",
            choices=[
                "<u>Studying</u> math is exciting. (주어)",
                "She enjoys <u>taking</u> a walk. (목적어)",
                "Tim avoided <u>taking</u> medicine. (보어)",
                "<u>Drinking</u> coffee makes me awake. (주어)",
                "My hobby is <u>playing</u> computer games. (보어)",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q07",
            sec=secs[6],
            label="7",
            prompt_en="Did you ________ to write the essay about your childhood?",
            choices=["start", "hate", "finish", "want", "love"],
            answer_index=3,
        ),
        fill_item(
            iid="q08",
            sec=secs[7],
            label="8",
            prompt_en="Eric gave up to get up early in the morning.",
            accept=["gave up getting up", "getting up"],
        ),
        mc_item(
            iid="q09",
            sec=secs[8],
            label="9",
            prompt_en="<보기> Jessica's goal is <u>becoming</u> a chef.",
            choices=[
                "We are <u>cleaning</u> the kitchen.",
                "She is <u>borrowing</u> some books.",
                "They are <u>talking</u> about the party.",
                "The baby is <u>sleeping</u> on the bed.",
                "Her job is <u>baking</u> bread and cakes.",
            ],
            answer_index=5,
        ),
        sent_item(
            iid="q10",
            sec=secs[9],
            label="10",
            prompt_en="(mind, knock)\n→ Do you ____________________ on the door?",
            accept=["Do you mind knocking on the door?", "mind knocking"],
        ),
        sent_item(
            iid="q11",
            sec=secs[9],
            label="11",
            prompt_en="(expect, win)\n→ I didn't ____________________ the contest.",
            accept=["I didn't expect to win the contest.", "expect to win"],
        ),
        mc_item(
            iid="q12",
            sec=secs[10],
            label="12",
            prompt_en="She kept (A) no to me. / The novel is about (B) happiness.",
            choices=["say — find", "saying — find", "to say — finding", "to say — to find", "saying — finding"],
            answer_index=5,
        ),
        fill_item(
            iid="q13",
            sec=secs[11],
            label="13",
            prompt_en="Minho: What are you good at, Anne?\nAnne: I ____________________ the piano.",
            accept=["am good at playing", "I am good at playing the piano"],
            blanks=3,
        ),
        choose_all_item(
            iid="q14",
            sec=secs[12],
            label="14",
            prompt_en="① They decided to go there.\n② He was glad to get a good score.\n③ I wish having a nice vacation.\n④ She avoids to drive in the rain.\n⑤ I will practice singing pop songs.",
            accept_pairs=[("3", "4")],
        ),
        choose_all_item(
            iid="q15",
            sec=secs[13],
            label="15",
            prompt_en="자신만의 꿈을 가지는 것은 중요하다.\n________ your own dream is important.",
            accept_pairs=[("2", "3"), ("3", "2")],
        ),
        mc_item(
            iid="q16",
            sec=secs[14],
            label="16",
            choices=[
                "<u>To stay up</u> late is not good. (깨어 있는 것은)",
                "I like <u>to see</u> the stars in the sky. (보는 것을)",
                "I went into a building <u>to avoid</u> the rain. (피하기 위해)",
                "He hopes <u>to become</u> a soccer player someday. (되기 위해)",
                "They were happy <u>to meet</u> their old friends again. (만나서)",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q17",
            sec=secs[15],
            label="17",
            prompt_en="너의 이야기를 공유해줘서 고마워.",
            choices=[
                "Thank you of share your story.",
                "Thank you of sharing your story.",
                "Thank you for share your story.",
                "Thank you for sharing your story.",
                "Thank you sharing your story.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q18",
            sec=secs[16],
            label="18",
            prompt_en=(
                "ⓐ Watch scary movies is exciting.\n"
                "ⓑ Do you wish to know her name?\n"
                "ⓒ She stopped reading her magazine.\n"
                "ⓓ I plan playing soccer with my friends.\n"
                "ⓔ Henry is afraid of go out at night.\n"
                "ⓕ Eating a lot of chocolate are bad for your teeth."
            ),
            choices=["1개", "2개", "3개", "4개", "5개"],
            answer_index=4,
        ),
        fill_item(
            iid="q19",
            sec=secs[17],
            label="19",
            prompt_en="Q: What does Tyler do after school?\nA: He enjoys ____________________ after school. (play)",
            accept=["playing tennis", "playing"],
        ),
        fill_item(
            iid="q20",
            sec=secs[17],
            label="20",
            prompt_en="Q: What does Kate like to do after school?\nA: She loves ____________________ after school. (draw)",
            accept=["drawing pictures", "drawing"],
        ),
    ]
    return build_practice(
        practice_id="cm1:c10:test",
        title="Chapter Test",
        subtitle="Chapter 10 to부정사와 동명사 (p. 133–135)",
        pages="133–135",
        timer_minutes=32,
        sections=secs,
        items=items,
        test_id="c10-test",
        **m,
    )


if __name__ == "__main__":
    import sys

    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch09"):
        d9 = build_ch09_sb()
        _write_docs(d9, 9)
        print(f"chapter 09 sb: wrote {len(d9)} files")
    if fn in ("all", "ch10"):
        d10 = build_ch10_sb()
        _write_docs(d10, 10)
        print(f"chapter 10 sb: wrote {len(d10)} files")

