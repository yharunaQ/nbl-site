# Public deploy worktree cleanup packet v0

Date: 2026-07-01  
Lane: Falcon public-operations support  
Scope: deploy safety, local worktree divergence, and cleanup sequencing

## Current Goal

Stabilize the public deploy workflow after the toolkit-infographic release, without discarding or guessing the meaning of existing local work.

## Current State

- Production `origin/main` is at `f7c70eb feat: add employment support toolkit infographics`.
- Primary local `main` is at `753a5a8 feat: publish Axiom projects entrance`.
- Primary local `main` is `ahead 1, behind 13` relative to `origin/main`.
- The primary worktree has a very large mixed state:
  - total status entries: `7372`
  - modified: `109`
  - added: `186`
  - deleted: `20`
  - untracked: `7057`
- The largest top-level clusters are:
  - `docs`: `6309`
  - `public`: `326`
  - `__tests__`: `252`
  - `scripts`: `148`
  - `lib`: `117`
  - `pages`: `94`
  - `components`: `50`

## What Caused The Confusion

This was not caused by the two employment-support infographic files alone.

The confusion came from three things overlapping:

1. Recent direct public fixes advanced `origin/main`.
2. The primary local `main` stayed on an older commit and also contains one local-only commit.
3. Long-running local/generated work created thousands of untracked or modified files.

Because old `deploy.sh` used `git add -A`, running it from the primary worktree could have committed unrelated generated files, local notes, deleted song assets, and experimental Falcon/Falcon Lab work.

## Immediate Fix Applied

`deploy.sh` has been changed from a broad commit-and-push helper into a safety gate:

- it refuses commit-message arguments
- it refuses non-`main` branches
- it refuses dirty worktrees, including untracked files
- it fetches `origin/main`
- it allows only fast-forward or clean ahead-of-origin deploy paths
- it runs `npm run release:public:preflight`
- it pushes only the already committed `HEAD` to `origin/main`

The script no longer runs:

- `git add -A`
- automatic `git commit`
- unrestricted `git pull`

## Cleanup Rule From Now On

Public changes should use one of two safe routes:

1. Clean route:
   - start from `origin/main`
   - stage named files only
   - commit
   - push

2. Recovery route:
   - keep the current primary worktree as a WIP holding area
   - create a clean temporary worktree from `origin/main`
   - transplant only reviewed files into that worktree
   - test, commit, push

Do not use the primary dirty worktree as a public deploy source until it has been deliberately reconciled.

## Not Now

- no `git reset --hard`
- no deletion of untracked files
- no mass staging
- no archive cleanup
- no judgment on which Falcon Lab artifacts should be promoted
- no merge of the local-only `753a5a8` line without review
- no public content meaning change
- no runtime, provider, DB, retrieval, or schema movement

## Recommended Next Cleanup Slice

Use the `compromise` route:

1. Preserve the primary worktree as WIP.
2. Create a status inventory grouped into:
   - public-site files likely already shipped or superseded
   - Falcon Lab / knowledge-network work
   - generated assets and local caches
   - social/song/campaign material
   - unknown/manual-review files
3. For each group, decide one of:
   - commit as a named packet
   - move to local hold / archive
   - ignore via `.gitignore`
   - leave in WIP with an explicit hold note

Minimal cleanup would only keep using clean temporary worktrees for public deploys.  
Robust cleanup would split the repository or create a permanent deploy-only worktree.  
Compromise is recommended because it prevents public accidents now while avoiding destructive cleanup of possibly valuable Falcon work.

## Reopen Condition

This cleanup packet should be reopened when:

- the primary worktree is ready to be reconciled with `origin/main`, or
- another public change is requested from a dirty worktree, or
- generated/untracked files again exceed a level where `git status` becomes unreadable.
