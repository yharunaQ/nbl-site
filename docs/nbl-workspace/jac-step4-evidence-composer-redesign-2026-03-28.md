# JAC Step 4 Evidence Composer Redesign

更新日: 2026-03-28
Status: implementation in progress

## 問題の再定義

今回の失敗は、`Step 4 の wording` や `web-cache のクリーニング量` が足りないことではなかった。

本質は、Step 4 がまだ

- `推論の中核`
- `最終表示の根拠整理`

で別々のレーンになっていたことにある。

その結果、

- Step 1-3 は consultation, tags, follow-ups, GLM, data2, support catalog, planner context を使ってかなり専門的に見える
- しかし Step 4 は `aiAssessment.citations` とその後処理に強く依存し、細い trace 表示に留まる
- 最終的に `JEED の1事例しか出ない` ような印象を与え、システム全体の信頼性を傷つける

というズレが起きた。

## 何が足りなかったか

今回の `Step 4 cleanup` は必要だったが、あくまで `reference lane の品質改善` だった。

足りなかったのは次の3点。

1. Step 4 専用の evidence composer
2. LLM 用 top evidence とは別の、Step 4 表示用 evidence pool
3. `claim + evidence_ids` ではなく、claims / records から直接組み立てる最終 payload

つまり、`最後の根拠表示` 自体が first-class object になっていなかった。

## 新しい方針

Step 4 は `citation の見せ方` ではなく、`専用 evidence composer` として再定義する。

### 原則

1. Step 4 は `後付けの citation trace` ではなく、server-built な evidence pack を返す
2. Step 4 の evidence pool は、LLM 推論用 top hit より広く取る
3. `根拠として使える情報` は `direct_basis` claims から直接組む
4. `実践の参考資料` は `related_reading + practical preview + support catalog` を役割別に返す
5. source diversity は Step 4 側で明示的に確保する
6. 根拠が薄い場合は、その不足を pack 自体に含めて返す
7. Step 4 の参考資料は、合意文書に書いた合理的配慮や支援を、実際にどう実施するか具体化する資料として返す

## 海外情報を日本語で返す位置づけ

この改修では、`海外情報を日本語で出す` ことを別機能として後付けしない。

それは Step 4 の中核要件として同時に扱う。

理由は次の通り。

- 海外 source の raw sentence は、そのままでは menu / boilerplate / vendor list と混ざりやすい
- 英語のまま最後に貼ると、内容が薄いだけでなく「本当に使える情報か」が分かりにくい
- 日本の相談支援の文脈では、`その資料をどう使うか` が日本語で先に見える必要がある

したがって、海外情報は次の順で扱う。

1. source family ごとに raw page を canonical unit へ変換する
2. canonical unit を `対話 / 試行 / 見直し` の用途に整理する
3. Step 4 では日本語の実務文として返す
4. 原文 URL と sample excerpt は traceability として残す

つまり、`翻訳` を最後の見せ方だけの問題として扱わず、`知識化` の一部として扱う。

## canonicalization の日本語要件

外部 source から抽出する単位は、単なる sentence ではなく、少なくとも次の日本語 field を持つ。

- `practical_title_ja`
- `practical_summary_ja`
- `usage_focus`
- `applicability_conditions_ja`
- `trace_excerpt_original`

これにより、AskJAN / AskEARN / JobAccess / Canada / UK / EU 由来の情報も、

- 何の場面に使う資料か
- まず何を確認する資料か
- どんな試行候補か
- 何を見直す資料か

を日本語で返せる。

## 今回の実装順

海外情報の日本語化は、次の順で進める。

1. AskJAN / JEED の canonicalization
2. Canada / JobAccess / AskEARN の canonicalization
3. Step 4 pack が canonicalized Japanese fields を優先表示する
4. 原文 excerpt は補助情報として残す

これにより、`海外情報を使いたい` と `最後の情報源が貧しい` を同じ改修で解く。

## 実装変更

### 1. agentic execution の返り値を二層化する

従来:

- `evidence`: LLM / safety gate / preview 共通の top hit

変更後:

- `evidence`: LLM と safety gate に使う compact pool
- `step4Evidence`: Step 4 用の wider and more diverse pool
- `step4ClaimIds`: `step4Evidence` から集めた matched claim ids

これにより、Step 4 は `top 16 hit の偶然` に縛られなくなる。

### 2. API で Step 4 evidence pack を生成する

`jac-assess` で assessment を作った後に、別途 `step4EvidencePack` を組む。

pack は少なくとも次を返す。

- `basisItems`
- `practicalReferenceItems`
- `supportCatalogItems`
- `supplementalReferenceItems`

ここでは `assessment.citations` を正本にしない。

代わりに、

- `step4ClaimIds`
- `step4Evidence`
- consultation context
- selected accommodations
- follow-up answers
- support catalog

を使って組む。

### 3. frontend は server-built pack を優先する

frontend では、既存の local composition は fallback に落とす。

優先順位:

1. `process.step4EvidencePack`
2. 旧 `buildStep4OutputModel(...)`

これで Step 4 の主表示は、内部整理と同じレーンに乗る。

## Basis 側の再構成ルール

`根拠として使える情報` は、次で作る。

1. `step4ClaimIds` から claim detail を取得
2. `direct_basis` かつ `public_safe=true` を候補にする
3. consultation / selected tags / follow-ups / selected accommodations / agreement に近い順に score
4. source diversity を保って bundle 化する

この時点では `LLM がその claim を citation に使ったか` を条件にしない。

## Reference 側の再構成ルール

`実践の参考資料` は、次で作る。

1. `step4Evidence` から practical preview を組む
2. `step4ClaimIds` から `related_reading` claim を抽出する
3. `support_catalog` は別 lane で維持する
4. `dialogue / trial / review` の使い分けを pack 側で保持する

これにより、`JEED の1事例しか見えない` 状態を break する。

## 今回の実装ゴール

今回のゴールは次の通り。

1. Step 4 が `aiAssessment.citations` 主導ではなくなる
2. Step 4 の basis / practical reference が wider pool から組まれる
3. frontend は server-built pack を表示する
4. representative eval / field review でこの新 pack を評価できる

## 成功判定

少なくとも次を満たすことを今回の成功判定とする。

- 同一ケースで `根拠として使える情報` が JEED 1件に固定されにくい
- `web-cache 由来の具体策ヒント` に複数 source family が出やすい
- `assessment.citations` を消しても Step 4 pack が成立する
- 代表ケース回帰が落ちない

## 反省点

Step 4 cleanup に長く取り組んだこと自体は無駄ではなかった。

ただし、それは `evidence composer の前提整備` であり、本体ではなかった。

今後は、

- cleanup
- ranking tweak
- wording polish

を本体と見なさず、`server-built evidence composer` を本体として扱う。
