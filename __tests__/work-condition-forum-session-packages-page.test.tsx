import { render, screen } from '@testing-library/react';
import WorkConditionForumSessionPackagesPage from '@/pages/preview/work-condition-forum-session-packages';

describe('Work condition forum session packages preview page', () => {
  it('renders the virtual forum as a simple forum main page', () => {
    render(<WorkConditionForumSessionPackagesPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /働ける条件を\s*設計する/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('NBL仕事条件デザイン・バーチャルフォーラム')).toBeInTheDocument();
    expect(screen.getByText('VIRTUAL FORUM 2026')).toBeInTheDocument();
    expect(document.querySelector('#forum-top')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'NBL Work Condition Design Virtual Forum' }),
    ).toHaveAttribute('href', '#forum-top');
    expect(screen.getByRole('link', { name: 'NBLトップ' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'NBLレポート' })).toHaveAttribute(
      'href',
      '/articles-social-questions',
    );
    expect(screen.getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expect(screen.getByText('SESSIONS')).toBeInTheDocument();
    expect(screen.getByText('PROGRAM')).toBeInTheDocument();
    expect(screen.getByText('発表一覧')).toBeInTheDocument();
    expect(document.body.innerHTML).toContain(
      '/images/work-condition-forum-virtual-city-hero-v1.webp',
    );
    expect(screen.queryByText('FORUM ROOMS')).not.toBeInTheDocument();
    expect(screen.queryByText('SESSION HALL')).not.toBeInTheDocument();
    expect(screen.queryByText(/Falcon Lab/)).not.toBeInTheDocument();
    expect(screen.queryByText(/public未承認/)).not.toBeInTheDocument();
    expect(screen.queryByText(/フォーラム構想ページへ戻る/)).not.toBeInTheDocument();
    expect(screen.queryByText('ARTICLE FIRST')).not.toBeInTheDocument();
    expect(screen.queryByText('NEXT BUILD')).not.toBeInTheDocument();
    expect(screen.queryByText('BOUNDARY')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認済み')).not.toBeInTheDocument();
    expect(screen.getByText(/制作中の独立プレビュー/)).toBeInTheDocument();
    expect(screen.getByText(/個別の法的・医学的・雇用上の判断/)).toBeInTheDocument();
  });

  it('lists all 22 full-width presentation rows as article links', () => {
    render(<WorkConditionForumSessionPackagesPage />);

    const presentationRows = screen.getAllByTestId('presentation-row');
    expect(presentationRows).toHaveLength(22);
    expect(screen.getAllByText('雇用率の先へ：人数管理から仕事設計へ').length).toBeGreaterThan(0);
    expect(screen.getByText('ラベルと言葉の向こうの就労経験')).toBeInTheDocument();
    expect(screen.getByText('測るべきものを測る：品質指標と本人便益')).toBeInTheDocument();
    expect(screen.getByText(/社会実装編集者/)).toBeInTheDocument();
    expect(screen.getByText(/本人便益を中心に据える評価研究者/)).toBeInTheDocument();
    expect(
      screen.getByText(/人数管理を、参加の質を読む仕事条件設計へ進めます。/),
    ).toBeInTheDocument();
    expect(presentationRows[0]).toHaveAttribute('href', '/preview/work-condition-forum-text/VF-01');
    expect(presentationRows[21]).toHaveAttribute(
      'href',
      '/preview/work-condition-forum-text/VF-22',
    );
    expect(screen.getAllByText('本文ページを読む')).toHaveLength(22);
    expect(screen.queryByRole('link', { name: '図解' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'スライド' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '動画' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'テキスト' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '本文' })).not.toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain('kind=article');
    expect(screen.queryByText(/NotebookLM素材/)).not.toBeInTheDocument();
  });

  it('keeps the six forum sessions visible as session navigation', () => {
    render(<WorkConditionForumSessionPackagesPage />);

    expect(
      screen.getByRole('link', { name: /Session 1\s*\/\s*VF-01-04\s*基調・統合/ }),
    ).toHaveAttribute('href', '#session-1');
    expect(
      screen.getByRole('link', { name: /Session 3\s*\/\s*VF-09-12\s*見えない条件と健康時間/ }),
    ).toHaveAttribute('href', '#session-3');
    expect(
      screen.getAllByText('HR、企業、自治体、政策、福祉的就労を同じ仕事条件マップで読む。').length,
    ).toBeGreaterThan(0);
  });
});
