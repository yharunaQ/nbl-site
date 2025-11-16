#!/usr/bin/env zsh
set -e

git switch main
git pull

git add -A

if [ -z "$1" ]; then
  MSG="chore: update content"
else
  MSG="$1"
fi

git commit -m "$MSG"
git push