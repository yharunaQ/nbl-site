# Partner Ranking Logic

更新日: 2026-03-16

## Purpose

4 conversation 後に、`誰を next partner candidate として advance するか` を感覚でなく固定ルールで決める。

## Scoring Frame

- 8 項目
- 各 1-3 点
- 合計 24 点満点

## Gate Conditions

次の 2 つは合計点とは別に必須で見る。

- boundary readiness
- low automation pressure

## Decision Rule

### Advance

- total score が 18 以上
- boundary readiness が 2 以上
- low automation pressure が 2 以上
- knockout condition がない

### Hold

- total score が 14-17
- または critical context が不足
- または gate condition が一部未確認

### Drop

- total score が 13 以下
- または knockout condition がある
- または boundary readiness が 1
- または low automation pressure が 1

### Comparison Only

- C1 に使う
- legitimacy / learning fit は高いが、commercial lead にはしない

## Why This Matters

- total score だけで選ぶと、`感じがいい相手` が上に来やすい
- NBL では boundary fit と automation pressure が致命的になりやすい
- したがって、gate condition を total score より優先する
