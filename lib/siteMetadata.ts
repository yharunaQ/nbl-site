const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextbeinglab.org';

export const SITE_NAME = 'Next Being Lab';
export const SITE_LOCALE = 'ja_JP';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');
export const DEFAULT_SOCIAL_IMAGE_PATH = '/api/og';
export const DEFAULT_SOCIAL_IMAGE_ALT = 'Next Being Lab — インクルーシブ就労支援の実践知識プラットフォーム';
export const DEFAULT_SOCIAL_IMAGE_WIDTH = 1200;
export const DEFAULT_SOCIAL_IMAGE_HEIGHT = 630;

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function buildSiteUrl(pathname: string = '/') {
  if (isAbsoluteUrl(pathname)) {
    return pathname;
  }

  const [pathWithoutQuery] = pathname.trim().split(/[?#]/, 1);
  const normalizedPath = pathWithoutQuery
    ? pathWithoutQuery.startsWith('/')
      ? pathWithoutQuery
      : `/${pathWithoutQuery}`
    : '/';

  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}

export const DEFAULT_SOCIAL_IMAGE_URL = buildSiteUrl(DEFAULT_SOCIAL_IMAGE_PATH);
