import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  TEMPORARY_PUBLIC_SITE_ENABLED,
  getTemporaryPublicRoute,
  isTemporarilyDisabledApiPath,
} from './lib/publicSiteMode';

export function middleware(request: NextRequest) {
  if (!TEMPORARY_PUBLIC_SITE_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isTemporarilyDisabledApiPath(pathname)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Temporarily unavailable while the public site is being rebuilt.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const blockedRoute = getTemporaryPublicRoute(pathname);
  if (!blockedRoute) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/site-update/${blockedRoute.slug}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/jac',
    '/jac/:path*',
    '/dao-participation-lab',
    '/api/jac-assess',
    '/api/jac-assess-refinement',
    '/api/jac-tag-suggest',
    '/api/dao-participation-lab/:path*',
    '/api/ebook/:path*',
  ],
};
