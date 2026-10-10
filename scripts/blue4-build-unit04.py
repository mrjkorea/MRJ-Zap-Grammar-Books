#!/usr/bin/env python3
"""Build data/blue4/unit04/*.json from ZAP Blue 4 Unit 04 (PDF OCR + page images)."""
import json
import os
import re

OUT = os.path.join(os.path.dirname(__file__), "..", "data", "blue4", "unit04")
META = {
    "bookId": "zap-blue-4",
    "bookTitle": "ZAP Blue 4",
    "appName": "BlueZap 4",
    "unitId": "unit-04",
    "unitTitle": "Unit 04 — 비교 — 비교급",
    "sectionsVersion": 2,
}


def sec_inst(direction, rule):
    return f"{direction} {rule}"


def item_base(section, sec_title, inst, mode, tag, label, **kw):
    return {
        "section": section,
        "sectionTitle": sec_title,
        "sectionInstructionKo": inst,
        "answerMode": mode,
        "answerModeTag": tag,
        "label": label,
        **kw,
    }


def write(name, doc):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return path


def lesson01_walk1():
    d_a = "다음 문장에서 비교급을 찾아 동그라미 하세요."
    r_a = "빈칸에 들어갈 비교급만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "다음 형용사와 부사의 비교급을 빈칸에 쓰세요."
    r_b = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_b = sec_inst(d_b, r_b)
    pairs_a = [
        ("This pencil is short. That pencil is <u>shorter</u>.", "shorter", True),
        ("Elephants live long. Turtles live <u>longer</u>.", "longer", False),
        ("A turtle is slow. A snail is <u>slower</u>.", "slower", False),
        ("He practices the drums hard. I practice them <u>harder</u>.", "harder", False),
        ("Hallasan is high. Baekdusan is <u>higher</u>.", "higher", False),
    ]
    words_b = [
        ("low", "lower", True),
        ("sweet", "sweeter", False),
        ("strong", "stronger", False),
        ("poor", "poorer", False),
        ("high", "higher", False),
        ("cheap", "cheaper", False),
        ("weak", "weaker", False),
        ("cold", "colder", False),
        ("rich", "richer", False),
        ("warm", "warmer", False),
    ]
    items = []
    for i, (pe, acc, ex) in enumerate(pairs_a, 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            accept=[acc],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc)
        items.append(it)
    for i, (base, acc, ex) in enumerate(words_b, 1):
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "words",
            "Words · 빈칸 말만",
            f"B{i}",
            id=f"b{i:02d}",
            type="fill",
            promptEn=f"{base} → ______",
            accept=[acc],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson01-walk1",
        "title": "Lesson 01 Walk 1 — 비교급 (1)",
        "subtitle": "비교급 찾기·만들기 (p. 89)",
        "pages": "89",
        "timerMinutes": 10,
        "introKo": "Section A 5문항(비교급 찾기), Section B 10문항(비교급 만들기)입니다. 책에서는 동그라미·빈칸이지만, 앱에서는 비교급만 씁니다. 회색 예시는 채점하지 않아요.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 4,
                "exampleCount": 1,
                "labels": ["A2", "A3", "A4", "A5"],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 9,
                "exampleCount": 1,
                "labels": ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
            },
        ],
        "items": items,
    }


def lesson01_walk2():
    d = "다음 형용사와 부사의 비교급을 빈칸에 쓰세요."
    r = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst = sec_inst(d, r)
    bases = [
        ("large", "larger", True),
        ("nice", "nicer", False),
        ("wise", "wiser", False),
        ("wide", "wider", False),
        ("cute", "cuter", False),
        ("late", "later", False),
        ("heavy", "heavier", False),
        ("dirty", "dirtier", False),
        ("busy", "busier", False),
        ("pretty", "prettier", False),
        ("happy", "happier", False),
        ("funny", "funnier", False),
        ("easy", "easier", False),
        ("early", "earlier", False),
        ("thin", "thinner", False),
        ("wet", "wetter", False),
        ("sad", "sadder", False),
        ("hot", "hotter", False),
        ("big", "bigger", False),
        ("fat", "fatter", False),
    ]
    items = []
    for i, (b, a, ex) in enumerate(bases, 1):
        it = item_base(
            "A",
            "Section A",
            inst,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=f"{b} → ______",
            accept=[a],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=a)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson01-walk2",
        "title": "Lesson 01 Walk 2 — 비교급 (1)",
        "subtitle": "비교급 만들기 (p. 91)",
        "pages": "91",
        "timerMinutes": 10,
        "introKo": "Section A 20문항(비교급 만들기)입니다. 예시 1문항은 채점하지 않아요.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst,
                "directionKo": d,
                "ruleKo": r,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 19,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 21)],
            }
        ],
        "items": items,
    }


def mc_item(sec, inst, label, iid, prompt, choices, answer, ex=False, prompt_ko=None):
    idx = choices.index(answer) + 1
    circled = ["①", "②", "③", "④"]
    acc = [answer, str(idx)]
    if idx <= 4:
        acc.append(circled[idx - 1])
    it = item_base(
        sec,
        f"Section {sec}",
        inst,
        "choice",
        "Choose · 고르기",
        label,
        id=iid,
        type="mc",
        promptEn=prompt,
        choices=choices,
        accept=acc,
    )
    if prompt_ko:
        it["promptKo"] = prompt_ko
    if ex:
        it.update(example=True, displayOnly=True, exampleAnswer=answer)
    return it


def lesson01_run():
    d_a = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요."
    r_mc = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
    inst_a = sec_inst(d_a, r_mc)
    d_b = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요."
    inst_b = sec_inst(d_b, r_mc)
    a_rows = [
        ("The blouse is warm. The sweater is ( warmer / warmier ).", ["warmer", "warmier"], "warmer", True),
        ("The train is slow. The bike is ( slowier / slower ).", ["slowier", "slower"], "slower", False),
        ("Jenny studies math hard. Ted studies it ( harder / hardder ).", ["harder", "hardder"], "harder", False),
        ("The mug is heavy. The jar is ( heavyer / heavier ).", ["heavyer", "heavier"], "heavier", False),
        ("Canada is big. Russia is ( biger / bigger ).", ["biger", "bigger"], "bigger", False),
        ("This fence is high. That wall is ( higher / highlier ).", ["higher", "highlier"], "higher", False),
        ("My mom is busy. My dad is ( busyer / busier ).", ["busyer", "busier"], "busier", False),
        ("A watermelon is sweet. Chocolate is ( sweeter / sweetter ).", ["sweeter", "sweetter"], "sweeter", False),
        ("Your dog gets up early. My dog gets up ( earlyer / earlier ).", ["earlyer", "earlier"], "earlier", False),
        ("The lake is deep. The sea is ( deeper / deepper ).", ["deeper", "deepper"], "deeper", False),
        ("This shirt is dirty. Those socks are ( dirtyer / dirtier ).", ["dirtyer", "dirtier"], "dirtier", False),
        ("This pig is fat. That pig is ( fater / fatter ).", ["fater", "fatter"], "fatter", False),
        ("My mother is happy. I am ( happier / happyer ).", ["happier", "happyer"], "happier", False),
        ("Sumi gets up late. Her brother gets up ( later / latter ).", ["later", "latter"], "later", False),
        ("The movie is funny. The cartoon is ( funnyer / funnier ).", ["funnyer", "funnier"], "funnier", False),
    ]
    b_rows = [
        ("Jane's hair is short. Adam's hair is ______.", "제인의 머리는 짧다. 아담의 머리는 더 짧다.", ["shortly", "shorter"], "shorter"),
        ("The room is ______. The bathroom is darker.", "그 방은 어둡다. 그 욕실은 더 어둡다.", ["dark", "darke"], "dark"),
        ("The pancake is large. The pizza is ______.", "그 팬케이크는 크다. 그 피자는 더 크다.", ["largeer", "larger"], "larger"),
        ("Minsu is smart. Minho is ______.", "민수는 똑똑하다. 민호는 더 똑똑하다.", ["smatter", "smarter"], "smarter"),
        ("My tea is hot. The kettle is ______.", "내 차는 뜨겁다. 그 주전자는 더 뜨겁다.", ["hoter", "hotter"], "hotter"),
        ("Dad is ______. Superman is stronger.", "아빠는 힘이 세다. 슈퍼맨은 더 힘이 세다.", ["strong", "stongly"], "strong"),
        ("Judy is fat. Sam is ______.", "주디는 뚱뚱하다. 샘은 더 뚱뚱하다.", ["fatter", "fater"], "fatter"),
        ("The cushion is soft. The pillow is ______.", "그 쿠션은 푹신하다. 그 베개는 더 푹신하다.", ["softer", "softier"], "softer"),
        ("A mouse is small. An ant is ______.", "쥐는 작다. 개미는 더 작다.", ["smallier", "smaller"], "smaller"),
        ("You are pretty. That actress is ______.", "너는 예쁘다. 저 여배우는 더 예쁘다.", ["prettier", "prettyer"], "prettier"),
        ("The red cap is cheap. The pink cap is ______.", "그 빨간 모자는 싸다. 그 분홍색 모자는 더 싸다.", ["cheapper", "cheaper"], "cheaper"),
        ("The worm is ______. A snake is longer.", "그 벌레는 길다. 뱀은 더 길다.", ["long", "longe"], "long"),
        ("Math is easy. Science is ______.", "수학은 쉽다. 과학은 더 쉽다.", ["easyier", "easier"], "easier"),
        ("The kite flies ______. An airplane is faster.", "그 연은 빠르게 난다. 비행기는 더 빨리 난다.", ["fastier", "fast"], "fast"),
        ("Dianne is thin. Anne is ______.", "다이앤은 말랐다. 앤은 더 말랐다.", ["thiner", "thinner"], "thinner"),
    ]
    items = []
    for i, row in enumerate(a_rows, 1):
        items.append(mc_item("A", inst_a, f"A{i}", f"a{i:02d}", row[0], row[1], row[2], row[3]))
    for i, (pe, pko, ch, ans) in enumerate(b_rows, 1):
        items.append(mc_item("B", inst_b, f"B{i}", f"b{i:02d}", pe, ch, ans, prompt_ko=pko))
    return {
        **META,
        "practiceId": "b4:u04:lesson01-run",
        "title": "Lesson 01 Run — Grammar Run",
        "subtitle": "비교급 고르기 (pp. 92–93)",
        "pages": "92–93",
        "timerMinutes": 18,
        "introKo": "Section A·B 각 15문항(고르기)입니다. A는 괄호 안에서, B는 빈칸에 알맞은 비교급을 고릅니다.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_mc,
                "answerMode": "choice",
                "answerModeTag": "Choose · 고르기",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_mc,
                "answerMode": "choice",
                "answerModeTag": "Choose · 고르기",
                "itemCount": 15,
                "exampleCount": 0,
                "labels": [f"B{i}" for i in range(1, 16)],
            },
        ],
        "items": items,
    }


def lesson01_jump():
    d_a = "다음 문장에서 밑줄 친 부분의 우리말 뜻을 빈칸에 쓰세요."
    r_a = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "형용사 또는 부사의 비교급을 사용하여 비교급 문장을 완성하세요."
    r_b = "빈칸에 들어갈 비교급만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_b = sec_inst(d_b, r_b)
    ko_a = [
        (["키가 더 크다", "더 크다"], True),
        (["더 높이 뛴다", "더 높게 뛴다"], False),
        (["더 밝다"], False),
        (["더 빨리 난다", "더 빠르게 난다"], False),
        (["더 조용하다"], False),
        (["더 열심히 공부한다", "더 열심히 한다"], False),
        (["더 약하다"], False),
        (["더 오래 달릴 수 있다", "더 멀리 달릴 수 있다"], False),
        (["더 길다"], False),
        (["더 크다"], False),
        (["더 무겁다"], False),
        (["더 싸다"], False),
        (["더 따뜻하다"], False),
        (["더 차갑다"], False),
        (["더 쉽다"], False),
    ]
    prompts_a = [
        "Yunho is tall. Minho <u>is taller</u>.",
        "The frog jumps high. The rabbit <u>jumps higher</u>.",
        "The star is bright. The sun <u>is brighter</u>.",
        "A bee flies fast. An eagle <u>flies faster</u>.",
        "The classroom is quiet. The library <u>is quieter</u>.",
        "Mike studies Korean hard. Emily <u>studies it harder</u>.",
        "The kid is weak. The baby <u>is weaker</u>.",
        "I can run long. He <u>can run longer</u>.",
        "A banana is long. A train <u>is longer</u>.",
        "A soccer ball is big. A basketball <u>is bigger</u>.",
        "The desk is heavy. The bed <u>is heavier</u>.",
        "The blue bike is cheap. The gray bike <u>is cheaper</u>.",
        "Seoul is warm. Busan <u>is warmer</u>.",
        "The water is cold. The ice <u>is colder</u>.",
        "The puzzle is easy. The game <u>is easier</u>.",
    ]
    b_fill = [
        ("I get up early. My mom gets up ______.", "earlier", True, "나는 일찍 일어난다. 우리 엄마는 더 일찍 일어나신다."),
        ("The book is old. The bookshelf is ______.", "older", False, "그 책은 오래되었다. 그 책장은 더 오래되었다."),
        ("Sumin runs fast. Jisu runs ______.", "faster", False, "수민이는 빨리 달린다. 지수는 더 빨리 달린다."),
        ("Michael is strong. His brother is ______.", "stronger", False, "마이클은 힘이 세다. 그의 형은 힘이 더 세다."),
        ("Japan is cold. Russia is ______.", "colder", False, "일본은 춥다. 러시아는 더 춥다."),
        ("Julia is young. Her brother is ______.", "younger", False, "줄리아는 어리다. 그녀의 남동생은 더 어리다."),
        ("My pet is pretty. Your kitten is ______.", "prettier", False, "우리 애완동물은 예쁘다. 너희 새끼 고양이는 더 예쁘다."),
        ("The fox is fat. The wolf is ______.", "fatter", False, "그 여우는 뚱뚱하다. 그 늑대는 더 뚱뚱하다."),
        ("The bedroom is large. The living room is ______.", "larger", False, "그 침실은 크다. 그 거실은 더 크다."),
        ("The dog is smart. The monkey is ______.", "smarter", False, "그 개는 똑똑하다. 그 원숭이는 더 똑똑하다."),
        ("The actor is funny. The comedian is ______.", "funnier", False, "그 남자배우는 웃기다. 그 코미디언은 더 웃기다."),
        ("The coffee is hot. The soup is ______.", "hotter", False, "그 커피는 뜨겁다. 그 수프는 더 뜨겁다."),
        ("Jack is nice. Sean is ______.", "nicer", False, "잭은 착하다. 션은 더 착하다."),
        ("I am busy. My father is ______.", "busier", False, "나는 바쁘다. 우리 아버지는 더 바쁘시다."),
        ("The album is thin. The notebook is ______.", "thinner", False, "그 앨범은 얇다. 그 공책은 더 얇다."),
    ]
    items = []
    for i, (pe, (acc, ex)) in enumerate(zip(prompts_a, ko_a), 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            accept=acc,
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc[0])
        items.append(it)
    for i, (pe, ans, ex, pko) in enumerate(b_fill, 1):
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "words",
            "Words · 빈칸 말만",
            f"B{i}",
            id=f"b{i:02d}",
            type="fill",
            promptEn=pe,
            promptKo=pko,
            accept=[ans],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=ans)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson01-jump",
        "title": "Lesson 01 Jump — Grammar Jump",
        "subtitle": "우리말 뜻·비교급 완성 (pp. 94–95)",
        "pages": "94–95",
        "timerMinutes": 22,
        "introKo": "Section A 15문항(밑줄 우리말), Section B 15문항(비교급만 쓰기)입니다. B 예시 1문항은 채점하지 않아요.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"B{i}" for i in range(2, 16)],
            },
        ],
        "items": items,
    }


def lesson01_fly():
    d_a = "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요."
    r_a = "밑줄 친 부분만 고쳐 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "밑줄 친 단어를 비교급으로 고쳐 문장을 다시 쓰세요."
    r_b = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
    inst_b = sec_inst(d_b, r_b)
    err_a = [
        ("This garden is large. That garden is <u>largeer</u>.", "larger", True),
        ("The kiwi is small. The cherry is <u>smallier</u>.", "smaller", False),
        ("The book is funny. The movie is <u>funnyer</u>.", "funnier", False),
        ("Joe practices taekwondo hard. Matt practices it <u>hardier</u>.", "harder", False),
        ("The subway station is close. The bank is <u>closeer</u>.", "closer", False),
        ("He is wise. His father is <u>wiseer</u>.", "wiser", False),
        ("The watch is cheap. The clock is <u>cheapier</u>.", "cheaper", False),
        ("Tennis is easy. Badminton is <u>easyer</u>.", "easier", False),
        ("The red rope is long. The black rope is <u>longier</u>.", "longer", False),
        ("The tiger is heavy. The elephant is <u>heavyer</u>.", "heavier", False),
        ("You go to school early. I go to school <u>earlyer</u>.", "earlier", False),
        ("The horse is big. The whale is <u>biger</u>.", "bigger", False),
        ("The backpack is light. The wallet is <u>lightier</u>.", "lighter", False),
        ("The girl is strong. Her sister is <u>strongr</u>.", "stronger", False),
        ("The doughnut is sweet. The candy is <u>sweetter</u>.", "sweeter", False),
    ]
    rew_b = [
        ("My little brother is <u>short</u>.", "My little brother is shorter.", True),
        ("The kite flies <u>long</u>.", "The kite flies longer.", False),
        ("The old man is <u>weak</u>.", "The old man is weaker.", False),
        ("The stadium was <u>large</u>.", "The stadium was larger.", False),
        ("Wesley runs <u>fast</u>.", "Wesley runs faster.", False),
        ("His sneakers were <u>dirty</u>.", "His sneakers were dirtier.", False),
        ("The weather is <u>hot</u>.", "The weather is hotter.", False),
        ("The lamp is <u>bright</u>.", "The lamp is brighter.", False),
        ("Tony goes to bed <u>early</u>.", "Tony goes to bed earlier.", False),
        ("My puppy is <u>cute</u>.", "My puppy is cuter.", False),
        ("Her daughter is <u>pretty</u>.", "Her daughter is prettier.", False),
        ("The actress is <u>rich</u>.", "The actress is richer.", False),
        ("My English teacher is <u>happy</u>.", "My English teacher is happier.", False),
        ("The truck is <u>heavy</u>.", "The truck is heavier.", False),
        ("The story is <u>sad</u>.", "The story is sadder.", False),
    ]
    items = []
    for i, (pe, ans, ex) in enumerate(err_a, 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            accept=[ans],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=ans)
        items.append(it)
    for i, (pe, ans, ex) in enumerate(rew_b, 1):
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "sentence",
            "Sentence · 문장 전체",
            f"B{i}",
            id=f"b{i:02d}",
            type="sentence",
            promptEn=pe,
            accept=[ans, ans.rstrip(".")],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=ans)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson01-fly",
        "title": "Lesson 01 Fly — Grammar Fly",
        "subtitle": "오류 고치기·문장 다시 쓰기 (pp. 96–97)",
        "pages": "96–97",
        "timerMinutes": 24,
        "introKo": "Section A 15문항(밑줄만 고치기), Section B 15문항(문장 전체)입니다. 예시는 채점하지 않아요.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "sentence",
                "answerModeTag": "Sentence · 문장 전체",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"B{i}" for i in range(2, 16)],
            },
        ],
        "items": items,
    }


def lesson02_walk1():
    d_a = "다음 문장에서 비교급을 찾아 동그라미 하세요."
    r_a = "빈칸에 들어갈 비교급만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "다음 형용사와 부사의 비교급을 빈칸에 쓰세요."
    r_b = "빈칸에 들어갈 말만 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_b = sec_inst(d_b, r_b)
    a_rows = [
        ("This book is difficult. That book is <u>more difficult</u>.", "more difficult", True),
        ("I walk quickly. My brother walks <u>more quickly</u>.", "more quickly", False),
        ("Jane sings well. Oliver sings <u>better</u>.", "better", False),
        ("The actor is famous. His son is <u>more famous</u>.", "more famous", False),
        ("The photo is interesting. The painting is <u>more interesting</u>.", "more interesting", False),
    ]
    b_words = [
        ("useful", "more useful", True),
        ("interesting", "more interesting", False),
        ("expensive", "more expensive", False),
        ("difficult", "more difficult", False),
        ("famous", "more famous", False),
        ("good", "better", False),
        ("far", "farther", False),
        ("bad", "worse", False),
        ("little", "less", False),
        ("many", "more", False),
    ]
    items = []
    for i, (pe, acc, ex) in enumerate(a_rows, 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            accept=[acc, acc.replace("more ", "more")],
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc)
        items.append(it)
    for i, (b, acc, ex) in enumerate(b_words, 1):
        alts = [acc]
        if acc == "farther":
            alts.append("further")
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "words",
            "Words · 빈칸 말만",
            f"B{i}",
            id=f"b{i:02d}",
            type="fill",
            promptEn=f"{b} → ______",
            accept=alts,
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson02-walk1",
        "title": "Lesson 02 Walk 1 — 비교급 (2)",
        "subtitle": "more·불규칙 비교급 (p. 99)",
        "pages": "99",
        "timerMinutes": 10,
        "introKo": "Section A 5문항(비교급 찾기), Section B 10문항(비교급 만들기)입니다. 예시는 채점하지 않아요.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 4,
                "exampleCount": 1,
                "labels": ["A2", "A3", "A4", "A5"],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 9,
                "exampleCount": 1,
                "labels": ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
            },
        ],
        "items": items,
    }


def lesson02_walk2():
    d_a = "다음 문장에서 형용사나 부사의 비교급을 찾아 밑줄을 치고 than에 동그라미 하세요."
    r_a = "비교급과 than을 순서대로 쓰세요. (한 칸에 한 단어씩, 2칸.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "다음 문장에서 than이 들어갈 위치로 알맞은 곳에 동그라미 하세요."
    r_b = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
    inst_b = sec_inst(d_b, r_b)
    than_a = [
        ("The cat is <u>bigger</u> <u>than</u> the mouse.", "bigger|than", True, 2),
        ("Today is ______ ______ yesterday.", "hotter|than", False, 2),
        ("The game is ______ ______ ______ the concert.", "more|exciting|than", False, 3),
        ("Bees are ______ ______ ants.", "busier|than", False, 2),
        ("The dog swims ______ ______ the bear.", "better|than", False, 2),
    ]
    than_b = [
        ("Nolbu ① is ② richer ③ Heungbu ④.", "3", True),
        ("① George ② sleeps ③ longer ④ Tim.", "4", False),
        ("The red dress ① is ② more ③ beautiful ④ the white dress.", "4", False),
        ("This ① book ② is ③ thicker ④ the dictionary.", "4", False),
        ("Those ① sneakers ② are better ③ these ④ slippers.", "3", False),
    ]
    items = []
    for i, (pe, acc, ex, bl) in enumerate(than_a, 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            blanks=bl,
            accept=[acc],
        )
        if ex:
            parts = acc.split("|")
            it.update(example=True, displayOnly=True, exampleAnswer=" / ".join(parts))
        items.append(it)
    for i, (pe, ans, ex) in enumerate(than_b, 1):
        items.append(
            mc_item(
                "B",
                inst_b,
                f"B{i}",
                f"b{i:02d}",
                pe,
                ["1", "2", "3", "4"],
                ans,
                ex,
            )
        )
    return {
        **META,
        "practiceId": "b4:u04:lesson02-walk2",
        "title": "Lesson 02 Walk 2 — than",
        "subtitle": "비교급 + than (p. 101)",
        "pages": "101",
        "timerMinutes": 10,
        "introKo": "Section A 5문항(비교급·than 쓰기), Section B 5문항(than 위치 고르기)입니다.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 4,
                "exampleCount": 1,
                "labels": ["A2", "A3", "A4", "A5"],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "choice",
                "answerModeTag": "Choose · 고르기",
                "itemCount": 4,
                "exampleCount": 1,
                "labels": ["B2", "B3", "B4", "B5"],
            },
        ],
        "items": items,
    }


def lesson02_run():
    d_a = "다음 문장의 괄호 안에서 알맞은 말을 골라 동그라미 하세요."
    r_mc = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
    inst_a = sec_inst(d_a, r_mc)
    d_b = "다음 문장의 빈칸에 알맞은 말을 골라 동그라미 하세요."
    inst_b = sec_inst(d_b, r_mc)
    a_rows = [
        ("Jane is beautiful. Her mother is ( beautifuler / more beautiful ).", ["beautifuler", "more beautiful"], "more beautiful", True),
        ("Kate eats slowly. Jane eats ( more slowly / slowlier ).", ["more slowly", "slowlier"], "more slowly", False),
        ("This candle is brighter ( to / than ) the star.", ["to", "than"], "than", False),
        ("Japanese is difficult. English is ( difficulter / more difficult ).", ["difficulter", "more difficult"], "more difficult", False),
        ("The computer is expensive. The car is ( expensiver / more expensive ).", ["expensiver", "more expensive"], "more expensive", False),
        ("The painting is famous. The painter is ( more famous / much famous ).", ["more famous", "much famous"], "more famous", False),
        ("I go to bed earlier ( than / from ) my parents.", ["than", "from"], "than", False),
        ("A baseball game is exciting. A soccer game is ( more exciting / excitinger ).", ["more exciting", "excitinger"], "more exciting", False),
        ("Suyoung is diligent. Jaemin is ( more diligent / diligenter ).", ["more diligent", "diligenter"], "more diligent", False),
        ("The song is popular. The singer is ( many popular / more popular ).", ["many popular", "more popular"], "more popular", False),
        ("I am happier ( for / than ) you.", ["for", "than"], "than", False),
        ("A tomato is delicious. A melon is ( deliciouser / more delicious ).", ["deliciouser", "more delicious"], "more delicious", False),
        ("The bag is useful. The backpack is ( more useful / usefuller ).", ["more useful", "usefuller"], "more useful", False),
        ("Grandpa fixes the car easily. Dad fixes the car ( easilerly / more easily ).", ["easilerly", "more easily"], "more easily", False),
        ("Jenny eats quickly. Cindy eats ( quicklier / more quickly ).", ["quicklier", "more quickly"], "more quickly", False),
    ]
    b_rows = [
        ("Chanho plays baseball ______ than Minsu.", ["well", "better"], "better"),
        ("This movie is sadder ______ the book.", ["than", "from"], "than"),
        ("This picture is ______ than that picture.", ["more good", "better"], "better"),
        ("Juice is more delicious ______ coffee.", ["to", "than"], "than"),
        ("I dance ______ than Mike.", ["well", "better"], "better"),
        ("This shirt is ______ than that T-shirt.", ["badder", "worse"], "worse"),
        ("The bridge is older ______ the building.", ["than", "then"], "than"),
        ("He drinks ______ milk than his dad.", ["more", "much"], "more"),
        ("She can jump ______ than Jack.", ["far", "further"], "further"),
        ("Annie looks ______ than Sarah.", ["happier", "happy"], "happier"),
        ("Your sister sleeps ______ than you.", ["little", "less"], "less"),
        ("The bathroom is ______ than the kitchen.", ["darker", "dark"], "darker"),
        ("The park is ______ than your house.", ["far", "farther"], "farther"),
        ("I go to school earlier ______ Sam.", ["than", "much"], "than"),
        ("This glass is ______ than the bowl.", ["weaker", "weak"], "weaker"),
    ]
    items = []
    for i, row in enumerate(a_rows, 1):
        items.append(mc_item("A", inst_a, f"A{i}", f"a{i:02d}", row[0], row[1], row[2], row[3]))
    for i, (pe, ch, ans) in enumerate(b_rows, 1):
        items.append(mc_item("B", inst_b, f"B{i}", f"b{i:02d}", pe, ch, ans))
    # fix b09 accept farther
    for it in items:
        if it["id"] == "b09":
            it["accept"] = ["further", "farther", "2", "②"]
        if it["id"] == "b13":
            it["accept"] = ["farther", "further", "2", "②"]
    return {
        **META,
        "practiceId": "b4:u04:lesson02-run",
        "title": "Lesson 02 Run — Grammar Run",
        "subtitle": "more·than 고르기 (pp. 102–103)",
        "pages": "102–103",
        "timerMinutes": 18,
        "introKo": "Section A·B 각 15문항(고르기)입니다.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_mc,
                "answerMode": "choice",
                "answerModeTag": "Choose · 고르기",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_mc,
                "answerMode": "choice",
                "answerModeTag": "Choose · 고르기",
                "itemCount": 15,
                "exampleCount": 0,
                "labels": [f"B{i}" for i in range(1, 16)],
            },
        ],
        "items": items,
    }


def lesson02_jump():
    d_a = "밑줄 친 단어를 비교급으로 고쳐 문장을 다시 쓰세요."
    r_a = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "주어진 형용사 또는 부사와 비교 대상을 사용하여 비교급 문장을 완성하세요."
    r_b = "빈칸마다 들어갈 말을 한 칸에 한 단어씩 각각 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_b = sec_inst(d_b, r_b)
    rew = [
        ("This question is <u>difficult</u>.", "This question is more difficult.", True),
        ("Emily walks <u>slowly</u>.", "Emily walks more slowly.", False),
        ("The video game is <u>exciting</u>.", "The video game is more exciting.", False),
        ("They have <u>little</u> time.", "They have less time.", False),
        ("He drives a car <u>carefully</u>.", "He drives a car more carefully.", False),
        ("My mother drinks <u>much</u> coffee.", "My mother drinks more coffee.", False),
        ("Time is <u>important</u>.", "Time is more important.", False),
        ("Albert solved the puzzle <u>easily</u>.", "Albert solved the puzzle more easily.", False),
        ("The weather is <u>bad</u> today.", "The weather is worse today.", False),
        ("The boy is <u>handsome</u>.", "The boy is more handsome.", False),
        ("The cat moves <u>quietly</u>.", "The cat moves more quietly.", False),
        ("Phil jumps rope <u>well</u>.", "Phil jumps rope better.", False),
        ("The station is <u>far</u>.", "The station is farther.", False),
        ("My English teacher is <u>famous</u>.", "My English teacher is more famous.", False),
        ("This belt is <u>good</u>.", "This belt is better.", False),
    ]
    comp_b = [
        ("Nick is ______ ______ ______ ______. (diligent, John)", "more|diligent|than|John", 4, True),
        ("The pie is ______ ______ ______ ______. (sweet, the pear)", "sweeter|than|the|pear", 4, False),
        ("Alice can swim ______ ______ ______. (fast, David)", "faster|than|David", 3, False),
        ("You eat ______ meat ______ ______. (much, Peter)", "more|than|Peter", 3, False),
        ("Snakes live ______ ______ ______. (long, rabbits)", "longer|than|rabbits", 3, False),
        ("She is ______ ______ ______. (busy, you)", "busier|than|you", 3, False),
        ("Kelly sings ______ ______ ______. (well, Mina)", "better|than|Mina", 3, False),
        ("She is ______ ______ ______. (famous, I)", "more|famous|than|I", 4, False),
        ("Giraffes are ______ ______ ______. (tall, monkeys)", "taller|than|monkeys", 3, False),
        ("Mom is ______ ______ ______. (old, Dad)", "older|than|Dad", 3, False),
        ("I arrived ______ ______ ______ ______. (late, the boy)", "later|than|the|boy", 4, False),
        ("He is ______ ______ ______. (popular, you)", "more|popular|than|you", 4, False),
        ("Tim goes to bed ______ ______ ______. (early, Jimmy)", "earlier|than|Jimmy", 3, False),
        ("The bank is ______ ______ ______ ______. (far, the gym)", "farther|than|the|gym", 4, False),
        ("Bill's score is ______ ______ ______. (bad, Tony's)", "worse|than|Tony's", 3, False),
    ]
    items = []
    for i, (pe, ans, ex) in enumerate(rew, 1):
        alts = [ans, ans.rstrip(".")]
        if "farther" in ans:
            alts.append(ans.replace("farther", "further"))
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "sentence",
            "Sentence · 문장 전체",
            f"A{i}",
            id=f"a{i:02d}",
            type="sentence",
            promptEn=pe,
            accept=alts,
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=ans)
        items.append(it)
    for i, (pe, acc, bl, ex) in enumerate(comp_b, 1):
        alts = [acc]
        if "farther" in acc:
            alts.append(acc.replace("farther", "further"))
        if "I" in acc.split("|"):
            alts.append(acc.replace("|I", "|me"))
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "words",
            "Words · 빈칸 말만",
            f"B{i}",
            id=f"b{i:02d}",
            type="fill",
            promptEn=pe,
            blanks=bl,
            accept=alts,
        )
        if ex:
            parts = acc.split("|")
            it.update(example=True, displayOnly=True, exampleAnswer=" / ".join(parts))
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson02-jump",
        "title": "Lesson 02 Jump — Grammar Jump",
        "subtitle": "비교급 문장·than 완성 (pp. 104–105)",
        "pages": "104–105",
        "timerMinutes": 22,
        "introKo": "Section A 15문항(문장 전체), Section B 15문항(빈칸 말만·than)입니다.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "sentence",
                "answerModeTag": "Sentence · 문장 전체",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"B{i}" for i in range(2, 16)],
            },
        ],
        "items": items,
    }


def lesson02_fly():
    d_a = "다음 문장의 밑줄 친 부분을 바르게 고쳐 빈칸에 쓰세요."
    r_a = "밑줄 친 부분만 고쳐 쓰세요. (문장 전체를 쓰지 마세요.)"
    inst_a = sec_inst(d_a, r_a)
    d_b = "주어진 말을 바르게 배열하여 문장을 쓰세요."
    r_b = "문장 전체를 쓰세요. (첫 단어부터 마침표까지 완전한 문장으로 쓰세요.)"
    inst_b = sec_inst(d_b, r_b)
    err = [
        ("She drinks <u>mucher</u> milk than her sister.", ["more"], True, 1),
        ("This doll is prettier <u>for</u> that doll.", ["than"], False, 1),
        ("I eat <u>slowlier</u> than my brother.", ["more|slowly"], False, 2),
        ("This is a <u>more good</u> idea.", ["better"], False, 1),
        ("Yuna is <u>famous more</u> than the skater.", ["more|famous"], False, 2),
        ("She sings <u>weller</u>.", ["better"], False, 1),
        ("The pen is <u>expensiver</u> than the notebook.", ["more|expensive"], False, 2),
        ("The puppy is lighter <u>to</u> the dog.", ["than"], False, 1),
        ("The musical is <u>exciting</u> than the concert.", ["more|exciting"], False, 2),
        ("Today is <u>more bad</u> than yesterday.", ["worse"], False, 1),
        ("Worms are <u>slow</u> than turtles.", ["slower"], False, 1),
        ("The cup is <u>more cheap</u> than the glass.", ["cheaper"], False, 1),
        ("The tower is taller <u>from</u> the building.", ["than"], False, 1),
        ("Peaches are <u>delicious</u> than apples.", ["more|delicious"], False, 2),
        ("I practice the piano <u>more hard</u> than the violin.", ["harder"], False, 1),
    ]
    unsc = [
        ("캐나다는 프랑스보다 더 크다.\n( Canada / France / is bigger than / . )", "Canada is bigger than France.", True),
        ("여름은 가을보다 덥다.\n( summer / fall / is hotter than / . )", "Summer is hotter than fall.", False),
        ("비행기는 자동차보다 빠르다.\n( airplanes / cars / are faster than / . )", "Airplanes are faster than cars.", False),
        ("미끄럼틀이 시소보다 신난다.\n( slides / seesaws / are more exciting than / . )", "Slides are more exciting than seesaws.", False),
        ("오늘은 어제보다 춥다.\n( today / yesterday / is colder than / . )", "Today is colder than yesterday.", False),
        ("그 공주가 그 여왕보다 예쁘다.\n( the queen / the princess / is prettier than / . )", "The princess is prettier than the queen.", False),
        ("테드가 닉보다 노래를 잘한다.\n( Ted / Nick / sings better than / . )", "Ted sings better than Nick.", False),
        ("이 책이 저 일기장보다 두껍다.\n( This book / that diary / is thicker than / . )", "This book is thicker than that diary.", False),
        ("수빈이는 소라보다 부지런하다.\n( Subin / Sora / is more diligent than / . )", "Subin is more diligent than Sora.", False),
        ("그 역은 은행보다 멀다.\n( the bank / the station / is farther than / . )", "The station is farther than the bank.", False),
    ]
    items = []
    for i, (pe, acc, ex, bl) in enumerate(err, 1):
        it = item_base(
            "A",
            "Section A",
            inst_a,
            "words",
            "Words · 빈칸 말만",
            f"A{i}",
            id=f"a{i:02d}",
            type="fill",
            promptEn=pe,
            blanks=bl,
            accept=acc,
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=acc[0].replace("|", " / "))
        items.append(it)
    for i, (pe, ans, ex) in enumerate(unsc, 1):
        alts = [ans, ans.rstrip(".")]
        if "farther" in ans:
            alts.append(ans.replace("farther", "further"))
        it = item_base(
            "B",
            "Section B",
            inst_b,
            "sentence",
            "Sentence · 문장 전체",
            f"B{i}",
            id=f"b{i:02d}",
            type="sentence",
            promptEn=pe,
            promptKo=pe.split("\n")[0],
            accept=alts,
        )
        if ex:
            it.update(example=True, displayOnly=True, exampleAnswer=ans)
        items.append(it)
    return {
        **META,
        "practiceId": "b4:u04:lesson02-fly",
        "title": "Lesson 02 Fly — Grammar Fly",
        "subtitle": "오류 고치기·배열 (pp. 106–107)",
        "pages": "106–107",
        "timerMinutes": 24,
        "introKo": "Section A 15문항(밑줄만 고치기), Section B 10문항(문장 배열)입니다.",
        "sections": [
            {
                "id": "A",
                "title": "Section A",
                "instructionKo": inst_a,
                "directionKo": d_a,
                "ruleKo": r_a,
                "answerMode": "words",
                "answerModeTag": "Words · 빈칸 말만",
                "itemCount": 14,
                "exampleCount": 1,
                "labels": [f"A{i}" for i in range(2, 16)],
            },
            {
                "id": "B",
                "title": "Section B",
                "instructionKo": inst_b,
                "directionKo": d_b,
                "ruleKo": r_b,
                "answerMode": "sentence",
                "answerModeTag": "Sentence · 문장 전체",
                "itemCount": 9,
                "exampleCount": 1,
                "labels": ["B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"],
            },
        ],
        "items": items,
    }


def review_04():
    r_mc = "보기 중에서 알맞은 것을 하나 골라 누르세요. (직접 쓰지 않아요.)"
    sections = [
        ("1-2", "[1–2]", "다음 형용사나 부사의 비교급이 잘못 짝지어진 것을 고르세요.", 2, 0, ["1", "2"]),
        ("3-4", "[3–4]", "다음 중 잘못된 문장을 고르세요.", 2, 0, ["3", "4"]),
        ("5", "[5]", "다음 문장의 빈칸에 알맞은 말이 순서대로 바르게 짝지어진 것을 고르세요.", 1, 0, ["5"]),
        ("6-7", "[6–7]", "다음 우리말을 주어진 단어를 사용하여 영어로 바르게 옮긴 것을 고르세요.", 2, 0, ["6", "7"]),
        ("8", "[8]", "다음 빈칸에 공통으로 들어갈 말을 고르세요.", 1, 0, ["8"]),
        ("9-10", "[9–10]", "다음 중 올바른 문장을 고르세요.", 2, 0, ["9", "10"]),
        ("11-12", "[11–12]", "다음 우리말 뜻과 같도록 괄호 안에서 알맞은 말을 고르세요.", 2, 0, ["11", "12"]),
        ("13-14", "[13–14]", "다음 문장의 빈칸에 공통으로 들어갈 말을 쓰세요.", 2, 0, ["13", "14"]),
        ("15-16", "[15–16]", "주어진 단어의 비교급을 사용하여 문장을 완성하세요.", 2, 0, ["15", "16"]),
        ("17-18", "[17–18]", "주어진 말을 순서대로 배열하여 문장을 쓰세요.", 2, 0, ["17", "18"]),
        ("19-20", "[19–20]", "다음 문장의 밑줄 친 부분을 바르게 고쳐서 문장을 다시 쓰세요.", 2, 0, ["19", "20"]),
    ]
    sec_objs = []
    for sid, title, direction, icount, ecount, labels in sections:
        mode = "choice" if sid in {"1-2", "3-4", "5", "6-7", "8", "9-10", "11-12"} else "words"
        if sid in {"17-18", "19-20"}:
            mode = "sentence"
        tag = (
            "Choose · 고르기"
            if mode == "choice"
            else ("Sentence · 문장 전체" if mode == "sentence" else "Words · 빈칸 말만")
        )
        rule = r_mc if mode == "choice" else (
            "문장 전체를 쓰세요." if mode == "sentence" else "빈칸에 들어갈 말만 쓰세요."
        )
        inst = sec_inst(f"{title} {direction}", rule)
        sec_objs.append(
            {
                "id": sid,
                "title": title,
                "instructionKo": inst,
                "directionKo": f"{title} {direction}",
                "ruleKo": rule,
                "answerMode": mode if mode != "choice" else "choice",
                "answerModeTag": tag,
                "itemCount": icount,
                "exampleCount": ecount,
                "labels": labels,
            }
        )

    def inst_for(sid):
        s = next(x for x in sec_objs if x["id"] == sid)
        return s["instructionKo"]

    items = []
    # 1
    items.append(
        {
            **item_base("1-2", "Section 1-2", inst_for("1-2"), "choice", "Choose · 고르기", "1", id="q01", type="mc", promptEn=""),
            "choices": ["hot – hotter", "large – larger", "funny – funnyer", "hard – harder"],
            "accept": ["funny – funnyer", "3"],
        }
    )
    items.append(
        {
            **item_base("1-2", "Section 1-2", inst_for("1-2"), "choice", "Choose · 고르기", "2", id="q02", type="mc", promptEn=""),
            "choices": ["famous – famouser", "easily – more easily", "early – earlier", "interesting – more interesting"],
            "accept": ["famous – famouser", "1"],
        }
    )
    # 3-4
    items.append(
        {
            **item_base("3-4", "Section 3-4", inst_for("3-4"), "choice", "Choose · 고르기", "3", id="q03", type="mc", promptEn=""),
            "choices": [
                "Tony is taller than Bill.",
                "She is a diligenter student.",
                "They need more time.",
                "We live more happily.",
            ],
            "accept": ["She is a diligenter student.", "2"],
        }
    )
    items.append(
        {
            **item_base("3-4", "Section 3-4", inst_for("3-4"), "choice", "Choose · 고르기", "4", id="q04", type="mc", promptEn=""),
            "choices": [
                "I am happier than you.",
                "The park is farther than the bank.",
                "China is larger than Japan.",
                "Math is more difficult from English.",
            ],
            "accept": ["Math is more difficult from English.", "4"],
        }
    )
    # 5
    items.append(
        {
            **item_base("5", "Section 5", inst_for("5"), "choice", "Choose · 고르기", "5", id="q05", type="mc", promptEn="They are ______ than us.\nThe cherries are ______ expensive than oranges."),
            "choices": ["busy – more", "busier – more", "busy – better", "busier – better"],
            "accept": ["busier – more", "2"],
        }
    )
    # 6-7
    items.append(
        {
            **item_base("6-7", "Section 6-7", inst_for("6-7"), "choice", "Choose · 고르기", "6", id="q06", type="mc", promptEn="그 남자아이는 수영을 더 잘한다. ( well )"),
            "choices": [
                "The boy swims weller.",
                "The boy swims more.",
                "The boy swims better.",
                "The boy swims more well.",
            ],
            "accept": ["The boy swims better.", "3"],
        }
    )
    items.append(
        {
            **item_base("6-7", "Section 6-7", inst_for("6-7"), "choice", "Choose · 고르기", "7", id="q07", type="mc", promptEn="샘은 존보다 키가 크다. ( tall )"),
            "choices": [
                "Sam is taller than John.",
                "John is taller than Sam.",
                "Sam is more tall than John.",
                "Sam is taller from John.",
            ],
            "accept": ["Sam is taller than John.", "1"],
        }
    )
    # 8
    items.append(
        {
            **item_base("8", "Section 8", inst_for("8"), "choice", "Choose · 고르기", "8", id="q08", type="mc", promptEn="I eat much meat. He eats ______ meat.\nKevin walks ______ quickly than Johnny."),
            "choices": ["many", "more", "little", "less"],
            "accept": ["more", "2"],
        }
    )
    # 9-10
    items.append(
        {
            **item_base("9-10", "Section 9-10", inst_for("9-10"), "choice", "Choose · 고르기", "9", id="q09", type="mc", promptEn=""),
            "choices": [
                "A cheetah runs fast than a deer.",
                "Minho jumps high than Jun.",
                "Joe studies more harder than Danny.",
                "Julia is younger than Mary.",
            ],
            "accept": ["Julia is younger than Mary.", "4"],
        }
    )
    items.append(
        {
            **item_base("9-10", "Section 9-10", inst_for("9-10"), "choice", "Choose · 고르기", "10", id="q10", type="mc", promptEn=""),
            "choices": [
                "Amy gets up later than Luke.",
                "This bed is softer to that bed.",
                "He sings more well than Ted.",
                "This bag is heavyer than that bag.",
            ],
            "accept": ["Amy gets up later than Luke.", "1"],
        }
    )
    # 11-12
    items.append(
        {
            **item_base("11-12", "Section 11-12", inst_for("11-12"), "choice", "Choose · 고르기", "11", id="q11", type="mc", promptEn="오늘은 어제보다 덥다.\nToday is ( hoter / hotter ) than yesterday."),
            "choices": ["hoter", "hotter"],
            "accept": ["hotter", "2"],
        }
    )
    items.append(
        {
            **item_base("11-12", "Section 11-12", inst_for("11-12"), "choice", "Choose · 고르기", "12", id="q12", type="mc", promptEn="폴은 배를 지미보다 쉽게 만든다.\nPaul makes a boat ( easilier / more easily ) than Jimmy."),
            "choices": ["easilier", "more easily"],
            "accept": ["more easily", "2"],
        }
    )
    # 13-14
    items.append(
        {
            **item_base("13-14", "Section 13-14", inst_for("13-14"), "words", "Words · 빈칸 말만", "13", id="q13", type="fill", promptEn="He needs ______ sugar.\nThe book is ______ exciting than the movie."),
            "accept": ["more"],
        }
    )
    items.append(
        {
            **item_base("13-14", "Section 13-14", inst_for("13-14"), "words", "Words · 빈칸 말만", "14", id="q14", type="fill", promptEn="Sue lives farther ______ Emily.\nThe sun is bigger ______ the moon."),
            "accept": ["than"],
        }
    )
    # 15-16
    items.append(
        {
            **item_base("15-16", "Section 15-16", inst_for("15-16"), "words", "Words · 빈칸 말만", "15", id="q15", type="fill", promptEn="이 기차는 저 기차보다 천천히 달린다.\nThis train runs ______ ______ that train. (slowly)", blanks=2, accept=["more|slowly", "more slowly|than"], promptKo="이 기차는 저 기차보다 천천히 달린다."),
        }
    )
    items.append(
        {
            **item_base("15-16", "Section 15-16", inst_for("15-16"), "words", "Words · 빈칸 말만", "16", id="q16", type="fill", promptEn="데이비드는 로이보다 축구를 잘한다.\nDavid plays soccer ______ ______ Roy. (well)", blanks=2, accept=["better|than"], promptKo="데이비드는 로이보다 축구를 잘한다."),
        }
    )
    # 17-18
    items.append(
        {
            **item_base("17-18", "Section 17-18", inst_for("17-18"), "sentence", "Sentence · 문장 전체", "17", id="q17", type="sentence", promptEn="ice / colder / water / is / than / .\n얼음이 물보다 차갑다.", accept=["Ice is colder than water.", "Ice is colder than water"], promptKo="얼음이 물보다 차갑다."),
        }
    )
    items.append(
        {
            **item_base("17-18", "Section 17-18", inst_for("17-18"), "sentence", "Sentence · 문장 전체", "18", id="q18", type="sentence", promptEn="your mom / is / beautiful / more / than / you / .\n너희 엄마는 너보다 아름다우시다.", accept=["Your mom is more beautiful than you.", "Your mom is more beautiful than you"], promptKo="너희 엄마는 너보다 아름다우시다."),
        }
    )
    # 19-20
    items.append(
        {
            **item_base("19-20", "Section 19-20", inst_for("19-20"), "sentence", "Sentence · 문장 전체", "19", id="q19", type="sentence", promptEn="My mom gets up <u>more early</u> than I.", accept=["My mom gets up earlier than I.", "My mom gets up earlier than me."], promptKo="우리 엄마는 나보다 더 일찍 일어난다."),
        }
    )
    items.append(
        {
            **item_base("19-20", "Section 19-20", inst_for("19-20"), "sentence", "Sentence · 문장 전체", "20", id="q20", type="sentence", promptEn="The boy is <u>thiner</u> than the man.", accept=["The boy is thinner than the man.", "The boy is thinner than the man"], promptKo="그 남자아이는 그 남자보다 더 말랐다."),
        }
    )
    return {
        **META,
        "practiceId": "b4:u04:review04",
        "title": "Review 04",
        "subtitle": "Unit 04 비교 — 비교급 (pp. 108–110)",
        "pages": "108–110",
        "timerMinutes": 30,
        "introKo": "Review 04는 [1–2]부터 [19–20]까지 20문항입니다. Check Check 점수표는 채점하지 않아요.",
        "sections": sec_objs,
        "items": items,
    }


FLY_B_KO = {
    "The kite flies <u>long</u>.": "연은 더 오래 난다.",
    "The old man is <u>weak</u>.": "그 노인은 더 약하다.",
    "The stadium was <u>large</u>.": "그 경기장은 더 컸다.",
    "Wesley runs <u>fast</u>.": "웨슬리는 더 빨리 달린다.",
    "His sneakers were <u>dirty</u>.": "그의 운동화는 더 더러웠다.",
    "The weather is <u>hot</u>.": "날씨가 더 덥다.",
    "The lamp is <u>bright</u>.": "그 램프는 더 밝다.",
    "Tony goes to bed <u>early</u>.": "토니는 더 일찍 잔다.",
    "My puppy is <u>cute</u>.": "우리 강아지는 더 귀엽다.",
    "Her daughter is <u>pretty</u>.": "그녀의 딸은 더 예쁘다.",
    "The actress is <u>rich</u>.": "그 여배우는 더 부유하다.",
    "My English teacher is <u>happy</u>.": "우리 영어 선생님은 더 행복하다.",
    "The truck is <u>heavy</u>.": "그 트럭은 더 무겁다.",
    "The story is <u>sad</u>.": "그 이야기는 더 슬프다.",
}

JUMP_A_KO = {
    "The frog jumps high. The rabbit <u>jumps higher</u>.": "더 높이 뛴다.",
    "The star is bright. The sun <u>is brighter</u>.": "더 밝다.",
    "A bee flies fast. An eagle <u>flies faster</u>.": "더 빨리 난다.",
    "The classroom is quiet. The library <u>is quieter</u>.": "더 조용하다.",
    "Mike studies Korean hard. Emily <u>studies it harder</u>.": "더 열심히 공부한다.",
    "The kid is weak. The baby <u>is weaker</u>.": "더 약하다.",
    "I can run long. He <u>can run longer</u>.": "더 오래 달릴 수 있다.",
    "A banana is long. A train <u>is longer</u>.": "더 길다.",
    "A soccer ball is big. A basketball <u>is bigger</u>.": "더 크다.",
    "The desk is heavy. The bed <u>is heavier</u>.": "더 무겁다.",
    "The blue bike is cheap. The gray bike <u>is cheaper</u>.": "더 싸다.",
    "Seoul is warm. Busan <u>is warmer</u>.": "더 따뜻하다.",
    "The water is cold. The ice <u>is colder</u>.": "더 차갑다.",
    "The puzzle is easy. The game <u>is easier</u>.": "더 쉽다.",
}

WALK_A_KO = {
    "Elephants live long. Turtles live <u>longer</u>.": "거북이는 더 오래 산다.",
    "A turtle is slow. A snail is <u>slower</u>.": "달팽이는 더 느리다.",
    "He practices the drums hard. I practice them <u>harder</u>.": "나는 더 열심히 연습한다.",
    "Hallasan is high. Baekdusan is <u>higher</u>.": "백두산은 더 높다.",
    "I walk quickly. My brother walks <u>more quickly</u>.": "오빠는 더 빨리 걷는다.",
    "Jane sings well. Oliver sings <u>better</u>.": "올리버는 더 잘 부른다.",
    "The actor is famous. His son is <u>more famous</u>.": "그의 아들은 더 유명하다.",
    "The photo is interesting. The painting is <u>more interesting</u>.": "그 그림은 더 흥미롭다.",
}


def enrich_prompt_ko(doc):
    for it in doc["items"]:
        if it.get("displayOnly") or it.get("promptKo"):
            continue
        pe = it.get("promptEn") or ""
        if not re.search(r"[A-Za-z]", pe):
            continue
        if pe in FLY_B_KO:
            it["promptKo"] = FLY_B_KO[pe]
        elif pe in JUMP_A_KO:
            it["promptKo"] = JUMP_A_KO[pe]
        elif pe in WALK_A_KO:
            it["promptKo"] = WALK_A_KO[pe]
        elif "→" in pe:
            it["promptKo"] = "비교급을 쓰세요."
        elif it.get("type") == "fill" and "<u>" in pe and "고쳐" in it.get("sectionInstructionKo", ""):
            it["promptKo"] = "밑줄 친 부분만 바르게 고쳐 쓰세요."
        elif it.get("type") == "sentence" and "<u>" in pe:
            it["promptKo"] = "밑줄 친 단어를 비교급으로 바꿔 문장 전체를 쓰세요."
        elif it.get("type") == "mc" and not pe.strip():
            continue
        elif it.get("type") == "mc":
            it["promptKo"] = "알맞은 보기를 고르세요."
        elif "______" in pe and re.search(r"[가-힣]", pe):
            continue
        elif "______" in pe:
            it["promptKo"] = "빈칸에 알맞은 말을 쓰세요."


def main():
    os.makedirs(OUT, exist_ok=True)
    files = [
        ("lesson01-walk1.json", lesson01_walk1()),
        ("lesson01-walk2.json", lesson01_walk2()),
        ("lesson01-run.json", lesson01_run()),
        ("lesson01-jump.json", lesson01_jump()),
        ("lesson01-fly.json", lesson01_fly()),
        ("lesson02-walk1.json", lesson02_walk1()),
        ("lesson02-walk2.json", lesson02_walk2()),
        ("lesson02-run.json", lesson02_run()),
        ("lesson02-jump.json", lesson02_jump()),
        ("lesson02-fly.json", lesson02_fly()),
        ("review-04.json", review_04()),
    ]
    for name, doc in files:
        enrich_prompt_ko(doc)
        write(name, doc)
        graded = sum(1 for it in doc["items"] if not it.get("displayOnly"))
        print(name, "graded", graded)


if __name__ == "__main__":
    main()
