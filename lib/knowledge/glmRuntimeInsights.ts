// GLM runtime insights: old nanbyo GLM data has been superseded by the new
// knowledge network (referenceKnowledgePack). The xx_GLM_resutls source is
// intentionally not imported here to prevent old analysis from contaminating
// the AI assessment context.
import {
  type GlmInput,
  type GlmInsightResult,
} from '@/lib/knowledge/glmInsights';

// Returns empty results so that glm_context in plannerContext carries no old
// analysis data. The AI assessment relies on referenceKnowledgePack instead.
export function buildGlmInsights(_input: GlmInput): GlmInsightResult {
  return { topInsights: [], recommendedActions: [] };
}
