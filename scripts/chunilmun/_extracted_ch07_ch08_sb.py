#!/usr/bin/env python3
"""Scan-extracted SB practice data for Ch07–Ch08 — 천일문 Grammar 1 (PDF pp. 72–99)."""
from __future__ import annotations

from practice_lib import (
    CORR,
    MC,
    OX,
    SENT,
    WR,
    WR2,
    build_practice,
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


def _mask_word(sentence: str, word: str) -> str:
    """Hide a single answer token for type-in (underline-style SB items)."""
    import re

    pat = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
    if not pat.search(sentence):
        return sentence
    return pat.sub("________", sentence, count=1)


def _adj_prompt(sentence: str, adj: str) -> str:
    return _mask_word(sentence, adj)


def _adv_head_prompt(sentence: str, head: str) -> str:
    return _mask_word(sentence, head)


def _ox(sec: dict, label: str, iid: str, prompt: str, ok: bool, fix: str = "") -> dict:
    acc = ["O", "o"] if ok else [fix]
    if not ok and fix:
        acc.extend([f"X {fix}", f"X, {fix}"])
    return fill_item(iid=iid, sec=sec, label=label, prompt_en=prompt, accept=acc)


def _write_docs(data: dict[str, dict], chapter: int) -> None:
    for name, doc in data.items():
        write_practice(f"data/chunilmun1/chapter{chapter:02d}/{name}", doc)


def build_ch07_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(7, "형용사, 부사, 비교")

    sec = section(
        "A",
        "Section A",
        "<보기>와 같이 형용사를 찾아 밑줄을 긋고, 그것이 꾸미거나 보충 설명하는 말에 동그라미 하세요.",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 1·2",
    )
    u1a = [
        ("This is a difficult problem.", ["difficult"]),
        ("The cake is delicious.", ["delicious"]),
        ("He did something exciting.", ["exciting"]),
        ("She told us interesting stories.", ["interesting"]),
        ("He wrote beautiful poems for her.", ["beautiful"]),
        ("The music is loud.", ["loud"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=_adj_prompt(p, a[0]), accept=a)
        for i, (p, a) in enumerate(u1a, 1)
    ]
    out["c07-u1-A.json"] = build_practice(
        practice_id="cm1:c07:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="형용사 · POINT 1·2 (p. 82)",
        pages="82",
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
        "POINT 3·4",
    )
    u1b = [
        ("We didn't get [much / many] rain this summer.", ["much", "many"], 1),
        ("There are [much / lots of] flowers in the garden.", ["much", "lots of"], 2),
        ("She spent [a little / a few] time alone.", ["a little", "a few"], 1),
        ("There are [much / many] cars on the road.", ["much", "many"], 2),
        ("I took [a lot of / much] pictures with him.", ["a lot of", "much"], 1),
        ("[Few / Little] students know about the writer.", ["Few", "Little"], 1),
        ("There were [a little / a few] children on the playground.", ["a little", "a few"], 2),
    ]
    items = [_bracket(sec, f"B{i}", f"b{i:02d}", p, c, a) for i, (p, c, a) in enumerate(u1b, 1)]
    out["c07-u1-B.json"] = build_practice(
        practice_id="cm1:c07:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="형용사 · POINT 3·4 (p. 82)",
        pages="82",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 빈칸에 알맞은 말을 <보기>에서 골라 쓰세요.",
        WR,
        "words",
        labels_az("C", 5),
        "POINT 3·4",
        word_bank=["many", "much", "a few"],
    )
    u1c = [
        (
            "나는 이번 방학 동안에 많은 책을 읽을 것이다.\n→ I will read ________ books during this vacation.",
            ["many"],
        ),
        (
            "어떤 나라들에는 물이 많지 않다.\n→ There isn't ________ water in some countries.",
            ["much"],
        ),
        (
            "그 버스는 몇 분 전에 버스 정류장을 떠났다.\n→ The bus left the bus stop ________ minutes ago.",
            ["a few"],
        ),
        (
            "너는 이 가이드북에서 아주 많은 정보를 얻을 수 있다.\n→ You can find so ________ information in this guidebook.",
            ["much"],
        ),
        (
            "그 배우는 전 세계적으로 많은 상을 받았다.\n→ The actor received ________ awards all over the world.",
            ["many"],
        ),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1c, 1)]
    out["c07-u1-C.json"] = build_practice(
        practice_id="cm1:c07:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="형용사 · POINT 3·4 (p. 82)",
        pages="82",
        timer_minutes=18,
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
        labels_az("A", 6),
        "POINT 5",
    )
    u2a = [
        ("She danced **beautifully** on the stage.", ["danced"]),
        ("The movie was **very** scary.", ["scary"]),
        ("An elderly couple smiled **so** gently.", ["smiled"]),
        ("He greeted people **kindly**.", ["greeted"]),
        ("This apple pie is **too** sweet.", ["sweet"]),
        ("**Suddenly**, my father's car stopped on the road.", ["stopped", "my father's car stopped on the road"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=_adv_head_prompt(p, a[0]), accept=a)
        for i, (p, a) in enumerate(u2a, 1)
    ]
    out["c07-u2-A.json"] = build_practice(
        practice_id="cm1:c07:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="부사 · POINT 5 (p. 85)",
        pages="85",
        timer_minutes=18,
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
        labels_az("B", 4),
        "POINT 5",
    )
    u2b = [
        (
            "다행히도, 그는 제시간에 기차를 탔다.\n→ ________, he got on the train on time. (lucky)",
            ["Luckily"],
            1,
        ),
        (
            "그 영화는 심하게 지루했다.\n→ The movie was ________ ________. (boring, terrible)",
            ["terribly boring", "terribly|boring"],
            2,
        ),
        (
            "우리는 새로 온 학생을 따뜻하게 환영했다.\n→ We ________ the new student ________. (warm, welcomed)",
            ["warmly welcomed", "welcomed warmly", "welcomed|warmly", "warmly|welcomed"],
            2,
        ),
        (
            "그들은 음악 콘서트를 위해 열심히 준비했다.\n→ They ________ ________ for the music concert. (hard, prepared)",
            ["prepared hard", "prepared|hard"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(u2b, 1)
    ]
    out["c07-u2-B.json"] = build_practice(
        practice_id="cm1:c07:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="부사 · POINT 5 (p. 85)",
        pages="85",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
        WR2,
        "words",
        labels_az("C", 5),
        "POINT 6·7",
    )
    u2c = [
        (
            "그 공원은 보통 주말에 사람들로 가득하다.\n→ The park ________ full of people on weekends. (usually / is)",
            ["is usually", "is|usually"],
            2,
        ),
        (
            "그녀는 저녁 식사 후에 자주 개들을 산책시킨다.\n→ She ________ her dogs after dinner. (walks / often)",
            ["often walks", "often|walks"],
            2,
        ),
        (
            "Evan은 고기나 생선을 전혀 먹지 않는다.\n→ Evan ________ meat or fish. (never / eats)",
            ["never eats", "never|eats"],
            2,
        ),
        (
            "김 선생님은 주중에 늘 바쁘시다.\n→ Mr. Kim ________ busy during weekdays. (is / always)",
            ["is always", "is|always"],
            2,
        ),
        (
            "우리는 때때로 밤에 유성을 볼 수 있다.\n→ We ________ shooting stars at night. (see / can / sometimes)",
            ["can sometimes see", "can|sometimes|see"],
            3,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(u2c, 1)
    ]
    out["c07-u2-C.json"] = build_practice(
        practice_id="cm1:c07:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="부사 · POINT 6·7 (p. 85)",
        pages="85",
        timer_minutes=20,
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
        labels_az("A", 8),
        "POINT 9·10",
    )
    u3a = [
        ("My backpack is <u>heavyer</u> than yours.", ["heavier"]),
        ("It was the <u>happyest</u> moment of my life.", ["happiest"]),
        ("Jenny's pies tasted <u>gooder</u> than mine.", ["better"]),
        ("This mountain is <u>beautifuler</u> than last year.", ["more beautiful"]),
        ("My cat is <u>fater</u> than my dog.", ["fatter"]),
        ("This is the <u>badest</u> movie of this year.", ["worst"]),
        ("My father is still <u>more strong</u> than I am.", ["stronger"]),
        ("Books are the <u>usefulest</u> teaching materials.", ["most useful", "the most useful"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3a, 1)]
    out["c07-u3-A.json"] = build_practice(
        practice_id="cm1:c07:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="비교급·최상급 · POINT 9·10 (p. 89)",
        pages="89",
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
        labels_az("B", 4),
        "POINT 9·10·11·12",
    )
    u3b = [
        (
            "이 물고기가 연못에서 가장 크다. (**big**)\n→ This fish is ________ in the pond.",
            ["the biggest"],
            1,
        ),
        (
            "그녀는 친구들보다 더 많이 운동한다. (**much**)\n→ She exercises ________ her friends.",
            ["more than", "much more than"],
            2,
        ),
        (
            "그들은 그 호텔에서 가장 좋은 방을 예약했다. (**good, room**)\n→ They booked ________ at the hotel.",
            ["the best room", "the best|room"],
            2,
        ),
        (
            "오늘 기온이 어제보다 더 낮다. (**low**)\n→ The temperature today is ________ yesterday.",
            ["lower than"],
            2,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(u3b, 1)
    ]
    out["c07-u3-B.json"] = build_practice(
        practice_id="cm1:c07:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="비교급·최상급 · POINT 9·10·11·12 (p. 89)",
        pages="89",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "C",
        "Section C",
        "빈칸에 알맞은 말을 <보기>에서 골라 비교급이나 최상급을 사용해서 문장을 완성하세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("C", 5),
        "POINT 11·12",
        word_bank=["cold", "important", "great", "young", "difficult"],
    )
    u3c = [
        ("This week is ________ than last week.", ["colder"]),
        ("She's ________ tennis player in the country.", ["the greatest"]),
        ("The last question was ________ in the test.", ["the most difficult"]),
        ("Time is ________ than money for me.", ["more important"]),
        ("I am ________ in my family. I have two older brothers.", ["the youngest"]),
    ]
    items = [fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["c07-u3-C.json"] = build_practice(
        practice_id="cm1:c07:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="비교급·최상급 · POINT 11·12 (p. 89)",
        pages="89",
        timer_minutes=18,
        sections=[sec],
        items=items,
        **m,
    )

    out["c07-test.json"] = _build_ch07_test(m)
    return out


def _build_ch07_test(m: dict) -> dict:
    secs = [
        section(
            "1-3",
            "[1–3]",
            "[1–3] 다음 중 빈칸에 들어갈 말로 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(3),
        ),
        section(
            "4",
            "[4]",
            "[4] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            ["4"],
        ),
        section(
            "5",
            "[5]",
            "[5] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
            SENT,
            "sentence",
            ["5"],
        ),
        section("6", "[6]", "[6] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.", MC, "choice", ["6"]),
        section(
            "7-8",
            "[7–8]",
            "[7–8] 다음 중 어법상 알맞은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(2, 7),
        ),
        section(
            "9",
            "[9]",
            "[9] 다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.",
            MC,
            "choice",
            ["9"],
        ),
        section(
            "10",
            "[10]",
            "[10] 다음 짝지어진 두 단어의 관계가 나머지와 다른 하나를 고르세요.",
            MC,
            "choice",
            ["10"],
        ),
        section(
            "11",
            "[11]",
            "[11] 주어진 단어를 알맞은 곳에 넣어 문장을 다시 쓰세요.",
            SENT,
            "sentence",
            ["11"],
        ),
        section(
            "12",
            "[12]",
            "[12] 다음 중 밑줄 친 부분의 위치가 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            ["12"],
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 중 비교급과 최상급 형태가 잘못 연결된 것을 고르세요.",
            MC,
            "choice",
            ["13"],
        ),
        section(
            "14",
            "[14]",
            "[14] 다음 표의 내용과 일치하지 않는 것을 고르세요.",
            MC,
            "choice",
            ["14"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 대화에서 어법상 알맞지 않은 두 개를 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["15-1", "15-2"],
        ),
        section(
            "16",
            "[16]",
            "[16] 다음 중 어법상 알맞지 않은 것끼리 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["16"],
        ),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="Daniel is a ________ person.",
            choices=["smart", "good", "very", "perfect", "quiet"],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="We visited ________ places in Tokyo.",
            choices=["many", "a few", "lots of", "much", "few"],
            answer_index=4,
        ),
        mc_item(
            iid="q03",
            sec=secs[0],
            label="3",
            prompt_en="Seafood is more ________ than meat in the restaurant.",
            choices=["famous", "cheap", "popular", "delicious", "expensive"],
            answer_index=2,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en=(
                "① There isn't much water in the bottle.\n"
                "② I have a little friends in my neighbor.\n"
                "③ She didn't give much information to me.\n"
                "④ The singer got many letters from his fans.\n"
                "⑤ My family will be out of town for a few days."
            ),
            choices=["①", "②", "③", "④", "⑤"],
            answer_index=2,
        ),
        sent_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="나는 부모님을 위해 무언가 특별한 것을 요리할 것이다.\n(special / something / cook)\n→ I will ________________________________ for my parents.",
            accept=[
                "I will cook something special for my parents.",
                "cook something special for my parents",
            ],
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="She drinks ________ water every day.",
            choices=["many", "an", "few", "a few", "lots of"],
            answer_index=5,
        ),
        mc_item(
            iid="q07",
            sec=secs[4],
            label="7",
            choices=[
                "The girl has a love smile.",
                "Lucky, she passed the test.",
                "He went out his office quiet.",
                "The dog was surprising smart.",
                "Did you see the weekly news?",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q08",
            sec=secs[4],
            label="8",
            choices=[
                "Ian talked very fastly.",
                "You should drive carefully.",
                "She crossed the road quick.",
                "I couldn't choose an answer easy.",
                "The turtle walked slow on the sand.",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en=(
                "① The building is very high.\n"
                "② She can reach the high shelf.\n"
                "③ I got a high score on the exam.\n"
                "④ He jumped high and caught the ball.\n"
                "⑤ The prices are too high at that store."
            ),
            choices=["①", "②", "③", "④", "⑤"],
            answer_index=4,
        ),
        mc_item(
            iid="q10",
            sec=secs[6],
            label="10",
            choices=[
                "wise — wisely",
                "glad — gladly",
                "loud — loudly",
                "friend — friendly",
                "strong — strongly",
            ],
            answer_index=4,
        ),
        sent_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en="I will use plastic bags from now on. (never)",
            accept=["I will never use plastic bags from now on."],
        ),
        mc_item(
            iid="q12",
            sec=secs[8],
            label="12",
            choices=[
                "I will often visit their homes.",
                "My school usually starts at 9.",
                "Jennifer always walks to school.",
                "They always are busy on Mondays.",
                "You can sometimes borrow my books.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q13",
            sec=secs[9],
            label="13",
            choices=[
                "big — biger — bigest",
                "nice — nicer — nicest",
                "many — more — most",
                "happy — happier — happiest",
                "difficult — more difficult — most difficult",
            ],
            answer_index=1,
        ),
        mc_item(
            iid="q14",
            sec=secs[10],
            label="14",
            prompt_en=(
                "Boa age 13 height 161cm weight 50kg | Bill age 14 height 167cm weight 70kg | "
                "Kate age 15 height 165cm weight 48kg"
            ),
            choices=[
                "Bill is older than Boa.",
                "Kate is shorter than Bill.",
                "Boa is heavier than Kate.",
                "Bill is the tallest of the three.",
                "Kate is the youngest of the three.",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q15a",
            sec=secs[11],
            label="15-1",
            prompt_en=(
                "A: Did you get a new bag? It is nice!\n"
                "B: Thank you. I bought it a little days ago.\n"
                "A: It is a big bag. Isn't it heavy?\n"
                "B: It is more light than my old one.\n"
                "(1) ________ → ________"
            ),
            accept=["a little|a few", "a little days|a few days"],
            blanks=2,
        ),
        fill_item(
            iid="q15b",
            sec=secs[11],
            label="15-2",
            prompt_en="(2) ________ → ________",
            accept=["more light|lighter"],
            blanks=2,
        ),
        mc_item(
            iid="q16",
            sec=secs[12],
            label="16",
            prompt_en=(
                "ⓐ Don't put too many sugar in it.\n"
                "ⓑ Mary knows a little Chinese words.\n"
                "ⓒ My condition is worst than yesterday.\n"
                "ⓓ August is the hottest month in Korea.\n"
                "ⓔ My teacher gives always good advice to me."
            ),
            choices=["ⓐ, ⓑ", "ⓒ, ⓓ", "ⓑ, ⓒ, ⓔ", "ⓐ, ⓓ, ⓔ", "ⓐ, ⓑ, ⓒ, ⓔ"],
            answer_index=5,
        ),
    ]
    return build_practice(
        practice_id="cm1:c07:test",
        title="Chapter Test",
        subtitle="Chapter 07 형용사, 부사, 비교 (p. 90–91)",
        pages="90–91",
        timer_minutes=28,
        sections=secs,
        items=items,
        test_id="c07-test",
        **m,
    )


def build_ch08_sb() -> dict[str, dict]:
    out: dict[str, dict] = {}
    m = sb(8, "여러 가지 문장 종류")

    sec = section(
        "A",
        "Section A",
        "다음 밑줄 친 부분이 맞으면 O, 틀리면 X하고 바르게 고치세요.",
        OX,
        "words",
        labels_az("A", 7),
        "POINT 1·2·4",
    )
    u1a = [
        ("<u>Honest</u> to your family.", False, "Be honest"),
        ("<u>Let's met</u> at four.", False, "Let's meet"),
        ("<u>Take</u> the medicine three times a day.", True, ""),
        ("<u>Not be</u> rude to others.", False, "Don't be rude to others"),
        ("<u>Let's play not</u> baseball today.", False, "Let's not play baseball"),
        ("<u>Don't angry</u> with him.", False, "Don't be angry with him"),
        ("<u>Not go</u> near the water.", False, "Don't go near the water"),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u1a, 1)]
    out["c08-u1-A.json"] = build_practice(
        practice_id="cm1:c08:u1-A",
        title="Unit 1 Unit Exercise — Section A",
        subtitle="명령문·제안문·감탄문 · POINT 1·2·4 (p. 96)",
        pages="96",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "다음 문장을 주어진 단어를 사용하여 감탄문으로 바꿔 쓰세요.",
        SENT,
        "sentence",
        labels_az("B", 5),
        "POINT 4",
    )
    u1b = [
        (
            "It is a very old piano. (What)\n→ ________ it is!",
            ["What an old piano it is!", "What an old piano!"],
        ),
        (
            "The shoes are very pretty. (How)\n→ ________ the shoes are!",
            ["How pretty the shoes are!"],
        ),
        (
            "It is a very big house. (What)\n→ ________ it is!",
            ["What a big house it is!", "What a big house!"],
        ),
        (
            "They are very creative people. (What)\n→ ________ they are!",
            ["What creative people they are!"],
        ),
        (
            "The movie is very interesting. (How)\n→ ________ the movie is!",
            ["How interesting the movie is!"],
        ),
    ]
    items = [sent_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1b, 1)]
    out["c08-u1-B.json"] = build_practice(
        practice_id="cm1:c08:u1-B",
        title="Unit 1 Unit Exercise — Section B",
        subtitle="명령문·제안문·감탄문 · POINT 4 (p. 96)",
        pages="96",
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
        labels_az("C", 5),
        "POINT 1·2·3",
    )
    u1c = [
        (
            "식사 전에 손을 씻어라. (your hands, wash)\n→ ________ before meals.",
            ["Wash your hands", "Wash your hands before meals."],
        ),
        (
            "거실을 어지르지 마라. (a mess, make)\n→ ________ in the living room.",
            ["Don't make a mess", "Do not make a mess"],
        ),
        (
            "네 행동에 신중해라. (careful, be)\n→ ________ with your actions.",
            ["Be careful", "Be careful with your actions."],
        ),
        (
            "내일 점심을 같이 먹자. (lunch, have)\n→ ________ together tomorrow.",
            ["Let's have lunch", "Let's have lunch together tomorrow."],
        ),
        (
            "학교에 지각하지 마라. (late, be)\n→ ________ for school.",
            ["Don't be late", "Do not be late for school."],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u1c, 1)]
    out["c08-u1-C.json"] = build_practice(
        practice_id="cm1:c08:u1-C",
        title="Unit 1 Unit Exercise — Section C",
        subtitle="명령문·제안문·감탄문 · POINT 1·2·3 (p. 96)",
        pages="96",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    bank = ["what", "how long", "where", "which flowers", "how much", "when"]
    sec = section(
        "A",
        "Section A",
        "다음 대답을 보고 빈칸에 알맞은 표현을 <보기>에서 골라 쓰세요. (단, 한 번씩만 쓸 것)",
        WR,
        "words",
        labels_az("A", 6),
        "POINT 6·7·8·9",
        word_bank=bank,
    )
    u2a = [
        ("A: ________ is the fish? / B: It's 38 centimeters.", ["How long"]),
        ("A: ________ does the store open? / B: It opens in 15 minutes.", ["When"]),
        ("A: ________ will you buy? / B: I will buy some roses.", ["Which flowers"]),
        ("A: ________ does the Sun set? / B: The Sun sets in the west.", ["Where"]),
        ("A: ________ do you do after dinner? / B: I usually watch TV with my family.", ["What"]),
        ("A: ________ is this bag? / B: It is 10 dollars.", ["How much"]),
    ]
    items = [fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u2a, 1)]
    out["c08-u2-A.json"] = build_practice(
        practice_id="cm1:c08:u2-A",
        title="Unit 2 Unit Exercise — Section A",
        subtitle="의문사 의문문 · POINT 6·7·8·9 (p. 100)",
        pages="100",
        timer_minutes=20,
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
        {"left": "Whose wallet is on the chair?", "right": "It's Jisu's."},
        {"left": "Which do you like, cats or dogs?", "right": "I like cats better."},
        {"left": "When should I return this book?", "right": "By Saturday."},
        {"left": "How was the musical yesterday?", "right": "It was fantastic."},
        {"left": "What is your sister doing now?", "right": "She's taking a nap."},
    ]
    items = [
        match_item(
            iid="b01",
            sec=sec,
            label="B1",
            pairs=pairs,
            prompt_ko="질문 1–5와 대답 ⓐ–ⓔ 연결",
        )
    ]
    out["c08-u2-B.json"] = build_practice(
        practice_id="cm1:c08:u2-B",
        title="Unit 2 Unit Exercise — Section B",
        subtitle="의문사 의문문 · POINT 6·7·8·9 (p. 100)",
        pages="100",
        timer_minutes=18,
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
        labels_az("C", 5),
        "POINT 5·6·7·8·9",
    )
    u2c = [
        (
            "너는 얼마나 자주 야구를 하니? (play)\n→ ________ ________ ________ ________ ________ baseball?",
            ["How often do you play", "How|often|do|you|play"],
            5,
        ),
        (
            "Frank는 지금 누구와 통화 중이니? (talk)\n→ ________ ________ ________ ________ ________ with on the phone now?",
            [
                "Who is Frank talking with",
                "Who is Frank talking to",
                "Who|is|Frank|talking|with",
                "Who|is|Frank|talking|to",
            ],
            5,
        ),
        (
            "너는 왜 화가 나 있니? (upset)\n→ ________ ________ ________ ________?",
            ["Why are you upset", "Why|are|you|upset"],
            4,
        ),
        (
            "Lisa는 방학 동안에 어디를 방문했니? (visit)\n→ ________ ________ ________ ________ during the vacation?",
            ["Where did Lisa visit", "Where|did|Lisa|visit"],
            4,
        ),
        (
            "너는 내일 Cindy와 몇 시에 만날 거니? (meet)\n→ ________ ________ ________ ________ ________ with Cindy tomorrow?",
            ["What time will you meet", "What|time|will|you|meet"],
            5,
        ),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(u2c, 1)
    ]
    out["c08-u2-C.json"] = build_practice(
        practice_id="cm1:c08:u2-C",
        title="Unit 2 Unit Exercise — Section C",
        subtitle="의문사 의문문 · POINT 5·6·7·8·9 (p. 100)",
        pages="100",
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
        labels_az("A", 7),
        "POINT 10",
    )
    u3a = [
        ("The actor is very famous, <u>doesn't he</u>?", False, "isn't he"),
        ("We are not going to leave now, <u>aren't we</u>?", False, "are we"),
        ("My teacher looks upset now, <u>doesn't she</u>?", True, ""),
        ("Tell me about your last vacation, <u>shall you</u>?", False, "will you"),
        ("Jack can play the trumpet, <u>can't he</u>?", True, ""),
        ("Nick and Betty don't know your address, <u>do you</u>?", False, "don't they"),
        ("You have a pet dog, <u>aren't you</u>?", False, "don't you"),
    ]
    items = [_ox(sec, f"A{i}", f"a{i:02d}", p, ok, fix) for i, (p, ok, fix) in enumerate(u3a, 1)]
    out["c08-u3-A.json"] = build_practice(
        practice_id="cm1:c08:u3-A",
        title="Unit 3 Unit Exercise — Section A",
        subtitle="부가·부정 의문문 · POINT 10 (p. 103)",
        pages="103",
        timer_minutes=20,
        sections=[sec],
        items=items,
        **m,
    )

    sec = section(
        "B",
        "Section B",
        "빈칸에 알맞은 말을 써서 대화를 완성하세요.",
        WR2,
        "words",
        labels_az("B", 4),
        "POINT 10·11",
    )
    u3b = [
        (
            "A: She is a nurse, ________ ________?\nB: Yes, ________ ________.",
            ["isn't she|she is", "isn't|she|she|is"],
            4,
        ),
        (
            "A: You don't like hot weather, ________ ________?\nB: No, ________ ________.",
            ["do you|I don't", "do|you|I|don't"],
            4,
        ),
        (
            "A: He can speak Chinese, ________ ________?\nB: Yes, ________ ________.",
            ["can't he|he can", "can't|he|he|can"],
            4,
        ),
        (
            "A: Jane was in New York last year, ________ ________?\nB: No, ________ ________.",
            ["wasn't she|she wasn't", "wasn't|she|she|wasn't"],
            4,
        ),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=p, accept=a, blanks=bl)
        for i, (p, a, bl) in enumerate(u3b, 1)
    ]
    out["c08-u3-B.json"] = build_practice(
        practice_id="cm1:c08:u3-B",
        title="Unit 3 Unit Exercise — Section B",
        subtitle="부가·부정 의문문 · POINT 10·11 (p. 103)",
        pages="103",
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
        labels_az("C", 5),
        "POINT 10·12",
    )
    u3c = [
        (
            "그 영화는 매우 낭만적이었어, 그렇지 않니? (be very romantic)\n→ The movie ________, ________?",
            ["was very romantic, wasn't it", "The movie was very romantic, wasn't it?"],
        ),
        (
            "Mary는 여동생이 있지 않니? (have)\n→ ________ a sister?",
            ["Doesn't Mary have", "Doesn't Mary have a sister?"],
        ),
        (
            "오늘 밤에 콘서트에 갈래? (go to the concert)\n→ ________, ________?",
            ["Let's go to the concert tonight, shall we", "Let's go to the concert tonight, shall we?"],
        ),
        (
            "길 건너에 저 사람 Rachel이지 않니? (that)\n→ ________ across the street?",
            ["Isn't that Rachel", "Isn't that Rachel across the street?"],
        ),
        (
            "그 소년은 노래 대회에 참가하지 않았어, 그렇지? (participate in)\n→ The boy ________, ________?",
            [
                "didn't participate in the singing contest, did he",
                "The boy didn't participate in the singing contest, did he?",
            ],
        ),
    ]
    items = [sent_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=p, accept=a) for i, (p, a) in enumerate(u3c, 1)]
    out["c08-u3-C.json"] = build_practice(
        practice_id="cm1:c08:u3-C",
        title="Unit 3 Unit Exercise — Section C",
        subtitle="부가·부정 의문문 · POINT 10·12 (p. 103)",
        pages="103",
        timer_minutes=22,
        sections=[sec],
        items=items,
        **m,
    )

    out["c08-test.json"] = _build_ch08_test(m)
    return out


def _build_ch08_test(m: dict) -> dict:
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section(
            "3",
            "[3]",
            "[3] 다음 중 밑줄 친 부분이 어법상 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            ["3"],
        ),
        section(
            "4-5",
            "[4–5]",
            "[4–5] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
            SENT,
            "sentence",
            labels_num(2, 4),
        ),
        section(
            "6",
            "[6]",
            "[6] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            ["6"],
        ),
        section(
            "7",
            "[7]",
            "[7] 다음 표지판을 보고, 주어진 단어를 사용하여 문장을 완성하세요.",
            WR2,
            "words",
            ["7-1", "7-2"],
        ),
        section(
            "8-9",
            "[8–9]",
            "[8–9] 다음 대화의 빈칸에 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 8),
        ),
        section(
            "10",
            "[10]",
            "[10] 다음 중 대화가 어색한 것을 고르세요.",
            MC,
            "choice",
            ["10"],
        ),
        section(
            "11",
            "[11]",
            "[11] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            ["11"],
        ),
        section(
            "12",
            "[12]",
            "[12] 다음 중 빈칸에 들어갈 단어가 나머지와 다른 하나를 고르세요.",
            MC,
            "choice",
            ["12"],
        ),
        section(
            "13",
            "[13]",
            "[13] 다음 중 어법상 알맞은 문장을 고르세요.",
            MC,
            "choice",
            ["13"],
        ),
        section(
            "14",
            "[14]",
            "[14] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
            SENT,
            "sentence",
            ["14-1", "14-2"],
        ),
        section(
            "15",
            "[15]",
            "[15] 다음 중 어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["15"],
        ),
        section(
            "16",
            "[16]",
            "[16] 다음 대화에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["16"],
        ),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="________ is your English teacher, Mr. Kim or Ms. Park?",
            choices=["Who", "Why", "Where", "When", "How"],
            answer_index=1,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="________ are you going to do this weekend?",
            choices=["Who", "Why", "What", "When", "How"],
            answer_index=3,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            prompt_en=(
                "① Eric studies hard, doesn't he?\n"
                "② They don't play tennis, do they?\n"
                "③ The girl is from America, isn't she?\n"
                "④ You and I are good friends, aren't we?\n"
                "⑤ Your sister doesn't like sports, do you?"
            ),
            choices=["①", "②", "③", "④", "⑤"],
            answer_index=5,
        ),
        sent_item(
            iid="q04",
            sec=secs[2],
            label="4",
            prompt_en="밤에 컴퓨터 게임을 하지 마라.\n(computer games / play / at night / don't)\n→ __________________________________________________________.",
            accept=["Don't play computer games at night."],
        ),
        sent_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="그것은 정말 재미있는 이야기구나!\n(it / an / story / what / interesting / is)\n→ __________________________________________________________!",
            accept=["What an interesting story it is!", "What an interesting story!"],
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            choices=[
                "Don't you live near my house?",
                "Amy will travel France, won't Amy?",
                "Wasn't Paul at the party yesterday?",
                "The store doesn't open on weekends, does it?",
                "Tim and Sally are in the classroom, aren't they?",
            ],
            answer_index=2,
        ),
        fill_item(
            iid="q07a",
            sec=secs[4],
            label="7-1",
            prompt_en="(No pets sign) ________ ________ ________ ________ to the restaurant. (pets, bring)",
            accept=[
                "Do not bring pets",
                "Don't bring pets",
                "Do|not|bring|pets",
                "Don't|bring|pets",
            ],
            blanks=4,
        ),
        fill_item(
            iid="q07b",
            sec=secs[4],
            label="7-2",
            prompt_en="(No running sign) ________ ________ ________ ________ in the library. (run)",
            accept=["Do not run", "Don't run", "Do|not|run", "Don't|run"],
            blanks=4,
        ),
        mc_item(
            iid="q08",
            sec=secs[5],
            label="8",
            prompt_en="A: The question was difficult, ________?\nB: Yes, it was.",
            choices=["was it", "was they", "wasn't it", "did it", "didn't it"],
            answer_index=3,
        ),
        mc_item(
            iid="q09",
            sec=secs[5],
            label="9",
            prompt_en="A: Aren't you thirsty?\nB: ________. I drank enough water.",
            choices=["Yes, I am", "No, I'm not", "Yes, I'm not", "No, I am", "Yes, I do"],
            answer_index=2,
        ),
        mc_item(
            iid="q10",
            sec=secs[6],
            label="10",
            choices=[
                "A: Whose jacket is this? / B: It is mine.",
                "A: What is Jane doing? / B: She is riding a bike.",
                "A: Where does she go after dinner? / B: She usually has dinner at 7:30.",
                "A: How long does it take to Daegu? / B: It takes about three hours.",
                "A: What time do you have breakfast? / B: Usually at 7.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q11",
            sec=secs[7],
            label="11",
            prompt_en=(
                "• ________ can I get to the bus stop?\n"
                "• ________ long do the penguins live?\n"
                "• ________ boring the movie is!"
            ),
            choices=["Who", "What", "Which", "Where", "How"],
            answer_index=5,
        ),
        mc_item(
            iid="q12",
            sec=secs[8],
            label="12",
            choices=[
                "________ a beautiful day!",
                "________ smart you are!",
                "________ a strong man he is!",
                "________ a tall building this is!",
                "________ hard questions they are!",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q13",
            sec=secs[9],
            label="13",
            choices=[
                "Turns off the TV.",
                "Not bite your nails.",
                "Don't late for classes.",
                "Go straight and turn left.",
                "Please held the door for me.",
            ],
            answer_index=4,
        ),
        sent_item(
            iid="q14a",
            sec=secs[10],
            label="14-1",
            prompt_en="(1) 그 소녀는 정말 아름답게 웃는구나! (how, smile, beautifully)\n→ __________________________!",
            accept=["How beautifully the girl smiles!", "How beautifully she smiles!"],
        ),
        sent_item(
            iid="q14b",
            sec=secs[10],
            label="14-2",
            prompt_en="(2) 그것들은 정말 귀여운 고양이들이구나! (what, cute)\n→ __________________________!",
            accept=["What cute cats they are!", "What cute cats!"],
        ),
        mc_item(
            iid="q15",
            sec=secs[11],
            label="15",
            prompt_en=(
                "ⓐ Why you took the subway?\n"
                "ⓑ When does he goes to bed?\n"
                "ⓒ Where are your friend going?\n"
                "ⓓ What is the name of this picture?\n"
                "ⓔ Who is the woman with the glasses?\n"
                "ⓕ What time did you get up this morning?"
            ),
            choices=["ⓐ, ⓑ, ⓒ", "ⓐ, ⓒ, ⓓ", "ⓑ, ⓓ, ⓔ", "ⓒ, ⓓ, ⓕ", "ⓓ, ⓔ, ⓕ"],
            answer_index=5,
        ),
        fill_item(
            iid="q16",
            sec=secs[12],
            label="16",
            prompt_en=(
                "A: How are you so sad today?\n"
                "B: Because I lost my wallet and can't find it.\n"
                "A: Let's go back the way you came.\n"
                "B: What a good idea it is!\n"
                "________ → ________"
            ),
            accept=["How are|Why are", "How are you|Why are you"],
            blanks=2,
        ),
    ]
    return build_practice(
        practice_id="cm1:c08:test",
        title="Chapter Test",
        subtitle="Chapter 08 여러 가지 문장 종류 (p. 104–105)",
        pages="104–105",
        timer_minutes=28,
        sections=secs,
        items=items,
        test_id="c08-test",
        **m,
    )


if __name__ == "__main__":
    import sys

    fn = sys.argv[1] if len(sys.argv) > 1 else "all"
    if fn in ("all", "ch07"):
        d7 = build_ch07_sb()
        _write_docs(d7, 7)
        print(f"chapter 07 sb: wrote {len(d7)} files")
    if fn in ("all", "ch08"):
        d8 = build_ch08_sb()
        _write_docs(d8, 8)
        print(f"chapter 08 sb: wrote {len(d8)} files")
