import { fireEvent, render, screen } from '@testing-library/react';
import AxiomManifoldDisplayBridgePage from '@/pages/internal/axiom-manifold-display-bridge';

const originalGetContext = HTMLCanvasElement.prototype.getContext;

describe('Axiom manifold display bridge internal surface', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: jest.fn(() => null),
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: originalGetContext,
    });
  });

  it('renders the internal HTML/SVG bridge with source counts and boundary language', () => {
    render(<AxiomManifoldDisplayBridgePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Manifold Display Bridge',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('9,076').length).toBeGreaterThan(0);
    expect(screen.getAllByText('joint subjects').length).toBeGreaterThan(0);
    expect(screen.getByText('44')).toBeInTheDocument();
    expect(screen.getByText('manifold patterns')).toBeInTheDocument();
    expect(screen.getByText('review units')).toBeInTheDocument();
    expect(screen.getByText('integrated axes')).toBeInTheDocument();
    expect(screen.getByText(/この表示は「真実の最終断定」ではなく/)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /不変構造から影へ、\s*影から復元へ/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '人間が見てきたのは現実の一部の影だった',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Live high-dimensional Axiom knowledge-network field'),
    ).toBeInTheDocument();
    expect(screen.getByText('human shadow / biased language')).toBeInTheDocument();
    expect(screen.getAllByText('歪んだ影').length).toBeGreaterThan(0);
    expect(screen.getByText('source-lens collision / flash residue')).toBeInTheDocument();
    expect(screen.getByText('dual-direction reconstruction')).toBeInTheDocument();
    expect(screen.getByText('存在の向き')).toBeInTheDocument();
    expect(screen.getByText('条件下の表現形')).toBeInTheDocument();
    expect(screen.getByText('復元の向き')).toBeInTheDocument();
    expect(screen.getByText('影/偏った言語')).toBeInTheDocument();
    expect(screen.getByText('NBL出力')).toBeInTheDocument();
    expect(
      screen.getByText('同じ現実: 不変構造を、影から復元し、人間向け表現へ戻す。'),
    ).toBeInTheDocument();
    expect(screen.getByText('M_latent = invariant(structure | conditions)')).toBeInTheDocument();
    expect(screen.getByText('shadow_lens_i = pi_i(M_latent, actor_i, bias_i)')).toBeInTheDocument();
    expect(screen.getByText('M_hat = align(source_lenses, ICF, LLM)')).toBeInTheDocument();
    expect(screen.getByText('edge candidates')).toBeInTheDocument();
    expect(screen.getByText('source lenses')).toBeInTheDocument();
    expect(screen.getByText('5 active')).toBeInTheDocument();
    expect(screen.getByText('latent curvature')).toBeInTheDocument();
    expect(screen.getByText('bias dampers')).toBeInTheDocument();
    expect(screen.getByText('reviewable transformation map')).toBeInTheDocument();
    expect(screen.getByText('同じ変換を、レビュー可能な対応図として読む')).toBeInTheDocument();
    expect(screen.getByText(/source lensの衝突/)).toBeInTheDocument();
    expect(
      screen.getByText('Axiom reviewable shadow-to-manifold transformation map'),
    ).toBeInTheDocument();
    expect(screen.getByText(/source lens collision map/)).toBeInTheDocument();
    expect(screen.getByText('source lens衝突')).toBeInTheDocument();
    expect(screen.getByText('ICF relation map')).toBeInTheDocument();
    expect(screen.getByText('latent axes')).toBeInTheDocument();
    expect(screen.getByText('NBL projection')).toBeInTheDocument();
    expect(screen.getAllByText('本人/家族').length).toBeGreaterThan(0);
    expect(screen.getAllByText('企業/職場').length).toBeGreaterThan(0);
    expect(screen.getByText('職場接触点')).toBeInTheDocument();
    expect(screen.getByText('支援再翻訳')).toBeInTheDocument();
    expect(screen.getByText('ツールキット')).toBeInTheDocument();
    expect(screen.getByText(/bridge nodes.*relation edges/)).toBeInTheDocument();
    expect(
      screen.getByText('basis: source-family ledger + bridge nodes/edges; no raw source export'),
    ).toBeInTheDocument();
    expect(screen.getByText('Review focus')).toBeInTheDocument();
    expect(screen.getByText('歪んだ影: 立場ごとの言葉が混線した入力')).toBeInTheDocument();
    expect(screen.getByText('source lensを平均せず、混線として保持する')).toBeInTheDocument();
    expect(screen.getByText(/支援者実践、職場側資料、公式・準公式資料/)).toBeInTheDocument();
    expect(screen.getByText('障害者・難病当事者側の影')).toBeInTheDocument();
    expect(screen.getByText('企業・職場側の影')).toBeInTheDocument();
    expect(screen.getAllByText('断片フラッシュの残像').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/歪んだ影/).length).toBeGreaterThan(0);
    expect(screen.getByText('人間には偏った影だけが見えてきた')).toBeInTheDocument();
    expect(screen.getByText('ICF/LLMで影から不変構造を復元する')).toBeInTheDocument();
    expect(screen.getByText('復元構造をNBLサイトの表現形にする')).toBeInTheDocument();
  });

  it('switches phases and keeps public/video boundary visible', () => {
    render(<AxiomManifoldDisplayBridgePage />);

    fireEvent.click(screen.getByRole('button', { name: /2\. 相互作用で補正/ }));

    expect(screen.getByText('影と言語情報から不変構造を復元する')).toBeInTheDocument();
    expect(screen.getByText('source-lens alignment / ICF lighting')).toBeInTheDocument();
    expect(screen.getByText('ICF/LLM復元: 混線した立場差を平均せず構造化する')).toBeInTheDocument();
    expect(screen.getByText('source-lens差分を残した対立仮説対応')).toBeInTheDocument();
    expect(screen.getByText('支援者側の支援存在を有効性にしない')).toBeInTheDocument();
    expect(screen.getByText('企業・職場側の懸念を能力判定にしない')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /3\. 潜在多様体/ }));

    expect(screen.getByRole('button', { name: /3\. 潜在多様体/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getAllByText('latent invariant structure').length).toBeGreaterThan(0);
    expect(screen.getByText('本来の姿は潜在的多様体という不変構造')).toBeInTheDocument();
    expect(screen.getByText('invariant structures / conditioned expressions')).toBeInTheDocument();
    expect(screen.getByText('潜在的不変構造: 高度に抽象化されたモデル化')).toBeInTheDocument();
    expect(screen.getByText(/AIによる真実の最終断定ではない/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /4\. NBL表現形/ }));

    expect(screen.getByText('NBL expression rendering')).toBeInTheDocument();
    expect(screen.getByText('NBLサイトは復元構造の分かりやすい表現形')).toBeInTheDocument();
    expect(screen.getByText('multiple viewing angles / NBL forms')).toBeInTheDocument();
    expect(screen.getByText('相談入口')).toBeInTheDocument();
    expect(screen.getByText('動画・図解')).toBeInTheDocument();
    expect(screen.getByText('課題: 典型的な発生課題')).toBeInTheDocument();
    expect(screen.getByText('相談事例: 典型的な相互作用')).toBeInTheDocument();
    expect(screen.getByText('ガイド: 典型的な仕事設計、合理的配慮や専門支援')).toBeInTheDocument();
    expect(screen.getByText('ツールキット: 総合的認識の認知負荷の低いデモ')).toBeInTheDocument();
    expect(screen.getByText('一般向け動画へ広げる場合の骨格')).toBeInTheDocument();
    expect(screen.getByText('公開前に残す境界')).toBeInTheDocument();
    expect(screen.getByText(/「真実の多様体」という比喩/)).toBeInTheDocument();
    expect(screen.getByText('separate publication approval')).toBeInTheDocument();
    expect(screen.getByText('no_public_video_approval')).toBeInTheDocument();
    expect(
      screen.getByText('no_runtime_prompt_retrieval_model_provider_db_schema_change'),
    ).toBeInTheDocument();
  });
});
