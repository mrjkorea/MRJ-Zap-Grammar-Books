#!/usr/bin/env python3
"""
Resumable Fish Audio bake for MRJ-Zap-Grammar-Books.
Voices: Maya (instructions), KITT (questions). Model s2.1-pro-free.
Concurrent TTS via --workers (default 4). Cache by text hash. Skip existing outputs.
Git commits stay single-threaded per book.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "data"
AUDIO_ROOT = REPO / "audio"
CACHE_DIR = AUDIO_ROOT / "_cache"
BEEP_WAV = AUDIO_ROOT / "_beep.wav"
MANIFEST_PATH = AUDIO_ROOT / "manifest.json"
PROGRESS_PATH = AUDIO_ROOT / "_progress.json"
LOG_PATH = AUDIO_ROOT / "bake.log"

BOOKS = [
    "green1", "green2", "green3", "green4",
    "blue1", "blue2", "blue3", "blue4",
    "red1", "red2",
]

MAYA = "fe4921e56ebf4fcba53b09b0d73c2052"
KITT = "eaa8a416bfcd4a38b3e3fa94ad934225"
MODEL = "s2.1-pro-free"
API = "https://api.fish.audio/v1/tts"

KEY_FILE = Path("/workspace/conv-youtube/fish-pack/API_KEY.txt")
ENV_PATH = Path(
    "/home/box/agent-data/agents/1340bdf8-d95a-4b40-bcba-5df7ceff912f/private/fish-audio.env"
)

BLANK_RE = re.compile(r"_{2,}|…+")
PAREN_CHOICE_RE = re.compile(r"\(\s*([^)]+?/[^=)]*?)\s*\)")
TAG_RE = re.compile(r"\[(?:그림|사진|밑줄|광고)[^\]]*\]")
ARROW_RE = re.compile(r"^\s*(?:→|->)")

_log_lock = threading.Lock()
_cache_locks_guard = threading.Lock()
_cache_locks: dict[str, threading.Lock] = {}
_tts_limiter = None  # set in cmd_bake


class AdaptiveTTSLimiter:
    """Cap concurrent TTS HTTP calls; shrink on repeated 429s."""

    def __init__(self, workers: int) -> None:
        self._cond = threading.Condition()
        self.n = max(1, int(workers))
        self._active = 0
        self._consecutive_429 = 0
        self._total_429 = 0

    def acquire(self) -> None:
        with self._cond:
            while self._active >= self.n:
                self._cond.wait()
            self._active += 1

    def release(self) -> None:
        with self._cond:
            self._active -= 1
            self._cond.notify_all()

    def on_429(self) -> None:
        with self._cond:
            self._consecutive_429 += 1
            self._total_429 += 1
            if self._consecutive_429 >= 2 and self.n > 1:
                self.n -= 1
                self._consecutive_429 = 0
                # notify waiters so they re-check the lower cap
                self._cond.notify_all()
                # log outside lock to avoid nested lock with _log_lock ordering issues
                reduced_to = self.n
            else:
                reduced_to = None
        if reduced_to is not None:
            log(f"TTS workers auto-reduced to {reduced_to} after repeated HTTP 429")

    def on_success(self) -> None:
        with self._cond:
            self._consecutive_429 = 0

    @property
    def current(self) -> int:
        with self._cond:
            return self.n


def _hash_lock(h: str) -> threading.Lock:
    with _cache_locks_guard:
        lock = _cache_locks.get(h)
        if lock is None:
            lock = threading.Lock()
            _cache_locks[h] = lock
        return lock


def log(msg: str) -> None:
    line = time.strftime("%Y-%m-%d %H:%M:%S") + " " + msg
    with _log_lock:
        print(line, flush=True)
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with LOG_PATH.open("a", encoding="utf-8") as f:
            f.write(line + "\n")


def load_key() -> str:
    if ENV_PATH.is_file():
        for line in ENV_PATH.read_text().splitlines():
            if line.startswith("FISH_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    if KEY_FILE.is_file():
        return KEY_FILE.read_text().strip()
    k = os.environ.get("FISH_API_KEY", "").strip()
    if k:
        return k
    raise SystemExit("Missing FISH_API_KEY")


def sanitize(s: str) -> str:
    s = s.replace(":", "-")
    return re.sub(r"[^A-Za-z0-9._-]+", "-", s).strip("-") or "x"


def text_hash(voice: str, text: str) -> str:
    h = hashlib.sha256(f"{voice}\n{MODEL}\n{text}".encode("utf-8")).hexdigest()
    return h[:24]


def ensure_beep() -> Path:
    if BEEP_WAV.exists() and BEEP_WAV.stat().st_size > 100:
        return BEEP_WAV
    BEEP_WAV.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "lavfi",
            "-i", "sine=frequency=880:duration=0.4",
            "-af", "afade=t=in:st=0:d=0.02,afade=t=out:st=0.35:d=0.05,volume=0.35",
            "-ar", "24000", "-ac", "1",
            str(BEEP_WAV),
        ],
        check=True,
        capture_output=True,
    )
    return BEEP_WAV


def ffmpeg_norm_mp3(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".tmp.mp3")
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(src),
            "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar", "24000", "-ac", "1", "-b:a", "64k",
            str(tmp),
        ],
        check=True,
        capture_output=True,
    )
    tmp.replace(dest)


def ffmpeg_join_beep(parts: list[Path], dest: Path) -> None:
    """parts alternate speech and may include empty → skip empties; insert beep between speech segments."""
    ensure_beep()
    wavs: list[Path] = []
    tmpdir = dest.parent / f".join-{dest.stem}"
    tmpdir.mkdir(parents=True, exist_ok=True)
    try:
        for i, p in enumerate(parts):
            if p is None:
                continue
            w = tmpdir / f"p{i}.wav"
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(p), "-ar", "24000", "-ac", "1", str(w)],
                check=True,
                capture_output=True,
            )
            wavs.append(w)
        if not wavs:
            raise RuntimeError("no parts to join")
        # Insert beep between consecutive speech wavs
        sequence: list[Path] = []
        for i, w in enumerate(wavs):
            sequence.append(w)
            if i < len(wavs) - 1:
                sequence.append(BEEP_WAV)
        # concat
        joined = tmpdir / "joined.wav"
        if len(sequence) == 1:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(sequence[0]), "-ar", "24000", "-ac", "1", str(joined)],
                check=True,
                capture_output=True,
            )
        else:
            fc = "".join(f"[{i}:a]" for i in range(len(sequence)))
            fc += f"concat=n={len(sequence)}:v=0:a=1[out]"
            cmd = ["ffmpeg", "-y"]
            for s in sequence:
                cmd += ["-i", str(s)]
            cmd += ["-filter_complex", fc, "-map", "[out]", str(joined)]
            subprocess.run(cmd, check=True, capture_output=True)
        ffmpeg_norm_mp3(joined, dest)
    finally:
        # cleanup tmp
        for f in tmpdir.glob("*"):
            try:
                f.unlink()
            except OSError:
                pass
        try:
            tmpdir.rmdir()
        except OSError:
            pass


def tts_raw(text: str, voice: str, out_raw: Path, retries: int = 8) -> None:
    """Call Fish API; write raw mp3 bytes to out_raw. Retry with backoff."""
    if not text.strip():
        raise ValueError("empty TTS text")
    # Emotion tag
    if not text.strip().startswith("["):
        if voice == MAYA:
            text = f"[clear friendly young speaker] {text}"
        else:
            text = f"[friendly clear] {text}"
    body = json.dumps(
        {"text": text, "reference_id": voice, "format": "mp3"},
        ensure_ascii=False,
    ).encode("utf-8")
    key = load_key()
    delay = 2.0
    last_err = None
    for attempt in range(1, retries + 1):
        limiter = _tts_limiter
        if limiter is not None:
            limiter.acquire()
        try:
            try:
                req = urllib.request.Request(
                    API,
                    data=body,
                    method="POST",
                    headers={
                        "Authorization": f"Bearer {key}",
                        "Content-Type": "application/json",
                        "model": MODEL,
                    },
                )
                with urllib.request.urlopen(req, timeout=120) as resp:
                    data = resp.read()
                if len(data) < 200:
                    raise RuntimeError(f"tiny response {len(data)} bytes")
                out_raw.parent.mkdir(parents=True, exist_ok=True)
                out_raw.write_bytes(data)
                if limiter is not None:
                    limiter.on_success()
                return
            except Exception as e:
                last_err = e
                sleep_for = delay
                if isinstance(e, urllib.error.HTTPError):
                    code = e.code
                    if code == 429:
                        sleep_for = max(delay, 15.0)
                        if limiter is not None:
                            limiter.on_429()
                    elif code in (500, 502, 503, 504):
                        sleep_for = delay
                    else:
                        if code in (400, 401, 403):
                            raise
                log(f"TTS retry {attempt}/{retries} voice={voice[:8]} err={e!r} sleep={sleep_for:.1f}s")
                time.sleep(sleep_for)
                delay = min(delay * 1.7, 90.0)
        finally:
            if limiter is not None:
                limiter.release()
    raise RuntimeError(f"TTS failed after retries: {last_err}")


def cached_tts(text: str, voice: str) -> Path:
    """Return path to normalized cached mp3 for this text+voice."""
    h = text_hash(voice, text)
    final = CACHE_DIR / f"{h}.mp3"
    if final.exists() and final.stat().st_size > 200:
        return final
    with _hash_lock(h):
        if final.exists() and final.stat().st_size > 200:
            return final
        raw = CACHE_DIR / f"{h}.raw.mp3"
        if not (raw.exists() and raw.stat().st_size > 200):
            tts_raw(text, voice, raw)
        ffmpeg_norm_mp3(raw, final)
        try:
            raw.unlink()
        except OSError:
            pass
        return final


def strip_tags(s: str) -> str:
    s = TAG_RE.sub("", s)
    s = re.sub(r"\[밑줄:[^\]]*\]", "", s)
    return s


def looks_like_word_bank(line: str) -> bool:
    m = re.match(r"^\(([^)]+)\)$", line.strip())
    if not m:
        return False
    inner = m.group(1)
    if "/" in inner or "," in inner:
        parts = re.split(r"\s*/\s*|\s*,\s*", inner)
        if len(parts) >= 2 and all(len(p.strip()) < 40 for p in parts):
            return True
    return False


def strip_trailing_hints(ln: str) -> str:
    while True:
        m = re.search(r"\s*\(([^)]*)\)\s*$", ln)
        if not m:
            break
        inner = m.group(1).strip()
        if "/" in inner:
            break  # choice blank
        ln = ln[: m.start()].rstrip()
    return ln


def has_blank(s: str) -> bool:
    return bool(BLANK_RE.search(s) or PAREN_CHOICE_RE.search(s))


def is_complete_english(line: str) -> bool:
    if not line or has_blank(line) or looks_like_word_bank(line):
        return False
    return bool(re.search(r"[A-Za-z]", line))


def replace_blanks(s: str) -> str:
    s = PAREN_CHOICE_RE.sub("⟦BLANK⟧", s)
    s = BLANK_RE.sub("⟦BLANK⟧", s)
    # empty parens
    s = re.sub(r"\(\s*\)", "⟦BLANK⟧", s)
    return s


def extract_item_audio(it: dict) -> tuple[str, object]:
    """
    Returns ('plain', text) | ('beep', [parts]) | ('skip', reason)
    """
    t = it.get("type")
    m = it.get("answerMode")
    if t == "match" or m == "match":
        return "skip", "match"
    if it.get("example") or it.get("displayOnly"):
        return "skip", "example"

    pe = strip_tags(it.get("promptEn") or "").strip()
    if not pe:
        return "skip", "no_english_prompt"

    lines = [ln.strip() for ln in pe.split("\n") if ln.strip()]
    lines = [ln for ln in lines if not looks_like_word_bank(ln)]
    lines = [ln for ln in lines if not ARROW_RE.match(ln)]
    # also drop lines that are only arrow rewrite targets like "→ ______ ______ hungry now."
    filtered = []
    for ln in lines:
        if "→" in ln or "->" in ln:
            # if arrow at start, skip entirely; if mid, take left cue only when complete
            if ln.lstrip().startswith("→") or ln.lstrip().startswith("->"):
                continue
            left = re.split(r"→|->", ln, maxsplit=1)[0].strip()
            if left and is_complete_english(left):
                filtered.append(left)
            continue
        filtered.append(ln)
    lines = [strip_trailing_hints(ln) for ln in filtered]
    lines = [ln for ln in lines if ln]
    if not lines:
        return "skip", "only_wordbank_or_answer_line"

    # Choose speak lines (two-sentence rule)
    if len(lines) == 1:
        speak_lines = lines
    else:
        first, rest = lines[0], lines[1:]
        if is_complete_english(first) and any(has_blank(r) for r in rest):
            speak_lines = [first]  # cue only
        elif has_blank(first):
            speak_lines = [first]  # blank line; drop following answer context
        else:
            blank_lines = [ln for ln in lines if has_blank(ln)]
            speak_lines = [blank_lines[0]] if blank_lines else [first]

    text = re.sub(r"\s+", " ", " ".join(speak_lines)).strip()
    if not text or not re.search(r"[A-Za-z]", text):
        return "skip", "no_speakable_english"

    # Spelling / word-form: if Korean prompt says spell-the-shown-word style with answer
    # visible as the only content — handled by leak check below for full-sentence equals.

    marked = replace_blanks(text)
    accept = it.get("accept") or []

    # Strong leak: spoken text (blanks emptied) equals an accept answer (reading the answer)
    emptied = re.sub(r"⟦BLANK⟧", " ", marked)
    emptied = re.sub(r"\s+", " ", emptied).strip().lower().rstrip(".!?")
    for a in accept:
        for part in str(a).split("|"):
            ans = part.strip().lower().rstrip(".!?")
            if len(ans) >= 4 and emptied == ans:
                return "skip", "spoken_equals_answer"

    # If this looks like a scramble (word bank was only content) already skipped.
    # Word-form with (bag) stripped — OK.

    # Skip if no blank was found but item is fill/mc with short accept that is
    # clearly a blank-fill — still speak the sentence (may be transform cue).

    if "⟦BLANK⟧" in marked:
        parts = [p.strip() for p in marked.split("⟦BLANK⟧")]
        # Avoid leading/trailing-only empties creating extra beeps: keep structure
        # "She" + blank + "my classmate." → ["She", "my classmate."]
        return "beep", parts
    return "plain", text


def answer_in_source(source_text: str, accept: list) -> str | None:
    """Post-check: does source TTS text contain a multi-word / long accept?"""
    # Remove blank markers for check
    check = replace_blanks(source_text)
    check = re.sub(r"⟦BLANK⟧", " ", check)
    check = re.sub(r"\s+", " ", check).strip().lower()
    for a in accept or []:
        for part in str(a).split("|"):
            ans = part.strip().lower().rstrip(".!?")
            # only flag distinctive answers (len>=5 or multiword) to avoid is/are/the noise
            if len(ans) < 5 and " " not in ans:
                continue
            if ans and re.search(r"(?<![a-z])" + re.escape(ans) + r"(?![a-z])", check):
                return ans
    return None


def practice_paths(path: Path) -> tuple[str, str, str]:
    # data/<book>/<unit>/file.json or data/<book>/tests/file.json
    parts = path.parts
    # find 'data' index
    idx = parts.index("data")
    book = parts[idx + 1]
    unit = parts[idx + 2]
    return book, unit, path.stem


def load_progress() -> dict:
    if PROGRESS_PATH.exists():
        try:
            return json.loads(PROGRESS_PATH.read_text())
        except Exception:
            return {}
    return {"done_books": [], "counts": {}, "skips": {}, "failures": []}


def save_progress(prog: dict) -> None:
    PROGRESS_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROGRESS_PATH.write_text(json.dumps(prog, ensure_ascii=False, indent=2))


def build_jobs(book_filter: str | None = None):
    jobs = []
    skip_counter = Counter()
    for book in BOOKS:
        if book_filter and book != book_filter:
            continue
        for path in sorted((DATA / book).rglob("*.json")):
            try:
                d = json.loads(path.read_text(encoding="utf-8"))
            except Exception as e:
                log(f"WARN bad json {path}: {e}")
                continue
            book_id, unit_id, _stem = practice_paths(path)
            practice_id = sanitize((d.get("practiceId") or path.stem).replace(":", "-"))
            base = AUDIO_ROOT / book_id / unit_id / practice_id

            for sec in d.get("sections") or []:
                sid = sanitize(str(sec.get("id") or "X"))
                ko = (sec.get("instructionKo") or sec.get("directionKo") or "").strip()
                if not ko:
                    skip_counter["instr_empty"] += 1
                    continue
                out = base / f"instr-{sid}.mp3"
                jobs.append(
                    {
                        "kind": "instr",
                        "book": book_id,
                        "unit": unit_id,
                        "practice": practice_id,
                        "section": sid,
                        "out": str(out.relative_to(AUDIO_ROOT)),
                        "text": ko,
                        "voice": MAYA,
                        "rel_json": str(path.relative_to(REPO)),
                    }
                )

            for it in d.get("items") or []:
                qid = sanitize(str(it.get("id") or it.get("label") or "q"))
                sid = sanitize(str(it.get("section") or "X"))
                kind, payload = extract_item_audio(it)
                if kind == "skip":
                    skip_counter[str(payload)] += 1
                    jobs.append(
                        {
                            "kind": "skip",
                            "book": book_id,
                            "reason": str(payload),
                            "itemId": it.get("id"),
                            "rel_json": str(path.relative_to(REPO)),
                        }
                    )
                    continue
                out = base / f"{sid}-{qid}.mp3"
                # Build source text for leak check
                if kind == "plain":
                    source = payload
                    parts = None
                    # Cue-only / full-sentence prompts: accept words often appear in the
                    # cue by design (transforms). Do not skip unless spoken == answer
                    # (already handled in extract). Optional: skip spelling if prompt
                    # is only the answer word — covered by spoken_equals_answer.
                    leak = None
                else:
                    parts = payload
                    source = " ⟦BLANK⟧ ".join(parts)
                    # With blanks: flag if a distinctive accept still appears outside blanks
                    # (e.g. failed to strip a choice / word-form reveal).
                    leak = answer_in_source(source, it.get("accept") or [])
                if leak:
                    skip_counter[f"answer_in_source:{leak}"] += 1
                    jobs.append(
                        {
                            "kind": "skip",
                            "book": book_id,
                            "reason": f"answer_in_source:{leak}",
                            "itemId": it.get("id"),
                            "rel_json": str(path.relative_to(REPO)),
                        }
                    )
                    continue
                jobs.append(
                    {
                        "kind": "item",
                        "book": book_id,
                        "unit": unit_id,
                        "practice": practice_id,
                        "section": sid,
                        "qid": qid,
                        "itemId": it.get("id"),
                        "out": str(out.relative_to(AUDIO_ROOT)),
                        "mode": kind,
                        "text": source if kind == "plain" else None,
                        "parts": parts,
                        "voice": KITT,
                        "accept": it.get("accept"),
                        "rel_json": str(path.relative_to(REPO)),
                    }
                )
    return jobs, skip_counter


def process_job(job: dict) -> str:
    """Return 'made'|'exists'|'fail'."""
    if job["kind"] == "skip":
        return "skip"
    out = AUDIO_ROOT / job["out"]
    if out.exists() and out.stat().st_size > 200:
        return "exists"
    try:
        if job["kind"] == "instr":
            cached = cached_tts(job["text"], MAYA)
            if out.resolve() != cached.resolve():
                out.parent.mkdir(parents=True, exist_ok=True)
                # hardlink or copy
                if out.exists():
                    out.unlink()
                try:
                    os.link(cached, out)
                except OSError:
                    out.write_bytes(cached.read_bytes())
            return "made"
        # item
        if job["mode"] == "plain":
            cached = cached_tts(job["text"], KITT)
            out.parent.mkdir(parents=True, exist_ok=True)
            if out.exists():
                out.unlink()
            try:
                os.link(cached, out)
            except OSError:
                out.write_bytes(cached.read_bytes())
            return "made"
        # beep join
        part_paths = []
        for p in job["parts"]:
            if p is None or not str(p).strip():
                # empty side of blank — still need beep boundary; use tiny silence?
                # Represent empty as None; join inserts beep between existing speech only.
                # Leading blank: beep then speech; trailing blank: speech then beep?
                # For "______ is my friend" → ["", "is my friend"] 
                # Leading empty → start with beep: synthesize nothing, handle in join
                part_paths.append(None if not str(p).strip() else cached_tts(p, KITT))
            else:
                part_paths.append(cached_tts(p, KITT))
        # Filter: build speech list; if leading/trailing empty, add short silence via beep-only edges
        speech = [p for p in part_paths if p is not None]
        if not speech:
            return "fail"
        # If original had leading empty blank, prepend by joining beep+first via fake
        leading_blank = part_paths and part_paths[0] is None
        trailing_blank = part_paths and part_paths[-1] is None
        ensure_beep()
        if leading_blank or trailing_blank:
            # Create silence wav once
            sil = AUDIO_ROOT / "_silence.wav"
            if not sil.exists():
                subprocess.run(
                    [
                        "ffmpeg", "-y", "-f", "lavfi",
                        "-i", "anullsrc=r=24000:cl=mono", "-t", "0.05",
                        str(sil),
                    ],
                    check=True,
                    capture_output=True,
                )
            seq = []
            if leading_blank:
                seq.append(sil)
            # Interleave speech with beeps for internal blanks
            # Reconstruct from part_paths
            first = True
            for p in part_paths:
                if p is None:
                    if not first:
                        # blank between or edges already handled
                        pass
                    # blank means: beep (except we use join_beep between speech)
                    continue
                seq.append(p)
                first = False
            # Better: use ffmpeg_join_beep on speech list (beep between), then
            # if leading blank, concat beep before; trailing beep after
            tmp = out.with_suffix(".pre.mp3")
            ffmpeg_join_beep(speech, tmp if (leading_blank or trailing_blank) else out)
            if leading_blank or trailing_blank:
                wav_in = out.parent / f".edge-{out.stem}.wav"
                subprocess.run(
                    ["ffmpeg", "-y", "-i", str(tmp), "-ar", "24000", "-ac", "1", str(wav_in)],
                    check=True,
                    capture_output=True,
                )
                inputs = []
                if leading_blank:
                    inputs.append(BEEP_WAV)
                inputs.append(wav_in)
                if trailing_blank:
                    inputs.append(BEEP_WAV)
                fc = "".join(f"[{i}:a]" for i in range(len(inputs)))
                fc += f"concat=n={len(inputs)}:v=0:a=1[out]"
                joined = out.parent / f".edgej-{out.stem}.wav"
                cmd = ["ffmpeg", "-y"]
                for inp in inputs:
                    cmd += ["-i", str(inp)]
                cmd += ["-filter_complex", fc, "-map", "[out]", str(joined)]
                subprocess.run(cmd, check=True, capture_output=True)
                ffmpeg_norm_mp3(joined, out)
                for f in [tmp, wav_in, joined]:
                    try:
                        f.unlink()
                    except OSError:
                        pass
            return "made"
        else:
            ffmpeg_join_beep(speech, out)
            return "made"
    except Exception as e:
        log(f"FAIL {job.get('out')} {e!r}")
        return "fail"


def write_manifest(jobs: list) -> None:
    """Map practices → items/sections audio paths."""
    # structure: { "books": { book: { practiceKey: { "file": reljson, "sections": {sid: {instrAudio}}, "items": {id: {audio, skip?}} } } } }
    root: dict = {"version": 1, "voices": {"instruction": MAYA, "question": KITT, "model": MODEL}, "books": {}}
    for job in jobs:
        book = job.get("book")
        if not book:
            continue
        root["books"].setdefault(book, {})
        if job["kind"] == "skip":
            # attach skips under practice if possible
            rel = job.get("rel_json")
            if not rel:
                continue
            # find practice from path
            continue  # skips recorded separately
        practice = job["practice"]
        unit = job["unit"]
        pkey = f"{unit}/{practice}"
        entry = root["books"][book].setdefault(
            pkey,
            {"unitId": unit, "practiceId": practice, "file": job.get("rel_json"), "sections": {}, "items": {}},
        )
        if job["kind"] == "instr":
            entry["sections"][job["section"]] = {"instrAudio": job["out"]}
        elif job["kind"] == "item":
            entry["items"][job.get("itemId") or job["qid"]] = {
                "audio": job["out"],
                "section": job["section"],
                "qid": job["qid"],
            }
    # Add skip index
    skips = []
    for job in jobs:
        if job["kind"] == "skip":
            skips.append(
                {
                    "book": job.get("book"),
                    "file": job.get("rel_json"),
                    "itemId": job.get("itemId"),
                    "reason": job.get("reason"),
                }
            )
    root["skips"] = skips
    root["skipCounts"] = dict(Counter(s["reason"] for s in skips))
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(root, ensure_ascii=False, indent=2))
    log(f"Wrote manifest {MANIFEST_PATH} ({MANIFEST_PATH.stat().st_size} bytes)")


def cmd_count(args):
    jobs, skips = build_jobs(args.book)
    make = [j for j in jobs if j["kind"] in ("instr", "item")]
    skipj = [j for j in jobs if j["kind"] == "skip"]
    print("TOTAL_TO_MAKE", len(make))
    print("TOTAL_SKIP_RECORDS", len(skipj))
    print("SKIP_REASONS", dict(Counter(j["reason"] for j in skipj)))
    by = Counter(j["book"] for j in make)
    print("BY_BOOK", dict(by))
    # unique TTS estimate
    uniq = set()
    for j in make:
        if j["kind"] == "instr":
            uniq.add(("maya", j["text"]))
        elif j["mode"] == "plain":
            uniq.add(("kitt", j["text"]))
        else:
            for p in j["parts"]:
                if p and p.strip():
                    uniq.add(("kitt", p))
    print("UNIQUE_TTS", len(uniq))
    print("EST_HOURS_2.5s", round(len(uniq) * 2.5 / 3600, 2))
    print("EST_HOURS_4s", round(len(uniq) * 4 / 3600, 2))


def cmd_bake(args):
    global _tts_limiter
    ensure_beep()
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    prog = load_progress()
    books = [args.book] if args.book else BOOKS
    all_jobs_for_manifest = []
    workers = max(1, int(getattr(args, "workers", 4) or 4))
    _tts_limiter = AdaptiveTTSLimiter(workers)
    log(f"bake workers={workers} (TTS concurrency; commits remain single-threaded)")

    t0 = time.time()
    total_made = total_exists = total_fail = total_skip = 0

    for book in books:
        log(f"=== BOOK START {book} ===")
        jobs, _ = build_jobs(book)
        all_jobs_for_manifest.extend(jobs)
        make_jobs = [j for j in jobs if j["kind"] in ("instr", "item")]
        skip_jobs = [j for j in jobs if j["kind"] == "skip"]
        total_skip += len(skip_jobs)
        book_made = book_exists = book_fail = 0
        # Job pool size matches TTS workers; limiter caps actual HTTP concurrency.
        pool_n = workers
        done_i = 0
        with ThreadPoolExecutor(max_workers=pool_n) as ex:
            futures = {ex.submit(process_job, job): job for job in make_jobs}
            for fut in as_completed(futures):
                job = futures[fut]
                status = fut.result()
                done_i += 1
                if status == "made":
                    book_made += 1
                    total_made += 1
                elif status == "exists":
                    book_exists += 1
                    total_exists += 1
                else:
                    book_fail += 1
                    total_fail += 1
                    prog.setdefault("failures", []).append(
                        {"out": job.get("out"), "book": book, "t": time.time()}
                    )
                if done_i % 25 == 0 or done_i == len(make_jobs):
                    cur_w = _tts_limiter.current if _tts_limiter else workers
                    log(
                        f"{book} progress {done_i}/{len(make_jobs)} "
                        f"made={book_made} exists={book_exists} fail={book_fail} workers={cur_w}"
                    )
                    prog["counts"][book] = {
                        "made": book_made,
                        "exists": book_exists,
                        "fail": book_fail,
                        "skip": len(skip_jobs),
                        "target": len(make_jobs),
                    }
                    save_progress(prog)
                # Single-thread pacing only; concurrent mode relies on limiter + 429 backoff
                if status == "made" and workers == 1:
                    time.sleep(0.35)

        log(f"=== BOOK DONE {book} made={book_made} exists={book_exists} fail={book_fail} skip={len(skip_jobs)} ===")
        prog.setdefault("done_books", [])
        if book not in prog["done_books"]:
            prog["done_books"].append(book)
        save_progress(prog)

        # Commits are always single-threaded, after the book finishes.
        if args.commit:
            commit_book(book)

    # Full manifest across requested books (rebuild all for consistency if no filter)
    if not args.book:
        jobs_all, _ = build_jobs(None)
        write_manifest(jobs_all)
    else:
        write_manifest(all_jobs_for_manifest)

    elapsed = time.time() - t0
    log(
        f"DONE made={total_made} exists={total_exists} fail={total_fail} skip={total_skip} elapsed_s={elapsed:.0f}"
    )


def commit_book(book: str) -> None:
    """Commit audio for one book + progress/manifest to audio-bake branch."""
    subprocess.run(["git", "fetch", "origin", "audio-bake"], cwd=REPO, capture_output=True)
    r = subprocess.run(
        ["git", "rev-parse", "--verify", "audio-bake"],
        cwd=REPO,
        capture_output=True,
    )
    if r.returncode != 0:
        subprocess.run(["git", "checkout", "-b", "audio-bake"], cwd=REPO, check=True)
    else:
        subprocess.run(["git", "checkout", "audio-bake"], cwd=REPO, capture_output=True)
        # Stash local dirty files so pull --rebase can run; restore after.
        st = subprocess.run(
            ["git", "stash", "push", "-u", "-m", f"audio-bake-pre-pull-{book}"],
            cwd=REPO,
            capture_output=True,
            text=True,
        )
        stashed = st.returncode == 0 and "No local changes" not in (st.stdout or "")
        rb = subprocess.run(
            ["git", "pull", "--rebase", "origin", "audio-bake"],
            cwd=REPO,
            capture_output=True,
            text=True,
        )
        if rb.returncode != 0:
            log(f"pull --rebase warn {book}: {rb.stderr[-300:]}")
        if stashed:
            pop = subprocess.run(
                ["git", "stash", "pop"],
                cwd=REPO,
                capture_output=True,
                text=True,
            )
            if pop.returncode != 0:
                log(f"stash pop warn {book}: {(pop.stderr or pop.stdout)[-300:]}")

    add_paths = [
        f"audio/{book}",
        "audio/manifest.json",
        "audio/_progress.json",
        "audio/bake.log",
        "audio/COUNT_ESTIMATE.txt",
        "scripts/audio-bake/",
    ]
    # Retry add briefly if another git process holds the index lock
    for attempt in range(5):
        add = subprocess.run(
            ["git", "add", "--"] + add_paths,
            cwd=REPO,
            capture_output=True,
            text=True,
        )
        if add.returncode == 0:
            break
        err = (add.stderr or "") + (add.stdout or "")
        if "index.lock" in err or "unable to lock" in err.lower():
            time.sleep(1.5 * (attempt + 1))
            continue
        log(f"git add warn {book}: {err[-300:]}")
        break
    st = subprocess.run(
        ["git", "diff", "--cached", "--name-only"],
        cwd=REPO,
        capture_output=True,
        text=True,
    )
    if not st.stdout.strip():
        log(f"commit skip {book}: nothing staged")
        return
    msg = f"audio-bake: {book} practice audio"
    c = subprocess.run(["git", "commit", "-m", msg], cwd=REPO, capture_output=True, text=True)
    if c.returncode != 0:
        log(f"commit fail {book}: {c.stderr[-300:] or c.stdout[-300:]}")
        return
    push = subprocess.run(
        ["git", "push", "-u", "origin", "audio-bake"],
        cwd=REPO,
        capture_output=True,
        text=True,
    )
    if push.returncode != 0:
        # one more rebase+push attempt
        subprocess.run(["git", "pull", "--rebase", "origin", "audio-bake"], cwd=REPO, capture_output=True)
        push = subprocess.run(
            ["git", "push", "-u", "origin", "audio-bake"],
            cwd=REPO,
            capture_output=True,
            text=True,
        )
    log(
        f"push {book}: rc={push.returncode} "
        f"{(push.stderr or push.stdout)[-240:]}"
    )


def cmd_spotcheck(args):
    jobs, _ = build_jobs(args.book)
    make = [j for j in jobs if j["kind"] == "item"]
    import random

    sample = make if len(make) <= 40 else random.sample(make, 40)
    problems = []
    for j in sample:
        p = AUDIO_ROOT / j["out"]
        if not p.exists():
            problems.append(("missing", j["out"]))
            continue
        # duration
        r = subprocess.run(
            [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "csv=p=0",
                str(p),
            ],
            capture_output=True,
            text=True,
        )
        try:
            dur = float(r.stdout.strip())
        except Exception:
            problems.append(("nodur", j["out"]))
            continue
        if dur < 0.3 or dur > 45:
            problems.append(("baddur", j["out"], dur))
        # answer leak in source
        src = j.get("text") or (" ⟦BLANK⟧ ".join(j.get("parts") or []))
        leak = answer_in_source(src, j.get("accept") or [])
        if leak:
            problems.append(("leak", j["out"], leak, src[:80]))
    print("SPOTCHECK_SAMPLES", len(sample))
    print("PROBLEMS", len(problems))
    for x in problems[:30]:
        print(x)


def main():
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)
    c = sp.add_parser("count")
    c.add_argument("--book", default=None)
    c.set_defaults(func=cmd_count)
    b = sp.add_parser("bake")
    b.add_argument("--book", default=None)
    b.add_argument("--commit", action="store_true")
    b.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Concurrent Fish TTS HTTP requests (default 4). Commits stay single-threaded.",
    )
    b.set_defaults(func=cmd_bake)
    s = sp.add_parser("spotcheck")
    s.add_argument("--book", default=None)
    s.set_defaults(func=cmd_spotcheck)
    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
