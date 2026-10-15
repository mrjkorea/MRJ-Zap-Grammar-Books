#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
export FISH_API_KEY="$(tr -d '\n\r' < /workspace/conv-youtube/fish-pack/API_KEY.txt)"
mkdir -p audio
echo "START $(date -Iseconds)" | tee -a audio/bake.log
# Bake book-by-book with commits (script also supports --commit internally)
python3 -u scripts/audio-bake/bake_audio.py bake --commit
echo "END $(date -Iseconds)" | tee -a audio/bake.log
# Final spotcheck
python3 -u scripts/audio-bake/bake_audio.py spotcheck | tee -a audio/bake.log
