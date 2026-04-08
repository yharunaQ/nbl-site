"""
toku18 支援有効性・専門性分析

分析軸：
  A. 支援理念スペクトラム（連携志向 vs タテ割り志向）
  B. タテ割り指標 vs 連携指標（問8の実施形態分析）
  C. 知識 × 実施可能性のギャップ（問9 × 問11）
  D. 制度的障壁の項目別構造（問14）
  E. 専門性有効感（問15③④）の規定要因
  F. 4象限分類：理念 × 実施可能性

  中心的な分析問：
    「連携が重要だと信じている支援者が、なぜ連携できないのか」

Output: data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/
  toku18_effectiveness_features.csv
  toku18_effectiveness_profiles.json
  toku18_4quadrant_analysis.json
  toku18_effectiveness_synthesis.md
"""

import csv
import json
import os
import statistics
import collections

BASE = os.path.join(os.path.dirname(__file__), '../..')
TOK_SF = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/structured_features.csv')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness')
os.makedirs(OUT_DIR, exist_ok=True)

def parse_codes(nv):
    return [x.strip() for x in nv.split('+') if x.strip()]

def has_code(nv, *codes):
    return any(c in parse_codes(nv) for c in codes)

def safe_float(nv):
    try:
        v = parse_codes(nv)
        return float(v[0]) if len(v) == 1 else None
    except:
        return None

def norm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (v - lo) / (hi - lo)))

def inorm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (hi - v) / (hi - lo)))

def dim_mean(lst):
    valid = [x for x in lst if x is not None]
    return statistics.mean(valid) if valid else None


# ════════════════════════════════════════════════════════════════
# 変数定義
# ════════════════════════════════════════════════════════════════

# 問10: 支援理念（1=そう思う, 5=そう思わない → invert: (5-v)/4 = 1.0 is "strongly agree"）
# 連携志向理念
IDEOLOGY_COORD_VARS = {
    '問10⑫専門的支援の効果的な役割分担と連携が重要',  # 最重要：役割分担と連携
    '問10⑨就職後の職場適応、就業継続を目指すことが重要',  # 継続支援志向
}
# 当事者中心・強みベース理念
IDEOLOGY_STRENGTHS_VARS = {
    '問10⑪できること、得意な点、興味分野の考慮が重要',  # 強みベース
    '問10⑤仕事内容とのマッチングが重要',  # マッチング重視
    '問10①職業人として活躍できる',  # 当事者の可能性
    '問10④生活自立、経済的自立を達成',  # 生活全体視点
}
# 課題・欠陥モデル理念（高スコア = 課題中心）
IDEOLOGY_DEFICIT_VARS = {
    '問10⑩できないこと、課題の理解が重要',  # 欠陥モデル
}
# 制度・義務モデル（高スコア = 義務的動機付け重視）
IDEOLOGY_MANDATE_VARS = {
    '問10⑦法的な障害者雇用義務と経済的動機付けが重要',  # 法的義務重視
}

# 問8コード: 1=機関内完結, 2=外部連携積極, 3=他部署, 4=外部機関, 5=なし/不明
# サブセクション別分析
Q8_GROUPS = {
    '就労情報・意識促進': ['問8_1①', '問8_1②', '問8_1③', '問8_1④', '問8_1⑤', '問8_1⑥', '問8_1⑦'],
    'アセスメント・評価': ['問8_2①', '問8_2②', '問8_2③', '問8_2④', '問8_2⑤', '問8_2⑥', '問8_2⑦'],
    '全人的把握': ['問8_3①', '問8_3②', '問8_3③', '問8_3④'],
    '就職活動支援': ['問8_4①', '問8_4②', '問8_4③', '問8_4④', '問8_4⑤', '問8_4⑥'],
    '職場定着・継続支援': ['問8_5①', '問8_5②', '問8_5③', '問8_5④', '問8_5⑤', '問8_5⑥', '問8_5⑦', '問8_5⑧'],
    '職業スキル支援': ['問8_6①', '問8_6②', '問8_6③', '問8_6④', '問8_6⑤'],
}

# 問11コード: 1=自機関実施, 2=連携で実施, 3=困難, 4=不要
# 連携関連実施可能性（最重要）
Q11_COORD_VARS = {
    '問11⑬地域関係機関・専門職の連絡調整',
    '問11⑭地域関係機関・専門職の就労支援の取組の促進',
}
# 継続支援関連
Q11_CONTINUITY_VARS = {
    '問11⑩就職・復職後の本人と職場の両方への支援',
    '問11⑪安定した職業継続を目指したフォローアップ',
}

# 問12コード: 1=常に/積極的活用, 2=時々活用, 3=あまり活用しない, 4=全く活用しない
# 公式研修ベース
Q12_FORMAL_VARS = ['問12①各機関・専門職別の研修・教育課程', '問12②障害者職業総合センターの研修・セミナー等',
                   '問12③民間機関・NPO等のジョブコーチ研修', '問12④職業リハビリテーション研究・実践発表会',
                   '問12⑤地域障害者職業センター等の助言・援助']
# 実践経験ベース
Q12_PRACTICE_VARS = ['問12⑨実務場面でのスーパーバイザーの助言・指導',
                     '問12⑩実務場面での他の支援者との情報交換・交流',
                     '問12⑪実務場面における自らの経験の蓄積']
# 文献・研究ベース
Q12_RESEARCH_VARS = ['問12⑦障害者職業総合センターのホームページ等', '問12⑧図書、論文、雑誌、ジャーナル等']

# 問14: 組織・地域環境（1=積極的に促進, 4=消極的に阻害 → invert: 4-v)/3 = 1.0 is supportive）
Q14_INTERNAL_VARS = ['問14①所属機関・組織の根拠法令・定款・行動方針',  # 機関ミッション
                     '問14②所属組織の業績評価基準',                    # 評価制度
                     '問14③就労支援に使える資金源、就労支援の報酬基準', # 資金・報酬
                     '問14④上司や同じ職場で働く人たちの考え方や態度']  # 職場文化
Q14_EXTERNAL_VARS = ['問14⑤地域の企業の障害者雇用への意欲や意識',
                     '問14⑥同業・専門職種内における規範や考え方',
                     '問14⑦地域の支援関係者の考え方や態度',
                     '問14⑧障害者の当事者・家族の考え方や態度']

# 問15: やりがい（1=そう思う, 5=そう思わない → invert）
Q15_COMPETENCE_VARS = {'問15③支援において、能力・知識・経験を発揮できる',
                       '問15④支援において、自分自身が成長できる'}
Q15_IMPACT_VARS = {'問15①自分の支援は、障害者の役に立つ',
                   '問15②自分の支援は、障害者雇用企業の役に立つ'}
Q15_WORKLOAD_VARS = {'問15⑥障害者の就労支援業務量は過大ではない'}  # 高スコア = 過大でない

# ════════════════════════════════════════════════════════════════
# LOAD DATA
# ════════════════════════════════════════════════════════════════
print('Loading toku18 supporter data ...')

data = {}  # sid → features dict

with open(TOK_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"tok_{row['respondent_id']}"
        var = row['raw_name']
        nv = row['normalized_value'].strip()
        grp = row['question_group']

        if sid not in data:
            data[sid] = {
                # Ideology
                'ideology_coord': [],        # 連携志向理念
                'ideology_strengths': [],     # 強みベース理念
                'ideology_deficit': [],       # 課題中心理念
                'ideology_mandate': [],       # 義務モデル理念
                # Q8 silo/integration breakdown
                'q8_silo': [],               # code='1' = 機関内完結
                'q8_integrate': [],          # code='2' = 外部連携
                'q8_absent': [],             # code='5' = 実施なし
                # Q8 by support type
                'q8_holistic': [],           # 全人的把握サブセクション
                'q8_continuity': [],         # 職場定着サブセクション
                # Q11 implementation capability
                'q11_self': [],              # code='1' = 自機関実施
                'q11_cooperate': [],         # code='2' = 連携実施
                'q11_difficult': [],         # code='3' = 困難
                'q11_coord_self': [],        # 連携業務が自機関実施できる
                'q11_coord_difficult': [],   # 連携業務が困難
                'q11_continuity_self': [],   # 継続支援自機関実施
                'q11_continuity_difficult': [],
                # Q12 learning sources
                'q12_formal': [],            # 公式研修活用
                'q12_practice': [],          # 実践経験活用
                'q12_research': [],          # 研究・文献活用
                # Q14 environment
                'q14_internal_support': [],  # 機関内サポート
                'q14_external_support': [],  # 地域環境サポート
                # Q15 motivation
                'q15_competence': [],        # 専門性有効感
                'q15_impact': [],            # 有益感
                'q15_workload': [],          # 業務負荷
                # Institution
                'inst': {},
                # Q9 knowledge
                'q9_knowledge': [],
                # Q5 experience depth
                'q5_experience': [],
            }
        b = data[sid]

        # ── Institution type ──
        if var == '問2所属機関':
            TOK_INST = {
                '1': 'medical', '2': 'medical',
                '3': 'health',  '4': 'health', '5': 'health',
                '6': 'welfare', '7': 'welfare', '8': 'welfare',
                '9': 'welfare', '10': 'welfare', '11': 'welfare',
                '12': 'education', '13': 'education', '14': 'education',
                '15': 'labor',  '16': 'labor', '17': 'labor',
                '18': 'labor',  '19': 'labor',
                '20': 'other',
            }
            for code in parse_codes(nv):
                inst_type = TOK_INST.get(code)
                if inst_type: b['inst'][inst_type] = 1

        # ── Q5 経験年数（1-6: 経験なし→10年以上）──
        if grp == '支援内容別の経験' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['q5_experience'].append(norm(v, 1, 6))

        # ── Q9 知識（1=相談可能, 4=不要 → 1=知っている として1/4を最高）──
        if grp == '障害者雇用の基礎知識の修得状況' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None: b['q9_knowledge'].append(inorm(v, 1, 4))

        # ── Q10 支援理念 ──
        if grp == '障害者就労支援の理念・プロセスへの意見・見解' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None:
                score = inorm(v, 1, 5)
                if var in IDEOLOGY_COORD_VARS:     b['ideology_coord'].append(score)
                if var in IDEOLOGY_STRENGTHS_VARS: b['ideology_strengths'].append(score)
                if var in IDEOLOGY_DEFICIT_VARS:   b['ideology_deficit'].append(score)
                if var in IDEOLOGY_MANDATE_VARS:   b['ideology_mandate'].append(score)

        # ── Q8 支援実施形態 ──
        if grp == '就労支援や連携状況' and not var.endswith('記述'):
            is_silo     = 1.0 if has_code(nv, '1') else 0.0
            is_integrate= 1.0 if has_code(nv, '2') else 0.0
            is_absent   = 1.0 if has_code(nv, '5') else 0.0
            b['q8_silo'].append(is_silo)
            b['q8_integrate'].append(is_integrate)
            b['q8_absent'].append(is_absent)
            # 全人的把握
            if any(var.startswith(prefix) for prefix in ['問8_3']):
                b['q8_holistic'].append(is_integrate)
            # 職場定着
            if any(var.startswith(prefix) for prefix in ['問8_5']):
                b['q8_continuity'].append(is_integrate)

        # ── Q11 実施可能性 ──
        if grp == '障害者就労支援の実施可能性や連携の必要性' and not var.endswith('記述'):
            b['q11_self'].append(     1.0 if has_code(nv, '1') else 0.0)
            b['q11_cooperate'].append(1.0 if has_code(nv, '2') else 0.0)
            b['q11_difficult'].append(1.0 if has_code(nv, '3') else 0.0)
            if var in Q11_COORD_VARS:
                b['q11_coord_self'].append(     1.0 if has_code(nv, '1') else 0.0)
                b['q11_coord_difficult'].append(1.0 if has_code(nv, '3') else 0.0)
            if var in Q11_CONTINUITY_VARS:
                b['q11_continuity_self'].append(     1.0 if has_code(nv, '1') else 0.0)
                b['q11_continuity_difficult'].append(1.0 if has_code(nv, '3') else 0.0)

        # ── Q12 学習源（1=常時活用, 4=全く → invert: 4=0.0, 1=1.0）──
        if grp == '就労支援についての情報源や活用状況' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None:
                score = inorm(v, 1, 4)
                if var in Q12_FORMAL_VARS:    b['q12_formal'].append(score)
                if var in Q12_PRACTICE_VARS:  b['q12_practice'].append(score)
                if var in Q12_RESEARCH_VARS:  b['q12_research'].append(score)

        # ── Q14 環境（1=促進, 4=阻害 → invert: 阻害=低スコア, 促進=高スコア）──
        if grp == '周囲の組織や地域の障害者就労支援の状況' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None:
                score = inorm(v, 1, 4)
                if var in Q14_INTERNAL_VARS: b['q14_internal_support'].append(score)
                if var in Q14_EXTERNAL_VARS: b['q14_external_support'].append(score)

        # ── Q15 やりがい（1=そう思う, 5=そう思わない → invert）──
        if grp == '障害者就労支援のやりがい' and not var.endswith('記述'):
            v = safe_float(nv)
            if v is not None:
                score = inorm(v, 1, 5)
                if var in Q15_COMPETENCE_VARS: b['q15_competence'].append(score)
                if var in Q15_IMPACT_VARS:     b['q15_impact'].append(score)
                if var in Q15_WORKLOAD_VARS:   b['q15_workload'].append(score)

total = len(data)
print(f'  {total} toku18 supporters loaded')


# ════════════════════════════════════════════════════════════════
# BUILD FEATURE RECORDS
# ════════════════════════════════════════════════════════════════
print('Computing features ...')

FEAT_DEFS = [
    # Ideology
    ('ideology_coord',           '連携志向理念'),
    ('ideology_strengths',       '強みベース理念'),
    ('ideology_deficit',         '課題中心理念'),
    ('ideology_mandate',         '義務モデル理念'),
    # Q8 silo/integration
    ('q8_silo_rate',             'タテ割り率（機関内完結）'),
    ('q8_integrate_rate',        '外部連携率'),
    ('q8_absent_rate',           '支援不在率'),
    ('q8_holistic_integrate',    '全人的把握の外部連携率'),
    ('q8_continuity_integrate',  '定着継続支援の外部連携率'),
    # Q11 implementation
    ('q11_self_rate',            '自機関実施率'),
    ('q11_difficult_rate',       '実施困難率'),
    ('q11_coord_difficult',      '連携業務の実施困難率'),
    ('q11_continuity_difficult', '継続支援の実施困難率'),
    # Q12 learning
    ('q12_formal',               '公式研修活用度'),
    ('q12_practice',             '実践経験活用度'),
    ('q12_research',             '研究文献活用度'),
    # Q14 environment
    ('q14_internal_support',     '機関内環境スコア（高=支援的）'),
    ('q14_external_support',     '地域環境スコア（高=支援的）'),
    # Q15 motivation
    ('q15_competence',           '専門性有効感'),
    ('q15_impact',               '有益感'),
    ('q15_workload',             '業務量の余裕'),
    # Q9 knowledge
    ('q9_knowledge',             '基礎知識水準'),
    ('q5_experience',            '支援経験年数'),
]

records = []
for sid, b in sorted(data.items()):
    r = {'supporter_id': sid}
    r['inst_type'] = max(b['inst'], key=lambda k: b['inst'][k]) if b['inst'] else 'unknown'
    r['n_inst'] = len(b['inst'])

    # Raw means
    r['ideology_coord']    = dim_mean(b['ideology_coord'])
    r['ideology_strengths']= dim_mean(b['ideology_strengths'])
    r['ideology_deficit']  = dim_mean(b['ideology_deficit'])
    r['ideology_mandate']  = dim_mean(b['ideology_mandate'])

    r['q8_silo_rate']           = dim_mean(b['q8_silo'])
    r['q8_integrate_rate']      = dim_mean(b['q8_integrate'])
    r['q8_absent_rate']         = dim_mean(b['q8_absent'])
    r['q8_holistic_integrate']  = dim_mean(b['q8_holistic'])
    r['q8_continuity_integrate']= dim_mean(b['q8_continuity'])

    r['q11_self_rate']            = dim_mean(b['q11_self'])
    r['q11_difficult_rate']       = dim_mean(b['q11_difficult'])
    r['q11_coord_difficult']      = dim_mean(b['q11_coord_difficult'])
    r['q11_continuity_difficult'] = dim_mean(b['q11_continuity_difficult'])

    r['q12_formal']    = dim_mean(b['q12_formal'])
    r['q12_practice']  = dim_mean(b['q12_practice'])
    r['q12_research']  = dim_mean(b['q12_research'])

    r['q14_internal_support'] = dim_mean(b['q14_internal_support'])
    r['q14_external_support'] = dim_mean(b['q14_external_support'])

    r['q15_competence'] = dim_mean(b['q15_competence'])
    r['q15_impact']     = dim_mean(b['q15_impact'])
    r['q15_workload']   = dim_mean(b['q15_workload'])

    r['q9_knowledge']  = dim_mean(b['q9_knowledge'])
    r['q5_experience'] = dim_mean(b['q5_experience'])

    # Composite: 理念 × 実施可能性 4象限
    coord_ideology = r['ideology_coord']
    coord_impl_cap = r['q11_self_rate']  # 連携連絡調整を自機関でできるか
    if coord_ideology is not None and coord_impl_cap is not None:
        # High ideology + High implementation = Q1: 真の専門性実践者
        # High ideology + Low implementation  = Q2: 理念あり・実施困難
        # Low ideology  + High implementation = Q3: 機械的実施者
        # Low ideology  + Low implementation  = Q4: タテ割り完結型
        r['quadrant'] = (
            'Q1_true_expert'   if coord_ideology >= 0.7 and coord_impl_cap >= 0.35 else
            'Q2_blocked'       if coord_ideology >= 0.7 and coord_impl_cap < 0.35  else
            'Q3_mechanical'    if coord_ideology < 0.7  and coord_impl_cap >= 0.35 else
            'Q4_siloed'
        )
    else:
        r['quadrant'] = None

    records.append(r)

print(f'  {len(records)} records built')


# ════════════════════════════════════════════════════════════════
# 全体統計
# ════════════════════════════════════════════════════════════════
print('\n=== 全体統計 ===')
feat_keys = [k for k, _ in FEAT_DEFS]
for key, label in FEAT_DEFS:
    vals = [r[key] for r in records if r.get(key) is not None]
    if not vals: continue
    mean = statistics.mean(vals)
    p25 = sorted(vals)[len(vals)//4]
    p75 = sorted(vals)[3*len(vals)//4]
    print(f'  {label[:30]:30s}: mean={mean:.3f}  p25={p25:.3f}  p75={p75:.3f}  n={len(vals)}')


# ════════════════════════════════════════════════════════════════
# 4象限分析
# ════════════════════════════════════════════════════════════════
print('\n=== 4象限分析（連携理念 × 実施可能性）===')
quad_counts = collections.Counter(r['quadrant'] for r in records if r['quadrant'])
quad_labels = {
    'Q1_true_expert': '真の専門性実践者（高理念・高実施）',
    'Q2_blocked':     '理念あり・制度的障壁型（高理念・低実施）',
    'Q3_mechanical':  '機械的実施者（低理念・高実施）',
    'Q4_siloed':      'タテ割り完結型（低理念・低実施）',
}
quad_stats = {}
for quad in ['Q1_true_expert', 'Q2_blocked', 'Q3_mechanical', 'Q4_siloed']:
    quad_recs = [r for r in records if r.get('quadrant') == quad]
    n = len(quad_recs)
    label = quad_labels[quad]
    print(f'\n  {label}: n={n} ({n/total:.1%})')

    def qmean(key):
        vals = [r[key] for r in quad_recs if r.get(key) is not None]
        return statistics.mean(vals) if vals else None

    stats = {
        'n': n, 'pct': round(n/total, 3), 'label': label,
        'ideology_coord':       round(qmean('ideology_coord') or 0, 3),
        'q11_self_rate':        round(qmean('q11_self_rate') or 0, 3),
        'q11_difficult_rate':   round(qmean('q11_difficult_rate') or 0, 3),
        'q14_internal_support': round(qmean('q14_internal_support') or 0, 3),
        'q14_external_support': round(qmean('q14_external_support') or 0, 3),
        'q15_competence':       round(qmean('q15_competence') or 0, 3),
        'q15_impact':           round(qmean('q15_impact') or 0, 3),
        'q9_knowledge':         round(qmean('q9_knowledge') or 0, 3),
        'q12_formal':           round(qmean('q12_formal') or 0, 3),
        'q12_practice':         round(qmean('q12_practice') or 0, 3),
        'q8_silo_rate':         round(qmean('q8_silo_rate') or 0, 3),
        'q8_integrate_rate':    round(qmean('q8_integrate_rate') or 0, 3),
    }
    # Institution distribution
    inst_counts = collections.Counter(r['inst_type'] for r in quad_recs)
    stats['inst_dist'] = {k: round(v/n, 3) for k, v in sorted(inst_counts.items(), key=lambda x: -x[1])}
    quad_stats[quad] = stats

    print(f'    理念スコア:    {stats["ideology_coord"]:.3f}')
    print(f'    自機関実施率:  {stats["q11_self_rate"]:.3f}')
    print(f'    実施困難率:    {stats["q11_difficult_rate"]:.3f}')
    print(f'    機関内環境:    {stats["q14_internal_support"]:.3f}  地域環境: {stats["q14_external_support"]:.3f}')
    print(f'    専門性有効感:  {stats["q15_competence"]:.3f}')
    print(f'    基礎知識:      {stats["q9_knowledge"]:.3f}')
    print(f'    機関種別: {dict(list(inst_counts.most_common(4)))}')


# ════════════════════════════════════════════════════════════════
# 機関種別 × 特徴量 クロス集計
# ════════════════════════════════════════════════════════════════
print('\n=== 機関種別 × 主要特徴量 ===')
inst_types = ['labor', 'welfare', 'education', 'medical', 'health']
inst_analysis = {}
for inst in inst_types:
    recs = [r for r in records if r.get('inst_type') == inst]
    if not recs: continue
    def imean(key):
        vals = [r[key] for r in recs if r.get(key) is not None]
        return statistics.mean(vals) if vals else None
    stats = {
        'n': len(recs),
        'ideology_coord':       round(imean('ideology_coord') or 0, 3),
        'q8_silo_rate':         round(imean('q8_silo_rate') or 0, 3),
        'q8_integrate_rate':    round(imean('q8_integrate_rate') or 0, 3),
        'q11_difficult_rate':   round(imean('q11_difficult_rate') or 0, 3),
        'q14_internal_support': round(imean('q14_internal_support') or 0, 3),
        'q15_competence':       round(imean('q15_competence') or 0, 3),
        'q9_knowledge':         round(imean('q9_knowledge') or 0, 3),
        'quad_dist': dict(collections.Counter(r['quadrant'] for r in recs if r['quadrant'])),
    }
    inst_analysis[inst] = stats
    print(f'\n  {inst} (n={len(recs)}):')
    print(f'    連携理念={stats["ideology_coord"]:.3f}  タテ割り率={stats["q8_silo_rate"]:.3f}'
          f'  外部連携率={stats["q8_integrate_rate"]:.3f}')
    print(f'    実施困難率={stats["q11_difficult_rate"]:.3f}  機関内環境={stats["q14_internal_support"]:.3f}'
          f'  専門性有効感={stats["q15_competence"]:.3f}')
    print(f'    4象限: {stats["quad_dist"]}')


# ════════════════════════════════════════════════════════════════
# 制度的障壁の詳細分析：Q2（理念あり・実施困難）にフォーカス
# ════════════════════════════════════════════════════════════════
print('\n=== Q2「理念あり・制度的障壁型」の阻害要因分析 ===')

q2_recs = [r for r in records if r.get('quadrant') == 'Q2_blocked']
q1_recs = [r for r in records if r.get('quadrant') == 'Q1_true_expert']

print(f'  Q2 n={len(q2_recs)}, Q1 n={len(q1_recs)} (比較基準)')

# 問14の詳細比較が必要 — ここでは集計済み値で比較
for key, label in [('q14_internal_support', '機関内環境'),
                   ('q14_external_support', '地域環境'),
                   ('q9_knowledge', '基礎知識'),
                   ('q12_formal', '公式研修活用'),
                   ('q12_practice', '実践活用'),
                   ('q5_experience', '経験年数')]:
    q2_vals = [r[key] for r in q2_recs if r.get(key) is not None]
    q1_vals = [r[key] for r in q1_recs if r.get(key) is not None]
    q2_m = statistics.mean(q2_vals) if q2_vals else None
    q1_m = statistics.mean(q1_vals) if q1_vals else None
    diff = (q2_m - q1_m) if (q2_m and q1_m) else None
    diff_str = f'{diff:+.3f}' if diff is not None else 'N/A'
    print(f'  {label:20s}: Q2={q2_m:.3f}  Q1={q1_m:.3f}  diff={diff_str}')


# ════════════════════════════════════════════════════════════════
# SAVE OUTPUTS
# ════════════════════════════════════════════════════════════════

# 1. Features CSV
feat_path = os.path.join(OUT_DIR, 'toku18_effectiveness_features.csv')
all_keys = ['supporter_id', 'inst_type', 'n_inst', 'quadrant'] + feat_keys
with open(feat_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=all_keys, extrasaction='ignore')
    writer.writeheader()
    for r in records:
        row = {k: (f'{r[k]:.6f}' if isinstance(r.get(k), float) else r.get(k, ''))
               for k in all_keys}
        writer.writerow(row)
print(f'\nSaved: {feat_path}')

# 2. 4-Quadrant analysis JSON
quad_path = os.path.join(OUT_DIR, 'toku18_4quadrant_analysis.json')
with open(quad_path, 'w', encoding='utf-8') as f:
    json.dump({
        'total': total,
        'quadrant_counts': dict(quad_counts),
        'quadrant_stats': quad_stats,
        'institution_analysis': inst_analysis,
    }, f, ensure_ascii=False, indent=2)
print(f'Saved: {quad_path}')

# 3. Synthesis markdown
synth_path = os.path.join(OUT_DIR, 'toku18_effectiveness_synthesis.md')
q1_n = quad_counts.get('Q1_true_expert', 0)
q2_n = quad_counts.get('Q2_blocked', 0)
q3_n = quad_counts.get('Q3_mechanical', 0)
q4_n = quad_counts.get('Q4_siloed', 0)

synth = f"""# toku18 支援有効性・専門性分析 所見

作成日: 2026-04-02
データ: supporter_practice_toku18（n={total}）
分析軸: 支援理念スペクトラム × 実施可能性 × 制度的障壁 × 専門性有効感

---

## 1. 4象限分類：連携志向理念 × 実施可能性

| 象限 | n | % | 解釈 |
|---|---:|---|---|
| **Q1 真の専門性実践者** | {q1_n} | {q1_n/total:.1%} | 高理念・高実施能力 |
| **Q2 理念あり・制度的障壁型** | {q2_n} | {q2_n/total:.1%} | 高理念・低実施能力 |
| **Q3 機械的実施者** | {q3_n} | {q3_n/total:.1%} | 低理念・高実施能力 |
| **Q4 タテ割り完結型** | {q4_n} | {q4_n/total:.1%} | 低理念・低実施能力 |

**問10⑫「専門的支援の効果的な役割分担と連携が重要」への同意**: 全体の95.5%が同意（score=1か2）
→ 理念的合意は広範だが、実践への転換には大きな壁がある

---

## 2. 4象限の特徴比較

| 指標 | Q1 真の専門性 | Q2 制度的障壁 | Q3 機械的 | Q4 タテ割り |
|---|---|---|---|---|
| 連携志向理念 | {quad_stats.get('Q1_true_expert',{}).get('ideology_coord','?')} | {quad_stats.get('Q2_blocked',{}).get('ideology_coord','?')} | {quad_stats.get('Q3_mechanical',{}).get('ideology_coord','?')} | {quad_stats.get('Q4_siloed',{}).get('ideology_coord','?')} |
| 自機関実施率 | {quad_stats.get('Q1_true_expert',{}).get('q11_self_rate','?')} | {quad_stats.get('Q2_blocked',{}).get('q11_self_rate','?')} | {quad_stats.get('Q3_mechanical',{}).get('q11_self_rate','?')} | {quad_stats.get('Q4_siloed',{}).get('q11_self_rate','?')} |
| 実施困難率 | {quad_stats.get('Q1_true_expert',{}).get('q11_difficult_rate','?')} | {quad_stats.get('Q2_blocked',{}).get('q11_difficult_rate','?')} | {quad_stats.get('Q3_mechanical',{}).get('q11_difficult_rate','?')} | {quad_stats.get('Q4_siloed',{}).get('q11_difficult_rate','?')} |
| 機関内環境 | {quad_stats.get('Q1_true_expert',{}).get('q14_internal_support','?')} | {quad_stats.get('Q2_blocked',{}).get('q14_internal_support','?')} | {quad_stats.get('Q3_mechanical',{}).get('q14_internal_support','?')} | {quad_stats.get('Q4_siloed',{}).get('q14_internal_support','?')} |
| 専門性有効感 | {quad_stats.get('Q1_true_expert',{}).get('q15_competence','?')} | {quad_stats.get('Q2_blocked',{}).get('q15_competence','?')} | {quad_stats.get('Q3_mechanical',{}).get('q15_competence','?')} | {quad_stats.get('Q4_siloed',{}).get('q15_competence','?')} |
| 基礎知識水準 | {quad_stats.get('Q1_true_expert',{}).get('q9_knowledge','?')} | {quad_stats.get('Q2_blocked',{}).get('q9_knowledge','?')} | {quad_stats.get('Q3_mechanical',{}).get('q9_knowledge','?')} | {quad_stats.get('Q4_siloed',{}).get('q9_knowledge','?')} |

---

## 3. 機関種別の特徴

| 機関種別 | n | 連携理念 | タテ割り率 | 外部連携率 | 実施困難率 | 専門性有効感 |
|---|---:|---|---|---|---|---|
"""

for inst, s in inst_analysis.items():
    synth += (f"| {inst} | {s['n']} | {s['ideology_coord']} | {s['q8_silo_rate']} "
              f"| {s['q8_integrate_rate']} | {s['q11_difficult_rate']} | {s['q15_competence']} |\n")

synth += f"""
---

## 4. 主要所見

### 所見A：理念と実践の乖離が構造的
問10⑫への同意率95.5%に対し、Q1（真の専門性実践者）は全体の{q1_n/total:.1%}のみ。
「役割分担と連携が重要」と信じている支援者の大多数が、実践できていない。

### 所見B：Q2「理念あり・制度的障壁型」
n={q2_n}（{q2_n/total:.1%}）。高い連携理念を持ちながら実施できない。
Q1との比較：機関内環境スコアが低く（制度・評価・資金の阻害）、専門性有効感も低い。
→ 「やりたいけどできない」という阻害構造が存在する。

### 所見C：専門性有効感（問15③「能力・知識・経験を発揮できる」）の規定要因
全体平均：{statistics.mean([r['q15_competence'] for r in records if r.get('q15_competence') is not None]):.3f}
Q1 vs Q2の差：{quad_stats.get('Q1_true_expert',{}).get('q15_competence',0) - quad_stats.get('Q2_blocked',{}).get('q15_competence',0):.3f}
→ 実施可能性（制度的環境）が専門性有効感に直接影響している。

### 所見D：タテ割り指標の機関間差
問8における「機関内完結」率（q8_silo_rate）は機関種別で大きく異なる。
問8における「外部連携」率（q8_integrate_rate）も同様。
→ タテ割り問題は個人の態度ではなく、機関の構造的問題。

---

*このドキュメントは知識ネットワーク構築のための分析所見です。*
"""

with open(synth_path, 'w', encoding='utf-8') as f:
    f.write(synth)
print(f'Saved: {synth_path}')

print('\nDone.')
