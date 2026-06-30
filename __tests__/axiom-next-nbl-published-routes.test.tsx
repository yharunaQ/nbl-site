import { render, screen, within } from '@testing-library/react';
import AxiomNextNblPublishedSitePage from '@/components/axiom/AxiomNextNblPublishedSitePage';
import {
  AXIOM_NEXT_NBL_PUBLISHED_SLUGS,
  getAxiomNextNblPublishedPath,
  rewriteAxiomCandidateHrefToPublished,
} from '@/lib/axiom/nextNblPublishedRoutes';

describe('Axiom next NBL published routes', () => {
  it('rewrites internal candidate hrefs to published public paths', () => {
    expect(
      rewriteAxiomCandidateHrefToPublished('/internal/axiom-next-nbl-public-candidate/home'),
    ).toBe('/');
    expect(
      rewriteAxiomCandidateHrefToPublished(
        '/internal/axiom-next-nbl-public-candidate/case-readings#consultation-finder',
      ),
    ).toBe('/case-readings#consultation-finder');
  });

  it('renders published navigation without internal candidate links', () => {
    render(<AxiomNextNblPublishedSitePage slug="work-design-views-guide" />);

    expect(screen.getAllByRole('link', { name: 'トップ' })[0]).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: '相談事例' })[0]).toHaveAttribute(
      'href',
      '/case-readings',
    );
    expect(screen.getAllByRole('link', { name: 'NBLレポート' })[0]).toHaveAttribute(
      'href',
      '/articles-social-questions',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expect(within(desktopNav).queryByRole('link', { name: 'プロジェクト' })).not.toBeInTheDocument();
    expect(
      within(
        screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
      ).getByRole('link', { name: 'プロジェクト' }),
    ).toHaveAttribute('href', '/projects');
    expect(
      within(screen.getByRole('navigation', { name: 'NBL site mobile navigation' })).getByRole(
        'link',
        { name: 'プロジェクト' },
      ),
    ).toHaveAttribute('href', '/projects');
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });

  it('defines all ten published public paths including projects', () => {
    expect(
      AXIOM_NEXT_NBL_PUBLISHED_SLUGS.map((slug) => getAxiomNextNblPublishedPath(slug)),
    ).toEqual([
      '/',
      '/scene-entry',
      '/case-readings',
      '/work-design-views-guide',
      '/articles-social-questions',
      '/toolkit-studio',
      '/work-condition-window',
      '/theory-method-trust',
      '/projects',
      '/about-boundary',
    ]);
  });

  it('renders the projects page inside the Axiom published page wrapper', () => {
    render(<AxiomNextNblPublishedSitePage slug="projects" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '3つのプロジェクトを軸に、一緒に作る人を探しています。',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'プロジェクト' })[0]).toHaveAttribute(
      'href',
      '/projects',
    );
    const desktopNav = screen.getByRole('navigation', { name: 'NBL site navigation' });
    expect(within(desktopNav).getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expect(within(desktopNav).queryByRole('link', { name: 'プロジェクト' })).not.toBeInTheDocument();
    expect(screen.queryByText('この入口の位置づけ')).not.toBeInTheDocument();
    expect(
      screen.getByAltText('白い壁を楽しそうに塗る少年と、参加したくなる人々のイラスト'),
    ).toHaveAttribute('src', '/images/nbl-projects-tom-sawyer-wall-painting-hero-v1.png');
    expect(
      screen
        .getAllByRole('link')
        .every(
          (link) =>
            !(link.getAttribute('href') ?? '').startsWith(
              '/internal/axiom-next-nbl-public-candidate',
            ),
        ),
    ).toBe(true);
  });
});
