"""
Joint ICF clustering via canonical composite dimensions.

Problem with raw joint matrix: dataset-specific features (q11_ vs q16_5_) make the
clustering learn "which dataset is this from" rather than meaningful difficulty patterns.

Solution: map both surveys to shared ICF canonical dimensions before clustering.

Canonical dimensions (all computed from available variables per respondent):
  D1: cognitive_mental_load      — attention, problem-solving, stress, mental function
  D2: physical_fatigue_mobility  — walking, carrying, posture, fatigue, pain
  D3: communication              — conversation, interpersonal relations, expression
  D4: health_management          — health care, medical treatment, attendance
  D5: continuity_risk            — job continuity, disease progression risk
  D6: soc_coping                 — personal factor: sense of coherence / coping capacity
  D7: job_readiness_confidence   — self-efficacy, readiness, motivation (nanbyo Q13)
  D8: functional_severity_body   — body-level functional impairment severity (nanbyo Q10)
  [dis_* disability categories added as separate binary features]

For each canonical dimension, both surveys contribute via different but conceptually
aligned variables. Missing contributions are fine — we average available signals.
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
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/joint_icf/v1_canonical')
os.makedirs(OUT_DIR, exist_ok=True)

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']

EMP_DIS_CODES = {
    '01':'視覚障害','1':'視覚障害','02':'聴覚障害','2':'聴覚障害',
    '03':'肢体不自由','3':'肢体不自由','04':'内部障害','4':'内部障害',
    '05':'知的障害','5':'知的障害','06':'精神障害','6':'精神障害',
    '07':'発達障害','7':'発達障害','08':'高次脳機能障害','8':'高次脳機能障害',
    '09':'難病','9':'難病',
}

def parse_norm(nv): return [x.strip() for x in nv.split('+') if x.strip()]
def has(nv, *codes): return 1.0 if any(c in parse_norm(nv) for c in codes) else 0.0
def safe_float(nv):
    vals = parse_norm(nv)
    try: return float(vals[0]) if len(vals) == 1 else None
    except: return None

# ── Dimension component registry ─────────────────────────────────
# Each respondent accumulates signal values per dimension.
# At end, each dimension = mean of available signals (None signals excluded).

def dim_mean(signals: list) -> float | None:
    valid = [s for s in signals if s is not None]
    return statistics.mean(valid) if valid else None


# ════════════════════════════════════════════════════════════════
# LOAD EMPLOYMENT SURVEY
# ════════════════════════════════════════════════════════════════
print('Loading employment_survey ...')

# Define which Q11 variables contribute to which dimension
# D1: cognitive/mental
D1_Q11 = {'11注意集中', '11問題解決・判断', '11精神的ストレス対応', '11課題達成', '11読むこと', '11書くこと', '11計算すること'}
# D2: physical/fatigue/mobility
D2_Q11 = {'11歩くこと', '11あちこちの移動', '11立った姿勢', '11座った姿勢', '11運搬', '11手と手指での操作', '11手と腕での操作', '11乗り物の操作', '11交通機関の利用', '118時間労働', '11適度な休憩'}
# D3: communication/interpersonal
D3_Q11 = {'11人との応対', '11円滑な人間関係', '11話や文章の内容の理解', '11自分の意思を伝えること', '11会話や議論', '11コミュニケーション機器の使用'}
# D4: health management
D4_Q11 = {'11健康管理', '11通院', '11トイレの利用', '11清潔な身なりや服装', '11勤務時間外の生活'}
# D5: continuity risk
D5_Q11 = {'11仕事の継続', '11責任への対応', '11遅刻等せずに出勤', '11報酬', '11昇進'}

emp = {}  # respondent_id → dimension signal lists

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
            # binary unresolved → map to scale 0/1
            if var in D1_Q11: b['d1'].append(un)
            if var in D2_Q11: b['d2'].append(un)
            if var in D3_Q11: b['d3'].append(un)
            if var in D4_Q11: b['d4'].append(un)
            if var in D5_Q11: b['d5'].append(un)
            b['q11_raw'][var] = (has(nv,'2'), has(nv,'1'))  # (unresolved, resolved)

        elif grp == '就職前や就職活動の職業的課題の状況':
            b['q7_raw'][var] = (has(nv,'3'), has(nv,'2'))

        elif grp == 'SOC（首尾一貫感覚）':
            val = safe_float(nv)
            if val is not None:
                b['d6'].append(val)  # 1-5, higher=better
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
# LOAD NANBYO SURVEY
# ════════════════════════════════════════════════════════════════
print('Loading nanbyo_survey ...')

# Q10 → canonical dimension mapping (severity 1-5 → scale to 0-1 for combining with binary)
# Map: (raw - 1) / 4 → 0=none, 1=severe. Then use as signal.
def sev_norm(nv):
    v = safe_float(nv)
    return (v - 1) / 4.0 if v is not None else None

# Q10 item → dimension
D1_Q10 = {'Q10_06', 'Q10_12'}                              # cognitive/mental
D2_Q10 = {'Q10_04', 'Q10_05', 'Q10_07', 'Q10_09'}         # physical/fatigue/mobility
D4_Q10 = {'Q10_01', 'Q10_02', 'Q10_03', 'Q10_11'}         # health management
D5_Q10 = {'Q10_08'}                                         # continuity/disease progression
D8_Q10 = {'Q10_01','Q10_02','Q10_03','Q10_04','Q10_05',    # all Q10 → functional severity
           'Q10_06','Q10_07','Q10_08','Q10_09','Q10_10','Q10_11','Q10_12'}

# Q16_5 → canonical dimension
D3_Q16 = {'Q16_5_4'}                                        # interpersonal/communication
D4_Q16 = {'Q16_5_3'}                                        # health management
D5_Q16 = {'Q16_5_1','Q16_5_2','Q16_5_5','Q16_5_6','Q16_5_7','Q16_5_8','Q16_5_9'}  # continuity
D1_Q16 = {'Q16_5_8'}                                        # cognitive/mental (concentration drop)

# Q13 → D7 job readiness
# Nanbyo SOC Q14_3/4 → D6 (inverted)

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
            nan[rid]['dis'] = {'難病': 1}  # all nanbyo = 難病
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
            un = has(nv, '3', '4')  # やや/全く未解決
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
                v_inv = (6.0 - v - 1) / 4.0  # invert + normalize to 0-1 (higher=better)
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
# BUILD CANONICAL FEATURE MATRIX
# ════════════════════════════════════════════════════════════════
all_resp = {**emp, **nan}
total = len(all_resp)
print(f'\nTotal: {total} respondents')

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
DIM_KEYS = [k for k, _ in CANONICAL_DIMS]
DIM_NAMES = {k: n for k, n in CANONICAL_DIMS}

# Compute means; d7 and d8 are nanbyo-specific (will be NaN for employment)
records = []
for rid, b in sorted(all_resp.items()):
    row = {'respondent_id': rid, 'dataset': b['dataset']}
    for dk in DIM_KEYS:
        signals = b.get(dk, [])
        row[dk] = dim_mean(signals)  # None → NaN
    for cat in BROAD_CATS:
        row[f'dis_{cat}'] = float(b.get('dis', {}).get(cat, 0))
    row['sex'] = b.get('sex')
    row['age'] = b.get('age')
    records.append(row)

FEATURE_COLS = DIM_KEYS + [f'dis_{c}' for c in BROAD_CATS]

# Missing rate per dimension
print('\nCanonical dimension coverage:')
for dk in DIM_KEYS:
    has_val = sum(1 for r in records if r[dk] is not None)
    print(f'  {DIM_NAMES[dk]}: {has_val}/{total} ({has_val/total:.1%})')

# Build numpy matrix
X_raw = np.array([
    [float(r[c]) if r[c] is not None else np.nan for c in FEATURE_COLS]
    for r in records
], dtype=np.float64)

print(f'\nOverall missing rate: {np.isnan(X_raw).mean():.1%}')

# ── Impute, scale, cluster ────────────────────────────────────────
print('Imputing ...')
imp = SimpleImputer(strategy='median')
X_imp = imp.fit_transform(X_raw)

print('Scaling ...')
sc = StandardScaler()
X_sc = sc.fit_transform(X_imp)

# With only ~17 features, TruncatedSVD not needed — cluster directly
# But try SVD to avoid noise
n_comp = min(15, X_sc.shape[1] - 1)
if n_comp > 3:
    print(f'TruncatedSVD (n={n_comp}) ...')
    svd = TruncatedSVD(n_components=n_comp, random_state=42)
    X_cl = svd.fit_transform(X_sc)
    cumvar = svd.explained_variance_ratio_.cumsum()
    print(f'  Variance: {cumvar}')
else:
    X_cl = X_sc

print('\nKMeans k ∈ {7, 9, 11, 13} ...')
best_k, best_labels, best_score = None, None, -1
results = {}

for k in [7, 9, 11, 13]:
    km = KMeans(n_clusters=k, n_init=15, max_iter=300, random_state=42)
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

# Collect raw variable data for enrichment
emp_raw = emp
nan_raw = nan

profiles = {}
for cid in range(best_k):
    idxs = [i for i, l in enumerate(best_labels) if l == cid]
    rids = [respondent_ids[i] for i in idxs]
    ds   = [datasets_list[i] for i in idxs]
    n_emp = sum(1 for d in ds if d == 'employment')
    n_nan = sum(1 for d in ds if d == 'nanbyo')
    recs  = [records[i] for i in idxs]

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

    # Top Q11 unresolved (employment respondents in cluster)
    emp_rids = [r for r in rids if r.startswith('emp_')]
    nan_rids = [r for r in rids if r.startswith('nan_')]

    q11_un_rates = {}
    for rid in emp_rids:
        b = emp_raw.get(rid, {})
        for var, (un, re) in b.get('q11_raw', {}).items():
            q11_un_rates.setdefault(var, []).append(un)
    top_q11 = [
        {'var': v, 'rate': round(statistics.mean(vals), 3)}
        for v, vals in q11_un_rates.items()
    ]
    top_q11 = sorted(top_q11, key=lambda x: -x['rate'])[:8]

    # Top Q16_5 unresolved (nanbyo respondents in cluster)
    Q16_LABEL = {
        'Q16_5_1':'仕事内容・働き方の無理', 'Q16_5_2':'職場への負担感',
        'Q16_5_3':'疾患自己管理の限界', 'Q16_5_4':'人間関係ストレス',
        'Q16_5_5':'病状進行による困難', 'Q16_5_6':'治療vs仕事トレードオフ',
        'Q16_5_7':'病状悪化による離職', 'Q16_5_8':'集中力低下→退職勧奨',
        'Q16_5_9':'休職超過による退職',
    }
    q16_un_rates = {}
    for rid in nan_rids:
        b = nan_raw.get(rid, {})
        for var, (un, re) in b.get('q16_raw', {}).items():
            if not var.startswith('Sp'):
                q16_un_rates.setdefault(var, []).append(un)
    top_q16 = [
        {'var': v, 'rate': round(statistics.mean(vals), 3), 'label': Q16_LABEL.get(v, v)}
        for v, vals in q16_un_rates.items()
    ]
    top_q16 = sorted(top_q16, key=lambda x: -x['rate'])[:6]

    # Top Q10 severity (nanbyo)
    Q10_LABEL = {
        'Q10_01':'医師による就業制限', 'Q10_02':'通院による支障', 'Q10_03':'服薬の支障',
        'Q10_04':'疲れやすさ・体調変動', 'Q10_05':'崩れやすさ', 'Q10_06':'活力・集中力低下',
        'Q10_07':'運動協調・歩行障害', 'Q10_08':'病状進行への不安', 'Q10_09':'身体の痛み',
        'Q10_10':'皮膚・容貌変化', 'Q10_11':'免疫機能低下', 'Q10_12':'精神・心理症状',
    }
    q10_means = {}
    for rid in nan_rids:
        b = nan_raw.get(rid, {})
        for var, sev in b.get('q10_raw', {}).items():
            if sev is not None:
                q10_means.setdefault(var, []).append(sev)
    top_q10 = [
        {'var': v, 'mean_severity': round(statistics.mean(vals), 2), 'label': Q10_LABEL.get(v, v)}
        for v, vals in q10_means.items()
    ]
    top_q10 = sorted(top_q10, key=lambda x: -x['mean_severity'])[:5]

    profiles[cid] = {
        'cluster_id': cid,
        'n': len(idxs),
        'n_employment': n_emp,
        'n_nanbyo': n_nan,
        'dataset_mix': f'emp {n_emp/len(idxs):.0%} / nan {n_nan/len(idxs):.0%}',
        'canonical_dimensions': dim_means,
        'disability_distribution': dis_dist,
        'top_q11_unresolved_emp': top_q11,
        'top_q16_5_unresolved_nan': top_q16,
        'top_q10_severity_nan': top_q10,
    }


# ════════════════════════════════════════════════════════════════
# WRITE OUTPUTS
# ════════════════════════════════════════════════════════════════
assign_path = os.path.join(OUT_DIR, 'joint_canonical_cluster_assignments.csv')
with open(assign_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id', 'dataset', 'cluster_id'])
    writer.writeheader()
    for i, rid in enumerate(respondent_ids):
        writer.writerow({'respondent_id': rid, 'dataset': datasets_list[i], 'cluster_id': int(best_labels[i])})

prof_path = os.path.join(OUT_DIR, 'joint_canonical_profiles.json')
with open(prof_path, 'w', encoding='utf-8') as f:
    json.dump({
        'k': best_k,
        'method': 'ICF canonical dimensions → StandardScaler → TruncatedSVD → KMeans',
        'canonical_dimensions': {k: n for k, n in CANONICAL_DIMS},
        'dimension_sources': {
            'cognitive_mental_load': 'emp: Q11{注意集中,問題解決,ストレス対応}; nan: Q10{06活力,12精神} + Q16_5{08集中低下}',
            'physical_fatigue_mobility': 'emp: Q11{歩行,運搬,立位,移動,8時間}; nan: Q10{04疲れ,05崩れやすさ,07運動,09痛み}',
            'communication_interpersonal': 'emp: Q11{対人,人間関係,理解,意思伝達,会話}; nan: Q16_5{04人間関係}',
            'health_management': 'emp: Q11{健康管理,通院,清潔}; nan: Q10{01-03就業制限/通院/服薬} + Q16_5{03疾患自己管理}',
            'continuity_risk': 'emp: Q11{仕事継続,責任,出勤}; nan: Q10{08進行不安} + Q16_5{01-02,05-09継続系}',
            'soc_coping': 'emp: Q16/17(10項目,1-5); nan: Q14_3/4(2項目,inverted→0-1)',
            'job_readiness_confidence': 'nan only: Q13{1-5自信/疎外感/意欲}; emp: n/a (→ NaN → imputed)',
            'functional_severity_body': 'nan only: Q10 all items severity; emp: n/a (→ NaN → imputed)',
        },
        'feature_columns': FEATURE_COLS,
        'total_respondents': total,
        'profiles': {str(k): v for k, v in profiles.items()},
    }, f, ensure_ascii=False, indent=2)

qual_path = os.path.join(OUT_DIR, 'joint_canonical_quality.json')
with open(qual_path, 'w', encoding='utf-8') as f:
    json.dump({
        'selected_k': best_k,
        'selected_silhouette': round(float(best_score), 4),
        'all_k_results': {str(k): v for k, v in results.items()},
    }, f, ensure_ascii=False, indent=2)

print(f'Written: {assign_path}')
print(f'Written: {prof_path}')
print(f'Written: {qual_path}')

# ── Summary ──────────────────────────────────────────────────────
print('\n── Joint canonical cluster summary ─────────────────────────')
for cid, p in sorted(profiles.items()):
    dims = p['canonical_dimensions']
    print(f'\nC{cid} (n={p["n"]}, {p["dataset_mix"]}):')
    print(f'  Canonical dims:')
    for dn, val in dims.items():
        bar = '█' * int((val or 0) * 10) if val else '-'
        print(f'    {dn:<35} {val if val is not None else "n/a":>5}  {bar}')
    top_dis = sorted(p['disability_distribution'].items(), key=lambda x: -x[1])[:3]
    print(f'  Disability: {[(d, f"{r:.0%}") for d, r in top_dis]}')

print('\nDone.')
