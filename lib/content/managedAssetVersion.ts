const MANAGED_ASSET_VERSION = '2026-03-23-1';

const MANAGED_ASSET_PREFIXES = [
  '/jac-foundations/',
  '/resources/invisible-disability/',
  '/resources/work-support-transformation/',
  '/review/invisible-disability/',
];

export function withManagedAssetVersion(src: string) {
  if (!MANAGED_ASSET_PREFIXES.some((prefix) => src.startsWith(prefix))) {
    return src;
  }

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=${MANAGED_ASSET_VERSION}`;
}
