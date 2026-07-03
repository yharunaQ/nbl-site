import { render, screen } from '@testing-library/react';
import AxiomNextNblVirtualBetaTestPage from '@/pages/internal/axiom-next-nbl-virtual-beta-test';
import {
  buildAxiomNextNblVirtualBetaRun,
  validateAxiomNextNblVirtualBetaRun,
} from '@/lib/axiom/nextNblVirtualBetaTest';

describe('Axiom next NBL virtual beta test', () => {
  it('builds a valid internal virtual beta run across all 9 public-candidate pages', () => {
    const run = buildAxiomNextNblVirtualBetaRun();
    const validation = validateAxiomNextNblVirtualBetaRun(run);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_next_nbl_virtual_beta_run_valid',
      errorCount: 0,
    });
    expect(run.status).toBe('internal_virtual_beta_completed_not_public_approval');
    expect(run.pageCount).toBe(9);
    expect(run.pageReviews).toHaveLength(9);
    expect(run.agentCount).toBeGreaterThanOrEqual(12);
    expect(run.businessReviews.length).toBeGreaterThanOrEqual(3);
    expect(run.priorityImprovements.length).toBeGreaterThanOrEqual(5);

    expect(run.pageReviews.map((review) => review.pageSlug)).toEqual([
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ]);

    for (const review of run.pageReviews) {
      expect(review.pagePath).toContain('/internal/axiom-next-nbl-public-candidate/');
      expect(review.betaFindings.length).toBeGreaterThanOrEqual(2);
      expect(review.businessUseJa.length).toBeGreaterThanOrEqual(3);
      expect(review.nextImprovementJa.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('covers expected reader, implementation, support, public discourse, and NBL business perspectives', () => {
    const run = buildAxiomNextNblVirtualBetaRun();
    const groups = new Set(run.agents.map((agent) => agent.stakeholderGroup));
    const skills = new Set(run.agents.flatMap((agent) => agent.reviewSkills));

    expect(Array.from(groups)).toEqual(
      expect.arrayContaining([
        'disabled_worker_or_jobseeker',
        'rare_disease_or_chronic_condition_worker',
        'sensory_access_user',
        'neurodivergent_or_mental_health_user',
        'employer_hr_dei',
        'frontline_manager',
        'employment_support_provider',
        'policy_research_administration',
        'family_or_peer_support',
        'media_sns_reader',
        'nbl_product_editorial',
        'nbl_partnership_revenue',
        'nbl_trust_operations',
        'nbl_social_growth',
      ]),
    );
    expect(Array.from(skills)).toEqual(
      expect.arrayContaining([
        'fragmented_consultation_pickup',
        'work_condition_translation',
        'low_vision_and_screen_reader_access',
        'hearing_information_access',
        'employer_implementation_path',
        'article_editorial_worth_spreading',
        'business_model_surface_fit',
        'trust_and_contact_operations',
      ]),
    );
  });

  it('keeps public approval, runtime, source validity, personal-data collection, and learning boundaries closed', () => {
    const run = buildAxiomNextNblVirtualBetaRun();

    expect(run.notNow).toEqual(
      expect.arrayContaining([
        'no_public_approval',
        'no_publication_execution',
        'no_actual_public_navigation_change',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_source_support_validity_finality',
        'no_candidate_pattern_promotion',
        'no_individual_consultation_or_case_judgment',
        'no_personal_data_collection_or_feedback_form_activation',
        'no_learning_update_from_virtual_beta',
      ]),
    );
  });

  it('renders the virtual beta review surface as a readable internal page', () => {
    render(<AxiomNextNblVirtualBetaTestPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '次期NBLサイトを、想定利用者と経営チームの目で読む。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('誰の目でチェックしたか')).toBeInTheDocument();
    expect(screen.getByText('9ページ別のバーチャルベータ結果')).toBeInTheDocument();
    expect(screen.getByText('NBL事業チームとしての使い道')).toBeInTheDocument();
    expect(screen.getByText('公開前に優先して直すこと')).toBeInTheDocument();
    expect(screen.getAllByText('難病・慢性疾患のある就労者').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBL事業開発・連携責任者').length).toBeGreaterThan(0);
    expect(screen.getByText('相談の一言を、仕事条件の対話へ')).toBeInTheDocument();
    expect(screen.getByText('NBLレポート')).toBeInTheDocument();
    expect(screen.getByText('今回動かしていない境界')).toBeInTheDocument();
    expect(screen.getByText('no_public_approval')).toBeInTheDocument();
    expect(screen.getByText('no_learning_update_from_virtual_beta')).toBeInTheDocument();
  });
});
