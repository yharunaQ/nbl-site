import { render, screen } from '@testing-library/react';
import ResourcesPage from '@/pages/resources';
import InvisibleDisabilityPage from '@/pages/resources/invisible-disability';

describe('Resources public pages', () => {
  it('renders the resources shelf with public collection links', () => {
    render(<ResourcesPage />);

    expect(screen.getByText('整理済みのテーママップ')).toBeInTheDocument();
    expect(screen.getByText('就労支援設計の変革テーマ')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '変革テーマを見る' })).toHaveAttribute(
      'href',
      '/resources/work-support-transformation',
    );
    expect(screen.getByRole('link', { name: '動画を見る' })).toHaveAttribute('href', '/videos');
    expect(
      screen.getAllByRole('link', { name: 'ガイドブックを見る' }).every((l) => l.getAttribute('href') === '/guide'),
    ).toBe(true);
    expect(screen.getByText('公開中の collection')).toBeInTheDocument();
    expect(screen.getByText('見えない障害の理解')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: 'この collection を見る' })
        .some((link) => link.getAttribute('href') === '/resources/invisible-disability'),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('link', { name: 'この collection を見る' })
        .some((link) => link.getAttribute('href') === '/resources/work-support-transformation'),
    ).toBe(true);
  });

  it('renders the public invisible disability series', () => {
    render(<InvisibleDisabilityPage allSongs={[]} byInfographic={{}} />);

    expect(screen.getByText('見えない障害の理解を、')).toBeInTheDocument();
    expect(screen.getByText('まずは5点の公開セットから読み始められます。')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '体調の波を前提にした働き方の工夫を示す図解を拡大して見る' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resourcesへ戻る' })).toHaveAttribute(
      'href',
      '/resources',
    );
  });
});
