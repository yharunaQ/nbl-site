export const TEMPORARY_PUBLIC_SITE_ENABLED = true;
export type PublicHomeVariant = 'relaunch' | 'temporary';

export const PUBLIC_HOME_VARIANT: PublicHomeVariant = 'relaunch';

type RouteConfig = {
  prefix: string;
  slug: string;
  label: string;
  note: string;
  match?: 'exact' | 'prefix';
};

const TEMPORARY_PUBLIC_ROUTE_CONFIGS: RouteConfig[] = [
  {
    prefix: '/jac/guidebook',
    slug: 'jac-guidebook',
    label: '先行5章版アーカイブ',
    note: 'inactive pilot archive kept outside the active public path',
  },

  {
    prefix: '/dao-participation-lab',
    slug: 'dao-participation-lab',
    label: 'DAO Participation Lab',
    note: 'experimental collaboration workspace',
  },
];

const TEMPORARY_PUBLIC_API_PREFIXES = [
  '/api/dao-participation-lab',
  '/api/ebook',
] as const;

function matchesRoute(pathname: string, route: RouteConfig): boolean {
  if (route.match === 'exact') {
    return pathname === route.prefix;
  }

  const prefix = route.prefix;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getTemporaryPublicRoute(pathname: string): RouteConfig | null {
  for (const route of TEMPORARY_PUBLIC_ROUTE_CONFIGS) {
    if (matchesRoute(pathname, route)) {
      return route;
    }
  }

  return null;
}

export function isTemporarilyDisabledApiPath(pathname: string): boolean {
  return TEMPORARY_PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getTemporaryPublicRouteBySlug(slug: string): RouteConfig | null {
  return TEMPORARY_PUBLIC_ROUTE_CONFIGS.find((route) => route.slug === slug) ?? null;
}
