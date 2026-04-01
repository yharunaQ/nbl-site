import type { Step4OutputModel } from '@/lib/jac/step4OutputModel';

export type Step4SourceUsageSummary = {
  key: string;
  sourceName: string;
  sourceUrl: string | null;
  roles: string[];
  usedParts: string[];
};

type BuildSourceUsageOptions = {
  includePracticalReferenceItems?: boolean;
};

function normalizeText(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeLookup(value: unknown): string {
  return normalizeText(value).toLowerCase();
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

function roleWeight(role: string): number {
  if (role === '根拠') return 0;
  if (role === '対話の軸' || role === '試行候補' || role === '見直しの軸') return 1;
  if (role === '具体策ヒント') return 2;
  if (role === '補助資料') return 3;
  return 4;
}

function mergeSummary(
  map: Map<string, Step4SourceUsageSummary>,
  sourceName: string,
  sourceUrl: string | null | undefined,
  role: string,
  usedPart: string,
) {
  const normalizedName = normalizeText(sourceName) || '出典未整理';
  const normalizedUrl = normalizeText(sourceUrl || '') || null;
  const key = normalizeLookup(normalizedName);
  const current = map.get(key);

  map.set(key, {
    key,
    sourceName: current?.sourceName || normalizedName,
    sourceUrl: current?.sourceUrl || normalizedUrl,
    roles: uniqueStrings([...(current?.roles || []), role]),
    usedParts: uniqueStrings([...(current?.usedParts || []), usedPart]).slice(0, 4),
  });
}

export function buildStep4SourceUsageSummaries(
  step4Output: Step4OutputModel,
  options?: BuildSourceUsageOptions,
): Step4SourceUsageSummary[] {
  const includePracticalReferenceItems = options?.includePracticalReferenceItems !== false;
  const bySource = new Map<string, Step4SourceUsageSummary>();

  for (const item of step4Output.basisItems || []) {
    const sourceNames = item.sourceNames.length > 0 ? item.sourceNames : ['出典未整理'];
    sourceNames.forEach((sourceName, index) => {
      mergeSummary(bySource, sourceName, item.sourceUrls[index] || item.sourceUrls[0], '根拠', item.title);
    });
  }

  for (const group of step4Output.implementationKnowledgeItems || []) {
    for (const section of group.sections || []) {
      for (const item of section.items || []) {
        mergeSummary(
          bySource,
          item.sourceName,
          item.sourceUrl,
          section.usageFocusLabel,
          `${group.accommodationTitle}: ${item.title}`,
        );
      }
    }
  }

  if (includePracticalReferenceItems) {
    for (const item of step4Output.practicalReferenceItems || []) {
      mergeSummary(bySource, item.sourceName, item.sourceUrl, '具体策ヒント', item.title);
    }
  }

  for (const item of step4Output.supplementalReferenceItems || []) {
    const sourceNames = item.sourceNames.length > 0 ? item.sourceNames : ['出典未整理'];
    sourceNames.forEach((sourceName, index) => {
      mergeSummary(bySource, sourceName, item.sourceUrls[index] || item.sourceUrls[0], '補助資料', item.title);
    });
  }

  return [...bySource.values()].sort((a, b) => {
    const weightA = Math.min(...a.roles.map(roleWeight));
    const weightB = Math.min(...b.roles.map(roleWeight));
    if (weightA !== weightB) return weightA - weightB;
    if (b.roles.length !== a.roles.length) return b.roles.length - a.roles.length;
    return a.sourceName.localeCompare(b.sourceName, 'ja');
  });
}
