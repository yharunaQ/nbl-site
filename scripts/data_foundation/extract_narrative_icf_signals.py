"""
Narrative ICF signal extraction from free-text responses.

Design principles:
- Per-respondent: all free-text fields concatenated, sent in ONE API call
- Extracts 17 ICF-aligned binary signals (0/1/2) matching the 26-frame taxonomy
- Also extracts key phrases (qualitative) and primary challenge summary
- Output: JSONL — one record per respondent, resumable

Cost estimate (gpt-4o-mini):
  ~4,106 respondents × ~850 tokens avg = ~3.5M tokens → ~$0.87 total

Usage:
  OPENAI_API_KEY=sk-... python3 extract_narrative_icf_signals.py [--dataset emp|nan|all] [--dry-run]
"""

import argparse
import json
import os
import sys
import time
from collections import defaultdict

try:
    import openai
except ImportError:
    sys.exit('openai package not found. pip install openai')

BASE = os.path.join(os.path.dirname(__file__), '../..')
OUT_DIR = os.path.join(BASE, 'data/analysis_ready/joint_icf/v1_canonical')
os.makedirs(OUT_DIR, exist_ok=True)
OUTPUT_PATH = os.path.join(OUT_DIR, 'narrative_icf_signals.jsonl')

MODEL = os.environ.get('NARRATIVE_MODEL', 'gpt-4o-mini')
MIN_CHARS = 50       # skip respondents with less total text
MAX_CHARS = 1500     # truncate very long texts to control cost
DELAY_SEC = 0.3      # between API calls (rate limit safety)

# ── Columns to include ────────────────────────────────────────────
# Exclude: job title, other misc fields, artifact entries
EXCLUDE_FIELDS = {
    '仕事内容', 'その他の仕事',
    '問１．本調査について知った経路：「その他」の具体的な内容を教えてください。',
    '問21.資格や免許等：「その他」の具体的な内容を教えてください。',
    '問20.最終学齢：「その他」の具体的な内容を教えてください。',
}
ARTIFACT_TEXT = {'*', '_x000D_', '-', '—', '―', '　', ''}

# ── ICF signal definitions (aligned with 26-frame taxonomy) ──────
SIGNAL_DEFS = """
【体調・機能障害系】
1. fatigue_variability       疲労・体調変動（日内/週/月単位の体調の波、疲れやすさ）
2. treatment_work_conflict   治療と仕事の衝突（通院、服薬、医師指示と就労の両立困難）
3. disease_progression_anxiety  病状進行への不安（悪化・再発・将来への不安）
4. sensory_physical_burden   感覚・身体負荷（痛み、感覚過敏、移動困難、身体機能制限）
5. health_management_at_work 職場内疾患管理困難（職場での服薬・休憩・食事・症状管理の困難）

【就職・参加系】
6. job_search_difficulty     就職活動困難（求人探し、応募、面接、採用されないこと）
7. disclosure_difficulty     開示・説明困難（職場・企業への病気・障害の説明、理解されないこと）
8. support_access_difficulty 支援への接続困難（支援機関が使えない・知らない・断られる）
9. motivation_loss           就労意欲の低下・喪失（働く気持ちが持てない、孤立感、疎外感）
10. economic_pressure        経済的困窮・不安（収入不安、生活費、制度の谷間）

【職場運用系】
11. cognitive_load           認知負荷（記憶、集中、問題解決、複数処理、判断困難）
12. communication_difficulty コミュニケーション困難（聞き取り、伝達、会話、書き言葉）
13. interpersonal_stress     対人・人間関係ストレス（上司・同僚との関係、職場の雰囲気）
14. instruction_ambiguity    指示・業務の曖昧さ（何をすればよいか不明確、段取りが分からない）
15. schedule_attendance_risk 出勤・スケジュール維持の困難（欠勤、遅刻、勤務時間の維持）

【環境・構造系】
16. understanding_lack       周囲の理解・配慮の不足（職場・支援者・医療者・社会への不満）
17. accommodation_gap        配慮・制度の不整合（必要な配慮が得られない、制度の谷間）
""".strip()

SYSTEM_PROMPT = f"""あなたは就労支援の専門家として、障害・難病のある人の就労上の困難を整理します。
ICF（国際生活機能分類）の枠組みを参考に、回答者が記述した内容から就労上の困難のシグナルを抽出してください。

## 抽出するシグナル（17項目）

{SIGNAL_DEFS}

## 出力形式

以下のJSON形式で出力してください。他のテキストは一切出力しないでください。

{{
  "signals": {{
    "fatigue_variability": 0,
    "treatment_work_conflict": 0,
    "disease_progression_anxiety": 0,
    "sensory_physical_burden": 0,
    "health_management_at_work": 0,
    "job_search_difficulty": 0,
    "disclosure_difficulty": 0,
    "support_access_difficulty": 0,
    "motivation_loss": 0,
    "economic_pressure": 0,
    "cognitive_load": 0,
    "communication_difficulty": 0,
    "interpersonal_stress": 0,
    "instruction_ambiguity": 0,
    "schedule_attendance_risk": 0,
    "understanding_lack": 0,
    "accommodation_gap": 0
  }},
  "key_phrases": ["フレーズ1", "フレーズ2"],
  "primary_challenge": "最も中心的な課題を20字以内で"
}}

## スコアの基準
- 0: 記述に言及なし
- 1: 言及あり（副次的・軽微）
- 2: 記述の中心的テーマ（強い・繰り返し言及）

## 重要な注意
- 記述されていないことには0を付けてください。推測で1/2にしないでください。
- key_phrasesは記述から実際に使われた言葉・フレーズを2〜3個抜き出してください。
- primary_challengeは記述の中で最も訴えが強い課題を端的に表してください。
- JSONのみを出力し、```json などの記号は使わないでください。"""


def load_narratives():
    """Load and consolidate free-text per respondent from both datasets."""
    respondents = {}  # rid → {dataset, entries: [(field, text)]}

    for dataset, path in [
        ('employment', os.path.join(BASE, 'data/analysis_ready/respondents/employment_survey_3000/v0/free_text_units.jsonl')),
        ('nanbyo',     os.path.join(BASE, 'data/analysis_ready/respondents/nanbyo_survey_4000/v0/free_text_units.jsonl')),
    ]:
        with open(path) as f:
            for line in f:
                d = json.loads(line)
                text = d.get('unit_text', '').strip()
                if not text or text in ARTIFACT_TEXT:
                    continue
                field = (d.get('display_name') or d.get('raw_name') or '').strip()
                if field in EXCLUDE_FIELDS:
                    continue

                rid = f"{dataset[:3]}_{d['respondent_id']}"
                if rid not in respondents:
                    respondents[rid] = {'dataset': dataset, 'entries': []}
                respondents[rid]['entries'].append((field, text))

    return respondents


def build_user_message(entries: list[tuple[str, str]], dataset: str) -> str:
    """Build the user message from all free-text entries for one respondent."""
    lines = []
    seen_fields = {}
    for field, text in entries:
        # Shorten very long field names
        short_field = field[:40] if len(field) > 40 else field
        lines.append(f"【{short_field}】\n{text}")

    full_text = '\n\n'.join(lines)
    if len(full_text) > MAX_CHARS:
        full_text = full_text[:MAX_CHARS] + '…（以下省略）'
    return full_text


def call_api(user_message: str, rid: str) -> dict | None:
    """Call OpenAI API and return parsed JSON or None on failure."""
    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_message},
            ],
            temperature=0,
            max_tokens=400,
        )
        content = response['choices'][0]['message']['content'].strip()
        # Strip code fences if present
        if content.startswith('```'):
            content = content.split('```')[1]
            if content.startswith('json'):
                content = content[4:]
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f'  [WARN] JSON parse error for {rid}: {e}')
        return None
    except Exception as e:
        print(f'  [ERROR] API error for {rid}: {e}')
        return None


def load_already_processed() -> set[str]:
    processed = set()
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH) as f:
            for line in f:
                try:
                    d = json.loads(line)
                    processed.add(d['respondent_id'])
                except Exception:
                    pass
    return processed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', choices=['emp', 'nan', 'all'], default='all')
    parser.add_argument('--dry-run', action='store_true', help='Show stats without calling API')
    parser.add_argument('--limit', type=int, default=0, help='Process only first N (for testing)')
    args = parser.parse_args()

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not args.dry_run:
        sys.exit('OPENAI_API_KEY not set. Export it before running.')
    openai.api_key = api_key or 'dummy'

    print('Loading narratives ...')
    all_respondents = load_narratives()

    # Filter by dataset
    if args.dataset == 'emp':
        all_respondents = {k: v for k, v in all_respondents.items() if v['dataset'] == 'employment'}
    elif args.dataset == 'nan':
        all_respondents = {k: v for k, v in all_respondents.items() if v['dataset'] == 'nanbyo'}

    # Filter by minimum text length
    eligible = {
        rid: data for rid, data in all_respondents.items()
        if sum(len(t) for _, t in data['entries']) >= MIN_CHARS
    }
    print(f'Eligible respondents (>={MIN_CHARS} chars): {len(eligible)}')

    # Skip already processed
    already = load_already_processed()
    to_process = {rid: data for rid, data in eligible.items() if rid not in already}
    print(f'Already processed: {len(already)}  Remaining: {len(to_process)}')

    if args.limit:
        to_process = dict(list(to_process.items())[:args.limit])
        print(f'Limiting to {args.limit} respondents (--limit)')

    # Estimate cost
    avg_chars = sum(
        sum(len(t) for _, t in data['entries'])
        for data in to_process.values()
    ) / max(len(to_process), 1)
    avg_entries = sum(len(data['entries']) for data in to_process.values()) / max(len(to_process), 1)
    input_tok_est = (400 + avg_chars * 0.7 + avg_entries * 15) * len(to_process)
    out_tok_est = 200 * len(to_process)
    cost_est = (input_tok_est * 0.15 + out_tok_est * 0.60) / 1_000_000
    print(f'Estimated cost ({MODEL}): ${cost_est:.2f}  '
          f'(input ~{input_tok_est/1e6:.2f}M tok, output ~{out_tok_est/1e6:.2f}M tok)')

    if args.dry_run:
        print('[dry-run] Stopping before API calls.')
        # Show a sample user message
        sample_rid, sample_data = next(iter(to_process.items()))
        msg = build_user_message(sample_data['entries'], sample_data['dataset'])
        print(f'\nSample input for {sample_rid} ({len(msg)} chars):')
        print('---')
        print(msg[:600])
        print('---')
        return

    # ── Process ──────────────────────────────────────────────────
    processed = 0
    errors = 0
    start = time.time()

    with open(OUTPUT_PATH, 'a', encoding='utf-8') as out_f:
        for rid, data in sorted(to_process.items()):
            user_msg = build_user_message(data['entries'], data['dataset'])
            text_len = sum(len(t) for _, t in data['entries'])

            result = call_api(user_msg, rid)

            record = {
                'respondent_id': rid,
                'dataset': data['dataset'],
                'text_length': text_len,
                'n_entries': len(data['entries']),
            }

            if result and 'signals' in result:
                record['signals'] = result['signals']
                record['key_phrases'] = result.get('key_phrases', [])
                record['primary_challenge'] = result.get('primary_challenge', '')
                record['extraction_ok'] = True
            else:
                record['signals'] = None
                record['key_phrases'] = []
                record['primary_challenge'] = ''
                record['extraction_ok'] = False
                errors += 1

            out_f.write(json.dumps(record, ensure_ascii=False) + '\n')
            out_f.flush()
            processed += 1

            if processed % 50 == 0:
                elapsed = time.time() - start
                rate = processed / elapsed
                remaining = (len(to_process) - processed) / rate
                print(f'  {processed}/{len(to_process)}  '
                      f'errors={errors}  '
                      f'{rate:.1f}/sec  '
                      f'ETA {remaining/60:.1f}min')

            time.sleep(DELAY_SEC)

    elapsed = time.time() - start
    print(f'\nDone: {processed} processed, {errors} errors, {elapsed/60:.1f} min')
    print(f'Output: {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
