import { render, screen, within } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

function expectDesignGuideBeforeConsultation(nav: HTMLElement) {
  const labels = Array.from(nav.querySelectorAll('a')).map((link) => link.textContent);

  expect(labels.indexOf('設計ガイド')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('相談事例')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('設計ガイド')).toBeLessThan(labels.indexOf('相談事例'));
}

function expectNoIssueMapInMenu(nav: HTMLElement) {
  expect(within(nav).queryByRole('link', { name: '課題地図' })).not.toBeInTheDocument();
}

describe('NBL Home', () => {
  it('renders the main tagline', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '障害者雇用・難病就労支援から、',
    );
    expect(screen.getByText(/AIが仕事や社会を急速に変える時代には/)).toBeInTheDocument();
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
    const { container } = render(<Home />);

    expect(screen.getAllByText('バーチャルニュース').length).toBeGreaterThan(0);
    expect(screen.getAllByText('相談事例').length).toBeGreaterThan(0);
    expect(screen.getAllByText('設計ガイド').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLレポート').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ツールキット').length).toBeGreaterThan(0);
    expect(screen.getAllByText('プロジェクト').length).toBeGreaterThan(0);
    expect(screen.getAllByText('障害種類から見る').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLの専門性').length).toBeGreaterThan(0);
    expect(screen.getAllByText('サイト情報').length).toBeGreaterThan(0);
    expect((container.textContent ?? '').indexOf('誰もが活躍できる仕事・参加設計へ')).toBeLessThan(
      (container.textContent ?? '').indexOf('一言の相談を、見立てと支援計画へほどく'),
    );
  });

  it('renders public route links instead of preview links on the public home', () => {
    render(<Home />);

    expect(screen.getAllByRole('link', { name: /Next Being Lab/ })[0]).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'バーチャルニュース' })[0]).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expect(screen.getAllByRole('link', { name: '相談事例' })[0]).toHaveAttribute(
      'href',
      '/case-readings',
    );
    expect(screen.getAllByRole('link', { name: 'NBLの専門性' })[0]).toHaveAttribute(
      'href',
      '/theory-method-trust',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'バーチャルニュース' })).toHaveAttribute(
      'href',
      '/virtual-news',
    );
    expect(within(desktopNav).getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expectDesignGuideBeforeConsultation(desktopNav);
    expect(
      within(desktopNav).queryByRole('link', { name: 'プロジェクト' }),
    ).not.toBeInTheDocument();
    expect(
      within(
        screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
      ).getByRole('link', { name: 'プロジェクト' }),
    ).toHaveAttribute('href', '/projects');
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expectNoIssueMapInMenu(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expect(
      within(screen.getByRole('navigation', { name: 'NBL site mobile navigation' })).getByRole(
        'link',
        { name: 'プロジェクト' },
      ),
    ).toHaveAttribute('href', '/projects');
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site mobile navigation' }),
    );
    expectNoIssueMapInMenu(screen.getByRole('navigation', { name: 'NBL site mobile navigation' }));
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
