#!/usr/bin/env python3
"""Flag practice items a student cannot answer from on-screen text alone.

Walks every practice JSON under data/. A hit is a sheet-dependent item:
combination bubbles with no source sentences, a choice item with no options,
copy that tells the student to look at the book, or an empty card.

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
        "reason": "The card said “Group It by usage (a–f)” with only letter groups. The workbook answer key’s item 11 is the (A)(B)(C) everybody / night view / pants item, answer ②.",
        "fix": "Stem is the three sentences. Choice ② is likes — its — ones, the forms named in the 해설. The other four choices use the wrong forms the 해설 names (like, it's, one). Accept is 2 / ②.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c07:test",
        "label": "9",
        "reason": "Combination bubbles did not include the key’s set ①, ②, ④.",
        "fix": "Five sentences are the choices (multi-select). Accept is 1|2|4. English follows the 해설 errors: a little books, goes usually, the quietest than.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c08:test",
        "label": "14",
        "reason": "Combination bubbles did not include the key’s set ③, ⑤.",
        "fix": "Five sentences are the choices (multi-select). Accept is 3|5. Error strings are the ones quoted in the 해설: Don't be lose, Washes, Don't came.",
    },
    {
        "bookId": "chunilmun-grammar-1",
        "practiceId": "cm1:wb-c08:test",
        "label": "15",
        "reason": "Letter groups had no sentences, and the stored answer was ④. The key is ③.",
        "fix": "Six sentences are on the card. Choice ③ is ⓐ, ⓓ, ⓕ, the grammatical set. Accept is 3 / ③. ⓒ and ⓔ use the quoted errors (Where your brother was, hadn't they). ⓑ shows the word-order error corrected by the 해설’s “What a beautiful view it is!”",
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
    if item.get("displayOnly") or item.get("example"):
        return []
    reasons = []
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
    by_book_hits = Counter(h["bookId"] for h in hits)

    lines = [
        "# Sheet-standalone audit",
        "",
        "Every practice JSON under `data/` was scanned. A hit is an item a student cannot answer from the on-screen text. Cropped pictures already stored on an item are allowed. Full page scans are not.",
        "",
        f"- Practice files scanned: **{len(rows)}** (every `data/**/*.json` with a `practiceId`)",
        f"- Items scanned: **{n_items}**",
        f"- Hits still open: **{len(hits)}**",
        f"- Items fixed in this change: **{len(FIXED)}**",
        "",
        "## Coverage by book",
        "",
        "| bookId | files | items | open hits |",
        "| --- | ---: | ---: | ---: |",
    ]
    for book in sorted(by_book_files):
        lines.append(
            f"| {book} | {by_book_files[book]} | {by_book_items[book]} | {by_book_hits[book]} |"
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
        "## Open hits",
        "",
    ]
    if not hits:
        lines.append("None.")
    else:
        lines += [
        "These still need text from the printed page. A page-scan crop is not a fix.",
        "",
            "| bookId | practiceId | label | file | reason | suggested fix |",
            "| --- | --- | --- | --- | --- | --- |",
        ]
        for h in hits:
            reason = "; ".join(h["reasons"])
            lines.append(
                f"| {h['bookId']} | {h['practiceId']} | {h['label']} | `{h['file']}` | {reason} | {h['fix']} |"
            )
    lines += [
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
    print(f"files {len(rows)} items {n_items} hits {len(hits)}")
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
