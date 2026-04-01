import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('@/lib/publicSiteMode', () => ({
  TEMPORARY_PUBLIC_SITE_ENABLED: true,
  PUBLIC_HOME_VARIANT: 'relaunch',
}));

describe('NBL Home', () => {
  it('renders the relaunch public home', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '就労支援の整理を、もっと速く、確かに。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('AIが整理と叩き台を進め、最終判断は支援者と本人が持つ。'),
    ).toBeInTheDocument();
    expect(screen.getByText('いま見られるもの')).toBeInTheDocument();
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

  it('shows the relaunch navigation and entry points', () => {
    render(<Home />);

    expect(screen.getAllByRole('link', { name: 'What We Do' })[0]).toHaveAttribute(
      'href',
      '/what-we-do',
    );
    expect(screen.getAllByRole('link', { name: 'Operating Model' })[0]).toHaveAttribute(
      'href',
      '/operating-model',
    );
    expect(screen.getByText('ここから入れば、何をしているかが分かる。')).toBeInTheDocument();
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
