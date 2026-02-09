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
    crawlDepth?: number;
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
