import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildPracticalReferencePreview } from '@/lib/jac/practicalReferenceCatalog';
import {
  enrichReferenceCitationsByContext,
  filterReferenceCitationsByUsefulness,
  mergeReferenceCitationsByClaim,
  sortCitationsByContext,
  splitCitationsByPresentation,
} from '@/lib/jac/evidencePresentation';
import { getCitationEvidenceDetails } from '@/lib/knowledge/claimRegistry';
import type { EvidenceItem } from '@/lib/knowledge/agenticExecutor';
import type { KnowledgeClaim } from '@/lib/knowledge/types';
import evalCases from '@/references/jac/eval/step4-representative-cases.json';

type Step4EvalCase = {
  id: string;
  title: string;
  consultation: string;
  additionalConsultation?: string;
  selectedTags: string[];
  followUpAnswers?: string[];
  selectedAccommodationTitles?: string[];
  enabledSourceIds?: string[];
  expectedPreviewKeywords: string[];
  expectedReferenceKeywords: string[];
  minimumPreviewKeywordHits?: number;
  minimumReferenceKeywordHits?: number;
  expectedUsageFocus?: string[];
  expectedPracticeStageLabels?: string[];
};

type EvalCitation = {
  claim: string;
  evidence_ids: string[];
  evidence_details?: Awaited<ReturnType<typeof getCitationEvidenceDetails>>;
};

const CLAIMS_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');
const RECORDS_PATH = path.join(process.cwd(), 'references', 'index', 'normalized-records.jsonl');

const LOW_VALUE_PATTERNS = [
  /add to myjan/i,
  /close jan provides free, confidential technical assistance/i,
  /how to join an event/i,
  /report a problem with this page/i,
  /contact us/i,
  /newsletter/i,
];

const DIRECT_BASIS_BLOCKED_PATTERNS = [
  /add to myjan/i,
  /close jan provides free, confidential technical assistance/i,
  /numerous other accommodation solutions may exist/i,
  /vendors and products please visit vendor site/i,
  /symptoms, causes, diagnosis, treatment, and prevention organizations/i,
];

const RELATED_READING_BLOCKED_PATTERNS = [
  /^getting started\s*\/\s*publications/i,
  /^department of labor(?:’|'|&rsquo;)?s office of disability employment policy/i,
  /^resources to support accessible ict/i,
  /^figure 1: accommodation process diagram/i,
  /^this applies to all workers, including trainees/i,
  /^to address this shortfall, some companies have implemented programs focused on recruiting and hiring neurodivergent people/i,
  /^providing workplace accommodations yields multiple benefits for employers/i,
  /^managing such a workforce requires employers to understand disability-related laws/i,
  /^the employer assistance and resource network on disability \(earn\) is a resource for employers/i,
  /^this page is part of get ready to employ someone for the first time: step by step/i,
  /^we(?:’|'|d|’d)\s+like to set additional cookies to understand how you use gov\.uk/i,
  /^these supports should help them perform job functions efficiently and safely/i,
  /^this may be inaccurately perceived by others as a performance issue/i,
  /^an effective process will also reduce employers(?:['’]|’)? exposure to legal risk/i,
  /^organizations may want to demonstrate that they welcome accommodation requests/i,
  /^represented employees may consult with their union to explore the recourse mechanisms open to them/i,
  /^flexible working time flexible working time\b/i,
  /^learning center employers who want to hire and retain the best talent know the value of creating a workplace that welcomes all workers, including those with disabilities/i,
  /^there(?:['’]|’)s more detail about employers(?:['’]|’)? obligations and how to meet them on the equality and human rights commission website/i,
  /^collective bargaining and social dialogue between employers and trade unions play an important role in negotiating and implementing measures for reasonable accommodation in the workplace for persons with disabilities/i,
  /^we acknowledge all traditional custodians/i,
  /^explore resources for service providers:/i,
  /^how your personal information is protected/i,
  /^save related pages/i,
  /^partnering with the national disability recruitment coordinator/i,
  /^resources find resources to further support employers/i,
  /^see all webinars/i,
  /^the job accommodation network \(jan\) is the leading source of free, expert, and confidential guidance/i,
  /^it(?:['’]|’)s important to focus on the individual/i,
  /^the department(?:['’]|’)s positive measure program applies to employees/i,
  /^"the goal of the government of canada is to have a sustainable workforce/i,
  /^for example, managers are not required to accept substandard performance or unpredictable attendance/i,
  /^this checklist summarizes some of the lessons learned from successful neurodiversity hiring programs/i,
  /^and don(?:['’]|’)t forget to follow earn on facebook/i,
  /^department of labor, nor does mention of trade names, commercial products, or organizations imply endorsement by the u\.s\./i,
  /^start by subscribing to our monthly newsletter and eblasts/i,
  /^federal agencies also engage in self-identification efforts to meet obligations under section 501/i,
  /^the opinions expressed in this document do not necessarily reflect the views or policies of the u\.s\./i,
  /^establishing a network of staff members responsible for implementation/i,
  /^for example, an organization might take a tiered approach to accommodations by:/i,
  /^maintaining effective channels of communication and feedback throughout the process/i,
  /^sample policy\b/i,
  /^23475od000002-01-00 with cornell university and no\./i,
  /^if possible, it is helpful to identify a leader or leaders within your organization/i,
  /^many employees, both neurodivergent workers and others, find that strong encouragement can be helpful/i,
  /^however, these programs also ensure that their managers work within parameters/i,
  /^you can learn more from the job accommodation network \(jan\)/i,
  /^these sessions sometimes focus on employability or soft skills training/i,
  /^furthermore, jan(?:['’]|&rsquo;)?s statistics show that most employers report financial benefits/i,
  /^the ada, rehab act, and other disability-related laws require employers/i,
  /^acing the basics explore the basics/i,
  /^federal regulatory and policy materials/i,
  /^this list is not meant to be exhaustive/i,
  /^job accommodation network \(jan\) jan is the leading source of free, expert, and confidential guidance/i,
  /^for more information, visit the state policy page/i,
  /^supporting apprentice success:/i,
  /^although this checklist is not exhaustive/i,
  /^these include social and communication barriers, understanding job requirements/i,
  /^save your role in work health and safety find out about:/i,
  /^saved items are specific to your device/i,
  /^find out how jobaccess can help/i,
  /^save assistive technology for staff topics covered in this video:/i,
  /^site maintained by the department of social services back to top css updates/i,
  /^save inclusive language tips for employers/i,
  /^save workers compensation find out about:/i,
  /^you will not see items that were saved from a different device or browser/i,
  /^save dealing with discrimination at work find out about:/i,
  /^save making physical workplace adjustments topics covered in this video:/i,
  /^save flexible working arrangements find out about:/i,
  /^save advertising your vacancy find out about:/i,
  /^save share last updated:/i,
  /^they help organisations attract and keep good people, reduce stress, and improve staff confidence and productivity/i,
  /^talking about your disability at work when to talk about your disability at work/i,
  /^under this law: don(?:['’]|’)t treat a person with disability differently/i,
  /^your organisation may also get daaws if an employee becomes disabled during an apprenticeship/i,
  /^to pay for what you need to change/i,
  /^managers are encouraged to consult with their organization(?:['’]|’)s human resources functional specialists/i,
  /^the seven steps to building a disability management program are:/i,
  /^it is essential that you consult with your human resources department early and throughout the process/i,
  /^signs that might indicate that accommodation is needed include:/i,
  /^managers may have a duty to enquire in certain circumstances/i,
  /^disability management is most successful when it promotes respect and cooperation/i,
  /^it is important to ensure that all employees understand performance expectations/i,
  /^human resources and skills development canada is committed to enabling its employees/i,
  /^for support for recovery, important aspects are sick leave and injury-on-duty leave/i,
  /^it is a deliberate and coordinated effort by employers to reduce the occurrence and effect of illness and injury on workforce productivity/i,
  /^for example, for safety reasons, a certain level of vision or the wearing of protective equipment may be a bona fide occupational requirement/i,
  /^non-routine occupational health evaluations or ftwes are conducted/i,
  /^designing and implementing a disability management program makes good management sense/i,
  /^for accommodation, important aspects are accessibility standards, the duty to accommodate, and assistive technologies/i,
  /^how to use this tool this tool will allow you to proceed step by step/i,
  /^this situation must be resolved through proper mechanisms/i,
  /^keeping the lines of communication open during an employee(?:'|’)?s absence will help/i,
  /^employers must remove systemic barriers/i,
  /^with the employee, gather relevant information and supporting documentation/i,
  /^in the workplace, encouraging individuals with early symptoms to take remedial action/i,
  /^it is intended to provide guidance from the time a case is identified/i,
];

let claimsByRecordId: Map<string, KnowledgeClaim[]>;
let allClaims: KnowledgeClaim[];
let recordsById: Map<
  string,
  {
    id: string;
    sourceId: string;
    filePath: string;
    text: string;
  }
>;

jest.setTimeout(180000);

async function loadClaims() {
  if (claimsByRecordId && allClaims && recordsById) {
    return { claimsByRecordId, allClaims, recordsById };
  }

  const [claimsRaw, recordsRaw] = await Promise.all([
    fs.readFile(CLAIMS_PATH, 'utf8'),
    fs.readFile(RECORDS_PATH, 'utf8'),
  ]);
  const byRecordId = new Map<string, KnowledgeClaim[]>();
  const parsedClaims: KnowledgeClaim[] = [];
  const parsedRecords = new Map<string, { id: string; sourceId: string; filePath: string; text: string }>();

  for (const line of claimsRaw.split(/\r?\n/).map((row) => row.trim()).filter(Boolean)) {
    let claim: KnowledgeClaim;
    try {
      claim = JSON.parse(line) as KnowledgeClaim;
    } catch {
      continue;
    }

    parsedClaims.push(claim);
    for (const recordId of claim.evidenceRecordIds || []) {
      const normalized = String(recordId || '').trim();
      if (!normalized) continue;
      const bucket = byRecordId.get(normalized) || [];
      bucket.push(claim);
      byRecordId.set(normalized, bucket);
    }
  }

  for (const line of recordsRaw.split(/\r?\n/).map((row) => row.trim()).filter(Boolean)) {
    let record: {
      id?: string;
      sourceId?: string;
      filePath?: string;
      text?: string;
    };
    try {
      record = JSON.parse(line) as {
        id?: string;
        sourceId?: string;
        filePath?: string;
        text?: string;
      };
    } catch {
      continue;
    }

    const id = String(record.id || '').trim();
    if (!id) continue;
    parsedRecords.set(id, {
      id,
      sourceId: String(record.sourceId || '').trim(),
      filePath: String(record.filePath || '').trim(),
      text: String(record.text || '').trim(),
    });
  }

  claimsByRecordId = byRecordId;
  allClaims = parsedClaims;
  recordsById = parsedRecords;
  return { claimsByRecordId, allClaims, recordsById };
}

function buildContext(caseDef: Step4EvalCase) {
  return {
    consultationText: caseDef.consultation,
    additionalConsultation: caseDef.additionalConsultation || '',
    selectedTags: caseDef.selectedTags || [],
    followUpAnswers: caseDef.followUpAnswers || [],
    selectedAccommodationTitles: caseDef.selectedAccommodationTitles || [],
  };
}

function tokenizeCase(caseDef: Step4EvalCase) {
  return [
    caseDef.consultation,
    caseDef.additionalConsultation || '',
    ...(caseDef.selectedTags || []),
    ...(caseDef.followUpAnswers || []),
    ...(caseDef.selectedAccommodationTitles || []),
  ]
    .flatMap((value) => String(value || '').split(/[\s、。,.()\[\]「」\n\r\t:：/]+/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 2);
}

function collectMatchedClaims(recordIds: string[], byRecordId: Map<string, KnowledgeClaim[]>) {
  const deduped = new Map<string, KnowledgeClaim>();
  for (const recordId of recordIds) {
    const matched = byRecordId.get(recordId) || [];
    for (const claim of matched) {
      const claimId = String(claim.id || '').trim();
      if (!claimId || deduped.has(claimId)) continue;
      deduped.set(claimId, claim);
    }
  }
  return [...deduped.values()];
}

async function buildReferencePresentation(caseDef: Step4EvalCase) {
  const { allClaims: claims, recordsById: allRecords } = await loadClaims();
  const context = buildContext(caseDef);
  const sourceIds = new Set(caseDef.enabledSourceIds || []);
  const caseTokens = tokenizeCase(caseDef);
  const sourceRecords = [...allRecords.values()].filter((record) => sourceIds.has(record.sourceId));
  const evidence: EvidenceItem[] = sourceRecords.map((record) => {
    const searchText = `${record.text} ${record.filePath}`.toLowerCase();
    const hitCount = caseTokens.reduce(
      (count, token) => (searchText.includes(token) ? count + 1 : count),
      0,
    );
    return {
      id: record.id,
      sourceId: record.sourceId,
      filePath: record.filePath,
      excerpt: record.text.slice(0, 240),
      score: hitCount,
    };
  });
  const practicalPreview = await buildPracticalReferencePreview(evidence, 4, context);

  const claimScore = (claim: KnowledgeClaim) => {
    const statement = String(claim.statement || '').toLowerCase();
    const sampleText = Array.isArray(claim.sampleExcerpts)
      ? claim.sampleExcerpts
          .map((item) => `${item.excerpt || ''} ${item.sourceUrl || ''}`)
          .join(' ')
          .toLowerCase()
      : '';
    const tokenHits = caseTokens.reduce((count, token) => {
      return statement.includes(token) || sampleText.includes(token) ? count + 1 : count;
    }, 0);
    return tokenHits + (Array.isArray(claim.sampleExcerpts) ? Math.min(claim.sampleExcerpts.length, 3) : 0);
  };

  const sourceScopedClaims = claims.filter((claim) => {
    const claimSourceIds = Array.isArray(claim.sourceIds) ? claim.sourceIds : [];
    return claimSourceIds.length > 0 && claimSourceIds.some((sourceId) => sourceIds.has(sourceId));
  });

  const basisClaims = sourceScopedClaims
    .filter((claim) => claim.provenance?.evidenceRole === 'direct_basis')
    .sort((a, b) => claimScore(b) - claimScore(a))
    .slice(0, 40);

  const basisCitations = await Promise.all(
    basisClaims.map(async (claim) => ({
      claim: String(claim.statement || '').trim(),
      evidence_ids: [String(claim.id || '').trim()],
      evidence_details: await getCitationEvidenceDetails([String(claim.id || '').trim()]),
    })),
  );

  const relatedReadingClaims = sourceScopedClaims
    .filter((claim) => claim.provenance?.evidenceRole === 'related_reading')
    .sort((a, b) => claimScore(b) - claimScore(a))
    .slice(0, 60);

  const referenceSeedCitations = await Promise.all(
    relatedReadingClaims.map(async (claim) => ({
      claim: String(claim.statement || '').trim(),
      evidence_ids: [String(claim.id || '').trim()],
      evidence_details: await getCitationEvidenceDetails([String(claim.id || '').trim()]),
    })),
  );
  const usefulReferenceCitations = sortCitationsByContext(
    mergeReferenceCitationsByClaim(
      enrichReferenceCitationsByContext(
        filterReferenceCitationsByUsefulness(referenceSeedCitations, context),
        context,
      ),
      context,
    ),
    context,
  );

  return {
    practicalPreview,
    basisCitations,
    usefulReferenceCitations,
  };
}

function keywordHitCount(text: string, keywords: string[]) {
  return keywords.reduce((count, keyword) => {
    return text.includes(keyword) ? count + 1 : count;
  }, 0);
}

function summarizePreview(preview: Awaited<ReturnType<typeof buildReferencePresentation>>['practicalPreview']) {
  return preview
    .slice(0, 3)
    .flatMap((item) => [item.title, item.summary, item.whyRelevant, item.usageFocusLabel])
    .join(' ');
}

function summarizeReferences(
  citations: Awaited<ReturnType<typeof buildReferencePresentation>>['usefulReferenceCitations'],
) {
  return citations
    .slice(0, 3)
    .flatMap((citation) => {
      const details = Array.isArray(citation.evidence_details) ? citation.evidence_details : [];
      return [
        String(citation.claim || ''),
        ...details.flatMap((detail) => [
          String(detail.summary || ''),
          String((detail as { practice_stage_label?: string | null }).practice_stage_label || ''),
        ]),
      ];
    })
    .join(' ');
}

describe('step4 representative evaluations', () => {
  it.each(evalCases as Step4EvalCase[])('case: $title', async (caseDef) => {
    const { practicalPreview, basisCitations, usefulReferenceCitations } =
      await buildReferencePresentation(caseDef);

    expect(practicalPreview.length).toBeGreaterThan(0);
    expect(usefulReferenceCitations.length).toBeGreaterThan(0);

    const previewText = summarizePreview(practicalPreview);
    const referenceText = summarizeReferences(usefulReferenceCitations);
    const previewHits = keywordHitCount(previewText, caseDef.expectedPreviewKeywords);
    const referenceHits = keywordHitCount(referenceText, caseDef.expectedReferenceKeywords);
    const topUsageFocuses = practicalPreview.slice(0, 3).map((item) => item.usageFocus);
    const topPreviewSourceIds = practicalPreview.slice(0, 4).map((item) => item.sourceId);
    const topPracticeStageLabels = usefulReferenceCitations
      .slice(0, 3)
      .flatMap((citation) =>
        (citation.evidence_details || []).map((detail) =>
          String((detail as { practice_stage_label?: string | null }).practice_stage_label || ''),
        ),
      )
      .filter(Boolean);

    if (process.env.DEBUG_STEP4_EVAL === '1') {
      console.log(
        JSON.stringify(
          {
            caseId: caseDef.id,
            preview: practicalPreview.slice(0, 3),
            references: usefulReferenceCitations.slice(0, 3),
            previewText,
            referenceText,
            topUsageFocuses,
            topPracticeStageLabels,
            previewHits,
            referenceHits,
          },
          null,
          2,
        ),
      );
    }

    expect(previewHits).toBeGreaterThanOrEqual(caseDef.minimumPreviewKeywordHits || 1);
    expect(referenceHits).toBeGreaterThanOrEqual(caseDef.minimumReferenceKeywordHits || 1);

    if (Array.isArray(caseDef.expectedUsageFocus) && caseDef.expectedUsageFocus.length > 0) {
      expect(
        topUsageFocuses.some((focus) => caseDef.expectedUsageFocus?.includes(focus)),
      ).toBe(true);
    }

    if (
      Array.isArray(caseDef.enabledSourceIds) &&
      caseDef.enabledSourceIds.some((sourceId) => sourceId !== 'jeed_reference')
    ) {
      expect(topPreviewSourceIds.some((sourceId) => sourceId !== 'jeed_reference')).toBe(true);
    }

    if (
      Array.isArray(caseDef.expectedPracticeStageLabels) &&
      caseDef.expectedPracticeStageLabels.length > 0
    ) {
      expect(
        topPracticeStageLabels.some((label) =>
          caseDef.expectedPracticeStageLabels?.some((expected) => label.includes(expected)),
        ),
      ).toBe(true);
    }

    const topBasisText = basisCitations
      .slice(0, 5)
      .flatMap((citation) => [
        String(citation.claim || ''),
        ...((citation.evidence_details || []).map((detail) => String(detail.summary || '')) || []),
      ])
      .join(' ');
    const combinedText = `${previewText} ${referenceText} ${topBasisText}`;
    for (const pattern of LOW_VALUE_PATTERNS) {
      expect(combinedText).not.toMatch(pattern);
    }
  });

  it('artifact: removes known AskJAN boilerplate from direct basis claims', async () => {
    const { allClaims: claims } = await loadClaims();
    const hits = claims
      .filter(
        (claim) =>
          claim.provenance?.evidenceRole === 'direct_basis' &&
          Array.isArray(claim.sourceIds) &&
          claim.sourceIds.includes('askjan_website'),
      )
      .map((claim) => String(claim.statement || '').trim())
      .filter((statement) => DIRECT_BASIS_BLOCKED_PATTERNS.some((pattern) => pattern.test(statement)));

    expect(hits).toEqual([]);
  });

  it('artifact: removes known low-value related reading statements', async () => {
    const { allClaims: claims } = await loadClaims();
    const hits = claims
      .filter((claim) => claim.provenance?.evidenceRole === 'related_reading')
      .map((claim) => String(claim.statement || '').trim())
      .filter((statement) => RELATED_READING_BLOCKED_PATTERNS.some((pattern) => pattern.test(statement)));

    expect(hits).toEqual([]);
  });

  it('artifact: keeps related reading statements deduped within each source family', async () => {
    const { allClaims: claims } = await loadClaims();
    const buckets = new Map<string, number>();

    for (const claim of claims) {
      if (claim.provenance?.evidenceRole !== 'related_reading') continue;
      const statement = String(claim.statement || '').replace(/\s+/g, ' ').trim();
      if (!statement) continue;
      for (const sourceId of claim.sourceIds || []) {
        const key = `${sourceId}|||${statement}`;
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }
    }

    const duplicates = [...buckets.entries()]
      .filter(([, count]) => count > 1)
      .map(([key, count]) => {
        const [sourceId, statement] = key.split('|||');
        return `${sourceId} (${count}): ${statement}`;
      });

    expect(duplicates).toEqual([]);
  });
});
