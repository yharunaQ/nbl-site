"""
Re-cluster employment_survey_3000 using ICF wide-format feature matrix (v1).

Method: Impute missing → StandardScaler → TruncatedSVD (dim reduction) → KMeans
Output: data/analysis_ready/respondents/employment_survey_3000/v1/icf_cluster_assignments.csv
        data/analysis_ready/respondents/employment_survey_3000/v1/icf_cluster_profiles.json
        data/analysis_ready/respondents/employment_survey_3000/v1/icf_cluster_quality.json

After clustering, profiles are enriched with:
  - Q11 unresolved challenge prevalence per cluster (activity difficulty profile)
  - Q7 pre-employment challenge resolution per cluster (outcome profile)
  - SOC profile per cluster (personal factors)
  - Disability distribution per cluster
"""

import csv
import json
import os
import statistics

import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.impute import SimpleImputer
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

DATA_DIR = os.path.join(
    os.path.dirname(__file__), '../../data/analysis_ready/respondents/employment_survey_3000'
)
V1 = os.path.join(DATA_DIR, 'v1')

FEATURES_PATH = os.path.join(V1, 'icf_wide_features.csv')
OUTCOMES_PATH = os.path.join(V1, 'icf_outcomes.csv')

# ── Load features ────────────────────────────────────────────────
print('Loading icf_wide_features.csv ...')
with open(FEATURES_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    feature_rows = list(reader)

respondent_ids = [r['respondent_id'] for r in feature_rows]
all_cols = [c for c in feature_rows[0].keys() if c != 'respondent_id']

# Separate feature groups for display purposes
q11_un_cols = [c for c in all_cols if c.startswith('q11_') and c.endswith('_unresolved')]
q11_re_cols = [c for c in all_cols if c.startswith('q11_') and c.endswith('_resolved')]
q11_ok_cols = [c for c in all_cols if c.startswith('q11_') and c.endswith('_no_problem')]
soc_cols    = [c for c in all_cols if c.startswith('soc_')]
dis_cols    = [c for c in all_cols if c.startswith('dis_')]
demo_cols   = [c for c in all_cols if c in ('sex_code', 'age')]

# Clustering inputs: q11_unresolved + q11_resolved + soc + dis
# (exclude q11_no_problem to avoid collinearity, exclude demographics for now)
CLUSTER_COLS = q11_un_cols + q11_re_cols + soc_cols + dis_cols
print(f'  {len(respondent_ids)} respondents × {len(CLUSTER_COLS)} clustering features')
print(f'    Q11 unresolved: {len(q11_un_cols)}  Q11 resolved: {len(q11_re_cols)}')
print(f'    SOC: {len(soc_cols)}  Disability: {len(dis_cols)}')

# Build numpy matrix
X_raw = np.array([
    [float(r[c]) if r[c] != '' else np.nan for c in CLUSTER_COLS]
    for r in feature_rows
], dtype=np.float32)

print(f'  Missing rate: {np.isnan(X_raw).mean():.1%}')

# ── Impute, scale, reduce ────────────────────────────────────────
print('Imputing missing values (median) ...')
imputer = SimpleImputer(strategy='median')
X_imputed = imputer.fit_transform(X_raw)

print('Scaling ...')
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# Determine SVD components: capture ~80% variance, max 40
N_COMPONENTS = min(40, X_scaled.shape[1] - 1)
print(f'Running TruncatedSVD (n_components={N_COMPONENTS}) ...')
svd = TruncatedSVD(n_components=N_COMPONENTS, random_state=42)
X_reduced = svd.fit_transform(X_scaled)
cumvar = svd.explained_variance_ratio_.cumsum()
n_80pct = int(np.argmax(cumvar >= 0.80)) + 1
print(f'  Explained variance: {cumvar[9]:.1%} (10 components), {cumvar[19]:.1%} (20), {cumvar[n_80pct-1]:.1%} ({n_80pct} components for 80%)')

# Use components that explain ~80% variance
X_cluster = X_reduced[:, :max(n_80pct, 12)]
print(f'  Using {X_cluster.shape[1]} components for clustering')

# ── KMeans: try k=7,9,11,13 and pick best silhouette ────────────
print('\nRunning KMeans for k in [7, 9, 11, 13] ...')
best_k = None
best_labels = None
best_score = -1
results = {}

for k in [7, 9, 11, 13]:
    km = KMeans(n_clusters=k, n_init=10, max_iter=200, random_state=42)
    labels = km.fit_predict(X_cluster)
    score = silhouette_score(X_cluster, labels, sample_size=2000, random_state=42)
    results[k] = {'silhouette': round(float(score), 4), 'inertia': float(km.inertia_)}
    print(f'  k={k}: silhouette={score:.4f}, inertia={km.inertia_:.0f}')
    if score > best_score:
        best_score = score
        best_k = k
        best_labels = labels

print(f'\nSelected k={best_k} (silhouette={best_score:.4f})')

# ── Build cluster profiles ───────────────────────────────────────
print('Building cluster profiles ...')

# Load outcomes
with open(OUTCOMES_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    outcome_rows = {r['respondent_id']: r for r in reader}

q7_un_cols = [c for c in list(next(iter(outcome_rows.values())).keys())
              if c != 'respondent_id' and c.endswith('_unresolved')]
q7_re_cols = [c for c in list(next(iter(outcome_rows.values())).keys())
              if c != 'respondent_id' and c.endswith('_resolved')]

BROAD_CATS = ['視覚障害', '聴覚障害', '肢体不自由', '内部障害', '知的障害', '精神障害', '発達障害', '高次脳機能障害', '難病']

def rate(vals: list, target) -> float:
    valid = [v for v in vals if v != '']
    if not valid:
        return 0.0
    return sum(1 for v in valid if str(v) == str(target)) / len(valid)

def mean_val(vals: list) -> float | None:
    valid = [float(v) for v in vals if v != '']
    return statistics.mean(valid) if valid else None

profiles = {}
for cluster_id in range(best_k):
    idxs = [i for i, l in enumerate(best_labels) if l == cluster_id]
    rids = [respondent_ids[i] for i in idxs]
    feats = [feature_rows[i] for i in idxs]
    outs = [outcome_rows.get(rid, {}) for rid in rids]

    # Top unresolved Q11 challenges (by prevalence in cluster)
    q11_unresolved_rates = {}
    for col in q11_un_cols:
        vals = [r.get(col, '') for r in feats]
        r_ = rate(vals, 1)
        if r_ > 0.0:
            label = col.replace('q11_11', '').replace('q11_118', '8時間労働').replace('_unresolved', '').replace('11', '')
            q11_unresolved_rates[col] = {'rate': round(r_, 3), 'label': label}

    top_unresolved = sorted(q11_unresolved_rates.items(), key=lambda x: -x[1]['rate'])[:10]

    # Q7 pre-employment unresolved (outcome)
    q7_unresolved_rates = {}
    for col in q7_un_cols:
        vals = [r.get(col, '') for r in outs]
        r_ = rate(vals, 1)
        if r_ > 0.0:
            label = col.replace('q7_7', '').replace('_unresolved', '')
            q7_unresolved_rates[col] = {'rate': round(r_, 3), 'label': label}

    top_q7_unresolved = sorted(q7_unresolved_rates.items(), key=lambda x: -x[1]['rate'])[:5]

    # SOC profile
    soc_profile = {}
    for col in soc_cols:
        vals = [r.get(col, '') for r in feats]
        m = mean_val(vals)
        short = col.replace('soc_16', '').replace('soc_17', '')
        if m is not None:
            soc_profile[short] = round(m, 2)

    # Disability distribution
    dis_dist = {}
    for cat in BROAD_CATS:
        col = f'dis_{cat}'
        vals = [r.get(col, 0) for r in feats]
        dis_dist[cat] = round(sum(float(v) for v in vals) / len(vals), 3)

    profiles[cluster_id] = {
        'cluster_id': cluster_id,
        'n': len(idxs),
        'top_unresolved_q11': [
            {'variable': k, 'rate': v['rate'], 'label': v['label']}
            for k, v in top_unresolved
        ],
        'top_unresolved_q7_pre_employment': [
            {'variable': k, 'rate': v['rate'], 'label': v['label']}
            for k, v in top_q7_unresolved
        ],
        'soc_mean_profile': soc_profile,
        'disability_distribution': dis_dist,
    }

# ── Write outputs ────────────────────────────────────────────────
assignments_path = os.path.join(V1, 'icf_cluster_assignments.csv')
with open(assignments_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['respondent_id', 'cluster_id'])
    writer.writeheader()
    for i, rid in enumerate(respondent_ids):
        writer.writerow({'respondent_id': rid, 'cluster_id': int(best_labels[i])})
print(f'Written: {assignments_path}')

profiles_path = os.path.join(V1, 'icf_cluster_profiles.json')
with open(profiles_path, 'w', encoding='utf-8') as f:
    json.dump({
        'k': best_k,
        'method': 'StandardScaler → TruncatedSVD → KMeans',
        'n_svd_components': int(X_cluster.shape[1]),
        'explained_variance_80pct_threshold': n_80pct,
        'clustering_features': CLUSTER_COLS,
        'profiles': profiles,
    }, f, ensure_ascii=False, indent=2)
print(f'Written: {profiles_path}')

quality_path = os.path.join(V1, 'icf_cluster_quality.json')
with open(quality_path, 'w', encoding='utf-8') as f:
    json.dump({
        'selected_k': best_k,
        'selected_silhouette': round(float(best_score), 4),
        'all_k_results': {str(k): {'silhouette': v['silhouette'], 'inertia': round(float(v['inertia']), 1)} for k, v in results.items()},
        'svd_explained_variance': {
            f'component_{i+1}': round(float(v), 4)
            for i, v in enumerate(svd.explained_variance_ratio_)
        },
        'cumulative_variance': {
            '10_components': round(float(cumvar[9]), 4),
            '20_components': round(float(cumvar[19]), 4),
            '80pct_components': int(n_80pct),
        }
    }, f, ensure_ascii=False, indent=2)
print(f'Written: {quality_path}')

print('\n── Cluster summary ─────────────────────────────────────────')
for cid, p in sorted(profiles.items()):
    print(f'\nCluster {cid} (n={p["n"]}):')
    print(f'  Top unresolved (Q11):')
    for item in p['top_unresolved_q11'][:5]:
        print(f'    {item["rate"]:.0%}  {item["label"]}')
    print(f'  Top disability:')
    top_dis = sorted(p['disability_distribution'].items(), key=lambda x: -x[1])[:3]
    for cat, rate_ in top_dis:
        print(f'    {rate_:.0%}  {cat}')
    soc_vals = list(p['soc_mean_profile'].values())
    if soc_vals:
        print(f'  SOC mean: {statistics.mean(soc_vals):.2f}')

print('\nDone.')
