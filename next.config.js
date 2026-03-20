/** @type {import('next').NextConfig} */
const MANAGED_ASSET_VERSION = '2026-03-20-1';

const nextConfig = {
  // Allow local cross-origin dev access (e.g. 127.0.0.1 -> localhost for /_next/* assets)
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/docs/:path*', destination: 'https://files.nextbeinglab.org/:path*' },
      { source: '/blog/:path*', destination: 'https://blog.nextbeinglab.org/:path*' },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '**',
        search: '',
      },
      {
        pathname: '/jac-foundations/**',
        search: `?v=${MANAGED_ASSET_VERSION}`,
      },
      {
        pathname: '/resources/invisible-disability/**',
        search: `?v=${MANAGED_ASSET_VERSION}`,
      },
      {
        pathname: '/review/invisible-disability/**',
        search: `?v=${MANAGED_ASSET_VERSION}`,
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};
module.exports = nextConfig;
