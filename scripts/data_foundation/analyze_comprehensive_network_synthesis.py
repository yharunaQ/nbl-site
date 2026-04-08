"""
総合分析：nanbyo支援者の補助線分析 + 問13連携体制分析 + 当事者×支援者ミスマッチ推計

① nanbyo支援者 4象限相当分析（toku18を補助線として）
② 問13 地域連携体制参加 × Q象限分析
③ 当事者クラスタ × 支援者Q象限 ミスマッチ構造推計

Output: data/analysis_ready/supporters/network_synthesis/
  nanbyo_quadrant_analysis.json
  toku18_q13_coordination_analysis.json
  respondent_supporter_mismatch.json
  network_synthesis_findings.md
"""

import csv, json, os, statistics, collections

BASE = os.path.join(os.path.dirname(__file__), '../..')
NAN_SF      = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_nanbyo/v0/structured_features.csv')
NAN_FEAT    = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_canonical_features.csv')
TOK_SF      = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/structured_features.csv')
TOK_QUAD    = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/toku18_effectiveness_features.csv')
NARRATIVE   = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_narrative_signals.jsonl')
SUP_CLUSTER = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_cluster_profiles.json')
RESP_PROF   = os.path.join(BASE, 'data/analysis_ready/joint_icf/v2_narrative/joint_narrative_profiles.json')
OUT_DIR     = os.path.join(BASE, 'data/analysis_ready/supporters/network_synthesis')
os.makedirs(OUT_DIR, exist_ok=True)

def safe_float(nv):
    try:
        v = [x.strip() for x in nv.split('+') if x.strip()]
        return float(v[0]) if len(v) == 1 else None
    except: return None

def has_code(nv, *codes):
    return any(c in [x.strip() for x in nv.split('+') if x.strip()] for c in codes)

def inorm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (hi - v) / (hi - lo)))

def norm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (v - lo) / (hi - lo)))

def dmean(lst):
    v = [x for x in lst if x is not None]
    return statistics.mean(v) if v else None


NARRATIVE_SIGNALS = [
    'whole_person_practice', 'environment_design_active', 'work_continuity_commitment',
    'respondent_centered', 'proactive_network_coordination', 'medical_employment_gap',
    'coordination_role_clear', 'knowledge_skill_gap', 'disclosure_navigation_skill',
    'system_gap_aware', 'early_outreach_awareness', 'institutional_barrier',
    'regional_ecosystem_gap', 'economic_context_active', 'motivation_and_meaning',
]
NARRATIVE_LABELS = {
    'whole_person_practice': '全人的支援実践',
    'environment_design_active': '環境改善・職場設計',
    'work_continuity_commitment': '就職後継続・治療両立',
    'respondent_centered': '当事者視点実践',
    'proactive_network_coordination': '多機関連携の積極調整',
    'medical_employment_gap': '医療・就労ギャップ認識',
    'coordination_role_clear': '連携役割の明確さ',
    'knowledge_skill_gap': '知識・スキル不足認識',
    'disclosure_navigation_skill': '開示支援スキル',
    'system_gap_aware': '制度の谷間への意識',
    'early_outreach_awareness': '早期支援重要性認識',
    'institutional_barrier': '組織・制度的障壁',
    'regional_ecosystem_gap': '地域連携エコシステム不足',
    'economic_context_active': '経済的文脈への配慮',
    'motivation_and_meaning': '就労支援のやりがい',
}


# ════════════════════════════════════════════════════════════════
# ① NANBYO 4象限相当分析
# ════════════════════════════════════════════════════════════════
print('=== ① nanbyo 4象限相当分析 ===')
print('補助線: D3(当事者理解)×D6(実施可能性) + D7(組織環境) + narrative')

# Load canonical features (already computed)
nan_features = {}
with open(NAN_FEAT, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if not row['supporter_id'].startswith('nan_'): continue
        sid = row['supporter_id']
        def fv(k): return float(row[k]) if row.get(k) and row[k] != 'None' else None
        nan_features[sid] = {
            'd1': fv('d1'), 'd2': fv('d2'), 'd3': fv('d3'), 'd4': fv('d4'),
            'd5': fv('d5'), 'd6': fv('d6'), 'd7': fv('d7'), 'd8': fv('d8'),
            'inst': {it: float(row.get(f'inst_{it}', 0) or 0)
                     for it in ['medical','welfare','labor','health','education','other']},
        }

print(f'  {len(nan_features)} nanbyo supporters with canonical features')

# Load per-item nanbyo data for additional variables
nan_items = {}
NAN_INST = {'1':'health','2':'welfare','3':'labor','4':'health','5':'health',
            '6':'medical','7':'welfare','8':'welfare','9':'other'}

with open(NAN_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"nan_{row['respondent_id']}"
        var = row['raw_name']
        nv = row['normalized_value'].strip()
        if sid not in nan_items: nan_items[sid] = {'q05': None, 'q10': [], 'q11': [], 'inst_type': 'unknown'}

        # Q05: org climate (1=業務として位置付け～5=位置付けなし → invert)
        if var == 'Q05':
            v = safe_float(nv)
            if v is not None: nan_items[sid]['q05'] = inorm(v, 1, 5)

        # Q10: 支援ニーズ対応可能性 (1-5: 1=非常に可能 → invert)
        if var.startswith('Q10_'):
            v = safe_float(nv)
            if v is not None: nan_items[sid]['q10'].append(inorm(v, 1, 5))

        # Q11: 専門知識・連携スキル有無 (1-5: 1=十分備わっている → invert)
        if var.startswith('Q11_'):
            v = safe_float(nv)
            if v is not None: nan_items[sid]['q11'].append(inorm(v, 1, 5))

        # Institution
        if var == 'Q01':
            for code in [x.strip() for x in nv.split('+') if x.strip()]:
                inst_type = NAN_INST.get(code)
                if inst_type: nan_items[sid]['inst_type'] = inst_type

# Merge canonical + per-item
nan_all = {}
for sid, feat in nan_features.items():
    item = nan_items.get(sid, {})
    d3 = feat['d3']  # respondent context beliefs → ideology proxy
    d1 = feat['d1']  # support orientation
    d6 = feat['d6']  # implementation feasibility
    d7 = feat['d7']  # org climate → barrier proxy
    d4 = feat['d4']  # knowledge
    d5 = feat['d5']  # network coordination

    # Ideology proxy: mean(D3, D1) – understanding of respondents + whole-person approach
    # (toku18の「役割分担と連携が重要」意識の代理)
    ideology_proxy = dmean([d3, d1])
    impl_proxy = d6  # implementation feasibility

    # 4象限（toku18と対応させるため閾値を合わせる）
    # toku18: ideology>=0.7 / impl>=0.35 が境界
    # nanbyo: D3+D1は0-1スケールで異なるため、中央値ベースで分割
    if ideology_proxy is not None and impl_proxy is not None:
        # nanbyo全体のD3中央値を閾値に使う（後で計算）
        nan_all[sid] = {
            'ideology_proxy': ideology_proxy,
            'impl_proxy': impl_proxy,
            'd3': d3, 'd1': d1, 'd6': d6, 'd7': d7, 'd4': d4, 'd5': d5,
            'q05': item.get('q05'),
            'q10_mean': dmean(item.get('q10', [])),
            'q11_mean': dmean(item.get('q11', [])),
            'inst_type': item.get('inst_type', 'unknown'),
        }

# Compute medians for thresholds
ideology_vals = [r['ideology_proxy'] for r in nan_all.values() if r['ideology_proxy'] is not None]
impl_vals = [r['impl_proxy'] for r in nan_all.values() if r['impl_proxy'] is not None]
ideology_median = statistics.median(ideology_vals)
impl_median = statistics.median(impl_vals)
print(f'  Thresholds: ideology_median={ideology_median:.3f}  impl_median={impl_median:.3f}')

# Assign quadrant
for sid, r in nan_all.items():
    ip = r['ideology_proxy']
    mp = r['impl_proxy']
    r['quadrant'] = (
        'Q1_capable'   if ip >= ideology_median and mp >= impl_median else
        'Q2_blocked'   if ip >= ideology_median and mp < impl_median  else
        'Q3_active'    if ip < ideology_median  and mp >= impl_median else
        'Q4_limited'
    )

nan_quad_counts = collections.Counter(r['quadrant'] for r in nan_all.values())
print(f'\n  nanbyo 4象限分布:')
QUAD_LABELS_NAN = {
    'Q1_capable': 'Q1 理解×実施能力あり',
    'Q2_blocked':  'Q2 理解あり・実施困難',
    'Q3_active':   'Q3 実施あり・理解浅め',
    'Q4_limited':  'Q4 理解・実施ともに限定的',
}
for q, label in QUAD_LABELS_NAN.items():
    n = nan_quad_counts[q]
    print(f'  {label}: n={n} ({n/len(nan_all):.1%})')

# Compare key dimensions by quadrant
print(f'\n  nanbyo Q象限別特徴（toku18 Q1={0.817:.3f}/Q2={0.710:.3f}参照）:')
nan_quad_stats = {}
for q in ['Q1_capable', 'Q2_blocked', 'Q4_limited']:
    recs = [r for r in nan_all.values() if r['quadrant'] == q]
    def qm(k): return round(dmean([r[k] for r in recs if r.get(k) is not None]) or 0, 3)
    s = {
        'n': len(recs), 'label': QUAD_LABELS_NAN[q],
        'd3_belief': qm('d3'), 'd1_orientation': qm('d1'),
        'd6_implementation': qm('d6'), 'd7_org_climate': qm('d7'),
        'd4_knowledge': qm('d4'), 'd5_network': qm('d5'),
        'q05_org_mandate': qm('q05'),
        'q10_feasibility': qm('q10_mean'),
        'q11_skill': qm('q11_mean'),
    }
    nan_quad_stats[q] = s
    print(f'\n  {QUAD_LABELS_NAN[q]} (n={len(recs)}):')
    print(f'    D3(当事者理解)={s["d3_belief"]}  D1(支援指向)={s["d1_orientation"]}')
    print(f'    D6(実施能力)={s["d6_implementation"]}  D7(組織環境)={s["d7_org_climate"]}')
    print(f'    D4(知識)={s["d4_knowledge"]}  D5(ネットワーク)={s["d5_network"]}')
    print(f'    Q05(機関内位置付け)={s["q05_org_mandate"]}  Q11(スキル)={s["q11_skill"]}')

# Q1 vs Q2 diff (nanbyo)
print(f'\n  nanbyo Q1-Q2差（toku18参照値を隣に表示）:')
q1_nan = nan_quad_stats.get('Q1_capable', {})
q2_nan = nan_quad_stats.get('Q2_blocked', {})
comparisons = [
    ('d7_org_climate', '組織環境スコア', +0.116),
    ('q05_org_mandate', '機関内位置付け', None),
    ('d4_knowledge', '知識水準', +0.137),
    ('d6_implementation', '実施能力', None),
    ('d5_network', 'ネットワーク', None),
]
for key, label, tok18_ref in comparisons:
    q1v = q1_nan.get(key, 0) or 0
    q2v = q2_nan.get(key, 0) or 0
    diff = q1v - q2v
    ref_str = f'  [toku18参照: {tok18_ref:+.3f}]' if tok18_ref is not None else ''
    print(f'  {label:20s}: Q1={q1v:.3f}  Q2={q2v:.3f}  diff={diff:+.3f}{ref_str}')

# Narrative signals by nanbyo quadrant
print('\n  nanbyo Q象限 × narrative signals:')
narrative_data = {}
with open(NARRATIVE, encoding='utf-8') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d['supporter_id'].startswith('nan_') and d.get('extraction_ok') and d.get('signals'):
                narrative_data[d['supporter_id']] = {
                    sig: d['signals'].get(sig, 0) / 2.0 for sig in NARRATIVE_SIGNALS
                }
        except: pass

nan_narr_stats = {}
key_signals = ['proactive_network_coordination','institutional_barrier','motivation_and_meaning',
               'medical_employment_gap','coordination_role_clear','knowledge_skill_gap']
for sig in key_signals:
    result = {}
    for q in ['Q1_capable', 'Q2_blocked', 'Q4_limited']:
        sids = [sid for sid, r in nan_all.items() if r['quadrant'] == q and sid in narrative_data]
        vals = [narrative_data[sid][sig] for sid in sids]
        result[q] = round(statistics.mean(vals), 4) if vals else None
        result[f'{q}_n'] = len(vals)
    nan_narr_stats[sig] = result
    q1v = result.get('Q1_capable', 0) or 0
    q2v = result.get('Q2_blocked', 0) or 0
    diff = q1v - q2v
    print(f'  {NARRATIVE_LABELS[sig][:22]:22s}: Q1={q1v:.3f}  Q2={q2v:.3f}  diff={diff:+.3f}')


# ════════════════════════════════════════════════════════════════
# ② 問13 地域連携体制参加 × Q象限分析
# ════════════════════════════════════════════════════════════════
print('\n=== ② 問13 地域連携体制参加 × Q象限分析 ===')
print('  コード: 1=自機関参加(最高) 2=あるが未参加 3=取組なし 4=不明')

# Load Q-quadrant assignments
tok_quads = {}
with open(TOK_QUAD, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tok_quads[row['supporter_id']] = row.get('quadrant', '')

# Load Q13 per-item data
Q13_ITEMS = {
    '問13①ハローワークを中心としたチーム支援':          'HW中心チーム支援',
    '問13②地域障害者職業センターの拡大ケース会議':       '職業センターケース会議',
    '問13③障害者就業・生活支援センターの取組み':         '就業生活支援センター',
    '問13④就労移行支援事業所の取組み':                  '就労移行支援',
    '問13⑤個別の教育支援計画':                         '個別教育支援計画',
    '問13⑥発達障害者センターの取組み':                  '発達障害センター',
    '問13⑦難病相談支援センターの取組み':                '難病相談支援センター',
    '問13⑧自立支援協議会・サービス協議会等':            '自立支援協議会',
}

q13_by_person = {}
with open(TOK_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"tok_{row['respondent_id']}"
        var = row['raw_name']
        nv = row['normalized_value'].strip()
        grp = row['question_group']
        if grp == '障害者の就労支援のための地域連携体制' and var in Q13_ITEMS and not var.endswith('記述'):
            if sid not in q13_by_person: q13_by_person[sid] = {}
            q13_by_person[sid][var] = {
                'participating': 1.0 if has_code(nv, '1') else 0.0,
                'aware_not_participating': 1.0 if has_code(nv, '2') else 0.0,
                'not_available': 1.0 if has_code(nv, '3') else 0.0,
            }

# Compute Q象限 × Q13 cross-tab
q13_results = {}
print(f'\n  {"連携体制":20s}  {"Q1参加率":8s}  {"Q2参加率":8s}  {"Q1-Q2差":8s}  {"Q1_aware":8s}  {"Q2_aware":8s}')
for q13var, label in Q13_ITEMS.items():
    for_quads = {q: {'part': [], 'aware': []} for q in ['Q1_true_expert','Q2_blocked','Q4_siloed']}
    for sid, items in q13_by_person.items():
        quad = tok_quads.get(sid, '')
        if quad not in for_quads: continue
        if q13var in items:
            for_quads[quad]['part'].append(items[q13var]['participating'])
            for_quads[quad]['aware'].append(items[q13var]['aware_not_participating'])

    q13_results[q13var] = {'label': label}
    for q in ['Q1_true_expert','Q2_blocked','Q4_siloed']:
        q13_results[q13var][q] = {
            'part_rate': round(dmean(for_quads[q]['part']) or 0, 3),
            'aware_rate': round(dmean(for_quads[q]['aware']) or 0, 3),
        }
    q1p = q13_results[q13var]['Q1_true_expert']['part_rate']
    q2p = q13_results[q13var]['Q2_blocked']['part_rate']
    q1a = q13_results[q13var]['Q1_true_expert']['aware_rate']
    q2a = q13_results[q13var]['Q2_blocked']['aware_rate']
    diff = q1p - q2p
    print(f'  {label:20s}  {q1p:.3f}    {q2p:.3f}    {diff:+.3f}    {q1a:.3f}    {q2a:.3f}')

# Rank by Q1-Q2 participation diff
ranked_q13 = sorted(q13_results.items(),
    key=lambda x: -(x[1]['Q1_true_expert']['part_rate'] - x[1]['Q2_blocked']['part_rate']))
print('\n  参加率 Q1-Q2差ランキング（大=Q1に特徴的な連携体制）:')
for i, (var, v) in enumerate(ranked_q13, 1):
    q1p = v['Q1_true_expert']['part_rate']
    q2p = v['Q2_blocked']['part_rate']
    diff = q1p - q2p
    print(f'  {i}. {v["label"]}: Q1={q1p:.3f} Q2={q2p:.3f} diff={diff:+.3f}')

# Also compute: total participation rate by Q (sum of Q13 participations)
print('\n  Q象限別 総連携体制参加数（Q13全8体制の合計）:')
for q in ['Q1_true_expert', 'Q2_blocked', 'Q4_siloed']:
    sids = [sid for sid, qv in tok_quads.items() if qv == q and sid in q13_by_person]
    total_parts = []
    for sid in sids:
        n_part = sum(q13_by_person[sid].get(var, {}).get('participating', 0)
                     for var in Q13_ITEMS)
        total_parts.append(n_part)
    mean_part = dmean(total_parts)
    print(f'  {q}: mean参加体制数={mean_part:.2f}')


# ════════════════════════════════════════════════════════════════
# ③ 当事者クラスタ × 支援者Q象限 ミスマッチ推計
# ════════════════════════════════════════════════════════════════
print('\n=== ③ 当事者×支援者 ミスマッチ推計（機関種別を橋渡し変数に使用）===')

# Load respondent cluster profiles
with open(RESP_PROF, encoding='utf-8') as f:
    resp_profiles = json.load(f)

# Load supporter cluster profiles
with open(SUP_CLUSTER, encoding='utf-8') as f:
    sup_profiles = json.load(f)

# Load toku18 quadrant × institution distribution
inst_quad_dist = {}  # inst_type → {Q1_pct, Q2_pct, Q4_pct, total_n}
tok_feat_rows = []
with open(TOK_QUAD, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tok_feat_rows.append({'inst_type': row['inst_type'], 'quadrant': row['quadrant']})

inst_quad_counts = collections.defaultdict(lambda: collections.Counter())
for row in tok_feat_rows:
    inst_quad_counts[row['inst_type']][row['quadrant']] += 1

print('\n  機関種別 × Q象限分布（toku18）:')
for inst, dist in sorted(inst_quad_counts.items()):
    total = sum(dist.values())
    q1_pct = dist.get('Q1_true_expert', 0) / total
    q2_pct = dist.get('Q2_blocked', 0) / total
    q4_pct = dist.get('Q4_siloed', 0) / total
    inst_quad_dist[inst] = {'q1_pct': round(q1_pct,3), 'q2_pct': round(q2_pct,3),
                             'q4_pct': round(q4_pct,3), 'total_n': total}
    print(f'  {inst:12s}: n={total:4d}  Q1={q1_pct:.1%}  Q2={q2_pct:.1%}  Q4={q4_pct:.1%}')

# Key respondent clusters with primary support need and likely institution
# From prior analysis synthesis:
RESPONDENT_CLUSTERS = {
    'C10': {'n': 518,  'label': '難病・重度身体負荷',   'primary_inst': ['labor', 'health', 'medical'],
            'key_needs': '体調管理・疾患自己管理'},
    'C12': {'n': 491,  'label': '難病・開示困難',       'primary_inst': ['labor', 'welfare'],
            'key_needs': '開示判断・制度的所属整理'},
    'C8':  {'n': 425,  'label': '難病・治療通院衝突',   'primary_inst': ['medical', 'labor'],
            'key_needs': '治療スケジュール・職場調整'},
    'C2':  {'n': 380,  'label': '難病・全方位困難',     'primary_inst': ['welfare', 'medical', 'labor'],
            'key_needs': '複合困難トリアージ・意欲回復'},
    'C6':  {'n': 361,  'label': '精神障害・就職困難',   'primary_inst': ['labor', 'welfare'],
            'key_needs': '就職活動設計・情報アクセス'},
    'C9':  {'n': 359,  'label': '聴覚障害・設計不足',   'primary_inst': ['education', 'labor'],
            'key_needs': 'コミュニケーション設計'},
    'C5':  {'n': 273,  'label': '難病・将来不安',       'primary_inst': ['health', 'medical', 'labor'],
            'key_needs': '不確実性への耐性設計'},
    'C14': {'n': 271,  'label': '高次脳機能障害',       'primary_inst': ['medical', 'welfare'],
            'key_needs': '認知困難・理解不足'},
    'C11': {'n': 172,  'label': '障害横断・指示困難',   'primary_inst': ['welfare', 'labor'],
            'key_needs': '職場設計・業務明確化'},
    'C1':  {'n': 1158, 'label': '複合高負荷',           'primary_inst': ['medical', 'welfare'],
            'key_needs': '複合支援ニーズ'},
    'C13': {'n': 1908, 'label': '軽度困難・情報不足',   'primary_inst': ['labor'],
            'key_needs': '就職情報・制度アクセス'},
}

print('\n  当事者クラスタ × 想定接触支援者の Q象限推計:')
print(f'  {"クラスタ":20s}  {"n":5s}  {"想定主機関":20s}  {"推定Q1%":8s}  {"推定Q2%":8s}  {"支援ギャップ"}')

mismatch_results = {}
for cid, info in sorted(RESPONDENT_CLUSTERS.items(), key=lambda x: -x[1]['n']):
    primary_insts = info['primary_inst']
    # Weighted average Q1/Q2 rates across primary institutions
    weights = [1.0] * len(primary_insts)
    q1_rates = [inst_quad_dist.get(inst, {}).get('q1_pct', 0.2) for inst in primary_insts]
    q2_rates = [inst_quad_dist.get(inst, {}).get('q2_pct', 0.7) for inst in primary_insts]
    est_q1 = sum(r * w for r, w in zip(q1_rates, weights)) / sum(weights)
    est_q2 = sum(r * w for r, w in zip(q2_rates, weights)) / sum(weights)
    # Gap score: higher Q2 rate × cluster size = more people hitting blocked supporters
    gap_score = est_q2 * info['n']
    inst_str = '+'.join(primary_insts[:3])
    print(f'  {info["label"]:20s}  {info["n"]:5d}  {inst_str:20s}  {est_q1:.1%}    {est_q2:.1%}    gap_score={int(gap_score)}')
    mismatch_results[cid] = {
        'label': info['label'], 'n': info['n'], 'key_needs': info['key_needs'],
        'primary_inst': primary_insts, 'est_q1_pct': round(est_q1, 3),
        'est_q2_pct': round(est_q2, 3), 'gap_score': int(gap_score),
    }

# Top gap clusters
print('\n  ギャップスコア上位（Q2接触推定者数多い当事者層）:')
for cid, info in sorted(mismatch_results.items(), key=lambda x: -x[1]['gap_score'])[:5]:
    print(f'  {info["label"]}: 推定Q2接触={int(info["n"]*info["est_q2_pct"])}名 '
          f'({info["est_q2_pct"]:.1%}) / key_needs: {info["key_needs"]}')


# ════════════════════════════════════════════════════════════════
# SAVE & SYNTHESIS
# ════════════════════════════════════════════════════════════════

# Save JSONs
with open(os.path.join(OUT_DIR, 'nanbyo_quadrant_analysis.json'), 'w', encoding='utf-8') as f:
    json.dump({'quad_counts': dict(nan_quad_counts), 'quad_stats': nan_quad_stats,
               'narrative_by_quad': nan_narr_stats}, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUT_DIR, 'toku18_q13_coordination_analysis.json'), 'w', encoding='utf-8') as f:
    json.dump({'ranked_by_q1_q2_diff': [{'var': v, **info} for v, info in ranked_q13],
               'inst_quad_dist': inst_quad_dist}, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUT_DIR, 'respondent_supporter_mismatch.json'), 'w', encoding='utf-8') as f:
    json.dump({'mismatch_by_cluster': mismatch_results,
               'top_gap': sorted(mismatch_results.items(), key=lambda x: -x[1]['gap_score'])[:5]},
              f, ensure_ascii=False, indent=2)

print(f'\nSaved JSONs to {OUT_DIR}')
print('Done.')
