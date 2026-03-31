import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('NBL Home', () => {
  it('renders the relaunch public home', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '障害・難病と仕事設計から始める、AI時代の研究と実装のスタジオ',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '働きづらさを個人の問題で終わらせず、仕事・情報・運用・支援・制度の設計課題として読み替える。',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('ここから入れば、何をしているかが分かる。')).toBeInTheDocument();
    expect(screen.getAllByText('仕事設計の見取り図を見る').length).toBeGreaterThan(0);
  });

  it('does not expose review routes from the public home', () => {
    render(<Home />);

    expect(
      screen
        .getAllByRole('link')
        .every((link) => !(link.getAttribute('href') ?? '').startsWith('/review/')),
    ).toBe(true);
    expect(screen.queryByText('Review Index')).not.toBeInTheDocument();
    expect(screen.queryByText('Showcase Direction')).not.toBeInTheDocument();
  });

  it('shows the current public entry points', () => {
    render(<Home />);

    expect(screen.getByText('公開中の入口一覧')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '企業向け整理を見る' })).toHaveAttribute(
      'href',
      '/for-enterprise',
    );
    expect(
      screen
        .getAllByRole('link', { name: '仕事設計の見取り図を見る' })
        .some((link) => link.getAttribute('href') === '/jac-foundations'),
    ).toBe(true);
    expect(screen.getAllByRole('link', { name: 'Resources' })[0]).toHaveAttribute(
      'href',
      '/resources',
    );
  });
});
