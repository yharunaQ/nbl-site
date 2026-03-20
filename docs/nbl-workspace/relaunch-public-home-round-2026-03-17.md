# Relaunch Public Home Round

更新日: 2026-03-17
Status: hidden review implementation draft

## Why this round exists

`/review/relaunch-home` は方向性の整理としては十分だが、完成版トップとしての実画面にはまだ下りていなかった。

そのため、新生NBLの本流として、`temporary public site を置き換える将来の Home` を hidden review で実装する。

## Working aim

- 未来思想だけのページにしない
- 障害就労の narrow site にも見せない
- public-safe top より一歩進んだ、完成版トップに近い構造を作る
- そのまま `/` 差し替えの母体にできる component にする

## Structure

1. Hero
2. Core Position
3. What We Build Now
4. How The Site Improves
5. Why Disability/Work First
6. Connected Streams
7. Trust And Boundaries
8. Entry Paths

## Implementation note

- `components/RelaunchPublicHome.tsx` を実体にして、review route から呼ぶ
- public 差し替え時は、この component をそのまま `/` に近い場所へ流用できるようにする
- `AIがすごい` の自己申告でなく、更新、学習、境界の visible surface を一段追加する
