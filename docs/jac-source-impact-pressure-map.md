# 26フレームへの Source Impact 圧力マップ

更新日: 2026-03-07

## 位置づけ

- 目的:
  - `web-cache` と curated local note の更新が、現行の JAC 26フレームに対して
    「微修正で吸収できる範囲」なのか、
    「フレーム境界や別レイヤー追加を検討すべき範囲」なのかを切り分ける。
- 判定の見方:
  - `microcopy_ok`: 現行26フレームに概ね吸収済み。基本は文言・導線調整で対応可能。
  - `copy_review`: 境界説明や関連フレーム導線の見直しが必要。
  - `frame_review_candidate`: 26フレーム本体の境界またはクラスタ再点検候補。
  - `risk_gated_manual_review`: source 自体は重要だが、現状の claim は high risk で自動判定外。人手で位置づける。

## 現時点の結論

- `askearn_employer_guidance`:
  - 自動監査では `microcopy_ok`。
  - `eligibleClaims 129 / coveredClaims 129 / coverageRate 1.0`
  - 含意:
    - askEARN 追加そのものは、現行26フレームを直ちに壊してはいない。
    - 雇用主 guidance の増強としては、現行カードの説明強化で吸収可能。
- `germany_antidiscrimination_work`:
  - 自動監査では `frame_review_candidate`。
  - `eligibleClaims 18 / coveredClaims 12 / uncoveredClaims 6 / coverageRate 0.667`
  - 含意:
    - 26フレームで拾えていないことが明示的に出たのは、現時点では主に法政策・差別禁止論点。
- `nbl_curated_local_notes`:
  - 自動監査では `risk_gated_manual_review`。
  - `totalClaims 47 / highRiskClaims 47`
  - 含意:
    - 「26フレームで拾えていない」とはまだ断定できない。
    - ただし、地域支援体制・役割分担・定着支援オーケストレーションの横断論点は、
      現行26フレーム本体とは別軸の圧力をかけている。
- `uk_headway_brain_injury_work`:
  - 自動監査では `risk_gated_manual_review`。
  - `totalClaims 55 / highRiskClaims 55`
  - 含意:
    - 高次脳機能障害関連の知見を本格に使う前に、
      まず noise 除去と evidence lane の再確認が必要。

## 圧力の種類

### 1. 法政策圧力

- source:
  - `germany_antidiscrimination_work`
- 典型的な未吸収論点:
  - 障害以外の保護属性も含む差別禁止
  - 宗教・性別登録・ケア責任など、就業設計カードではなく権利保護として扱うべき論点
  - 苦情申立て、労組・人事・法的相談へのエスカレーション
- 26フレームへの示唆:
  - これは「新カードを足す」より、
    `法政策ガードレール層` を別に持つ方が整合的。
  - 現行カードの `jurisdictionNotes` と `個別相談へ渡す条件` の層を厚くする方が筋がよい。

### 2. 地域支援オーケストレーション圧力

- source:
  - `nbl_curated_local_notes`
- 典型的な論点:
  - JAC と地域専門支援者の役割分担
  - ケース会議、情報共有同意、支援計画、継続接触
  - 企業配慮案と地域支援体制をセットで提示すること
  - 定着支援を生活・体調・通院・対人まで含めて運用すること
- 26フレームへの示唆:
  - これは 1 枚の新カードより、
    `26フレーム全体の実装レイヤー` に近い。
  - 影響を受けやすい既存カード:
    - `p-support-service-navigation`
    - `p-worktrial-transition`
    - `p-manager-checkin`
    - `p-disclosure-boundary`
    - `p-mental-fluctuation-plan`
  - したがって、本体クラスタの再設計というより、
    `地域支援体制オーバーレイ` または `実装フレーム` を別レイヤーとして追加する案が有力。

### 3. 高次脳機能 guidance 圧力

- source:
  - `uk_headway_brain_injury_work`
- 現状:
  - claim は全部 high risk で自動判定外。
  - 一部は navigation / directory 的な文章が残っており、まだ判断材料として荒い。
- 26フレームへの示唆:
  - 直ちに「新フレーム不足」と結論しない。
  - 先に source のノイズ除去と claim 品質改善を優先する。
  - その後、
    - `p-higher-brain-memory-support`
    - `p-developmental-switch-load`
    - `p-safety-critical-operations`
    - `p-support-service-navigation`
    で本当に吸収できるかを再判定する。

## こちらで見てほしい判断点

- 判断1:
  - 法政策論点は、26フレーム本体ではなく `別の法政策ガードレール層` として扱う方針でよいか。
- 判断2:
  - 地域支援オーケストレーションは、26枚目以降の新カード候補ではなく、
    `全カード共通の実装補助レイヤー` として扱う方針でよいか。
- 判断3:
  - 高次脳機能 guidance は、現時点では構造判断に使わず、
    source cleanup 後に再審査する方針でよいか。

## 現時点の実務判断

- 「26フレームで拾えていないのは法政策系だけか」という問いには、
  - `明示的に未吸収と出たのは、現時点では主に法政策系`
  - `ただし curated note の地域支援オーケストレーション圧力は別軸で残っている`
  と答えるのが正確。
- したがって、
  - askEARN 追加だけを理由に 26フレーム全面改訂へ進む段階ではない
  - しかし「微修正で全部済む」ともまだ言い切れない
  - 先に `法政策は外付けレイヤー化` と `地域支援オーバーレイ化` の可否を決めるのが順当

## 次アクション案

- 1. 法政策ガードレール層の最小仕様を 1 枚にまとめる
- 2. 地域支援オーケストレーションを 26フレーム共通オーバーレイとして定義する
- 3. `uk_headway_brain_injury_work` の cleanup 後に source impact を再実行する
