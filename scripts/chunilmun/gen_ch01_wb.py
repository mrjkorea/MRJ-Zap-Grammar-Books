#!/usr/bin/env python3
"""Generate remaining Chapter 01 Workbook practices from WB answer key (p.31–32)."""
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
    mc_item,
    section,
    sent_item,
    write_practice,
)

UNIT = "wb-chapter-01"
UNIT_TITLE = "Ch 01 WB — be동사"
RULE_WORDS = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
RULE_MC = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
RULE_SENT = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
OUT = "data/chunilmun1/chapter01"


def wb_u1_c():
    sec = section(
        "C",
        "Section C",
        "다음 빈칸에 들어갈 be동사를 어법상 알맞은 형태로 쓰세요. POINT 1·2·4.",
        RULE_WORDS,
        "words",
        labels_az("C", 10),
    )
    rows = [
        ("A cat is in my room now.", ["is"]),
        ("It was sunny yesterday.", ["was"]),
        ("I am at home now.", ["am"]),
        ("We are in the same class now.", ["are"]),
        ("The children are happy now.", ["are"]),
        ("I was in Italy two months ago.", ["was"]),
        ("You and James are on the same team now.", ["are"]),
        ("Sophia is free now.", ["is"]),
        ("They were too angry last night.", ["were"]),
        ("My sister and I were short a year ago.", ["were"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=en, accept=acc)
        for i, (en, acc) in enumerate(rows, 1)
    ]
    write_practice(
        f"{OUT}/wb-c01-u1-C.json",
        build_practice(
            practice_id="cm1:wb-c01:u1-C",
            title="Workbook Unit 1 — Section C",
            subtitle="be동사의 긍정문 · POINT 1·2·4 (WB p. 2)",
            pages="2",
            timer_minutes=22,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_u1_d():
    sec = section(
        "D",
        "Section D",
        "괄호 안에서 알맞은 be동사를 고르고, 우리말 해석을 완성하세요. POINT 2·3·4.",
        "첫 칸에는 괄호 안에서 고른 be동사만, 둘째 칸에는 빈칸에 들어갈 우리말만 쓰세요. (문장 전체를 쓰지 마세요.)",
        "words",
        labels_az("D", 8),
    )
    rows = [
        (
            "The cake ( is / was ) sweet.",
            "→ 그 케이크는 ________________.",
            "was",
            ["달콤했다", "달콤했어", "맛있고 달콤했다"],
        ),
        (
            "Tom ( is / was ) in the bathroom.",
            "→ Tom은 ________________.",
            "was",
            ["화장실에 있었다", "화장실에 있었어"],
        ),
        (
            "The sky ( is / are ) clear.",
            "→ 하늘이 ________________.",
            "is",
            ["맑다", "맑아", "맑습니다"],
        ),
        (
            "We ( was / were ) the winners.",
            "→ 우리는 ________________.",
            "were",
            ["우승자였다", "우승자였어"],
        ),
        (
            "My cat ( is / are ) on the bed.",
            "→ 내 고양이는 ________________.",
            "is",
            ["침대 위에 있다", "침대 위에 있어"],
        ),
        (
            "Mr. Kim ( is / are ) a music teacher.",
            "→ 김 선생님은 ________________.",
            "is",
            ["음악 선생님이다", "음악 선생님이야", "음악 선생님이에요"],
        ),
        (
            "Paul ( is / are ) handsome.",
            "→ Paul은 ________________.",
            "is",
            ["잘생겼다", "잘생겼어"],
        ),
        (
            "They ( was / were ) at the bank.",
            "→ 그들은 ________________.",
            "were",
            ["은행에 있었다", "은행에 있었어"],
        ),
    ]
    items = []
    for i, (en, ko, verb, korean_opts) in enumerate(rows, 1):
        accept = [f"{verb}|{k}" for k in korean_opts]
        items.append(
            fill_item(
                iid=f"d{i:02d}",
                sec=sec,
                label=f"D{i}",
                prompt_en=en,
                prompt_ko=ko,
                blanks=2,
                blank_labels=["be동사", "해석"],
                accept=accept,
            )
        )
    write_practice(
        f"{OUT}/wb-c01-u1-D.json",
        build_practice(
            practice_id="cm1:wb-c01:u1-D",
            title="Workbook Unit 1 — Section D",
            subtitle="be동사의 긍정문 · POINT 2·3·4 (WB p. 2)",
            pages="2",
            timer_minutes=22,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_u2_a():
    sec = section(
        "A",
        "Section A",
        "우리말과 일치하도록 빈칸에 알맞은 말을 쓰세요. POINT 5.",
        "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)",
        "words",
        labels_az("A", 10),
    )
    rows = [
        ("It ________ very expensive.", ["isn't", "is not"]),
        ("________ you a swimmer?", ["Are"]),
        ("I ________ here last week.", ["wasn't", "was not"]),
        ("________ she with you?", ["Is"]),
        ("________ they busy yesterday?", ["Were"]),
        ("Daniel ________ interested in soccer.", ["isn't", "is not"]),
        ("________ Lisa in the first grade last year?", ["Was"]),
        ("My mother and I ________ at the mall.", ["aren't", "are not"]),
        ("We ________ at school two hours ago.", ["weren't", "were not"]),
        ("________ Robert and Kelly on vacation?", ["Are"]),
    ]
    items = [
        fill_item(iid=f"a{i:02d}", sec=sec, label=f"A{i}", prompt_en=en, accept=acc)
        for i, (en, acc) in enumerate(rows, 1)
    ]
    write_practice(
        f"{OUT}/wb-c01-u2-A.json",
        build_practice(
            practice_id="cm1:wb-c01:u2-A",
            title="Workbook Unit 2 — Section A",
            subtitle="be동사의 부정문과 의문문 · POINT 5 (WB p. 4)",
            pages="4",
            timer_minutes=22,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_u2_b():
    sec = section(
        "B",
        "Section B",
        "다음 문장을 부정문으로 바꾸세요. POINT 5.",
        RULE_WORDS,
        "words",
        labels_az("B", 7),
    )
    rows = [
        ("He was happy.", ["was not", "wasn't"]),
        ("They are students.", ["are not", "aren't"]),
        ("You are late.", ["are not", "aren't"]),
        ("She is tired.", ["is not", "isn't"]),
        ("We were friends.", ["were not", "weren't"]),
        ("I was sick.", ["was not", "wasn't"]),
        ("Tom and I are cousins.", ["are not", "aren't"]),
    ]
    items = [
        fill_item(iid=f"b{i:02d}", sec=sec, label=f"B{i}", prompt_en=en, accept=acc)
        for i, (en, acc) in enumerate(rows, 1)
    ]
    write_practice(
        f"{OUT}/wb-c01-u2-B.json",
        build_practice(
            practice_id="cm1:wb-c01:u2-B",
            title="Workbook Unit 2 — Section B",
            subtitle="be동사의 부정문과 의문문 · POINT 5 (WB p. 4)",
            pages="4",
            timer_minutes=20,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_u2_c():
    sec = section(
        "C",
        "Section C",
        "다음 질문에 알맞은 대답을 쓰세요. POINT 6.",
        "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)",
        "words",
        labels_az("C", 7),
    )
    rows = [
        ("A: Is she smart?\nB: ________ , ________ ________ .", ["Yes|she|is"]),
        (
            "A: Is James free today?\nB: ________ , ________ ________ .",
            ["No|he|isn't", "No|he|is not"],
        ),
        (
            "A: Was it delicious?\nB: ________ , ________ ________ .",
            ["No|it|wasn't", "No|it|was not"],
        ),
        (
            "A: Are they your sisters?\nB: ________ , ________ ________ .",
            ["No|they|aren't", "No|they|are not"],
        ),
        ("A: Is the dog in your room now?\nB: ________ , ________ ________ .", ["Yes|it|is"]),
        ("A: Are Tim and Sera in the library now?\nB: ________ , ________ ________ .", ["Yes|they|are"]),
        ("A: Were your mom and dad happy?\nB: ________ , ________ ________ .", ["Yes|they|were"]),
    ]
    items = [
        fill_item(iid=f"c{i:02d}", sec=sec, label=f"C{i}", prompt_en=en, blanks=3, accept=acc)
        for i, (en, acc) in enumerate(rows, 1)
    ]
    write_practice(
        f"{OUT}/wb-c01-u2-C.json",
        build_practice(
            practice_id="cm1:wb-c01:u2-C",
            title="Workbook Unit 2 — Section C",
            subtitle="be동사의 부정문과 의문문 · POINT 6 (WB p. 4)",
            pages="4",
            timer_minutes=22,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_u2_d():
    sec = section(
        "D",
        "Section D",
        "주어진 단어를 사용해서 질문을 완성하세요. POINT 6.",
        "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)",
        "words",
        labels_az("D", 6),
    )
    rows = [
        ("________ ________ snowy yesterday? (it)", ["Was", "it"], 2),
        ("________ Alice at the concert? (is)", ["Is", "Alice", "at", "the", "concert"], 5),
        ("________ the test difficult? (was)", ["Was", "the", "test", "difficult"], 4),
        ("________ you serious? (are)", ["Are", "you", "serious"], 3),
        ("________ the movie interesting? (is)", ["Is", "the", "movie", "interesting"], 4),
        ("________ Mary and Jason twins? (are)", ["Are", "Mary", "and", "Jason", "twins"], 5),
    ]
    items = []
    for i, (en, acc, blanks) in enumerate(rows, 1):
        items.append(
            fill_item(
                iid=f"d{i:02d}",
                sec=sec,
                label=f"D{i}",
                prompt_en=en,
                blanks=blanks,
                accept=["|".join(acc)],
            )
        )
    write_practice(
        f"{OUT}/wb-c01-u2-D.json",
        build_practice(
            practice_id="cm1:wb-c01:u2-D",
            title="Workbook Unit 2 — Section D",
            subtitle="be동사의 부정문과 의문문 · POINT 6 (WB p. 4)",
            pages="4",
            timer_minutes=20,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=[sec],
            items=items,
        ),
    )


def wb_test():
    ph = ["①", "②", "③", "④", "⑤"]
    mc = lambda n: [f"{c} option" for c in ph]

    secs = [
        section("1-3", "[1–3]", "[1–3] 다음 중 알맞은 것을 고르세요.", RULE_MC, "choice", labels_num(3)),
        section("4", "[4]", "[4] 빈칸에 들어갈 be동사를 쓰세요.", RULE_WORDS, "words", ["4"]),
        section("5-7", "[5–7]", "[5–7] 다음 중 알맞은 것을 고르세요.", RULE_MC, "choice", labels_num(3, 5)),
        section("8", "[8]", "[8] 다음 문장을 완성하세요.", RULE_WORDS, "words", ["8"]),
        section("9-10", "[9–10]", "[9–10] 다음 문장을 바꿔 쓰세요.", RULE_SENT, "sentence", labels_num(2, 9)),
        section("11", "[11]", "[11] 다음 중 알맞은 것을 고르세요.", RULE_MC, "choice", ["11"]),
        section("12-13", "[12–13]", "[12–13] 알맞은 보기 번호 두 개를 각각 쓰세요.", "①~⑤ 또는 1~5, 순서는 상관없어요.", "words", labels_num(2, 12)),
        section("14-16", "[14–16]", "[14–16] 다음 중 알맞은 것을 고르세요.", RULE_MC, "choice", labels_num(3, 14)),
    ]
    items = []
    for i, ans in enumerate([4, 4, 3], 1):
        items.append(mc_item(iid=f"q{i:02d}", sec=secs[0], label=str(i), choices=mc(i), answer_index=ans, prompt_en=f"WB Ch01 test item {i}."))
    items.append(
        fill_item(
            iid="q04",
            sec=secs[1],
            label="4",
            prompt_en="He ( last year ) ________ .\nSally and I ( now ) ________ .\nTom and David ( at that time ) ________ .",
            blanks=3,
            accept=["was|are|were"],
        )
    )
    for i, ans in enumerate([3, 2, 3], 5):
        items.append(
            mc_item(iid=f"q{i:02d}", sec=secs[2], label=str(i), choices=mc(i), answer_index=ans, prompt_en=f"WB Ch01 test item {i}.")
        )
    items.append(
        fill_item(
            iid="q08",
            sec=secs[3],
            label="8",
            prompt_en="That house ________ clean.",
            accept=["isn't", "is not"],
        )
    )
    items.append(
        sent_item(
            iid="q09",
            sec=secs[4],
            label="9",
            prompt_en="(The mountain is very high.) → negative",
            accept=["The mountain is not so high.", "The mountain isn't so high."],
        )
    )
    items.append(
        sent_item(
            iid="q10",
            sec=secs[4],
            label="10",
            prompt_en="(I am too loud.) → question",
            accept=["Am I too loud?"],
        )
    )
    items.append(mc_item(iid="q11", sec=secs[5], label="11", choices=mc(11), answer_index=1, prompt_en="WB Ch01 test item 11."))
    items.append(
        choose_all_item(
            iid="q12",
            sec=secs[6],
            label="12",
            prompt_en="① I am not tired.\n② She aren't happy.\n③ They were late yesterday.\n④ We was at home.\n⑤ He is a doctor.",
            accept_pairs=[("2", "4")],
        )
    )
    items.append(
        choose_all_item(
            iid="q13",
            sec=secs[6],
            label="13",
            prompt_en="① Are you free last Sunday?\n② Is the window open?\n③ Was she at school?\n④ Andy and I is friends.\n⑤ They are students.",
            accept_pairs=[("1", "4")],
        )
    )
    for i, ans in enumerate([4, 3, 5], 14):
        items.append(
            mc_item(iid=f"q{i:02d}", sec=secs[7], label=str(i), choices=mc(i), answer_index=ans, prompt_en=f"WB Ch01 test item {i}.")
        )

    write_practice(
        f"{OUT}/wb-c01-test.json",
        build_practice(
            practice_id="cm1:wb-c01:test",
            title="WB Chapter Test",
            subtitle="Chapter 01 be동사 (WB p. 6)",
            pages="6",
            timer_minutes=28,
            unit_id=UNIT,
            unit_title=UNIT_TITLE,
            sections=secs,
            items=items,
            test_id="wb-c01-test",
        ),
    )


def main():
    wb_u1_c()
    wb_u1_d()
    wb_u2_a()
    wb_u2_b()
    wb_u2_c()
    wb_u2_d()
    wb_test()
    print("Ch01 WB practices written.")


if __name__ == "__main__":
    main()
