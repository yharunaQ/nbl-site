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
    expect(
      within(desktopNav).queryByRole('link', { name: 'プロジェクト' }),
    ).not.toBeInTheDocument();
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

  it('renders the published home as a why, how, what sequence', () => {
    render(<AxiomNextNblPublishedSitePage slug="home" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /障害者雇用・\s*難病就労支援から、\s*AI時代の\s*仕事設計へ。/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('AIが仕事や社会を急速に変える時代には', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('仕事・環境・支援の組み合わせから、働き方と社会参加を設計する力', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '膨大で偏りを含む情報を、実践できる仕事条件の地図へ。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /未解決の働きづらさは、\s*仕事・社会参加設計の応用問題。/,
      }),
    ).toBeInTheDocument();
    const hero = screen.getByRole('region', {
      name: /障害者雇用・\s*難病就労支援から、\s*AI時代の仕事設計へ。/,
    });
    expect(within(hero).getByRole('link', { name: /サイト情報/ })).toHaveAttribute(
      'href',
      '/about-boundary',
    );
    expect(within(hero).queryByRole('link', { name: /プロジェクト/ })).not.toBeInTheDocument();
    expect(within(hero).getByRole('img', { name: /断片的な情報/ })).toHaveAttribute(
      'src',
      '/images/next-nbl-home-why-hero-imagegen-v1.png',
    );
    expect(screen.getByRole('img', { name: /働きづらさを仕事条件の地図へ変換/ })).toHaveAttribute(
      'src',
      '/images/next-nbl-home-hero-image2-v1.png',
    );
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
    expect(
      within(desktopNav).queryByRole('link', { name: 'プロジェクト' }),
    ).not.toBeInTheDocument();
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
