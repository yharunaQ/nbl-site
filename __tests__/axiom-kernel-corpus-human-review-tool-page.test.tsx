import { render, screen } from '@testing-library/react';
import AxiomKernelCorpusHumanReviewToolPage from '@/pages/internal/axiom-kernel-corpus-human-review-tool';
import AxiomNextNblPreviewPage from '@/pages/internal/axiom-next-nbl-preview';

describe('Axiom kernel corpus human-review tool page', () => {
  it('renders the internal review tool boundary, summary, and blank receipt template', () => {
    render(<AxiomKernelCorpusHumanReviewToolPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Kernel Corpus Human Review Tool',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_kernel_corpus_human_review_tool_is_local_internal_review_aid_not_review_execution_submission_or_approval',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('human_review_tool_prepared_input_only_not_submitted')).toBeInTheDocument();
    expect(screen.getByText('not_persisted_no_db_or_api')).toBeInTheDocument();
    expect(screen.getByText('blank_template_only_not_received')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '18 / 18 accepted as provisional kernel structure' })).toBeInTheDocument();
    expect(screen.getByText('all_units_accept_as_provisional_kernel_structure')).toBeInTheDocument();
    expect(
      screen.getByText('allowed_to_build_kernel_backed_public_interface_translation'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('build_kernel_backed_public_content_slots_from_reviewed_kernel_fields'),
    ).toBeInTheDocument();
    expect(screen.getByText('Blank Receipt Template')).toBeInTheDocument();
    expect(screen.getByText('Founder Review Result Receipt')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/"receiptStatus": "blank_not_received"/)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        /"status": "founder_review_result_received_all_units_accept_provisional_kernel_structure"/,
      ),
    ).toBeInTheDocument();
  });

  it('renders the actual review target dossier instead of only empty controls', () => {
    const { container } = render(<AxiomKernelCorpusHumanReviewToolPage />);

    expect(screen.getByRole('heading', { name: '何をレビューする画面か' })).toBeInTheDocument();
    expect(screen.getByText(/レビュー対象は公開ページ案そのものではなく/)).toBeInTheDocument();
    expect(screen.getByText(/次はkernel objectを安全な公開fieldへ翻訳します/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'レビューする18項目' })).toBeInTheDocument();
    expect(container.querySelectorAll('.reviewItemIndex li')).toHaveLength(18);
    expect(screen.getAllByText(/Review item [0-9]+ \/ 18/).length).toBeGreaterThanOrEqual(18);
    expect(screen.getByRole('heading', { name: '18項目レビュー入力' })).toBeInTheDocument();
    expect(screen.getAllByText('Kernelの基本契約が守られているか').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Axiomが「見たこと」と「推測したこと」と「まだ分からないこと」を分けて扱えているか/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('レビュー問い').length).toBeGreaterThan(0);
    expect(screen.getAllByText('受け入れでよい状態').length).toBeGreaterThan(0);
    expect(screen.getAllByText('修正が必要な状態').length).toBeGreaterThan(0);
    expect(screen.getAllByText('保留すべき状態').length).toBeGreaterThan(0);
    expect(screen.getAllByText('レビュー対象のkernel rows').length).toBeGreaterThan(0);
    expect(screen.getAllByText('観察').length).toBeGreaterThan(0);
    expect(screen.getAllByText('推論').length).toBeGreaterThan(0);
    expect(screen.getAllByText('反対仮説').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Missing context').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Source lens').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cannot yet say').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/不完全な実データを現実の影として読み/).length).toBeGreaterThan(0);
  });

  it('renders decision controls and note fields for human review without a submit action', () => {
    const { container } = render(<AxiomKernelCorpusHumanReviewToolPage />);

    expect(screen.getAllByText('Recorded review decision').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('暫定kernel構造として受け入れる').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('promotion前に外部人間レビュー必須').length).toBeGreaterThan(0);
    expect(screen.getAllByText('判断理由').length).toBeGreaterThan(0);
    expect(screen.getAllByText('必要修正').length).toBeGreaterThan(0);
    expect(screen.getAllByText('promotion blocker').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /submit|send|approve|publish/i })).not.toBeInTheDocument();
    expect(container.querySelectorAll('form')).toHaveLength(0);
  });

  it('keeps the internal preview free of navigation links while the dedicated tool route exists', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.queryByRole('link', { name: 'Open internal human review tool' }),
    ).not.toBeInTheDocument();
  });
});
