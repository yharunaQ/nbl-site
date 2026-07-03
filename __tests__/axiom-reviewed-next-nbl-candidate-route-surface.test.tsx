import { render, screen } from '@testing-library/react';
import AxiomReviewedNextNblCandidateHomePage from '@/pages/internal/axiom-next-nbl-reviewed-candidate';
import AxiomReviewedNextNblCandidatePage, {
  getStaticPaths,
  getStaticProps,
} from '@/pages/internal/axiom-next-nbl-reviewed-candidate/[slug]';
import AxiomReviewedNextNblCandidateRouteSurface from '@/components/axiom/AxiomReviewedNextNblCandidateRouteSurface';

describe('Axiom reviewed next NBL candidate route surface', () => {
  it('renders the home candidate route with Falcon-like hero navigation and Axiom trace', () => {
    render(<AxiomReviewedNextNblCandidateHomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Next NBL Home',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Axiom internal candidate navigation' })).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBe(9);
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(/^\/internal\/axiom-next-nbl-reviewed-candidate/),
      );
    }
    expect(screen.getByText('Kernel Relation')).toBeInTheDocument();
    expect(screen.getByText('Candidate Route Boundary')).toBeInTheDocument();
    expect(screen.getAllByText(/slot:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/rows:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/review units:/).length).toBeGreaterThan(0);
  });

  it('renders a detail candidate route from the dynamic page component', () => {
    render(<AxiomReviewedNextNblCandidatePage slug="work-condition-window" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Work-condition Window' })).toBeInTheDocument();
    expect(screen.getByText('work_condition_window')).toBeInTheDocument();
    expect(screen.getAllByText('internal_candidate_route_created_not_actual_public_navigation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_public_navigation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(0);
  });

  it('keeps hidden and review-routed sections outside public body copy', () => {
    render(<AxiomReviewedNextNblCandidateRouteSurface slug="work-design-views-guide" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Kernel-derived Work-design Views Guide' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Hidden / review-routed sections')).toBeInTheDocument();
    expect(screen.getAllByText('kernel_or_surface_review_before_public_body').length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        'axiom_reviewed_kernel_backed_candidate_route_map_is_internal_candidate_navigation_from_reviewed_pages_not_actual_public_navigation_public_approval_or_publication',
      ),
    ).toBeInTheDocument();
  });

  it('returns static paths for the 9 internal candidate route slugs', async () => {
    const paths = await getStaticPaths({});

    expect(paths).toMatchObject({ fallback: false });
    const staticPaths = (paths as unknown as { paths: Array<{ params: { slug: string } }> })
      .paths;

    expect(staticPaths.map((path) => path.params.slug)).toEqual([
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
  });

  it('returns the slug prop without widening product scope', async () => {
    const props = await getStaticProps({ params: { slug: 'case-readings' } });

    expect(props).toEqual({ props: { slug: 'case-readings' } });
  });

  it('shows the work-design views guide as kernel-derived, not fixed 21 views', () => {
    render(<AxiomReviewedNextNblCandidateRouteSurface slug="work-design-views-guide" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Kernel-derived Work-design Views Guide',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('視点数は固定しない')).toBeInTheDocument();
    expect(
      screen.getByText(
        'view_count_is_derived_by_axiom_kernel_eval_not_hardcoded_from_falcon_or_l3',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('not_fixed_until_axiom_eval_and_review_driven_compression'),
    ).toBeInTheDocument();
    expect(screen.getByText('Semantic derivation bridge')).toBeInTheDocument();
    expect(
      screen.getByText(/15 kernel items、18 compressed review units、L3 27 semantic seedsは別レイヤーです。/),
    ).toBeInTheDocument();
    expect(screen.getByText('fifteen_item_kernel_corpus')).toBeInTheDocument();
    expect(screen.getByText('eighteen_compressed_kernel_review_units')).toBeInTheDocument();
    expect(screen.getByText('twenty_seven_l3_semantic_seed_prior')).toBeInTheDocument();
    expect(
      screen.getByText('semantic_reconstruction_not_simple_count_matching_or_review_unit_substitution'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('do_not_treat_18_review_units_as_21_27_semantic_content_review'),
    ).toBeInTheDocument();
    expect(screen.getByText('do_not_simple_match_15_items_to_27_seeds')).toBeInTheDocument();
    expect(
      screen.getByText(
        'semantic_view_level_review_still_required_even_after_18_unit_kernel_structure_acceptance',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Content-level semantic reconstruction candidates')).toBeInTheDocument();
    expect(screen.getByText(/27 seed drafts \/ 5 section candidates/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /l3_27_seed_meaning_is_reconstructed_with_axiom_kernel_pressure_not_replaced_by_15_or_18_internal_control_units/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('健康時間・回復・生活保障を一つの仕事条件として読む').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('入口・開示・翻訳・支援接続を一続きの参加回路として読む').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('source lens・反対仮説・公開境界を同時に読む').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('作業手順・安全余力・感覚認知負荷を実装条件として読む').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('役割・評価・処遇・学習成長を将来ループとして読む').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        'semantic_view_review_required_before_public_copy',
      ),
    ).toHaveLength(5);
    expect(
      screen.getAllByText(
        'provisional_kernel_structure_acceptance_not_semantic_view_content_review',
      ),
    ).toHaveLength(5);
    expect(
      screen.getAllByText('internal_semantic_reconstruction_candidate_not_final_public_section'),
    ).toHaveLength(5);
    expect(screen.getAllByText('semantic_view_content_review_before_public_guide')).toHaveLength(5);
    expect(
      screen.getAllByText(
        'permits_kernel_backed_continuation_but_does_not_approve_semantic_view_content',
      ),
    ).toHaveLength(5);
    expect(screen.getAllByText('not_ready_for_public_guide_copy')).toHaveLength(5);
    expect(screen.getByText('Backbone surface propagation')).toBeInTheDocument();
    expect(screen.getByText(/9 surface slots \/ 8 downstream surfaces/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('reader_facing_top_home')).toBeInTheDocument();
    expect(screen.getByText('work_condition_window')).toBeInTheDocument();
    expect(screen.getByText('scene_entry_use_cases')).toBeInTheDocument();
    expect(
      screen.getAllByText('semantic_backbone_surface_copy_review_before_public_use'),
    ).toHaveLength(9);
    expect(screen.getAllByText('review_required_not_review_completed').length).toBeGreaterThanOrEqual(9);
    expect(screen.getByText('Axiom版 仕事設計の視点候補')).toBeInTheDocument();
    expect(
      screen.getByText(
        '仕事設計ガイドは、内部の10発見と37下部構造をそのまま並べるのではなく、読者が問題状況から解決状況へ進める仕事設計の視点と状況レベルへ再編集する。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('surface_body_section_review_before_public_copy').length,
    ).toBeGreaterThanOrEqual(5);
    expect(screen.getByText('21という数をfinal view countとして扱っていないか。')).toBeInTheDocument();
    expect(
      screen.getByText(
        '体調の波を本人の自己管理不足ではなく、仕事量、締切、休息、代替手順の平準化課題として読む。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '開示を勇気や説明力の問題にせず、応募、面接、配属で何のために何を共有するかの目的限定設計として読む。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '条件窓を診断名や制度名から答えを引くlookupではなく、働く条件を開く入口として保つ。',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/体調変動と負荷平準化/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/source lens差の翻訳停止点/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/職場規模・地域・支援資源による実装差/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/条件窓はlookupではない/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/review \/ learning loopを閉じない/).length).toBeGreaterThan(0);
  });
});
