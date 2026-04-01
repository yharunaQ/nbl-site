import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
} from '@/lib/fchma/intakeDraft';
import { getHealthConditionNormalizationCandidates } from '@/lib/fchma/healthConditionNormalization';
import {
  buildFchmaReasoningBundle,
  type FchmaReasoningBundle,
} from '@/lib/fchma/orchestration';

export type FchmaMinimalSignalPreview = {
  consultation: string;
  inferredPayload: FchmaIntakeDraftPayload;
  intakePreview: ReturnType<typeof buildFchmaIntakeDraftPreview>;
  reasoningBundle: FchmaReasoningBundle;
  extractedSignals: {
    healthConditions: string[];
    workContext: string[];
    difficultyContext: string[];
    supportContext: string[];
    disclosureContext: string[];
    futureContext: string[];
  };
  followupQuestions: string[];
  matchedPatterns?: Array<{
    patternKey: string;
    score: number;
    matchedKeywordGroups: string[];
    matchedHealthConditions: string[];
    causalSummary: string;
    interventionPorts: string[];
    rationale: string;
  }>;
};

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[。！？!?])/))
    .map((line) => line.trim())
    .filter(Boolean);
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function pickSignalSentences(text: string, keywords: string[], limit = 3): string[] {
  const sentences = splitSentences(text);
  const picked = sentences.filter((sentence) => containsAny(sentence, keywords));
  return dedupe(picked).slice(0, limit);
}

function buildTitle(text: string): string {
  const firstSentence = splitSentences(text)[0] ?? text.trim();
  const compact = firstSentence.replace(/[。！？!?]+$/g, '').trim();
  if (!compact) {
    return 'FCHMA quick intake';
  }
  return compact.length > 36 ? `${compact.slice(0, 36)}…` : compact;
}

function buildPrimaryGoal(signals: FchmaMinimalSignalPreview['extractedSignals']): string {
  if (signals.supportContext.length > 0) {
    return '必要な配慮と職場内調整の整理';
  }
  if (signals.difficultyContext.length > 0 && signals.workContext.length > 0) {
    return '仕事の負荷条件と参加困難の構造整理';
  }
  if (signals.futureContext.length > 0) {
    return '就労継続に向けた見立てと優先順位の整理';
  }
  return '活動・参加上の困難の構造整理';
}

function buildFollowupQuestions(
  signals: FchmaMinimalSignalPreview['extractedSignals'],
): string[] {
  const questions: string[] = [];

  if (signals.healthConditions.length === 0) {
    questions.push('体調変動や診断名として共有してよい範囲はどこまでありますか。');
  }
  if (signals.workContext.length === 0) {
    questions.push('どの業務、時間帯、場面で困りごとが強く出るかを一つだけ特定できますか。');
  }
  if (signals.supportContext.length === 0) {
    questions.push('すでにある配慮や支援、逆に未整備で困っている点はありますか。');
  }
  if (signals.disclosureContext.length === 0) {
    questions.push('上司、人事、支援者など、誰に何をどこまで伝えられているかを確認したいです。');
  }
  if (signals.futureContext.length === 0) {
    questions.push('まず守りたいことは、働き続けることか、負荷を下げることか、相談経路を整えることかのどれですか。');
  }

  return questions.slice(0, 4);
}

export function buildFchmaMinimalIntakePayload(consultation: string): FchmaIntakeDraftPayload {
  const text = consultation.trim();
  const healthConditions = dedupe(
    getHealthConditionNormalizationCandidates(text, 6).map((candidate) => candidate.preferredLabelSeed),
  ).slice(0, 3);
  const workContext = pickSignalSentences(text, [
    '仕事',
    '勤務',
    '職場',
    '上司',
    '人事',
    '会議',
    '通勤',
    '在宅',
    'シフト',
    '残業',
    '業務',
    '復職',
    '休職',
  ]);
  const difficultyContext = pickSignalSentences(text, [
    '困',
    '疲',
    '痛',
    '不安',
    '難',
    'しんど',
    'ミス',
    '負荷',
    '集中',
    '眠',
    '体調',
    '悪化',
    '切れ',
  ]);
  const supportContext = pickSignalSentences(text, [
    '配慮',
    '支援',
    '調整',
    '相談',
    '未整備',
    '不足',
    'なし',
    '上司',
    '人事',
    'ジョブコーチ',
  ]);
  const disclosureContext = pickSignalSentences(text, [
    '説明',
    '開示',
    '共有',
    '伝え',
    '言え',
    '知られ',
    '相談',
  ]);
  const futureContext = pickSignalSentences(text, [
    '今後',
    '続けたい',
    '辞め',
    '希望',
    '将来',
    '不安',
    '守りたい',
    '続ける',
  ]);

  const extractedSignals: FchmaMinimalSignalPreview['extractedSignals'] = {
    healthConditions,
    workContext,
    difficultyContext,
    supportContext,
    disclosureContext,
    futureContext,
  };

  return {
    title: buildTitle(text),
    primaryGoal: buildPrimaryGoal(extractedSignals),
    respondentProfile: '',
    healthCondition: healthConditions.join('、'),
    workStatus: workContext.join('\n'),
    difficulty: (difficultyContext.length > 0 ? difficultyContext : splitSentences(text).slice(0, 3)).join('\n'),
    supportAndAccommodation: supportContext.join('\n'),
    disclosure: disclosureContext.join('\n'),
    futureOutlook: futureContext.join('\n'),
    narratives: text,
    inputType: 'intake_form',
  };
}

export function buildFchmaMinimalSignalPreview(
  consultation: string,
): FchmaMinimalSignalPreview {
  const inferredPayload = buildFchmaMinimalIntakePayload(consultation);
  const intakePreview = buildFchmaIntakeDraftPreview(inferredPayload);
  const reasoningBundle = buildFchmaReasoningBundle(inferredPayload);
  const extractedSignals = {
    healthConditions: dedupe(
      getHealthConditionNormalizationCandidates(consultation, 6).map(
        (candidate) => candidate.preferredLabelSeed,
      ),
    ).slice(0, 3),
    workContext: pickSignalSentences(inferredPayload.narratives, [
      '仕事',
      '勤務',
      '職場',
      '上司',
      '人事',
      '会議',
      '通勤',
      '在宅',
      'シフト',
      '残業',
      '業務',
      '復職',
      '休職',
    ]),
    difficultyContext: pickSignalSentences(inferredPayload.narratives, [
      '困',
      '疲',
      '痛',
      '不安',
      '難',
      'しんど',
      'ミス',
      '負荷',
      '集中',
      '眠',
      '体調',
      '悪化',
      '切れ',
    ]),
    supportContext: pickSignalSentences(inferredPayload.narratives, [
      '配慮',
      '支援',
      '調整',
      '相談',
      '未整備',
      '不足',
      'なし',
      '上司',
      '人事',
      'ジョブコーチ',
    ]),
    disclosureContext: pickSignalSentences(inferredPayload.narratives, [
      '説明',
      '開示',
      '共有',
      '伝え',
      '言え',
      '知られ',
      '相談',
    ]),
    futureContext: pickSignalSentences(inferredPayload.narratives, [
      '今後',
      '続けたい',
      '辞め',
      '希望',
      '将来',
      '不安',
      '守りたい',
      '続ける',
    ]),
  };

  return {
    consultation: consultation.trim(),
    inferredPayload,
    intakePreview,
    reasoningBundle,
    extractedSignals,
    followupQuestions: buildFollowupQuestions(extractedSignals),
  };
}
