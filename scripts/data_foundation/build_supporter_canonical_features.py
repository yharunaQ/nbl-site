"""
Supporter canonical feature matrix from structured survey data.

Maps both supporter datasets (nanbyo + toku18) to 8 shared canonical dimensions
aligned with the Supporter Behavioral Driver Schema v0:

  D1: support_orientation       — whole-person, env-modification, team, life-scene practice
  D2: work_continuity_awareness — post-employment focus, treatment-work continuity belief
  D3: respondent_context_beliefs — awareness of what respondents actually face
  D4: support_knowledge         — institutional knowledge of services and systems
  D5: network_coordination      — cross-agency network participation and referral density
  D6: implementation_feasibility — can implement support (own skill + org support)
  D7: organizational_climate    — supportiveness of organizational/regional context
  D8: motivation_meaningfulness — supporter motivation and sense of meaning (toku18 only)

Institution type flags:
  inst_medical, inst_welfare, inst_labor, inst_health, inst_education

Output (data/analysis_ready/supporters/joint/v1_narrative/):
  supporter_canonical_features.csv
  supporter_feature_manifest.json
"""

import csv
import json
import os
import statistics

BASE = os.path.join(os.path.dirname(__file__), '../..')
NAN_SF  = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_nanbyo/v0/structured_features.csv')
TOK_SF  = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/structured_features.csv')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative')
os.makedirs(OUT_DIR, exist_ok=True)

def parse_norm(nv): return [x.strip() for x in nv.split('+') if x.strip()]
def has(nv, *codes): return any(c in parse_norm(nv) for c in codes)
def safe_float(nv):
    vals = parse_norm(nv)
    try: return float(vals[0]) if len(vals) == 1 else None
    except: return None

def norm(v, lo, hi):
    """Normalize v from [lo,hi] to [0,1]. Higher = better/more."""
    if v is None: return None
    return max(0.0, min(1.0, (v - lo) / (hi - lo)))

def inorm(v, lo, hi):
    """Inverted normalize: lower raw = higher score."""
    if v is None: return None
    return max(0.0, min(1.0, (hi - v) / (hi - lo)))

def dim_mean(signals):
    valid = [s for s in signals if s is not None]
    return statistics.mean(valid) if valid else None


# ════════════════════════════════════════════════════════════════
# LOAD NANBYO SUPPORTERS
# ════════════════════════════════════════════════════════════════
print('Loading supporter_practice_nanbyo ...')

nan = {}

# Institution type mappings (Q01 codes → broad types)
NAN_INST = {
    '1': 'health',    # 保健所
    '2': 'welfare',   # 患者会
    '3': 'labor',     # ハローワーク/難病サポーター
    '4': 'health',    # 難病相談支援センター
    '5': 'health',    # 産業保健
    '6': 'medical',   # 病院・診療所
    '7': 'welfare',   # 障害者就業・生活支援センター
    '8': 'welfare',   # 就労移行支援事業所
    '9': 'other',
}

with open(NAN_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"nan_{row['respondent_id']}"
        var = row['raw_name']
        grp = row['question_group']
        nv  = row['normalized_value'].strip()

        if sid not in nan:
            nan[sid] = {f'd{i}': [] for i in range(1, 9)}
            nan[sid]['inst'] = {}
            nan[sid]['dataset'] = 'nanbyo'

        b = nan[sid]

        # D1: support_orientation (Q06: 1-5 scale, (v-1)/4)
        if var in ('Q06_1','Q06_2','Q06_3','Q06_4'):
            v = safe_float(nv)
            if v is not None: b['d1'].append(norm(v, 1, 5))

        # D2: work_continuity_awareness (Q07_3, Q07_5: 1-3 scale, (v-1)/2)
        if var in ('Q07_3','Q07_5'):
            v = safe_float(nv)
            if v is not None: b['d2'].append(norm(v, 1, 3))

        # D3: respondent_context_beliefs (Q07_1, Q07_2, Q07_4, Q08_01-Q08_10: 1-3 scale)
        if var in ('Q07_1','Q07_2','Q07_4'):
            v = safe_float(nv)
            if v is not None: b['d3'].append(norm(v, 1, 3))
        # Q08 items: 1-3 scale (higher=more aware of respondent realities)
        if var.startswith('Q08_'):
            v = safe_float(nv)
            if v is not None: b['d3'].append(norm(v, 1, 3))

        # D4: support_knowledge (Q09: 1-5 scale, (v-1)/4, higher=more knowledgeable)
        if var.startswith('Q09_'):
            v = safe_float(nv)
            if v is not None: b['d4'].append(norm(v, 1, 5))

        # D5: network_coordination
        # Network = proportion of Q09 items where code='5' (actively uses in practice)
        if var.startswith('Q09_'):
            b['d5'].append(1.0 if has(nv, '5') else 0.0)

        # D6: implementation_feasibility
        # Q10: 1-5 scale, (v-1)/4
        if var.startswith('Q10_'):
            v = safe_float(nv)
            if v is not None: b['d6'].append(norm(v, 1, 5))
        # Q11: 1-3 scale (1=困難, 3=成果あり), (v-1)/2
        if var.startswith('Q11_'):
            v = safe_float(nv)
            if v is not None: b['d6'].append(norm(v, 1, 3))

        # D7: organizational_climate (Q05: 1-5 scale, (v-1)/4, higher=better org support)
        if var == 'Q05':
            v = safe_float(nv)
            if v is not None: b['d7'].append(norm(v, 1, 5))

        # D8: motivation_meaningfulness — not in nanbyo survey

        # Institution type flags
        if var == 'Q01':
            for code in parse_norm(nv):
                inst_type = NAN_INST.get(code)
                if inst_type: b['inst'][inst_type] = 1

print(f'  {len(nan)} nanbyo supporters')


# ════════════════════════════════════════════════════════════════
# LOAD TOKU18 SUPPORTERS
# ════════════════════════════════════════════════════════════════
print('Loading supporter_practice_toku18 ...')

tok = {}

# Institution type mappings (問2 codes)
TOK_INST = {
    '1': 'medical', '2': 'medical',                           # 病院, クリニック
    '3': 'health',  '4': 'health', '5': 'health',             # 保健所, 難病相談, 保健医療他
    '6': 'welfare', '7': 'welfare', '8': 'welfare',           # 就労移行, A型, B型
    '9': 'welfare', '10': 'welfare', '11': 'welfare',         # 福祉事務所, 発達, 福祉他
    '12': 'education', '13': 'education', '14': 'education',  # 特支中, 高, 教育他
    '15': 'labor',  '16': 'labor', '17': 'labor',             # ハローワーク, 職業センター, ナカポツ
    '18': 'labor',  '19': 'labor',                             # 職業訓練, 多様な委託訓練
    '20': 'other',
}

# 問7群: 4-point scale — code '2' = "支援により解決・改善可能"
# Items for D2 (work continuity): 問7_1②就労意欲, 問7_1⑧職場環境改善 (continuity-adjacent)
# Items for D3 (respondent context beliefs): all 問7 items (belief in solvability)
TOK_D2_VARS = {
    '問7_1②就労意欲', '問7_1⑧職場環境の改善', '問7_1⑦入職・復職後の職場適応',
}
# 問8群: multi-code, code '2' = active external cooperation → D5
# 問9群: 1-4 scale, 1=相談可能, 4=不要 → invert: (4-v)/3 → D4
# 問10群: 1-5 scale, 1=そう思う, 5=そう思わない → invert: (5-v)/4 → D3
# 問11群: multi-code, '1' or '2' = implements (own or external) → D6, binary
# 問13群: multi-code, '1' or '2' = participates in network → D5
# 問14群: 1-4 scale, 1=積極的, 4=消極的 → invert: (4-v)/3 → D7
# 問15群: 1-5 scale, 1=やりがいある, 5=ない → invert: (5-v)/4 → D8

with open(TOK_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"tok_{row['respondent_id']}"
        var = row['raw_name']
        grp = row['question_group']
        nv  = row['normalized_value'].strip()

        if sid not in tok:
            tok[sid] = {f'd{i}': [] for i in range(1, 9)}
            tok[sid]['inst'] = {}
            tok[sid]['dataset'] = 'toku18'

        b = tok[sid]

        # D2: work_continuity_awareness (問7群, code='2' for continuity items)
        if grp == '障害者の就労課題と解決可能性' and var in TOK_D2_VARS:
            b['d2'].append(1.0 if has(nv, '2') else 0.0)

        # D3: respondent_context_beliefs
        # All 問7 items where code='2' (believes solvable)
        if grp == '障害者の就労課題と解決可能性' and not var.endswith('記述'):
            b['d3'].append(1.0 if has(nv, '2') else 0.0)
        # 問10: support beliefs, 1-5 inverted
        if grp == '障害者就労支援の理念・プロセスへの意見・見解' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['d3'].append(inorm(v, 1, 5))

        # D4: support_knowledge (問9: 1-4, 1=capable, 4=not needed → invert (4-v)/3)
        if grp == '障害者雇用の基礎知識の修得状況' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['d4'].append(inorm(v, 1, 4))

        # D5: network_coordination
        # 問8: code '2' = active external cooperation
        if grp == '就労支援や連携状況' and not var.endswith('記述'):
            b['d5'].append(1.0 if has(nv, '2') else 0.0)
        # 問13: code '1' or '2' = participates
        if grp == '障害者就労支援のための地域連携体制' and not var.endswith('記述'):
            b['d5'].append(1.0 if has(nv, '1', '2') else 0.0)

        # D6: implementation_feasibility (問11: code '1' or '2' = can implement)
        if grp == '障害者就労支援の実施可能性や連携の必要性' and not var.endswith('記述'):
            b['d6'].append(1.0 if has(nv, '1', '2') else 0.0)

        # D7: organizational_climate (問14: 1-4, 1=積極的, 4=消極的 → invert)
        if grp == '周囲の組織や地域の障害者就労支援の状況' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['d7'].append(inorm(v, 1, 4))

        # D8: motivation_meaningfulness (問15: 1-5, 1=やりがいある → invert)
        if grp == '障害者就労支援のやりがい' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['d8'].append(inorm(v, 1, 5))

        # Institution type flags
        if var == '問2所属機関':
            for code in parse_norm(nv):
                inst_type = TOK_INST.get(code)
                if inst_type: b['inst'][inst_type] = 1

print(f'  {len(tok)} toku18 supporters')


# ════════════════════════════════════════════════════════════════
# BUILD CANONICAL FEATURE MATRIX
# ════════════════════════════════════════════════════════════════
all_supp = {**nan, **tok}
total = len(all_supp)
print(f'\nTotal: {total} supporters')

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

records = []
for sid, b in sorted(all_supp.items()):
    row = {'supporter_id': sid, 'dataset': b['dataset']}
    for dk in DIM_KEYS:
        row[dk] = dim_mean(b.get(dk, []))
    for it in INST_TYPES:
        row[f'inst_{it}'] = float(b.get('inst', {}).get(it, 0))
    records.append(row)

print('\nCanonical dimension coverage:')
for dk in DIM_KEYS:
    n = sum(1 for r in records if r[dk] is not None)
    vals = [r[dk] for r in records if r[dk] is not None]
    mean_val = statistics.mean(vals) if vals else None
    mean_str = f'{mean_val:.3f}' if mean_val is not None else 'N/A'
    print(f'  {DIM_NAMES[dk]}: {n}/{total} ({n/total:.1%}) mean={mean_str}')

# Save CSV
out_path = os.path.join(OUT_DIR, 'supporter_canonical_features.csv')
FEATURE_COLS = DIM_KEYS + [f'inst_{it}' for it in INST_TYPES]
with open(out_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['supporter_id', 'dataset'] + FEATURE_COLS)
    writer.writeheader()
    for r in records:
        writer.writerow({k: (f'{r[k]:.6f}' if isinstance(r[k], float) else r[k])
                         for k in ['supporter_id', 'dataset'] + FEATURE_COLS})
print(f'\nSaved: {out_path} ({len(records)} rows × {len(FEATURE_COLS)} features)')

# Save manifest
manifest = {
    'total_supporters': total,
    'datasets': {
        'nanbyo': sum(1 for r in records if r['dataset'] == 'nanbyo'),
        'toku18': sum(1 for r in records if r['dataset'] == 'toku18'),
    },
    'feature_cols': FEATURE_COLS,
    'canonical_dims': [{'key': k, 'name': n} for k, n in CANONICAL_DIMS],
    'dimension_coverage': {
        dk: {
            'n': sum(1 for r in records if r[dk] is not None),
            'pct': round(sum(1 for r in records if r[dk] is not None) / total, 3),
        }
        for dk in DIM_KEYS
    },
}
manifest_path = os.path.join(OUT_DIR, 'supporter_feature_manifest.json')
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
print(f'Saved: {manifest_path}')
