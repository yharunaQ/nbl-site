# Regional Support Positioning Rule

## Core rule

- 地域支援は、職業的課題そのものの直接解決手段ではない。
- まず見るべきは、本人と職場の関係の中で何が職業的課題になっているか、どの個別調整が必要かである。
- 地域支援は、その個別調整の設計・実施・継続・再評価を支える支援連携の文脈として扱う。

## Why this matters

- 地域支援を独立した解決レーンとして出すと、本人と職場のあいだの因果関係理解が崩れる。
- 逆に、企業内調整だけに閉じると、継続支援、再評価、制度・生活面の接続が抜けやすい。
- したがって、JAC の中核論理では `個別調整 -> 支援連携` の順序を固定する。

## Operational implication

- 追加質問:
  職場での個別調整を見極める質問を主にしつつ、必要に応じて「それを地域支援がどう支えるか」を問う。
- 支援候補:
  地域支援を単独提案せず、どの個別調整を支える連携候補かをセットで示す。
- 根拠表示:
  地域支援は `direct basis` ではなく、`support linkage context` として示す。

## Current implementation note

- `lib/jac/regionalSupportPositioning.ts` を正本とし、prompt、support catalog、evidence presentation、JAC UI 表示文言はそこから参照する。
