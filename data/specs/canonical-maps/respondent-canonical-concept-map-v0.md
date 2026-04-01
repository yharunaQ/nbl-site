# Respondent Canonical Concept Map v0

対象:

- `disability_employment.xlsx`
- `Nanbyo_kanja.xlsx`

目的:

- respondent 側の 2 調査を無理に同表へ潰さず、共通概念と非同値部分を分ける
- FCHMA の構造推論に必要な最小 crosswalk を先に固定する

## 共通概念

### respondent_profile

- employment:
  - `ID`
  - `2性別`
  - `2年齢`
  - `2住所`
- nanbyo:
  - `ID`
  - `Q02`
  - `Q03`

備考:

- 年齢は exact age と age band で粒度が違うため、共通 schema では `age_band_canonical` を別途作る

### health_condition

- employment:
  - `分類名`
  - `3障害`
  - `手帳有無`
- nanbyo:
  - `Q05_1`
  - `Q05_2_1`
  - `Q05_2_2`
  - `Q05_2_3`
  - `Q05_2_4`
  - `xQ05`

備考:

- employment 側は障害・疾病の広いカテゴリ中心
- nanbyo 側は難病法・総合支援法・小慢・その他難病の disease label が厚い
- 共通化の主軸は `health_condition_raw`, `health_condition_group`, `icd_candidate`

### work_status

- employment:
  - `8就労経験`
  - `9仕事内容`
- nanbyo:
  - `Q11_1`
  - `Q11_2`
  - `Q16_2`

備考:

- employment は仕事内容と就労形態が混在
- nanbyo は就業状況と具体的仕事内容が分かれている

### activity_and_participation_difficulty

- employment:
  - `7*` 系列
  - `11*` 系列
- nanbyo:
  - `Q15`
  - `Q16`
  - `xQ15`
  - `xQ16`
  - `Q05〜10` 関連の症状・制限記述

備考:

- employment は細粒度の structured items が豊富
- nanbyo は difficulty narrative と disclosure / support context の結合が強い

### accommodation_and_support

- employment:
  - `10*` 系列
  - `5*` 系列
  - `6*` 系列
- nanbyo:
  - `Q15*`
  - `Q16〜19` 関連の支援ニーズ記述
  - 支援利用や専門支援への意見記述

備考:

- employment は workplace accommodation の structured coverage が厚い
- nanbyo は支援ニーズと disclosure/context が濃い

### disclosure_and_explanation

- employment:
  - `12病気や障害の説明`
  - `12必要な環境整備等の説明`
- nanbyo:
  - `Q15_*`
  - `xQ15-3`

備考:

- nanbyo 調査の方が disclosure 構造を深く持つ
- respondent case reasoning では重要な bridge concept になる

### self_efficacy_and_future_outlook

- employment:
  - `13*`
  - `14*`
  - `15*`
  - `16*`
  - `17*`
  - `18*`
  - `19仕事ができるか`
- nanbyo:
  - support need/free-text wish fields
  - training / qualification hopes

備考:

- employment 側は心理・見通しの構造化項目がかなり厚い
- nanbyo 側は希望や要望が記述に寄る

### narrative_units

- employment:
  - `5記述`
  - `6記述`
  - `７記述`
  - `9その他`
  - `9記述`
  - `10記述`
  - `11記述`
  - `自由記述`
- nanbyo:
  - `xQ01`
  - `xQ05`
  - `xQ10`
  - `xQ11`
  - `xQ15-3`
  - `xQ15`
  - `xQ16`
  - `xQ6`
  - `xQ20`
  - `xQ21`
  - `xQ7`

## 非同値だが関係が近い概念

### employment のみ相対的に厚いもの

- workplace accommodation detail
- post-employment task-level difficulty
- broad disability cross-category comparison
- self-efficacy / life satisfaction / SOC 系の構造化尺度

### nanbyo のみ相対的に厚いもの

- disease制度区分
- disclosure / non-disclosure reasons
- work-treatment balance
- rare disease specific support needs
- diagnosis category nuance

## 初期 canonical field 提案

- `respondent_uid`
- `source_dataset`
- `age_band_canonical`
- `gender_canonical`
- `region_type_canonical`
- `health_condition_raw`
- `health_condition_group`
- `icd_candidate`
- `job_status_canonical`
- `job_type_canonical`
- `activity_difficulty_bundle`
- `participation_difficulty_bundle`
- `accommodation_gap_bundle`
- `support_use_bundle`
- `disclosure_status_canonical`
- `future_outlook_bundle`
- `narrative_unit_ids`

## 実装上の原則

- 共通化は `同じ質問番号` ではなく `同じ概念役割` で行う
- 非同値なものは無理に merge せず `dataset_specific_*` へ逃がす
- FCHMA の主分析は canonical field と narrative unit の併用で行う
