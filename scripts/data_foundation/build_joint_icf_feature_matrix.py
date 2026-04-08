"""
Build joint ICF wide-format feature matrix for employment_survey_3000 + nanbyo_survey_4000.

Strategy: unified feature space, dataset-specific features are NaN for the other dataset.

Feature groups:
  [emp] q11_*_unresolved / _resolved   — 36×2 = 72  (employment only)
  [nan] q16_5_*_unresolved / _resolved — 9×2  = 18  (nanbyo only)
  [nan] q10_*_severity                 — 12        (nanbyo only: functional impairment)
  [nan] q13_*_unresolved / _resolved   — 5×2  = 10  (nanbyo only: job readiness)
  [shr] soc_*                          — 10 (emp) / 2 (nan, inverted scale)
  [shr] dis_*                          — 9 broad disability categories

Output:
  data/analysis_ready/joint_icf/v1/joint_wide_features.csv
  data/analysis_ready/joint_icf/v1/joint_outcomes.csv
  data/analysis_ready/joint_icf/v1/joint_feature_manifest.json
"""

import csv
import json
import os
from collections import defaultdict

BASE = os.path.join(os.path.dirname(__file__), '../..')
EMP_SF = os.path.join(BASE, 'data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv')
NAN_SF = os.path.join(BASE, 'data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/joint_icf/v1')
os.makedirs(OUT_DIR, exist_ok=True)

# ── Value code decoders ──────────────────────────────────────────
# employment Q11:  1=解決済, 2=未解決, 3=問題無, 4=不必要
# employment Q7:   1=問題なし, 2=解決済, 3=未解決, 4=必要なし
# nanbyo Q16_5/Q15_2/Q13:  1=経験なし, 2=解決済, 3=やや未解決, 4=全く未解決

def parse_norm(nv: str) -> list[str]:
    return [x.strip() for x in nv.split('+') if x.strip()]

def has(nv: str, *codes: str) -> int:
    vals = parse_norm(nv)
    return 1 if any(c in vals for c in codes) else 0

def safe_float(nv: str) -> float | None:
    vals = parse_norm(nv)
    if len(vals) == 1:
        try:
            return float(vals[0])
        except ValueError:
            return None
    return None

# Broad disability categories (code → label) for employment_survey 分類名
EMP_DIS_CODES = {
    '01': '視覚障害', '1': '視覚障害',
    '02': '聴覚障害', '2': '聴覚障害',
    '03': '肢体不自由', '3': '肢体不自由',
    '04': '内部障害', '4': '内部障害',
    '05': '知的障害', '5': '知的障害',
    '06': '精神障害', '6': '精神障害',
    '07': '発達障害', '7': '発達障害',
    '08': '高次脳機能障害', '8': '高次脳機能障害',
    '09': '難病', '9': '難病',
}

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']

# nanbyo Q09_4 (身体障害手帳の種別) → broad disability category mapping
NAN_BODY_DIS = {
    '視覚障害': '視覚障害',
    '聴覚障害': '聴覚障害',
    '平衡機能障害': '聴覚障害',
    '上肢障害': '肢体不自由',
    '下肢障害': '肢体不自由',
    '体幹機能障害': '肢体不自由',
    '心臓機能障害': '内部障害',
    '腎臓機能障害': '内部障害',
    '呼吸器機能障害': '内部障害',
    '膀胱・直腸機能障害': '内部障害',
    '小腸機能障害': '内部障害',
    'HIVによる免疫機能障害': '内部障害',
    '肝臓機能障害': '内部障害',
}


# ════════════════════════════════════════════════════════════════
# EMPLOYMENT SURVEY
# ════════════════════════════════════════════════════════════════
print('Loading employment_survey structured_features ...')
emp_respondents: dict[str, dict] = defaultdict(dict)

with open(EMP_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rid = f"emp_{row['respondent_id']}"
        grp = row['question_group']
        var = row['raw_name']
        nv = row['normalized_value']
        b = emp_respondents[rid]

        # Q11 activity difficulties (post-employment) → clustering
        if grp == '就職後の職業的課題':
            b[f'q11_{var}_unresolved'] = max(b.get(f'q11_{var}_unresolved', 0), has(nv, '2'))
            b[f'q11_{var}_resolved']   = max(b.get(f'q11_{var}_resolved', 0),   has(nv, '1'))

        # Q7 pre-employment challenges → outcome
        elif grp == '就職前や就職活動の職業的課題の状況':
            b[f'emp_q7_{var}_unresolved'] = max(b.get(f'emp_q7_{var}_unresolved', 0), has(nv, '3'))
            b[f'emp_q7_{var}_resolved']   = max(b.get(f'emp_q7_{var}_resolved', 0),   has(nv, '2'))

        # SOC personal factors → clustering (10 items, scale 1-5, higher=better)
        elif grp == 'SOC（首尾一貫感覚）':
            val = safe_float(nv)
            if val is not None:
                key = f'soc_emp_{var}'
                b[key] = (b[key] + val) / 2 if key in b else val

        # Disability broad category
        elif var == '分類名':
            for code in parse_norm(nv):
                cat = EMP_DIS_CODES.get(code)
                if cat:
                    b[f'dis_{cat}'] = 1

        # Demographics
        elif var == '2性別':
            v = safe_float(nv)
            if v is not None:
                b['sex_code'] = v
        elif var == '2年齢':
            v = safe_float(nv)
            if v is not None:
                b['age_code'] = v

        b['dataset'] = 'employment'

print(f'  {len(emp_respondents)} employment respondents')


# ════════════════════════════════════════════════════════════════
# NANBYO SURVEY
# ════════════════════════════════════════════════════════════════
print('Loading nanbyo_survey structured_features ...')
nan_respondents: dict[str, dict] = defaultdict(dict)

with open(NAN_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rid = f"nan_{row['respondent_id']}"
        grp = row['question_group']
        var = row['raw_name']
        nv = row['normalized_value']
        b = nan_respondents[rid]

        # Q16_5 post-employment challenges → clustering (nanbyo equivalent of Q11)
        # codes: 1=経験なし, 2=解決済, 3=やや未解決, 4=全く未解決
        if grp == '就職後の職業的課題':
            b[f'q16_5_{var}_unresolved'] = max(b.get(f'q16_5_{var}_unresolved', 0), has(nv, '3', '4'))
            b[f'q16_5_{var}_resolved']   = max(b.get(f'q16_5_{var}_resolved', 0),   has(nv, '2'))

        # Q13 job readiness (personal factors: self-efficacy/readiness) → clustering
        elif grp == '仕事の自信・職業準備状況':
            b[f'q13_{var}_unresolved'] = max(b.get(f'q13_{var}_unresolved', 0), has(nv, '3', '4'))
            b[f'q13_{var}_resolved']   = max(b.get(f'q13_{var}_resolved', 0),   has(nv, '2'))

        # Q10 functional impairment severity → clustering
        # ordinal 1(none)→5(severe), use as numeric severity
        elif grp == '機能障害' and var.startswith('Q10_'):
            val = safe_float(nv)
            if val is not None:
                b[f'q10_{var}_severity'] = val

        # Q14_3/4 SOC (2 items, inverted scale: 1=全くそのとおり → 5=全く違う)
        # Invert so that higher = better coping, consistent with employment SOC
        elif grp == 'SOC（首尾一貫感覚）':
            val = safe_float(nv)
            if val is not None:
                val_inv = 6.0 - val  # now 1=全く違う, 5=全くそのとおり
                key = f'soc_nan_{var}'
                b[key] = (b[key] + val_inv) / 2 if key in b else val_inv

        # Q15_2 pre-employment challenges → outcome
        elif grp == '就職活動の職業的課題の状況' and var.startswith('Q15_2'):
            b[f'nan_q15_{var}_unresolved'] = max(b.get(f'nan_q15_{var}_unresolved', 0), has(nv, '3', '4'))
            b[f'nan_q15_{var}_resolved']   = max(b.get(f'nan_q15_{var}_resolved', 0),   has(nv, '2'))

        # Disability: all nanbyo = 難病
        elif var == 'Q05_1':
            b['dis_難病'] = 1

        # Additional disability types from body disability certificate
        elif var == 'Q09_4':
            # label_text is the description
            label = row.get('label_text', '')
            cat = NAN_BODY_DIS.get(label)
            if cat:
                b[f'dis_{cat}'] = 1

        # Demographics
        elif var == 'Q03':
            v = safe_float(nv)
            if v is not None:
                b['sex_code'] = v
        elif var == 'Q02':
            v = safe_float(nv)
            if v is not None:
                b['age_code'] = v

        b['dataset'] = 'nanbyo'

# All nanbyo respondents have 難病
for b in nan_respondents.values():
    b['dis_難病'] = 1

print(f'  {len(nan_respondents)} nanbyo respondents')


# ════════════════════════════════════════════════════════════════
# COLLECT FEATURE COLUMNS
# ════════════════════════════════════════════════════════════════
all_respondents = {**emp_respondents, **nan_respondents}
total = len(all_respondents)
print(f'\nTotal: {total} respondents')

clustering_col_set: set[str] = set()
outcome_col_set: set[str] = set()

for b in all_respondents.values():
    for k in b:
        if k in ('dataset',):
            continue
        is_cluster = (
            k.startswith('q11_') or
            k.startswith('q16_5_') or
            k.startswith('q10_') or
            k.startswith('q13_') or
            k.startswith('soc_') or
            k.startswith('dis_') or
            k in ('sex_code', 'age_code')
        )
        is_outcome = (
            k.startswith('emp_q7_') or
            k.startswith('nan_q15_')
        )
        if is_cluster:
            clustering_col_set.add(k)
        elif is_outcome:
            outcome_col_set.add(k)

clustering_cols = sorted(clustering_col_set)
outcome_cols = sorted(outcome_col_set)

# Add dataset indicator as non-clustering metadata
print(f'Clustering features: {len(clustering_cols)}')
print(f'  emp Q11: {sum(1 for c in clustering_cols if c.startswith("q11_"))}')
print(f'  nan Q16_5: {sum(1 for c in clustering_cols if c.startswith("q16_5_"))}')
print(f'  nan Q10: {sum(1 for c in clustering_cols if c.startswith("q10_"))}')
print(f'  nan Q13: {sum(1 for c in clustering_cols if c.startswith("q13_"))}')
print(f'  SOC: {sum(1 for c in clustering_cols if c.startswith("soc_"))}')
print(f'  dis: {sum(1 for c in clustering_cols if c.startswith("dis_"))}')
print(f'Outcome features: {len(outcome_cols)}')


# ════════════════════════════════════════════════════════════════
# WRITE OUTPUTS
# ════════════════════════════════════════════════════════════════
features_path = os.path.join(OUT_DIR, 'joint_wide_features.csv')
print(f'\nWriting {features_path} ...')
with open(features_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id', 'dataset'] + clustering_cols)
    writer.writeheader()
    for rid, b in sorted(all_respondents.items()):
        row = {'respondent_id': rid, 'dataset': b.get('dataset', '')}
        for col in clustering_cols:
            row[col] = b.get(col, '')
        writer.writerow(row)
print(f'  {total} rows × {len(clustering_cols)} features')

outcomes_path = os.path.join(OUT_DIR, 'joint_outcomes.csv')
print(f'Writing {outcomes_path} ...')
with open(outcomes_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id', 'dataset'] + outcome_cols)
    writer.writeheader()
    for rid, b in sorted(all_respondents.items()):
        row = {'respondent_id': rid, 'dataset': b.get('dataset', '')}
        for col in outcome_cols:
            row[col] = b.get(col, '')
        writer.writerow(row)

manifest = {
    'version': 'v1',
    'datasets': ['employment_survey_3000', 'nanbyo_survey_4000'],
    'respondent_counts': {
        'employment': len(emp_respondents),
        'nanbyo': len(nan_respondents),
        'total': total,
    },
    'feature_design': {
        'strategy': 'unified feature space — dataset-specific features are NaN for the other dataset, filled by median imputation before clustering',
        'clustering_feature_groups': {
            'emp_q11_activity_difficulty': {
                'description': '就職後の職業的課題 (employment survey: 36変数×{unresolved, resolved})',
                'dataset': 'employment only',
                'columns': [c for c in clustering_cols if c.startswith('q11_')]
            },
            'nan_q16_5_workplace_challenge': {
                'description': '就職後の困り事 (nanbyo survey: 9変数×{unresolved, resolved})',
                'dataset': 'nanbyo only',
                'columns': [c for c in clustering_cols if c.startswith('q16_5_')]
            },
            'nan_q10_functional_severity': {
                'description': '機能障害の深刻度 (nanbyo survey: 12変数, 5段階)',
                'dataset': 'nanbyo only',
                'columns': [c for c in clustering_cols if c.startswith('q10_')]
            },
            'nan_q13_job_readiness': {
                'description': '職業準備性・自信 (nanbyo survey: 5変数×{unresolved, resolved})',
                'dataset': 'nanbyo only',
                'columns': [c for c in clustering_cols if c.startswith('q13_')]
            },
            'soc_personal_factors': {
                'description': 'SOC/対処スキル (emp:10変数 Q16/17, nan:2変数 Q14_3/4, scale inverted to align)',
                'dataset': 'both (different items)',
                'columns': [c for c in clustering_cols if c.startswith('soc_')]
            },
            'disability_category': {
                'description': '障害種類大分類 (one-hot, 9カテゴリ)',
                'dataset': 'both',
                'columns': [c for c in clustering_cols if c.startswith('dis_')]
            }
        },
        'outcome_features': {
            'emp_q7': {
                'description': '就職前の課題 (employment: 13変数)',
                'columns': [c for c in outcome_cols if c.startswith('emp_q7_')]
            },
            'nan_q15': {
                'description': '就職活動の課題 (nanbyo: 5変数)',
                'columns': [c for c in outcome_cols if c.startswith('nan_q15_')]
            }
        }
    },
    'coding_notes': {
        'emp_q11_unresolved': 'code 2 (未解決課題有) → 1',
        'emp_q11_resolved': 'code 1 (問題があったが解決済) → 1',
        'nan_q16_5_unresolved': 'code 3 or 4 (やや/全く未解決) → 1',
        'nan_q16_5_resolved': 'code 2 (解決済み) → 1',
        'nan_q13_unresolved': 'code 3 or 4 → 1',
        'nan_q10_severity': '1=特になし, 2=軽微, 3=中程度, 4=かなり, 5=全くできない (ordinal numeric)',
        'soc_emp': 'scale 1(全く違う)→5(その通り)',
        'soc_nan': 'inverted from raw: 1(全く違う)→5(全くそのとおり)',
        'nan_q7_unresolved': 'code 3 (未解決) → 1',
        'nan_q7_resolved': 'code 2 (解決済) → 1',
        'nan_q15_unresolved': 'code 3 or 4 → 1',
    }
}

manifest_path = os.path.join(OUT_DIR, 'joint_feature_manifest.json')
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f'Written manifest: {manifest_path}')
print('\nDone. Next: run build_joint_icf_clustering.py')
