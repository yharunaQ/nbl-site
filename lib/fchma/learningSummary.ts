import type { FchmaCaseRecord } from '@/lib/fchma/caseRepository';
import type { FchmaFeedbackRecord } from '@/lib/fchma/caseStore';

export type FchmaFeedbackOutcomeLabel =
  | 'improved'
  | 'partially_improved'
  | 'not_improved'
  | 'not_implemented'
  | 'insufficient_data';

export type FchmaLearningCountEntry = {
  label: string;
  count: number;
};

export type FchmaLearningInterventionEntry = {
  title: string;
  interventionType: string;
  ownerRole: string;
  selectedCount: number;
  implementedCount: number;
  improvedCount: number;
  partiallyImprovedCount: number;
  notImprovedCount: number;
  notImplementedCount: number;
};

export type FchmaLearningSummary = {
  totalCases: number;
  reviewedCases: number;
  plannedCases: number;
  followupCases: number;
  feedbackCases: number;
  feedbackRecordCount: number;
  implementedFeedbackCount: number;
  needsFollowupCount: number;
  sourceCounts: FchmaLearningCountEntry[];
  datasetCounts: FchmaLearningCountEntry[];
  topHypotheses: FchmaLearningCountEntry[];
  topInterventions: FchmaLearningInterventionEntry[];
  updatedStructureSignals: FchmaLearningCountEntry[];
};

function sortCountEntries(entries: Map<string, number>, limit: number): FchmaLearningCountEntry[] {
  return Array.from(entries.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return left.label.localeCompare(right.label, 'ja');
    })
    .slice(0, limit);
}

function classifyFeedbackOutcome(feedback: FchmaFeedbackRecord): FchmaFeedbackOutcomeLabel {
  if (!feedback.implemented) {
    return 'not_implemented';
  }

  const observed = feedback.observedEffect.trim();
  const unresolved = feedback.unresolvedIssues.trim();

  if (observed && !unresolved) {
    return 'improved';
  }
  if (observed && unresolved) {
    return 'partially_improved';
  }
  if (!observed && unresolved) {
    return 'not_improved';
  }

  return 'insufficient_data';
}

function summarizeUpdatedStructureNotes(cases: FchmaCaseRecord[]): FchmaLearningCountEntry[] {
  const keywordCounts = new Map<string, number>();
  const keywords = [
    '再確認',
    '午後',
    '通勤',
    '配慮',
    '上司',
    '業務密度',
    '連携',
    '外部支援',
    '勤務時間',
    '説明',
  ];

  for (const caseRecord of cases) {
    for (const feedback of caseRecord.feedbackRecords) {
      const note = feedback.updatedStructureNotes.trim();
      if (!note) {
        continue;
      }
      for (const keyword of keywords) {
        if (note.includes(keyword)) {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1);
        }
      }
    }
  }

  return sortCountEntries(keywordCounts, 8);
}

export function buildFchmaLearningSummary(cases: FchmaCaseRecord[]): FchmaLearningSummary {
  const sourceCounts = new Map<string, number>();
  const datasetCounts = new Map<string, number>();
  const hypothesisCounts = new Map<string, number>();
  const interventionCounts = new Map<
    string,
    {
      title: string;
      interventionType: string;
      ownerRole: string;
      selectedCount: number;
      implementedCount: number;
      improvedCount: number;
      partiallyImprovedCount: number;
      notImprovedCount: number;
      notImplementedCount: number;
    }
  >();

  let reviewedCases = 0;
  let plannedCases = 0;
  let followupCases = 0;
  let feedbackCases = 0;
  let feedbackRecordCount = 0;
  let implementedFeedbackCount = 0;
  let needsFollowupCount = 0;

  for (const caseRecord of cases) {
    const isSurveyImport = caseRecord.intakePayload.inputType === 'survey_import';
    const sourceLabel = isSurveyImport ? 'survey_import' : 'manual_intake';
    sourceCounts.set(sourceLabel, (sourceCounts.get(sourceLabel) ?? 0) + 1);

    const datasetId = caseRecord.intakePayload.importContext?.datasetId;
    if (datasetId) {
      datasetCounts.set(datasetId, (datasetCounts.get(datasetId) ?? 0) + 1);
    }

    if (caseRecord.review.reviewerDecision !== 'pending') {
      reviewedCases += 1;
    }
    if (caseRecord.status === 'planned') {
      plannedCases += 1;
    }
    if (caseRecord.status === 'in_followup') {
      followupCases += 1;
    }
    if (caseRecord.feedbackRecords.length > 0) {
      feedbackCases += 1;
    }
    if (
      caseRecord.review.selectedInterventions.length > 0 &&
      caseRecord.feedbackRecords.length === 0
    ) {
      needsFollowupCount += 1;
    }

    for (const hypothesis of caseRecord.review.selectedHypotheses) {
      hypothesisCounts.set(hypothesis, (hypothesisCounts.get(hypothesis) ?? 0) + 1);
    }

    for (const interventionTitle of caseRecord.review.selectedInterventions) {
      const preview = caseRecord.interventionPreview.find((item) => item.title === interventionTitle);
      const entry = interventionCounts.get(interventionTitle) ?? {
        title: interventionTitle,
        interventionType: preview?.interventionType ?? 'support_linkage',
        ownerRole: preview?.ownerRole ?? 'case_worker',
        selectedCount: 0,
        implementedCount: 0,
        improvedCount: 0,
        partiallyImprovedCount: 0,
        notImprovedCount: 0,
        notImplementedCount: 0,
      };
      entry.selectedCount += 1;
      interventionCounts.set(interventionTitle, entry);
    }

    for (const feedback of caseRecord.feedbackRecords) {
      feedbackRecordCount += 1;
      if (feedback.implemented) {
        implementedFeedbackCount += 1;
      }

      const preview = caseRecord.interventionPreview.find(
        (item) => item.title === feedback.selectedInterventionTitle,
      );
      const entry = interventionCounts.get(feedback.selectedInterventionTitle) ?? {
        title: feedback.selectedInterventionTitle,
        interventionType: preview?.interventionType ?? 'support_linkage',
        ownerRole: preview?.ownerRole ?? 'case_worker',
        selectedCount: 0,
        implementedCount: 0,
        improvedCount: 0,
        partiallyImprovedCount: 0,
        notImprovedCount: 0,
        notImplementedCount: 0,
      };

      const outcome = classifyFeedbackOutcome(feedback);
      if (feedback.implemented) {
        entry.implementedCount += 1;
      }
      if (outcome === 'improved') {
        entry.improvedCount += 1;
      } else if (outcome === 'partially_improved') {
        entry.partiallyImprovedCount += 1;
      } else if (outcome === 'not_improved') {
        entry.notImprovedCount += 1;
      } else if (outcome === 'not_implemented') {
        entry.notImplementedCount += 1;
      }

      interventionCounts.set(feedback.selectedInterventionTitle, entry);
    }
  }

  const topInterventions = Array.from(interventionCounts.values())
    .sort((left, right) => {
      if (right.selectedCount !== left.selectedCount) {
        return right.selectedCount - left.selectedCount;
      }
      return left.title.localeCompare(right.title, 'ja');
    })
    .slice(0, 6);

  return {
    totalCases: cases.length,
    reviewedCases,
    plannedCases,
    followupCases,
    feedbackCases,
    feedbackRecordCount,
    implementedFeedbackCount,
    needsFollowupCount,
    sourceCounts: sortCountEntries(sourceCounts, 6),
    datasetCounts: sortCountEntries(datasetCounts, 6),
    topHypotheses: sortCountEntries(hypothesisCounts, 6),
    topInterventions,
    updatedStructureSignals: summarizeUpdatedStructureNotes(cases),
  };
}
