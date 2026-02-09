import {
    PlannerInput,
    PlannerOutput,
    PlannerStep,
    KnowledgeSource,
} from '@/lib/knowledge/types';
import { listEnabledKnowledgeSources } from '@/lib/knowledge/sourceRegistry';

function selectSources(input: PlannerInput): KnowledgeSource[] {
    const enabled = listEnabledKnowledgeSources();
    if (!input.enabledSourceIds || input.enabledSourceIds.length === 0) {
        // Default to local-only sources unless user explicitly opts into websites.
        return enabled.filter((source) => source.kind !== 'website');
    }

    const selected = enabled.filter((source) => input.enabledSourceIds?.includes(source.id));
    return selected;
}

function buildSteps(sourceIds: string[]): PlannerStep[] {
    return [
        {
            stepId: 'step_local_keyword',
            purpose: 'Gather direct lexical evidence from local narrative and guideline sources.',
            tool: 'keyword_search',
            sourceIds,
        },
        {
            stepId: 'step_local_semantic',
            purpose: 'Retrieve semantically similar cases and policy fragments.',
            tool: 'semantic_search',
            sourceIds,
        },
        {
            stepId: 'step_structured',
            purpose: 'Query structured survey/model data for quantitative support.',
            tool: 'structured_query',
            sourceIds: sourceIds.filter((id) => id.includes('local') || id.includes('research')),
        },
        {
            stepId: 'step_policy_gate',
            purpose: 'Check output against legal/policy constraints and safety rules.',
            tool: 'policy_check',
            sourceIds,
        },
        {
            stepId: 'step_synthesis',
            purpose: 'Synthesize causal interpretation and ranked accommodations with citations.',
            tool: 'synthesis',
            sourceIds,
        },
    ];
}

export function buildAgenticPlan(input: PlannerInput): PlannerOutput {
    const selectedSources = selectSources(input);
    const sourceIds = selectedSources.map((source) => source.id);
    const allEnabled = listEnabledKnowledgeSources();

    const warnings: string[] = [];
    if (selectedSources.length === 0) {
        warnings.push('No enabled knowledge sources matched.');
    }
    if ((!input.enabledSourceIds || input.enabledSourceIds.length === 0) && allEnabled.some((source) => source.kind === 'website')) {
        warnings.push('Website sources were excluded by default. Pass enabledSourceIds to include them explicitly.');
    }

    const hasExternalDisabled = input.query.toLowerCase().includes('web');
    if (hasExternalDisabled) {
        warnings.push('Web sources are currently disabled in registry and must be enabled explicitly.');
    }

    return {
        query: input.query,
        selectedSources,
        steps: buildSteps(sourceIds),
        warnings,
    };
}
