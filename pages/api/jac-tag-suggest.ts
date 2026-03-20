import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';
import {
  FALLBACK_HINTS,
  STRONG_SIGNAL_RULES,
  TAG_GROUPS,
  TAG_SIGNAL_RULES,
  type TagGroupKey,
  type TagSuggestion,
} from '@/lib/jac/tagDictionary';

type SuggestResponse = {
  source: 'llm' | 'fallback';
  summary: string;
  suggestions: Record<TagGroupKey, TagSuggestion[]>;
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_TIMEOUT_MS = 7000;

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

    const suggestions = mergeSignals(emptySuggestions(), buildSignalSuggestions(consultation));
    (Object.keys(TAG_GROUPS) as TagGroupKey[]).forEach((key) => {
        const hintItems = Array.from(grouped.get(key)?.values() || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
        const merged = mergeTagLists(suggestions[key], hintItems);
        suggestions[key] = merged.sort((a, b) => b.score - a.score).slice(0, 3);
    });

    return {
        source: 'fallback',
        summary:
            '相談文に一致した論点を抽出してタグ候補を提案しました。詳細化すると提案精度が上がります。',
        suggestions: applyStrongSignalRules(consultation, suggestions),
    };
}

function buildSignalSuggestions(consultation: string): Record<TagGroupKey, TagSuggestion[]> {
    const lower = consultation.toLowerCase();
    const byGroup = emptySuggestions();

    const bucket = new Map<TagGroupKey, Map<string, TagSuggestion>>();
    (Object.keys(TAG_GROUPS) as TagGroupKey[]).forEach((key) => bucket.set(key, new Map()));

    for (const rule of TAG_SIGNAL_RULES) {
        const matched = rule.patterns.filter((pattern) => lower.includes(pattern.toLowerCase()));
        if (matched.length === 0) continue;
        const score = clampScore(0.45 + Math.min(0.42, matched.length * 0.17 + (rule.boost || 0)));
        bucket.get(rule.group)?.set(rule.tag, {
            tag: rule.tag,
            reason: `相談文の表現「${matched.slice(0, 2).join(' / ')}」と一致`,
            score,
        });
    }

    (Object.keys(TAG_GROUPS) as TagGroupKey[]).forEach((group) => {
        byGroup[group] = Array.from(bucket.get(group)?.values() || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    });

    return byGroup;
}

function mergeTagLists(primary: TagSuggestion[], secondary: TagSuggestion[]): TagSuggestion[] {
    const map = new Map<string, TagSuggestion>();
    for (const item of [...primary, ...secondary]) {
        const prev = map.get(item.tag);
        if (!prev) {
            map.set(item.tag, item);
            continue;
        }
        map.set(item.tag, {
            tag: item.tag,
            reason: prev.reason.length >= item.reason.length ? prev.reason : item.reason,
            score: clampScore(Math.max(prev.score, item.score)),
        });
    }
    return Array.from(map.values());
}

function mergeSignals(
    llmBase: Record<TagGroupKey, TagSuggestion[]>,
    signalBase: Record<TagGroupKey, TagSuggestion[]>,
): Record<TagGroupKey, TagSuggestion[]> {
    const merged = emptySuggestions();
    for (const group of Object.keys(merged) as TagGroupKey[]) {
        const m = new Map<string, TagSuggestion>();
        for (const item of llmBase[group]) {
            m.set(item.tag, {
                ...item,
                score: clampScore(item.score * 0.55),
            });
        }
        for (const signal of signalBase[group]) {
            const prev = m.get(signal.tag);
            if (!prev) {
                m.set(signal.tag, {
                    ...signal,
                    score: clampScore(signal.score * 0.65),
                });
                continue;
            }
            m.set(signal.tag, {
                tag: signal.tag,
                reason: `${prev.reason} / ${signal.reason}`,
                score: clampScore(prev.score + signal.score * 0.45),
            });
        }
        merged[group] = Array.from(m.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }
    return merged;
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

function applyStrongSignalRules(
    consultation: string,
    base: Record<TagGroupKey, TagSuggestion[]>,
): Record<TagGroupKey, TagSuggestion[]> {
    const lower = consultation.toLowerCase();
    const next: Record<TagGroupKey, TagSuggestion[]> = {
        task: [...base.task],
        symptom: [...base.symptom],
        environment: [...base.environment],
        preference: [...base.preference],
    };

    for (const rule of STRONG_SIGNAL_RULES) {
        const matched = rule.patterns.some((pattern) => lower.includes(pattern.toLowerCase()));
        if (!matched) continue;
        const exists = next[rule.group].some((item) => item.tag === rule.tag);
        if (!exists) {
            next[rule.group].push({
                tag: rule.tag,
                reason: rule.reason,
                score: rule.score,
            });
        } else {
            next[rule.group] = next[rule.group].map((item) =>
                item.tag === rule.tag
                    ? {
                          ...item,
                          score: Math.max(item.score, rule.score),
                          reason: rule.reason,
                      }
                    : item,
            );
        }
        next[rule.group] = next[rule.group]
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    return next;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuggestResponse | { error: string }>) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const guard = guardJacApiRequest(req, { route: 'jac-tag-suggest', costly: true });
    if (!guard.ok) {
        return res.status(guard.status).json({ error: guard.error });
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
        const normalized = normalizeLlmSuggestions(parsed.suggestions);
        const signal = buildSignalSuggestions(consultation);
        const merged = mergeSignals(normalized, signal);
        const corrected = applyStrongSignalRules(consultation, merged);
        return res.status(200).json({
            source: 'llm',
            summary:
                parsed.summary ||
                '相談文の意味解釈（LLM）と症状/環境シグナル（ルールベース）を統合して提案しました。',
            suggestions: corrected,
        });
    } catch {
        return res.status(200).json(buildFallback(consultation));
    }
}
