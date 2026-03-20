# 就業共通設計 化 実装仕様（26フレーム一括反映）

更新日: 2026-03-02
参照:
- `docs/jac-common-work-design-charter.md`
- `docs/jac-common-work-design-roadmap.md`
- `docs/guidebook/frame-rewrite-dictionary-v1.md`

## 1. 反映対象

- Webガイド:
  - `pages/jac/guide.tsx`
- 冊子:
  - `docs/guidebook/manuscript-reader-edition.md`
  - `docs/guidebook/frames-26-layer-summary.md`
  - `docs/guidebook/jac-editorial-agent-workflow.md`
  - `docs/guidebook/jac-editorial-agent-packet.md`
- 自動生成:
  - `scripts/ebook/generate-guidebook-reader-edition.mjs`
  - `scripts/ebook/build-guidebook-editorial-packet.mjs`
  - `scripts/jac/build-common-design-rewrite-dictionary.mjs`

## 2. 編集単位（1フレームごと）

各フレームで必ず更新する項目:
- 名称（カードタイトル）
- 0.まず3行で把握する の「何が起きるか」
- 最初の方針（ポイント）
- 選ぶ条件（境界）
- 関連フレーム導線

## 3. 書き換えルール

- ルールA: 主語を属性固定から設計課題へ移す
  - 例: 「〇〇障害では」→「この業務条件では」
- ルールB: 断定を条件付きへ変換する
  - 例: 「〜になる」→「〜なりやすい」「〜のリスクが上がる」
- ルールC: ポイントは運用手順で書く
  - 例: 「配慮する」ではなく「週次で〇〇を確認し、閾値超過時に△△へ切替」
- ルールD: 個別最適化導線を残す
  - person/job/environment/support/time/institution/evidence を削除しない

## 3.1 共通辞書スキーマ（運用）

- 単一ソース:
  - `references/jac/common-work-design-copy.json`
- 生成:
  - `npm run -s jac:rewrite:copy`
- 必須フィールド:
  - `title`: 26要素をMECEに表す短い要素名
  - `situation`: 「人を選別せず仕事側を先に設計する」思想を含む説明
  - `disabilityEmploymentConnection`: 多様性の例としての接続（典型障害類型）
  - `quickBundle.standardized`: 共通設計として標準運用化する施策
  - `quickBundle.individualized`: 条件に応じて個別調整する施策
- 追加レイヤーフィールド:
  - `legalPolicyGuardrail.summary/checks/escalation`: 法域差を26フレーム本体へ混ぜ込まないための補助線
  - `regionalSupportOverlay.summary/jacRole/regionalRole/returnPath`: 企業単独で重い配慮を地域支援体制と一緒に示すための補助線
- レビュー前提:
  - 上記2レイヤーは全26カードに薄く載せられるが、
    冊子本文へ厚く入れる前に `docs/jac-layer-review-sheet.md` で重点5カードを先に確認する
  - 判定結果は `references/jac/layer-disposition.json` を単一ソースとして持ち、
    `docs/jac-layer-disposition-matrix.md` に可読化してから本文反映へ進む
  - 地域支援オーケストレーションを別ガイドへ逃がす部分は、
    `docs/jac-regional-support-orchestration-guide.md` に骨格を持ち、
    カード本文には最小補助線だけ残す
  - 実務テンプレートは同じ判定ソースから生成し、
    `docs/jac-regional-support-role-sheet-template.md`、
    `docs/jac-support-connection-route-template.md`、
    `docs/jac-case-conference-trigger-template.md`
    を単独で更新できるようにする
  - 記入例は `docs/jac-regional-support-template-examples.md` に置き、
    仮想事例でテンプレートの埋まり方と不足項目を確認する
  - 更新確認は `docs/jac-26frame-update-review-memo.md` にまとめ、
    ガイドと冊子のどこを見れば今回改修の成果が分かるかを明示する
  - 冊子を出版物として仕上げる段階では、
    `docs/guidebook/jac-editorial-agent-workflow.md` を基準に
    `Evidence Steward / Developmental Editor / Copywriter / Art Director / Web Translator`
    の役割で重点5章を先に編集する
  - その際の実務パケットは `docs/guidebook/jac-editorial-agent-packet.md` に集約し、
    Web ツール開発の延長文体を冊子へ持ち込まないための別工程として扱う

## 4. 監査チェック（反映後に必須）

- `MECE`: 隣接フレームと境界が曖昧化していないか
- `Grounding`: data2/raw_data/web-cache/GLM 根拠と矛盾していないか
- `Bias`: 診断決め打ち・過度一般化がないか
- `Actionability`: 1週間以内に運用開始できるポイントか

## 5. 実装順序（固定）

1. 辞書確定（名称・要約・ポイント）
2. 編集エージェント・スプリント
3. 冊子本文更新
4. Webガイド更新
5. 自動生成スクリプト更新
6. 監査・差分レビュー

## 5.1 往復前提の運用補足

- 重点カード見本では、`内容 → レイアウト → 内容再調整` の往復を前提にする
- レイアウト改善で見えた内容不足は、辞書や本文へ戻して回収する
- `3レイヤー` は26フレームの全体構造として固定し、`カード型 / 色分け` は重点見本での読解補助として別レイヤーで扱う
- 新ソース追加で、特定カードに固有の実務論点が見えた場合は、全26へ一括展開する前に重点カード見本で検証する
  - 例: `p-manager-checkin` に askEARN / JAN 由来の `集中相談窓口 / 集中予算 / 外部専門相談先` を先行反映する

## 6. 差分レビュー観点

- 表現が強すぎて個別性を潰していないか
- 共通化しすぎて法制度文脈を失っていないか
- 導線が「共通設計→個別相談」になっているか

## 7. 完了判定

- 26/26フレームで辞書との一致を確認
- ガイドと冊子で同一名称・同一要約方針を確認
- 重大監査指摘 0 件
