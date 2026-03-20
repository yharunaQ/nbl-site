# 就業共通設計 化 実行ランブック

更新日: 2026-03-02

## 0. 前提

- 基準文書:
  - `docs/jac-common-work-design-charter.md`
  - `docs/jac-common-work-design-implementation-spec.md`
  - `docs/jac-common-work-design-audit-checklist.md`
- 辞書:
  - `docs/guidebook/frame-rewrite-dictionary-v1.md`

## 1. 辞書更新

```bash
npm run -s jac:rewrite:dict
npm run -s jac:rewrite:copy
npm run -s jac:review:layers
npm run -s jac:review:decisions
npm run -s jac:guide:regional-support
npm run -s jac:guide:regional-support:templates
npm run -s jac:guide:regional-support:examples
npm run -s jac:review:update-memo
npm run -s ebook:guidebook:editorial:packet
```

確認:
- 26件あること
- 新名称案が就業共通設計の表現になっていること
- `references/jac/common-work-design-copy.json` が更新されていること
- `docs/jac-layer-review-sheet.md` が更新されていること
- `docs/jac-layer-disposition-matrix.md` が更新されていること
- `docs/jac-regional-support-orchestration-guide.md` が更新されていること
- `docs/jac-regional-support-role-sheet-template.md` が更新されていること
- `docs/jac-support-connection-route-template.md` が更新されていること
- `docs/jac-case-conference-trigger-template.md` が更新されていること
- `docs/jac-regional-support-template-examples.md` が更新されていること
- `docs/jac-26frame-update-review-memo.md` が更新されていること
- `docs/guidebook/jac-editorial-agent-packet.md` が更新されていること

## 1.5 レイヤー重点レビュー

対象:
- `p-support-service-navigation`
- `p-worktrial-transition`
- `p-manager-checkin`
- `p-disclosure-boundary`
- `p-mental-fluctuation-plan`

確認:
- 法政策差がフレーム本体の説明に見えていないか
- 地域支援レイヤーが JAC / 企業 / 地域支援者 の責務を混ぜていないか
- `keep_in_card / move_to_shared_layer / move_to_separate_guide` のどれかで判定できるか

出力:
- `references/jac/layer-disposition.json`
- `docs/jac-layer-disposition-matrix.md`
- `docs/jac-regional-support-orchestration-guide.md`
- `docs/jac-regional-support-role-sheet-template.md`
- `docs/jac-support-connection-route-template.md`
- `docs/jac-case-conference-trigger-template.md`
- `docs/jac-regional-support-template-examples.md`
- `docs/jac-26frame-update-review-memo.md`

## 2. 編集スプリント（冊子→ガイドの間）

対象:
- `docs/guidebook/jac-editorial-agent-workflow.md`
- `docs/guidebook/jac-editorial-agent-packet.md`
- `docs/guidebook/jac-editorial-focus5-spread-draft.md`

ルール:
- 冊子本文をそのまま磨くのではなく、重点5章を `Evidence Steward / Developmental Editor / Copywriter / Art Director / Web Translator` で分業する
- 読みやすさのために、法政策差・地域支援体制・戻し先を落とさない
- 冊子で確定した見せ方だけを Web へ逆輸入する

## 2.5 往復前提の改善ループ

前提:
- この工程は `内容を決めてからデザインする` 一方向ではなく、`内容補強 → レイアウト試作 → 読解確認 → 内容の再補強` を往復する
- レイアウト改善で新しく見える内容不足は、後戻りではなく発見として扱う
- `3レイヤー` は26フレーム全体の情報構造、`カード型 / 配色` は重点カード見本の誌面上の読み分けとして別管理する
- `重点5カード見本` は26カードへ広げる前の先行実装プロトタイプであり、現時点では独立した最終成果物として扱わない
- 独立版が必要な場合は、26カード本体の派生成果物として `重点5カード抜粋版` を別途出す

重点確認:
- 新ソース追加後、重点カードで `この論点が入っていない` と見えたら、先に重点見本へ戻してから26フレームへ広げる
- 例:
  - `p-manager-checkin` では askEARN / JAN 由来の `集中相談窓口 / 集中予算 / 外部専門相談先` が入っているか確認する
  - `p-support-service-navigation` では相談窓口・制度・期限・責任者が1枚で見えるか確認する

1周の手順:
1. 根拠確認: 追加ソースや claim から、重点カードに入れるべき具体論点を拾う
2. 内容反映: カード本文に `問題の切り分け / 具体的取組み / 戻し先` を入れる
3. 誌面試作: カード型、見出し、配色、余白を調整して見本を更新する
4. 読解確認: レイアウトを見て、抽象的すぎる項目、見分けにくい項目、重複項目を洗い出す
5. 差分戻し: 内容・構造・レイアウトのどこを直すべきかを切り分けて次周回へ送る

完了条件:
- 内容面の指摘が `具体不足` から `表現の磨き` 段階へ移る
- 読者が `何のカードか / 近いカードとどう違うか / 最初に何を動かすか` を視線移動だけで追える

## 3. 本文反映（冊子→ガイドの順）

対象:
- `docs/guidebook/manuscript-reader-edition.md`
- `docs/guidebook/frames-26-layer-summary.md`
- `pages/jac/guide.tsx`

ルール:
- まず冊子で文言確定
- 次にガイドへ同じ語彙を反映

## 4. 監査

必須監査:
- `docs/jac-common-work-design-audit-checklist.md` に基づく目視監査
- 知識更新後の source impact 監査:
  - `npm run -s jac:audit:source-impact`
  - `askearn_employer_guidance` や curated note が `frame_review_candidate` または `risk_gated_manual_review` なら、微修正扱いにしない
- 既存品質ゲート（必要に応じて）:
  - `npm run -s typecheck`
  - `npm run -s jac:audit:wording`
  - `npm run -s jac:audit:readiness`

## 5. 承認判定

承認条件:
- 重大リスク（high）0件
- 26/26で境界説明あり
- ガイドと冊子の表現不一致なし

## 6. リリース前最終確認

- ガイド表示確認: `/jac/guide`
- 冊子表示確認: `docs/guidebook/dist/jac-guidebook-reader-edition.html`
- 「共通設計 → 個別相談」導線の文言確認
