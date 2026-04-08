"""
Supporter integrated clustering: canonical dims + narrative signals.

Combines:
  - 8 canonical dimensions (from build_supporter_canonical_features.py)
  - 15 narrative ICF signals (from extract_supporter_narrative_signals.py)
  - 6 institution type flags

Total: 29 features → StandardScaler → TruncatedSVD → KMeans

Output (data/analysis_ready/supporters/joint/v1_narrative/):
  supporter_cluster_assignments.csv
  supporter_cluster_profiles.json
  supporter_cluster_quality.json
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
FEATURES_PATH  = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_canonical_features.csv')
NARRATIVE_PATH = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_narrative_signals.jsonl')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative')

CANONICAL_DIMS = [
    ('d1', 'support_orientation'),
    ('d2', 'work_continuity_awareness'),
    ('d3', 'respondent_context_beliefs'),
    ('d4', 'support_knowledge'),
    ('d5', 'network_coordination'),
    ('d6', 'implementation_feasibility'),
    ('d7', 'organizational_climate'),
    ('d8', 'motivation_meaningfulness'),
]
DIM_KEYS  = [k for k, _ in CANONICAL_DIMS]
DIM_NAMES = {k: n for k, n in CANONICAL_DIMS}
INST_TYPES = ['medical', 'welfare', 'labor', 'health', 'education', 'other']

NARRATIVE_SIGNALS = [
    'whole_person_practice',
    'environment_design_active',
    'work_continuity_commitment',
    'respondent_centered',
    'proactive_network_coordination',
    'medical_employment_gap',
    'coordination_role_clear',
    'knowledge_skill_gap',
    'disclosure_navigation_skill',
    'system_gap_aware',
    'early_outreach_awareness',
    'institutional_barrier',
    'regional_ecosystem_gap',
    'economic_context_active',
    'motivation_and_meaning',
]

NARRATIVE_LABELS = {
    'whole_person_practice':         '全人的支援の実践',
    'environment_design_active':     '環境改善・職場設計への関与',
    'work_continuity_commitment':    '就職後継続・治療と仕事の両立',
    'respondent_centered':           '当事者視点の実践',
    'proactive_network_coordination':'多機関連携の積極的調整',
    'medical_employment_gap':        '医療と就労の連携ギャップ認識',
    'coordination_role_clear':       '連携役割の明確さ',
    'knowledge_skill_gap':           '知識・スキル不足の認識',
    'disclosure_navigation_skill':   '開示支援スキル',
    'system_gap_aware':              '制度の谷間への意識',
    'early_outreach_awareness':      '早期支援の重要性認識',
    'institutional_barrier':         '組織・制度的障壁の存在',
    'regional_ecosystem_gap':        '地域連携エコシステムの不足',
    'economic_context_active':       '経済的文脈への配慮',
    'motivation_and_meaning':        '就労支援のやりがい・使命感',
}


# ════════════════════════════════════════════════════════════════
# LOAD CANONICAL FEATURES
# ════════════════════════════════════════════════════════════════
print('Loading canonical features ...')
records = {}
with open(FEATURES_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = row['supporter_id']
        r = {'supporter_id': sid, 'dataset': row['dataset']}
        for col in DIM_KEYS + [f'inst_{it}' for it in INST_TYPES]:
            v = row.get(col, '')
            try:
                r[col] = float(v) if v and v != 'None' else None
            except ValueError:
                r[col] = None
        records[sid] = r

total = len(records)
print(f'  {total} supporters loaded')


# ════════════════════════════════════════════════════════════════
# LOAD NARRATIVE SIGNALS
# ════════════════════════════════════════════════════════════════
print('Loading narrative signals ...')
narrative = {}
if not os.path.exists(NARRATIVE_PATH):
    print(f'  [WARN] Narrative file not found: {NARRATIVE_PATH}')
    print('  Run extract_supporter_narrative_signals.py first. Continuing without narrative.')
else:
    with open(NARRATIVE_PATH, encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
                sid = d['supporter_id']
                if d.get('extraction_ok') and d.get('signals'):
                    narrative[sid] = {
                        sig: d['signals'].get(sig, 0) / 2.0
                        for sig in NARRATIVE_SIGNALS
                    }
                    narrative[sid]['_practice_summary'] = d.get('practice_summary', '')
                    narrative[sid]['_key_phrases'] = d.get('key_phrases', [])
            except Exception:
                pass
    print(f'  {len(narrative)} supporters with narrative signals')


# ════════════════════════════════════════════════════════════════
# BUILD FEATURE MATRIX
# ════════════════════════════════════════════════════════════════
CANONICAL_COLS  = DIM_KEYS
INST_COLS       = [f'inst_{it}' for it in INST_TYPES]
NARRATIVE_COLS  = [f'narr_{s}' for s in NARRATIVE_SIGNALS]
FEATURE_COLS    = CANONICAL_COLS + INST_COLS + NARRATIVE_COLS

rec_list = []
for sid, r in sorted(records.items()):
    row = dict(r)
    nd = narrative.get(sid)
    for sig in NARRATIVE_SIGNALS:
        row[f'narr_{sig}'] = nd[sig] if nd else None
    rec_list.append(row)

print(f'\nFeature matrix: {len(rec_list)} × {len(FEATURE_COLS)}')
print(f'Narrative signal coverage: {len(narrative)}/{total} ({len(narrative)/total:.1%})')

print('\nCanonical dimension coverage:')
for dk in DIM_KEYS:
    n = sum(1 for r in rec_list if r.get(dk) is not None)
    print(f'  {DIM_NAMES[dk]}: {n}/{total} ({n/total:.1%})')

X_raw = np.array([
    [float(r[c]) if r.get(c) is not None else np.nan for c in FEATURE_COLS]
    for r in rec_list
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
print(f'  Cumulative variance: {[round(v, 3) for v in cumvar]}')

print('\nKMeans k ∈ {7, 9, 11, 13} ...')
best_k, best_labels, best_score = None, None, -1
results = {}
for k in [7, 9, 11, 13]:
    km = KMeans(n_clusters=k, n_init=20, max_iter=300, random_state=42)
    labels = km.fit_predict(X_cl)
    score = silhouette_score(X_cl, labels, sample_size=min(2000, total), random_state=42)
    sizes = sorted([int(np.sum(labels == i)) for i in range(k)], reverse=True)
    results[k] = {'silhouette': round(float(score), 4), 'inertia': float(km.inertia_), 'sizes': sizes}
    print(f'  k={k}: sil={score:.4f}  sizes={sizes}')
    if score > best_score:
        best_score, best_k, best_labels = score, k, labels

print(f'\nSelected k={best_k} (silhouette={best_score:.4f})')


# ════════════════════════════════════════════════════════════════
# BUILD PROFILES
# ════════════════════════════════════════════════════════════════
print('Building profiles ...')
supporter_ids = [r['supporter_id'] for r in rec_list]
datasets_list  = [r['dataset'] for r in rec_list]

profiles = {}
for cid in range(best_k):
    idxs  = [i for i, l in enumerate(best_labels) if l == cid]
    sids  = [supporter_ids[i] for i in idxs]
    ds    = [datasets_list[i] for i in idxs]
    n_nan = sum(1 for d in ds if d == 'nanbyo')
    n_tok = sum(1 for d in ds if d == 'toku18')
    recs  = [rec_list[i] for i in idxs]

    # Canonical dimension means
    dim_means = {}
    for dk in DIM_KEYS:
        vals = [r[dk] for r in recs if r.get(dk) is not None]
        dim_means[DIM_NAMES[dk]] = round(statistics.mean(vals), 3) if vals else None

    # Institution type distribution
    inst_dist = {}
    for it in INST_TYPES:
        col = f'inst_{it}'
        inst_dist[it] = round(statistics.mean([r.get(col, 0) for r in recs]), 3)

    # Narrative signal means
    narr_recs = [r for r in recs if r.get('narr_whole_person_practice') is not None]
    narr_means = {}
    if narr_recs:
        for sig in NARRATIVE_SIGNALS:
            col = f'narr_{sig}'
            vals = [r[col] for r in narr_recs if r.get(col) is not None]
            narr_means[sig] = round(statistics.mean(vals), 3) if vals else None

    top_narr = sorted(
        [(sig, v) for sig, v in narr_means.items() if v is not None],
        key=lambda x: -x[1]
    )[:5]

    # Sample practice summaries
    sample_summaries = []
    for sid in sids[:200]:
        nd = narrative.get(sid)
        if nd and nd.get('_practice_summary'):
            sample_summaries.append(nd['_practice_summary'])
    sample_summaries = list(dict.fromkeys(sample_summaries))[:8]

    profiles[f'C{cid}'] = {
        'n': len(sids),
        'n_nanbyo': n_nan,
        'n_toku18': n_tok,
        'nan_ratio': round(n_nan / len(sids), 2),
        'tok_ratio': round(n_tok / len(sids), 2),
        'n_with_narrative': len(narr_recs),
        'narrative_coverage': round(len(narr_recs) / len(sids), 2),
        'canonical_dims': dim_means,
        'institution_dist': inst_dist,
        'narrative_signals_all': narr_means if narr_recs else {},
        'top_narrative_signals': [
            {'signal': sig, 'label': NARRATIVE_LABELS[sig], 'mean': v}
            for sig, v in top_narr
        ],
        'sample_practice_summaries': sample_summaries,
    }

profiles = dict(sorted(profiles.items(), key=lambda x: -x[1]['n']))


# ════════════════════════════════════════════════════════════════
# SAVE OUTPUTS
# ════════════════════════════════════════════════════════════════

# 1. Cluster assignments CSV
asgn_path = os.path.join(OUT_DIR, 'supporter_cluster_assignments.csv')
label_map = {supporter_ids[i]: int(best_labels[i]) for i in range(total)}
with open(asgn_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['supporter_id', 'dataset', 'cluster_id', 'has_narrative', 'practice_summary'])
    for r in rec_list:
        sid = r['supporter_id']
        nd = narrative.get(sid)
        writer.writerow([
            sid, r['dataset'], f"C{label_map[sid]}",
            1 if nd else 0,
            nd['_practice_summary'] if nd else '',
        ])
print(f'Saved: {asgn_path}')

# 2. Profiles JSON
prof_path = os.path.join(OUT_DIR, 'supporter_cluster_profiles.json')
with open(prof_path, 'w', encoding='utf-8') as f:
    json.dump(profiles, f, ensure_ascii=False, indent=2)
print(f'Saved: {prof_path}')

# 3. Quality JSON
quality = {
    'selected_k': best_k,
    'best_silhouette': round(best_score, 4),
    'total_supporters': total,
    'narrative_coverage_total': len(narrative),
    'narrative_coverage_pct': round(len(narrative) / total, 3),
    'feature_counts': {
        'canonical_dims': len(CANONICAL_COLS),
        'institution_flags': len(INST_COLS),
        'narrative_signals': len(NARRATIVE_COLS),
        'total': len(FEATURE_COLS),
    },
    'svd_cumvar': [round(v, 4) for v in cumvar.tolist()],
    'kmeans_results': results,
    'cluster_sizes': {k: v['n'] for k, v in profiles.items()},
}
qual_path = os.path.join(OUT_DIR, 'supporter_cluster_quality.json')
with open(qual_path, 'w', encoding='utf-8') as f:
    json.dump(quality, f, ensure_ascii=False, indent=2)
print(f'Saved: {qual_path}')

# ── Summary ───────────────────────────────────────────────────
print('\n═══ SUPPORTER CLUSTER SUMMARY ═══')
for cid, p in profiles.items():
    top = ', '.join(f"{x['label']}={x['mean']:.2f}" for x in p['top_narrative_signals'][:3])
    inst = ', '.join(f"{k}={v:.0%}" for k, v in p['institution_dist'].items() if v > 0.15)
    print(f"{cid} n={p['n']:4d} nan={p['nan_ratio']:.0%} tok={p['tok_ratio']:.0%} "
          f"narr={p['narrative_coverage']:.0%}")
    dims = p['canonical_dims']
    print(f"  D1(orient)={dims.get('support_orientation','?')} "
          f"D5(network)={dims.get('network_coordination','?')} "
          f"D6(feasib)={dims.get('implementation_feasibility','?')} "
          f"D7(org)={dims.get('organizational_climate','?')}")
    if top: print(f"  top_narr: {top[:80]}")
    if inst: print(f"  inst: {inst}")
    if p['sample_practice_summaries']:
        print(f"  summaries: {p['sample_practice_summaries'][:2]}")
    print()

print(f'Done. Output: {OUT_DIR}')
