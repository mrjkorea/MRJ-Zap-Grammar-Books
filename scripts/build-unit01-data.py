#!/usr/bin/env python3
"""Generate GreenZap 1 Unit 01 practice JSON (student app)."""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "data", "green1", "unit01")
os.makedirs(OUT, exist_ok=True)


def write(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    print("wrote", path)


walk1 = {
    "practiceId": "u01:walk1",
    "title": "Grammar Walk — Lesson 01",
    "subtitle": "Affirmative present (pp. 10–11)",
    "pages": "10–11",
    "timerMinutes": 12,
    "items": [
        {"id": "q01", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "I ( am / is ) thirsty.", "choices": ["am", "is"], "accept": ["am"]},
        {"id": "q02", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "He ( am / is ) a police officer.", "choices": ["am", "is"], "accept": ["is"]},
        {"id": "q03", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "She ( am / is ) tired.", "choices": ["am", "is"], "accept": ["is"]},
        {"id": "q04", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "They ( is / are ) my classmates.", "choices": ["is", "are"], "accept": ["are"]},
        {"id": "q05", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "My parents ( is / are ) in the living room.", "choices": ["is", "are"], "accept": ["are"]},
        {"id": "q06", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "This bird ( is / are ) very cute.", "choices": ["is", "are"], "accept": ["is"]},
        {"id": "q07", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "We ( is / are ) at home today.", "choices": ["is", "are"], "accept": ["are"]},
        {"id": "q08", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "I ( like / likes ) bananas.", "choices": ["like", "likes"], "accept": ["like"]},
        {"id": "q09", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "Hana ( help / helps ) her mother every day.", "choices": ["help", "helps"], "accept": ["helps"]},
        {"id": "q10", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "I ( feed / feeds ) my cat in the evening.", "choices": ["feed", "feeds"], "accept": ["feed"]},
        {"id": "q11", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "She ( brush / brushes ) her teeth after dinner.", "choices": ["brush", "brushes"], "accept": ["brushes"]},
        {"id": "q12", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "He ( fly / flies ) a model airplane on Sunday.", "choices": ["fly", "flies"], "accept": ["flies"]},
        {"id": "q13", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "My brother ( exercise / exercises ) every morning.", "choices": ["exercise", "exercises"], "accept": ["exercises"]},
        {"id": "q14", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "We ( have / has ) a big tent.", "choices": ["have", "has"], "accept": ["have"]},
        {"id": "q15", "type": "mc", "promptKo": "괄호 안에서 알맞은 말을 고르세요.", "promptEn": "Tony ( have / has ) a nice skateboard.", "choices": ["have", "has"], "accept": ["has"]},
    ],
}

walk2 = {
    "practiceId": "u01:walk2",
    "title": "Grammar Walk — Lesson 02",
    "subtitle": "Negatives & questions (pp. 12–13)",
    "pages": "12–13",
    "timerMinutes": 14,
    "items": [
        {"id": "q01", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "You ________ a bad student.", "choices": ["isn't", "aren't"], "accept": ["aren't"]},
        {"id": "q02", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "I ________ sick now.", "choices": ["am not", "don't"], "accept": ["am not"]},
        {"id": "q03", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "She ________ in the library.", "choices": ["isn't", "aren't"], "accept": ["isn't"]},
        {"id": "q04", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "They ________ like action movies.", "choices": ["don't", "doesn't"], "accept": ["don't"]},
        {"id": "q05", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "My sister ________ eat pineapple.", "choices": ["don't", "doesn't"], "accept": ["doesn't"]},
        {"id": "q06", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "________ you in the bathroom?", "choices": ["Are", "Is"], "accept": ["Are"]},
        {"id": "q07", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "________ your brother busy now?", "choices": ["Are", "Is"], "accept": ["Is"]},
        {"id": "q08", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "________ you walk to school every day?", "choices": ["Do", "Does"], "accept": ["Do"]},
        {"id": "q09", "type": "mc", "promptKo": "빈칸에 알맞은 말을 고르세요.", "promptEn": "________ he watch TV after dinner?", "choices": ["Do", "Does"], "accept": ["Does"]},
        {"id": "q10", "type": "mc", "promptKo": "의문문에 알맞은 대답을 고르세요.", "promptEn": "Are you tired?", "choices": ["a. Yes, she is.", "b. No, he doesn't.", "c. No, I'm not.", "d. Yes, they do."], "accept": ["c", "c. No, I'm not.", "No, I'm not."]},
        {"id": "q11", "type": "mc", "promptKo": "의문문에 알맞은 대답을 고르세요.", "promptEn": "Is she a good swimmer?", "choices": ["a. Yes, she is.", "b. No, he doesn't.", "c. No, I'm not.", "d. Yes, they do."], "accept": ["a", "a. Yes, she is.", "Yes, she is."]},
        {"id": "q12", "type": "mc", "promptKo": "의문문에 알맞은 대답을 고르세요.", "promptEn": "Do they take a walk every morning?", "choices": ["a. Yes, she is.", "b. No, he doesn't.", "c. No, I'm not.", "d. Yes, they do."], "accept": ["d", "d. Yes, they do.", "Yes, they do."]},
        {"id": "q13", "type": "mc", "promptKo": "의문문에 알맞은 대답을 고르세요.", "promptEn": "Does he have brown hair?", "choices": ["a. Yes, she is.", "b. No, he doesn't.", "c. No, I'm not.", "d. Yes, they do."], "accept": ["b", "b. No, he doesn't.", "No, he doesn't."]},
    ],
}

run_items_a = [
    ("q01", "Kate and I ________ at the fire station. (be)", ["are"]),
    ("q02", "She ________ my classmate. (be)", ["is"]),
    ("q03", "I ________ busy today. (be)", ["am"]),
    ("q04", "My father ________ strong. (be)", ["is"]),
    ("q05", "There ________ two squirrels in the tree. (be)", ["are"]),
    ("q06", "My grandmother ________ up early in the morning. (get)", ["gets"]),
    ("q07", "I ________ comedies. (like)", ["like"]),
    ("q08", "Bora ________ new sneakers. (have)", ["has"]),
    ("q09", "Namsu ________ English every day. (study)", ["studies"]),
    ("q10", "They ________ badminton on weekends. (play)", ["play"]),
    ("q11", "We ________ lunch at 12 o'clock. (have)", ["have"]),
    ("q12", "She ________ in the evening. (exercise)", ["exercises"]),
    ("q13", "The model airplane ________ very fast in the sky. (fly)", ["flies"]),
    ("q14", "He ________ his dog in the afternoon. (feed)", ["feeds"]),
    ("q15", "My sister ________ her homework after school. (do)", ["does"]),
]
run_items_b = [
    ("q16", "It's raining today, but it ________ sunny.", ["isn't", "is not"]),
    ("q17", "They like soccer, but they ________ like baseball.", ["don't", "do not"]),
    ("q18", "He ________ sad now. He is very happy.", ["isn't", "is not"]),
    ("q19", "My father drinks coffee, but he ________ drink milk.", ["doesn't", "does not"]),
    ("q20", "We have two dogs, but we ________ have a cat.", ["don't", "do not"]),
    ("q21", "Her grandmother eats yogurt, but she ________ eat ice cream.", ["doesn't", "does not"]),
    ("q22", "________ you thirsty? / No, I'm not.", ["Are"]),
    ("q23", "________ your sister in the second grade? / Yes, she is.", ["Is"]),
    ("q24", "Are these your gloves? / No, they ________.", ["aren't", "are not"]),
    ("q25", "Is he from Canada? / No, he ________.", ["isn't", "is not"]),
    ("q26", "________ she walk to school every day? / Yes, she does.", ["Does"]),
    ("q27", "________ your parents take a walk every morning? / No, they don't.", ["Do"]),
    ("q28", "Do you need an alarm clock? / Yes, I ________.", ["do"]),
    ("q29", "Does your uncle live in Seoul? / No, he ________.", ["doesn't", "does not"]),
]

run = {
    "practiceId": "u01:run",
    "title": "Grammar Run",
    "subtitle": "Present tense practice (pp. 14–15)",
    "pages": "14–15",
    "timerMinutes": 20,
    "items": [
        {"id": i[0], "type": "fill", "promptKo": "주어진 말을 사용하여 문장을 완성하세요.", "promptEn": i[1], "blanks": 1, "accept": i[2]}
        for i in run_items_a
    ] + [
        {"id": i[0], "type": "fill", "promptKo": "빈칸에 알맞은 말을 쓰세요.", "promptEn": i[1], "blanks": 1, "accept": i[2]}
        for i in run_items_b
    ],
}

jump_a = [
    ("q01", "I am a police officer. (she)\nShe ________ a police officer.", ["is"]),
    ("q02", "He is hungry now. (I)\nI ________ hungry now.", ["am"]),
    ("q03", "This is my pen. (these)\nThese ________ my pens.", ["are"]),
    ("q04", "That book isn't interesting. (those books)\nThose books ________ interesting.", ["aren't", "are not"]),
    ("q05", "They aren't delicious apples. (it)\nIt ________ a delicious apple.", ["isn't", "is not", "it's not"]),
    ("q06", "He isn't sad today. (Kevin and I)\nKevin and I ________ sad today.", ["aren't", "are not"]),
    ("q07", "I like horror movies. (he)\nHe ________ horror movies.", ["likes"]),
    ("q08", "Rabbits have long ears. (a rabbit)\nA rabbit ________ long ears.", ["has"]),
    ("q09", "The boy wants ice cream for dessert. (we)\nWe ________ ice cream for dessert.", ["want"]),
    ("q10", "They don't watch TV at night. (he)\nHe ________ watch TV at night.", ["doesn't", "does not"]),
    ("q11", "Ann doesn't take piano lessons. (we)\nWe ________ take piano lessons.", ["don't", "do not"]),
    ("q12", "Mike doesn't go to the library on Sunday. (they)\nThey ________ go to the library on Sunday.", ["don't", "do not"]),
]

jump_b = [
    ("q13", "A: Is your dog fast?\nB: Yes, ________.", ["it is", "it's"]),
    ("q14", "A: Are they from the U.S.?\nB: No, ________. They are from Canada.", ["they aren't", "they are not", "they're not"]),
    ("q15", "A: ________ there a book in the bag?\nB: No, there ________.", ["is|isn't", "is|is not"]),
    ("q16", "A: ________ you in the sixth grade?\nB: Yes, I ________.", ["Are|am"]),
    ("q17", "A: Do you have a bike?\nB: No, ________.", ["I don't", "I do not"]),
    ("q18", "A: Does Jason usually go to bed at 10?\nB: Yes, ________.", ["he does"]),
    ("q19", "A: Do you need a new printer?\nB: No, ________.", ["I don't", "I do not", "we don't", "we do not"]),
    ("q20", "A: Do they jump rope every morning?\nB: Yes, ________.", ["they do"]),
    ("q21", "A: ________ Mary often visit her grandparents?\nB: Yes, she ________.", ["Does|does"]),
    ("q22", "A: ________ your parents like flowers?\nB: Yes, they ________.", ["Do|do"]),
    ("q23", "A: ________ they play computer games every day?\nB: No, they ________.", ["Do|don't", "Do|do not"]),
    ("q24", "A: ________ the girl have long hair?\nB: No, she ________. She has short hair.", ["Does|doesn't", "Does|does not"]),
]

jump = {
    "practiceId": "u01:jump",
    "title": "Grammar Jump",
    "subtitle": "Transform & dialogue (pp. 16–17)",
    "pages": "16–17",
    "timerMinutes": 22,
    "items": [
        {"id": i[0], "type": "fill", "promptKo": "밑줄 친 말을 주어진 말로 바꿔 빈칸을 채우세요.", "promptEn": i[1], "blanks": 1 if "|" not in i[2][0] else 2, "accept": i[2]}
        for i in jump_a
    ] + [
        {"id": i[0], "type": "fill", "promptKo": "대화의 빈칸에 알맞은 말을 쓰세요.", "promptEn": i[1], "blanks": 2 if "|" in i[2][0] else 1, "accept": i[2]}
        for i in jump_b
    ],
}

fly_a = [
    ("q01", "This is a new computer. (negative)", ["This isn't a new computer.", "This is not a new computer.", "This isn't a new computer", "This is not a new computer"]),
    ("q02", "We are in the yard. (negative)", ["We aren't in the yard.", "We are not in the yard.", "We're not in the yard.", "We aren't in the yard", "We are not in the yard", "We're not in the yard"]),
    ("q03", "I am in the fifth grade. (negative)", ["I'm not in the fifth grade.", "I am not in the fifth grade.", "I'm not in the fifth grade", "I am not in the fifth grade"]),
    ("q04", "My father works in a bank. (negative)", ["My father doesn't work in a bank.", "My father does not work in a bank."]),
    ("q05", "Nina and her brother drink milk. (negative)", ["Nina and her brother don't drink milk.", "Nina and her brother do not drink milk."]),
    ("q06", "Paul's family goes to the park on Sundays. (negative)", ["Paul's family doesn't go to the park on Sundays.", "Paul's family does not go to the park on Sundays."]),
    ("q07", "Your uncle is strong. (question)", ["Is your uncle strong?", "Is your uncle strong"]),
    ("q08", "There are a lot of ducks in the pond. (question)", ["Are there a lot of ducks in the pond?", "Are there a lot of ducks in the pond"]),
    ("q09", "They live near the river. (question)", ["Do they live near the river?", "Do they live near the river"]),
    ("q10", "She walks her dog in the afternoon. (question)", ["Does she walk her dog in the afternoon?", "Does she walk her dog in the afternoon"]),
    ("q11", "You play the piano after school. (question)", ["Do you play the piano after school?", "Do you play the piano after school"]),
    ("q12", "Jake has new in-line skates. (question)", ["Does Jake have new in-line skates?", "Does Jake have new in-line skates"]),
]

fly_b = [
    ("q13", "I / a good swimmer / am / . (나는 수영을 잘한다.)", ["I am a good swimmer.", "I'm a good swimmer."]),
    ("q14", "this cake / very delicious / is / . (이 케이크는 무척 맛있다.)", ["This cake is very delicious."]),
    ("q15", "we / every morning / jump rope / . (우리는 아침마다 줄넘기를 한다.)", ["We jump rope every morning."]),
    ("q16", "he / his parents / helps / on weekends / . (그는 주말마다 부모님을 돕는다.)", ["He helps his parents on weekends."]),
    ("q17", "my mother / at home now / isn't / . (우리 어머니는 지금 집에 계시지 않는다.)", ["My mother isn't at home now.", "My mother is not at home now."]),
    ("q18", "like / don't / my grandparents / cats / . (우리 조부모님은 고양이를 좋아하지 않는다.)", ["My grandparents don't like cats.", "My grandparents do not like cats."]),
    ("q19", "in the library / they / aren't / . (그들은 도서관에 있지 않다.)", ["They aren't in the library.", "They are not in the library.", "They're not in the library."]),
    ("q20", "have a skateboard / Bill / doesn't / . (빌은 스케이트보드가 없다.)", ["Bill doesn't have a skateboard.", "Bill does not have a skateboard."]),
    ("q21", "is / in the afternoon / he / busy / ? (그는 오후에 바쁘니?)", ["Is he busy in the afternoon?"]),
    ("q22", "there / are / in the box / many apples / ? (상자에 사과가 많니?)", ["Are there many apples in the box?"]),
    ("q23", "does / every day / read a book / she / ? (그녀는 매일 책을 읽니?)", ["Does she read a book every day?"]),
    ("q24", "you / do / coffee / drink / ? (너는 커피를 마시니?)", ["Do you drink coffee?"]),
]

fly = {
    "practiceId": "u01:fly",
    "title": "Grammar Fly",
    "subtitle": "Rewrite & unscramble (pp. 18–19)",
    "pages": "18–19",
    "timerMinutes": 24,
    "items": [
        {"id": i[0], "type": "sentence", "promptKo": "괄호 안 지시대로 문장을 바꿔 쓰세요.", "promptEn": i[1], "accept": i[2]}
        for i in fly_a
    ] + [
        {"id": i[0], "type": "sentence", "promptKo": "주어진 말을 바르게 배열하여 문장을 쓰세요.", "promptEn": i[1], "accept": i[2]}
        for i in fly_b
    ],
}

writing = {
    "practiceId": "u01:writing",
    "title": "Grammar & Writing",
    "subtitle": "Schedule & dialogue (pp. 20–21)",
    "pages": "20–21",
    "timerMinutes": 20,
    "items": [
        {"id": "q01", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "Jimin ________ at 6:30 in the morning.", "blanks": 1, "accept": ["gets up", "gets up."]},
        {"id": "q02", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "She ________ at 7:30.", "blanks": 1, "accept": ["has breakfast", "has breakfast."]},
        {"id": "q03", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "She ________ at 8 o'clock.", "blanks": 1, "accept": ["goes to school", "goes to school."]},
        {"id": "q04", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "She ________ at 4:30 in the afternoon.", "blanks": 1, "accept": ["takes ballet lessons", "takes ballet lessons."]},
        {"id": "q05", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "She ________ at 8 o'clock in the evening.", "blanks": 1, "accept": ["does her homework", "does her homework."]},
        {"id": "q06", "type": "fill", "promptKo": "지민이의 하루 — 빈칸에 알맞은 말을 쓰세요.", "promptEn": "She ________ at 10 o'clock.", "blanks": 1, "accept": ["goes to bed", "goes to bed."]},
        {"id": "q07", "type": "fill", "promptKo": "은지와 준호의 대화 — 빈칸을 채우세요.", "promptEn": "Eunji: Is Bingbing from China?\nJunho: Yes, she ________.", "blanks": 1, "accept": ["is"]},
        {"id": "q08", "type": "fill", "promptKo": "은지와 준호의 대화 — 빈칸을 채우세요.", "promptEn": "Eunji: ________ Paul live in New York?\nJunho: ________, he does.", "blanks": 2, "accept": ["Does|Yes", "Does|yes"]},
        {"id": "q09", "type": "fill", "promptKo": "은지와 준호의 대화 — 빈칸을 채우세요.", "promptEn": "Eunji: ________ Susan from the U.S.?\nJunho: ________, she isn't. She's from the U.K.", "blanks": 2, "accept": ["Is|No", "Is|no"]},
        {"id": "q10", "type": "fill", "promptKo": "은지와 준호의 대화 — 빈칸을 채우세요.", "promptEn": "Eunji: ________ Susan have a pet?\nJunho: ________, she doesn't.", "blanks": 2, "accept": ["Does|No", "Does|no"]},
        {"id": "q11", "type": "fill", "promptKo": "은지와 준호의 대화 — 빈칸을 채우세요.", "promptEn": "Eunji: ________ David 13 years old?\nJunho: ________, he isn't. He's 14 years old.", "blanks": 2, "accept": ["Is|No", "Is|no"]},
    ],
}

wrap = {
    "practiceId": "u01:wrap",
    "title": "Wrap Up",
    "subtitle": "Unit summary fill-ins (pp. 26–27)",
    "pages": "26–27",
    "timerMinutes": 10,
    "items": [
        {"id": "q01", "type": "fill", "promptKo": "be동사 현재형 — 빈칸을 채우세요.", "promptEn": "With I we use ________.", "blanks": 1, "accept": ["am"]},
        {"id": "q02", "type": "fill", "promptKo": "be동사 현재형 — 빈칸을 채우세요.", "promptEn": "With you / we / they we use ________.", "blanks": 1, "accept": ["are"]},
        {"id": "q03", "type": "fill", "promptKo": "be동사 현재형 — 빈칸을 채우세요.", "promptEn": "With he / she / it we use ________.", "blanks": 1, "accept": ["is"]},
        {"id": "q04", "type": "fill", "promptKo": "be동사 부정형 — 빈칸을 채우세요.", "promptEn": "For he / she / it, not is often ________.", "blanks": 1, "accept": ["isn't", "is not"]},
        {"id": "q05", "type": "fill", "promptKo": "be동사 의문문 — I ~?", "promptEn": "________ I late?", "blanks": 1, "accept": ["Am"]},
        {"id": "q06", "type": "fill", "promptKo": "be동사 의문문 — you ~?", "promptEn": "________ you ready?", "blanks": 1, "accept": ["Are"]},
        {"id": "q07", "type": "fill", "promptKo": "be동사 의문문 — she ~?", "promptEn": "________ she your sister?", "blanks": 1, "accept": ["Is"]},
        {"id": "q08", "type": "fill", "promptKo": "일반동사 3인칭 단수 — 빈칸을 채우세요.", "promptEn": "Usually add ________ (e.g. play → plays).", "blanks": 1, "accept": ["-s", "s"]},
        {"id": "q09", "type": "fill", "promptKo": "일반동사 3인칭 단수 — 빈칸을 채우세요.", "promptEn": "After -ch / -sh / -x / -o, add ________ (e.g. watch → watches).", "blanks": 1, "accept": ["-es", "es"]},
        {"id": "q10", "type": "fill", "promptKo": "일반동사 부정문 — 빈칸을 채우세요.", "promptEn": "I / you / we / they + ________ + verb", "blanks": 1, "accept": ["don't", "do not"]},
        {"id": "q11", "type": "fill", "promptKo": "일반동사 부정문 — 빈칸을 채우세요.", "promptEn": "he / she / it + ________ + verb", "blanks": 1, "accept": ["doesn't", "does not"]},
        {"id": "q12", "type": "fill", "promptKo": "일반동사 의문문 — 빈칸을 채우세요.", "promptEn": "________ + I / you / we / they + verb?", "blanks": 1, "accept": ["Do"]},
        {"id": "q13", "type": "fill", "promptKo": "일반동사 의문문 — 빈칸을 채우세요.", "promptEn": "________ + he / she / it + verb?", "blanks": 1, "accept": ["Does"]},
    ],
}

checkup = {
    "practiceId": "u01:checkup",
    "title": "Check Up",
    "subtitle": "Comic dialogue blanks (p. 27)",
    "pages": "27",
    "timerMinutes": 8,
    "wordBank": ["is", "Do", "play", "doesn't"],
    "items": [
        {"id": "q01", "type": "fill", "promptKo": "그림을 보고 대화 빈칸을 채우세요.", "promptEn": "Sunny: Wow, he ________ a good soccer player!", "blanks": 1, "accept": ["is"]},
        {"id": "q02", "type": "fill", "promptKo": "그림을 보고 대화 빈칸을 채우세요.", "promptEn": "Sunny: ________ you ________ soccer well?", "blanks": 2, "accept": ["Do|play", "do|play"]},
        {"id": "q03", "type": "fill", "promptKo": "그림을 보고 대화 빈칸을 채우세요.", "promptEn": "Snowie: Jack ________ soccer well.", "blanks": 1, "accept": ["doesn't", "does not"]},
    ],
}

for name, data in [
    ("walk1.json", walk1),
    ("walk2.json", walk2),
    ("run.json", run),
    ("jump.json", jump),
    ("fly.json", fly),
    ("writing.json", writing),
    ("wrap.json", wrap),
    ("checkup.json", checkup),
]:
    write(name, data)

# unit test from upload
import shutil
src = os.path.join(os.path.dirname(__file__), "..", "..", "home", "ubuntu", ".cursor", "projects", "workspace", "uploads", "unit-test-01_9133.json")
if not os.path.isfile(src):
    src = "/home/ubuntu/.cursor/projects/workspace/uploads/unit-test-01_9133.json"
with open(src, encoding="utf-8") as f:
    ut = json.load(f)
ut["practiceId"] = "u01:quiz"
ut["timerMinutes"] = 25
raw_items = ut.get("items") or []
items = []
for it in raw_items:
    nid = "q" + str(it["id"]).zfill(2)
    row = dict(it)
    row["id"] = nid
    items.append(row)
ut["items"] = items
write("unit-test-01.json", ut)
