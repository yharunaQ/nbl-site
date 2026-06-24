import { AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE } from './falconAxiomPublicSiteUpdatePlan';

export const AXIOM_NEXT_NBL_PUBLISHED_SLUGS = [
  'home',
  'scene-entry',
  'case-readings',
  'work-design-views-guide',
  'articles-social-questions',
  'toolkit-studio',
  'work-condition-window',
  'theory-method-trust',
  'about-boundary',
] as const;

export type AxiomNextNblPublishedSlug = (typeof AXIOM_NEXT_NBL_PUBLISHED_SLUGS)[number];

export function isAxiomNextNblPublishedSlug(slug: string): slug is AxiomNextNblPublishedSlug {
  return AXIOM_NEXT_NBL_PUBLISHED_SLUGS.includes(slug as AxiomNextNblPublishedSlug);
}

export function getAxiomNextNblPublishedPath(slug: string) {
  return slug === 'home' ? '/' : `/${slug}`;
}

export function rewriteAxiomCandidateHrefToPublished(href: string) {
  if (href === AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE) {
    return '/';
  }

  const prefix = `${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE}/`;

  if (!href.startsWith(prefix)) {
    return href;
  }

  const suffix = href.slice(prefix.length);
  const [slugAndQuery, hash = ''] = suffix.split('#');
  const [slug, query = ''] = slugAndQuery.split('?');
  const publishedPath = getAxiomNextNblPublishedPath(slug);
  const queryPart = query ? `?${query}` : '';
  const hashPart = hash ? `#${hash}` : '';

  return `${publishedPath}${queryPart}${hashPart}`;
}
