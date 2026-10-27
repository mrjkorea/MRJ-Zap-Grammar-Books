#!/usr/bin/env bash
# Commits each finished book on audio-bake while the (old in-memory) baker runs.
set -euo pipefail
cd "$(dirname "$0")/../.."
export GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-mrjkorea}"
export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-mrjkorea@users.noreply.github.com}"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
git config user.email "$GIT_AUTHOR_EMAIL"
git config user.name "$GIT_AUTHOR_NAME"

BOOKS=(green1 green2 green3 green4 blue1 blue2 blue3 blue4 red1 red2 chunilmun1)
LOG=audio/commit_watcher.log
mkdir -p audio
echo "WATCHER START $(date -Iseconds)" | tee -a "$LOG"

commit_book() {
  local book="$1"
  git fetch origin audio-bake >/dev/null 2>&1 || true
  git checkout audio-bake >/dev/null 2>&1 || git checkout -b audio-bake
  git pull --rebase origin audio-bake >/dev/null 2>&1 || true
  # Skip if already in HEAD tree
  if git cat-file -e "HEAD:audio/${book}" 2>/dev/null; then
    echo "$(date -Iseconds) skip $book already in HEAD" | tee -a "$LOG"
    return 0
  fi
  if [[ ! -d "audio/${book}" ]]; then
    echo "$(date -Iseconds) skip $book no dir" | tee -a "$LOG"
    return 0
  fi
  local n
  n=$(find "audio/${book}" -name '*.mp3' | wc -l)
  to_add=("audio/${book}" audio/_progress.json audio/bake.log scripts/audio-bake/)
  [[ -f audio/COUNT_ESTIMATE.txt ]] && to_add+=(audio/COUNT_ESTIMATE.txt)
  [[ -f audio/manifest.json ]] && to_add+=(audio/manifest.json)
  git add -- "${to_add[@]}" 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "$(date -Iseconds) skip $book nothing staged (n=$n)" | tee -a "$LOG"
    return 0
  fi
  git commit -m "audio-bake: ${book} practice audio (${n} mp3 files)" | tee -a "$LOG"
  if ! git push origin audio-bake; then
    git pull --rebase origin audio-bake || true
    git push origin audio-bake
  fi
  echo "$(date -Iseconds) pushed $book ($n files)" | tee -a "$LOG"
}

# Poll until bake exits and all done_books committed
while true; do
  if [[ -f audio/_progress.json ]]; then
    for b in "${BOOKS[@]}"; do
      if python3 -c "import json; d=json.load(open('audio/_progress.json')); raise SystemExit(0 if '$b' in d.get('done_books',[]) else 1)"; then
        commit_book "$b" || echo "$(date -Iseconds) COMMIT_FAIL $b" | tee -a "$LOG"
      fi
    done
  fi
  # Exit when baker gone AND all 10 in done_books
  if ! pgrep -f 'bake_audio.py bake' >/dev/null 2>&1; then
    echo "$(date -Iseconds) baker not running" | tee -a "$LOG"
    # final pass
    for b in "${BOOKS[@]}"; do
      if [[ -d "audio/${b}" ]]; then
        commit_book "$b" || true
      fi
    done
    # If progress says all done, exit; else maybe baker crashed mid-book — leave for agent
    if python3 -c "import json; d=json.load(open('audio/_progress.json')); raise SystemExit(0 if len(d.get('done_books',[]))>=10 else 1)" 2>/dev/null; then
      echo "$(date -Iseconds) all 10 books done — watcher exit" | tee -a "$LOG"
      exit 0
    fi
    # baker dead but not all done — exit so agent can restart bake
    echo "$(date -Iseconds) baker dead incomplete — watcher exit" | tee -a "$LOG"
    exit 0
  fi
  sleep 60
done
