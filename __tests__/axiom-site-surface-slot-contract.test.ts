import {
  AXIOM_KERNEL_FIELD_IDS,
  AXIOM_NEXT_NBL_SITE_SURFACES,
  AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY,
  buildAxiomThemeObjectSurfaceSlotFixture,
  validateAxiomThemeObjectSurfaceSlotContract,
  type AxiomThemeObjectContract,
} from '@/lib/axiom/siteSurfaceSlotContract';
import { buildAxiomInteractionHypothesisKernelFixtureForScenario } from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';

function cloneContract(contract: AxiomThemeObjectContract): AxiomThemeObjectContract {
  return JSON.parse(JSON.stringify(contract)) as AxiomThemeObjectContract;
}

describe('Axiom next NBL site surface slot contract', () => {
  it('maps the fixed next-site skeleton to Axiom kernel fields without publication movement', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
      'l3_health_time_accommodation_lookup_trap_v0',
    );
    const contract = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
    const validation = validateAxiomThemeObjectSurfaceSlotContract(contract);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY,
      coreProgressClass: 'kernel_display',
    });
    expect(contract).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_display',
      status: 'non_runtime_surface_slot_contract_requires_kernel_backcast',
      inheritedSiteCompositionStatus: 'falcon_site_composition_prior',
      contentStatus: 'axiom_content_update_required',
      kernelBackcastStatus: 'kernel_backcast_required',
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        knowledgePromotion: 'not_promoted',
      },
    });
    expect(contract.surfaces.map((surface) => surface.surface)).toEqual([
      ...AXIOM_NEXT_NBL_SITE_SURFACES,
    ]);
  });

  it('covers every required kernel field somewhere in the site surface slot map', () => {
    const contract = buildAxiomThemeObjectSurfaceSlotFixture(
      buildAxiomInteractionHypothesisKernelFixtureForScenario(
        'l3_health_time_accommodation_lookup_trap_v0',
      ),
    );
    const fieldsCovered = new Set(
      contract.surfaces.flatMap((surface) => surface.slots.map((slot) => slot.field)),
    );

    expect([...fieldsCovered].sort()).toEqual([...AXIOM_KERNEL_FIELD_IDS].sort());
  });

  it('keeps scene entry as a low-cognitive-load translation while boundary reasoning stays on about page', () => {
    const contract = buildAxiomThemeObjectSurfaceSlotFixture(
      buildAxiomInteractionHypothesisKernelFixtureForScenario(
        'l3_public_condition_window_non_lookup_v0',
      ),
    );
    const scene = contract.surfaces.find(
      (surface) => surface.surface === 'scene_entry_use_cases',
    );
    const about = contract.surfaces.find(
      (surface) => surface.surface === 'about_operating_boundary_page',
    );

    expect(scene?.navigationRole).toBe(
      'opens low-cognitive-load scene-based use cases before abstract explanation',
    );
    expect(scene?.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'observation',
          operation: 'translate',
          reviewRequiredBeforePublication: true,
        }),
        expect.objectContaining({
          field: 'inference',
          operation: 'translate',
          reviewRequiredBeforePublication: true,
        }),
        expect.objectContaining({
          field: 'counterHypothesis',
          operation: 'translate',
          reviewRequiredBeforePublication: true,
        }),
        expect.objectContaining({ field: 'missingContext', operation: 'display' }),
      ]),
    );
    expect(about?.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'cannotYetSay', operation: 'display' }),
        expect.objectContaining({ field: 'humanReviewRoute', operation: 'display' }),
      ]),
    );
  });

  it('rejects a surface map that drops a required surface or kernel field', () => {
    const contract = cloneContract(
      buildAxiomThemeObjectSurfaceSlotFixture(
        buildAxiomInteractionHypothesisKernelFixtureForScenario(
          'l3_health_time_accommodation_lookup_trap_v0',
        ),
      ),
    );
    contract.surfaces = contract.surfaces.filter(
      (surface) => surface.surface !== 'work_condition_window',
    );
    for (const surface of contract.surfaces) {
      surface.slots = surface.slots.filter((slot) => slot.field !== 'counterHypothesis');
    }

    const validation = validateAxiomThemeObjectSurfaceSlotContract(contract);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'surface_missing:work_condition_window',
        'kernel_field_not_mapped_to_any_surface:counterHypothesis',
      ]),
    );
  });

  it('rejects public approval, publication, promotion, or runtime movement', () => {
    const contract = cloneContract(
      buildAxiomThemeObjectSurfaceSlotFixture(
        buildAxiomInteractionHypothesisKernelFixtureForScenario(
          'l3_health_time_accommodation_lookup_trap_v0',
        ),
      ),
    );
    contract.movementBoundary.runtime =
      'changed' as unknown as AxiomThemeObjectContract['movementBoundary']['runtime'];
    contract.movementBoundary.publicApproval =
      'approved' as unknown as AxiomThemeObjectContract['movementBoundary']['publicApproval'];
    contract.movementBoundary.publication =
      'published' as unknown as AxiomThemeObjectContract['movementBoundary']['publication'];

    const validation = validateAxiomThemeObjectSurfaceSlotContract(contract);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
        'public_approval_publication_or_promotion_must_not_move',
      ]),
    );
  });
});
