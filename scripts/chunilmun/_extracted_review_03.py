#!/usr/bin/env python3
"""Scan-extracted workbook data for review-03 — 천일문 Grammar 1.

Source: uploads/review-03-pages.pdf (original PDF pp. 251–254; printed WB pp. 98–101).
"""
from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from practice_lib import CORR, MC, SENT, WR2, build_practice, fill_item, labels_num, mc_item, section, sent_item


def _write_docs(data: dict[str, dict]) -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "..", "data", "chunilmun1", "review-03")
    for name, doc in data.items():
        path = os.path.join(root, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            import json

            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")


def build_review_03() -> dict[str, dict]:
    secs = [
        section(
            "1-2",
            "[1–2]",
            "[1–2] 다음 중 빈칸에 들어갈 말로 알맞지 않은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2),
        ),
        section(
            "3-4",
            "[3–4]",
            "[3–4] 다음 중 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            labels_num(2, 3),
        ),
        section(
            "5",
            "[5]",
            "[5] 두 문장의 의미가 일치하도록 빈칸에 알맞은 말을 쓰세요.",
            WR2,
            "words",
            ["5"],
        ),
        section(
            "6-7",
            "[6–7]",
            "[6–7] 다음 중 빈칸에 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 6),
        ),
        section(
            "8-9",
            "[8–9]",
            "[8–9] 다음 문장에서 어법상 알맞지 않은 부분을 찾아 바르게 고쳐 쓰세요.",
            CORR,
            "words",
            labels_num(2, 8),
        ),
        section(
            "10-11",
            "[10–11]",
            "[10–11] 다음 중 주어진 우리말을 바르게 영작한 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 10),
        ),
        section(
            "12-13",
            "[12–13]",
            "[12–13] 다음 중 밑줄 친 부분의 쓰임이 다른 하나를 고르세요.",
            MC,
            "choice",
            labels_num(2, 12),
        ),
        section(
            "14-15",
            "[14–15]",
            "[14–15] 우리말과 일치하도록 주어진 단어를 올바르게 배열하세요.",
            SENT,
            "sentence",
            labels_num(2, 14),
        ),
        section(
            "16-17",
            "[16–17]",
            "[16–17] 다음 중 (A), (B)에 들어갈 말이 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 16),
        ),
        section(
            "18-19",
            "[18–19]",
            "[18–19] 다음 중 <보기>의 밑줄 친 부분과 쓰임이 다른 하나를 고르세요.",
            MC,
            "choice",
            labels_num(2, 18),
        ),
        section(
            "20-21",
            "[20–21]",
            "[20–21] 다음 두 문장을 주어진 단어를 사용하여 한 문장으로 바꿔 쓰세요.",
            SENT,
            "sentence",
            labels_num(2, 20),
        ),
        section(
            "22-23",
            "[22–23]",
            "[22–23] 다음 중 빈칸에 공통으로 들어갈 말로 알맞은 것을 고르세요.",
            MC,
            "choice",
            labels_num(2, 22),
        ),
        section(
            "24",
            "[24]",
            "[24] 어법상 알맞지 않은 문장을 모두 고르세요.",
            MC,
            "choice",
            ["24"],
        ),
        section(
            "25",
            "[25]",
            "[25] 어법상 알맞지 않은 문장을 고르세요.",
            MC,
            "choice",
            ["25"],
        ),
        section(
            "26-27",
            "[26–27]",
            "[26–27] 우리말과 일치하도록 주어진 단어를 사용하여 문장을 완성하세요.",
            SENT,
            "sentence",
            labels_num(2, 26),
        ),
        section(
            "28",
            "[28]",
            "[28] 다음 중 어법상 알맞은 것끼리 바르게 짝지어진 것을 고르세요.",
            MC,
            "choice",
            ["28"],
        ),
        section("29", "[29]", "[29] 다음 중 밑줄 친 부분을 생략할 수 없는 문장을 고르세요.", MC, "choice", ["29"]),
        section(
            "30",
            "[30]",
            "[30] 다음 중 문맥상 빈칸에 when을 쓸 수 없는 것을 고르세요.",
            MC,
            "choice",
            ["30"],
        ),
        section(
            "31",
            "[31]",
            "[31] 다음 대화에서 어법과 문맥상 알맞지 않은 부분 두 군데를 찾아 바르게 고쳐 쓰세요.",
            WR2,
            "words",
            ["31"],
        ),
    ]
    items = [
        mc_item(
            iid="q01",
            sec=secs[0],
            label="1",
            prompt_en="She will ______ you the photo.",
            choices=["send", "show", "look", "bring", "give"],
            answer_index=3,
        ),
        mc_item(
            iid="q02",
            sec=secs[0],
            label="2",
            prompt_en="I ______ to buy a new desk.",
            choices=["want", "consider", "plan", "hope", "wish"],
            answer_index=2,
        ),
        mc_item(
            iid="q03",
            sec=secs[1],
            label="3",
            choices=[
                "She named her dog Leo.",
                "He became a famous actor.",
                "They like going to the stadium.",
                "Nami decided to take a bus.",
                "The cake tastes sweetly.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q04",
            sec=secs[1],
            label="4",
            choices=[
                "We knew the answer was wrong.",
                "This bag is for the young children.",
                "They will be in Chicago on Thursday.",
                "Sujin will go to the market and eats lunch.",
                "After I went to bed, someone rang the bell.",
            ],
            answer_index=4,
        ),
        fill_item(
            iid="q05",
            sec=secs[2],
            label="5",
            prompt_en="My parents bought my sister a laptop.\n= My parents bought a laptop ______ my sister.",
            accept=["for"],
        ),
        mc_item(
            iid="q06",
            sec=secs[3],
            label="6",
            prompt_en="Her family lived ______ London when she was young.",
            choices=["in", "to", "from", "at", "on"],
            answer_index=1,
        ),
        mc_item(
            iid="q07",
            sec=secs[3],
            label="7",
            prompt_en="I'll leave a message ______ he isn't at home.",
            choices=["and", "after", "but", "or", "if"],
            answer_index=5,
        ),
        fill_item(
            iid="q08",
            sec=secs[4],
            label="8",
            prompt_en="The gloves keep my hands warmly.",
            accept=["warmly|warm", "warm"],
            blanks=2,
        ),
        fill_item(
            iid="q09",
            sec=secs[4],
            label="9",
            prompt_en="She didn't buy the shoes because of they weren't light.",
            accept=["because of|because", "because"],
            blanks=2,
        ),
        mc_item(
            iid="q10",
            sec=secs[5],
            label="10",
            prompt_en="너무 추울 때 나는 외출하는 것을 피한다.",
            choices=[
                "When it's too cold, I avoid to go out.",
                "Before it's too cold, I avoid going out.",
                "Before it's too cold, I avoid to go out.",
                "When it's too cold, I avoid going out.",
                "Because it's too cold, I avoid to go out.",
            ],
            answer_index=4,
        ),
        mc_item(
            iid="q11",
            sec=secs[5],
            label="11",
            prompt_en="너는 나에게 그의 주소를 말해 줄 수 있니?",
            choices=[
                "Can you tell his address me?",
                "Can you tell me his address?",
                "Can you tell to me his address?",
                "Can you tell his address of me?",
                "Can you tell for me his address?",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q12",
            sec=secs[6],
            label="12",
            choices=[
                "They practiced hard to win the game.",
                "We waited for an hour to meet Bob.",
                "Jenny is here to have dinner with us.",
                "I hugged my mom to make her happy.",
                "He has a book to borrow.",
            ],
            answer_index=5,
        ),
        mc_item(
            iid="q13",
            sec=secs[6],
            label="13",
            choices=[
                "Cindy is beautiful when she dances.",
                "When it's sunny, let's go on a picnic.",
                "My brother plays computer games when he finishes his homework.",
                "When I met him, he was a student.",
                "When did you send the letter?",
            ],
            answer_index=5,
        ),
        sent_item(
            iid="q14",
            sec=secs[7],
            label="14",
            prompt_en="우리 아버지는 아이들에게 과학을 가르치신다. (children / teaches / science)",
            accept=[
                "My father teaches the children science.",
                "My father teaches science to the children.",
                "My father teaches children science.",
            ],
        ),
        sent_item(
            iid="q15",
            sec=secs[7],
            label="15",
            prompt_en="너는 여름에 여행을 갈 거니? (a / on / go / trip / summer / you / in)",
            accept=[
                "Will you go on a trip in the summer?",
                "Will you go on a trip this summer?",
            ],
        ),
        mc_item(
            iid="q16",
            sec=secs[8],
            label="16",
            prompt_en="Drawing cartoons (A) my hobby. / I rode a bike (B) climbed a mountain last week.",
            choices=["are — when", "is — when", "are — but", "is — and", "are — and"],
            answer_index=4,
        ),
        mc_item(
            iid="q17",
            sec=secs[8],
            label="17",
            prompt_en="Carl lost his notebook (A) school. / My sister cooked pasta (B) my parents.",
            choices=["at — for", "at — of", "on — for", "on — to", "in — of"],
            answer_index=1,
        ),
        mc_item(
            iid="q18",
            sec=secs[9],
            label="18",
            prompt_en="<보기> His habit is chewing gum.",
            choices=[
                "They enjoy going shopping.",
                "I stopped playing the violin.",
                "Tony is speaking about his dog.",
                "My dream is traveling the world.",
                "Watching sports games is exciting.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q19",
            sec=secs[9],
            label="19",
            prompt_en="<보기> She dances like a ballerina.",
            choices=[
                "Jimmy walks like a robot.",
                "His hands were cold like ice.",
                "The children usually like ice cream.",
                "The old dog moved slowly like a turtle.",
                "Can you run fast like your brother?",
            ],
            answer_index=3,
        ),
        sent_item(
            iid="q20",
            sec=secs[10],
            label="20",
            prompt_en="Jake will visit my house tonight. He will watch a movie with me. (to)",
            accept=[
                "Jake will visit my house tonight to watch a movie with me.",
            ],
        ),
        sent_item(
            iid="q21",
            sec=secs[10],
            label="21",
            prompt_en="I closed the window. It was noisy. (because)",
            accept=[
                "I closed the window because it was noisy.",
            ],
        ),
        mc_item(
            iid="q22",
            sec=secs[11],
            label="22",
            prompt_en="Give that long dress ______ her. / I finished my homework thanks ______ Peter.",
            choices=["of", "to", "from", "by", "with"],
            answer_index=2,
        ),
        mc_item(
            iid="q23",
            sec=secs[11],
            label="23",
            prompt_en="Kate raised her hand ______ ask a question. / The city will hold the festival from Friday ______ Sunday.",
            choices=["for", "by", "to", "with", "on"],
            answer_index=3,
        ),
        mc_item(
            iid="q24",
            sec=secs[12],
            label="24",
            prompt_en=(
                "① Cut the steak with the knife.\n"
                "② I arrived on time by taking a taxi.\n"
                "③ She will visit her uncle at October.\n"
                "④ Amy expects meeting her favorite singer.\n"
                "⑤ They finished playing tennis before it got too dark."
            ),
            choices=["②, ③", "②, ④", "③, ④", "③, ⑤", "②, ③, ⑤"],
            answer_index=3,
        ),
        mc_item(
            iid="q25",
            sec=secs[13],
            label="25",
            choices=[
                "The girl looks so lovely.",
                "Nancy taught her brother history.",
                "Please choose one, red and green.",
                "The rainy days always make me sadly.",
                "If Yuri has time, we'll go to the restaurant.",
            ],
            answer_index=4,
        ),
        sent_item(
            iid="q26",
            sec=secs[14],
            label="26",
            prompt_en="그 여자는 3년 동안 우리 집 가까이에서 살았다. (my house, 3 years)",
            accept=[
                "The woman lived near my house for 3 years.",
                "The woman lived near my house for three years.",
            ],
        ),
        sent_item(
            iid="q27",
            sec=secs[14],
            label="27",
            prompt_en="나는 소설이나 만화책을 읽는 것에 관심이 있다. (be interested in, read, novels, comic books)",
            accept=[
                "I am interested in reading novels and comic books.",
                "I'm interested in reading novels and comic books.",
            ],
        ),
        mc_item(
            iid="q28",
            sec=secs[15],
            label="28",
            prompt_en="ⓐ My parents left me alone. ⓑ I know the song through TV. ⓒ To making cookies aren't easy. ⓓ Thank you for joining our club. ⓔ We gave up waiting for the bus. ⓕ The park is very beautiful at May.",
            choices=[
                "ⓐ, ⓒ, ⓔ, ⓕ",
                "ⓐ, ⓑ, ⓓ, ⓔ",
                "ⓐ, ⓑ, ⓔ, ⓕ",
                "ⓑ, ⓒ, ⓓ, ⓕ",
                "ⓑ, ⓒ, ⓓ, ⓔ, ⓕ",
            ],
            answer_index=2,
        ),
        mc_item(
            iid="q29",
            sec=secs[16],
            label="29",
            choices=[
                "Did they know that I was sick?",
                "She hopes that everyone is honest.",
                "Do you know that man over there?",
                "Can you believe that Nick is a winner?",
                "They always say that they do their best.",
            ],
            answer_index=3,
        ),
        mc_item(
            iid="q30",
            sec=secs[17],
            label="30",
            choices=[
                "________ she left, I waved at her.",
                "I listen to music ________ I'm angry.",
                "Close the window ________ you go out.",
                "He had a headache ________ he got up this morning.",
                "Jisu didn't eat that pizza ________ she doesn't like cheese.",
            ],
            answer_index=5,
        ),
        fill_item(
            iid="q31",
            sec=secs[18],
            label="31",
            prompt_en=(
                "A: I took many pictures in Canada. I can show to you them.\n"
                "B: Oh, I want to see them, or I have to clean the classroom now.\n"
                "A: If you finish early, please come to my classroom."
            ),
            accept=[
                "show to you them|show them to you|or|but",
                "show them to you|but",
            ],
            blanks=4,
        ),
    ]
    return {
        "review-03.json": build_practice(
            practice_id="cm1:review-03",
            title="총괄평가 3회",
            subtitle="Ch09–12 (WB pp. 98–101 · PDF 251–254)",
            pages="251–254",
            timer_minutes=45,
            unit_id="review-03",
            unit_title="총괄평가 3회 (Ch09–12)",
            sections=secs,
            items=items,
        )
    }


if __name__ == "__main__":
    data = build_review_03()
    _write_docs(data)
    print("review-03: wrote 1 file")
