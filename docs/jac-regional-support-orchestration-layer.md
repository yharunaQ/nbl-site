# JAC 地域支援オーケストレーション共通レイヤー

更新日: 2026-03-07

## 位置づけ

- 26フレーム本体は、JAC利用者が直面する就業課題の型を整理する。
- ただし、実際の支援や配慮の実施しやすさは、
  JAC単独ではなく地域支援体制との接続で大きく変わる。
- そのため、地域支援オーケストレーションは、
  JAC本体とは別にまとめつつ、全カード共通の実装レイヤーとして連結しておく。

## このレイヤーで扱うこと

- JACが担う範囲
- 地域専門機関・専門支援者が担う範囲
- ケース会議、支援計画、情報共有同意、役割分担
- 企業提案と同時に示すべき地域支援体制
- 定着支援の継続接触、再評価条件、戻し先

## なぜ別ガイド候補なのか

- 内容の重心が「困りごとの型」ではなく、
  「誰がどう支えるか」という実装運用にあるため
- JAC相談者向けのガイドと、
  地域支援者向けの運用ガイドでは読み手と責務が異なるため

## それでもJACに連結する理由

- 企業単独では難しい配慮や支援を提案する際に、
  地域支援体制を同時提示できるかどうかで実施可能性が大きく変わる
- JAC利用者にとっては、
  「この提案は現場で回るのか」を判断する補助線になる

## 接続方法

- 各カードに共通で、
  - `企業内で担う部分`
  - `地域支援者が担う部分`
  - `困った時の戻し先`
  を付ける
- ただし詳細運用は、別ガイドに切り出して管理する

## 直近で影響が強いカード

- `p-support-service-navigation`
- `p-worktrial-transition`
- `p-manager-checkin`
- `p-disclosure-boundary`
- `p-mental-fluctuation-plan`

## 直近の実務判断

- 26フレーム本体をいきなり増やすより、
  まずこの共通レイヤーを整えた方が、
  JAC利用者の「実施しやすさ」判断を大きく改善できる
- 最小骨格は `docs/jac-regional-support-orchestration-guide.md` に生成し、
  `references/jac/layer-disposition.json` の判定と接続して管理する
- 実務テンプレートは
  `docs/jac-regional-support-role-sheet-template.md`、
  `docs/jac-support-connection-route-template.md`、
  `docs/jac-case-conference-trigger-template.md`
  を生成し、同じ判定ソースから更新する
- 記入例は `docs/jac-regional-support-template-examples.md` に置き、
  テンプレートが机上だけでなく記入可能かを確認する
