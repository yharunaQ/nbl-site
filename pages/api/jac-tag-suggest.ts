import type { NextApiRequest, NextApiResponse } from 'next';

type TagGroupKey = 'task' | 'symptom' | 'environment' | 'preference';

type TagSuggestion = {
    tag: string;
    reason: string;
    score: number;
};

type SuggestResponse = {
    source: 'llm' | 'fallback';
    summary: string;
    suggestions: Record<TagGroupKey, TagSuggestion[]>;
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_TIMEOUT_MS = 7000;

const TAG_GROUPS: Record<TagGroupKey, string[]> = {
    task: [
        '集中作業・思考作業',
        '会議・対話',
        '文章作成・読解',
        'マルチタスク・切替',
        '対人調整・感情労働',
        '移動・外出・現場',
        '時間制約・納期',
        '画面作業（視認性/長時間PC）',
    ],
    symptom: [
        '疲労・倦怠（慢性疲労含む）',
        '痛み・体調変動（波がある）',
        '注意集中の波・認知負荷',
        '不安・緊張・メンタル負荷',
        '感覚過敏（音・光・温度）',
        '視覚負荷（見えづらさ/眼精疲労）',
        '聴覚負荷（聞き取り困難/雑音）',
        '睡眠リズム・通院/治療スケジュール',
    ],
    environment: [
        '騒音・音環境',
        '光・画面の明るさ/反射',
        '温度・空調',
        '姿勢・椅子・机（エルゴノミクス）',
        '作業スペース/動線',
        '同席人数・密度',
        'リモート/出社',
        '休憩の取りやすさ・休養導線',
        '通勤負荷（時間/混雑/距離）',
    ],
    preference: [
        '役割・専門性を維持したい',
        '成長機会・挑戦を続けたい',
        '生活リズムを守りたい',
        '収入・雇用条件を守りたい',
        '対人関係の安定を重視',
        '裁量・自己決定を重視',
    ],
};

const FALLBACK_HINTS: Array<{ keyword: string; group: TagGroupKey; tag: string; reason: string }> = [
    { keyword: '会議', group: 'task', tag: '会議・対話', reason: '会議場面の負荷が直接言及されているため' },
    { keyword: '集中', group: 'task', tag: '集中作業・思考作業', reason: '集中力の維持困難が示唆されるため' },
    { keyword: '締切', group: 'task', tag: '時間制約・納期', reason: '時間制約が困難要因として想定されるため' },
    { keyword: '疲労', group: 'symptom', tag: '疲労・倦怠（慢性疲労含む）', reason: '疲労症状が明示されているため' },
    { keyword: '痛み', group: 'symptom', tag: '痛み・体調変動（波がある）', reason: '身体症状の変動が示唆されるため' },
    { keyword: '不安', group: 'symptom', tag: '不安・緊張・メンタル負荷', reason: '心理的負荷が記載されているため' },
    { keyword: '音', group: 'environment', tag: '騒音・音環境', reason: '音環境の調整ニーズがあるため' },
    { keyword: '光', group: 'environment', tag: '光・画面の明るさ/反射', reason: '視覚刺激調整の必要性があるため' },
    { keyword: '通院', group: 'symptom', tag: '睡眠リズム・通院/治療スケジュール', reason: '通院と就労調整が必要なため' },
    { keyword: 'リモート', group: 'environment', tag: 'リモート/出社', reason: '勤務形態調整の示唆があるため' },
    { keyword: '在宅', group: 'environment', tag: 'リモート/出社', reason: '勤務場所調整の示唆があるため' },
    { keyword: '休憩', group: 'environment', tag: '休憩の取りやすさ・休養導線', reason: '休養導線が重要なため' },
    { keyword: '成長', group: 'preference', tag: '成長機会・挑戦を続けたい', reason: 'キャリア志向が示されているため' },
    { keyword: '収入', group: 'preference', tag: '収入・雇用条件を守りたい', reason: '雇用条件維持が重視されているため' },
    { keyword: '裁量', group: 'preference', tag: '裁量・自己決定を重視', reason: '自己決定性を重視しているため' },
];

function emptySuggestions(): Record<TagGroupKey, TagSuggestion[]> {
    return { task: [], symptom: [], environment: [], preference: [] };
}

function clampScore(score: number): number {
    return Math.max(0.1, Math.min(0.99, Number(score.toFixed(2))));
}

function buildFallback(consultation: string): SuggestResponse {
    const lower = consultation.toLowerCase();
    const grouped = new Map<TagGroupKey, Map<string, TagSuggestion>>();
    (Object.keys(TAG_GROUPS) as TagGroupKey[]).forEach((key) => grouped.set(key, new Map()));

    for (const hint of FALLBACK_HINTS) {
        if (!lower.includes(hint.keyword.toLowerCase())) continue;
        const scoreBase = 0.55 + Math.min(0.3, hint.keyword.length * 0.03);
        grouped.get(hint.group)?.set(hint.tag, {
            tag: hint.tag,
            reason: hint.reason,
            score: clampScore(scoreBase),
        });
    }

    const suggestions = emptySuggestions();
    (Object.keys(TAG_GROUPS) as TagGroupKey[]).forEach((key) => {
        const items = Array.from(grouped.get(key)?.values() || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        suggestions[key] = items;
    });

    return {
        source: 'fallback',
        summary:
            '相談文に一致した論点を抽出してタグ候補を提案しました。詳細化すると提案精度が上がります。',
        suggestions,
    };
}

function normalizeLlmSuggestions(raw: unknown): Record<TagGroupKey, TagSuggestion[]> {
    const byGroup = emptySuggestions();
    if (!raw || typeof raw !== 'object') return byGroup;

    for (const key of Object.keys(byGroup) as TagGroupKey[]) {
        const rows = (raw as Record<string, unknown>)[key];
        if (!Array.isArray(rows)) continue;
        const allowed = new Set(TAG_GROUPS[key]);
        const normalized = rows
            .map((row) => (row && typeof row === 'object' ? (row as Record<string, unknown>) : null))
            .filter(Boolean)
            .map((row) => ({
                tag: String(row?.tag || ''),
                reason: String(row?.reason || ''),
                score: Number(row?.score || 0.6),
            }))
            .filter((row) => allowed.has(row.tag))
            .map((row) => ({
                tag: row.tag,
                reason: row.reason.slice(0, 120) || '相談文との関連が高いため',
                score: clampScore(Number.isFinite(row.score) ? row.score : 0.6),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        byGroup[key] = normalized;
    }

    return byGroup;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuggestResponse | { error: string }>) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const consultation = String(req.body?.consultation || '').trim();
    if (!consultation) {
        return res.status(400).json({ error: 'consultation が必要です。' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(200).json(buildFallback(consultation));
    }

    const systemPrompt = `あなたは就労支援タグの推薦アシスタントです。
目的:
- 相談文から、4分類(task/symptom/environment/preference)それぞれ0〜3件のタグを提案する。
- 相談文に合わせて毎回変化する提案を行い、理由を短く具体的に書く。
制約:
- 必ず与えられた候補タグのみから選ぶ。
- JSONのみ出力。`;

    const userPrompt = JSON.stringify({
        consultation,
        candidates: TAG_GROUPS,
        output: {
            summary: '提案全体の要約（1文）',
            suggestions: {
                task: [{ tag: '候補タグ', reason: '理由', score: 0.8 }],
                symptom: [{ tag: '候補タグ', reason: '理由', score: 0.8 }],
                environment: [{ tag: '候補タグ', reason: '理由', score: 0.8 }],
                preference: [{ tag: '候補タグ', reason: '理由', score: 0.8 }],
            },
        },
    });

    try {
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'jac_tag_suggest',
                        strict: true,
                        schema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                summary: { type: 'string' },
                                suggestions: {
                                    type: 'object',
                                    additionalProperties: false,
                                    properties: {
                                        task: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { tag: { type: 'string' }, reason: { type: 'string' }, score: { type: 'number' } }, required: ['tag', 'reason', 'score'] } },
                                        symptom: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { tag: { type: 'string' }, reason: { type: 'string' }, score: { type: 'number' } }, required: ['tag', 'reason', 'score'] } },
                                        environment: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { tag: { type: 'string' }, reason: { type: 'string' }, score: { type: 'number' } }, required: ['tag', 'reason', 'score'] } },
                                        preference: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { tag: { type: 'string' }, reason: { type: 'string' }, score: { type: 'number' } }, required: ['tag', 'reason', 'score'] } },
                                    },
                                    required: ['task', 'symptom', 'environment', 'preference'],
                                },
                            },
                            required: ['summary', 'suggestions'],
                        },
                    },
                },
            }),
            signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
        });

        if (!response.ok) {
            return res.status(200).json(buildFallback(consultation));
        }
        const json = await response.json();
        const content = json?.choices?.[0]?.message?.content;
        if (!content) {
            return res.status(200).json(buildFallback(consultation));
        }
        const parsed = JSON.parse(content) as { summary?: string; suggestions?: unknown };
        return res.status(200).json({
            source: 'llm',
            summary: parsed.summary || '相談文から関連の高いタグを提案しました。',
            suggestions: normalizeLlmSuggestions(parsed.suggestions),
        });
    } catch {
        return res.status(200).json(buildFallback(consultation));
    }
}
