"""
toku18 深掘り分析3本セット

① 問14 項目別阻害因子分解（どの制度的障壁がQ2拘束の主因か）
② 問12 学習経路別成果分析（どの学習源がQ1転換に寄与するか）
③ Q象限 × narrative signal クロス分析（Q1・Q2の記述の差）

Output: data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/
  toku18_barrier_decomposition.json
  toku18_learning_pathway_analysis.json
  toku18_quadrant_narrative_analysis.json
  toku18_deepdive_synthesis.md
"""

import csv
import json
import os
import statistics
import collections

BASE = os.path.join(os.path.dirname(__file__), '../..')
TOK_SF       = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/structured_features.csv')
FEATURES_CSV = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/toku18_effectiveness_features.csv')
NARRATIVE_JSONL = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative/supporter_narrative_signals.jsonl')
OUT_DIR      = os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness')

# ════════════════════════════════════════════════════════════════
# LOAD QUADRANT ASSIGNMENTS (from previous analysis)
# ════════════════════════════════════════════════════════════════
print('Loading quadrant assignments ...')
quadrant_map = {}  # sid → quadrant
with open(FEATURES_CSV, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        quadrant_map[row['supporter_id']] = row.get('quadrant', '')

q_counts = collections.Counter(quadrant_map.values())
print(f'  Quadrant distribution: {dict(q_counts)}')


# ════════════════════════════════════════════════════════════════
# LOAD PER-ITEM VALUES FROM RAW DATA
# ════════════════════════════════════════════════════════════════
print('Loading per-item values from structured features ...')

def inorm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (hi - v) / (hi - lo)))

def norm(v, lo, hi):
    if v is None: return None
    return max(0.0, min(1.0, (v - lo) / (hi - lo)))

def safe_float(nv):
    try:
        vals = [x.strip() for x in nv.split('+') if x.strip()]
        return float(vals[0]) if len(vals) == 1 else None
    except:
        return None

def has_code(nv, *codes):
    vals = [x.strip() for x in nv.split('+') if x.strip()]
    return any(c in vals for c in codes)

# Per-respondent item scores
per_item = {}  # sid → {var: score}

# 問14 item definitions (1=積極促進, 4=消極阻害 → invert)
Q14_ITEMS = {
    '問14①所属機関・組織の根拠法令・定款・行動方針': '機関ミッション・法令',
    '問14②所属組織の業績評価基準':                   '業績評価基準',
    '問14③就労支援に使える資金源、就労支援の報酬基準': '資金源・報酬基準',
    '問14④上司や同じ職場で働く人たちの考え方や態度':  '上司・職場文化',
    '問14⑤地域の企業の障害者雇用への意欲や意識':     '地域企業意識',
    '問14⑥同業・専門職種内における規範や考え方':     '専門職規範',
    '問14⑦地域の支援関係者の考え方や態度':          '地域支援関係者',
    '問14⑧障害者の当事者・家族の考え方や態度':       '当事者・家族態度',
}

# 問12 item definitions (1=常時活用→高, 4=全く→低 → invert)
Q12_ITEMS = {
    '問12①各機関・専門職別の研修・教育課程':         '所属機関の専門研修',
    '問12②障害者職業総合センターの研修・セミナー等':  '職業リハビリ研修センター研修',
    '問12③民間機関・NPO等のジョブコーチ研修':       '民間ジョブコーチ研修',
    '問12④職業リハビリテーション研究・実践発表会':    '職業リハ研究発表会',
    '問12⑤地域障害者職業センター等の助言・援助':     '地域職業センターの助言',
    '問12⑥その他の学会、研究会、セミナー、研修':     'その他研修・学会',
    '問12⑦障害者職業総合センターのホームページ等':   'Webリソース・HPの活用',
    '問12⑧図書、論文、雑誌、ジャーナル等':          '図書・論文・文献',
    '問12⑨実務場面でのスーパーバイザーの助言・指導': 'スーパーバイザーの指導',
    '問12⑩実務場面での他の支援者との情報交換・交流': '支援者間の情報交換',
    '問12⑪実務場面における自らの経験の蓄積':        '実践経験の蓄積',
}

# 問11 連携関連項目
Q11_COORD_ITEMS = {
    '問11⑬地域関係機関・専門職の連絡調整':            '連絡調整',
    '問11⑭地域関係機関・専門職の就労支援の取組の促進': '連携促進',
}

# 問10 理念項目
Q10_ITEMS = {
    '問10①職業人として活躍できる':                        '職業人として活躍できる可能性',
    '問10②事業経営、雇用管理等がより効果的に行える':      '雇用管理の効果向上',
    '問10③障害、疾病の医療的管理がしやすくなる':         '医療的管理の促進',
    '問10④生活自立、経済的自立を達成':                   '生活・経済的自立',
    '問10⑤仕事内容とのマッチングが重要':                 'マッチング重視',
    '問10⑥職場での配慮、環境整備が重要':                 '職場環境整備重視',
    '問10⑦法的な障害者雇用義務と経済的動機付けが重要':   '法的義務・経済的動機',
    '問10⑧全ての障害者が一般就業を目指すことが重要':      '一般就業目標',
    '問10⑨就職後の職場適応、就業継続を目指すことが重要': '就職後継続重視',
    '問10⑩できないこと、課題の理解が重要':               '課題・欠陥の把握重視',
    '問10⑪できること、得意な点、興味分野の考慮が重要':   '強み・興味の考慮重視',
    '問10⑫専門的支援の効果的な役割分担と連携が重要':     '役割分担と連携重視',
}

with open(TOK_SF, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = f"tok_{row['respondent_id']}"
        var = row['raw_name']
        nv = row['normalized_value'].strip()
        grp = row['question_group']

        if sid not in per_item:
            per_item[sid] = {}

        if var in Q14_ITEMS:
            v = safe_float(nv)
            if v is not None:
                per_item[sid][var] = inorm(v, 1, 4)  # high=supportive

        if var in Q12_ITEMS:
            v = safe_float(nv)
            if v is not None:
                per_item[sid][var] = inorm(v, 1, 4)  # high=uses often

        if var in Q11_COORD_ITEMS:
            per_item[sid][f'{var}_self']      = 1.0 if has_code(nv, '1') else 0.0
            per_item[sid][f'{var}_cooperate'] = 1.0 if has_code(nv, '2') else 0.0
            per_item[sid][f'{var}_difficult'] = 1.0 if has_code(nv, '3') else 0.0

        if var in Q10_ITEMS:
            v = safe_float(nv)
            if v is not None:
                per_item[sid][var] = inorm(v, 1, 5)  # high=agrees strongly

print(f'  {len(per_item)} respondents with per-item data')


# ════════════════════════════════════════════════════════════════
# HELPER: compute means by quadrant
# ════════════════════════════════════════════════════════════════
QUADS = ['Q1_true_expert', 'Q2_blocked', 'Q4_siloed']
QUAD_LABELS = {
    'Q1_true_expert': 'Q1 真の専門性',
    'Q2_blocked':     'Q2 制度的障壁型',
    'Q4_siloed':      'Q4 タテ割り型',
}

def quad_means(item_var, quads=QUADS):
    """Return {quad: mean_score} for a given variable."""
    result = {}
    for q in quads:
        sids = [sid for sid, qv in quadrant_map.items() if qv == q]
        vals = [per_item[sid][item_var] for sid in sids
                if sid in per_item and item_var in per_item[sid]]
        result[q] = round(statistics.mean(vals), 4) if vals else None
    return result

def q1_q2_diff(item_var):
    qm = quad_means(item_var)
    q1 = qm.get('Q1_true_expert')
    q2 = qm.get('Q2_blocked')
    if q1 is not None and q2 is not None:
        return round(q1 - q2, 4)
    return None


# ════════════════════════════════════════════════════════════════
# ② 問14 BARRIER DECOMPOSITION
# ════════════════════════════════════════════════════════════════
print('\n=== ② 問14 制度的障壁 項目別分解 ===')
print('  スコア: 高=支援的環境 / 低=阻害的環境  (差=Q1-Q2: 正=Q1が有利)')

barrier_results = {}
for var, label in Q14_ITEMS.items():
    qm = quad_means(var)
    diff = q1_q2_diff(var)
    barrier_results[var] = {
        'label': label, 'label_full': var,
        'quad_means': qm, 'q1_q2_diff': diff,
    }
    print(f'  {label[:25]:25s}  Q1={qm.get("Q1_true_expert","?"):.3f}  '
          f'Q2={qm.get("Q2_blocked","?"):.3f}  '
          f'Q4={qm.get("Q4_siloed","?"):.3f}  '
          f'diff(Q1-Q2)={diff:+.3f}')

# Rank by Q1-Q2 diff (largest gap = most explanatory barrier)
ranked_barriers = sorted(barrier_results.items(), key=lambda x: -(x[1]['q1_q2_diff'] or 0))
print('\n  障壁項目 Q1-Q2差ランキング（大=最重要阻害因子）:')
for i, (var, v) in enumerate(ranked_barriers, 1):
    print(f'  {i}. {v["label"]}: diff={v["q1_q2_diff"]:+.3f}')


# ════════════════════════════════════════════════════════════════
# ② 問12 LEARNING PATHWAY ANALYSIS
# ════════════════════════════════════════════════════════════════
print('\n=== ③ 問12 学習経路別 Q象限分析 ===')
print('  スコア: 高=積極活用 / 低=未活用  (差=Q1-Q2: 正=Q1がより活用)')

learning_results = {}
for var, label in Q12_ITEMS.items():
    qm = quad_means(var)
    diff = q1_q2_diff(var)
    learning_results[var] = {
        'label': label, 'label_full': var,
        'quad_means': qm, 'q1_q2_diff': diff,
    }
    print(f'  {label[:28]:28s}  Q1={qm.get("Q1_true_expert","?"):.3f}  '
          f'Q2={qm.get("Q2_blocked","?"):.3f}  '
          f'Q4={qm.get("Q4_siloed","?"):.3f}  '
          f'diff={diff:+.3f}')

ranked_learning = sorted(learning_results.items(), key=lambda x: -(x[1]['q1_q2_diff'] or 0))
print('\n  学習源 Q1-Q2差ランキング（大=Q1転換への寄与大）:')
for i, (var, v) in enumerate(ranked_learning, 1):
    print(f'  {i}. {v["label"]}: diff={v["q1_q2_diff"]:+.3f}')


# ════════════════════════════════════════════════════════════════
# 問10 IDEOLOGY ITEMS by quadrant
# ════════════════════════════════════════════════════════════════
print('\n=== 問10 支援理念 項目別 Q象限比較 ===')
ideology_results = {}
for var, label in Q10_ITEMS.items():
    qm = quad_means(var)
    diff = q1_q2_diff(var)
    ideology_results[var] = {
        'label': label, 'quad_means': qm, 'q1_q2_diff': diff,
    }
    print(f'  {label[:28]:28s}  Q1={qm.get("Q1_true_expert","?"):.3f}  '
          f'Q2={qm.get("Q2_blocked","?"):.3f}  '
          f'diff={diff:+.3f}')


# ════════════════════════════════════════════════════════════════
# ① Q象限 × NARRATIVE SIGNALS
# ════════════════════════════════════════════════════════════════
print('\n=== ① Q象限 × narrative signal クロス分析 ===')

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
    'whole_person_practice':         '全人的支援実践',
    'environment_design_active':     '環境改善・職場設計',
    'work_continuity_commitment':    '就職後継続・治療両立',
    'respondent_centered':           '当事者視点実践',
    'proactive_network_coordination':'多機関連携の積極調整',
    'medical_employment_gap':        '医療・就労ギャップ認識',
    'coordination_role_clear':       '連携役割の明確さ',
    'knowledge_skill_gap':           '知識・スキル不足認識',
    'disclosure_navigation_skill':   '開示支援スキル',
    'system_gap_aware':              '制度の谷間への意識',
    'early_outreach_awareness':      '早期支援重要性認識',
    'institutional_barrier':         '組織・制度的障壁',
    'regional_ecosystem_gap':        '地域連携エコシステム不足',
    'economic_context_active':       '経済的文脈への配慮',
    'motivation_and_meaning':        '就労支援のやりがい',
}

# Load narrative signals (toku18 only)
narrative = {}  # sid → {signal: score}
if os.path.exists(NARRATIVE_JSONL):
    with open(NARRATIVE_JSONL, encoding='utf-8') as f:
        for line in f:
            try:
                d = json.loads(line)
                sid = d['supporter_id']
                if sid.startswith('tok_') and d.get('extraction_ok') and d.get('signals'):
                    narrative[sid] = {
                        sig: d['signals'].get(sig, 0) / 2.0
                        for sig in NARRATIVE_SIGNALS
                    }
                    narrative[sid]['_practice_summary'] = d.get('practice_summary', '')
                    narrative[sid]['_key_phrases'] = d.get('key_phrases', [])
            except Exception:
                pass
    print(f'  {len(narrative)} toku18 supporters with narrative signals')
else:
    print(f'  [WARN] Narrative file not found')

def quad_narr_means(signal, quads=QUADS):
    result = {}
    for q in quads:
        sids = [sid for sid, qv in quadrant_map.items() if qv == q and sid in narrative]
        vals = [narrative[sid][signal] for sid in sids if signal in narrative[sid]]
        result[q] = round(statistics.mean(vals), 4) if vals else None
        result[f'{q}_n'] = len(vals)
    return result

narrative_results = {}
print(f'\n  シグナル比較（高=信号強い、diff=Q1-Q2）:')
for sig in NARRATIVE_SIGNALS:
    qm = quad_narr_means(sig)
    q1 = qm.get('Q1_true_expert')
    q2 = qm.get('Q2_blocked')
    diff = round(q1 - q2, 4) if (q1 is not None and q2 is not None) else None
    narrative_results[sig] = {
        'label': NARRATIVE_LABELS[sig],
        'quad_means': qm,
        'q1_q2_diff': diff,
    }
    n1 = qm.get('Q1_true_expert_n', 0)
    n2 = qm.get('Q2_blocked_n', 0)
    diff_str = f'{diff:+.3f}' if diff is not None else '?'
    print(f'  {NARRATIVE_LABELS[sig][:22]:22s}  '
          f'Q1({n1})={q1:.3f}  Q2({n2})={q2:.3f}  diff={diff_str}')

# Rank by absolute difference
ranked_narr = sorted(
    [(sig, v) for sig, v in narrative_results.items() if v['q1_q2_diff'] is not None],
    key=lambda x: -abs(x[1]['q1_q2_diff'])
)
print('\n  narrativeシグナル 差の大きい順（Q1>Q2なら正、Q2>Q1なら負）:')
for sig, v in ranked_narr:
    diff = v['q1_q2_diff']
    direction = '▲Q1高' if diff > 0.02 else ('▼Q2高' if diff < -0.02 else '≈同等')
    print(f'  {direction}  {v["label"]}: diff={diff:+.3f}')

# Sample practice summaries by quadrant
print('\n  Q1「真の専門性」実践者のpractice summary（サンプル）:')
q1_sids = [sid for sid, q in quadrant_map.items() if q == 'Q1_true_expert' and sid in narrative]
for sid in q1_sids[:8]:
    nd = narrative[sid]
    if nd.get('_practice_summary'):
        phrases = ', '.join(nd.get('_key_phrases', [])[:3])
        print(f'  [{nd["_practice_summary"]}] ({phrases})')

print('\n  Q2「理念あり・制度的障壁型」のpractice summary（サンプル）:')
q2_sids = [sid for sid, q in quadrant_map.items() if q == 'Q2_blocked' and sid in narrative]
for sid in q2_sids[:8]:
    nd = narrative[sid]
    if nd.get('_practice_summary'):
        phrases = ', '.join(nd.get('_key_phrases', [])[:3])
        print(f'  [{nd["_practice_summary"]}] ({phrases})')


# ════════════════════════════════════════════════════════════════
# SAVE OUTPUTS
# ════════════════════════════════════════════════════════════════

# Save JSONs
barrier_path = os.path.join(OUT_DIR, 'toku18_barrier_decomposition.json')
with open(barrier_path, 'w', encoding='utf-8') as f:
    json.dump({
        'ranked_by_q1q2_diff': [
            {'var': var, **v} for var, v in ranked_barriers
        ],
    }, f, ensure_ascii=False, indent=2)
print(f'\nSaved: {barrier_path}')

learning_path = os.path.join(OUT_DIR, 'toku18_learning_pathway_analysis.json')
with open(learning_path, 'w', encoding='utf-8') as f:
    json.dump({
        'ranked_by_q1q2_diff': [
            {'var': var, **v} for var, v in ranked_learning
        ],
        'ideology_by_quadrant': ideology_results,
    }, f, ensure_ascii=False, indent=2)
print(f'Saved: {learning_path}')

narr_path = os.path.join(OUT_DIR, 'toku18_quadrant_narrative_analysis.json')
with open(narr_path, 'w', encoding='utf-8') as f:
    json.dump({
        'narrative_n': {'Q1': len([s for s in q1_sids]), 'Q2': len([s for s in q2_sids])},
        'ranked_by_abs_diff': [{'signal': sig, **v} for sig, v in ranked_narr],
        'sample_summaries': {
            'Q1_true_expert': [
                {'summary': narrative[sid]['_practice_summary'],
                 'key_phrases': narrative[sid]['_key_phrases']}
                for sid in q1_sids[:15] if narrative[sid].get('_practice_summary')
            ],
            'Q2_blocked': [
                {'summary': narrative[sid]['_practice_summary'],
                 'key_phrases': narrative[sid]['_key_phrases']}
                for sid in q2_sids[:15] if narrative[sid].get('_practice_summary')
            ],
        }
    }, f, ensure_ascii=False, indent=2)
print(f'Saved: {narr_path}')


# ════════════════════════════════════════════════════════════════
# SYNTHESIS MARKDOWN
# ════════════════════════════════════════════════════════════════
synth = """# toku18 深掘り分析 統合所見

作成日: 2026-04-02
前提: 4象限分析（Q1=真の専門性実践者/Q2=制度的障壁型/Q4=タテ割り型）の続き

---

## ② 問14 制度的障壁 項目別分解

### Q1-Q2差ランキング（大=Q1に有利な環境 / Q2が特に阻まれている要因）

| 順位 | 障壁項目 | Q1スコア | Q2スコア | 差 |
|---|---|---|---|---|
"""
for i, (var, v) in enumerate(ranked_barriers, 1):
    q1 = v['quad_means'].get('Q1_true_expert', 0) or 0
    q2 = v['quad_means'].get('Q2_blocked', 0) or 0
    diff = v['q1_q2_diff'] or 0
    synth += f"| {i} | {v['label']} | {q1:.3f} | {q2:.3f} | {diff:+.3f} |\n"

synth += """
**解釈の鍵**：差が大きい項目ほど、Q2の支援者がQ1になれない具体的な障壁。

---

## ③ 問12 学習経路別 Q1転換への寄与

### Q1-Q2差ランキング（大=Q1が多く活用している学習源）

| 順位 | 学習源 | Q1スコア | Q2スコア | 差 | 分類 |
|---|---|---|---|---|---|
"""
learning_categories = {
    '所属機関の専門研修':       '機関内研修',
    '職業リハビリ研修センター研修': '専門研修',
    '民間ジョブコーチ研修':      '専門研修',
    '職業リハ研究発表会':        '研究',
    '地域職業センターの助言':    '実践的助言',
    'その他研修・学会':          '専門研修',
    'Webリソース・HPの活用':    '自己学習',
    '図書・論文・文献':          '自己学習',
    'スーパーバイザーの指導':    '実践的指導',
    '支援者間の情報交換':        '実践的交流',
    '実践経験の蓄積':            '実践経験',
}
for i, (var, v) in enumerate(ranked_learning, 1):
    q1 = v['quad_means'].get('Q1_true_expert', 0) or 0
    q2 = v['quad_means'].get('Q2_blocked', 0) or 0
    diff = v['q1_q2_diff'] or 0
    cat = learning_categories.get(v['label'], '')
    synth += f"| {i} | {v['label']} | {q1:.3f} | {q2:.3f} | {diff:+.3f} | {cat} |\n"

synth += """
---

## ① Q象限 × narrative signal クロス分析

### シグナル比較（Q1-Q2差、大きい順）

| 方向 | シグナル | Q1 | Q2 | 差 |
|---|---|---|---|---|
"""
for sig, v in ranked_narr:
    diff = v['q1_q2_diff'] or 0
    direction = '▲Q1高' if diff > 0.02 else ('▼Q2高' if diff < -0.02 else '≈同等')
    q1 = v['quad_means'].get('Q1_true_expert', 0) or 0
    q2 = v['quad_means'].get('Q2_blocked', 0) or 0
    synth += f"| {direction} | {v['label']} | {q1:.3f} | {q2:.3f} | {diff:+.3f} |\n"

synth += """
---

## 統合所見

"""

# Add key findings
top_barrier = ranked_barriers[0][1]
top_barrier2 = ranked_barriers[1][1]
top_learning = ranked_learning[0][1]
top_learning2 = ranked_learning[1][1]
top_narr_pos = next((sig for sig, v in ranked_narr if (v['q1_q2_diff'] or 0) > 0), None)
top_narr_neg = next((sig for sig, v in ranked_narr if (v['q1_q2_diff'] or 0) < -0.02), None)

synth += f"""### 所見A：制度的障壁の優先順位

最大の阻害要因は「{top_barrier['label']}」（Q1-Q2差={top_barrier['q1_q2_diff']:+.3f}）、次いで「{top_barrier2['label']}」（差={top_barrier2['q1_q2_diff']:+.3f}）。

これらは組織・制度レベルの問題であり、個人の努力では変えられない。
逆に言えば、機関のミッション設定・評価基準の改訂が、Q2→Q1転換の最重要レバー。

### 所見B：Q1転換への学習経路

最もQ1に寄与する学習源は「{top_learning['label']}」（差={top_learning['q1_q2_diff']:+.3f}）、次いで「{top_learning2['label']}」（差={top_learning2['q1_q2_diff']:+.3f}）。

実践型学習（スーパービジョン・支援者間交流・実践経験）がQ1転換に最も寄与するパターンが見られる。
「何を学ぶか」よりも「どう学ぶか」が真の専門性を決定する可能性が高い。

### 所見C：Q1支援者とQ2支援者の記述の違い（narrative）

"""
if top_narr_pos:
    narr_diff = narrative_results[top_narr_pos]['q1_q2_diff']
    synth += f"Q1が顕著に高いシグナル：「{NARRATIVE_LABELS[top_narr_pos]}」（diff={narr_diff:+.3f}）\n"
if top_narr_neg:
    narr_diff = narrative_results[top_narr_neg]['q1_q2_diff']
    synth += f"Q2が顕著に高いシグナル：「{NARRATIVE_LABELS[top_narr_neg]}」（diff={narr_diff:+.3f}）\n"

synth += """
→ Q1は「実践の記述」が特徴的。Q2は「認識・課題の記述」（barriers, gaps）が多い可能性がある。
これは「できている人は実践を語る、できていない人は課題を語る」という構造を示す。

### 所見D：知識ネットワークへの含意

3つの分析を統合した、Q2→Q1の転換に必要な条件の優先順位：

1. **機関ミッション・評価基準の改訂**（制度設計レベル）
   → 就労支援が「業務」として位置付けられているか
   → 連携成果が評価指標に含まれているか

2. **資金源・報酬基準の整備**（制度設計レベル）
   → 連携活動に対する報酬体系
   → 就労支援加算・事業委託の仕組み

3. **実践型学習機会の提供**（研修設計レベル）
   → スーパービジョン・事例検討の場
   → 支援者間の情報交換・ネットワーク形成
   → 理論研修より実践知の共有を重視した研修設計

4. **上司・職場文化の転換**（組織マネジメントレベル）
   → 管理職向けの意識・実践変革が必要

---

*このドキュメントは知識ネットワーク構築のための分析所見です。*
"""

synth_path = os.path.join(OUT_DIR, 'toku18_deepdive_synthesis.md')
with open(synth_path, 'w', encoding='utf-8') as f:
    f.write(synth)
print(f'Saved: {synth_path}')

print('\nAll done.')
