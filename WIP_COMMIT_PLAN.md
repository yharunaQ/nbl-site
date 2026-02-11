# WIP Commit Split Plan

Workspace: /Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter
Generated: 2026-02-11 (JST)

## Goal

Uncommitted work is large and crosses pipeline/API/UI concerns.  
This plan splits it into reviewable WIP commits with minimal cross-contamination.

## Commit 1: Web source ingest + normalization metadata

Intent:
- Expand international website sources and crawl controls.
- Add interaction context metadata at normalization stage.
- Align planner/types with website-enabled flow.

Files:
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/config/knowledge-sources.json`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/fetch-web-sources.mjs`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/build-normalized-records.mjs`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/lib/knowledge/types.ts`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/lib/knowledge/agenticPlanner.ts`

Commands:
```bash
git add config/knowledge-sources.json \
  scripts/knowledge/fetch-web-sources.mjs \
  scripts/knowledge/build-normalized-records.mjs \
  lib/knowledge/types.ts \
  lib/knowledge/agenticPlanner.ts
git commit -m "feat(knowledge): expand web ingestion and interaction metadata"
```

## Commit 2: Claims dataset + safety-gate test tooling/docs

Intent:
- Add normalized-records -> claims builder.
- Add safety-gate API scenario test.
- Add index/docs + npm scripts for claims/test/audit summary.

Files:
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/build-claims.mjs`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/test-safety-gate.mjs`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/jac/summarize-safety-audit.mjs`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/references/index/README.md`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/package.json`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/README.md`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/references/index/knowledge-claims.jsonl`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/references/index/knowledge-claims-manifest.json`

Commands:
```bash
git add scripts/knowledge/build-claims.mjs \
  scripts/knowledge/test-safety-gate.mjs \
  scripts/jac/summarize-safety-audit.mjs \
  references/index/README.md \
  package.json README.md \
  references/index/knowledge-claims.jsonl \
  references/index/knowledge-claims-manifest.json
git commit -m "feat(knowledge): add claims dataset and safety-gate verification tooling"
```

## Commit 3: JAC runtime safety gate + UI integration + audit log

Intent:
- Apply safety gate in execution and `/api/jac-assess`.
- Persist privacy-safe audit logs.
- Surface gate mode/policy/questions in JAC UI.

Files:
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/lib/knowledge/agenticExecutor.ts`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/pages/api/jac-assess.ts`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/pages/jac.tsx`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/lib/jac/safetyAuditLog.ts`

Commands:
```bash
git add lib/knowledge/agenticExecutor.ts \
  pages/api/jac-assess.ts \
  pages/jac.tsx \
  lib/jac/safetyAuditLog.ts
git commit -m "feat(jac): enforce safety gate and add audit logging"
```

## Commit 4 (optional): local research artifacts / memo files

Intent:
- Keep local-only artifacts explicit, separate from product code.

Files:
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/references/GLM_resutls/NanbyoGLM.xlsx`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/references/GLM_resutls/難病患者の就労困難性に関係する諸要素の相互作用.txt`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/開発の夢/Vision.txt`

Commands:
```bash
git add references/GLM_resutls/NanbyoGLM.xlsx \
  references/GLM_resutls/難病患者の就労困難性に関係する諸要素の相互作用.txt \
  開発の夢/Vision.txt
git commit -m "chore(local): add working research artifacts"
```

## Recovery docs commit (small, immediate)

Files:
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/RECOVERY_NOTES.md`
- `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/WIP_COMMIT_PLAN.md`

Commands:
```bash
git add RECOVERY_NOTES.md WIP_COMMIT_PLAN.md
git commit -m "docs: add crash recovery notes and WIP split plan"
```
