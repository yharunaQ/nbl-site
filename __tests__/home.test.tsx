import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

describe('NBL Home', () => {
  it('renders the main tagline', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '働きづらさを、仕事条件の地図へ。',
    );
    expect(
      screen.getByText(/本人の弱さや個別配慮の名前で終わらせず/),
    ).toBeInTheDocument();
  });

  it('does not expose review routes from the public home', () => {
    render(<Home />);

    expect(
      screen
        .getAllByRole('link')
        .every((link) => !(link.getAttribute('href') ?? '').startsWith('/review/')),
    ).toBe(true);
  });

  it('shows key stats and entry points', () => {
    render(<Home />);

    expect(screen.getAllByText('8つの課題').length).toBeGreaterThan(0);
    expect(screen.getAllByText('相談事例').length).toBeGreaterThan(0);
    expect(screen.getAllByText('設計ガイド').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLレポート').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ツールキット').length).toBeGreaterThan(0);
    expect(screen.getAllByText('プロジェクト').length).toBeGreaterThan(0);
    expect(screen.getAllByText('障害種類から見る').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLの専門性').length).toBeGreaterThan(0);
    expect(screen.getAllByText('サイト情報').length).toBeGreaterThan(0);
  });

  it('renders public route links instead of preview links on the public home', () => {
    render(<Home />);

    expect(screen.getAllByRole('link', { name: /Next Being Lab/ })[0]).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getAllByRole('link', { name: '相談事例' })[0]).toHaveAttribute(
      'href',
      '/case-readings',
    );
    expect(screen.getAllByRole('link', { name: 'NBLの専門性' })[0]).toHaveAttribute(
      'href',
      '/theory-method-trust',
    );
    expect(screen.getAllByRole('link', { name: 'プロジェクト' })[0]).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith('/preview/falcon-next-nbl') &&
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });
});
