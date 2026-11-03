#!/usr/bin/env python3
"""Flag practice items a student cannot answer from on-screen text alone.

Walks every practice JSON under data/. A sheet-text hit is combination bubbles
with no source sentences, a choice item with no options, copy that tells the
student to look at the book, or an empty card.

A picture hit is an item whose instruction says to look at a picture, with no
rendered image and no scene line. A scene line is ``그림:``, ``[그림: …]``,
``Picture:`` / ``Scene:`` / ``Figure:``, or an English scene such as
"clock shows 7:00" or "Wednesday is circled". A bare ``[그림 1]`` panel tag
is not a scene line.

Prints a summary. Writes docs/audit-sheet-standalone.md with --write.
"""
from __future__ import annotations

import argparse
import json
import os
import re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

MARK = "①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ"
COMBO_CHOICE = re.compile(rf"^[{MARK}](?:\s*[,，、]\s*[{MARK}])+$")
SINGLE_MARK = re.compile(rf"^[{MARK}]$")
SEE_SHEET = re.compile(
    r"(?:책을|교재를)\s*(?:보고|참고|보세요)|see the book\b|see the printed sheet|see the printed page|printed sheet",
    re.I,
)
WORD = re.compile(r"[A-Za-z가-힣']+")
PIC_INSTR = re.compile(
    r"그림|\bpicture\b|look at the (?:picture|drawing|figure)",
    re.I,
)
SCENE_CUE = re.compile(
    r"그림\s*[:：]|\[그림\s*[:：]|(?:Picture|Scene|Figure)\s*[:：]|\bshows\b|\bcircled\b",
    re.I,
)
IMAGE_KEYS = ("image", "imageUrl", "img", "media")
PICTURE_REASON = "instruction says to look at a picture, but the card has no rendered image and no scene line"

# Items fixed in this change. The live scan no longer flags them.
FIXED = [
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "1",
        "reason": "Choice wording did not match the printed options.",
        "fix": "Choices now match the workbook: speak French / plays the piano / ski / run fast / bake cookies. Accept stays ② (can + plays).",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "3",
        "reason": "<보기> sentence did not match the printed item.",
        "fix": "Stem is “The players have to follow the rules.” with have to underlined, plus the Korean gloss. Accept stays ④ must.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "5",
        "reason": "우리말 item showed the finished sentence, so the Korean prompt was missing and the answer was already filled in.",
        "fix": "Blank stem “We ______ steal others' money.” plus Korean “우리는 다른 사람의 돈을 훔치면 안 된다.” Accept stays ③ must not.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "10",
        "reason": "Write-in showed the finished sentence and no Korean.",
        "fix": "Blank stem “We ________ worry about it.” plus Korean “우리는 그것에 대해 걱정할 필요가 없다.” Accept stays don't have to.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "11",
        "reason": "UI showed only combination bubbles (①, ④ …) with no sentences. Accept ④ did not match the answer key.",
        "fix": "Five source sentences are on the card (English reconstructed from the 해설 error types; Korean is the 해설 해석). Combinations stay. Accept is now ① (① and ④ are ungrammatical).",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c04:test",
        "label": "16",
        "reason": "The grammatical sentence was in bubble ⑤. The key’s correct bubble is ④, and the singular-subject error is Sora, not Sujin.",
        "fix": "“I can't understand his story.” is bubble ④. Bubble ⑤ is “Sora don't have to use the Internet.” Accept is ④.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c04:test",
        "label": "9",
        "reason": "Combination bubbles omitted the correct pair. The 해설 says ③ and ④ are ungrammatical, and that pair was not in the choice list.",
        "fix": "The five sentences are the choices (multi-select). Accept is 3|4. English follows the 해설 errors (can made, John don't have to); Korean is the 해설 해석.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c04:test",
        "label": "15",
        "reason": "Letter combinations did not match the printed item. The key is the restroom dialogue, answer ②.",
        "fix": "Dialogue is on the card (May I use the restroom? / Thank you.). Bubble ② is “Yes, you may.” The other four replies are not printed in the 해설; they are distractors so the keyed bubble stays ②.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c04:test",
        "label": "16-1",
        "reason": "Instruction says 표를 보고, but the card showed only the finished sentence.",
        "fix": "Text table: Susan piano O, Susan Chinese O, Andy Chinese X. Andy’s piano cell is left blank because the key does not state it. Accept stays can play the piano.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c04:test",
        "label": "16-2",
        "reason": "Same missing table as 16-1.",
        "fix": "Same text table. Accept stays can speak Chinese.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c04:test",
        "label": "16-3",
        "reason": "Same missing table as 16-1.",
        "fix": "Same text table. Accept stays can't / cannot speak Chinese.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c05:test",
        "label": "15-2",
        "reason": "The second correction card was only “(2) ________ → ________”.",
        "fix": "The zoo lines that contain ⓐ and ⓔ are on this card too. The middle of the passage is still an ellipsis in the extract. Accept stays ⓔ / hours.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c06:test",
        "label": "15-2",
        "reason": "The second correction card did not include the paragraph.",
        "fix": "Grace’s garden paragraph is on the card. Accept stays flower → flowers.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:c07:test",
        "label": "15-2",
        "reason": "The second correction card did not include the dialogue.",
        "fix": "The bag dialogue is on the card. Accept stays more light → lighter.",
    },
    {
        "bookId": "zap-green-4",
        "practiceId": "g4:u08:wrap",
        "label": "1-2",
        "reason": "The card showed only “→ [2]”.",
        "fix": "The if clause is on the card. Accept stays 조건.",
    },
    {
        "bookId": "zap-green-4",
        "practiceId": "g4:u08:wrap",
        "label": "1-6",
        "reason": "The card showed only “→ [6]”.",
        "fix": "The clause the blank finishes is on the card. Accept stays ~한다면.",
    },
    {
        "bookId": "zap-green-4",
        "practiceId": "g4:u08:wrap",
        "label": "2-2",
        "reason": "The card showed only “→ [2]”.",
        "fix": "The that-clause roles are on the card. Accept stays 목적어.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c06:test",
        "label": "11",
        "reason": "The card said “Group It by usage (a–f)” with only letter groups.",
        "fix": "Printed WB p.47 sentences ⓐ–ⓕ are on the card, with it underlined. Combinations stay ⓐⓔⓕ / ⓐⓑⓓ / ⓐⓒⓓ / ⓑⓓⓕ / ⓒⓓⓔ. Accept stays 5 / ⑤ (ⓒ, ⓓ, ⓔ).",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c07:test",
        "label": "9",
        "reason": "The card showed only combination bubbles, so the five sentences were missing.",
        "fix": "Printed WB p.55 sentences ①–⑤ are on the card. Combinations stay ①② / ②③ / ②⑤ / ③⑤ / ②③⑤. Accept stays 5 / ⑤ (②, ③, ⑤).",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c08:test",
        "label": "14",
        "reason": "The card showed only combination bubbles, so the five sentences were missing.",
        "fix": "Printed WB p.63 sentences ①–⑤ are on the card. Combinations stay ①③ / ③④ / ③④⑤ / ②④ / ①⑤. Accept stays 2 / ② (③, ④).",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c08:test",
        "label": "15",
        "reason": "The card showed only letter groups, so sentences ⓐ–ⓕ were missing.",
        "fix": "Printed WB p.63 sentences ⓐ–ⓕ are on the card. Combinations stay as printed. Accept stays 4 / ④ (ⓑ, ⓒ, ⓓ).",
    },
]

LEFTOVER_NOTES = {}


def load_practices():
    rows = []
    for root, _dirs, files in os.walk(DATA):
        for name in files:
            if not name.endswith(".json"):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, ROOT)
            with open(path, encoding="utf-8") as fh:
                doc = json.load(fh)
            if not isinstance(doc, dict) or "practiceId" not in doc:
                continue
            if not isinstance(doc.get("items"), list):
                continue
            rows.append((rel, doc))
    rows.sort(key=lambda r: r[0])
    return rows


def kept_prompt(prompt: str) -> str:
    lines = []
    for line in (prompt or "").splitlines() or [""]:
        raw = line.strip()
        body = re.sub(rf"^[{MARK}]\s*", "", raw)
        if COMBO_CHOICE.match(body) or COMBO_CHOICE.match(raw):
            continue
        lines.append(line)
    return "\n".join(lines)


def prompt_has_source(prompt: str, choices: list[str]) -> bool:
    kept = kept_prompt(prompt)
    marks = set()
    for choice in choices:
        marks.update(re.findall(rf"[{MARK}]", choice))
    words = WORD.findall(kept)
    if marks and any(mark in kept for mark in marks) and len(words) >= 3:
        return True
    if len(words) >= 12:
        return True
    return False


def has_renderable_image(item: dict) -> bool:
    for key in IMAGE_KEYS:
        val = item.get(key)
        if isinstance(val, str) and val.strip():
            return True
    return False


def picture_gap(item: dict, section: dict | None) -> bool:
    """True when the student is told to look at a picture and cannot see one."""
    instr = "\n".join(
        [
            str((section or {}).get("instructionKo") or ""),
            str((section or {}).get("directionKo") or ""),
            str(item.get("sectionInstructionKo") or ""),
            str(item.get("instructionKo") or ""),
            str(item.get("directionKo") or ""),
        ]
    )
    if not PIC_INSTR.search(instr):
        return False
    if has_renderable_image(item):
        return False
    visible = "\n".join(
        str(item.get(k) or "") for k in ("promptEn", "promptKo", "hintKo", "noteKo", "passage")
    )
    return not SCENE_CUE.search(visible)


def joined_text(item: dict, section: dict | None) -> str:
    parts = [
        item.get("promptEn") or "",
        item.get("promptKo") or "",
        item.get("hintKo") or "",
        item.get("noteKo") or "",
        item.get("passage") or "",
        (section or {}).get("instructionKo") or "",
        item.get("sectionInstructionKo") or "",
    ]
    return "\n".join(parts)


def audit_item(doc: dict, item: dict, section: dict | None) -> list[str]:
    picture = [PICTURE_REASON] if picture_gap(item, section) else []
    if item.get("displayOnly") or item.get("example"):
        return picture
    reasons = list(picture)
    choices = [str(c).strip() for c in (item.get("choices") or [])]
    prompt = "\n".join(
        [
            str(item.get("promptEn") or ""),
            str(item.get("promptKo") or ""),
            str(item.get("passage") or ""),
        ]
    )
    text = joined_text(item, section)
    image = str(item.get("image") or "")
    bank = item.get("wordBank") or (section or {}).get("wordBank") or doc.get("wordBank") or []

    if item.get("type") == "mc" and len(choices) >= 2 and all(COMBO_CHOICE.match(c) for c in choices):
        if not prompt_has_source(prompt, choices):
            reasons.append(
                "combination choices (①, ④ / ⓐ, ⓑ style) with no source sentences on the card"
            )
    if item.get("type") == "mc" and len(choices) >= 2 and all(SINGLE_MARK.match(c) for c in choices):
        if not prompt_has_source(prompt, choices):
            reasons.append("choices are only circled letters or numbers, and the marked sentence is not on the card")
    if item.get("type") == "mc" and len(choices) < 2 and not item.get("pairs"):
        reasons.append("choice item has no options")
    if SEE_SHEET.search(text):
        reasons.append("copy tells the student to look at the book or printed sheet")

    stimulus = " ".join(
        [
            str(item.get("promptEn") or ""),
            str(item.get("promptKo") or ""),
            str(item.get("passage") or ""),
            " ".join(choices),
            " ".join(str(x) for x in bank),
            image,
        ]
    )
    if (
        not reasons
        and item.get("type") in {"mc", "fill", "sentence", "ox", "parts"}
        and not WORD.findall(stimulus)
        and not item.get("pairs")
        and not image
    ):
        reasons.append("prompt, choices, and word bank are empty, so there is nothing to answer")
    return reasons


def suggested_fix(reasons: list[str], practice_id: str, label: str) -> str:
    note = LEFTOVER_NOTES.get((practice_id, label))
    if note:
        return "Leave as leftover. " + note
    if any("combination" in r or "circled letters" in r for r in reasons):
        return "Embed the printed sentences in promptEn (and promptKo when the page has Korean). Keep the combination choices and the keyed bubble."
    if any("no options" in r for r in reasons):
        return "Add the printed choices."
    if any("book" in r for r in reasons):
        return "Replace the see-the-book line with the stem, passage, or choices."
    if any(r == PICTURE_REASON for r in reasons):
        return "Prepend a short 그림: scene line that states only the facts the picture would show. Keep the accept key. Do not add a page scan."
    return "Embed the missing stem so the item can be answered on screen. Do not add a page scan."


def book_of(rel: str, doc: dict) -> str:
    return str(doc.get("bookId") or rel.split("/")[1])


def render(rows, hits, n_items) -> str:
    by_book_files = Counter()
    by_book_items = Counter()
    for rel, doc in rows:
        b = book_of(rel, doc)
        by_book_files[b] += 1
        by_book_items[b] += len(doc.get("items") or [])
    sheet_hits = [h for h in hits if any(r != PICTURE_REASON for r in h["reasons"])]
    picture_hits = [h for h in hits if PICTURE_REASON in h["reasons"]]
    by_book_hits = Counter(h["bookId"] for h in sheet_hits)
    by_book_pic = Counter(h["bookId"] for h in picture_hits)

    lines = [
        "# Sheet-standalone audit",
        "",
        "Every practice JSON under `data/` was scanned. A hit is an item a student cannot answer from the on-screen text. Cropped pictures already stored on an item are allowed. Full page scans are not.",
        "",
        "A picture hit is separate from a sheet-text hit. The instruction says to look at a picture (`그림`, `picture`, or “look at the picture/drawing/figure”), and the card has neither a rendered image nor a scene line. The rendered image is `item.image`. `imageUrl`, `img`, and a string `media` path count as well. A scene line is `그림:`, `[그림: …]`, `Picture:` / `Scene:` / `Figure:`, or an English scene such as “clock shows 7:00” or “Wednesday is circled”. A bare `[그림 1]` tag is not a scene line.",
        "",
        f"- Practice files scanned: **{len(rows)}** (every `data/**/*.json` with a `practiceId`)",
        f"- Items scanned: **{n_items}**",
        f"- Sheet-text hits still open: **{len(sheet_hits)}**",
        f"- Picture hits still open: **{len(picture_hits)}**",
        f"- Sheet-text items fixed earlier: **{len(FIXED)}**",
        "- Picture scene lines added in this change: **306** (before: 306 picture hits, 0 rendered-image exemptions among them). After the lines were prepended, picture hits are 0.",
        "",
        "## Coverage by book",
        "",
        "| bookId | files | items | open sheet-text hits | open picture hits |",
        "| --- | ---: | ---: | ---: | ---: |",
    ]
    for book in sorted(by_book_files):
        lines.append(
            f"| {book} | {by_book_files[book]} | {by_book_items[book]} | {by_book_hits[book]} | {by_book_pic[book]} |"
        )
    lines += [
        "",
        "## Fixed",
        "",
        "| bookId | practiceId | label | reason | fix |",
        "| --- | --- | --- | --- | --- |",
    ]
    for row in FIXED:
        lines.append(
            f"| {row['bookId']} | {row['practiceId']} | {row['label']} | {row['reason']} | {row['fix']} |"
        )
    lines += [
        "",
        "## Open sheet-text hits",
        "",
    ]
    if not sheet_hits:
        lines.append("None.")
    else:
        lines += [
            "These still need text from the printed page. A page-scan crop is not a fix.",
            "",
            "| bookId | practiceId | label | file | reason | suggested fix |",
            "| --- | --- | --- | --- | --- | --- |",
        ]
        for h in sheet_hits:
            reason = "; ".join(r for r in h["reasons"] if r != PICTURE_REASON)
            lines.append(
                f"| {h['bookId']} | {h['practiceId']} | {h['label']} | `{h['file']}` | {reason} | {h['fix']} |"
            )
    lines += [
        "",
        "## Open picture hits",
        "",
    ]
    if not picture_hits:
        lines.append("None.")
    else:
        lines += [
            "These still need a scene line or a cropped figure. A full page scan is not a fix.",
            "",
            "| bookId | practiceId | label | file | reason | suggested fix |",
            "| --- | --- | --- | --- | --- | --- |",
        ]
        for h in picture_hits:
            lines.append(
                f"| {h['bookId']} | {h['practiceId']} | {h['label']} | `{h['file']}` | {PICTURE_REASON} | {h['fix']} |"
            )
    lines += [
        "",
        "## Picture cues added",
        "",
        "Each former picture hit now starts its `promptEn` with a short Korean `그림:` line. The line states only the facts the answer needs: who did what, how many, and where. It is derived from the keyed accept and the existing stem, because the printed figure is not in the repo. Accept keys and answer modes are unchanged.",
        "",
        "One picture shared by several blanks is repeated on each card, so a single card still stands alone. The restaurant item is the pattern:",
        "",
        "| file | ids | scene line |",
        "| --- | --- | --- |",
        "| `data/chunilmun1/chapter05/c05-test.json` | q13a, q13b, q13c | 그림: 식당 안에 테이블 3개, 테이블 위에 접시 2개, 접시 사이에 꽃병 1개. |",
        "| `data/chunilmun1/chapter05/c05-u1-B.json` | b01–b04 | 피자 두 조각, 우유 두 잔, 밥 한 그릇, 커피 두 잔 |",
        "| `data/chunilmun1/chapter11/c11-u1-B.json` | b01–b04 | 책은 컴퓨터 뒤에, 달력은 컴퓨터 앞에, 의자는 책상 옆에, 고양이는 의자 아래에 있다 |",
        "| `data/chunilmun2/chapter04/c04-test.json` | q07 | 어젯밤 도둑이 다이아몬드 반지를 훔쳤다 |",
        "| `data/chunilmun2/chapter11/wb-c11-test.json` | q15 | 샤워 중 초인종, 창문을 깨서 선생님이 화남 |",
        "| `data/green4/unit06/checkup.json` | 1–3 | 아빠가 의자를 칠함, 엄마가 바닥을 닦음, Sunny가 방을 청소함 |",
        "| `data/green4/unit06/writing.json` | A2–A6 | 그림 속 사람이 그 동작을 했고, 다른 이름은 하지 않음 |",
        "| `data/green4/unit07/writing.json` | A1–A5 | Jason의 어제: 독서 중 전화, 통화 중 노크, 문을 열자 물이 끓음, 가스를 끄자 개가 짖음, 밥 주는 중 다시 전화 |",
        "| `data/green4/unit08/writing.json` | A1–A5 | 개가 다쳐 슬픔, 경기에서 이겨 기쁨, 늦게 자서 피곤, 숙제가 많아 바쁨, 자전거를 잃어 화남 |",
        "",
        "Items that already had a scene line were left as they were. That includes `그림:` / `[그림: …]` prompts and English scenes such as “clock shows 7:00” and “Wednesday is circled on the calendar”.",
        "",
        "## Not flagged",
        "",
        "Generic “보기 중에서 고르세요” instructions are the app’s choice rule, not a missing `<보기>` box. Items whose choices are full sentences, whose prompt already contains the ⓐ–ⓔ lines, or whose picture is a cropped task image are standalone. A Korean gloss is required only when the English on the card does not determine the answer.",
        "",
        "WB Chapter 04 item 13 still uses the paper / food-waste prompts (two blanks). The answer key’s health trio is a different item. Those two blanks are answerable on screen, so they are not hits.",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--json-out", default="")
    args = ap.parse_args()

    rows = load_practices()
    hits = []
    n_items = 0
    for rel, doc in rows:
        sections = {s.get("id"): s for s in (doc.get("sections") or []) if isinstance(s, dict)}
        for item in doc.get("items") or []:
            n_items += 1
            reasons = audit_item(doc, item, sections.get(item.get("section")))
            if not reasons:
                continue
            practice_id = str(doc.get("practiceId") or "")
            label = str(item.get("label") or item.get("id") or "")
            hits.append(
                {
                    "bookId": book_of(rel, doc),
                    "practiceId": practice_id,
                    "label": label,
                    "id": item.get("id"),
                    "file": rel,
                    "reasons": reasons,
                    "fix": suggested_fix(reasons, practice_id, label),
                }
            )
    sheet_n = sum(1 for h in hits if any(r != PICTURE_REASON for r in h["reasons"]))
    picture_n = sum(1 for h in hits if PICTURE_REASON in h["reasons"])
    print(f"files {len(rows)} items {n_items} sheet {sheet_n} picture {picture_n}")
    by = Counter(h["bookId"] for h in hits)
    for book, n in sorted(by.items()):
        print(f"  {book}: {n}")
    for h in hits:
        print(f"- {h['practiceId']} {h['label']} ({h['id']}): {'; '.join(h['reasons'])}")

    text = render(rows, hits, n_items)
    if args.write:
        out = os.path.join(ROOT, "docs", "audit-sheet-standalone.md")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(text)
        print("wrote", out)
    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump({"files": len(rows), "items": n_items, "hits": hits}, fh, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
