import sources from '@/config/knowledge-sources.json';
import { KnowledgeSource } from '@/lib/knowledge/types';

const sourceList = sources as KnowledgeSource[];

export function listKnowledgeSources(): KnowledgeSource[] {
    return [...sourceList];
}

export function listEnabledKnowledgeSources(): KnowledgeSource[] {
    return sourceList.filter((source) => source.enabled);
}

export function getKnowledgeSourceById(sourceId: string): KnowledgeSource | undefined {
    return sourceList.find((source) => source.id === sourceId);
}
