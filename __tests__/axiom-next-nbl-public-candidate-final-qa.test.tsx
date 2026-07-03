import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import AxiomNextNblPublicCandidateFinalQaPage from '@/pages/internal/axiom-next-nbl-public-candidate-final-qa';
import {
  buildAxiomNblReportArticleVisualQaItems,
  validateAxiomNblReportArticleVisualQaItems,
} from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import {
  buildAxiomNextNblPublicCandidateFinalQaRun,
  validateAxiomNextNblPublicCandidateFinalQaRun,
} from '@/lib/axiom/nextNblPublicCandidateFinalQa';

describe('Axiom next NBL public candidate final QA', () => {
  it('builds a valid internal final QA run without moving public boundaries', () => {
    const run = buildAxiomNextNblPublicCandidateFinalQaRun();
    const validation = validateAxiomNextNblPublicCandidateFinalQaRun(run);

    expect(validation.errors).toEqual([]);
    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_next_nbl_public_candidate_final_qa_valid',
      errorCount: 0,
    });
    expect(run.status).toBe('internal_final_qa_contract_ready_not_public_approval');
    expect(run.lane).toBe('Falcon Lab');
    expect(run.visualQaMatrix.length).toBeGreaterThanOrEqual(37);
  });

  it('covers all 9 public-candidate pages and the main visual-heavy pages', () => {
    const run = buildAxiomNextNblPublicCandidateFinalQaRun();
    const pageSlugs = run.pageCoverage;
    const matrixPageSlugs = new Set(run.visualQaMatrix.map((item) => item.pageSlug));

    expect(pageSlugs).toEqual([
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
    expect(Array.from(matrixPageSlugs)).toEqual(
      expect.arrayContaining([
        'home',
        'scene-entry',
        'case-readings',
        'work-design-views-guide',
        'articles-social-questions',
        'toolkit-studio',
        'work-condition-window',
        'theory-method-trust',
      ]),
    );

    expect(run.visualQaMatrix.filter((item) => item.pageSlug === 'scene-entry')).toHaveLength(9);
    expect(run.visualQaMatrix.filter((item) => item.pageSlug === 'work-design-views-guide')).toHaveLength(22);
  });

  it('keeps internal public-language risk terms blocked in reader copy', () => {
    const run = buildAxiomNextNblPublicCandidateFinalQaRun();
    const terms = new Map(run.publicLanguageRiskTerms.map((term) => [term.term, term]));

    for (const requiredTerm of ['Axiom', 'kernel', 'runtime', 'source lens', 'missing context', 'Founder']) {
      expect(terms.has(requiredTerm)).toBe(true);
      expect(terms.get(requiredTerm)?.status).toBe('blocked_in_reader_copy');
    }

    expect(terms.get('publication')?.status).toBe('allowed_only_in_internal_candidate_chrome');
  });

  it('keeps public approval, publication, runtime, source validity, individual consultation, and learning closed', () => {
    const run = buildAxiomNextNblPublicCandidateFinalQaRun();

    expect(run.notNow).toEqual(
      expect.arrayContaining([
        'no_public_approval',
        'no_publication_execution',
        'no_actual_public_navigation_change',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_source_support_validity_finality',
        'no_individual_consultation_or_case_judgment',
        'no_learning_update_from_final_qa',
      ]),
    );
  });

  it('builds a valid NBL report article-to-infographic QA map for all 36 articles', () => {
    const items = buildAxiomNblReportArticleVisualQaItems();
    const validation = validateAxiomNblReportArticleVisualQaItems(items);

    expect(validation.errors).toEqual([]);
    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_nbl_report_article_visual_qa_valid',
      errorCount: 0,
    });
    expect(items).toHaveLength(36);

    for (const item of items) {
      expect(item.imageSrc).toContain('/images/axiom-article-image2-infographics/');
      expect(item.imageAlt).toContain(item.title);
      expect(item.visualCorrespondenceBody).toContain('本人・仕事・環境・支援・時間・制度');
      expect(item.sectionHeadings.length).toBeGreaterThanOrEqual(4);
      expect(item.nextUseTargets).toEqual(['近い相談で読む', '設計ガイドで見る', 'ツールにする']);
    }
  });

  it('verifies every final-QA image asset exists locally and is non-empty', () => {
    const run = buildAxiomNextNblPublicCandidateFinalQaRun();
    const reportArticleItems = buildAxiomNblReportArticleVisualQaItems();
    const imageSrcs = [
      ...run.visualQaMatrix.map((item) => item.imageSrc),
      ...reportArticleItems.map((item) => item.imageSrc),
    ];
    const uniqueImageSrcs = Array.from(new Set(imageSrcs));

    expect(uniqueImageSrcs.length).toBeGreaterThanOrEqual(73);

    for (const imageSrc of uniqueImageSrcs) {
      const localPath = path.join(process.cwd(), 'public', imageSrc.replace(/^\/+/, ''));

      expect(existsSync(localPath)).toBe(true);
      expect(statSync(localPath).size).toBeGreaterThan(1024);
    }
  });

  it('renders the final QA page as a readable internal review surface', () => {
    const { container } = render(<AxiomNextNblPublicCandidateFinalQaPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '公開候補 Final QA：画像・本文・境界語を揃える。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('主要画像・本文・alt対応表')).toBeInTheDocument();
    expect(screen.getByText('公開語彙リスク')).toBeInTheDocument();
    expect(screen.getByText('NBLレポート36記事・図解対応表')).toBeInTheDocument();
    expect(screen.getByText('axiom_nbl_report_article_visual_qa_valid', { exact: false })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-report-article-visual-qa-item]')).toHaveLength(36);
    expect(screen.getByText('8つの課題')).toBeInTheDocument();
    expect(screen.getByText('設計ガイド')).toBeInTheDocument();
    expect(screen.queryAllByText('図解2｜状況レベル4コマ')).toHaveLength(0);
    expect(screen.getByText('no_learning_update_from_final_qa')).toBeInTheDocument();
  });
});
