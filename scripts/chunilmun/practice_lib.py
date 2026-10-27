"""Build 천일문 Grammar 1 practice JSON (sectionsVersion 2)."""
from __future__ import annotations

import json
import os
import re
from typing import Any

BOOK = {
    "bookId": "chunilmun-grammar-1",
    "bookTitle": "천일문 GRAMMAR LEVEL 1",
    "appName": "천일문 Grammar 1",
}

MODE_TAG = {
    "choice": "Choose · 고르기",
    "words": "Words only · 빈칸 말만",
    "sentence": "Full sentence · 문장 전체",
    "match": "Match · 짝 맞추기",
}


def _intro(sections: list[dict]) -> str:
    parts = []
    for s in sections:
        n = s["itemCount"]
        mode = s["answerMode"]
        if mode == "choice":
            kind = "고르기"
        elif mode == "sentence":
            kind = "문장 전체 쓰기"
        else:
            kind = "빈칸 말만 쓰기"
        parts.append(f"{s['title']} {n}문항({kind})")
    return "이 연습은 " + ", ".join(parts) + "으로 되어 있어요."


def build_practice(
    *,
    practice_id: str,
    title: str,
    subtitle: str,
    pages: str,
    timer_minutes: int,
    unit_id: str,
    unit_title: str,
    sections: list[dict],
    items: list[dict],
    test_id: str | None = None,
    test_title: str | None = None,
) -> dict:
    doc: dict[str, Any] = {
        **BOOK,
        "practiceId": practice_id,
        "title": title,
        "subtitle": subtitle,
        "pages": pages,
        "timerMinutes": timer_minutes,
        "unitId": unit_id,
        "unitTitle": unit_title,
        "sectionsVersion": 2,
        "introKo": _intro(sections),
        "sections": sections,
        "items": items,
    }
    if test_id:
        doc["testId"] = test_id
        doc["testTitle"] = test_title or "Chapter Test"
        doc["passPct"] = 80
        doc["retryBelowPct"] = 50
        doc["showAnswersToStudent"] = False
    return doc


def section(
    sid: str,
    title: str,
    direction_ko: str,
    rule_ko: str,
    answer_mode: str,
    labels: list[str],
    point: str = "",
    word_bank: list[str] | None = None,
) -> dict:
    instr = direction_ko
    if point:
        instr = f"{direction_ko} {point}."
    instr = f"{instr} {rule_ko}"
    sec: dict[str, Any] = {
        "id": sid,
        "title": title,
        "instructionKo": instr.strip(),
        "directionKo": direction_ko + (f" {point}." if point else ""),
        "ruleKo": rule_ko,
        "answerMode": answer_mode,
        "answerModeTag": MODE_TAG.get(answer_mode, answer_mode),
        "itemCount": len(labels),
        "exampleCount": 0,
        "labels": labels,
    }
    if word_bank:
        sec["wordBank"] = word_bank
    return sec


def fill_item(
    *,
    iid: str,
    sec: dict,
    label: str,
    accept: list[str],
    prompt_en: str = "",
    prompt_ko: str = "",
    blanks: int = 1,
    blank_labels: list[str] | None = None,
) -> dict:
    it: dict[str, Any] = {
        "id": iid,
        "section": sec["id"],
        "sectionTitle": sec["title"],
        "sectionInstructionKo": sec["instructionKo"],
        "answerMode": sec["answerMode"],
        "answerModeTag": sec["answerModeTag"],
        "label": label,
        "type": "fill",
        "promptEn": prompt_en,
        "blanks": blanks,
        "accept": accept,
    }
    if prompt_ko:
        it["promptKo"] = prompt_ko
    if blank_labels:
        it["blankPartLabels"] = blank_labels
    return it


def mc_item(
    *,
    iid: str,
    sec: dict,
    label: str,
    choices: list[str],
    answer_index: int,
    prompt_en: str = "",
) -> dict:
    circled = ["①", "②", "③", "④", "⑤"]
    ans = str(answer_index)
    ans_circ = circled[answer_index - 1]
    return {
        "id": iid,
        "section": sec["id"],
        "sectionTitle": sec["title"],
        "sectionInstructionKo": sec["instructionKo"],
        "answerMode": "choice",
        "answerModeTag": MODE_TAG["choice"],
        "label": label,
        "type": "mc",
        "promptEn": prompt_en,
        "choices": choices,
        "accept": [ans, ans_circ],
        "answer": ans,
    }


def match_item(
    *,
    iid: str,
    sec: dict,
    label: str,
    pairs: list[dict[str, str]],
    prompt_ko: str = "",
) -> dict:
    accept = [f"{p['left']}|{p['right']}" for p in pairs]
    it: dict[str, Any] = {
        "id": iid,
        "section": sec["id"],
        "sectionTitle": sec["title"],
        "sectionInstructionKo": sec["instructionKo"],
        "answerMode": "match",
        "answerModeTag": MODE_TAG["match"],
        "label": label,
        "type": "match",
        "pairs": pairs,
        "accept": accept,
    }
    if prompt_ko:
        it["promptKo"] = prompt_ko
    return it


def choose_all_item(
    *,
    iid: str,
    sec: dict,
    label: str,
    prompt_en: str,
    accept_pairs: list[tuple[str, str]],
) -> dict:
    accept = []
    for a, b in accept_pairs:
        accept.append(f"{a}|{b}")
        accept.append(f"{b}|{a}")
    return {
        "id": iid,
        "section": sec["id"],
        "sectionTitle": sec["title"],
        "sectionInstructionKo": sec["instructionKo"],
        "answerMode": "words",
        "answerModeTag": MODE_TAG["words"],
        "label": label,
        "type": "fill",
        "promptEn": prompt_en,
        "blanks": 2,
        "blankPartLabels": ["보기", "보기"],
        "unordered": True,
        "accept": accept,
    }


def sent_item(
    *,
    iid: str,
    sec: dict,
    label: str,
    prompt_en: str,
    accept: list[str],
    prompt_ko: str = "",
) -> dict:
    it = fill_item(
        iid=iid,
        sec=sec,
        label=label,
        accept=accept,
        prompt_en=prompt_en,
        prompt_ko=prompt_ko,
        blanks=0,
    )
    it["type"] = "sentence"
    it["answerMode"] = "sentence"
    it["answerModeTag"] = MODE_TAG["sentence"]
    it.pop("blanks", None)
    return it


def write_practice(rel_path: str, doc: dict) -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "..")
    fp = os.path.join(root, rel_path)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")


def labels_az(prefix: str, n: int) -> list[str]:
    return [f"{prefix}{i}" for i in range(1, n + 1)]


def labels_num(n: int, start: int = 1) -> list[str]:
    return [str(i) for i in range(start, start + n)]
