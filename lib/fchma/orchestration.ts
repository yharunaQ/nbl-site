import type { FchmaIntakeDraftPayload } from '@/lib/fchma/intakeDraft';
import {
  buildFchmaInterventionPreview,
  type FchmaInterventionPreview,
} from '@/lib/fchma/interventionPreview';
import {
  buildFchmaStructurePreview,
  type FchmaStructurePreview,
} from '@/lib/fchma/structuralPreview';

export type FchmaReasoningProviderId = 'deterministic_preview';

export type FchmaReasoningBundle = {
  providerId: FchmaReasoningProviderId;
  structurePreview: FchmaStructurePreview;
  interventionPreview: FchmaInterventionPreview[];
};

export interface FchmaReasoningProvider {
  providerId: FchmaReasoningProviderId;
  buildStructurePreview: (payload: FchmaIntakeDraftPayload) => FchmaStructurePreview;
  buildInterventionPreview: (payload: FchmaIntakeDraftPayload) => FchmaInterventionPreview[];
}

const deterministicPreviewProvider: FchmaReasoningProvider = {
  providerId: 'deterministic_preview',
  buildStructurePreview: buildFchmaStructurePreview,
  buildInterventionPreview: buildFchmaInterventionPreview,
};

export function listFchmaReasoningProviders(): FchmaReasoningProviderId[] {
  return [deterministicPreviewProvider.providerId];
}

export function getDefaultFchmaReasoningProvider(): FchmaReasoningProvider {
  return deterministicPreviewProvider;
}

export function buildFchmaReasoningBundle(
  payload: FchmaIntakeDraftPayload,
  provider: FchmaReasoningProvider = getDefaultFchmaReasoningProvider(),
): FchmaReasoningBundle {
  return {
    providerId: provider.providerId,
    structurePreview: provider.buildStructurePreview(payload),
    interventionPreview: provider.buildInterventionPreview(payload),
  };
}
