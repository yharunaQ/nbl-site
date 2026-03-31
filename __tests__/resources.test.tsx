import { render, screen } from '@testing-library/react';
import ResourcesPage from '@/pages/resources';
import InvisibleDisabilityPage from '@/pages/resources/invisible-disability';

describe('Resources public pages', () => {
  it('renders the resources shelf with public collection links', () => {
    render(<ResourcesPage />);

    expect(screen.getByText('公開ルール')).toBeInTheDocument();
    expect(screen.getByText('読み方の入口')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '公開動画を見る' })).toHaveAttribute('href', '/videos');
    expect(screen.getByText('公開中の collection')).toBeInTheDocument();
    expect(screen.getByText('見えない障害の理解')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: 'この collection を見る' })
        .some((link) => link.getAttribute('href') === '/resources/invisible-disability'),
    ).toBe(true);
  });

  it('renders the public invisible disability series', () => {
    render(<InvisibleDisabilityPage />);

    expect(screen.getByText('見えない障害の理解を、')).toBeInTheDocument();
    expect(
      screen.getByText(/見た目では分かりにくい困りごとを、病名の解説だけで終わらせず/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '体調の波を前提にした働き方の工夫を示す図解を拡大して見る' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resourcesへ戻る' })).toHaveAttribute(
      'href',
      '/resources',
    );
  });
});
