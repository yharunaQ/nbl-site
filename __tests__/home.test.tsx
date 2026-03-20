import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('NBL Home', () => {
  it('renders the temporary public-safe home', () => {
    render(<Home />);
    expect(screen.getByText('公開中の案内')).toBeInTheDocument();
    expect(
      screen.getByText(
        'NBL は現在、公開面を整理しながら、使いやすい入口から順に組み直しています。',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('仕事設計の見取り図とは')).toBeInTheDocument();
    expect(screen.getAllByText('仕事設計の見取り図を見る').length).toBeGreaterThan(0);
    expect(screen.queryByText(/JAC/)).not.toBeInTheDocument();
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

    expect(screen.getByText('公開中の入口')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '連携・お問い合わせ' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '企業向けの整理を見る' })).toHaveAttribute(
      'href',
      '/for-enterprise',
    );
    expect(
      screen
        .getAllByRole('link', { name: '仕事設計の見取り図を見る' })
        .some((link) => link.getAttribute('href') === '/jac-foundations'),
    ).toBe(true);
    expect(screen.getByRole('link', { name: '動画一覧を見る' })).toHaveAttribute('href', '/videos');
  });
});
