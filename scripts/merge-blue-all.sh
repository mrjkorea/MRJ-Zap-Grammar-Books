#!/bin/bash
set -e
cd "$(dirname "$0")/.."
OURS_ENGINE=(assets/js/engine.js assets/js/normalize.js assets/js/version.js index.html)
branches=(
origin/cursor/blue1-unit02-845a
origin/cursor/blue1-unit03-40b9
origin/cursor/blue1-unit04-articles-7872
origin/cursor/blue1-unit05-pronouns-16d3
origin/cursor/blue1-unit06-pronouns-33f8
origin/cursor/blue1-unit07-be-present-5635
origin/cursor/blue1-unit08-2be3
origin/cursor/blue2-unit01-541c
origin/cursor/blue2-unit02-44d7
origin/cursor/blue2-unit03-d506
origin/cursor/blue2-unit04-some-any-1364
origin/cursor/blue2-unit05-5d8c
origin/cursor/blue2-unit06-1a4f
origin/cursor/blue2-unit07-2d07
origin/cursor/blue2-unit08-prepositions-6b5f
origin/cursor/bluezap3-unit01-62c9
origin/cursor/blue3-unit02-4e69
origin/cursor/blue3-unit03-there-it-fca5
origin/cursor/blue3-unit04-7d7b
origin/cursor/blue3-unit05-6f46
origin/cursor/blue3-unit06-past-be-76ef
origin/cursor/blue3-unit07-dcb6
origin/cursor/blue3-unit08-4c8e
origin/cursor/blue4-unit01-992b
origin/cursor/blue4-unit02-will-7128
origin/cursor/blue4-unit03-bc80
origin/cursor/blue4-unit04-32e6
origin/cursor/blue4-unit05-2dd6
origin/cursor/blue4-unit06-d881
origin/cursor/blue4-unit07-tag-questions-a002
origin/cursor/blue4-unit08-706f
)
for b in "${branches[@]}"; do
  echo "=== merge $b ==="
  if ! git merge -m "Merge $b into blue full integration" "$b" --no-edit; then
    for f in assets/js/engine.js assets/js/normalize.js; do
      git checkout HEAD -- "$f" 2>/dev/null || true
    done
    git add assets/js/engine.js assets/js/normalize.js 2>/dev/null || true
    # prefer union for data; manual for catalog later
    if git diff --name-only --diff-filter=U | grep -q .; then
      for f in $(git diff --name-only --diff-filter=U); do
        case "$f" in
          assets/js/catalog.js) git checkout --theirs "$f" ;;
          data/*) git checkout --theirs "$f" ;;
          FORMAT-BLUE.md|README.md|docs/*) git checkout --theirs "$f" ;;
          scripts/*) git checkout --theirs "$f" ;;
          *) git checkout --ours "$f" ;;
        esac
        git add "$f"
      done
    fi
    git commit --no-edit || git merge --abort && exit 1
  fi
done
echo "All merges done"
