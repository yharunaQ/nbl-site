# NBL Codex Operating Model

更新日: 2026-03-15

## 目的

NBL サイトを「見た目の改修」から始めず、公開判断と事業判断を先に固める。

これは単なる web サイトの設計論ではなく、NBL が

- 何者として動くか
- 何を public promise にするか
- 何を hold するか
- AI チームと人の協働をどう扱うか

を決める、経営・運営方針の整理でもある。

現状のリポジトリは、少なくとも次のものが混在している。

- NBL の公開サイト
- JAC の試用版やガイド導線
- 調査・知識基盤の実験
- guidebook や支援資料の draft
- 構想段階の offering や internal note

この状態では、単一の AI に「いい感じに直して」と頼むより、役割を分けた仮想経営会議で公開判断を進める方が安全で速い。

## 現在の見立て

### Operating Assumption

- NBL は、常設の人間スタッフ組織としてではなく、AI 運営のバーチャルチームとして設計する
- public サイトでは、人が常時相談を受ける組織のように見せない
- CTA、offer、運営主体の書き方は `AI チームが何を担うか` を軸に再設計する

### Why This Is A Management Decision

- どの offer を出せるかは staffing と operating model に依存する
- JAC、Resources、研究資料の位置づけは revenue と trust の設計に直結する
- 人が担う前提で promise すると、実態とのずれが事業リスクになる
- NBL を `個別相談事業` と見るか `社会OS事業` と見るかで、product、distribution、site architecture が根本から変わる
- したがって、サイト copy は経営方針の下位表現として扱う

### Observation

- ホームページは企業サイト、プロダクト紹介、資料販売導線、PoC 提案、調査コンテンツが同時に並んでいる。
- `pages/index.tsx` と `components/` には、すでに public に見える表現がある。
- `(仮)` の offer 名、価格未定、PoC 募集、alpha/beta 表現が混在している。
- リポジトリには docs / references / guidebook / lab 系の素材が多く、public / internal の線引きが未固定に見える。
- 「本来出すべきコンテンツ」は、まだファイル自体がそろっていない。

### Inference

- 今必要なのはデザイン刷新より、`何を public truth として出すか` の確定。
- サイトの第一目的を 1 つに絞らないと、訪問者にも運営側にも判断コストが高い。
- NBL は障害・難病就労支援に関わるため、断片的な知見や draft をそのまま public 化すると、誤解や過度な一般化のリスクがある。

### Recommendation

- まず仮想経営会議を立てる。
- その会議体が `public / internal / hold` を決める。
- その後で、承認済みページだけを実装する。
- その際、`人の相談窓口` を前提にした文言は避け、AI チームの役割と限界を明示する。

## NBL 向けの役割分担

Codex では、1 つのスレッドに全部背負わせるのではなく、複数スレッドを並列に動かして役割を固定する。

### 1. Managing Director

- 役割: 事業として何を優先公開するかを決める
- 主な論点:
  - 誰に向けたサイトか
  - 何を今売るのか
  - 何をまだ出さないのか
  - どの導線を最優先にするか
- 出力:
  - 優先 audience
  - 今期の offer
  - hold する offer
  - 成功指標

### 2. Editorial Director

- 役割: サイトの情報設計と公開順序を決める
- 主な論点:
  - トップページが担う役割
  - 1階層目のページ構成
  - public に出す文章の粒度
  - docs / research / product の見せ分け
- 出力:
  - sitemap
  - page brief
  - content backlog

### 3. Customer Experience Lead

- 役割: 訪問者の不安と期待から導線を設計する
- 主な論点:
  - 企業、支援者、当事者、研究協力者のどれを主 audience にするか
  - 初回訪問で理解できるか
  - 問い合わせ前に何が必要か
- 出力:
  - audience priority
  - jobs-to-be-done
  - primary journey

### 4. Evidence and Ethics Lead

- 役割: 障害・難病就労支援領域の誤解、偏見、過度な一般化を防ぐ
- 主な論点:
  - observation / inference / normative / recommendation の分離
  - person / job / environment / support / time / institution / evidence の不足確認
  - 診断決め打ち表現の排除
- 出力:
  - 公開上の注意点
  - high-risk content の hold 判定
  - rewrite 指示

### 5. Communications Director

- 役割: public 向けに伝わる言葉へ落とし直す
- 主な論点:
  - 難しさを残しつつ、難解にしない
  - internal language と public language を分ける
  - キャッチコピーと説明文の整合
- 出力:
  - hero copy
  - page copy skeleton
  - CTA 文面

### 6. Product and Implementation Lead

- 役割: 承認済みの構想だけを実装へ変換する
- 主な論点:
  - どのページから着手するか
  - 一時的に隠すものは何か
  - 実装とコンテンツ整備の依存関係
- 出力:
  - 実装順序
  - component/page change list
  - release checklist

### 7. Chief of Staff

- 役割: 全スレッドの統合
- 実務:
  - 会議アジェンダを切る
  - 各役割の output を比較する
  - 決定事項を `docs/nbl-workspace/decision-log.md` に残す
  - 実装チケットへ落とす

この役は、通常のメイン Codex スレッドが担う。

## 今の Codex らしい使い方

### 原則

- 1 スレッド = 1 役割
- 1 スレッドには、その役割に必要なファイルだけ渡す
- 結論は必ずメインスレッドで統合する
- 実装スレッドは、承認済み文書だけを前提に動かす

### 推奨の進め方

1. `Managing Director` スレッドで、今期の public posture を決める
2. `Editorial Director` と `CX Lead` を並列で走らせる
3. `Evidence and Ethics Lead` が公開候補を review する
4. `Communications Director` が public copy に変換する
5. `Product and Implementation Lead` がサイト変更へ落とす
6. メインスレッドが統合し、実装タスクを確定する

### 各ラウンドの成果物

- Round 1: `docs/nbl-workspace/content-inventory.md`
- Round 2: `docs/nbl-workspace/decision-log.md`
- Round 3: audience / sitemap / page brief
- Round 4: approved copy
- Round 5: implementation patch

## 最初の 2 週間でやること

### Phase A: Freeze and Inventory

- 新しい public 表示を増やさない
- 既存ページ、components、docs を棚卸しする
- 各項目を `public_now / public_after_rewrite / internal_only / hold` に分ける

### Phase B: Decide the Site Posture

- サイトを誰向けに作るかを 1 位から 3 位まで決める
- `今すぐ AI チームで始められること` を 1 つ決める
- 研究・プロダクト・資料・実験の見せ方を分ける

### Phase C: Build the Approved Site

- まずトップページと主要 2 から 4 ページだけ作る
- 未承認の資料や draft はリンクしない
- docs / guidebook / lab は、承認されるまで別導線に隔離する

## 初期の公開構成案

現時点では、次のような絞り方が現実的。

- Home: NBL の立ち位置、AI 運営モデル、主 CTA
- What We Do: 支援内容と進め方
- Evidence and Approach: 研究と設計思想
- About: 運営主体、ビジョン、AI チームとしてのスタンス

以下は hold 候補として先に review する。

- alpha/beta の product 導線
- `(仮)` を含む offering
- price 表示
- draft guidebook や未完成 docs への導線
- lab / governance / experiment の public 露出

## 重要な guardrail

- 障害・難病就労支援の記述は、一般論を断定調で出さない
- 制度、法域、運用、個別配慮を混同しない
- 「研究素材」と「対外的な約束」を分ける
- asset 未整備のページは作らない
- missing content を UI でごまかさない

## 次の一手

この運用で始めるなら、最初の実作業は実装ではなく `content inventory` から入る。

その後に、トップページの public posture を先に決める。
