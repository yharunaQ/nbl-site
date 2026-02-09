import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type TagGroupKey = 'task' | 'symptom' | 'environment' | 'preference';

type FollowUpAnswer = {
    key: string;
    label: string;
    value: string;
};

type FollowUpQuestion = {
    key: string;
    label: string;
    placeholder: string;
};

type TagGroup = {
    key: TagGroupKey;
    label: string;
    description: string;
    tags: string[];
};

type AiAccommodation = {
    title: string;
    reason: string;
    examples: string;
    priority: number;
};

type AiAssessment = {
    summary: string;
    task_conditions: string;
    cause: string[];
    impact: string[];
    aggravators: string[];
    protectors: string[];
    accommodations: AiAccommodation[];
    agreement: string;
    kpi: string;
    causal_summary: string;
    causal_chain: string[];
    citations: {
        claim: string;
        evidence_ids: string[];
    }[];
};

type AssessmentProcessStep = {
    stepId: string;
    purpose: string;
    tool: 'keyword_search' | 'semantic_search' | 'structured_query' | 'policy_check' | 'synthesis';
    status: 'completed' | 'skipped' | 'failed';
    message: string;
    evidenceCount: number;
};

type AssessmentProcess = {
    selectedSources: {
        id: string;
        name: string;
        kind: string;
        enabled: boolean;
    }[];
    stepProgress: AssessmentProcessStep[];
    planWarnings: string[];
    evidenceCount: number;
    evidencePreview: {
        id: string;
        sourceId: string;
        filePath: string;
        excerpt: string;
        score: number;
    }[];
    glmInsights: {
        evidenceId: string;
        sheet: string;
        summary: string;
        predictor: string;
        outcome: string;
        effect: number;
        pValue: number | null;
        confidence: 'high' | 'medium';
        matchedKeywords: string[];
        actionTitles: string[];
    }[];
    glmInteractionMeanings: string[];
    freeTextEvidence: {
        hitCount: number;
        samples: {
            sourceId: string;
            filePath: string;
            excerpt: string;
            score: number;
        }[];
    };
    responseMode?: 'fast' | 'full';
    pendingRefinement?: boolean;
    refinementJobId?: string | null;
    fallbackReason?: string | null;
    sourceNotes: string[];
};

type TagSuggestion = {
    tag: string;
    reason: string;
    score: number;
};

type TagSuggestionResponse = {
    source: 'llm' | 'fallback';
    summary: string;
    suggestions: Record<TagGroupKey, TagSuggestion[]>;
};

type AccommodationSelection = {
    selected: boolean;
    priority: number;
};

const tagGroups: TagGroup[] = [
    {
        key: 'task',
        label: 'タスク条件（活動・参加）',
        description: '職業場面での困難が出やすいタスクや場面',
        tags: [
            '集中作業・思考作業',
            '会議・対話',
            '文章作成・読解',
            'マルチタスク・切替',
            '対人調整・感情労働',
            '移動・外出・現場',
            '時間制約・納期',
            '画面作業（視認性/長時間PC）',
        ],
    },
    {
        key: 'symptom',
        label: '症状像（心身機能）',
        description: '体調・認知・感覚などの影響が出る領域',
        tags: [
            '疲労・倦怠（慢性疲労含む）',
            '痛み・体調変動（波がある）',
            '注意集中の波・認知負荷',
            '不安・緊張・メンタル負荷',
            '感覚過敏（音・光・温度）',
            '視覚負荷（見えづらさ/眼精疲労）',
            '聴覚負荷（聞き取り困難/雑音）',
            '睡眠リズム・通院/治療スケジュール',
        ],
    },
    {
        key: 'environment',
        label: '環境条件（環境因子）',
        description: '働く環境や設備・制度に関する条件',
        tags: [
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
    },
    {
        key: 'preference',
        label: '本人の希望（個人要因）',
        description: '守りたいこと・受け入れやすい配慮',
        tags: [
            '役割・専門性を維持したい',
            '成長機会・挑戦を続けたい',
            '生活リズムを守りたい',
            '収入・雇用条件を守りたい',
            '対人関係の安定を重視',
            '裁量・自己決定を重視',
        ],
    },
];

const followUpLibrary: Record<TagGroupKey, FollowUpQuestion[]> = {
    task: [
        {
            key: 'task_scenes',
            label: '困りやすいタスクの具体的な場面や頻度は？',
            placeholder: '例：週3回の定例会議（午前）、締切が集中する月末など',
        },
        {
            key: 'task_impact',
            label: 'そのタスクで影響が出るとき、何が難しくなりますか？',
            placeholder: '例：理解が追いつかない、意思決定が遅れる、疲労が急に増える',
        },
    ],
    symptom: [
        {
            key: 'symptom_pattern',
            label: '体調の波や症状の出方は？（時間帯・頻度・持続時間）',
            placeholder: '例：午後に疲労が強くなる、週2回程度波が大きい',
        },
        {
            key: 'symptom_trigger',
            label: '悪化しやすい要因や避けたい条件は？',
            placeholder: '例：連続会議、強い光、睡眠不足が続くと悪化',
        },
    ],
    environment: [
        {
            key: 'env_trigger',
            label: '影響が大きい環境要因は？',
            placeholder: '例：会議室の騒音、空調の温度差、椅子の硬さ',
        },
        {
            key: 'env_support',
            label: 'あると助かる環境・道具・制度は？',
            placeholder: '例：静音席、遮光、リモート勤務、休憩の確保',
        },
    ],
    preference: [
        {
            key: 'pref_goal',
            label: '本人が守りたい・維持したいことは？',
            placeholder: '例：専門性を活かした業務、生活リズム、成長機会',
        },
        {
            key: 'pref_accept',
            label: '受け入れやすい配慮や避けたい配慮は？',
            placeholder: '例：対面会議を減らしたいが、チームとの共有は保ちたい',
        },
    ],
};

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

const buildDraftText = (
    assessment: AiAssessment,
    selectedAccommodations: AccommodationSelectionMap,
    mode: DraftViewMode,
) => {
    const expertView = [
        '[専門家見立て]',
        '原因（症状像）',
        formatList(assessment.cause),
        '',
        '影響（活動・参加）',
        formatList(assessment.impact),
        '',
        '増悪因子（環境・制度）',
        formatList(assessment.aggravators),
        '',
        '保護因子（希望・資源）',
        formatList(assessment.protectors),
    ].join('\n');

    const selectedOnly = assessment.accommodations
        .filter((item) => selectedAccommodations[item.title]?.selected)
        .map((item) => {
            const priority = selectedAccommodations[item.title]?.priority ?? item.priority;
            return `- ${item.title}（優先度${priority}／理由：${item.reason}／例：${item.examples}）`;
        });

    const allAccommodations = assessment.accommodations
            .map((item) => `- ${item.title}（理由：${item.reason}／例：${item.examples}）`)
            .join('\n');

    const selectedText = selectedOnly.map((item) => item).join('\n');
    const accommodationsText =
        mode === 'selected'
            ? selectedText || allAccommodations
            : allAccommodations;

    return [
        'JAC 合意文書（ドラフト）',
        '',
        '1. 目的（課題/症状像の要約）',
        `${assessment.summary}\n\n${expertView}`,
        '',
        '2. タスク条件（作業内容・頻度・時間帯・環境）',
        assessment.task_conditions,
        '',
        '3. 配慮案（環境/運用/ツール）',
        accommodationsText,
        '',
        '4. 合意事項（担当/期間/見直し条件）',
        assessment.agreement,
        '',
        '5. KPI（評価指標/測定方法）',
        assessment.kpi,
    ].join('\n');
};

type AccommodationSelectionMap = Record<string, AccommodationSelection>;
type DraftViewMode = 'selected' | 'all';

export default function JacTrial() {
    const [step, setStep] = useState(1);
    const [consultation, setConsultation] = useState('');
    const [selectedTags, setSelectedTags] = useState<Record<TagGroupKey, string[]>>({
        task: [],
        symptom: [],
        environment: [],
        preference: [],
    });
    const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswer[]>([]);
    const [aiAssessment, setAiAssessment] = useState<AiAssessment | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [additionalConsultation, setAdditionalConsultation] = useState('');
    const [accommodationSelections, setAccommodationSelections] = useState<AccommodationSelectionMap>({});
    const [draftViewMode, setDraftViewMode] = useState<DraftViewMode>('selected');
    const [assessmentProcess, setAssessmentProcess] = useState<AssessmentProcess | null>(null);
    const [refining, setRefining] = useState(false);
    const [refineMessage, setRefineMessage] = useState<string | null>(null);
    const [tagSuggestion, setTagSuggestion] = useState<TagSuggestionResponse | null>(null);
    const [tagSuggestionLoading, setTagSuggestionLoading] = useState(false);
    const [tagSuggestionError, setTagSuggestionError] = useState<string | null>(null);
    const [tagSuggestionQuery, setTagSuggestionQuery] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const followUpQuestions = useMemo(() => {
        const groups = Object.entries(selectedTags) as [TagGroupKey, string[]][];
        return groups.flatMap(([key, tags]) => {
            if (tags.length === 0) return [];
            return followUpLibrary[key];
        });
    }, [selectedTags]);

    const draftText = useMemo(() => {
        if (!aiAssessment) return '';
        return buildDraftText(aiAssessment, accommodationSelections, draftViewMode);
    }, [aiAssessment, accommodationSelections, draftViewMode]);

    const selectedAccommodationCount = useMemo(() => {
        return Object.values(accommodationSelections).filter((item) => item.selected).length;
    }, [accommodationSelections]);

    const completedStepCount = useMemo(() => {
        if (!assessmentProcess) return 0;
        return assessmentProcess.stepProgress.filter((item) => item.status === 'completed').length;
    }, [assessmentProcess]);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem('jac_access_token') || '';
            setAccessToken(saved);
        } catch {
            // ignore
        }
    }, []);

    const buildAuthHeaders = useCallback(() => {
        const headers: Record<string, string> = {};
        const token = accessToken.trim();
        if (token) {
            headers['x-jac-access-token'] = token;
        }
        return headers;
    }, [accessToken]);

    useEffect(() => {
        setAiAssessment(null);
        setAiError(null);
        setCopied(false);
        setAccommodationSelections({});
        setAdditionalConsultation('');
        setAssessmentProcess(null);
        setRefining(false);
        setRefineMessage(null);
    }, [consultation, selectedTags, followUpAnswers]);

    useEffect(() => {
        setTagSuggestion(null);
        setTagSuggestionError(null);
        setTagSuggestionQuery('');
    }, [consultation]);

    useEffect(() => {
        if (!aiAssessment) return;
        const initialSelections: AccommodationSelectionMap = {};
        aiAssessment.accommodations.forEach((item) => {
            initialSelections[item.title] = {
                selected: true,
                priority: item.priority,
            };
        });
        setAccommodationSelections(initialSelections);
    }, [aiAssessment]);

    const updateTag = (groupKey: TagGroupKey, tag: string) => {
        setSelectedTags((prev) => {
            const exists = prev[groupKey].includes(tag);
            const nextTags = exists
                ? prev[groupKey].filter((item) => item !== tag)
                : [...prev[groupKey], tag];
            return { ...prev, [groupKey]: nextTags };
        });
    };

    const updateFollowUp = (key: string, label: string, value: string) => {
        setFollowUpAnswers((prev) => {
            const exists = prev.find((item) => item.key === key);
            if (exists) {
                return prev.map((item) => (item.key === key ? { ...item, value } : item));
            }
            return [...prev, { key, label, value }];
        });
    };

    const updateAccommodationSelection = (title: string, patch: Partial<AccommodationSelection>) => {
        setAccommodationSelections((prev) => ({
            ...prev,
            [title]: {
                selected: prev[title]?.selected ?? true,
                priority: prev[title]?.priority ?? 2,
                ...patch,
            },
        }));
    };

    const applyTagSuggestion = (group: TagGroupKey, tag: string) => {
        setSelectedTags((prev) => ({
            ...prev,
            [group]: prev[group].includes(tag) ? prev[group] : [...prev[group], tag],
        }));
    };

    const applyAllTagSuggestions = () => {
        if (!tagSuggestion) return;
        setSelectedTags((prev) => {
            const next = { ...prev };
            (Object.keys(tagSuggestion.suggestions) as TagGroupKey[]).forEach((group) => {
                const combined = new Set([...next[group], ...tagSuggestion.suggestions[group].map((item) => item.tag)]);
                next[group] = Array.from(combined);
            });
            return next;
        });
    };

    const fetchTagSuggestion = useCallback(async () => {
        const query = consultation.trim();
        if (!query) return;
        setTagSuggestionLoading(true);
        setTagSuggestionError(null);
        try {
            const response = await fetch('/api/jac-tag-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
                body: JSON.stringify({ consultation: query }),
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err?.error || 'タグ提案に失敗しました。');
            }
            const data = (await response.json()) as TagSuggestionResponse;
            setTagSuggestion(data);
            setTagSuggestionQuery(query);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'タグ提案の取得中にエラーが発生しました。';
            setTagSuggestionError(message);
        } finally {
            setTagSuggestionLoading(false);
        }
    }, [consultation, buildAuthHeaders]);

    useEffect(() => {
        if (step !== 2) return;
        const query = consultation.trim();
        if (!query) return;
        if (tagSuggestionLoading) return;
        if (tagSuggestion && tagSuggestionQuery === query) return;
        void fetchTagSuggestion();
    }, [step, consultation, tagSuggestion, tagSuggestionLoading, tagSuggestionQuery, fetchTagSuggestion]);

    const handleCopy = async () => {
        if (!draftText) return;
        try {
            await navigator.clipboard.writeText(draftText);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy draft:', error);
            setCopied(false);
        }
    };

    const resetAll = () => {
        setStep(1);
        setConsultation('');
        setSelectedTags({ task: [], symptom: [], environment: [], preference: [] });
        setFollowUpAnswers([]);
        setAiAssessment(null);
        setAiError(null);
        setAiLoading(false);
        setCopied(false);
        setAdditionalConsultation('');
        setAccommodationSelections({});
        setDraftViewMode('selected');
        setAssessmentProcess(null);
        setRefining(false);
        setRefineMessage(null);
        setTagSuggestion(null);
        setTagSuggestionLoading(false);
        setTagSuggestionError(null);
        setTagSuggestionQuery('');
    };

    const generateAssessment = async () => {
        setAiLoading(true);
        setAiError(null);
        setAssessmentProcess(null);
        setRefining(false);
        setRefineMessage(null);
        try {
            const fastResponse = await fetch('/api/jac-assess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
                body: JSON.stringify({
                    consultation,
                    selectedTags,
                    followUpAnswers,
                    additionalConsultation,
                    selectedAccommodations: accommodationSelections,
                    responseMode: 'fast',
                }),
            });

            if (!fastResponse.ok) {
                const errorBody = await fastResponse.json().catch(() => ({}));
                throw new Error(errorBody?.error || '専門家見立ての生成に失敗しました。');
            }

            const fastData = await fastResponse.json();
            setAiAssessment(fastData.assessment as AiAssessment);
            setAssessmentProcess((fastData.process as AssessmentProcess) || null);
            setRefining(true);
            setRefineMessage('初回結果を表示しました。精密見立てをバックグラウンドで更新中...');
            setAiLoading(false);
            const jobId = (fastData.process as AssessmentProcess | null)?.refinementJobId || null;
            if (!jobId) {
                setRefining(false);
                setRefineMessage('初回結果を表示中です（精密更新ジョブなし）。');
                return true;
            }

            void (async () => {
                const maxAttempts = 45;
                for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    try {
                        const statusResponse = await fetch(
                            `/api/jac-assess-refinement?jobId=${encodeURIComponent(jobId)}`,
                            {
                                headers: {
                                    ...buildAuthHeaders(),
                                },
                            },
                        );
                        if (!statusResponse.ok) continue;
                        const statusJson = await statusResponse.json();
                        if (statusJson.status === 'completed') {
                            setAiAssessment(statusJson.assessment as AiAssessment);
                            setAssessmentProcess((statusJson.process as AssessmentProcess) || null);
                            setRefineMessage('精密見立てに更新しました。');
                            setRefining(false);
                            return;
                        }
                        if (statusJson.status === 'failed') {
                            setRefineMessage('初回結果を表示中です（精密更新は失敗）。');
                            setRefining(false);
                            return;
                        }
                    } catch {
                        // Keep polling until attempts are exhausted.
                    }
                }
                setRefineMessage('初回結果を表示中です（精密更新は時間超過）。');
                setRefining(false);
            })();
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期せぬエラーが発生しました。';
            setAiError(message);
            setAiLoading(false);
            setRefining(false);
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
            <Head>
                <title>JAC 試用版 | 合意文書ジェネレーター</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="description"
                    content="相談内容からタスク条件×症状像×環境条件を整理し、合意文書が段階的に明確になるJAC試用版。"
                />
            </Head>

            <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
                <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold">Next Being Lab</p>
                        <h1 className="text-lg md:text-2xl font-bold text-gray-900">JAC 試用版（AIカウンセラー）</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={resetAll}
                            className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            初期化
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            トップへ戻る
                        </Link>
                    </div>
                </div>
                <div className="mx-auto max-w-6xl px-6 pb-3">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-600">Access Token</span>
                        <input
                            type="password"
                            value={accessToken}
                            onChange={(event) => setAccessToken(event.target.value)}
                            className="flex-1 min-w-[220px] rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                            placeholder="JAC_ACCESS_TOKEN"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                try {
                                    window.localStorage.setItem('jac_access_token', accessToken.trim());
                                } catch {
                                    // ignore
                                }
                            }}
                            className="rounded-md bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-black"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
                <section className="space-y-6 min-w-0">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold">
                                Step {step} / 4
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 mt-3">相談内容から合意文書へ</h2>
                            <p className="text-sm text-gray-600 mt-2">
                                相談内容を入力 → タグで整理 → 専門家の見立て → 合意文書を生成。
                                納得がいくまで、見立てと配慮案を更新できます。
                            </p>
                        </div>

                        {step === 1 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-gray-800">1. 相談内容（自由記述）</span>
                                    <textarea
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[160px]"
                                        placeholder="例：長時間会議で疲れて理解が落ちる。午後になると頭がぼんやりする。"
                                        value={consultation}
                                        onChange={(event) => setConsultation(event.target.value)}
                                    />
                                </label>
                                <div className="flex flex-wrap gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        AI分析してタグ提案へ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
                                    >
                                        手動で次へ
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">2. タグで整理</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        相談内容をもとに該当しそうなタグを選んでください。複数選択できます。
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-indigo-900">AI提案タグ</p>
                                            <p className="text-xs text-indigo-700">
                                                相談文を読んだ上で、理由つきで候補を提案します。
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={fetchTagSuggestion}
                                                className="rounded-lg border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                                                disabled={tagSuggestionLoading || !consultation.trim()}
                                            >
                                                {tagSuggestionLoading ? '分析中...' : '再分析'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={applyAllTagSuggestions}
                                                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                                                disabled={!tagSuggestion}
                                            >
                                                まとめて適用
                                            </button>
                                        </div>
                                    </div>
                                    {tagSuggestionError && (
                                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
                                            {tagSuggestionError}
                                        </div>
                                    )}
                                    {tagSuggestion && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-indigo-800">
                                                {tagSuggestion.summary}（source: {tagSuggestion.source}）
                                            </p>
                                            {(Object.keys(tagSuggestion.suggestions) as TagGroupKey[]).map((group) => (
                                                <div key={`suggest-${group}`} className="rounded-lg border border-indigo-100 bg-white p-3">
                                                    <p className="text-xs font-semibold text-indigo-800 mb-2">
                                                        {tagGroups.find((item) => item.key === group)?.label}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {tagSuggestion.suggestions[group].length === 0 && (
                                                            <p className="text-[11px] text-gray-500">候補なし</p>
                                                        )}
                                                        {tagSuggestion.suggestions[group].map((item) => (
                                                            <div key={`${group}-${item.tag}`} className="flex items-start justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-semibold text-gray-900">
                                                                        {item.tag}
                                                                        <span className="ml-2 text-[10px] text-indigo-600">
                                                                            score {item.score.toFixed(2)}
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-[11px] text-gray-600">{item.reason}</p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => applyTagSuggestion(group, item.tag)}
                                                                    className="shrink-0 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    適用
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    {tagGroups.map((group) => (
                                        <div key={group.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                            <div className="mb-3">
                                                <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                                                <p className="text-xs text-gray-500">{group.description}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {group.tags.map((tag) => {
                                                    const active = selectedTags[group.key].includes(tag);
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={tag}
                                                            onClick={() => updateTag(group.key, tag)}
                                                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                                                active
                                                                    ? 'border-indigo-500 bg-indigo-600 text-white'
                                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200'
                                                            }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
                                    >
                                        次へ
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">3. AIカウンセラーによる確認</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        追加質問に答えた後、AIカウンセラーが因果関係を整理して見立てを生成します。
                                    </p>
                                    {refineMessage && <p className="text-xs text-indigo-700 mt-2">{refineMessage}</p>}
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">処理進捗（Agentic Search）</p>
                                        <span className="text-xs text-gray-500">
                                            {assessmentProcess
                                                ? `${completedStepCount}/${assessmentProcess.stepProgress.length} 完了・${assessmentProcess.evidenceCount} 根拠`
                                                : '未実行'}
                                        </span>
                                    </div>
                                    {!assessmentProcess && (
                                        <p className="text-xs text-gray-500">見立て生成後に、ソース選択と実行ステップの進捗を表示します。</p>
                                    )}
                                    {assessmentProcess && (
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                {assessmentProcess.stepProgress.map((stepItem) => (
                                                        <div
                                                            key={stepItem.stepId}
                                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 flex items-center justify-between gap-3 min-w-0"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-semibold text-gray-900 break-words">{stepItem.purpose}</p>
                                                                <p className="text-[11px] text-gray-500 break-words">{stepItem.message}</p>
                                                            </div>
                                                        <span
                                                            className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                                                                stepItem.status === 'completed'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : stepItem.status === 'skipped'
                                                                        ? 'bg-amber-100 text-amber-700'
                                                                        : 'bg-rose-100 text-rose-700'
                                                            }`}
                                                        >
                                                            {stepItem.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            {assessmentProcess.sourceNotes.length > 0 && (
                                                <div className="rounded-lg border border-gray-200 bg-white p-3 min-w-0">
                                                    <p className="text-[11px] font-semibold text-gray-700 mb-1">データ取り込み状況</p>
                                                    <div className="space-y-1">
                                                        {assessmentProcess.sourceNotes.map((note, index) => (
                                                            <p key={`${note}-${index}`} className="text-[11px] text-gray-600 break-words">
                                                                {note}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {assessmentProcess.fallbackReason && (
                                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                    <p className="text-[11px] font-semibold text-amber-800 mb-1">
                                                        実行モード
                                                    </p>
                                                    <p className="text-[11px] text-amber-700 break-words">
                                                        {assessmentProcess.fallbackReason}
                                                    </p>
                                                </div>
                                            )}
                                            {assessmentProcess.evidencePreview.length > 0 && (
                                                <div className="rounded-lg border border-gray-200 bg-white p-3 min-w-0">
                                                    <p className="text-[11px] font-semibold text-gray-700 mb-1">根拠プレビュー</p>
                                                    <div className="space-y-2">
                                                        {assessmentProcess.evidencePreview.slice(0, 3).map((item) => (
                                                            <div key={`${item.id}-${item.sourceId}`} className="border border-gray-100 rounded-md px-2 py-1 min-w-0">
                                                                <p className="text-[11px] text-gray-700 break-words">{item.excerpt || 'n/a'}</p>
                                                                <p className="text-[10px] text-gray-500 break-all">{item.sourceId}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {assessmentProcess.glmInsights.length > 0 && (
                                                <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 min-w-0">
                                                    <p className="text-[11px] font-semibold text-violet-800 mb-1">
                                                        GLM実証根拠（優先反映）
                                                    </p>
                                                    <div className="space-y-2">
                                                        {assessmentProcess.glmInsights.map((insight) => (
                                                            <div
                                                                key={insight.evidenceId}
                                                                className="rounded-md border border-violet-100 bg-white px-2 py-2 min-w-0"
                                                            >
                                                                <p className="text-[11px] font-semibold text-violet-900 break-words">
                                                                    {insight.summary}
                                                                </p>
                                                                <p className="text-[10px] text-violet-700 mt-1 break-words">
                                                                    {insight.predictor} → {insight.outcome}
                                                                </p>
                                                                <p className="text-[10px] text-violet-600 mt-1">
                                                                    {insight.evidenceId} / B={insight.effect.toFixed(3)}
                                                                    {insight.pValue !== null ? ` / p=${insight.pValue}` : ''}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {assessmentProcess.glmInteractionMeanings.length > 0 && (
                                                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                                                    <p className="text-[11px] font-semibold text-indigo-800 mb-1">
                                                        相互作用モデルの解釈
                                                    </p>
                                                    <div className="space-y-1">
                                                        {assessmentProcess.glmInteractionMeanings.map((item, index) => (
                                                            <p key={`${item}-${index}`} className="text-[11px] text-indigo-700">
                                                                {index + 1}. {item}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {followUpQuestions.length === 0 && (
                                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                            まだタグが選ばれていないため質問がありません。必要なら前のステップでタグを選択してください。
                                        </div>
                                    )}
                                    {followUpQuestions.map((question) => (
                                        <label key={question.key} className="block">
                                            <span className="text-sm font-semibold text-gray-800">{question.label}</span>
                                            <textarea
                                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[110px]"
                                                placeholder={question.placeholder}
                                                value={
                                                    followUpAnswers.find((item) => item.key === question.key)?.value || ''
                                                }
                                                onChange={(event) =>
                                                    updateFollowUp(question.key, question.label, event.target.value)
                                                }
                                            />
                                        </label>
                                    ))}
                                </div>
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">専門家の見立て</p>
                                            <button
                                                type="button"
                                                onClick={generateAssessment}
                                                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                                                disabled={aiLoading}
                                            >
                                                {aiLoading ? '初回生成中...' : refining ? '精密更新中...' : '見立てを生成'}
                                            </button>
                                        </div>
                                        {aiError && (
                                            <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
                                                {aiError}
                                            </div>
                                        )}
                                        {!aiAssessment && !aiError && (
                                            <p className="text-xs text-indigo-900/80">
                                                見立てを生成すると、因果図と要約が表示されます。
                                            </p>
                                        )}
                                        {aiAssessment && (
                                            <div className="space-y-3">
                                                <div className="rounded-xl border border-indigo-200 bg-white p-3">
                                                    <p className="text-xs font-semibold text-indigo-700 mb-2">因果図</p>
                                                    <div className="grid gap-2">
                                                        {[
                                                            { label: '原因（症状像）', items: aiAssessment.cause },
                                                            { label: '影響（活動・参加）', items: aiAssessment.impact },
                                                            { label: '増悪因子（環境・制度）', items: aiAssessment.aggravators },
                                                            { label: '保護因子（希望・資源）', items: aiAssessment.protectors },
                                                        ].map((lane, index) => (
                                                            <div key={lane.label} className="space-y-1">
                                                                <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-2">
                                                                    <p className="text-[11px] font-semibold text-indigo-700">{lane.label}</p>
                                                                    <p className="text-xs text-indigo-900 whitespace-pre-wrap mt-1">
                                                                        {formatList(lane.items)}
                                                                    </p>
                                                                </div>
                                                                {index < 3 && (
                                                                    <div className="flex justify-center text-indigo-300 leading-none text-sm">↓</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-indigo-900 leading-relaxed bg-white border border-indigo-200 rounded-xl p-3">
                                                    {aiAssessment.causal_summary}
                                                </p>
                                                {aiAssessment.citations.length > 0 && (
                                                    <div className="rounded-xl border border-indigo-200 bg-white p-3">
                                                        <p className="text-xs font-semibold text-indigo-700 mb-2">根拠トレース</p>
                                                        <div className="space-y-2">
                                                            {aiAssessment.citations.map((citation, index) => (
                                                                <div key={`${citation.claim}-${index}`} className="text-xs text-indigo-900">
                                                                    <p className="font-medium">{citation.claim}</p>
                                                                    <p className="text-[11px] text-indigo-600">
                                                                        Evidence: {citation.evidence_ids.join(', ') || 'n/a'}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">配慮候補の検討（優先度スライダー）</p>
                                                <p className="text-xs text-gray-500">
                                                    採用する候補を選び、優先度を調整してください。
                                                </p>
                                            </div>
                                            {!aiAssessment && (
                                                <p className="text-xs text-gray-500">見立てを生成すると候補が表示されます。</p>
                                            )}
                                            {aiAssessment?.accommodations.map((item) => {
                                                const selection = accommodationSelections[item.title] ?? {
                                                    selected: true,
                                                    priority: item.priority,
                                                };
                                                return (
                                                    <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4"
                                                                    checked={selection.selected}
                                                                    onChange={(event) =>
                                                                        updateAccommodationSelection(item.title, {
                                                                            selected: event.target.checked,
                                                                        })
                                                                    }
                                                                />
                                                                {item.title}
                                                            </label>
                                                            <span className="text-xs font-semibold text-indigo-600">
                                                                Priority {selection.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">理由：{item.reason}</p>
                                                        <p className="text-xs text-gray-500 mt-1">例：{item.examples}</p>
                                                        <div className="mt-3">
                                                            <input
                                                                type="range"
                                                                min={1}
                                                                max={3}
                                                                step={1}
                                                                value={selection.priority}
                                                                onChange={(event) =>
                                                                    updateAccommodationSelection(item.title, {
                                                                        priority: Number(event.target.value),
                                                                    })
                                                                }
                                                                className="w-full"
                                                            />
                                                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                                                <span>高</span>
                                                                <span>中</span>
                                                                <span>低</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                                            <label className="block">
                                                <span className="text-sm font-semibold text-gray-800">追加相談（懸念・現実制約・選択理由）</span>
                                                <textarea
                                                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[120px]"
                                                    placeholder="例：繁忙期はタスクの分割が難しい。通院日に連絡が難しい。"
                                                    value={additionalConsultation}
                                                    onChange={(event) => setAdditionalConsultation(event.target.value)}
                                                />
                                            </label>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={generateAssessment}
                                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                                    disabled={aiLoading}
                                                >
                                                    {aiLoading ? '更新中...' : '見立てを更新'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const ok = aiAssessment ? true : await generateAssessment();
                                            if (ok) setStep(4);
                                        }}
                                        className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
                                    >
                                        合意文書を生成
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">4. 合意文書（ドラフト）</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        専門家の見立てと配慮候補を統合したドラフトです。
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-white p-2 inline-flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDraftViewMode('selected')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                            draftViewMode === 'selected'
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        採用候補のみ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDraftViewMode('all')}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                            draftViewMode === 'all'
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        全候補
                                    </button>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[420px]">
                                    {draftText || '（まだドラフトがありません）'}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
                                        disabled={!draftText}
                                    >
                                        {copied ? 'コピーしました' : 'コピー'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        前に戻って修正
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-6 min-w-0">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">現在の整理状況</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            タグと回答をもとに、合意形成の骨格を可視化します。
                        </p>
                        <div className="mt-4 space-y-4">
                            {tagGroups.map((group) => (
                                <div key={group.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                    <p className="text-xs font-semibold text-gray-500">{group.label}</p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        {selectedTags[group.key].length > 0
                                            ? selectedTags[group.key].join('、')
                                            : '（未選択）'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
                            合意文書は「相談内容 + タスク条件 + 症状像 + 環境条件 + 本人の希望」から構成されます。
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-2">合意候補サマリ</h3>
                        <p className="text-sm text-gray-600">
                            Step 3での選択状況を要約します。候補の編集はStep 3内で行います。
                        </p>
                        <div className="mt-4 grid gap-3">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">選択中の配慮候補</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {aiAssessment ? `${selectedAccommodationCount}件` : '-'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">見立てステータス</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {aiAssessment ? '生成済み（更新可能）' : '未生成'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">追加相談メモ</p>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                    {additionalConsultation.trim() || '未入力'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">使用データソース</p>
                                {assessmentProcess ? (
                                    <div className="mt-1 space-y-1">
                                        {assessmentProcess.selectedSources.map((source) => (
                                            <p key={source.id} className="text-xs text-gray-700">
                                                {source.name} ({source.kind})
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 mt-1">未実行</p>
                                )}
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">プラン警告</p>
                                {assessmentProcess && assessmentProcess.planWarnings.length > 0 ? (
                                    <div className="mt-1 space-y-1">
                                        {assessmentProcess.planWarnings.map((warning, index) => (
                                            <p key={`${warning}-${index}`} className="text-xs text-amber-700">
                                                {warning}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 mt-1">なし</p>
                                )}
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">データ基盤メモ</p>
                                {assessmentProcess && assessmentProcess.sourceNotes.length > 0 ? (
                                    <div className="mt-1 space-y-1">
                                        {assessmentProcess.sourceNotes.map((note, index) => (
                                            <p key={`${note}-${index}`} className="text-xs text-gray-700">
                                                {note}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 mt-1">未実行</p>
                                )}
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">自由記述データ利用状況</p>
                                {assessmentProcess ? (
                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm font-semibold text-gray-900">
                                            ヒット件数: {assessmentProcess.freeTextEvidence.hitCount}
                                        </p>
                                        {assessmentProcess.freeTextEvidence.samples.map((sample, index) => (
                                            <p key={`${sample.filePath}-${index}`} className="text-xs text-gray-700 break-words">
                                                {sample.filePath.split('/').slice(-1)[0]} / score={sample.score.toFixed(3)}
                                            </p>
                                        ))}
                                        {assessmentProcess.freeTextEvidence.hitCount === 0 && (
                                            <p className="text-xs text-gray-700">今回の入力では自由記述への一致なし</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 mt-1">未実行</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
