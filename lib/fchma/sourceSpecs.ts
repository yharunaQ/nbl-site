import employmentManifest from '@/data/specs/source-manifests/employment_survey_3000.source-manifest.json';
import nanbyoInteractionPatternsMemoManifest from '@/data/specs/source-manifests/nanbyo_interaction_patterns_memo.source-manifest.json';
import nanbyoManifest from '@/data/specs/source-manifests/nanbyo_survey_4000.source-manifest.json';
import supporterLinkagePointsMemoManifest from '@/data/specs/source-manifests/supporter_linkage_points_memo.source-manifest.json';
import supporterPracticeNanbyoManifest from '@/data/specs/source-manifests/supporter_practice_nanbyo.source-manifest.json';
import supporterPracticeToku18Manifest from '@/data/specs/source-manifests/supporter_practice_toku18.source-manifest.json';
import toku18StructureNoteManifest from '@/data/specs/source-manifests/toku18_supporters_structure_note.source-manifest.json';
import employmentResponseTypeMap from '@/data/specs/response-type-maps/employment_survey_3000.response-type-map.json';
import nanbyoResponseTypeMap from '@/data/specs/response-type-maps/nanbyo_survey_4000.response-type-map.json';
import supporterPracticeNanbyoResponseTypeMap from '@/data/specs/response-type-maps/supporter_practice_nanbyo.response-type-map.json';
import supporterPracticeToku18ResponseTypeMap from '@/data/specs/response-type-maps/supporter_practice_toku18.response-type-map.json';
import respondentCanonicalConceptMapJson from '@/data/specs/canonical-maps/respondent-canonical-concept-map-v0.json';
import supporterBehavioralDriverSchemaJson from '@/data/specs/supporter-patterns/supporter-behavioral-driver-schema-v0.json';
import type {
  FchmaResponseTypeMap,
  FchmaSourceManifest,
  RespondentCanonicalConceptMap,
  SupporterBehavioralDriverSchema,
} from '@/lib/fchma/types';

export const fchmaSourceManifests = [
  employmentManifest,
  nanbyoManifest,
  supporterPracticeNanbyoManifest,
  supporterPracticeToku18Manifest,
  toku18StructureNoteManifest,
  supporterLinkagePointsMemoManifest,
  nanbyoInteractionPatternsMemoManifest,
] as FchmaSourceManifest[];

export const fchmaResponseTypeMaps = {
  employment_survey_3000: employmentResponseTypeMap as FchmaResponseTypeMap,
  nanbyo_survey_4000: nanbyoResponseTypeMap as FchmaResponseTypeMap,
  supporter_practice_nanbyo: supporterPracticeNanbyoResponseTypeMap as FchmaResponseTypeMap,
  supporter_practice_toku18: supporterPracticeToku18ResponseTypeMap as FchmaResponseTypeMap,
} as const satisfies Record<string, FchmaResponseTypeMap>;

export const respondentCanonicalConceptMap =
  respondentCanonicalConceptMapJson as RespondentCanonicalConceptMap;

export const supporterBehavioralDriverSchema =
  supporterBehavioralDriverSchemaJson as SupporterBehavioralDriverSchema;

export function listWorkbookSourceManifests(): FchmaSourceManifest[] {
  return fchmaSourceManifests.filter((manifest) => manifest.source_type === 'xlsx_workbook');
}

export function listCaseStructureSources(): FchmaSourceManifest[] {
  return fchmaSourceManifests.filter(
    (manifest) => manifest.source_role === 'case_structure_source',
  );
}

export function listSupportPracticeSources(): FchmaSourceManifest[] {
  return fchmaSourceManifests.filter(
    (manifest) =>
      manifest.source_role === 'support_practice_source' ||
      manifest.source_role === 'reviewed_pattern_memo',
  );
}

export function getSourceManifestById(sourceId: string): FchmaSourceManifest | undefined {
  return fchmaSourceManifests.find((manifest) => manifest.source_id === sourceId);
}

export function getResponseTypeMap(datasetId: string): FchmaResponseTypeMap | undefined {
  return fchmaResponseTypeMaps[datasetId as keyof typeof fchmaResponseTypeMaps];
}

export function listFreeTextColumns(datasetId: string): string[] {
  const manifest = fchmaSourceManifests.find((item) => item.dataset_id === datasetId);
  return manifest?.free_text_columns ?? [];
}
