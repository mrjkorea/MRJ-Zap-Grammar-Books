# Practice audio bake (Fish TTS)

Maya reads Korean section instructions; KITT reads English stems. Model: `s2.1-pro-free`.

## Fill-in-the-blank → beep (standing rule, 2026-10-16)

Any graded English stem with a blank marker is baked as **speech segments joined with `audio/_beep.wav`** — never read through the answer.

Blank markers handled in `bake_audio.py`:

- `____` / `…` / empty `()`
- `( a / b )` choice blanks
- `[…]` editorial wrong-form brackets (천일문), except layout tags `[그림…]` / `[사진…]` / `[밑줄…]` / `[광고…]` (stripped, not beeped)
- `<u>…</u>` when it marks the blanked word(s) — **not** when the same line also has `___` (contraction drills: speak the expanded phrase, beep on the written blank)

Set `FISH_API_KEY` in the environment (never commit keys). Verify: `python3 scripts/audio-bake/bake_audio.py verify --book <book>`.
