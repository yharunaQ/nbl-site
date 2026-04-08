"""
実践転換の羅針盤分析

「よく行われているが効果と相関しない実践」と
「あまり行われていないが高効果の実践」を抽出する。

分析軸：
  1. 問8変数ごとの全体実施率（高=普及している）
  2. 問8変数ごとの問7課題解決可能性との相関（有意=効果あり）
  3. Q1（真の専門性実践者）vs Q2（制度的障壁型）の実施率差
     - Q1で高くQ2で低い = Q1型の特徴的実践（目指すべき方向）
     - Q1でもQ2でも高い = 共通に多い（普及済みだが差別化しない）
     - Q1でもQ2でも低い = 共通に少ない
     - Q1で低くQ2で高い = Q2が多くやっているが転換に寄与しない実践

これにより4象限：
  [A] 普及していて効果あり     → 「維持・強化すべき実践」
  [B] 普及していて効果なし     → 「旧来型：転換が必要な実践」
  [C] 普及していないが効果あり  → 「導入が必要な実践」
  [D] 普及していないし効果なし  → 「優先度低い」

さらにQ1-Q2差で「転換の方向性」を示す。

Output: data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog/
  practice_transformation_compass.json
  practice_transformation_compass.md
"""

import csv
import json
import math
import os
import collections

BASE = os.path.join(os.path.dirname(__file__), '../..')
SF_CSV = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/structured_features.csv')
FEAT_CSV = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/toku18_effectiveness_features.csv')
CB_CSV = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/codebook.csv')
V2_DIR = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog')
OUT_DIR = V2_DIR
os.makedirs(OUT_DIR, exist_ok=True)

# ════════════════════════════════════════════════════════════════
# 全問8変数 (codebookから取得)
# ════════════════════════════════════════════════════════════════

print('Loading codebook ...')
all_q8_vars = {}  # raw_name → display_name
all_q7_vars = {}
with open(CB_CSV, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rn = row['raw_name']
        dn = row['display_name']
        if rn.startswith('問8') and not rn.endswith('記述'):
            all_q8_vars[rn] = dn
        if rn.startswith('問7') and not rn.endswith('記述'):
            all_q7_vars[rn] = dn

print(f'  問8 variables: {len(all_q8_vars)}')
print(f'  問7 variables: {len(all_q7_vars)}')

# ════════════════════════════════════════════════════════════════
# Q1/Q2象限ラベルを読み込み
# ════════════════════════════════════════════════════════════════

print('Loading quadrant assignments ...')
quadrant_map = {}  # respondent_id → quadrant
inst_map = {}
with open(FEAT_CSV, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = row['supporter_id'].replace('tok_', '')
        quadrant_map[sid] = row.get('quadrant', '')
        inst_map[sid] = row.get('inst_type', '')

q1_ids = {k for k, v in quadrant_map.items() if v == 'Q1_true_expert'}
q2_ids = {k for k, v in quadrant_map.items() if v == 'Q2_blocked'}
print(f'  Q1: {len(q1_ids)}, Q2: {len(q2_ids)}')

# ════════════════════════════════════════════════════════════════
# structured_features.csv をピボット
# ════════════════════════════════════════════════════════════════

print('Loading structured_features.csv ...')
wide = collections.defaultdict(dict)
with open(SF_CSV, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        wide[row['respondent_id']][row['raw_name']] = row['normalized_value']

respondents = list(wide.keys())
print(f'  Respondents: {len(respondents)}')

# ════════════════════════════════════════════════════════════════
# エンコード関数
# ════════════════════════════════════════════════════════════════

def parse_multi(val):
    if not val or val.strip() == '':
        return set()
    parts = set()
    for p in val.strip().split('+'):
        p = p.strip()
        if p:
            try:
                parts.add(int(float(p)))
            except ValueError:
                pass
    return parts

def q8_impl(val):
    """
    問8 実施あり (1=自前 or 2=連携) → 1
         なし/不明 (4,5) → 0
         他部署実施 (3) → None (除外)
    """
    codes = parse_multi(val)
    if 1 in codes or 2 in codes:
        return 1
    if 4 in codes or 5 in codes:
        return 0
    return None  # 3=他部署, or missing

def q8_coord_only(val):
    """外部連携型実施(2) → 1 / 自前(1) → 0 / その他 → None"""
    codes = parse_multi(val)
    if 2 in codes:
        return 1
    if 1 in codes:
        return 0
    return None

def q7_binary(val):
    """解決可能(2)→1, 解決困難(1)→0, 他→None"""
    codes = parse_multi(val)
    if 2 in codes:
        return 1
    if 1 in codes:
        return 0
    return None

def inst_code(val):
    try:
        return int(float(val))
    except:
        return None

# ════════════════════════════════════════════════════════════════
# 統計計算
# ════════════════════════════════════════════════════════════════

try:
    from scipy import stats as scipy_stats
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False

try:
    import statsmodels.api as sm
    import numpy as np
    HAS_STATSMODELS = True
except ImportError:
    HAS_STATSMODELS = False

def chi2_pvalue(a, b, c, d):
    n = a + b + c + d
    if n == 0:
        return 1.0, float('nan')
    exp_a = (a + b) * (a + c) / n
    exp_b = (a + b) * (b + d) / n
    exp_c = (c + d) * (a + c) / n
    exp_d = (c + d) * (b + d) / n
    chi2 = sum(
        (obs - exp) ** 2 / exp
        for obs, exp in [(a, exp_a), (b, exp_b), (c, exp_c), (d, exp_d)]
        if exp > 0
    )
    pval = float(scipy_stats.chi2.sf(chi2, 1)) if HAS_SCIPY else math.exp(-chi2 / 2)
    return chi2, pval

def odds_ratio(a, b, c, d):
    if b == 0 or c == 0:
        return float('nan'), float('nan'), float('nan')
    or_val = (a * d) / (b * c)
    se = math.sqrt(1/a + 1/b + 1/c + 1/d) if all(x > 0 for x in [a, b, c, d]) else float('nan')
    ci_lo = math.exp(math.log(or_val) - 1.96 * se) if not math.isnan(se) else float('nan')
    ci_hi = math.exp(math.log(or_val) + 1.96 * se) if not math.isnan(se) else float('nan')
    return or_val, ci_lo, ci_hi

# ════════════════════════════════════════════════════════════════
# 問8変数ごとの分析
# ════════════════════════════════════════════════════════════════

print('\nAnalyzing each 問8 variable ...')

q8_results = {}

for q8_var, q8_display in all_q8_vars.items():

    # --- 実施率（全体 / Q1 / Q2）---
    impl_all, impl_q1, impl_q2 = [], [], []

    for rid in respondents:
        v = wide[rid].get(q8_var, '')
        impl = q8_impl(v)
        if impl is None:
            continue
        impl_all.append(impl)
        if rid in q1_ids:
            impl_q1.append(impl)
        elif rid in q2_ids:
            impl_q2.append(impl)

    if len(impl_all) < 30:
        continue

    rate_all  = sum(impl_all) / len(impl_all)
    rate_q1   = sum(impl_q1) / len(impl_q1) if impl_q1 else float('nan')
    rate_q2   = sum(impl_q2) / len(impl_q2) if impl_q2 else float('nan')
    q1_q2_diff = (rate_q1 - rate_q2) if not math.isnan(rate_q1) and not math.isnan(rate_q2) else float('nan')

    # Q1 vs Q2の実施率差のchi-square
    if impl_q1 and impl_q2:
        a = sum(impl_q1); b = len(impl_q1) - a
        c = sum(impl_q2); d = len(impl_q2) - c
        _, p_q1q2 = chi2_pvalue(a, b, c, d)
    else:
        p_q1q2 = 1.0

    # --- 問7課題との相関（全問7変数にわたる有意正相関数）---
    n_sig_positive = 0
    n_sig_negative = 0
    best_positive_rd = 0.0
    best_positive_q7 = None
    best_negative_rd = 0.0
    best_negative_q7 = None

    for q7_var, q7_display in all_q7_vars.items():
        y_list, x_list = [], []
        for rid in respondents:
            y = q7_binary(wide[rid].get(q7_var, ''))
            x = q8_coord_only(wide[rid].get(q8_var, ''))
            if y is None or x is None:
                continue
            y_list.append(y)
            x_list.append(x)

        if len(y_list) < 30:
            continue

        a = sum(1 for y, x in zip(y_list, x_list) if y == 1 and x == 1)
        b = sum(1 for y, x in zip(y_list, x_list) if y == 0 and x == 1)
        c = sum(1 for y, x in zip(y_list, x_list) if y == 1 and x == 0)
        d = sum(1 for y, x in zip(y_list, x_list) if y == 0 and x == 0)

        if (a + b) == 0 or (c + d) == 0:
            continue

        rd = (a / (a + b)) - (c / (c + d))
        _, pval = chi2_pvalue(a, b, c, d)

        if pval < 0.05:
            if rd > 0:
                n_sig_positive += 1
                if rd > best_positive_rd:
                    best_positive_rd = rd
                    best_positive_q7 = q7_display
            else:
                n_sig_negative += 1
                if rd < best_negative_rd:
                    best_negative_rd = rd
                    best_negative_q7 = q7_display

    q8_results[q8_var] = {
        'display': q8_display,
        'n_impl': len(impl_all),
        'rate_all': round(rate_all, 4),
        'rate_q1': round(rate_q1, 4) if not math.isnan(rate_q1) else None,
        'rate_q2': round(rate_q2, 4) if not math.isnan(rate_q2) else None,
        'q1_q2_diff': round(q1_q2_diff, 4) if not math.isnan(q1_q2_diff) else None,
        'p_q1q2': round(p_q1q2, 6),
        'q1_q2_significant': p_q1q2 < 0.05,
        'n_sig_positive_q7': n_sig_positive,
        'n_sig_negative_q7': n_sig_negative,
        'best_positive_q7': best_positive_q7,
        'best_positive_rd': round(best_positive_rd, 4),
        'best_negative_q7': best_negative_q7,
        'best_negative_rd': round(best_negative_rd, 4),
        'effective': n_sig_positive >= 2,  # ≥2 課題で有意な正の相関
    }

print(f'  問8 variables analyzed: {len(q8_results)}')

# ════════════════════════════════════════════════════════════════
# 4象限への分類
# ════════════════════════════════════════════════════════════════

# 実施率の中央値で「普及」の閾値を設定
rates = [v['rate_all'] for v in q8_results.values()]
rates.sort()
median_rate = rates[len(rates) // 2]
print(f'  Median implementation rate: {median_rate:.3f}')

def classify(r):
    high_impl = r['rate_all'] >= median_rate
    effective = r['effective']
    if high_impl and effective:
        return 'A_maintain'
    elif high_impl and not effective:
        return 'B_transform'
    elif not high_impl and effective:
        return 'C_introduce'
    else:
        return 'D_low_priority'

for k, v in q8_results.items():
    v['quadrant'] = classify(v)

# Q1>Q2かつ有意 = Q1型特徴実践
for k, v in q8_results.items():
    diff = v['q1_q2_diff']
    if diff is not None and diff > 0.05 and v['q1_q2_significant']:
        v['q1_marker'] = True
    else:
        v['q1_marker'] = False

# ════════════════════════════════════════════════════════════════
# 象限ごとのランキング
# ════════════════════════════════════════════════════════════════

quadrants = {
    'A_maintain': {'label': '維持・強化すべき実践（普及していて効果あり）',
                   'note': '高実施率 × 問7解決可能性と正の相関。現在の支援者が行っており、かつ効果につながっている。'},
    'B_transform': {'label': '転換が必要な旧来型実践（普及しているが効果なし）',
                    'note': '高実施率 × 問7解決可能性との相関なし/弱い。よく行われているが、支援者自身が課題解決可能と認識する場合と相関しない。転換の優先候補。'},
    'C_introduce': {'label': '導入が必要な実践（普及していないが効果あり）',
                    'note': '低実施率 × 問7解決可能性と正の相関。効果が確認されているが普及していない。Q1実践者が特徴的に実施。'},
    'D_low_priority': {'label': '優先度低（普及していないし効果も不明）',
                       'note': '低実施率 × 相関なし。'},
}

result_by_quadrant = {}
for qid, qmeta in quadrants.items():
    items = [v for v in q8_results.values() if v['quadrant'] == qid]
    # A,C: 効果量降順; B: 実施率降順（よく行われているほど問題が大きい）
    if qid in ('A_maintain', 'C_introduce'):
        items.sort(key=lambda x: x['n_sig_positive_q7'], reverse=True)
    else:
        items.sort(key=lambda x: x['rate_all'], reverse=True)
    result_by_quadrant[qid] = {
        'label': qmeta['label'],
        'note': qmeta['note'],
        'count': len(items),
        'items': items,
    }

# ════════════════════════════════════════════════════════════════
# B象限の詳細分析: Q2が多くQ1が少ない = 「旧来型の中核」
# ════════════════════════════════════════════════════════════════

b_items = result_by_quadrant['B_transform']['items']
# Q2 > Q1 かつ有意なものを「旧来型の中核」とする
b_q2_dominant = [
    v for v in b_items
    if v['q1_q2_diff'] is not None and v['q1_q2_diff'] < -0.03 and v['q1_q2_significant']
]
b_q2_dominant.sort(key=lambda x: -(x['q1_q2_diff'] or 0))  # Q2優位が大きい順

# ════════════════════════════════════════════════════════════════
# C象限の詳細分析: Q1 > Q2 = 「転換の方向」
# ════════════════════════════════════════════════════════════════

c_items = result_by_quadrant['C_introduce']['items']
c_q1_dominant = [
    v for v in c_items
    if v['q1_marker']
]
c_q1_dominant.sort(key=lambda x: x['q1_q2_diff'] or 0, reverse=True)

# ════════════════════════════════════════════════════════════════
# A象限: 普及していて効果あり → さらにQ1が多ければ「転換後に定着する実践」
# ════════════════════════════════════════════════════════════════

a_items = result_by_quadrant['A_maintain']['items']
a_q1_dominant = [v for v in a_items if v['q1_marker']]

# ════════════════════════════════════════════════════════════════
# 出力: JSON
# ════════════════════════════════════════════════════════════════

output = {
    'version': 'v2_compass_2026-04-06',
    'analysis_date': '2026-04-06',
    'data_source': 'toku18 n=3,053 (NIVR No.134 相当 支援者調査)',
    'method': {
        'implementation_rate': '問8 実施あり(1=自前/2=連携) vs なし(4=外部機関/5=なし) 全体比率',
        'effectiveness': '問7 解決可能性(2=可能 vs 1=困難) × 問8 外部連携型実施(2) の chi-square p<0.05',
        'q1_q2_diff': 'Q1（真の専門性実践者 n≈634）vs Q2（制度的障壁型 n≈2196）の実施率差',
        'quadrant_threshold': f'実施率中央値 {median_rate:.3f} を「普及」の閾値とする',
        'effective_threshold': '≥2課題で問7との有意正の相関',
        'note': '実施率は「支援者が行っていると報告」の比率。実際の成果ではなく、支援者の課題解決可能性認識との相関で効果を評価。',
    },
    'summary': {
        'total_q8_analyzed': len(q8_results),
        'A_maintain': result_by_quadrant['A_maintain']['count'],
        'B_transform': result_by_quadrant['B_transform']['count'],
        'C_introduce': result_by_quadrant['C_introduce']['count'],
        'D_low_priority': result_by_quadrant['D_low_priority']['count'],
        'b_q2_dominant_count': len(b_q2_dominant),
        'c_q1_dominant_count': len(c_q1_dominant),
    },
    'compass': {
        'A_maintain': {
            **{k: v for k, v in result_by_quadrant['A_maintain'].items() if k != 'items'},
            'q1_dominant_items': a_q1_dominant[:8],
            'all_items': a_items,
        },
        'B_transform': {
            **{k: v for k, v in result_by_quadrant['B_transform'].items() if k != 'items'},
            'q2_dominant_core': b_q2_dominant,
            'all_items': b_items,
        },
        'C_introduce': {
            **{k: v for k, v in result_by_quadrant['C_introduce'].items() if k != 'items'},
            'q1_dominant_items': c_q1_dominant,
            'all_items': c_items,
        },
        'D_low_priority': {
            **{k: v for k, v in result_by_quadrant['D_low_priority'].items() if k != 'items'},
            'all_items': result_by_quadrant['D_low_priority']['items'][:10],
        },
    },
}

out_json = os.path.join(OUT_DIR, 'practice_transformation_compass.json')
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
print(f'\nWritten: {out_json}')

# ════════════════════════════════════════════════════════════════
# 出力: Markdown
# ════════════════════════════════════════════════════════════════

def fmt_item(v, show_q1q2=True):
    rd_str = f'実施率{v["rate_all"]:.0%}'
    if show_q1q2 and v['q1_q2_diff'] is not None:
        diff = v['q1_q2_diff']
        sig = '★' if v['q1_q2_significant'] else ''
        q1r = f'{v["rate_q1"]:.0%}' if v['rate_q1'] is not None else '?'
        q2r = f'{v["rate_q2"]:.0%}' if v['rate_q2'] is not None else '?'
        q_str = f'Q1={q1r}/Q2={q2r} (差{diff:+.0%}{sig})'
    else:
        q_str = ''
    eff_str = f'有意{v["n_sig_positive_q7"]}課題' if v['n_sig_positive_q7'] > 0 else '有意相関なし'
    neg_str = f' 負の相関{v["n_sig_negative_q7"]}課題' if v['n_sig_negative_q7'] > 0 else ''
    return f'  - **{v["display"]}** ({rd_str}, {eff_str}{neg_str}, {q_str})'

md_lines = [
    '# 実践転換の羅針盤（toku18分析 v2）',
    '',
    f'分析日: 2026-04-06  ',
    f'データ: toku18 n=3,053 (NIVR No.134 相当 支援者調査)  ',
    '実施率の中央値でA/B/C/Dを分類。効果=問7解決可能性との有意正相関(p<0.05)が2課題以上。',
    '',
    '> 重要注記: 「効果」は支援者の課題解決可能性認識との相関。実際の就労成果ではない。',
    '> ★ = Q1/Q2間の実施率差が統計的に有意',
    '',
    '---',
    '',
    '## [B] 転換が必要な旧来型実践（普及しているが効果と相関しない）',
    '',
    '高実施率であるにもかかわらず、問7課題の解決可能性認識との有意な正の相関が確認されない実践。',
    'これらが多くの機関で「支援の主力」になっているとすれば、支援転換の最優先対象。',
    '',
    f'該当数: {result_by_quadrant["B_transform"]["count"]}件（うちQ2優位な「旧来型中核」: {len(b_q2_dominant)}件）',
    '',
    '### B-1: Q2（制度的障壁型）がQ1より多く実施している——転換の核心',
    '（よく行われているが転換した支援者ほど実施率が低い）',
    '',
]
for v in b_q2_dominant[:10]:
    md_lines.append(fmt_item(v))
md_lines += ['', '### B-2: 高実施率だが効果相関なし（Q1/Q2差は軽微）', '']
b_other = [v for v in b_items if v not in b_q2_dominant]
for v in b_other[:8]:
    md_lines.append(fmt_item(v))

md_lines += [
    '',
    '---',
    '',
    '## [A] 維持・強化すべき実践（普及していて効果あり）',
    '',
    '高実施率かつ問7課題との有意正の相関あり。現在も多くの支援者が行っており、有効性が確認されている。',
    '',
    f'該当数: {result_by_quadrant["A_maintain"]["count"]}件（うちQ1優位: {len(a_q1_dominant)}件）',
    '',
    '### A-1: Q1が特に多く実施（転換後に強化される実践）',
    '',
]
for v in a_q1_dominant[:8]:
    md_lines.append(fmt_item(v))
md_lines += ['', '### A-2: 全体的に普及していて効果あり', '']
a_other = [v for v in a_items if v not in a_q1_dominant]
for v in a_other[:6]:
    md_lines.append(fmt_item(v))

md_lines += [
    '',
    '---',
    '',
    '## [C] 導入が必要な実践（普及していないが効果あり）',
    '',
    '低実施率だが問7課題との有意正の相関あり。特にQ1実践者が特徴的に実施。',
    '「知っているができていない」Q2支援者に最も必要な支援の方向性。',
    '',
    f'該当数: {result_by_quadrant["C_introduce"]["count"]}件（うちQ1優位: {len(c_q1_dominant)}件）',
    '',
    '### C-1: Q1が特に多く実施している（目指すべき実践の具体像）',
    '',
]
for v in c_q1_dominant[:8]:
    md_lines.append(fmt_item(v))
md_lines += ['', '### C-2: Q1/Q2差は軽微だが効果確認', '']
c_other = [v for v in c_items if v not in c_q1_dominant]
for v in c_other[:6]:
    md_lines.append(fmt_item(v))

md_lines += [
    '',
    '---',
    '',
    '## 転換の方向性サマリー',
    '',
    '```',
    '旧来型 [B] → 転換 → 目指すべき [A][C]',
    '',
    'B→A: 同じ目的でより効果的な方法への切り替え',
    'B→C: 今まで行っていなかった介入の導入',
    '```',
    '',
    '転換を阻む最大障壁は個人の能力ではなく組織・制度構造（Q1/Q2分析より）。',
    'B象限の実践が多い組織では、支援者の意欲ではなく管理設計の変更が必要。',
]

out_md = os.path.join(OUT_DIR, 'practice_transformation_compass.md')
with open(out_md, 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_lines) + '\n')
print(f'Written: {out_md}')

# サマリー出力
print('\n=== SUMMARY ===')
print(f'A (維持): {result_by_quadrant["A_maintain"]["count"]}件')
print(f'B (転換必要): {result_by_quadrant["B_transform"]["count"]}件 うちQ2優位中核: {len(b_q2_dominant)}件')
print(f'C (導入必要): {result_by_quadrant["C_introduce"]["count"]}件 うちQ1優位: {len(c_q1_dominant)}件')
print(f'D (低優先): {result_by_quadrant["D_low_priority"]["count"]}件')
print('\nB-1 旧来型中核（Q2優位）:')
for v in b_q2_dominant[:5]:
    print(f'  {v["display"]} 実施率{v["rate_all"]:.0%} Q1={v["rate_q1"]:.0%}/Q2={v["rate_q2"]:.0%}')
print('\nC-1 Q1優位の導入必要実践:')
for v in c_q1_dominant[:5]:
    print(f'  {v["display"]} 実施率{v["rate_all"]:.0%} Q1={v["rate_q1"]:.0%}/Q2={v["rate_q2"]:.0%}')
print('\nDone.')
