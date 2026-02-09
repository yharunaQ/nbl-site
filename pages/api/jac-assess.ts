import type { NextApiRequest, NextApiResponse } from 'next';
import { buildAgenticPlan } from '@/lib/knowledge/agenticPlanner';
import { executeAgenticPlan } from '@/lib/knowledge/agenticExecutor';
import { getKnowledgeSourceById } from '@/lib/knowledge/sourceRegistry';

type TagGroupKey = 'task' | 'symptom' | 'environment' | 'preference';

type FollowUpAnswer = {
    key: string;
    label: string;
    value: string;
};

type Suggestion = {
    title: string;
    reason: string;
    examples: string;
    relatedTags: string[];
    priority: number;
};

type AccommodationSelection = {
    selected: boolean;
    priority: number;
};

type RequestBody = {
    consultation: string;
    selectedTags: Record<TagGroupKey, string[]>;
    followUpAnswers: FollowUpAnswer[];
    additionalConsultation?: string;
    selectedAccommodations?: Record<string, AccommodationSelection>;
    enabledSourceIds?: string[];
};

const SUGGESTION_LIBRARY: Suggestion[] = [
    {
        title: '会議を短時間化して事前資料を共有',
        reason: '理解・集中負荷を下げ、会議中の疲労を抑えます。',
        examples: '30分刻み、アジェンダの事前配布、議事録の共有。',
        relatedTags: ['会議・対話', '注意集中の波・認知負荷', '疲労・倦怠（慢性疲労含む）'],
        priority: 1,
    },
    {
        title: '休憩導線とリズム設計',
        reason: '疲労や体調の波に合わせて回復時間を確保します。',
        examples: '90分に1回の短休憩、午後の負荷調整、リマインダー。',
        relatedTags: ['疲労・倦怠（慢性疲労含む）', '休憩の取りやすさ・休養導線', '睡眠リズム・通院/治療スケジュール'],
        priority: 1,
    },
    {
        title: '静音・視覚刺激を抑えた環境へ',
        reason: '感覚過敏や認知負荷を軽減します。',
        examples: '静音席、遮光、通知制御、ノイズキャンセル。',
        relatedTags: ['感覚過敏（音・光・温度）', '騒音・音環境', '光・画面の明るさ/反射'],
        priority: 1,
    },
    {
        title: 'タスクの分割と優先順位の明確化',
        reason: 'マルチタスクによる負荷を減らし、達成感を確保します。',
        examples: '1日の優先度トップ3、WIP制限、進捗の可視化。',
        relatedTags: ['マルチタスク・切替', '注意集中の波・認知負荷', '時間制約・納期'],
        priority: 1,
    },
    {
        title: 'エルゴノミクス改善',
        reason: '姿勢負荷や痛みの増悪を予防します。',
        examples: '椅子・机の調整、モニタ位置の最適化、姿勢補助。',
        relatedTags: ['姿勢・椅子・机（エルゴノミクス）', '痛み・体調変動（波がある）'],
        priority: 1,
    },
    {
        title: '締切のバッファ設計',
        reason: '体調変動があっても締切遵守を支えます。',
        examples: '中間締切を設定、レビュー日を前倒し。',
        relatedTags: ['時間制約・納期', '疲労・倦怠（慢性疲労含む）'],
        priority: 1,
    },
    {
        title: 'タスク二重化・代替担当の合意',
        reason: '不調時の業務穴を最小化します。',
        examples: '代替担当の事前設定、引き継ぎテンプレ。',
        relatedTags: ['時間制約・納期', '痛み・体調変動（波がある）'],
        priority: 1,
    },
    {
        title: '業務負荷の平準化',
        reason: '繁忙期に負荷が集中することを避けます。',
        examples: '繁忙期のタスク分散、前倒し計画。',
        relatedTags: ['時間制約・納期', '疲労・倦怠（慢性疲労含む）'],
        priority: 1,
    },
    {
        title: '通院・治療スケジュールへの配慮',
        reason: '治療継続と業務継続を両立します。',
        examples: '通院日の稼働調整、柔軟な始業/終業時間。',
        relatedTags: ['睡眠リズム・通院/治療スケジュール', '時間制約・納期'],
        priority: 2,
    },
    {
        title: '本人の裁量を保ちながら段階調整',
        reason: '自律性を尊重しながら配慮を運用できます。',
        examples: '本人の優先度を尊重、週次レビューで段階調整。',
        relatedTags: ['裁量・自己決定を重視', '役割・専門性を維持したい'],
        priority: 2,
    },
    {
        title: '情報をスローダウンして共有',
        reason: '認知負荷が高い状況で理解を支援します。',
        examples: '要点サマリー、段階的説明、文字量の最適化。',
        relatedTags: ['注意集中の波・認知負荷', '文章作成・読解'],
        priority: 2,
    },
    {
        title: 'コミュニケーションの非同期化',
        reason: '対人ストレスや同席負荷を軽減します。',
        examples: 'チャットでの合意、レスポンス時間の合意。',
        relatedTags: ['対人調整・感情労働', '同席人数・密度'],
        priority: 2,
    },
    {
        title: '通勤負荷の軽減',
        reason: '体調の波や疲労の悪化を防ぎます。',
        examples: '時差出勤、週数回の在宅勤務。',
        relatedTags: ['通勤負荷（時間/混雑/距離）', '疲労・倦怠（慢性疲労含む）'],
        priority: 2,
    },
];

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function buildComposedQuery(payload: RequestBody): string {
    const tagText = Object.values(payload.selectedTags || {})
        .flat()
        .join(' / ');

    const followUp = (payload.followUpAnswers || [])
        .map((item) => `${item.label}:${item.value}`)
        .join(' | ');

    return [
        payload.consultation || '',
        payload.additionalConsultation || '',
        tagText,
        followUp,
    ]
        .map((part) => part.trim())
        .filter(Boolean)
        .join('\n');
}

function buildSystemPrompt(): string {
    return `あなたはJACのAIカウンセラーです。

役割:
- 企業側が配慮を検討するために、相談内容から因果関係（原因→影響→増悪因子→保護因子）を整理する。
- 医療診断は行わず、職業場面・タスク条件・環境条件・本人希望に基づいて整理する。
- 追加相談や配慮候補の選択結果を踏まえて、見立てを更新する。
- 提案は合意形成の材料であり、断定的な医療助言は避ける。

出力ルール:
- JSONのみを出力する。
- 指定したスキーマに厳密に従う。
- 配慮候補は優先度順で最低3件、最大8件。
- 因果関係が読めるよう、cause/impact/aggravators/protectorsを具体化する。
- causal_chain は3〜5要素の短い因果の流れ。
- causal_summary は因果と配慮必要性がわかる文章。
- citations は claim と evidence_ids で根拠トレースを返す。`;
}

function buildUserPrompt(payload: RequestBody, plannerContext: Record<string, unknown>): string {
    return JSON.stringify(
        {
            consultation: payload.consultation,
            selected_tags: payload.selectedTags,
            follow_up_answers: payload.followUpAnswers,
            additional_consultation: payload.additionalConsultation || '',
            selected_accommodations: payload.selectedAccommodations || {},
            knowledge_base: SUGGESTION_LIBRARY,
            planner_context: plannerContext,
        },
        null,
        2,
    );
}

function buildSchema() {
    return {
        type: 'object',
        additionalProperties: false,
        properties: {
            summary: { type: 'string' },
            task_conditions: { type: 'string' },
            cause: { type: 'array', items: { type: 'string' } },
            impact: { type: 'array', items: { type: 'string' } },
            aggravators: { type: 'array', items: { type: 'string' } },
            protectors: { type: 'array', items: { type: 'string' } },
            accommodations: {
                type: 'array',
                items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        title: { type: 'string' },
                        reason: { type: 'string' },
                        examples: { type: 'string' },
                        priority: { type: 'number' },
                    },
                    required: ['title', 'reason', 'examples', 'priority'],
                },
            },
            agreement: { type: 'string' },
            kpi: { type: 'string' },
            causal_summary: { type: 'string' },
            causal_chain: { type: 'array', items: { type: 'string' } },
            citations: {
                type: 'array',
                items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        claim: { type: 'string' },
                        evidence_ids: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['claim', 'evidence_ids'],
                },
            },
        },
        required: [
            'summary',
            'task_conditions',
            'cause',
            'impact',
            'aggravators',
            'protectors',
            'accommodations',
            'agreement',
            'kpi',
            'causal_summary',
            'causal_chain',
            'citations',
        ],
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OPENAI_API_KEY が設定されていません。' });
    }

    const body = req.body as RequestBody;
    if (!body?.consultation) {
        return res.status(400).json({ error: 'consultation が必要です。' });
    }

    const composedQuery = buildComposedQuery(body);

    const plan = buildAgenticPlan({
        query: composedQuery,
        enabledSourceIds: body.enabledSourceIds,
    });

    const execution = await executeAgenticPlan(plan, {
        query: composedQuery,
        keywords: [
            body.consultation,
            body.additionalConsultation || '',
            ...Object.values(body.selectedTags || {}).flat(),
            ...(body.followUpAnswers || []).map((item) => item.value),
        ],
    });

    const plannerContext = {
        selected_sources: plan.selectedSources,
        plan_warnings: plan.warnings,
        execution_progress: execution.stepProgress,
        evidence: execution.evidence,
        structured_summary: execution.structuredSummary,
        policy_notes: execution.policyNotes,
    };

    const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: buildSystemPrompt() },
                { role: 'user', content: buildUserPrompt(body, plannerContext) },
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'jac_assessment',
                    strict: true,
                    schema: buildSchema(),
                },
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({ error: errorText || 'OpenAI API error' });
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;

    if (!content) {
        return res.status(500).json({ error: 'OpenAI 応答が空です。' });
    }

    try {
        const assessment = JSON.parse(content);
        return res.status(200).json({
            assessment,
            process: {
                selectedSources: plan.selectedSources.map((source) => ({
                    id: source.id,
                    name: source.name,
                    kind: source.kind,
                    enabled: source.enabled,
                })),
                stepProgress: execution.stepProgress,
                planWarnings: plan.warnings,
                evidenceCount: execution.evidence.length,
                evidencePreview: execution.evidence.slice(0, 6),
                sourceNotes: plan.selectedSources
                    .map((source) => getKnowledgeSourceById(source.id)?.notes)
                    .filter(Boolean),
            },
        });
    } catch {
        return res.status(500).json({ error: 'JSON 解析に失敗しました。' });
    }
}
