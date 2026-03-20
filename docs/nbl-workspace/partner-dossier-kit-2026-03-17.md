# Partner Dossier Kit

更新日: 2026-03-17

## Purpose

実名候補が入った後、discovery が scattered notes に戻らないように、`1 candidate = 1 dossier` と `1 round = 1 readout` を固定する。

## What This Kit Adds

- `candidate dossier`
  - 候補ごとの基本情報、fit hypothesis、boundary risk、score snapshot、next action を 1 枚に集約する
- `round readout`
  - 3-4 conversation をまとめて、advance / hold / drop / comparison only を founder-readable に返す
- `advancement memo`
  - 1 候補を次段階へ進めるときに、理由、未解決リスク、必要な founder input を短くまとめる

## Operating Rules

- live candidate が入ったら、最初に `candidate dossier` を作る
- observation / inference / decision を混ぜない
- boundary readiness と low automation pressure は、dossier と round readout の両方で gate として残す
- 3-4 conversation が終わったら、必ず `round readout` を作る
- founder への共有は、チャットの断片ではなく `round readout` か `advancement memo` を使う

## Why This Matters

- 候補が実名になると、network convenience と会話の印象で判断がぶれやすい
- NBL では boundary fit が弱い相手を advance すると、後で大きく drift しやすい
- founder が全部のメモを追わなくても、1 枚読めば現在地が分かる状態が必要

## Completion Condition

- 各 live candidate に dossier が 1 つある
- first 4 conversation 後に round readout が 1 つある
- advance 候補には advancement memo がある

## Next Move

- 実名候補が入り次第、A1 / A2 / B1 / C1 の各 slot に dossier を作る
- 4 conversation 後に provisional ranking を round readout へ閉じる
