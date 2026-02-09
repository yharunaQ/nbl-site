import type { NextApiRequest, NextApiResponse } from 'next';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';

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

const TAG_SIGNAL_RULES: Array<{
    group: TagGroupKey;
    tag: string;
    patterns: string[];
    boost?: number;
}> = [
    { group: 'task', tag: '会議・対話', patterns: ['会議', '打合せ', '面談', 'コミュニケーション'] },
    { group: 'task', tag: '集中作業・思考作業', patterns: ['集中', '考える', '思考', '頭が回ら', '判断'] },
    { group: 'task', tag: '文章作成・読解', patterns: ['文章', '資料', '読解', 'メール', '文書'] },
    { group: 'task', tag: 'マルチタスク・切替', patterns: ['同時', '切替', '並行', '複数業務'] },
    { group: 'task', tag: '時間制約・納期', patterns: ['納期', '締切', '急ぎ', '期限', '応募', '求人'] },
    { group: 'task', tag: '移動・外出・現場', patterns: ['移動', '外出', '出張', '現場'] },
    { group: 'task', tag: '画面作業（視認性/長時間PC）', patterns: ['pc', '画面', 'モニタ', '目が疲れ'] },
    { group: 'task', tag: '対人調整・感情労働', patterns: ['調整', '対人', '気を遣', '感情', '言い方'] },
    { group: 'symptom', tag: '疲労・倦怠（慢性疲労含む）', patterns: ['疲労', '倦怠', 'だる', 'しんど', '消耗'] },
    { group: 'symptom', tag: '痛み・体調変動（波がある）', patterns: ['体調の波', '波が大き', '体調変動', '波がある', '体調が不安定', '痛み'], boost: 0.08 },
    { group: 'symptom', tag: '注意集中の波・認知負荷', patterns: ['集中が落ち', '認知負荷', '頭がぼんやり', '注意散漫'] },
    { group: 'symptom', tag: '不安・緊張・メンタル負荷', patterns: ['不安', '緊張', 'ストレス', 'メンタル'] },
    { group: 'symptom', tag: '睡眠リズム・通院/治療スケジュール', patterns: ['睡眠', '通院', '治療', '服薬'] },
    { group: 'symptom', tag: '感覚過敏（音・光・温度）', patterns: ['過敏', '刺激に弱', '感覚'] },
    { group: 'symptom', tag: '視覚負荷（見えづらさ/眼精疲労）', patterns: ['見えづら', '眼精疲労', 'まぶし'] },
    { group: 'symptom', tag: '聴覚負荷（聞き取り困難/雑音）', patterns: ['聞き取り', '雑音', '騒がし'] },
    { group: 'environment', tag: 'リモート/出社', patterns: ['リモート', '在宅', '出社', '完全在宅', 'フルリモート'], boost: 0.05 },
    { group: 'environment', tag: '休憩の取りやすさ・休養導線', patterns: ['休憩', '短時間', '時短', '休みながら'] },
    { group: 'environment', tag: '騒音・音環境', patterns: ['音', '騒音', 'うるさい'] },
    { group: 'environment', tag: '光・画面の明るさ/反射', patterns: ['光', '明るさ', '反射', 'まぶしい'] },
    { group: 'environment', tag: '温度・空調', patterns: ['温度', '空調', '暑い', '寒い'] },
    { group: 'environment', tag: '姿勢・椅子・机（エルゴノミクス）', patterns: ['椅子', '姿勢', '机', '腰痛'] },
    { group: 'environment', tag: '作業スペース/動線', patterns: ['スペース', '動線', '座席配置'] },
    { group: 'environment', tag: '同席人数・密度', patterns: ['人数', '密度', '人が多い'] },
    { group: 'environment', tag: '通勤負荷（時間/混雑/距離）', patterns: ['通勤', '混雑', '距離', '満員電車'] },
    { group: 'preference', tag: '生活リズムを守りたい', patterns: ['生活リズム', '無理なく', '安定して働きたい'] },
    { group: 'preference', tag: '収入・雇用条件を守りたい', patterns: ['収入', '雇用条件', '給与', '契約'] },
    { group: 'preference', tag: '成長機会・挑戦を続けたい', patterns: ['成長', '挑戦', 'キャリア'] },
    { group: 'preference', tag: '裁量・自己決定を重視', patterns: ['自己決定', '裁量', '自分で決めたい'] },
    { group: 'preference', tag: '対人関係の安定を重視', patterns: ['対人関係', '人間関係', '言い方', '伝え方'] },
    { group: 'preference', tag: '役割・専門性を維持したい', patterns: ['役割', '専門性', '強みを活かす'] },
];

const STRONG_SIGNAL_RULES: Array<{
    patterns: string[];
    group: TagGroupKey;
    tag: string;
    reason: string;
    score: number;
}> = [
    {
        patterns: ['体調の波', '波が大き', '体調変動', '波がある'],
        group: 'symptom',
        tag: '痛み・体調変動（波がある）',
        reason: '体調の波に関する明示表現があるため',
        score: 0.96,
    },
    {
        patterns: ['完全在宅', 'フルリモート', '在宅じゃないと', '在宅でないと'],
        group: 'environment',
        tag: 'リモート/出社',
        reason: '勤務場所条件（在宅）が就労成立条件として示されているため',
        score: 0.95,
    },
    {
        patterns: ['短時間', '時短', '短い時間', '短時間勤務'],
        group: 'environment',
        tag: '休憩の取りやすさ・休養導線',
        reason: '就業時間調整ニーズが明確なため',
        score: 0.9,
    },
    {
        patterns: ['求人', '探し方', '就職活動', '応募'],
        group: 'task',
        tag: '時間制約・納期',
        reason: '就職活動の段取り・進行管理ニーズがあるため',
        score: 0.78,
    },
    {
        patterns: ['一緒に整理', '相談したい', '言い方', '伝え方'],
        group: 'preference',
        tag: '対人関係の安定を重視',
        reason: 'コミュニケーションの安定化を重視しているため',
        score: 0.75,
    },
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
