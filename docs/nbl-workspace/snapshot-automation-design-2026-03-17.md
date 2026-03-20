# Snapshot Automation Design

更新日: 2026-03-17
Status: hidden review operating design

## Why this round exists

`Operating Loops` と `Value Compounding` で、NBL が定常ループで回るべきことは見えた。

次に必要なのは、`実際に何を毎日 / 毎週見るのか`、`どこに書き出すのか`、`Founder に戻す条件は何か` を固定すること。

## Working conclusion

最初に自動運転へ落とすべき recurring job は 2 つでよい。

1. daily snapshot
2. weekly loop report

monthly compounding dashboard は次段でよい。
まずは `日々の現在地` と `週次の構造レビュー` が回るだけでも、Founder chat が trigger になる割合をかなり減らせる。

## Daily snapshot

目的:

- 何が増えたか
- 何が止まっているか
- 次にどの loop を進めるべきか
- Founder boundary が発生しているか

読む範囲:

- `content-inbox/`
- `content-review/`
- `docs/nbl-workspace/`
- `pages/review/`
- `lib/content/`
- `docs/nbl-workspace/decision-log.md`
- `content-inbox/founder-site-feedback-log.md`
- `content-inbox/founder-new-content-log.md`

出力先:

- `docs/nbl-workspace/ops/daily-snapshots/YYYY-MM-DD.md`

出力セクション:

1. what changed
2. what accumulated
3. blocked / drifting
4. next best round
5. Founder boundary
6. evidence pointers

Founder に見せる条件:

- `Founder boundary` が空でない
- build / lint / safety の赤信号がある
- public promise の変更が必要

## Weekly loop report

目的:

- 5 loop をまとめて見て、どこに複利が立っているかを確認する
- consulting drift を早めに見つける
- 次週の priority を1段整理する

読む範囲:

- 当週の daily snapshots
- `decision-log.md`
- `partner` 関連の pipeline / dossier / outreach 系文書
- `pages/review/` と `lib/content/` の主要更新
- Founder input logs

出力先:

- `docs/nbl-workspace/ops/weekly-loop-reports/YYYY-MM-DD.md`

出力セクション:

1. loop-by-loop status
2. artifacts created
3. compounding signals
4. risks and drifts
5. Founder boundary this week
6. next 7 days

Founder に見せる条件:

- `Founder boundary this week` が空でない
- `high-risk boundary` が出た
- `continue / adjust / stop` を前倒しで求めるべき signal がある

## Recommended cadence

- daily snapshot: 平日朝に 1 回
- weekly loop report: 毎週月曜朝に 1 回

夜に走らせるより、朝に `今日どこから始めるか` が見える方が NBL には合う。

## Red flags

次のときは Founder boundary に載せる。

- public に本当に約束する文言が変わる
- 実名候補や外部連絡が必要
- 支援 / 権利 / 合理的配慮で unsafe automation pressure が上がる
- build break や routing break で public candidate が壊れている
- 7日以上 `next best round` が更新されていない
- artifact が増えず、都度対応だけが増えている

## Artifacts to prepare now

- `docs/nbl-workspace/ops/daily-snapshots/`
- `docs/nbl-workspace/ops/weekly-loop-reports/`
- `docs/nbl-workspace/ops/monthly-compounding/`
- template files for daily / weekly / monthly

## Automation-ready specs

### NBL Daily Snapshot

- job: 日々の進捗、詰まり、次ラウンドを1枚にする
- write path: `docs/nbl-workspace/ops/daily-snapshots/YYYY-MM-DD.md`
- rule:
  - その日すでに file があっても update は可
  - Founder boundary が空なら `none` と明記
  - next best round は必ず 1 つに絞る

### NBL Weekly Loop Report

- job: 5 loop の status と drift を weekly review にまとめる
- write path: `docs/nbl-workspace/ops/weekly-loop-reports/YYYY-MM-DD.md`
- rule:
  - 各 loop を `moving / blocked / waiting / drift risk` のどれかで判定
  - Founder boundary がなければ `no founder action needed` と明記
  - next 7 days は 3 項目以内に絞る

## Immediate next use

- `/review/snapshot-automation` を recurring automation の基準ページにする
- 将来の app automation を作るときは、この設計をそのまま prompt と output path に落とす
- Founder は daily を常時読まなくてよく、weekly だけ赤信号ベースで見ればよい
