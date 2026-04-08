"""
Build ICF wide-format feature matrix for employment_survey_3000.

Design:
  - Clustering inputs: Q11群 activity difficulty profile + Q16/17群 personal factors (SOC)
  - Health context: disability broad category (分類名) — for interpretation within clusters
  - Outcomes (NOT used for clustering): Q7群 pre-employment challenge resolution
                                        Q11群 post-employment unresolved challenge count

Output:
  data/analysis_ready/respondents/employment_survey_3000/v1/icf_wide_features.csv
  data/analysis_ready/respondents/employment_survey_3000/v1/icf_outcomes.csv
  data/analysis_ready/respondents/employment_survey_3000/v1/icf_feature_manifest.json
"""

import csv
import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(
    os.path.dirname(__file__), '../../data/analysis_ready/respondents/employment_survey_3000'
)
SRC_V0 = os.path.join(DATA_DIR, 'v0', 'structured_features.csv')
OUT_DIR = os.path.join(DATA_DIR, 'v1')
os.makedirs(OUT_DIR, exist_ok=True)

# ── Q11 value code meaning ─────────────────────────────────────
# 1 = 問題があったが解決済 (resolved)
# 2 = 未解決課題有        (unresolved)
# 3 = 特に問題無          (no problem)
# 4 = 仕事に不必要        (not needed)
#
# For clustering: use 3-state encoding (unresolved / resolved / no-problem-or-na)
# We treat code 4 same as no-problem for feature purposes.

# ── Q7 value code meaning ─────────────────────────────────────
# 1 = 特に問題なくできた  (no problem)
# 2 = 課題があったが解決済 (resolved)
# 3 = 課題が未解決        (unresolved)
# 4 = 特に必要なし        (not needed)

# ── SOC (Q16/Q17) value code meaning ─────────────────────────
# ordinal 1-5 (1=全く違う, 5=その通り)

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']


def parse_normalized(nv: str) -> list[str]:
    """Split '1+2' → ['1', '2']"""
    return [x.strip() for x in nv.split('+') if x.strip()]


def has_code(nv: str, code: str) -> bool:
    return code in parse_normalized(nv)


def safe_numeric(nv: str) -> float | None:
    """Return float for single-code ordinal, None otherwise."""
    codes = parse_normalized(nv)
    if len(codes) == 1:
        try:
            return float(codes[0])
        except ValueError:
            return None
    return None


print('Loading structured_features.csv ...')
respondents: dict[str, dict] = defaultdict(dict)

with open(SRC_V0, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rid = row['respondent_id']
        grp = row['question_group']
        var = row['raw_name']
        nv = row['normalized_value']

        bucket = respondents[rid]

        # ── Q11 activity difficulties (clustering input) ─────────
        if grp == '就職後の職業的課題':
            key_un = f'q11_{var}_unresolved'
            key_re = f'q11_{var}_resolved'
            key_ok = f'q11_{var}_no_problem'
            # codes can be multi-select; any occurrence of code 2 = unresolved
            bucket[key_un] = max(bucket.get(key_un, 0), 1 if has_code(nv, '2') else 0)
            bucket[key_re] = max(bucket.get(key_re, 0), 1 if has_code(nv, '1') else 0)
            bucket[key_ok] = max(bucket.get(key_ok, 0), 1 if (has_code(nv, '3') or has_code(nv, '4')) else 0)

        # ── Q7 pre-employment challenges (outcome) ───────────────
        elif grp == '就職前や就職活動の職業的課題の状況':
            key_un = f'q7_{var}_unresolved'
            key_re = f'q7_{var}_resolved'
            bucket[key_un] = max(bucket.get(key_un, 0), 1 if has_code(nv, '3') else 0)
            bucket[key_re] = max(bucket.get(key_re, 0), 1 if has_code(nv, '2') else 0)

        # ── Q16/Q17 SOC personal factors (clustering input) ─────
        elif grp == 'SOC（首尾一貫感覚）':
            val = safe_numeric(nv)
            if val is not None:
                key = f'soc_{var}'
                # average if multi-response (rare)
                if key not in bucket:
                    bucket[key] = val
                else:
                    bucket[key] = (bucket[key] + val) / 2

        # ── Disability broad category (context) ─────────────────
        elif var == '分類名':
            # normalized_value is like '09+44+48+66'
            # Codes 01-09 = 9 broad disability categories (position in labels_joined)
            # 01=視覚障害, 02=聴覚・平衡, 03=肢体不自由, 04=内部障害, 05=知的障害
            # 06=精神障害, 07=発達障害, 08=高次脳機能障害, 09=難病
            BROAD_CODE_TO_CAT = {
                '01': '視覚障害', '02': '聴覚障害', '03': '肢体不自由',
                '04': '内部障害', '05': '知的障害', '06': '精神障害',
                '07': '発達障害', '08': '高次脳機能障害', '09': '難病',
                # Some records use single digit
                '1': '視覚障害', '2': '聴覚障害', '3': '肢体不自由',
                '4': '内部障害', '5': '知的障害', '6': '精神障害',
                '7': '発達障害', '8': '高次脳機能障害', '9': '難病',
            }
            codes = parse_normalized(nv)
            for code in codes:
                cat = BROAD_CODE_TO_CAT.get(code)
                if cat:
                    bucket[f'dis_{cat}'] = 1

        # ── Age / gender (personal factors context) ──────────────
        elif var == '2性別':
            val = safe_numeric(nv)
            if val is not None:
                bucket['sex_code'] = val  # 1=男, 2=女, 9=not reported (typical)

        elif var == '2年齢':
            val = safe_numeric(nv)
            if val is not None:
                bucket['age'] = val

print(f'  Loaded {len(respondents)} respondents')

# ── Collect all feature column names ────────────────────────────
all_clustering_cols: list[str] = []
all_outcome_cols: list[str] = []

# Sample one respondent to collect keys
sample = next(iter(respondents.values()))
for k in sorted(sample.keys()):
    if k.startswith('__'):
        continue
    if k.startswith('q11_'):
        all_clustering_cols.append(k)
    elif k.startswith('q7_'):
        all_outcome_cols.append(k)
    elif k.startswith('soc_'):
        all_clustering_cols.append(k)
    elif k.startswith('dis_'):
        all_clustering_cols.append(k)
    elif k in ('sex_code', 'age'):
        all_clustering_cols.append(k)

# Collect across all respondents to get complete set
clustering_col_set: set[str] = set()
outcome_col_set: set[str] = set()
context_col_set: set[str] = set()

for bucket in respondents.values():
    for k in bucket:
        if k.startswith('__'):
            continue
        if k.startswith('q11_'):
            clustering_col_set.add(k)
        elif k.startswith('q7_'):
            outcome_col_set.add(k)
        elif k.startswith('soc_') or k.startswith('dis_') or k in ('sex_code', 'age'):
            clustering_col_set.add(k)

clustering_cols = sorted(clustering_col_set)
outcome_cols = sorted(outcome_col_set)

print(f'  Clustering features: {len(clustering_cols)}')
print(f'  Outcome features:    {len(outcome_cols)}')

# ── Write icf_wide_features.csv (clustering inputs) ────────────
features_path = os.path.join(OUT_DIR, 'icf_wide_features.csv')
print(f'Writing {features_path} ...')

with open(features_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id'] + clustering_cols)
    writer.writeheader()
    for rid, bucket in sorted(respondents.items()):
        row = {'respondent_id': rid}
        for col in clustering_cols:
            if col.startswith('dis_'):
                row[col] = bucket.get(col, 0)
            else:
                row[col] = bucket.get(col, '')
        writer.writerow(row)

print(f'  Written: {len(respondents)} rows × {len(clustering_cols)} features')

# ── Write icf_outcomes.csv ───────────────────────────────────────
outcomes_path = os.path.join(OUT_DIR, 'icf_outcomes.csv')
print(f'Writing {outcomes_path} ...')

with open(outcomes_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id'] + outcome_cols)
    writer.writeheader()
    for rid, bucket in sorted(respondents.items()):
        row = {'respondent_id': rid}
        for col in outcome_cols:
            row[col] = bucket.get(col, '')
        writer.writerow(row)

print(f'  Written: {len(respondents)} rows × {len(outcome_cols)} outcomes')

# ── Write manifest ───────────────────────────────────────────────
manifest = {
    'version': 'v1',
    'dataset': 'employment_survey_3000',
    'respondent_count': len(respondents),
    'feature_design': {
        'clustering_features': {
            'count': len(clustering_cols),
            'groups': {
                'q11_activity_difficulty': {
                    'description': '就職後の職業的課題 — 未解決/解決済/問題無 の三値バイナリ (36変数×3)',
                    'columns': [c for c in clustering_cols if c.startswith('q11_')]
                },
                'soc_personal_factors': {
                    'description': 'SOC（首尾一貫感覚） — 対処スキル・将来展望・自己効力感 (Q16/Q17, 10項目, 5段階)',
                    'columns': [c for c in clustering_cols if c.startswith('soc_')]
                },
                'disability_category': {
                    'description': '障害種類（大分類一熱エンコード）',
                    'columns': [c for c in clustering_cols if c.startswith('dis_')]
                },
                'demographics': {
                    'description': '性別・年齢',
                    'columns': [c for c in clustering_cols if c in ('sex_code', 'age')]
                }
            }
        },
        'outcome_features': {
            'count': len(outcome_cols),
            'description': '就職前/就職活動時の職業的課題 — 未解決/解決済 バイナリ (Q7群, 13変数×2)',
            'note': 'クラスタリングには使用しない。クラスター内の傾向分析・仮説生成に使用する。',
            'columns': outcome_cols
        }
    },
    'icf_mapping': {
        'activity_and_participation': 'q11_* (就職後の課題: 注意・読み書き・計算・対人・移動・操作等)',
        'personal_factors': 'soc_* (SOC: 対処スキル・将来展望) + demographics',
        'environmental_factors': 'NOT included in clustering features — analyze within clusters using Q10/Q5/Q6',
        'health_condition': 'dis_* (障害大分類) + disability detail in codebook'
    },
    'outcome_coding': {
        'q11_unresolved': 'code 2 = 未解決課題有 → 1, else 0',
        'q11_resolved': 'code 1 = 問題があったが解決済 → 1, else 0',
        'q11_no_problem': 'code 3 or 4 (特に問題無 / 仕事に不必要) → 1, else 0',
        'q7_unresolved': 'code 3 = 課題が未解決 → 1, else 0',
        'q7_resolved': 'code 2 = 課題があったが解決済 → 1, else 0'
    }
}

manifest_path = os.path.join(OUT_DIR, 'icf_feature_manifest.json')
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f'Written manifest: {manifest_path}')
print()
print('Done. Next step: run build_icf_clustering.py to re-cluster with these features.')
