#!/usr/bin/env zsh
set -e

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "git is not available in this shell."
  echo "On macOS, accept the Xcode license first:"
  echo "  sudo xcodebuild -license"
  exit 1
fi

PATH=/Users/YuichiroHARUNA/.nvm/versions/node/v20.19.5/bin:$PATH npm run release:public:preflight

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
