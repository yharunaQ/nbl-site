import NextLink from 'next/link';
import { createContext, useCallback, useContext, type ComponentProps, type ReactNode } from 'react';
import { firstDayAssistance } from './workForkRoutes';

export type NextSiteLinkMode = 'preview' | 'isolated_root';
const NextSiteLinkModeContext = createContext<NextSiteLinkMode>('preview');
const NextSitePublishedContext = createContext(false);
const base = '/preview/axiom-next-nbl-v2';
export const NEXT_SITE_SAVED_GUIDE_HREF = '/references/work-design-guide-jeed-2026.html';
const rootSlugs = new Set([
  firstDayAssistance.slug,
  'public-collaboration',
  'edition-inspection',
  'edition-ict',
  'case-readings',
  'work-design-views-guide',
  'search',
  'articles-social-questions',
  'toolkit-studio',
  'work-condition-window',
  'theory-method-trust',
  'about-boundary',
  'support-organization-checklist',
  'practice-workbook',
  'projects',
]);

export function resolveNextSiteHref(href: string, mode: NextSiteLinkMode = 'preview'): string {
  if (mode === 'preview') return href;
  const carryoverAnchors: Record<string, string> = {
    '/work-design-views-guide#work-design-domain-relationship-evaluation-growth': '/work-design-views-guide?system=WDG2-09#guide-detail',
    '/work-design-views-guide#work-design-domain-pre-entry-transition': '/work-design-views-guide?system=WDG2-06#guide-detail',
    '/work-design-views-guide#work-design-domain-health-time-livelihood': '/work-design-views-guide?system=WDG2-04#guide-detail',
    '/work-design-views-guide#work-design-domain-cognitive-information-procedure': '/work-design-views-guide?system=WDG2-03#guide-detail',
    '/work-design-views-guide#work-design-domain-worksite-access-operations': '/work-design-views-guide?system=WDG2-05#guide-detail',
    '/case-readings#consultation-finder': '/case-readings#case-browser',
  };
  if (carryoverAnchors[href]) return carryoverAnchors[href];
  const split = href.search(/[?#]/);
  const path = split < 0 ? href : href.slice(0, split);
  const suffix = split < 0 ? '' : href.slice(split);
  if (path === base || path === `${base}/` || path === `${base}/home`) return `/${suffix}`;
  if (path === `${base}${NEXT_SITE_SAVED_GUIDE_HREF}`)
    return `${NEXT_SITE_SAVED_GUIDE_HREF}${suffix}`;
  if (!path.startsWith(`${base}/`)) return href;
  const slug = path.slice(base.length + 1);
  return rootSlugs.has(slug) ? `/${slug}${suffix}` : href;
}

export function AxiomNextSiteLinksProvider({
  mode = 'preview',
  published = false,
  children,
}: {
  mode?: NextSiteLinkMode;
  published?: boolean;
  children: ReactNode;
}) {
  return (
    <NextSitePublishedContext.Provider value={published}>
      <NextSiteLinkModeContext.Provider value={mode}>{children}</NextSiteLinkModeContext.Provider>
    </NextSitePublishedContext.Provider>
  );
}

export function useNextSitePublished() {
  return useContext(NextSitePublishedContext);
}

export function useNextSiteLinkMode() {
  return useContext(NextSiteLinkModeContext);
}

export function useNextSiteHref() {
  const mode = useNextSiteLinkMode();
  return useCallback((href: string) => resolveNextSiteHref(href, mode), [mode]);
}

export function AxiomNextSiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const resolveHref = useNextSiteHref();
  const resolvedHref =
    typeof href === 'string'
      ? resolveHref(href)
      : {
          ...href,
          pathname: href.pathname ? resolveHref(href.pathname) : href.pathname,
        };
  return <NextLink href={resolvedHref} {...props} />;
}
