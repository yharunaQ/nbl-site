import type { Step4OutputModel } from '@/lib/jac/step4OutputModel';
import type { Step4SourceUsageSummary } from '@/lib/jac/step4SourceUsage';

export type Step4HolisticJudgmentSignal = {
  label: string;
  value: string;
};

export type Step4HolisticJudgment = {
  summary: string;
  materialSignals: Step4HolisticJudgmentSignal[];
  keyPoints: string[];
  stableBasisNote: string;
};

type BuildStep4HolisticJudgmentInput = {
  causalSummary?: string | null;
  followUpAnswerCount?: number;
  glmInsightCount?: number;
  sourceUsageSummaries?: Step4SourceUsageSummary[];
  step4Output: Step4OutputModel;
};

function normalizeText(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeText(value))
        .filter(Boolean),
    ),
  );
}

function buildSummary(input: BuildStep4HolisticJudgmentInput): string {
  const basisCount = input.step4Output.basisItems.length;
  const implementationCount = input.step4Output.implementationKnowledgeItems.length;
  const sourceCount = (input.sourceUsageSummaries || []).length;
  const base =
    'この見立ては、1件の決定的根拠に依らず、相談文・追加確認・既存知見・実施資料を総合して組み立てています。';
  const causalSummary = normalizeText(input.causalSummary);

  if (causalSummary) {
    return `${causalSummary} ${base}`;
  }

  if (basisCount > 0 || implementationCount > 0 || sourceCount > 0) {
    return `${base} 今回は安定根拠 ${basisCount} 件、実施資料 ${implementationCount} 件、表示反映ソース ${sourceCount} 件を主に使っています。`;
  }

  return base;
}

function buildMaterialSignals(input: BuildStep4HolisticJudgmentInput): Step4HolisticJudgmentSignal[] {
  const signals: Step4HolisticJudgmentSignal[] = [];

  signals.push({ label: '相談文', value: '主情報' });

  if (Number(input.followUpAnswerCount || 0) > 0) {
    signals.push({ label: '追加確認', value: `${Number(input.followUpAnswerCount || 0)}件` });
  }

  if (Number(input.glmInsightCount || 0) > 0) {
    signals.push({ label: '統計知見', value: `${Number(input.glmInsightCount || 0)}件` });
  }

  signals.push({
    label: '安定根拠',
    value: `${input.step4Output.basisItems.length}件`,
  });

  if (input.step4Output.implementationKnowledgeItems.length > 0) {
    signals.push({
      label: '実施資料',
      value: `${input.step4Output.implementationKnowledgeItems.length}件`,
    });
  } else if (input.step4Output.practicalReferenceItems.length > 0) {
    signals.push({
      label: '参考資料',
      value: `${input.step4Output.practicalReferenceItems.length}件`,
    });
  }

  if ((input.sourceUsageSummaries || []).length > 0) {
    signals.push({
      label: 'source family',
      value: `${(input.sourceUsageSummaries || []).length}系統`,
    });
  }

  return signals;
}

function buildKeyPoints(input: BuildStep4HolisticJudgmentInput): string[] {
  const keyPoints = uniqueStrings([
    normalizeText(input.causalSummary),
    ...input.step4Output.basisItems
      .slice(0, 2)
      .map((item) => (item.title ? `安定根拠: ${item.title}` : '')),
    ...input.step4Output.implementationKnowledgeItems.slice(0, 2).map((item) => {
      const sectionLabels = uniqueStrings(item.sections.map((section) => section.usageFocusLabel));
      if (sectionLabels.length === 0) return '';
      return `${item.accommodationTitle}: ${sectionLabels.join('・')}に使う資料を参照`;
    }),
    ...((input.sourceUsageSummaries || []).slice(0, 2).map((item) => {
      if (item.usedParts.length === 0) return '';
      return `${item.sourceName}: ${item.usedParts[0]}`;
    }) || []),
  ]);

  return keyPoints.slice(0, 4);
}

function buildStableBasisNote(input: BuildStep4HolisticJudgmentInput): string {
  const basisCount = input.step4Output.basisItems.length;
  const implementationCount = input.step4Output.implementationKnowledgeItems.length;

  if (basisCount >= 2) {
    return `今回は ${basisCount} 件の安定根拠を、総合判断の中核として表示しています。`;
  }

  if (basisCount === 1) {
    return '安定根拠カードはまだ少数ですが、相談文・追加確認・実施資料を合わせて見立てを支えています。';
  }

  if (implementationCount > 0) {
    return '安定根拠カードはまだ少ないものの、見立て自体は相談文、追加確認、実施資料、既存知見の総合判断で組み立てています。';
  }

  return '安定根拠カードはまだ少ないため、場面・頻度・既試行・運用条件が補強されると、ここに直接根拠として上がりやすくなります。';
}

export function buildStep4HolisticJudgment(
  input: BuildStep4HolisticJudgmentInput,
): Step4HolisticJudgment {
  return {
    summary: buildSummary(input),
    materialSignals: buildMaterialSignals(input),
    keyPoints: buildKeyPoints(input),
    stableBasisNote: buildStableBasisNote(input),
  };
}
