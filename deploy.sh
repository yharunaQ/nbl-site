#!/usr/bin/env zsh
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "git is not available in this shell."
  echo "On macOS, accept the Xcode license first:"
  echo "  sudo xcodebuild -license"
  exit 1
fi

if [ "$#" -gt 0 ]; then
  echo "deploy.sh no longer creates commits or accepts a commit message."
  echo "Commit only the intended files first, then run ./deploy.sh from a clean main worktree."
  exit 1
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

branch="$(git branch --show-current)"
if [ "$branch" != "main" ]; then
  echo "Refusing to deploy from branch '$branch'. Switch to a clean main worktree first."
  exit 1
fi

if [ -n "$(git status --porcelain=v1)" ]; then
  echo "Refusing to deploy from a dirty worktree."
  echo "Stage and commit only intended files, or use a clean temporary worktree."
  git status --short
  exit 1
fi

git fetch origin main

local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse origin/main)"
merge_base="$(git merge-base HEAD origin/main)"

if [ "$local_head" = "$remote_head" ]; then
  echo "Local main already matches origin/main."
elif [ "$merge_base" = "$local_head" ]; then
  echo "Local main is behind origin/main; fast-forwarding."
  git pull --ff-only origin main
elif [ "$merge_base" = "$remote_head" ]; then
  echo "Local main is ahead of origin/main; continuing to preflight before push."
else
  echo "Local main and origin/main have diverged. Resolve this in a clean worktree before deploying."
  exit 1
fi

PATH=/Users/YuichiroHARUNA/.nvm/versions/node/v20.19.5/bin:$PATH npm run release:public:preflight

git push origin HEAD:main
