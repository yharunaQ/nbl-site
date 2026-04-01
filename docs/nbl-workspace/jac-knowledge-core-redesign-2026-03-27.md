# JAC知識基盤の再設計メモ 2026-03-27

## 位置づけ

このメモは、現在の JAC の実装を全面的に壊すためのものではない。
むしろ、すでに達成されている専門機能

- 自動タグ付け
- 追加質問
- 専門的見立て
- 有用な追加情報の提供
- 26フレームでの整理

を、今後も継続的に品質向上させるために、知識基盤の設計を初期段階で整理し直すための作業メモである。

中心仮説は次のとおり。

> JAC のコアプロダクトの信頼性は、AI が多様な情報を ICF の相互作用モデルの文脈で総合化し、利用可能な知識へ変換していることにある。

したがって、改善対象は first of all UI ではなく、`references` の雑多な情報をどう `利用可能な知識` に変換するかの中間設計である。

## 現状認識

### 1. `references` は豊富だが、役割の違う情報が同じ層に入っている

`references/references.md` が示す通り、現状の `references` には次のような異種情報が同居している。

- 調査分析データ
- 難病患者調査
- 支援機関の支援ノウハウ
- ハローワーク資料
- 海外含む web 情報
- 支援マニュアルやガイドライン

これは強みでもあるが、`生データ`、`支援ノウハウ`、`制度境界`、`参考資料` が同一レイヤーで扱われると、出力時に「根拠」と「参考情報」と「仮説」が混線しやすい。

### 2. 現状の related materials 問題は表示ではなく根拠階層の未分離が主因

現状の `jac-assess` は、有効化された知識ソースをほぼそのまま選びに行き、最後に citations と evidence details を UI に返している。

しかし、現行の `knowledge-claims` の状態を見ると、

- 総 claim 数: 4965
- partial claim: 4160
- `mixed` lane: 3114
- その `mixed` lane はすべて country=`unknown`, legalContext=`unspecified`

という構成になっている。

つまり、`local research 由来の有用な仮説` と `そのまま外に見せてよい根拠` が別れていない。
この状態で「関連資料」を出すと、

- 根拠らしく見えるが制度文脈が不明
- 仮説らしく扱うべき内容が引用の形で並ぶ
- 利用者にとって有用性より不安が勝つ

という問題が生じやすい。

### 3. 追加した地域支援エビデンスが、まだアプリの知識流路に乗っていない

`references/supporter/supports.md` は有用な構造化知識だが、現状のアプリ実装から直接参照されていない。
少なくとも現時点では、

- タグ推薦
- 追加質問
- 見立て
- 支援候補提示
- 根拠表示

のどこにも、このファイルが明示的に接続されていない。

これは重要で、今感じている「伝統的な障害者就労支援への適応の弱さ」は、知識不足というより `接続不足` の可能性が高い。

### 4. 伝統的な障害領域への適応は、データ欠如よりも活用の弱さが本体

`knowledge-claims` 上には、すでに

- 肢体不自由
- 知的障害
- 高次脳機能障害
- 内部障害
- 聴覚障害
- 視覚障害

などのラベルが相当数存在している。

したがって、弱さは「references にない」よりも、

- タグ体系
- 追加質問の生成ロジック
- 支援候補の出し方
- 根拠の優先順位づけ

が、難病・症状変動型の読み方に最適化されたまま、伝統的障害領域の支援構造へ十分変換できていないことにある。

## 再設計の基本方針

### 方針1. 全面 rewrite ではなく、知識基盤の中間層を再設計する

守るべきもの:

- 現在の UI 体験の進捗
- 26フレームという統合の骨格
- 既存の GLM / data2 / claims の蓄積

変えるべきもの:

- 情報ソースの分類
- 根拠の階層づけ
- ICF 相互作用への正規化
- 出力時の gating

### 方針1.5. 新しい並列基盤を増やすのではなく、既存パイプラインを正本として育てる

再点検の結果、現在の実装にはすでに

- sidecar metadata
- normalized records
- knowledge claims
- safety gate

という骨格がある。

したがって、最もクリアカットな方針は、

- まったく別の知識基盤を新設することではなく
- 既存の `normalize -> claim -> safety gate -> output` の流れを主軸として
- そこで扱う知識タイプと出力役割を明確化すること

である。

特に `noteType`, `riskLevel`, `mustPairWithRegionalSupport` のような sidecar metadata は、今後の設計にそのまま活かせる。

### 方針2. `references` を「読む場所」ではなく「変換前の原料置き場」とみなす

今後の知識基盤は次の 5 層に分けるのがよい。

1. `raw_sources`
   - 生資料、調査、web cache、原文、支援文書
2. `curated_observations`
   - 原料から抽出した観察事実
3. `interaction_claims`
   - ICF 相互作用モデルに沿って再記述した条件付き claim
4. `support_catalog`
   - 支援手段、機関連携、運用方法、制度的選択肢
5. `public_reference_packets`
   - 最後に利用者へ返してよい関連資料パッケージ

この分離がないと、raw source をそのまま public reference として見せてしまう。

### 方針3. 26フレームは最終表示形式ではなく、知識統合の canonical schema にする

26フレームは「説明の見た目」だけではなく、全専門機能の共通中間表現にするべきである。

つまり、

- タグ付け
- 追加質問
- 見立て
- 支援提案
- 関連資料提示

のすべてが、まず 26フレーム上のどこに情報が載るのかを通ってから出力される構造にする。

これにより、機能が増えても知識設計が散らばりにくくなる。

### 方針4. curated note は重要だが、直接根拠 claim と同列にしない

再点検で重要だと分かったのは、`curated_local_note` は今のパイプラインにすでに取り込める一方で、現状ではその内容がそのまま claim 化されやすいことである。

これは危険でもある。
なぜなら curated note には、

- 観察事実
- 実務上の解釈
- 規範的方針
- 推奨アクション

が同じ文書内に共存しやすいからである。

したがって第一原理上、次の原則を置くべきである。

> 編集的に再整理された知識は、重要であっても、観察事実そのものと同じ「根拠」扱いにはしない。

扱いとしては、

- `raw / observed evidence`
- `curated interpretation`
- `support catalog / operational design knowledge`

を明確に分ける必要がある。

## 再点検で追加した最重要補正

前回案の大筋は維持してよいが、次の 3 点は補正として明示しておく。

### 補正1. `supports.md` は「まず index に入れる」が先である

現時点では `supports.md` はアプリ実装から直接参照されていないだけでなく、index 生成物にもまだ反映されていない。

したがって、

- ファイルを置く
- 取り込みルールを作る
- index を再生成する
- 出力ロジックへ接続する

の順番を踏む必要がある。

### 補正2. support catalog は claim の一種ではなく、別 role を持つ知識として扱う

`supports.md` やハローワーク再整理ノートのような資料は、外向きの因果根拠というより

- 支援手段の目録
- 連携の設計原理
- 実装時の分岐知識

として強い。

よって、これらは `direct_basis` よりも

- `support_catalog`
- `operational_design_knowledge`
- `must_pair_with_regional_support`

のような role を持つ方が実態に合う。

### 補正3. 新しい gating を一から作るより、既存 safety gate を拡張する

現実装にはすでに、

- aggregated evidence 優位
- partial context
- specific case 不足

を見て strict / caution / normal を返す safety gate がある。

したがって最も筋の良い進め方は、

- safety gate を廃棄することではなく
- safety gate の判定結果を
  - 生成文面の制御
  - related materials の区分
  - UI の表示ラベル

まで使うように広げることである。

## 新しい知識オブジェクト案

今後の中核単位は `claim` 単体ではなく、次のような `interaction knowledge object` に寄せるのが望ましい。

```ts
type InteractionKnowledge = {
  id: string;
  sourceClass: 'raw' | 'curated' | 'policy' | 'case' | 'aggregated' | 'support_catalog';
  evidenceRole: 'direct_basis' | 'contextual_hint' | 'hypothesis_only' | 'related_reading';
  interactionLens:
    | 'difficulty_occurrence'
    | 'difficulty_resolution'
    | 'symptom_work_interaction'
    | 'support_need_formation';
  frameIds: string[];
  disabilityFacets: string[];
  conditionLabels: string[];
  supportTypes: string[];
  taskContexts: string[];
  environmentContexts: string[];
  personContexts: string[];
  institutionalContexts: string[];
  statement: string;
  usableWhen: string[];
  notUsableWhen: string[];
  missingContexts: string[];
  confidence: 'low' | 'medium' | 'high';
  publicSafe: boolean;
};
```

ポイントは `evidenceRole` と `publicSafe` を明示すること。
これがない限り、関連資料や根拠表示の改善は UI だけでは解決しない。

## 今後の出力設計

最終出力は少なくとも次の 3 つに分けるべきである。

### 1. 見立ての根拠

ここに出すのは、原則として次に限定する。

- `legal_policy`
- `case_practice`
- `employer_guidance`
- `aggregated_general`
- もしくは `publicSafe=true` の curated claim

### 2. 条件付き仮説

ここには、local research 由来の `mixed` や partial な知識を置く。
ただし表現は「根拠」ではなく、

- この条件ではこう読める
- 追加確認が必要
- この仮説は person/job/environment/support/time/institution が欠けている

という形に限定する。

### 3. 追加で読む資料

ここに初めて「関連資料」を置く。
目的は立証ではなく、

- 追加理解
- 制度確認
- 事例比較
- 支援機関との会話準備

であることを明示する。

この 3 分割だけでも、今の related materials の違和感はかなり軽減できる。

補足:

- `curated interpretation` は、原則としてこの 1 と 2 の中間に置く。
- public 向けには「条件付きの整理知」として見せ、直接根拠の顔をさせない。
- `support_catalog` は 2 または 3 に属し、単独で強い因果根拠としては扱わない。

## 伝統的障害領域への適応強化

次の改善は優先度が高い。

### 1. タグ体系を「症状中心」から「障害特性 x 就労場面 x 支援手段」へ広げる

現状タグは症状変動や認知負荷に強いが、今後は次を厚くする必要がある。

- 知的障害: 理解速度、手順保持、反復学習、職務定着
- 身体障害: 移動、姿勢、上肢操作、物理アクセス
- 聴覚障害: 情報取得経路、会議保障、電話代替、文字連絡
- 視覚障害: 視認性、読み上げ、拡大、紙と画面の切替
- 高次脳機能障害: 記憶、注意、遂行、失語、疲労

### 2. 支援候補を「個人配慮」だけでなく「地域支援活用」まで広げる

`supports.md` を使うなら、出力される支援候補は

- 職場内配慮
- 支援機関との連携
- 就労生活一体相談
- 職業評価
- 定着支援
- 企業アプローチ

まで含むべきである。

これにより、JAC は「職場配慮提案ツール」から「就労支援設計ツール」に一段上がる。

### 3. 追加質問を支援分岐のために使う

追加質問は症状精査だけでなく、次の分岐判断にも使うべきである。

- いま必要なのは職場調整か、就職支援か、定着支援か
- 個別配慮より前に、地域支援機関との接続が必要か
- 職務設計の問題か、制度利用の問題か、家族支援の問題か

## 最初の実装順

全面再設計ではなく、次の順で進めるのが安全。

### Step 0. 既存 pipeline を前提に、metadata と index の反映を整える

最低限ここを先にやる。

- `supports.md` を index 対象に入れる
- 必要なら sidecar metadata を付ける
- `knowledge:catalog` / `knowledge:normalize` / `knowledge:claims` を再生成する
- 取り込み結果が `normalized-records` と `claims` にどう現れるか確認する

### Step 1. source class と evidence role を導入する

最低限、

- `direct_basis`
- `conditional_hypothesis`
- `related_reading`

の 3 分類を入れる。
ただし再点検を踏まえると、実際には次の 4 分類にした方が安全である。

- `direct_basis`
- `conditional_hypothesis`
- `support_catalog`
- `related_reading`

まずは `mixed + unknown jurisdiction + partial` を `conditional_hypothesis` へ落とし、`curated_local_note` は `support_catalog` 寄りに寄せるだけでも効果が大きい。

### Step 2. `supports.md` を support catalog として正式接続する

ここは no-regret で着手できる。
少なくとも

- 支援候補生成
- 追加質問の分岐
- 26フレームの「支援」面

に接続する。

### Step 3. tags / followup / accommodations を 26フレーム経由に寄せる

いまは各機能が部分的に独立している。
これを

- input interpretation
- frame mapping
- question generation
- support ranking

の順に一本化する。

### Step 4. related materials を 3 段階表示へ変更する

最終表示を

- 根拠
- 条件付き仮説
- 追加で読む資料

に分ける。

ただし内部実装では、必要に応じて `support catalog` を第 2 群として差し込めるようにしておく。

## 結論

いま考えている方向性は妥当である。
しかも「全部を壊してやり直す」必要はない。

本当に見直すべきなのは、現在達成されている専門機能の背後にある知識変換の設計であり、

- 多様な情報をどう分類するか
- ICF 相互作用モデルへどう正規化するか
- どこまでを public-safe な根拠として返すか
- 伝統的障害領域の支援構造をどう支援カタログとして接続するか

である。

とくに重要なのは次の 2 点。

1. `local research の有用な仮説` を捨てないこと
2. それを `根拠不明の関連資料` として見せないこと

再点検を踏まえると、さらに次を加えるべきである。

3. `curated note や支援ノウハウ` を、観察事実と同列の根拠として扱わないこと
4. 新設基盤より、既存の metadata / index / safety gate を正本として育てること

つまり次の設計が必要である。

> 有用な仮説を豊かに持ち、支援実装の知恵も持ちつつ、外に返す根拠は厳密に絞る知識基盤

これが、JAC を trial の寄せ集めではなく、NBL のコアプロダクトとして継続発展させるための最初の設計になる。
