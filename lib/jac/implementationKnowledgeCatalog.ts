import {
  buildPracticalReferencePreview,
  type PracticalReferenceContext,
  type PracticalReferencePreviewItem,
  type PracticalReferenceUseMode,
} from '@/lib/jac/practicalReferenceCatalog';
import type { EvidenceItem } from '@/lib/knowledge/agenticExecutor';

type AssessmentAccommodation = {
  title: string;
  reason?: string;
  examples?: string;
  priority?: number;
};

export type ImplementationKnowledgeSection = {
  usageFocus: PracticalReferenceUseMode;
  usageFocusLabel: string;
  items: PracticalReferencePreviewItem[];
};

export type ImplementationKnowledgeItem = {
  id: string;
  accommodationTitle: string;
  summary: string;
  reason: string | null;
  examples: string | null;
  sections: ImplementationKnowledgeSection[];
};

export type ImplementationKnowledgeCatalogInput = {
  accommodations?: AssessmentAccommodation[] | null;
  evidence: EvidenceItem[];
  practicalContext?: PracticalReferenceContext;
  maxAccommodations?: number;
  maxItemsPerAccommodation?: number;
};

const USAGE_FOCUS_ORDER: PracticalReferenceUseMode[] = ['dialogue', 'trial', 'review'];
const USAGE_FOCUS_SUMMARY_LABEL: Record<PracticalReferenceUseMode, string> = {
  dialogue: '確認',
  trial: '試行',
  review: '見直し',
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

function normalizeLookup(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

function toCatalogId(title: string): string {
  return normalizeLookup(title).replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, '-');
}

function selectAccommodationSeeds(
  accommodations: AssessmentAccommodation[],
  selectedTitles: string[],
  maxItems: number,
): AssessmentAccommodation[] {
  const sorted = [...(accommodations || [])]
    .filter((item) => normalizeText(item.title))
    .sort((a, b) => Number(a.priority || 99) - Number(b.priority || 99));
  const selectedLookup = new Set(selectedTitles.map((title) => normalizeLookup(title)).filter(Boolean));

  if (selectedLookup.size === 0) {
    return sorted.slice(0, maxItems);
  }

  const matched = sorted.filter((item) => selectedLookup.has(normalizeLookup(item.title)));
  const missing = selectedTitles
    .filter((title) => !matched.some((item) => normalizeLookup(item.title) === normalizeLookup(title)))
    .map((title, index) => ({
      title,
      priority: 100 + index,
    }));

  return [...matched, ...missing].slice(0, maxItems);
}

function buildAccommodationContext(
  accommodation: AssessmentAccommodation,
  baseContext?: PracticalReferenceContext,
): PracticalReferenceContext {
  const statement = uniqueStrings([
    accommodation.title,
    accommodation.reason,
    accommodation.examples,
  ]).join(' / ');

  return {
    consultationText: baseContext?.consultationText,
    additionalConsultation: baseContext?.additionalConsultation,
    selectedTags: baseContext?.selectedTags || [],
    followUpAnswers: baseContext?.followUpAnswers || [],
    selectedAccommodationTitles: uniqueStrings([accommodation.title]),
    selectedAccommodationStatements: statement ? [statement] : [],
  };
}

function selectStageDiverseItems(
  items: PracticalReferencePreviewItem[],
  maxItems: number,
): PracticalReferencePreviewItem[] {
  const selected: PracticalReferencePreviewItem[] = [];
  const selectedKeys = new Set<string>();
  const usedSources = new Set<string>();
  const sourceCounts = new Map<string, number>();
  const distinctSourceTarget = Math.min(
    maxItems,
    3,
    new Set(items.map((item) => normalizeLookup(item.sourceId)).filter(Boolean)).size,
  );

  const push = (item: PracticalReferencePreviewItem) => {
    const key = normalizeText(item.sourceUrl || item.id || item.title);
    if (!key || selectedKeys.has(key) || selected.length >= maxItems) return;
    const sourceKey = normalizeLookup(item.sourceId);
    selected.push(item);
    selectedKeys.add(key);
    usedSources.add(sourceKey);
    sourceCounts.set(sourceKey, Number(sourceCounts.get(sourceKey) || 0) + 1);
  };

  for (const mode of USAGE_FOCUS_ORDER) {
    const item =
      items.find(
        (candidate) =>
          candidate.usageFocus === mode && !usedSources.has(normalizeLookup(candidate.sourceId)),
      ) || items.find((candidate) => candidate.usageFocus === mode);
    if (item) push(item);
  }

  for (const item of items) {
    if (selected.length >= maxItems || usedSources.size >= distinctSourceTarget) break;
    const sourceKey = normalizeLookup(item.sourceId);
    if (!sourceKey || usedSources.has(sourceKey)) continue;
    push(item);
  }

  for (const item of items) {
    if (selected.length >= maxItems) break;
    const sourceKey = normalizeLookup(item.sourceId);
    if (!sourceKey || usedSources.has(sourceKey)) continue;
    push(item);
  }

  for (const item of items) {
    if (selected.length >= maxItems) break;
    const sourceKey = normalizeLookup(item.sourceId);
    if (Number(sourceCounts.get(sourceKey) || 0) >= 2) continue;
    push(item);
  }

  return selected;
}

function formatStageSummary(sections: ImplementationKnowledgeSection[]): string {
  const labels = sections.map((section) => USAGE_FOCUS_SUMMARY_LABEL[section.usageFocus]);
  if (labels.length === 0) return '実施';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]}と${labels[1]}`;
  return `${labels[0]}・${labels[1]}・${labels[2]}`;
}

function buildImplementationSummary(
  accommodation: AssessmentAccommodation,
  sections: ImplementationKnowledgeSection[],
): string {
  const title = normalizeText(accommodation.title) || 'この配慮候補';
  const stageSummary = formatStageSummary(sections);
  const reason = normalizeText(accommodation.reason);
  const sourceCount = new Set(
    sections.flatMap((section) => section.items.map((item) => normalizeLookup(item.sourceId))),
  ).size;
  const sourceNote = sourceCount > 1 ? ` ${sourceCount}つの source family を優先して束ねています。` : '';

  if (reason) {
    return `${reason}という目的で、「${title}」を実施する際の${stageSummary}に使える資料を束ねました。${sourceNote}`.trim();
  }

  return `「${title}」を実施する際の${stageSummary}に使える資料を束ねました。${sourceNote}`.trim();
}

function toSections(items: PracticalReferencePreviewItem[]): ImplementationKnowledgeSection[] {
  return USAGE_FOCUS_ORDER.map((usageFocus) => {
    const matchedItems = items.filter((item) => item.usageFocus === usageFocus);
    if (matchedItems.length === 0) return null;

    return {
      usageFocus,
      usageFocusLabel: matchedItems[0].usageFocusLabel,
      items: matchedItems,
    } satisfies ImplementationKnowledgeSection;
  }).filter((item): item is ImplementationKnowledgeSection => Boolean(item));
}

export async function buildImplementationKnowledgeCatalog(
  input: ImplementationKnowledgeCatalogInput,
): Promise<ImplementationKnowledgeItem[]> {
  const maxAccommodations = Math.max(1, Number(input.maxAccommodations || 3));
  const maxItemsPerAccommodation = Math.max(1, Number(input.maxItemsPerAccommodation || 4));
  const selectedAccommodationTitles = uniqueStrings(
    input.practicalContext?.selectedAccommodationTitles || [],
  );
  const accommodationSeeds = selectAccommodationSeeds(
    Array.isArray(input.accommodations) ? input.accommodations : [],
    selectedAccommodationTitles,
    maxAccommodations,
  );

  const catalogItems: ImplementationKnowledgeItem[] = [];

  for (const accommodation of accommodationSeeds) {
    const preview = await buildPracticalReferencePreview(
      input.evidence || [],
      Math.max(8, maxItemsPerAccommodation * 2),
      buildAccommodationContext(accommodation, input.practicalContext),
    ).catch(() => []);

    const selectedItems = selectStageDiverseItems(preview, maxItemsPerAccommodation);
    const sections = toSections(selectedItems);
    if (sections.length === 0) continue;

    catalogItems.push({
      id: toCatalogId(accommodation.title) || `implementation-${catalogItems.length + 1}`,
      accommodationTitle: normalizeText(accommodation.title) || '未命名の配慮候補',
      summary: buildImplementationSummary(accommodation, sections),
      reason: normalizeText(accommodation.reason) || null,
      examples: normalizeText(accommodation.examples) || null,
      sections,
    });
  }

  return catalogItems;
}

export function flattenImplementationKnowledgeCatalog(
  items: ImplementationKnowledgeItem[],
  maxItems = 6,
): PracticalReferencePreviewItem[] {
  const merged = new Map<
    string,
    {
      order: number;
      item: PracticalReferencePreviewItem;
    }
  >();
  let order = 0;

  for (const group of items || []) {
    for (const section of group.sections || []) {
      for (const item of section.items || []) {
        const key = [
          normalizeLookup(item.sourceId),
          normalizeLookup(item.title),
          normalizeLookup(item.usageFocus),
        ].join('::');
        if (!key) continue;

        const linkedAccommodationTitles = uniqueStrings([
          ...(merged.get(key)?.item.linkedAccommodationTitles || []),
          ...(item.linkedAccommodationTitles || []),
          group.accommodationTitle,
        ]);

        if (!merged.has(key)) {
          merged.set(key, {
            order: order++,
            item: {
              ...item,
              linkedAccommodationTitles,
            },
          });
          continue;
        }

        const current = merged.get(key);
        if (!current) continue;
        current.item = {
          ...current.item,
          linkedAccommodationTitles,
        };
        merged.set(key, current);
      }
    }
  }

  return [...merged.values()]
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.item)
    .slice(0, maxItems);
}
