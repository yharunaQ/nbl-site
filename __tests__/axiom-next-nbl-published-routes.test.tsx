import { render, screen } from '@testing-library/react';
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

  it('defines all nine published public paths', () => {
    expect(AXIOM_NEXT_NBL_PUBLISHED_SLUGS.map((slug) => getAxiomNextNblPublishedPath(slug))).toEqual([
      '/',
      '/scene-entry',
      '/case-readings',
      '/work-design-views-guide',
      '/articles-social-questions',
      '/toolkit-studio',
      '/work-condition-window',
      '/theory-method-trust',
      '/about-boundary',
    ]);
  });
});
