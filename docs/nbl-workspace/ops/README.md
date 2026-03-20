# Ops Outputs

NBL の recurring operating artifacts を置く場所。

基本方針:

- daily snapshot は `daily-snapshots/`
- weekly loop review は `weekly-loop-reports/`
- monthly compounding は `monthly-compounding/`

Founder が毎日追う前提ではない。
daily は運用の現在地、weekly は Founder が赤信号だけ見ればよい review を想定する。

実行コマンド:

- `npm run ops:snapshot:daily`
- `npm run ops:snapshot:weekly`
- `npm run ops:snapshot:now`
