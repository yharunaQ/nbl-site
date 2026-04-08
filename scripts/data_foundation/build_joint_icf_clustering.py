"""
Joint ICF clustering: employment_survey_3000 + nanbyo_survey_4000 (9,076 respondents).

Method: Impute (median) → StandardScaler → TruncatedSVD → KMeans
        Silhouette-based k selection: k ∈ {9, 11, 13, 15}

Outputs:
  data/analysis_ready/joint_icf/v1/joint_cluster_assignments.csv
  data/analysis_ready/joint_icf/v1/joint_cluster_profiles.json
  data/analysis_ready/joint_icf/v1/joint_cluster_quality.json
"""

import csv
import json
import os
import statistics

import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import TruncatedSVD
from sklearn.impute import SimpleImputer
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

BASE = os.path.join(os.path.dirname(__file__), '../..')
V1   = os.path.join(BASE, 'data/analysis_ready/joint_icf/v1')

FEATURES_PATH = os.path.join(V1, 'joint_wide_features.csv')
OUTCOMES_PATH = os.path.join(V1, 'joint_outcomes.csv')

# ── Load features ────────────────────────────────────────────────
print('Loading joint_wide_features.csv ...')
with open(FEATURES_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    feature_rows = list(reader)

respondent_ids = [r['respondent_id'] for r in feature_rows]
datasets       = [r['dataset'] for r in feature_rows]
all_cols = [c for c in feature_rows[0].keys() if c not in ('respondent_id', 'dataset')]

# Feature group labels for profile display
q11_un  = [c for c in all_cols if c.startswith('q11_') and c.endswith('_unresolved')]
q11_re  = [c for c in all_cols if c.startswith('q11_') and c.endswith('_resolved')]
q16_un  = [c for c in all_cols if c.startswith('q16_5_') and c.endswith('_unresolved')]
q16_re  = [c for c in all_cols if c.startswith('q16_5_') and c.endswith('_resolved')]
q10_sev = [c for c in all_cols if c.startswith('q10_')]
q13_un  = [c for c in all_cols if c.startswith('q13_') and c.endswith('_unresolved')]
q13_re  = [c for c in all_cols if c.startswith('q13_') and c.endswith('_resolved')]
soc     = [c for c in all_cols if c.startswith('soc_')]
dis     = [c for c in all_cols if c.startswith('dis_')]

CLUSTER_COLS = q11_un + q11_re + q16_un + q16_re + q10_sev + q13_un + q13_re + soc + dis
print(f'  {len(respondent_ids)} respondents × {len(CLUSTER_COLS)} clustering features')
print(f'    emp Q11 unresolved/resolved: {len(q11_un)}+{len(q11_re)}')
print(f'    nan Q16_5 unresolved/resolved: {len(q16_un)}+{len(q16_re)}')
print(f'    nan Q10 severity: {len(q10_sev)}')
print(f'    nan Q13 readiness: {len(q13_un)}+{len(q13_re)}')
print(f'    SOC: {len(soc)}  dis: {len(dis)}')

X_raw = np.array([
    [float(r[c]) if r[c] != '' else np.nan for c in CLUSTER_COLS]
    for r in feature_rows
], dtype=np.float32)

# Dataset-specific features have ~50% missing (empty for the other dataset)
# Report missing per feature group
def missing_rate(cols):
    idx = [CLUSTER_COLS.index(c) for c in cols]
    sub = X_raw[:, idx]
    return np.isnan(sub).mean()

print(f'\n  Missing rates by group:')
print(f'    emp Q11: {missing_rate(q11_un+q11_re):.1%}')
print(f'    nan Q16_5: {missing_rate(q16_un+q16_re):.1%}')
print(f'    nan Q10: {missing_rate(q10_sev):.1%}')
print(f'    nan Q13: {missing_rate(q13_un+q13_re):.1%}')
print(f'    SOC: {missing_rate(soc):.1%}')
print(f'    dis: {missing_rate(dis):.1%}')

# ── Impute, scale, reduce ────────────────────────────────────────
print('\nImputing (median) ...')
imputer = SimpleImputer(strategy='median')
X_imp = imputer.fit_transform(X_raw)

print('Scaling ...')
scaler = StandardScaler()
X_sc = scaler.fit_transform(X_imp)

N_COMP = min(50, X_sc.shape[1] - 1)
print(f'TruncatedSVD (n={N_COMP}) ...')
svd = TruncatedSVD(n_components=N_COMP, random_state=42)
X_red = svd.fit_transform(X_sc)
cumvar = svd.explained_variance_ratio_.cumsum()
n80 = int(np.argmax(cumvar >= 0.80)) + 1
print(f'  Variance: 10comp={cumvar[9]:.1%}, 20comp={cumvar[19]:.1%}, 80%@{n80}comp')

n_use = max(n80, 15)
X_cl = X_red[:, :n_use]
print(f'  Using {n_use} components')

# ── KMeans with silhouette ───────────────────────────────────────
print('\nKMeans k ∈ {9, 11, 13, 15} ...')
best_k, best_labels, best_score = None, None, -1
results = {}

for k in [9, 11, 13, 15]:
    km = KMeans(n_clusters=k, n_init=10, max_iter=300, random_state=42)
    labels = km.fit_predict(X_cl)
    score = silhouette_score(X_cl, labels, sample_size=3000, random_state=42)
    results[k] = {'silhouette': round(float(score), 4), 'inertia': float(km.inertia_)}
    sizes = {i: int(np.sum(labels == i)) for i in range(k)}
    print(f'  k={k}: sil={score:.4f}  sizes={sorted(sizes.values(), reverse=True)}')
    if score > best_score:
        best_score, best_k, best_labels = score, k, labels

print(f'\nSelected k={best_k} (silhouette={best_score:.4f})')

# ── Build cluster profiles ───────────────────────────────────────
print('Building profiles ...')

with open(OUTCOMES_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    outcome_map = {r['respondent_id']: r for r in reader}

out_cols = [c for c in list(next(iter(outcome_map.values())).keys())
            if c not in ('respondent_id', 'dataset')]

# Display name mappings for readable profiles
Q11_LABELS = {
    'q11_11技能取得': '技能取得', 'q11_11注意集中': '注意集中', 'q11_11読むこと': '読むこと',
    'q11_11書くこと': '書くこと', 'q11_11計算すること': '計算',
    'q11_11問題解決・判断': '問題解決・判断', 'q11_11課題達成': '課題達成',
    'q11_11遅刻等せずに出勤': '出勤安定', 'q11_118時間労働': '8時間労働',
    'q11_11責任への対応': '責任対応', 'q11_11適度な休憩': '適度な休憩',
    'q11_11精神的ストレス対応': 'ストレス対応', 'q11_11危険への対応': '危険対応',
    'q11_11人との応対': '人との応対', 'q11_11円滑な人間関係': '対人関係',
    'q11_11話や文章の内容の理解': '理解', 'q11_11自分の意思を伝えること': '意思伝達',
    'q11_11会話や議論': '会話・議論', 'q11_11コミュニケーション機器の使用': 'コミュ機器',
    'q11_11トイレの利用': 'トイレ', 'q11_11清潔な身なりや服装': '身なり',
    'q11_11健康管理': '健康管理', 'q11_11通院': '通院',
    'q11_11勤務時間外の生活': '勤務外生活', 'q11_11座った姿勢': '座位',
    'q11_11立った姿勢': '立位', 'q11_11運搬': '運搬',
    'q11_11手と手指での操作': '手指操作', 'q11_11手と腕での操作': '腕操作',
    'q11_11歩くこと': '歩行', 'q11_11あちこちの移動': '移動',
    'q11_11交通機関の利用': '交通機関', 'q11_11乗り物の操作': '乗り物操作',
    'q11_11仕事の継続': '就業継続', 'q11_11昇進': '昇進', 'q11_11報酬': '報酬',
}
Q16_LABELS = {
    'q16_5_Q16_5_1': '仕事内容・働き方の無理',
    'q16_5_Q16_5_2': '職場への負担感',
    'q16_5_Q16_5_3': '疾患自己管理の限界',
    'q16_5_Q16_5_4': '人間関係ストレス',
    'q16_5_Q16_5_5': '病状進行による困難',
    'q16_5_Q16_5_6': '治療vs仕事トレードオフ',
    'q16_5_Q16_5_7': '病状悪化による離職',
    'q16_5_Q16_5_8': '集中力低下→退職勧奨',
    'q16_5_Q16_5_9': '休職超過による退職',
}
Q10_LABELS = {
    'q10_Q10_01_severity': '医師による就業制限',
    'q10_Q10_02_severity': '通院による生活支障',
    'q10_Q10_03_severity': '服薬・治療の支障',
    'q10_Q10_04_severity': '疲れやすさ・体調変動',
    'q10_Q10_05_severity': '少しの無理で崩れやすい',
    'q10_Q10_06_severity': '活力・集中力低下',
    'q10_Q10_07_severity': '運動協調・歩行機能障害',
    'q10_Q10_08_severity': '病状進行への不安',
    'q10_Q10_09_severity': '身体の痛み',
    'q10_Q10_10_severity': '皮膚・容貌の変化',
    'q10_Q10_11_severity': '免疫機能低下',
    'q10_Q10_12_severity': '精神・心理面の症状',
}
Q13_LABELS = {
    'q13_Q13_1': '治療と仕事両立の自信なし',
    'q13_Q13_2': '社会的疎外感',
    'q13_Q13_3': '就職困難・経済的追い詰め',
    'q13_Q13_4': '再就職意欲の喪失',
    'q13_Q13_5': '人生設計への悩み',
}

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']

def rate1(vals):
    valid = [float(v) for v in vals if v != '']
    if not valid:
        return 0.0
    return sum(1 for v in valid if v == 1.0) / len(valid)

def mean_f(vals):
    valid = [float(v) for v in vals if v != '']
    return statistics.mean(valid) if valid else None

profiles = {}
for cid in range(best_k):
    idxs = [i for i, l in enumerate(best_labels) if l == cid]
    rids = [respondent_ids[i] for i in idxs]
    feats = [feature_rows[i] for i in idxs]
    outs  = [outcome_map.get(rid, {}) for rid in rids]
    ds    = [datasets[i] for i in idxs]
    n_emp = sum(1 for d in ds if d == 'employment')
    n_nan = sum(1 for d in ds if d == 'nanbyo')

    def top_unresolved(cols, label_map, n=8):
        items = []
        for c in cols:
            vals = [r.get(c, '') for r in feats]
            r_ = rate1(vals)
            if r_ > 0:
                lbl = label_map.get(c, c.replace('_unresolved', '').replace('q11_', '').replace('q16_5_', '').replace('q13_', ''))
                items.append({'col': c, 'rate': round(r_, 3), 'label': lbl})
        return sorted(items, key=lambda x: -x['rate'])[:n]

    def q10_profile(n=5):
        items = []
        for c in q10_sev:
            vals = [r.get(c, '') for r in feats if r.get('dataset') == 'nanbyo']
            m = mean_f(vals)
            if m is not None:
                lbl = Q10_LABELS.get(c, c)
                items.append({'col': c, 'mean_severity': round(m, 2), 'label': lbl})
        return sorted(items, key=lambda x: -x['mean_severity'])[:n]

    soc_emp_mean = mean_f([r.get(c, '') for r in feats for c in [k for k in soc if k.startswith('soc_emp_')]])
    soc_nan_mean = mean_f([r.get(c, '') for r in feats for c in [k for k in soc if k.startswith('soc_nan_')]])

    dis_dist = {}
    for cat in BROAD_CATS:
        col = f'dis_{cat}'
        vals = [r.get(col, '') for r in feats]
        dis_dist[cat] = round(rate1(vals), 3)

    profiles[cid] = {
        'cluster_id': cid,
        'n': len(idxs),
        'n_employment': n_emp,
        'n_nanbyo': n_nan,
        'dataset_mix': f'emp {n_emp/len(idxs):.0%} / nan {n_nan/len(idxs):.0%}',
        'top_q11_unresolved': top_unresolved(q11_un, Q11_LABELS),
        'top_q16_5_unresolved': top_unresolved(q16_un, Q16_LABELS),
        'top_q13_unresolved': top_unresolved(q13_un, Q13_LABELS),
        'top_q10_severity': q10_profile(),
        'soc_mean': {
            'emp_soc': round(soc_emp_mean, 2) if soc_emp_mean else None,
            'nan_soc': round(soc_nan_mean, 2) if soc_nan_mean else None,
        },
        'disability_distribution': dis_dist,
    }

# ── Write outputs ────────────────────────────────────────────────
assign_path = os.path.join(V1, 'joint_cluster_assignments.csv')
with open(assign_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id', 'dataset', 'cluster_id'])
    writer.writeheader()
    for i, rid in enumerate(respondent_ids):
        writer.writerow({'respondent_id': rid, 'dataset': datasets[i], 'cluster_id': int(best_labels[i])})
print(f'Written: {assign_path}')

prof_path = os.path.join(V1, 'joint_cluster_profiles.json')
with open(prof_path, 'w', encoding='utf-8') as f:
    json.dump({
        'k': best_k,
        'method': 'joint StandardScaler → TruncatedSVD → KMeans',
        'n_svd_components_used': n_use,
        'datasets': ['employment_survey_3000', 'nanbyo_survey_4000'],
        'total_respondents': len(respondent_ids),
        'profiles': {str(k): v for k, v in profiles.items()},
    }, f, ensure_ascii=False, indent=2)
print(f'Written: {prof_path}')

qual_path = os.path.join(V1, 'joint_cluster_quality.json')
with open(qual_path, 'w', encoding='utf-8') as f:
    json.dump({
        'selected_k': best_k,
        'selected_silhouette': round(float(best_score), 4),
        'all_k_results': {str(k): {'silhouette': v['silhouette'], 'inertia': round(float(v['inertia']), 1)} for k, v in results.items()},
        'svd_cumulative_variance': {
            '10comp': round(float(cumvar[9]), 4),
            '20comp': round(float(cumvar[19]), 4),
            '80pct_at': int(n80),
        }
    }, f, ensure_ascii=False, indent=2)
print(f'Written: {qual_path}')

# ── Summary ──────────────────────────────────────────────────────
print('\n── Joint cluster summary ───────────────────────────────────')
for cid, p in sorted(profiles.items()):
    print(f'\nC{cid} (n={p["n"]}, {p["dataset_mix"]}):')
    if p['top_q11_unresolved']:
        print(f'  Q11 unresolved (emp):')
        for item in p['top_q11_unresolved'][:4]:
            print(f'    {item["rate"]:.0%}  {item["label"]}')
    if p['top_q16_5_unresolved']:
        print(f'  Q16_5 unresolved (nan):')
        for item in p['top_q16_5_unresolved'][:3]:
            print(f'    {item["rate"]:.0%}  {item["label"]}')
    if p['top_q10_severity']:
        print(f'  Q10 severity (nan):')
        for item in p['top_q10_severity'][:3]:
            print(f'    {item["mean_severity"]:.1f}  {item["label"]}')
    top_dis = sorted(p['disability_distribution'].items(), key=lambda x: -x[1])[:3]
    print(f'  Disability: {[(d, f"{r:.0%}") for d, r in top_dis]}')
    soc = p['soc_mean']
    print(f'  SOC emp={soc["emp_soc"]}  nan={soc["nan_soc"]}')

print('\nDone.')
