"""
Joint ICF clustering with narrative ICF signal integration.

Extends build_joint_icf_canonical_clustering.py by adding 17 LLM-extracted
narrative ICF signals (from extract_narrative_icf_signals.py) as additional
features alongside the 8 canonical ICF dimensions.

Feature matrix:
  - 8 canonical ICF dimensions (from structured survey responses)
  - 17 narrative ICF signals (0/1/2 → normalized 0-1, from free-text LLM extraction)
  - 9 disability category flags

Narrative signals cover respondents with ≥50 chars free text (~44% of total).
Others receive NaN → median-imputed. The combined matrix enables truly
integrated quantitative+qualitative FCHMA clustering.

Output (data/analysis_ready/joint_icf/v2_narrative/):
  joint_narrative_cluster_assignments.csv
  joint_narrative_profiles.json
  joint_narrative_quality.json

Usage:
  python3 build_joint_icf_narrative_integrated_clustering.py
"""

import csv
import json
import os
import statistics

import numpy as np
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import TruncatedSVD

BASE = os.path.join(os.path.dirname(__file__), '../..')
EMP_SF = os.path.join(BASE, 'data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv')
NAN_SF = os.path.join(BASE, 'data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv')
NARRATIVE_PATH = os.path.join(BASE, 'data/analysis_ready/joint_icf/v1_canonical/narrative_icf_signals.jsonl')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/joint_icf/v2_narrative')
os.makedirs(OUT_DIR, exist_ok=True)

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']

EMP_DIS_CODES = {
    '01':'視覚障害','1':'視覚障害','02':'聴覚障害','2':'聴覚障害',
    '03':'肢体不自由','3':'肢体不自由','04':'内部障害','4':'内部障害',
    '05':'知的障害','5':'知的障害','06':'精神障害','6':'精神障害',
    '07':'発達障害','7':'発達障害','08':'高次脳機能障害','8':'高次脳機能障害',
    '09':'難病','9':'難病',
}

NARRATIVE_SIGNALS = [
    'fatigue_variability',
    'treatment_work_conflict',
    'disease_progression_anxiety',
    'sensory_physical_burden',
    'health_management_at_work',
    'job_search_difficulty',
    'disclosure_difficulty',
    'support_access_difficulty',
    'motivation_loss',
    'economic_pressure',
    'cognitive_load',
    'communication_difficulty',
    'interpersonal_stress',
    'instruction_ambiguity',
    'schedule_attendance_risk',
    'understanding_lack',
    'accommodation_gap',
]

NARRATIVE_LABELS = {
    'fatigue_variability':        '疲労・体調変動',
    'treatment_work_conflict':    '治療と仕事の衝突',
    'disease_progression_anxiety':'病状進行への不安',
    'sensory_physical_burden':    '感覚・身体負荷',
    'health_management_at_work':  '職場内疾患管理困難',
    'job_search_difficulty':      '就職活動困難',
    'disclosure_difficulty':      '開示・説明困難',
    'support_access_difficulty':  '支援への接続困難',
    'motivation_loss':            '就労意欲の低下',
    'economic_pressure':          '経済的困窮・不安',
    'cognitive_load':             '認知負荷',
    'communication_difficulty':   'コミュニケーション困難',
    'interpersonal_stress':       '対人・人間関係ストレス',
    'instruction_ambiguity':      '指示・業務の曖昧さ',
    'schedule_attendance_risk':   '出勤・スケジュール維持困難',
    'understanding_lack':         '周囲の理解・配慮の不足',
    'accommodation_gap':          '配慮・制度の不整合',
}

def parse_norm(nv): return [x.strip() for x in nv.split('+') if x.strip()]
def has(nv, *codes): return 1.0 if any(c in parse_norm(nv) for c in codes) else 0.0
def safe_float(nv):
    vals = parse_norm(nv)
    try: return float(vals[0]) if len(vals) == 1 else None
    except: return None

def dim_mean(signals: list) -> float | None:
    valid = [s for s in signals if s is not None]
    return statistics.mean(valid) if valid else None


# ════════════════════════════════════════════════════════════════
# LOAD NARRATIVE SIGNALS
# ════════════════════════════════════════════════════════════════
print('Loading narrative ICF signals ...')
narrative = {}  # respondent_id → {signal: normalized_value}

if not os.path.exists(NARRATIVE_PATH):
    print(f'  [WARN] Narrative file not found: {NARRATIVE_PATH}')
    print('  Run extract_narrative_icf_signals.py first. Proceeding without narrative signals.')
else:
    with open(NARRATIVE_PATH, encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
                rid = d['respondent_id']
                if d.get('extraction_ok') and d.get('signals'):
                    # Normalize 0/1/2 → 0/0.5/1.0
                    narrative[rid] = {
                        sig: d['signals'].get(sig, 0) / 2.0
                        for sig in NARRATIVE_SIGNALS
                    }
                    # Also store raw key_phrases and primary_challenge for profile enrichment
                    narrative[rid]['_key_phrases'] = d.get('key_phrases', [])
                    narrative[rid]['_primary_challenge'] = d.get('primary_challenge', '')
            except Exception:
                pass
    print(f'  {len(narrative)} respondents with narrative signals')


# ════════════════════════════════════════════════════════════════
# LOAD EMPLOYMENT SURVEY (canonical dimensions)
# ════════════════════════════════════════════════════════════════
print('Loading employment_survey ...')

D1_Q11 = {'11注意集中', '11問題解決・判断', '11精神的ストレス対応', '11課題達成', '11読むこと', '11書くこと', '11計算すること'}
D2_Q11 = {'11歩くこと', '11あちこちの移動', '11立った姿勢', '11座った姿勢', '11運搬', '11手と手指での操作', '11手と腕での操作', '11乗り物の操作', '11交通機関の利用', '118時間労働', '11適度な休憩'}
D3_Q11 = {'11人との応対', '11円滑な人間関係', '11話や文章の内容の理解', '11自分の意思を伝えること', '11会話や議論', '11コミュニケーション機器の使用'}
D4_Q11 = {'11健康管理', '11通院', '11トイレの利用', '11清潔な身なりや服装', '11勤務時間外の生活'}
D5_Q11 = {'11仕事の継続', '11責任への対応', '11遅刻等せずに出勤', '11報酬', '11昇進'}

emp = {}

with open(EMP_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rid = f"emp_{row['respondent_id']}"
        var = row['raw_name']
        grp = row['question_group']
        nv  = row['normalized_value']
        if rid not in emp:
            emp[rid] = {f'd{i}': [] for i in range(1, 9)}
            emp[rid]['dis'] = {}
            emp[rid]['dataset'] = 'employment'
            emp[rid]['q11_raw'] = {}
            emp[rid]['q7_raw'] = {}
            emp[rid]['soc_raw'] = []

        b = emp[rid]

        if grp == '就職後の職業的課題':
            un = has(nv, '2')
            if var in D1_Q11: b['d1'].append(un)
            if var in D2_Q11: b['d2'].append(un)
            if var in D3_Q11: b['d3'].append(un)
            if var in D4_Q11: b['d4'].append(un)
            if var in D5_Q11: b['d5'].append(un)
            b['q11_raw'][var] = (has(nv,'2'), has(nv,'1'))

        elif grp == '就職前や就職活動の職業的課題の状況':
            b['q7_raw'][var] = (has(nv,'3'), has(nv,'2'))

        elif grp == 'SOC（首尾一貫感覚）':
            val = safe_float(nv)
            if val is not None:
                b['d6'].append(val)
                b['soc_raw'].append(val)

        elif var == '分類名':
            for code in parse_norm(nv):
                cat = EMP_DIS_CODES.get(code)
                if cat: b['dis'][cat] = 1

        elif var == '2性別':
            v = safe_float(nv)
            if v: b['sex'] = v
        elif var == '2年齢':
            v = safe_float(nv)
            if v: b['age'] = v

print(f'  {len(emp)} employment respondents')


# ════════════════════════════════════════════════════════════════
# LOAD NANBYO SURVEY (canonical dimensions)
# ════════════════════════════════════════════════════════════════
print('Loading nanbyo_survey ...')

def sev_norm(nv):
    v = safe_float(nv)
    return (v - 1) / 4.0 if v is not None else None

D1_Q10 = {'Q10_06', 'Q10_12'}
D2_Q10 = {'Q10_04', 'Q10_05', 'Q10_07', 'Q10_09'}
D4_Q10 = {'Q10_01', 'Q10_02', 'Q10_03', 'Q10_11'}
D5_Q10 = {'Q10_08'}
D8_Q10 = {'Q10_01','Q10_02','Q10_03','Q10_04','Q10_05',
           'Q10_06','Q10_07','Q10_08','Q10_09','Q10_10','Q10_11','Q10_12'}

D3_Q16 = {'Q16_5_4'}
D4_Q16 = {'Q16_5_3'}
D5_Q16 = {'Q16_5_1','Q16_5_2','Q16_5_5','Q16_5_6','Q16_5_7','Q16_5_8','Q16_5_9'}
D1_Q16 = {'Q16_5_8'}

NAN_BODY_DIS = {
    '視覚障害':'視覚障害','聴覚障害':'聴覚障害','平衡機能障害':'聴覚障害',
    '上肢障害':'肢体不自由','下肢障害':'肢体不自由','体幹機能障害':'肢体不自由',
    '心臓機能障害':'内部障害','腎臓機能障害':'内部障害','呼吸器機能障害':'内部障害',
    '膀胱・直腸機能障害':'内部障害','小腸機能障害':'内部障害',
    'HIVによる免疫機能障害':'内部障害','肝臓機能障害':'内部障害',
}

nan = {}

with open(NAN_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rid = f"nan_{row['respondent_id']}"
        var = row['raw_name']
        grp = row['question_group']
        nv  = row['normalized_value']
        if rid not in nan:
            nan[rid] = {f'd{i}': [] for i in range(1, 9)}
            nan[rid]['dis'] = {'難病': 1}
            nan[rid]['dataset'] = 'nanbyo'
            nan[rid]['q16_raw'] = {}
            nan[rid]['q15_raw'] = {}
            nan[rid]['q10_raw'] = {}
            nan[rid]['q13_raw'] = {}
            nan[rid]['soc_raw'] = []

        b = nan[rid]

        if grp == '機能障害' and var.startswith('Q10_') and var in D8_Q10:
            sn = sev_norm(nv)
            if sn is not None:
                b['d8'].append(sn)
                if var in D1_Q10: b['d1'].append(sn)
                if var in D2_Q10: b['d2'].append(sn)
                if var in D4_Q10: b['d4'].append(sn)
                if var in D5_Q10: b['d5'].append(sn)
            b['q10_raw'][var] = safe_float(nv)

        elif grp == '就職後の職業的課題' and var.startswith('Q16_5_'):
            un = has(nv, '3', '4')
            if var in D1_Q16: b['d1'].append(un)
            if var in D3_Q16: b['d3'].append(un)
            if var in D4_Q16: b['d4'].append(un)
            if var in D5_Q16: b['d5'].append(un)
            b['q16_raw'][var] = (un, has(nv,'2'))

        elif grp == '仕事の自信・職業準備状況' and var.startswith('Q13_'):
            un = has(nv, '3', '4')
            b['d7'].append(un)
            b['q13_raw'][var] = (un, has(nv,'2'))

        elif grp == 'SOC（首尾一貫感覚）' and var in ('Q14_3','Q14_4'):
            v = safe_float(nv)
            if v is not None:
                v_inv = (6.0 - v - 1) / 4.0
                b['d6'].append(v_inv)
                b['soc_raw'].append(v_inv)

        elif grp == '就職活動の職業的課題の状況' and var.startswith('Q15_2'):
            b['q15_raw'][var] = (has(nv,'3','4'), has(nv,'2'))

        elif var == 'Q09_4':
            cat = NAN_BODY_DIS.get(row.get('label_text',''))
            if cat: b['dis'][cat] = 1

        elif var == 'Q03':
            v = safe_float(nv); b['sex'] = v if v else b.get('sex')
        elif var == 'Q02':
            v = safe_float(nv); b['age'] = v if v else b.get('age')

print(f'  {len(nan)} nanbyo respondents')


# ════════════════════════════════════════════════════════════════
# BUILD INTEGRATED FEATURE MATRIX
# ════════════════════════════════════════════════════════════════
all_resp = {**emp, **nan}
total = len(all_resp)
print(f'\nTotal: {total} respondents')
print(f'Narrative signal coverage: {len(narrative)}/{total} ({len(narrative)/total:.1%})')

CANONICAL_DIMS = [
    ('d1', 'cognitive_mental_load'),
    ('d2', 'physical_fatigue_mobility'),
    ('d3', 'communication_interpersonal'),
    ('d4', 'health_management'),
    ('d5', 'continuity_risk'),
    ('d6', 'soc_coping'),
    ('d7', 'job_readiness_confidence'),
    ('d8', 'functional_severity_body'),
]
DIM_KEYS  = [k for k, _ in CANONICAL_DIMS]
DIM_NAMES = {k: n for k, n in CANONICAL_DIMS}

records = []
for rid, b in sorted(all_resp.items()):
    row = {'respondent_id': rid, 'dataset': b['dataset']}
    for dk in DIM_KEYS:
        row[dk] = dim_mean(b.get(dk, []))
    for cat in BROAD_CATS:
        row[f'dis_{cat}'] = float(b.get('dis', {}).get(cat, 0))
    row['sex'] = b.get('sex')
    row['age'] = b.get('age')

    # Narrative signals: normalized 0-1 (NaN if no extraction)
    narr = narrative.get(rid)
    for sig in NARRATIVE_SIGNALS:
        row[f'narr_{sig}'] = narr[sig] if narr else None

    records.append(row)

CANONICAL_COLS  = DIM_KEYS
DIS_COLS        = [f'dis_{c}' for c in BROAD_CATS]
NARRATIVE_COLS  = [f'narr_{s}' for s in NARRATIVE_SIGNALS]
FEATURE_COLS    = CANONICAL_COLS + DIS_COLS + NARRATIVE_COLS

print('\nFeature matrix dimensions:')
print(f'  Canonical dims : {len(CANONICAL_COLS)}')
print(f'  Disability flags: {len(DIS_COLS)}')
print(f'  Narrative signals: {len(NARRATIVE_COLS)}')
print(f'  Total features : {len(FEATURE_COLS)}')

print('\nCanonical dimension coverage:')
for dk in DIM_KEYS:
    n = sum(1 for r in records if r[dk] is not None)
    print(f'  {DIM_NAMES[dk]}: {n}/{total} ({n/total:.1%})')

print('\nNarrative signal coverage (sample):')
for sig in NARRATIVE_SIGNALS[:5]:
    col = f'narr_{sig}'
    n = sum(1 for r in records if r[col] is not None)
    print(f'  {NARRATIVE_LABELS[sig]}: {n}/{total} ({n/total:.1%})')

X_raw = np.array([
    [float(r[c]) if r[c] is not None else np.nan for c in FEATURE_COLS]
    for r in records
], dtype=np.float64)

print(f'\nOverall missing rate: {np.isnan(X_raw).mean():.1%}')

# ── Impute, scale, reduce, cluster ────────────────────────────
print('Imputing (median) ...')
imp = SimpleImputer(strategy='median')
X_imp = imp.fit_transform(X_raw)

print('Scaling (StandardScaler) ...')
sc = StandardScaler()
X_sc = sc.fit_transform(X_imp)

n_comp = min(20, X_sc.shape[1] - 1)
print(f'TruncatedSVD (n_components={n_comp}) ...')
svd = TruncatedSVD(n_components=n_comp, random_state=42)
X_cl = svd.fit_transform(X_sc)
cumvar = svd.explained_variance_ratio_.cumsum()
print(f'  Cumulative variance: {[round(v,3) for v in cumvar]}')

print('\nKMeans k ∈ {9, 11, 13, 15} ...')
best_k, best_labels, best_score = None, None, -1
results = {}

for k in [9, 11, 13, 15]:
    km = KMeans(n_clusters=k, n_init=20, max_iter=300, random_state=42)
    labels = km.fit_predict(X_cl)
    score = silhouette_score(X_cl, labels, sample_size=min(3000, total), random_state=42)
    sizes = sorted([int(np.sum(labels==i)) for i in range(k)], reverse=True)
    results[k] = {'silhouette': round(float(score), 4), 'inertia': float(km.inertia_), 'sizes': sizes}
    print(f'  k={k}: sil={score:.4f}  sizes={sizes}')
    if score > best_score:
        best_score, best_k, best_labels = score, k, labels

print(f'\nSelected k={best_k} (silhouette={best_score:.4f})')


# ════════════════════════════════════════════════════════════════
# BUILD PROFILES
# ════════════════════════════════════════════════════════════════
print('Building profiles ...')
respondent_ids = [r['respondent_id'] for r in records]
datasets_list  = [r['dataset'] for r in records]

Q16_LABEL = {
    'Q16_5_1':'仕事内容・働き方の無理', 'Q16_5_2':'職場への負担感',
    'Q16_5_3':'疾患自己管理の限界', 'Q16_5_4':'人間関係ストレス',
    'Q16_5_5':'病状進行による困難', 'Q16_5_6':'治療vs仕事トレードオフ',
    'Q16_5_7':'病状悪化による離職', 'Q16_5_8':'集中力低下→退職勧奨',
    'Q16_5_9':'休職超過による退職',
}
Q10_LABEL = {
    'Q10_01':'医師による就業制限', 'Q10_02':'通院による支障', 'Q10_03':'服薬の支障',
    'Q10_04':'疲れやすさ・体調変動', 'Q10_05':'崩れやすさ', 'Q10_06':'活力・集中力低下',
    'Q10_07':'運動協調・歩行障害', 'Q10_08':'病状進行への不安', 'Q10_09':'身体の痛み',
    'Q10_10':'皮膚・容貌変化', 'Q10_11':'免疫機能低下', 'Q10_12':'精神・心理症状',
}
Q13_LABEL = {
    'Q13_1':'仕事への不安', 'Q13_2':'社会的疎外感', 'Q13_3':'健康状態の懸念',
    'Q13_4':'意欲喪失', 'Q13_5':'病状と職場調整', 'Q13_6':'業務量懸念',
}

profiles = {}
for cid in range(best_k):
    idxs   = [i for i, l in enumerate(best_labels) if l == cid]
    rids   = [respondent_ids[i] for i in idxs]
    ds     = [datasets_list[i] for i in idxs]
    n_emp  = sum(1 for d in ds if d == 'employment')
    n_nan  = sum(1 for d in ds if d == 'nanbyo')
    recs   = [records[i] for i in idxs]

    # Canonical dimension means
    dim_means = {}
    for dk in DIM_KEYS:
        vals = [r[dk] for r in recs if r[dk] is not None]
        dim_means[DIM_NAMES[dk]] = round(statistics.mean(vals), 3) if vals else None

    # Disability distribution
    dis_dist = {}
    for cat in BROAD_CATS:
        vals = [r[f'dis_{cat}'] for r in recs]
        dis_dist[cat] = round(statistics.mean(vals), 3)

    # Narrative signal means (only respondents with extraction)
    narr_covered = [r for r in recs if r.get('narr_fatigue_variability') is not None]
    narr_means = {}
    if narr_covered:
        for sig in NARRATIVE_SIGNALS:
            vals = [r[f'narr_{sig}'] for r in narr_covered if r[f'narr_{sig}'] is not None]
            narr_means[sig] = {
                'label': NARRATIVE_LABELS[sig],
                'mean': round(statistics.mean(vals), 3) if vals else None,
            }
        # Top 5 by mean
        top_narr = sorted(narr_means.items(), key=lambda x: -(x[1]['mean'] or 0))[:5]
    else:
        top_narr = []

    # Top Q11 unresolved (employment respondents)
    emp_rids = [r for r in rids if r.startswith('emp_')]
    nan_rids = [r for r in rids if r.startswith('nan_')]

    q11_un_rates = {}
    for rid in emp_rids:
        b = emp.get(rid, {})
        for var, (un, re) in b.get('q11_raw', {}).items():
            q11_un_rates.setdefault(var, []).append(un)
    top_q11 = sorted(
        [{'var': v, 'rate': round(statistics.mean(vals), 3)}
         for v, vals in q11_un_rates.items()],
        key=lambda x: -x['rate']
    )[:8]

    # Top Q16_5 unresolved (nanbyo respondents)
    q16_un_rates = {}
    for rid in nan_rids:
        b = nan.get(rid, {})
        for var, (un, re) in b.get('q16_raw', {}).items():
            if not var.startswith('Sp'):
                q16_un_rates.setdefault(var, []).append(un)
    top_q16 = sorted(
        [{'var': v, 'rate': round(statistics.mean(vals), 3), 'label': Q16_LABEL.get(v, v)}
         for v, vals in q16_un_rates.items()],
        key=lambda x: -x['rate']
    )[:6]

    # Top Q10 severity (nanbyo)
    q10_means = {}
    for rid in nan_rids:
        b = nan.get(rid, {})
        for var, sev in b.get('q10_raw', {}).items():
            if sev is not None:
                q10_means.setdefault(var, []).append(sev)
    top_q10 = sorted(
        [{'var': v, 'mean_sev': round(statistics.mean(vals), 3), 'label': Q10_LABEL.get(v, v)}
         for v, vals in q10_means.items()],
        key=lambda x: -x['mean_sev']
    )[:6]

    # Top Q13 unresolved (nanbyo job readiness)
    q13_un_rates = {}
    for rid in nan_rids:
        b = nan.get(rid, {})
        for var, (un, re) in b.get('q13_raw', {}).items():
            q13_un_rates.setdefault(var, []).append(un)
    top_q13 = sorted(
        [{'var': v, 'rate': round(statistics.mean(vals), 3), 'label': Q13_LABEL.get(v, v)}
         for v, vals in q13_un_rates.items()],
        key=lambda x: -x['rate']
    )[:4]

    # Sample narrative challenges from this cluster
    sample_challenges = []
    for rid in rids[:200]:
        nd = narrative.get(rid)
        if nd and nd.get('_primary_challenge'):
            sample_challenges.append(nd['_primary_challenge'])
    # Deduplicate roughly
    sample_challenges = list(dict.fromkeys(sample_challenges))[:10]

    profiles[f'C{cid}'] = {
        'n': len(rids),
        'n_employment': n_emp,
        'n_nanbyo': n_nan,
        'emp_ratio': round(n_emp / len(rids), 2),
        'nan_ratio': round(n_nan / len(rids), 2),
        'n_with_narrative': len(narr_covered),
        'narrative_coverage': round(len(narr_covered) / len(rids), 2),
        'canonical_dims': dim_means,
        'disability_dist': dis_dist,
        'narrative_signals_all': {
            sig: round(narr_means[sig]['mean'], 3) if sig in narr_means and narr_means[sig]['mean'] is not None else None
            for sig in NARRATIVE_SIGNALS
        } if narr_covered else {},
        'top_narrative_signals': [
            {'signal': sig, 'label': info['label'], 'mean': info['mean']}
            for sig, info in top_narr
        ],
        'sample_primary_challenges': sample_challenges,
        'top_q11_unresolved': top_q11,
        'top_q16_unresolved': top_q16,
        'top_q10_severity': top_q10,
        'top_q13_unresolved': top_q13,
    }

# Sort clusters by size descending
profiles = dict(sorted(profiles.items(), key=lambda x: -x[1]['n']))


# ════════════════════════════════════════════════════════════════
# SAVE OUTPUTS
# ════════════════════════════════════════════════════════════════

# 1. Cluster assignments CSV
assignments_path = os.path.join(OUT_DIR, 'joint_narrative_cluster_assignments.csv')
with open(assignments_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['respondent_id', 'dataset', 'cluster_id',
                     'has_narrative', 'primary_challenge'])
    label_map = {respondent_ids[i]: int(best_labels[i]) for i in range(total)}
    for r in records:
        rid = r['respondent_id']
        nd = narrative.get(rid)
        cid = label_map[rid]
        writer.writerow([
            rid,
            r['dataset'],
            f'C{cid}',
            1 if nd else 0,
            nd['_primary_challenge'] if nd else '',
        ])
print(f'Saved: {assignments_path}')

# 2. Cluster profiles JSON
profiles_path = os.path.join(OUT_DIR, 'joint_narrative_profiles.json')
with open(profiles_path, 'w', encoding='utf-8') as f:
    json.dump(profiles, f, ensure_ascii=False, indent=2)
print(f'Saved: {profiles_path}')

# 3. Quality metrics JSON
quality = {
    'selected_k': best_k,
    'best_silhouette': round(best_score, 4),
    'total_respondents': total,
    'narrative_coverage_total': len(narrative),
    'narrative_coverage_pct': round(len(narrative) / total, 3),
    'feature_counts': {
        'canonical_dims': len(CANONICAL_COLS),
        'disability_flags': len(DIS_COLS),
        'narrative_signals': len(NARRATIVE_COLS),
        'total': len(FEATURE_COLS),
    },
    'svd_components': n_comp,
    'svd_cumvar': [round(v, 4) for v in cumvar.tolist()],
    'kmeans_results': results,
    'cluster_sizes': {k: v['n'] for k, v in profiles.items()},
}
quality_path = os.path.join(OUT_DIR, 'joint_narrative_quality.json')
with open(quality_path, 'w', encoding='utf-8') as f:
    json.dump(quality, f, ensure_ascii=False, indent=2)
print(f'Saved: {quality_path}')

# ── Summary ───────────────────────────────────────────────────
print('\n═══ CLUSTER SUMMARY ═══')
for cid, p in profiles.items():
    top_narr_str = ', '.join(
        f"{x['label']}={x['mean']:.2f}" for x in p['top_narrative_signals'][:3]
    )
    dis_str = ', '.join(
        f"{cat}={v:.0%}" for cat, v in p['disability_dist'].items() if v > 0.15
    )
    print(f"{cid} n={p['n']:4d} emp={p['emp_ratio']:.0%} nan={p['nan_ratio']:.0%} "
          f"narr={p['narrative_coverage']:.0%} | {top_narr_str[:60]}")
    if dis_str:
        print(f"     dis: {dis_str}")

print(f'\nDone. Output: {OUT_DIR}')
