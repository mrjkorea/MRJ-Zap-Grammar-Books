#!/usr/bin/env python3
"""Deeper sheet-standalone audit for the Zap lanes.

Extends scripts/audit-sheet-standalone.py with the classes that audit misses:

  S6  prompt points at a passage or box that is not on the card
  S7  stem is elided (… or ...) so the needed text is not shown
  S8  choice item whose keyed answer cannot be given (letter-only accept,
      accept text not among the choices, placeholder choices)
  S9  write-in item whose stem is only a number or a label and there is no
      word bank to pick from
  S10 multi-card correction item that only shows "(2) …"
  S11 duplicate / placeholder choices

Run: python3 scripts/audit-sheet-standalone-v2.py [--json out.json] [--book green4]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

MARK = "①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙ"
COMBO = re.compile(rf"^[{MARK}](?:\s*[,，、]\s*[{MARK}])+$")
SINGLE_MARK = re.compile(rf"^[{MARK}]$")
WORD = re.compile(r"[A-Za-z가-힣']+")
PIC_INSTR = re.compile(r"그림|\bpicture\b|look at the (?:picture|drawing|figure)", re.I)
SCENE_CUE = re.compile(r"그림\s*[:：]|\[그림\s*[:：]|(?:Picture|Scene|Figure)\s*[:：]|\bshows\b|\bcircled\b", re.I)
SEE_SHEET = re.compile(r"(?:책을|교재를)\s*(?:보고|참고|보세요)|see the book\b|see the printed sheet|see the printed page|printed sheet", re.I)
PASSAGE_REF = re.compile(r"위\s*지문|위\s*글|본문|앞의\s*글|앞\s*지문|the passage above|the text above|the dialogue above|위\s*대화")
PLACEHOLDER_CHOICE = {"wrong", "quickly", "tbd", "todo", "n/a"}
BARE_LABEL = re.compile(r"^(?:단어|문장|보기)?\s*[\d]{1,3}\s*[.)]?\s*$")
MULTI_CARD_TAIL = re.compile(r"^\s*\(\s*2\s*\)|\(\s*2\s*\)\s*기호|위\s*지문")
LETTER_ACCEPT = re.compile(r"^[a-eA-E]$")


def load(book_filter=None):
    rows = []
    for root, _d, files in os.walk(DATA):
        for name in sorted(files):
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
            if book_filter and f"/{book_filter}/" not in rel:
                continue
            rows.append((rel, doc))
    rows.sort(key=lambda r: r[0])
    return rows


def kept(prompt):
    out = []
    for line in (prompt or "").splitlines():
        body = re.sub(rf"^[{MARK}]\s*", "", line.strip())
        if COMBO.match(body) or COMBO.match(line.strip()):
            continue
        out.append(line)
    return "\n".join(out)


def prompt_has_source(prompt, choices):
    k = kept(prompt)
    marks = set()
    for c in choices:
        marks.update(re.findall(rf"[{MARK}]", c))
    if marks and any(m in k for m in marks) and len(WORD.findall(k)) >= 3:
        return True
    return len(WORD.findall(k)) >= 12


def image_of(item):
    for key in ("image", "imageUrl", "img"):
        v = item.get(key)
        if isinstance(v, str) and v.strip():
            return v
    return None


def section_of(doc, item):
    for s in doc.get("sections") or []:
        if s.get("id") == item.get("section"):
            return s
    return None


def bank_of(doc, item, sec):
    return (item.get("wordBank") or (sec or {}).get("wordBank") or doc.get("wordBank") or [])


def audit_item(doc, item):
    sec = section_of(doc, item)
    reasons = []
    typ = item.get("type")
    mode = item.get("answerMode")
    choices = [str(c).strip() for c in (item.get("choices") or [])]
    prompt = "\n".join(str(item.get(k) or "") for k in ("promptEn", "promptKo", "passage"))
    instr = "\n".join(str(x or "") for x in (
        (sec or {}).get("instructionKo"), (sec or {}).get("directionKo"),
        item.get("sectionInstructionKo"), item.get("instructionKo"), item.get("directionKo")))
    bank = bank_of(doc, item, sec)
    img = image_of(item)
    pairs = item.get("pairs") or []
    accept = [str(a) for a in (item.get("accept") or [])]
    display_only = bool(item.get("displayOnly") or item.get("example"))

    # ---- house rules -------------------------------------------------
    if PIC_INSTR.search(instr) and not img:
        visible = "\n".join(str(item.get(k) or "") for k in ("promptEn", "promptKo", "hintKo", "noteKo", "passage"))
        if not SCENE_CUE.search(visible):
            reasons.append("S5 picture instruction, no image and no scene line")
    if display_only:
        return reasons
    if typ == "mc" and len(choices) >= 2 and all(COMBO.match(c) for c in choices) and not prompt_has_source(prompt, choices):
        reasons.append("S2 combination choices with no source sentences")
    if typ == "mc" and len(choices) >= 2 and all(SINGLE_MARK.match(c) for c in choices) and not prompt_has_source(prompt, choices):
        reasons.append("S3 choices are only circled marks, marked sentence missing")
    if typ == "mc" and len(choices) < 2 and not pairs:
        reasons.append("S4 choice item has no options")
    if SEE_SHEET.search(prompt + "\n" + instr):
        reasons.append("S1 copy says see the book/sheet")

    stimulus = " ".join([prompt, " ".join(choices), " ".join(str(x) for x in bank), img or ""])
    if typ in {"mc", "fill", "sentence", "ox", "parts"} and not WORD.findall(stimulus) and not pairs and not img:
        reasons.append("S1 prompt, choices and word bank are empty")

    # ---- deeper rules ------------------------------------------------
    p_en = str(item.get("promptEn") or "")
    if PASSAGE_REF.search(p_en) or PASSAGE_REF.search(instr):
        if not re.search(r"[A-Za-z]{4,}.*[.!?]", p_en):
            reasons.append("S6 prompt points at a passage/box that is not on the card")

    # elided stem: an ellipsis inside the visible English that hides content
    for line in p_en.splitlines():
        if ("…" in line or "..." in line) and len(WORD.findall(line)) < 14:
            if not re.search(r"(?i)yes\s*/\s*no", line):
                reasons.append("S7 stem is elided so the needed text is missing")
                break

    if MULTI_CARD_TAIL.search(p_en.strip()) and len(WORD.findall(p_en)) <= 8 and PASSAGE_REF.search(p_en):
        reasons.append("S10 correction card shows only the tail of the passage")

    # choice grading: can the keyed answer be given at all?
    if typ == "mc" and choices:
        ph = {c.lower() for c in choices} & PLACEHOLDER_CHOICE
        if len(ph) >= 2:
            reasons.append("S8 choices are placeholders, not the printed options")
        if item.get("select") != "multi":
            ok = False
            for a in accept:
                if a in choices:
                    ok = True
                    break
                if re.fullmatch(r"\d+", a) and 1 <= int(a) <= len(choices):
                    ok = True
                    break
                if a in MARK and MARK.index(a) < len(choices):
                    ok = True
                    break
            if not ok and accept and all(LETTER_ACCEPT.match(a) for a in accept):
                reasons.append("S8 accept is a letter (a/b/c) that the app cannot grade")
            elif not ok and accept and not reasons:
                reasons.append("S8 keyed answer is not among the choices")
        if len(set(choices)) < len(choices):
            reasons.append("S11 duplicate choices")

    # write-in with only a number or label and no bank
    if typ in {"fill", "sentence"} and p_en.strip() and BARE_LABEL.fullmatch(p_en.strip()) and not bank and not img:
        # red1 number spelling: prompt "7", accept "seven" is answerable
        if not re.fullmatch(r"\d{1,2}", p_en.strip()):
            reasons.append("S9 write-in stem is only a label and no word bank is on the card")

    return reasons


def book_of(rel, doc):
    return str(doc.get("bookId") or rel.split("/")[1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json")
    ap.add_argument("--book")
    args = ap.parse_args()
    rows = load(args.book)
    hits = []
    items_by_book = Counter()
    for rel, doc in rows:
        b = book_of(rel, doc)
        for it in doc["items"]:
            items_by_book[b] += 1
            r = audit_item(doc, it)
            if r:
                hits.append({
                    "bookId": b, "file": rel, "practiceId": doc.get("practiceId"),
                    "title": doc.get("title"), "pages": doc.get("pages"),
                    "id": it.get("id"), "label": it.get("label"),
                    "type": it.get("type"), "mode": it.get("answerMode"),
                    "reasons": r,
                    "prompt": str(it.get("promptEn") or it.get("promptKo") or "")[:400],
                    "choices": it.get("choices"),
                    "accept": it.get("accept"),
                })
    print(f"practices {len(rows)}  items {sum(items_by_book.values())}  hits {len(hits)}")
    print("items per book:", dict(items_by_book))
    print("hits per book:", dict(Counter(h["bookId"] for h in hits)))
    print("hits per reason:", dict(Counter(r.split(" ")[0] for h in hits for r in h["reasons"])))
    for h in hits:
        print(f"\n{h['bookId']} {h['file']} :: {h['id']} ({h['label']}) {h['type']}/{h['mode']}")
        print("   reasons:", h["reasons"])
        print("   prompt:", h["prompt"].replace("\n", " | ")[:260])
        if h["choices"]:
            print("   choices:", str(h["choices"])[:220])
        if h["accept"]:
            print("   accept:", str(h["accept"])[:160])
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump({"items": dict(items_by_book), "hits": hits}, fh, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
