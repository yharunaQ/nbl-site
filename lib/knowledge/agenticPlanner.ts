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
        return enabled;
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
            purpose: 'Summarize structured survey/model and web-derived interaction signals.',
            tool: 'structured_query',
            sourceIds,
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

    const asksExternalKnowledge =
        /web|website|海外|international|global|askjan|jeed|合理的配慮/.test(input.query.toLowerCase());
    const hasEnabledWebsite = allEnabled.some((source) => source.kind === 'website');
    if (asksExternalKnowledge && !hasEnabledWebsite) {
        warnings.push('Website sources are not enabled in registry. Enable website sources to include external evidence.');
    }

    return {
        query: input.query,
        selectedSources,
        steps: buildSteps(sourceIds),
        warnings,
    };
}
