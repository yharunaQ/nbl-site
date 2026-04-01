import {
  fchmaSourceManifests,
  getResponseTypeMap,
  listCaseStructureSources,
  listFreeTextColumns,
  listSupportPracticeSources,
  listWorkbookSourceManifests,
  respondentCanonicalConceptMap,
  supporterBehavioralDriverSchema,
} from '@/lib/fchma/sourceSpecs';
import {
  fchmaInitialTableNames,
  getFchmaTableMetadata,
} from '@/lib/fchma/schemaMetadata';

describe('fchma source specs', () => {
  it('loads the workbook-backed source manifests', () => {
    const workbooks = listWorkbookSourceManifests();

    expect(workbooks).toHaveLength(4);
    expect(workbooks.map((item) => item.dataset_id)).toEqual(
      expect.arrayContaining([
        'employment_survey_3000',
        'nanbyo_survey_4000',
        'supporter_practice_nanbyo',
        'supporter_practice_toku18',
      ]),
    );
  });

  it('keeps respondent and supporter lanes separated', () => {
    expect(listCaseStructureSources().map((item) => item.dataset_id)).toEqual(
      expect.arrayContaining(['employment_survey_3000', 'nanbyo_survey_4000']),
    );

    expect(listSupportPracticeSources().map((item) => item.dataset_id)).toEqual(
      expect.arrayContaining([
        'supporter_practice_nanbyo',
        'supporter_practice_toku18',
        'supporter_practice_workshop_patterns',
      ]),
    );
  });

  it('exposes free-text columns for respondent imports', () => {
    expect(listFreeTextColumns('employment_survey_3000')).toEqual(
      expect.arrayContaining(['自由記述', '10記述']),
    );

    expect(listFreeTextColumns('nanbyo_survey_4000')).toEqual(
      expect.arrayContaining(['xQ10', 'xQ16']),
    );
  });

  it('loads response type maps for the four structured datasets', () => {
    const toku18Map = getResponseTypeMap('supporter_practice_toku18');
    const nanbyoSupportMap = getResponseTypeMap('supporter_practice_nanbyo');

    expect(toku18Map?.variables.some((item) => item.raw_name === '問10記述')).toBe(true);
    expect(
      nanbyoSupportMap?.variables.some(
        (item) => item.raw_name === 'Q14x' && item.response_type_guess === 'free_text',
      ),
    ).toBe(true);
  });

  it('loads canonical concept and supporter driver schemas', () => {
    expect(respondentCanonicalConceptMap.sources).toEqual(
      expect.arrayContaining(['employment_survey_3000', 'nanbyo_survey_4000']),
    );

    expect(supporterBehavioralDriverSchema.models.map((item) => item.model_id)).toEqual(
      expect.arrayContaining(['support_action_model', 'support_implementation_model']),
    );
  });

  it('includes the schema guide and workshop memos in the manifest layer', () => {
    expect(
      fchmaSourceManifests.some(
        (item) =>
          item.source_id === 'toku18_supporters_structure_note' &&
          item.source_type === 'pdf_structure_note',
      ),
    ).toBe(true);
  });
});

describe('fchma schema metadata', () => {
  it('covers the initial case-centered loop tables', () => {
    expect(fchmaInitialTableNames).toEqual(
      expect.arrayContaining([
        'cases',
        'case_inputs',
        'case_input_fields',
        'narrative_units',
        'health_conditions',
        'structural_hypotheses',
        'intervention_hypotheses',
        'feedback_records',
        'supporter_pattern_assets',
      ]),
    );
  });

  it('describes the table purpose for core learning assets', () => {
    const supporterPatterns = getFchmaTableMetadata('supporter_pattern_assets');
    const chains = getFchmaTableMetadata('contextual_semantic_chains');

    expect(supporterPatterns?.stage).toBe('learning');
    expect(chains?.stage).toBe('analysis');
  });
});
