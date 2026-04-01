export type KnowledgeSourceKind = 'local_fs' | 'guideline_pdf' | 'website';

export type KnowledgeTrustLevel = 'primary' | 'secondary' | 'external';

export type KnowledgeRefreshPolicy = 'manual' | 'daily' | 'weekly' | 'monthly';

export type KnowledgeSource = {
  id: string;
  name: string;
  kind: KnowledgeSourceKind;
  enabled: boolean;
  trustLevel: KnowledgeTrustLevel;
  refresh: KnowledgeRefreshPolicy;
  location: string;
  notes?: string;
  seedUrls?: string[];
  seedUrlTemplate?: string;
  seedPageStart?: number;
  seedPageEnd?: number;
  seedPageStep?: number;
  crawlDepth?: number;
  maxPages?: number;
  allowedHosts?: string[];
  allowPathPrefixes?: string[];
};

export type KnowledgeClaimType = 'interaction_signal' | 'accommodation_action' | 'outcome_signal';

export type KnowledgeInteractionSignal =
  | 'difficulty_occurrence'
  | 'difficulty_resolution'
  | 'symptom_exacerbation'
  | 'support_needs';

export type KnowledgeRiskLevel = 'low' | 'medium' | 'high';

export type KnowledgeConfidenceLevel = 'low' | 'medium' | 'high';

export type KnowledgeSafetyGateMode = 'normal' | 'caution' | 'strict';

export type KnowledgeEvidenceRole =
  | 'direct_basis'
  | 'conditional_hypothesis'
  | 'support_catalog'
  | 'related_reading';

export type KnowledgeSafetyRecommendationPolicy =
  | 'standard'
  | 'conditional_only'
  | 'questions_first';

export type KnowledgeClaim = {
  id: string;
  claimType: KnowledgeClaimType;
  signal: KnowledgeInteractionSignal | null;
  statement: string;
  canonicalStatement: string;
  evidenceCount: number;
  sourceIds: string[];
  evidenceRecordIds: string[];
  sampleExcerpts: Array<{
    recordId: string;
    sourceId: string;
    filePath: string;
    sourceUrl: string | null;
    excerpt: string;
    practicalTitleJa?: string | null;
    practicalSummaryJa?: string | null;
    usageFocus?: string | null;
    applicabilityConditionsJa?: string | null;
  }>;
  interactionContextSummary: {
    countries: string[];
    legalContexts: string[];
    languages: string[];
    trustTiers: string[];
    pageTypes: string[];
    evidenceScopes: string[];
    evidenceLane?: string;
    disabilityFacets: string[];
    conditionLabels?: string[];
    disabilityLabels?: string[];
    industryFacets: string[];
    companySizeFacets: string[];
    accommodationFacets: string[];
    outcomeFacets: string[];
  };
  applicability: {
    missingContexts: string[];
    isPartial: boolean;
    conditions: string[];
  };
  risk: {
    level: KnowledgeRiskLevel;
    reasons: string[];
  };
  confidence: {
    score: number;
    level: KnowledgeConfidenceLevel;
  };
  provenance?: {
    noteTypes: string[];
    curationRiskLevels: string[];
    evidenceRole: KnowledgeEvidenceRole;
    publicSafe: boolean;
    mustPairWithRegionalSupport: boolean;
  };
};

export type KnowledgeSafetyGate = {
  mode: KnowledgeSafetyGateMode;
  recommendationPolicy: KnowledgeSafetyRecommendationPolicy;
  summary: string;
  reasonCodes: string[];
  matchedClaimCount: number;
  highRiskClaimCount: number;
  mediumRiskClaimCount: number;
  aggregatedEvidenceClaimCount: number;
  specificCaseClaimCount: number;
  partialClaimCount: number;
  missingContextCount: number;
  sampleClaimIds: string[];
  evidenceLaneCounts: Record<string, number>;
  followUpQuestions: string[];
};

export type PlannerInput = {
  query: string;
  enabledSourceIds?: string[];
};

export type PlannerStep = {
  stepId: string;
  purpose: string;
  tool: 'keyword_search' | 'semantic_search' | 'structured_query' | 'policy_check' | 'synthesis';
  sourceIds: string[];
};

export type PlannerOutput = {
  query: string;
  selectedSources: KnowledgeSource[];
  steps: PlannerStep[];
  warnings: string[];
};

export type PlannerStepStatus = 'completed' | 'skipped' | 'failed';

export type PlannerStepProgress = {
  stepId: string;
  purpose: string;
  tool: PlannerStep['tool'];
  status: PlannerStepStatus;
  message: string;
  evidenceCount: number;
};
