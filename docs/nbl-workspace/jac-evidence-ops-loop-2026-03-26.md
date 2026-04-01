# JAC Evidence Ops Loop

更新日: 2026-03-26
Status: active operating memo

## Why this memo exists

`配慮設計アシスト` の本体価値は UI や wording より、`基本エビデンス情報をどう収集し、どう統合し、どう条件つきで返すか` にある。

ここが複雑化、漏れ、使いにくさを抱えたままだと、NBL のコアプロダクトは伸びない。

したがって、JAC には `機能改善 loop` だけでなく、`evidence improvement loop` が必要である。

## Product stance

- `配慮設計アシスト` は evidence operating system として扱う。
- 改善対象は次の4層に分ける。
  - source collection
  - claim synthesis
  - report traceability
  - public asset extraction
- 国内 data2 / GLM / curated note だけで閉じず、諸外国の official guidance と employer-facing practice も継続投入する。

## Current structural risks

- source は増えているが、`何が stale か` を定例で見にくい。
- claim は豊富だが、利用者向けの最終レポートでは `詳しい情報源` まで辿りにくい。
- feedback loop はあるが、runtime 保存先と分析入口がずれると改善速度が落ちる。
- infographic / video 候補化が founder memory 依存だと、継続制作の母艦になりにくい。

## Operating loop

第4の柱は、次の2つを同時に回すものとして扱う。

- 外部最新情報 loop
  - AskJAN / EARN / JobAccess / Canada.ca / GOV.UK / EU などの更新を継続収集し、差分を product canon に反映する
- 実ケース評価 loop
  - representative case / field review / founder review を通じて、実際に使える出力へ絞り込む

### 1. Source refresh

- `knowledge:fetch-web`
- `knowledge:normalize`
- `knowledge:claims`
- 必要時だけ `knowledge:embed`

ここでは `何件集まったか` より、`どの法域 / guidance lane / employer lane が増えたか` を見る。

加えて、`どの外部 lane に最新差分がありそうか` `どの source family の extraction ルールが古びてきたか` を継続確認する。

### 2. Product feedback ingestion

- `配慮設計アシスト` の feedback を `references/jac/feedback/` に蓄積する
- `jac:feedback:analyze` で frame-level insight に変換する

ここでは `どのフレームが外したか` と `どの説明が使いやすかったか` を見る。

### 3. Evidence brief

- `jac:evidence:brief`
- `jac:eval:step4:brief`
- `jac:eval:step4:field`
- 出力先は `docs/nbl-workspace/ops/jac-evidence-briefs/YYYY-MM-DD.md`
- Step 4 eval の出力先は `docs/nbl-workspace/ops/jac-step4-evals/YYYY-MM-DD.md`
- field review brief の出力先は `docs/nbl-workspace/ops/jac-step4-field-reviews/YYYY-MM-DD.md`
- field review の入力先は `references/jac/eval/field-reviews/`

ここでは最低限次を返す。

- source coverage snapshot
- stale / low-coverage risks
- external source update focus
- feedback hotspot
- representative Step 4 case snapshot
- field review snapshot
- Step 4 phase gate
- infographic / video candidate lane
- next refresh command

### 4. Report traceability

最終レポートでは、少なくとも次を返せるようにする。

- claim の要約
- evidence lane
- source URL または source file
- confidence / risk / partiality
- missing context
- sample excerpt

つまり、`提案だけ` でなく `どの条件で使えるか` を返す。

## Exit rule for Step 4 cleanup

Step 4 の source-family cleanup は無限に続けない。

- representative case が全件 pass
- artifact audit が全件 pass
- `related_reading` が target 以下
- top hotspot source が concentration target 以下
- same-source duplicate が 0
- founder boundary が空

この条件を満たしたら、status を `evaluation_ready` とし、以後は追加 cleanup より `外部最新情報の差分確認 / 代表ケース評価 / 実ケース評価 / founder review` を主軸にする。

field review はこの `実ケース評価` の正本入力として使う。

## International source lanes to keep active

JAC の定常監視対象は、少なくとも次の lane を維持する。

- US employer accommodation process
  - JAN / EEOC 系
- US employer-side practice toolkit
  - EARN 系
- UK reasonable adjustments and Access to Work
  - GOV.UK 系
- EU reasonable accommodation and proportionate burden
  - EU / Your Europe 系
- Australia employer adjustment guidance
  - JobAccess 系
- Canada accommodation process improvement
  - Canada.ca 系

## Latest official signals worth treating as active lanes

- JAN の accommodation process は、request recognition, documentation minimization, trial accommodation, monitoring cadence まで employer process を返している。
- GOV.UK は reasonable adjustments と Access to Work を分けており、`職場調整` と `助成/実務支援` を別 lane で読める。
- EU は reasonable accommodation を `disproportionate burden` と対で説明しており、制度比較の軸になる。
- Canada は Better Accommodation Project により、accommodation process 自体の改善を policy experimentation として扱っている。

## Public asset extraction rule

source refresh のたびに、次の候補 lane を 1-3 件だけ返す。

- infographic candidate
- short video / narration candidate
- employer-facing FAQ candidate

候補化の条件は次。

- 単発ニュースではなく、構造的 signal がある
- 配慮設計アシストの判断軸と接続できる
- public-safe に説明できる
- diagnosis stereotype を強めない

## Founder boundary

Founder に返すのは次だけでよい。

- 新しい source lane を product canon に入れるか
- public asset 化する候補をどれにするか
- 最終レポートでどこまで source detail を見せるか

それ以外の refresh, synthesis, brief 化までは AI 側で進める。
