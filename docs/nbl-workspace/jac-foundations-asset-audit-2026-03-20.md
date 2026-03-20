# JAC Foundations Asset Audit

更新日: 2026-03-20
対象: `public/jac-foundations` と `content-inbox` の対応図版

## 結論

2026-03-20 時点で、`public/jac-foundations` の主要図版を inbox 側と照合したところ、

- 一致:
  - `health-layer.png`
  - `transition-layer.png`
  - `operation-layer.png`
  - `place-design.png`
  - `employment-normalization.png`
- 不一致:
  - `condition-map.png`
  - `quality-metrics.png`

`condition-map.png` と `quality-metrics.png` は public 側が古い版を持っていたため、inbox 側の最新版へ差し替える。

## 照合結果

### 一致していたもの

- `public/jac-foundations/health-layer.png`
  - source: `content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/体調レイヤー.png`
- `public/jac-foundations/transition-layer.png`
  - source: `content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/就職移行レイヤー.png`
- `public/jac-foundations/operation-layer.png`
  - source: `content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/職場運用レイヤー.png`
- `public/jac-foundations/place-design.png`
  - source: `content-inbox/地平2_エンゲージメント/多様な個人が働きやすい社会設計メモ.png`
- `public/jac-foundations/employment-normalization.png`
  - source: `content-inbox/地平1_隔離・分離から包摂へ/日本における変革課題/障害者雇用の正常化（企業へのしわ寄せ解消）.png`

### 不一致だったもの

- `public/jac-foundations/condition-map.png`
  - source: `content-inbox/地平2_エンゲージメント/仕事のコンディションマップA3.png`
  - inbox 側更新日時: `2026-03-18 18:14`
- `public/jac-foundations/quality-metrics.png`
  - source: `content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準/障害者雇用の質の指標.png`
  - public と source で MD5 不一致

## 補足

今回の照合は、現在 `jac-foundations` ページで直接参照している主要図版を対象に行った。
今後 inbox 側の差し替えが増えるなら、`public/jac-foundations` の source map を別ファイルとして持った方が再確認しやすい。
