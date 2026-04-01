import {
  fchmaDerivedIngestionContract,
  getFchmaDerivedIngestionTable,
  listFchmaDerivedIngestionTables,
} from '@/lib/fchma/derivedIngestionContract';
import { fchmaInitialTableNames } from '@/lib/fchma/schemaMetadata';

describe('fchma derived ingestion contract', () => {
  it('lists the tracked derived ingestion tables', () => {
    expect(listFchmaDerivedIngestionTables()).toEqual(
      expect.arrayContaining([
        'dataset_ingestion_batches',
        'dataset_subjects',
        'dataset_field_facts',
        'dataset_narrative_units',
        'dataset_projection_facts',
        'dataset_manifold_profiles',
      ]),
    );
  });

  it('keeps metadata aligned with the schema metadata registry', () => {
    expect(fchmaInitialTableNames).toEqual(
      expect.arrayContaining(listFchmaDerivedIngestionTables()),
    );
  });

  it('describes runtime and research uses for manifold profiles', () => {
    const manifoldProfiles = getFchmaDerivedIngestionTable('dataset_manifold_profiles');

    expect(manifoldProfiles?.runtime_uses).toEqual(
      expect.arrayContaining(['Seed lightweight similarity search and related-case suggestions later']),
    );
    expect(manifoldProfiles?.research_uses).toEqual(
      expect.arrayContaining(['Local manifold, clustering, and nearest-neighbor experiments']),
    );
  });

  it('tracks the current contract version', () => {
    expect(fchmaDerivedIngestionContract.version).toBe('v0');
  });
});
