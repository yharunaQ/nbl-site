# 障害者就労支援の専門知識インフォグラフィック ツールキット追加境界 v0

Date: 2026-07-01  
Lane: Falcon Lab / current NBL site delivery layer  
Surface: `/toolkit-studio` selected infographic library and `/share/toolkit-infographic/*` share entries

## Goal

PDF由来の「就労支援実務者に必要な知識・スキル等」の65項目を、NBLサイト上で読めるツールキット素材として置く。  
X投稿の単発hookではなく、根拠、読み方、使いどころ、境界と一緒に見せる。

## Added Assets

- `public/images/axiom-toolkit-selected-infographics/employment-support-five-core-v1.png`
- `public/images/axiom-toolkit-selected-infographics/employment-support-vocabulary-update-v1.png`

These are also preserved as working images under `docs/nbl-workspace/assets/`.

## Site Placement

Added a selected-infographic group:

- `専門性の再整理`
- Purpose: 就労支援の知識・スキル一覧を、支援の流れ、言葉の使い方、考え違いの予防として読み直す。
- Intended use: 研修、会議、支援記録の読み方をそろえる入口。

## Source And Review Status

The source PDF is treated as:

- `evidence_layer`
- `source_readiness`
- `candidate_structure_input`

It is not treated as:

- public approval
- final legal/current-policy explanation
- reviewed knowledge object promotion
- individual case guidance
- accommodation decision guidance

## Public Copy Boundary

The images and card copy avoid:

- disease-name-to-support lookup
- diagnosis-only reasoning
- legal or accommodation finality
- AI or internal method terminology
- claiming that employment is the final goal

The intended public-facing frame is:

> 仕事の困難を、人の問題で終わらせず、本人・仕事・環境・支援・時間の条件として読み直す。

## Not Now

- no public approval by this commit
- no current-law or current-policy verification
- no final professional judgment
- no knowledge object promotion
- no runtime, retrieval, model, DB, or schema movement
- no direct claim that the source itself endorses this NBL restructuring

## Next Safe Step

Before wider public promotion, add a concise source/context note near the toolkit item or companion article:

- what the original 65-item list is
- what NBL changed by restructuring it
- why the two diagrams should be read as thinking tools, not as checklists or final guidance
