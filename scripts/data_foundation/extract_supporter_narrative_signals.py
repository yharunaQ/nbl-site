"""
Supporter narrative signal extraction from free-text responses.

Extracts 15 support-practice ICF signals (0/1/2) from supporter free text,
aligned with the supporter behavioral driver schema.

Datasets:
  - supporter_practice_nanbyo  (198 respondents with text)
  - supporter_practice_toku18  (485 respondents with text)
  Total: ~683 respondents  Estimated cost: ~$0.05 (gpt-4o-mini)

Output: data/analysis_ready/supporters/joint/v1_narrative/supporter_narrative_signals.jsonl

Usage:
  OPENAI_API_KEY=sk-... python3 extract_supporter_narrative_signals.py [--dry-run] [--limit N]
"""

import argparse
import json
import os
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import openai
except ImportError:
    sys.exit('openai package not found. pip install openai')

BASE = os.path.join(os.path.dirname(__file__), '../..')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/supporters/joint/v1_narrative')
os.makedirs(OUT_DIR, exist_ok=True)
OUTPUT_PATH = os.path.join(OUT_DIR, 'supporter_narrative_signals.jsonl')

MODEL    = os.environ.get('NARRATIVE_MODEL', 'gpt-4o-mini')
MIN_CHARS = 20
MAX_CHARS = 2000

SOURCES = [
    ('nanbyo',  os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_nanbyo/v0/free_text_units.jsonl')),
    ('toku18',  os.path.join(BASE, 'data/analysis_ready/supporters/supporter_practice_toku18/v0/free_text_units.jsonl')),
]

ARTIFACT_TEXT = {'*', '_x000D_', '-', '—', '―', '　', ''}

SIGNAL_DEFS = """
【支援アプローチ・実践】
1. whole_person_practice      全人的・強みベースの支援を意識・実践している（ICF的評価、個人の可能性の重視）
2. environment_design_active  環境改善・職場設計への積極的関与（職場への働きかけ、合理的配慮の具体的調整）
3. work_continuity_commitment 就職後継続・治療と仕事の両立への継続的関与（就職後フォロー、再発・悪化時の対応）
4. respondent_centered        当事者視点・当事者の意思決定の尊重を実践している

【連携・調整】
5. proactive_network_coordination  多機関連携を積極的に主導・調整（複数機関をつなぐ役割を果たしている）
6. medical_employment_gap     医療と就労の連携不足・役割分担の不明確さを課題として認識
7. coordination_role_clear    連携における自機関の役割が明確・機関間役割分担が整理されている

【知識・スキル・障壁】
8. knowledge_skill_gap        自身または機関の知識・スキル不足（難病・障害の実態、制度、支援方法の不足感）
9. disclosure_navigation_skill 開示判断・開示支援の具体的スキルを保有または重要性を認識
10. system_gap_aware          制度の谷間への意識と対応（手帳なし、障害者枠外、制度が届かない問題）
11. early_outreach_awareness  早期支援・早期介入の重要性認識（診断後早期、退職前の関与）

【組織・制度的障壁】
12. institutional_barrier     組織・制度的障壁の存在（業務外扱い、時間不足、評価されない、資金・制度上の制約）
13. regional_ecosystem_gap    地域の連携エコシステムの整備不足（地域差、ネットワーク未整備、担い手不足）

【支援者の動機・文脈】
14. economic_context_active   経済的困窮・生活状況への積極的な配慮と関与
15. motivation_and_meaning    就労支援へのやりがい・意義の強い感覚、または使命感の表明
""".strip()

SYSTEM_PROMPT = f"""あなたは障害者就労支援の専門家として、支援者（支援機関のスタッフ）の記述から、支援実践のパターンを分析します。

## 抽出するシグナル（15項目）

{SIGNAL_DEFS}

## 出力形式

以下のJSON形式のみを出力してください。他のテキストは一切出力しないでください。

{{
  "signals": {{
    "whole_person_practice": 0,
    "environment_design_active": 0,
    "work_continuity_commitment": 0,
    "respondent_centered": 0,
    "proactive_network_coordination": 0,
    "medical_employment_gap": 0,
    "coordination_role_clear": 0,
    "knowledge_skill_gap": 0,
    "disclosure_navigation_skill": 0,
    "system_gap_aware": 0,
    "early_outreach_awareness": 0,
    "institutional_barrier": 0,
    "regional_ecosystem_gap": 0,
    "economic_context_active": 0,
    "motivation_and_meaning": 0
  }},
  "key_phrases": ["フレーズ1", "フレーズ2"],
  "practice_summary": "この支援者の実践の特徴を20字以内で"
}}

## スコアの基準
- 0: 記述に言及なし
- 1: 言及あり（副次的・軽微）
- 2: 記述の中心的テーマ（強い・繰り返し言及）

## 重要な注意
- 記述されていないことには0を付けてください。推測で1/2にしないでください。
- key_phrasesは記述から実際に使われた言葉・フレーズを2〜3個抜き出してください。
- JSONのみを出力し、```json などの記号は使わないでください。"""


def load_supporter_narratives():
    """Load and consolidate free-text per supporter from both datasets."""
    supporters = {}  # sid → {dataset, entries: [(field, text)]}
    for dataset, path in SOURCES:
        with open(path, encoding='utf-8') as f:
            for line in f:
                d = json.loads(line)
                text = d.get('unit_text', '').strip()
                if not text or text in ARTIFACT_TEXT or len(text) < MIN_CHARS:
                    continue
                field = (d.get('display_name') or d.get('raw_name') or '').strip()
                sid = f"{dataset[:3]}_{d['respondent_id']}"
                if sid not in supporters:
                    supporters[sid] = {'dataset': dataset, 'entries': []}
                supporters[sid]['entries'].append((field, text))
    return supporters


def build_user_message(entries):
    lines = []
    for field, text in entries:
        short_field = field[:50] if len(field) > 50 else field
        lines.append(f"【{short_field}】\n{text}")
    full_text = '\n\n'.join(lines)
    if len(full_text) > MAX_CHARS:
        full_text = full_text[:MAX_CHARS] + '…（以下省略）'
    return full_text


def call_api(user_message: str, sid: str) -> dict | None:
    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user',   'content': user_message},
            ],
            temperature=0,
            max_tokens=400,
        )
        content = response['choices'][0]['message']['content'].strip()
        if content.startswith('```'):
            content = content.split('```')[1]
            if content.startswith('json'):
                content = content[4:]
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f'  [WARN] JSON parse error for {sid}: {e}')
        return None
    except Exception as e:
        print(f'  [ERROR] API error for {sid}: {e}')
        return None


def load_already_processed() -> set[str]:
    processed = set()
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, encoding='utf-8') as f:
            for line in f:
                try:
                    processed.add(json.loads(line)['supporter_id'])
                except Exception:
                    pass
    return processed


def process_one(sid: str, data: dict) -> dict:
    user_msg = build_user_message(data['entries'])
    text_len = sum(len(t) for _, t in data['entries'])
    result = call_api(user_msg, sid)
    record = {
        'supporter_id': sid,
        'dataset': data['dataset'],
        'text_length': text_len,
        'n_entries': len(data['entries']),
    }
    if result and 'signals' in result:
        record['signals'] = result['signals']
        record['key_phrases'] = result.get('key_phrases', [])
        record['practice_summary'] = result.get('practice_summary', '')
        record['extraction_ok'] = True
    else:
        record['signals'] = None
        record['key_phrases'] = []
        record['practice_summary'] = ''
        record['extraction_ok'] = False
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', choices=['nan', 'tok', 'all'], default='all')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--workers', type=int, default=8)
    args = parser.parse_args()

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not args.dry_run:
        sys.exit('OPENAI_API_KEY not set.')
    openai.api_key = api_key or 'dummy'

    print('Loading supporter narratives ...')
    all_supporters = load_supporter_narratives()

    if args.dataset == 'nan':
        all_supporters = {k: v for k, v in all_supporters.items() if v['dataset'] == 'nanbyo'}
    elif args.dataset == 'tok':
        all_supporters = {k: v for k, v in all_supporters.items() if v['dataset'] == 'toku18'}

    print(f'Supporters with text (>={MIN_CHARS} chars): {len(all_supporters)}')

    already = load_already_processed()
    to_process = {sid: d for sid, d in all_supporters.items() if sid not in already}
    print(f'Already processed: {len(already)}  Remaining: {len(to_process)}')

    if args.limit:
        to_process = dict(list(to_process.items())[:args.limit])

    avg_chars = sum(
        sum(len(t) for _, t in d['entries']) for d in to_process.values()
    ) / max(len(to_process), 1)
    cost_est = len(to_process) * (400 + avg_chars * 0.7) * 0.15 / 1_000_000
    print(f'Estimated cost ({MODEL}): ${cost_est:.3f}')

    if args.dry_run:
        print(f'[dry-run] Would process {len(to_process)} with {args.workers} workers.')
        sample_sid, sample_data = next(iter(to_process.items()))
        msg = build_user_message(sample_data['entries'])
        print(f'\nSample input for {sample_sid} ({len(msg)} chars):')
        print('---')
        print(msg[:500])
        print('---')
        return

    write_lock = threading.Lock()
    counter = {'done': 0, 'errors': 0}
    total = len(to_process)
    start = time.time()

    with open(OUTPUT_PATH, 'a', encoding='utf-8') as out_f:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            futures = {executor.submit(process_one, sid, data): sid
                       for sid, data in sorted(to_process.items())}
            for future in as_completed(futures):
                record = future.result()
                with write_lock:
                    out_f.write(json.dumps(record, ensure_ascii=False) + '\n')
                    out_f.flush()
                    counter['done'] += 1
                    if not record['extraction_ok']:
                        counter['errors'] += 1
                    done = counter['done']
                if done % 50 == 0 or done == total:
                    elapsed = time.time() - start
                    rate = done / elapsed
                    remaining = (total - done) / rate if rate > 0 else 0
                    print(f'  {done}/{total}  errors={counter["errors"]}  '
                          f'{rate:.1f}/sec  ETA {remaining/60:.1f}min')

    elapsed = time.time() - start
    print(f'\nDone: {counter["done"]} processed, {counter["errors"]} errors, {elapsed/60:.1f} min')
    print(f'Output: {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
