type TagGroupKey = 'task' | 'symptom' | 'environment' | 'preference';

export type GlmInput = {
    consultation: string;
    additionalConsultation?: string;
    selectedTags: Record<TagGroupKey, string[]>;
    followUpAnswers: Array<{ value: string }>;
};

export type GlmEvidence = {
    id: string;
    sheet: string;
    predictor: string;
    outcome: string;
    p: number | null;
    b: number;
    direction: 'up' | 'down';
    summary: string;
    actionTitles: string[];
    keywords: string[];
};

export type GlmInsight = {
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
};

export type GlmInsightResult = {
    topInsights: GlmInsight[];
    recommendedActions: string[];
};

export const GLM_INTERACTION_MEANINGS = [
    '就労困難性発生: 病気や機能障害の影響に加え、仕事内容・職場配慮・本人特性/スキルで問題発生状況が変わる。',
    '就労困難性（解決可能性）: 病気や機能障害で解決難易度は上がるが、仕事内容・職場配慮・支援活用・本人特性/スキルで改善可能性が変わる。',
    '症状への職場影響: 症状悪化は疾患特性だけでなく、職場環境・仕事内容・働き方の影響を強く受ける。',
    '必要支援の形成: 本人が必要と感じる配慮/支援は、病気特性・就労困難の経験・本人特性の相互作用で決まる。',
];

const GLM_EVIDENCE: GlmEvidence[] = [
    {
        id: 'GLM-S1-001',
        sheet: '1 就労困難性発生',
        predictor: '就業継続[問題発生]仕事内容や働き方が体調管理の点で無理があり働きにくい',
        outcome: '就労困難性の発生',
        p: 0,
        b: -0.222,
        direction: 'down',
        summary: '仕事内容が体調管理と不整合だと、就労困難の発生リスクが高まりやすい。',
        actionTitles: ['タスクの分割と優先順位の明確化', '業務負荷の平準化'],
        keywords: ['仕事内容', '働き方', '体調', '無理', '業務', '負荷'],
    },
    {
        id: 'GLM-S1-002',
        sheet: '1 就労困難性発生',
        predictor: '職業準備[問題発生]難病で仕事を辞めて以来、再就職の意欲がなくなる',
        outcome: '就労困難性の発生',
        p: 0.001,
        b: 0.393,
        direction: 'up',
        summary: '離職後の意欲低下が強いケースでは、就労困難の固定化リスクが高い。',
        actionTitles: ['本人の裁量を保ちながら段階調整', 'タスク二重化・代替担当の合意'],
        keywords: ['離職', '再就職', '意欲', '配置', '長期'],
    },
    {
        id: 'GLM-S3-001',
        sheet: '3 難病の症状に影響する仕事や職場の状況',
        predictor: '機能障害等：全身的な疲れやすさや体調変動',
        outcome: '症状悪化・生活上支障',
        p: 0.002,
        b: -0.3,
        direction: 'down',
        summary: '疲労と体調変動が強い層では、職場条件により症状支障が増えやすい。',
        actionTitles: ['休憩導線とリズム設計', '業務負荷の平準化'],
        keywords: ['疲労', '倦怠', '体調変動', '午後', '波'],
    },
    {
        id: 'GLM-S3-002',
        sheet: '3 難病の症状に影響する仕事や職場の状況',
        predictor: '機能障害等：活力ややる気、集中力の低下',
        outcome: '症状悪化・生活上支障',
        p: 0,
        b: -0.36,
        direction: 'down',
        summary: '集中力の低下は、職場調整不足時に就労困難の増悪に繋がりやすい。',
        actionTitles: ['会議を短時間化して事前資料を共有', 'タスクの分割と優先順位の明確化'],
        keywords: ['集中', 'やる気', '認知', '会議', '読解', '資料'],
    },
    {
        id: 'GLM-S1-003',
        sheet: '1 就労困難性発生',
        predictor: '就業継続[問題発生]自己管理（休憩・服薬・トイレ・食事）に限界',
        outcome: '就労困難性の発生',
        p: 0.001,
        b: 0.177,
        direction: 'up',
        summary: '自己管理が困難な状況では、就労困難性が上がりやすい。',
        actionTitles: ['休憩導線とリズム設計', '通院・治療スケジュールへの配慮'],
        keywords: ['自己管理', '休憩', '服薬', 'トイレ', '食事'],
    },
    {
        id: 'GLM-S2-001',
        sheet: '2 就労困難性（解決可能性）',
        predictor: '就業継続[現状問題]仕事内容や働き方が体調管理の点で無理',
        outcome: '解決可能性の低下',
        p: 0.009,
        b: -0.194,
        direction: 'down',
        summary: '業務設計が体調管理に適合しないほど、問題解決の見通しが悪化しやすい。',
        actionTitles: ['タスクの分割と優先順位の明確化', '業務負荷の平準化'],
        keywords: ['現状問題', '仕事内容', '働き方', '体調管理', '無理'],
    },
    {
        id: 'GLM-S4-001',
        sheet: '4 必要な配慮・理解・支援に関わる要因',
        predictor: '必要理解：治療と両立して無理なく働くため',
        outcome: '支援ニーズ上昇',
        p: 0.002,
        b: 0.232,
        direction: 'up',
        summary: '治療と就労の両立理解が必要なケースでは、制度支援・社内調整の重要性が高い。',
        actionTitles: ['通院・治療スケジュールへの配慮', '本人の裁量を保ちながら段階調整'],
        keywords: ['理解', '配慮', '支援', '治療', '両立'],
    },
    {
        id: 'GLM-S2-002',
        sheet: '2 就労困難性（解決可能性）',
        predictor: '支援利用：一般求人を含む職業紹介・あっせん',
        outcome: '解決可能性の改善',
        p: 0.003,
        b: -0.798,
        direction: 'down',
        summary: '適切な支援活用は、解決困難を低減し改善可能性を高める。',
        actionTitles: ['本人の裁量を保ちながら段階調整', '情報をスローダウンして共有'],
        keywords: ['支援', '職業紹介', 'あっせん', '相談', '再就職'],
    },
    {
        id: 'GLM-S4-002',
        sheet: '4 必要な配慮・理解・支援に関わる要因',
        predictor: '必要支援：職場の設備改善・支援機器・テレワーク',
        outcome: '必要配慮ニーズ上昇',
        p: 0.004,
        b: 0.0362,
        direction: 'up',
        summary: '設備・運用改善ニーズが高いほど、実務上の合理的配慮設計が重要になる。',
        actionTitles: ['静音・視覚刺激を抑えた環境へ', '通勤負荷の軽減'],
        keywords: ['設備', '支援機器', 'テレワーク', '在宅', '環境'],
    },
    {
        id: 'GLM-S3-003',
        sheet: '3 難病の症状に影響する仕事や職場の状況',
        predictor: '機能障害等：精神や心理面の症状や障害',
        outcome: '症状悪化・生活上支障',
        p: 0,
        b: -0.404,
        direction: 'down',
        summary: '心理的負荷が高い場合、職場環境要因の調整有無が影響しやすい。',
        actionTitles: ['コミュニケーションの非同期化', '静音・視覚刺激を抑えた環境へ'],
        keywords: ['不安', '緊張', 'メンタル', '心理', 'ストレス'],
    },
];

function buildCorpus(input: GlmInput): string {
    const joinedTags = Object.values(input.selectedTags || {})
        .flat()
        .join(' ');
    const followUps = (input.followUpAnswers || []).map((item) => item.value).join(' ');
    return [input.consultation, input.additionalConsultation || '', joinedTags, followUps]
        .join(' ')
        .toLowerCase();
}

function confidenceByPValue(p: number | null): 'high' | 'medium' {
    if (p !== null && p <= 0.01) return 'high';
    return 'medium';
}

export function buildGlmInsights(input: GlmInput): GlmInsightResult {
    const corpus = buildCorpus(input);

    const scored = GLM_EVIDENCE.map((row) => {
        const matchedKeywords = row.keywords.filter((keyword) => corpus.includes(keyword.toLowerCase()));
        const keywordScore = matchedKeywords.length * 0.3;
        const effectScore = Math.min(Math.abs(row.b), 1.2);
        const pScore = row.p !== null && row.p <= 0.01 ? 0.3 : 0.1;
        const score = effectScore + keywordScore + pScore;
        return { row, matchedKeywords, score };
    })
        .filter((item) => item.matchedKeywords.length > 0)
        .sort((a, b) => b.score - a.score);

    const topInsights: GlmInsight[] = scored.slice(0, 5).map(({ row, matchedKeywords }) => ({
        evidenceId: row.id,
        sheet: row.sheet,
        summary: row.summary,
        predictor: row.predictor,
        outcome: row.outcome,
        effect: row.b,
        pValue: row.p,
        confidence: confidenceByPValue(row.p),
        matchedKeywords,
        actionTitles: row.actionTitles,
    }));

    const recommendedActions = Array.from(
        new Set(topInsights.flatMap((item) => item.actionTitles)),
    ).slice(0, 6);

    return { topInsights, recommendedActions };
}
