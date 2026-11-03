#!/usr/bin/env python3
"""Prepend a short 그림: scene line to picture-dependent practice items.

A hit is an item whose section or item instruction says to look at a picture
(그림 / picture / look at the picture|drawing|figure), with no rendered image
and no scene line. The line states only the facts the answer needs. It is
derived from the keyed accept plus the stem. Accept keys are not changed.

Scene lines already in the packs (그림:, [그림: …], "shows", "circled") are left
alone. Re-running this script is a no-op once those lines are in place.
"""
from __future__ import annotations

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

PIC_INSTR = re.compile(
    r"그림|\bpicture\b|look at the (?:picture|drawing|figure)",
    re.I,
)
SCENE_CUE = re.compile(
    r"그림\s*[:：]|\[그림\s*[:：]|(?:Picture|Scene|Figure)\s*[:：]|\bshows\b|\bcircled\b",
    re.I,
)
IMAGE_KEYS = ("image", "imageUrl", "img", "media")

RESTAURANT = "그림: 식당 안에 테이블 3개, 테이블 위에 접시 2개, 접시 사이에 꽃병 1개."
DESK = "그림: 책은 컴퓨터 뒤에, 달력은 컴퓨터 앞에, 의자는 책상 옆에, 고양이는 의자 아래에 있다."
TREE = "그림: 새들은 나무 위 하늘을 날고, 남자아이는 나무 아래에서 책을 읽으며, 개는 나무 주위를 달린다."
STREET = "그림: 카페는 병원과 은행 사이에 있고, 병원은 카페 옆에 있으며, 여자아이는 은행 앞에 서 있다."
MAP = (
    "그림: 도서관은 Main Street에 있다. 분수대는 City Hall 앞에 있고, City Hall은 분수대 뒤에 있다. "
    "학교는 First Avenue에 있다. 병원은 City Hall과 학교 사이에 있다. 공원은 학교 뒤에 있다."
)
BOX = "그림: 어제 큰 상자가 배달되어 부엌으로 옮겨진 뒤 열렸고, 병 몇 개가 깨져 있다."
JASON = (
    "그림: Jason이 책을 읽는 동안 전화가 울렸다. 전화하는 동안 누군가 문을 두드렸다. "
    "문을 열자 물이 끓기 시작했다. 가스를 끄자 개가 짖었다. 개에게 밥을 주는 동안 전화가 다시 울렸다."
)


def C(pid: str, mapping: dict[str, str]) -> dict[tuple[str, str], str]:
    return {(pid, item_id): cue for item_id, cue in mapping.items()}


def same(pid: str, ids: list[str], cue: str) -> dict[tuple[str, str], str]:
    return {(pid, item_id): cue for item_id in ids}


CUES: dict[tuple[str, str], str] = {}
CUES.update(same("cm1:c05:test", ["q13a", "q13b", "q13c"], RESTAURANT))
CUES.update(same("cm1:c11:u1-B", ["b01", "b02", "b03", "b04"], DESK))
CUES.update(same("cm1:wb-c11:u1-B", ["b01", "b02", "b03"], TREE))
CUES.update(same("cm1:wb-c11:u1-B", ["b04", "b05", "b06"], STREET))
CUES.update(same("g3:u06:writing", ["u06wrt_b01", "u06wrt_b02", "u06wrt_b03", "u06wrt_b04", "u06wrt_b05", "u06wrt_b06"], MAP))
CUES.update(same("g4:u05:checkup", ["checkup_c01", "checkup_c02", "checkup_c03", "checkup_c04"], BOX))
CUES.update(same("g4:u07:writing", ["a01", "a02", "a03", "a04", "a05"], JASON))
CUES.update(
    {
        **C(
            "cm1:c05:u1-B",
            {
                "b01": "그림: 점심으로 피자 두 조각.",
                "b02": "그림: 매일 우유 두 잔.",
                "b03": "그림: 아침으로 밥 한 그릇.",
                "b04": "그림: 오늘 커피 두 잔.",
            },
        ),
        **C(
            "cm1:wb-c05:u1-C",
            {
                "c01": "그림: 매일 아침 차 한 잔.",
                "c02": "그림: 케이크 한 조각.",
                "c03": "그림: 주스 세 병.",
                "c04": "그림: 아침으로 시리얼 한 그릇.",
            },
        ),
        **C("cm1:wb-c05:test", {"q10": "그림: 나뭇가지 위에 새 두 마리."}),
        **C(
            "cm1:c02:test",
            {"q13": "그림: 소년은 어젯밤 햄버거를 먹었고, 컴퓨터 게임은 하지 않았다."},
        ),
        **C("cm1:c03:test", {"q16": "그림: 오빠가 밖에서 자전거를 타고 있다."}),
        **C("cm1:c10:test", {"q13": "그림: Anne은 피아노 연주를 잘한다."}),
        **C(
            "cm1:c11:test",
            {
                "q14": "그림: 테이블은 의자 두 개 사이에 있고, 파란 차는 차고 안에 있으며, 울타리는 뒤뜰을 따라 늘어서 있다."
            },
        ),
        **C(
            "cm1:wb-c11:test",
            {"q04": "그림: 공은 테이블 아래에, 램프는 테이블 위에, 소파는 테이블과 고양이 사이에 있다."},
        ),
        **C(
            "cm1:c12:test",
            {
                "q07": "그림: (1) Ann은 혼자 있을 때 그림을 그린다. (2) Sam은 시간이 날 때 수영을 한다.",
                "q10": "그림: (1) Ted는 스쿨버스를 놓쳐서 화나 있다. (2) John은 아파서 침대에 있어 학교에 오지 않았다.",
            },
        ),
        **C(
            "cm1:wb-c12:test",
            {"q14": "그림: (1) Suji는 아침 식사 전에 조깅한다. (2) Suji는 이를 닦은 뒤에 학교에 간다."},
        ),
        **C("cm2:c04:test", {"q07": "그림: 어젯밤 도둑이 다이아몬드 반지를 훔쳤다."}),
        **C("cm2:c11:test", {"q22": "그림: 날씨가 좋으면 우리 가족이 내일 캠핑을 간다."}),
        **C(
            "cm2:wb-c11:test",
            {"q15": "그림: (1) 내가 샤워하는 중에 초인종이 울렸다. (2) 그가 창문을 깨서 선생님이 화났다."},
        ),
        **C(
            "cm2:c12:test",
            {"q17": "그림: 한 소년이 책을 읽고 있는 여자 옆에 앉아 있다."},
        ),
        **C(
            "r1:u03:walk",
            {
                "a01": "그림: 펜, 상자, 버스, 벤치.",
                "a02": "그림: 접시, 토마토, 아기, 남자아이.",
                "b01": "그림: 나뭇잎, 칼, 남자, 여자.",
                "b02": "그림: 어린이, 쥐, 발, 양.",
            },
        ),
        **C(
            "g4:u06:checkup",
            {
                "checkup_c01": "그림: 아빠가 의자를 칠했다.",
                "checkup_c02": "그림: 엄마가 바닥을 대걸레로 닦았다.",
                "checkup_c03": "그림: Sunny가 방을 청소했다.",
            },
        ),
        **C(
            "g4:u06:writing",
            {
                "writing_a01a": "그림: Tom이 벽을 칠했다. Jim은 칠하지 않았다.",
                "writing_a01b": "그림: Tom이 벽을 칠했다. Jim은 칠하지 않았다.",
                "writing_a02a": "그림: David가 공을 쳤다. Ben은 치지 않았다.",
                "writing_a02b": "그림: David가 공을 쳤다. Ben은 치지 않았다.",
                "writing_a03a": "그림: Amy가 노래를 불렀다. Mary는 부르지 않았다.",
                "writing_a03b": "그림: Amy가 노래를 불렀다. Mary는 부르지 않았다.",
                "writing_a04a": "그림: Betty가 사진을 찍었다. Cathy는 찍지 않았다.",
                "writing_a04b": "그림: Betty가 사진을 찍었다. Cathy는 찍지 않았다.",
                "writing_a05a": "그림: Ben이 병들을 깨뜨렸다. Ken은 깨뜨리지 않았다.",
                "writing_a05b": "그림: Ben이 병들을 깨뜨렸다. Ken은 깨뜨리지 않았다.",
                "writing_a06a": "그림: Cathy가 방을 청소했다. Betty는 청소하지 않았다.",
                "writing_a06b": "그림: Cathy가 방을 청소했다. Betty는 청소하지 않았다.",
            },
        ),
        **C(
            "g4:u04:writing",
            {
                "b01": "그림: 아빠가 문을 고치고 있다.",
                "b02": "그림: Annie가 식탁을 닦고 있다.",
                "b03": "그림: 엄마가 바닥을 대걸레로 닦고 있다.",
                "b04": "그림: Bill이 창문을 닦고 있다.",
                "b05": "그림: Susie가 설거지를 하고 있다.",
                "b06": "그림: 할아버지가 쓰레기를 내놓고 있다.",
            },
        ),
        **C(
            "g4:u04:checkup",
            {
                "c01": "그림: 상대에게 달리라고 시킨다.",
                "c02": "그림: Snowie가 공을 잡는다.",
                "c03": "그림: 그가 공을 가지고 온다.",
            },
        ),
        **C(
            "g4:u08:writing",
            {
                "writing-a01": "그림: 그의 개가 다쳐서 그가 슬프다.",
                "writing-a02": "그림: 그가 경기에서 이겨서 행복하다.",
                "writing-a03": "그림: 그녀가 늦게 자서 피곤하다.",
                "writing-a04": "그림: 그녀에게 숙제가 많아서 바쁘다.",
                "writing-a05": "그림: 그가 자전거를 잃어버려서 화나 있다.",
            },
        ),
        **C(
            "g4:u08:checkup",
            {
                "checkup-c01": "그림: 날씨가 화창하면 산책하러 간다.",
                "checkup-c02": "그림: 비가 와서 집에 있어야 한다.",
                "checkup-c03": "그림: 내일 비가 그치기를 바란다.",
                "checkup-c04": "그림: 내일도 비가 그치지 않을 것을 안다.",
            },
        ),
        **C(
            "g4:u07:checkup",
            {
                "c01": "그림: 아기였을 때를 가리킨다.",
                "c02": "그림: 자고 있는 동안을 가리킨다.",
                "c03": "그림: 깨기 전을 가리킨다.",
                "c04": "그림: 깬 뒤를 가리킨다.",
            },
        ),
        **C(
            "g4:u03:writing",
            {
                "a01": "그림: 강아지가 나를 화나게 했다.",
                "a02": "그림: 케이크를 보고 행복해졌다.",
                "a03": "그림: 영화를 보고 슬퍼졌다.",
                "a04": "그림: 뉴스를 보고 놀랐다.",
                "a05": "그림: 책을 읽다가 졸렸다.",
                "a06": "그림: 번개를 보고 무서웠다.",
            },
        ),
        **C(
            "g4:u03:checkup",
            {
                "c01": "그림: 화난 표정이다.",
                "c02": "그림: 잘생겨서 Prince라고 부른다.",
                "c03": "그림: 그것들을 먹으라고 한다.",
                "c04": "그림: 이 카펫이 더러워졌다.",
            },
        ),
        **C(
            "g4:u02:checkup",
            {
                "c01": "그림: 나에게 물을 좀 가져다 달라고 한다.",
                "c02": "그림: 책을 건네 달라고 한다.",
                "c03": "그림: 쿠키를 나에게 달라고 한다.",
                "c04": "그림: 나를 위해 휴대 전화를 찾아 달라고 한다.",
            },
        ),
        **C(
            "g4:u01:checkup",
            {
                "c01": "그림: 강아지가 먹이를 보며 배고파한다.",
                "c02": "그림: 강아지가 빵 냄새를 맡으며 좋다고 느낀다.",
                "c03": "그림: 배가 부른 강아지가 행복해한다.",
                "c04": "그림: 화난 표정의 여자를 본다.",
            },
        ),
        **C(
            "g4:u01:writing",
            {
                "a01": "그림: 봄에는 날씨가 따뜻해진다.",
                "a02": "그림: 봄에는 낮이 길어진다.",
                "a03": "그림: 봄에는 나뭇잎이 초록색으로 변한다.",
                "a04": "그림: 가을에는 날씨가 선선해진다.",
                "a05": "그림: 가을에는 낮이 짧아진다.",
                "a06": "그림: 가을에는 나뭇잎이 빨갛고 노랗게 변한다.",
                "b01": "그림: 빨간 스카프가 부드럽다.",
                "b02": "그림: 머리핀들이 예뻐 보인다.",
                "b03": "그림: 음악이 신나게 들린다.",
                "b04": "그림: 팬케이크 냄새가 좋다.",
                "b05": "그림: 레모네이드 맛이 시다.",
            },
        ),
        **C(
            "g2:u08:writing",
            {
                "b01": "그림: Amy가 닭에게 모이를 주느라 바쁘다.",
                "b02": "그림: Tom이 울타리를 고치느라 바쁘다.",
                "b03": "그림: James가 벽을 칠하느라 바쁘다.",
                "b04": "그림: Susan이 젖을 짜느라 바쁘다.",
                "b05": "그림: Jack이 말을 씻기느라 바쁘다.",
                "b06": "그림: Brian이 양배추에 물을 주느라 바쁘다.",
            },
        ),
        **C(
            "g2:u08:checkup",
            {
                "c01": "그림: Snowie와 스키를 타러 갔다.",
                "c02": "그림: 스키 타는 것을 좋아하는지 묻는다.",
                "c03": "그림: 스키 타는 것을 매우 좋아한다.",
            },
        ),
        **C(
            "g2:u07:checkup",
            {
                "c01": "그림: 취미가 낚시이다.",
                "c02": "그림: 낚시를 좋아한다.",
                "c03": "그림: 낚시는 쉽지 않다.",
                "c04": "그림: 낚시를 좋아하지 않는다.",
            },
        ),
        **C(
            "g2:u04:checkup",
            {
                "c01": "그림: 슈퍼맨은 세상에서 가장 힘이 센 사람 중 하나이다.",
                "c02": "그림: 나는 슈퍼맨만큼 힘이 세다.",
                "c03": "그림: 너는 점점 더 힘이 세지고 있다.",
                "c04": "그림: 슈퍼맨은 너보다 훨씬 더 힘이 세다.",
            },
        ),
        **C(
            "g2:u03:writing",
            {
                "a01": "그림: 말이 토끼보다 빨리 달리고, 치타가 셋 중 가장 빠르다.",
                "a02": "그림: 재킷이 치마보다 더 비싸고, 블라우스가 셋 중 가장 비싸다.",
                "a03": "그림: Tim의 개가 Jake의 개보다 더 뚱뚱하고, Ben의 개가 셋 중 가장 뚱뚱하다.",
                "a04": "그림: Sally의 남동생은 Sally보다 늦게 일어났고, 엄마는 셋 중 가장 일찍 일어났다.",
                "a05": "그림: 한라산은 소백산보다 높고, 백두산이 셋 중 가장 높다.",
            },
        ),
        **C(
            "g2:u03:checkup",
            {
                "c01": "그림: 이 소파가 가게에서 가장 편안하다.",
                "c02": "그림: 저 소파가 이 소파보다 더 편안해 보인다.",
                "c03": "그림: 이 소파가 세상에서 가장 편안하다.",
            },
        ),
        **C(
            "g2:u02:checkup",
            {
                "c01": "그림: 나는 힘이 세다.",
                "c02": "그림: 나는 아침에 항상 운동한다.",
                "c03": "그림: 갈색 개를 가리킨다.",
                "c04": "그림: 매우 빠르게 달리고 있다.",
            },
        ),
        **C(
            "g2:u06:checkup",
            {
                "c01": "그림: 여자아이가 너에게 전할 소식이 있다.",
                "c02": "그림: Judy가 프랑스어를 배우러 어제 프랑스에 갔다.",
                "c03": "그림: 그 소식을 듣고 슬프다.",
            },
        ),
        **C(
            "g2:u05:checkup",
            {
                "c01": "그림: 야구하는 것을 매우 좋아한다.",
                "c02": "그림: 공을 잡는 것은 쉽지 않았다.",
                "c03": "그림: 거짓말하는 것은 나쁘다.",
            },
        ),
        **C(
            "g3:u04:writing",
            {
                "a01": "그림: Erica는 전에 LA에 가 본 적이 있다.",
                "a02": "그림: Nancy는 전에 노래 대회에서 우승한 적이 있다.",
                "a03": "그림: Dan은 전에 도서관에서 봉사한 적이 있다.",
                "a04": "그림: Brian은 전에 중국에 여행한 적이 있다.",
                "a05": "그림: Olivia는 전에 말을 타 본 적이 있다.",
                "a06": "그림: Ted와 Kate는 전에 마라톤을 뛴 적이 있다.",
                "b01": "그림: 나는 이미 침대를 정리했다.",
                "b02": "그림: 나는 이미 개에게 밥을 줬다.",
                "b03": "그림: 나는 이미 숙제를 끝냈다.",
                "b04": "그림: 나는 아직 운동하지 않았다.",
                "b05": "그림: 나는 아직 피아노를 연습하지 않았다.",
                "b06": "그림: 나는 아직 일기를 쓰지 않았다.",
            },
        ),
        **C(
            "g3:u04:checkup",
            {
                "c01": "그림: 스케이트를 타 본 적이 없다.",
                "c02": "그림: 전에 스케이트를 타 본 적이 있다.",
                "c03": "그림: 방금 팔을 다쳤다.",
            },
        ),
        **C(
            "g3:u08:writing",
            {
                "a01": "그림: 너무 추워서 따뜻한 것을 원한다.",
                "a02": "그림: 옷이 지루해서 새 옷을 원한다.",
                "a03": "그림: 심심해서 신나는 일을 하고 싶다.",
                "a04": "그림: 너무 더워서 뜨거운 것은 원하지 않는다.",
                "a05": "그림: 이가 아파서 딱딱한 것은 원하지 않는다.",
                "b01": "그림: 꽃병 두 개. 하나는 더럽고 다른 하나는 깨끗하다.",
                "b02": "그림: 가방 두 개. 하나는 크고 다른 하나는 작다.",
                "b03": "그림: 카메라 두 개. 하나는 비싸고 다른 하나는 싸다.",
                "b04": "그림: 모자 세 개. 하나는 남자용, 다른 하나는 여자용, 나머지 하나는 어린이용.",
                "b05": "그림: 장난감 세 개. 하나는 곰 인형, 다른 하나는 로봇, 나머지 하나는 자동차.",
                "b06": "그림: 이탈리아 국기 색 세 가지. 하나는 빨강, 다른 하나는 초록, 나머지 하나는 하양.",
            },
        ),
        **C(
            "g3:u08:checkup",
            {
                "c01": "그림: 신나는 일을 하고 싶다.",
                "c02": "그림: 이 게임들을 빌려 간 사람이 있는지 묻는다.",
                "c03": "그림: 세 개 중 하나는 나, 다른 하나는 Sunny, 나머지 하나는 강아지 것이다.",
            },
        ),
        **C(
            "g3:u07:writing",
            {
                "writing_a01": "그림: Jenny와 Peter가 엄마에게 자기소개를 했다.",
                "writing_a02": "그림: 아빠가 스스로 체스를 배웠다.",
                "writing_a03": "그림: 엄마가 직접 쿠키를 만들었다.",
                "writing_a04": "그림: 내 개가 스스로 다쳤다.",
                "writing_a05": "그림: 우리가 스스로 쿠키를 집어 먹었다.",
                "writing_a06": "그림: 우리가 수영장에서 즐거운 시간을 보냈다.",
            },
        ),
        **C(
            "g3:u07:checkup",
            {
                "checkup_01": "그림: 너 혼자 집에 있는지 묻는다.",
                "checkup_02": "그림: 우리가 스스로 만화를 그리며 배운다.",
                "checkup_03": "그림: 여자아이가 자기 자신을 그리고 있다.",
            },
        ),
        **C(
            "g3:u02:checkup",
            {
                "checkup-c01": "그림: 손님이 생일 케이크를 찾고, 빵집 주인이 치즈케이크와 초콜릿 케이크 중 무엇을 원하는지 묻는다.",
                "checkup-c02": "그림: 손님이 그것을 사겠다고 하고, 가격이 얼마인지 묻는다. 35달러이다.",
                "checkup-c03": "그림: 빵집 주인이 촛불이 몇 개 필요한지 묻는다.",
            },
        ),
        **C(
            "g3:u02:writing",
            {
                "writing-a01": "그림: 점원이 치즈 피자와 페퍼로니 중 무엇을 원하는지 묻고, 민수는 치즈 피자를 원한다.",
                "writing-a02": "그림: 민수는 피자 두 조각을 원한다.",
                "writing-a03": "그림: 점원이 콜라와 주스 중 무엇을 원하는지 묻고, 민수는 콜라 한 잔을 원한다.",
                "writing-a04": "그림: 가격은 5달러이다.",
                "writing-a05": "그림: 약 5분 기다리면 된다.",
                "writing-b01": "그림: 학생들이 가고 싶은 도시는 Paris, Sydney, New York이다.",
                "writing-b02": "그림: Paris에 투표한 학생은 6명이다.",
                "writing-b03": "그림: 한국에서 더 가까운 도시는 Sydney이다.",
                "writing-b04": "그림: New York은 한국에서 11,043킬로미터 떨어져 있다.",
                "writing-b05": "그림: 비행기로 Sydney까지 11시간 걸린다.",
            },
        ),
        **C(
            "g3:u03:checkup",
            {
                "c01": "그림: Snowie를 본 적이 있는지 묻는다.",
                "c02": "그림: 그는 하루 종일 내 방에 머물렀다.",
                "c03": "그림: 너는 음식을 전혀 먹지 않았다.",
            },
        ),
        **C(
            "g3:u03:writing",
            {
                "b01": "그림: Eric에게 방을 치웠는지 묻는다.",
                "b02": "그림: 이미 먹었다.",
                "b03": "그림: 이미 물을 줬다.",
                "b04": "그림: 이미 씻었다.",
                "b05": "그림: 이미 만들었다.",
                "b06": "그림: 이미 했다.",
            },
        ),
        **C(
            "g3:u01:checkup",
            {
                "c01": "그림: 엄마가 휴대 전화를 찾으며 가방을 뒤진다.",
                "c02": "그림: 여자아이가 엄마에게 무엇을 찾는지 묻는다. 엄마는 휴대 전화를 찾는다.",
                "c03": "그림: 엄마가 휴대 전화를 어떻게 찾을 수 있는지 묻고, 여자아이에게 생각이 있다.",
                "c04": "그림: 친구가 검은색 휴대 전화와 흰색 휴대 전화 두 개를 들고 있다. 엄마 것은 흰색이다.",
            },
        ),
        **C(
            "g3:u06:checkup",
            {
                "c01": "그림: 저녁 식사 전에 집에 오라고 한다.",
                "c02": "그림: 소파 뒤에 있다.",
                "c03": "그림: 그가 문 앞에 있다.",
                "c04": "그림: 파티가 끝난 뒤에 다시 오겠다고 한다.",
            },
        ),
        **C(
            "g3:u05:checkup",
            {
                "c01": "그림: 한 달 동안 이메일을 확인하지 않았다.",
                "c02": "그림: 비밀번호를 잊어버렸다.",
                "c03": "그림: 나는 네 비밀번호를 잊어버린 상태이다.",
                "c04": "그림: 내 비밀번호를 오래전부터 알고 있었는지 묻는다.",
            },
        ),
        **C(
            "g3:u05:writing",
            {
                "b01": "그림: 야구를 11년 했고, 3학년 때부터이다.",
                "b02": "그림: 스케이트는 5년이 아니라 7년 했다.",
                "b03": "그림: 말은 10년 탔고, 유치원 때부터이다.",
                "b04": "그림: 수영은 오랫동안, 13년 했다.",
                "b05": "그림: 스키는 10년이 아니라 9년 했다.",
            },
        ),
        **C(
            "u04:writing",
            {
                "a01": "그림: 슈퍼맨이 하늘을 날고 있었다.",
                "a02": "그림: 신데렐라가 왕자와 춤을 추고 있었다.",
                "a03": "그림: 백설공주가 사과를 먹고 있었다.",
                "a04": "그림: 인어공주가 왕자를 찾아 헤엄치고 있었다.",
                "a05": "그림: 제페토가 피노키오를 만들고 있었다.",
                "a06": "그림: 피터팬이 후크 선장과 싸우고 있었다.",
                "b01": "그림: 세 사람이 바다에서 수영하고 있다.",
                "b02": "그림: 여자아이와 아빠가 바다에서 낚시를 하고 있다.",
                "b03": "그림: 여자가 모래 위에 누워 있다.",
                "b04": "그림: 남자가 모래성을 쌓고 있다.",
                "b05": "그림: 남자아이가 연을 날리고 있다.",
                "b06": "그림: 여자아이가 아이스크림을 먹고 있다.",
                "b07": "그림: 남자아이 둘이 비치볼을 가지고 놀고 있다.",
            },
        ),
        **C(
            "u04:checkup",
            {
                "c01": "그림: Snowie와 놀고 있는지 묻는다. 대답은 아니다.",
                "c02": "그림: 나무 위 새 두 마리를 보고 있었다.",
                "c03": "그림: 그 새들이 노래하고 있었는지 묻는다. 대답은 그렇다.",
            },
        ),
        **C(
            "u08:writing",
            {
                "b01": "그림: 아름다운 그림 한 점.",
                "b02": "그림: 예쁜 인형들.",
                "b03": "그림: 두꺼운 책 한 권.",
                "b04": "그림: 오래된 트렁크 하나.",
                "b05": "그림: 맛있는 쿠키들.",
                "b06": "그림: 재미있는 가면들.",
            },
        ),
        **C(
            "u08:checkup",
            {
                "c01": "그림: Blackie에게 운동하자고 한다. 일어나라고 한다.",
                "c02": "그림: 점프하라고 하며 먹이를 내민다.",
                "c03": "그림: 나쁜 고양이라고 나무란다.",
                "c04": "그림: Zack에게 바닥을 치워 달라고 한다.",
            },
        ),
        **C(
            "u07:writing",
            {
                "a01": "그림: 이가 아프다. 사탕을 너무 많이 먹으면 안 된다.",
                "a02": "그림: 목이 아프다. 따뜻한 물을 마셔야 한다.",
                "a03": "그림: 밤에 잠이 안 온다. 자기 전에 커피를 마시면 안 된다.",
                "a04": "그림: 심한 감기이다. 약을 먹어야 한다.",
                "a05": "그림: 배가 아프다. 매운 음식을 먹으면 안 된다.",
                "b01": "그림: 엄마가 San에게 쓰레기를 내다 버려 달라고 한다.",
                "b02": "그림: 아빠가 하늘에게 화분에 물을 줘 달라고 한다.",
                "b03": "그림: 엄마가 San에게 Tabby에게 밥을 줘 달라고 한다.",
                "b04": "그림: 엄마가 San에게 전화를 받아 달라고 한다.",
                "b05": "그림: 아빠가 하늘에게 Max를 산책시켜 달라고 한다.",
            },
        ),
        **C(
            "u07:checkup",
            {
                "c01": "그림: 남자가 함께 춤추자고 청한다. 여자가 승낙한다.",
                "c02": "그림: 남자가 사과한 뒤 같이 춤출지 제안한다.",
                "c03": "그림: 부모님이 Sunny에게 Snowie와는 춤추지 않는 편이 낫다고 한다.",
            },
        ),
        **C(
            "u03:writing",
            {
                "a01": "그림: 준호는 올해 규칙적으로 운동할 것이다.",
                "a02": "그림: 준호는 매일 자기 방을 청소할 것이다.",
                "a03": "그림: 준호는 영어를 열심히 공부할 것이다.",
                "a04": "그림: 준호는 TV를 너무 많이 보지 않을 것이다.",
                "a05": "그림: 준호는 정크푸드를 너무 많이 먹지 않을 것이다.",
                "a06": "그림: 준호는 늦게까지 깨어 있지 않을 것이다.",
            },
        ),
        **C(
            "u03:checkup",
            {
                "c01": "그림: 일찍 일어날 계획인지 묻는다.",
                "c02": "그림: 조깅하러 갈 계획이다.",
                "c03": "그림: 곧 일어나겠다고 한다.",
                "c04": "그림: 조깅하러 갈 것인지 묻는다.",
            },
        ),
        **C(
            "u02:checkup",
            {
                "c01": "그림: 어제 바닷가에 있었는지 묻는다. 대답은 그렇다.",
                "c02": "그림: 바닷가에서 공놀이를 했다.",
                "c03": "그림: 수영을 했는지 묻는다.",
                "c04": "그림: 수영한 일을 떠올리며 그렇다고 답한다.",
            },
        ),
        **C(
            "u01:checkup",
            {
                "c01": "그림: 축구 경기를 보며, 그는 훌륭한 축구 선수이다.",
                "c02": "그림: 축구를 잘하는지 묻는다. 대답은 그렇다.",
                "c03": "그림: 넘어진 남자아이를 본다. Zack은 축구를 잘하지 못한다.",
            },
        ),
        **C(
            "u06:checkup",
            {
                "c01": "그림: 엄마가 Zack에게 이 상자를 열면 안 된다고 한다.",
                "c02": "그림: Zack이 아빠에게 상자를 열어도 되는지 묻는다.",
                "c03": "그림: 열어도 되지만 조심해야 한다.",
                "c04": "그림: 여자아이는 자기 선물이라고 하고, Zack은 자기 선물임이 틀림없다고 한다.",
            },
        ),
        **C(
            "u06:writing",
            {
                "a01": "그림: Junho와 통화하고 싶다. 상대가 전화를 받는다.",
                "a02": "그림: 콘서트에 가도 되는지 묻고, 가도 된다.",
                "a03": "그림: 이 바나나를 먹어도 되는지 묻고, 된다.",
                "a04": "그림: 도와드려도 되는지 묻는다. 상대는 모자를 찾고 있다.",
                "a05": "그림: 이 치마를 사도 되는지 묻고, 된다. 치마가 예뻐 보인다.",
            },
        ),
        **C(
            "u05:checkup",
            {
                "c01": "그림: 만화책을 읽어도 되는지 묻는다. 지금은 안 된다. 내가 읽는 중이다.",
                "c02": "그림: Snowie와 놀 것이다.",
                "c03": "그림: 그는 내 공을 잡지 못했다. 같이 놀자고 해도 지금은 안 된다.",
                "c04": "그림: 미안하다. Snowie는 내 공을 잡을 수 있다.",
            },
        ),
        **C(
            "u05:writing",
            {
                "a01": "그림: 이 책상을 옮겨 달라고 부탁한다.",
                "a02": "그림: 창문을 열어 달라고 부탁한다.",
                "a03": "그림: 음식을 좀 달라고 부탁한다.",
                "a04": "그림: 수건을 건네 달라고 부탁한다.",
                "a05": "그림: 내 개를 찾아 달라고 부탁한다.",
                "a06": "그림: 같이 배드민턴을 치자고 부탁한다.",
            },
        ),
    }
)


def has_renderable_image(item: dict) -> bool:
    for key in IMAGE_KEYS:
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return True
    return False


def instruction_text(doc: dict, item: dict) -> str:
    sections = {s.get("id"): s for s in (doc.get("sections") or []) if isinstance(s, dict)}
    sec = sections.get(item.get("section")) or {}
    return "\n".join(
        [
            str(sec.get("instructionKo") or ""),
            str(sec.get("directionKo") or ""),
            str(item.get("sectionInstructionKo") or ""),
            str(item.get("instructionKo") or ""),
            str(item.get("directionKo") or ""),
        ]
    )


def visible_text(item: dict) -> str:
    return "\n".join(str(item.get(k) or "") for k in ("promptEn", "promptKo", "hintKo", "noteKo", "passage"))


def needs_cue(doc: dict, item: dict) -> bool:
    if not isinstance(item, dict):
        return False
    if not PIC_INSTR.search(instruction_text(doc, item)):
        return False
    if has_renderable_image(item):
        return False
    if SCENE_CUE.search(visible_text(item)):
        return False
    return True


def replace_prompt(text: str, item_id: str, old: str, new: str) -> str:
    marker = f'"id": "{item_id}"'
    id_at = text.find(marker)
    if id_at < 0:
        raise SystemExit(f"missing id {item_id}")
    # id is not always the first key. Bound the item object, not the text after id.
    obj_start = text.rfind("\n    {", 0, id_at)
    if obj_start < 0:
        raise SystemExit(f"{item_id}: item object start not found")
    obj_end = text.find("\n    {", id_at)
    if obj_end < 0:
        obj_end = len(text)
    start = obj_start
    region_end = obj_end
    region = text[start:region_end]
    encoded = json.dumps(new, ensure_ascii=False)
    if '"promptEn":' not in region:
        type_at = region.find('"type":')
        if type_at < 0:
            raise SystemExit(f"{item_id}: no type field to attach promptEn")
        line_end = region.find("\n", type_at)
        if line_end < 0:
            raise SystemExit(f"{item_id}: type line has no newline")
        region = region[:line_end] + '\n      "promptEn": ' + encoded + "," + region[line_end:]
        return text[:start] + region + text[region_end:]
    needle = '"promptEn": ' + json.dumps(old, ensure_ascii=False)
    repl = '"promptEn": ' + encoded
    count = region.count(needle)
    if count != 1:
        raise SystemExit(f"{item_id}: promptEn match count {count}")
    region = region.replace(needle, repl, 1)
    return text[:start] + region + text[region_end:]


def leak_problems(rel: str, item: dict, prompt: str) -> list[str]:
    """chunilmun1 type-in cards must not show a single-word accept in the prompt."""
    if "chunilmun1/" not in rel.replace("\\", "/"):
        return []
    if item.get("type") != "fill" or item.get("displayOnly"):
        return []
    if item.get("answerMode") != "words":
        return []
    acc = (item.get("accept") or [None])[0]
    if not acc or "|" in str(acc) or " " in str(acc).strip():
        return []
    word = str(acc).strip()
    if len(word) < 3:
        return []
    if re.search(rf"\b{re.escape(word)}\b", prompt, re.I):
        return [f"{rel} {item.get('id')}: cue leaks accept token {word}"]
    return []


def main() -> None:
    missing = []
    changed = 0
    problems = []
    for root, _dirs, files in os.walk(DATA):
        for name in sorted(files):
            if not name.endswith(".json"):
                continue
            path = os.path.join(root, name)
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            doc = json.loads(text)
            if not isinstance(doc, dict) or "practiceId" not in doc:
                continue
            pid = str(doc.get("practiceId"))
            rel = os.path.relpath(path, ROOT)
            file_changed = False
            for item in doc.get("items") or []:
                if not needs_cue(doc, item):
                    continue
                key = (pid, str(item.get("id")))
                cue = CUES.get(key)
                if not cue:
                    missing.append(f"{pid} {item.get('id')}")
                    continue
                old = str(item.get("promptEn") or "")
                if old.startswith(cue):
                    continue
                new = cue + ("\n" + old if old else "")
                problems.extend(leak_problems(rel, item, new))
                text = replace_prompt(text, str(item.get("id")), old, new)
                item["promptEn"] = new
                file_changed = True
                changed += 1
            if file_changed:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(text)
    if missing:
        print("MISSING CUES", len(missing))
        for row in missing:
            print(" -", row)
        sys.exit(1)
    if problems:
        print("LEAKS")
        for row in problems:
            print(" -", row)
        sys.exit(1)
    print(f"updated {changed} prompts")


if __name__ == "__main__":
    main()
